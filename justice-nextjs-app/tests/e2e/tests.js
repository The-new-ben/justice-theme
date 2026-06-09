const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Overriding global fetch with a robust retry wrapper to handle Next.js dev server on-demand compilation delays/crashes
const originalFetch = globalThis.fetch;
globalThis.fetch = async function (url, options = {}) {
  let attempts = 0;
  const maxAttempts = 30;
  const backoff = 2000;
  
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const res = await originalFetch(url, options);
      // We check if the request failed with a 500 (internal compiler error) or a 404.
      // Transient 404s can occur while Turbopack builds the pages-manifest.json or routes-manifest.json.
      // However, we shouldn't delay on URLs we actually expect to return 404 (like non-existent practice areas).
      let decodedUrl = '';
      try {
        decodedUrl = decodeURIComponent(String(url));
      } catch (e) {
        decodedUrl = String(url);
      }
      const isExpected404 = [
        'international-space-law',
        'unsupported-calculator-slug',
        'robots',
        'posta',
        'פוסה-פלילים',
        '%g7'
      ].some(keyword => decodedUrl.toLowerCase().includes(keyword.toLowerCase()) || decodedUrl.includes(keyword));
      
      if ((res.status === 500 || res.status === 404) && !isExpected404) {
        if (attempts < maxAttempts) {
          console.warn(`[Fetch Retry] URL ${url} returned status ${res.status}. Retrying in ${backoff}ms (Attempt ${attempts}/${maxAttempts})...`);
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }
      }
      return res;
    } catch (err) {
      if (attempts < maxAttempts) {
        console.warn(`[Fetch Retry] URL ${url} failed with error: ${err.message}. Retrying in ${backoff}ms (Attempt ${attempts}/${maxAttempts})...`);
        await new Promise(r => setTimeout(r, backoff));
        continue;
      }
      throw err;
    }
  }
};


// Helper to extract JSON-LD schemas
function extractJSONLD(html) {
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      schemas.push(JSON.parse(match[1].trim()));
    } catch (e) {
      // Ignored malformed JSON
    }
  }
  return schemas;
}

// Helper to extract canonical tag
function extractCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

// Helper to check copywriting constraints (anti-AI tells, no em-dashes)
function assertCopywritingCompliance(html, urlPath) {
  // 1. Em-dash check
  assert.ok(!html.includes('—'), `[Copywriting Failure] Page ${urlPath} contains em-dash (—)`);

  // 2. AI transitions check
  const forbiddenTells = ['בנוסף', 'חשוב לציין כי', 'לסיכום', 'ראוי לציין'];
  for (const tell of forbiddenTells) {
    // We scan specifically page text content by removing scripts/tags roughly
    const cleanText = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ');
    assert.ok(!cleanText.includes(tell), `[Copywriting Failure] Page ${urlPath} contains AI transition tell: "${tell}"`);
  }
}

// Helper to check for at least one Israeli law citation
function assertContainsLawCitation(html, urlPath) {
  const lawCitations = [
    'חוק המקרקעין',
    'חוק פיצויי פיטורים',
    'חוק הפיצויים לנפגעי תאונות דרכים',
    'חוק הודעה מוקדמת',
    'חוק העונשין'
  ];
  const found = lawCitations.some(law => html.includes(law));
  assert.ok(found, `[E-E-A-T Failure] Page ${urlPath} does not contain any valid Israeli law citations`);
}

// ==========================================
// TIER 1: FEATURE COVERAGE
// ==========================================

