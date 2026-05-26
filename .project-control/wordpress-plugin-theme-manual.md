# WordPress Plugin & Theme Engineering Manual — Jus-Tice
**Date:** 2026-05-09  
**Purpose:** Prevent the engineering failures that have plagued this project. Read before touching any plugin or theme file.

---

## 1. WHY PREVIOUS WORK WAS UNRELIABLE

Based on the brief, the following failures occurred:
- Plugin/theme activation was unreliable
- Browser clicking was used instead of code/API
- Two Justice plugins existed simultaneously
- CPT ownership was unclear
- Fatal errors from duplicate functions
- Unclear which plugin owns which CPT

These are all **process failures**, not technical limitations. This manual exists to prevent recurrence.

---

## 2. VALID PLUGIN STRUCTURE

```
justice-core/
├── justice-core.php          ← MUST have valid Plugin Name header
├── includes/
│   ├── cpt-articles.php
│   ├── cpt-lawyer.php
│   ├── cpt-lead.php
│   ├── taxonomies.php
│   ├── meta-fields.php
│   ├── rest-routes.php
│   └── lead-handler.php
└── readme.txt
```

### Rules:
1. **Main file name MUST match folder name.** `justice-core/justice-core.php` — not `justice-core/plugin.php` or `justice-core/index.php`
2. **Plugin Name header MUST be on line 1 or line 2.** WordPress reads it literally.
3. **All `includes/` files MUST be explicitly required** in the main file. PHP does not auto-include.
4. **Each function name must be globally unique.** Prefix ALL functions: `justice_core_register_cpt()` not `register_cpt()`.
5. **Never define functions in template files.** Only in plugin files or `inc/` theme files with unique names.

---

## 3. VALID PLUGIN HEADER

```php
<?php
/**
 * Plugin Name:       Justice Core
 * Plugin URI:        https://jus-tice.co.il
 * Description:       Core functionality for the Jus-Tice legal portal — CPTs, taxonomies, REST API, lead system.
 * Version:           1.0.0
 * Author:            Jus-Tice
 * Author URI:        https://jus-tice.co.il
 * Text Domain:       justice-core
 * Domain Path:       /languages
 * Requires at least: 6.4
 * Requires PHP:      8.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

**Common mistakes that break activation:**
- Missing space after `Plugin Name:` — header becomes unreadable
- BOM (byte order mark) before `<?php` — causes blank admin page
- Syntax error anywhere in main file — plugin never activates
- `exit;` or `die;` outside ABSPATH check — plugin silently fails

---

## 4. VALID THEME STRUCTURE

```
justice-theme/
├── style.css         ← MUST have valid Theme Name header
├── index.php         ← fallback template (required)
├── functions.php     ← loads inc/ files
├── header.php        ← opens <html>, <head>, <body>, <main>
├── footer.php        ← closes </main>, includes site-footer, wp_footer
├── front-page.php    ← homepage (takes priority over home.php for static front page)
├── home.php          ← blog index fallback
├── single.php        ← single post fallback
├── single-{post_type}.php  ← CPT single templates
├── archive.php       ← generic archive fallback
├── archive-{post_type}.php ← CPT archive templates
├── taxonomy-{slug}.php     ← taxonomy archive templates
├── page.php          ← static page template
├── search.php        ← search results
├── 404.php           ← not found
├── inc/
│   ├── setup.php
│   ├── enqueue.php
│   ├── template-tags.php
│   ├── breadcrumbs.php
│   ├── schema.php
│   ├── seo.php
│   ├── accessibility.php
│   ├── related-content.php
│   ├── lead-ui.php
│   └── cleanup.php
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── components.css
│   │   ├── rtl.css
│   │   └── accessibility.css
│   └── js/
│       └── navigation.js
├── template-parts/
│   ├── layout/
│   ├── sections/
│   ├── cards/
│   ├── forms/
│   └── content/
└── languages/
```

### Critical Theme Rules

**RULE 1: header.php opens `<main>`, footer.php closes it.**
- `header.php` ends with `<main id="primary" class="site-main">`
- `footer.php` starts with `</main>`
- CPT templates MUST NOT add another `<main>` tag
- This was a bug — FIXED in this session for both `single-justice_lawyer.php` and `archive-justice_lawyer.php`

**RULE 2: style.css Theme Name determines the folder name.**
- `Theme Name: Justice Theme` in `style.css` of folder `justice-theme/`
- NEVER add `Template: generatepress` unless this is intentionally a child theme

**RULE 3: CPT templates get the loop from `header.php`'s `<main>` scope.**
- Template loads → calls `get_header()` → header opens `<main>` → template content → calls `get_footer()` → footer closes `</main>`

---

## 5. CORRECT ZIP STRUCTURE FOR UPLOAD

When uploading a theme ZIP to WP admin:
```
justice-theme.zip
└── justice-theme/
    ├── style.css
    ├── index.php
    ├── functions.php
    └── ...
```

**WRONG:** `justice-theme.zip/style.css` (no subfolder — WP can't install)
**WRONG:** `justice-theme.zip/justice-theme-main/style.css` (double nesting — from GitHub download)

When uploading a plugin ZIP:
```
justice-core.zip
└── justice-core/
    ├── justice-core.php
    └── includes/
