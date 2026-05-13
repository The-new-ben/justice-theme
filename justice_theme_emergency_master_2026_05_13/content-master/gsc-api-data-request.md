# GSC API Data Request

Required exports:

1. Search Analytics, last 3 months
- dimensions: query, page, date
- metrics: clicks, impressions, CTR, position

2. Search Analytics, last 12 months
- dimensions: query, page
- metrics: clicks, impressions, CTR, position

3. Page-indexing / coverage exports
- indexed URLs
- not indexed URLs
- duplicate/canonical issues
- 404s and soft 404s

4. Sitemap data
- submitted sitemaps
- discovered URLs
- last read
- errors

Use these to populate:
- `gsc_clicks_3m`
- `gsc_impressions_3m`
- `gsc_ctr_3m`
- `gsc_position_3m`
- `gsc_clicks_12m`
- `gsc_impressions_12m`
- `top_queries`
- `traffic_risk`
- `indexation_status`
