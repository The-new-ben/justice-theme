## 2026-06-08T20:00:42Z
You are the Worker 3 (Replacement for Worker 2) for Milestone 4 (SEO Silo Routing & Programmatic SEO).
Your working directory is c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m4_3.
Your identity is teamwork_preview_worker.

The previous worker became unresponsive. Please resume and complete the tasks:
1. Run the E2E test suite by executing `node tests/e2e/runner.js` inside `c:\Users\pro\justice\justice-nextjs-app`. Observe any failing tests (specifically related to robots.txt validation, trailing slashes, or canonical URLs).
2. Inspect canonical generation across the routing files (e.g. `src/app/layout.js`, `src/app/practice-areas/[category]/page.js`, `src/app/practice-areas/[category]/[slug]/page.js`, `src/app/[slug]/page.js`, `src/app/lawyers/[slug]/page.js`, etc.) to ensure it does not produce double slashes (like `https://jus-tice.co.il//...`) or trailing slash mismatches against test expectations.
3. Inspect and edit `src/app/robots.js` to ensure the generated robots.txt structure matches what is verified by the E2E test suite.
4. Run the build (`npm run build`) and lint (`npm run lint`) commands to ensure the Next.js app builds cleanly.
5. If there are any other test failures, address them appropriately.
6. Write a detailed handoff report in c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m4_3\handoff.md and notify your parent via send_message.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
