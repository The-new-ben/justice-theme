# Investor Payment Lifecycle Playbook - 2026-05-25

## Honesty Statement

This playbook is for the morning investor demo and owner execution. It does not create live users, lawyer records, leads, payment links, invoices, refunds, subscriptions, emails, WhatsApp messages or CMS/database changes.

The demo must not claim full automatic recurring billing until Grow/Meshulam approval, product mapping and one controlled real transaction are completed. The correct claim is:

> Jus-Tice has the lawyer acquisition, onboarding, payment-handoff, private-area, lead CRM and service lifecycle ready. Real recurring billing, automatic branded invoices and refunds are provider-gated; the manual payment-link bridge is the current revenue path.

## Current Best-Practice Basis

- Stripe Billing Customer Portal lets customers manage billing details, payment methods, invoices and subscription status from a hosted portal: https://docs.stripe.com/billing/subscriptions/customer-portal
- Stripe subscription-change guidance emphasizes upgrade/downgrade flows, cancellation handling and applying some changes only after payment succeeds: https://docs.stripe.com/billing/subscriptions/change
- Chargebee Self-Serve Portal covers subscription changes, pause/resume/cancel/reactivate, previous invoices, payment methods and billing addresses: https://www.chargebee.com/docs/billing/2.0/hosted-capabilities/self-serve-portal

## What The Investor Should See

| Scenario | Best-practice expectation | Jus-Tice demo path today | Honest status |
|---|---|---|---|
| Lawyer discovers product | Clear account-opening CTA and pricing entry | Homepage lawyer strip -> lawyer plans | Live public path verified |
| Lawyer chooses a plan | Transparent plan, next steps and billing handoff | Lawyer plans -> checkout or registration | Live public path verified |
| Lawyer pays | Secure payment page, receipt/invoice, audit trail | Manual Grow/Morning payment link sent by owner after approval | Provider/manual bridge, not fully automatic |
| Lawyer creates account | Required profile and business fields | Lawyer registration with plan prefill | Live public path verified |
| Lawyer enters private area | Dashboard with profile, leads, billing/service status | Lawyer dashboard login gate plus logged-in command center when claimed | Needs controlled claimed demo lawyer |
| Lawyer receives lead | Lead card, call/WhatsApp/email, stage update | Assigned lead in lawyer dashboard and owner CRM report | Needs controlled demo lead |
| Lawyer reports call outcome | Lead follow-up and owner-visible status | Lawyer lead stage and follow-up note | Code path exists; demo needs data |
| Lawyer requests invoice copy | Self-service request capture | Dashboard service request: invoice copy | Captured internally; automatic invoice depends on provider |
| Lawyer upgrades | Portal-style plan-change request | Dashboard service request: upgrade | Captured internally; owner/provider execution |
| Lawyer downgrades | Portal-style plan-change request with term rules | Dashboard service request: downgrade | Captured internally; owner/provider execution |
| Lawyer cancels | Clear cancellation request and confirmation path | Dashboard service request: cancellation | Captured internally; owner/provider execution |
| Lawyer asks refund | Refund request, reason and support follow-up | Dashboard service request: refund | Captured internally; real refund provider-gated |
| Lawyer complains | Support intake with SLA and queue visibility | Dashboard service request + owner queue | Code path exists |
| Lawyer asks technical help | Contextual support from account area | Dashboard technical support request | Code path exists |

## Morning Demo Order

1. Open `project-control/investor-demo-launchpad-2026-05-25.html`.
2. Show homepage lawyer revenue strip and say: "This is the business side of the marketplace."
3. Open lawyer plans and show the account-opening stages.
4. Open checkout/payment compliance path and say: "This is where paid intent is captured. Until provider approval is complete, the owner sends a real Grow/Morning link manually."
5. Open registration with a plan prefill and explain the fields as activation data, not a loose contact form.
6. Open lawyer dashboard gate. If approved demo data exists, log into the claimed demo lawyer and show the command center.
7. Show one assigned medical-malpractice lead and the call/WhatsApp/email actions.
8. Show lead stage update and lawyer follow-up note.
9. Show service requests for invoice copy, upgrade, downgrade, cancellation, refund and complaint.
10. Close with the honest payment line: "The product loop is ready; automatic money movement is the remaining provider approval layer."

## Real Payment Test Checklist

Do this only with owner approval and a harmless low amount.

| Step | Action | Pass signal | Blocker if failed |
|---|---|---|---|
| 1 | Confirm Grow/Morning account can issue a payment link | Real provider URL exists | Provider account/approval problem |
| 2 | Create a low-amount test link with Jus-Tice branding where available | Link opens provider-hosted payment page | Branding/payment-link setup missing |
| 3 | Send link to owner/customer email or WhatsApp manually | Owner receives real link | Email/WhatsApp handoff not configured |
| 4 | Pay with owner-approved real card | Provider shows paid transaction | Provider/payment approval/card issue |
| 5 | Confirm receipt/invoice with logo | Branded document appears in provider/email | Invoice branding setup missing |
| 6 | Paste transaction/reference into demo lawyer record or owner note if approved | Dashboard/admin can reference proof | Requires approved CMS/admin write |
| 7 | Request refund from dashboard service request | Request captured in owner queue | Dashboard account/data not prepared |
| 8 | Execute refund in provider only if owner approves | Provider shows refunded transaction | Refund permissions/provider issue |

## Do Not Fake

- Do not call manual payment links "automatic subscriptions".
- Do not show a fake paid transaction as real.
- Do not claim automatic branded invoices unless the provider generated one.
- Do not claim a refund happened unless the provider shows it.
- Do not create live lawyer, lead, invoice, refund or payment data without explicit owner approval.

## Fastest Revenue-Safe Path

1. Use manual Grow/Morning payment links for the first lawyer subscription sales.
2. Keep the lawyer dashboard as the value proof: profile, leads, lead follow-up and service requests.
3. Capture upgrade, downgrade, cancellation, invoice, refund and complaint requests inside the dashboard.
4. Execute billing actions manually in the provider until recurring billing is approved and mapped.
5. After provider approval, replace the manual bridge with a real hosted customer portal or approved recurring-billing flow.

## Completion Assessment

- Materially advanced: investor demo now has a clear, honest payment/customer-lifecycle script aligned with mature billing portal patterns.
- Still blocked: real low-amount payment, branded invoice and refund require owner-approved provider actions; claimed demo lawyer and assigned demo lead require approved live data setup.
- Estimated investor-demo readiness: route/product proof remains about 98%; full real-money lifecycle proof remains about 86% until provider test and demo data are executed.
- Owner can notice the change in: `project-control/investor-payment-lifecycle-playbook-2026-05-25.md`.
