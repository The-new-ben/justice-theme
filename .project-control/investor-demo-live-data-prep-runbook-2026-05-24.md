# Investor Demo Live Data Prep Runbook - 2026-05-24

## Honesty Statement

This runbook prepares the two remaining demo-data items from the investor readiness gate without pretending the payment stack is finished. It does not approve public CMS/database writes by itself. Creating or changing a live lawyer profile, user account, lead record, payment status or payment link still needs owner approval in the live admin session.

## Current Best-Practice Basis

- WooCommerce Subscriptions customer switching is normally done from My Account > Subscriptions > View, then Upgrade/Downgrade, then checkout. Source: https://woocommerce.com/document/subscriptions/customers-view/subscribers-view-switch/
- WooCommerce says switching requires settings/product eligibility, active subscription status, at least one completed payment, and gateway support for recurring amount/date changes. Source: https://woocommerce.com/document/subscriptions/switching-guide/
- WooCommerce cancellation/suspension behavior depends on subscription status/settings and gateway support. Source: https://woocommerce.com/document/subscriptions/customers-view/suspend-cancel-or-remove-an-item/

Owner meaning for Jus-Tice: until Grow/Meshulam approval and WooCommerce subscription products are mapped, upgrade, downgrade, cancel, refund and invoice-copy scenarios should be demoed through the deployed lawyer service desk, not through fake automatic billing.

## Remaining Demo Data

| Item | Why it matters | Minimum safe demo proof | Owner-approved action |
|---|---|---|---|
| Claimed demo lawyer profile | Needed so `/lawyer-dashboard/` shows the real private area instead of the logged-out gate | A logged-in user linked to one `justice_lawyer` profile through `claimed_by_user_id` | Create or choose a demo lawyer and link it to the demo user |
| Assigned medical-malpractice lead | Needed so the investor sees the CRM pipeline, contact buttons and lead follow-up stages | One lead assigned to the demo lawyer, with medical-malpractice context and no real private client data | Use existing safe demo lead or create a controlled demo lead |

## Recommended Demo Persona

| Field | Demo value |
|---|---|
| Lawyer name | Dr. Demo Medical Malpractice Law |
| Practice | רשלנות רפואית |
| City | תל אביב |
| Plan | Lead Partner |
| Payment path | Manual invoice/payment-link fallback |
| Billing legal name | Demo Medical Law Ltd |
| Billing email | billing-demo@example.com |
| Phone | 0501234567 |
| Demo lead topic | Suspicion of surgical negligence after hospital treatment |

## Owner/Admin Preparation Steps

1. Open WordPress admin while logged in as owner.
2. Create or select a safe demo WordPress user for the lawyer.
3. Create or select one `justice_lawyer` profile for the demo lawyer.
4. Set `claimed_by_user_id` on the lawyer profile to the demo user ID.
5. Set lawyer plan/status fields to show the commercial story:
   - plan interest: `lead_partner`
   - payment path: `manual_invoice`
   - payment status: `invoice_sent` or `payment_confirmed`, depending on how honest you want the demo step to be
   - manual payment link: use only a real owner-approved Grow/Morning link, or leave blank and explain the payment-link queue
6. Open `/lawyer-dashboard/` as the demo lawyer and confirm the private dashboard appears.
7. Submit one service request from the dashboard:
   - request type: refund, cancellation, downgrade, complaint or invoice copy
   - urgency: today
   - subject: Investor demo service request
8. Return to Lawyer Onboarding as owner.
9. Open the service request queue with `service_request_status=pending`.
10. Confirm the request appears, and explain this is the retention/support layer until subscription self-service is connected.
11. Assign or create one safe demo lead with medical-malpractice context.
12. Open the lawyer dashboard again and show:
   - lead card
   - call/WhatsApp/email buttons
   - stage update from new/contacted/consultation/won/lost

## What To Say If Asked About Real Payment

Use this exact framing:

"The acquisition, registration, private area, owner onboarding queue, lead CRM and support lifecycle are already working. We are not going to fake automatic billing. Grow/Meshulam approval is the remaining external gate. Until it is approved, we use a compliant manual invoice/payment-link path; after approval, the same plan states map into WooCommerce/Grow recurring products."

## Do Not Do Before The Investor Without Owner Approval

- Do not create a real charge just to impress the investor.
- Do not mark a real unpaid lawyer as paid.
- Do not publish a demo lawyer publicly unless the owner approves it.
- Do not create a lead using a real person's medical facts.
- Do not claim automatic invoices, refunds or recurring billing are live.
- Do not change redirects, canonicals, noindex, sitemap or taxonomy settings.

## Fast Rehearsal Checklist

| Step | Pass condition | Status |
|---|---|---|
| Homepage > lawyer path | Header/homepage link to lawyer plans and private area | Ready |
| Plans > checkout | Lead Partner routes to manual invoice checkout | Ready |
| Checkout > registration | Billing fields carry into registration | Ready |
| Owner queue | Payment, billing and payment-link readiness are visible | Ready |
| Demo lawyer dashboard | Claimed profile opens real private dashboard | Needs owner-approved demo data |
| Service request | Refund/cancel/complaint request appears in owner queue | Needs one controlled submission |
| Demo lead CRM | Assigned lead appears and stage update works | Needs owner-approved demo data |
| Payment answer | Manual payment-link fallback is shown; recurring automation is disclosed as approval-gated | Ready |

