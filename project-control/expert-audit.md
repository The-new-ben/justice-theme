# Expert Audit — Jus-Tice.co.il
**Date:** 2026-05-09  
**Auditor:** Claude (acting as WordPress architect, SEO expert, UI/UX, product manager, legal portal specialist)  
**Branch:** claude/justice-website-review-aovSK  
**Status:** VERIFIED where based on codebase inspection. NOT VERIFIED where requiring live site access.

---

## 1. TECHNICAL — WORDPRESS THEME

### Theme Structure
**Status: VERIFIED — theme code inspected.**

| File | Status | Notes |
|------|--------|-------|
| style.css | ✅ Valid header | Theme Name, Version, Text Domain all correct |
| functions.php | ✅ Clean | Proper ABSPATH guard, file loader pattern |
| header.php | ✅ Correct | Opens `<main>`, RTL dir attr set |
| footer.php | ✅ Correct | Closes `<main>`, calls site-footer partial |
| front-page.php | ✅ Correct | 12-section homepage, correct section order |
| single-articles.php | ✅ Fixed (this session) | Was: 4 English strings. Now: Hebrew |
| archive-articles.php | ✅ Fixed (this session) | Was: English eyebrow/desc/pagination |
| archive.php | ✅ Fixed (this session) | Was: English pagination |
| taxonomy-practice-areas.php | ✅ Fixed (this session) | Was: English eyebrow + CTA |
| single-justice_lawyer.php | ✅ Fixed (this session) | Was: duplicate `<main>` tag |
| archive-justice_lawyer.php | ✅ Fixed (this session) | Was: duplicate `<main>` tag |
| inc/template-tags.php | ✅ Fixed (this session) | Was: "min read" in English |
| inc/breadcrumbs.php | ✅ Fixed (this session) | Was: "Breadcrumbs"/"Search results for" in English |
| inc/lead-ui.php | ✅ Fixed (this session) | Was: Customizer labels in English |
| inc/schema.php | ✅ Correct | WebSite + Article schema, JSON-LD |
| inc/seo.php | ✅ Correct | Meta tags, document_title filter, body_class |
| inc/cleanup.php | ✅ Correct | WP version removed, emoji disabled |
| inc/accessibility.php | ✅ Correct | aria-label from title attribute |
| inc/related-content.php | ✅ Correct | Related by practice-area taxonomy |
| inc/enqueue.php | ✅ Correct | Heebo font, main/components/rtl/accessibility CSS |
| inc/setup.php | ✅ Correct | nav menus in Hebrew, image sizes registered |

### Bugs Fixed This Session
| Bug | Severity | Fix Applied |
|-----|----------|-------------|
| Duplicate `<main id="primary">` in single-justice_lawyer.php | CRITICAL — invalid HTML | Removed nested main |
| Duplicate `<main id="primary">` in archive-justice_lawyer.php | CRITICAL — invalid HTML | Removed nested main |
| lawyer-card.php used `_justice_*` meta keys (wrong prefix) | HIGH — lawyers show no data | Fixed to match single-justice_lawyer.php |
| lawyer-card.php `is_paid` checked wrong plan names | HIGH — promoted badge never shows | Fixed plan names |
| featured-lawyers.php checked old CPT name `'lawyer'` | HIGH — featured section always empty | Fixed to `justice_lawyer` |
| featured-lawyers.php used wrong meta key `_justice_featured` | HIGH | Fixed to use `featured_until` date logic |
| CSS: `--color-navy-100/400/600` undefined in :root | MEDIUM — elements show no color | Added to :root |
| Emoji icons in featured-pillars.php (⚖️🛡️🚗🏠💼📜) | MEDIUM — looks cheap | Replaced with inline SVGs |
| Emoji placeholder in lawyer-card.php (⚖️) | MEDIUM | Replaced with person SVG |
| Emoji pin icon in lawyer-card.php (📍) | LOW | Replaced with location SVG |
| Emoji in featured-lawyers.php placeholder (⚖️) | LOW | Replaced with person SVG |
| Emoji in archive-justice_lawyer.php empty state (⚖️) | LOW | Replaced with person SVG |

---

## 2. TECHNICAL — CPT AND TAXONOMY ARCHITECTURE

**Status: VERIFIED via theme code. Actual WP registration: NOT VERIFIED (requires live site).**

### What the theme expects
| CPT / Taxonomy | Where Used | Notes |
|----------------|------------|-------|
| `articles` (CPT) | archive-articles.php, single-articles.php, queries | Legal articles CPT |
| `justice_lawyer` (CPT) | archive-justice_lawyer.php, single-justice_lawyer.php | Lawyer profiles — correct name |
| `practice-areas` (taxonomy) | hero, footer, archive sidebar, breadcrumbs, filters | Primary topical taxonomy |
| `city` (taxonomy) | lawyer card, archive filter, footer cities | City taxonomy for lawyer filtering |

