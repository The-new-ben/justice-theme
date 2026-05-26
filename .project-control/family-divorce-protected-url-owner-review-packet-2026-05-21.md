# Family/Divorce Protected URL Owner Review Packet - 2026-05-21

Status: NOT FINAL / VERIFIED LOCAL / OWNER + FOCUSED GSC REVIEW REQUIRED / NO PUBLIC CHANGES

This packet converts the Family/Divorce protected URL decision-map baseline into owner-review rows. It is intentionally not final because it uses cached GSC data from `reports/gsc/`; final URL, redirect, canonical, noindex and sitemap decisions still require the focused owner-authorized GSC export.

## Batch Completed

- Reviewed `18` protected Family/Divorce source/asset URLs.
- Promoted `5` homepage-redirect conflicts to `P0_RESTORE_OR_TARGETED_301_REVIEW`.
- Promoted `1` DOCX asset to `P0_KEEP_ASSET_LIVE`.
- Marked `18/18` protected rows as high-risk from cached GSC baseline data.
- Created `tools/build-family-divorce-protected-url-review-packet.mjs`.
- Generated `reports/family-divorce-protected-url-owner-review-packet-2026-05-21.csv`.
- Generated `reports/family-divorce-protected-url-owner-review-packet-2026-05-21.json`.
- Created `project-control/family-divorce-protected-url-owner-review-packet-2026-05-21.csv`.

## P0 Review Rows

- BLOCKED: child-support calculator Hebrew URL currently redirects to `/`; decide restore current URL or targeted 301 after focused GSC export.
- BLOCKED: updated divorce guide Hebrew URL currently redirects to `/`; decide restore current URL or targeted 301 after focused GSC export.
- BLOCKED: recommended divorce lawyer Hebrew URL currently redirects to `/`; decide restore current URL or targeted 301 after focused GSC export.
- BLOCKED: divorce mediation explainer Hebrew URL currently redirects to `/`; decide restore current URL or targeted 301 after focused GSC export.
- BLOCKED: `/what-is-child-custody/` currently redirects to `/`; decide restore current URL or targeted 301 after focused GSC export.
- VERIFIED BASELINE: divorce agreement DOCX asset has cached GSC value and should stay live; do not redirect the asset.

## Owner Decision Options

For conflict rows:

- `RESTORE_CURRENT_URL`
- `TARGETED_301_TO_MAPPED_TARGET`
- `HOLD_FOR_MANUAL_REVIEW`

For live protected source rows:

- `KEEP_LIVE`
- `MERGE_AND_301_AFTER_APPROVAL`
- `HOLD_FOR_MANUAL_REVIEW`

For protected asset rows:

- `KEEP_ASSET_LIVE`
- `REPLACE_ASSET_WITH_SAME_URL`
- `HOLD_FOR_MANUAL_REVIEW`

## Verified

- VERIFIED LOCAL: `node --check tools/build-family-divorce-protected-url-review-packet.mjs` passed.
- VERIFIED LOCAL: `node tools/build-family-divorce-protected-url-review-packet.mjs` passed.
- VERIFIED LOCAL: generated packet has `18` rows.
- VERIFIED LOCAL: generated packet has `5` conflict rows, `1` asset row and `18` high-risk rows.
- VERIFIED LOCAL: all rows are marked `BLOCKED_FOCUSED_GSC_EXPORT_REQUIRED`.

## Still Blocked

- BLOCKED: final protected URL decisions require focused GSC export.
- BLOCKED: final protected URL decisions require owner approval.
- BLOCKED: public CMS upload still requires owner/legal/source approval and actual WordPress editor/database rollback material.
- BLOCKED: no redirect, canonical, noindex or sitemap action is approved by this packet.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
