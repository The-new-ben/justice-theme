# Lawyer Plans Payment Proof Path - 2026-05-28

Status: PUSH_READY_DEPLOY_REQUIRED

Scope: public theme-code improvement for `/lawyer-plans/` plus a read-only QA gate. No CMS content, database row, WooCommerce product, gateway setting, CRM record, lawyer profile, user, invoice, payment, refund, WhatsApp message, email, redirect, canonical/noindex, sitemap, taxonomy, or uPress setting was created or changed.

## Goal

Make the paid lawyer path more commercially usable without pretending payments are already live. A lawyer should understand the difference between:

- choosing a plan,
- accepting terms,
- receiving an invoice or payment link,
- and being counted as paid only after payment proof exists.

## Public Page Change

Updated `page-lawyer-plans.php` with a visible payment-proof path:

1. plan and terms before invoice,
2. billing contact,
3. invoice or payment link is not paid,
4. paid requires private payment evidence.

The section includes:

- `data-revenue-surface="lawyer_plans_payment_proof_path"`
- `data-payment-readiness="manual_invoice_paid_only_with_evidence"`
- manual invoice CTAs for `lead_partner` and `pro`

## Verification Added

Added `.project-control/scripts/check-lawyer-plans-payment-proof-path.ps1`.

The checker confirms `/lawyer-plans/` exposes the payment-proof section, manual invoice path, plan-interest tracking, `invoice_sent`, theme version `1.1.71`, and deployment marker `2026-05-28-lawyer-plans-payment-proof-v1`.

Wired this checker into `.project-control/scripts/check-revenue-readiness-gate.ps1` as `lawyer_plans_payment_proof_path`.

## Deployment Target

- Theme version: `1.1.71`
- Deployment marker: `2026-05-28-lawyer-plans-payment-proof-v1`
- CSS cache version: `4.5.7`

## Remaining Blockers

- Grow/Meshulam KYC/payment proof is still not verified.
- No real paid lawyer, invoice, payment, refund, order, subscription, CRM update, or provider settlement was created.
- This improves the public paid-lawyer conversion path; it is not revenue proof.

## Honesty Statement

This is a visible public page improvement and QA gate, not a payment action. It strengthens the paid-lawyer path by preventing overclaiming: invoice/reference alone is not paid revenue, and paid status requires real private payment evidence.
