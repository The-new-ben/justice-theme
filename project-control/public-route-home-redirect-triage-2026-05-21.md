# Public Route Home Redirect Triage - 2026-05-21

Status: VERIFIED LIVE / BLOCKED BY REDIRECT LAYER / TOOLING FIXED

## Summary

The stricter traffic-priority checker exposed a batch of canonical public URLs that currently return an initial `301` to the homepage. After following the redirect, they serve homepage HTML with final path `/`.

This is not a normal content-quality issue. These routes are being redirected before their intended page/template can render.

## Batch Reviewed

Reviewed `12` priority URLs with the enhanced traffic checker.

- PASS: `6`
- REVIEW/BLOCKED: `6`

## Passing Priority URLs

- VERIFIED LIVE: `/`
- VERIFIED LIVE: `/articles/`
- VERIFIED LIVE: `/family-law/`
- VERIFIED LIVE: `/lawyers/?area=family-law`
- VERIFIED LIVE: `/criminal-defense-attorney/`
- VERIFIED LIVE: `/traffic-lawyer/`

## Blocked Homepage-Redirect URLs

- BLOCKED LIVE: `/site-map/` returns initial `301` to `/`.
- BLOCKED LIVE: `/medical-malpractice-lawyer/` returns initial `301` to `/`.
- BLOCKED LIVE: `/real-estate-lawyer-guide/` returns initial `301` to `/`.
- BLOCKED LIVE: `/inheritance-lawyer/` returns initial `301` to `/`.
- BLOCKED LIVE: `/contact/` returns initial `301` to `/`.
- BLOCKED LIVE: `/about/` returns initial `301` to `/`.

## Why This Matters

- Google and users do not reach the intended route content.
- The previous checker could report final HTTP `200` because it followed the redirect and saw homepage HTML.
- The canonical, title, H1 and body content after redirect all describe the homepage, not the requested route.
- Money pages such as medical malpractice and inheritance are currently losing their clean route surface until the redirect layer is fixed.

## Tooling Change

- FIXED: `tools/check-live-traffic-priority.mjs` now performs an initial manual redirect check before following redirects.
- FIXED: checker output now records `initialHttp` and `redirectLocation`.
- FIXED: checker issues include `initial_redirect_301_to_/` and final-path mismatches.
- GENERATED: `reports/traffic-priority-audit-2026-05-21-route-home-redirects.csv`.

## Likely Cause

Current evidence points to a redirect layer before route render:

- The blocked URLs return empty-body `301` responses.
- The redirect target is the homepage.
- Several affected routes already have theme-level recovery/render code.
- Existing theme filters already attempt to block arbitrary non-root redirects to the homepage.

Most likely places to inspect after deployment:

1. uPress/nginx/site redirect rules.
2. WordPress Redirection plugin rules.
3. "All 404 Redirect to Homepage" style plugin behavior.
4. Permalink Manager or old slug redirect rules.
5. Cache/CDN-level redirect cache.

## Minimum Safe Next Action

1. Pull latest Git on uPress and clear cache.
2. Confirm homepage marker `2026-05-21-real-estate-guide-redirect-guard-v1`.
3. Rerun `node tools/check-live-traffic-priority.mjs`.
4. If the same six URLs still show `initial_redirect_301_to_/`, inspect and remove the stale redirect rule layer.
5. Do not publish/link/upload support content depending on these blocked routes until each route returns `200` on its own final path.

## Route-Specific Notes

### `/site-map/`

- Intended behavior: render dynamic HTML sitemap.
- Current behavior: `301` to `/`.
- Impact: crawl-discovery hub is not reachable at the intended URL.

### `/medical-malpractice-lawyer/`

- Intended behavior: render controlled medical-malpractice commercial hub.
- Current behavior: `301` to `/`.
- Impact: money route unavailable; do not send medical-malpractice support links here until fixed.

### `/real-estate-lawyer-guide/`

- Intended behavior: render controlled real-estate guide route.
- Current behavior: `301` to `/`.
- Impact: excluded from real-estate public edit package until route QA passes.

### `/inheritance-lawyer/`

- Intended behavior: render controlled inheritance/wills commercial hub.
- Current behavior: `301` to `/`.
- Impact: inheritance hub and support-link plans require route repair before publication.

### `/contact/`

- Intended behavior: contact/trust page.
- Current behavior: `301` to `/`.
- Impact: trust/lead path is degraded; menu/contact links may land on homepage.

### `/about/`

- Intended behavior: about/trust page.
- Current behavior: `301` to `/`.
- Impact: E-E-A-T trust page is unavailable at its expected URL.

## Safety

No public CMS page body, database row, title/H1/meta, public slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer profile, lead, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
