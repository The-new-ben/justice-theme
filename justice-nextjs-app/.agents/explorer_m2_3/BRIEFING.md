# BRIEFING — 2026-06-08T21:30:00+03:00

## Mission
Investigate the codebase for conventions, design the Supabase reviews table schema, design the local caching fallback mechanism, and design the three API endpoints for reviews.

## 🔒 My Identity
- Archetype: Teamwork explorer
- Roles: investigator, reporter
- Working directory: c:\Users\pro\justice\justice-nextjs-app\.agents\explorer_m2_3
- Original parent: 5dfa91c4-2791-4868-8077-a71918849934
- Milestone: Reviews Database, Cache & API Endpoints Design (Milestone 2)

## 🔒 Key Constraints
- Read-only investigation — do NOT implement (no writing or modifying files in src/ except metadata/reports in explorer_m2_3 directory)
- Operating in CODE_ONLY network mode. No external HTTP requests.

## Current Parent
- Conversation ID: 5dfa91c4-2791-4868-8077-a71918849934
- Updated: 2026-06-08T21:30:00+03:00

## Investigation State
- **Explored paths**:
  - `src/lib/supabase.js`
  - `src/app/api/leads/route.js`
  - `src/app/api/checkout/route.js`
  - `src/app/api/webhooks/route.js`
  - `package.json`
- **Key findings**:
  - Next.js 16 environment using standard ES modules and Next.js App Router.
  - Supabase client initialized via `src/lib/supabase.js`. If offline or keys missing, it evaluates to `null`.
  - Existing endpoints (e.g. leads API) check `if (supabase) { ... }` for runtime storage resilience.
- **Unexplored areas**: None. The design targets all specified API routes, schemas, and offline cache fallbacks.

## Key Decisions Made
- Designed a comprehensive Supabase table `reviews` with database constraints and 5 granular RLS policies.
- Proposed `src/lib/reviews.js` helper service which encapsulates Supabase operations and transparently falls back to local JSON filesystem cache file `src/lib/reviews-cache.json` on error or empty configuration.
- Calculated the `aggregateRating` conforming to the required contract: `{ ratingValue, reviewCount }` for all approved reviews.
- Designed `GET /api/reviews`, `POST /api/reviews`, and `PUT /api/reviews/approve` with mock security check based on `ADMIN_APPROVE_SECRET` env variable fallback.

## Artifact Index
- `schema.sql` — Supabase reviews table schema and RLS policies
- `proposed_reviews-cache.json` — Prepopulated mock reviews seed database file
- `proposed_reviews.js` — Wrapper helper service for DB connection and caching logic
- `proposed_api_reviews_route.js` — GET & POST reviews route handlers
- `proposed_api_reviews_approve_route.js` — PUT approve route handler with security checks

