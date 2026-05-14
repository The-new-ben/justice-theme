# Criminal Law — Googlebot Journey Review
**Date:** 2026-05-14

## Crawl Path Analysis

### 1. Can Google discover the Criminal Law pillar?
- **From homepage:** NEEDS_VERIFICATION — depends on Practice Areas section having crawlable link
- **From internal links:** YES — 17 spoke articles link back to pillar
- **From sitemap:** PENDING — sitemap at `/justice-sitemap.xml` needs server activation
- **Assessment:** PARTIAL

### 2. Can Google discover the Criminal Law category?
- **URL:** `/category/criminal-law/`
- **From homepage:** NEEDS_VERIFICATION
- **From menu:** NEEDS_VERIFICATION
- **Assessment:** NEEDS_VERIFICATION

### 3. Can Google discover support pages?
- **From pillar:** YES — hub navigation has HTML links to all 17 spokes
- **From category:** YES — category archive lists all 18 articles
- **From sitemap:** PENDING
- **Assessment:** PARTIAL (sitemap not yet active)

### 4. Are links crawlable HTML links?
- **Pillar hub links:** YES — standard `<a href>` tags
- **Spoke back-links:** YES — standard anchor links
- **Assessment:** COMPLETE

### 5. Are important links hidden behind JS?
- **Practice area cards:** Need to check if `practice-area-card.php` uses JS navigation
- **Menu:** Standard WP nav — likely crawlable
- **Assessment:** NEEDS_VERIFICATION

### 6. Are breadcrumbs visible?
- **Status:** YES — `inc/breadcrumbs.php` renders visible breadcrumbs
- **Assessment:** COMPLETE

### 7. Does BreadcrumbList schema match?
- **Status:** YES — `inc/schema.php` generates BreadcrumbList JSON-LD
- **Path:** Home > [category/area] > [article title]
- **Assessment:** COMPLETE

### 8. Does Article schema exist?
- **Status:** YES — auto-generated on all `articles` CPT posts
- **Assessment:** COMPLETE

### 9. Are canonical tags correct?
- **Status:** YES — `inc/seo.php` sets self-referencing canonical
- **Risk:** Check HTTP vs HTTPS canonical
- **Assessment:** PARTIAL (HTTPS verification needed)

### 10. Are sitemap URLs valid XML?
- **Status:** CRITICAL — `/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml` all return homepage HTML
- **Fix:** `inc/sitemap.php` generates valid XML at `/justice-sitemap.xml` — needs permalink flush
- **Assessment:** NOT_WORKING (needs server activation)

### 11. Is Criminal Law in sitemap?
- **In generated XML:** YES — all 19 URLs (homepage + 18 articles)
- **On live server:** PENDING — needs uPress sync
- **Assessment:** PENDING

### 12. Are old 404/redirect/homepage-return problems present?
- **Known issue:** All non-existent paths return homepage HTML with 200 status
- **Risk:** Soft 404s may confuse Googlebot
- **Assessment:** NEEDS_INVESTIGATION

### 13. Do support pages link back to pillar?
- **Status:** YES — all 17 spokes have E-E-A-T footer linking to pillar
- **Assessment:** COMPLETE

### 14. Are unrelated pages mixed into Criminal Law?
- **Category `criminal-law`:** Only 18 assigned articles — clean
- **Risk:** Legacy articles may target same keywords without being in category
- **Assessment:** PARTIAL (legacy articles need audit)

---

## Critical Issues for Googlebot

| Issue | Severity | Action |
|-------|----------|--------|
| Sitemap returns HTML not XML | CRITICAL | Sync uPress + flush permalinks |
| 0 articles indexed | CRITICAL | Submit sitemap to GSC |
| Soft 404 behavior | HIGH | Investigate server 404 handling |
| HTTPS canonical not verified | MEDIUM | Check HTTP→HTTPS redirect |
| Legacy articles may cannibalize | MEDIUM | Audit non-cluster articles targeting criminal keywords |
