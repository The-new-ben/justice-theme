# Customer-Facing QA
Date: 2026-05-10

## 2026-05-11 Inner Mobile QA Update
- LIVE VERIFIED: latest uPress pull is public with marker `2026-05-11-mobile-inner-qa-v1`.
- VISUAL VERIFIED: article, articles archive, lawyer directory and family practice page were captured on 390px mobile without injected CSS.
- FIXED: sampled pages no longer have horizontal overflow.
- FIXED: duplicate theme WhatsApp float no longer appears on sampled inner mobile pages; one compact third-party contact button remains.
- PROOF: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-live.json` and `project-control/visual-evidence/mobile-inner-*-2026-05-11-live.png`.

## Homepage
- URL: https://jus-tice.co.il/
- Proof: `project-control/visual-evidence/customer-home-desktop.png`, `customer-home-mobile.png`
- LIVE VERIFIED: page loads, red-dot wordmark visible, hero is visually stronger than a default blog.
- LIVE VERIFIED 2026-05-10 POST-PULL: homepage title is now `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`; proof screenshots: `homepage-post-pull-safe-links-desktop-2026-05-10.png`, `homepage-post-pull-safe-links-mobile-2026-05-10.png`.
- What looks weak: primary menu is too thin; WhatsApp overlays mobile lower CTA area; no final uploaded logo/favicon verified.
- LIVE VERIFIED FOLLOW-UP ISSUE: traffic and LegalTech/AI topic links still had homepage-redirect risk in the pulled version.
- CODE FIXED / NOT LIVE VERIFIED: traffic now falls back to `/lawyers/?area=traffic-law`; LegalTech/AI links fall back to `/#ask-lawyer` until real tool pages exist.
- LIVE VERIFIED ISSUE: the pulled ask-lawyer form is wired correctly, but still uses hidden `general`/`normal` values instead of asking the visitor for legal area, city and urgency.
- CODE FIXED / NOT LIVE VERIFIED: ask-lawyer now captures legal area, city/region, email and urgency visibly, making it safer as the temporary AI/LegalTech fallback.
- LIVE VERIFIED 2026-05-10 FOLLOW-UP: traffic link now uses `/lawyers/?area=traffic-law`, AI/intake link uses `/#ask-lawyer`, and the enriched ask-lawyer fields are public. Proof: `ask-lawyer-enriched-desktop-2026-05-10.png`, `ask-lawyer-enriched-mobile-2026-05-10.png`.
- CODE FIXED / NOT LIVE VERIFIED: the remaining third-party mobile WhatsApp lead banner is now compacted to a 54px icon-only button in CSS; proof of live CSS simulation: `mobile-chat-widget-css-test-final-2026-05-10.png`.
- FIXED IN CODE: stronger hero copy, fallback favicon, fuller primary menu augmentation, mobile WhatsApp offset.
- Status: NOT CUSTOMER-READY until live recheck and menu assignment.

## Articles Archive
- URL: https://jus-tice.co.il/articles/
- Proof: `project-control/visual-evidence/customer-articles-desktop.png`
- LIVE VERIFIED: article cards render with images/placeholders and sidebar categories.
- What looks weak: breadcrumbs show as numbered list; page copy is generic; HTML is very large.
- FIXED IN CODE: archive copy changed to intent-first language; breadcrumb CSS fixed.
- Status: NEEDS LIVE VERIFICATION.

## Single Article
- URL: https://jus-tice.co.il/find-lawyer-how-to-find-good-attorney/
- Proof: `project-control/visual-evidence/customer-single-article-desktop.png`, `customer-single-article-mobile.png`
- LIVE VERIFIED: article title/card layout is readable.
- What looks weak: breadcrumb numbering, no immediate problem/action framing before content.
- FIXED IN CODE: article intent panel added; breadcrumbs styled.
- CODE FIXED / NOT LIVE VERIFIED: related articles now use manual URL, cluster and practice-area relevance instead of broad latest/legacy fallback.
- LIVE VERIFIED PARTIAL 2026-05-11: related-content mode is live on sampled article pages and no unsafe internal markers appeared in the sampled public body. Proof: `project-control/visual-evidence/related-content-live-qa-2026-05-11.json`.
- STILL WEAK: general/criminal/real-estate related cards still include off-intent recommendations, so this is not yet customer-ready from an editorial/SEO perspective.
- CODE FIXED / NOT LIVE VERIFIED: internal article review/status panels are now editor-only and hidden from anonymous public visitors when those meta fields exist.
- CODE FIXED V2 / NOT LIVE VERIFIED: related taxonomy fallback now rejects cards that do not match the inferred source cluster, so weak general/criminal/real-estate related cards should be reduced after deployment.
- Status: NEEDS LIVE VERIFICATION.

