## 2026-06-08T18:40:15Z

You are teamwork_preview_worker.
Your working directory is: c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m2_hardening
Project root: c:\Users\pro\justice\justice-nextjs-app

Task:
Harden input validations in `src/lib/reviews.js` to address the gaps identified during adversarial testing:
1. In `submitReview`, verify that `rating` is not an array, object, or boolean, and is only a string or number, before calling `parseInt(rating, 10)`. Explicitly reject any `Array.isArray(rating)` or if the type of rating is not string or number, throwing the error: `דירוג חייב להיות מספר שלם בין 1 ל-5`.
2. Enforce maximum length limits on `reviewer_name` (max 150 characters) and `content` (max 3000 characters) in `submitReview`. If they exceed these limits, throw appropriate errors in Hebrew:
   - Name exceeds limit: `שם הממליץ ארוך מדי (מקסימום 150 תווים)`
   - Content exceeds limit: `תוכן ההמלצה ארוך מדי (מקסימום 3000 תווים)`
3. Run the verification scripts:
   - `node verify-reviews.js`
   - `node tests/e2e/reviews-adversarial.js` (Verify that it now correctly rejects arrays and overly long inputs!)
4. Run `npm run build` and `npx eslint` on the modified files to ensure everything compiles cleanly and complies with ESLint rules.
5. Record your changes, script outputs, and build results in handoff.md in your working directory and notify the Milestone 2 Sub-orchestrator.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
