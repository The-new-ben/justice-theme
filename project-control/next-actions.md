# Next Actions — Jus-Tice.co.il
**Date:** 2026-05-09  
**Process:** Read this file at the start of every work session. Pick the top unblocked task. Update status when done.

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
**Status:** Needs WP-CLI + meta field setup  
**Rules:** All profiles DRAFT/PRIVATE. Not "verified". Source documented. No false endorsement.  
**See:** `lawyer-seed.csv` template (to be created)

### ACTION-008: Publish 5 Pillar Articles
**Status:** Content task  
**Required for:** SEO foundation, homepage not showing empty state  
**Titles (minimum viable):**
1. "עורך דין גירושין — מדריך מלא לבחירה, עלויות, הליך"
2. "עורך דין פלילי — מה לדעת לפני שבוחרים"
3. "עורך דין תעבורה — ביטול דוחות, עבירות ותאונות"
4. "עורך דין מקרקעין — כל מה שצריך לדעת לפני עסקה"
5. "עורך דין דיני עבודה — מדריך לעובד ולמעסיק"

---

## MEDIUM PRIORITY

### ACTION-009: Install Yoast SEO / RankMath
- Generates XML sitemap automatically
- Adds canonical tags to all pages
- Adds `og:image` for social sharing
- Do NOT install both

### ACTION-010: Configure Customizer Contact Info
- Set `justice_phone` — appears in header CTA and footer
- Set `justice_email` — appears in footer
- Set `justice_whatsapp` — appears in float button and lawyer profiles

### ACTION-011: Connect Google Search Console
- Verify domain ownership
- Submit sitemap: `https://jus-tice.co.il/sitemap_index.xml`
- Set preferred country: Israel

### ACTION-012: Fix i18n in archive-justice_lawyer.php
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
- ACTION-014: Build lawyer dashboard — PARTIAL: pending registration admin queue built; full lawyer dashboard still planned
- ACTION-015: Integrate WooCommerce for plan subscriptions
- ACTION-016: Build lead intake AI classification
- ACTION-017: Build GSC weekly report automation
- ACTION-018: Build city taxonomy + city × practice area pages

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
