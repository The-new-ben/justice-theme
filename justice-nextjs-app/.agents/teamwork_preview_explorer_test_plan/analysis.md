# E2E Testing Strategy Plan — JUS-TICE Legal Tech Portal

This document outlines a comprehensive End-to-End (E2E) testing strategy for the **JUS-TICE Legal Tech Portal**. It is based on a read-only codebase inspection of the Next.js application, focusing on high-priority components: the multi-source review system, lead intake funnels, Stripe integration, programmatic SEO, and E-E-A-T Advisory Board structured data.

---

## 1. Codebase Inspection & Findings

### 1.1 Multi-Source Review System
*   **Current State in Codebase**:
    *   **Frontend UI & Mocking**: The verified lawyers list on the homepage (`src/app/page.js`, lines 2382–2446) currently displays hardcoded rating text (`⭐ 4.9 (148 חוות דעת)` for Daniel Cohen and `⭐ 4.8 (92 חוות דעת)` for Meital Levi). The AI evaluator simulation also returns hardcoded ratings for matched lawyers (lines 420–425).
    *   **Data Models & Endpoints**: There are currently **no** database tables, queries, or API routes for reviews under `src/app/api`.
    *   **JSON-LD Structured Data**: In `src/app/[slug]/page.js` (lines 31-54), the page injects a generic `LegalArticle` schema featuring a `reviewedBy` node pointing to a placeholder person named `עורך דין מוסמך (בעל האתר)`.
*   **Target Implementation Architecture**:
    *   A `reviews` table in Supabase containing `id`, `lawyer_id`, `source` (enum: `'client' | 'colleague' | 'google'`), `rating` (numeric), `review_text`, `author_name`, `created_at`, and `status` (enum: `'pending' | 'approved'`).
    *   API routes at `/api/reviews/route.js` (GET to fetch cached reviews, POST to submit reviews) and `/api/admin/reviews/route.js` (PUT/DELETE for moderator approval).
    *   Dynamic generation of `AggregateRating` and `Review` schema elements for lawyers' profile pages based on approved reviews in the database.

### 1.2 Intake Forms, Leads Pipeline, Stripe, and GTM
*   **Intake Forms**:
    *   The app has four distinct intake entry points in `src/app/page.js`:
        1.  *AI Evaluator Flow* (Tab 1, lines 1256-1362) with interactive collision hot-spots that auto-populate details.
        2.  *Bituach Leumi Appeal Calculator* (Tab 2, lines 528-631) collecting name, phone, email, and conditions.
        3.  *Severance & Tax-Back Calculator* (Tab 3, lines 633-710) collecting date ranges, salary, name, phone, and email.
        4.  *Small Claims Form Generator* (Tab 6, lines 800-853) which generates a claim sheet and validates claims under the statutory limit of ₪38,900.
*   **Leads Endpoint (`src/app/api/leads/route.js`)**:
    *   Validates mandatory fields (`title`, `clientName`, `clientPhone`).
    *   If Supabase is connected, inserts records into the `leads` table.
    *   Sends a client email via Resend and an administrator SMS via Twilio (`src/lib/notifications.js`).
    *   If offline, the frontend falls back to standard client-side `localStorage` persistence (lines 251-274).
*   **Stripe Checkout (`src/app/api/checkout/route.js`)**:
    *   Handles POST requests to create checkout sessions.
    *   If `STRIPE_SECRET_KEY` is not present, it automatically returns a simulated success redirect URL containing URL search params (`session_id`, `mock_amount`, `mock_type`).
    *   On page load, `page.js` intercepts this redirect (lines 197-229) to add lawyer credits or confirm letter review submissions.
*   **Stripe Webhooks (`src/app/api/webhooks/route.js`)**:
    *   Listens for `checkout.session.completed`.
    *   If `metadata.type === 'credits'`, updates the `profiles` table to increment lawyer credits.
    *   If `metadata.type === 'document_review'`, updates the `leads` table to set `payment_status` to `'paid'` and `lead_status` to `'routable'`.
    *   If webhook signature secrets are missing, it processes raw payloads without signature verification.