```

**WRONG:** `justice-core.zip/justice-core-main/` — this is the GitHub archive format. Always re-zip the inner folder.

---

## 6. ACTIVATION FLOW

### Theme Activation
1. Upload ZIP via Appearance → Themes → Add New → Upload
2. Activate — WP reads `style.css` header and sets `template` and `stylesheet` options
3. Verify: Appearance → Themes shows "Justice Theme" as active
4. Hard verify: `wp option get template` should return `justice-theme`
5. Check debug.log for PHP errors

### Plugin Activation
1. Upload ZIP via Plugins → Add New → Upload
2. Activate — WP includes the main file, looks for `Plugin Name:` header
3. Verify: Plugins → Installed Plugins shows "Justice Core" as active
4. Check debug.log for PHP errors
5. Verify CPTs registered: `wp post-type list` should show `articles`, `justice_lawyer`

---

## 7. HOW TO DETECT AND FIX DUPLICATE PLUGINS

```bash
# Step 1: List all plugins and their status
wp plugin list --format=table

# Step 2: Search for duplicate CPT registrations
grep -r "register_post_type" /var/www/wp-content/plugins/ | grep -v ".git"

# Step 3: If duplicate found, deactivate the wrong one
wp plugin deactivate justice-old-plugin-folder

# Step 4: Delete the duplicate
wp plugin delete justice-old-plugin-folder

# Step 5: Flush rewrite rules
wp rewrite flush

# Step 6: Check for errors
tail -f /var/www/wp-content/debug.log
```

---

## 8. VERSIONING CONVENTION

| Type | Format | Example |
|------|--------|---------|
| Theme version | SemVer | 1.0.0 → 1.1.0 → 2.0.0 |
| Plugin version | SemVer | 1.0.0 |
| Bump on CSS change | Patch | 1.0.1 |
| Bump on template change | Minor | 1.1.0 |
| Bump on breaking change | Major | 2.0.0 |

Theme/plugin version in `style.css`/`justice-core.php` must be updated and committed together with changes. This ensures cache busting for CSS/JS assets.

---

## 9. DEBUG MODE

Enable in `wp-config.php`:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
define( 'SCRIPT_DEBUG', true );
```

Then monitor:
```bash
tail -f /var/www/wp-content/debug.log
```

**Never leave `WP_DEBUG_DISPLAY = true` on a live site.** Errors would be shown to visitors.

---

## 10. HOW TO VERIFY ACTIVE THEME AND PLUGIN STATE VIA API

Once the health REST route is live:
```bash
# With admin credentials
curl -u admin:PASSWORD https://jus-tice.co.il/wp-json/justice-core/v1/health

# Expected response:
{
  "ok": true,
  "active_theme": "Justice Theme",
  "template": "justice-theme",
  "cpt_articles": true,
  "cpt_lawyer": true,
  "tax_areas": true
}
```

This eliminates the need for browser clicking to verify state.

---

## 11. SAFE ADMIN-ONLY REST TOOLS — SECURITY RULES

DO:
- Always check `current_user_can('manage_options')` in `permission_callback`
- Return structured JSON with clear status fields
- Log all write operations to a custom log table
- Create backups before any file operations
- Use `sanitize_*` functions on all input

DO NOT:
- Accept arbitrary PHP for execution
- Accept arbitrary SQL
- Allow anonymous write access
- Expose debug information to non-admins
- Create public endpoints that write data

```php
// CORRECT permission callback
'permission_callback' => function () {
    return current_user_can( 'manage_options' );
},

// NEVER DO THIS
'permission_callback' => '__return_true',
```

---

## 12. COMMON FATAL ERROR PATTERNS AND FIXES

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot redeclare function_name()` | Duplicate plugin loading same code | Deactivate duplicate plugin |
| `Class WP_Error not found` | Plugin loads before WordPress core | Add `if (!defined('ABSPATH')) exit;` check |
| `Allowed memory size exhausted` | Plugin doing huge query | Add `posts_per_page` limit to WP_Query |
| White screen of death | Fatal PHP error | Enable WP_DEBUG_LOG, check debug.log |
| `register_post_type() was called too early` | CPT registered before `init` hook | Wrap in `add_action('init', ...)` |
| Templates not loading | Wrong CPT slug in file name | `single-justice_lawyer.php` must match `justice_lawyer` CPT slug |
| 404 on CPT archive | Rewrite rules stale | `wp rewrite flush` |

---

## 13. WORKFLOW: PREFER CODE/API OVER BROWSER CLICKING

| Task | Browser Way (AVOID) | Code Way (USE) |
|------|---------------------|----------------|
| Check active theme | WP admin → Appearance | `wp option get template` |
| Check active plugins | WP admin → Plugins | `wp plugin list` |
| Create test content | WP admin → Posts → New | `wp post create --post_type=articles --post_title="Test"` |
| Check CPTs registered | WP admin → (guess) | `wp post-type list` |
| Flush rewrite rules | WP admin → Settings → Permalinks (save) | `wp rewrite flush` |
| Run database query | phpMyAdmin | `wp db query "SELECT..."` |
| Verify REST route | Open browser | `curl -u admin:pw URL` |
| Check debug log | SSH + cat | `tail -f /wp-content/debug.log` |
| Update option | WP admin → Settings | `wp option update option_name "value"` |
