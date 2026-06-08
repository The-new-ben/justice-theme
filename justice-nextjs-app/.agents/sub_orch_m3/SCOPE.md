# Scope: Milestone 3 (Milky Glassmorphic UI & JSON-LD Integration)

## Architecture
- Category pages under `src/app/practice-areas/[category]/page.js` render reviews.
- Globals CSS file `src/app/globals.css` contains variables for glassmorphism.
- Structured data needs to inject LocalBusiness, LegalService, or LegalArticle with nested AggregateRating/Review.
- Review sources: client, colleague, google reviews.
- Strict Hebrew copywriting constraints.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Analysis | Investigate existing reviews data, UI, layout, CSS variables, tests, and JSON-LD implementation. | None | DONE |
| 2 | UI Glassmorphism & Reviews Upgrade | Refactor practice area pages/widgets to render client, colleague, google reviews with glassmorphic styling, respecting copywriting constraints. | M1 | DONE |
| 3 | JSON-LD Dynamic Schema Integration | Inject structured data for reviews on the category pages correctly nested. | M2 | DONE |
| 4 | Verification & Hardening | Review changes, run challenger testing, perform integrity audits, run E2E tests. | M3 | IN_PROGRESS (Reviewers, Challengers, Auditor) |
