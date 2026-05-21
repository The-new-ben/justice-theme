# Family/Divorce Property Division Merge Decisions - 2026-05-21

## Status

- VERIFIED TOOLING: added `tools/resolve-family-divorce-property-division-merge.mjs`.
- VERIFIED LOCAL: resolved all `/divorce-property-division/` live candidate rows from the high-risk merge worksheet.
- GENERATED: `reports/family-divorce-property-division-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-property-division-merge-decisions-2026-05-21.csv`.
- NOT PUBLISHED: this is a pre-upload decision layer only; no public page body or CMS field changed.

## Batch Completed

Reviewed `35` current-live candidate rows for `/divorce-property-division/`.

Decision outcome:

- `6` rows require concise draft merges.
- `23` rows are covered by the clean draft and require no draft edit.
- `6` rows are UI, CTA, taxonomy or related-link fragments and should not be imported into the article body.

## Required Draft Merges

Before `/divorce-property-division/` can move to owner upload approval, apply these six controlled merges to the clean public draft:

1. Add one cautious bullet that separate registration is not always decisive if conduct indicates possible shared intent.
2. Add one cautious sentence that children and housing needs can affect practical timing or settlement options.
3. Add a short separation-date checklist: actual separation date, leaving home, opening proceedings, separate accounts and assets/debts created after separation.
4. Add a sentence that assets or debts created after separation can change the factual review and may require professional valuation.
5. Add prenup checklist points for approval if required, included/excluded assets and later conduct that may conflict with the agreement.
6. Add a caution that content cannot decide agreement validity or interpretation; owner/legal review should verify pressure, disclosure and understanding language.

## Upload Readiness Impact

- READY: `/divorce-property-division/` live candidate rows have final decisions.
- READY: UI/CTA/related-link fragments are explicitly excluded from article-body import.
- BLOCKED: `/divorce-property-division/` still needs six concise draft edits, static QA rerun and owner/legal/source approval before CMS upload.
- STILL REQUIRED: WordPress editor/database backup before CMS execution.

## Verification

- VERIFIED LOCAL: `node --check tools/resolve-family-divorce-property-division-merge.mjs`.
- VERIFIED LOCAL: `$env:JUSTICE_WRITE_REPORT='1'; node tools/resolve-family-divorce-property-division-merge.mjs`.
- VERIFIED CSV: `35` live rows resolved with no unresolved section orders.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
