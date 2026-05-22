# Protected Practice Route Early Render - 2026-05-21

Status: CODE FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED

## Summary

The live route triage showed that several priority routes currently receive an initial `301` to the homepage. The strongest remaining repo-side mitigation is to render controlled theme routes before later WordPress redirect plugins can run.

This patch moves controlled practice-route rendering to a very early `template_redirect` priority and exits immediately after rendering. It also moves the HTML sitemap renderer earlier.

## Code Changes

- FIXED: `inc/practice-landing.php` now has a shared controlled-route template resolver.
- FIXED: controlled practice routes render at `template_redirect` priority `-999999` and exit before later redirect plugins.
- FIXED: early render adds `X-Justice-Route-Guard: controlled-practice-early-render`.
- FIXED: `inc/html-sitemap.php` now renders `/site-map/` at `template_redirect` priority `-999999`.
- UPDATED: deployment marker to `2026-05-21-protected-route-early-render-v1`.

## Routes Covered by the Early Practice Renderer

- `/family-law/`
- `/medical-malpractice-lawyer/`
- `/real-estate-lawyer-guide/`
- `/inheritance-lawyer/`

## Related Route Covered by Earlier Sitemap Priority

- `/site-map/`

## Routes Not Fixed by This Patch

- `/contact/`
- `/about/`

These need either working CMS pages, explicit theme routes, or removal of the stale redirect rule. This patch intentionally does not create new static contact/about content.

## Verification

- VERIFIED LOCAL: `php -l inc/practice-landing.php` passed.
- VERIFIED LOCAL: `php -l inc/html-sitemap.php` passed.
- VERIFIED LOCAL: `php -l functions.php` passed.
- NOT LIVE VERIFIED: public server still needs uPress pull/cache clear.

## Important Limit

This patch can only beat redirects that happen inside WordPress after the theme is loaded. It cannot beat:

- uPress/nginx redirect rules.
- CDN/cache redirect rules.
- redirect rules that fire before WordPress loads.

If post-deploy checks still show `initial_redirect_301_to_/`, inspect and remove the stale server/plugin redirect layer.

## Post-Deploy QA

1. Pull latest Git on uPress and clear cache.
2. Confirm marker `2026-05-21-protected-route-early-render-v1`.
3. Run `node tools/check-live-traffic-priority.mjs`.
4. PASS condition: `/site-map/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/` and `/inheritance-lawyer/` return initial `200` and stay on their expected final paths.
5. If `/contact/` and `/about/` still redirect, keep them in the route cleanup backlog.

## Safety

No public CMS page body, database row, title/H1/meta, public slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer profile, lead, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
