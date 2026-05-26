# Homepage CTA Density Review Packet - 2026-05-27

Status: OWNER_REVIEW_PACKET_READY_NOT_APPROVED

Target route: https://jus-tice.co.il/
Source CTA audit date: 2026-05-27

Scope: private owner/design review packet for the live homepage CTA density finding. This does not publish, edit CMS content, change homepage labels or links, alter title/H1/meta, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact lawyers, invoice, charge payment, send email, use WhatsApp/TalkTo or deploy uPress.

## Summary

- Source audit rows: 10
- Homepage HTTP status: 200
- Homepage audit status: REVIEW
- Homepage primary CTA count: 10
- Homepage unique primary CTA texts: 5
- Repeated homepage CTA text groups: שליחת פנייה (6)
- Review option rows: 4
- Guardrail / QA rows: 2
- Forbidden internal/business-plan marker hits: 0
- Public changes approved by this packet: 0

## Review Rows

| ID | Section | Status | Item | Evidence | Recommendation | Owner Decision Needed | Public Change Approved | Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HCTA-01 | finding | REVIEW_NEEDED | Homepage repeated CTA density finding | Homepage audit status: REVIEW; primary CTAs: 10; unique CTA texts: 5; repeated text groups: שליחת פנייה (6). | Treat this as a visual/content decision before adding more homepage CTAs or managed-service copy. | Confirm whether repeated lawyer-card action labels are acceptable, should be quieter, or should become contextual. | no | No homepage CTA label, link, section or CMS change is approved by this packet. |
| HCTA-02 | option | OPTION_LOW_RISK_KEEP_AS_IS | Option A - keep repeated labels for now | The repeated buttons point to different lawyer contact URLs and no repeated href group was found in the audit. | Keep current live homepage unchanged until a broader homepage design pass is approved. | Approve leaving the current repeated visible label as-is for now. | no | Still block adding new homepage CTA blocks until density is reviewed again. |
| HCTA-03 | option | OPTION_NEEDS_VISUAL_QA | Option B - make repeated lawyer-card actions visually quieter | The repeated text appears inside a card/list pattern, where each card can keep a local action without competing with main page CTAs. | Consider a subtler secondary-action style or compact icon/text treatment for lawyer cards while keeping main legal-help CTAs clearer. | Approve a design treatment after mobile and desktop screenshot review. | no | Needs local theme diff, mobile screenshot, desktop screenshot and CTA density rerun before publication. |
| HCTA-04 | option | OPTION_NEEDS_COPY_REVIEW | Option C - vary lawyer-card labels by user intent | The live homepage currently repeats one visible action label across several lawyer cards. | Test contextual labels such as "פרטי עורך הדין" or "בדיקת התאמה" only if the actual target and user expectation match. | Approve exact Hebrew labels and decide whether card clicks go to contact or profile. | no | Do not create misleading labels; copy needs user-intent review and link-destination review. |
| HCTA-05 | option | OPTION_HIGHER_DESIGN_IMPACT | Option D - reduce lawyer-card CTA exposure | Homepage has 10 primary CTAs in the current audit, with lawyer-card actions making up most of the repeated visible label. | Consider showing fewer cards or one section-level CTA if mobile feels too sales-heavy. | Approve a larger homepage layout decision before implementation. | no | Higher public UX impact; requires competitor-inspired design review and stronger visual QA. |
| HCTA-06 | guardrail | HARD_GUARDRAIL | Keep public site as legal help first | Owner explicitly objected to public copy that exposes revenue logic or business-plan language. | Any public homepage copy must stay reader-facing: legal problem, lawyer fit, guidance and trust. | None until a concrete homepage change is proposed. | no | No business-plan, revenue, package-economics, supplier marketplace or internal routing language on the public homepage. |
| HCTA-07 | associated_pages | REVIEW_BEFORE_PUBLIC_CHANGE | Associated pages and surfaces to inspect | /lawyers/; /find-lawyer-how-to-find-good-attorney/; /national-insurance-attorney/; /bituach-leumi-appeal-guide/; /rental-agreement/; /labor-lawyer/; /consumer-rights-israel/; /eviction-notice-israel/ | If homepage card actions change, inspect these pages for internal-link flow, repeated CTA language and cannibalization context. | Choose whether homepage lawyer-card traffic should primarily feed lawyer profiles, contact forms or practice pages. | no | No internal link or public route decision from this packet alone. |
| HCTA-08 | qa_before_publication | REQUIRED_BEFORE_PUBLIC_CHANGE | Required QA before any homepage CTA change goes live | The current audit is read-only and does not include screenshots. | Before publishing: mobile screenshot, desktop screenshot, live/public business-language audit, CTA density rerun, private artifact boundary guard and Hebrew owner email with associated-page notes. | Approve exact implementation option first. | no | No uPress pull or owner email until a real public change is implemented and live-verified. |

## Recommended Decision Path

1. Do not add more homepage CTAs until this repeated-card-label issue is reviewed visually.
2. Prefer Option A if the owner wants zero immediate public risk.
3. Prefer Option B only after mobile and desktop screenshots confirm the lawyer-card section feels quieter and still usable.
4. Treat Option C and Option D as larger homepage product/design decisions.

## Safety Statement

This packet is deliberately local and private. It converts a live-audit review item into owner options, but it does not approve any public-facing change.