### CPT Registration Risk
The theme RELIES on `articles` and `justice_lawyer` CPTs being registered by a plugin (Justice Core). If the plugin is:
- Deactivated → all CPT pages return 404
- Registering wrong CPT slug → templates don't load
- Registering twice → fatal error

**VERDICT:** There must be exactly ONE plugin registering these CPTs. See plugin-registry.md for the investigation.

### Meta Field Consistency
All lawyer meta fields now use the canonical (unprefixed) key format:
- `firm_name`, `phone`, `email`, `whatsapp`, `website`, `bar_number`
- `years_experience`, `license_status`, `verification_status`
- `plan_type`, `featured_until`, `priority_score`
- `lead_routing_enabled`, `bio_short`, `office_address`
- `profile_views`, `lead_routing_enabled`

**ACTION REQUIRED:** The Justice Core plugin must register ACF/CMB2 fields or a custom meta box using these exact keys.

---

## 3. DESIGN AUDIT

### Current State
**Status: VERIFIED via code inspection. Visual rendering: NOT VERIFIED (no browser access).**

**What is good:**
- CSS custom properties follow a professional navy/gold/cream palette
- Heebo font (premium Hebrew/Latin family) correctly loaded from Google Fonts
- RTL handled via `is_rtl()` check and separate `rtl.css`
- Responsive breakpoints at 960px and 640px
- Card hover states are polished (translateY, box-shadow transitions)
- Gold accent color used consistently throughout
- WhatsApp float button is implemented and styled correctly
- Micro-animations (fadeInUp on sections, hover effects) add polish

**What is missing/weak:**
- No logo uploaded (shows text fallback) — NOT VERIFIED live
- "10+ שנות פעילות" in trust section is hardcoded — potentially false
- Pillar card icons now use SVGs (fixed this session), but CSS needs `pillar-icon` padding adjustment
- Hero stats show `0` if no articles/terms exist — will look bad on empty site
- `archive-justice_lawyer.php` filter form has labels without i18n functions (plain Hebrew strings not wrapped in `esc_html_e()`)
- `single-justice_lawyer.php` has several raw Hebrew strings not wrapped in i18n functions
- `topic-clusters.php` uses hardcoded family-law/criminal-law slugs that may not match real taxonomy slugs

### Design Recommendations (Priority Order)
1. **Logo** — Upload a real SVG/PNG logo to replace the text fallback
2. **Hero stats** — Show placeholder numbers until real data exists (e.g., "10+" articles hardcoded until 10 real articles)
3. **Practice area icons** — Current icon is `§` (section sign); consider legal-themed SVG set
4. **Hero search** — Currently submits to `/?s=` with GET params `practice_area` and `city`; these are not wired to WP_Query filter logic. The search lands on a generic results page, not a filtered lawyer directory.
5. **Homepage mobile** — At 640px, the section animation `fadeInUp` on ALL `.section` elements can feel repetitive; consider targeting only hero/trust.

---

## 4. SEO AUDIT

**Status: VERIFIED via code.**

### What is implemented
| Feature | Status |
|---------|--------|
| `<title>` — custom filter with Hebrew money keywords | ✅ |
| Meta description — homepage + tax + singular | ✅ |
| OG tags — title, description, type, locale he_IL | ✅ |
| Article schema (JSON-LD) | ✅ |
| WebSite + SearchAction schema | ✅ |
| BreadcrumbList schema | ✅ |
| RTL lang attribute on `<html>` | ✅ |
| Heebo font (no render-blocking) | ✅ — loaded async via Google Fonts |
| WP version removed from `<head>` | ✅ |
| Emoji scripts disabled | ✅ |
| Archive title cleaned (no "Archives:" prefix) | ✅ |
| Internal links: footer practice areas + cities | ✅ |
| Attorney schema on lawyer profiles | ✅ (itemscope) |

### What is missing
| Feature | Priority | Notes |
|---------|----------|-------|
| FAQ schema | HIGH | Only add where real Q&A content exists |
| Local Business schema | MEDIUM | For "find lawyers in Tel Aviv" use case |
| Canonical tags | HIGH | Needed as content grows — add `rel=canonical` |
| Sitemap | HIGH | Requires plugin (Yoast/RankMath) or custom |
| robots.txt | HIGH | NOT VERIFIED — check live site |
| hreflang | LOW | Only if Hebrew + English versions exist |
| Author schema with real persons | MEDIUM | Currently uses Organization — needs real authors |
| Image alt text enforcement | MEDIUM | Theme outputs alt from WP media, but not enforced |

### URL Architecture
Based on theme code, the intended URL structure:
```
/                          → homepage
/lawyers/                  → justice_lawyer archive
/lawyers/?area=family-law  → filtered directory
/lawyers/?city=tel-aviv    → filtered directory
/articles/                 → articles CPT archive
/practice-areas/family-law/ → taxonomy page
/{article-slug}/           → single article
/lawyers/{lawyer-slug}/    → single lawyer profile
```