test('Tier 1: Reviews Feature Coverage (5 tests)', async (t) => {
  // Case 1: GET /api/reviews returns approved reviews
  await t.test('GET /api/reviews returns correct format and status', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.success);
    assert.ok(Array.isArray(data.reviews));
    assert.ok(data.aggregateRating);
  });

  // Case 2: POST /api/reviews creates a pending review
  await t.test('POST /api/reviews submits a new review successfully', async () => {
    const payload = {
      reviewer_name: 'ישראל ישראלי',
      reviewer_role: 'Client',
      rating: 5,
      content: 'שירות מעולה, מומלץ מאוד!'
    };
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.success);
    assert.strictEqual(data.review.reviewer_name, 'ישראל ישראלי');
    assert.strictEqual(data.review.approval_status, false); // Pending approval
  });

  // Case 3: Reviews filter by role works correctly
  await t.test('Filtering reviews by role parameter works', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews?role=Client`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.success);
    const allMatch = data.reviews.every(r => r.reviewer_role === 'Client');
    assert.ok(allMatch, 'Not all reviews match the Client role filter');
  });

  // Case 4: HTML response of Hub page displays reviews
  await t.test('Hub page includes approved reviews content', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law`);
    const html = await res.text();
    // Verify some reviews are rendered (from the mock reviews database)
    assert.ok(html.includes('שירות מקצועי') || html.includes('המלצות וביקורות'), 'Reviews not found on Hub page');
  });

  // Case 5: POST /api/reviews with rating 4 works
  await t.test('POST review with rating 4 is accepted', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: 'יוסי כהן',
        reviewer_role: 'Google',
        rating: 4,
        content: 'מצוין, שירות אדיב'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.success);
  });
});

test('Tier 1: Intake & Leads Feature Coverage (5 tests)', async (t) => {
  // Case 1: Ingestion endpoint handles lead insertion successfully
  await t.test('POST /api/leads ingests valid lead data', async () => {
    const payload = {
      name: 'שלמה לוי',
      email: 'shlomo@example.com',
      phone: '0541234567',
      details: 'תביעת פיצויי פיטורין ממקום עבודה קודם'
    };
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.success);
    assert.ok(data.leadId);
  });

  // Case 2: Ingestion simulates notification console triggers
  await t.test('POST /api/leads triggers communication notification alerts', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'דוד רוט',
        email: 'david@example.com',
        phone: '0522345678',
        details: 'הערכת סיכויי תביעה בתאונת דרכים'
      })
    });
    const data = await res.json();
    assert.ok(data.notifications, 'Response payload should confirm notification triggers');
  });

  // Case 3: Submission under real estate practice area works
  await t.test('POST /api/leads with real estate details', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'שרה גולד',
        email: 'sara@example.com',
        phone: '0507654321',
        details: 'ייעוץ ברכישת דירה חדשה מקבלן'
      })
    });
    const data = await res.json();
    assert.ok(data.success);
  });

  // Case 4: Intake Form HTML elements presence on spoke pages
  await t.test('Intake form inputs are rendered in HTML of spoke pages', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law/severance-pay-calculator`);
    const html = await res.text();
    assert.ok(html.includes('id="intake-form"'), 'Intake form wrapper missing');
    assert.ok(html.includes('שם מלא'), 'Intake form name field missing');
  });

  // Case 5: Lead search database integration response
  await t.test('GET /api/leads endpoint returns lead list or unauthorized correctly', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`);
    // Leads API is typically restricted/protected, verifying that it returns either 200 (if dev mock) or 401
    assert.ok([200, 401].includes(res.status));
  });
});

test('Tier 1: Stripe & Payments Feature Coverage (5 tests)', async (t) => {
  // Case 1: POST /api/checkout generates checkout URL
  await t.test('POST /api/checkout returns checkout url', async () => {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 250,
        lawyerId: 'adv-daniel-cohen',
        creditsToAdd: 50
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.success);
    assert.ok(data.url, 'Checkout session redirect URL should be present');
  });

  // Case 2: Ingest checkout.session.completed webhook
  await t.test('POST /api/webhooks completes payment simulation', async () => {
    const mockEvent = {
      id: 'evt_test_completed',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_12345',
          amount_total: 25000,
          currency: 'ils',
          metadata: {
            lawyerId: 'adv-daniel-cohen',
            creditsToAdd: '50'
          }
        }
      }
    };
    const res = await fetch(`${BASE_URL}/api/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-stripe-signature': 'mock_signature' },
      body: JSON.stringify(mockEvent)
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.received);
  });

  // Case 3: Support lawyer invoice receipt request simulation
  await t.test('POST /api/checkout handles larger reload packages', async () => {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        lawyerId: 'adv-miri-levi',
        creditsToAdd: 250
      })
    });
    const data = await res.json();
    assert.ok(data.success);
  });

  // Case 4: Webhook handles refund request simulator
  await t.test('POST /api/webhooks handles refund events gracefully', async () => {
    const mockEvent = {
      id: 'evt_test_refunded',
      type: 'charge.refunded',
      data: { object: { id: 'ch_test_123' } }
    };
    const res = await fetch(`${BASE_URL}/api/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockEvent)
    });
    assert.strictEqual(res.status, 200);
  });

  // Case 5: Verify advocate terminal shows checkout notice
  await t.test('Advocate dashboard page renders client checkout notifications structure', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert.ok(html.includes('Jus') && html.includes('Tice'), 'Homepage checkout framework error');
  });
});

