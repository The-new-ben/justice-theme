# Family/Divorce Live vs Draft Comparison - 2026-05-21

## Status

- VERIFIED TOOLING: added `tools/compare-family-divorce-live-vs-drafts.mjs`.
- VERIFIED LOCAL: compared the seven current live public snapshots against the seven clean public-body drafts.
- GENERATED: `reports/family-divorce-live-vs-draft-comparison-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-live-vs-draft-comparison-2026-05-21.csv`.
- NOT PUBLISHED: no CMS page body, title, H1, meta, slug, redirect, canonical, noindex, sitemap or taxonomy was changed.

## Batch Completed

Compared `7` Family/Divorce target pages:

- Live public snapshots total: `19,236` words.
- Clean draft bodies total: `11,673` words.
- Net draft reduction: `-7,563` words.
- Average draft/live ratio: about `61%`.

## Page Decisions

| Target | Live words | Draft words | Ratio | Decision |
|---|---:|---:|---:|---|
| `/divorce-lawyer/` | 3,407 | 2,070 | 0.61 | MERGE_REVIEW_REQUIRED |
| `/consensual-divorce/` | 2,645 | 1,628 | 0.62 | MERGE_REVIEW_REQUIRED |
| `/divorce-mediation/` | 2,690 | 1,764 | 0.66 | MERGE_REVIEW_REQUIRED |
| `/divorce-property-division/` | 2,639 | 1,574 | 0.60 | MERGE_REVIEW_REQUIRED_HIGH |
| `/family-dispute-resolution/` | 2,297 | 1,728 | 0.75 | MERGE_REVIEW_REQUIRED |
| `/child-support/` | 2,963 | 1,446 | 0.49 | MERGE_REVIEW_REQUIRED_HIGH |
| `/child-custody/` | 2,595 | 1,463 | 0.56 | MERGE_REVIEW_REQUIRED_HIGH |

## Interpretation

The clean drafts are suitable for controlled review because they passed static QA, but they should not be uploaded as blind overwrites. All seven drafts are materially shorter than the current live public pages.

This is not automatically bad. Some live pages may include repeated navigation, boilerplate, or weaker content. But before upload, the operator should run a side-by-side merge review and preserve any stronger live sections, especially:

- `/child-support/`
- `/child-custody/`
- `/divorce-property-division/`

These three have the largest retention risk based on draft/live word ratio.

## Upload Readiness Impact

- READY: live snapshots and clean drafts now exist for all seven target pages.
- READY: repeatable comparison tooling exists.
- BLOCKED: first upload cannot be approved as a direct overwrite package.
- REQUIRED: page-by-page merge review before final CMS body approval.
- STILL REQUIRED: WordPress editor/database backup before actual CMS execution.
- STILL REQUIRED: GSC API confirmation and decisions for the five protected source homepage redirects before URL migration.

## Verification

- VERIFIED LOCAL: `node --check tools/compare-family-divorce-live-vs-drafts.mjs`.
- VERIFIED LOCAL: `$env:JUSTICE_WRITE_REPORT='1'; node tools/compare-family-divorce-live-vs-drafts.mjs`.
- VERIFIED CSV: report parses and contains seven comparison rows.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
