# Family/Divorce Child-Support Merge Decisions - 2026-05-21

## Status

- VERIFIED TOOLING: added `tools/resolve-family-divorce-child-support-merge.mjs`.
- VERIFIED LOCAL: resolved all `/child-support/` live candidate rows from the high-risk merge worksheet.
- GENERATED: `reports/family-divorce-child-support-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-support-merge-decisions-2026-05-21.csv`.
- NOT PUBLISHED: this is a pre-upload decision layer only; no public page body or CMS field changed.

## Batch Completed

Reviewed `35` current-live candidate rows for `/child-support/`.

Decision outcome:

- `4` rows require concise draft merges.
- `25` rows are covered by the clean draft and require no draft edit.
- `6` rows are UI, CTA, taxonomy or related-link fragments and should not be imported into the article body.

## Required Draft Merges

The decision pass approved four controlled draft merges:

1. Add included-vs-separate expense clarity to the "what child support includes" section.
2. Add practical extraordinary-expense mechanics: request path, response time, receipts, dispute handling and urgent medical exceptions.
3. Add a change-of-support review checklist.
4. Add communication/evidence tracking for expense requests, refusals and missing documents.

## Upload Readiness Impact

- READY: `/child-support/` live candidate rows have final decisions.
- READY: UI/CTA/related-link fragments are explicitly excluded from article-body import.
- FIXED: the four approved draft merges were applied in `content-drafts/child-support-public-body-he.md`.
- READY: all three high-risk Family/Divorce pages now have merge decisions and applied draft merges.
- BLOCKED: owner/legal/source approval is still required before CMS upload.
- BLOCKED: actual WordPress editor/database backup is still required before CMS execution.

## Verification

- VERIFIED LOCAL: `node --check tools/resolve-family-divorce-child-support-merge.mjs`.
- VERIFIED LOCAL: `$env:JUSTICE_WRITE_REPORT='1'; node tools/resolve-family-divorce-child-support-merge.mjs`.
- VERIFIED CSV: `35` live rows resolved with no unresolved section orders.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
