# Scope: E2E Testing Track

## Architecture
- **E2E Test Runner**: Independent test execution framework (Node.js or Deno script runner executing E2E validation logic).
- **Target Application**: Next.js app serving routes like reviews, lead forms, sitemaps, and canonical link headers.
- **Verification Method**: Programmatic HTTP assertions simulating client requests and checking response bodies, HTML structure, JSON-LD schemas, GTM pushes (via standard dataLayer emulation), and database entries.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Test Plan Formulation | Explore codebase, analyze features, write `TEST_INFRA.md` | None | DONE |
| 2 | Test Infra & Runner | Establish testing directory, base assertion helpers, run commands, setup test DB setup if needed | M1 | DONE |
| 3 | Tier 1 Features | Feature coverage E2E tests (>=5 per feature: reviews, intake/leads, schema/EEAT, sitemaps/canonical) | M2 | DONE |
| 4 | Tier 2 Boundaries | Boundary & corner cases (>=5 per feature: empty, invalid formats, database connection issues, unauthorized access) | M3 | DONE |
| 5 | Tier 3 Combinations | Cross-feature combinations (leads + GTM, reviews caching + database, schemas + dynamically updated records) | M4 | DONE |
| 6 | Tier 4 Workloads | Real-world application scenarios (end-to-end user review submission, admin approval, SEO indexing, lead conversion) | M5 | DONE |
| 7 | Execution & Ready | Final full execution, confirmation of 100% pass, and writing `TEST_READY.md` | M6 | DONE |

## Interface Contracts
- E2E tests run without external network access (mocking or localized verification).
- Tests output standard exit code (0 for success, non-zero for failure).
- Coverage checklist mapping back to `ORIGINAL_REQUEST.md`.
