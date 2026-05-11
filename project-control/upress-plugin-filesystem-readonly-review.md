# uPress Plugin Filesystem Read-Only Review
Date: 2026-05-11
Status: VERIFIED READ-ONLY / NO FILES OR PLUGINS CHANGED

## Purpose

Confirm the live Justice plugin filesystem path from the uPress File Manager without activating, deactivating, deleting, moving, uploading or editing any plugin file.

## What Was Checked

- uPress File Manager for `jus-tice.co.il`.
- Path: `/wp-content/plugins/`.
- Search/filter field in the file manager.
- Folder drilldown into `ultra-justice-engine/`.

## Verified Findings

- VERIFIED: `/wp-content/plugins/ultra-justice-engine/` exists in the live uPress plugin filesystem.
- VERIFIED: the folder is marked active in the uPress filesystem view.
- VERIFIED: `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists.
- VERIFIED: `/wp-content/plugins/ultra-justice-engine/includes/` exists.
- VERIFIED: `/wp-content/plugins/ultra-justice-engine/includes/` listing shows 15 visible files in uPress File Manager.
- NOT VISIBLE: `/wp-content/plugins/ultra-justice-engine/includes/cpt-legal-tools.php` did not appear in that live `includes/` listing, while the repo copy does contain `ultra-justice-engine/includes/cpt-legal-tools.php`.
- VERIFIED: filtering `/wp-content/plugins/` for `justice-core` returned 0 items.
- VERIFIED: this path-level check matches the public REST namespace `ultra-justice-engine/v1` and the uPress plugin-manager row `Ultra Justice Engine` v1.0.0.

## Screenshot Evidence

- `project-control/visual-evidence/upress-plugin-filesystem-ultra-justice-engine-active-2026-05-11.png`
- `project-control/visual-evidence/upress-plugin-filesystem-ultra-main-file-2026-05-11.png`
- `project-control/visual-evidence/upress-plugin-filesystem-no-justice-core-2026-05-11.png`
- `project-control/visual-evidence/upress-plugin-filesystem-ultra-includes-2026-05-11.png`

## Interpretation

The exact live Justice plugin path is now path-level verified as:

```text
/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php
```

`justice-core/` is present in the Git repository but was not found as a live folder under `/wp-content/plugins/` in this uPress filesystem check.

The active live `ultra-justice-engine` folder also appears older or incomplete compared with the repo plugin copy because the live visible `includes/` listing does not show `cpt-legal-tools.php`. This matches the live public REST result where LegalTech CPTs are not exposed.

## Current Decision

1. Treat `ultra-justice-engine/ultra-justice-engine.php` as the active live Justice plugin file.
2. Do not activate `justice-core/` beside it.
3. Do not rename, delete, deactivate or replace `ultra-justice-engine/` without a controlled plugin migration plan, file/database backup, parity checklist, rollback plan and owner approval.
4. Keep public legal content in the `articles` CPT during the current content architecture project.
5. Keep LegalTech CPT/public route behavior marked NOT VERIFIED LIVE until the active plugin code version is compared against the repo copy.
6. Keep any plugin replacement/update approval-gated until a byte-level live-vs-repo manifest is available.

## Safety

No plugin activation, deactivation, deletion, installation, upload, rename, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.
