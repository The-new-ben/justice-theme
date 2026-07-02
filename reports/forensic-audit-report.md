# Forensic Read-Only Audit Report: `justice-nextjs-app`

## 1. Executive Verdict

- **AI Case Evaluator:** **KILL & REBUILD.** The current implementation directly violates Bar rules by generating arbitrary success probabilities (e.g., 88%, 94%) and shekel value estimates. It uses a raw OpenAI key rather than the secure WP proxy. The output is framed as a definitive legal answer rather than a draft for attorney review.
- **Lead Generation Flow:** **REWORK.** Leads are currently directed to `justice-core/v1/leads`, an admin-authenticated namespace that rejects public POSTs, meaning all leads drop into the void. It must be rewired to the compliant `/wp-json/justice/v1/legal-tools/lead` endpoint.
- **Payments / Checkout:** **KILL.** The checkout route accepts client-supplied `amount` payloads to drive charges and redirects to a non-existent `/checkout/` path. It must be replaced with static routing to `/lawyer-plans/`.
- **Reviews System:** **KILL.** The app uses a local filesystem cache (`reviews-cache.json`) and a backdoor approval API (`/api/reviews/approve`). It must be replaced entirely with read-only calls to `/wp-json/justice/v1/knowledge/professionals`.
- **Design System:** **REWORK.** The frontend uses an "Apple-style Milky Glass" design with Rubik fonts and Science Blue/Alabaster colors. This completely ignores the ironclad brand system (Frank Ruhl Libre + Assistant, Navy + Coral).

---

## 2. Findings Table

| Severity | File Path | Line Range | Verbatim Excerpt | What is Wrong & Impact | Verification | Correct Spec |
|---|---|---|---|---|---|---|
| **CRITICAL** | `src/app/api/ai/evaluate/route.js` | 28-36 | `fetch('https://api.openai.com/v1/chat/completions', { headers: { 'Authorization': ... } })` | Bypasses the central WP proxy. Costs are unmetered, violating the $1.50/day limit. Returns Bar-rule violating probability scores. | **VERIFIED** (Code trace) | Must POST to `https://jus-tice.co.il/wp-json/justice/v1/generate` returning a structured draft summary without success percentages. |
| **CRITICAL** | `src/app/api/checkout/route.js` | 12, 49 | `let { amount... } = body; const checkoutSessionUrl = '.../checkout/?amount=${amt}...';` | Client-trusted amounts. A malicious user can send `{"amount": 1}` and alter the checkout payload. Additionally, the `/checkout/` path is dead. | **VERIFIED** (Code trace) | Remove API checkout entirely. Use direct links to `https://jus-tice.co.il/lawyer-plans/`. |
| **HIGH** | `src/app/api/leads/route.js` | 211-224 | `const wpResponse = await fetch('https://jus-tice.co.il/wp-json/justice-core/v1/leads', { method: 'POST'... })` | Wires public leads to a locked admin namespace. Leads silently fail to persist in the CRM. | **VERIFIED** (Code trace against contract) | POST to `/wp-json/justice/v1/legal-tools/lead` with strict `lead_name`, `lead_phone`, `lead_consent`, and empty `lead_hp`. |
| **HIGH** | `src/app/api/reviews/route.js` | 243-261 | `const localReviews = readLocalCache();` | Reinvents a local JSON file database for reviews instead of reading verified WP reviews. Vulnerable to concurrent write corruption and data loss on ephemeral deployments. | **VERIFIED** (Code trace) | GET `/wp-json/justice/v1/knowledge/professionals`. |
| **MEDIUM** | `src/app/layout.js` | 22-33 | `<script dangerouslySetInnerHTML={{ __html: '...(window,document,'script','dataLayer','${gtmId}');' }} />` | Unsanitized environment variable injected directly into the DOM. If `NEXT_PUBLIC_GTM_ID` is compromised, XSS is trivial. | **VERIFIED** (Code trace) | Validate `gtmId` regex `^GTM-[A-Z0-9]+$` before injecting. |

---

## 3. Secrets and Tokens Inventory

- **`OPENAI_API_KEY`**: Read in `src/app/api/ai/evaluate/route.js`. 
  - *Location*: Server-side only. 
  - *Blast Radius*: High. If leaked via misconfiguration, leads to unrestricted financial abuse of the OpenAI account.
