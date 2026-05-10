# Visual QA Report
Date: 2026-05-09
Status: PARTIAL VISUAL QA COMPLETED.

## 2026-05-10 Third-Party Mobile CTA Check
- LIVE VERIFIED ISSUE: the remaining green lower-right mobile overlay is `a.whatsapp-button`, a fixed WhatsApp lead banner, not a chat iframe.
- VISUAL EVIDENCE BEFORE FIX: `project-control/visual-evidence/mobile-third-party-cta-before-2026-05-10.png`.
- CODE FIXED: mobile CSS now compacts the third-party WhatsApp banner into a 54x54px round icon-only button and hides its extra logo/text.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: `project-control/visual-evidence/mobile-chat-widget-css-test-final-2026-05-10.png`; computed live test size was 54x54px, bottom-right, with the WhatsApp icon visible.
- NOT LIVE VERIFIED AFTER CODE FIX: requires uPress pull/cache clear and fresh mobile homepage/article/directory screenshots.

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

## 2026-05-10 Related Content QA Gate
- CODE FIXED: article-page related content now uses semantic selection: manual URLs, same `content_cluster`, then same `practice-areas`.
- CODE FIXED: unrelated global latest-post fallback was removed from the single-article related block.
- NOT LIVE VERIFIED: after uPress pull/cache clear, recheck at least one family-law article, one criminal-law article and one real-estate article to confirm related cards are relevant and mobile layout stays stable.

## 2026-05-10 Integrated Visual QA Pass
- VERIFIED: Desktop and mobile screenshots captured for homepage, articles archive, one article, lawyer directory, sample lawyer profile URL, family practice page, search and 404 test.
- EVIDENCE JSON: `project-control/visual-evidence/integrated-visual-qa-2026-05-10.json`.
- EVIDENCE PNGS: `project-control/visual-evidence/integrated-*-2026-05-10.png`.
- LIVE VERIFIED GOOD: homepage has a strong legal portal first impression, visible red-dot Jus-Tice identity, topic strip, hero visual, guided search and lead CTA.
- LIVE VERIFIED GOOD: article and archive pages use Hebrew H1s and breadcrumbs.
- LIVE VERIFIED WEAK: `/articles/` title is still `Articles Archive | Jus-Tice.co.il`.
- LIVE VERIFIED WEAK: `/lawyers/` title is still `עורכי דין Archive | Jus-Tice.co.il`.
- LIVE VERIFIED WEAK: search title is still `You searched for גירושין | Jus-Tice.co.il`.
- CODE FIXED: `inc/seo.php` now adds contextual Hebrew titles through core and common SEO-plugin title filters; live verification pending deployment.
- LIVE VERIFIED BROKEN: sample lawyer profile Hebrew URL returns homepage-style content with status 200 and homepage canonical.
- LIVE VERIFIED BROKEN: fake 404 URL returns/finalizes as homepage with status 200.
- LIVE VERIFIED RISK: `/practice-areas/family-law/` finalizes to `http://jus-tice.co.il/family-law/`, so HTTPS/canonical consistency needs review.
- LIVE VERIFIED MOBILE RISK: WhatsApp/lead CTA and accessibility button overlap content on several mobile pages.

## 2026-05-10 Post-Upress Pull Homepage/Directory Verification

- LIVE VERIFIED: homepage now serves marker `2026-05-10-contextual-title-v1`.
- LIVE VERIFIED: homepage title is now Hebrew and portal-oriented: `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- LIVE VERIFIED: `/lawyers/` title is now `מדריך עורכי דין בישראל | Jus-Tice`; the `Archive` leak is gone.
- VISUAL VERIFIED: screenshots captured:
  - `project-control/visual-evidence/homepage-post-pull-safe-links-desktop-2026-05-10.png`
  - `project-control/visual-evidence/homepage-post-pull-safe-links-mobile-2026-05-10.png`
  - `project-control/visual-evidence/lawyers-post-pull-title-fixed-desktop-2026-05-10.png`
  - `project-control/visual-evidence/lawyers-post-pull-title-fixed-mobile-2026-05-10.png`
- LIVE VERIFIED GOOD: rendered topic strip now includes broader lawyer-intent links for real estate, medical malpractice, personal injury, labor and inheritance.
- LIVE VERIFIED FOLLOW-UP ISSUE: traffic topic link still rendered as `/traffic-law/`, which redirects to homepage.
- LIVE VERIFIED FOLLOW-UP ISSUE: LegalTech/AI intake URLs redirect to homepage.
- CODE FIXED / NOT LIVE VERIFIED: traffic fallback now points to `/lawyers/?area=traffic-law`, and LegalTech/AI links fall back to `/#ask-lawyer` until real tool pages exist.

## 2026-05-10 Follow-Up Fallback + Intake Verification

- LIVE VERIFIED: topic strip traffic link now renders as `/lawyers/?area=traffic-law`.
- LIVE VERIFIED: topic strip AI/intake link now renders as `/#ask-lawyer`.
- LIVE VERIFIED: homepage ask-lawyer form now shows email, legal area, city/region and urgency fields.
- LIVE VERIFIED: old hidden `general` area and `normal` urgency values are gone from the public form.
- LIVE VERIFIED: source keyword is now neutral portal language.
- VISUAL VERIFIED: screenshots captured:
  - `project-control/visual-evidence/ask-lawyer-enriched-desktop-2026-05-10.png`
  - `project-control/visual-evidence/ask-lawyer-enriched-mobile-2026-05-10.png`
- NOT VERIFIED: actual CRM lead record creation still requires a controlled test with wp-admin/CRM review.

## 2026-05-10 Mobile Floating Action Fix

- LIVE VERIFIED BEFORE FIX: mobile homepage screenshot shows the Pojo accessibility tab sitting across the hero area and the theme WhatsApp button competing with the lower mobile lead/chat CTA.
- VISUAL EVIDENCE BEFORE FIX: `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`.
- CODE FIXED: `.whatsapp-float` is smaller on mobile, raised above the bottom CTA zone, and given a lower z-index than before.
- CODE FIXED: mobile body gets bottom safe-space padding so fixed controls are less likely to cover footer/form content.
- CODE FIXED: `#pojo-a11y-toolbar` gets a mobile top-side position and constrained overlay height instead of floating across the middle of content.
- VERIFIED: `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache refresh and fresh mobile screenshots after deployment.

## 2026-05-10 Branding Pull Verification

- LIVE VERIFIED: homepage now serves marker `2026-05-10-branding-v1`.
- LIVE VERIFIED: theme fallback icon assets return HTTP 200.
- LIVE VERIFIED: WordPress/media/plugin icon tags remain active, and theme fallback tags are not duplicated while the WordPress Site Icon exists.
- VISUAL VERIFIED: screenshots captured:
  - `project-control/visual-evidence/homepage-branding-post-pull-desktop-2026-05-10.png`
  - `project-control/visual-evidence/homepage-branding-post-pull-mobile-2026-05-10.png`
- VISUAL VERIFIED GOOD: header logo remains visible and slightly more compact on mobile and desktop.
- VISUAL VERIFIED PARTIAL: theme WhatsApp float is smaller/raised after the pull.
- STILL LOOKS BAD: third-party green chat/lead bubble still overlaps lower mobile hero cards and should be handled in the next UX pass.
- NOT VERIFIED: wp-admin Site Icon/Custom Logo selected media items and Google search-result favicon refresh.
