# Trust Route Early Render - 2026-05-21

## Status
- CODE FIXED: `/contact/`, `/about/` and `/editorial-policy/` already have virtual trust-route content in `inc/trust-routes.php`.
- FIXED: the trust-route renderer now runs at `template_redirect` priority `-999999`, matching the protected practice-route and HTML-sitemap early renderers.
- FIXED: successful trust-route output sends `X-Justice-Route-Guard: trust-route-early-render`.
- UPDATED: deployment marker is now `2026-05-21-trust-route-early-render-v1`.
- VERIFIED LOCAL: `php -l functions.php`, `php -l inc/trust-routes.php`, `node --check tools/check-live-traffic-priority.mjs`, `node --check tools/check-live-trust-routes.mjs`, task-board CSV parse and `git diff --check` passed; `git diff --check` reported normal Windows line-ending warnings only.
- NOT LIVE VERIFIED: the public server still needs uPress pull/cache clear and a fresh route audit.

## Batch Completed
- Reviewed 3 virtual trust URLs in source: `/contact/`, `/about/`, `/editorial-policy/`.
- Hardened 3 virtual trust URLs against later WordPress redirect plugins.
- Primary live blockers addressed in code: `/contact/` and `/about/` initial 301-to-home route collapse.

## Why This Was Needed
The latest live traffic triage reported `/contact/` and `/about/` returning an initial `301` to the homepage. The theme already had virtual pages for those URLs, but the trust-route hook ran later than the newest protected money-route mitigation. This patch gives trust routes the same earliest WordPress-level chance to render.

## What This Can Fix
- WordPress plugin redirects that run later in `template_redirect`.
- Theme-level fallback-to-home behavior that happens after the early trust-route hook.
- Lost trust/lead paths caused by CMS page absence or 404 fallback inside WordPress.

## What This Cannot Fix
- Server, CDN, host-panel or `.htaccess` redirects that send `/contact/` or `/about/` to `/` before WordPress loads.
- A stale redirect rule in a plugin that runs before `template_redirect` or emits headers before normal hooks.

## Post-Deploy Verification
Run after uPress pull and cache clear:

```bash
node tools/check-live-traffic-priority.mjs
node tools/check-live-trust-routes.mjs
```

Expected results:
- `/contact/` initial HTTP `200`, final path `/contact/`, no `noindex`.
- `/about/` initial HTTP `200`, final path `/about/`, no `noindex`.
- `/editorial-policy/` remains HTTP `200`, final path `/editorial-policy/`, no `noindex`.
- Response headers include `X-Justice-Route-Guard: trust-route-early-render` when headers are visible.

## Safety
- No CMS page body changed.
- No database row changed.
- No public title/H1/meta edited in WordPress admin.
- No redirect rule created or deleted.
- No canonical/noindex setting changed in CMS.
- No taxonomy, sitemap setting, lawyer, lead, payment, GA4/GSC or uPress setting changed.
