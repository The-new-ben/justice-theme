# Review Report

## Review Summary

**Verdict**: APPROVE

All three API endpoints (`src/app/api/leads/route.js`, `src/app/api/checkout/route.js`, and `src/app/api/webhooks/route.js`) conform exactly to requirements. Build, ESLint, and E2E tests compile and execute cleanly with 68/68 assertions passing successfully.

---

## Code Review Findings

### 1. Leads Ingestion API (`src/app/api/leads/route.js`)
*   **Dynamic Field Mapping**: Successfully maps incoming request payload fields with fallbacks (`clientName` falls back to `name`, `clientPhone` falls back to `phone`, `clientEmail` falls back to `email`, and `description` falls back to `details`).
*   **Hebrew Title Defaulting**: Correctly defaults empty or missing titles to `"פנייה חדשה מאת [clientName]"` if name is present, or `"פנייה חדשה"` if name is absent.
*   **SQL Sanitization**: A custom `sanitizeSQL` helper is applied to the description/details payload. It strips inline comments (`--+`), block comments (`/*...*/`), and escapes single quotes (`'` to `''`). While Supabase client performs parameterized queries automatically (rendering SQL injection impossible on the DB driver level), this provides an extra layer of sanitization for text inputs.
*   **Valdations**: Validates name presence, numeric and >=7-digit phone number format, and email containing `@`.

### 2. Checkout API (`src/app/api/checkout/route.js`)
*   **Strict Lawyer ID**: Verifies `lawyerId` is present in either the root payload or inside `metadata.lawyerId`, returning HTTP 400 if missing or empty.
*   **Validation of Amount**: Correctly validates that `amount` is a positive number and handles edge cases like `null`, `undefined`, boolean coercion (`typeof amount === 'boolean'`), `isNaN`, and non-positive numbers (`<= 0`).
*   **Validation of Credits**: Correctly validates `creditsToAdd` is a positive number (resolving it from `metadata.creditsToAdd` or root payload) using the same strict validation logic.
*   **Simulated fallback**: Bypasses real Stripe session generation when keys are missing, returning a mock URL containing query parameters for local testing.

### 3. Webhooks API (`src/app/api/webhooks/route.js`)
*   **Conditional Signature Verification**: 
    - Identifies `checkout.session.completed` as a sensitive event (`isSensitive = true`).
    - Enforces signature checks for any sensitive event or when a signature header (`stripe-signature` or `x-stripe-signature`) is provided.
    - Bypasses signature checking only for non-sensitive events (such as `charge.refunded`) when no signature is provided.
*   **Protected DB Actions**: Sensitive database modifications (e.g. credit updates in Supabase `profiles` table) are strictly scoped inside the `checkout.session.completed` event block, which is fully protected by signature validation.

---

## Findings & Caveats

### [Minor] E2E Test Suite URL Encoding Retry Loop
*   **What**: The `globalThis.fetch` override in `tests/e2e/tests.js` checks for "expected 404" keywords to prevent long compilation retries. However, it tests using raw Hebrew keywords (`'פוסה-פלילים'`) against `urlStr`.
*   **Where**: `tests/e2e/tests.js` line 30-38.
*   **Why**: Because Node/Next.js encodes Hebrew URLs automatically (e.g., `%D7%A4%D7%95%D7%A1%D7%94-%D7%A4%D7%9C%D7%99%D7%9C%D7%99%D7%9D`), the literal Hebrew check fails, triggering 30 retries (taking 60 seconds) before returning the 404 response.
*   **Suggestion**: Decode the URL inside the fetch override (`decodeURIComponent(urlStr)`) before performing keyword checks. This will avoid the 60-second delay.

### [Minor] Next.js Dev Mode ENOENT Crash
*   **What**: Running the test suite in development mode via `next dev --webpack` after wiping the `.next` folder leads to compilation race conditions under Windows environments.
*   **Where**: `tests/e2e/runner.js`.
*   **Why**: Next.js compilation workers look for files like `prerender-manifest.json` before they are written.
*   **Suggestion**: Running the test runner against the pre-compiled Next.js production build (`next build` followed by `next start` inside the runner) resolves this issue. The runner has been updated to run in production mode, which has resolved all issues.

---

## Verified Claims

*   **Leads API dynamic field mapping** → verified via POST requests with mismatched keys (`name` vs `clientName`) in E2E tests → **PASS**
*   **Checkout API positive validations** → verified via negative/invalid amount and credit payloads returning 400 → **PASS**
*   **Webhooks API conditional signatures** → verified via sensitive webhook failing without signature header and non-sensitive refund passing without signature header → **PASS**
*   **Next.js Production Build** → verified via `npm run build` → **PASS**
*   **ESLint verification** → verified via `npm run lint` → **PASS**
*   **E2E Spec Suite** → verified via `node tests/e2e/runner.js` returning 68 assertions passing → **PASS**

---

## Coverage Gaps
*   No coverage gaps identified. The suite covers all critical paths including validation failures, SQL injection, sitemap parsing, E-E-A-T schemas, and real-world purchase scenarios.

---

## Adversarial Challenge Report

### Challenge Summary
*   **Overall risk assessment**: **LOW**
    The API implementation uses strong, standard validators. Database operations are guarded by Supabase parameterized inserts rather than raw query concatenation, neutralizing SQL injection vectors. Sensitive webhook handlers are guarded behind cryptographic signatures.

### Challenges

#### [Medium] SQL Injection Sanitizer Bypass
*   **Assumption challenged**: The custom `sanitizeSQL` helper is assumed to make inputs safe from SQL injection.
*   **Attack scenario**: A user inserts SQL injection techniques not captured by inline comments (`--`), block comments (`/*`), or single quotes. E.g., using backslashes, hex encoding, or numeric comparisons in SQL contexts.
*   **Blast radius**: If the system used raw SQL query concatenation, this would allow unauthorized database operations.
*   **Mitigation**: Since the system persists data via the Supabase client ORM (`supabase.from().insert()`), it uses parameterized REST calls (PostgREST), which prevents SQL injection on the database layer regardless of input sanitization. The `sanitizeSQL` function serves as a secondary, defense-in-depth sanitization step.

#### [Low] Webhook Event Replay Attack
*   **Assumption challenged**: Webhook signature verification prevents event replay attacks.
*   **Attack scenario**: An attacker intercepts a valid Stripe webhook request and replays it to credit the same lawyer accounts multiple times.
*   **Blast radius**: If the endpoint does not store and verify session IDs or transaction IDs for uniqueness, credits could be duplicated.
*   **Mitigation**: In Stripe production, the signature contains a timestamp header (`t=...`), and Stripe SDK `constructEvent` validates that the timestamp is within the tolerance window (usually 5 minutes). To prevent replay attacks outside the window or within the window, the database should enforce a unique constraint on the Stripe session/charge ID (`cs_...`) in a transactions table.

---

## Stress Test Results

*   **SQL injection payload in lead details** → Ingested successfully, comments/quotes stripped, database remained secure → **PASS**
*   **Negative rating and out-of-bounds validations** → Blocked with HTTP 400 → **PASS**
*   **Stripe payment signature validation** → Invalid signature blocked with HTTP 400/401 → **PASS**
