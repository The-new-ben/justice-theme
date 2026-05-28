# Lawyer Registration Revenue Bridge - 2026-05-28

Status: PUSH_READY_DEPLOY_REQUIRED

Scope: public theme-code improvement for `/lawyer-registration/` plus a read-only QA gate. No CMS content, database row, WooCommerce product, gateway setting, CRM record, lawyer profile, user, invoice, payment, refund, WhatsApp message, email, redirect, canonical/noindex, sitemap, taxonomy, or uPress setting was created or changed.

## Goal

Make the lawyer signup page explain exactly what turns a registration into a commercially usable lead for Jus-Tice:

- response commitment,
- practice and city fit,
- billing details,
- invoice/payment-link stage,
- and paid status only after payment evidence.

## Public Page Change

Added `lawyer-registration-revenue-bridge` above the registration form with:

- `data-revenue-surface="lawyer_registration_revenue_bridge"`
- `data-funnel-step="lawyer_registration_to_invoice_followup"`
- states for lead response, practice/city fit, billing readiness, and paid proof.

This makes the page more direct for lawyers who arrive from `/lawyer-plans/` with `plan_interest=lead_partner&payment_path=manual_invoice`.

## Verification Added

Added `.project-control/scripts/check-lawyer-registration-revenue-bridge.ps1`.

The checker confirms the live registration URL exposes:

- the revenue bridge,
- manual invoice path,
- selected lead-partner plan,
- response commitment field,
- billing invoice field,
- `invoice_sent`,
- theme version `1.1.72`,
- deployment marker `2026-05-28-lawyer-registration-revenue-bridge-v1`.

Wired this checker into `.project-control/scripts/check-revenue-readiness-gate.ps1` as `lawyer_registration_revenue_bridge`.

## Deployment Target

- Theme version: `1.1.72`
- Deployment marker: `2026-05-28-lawyer-registration-revenue-bridge-v1`
- CSS cache version: `4.5.8`

## Remaining Blockers

- Grow/Meshulam KYC/payment proof is still not verified.
- No real paid lawyer, invoice, payment, refund, order, subscription, CRM update, or provider settlement was created.
- This improves the public lawyer-conversion path; it is not revenue proof.

## Honesty Statement

This is a visible public funnel improvement and QA gate, not a payment action. It makes the lawyer registration page stricter about what must exist before owner/admin can move from interest to invoice and from invoice to paid status.
