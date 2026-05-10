# Changelog — Jus-Tice.co.il
**Format:** [Date] | [Branch/Commit] | [Category] | [Description]

---

## 2026-05-10 — Session: claude/justice-website-review-aovSK (deep audit)

### CODE FIXES — STRUCTURAL

**[HIGH] Removed orphan `</main>` from `archive-justice_lawyer.php`**
- Header opens `<main>` and footer closes it. Template added an extra closing tag → invalid HTML.

**[HIGH] Fixed `taxonomy-city.php` registered against wrong CPT slug**
- Was: `register_taxonomy( 'city', array( 'lawyer' ), ... )`
- Now: `register_taxonomy( 'city', array( 'justice_lawyer' ), ... )`

**[HIGH] Fixed `taxonomy-practice-areas.php` attached to spam-prone `'post'` type**
- Was: `register_taxonomy( 'practice-areas', array( 'articles', 'post' ), ... )`
- Now: `register_taxonomy( 'practice-areas', array( 'articles', 'justice_lawyer' ), ... )`

**[MEDIUM] Hebraized `cpt-articles.php` labels (were English)**
- Now uses Hebrew labels matching site language

**[MEDIUM] Hebraized `taxonomy-practice-areas.php` labels (were English)**

**[CRITICAL] Wired `ask-lawyer.php` form handler**
- Was: `<form action="#">` — leads silently lost
- Now: posts to `admin-post.php?action=justice_submit_lead` with nonce + success/missing notice

**[HIGH] Removed fake "10+ years of activity" stat from `trust-section.php`**
- Replaced with cities count (live taxonomy count)
- Section now conditionally renders only when at least one stat > 0

**[HIGH] Fixed `topic-clusters.php` URL fallback + post type restriction**
- Cluster card links use term-link if available, else `/lawyers/?area=slug` (no 404)
- Query restricted to `articles` CPT only (no `post` spam vector)

**[HIGH] Fixed `featured-pillars.php` URL fallback**
- Each pillar resolves to term link if exists, else lawyer directory filtered by area
- No more 404s when pillar pages don't exist

**[LOW] Replaced emoji icons in `lawyer-cta.php`**
- 👤📩📊 → inline SVG person/envelope/bar-chart icons

### CODE FIXES — SEO + SCHEMA

**[HIGH] Added canonical URL meta in `inc/seo.php` `justice_theme_canonical_url()`**
- Emits `<link rel="canonical">` on every public page
- Defers to Yoast/RankMath/AIOSEO when active
- Removes WP core's `rel_canonical` to win for archives/taxonomies too

**[MEDIUM] Added robots noindex for thin URLs in `inc/seo.php` `justice_theme_robots_meta()`**
- Search results: noindex,follow
- Lawyer directory with both city + area filters: noindex (combinatorial)
- Lawyer directory with keyword search: noindex

