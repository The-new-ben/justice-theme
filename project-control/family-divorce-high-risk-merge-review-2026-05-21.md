# Family/Divorce High-Risk Merge Review - 2026-05-21

## Status

- VERIFIED TOOLING: added `tools/prepare-family-divorce-merge-review.mjs`.
- VERIFIED LOCAL: generated a merge-review worksheet for the three highest-retention-risk Family/Divorce pages.
- GENERATED: `reports/family-divorce-high-risk-merge-review-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-high-risk-merge-review-2026-05-21.csv`.
- NOT PUBLISHED: this is a review worksheet only; no public page body or CMS field changed.

## Follow-Up Resolution

- VERIFIED LOCAL: `/divorce-property-division/` live candidate rows were resolved in `project-control/family-divorce-property-division-merge-decisions-2026-05-21.md`.
- RESULT: `35` live rows resolved into `6` merge edits, `23` covered/no-action rows and `6` UI/CTA/taxonomy/related-link skips.
- STILL BLOCKED: `/child-support/` and `/child-custody/` still need row-level merge decisions.
- STILL BLOCKED: `/divorce-property-division/` needs the six approved draft edits and static QA rerun before upload approval.

## Batch Completed

Reviewed the three pages that the live-vs-draft comparison marked as highest risk:

- `/child-support/`
- `/child-custody/`
- `/divorce-property-division/`

Worksheet size:

- `165` total rows.
- `60` draft base sections marked `KEEP_DRAFT_BASE`.
- `30` live candidate sections marked `REVIEW_FOR_MERGE`.
- `46` live candidate sections marked `PARTIAL_OVERLAP_REVIEW`.
- `29` live candidate sections marked `COVERED_BY_DRAFT`.

## Page Summary

| Target | Draft sections | Live candidates | Review for merge | Partial overlap | Covered |
|---|---:|---:|---:|---:|---:|
| `/child-support/` | 18 | 35 | 4 | 17 | 14 |
| `/child-custody/` | 20 | 35 | 11 | 15 | 9 |
| `/divorce-property-division/` | 22 | 35 | 15 | 14 | 6 |

## Interpretation

The clean drafts remain the base because they already passed static QA for internal notes, fake trust language, required links and disclaimers. However, each high-risk page has live content that should be reviewed before overwrite.

Priority order:

1. `/divorce-property-division/` - largest number of live sections that appear missing from the draft.
2. `/child-custody/` - sensitive child-arrangements page with many live-only candidates.
3. `/child-support/` - lowest draft/live word ratio, but fewer live-only candidates because many live sections partly overlap the draft.

## Upload Readiness Impact

- READY: high-risk merge worksheet exists.
- READY: draft base sections and live-only candidate sections are separated for operator review.
- BLOCKED: these three pages should not be uploaded until `REVIEW_FOR_MERGE` and `PARTIAL_OVERLAP_REVIEW` rows are resolved into keep/merge/rewrite/skip decisions.
- STILL REQUIRED: WordPress editor/database backup before CMS execution.
- STILL REQUIRED: owner/legal/source approval.

## Verification

- VERIFIED LOCAL: `node --check tools/prepare-family-divorce-merge-review.mjs`.
- VERIFIED LOCAL: `$env:JUSTICE_WRITE_REPORT='1'; node tools/prepare-family-divorce-merge-review.mjs`.
- VERIFIED CSV: report parses as `165` rows.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
