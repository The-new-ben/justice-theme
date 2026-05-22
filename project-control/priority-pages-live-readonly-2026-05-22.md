# Priority Pages Live Read-Only QA - 2026-05-22

## Status

- VERIFIED LIVE READ-ONLY: this check fetched public URLs only.
- BASE URL: https://jus-tice.co.il.
- VERIFIED PAGES: 0/6.
- BLOCKED PAGES: 6/6.
- HTTP 200 PAGES: 2/6.
- H1 ISSUE PAGES: 2.
- NOINDEX PAGES: 4.
- MOJIBAKE PAGES: 0.
- SCREENSHOTS: NOT CAPTURED because Playwright is not installed in this repo environment.
- SAFETY: no CMS write, redirect, canonical/noindex, sitemap, taxonomy, media, CRM, wp-admin or uPress action was made.

## Results

| Page | Status | HTTP | H1 Count | Issues |
| --- | --- | --- | --- | --- |
| /criminal-lawyer-cost/ | BLOCKED | 200 | 2 | h1_count_2 |
| /plea-bargain/ | BLOCKED | 200 | 2 | h1_count_2 |
| /medical-malpractice-diagnosis-errors/ | BLOCKED | 404 | 1 | http_404;missing_canonical;noindex_detected |
| /joint-custody/ | BLOCKED | 404 | 1 | http_404;missing_canonical;noindex_detected |
| /medication-errors-malpractice/ | BLOCKED | 404 | 1 | http_404;missing_canonical;noindex_detected |
| /divorce-pension-split/ | BLOCKED | 404 | 1 | http_404;missing_canonical;noindex_detected |

## Next

1. If a row is BLOCKED, inspect the live page in a browser and capture rollback material before any CMS edit.
2. For VERIFIED rows, keep monitoring after cache clears and attach GSC page/query evidence when owner OAuth export is available.
3. Capture mobile/desktop screenshots in a browser-capable environment before marking these pages visually verified.
