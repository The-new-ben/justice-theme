# WordPress Plugin & Theme Engineering Manual
# Jus-Tice Legal Portal
# Last updated: 2026-05-09

---

## 1. Valid Plugin Structure

A WordPress plugin ZIP must be structured like this:

```
justice-core-v4.zip
└── justice-core/           ← folder name = plugin slug (NEVER justice-core-v4/)
    ├── justice-core.php    ← main plugin file (REQUIRED)
    └── includes/
        ├── cpt-articles.php
        ├── cpt-lawyers.php
        ├── cpt-leads.php
        ├── taxonomy-practice-areas.php
        ├── taxonomy-city.php
        ├── rest-health.php
        ├── rest-content-tools.php
        ├── rest-db-tools.php
        ├── admin-pages.php
        ├── security.php
        ├── logger.php
        ├── seeder.php
        └── lead-handler.php
```

### WRONG structures that cause "could not install" errors:

```
justice-core-v4.zip
└── justice-core-v4/        ← WRONG: folder name must match plugin slug
    └── justice-core/
        └── justice-core.php
```

```
justice-core-v4.zip
└── justice-core.php        ← WRONG: files must be inside a folder
```

```
justice-core-v4.zip
└── justice-core/
    └── (no justice-core.php) ← WRONG: main file missing
```

---

## 2. Valid Plugin Header

Every main plugin file must begin with this exact block:

```php
<?php
/**
 * Plugin Name: Justice Core
 * Plugin URI: https://jus-tice.co.il
 * Description: Core engine for Jus-Tice legal portal.
 * Version: 4.0.0
 * Author: Jus-Tice
 * Author URI: https://jus-tice.co.il
 * Text Domain: justice-core
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */
```

Rules:
- `Plugin Name:` must be unique across all active plugins. Two plugins with the same name will conflict.
- `Version:` must change on every update so WordPress detects it as newer.
- `Text Domain:` must match the folder name for translations.

---

## 3. Valid Theme Structure

```
justice-theme-v4.zip
└── justice-theme/          ← folder name = theme slug
    ├── style.css           ← REQUIRED — must have Theme Name header
    ├── index.php           ← REQUIRED
    ├── functions.php
    ├── header.php
    ├── footer.php
    ├── front-page.php
    ├── single.php
    ├── page.php
    ├── archive.php
    ├── search.php
    ├── 404.php
    ├── archive-articles.php
    ├── single-articles.php
    ├── archive-justice_lawyer.php
    ├── single-justice_lawyer.php
    ├── taxonomy-practice-areas.php
    ├── assets/
    │   ├── css/main.css
    │   └── js/navigation.js
    ├── inc/
    └── template-parts/
```

### WRONG theme structures:

```
justice-theme.zip
└── style.css               ← WRONG: missing justice-theme/ folder
```

```
justice-theme.zip
└── justice-theme-v4/       ← WRONG: folder must match slug exactly
    └── justice-theme/
        └── style.css
```

```
justice-theme.zip
└── justice-theme/
    ├── style.css            ← style.css present
    └── (no index.php)       ← WRONG: index.php required
```

---

## 4. Valid Theme Header (style.css)

```css
/*
Theme Name: Justice Theme
Theme URI: https://jus-tice.co.il
Author: Jus-Tice
Author URI: https://jus-tice.co.il
Description: Premium Hebrew RTL legal portal theme.
Version: 4.0.0
Requires at least: 6.4
Requires PHP: 8.0
Text Domain: justice-theme
Domain Path: /languages
Tags: rtl-language-support, accessibility-ready, custom-logo
*/
```

CRITICAL: Do NOT include `Template: some-theme` unless this is intentionally a child theme.

---

## 5. Why Previous Uploads Failed

| Attempt | Failure Cause |
|---------|---------------|
| justice-core-v3/ | Single monolith file, conflicted with active justice-core/ v2 which registers same functions |
| justice-theme-v2.zip | Correct ZIP structure, but may have had .git folder inflating size |
| Multiple zip versions | ZIP folder name didn't match expected plugin slug on server |

---

## 6. Plugin Versioning Rules

