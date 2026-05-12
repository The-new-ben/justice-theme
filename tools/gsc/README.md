# GSC API Tool — Quick Start

## First Time on a New PC
```bash
cd tools/gsc
npm install googleapis open
node gsc-pull.js
```
Browser opens → log in with `mistabrajustice@gmail.com` → click Allow → done.
Token saves locally. Next runs are automatic.

## After First Time
```bash
cd tools/gsc
node gsc-pull.js
```
No browser needed — token auto-refreshes.

## Output
Reports saved to `reports/gsc/`:
- `performance-pages.csv` — all pages with clicks/impressions/position (12 months)
- `performance-queries.csv` — all queries (12 months)
- `query-page-combined.csv` — query+page pairs (3 months)
- `cannibalization-report.csv` — queries competing across multiple pages

## Sites Available
All sites owned by `mistabrajustice@gmail.com` in Google Search Console.
Currently: `jus-tice.co.il`, `cy-prus.co.il`.
To change target site, edit `SITE_URL` at the top of `gsc-pull.js`.

## Token File
`gsc-token.json` is created locally and listed in `.gitignore`. Never committed.
