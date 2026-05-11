# Homepage Visual CMS Map
**Last updated:** 2026-05-11

## Section-by-Section CMS Audit

| # | Section | Title Source | Image Source | CTA Source | Data Source | Status |
|---|---------|-------------|-------------|-----------|------------|--------|
| 1 | Hero | Hardcoded PHP | Theme asset `hero-bg.png` | Hardcoded links | `wp_count_posts()`, `get_terms()` | ⚠️ Title hardcoded |
| 2 | Practice Areas | Hardcoded PHP | SVG icons via `practice-area-icons.php` | Term links (CMS) | `get_terms('practice-areas')` — **CMS** | ✅ Data is CMS |
| 3 | Find Lawyer Guide | Hardcoded PHP | SVG icons inline | Hardcoded links | None (static content) | ⚠️ All hardcoded |
| 4 | Featured Lawyers | Hardcoded PHP | Lawyer CPT thumbnail | Hardcoded links | `WP_Query('justice_lawyer')` — **CMS** | ✅ Data is CMS |
| 5 | Latest Articles | Hardcoded PHP | Post thumbnails | Post links (CMS) | `WP_Query('articles')` — **CMS** | ✅ Data is CMS |
| 6 | Ask Lawyer | Hardcoded PHP | None | Hardcoded form | Lead submission form | ⚠️ Hardcoded |
| 7 | Trust Section | Hardcoded PHP | None | None | `wp_count_posts()`, `wp_count_terms()` — **CMS** | ✅ Numbers are CMS |
| 8 | CTA Section | Hardcoded PHP | None (CSS gradient) | Hardcoded links | Phone from theme option | ⚠️ Mixed |

## Logo / Site Icon

| Element | Source | CMS-Controlled | Fallback |
|---------|--------|---------------|----------|
| Logo | `has_custom_logo()` check in header | ✅ Yes (Customizer) | CSS `.brand-lockup` wordmark |
| Favicon | `has_site_icon()` check in header.php | ✅ Yes (Customizer) | Theme `assets/images/favicon.png` |
| Theme color | `<meta name="theme-color">` in header.php | ❌ Hardcoded | `#07152f` |

## What Is CMS-Driven (Dynamic)

- Practice area taxonomy terms (names, slugs, counts, links)
- Lawyer CPT posts (featured lawyer profile)
- Article/post content (latest articles section)
- Stats numbers (article count, term count, lawyer count)
- Logo (via WP Customizer → Site Identity)
- Favicon (via WP Customizer → Site Identity, with theme fallback)
- Navigation menus (primary, secondary, footer)
- Phone number (via theme option `justice_phone`)

## What Is Hardcoded (Temporary)

| Item | Location | Reason | Migration Plan |
|------|----------|--------|---------------|
| Hero H1 text | `hero.php:58` | No CMS field yet | Move to Customizer setting or ACF field |
| Hero description | `hero.php:62` | No CMS field yet | Move to Customizer setting |
| Hero background image | `hero.php:51` | Theme asset | Allow override via Customizer |
| City list | `hero.php:27-48` | Hardcoded array | Move to `city` taxonomy terms |
| Guide section content | `find-lawyer-guide.php` | Static educational content | Could become a WP page, but static is fine for SEO |
| Ask Lawyer form | `ask-lawyer.php` | Custom HTML form | Already wired to lead CPT |
| CTA section text | `cta-section.php` | No CMS field | Move to Customizer |
| Topic strip links | `site-header.php:13-49` | Hardcoded array | Move to nav menu or auto-generate from taxonomy |

## Priority Migrations

1. **Hero text → Customizer** (low effort, high impact)
2. **City list → taxonomy** (medium effort, already planned)
3. **Topic strip → auto-taxonomy** (low effort)
