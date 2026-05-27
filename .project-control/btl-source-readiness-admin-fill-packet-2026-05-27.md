# BTL Source Readiness Admin Fill Packet - 2026-05-27

Status: BTL_SOURCE_READINESS_ADMIN_FILL_PACKET_READY_BLOCKED_ON_OWNER_ADMIN_EVIDENCE_NO_LIVE_ACTION

Scope: private owner/admin source-readiness packet only. It does not create prospects, create or edit CRM records, contact lawyers, contact clients, route PII, invoice, charge payment, mark paid revenue, publish public pages, change SEO controls, send email/WhatsApp/TalkTo, call GSC/API services, edit wp-admin, or deploy uPress.

## Source Statuses

- Runtime ledger (2026-05-27): BLOCKED_SOURCE_READINESS_NOT_CURRENT
- Controlled dry-run (2026-05-27): BLOCKED_STATIC_GATE_MISSING
- First paid-lead readiness (2026-05-27): BLOCKED_STATIC_GATES
- Prospect activation (2026-05-27): READY_FOR_OWNER_PRIVATE_PROSPECT_ENTRY

## Counts

- Admin fill rows: 8
- Private prospect rows: 3
- Coverage rows: 1
- Controlled lead rows: 1
- Billing/payment rows: 2
- Blocked/review gates: 1
- Live/public approvals: 0

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| BTL-SOURCE-GATE-01 | source_rows_indexed | PASS | 8 ledger rows converted into owner/admin fill rows. | Owner/admin fills the no-PII template from private wp-admin evidence only. |
| BTL-SOURCE-GATE-02 | runtime_readiness_still_blocked | BLOCKED_OWNER_ADMIN_EVIDENCE_REQUIRED | Runtime ledger: BLOCKED_SOURCE_READINESS_NOT_CURRENT; dry-run: BLOCKED_STATIC_GATE_MISSING; readiness: BLOCKED_STATIC_GATES; activation: READY_FOR_OWNER_PRIVATE_PROSPECT_ENTRY. | Treat this as a live-evidence request, not approval to create or edit records. |
| BTL-SOURCE-GATE-03 | payment_proof_rule_preserved | PASS | PAYMENT-01 requires private payment evidence URL; invoice/reference alone remains invoice-stage evidence. | Do not count paid revenue until payment proof is recorded privately. |
| BTL-SOURCE-GATE-04 | no_live_action_authorized | PASS_NO_LIVE_ACTION | This packet records 0 wp-admin/CRM/contact/invoice/payment/email/WhatsApp/TalkTo/public/uPress approvals. | Use filled rows for a later private proof review only. |

## Owner/Admin Fill Rows

| ID | Sequence | Stage | Current Status | Required Private Evidence | CRM Fields / Anchors | Blocker If No |
| --- | ---: | --- | --- | --- | --- | --- |
| PROSPECT-01 | 1 | private_specialist_supply | NEEDS_OWNER_ADMIN_EVIDENCE | Private prospect exists and license/status, Bituach Leumi appeal fit, response SLA, payment path, lead-fee terms and billing contact are all recorded. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid | Private prospect is created and all manual verification fields pass. |
| PROSPECT-02 | 2 | private_specialist_supply | NEEDS_OWNER_ADMIN_EVIDENCE | Private prospect exists and license/status, Bituach Leumi appeal fit, response SLA, payment path, lead-fee terms and billing contact are all recorded. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid | Private prospect is created and all manual verification fields pass. |
| PROSPECT-03 | 3 | private_specialist_supply | NEEDS_OWNER_ADMIN_EVIDENCE | Private prospect exists and license/status, Bituach Leumi appeal fit, response SLA, payment path, lead-fee terms and billing contact are all recorded. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid | Private prospect is created and all manual verification fields pass. |
| LAWYER-COVERAGE-01 | 4 | routable_lawyer_coverage | NEEDS_OWNER_ADMIN_EVIDENCE | At least 3 routable lawyer profiles exist for Bituach Leumi appeal work with routing enabled, accepted terms and billing/contact email. | lead_routing_enabled=1; subscription_status=trialing/active/paid only after owner approval; billing_invoice_email or contact email present | 3 verified prospects are converted into routable lawyer profiles and billing/contact is present. |
| CONTROLLED-LEAD-01 | 5 | controlled_lead | NEEDS_OWNER_ADMIN_EVIDENCE | One lead has explicit_match_consent or owner_verified_consent, routing_hold cleared only by owner workflow, and Bituach Leumi appeal intent. | consent_status=explicit_match_consent/owner_verified_consent; routing_hold cleared only after owner release; lead_revenue_model=qualified_appeal_lead | Client permission and owner release are recorded in the live CRM. |
| BILLING-01 | 6 | qualified_lead_billing | NEEDS_OWNER_ADMIN_EVIDENCE | Qualified lead billing status becomes ready_to_bill or invoice_sent with suggested lead price and linked billable lawyer. | qualified_lead_billing_status=ready_to_bill/invoice_sent; suggested_lead_price_ils>0; billable lawyer IDs linked | The controlled lead is routed and the billing queue shows a billable lead. |
| PAYMENT-01 | 7 | payment_proof | NEEDS_OWNER_ADMIN_EVIDENCE | Payment proof exists through a private payment evidence URL and status is paid; invoice/reference alone is invoice-stage evidence. | qualified_lead_billing_status=paid; qualified_lead_payment_evidence_url present | Owner/admin must create or verify private prospects, activate routable lawyer profiles, run one consented controlled lead, then record invoice/reference and private payment evidence. |
| GO-NOGO-01 | 8 | scale_decision | BLOCKED_UNTIL_PAYMENT_PROOF | 3 verified/routable specialists, 1 consented routed lead, invoice/reference, private payment evidence and no unresolved complaint/refund/ethics issue. | all prior ledger rows PASS in live admin evidence | PAYMENT-01 passes. |

## Run Order

1. Fill PROSPECT-01 through PROSPECT-03 from private wp-admin evidence only.
2. Confirm LAWYER-COVERAGE-01 only after verified prospects are routable and billing/contact fields are present.
3. Fill CONTROLLED-LEAD-01 only from a current consented Bituach Leumi lead with owner release.
4. Fill BILLING-01 after actual routing creates a qualified billable lead and invoice/reference evidence exists.
5. Fill PAYMENT-01 only when private payment evidence URL exists; invoice/reference alone is not paid proof.
6. Fill GO-NOGO-01 only after payment proof passes and owner reviews supply, consent, billing, refund and complaint risk.

## Decision

This packet makes the first paid Bituach Leumi blocker actionable, but it does not authorize live work. Blanks keep the first-paid-lead loop blocked and keep revenue at 0%.
