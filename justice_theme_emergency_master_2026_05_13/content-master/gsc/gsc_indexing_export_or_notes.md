# GSC Indexing Status — Notes
**Generated:** 2026-05-13  
**Property:** https://jus-tice.co.il/  
**Method:** GSC API (performanceReport) + manual notes

## What Was Pulled via API

| Report | File | Rows |
|---|---|---|
| Pages 12m | gsc_pages_12m.csv | 1,474 |
| Queries 12m | gsc_queries_12m.csv | 33,154 |
| Query+Page 12m | gsc_query_page_12m.csv | 3,252 |
| Cannibalization | gsc_cannibalization_map.csv | 124 |
| Low CTR (>1000 imp, <2% CTR) | gsc_low_ctr_opportunities.csv | 672 |
| Striking Distance (pos 5-20, 500+ imp) | gsc_striking_distance.csv | 140 |
| Traffic Drop (pos>30, 2000+ imp) | gsc_traffic_drop_analysis.csv | 343 |

**Note:** The GSC Performance API does not expose the Coverage/Indexing report (Valid, Excluded, Error tabs). That data must be exported manually from the GSC UI or via the URL Inspection API for individual URLs.

## What Requires Manual GSC Export

These reports are NOT available via the Performance API and must be done in the GSC UI:

1. **Index Coverage report** — Valid / Excluded / Error counts
2. **Excluded reasons** — Crawled but not indexed, noindex, redirects, soft 404
3. **Core Web Vitals** — Good / Needs improvement / Poor URL counts
4. **Mobile Usability** — Mobile-unfriendly URLs
5. **Sitemaps status** — Note: the API found 0 sitemaps configured. This must be verified manually.
   - **ACTION REQUIRED:** Check if sitemap exists at jus-tice.co.il/sitemap.xml or jus-tice.co.il/sitemap_index.xml
   - Rank Math typically auto-generates sitemaps. Verify Rank Math is active and sitemap is submitted.

## Key Findings

- **1,474 URLs have at least some impressions** in the last 12 months — these are indexable.
- **Sitemaps:** 0 sitemaps found via API. This is a critical gap. Submit via GSC UI immediately.
- **Top traffic risk URLs** identified in gsc_pages_12m.csv — do not change their URLs without owner approval.
- **672 low-CTR opportunities** — high impressions but poor click-through. Priority for title/meta optimization.
- **124 cannibalization groups** — these are queries where 2+ pages compete. High-priority merge/redirect decisions needed.

## Critical Warning

The GSC Performance API was confirmed to use property: `https://jus-tice.co.il/`  
The site appears to also have: `https://www.jus-tice.co.il/` — confirm in GSC UI whether both properties exist and if data is split.

## Next Steps for Owner

1. Open Google Search Console manually.
2. Check Index Coverage tab — export to CSV.
3. Verify sitemap is submitted.
4. Verify www vs non-www — only one should be canonical.
5. Check Core Web Vitals tab for mobile performance.
