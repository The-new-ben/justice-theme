# Changelog — Jus-Tice.co.il
**Format:** [Date] | [Branch/Commit] | [Category] | [Description]

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
