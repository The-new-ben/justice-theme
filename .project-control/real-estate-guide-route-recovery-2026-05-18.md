# Real Estate Guide Route Recovery - 2026-05-18

## Why This Was Prioritized

The real-estate cluster is the fourth homepage commercial-priority category. During the live Googlebot check, `/real-estate-lawyer-guide/` was found returning `404` with `noindex`, even though the GSC triage marks it as a P0 URL with 26,708 impressions and 7 clicks.

This is a traffic leak, not just a content planning issue.

## Research Basis

- Google crawlable-link guidance emphasizes that important internal pages should be reachable through normal links and clear anchors.
- Current internal-linking best practice for large sites is to preserve valuable URLs when they have search evidence, then connect them to the correct commercial hub.
- Israeli real-estate-law competitors commonly organize commercial pages around buying/selling apartments, contract review, land registry, real-estate tax, late delivery by contractor, appraisers, and property agreements.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://seoglen.com/guides/internal-linking-seo
- https://mli-law.co.il/
- https://www.propertylaw.co.il/
- https://peteladv.co.il/
- https://myglaw.co.il/
- https://ygoldlaw.co.il/real-estate-lawyer/

## Implemented

- Added `practice-real-estate-guide-route.php`.
- Updated `inc/practice-landing.php` so `/real-estate-lawyer-guide/` is treated as a controlled 200 route instead of a 404.
- The route uses the existing controlled practice landing renderer with a real-estate guide configuration.
- Added factual supporting links to existing, live real-estate pages:
  - `/lawyer-for-buying-or-selling-a-house/`
  - `/registration-of-real-estate-israel/`
  - `/land-appreciation-tax/`
  - `/real-estate-lawyer-cost-2025/`
  - `/real-estate-appraiser/`
  - `/marital-property-agreement/`
- Updated the deployment marker to `2026-05-18-real-estate-guide-route-v1`.
- Updated live checkers so deployment verification expects the new marker and checks `/real-estate-lawyer-guide/`.

## Verification Before uPress Pull

- `php -l inc/practice-landing.php` passed.
- `php -l practice-real-estate-guide-route.php` passed.
- `php -l functions.php` passed.
- `node --check tools/check-live-traffic-priority.mjs` passed.
- `node --check tools/check-live-html-sitemap.mjs` passed.
- `node --check tools/check-live-owner-phone.mjs` passed.

## Live Verification Needed After uPress Pull

- `node tools/check-live-traffic-priority.mjs`
- `node tools/check-live-html-sitemap.mjs`
- `node tools/check-live-owner-phone.mjs`

Expected result: `/real-estate-lawyer-guide/` returns 200, indexable, non-noindex, and the live deployment marker is `2026-05-18-real-estate-guide-route-v1`.

## Safety

No public CMS/database row, article body, title/H1/meta in WordPress, URL slug, redirect, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed. This is a theme-rendered route recovery only.
