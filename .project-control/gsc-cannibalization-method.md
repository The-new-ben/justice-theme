# GSC Cannibalization Method

Date: 2026-05-10
Status: ACTIVE METHOD

## Purpose

Use Google Search Console browser data to decide which existing URLs should become pillars, supporting articles, merge candidates, redirect candidates, or protected high-risk URLs.

## Official Basis

Google's Performance report shows clicks, impressions, CTR and average position. The table can be grouped by queries or pages, and filters can be applied by query or URL. Google also warns that filtering and grouping can change totals because query and page data are aggregated differently.

Sources:
- Google Search Console Performance report overview: https://support.google.com/webmasters/answer/7576553
- Google Search Console advanced filtering: https://support.google.com/webmasters/answer/17011165
- Google site moves with URL changes: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Google canonical guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

## Query-To-Page Method

For each keyword:

1. Open Performance -> Search results.
2. Set date range to last 3 months.
3. Add filter: Query contains the keyword.
4. Record total clicks, impressions, CTR and position.
5. Open Pages tab.
6. Record every visible URL with clicks, impressions, CTR and position.
7. Classify:
   - `HEALTHY_CLUSTER`
   - `CANNIBALIZATION_RISK`
   - `WEAK_PRIMARY_PAGE`
   - `MERGE_CANDIDATE`
   - `URL_MIGRATION_RISK`
   - `NEEDS_PILLAR`
   - `NEEDS_INTERNAL_LINKING`
   - `NEEDS_TITLE_REWRITE`
   - `NEEDS_CONTENT_EXPANSION`

## Page-To-Query Method

For important URLs:

1. Filter by Page.
2. Open Queries tab.
3. Record which queries Google associates with that URL.
4. Compare expected query intent to actual query intent.
5. Decide whether the page needs:
   - stronger title/meta
   - content expansion
   - internal links
   - merge into another URL
   - redirect later
   - protection from URL changes

## Cannibalization Judgment Rules

Do not assume every multi-URL result is bad.

Healthy cluster:
- One pillar URL appears for the broad keyword.
- Supporting URLs appear for narrower intents.
- Internal links clearly reinforce the pillar.

Cannibalization risk:
- Several pages target the same user intent.
- No URL clearly owns the query.
- Old Hebrew slugs, PDFs and generic homepage results compete with intended pillar pages.

Weak primary page:
- Google finds impressions for the query, but the intended clean pillar page is missing or weak.

URL migration risk:
- An old URL, uploaded PDF/DOCX, or Hebrew slug receives impressions or clicks.
- Do not change or redirect before mapping and approval.

## Browser-Only Limitations

- The browser UI gives visible rows, not a guaranteed full export.
- In-app browser downloads are not supported in this session.
- Google Sheets export was visible but did not complete through automation.
- API/service-account export remains the better long-term path.
- GSC data is delayed and can be rounded/truncated.

## How To Avoid Wrong Conclusions

- Do not redirect a URL only because it looks ugly.
- Do not delete a PDF/document URL that has clicks.
- Do not create a new page if an old page already receives impressions for the same intent.
- Do not judge by impressions alone; check click, CTR, position and page intent.
- Do not merge pages that serve different intents.
- Do not treat low-position URLs as useless; they may reveal the correct future pillar topic.

## First Pass Conclusion

The first five-keyword pass shows weak pillar ownership:

- Criminal-law terms are mainly tied to an old Hebrew slug and scattered legacy pages.
- Divorce-lawyer terms are mainly tied to an old long Hebrew slug and one PDF.
- Divorce-mediation terms are mainly tied to uploaded documents and old articles rather than a clean `/divorce-mediation/` page.
- Family-lawyer terms are weak and mostly routed to the old divorce-lawyer article/homepage.

No URL changes should be executed yet.

