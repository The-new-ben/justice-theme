# Investor Demo Talk Track - 2026-05-24

## Honesty Statement

This is the live investor demo script for tomorrow. It is designed to show the real money machine without claiming unfinished automation. It does not authorize CMS/database writes, public profile publishing, payment charges, invoices, refunds, redirects, canonical/noindex changes, sitemap changes or taxonomy changes.

## Demo Principle

Do not show a feature tour. Show one business workflow:

**A medical-malpractice lawyer discovers Jus-Tice, chooses a paid plan, registers, enters the owner onboarding queue, receives leads, manages them in the private area, and asks for billing/support changes through the service desk.**

Best-practice basis:

- SaaS demo guidance consistently says to show outcomes and business value, not a long feature list: https://www.lindy.ai/blog/saas-demo
- Current investor-demo guidance says investors look for a specific problem, persona and proof that the product solves it: https://www.axiosware.com/blog/what-investors-look-for-mvp-demo
- WooCommerce Subscriptions switching/cancellation depends on subscription eligibility, completed payment and gateway support, so Jus-Tice should not fake self-service billing until Grow/Meshulam approval and product mapping are complete:
  - https://woocommerce.com/document/subscriptions/customers-view/subscribers-view-switch/
  - https://woocommerce.com/document/subscriptions/switching-guide/
  - https://woocommerce.com/document/subscriptions/customers-view/suspend-cancel-or-remove-an-item/

## 12-Minute Demo Flow

| Minute | Screen | What to show | Talk track | Proof point |
|---:|---|---|---|---|
| 0:00 | Homepage | Lawyer CTAs in header/homepage | "This is not only a legal content site. It is becoming a lawyer acquisition and retention platform." | Public entrypoints exist |
| 1:00 | `/lawyer-plans/` | Lead Partner plan | "The first revenue motion is paid lawyer subscriptions and lead access, not ads." | Paid plan cards and checkout links |
| 2:00 | Checkout fallback | Required fields, terms, policy links | "Until recurring billing approval is final, we route paid intent into a compliant manual invoice/payment-link path." | Grow compliance signals |
| 3:00 | Registration URL with prefilled medical-malpractice context | Billing fields and selected plan | "The lawyer arrives already tagged by plan, source and billing context." | Attribution and billing state preserved |
| 4:00 | Owner Lawyer Onboarding | Billing/payment/payment-link queues | "The owner does not hunt through WordPress. The revenue queue tells them the next money action." | Payment readiness queue |
| 5:30 | Demo lawyer private dashboard | Plan/payment status, profile, content/service blocks | "This is the lawyer’s private zone. The goal is retention: profile, leads, services, billing and ROI in one place." | Claimed profile required |
| 7:00 | Lead CRM section | Medical-malpractice demo lead and contact/stage buttons | "A lead is not just emailed and forgotten. The lawyer reports contact and outcome, which turns into proof of ROI." | Assigned demo lead required |
| 8:30 | Service desk | Refund/cancel/downgrade/complaint/invoice request | "Before automatic subscription switching is connected, lifecycle requests are captured and visible to the owner." | Service request queue |
| 10:00 | Owner queue again | `service_request_status=pending` | "This is how we reduce churn and payment disputes while billing automation is being approved." | Pending service request visible |
| 11:00 | Investor readiness gate | `PASS_WITH_DISCLOSED_BLOCKERS` report | "The public/code checks pass. The disclosed blockers are demo data and payment approval, not the core workflow." | 11 pass, 0 repair |

## Exact URLs To Keep Ready

| Purpose | URL |
|---|---|
| Homepage | `https://jus-tice.co.il/` |
| Lawyer plans | `https://jus-tice.co.il/lawyer-plans/` |
| Lead Partner checkout fallback | `https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&utm_source=lawyer_plans&utm_medium=plan_page&utm_campaign=lawyer_acquisition&utm_content=pricing_card_lead_partner&outreach_segment=plans_page` |
| Registration with demo context | `https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&billing_first_name=Investor&billing_last_name=Demo&billing_phone=0501234567&billing_email=investor-demo@example.com&billing_legal_name=Demo+Medical+Law+Ltd&billing_business_id=123456789&billing_invoice_email=billing-demo@example.com&billing_invoice_address=Tel+Aviv` |
| Lawyer dashboard | `https://jus-tice.co.il/lawyer-dashboard/` |
| Policy/terms proof | `https://jus-tice.co.il/sample-terms-and-conditions-template/` |
| Cancellation policy proof | `https://jus-tice.co.il/cancellation/` |
| Privacy proof | `https://jus-tice.co.il/privacy/` |

## What To Say If A Screen Is Not Ready

| If investor asks | Say this |
|---|---|
| "Can I see a real payment?" | "We will not fake a payment. Grow/Meshulam approval is the external gate. The system already captures paid intent, billing details and payment-link readiness; after approval, this maps to recurring products." |
| "Can the lawyer cancel automatically?" | "Automatic cancellation depends on the subscription gateway. Today the deployed service desk captures cancel/refund/downgrade requests and routes them to the owner queue." |
| "Where is the invoice with logo?" | "The compliance pages and payment-link flow are ready; automatic branded invoices require approved Grow/Morning setup and one controlled transaction." |
| "Is the lawyer profile public?" | "Profiles are protected until approved. For the demo we can show a safe claimed profile and then publish only with owner approval." |
| "What proves this makes money?" | "The money proof is the route from lawyer acquisition to plan intent, billing data, payment queue, private area retention and lead ROI reporting." |

## The Three Claims We Can Safely Make

1. The lawyer acquisition funnel is live: homepage/header, plans, checkout fallback and registration all route paid intent.
2. The owner revenue operations layer exists: billing readiness, manual invoice/payment link queue, source tracking and service request queue.
3. The lawyer retention layer exists: private area, lead CRM, profile/content/service requests and lifecycle support requests.

## The Three Claims We Must Not Make Yet

1. "Recurring billing is fully automatic."
2. "Invoices and refunds are automatically executed."
3. "The demo lawyer/lead is real production customer evidence" unless the owner intentionally uses real customer data.

## Best Closing Line

"The hard part is not another legal website. The hard part is connecting SEO demand, lawyer subscriptions, lead ROI and retention into one operating system. That operating system is now visible. The remaining payment work is an approval and mapping layer, not a product thesis risk."

