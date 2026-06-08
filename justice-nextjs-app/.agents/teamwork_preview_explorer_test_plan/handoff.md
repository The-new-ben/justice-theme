# Handoff Report — JUS-TICE E2E Testing Strategy

This handoff contains all findings, logic chains, and execution plans for the JUS-TICE E2E testing strategy.

---

## 1. Observation

Direct observations made from the codebase files inside `c:\Users\pro\justice\justice-nextjs-app`:

1.  **Multi-source Review System**:
    *   No review-related API routes or tables exist under `src/app/api` or `src/lib/supabase.js`.
    *   Mock ratings are rendered on the homepage (`src/app/page.js` line 2412: `⭐ 4.9 (148 חוות דעת)` and line 2438: `⭐ 4.8 (92 חוות דעת)`).
    *   Placeholder reviewedBy metadata is used in `src/app/[slug]/page.js` lines 43-48:
        ```javascript
        'reviewedBy': {
          '@type': 'Person',
          'name': 'עורך דין מוסמך (בעל האתר)',
          'jobTitle': 'חבר לשכת עורכי הדין בישראל',
          'sameAs': 'https://www.israelbar.org.il/'
        }
        ```

2.  **Intake Forms, Leads, and Stripe**:
    *   Multiple intake screens exist under `src/app/page.js` (AI Evaluator, Bituach Leumi, Severance Calculator, Small Claims Form).
    *   `/api/leads` (`src/app/api/leads/route.js`) inserts into a Supabase `leads` table and triggers email/SMS notifications via `src/lib/notifications.js`.
    *   `/api/checkout` (`src/app/api/checkout/route.js`) redirects to Stripe or returns a simulated query-params redirect (lines 22-25) if `stripe` is not instantiated:
        ```javascript
        const mockSuccessUrl = new URL(successUrl);
        mockSuccessUrl.searchParams.set('session_id', `mock_session_${Date.now()}`);
        mockSuccessUrl.searchParams.set('mock_amount', amount.toString());
        mockSuccessUrl.searchParams.set('mock_type', metadata?.type || 'credits');
        ```
    *   `/api/webhooks` (`src/app/api/webhooks/route.js`) captures transaction completions and updates Supabase profiles or leads.

3.  **Programmatic SEO**:
    *   `/sitemap.xml` (`src/app/sitemap.js`) uses WordPress data queries (`getAllPageSlugs`, `getAllPosts`, `getAllLawyers`) and outputs priority metrics.
    *   `/robots.txt` (`src/app/robots.js`) defines search engine agent directories.
    *   Dynamic canonical paths are injected in metadata configurations (e.g. `src/app/[slug]/page.js` lines 14-16: `{ alternates: { canonical: \`/\${decodedSlug}\` } }`).
    *   Middleware redirection (`src/middleware.js`) translates URL slugs mapping against `src/lib/redirect-map.json` rules.

4.  **E-E-A-T Advisory Board**:
    *   The schema script in `src/app/[slug]/page.js` contains a generic reviewer node. Individual experts from the 20-member Advisory Board list (e.g. Rand Fishkin, Danny Sullivan) are not yet integrated into the application structure.

---

## 2. Logic Chain

1.  **Review System Verification**:
    *   *Observation*: Hardcoded ratings exist in `page.js` and `[slug]/page.js`, but no review schemas or APIs exist.
    *   *Deduction*: Therefore, initial E2E tests for reviews must run against mock assertions (e.g. checking display of verified directory ratings) and mock routing for reviews submission endpoints, and be updated to database tests once backend schemas are implemented.
2.  **Intake and Payment Testing**:
    *   *Observation*: Lead API routes depend on Supabase, and Stripe checkout has fallback redirection.
    *   *Deduction*: Playwright tests can mock Stripe checkout and Webhook endpoints using raw JSON payloads, allowing tests to run entirely offline and verify local state updates (credits increments/payment status transitions) without real Stripe accounts.
3.  **SEO Middleware Verification**:
    *   *Observation*: Middleware loads `redirect-map.json` which maps over 2250 paths.
    *   *Deduction*: We can programmatically parse `redirect-map.json` under test suites to assert that requests to each legacy URL correctly trigger a 301 redirect matching target modernized URLs.
4.  **GTM/dataLayer Verification**:
    *   *Observation*: GTM container is loaded in `layout.js`, but custom `dataLayer.push` commands are not in `page.js`.
    *   *Deduction*: Tests should verify both that the GTM script is injected under the HTML body, and assert that when conversion tracking hooks are added, events are correctly appended to the `window.dataLayer` object.

---

## 3. Caveats

*   **Database Credentials**: Supabase connection details are assumed to be supplied via standard environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in local developer settings. E2E execution relies on local mocking server route interceptions if these are not populated.
*   **CMS Content Fetching**: WordPress endpoints are expected to run dynamic builds. If WP API queries fail, E2E tests will trigger the fallback sitemap generation logic.
*   **Advisory Board List**: Since the advisory board experts list is not yet mapped inside code files, tests are currently structured to verify placeholder schema, with guidance on verifying dynamic expert properties once database models are deployed.

---

## 4. Conclusion

A comprehensive 4-tier E2E testing framework has been formulated using **Playwright**. This framework covers feature coverage, validation bounds, integration combos, and user flows. It features robust offline execution strategies using network interceptions to bypass Stripe and Supabase dependencies.

---

## 5. Verification Method

To verify the strategy and implementation design:
1.  **File Check**: Inspect `c:\Users\pro\justice\justice-nextjs-app\.agents\teamwork_preview_explorer_test_plan\analysis.md` to confirm the presence of:
    *   4-tier test scope outlines with at least 5 test cases per feature in Tier 1 and Tier 2.
    *   Playwright configuration draft.
    *   Offline mock route examples for WordPress, Supabase, and Stripe.
    *   Package json orchestration commands.
2.  **Configuration Check**: Verify that `playwright.config.js` and directories can be added under `/tests/e2e` and execute tests locally using the standard next server:
    ```powershell
    # Run Playwright validation command (once installed)
    npx playwright test --config=playwright.config.js
    ```
