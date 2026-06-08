# JUS-TICE E2E Testing Infrastructure Blueprint

This document defines the E2E testing architecture, test plan, and validation criteria for the JUS-TICE legal tech portal. Due to the network-restricted and sandboxed execution environment (CODE_ONLY mode), the framework uses a zero-dependency, high-reliability test runner built directly on Node.js native API capabilities.

---

## 1. Test Architecture Overview

The JUS-TICE E2E test suite operates as a self-contained, automated harness that manages the lifecycle of the Next.js application server and executes validations programmatically.

```
+-------------------------------------------------------------+
|                     E2E Runner Lifecycle                    |
+-------------------------------------------------------------+
| 1. Find Available Random Port                               |
| 2. Spawn 'npm run dev' or 'next dev' child_process          |
| 3. Wait for HTTP readiness handshake (health check)        |
| 4. Execute 4-Tier Test Suite                                |
|    - HTTP fetches & HTML parsing (regex/jsdom-free)         |
|    - API calls (Leads, Reviews, Stripe, Redirects)          |
| 5. Gracefully terminate process tree (clean cleanup)        |
+-------------------------------------------------------------+
```

### Key Design Pillars:
*   **Zero Dependencies**: Relies exclusively on Node.js built-in modules (`node:test`, `node:assert`, `node:child_process`, `node:net`, `node:fs`). No reliance on Cypress, Playwright, or Puppeteer which require external browser binaries.
*   **Random Port Allocation**: Programmatically selects a free, non-conflicting port for the local dev server using a temporary TCP listener.
*   **Resilience & Isolation**: Gracefully shuts down the spawned Node/Next process and handles SIGINT/SIGTERM, ensuring no orphaned processes remain.
*   **Deterministic Assertions**: Runs real request cycles against local route handlers, parsing responses to verify precise structure and content contracts rather than using hardcoded mocks/facades.

---

## 2. Testing Scope (4-Tier Strategy)

Our verification strategy spans four comprehensive tiers to guarantee the application's correctness, performance, compliance, and E-E-A-T trust.

### Tier 1: Feature Coverage (>=5 test cases per feature)
*   **Reviews**: Verified retrieving approved reviews, submitting reviews (successful caching), input validation, HTML display checks, role/category filtering.
*   **Intake & Leads**: Submission of diagnostic AI forms, lead generation, Twilio/Resend notification console simulations, database insertion status checks.
*   **Stripe & Payments**: Stripe checkout session generation, webhook handling, mock fallback modes, payment success alerts, credit additions.
*   **SEO & Redirects**: Hebrew-encoded URL routing middleware, robots.txt format, sitemap.xml structure, dynamic canonical tags.
*   **E-E-A-T Advisory Board**: Expert review boards, biography page routing, schema verification (`AggregateRating`, `reviewedBy`, `LegalArticle`).

### Tier 2: Boundary & Corner Cases (>=5 test cases per feature)
*   **Reviews**: SQL injection attempts in name, negative ratings (e.g. 0 or 6 stars), blank comments, duplicate submissions from same IP, excessively long contents.
*   **Intake/Leads**: Missing required fields, malformed phone numbers, massive payloads, Unicode stress testing (Hebrew/Arabic characters), SQL injection vectors in description.
*   **Stripe/Payments**: Webhook signatures verification failure simulation, invalid metadata structures, negative checkout prices, extremely large credit reloads, double webhook processing.
*   **SEO/Redirects**: Double-slash URLs, casing mismatches in Hebrew redirects, malformed query parameters, trailing slashes, sitemap request limits.
*   **E-E-A-T Board**: Non-existent categories, missing expert links, empty biografies, invalid Bar IDs, outdated/missing article dates.