*   **GTM & dataLayer**:
    *   `src/app/layout.js` (lines 20-38) loads the GTM script container if `NEXT_PUBLIC_GTM_ID` is present.
    *   It initiates the basic tracking code by pushing the `gtm.js` event to `window.dataLayer`.
    *   *Observation*: There are currently no explicit, manual `window.dataLayer.push()` triggers inside the frontend submission handlers in `page.js`. E2E tests must verify their presence once conversion triggers are added.

### 1.3 Programmatic SEO
*   **Sitemap (`src/app/sitemap.js`)**:
    *   Performs parallel fetching of static page slugs, blog posts, and lawyers from the WordPress GraphQL API (`https://jus-tice.co.il/graphql` or configured variable).
    *   Generates a dynamic list of URL objects with priority ranks.
    *   Catches API fetch errors, falling back to basic routes so the sitemap never breaks.
*   **Robots (`src/app/robots.js`)**:
    *   Controls search crawl rules: allows everything except `/api/`, `/_next/`, and `/private/`.
    *   Dynamically links the sitemap to `https://jus-tice.co.il/sitemap.xml`.
*   **Canonical Tags**:
    *   `src/app/layout.js` defines a base URL of `https://jus-tice.co.il` with canonical set to `/`.
    *   `src/app/[slug]/page.js` generates a canonical link tag matching the dynamic decoded path (lines 14-16).
*   **Redirection Middleware (`src/middleware.js`)**:
    *   Intercepts incoming requests. Decodes Hebrew encoded paths (such as `%D7%9E...` to matching characters).
    *   Performs lookup in `src/lib/redirect-map.json` (which maps over 2,250 legacy URLs with slash and no-slash variations).
    *   Executes a 301 Permanent Redirect to modernized paths, preserving URL query parameters.

### 1.4 E-E-A-T Advisory Board
*   **Current State in Code**:
    *   The schema script inside `src/app/[slug]/page.js` injects standard article schema, but uses a generic fallback reviewer `Person` instead of individual experts.
    *   The list of 20 experts (Rand Fishkin, Danny Sullivan, etc.) is not yet modeled in the codebase.
*   **Target Architecture**:
    *   An advisory database schema or configuration map containing expert names, credentials, לשכת עורכי הדין IDs, sameAs profiles (e.g., LinkedIn/Wikipedia), and specialties.
    *   Dynamic injection into `reviewedBy` node based on WordPress metadata or URL slug category (e.g. Rand Fishkin linked to SEO articles, Meital Levi linked to family law articles).

---

## 2. 4-Tier E2E Testing Scope

We define five key features to target:
1.  **Review Management** (R1)
2.  **Lead Funnels** (R2)
3.  **Payment Processing** (R2)
4.  **Programmatic SEO** (R2)
5.  **Advisory Board Credentials** (R3)

### Tier 1: Feature Coverage (>=5 test cases per feature)

#### Feature 1: Review Management
*   **TC1.1**: Submit client review successfully through the form and verify it goes to the database with a `pending` status.
*   **TC1.2**: Submit colleague review and verify it saves with correct author and source categorization in the database.
*   **TC1.3**: Admin review approval: Check that approved reviews transition database status to `approved` and appear on the lawyer directory lists.
*   **TC1.4**: Dynamic JSON-LD injection: Verify that the lawyer profile page output contains valid `AggregateRating` and `Review` schema properties summarizing real database review counts.
*   **TC1.5**: Reviews visual layout check: Verify that the reviews are styled inside glassmorphism elements containing correct rating stars.

