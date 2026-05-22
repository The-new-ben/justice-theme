# Family/Divorce Child-Custody Merge Decisions - 2026-05-21

## Status

- VERIFIED TOOLING: added `tools/resolve-family-divorce-child-custody-merge.mjs`.
- VERIFIED LOCAL: resolved all `/child-custody/` live candidate rows from the high-risk merge worksheet.
- GENERATED: `reports/family-divorce-child-custody-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.csv`.
- NOT PUBLISHED: this is a pre-upload decision layer only; no public page body or CMS field changed.

## Batch Completed

Reviewed `35` current-live candidate rows for `/child-custody/`.

Decision outcome:

- `9` rows require concise draft merges.
- `20` rows are covered by the clean draft and require no draft edit.
- `6` rows are UI, CTA, taxonomy or related-link fragments and should not be imported into the article body.

## Required Draft Merges

The decision pass approved nine controlled draft merges:

1. Add communication/risk/professional-factor language to the best-interests section.
2. Add cautious reference to professional reports or recommendations where appointed.
3. Add parenting-time agreement checklist.
4. Add extra-detail triggers: distance, shifts, difficult communication, young children and repeated execution problems.
5. Add repeated lateness/cancellation documentation guidance.
6. Add communication-channel details.
7. Add response-time, school, medical and lateness documentation details.
8. Add friction-reduction/children-not-as-messengers caution.
9. Add child-expense coordination boundary separate from child-support analysis.

## Upload Readiness Impact

- READY: `/child-custody/` live candidate rows have final decisions.
- READY: UI/CTA/related-link fragments are explicitly excluded from article-body import.
- FIXED: the nine approved draft merges were applied in `content-drafts/child-custody-public-body-he.md`.
- BLOCKED: owner/legal/source approval is still required before CMS upload.
- BLOCKED: actual WordPress editor/database backup is still required before CMS execution.
- BLOCKED: `/child-support/` still needs row-level merge decisions.

## Verification

- VERIFIED LOCAL: `node --check tools/resolve-family-divorce-child-custody-merge.mjs`.
- VERIFIED LOCAL: `$env:JUSTICE_WRITE_REPORT='1'; node tools/resolve-family-divorce-child-custody-merge.mjs`.
- VERIFIED CSV: `35` live rows resolved with no unresolved section orders.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
