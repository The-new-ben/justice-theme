# Controlled Route Breadcrumb Safety - 2026-05-22

Status: VERIFIED

Scope: repo-local static verification for controlled practice route breadcrumbs.

This check protects the controlled money routes from inheriting wrong breadcrumbs or BreadcrumbList schema from stale WordPress query objects, 404 state, or old CMS page ownership.

## Results

| Check | Status | Risk | Evidence |
| --- | --- | --- | --- |
| CTRL-BREADCRUMB-SLUG-HELPER | VERIFIED | HIGH | Dedicated controlled route slug helper exists. |
| CTRL-BREADCRUMB-ITEMS-HELPER | VERIFIED | HIGH | Dedicated controlled route breadcrumb item helper exists. |
| CTRL-BREADCRUMB-CONFIG-SOURCE | VERIFIED | CRITICAL | Breadcrumb current label comes from existing practice landing config. |
| CTRL-BREADCRUMB-BEFORE-ARTICLE | VERIFIED | HIGH | Controlled route fallback runs before article/singular fallbacks. |
| CTRL-BREADCRUMB-BEFORE-404 | VERIFIED | CRITICAL | Controlled route fallback runs before 404 fallback. |
| CTRL-BREADCRUMB-SCHEMA-WIRED | VERIFIED | HIGH | BreadcrumbList schema remains wired to rendered breadcrumb items. |
| CTRL-BREADCRUMB-YOAST-STALENESS-FILTER | VERIFIED | CRITICAL | Controlled practice routes remove stale SEO-plugin BreadcrumbList nodes. |
| CTRL-BREADCRUMB-FAMILY | VERIFIED | CRITICAL | /family-law/ maps to family-law in breadcrumbs and practice landing config. |
| CTRL-BREADCRUMB-MEDMAL | VERIFIED | CRITICAL | /medical-malpractice-lawyer/ maps to medical-malpractice in breadcrumbs and practice landing config. |
| CTRL-BREADCRUMB-REALESTATE | VERIFIED | HIGH | /real-estate-lawyer-guide/ maps to real-estate-law in breadcrumbs and practice landing config. |
| CTRL-BREADCRUMB-INHERITANCE | VERIFIED | HIGH | /inheritance-lawyer/ maps to inheritance in breadcrumbs and practice landing config. |

## Upload Notes

- VERIFIED: `/family-law/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, and `/inheritance-lawyer/` now resolve their breadcrumb current label from the same practice landing config used by the protected route.
- VERIFIED: the route breadcrumb fallback is checked before normal singular/page/archive/404 fallbacks.
- NOT VERIFIED LIVE: public rendering still needs uPress pull, cache clear, and live checker rerun.
- BLOCKED: no wp-admin, uPress, database, redirect plugin, Search Console, or CDN action was performed by this repo-local check.
