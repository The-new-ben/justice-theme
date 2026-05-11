# Visual QA Report
Date: 2026-05-09
Status: PARTIAL VISUAL QA COMPLETED.

## 2026-05-11 Related Content Fallback QA After Live Pull
- LIVE DEPLOYMENT VERIFIED: uPress Git log showed commit `40ee1c4` (`Expose related fallback QA attributes`) as live HEAD.
- LIVE VERIFIED: static deployment marker returned `2026-05-11-related-fallback-qa-v1`.
- SOURCE VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-fallback-attrs.csv` captures the after-pull QA pass.
- VERIFIED: all sampled rows passed as `VERIFIED`.
- FIXED LIVE: `/find-lawyer-how-to-find-good-attorney/` now exposes a fallback related section with `related_mode=fallback` and `detected_source_cluster=lawyer_selection`.
- FIXED LIVE: `/drug-offenses-criminal-lawyer/` now exposes semantic criminal-law related cards with `data-related-cluster-match="match"`.
- VERIFIED STABLE: real-estate and family-divorce sampled pages still expose semantic related sections with matching source/card clusters.
- EDITORIAL REVIEW STILL NEEDED: the technical cluster gate can still allow broad same-cluster cards, such as international real-estate content under a local real-estate cost page; fix those through manual related URLs/content metadata.
- SAFETY: no screenshots/content edits were required for this source-level QA pass, and no public content body, URL, redirect, sitemap, canonical, taxonomy, lawyer, CRM, review or plugin state was changed.

## 2026-05-11 Live Plugin Includes Visibility QA
- VERIFIED LIVE VISIBLE: uPress File Manager opened the active plugin `includes/` folder at `/wp-content/plugins/ultra-justice-engine/includes/`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-includes-2026-05-11.png`.
- VERIFIED VISIBLE COUNT: live active plugin `includes/` listing shows 15 files.
- VERIFIED PARITY GAP: repo has `ultra-justice-engine/includes/cpt-legal-tools.php`, but the live active plugin listing did not show it.
- BLOCKED: byte-level visual/download parity is not possible in the Codex in-app browser because uPress file downloads are unsupported.
- SAFETY: no plugin state or file content was changed.

## 2026-05-11 Robots Static File QA
- FIXED LIVE: the public root `robots.txt` no longer returns an empty body.
- VERIFIED BEFORE FIX: `/robots.txt?codex_check=...` returned HTTP 200, `Content-Type: text/plain`, and length 0, while `/?robots=1` returned a valid WordPress robots body with the sitemap directive.
- VERIFIED LIVE AFTER FIX: `/robots.txt?codex_verify=...` returns HTTP 200 and includes `Sitemap: https://jus-tice.co.il/sitemap_index.xml`.
- VERIFIED SAFETY: the live robots file has no global `Disallow: /` and does not block `/wp-content/themes`, so public rendering assets remain crawlable.
- VERIFIED SITEMAP CONTEXT: sitemap index and sampled child sitemaps return XML with zero first-party HTTP loc values.

