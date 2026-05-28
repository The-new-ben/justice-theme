# Lawyer Dashboard Payment-Proof Preview

Date: 2026-05-28
Status: PUSH_READY_DEPLOY_REQUIRED

## Public Surface

- URL: `/lawyer-dashboard/`
- Audience: logged-out lawyers evaluating whether Jus-Tice has a serious paid onboarding path.
- Revenue surface: `lawyer_dashboard_payment_proof_preview`
- Funnel step: `manual_invoice_to_paid_dashboard`

## What Changed

Added a visible payment-proof preview to the logged-out lawyer dashboard.

The preview explains four states:

- `invoice_requested`
- `invoice_sent`
- `payment_evidence_required`
- `lead_routing_after_paid`

This aligns the dashboard with the lawyer plans and lawyer registration pages: a lawyer is not treated as paid until invoice/payment evidence exists.

## Verification Added

Added `.project-control/scripts/check-lawyer-dashboard-payment-proof-preview.ps1`.

The checker confirms the public dashboard exposes:

- the revenue surface marker,
- the manual-invoice-to-paid dashboard step,
- all four payment-proof states,
- links to `/lawyer-registration/` and `/lawyer-plans/`,
- theme version `1.1.73`,
- deployment marker `2026-05-28-lawyer-dashboard-payment-proof-preview-v1`.

The checker is read-only. It does not log in, submit service requests, create invoices, create payments, route leads, update CRM records, or change gateway settings.

## Deployment Target

- Theme version: `1.1.73`
- Deployment marker: `2026-05-28-lawyer-dashboard-payment-proof-preview-v1`
- CSS cache version: `4.5.9`

## Honesty Statement

This is a public funnel clarity improvement. It is not proof of revenue, invoice issuance, payment settlement, CRM routing, or lawyer handoff. Grow/Meshulam KYC and real payment evidence remain business blockers.
