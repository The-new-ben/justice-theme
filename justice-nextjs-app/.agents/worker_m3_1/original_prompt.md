## 2026-06-08T20:04:38Z
You are teamwork_preview_worker.
Your working directory is c:\Users\pro\justice\justice-nextjs-app\.agents\worker_m3_1.
Your mission is to implement the modifications for Milestone 3.

Specifically:
1. Reviews UI Upgrade:
   - Modify `src/app/practice-areas/[category]/page.js` and `src/app/practice-areas/[category]/[slug]/page.js` reviews list items to use `className="glass-panel"` instead of the inline styling `background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.03)'`. Keep other layout paddings or margins if appropriate.
   - Cleanly display the review source on each card using a role badge/label. Define a mapping function for reviewer role in Hebrew:
     - 'Client' -> 'לקוח משרד'
     - 'Colleague' -> 'קולגה למקצוע'
     - 'Google' -> 'חוות דעת Google'
     Display this badge clearly next to the reviewer name.
2. JSON-LD Dynamic Schema Integration:
   - Extract `aggregateRating` from the resolved `getApprovedReviews()` response: `const { reviews, aggregateRating } = await getApprovedReviews();` (and fallback to empty array/object).
   - In `eeatSchema`, nest `aggregateRating` and `review` objects under `publisher` (which is of type `LegalService`). Only nest `aggregateRating` if `aggregateRating.reviewCount > 0`. Only nest `review` if `reviews.length > 0` (slice up to 3). Format types correctly (ensure ratingValue and reviewCount are cast to String or Number as appropriate for Schema.org).
3. Concurrency Lock:
   - In `src/lib/reviews.js`, implement a custom file-locking mutex for reviews writes to prevent lost updates in multi-process concurrency environments.
   - Use `fs.openSync` with the `'wx'` flag on a lock file (e.g. `src/lib/reviews-cache.json.lock`) to acquire the lock. Implement a retry loop with a random delay (e.g. 50ms base with jitter, up to 100 retries) to serialize the read-modify-write cycle in `submitReview` and `approveReview`.
   - Ensure the lock is released in a `finally` block by deleting the lock file.
   - Make `writeLocalCache` atomic by writing the JSON content to a temporary file (e.g. `src/lib/reviews-cache.json.tmp`) and then using `fs.renameSync` to overwrite the target cache file.
4. Copywriting Compliance:
   - Ensure no em-dashes `—` (use normal punctuation), no AI transition patterns ("בנוסף", "חשוב לציין כי"), and active Hebrew voice in all added UI or message text.

Verification steps to run:
- Build and run the project tests using:
  `node tests/e2e/runner.js`
- Run the reviews concurrency stress test using:
  `node tests/reviews-concurrency-test.js`
All tests must pass.
