# Daily GSC Monitoring

Date: 2026-05-10  
Status: ACTIVE OPERATING PROCESS

## Purpose

Use GSC and GA4 as a recurring SEO intelligence loop, not a one-time audit.

The daily/cyclic goal is to detect:
- new search opportunities
- cannibalization
- pages gaining impressions
- pages losing clicks
- low CTR opportunities
- indexing problems
- Core Web Vitals issues
- sitemap errors
- URL migration risks
- conversion tracking gaps

## Daily GSC Checks

1. Performance -> Search results:
   - Top queries by impressions.
   - Top pages by impressions.
   - Queries with impressions but no clicks.
   - Queries ranking positions 5-20.
   - Pages with high impressions and low CTR.

2. Query-to-page mapping:
   - Filter major keyword.
   - Inspect Pages tab.
   - Record all visible URLs.
   - Classify healthy cluster vs cannibalization risk.

3. Page-to-query mapping:
   - Filter important URL.
   - Inspect Queries tab.
   - Confirm whether page ranks for intended terms.

4. Indexing:
   - Total indexed.
   - Total not indexed.
   - Crawled currently not indexed.
   - Duplicate/canonical issues.
   - 404s.
   - Redirect issues.

5. Sitemaps:
   - Submitted sitemap exists.
   - Last read date.
   - Discovered URLs.
   - Errors.

6. Core Web Vitals / HTTPS:
   - Poor/needs-improvement URL groups.
   - HTTPS issues.
   - Representative templates affected.

## Daily GA4 Checks

1. Organic Search sessions.
2. Organic Search engagement.
3. Landing pages from organic.
4. Lead/phone/WhatsApp/document key events after configured.
5. Lawyer directory usage.
6. Lawyer profile views.
7. Article CTA clicks.
8. Internal site search usage.

## Weekly Cluster Review

Review these clusters weekly:

- broad lawyer terms: `עורך דין`, `עורכי דין`
- family/divorce
- criminal
- real estate
- medical malpractice
- personal injury/damages
- traffic
- employment
- inheritance/wills
- national insurance

For each cluster:
- update `gsc-keyword-page-map.csv`
- update `gsc-cannibalization-review.csv`
- update `gsc-content-priorities.csv`
- update `content-architecture-decisions.md` if a decision changes

## Migration Watch Rules

Before URL migration:
- mark high-impression old URLs as DO_NOT_TOUCH until reviewed.
- do not redirect without approved mapping.
- do not remove media URLs with clicks/impressions.

After URL migration:
- check old URL 301 status.
- check target URL 200 status.
- check sitemap inclusion.
- check canonical.
- monitor impressions/clicks for both old and new URLs.
- watch for new 404s or duplicate canonical warnings.

## Report Template

Use this after each meaningful GSC/GA4 session:

```text
GSC / GA4 SESSION SUMMARY

Checked:
- date range
- queries
- pages
- filters
- GSC sections
- GA4 sections

Found:
- top opportunities
- cannibalization risks
- weak primary pages
- low CTR pages
- position 5-20 pages
- indexing problems
- performance problems

Recommended:
- pillar decisions
- merge candidates
- title updates
- internal links
- content expansions
- sitemap actions
- redirect risks

Not executed:
- URL changes
- redirects
- deletions
- content rewrites

Next action:
- one concrete task
```

## Next Monitoring Task

Next concrete task:
- Open GSC Page indexing drilldowns for:
  - Crawled - currently not indexed
  - Duplicate without user-selected canonical
  - Page with redirect
- Export/sample example URLs in `gsc-indexing-review.csv`.

