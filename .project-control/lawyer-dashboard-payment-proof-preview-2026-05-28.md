# Lawyer Dashboard Payment-Proof Preview

Date: 2026-05-28
Status: LIVE_VERIFIED

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

## Live Verification

Verified after GitHub push, uPress Pull Git, and uPress cache-clear action.

- uPress Git log: commit `3c995442` is `HEAD -> main`.
- `.project-control/scripts/check-live-deploy.ps1`: pass.
- `.project-control/scripts/check-lawyer-dashboard-payment-proof-preview.ps1`: pass for `/lawyer-dashboard/`.
- `.project-control/scripts/check-lawyer-plans-payment-proof-path.ps1`: pass for `/lawyer-plans/`.
- `.project-control/scripts/check-lawyer-registration-revenue-bridge.ps1`: pass for `/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice`.
- `.project-control/scripts/check-live-route-matrix.ps1`: pass across 8 routes, including `/lawyer-dashboard/`; the legacy `?page_id=315` About URL remains canonical-ok but not redirected.
- `.project-control/scripts/check-live-mobile-menu-browser-qa.ps1`: pass; screenshot saved at `output/playwright/live-mobile-menu-open-1779932532.png`.
- `.project-control/scripts/check-revenue-readiness-gate.ps1`: pass with readiness `ready_for_owner_payment_admin_test`.

## Honesty Statement

This is a public funnel clarity improvement. It is not proof of revenue, invoice issuance, payment settlement, CRM routing, or lawyer handoff. Grow/Meshulam KYC and real payment evidence remain business blockers.