**RISK:** Hero search form submits GET params `practice_area` and `city` but these don't actually filter lawyers — they go to the homepage. This is a BROKEN UX flow. Fix: change form `action` to the lawyers archive URL.

---

## 5. CONTENT AUDIT

**Status: NOT VERIFIED (requires live WP database access).**

### Known Problems (from brief)
| Problem | Risk Level | Mitigation |
|---------|------------|-----------|
| Casino/gaming spam content on homepage | CRITICAL | See spam-investigation.md |
| Hebrew/English mixed UI | FIXED (this session) | All known English strings converted |
| Duplicate/cannibalized articles | HIGH | See cannibalization-map.csv |
| CPT ownership unclear | MEDIUM | See plugin-registry.md |
| Article count possibly inflated by spam | HIGH | Requires audit with WP-CLI |

### Content Structure Gaps
- No "About" page content
- No "Editorial policy" page
- No "Advertising disclosure" page
- No "Terms for lawyers" page
- No author profiles / author CPT
- No legal disclaimers on individual articles (now in editorial-note, but disclaimers need review)
- No FAQ pages (FAQ schema should not be added until real FAQ content exists)

---

## 6. BUSINESS / PRODUCT AUDIT

**Status: Strategic assessment based on codebase.**

### Current Monetization Readiness
| Feature | Status |
|---------|--------|
| Lawyer CPT (profiles) | ✅ Exists in theme |
| Paid plan field (`plan_type`) | ✅ Meta field defined |
| Featured badge (`פרופיל ממומן`) | ✅ Rendered when plan is pro/featured/etc |
| Lead form on lawyer profile | ✅ If `lead_routing_enabled = true` |
| Lead form on homepage (ask-a-lawyer) | ✅ Template exists |
| Payment/subscription system | ❌ NOT BUILT |
| Lawyer self-registration flow | ❌ NOT BUILT |
| Lawyer dashboard (login/manage) | ❌ NOT BUILT |
| CRM / lead management | ❌ NOT BUILT |
| Email notifications for leads | ❌ NOT BUILT |
| Subscription billing | ❌ NOT BUILT |

### Phase 1 Business Readiness (Demo)
The theme can support a demo with:
- 10 manually created draft lawyer profiles
- A visible lawyer directory page (even if empty state shows)
- The homepage with practice area grid, cities, and CTA sections
- A few published legal articles in the articles CPT

**What will look broken at demo:**
- Hero stats showing "0 מאמרים משפטיים" if no articles published
- Featured lawyers section showing empty/placeholder state
- Practice areas grid showing nothing if no terms exist
- Topic clusters showing "בקרוב" for all topics

---

## 7. PLUGIN / ACTIVATION HISTORY

**Status: NOT VERIFIED (requires wp-admin access or WP-CLI).**

Based on brief: there may be two Justice-related plugins. This creates risk of:
- Duplicate CPT registration (fatal error or silent override)
- Duplicate taxonomy registration
- Conflicting REST routes
- Double-loaded functions (fatal error)

**ACTION REQUIRED:** See plugin-registry.md. Run WP-CLI:
```bash
wp plugin list --format=table
wp option get active_plugins --format=json
```

---

## 8. SPAM / CASINO CONTENT

**Status: NOT VERIFIED (requires database access).**

Based on brief: casino/gaming content is appearing on the homepage. Most likely sources (in priority order):

1. **Posts published by a compromised user or import** — Check `wp post list --post_type=post --post_status=publish` for suspicious titles
2. **Page ID 38 content** — The homepage may be set to a Page that contains spam content
3. **Widget area** — Old sidebar/footer widgets may contain spam HTML
4. **Plugin-generated content** — An SEO or content plugin may be injecting content
5. **Theme template query** — `latest-articles.php` pulls from both `articles` AND `post` post type — spam posts will show here

**IMMEDIATE MITIGATION (safe, no data loss):**
In `latest-articles.php`, limit the query to `articles` CPT only (not `post`):
```php
'post_type' => array( 'articles' ),
```
This stops spam regular posts from appearing in the article feed.

See spam-investigation.md for full investigation plan.

---

## 9. SUMMARY SCORECARD

| Category | Score | Notes |
|----------|-------|-------|
| HTML validity | 7/10 | Fixed double-main; minor i18n wrapping issues remain |
| Hebrew-first UI | 8/10 | All known English strings fixed; some raw Hebrew strings not i18n wrapped |
| RTL support | 9/10 | RTL CSS loaded, dir attribute correct |
| SEO foundation | 7/10 | Good schema + title/meta; missing canonical, sitemap, FAQ |
| Design premium feel | 6/10 | Good palette/typography; needs real content to look premium |
| Lawyer CPT/directory | 6/10 | Template exists; meta keys fixed; CPT depends on plugin |
| Content structure | 4/10 | No articles, no authors, no about/legal pages |
| Business readiness | 3/10 | Architecture designed; zero monetization built |
| Plugin stability | UNKNOWN | Requires live site access |
| Spam status | UNKNOWN | Requires database access |
