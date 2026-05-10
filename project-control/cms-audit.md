# CMS Audit — jus-tice.co.il
## Date: 2026-05-09
## Method: Theme code inspection + live site visual audit + REST API inspection

---

## WHAT WE CAN VERIFY FROM THEME CODE

| Item | Status | Value | Problem | Fix |
|------|--------|-------|---------|-----|
| Theme name | VERIFIED | justice-theme | None | — |
| Theme version | VERIFIED | 1.0.0 | Matches plugin version | — |
| Custom logo support | VERIFIED | 260x80px, flex | Logo set in customizer needed | Upload brand logo in WP admin |
| Post thumbnails | VERIFIED | Enabled | No images visible | Add images to articles/lawyers |
| Image sizes | VERIFIED | justice-card, justice-card-wide, justice-hero | None | — |
| Menu locations | VERIFIED | primary, secondary, mobile, footer, legal_areas, footer_trust | Need to be populated in WP admin | Assign menus |
| Articles CPT | VERIFIED | archive-articles.php exists | May not be connected to admin menu | Check justice-core plugin |
| Lawyer CPT | VERIFIED | archive-justice_lawyer.php, single-justice_lawyer.php exist | No published lawyers yet | Seed test lawyers |
| Practice-areas taxonomy | VERIFIED | hero.php and taxonomy-practice-areas.php use it | 51 terms exist (confirmed from stats) | — |
| City taxonomy | LIKELY | archive-justice_lawyer.php probably uses it | Need to verify | Check justice-core plugin |
| front-page.php | VERIFIED | Used when homepage is set to "static page" | May not be set | Check WP Settings > Reading |

---

## WHAT WAS SEEN ON LIVE SITE

| Item | Observed | Status | Problem |
|------|----------|--------|---------|
| Logo | brand-lockup "J" with red dot, "Jus-Tice" text | WORKING | No custom logo image set — text logo is fallback |
| Menu | Only 2 items: עמוד הבית, אינדקס עורכי דין בישראל | BROKEN | Menu has only 2 items — needs full structure |
| Hero | Dark navy BG, "הפורטל המשפטי שמחבר בין מידע, עורכי דין ופתרונות" + stats 1,209 articles, 51 topics | WORKING but weak | No image layer |
| Stats | 1,209 / 51 / 20 showing correctly | VERIFIED | — |
| Practice areas panel | Shows taxonomy terms with article counts | VERIFIED | Only visible inside dark hero panel — hard to read |
| Practice areas grid | Shows in homepage below hero | VERIFIED | Icons are generic empty boxes |
| Lawyer section | Shows "מדריך עורכי הדין בבנייה" placeholder | PROBLEM | No published lawyers = fallback showing |
| Articles section | Shows "מאמרים אחרונים" section | LIKELY WORKING | Need to verify cards appear |
| Articles archive | Shows "Articles" in English on hero | BUG | Archive title is English |
| Footer | Shows brand-lockup, contact links, nav | WORKING | Red top border present |
| Mobile header | Shows J mark + Jus-Tice text + red dot | VERIFIED | Menu only opens 2 items |

---

## CRITICAL PROBLEMS IDENTIFIED

### Problem 1: MENU HAS ONLY 2 ITEMS
- Current menu: עמוד הבית, אינדקס עורכי דין בישראל
- Required: 8+ items with practice area dropdown
- Fix: Need to either (a) add menu items via WP admin OR (b) use wp_nav_menu fallback

### Problem 2: NO PUBLISHED LAWYERS
- featured-lawyers.php checks `wp_count_posts('justice_lawyer')->publish > 0`
- Since count is 0, shows placeholder "מדריך עורכי הדין בבנייה"
- Fix: Need to seed demo lawyers OR change to show demo cards without database

### Problem 3: ARTICLES ARCHIVE TITLE SHOWS "Articles" IN ENGLISH
- The archive page title is "Articles" not Hebrew
- Fix: CPT registered with English labels — needs Hebrew labels or archive-articles.php fix

### Problem 4: NO LAWYER IMAGES / HERO IMAGE
- logo.png is a DUMMY-LOGO placeholder (confirmed by inspection)
- No lawyer photos in media library (new site)
- Fix: Generate SVG hero pattern + use premium initials for lawyers

### Problem 5: FEATURED LAWYERS REQUIRE `featured_until` META
- Query: `meta_key => 'featured_until', meta_compare => '>='`
- Even if lawyers exist, they won't show unless `featured_until` is set
- Fix: Change query to show any published lawyers as fallback

---

## ADMIN WORKFLOW STATUS

| Workflow | Status | Notes |
|----------|--------|-------|
| Add lawyer | NEEDS TESTING | justice_lawyer CPT via plugin |
| Add article | NEEDS TESTING | articles CPT via plugin |
| Set logo | NOT DONE | Upload PNG/SVG to customizer |
| Set homepage | LIKELY DONE | front-page.php loading suggests it is set |
| Create menus | NOT DONE | Primary menu only has 2 items |
| Add categories | DONE | 51 practice-areas terms exist |
| Add cities | LIKELY DONE | 20 cities visible in hero stats |

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **Menu status UPGRADED:** Live site now shows 7 menu items (צור קשר, אודות, עורכי דין, תחומי משפט [dropdown], מאמרים, שאלות, הצטרפות). Original "2 items only" problem is **RESOLVED**.
* **Lawyers exist but FICTIONAL:** 10 seed lawyers now published (Maya, David, Moshe, Sarah, Tamar, Eitan, Yossi, Liat, Noa, Avi). All use fake phone numbers (972545551234-style). **CREDIBILITY RISK — must unpublish or mark as demo before marketing.**
* **"Archive" OG leak PERSISTS:** `/lawyers/` page `og:description` still says "עורכי דין Archive" — English word leaking into Hebrew meta.
* **7 legacy CPTs still registered:** labor_law, small_claims, corona_virus, supreme_court, tort, goverment-gazette, yada_wiki — all visible via REST API `/wp-json/wp/v2/types`. Must be deregistered.
* **Duplicate taxonomy:** "דיני נזיקין" appears TWICE on /articles/ with different article counts and URLs — SEO cannibalization risk.
