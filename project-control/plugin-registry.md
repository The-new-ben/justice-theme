# Plugin Registry — Jus-Tice.co.il
**Date:** 2026-05-09  
**Status:** NOT VERIFIED live — requires `wp plugin list` or wp-admin access.  
**Purpose:** Track all Justice-related plugins, their CPTs, taxonomies, and roles.

2026-05-11 status override: LIVE PATH VERIFIED / MIGRATION NOT APPROVED. Public REST, uPress plugin manager and uPress File Manager checks show `Ultra Justice Engine` active on live at `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php`; `justice-core` remains a repo-side future target only after collision/parity review and owner approval.

---

## 2026-05-11 Current Live Reality

VERIFIED LIVE:

- Public REST exposes `ultra-justice-engine/v1`.
- Public REST does not expose `justice-core/v1`.
- Public REST does not expose `ultra-justice/v1`.
- uPress plugin manager shows `Ultra Justice Engine` version `1.0.0` active.
- uPress plugin manager did not show a separate `Justice Core` row when filtered for `Justice`.
- uPress File Manager shows `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php`.
- uPress File Manager filtering for `justice-core` under `/wp-content/plugins/` returned 0 items.

VERIFIED LOCAL:

- `ultra-justice-engine/ultra-justice-engine.php` has plugin header `Ultra Justice Engine`.
- `justice-core/justice-core.php` has plugin header `Justice Core`.
- `ultra-justice/ultra-justice.php` has plugin header `Ultra Justice`.
- `justice-core/` and `ultra-justice-engine/` both define `UJE_VERSION`, `UJE_DIR`, `UJE_URL` and many `uje_*` functions.

DECISION:

- Treat `Ultra Justice Engine` as the active live Justice plugin for now.
- Do not activate `justice-core/` beside `ultra-justice-engine/`.
- Do not deactivate or delete `ultra-justice-engine/` without a controlled migration plan, backup and owner approval.
- Keep `justice-core/` as a future canonical target only after collision and parity risks are resolved.

Supporting files:

- `project-control/live-plugin-architecture-review.md`
- `project-control/upress-plugin-manager-readonly-review.md`
- `project-control/upress-plugin-filesystem-readonly-review.md`
- `project-control/justice-plugin-collision-review.md`
- `tools/check-live-plugin-surface.ps1`
- `tools/check-justice-plugin-collision.ps1`

---

## How to Verify Live State

Run via WP-CLI (SSH access required):
```bash
wp plugin list --format=table
wp option get active_plugins --format=json
wp post-type list --format=table
wp taxonomy list --format=table
```

Or via REST API (requires admin auth):
```
GET /wp-json/justice-core/v1/plugin-registry
```
(Must be implemented in Justice Core plugin — see REST route requirements below.)

---

## Expected Plugin Architecture

There must be EXACTLY ONE active Justice plugin. The original target architecture below named `justice-core` as canonical, but live reality currently uses `Ultra Justice Engine`. Do not switch plugins until the migration gates above are complete.

### justice-core (CANONICAL — KEEP)

| Property | Value |
|----------|-------|
| Display Name | Justice Core |
| Folder | `/wp-content/plugins/justice-core/` |
| Main File | `justice-core/justice-core.php` |
| Plugin Name header | `Plugin Name: Justice Core` |
| Version | 1.0.0+ |
| Status | Should be ACTIVE |
| Purpose | Registers all CPTs, taxonomies, REST routes, lead system |

#### CPTs Justice Core Must Register
| CPT Slug | Label | Rewrite Slug |
|----------|-------|-------------|
| `articles` | מאמרים משפטיים | articles |
| `justice_lawyer` | עורכי דין | lawyers |
| `justice_lead` | פניות / לידים | leads |

#### Taxonomies Justice Core Must Register
| Taxonomy Slug | Label | Object Types |
|--------------|-------|-------------|
| `practice-areas` | תחומי משפט | articles, justice_lawyer, post |
| `city` | ערים | justice_lawyer |

#### REST Routes Justice Core Must Register
```
GET  /justice-core/v1/health
GET  /justice-core/v1/site-state
GET  /justice-core/v1/plugin-registry
GET  /justice-core/v1/theme-state
GET  /justice-core/v1/content-inventory
GET  /justice-core/v1/duplicate-titles
GET  /justice-core/v1/spam-candidates
GET  /justice-core/v1/lawyers
GET  /justice-core/v1/leads
POST /justice-core/v1/lawyers (admin only, create lawyer)
```

---

## Risk: Duplicate Justice Plugins

Based on the brief, there may be two Justice-related plugins. This would cause:

