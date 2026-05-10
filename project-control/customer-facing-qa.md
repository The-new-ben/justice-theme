# Customer-Facing QA
Date: 2026-05-10

## Homepage
- URL: https://jus-tice.co.il/
- Proof: `project-control/visual-evidence/customer-home-desktop.png`, `customer-home-mobile.png`
- LIVE VERIFIED: page loads, red-dot wordmark visible, hero is visually stronger than a default blog.
- What looks weak: primary menu is too thin; WhatsApp overlays mobile lower CTA area; no final uploaded logo/favicon verified.
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
- Status: NEEDS LIVE VERIFICATION.

## Practice/Pillar Page
- URL: https://jus-tice.co.il/divorce-lawyer/
- Proof: `project-control/visual-evidence/customer-divorce-pillar-desktop.png`
- LIVE VERIFIED: currently visually resembles homepage/hero layer, not yet a complete polished legal landing page in the captured first viewport.
- What looks weak: needs clearer pillar content, FAQ, related lawyer, related articles and lead CTA after first fold.
- FIXED IN CODE: practice-area taxonomy pages now include an intent layer, preparation guidance and a lead/lawyer-directory CTA. This improves taxonomy practice hubs; separate static pillar pages still need content import/review.
- LIVE RECHECK: `https://jus-tice.co.il/practice-areas/family-law/` redirects to `http://jus-tice.co.il/family-law/` and does not expose the new taxonomy intent/CTA sections. This is likely a routing/permalink/page-vs-taxonomy conflict that needs wp-admin/uPress review.
- FIXED IN CODE: generic English practice pages such as `/family-law/` now have a route fallback template, so a page route can render as a structured practice hub even when taxonomy routing is bypassed.
- Status: PARTIAL.

## Lawyer Archive
- URL: https://jus-tice.co.il/lawyers/
- Proof: `project-control/visual-evidence/customer-lawyers-desktop.png`
- LIVE VERIFIED: cards render.
- What looks weak: multiple demo/test lawyers appear publicly; city slugs appear in some cards; sponsorship badges can mislead if not real.
- FIXED IN CODE: sponsored badge now requires active subscription and non-seed data; city labels map common slugs to Hebrew.
- Status: NOT CUSTOMER-READY until demo profiles are drafted/removed.

## 404
- URL: https://jus-tice.co.il/not-a-real-page-justice-qa/
- Proof: `project-control/visual-evidence/customer-404-desktop.png`
- LIVE VERIFIED: fake URL returned homepage with HTTP 200, not a true 404.
- FIXED IN CODE: 404 template copy is Hebrew/customer-friendly.
- BLOCKED: real issue likely routing/permalink/plugin/server and requires wp-admin/uPress investigation.
- Status: STILL BROKEN live.

## Footer / Mobile
- Proof: mobile homepage and article screenshots.
- LIVE VERIFIED: WhatsApp floating buttons are visible.
- What looks weak: mobile WhatsApp can overlap lower CTA controls.
- FIXED IN CODE: mobile `.whatsapp-float` offset raised.
- Status: NEEDS LIVE VERIFICATION.

## Mobile Menu
- Proof: `customer-home-mobile.png`
- LIVE VERIFIED: hamburger appears.
- What looks weak: primary menu contents are not yet verified open; topic strip shows only part of the legal area list.
- FIXED IN CODE: primary menu augmentation should make the opened menu more useful after deploy.
- Status: NEEDS LIVE VERIFICATION.
