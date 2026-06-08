# JUS-TICE Portal Upgrade Plan

## Architecture & Integration Strategy
The JUS-TICE portal requires integration of:
1. A multi-source reviews cache (Supabase db / local fallback) with dynamic JSON-LD schemas.
2. Programmatic SEO (sitemaps, canonical tags, search pings).
3. Client acquisition funnels with GTM event tracking.
4. An E-E-A-T compliance layer listing our 20-member Advisory Board.

The codebase runs in Next.js. We will deploy the Dual-Track Project pattern:
- **Track 1: E2E Testing**: Builds requirement-driven tests covering Tiers 1-4.
- **Track 2: Implementation**: Implements feature sets sequentially and runs E2E tests against them.

## Milestones

### Milestone 1: E2E Testing Infrastructure Setup (Testing Track)
- Create `TEST_INFRA.md`.
- Build the opaque-box test runner/suite.
- Implement Tier 1 (Feature Coverage), Tier 2 (Boundary Cases), Tier 3 (Cross-Feature Combinations), and Tier 4 (Real-world scenarios) tests.
- Target output: `TEST_READY.md` containing coverage matrix.

### Milestone 2: Reviews Database Schema, Seed & API
- Define a Supabase schema for reviews table (`reviews`) supporting Clients, Colleagues, and Google.
- Add local file fallback database cache to support environment-independent running.
- Build API routes:
  - `GET /api/reviews` - fetch approved reviews (with optional type filtering).
  - `POST /api/reviews` - submit pending review (moderation-enabled).
  - `PUT /api/reviews/approve` - approve review (requires mock security checks or key).

### Milestone 3: Milky Glassmorphic UI & JSON-LD Integration
- Implement the review components using silver/white premium milky glassmorphic styling (backdrop blur, frosted borders).
- Dynamically inject JSON-LD `AggregateRating` and `Review` markup onto pages using database/cached records.

### Milestone 4: SEO Silo Routing & Programmatic Indexing
- Reorganize Next.js routes to follow the silo architecture:
  - `/practice-areas/[category]` for pillars (6 categories: real-estate-law, medical-malpractice, labor-law, criminal-law, family-law, personal-injury)
  - `/practice-areas/[category]/[slug]` for spokes (guides, calculators, tools)
- Create routing folders and skeleton files establishing page structure, canonical links, reviewedBy E-E-A-T schemas, and layouts.
- Add a dynamic breadcrumb component with `BreadcrumbList` schema and update the header menu navigation (Apple-style navigation bar, practice areas dropdown, etc.) to match.
- Build dynamic sitemap logic in `src/app/sitemap.js` including practice area pillar/spoke routes and dynamic lawyer routes.
- Enforce strict anti-cannibalization and copywriting guidelines (no em-dashes, no AI transition templates, explicit Israeli laws citation).
- Implement search engine ping mechanism.

### Milestone 5: Intake Funnels, GTM dataLayer & Compliance Copy
- Design optimized intake form in Hebrew with responsive field transitions.
- Hook up GTM dataLayer push on successful intake submission.
- Ensure Bar Association compliance copy is integrated with appropriate disclaimers.

### Milestone 6: E-E-A-T Advisory Board Integration
- Display the verified credentials of the 20-member Advisory Board.
- Inject structured schema data linking pages to these verified experts.

### Milestone 7: Verification, Audit & Adversarial Hardening (Tier 5)
- Verify 100% pass rate on all E2E tests.
- Execute white-box coverage checks and generate adversarial tests.
- Gate milestone on a clean Forensic Audit report.
