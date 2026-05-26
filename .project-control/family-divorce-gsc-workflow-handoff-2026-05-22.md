# Family/Divorce GSC Workflow Handoff - 2026-05-22

Status: FIXED / VERIFIED LOCAL / API EXECUTION BLOCKED UNTIL OWNER CREDENTIAL SETUP / NO PUBLIC CHANGES

This handoff closes a tooling risk before the real Family/Divorce GSC export: the downstream decision-map and protected URL packet scripts no longer depend on hardcoded `2026-05-21` filenames.

## Batch Completed

- FIXED: `tools/build-family-divorce-gsc-decision-map.mjs` now supports `--reportDate=YYYY-MM-DD`.
- FIXED: `tools/build-family-divorce-gsc-decision-map.mjs` now auto-selects the latest `family-divorce-live-preupload-YYYY-MM-DD.csv`, or accepts `--livePreupload=path`.
- FIXED: `tools/build-family-divorce-protected-url-review-packet.mjs` now supports `--reportDate=YYYY-MM-DD` and `--input=path`.
- CREATED: `tools/gsc/run-family-divorce-gsc-workflow.ps1` for one-command dry run, focused export, decision-map build and protected packet rebuild.
- UPDATED: `tools/gsc/README.md` and `project-control/gsc-api-setup-guide.md` with the wrapper command and manual fallback commands.

## Generated Baseline Outputs

- GENERATED / NOT FINAL: `reports/family-divorce-gsc-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-cannibalization-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-gsc-decision-map-2026-05-22.json`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-owner-review-packet-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-owner-review-packet-2026-05-22.json`.
- GENERATED / NOT FINAL: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-22.csv`.

## Verified

- VERIFIED LOCAL: `node --check tools/build-family-divorce-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: `node --check tools/build-family-divorce-protected-url-review-packet.mjs` passed.
- VERIFIED LOCAL: `tools/gsc/run-family-divorce-gsc-workflow.ps1 -DryRun` completed without OAuth browser opening and without GSC API calls.
- VERIFIED LOCAL: regenerated 2026-05-22 baseline decision-map outputs from cached GSC data.
- VERIFIED LOCAL: regenerated 2026-05-22 protected URL review packet from the 2026-05-22 protected URL decision map.
- VERIFIED LOCAL: baseline still reports `18` protected URL rows, `5` protected homepage-redirect conflicts, `18` high-risk protected rows and `40` cannibalization rows.

## Owner Command

After credential setup:

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
.\tools\gsc\run-family-divorce-gsc-workflow.ps1 -DryRun
.\tools\gsc\run-family-divorce-gsc-workflow.ps1
```

If a focused export already exists and only the decision files need rebuilding:

```powershell
.\tools\gsc\run-family-divorce-gsc-workflow.ps1 -SkipExport -OutputDir "reports\gsc\family-divorce-YYYY-MM-DD" -ReportDate "YYYY-MM-DD"
```

## Still Blocked

- BLOCKED: real focused GSC export still requires owner credential setup and OAuth approval.
- BLOCKED: the 2026-05-22 baseline files still use cached GSC data and are `NOT FINAL`.
- BLOCKED: URL migration, redirects, canonical/noindex and sitemap actions still require focused GSC export plus owner review.
- BLOCKED: public CMS upload still requires owner/legal/source approval and actual WordPress editor/database rollback material.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
