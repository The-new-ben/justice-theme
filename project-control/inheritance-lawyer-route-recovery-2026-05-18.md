# Inheritance Lawyer Route Recovery - 2026-05-18

## Goal

Recover `/inheritance-lawyer/` as a controlled, indexable inheritance/wills commercial route without editing WordPress content, database rows, redirects, taxonomy terms, or CMS settings.

## Why

The homepage and navigation strategy need a real inheritance/wills lawyer destination. Live checks showed:

- `/inheritance-lawyer/` returned 404.
- `/lawyers/?area=inheritance-law` returned 200 but was noindexed.
- Existing support pages such as `/inheritance/`, `/inheritance-order/`, `/will-probate-objection/`, `/will-and-testament/`, and `/what-is-a-probate-order/` returned 200 and are suitable support pages.

## Research Basis

- Google says internal links should be crawlable `<a href>` links and use clear anchor text that helps users and Google understand the destination.
- Current inheritance/wills competitor pages cluster around wills, probate orders, inheritance orders, objections to wills, estate administration, heir disputes, estate division, and family property disputes.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://ygoldlaw.co.il/
- https://ody.co.il/
- https://guykamri-law.co.il/
- https://www.yerusha.org.il/
- https://www.the-lawyer.co.il/

## Implemented

- Added `practice-inheritance-lawyer-route.php`.
- Updated `inc/practice-landing.php` with a controlled `/inheritance-lawyer/` route, SEO metadata filters, and live support links.
- Updated inherited inheritance/wills support links away from future/non-live `/will/` and `/will-contest/` paths to current live support URLs.
- Updated `JUSTICE_DEPLOY_MARKER` to `2026-05-18-inheritance-lawyer-route-v1`.
- Updated live checkers to expect the new marker and include `/inheritance-lawyer/` in traffic-priority checks.

## Verification

Pre-deployment local checks:

- `php -l functions.php` passed.
- `php -l inc/practice-landing.php` passed.
- `php -l practice-inheritance-lawyer-route.php` passed.
- Node syntax checks passed for the live traffic, HTML sitemap, and owner-phone checkers.
- `git diff --check` passed with line-ending warnings only.

Post-deployment live verification:

- Commit `d6cfc64` was pushed to GitHub `main`.
- Codex opened uPress File Manager Git management for `/wp-content/themes/justice-theme` and clicked Pull Git. uPress did not display a clear success toast, but live deployment-marker proof showed the pull landed.
- `/inheritance-lawyer/` returns HTTP 200.
- It does not expose `noindex`.
- It self-canonicalizes to `https://jus-tice.co.il/inheritance-lawyer/`.
- It includes inheritance/wills language and links to live support pages, including `/inheritance-order/` and `/will-probate-objection/`.
- `tools/check-live-traffic-priority.mjs`, `tools/check-live-html-sitemap.mjs`, `tools/check-live-owner-phone.mjs`, and `tools/check-live-reachability.mjs` passed after deployment.

## Safety

Render-only theme route recovery. No public CMS database row, article body, WordPress title/H1/meta stored value, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.
