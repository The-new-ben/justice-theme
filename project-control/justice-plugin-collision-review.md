# Justice Plugin Collision Review
Date: 2026-05-11
Status: VERIFIED LOCAL / LIVE MIGRATION NOT APPROVED

## Purpose

The repo contains three Justice-related plugin trees:

- `ultra-justice-engine/`
- `justice-core/`
- `ultra-justice/`

Live REST and uPress plugin-manager checks already show that the active live plugin is `Ultra Justice Engine` version `1.0.0`. This review documents the local symbol collision risk before any attempt to activate, replace, rename or migrate Justice plugins.

## Verification

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/check-justice-plugin-collision.ps1
```

Optional strict mode:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/check-justice-plugin-collision.ps1 -FailOnCollision
```

## Local Findings

VERIFIED: `ultra-justice-engine/ultra-justice-engine.php`

- Plugin header: `Ultra Justice Engine`
- Version: `1.0.0`
- Text domain: `ultra-justice-engine`
- REST namespace: `ultra-justice-engine/v1`
- CPTs in repo scan: `articles`, `justice_lawyer`, `justice_lead`, `justice_legal_tool`, `justice_legal_request`
- Taxonomies in repo scan: `practice-areas`, `city`
- Prefixes: `UJE_*`, `uje_*`

VERIFIED: `justice-core/justice-core.php`

- Plugin header: `Justice Core`
- Version: `1.0.0`
- Text domain: `justice-core`
- REST namespace: `justice-core/v1`
- CPTs in repo scan: `articles`, `justice_lawyer`, `justice_lead`, `justice_legal_tool`, `justice_legal_request`
- Taxonomies in repo scan: `practice-areas`, `city`
- Prefixes: `UJE_*`, `uje_*`

VERIFIED: `ultra-justice/ultra-justice.php`

- Plugin header: `Ultra Justice`
- Version: `1.0.0`
- Text domain: `ultra-justice`
- REST namespace: `ultra-justice/v1`
- CPTs in repo scan: `articles`, `justice_lawyer`, `justice_lead`, `justice_legal_tool`, `justice_legal_request`
- Taxonomies in repo scan: `practice-areas`, `city`
- Prefixes: `uj_*`

## Collision Risk

VERIFIED RISK: `justice-core/` and `ultra-justice-engine/` share the same constants:

- `UJE_VERSION`
- `UJE_DIR`
- `UJE_URL`

VERIFIED RISK: `justice-core/` and `ultra-justice-engine/` share many `uje_*` function names, including activation, CPT registration, taxonomy registration, lead handling, REST route registration, reporting, seeding and metadata save functions.

This means activating `justice-core/` while `ultra-justice-engine/` is still active can cause PHP fatal redeclaration errors and/or duplicated registration behavior.

## Live Interpretation

VERIFIED LIVE from previous checks:

- Public REST exposes `ultra-justice-engine/v1`.
- Public REST does not expose `justice-core/v1`.
- Public REST does not expose `ultra-justice/v1`.
- uPress plugin manager shows `Ultra Justice Engine` version `1.0.0` active.

NOT VERIFIED:

- Exact live active plugin file path remains not directly shown by uPress plugin manager.
- The likely path is `ultra-justice-engine/ultra-justice-engine.php`, but a path-level live check still requires WP-CLI, admin active-plugin registry access, or read-only filesystem confirmation under `/wp-content/plugins/`.

## Current Decision

FIXED / DOCUMENTED DECISION:

1. Treat `Ultra Justice Engine` as the active live Justice plugin.
2. Do not activate `Justice Core` beside it.
3. Do not deactivate or delete `Ultra Justice Engine` until a controlled migration plan is approved.
4. Do not use `justice-core/` as the live target until either:
   - `justice-core/` is refactored to avoid `UJE_*` / `uje_*` collisions, or
   - `ultra-justice-engine/` is deactivated in an approved maintenance window and a rollback path is ready.
5. Keep all public content as Articles; do not use plugin migration as a reason to add new CPT complexity right now.

## Migration Gates

Before any plugin switch:

1. Backup files and database.
2. Confirm active plugin file path.
3. Compare active live plugin code to repo code.
4. Compare CPT, taxonomy, REST route and lead-handler parity.
5. Confirm existing articles, lawyer profiles and leads are unaffected.
6. Confirm no URL/permalink changes are introduced.
7. Confirm `justice_legal_tool` and `justice_legal_request` behavior intentionally.
8. Test on staging or during a maintenance window.
9. Prepare rollback: reactivate prior plugin, flush permalinks, restore backup if needed.
10. Get owner approval.

## Safety

No plugin activation, deactivation, deletion, installation, file-manager edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.