#### Feature 2: Lead Funnels & Intake Forms
*   **TC2.1**: Complete the AI Evaluator flow (select labor law, enter details, submit) and verify that the page transitions to Step 3 (matched lawyers and diagnostic summary) and a lead record is stored in the database.
*   **TC2.2**: Complete the Bituach Leumi calculator flow, verify calculated medical percentage and expected allowance values, and check database entry.
*   **TC2.3**: Complete the Severance calculator flow, check math accuracy of gross severance amount based on dates/salary, and verify database lead ingestion.
*   **TC2.4**: Complete the Small Claims form generator flow, verify correct court draft outputs, and check database lead ingestion.
*   **TC2.5**: Local storage backup mechanism: Disable the leads endpoint (return a 500 status code) and verify that form submissions fallback to `localStorage` without breaking the user experience.

#### Feature 3: Payment Processing & Webhooks
*   **TC3.1**: Simulate purchase of credits by a lawyer (clicking "טען קרדיטים"): Verify redirect to Stripe checkout page.
*   **TC3.2**: Execute a successful simulated Stripe redirect callback containing mock parameters and verify that the lawyer's UI updates with credited balances.
*   **TC3.3**: Send a valid `checkout.session.completed` webhook payload to `/api/webhooks` with metadata type `credits` and verify that the database profile credits update successfully.
*   **TC3.4**: Send a valid `checkout.session.completed` webhook payload with metadata type `document_review` and verify that the target lead is updated to `paid` and `routable` status.
*   **TC3.5**: Claiming leads: Log in as a lawyer with active credits, select an ingested lead, execute the "Swipe to Claim" slider, and verify that lawyer credits are decremented and lead contact details become visible.

#### Feature 4: Programmatic SEO & Redirection
*   **TC4.1**: Dynamic Sitemap validation: Request `/sitemap.xml`, verify XML structure, and check that dynamic posts, pages, and lawyer profiles are generated.
*   **TC4.2**: Sitemap error resilience: Mock the WordPress GraphQL endpoint as unreachable and verify that the sitemap falls back to rendering home routes without crashing.
*   **TC4.3**: Robots.txt verification: Request `/robots.txt` and verify that standard rules and the link to sitemap are formatted correctly.
*   **TC4.4**: Canonical tags check: Visit dynamic page routes and homepage and verify that alternate canonical link tags point directly to `https://jus-tice.co.il` with the exact decoded slug path.
*   **TC4.5**: Decode & Redirect Middleware: Request URL-encoded legacy paths (e.g. Hebrew characters like `/%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%9c%d7%90...`) and verify a 301 redirect is returned, resolving to the modernized path with search parameters intact.

#### Feature 5: E-E-A-T Advisory Board Integration
*   **TC5.1**: JSON-LD Structured data parsing: Request a dynamic page route, extract the embedded JSON-LD script, and verify it parses as valid JSON with `@type: LegalArticle`.
*   **TC5.2**: Advisory Board verification nodes: Verify that the JSON-LD schema has an author of `Organization` and a `reviewedBy` node of type `Person`.
*   **TC5.3**: Expert lookup schema link: Verify that the `reviewedBy` node contains a `sameAs` link referencing the expert's professional biography page (e.g. LinkedIn, Wikipedia, or an official Bar Association link).
*   **TC5.4**: Specialized dynamic board routing: Visit a labor law article and verify that the schema links specifically to the designated "Israel Labor Law Specialist" (Expert ID 9).
*   **TC5.5**: Visual Trust Banner verification: Verify that the page renders a prominent trust banner stating the article has been reviewed by a qualified specialist in Israeli Law, matching search quality standards.

---

### Tier 2: Boundary & Corner Cases (>=5 test cases per feature)

