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
