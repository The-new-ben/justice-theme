# Family/Divorce GSC Decision Map Baseline - 2026-05-21

Status: NOT FINAL / VERIFIED LOCAL / FOCUSED GSC EXPORT STILL REQUIRED / NO PUBLIC CHANGES

This cycle prepared the post-GSC decision-map step for the Family/Divorce upload cluster. The tool can consume the focused `tools/gsc/gsc-family-divorce-export.js` output after owner credential setup. Until that focused export is run, the generated reports use the existing cached GSC CSVs under `reports/gsc/` and must be treated as a baseline, not final approval for URL migration, redirects, canonicals, noindex or sitemap work.

## Batch Completed

- Created `tools/build-family-divorce-gsc-decision-map.mjs`.
- Reviewed `7` clean Family/Divorce target URLs.
- Reviewed `18` protected Family/Divorce source/asset URLs.
- Generated `reports/family-divorce-gsc-decision-map-2026-05-21.csv`.
- Generated `reports/family-divorce-protected-url-decision-map-2026-05-21.csv`.
- Generated `reports/family-divorce-cannibalization-decision-map-2026-05-21.csv`.
- Generated `reports/family-divorce-gsc-decision-map-2026-05-21.json`.

## Verified

- VERIFIED LOCAL: `node --check tools/build-family-divorce-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: `node tools/build-family-divorce-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: input mode is `FALLBACK_EXISTING_GSC_CACHE_NOT_FINAL`.
- VERIFIED LOCAL: decision map contains `7` target rows and `18` protected source/asset rows.
- VERIFIED LOCAL: `5` protected source URLs still have live homepage-redirect conflicts.
- VERIFIED LOCAL: cached GSC data found rows for all `18` protected source/asset URLs.
- VERIFIED LOCAL: cached GSC data marks all `18` protected source/asset URLs as high-risk.
- VERIFIED LOCAL: cannibalization baseline contains `40` query groups requiring review before redirect/canonical/noindex/merge decisions.

## Key Baseline Findings

- HIGH / BLOCKED: `/free-divorce-agreement-template/` has cached GSC value and should remain live or move only after approved 301 planning.
- HIGH / BLOCKED: the child-support calculator URL currently redirects to homepage but has cached GSC value; restore or targeted-301 review is required after focused export.
- HIGH / BLOCKED: the Hebrew updated divorce guide currently redirects to homepage but has cached GSC value; restore or targeted-301 review is required after focused export.
- HIGH / BLOCKED: the Hebrew recommended divorce lawyer URL currently redirects to homepage and has cached impressions; restore or targeted-301 review is required after focused export.
- HIGH / BLOCKED: the Hebrew divorce mediation explainer currently redirects to homepage and has cached impressions; restore or targeted-301 review is required after focused export.
- HIGH / BLOCKED: `/what-is-child-custody/` currently redirects to homepage and has cached impressions; restore or targeted-301 review is required after focused export.
- HIGH / BLOCKED: the divorce agreement DOCX asset has cached GSC value and should remain live; do not redirect the asset.

## What This Means

- The Family/Divorce body-upload package remains close to ready after owner approval and WordPress backup.
- URL migration is not ready.
- The old protected pages are not disposable: the cached GSC baseline shows meaningful impressions/clicks across the protected set.
- The five homepage-redirect conflicts should be treated as priority URL-risk items before any public migration.
- The new clean target pages should be updated in place after approval, not created as duplicate pages.

## Next Required Step

1. Owner sets local GSC credentials.
2. Run `node tools/gsc/gsc-family-divorce-export.js`.
3. Rerun `node tools/build-family-divorce-gsc-decision-map.mjs --gscDir=reports/gsc/family-divorce-YYYY-MM-DD`.
4. Convert the focused output into final protected URL decisions: keep live, restore, merge, 301, canonical/noindex, or hold.
5. Only after that, approve redirect/sitemap/canonical actions separately from body upload.

## Still Blocked

- BLOCKED: public CMS upload still requires owner/legal/source approval.
- BLOCKED: public CMS upload still requires actual WordPress editor/database rollback material.
- BLOCKED: final URL migration, redirects, canonicals, noindex and sitemap actions still require the focused GSC API export.
- BLOCKED: the `5` protected homepage-redirect conflicts require focused export review before any retirement or redirect decision.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
