# WhatsApp / TalkTo Paid Handoff Runbook - 2026-05-26

Status: PRIVATE_RUNBOOK_ONLY_NOT_APPROVED_FOR_AUTOMATION

Purpose: convert inbound WhatsApp, TalkTo, email and legacy leads into a safe CRM-to-partner-to-payment workflow without contacting clients or suppliers automatically and without exposing private business strategy on public pages.

Safety: no login, mailbox action, CMS publish, database edit, lead creation, partner contact, client contact, WhatsApp message, TalkTo message, payment, invoice, webhook, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin or uPress action was performed.

## Summary

- Existing admin surfaces mapped: 2
- Safety gates mapped: 6
- Integration gates mapped: 1
- Current real-lead packet rows: 2
- Live automation approved: 0
- Public changes approved: 0

## Operator Rule

The safe path is: private CRM lead -> consent evidence -> routing hold -> no-PII partner preview -> accepted terms and billing contact -> owner release -> manual handoff -> invoice/payment proof. Skip none of these steps.

## Runbook Rows

| ID | Type | Stage | Status | Required Evidence | Allowed Action | Blocked Action | Repo Anchor | Linear | Next Owner Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SURFACE-01 | existing_admin_surface | manual_capture | READY_ADMIN_ONLY | Owner/admin pastes inbound WhatsApp, email, phone or TalkTo lead into Justice CRM with source reference. | Create a private justice_lead only when the owner approves real lead creation for that source. | Do not create real CRM records from old chats in bulk without owner approval and import batch labeling. | inc/lead-crm.php manual bridge | HAD-87 | For the UK WhatsApp lead, approve or hold real private CRM lead creation. |
| SURFACE-02 | existing_admin_surface | bulk_import | READY_ADMIN_ONLY | CSV export has source system, batch label, source page or thread/import ID where available. | Stage up to 200 rows per paste with routing_hold=1 and dedupe fingerprint. | Do not route legacy rows; default old leads to legacy_needs_repermission. | inc/lead-crm.php import staging | HAD-87 | Provide TalkTo or WhatsApp export format when ready; start with a small batch. |
| GATE-01 | safety_gate | consent | REQUIRED_BEFORE_ROUTING | consent_status is explicit_match_consent or owner_verified_consent, and the owner/admin checked the permission evidence. | Proceed to no-PII partner preview and paid terms review. | Do not route, expose client contact details, or introduce a lawyer/supplier. | inc/lead-crm.php consent options; inc/lead-routing.php consent gate | HAD-87 | Use the permission queue for fresh or legacy inbound chats. |
| GATE-02 | safety_gate | routing_hold | DEFAULT_ON | routing_hold=1 remains until consent, commercial terms and owner release are all recorded. | Keep internal classification, notes and no-PII readiness visible to the owner. | Do not remove routing_hold just because the lead has a phone number or legal area. | inc/lead-routing.php routing_hold guard | HAD-87 | Release only after the owner release queue confirms the lead is safe. |
| GATE-03 | safety_gate | no_pii_preview | REQUIRED_BEFORE_PARTNER_CONTACT | An anonymized preview describes area, urgency, city/region if safe, and required supplier/lawyer type without name, phone, email, documents or raw chat. | Ask selected lawyer/supplier whether they accept the category, SLA and price/fee terms. | Do not send screenshots, raw WhatsApp content, full phone number, exact address, or documents at preview stage. | inc/lead-crm.php partner preview / terms queue | HAD-87; HAD-97 | Use no-PII preview before any UK-law, immigration or supplier quote contact. |
| GATE-04 | safety_gate | partner_terms | REQUIRED_BEFORE_PII_RELEASE | Partner accepted lead/case type, price or per-lead fee, response commitment, billing contact and any capacity limits. | Record partner terms and move the lead toward owner release. | Do not release client PII to a partner who has not accepted terms and billing contact requirements. | inc/lead-crm.php owner handoff release queue; inc/lawyer-prospects.php supplier/lawyer activation packet | HAD-79; HAD-87; HAD-97 | For each supplier/lawyer category, record minimum fee and billing route before first handoff. |
| GATE-05 | safety_gate | billing_proof | REQUIRED_BEFORE_REVENUE_CLAIM | qualified_lead_billing_status, invoice reference or payment evidence URL, and owner note are stored. | Claim invoice sent or paid only according to recorded evidence. | Do not mark paid, claim revenue, or activate paid status without invoice/payment proof. | inc/lead-crm.php qualified lead billing queue | HAD-76; HAD-87 | Use manual invoice/payment flow until Grow/Morning provider setup is fully verified. |
| GATE-06 | safety_gate | owner_release | FINAL_MANUAL_GATE | Client permission, partner terms and minimum paid fee are present; owner release is recorded. | Prepare the controlled manual handoff. The system still sends nothing automatically. | Do not automate the handoff or live webhook release from this report. | inc/lead-crm.php owner handoff release queue | HAD-87 | Owner manually approves each first-category handoff before scale. |
| GATE-07 | integration_gate | whatsapp_talkto_webhook | BLOCKED_PENDING_PROVIDER_APPROVAL | Official provider route, signature/shared-secret method, pause switch, replay protection and approved permission text. | Keep using manual/import bridge and connector-readiness panel. | Do not build unattended scraping/login bots or bypass WhatsApp/TalkTo protections. | inc/lead-crm.php connector readiness panel | HAD-81; HAD-87 | Provide official API/webhook docs or account settings when ready. |
| CASE-UK-01 | current_real_lead_packet | uk_law_whatsapp | BLOCKED_OWNER_APPROVAL_FOR_REAL_CRM_RECORD | Owner approves creating a private CRM lead from the Outlook/WhatsApp email and stores the source reference. | If approved, create private lead with legal_area=uk-law, source_page_url=/uk-lawyer/, consent_status=fresh_inbound_needs_details, routing_hold=1. | Do not send the client to a UK lawyer/supplier or charge until case details and match permission are clear. | inc/lead-classifier.php uk-law classification; inc/lead-crm.php manual bridge | HAD-87 | Approve real CRM entry or keep the email as evidence only until more client details arrive. |
| CASE-UK-02 | current_real_lead_packet | uk_law_whatsapp | NEXT_AFTER_OWNER_APPROVAL | Client states what they need in UK law and agrees to be matched/contacted. | Move consent to explicit_match_consent or owner_verified_consent, then run no-PII partner preview. | Do not infer consent from pressing the WhatsApp button alone. | inc/lead-crm.php permission queue | HAD-87 | Use an owner-approved short permission/details message. |
| MONEY-01 | commercial_path | find_register_take_money | MANUAL_SAFE_PATH_AVAILABLE | Routable lawyer/supplier profile, accepted terms, billing contact, lead fee or package price, owner release. | Attach the client to a partner through the CRM, record billing queue state, then collect manual invoice/payment proof. | Do not make automatic recurring billing, automated refunds or guaranteed supplier bids claims until provider tests pass. | inc/lead-crm.php billing queue; inc/lawyer-onboarding.php manual invoice path; inc/lawyer-suppliers.php supplier readiness | HAD-76; HAD-79; HAD-87 | For each category, register at least one accepted partner with billing terms before routing. |

