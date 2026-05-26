# GSC Data Summary — Jus-Tice.co.il

## What is Google Search Console?

Google Search Console is like Google's notebook about our website.

It tells us:

- what people searched
- which page Google showed
- how many times Google showed it
- how many people clicked
- where the page ranked
- whether two pages are fighting for the same search phrase

## Definitions

**Query:** The words a person typed into Google.

**Page:** The URL Google showed in the search results.

**Clicks:** How many people clicked our result.

**Impressions:** How many times Google showed our result.

**CTR:** Click-through rate. Clicks divided by impressions.

**Position:** Average ranking position in Google.

**Cannibalization:** When two or more pages from our site appear for the same query and compete with each other.

**Low CTR:** Google shows the page, but people do not click enough.

**Striking distance:** A page/query ranking around positions 5–20. These can often improve faster with better titles, content, internal links, and stronger pillar structure.

**GSC mirror:** A file that stores all usable GSC data so we can analyze it outside the GSC interface.

## Property Used

- **Property:** `https://jus-tice.co.il/`
- **Account:** mistabrajustice@gmail.com
- **Access verified:** YES
- **Date/time of pull:** 2026-05-13T14:43 IST
- **Data ranges pulled:** 28d, 28d_prev, 3m, 3m_prev, 12m, 16m

## What Failed

- **Search Appearance:** Cannot combine searchAppearance dimension with other dimensions in the API. Would need a standalone pull.
- **Sitemaps:** 0 sitemaps registered in GSC for this property.
- **Backlinks/Links:** NOT available via Search Analytics API. Must be manually exported from GSC UI.
- **URL Inspection:** Not pulled yet (rate-limited to 2000/day). Priority list created.
- **PageSpeed:** Not pulled yet (separate API, rate-limited). Priority list created.
- **Core Web Vitals (CrUX):** Requires BigQuery or CrUX API. Not available in this extraction.

## Row Counts

| File | Rows |
|------|------|
| pages_28d | 195 |
| pages_3m | 505 |
| pages_12m | 1,474 |
| pages_16m | 1,506 |
| queries_28d | 554 |
| queries_3m | 3,062 |
| queries_12m | 33,154 |
| queries_16m | 39,031 |
| query_page_28d | 560 |
| query_page_3m | 3,221 |
| query_page_12m | 74,624 |
| query_page_16m | 87,129 |
| page_date_28d | 1,678 |
| page_date_28d_prev | 3,457 |
| page_date_3m | 11,997 |
| page_date_3m_prev | 34,038 |
| query_date_28d | 1,965 |
| query_date_28d_prev | 5,530 |
| device_split | 2,883 |
| country_split | 83,241 |
| **TOTAL RAW DATA POINTS** | **~383,000** |

## Analysis Summary

| Analysis | Count |
|----------|-------|
| URL Master | 1,490 URLs |
| Query+Page Pairs | 74,624 |
| Query Master | 44,753 queries |
| Cannibalization Groups | 7,916 queries |
| Low CTR Opportunities | 354 |
| Striking Distance | 1,174 |
| Traffic Trend Rows | 48 |
| Criminal Law URLs | 179 |
| Money Keywords | 4,824 |

## Top Findings

### Top 5 Pages by Clicks (12m)
1. PDF form (תחנות משטרה כתובת טלפון) — 608 clicks
2. Lahav 433 — 302 clicks  
3. Homepage — 279 clicks
4. Court Judge — 234 clicks
5. Criminal defense lawyer cost — 217 clicks

### Top 5 Cannibalized Queries
1. "עורך דין פלילי" — 13 pages competing, 14,455 impressions
2. "עורך דין פלילי מומלץ" — 15 pages competing, 13,589 impressions
3. "עורך דין פלילי בתל אביב" — 9 pages competing, 12,127 impressions
4. "עורך דין מקרקעין" — 2 pages competing, 11,218 impressions
5. "משמורת ילדים" — 4 pages competing, 8,508 impressions

### Criminal Law Key Finding
The query "עורך דין פלילי" has **13 different pages** receiving impressions — massive cannibalization that a proper pillar page would resolve.
