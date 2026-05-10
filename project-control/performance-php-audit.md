# Performance & PHP Audit

**Date:** 2026-05-10
**Method:** Code review of theme + plugin. Live performance NOT measured.

---

## 1. PHP / WordPress requirements

| Component | Requires | Live status |
|---|---|---|
| Theme | PHP 7.4+ (uses PHP 7.4 syntax — null coalescing, arrow functions in some places) | NOT VERIFIED |
| Plugin | PHP 8.0+ (uses `int\|WP_Error` union type at `seeder.php:126`, fn() arrow functions throughout, `str_contains` at `rest-db-tools.php:253`) | NOT VERIFIED |
| WordPress | 6.4+ per plugin header | NOT VERIFIED |

**RISK:** If live PHP is < 8.0 the plugin will produce parse errors on activation. Required check:
```bash
wp eval 'echo PHP_VERSION;'
```

If PHP 7.4 only, `int|WP_Error` union type and `str_contains` will fail.

**Recommendation:** uPress hosting typically offers PHP 8.1 — verify via hosting panel or `wp eval`.

---

## 2. Plugin load order

`jus-tice-engine.php` loads 12 files via `foreach`:
```
security.php → logger.php → cpt-articles.php → cpt-lawyers.php
→ taxonomy-practice-areas.php → taxonomy-city.php → lead-submissions.php
→ seeder.php → rest-health.php → rest-content-tools.php
→ rest-db-tools.php → admin-pages.php
```

All files have `if ( ! defined( 'ABSPATH' ) ) { exit; }` guard. ✓

`seeder.php` runs `jte_maybe_auto_seed()` on `admin_init` — only when:
- option `jte_seeded_v5` is missing AND
- current user can `manage_options`

Performance: O(1) `get_option` check on every admin page load. Negligible.

---

## 3. Theme load order

`functions.php` loads 10 files via `foreach`:
```
setup.php → enqueue.php → template-tags.php → breadcrumbs.php
→ schema.php → seo.php → accessibility.php → related-content.php
→ lead-ui.php → cleanup.php
```

All have `ABSPATH` guard. ✓

---

## 4. Hooks fired (potential performance impact)

| Hook | Files | Impact |
|---|---|---|
| `after_setup_theme` | `setup.php` (twice) | negligible |
| `wp_enqueue_scripts` | `enqueue.php` | 4 styles + 1 script — light |
| `init` | plugin CPT/taxonomy registrations × 4 | one-time per request |
| `rest_api_init` | 5 files registering routes | only fires on REST requests |
| `add_meta_boxes` | `cpt-lawyers.php`, `lead-submissions.php` | only on admin edit screen |
| `save_post_*` | save handlers | only on save |
| `wp_head` | 7+ functions (meta, schema, canonical, robots) | adds <head> output — fast |
| `pre_get_posts` | `seo.php` | every query — minimal logic |
| `get_the_archive_title` | filter | per archive query |
| `body_class` | filter | per page |
| `document_title_parts` | filter | per page |

No heavy `init`-level queries. ✓

---

## 5. Database query analysis

### Front page (`front-page.php`)

| Section | Queries |
|---|---|
| header (menus) | 6 nav-menu lookups (one per location, 0 if menu not assigned) |
| breadcrumbs | 0 (front page returns early) |
| hero — practice-areas dropdown | 1 `get_terms` |
| hero — popular terms panel | 1 `get_terms` |
| hero — stats | 3 `wp_count_*` |
| practice-areas-grid | 1 `get_terms` |
| cities-grid | 0 (hardcoded) |
| featured-lawyers | 1 `wp_count_posts` + 1 WP_Query (lawyers, max 4) |
| latest-articles | 1 WP_Query (max 6) |
| featured-pillars | 6 `get_term_by` (one per pillar to resolve link) — could be cached |
| topic-clusters | 4 `get_term_by` + 4 WP_Query (max 4 each) |
| ask-lawyer | 0 |
| trust-section | 3 `wp_count_*` |
| lawyer-cta | 0 |
| newsletter | 0 |
| cta-section | 0 |
| footer | 1 `get_terms` (top 20 practice areas) |
| schema | 0 (just outputs JSON-LD from already-loaded data) |
| meta head | 0 |

**Total: ~27 queries on front page.** OK for an editorial homepage. With WP query cache, most repeat.

### Lawyer profile (`single-justice_lawyer.php`)

| Operation | Queries |
|---|---|
| Standard WP load (post, postmeta, comments, etc.) | ~6 |
| 13× `get_post_meta` | most cached after first call |
| `get_the_terms` × 2 | 2 |
| `update_post_meta` (view counter) | 1 (now skipped for bots) |
| Schema (Attorney) | 0 (uses already-loaded meta) |

Acceptable.

### Lawyer directory (`archive-justice_lawyer.php`)

| Operation | Queries |
|---|---|
| Main WP_Query | 1 |
| `get_terms` × 2 (cities + areas for filter dropdowns) | 2 |
| `get_term_by` × 0–2 (depending on filters) | 0–2 |

Acceptable.

---

## 6. Asset loading

### Stylesheets (in order)
1. `justice-fonts` — Google Fonts (Heebo) — external request
2. `justice-main` — `assets/css/main.css` (310 lines, ~10–15KB)
3. `justice-components` — `assets/css/components.css` (2 lines, dead) — **wasted HTTP request**
4. `justice-accessibility` — `assets/css/accessibility.css` (1 line, ~500 bytes) — **questionable separate file**
5. `justice-rtl` (when RTL) — `assets/css/rtl.css` (97 lines, ~2KB)

