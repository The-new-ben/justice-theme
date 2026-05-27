# Mobile Menu Stability Fix - 2026-05-28

Status: VERIFIED_SOURCE_FIX_DEPLOYMENT_BLOCKED

Scope: source-side mobile navigation stability and close behavior. No CMS/database menu item, redirect, canonical, noindex, sitemap, taxonomy, form, lead, payment, invoice, or uPress setting was changed.

## Problem

The owner reported that the mobile menu is jumpy and the open button runs away after tapping.

The source had two risk factors:

- `navigation.js` measured the hamburger button position before opening the menu and wrote dynamic CSS variables.
- `premium-pass-4.css` then moved the same button to `position: fixed` using those measured variables.

That makes the button sensitive to scrollbars, viewport changes, browser chrome changes, and mobile reflow.

## Fix

- Replaced dynamic hamburger position measuring with a stable CSS-only fixed close button location.
- Kept the close button at a fixed 44px touch target.
- Added `aria-hidden` state changes on the navigation panel.
- Added mobile menu close behavior after clicking a real navigation link.
- Kept submenu accordion behavior limited to mobile viewport checks at click time.
- Bumped runtime marker/version to `2026-05-28-mobile-menu-stability-v1` / `1.1.69`.
- Bumped `justice-premium-4` stylesheet cache version to `4.5.5`.

## Verification

Run:

```powershell
php -l functions.php
php -l inc\enqueue.php
node --check assets\js\navigation.js
rg --hidden -n "jt-menu-toggle|2026-05-28-menu-pageid-normalizer-v1|1\.1\.68" functions.php inc assets .project-control\scripts .project-control\*.md
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-revenue-readiness-gate.ps1
```

Expected:

- PHP and JS syntax pass.
- No remaining dynamic `jt-menu-toggle` variables in runtime source.
- Consolidated gate remains `partial_live_funnel_deploy_blocked` until uPress pulls the latest theme.

Actual verification on 2026-05-27T23:25Z:

- `php -l functions.php`: PASS.
- `php -l inc\enqueue.php`: PASS.
- `node --check assets\js\navigation.js`: PASS.
- Runtime source has no remaining `jt-menu-toggle` dynamic positioning variables.
- Source-only link hygiene: PASS across 112 files.
- Live deploy marker: FAIL as expected; `1.1.69` / `2026-05-28-mobile-menu-stability-v1` is not live yet.
- Consolidated gate: `pass: true`, readiness `partial_live_funnel_deploy_blocked`.

## What Remains Blocked

1. uPress Pull Git must deploy the latest theme code.
2. After deployment, live marker must show `2026-05-28-mobile-menu-stability-v1` and version `1.1.69`.
3. Live mobile browser QA is still required on a real viewport after deployment.
4. This does not prove payment, invoice, CRM routing, or lawyer/customer conversion.

## Honesty Statement

This is a source-code UX fix for the mobile menu. It is not live until deployment and it is not a revenue event by itself.
