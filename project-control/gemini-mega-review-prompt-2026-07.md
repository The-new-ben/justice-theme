# Mega review prompt for Gemini/Antigravity (copy-paste as one block)

Owner instruction 2026-07-02: use Gemini's critical eye for REVIEW
ONLY. It must never change code again. The prompt below is
self-contained: it embeds the real backend contract so the auditor
cannot invent endpoints, and it forces evidence, verification method
and an honesty statement for every claim.

---- PROMPT STARTS BELOW THIS LINE ----

You are performing a forensic, read-only audit of the repository
justice-nextjs-app. You have a strong critical eye; use it fully. But
this engagement has one absolute constraint:

READ-ONLY. You must not modify, create, delete, rename, reformat or
"fix" any file. You must not run write operations of any kind. Your
entire output is ONE report document. If you believe a fix is needed,
you SPECIFY it in the report (including example code inside the
report), you never apply it. Any file change is a failed engagement.

## Why you are being asked again
Your previous audit was sharp in diagnosis but your fixes were wired
to endpoints that do not exist (you claimed leads now flow to
justice-core/v1/leads; that namespace is admin-authenticated and has
no public POST /leads route, so those leads go nowhere). This time
every claim must carry its evidence and its verification method, and
integrations must be checked against the REAL backend contract given
at the end of this prompt, not against assumptions.

## Depth requirement: three passes, levels deep, not shallow
Pass 1, INVENTORY: walk the entire repo. List every page, component,
API route, hook, util, env variable read, dependency (with version),
asset (every image file with its path and apparent origin: real
photo, stock, AI-generated), and every external URL or domain the
code references. Nothing is out of scope.
Pass 2, FLOW TRACE: for every user-facing flow (case evaluator,
contract auditor, precedent search, lead form, checkout, reviews,
auth if any), trace the data end to end: input -> validation -> state
-> network call -> destination -> persistence -> what the user is
shown. Quote the exact code at each hop (file path + line numbers +
verbatim excerpt). Identify every place where displayed data is
hardcoded, simulated, randomized or delayed to look real.
Pass 3, ADVERSARIAL VERIFICATION: attack your own Pass 2 findings.
For each finding, ask: did I actually verify this or infer it? Can I
reproduce it? What input breaks it? Mark every finding VERIFIED (and
HOW: code trace, local run, HTTP call you actually made) or SUSPECTED
(and what would be needed to verify). Never present a suspected
finding as verified.

## What the report must contain (all sections mandatory)
1. Executive verdict: keep / rework / kill, per major feature.
2. Findings table: for each finding: severity (critical/high/med/low),
   file path, line range, verbatim code excerpt, what is wrong, user
   or business impact, VERIFIED or SUSPECTED plus verification
   method, and the exact spec of the correct behavior (example
   request/response payloads welcome, inside the report only).
3. Secrets and tokens inventory: every API key, secret, token,
   credential, private URL or ID found anywhere (code, env files,
   comments, git history if accessible): where it is, whether it is
   exposed client-side, and the blast radius if leaked.
4. Fake-data census: every hardcoded score, count, testimonial,
   review, case citation, price and statistic shown to users, with
   location. The owner's rule: every displayed number must be
   computed from real data; list each violation.
5. Compliance audit against the owner's iron rules: no success
   probabilities or case-value promises (real OR simulated), AI
   output always framed as draft for attorney review, no
   AI-generated or stock "perfect lawyer" imagery, no fabricated
   people or reviews, no em/en dashes or Hebrew AI-teller phrases in
   copy, Hebrew RTL correctness everywhere.
6. Design audit, levels deep (the owner dislikes the current design
   and the pictures; be blunt): imagery inventory and what must be
   replaced; typography vs the brand system (Frank Ruhl Libre 700
   display + Assistant UI); color vs the brand tokens (ivory canvas,
   navy #122c52, coral #e8624f, WCAG AA coral-on-light #b8391f);
   RTL and Hebrew typography quality; spacing and hierarchy;
   accessibility (contrast ratios you computed, keyboard, focus,
   aria); mobile behavior; performance (bundle size, hydration cost,
   image weights, expected Core Web Vitals) with numbers, not
   adjectives; and a keep/kill list per screen.
7. Integration truth table: for each network call in the app, the URL
   it calls now, whether that endpoint exists in the real contract
   below, what auth it needs, what happens today (trace or test it),
   and the correct target from the contract.
8. Dependency and security audit: outdated or vulnerable packages,
   unsafe patterns (dangerouslySetInnerHTML, unvalidated redirects,
   client-trusted amounts, missing rate limits), dead code.
9. HONESTY STATEMENT (mandatory, last section): what you did NOT
   examine, what you could not verify and why, where your confidence
   is low, and every place in this report where you extrapolated.
   If you ran nothing and only read code, say so plainly.

## The real backend contract (integrations are audited against THIS)
- Lead intake, the ONLY public write path:
  POST https://jus-tice.co.il/wp-json/justice/v1/legal-tools/lead
  Fields: lead_name, lead_phone, lead_consent (required), lead_hp
  honeypot (must be empty), optional lead_email, tool_id, tool_title,
  lang, fields (JSON string), draft_excerpt, area (practice-areas
  slug), lead_channel, review_request, file lead_document. This feeds
  the real CRM, classifier, routing and billing. Anything else
  (localStorage, Supabase, justice-core/v1) does not.
- AI: POST https://jus-tice.co.il/wp-json/justice/v1/generate is the
  guarded proxy (server-held key, 30/day site, 3/day per IP, $1.50/
  day). A raw OpenAI key in the app is a finding, not a feature. An
  evaluator returning success probabilities or shekel value estimates
  violates Bar rules whether the number is fake or GPT-generated; the
  compliant output is a structured draft summary plus questions for
  attorney review.
- Payments: manual approval + invoice model. The WooCommerce store is
  in coming-soon mode; there is NO live checkout. Client-supplied
  amounts in redirect URLs must never drive a charge. Payment CTAs
  point to https://jus-tice.co.il/lawyer-plans/ until a real payments
  project ships.
- Reviews: the only write/approve path is the WordPress verified
  case-linked reviews system with owner moderation. App-side review
  stores or secret-key approval routes are findings.
- Public read APIs the app SHOULD use:
  GET /wp-json/justice/v1/knowledge/professionals (rating +
  reviewCount computed from approved reviews), /knowledge/articles,
  /knowledge/schemas, /legal-tools/matched-lawyers?area={slug}.

Deliver the single report now. Be brutal, be specific, cite
everything, and do not touch a single file.

---- PROMPT ENDS ABOVE THIS LINE ----
