# uPress Plugin Manager Read-Only Review
Date: 2026-05-11
Status: VERIFIED READ-ONLY / NO PLUGIN STATE CHANGED

## Purpose

Confirm live plugin status from the uPress WordPress plugin manager without activating, deactivating, deleting, installing or editing any plugin.

## What Was Checked

- uPress site panel for `jus-tice.co.il`.
- WordPress tab.
- Plugin manager dialog.
- Plugin search/filter field.

## Verified Findings

- VERIFIED: `Ultra Justice Engine` appears in the uPress plugin manager.
- VERIFIED: `Ultra Justice Engine` version is `1.0.0`.
- VERIFIED: `Ultra Justice Engine` status is active (`פעיל`).
- VERIFIED: filtering for `Justice` showed `Ultra Justice Engine`; no separate `Justice Core` row was visible in that filtered result.
- VERIFIED: `All 404 Redirect to Homepage` appears in the uPress plugin manager.
- VERIFIED: `All 404 Redirect to Homepage` version is `5.6`.
- VERIFIED: `All 404 Redirect to Homepage` status is active (`פעיל`).
- VERIFIED: the `All 404 Redirect to Homepage` plugin description says it redirects 404s to the homepage or another page using 301 redirects.

## Screenshot Evidence

- `project-control/visual-evidence/upress-plugin-manager-ultra-justice-engine-active-2026-05-11.png`
- `project-control/visual-evidence/upress-plugin-manager-all-404-active-2026-05-11.png`

## Interpretation

The uPress plugin manager confirms the public REST finding: the live Justice plugin surface is `Ultra Justice Engine`, not `Justice Core`.

The plugin manager does not expose the exact PHP file path directly. The likely active plugin folder is `ultra-justice-engine/`, but the exact active plugin file path still needs confirmation through wp-admin plugin details, filesystem inspection, WP-CLI, or a read-only admin/API registry endpoint.

## Decisions

1. Treat `Ultra Justice Engine` as the active live Justice plugin.
2. Do not activate `Justice Core` beside it.
3. Do not deactivate or delete `Ultra Justice Engine` without a migration plan.
4. Do not deactivate `All 404 Redirect to Homepage` until owner approval is explicit for that plugin-state change.
5. Keep plugin migration and 404 routing as separate controlled operations.

## Safety

No plugin was activated, deactivated, deleted, installed or edited. No file-manager write, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.
