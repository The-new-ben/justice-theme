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

## 2026-05-10 Live Pull Recheck
- VERIFIED: Live homepage returned HTTP 200.
- VERIFIED: Latest repo visual layer is live: `brand-lockup--justice`, `hero__visual`, and `article-card__placeholder--legal` were found in public HTML.
- FIXED IN REPO: Wordmark direction was corrected with `direction: ltr` and `unicode-bidi: isolate` because the live RTL page displayed the fallback as `Tice dot Jus` instead of `Jus dot Tice`.
- VERIFIED: New screenshots captured at `project-control/visual-evidence/homepage-after-pull-desktop.png` and `project-control/visual-evidence/homepage-after-pull-mobile.png`.

## 2026-05-10 Header Recheck
- VERIFIED: Live homepage returned HTTP 200.
- VERIFIED: `brand-lockup--justice` is present live.
- VERIFIED: Public HTML includes `/legal-tools/` and `/lawyer-registration/` links.
- VERIFIED: Dummy logo text is not present.
- NOT VERIFIED: Admin-only content draft importer cannot be verified from public homepage HTML, as expected.

## 2026-05-10 Header Topic Strip
- FIXED IN REPO: Added a dark premium topic strip below the main header with Hebrew labels and short English target slugs for divorce, criminal, real estate, medical malpractice, family law and AI intake.
- VERIFIED: PHP lint passed locally for 120 PHP files after the header change.
- VERIFIED: Live homepage HTML contains `site-header__topic-strip`, `/divorce-lawyer/`, `/legal-tools/ai-intake/`, and `brand-lockup--justice`.
- VERIFIED: Desktop screenshot captured at `project-control/visual-evidence/homepage-topic-strip-desktop.png`.
- VERIFIED: Mobile screenshot captured at `project-control/visual-evidence/homepage-topic-strip-mobile.png`.
- VERIFIED: Red-dot Jus-Tice wordmark is visible in desktop/mobile screenshots.
- VERIFIED: Topic strip is visible in desktop/mobile screenshots.

## 2026-05-10 Lead/SEO Live Recheck
- VERIFIED: Live homepage returned HTTP 200.
- VERIFIED: Live `/lawyers/?area=family-law` returned HTTP 200.
- VERIFIED: Canonical tags are present in public HTML.
- NOT VERIFIED: Homepage public HTML did not show `admin-post.php` or `justice_submit_lead`, so the ask-lawyer form wiring from commit `e511c00` is not yet verified live.
- NOT VERIFIED: Filtered lawyer-directory URL did not show `noindex`, so the filter robots hardening from commit `e511c00` is not yet verified live.
- BLOCKED: This appears to require Upress pull/cache verification or direct WordPress theme-file inspection.

## Visual Findings
- STILL BROKEN: Header main navigation above the topic strip still feels sparse on desktop.
- FIXED: The fallback Jus-Tice logo and red dot are visible live.
- STILL BROKEN: Homepage still has very little real imagery. The repo now has a CSS visual layer, but live has not pulled it yet.
- RISK: Homepage shows many article cards with weak gray image placeholders; this still reads too basic.
- RISK: The practice-area grid is large and somewhat repetitive; it needs stronger hierarchy.
- FIXED IN REPO / NOT LIVE VERIFIED: Header/footer dummy fallback was replaced with the code wordmark and blinking red dot.
- GOOD: Maya Rotenberg appears as the only featured lawyer card on the screenshot.
- GOOD: Lead/LegalTech sections exist and the page has more business depth than a basic blog.
- GOOD: After the live pull recheck, article placeholders are visually richer and the hero has a visible legal-tech layer.
- PARTIAL FIX: Header navigation now has a visible legal-topic strip, but the full primary/mega menu is still not final.
- VERIFIED LIVE: Header fallback menu labels, topic-strip links, LegalTech/lawyer-registration links and the red-dot wordmark are present in public HTML/screenshots.

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
