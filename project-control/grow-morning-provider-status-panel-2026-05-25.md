# Grow/Morning Provider Status Panel - 2026-05-25

## Why this was done
- Grow/Morning replied that the Jus-Tice site is approved for clearing and asked whether the request is for standing orders through Morning.
- The investor demo needs a clear distinction between what is real now and what is still provider-gated.

## What changed
- Added an admin-only Grow/Morning provider status panel inside Lawyer Onboarding's investor demo control block.
- Added a route matrix for:
  - one-time payment links,
  - recurring / standing-order billing,
  - WooCommerce checkout,
  - Morning API payment form.
- Added a copyable Hebrew reply template for Grow support that confirms the request is for Morning/Grow recurring lawyer subscriptions and asks what must be enabled for account `10182706`.

## Current honest payment status
- Real one-time payment can be demonstrated only when a real Morning/Grow payment link is created and pasted into the lawyer profile.
- Recurring billing / standing order is not proven live yet. It remains blocked until Grow/Morning enables the capability and a controlled paid smoke test passes.
- WooCommerce or API integration are valid future routes, but they are not the fastest no-API investor demo path.

## Research basis
- Official Morning API docs describe production/sandbox environments, OAuth and API setup.
- Green Invoice/Morning payment docs describe the payment-form path and the condition that payment-form access depends on supported clearing plugins such as Digital Payments by Grow.
- WordPress.org lists a Morning add-on for WooCommerce as a possible WordPress/Woo route.

## Files changed
- `inc/lawyer-onboarding.php`

## Verification
- `php -l inc/lawyer-onboarding.php`

## Safety
- No email was sent.
- No payment link, invoice, refund, recurring billing, WooCommerce plugin or provider setting was created or changed.
- No public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.
