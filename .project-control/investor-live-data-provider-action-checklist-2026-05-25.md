# Investor Live Data And Provider Action Checklist - 2026-05-25

## Purpose

This is the short owner-side checklist for resolving the five remaining investor blockers without improvising:

1. Claimed demo lawyer.
2. Assigned medical-malpractice lead.
3. Real low-amount provider payment.
4. Branded invoice/receipt proof.
5. Refund execution proof.

Do not perform these actions unless the owner explicitly approves live data/payment/provider actions.

## Current Best-Practice Basis

- HubSpot demo guidance emphasizes showing value and communicating clear next steps after a demo: https://blog.hubspot.com/sales/product-demo
- Stripe Payment Links documentation shows the accepted no-code pattern: create a payment link and share it with a customer, while subscriptions/recurring billing belong to Stripe Billing or an equivalent provider setup: https://docs.stripe.com/payments/payment-links
- Stripe support guidance describes payment links as a way to sell a product/subscription or accept payment by sharing a hosted payment page link: https://support.stripe.com/questions/choosing-between-payment-links-invoicing-checkout-and-payment-element

## Five-Minute Owner Checklist

| Order | Action | Where | Pass signal | Say to investor |
|---:|---|---|---|---|
| 1 | Create or confirm one demo lawyer user/account | WordPress admin | Lawyer can log in and reach the private area | "This is a controlled demo lawyer account." |
| 2 | Link that user to one `justice_lawyer` profile through `claimed_by_user_id` | WordPress admin / lawyer profile | Dashboard shows the claimed lawyer context | "The private area is gated by claimed profile ownership." |
| 3 | Assign one safe medical-malpractice demo lead to that lawyer | Lead/CRM admin | Dashboard shows one lead card with call/WhatsApp/email actions | "This shows the lead workflow without exposing a real client." |
| 4 | Create a low-amount real Grow/Morning payment link | Provider dashboard | Hosted provider URL opens | "This is the current manual payment bridge." |
| 5 | Send/pay the link only if approved | Provider + owner email/phone | Provider shows paid transaction | "This is real payment proof; recurring automation remains provider-gated." |
| 6 | Confirm receipt/invoice branding | Provider/email | Branded receipt/invoice is visible | "Invoice proof comes from the provider, not a mock." |
| 7 | Submit a refund/cancellation/invoice-copy request from the dashboard | Claimed demo lawyer dashboard | Owner queue captures request | "The system captures lifecycle service requests." |
| 8 | Execute refund only if owner approves | Provider dashboard | Provider shows refund status | "Refund execution is provider-side and must be real." |

## Minimum Demo If There Is No Time

If the owner has less than five minutes, prioritize:

1. Claimed demo lawyer.
2. Assigned medical-malpractice lead.
3. Real provider payment link URL.

Then say:

> The product loop is visible and verified. The only live proof not executed in this minute is the provider-side charge/invoice/refund sequence, which we are correctly treating as a controlled payment action rather than a fake demo.

## Required Disclosure

Use this sentence before payment questions:

> Payment links are the current manual revenue bridge. Automatic recurring billing, branded invoices and refund execution require provider-approved proof and should not be claimed as automatic until a controlled transaction passes.

## Do Not Do

- Do not create a real client lead with private facts for a demo.
- Do not charge a card without explicit owner approval.
- Do not refund a real payment without explicit owner approval.
- Do not change public CMS content, redirects, canonicals, sitemaps or taxonomies.
- Do not call demo data a real paying customer unless it truly is.

## Completion Assessment

- Materially advanced: the remaining five blockers are now reduced to exact owner/provider actions with pass signals.
- Still blocked: actual live execution requires explicit owner/provider approval.
- Estimated completion: investor operator readiness is about 95%; full real-money lifecycle proof is still blocked until controlled live provider execution happens.
- Owner can notice the change in: `project-control/investor-live-data-provider-action-checklist-2026-05-25.md`.
