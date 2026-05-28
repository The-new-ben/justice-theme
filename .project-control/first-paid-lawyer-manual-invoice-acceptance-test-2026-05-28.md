# First Paid Lawyer Manual Invoice Acceptance Test - 2026-05-28

Status: NO_LIVE_PAYMENT_ACTION

Scope: private operator acceptance test for converting one controlled lawyer into a first paid lawyer through the manual invoice fallback. This does not create or edit public CMS/database content, WooCommerce products, gateway settings, lawyer users, lawyer profiles, leads, invoices, payments, refunds, WhatsApp messages, emails, redirects, canonicals, noindex, sitemap, taxonomy, or uPress deployment settings.

## Revenue Goal

Convert one owner-approved controlled lawyer into a paying lawyer without waiting for full Grow/Meshulam online checkout readiness.

## Funnel Step

`lawyer interest -> accepted terms -> billing contact -> manual invoice request -> invoice_sent -> paid only with private payment evidence URL`.

## Acceptance Gates

| Gate | Required Evidence | Pass Condition | Forbidden Shortcut |
| --- | --- | --- | --- |
| controlled_lawyer | Owner-approved lawyer or internal test record ID with no public publishing. | One scoped record is selected. | Do not bulk import or contact old prospects. |
| accepted_terms | Accepted plan/lead-fee/subscription terms and price. | Fee, billing period, and service promise are clear. | Do not request payment before terms are accepted. |
| billing_contact | Billing name, email, phone, VAT/company fields if needed. | Owner has enough details to issue or request an invoice/payment link. | Do not use scraped or guessed billing data. |
| manual_invoice_request | No-PII invoice packet exists for owner/operator action. | Packet includes plan, amount, billing contact status, source, and due date. | Do not send invoice/email/WhatsApp from generated text without owner action. |
| crm_status_ready_to_bill | CRM/lawyer record can be marked ready_to_bill only after consent and accepted terms. | Ready-to-bill state has lawyer ID and owner release. | Do not route paid leads before billing readiness. |
| crm_status_invoice_sent | Invoice/payment request reference exists. | Status can move to invoice_sent after owner actually sends invoice/payment request. | Do not mark paid at invoice_sent. |
| crm_status_paid | Private payment evidence URL exists. | Paid status has receipt/payment proof URL and paid_at timestamp. | do_not_mark_paid_without_evidence. |

## Operator Run Sheet

1. Select one controlled lawyer record.
2. Confirm plan name, plan price, billing period, and whether it is subscription, paid profile, lead package, or pay-per-lead.
3. Confirm accepted_terms and billing_contact.
4. Create a manual_invoice_request packet for owner action.
5. After the owner sends the invoice or payment request, store invoice reference and set `invoice_sent`.
6. After proof arrives, store `private_payment_evidence_url`, set `paid`, and only then count revenue.
7. If proof does not arrive by due date, set follow-up status to `payment_followup_due` and do not count revenue.

## Minimum Fields

| Field | Required | Notes |
| --- | --- | --- |
| controlled_record_id | yes | Internal/no-PII identifier. |
| lawyer_name_or_alias | yes | May be anonymized in reports. |
| plan_interest | yes | Example: lead_partner, paid_profile, subscription. |
| price_ils | yes | Use owner-approved amount only. |
| billing_period | yes | one_time, monthly, annual, per_lead. |
| accepted_terms_status | yes | accepted, pending, rejected. |
| billing_contact_status | yes | complete, partial, missing. |
| manual_invoice_reference | after sent | Required for invoice_sent. |
| private_payment_evidence_url | only after proof | Required for paid. |
| follow_up_due_at | yes | Owner/operator next action date. |

## Current Blockers

- Grow/Meshulam blocker: real payment, receipt, invoice, recurring debit, and settlement proof are not verified.
- Owner action required: only the owner/operator can send the actual invoice/payment request from the approved provider/account.
- No accepted real lawyer terms are verified in this cycle.
- No private payment evidence URL exists from this cycle.

## Verification Command

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-first-paid-lawyer-manual-invoice-packet.ps1
```

## Honesty Statement

This is an acceptance test and operator packet, not a live transaction. It makes the first paid lawyer path auditable, but it does not prove a paid lawyer, payment, invoice, subscription, CRM routing, or provider settlement. No WhatsApp/email/customer/lawyer outreach sent.
