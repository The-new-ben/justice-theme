# Family/Divorce Upload Readiness Dashboard - 2026-05-21

Status: VERIFIED LOCAL / BODY PACKAGE READY AFTER APPROVAL / PUBLIC EXECUTION BLOCKED

This dashboard consolidates the current Family/Divorce upload gates after the latest merge and GSC tooling cycles. It does not approve public CMS edits, URL migration, redirects, canonicals, noindex, sitemap changes, taxonomy edits or related-card changes.

## Batch Completed

- Reviewed `7` Family/Divorce upload target pages.
- Generated `reports/family-divorce-upload-readiness-2026-05-21.csv`.
- Generated `reports/family-divorce-upload-readiness-2026-05-21.json`.
- Added repeatable checker: `tools/check-family-divorce-upload-readiness.mjs`.

## Verified

- VERIFIED: `7/7` current public-body drafts pass static QA.
- VERIFIED: `7/7` target URLs have live public text/metadata backups.
- VERIFIED: the owner review packet exists and covers the upload target set.
- VERIFIED: the CMS operator runbook exists and requires update-existing-page-only execution.
- VERIFIED: the focused Family/Divorce GSC export runner exists.

## Ready

READY AFTER OWNER APPROVAL AND WORDPRESS BACKUP:

- `/divorce-lawyer/`
- `/consensual-divorce/`
- `/divorce-mediation/`
- `/divorce-property-division/`
- `/family-dispute-resolution/`
- `/child-support/`
- `/child-custody/`

Current body QA counts:

- `/divorce-lawyer/`: `2,106` words.
- `/consensual-divorce/`: `1,656` words.
- `/divorce-mediation/`: `1,834` words.
- `/divorce-property-division/`: `1,851` words.
- `/family-dispute-resolution/`: `1,793` words.
- `/child-support/`: `1,650` words.
- `/child-custody/`: `1,748` words.

## Blocked

- BLOCKED: public CMS upload still requires owner/legal/source approval.
- BLOCKED: public CMS upload still requires actual WordPress editor/database rollback material. Public text snapshots are not sufficient rollback.
- BLOCKED: URL migration, redirects, canonicals, noindex and sitemap actions still require the real GSC API export.
- BLOCKED: `5` protected Family/Divorce source URLs still redirect to the homepage in the latest pre-upload guard and must not be retired blindly.

## Review Required

- REVIEW REQUIRED: the older Wave 1B support metadata package has `6` stale word-count fields compared with the current merged static-QA counts.
- The metadata text can still be used as the planning source, but operator/status docs should rely on `reports/family-divorce-public-body-static-qa-2026-05-21.csv` for current body counts.

## Estimated Readiness

- Content-body upload package: high readiness, pending owner/legal/source approval and WordPress backup.
- Public CMS execution: blocked.
- URL migration / redirect / canonical / sitemap readiness: blocked until GSC export and protected-source redirect review.
- Overall Family/Divorce content-upload readiness: approximately `80-85%` for body upload preparation; lower for full SEO-safe migration because GSC and redirect decisions remain open.

## Next Step

1. Owner sets up/rotates GSC OAuth credentials.
2. Run `node tools/gsc/gsc-family-divorce-export.js`.
3. Use GSC output to decide protected old URLs and cannibalization risks.
4. Owner marks each page in `project-control/family-divorce-owner-review-packet-2026-05-21.csv`.
5. CMS operator exports real WordPress rollback material and updates only approved existing pages.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
