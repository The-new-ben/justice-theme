# Investor Demo Scenario Script - 2026-05-25

## Scenario

I am a medical-malpractice lawyer. I want to join Jus-Tice, choose a paid lead plan, understand payment, see my private area, receive a lead, update the lead, and ask for service help.

## Script

### 1. Public Discovery

Open: https://jus-tice.co.il/

Say:

I can find the lawyer business path from the homepage. This is not hidden in admin. The site is built to convert both legal clients and lawyer customers.

Point to:

- Lawyer entrypoint in the header.
- Homepage lawyer revenue strip.
- Lawyer plans and registration links.

### 2. Plan Selection

Open: https://jus-tice.co.il/lawyer-plans/

Say:

This page is not just a price table. It explains the business account path: visibility, trust profile, measurable leads, follow-up, service, and payment handoff.

Choose:

Lead Partner.

### 3. Payment Fallback

Open:

https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice

Say:

Automatic recurring billing is approval-gated. Until Grow/Meshulam approval is complete, paid intent is captured through a compliant manual-invoice or real payment-link path. No fake automatic charge is claimed here.

Point to:

- Customer identity fields.
- Phone and email.
- Terms checkbox.
- Terms, cancellation and privacy links.

### 4. Registration Context

Open:

https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&billing_first_name=Investor&billing_last_name=Demo&billing_phone=0501234567&billing_email=investor-demo@example.com&billing_legal_name=Demo+Medical+Law+Ltd&billing_business_id=123456789&billing_invoice_email=billing-demo@example.com&billing_invoice_address=Tel+Aviv

Say:

The lawyer does not lose plan and billing context after checkout. Registration keeps the paid manual-invoice state and asks for the operational fields needed to activate a real account.

### 5. Private Area Gate

Open: https://jus-tice.co.il/lawyer-dashboard/

Say:

If the lawyer is logged out, the dashboard still explains the product: mini-site, payment link, lead follow-up, and service requests. A claimed lawyer account unlocks the private workflow.

### 6. Owner Admin

Open:

https://jus-tice.co.il/wp-admin/admin.php?page=justice-lawyer-onboarding

Say:

This is the owner command center. It has the payment-link playbook, payment queue, demo-data checklist, service request queue and source/lead tracking.

Point to:

- Investor demo control panel.
- Real payment-link playbook.
- Demo data checklist.
- Payment follow-up queue.

### 7. Claimed Lawyer Demo

Only if owner-approved live demo data exists.

Say:

Now I log in as the demo medical-malpractice lawyer and see the private dashboard: profile state, payment state, assigned lead, lead contact actions, lead-stage update and service request form.

Use:

- Adv. Daniel Rosen.
- Lead: Noa Cohen, medical malpractice inquiry.
- Follow-up note: "I spoke with the client, requested hospitalization summary, surgery documentation, and test results. Follow-up call scheduled after documents are received."

### 8. Service Request

Submit one controlled request:

Type: Lead quality.

Message:

The first lead is relevant, but medical documents are missing. Please mark quality and continue tracking.

Say:

Upgrade, downgrade, cancellation, refund, invoice and lead-quality requests are captured as owner-actionable service tickets. Payment execution remains provider-gated.

### 9. Close

Say:

The acquisition, onboarding, checkout fallback, private dashboard, lead CRM, follow-up notes and service-request flow are live. Payment automation is the final provider layer: today the live bridge is a real manual Morning/Grow payment link or invoice; after approval, the same funnel can move to recurring products.

## Panic Lines

If asked "Can I pay right now?":

Yes, through a real manual Morning/Grow payment link created by the owner. Automatic monthly billing is not claimed until Grow/Meshulam approval is complete.

If asked "Can refunds happen automatically?":

Refund requests are captured and routed to the owner. Actual refund execution depends on the active payment provider path.

If asked "Is this fake data?":

The routes and workflows are live. The demo lawyer/lead can be controlled demo data for presentation, and must be disclosed as demo data unless using an actual approved customer.
