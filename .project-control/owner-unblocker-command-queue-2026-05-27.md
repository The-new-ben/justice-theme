# Owner Unblocker Command Queue - 2026-05-27

Status: OWNER_UNBLOCKER_COMMAND_QUEUE_READY_NO_LIVE_ACTION

Scope: private owner/operator queue only. This does not approve CMS/database edits, public SEO changes, CRM records, client/lawyer/supplier contact, invoices, payments, email, WhatsApp/TalkTo messages, GSC API calls or uPress deployment.

## Summary

- Rows prepared: 9
- Highest-priority rows: 3
- Public actions approved: 0
- Live CRM/outreach/payment actions approved: 0
- Emails sent: 0
- uPress deployment required: yes

## Command Queue

| ID | Rank | Lane | Owner Reply Needed | Exact Next Step | Allowed After Yes | Hard No | Source Status |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| UNBLOCK-00 | 1 | homepage_live_deployment | Run Pull Git in uPress for wp-content/themes/justice-theme, then verify the new public-first homepage copy is live. | Open uPress for jus-tice.co.il, go to Git management for wp-content/themes/justice-theme, run Pull Git and verify the live homepage contains the new legal-help-first hero and situation router. | Read-only live verification of the homepage copy, mobile layout, lead/search links and no business-language leakage. | No CMS content edit, redirect, canonical/noindex, sitemap, taxonomy, CRM, payment or provider-setting change during the theme pull. | HOMEPAGE_DEPLOYMENT_BLOCKED_UPRESS_PULL_REQUIRED |
| UNBLOCK-01 | 2 | btl_first_paid_lead | Fill the Bituach Leumi source-readiness admin packet: 3 private specialist rows, coverage, 1 consented lead row, billing, payment proof and go/no-go. | Owner/admin fills the BTL source-readiness no-PII template from private wp-admin/CRM evidence only; Codex can then review the filled proof rows. | Private review of filled evidence; one controlled manual handoff only after all proof rows pass and owner explicitly releases it. | No old lead contact, no PII release, no lawyer/client outreach, no invoice, no paid status and no revenue claim from repo artifacts alone. | BTL_FIRST_REVENUE_OPERATOR_COMMAND_READY_BLOCKED_ON_PRIVATE_EVIDENCE_NO_LIVE_ACTION \| BTL_SOURCE_READINESS_ADMIN_FILL_PACKET_READY_BLOCKED_ON_OWNER_ADMIN_EVIDENCE_NO_LIVE_ACTION |
| UNBLOCK-02 | 3 | lawyer_subscription_revenue | Choose a controlled test lawyer identity/inbox/phone and payment path: manual invoice, approved payment link, provider link, or no-charge dry run. | Owner/admin fills the controlled lawyer subscription no-PII evidence template; Codex then runs the evidence review gate before any live execution. | Private review of filled identity, payment path, registration, dashboard, service-request, lead, invoice/payment and revenue-decision evidence. | No real lawyer charge, no payment-link email, no live registration submit and no provider mutation without owner-approved test scope. | LAWYER_SUBSCRIPTION_CONTROLLED_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION \| MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION |
| UNBLOCK-08 | 4 | criminal_jerusalem_lawyer_coverage | Approve private wp-admin entry/verification for one criminal-law/Jerusalem lawyer prospect, or explicitly park the exact directory coverage route. | Owner/admin fills the criminal Jerusalem prospect activation template with license, specialty, response fit, manual payment path, agreed fee terms and billing contact evidence. | Private review of filled no-PII evidence, then one owner-approved private prospect/profile readiness step before rerunning the directory coverage gate. | No public page edit, no public lawyer card/profile, no lawyer contact, no lead routing, no invoice, no payment claim and no uPress from this packet alone. | CRIMINAL_JERUSALEM_COVERAGE_ACTIVATION_PACKET_READY_NO_LIVE_ACTION |
| UNBLOCK-03 | 5 | public_existing_route_revenue_copy | Approve, edit or reject the existing-route rental-agreement update packet as the first public managed-service copy candidate. | If approved, prepare exact public-change packet for /rental-agreement/ and post-publication QA; if rejected, keep the queue parked. | Draft exact text for owner/legal review and run anti-cannibalization/mobile CTA QA before any deployment. | No title, H1, meta, body, link, checkout, fixed-price claim, CMS edit, email or uPress without explicit public approval. | OWNER_APPROVAL_QUEUE_READY_NOT_APPROVED |
| UNBLOCK-04 | 6 | low_hype_rv | Decide whether Low Hype stays internal-only and whether RV rental/deposit/charge should be approved, rejected or parked as the first pilot. | Owner fills the Low Hype/RV owner decision template, then GSC rows before any public copy. | Continue private GSC/legal route-decision review; current inbound-only no-PII intake if explicit permission exists. | No public Low Hype label, standalone RV route, old lead import, partner contact, PII release, invoice or payment claim. | LOW_HYPE_RV_FIRST_PILOT_DECISION_QUEUE_READY_NO_PUBLIC_CHANGE |
| UNBLOCK-05 | 7 | tel_aviv_family_evidence_completion | Fill the Tel Aviv family evidence-completion workqueue: 144 GSC paste rows, 3 lawyer-readiness rows, 12 legal/editor rows, 8 owner-scope rows and 5 final publication-gate rows. | Use the evidence-completion control center as the index: fill GSC first, then lawyer readiness, legal/editor, owner scope and the final private publication gate. | Private review of filled no-PII rows; only after all gates pass can a separate exact CMS draft packet be prepared for owner review. | No CMS page, title/H1/meta/body, internal links, redirects, canonicals/noindex, sitemap, taxonomy, email or uPress from this queue row. | TEL_AVIV_FAMILY_EVIDENCE_COMPLETION_CONTROL_CENTER_READY_BLOCKED_ON_HUMAN_FILL_NO_PUBLIC_CHANGE |
| UNBLOCK-06 | 8 | criminal_jerusalem_role | Fill the criminal-law GSC/owner decision template: preserve, revise, consolidate or park /criminal-lawyer-jerusalem/ and choose central route ownership. | Use GSC rows and owner decision to map central criminal-law route, local-page role and protected specialist pages. | Prepare exact update draft only after route ownership is clear. | No public edit, unpublish, redirect, canonical/noindex, internal-link rewrite, sitemap or taxonomy change. | CRIMINAL_LAW_PILLAR_SPLIT_DECISION_PACKET_READY_NO_PUBLIC_CHANGE |
| UNBLOCK-07 | 9 | whatsapp_talkto_consent | Approve or edit exact consent/re-permission wording and suppression rules before any real WhatsApp/TalkTo lead handling. | Owner/legal reviews the message pack; then Codex can help create a filled no-PII import/preflight review from an owner-provided export. | Current inbound clarification only after permission; legacy leads only after fresh re-permission workflow is approved. | No bulk messaging, no old lead matching, no PII release, no partner preview, no invoice and no revenue claim. | CONSENT_MESSAGE_PACK_READY_FOR_OWNER_LEGAL_REVIEW_NO_SEND |

## Recommended Owner Reply Format

Reply with row IDs only, for example: `UNBLOCK-01 approve, UNBLOCK-08 approve, UNBLOCK-03 park`.

## Own Review

The fastest revenue path is still not a new public page. It is clearing one controlled proof path: Bituach Leumi paid-lead evidence, a controlled lawyer subscription walkthrough, or the criminal Jerusalem private coverage prospect step. Public content work should stay on existing-route approval packets until GSC/legal/owner gates are filled.

## Safety Statement

This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue or call the GSC API. UNBLOCK-00 records uPress Pull Git as a separate owner/operator blocker; this packet does not perform it.
