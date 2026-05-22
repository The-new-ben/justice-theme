# Family/Divorce Wave 1B Metadata Word-Count Sync - 2026-05-21

Status: FIXED / VERIFIED LOCAL / NO PUBLIC CHANGES

This closes the stale word-count review item from the Family/Divorce upload readiness dashboard. It updates only the `words` field in the older Wave 1B support metadata package so it matches the current static QA output after the latest merge work.

## Batch Completed

- Reviewed `6` Wave 1B Family/Divorce support metadata rows.
- Fixed `6/6` stale word-count fields.
- Generated `reports/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.csv`.
- Created `project-control/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.csv`.
- Updated `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv`.
- Reran `tools/check-family-divorce-upload-readiness.mjs`.

## Fixed Rows

- FIXED: `/consensual-divorce/` changed from `1,875` to `1,656`.
- FIXED: `/divorce-mediation/` changed from `2,059` to `1,834`.
- FIXED: `/divorce-property-division/` changed from `1,874` to `1,851`.
- FIXED: `/family-dispute-resolution/` changed from `1,992` to `1,793`.
- FIXED: `/child-support/` changed from `1,729` to `1,650`.
- FIXED: `/child-custody/` changed from `1,693` to `1,748`.

## Verified

- VERIFIED LOCAL: `node --check tools/sync-family-divorce-wave1b-metadata-counts.mjs` passed.
- VERIFIED LOCAL: `node tools/sync-family-divorce-wave1b-metadata-counts.mjs` fixed `6` rows and skipped `0`.
- VERIFIED LOCAL: `node --check tools/check-family-divorce-upload-readiness.mjs` passed.
- VERIFIED LOCAL: `node tools/check-family-divorce-upload-readiness.mjs` passed.
- VERIFIED: Wave 1B metadata word-count mismatches are now `0`.
- VERIFIED: `7/7` Family/Divorce current public-body drafts still pass static QA.
- VERIFIED: `7/7` Family/Divorce target URLs still have live public backups.

## Still Blocked

- BLOCKED: public CMS upload still requires owner/legal/source approval.
- BLOCKED: public CMS upload still requires actual WordPress editor/database rollback material.
- BLOCKED: URL migration, redirects, canonicals, noindex and sitemap actions still require real GSC API export.
- BLOCKED: `5` protected Family/Divorce source URLs still need review after GSC export before any redirect or retirement decision.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
