# Commercial Pipeline Live Test Matrix - 2026-05-18

Status: LAUNCH GATE / REPO ONLY / NO LIVE PAYMENT CHANGES

## Purpose

Define the exact tests required before the commercial lawyer pipeline can be deployed and activated on the live site.

This protects the business from the most expensive failure mode: a lawyer pays, but the profile, dashboard, lead routing, invoice and owner review state do not line up.

## Research Basis

Sources checked this cycle:
- WooCommerce Subscriptions staging/migration guidance: `https://woocommerce.com/document/subscriptions-handles-staging-sites/`
- WooCommerce Subscriptions health-check announcement: `https://developer.woocommerce.com/2026/04/30/subscriptions-health-check/`
- Current recurring billing launch guidance: use a payment processor, subscription engine, tax/invoice layer and customer self-service portal, then test the full path before production.

Applied conclusion:
- Do not treat plugin installation as launch.
- Launch only after proving subscription creation, renewal/cancellation state, invoice creation, profile linkage, dashboard access, and lead-routing gates.
- Test the happy path and the failure/safety-net path.

## Current Live State

Checked this cycle:
- `node tools/check-live-journeys.mjs` passed homepage lead path, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap and robots.
- `https://jus-tice.co.il/lawyer-plans/` returns HTTP 200.
- Live `/lawyer-plans/` does not yet expose the approved NIS 349 pricing and does not expose checkout/add-to-cart links.

Meaning:
- The commercial branch is not live yet.
- The current live site remains in safe registration-first mode.

## Branch State

Branch checked:
- `origin/claude/review-legal-portal-aRAzz`

Latest fetched commit:
- `49c25df` - `Codex runbook: live execution of the commercial pipeline`

Known remaining integration issue:
- Branch still conflicts with current `main` in `project-control/current-status.md`.

Deploy gate:
- Do not uPress-pull this branch until it is rebased/merged cleanly onto current `main` and lint/test checks pass again.

## Required Pre-Launch Setup

1. Backup live site and database.
2. Confirm branch is merged into `main`, not only a side branch.
3. Pull cleanly in uPress Git Manager.
4. Install/activate:
   - WooCommerce;
   - WooCommerce Subscriptions;
   - Meshulam/Grow payment gateway;
   - Morning/Green Invoice WooCommerce integration.
5. Configure Meshulam/Grow API credentials and recurring billing mode.
6. Configure Morning/Green Invoice auto-invoice hooks.
7. Create four subscription products:
   - Pro: NIS 349/month;
   - Featured: NIS 749/month;
   - Lead Partner: NIS 1,490/month;
   - Full Service: NIS 2,490/month.
8. Map product IDs in Settings -> Lawyer Plans.
9. Clear page/cache/Autoptimize if needed.

## Test Matrix

### A. Public Plan Page

Test:
- Open `/lawyer-plans/` logged out.

Expected:
- Pricing appears correctly.
- Lead caps appear correctly.
- Disclosure appears: no legal outcome guarantee, subscription-only/capped leads, sponsored placement disclosure where relevant.
- Paid CTA sends logged-out user to `/lawyer-registration/?plan_interest={plan}&pre_checkout=1`, not direct checkout.

Pass condition:
- Logged-out paid CTA is registration-first.

### B. Registration To Account

Test:
- Submit one test lawyer registration with a controlled email.

Expected:
- Draft `justice_lawyer` profile is created.
- WordPress user is created with the minimal lawyer role.
- `claimed_by_user_id` links profile and user.
- Magic-link email arrives.
- Owner receives registration/admin notification.

Pass condition:
- Owner can see the draft lawyer profile and linked WP user.

### C. Magic Link

Test:
- Click magic link from email.

Expected:
- User is authenticated.
- Redirect lands on `/lawyer-dashboard/?welcome=1`.
- Dashboard shows linked profile and first-value panel.
- Reusing the same magic link fails safely.

Pass condition:
- One-shot login works once, then expires.

### D. Magic Link Resend Throttle

Test:
- Submit the same lawyer email repeatedly from logged-out dashboard.

Expected:
- Public response remains generic.
- Emails are throttled.
- Existing valid magic link is not repeatedly burned by external spam attempts.

Pass condition:
- Throttle behavior is visible in mail logs or by counting received emails.

### E. Upgrade To Paid Plan

Test:
- From logged-in dashboard, click upgrade/plan CTA.

Expected:
- User reaches WooCommerce checkout for the mapped product.
- Cart contains only the selected subscription product.
- Meshulam/Grow payment form appears.

Pass condition:
- Correct plan/product mapping.

### F. Successful Payment

Test:
- Complete a controlled NIS 1 test subscription product first; then repeat with one real product when ready.

Expected:
- WooCommerce order succeeds.
- Subscription is created and active/pending according to gateway state.
- Linked lawyer profile receives:
  - `subscription_status`;
  - `subscription_id`;
  - `plan_type`;
  - `first_value_at`;
  - `activation_status=first_value`.
- Morning/Green Invoice sends a tax invoice.

Pass condition:
- Payment, subscription, lawyer profile, dashboard and invoice all agree.

### G. Lead Routing Gate

Test:
- Verify each plan after payment.

Expected:
- Free and Pro do not accidentally enable high-tier lead routing.
- Lead Partner and Full Service enable routing only after subscription is active.
- Cancelled/expired subscription disables new lead routing.

Pass condition:
- Routing state follows plan/subscription state.

### H. Safety-Net Path

Test:
- Simulate a WooCommerce paying user with no linked lawyer profile.

Expected:
- Draft `justice_lawyer` profile is auto-created from WooCommerce customer data.
- It is linked to the user.
- It remains draft/pending.
- Owner is emailed a review link.
- Lead routing remains off until plan/status rules allow it.

Pass condition:
- No orphan payment exists.

### I. Cancellation / Failed Payment

Test:
- Cancel one test subscription and simulate failed/expired/on-hold status.

Expected:
- `subscription_status` mirrors the WooCommerce state.
- Lead routing turns off for cancelled/expired subscriptions.
- Dashboard does not claim the subscription is active.

Pass condition:
- Revenue state and service eligibility stay aligned.

## Hard Stop Conditions

Do not launch if any of these are true:
- Branch is not merged into current `main`.
- uPress Git status is dirty.
- Paid logged-out CTA reaches checkout before profile creation.
- Successful payment does not update linked lawyer profile.
- Invoice is not issued.
- Lead routing turns on before owner review or active subscription where required.
- Magic-link resend can spam a lawyer email.
- Plan/product mapping points to wrong WooCommerce products.

## Safety Statement

This matrix is repo-only. It does not install plugins, create WooCommerce products, create users, create lawyer profiles, submit test registrations, charge cards, change payment settings, change public CMS content, alter URLs/redirects/canonicals/noindex, change sitemap settings, change GA4/GSC settings or trigger uPress deployment.
