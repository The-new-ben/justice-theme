# Traffic Priority Audit - 2026-05-18

## Research Basis

- Google's Search Console traffic-drop guide recommends isolating whether a decline is tied to specific pages, queries, countries, devices or search features before making broad changes.
- Google's helpful-content guidance recommends auditing the pages and searches most affected by a drop, then judging whether those pages provide complete, trustworthy, people-first answers.

Sources:
- https://support.google.com/webmasters/answer/9079473
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

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

## Critical Review Items

1. `/articles/` is too large and too link-dense.
   - Current HTML size: about 2.9 MB.
   - Current crawlable links: 4,795.
   - This weakens both user scanning and crawl prioritization. The new `/site-map/` is healthier, but `/articles/` still needs pagination/segmentation review.

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

## Safe Next Actions

1. Split or reduce `/articles/` hub output so it is useful to users and not a 4,795-link dump.
2. Keep `/site-map/` as the crawler discovery hub, but do not use it as a substitute for fixing commercial intent pages.
3. Continue content-cluster classification so medical malpractice, family law and other commercial hubs get stronger supporting articles.
4. Continue live journey checks after every route/content change.

## Safety

The `/family-law/`, `/medical-malpractice-lawyer/`, `/contact/`, and `/about/` fixes were render-only theme code. No CMS/database rows, content bodies, URLs, redirects, sitemap settings, taxonomy terms, lawyer profiles, lead records, payment settings, GA4 or GSC settings were changed.
