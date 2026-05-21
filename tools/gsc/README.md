# GSC API Tool - Quick Start

## Credential Safety

`oauth-client.json`, `gsc-token.json`, app-password files and other credential JSON files must stay local and untracked.

Recommended local credential paths:
- OAuth client: `tools/gsc/oauth-client.json`
- OAuth token: `tools/gsc/gsc-token.json`

If a real OAuth client JSON was ever committed, create a new OAuth client in Google Cloud and delete or rotate the old one.

## First Time On A New PC

```bash
cd tools/gsc
npm install googleapis open
node gsc-pull.js
```

Browser opens, then log in with the Google account that has Search Console access and approve the read-only flow. Token saves locally. Next runs are automatic.

## After First Time

```bash
cd tools/gsc
node gsc-pull.js
```

No browser needed: token auto-refreshes.

## Family / Divorce First Export

Use this runner for the first controlled Family/Divorce upload risk check. It supports credential paths outside the repo and a safe dry run.

PowerShell:

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
node tools/gsc/gsc-family-divorce-export.js --dry-run
node tools/gsc/gsc-family-divorce-export.js
```

Outputs save under `reports/gsc/family-divorce-YYYY-MM-DD/`.

After the export, build the protected URL / cannibalization decision map:

```powershell
node tools/build-family-divorce-gsc-decision-map.mjs --gscDir="reports/gsc/family-divorce-YYYY-MM-DD"
node tools/build-family-divorce-protected-url-review-packet.mjs
```

Without `--gscDir`, the decision-map builder can use the older cached `reports/gsc/` CSVs as a baseline only. Treat that baseline as `NOT_FINAL` until the focused export is reviewed.

## Output

Reports saved to `reports/gsc/`:
- `performance-pages.csv`: all pages with clicks/impressions/position for 12 months.
- `performance-queries.csv`: all queries for 12 months.
- `query-page-combined.csv`: query and page pairs for 3 months.
- `cannibalization-report.csv`: queries competing across multiple pages.

## Sites Available

All sites owned by the authenticated Google account in Google Search Console.

To change the target site, edit `SITE_URL` at the top of `gsc-pull.js`.

## Token File

`gsc-token.json` is created locally and listed in `.gitignore`. Never commit it.