**[HIGH] Added Schema.org Attorney JSON-LD on lawyer profile pages**
- `inc/schema.php` `justice_theme_attorney_schema()`
- Includes name, firm, telephone, email, address, areaServed, knowsAbout, knowsLanguage, hasCredential, identifier (Bar #)

**[MEDIUM] Added Schema.org LegalService JSON-LD on practice-areas taxonomy pages**
- `inc/schema.php` `justice_theme_legalservice_schema()`

### CODE FIXES — DATA INTEGRITY

**[MEDIUM] Lawyer view counter excludes bots/admins/feeds**
- `single-justice_lawyer.php` checks `is_feed()`, `is_admin()`, `is_user_logged_in()`, common bot UA patterns
- Prevents inflating analytics with non-human traffic

### CODE FIXES — CMS

**[MEDIUM] Added Customizer settings: `justice_whatsapp` + `justice_business_hours`**
- `inc/lead-ui.php`
- Footer was using hardcoded WhatsApp default; now editable

### CSS

**[MEDIUM] CSS additions in `assets/css/main.css`:**
- `.ask-lawyer__notice` (success + error states)
- `.lawyers-grid` auto-fit minimum 220px (handles 1–3 lawyers gracefully)
- Breadcrumbs: white background, sharper separator, bold current item
- Lawyer card: deeper info layer (avatar border, area pill, larger name)
- Practice area card: refined icon + count pill
- Article card: better hierarchy

### CLEANUP

**[LOW] Removed dead plugin files**
- `jus-tice-engine/includes/agent-bridge.php` — never loaded
- `jus-tice-engine/includes/file-tools.php` — never loaded
- These exposed file-write REST surface that was unused

### DOCUMENTATION CREATED (this session)

- `project-control/url-strategy.md` — final URL decision (short English slugs, pillar PAGES at root)
- `project-control/url-migration-map.csv` — migration plan for legacy URLs
- `project-control/slug-normalization-rules.md` — Hebrew→English slug spec + city/topic mappings
- `project-control/seo-aio-geo-strategy.md` — SEO + AI search optimization + YMYL/E-E-A-T
- `project-control/cms-audit.md` — full CMS state + 20 bugs catalogued
- `project-control/frontend-cms-map.md` — every visible component → CMS source mapping
- `project-control/research-deep-dive.md` — din.co.il, psakdin, midrag, justia structural patterns
- `project-control/lawyer-system-audit.md` — lawyer CPT + lead flow detailed audit
- `project-control/lawyer-privacy-review.md` — Bar advertising rules + privacy compliance
- `project-control/crm-architecture.md` — CRM architecture + integration plan
- `project-control/payment-architecture.md` — pricing + payment platform options
- `project-control/lawyer-onboarding-flow.md` — 3 onboarding modes (self/claim/concierge)
- `project-control/visual-qa-report.md` — desktop visual QA findings
- `project-control/mobile-visual-qa.md` — mobile visual QA findings
- `project-control/polish-cycles.md` — log of polish cycles
- `project-control/performance-php-audit.md` — PHP version + performance review
- `project-control/serp-research-log.csv` — keyword research skeleton (TBD when GSC connected)
- `project-control/title-audit.csv` — title tag review across page types
- `project-control/cms-checklist.csv` — operational checklist for live setup
- `project-control/current-status.md` — current state summary (this session)
- `project-control/decisions.md` — decision log
- `project-control/blockers.md` — what's blocking forward progress
- `project-control/risks.md` — open risks + mitigations

---

## 2026-05-09 — Session: claude/justice-website-review-aovSK

### BUGS FIXED

**[CRITICAL] Removed duplicate `<main>` tag from `single-justice_lawyer.php`**  
- File: `single-justice_lawyer.php`  
- Problem: Template opened its own `<main id="primary">` INSIDE header.php's existing `<main>`. Resulted in nested `<main>` (invalid HTML) and duplicate `id="primary"`.  
- Fix: Removed the duplicate `<main>` open and `</main>` close from the template.

**[CRITICAL] Removed duplicate `<main>` tag from `archive-justice_lawyer.php`**  
- File: `archive-justice_lawyer.php`  
- Same issue as above. Fixed.

**[HIGH] Fixed lawyer meta key mismatch in `lawyer-card.php`**  
- File: `template-parts/cards/lawyer-card.php`  
- Problem: Card used `_justice_firm_name`, `_justice_phone`, `_justice_years_experience`, `_justice_plan_type` (prefixed, wrong)  
- Fix: Changed to `firm_name`, `phone`, `years_experience`, `plan_type` (matching `single-justice_lawyer.php`)

**[HIGH] Fixed `is_paid` plan type mismatch in `lawyer-card.php`**  
- File: `template-parts/cards/lawyer-card.php`  
- Problem: Card checked for plans `'basic', 'premium', 'elite'` — none of which match the canonical plans in `single-justice_lawyer.php`  
- Fix: Changed to canonical plan names: `'pro', 'featured', 'lead_partner', 'full_service'`

**[HIGH] Fixed CPT name in `featured-lawyers.php`**  
- File: `template-parts/sections/featured-lawyers.php`  
- Problem: Used old `'lawyer'` CPT slug instead of `'justice_lawyer'` — featured section would always be empty  
- Fix: Changed to `'justice_lawyer'` and updated meta key from `_justice_featured` to `featured_until` date logic

**[MEDIUM] Added missing CSS custom properties**  
- File: `assets/css/main.css`  
- Problem: `--color-navy-100`, `--color-navy-400`, `--color-navy-600` were used throughout but not defined in `:root`  
- Fix: Added to `:root` — navy-100: `#e8edf5`, navy-400: `#4a6fa5`, navy-600: `#1d3a6b`

### HEBREW / UI FIXES

**[HIGH] Converted all English strings to Hebrew — `single-articles.php`**  
- "Need legal help?" → "צריכים עזרה משפטית?"
- "Send a short inquiry..." → "שלחו פנייה קצרה ונסייע..."
- "Editorial note" → "הערת מערכת"
- "This guide is intended as general legal information..." → Hebrew equivalent
- "Updated: %s" → "עודכן: %s"

**[HIGH] Converted English strings — `archive-articles.php`**  
- "Legal library" → "ספריית מאמרים משפטיים"
- "Browse legal guides..." → Hebrew
- "Previous" / "Next" → "→ הקודם" / "הבא ←"

**[MEDIUM] Converted English strings — `archive.php`**  
- "Previous" / "Next" → Hebrew pagination

**[HIGH] Converted English strings — `taxonomy-practice-areas.php`**  
- "Practice area" eyebrow → "תחום משפטי"
- "Get legal direction" CTA → "מצאו עורך דין בתחום זה"
- "Previous" / "Next" → Hebrew pagination

**[HIGH] Converted English string — `inc/template-tags.php`**  
- `justice_theme_reading_time()`: "%d min read" → "%d דקת/דקות קריאה"

**[MEDIUM] Converted English strings — `inc/breadcrumbs.php`**  
- "Breadcrumbs" aria-label → "שביל ניווט"
- "Search results for: %s" → "תוצאות חיפוש: %s"

**[LOW] Converted English strings — `inc/lead-ui.php` Customizer**  
- "Contact Information" section title → "פרטי יצירת קשר"
- "Phone Number" label → "מספר טלפון"
- "Email" label → "דואר אלקטרוני"

### DESIGN IMPROVEMENTS

**[MEDIUM] Replaced emoji icons with inline SVG in `featured-pillars.php`**  
- ⚖️🛡️🚗🏠💼📜 → proper legal-themed SVG icons
- Updated pillar icon CSS to circular container background

**[MEDIUM] Replaced emoji placeholder in `lawyer-card.php`**  
- `⚖️` placeholder → person silhouette SVG
- `📍` location pin → location SVG

**[LOW] Replaced emoji in `featured-lawyers.php` empty state**  
- `⚖️` → person SVG

**[LOW] Replaced emoji in `archive-justice_lawyer.php` empty state**  
- `⚖️` → person SVG

**[LOW] Updated CSS for directory/featured empty state icons**  
- Changed from `font-size` emoji sizing to proper `width/height` SVG container sizing

### DOCUMENTATION CREATED

- `project-control/expert-audit.md` — comprehensive technical/design/SEO/business audit
- `project-control/competitor-research.md` — Din, PsakDin, Justia, Midrag comparison
- `project-control/current-site-state.md` — verified theme state, template hierarchy, known issues
- `project-control/plugin-registry.md` — canonical plugin architecture + duplicate detection guide
- `project-control/wordpress-plugin-theme-manual.md` — complete WP engineering reference
- `project-control/spam-investigation.md` — casino/spam content investigation plan
- `project-control/content-inventory.csv` — content audit template with examples
- `project-control/cannibalization-map.csv` — duplicate/competing content template
- `project-control/topic-clusters.csv` — 10 content clusters with pillar keywords
- `project-control/internal-link-opportunities.csv` — internal link audit template
- `project-control/strategic-roadmap.md` — 30/60/90 day roadmap
- `project-control/demo-readiness.md` — demo prerequisites checklist
- `project-control/next-actions.md` — prioritized action list for next sessions
- `project-control/changelog.md` — this file
