# WhatsApp / TalkTo Import Preflight Packet - 2026-05-26

Status: TEMPLATE_READY_NO_SOURCE_FILE

Purpose: prepare WhatsApp, TalkTo and legacy lead exports for consent-safe CRM staging without writing client PII into repo reports.

Safety: no login, mailbox action, CMS publish, database edit, real lead creation, client contact, lawyer/supplier contact, WhatsApp message, TalkTo message, webhook, payment, invoice, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin or uPress action was performed.

## Generated Files

- Private report: `.project-control\whatsapp-talkto-import-preflight-2026-05-26.md`
- Private CSV: `.project-control\whatsapp-talkto-import-preflight-2026-05-26.csv`
- Machine JSON: `.reports\whatsapp-talkto-import-preflight-2026-05-26.json`
- Machine CSV: `.reports\whatsapp-talkto-import-preflight-2026-05-26.csv`
- Blank import template: `.project-control\whatsapp-talkto-import-template-2026-05-26.csv`

## Validation Summary

- Input supplied: no
- Input rows counted: 0
- Rows missing both phone and message: 0
- Rows claiming routeable consent: 0
- Rows marked legacy re-permission: 0
- Rows marked do not contact: 0
- Rows with unknown consent value: 0

## Blockers

- No source export supplied yet. Use the generated template or run again with --input=path/to/export.csv.

## Header Map

| Canonical Field | Detected Header |
| --- | --- |
| phone | - |
| name | - |
| email | - |
| message | - |
| date | - |
| page_url | - |
| thread_id | - |
| legal_area | - |
| consent_status | - |
| city | - |

## Gate Rows

| ID | Type | Status | Evidence | Allowed Action | Blocked Action | Next Owner Action |
| --- | --- | --- | --- | --- | --- | --- |
| IMPORT-01 | operator_gate | TEMPLATE_READY_NO_SOURCE_FILE | No input file supplied; generated blank import template. | Use this packet to prepare the export; do not create CRM rows from this report alone. | Do not contact clients, notify lawyers/suppliers, release PII, invoice, mark paid, or enable webhooks from this packet. | Ask TalkTo/WhatsApp provider for a CSV export using the generated template headers. |
| IMPORT-02 | template | READY_PRIVATE_TEMPLATE | .project-control/whatsapp-talkto-import-template-<date>.csv | Use as a column guide for provider exports or owner-maintained lead sheets. | Do not fill this template with real PII inside the repo. | Store real exports outside the repo or paste directly into wp-admin Justice CRM. |
| IMPORT-03 | legacy_rule | DEFAULT_REPERMISSION_REQUIRED | Legacy exports must default to legacy_needs_repermission. | Send only owner-approved opt-in/details copy from the CRM permission queue. | Do not treat old WhatsApp/TalkTo rows as permission for lawyer or supplier introduction. | For old untreated leads, use small batches and keep routing_hold=1. |
| IMPORT-04 | fresh_inbound_rule | DETAILS_AND_MATCH_PERMISSION_REQUIRED | Fresh inbound rows may start as fresh_inbound_needs_details. | Ask for case details and explicit permission to match before partner preview or PII release. | Do not infer match consent from clicking the WhatsApp button alone. | For the current UK lead, ask permission/details before supplier handoff. |
| IMPORT-05 | billing_rule | PAYMENT_PROOF_REQUIRED | Billing queue and owner release exist in CRM, but no payment is created by import. | Record partner terms, owner release and invoice/payment evidence manually after consent. | Do not claim revenue from staged imports before invoice/payment proof. | Use manual invoice path until provider payment flow is proven. |
| CODE-01 | code_gate | PASS | Owner-only CSV import staging panel exists | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-02 | code_gate | PASS | Imported leads default to routing hold | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-03 | code_gate | PASS | Legacy re-permission consent state exists | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-04 | code_gate | PASS | Import dedupe fingerprint exists | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-05 | code_gate | PASS | Import batch cap exists | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-06 | code_gate | PASS | Permission / re-permission queue exists | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-07 | code_gate | PASS | No-PII partner preview / terms queue exists | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-08 | code_gate | PASS | Owner release queue exists | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-09 | code_gate | PASS | No-PII audit export exists | This static gate is present. | Do not bypass the gate manually. | No action needed. |
| CODE-10 | code_gate | PASS | Webhook readiness panel exists but is not live | This static gate is present. | Do not bypass the gate manually. | No action needed. |

## Operator Rule

Real exports should stay out of the repo. Either paste a reviewed export directly into `wp-admin -> Justice CRM -> WhatsApp / TalkTo import staging`, or run this tool against a local file only to get no-PII counts and blockers. The report intentionally records headers and counts only, not names, phone numbers, emails, raw chat, documents or screenshots.

## Linear Anchors

- Parent: `HAD-87` WhatsApp/TalkTo consent-safe CRM.
- Related: `HAD-102` paid handoff runbook, `HAD-79` supplier marketplace, `HAD-97` smart-match bid readiness, `HAD-76` Bituach Leumi first paid lead.
