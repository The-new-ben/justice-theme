# Bituach Leumi Controlled Lead Dry-Run Packet - 2026-05-27

Status: BTL_CONTROLLED_DRY_RUN_READY_NO_LIVE_ACTION

Source ledger date: 2026-05-27

Purpose: give the owner/admin a no-PII dry-run worksheet for the first Bituach Leumi paid-lead loop, from private specialist supply through consent, no-PII preview, owner release, billing proof and scale decision.

Safety: no wp-admin action, CRM record, prospect record, lead, lawyer contact, client contact, WhatsApp/TalkTo/email message, invoice, payment, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, provider setting or uPress deployment was performed.

## Generated Files

- Private report: `.project-control\btl-controlled-lead-dry-run-packet-2026-05-27.md`
- Private CSV: `.project-control\btl-controlled-lead-dry-run-packet-2026-05-27.csv`
- Fillable dry-run template: `.project-control\btl-controlled-lead-dry-run-template-2026-05-27.csv`
- Machine JSON: `.reports\btl-controlled-lead-dry-run-packet-2026-05-27.json`
- Machine CSV: `.reports\btl-controlled-lead-dry-run-packet-2026-05-27.csv`

## Summary

- Static gates passing: 5/5
- Dry-run rows: 10
- Supply rows: 4
- Consent/client rows: 1
- Billing/payment rows: 2
- Live records created: 0
- Messages sent: 0
- Revenue claims approved: 0
- Public changes approved: 0

## Static Gates

| ID | Gate | Status | Evidence |
| --- | --- | --- | --- |
| CHECK-01 | runtime ledger available | PASS | RUNTIME_LEDGER_READY_NO_REVENUE_CLAIM |
| CHECK-02 | consent message pack available without send approval | PASS | CONSENT_MESSAGE_PACK_READY_FOR_OWNER_LEGAL_REVIEW_NO_SEND |
| CHECK-03 | manual invoice fallback available without live payment action | PASS | MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION |
| CHECK-04 | routing hold and external consent guard present | PASS | inc/lead-routing.php routing_hold plus routeable consent markers |
| CHECK-05 | qualified lead billing proof fields present | PASS | inc/lead-crm.php separates invoice reference from paid payment-evidence proof |

## Dry-Run Rows

| ID | Sequence | Phase | Owner/Admin Action | Required Proof | Pass Condition | Fail Stop | CRM Anchor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DRILL-PROSPECT-01 | 1 | supply | Create or verify private Bituach Leumi prospect 1 in wp-admin only. | License/status verified; direct Bituach Leumi appeal fit verified; response SLA recorded; accepted lead-fee or subscription terms recorded; billing contact recorded. | All private prospect verification fields pass and owner approves routable activation. | Any missing license, fit, terms, billing contact or owner approval blocks routing. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid |
| DRILL-PROSPECT-02 | 2 | supply | Create or verify private Bituach Leumi prospect 2 in wp-admin only. | License/status verified; direct Bituach Leumi appeal fit verified; response SLA recorded; accepted lead-fee or subscription terms recorded; billing contact recorded. | All private prospect verification fields pass and owner approves routable activation. | Any missing license, fit, terms, billing contact or owner approval blocks routing. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid |
| DRILL-PROSPECT-03 | 3 | supply | Create or verify private Bituach Leumi prospect 3 in wp-admin only. | License/status verified; direct Bituach Leumi appeal fit verified; response SLA recorded; accepted lead-fee or subscription terms recorded; billing contact recorded. | All private prospect verification fields pass and owner approves routable activation. | Any missing license, fit, terms, billing contact or owner approval blocks routing. | prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid |
| DRILL-COVERAGE-01 | 4 | supply | Confirm the first paid-lead preflight shows 3 routable Bituach Leumi specialists. | Published/private lawyer profiles are routable, have Bituach Leumi area, routing enabled, accepted commercial terms, billing contact and remaining lead capacity. | Preflight has no supply, billing or routing-capacity blockers. | Fewer than 3 routable specialists blocks the controlled lead drill. | wp-admin -> Justice CRM -> Bituach Leumi specialist supply -> First paid-lead routing preflight |
| DRILL-CLIENT-01 | 5 | consent | Select one current Bituach Leumi lead with explicit match permission. | Lead has explicit_match_consent or owner_verified_consent, owner release note, Bituach Leumi appeal intent and no do-not-contact signal. | Consent evidence and owner release are recorded before routing_hold is cleared. | No explicit permission, unclear permission, old legacy row, or do-not-contact blocks the drill. | wp-admin -> Justice CRM -> Held Bituach Leumi lead triage / permission queue |
| DRILL-PREVIEW-01 | 6 | partner_preview | Prepare a no-PII preview of the controlled Bituach Leumi lead. | Preview includes general issue, urgency and region only if safe; excludes name, phone, email, exact address, documents and raw WhatsApp/TalkTo content. | Partner terms and billing contact are already accepted before any PII release. | Partner has not accepted terms or billing contact, or preview contains PII. | wp-admin -> Justice CRM -> Partner preview / terms queue |
| DRILL-ROUTE-01 | 7 | manual_handoff | Perform one controlled manual/routed handoff after all prior proof rows pass. | Owner release confirms client permission, accepted partner terms, billing contact, manual-only scope and lead price/fee. | The lead reaches one accepted specialist and creates a qualified billing queue item. | Any missing owner release, partner terms or consent keeps routing_hold on. | wp-admin -> Justice CRM -> Owner handoff release queue |
| DRILL-BILLING-01 | 8 | billing | Record manual invoice/payment request for the accepted partner. | Qualified lead billing status, invoice reference or payment request reference, suggested price and billable partner are recorded. | Invoice_sent can be recorded only with reference; paid can be recorded only with proof. | No invoice/reference means no invoice_sent; no payment evidence means no paid revenue claim. | wp-admin -> Justice CRM -> Qualified lead billing queue |
| DRILL-PAYMENT-01 | 9 | payment_proof | Verify actual payment proof exists before counting revenue. | qualified_lead_billing_status=paid and private payment evidence URL is present; invoice reference alone is not paid proof. | Paid status has proof, no refund/dispute/complaint is open, and owner confirms one-time revenue count. | Any missing proof, dispute, refund, complaint or ethics concern blocks revenue count. | wp-admin -> Justice CRM -> Qualified lead billing queue |
| DRILL-SCALE-01 | 10 | scale_decision | Decide whether to repeat, repair or stop the Bituach Leumi paid-lead loop. | All prior drill rows pass; owner confirms supply quality, consent process, billing proof, refund path and no unresolved complaints. | Owner approves controlled repeat batches, or holds for repair. | Any unresolved blocker keeps the loop in controlled/manual mode only. | Owner review after live CRM proof exists |

## Completion Rule

This packet is complete as a private dry-run artifact, but the business loop is not complete. The first paid Bituach Leumi lead can be counted only when the fillable template is completed from live wp-admin evidence and `DRILL-PAYMENT-01` passes with payment proof.

## Linear Anchors

- Parent: `HAD-76` Bituach Leumi first paid-lead loop.
- Related: `HAD-134` runtime proof ledger, `HAD-148` consent message pack, `HAD-142` manual invoice fallback, `HAD-87` WhatsApp/TalkTo CRM.
