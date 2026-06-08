# Handoff Report: Milestone 2 — Reviews Database, Caching, and API Endpoints Design

This report outlines the codebase investigation, database design, filesystem caching fallback mechanism, and API route structures proposed for implementing the reviews module.

---

## 1. Observation

Direct observations of the codebase structure:
1. **Next.js Version and Setup**: `package.json` uses Next.js version 16 (`"next": "16.2.7"`) and React 19 (`"react": "19.2.4"`). It includes `@supabase/supabase-js` version `^2.108.0` as a dependency.
2. **Path Alias Mapping**: `jsconfig.json` defines a path alias resolver on lines 3-5:
   ```json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```
   All imports from `src/` can be imported using the `@/` prefix (e.g. `import { supabase } from '@/lib/supabase'`).
3. **Supabase Initialization**: `src/lib/supabase.js` on lines 7-9 defines:
   ```javascript
   export const supabase = (supabaseUrl && supabaseAnonKey) 
     ? createClient(supabaseUrl, supabaseAnonKey) 
     : null;
   ```
   If Supabase is not configured via environment variables, the exported client is `null`.
4. **Resiliency Patterns in API Routes**: `src/app/api/leads/route.js` implements a database fallback pattern:
   - Line 47: `if (supabase) { ... }` checks if client is initialized.
   - Lines 75-77: logs errors but does not crash the request, allowing local/simulated fallback:
     ```javascript
     } else {
       console.error('Supabase insert failed, falling back to local simulation:', error);
     }
     ```
5. **No Existing Reviews Logic**: The workspace does not contain any database schemas, helper files, or API endpoints referencing "reviews". All files were designed from scratch.

---

## 2. Logic Chain

1. **Storage Hybrid Model**: Since `supabase` is `null` when variables are missing, any database-related reviews logic must check `if (supabase)`. To prevent failure in offline or local development scenarios, we must write a wrapper service (`src/lib/reviews.js`) that handles the database query and catches any errors (including network issues or table-not-exist errors).
2. **Local Caching Solution**: If Supabase is offline or not configured, the service must fallback to a local JSON file (`src/lib/reviews-cache.json`).
   - Using `process.cwd()` is standard in Next.js server context to resolve absolute paths relative to the project root: `path.join(process.cwd(), 'src/lib/reviews-cache.json')`.
   - On startup, if the cache file is absent, we auto-create it with standard mock seed data (as defined in `proposed_reviews-cache.json`) to provide immediate, rich visual data.
3. **Calculated Aggregate Ratings**: The contract for `GET /api/reviews` requires `aggregateRating: { ratingValue, reviewCount }`.
   - To keep this calculation accurate, we compute the average and total count of *all approved reviews* before returning the response.
   - In Supabase, this is done by fetching the ratings for all approved reviews. In the local cache, it is computed in memory.
4. **Mock Admin Security**: The `PUT /api/reviews/approve` route requires security checks.
   - We implement standard check patterns by checking the `Authorization` header (`Bearer <secret>`) or a custom header `X-Admin-API-Key`.
   - The API compares this with `process.env.ADMIN_APPROVE_SECRET` (falling back to a development secret `justice-admin-secret-key-2026` to allow local developer testing out-of-the-box).

---

## 3. Caveats

- **Filesystem Persistence in Serverless**: On serverless environments (like Vercel), local filesystem writes to files in `src/` are not persisted across separate function invocations because the container is stateless. However, this satisfies the requirements of a local filesystem fallback for development, self-hosted deployments, or offline mode. If a production-ready persistent disk is required on serverless, a temporary mount or remote backup DB would be necessary.
- **Admin Authentication**: The mock security check is shared-secret based. For actual production setups, it is recommended to hook into Supabase Auth (`supabase.auth.getUser()`) to ensure the user is part of an admin role.
- **UUID vs. Auto-Incrementing IDs**: When using a hybrid environment (where local cache uses string-based random IDs and Supabase uses UUIDs or integer IDs), comparing IDs must use string conversion (`String(r.id) === String(id)`) to prevent type mismatches.

---

## 4. Conclusion

The design is fully prepared for implementation. Five files have been written to the agent's folder for clean separation of concerns and direct transfer:
1. `schema.sql`: Contains the Supabase PostgreSQL definition for the `reviews` table, database constraints, indices, and RLS (Row-Level Security) policies allowing public read of approved, public write of pending, and authenticated write/read of all reviews.
2. `proposed_reviews-cache.json`: Contains 7 high-quality mock reviews (in Hebrew and English) that seed the application.
3. `proposed_reviews.js`: Encapsulates all query wrapper logic, error handling, filesystem read/write fallbacks, and aggregate calculation logic.
4. `proposed_api_reviews_route.js`: Implements the `GET /api/reviews` (with role filtering and aggregate ratings) and `POST /api/reviews` (submits pending reviews) Next.js App Router route handlers.
5. `proposed_api_reviews_approve_route.js`: Implements the `PUT /api/reviews/approve` endpoint with administrative bearer token verification.

---

## 5. Verification Method

To independently verify the proposed design after implementation:

1. **Deployment Steps**:
   - Save `schema.sql` into the Supabase SQL editor and run it.
   - Save `proposed_reviews.js` to `src/lib/reviews.js`.
   - Save `proposed_reviews-cache.json` to `src/lib/reviews-cache.json`.
   - Save `proposed_api_reviews_route.js` to `src/app/api/reviews/route.js`.
   - Save `proposed_api_reviews_approve_route.js` to `src/app/api/reviews/approve/route.js`.

2. **Compilation Verification**:
   - Run the project build script to ensure there are no compilation or import path resolution errors:
     ```powershell
     npm run build
     ```

3. **API Endpoint Test Commands (cURL)**:
   - **Fetch Approved Reviews** (should fetch all approved reviews from the seed cache or DB):
     ```powershell
     curl http://localhost:3000/api/reviews
     ```
   - **Fetch Filtered Approved Reviews**:
     ```powershell
     curl "http://localhost:3000/api/reviews?role=Client"
     ```
   - **Submit New Review** (should insert a review defaulting to `approval_status: false`):
     ```powershell
     curl -X POST -H "Content-Type: application/json" -d '{"reviewer_name": "יוסי חדד", "reviewer_role": "Client", "rating": 5, "content": "חוויה מעולה, מומלץ!"}' http://localhost:3000/api/reviews
     ```
   - **Approve Review without Credentials** (should return 401 Unauthorized):
     ```powershell
     curl -X PUT -H "Content-Type: application/json" -d '{"id": "rev_5"}' http://localhost:3000/api/reviews/approve
     ```
   - **Approve Review with Admin Credentials** (should succeed and return `success: true`):
     ```powershell
     curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer justice-admin-secret-key-2026" -d '{"id": "rev_5"}' http://localhost:3000/api/reviews/approve
     ```
