# Homepage CTA Lower-Section Implementation Guard - 2026-05-27

Status: HOMEPAGE_CTA_LOWER_SECTION_IMPLEMENTATION_GUARD_READY_NO_PUBLIC_CHANGE

Target route: https://jus-tice.co.il/

Scope: private implementation guard for the homepage lawyer-card CTA density issue. It translates the live audit, visual QA gap and competitor patterns into a guarded approval path. It does not publish, edit CMS content, alter homepage labels/links/CSS/layout, change SEO settings, create leads, contact anyone, send email or deploy.

## Summary

- Homepage audit status: REVIEW
- Homepage primary CTAs: 10
- Unique visible CTA labels: 5
- Repeated text groups: שליחת פנייה (6)
- Competitor notes included: 4
- Guard rows: 12
- Owner decision rows: 4
- Screenshot template rows: 5
- Forbidden public marker hits in candidate directions: 0
- Public changes approved: 0

## Recommended Path

1. Keep the homepage legal-help-first: search, problem selection, lawyer fit and practical guidance stay visually dominant.
2. If the owner approves a first pass, use Option B only: make repeated lawyer-card actions visually quieter while keeping current hrefs and the current visible label.
3. Do not change card action copy, destinations, internal links or article CTAs in the same pass.
4. Require lower-section mobile and desktop before/after screenshots, CTA-density rerun and business-language scan before any live publication.

## Competitor Notes

| ID | Source | URL | Observed Pattern | Usable Takeaway |
| --- | --- | --- | --- | --- |
| COMP-HCTA-01 | din.co.il | https://www.din.co.il/ | Search/category discovery is the dominant first action, while individual lawyer exposure appears as card-level contact context rather than a new homepage promise. | Keep the homepage led by legal-help search and guidance; make repeated lawyer-card actions local to the cards and visually secondary. |
| COMP-HCTA-02 | lawzone.co.il | https://lawzone.co.il/ | The top flow emphasizes finding a lawyer by field/location, then uses a separate consultation form lower on the page. | Do not add more competing top-level CTAs; if the card action stays, it should not overpower search, category and guidance flows. |
| COMP-HCTA-03 | myattorney.co.il | https://www.myattorney.co.il/ | The homepage opens with search and recommended lawyers, with lawyer cards functioning as discovery items. | Lawyer cards can stay commercially useful without every repeated action reading like the main homepage CTA. |
| COMP-HCTA-04 | mishpati.co.il | https://www.mishpati.co.il/ | Provider cards use a transactional reveal-style action for phone visibility, while the page still carries editorial/legal-topic content. | A clear but quieter repeated card action is acceptable when it is scoped to one provider card and does not blur the page-level legal-help intent. |

## Guard Rows

