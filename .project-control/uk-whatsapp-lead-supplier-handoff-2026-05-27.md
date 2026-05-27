# UK WhatsApp Lead Supplier Handoff Packet - 2026-05-27

Status: UK_WHATSAPP_SUPPLIER_HANDOFF_PACKET_READY_NO_LIVE_ACTION

Purpose: convert the current owner-forwarded UK-law WhatsApp/email lead into a precise, consent-safe CRM-to-lawyer/supplier-to-money operating packet without storing client PII in repo artifacts.

Safety: no mailbox action, CMS publish, database edit, real CRM lead creation, partner contact, client contact, WhatsApp message, TalkTo message, webhook, payment, invoice, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin write or uPress action was performed.

## Summary

- Static code gates passing: 7/7
- Operator rows: 9
- Owner template rows: 11
- Real CRM leads created: 0
- Client/lawyer/supplier contacts made: 0
- Public changes approved: 0
- Revenue claimed: 0

## Static Source Gates

| ID | Gate | Status | File | Evidence | Markers | Missing | Next Step |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| UK-SRC-01 | manual_crm_bridge_fields | PASS | inc/lead-crm.php | The admin bridge can create a private held lead with source, handoff path, page URL and consent state. | 7/7 | - | Use the bridge only after owner approval for this real source; keep routing held. |
| UK-SRC-02 | uk_law_classifier | PASS | inc/lead-classifier.php | The rule classifier recognizes UK / cross-border law demand instead of falling into a generic bucket. | 5/5 | - | Create the private lead with legal_area=uk-law and preserve source_page_url=/uk-lawyer/. |
| UK-SRC-03 | external_source_routing_hold | PASS | inc/lead-routing.php | The router blocks external/manual leads unless explicit or owner-verified consent is present. | 6/6 | - | Do not tick release-to-router until consent evidence and paid partner terms are recorded. |
| UK-SRC-04 | no_pii_partner_preview | PASS | inc/lead-crm.php | The CRM has a no-PII partner-preview and terms queue before any supplier/lawyer PII release. | 5/5 | - | After permission, ask partners only with anonymized facts, fee terms and billing contact requirements. |
| UK-SRC-05 | owner_release_gate | PASS | inc/lead-crm.php | Owner release requires permission, partner terms and manual-only confirmation. | 5/5 | - | Record owner release only after consent and accepted paid partner terms are visible. |
| UK-SRC-06 | billing_proof_guard | PASS | inc/lead-crm.php | Billing state separates invoice/reference for invoice_sent from private payment evidence for paid. | 5/5 | - | Use manual invoice/reference plus private payment evidence until Grow/Morning provider status is fully verified. |
| UK-SRC-07 | supplier_safe_bid_packet | PASS | inc/lawyer-suppliers.php | Supplier matching has readiness scoring and a safe-bid packet that blocks first-contact PII sharing. | 3/3 | - | Register/complete a UK-law supplier or lawyer partner with terms before any handoff. |

## Operator Packet

