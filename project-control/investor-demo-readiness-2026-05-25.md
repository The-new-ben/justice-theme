# Investor Demo Readiness Gate - 2026-05-25

- Status: PASS_WITH_DISCLOSED_BLOCKERS
- Started: 2026-05-24T21:12:22.456Z
- Base URL: https://jus-tice.co.il
- Passed live/source checks: 14
- Demo data items needed: 2
- External payment blockers: 3
- Checks needing repair: 0
- Scope: read-only public route checks plus local source/report checks. No live CMS/database write is performed.
- Honesty rule: show manual payment-link readiness and service-ticket capture; do not claim automatic recurring billing, automatic invoices or refunds are live until Grow/Meshulam approval and a controlled transaction pass.

## Summary

Live/code checks pass. 2 demo-data items and 3 external payment items must be disclosed, not faked.

## Demo Rows

| Area | Status | Evidence | Owner action |
|---|---:|---|---|
| Public visitor can find lawyer revenue paths | PASS | https://jus-tice.co.il/ | Open homepage and point to lawyer plans, registration and private-area links. |
| Paid lawyer plan routes to checkout/manual invoice path | PASS | https://jus-tice.co.il/lawyer-plans/?investor_demo_check=1779657142545 | Choose Lead Partner and explain this is the compliant fallback until Grow recurring approval lands. |
| Checkout exposes Grow-required customer and policy signals | PASS | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&investor_demo_check=1779657142545 | Show required fields, terms approval and policy links for Grow review. |
| Registration preserves paid manual-invoice plan state | PASS | https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&billing_first_name=Investor&billing_last_name=Demo&billing_phone=0501234567&billing_email=investor-demo@example.com&billing_legal_name=Demo+Medical+Law+Ltd&billing_business_id=123456789&billing_invoice_email=billing-demo@example.com&billing_invoice_address=Tel+Aviv&investor_demo_check=1779657142545 | Use this route to show how a medical-malpractice lawyer arrives with billing context already carried forward. |
| Logged-out dashboard gate sells the paid lawyer path | PASS | https://jus-tice.co.il/lawyer-dashboard/?investor_demo_check=1779657142545 | If not logged in, show that the private area pushes lawyers back to subscription onboarding. |
| Private-area service desk UI marker is deployed | PASS | https://jus-tice.co.il/wp-content/themes/justice-theme/assets/css/premium-pass-3.css?investor_demo_check=1779657142545 | Use a claimed lawyer account to submit one refund/cancel/complaint ticket. |
| Grow policy pages remain reachable | PASS | https://jus-tice.co.il/sample-terms-and-conditions-template/?investor_demo_check=1779657142545 | Show business identity, contact details, cancellation and privacy links if the investor asks about payment approval. |
| Source supports subscription lifecycle service requests | PASS | inc/lawyer-dashboard.php | Explain that upgrade/downgrade/cancel/refund are captured as owner-actionable tickets until recurring billing is approved. |
| Lawyer CRM captures lead follow-up notes | PASS | inc/lawyer-dashboard.php | After a controlled demo lead exists, update its stage and add a short call result note from the lawyer dashboard. |
| Owner CRM shows lawyer follow-up reports | PASS | inc/lead-crm.php | Open Justice CRM or the lead edit screen after the lawyer updates a demo lead and show the owner-visible report. |
| Lawyer dashboard renders the private service desk | PASS | page-lawyer-dashboard.php | Open the claimed demo lawyer dashboard and show the request form. |
| Owner command center can find pending service requests | PASS | inc/lawyer-onboarding.php | Open Lawyer Onboarding with service_request_status=pending after a controlled request is submitted. |
| Owner onboarding has investor demo control panel | PASS | inc/lawyer-onboarding.php | Open Lawyer Onboarding and use the dark investor demo panel as the morning run order. |
| Investor scenario matrix exists | PASS | project-control/investor-demo-emergency-test-matrix-2026-05-24.md | Use the matrix as the rehearsal order and keep blockers explicit. |
| Claimed lawyer profile with dashboard access | NEEDS_DEMO_DATA | Requires one logged-in user linked to a justice_lawyer profile through claimed_by_user_id. | Prepare one demo lawyer account/profile before the investor call. |
| Assigned medical-malpractice lead for CRM walkthrough | NEEDS_DEMO_DATA | Dashboard lead CRM is ready when a lead exists and is assigned to the demo lawyer. | Use an existing safe demo lead or create one controlled live lead only with owner approval. |
| Real recurring subscription charge | EXTERNAL_BLOCKER | Grow/Meshulam approval and WooCommerce subscription product/gateway mapping are still required. | Do not fake this. Present manual payment-link fallback as live and recurring billing as approval-gated. |
| Automatic branded invoice/receipt with logo | EXTERNAL_BLOCKER | Needs approved Grow/Morning invoice/payment setup and one controlled transaction. | Show policy/compliance readiness and explain the next approval step. |
| Real refund execution | EXTERNAL_BLOCKER | Refund requests are captured in the service desk; actual refund execution depends on payment provider approval. | Demo the refund request ticket, not a fake refund. |

## Rehearsal Order

1. Homepage lawyer entrypoints.
2. Lawyer plans to checkout/manual invoice.
3. Registration with medical-malpractice demo lawyer context.
4. Owner onboarding payment queue and payment-link readiness.
5. Claimed lawyer private area.
6. Lead CRM stage update with a safe assigned demo lead.
7. Service desk request: refund, cancel, downgrade, complaint or invoice copy.
8. Owner queue for pending service request.
9. Honest payment explanation: approval-gated automation, live manual payment-link fallback.

## Rerun

```powershell
node tools/check-investor-demo-readiness.mjs
```
