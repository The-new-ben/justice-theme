# Investor Demo Master Runbook - 2026-05-24

## Goal

Give the investor a real, controlled demonstration of Jus-Tice as a lawyer revenue product without pretending unfinished payment automation is complete.

This runbook uses only verified or provider-tested paths:

- Real public site.
- Real lawyer registration path.
- Real WordPress lawyer onboarding/admin queue.
- Real Grow account.
- Real one-time Grow payment link.
- Real support escalation for recurring debit authorization.

## Research Basis

Current best-practice for the demo is to separate the subscription engine, payment processor, customer account area and support lifecycle instead of claiming one screen does everything.

- WooCommerce Subscriptions documents that subscribers manage subscriptions from My Account, including status, next payment date and links to view/manage each subscription.
- WooCommerce renewal guidance documents customer recovery through a Pay action when renewal payment needs customer action.
- Grow Payment Links are explicitly positioned as shareable through WhatsApp, email and SMS, and embeddable on a website or landing page.
- Morning/Green Invoice digital payments support online payment collection channels, but recurring debit authorization still depends on the provider/account being enabled.

Sources:

- https://woocommerce.com/document/subscribers-view/
- https://woo.zendesk.com/hc/en-us/articles/15664179845780-Subscription-Renewal-Process
- https://grow.business/payment-links/
- https://www.greeninvoice.co.il/help-center/digital-payments/

## Demo Truth

| Area | Status | Investor-safe statement |
|---|---|---|
| Lawyer signup | Green | A lawyer can start registration from the live site and the system creates a controlled onboarding record. |
| Lawyer account invite | Green | The account-invite deployment marker was verified live after uPress pull and a fresh demo registration was submitted. |
| Lawyer dashboard | Yellow-green | Demo through the linked lawyer account after password setup. If email delivery is delayed, use WordPress admin password reset and state this is an email-delivery fallback. |
| Lead capture | Green | A medical-malpractice demo lead was already submitted and should be shown in admin/CRM context. |
| One-time payment | Yellow-green | A real Grow NIS 1 payment link exists, opens a branded Jus-Tice payment page, and was emailed to the owner. It becomes green only after the owner pays it and Grow shows transaction/receipt proof. |
| Recurring billing | Red/yellow | The real Grow recurring-debit path was tested and Grow blocked it with provider/account authorization. Escalation was sent to Grow support. Do not claim automatic recurring subscriptions are working. |
| Invoices | Yellow | Branded invoice proof depends on payment completion and Morning/Grow receipt visibility. Show provider page and explain invoice verification is the next smoke check after payment. |
| Upgrades/downgrades | Yellow | Show lifecycle/service request capture and planned WooCommerce-style account flow. Do not claim automatic proration or recurring switch is live. |
| Cancellation/refund | Yellow | Show request capture and owner follow-up path. Do not claim automatic money movement. |
| Support/complaints | Green for intake, yellow for automation | Show service desk/request capture. AI support can be positioned as planned first-response assistance, not autonomous legal/payment resolution. |

## Five-Minute Investor Demo Script

1. Open the homepage and point to the lawyer revenue path.
2. Open `/lawyer-plans/` and choose the paid lawyer plan path.
3. Open `/lawyer-registration/` with plan intent and show the registration form.
4. Show the already-created investor demo lawyer record in WordPress admin.
5. Show the lawyer account invite/password setup email or the admin fallback if email is delayed.
6. Log in to `/lawyer-dashboard/` as the demo lawyer.
7. Show the dashboard: profile status, payment status, lead handling, service requests and lifecycle actions.
8. Show the medical-malpractice lead and the lawyer follow-up/reporting path.
9. Open the real Grow NIS 1 payment link from the owner email and show the branded secure payment page.
10. If paid before demo, show Grow transaction/receipt proof. If not paid, say: "This is the live provider payment page and the controlled NIS 1 payment is ready for smoke verification."
11. Show the recurring blocker honestly: "We tested real recurring debit; Grow returned account authorization blocker. Support escalation is already sent."
12. Close with next commercial step: "One-time paid onboarding can run now; automatic recurring subscription activation is the provider enablement step."

## Tonight's Critical Owner Actions

