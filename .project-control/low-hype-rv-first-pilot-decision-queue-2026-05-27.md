# Low Hype / RV First Pilot Decision Queue - 2026-05-27

Status: LOW_HYPE_RV_FIRST_PILOT_DECISION_QUEUE_READY_NO_PUBLIC_CHANGE

Scope: private owner/operator decision queue only. This does not approve public pages, public Low Hype labels, CMS content, route changes, title/H1/meta changes, internal links, CRM records, lead handoffs, lawyer/supplier outreach, invoices, payments, email, WhatsApp/TalkTo actions, GSC API calls or uPress deployment.

## Working Decision

No standalone RV route. If the owner wants to continue, the only plausible first pilot is a private RV rental/deposit/charge dispute path attached later to existing consumer/rental surfaces after GSC, legal/editor and owner review.

## Source Statuses

- Opportunity brief: PRIVATE_OPPORTUNITY_BRIEF_READY_NOT_APPROVED_FOR_PUBLICATION
- SERP/cannibalization packet: SERP_REVIEW_PACKET_READY_NOT_APPROVED_FOR_PUBLICATION
- Route-overlap packet: INTERNAL_ROUTE_OVERLAP_READY_NO_PUBLIC_ACTION
- GSC evidence request: GSC_EVIDENCE_REQUEST_READY_EXPORT_NOT_FILLED
- Private intake checklist: PRIVATE_INTAKE_CHECKLIST_READY_NO_PUBLIC_OR_CRM_ACTION

## Summary

- Decision rows: 8
- Owner-decision template rows: 8
- Owner-decision rows: 2
- Blocked/review-required rows: 8
- Public changes approved: 0
- CRM/lead/lawyer/supplier/payment/email/WhatsApp/TalkTo actions: 0

## Decision Queue

| ID | Decision Area | Current Evidence | Owner Decision Needed | Default Safe Decision | Allowed Next Action | Blocked Action | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| QUEUE-01 | low_hype_visibility | Low Hype is useful as a private operating label, but public users should only see legal-help language. | Confirm Low Hype remains internal-only for now. | Keep internal-only. | Use Low Hype as a private prioritization tag in Linear and repo packets. | Do not publish Low Hype navigation, public brand copy, public route, metadata or CTA wording. | OWNER_DECISION_REQUIRED |
| QUEUE-02 | first_pilot_topic | RV rental/deposit/charge dispute attached to existing consumer/rental surfaces | Approve, reject or park RV rental/deposit/charge as the only first pilot. | Park until GSC/export evidence is filled. | If owner approves, continue only as private evidence and owner-review intake. | Do not open accident, insurance, traffic, import or municipal-fine tracks as part of the first pilot. | OWNER_DECISION_REQUIRED |
| QUEUE-03 | gsc_export_gate | The GSC template exists, but query/page rows are not filled. | Export/paste Search Console rows for caravan/RV/rental/deposit/charge plus candidate pages. | No public copy while export is empty. | Fill the private GSC template and classify every row by route family. | Do not write title, H1, meta, public section, internal link, canonical, sitemap or CMS copy before GSC review. | BLOCKED_PENDING_GSC_EXPORT |
| QUEUE-04 | route_owner | Route overlap found consumer-rights as the primary surface and rental-agreement as an adjacent surface; no existing RV marker route was found. | Choose whether an approved pilot would attach to consumer-rights, rental-agreement or stay private-only. | No standalone RV route. | Prepare only a route-decision map after GSC/legal review if evidence supports public work. | Do not create a standalone RV/caravan/campervan URL from the current evidence. | ROUTE_DECISION_BLOCKED |
| QUEUE-05 | legal_category | SERP and route packets show mixed consumer, rental, insurance, accident and traffic intent. | Legal/editor reviewer must confirm whether the first pilot is consumer/rental only. | Consumer/rental candidate only; specialist paths parked. | Escalate insurance, accident, injury, traffic or urgent limitation facts out of this pilot. | Do not publish legal advice, demand-letter wording, insurance coverage guidance or outcome claims. | LEGAL_REVIEW_REQUIRED |
| QUEUE-06 | private_intake_and_consent | Private intake checklist is ready for current inbound only; legacy WhatsApp/TalkTo rows need fresh permission. | Approve the exact no-PII intake fields and re-permission policy before any real lead handling. | Current inbound only after explicit permission; old leads parked. | Use the private intake template with source channel, permission status and no-PII evidence flags. | Do not import old chats, bulk message, call, email, match, or share PII with partners from this queue. | PRIVATE_INTAKE_READY_LIVE_ACTION_BLOCKED |
| QUEUE-07 | partner_and_payment_path | No partner terms, billing contact, invoice reference or payment proof exists for this RV pilot. | Confirm partner terms and billing proof rules before any lawyer/supplier preview. | No PII release and no revenue claim. | Prepare only anonymized partner preview fields after permission and owner release are present. | Do not contact lawyers/suppliers, send raw chats/files, invoice, mark paid or claim revenue. | PAYMENT_AND_PARTNER_PROOF_BLOCKED |
| QUEUE-08 | public_copy_gate | All source packets keep public changes at zero and block standalone RV publication. | Owner, SEO and legal/editor must approve exact text, placement and post-publication QA before any public edit. | No public change. | After all prior gates pass, draft a tiny public-review packet for one existing route only. | Do not change CMS content, titles, H1, meta, links, redirects, canonicals/noindex, sitemaps, taxonomies or uPress. | PUBLIC_COPY_BLOCKED |

## Allowed Next 48-Hour Move

1. Fill the owner decision template with approve/reject/park/needs_more_evidence for each row.
2. If the RV pilot is still interesting, fill the GSC query/page template before drafting any public copy.
3. Use the no-PII intake template only for current inbound users with explicit permission; keep legacy chats parked.

## Own Review

This queue is useful because it turns several private packets into one decision surface. It also prevents the tempting but risky move: launching a generic RV page before demand, route ownership, legal category and consent/payment gates are proven.

## Safety Statement

This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue, call the GSC API or require uPress deployment.
