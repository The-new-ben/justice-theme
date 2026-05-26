# Route Deploy Verification Gate - 2026-05-24

Status: VERIFIED LOCAL / VERIFIED LIVE READ-ONLY / VERIFIED SCREENSHOTS / NO PUBLIC CMS CHANGE

## Summary
- VERIFIED LOCAL: source guards and checker coverage are in place for T416, T418 and T419.
- VERIFIED LOCAL: runtime and static deploy markers now use `2026-05-22-route-deploy-verification-gate-v1`.
- VERIFIED LIVE READ-ONLY: live traffic report `reports/route-deploy-live-traffic-priority-2026-05-24.csv` has `12/12` PASS rows.
- VERIFIED LIVE READ-ONLY: live trust report `reports/route-deploy-live-trust-routes-2026-05-24.csv` has `3/3` PASS rows.
- VERIFIED LIVE READ-ONLY: live controlled breadcrumb report `reports/route-deploy-live-controlled-breadcrumbs-2026-05-24.csv` has `4/4` PASS rows.
- VERIFIED SCREENSHOTS: `project-control/visual-evidence/route-deploy-2026-05-24` has `12/12` desktop/mobile PNG evidence files.
- SAFETY: no public CMS record, page body, lawyer profile, URL redirect rule, canonical/noindex, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4, wp-admin setting or uPress deployment was changed.

## Post-Deploy Commands
```powershell
$env:JUSTICE_WRITE_REPORT='1'
$env:JUSTICE_TRAFFIC_REPORT='reports/route-deploy-live-traffic-priority-2026-05-24.csv'
node tools/check-live-traffic-priority.mjs
$env:JUSTICE_TRUST_REPORT='reports/route-deploy-live-trust-routes-2026-05-24.csv'
node tools/check-live-trust-routes.mjs
$env:JUSTICE_BREADCRUMB_REPORT='reports/route-deploy-breadcrumb-schema-2026-05-24.csv'
$env:JUSTICE_WRITE_REPORT='1'
node tools/check-live-breadcrumb-schema.mjs
$env:JUSTICE_CONTROLLED_BREADCRUMB_REPORT='reports/route-deploy-live-controlled-breadcrumbs-2026-05-24.csv'
node tools/check-live-controlled-route-breadcrumbs.mjs
node tools/build-route-deploy-verification-gate.mjs --reportDate=2026-05-24
```

## Checks
| Check | Scope | Status | Evidence | Next step |
|---|---|---|---|---|
| ROUTE-DEPLOY-001 | runtime deploy marker | VERIFIED LOCAL | functions.php exposes runtime marker 2026-05-22-route-deploy-verification-gate-v1. | After uPress pull/cache clear, confirm the meta marker on a public HTML response. |
| ROUTE-DEPLOY-002 | static deploy marker | VERIFIED LOCAL | deployment-marker.txt records static marker 2026-05-22-route-deploy-verification-gate-v1. | After uPress pull/cache clear, fetch /wp-content/themes/justice-theme/deployment-marker.txt with a cache-busting query. |
| ROUTE-DEPLOY-003 | protected practice early render | VERIFIED LOCAL | inc/practice-landing.php has the early controlled practice route renderer and guard header. | Run the live traffic checker after deploy for /family-law/, /medical-malpractice-lawyer/, /real-estate-lawyer-guide/ and /inheritance-lawyer/. |
| ROUTE-DEPLOY-004 | HTML sitemap early render | VERIFIED LOCAL | inc/html-sitemap.php renders the HTML sitemap route at the earliest route priority. | Run the live traffic checker after deploy and require /site-map/ initial HTTP 200. |
| ROUTE-DEPLOY-005 | trust route early render | VERIFIED LOCAL | inc/trust-routes.php renders /about/, /contact/ and /editorial-policy/ early with a guard header. | Run the trust-route checker after deploy and require about/contact/editorial-policy PASS. |
| ROUTE-DEPLOY-006 | real estate guide redirect guard | VERIFIED LOCAL | inc/routing-guards.php blocks known WordPress-level conflict redirects for /real-estate-lawyer-guide/. | If live traffic still redirects before the marker appears, inspect uPress/server/CDN/plugin redirect rules. |
| ROUTE-DEPLOY-007 | traffic checker final-path coverage | VERIFIED LOCAL | tools/check-live-traffic-priority.mjs checks final path and includes the protected/trust route set. | Run with JUSTICE_WRITE_REPORT=1 after every deploy until all critical route rows PASS. |
| ROUTE-DEPLOY-008 | trust checker coverage | VERIFIED LOCAL | tools/check-live-trust-routes.mjs covers about/contact/editorial-policy route content, canonical, robots and H1 expectations. | Run the trust checker after deploy and capture failures before changing redirect rules. |
| ROUTE-DEPLOY-009 | breadcrumb checker coverage | VERIFIED LOCAL | Live breadcrumb tooling covers broad crawl seeds and a focused controlled-route set; source removes stale SEO-plugin BreadcrumbList nodes on controlled routes. | After deploy, run a focused breadcrumb report for controlled routes before promotion. |
| ROUTE-DEPLOY-010 | task board route tasks tracked | VERIFIED LOCAL | task-board.csv tracks T416, T418 and T419 as completed for the verified route gate. | Keep the route gate evidence with the completed task rows and monitor regressions. |
| ROUTE-DEPLOY-011 | live traffic read-only report | VERIFIED LIVE READ-ONLY | Live traffic report reports/route-deploy-live-traffic-priority-2026-05-24.csv has 12/12 PASS and 0 REVIEW rows. | After uPress pull/cache clear, rerun JUSTICE_WRITE_REPORT=1 with tools/check-live-traffic-priority.mjs and regenerate this gate. |
| ROUTE-DEPLOY-012 | live trust route read-only report | VERIFIED LIVE READ-ONLY | Live trust report reports/route-deploy-live-trust-routes-2026-05-24.csv has 3/3 PASS and 0 REVIEW rows. | After uPress pull/cache clear, rerun JUSTICE_WRITE_REPORT=1 with tools/check-live-trust-routes.mjs and regenerate this gate. |
| ROUTE-DEPLOY-013 | live controlled-route breadcrumb report | VERIFIED LIVE READ-ONLY | Live controlled breadcrumb report reports/route-deploy-live-controlled-breadcrumbs-2026-05-24.csv has 4/4 PASS and 0 REVIEW rows. | After uPress pull/cache clear, rerun JUSTICE_WRITE_REPORT=1 with tools/check-live-controlled-route-breadcrumbs.mjs and regenerate this gate. |
| ROUTE-DEPLOY-014 | visual screenshot verification | VERIFIED SCREENSHOTS | Screenshot directory project-control/visual-evidence/route-deploy-2026-05-24 has 12/12 verified PNG files; sample dimensions: family-law-desktop: 1440x1400 \| family-law-mobile: 390x1200 \| medical-malpractice-lawyer-desktop: 1440x1400 \| medical-malpractice-lawyer-mobile: 390x1200. | Keep the desktop/mobile evidence with the route gate and recapture after any header, breadcrumb or route template change. |

## Decision
- VERIFIED: T416, T418 and T419 route acceptance can be marked complete in repo control docs; keep monitoring for cache or redirect regressions.
- READY FOR MONITORING: rerun this gate after any header, breadcrumb, route template, redirect plugin or uPress cache change.