| ID | Phase | Admin Location | Recommended Value | Status | Owner Action | Blocked Until | Safety |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UK-01 | source_capture | wp-admin -> Justice CRM -> Manual WhatsApp / client lead bridge | Use the owner-forwarded Outlook/WhatsApp email as source evidence, but keep the real phone/name/message outside repo artifacts. | READY_FOR_OWNER_APPROVAL | Approve private CRM entry for this current inbound UK-law lead, or keep it parked as email evidence only. | Owner approves creating one private held CRM lead. | No public page, contact, invoice, payment, partner message or PII release from this packet. |
| UK-02 | private_lead_fields | Manual WhatsApp / client lead bridge | source_channel=whatsapp_manual; handoff_path=lawyer_and_supplier; legal_area=uk-law; source_page_url=https://jus-tice.co.il/uk-lawyer/; consent_status=fresh_inbound_needs_details; suggested_lead_price_ils=249 or owner-approved value. | READY_TEMPLATE_ONLY | Paste the real client fields in wp-admin only, not into repo reports. | Owner/admin is in wp-admin and confirms the source reference. | Leave release_to_router unchecked unless consent is explicit/owner-verified. |
| UK-03 | routing_hold | Manual bridge checkboxes | Leave routing_hold active; do not tick release_to_router; keep billing queue preparation on only as a future proof field. | REQUIRED | Create the record as held if approved. | Client gives explicit match permission and partner terms exist. | The client is not introduced to anyone just because the lead exists. |
| UK-04 | client_permission | Justice CRM -> Permission / re-permission queue | Use current inbound permission/details wording from the consent message pack; ask for case details and explicit permission to match. | BLOCKED_NO_SEND_FROM_REPO | Owner/legal approves and sends the message manually only if appropriate. | Client replies with clear permission or owner verifies existing permission evidence. | A WhatsApp button click alone is not permission for lawyer/supplier introduction. |
| UK-05 | partner_preview | Justice CRM -> Anonymized partner preview / terms queue | No-PII preview only: area=UK/cross-border law; source=/uk-lawyer/; urgency/details only if safe; ask availability, scope, SLA and fee. | AFTER_PERMISSION_ONLY | Use this after permission, before sending any name/phone/email/documents. | Permission evidence is recorded and routing_hold remains on. | No screenshots, raw chat, exact phone, exact address or documents at preview stage. |
| UK-06 | partner_terms | Supplier/lawyer profile + CRM partner terms queue | Record target_type=both or supplier/lawyer, terms_accepted, min fee, billing contact, response commitment and capacity limits. | REQUIRED_BEFORE_PII_RELEASE | Register or complete at least one UK-law lawyer/supplier partner with accepted paid terms. | Accepted terms and billing contact are recorded. | No PII release to a partner with missing fee or missing billing contact. |
| UK-07 | owner_release | Justice CRM -> Owner handoff release queue | approved_manual_handoff only after permission, accepted terms and fee are all recorded. | FINAL_GATE | Owner records the manual-only release decision. | Client permission + partner terms + owner release are present. | Owner release records approval; the system still does not send anything automatically. |
| UK-08 | money | Justice CRM -> Qualified lead billing queue | Move to ready_to_bill/invoice_sent with an invoice reference; move to paid only with private payment evidence. | MANUAL_INVOICE_PATH | Collect invoice/reference for invoice_sent and private payment evidence before paid revenue is claimed. | Partner accepted fee and owner release happened for this lead. | Do not mark paid or claim paid revenue without private payment evidence. |
| UK-09 | automation_boundary | Justice CRM -> WhatsApp / TalkTo connector readiness | Keep webhook/API automation not live for this lead. | BLOCKED_PENDING_PROVIDER_GATES | Use manual CRM path only until official provider route, signed payload/shared secret, pause control and permission text are approved. | Provider integration is approved separately. | No WhatsApp Web/login automation, scraping, CAPTCHA/MFA bypass or unattended platform access. |

## First Safe Path

1. Owner approves private CRM entry for this current inbound UK-law source.
2. Admin creates a held private lead in `Manual WhatsApp / client lead bridge` with `legal_area=uk-law`, `handoff_path=lawyer_and_supplier`, `consent_status=fresh_inbound_needs_details` and routing held.
3. Owner/legal approves and sends a current-inbound permission/details message manually, if appropriate.
4. Only after explicit/owner-verified permission, use no-PII partner preview to find a UK-law lawyer/supplier willing to accept scope, SLA, fee and billing terms.
5. Record accepted terms and billing contact, then owner release, then invoice/reference and private payment evidence.

## Blockers

- Do not create the real CRM lead from this packet alone; owner approval and wp-admin source reference are required.
- Do not contact the client, supplier or lawyer until permission and owner/legal wording are clear.
- Do not release PII until client permission, accepted partner terms, fee, billing contact and owner release exist.
- Do not claim paid revenue until private payment evidence is recorded; invoice/reference alone supports invoice_sent only.
