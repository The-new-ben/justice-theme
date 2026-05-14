# Criminal Law — Googlebot Journey Review
**Date:** 2026-05-14 (verified live after commit cda8a18)

## Crawl Path Analysis

### 1. Can Google discover Criminal Law from homepage?
- **From homepage:** YES — practice area card "משפט פלילי" links to `/practice-areas/criminal-law/`
- **From menu:** PARTIAL — no dedicated menu dropdown for practice areas
- **Assessment:** ✅ DISCOVERABLE

### 2. Can Google discover the Criminal Law practice-area page?
- **URL:** `/practice-areas/criminal-law/`
- **Status:** 200 OK
- **Content:** Hub page with H1, description, lawyer cards, article grid, CTA, related areas
- **Assessment:** ✅ WORKING

### 3. Can Google discover Criminal Law category?
- **URL:** `/category/criminal-law/`
- **Status:** REDIRECTS TO HOMEPAGE (301)
- **Risk:** HIGH — 18 articles assigned to this category cannot be discovered via category archive
- **Fix needed:** Either redirect to practice-area page, or ensure articles are tagged in practice-areas taxonomy
- **Assessment:** ❌ BROKEN

### 4. Can Google discover support pages from pillar?
- **From pillar:** YES — hub navigation has HTML `<a href>` links to all 17 spokes
- **From practice-area page:** PENDING — needs uPress pull for article grid fix
- **Assessment:** ⚠️ PARTIALLY WORKING

### 5. Are links crawlable HTML links?
- **Practice area cards:** YES — standard `<a href>` tags
- **Pillar hub links:** YES
- **Spoke back-links:** YES
- **Assessment:** ✅ COMPLETE

### 6. Are breadcrumbs visible?
- **On articles:** YES — `inc/breadcrumbs.php` renders visible breadcrumbs
- **On practice-area page:** NEEDS VERIFICATION after pull
- **Assessment:** ⚠️ PARTIAL

### 7. Does BreadcrumbList schema exist?
- **Status:** YES — `inc/schema.php` generates BreadcrumbList JSON-LD
- **Assessment:** ✅ COMPLETE

### 8. Does Article schema exist?
- **Status:** YES — auto-generated on all `articles` CPT posts
- **Assessment:** ✅ COMPLETE

### 9. Are canonical tags correct?
- **On articles:** YES — self-referencing canonical via `inc/seo.php`
- **HTTPS:** YES — URLs use HTTPS
- **Assessment:** ✅ COMPLETE

### 10. Is sitemap live and valid XML?
- **URL:** `https://jus-tice.co.il/wp-json/justice/v1/sitemap`
- **Status:** ✅ LIVE — 554 URLs, valid XML
- **Content-Type:** `application/xml; charset=UTF-8`
- **Includes:** 44 criminal-related URLs, 36 lawyer profiles, 15 practice-area pages
- **Old URL `/justice-sitemap.xml`:** ❌ Still blocked by nginx (301 → homepage)
- **Assessment:** ✅ WORKING (via REST API)

### 11. Does robots.txt reference sitemap?
- **Current:** Still shows old `sitemap_index.xml` (server cache)
- **Code fix:** Applied — will show `wp-json/justice/v1/sitemap` after cache expires
- **Assessment:** ⚠️ CACHED — will resolve automatically

### 12. Are Criminal Law URLs in sitemap?
- **Pillar (`/criminal-defense-attorney/`):** ✅ YES
- **Support articles:** ✅ YES (all 17+)
- **Lawyer profile:** ✅ YES
- **Practice-area page:** ✅ YES
- **Assessment:** ✅ COMPLETE

### 13. Is /category/criminal-law/ handled properly?
- **Status:** Returns 301 → homepage
- **Risk:** Googlebot may flag this as soft redirect
- **Fix:** Should either return 404 or redirect to `/practice-areas/criminal-law/`
- **Assessment:** ❌ NEEDS FIX

### 14. Do support pages link back to pillar?
- **Status:** YES — all 17 spokes have E-E-A-T footer linking to pillar
- **Assessment:** ✅ COMPLETE

### 15. No important page noindexed?
- **Pillar:** indexable ✅
- **Practice-area page:** indexable ✅
- **Support articles:** indexable ✅
- **Lawyer profile:** indexable ✅
- **Filtered directory pages:** noindex ✅ (correct)
- **Assessment:** ✅ CORRECT

---

## Critical Issues for Googlebot

| Issue | Severity | Status |
|-------|----------|--------|
| Sitemap works via REST API | ✅ FIXED | Live |
| robots.txt still shows old sitemap | ⚠️ MEDIUM | Server cache — will auto-fix |
| /category/criminal-law/ redirects to homepage | ❌ HIGH | Needs fix/redirect |
| Practice-area page articles empty | ⚠️ MEDIUM | Fix pushed, needs uPress pull |
| No main menu link to Criminal Law | ⚠️ MEDIUM | Manual menu update needed |