**Recommendation:** Either populate `components.css` and `accessibility.css` OR merge into `main.css` and remove the enqueues.

### Scripts
1. `justice-navigation` — `assets/js/navigation.js`, in footer

NOT VERIFIED what's in `navigation.js` (file exists per `ls`). Likely small.

### Google Fonts performance
- 7 weights of Heebo loaded — heavy. Most pages use 400/600/700/800.
- **Recommendation:** drop to 4 weights (400, 600, 700, 800) → saves ~100KB.
- Use `font-display: swap` (already in URL).
- Consider self-hosting Heebo for HTTP/2 benefit.

---

## 7. Front-end performance gaps

| Gap | Severity | Action |
|---|---|---|
| 7-weight Heebo font load | Medium | Reduce to 4 weights |
| Empty CSS files enqueued | Low | Consolidate or remove |
| No `preconnect` to fonts.googleapis.com | Low | Add hint |
| No image lazy-loading attribute on most images | Medium | `the_post_thumbnail()` since WP 5.5 lazy-loads natively but verify |
| No `width`/`height` on images (CLS risk) | Medium | Verify WP `the_post_thumbnail` adds dimensions |
| No critical CSS inline | Medium | Consider for above-fold content |
| Inline SVGs every render | Low | Acceptable; sprite would help with many |
| No service worker / PWA | Low | Phase 3 |
| No HTTP/2 push or preload hints | Low | Hosting-level |

---

## 8. Caching status

| Layer | Status |
|---|---|
| WP object cache | NOT VERIFIED — Redis/Memcached likely on uPress |
| Page cache | NOT VERIFIED — uPress includes a page cache; Cloudflare possible |
| Browser cache headers | NOT VERIFIED |
| Image CDN | NOT VERIFIED |
| Asset versioning via `JUSTICE_THEME_VERSION` | ✓ used in enqueue |
| Plugin asset versioning via `JTE_VERSION` | n/a — no plugin assets |

---

## 9. Database table size projection

| Object | Year-1 estimate | Year-3 estimate |
|---|---|---|
| `wp_posts` (articles) | 200–400 | 1000+ |
| `wp_posts` (justice_lawyer) | 50–500 | 5000+ |
| `wp_posts` (justice_lead) | 1k–10k | 100k+ |
| `wp_postmeta` (lawyer × ~25 fields) | 12k–125k | 125k+ |
| `wp_postmeta` (lead × ~14 fields) | 14k–140k | 1.4M+ |
| `wp_term_relationships` | growing with content | OK |

**At 1M+ rows in `wp_postmeta`**, performance starts degrading. Mitigation:
- Index frequently-queried meta keys (e.g., `priority_score`, `featured_until`, `lead_status`)
- Periodically archive old leads (>2 years) to a separate table
- Consider denormalizing top-queried lead fields into a custom table

This is a Phase 3+ concern.

---

## 10. Security

| Item | Status |
|---|---|
| All REST routes require `manage_options` | ✓ |
| Nonces on lead form | ✓ |
| Sanitization on all user input | ✓ via `sanitize_text_field`, `sanitize_email`, `sanitize_textarea_field` |
| `wp_verify_nonce` before processing | ✓ |
| `current_user_can('edit_post', $post_id)` on save_post handlers | ✓ |
| ABSPATH guard on every PHP file | ✓ |
| No `eval()`, no `extract()`, no `unserialize` of user input | ✓ |
| No raw SQL with user input (all `$wpdb->prepare`) | ✓ |
| Logged write actions to audit trail (`jte_log`) | ✓ |
| No file write API exposed to REST | ✓ — `agent-bridge.php` was removed |
| No exec / shell / system calls | ✓ |
| Email output via `wp_mail` (sanitized) | ✓ |
| `esc_url`, `esc_html`, `esc_attr` used in templates | ✓ verified per template |

---

## 11. Code quality observations

| Observation | Note |
|---|---|
| `inc/` files all under 200 lines — manageable | ✓ |
| Plugin includes well-organized into role-based files | ✓ |
| Naming: theme uses `justice_theme_*` prefix consistently | ✓ |
| Naming: plugin uses `jte_*` prefix consistently | ✓ |
| No global state mutation outside hooks | ✓ |
| Inline comments minimal but present where needed | ✓ |
| Some plugin stubs (security.php, admin-pages.php, rest-routes.php) are 3-line placeholders | ⚠️ either implement or remove |
| Some hardcoded strings should be `__()` for i18n | ✓ mostly done |

---

## 12. PHP fatal-error patterns to watch for on live

| Pattern | Symptom |
|---|---|
| Plugin activation fails silently | Check `error_log` for "Missing include" or fatal |
| `int\|WP_Error` syntax error | PHP < 8.0 — entire plugin breaks |
| Array unpacking `...$params` in `$wpdb->prepare` (rest-db-tools.php:76) | PHP 5.6+ — safe |
| `str_contains` not available | PHP < 8.0 |
| `fn () => ...` arrow function | PHP < 7.4 |
| `?:` null coalescing | PHP < 7.0 |

---

## 13. NOT VERIFIED

- Live PHP version
- Live WP version
- Whether plugin activates without fatal errors
- Page Speed Insights score
- Lighthouse score
- Time-to-First-Byte from Israel
- Image weights on live (we don't know what was uploaded)
- Whether hosting cache is enabled
- Whether Cloudflare or other CDN is in front