#### Feature 1: Review Management
*   **TC2.1.1**: Submit a review with missing mandatory fields (rating or author name) and verify API returns 400 Bad Request.
*   **TC2.1.2**: Submit a rating value outside the valid range (e.g., 0, 6, or negative values) and verify API rejection.
*   **TC2.1.3**: Submit multiple rapid reviews from the same client IP and check rate-limiting middleware activation.
*   **TC2.1.4**: Submit review content with HTML/script injection payloads and verify that the API sanitizes the content before database insertion.
*   **TC2.1.5**: Request review list with a non-existent lawyer ID and verify empty list returns with a 200 OK.

#### Feature 2: Lead Funnels & Intake Forms
*   **TC2.2.1**: Submit Small Claims form with an amount exceeding the statutory limit (₪38,900) and verify that the system blocks submission with a visual warning.
*   **TC2.2.2**: Submit AI Evaluator details with empty content and check that the submit button is disabled or triggers validation errors.
*   **TC2.2.3**: Submit calculator details with an invalid Hebrew phone format (e.g. too short or containing letters) and check validation checks.
*   **TC2.2.4**: Simulate network timeout during lead ingestion API call and check that the client switches to the local storage fallback within 1 second.
*   **TC2.2.5**: Submit form details containing special Unicode characters or extremely long text blocks and verify that database storage does not truncate text.

#### Feature 3: Payment Processing & Webhooks
*   **TC2.3.1**: Call the checkout session API with an amount of 0 or less and verify API rejects request.
*   **TC2.3.2**: Trigger Stripe webhook with invalid signature credentials and verify the endpoint responds with 400 Bad Request.
*   **TC2.3.3**: Send duplicate Stripe event IDs to `/api/webhooks` and check that the system is idempotent (does not add duplicate credits to the profile).
*   **TC2.3.4**: Send a webhook completed checkout event with a non-existent lawyer ID and check database exception handling (logs warning, does not crash process).
*   **TC2.3.5**: Swipe-to-claim lead when lawyer has zero or insufficient credits, and check that the system rejects the claim and prompts for a Stripe payment redirect.

#### Feature 4: Programmatic SEO & Redirection
*   **TC2.4.1**: Request a route matching a redirect rule loop (e.g., A -> B -> A) and verify middleware interrupts loop or redirects safely.
*   **TC2.4.2**: Request a path with malformed URI encoding characters (e.g., trailing `%` without hex digits) and verify middleware catches decode exception and passes through safely.
*   **TC2.4.3**: Crawl sitemap and check for orphaned URLs or routes containing HTTP 404/500 status codes.
*   **TC2.4.4**: Visit a dynamic slug path containing uppercase characters and verify middleware redirects/normalizes it to lowercase.
*   **TC2.4.5**: Sitemap generation with empty database tables (Supabase/WP offline): verify sitemap output renders base core pages.

#### Feature 5: E-E-A-T Advisory Board Integration
*   **TC2.5.1**: Request structured data on a draft or unpublished post and verify that the JSON-LD schema is hidden or returns 404.
*   **TC2.5.2**: Missing reviewer assignment: If a CMS article has no designated expert reviewer, verify sitemap and page fallback to the portal organization publisher metadata.
*   **TC2.5.3**: Check article modification metadata validation: Set dynamic `modifiedDate` in the past and check that the structured schema `dateModified` matches page updates.
*   **TC2.5.4**: Render trust banners with multi-language characters and check font layout rendering.
*   **TC2.5.5**: Check schema properties for missing mandatory properties like `@context` or `@type` and verify strict validation matches Google Rich Results test requirements.

---

### Tier 3: Cross-Feature Combinations (Pairwise Tests)

Pairwise tests ensure that integration points between system layers operate harmoniously.

