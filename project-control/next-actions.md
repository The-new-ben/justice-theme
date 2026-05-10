# Next Actions — Jus-Tice.co.il
**Date:** 2026-05-10
**Process:** Read this file at the start of every work session. Pick the top unblocked task. Update status when done.

---

## ACTIVE SEO ARCHITECTURE SEQUENCE - 2026-05-10

### ACTION-SEO-001: Open GSC Indexing Drilldowns
**Status:** COMPLETED - first sample pass
**Why:** GSC shows 1.58K not indexed pages, including 785 crawled-currently-not-indexed and 38 duplicate canonical issues. We need example URLs before content/URL decisions.
**Actions:**
1. DONE: Opened GSC Page indexing examples for "Crawled - currently not indexed".
2. DONE: Opened examples for "Duplicate without user-selected canonical".
3. DONE: Opened examples for "Page with redirect".
4. DONE: Opened examples for "Alternate page with proper canonical tag" and "Not found (404)".
5. DONE: Recorded examples in `project-control/gsc-indexing-review.csv`.
6. DONE: classified sampled examples into media URL, legacy CPT, taxonomy/archive, redirect source, weak content, content candidate and technical issue in `project-control/gsc-indexing-example-classification.csv`.
7. NEXT: create a no-URL-change remediation batch from the classified examples: media policy, legacy CPT comparison, and `/divorce-mediation-basics` merge review.

### ACTION-SEO-002: Verify Sitemap And HTTPS Migration Blockers
**Status:** NEXT
**Why:** Public sitemap URLs appear to return homepage-like HTML, and GSC reports 412 Non-HTTPS URLs. This can break a future URL migration.
**Actions:**
1. Verify active sitemap generator in wp-admin/server.
2. Confirm sitemap URL returns valid XML.
3. Inspect GSC Non-HTTPS examples.
4. Update `project-control/sitemap-strategy.md` and `project-control/robots-htaccess-review.md`.

### ACTION-SEO-003: No-URL-Change Homepage + Directory SEO Batch
**Status:** QUEUED
**Why:** GSC shows broad `עורך דין` / `עורכי דין` intent is scattered. This can be improved before URL migration.
**Actions:**
1. Export/verify current homepage and `/lawyers/` title/H1/meta.
2. Prepare title/H1/meta update recommendations.
3. Add/plan internal links from homepage to approved pillar URLs.
4. Add/plan internal links from key articles to `/lawyers/`.
5. Do not change slugs or redirects in this batch.

---

## CRITICAL — DO FIRST (BLOCKED UNTIL DONE)

### ACTION-001: Establish Live Site Access
**Status:** BLOCKED — no SSH/WP-CLI access in current session  
**Why:** Almost everything else requires ability to run WP-CLI commands or wp-admin access  
**Actions:**
1. Confirm SSH access to server
2. Confirm WP-CLI is installed: `wp --version`
3. Confirm wp-admin credentials work
4. Run: `wp option get template` — confirm active theme
5. Run: `wp plugin list` — confirm no duplicate plugins
6. Run: `wp post list --post_type=post --post_status=publish --format=count` — count spam

### ACTION-002: Stop Spam on Homepage
**Status:** COMPLETED
**Why:** Casino/gaming content destroys credibility and risks Google penalty
**Actions:**
1. Changed `latest-articles.php` query from `array('articles','post')` to `array('articles')` — SAFE, no data loss. Spam posts no longer render on the homepage.
2. Owner still needs to run WP-CLI spam audit to delete the actual spam posts from the database (see spam-investigation.md).

### ACTION-003: Verify/Fix Justice Core Plugin
**Status:** COMPLETED (Pending User Upload)
**Why:** Theme depends on plugin for CPTs/taxonomies. Without working plugin = 404 everywhere
**Actions:**
1. A clean, conflict-free plugin (`jus-tice-engine.zip`) has been generated in the root directory.
2. The user must upload and activate `jus-tice-engine.zip` via wp-admin to register CPTs (`justice_lawyer`, `articles`, `justice_lead`) and the REST API.

---

## HIGH PRIORITY (After CRITICAL is resolved)

### ACTION-004: Fix Hero Search Form
**Status:** COMPLETED in code - live verification pending
**File:** `template-parts/sections/hero.php`  
**Issue:** Form action points to `home_url('/')`, GET params `practice_area` and `city` don't filter lawyers  
**Fix:** Change form action to `get_post_type_archive_link('justice_lawyer')` and change param names to `area` and `city` (matching the archive template filter)

