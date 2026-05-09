# Changelog — Jus-Tice.co.il
**Format:** [Date] | [Branch/Commit] | [Category] | [Description]

## 2026-05-09 - Session: repo-sync stabilization

### DEPLOYMENT MODEL

**[VERIFIED] Switched to repo-sync workflow**
- User clarified that the theme syncs through GitHub to live WordPress.
- No ZIP/theme package workflow should be used unless explicitly requested.
- Failed zero-byte package artifact from the interrupted attempt was removed before this session continued.

### FIXES

**[HIGH] Added CMS-wired lawyer mini-site fields**
- Files: `single-justice_lawyer.php`, `justice-core/includes/cpt-lawyers.php`, `ultra-justice-engine/includes/cpt-lawyers.php`, `ultra-justice/includes/cpt-lawyers.php`, `assets/css/premium-pass-3.css`
- The lawyer mini-site now reads editable CMS fields for hero text, approach, services, process, credentials, media links, FAQs, testimonials and final CTA.
- Sections only render when real CMS content exists.

**[HIGH] Added editable homepage content band**
- Files: `template-parts/sections/home-page-content.php`, `page-home.php`, `front-page.php`
- The WordPress homepage editor can now control a safe content section inside the homepage template.
- A basic casino/gambling keyword guard prevents known spam categories from rendering in that band.

**[HIGH] Documented zero-founder-effort platform model**
- File: `project-control/self-serve-lawyer-platform-plan.md`
- Added the self-serve lawyer signup, AI console, billing, profile builder, content approval and compliant outreach strategy.

**[CRITICAL] Added the live homepage template path**
- File: `page-home.php`
- Live HTML showed body class `page-template-page-home`, meaning WordPress is using the page template `page-home.php`.
- The repo previously had `front-page.php` but not `page-home.php`, so homepage changes could miss the actual live template assignment.
- `page-home.php` now loads the same premium homepage sections, including `featured-lawyers`.

**[HIGH] Corrected lawyer taxonomy ownership in plugin code**
- Files: `ultra-justice-engine/includes/taxonomy-city.php`, `ultra-justice-engine/includes/taxonomy-practice-areas.php`, `ultra-justice/includes/taxonomy-city.php`, `ultra-justice/includes/taxonomy-practice-areas.php`
- `city` taxonomy now attaches to `justice_lawyer`.
- `practice-areas` taxonomy now attaches to `articles`, `justice_lawyer`, and `post`.

**[HIGH] Made demo seeding safer**
- Files: `justice-core/includes/seeder.php`, `ultra-justice-engine/includes/seeder.php`, `ultra-justice/includes/seeder.php`
- Future seeded lawyer profiles are draft, free-plan, unverified, and marked internally as testing-only.

**[MEDIUM] Fixed lawyer archive invalid markup**
- File: `archive-justice_lawyer.php`
- Removed duplicate `</main>`; `footer.php` owns closing the main element.

**[LOW] Fixed one remaining English lead-form label**
- File: `template-parts/forms/lead-form.php`
- Changed "Short description" to Hebrew.

**[HIGH] Fixed breadcrumb duplication and hierarchy**
- Files: `single.php`, `inc/breadcrumbs.php`
- `single.php` no longer prints a second breadcrumb trail after `header.php`.
- Breadcrumbs now explicitly support article archive, article singles, lawyer archive, lawyer singles, and practice-area taxonomy pages.

**[HIGH] Documented English-only slug policy**
- Files: `project-control/url-slug-migration-plan.md`, `project-control/url-slug-map.csv`
- Rule added: visible Hebrew content stays Hebrew, but public slugs/URLs must be English ASCII only.
- Migration is blocked until live URL inventory and redirect mapping exist.

**[HIGH] Built richer lawyer mini-site template**
- Files: `single-justice_lawyer.php`, `assets/css/premium-pass-3.css`
- Added profile hero, premium visual layer, CTAs, proof blocks, video support, practice areas, related article area, review placeholder, social links, and lead form.
- Reviews and verification badges are conservative: no fake ratings or false "top lawyer" claims.

**[HIGH] Upgraded homepage lawyer card and featured section**
- Files: `template-parts/cards/lawyer-card.php`, `template-parts/sections/featured-lawyers.php`, `assets/css/premium-pass-3.css`
- Homepage only targets Maya Rotenberg as the verified client.
- Added fallback lookup by Hebrew title because the live site currently still has a Hebrew slug.
- Card now presents richer profile value while avoiding unverified ranking claims.

**[HIGH] Added lawyer mini-site admin fields**
- Files: `justice-core/includes/cpt-lawyers.php`, `ultra-justice-engine/includes/cpt-lawyers.php`, `ultra-justice/includes/cpt-lawyers.php`
- Admin can now enter profile video URL, social URLs, homepage feature flag, approved review count, and approved average rating.

**[HIGH] Prevented future seeded Hebrew lawyer slugs**
- Files: `justice-core/includes/seeder.php`, `ultra-justice-engine/includes/seeder.php`, `ultra-justice/includes/seeder.php`
- Maya seed/profile is assigned `advocate-maya-rotenberg`.
- Other future seed profiles receive generated English-only slugs.

**[VERIFIED LIVE] Browser observations**
- Home page responds and no obvious casino/gambling terms appeared in DOM snapshot.
- `/lawyers/` responds and includes Maya Rotenberg plus multiple demo lawyers.
- `/lawyers/advocate-maya-rotenberg/` redirects to homepage at the time of verification, so the live slug migration is still NOT VERIFIED / STILL BROKEN.

### ARCHITECTURE / DOCS

**[IN PROGRESS] Added canonical Justice Core candidate**
- Folder: `justice-core/`
- Purpose: source candidate for the documented canonical plugin path `justice-core/justice-core.php`.
- NOT VERIFIED live. Legacy plugin folders remain until active live plugin path is known.

**[VERIFIED] Added missing project-control files**
- Added current status, decisions, blockers, risks, competitor element analysis, CMS/menu/logo/media audits, lawyer-system audit, visual QA trackers, spam candidates template, category audit template, and package-validation note.

### VERIFICATION

**NOT VERIFIED**
- PHP lint: PHP CLI is unavailable in this local environment.
- Live plugin activation path.
- Live WP/PHP versions.
- Live debug log.
- Browser/mobile visual QA.

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
