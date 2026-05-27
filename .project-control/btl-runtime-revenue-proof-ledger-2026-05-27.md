# Bituach Leumi Runtime Revenue Proof Ledger - 2026-05-27

Status: BLOCKED_SOURCE_READINESS_NOT_CURRENT

Source packet date: 2026-05-27

Scope: private owner/admin no-PII proof ledger for the Bituach Leumi specialist-to-first-paid-lead loop. This does not create prospects, create leads, contact lawyers, contact clients, route PII, invoice, charge payment, publish public pages, change SEO controls, send email/WhatsApp, use TalkTo, edit wp-admin or deploy uPress.

## Summary

- Readiness source status: BLOCKED_STATIC_GATES
- Activation source status: READY_FOR_OWNER_PRIVATE_PROSPECT_ENTRY
- Source candidates: 19
- Primary private-entry prospects in source packet: 3
- Runtime proof ledger rows: 8
- Rows still requiring live owner/admin evidence: 7
- Revenue claims approved by this ledger: 0
- Public changes approved by this ledger: 0

## Ledger Rows

| ID | Stage | Current Status | Required Evidence | CRM Fields / Anchors | Pass Condition | Blocked Until |
| --- | --- | --- | --- | --- | --- | --- |
| PROSPECT-01 | private_specialist_supply | NEEDS_OWNER_ADMIN_EVIDENCE | Private prospect exists and license/status, Bituach Leumi appeal fit, response SLA, payment path, lead-fee terms and billing contact are all recorded. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid | All verification-missing checks are empty and owner confirms the prospect can become routable. | Private prospect is created and all manual verification fields pass. |
| PROSPECT-02 | private_specialist_supply | NEEDS_OWNER_ADMIN_EVIDENCE | Private prospect exists and license/status, Bituach Leumi appeal fit, response SLA, payment path, lead-fee terms and billing contact are all recorded. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid | All verification-missing checks are empty and owner confirms the prospect can become routable. | Private prospect is created and all manual verification fields pass. |
| PROSPECT-03 | private_specialist_supply | NEEDS_OWNER_ADMIN_EVIDENCE | Private prospect exists and license/status, Bituach Leumi appeal fit, response SLA, payment path, lead-fee terms and billing contact are all recorded. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid | All verification-missing checks are empty and owner confirms the prospect can become routable. | Private prospect is created and all manual verification fields pass. |
| LAWYER-COVERAGE-01 | routable_lawyer_coverage | NEEDS_OWNER_ADMIN_EVIDENCE | At least 3 routable lawyer profiles exist for Bituach Leumi appeal work with routing enabled, accepted terms and billing/contact email. | lead_routing_enabled=1; subscription_status=trialing/active/paid only after owner approval; billing_invoice_email or contact email present | Justice CRM first paid-lead preflight shows coverage ready and no billing/contact blockers. | 3 verified prospects are converted into routable lawyer profiles and billing/contact is present. |
| CONTROLLED-LEAD-01 | controlled_lead | NEEDS_OWNER_ADMIN_EVIDENCE | One lead has explicit_match_consent or owner_verified_consent, routing_hold cleared only by owner workflow, and Bituach Leumi appeal intent. | consent_status=explicit_match_consent/owner_verified_consent; routing_hold cleared only after owner release; lead_revenue_model=qualified_appeal_lead | The lead routes to an accepted specialist and creates qualified lead billing state. | Client permission and owner release are recorded in the live CRM. |
| BILLING-01 | qualified_lead_billing | NEEDS_OWNER_ADMIN_EVIDENCE | Qualified lead billing status becomes ready_to_bill or invoice_sent with suggested lead price and linked billable lawyer. | qualified_lead_billing_status=ready_to_bill/invoice_sent; suggested_lead_price_ils>0; billable lawyer IDs linked | Manual invoice/payment request is sent to recorded billing contact and invoice/payment reference is saved before invoice_sent. | The controlled lead is routed and the billing queue shows a billable lead. |
| PAYMENT-01 | payment_proof | NEEDS_OWNER_ADMIN_EVIDENCE | Payment proof exists through a private payment evidence URL and status is paid; invoice/reference alone is invoice-stage evidence. | qualified_lead_billing_status=paid; qualified_lead_payment_evidence_url present | Paid status has proof. The revenue loop can be counted once, with notes retained. | Owner/admin must create or verify private prospects, activate routable lawyer profiles, run one consented controlled lead, then record invoice/reference and private payment evidence. |
| GO-NOGO-01 | scale_decision | BLOCKED_UNTIL_PAYMENT_PROOF | 3 verified/routable specialists, 1 consented routed lead, invoice/reference, private payment evidence and no unresolved complaint/refund/ethics issue. | all prior ledger rows PASS in live admin evidence | Owner approves scale, or holds for fixes. | PAYMENT-01 passes. |

## Owner/Admin Run Order

1. Create the first three private Bituach Leumi prospects from the activation packet, if the owner approves live private entry.
2. Verify license/status, niche fit, response SLA, accepted fee, accepted terms and billing contact for each prospect.
3. Convert only verified prospects into routable lawyer profiles and confirm the first paid-lead preflight is green.
4. Use one consented controlled lead only; keep routing hold until consent and owner release are recorded.
5. After actual routing, use the qualified lead billing queue, send a manual invoice/payment request, and save proof before marking paid.
6. Count revenue only after payment proof exists; then decide whether to scale.

## Privacy Boundary

- Do not paste client names, phone numbers, emails, raw chats, screenshots, documents, exact addresses, invoice documents or private payment-proof URLs into repo artifacts.
- The generated template is a status ledger only. Live evidence belongs in wp-admin/private owner systems.
- Pressing a WhatsApp button is not enough permission for lawyer/supplier PII handoff.

## Source Files

- `.reports/btl-first-paid-lead-readiness-2026-05-27.json`
- `.reports/btl-first-prospect-activation-packet-2026-05-27.json`
