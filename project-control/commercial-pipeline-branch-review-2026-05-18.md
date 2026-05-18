# Commercial Pipeline Branch Review - 2026-05-18

Status: REVIEW PACKET / DO NOT DEPLOY BRANCH AS-IS

Reviewed branch: `origin/claude/review-legal-portal-aRAzz`
Reviewed commit: `e07851a`
Current main during review: `74ebf00`

## Purpose

Prevent the commercial pipeline from going live with a broken payment-to-profile/account connection.

The branch is strategically useful: pricing, plan caps, WooCommerce mapping, subscription syncing and magic links are the right direction. But the current implementation can let a lawyer pay before the system has a linked `justice_lawyer` profile, which means the subscription cannot reliably activate the dashboard, lead routing, or owner value reporting.

## Research Basis

Sources checked this cycle:
- WooCommerce Subscriptions action reference: `https://woocommerce.com/document/subscriptions/develop/action-reference/`
- WooCommerce customer-created hook reference: `https://condorito.fr/docs/woocommerce/woocommerce_created_customer.html`
- Lawmatics 2026 legal intake guide: `https://www.lawmatics.com/blog/client-intake-ultimate-guide-for-law-firms`
- Intake.link 2026 law-firm intake guide: `https://www.intake.link/blog/intake/complete-guide-law-firm-client-intake`

Applied conclusion:
- WooCommerce subscription hooks can fire around order/subscription creation before payment is fully activated, so the integration must not depend on redirect luck.
- Legal intake/payment flows should connect intake data, account identity, CRM/profile data and payment state as one controlled journey.
- For Jus-Tice, the safe order is profile/account first, then payment, then subscription state sync, then lead routing/value reporting.

## What Is Good In The Branch

- Transparent monthly pricing is added for Pro, Featured, Lead Partner and Full Service.
- Lead caps are defined per plan.
- A Settings -> Lawyer Plans mapping page is added for WooCommerce product IDs.
- A minimal `justice_lawyer_member` role is introduced.
- Lawyer registration provisions a WordPress user and sends a magic login link.
- The subscription bridge mirrors WooCommerce subscription state to lawyer profile meta.
- The dashboard gets a magic-link resend path and welcome state.
- PHP lint passed on the touched files in the branch worktree.

## Blocker 1 - Paid Checkout Can Bypass Profile Creation

Location:
- `inc/lawyer-plans.php`
- `inc/woocommerce-subscription-bridge.php`

Observed flow:
1. Once product IDs are mapped, `justice_theme_plan_checkout_url()` sends a paid-plan CTA directly to WooCommerce checkout.
2. WooCommerce creates/uses a customer and subscription.
3. The subscription bridge calls `justice_theme_lawyer_profile_for_user()`.
4. If the buyer did not first complete `/lawyer-registration/`, there is no linked `justice_lawyer` profile.
5. The bridge returns without syncing subscription state, plan type, activation, lead routing or first-value status.

Business impact:
- A lawyer can pay but not receive a connected Jus-Tice lawyer profile/dashboard journey.
- Owner cannot see the lawyer as activated in the intended lawyer onboarding flow.
- Lead routing and monthly value reporting can remain disconnected.

Required fix before deploy:
- Either force every paid CTA through `/lawyer-registration/?plan_interest=...` first, then continue to checkout after the profile/user link exists.
- Or add a checkout/customer-created bridge that creates/links a draft `justice_lawyer` profile before subscription syncing.
- Do not publish direct checkout CTAs until one of those paths is implemented and tested.

Recommended safer first fix:
- Keep prices public, but make all plan buttons go to `/lawyer-registration/?plan_interest={plan}`.
- After registration creates the profile and user, show the selected plan and send the lawyer to checkout from the linked dashboard/onboarding confirmation.

## Blocker 2 - Magic Link Resend Needs Throttling

Location:
- `inc/lawyer-account-provisioning.php`
- `page-lawyer-dashboard.php`

Observed flow:
- The logged-out dashboard lets anyone submit an email to request a new magic link.
- The endpoint does not reveal whether the email exists, which is good.
- But a valid lawyer email can be submitted repeatedly, which sends repeated emails and invalidates the previous magic link each time.

Business/security impact:
- Annoying or abusive email spam to lawyers.
- Legitimate magic links can be invalidated repeatedly by someone else.

Required fix before deploy:
- Add per-email and per-IP throttling.
- Suggested minimum: no more than one magic-link email per email every 10 minutes, and no more than five per IP per hour.
- Keep the same public response message to avoid account enumeration.

## Merge Conflict

The branch diverged from `main` before the latest dashboard first-value/uPress cleanup work.

Conflict expected:
- `project-control/current-status.md`

Integration note:
- Preserve both the main dashboard deployment status and the commercial pipeline branch status when rebasing/merging.

## Acceptance Tests Before Live

Required before uPress pull/live activation:
- Paid CTA cannot reach checkout without a linked lawyer profile/user, or checkout auto-creates and links a profile.
- One test paid signup shows the subscription mapped to the correct `justice_lawyer` profile.
- Dashboard login/magic link lands the same lawyer on `/lawyer-dashboard/`.
- `subscription_status`, `plan_type`, `subscription_id`, `activation_status`, and `first_value_at` update on the linked profile.
- Lead routing is not enabled for free/pro by accident.
- Magic-link resend throttling works.
- Public plan copy remains honest: subscription-only, capped leads, no outcome guarantees, sponsored disclosure where relevant.

## Safe Next Action

Ask the commercial branch owner to patch the flow as:
1. Prices can stay public.
2. Paid CTA routes to registration first.
3. Registration provisions/links the lawyer account.
4. The linked dashboard/confirmation provides checkout.
5. Subscription bridge syncs only after it can find the linked profile.
6. Add resend throttling.

Then rerun review and only then deploy via uPress.

## Safety Statement

This review packet is repo-only. It does not change live WordPress content, database rows, lawyer profiles, users, leads, payment settings, WooCommerce products, GA4/GSC settings, URLs, redirects, canonical/noindex rules, sitemap settings or uPress deployment.
