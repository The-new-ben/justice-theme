# Grow Checkout Routing Repair - 2026-05-24

## Why this was done

Grow's latest site-check report for `https://jus-tice.co.il` passed the general policy, address, phone, cancellation, privacy, service supply and product responsibility checks, but still failed the checkout-specific items:

- Existing checkout page
- Terms approval checkbox on the payment page
- Terms link inside the payment-page approval text

The live `/checkout/` fallback already exposes the required personal-detail fields and terms checkbox, but paid lawyer-plan CTAs could still bypass it and go directly to the manual activation/registration path when WooCommerce subscription products are not mapped yet.

## What changed

- Added `justice_theme_plan_pre_checkout_url()` in `inc/lawyer-plans.php`.
- Paid plans without a ready WooCommerce subscription product now route to `/checkout/?plan_interest={plan}&pre_checkout=1&payment_path=manual_invoice`.
- The lawyer-plans founder/system CTAs now use the checkout URL helper instead of direct manual activation.
- The manual activation URL remains available as a secondary/manual path, so the owner can still collect paid-plan interest and invoice manually while Grow approval is pending.
- The live revenue-funnel checker now verifies both:
  - paid plan page links expose `/checkout/` with plan/payment tracking;
  - the checkout fallback exposes Grow-required billing fields, terms checkbox and policy links.

## Safety

- Theme code and repo documentation only.
- No CMS/database write.
- No public page publishing or content migration.
- No redirect, canonical, noindex, sitemap or taxonomy change.
- No payment, invoice, charge, product, gateway, lawyer record, lead record, CRM, email/SMS or GSC/GA4 setting changed.

## Verification

Completed:

- `php -l inc/lawyer-plans.php`
- `php -l page-lawyer-plans.php`
- `node --check tools/check-live-lawyer-revenue-funnel.mjs`
- `git diff --check`
- Pushed commit `7a2435c` to `origin/main`.
- uPress Git pull log showed `Route paid plans through checkout fallback` as the live HEAD.
- Live `/lawyer-plans/` returned HTTP 200 and exposed `/checkout/`, `plan_interest=lead_partner` and `payment_path=manual_invoice`.
- Live `/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice` returned HTTP 200 and exposed the WooCommerce checkout marker, first name, last name, phone, country, email, terms checkbox, terms link, cancellation link and privacy link.
- Grow report confirmation checkbox was checked and the site was submitted for re-check. Grow displayed the success message that re-check was submitted and can take up to one business day.

## Remaining blocker

Grow still needs to complete the re-check and approve the site. Automatic recurring lawyer payments remain blocked until Grow/Meshulam approval and the real subscription product/gateway setup are complete.
