# Project: JUS-TICE Portal Upgrade

## Architecture
The JUS-TICE legal tech portal is built on Next.js. Key modules:
1. **Reviews Module (`src/app/api/reviews`, UI components)**: Manages reviews from Clients, Colleagues, and Google.
2. **SEO & Indexing (`src/app/sitemap.js`, layouts)**: Handles sitemap generation, canonical tags, and search console pings.
3. **Conversion Funnels (`src/app/[slug]/page.js`, intake forms)**: Manages client leads ingestion and triggers Google Tag Manager conversion events.
4. **Advisory Board (`src/app/page.js` or separate section)**: Shows verified credentials of 20 experts and injects E-E-A-T compliant JSON-LD structured data.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | E2E Testing Infra Setup | Create E2E test harness & Tiers 1-4 tests | None | DONE |
| 2 | Reviews DB Schema & API | Supabase table schema, mock seeds, read/write/approve endpoints | M1 | DONE |
| 3 | Reviews UI & JSON-LD | Milky Glassmorphic UI & dynamic JSON-LD structured data | M2 | IN_PROGRESS (Conv: b6cfb606-be81-477b-9c02-708b924d97f7) |
| 4 | SEO Silo Routing & Programmatic SEO | Silo routes, breadcrumbs, navigation, sitemaps, canonicals, E-E-A-T schemas | M1 | IN_PROGRESS (Conv: 3bfc8fc0-653b-4321-9792-b25600c171b9) |
| 5 | Lead-Routing Funnel & GTM | Intake forms, GTM event listeners, compliance copywriting | M1 | DONE |
| 6 | E-E-A-T Advisory Board | Expert Advisory Board UI, credentials, dynamic schema structured data | M1 | IN_PROGRESS (Conv: fbe30b9b-9e56-40d4-bf38-6ea4937e0cd2) |
| 7 | Verification, Audit & Hardening | Opaque-box test verification, adversarial testing, forensic audit | M2-M6 | PLANNED |

## Interface Contracts
### Reviews API ↔ Reviews UI
- `GET /api/reviews`: Returns `{ success: true, reviews: Array, aggregateRating: { ratingValue, reviewCount } }`
- `POST /api/reviews`: Submits `{ reviewer_name, reviewer_role, rating, content }` -> Returns `{ success: true, review }`
- `PUT /api/reviews/approve`: Submits `{ id }` with approval auth -> Returns `{ success: true, approved: true }`

### Leads API ↔ Intake Form
- `POST /api/leads`: Submits `{ title, type, typeLabel, urgency, value, description, clientName, clientPhone, clientEmail }` -> Returns `{ success: true, lead, dbSaved }`