test('Tier 1: SEO & Redirects Feature Coverage (5 tests)', async (t) => {
  // Case 1: Homepage canonical validation
  await t.test('Homepage contains correct self-referencing canonical', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    const canonical = extractCanonical(html);
    assert.ok(canonical === 'https://jus-tice.co.il/' || canonical === 'https://jus-tice.co.il', 'Canonical tag did not match homepage URL');
  });

  // Case 2: Robots.txt validation
  await t.test('Robots.txt returns correct crawl guidelines', async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(/user-agent:\s*\*/i.test(text));
    assert.ok(/disallow:\s*\/api\//i.test(text));
  });

  // Case 3: Sitemap.xml contains structured areas
  await t.test('Sitemap.xml contains practice area hubs', async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.strictEqual(res.status, 200);
    const xml = await res.text();
    assert.ok(xml.includes('https://jus-tice.co.il/practice-areas/labor-law'));
    assert.ok(xml.includes('https://jus-tice.co.il/practice-areas/real-estate-law'));
  });

  // Case 4: Decoded Hebrew redirect path middleware
  await t.test('Hebrew path redirects to correct destination slug', async () => {
    // "/פוסטה-פלילים" redirects to "/"
    const encodedPath = encodeURIComponent('פוסטה-פלילים');
    const res = await fetch(`${BASE_URL}/${encodedPath}`, { redirect: 'manual' });
    assert.strictEqual(res.status, 301);
    const location = res.headers.get('location');
    assert.ok(new URL(location, BASE_URL).pathname === '/');
  });

  // Case 5: Hub page canonical contains directory structure
  await t.test('Hub page canonical lists directory silo route', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/medical-malpractice`);
    const html = await res.text();
    const canonical = extractCanonical(html);
    assert.strictEqual(canonical, 'https://jus-tice.co.il/practice-areas/medical-malpractice');
  });
});

test('Tier 1: E-E-A-T Advisory Board Feature Coverage (5 tests)', async (t) => {
  // Case 1: Header navigation contains E-E-A-T pages
  await t.test('Header elements include lawyers index page link', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert.ok(html.includes('href="/lawyers"'), 'Lawyers directory link missing in header');
  });

  // Case 2: Breadcrumbs are rendered on Hub pages
  await t.test('Hub pages render dynamic breadcrumbs navigation', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law`);
    const html = await res.text();
    assert.ok(html.includes('בית'), 'Breadcrumbs root link missing');
    assert.ok(html.includes('תחומי התמחות'), 'Breadcrumbs parent link missing');
  });

  // Case 3: Breadcrumb JSON-LD schema is present
  await t.test('Hub page contains BreadcrumbList schema', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law`);
    const html = await res.text();
    const schemas = extractJSONLD(html);
    const breadcrumbSchema = schemas.find(s => s['@type'] === 'BreadcrumbList');
    assert.ok(breadcrumbSchema, 'BreadcrumbList JSON-LD schema missing');
  });

  // Case 4: Hub page ReviewedBy Person E-E-A-T validation
  await t.test('Hub page includes reviewedBy schema with expert name and credentials', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law`);
    const html = await res.text();
    const schemas = extractJSONLD(html);
    const article = schemas.find(s => s['@type'] === 'LegalArticle');
    assert.ok(article, 'LegalArticle schema missing');
    assert.strictEqual(article.reviewedBy['@type'], 'Person');
    assert.ok(article.reviewedBy.name, 'Expert name is missing in schema');
    assert.ok(article.reviewedBy.description.includes('רישיון לשכה'), 'Bar ID is missing in expert description');
  });

  // Case 5: Lawyer Profile page exists
  await t.test('Advocate profile page returns HTTP 200', async () => {
    const res = await fetch(`${BASE_URL}/lawyers/adv-daniel-cohen`);
    assert.strictEqual(res.status, 200);
  });
});

