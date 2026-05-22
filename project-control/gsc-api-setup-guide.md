# Google Search Console API Setup Guide

Date: 2026-05-12
Status: READY FOR OWNER SETUP / READ-ONLY RECOMMENDED

LATEST 2026-05-21 SECURITY NOTE:
- `tools/gsc/oauth-client.json` was removed from Git tracking and is now ignored locally.
- If that old tracked OAuth client was real, create a new OAuth Desktop client in Google Cloud and delete or rotate the old one before using API exports.
- Keep future credential JSON files outside Git. If local tooling needs `tools/gsc/oauth-client.json`, keep it as a local ignored file only.

LATEST 2026-05-21 RUNNER NOTE:
- `tools/gsc/gsc-family-divorce-export.js` is now ready for the first Family/Divorce read-only export.
- It supports local credential paths outside the repo through `GSC_OAUTH_CLIENT_PATH` and `GSC_TOKEN_PATH`.
- Preferred dry run command: `.\tools\gsc\run-family-divorce-gsc-workflow.ps1 -DryRun`
- Preferred full workflow command after owner credential setup: `.\tools\gsc\run-family-divorce-gsc-workflow.ps1`
- Manual post-export decision-map command: `node tools/build-family-divorce-gsc-decision-map.mjs --gscDir=reports/gsc/family-divorce-YYYY-MM-DD --reportDate=YYYY-MM-DD`
- Manual protected URL review-packet command: `node tools/build-family-divorce-protected-url-review-packet.mjs --reportDate=YYYY-MM-DD --input=reports/family-divorce-protected-url-decision-map-YYYY-MM-DD.csv`
- FIXED 2026-05-22: downstream decision-map and protected-packet scripts now use explicit/dynamic report dates instead of hardcoded `2026-05-21` filenames.
- FIXED 2026-05-22: Criminal Law now has a focused read-only export runner: `.\tools\gsc\run-criminal-gsc-export.ps1 -DryRun`, then `.\tools\gsc\run-criminal-gsc-export.ps1` after owner OAuth approval.
- FIXED 2026-05-22: the Criminal full wrapper now also builds `reports/criminal-gsc-decision-map-YYYY-MM-DD.csv`, `reports/criminal-protected-url-decision-map-YYYY-MM-DD.csv`, `reports/criminal-cannibalization-decision-map-YYYY-MM-DD.csv` and `reports/criminal-gsc-decision-map-YYYY-MM-DD.json`.

This guide explains how to connect Google Search Console API for Jus-Tice so we can export query/page data quickly instead of doing slow browser checks.

## Why We Need This

The GSC API will help us answer, for each content cluster:
- which old URLs currently get Google impressions,
- which queries point to the wrong pages,
- which pages are strong enough to protect,
- where cannibalization exists,
- whether new English slug pages already have visibility,
- what changed after publishing.

For the Family Law / Divorce cluster, this should save roughly 1-2 work cycles.

## Access Needed

Required:
1. Google Search Console access to the property `https://jus-tice.co.il/`.
2. Permission level: Full user is enough for read-only exports; Owner is better if available.
3. A Google Cloud project.
4. Search Console API enabled in that project.
5. OAuth 2.0 client credentials.

Important:
- API key alone is not enough for Search Console query data.
- Use OAuth because Search Console data belongs to a Google account/property.
- Use read-only scope unless we intentionally need sitemap submission later.

Recommended OAuth scope:
- `https://www.googleapis.com/auth/webmasters.readonly`

Do not use write scope for now:
- `https://www.googleapis.com/auth/webmasters`

## Simple Setup Steps

1. Open Google Cloud Console.
2. Create a new project, for example `jus-tice-gsc-api`.
3. Go to APIs & Services.
4. Open Library.
5. Search for `Google Search Console API`.
6. Enable it.
7. Go to OAuth consent screen.
8. Choose external or internal based on the Google account setup.
9. Add yourself as a test user if Google asks.
10. Go to Credentials.
11. Create OAuth client ID.
12. Choose Desktop app if this is only for local export scripts.
13. Download the OAuth client JSON file.
14. Save it outside the repo, for example:
    - `C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json`
15. Do not commit the JSON file to Git.

## What To Give Codex Tomorrow

Give Codex only the local path to the credential file, not the raw secret text.

Example:
`C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json`

Then Codex can run a local read-only export script. The first run will open a Google login/permission screen. You approve access with the Google account that has Search Console permission.