## Practice/Pillar Page
- URL: https://jus-tice.co.il/divorce-lawyer/
- Proof: `project-control/visual-evidence/customer-divorce-pillar-desktop.png`
- LIVE VERIFIED: currently visually resembles homepage/hero layer, not yet a complete polished legal landing page in the captured first viewport.
- What looks weak: needs clearer pillar content, FAQ, related lawyer, related articles and lead CTA after first fold.
- FIXED IN CODE: practice-area taxonomy pages now include an intent layer, preparation guidance and a lead/lawyer-directory CTA. This improves taxonomy practice hubs; separate static pillar pages still need content import/review.
- LIVE RECHECK: `https://jus-tice.co.il/practice-areas/family-law/` redirects to `http://jus-tice.co.il/family-law/` and does not expose the new taxonomy intent/CTA sections. This is likely a routing/permalink/page-vs-taxonomy conflict that needs wp-admin/uPress review.
- FIXED IN CODE: generic English practice pages such as `/family-law/` now have a route fallback template, so a page route can render as a structured practice hub even when taxonomy routing is bypassed.
- LIVE VERIFIED: `/family-law/` now exposes the practice intent layer publicly. Proof: `project-control/visual-evidence/family-law-live-intent-2026-05-10.png`.
- Status: PARTIAL.

## Lawyer Archive
- URL: https://jus-tice.co.il/lawyers/
- Proof: `project-control/visual-evidence/customer-lawyers-desktop.png`
- LIVE VERIFIED: cards render.
- LIVE VERIFIED 2026-05-10 POST-PULL: title is now `מדריך עורכי דין בישראל | Jus-Tice`; proof screenshots: `lawyers-post-pull-title-fixed-desktop-2026-05-10.png`, `lawyers-post-pull-title-fixed-mobile-2026-05-10.png`.
- What looks weak: multiple demo/test lawyers appear publicly; city slugs appear in some cards; sponsorship badges can mislead if not real.
- FIXED IN CODE: sponsored badge now requires active subscription and non-seed data; city labels map common slugs to Hebrew.
- LIVE VERIFIED: `/lawyers/?area=family-law` now outputs the Jus-Tice `noindex,follow` filter marker. Proof: `project-control/visual-evidence/lawyers-family-filter-2026-05-10.png`.
- STILL BROKEN LIVE: Maya profile URL is currently in a redirect loop caused by Permalink Manager and theme slug migration fighting each other. Theme-side redirect is disabled in code pending deployment.
- CODE FIXED / NOT LIVE VERIFIED: lawyer cards now hide rating numbers unless review display is explicitly approved, and sponsored/profile-paid labels require an active subscription.
- CODE FIXED / NOT LIVE VERIFIED: lawyer card/profile phone and WhatsApp buttons now suppress obvious placeholder/demo numbers, and Attorney schema uses the same safe public phone filter.
- Status: NOT CUSTOMER-READY until demo profiles are drafted/removed.

## 404
- URL: https://jus-tice.co.il/not-a-real-page-justice-qa/
- Proof: `project-control/visual-evidence/customer-404-desktop.png`
- LIVE VERIFIED: fake URL returned homepage with HTTP 200, not a true 404.
- FIXED IN CODE: 404 template copy is Hebrew/customer-friendly.
- CODE FIXED: `inc/routing-guards.php` now detects non-root URLs being served as the front page and forces a real 404 response/template.
- BLOCKED: real issue likely routing/permalink/plugin/server and requires wp-admin/uPress investigation.
- Status: CODE FIXED / NOT VERIFIED LIVE after latest routing guard.

## Footer / Mobile
- Proof: mobile homepage and article screenshots.
- LIVE VERIFIED: WhatsApp floating buttons are visible.
- What looks weak: mobile WhatsApp can overlap lower CTA controls.
- FIXED IN CODE: mobile `.whatsapp-float` offset raised.
- 2026-05-10 UPDATE: captured `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`; the screenshot confirms the accessibility tab and floating lead/WhatsApp controls are too aggressive on mobile.
- CODE FIXED: mobile CSS now reduces and raises the WhatsApp float, adds bottom safe-space padding, and moves the Pojo accessibility toolbar away from the middle of the first viewport.
- LIVE VERIFIED ISSUE / CODE FIXED: the separate third-party `a.whatsapp-button` lead banner rendered as a 255px mobile pill; CSS now converts it to a 54px icon-only WhatsApp control while preserving the link.
- Status: CODE FIXED / NOT LIVE VERIFIED.
- 2026-05-10 UPDATE: LIVE VERIFIED homepage mobile cleanup after uPress pull/cache clear. On the homepage only, floating WhatsApp controls are hidden on mobile so they no longer cover the guided search form or hero CTAs.
- Proof: `project-control/visual-evidence/homepage-mobile-after-floating-hide-2026-05-10.png`.
- Status: HOMEPAGE MOBILE VISUAL VERIFIED / INNER PAGES PARTIAL.
- 2026-05-11 UPDATE: Inner mobile pages were sampled at 390px. Article, articles archive and lawyer directory passed overflow checks; `/family-law/` had horizontal overflow and duplicate WhatsApp controls before the fix.
- CODE FIXED: mobile practice-hub overflow is constrained, duplicate theme WhatsApp is hidden on non-home mobile pages, and one compact contact button remains.
- Proof before: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11.json`.
- Proof after local CSS simulation: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-final-css.json`.
- Status: CODE FIXED / VISUAL VERIFIED BY CSS SIMULATION / NOT LIVE VERIFIED after deployment.

