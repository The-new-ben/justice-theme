# Live Plugin Code Parity Review
Date: 2026-05-11
Status: PARTIAL VERIFIED / BYTE-LEVEL PARITY BLOCKED

## Purpose

Compare the active live `Ultra Justice Engine` plugin surface with the repo copy before any LegalTech, REST, CPT, lead, lawyer or `justice-core` migration decision.

This is a read-only review. It does not activate, deactivate, upload, edit, delete, rename, compress or replace any plugin file.

## Live Plugin Path

VERIFIED LIVE PATH:

```text
/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php
```

Supporting review:

- `project-control/upress-plugin-filesystem-readonly-review.md`
- `project-control/visual-evidence/upress-plugin-filesystem-ultra-justice-engine-active-2026-05-11.png`
- `project-control/visual-evidence/upress-plugin-filesystem-ultra-main-file-2026-05-11.png`

## Repo Manifest

VERIFIED LOCAL: the repo copy of `ultra-justice-engine/` currently contains 17 files / 80,392 bytes.

VERIFIED LOCAL: the repo `includes/` directory currently contains 16 files / 77,046 bytes.

Generated manifest:

- `project-control/ultra-justice-engine-repo-manifest.csv`

Generator:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-plugin-manifest.ps1 -PluginPath ultra-justice-engine -OutputPath project-control/ultra-justice-engine-repo-manifest.csv
```

Key repo files include:

- `ultra-justice-engine/ultra-justice-engine.php`
- `ultra-justice-engine/includes/cpt-articles.php`
- `ultra-justice-engine/includes/cpt-lawyers.php`
- `ultra-justice-engine/includes/cpt-legal-tools.php`
- `ultra-justice-engine/includes/lead-submissions.php`
- `ultra-justice-engine/includes/rest-content-tools.php`
- `ultra-justice-engine/includes/rest-health.php`
- `ultra-justice-engine/includes/seeder.php`
- `ultra-justice-engine/includes/taxonomy-city.php`
- `ultra-justice-engine/includes/taxonomy-practice-areas.php`

## Live Visible Manifest

PARTIAL VERIFIED: uPress File Manager visibly lists the active live plugin root and `includes/` folder.

VERIFIED LIVE VISIBLE: the live active `includes/` listing shows 15 files.

Recorded live-visible manifest:

- `project-control/ultra-justice-engine-live-visible-manifest.csv`

Screenshot evidence:

- `project-control/visual-evidence/upress-plugin-filesystem-ultra-includes-2026-05-11.png`

## Key Difference Found

FIXED / EXPLAINED: the repo copy has:

```text
ultra-justice-engine/includes/cpt-legal-tools.php
```

NOT VERIFIED LIVE / NOT VISIBLE: the live uPress File Manager `includes/` listing did not show:

```text
/wp-content/plugins/ultra-justice-engine/includes/cpt-legal-tools.php
```

This aligns with the public REST check:

- `justice_legal_tool`: NOT_EXPOSED in public `wp/v2/types`
- `justice_legal_request`: NOT_EXPOSED in public `wp/v2/types`

Interpretation: the active live plugin appears older or incomplete compared with the repo copy for LegalTech CPT registration. Do not assume LegalTech CPT parity from theme Git pulls.

## What Is Verified

- VERIFIED LIVE: active plugin folder is `ultra-justice-engine`.
- VERIFIED LIVE: active plugin main file exists.
- VERIFIED LIVE: `includes/` exists.
- VERIFIED LIVE: the live `includes/` listing shows 15 files.
- VERIFIED LOCAL: the repo `includes/` directory has 16 files.
- VERIFIED LOCAL: the repo extra file is `includes/cpt-legal-tools.php`.
- VERIFIED LIVE: public REST exposes `ultra-justice-engine/v1`.
- VERIFIED LIVE: public REST does not expose `justice-core/v1` or `ultra-justice/v1`.
- VERIFIED LIVE: LegalTech CPTs are not exposed in public `wp/v2/types`.

## Verification Run

2026-05-11 08:45 Asia/Jerusalem:

- VERIFIED: `tools/build-plugin-manifest.ps1` generated `project-control/ultra-justice-engine-repo-manifest.csv` with 17 rows.
- VERIFIED: `project-control/ultra-justice-engine-live-visible-manifest.csv` parses as CSV with 19 rows.
- VERIFIED: `project-control/task-board.csv` parses and includes `T237`.
- VERIFIED: `tools/check-live-plugin-surface.ps1` still reports live REST `ultra-justice-engine/v1` as the active Justice namespace and LegalTech CPTs as NOT_EXPOSED.
- VERIFIED REVIEW: `tools/check-justice-plugin-collision.ps1` still reports duplicate `UJE_*` constants and many `uje_*` functions between `justice-core/` and `ultra-justice-engine/`.
- VERIFIED: screenshot file exists at `project-control/visual-evidence/upress-plugin-filesystem-ultra-includes-2026-05-11.png`.
- VERIFIED WITH WARNINGS: `git diff --check` returned only Windows LF-to-CRLF warnings, no whitespace errors.

## What Is Not Verified

- BLOCKED: byte-level live-vs-repo hash comparison.
- BLOCKED: exact live file contents.
- BLOCKED: whether all shared filenames are identical or older variants.
- BLOCKED: whether live plugin code differs only by `cpt-legal-tools.php` or by additional content changes inside shared files.

Reason: Codex in-app browser cannot download files from uPress File Manager, and SSH/WP-CLI/database/file API access is not available in this session.

## Safe Next Options

Preferred next verification routes:

1. SSH/WP-CLI read-only manifest:
   ```bash
   cd /path/to/wp-content/plugins/ultra-justice-engine
   find . -type f -print0 | sort -z | xargs -0 sha256sum
   ```
2. uPress file download/export if the owner downloads the plugin folder or enables a safe file export.
3. CODE FIXED: read-only admin diagnostic endpoint, gated to `manage_options`, returning active plugin file manifest and hashes:
   ```text
   GET /wp-json/justice-theme/v1/active-plugin-manifest?plugin=ultra-justice-engine/ultra-justice-engine.php
   ```
   Supporting review: `project-control/plugin-manifest-diagnostic-review.md`.

## Migration Decision

Do not migrate from `ultra-justice-engine` to `justice-core` yet.

Do not copy the repo plugin into live yet.

Before any plugin update or replacement:

1. Back up live files and database.
2. Get a live plugin hash manifest.
3. Compare live vs repo.
4. Confirm LegalTech CPTs should be activated.
5. Confirm REST write gates are present.
6. Confirm seed gates are present.
7. Confirm lead submission behavior.
8. Confirm lawyer/profile behavior.
9. Plan rollback.
10. Get owner approval.

## Safety

No plugin activation, deactivation, deletion, installation, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.
