# Investor Demo Morning Control Sheet - 2026-05-25

## One-Minute Truth

The public lawyer revenue path is live and verified. The system can show acquisition, plan selection, compliant checkout fallback, paid registration context, private-area gate, lead follow-up capability, owner queues and service-request capture. The only things not to claim as automated are recurring billing, branded invoice issuance and refund execution until Grow/Meshulam approval and one controlled transaction are complete.

## Open These Tabs In Order

| Step | Tab | URL | What To Say |
|---:|---|---|---|
| 1 | Homepage | https://jus-tice.co.il/ | Lawyers can discover the business path from the homepage, not only from hidden admin pages. |
| 2 | Lawyer plans | https://jus-tice.co.il/lawyer-plans/ | The plan page now sells an account-opening path: visibility, trust profile, measurable leads and follow-up. |
| 3 | Checkout fallback | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice | Until Grow recurring approval, paid intent is captured through a compliant manual-invoice/payment-link fallback. |
| 4 | Paid registration prefill | https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&billing_first_name=Investor&billing_last_name=Demo&billing_phone=0501234567&billing_email=investor-demo@example.com&billing_legal_name=Demo+Medical+Law+Ltd&billing_business_id=123456789&billing_invoice_email=billing-demo@example.com&billing_invoice_address=Tel+Aviv | The lawyer does not lose the plan/payment context when continuing to registration. |
| 5 | Dashboard gate | https://jus-tice.co.il/lawyer-dashboard/ | The private area is visible as a product promise and routes unclaimed users back to onboarding. |
| 6 | Owner onboarding | https://jus-tice.co.il/wp-admin/admin.php?page=justice-lawyer-onboarding | Use the admin-only panel for payment-link steps, payment queue, demo-data checklist and service-request queue. |

## If Owner Approves Live Demo Data

Use the seed packet:

- `project-control/investor-demo-data-seed-packet-2026-05-25.md`
- `project-control/investor-demo-data-seed-packet-2026-05-25.csv`

Controlled data to create:

1. One demo `justice_lawyer` profile for a medical-malpractice lawyer.
2. One WordPress user linked through `claimed_by_user_id`.
3. One assigned medical-malpractice lead linked to that lawyer.
4. One lead-stage update with a follow-up note.
5. One service request from the lawyer dashboard.
6. One real Morning/Grow payment link or manual invoice reference saved on the lawyer record, only after owner/provider approval.

## Do Not Fake

- Do not create fake charges.
- Do not say recurring billing is active.
- Do not say branded invoice automation is active.
- Do not say refunds execute automatically.
- Do not publish demo profiles as verified real lawyers unless the owner explicitly approves the public demo status.

## Current Verified Status

- Homepage investor polish: PASS.
- Lawyer revenue funnel: PASS, 10/10.
- Investor readiness route/source gates: PASS.
- Demo data needed: claimed demo lawyer and assigned medical-malpractice lead.
- External payment blockers: recurring charge, automatic branded invoice, real refund execution.

## Exact Investor Line

The acquisition, onboarding, checkout fallback, private dashboard, lead CRM, follow-up notes and service-request flow are live. Payment automation is approval-gated, so the live bridge today is a real manual Morning/Grow payment link or invoice. Once approval is complete, the same funnel can move to recurring subscription products.