```php
// BEFORE:
<form action="<?php echo esc_url( home_url( '/' ) ); ?>">
<select name="practice_area">

// AFTER:
<form action="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ); ?>">
<select name="area">
```

### ACTION-005: Upload Professional Logo
**Repo status:** PARTIAL - bundled fallback logo is now wired in header/footer; live Customizer upload is still optional.
**Status:** Design task — needs SVG or PNG  
**File:** WP Customizer → Site Identity → Logo  
**Spec:** Max height 44px, white text/graphic (shows on dark navy header)

### ACTION-006: Create 10 Practice Area Taxonomy Terms
**Status:** COMPLETED in code - live seeding pending admin visit
**Implementation:** `inc/taxonomy-seed.php` creates/updates the 10 core terms on `/wp-admin/` load when `practice-areas` taxonomy exists.
**Command:**
```bash
wp term create practice-areas "דיני משפחה" --slug=family-law --description="ייעוץ וייצוג בתחום הגירושין, הילדים, הירושות ודיני המשפחה"
wp term create practice-areas "משפט פלילי" --slug=criminal-law --description="הגנה פלילית, ייצוג בחקירות ובבתי משפט"
wp term create practice-areas "דיני תעבורה" --slug=traffic-law --description="ביטול דוחות, עבירות נהיגה, תאונות דרכים"
wp term create practice-areas "מקרקעין ונדלן" --slug=real-estate-law --description="עסקאות נדל\"ן, רישום טאבו, ליקויי בנייה"
wp term create practice-areas "דיני עבודה" --slug=labor-law --description="זכויות עובדים, פיטורים, הסכמי עבודה"
wp term create practice-areas "ירושה וצוואות" --slug=inheritance --description="צוואות, ירושות, ניהול עיזבון"
wp term create practice-areas "נזיקין" --slug=torts --description="תאונות, נזקי גוף, פיצויים"
wp term create practice-areas "רשלנות רפואית" --slug=medical-malpractice --description="שגיאות רפואיות, פגיעות בלידה, תביעות כנגד קופות חולים"
wp term create practice-areas "ביטוח לאומי" --slug=national-insurance --description="קצבאות, ועדות רפואיות, ערעורים"
wp term create practice-areas "הגירה ואזרחות" --slug=immigration --description="אשרות, אזרחות, איחוד משפחות"
```

### ACTION-007: Create Seed Lawyer Profiles (10 draft profiles)
**Status:** COMPLETED in code - live seeding / cleanup pending admin verification
**Implementation:** Existing seeders in `justice-core/`, `ultra-justice-engine/`, and `ultra-justice/` create 10 draft `justice_lawyer` profiles. Safety was hardened so generated profiles remain unverified, inactive, not featured, not lead-routed, and marked as seed/testing data.
**Rules:** All profiles DRAFT/PRIVATE. Not "verified". Source documented. No false endorsement.  
**See:** `project-control/lawyer-seed.csv` template/data file.
**Still needed live:** verify active plugin path, visit `/wp-admin/` after Upress pull if seeding is desired, then draft/unpublish any existing public demo lawyers. Maya Rotenberg remains the only client intended for homepage featuring.

### ACTION-008: Publish 5 Pillar Articles
**Status:** PARTIAL in code - 5 draft article starters seed after admin visit; publishing still pending legal/editorial review
**Required for:** SEO foundation, homepage not showing empty state  
**Titles (minimum viable):**
1. "עורך דין גירושין — מדריך מלא לבחירה, עלויות, הליך"
2. "עורך דין פלילי — מה לדעת לפני שבוחרים"
3. "עורך דין תעבורה — ביטול דוחות, עבירות ותאונות"
4. "עורך דין מקרקעין — כל מה שצריך לדעת לפני עסקה"
5. "עורך דין דיני עבודה — מדריך לעובד ולמעסיק"

---

**Implementation:** `inc/pillar-article-seed.php` seeds draft-only `articles` records with English slugs, Hebrew starter text, practice-area assignment, pillar URL metadata, and `needs_legal_review = 1`.
**Still needed:** expand each draft to publication quality, add real sources, assign author/reviewer, verify no cannibalization with page pillars, then publish manually after review.

## MEDIUM PRIORITY