### Tier 3: Cross-Feature Combinations
*   **Leads + GTM**: Verify that submitting a lead pushes a tracking event (e.g., `leadSubmit`) onto the `dataLayer`.
*   **Reviews Caching + DB**: Confirm that writing a review updates the local filesystem cache (`reviews-cache.json`) while maintaining DB synchronization if available.
*   **Sitemap + WP Offline**: Confirm that the sitemap generator falls back gracefully to local hubs/spokes/lawyer content database and remains 100% valid when headless WordPress is simulated as offline.
*   **Redirect Middleware + Intake**: Verify that navigating to old legacy URLs correctly redirects to the corresponding new Silo structure path and loads the intake form correctly.

### Tier 4: Real-world Application Scenarios
*   **Scenario A (Client Acquisition Flow)**: An anonymous user lands on `/practice-areas/labor-law/severance-pay-calculator`, views the E-E-A-T trust banner, uses the calculator intake form, submits their case details (lead ingested), which initiates an event in GTM and simulates sending an email notification to the matching attorney.
*   **Scenario B (Lawyer Credit Reload)**: An advocate logs into the portal, initiates a credit reload (Stripe Checkout simulation), receives a successful payment event via simulated Webhook, verifies credit addition in their dashboard, and swipes to purchase a lead.

---

## 3. SEO & Silo Directory Verification Rules

The runner enforces strict compliance with the **SEO & URL Silo Directory Blueprint**:
1.  **Top 6 Pillar Hubs**: `/practice-areas/[category]` must exist and return HTTP 200 for:
    *   `real-estate-law`
    *   `medical-malpractice`
    *   `labor-law`
    *   `criminal-law`
    *   `family-law`
    *   `personal-injury`
2.  **Spoke Directory Matching**: Long-tail spokes must be nested under their parent category: `/practice-areas/[category]/[slug]` (e.g., `/practice-areas/labor-law/severance-pay-calculator`). Flat root slugs are disallowed for pillar topics.
3.  **Dynamic Canonical Tags**: Every Hub and Spoke page must contain a `<link rel="canonical" href="https://jus-tice.co.il/practice-areas/..."/>` tag pointing exactly to its nested directory URL.
4.  **Header Menu Compliance**: The main navigation menu must contain:
    *   ראשי (Home)
    *   Dropdown menu referencing all 6 Pillar Hub links.
    *   אינדקס עורכי דין (Lawyers directory).
    *   כלים דיגיטליים & AI (Workspace / AI tools).
    *   אודות (About).
    *   צור קשר (Contact CTA).
5.  **Dynamic E-E-A-T JSON-LD Schemas**:
    *   Verify the page contains `reviewedBy` JSON-LD schema referencing the expert’s legal credentials, LinkedIn biography link, and Israeli Bar ID.
    *   Verify `BreadcrumbList` schema lists the full hierarchical path: `בית > תחומי התמחות > [Pillar] > [Spoke]`.

---

## 4. Copywriting and Quality Guidelines (Anti-AI-Tells)

To guarantee content is indistinguishable from top-tier human legal writers, the E2E tests run structural text analysis against page content:
*   **No Em-Dashes**: Ban the use of `—` to separate thoughts (use standard punctuation).
*   **No AI Transitions**: Search for and fail on typical AI tells:
    *   `בנוסף`
    *   `חשוב לציין כי`
    *   `לסיכום`
    *   `ראוי לציין`
*   **Explicit Citations of Israeli Laws**: Verify the presence of specific statutory citations relevant to the legal area:
    *   `חוק המקרקעין, תשכ״ט-1969`
    *   `חוק פיצויי פיטורים, תשכ״ג-1963`
    *   `חוק הפיצויים לנפגעי תאונות דרכים, תשל״ה-1975`
    *   `חוק הודעה מוקדמת לפיטורים ולהתפטרות, תשס״א-2001`
    *   `חוק העונשין, תשל״ז-1977`

---

## 5. Execution and Verification Command

To run the full E2E test suite:
```bash
node tests/e2e/runner.js
```
The runner will print colored test results, coverage matrices, and assertions for each of the 4 Tiers, followed by a summary status code.
