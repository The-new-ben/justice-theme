const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Extractor Helpers
function extractSitemapUrls(xml) {
  const regex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

function extractCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractJSONLD(html) {
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const jsonBlocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    jsonBlocks.push(match[1]);
  }
  return jsonBlocks;
}

// Global fetch wrapper with redirect tracking
async function fetchWithRedirects(url, options = {}) {
  const redirectHistory = [];
  let currentUrl = url;
  let response = null;
  const maxRedirects = 10;
  
  for (let i = 0; i < maxRedirects; i++) {
    response = await fetch(currentUrl, { ...options, redirect: 'manual' });
    if ([301, 302, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) {
        throw new Error(`Redirect status ${response.status} returned without Location header at URL: ${currentUrl}`);
      }
      
      const targetUrl = new URL(location, currentUrl).toString();
      redirectHistory.push({
        from: currentUrl,
        to: targetUrl,
        status: response.status
      });
      currentUrl = targetUrl;
    } else {
      break;
    }
  }
  
  return {
    response,
    finalUrl: currentUrl,
    redirectHistory
  };
}

// ==========================================
// SECTION 1: REDIRECTS & MIDDLEWARE INTEGRITY
// ==========================================

test('Redirects: Verify no broken redirect targets (404s)', async () => {
  const redirectMapPath = path.join(process.cwd(), 'src/lib/redirect-map.json');
  assert.ok(fs.existsSync(redirectMapPath), 'redirect-map.json must exist');
  const redirectMap = JSON.parse(fs.readFileSync(redirectMapPath, 'utf8'));

  // Sample a set of redirects to test (we select some Hebrew ones, query params, etc.)
  const sampleKeys = [
    '/פוסטה-פלילים',
    '/מדריך-לאישור-הסכם-גירושין-בבתי-הדין-הר',
    '/experienced-family-law-attorney',
    '/מדריך-רישום-בית-משותף',
    '/חישוב-מס-רכישה-2026'
  ].filter(key => redirectMap[key] || redirectMap[key + '/']);

  for (const key of sampleKeys) {
    const sourceUrl = `${BASE_URL}${encodeURI(key)}`;
    const { response, finalUrl, redirectHistory } = await fetchWithRedirects(sourceUrl);
    
    assert.ok(redirectHistory.length > 0, `Path ${key} should trigger a redirect`);
    
    // Verify redirect target does not return 404/500
    const finalRes = await fetch(finalUrl);
    assert.strictEqual(finalRes.status, 200, `Redirect target ${finalUrl} for source ${key} returned broken status ${finalRes.status}`);
  }
});

test('Redirects: Verify no multi-step redirect chains', async () => {
  const redirectMapPath = path.join(process.cwd(), 'src/lib/redirect-map.json');
  const redirectMap = JSON.parse(fs.readFileSync(redirectMapPath, 'utf8'));

  // Test a known spoke page redirect
  // '/מדריך-לאישור-הסכם-גירושין-בבתי-הדין-הר' redirects to '/rabbinical-agreement-approval'
  // but '/rabbinical-agreement-approval' is a spoke, so Next.js redirects to '/practice-areas/family-law/rabbinical-agreement-approval'
  const sourcePath = '/מדריך-לאישור-הסכם-גירושין-בבתי-הדין-הר';
  const sourceUrl = `${BASE_URL}${encodeURI(sourcePath)}`;
  const { redirectHistory } = await fetchWithRedirects(sourceUrl);

  // Assert redirect chain length is exactly 1 (directly to target) to protect crawl budget
  assert.strictEqual(
    redirectHistory.length,
    1,
    `Redirect chain detected for ${sourcePath}! Hops: ${redirectHistory.length}. Chain: ${redirectHistory.map(h => h.from + ' -> ' + h.to).join(', ')}`
  );
});

// ==========================================
// SECTION 2: SITEMAP INTEGRITY
// ==========================================

test('Sitemap: Verify all URLs return 200 OK and do not redirect', async () => {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  assert.strictEqual(res.status, 200, 'Sitemap.xml should return 200 OK');
  const xml = await res.text();
  const urls = extractSitemapUrls(xml);
  
  assert.ok(urls.length > 0, 'Sitemap should contain URLs');

  for (const url of urls) {
    const testUrl = url.replace('https://jus-tice.co.il', BASE_URL);
    const { response, redirectHistory } = await fetchWithRedirects(testUrl);
    
    assert.strictEqual(response.status, 200, `Sitemap URL ${url} returned error status ${response.status}`);
    assert.strictEqual(redirectHistory.length, 0, `Sitemap URL ${url} redirected to ${redirectHistory[0]?.to}. Sitemap URLs must not redirect!`);
  }
});

// ==========================================
// SECTION 3: CANONICAL ALIGNMENT
// ==========================================

