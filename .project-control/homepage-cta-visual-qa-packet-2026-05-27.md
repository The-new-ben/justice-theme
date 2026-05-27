# Homepage CTA Visual QA Packet - 2026-05-27

Status: HOMEPAGE_CTA_VISUAL_QA_READY_NO_PUBLIC_CHANGE

Target route: https://jus-tice.co.il/
Source CTA audit date: 2026-05-27

Scope: private visual QA packet only. It captures before-state screenshots and interprets the existing CTA-density finding. It does not publish, edit CMS content, change homepage labels/links/layout, alter SEO settings, create leads, contact anyone, send email or deploy.

## Summary

- Homepage audit status: REVIEW
- Primary CTAs counted by source audit: 10
- Unique primary CTA texts: 5
- Repeated text groups: שליחת פנייה (6)
- Desktop screenshot: .project-control/visual-evidence/homepage-cta-density-desktop-2026-05-27.png (1440x2200)
- Mobile screenshot: .project-control/visual-evidence/homepage-cta-density-mobile-iphone-2026-05-27.png (390x2600)
- Public changes approved: 0

## Review Rows

| ID | Section | Status | Evidence | Review | Next Step | Blocker |
| --- | --- | --- | --- | --- | --- | --- |
| HVQA-01 | source_audit | REVIEW_CONFIRMED | Live CTA density audit found homepage status REVIEW, primary CTA count 10, unique CTA texts 5 and repeated text groups שליחת פנייה (6). | The repeated lawyer-card action label remains a real decision item before adding more homepage CTAs or managed-service copy. | Do not add new homepage CTA blocks; choose a quieter card-action treatment only after owner/design approval. | No public homepage change is approved by this packet. |
| HVQA-02 | desktop_screenshot | SCREENSHOT_CAPTURED | .project-control/visual-evidence/homepage-cta-density-desktop-2026-05-27.png (1440x2200, 1139038 bytes). | Desktop top-to-mid homepage view shows the hero, search form, trust chips, three-step user path and the start of the lawyer section. The page still reads as legal help first. | If a public implementation is approved, use this as the before-state for desktop comparison. | Screenshot does not approve changing labels, links or layout. |
| HVQA-03 | mobile_screenshot | SCREENSHOT_CAPTURED | .project-control/visual-evidence/homepage-cta-density-mobile-iphone-2026-05-27.png (390x2600, 329411 bytes). | Mobile iPhone-width view shows the header/menu, hero, search form, trust chips, stats and three-step path. The repeated lawyer-card buttons sit lower than the captured top flow, so lower-section QA is still required before publication. | Before any live change, capture the actual lawyer-card area after a local or staging implementation and rerun CTA density. | Do not treat this screenshot as proof that the repeated card buttons are solved. |
| HVQA-04 | implementation_direction | OWNER_REVIEW_ONLY | Prior packet option B is still the lowest-risk path: make repeated lawyer-card actions visually quieter instead of changing the user promise. | A style-only card-action treatment is safer than new Hebrew labels, because the current links go to contact URLs and copy changes could create a mismatch. | If approved, implement a secondary-card action style, then run mobile/desktop screenshots, CTA density audit, business-language audit and Hebrew public-change email. | Owner/design approval and post-change QA are missing. |
| HVQA-05 | public_safety | HARD_GUARDRAIL | No business-plan, supplier marketplace, package economics, revenue or internal routing language is needed for the user-facing homepage decision. | The homepage should stay focused on legal help, user problem selection, lawyer fit, trust and guidance. | Keep lawyer join/revenue surfacing on the sidelines and do not expose internal strategy. | Any public text change needs exact owner/legal/content review. |

## Decision

Do not publish a homepage CTA change from this packet alone. The safest candidate, if the owner approves, is a visual-only quieter secondary treatment for repeated lawyer-card actions. Exact public implementation still needs local/staging screenshots, live CTA-density rerun, public business-language audit and Hebrew owner email after live verification.

## Safety Statement

This packet writes private repo artifacts and screenshots only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import leads, send email/WhatsApp/TalkTo, create invoices/payments, claim revenue or require uPress deployment.
