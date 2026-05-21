# SEO Technical Optimization — Skills & Workflows

## Current SEO Stack (May 2026)
- **SEO Plugin**: Yoast SEO (replaced Rank Math)
- **Sitemap**: Custom REST API at `/wp-json/justice/v1/sitemap` (Yoast built-in sitemap disabled)
- **Hosting**: uPress (nginx 301-redirects all `.xml` files to homepage)

## Why Custom Sitemap?
uPress nginx configuration 301-redirects ALL `.xml` requests to the homepage before PHP can handle them. This makes:
- Yoast's `/sitemap_index.xml` → unreachable (redirected)
- WordPress core's `/wp-sitemap.xml` → unreachable (redirected)
- Our `/justice-sitemap.xml` → unreachable (redirected)
- Yoast's `?sitemap=1` query → also fails because "All 404 Redirect to Homepage" plugin catches it

**Solution**: REST API endpoint which bypasses nginx entirely:
- Index: `https://jus-tice.co.il/wp-json/justice/v1/sitemap`
- Articles: `https://jus-tice.co.il/wp-json/justice/v1/sitemap/articles`
- Pages: `https://jus-tice.co.il/wp-json/justice/v1/sitemap/pages`
- Lawyers: `https://jus-tice.co.il/wp-json/justice/v1/sitemap/lawyers`
- Taxonomies: `https://jus-tice.co.il/wp-json/justice/v1/sitemap/taxonomies`

## Sitemap Architecture
```
/wp-json/justice/v1/sitemap          ← <sitemapindex> (submit this to GSC)
  ├── /sitemap/articles              ← <urlset> articles CPT + homepage
  ├── /sitemap/pages                 ← <urlset> WP pages
  ├── /sitemap/lawyers               ← <urlset> justice_lawyer CPT
  └── /sitemap/taxonomies            ← <urlset> practice-areas terms
```

## Critical Rules
1. **NEVER add `X-Robots-Tag: noindex` to sitemap responses** — GSC rejects sitemaps with this header
2. **robots.txt must point to REST API sitemap**, not `.xml` URLs
3. **Yoast built-in sitemap is DISABLED** via `wpseo_sitemaps_enabled` filter
4. **WordPress core sitemap is DISABLED** via `wp_sitemaps_enabled` filter

## robots.txt
```
Sitemap: https://jus-tice.co.il/wp-json/justice/v1/sitemap
```
Managed by `justice_theme_robots_sitemap_directive()` in `inc/seo.php`.
It strips all stale `.xml` sitemap references automatically.

## Yoast SEO Configuration
Yoast handles:
- Title tags (`wpseo_title`)
- Meta descriptions (`wpseo_metadesc`)
- Canonical URLs (`wpseo_canonical`)
- Robots directives (`wpseo_robots`)
- Open Graph / Twitter meta

Yoast does NOT handle:
- Sitemap generation (disabled, handled by custom REST endpoints)
- XML sitemap delivery (blocked by nginx)

## File Locations
- `inc/seo.php` — All SEO filters (title, description, canonical, robots, robots.txt)
- `inc/sitemap.php` — Custom REST API sitemap endpoints
- `inc/lawyer-rest-guards.php` — Lawyer profile SEO guards (noindex blocked profiles)

## Migration Log
| Date | Change | Commit |
|------|--------|--------|
| 2026-05-14 | Migrated from Rank Math to Yoast SEO | c48ecc5 |
| 2026-05-14 | Removed 17 dead Rank Math filter hooks | c48ecc5 |
| 2026-05-14 | Rewrote sitemap to sitemapindex format | c48ecc5 |
| 2026-05-14 | Removed X-Robots-Tag: noindex from sitemap | c48ecc5 |
| 2026-05-14 | robots.txt now points to REST API sitemap | c48ecc5 |

## GSC Submission
Submit this URL in Google Search Console:
```
https://jus-tice.co.il/wp-json/justice/v1/sitemap
```
This is a proper `<sitemapindex>` that references 4 sub-sitemaps.

## Competitor Intelligence (Flanter-law.co.il)
Flanter has 100+ indexed pages organized as:
- **3 main silos**: Criminal Law, Military Law, Disciplinary Law
- **Per silo**: Procedures → Crime Types → Parties → Articles
- Each silo has 20-40 sub-topic pages
- Uses category/tag architecture for cross-linking
- 30 years experience prominently displayed (E-E-A-T signal)