## 2026-05-11 Native 404 Redirect QA
- CODE FIXED / DEPLOYED: native 404 guard is live with marker `2026-05-11-native-404-before-redirect-v1` and uPress commit `cbbba45`.
- LIVE VERIFIED BLOCKED: fake public URL checks still return `301 Location: https://jus-tice.co.il` instead of the Hebrew 404 template.
- LIVE VERIFIED BLOCKED: invalid `?p=99999999` and `/index.php/not-a-real-index-path-.../` also redirect to the homepage.
- DIAGNOSTIC CLUE: no `X-Redirect-By` and no `X-Justice-Route-Guard` response header appeared on the 301, which points to a redirect source outside the normal theme guard path.
- VERIFIED SOURCE: uPress plugin manager shows active `All 404 Redirect to Homepage`; screenshot evidence: `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.
- NEXT QA: after owner-approved plugin deactivation, capture desktop/mobile screenshots for a real fake URL and verify HTTP 404, Hebrew copy, no homepage hero, and noindex/no-follow headers.

## 2026-05-11 Rank Math Sitemap Cache Bypass QA
- CODE FIXED / LIVE VERIFIED: Rank Math sitemap caching is disabled while sitemap HTTPS normalization is being verified.
- WHY IT MATTERS: after deployment was verified, child sitemap XML still exposed stale HTTP locs; this blocks a clean URL migration and GSC sitemap submission.
- PRE-PATCH LIVE CHECK: `articles-sitemap2.xml?nocache=1` returned 200 HTTP locs and zero HTTPS locs.
- LIVE VERIFIED: after uPress pull for marker `2026-05-11-rankmath-sitemap-cache-bypass-v1`, sampled child sitemaps returned zero first-party HTTP locs and HTTPS locs only.
- COUNTS: page 0/11, articles1 0/201, articles2 0/200, practice-areas 0/40, category 0/16 HTTP/HTTPS.

## 2026-05-11 uPress Pull And Post-Pull SEO QA
- VERIFIED LIVE: uPress Git Manager was accessible, Git Status was clean, and Git Pull brought live theme to `c992fd2`.
- VERIFIED LIVE: static deployment marker now returns `2026-05-11-robots-sitemap-directive-v1`; homepage source includes the same marker.
- VERIFIED LIVE PARTIAL: homepage source uses the WordPress/RealFaviconGenerator manifest and does not duplicate the theme fallback manifest.
- BLOCKED / NOT FIXED BY PULL: `robots.txt` still returns HTTP 200 with empty body.
- BLOCKED / NOT FIXED BY PULL: `articles-sitemap2.xml` still exposes 200 `http://jus-tice.co.il` loc values and zero HTTPS loc values.
- NEXT QA: inspect robots source and clear Rank Math sitemap cache/settings before resubmitting sitemaps or treating sitemap HTTPS as fixed.

## 2026-05-11 Robots Sitemap Directive QA
- CODE LIVE / OUTPUT BLOCKED: robots.txt should include `Sitemap: https://jus-tice.co.il/sitemap_index.xml`, but the public response is still empty after deployment.
- WHY IT MATTERS: the verified sitemap index returns XML, while `/sitemap.xml` and `/wp-sitemap.xml` currently redirect to the homepage.
- LIVE CHECK NEEDED: inspect the static/server/plugin robots source, then verify `robots.txt` returns 200, includes the sitemap index directive, and does not block public rendering assets.

## 2026-05-11 Sitemap HTTPS QA
- CODE LIVE / OUTPUT BLOCKED: supported sitemap generators have theme hooks for first-party HTTPS normalization, but Rank Math child sitemap output still exposes HTTP locs after deployment.
- WHY IT MATTERS: sitemap mixed-protocol signals were found in live checks and should be cleared before URL migration or GSC sitemap resubmission.
- LIVE CHECK NEEDED: clear Rank Math sitemap cache/settings, then re-run public checks for `page-sitemap.xml`, `articles-sitemap1.xml`, `articles-sitemap2.xml`, and `practice-areas-sitemap.xml`; record `http_loc_count`.

## 2026-05-11 Branding Manifest QA
- CODE FIXED / NOT LIVE VERIFIED: theme now has `assets/images/site.webmanifest` as a fallback for mobile bookmark/install branding, using existing 192x192 and 512x512 square icons.
- PARTIAL LIVE VERIFIED: current public source already includes the RealFaviconGenerator manifest from `/wp-content/uploads/fbrfg/site.webmanifest`, so the theme fallback should remain suppressed while that admin icon stack is active.
- VERIFIED LOCALLY: icon dimensions exist for 16, 32, 48, 180, 192 and 512 pixels; full logo source is non-square and remains unsuitable as a raw Site Icon without cropping.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify marker `2026-05-11-branding-manifest-v1`, confirm no duplicate manifest links while WordPress Site Icon exists, and confirm the fallback manifest URL is available if the admin icon stack is removed.

## 2026-05-11 Lawyer Directory Approved Query QA
- CODE FIXED / NOT LIVE VERIFIED: `/lawyers/` now queries only profiles that pass the public approval gate, so result counts and pagination should match visible public cards.
- WHY IT MATTERS: seed/demo/unapproved lawyer records should not produce misleading totals or empty pages after the visible card filter is applied.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify `/lawyers/`, `/lawyers/?area=family-law`, `/lawyers/?area=criminal-law`, and one city filter on desktop/mobile with marker `2026-05-11-lawyer-directory-approved-query-v1`.