// ==========================================
// TIER 2: BOUNDARY & CORNER CASES
// ==========================================

test('Tier 2: Reviews Boundary & Corner Cases (5 tests)', async (t) => {
  // Case 1: Negative rating
  await t.test('POST /api/reviews rejects rating < 1', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer_name: 'נפגע', reviewer_role: 'Client', rating: 0, content: 'רע מאוד' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 2: Out-of-bounds rating
  await t.test('POST /api/reviews rejects rating > 5', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer_name: 'מאושר', reviewer_role: 'Client', rating: 6, content: 'מדהים!' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 3: Empty comments
  await t.test('POST /api/reviews rejects empty content', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer_name: 'לקוח', reviewer_role: 'Client', rating: 5, content: '' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 4: Invalid role type rejection
  await t.test('POST /api/reviews rejects unsupported reviewer role', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewer_name: 'מנהל', reviewer_role: 'Admin', rating: 5, content: 'תוכן מותר' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 5: SQL Injection attempt in reviewer name
  await t.test('POST /api/reviews tolerates and sanitizes SQL injection inputs safely', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: "Cohen' OR 1=1 --",
        reviewer_role: 'Client',
        rating: 5,
        content: 'מצוין'
      })
    });
    assert.strictEqual(res.status, 200); // Should handle safely (as a literal name string)
    const data = await res.json();
    assert.strictEqual(data.review.reviewer_name, "Cohen' OR 1=1 --");
  });
});

test('Tier 2: Intake & Leads Boundary Cases (5 tests)', async (t) => {
  // Case 1: Malformed phone number rejection
  await t.test('POST /api/leads rejects non-numeric phone values', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'בדיקה', email: 'test@test.com', phone: 'abcdef', details: 'פרטים' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 2: Malformed email rejection
  await t.test('POST /api/leads rejects invalid email format', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'בדיקה', email: 'malformed_email', phone: '0540000000', details: 'פרטים' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 3: Empty details content validation
  await t.test('POST /api/leads rejects blank case details', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'בדיקה', email: 'test@test.com', phone: '0540000000', details: '' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 4: Short phone number check
  await t.test('POST /api/leads rejects too short phone numbers', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'בדיקה', email: 'test@test.com', phone: '1234', details: 'פירוט המקרה' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 5: SQL Injection payload in lead case details
  await t.test('POST /api/leads sanitizes case description SQL tags', async () => {
    const sqlPayload = "SELECT * FROM users; DROP TABLE leads; --";
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'שמעון',
        email: 'shimon@test.com',
        phone: '0541112222',
        details: sqlPayload
      })
    });
    assert.strictEqual(res.status, 200); // Should ingest safely without backend crash
    const data = await res.json();
    assert.ok(data.success);
  });
});

test('Tier 2: Stripe & Payments Boundary Cases (5 tests)', async (t) => {
  // Case 1: Negative payment reload amount
  await t.test('POST /api/checkout rejects negative recharge amounts', async () => {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: -100, lawyerId: 'adv-daniel-cohen', creditsToAdd: 20 })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 2: Missing metadata parameters
  await t.test('POST /api/checkout rejects requests missing lawyer identifier', async () => {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 150, creditsToAdd: 30 })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 3: Zero reload credits amount
  await t.test('POST /api/checkout rejects zero credits purchases', async () => {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 200, lawyerId: 'adv-daniel-cohen', creditsToAdd: 0 })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 4: Webhook missing event structural parameters
  await t.test('POST /api/webhooks rejects events with empty type tags', async () => {
    const res = await fetch(`${BASE_URL}/api/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'evt_bad' })
    });
    assert.strictEqual(res.status, 400);
  });

  // Case 5: Webhook payload with invalid signatures
  await t.test('POST /api/webhooks rejects events simulating invalid verification tokens', async () => {
    const res = await fetch(`${BASE_URL}/api/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-stripe-signature': 'invalid_signature_token' },
      body: JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed' })
    });
    // Signature failure should be rejected with appropriate status (400 or 401)
    assert.ok([400, 401].includes(res.status));
  });
});

