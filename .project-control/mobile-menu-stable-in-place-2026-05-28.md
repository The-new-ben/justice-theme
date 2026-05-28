# Mobile Menu Stable-In-Place Fix

Date: 2026-05-28
Status: LIVE_DEPLOYED

## Owner Issue

The owner reported that the mobile menu button still jumps/runs away after opening and is not usable enough.

## Live Baseline Evidence

Read-only live browser QA against `https://jus-tice.co.il/` passed the older gate but exposed the actual usability problem:

- Expected live marker was present: `2026-05-28-first-paid-lawyer-proof-packet-v1`
- Expected live version was present: `1.1.84`
- Menu opened and mobile revenue actions were visible.
- Before opening, the button box was approximately `x=221.9, y=18.1, width=44, height=44`.
- After opening, the button box moved to approximately `x=16, y=12, width=44, height=44`.
- Evidence screenshot: `output/playwright/live-mobile-menu-open-1779943411.png`.
- Tightened QA rerun against the current live release failed as expected:
  - `close_button_horizontal_stable=false`.
  - `menu_survives_mobile_resize=false`.
  - Evidence screenshot: `output/playwright/live-mobile-menu-open-1779943515.png`.

Conclusion: the old QA standard was too weak because it only checked that the close target stayed inside the viewport, not that it stayed where the user tapped.

## Code Change

- `assets/css/premium-pass-4.css`
  - Removed fixed viewport-edge positioning from `body.nav-is-open .menu-toggle`.
  - The open/close target keeps the same 44px size and visual open state without moving to the opposite edge.
- `assets/js/navigation.js`
  - The menu no longer closes on ordinary mobile viewport resize.
  - It still closes when the viewport crosses out of mobile layout.
- `functions.php`
  - Theme version bumped to `1.1.85`.
  - Deployment marker set to `2026-05-28-mobile-menu-stable-in-place-v1`.
- `inc/enqueue.php`
  - Premium CSS cache version bumped to `4.5.10`.

## Gate Change

- `.project-control/scripts/check-mobile-menu-stability.ps1`
  - Now blocks `body.nav-is-open .menu-toggle { position: fixed; }`.
  - Requires mobile resize to preserve an open mobile menu.
- `.project-control/scripts/check-live-mobile-menu-browser-qa.ps1`
  - Now checks horizontal and vertical button stability after opening.
  - Now checks that a mobile viewport-height change does not close the open menu.
- `.project-control/scripts/check-live-deploy.ps1`
  - Updated to the new marker/version for post-uPress verification.

## Verification

Local/source verification passed:

- `powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-mobile-menu-stability.ps1`
- `node --check assets\js\navigation.js`
- `php -l functions.php`
- `php -l inc\enqueue.php`
- `git diff --check`

Live verification passed after uPress Pull Git:

- uPress Git log shows `378081fe Keep mobile menu toggle in place` as `HEAD -> main`.
- `.project-control\scripts\check-live-deploy.ps1` returned `liveReady=true`.
- Live marker present: `2026-05-28-mobile-menu-stable-in-place-v1`.
- Live theme version present: `1.1.85`.
- `.project-control\scripts\check-live-mobile-menu-browser-qa.ps1` returned `pass=true`.
- Live open-menu button before box: `x=221.921875, y=18.09375, width=44, height=44`.
- Live open-menu button after box: `x=221.921875, y=18.09375, width=44, height=44`.
- Live menu survived mobile viewport-height resize: `expandedAfterMobileResize=true`, `navVisibleAfterMobileResize=true`.
- Live evidence screenshot: `output/playwright/live-mobile-menu-open-1779943682.png`.

## Safety

No CMS/database content, public page body, redirect, canonical, noindex, sitemap, taxonomy, lead, CRM record, WhatsApp message, invoice, payment, or provider setting was changed.

## Remaining Work

- No further deployment action is needed for this specific mobile-menu stability fix.
- Continue broader homepage premium redesign and content/CMS work under the approved anti-cannibalization process.
- Real revenue proof remains blocked until a real paid lawyer/payment/invoice proof exists.
