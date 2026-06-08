# Handoff Report — Milestone 2: Reviews Database Schema, Mock Seed, and API Endpoints

This report details the findings and proposals for the reviews database schema, local filesystem fallback, mock seeding, and API endpoints structure.

---

## 1. Observation

Direct observations and references in the codebase:
- **Supabase Configuration**: In `src/lib/supabase.js`, the Supabase client checks for credentials and falls back to `null` if not configured:
  ```javascript
  // Line 7-9:
  export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;
  ```
- **Local Env Configuration**: In `.env.local`, the Supabase keys are currently empty:
  ```env
  # Line 13-14:
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  ```
  This guarantees that in the default local development environment, the Supabase client resolves to `null`.
- **API Conventions**: In `src/app/api/leads/route.js`, if Supabase operations fail, the API logs the failure and falls back to returning the memory-constructed lead without persisting it to any local cache:
  ```javascript
  // Line 75-77:
  } else {
    console.error('Supabase insert failed, falling back to local simulation:', error);
  }
  ```
- **Interface Requirements**: The file `.agents/sub_orch_m2/SCOPE.md` outlines the following API requirements:
  - `GET /api/reviews?role=Client` (optional filter: Client/Colleague/Google) returning `{ success: true, reviews: Array, aggregateRating: { ratingValue, reviewCount } }`
  - `POST /api/reviews` accepting `{ reviewer_name, reviewer_role, rating, content }` and returning `{ success: true, review: Object }`
  - `PUT /api/reviews/approve` accepting `{ id }` and returning `{ success: true, approved: true }`

---

## 2. Logic Chain

From these observations, we constructed our proposed design:
1. **Fallback Database Store (`src/lib/reviews.js`)**:
   - Because the Supabase client is `null` by default on local development machines, a helper library must mediate database access.
   - The helper tries Supabase queries first. If Supabase is `null` or if a query throws an error, it falls back to a JSON-based database cache (`src/lib/reviews-cache.json`).
   - If `reviews-cache.json` does not exist on the filesystem, it seeds it automatically with our predefined mock reviews list, making the workspace self-contained and ready for offline use.
   - It also maintains a secondary memory-only cache in case the serverless environment has a read-only filesystem (e.g. Netlify/Vercel functions), avoiding unhandled disk write crashes.

2. **Supabase Schema Design (`schema.sql`)**:
   - Fields align with requirements: `id` (UUID), `reviewer_name` (text), `reviewer_role` (text check-constrained to Client, Colleague, Google), `rating` (int 1-5), `content` (text), `approval_status` (boolean), `created_at` (timestamp).
   - Text + Check constraint is proposed for `reviewer_role` to simplify modifications and queries, with the enum approach documented as a valid alternative.
   - Indexes on `approval_status`, `reviewer_role`, and `created_at` ensure query performance.
   - Default RLS policies enforce that only approved reviews are publicly readable, while any client can submit a review (which goes to pending status by default).

3. **API Implementation Design**:
   - `GET /api/reviews` maps query parameters to the helper's filter function and automatically returns the calculated aggregate ratings (`ratingValue` and `reviewCount`) computed on query.
   - `POST /api/reviews` validates inputs and submits reviews in a pending state (`approval_status: false`).
   - `PUT /api/reviews/approve` expects authorization headers (bearer token or custom header) matching `process.env.ADMIN_API_KEY` (or fallback `'mock-admin-secret-key'`) before updating the review status to `true`.

---

## 3. Caveats

- **No Online Connection**: We could not test live Supabase connections because the network is `CODE_ONLY` and credentials are empty. However, the helper's fallback mechanism was designed to handle database exceptions gracefully.
- **Concurrent File IO**: For a local file-system fallback database, concurrent writes can theoretically collide. We use synchronous-like write calls in the local helper. Since this is only for local simulation and developer testing, it is deemed appropriate.
- **Admin Authentication**: The mock security check is simple. In a production release, it should be replaced by real Next-Auth middleware or Supabase JWT auth verification.

---

## 4. Conclusion

The system is fully designed and prepared for implementation.
We have created proposed implementation files in the explorer agent folder:
- **`schema.sql`**: Supabase table definition script.
- **`proposed_reviews_cache_seed.json`**: Static Hebrew mock reviews dataset.
- **`proposed_reviews_helper.js`**: Standardized database adapter with Supabase and JSON fallbacks.
- **`proposed_api_reviews_route.js`**: API code design for GET and POST.
- **`proposed_api_reviews_approve_route.js`**: API code design for PUT with security checks.

---

## 5. Verification Method

Once these files are implemented in their corresponding directories:
1. **Verification of Schema**:
   Run the `schema.sql` migration against a Supabase database. Ensure the table `public.reviews` is successfully created with correct column constraints.
2. **Verification of Local Fallback (Supabase URL/Key blank)**:
   - Call `GET /api/reviews` without headers: it should read the seed reviews from `src/lib/reviews-cache.json` and return a successful JSON response with 4 approved reviews and aggregate rating `4.8`.
   - Call `GET /api/reviews?role=Client`: it should return only client reviews.
   - Call `POST /api/reviews` with body:
     ```json
     {
       "reviewer_name": "ישראל ישראלי",
       "reviewer_role": "Client",
       "rating": 5,
       "content": "שירות פנטסטי!"
     }
     ```
     Verify that the response returns the review with `approval_status: false` and a generated ID, and check that `src/lib/reviews-cache.json` now contains this new review.
   - Call `PUT /api/reviews/approve` with body `{ "id": "<new_review_id>" }` and headers:
     - Without headers -> should return `401 Unauthorized`.
     - With header `Authorization: Bearer mock-admin-secret-key` -> should return `success: true, approved: true` and write `approval_status: true` back to the JSON file.
3. **Lint & Build**:
   Verify code style and structure by running:
   `npm run lint`
   `npm run build`
