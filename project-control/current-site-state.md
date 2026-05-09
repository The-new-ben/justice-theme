# Current Site State — Jus-Tice.co.il
**Date:** 2026-05-09  
**Based on:** Theme codebase inspection (branch: claude/justice-website-review-aovSK)  
**Live site verification:** NOT VERIFIED — requires WP-CLI or wp-admin access

---

## THEME

| Property | Value | Verified |
|----------|-------|----------|
| Theme Name | Justice Theme | ✅ code |
| Theme Version | 1.0.0 | ✅ code |
| Template/Stylesheet | justice-theme | ✅ code |
| Parent theme | None (standalone, not child) | ✅ code |
| Text Domain | justice-theme | ✅ code |
| WP Minimum | 6.4 | ✅ code |
| PHP Minimum | 8.0 | ✅ code |
| RTL support | Yes — rtl.css + is_rtl() check | ✅ code |
| Font | Heebo (Google Fonts) | ✅ code |
| Color palette | Navy (#07152f) + Gold (#c9a24a) + Cream (#f8f3e8) | ✅ code |

### Registered Menus
| Location | Label |
|----------|-------|
| primary | תפריט ראשי |
| secondary | תפריט משני |
| mobile | תפריט נייד |
| footer | תפריט תחתון |
| legal_areas | תפריט תחומי משפט |
| footer_trust | תפריט מידע שימושי |

### Registered Image Sizes
| Name | Dimensions |
|------|-----------|
| justice-card | 520×340 cropped |
| justice-card-wide | 760×420 cropped |
| justice-hero | 1440×720 cropped |

---

## PLUGIN DEPENDENCIES

The theme does NOT register CPTs or taxonomies itself. It depends on a Justice Core plugin to register:

| Registration | Expected By Theme | Registered By |
|-------------|-------------------|---------------|
| `articles` CPT | Required | Justice Core plugin (NOT VERIFIED live) |
| `justice_lawyer` CPT | Required | Justice Core plugin (NOT VERIFIED live) |
| `practice-areas` taxonomy | Required | Justice Core plugin (NOT VERIFIED live) |
| `city` taxonomy | Required | Justice Core plugin (NOT VERIFIED live) |

**RISK:** If the plugin is inactive or registered the wrong slug, all CPT/taxonomy pages return 404.

---

## TEMPLATE HIERARCHY

| URL Pattern | Template Used |
|------------|--------------|
| / | front-page.php |
| /articles/ | archive-articles.php |
| /articles/{slug}/ | single-articles.php |
| /lawyers/ | archive-justice_lawyer.php |
| /lawyers/{slug}/ | single-justice_lawyer.php |
| /practice-areas/{slug}/ | taxonomy-practice-areas.php |
| /page/{slug}/ | page.php |
| /?s=query | search.php |
| /404 | 404.php |
| /* (fallback) | archive.php or index.php |

---

## HOMEPAGE SECTIONS (front-page.php)

Section order — based on code (competitive research confirms this order is correct):

| # | Section | Template Part | Status |
|---|---------|--------------|--------|
| 1 | Hero | sections/hero | ✅ Implemented |
| 2 | Practice areas grid | sections/practice-areas-grid | ✅ Implemented |
| 3 | Cities grid | sections/cities-grid | ✅ Implemented |
| 4 | Featured lawyers | sections/featured-lawyers | ✅ Fixed (CPT name) |
| 5 | Latest articles | sections/latest-articles | ✅ Implemented |
| 6 | Featured pillars | sections/featured-pillars | ✅ Fixed (SVG icons) |
| 7 | Topic clusters | sections/topic-clusters | ✅ Implemented |
| 8 | Ask a lawyer | sections/ask-lawyer | ✅ Implemented |
| 9 | Trust section | sections/trust-section | ✅ Implemented |
| 10 | Lawyer CTA | sections/lawyer-cta | ✅ Implemented |
| 11 | Newsletter | sections/newsletter | ✅ Implemented |
| 12 | CTA section | sections/cta-section | ✅ Implemented |

---

## KNOWN ISSUES (NOT FIXED — Require Live Site Access)

| Issue | Risk | Action Needed |
|-------|------|---------------|
| Casino/spam content on homepage | CRITICAL | See spam-investigation.md |
| Hero search form GET params not wired to lawyer directory | HIGH | Change form action to `/lawyers/` |
| "10+ שנות פעילות" trust stat is hardcoded | MEDIUM | Replace with dynamic or remove |
| Hero stats may show "0" if no articles/terms | MEDIUM | Add minimum placeholder values |
| Practice area cards show `§` icon | LOW | Consider practice-area-specific icons |
| No canonical tags | HIGH | Add via Yoast/RankMath or custom |
| No XML sitemap | HIGH | Install Yoast SEO or RankMath |
| `topic-clusters.php` uses hardcoded slugs | MEDIUM | Should query real taxonomy slugs |
| `archive-justice_lawyer.php` filter labels not i18n wrapped | LOW | Wrap in `esc_html_e()` |
| `single-justice_lawyer.php` raw Hebrew strings not i18n wrapped | LOW | Wrap in `esc_html_e()` |
| WhatsApp `justice_whatsapp` theme_mod may be empty | MEDIUM | Set default in WP Customizer |

---

## REST API ROUTES IMPLEMENTED BY THEME

None. The theme does not register REST routes.

**Required REST routes (must be added by Justice Core plugin):**
- `GET /justice-core/v1/health` — site health check
- `GET /justice-core/v1/site-state` — active theme, plugins, CPT list
- `GET /justice-core/v1/plugin-registry` — all active plugins
- `GET /justice-core/v1/content-inventory` — all posts/CPT entries
- `GET /justice-core/v1/spam-candidates` — suspicious content
- `GET /justice-core/v1/lawyers` — lawyer list with meta
- `GET /justice-core/v1/leads` — lead list

---

## ENQUEUED ASSETS

| Handle | Type | Source |
|--------|------|--------|
| justice-fonts | CSS | Google Fonts (Heebo) |
| justice-main | CSS | assets/css/main.css |
| justice-components | CSS | assets/css/components.css |
| justice-accessibility | CSS | assets/css/accessibility.css |
| justice-rtl | CSS (RTL only) | assets/css/rtl.css |
| justice-navigation | JS | assets/js/navigation.js |

---

## GIT STATE

| Branch | Status |
|--------|--------|
| claude/justice-website-review-aovSK | Active development branch |
| main | Base branch (unchanged) |

**Commits on this branch (as of audit):**
- b4fa4ce — rename CPT, update templates
- 1125622 — lawyer directory + lead CPT + CSS
- 9437d1e — lawyer card template
- 35dbc43 — footer internal linking
- 03e80c7 — competitive homepage
- 95edcbe — strategic homepage sections
- 916fb87 — premium polish + micro-animations
- 340f0a9 — Hebrew fixes + pillar icons
- c77d559 — initial commit
