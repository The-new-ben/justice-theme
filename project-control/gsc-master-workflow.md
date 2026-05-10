# GSC Master Workflow

Date: 2026-05-10  
Status: ACTIVE - continuous SEO intelligence workflow

## Purpose

Use Google Search Console, GA4, SERP research and the content inventory to decide what to keep, expand, merge, rewrite, redirect later, or protect.

Hard rule: map first, decide second, execute later in approved batches.

## Current Access

VERIFIED:
- GSC browser UI access for `https://jus-tice.co.il/`.
- GA4 browser UI access for property `justice - GA4`.
- Public WordPress REST export with 1,220 public content rows.

BLOCKED / PARTIAL:
- GSC API/export is not available.
- Database/phpMyAdmin is not available.
- Some direct GSC page filters for Hebrew URLs return unreliable zero rows, so use query-to-page evidence until API/export confirms.

## Cycle Workflow

1. Performance / Search results:
   - Query-to-page: filter query, inspect Pages.
   - Page-to-query: filter page, inspect Queries.
   - Record clicks, impressions, CTR and average position.

2. Indexing:
   - Check indexed/not indexed totals.
   - Record redirect, duplicate, 404, crawled-not-indexed and canonical issues.

3. Sitemaps:
   - Check submitted sitemap, last read, status and discovered URLs.
   - Compare against public sitemap checks and sitemap strategy.

4. Core Web Vitals / HTTPS:
   - Record mobile/desktop issue groups.
   - Record HTTPS/non-HTTPS issue counts.

5. Links:
   - Check internal/external link reports when visible.
   - Use internal link map to reinforce pillars and avoid orphan pages.

6. GA4:
   - Check traffic acquisition, pages/screens, events and key events.
   - Verify lead/phone/WhatsApp/document events are tracked.

## Output Files

- `gsc-keyword-page-map.csv`
- `gsc-cannibalization-review.csv`
- `gsc-content-priorities.csv`
- `gsc-page-query-review.csv`
- `gsc-indexing-review.csv`
- `gsc-core-web-vitals-review.csv`
- `ga4-analytics-review.md`
- `ga4-event-plan.csv`
- `seo-title-h1-review.csv`
- `content-architecture-decisions.md`
- `sitemap-strategy.md`
- `daily-gsc-monitoring.md`

## Decision Labels

- KEEP
- EXPAND
- MERGE
- REWRITE
- MAKE_PILLAR
- SUPPORT_PILLAR
- REDIRECT_LATER
- DO_NOT_TOUCH_HIGH_TRAFFIC_URL
- NEEDS_LEGAL_REVIEW
- NEEDS_INTERNAL_LINKING
- NEEDS_TITLE_UPDATE
- NEEDS_SCHEMA
- NEEDS_SPEED_FIX

## Session Report Format

Checked:
- date range
- queries/pages/filters
- GSC sections
- GA4 sections

Found:
- opportunities
- cannibalization risks
- weak primary pages
- low CTR / position 5-20 pages
- indexing/performance problems

Recommended:
- pillar decisions
- merge candidates
- title/internal-link/content actions
- sitemap/redirect risks

Not executed:
- URL changes
- redirects
- deletions
- public rewrites
