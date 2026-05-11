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

Interpretation: the active live Justice plugin namespace is `ultra-justice-engine/v1`.

Additional interpretation: the plugin code currently active on live may not be identical to the plugin copies inside the theme Git folder, because the public REST/type surface does not show every newer repo-side LegalTech CPT expectation. Treat plugin deployment as a separate controlled track from theme Git pulls until verified in wp-admin or the plugins filesystem path.

## Repo Plugin Trees

| Folder | Plugin name | REST namespace | Function/constant prefix | Live status |
|---|---|---|---|---|
| `ultra-justice-engine/` | Ultra Justice Engine | `ultra-justice-engine/v1` | `UJE_*`, `uje_*` | VERIFIED LIVE |
| `justice-core/` | Justice Core | `justice-core/v1` | `UJE_*`, `uje_*` | NOT LIVE EXPOSED |
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

Expected current result:

- `ultra-justice-engine/v1`: VERIFIED
- `justice-core/v1`: NOT_EXPOSED
- `ultra-justice/v1`: NOT_EXPOSED
- `articles`, `justice_lawyer`, `justice_lead`: VERIFIED
- `justice_legal_tool`, `justice_legal_request`: NOT_EXPOSED in the current public type check
- Result: VERIFIED live REST surface points to `ultra-justice-engine`.

## Safety

No plugin activation, deactivation, deletion, file-manager edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made during this review.
