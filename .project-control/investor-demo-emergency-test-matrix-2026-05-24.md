# Investor Demo Emergency Test Matrix - 2026-05-24

## Honesty Statement

The system is not yet a fully automated payment business. The public lawyer acquisition path, paid-plan fallback checkout, manual invoice/payment-link handoff, lawyer dashboard, mini-site profile flow, lead-stage reporting and owner onboarding command center are real and deployed. Fully automatic recurring charging, automatic invoice issuing, customer self-service subscription switching and automated refunds remain blocked until Grow/Meshulam approval, WooCommerce Subscriptions products, gateway mapping and one controlled payment smoke test are completed.

Current best-practice reference: WooCommerce Subscriptions supports customer upgrade/downgrade switching from the customer subscription view when switching is enabled, and cancellation/suspension depends on subscription settings and gateway support. Jus-Tice currently mirrors those scenarios through a controlled lawyer service desk until recurring products and gateway approval are ready.

## What Is Demo-Ready Now

| Area | Current state | Investor demo status |
|---|---|---|
| Lawyer plan discovery | Header and homepage expose lawyer plans, registration and private area | Demo-ready |
| Paid plan selection | Paid plans route through checkout compliance fallback and manual invoice path | Demo-ready |
| Grow compliance pages | Checkout, terms, cancellation, privacy and business signals pass live checks | Demo-ready for approval review |
| Lawyer self-registration | Lawyer can submit profile, billing details, media and plan interest | Demo-ready, creates pending profile |
| Owner payment queue | Owner sees invoice requested, sent, overdue, billing-ready and payment-link queues | Demo-ready |
| Manual payment link | Owner can paste Grow/Morning payment link and invoice reference into lawyer record | Demo-ready |
| Lawyer private area | Logged-in lawyer sees profile, plan/payment stage, value snapshot, leads, content requests and service requests | Demo-ready when a claimed demo profile exists |
| Mini-site visibility | Lawyer profile template exists and can show public profile when approved/published | Demo-ready if demo profile is connected |
| Lead reporting | Assigned leads appear in dashboard with call/WhatsApp/email and stage updates | Demo-ready if demo lead is assigned |
| Upgrade/downgrade/cancel/refund/complaint | New service request form captures these scenarios and alerts owner | Demo-ready as controlled ticket flow |
| Real recurring payment | Needs Grow/Meshulam approval, products and gateway mapping | Blocked |
| Real automatic invoice with logo | Needs approved invoicing/gateway setup or manual Grow/Morning action | Blocked/Manual |

## Full Scenario List To Test Before Investor

