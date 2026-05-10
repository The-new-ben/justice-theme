# Sitemap Plan

Date: 2026-05-10
Status: PLAN ONLY - no sitemap changes executed

## Purpose

The URL migration must leave Google with one clean path for every important page:

old URL -> 301 redirect -> clean English URL -> canonical matches -> included in sitemap -> internally linked.

This plan defines what the dynamic sitemap should include after the content inventory, cannibalization map and owner-approved URL migration map are finalized.

## Current Public Check

VERIFIED:
- `https://jus-tice.co.il/robots.txt` returned HTTP 200 but no useful visible sitemap directive in the shell response.
- `https://jus-tice.co.il/sitemap.xml` returned HTTP 200, but the response appeared to be the homepage HTML, not an XML sitemap.
- `https://jus-tice.co.il/wp-sitemap.xml` returned HTTP 200, but the response also appeared to be homepage HTML, not an XML sitemap.

RISK:
- Search engines may not currently receive a reliable XML sitemap from the checked sitemap URLs.
- This must be verified again from browser/source view and wp-admin/SEO-plugin settings before migration.

## Target Sitemap Structure

The sitemap should include:

- Homepage.
- Approved pillar pages.
- Important supporting articles.
- Practice-area hub/category pages that are intentionally indexable.
- Lawyer profiles only when public-approved and not demo/seed profiles.
- LegalTech/tool pages only when public-ready and not thin/draft.

The sitemap should exclude:

- Search result pages.
- Filtered query URLs such as `?area=...` or `?city=...`, unless intentionally canonicalized as landing pages later.
- Draft/private/internal editorial note pages.
- Duplicate category/tag archives.
- Empty terms.
- Demo lawyers and unapproved lawyer profiles.
- Admin, login, feed, and system URLs.
- Redirect source URLs after migration.

## Priority Model

If the sitemap provider supports priority/change frequency:

| Page type | Priority | Notes |
|---|---:|---|
| Homepage | 1.0 | Main discovery hub |
| Major legal pillars | 0.9 | Examples: `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/` |
| Strong supporting articles | 0.7-0.8 | Only after merge/rewrite/source review |
| Practice-area hubs | 0.7 | Only canonical hub terms |
| Lawyer mini-sites | 0.6-0.8 | Higher only for approved paid/featured profiles and ethical review |
| Legacy news/case summaries | 0.3-0.5 | Keep only if useful and non-duplicative |
| Outdated Corona/legacy content | 0.1 or exclude later | Noindex/redirect/delete only after approval |

## URL Migration Requirements

Before any sitemap update:

1. `project-control/content-master-inventory.csv` must contain the current URL.
2. `project-control/url-migration-map.csv` must contain the approved new URL.
3. `project-control/redirect-map.csv` must contain the planned 301.
4. `project-control/internal-link-map.csv` must identify links needing updates.
5. Canonical output must be checked for old and new URLs.
6. Sitemap must include the new URL and exclude the old redirected URL.
7. The old URL must return 301 to the exact approved new URL.
8. The new URL must return 200 and self-canonical.

## Implementation Options

Preferred:
- Use a reliable SEO plugin sitemap if active and configurable.
- Ensure custom post type `articles`, approved pages, approved lawyer profiles and canonical taxonomies are included.

Fallback:
- Build a theme/plugin-generated XML sitemap route only after active plugin ownership is verified.

Do not:
- Hand-edit a static sitemap without a regeneration process.
- Include both old and new URLs after migration.
- Include query-string filters as indexable URLs before canonical strategy is final.

## Verification Checklist

For each migrated batch:

- LIVE VERIFIED: old URL returns 301.
- LIVE VERIFIED: new URL returns 200.
- LIVE VERIFIED: canonical tag equals new URL.
- LIVE VERIFIED: sitemap contains new URL.
- LIVE VERIFIED: sitemap does not contain old URL.
- LIVE VERIFIED: internal links point to new URL.
- LIVE VERIFIED: no unexpected 404s in sample crawl.
- NOT VERIFIED until GSC: migration traffic/ranking impact.

