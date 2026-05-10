# Frontend → CMS Map — jus-tice.co.il
## Date: 2026-05-09

---

## Section-by-Section Data Source Map

| Section | Template File | Data Source | Admin Editable | Notes |
|---------|--------------|-------------|----------------|-------|
| Homepage hero | `template-parts/sections/hero.php` | Static PHP string + `practice-areas` taxonomy | NO (text is hardcoded) | H1 and description are static Hebrew strings. Dropdowns pull from taxonomy. Stats are dynamic. |
| Hero stats (articles / topics / cities) | `hero.php` | `wp_count_posts('articles')` + `wp_count_terms('practice-areas')` + static array count | NO | Dynamic counts from real CPT/taxonomy data |
| Practice areas grid | `template-parts/sections/practice-areas-grid.php` | `practice-areas` taxonomy | YES — via WP admin Lawyers > Practice Areas | Terms with names, slugs, and descriptions |
| Cities grid | `template-parts/sections/cities-grid.php` | Static PHP array in template | NO | Hardcoded list of 20 Israeli cities |
| Featured lawyers | `template-parts/sections/featured-lawyers.php` | `justice_lawyer` CPT (any published) | YES — via WP admin Lawyers | Shows demo cards if no published lawyers exist |
| Lawyer card | `template-parts/cards/lawyer-card.php` | Post meta: firm_name, phone, years_experience, plan_type + `city` + `practice-areas` taxonomies | YES — per lawyer profile | Meta fields managed by justice-core plugin |
| Latest articles | `template-parts/sections/latest-articles.php` | `articles` CPT (latest published) | YES — via WP admin Articles | |
| Article card | `template-parts/cards/article-card.php` | Post title, excerpt, thumbnail, `practice-areas` taxonomy | YES — per article | |
| Featured pillars | `template-parts/sections/featured-pillars.php` | Static PHP array in template | NO | Hardcoded pillar topics |
| Topic clusters | `template-parts/sections/topic-clusters.php` | `practice-areas` taxonomy parent/child | YES — via WP admin taxonomy hierarchy | Requires parent terms to have children |
| Ask a lawyer | `template-parts/sections/ask-lawyer.php` | Static HTML form | NO | Form submissions not wired to CMS yet |
| Trust section | `template-parts/sections/trust-section.php` | Static PHP strings | NO | Numbers are hardcoded |
| Newsletter | `template-parts/sections/newsletter.php` | Static HTML form | NO | Not connected to email provider |
| Primary navigation | `template-parts/layout/site-header.php` | WordPress menus (primary location) | YES — via WP admin Appearance > Menus | Fallback shows 6-item menu from code |
| Footer logo | `template-parts/layout/site-footer.php` | WordPress custom_logo or brand-lockup fallback | YES — via WP Customize | Currently showing CSS brand-lockup |
| Footer nav columns | `template-parts/layout/site-footer.php` | Hardcoded links in PHP | NO | Links are static; needs wp_nav_menu |
| Footer contact | `template-parts/layout/site-footer.php` | `justice_theme_option('justice_phone')` + email + WhatsApp | YES — via theme options | Uses `justice_theme_option()` helper |
| WhatsApp float | `template-parts/layout/site-footer.php` | `justice_theme_option('justice_whatsapp')` | YES | |
| Single article header | `single-articles.php` | Post title, date, modified date, practice-area term, reading time | YES — via WP admin | |
| Single article content | `single-articles.php` | Post content (Gutenberg/Classic Editor) | YES — via WP admin | |
| Single lawyer profile | `single-justice_lawyer.php` | Post title + post meta (30+ fields) + `practice-areas` + `city` taxonomies | YES — via WP admin + justice-core meta boxes | |
| Category/taxonomy page | `taxonomy-practice-areas.php` | `practice-areas` term + article posts in that term | YES — term description editable in admin | |
| Lawyer archive | `archive-justice_lawyer.php` | `justice_lawyer` CPT with filter queries | YES — depends on lawyers added | |
| Article archive | `archive-articles.php` | `articles` CPT | YES — depends on articles added | Title now Hebrew |
| 404 page | `404.php` | Static template | NO | |
| Search | `search.php` | WordPress search query | YES — native WP | |

---

## Key Hardcoded Items That Need CMS Connection

| Item | Priority | How to Connect |
|------|----------|----------------|
| Trust section numbers (1,209 / 51 / 20) | LOW | Already dynamic via `wp_count_posts` / `wp_count_terms`; static 20 for cities |
| Footer nav columns | MEDIUM | Replace with `wp_nav_menu` using `footer` and `footer_trust` menu locations |
| Hero H1 / description text | MEDIUM | Add as theme option or page meta |
| Featured pillars | LOW | Convert to CPT or page children |
| Ask-a-lawyer form | HIGH | Wire to CF7 / WPForms / custom post type for submissions |
| Cities grid | LOW | Convert to `city` taxonomy query |

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **HOMEPAGE SECTIONS VERIFIED (12+):** Hero, practice-areas grid, A-Z practice search, cities grid, featured lawyer, LegalTech tools, latest articles, featured pillars, topic clusters, ask-lawyer form, lawyer CTA, newsletter, footer CTA. All rendering correctly on live site.
* **NEW SECTIONS NOT IN MAP:** LegalTech tools section (AI intake, demand letter, family agreement, real estate review) and A-Z practice area search grid are live but not documented above. **Add to map.**
* **Ask-a-lawyer form: CONFIRMED NOT WIRED.** Form section header visible on homepage but lead submission NOT connected to CRM. Priority **HIGH** per table above — STILL PENDING.
* **Footer nav: STILL HARDCODED in PHP.** Not using `wp_nav_menu()`. Priority **MEDIUM** — STILL PENDING.
* **Trust section numbers: NOW DYNAMIC.** Article count pulls from `wp_count_posts`. Cities count is static "20". Priority **LOW** — acceptable.
