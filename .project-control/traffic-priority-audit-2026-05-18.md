# Traffic Priority Audit - 2026-05-18

## Research Basis

- Google's Search Console traffic-drop guide recommends isolating whether a decline is tied to specific pages, queries, countries, devices or search features before making broad changes.
- Google's helpful-content guidance recommends auditing the pages and searches most affected by a drop, then judging whether those pages provide complete, trustworthy, people-first answers.
- Google's pagination guidance recommends using crawlable links between paginated pages so search engines can discover items without relying on user-triggered JavaScript.
- Google's large-site crawl-budget guidance warns that exposing many low-value URLs or excessive discovery paths can waste crawl attention.

Sources:
- https://support.google.com/webmasters/answer/9079473
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget

## Live Audit Result

Tool:
- `tools/check-live-traffic-priority.mjs`

Report:
- `reports/traffic-priority-audit-2026-05-18.csv`

Checked priority paths:
- Homepage lead entry
- Dynamic HTML sitemap crawl hub
- Article archive hub
- Family law practice page
- Family lawyer directory filter
- Medical malpractice commercial path
- Criminal lawyer commercial path
- Traffic lawyer commercial path
- Legacy contact path
- About/trust path

## Passes

- `/` passed: homepage lead path, lawyer directory link, sitemap link and owner phone are present.
- `/site-map/` passed: dynamic crawl hub is reachable and crawlable.
- `/family-law/` now passes after the controlled family-law template route was deployed and pulled in uPress.
- `/lawyers/?area=family-law` passed after allowing the intentional filtered-directory noindex.
- `/medical-malpractice-lawyer/` now passes after the controlled medical-malpractice route was deployed and pulled in uPress.
- `/criminal-defense-attorney/` passed.
- `/traffic-lawyer/` passed.
- `/contact/` now passes after a lightweight trust/contact route was deployed and pulled in uPress.
- `/about/` now passes after a lightweight about/trust route was deployed and pulled in uPress.
- `/articles/` now passes after the public archive query was segmented to 24 posts per page with normal pagination.

## Critical Review Items

- No sampled priority route currently fails the live traffic-priority checker.
- Next risk is content quality/distribution, not a sampled route availability bug: outdated articles, weak cluster classification, homepage priority order, and GSC query/page mismatch still need review.

## Fixed This Cycle

- `/family-law/` was fixed without a URL change, redirect or CMS edit.
- A controlled template route now serves the family-law practice hub even though an old court-judgment content item owns the slug in WordPress.
- Post-pull live audit result: `/family-law/` is `PASS`, HTTP 200, about 105 KB, 104 links.
- `/medical-malpractice-lawyer/` was fixed without a URL change, redirect or CMS edit.
- A controlled template route now serves a medical-malpractice practice hub at the existing commercial URL instead of the 404/noindex response.
- Post-pull live audit result: `/medical-malpractice-lawyer/` is `PASS`, HTTP 200, about 56 KB, 67 links.
- `/contact/` was fixed without a CMS page, URL change or redirect.
- `/about/` was fixed without a CMS page, URL change or redirect.
- Post-pull live audit result: `/contact/` is `PASS`, HTTP 200, about 72 KB, 66 links; `/about/` is `PASS`, HTTP 200, about 70 KB, 67 links.
- `/articles/` was fixed without editing article content or changing article URLs.
- The public archive now renders a segmented first page instead of thousands of links at once.
- Post-pull live audit result: `/articles/` is `PASS`, HTTP 200, about 125 KB, 203 links, down from about 2.9 MB and 4,795 links.

## Safe Next Actions

1. Keep `/site-map/` as the crawler discovery hub and `/articles/` as a usable paginated archive.
2. Start content classification and pruning review: outdated/corona articles, weak practice-area assignment, and thin/duplicative support pages.
3. Continue content-cluster classification so medical malpractice, family law and other commercial hubs get stronger supporting articles.
4. Continue live journey checks after every route/content change.

## Safety

The `/family-law/`, `/medical-malpractice-lawyer/`, `/contact/`, `/about/`, and `/articles/` fixes were render/query-only theme code. No CMS/database rows, content bodies, URLs, redirects, sitemap settings, taxonomy terms, lawyer profiles, lead records, payment settings, GA4 or GSC settings were changed.