## Mobile Menu
- Proof: `customer-home-mobile.png`
- LIVE VERIFIED: hamburger appears.
- What looks weak: primary menu contents are not yet verified open; topic strip shows only part of the legal area list.
- FIXED IN CODE: primary menu augmentation should make the opened menu more useful after deploy.
- Status: NEEDS LIVE VERIFICATION.

## 2026-05-10 Integrated SEO / Design Visual Pass

Proof bundle:
- Data: `project-control/visual-evidence/integrated-visual-qa-2026-05-10.json`
- Homepage: `integrated-home-desktop-2026-05-10.png`, `integrated-home-mobile-2026-05-10.png`
- Articles archive: `integrated-articles-desktop-2026-05-10.png`, `integrated-articles-mobile-2026-05-10.png`
- Article sample: `integrated-article-rabbinical-agreement-desktop-2026-05-10.png`, `integrated-article-rabbinical-agreement-mobile-2026-05-10.png`
- Lawyer directory: `integrated-lawyers-desktop-2026-05-10.png`, `integrated-lawyers-mobile-2026-05-10.png`
- Sample lawyer profile URL: `integrated-lawyer-profile-sample-desktop-2026-05-10.png`, `integrated-lawyer-profile-sample-mobile-2026-05-10.png`
- Practice page: `integrated-practice-family-desktop-2026-05-10.png`, `integrated-practice-family-mobile-2026-05-10.png`
- Search: `integrated-search-divorce-desktop-2026-05-10.png`, `integrated-search-divorce-mobile-2026-05-10.png`
- 404 test: `integrated-not-found-desktop-2026-05-10.png`, `integrated-not-found-mobile-2026-05-10.png`

LIVE VERIFIED:
- Homepage, `/articles/`, `/rabbinical-agreement-approval/`, `/lawyers/`, `/family-law/` and search loaded with HTTP 200.
- Homepage is visually much more premium than the original blog-like state: red-dot logo, topic strip, dark hero, guided search and visible lead/WhatsApp CTAs.
- Homepage public HTML has crawlable links to `/lawyers/`, `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/`, `/medical-malpractice-lawyer/`, `/lawyer-registration/` and `/legal-tools/`.
- Breadcrumbs render on archive, article, search, lawyer directory and practice pages.
- No visible internal project notes were seen in the sampled first viewports.

FIXED IN CODE:
- `inc/seo.php` now shares one contextual title helper across WordPress and common SEO plugin title filters, so archive/search pages should stop leaking English titles after deployment.
- Targeted title issues: `Articles Archive`, `עורכי דין Archive`, `You searched for`.

STILL LOOKS BAD / NEEDS WORK:
- Homepage DOM did not expose approved target links for `/personal-injury-lawyer/`, `/traffic-lawyer/`, `/employment-lawyer/` or `/inheritance-lawyer/` in this pass.
- `/articles/` title is still `Articles Archive | Jus-Tice.co.il` live until the code fix is deployed.
- `/lawyers/` title is still `עורכי דין Archive | Jus-Tice.co.il` live until the code fix is deployed.
- Search title is still `You searched for גירושין | Jus-Tice.co.il` live until the code fix is deployed.
- Sample lawyer profile Hebrew URL returned homepage-style content with status 200 and canonical homepage; this is not a real profile experience and remains a routing/content-status risk.
- Fake 404 URL returned/finalized as homepage with status 200; this remains a serious routing/404 risk until live routing guard/server/plugin behavior is verified.
- `/practice-areas/family-law/` redirects/finalizes to `http://jus-tice.co.il/family-law/`; canonical also uses `http`. HTTPS/canonical consistency needs review before migration.
- Mobile floating WhatsApp/lead CTA and accessibility widget overlap content on article/search/practice pages.
- Search form UI on mobile looks like a plain browser form and does not match the premium portal style.

Status:
- VISUAL VERIFIED for screenshots.
- CODE FIXED for archive/search title leaks.
- NOT CUSTOMER-READY for lawyer profile routing, 404 routing, mobile overlays and incomplete homepage pillar links.