```
+--------------------------+-----------------------+--------------------------+
| Feature A                | Feature B             | Integration Verification |
+--------------------------+-----------------------+--------------------------+
| Lead Funnels             | Stripe & Webhooks     | Client submits intake    |
|                          |                       | form -> pays for expert  |
|                          |                       | letter review -> Webhook |
|                          |                       | updates status -> ready  |
+--------------------------+-----------------------+--------------------------+
| Review Submissions       | E-E-A-T Schema        | Client submits approved  |
|                          |                       | lawyer reviews -> recalculates |
|                          |                       | AggregateRating -> updates|
|                          |                       | JSON-LD structure        |
+--------------------------+-----------------------+--------------------------+
| WordPress CMS / Slug     | Programmatic SEO      | Publish new post on WP ->|
|                          |                       | sitemap updates -> slug  |
|                          |                       | matches canonical rules  |
+--------------------------+-----------------------+--------------------------+
| Redirect Middleware      | Leads Intake          | Visit legacy URL ->      |
|                          |                       | middleware redirects to  |
|                          |                       | dynamic route -> form    |
|                          |                       | auto-selects correct tab |
+--------------------------+-----------------------+--------------------------+
| Webhook Credit Update    | Leads Claiming        | Webhook triggers credit  |
|                          |                       | reload -> lawyer unlocks |
|                          |                       | lead -> credits reduce   |
+--------------------------+-----------------------+--------------------------+
```

---

### Tier 4: Real-world Application Scenarios

#### Scenario 1: The Injured Client Acquisition & Lawyer Intake Loop
1.  **Search Discovery**: An injured client searches for personal injury rights, landing on `https://jus-tice.co.il/מדריך-תאונת-דרכים-קשה` (a legacy URL).
2.  **Redirection**: Next.js middleware decodes the slug, checks `redirect-map.json`, and redirects with a 301 to `https://jus-tice.co.il/personal-injury-guide`.
3.  **Advisory Check**: The client views the article, checks the E-E-A-T visual advisory trust banner, and the structured schema shows it was reviewed by the appointed "Israel Personal Injury Specialist".
4.  **Intake Form**: The client scrolls down, clicks "מעריך סיכויים AI", selects the **Rear Collision** hotspot on the interactive vehicle simulator.
5.  **Simulation & Lead Ingestion**: The system loads AI analysis, calculates estimated value range (₪120k–₪250k), and client submits their contact credentials. A lead payload goes to `/api/leads`, saves in Supabase, and dispatches Twilio SMS.
6.  **GTM Verification**: The client's browser records a GTM dataLayer push event `{"event": "lead_submission", "lead_type": "personal-injury-law"}`.
7.  **Advocate Response**: A personal injury attorney receives an SMS notification, logs in, swipes to claim the lead using 150 portal credits, revealing the client's phone number.

#### Scenario 2: Lawyer Credit Depletion & Reload Scenario
1.  **Lead Portal Browse**: A family lawyer logs into their workspace, views a newly ingested high-urgency divorce lead.
2.  **Credit Check**: The lawyer attempts to swipe to claim the lead (bid price: 180 credits) but the portal alerts they only have 120 credits remaining.
3.  **Payment Initiation**: The lawyer clicks "טען קרדיטים", selecting 200 credits for ₪300. The app posts payload to `/api/checkout`.
4.  **Stripe Redirect**: The checkout API redirects the browser to the Stripe transaction session.
5.  **Payment Success**: The lawyer enters credentials, completes payment, and Stripe redirects back to the portal with `session_id`.
6.  **Webhook & Credit Update**: Stripe backend fires `checkout.session.completed` containing the metadata. The webhook route updates lawyer profile credits to 320.
7.  **Claim Execution**: The lawyer returns to the lead dashboard, successfully claims the lead, and credits deduct to 140.

---

## 3. E2E Test Runner Implementation

We recommend **Playwright** as the E2E test runner. Playwright provides native multi-browser support, request interception, parallel execution, and runs without external dependencies.

### 3.1 Recommended Directory Structure
```
justice-nextjs-app/
├── src/
├── tests/
│   └── e2e/
│       ├── fixtures/
│       │   ├── mock-wordpress.json
│       │   ├── mock-supabase.json
│       │   └── mock-stripe.json
│       ├── reviews.spec.js
│       ├── intake.spec.js
│       ├── payment.spec.js
│       ├── seo.spec.js
│       └── eeat.spec.js
├── playwright.config.js
└── package.json
```

