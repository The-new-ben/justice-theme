# GSC 404 Live Audit - 2026-05-20

## Purpose
Check the exact Google Search Console 404 examples the owner shared on 2026-05-20, without spending too much time on stale Search Console data or adding broad redirects that could damage SEO.

## Google Guidance Used
- Google Search Console help says that if a page moved, return a 3XX redirect to the new page, but 404 is not necessarily a problem when a page has no replacement.
- Google Search Central redirect guidance says old URLs should redirect when content moved or was consolidated.
- Google Search Central crawling guidance says if a page moved or has a clear replacement, return a 301; otherwise real missing pages should keep a 404/410 instead of pretending to be valid.

Sources:
- https://support.google.com/webmasters/answer/7440203
- https://developers.google.com/search/docs/crawling-indexing/301-redirects
- https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors

## Live Findings
| URL from GSC sample | GSC last crawl shown by owner | Live result on 2026-05-20 | Decision |
|---|---:|---|---|
| `/drug-crimes/` | 2026-05-16 | 200 | Resolved. No redirect needed. |
| `/criminal-record-deletion/` | 2026-05-16 | 200 | Resolved. No redirect needed. |
| `/shoplifting-defense/` | 2026-05-16 | 200 | Resolved. No redirect needed. |
| `/real-estate/` | 2026-05-16 | 200 | Resolved. No redirect needed. |
| `/tax-law/` | 2026-05-16 | 301 to homepage before fix | Fixed exact legacy redirect to `/tax-lawyer/`. |
| `/personal-injury/` | 2026-05-16 | 301 to homepage before fix | Fixed exact legacy redirect to `/tort-lawyer/`. |
| `/wp-content/plugins/real-accessability/support.php` | 2025-12-08 | 404 | Leave as 404. This is plugin/security noise, not a user page. |
| `/wp-*.php` example | 2025-12-05 | 404 | Leave as 404. This is fake WordPress-file noise, not a user page. |

## Code Change
Added two exact redirects in `inc/url-redirects.php` before WordPress canonical redirects:

- `/tax-law/` -> `/tax-lawyer/`
- `/personal-injury/` -> `/tort-lawyer/`

No broad redirect rule was added. No homepage catch-all was added.

## Next Action
After deployment, check the two redirects live, then in Search Console use Validate Fix only after the site is pulled and cache is clear. The main 200 URLs can wait for Google recrawl because Search Console data was stale.