test('SEO: Verify canonical tags match sitemap URLs exactly (No trailing slash mismatch)', async () => {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  const xml = await res.text();
  const sitemapUrls = extractSitemapUrls(xml);

  // Check homepage canonical tag
  const homeRes = await fetch(`${BASE_URL}/`);
  const homeHtml = await homeRes.text();
  const homeCanonical = extractCanonical(homeHtml);

  // Get homepage URL from sitemap
  const homeSitemapUrl = sitemapUrls.find(url => url === 'https://jus-tice.co.il' || url === 'https://jus-tice.co.il/');
  assert.ok(homeSitemapUrl, 'Homepage must be listed in sitemap');
  assert.strictEqual(homeCanonical, homeSitemapUrl, `Homepage canonical mismatch! Canonical: "${homeCanonical}", Sitemap: "${homeSitemapUrl}"`);

  // Test a subset of sitemap URLs to verify canonical self-referencing consistency
  const sampleUrls = sitemapUrls.filter(url => url !== 'https://jus-tice.co.il' && url !== 'https://jus-tice.co.il/');
  for (const url of sampleUrls.slice(0, 5)) {
    const localUrl = url.replace('https://jus-tice.co.il', BASE_URL);
    const pageRes = await fetch(localUrl);
    const pageHtml = await pageRes.text();
    const canonical = extractCanonical(pageHtml);
    
    assert.strictEqual(canonical, url, `Canonical tag "${canonical}" on page ${localUrl} does not match sitemap entry "${url}"`);
  }
});

// ==========================================
// SECTION 4: E-E-A-T SCHEMA & BAR ID INTEGRITY
// ==========================================

test('E-E-A-T: Verify Bar ID format for all review experts', () => {
  const { experts } = require('../../src/lib/experts');
  assert.ok(Array.isArray(experts), 'Experts list must be loaded');

  for (const expert of experts) {
    if (expert.barId) {
      assert.ok(/^\d+$/.test(expert.barId), `Expert ${expert.name} has invalid non-numeric Bar ID: "${expert.barId}"`);
      assert.ok(expert.barId.length >= 4 && expert.barId.length <= 7, `Expert ${expert.name} has suspicious Bar ID length: "${expert.barId}"`);
    }
  }
});

test('E-E-A-T: Verify JSON-LD scripts are secure against script termination (XSS)', async () => {
  const res = await fetch(`${BASE_URL}/lawyers/adv-daniel-cohen`);
  assert.strictEqual(res.status, 200);
  const html = await res.text();
  
  const jsonBlocks = extractJSONLD(html);
  assert.ok(jsonBlocks.length > 0, 'Should find at least one JSON-LD block');

  for (const block of jsonBlocks) {
    assert.ok(!block.includes('</script>'), 'JSON-LD content contains unescaped </script> tag termination sequence!');
  }
});

// ==========================================
// SECTION 5: COPYWRITING & LEGAL STANDARDS
// ==========================================

test('Copywriting: Verify no em-dashes (—) or AI transition phrases in static pages', async () => {
  const staticPages = ['/about-us', '/contact', '/advisory-board'];
  const forbiddenTells = ['בנוסף', 'חשוב לציין כי', 'לסיכום', 'ראוי לציין'];

  for (const page of staticPages) {
    const res = await fetch(`${BASE_URL}${page}`);
    if (res.status !== 200) {
      console.warn(`⚠️  Static page ${page} returned status ${res.status}. Skipping copywriting check.`);
      continue;
    }
    const html = await res.text();
    
    const cleanText = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ');

    assert.ok(!cleanText.includes('—'), `Page ${page} contains forbidden em-dash (—)`);

    for (const tell of forbiddenTells) {
      assert.ok(!cleanText.includes(tell), `Page ${page} contains AI copywriting tell: "${tell}"`);
    }
  }
});

test('Copywriting: Verify Israeli law citations presence on hub pages', async () => {
  const hubPages = [
    '/practice-areas/labor-law',
    '/practice-areas/real-estate-law',
    '/practice-areas/family-law'
  ];
  const lawKeywords = [
    'חוק המקרקעין',
    'חוק פיצויי פיטורים',
    'חוק הפיצויים לנפגעי תאונות דרכים',
    'חוק הודעה מוקדמת',
    'חוק העונשין',
    'חוק בית המשפט לענייני משפחה',
    'חוק יחסי ממון'
  ];

  for (const page of hubPages) {
    const res = await fetch(`${BASE_URL}${page}`);
    assert.strictEqual(res.status, 200, `Hub page ${page} must return 200 OK`);
    const html = await res.text();

    const hasLawCitation = lawKeywords.some(keyword => html.includes(keyword));
    assert.ok(hasLawCitation, `Hub page ${page} does not contain any valid Israeli law citations or statutory links`);
  }
});

