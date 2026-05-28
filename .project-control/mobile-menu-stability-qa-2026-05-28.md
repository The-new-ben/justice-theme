# Mobile menu stability QA - 2026-05-28

## Scope

Internal QA for the owner-reported mobile menu problem: opening the menu from a scrolled mobile viewport made the control feel like it moved away and the drawer was not reliably usable.

## Code change verified

- The drawer open state pins `.site-header` to the viewport while the menu is open.
- The menu button stays in the visible header/close-control zone.
- The page keeps its scroll position while the drawer opens and after the drawer closes.
- Mobile parent menu items with submenus act as accordions instead of closing the drawer.
- Existing public links still close the drawer after selection.

## Browser check

Tool used: Playwright CLI via `npx --package @playwright/cli`.

Viewport: 390 x 844.

Fixture state:

- Started at `scrollY = 420`.
- Opened `.menu-toggle`.
- Verified `body.nav-is-open = true`.
- Verified `html.nav-is-open = true`.
- Verified `.primary-navigation` display changed to `block`.
- Verified `.site-header` computed position is `fixed`.
- Verified menu toggle top position stayed visible at `9px`.
- Opened a `.menu-item-has-children` parent link.
- Verified submenu stayed open and parent `aria-expanded = true`.
- Clicked a normal menu link.
- Verified drawer closed and scroll returned to `420`.

Result: PASS locally in browser fixture.

## Live status

Pushed/deploy status is separate. This file only records local QA against the theme assets. No CMS content, redirects, canonical/noindex, sitemap, taxonomy, payment provider, invoice, or public database changes were made by this QA.