## 2026-05-11 Breadcrumb Visual Polish
- CODE FIXED / NOT LIVE VERIFIED: breadcrumb markup and styling were upgraded into a more premium navigation band with pill links, a current-page chip, subtle accent line, and mobile horizontal scrolling.
- CODE FIXED / NOT LIVE VERIFIED: RTL separator behavior was updated for the new visual separator.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify breadcrumbs on desktop/mobile for a single article, `/articles/`, `/lawyers/`, `/family-law/`, a search page and a real 404 route.

## 2026-05-11 Navigation Area Fallback QA
- CODE FIXED / NOT LIVE VERIFIED: header topic-strip fallbacks now keep personal injury/damages and inheritance users inside the lawyer directory if the clean pillar pages are not published.
- CODE FIXED / NOT LIVE VERIFIED: footer specialization links now expose medical malpractice, employment, traffic and inheritance filters, reducing the visual/SEO gap between homepage hubs and footer navigation.
- LIVE CHECK NEEDED: after uPress pull/cache clear, verify homepage header/footer on desktop and mobile, then spot-check `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, `/lawyers/?area=privacy-cyber-law`, `/lawyers/?area=tax-law`, and `/lawyers/?area=inheritance-law`.

## 2026-05-11 Lead Area Vocabulary QA
- CODE FIXED / NOT LIVE VERIFIED: public lead forms now submit clean legal-area slugs that match the content/directory architecture.
- CODE FIXED / NOT LIVE VERIFIED: CRM display should show Hebrew area labels after classification instead of raw legacy values such as `damages` or `medical_malpractice`.
- LIVE CHECK NEEDED: after uPress pull/cache clear, submit one controlled homepage lead with `רשלנות רפואית` or `נזיקין ותאונות`, then verify `legal_area`, `ai_detected_area`, and CRM area display.

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
- DOCUMENTED / NOT EXECUTED: `project-control/related-content-cms-update-batch-001.csv` now lists exact CMS metadata values to fix these four sampled pages without editing article bodies.
- CODE FIXED / NOT LIVE VERIFIED: article internal review/status panels are now editor-only in `single-articles.php`; requires uPress pull/cache clear and source check for marker `2026-05-11-public-article-note-guard-v1`.
- CODE FIXED V2 / NOT LIVE VERIFIED: taxonomy fallback now has an inferred cluster gate, intended to prevent those off-intent related cards after the next pull. Verify against marker `2026-05-11-related-cluster-gate-v1`.
- CODE FIXED V3 / NOT LIVE VERIFIED: related sections/cards now expose source/card cluster QA attributes. After pull, inspect `data-related-cluster-match` on each card and flag any mismatch for editorial review.

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

## 2026-05-11 404 Plugin Deactivation QA Prep

- SOURCE VERIFIED: screenshot evidence exists at `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.
- CREATED: `project-control/404-plugin-deactivation-checklist.md`.
- CREATED: `tools/check-404-routing.ps1`.
- VERIFIED BASELINE: the checker confirms valid public pages and crawl files still pass.
- BLOCKED BASELINE: fake URL and invalid `?p=99999999` still return 301-to-homepage while `All 404 Redirect to Homepage` remains active.
- NOT YET VISUAL VERIFIED: post-deactivation real Hebrew 404 screenshot still requires owner approval to deactivate the plugin and rerun live QA.

## 2026-05-11 uPress Plugin Manager Read-Only Evidence

