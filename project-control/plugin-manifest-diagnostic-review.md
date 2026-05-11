# Plugin Manifest Diagnostic Review
Date: 2026-05-11
Status: LIVE VERIFIED PUBLIC PROTECTION / ADMIN EXPORT PENDING

## Purpose

The active live plugin path is verified, but byte-level live-vs-repo parity is still blocked. uPress File Manager lets us see filenames, but the Codex in-app browser cannot download plugin files and no SSH/WP-CLI access is available in this session.

This diagnostic route provides a controlled read-only way for an administrator to request a file manifest for an active plugin.

## Route

```text
GET /wp-json/justice-theme/v1/active-plugin-manifest
```

Optional query parameter:

```text
plugin=ultra-justice-engine/ultra-justice-engine.php
```

Default plugin:

```text
ultra-justice-engine/ultra-justice-engine.php
```

## Security Model

- VERIFIED IN CODE: route is read-only.
- VERIFIED IN CODE: route requires `manage_options`.
- VERIFIED IN CODE: route only accepts plugins currently listed in WordPress active plugins.
- VERIFIED IN CODE: route constrains file reading to the active plugin directory under `WP_PLUGIN_DIR`.
- VERIFIED IN CODE: route returns metadata and SHA-256 hashes only; it does not return file contents.
- VERIFIED IN CODE: route calls `nocache_headers()`.

## Output

The route returns:

- `ok`
- `generated_at`
- `plugin`
- `plugin_directory`
- `file_count`
- `total_bytes`
- `files`

Each file row returns:

- `path`
- `bytes`
- `sha256`
- `last_modified`

## Verification

Local:

- VERIFIED: PHP lint passed for 128 files.
- VERIFIED: `git diff --check` returned only Windows LF-to-CRLF warnings.

Live after deployment:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/check-plugin-manifest-diagnostic.ps1
```

Expected public unauthenticated result:

```text
HTTP 401 or 403
RESULT: VERIFIED - diagnostic route is protected from public unauthenticated access.
```

VERIFIED LIVE:

- uPress Git log shows top commit `8111d12`.
- Static marker returns `2026-05-11-plugin-manifest-diagnostic-v1`.
- Public unauthenticated route check returned HTTP 401.

Admin-authenticated result:

- Use an authenticated WordPress admin session or application-password flow.
- Export the JSON response.
- Convert `files` into a CSV.
- Compare against `project-control/ultra-justice-engine-repo-manifest.csv`.

Status: BLOCKED until an authenticated WordPress admin request is available in this session.

## Important Limitation

This route is part of the theme. Pulling the theme does not update the active plugin code under:

```text
/wp-content/plugins/ultra-justice-engine/
```

It only lets an administrator inspect the active plugin files safely.

## Safety

No plugin activation, deactivation, deletion, installation, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change is performed by this route.