| # | Scenario | Actor | Expected proof | Current status |
|---:|---|---|---|---|
| 1 | Visitor opens homepage and sees lawyer path | Public visitor | Header links to plans, registration and private area | Ready |
| 2 | Lawyer opens `/lawyer-plans/` | Lawyer | Plan cards show paid choices and value | Ready |
| 3 | Lawyer chooses Lead Partner | Lawyer | Route goes to `/checkout/` with plan and manual-invoice intent | Ready |
| 4 | Checkout fallback shows required fields | Lawyer | Name, phone, email, country, terms checkbox, policy links | Ready |
| 5 | Checkout submits to registration | Lawyer | Billing/contact fields prefill registration form | Ready |
| 6 | Lawyer submits registration | Lawyer | Pending lawyer profile is created; owner email is sent | Needs live demo account/data |
| 7 | Owner opens Lawyer Onboarding | Owner | New registration appears with plan, billing and source | Ready |
| 8 | Owner checks license/profile/media | Owner | Profile remains pending until approved | Ready |
| 9 | Owner sees missing billing details | Owner | Queue card and filter identify missing invoice fields | Ready |
| 10 | Owner sees billing-ready lawyer | Owner | Queue card and filter identify invoice-ready registration | Ready |
| 11 | Owner creates Grow/Morning link manually | Owner | Link is pasted into lawyer activation box | Manual until Grow approval |
| 12 | Owner marks invoice sent | Owner | Status changes, due date and handoff message update | Ready |
| 13 | Lawyer sees Complete payment CTA | Lawyer | Private dashboard opens saved payment link | Ready if demo profile has link |
| 14 | Lawyer pays manually | Lawyer | External payment confirmation/invoice exists | Blocked until approved or owner uses manual live link |
| 15 | Owner marks payment confirmed | Owner | Lawyer moves toward activation/first value | Ready |
| 16 | Owner activates profile-ready status | Owner | Dashboard and onboarding show activation progress | Ready |
| 17 | Lawyer logs into private area | Lawyer | Plan/payment, first value meter and profile list visible | Ready if claimed profile exists |
| 18 | Lawyer opens public mini-site | Lawyer | Profile URL opens public lawyer page | Ready if published profile exists |
| 19 | Lawyer requests mini-site update | Lawyer | Pending update saved; public profile unchanged | Ready |
| 20 | Owner applies/discards profile update | Owner | Review flow protects public data | Ready |
| 21 | Lawyer requests signed article | Lawyer | Draft request is created for editorial/legal/source review | Ready |
| 22 | Lawyer requests review campaign | Lawyer | Google/recommendation campaign request saved | Ready |
| 23 | Lawyer requests supplier/provider | Lawyer | Supplier need saved for future partner marketplace | Ready |
| 24 | Public user submits legal lead | Public user | Lead record created and routed | Needs hands-on live write test |
| 25 | Owner assigns/validates lead | Owner | Lead has assigned lawyer ID | Ready if lead record exists |
| 26 | Lawyer sees lead in dashboard | Lawyer | Lead card includes contact actions | Ready if assigned lead exists |
| 27 | Lawyer calls/WhatsApps/emails lead | Lawyer | Buttons open call/WhatsApp/email | Ready |
| 28 | Lawyer marks first attempt | Lawyer | Lead status and first-contact timestamp update | Ready |
| 29 | Lawyer marks contacted | Lawyer | Pipeline moves to first response | Ready |
| 30 | Lawyer marks consultation scheduled | Lawyer | Consultation metric updates | Ready |
| 31 | Lawyer marks won | Lawyer | Retained metric updates | Ready |
| 32 | Lawyer marks lost/not fit | Lawyer | Closed metric updates | Ready |
| 33 | Lawyer asks to upgrade | Lawyer | Service request saved with desired plan | Ready after this update |
| 34 | Lawyer asks to downgrade | Lawyer | Service request saved with desired plan | Ready after this update |
| 35 | Lawyer asks to cancel | Lawyer | Service request saved and owner alerted | Ready after this update |
| 36 | Lawyer asks for refund/money back | Lawyer | Service request saved and owner alerted | Ready after this update |
| 37 | Lawyer complains about lead quality | Lawyer | Service request saved and owner alerted | Ready after this update |
| 38 | Lawyer asks for invoice/receipt copy | Lawyer | Service request saved and owner alerted | Ready after this update |
| 39 | Owner sees pending service requests | Owner | Lawyer Onboarding service-request card/filter | Ready after this update |
| 40 | Grow compliance re-check | Owner | Live compliance checker passes all checks | Ready; passed after production pull |

## Tomorrow Demo Script

1. Show public homepage and lawyer CTAs.
2. Open lawyer plans and choose Lead Partner.
3. Show checkout compliance fallback and terms/policy links.
4. Continue to registration with a medical-malpractice demo lawyer.
5. Submit or show the saved demo registration in Lawyer Onboarding.
6. Show billing readiness, payment-link readiness and next money action.
7. Open the demo lawyer dashboard.
8. Show mini-site status, plan/payment status and Complete payment CTA if a manual link is present.
9. Show assigned medical-malpractice lead, contact buttons and stage update.
10. Submit one service request: refund, cancellation, downgrade, complaint or invoice copy.
11. Return to Lawyer Onboarding and show the service request queue.
12. Be honest: automatic recurring billing becomes one clean WooCommerce/Grow layer after approval.

## Critical Blockers

- Grow/Meshulam approval is still the external blocker for fully automatic recurring billing and live invoice automation.
- WooCommerce Subscriptions products are not yet mapped for Pro, Featured, Lead Partner and Full Service.
- A true real-money demo requires owner-approved payment credentials, product mapping and a tiny controlled transaction.
- A realistic dashboard demo needs at least one claimed demo lawyer profile and one assigned demo lead in the live CMS.

## Immediate Owner-Level Goal

For tomorrow, the safest investor position is: "The platform has the acquisition, onboarding, private area, lead CRM and service desk working. Payment is approval-gated, so we already support a compliant manual payment-link path today and will switch to automatic recurring subscriptions after Grow/Meshulam approval."