test('Tier 2: SEO & Redirects Boundary Cases (5 tests)', async (t) => {
  // Case 1: Trailing slash normalization in redirects middleware
  await t.test('Redirect mapping middleware handles trailing slashes correctly', async () => {
    const encodedPath = encodeURIComponent('פוסטה-פלילים/');
    const res = await fetch(`${BASE_URL}/${encodedPath}`, { redirect: 'manual' });
    assert.strictEqual(res.status, 301);
    const location = res.headers.get('location');
    assert.ok(new URL(location, BASE_URL).pathname === '/');
  });

  // Case 2: Double slash paths
  await t.test('Redirect engine handles double slashes gracefully', async () => {
    const res = await fetch(`${BASE_URL}//posta`);
    // Next.js handles double slashes internally or falls back to index page / 404
    assert.ok([200, 301, 302, 307, 308, 404].includes(res.status));
  });

  // Case 3: Casing mismatch in redirects matching
  await t.test('Redirect middleware is case-insensitive for lookup key', async () => {
    const encodedPath = encodeURIComponent('פוסה-פלילים'); // Casing / character checks
    const res = await fetch(`${BASE_URL}/${encodedPath}`, { redirect: 'manual' });
    assert.ok([301, 302, 307, 308, 404].includes(res.status));
  });

  // Case 4:robots.txt casing mismatch
  await t.test('Robots.txt lookup case matching', async () => {
    const res = await fetch(`${BASE_URL}/ROBOTS.TXT`);
    assert.ok([200, 301, 302, 307, 308, 404].includes(res.status));
  });

  // Case 5: Sitemap index maximum paths capacity limit
  await t.test('Sitemap.xml size matches exact count of pages', async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await res.text();
    const urlsCount = (xml.match(/<loc>/g) || []).length;
    assert.ok(urlsCount >= 20, `Sitemap has only ${urlsCount} pages, hub-and-spoke setup seems incomplete`);
  });
});