### ACTION-009: Install Yoast SEO / RankMath
**Status:** BLOCKED in repo-only mode - requires wp-admin plugin install decision and live activation
- Generates XML sitemap automatically
- Adds canonical tags to all pages
- Adds `og:image` for social sharing
- Do NOT install both

### ACTION-010: Configure Customizer Contact Info
**Status:** BLOCKED in repo-only mode - requires live Customizer/admin access
- Set `justice_phone` — appears in header CTA and footer
- Set `justice_email` — appears in footer
- Set `justice_whatsapp` — appears in float button and lawyer profiles

### ACTION-011: Connect Google Search Console
**Status:** BLOCKED - requires verified Google account/property access
- Verify domain ownership
- Submit sitemap: `https://jus-tice.co.il/sitemap_index.xml`
- Set preferred country: Israel

### ACTION-012: Fix i18n in archive-justice_lawyer.php
**Status:** COMPLETED in code
**File:** `archive-justice_lawyer.php`  
**Issue:** Filter labels use raw Hebrew strings not wrapped in `esc_html_e()`  
**Lines to fix:**
```php
// Line ~108:
<label for="filter-area">תחום משפטי</label>
// Should be:
<label for="filter-area"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></label>
```

---

## LOW PRIORITY (Phase 2)

- ACTION-013: Build lawyer self-registration page — COMPLETED in theme; live verification pending
- ACTION-014: Build lawyer dashboard — PARTIAL: front-end dashboard MVP added; live verification and self-edit/payment modules still planned
- ACTION-015: Integrate WooCommerce for plan subscriptions — PARTIAL: plan page and product-ID mapping hooks added; live WooCommerce install/product setup still blocked
- ACTION-016: Build lead intake AI classification — PARTIAL: rule-based lead classifier added; external AI and lawyer matching still planned
- ACTION-017: Build GSC weekly report automation — PARTIAL: GitHub Action and report generator added; secrets/Search Console access still required
- ACTION-018: Build city taxonomy + city × practice area pages — PARTIAL: city seeder, draft page seeder and template added; live verification and content approval still needed

---

## WORKFLOW RULES

1. Read this file first every session
2. Pick the HIGHEST priority unblocked task
3. Update status in `task-board.csv`
4. Make the smallest useful change
5. Test it
6. Commit with clear message
7. Update `changelog.md`
8. Update status here
9. Pick next task

---

## 2026-05-09 CORRECTIONS FROM OWNER FEEDBACK

### LOGO
**Status:** FIXED IN REPO / LIVE NOT VERIFIED
- The visible fallback must not use `assets/images/logo.png` because that file is a dummy placeholder.
- Header and footer now render a Jus-Tice code wordmark with a blinking red dot when no WordPress custom logo is configured.
- If the old final logo exists in the media library, use it later through WordPress Site Identity; until then the code wordmark is the safer fallback.

### CONTENT DEPTH
**Status:** ACTIVE PRIORITY
- The current seeded article starters are scaffolds only.
- Production target is 5,000-word-class pillar/supporting articles, not short SEO pages.
- Each major article must be built from SERP reverse engineering: intent, competing page types, related questions, price/process/risk sections, internal links, related lawyer mini-site blocks, sources, author/reviewer, and legal disclaimer.
- First full production candidate: `/divorce-lawyer/` and the connected Maya Rotenberg mini-site/content cluster.
- Repo drafts can now be imported into the CMS from `Tools > Jus-Tice Content Drafts`. Imports are draft-only and require legal/editorial review before publication.

---

## 2026-05-10 INTEGRATED SEO / DESIGN / CONTENT WORKFLOW

**Status:** ACTIVE PRIORITY - planning added, no live execution yet

Next safe batch before any URL/content migration:
1. Review homepage SEO/design alignment against `project-control/homepage-seo-design-alignment.md`.
2. Review one article template and one lawyer profile for semantic related-content behavior.
3. Confirm mobile-first template risks in `project-control/mobile-first-template-review.md`.
4. Confirm accessibility risks in `project-control/accessibility-review.md`.
5. Use `project-control/related-content-map.csv` to drive the first semantic related-content implementation plan.
6. Use `project-control/integrated-launch-checklist.md` before approving any batch that touches content, design, URLs, sitemap or redirects.

**Do not execute yet:** URL changes, redirects, content deletions, public rewrites, payments, index/noindex changes.
