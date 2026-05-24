# Grow Approval Handoff - 2026-05-24

## Why this was done

The site has been resubmitted to Grow after the checkout route repair, and the live payment-compliance monitor now passes 8/8 checks. The remaining risk is operational: once Grow approves, the owner needs a clear next step inside WordPress admin instead of switching between chat notes, reports and payment setup screens.

## What changed

- Added a `Grow Approval Handoff` card to the owner-only `Lawyer Plan Payments` admin page.
- The card reminds the owner that recurring charges stay off until Grow approval, gateway connection and product mapping are all verified.
- The card gives the exact rerun command for the no-API compliance checker: `node tools/check-grow-payment-compliance.mjs`.
- The card links directly to the public checkout, terms, cancellation and privacy pages used in the Grow review.

## Safety

- Admin-only UI copy and links.
- No CMS/database write.
- No public content, URL, redirect, canonical/noindex, sitemap or taxonomy change.
- No payment, invoice, charge, product, gateway, lawyer record, lead record, CRM, email/SMS or analytics setting changed.

## Verification

Completed:

- `php -l inc/lawyer-plans.php`
- `git diff --check`
- Commit `32378a6` pushed to `origin/main`.
- uPress Git pull log showed `Add Grow approval handoff card` as the live HEAD.

## Remaining blocker

Automatic recurring lawyer payments remain blocked until Grow/Meshulam approval is returned and the real WooCommerce subscription products/gateway setup are configured and smoke-tested.
