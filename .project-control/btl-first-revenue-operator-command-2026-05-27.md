# BTL First Revenue Operator Command - 2026-05-27

Status: BTL_FIRST_REVENUE_OPERATOR_COMMAND_READY_BLOCKED_ON_PRIVATE_EVIDENCE_NO_LIVE_ACTION

Scope: private operator command only. It does not create or edit wp-admin/CRM records, contact lawyers, contact clients, route PII, invoice, charge payment, mark revenue, publish public pages, change SEO controls, send email/WhatsApp/TalkTo, call external APIs or deploy uPress.

## Profit Readiness

- Static preparation: 75%.
- Live paid-lead proof: 0%.
- Actions blocked by missing private evidence: 6/6.
- First required action: BTL-REV-01.
- Revenue can be counted only after: PAYMENT-01 passes with private payment evidence.

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| BTL-OP-GATE-01 | source_packets_loaded | PASS | Admin packet: BTL_SOURCE_READINESS_ADMIN_FILL_PACKET_READY_BLOCKED_ON_OWNER_ADMIN_EVIDENCE_NO_LIVE_ACTION; filled review: BTL_SOURCE_READINESS_FILLED_REVIEW_BLOCKED_NO_LIVE_ACTION. | Use this operator card as the short owner/admin run order. |
| BTL-OP-GATE-02 | no_private_values_echoed | PASS | 0 raw admin pointers echoed; 0 raw private notes echoed. | Keep all private record IDs, notes, payment URLs and PII inside private owner systems. |
| BTL-OP-GATE-03 | revenue_not_claimed_without_payment | PASS | 0 revenue claims approved; 0 invoices/payments created by the report. | Revenue stays 0 until PAYMENT-01 passes with private payment evidence. |
| BTL-OP-GATE-04 | operator_actions_still_blocked | BLOCKED_PRIVATE_EVIDENCE_REQUIRED | 6/6 operator actions are still blocked. | Start with BTL-REV-01 and fill private supply evidence. |

## Operator Run Order

| ID | Step | Lane | Status | Owner/Admin Action | Proof Needed | Unlocks | Hard No |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| BTL-REV-01 | 1 | private_specialist_supply | BLOCKED_PRIVATE_SUPPLY_EMPTY | Create or verify 3 private Bituach Leumi specialist prospects in the private admin system. | Each prospect has license/status verified, Bituach Leumi appeal fit, response SLA, accepted lead-fee terms, payment path and billing contact. | Routable coverage check for the first controlled Bituach Leumi lead. | Do not publish profiles, contact lawyers from repo data, route client PII, invoice or claim revenue from prospect rows alone. |
| BTL-REV-02 | 2 | routable_coverage | BLOCKED_UNTIL_THREE_PROSPECTS_ROUTABLE | Confirm the 3 verified specialists are routable lawyer profiles with routing enabled and billing/contact fields present. | First paid-lead preflight shows Bituach Leumi coverage ready with no billing/contact blockers. | One consented controlled lead can be reviewed for routing. | Do not rely on a public page or directory card if the private routable coverage proof is missing. |
| BTL-REV-03 | 3 | controlled_lead_consent | BLOCKED_UNTIL_CONSENTED_LEAD_EXISTS | Select one current Bituach Leumi lead with explicit match consent or owner-verified consent and owner release. | Consent status, routing hold clearance by owner workflow, Bituach Leumi appeal intent and qualified lead model are recorded privately. | A controlled handoff can create billable lead state. | Do not infer consent from a WhatsApp button click alone and do not copy client names, phones, raw chats or documents into repo files. |
| BTL-REV-04 | 4 | billing_reference | BLOCKED_UNTIL_BILLABLE_LEAD | After actual controlled routing, record qualified lead billing as ready_to_bill or invoice_sent. | Billable lawyer linked, suggested lead price above 0 and invoice/payment reference exists privately. | Payment proof can be requested and checked. | Do not mark paid or claim revenue from invoice/reference alone. |
| BTL-REV-05 | 5 | payment_proof | BLOCKED_UNTIL_PRIVATE_PAYMENT_PROOF | Record paid status only after private payment proof exists. | Private payment evidence URL exists in the private admin/payment system and qualified lead billing status is paid. | One paid Bituach Leumi lead can be counted once. | Do not paste receipts or private payment URLs into repo artifacts. |
| BTL-REV-06 | 6 | scale_decision | BLOCKED_UNTIL_FIRST_PAYMENT_REVIEW | After the first paid proof passes, decide scale, fix or stop. | No unresolved complaint, refund, consent or ethics issue, and owner explicitly approves the next batch. | Repeatable controlled Bituach Leumi revenue loop. | Do not expand WhatsApp/TalkTo routing, public claims or supplier outreach before the scale decision. |

## What Codex Can Do After The Owner/Admin Fill

1. Run `tools/review-btl-source-readiness-filled-rows.mjs --reportDate=2026-05-27 --sourceDate=2026-05-27`.
2. Report pass/blocked status without echoing private admin pointers, private notes, payment URLs or PII.
3. If all gates pass and the owner separately approves, prepare one controlled Bituach Leumi handoff/payment execution record.

## Honest Business Assessment

This loop is still 0% live-profit-ready because no private supply, consented lead, billing or payment proof rows pass. The shortest useful move is not more public content. It is filling BTL-REV-01 through BTL-REV-03 from private admin evidence, then asking Codex to review the filled rows.
