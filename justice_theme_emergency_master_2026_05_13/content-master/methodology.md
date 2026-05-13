# Content Master Methodology

Generated: 2026-05-13 09:48:22

## Method used in this starter consolidation
1. Loaded accessible uploaded files: `performance-pages.csv`, `query-page-combined.csv`, `performance-queries.csv`, `cannibalization-report.csv`, `cannibalization-map.csv`, `content-inventory.csv`.
2. Normalized URLs to HTTPS where possible.
3. Merged GSC page metrics into a URL-level master.
4. Added top query/page relationships from `query-page-combined.csv`.
5. Added cannibalization query flags from `cannibalization-report.csv`.
6. Applied cautious heuristic cluster classification from title/URL/top queries.
7. Added starter English slug suggestions only where confidence exists.
8. Marked all rows as `import_ready=NO`.

## Why it is not final
The master still needs actual WordPress metadata and article bodies:
- real post IDs for all URLs
- categories/tags/practice-area taxonomies
- body content files
- headings/internal links/official sources
- final pillar/support decisions
- final redirect targets

## Required next methodology
1. Extract RAR archives or use WP REST/WP All Export to obtain content body files.
2. Populate categories/tags/practice_area from WordPress.
3. Use GSC API to export 3-month and 12-month query/page data with dates.
4. Re-run classification using category + title + URL + body + GSC queries.
5. Choose a small pilot cluster.
6. Create exact merge/update/redirect decisions for that pilot only.
7. Execute only after owner approval and backup.
