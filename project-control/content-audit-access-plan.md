# Content Audit Access Plan

Date: 2026-05-10
Status: ACTIVE - stop article production until full inventory/export begins

## Purpose

This document records exactly what access exists for the Jus-Tice content audit, URL migration and SEO restructure project. It separates what can be done now from what requires credentials or owner action.

## Access Matrix

| Access method | Status | What it can be used for | Risk level | Recommended use |
|---|---|---|---|---|
| Repo at `C:\Users\janana\jutice-theme` | AVAILABLE | Project-control docs, scripts, draft content, theme/plugin code, CSV processing, export tooling | LOW | Use immediately for planning, scripts, inventory processing and versioned audit files |
| Public WordPress REST API | AVAILABLE | Published posts/pages/articles/lawyers, public taxonomies, public media, slugs, URLs, titles, dates, rendered content where public | LOW | Use as Phase 2 first export source; treat as public-only snapshot |
| WordPress admin | NEEDS PASSWORD / BLOCKED | Menus, widgets, private/draft content, SEO plugin fields, custom fields, WP All Export install, permalink checks | MEDIUM | Use after authenticated browser/admin access is confirmed |
| WordPress Application Password | NEEDS PASSWORD | Authenticated REST export of private/draft statuses, menu items, custom fields, meta, edits/imports after approval | MEDIUM | Preferred credentialed API path if owner creates an application password |
| Custom Justice REST routes | NOT AVAILABLE PUBLICLY | Health/site-state/plugin reports if active and exposed | LOW-MEDIUM | Current public probes returned 404; verify active plugin/admin route later |
| uPress dashboard/file manager | NEEDS PASSWORD / BLOCKED | Pull GitHub sync, cache purge, file manager, server tools | MEDIUM-HIGH | Use only for deployment/cache actions after login; not for content decisions |
| Database/phpMyAdmin | NOT AVAILABLE | Full read-only export of posts/postmeta/terms/options/menus/redirects | HIGH | Use read-only only after backup and explicit approval; no UPDATE/DELETE |
| Google Search Console browser UI | AVAILABLE / VERIFIED | Query/page traffic, cannibalization, CTR, URL migration traffic risk, decline/growth reports through manual browser review | LOW for read-only | Use now for query-to-page and page-to-query mapping; do not treat manual samples as a full export |
| Google Search Console API/export | NOT AVAILABLE | Full automated query/page/date/device/country exports | LOW for read-only | Add later through OAuth/service account or working browser export; required before final high-risk migration batches |
| WP All Export or similar | BLOCKED UNTIL ADMIN | Full CSV/Excel export including postmeta/taxonomies/custom fields | MEDIUM | Good secondary export if admin access exists; do not install without approval |
| Local scripts | AVAILABLE | REST export, CSV normalization, duplicate detection, slug suggestions, content quality scoring, link graph | LOW | Use immediately after this plan; all outputs go under `project-control/` |

## Public REST Probe Results

Safe read-only probes were run from the local repo session.

| Endpoint | Result | Notes |
|---|---:|---|
| `/wp-json/wp/v2/types` | 200 | Public post-type registry visible |
| `/wp-json/wp/v2/taxonomies` | 200 | Public taxonomy registry visible |
| `/wp-json/wp/v2/posts?per_page=1` | 200 / total 0 | Standard posts are empty publicly |
| `/wp-json/wp/v2/pages?per_page=1` | 200 / total 11 | Public pages available |
| `/wp-json/wp/v2/articles?per_page=1` | 200 / total 1199 | Main content library is public through `articles` CPT |
| `/wp-json/wp/v2/justice_lawyer?per_page=1` | 200 / total 10 | Lawyer CPT visible publicly |
| `/wp-json/wp/v2/categories?per_page=1` | 200 / total 21 | Categories visible |
| `/wp-json/wp/v2/tags?per_page=1` | 200 / total 12 | Tags visible |
| `/wp-json/wp/v2/practice-areas?per_page=1` | 200 / total 57 | Practice-area taxonomy visible |
| `/wp-json/wp/v2/city?per_page=1` | 200 / total 20 | City taxonomy visible |
| `/wp-json/wp/v2/media?per_page=1` | 200 / total 906 | Public media visible |
| `/wp-json/wp/v2/menu-items?per_page=1` | 401 | Menu items require authentication |
| Custom `jus-tice-engine` / `justice-core` health routes | 404 | Not publicly available or not active under expected namespace |
| Legacy CPT REST bases (`labor_law`, `small_claims`, `corona_virus`, `supreme_court`, `tort`, `goverment-gazette`, `yada_wiki`) | 404 | Registered in type list but not publicly queryable at tested REST bases |

