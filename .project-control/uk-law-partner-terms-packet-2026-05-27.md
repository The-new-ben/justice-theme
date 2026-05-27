# UK-Law Partner Terms Packet - 2026-05-27

Status: UK_LAW_PARTNER_TERMS_PACKET_READY_NO_LIVE_ACTION

Purpose: prepare the partner side of the current UK-law lead path: find/register a lawyer or supplier, record paid terms, preserve no-PII rules, and keep revenue claims blocked until invoice/payment proof exists.

Safety: no mailbox action, CMS publish, database edit, supplier creation, lawyer prospect creation, lawyer registration, partner contact, client contact, WhatsApp message, TalkTo message, webhook, payment, invoice, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin write or uPress action was performed.

## Summary

- Static source gates passing: 7/7
- Partner workflow rows: 8
- Owner template rows: 11
- Supplier/lawyer records created: 0
- Contacts made: 0
- Public exposure approved: 0
- Revenue claimed: 0

## Static Source Gates

| ID | Gate | Status | File | Evidence | Markers | Missing | Next Step |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| UKP-SRC-01 | uk_law_demand_classification | PASS | inc/lead-classifier.php | UK-law demand can be recognized and tagged before partner matching. | 5/5 | - | Keep partner records tied to legal_area=uk-law and source_page_url=/uk-lawyer/. |
| UKP-SRC-02 | supplier_partner_cms_fields | PASS | inc/lawyer-suppliers.php | Supplier records can capture provider type, jurisdictions, commercial terms, SLA and source proof. | 8/8 | - | Create/complete a private supplier record only after owner chooses a real UK-law partner. |
| UKP-SRC-03 | supplier_readiness_and_safe_bid | PASS | inc/lawyer-suppliers.php | Supplier matching has readiness scoring and a no-PII first-contact packet. | 4/4 | - | Use only after client permission and owner-approved partner research. |
| UKP-SRC-04 | supplier_public_exposure_guard | PASS | inc/lawyer-suppliers.php | Supplier records do not become public merely because they exist; public display has explicit gates. | 5/5 | - | Keep UK-law supplier partners private until public display is separately approved. |
| UKP-SRC-05 | lawyer_prospect_terms_fields | PASS | inc/lawyer-prospects.php | Lawyer coverage prospects can capture license, specialty, fee, billing contact and payment-path readiness. | 7/7 | - | Use this when the UK-law partner is a lawyer or a lawyer-led firm. |
| UKP-SRC-06 | manual_invoice_lawyer_path | PASS | inc/lawyer-onboarding.php | Lawyer onboarding supports manual invoice/payment follow-up before paid activation. | 6/6 | - | Use manual invoice status only after accepted partner terms and owner release. |
| UKP-SRC-07 | crm_partner_terms_owner_release_billing | PASS | inc/lead-crm.php | CRM lead handoff has partner terms, owner release and invoice/payment proof fields. | 6/6 | - | Connect the UK partner to the specific lead only after client permission exists. |

## Partner Workflow

| ID | Lane | Admin Surface | Required Fields | Ready When | Blocked Action | Next Owner Action |
| --- | --- | --- | --- | --- | --- | --- |
| PARTNER-01 | partner_type_decision | Owner decision before wp-admin record | Choose lawyer, supplier, or both; keep this private. | Owner knows whether the UK-law response requires a licensed lawyer, an external supplier, or a lawyer-led supplier. | Do not introduce the client or promise a match. | Choose first target type for the current UK-law demand. |
| PARTNER-02 | supplier_record | wp-admin -> Suppliers | provider_type, supplier_category, service_area, jurisdictions, license_status, partnership_status, revenue_model, min_price, response_sla, contact route, source_url, owner_note. | partnership_status=approved or at least candidate terms are documented for owner review. | Do not expose supplier publicly or send PII. | Create or complete a UK-law supplier candidate only after owner selects a real partner. |
| PARTNER-03 | lawyer_prospect_record | wp-admin -> Lawyer Prospects | practice_area=uk-law, city/coverage area, target_plan=lead_partner, license_verified, specialty_verified, agreed_lead_fee_ils, billing_contact_email, lead_fee_terms_ready, payment_path_ready. | license/specialty/payment/fee/billing fields are complete. | Do not route as a paid lawyer lead while terms are incomplete. | Use if the first UK partner is a lawyer or a lawyer-led office. |
| PARTNER-04 | terms_acceptance | CRM partner terms queue or partner record notes | accepted service category, jurisdiction limits, response SLA, fixed price or lead fee, billing contact, VAT/invoice path, capacity limit, conflict/refusal rule. | terms are accepted in writing and stored in wp-admin notes. | Do not release client PII or mark ready_to_bill. | Record partner terms before any handoff. |
| PARTNER-05 | no_pii_preview | Justice CRM -> Anonymized partner preview / terms queue | area=UK/cross-border law, source=/uk-lawyer/, general urgency, sanitized facts, no name/phone/email/documents/raw chat. | client permission is recorded and preview text is safe. | Do not send screenshots, raw WhatsApp content or identifying details. | Use only after the client gives match permission. |
| PARTNER-06 | owner_release | Justice CRM -> Owner handoff release queue | client permission, accepted partner terms, fee, billing contact, owner release note. | owner_handoff_release_status=approved_manual_handoff. | Do not hand off or remove routing hold without owner release. | Record manual-only release for the specific lead/partner pair. |
| PARTNER-07 | billing_proof | Justice CRM -> Qualified lead billing queue / Lawyer Onboarding payment follow-up | invoice/reference or private payment evidence URL, billing status, owner note. | invoice_sent has reference or paid has proof. | Do not claim revenue or mark paid without proof. | Use manual invoice path until payment provider proof exists. |
| PARTNER-08 | public_exposure_guard | Supplier public visibility / lawyer profile publication controls | explicit public approval, source proof, approved status, offer summary, no business-plan language. | Owner separately approves public display after legal/source review. | Do not publish supplier cards, public claims, pricing or paid placement language from this packet. | Keep UK-law partner private for now. |

## First Practical Sequence

1. Choose first UK-law partner type: lawyer, supplier, or both.
2. Complete one private partner record with scope, credential/source proof, SLA, fee/price and billing contact.
3. Only after client match permission, send a no-PII partner preview.
4. Record accepted terms and owner release before client PII leaves the CRM.
5. Use manual invoice/payment proof before claiming revenue.

## Blockers

- Do not create a real supplier/lawyer/prospect record from this packet alone.
- Do not contact a partner or client until owner approval and consent conditions are met.
- Do not expose the partner publicly or publish UK-law service claims from this packet.
- Do not mark paid or claim revenue until invoice/payment proof exists.
