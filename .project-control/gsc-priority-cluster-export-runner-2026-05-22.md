# GSC Priority Cluster Export Runner - 2026-05-22

Status: READY FOR OWNER OAUTH SETUP / VERIFIED LOCAL DRY RUN / NO PUBLIC CHANGES

This packet adds one read-only PowerShell runner for the priority legal clusters that currently block upload decisions:

- Family/Divorce
- Criminal Law
- Medical Malpractice

It does not publish content, edit WordPress, change URLs, create redirects, change canonicals/noindex, change sitemap status, change taxonomy, alter internal links, edit lawyer cards, write leads/CRM data or deploy anything.

## New Runner

`tools/gsc/run-priority-cluster-gsc-exports.ps1`

Default full run after owner OAuth setup:

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
.\tools\gsc\run-priority-cluster-gsc-exports.ps1
```

Safe dry run:

```powershell
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -DryRun
```

Single-cluster dry run:

```powershell
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters family -DryRun
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters criminal -DryRun
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -Clusters medical -DryRun
```

## Outputs Created By Full Run

Family/Divorce:

- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-pages.csv`
- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-query-page.csv`
- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-cannibalization.csv`
- `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-protected-sources.csv`
- `reports/family-divorce-gsc-decision-map-YYYY-MM-DD.csv`
- `reports/family-divorce-protected-url-decision-map-YYYY-MM-DD.csv`
- `reports/family-divorce-cannibalization-decision-map-YYYY-MM-DD.csv`
- `project-control/family-divorce-protected-url-owner-review-packet-YYYY-MM-DD.csv`

Criminal Law:

- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-pages.csv`
- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-query-page.csv`
- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-cannibalization.csv`
- `reports/gsc/criminal-law-YYYY-MM-DD/criminal-law-protected-sources.csv`
- `reports/criminal-gsc-decision-map-YYYY-MM-DD.csv`
- `reports/criminal-protected-url-decision-map-YYYY-MM-DD.csv`
- `reports/criminal-cannibalization-decision-map-YYYY-MM-DD.csv`

Medical Malpractice:

- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-pages.csv`
- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-query-page.csv`
- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-cannibalization.csv`
- `reports/gsc/medical-malpractice-YYYY-MM-DD/medical-malpractice-protected-sources.csv`
- `reports/medical-malpractice-gsc-decision-map-YYYY-MM-DD.csv`
- `reports/medical-malpractice-protected-url-decision-map-YYYY-MM-DD.csv`
- `reports/medical-malpractice-cannibalization-decision-map-YYYY-MM-DD.csv`

## Required Before Full Run

- VERIFIED: Google account has Search Console access to `https://jus-tice.co.il/`.
- VERIFIED: Search Console API is enabled in Google Cloud.
- VERIFIED: OAuth Desktop app JSON is saved outside the repo.
- VERIFIED: token path is outside the repo.
- BLOCKED UNTIL OWNER: owner approves OAuth browser prompt on first run.

## Post-Export Review Requirement

After full export, review the generated decision maps before any public action.

Minimum checks:

- protect URLs with meaningful impressions/clicks,
- identify query/page cannibalization,
- confirm canonical candidates,
- confirm redirect/noindex candidates,
- separate protected source assets from weak duplicate pages,
- keep full content upload blocked until owner decisions and rollback backups exist.

## Safety

This is a local read-only export runner. Dry run does not read credential contents, open OAuth or call the GSC API. Full run reads local OAuth credentials only after owner setup and calls Google Search Console read-only endpoints.

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
