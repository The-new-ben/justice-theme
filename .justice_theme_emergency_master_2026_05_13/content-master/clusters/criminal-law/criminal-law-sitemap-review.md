# Criminal Law Sitemap & Robots Review
**Reviewed**: 2026-05-15
**Status**: PARTIAL — sitemap works, robots.txt fix pending deploy

---

## Sitemap Architecture

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/wp-json/justice/v1/sitemap` | ✅ 200 | REST API sitemapindex — WORKING |
| `/wp-json/justice/v1/sitemap/articles` | ✅ | 1,221 article URLs |
| `/wp-json/justice/v1/sitemap/pages` | ✅ | 11 page URLs |
| `/wp-json/justice/v1/sitemap/lawyers` | ✅ | 2 lawyer URLs |
| `/wp-json/justice/v1/sitemap/taxonomies` | ✅ | 40 taxonomy URLs |
| `/sitemap_index.xml` | ❌ 301 | nginx redirect to homepage |
| `/sitemap.xml` | ❌ 301 | nginx redirect to homepage |
| `/wp-sitemap.xml` | ❌ 301 | nginx redirect to homepage |

**Root cause**: uPress nginx configuration 301-redirects ALL `.xml` files to homepage.
**Solution**: REST API sitemap (no `.xml` extension) — already implemented and working.

### Sitemap Headers
- `X-Robots-Tag`: NONE ✅ (was `noindex` — fixed by stripping WP REST API default header)
- `Content-Type`: `application/xml` ✅
- Format: `<sitemapindex>` with 4 `<sitemap>` entries ✅

---

## robots.txt

### Current (live):
```
Sitemap: https://jus-tice.co.il/sitemap_index.xml
```
❌ Points to broken 301 redirect

### Expected (after commit 767bd0a deploys):
```
Sitemap: https://jus-tice.co.il/wp-json/justice/v1/sitemap
```
✅ Points to working REST API sitemap

**Fix**: `robots_txt` filter priority bumped from 9999 to `PHP_INT_MAX` to run after Yoast's high-priority sitemap injection. Committed in `767bd0a`.

---

## Criminal Law URLs in Sitemap

| URL | In sitemap? |
|-----|------------|
| `/criminal-law/` | ✅ (taxonomy sub-sitemap) |
| `/lawyers/advocate-sharon-nahari/` | ✅ (lawyer sub-sitemap) |
| `/articles/criminal-indictment/` | ✅ (articles sub-sitemap) |
| All 143 criminal law articles | ✅ (articles sub-sitemap by publish date) |

---

## Google Search Console

### Current GSC sitemap submission
- **Submitted**: `/sitemap_index.xml` (Yoast default) — BROKEN (301 redirect)
- **Needed**: Remove old entry, submit `/wp-json/justice/v1/sitemap`
- **GSC status**: Likely showing "Couldn't fetch" or similar error

### Action Items
1. ~~Strip X-Robots-Tag noindex~~ ✅ Done
2. ~~Fix robots.txt reference~~ Committed, pending deploy
3. Submit REST sitemap to GSC after robots.txt deploys
4. Remove stale sitemap_index.xml from GSC
5. Use URL Inspection API to request indexing for Criminal Law pillar + support pages

---

## Yoast Sitemap State
- Yoast XML sitemap: **DISABLED** via `wpseo_sitemaps_enabled` → `__return_false`
- WordPress core sitemap: **DISABLED** (redirects to 301 anyway)
- Only active sitemap: REST API at `/wp-json/justice/v1/sitemap`
