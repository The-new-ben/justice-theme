# Investor Demo Tab Checklist - 2026-05-24

## Honesty Statement

This checklist is a pre-call operating packet. It does not authorize public CMS/database edits, demo data creation, public profile publishing, live lead creation, payment charges, invoices, refunds, redirects, canonical/noindex changes, sitemap changes or taxonomy changes.

## Current Best-Practice Basis

- Demo preparation checklists recommend a known-good environment, tested screen/audio, one primary workflow and a backup plan if the product fails: https://demosecret.com/demo-checklist
- Demo preparation guidance warns against hunting for tabs or fixing data live; preparation should make the call feel calm and controlled: https://demosecret.com/articles/how-to-prepare-for-a-demo
- Investor/demo hardening guidance says investor-ready is not the same as production-ready: the demo flow should work reliably, load fast, look clean and have an honest backup if live systems fail: https://afterbuildlabs.com/resources/pre-demo-day-mvp-fix-checklist

## Pre-Open These Tabs In This Exact Order

| Tab | Purpose | URL or location | Success check |
|---:|---|---|---|
| 1 | Homepage entry | `https://jus-tice.co.il/` | Lawyer plan/private-area links visible |
| 2 | Lawyer plans | `https://jus-tice.co.il/lawyer-plans/` | Lead Partner paid path visible |
| 3 | Checkout fallback | `https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&utm_source=lawyer_plans&utm_medium=plan_page&utm_campaign=lawyer_acquisition&utm_content=pricing_card_lead_partner&outreach_segment=plans_page` | Billing fields, terms and policy links visible |
| 4 | Registration prefill | `https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&billing_first_name=Investor&billing_last_name=Demo&billing_phone=0501234567&billing_email=investor-demo@example.com&billing_legal_name=Demo+Medical+Law+Ltd&billing_business_id=123456789&billing_invoice_email=billing-demo@example.com&billing_invoice_address=Tel+Aviv` | Demo lawyer/billing fields prefilled |
| 5 | Owner onboarding | WordPress admin > Lawyer Onboarding | Payment, billing and payment-link cards visible |
| 6 | Demo lawyer dashboard | `https://jus-tice.co.il/lawyer-dashboard/` while logged in as the demo lawyer | Real private dashboard, not logged-out gate |
| 7 | Service request queue | WordPress admin > Lawyer Onboarding with `service_request_status=pending` | Controlled service request visible |
| 8 | Investor readiness report | `project-control/investor-demo-readiness-2026-05-24.md` | `PASS_WITH_DISCLOSED_BLOCKERS`, 11 pass, 0 repair |
| 9 | Talk track | `project-control/investor-demo-talk-track-2026-05-24.md` | Closing line and fallback answers ready |
| 10 | Data prep runbook | `project-control/investor-demo-live-data-prep-runbook-2026-05-24.md` | Claimed profile and demo lead checklist ready |

## Backup Pack If Live Admin Is Slow

| Risk | Backup proof | What to say |
|---|---|---|
| WordPress admin is slow | Show readiness report and talk track artifacts | "The route and source checks passed; admin delay is not the product story." |
| Demo lawyer is not claimed yet | Show logged-out dashboard gate plus runbook row | "The private area is deployed; this final step is safe demo data linking." |
| Demo lead is missing | Show CRM runbook row and service desk | "The CRM exists; we are not going to create fake private medical facts without approval." |
| Payment question escalates | Show checkout compliance and policy pages | "Recurring billing is approval-gated; manual payment-link fallback is live." |
| Internet/browser issue | Use reports in `project-control/` as screenshots-by-text | "Here is the exact gate output from the latest run." |

## Five-Minute Pre-Call Checklist

1. Close personal email, WhatsApp Web, Slack and unrelated tabs.
2. Use a clean browser window or profile.
3. Open the ten tabs above in order.
4. Confirm the demo lawyer account opens the private dashboard.
5. Confirm the service request queue can be reached.
6. Confirm the medical-malpractice demo lead has no real private client facts.
7. Keep the payment honesty line visible:

> We do not fake automatic payments. The live system captures paid intent, billing details, payment-link readiness, private-area retention and service requests. Recurring billing, automatic invoices and refunds are approval/mapping work after Grow/Meshulam approval.

## Owner Meaning

The investor demo should feel like one controlled business story, not a technical treasure hunt. The goal is to prove that Jus-Tice can acquire lawyers, move them toward paid plans, show them value through leads, and retain them through a private operating area. Payment automation is an external approval layer, not the core demo claim.