- VISUAL VERIFIED: `Ultra Justice Engine` appears in the uPress plugin manager as active.
- VISUAL VERIFIED: `All 404 Redirect to Homepage` appears in the uPress plugin manager as active.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-ultra-justice-engine-active-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-all-404-active-2026-05-11.png`.
- SAFETY: screenshots were captured after filtering the plugin table only; no plugin state was changed.

## 2026-05-11 uPress Plugin Filesystem Read-Only Evidence

- VISUAL VERIFIED: `/wp-content/plugins/ultra-justice-engine/` exists in the uPress File Manager.
- VISUAL VERIFIED: `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists, with `includes/` in the same plugin folder.
- VISUAL VERIFIED: filtering `/wp-content/plugins/` for `justice-core` returned 0 items.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-justice-engine-active-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-main-file-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-no-justice-core-2026-05-11.png`.
- SAFETY: screenshots were captured through read-only file navigation and filtering; no plugin file or plugin state was changed.

## 2026-05-11 Live Public Template Source QA

- SOURCE VERIFIED: `project-control/live-public-template-qa-2026-05-11.csv` captures the sampled public checks.
- VERIFIED: homepage source returns HTTP 200, a Hebrew portal title, active favicon/manifest tags, the traffic fallback link `/lawyers/?area=traffic-law`, and the AI/intake fallback `/#ask-lawyer`.
- VERIFIED: `/lawyers/`, `/articles/`, and Hebrew search for `גירושין` return HTTP 200 with Hebrew titles and no sampled English default strings such as `Search results for:`, `Previous`, `Next`, or `Archive` in the document title.
- VERIFIED: `/find-lawyer-how-to-find-good-attorney/` exposes semantic related-content QA attributes and 3 related cluster-match markers.
- VERIFIED: filtered lawyer directory URLs for `personal-injury-law`, `medical-malpractice-law`, `employment-law`, `labor-law`, and `traffic-law` stay on `/lawyers/` and do not redirect to homepage.
- FOUND LIVE: `personal-injury-law`, `medical-malpractice-law`, and `employment-law` filter pages have specific H1s but generic SEO titles.
- FIXED LIVE: `inc/seo.php` now normalizes lawyer-directory area aliases before title generation; see the after-pull QA section below.
- SAFETY: no public content, URLs, redirects, sitemap settings, canonical settings, taxonomy terms, lawyer records, CRM records, review data, plugin state or database rows were changed.

## 2026-05-11 Live Public Template Source QA After Pull

- LIVE DEPLOYMENT VERIFIED: uPress Git log shows commit `3b07267` (`Fix lawyer filter SEO alias titles`) as the live HEAD.
- SOURCE VERIFIED: `project-control/live-public-template-qa-2026-05-11-after-pull.csv` captures the after-pull verification pass.
- VERIFIED: all sampled rows passed as `VERIFIED`.
- FIXED LIVE: `/lawyers/?area=personal-injury-law` now has the specific title `עורך דין נזיקין | מצאו עורך דין מתאים`.
- FIXED LIVE: `/lawyers/?area=medical-malpractice-law` now has the specific title `עורך דין רשלנות רפואית | מצאו עורך דין מתאים`.
- FIXED LIVE: `/lawyers/?area=employment-law` now has the specific title `עורך דין דיני עבודה | מצאו עורך דין מתאים`.
- VERIFIED: homepage fallback links, search Hebrew labels, article related-content QA attributes and main archive title checks remained stable.
- SAFETY: no public content, URLs, redirects, sitemap settings, canonical settings, taxonomy terms, lawyer records, CRM records, review data, plugin state or database rows were changed.

## 2026-05-11 Related Content Source QA Before URL Inference Fix

- SOURCE VERIFIED: `project-control/live-related-content-qa-2026-05-11-before-url-inference.csv` captures the pre-fix related-content QA pass.
- REVIEW: `/find-lawyer-how-to-find-good-attorney/` returned `data-related-source-cluster="unknown"` and off-topic related cards.
- REVIEW: `/drug-offenses-criminal-lawyer/` returned `data-related-source-cluster="unknown"` and off-topic related cards.
- VERIFIED: `/real-estate-lawyer-cost-2025/` returned `real_estate` source/card cluster matches.
- VERIFIED: `/mutual-divorce-agreement-2025/` returned `family_divorce` source/card cluster matches.
- FIXED IN CODE / NOT LIVE VERIFIED: cluster inference now includes public permalink and request URI signals so clean public slugs can drive related-card filtering.
- SAFETY: no public content, URLs, redirects, sitemap settings, canonical settings, taxonomy terms, lawyer records, CRM records, review data, plugin state or database rows were changed.
