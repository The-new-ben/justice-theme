# uPress Deploy Handoff: Mobile Menu Stable Toggle

Date: 2026-05-27
Owner loop status: blocked at live deploy.

## What is ready

- Branch: `codex/live-homepage-conversion-release`
- Main: `main`
- Code commit: `594a1914 Fix mobile menu toggle stability`
- Expected theme version after deploy: `1.1.67`
- Expected deployment marker after deploy: `2026-05-27-mobile-menu-stable-toggle-v1`

## What changed

- The mobile menu button now records its on-screen position before opening.
- While the overlay is open, CSS uses the recorded `top`, `left`, `width`, and `height`.
- This prevents the RTL `inset-inline-end` rule from moving the close button to the opposite side of the screen.
- The competitor/homepage skill reference was updated with this anti-jump rule as a minimum design standard.

## Current live verification

Live URL checked:

`https://jus-tice.co.il/?cachebust=deploy-check-1779916081`

Result:

- HTTP status: `200`
- New marker present: `false`
- Version `1.1.67` present: `false`
- Mobile menu action component present: `true`
- `mobile_menu` WhatsApp surface present: `true`
- Old marker `2026-05-27-footer-trust-path-v1` present: `true`

Conclusion: the code is pushed to Git but not live.

## Blocker

Codex still cannot communicate with the Codex Chrome Extension. Checks show Chrome is installed and running, the Codex Chrome Extension is installed/enabled in Profile 2, and the native host manifest is correct, but the browser client still returns `Browser is not available: extension`.

## Required live step

1. Open uPress for `jus-tice.co.il`.
2. Go to Git management for `wp-content/themes/justice-theme`.
3. Run Pull Git.
4. Re-run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-deploy.ps1 -ExpectedMarker "2026-05-27-mobile-menu-stable-toggle-v1" -ExpectedVersion "1.1.67" -ExpectedComponent "primary-navigation__mobile-actions" -ExpectedWhatsAppSurface "mobile_menu" -OldMarker "2026-05-27-footer-trust-path-v1"
```

5. Run mobile browser QA at 390px width and confirm the menu button does not change horizontal position when opened.

## Honesty statement

This is code-complete and pushed, but not live. No public CMS/database settings, redirects, canonicals, noindex, sitemaps, taxonomies, customers, payments, invoices, or CRM records were changed in this pass.