| ID | Section | Status | Evidence | Implementation Rule | Owner Decision Needed | Public Change Approved | Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HLCG-01 | source_finding | REVIEW_CONFIRMED | Live homepage audit: status REVIEW, 10 primary CTAs, 5 unique visible labels, repeated group שליחת פנייה (6). | Treat the repeated card action as a lower-section design problem, not as permission to add another homepage CTA. | Choose keep as-is, visual-only quieter treatment, copy/link review, or reduce card exposure. | no | No homepage label, link, CSS, layout, CMS, SEO or deployment change is approved here. |
| HLCG-02 | visual_gap | LOWER_SECTION_QA_MISSING | The earlier mobile screenshot covered header/hero/search/trust/three-step flow; the repeated lawyer-card buttons were lower than the captured area. | Before any code change is treated as ready, capture the actual lawyer-card section on mobile and desktop. | Confirm whether the before/after card section feels useful and not pushy on mobile. | no | Missing lower-section screenshots and owner/design approval. |
| HLCG-03 | competitor_pattern | COMPETITOR_INFORMED | din.co.il keeps search/category discovery as the main first action and treats lawyer exposure as card-level contact context. | Preserve Jus-Tice search and guidance as the main homepage path; keep lawyer-card actions visually local. | None if choosing visual-only treatment; required if changing labels or destinations. | no | Competitor inspiration does not approve copying content, layout or public code. |
| HLCG-04 | competitor_pattern | COMPETITOR_INFORMED | LawZone and MyAttorney lead with find-a-lawyer search flows, then expose lawyer/category discovery below. | Avoid turning the lawyer-card strip into the homepage headline action; make card actions secondary to legal-help discovery. | None if only changing action weight after approval. | no | Do not introduce public sales-language, supplier-language or package claims. |
| HLCG-05 | competitor_pattern | COMPETITOR_INFORMED | Mishpati uses repeated provider-card phone reveal actions, but each action is scoped to one provider card. | A repeated action can stay if it is clearly a card-local action, visually quieter than the hero/search CTA and still tappable. | Approve whether Jus-Tice should keep contact-form destination or move toward profile-first behavior later. | no | Destination changes are a separate product decision and need route/cannibalization review. |
| HLCG-06 | preferred_candidate | OPTION_B_READY_FOR_APPROVAL_ONLY | The source density packet already named visual-only quieter treatment as the lowest-risk candidate; the visual QA packet did not disprove it. | Preferred candidate: keep existing card hrefs and Hebrew label, but restyle repeated lawyer-card actions as secondary/compact actions inside cards. | Owner/design must approve this exact direction before CSS or template work. | no | Approval missing; lower-section before/after screenshots missing. |
| HLCG-07 | copy_guard | COPY_CHANGE_BLOCKED | The current repeated label maps to contact-form URLs; changing visible text could mislead if the target remains a contact form. | Do not rename the card action to profile/details/fit-check wording unless the destination and user promise are also reviewed. | Approve exact Hebrew copy and destination if Option C is selected. | no | Copy/link-destination mismatch risk. |
| HLCG-08 | implementation_gate | REQUIRED_BEFORE_LOCAL_DIFF | A safe implementation needs a constrained selector for homepage lawyer-card actions only. | If approved, change only the homepage lawyer-card action treatment; do not touch article CTAs, legal-help CTAs, directory filters or provider routes. | Approve exact scope before file edits. | no | No theme diff until the owner approves scope. |
| HLCG-09 | qa_gate | REQUIRED_AFTER_LOCAL_DIFF | Mobile density concern came from a real device view; the lower card area must be checked directly. | After any local/staging diff: capture mobile 390px lower-card section, desktop 1440px lower-card section, rerun CTA-density audit and scan for business-language leaks. | Approve or reject based on screenshots and audit output. | no | QA artifacts missing. |
| HLCG-10 | publication_gate | PUBLICATION_BLOCKED | Prior density review status: OWNER_REVIEW_PACKET_READY_NOT_APPROVED; visual QA status: HOMEPAGE_CTA_VISUAL_QA_READY_NO_PUBLIC_CHANGE. | Only after owner approval, local QA and live/staging verification should the change be committed for deployment. After live publication, email the owner in Hebrew with review URL, summary and associated pages. | Explicit public-change approval. | no | No uPress pull or public-change email because no public change exists in this packet. |
| HLCG-11 | associated_pages | REVIEW_BEFORE_PUBLIC_CHANGE | /lawyers/; /find-lawyer-how-to-find-good-attorney/; /national-insurance-attorney/; /bituach-leumi-appeal-guide/; /rental-agreement/; /labor-lawyer/; /consumer-rights-israel/; /eviction-notice-israel/ | If the homepage card action becomes profile-first or contact-first, inspect these surfaces for CTA wording, internal-link flow and cannibalization. | Choose whether card traffic should primarily feed lawyer profiles, contact forms or practice pages. | no | No internal-link or route decision from this guard. |
| HLCG-12 | hard_stop | NO_PUBLIC_OR_LIVE_ACTION | This guard is private implementation preparation only. | Do not publish, change CMS, SEO settings, CRM, leads, contacts, invoices, payments, email, WhatsApp, TalkTo, uPress or public homepage code from this artifact alone. | Owner approval required before any public-facing change. | no | All live/public actions remain blocked. |

