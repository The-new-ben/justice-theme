## 2026-06-08T20:24:36Z
You are teamwork_preview_worker. Your working directory is c:\Users\pro\justice\justice-nextjs-app\.agents\teamwork_preview_worker_e2e_impl_3.
You are replacing the previous worker which has become unresponsive.
The E2E testing framework is fully written under c:\Users\pro\justice\justice-nextjs-app\tests\e2e and the Next.js routes and APIs have already been updated and verified by the previous worker.
Please do the following:
1. Run the test runner using `node tests/e2e/runner.js` to verify that 100% of the assertions pass successfully.
2. If any assertions fail, troubleshoot and fix the corresponding route or API in `src/app/api/...` or `src/middleware.js`.
3. Verify that the files `TEST_INFRA.md` and `TEST_READY.md` are complete and correct.
4. Write a detailed handoff report to `c:\Users\pro\justice\justice-nextjs-app\.agents\teamwork_preview_worker_e2e_impl_3\handoff.md` with:
   - Observation: modified files.
   - Logic Chain: how tests verify target requirements.
   - Caveats: environmental assumptions.
   - Conclusion: results of the E2E test run (copy/paste the passing command line outputs).
   - Verification Method: how to run tests.
5. Send a message back to the parent (conversation ID 9106c4d9-3e19-43b1-bf9a-ccd645200546) when done, providing the path and summary.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