### 3.2 Playwright Configuration File (`playwright.config.js`)
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:8080/mock-supabase',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key',
      WORDPRESS_API_URL: 'http://localhost:8080/mock-wordpress/graphql',
      STRIPE_SECRET_KEY: 'mock-stripe-secret',
      NEXT_PUBLIC_GTM_ID: 'GTM-MOCK123',
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### 3.3 Offline & Local Mocking Strategy

To run E2E tests offline or locally in isolated environments, mock external service layers using Playwright's `route()` interceptors.

#### Mocking WordPress GraphQL Calls
Intercept outgoing `/graphql` requests and return static mock page or lawyer data:
```javascript
test.beforeEach(async ({ page }) => {
  await page.route('**/graphql', async (route) => {
    const request = route.request();
    const payload = request.postDataJSON();
    
    if (payload.query.includes('AllPageSlugs')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            pages: {
              nodes: [{ slug: 'rabbinical-agreement-approval' }]
            }
          }
        })
      });
    } else if (payload.query.includes('PostBySlug')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            post: {
              title: 'הסכם גירושין',
              content: '<p>מדריך משפטי מפורט</p>',
              slug: 'rabbinical-agreement-approval',
              date: '2026-06-08',
              modified: '2026-06-08'
            }
          }
        })
      });
    }
  });
});
```

#### Mocking Supabase REST API
Intercept Supabase client calls:
```javascript
test.beforeEach(async ({ page }) => {
  await page.route('**/rest/v1/leads*', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 101, title: 'Mock Lead' }])
      });
    }
  });
});
```

#### Mocking Stripe Payments
Utilize built-in Next.js fallback parameters in the checkout redirect and verify mock updates:
```javascript
test('Simulated Stripe Payment Funnel', async ({ page }) => {
  await page.goto('/#workspace');
  await page.click('button:has-text("עו״ד מורשה")');
  
  // Intercept Checkout redirect to capture simulation params
  await page.route('**/api/checkout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: 'http://localhost:3000/?session_id=mock_session_123&mock_amount=150&mock_type=credits',
        isMock: true
      })
    });
  });

  await page.click('button:has-text("טען קרדיטים")');
  
  // Expect URL params redirect to return updated credits in dashboard
  await page.waitForURL(/session_id=mock_session_123/);
  const creditText = page.locator('strong:has-text("₪")');
  await expect(creditText).toContainText('1600'); // Credits updated (1450 + 150)
});
```

#### Mocking Google Tag Manager (dataLayer) Pushes
Validate GTM triggers by querying `window.dataLayer` state on the active page:
```javascript
test('Verify GTM Intake Form Event', async ({ page }) => {
  await page.goto('/');
  
  // Fill Bituach Leumi form
  await page.fill('input[placeholder="שם מלא"]', 'ישראל ישראלי');
  await page.fill('input[placeholder="מספר טלפון"]', '0541234567');
  await page.fill('input[placeholder="אימייל"]', 'israel@test.com');
  
  await page.click('button:has-text("חשב סיכויי זכאות")');
  
  // Evaluate pushed events in the dataLayer array
  const dataLayer = await page.evaluate(() => window.dataLayer || []);
  const leadEvent = dataLayer.find(e => e.event === 'lead_submission');
  
  expect(leadEvent).toBeDefined();
  expect(leadEvent.lead_type).toBe('national_insurance');
});
```

---

## 4. Test Orchestration Scripts

Add the following commands to the application's `package.json` file for developer testing and continuous integration:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug"
}
```

### Local Execution Command
To run all tests in a local environment:
```powershell
# Install Playwright dependencies (first time setup)
npx playwright install --with-deps

# Execute test suites offline
npm run test:e2e
```
