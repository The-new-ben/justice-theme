## 2026-06-08T18:21:53Z
You are teamwork_preview_explorer.
Your working directory is: c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m2_3
Project root: c:\Users\pro\justice\justice-nextjs-app
Milestone SCOPE: c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m2\SCOPE.md

Your task:
1. Examine the codebase structure and conventions, including existing database configuration (e.g. `src/lib/supabase.js`) and API endpoints (e.g. `src/app/api/leads/route.js`).
2. Design a Supabase schema for the `reviews` table. It must support:
   - id (UUID or auto-incrementing integer)
   - reviewer_name (text)
   - reviewer_role (text or enum, representing source: Client, Colleague, Google)
   - rating (integer, e.g., 1-5)
   - content (text)
   - approval_status (boolean, default false, or 'pending'/'approved' text status)
   - created_at (timestamp)
3. Propose a robust mock seed file and a local filesystem fallback database caching mechanism (e.g. reading/writing a local JSON cache file like `src/lib/reviews-cache.json` or `tmp/reviews.json` or inside a helper `src/lib/reviews.js`) so that if Supabase is unavailable (e.g., URL/keys are blank or there's an API error), the system reads/writes to this cache. Make sure it works completely offline and maintains state across restarts.
4. Propose code designs for the three API endpoints:
   - `GET /api/reviews` (retrieves approved reviews, with optional role filter, e.g., role=Client)
   - `POST /api/reviews` (submits a new review with status pending approval)
   - `PUT /api/reviews/approve` (approves a review by its ID, with mock security checks)
5. Write your findings and recommendations to handoff.md in your working directory and send a message when done.
