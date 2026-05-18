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
- `/lawyers/?area=family-law` passed after allowing the intentional filtered-directory noindex.
- `/criminal-defense-attorney/` passed.
- `/traffic-lawyer/` passed.

## Critical Review Items

1. `/family-law/` is the highest-priority intent bug.
   - HTTP 200, but title/H1 do not contain the expected family-law intent terms.
   - Title/H1 contain court-judgment terms such as judge/verdict language.
   - This is a money-page mismatch, not just a cosmetic issue.

2. `/medical-malpractice-lawyer/` is a critical commercial 404.
   - Expected: indexable commercial path or a deliberate safe fallback.
   - Current: HTTP 404 and noindex.

3. `/articles/` is too large and too link-dense.
   - Current HTML size: about 2.9 MB.
   - Current crawlable links: 4,793.
   - This weakens both user scanning and crawl prioritization. The new `/site-map/` is healthier, but `/articles/` still needs pagination/segmentation review.

4. `/contact/` is a high-priority legacy 404.
   - Owner phone is now correct globally, but users and old menu/search paths may still expect a contact page.

5. `/about/` is a trust-path 404.
   - For YMYL/legal content, missing trust/about context is an E-E-A-T weakness and should be fixed with accurate, conservative copy.

## Safe Next Actions

1. Fix `/family-law/` route ownership/title/H1 without changing URLs.
2. Decide whether `/medical-malpractice-lawyer/` should become a real commercial landing page or safely resolve to the lawyer directory filter.
3. Create lightweight `/contact/` and `/about/` route/page handling with accurate owner-approved copy.
4. Split or reduce `/articles/` hub output so it is useful to users and not a 4,793-link dump.
5. Keep `/site-map/` as the crawler discovery hub, but do not use it as a substitute for fixing commercial intent pages.

## Safety

This cycle was read-only against the live site. No CMS/database rows, content bodies, URLs, redirects, sitemap settings, taxonomy terms, lawyer profiles, lead records, payment settings, GA4 or GSC settings were changed.
