# Grow Recurring Debit Live Attempt - 2026-05-24

## Status

Attempted a real Grow recurring-debit setup in `Grow > הוראות קבע` for the investor demo.

This was a live provider test, not a repo mock.

## Attempted Setup

| Field | Value |
|---|---|
| Provider | Grow |
| Account | `Jus-Tice Israel` / `10182706` |
| Flow | `הוראות קבע` |
| Amount | `₪1` monthly |
| Charge count | `2` monthly charges |
| Description | `Jus-Tice recurring subscription smoke test` |
| Customer name | `Jus-Tice Investor Recurring Test` |
| Phone | `0525101555` |
| Email | `benbetesh@gmail.com` |
| Action attempted | `יצירת לינק חד-פעמי` for recurring setup |

## Result

Grow did not create the recurring setup link.

Exact provider message:

`לקוח אינו מורשה להוראת קבע`

## Meaning

One-time payment-link creation is working and already has a real `₪1` provider link.

Recurring debit / subscription setup is not yet authorized in Grow for this account/customer flow. This is a provider/account capability blocker and must not be presented as working in the investor demo.

## Investor-Safe Answer

If asked about subscriptions:

`We can create and send real one-time Grow payment links today, and we already have a live ₪1 smoke-test link ready. We also tested Grow recurring debit live. Grow blocked the recurring setup with "לקוח אינו מורשה להוראת קבע", so recurring billing is the next provider enablement step, while the product already captures upgrade, downgrade, cancellation and refund requests operationally.`

## Next Actions

1. Pay the existing `₪1` one-time Grow link and verify transaction/receipt.
2. Ask Grow support why account/customer is not authorized for `הוראת קבע`.
3. If Grow enables recurring debit, create a fresh `₪1` recurring setup link and verify it opens.
4. Only after that map real lawyer subscription plans to recurring products/gateway behavior.

## Safety

No recurring agreement was created. No money moved. No invoice, refund, WordPress CMS/database content, product, gateway setting, lawyer record, lead, CRM record, GSC or GA4 setting was created/changed by this failed attempt.
