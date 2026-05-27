# Lawyer Money Path Live Check

Date: 2026-05-28
Status: live read-only money-path smoke test passed.

## Goal

Verify that a lawyer can reach the visible money path on the live site: plan page, checkout/manual-invoice bridge, registration prefill, and dashboard route. This does not create a user, order, invoice, subscription, or payment.

Reusable script:

`C:\Users\janana\jutice-theme\.project-control\scripts\check-lawyer-money-path.ps1`

## Command

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-lawyer-money-path.ps1
```

## Result

Pass: `true`

Checked at:

`2026-05-27T21:49:39.3056892Z`

Base URL:

`https://jus-tice.co.il`

## Passed Checks

| Check | URL | Status | Meaning |
|---|---|---:|---|
| Lawyer plans money page | `https://jus-tice.co.il/lawyer-plans/` | 200 | Plans page is reachable and includes plan cards, registration link, and manual-invoice/payment-path signals. |
| Checkout manual-invoice bridge | `https://jus-tice.co.il/checkout/?plan_interest=lead_partner...` | 200 | Checkout route preserves lawyer plan intent, invoice/payment-path signals, billing fields, terms, and registration fallback. |
| Registration manual-invoice prefill | `https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice...` | 200 | Registration route preserves lead-partner plan intent, manual-invoice path, and invoice billing fields from query parameters. |
| Lawyer dashboard route | `https://jus-tice.co.il/lawyer-dashboard/` | 200 | Dashboard route is reachable and served by the active theme. |

## Revenue Relevance

This proves that the current live site has a visible lawyer monetization path:

- lawyer sees a plan page,
- lawyer can move toward checkout or manual invoice,
- lawyer registration can carry plan and billing context,
- lawyer dashboard route exists for post-signup/account flow.

This creates a minimum gate for future homepage/header/footer changes: the lawyer money path must remain reachable and query context must survive from acquisition to registration or checkout.

## What This Does Not Prove

- It does not create a real lawyer user.
- It does not submit registration.
- It does not create a WooCommerce order.
- It does not create or send a Meshulam/Grow invoice.
- It does not charge money.
- It does not verify webhook behavior, renewal, refund, cancellation, failed payment, or subscription state.
- It does not prove a lawyer received a lead.

## Current Blockers

- Grow/Meshulam KYC/payment readiness remains blocked until live payment/invoice proof is available.
- Mobile-menu stability fix is pushed to Git but still not confirmed live. Rechecked at `2026-05-27T21:50:34.1161623Z`: expected marker `2026-05-27-mobile-menu-stable-toggle-v1` was not present, expected version `1.1.67` was not present, and old live marker `2026-05-27-footer-trust-path-v1` was still present.
- Chrome extension control remains unavailable from Codex, so authenticated uPress/Lovable/ChatGPT/Gemini/Claude browser actions are not executable from here yet.

## Honesty Statement

This is a real live read-only smoke test. It proves the route structure and manual-invoice bridge are visible on production, but it is not proof of revenue, a paid lawyer, a payment, an invoice, CRM routing, or a completed supplier handoff.