## Access Attempt Update - 2026-05-10

VERIFIED:
- Public REST export is available and was used successfully.
- Google Search Console browser UI access was completed for the `https://jus-tice.co.il/` property after owner-approved sign-in/2FA.
- First GSC browser pass checked last-3-month query/page data for criminal-law and family-law keywords.

BLOCKED:
- Google Search Console API credentials and full CSV/download export are not available in this repo session.
- Database/phpMyAdmin is not available from this session without uPress/database login.
- WordPress menu-item REST export returned 401 and requires authenticated REST/wp-admin access.

DECISION:
- Use browser GSC evidence immediately for manual cannibalization mapping.
- Keep traffic-risk fields from the REST-only export as `UNKNOWN` until each URL/query is manually reviewed or API/export data exists.
- Treat database access as optional read-only fallback, not a requirement for the first audit pass.

## Registered Public Types Observed

Core/publicly relevant:
- `articles` with archive, taxonomies: `category`, `post_tag`, `practice-areas`
- `justice_lawyer` with archive, taxonomy: `city`
- `page`
- `post` currently public total 0
- `attachment`

Legacy/third-party types still registered:
- `labor_law`
- `small_claims`
- `corona_virus`
- `supreme_court`
- `tort`
- `goverment-gazette`
- `yada_wiki`
- `rm_content_editor`

RISK: registered legacy types create admin/API architecture confusion even when public REST queries are unavailable. They must be audited before any cleanup.

## Immediate Export Method

Use public REST first because it is available now and low-risk.

Scope available now:
- published `articles`
- published `pages`
- public `justice_lawyer` profiles
- public categories/tags/practice areas/cities
- public media metadata
- public internal links from rendered content
- current URLs/slugs/titles/dates/excerpts

Scope not available until authenticated:
- drafts/private/pending content
- full postmeta if not exposed publicly
- SEO plugin fields if not exposed publicly
- menu item details
- widgets/options
- redirect rules
- plugin settings
- full automated GSC export/API data
- database-only legacy data

## Recommended Access Upgrade

1. Create a WordPress Application Password for an admin user dedicated to audit export.
2. Confirm the authenticated REST can read `context=edit` for `articles`, `pages`, taxonomies, media, menus and meta.
3. Confirm GSC access for `https://jus-tice.co.il/` or domain property.
4. If REST/meta remains incomplete, install/use WP All Export from wp-admin after approval.
5. Use database/phpMyAdmin only as read-only fallback after backup.

## Hard Rules

- No publishing during audit.
- No redirects during audit.
- No URL changes during audit.
- No deletes during audit.
- No replacing old content until the inventory and cannibalization map identify the best URL.
- Traffic risk stays `UNKNOWN` in the bulk REST inventory until the specific URL/query is reviewed in GSC browser data or a full GSC export/API dataset exists.

## Sources

- WordPress REST API post schema and list endpoint: https://developer.wordpress.org/rest-api/reference/posts/
- WP All Export plugin overview: https://wordpress.org/plugins/wp-all-export/
- Search Console Search Analytics API: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- Google canonical/duplicate URL guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Kol Zchut public information model: https://www.kolzchut.org.il/