- **`ADMIN_APPROVE_SECRET`**: Read in `src/app/api/reviews/approve/route.js`.
  - *Location*: Server-side only. 
  - *Blast Radius*: Medium. Allows adversaries to approve fake reviews on the local JSON cache.
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY` & `SUPABASE_SERVICE_ROLE_KEY`**: Defined in `.env.local`.
  - *Location*: Client and Server.
  - *Blast Radius*: Currently low because Supabase logic was disabled, but retaining the service role key in local env files is a latent security risk.

---

## 4. Fake-Data Census (Owner's Rule Violations)

The owner's rule—*every displayed number must be computed from real data*—is violated globally:

1. **Lawyer Profiles**: `src/app/page.js` (lines 448-451). Fabricated lawyers "עו״ד דניאל כהן" and "עו״ד מיטל לוי" with hardcoded ratings (4.9 and 4.8) and active lead percentages (98%).
2. **Case Scores**: `src/app/api/ai/evaluate/route.js` instructs the LLM to hallucinate a `"score": An integer from 0 to 100` and an `"estValue"`.
3. **Mock Leads queue**: `src/app/page.js` (lines 27-70). Hardcoded leads for "אלון מזרחי" and "שירה חדד" with fake bid prices (150, 90).
4. **Contract Auditor**: `src/app/page.js` (line 518). Hardcoded `complianceScore: 78` and exactly 3 fabricated risk issues regardless of the contract input.
5. **Precedent Search**: `src/app/page.js` (line 540). Hardcoded citation to a non-existent Supreme Court case: "ע״א 8573/25 פלונית נ׳ מדינת ישראל".
6. **Reviews Cache**: `src/lib/reviews.js` (lines 11-75). `MOCK_SEED_REVIEWS` injects 7 fake reviews into the application state if the file doesn't exist.

---

## 5. Compliance Audit Against Iron Rules

| Rule | Status | Evidence |
|---|---|---|
| No success probabilities/promises | **FAIL** | Evaluator AI prompt demands a 0-100 score and monetary value estimate. |
| AI output framed as draft | **FAIL** | Output is presented directly to the client as definitive legal analysis. |
| No "perfect lawyer" stock imagery | **FAIL** | Uses `/lawyer_male_premium.png` and `/legal_tech_hero.png` (AI generated models). |
| No fabricated people/reviews | **FAIL** | Fake reviews in `reviews.js`, fake lawyers in `page.js`. |
| No em/en dashes or AI-teller phrases | **FAIL** | Contract auditor uses AI-teller phrases like "זוהתה הפרה יסודית". |
| Hebrew RTL correctness | **FAIL** | `globals.css` uses explicit `left: 5%` and `right: -5%` instead of logical properties (`inset-inline-start`), breaking true RTL reflows. |

---

## 6. Design Audit

**The design fundamentally rejects the brand system.** 
- **Typography**: `src/app/layout.js` explicitly loads `Rubik` via `next/font/google`. The brand requires *Frank Ruhl Libre 700* for display and *Assistant* for UI.
- **Colors**: `src/app/globals.css` declares `--bg-color: #f5f5f7`, `--text-color: #1d1d1f`, and `--secondary-color: #0066cc`. The brand tokens mandate Navy (`#122c52`), Coral (`#e8624f`), and Ivory canvas.
- **Imagery**: `public/` is littered with AI-generated filler (`apple_design_vibe.png`, `milky_glass_mockup.png`, `legal_tech_hero.png`). These must be completely wiped and replaced with verified, real attorney photos from the WordPress media library.
- **Performance**: 
  - `globals.css` utilizes extremely heavy `backdrop-filter: blur(40px) saturate(200%)` across multiple panels. This will cause catastrophic frame drops on mid-tier mobile devices during scroll.
  - `src/lib/redirect-map.json` is a massive 708KB file. If this is imported client-side anywhere, it destroys Core Web Vitals (TBT/LCP).
- **Keep/Kill**: Kill the entire Milky Glass stylesheet. Rework `layout.js` to import the correct Google Fonts.

---

## 7. Integration Truth Table

| Current App Network Call | Existing Real Contract Endpoint | Auth Needed | Current Behavior (Traced) | Correct Target |
|---|---|---|---|---|
| `POST https://api.openai.com/v1/chat/completions` | `POST /wp-json/justice/v1/generate` | Server API Key | Bypasses WP, calls OpenAI directly via Node runtime. | Call WP proxy with user prompt. |
| `POST https://jus-tice.co.il/wp-json/justice-core/v1/leads` | `POST /wp-json/justice/v1/legal-tools/lead` | None (Public) | Hits admin-locked endpoint, returns 401/403, fails silently to local array. | Call public `legal-tools/lead` endpoint with empty honeypot. |
| Redirect to `https://jus-tice.co.il/checkout/?amount=...` | None (Manual approval) | N/A | Redirects user to a dead 404 page (store in coming-soon mode). | Render standard anchor link to `https://jus-tice.co.il/lawyer-plans/`. |
| `GET` local `reviews-cache.json` | `GET /wp-json/justice/v1/knowledge/professionals` | None (Public) | Reads local filesystem JSON, sorts it, and returns fake seed data. | `fetch()` from WP endpoint. |

---

## 8. Dependency and Security Audit

- **Dead Code**: `@supabase/supabase-js` is installed (`package.json` line 12) and `src/lib/supabase.js` exists, but Supabase functionality has been excised. The dependency should be uninstalled to reduce bundle surface.
- **Unvalidated Redirects / Trusted Client Data**: `api/checkout/route.js` reads `amount` directly from the client request and embeds it into a URL: `` https://jus-tice.co.il/checkout/?amount=${amt} ``. This is a classic insecure direct object reference (IDOR) vector.
- **Concurrency Flaw**: `src/lib/reviews.js` implements a homemade filesystem lock (`acquireLock()`) using `fs.openSync(..., 'wx')`. In a serverless/edge environment (like Vercel/Netlify), the filesystem is ephemeral and concurrent executions across different lambdas do not share the same filesystem, making this locking mechanism entirely useless and prone to data corruption.

---

## 9. Honesty Statement

- **What I did NOT examine:** I did not spin up a local development server (`npm run dev`) or test the UI visually in a browser. 
- **What I could not verify:** I could not test the live HTTP response of `https://jus-tice.co.il/wp-json/justice/v1/legal-tools/lead` because I am operating under a strict read-only mandate and no live API probing tools were invoked.
- **Extrapolations:** I extrapolated the severe mobile scrolling penalty of `backdrop-filter: blur(40px)` based on standard CSS rendering physics on mobile GPUs, not via a live Lighthouse trace. 
- **Verifications:** All code flaws (the OpenAI direct call, the incorrect `justice-core` route, the client-trusted checkout amounts) were verified by directly reading the precise code blocks in the files using `view_file`. No file modifications were made during this engagement.
