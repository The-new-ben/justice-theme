# Live Plugin Architecture Review
Date: 2026-05-11
Status: VERIFIED LIVE / MIGRATION NOT APPROVED

## Purpose

The repo currently contains multiple Justice plugin trees. Before any content, URL, lawyer, lead or CMS migration work continues, the team needs to know which plugin surface is actually active on the live site.

## Live Evidence

Public REST checks on `https://jus-tice.co.il/wp-json/` show:

- VERIFIED: `ultra-justice-engine/v1` is listed in live REST namespaces.
- VERIFIED: `https://jus-tice.co.il/wp-json/ultra-justice-engine/v1` returns HTTP 200.
- VERIFIED: `https://jus-tice.co.il/wp-json/ultra-justice-engine/v1/health` exists but requires authentication, returning HTTP 401 when unauthenticated.
- VERIFIED: `https://jus-tice.co.il/wp-json/justice-core/v1` returns HTTP 404.
- VERIFIED: `https://jus-tice.co.il/wp-json/ultra-justice/v1` returns HTTP 404.
- VERIFIED: `wp/v2/types` exposes core live CPTs `articles`, `justice_lawyer` and `justice_lead`.
- NOT VERIFIED LIVE: `justice_legal_tool` and `justice_legal_request` are not exposed in `wp/v2/types` in the current public check.
- VERIFIED RISK: legacy CPTs remain exposed, including `labor_law`, `small_claims`, `corona_virus`, `supreme_court`, `tort`, `goverment-gazette` and `yada_wiki`.

uPress plugin manager read-only check shows:

- VERIFIED: `Ultra Justice Engine` version `1.0.0` is active (`פעיל`).
- VERIFIED: filtering for `Justice` showed `Ultra Justice Engine`; no separate `Justice Core` row was visible in that filtered result.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-ultra-justice-engine-active-2026-05-11.png`.

Interpretation: the active live Justice plugin namespace is `ultra-justice-engine/v1`.

Additional interpretation: the plugin code currently active on live may not be identical to the plugin copies inside the theme Git folder, because the public REST/type surface does not show every newer repo-side LegalTech CPT expectation. Treat plugin deployment as a separate controlled track from theme Git pulls until verified in wp-admin or the plugins filesystem path.

uPress File Manager read-only filesystem check adds:

- VERIFIED LIVE PATH: `/wp-content/plugins/ultra-justice-engine/` exists.
- VERIFIED LIVE PATH: `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists.
- VERIFIED LIVE PATH: `/wp-content/plugins/ultra-justice-engine/includes/` exists.
- VERIFIED LIVE ABSENCE: filtering `/wp-content/plugins/` for `justice-core` returned 0 items.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-justice-engine-active-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-main-file-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-no-justice-core-2026-05-11.png`.
- DOCUMENTED: `project-control/upress-plugin-filesystem-readonly-review.md`.

The exact live Justice plugin path is now VERIFIED for the current live state:

```text
/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php
```

Live-visible code parity review adds:

- PARTIAL VERIFIED: `project-control/ultra-justice-engine-repo-manifest.csv` records 17 local repo files and SHA-256 hashes.
- PARTIAL VERIFIED: `project-control/ultra-justice-engine-live-visible-manifest.csv` records the active live plugin files visible through uPress File Manager.
- VERIFIED PARITY GAP: repo `ultra-justice-engine/includes/cpt-legal-tools.php` exists, but `/wp-content/plugins/ultra-justice-engine/includes/cpt-legal-tools.php` was NOT VISIBLE in the live active plugin `includes/` listing.
- EXPLAINED: the missing visible LegalTech CPT file matches the public REST result where `justice_legal_tool` and `justice_legal_request` are NOT_EXPOSED.
- BLOCKED: byte-level live file hashes are not available from this session because uPress File Manager downloads are unsupported in Codex in-app browser and SSH/WP-CLI/file API access is unavailable.
- DOCUMENTED: `project-control/live-plugin-code-parity-review.md`.

Local repo path/collision scan now adds:

- VERIFIED LOCAL: `ultra-justice-engine/ultra-justice-engine.php` has plugin header `Ultra Justice Engine`, version `1.0.0`, text domain `ultra-justice-engine`.
- VERIFIED LOCAL: `justice-core/justice-core.php` has plugin header `Justice Core`, version `1.0.0`, text domain `justice-core`.
- VERIFIED LOCAL: `ultra-justice/ultra-justice.php` has plugin header `Ultra Justice`, version `1.0.0`, text domain `ultra-justice`.
- VERIFIED LOCAL RISK: `justice-core/` and `ultra-justice-engine/` both define `UJE_VERSION`, `UJE_DIR`, `UJE_URL` and many `uje_*` functions.
- DOCUMENTED: `project-control/justice-plugin-collision-review.md`.
- TOOLING: `tools/check-justice-plugin-collision.ps1`.

## Repo Plugin Trees

| Folder | Plugin name | REST namespace | Function/constant prefix | Live status |
|---|---|---|---|---|
| `ultra-justice-engine/` | Ultra Justice Engine | `ultra-justice-engine/v1` | `UJE_*`, `uje_*` | VERIFIED LIVE PATH |
| `justice-core/` | Justice Core | `justice-core/v1` | `UJE_*`, `uje_*` | NOT LIVE EXPOSED / NOT FOUND IN LIVE PLUGINS FOLDER |
| `ultra-justice/` | Ultra Justice | `ultra-justice/v1` | `uj_*` | NOT LIVE EXPOSED |

## Key Risk

`justice-core/` and `ultra-justice-engine/` both define `UJE_VERSION`, `UJE_DIR`, `UJE_URL` and many `uje_*` functions. They must not be active together.

Activating `justice-core/` while `ultra-justice-engine/` is active could create PHP fatal errors or duplicated CPT/taxonomy/REST registration behavior.

## Decision For Now

Do not switch live plugins casually.

Current safe operating decision:

1. Treat `ultra-justice-engine/` as the active live plugin.
2. Keep safety-critical plugin changes mirrored into `ultra-justice-engine/` whenever plugin code is touched.
3. Keep `justice-core/` as a future target only after a controlled migration plan.
4. Do not activate `justice-core/` until `ultra-justice-engine/` has been deactivated in a maintenance window.
5. Do not delete any plugin folder before backup and owner approval.
6. Treat LegalTech CPT availability as NOT VERIFIED LIVE until wp-admin/plugin-path inspection confirms the active plugin code version.
7. Treat exact active plugin file path as VERIFIED for the current uPress filesystem state: `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php`.
8. Treat LegalTech CPT registration as NOT LIVE PARITY until the live plugin code is byte-compared or intentionally updated through an approved plugin deployment plan.

## Controlled Migration Plan Required

Before replacing `ultra-justice-engine/` with `justice-core/`, create and approve a migration plan covering:

1. Full file backup.
2. WordPress database backup.
3. Plugin parity diff.
4. CPT parity: `articles`, `justice_lawyer`, `justice_lead`, `justice_legal_tool`, `justice_legal_request`.
5. Taxonomy parity: `practice-areas`, `city`.
6. REST route parity.
7. Lead form submission parity.
8. Lawyer directory and single lawyer profile rendering.
9. Article archive and single article rendering.
10. Draft importer/admin tooling.
11. Seeder gates and write-gate filters.
12. Permalink flush plan.
13. Rollback plan.
14. Owner approval.

## Verification Command

Use:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/check-live-plugin-surface.ps1
```

For local repo collision review, use:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/check-justice-plugin-collision.ps1
```

Use `-FailOnCollision` when a non-zero exit should be raised for duplicate symbols.

Expected current result:

- `ultra-justice-engine/v1`: VERIFIED
- `justice-core/v1`: NOT_EXPOSED
- `ultra-justice/v1`: NOT_EXPOSED
- `articles`, `justice_lawyer`, `justice_lead`: VERIFIED
- `justice_legal_tool`, `justice_legal_request`: NOT_EXPOSED in the current public type check
- Result: VERIFIED live REST surface points to `ultra-justice-engine`.

## Safety

No plugin activation, deactivation, deletion, file-manager edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made during this review.
