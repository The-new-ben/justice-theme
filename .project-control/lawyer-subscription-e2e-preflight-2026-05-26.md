# Lawyer Subscription E2E Preflight - 2026-05-26

Status: PASS_WITH_RUNTIME_BLOCKERS

Scope: repo-local, no-PII static preflight for the later lawyer registration, subscription, payment, dashboard, CRM, upgrade/downgrade/cancel/refund and lead-billing walkthrough.

## What This Proves

- Static gates passing: 8/9
- Warnings: 1
- Blocked static gates: 0
- Public CMS/database state was not changed.
- No lawyer, lead, supplier, invoice, payment, email, WhatsApp or TalkTo record was created.

## Runtime Blockers

- A controlled live lawyer user and claimed lawyer profile are required for dashboard login and plan-status proof.
- A controlled live registration must be owner-approved before creating/editing production lawyer records.
- Grow/Meshulam/Morning provider setup, product mapping and real payment-link behavior remain outside static repo proof.
- A real transaction/reference plus invoice or receipt proof must be recorded before subscription revenue is counted.
- Upgrade, downgrade, cancellation and refund flows need one controlled live service-request drill each.
- Lead revenue needs a consented controlled lead, accepted lawyer/supplier terms, owner release and billing evidence.

## Walkthrough Order

- 1. Visitor sees legal-help-first site; lawyer join flow remains secondary.
- 2. Lawyer selects a paid plan or fallback manual-invoice path.
- 3. Registration captures plan interest, account path and billing fields.
- 4. Admin onboarding queue records invoice/payment link status.
- 5. Lawyer dashboard exposes payment link and service requests.
- 6. A controlled lead is assigned and stage-updated from the lawyer dashboard.
- 7. CRM records invoice/reference and payment evidence before revenue is counted.

## Gate Results

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| LSE-01 | paid_plan_catalog_and_checkout_mapping | PASS | 6/6 markers found | Use the plan payment requirements table before any paid-plan walkthrough. |
| LSE-02 | manual_invoice_checkout_fallback | PASS | 10/10 markers found | During walkthrough, open the fallback checkout path and verify customer fields, terms, cancellation and privacy links. |
| LSE-03 | lawyer_registration_captures_plan_and_billing | PASS | 8/8 markers found | Create only an owner-approved test lawyer/profile in the live walkthrough, then confirm billing metadata lands on the draft profile. |
| LSE-04 | onboarding_admin_payment_queue | PASS | 8/8 markers found | In wp-admin, verify the lawyer appears in the correct billing queue and only send payment email from an owner-approved test record. |
| LSE-05 | lawyer_dashboard_payment_and_service_requests | PASS | 5/5 markers found | Walk through the lawyer dashboard after a claimed profile exists: payment link, upgrade, downgrade, cancel, refund, invoice and lead-stage update. |
| LSE-06 | lawyer_dashboard_request_handlers | PASS | 7/7 markers found | Submit one controlled dashboard service request and one lead-stage update only after the live test lawyer exists. |
| LSE-07 | qualified_lead_billing_proof_fields | PASS | 7/7 markers found | After a controlled lead is assigned, record invoice/payment proof before counting revenue. |
| LSE-08 | grow_compliance_checker_available | PASS | 6/6 markers found | Run the Grow checker before provider/payment walkthrough and keep the generated artifacts private. |
| LSE-09 | stale_live_funnel_checker_quarantined | WARN | Old checker still has stale markers: homepage-lawyer-revenue__account-steps | Do not run tools/check-live-lawyer-revenue-funnel.mjs for current proof until it is migrated to the customer-first homepage and dot-private artifact paths. |

## Safety Statement

This preflight writes only dot-private `.project-control` and `.reports` artifacts. It does not publish or update public pages, titles, H1s, meta, redirects, canonicals, noindex, sitemaps, taxonomies, leads, lawyer records, suppliers, products, invoices, payment links, emails, WhatsApp/TalkTo messages, GSC, GA4 or provider settings.
