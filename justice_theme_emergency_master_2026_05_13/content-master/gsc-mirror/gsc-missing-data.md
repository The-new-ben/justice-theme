# GSC Missing Data Report

Generated: 2026-05-13T14:47:08.400Z

## API Limitations

- **Backlinks/Links**: NOT available via Search Analytics API. Must be manually exported from GSC UI. See `links-manual-export-needed.md`.
- **URL Inspection**: Available via API but rate-limited (2000/day). Will be done separately for priority URLs.
- **PageSpeed Insights**: Separate API, rate-limited. Will be done for priority URLs.
- **Core Web Vitals (CrUX)**: Requires BigQuery or CrUX API. Not pulled in this extraction.

## Missing/Empty Pulls

- gsc_search_appearance: 0 rows returned. Dimensions: page,searchAppearance. Range: 2025-05-13 to 2026-05-13.
