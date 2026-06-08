# Scope: Milestone 2 — Reviews Database Schema, Mock Seed, and API Endpoints

## Architecture
- Module: Reviews API and Storage fallbacks.
- Supabase reviews table schema design.
- Fallback local filesystem database cache for reviews (`src/lib/reviews-cache.js` or similar).
- API Endpoints:
  - `GET /api/reviews`
  - `POST /api/reviews`
  - `PUT /api/reviews/approve`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Database Schema & Local Mock Seed Setup | Design Supabase reviews table schema and create mock seed file / fallback mechanism | None | DONE |
| 2 | GET API Endpoint | Implement `GET /api/reviews` retrieving approved reviews with filter support | M1 | DONE |
| 3 | POST API Endpoint | Implement `POST /api/reviews` allowing submission of pending reviews | M1 | DONE |
| 4 | PUT API Endpoint | Implement `PUT /api/reviews/approve` allowing review approval with security checks | M1 | DONE |

## Interface Contracts
### GET /api/reviews
- Request: `GET /api/reviews?role=Client` (optional filter: Client/Colleague/Google)
- Response: `{ success: true, reviews: Array, aggregateRating: { ratingValue, reviewCount } }`
- Response on error: `{ success: false, error: String }`

### POST /api/reviews
- Request: `POST /api/reviews` with JSON body:
  `{ reviewer_name, reviewer_role, rating, content }`
  Note: `reviewer_role` should be one of `'Client'`, `'Colleague'`, `'Google'`.
- Response: `{ success: true, review: Object }`
- Response on error: `{ success: false, error: String }`

### PUT /api/reviews/approve
- Request: `PUT /api/reviews/approve` with JSON body:
  `{ id }`
- Response: `{ success: true, approved: true }`
- Response on error: `{ success: false, error: String }`