Token storage should also stay outside the repo, for example:
`C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json`

PowerShell command to use after credentials are saved:

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
.\tools\gsc\run-family-divorce-gsc-workflow.ps1 -DryRun
.\tools\gsc\run-family-divorce-gsc-workflow.ps1
```

Use `--dry-run` first. It should show `credentialFileExists: true`. It does not read credential contents, open OAuth or call the API.

If the export already exists and only the decision files need rebuilding:

```powershell
.\tools\gsc\run-family-divorce-gsc-workflow.ps1 -SkipExport -OutputDir "reports\gsc\family-divorce-YYYY-MM-DD" -ReportDate "YYYY-MM-DD"
```

Criminal Law dry run and export:

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
.\tools\gsc\run-criminal-gsc-export.ps1 -DryRun
.\tools\gsc\run-criminal-gsc-export.ps1
```

Criminal outputs save under `reports/gsc/criminal-law-YYYY-MM-DD/`.

The Criminal wrapper also creates root-level decision outputs:
- `reports/criminal-gsc-decision-map-YYYY-MM-DD.csv`
- `reports/criminal-protected-url-decision-map-YYYY-MM-DD.csv`
- `reports/criminal-cannibalization-decision-map-YYYY-MM-DD.csv`
- `reports/criminal-gsc-decision-map-YYYY-MM-DD.json`

Manual rebuild after an existing Criminal export:

```powershell
node tools/build-criminal-gsc-decision-map.mjs --gscDir="reports/gsc/criminal-law-YYYY-MM-DD" --reportDate="YYYY-MM-DD"
```

## What We Can Export

Main export:
- query
- page
- clicks
- impressions
- CTR
- average position

Useful dimensions:
- `query`
- `page`
- `date`
- `device`
- `country`

Useful date ranges:
- last 16 months,
- last 3 months,
- last 28 days,
- pre-upload baseline,
- post-upload comparison.

Useful filters:
- query contains `גירוש`
- query contains `מזונות`
- query contains `משמורת`
- query contains `הסכם גירושין`
- query contains `הסכם ממון`
- query contains `צווא`
- page contains `/divorce`
- page contains `/child-support`
- page contains old Hebrew URL patterns

## First Family / Divorce Exports

Create these outputs first:

1. `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-query-page.csv`
2. `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-pages.csv`
3. `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-cannibalization.csv`
4. `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-protected-sources.csv`
5. `reports/gsc/family-divorce-YYYY-MM-DD/family-divorce-summary.json`

Questions to answer:
- Does `/divorce-lawyer/` already get impressions?
- Which old Hebrew divorce URL gets impressions for `עורך דין גירושין`?
- Does the divorce PDF still get impressions?
- Does the mediation DOCX still get impressions?
- Does the child-support calculator still own `מזונות` or `חישוב מזונות` queries?
- Which custody page/PDF owns `משמורת` demand?
- Are inheritance/wills queries mixed into the Family Law cluster?

## How This Speeds Up The Work

Without API:
- we manually search GSC in the browser,
- export one screen at a time,
- risk missing hidden query/page pairs,
- spend too much time on screenshots.

With API:
- we export many query/page pairs in one run,
- sort by impressions and clicks,
- identify strong URLs automatically,
- detect cannibalization faster,
- create repeatable pre/post publishing checks.

## Safety Rules

Do:
- use read-only scope,
- keep credentials outside Git,
- export only what we need,
- document every output file,
- compare old and new URLs before redirecting.

Do not:
- commit credential files,
- paste OAuth secrets into project docs,
- delete old pages based only on API data,
- redirect strong pages without approval,
- treat zero impressions as proof that a page is useless without content review.

## Official References

- Google Search Analytics API query method: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- Google guide to querying Search Analytics data: https://developers.google.cn/webmaster-tools/v1/how-tos/search_analytics?hl=en
- Google API credentials overview: https://support.google.com/googleapi/answer/6158857

## Tomorrow Checklist

1. Confirm which Google account has Search Console access.
2. Confirm `https://jus-tice.co.il/` is visible in that Search Console account.
3. Create or choose Google Cloud project.
4. Enable Search Console API.
5. Create OAuth Desktop app credentials.
6. Save credential JSON outside the repo.
7. Give Codex the local file path only.
8. Approve the OAuth screen when Codex runs the first export.
9. Verify the first CSV export opens and contains `query`, `page`, `clicks`, `impressions`, `ctr`, `position`.
