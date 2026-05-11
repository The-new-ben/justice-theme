# Visual QA Report
Date: 2026-05-09
Status: PARTIAL VISUAL QA COMPLETED.

## 2026-05-11 Lawyer Directory Filter Alias QA
- CODE FIXED / NOT LIVE VERIFIED: clean public filter aliases now map to the existing seeded taxonomy slugs in `archive-justice_lawyer.php`.
- WHY IT MATTERS: homepage/header links such as `/lawyers/?area=personal-injury-law` and `/lawyers/?area=medical-malpractice-law` should not lead to empty directory states if the underlying term is still `torts` or `medical-malpractice`.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, `/lawyers/?area=labor-law`, and `/lawyers/?area=employment-law` show the intended Hebrew title/filter chip and no broken layout.

## 2026-05-11 Search And 404 Visual Polish
- CODE FIXED: shared legal search form styling was upgraded in `assets/css/main.css` for desktop/mobile, including card chrome, focus states, and full-width mobile buttons.
- CODE FIXED: search headers now keep query text readable and accent-highlighted without layout breakage.
- CODE FIXED: no-results and 404 states now render as polished customer-facing cards; `404.php` inline styles were replaced with reusable classes.
- NOT LIVE VERIFIED: requires uPress pull/cache clear, then desktop/mobile screenshots for a normal search, a no-results search, and a real 404 route.

## 2026-05-11 Related Content Live QA
- LIVE VERIFIED: sampled public article pages render related content in semantic mode.
- VERIFIED: public sampled bodies did not show internal markers such as `NOT VERIFIED`, source-audit labels or developer/owner notes.
- EVIDENCE: `project-control/visual-evidence/related-content-live-qa-2026-05-11.json` and `related-content-*-2026-05-11.png`.
- PARTIAL QUALITY: general and criminal article samples still show off-intent related cards (`ai-for-law-firms`, `business-license`, `australia-lawyers`). The real-estate sample includes a weak Cyprus pricing match.
- CODE FIXED / NOT LIVE VERIFIED: article internal review/status panels are now editor-only in `single-articles.php`; requires uPress pull/cache clear and source check for marker `2026-05-11-public-article-note-guard-v1`.
- CODE FIXED V2 / NOT LIVE VERIFIED: taxonomy fallback now has an inferred cluster gate, intended to prevent those off-intent related cards after the next pull. Verify against marker `2026-05-11-related-cluster-gate-v1`.

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

## 2026-05-10 Homepage Mobile Floating CTA Final Verification

- LIVE VERIFIED: after uPress pull/cache clear, public CSS contains the homepage-only hide rule for `.whatsapp-float` and third-party `a.whatsapp-button`.
- VISUAL VERIFIED: `project-control/visual-evidence/homepage-mobile-after-floating-hide-2026-05-10.png`.
- FIXED: mobile homepage search form and hero CTAs are no longer covered by floating WhatsApp bubbles.
- VERIFIED: computed mobile width stayed at 390px with no horizontal overflow.
- PARTIAL: non-home mobile floating controls remain enabled and need separate article/directory QA before marking the whole floating-contact system customer-ready.

## 2026-05-11 Inner-Page Mobile Floating QA

- LIVE VERIFIED BEFORE FIX: mobile QA was run at 390px on `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/`.
- EVIDENCE BEFORE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11.json`.
- VISUAL EVIDENCE BEFORE: `mobile-inner-article-2026-05-11.png`, `mobile-inner-articles-2026-05-11.png`, `mobile-inner-lawyers-2026-05-11.png`, `mobile-inner-practice-family-2026-05-11.png`.
- FOUND: article, articles archive and lawyer directory had no horizontal overflow and no bottom-zone floating collision.
- FOUND: `/family-law/` had horizontal overflow (`scrollWidth` 434 vs `clientWidth` 390), the practice hero text overran its mobile grid column, and duplicate floating WhatsApp controls were visible.
- CODE FIXED: mobile CSS now clips page-level horizontal overflow, constrains practice-hub description/grid children, hides the duplicate theme `.whatsapp-float` on non-home mobile pages, keeps one compact third-party WhatsApp button, and uses a stronger mobile selector for the Pojo accessibility launcher.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-final-css.json`.
- VISUAL EVIDENCE AFTER CSS SIMULATION: `mobile-inner-article-2026-05-11-final-css.png`, `mobile-inner-articles-2026-05-11-final-css.png`, `mobile-inner-lawyers-2026-05-11-final-css.png`, `mobile-inner-practice-family-2026-05-11-final-css.png`.
- VERIFIED AFTER CSS SIMULATION: all four sampled mobile pages report no horizontal overflow and no duplicate WhatsApp controls.
- LIVE VERIFIED AFTER CODE FIX: after uPress pull/cache clear, homepage and `/family-law/` serve marker `2026-05-11-mobile-inner-qa-v1`, and public CSS contains the inner-page mobile fix.
- EVIDENCE LIVE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-live.json`.
- VISUAL EVIDENCE LIVE: `mobile-inner-article-2026-05-11-live.png`, `mobile-inner-articles-2026-05-11-live.png`, `mobile-inner-lawyers-2026-05-11-live.png`, `mobile-inner-practice-family-2026-05-11-live.png`.
- LIVE VERIFIED: `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/` all report `scrollWidth = 390`, `clientWidth = 390`, and `overflowX = false` at 390px mobile width.
- LIVE VERIFIED: duplicate theme `.whatsapp-float` is hidden on sampled inner pages, while one compact third-party WhatsApp button remains available.
