## 2026-06-08T18:23:23Z
You are teamwork_preview_worker.
Your working directory is: c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m2
Project root: c:\Users\pro\justice\justice-nextjs-app

Task:
1. Implement the reviews database schema, mock seed, and API endpoints by deploying the designs produced by Explorer 3:
   - Copy `c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m2_3\schema.sql` to `src/lib/reviews-schema.sql`.
   - Copy `c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m2_3\proposed_reviews-cache.json` to `src/lib/reviews-cache.json`.
   - Copy `c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m2_3\proposed_reviews.js` to `src/lib/reviews.js`.
   - Copy `c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m2_3\proposed_api_reviews_route.js` to `src/app/api/reviews/route.js`.
   - Copy `c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m2_3\proposed_api_reviews_approve_route.js` to `src/app/api/reviews/approve/route.js`.

2. Make sure that all target paths and folders are created correctly. If a folder does not exist, create it.
3. Write a temporary node script (e.g., `verify-reviews.js` in the project root or in `src/lib`) that imports `src/lib/reviews.js` and tests its key methods offline (verifying that it reads mock seed reviews, computes aggregate ratings, submits a new review, and approves a review). Run the script to verify that everything works correctly. Note that the script must run using Node.js.
4. Run `npm run build` and `npm run lint` to ensure that Next.js compilation compiles without errors or warnings and satisfies lint rules.
5. Record your implementation, script execution results, build/lint output, and verification results in handoff.md in your working directory and notify the Milestone 2 Sub-orchestrator.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