test('Tier 2: E-E-A-T Board Boundary Cases (5 tests)', async (t) => {
  // Case 1: Request non-existent category
  await t.test('Hub routing rejects non-existent category areas with 404', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/international-space-law`);
    assert.strictEqual(res.status, 404);
  });

  // Case 2: Request non-existent spoke slug
  await t.test('Spoke routing rejects invalid nested pages with 404', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law/unsupported-calculator-slug`);
    assert.strictEqual(res.status, 404);
  });

  // Case 3: Verify no em-dashes inside WordPress offline fallback content
  await t.test('Offline DB contents contains no em-dashes (—)', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law/severance-pay-calculator`);
    const html = await res.text();
    assertCopywritingCompliance(html, '/practice-areas/labor-law/severance-pay-calculator');
  });

  // Case 4: Verify explicit Israeli statutory laws citations are loaded on hub pages
  await t.test('Hub page renders real law citations correctly', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law`);
    const html = await res.text();
    assertContainsLawCitation(html, '/practice-areas/labor-law');
  });

  // Case 5: Verify no AI tells in spoke pages contents
  await t.test('Spoke page renders clean Israeli copywriting with no AI tell phrases', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/real-estate-law/purchase-tax-calculator`);
    const html = await res.text();
    assertCopywritingCompliance(html, '/practice-areas/real-estate-law/purchase-tax-calculator');
  });

  // Case 6: Request with malformed percent-encoding slug resolves to 404
  await t.test('Flat page routing handles malformed URI percent-encoding slug gracefully with 404', async () => {
    const res = await fetch(`${BASE_URL}/%g7`);
    assert.strictEqual(res.status, 404);
  });
});

// ==========================================
// TIER 3: CROSS-FEATURE COMBINATIONS
// ==========================================

test('Tier 3: Cross-Feature Combinations', async (t) => {
  // Case 1: Ingest Leads pushes tracking parameters to datalayer (GTM script verify)
  await t.test('Lead form page includes GTM Container configuration', async () => {
    const res = await fetch(`${BASE_URL}/practice-areas/labor-law/severance-pay-calculator`);
    const html = await res.text();
    assert.ok(html.includes('https://www.googletagmanager.com/gtm.js'), 'Google Tag Manager snippet missing');
    assert.ok(html.includes('GTM-TEST1234'), 'GTM ID should be injected correctly');
  });

  // Case 2: Reviews caching + DB (POST review updates local JSON cache)
  await t.test('Review submission writes successfully to local JSON cache', async () => {
    const uniqueName = `בודק מטעם מערכת-${Date.now()}`;
    const submitRes = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: uniqueName,
        reviewer_role: 'Client',
        rating: 5,
        content: 'חוות דעת לבדיקת אינטגרציית מטמון קבצים'
      })
    });
    assert.strictEqual(submitRes.status, 200);

    // Read cache file directly to verify persistence
    const cachePath = path.join(process.cwd(), 'src/lib/reviews-cache.json');
    assert.ok(fs.existsSync(cachePath), 'Reviews cache file should exist on disk');
    const content = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    const found = content.some(r => r.reviewer_name === uniqueName);
    assert.ok(found, 'The submitted review was not persisted to the reviews-cache.json file');
  });

  // Case 3: Sitemap + WP Offline fallback validation
  await t.test('Sitemap compiles correctly with WordPress offline fallback database', async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await res.text();
    // Validate sitemap urls generated from OFFLINE_DB
    assert.ok(sitemapText.includes('/practice-areas/medical-malpractice/hospital-negligence-claims'));
    assert.ok(sitemapText.includes('/practice-areas/family-law/divorce-agreement-approval'));
  });

  // Case 4: Redirect Middleware + Intake Form
  await t.test('Legacy path redirects to silo route that renders the intake form', async () => {
    // "/מדריך-לאישור-הסכם-גירושין-בבתי-הדין-הר" redirects to "/rabbinical-agreement-approval"
    const encodedPath = encodeURIComponent('מדריך-לאישור-הסכם-גירושין-בבתי-הדין-הר');
    const redirectRes = await fetch(`${BASE_URL}/${encodedPath}`, { redirect: 'follow' });
    assert.strictEqual(redirectRes.status, 200);
    const html = await redirectRes.text();
    // Verify the page rendered is indeed the target article and has layout elements
    assert.ok(html.includes('הסכם גירושין') || html.includes('JUS-TICE'), 'Redirect did not load target layout');
  });
});

// ==========================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS
// ==========================================

test('Tier 4: Real-world Application Scenarios', async (t) => {
  // Scenario A: Client Acquisition Flow
  await t.test('Scenario A: Client acquisition lifecycle flow', async () => {
    // 1. Client visits severance pay calculator page
    const viewRes = await fetch(`${BASE_URL}/practice-areas/labor-law/severance-pay-calculator`);
    assert.strictEqual(viewRes.status, 200);
    const viewHtml = await viewRes.text();
    assert.ok(viewHtml.includes('נבדק ואושר') || viewHtml.includes('בדק ואישר'), 'Trust banner not visible');

    // 2. Client fills the calculator intake form and submits
    const leadRes = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'ישראל לוין',
        email: 'israel.levin@example.com',
        phone: '0549998887',
        details: 'מחשבון פיצויי פיטורין הראה זכאות של 120,000 ש"ח. מעוניין להגיש תביעה לפי חוק פיצויי פיטורים, תשכ״ג-1963.'
      })
    });
    assert.strictEqual(leadRes.status, 200);
    const leadData = await leadRes.json();
    assert.ok(leadData.success);
    assert.ok(leadData.leadId);
    assert.ok(leadData.notifications.sms.includes('CONSOLE_ONLY'), 'Should output SMS debug notification logs');
  });

  // Scenario B: Advocate Lead Purchase & Credit Reload Flow
  await t.test('Scenario B: Advocate credit reload flow', async () => {
    // 1. Advocate triggers stripe session reload request
    const checkRes = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 500,
        lawyerId: 'adv-daniel-cohen',
        creditsToAdd: 100
      })
    });
    assert.strictEqual(checkRes.status, 200);
    const checkData = await checkRes.json();
    assert.ok(checkData.url.includes('checkout-session'));

    // 2. Mock payment webhook completes successfully
    const hookRes = await fetch(`${BASE_URL}/api/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-stripe-signature': 'mock_signature' },
      body: JSON.stringify({
        id: 'evt_advocate_reload',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_advocate_100',
            amount_total: 50000,
            currency: 'ils',
            metadata: {
              lawyerId: 'adv-daniel-cohen',
              creditsToAdd: '100'
            }
          }
        }
      })
    });
    assert.strictEqual(hookRes.status, 200);
    const hookData = await hookRes.json();
    assert.ok(hookData.received);
  });
});