| Priority | Action | Why it matters |
|---|---|---|
| P0 | Pay the real Grow NIS 1 link from the email `REAL Grow payment link ready: Jus-Tice investor demo 1 NIS smoke test`. | Converts one-time payment from "ready" to "paid proof". |
| P0 | Verify the paid transaction and receipt in Grow/Morning. | Gives investor hard proof of real money movement and accounting trail. |
| P0 | Check owner inboxes for the lawyer account invite/password setup email. | Avoids spending demo time looking for the login email. |
| P1 | If needed, manually set/reset password for the demo lawyer user in WordPress admin. | Ensures dashboard login works even if mail delivery is slow. |
| P1 | Paste the real Grow payment link into the demo lawyer admin record and send it through the admin handoff if WordPress-to-lawyer email proof is required. | Demonstrates the site can operationally hand off a real payment link. |
| P1 | Keep Grow support thread visible. | Shows recurring billing is a known provider enablement issue, not ignored. |

## Scenario Checklist

| Scenario | Demo action | Current status | Do not say |
|---|---|---|---|
| New lawyer registers | Submit or show existing investor demo registration | Ready | Do not say every edge case is fully automated. |
| Lawyer logs in | Use setup email or admin reset fallback | Ready with fallback | Do not spend demo time debugging inbox search. |
| Lawyer sees mini-site/profile | Show profile/dashboard relation | Ready enough for demo | Do not promise published profile without owner review if draft. |
| Lawyer receives lead | Show medical-malpractice demo lead | Ready | Do not claim paid lead routing is live for every plan until payment state gates are proven. |
| Lawyer reports on lead | Use dashboard/service/reporting area where available | Demo-ready for capture | Do not claim automated revenue attribution is fully closed-loop. |
| Lawyer pays one-time | Use real Grow link | Ready pending owner payment | Do not claim paid until transaction visible in Grow. |
| Lawyer starts recurring subscription | Show blocker and escalation | Blocked by Grow authorization | Do not claim automatic recurring billing works. |
| Lawyer upgrades/downgrades | Show request/service desk capture | Intake-ready | Do not claim automatic proration/switching is live. |
| Lawyer cancels | Show cancellation request capture | Intake-ready | Do not claim automated entitlement cutoff is fully tested. |
| Lawyer asks refund | Show refund request capture | Intake-ready | Do not claim automatic refund execution. |
| Lawyer complains/support | Show service request path and owner queue | Intake-ready | Do not claim autonomous AI support resolves legal or billing disputes. |

## Recovery Lines For Investor Questions

| Question | Answer |
|---|---|
| Can a lawyer pay today? | Yes for a real one-time payment link. We created and verified a Grow NIS 1 provider page. After the owner pays it, we can show the transaction/receipt. |
| Are monthly subscriptions fully automated today? | Not yet. We tested Grow recurring debit live and the provider returned an account authorization blocker. The unblock request is already with Grow support. |
| Is this just a mock? | No. The registration, account invite, live site, Grow account and one-time payment link are real. The only blocked part is automatic recurring debit authorization. |
| What happens when a lawyer complains or wants refund/cancel? | The system captures the request and routes it to owner follow-up. Money movement remains manual/provider-controlled until recurring/refund automation is enabled and tested. |
| What is the fastest revenue path? | Sell manual-invoice / one-time-payment-link onboarding first, prove value with leads and dashboard, then switch to recurring once Grow enables it. |

## Completion Assessment

- Live investor demo narrative: 88% ready after this runbook.
- One-time money movement: 75% until the owner pays the NIS 1 link; 85% after Grow transaction/receipt proof.
- Lawyer registration/account/dashboard path: 85% ready with email/password fallback.
- Full recurring SaaS subscription lifecycle: 45% because Grow recurring debit remains provider-blocked.
- Refund/upgrade/downgrade automation: 35%-45%; intake is demoable, money and entitlement automation still require provider/product smoke tests.

## Safety

This artifact does not change public CMS/database content, redirects, canonicals, noindex, sitemaps, taxonomies, products, payment gateway settings, charges, invoices, refunds, lawyer records, leads, CRM records, GSC or GA4 settings.