- Always increment `Version:` in the plugin header.
- The ZIP file name can be anything (justice-core-v4.zip is fine).
- The FOLDER inside the ZIP must always be `justice-core/` — not `justice-core-v4/`.
- WordPress identifies a plugin by: `folder/mainfile.php` (e.g., `justice-core/justice-core.php`).
- If a new ZIP contains the same folder name, WordPress will offer "Replace current with uploaded".
- If the folder name is different, WordPress installs it as a NEW separate plugin — causing duplicates.

---

## 7. How to Avoid Duplicate Plugins

**Rule:** The folder inside the ZIP must always be `justice-core/` — never `justice-core-v2/` or `justice-core-v3/`.

If two plugins register the same CPT (`justice_lawyer`), PHP will throw a fatal error on activation.

**Current duplicate status:**
- `justice-core/justice-core.php` — v2.0.0 — canonical, may be active
- `justice-core-v3/justice-core.php` — v3.1.0 — CONFLICT: must be deactivated and deleted

**Resolution:** Only ONE plugin may define `justice_lawyer`, `justice_lead`, `articles`, `practice-areas`, `city`.

---

## 8. Activation/Deactivation Process

### Safe activation order:
1. Deactivate the old/conflicting plugin first.
2. Upload new ZIP via `/wp-admin/update.php?action=upload-plugin`.
3. If prompted "Replace current with uploaded" → click it.
4. Click "Activate Plugin".
5. Verify via REST: `GET /wp-json/justice-core/v1/health` (requires auth).

### Safe deactivation:
- Go to `/wp-admin/plugins.php`.
- Deactivate the plugin.
- Only delete if you are certain its CPTs/data are not needed.
- Always flush permalinks after: Settings → Permalinks → Save.

---

## 9. Verification Checklist

After any plugin/theme install:

```
[ ] REST health: GET /wp-json/justice-core/v1/health returns ok: true
[ ] CPTs registered: justice_lawyer, justice_lead, articles
[ ] Taxonomies registered: practice-areas, city
[ ] /lawyers/ URL returns 200 (not 404)
[ ] /lawyers/{slug}/ URL returns 200
[ ] Admin: Lawyers menu visible at /wp-admin/
[ ] No PHP errors in /wp-admin/ (check Query Monitor or debug.log)
[ ] Active theme name matches expected theme
```

---

## 10. REST/API Access Layer

All controlled operations go through:
```
Namespace: justice-core/v1
Auth: current_user_can( 'manage_options' ) — admin only
Base URL: https://jus-tice.co.il/wp-json/justice-core/v1/
```

Available routes (v4):
- `GET /health` — system state
- `GET /theme-state` — active theme + plugins
- `GET /content/lawyers` — list lawyer posts
- `GET /content/posts` — list regular posts
- `GET /reports/spam` — find casino/gaming content
- `GET /reports/duplicates` — find duplicate titles
- `GET /reports/users` — list WP users
- `GET /db/options` — inspect wp_options (safe subset)
- `POST /content/update-meta` — update post meta (logged)

---

## 11. Database Inspection Rules

- SQL inspection: SELECT only, never UPDATE/DELETE without explicit approval.
- All writes go through WordPress APIs (update_post_meta, wp_update_post), never raw SQL.
- Every write action is logged to `justice-core-log` option in wp_options.

---

## 12. Avoiding Browser-Based Work

Browser is used ONLY for:
- Final visual verification
- Plugin/theme upload when REST not available
- Checking frontend rendering

All other work goes through:
1. Local file edits → ZIP → upload
2. REST API inspection calls
3. PowerShell/bash validation scripts
4. Linear project tracking

---

## 13. Documenting Every Change

Every change must update:
- `project-control/changelog.md` — what changed, when, why
- `project-control/current-status.md` — current verified state
- Git commit (if repo is connected)

Format:
```
## 2026-05-09 — Plugin v4.0.0
- CHANGED: Upgraded justice-core to v4.0.0
- FIXED: Archive title filter (removes "ארכיונים: Lawyers")
- ADDED: REST /reports/spam endpoint
- ADDED: REST /reports/duplicates endpoint
- VERIFIED: NOT VERIFIED — pending upload to live server
```
