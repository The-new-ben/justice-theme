# Handoff Report — Reviews Cache Concurrency Verification

## 1. Observation
We conducted concurrency and stress tests on the implemented Reviews module local filesystem fallback cache and executed the existing E2E test suite. 

### Local Filesystem Cache Code Path
In `src/lib/reviews.js`, the fallback caching logic is implemented as follows:
```javascript
// Lines 250-267 in src/lib/reviews.js
// 2. Fallback to Local Filesystem Cache
const localReviews = readLocalCache();

// Create review with auto-generated id
const cacheReview = {
  id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  ...newReviewPayload
};

localReviews.push(cacheReview);
writeLocalCache(localReviews);
```
Where `readLocalCache()` reads `src/lib/reviews-cache.json` synchronously and `writeLocalCache()` writes it back synchronously.

### Concurrency Stress Test Results
A custom concurrency stress test script `tests/reviews-concurrency-test.js` was written and run to test 50 parallel submissions.
Command:
```bash
node tests/reviews-concurrency-test.js
```
Output:
```
=== Reviews Cache Concurrency & Stress Test ===

--- Phase 1: In-Process Concurrency Test (50 parallel promises in 1 event loop) ---
Submitting 50 reviews concurrently...
Phase 1 Complete in 116ms.
Promises resolved successfully: 50/50
Promises rejected: 0/50
Cache file parses successfully as JSON: Yes
Expected reviews in cache: 57 (7 seed + 50 submitted)
Actual reviews in cache: 57
Submitted reviews successfully found in cache: 50
✅ Phase 1 Verification PASSED: No lost updates or corruptions detected in-process.

----------------------------------------------------------------------

--- Phase 2: Multi-Process Concurrency Test (50 parallel OS processes) ---
Spawning 50 parallel Node child processes to write to the cache simultaneously...
(node:14272) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
Phase 2 Complete in 9669ms.
Child processes exited with code 0: 50/50
Child processes failed/exited with error: 0/50
Cache file parses successfully as JSON: Yes
Expected reviews in cache: 57 (7 seed + 50 submitted)
Actual reviews in cache: 12
Submitted reviews successfully found in cache: 5
Lost updates: 45 reviews were overwritten/lost!
❌ Phase 2 Verification FAILED: Lost updates detected under multi-process concurrency.

Restoring cache to initial seed state...
Restore complete. Done.
```

### E2E Test Suite Run Results
Command:
```bash
node tests/e2e/runner.js
```
Output revealed multiple failing test assertions:
- `✖ Homepage contains correct self-referencing canonical` (Canonical tag did not match homepage URL: `'https://jus-tice.co.il'` !== `'https://jus-tice.co.il/'`)
- `✖ Robots.txt returns correct crawl guidelines` (Assert.ok failed checking if text includes `'User-agent: *'`)
- `✖ POST /api/leads sanitizes case description SQL tags` (Expected values to be strictly equal: `400 !== 200`)
- `✖ POST /api/webhooks rejects events with empty type tags` (Expected values to be strictly equal: `200 !== 400`)
- `✖ POST /api/webhooks rejects events simulating invalid verification tokens` (`[400, 401].includes(res.status)` evaluated to false)
- `✖ Sitemap compiles correctly with WordPress offline fallback database` (Sitemap did not contain expected pages)
- `✖ Legacy path redirects to silo route that renders the intake form` (Expected values to be strictly equal: `404 !== 200`)
- `✖ Scenario A: Client acquisition lifecycle flow` (AssertionError: Trust banner not visible)
- `✖ Scenario B: Advocate credit reload flow` (Expected values to be strictly equal: `400 !== 200`)

---

## 2. Logic Chain
1. In `src/lib/reviews.js`, the local cache implementation relies on synchronous file reads (`fs.readFileSync`) and writes (`fs.writeFileSync`) without any transactional controls or file locking.
2. In Phase 1 (Single Process Concurrency), because there are no asynchronous yield points (`await`) between `readLocalCache()` and `writeLocalCache()`, each request executing in the Node event loop runs to completion sequentially. Thus, no updates are lost.
3. In Phase 2 (Multi-Process Concurrency), multiple independent OS processes execute `submitReview()` simultaneously, which simulates a multi-worker server environment (e.g. PM2 cluster, Kubernetes pods, or Serverless functions).
4. Because these processes run concurrently, Process A reads the file before Process B writes its update. When Process B writes, it overwrites Process A's modifications.
5. In our test, this race condition resulted in 45 out of 50 reviews being lost/overwritten (90% data loss).
6. Therefore, the Reviews filesystem cache fallback is vulnerable to lost updates and cannot support multi-process concurrent access.

---

## 3. Caveats
- Testing was done on a single-node system running Windows 11.
- We manually cleared Supabase credentials (`process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the test runner to force-run the local filesystem cache path.
- The test did not verify network file system locking (NFS), but local filesystem write collisions were proven.

---

## 4. Conclusion
The Reviews module local filesystem fallback cache implementation works correctly on a single-threaded sequential load, but fails to persist data and results in critical lost updates under multi-process concurrent writes (90% data loss under 50 parallel requests). To resolve this, a lockfile mechanism or atomic file-replacement technique (e.g., using write-and-rename) with retries must be introduced, or the system must enforce strict single-process sequencing.

Additionally, several E2E tests are failing in the main branch, highlighting potential mismatches in canonical tags, robots.txt, SQL sanitization responses, Stripe webhooks, sitemaps, and redirects.

---

## 5. Verification Method
To reproduce the findings:
1. Navigate to the project root: `c:\Users\pro\justice\justice-nextjs-app`
2. Run the concurrency test suite:
   ```bash
   node tests/reviews-concurrency-test.js
   ```
3. Observe Phase 1 succeeding and Phase 2 failing with lost updates (typically 40+ reviews lost).
4. To view the E2E failures, run:
   ```bash
   node tests/e2e/runner.js
   ```
