# uPress Deploy Handoff: Mobile Menu Stability + Link Hygiene

Date: 2026-05-28
Owner loop status: BLOCKED at live deploy.

## What Is Ready

- Branch: `codex/live-homepage-conversion-release`
- Main: `main`
- Latest pushed commit: `e7a879fe Add live mobile menu browser QA`
- Runtime fix commit: `bb831696 Stabilize mobile menu toggle`
- Source stability gate commit: `99bcb3a9 Add mobile menu stability gate`
- Expected theme version after deploy: `1.1.69`
- Expected deployment marker after deploy: `2026-05-28-mobile-menu-stability-v1`

## What Changed

- The mobile menu no longer measures the hamburger position with JavaScript.
- The open-state close button now uses a stable CSS-only 44px touch target with safe-area-aware placement.
- Desktop navigation accessibility is preserved; `aria-hidden` is only used for mobile panel state.
- The menu closes after a visitor taps a real navigation link.
- The mobile menu source gate now blocks readiness if dynamic hamburger positioning or missing mobile revenue actions return.
- Live browser QA was added to open the public homepage at 390x844, tap the menu, verify WhatsApp/lawyer-plan actions, verify link hygiene, and save screenshot evidence.

## Current Live Verification

Checked at: 2026-05-27T23:52Z

Live URL checked through `.project-control/scripts/check-live-deploy.ps1`.

Result:

- HTTP status: `200`
- Expected marker `2026-05-28-mobile-menu-stability-v1` present: `false`
- Expected version `1.1.69` present: `false`
- Mobile menu action component present: `true`
- `mobile_menu` WhatsApp surface present: `true`
- Old marker `2026-05-27-footer-trust-path-v1` still present: `true`
- Live ready: `false`

Conclusion: latest code is pushed to Git but not live.

## Live Browser QA Evidence

Latest browser QA commit: `e7a879fe`

Evidence screenshot:

- `output/playwright/live-mobile-menu-open-1779925434.png`

Current live browser QA result before deployment:

- Menu opens: PASS.
- Mobile WhatsApp action visible: PASS.
- Lawyer-plan action visible: PASS.
- Close button inside viewport: PASS.
- Expected marker/version: FAIL until uPress Pull Git.
- No legacy `page_id` in menu: FAIL until uPress Pull Git.

## Required Live Step

1. Open uPress for `jus-tice.co.il`.
2. Go to Git management for `wp-content/themes/justice-theme`.
3. Run Pull Git.
4. Re-run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-deploy.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-link-hygiene.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-mobile-menu-browser-qa.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-revenue-readiness-gate.ps1
```

Expected after successful deploy:

- `check-live-deploy.ps1`: `liveReady=true`.
- `check-live-link-hygiene.ps1`: `pass=true`.
- `check-live-mobile-menu-browser-qa.ps1`: `pass=true`.
- Consolidated readiness moves beyond `partial_live_funnel_deploy_blocked` unless another live blocker appears.

## Blocker

Codex still cannot perform the authenticated uPress Pull Git action from this session. Chrome is installed and running, the Codex Chrome Extension is installed/enabled in Profile 2, and the native host manifest is correct, but there is no callable Chrome/uPress browser-control API exposed here.

## Honesty Statement

This handoff is code-complete and pushed, but not live. No public CMS/database settings, redirects, canonicals, noindex, sitemaps, taxonomies, customers, payments, invoices, WhatsApp messages, or CRM records were changed.
