# Live mobile menu post-restart QA - 2026-06-06

## Purpose

Record the live deployment recovery after the owner restarted the PC and requested continued execution toward Jus-Tice goals.

## Active goal

Restore confidence that the public mobile menu is usable and revenue-safe before continuing homepage, lead, CRM, and payment work.

## What changed

- Confirmed the previously pushed mobile menu lock fix is now live.
- Found a second mobile issue: the Pojo accessibility toolbar sat above the open mobile menu and overlapped a navigation row.
- Added a scoped CSS fix so the accessibility toolbar drops behind the menu while `nav-is-open` is active.
- Bumped the theme version and deployment marker.
- Updated deployment checkers to verify both:
  - `assets/js/navigation.js` contains the scroll/menu lock token.
  - `assets/css/premium-pass-4.css` contains the accessibility-toolbar layering token.

## Commits

- `c445e950` - `Keep accessibility toolbar behind mobile menu`
- `26df7944` - `Strengthen mobile menu toolbar layering`

## uPress deployment

uPress Git management was opened for:

`/wp-content/themes/justice-theme`

Pull Git was run after each pushed runtime change. uPress reported:

`משיכת נתונים (Pull) הושלמה בהצלחה`

## Live deployment verification

Checker:

`C:/Users/janana/jutice-theme/.project-control/scripts/check-live-theme-deployment-marker.ps1`

Latest live result:

- Expected GitHub/live commit: `26df7944cd92e8127e6c8d770452e35b08e74df6`
- Expected marker: `2026-06-06-mobile-menu-a11y-overlay-clearance-v2`
- Marker URL status: `200`
- Navigation JS status: `200`
- Premium CSS status: `200`
- `markerHasExpected`: `true`
- `navigationHasExpected`: `true`
- `navigationHasHtmlLock`: `true`
- `cssHasExpected`: `true`
- `liveDeploymentMatchesCode`: `true`

Secondary checker:

`C:/Users/janana/jutice-theme/.project-control/scripts/check-upress-git-state-mismatch.ps1`

Latest classification:

`LIVE_MATCHES_EXPECTED`

## Mobile browser QA

Target:

`https://jus-tice.co.il/?codex_live_menu_qa=20260606_after_a11y_v2`

Viewport:

`390 x 844`

Result:

- `pass`: `true`
- Menu toggle before open: `x=221.921875`, `y=18.09375`, `width=44`, `height=44`
- Menu toggle after open: `x=221.921875`, `y=18.09375`, `width=44`, `height=44`
- Movement: `dx=0`, `dy=0`
- `aria-expanded`: `true`
- Menu overlay: `x=0`, `y=0`, `width=390`, `height=844`, `z-index=220`
- Accessibility toolbar after fix: `z-index=1`, `pointer-events=none`

Evidence screenshot:

`C:/Users/janana/jutice-theme/.project-control/visual-evidence/live-mobile-menu-a11y-clearance-v2-2026-06-06.png`

## What is live

- The mobile menu no longer jumps away in the tested mobile viewport.
- The close/toggle button stays stable at the same coordinates.
- The menu fills the mobile viewport.
- The accessibility toolbar no longer blocks the visible menu while the drawer is open.

## What was not changed

No CMS/database content, redirects, canonicals, noindex, sitemap, taxonomy, payment settings, invoices, leads, WhatsApp messages, or content migrations were changed.

## Remaining blockers

- Grow/Meshulam/payment proof remains unresolved.
- Full homepage rebuild from competitor/external-AI packet remains not started as a public implementation.
- CRM-to-billing smoke test remains incomplete.
- External AI review packet has not yet been manually run through Lovable, ChatGPT, Gemini, or Claude.

## Readiness impact

Estimated readiness to profit improves from about `72%` to about `76%`.

Reason: a sitewide mobile conversion blocker is now deployed and verified live. Payment and full lead-to-invoice proof still block revenue claims.

## Honesty statement

This cycle produced a live code improvement and verified it. It did not create paid revenue, did not complete the payment path, did not rebuild the homepage, and did not publish or migrate CMS content.
