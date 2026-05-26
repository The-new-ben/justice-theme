# GSC Owner Execution Packet - 2026-05-22

Status: READY FOR OWNER SETUP / PUBLIC EXECUTION BLOCKED

Purpose: give the owner one safe command sequence for connecting Google Search Console API, running the priority read-only exports, and validating the output before any Family/Divorce, Criminal Law or Medical Malpractice upload decision.

## Boundary

APPROVED FOR OWNER/OPERATOR:
- save OAuth Desktop credentials outside Git,
- run local preflight,
- run local dry runs,
- approve the first read-only OAuth browser screen,
- export read-only GSC query/page data,
- write local reports under `reports/gsc/` and `project-control/`.

NOT APPROVED:
- public CMS upload,
- page body/title/H1/meta changes,
- URL slug migration,
- redirects,
- canonical or noindex changes,
- sitemap changes,
- taxonomy changes,
- related-card/internal-link writes,
- lawyer profile changes,
- lead/CRM changes,
- uPress deployment.

## Prerequisites

1. VERIFIED NEEDED: Google Search Console access to `https://jus-tice.co.il/`.
2. VERIFIED NEEDED: Search Console API enabled in a Google Cloud project.
3. VERIFIED NEEDED: OAuth 2.0 Desktop app credentials.
4. REQUIRED: save OAuth client JSON outside this repo, for example:
   `C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json`
5. REQUIRED: save OAuth token outside this repo, for example:
   `C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json`
6. BLOCKED IF: any credential JSON is committed, pasted into project docs or stored as a tracked file.

Use read-only scope only:
`https://www.googleapis.com/auth/webmasters.readonly`

## Primary Command Sequence

Run from PowerShell:

```powershell
cd C:\Users\janana\jutice-theme
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
.\tools\gsc\check-gsc-oauth-preflight.ps1 -RunPriorityDryRun
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -DryRun
.\tools\gsc\run-priority-cluster-gsc-exports.ps1
.\tools\gsc\check-priority-gsc-export-output.ps1 -WriteReport
```

Expected final validator result:
`VERIFIED_EXPORT_OUTPUTS_READY_FOR_OWNER_REVIEW`

If the validator returns `BLOCKED_EXPORT_VALIDATION`, do not upload or change public SEO settings. Open:
`project-control/gsc-priority-export-output-validator-YYYY-MM-DD.csv`

## Expected Output Folders

Family/Divorce:
- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-pages.csv`
- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-query-page.csv`
- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-cannibalization.csv`
- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-protected-sources.csv`
- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-summary.json`

Criminal Law:
- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-pages.csv`
- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-query-page.csv`
- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-cannibalization.csv`
- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-protected-sources.csv`
- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-summary.json`

Medical Malpractice:
- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-pages.csv`
- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-query-page.csv`
- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-cannibalization.csv`
- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-protected-sources.csv`
- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-summary.json`

Decision-map summaries must show:
- `inputMode: FOCUSED_GSC_EXPORT`
- `finality: READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION`

## Single-Cluster Fallbacks

Family/Divorce only:

```powershell
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters family -DryRun
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters family
.\tools\gsc\check-priority-gsc-export-output.ps1 -Clusters family -WriteReport
```

Criminal Law only:

```powershell
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters criminal -DryRun
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters criminal
.\tools\gsc\check-priority-gsc-export-output.ps1 -Clusters criminal -WriteReport
```

Medical Malpractice only:

```powershell
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters medical -DryRun
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters medical
.\tools\gsc\check-priority-gsc-export-output.ps1 -Clusters medical -WriteReport
```

## Pass/Fail Rules

VERIFIED:
- preflight returns `VERIFIED_PRECHECK_READY`,
- dry run completes without OAuth browser or GSC API call,
- real export creates all required focused export files,
- output validator returns `VERIFIED_EXPORT_OUTPUTS_READY_FOR_OWNER_REVIEW`,
- decision maps are rebuilt from `FOCUSED_GSC_EXPORT`.

BLOCKED:
- credential path missing,
- token path missing or stored inside tracked repo files,
- Google account lacks Search Console access,
- OAuth consent fails,
- export folder missing,
- required CSV/JSON missing,
- required CSV columns missing,
- page/query/protected-source exports are empty,
- decision maps still come from baseline/cache/dashboard data.

## Next Step After VERIFIED

1. Review the Family/Divorce visible repair owner worksheet.
2. Capture WordPress rollback backup evidence before any approved public repair.
3. Use focused Family/Divorce GSC data to choose the authoritative divorce-lawyer URL.
4. Only then decide current-URL repair, canonical, redirect, noindex, sitemap or upload steps.

Status summary: this packet is a local execution guide only. It does not approve any public website change.
