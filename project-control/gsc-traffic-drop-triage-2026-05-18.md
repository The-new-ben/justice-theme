# GSC Traffic Drop Triage - 2026-05-18

Cycle time: 2026-05-18 17:54 Asia/Jerusalem

## Research basis

- Google Search Console Performance reports are the right source for separating page-level and query-level traffic changes, including comparisons by pages, queries, CTR, impressions, device and country. Source: https://support.google.com/webmasters/answer/7576553
- Google's title-link guidance says title links are a primary search-result decision point and should be descriptive, concise and aligned to the page. Source: https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets
- Google's snippet guidance says snippets are primarily generated from page content and can be improved with useful page content and quality meta descriptions. Source: https://developers.google.com/search/docs/appearance/snippet

## What the current GSC mirror says

The traffic problem is real, but the first rows do not show a simple sitewide crawl block. The latest local GSC mirror shows live technical checks passing, while the drop report is concentrated around old PDFs, archive/utility pages and narrow legal-case articles.

This matters because recovering every old click is not the business goal. The business goal is qualified lawyer registration and qualified consumer legal demand. We should protect useful informational traffic, but the next public edits should prioritize money clusters and pages that can convert.

## High-signal rows

| URL | Current clicks | Previous clicks | Change | Current impressions | Previous impressions | Triage |
|---|---:|---:|---:|---:|---:|---|
| `/wp-content/uploads/2023/03/attorney-list-december-2017-1.pdf` | 2 | 9 | -7 | 486 | 354 | Legacy PDF, not a primary conversion route |
| `/court-judge` | 0 | 7 | -7 | 11 | 283 | Utility/archive review |
| `/wp-content/uploads/2023/03/attorney-list-july-updated-nov-2020-1.pdf` | 1 | 4 | -3 | 274 | 204 | Legacy PDF, not a primary conversion route |
| Homepage | 8 | 10 | -2 | 1,723 | 1,504 | Important commercial/directory intent, needs CTR/title/snippet/CRO review |
| `/damages-claim-husband-ketubah-obligation` | 0 | 2 | -2 | 20 | 63 | Narrow family-law article |
| `/united-arab-emirates-market-overview` | 0 | 2 | -2 | 13 | 12 | Low priority for current Israeli lawyer marketplace |
| `/portugal-homes` | 0 | 1 | -1 | 11 | 15 | Low priority versus core legal-lead clusters |

Homepage long-range context from `gsc-url-master.csv`:

- 28 days: 8 clicks / 1,723 impressions / 0.46% CTR / avg position 14.2
- 3 months: 27 clicks / 5,153 impressions / 0.52% CTR / avg position 16.6
- 12 months: 279 clicks / 81,329 impressions / 0.34% CTR / avg position 33.5
- 16 months: 548 clicks / 179,385 impressions / 0.31% CTR / avg position 35.2

## Money-cluster warning

The page-level GSC mirror also shows that some high-value commercial pages had large historical visibility but little or no recent traffic in the sampled rows:

- `/criminal-defense-attorney`: 10 clicks / 62,117 impressions over 12 months, but 0 recent clicks in the sampled row.
- `/real-estate-lawyer-guide`: 7 clicks / 26,558 impressions over 12 months, but 0 recent clicks in the sampled row.
- `/medical-malpractice-lawyer`: 1 click / 21,783 impressions over 12 months, but 0 clicks and 11 impressions over 3 months in the sampled row.
- `/traffic-lawyer`: 0 clicks / 20,062 impressions over 12 months, and 0 recent sampled clicks.

Interpretation: the next growth work should not start by promoting old PDFs. It should start by comparing current GSC queries for core commercial clusters, then fixing titles, visible H1/intent, snippets, internal links and support-page classification for pages where impressions exist but CTR or recent visibility collapsed.

## Decisions for other agents

- Do not noindex, delete or redirect old PDF/archive URLs from this report without owner approval and backlink/history review.
- Do not push Portugal or unrelated historical traffic to the homepage top just because it once produced clicks.
- Treat homepage as a commercial directory/consultation entry point with a CTR problem, not merely a crawlability problem.
- Treat money clusters as priority: family/divorce, medical malpractice, criminal, traffic, inheritance/wills, employment/labor and real estate.
- Next safe cycle: export or mine query-page pairs for those money clusters, identify top impressions with weak CTR, and prepare page-specific title/snippet/H1/internal-link recommendations before public CMS edits.

## Safety

This cycle changed only repo planning/status artifacts. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment was changed.
