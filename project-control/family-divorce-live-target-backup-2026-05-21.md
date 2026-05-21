# Family/Divorce Live Target Backup - 2026-05-21

## Status

- VERIFIED TOOLING: added `tools/export-family-divorce-live-targets.mjs`.
- VERIFIED LIVE / READ ONLY: exported public text snapshots and metadata for the seven live Family/Divorce target pages.
- GENERATED: `reports/family-divorce-live-target-backup-2026-05-21/`.
- GENERATED: `reports/family-divorce-live-target-backup-2026-05-21/manifest.csv`.
- CREATED: `project-control/family-divorce-live-target-backup-2026-05-21.csv`.
- NOT A DB BACKUP: these are public HTML/text snapshots, not WordPress editor/database exports.

## Batch Completed

Seven live target pages were exported before any CMS overwrite/update:

- `/divorce-lawyer/` - `3,407` words
- `/consensual-divorce/` - `2,645` words
- `/divorce-mediation/` - `2,690` words
- `/divorce-property-division/` - `2,639` words
- `/family-dispute-resolution/` - `2,297` words
- `/child-support/` - `2,963` words
- `/child-custody/` - `2,595` words

Total captured live public text: `19,236` words.

## Readiness Impact

- VERIFIED: all seven target URLs returned `200`, stayed on their own final paths and produced usable public text snapshots.
- READY: the current live public content is now available for side-by-side comparison before replacing/updating the page bodies.
- STILL REQUIRED: export the actual CMS editor fields or database backup before any WordPress edit.
- STILL BLOCKED: owner/legal/source approval, GSC API confirmation, five protected-source redirect decisions and post-upload QA remain required before public upload/update.

## Files

- `tools/export-family-divorce-live-targets.mjs`
- `reports/family-divorce-live-target-backup-2026-05-21/README.md`
- `reports/family-divorce-live-target-backup-2026-05-21/manifest.csv`
- `reports/family-divorce-live-target-backup-2026-05-21/divorce-lawyer.txt`
- `reports/family-divorce-live-target-backup-2026-05-21/consensual-divorce.txt`
- `reports/family-divorce-live-target-backup-2026-05-21/divorce-mediation.txt`
- `reports/family-divorce-live-target-backup-2026-05-21/divorce-property-division.txt`
- `reports/family-divorce-live-target-backup-2026-05-21/family-dispute-resolution.txt`
- `reports/family-divorce-live-target-backup-2026-05-21/child-support.txt`
- `reports/family-divorce-live-target-backup-2026-05-21/child-custody.txt`

## Verification

- VERIFIED LOCAL: `node --check tools/export-family-divorce-live-targets.mjs`.
- VERIFIED LIVE / READ ONLY: `$env:JUSTICE_WRITE_REPORT='1'; node tools/export-family-divorce-live-targets.mjs`.
- VERIFIED CSV: manifest rows parse and report all seven pages as `PASS`.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
