# Demand-Letter Public Update Approval Packet - 2026-05-27

Status: OWNER_REVIEW_PACKET_READY_NOT_APPROVED

Source route brief date: 2026-05-27

Scope: owner/SEO review packet for possible demand-letter CTAs on existing dispute-specific pages. This explicitly blocks a generic demand-letter page. It does not publish, edit CMS content, change SEO settings, add internal links, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact lawyers, invoice, charge payment, send email, use WhatsApp/TalkTo or deploy uPress.

## Summary

- Source route brief status: PUBLIC_UPGRADE_BRIEF_READY_NOT_APPROVED
- Source inventory rows behind the brief: 146
- Demand-letter source decisions found: 4
- Approval packet rows: 12
- Owner-review public copy rows: 9
- Hard blocker rows: 2
- Forbidden internal/business-plan marker hits: 0
- Public changes approved by this packet: 0

## Demand-Letter Split Rules

1. Do not create `/demand-letter/` or another generic warning-letter route from this packet.
2. If approved later, start with one dispute type only: employment, consumer, or rental dispute.
3. Keep the existing page intent intact. Demand-letter copy should be a subsection or contextual CTA, not the whole page promise.
4. Do not publish fixed price, checkout, AI drafting promise, outcome promise or law-firm positioning without the managed-service legal/payment gates.

## Proposed Owner-Review Copy

| ID | Route Group | Target | Section | Status | Item | Proposed Public Copy | Operator Note | Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DL-01 | global_blocker | NEW_GENERIC_DEMAND_LETTER_ROUTE | route_decision | BLOCKED | Generic demand-letter page | לא לפרסם עמוד מכתב התראה גנרי. לפצל לפי סוג סכסוך בלבד. | Generic intent collides with employment, consumer, rental and small-claims pages. | No generic page, no generic title and no one-size-fits-all legal-letter promise. |
| DL-02 | employment | https://jus-tice.co.il/labor-lawyer/ | title | OWNER_REVIEW_REQUIRED | Employment title direction | עורך דין דיני עבודה \| ייעוץ לפני מכתב התראה | Keep labor-lawyer as the broad employment route; add demand-letter language only as a contextual subsection. | Needs owner/SEO/legal approval before CMS edit. |
| DL-03 | employment | https://jus-tice.co.il/labor-lawyer/ | h2 | OWNER_REVIEW_REQUIRED | Employment subsection heading | מכתב התראה בדיני עבודה: מתי כדאי לבדוק עם עורך דין | Subsection language, not replacement H1. | Do not move above the primary labor-lawyer intent without SEO approval. |
| DL-04 | employment | https://jus-tice.co.il/labor-lawyer/ | cta | OWNER_REVIEW_REQUIRED | Employment contextual CTA | קיבלתם מכתב ממעסיק או שוקלים לשלוח מכתב התראה בעניין עבודה? השאירו פרטים ונפנה לעורך דין מתאים. | Single legal-help CTA. No fixed price and no outcome promise. | Needs duplicate-CTA mobile QA before publication. |
| DL-05 | consumer | https://jus-tice.co.il/consumer-rights-israel/ | title | OWNER_REVIEW_REQUIRED | Consumer title direction | זכויות צרכן בישראל \| ביטול, החזר ומכתב פנייה | Consumer route can mention a request/warning letter only within refund/cancellation context. | Needs owner/SEO/legal approval before CMS edit. |
| DL-06 | consumer | https://jus-tice.co.il/consumer-rights-israel/ | h2 | OWNER_REVIEW_REQUIRED | Consumer subsection heading | מכתב לעסק לפני תביעה צרכנית | Use only after explaining rights, evidence and deadlines. | No generic legal-letter framing. |
| DL-07 | consumer | https://jus-tice.co.il/consumer-rights-israel/ | cta | OWNER_REVIEW_REQUIRED | Consumer contextual CTA | הספק מסרב להחזר, לביטול או לתיקון? עורך דין יכול לבדוק אם נכון לשלוח מכתב פנייה או להתכונן לתביעה. | Keeps the user intent on consumer remedies. | Needs owner approval before any public CTA. |
| DL-08 | rental_dispute | https://jus-tice.co.il/eviction-notice-israel/ | title | OWNER_REVIEW_REQUIRED | Rental dispute title direction | פינוי שוכר \| הליך, מכתב וזכויות | Keep eviction-notice intent separate from rental-agreement drafting/review. | Needs owner/SEO/legal approval before CMS edit. |
| DL-09 | rental_dispute | https://jus-tice.co.il/eviction-notice-israel/ | h2 | OWNER_REVIEW_REQUIRED | Rental dispute subsection heading | מכתב התראה או מכתב פינוי בסכסוך שכירות | Rental-dispute subsection only; do not merge with rental-agreement review. | Needs associated page review before internal links. |
| DL-10 | rental_dispute | https://jus-tice.co.il/eviction-notice-israel/ | cta | OWNER_REVIEW_REQUIRED | Rental dispute contextual CTA | מדובר בסכסוך שכירות או במכתב פינוי? השאירו פרטים לבדיקת התאמה לעורך דין. | Narrow CTA for disputes only. | Needs owner approval before any public CTA. |
| DL-11 | associated_pages | MULTI_ROUTE_REVIEW | associated_pages | REVIEW_BEFORE_PUBLICATION | Pages to inspect for links/cannibalization | /wrongful-termination-israel/; /employment-contract-termination/; /severance-pay-calculator/; /small-claims-court-israel/; /tenant-eviction-defense/; /landlord-rights-israel/; /rental-agreement-guide/ | Use this list for owner publication email if any route is eventually updated. | No internal links until owner/SEO approval. |
| DL-12 | publication_blockers | MULTI_ROUTE_REVIEW | publication_blockers | BLOCKED | Hard blockers | לא לפרסם ללא אישור בעלים, בדיקת SEO, בדיקה משפטית, נתיב עורך דין, בדיקת כפילות CTA במובייל, והחלטה באיזה סוג סכסוך מתחילים. | This row is the stop sign for remote operators. | Public launch blocked. |

## Associated / Cannibalizing Pages To Review

- `/wrongful-termination-israel/`
- `/employment-contract-termination/`
- `/severance-pay-calculator/`
- `/small-claims-court-israel/`
- `/tenant-eviction-defense/`
- `/landlord-rights-israel/`
- `/rental-agreement-guide/`

## Pre-Publication QA

1. Confirm the owner approved one route and one dispute type.
2. Confirm legal/source review for the dispute-specific wording.
3. Confirm SEO review for title/subheading/meta impact and internal links.
4. Confirm the article/mobile CTA is not duplicated after publication.
5. Confirm no public text mentions revenue, pilots, Lawhive, internal package economics or business-plan reasoning.
6. If eventually published, send the owner a Hebrew email with review URL, content summary, associated/cannibalizing pages and one concise review.

## Safety Statement

This packet is ready for owner review only. It does not authorize publication or monetization. A user should see help with a specific legal dispute, not a generic product page.
