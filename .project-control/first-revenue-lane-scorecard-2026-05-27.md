# First revenue lane scorecard - 2026-05-27

Status: FIRST_REVENUE_LANE_SCORECARD_READY_OWNER_DECISION_REQUIRED

## Project Manager Check

Active goal: stop spreading effort across every idea and choose one lane that can plausibly create first revenue fastest.
Readiness to profit: recommended lane 86% operational readiness, 0% live revenue impact.
Honesty: This scorecard chooses a recommended first-revenue lane, but it does not authorize outreach, CRM edits, invoices, payments, publication or deployment.

## Recommendation

Recommended first lane: `lawyer_subscription_manual_invoice`.

Reason: this lane can ask a lawyer to pay by manual invoice without requiring a live client handoff, client PII release, or Grow/Meshulam approval first. It still needs owner approval before any outreach or CRM action.

## Lane Scorecard

| Rank | Lane | Score | Why | Existing assets | Next owner action | Inputs needed | Proof before revenue | Blocker | Live action now |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | lawyer_subscription_manual_invoice | 86 | Closest to money because it does not require client PII, a live matched lead, or payment-provider approval. The lawyer registration and manual invoice follow-up path already exist. | lawyer registration billing fields; lawyer onboarding payment follow-up; manual invoice path; prospect outreach links; plan-payment admin path | Approve one controlled lawyer outreach or choose one existing lawyer/prospect to offer a paid manual-invoice plan. | lawyer/prospect target; plan or monthly price; billing contact; approved message wording | manual invoice reference can mark invoice_sent; private payment evidence is required before paid revenue | No owner-selected lawyer/prospect and no approved outreach/action. | NO |
| 2 | btl_qualified_appeal_lead_fee | 78 | Strong revenue fit and already has Bituach Leumi prospect/readiness packets, but it needs verified specialists plus a consented lead and owner release before billing. | BTL revenue hints; held lead triage; first paid lead preflight; controlled test drill; prospect activation packet; manual terms packet | Approve verifying one Bituach Leumi specialist and exact lead-fee terms, or provide a consented controlled lead for a no-PII drill. | selected specialist; fee; billing contact; client permission if a real lead is used | accepted partner terms, owner release, invoice reference and private payment evidence | Requires live CRM/admin evidence and consented lead handling; higher privacy and routing risk than subscription. | NO |
| 3 | supplier_or_uk_cross_border_handoff_fee | 63 | Commercially interesting but less ready because partner type, accepted terms, jurisdiction fit and first demand source are not as narrow as the subscription or BTL lanes. | UK WhatsApp supplier handoff packet; supplier/partner terms patterns; manual invoice proof rules | Choose one supplier category and one real supplier candidate, then approve terms-only verification. | supplier category; partner target; fee; jurisdiction scope; billing contact | accepted supplier terms, owner release, invoice reference and private payment evidence | Too broad without a selected supplier category and partner. | NO |
| 4 | homepage_conversion_deployment | 54 | Useful for future inbound conversion, but it does not create money until owner approves route QA, merge, uPress deployment and a measured conversion path. | homepage human-help implementation; static visual QA; owner deployment approval packet | Approve real WordPress route QA only; do not merge or uPress until route QA passes. | route QA approval; later merge/uPress approval | live deployment plus conversion evidence | Owner has not approved live/staging route QA or deployment. | NO |

## Owner Decision Rows

| ID | Decision needed | Recommended | Allowed answers | Owner answer | Note |
| --- | --- | --- | --- | --- | --- |
| OWNER-FR-01 | Select exactly one first-revenue lane for the next live-approved action. | lawyer_subscription_manual_invoice | lawyer_subscription_manual_invoice \| btl_qualified_appeal_lead_fee \| supplier_or_uk_cross_border_handoff_fee \| wait |  |  |
| OWNER-FR-02 | Approve whether Codex may prepare a live/admin action checklist for the selected lane, still without sending/contacting/publishing. | yes_prepare_checklist_only | yes_prepare_checklist_only \| no \| wait |  |  |
| OWNER-FR-03 | If the lane is lawyer subscription, name the target or allow a generic one-target outreach draft only. | generic_draft_only_until_target_named | target_named \| generic_draft_only \| wait |  |  |

## What This Does Not Do

- Does not send outreach.
- Does not create a CRM record.
- Does not create an invoice or payment request.
- Does not mark anything paid.
- Does not publish or deploy anything.