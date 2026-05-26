# Criminal GSC Decision Map - 2026-05-22

## Status
- FIXED / VERIFIED LOCAL: a Criminal post-GSC decision-map builder now exists.
- NOT FINAL: the current generated maps use the readiness dashboard and older cached GSC CSVs as baseline evidence only.
- FOCUSED GSC EXPORT BLOCKED: final URL, redirect, canonical, noindex and sitemap decisions still require the owner-authorized Criminal GSC export.
- NO PUBLIC CHANGES: no CMS, URL, redirect, canonical, noindex, sitemap, taxonomy, lawyer, lead, CRM, payment, wp-admin or uPress action was taken.

## Files Created Or Updated
- CREATED: `tools/build-criminal-gsc-decision-map.mjs`
- UPDATED: `tools/gsc/run-criminal-gsc-export.ps1`
- GENERATED / NOT FINAL: `reports/criminal-gsc-decision-map-2026-05-22.csv`
- GENERATED / NOT FINAL: `reports/criminal-protected-url-decision-map-2026-05-22.csv`
- GENERATED / NOT FINAL: `reports/criminal-cannibalization-decision-map-2026-05-22.csv`
- GENERATED / NOT FINAL: `reports/criminal-gsc-decision-map-2026-05-22.json`
- CREATED: `project-control/criminal-gsc-decision-map-2026-05-22.csv`

## Batch Completed
- Criminal first-upload target rows reviewed: `5`
- Protected/support/route-risk rows mapped: `20`
- Criminal support rows inside protected map: `16`
- Criminal route or slug-risk rows inside protected map: `4`
- High-risk protected rows in baseline: `11`
- Cannibalization/wrong-page rows mapped: `8`

## What The Builder Does
The builder converts Criminal GSC export outputs into three review files:

1. `criminal-gsc-decision-map-YYYY-MM-DD.csv` - combined target and protected URL decision map.
2. `criminal-protected-url-decision-map-YYYY-MM-DD.csv` - old/support/route-risk URLs that must not be redirected or overwritten blindly.
3. `criminal-cannibalization-decision-map-YYYY-MM-DD.csv` - query/page conflicts and wrong-page signals that require review before merge, noindex, canonical or redirect action.

When `--gscDir=reports/gsc/criminal-law-YYYY-MM-DD` is passed after a real export, the builder reads:
- `criminal-law-pages.csv`
- `criminal-law-query-page.csv`
- `criminal-law-cannibalization.csv`

When no focused export exists, it falls back to baseline planning evidence and marks output as `NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT`.

## Current Baseline Findings
- `/criminal-defense-attorney/` remains the first current-URL Criminal review target, but it is not upload-approved.
- All five Criminal first-upload targets remain current-URL-only candidates pending owner/legal/source approval and WordPress rollback backup.
- High-risk protected/support rows include police-station list, criminal-lawyer selection/cost pages, police certificate, sex-crime, drug-related crime, tax investigation and traffic boundary pages.
- Wrong-page/cannibalization rows still require focused export confirmation before any route retirement, redirect, canonical or noindex action.

## Verification
- VERIFIED LOCAL: `node --check tools/build-criminal-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: `node tools/build-criminal-gsc-decision-map.mjs --reportDate=2026-05-22` generated the expected four report files.
- VERIFIED LOCAL: generated summary reports `5` target rows, `20` protected rows and `8` cannibalization rows.
- VERIFIED LOCAL: all current baseline decision rows remain `NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT`.

## Next Step
After owner OAuth/GSC credentials are configured, run:

```powershell
.\tools\gsc\run-criminal-gsc-export.ps1
```

The wrapper now runs the focused export and then builds the Criminal decision maps for the same report date.

## Blocked
- BLOCKED: real Criminal GSC export requires owner OAuth approval.
- BLOCKED: owner/legal/source approval is required before CMS upload.
- BLOCKED: WordPress editor/database rollback backup is required before approved CMS changes.
- BLOCKED: English slug migration, redirects, canonicals, noindex, sitemap, taxonomy and related/internal-link writes require focused GSC review and owner migration approval.

## Safety
No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
