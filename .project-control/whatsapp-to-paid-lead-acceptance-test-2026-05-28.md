# WhatsApp to Paid Lead Acceptance Test - 2026-05-28

Status: NO_LIVE_MESSAGE_OR_CRM_ACTION

Scope: private operator acceptance test for turning one WhatsApp inquiry into a qualified, billable lead. This does not click WhatsApp, send messages, create CRM records, contact users/lawyers/suppliers, send invoices, charge payments, publish content, change CMS/database content, change redirects/canonicals/noindex/sitemap/taxonomy, or deploy.

## Revenue Goal

Turn visible WhatsApp demand into a controlled paid handoff path:

`public WhatsApp intent -> owner manual CRM capture -> first attempt -> qualification -> lawyer/supplier fit -> ready_to_bill -> invoice_sent -> paid only with payment evidence`.

## Preconditions

| Gate | Required Evidence | Pass Condition | Forbidden Shortcut |
| --- | --- | --- | --- |
| public_source | URL, surface, topic, and source channel from the WhatsApp CTA. | Source can be captured without exposing private data. | Do not rely on memory or untracked chat screenshots. |
| consent | User permission to continue follow-up and route to lawyer/supplier. | Consent status is routeable before handoff. | Do not route PII without permission. |
| first_attempt | Owner/operator call or message attempt. | First attempt is logged within the SLA target. | Do not claim follow-up from an unlogged action. |
| qualification | Practice area, city, urgency, notes, and budget/payment potential. | Lead is either qualified, not qualified, or needs more info. | Do not send vague leads to lawyers. |
| lawyer_supplier_fit | Matched lawyer/supplier has practice/location fit and accepted terms. | Fit and commercial terms are documented. | Do not hand off to unpaid/unapproved provider as a paid lead. |
| ready_to_bill | Owner release, routeable consent, billable lawyer/supplier IDs, and price. | CRM can move to ready_to_bill. | Do not request invoice before terms and release. |
| invoice_sent | Real invoice/payment request reference exists. | CRM can move to invoice_sent. | Do not mark paid at invoice_sent. |
| paid | Private payment evidence URL exists. | Paid status may be recorded with proof. | Do not count revenue without evidence. |

## Operator Run Sheet

1. Record `source_channel=whatsapp`, `lead_source_surface`, source URL, topic, city, urgency, and no-PII summary.
2. Confirm user permission for follow-up and lawyer/supplier matching.
3. Log first attempt and next follow-up due time.
4. Qualify practice area, city, urgency, timeline, and expected commercial value.
5. Select a lawyer/supplier only after fit, availability, accepted terms, and billing path are known.
6. Move to `ready_to_bill` only after owner release and billable provider IDs exist.
7. Move to `invoice_sent` only after a real invoice/payment request reference exists.
8. Move to `paid` only after private payment evidence URL exists.

## Minimum Fields

| Field | Required | Notes |
| --- | --- | --- |
| source_channel | yes | `whatsapp`. |
| lead_source_surface | yes | Example: homepage_hero, mobile_menu, footer_trust_path. |
| source_url | yes | Public page that generated the click. |
| topic_or_practice_area | yes | Legal intent. |
| city | if known | Needed for matching. |
| urgency | yes | SLA and routing priority. |
| consent_status | yes | Must be routeable before handoff. |
| first_attempt_at | after action | Required before claiming follow-up. |
| matched_provider_ids | before billing | Lawyer/supplier IDs or controlled internal IDs. |
| accepted_terms_status | before billing | Required before ready_to_bill. |
| suggested_lead_price_ils | before billing | Owner-approved price only. |
| invoice_reference | after sent | Required for invoice_sent. |
| private_payment_evidence_url | after proof | Required for paid. |

## Verification Commands

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-whatsapp-intake-router.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-lead-crm-operator-readiness.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-whatsapp-to-paid-lead-acceptance.ps1
```

## Current Verification

- WhatsApp intake router: PASS at 2026-05-28T00:32Z.
- Lead CRM operator readiness: PASS at 2026-05-28T00:32Z.
- Acceptance packet: added this cycle.

## Current Blockers

- No real WhatsApp message or CRM record was created in this cycle.
- No routeable customer consent was verified in this cycle.
- No matched paid lawyer/supplier accepted terms in this cycle.
- No invoice/payment request was sent.
- No payment evidence URL exists.
- Grow/Meshulam payment proof remains blocked.

## Honesty Statement

This is a controlled acceptance test and operator packet. It makes the WhatsApp-to-paid-lead workflow auditable, but it does not prove a real lead, real handoff, invoice, payment, CRM update, or revenue.