## Current UK WhatsApp Lead

- Treat the UK-law WhatsApp/email lead as a real client lead only after owner approval to create the private CRM record.
- Suggested private CRM starting state, if approved: `legal_area=uk-law`, `source_page_url=/uk-lawyer/`, `consent_status=fresh_inbound_needs_details`, `routing_hold=1`, `handoff_path=lawyer_and_supplier` or `supplier_marketplace`.
- Pressing the WhatsApp button is not enough to infer permission for a lawyer/supplier introduction.
- The next safe message is a permission/details request, not a partner introduction.

## Blockers

- Real UK lead creation remains blocked until the owner approves creating the private CRM record.
- Supplier/lawyer PII handoff remains blocked until client consent, partner terms, billing contact and owner release are recorded.
- Live WhatsApp/TalkTo webhook ingestion remains blocked until official provider route, signature/shared-secret method, pause control and permission text are approved.
- Real revenue remains blocked until invoice/payment evidence is recorded for the specific handoff.

## Where Future Agents Should Look

- Linear: `HAD-87` for WhatsApp/TalkTo consent-safe CRM; `HAD-79`/`HAD-97` for supplier marketplace and bidding; `HAD-76` for Bituach Leumi first billable lead.
- Repo: `.project-control/lead-consent-import-architecture-2026-05-26.md` for the original architecture.
- Admin: `wp-admin -> Justice CRM` for manual bridge, import staging, permission queue, anonymized partner preview, owner handoff release and qualified lead billing queue.