## Owner Decision Template

| Decision ID | Question | Recommended Choice | Allowed Answers | Required Evidence Before Public | Public Action Unblocked | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| HLCG-DECISION-01 | Which homepage lawyer-card CTA direction is approved? | approve_option_b_visual_only_quieter | keep_as_is \| approve_option_b_visual_only_quieter \| request_copy_link_review \| reduce_card_exposure \| park | owner decision; lower-section mobile before screenshot; lower-section desktop before screenshot | no until local diff and QA pass | Recommended path preserves legal-help-first homepage and avoids changing the user promise. |
| HLCG-DECISION-02 | Should the repeated visible label change? | no_label_change_for_first_pass | no_label_change_for_first_pass \| approve_exact_hebrew_label \| decide_after_profile_destination_review | copy/link destination review if any label changes | no until exact copy is approved | Label changes are riskier because current URLs are contact-form URLs. |
| HLCG-DECISION-03 | Which destination should future card actions prioritize? | keep_current_contact_destination_for_visual_only_pass | keep_current_contact_destination_for_visual_only_pass \| profile_first \| practice_page_first \| decide_later | associated-page and route-flow review if destination changes | no for destination changes | Destination changes affect conversion flow and should not be bundled into the first visual cleanup. |
| HLCG-DECISION-04 | What email/update rule applies? | email_only_after_verified_public_change | email_only_after_verified_public_change \| request_private_summary_now | review URL; public-change summary; associated pages; cannibalization notes; own concise review | no | No email is sent for this private guard because no public page changed. |

## Screenshot Template

| Capture ID | Stage | Viewport | URL | Target Area | File Name | Pass Criteria |
| --- | --- | --- | --- | --- | --- | --- |
| HLCG-SHOT-01 | before | mobile_390 | https://jus-tice.co.il/ | homepage lawyer-card section showing repeated card actions | .project-control/visual-evidence/homepage-cta-lower-section-before-mobile-2026-05-27.png | Buttons do not dominate the mobile section; no duplicated article CTA message; legal-help-first flow remains clear. |
| HLCG-SHOT-02 | before | desktop_1440 | https://jus-tice.co.il/ | homepage lawyer-card section showing repeated card actions | .project-control/visual-evidence/homepage-cta-lower-section-before-desktop-2026-05-27.png | Card actions are understood as card-local and do not compete with search/hero actions. |
| HLCG-SHOT-03 | after_local_or_staging | mobile_390 | local_or_staging_homepage_url | same lower lawyer-card section | .project-control/visual-evidence/homepage-cta-lower-section-after-mobile-2026-05-27.png | Quieter treatment remains tappable, readable and commercially useful without feeling like repeated sales pressure. |
| HLCG-SHOT-04 | after_local_or_staging | desktop_1440 | local_or_staging_homepage_url | same lower lawyer-card section | .project-control/visual-evidence/homepage-cta-lower-section-after-desktop-2026-05-27.png | Desktop cards remain scannable; primary homepage discovery flow stays visually dominant. |
| HLCG-SHOT-05 | after_live_if_deployed | mobile_390_and_desktop_1440 | https://jus-tice.co.il/ | post-deployment verification | .project-control/visual-evidence/homepage-cta-lower-section-live-after-2026-05-27.png | Live page matches approved treatment; CTA density audit and business-language scan pass before Hebrew owner email. |

## Safety Statement

This packet is private and repo-local. It prepares the next homepage review step only. No public page, CMS content, route, title/H1/meta/body, label, link, CSS/layout, redirect, canonical/noindex, sitemap, taxonomy, CRM record, lead, lawyer/supplier/client contact, invoice, payment, email, WhatsApp, TalkTo, wp-admin write, provider setting or uPress deployment changed.
