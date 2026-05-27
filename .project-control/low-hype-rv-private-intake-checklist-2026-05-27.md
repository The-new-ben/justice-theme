# Low Hype / RV Private Intake Checklist - 2026-05-27

Status: PRIVATE_INTAKE_CHECKLIST_READY_NO_PUBLIC_OR_CRM_ACTION

Scope: private intake and consent checklist only. This does not create CRM records, contact old leads, contact lawyers or suppliers, send email/WhatsApp/TalkTo messages, invoice, mark paid, publish public content or deploy.

## Working Decision

Use this only for a narrow private RV rental/deposit/charge triage path. It is not a public page plan, not a legal-advice draft and not permission to process legacy chats.

## Source Gates

- GSC evidence request: GSC_EVIDENCE_REQUEST_READY_EXPORT_NOT_FILLED
- Internal route overlap: INTERNAL_ROUTE_OVERLAP_READY_NO_PUBLIC_ACTION
- SERP/cannibalization packet: SERP_REVIEW_PACKET_READY_NOT_APPROVED_FOR_PUBLICATION
- Public changes approved: 0
- CRM records or outreach actions approved: 0

## Checklist

| ID | Stage | Question / Check | Allowed Response | Blocker | Forbidden Action |
| --- | --- | --- | --- | --- | --- |
| INTAKE-01 | permission_and_source | Is this a current inbound person asking for help now, or an old WhatsApp/TalkTo lead? | Current inbound may continue only after explicit permission to check lawyer/supplier fit. Old leads require re-permission first. | Missing explicit permission or owner-approved re-permission path. | Do not contact old leads, lawyers or suppliers from this row. |
| INTAKE-02 | problem_classification | Is the problem limited to rental, deposit, post-return charge, cancellation, refund, damage charge or rental terms? | Yes means candidate for the narrow private RV rental/deposit/charge pilot. No means park or route to separate review. | Insurance, accident, injury or traffic facts appear in the same story. | Do not merge accident, insurance or traffic matters into this first pilot. |
| INTAKE-03 | evidence_summary | Which neutral evidence exists: agreement, booking confirmation, invoice, photos, supplier messages, chargeback/refund attempt, dates and amount? | Collect a short no-PII evidence checklist before legal or partner preview. | No agreement, no invoice and no charge detail yet. | Do not forward private evidence to a lawyer/supplier until permission and owner release exist. |
| INTAKE-04 | value_and_suitability | Is the disputed amount and urgency suitable for paid help, small-claims guidance, or owner hold? | Classify as low, medium or high value; recommend no guarantee and no automatic paid handoff. | Value too low, facts unclear, or urgency needs a licensed lawyer immediately. | Do not promise recovery, price, timeline or lawyer acceptance. |
| INTAKE-05 | legal_review_gate | Has a licensed/legal reviewer approved the exact positioning before demand-letter, claim or negotiation wording? | Proceed only to owner-review/private legal-review queue; public advice remains blocked. | No legal review owner marked. | Do not generate public advice, coverage advice, demand letter text or claim text from this checklist. |
| INTAKE-06 | partner_preview | Can a lawyer or supplier receive only anonymized facts before client identity is released? | Yes, only after permission, partner terms status and owner release are recorded. | No accepted partner terms or no explicit client permission. | Do not send name, phone, email, chat transcript, booking number or files to a partner. |
| INTAKE-07 | billing_and_payment_proof | Are accepted terms, billing contact, invoice reference and payment proof available? | Count invoice-stage follow-up from invoice/reference; count paid money only after private payment proof exists. | No invoice reference, no payment evidence or no accepted partner terms. | Do not mark paid, claim revenue or route as paid lead without private payment proof. |
| INTAKE-08 | legacy_lead_repermission | For past WhatsApp/TalkTo leads, is there a fresh permission message or owner-approved re-permission workflow? | If yes, continue as current inbound only after the new permission. If no, keep parked. | Old lead without fresh permission. | Do not bulk message, import, match, call or email old leads from this checklist. |
| INTAKE-09 | public_site_boundary | Does this intake evidence justify a public page or public section today? | No. Keep private-only until GSC export, owner decision and legal review approve exact text. | GSC export template is not filled. | Do not change title, H1, meta, URL, internal links, canonical, sitemap or CMS content. |
| INTAKE-10 | blocked_path_escalation | Does the story include insurance coverage, accident, injury, traffic fine, criminal/regulatory or urgent limitation-period facts? | Escalate out of the Low Hype RV rental pilot and park for specialist review. | Specialist legal path needed. | Do not treat specialist cases as consumer/rental managed-service leads without legal review. |

## Operator Template

Blank no-PII template rows generated in `.project-control/low-hype-rv-private-intake-template-2026-05-27.csv`: 10.

## Review Notes

- Current inbound users can be triaged only when they explicitly ask for help and permission is recorded.
- Old WhatsApp/TalkTo leads stay parked until a fresh re-permission path is approved.
- Accident, insurance, injury and traffic paths are outside this first pilot and require separate specialist review.
- Public RV copy remains blocked until the GSC export is filled and owner/legal review approve exact placement.

## Safety Statement

This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue, call the GSC API or require uPress deployment.
