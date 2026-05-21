# Real Estate Guide Redirect Guard - 2026-05-21

Status: CODE FIXED / NOT LIVE VERIFIED / BLOCKED LIVE BEFORE DEPLOY

## Summary

The public `/real-estate-lawyer-guide/` route is still not safe for promotion. The theme already contains a controlled template for this route, but the live server currently redirects the request before the route can render.

This cycle adds a narrow theme-level guard against the two observed redirect conflicts and updates the live traffic checker so future audits fail if this route resolves to the homepage.

## Live Failure Observed Before This Patch

- BLOCKED LIVE: `https://jus-tice.co.il/real-estate-lawyer-guide/` returned `301` to `https://jus-tice.co.il`.
- BLOCKED LIVE: `https://jus-tice.co.il/real-estate-lawyer-guide` returned `301` to `http://jus-tice.co.il/real-estate-attorney`.
- BLOCKED LIVE: the followed traffic-priority check ended at final path `/`, not `/real-estate-lawyer-guide/`.
- NOT VERIFIED: the controlled guide template did not reach public output in this live check.

## Code Change

- FIXED: `inc/routing-guards.php` now detects the active `/real-estate-lawyer-guide/` request.
- FIXED: `inc/routing-guards.php` now blocks WordPress-level `wp_redirect` and `redirect_canonical` attempts from this route to `/` or `/real-estate-attorney`.
- FIXED: `tools/check-live-traffic-priority.mjs` now requires route checks to finish on their expected final path, including `/real-estate-lawyer-guide/`.
- UPDATED: `JUSTICE_DEPLOY_MARKER` to `2026-05-21-real-estate-guide-redirect-guard-v1`.

## Verification

- VERIFIED LOCAL: `php -l inc/routing-guards.php` passed.
- VERIFIED LOCAL: `php -l functions.php` passed.
- VERIFIED LOCAL: `node --check tools/check-live-traffic-priority.mjs` passed.
- VERIFIED TOOLING: `node tools/check-live-traffic-priority.mjs` now detects the live guide failure with `final_path_/_expected_/real-estate-lawyer-guide/`.
- VERIFIED TOOLING: the same checker now also exposes existing homepage-fallback risk on `/site-map/`, `/medical-malpractice-lawyer/`, `/inheritance-lawyer/`, `/contact/` and `/about/`; these are route QA backlog items, not fixed in this cycle.
- NOT LIVE VERIFIED: public server still needs Git pull/cache clear before this code can affect the live route.

## Important Limit

This guard can only stop redirects that pass through WordPress filters. If the bad redirect is configured at server/CDN/uPress/Redirection-plugin level before the theme loads, the live route will remain blocked after deploy.

If that happens, the next required action is to remove the stale redirect rule that maps:

- `/real-estate-lawyer-guide/` to `/`
- `/real-estate-lawyer-guide` to `/real-estate-attorney`

## Post-Deploy Checklist

1. Pull latest Git on uPress and clear cache.
2. Fetch `https://jus-tice.co.il/?justice_bust=real-estate-guide-redirect-guard-v1` and confirm marker `2026-05-21-real-estate-guide-redirect-guard-v1`.
3. Check `https://jus-tice.co.il/real-estate-lawyer-guide/` returns `200` and final path `/real-estate-lawyer-guide/`.
4. Check `https://jus-tice.co.il/real-estate-lawyer-guide` either returns `200` or redirects only to `/real-estate-lawyer-guide/`.
5. Run `node tools/check-live-traffic-priority.mjs`.
6. Only after PASS: include `/real-estate-lawyer-guide/` in the real-estate support-to-hub CMS edit batch.

## Safety

No CMS page body, WordPress database row, title/H1/meta, public slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer profile, lead, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed in this cycle.
