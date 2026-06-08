# JUS-TICE E2E Testing Suite: Ready for Execution

The comprehensive E2E testing framework for the JUS-TICE legal tech portal is fully operational, validated, and ready. It complies with all user requirements, design guidelines, and code quality criteria.

---

## 📅 Verification & Execution

To run the complete test suite:

```bash
# From the project root (c:\Users\pro\justice\justice-nextjs-app)
node tests/e2e/runner.js
```

### What happens when you run it:
1.  **Port Allocation**: Programmatically queries the system and secures an available random TCP port.
2.  **Next.js Server Startup**: Spawns the local Next.js server (`npx next dev -p <port>`) in a child process.
3.  **Readiness Handshake**: Polls the server until it responds to HTTP requests (ensuring it is fully booted).
4.  **Harness Execution**: Spawns the spec suite (`node tests/e2e/tests.js`) which runs all test cases.
5.  **Teardown**: Gracefully and completely terminates the server process tree, freeing all system resources.

---

## 🛠️ Test Cases Coverage Summary

The test harness runs a total of **30 test cases** organized across 4 distinct tiers:

### Tier 1: Core Feature Verification
*   **Reviews**: Tests retrieving approved reviews, posting new pending reviews, and checking HTML output integration.
*   **Intake & Leads**: Tests submission of AI-evaluated leads, DB storage simulation, and Twilio/Resend notification console triggers.
*   **Stripe & Payments**: Tests Stripe checkout URL generation, webhook handling, and credit top-up simulations.
*   **SEO & Redirects**: Validates robots.txt, sitemap.xml structure, and Hebrew-encoded URL routing middleware.
*   **E-E-A-T Advisory Board**: Validates page breadcrumbs, BreadcrumbList schema, and Person schema fields.

### Tier 2: Boundary & Corner Cases
*   **Reviews**: Rejects rating out-of-bounds (<1 or >5), blank descriptions, invalid roles, and validates SQL injection inputs.
*   **Intake & Leads**: Validates malformed emails/phone formats, empty case details, and handles SQL commands inside descriptions safely.
*   **Stripe & Payments**: Rejects negative amounts, missing metadata, zero credits, and malformed webhook inputs.
*   **SEO & Redirects**: Normalizes trailing slashes, double slashes, case-insensitivity, and matches sitemap count limits.
*   **E-E-A-T Board**: Verifies 404 responses for non-existent areas, content checks for em-dashes (`—`), and checks for AI tells ("בנוסף", "חשוב לציין").

### Tier 3: Cross-Feature Combinations
*   **GTM & Leads**: Verifies presence of GTM container script and tag setup.
*   **Reviews Caching**: Verifies review persistence in the local filesystem JSON database cache.
*   **WordPress Fallback**: Confirms sitemap.xml pulls data correctly from the fallback DB even when headless WordPress is simulated as offline.
*   **Redirect & Intake**: Asserts redirect middleware maps old URLs to the new silo route, displaying the intake form.

### Tier 4: Real-world Application Scenarios
*   **Scenario A (User Ingestion)**: Client lands on spoke calculator, views trust banner, fills form, submits lead, receives automated SMS notification logs.
*   **Scenario B (Lawyer Reload)**: Advocate initiates credit reload, checkout generates URL, payment webhook fires, credits are successfully topped up.

---

## 🛡️ Copywriting & E-E-A-T Quality Safeguards
The test suite programmatically parses output HTML to enforce strict rules:
1.  **Anti-AI Copywriting**: Blocks typical AI text markers (`בנוסף`, `חשוב לציין כי`, `לסיכום`, `ראוי לציין`).
2.  **No Em-dashes**: Fails if an em-dash (`—`) is found (standard punctuation is enforced).
3.  **Israeli Statutory Law Citations**: Validates that pages reference appropriate statutory laws (e.g. `חוק המקרקעין, תשכ״ט-1969`, `חוק פיצויי פיטורים, תשכ״ג-1963`, etc.) to uphold E-E-A-T standards.
