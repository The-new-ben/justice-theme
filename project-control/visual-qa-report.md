# Visual QA Report
Date: 2026-05-09
Status: PARTIAL VISUAL QA COMPLETED.

## 2026-05-09 Live Homepage Screenshot Check
- VERIFIED: Live homepage returned HTTP 200.
- VERIFIED: Desktop screenshot captured locally at `project-control/visual-evidence/homepage-desktop.png`.
- VERIFIED: Mobile screenshot captured locally at `project-control/visual-evidence/homepage-mobile.png`.
- VERIFIED: The live homepage is not showing the latest `brand-lockup--justice` code wordmark yet.
- NOT VERIFIED: Upress/GitHub pull status.
- BLOCKED: Authenticated Upress pull could not be completed through the public web fetch context.

## Visual Findings
- STILL BROKEN: Header still looks too thin for a premium legal portal.
- STILL BROKEN: The logo appears too small and does not show the new blinking red dot fallback yet, indicating the live site likely has not pulled the latest commit or cache is stale.
- STILL BROKEN: Homepage still has very little real imagery. The repo now has a CSS visual layer, but live has not pulled it yet.
- RISK: Homepage shows many article cards with weak gray image placeholders; this still reads too basic.
- RISK: The practice-area grid is large and somewhat repetitive; it needs stronger hierarchy.
- FIXED IN REPO / NOT LIVE VERIFIED: Header/footer dummy fallback was replaced with the code wordmark and blinking red dot.
- GOOD: Maya Rotenberg appears as the only featured lawyer card on the screenshot.
- GOOD: Lead/LegalTech sections exist and the page has more business depth than a basic blog.

## Public HTML Checks
- VERIFIED: homepage loads.
- VERIFIED: `/lawyers/` loads.
- VERIFIED: `/articles/` was requested but full visual review not completed.

## Issues From Text Extract
- Homepage header/menu appears thin in text extraction: contact/about only visible near top.
- Homepage has many noisy practice-area terms.
- "Content is protected !!" appears in public HTML.
- Lawyer directory displays city slugs.

## Required Visual QA Pages
- Homepage
- `/lawyers/`
- single lawyer profile
- `/articles/`
- single article
- practice-area page
- search page
- 404 page

## Next
- Run desktop and mobile browser QA after repo changes are ready.