| Scenario | Impact |
|----------|--------|
| Both try to register `articles` CPT | PHP fatal error (duplicate function) |
| Both try to register `practice-areas` taxonomy | PHP fatal error |
| Plugin A registers CPT; Plugin B also registers it | Data in wrong post type, 404s |
| Both define same function names | Fatal: "Cannot redeclare function" |

### How to Detect Duplicate Plugins

```bash
# List all active plugins
wp option get active_plugins

# Check if any two plugins try to register same CPT
grep -r "register_post_type.*articles" wp-content/plugins/
grep -r "register_post_type.*justice_lawyer" wp-content/plugins/
grep -r "register_taxonomy.*practice-areas" wp-content/plugins/
```

### Resolution Protocol
1. Identify which plugin is canonical (has more complete code, correct slug names)
2. Deactivate the duplicate via wp-admin or WP-CLI: `wp plugin deactivate justice-core-old`
3. If any CPT data was saved under wrong slug, migrate with:
   ```sql
   UPDATE wp_posts SET post_type = 'justice_lawyer' WHERE post_type = 'lawyer';
   ```
4. Run `wp rewrite flush` after any CPT change
5. Verify no fatal errors in `/wp-content/debug.log`

---

## Required Justice Core Plugin Structure

```
justice-core/
├── justice-core.php          ← main file with valid Plugin Name header
├── includes/
│   ├── cpt-articles.php      ← register_post_type('articles')
│   ├── cpt-lawyer.php        ← register_post_type('justice_lawyer')
│   ├── cpt-lead.php          ← register_post_type('justice_lead')
│   ├── taxonomies.php        ← practice-areas + city
│   ├── meta-fields.php       ← ACF/CMB2 or custom meta boxes
│   ├── rest-routes.php       ← all /justice-core/v1/* routes
│   ├── lead-handler.php      ← admin-post.php justice_submit_lead handler
│   └── admin/
│       ├── lawyer-list.php   ← custom admin columns for lawyers
│       └── lead-list.php     ← lead inbox in WP admin
└── readme.txt
```

### Valid Plugin Header Template
```php
<?php
/**
 * Plugin Name: Justice Core
 * Plugin URI:  https://jus-tice.co.il
 * Description: Core functionality for the Jus-Tice legal portal.
 * Version:     1.0.0
 * Author:      Jus-Tice
 * Author URI:  https://jus-tice.co.il
 * Text Domain: justice-core
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

---

## REST Health Route (Must be Live and Working)

The health route is the primary diagnostic tool for remote debugging:

```php
register_rest_route( 'justice-core/v1', '/health', array(
    'methods'             => 'GET',
    'callback'            => function () {
        $active_theme  = wp_get_theme();
        $active_plugins = get_option( 'active_plugins', array() );

        return array(
            'ok'              => true,
            'site'            => home_url( '/' ),
            'wp_version'      => get_bloginfo( 'version' ),
            'php_version'     => PHP_VERSION,
            'active_theme'    => $active_theme->get( 'Name' ),
            'theme_version'   => $active_theme->get( 'Version' ),
            'template'        => get_template(),
            'stylesheet'      => get_stylesheet(),
            'time'            => current_time( 'mysql' ),
            'plugin_count'    => count( $active_plugins ),
            'cpt_articles'    => post_type_exists( 'articles' ),
            'cpt_lawyer'      => post_type_exists( 'justice_lawyer' ),
            'cpt_lead'        => post_type_exists( 'justice_lead' ),
            'tax_areas'       => taxonomy_exists( 'practice-areas' ),
            'tax_city'        => taxonomy_exists( 'city' ),
            'debug_mode'      => defined( 'WP_DEBUG' ) && WP_DEBUG,
        );
    },
    'permission_callback' => function () {
        return current_user_can( 'manage_options' );
    },
) );
```

**To test:**
```bash
curl -u admin:password https://jus-tice.co.il/wp-json/justice-core/v1/health
```

---

## Other Plugins on Site

Plugins that should be present (NOT VERIFIED — list from brief context):

| Plugin | Purpose | Status | Notes |
|--------|---------|--------|-------|
| Yoast SEO or RankMath | XML sitemap, canonical tags | RECOMMENDED | Do not use both |
| WooCommerce | Payment/subscriptions | PLANNED (Phase 2) | Not needed for Phase 1 |
| WooCommerce Subscriptions | Lawyer subscription plans | PLANNED (Phase 2) | |
| Advanced Custom Fields (ACF) | Lawyer meta fields | RECOMMENDED | Or CMB2 |
| WP Rocket / LiteSpeed Cache | Performance | RECOMMENDED | |
| Wordfence | Security | RECOMMENDED | |
| Redirection | 301 redirects | RECOMMENDED | For URL cleanup |

Plugins that should NOT be active:
- Any old/duplicate Justice plugin
- Spam content importers
- Auto-blogging plugins
- Any plugin with unknown origin that posts content
