# Checkout Registration Prefill - 2026-05-24

## Goal
Reduce paid-lawyer signup friction after the Grow-compliance checkout fallback by carrying already-entered contact details into the registration form.

## Research Signal
- Baymard form-field research recommends prefilling fields when users would otherwise retype the same information, because repeated entry increases checkout friction.
- Clio intake guidance emphasizes reducing duplicate data entry and moving intake information into the working pipeline.

## What Changed
- `page-lawyer-registration.php` now accepts safe prefill values from the checkout handoff:
  - `billing_first_name` + `billing_last_name` become `lawyer_full_name` when no explicit full name exists.
  - `billing_phone` becomes the registration `phone` when no explicit phone exists.
  - `billing_email` becomes the registration `email` when no explicit email exists.
  - `firm_name` is preserved when present.
- Existing sanitization is used before rendering values back into the form.
- `tools/check-live-lawyer-revenue-funnel.mjs` now verifies that a paid manual-invoice registration URL renders the selected paid plan and the prefilled name, phone and email.

## Verification
- Local PHP syntax check passed for `page-lawyer-registration.php`.
- Local Node syntax check passed for `tools/check-live-lawyer-revenue-funnel.mjs`.
- `git diff --check` passed with only existing line-ending warnings.
- Committed and pushed: `c9ea012 Prefill registration from checkout details`.
- uPress Git pull completed for `wp-content/themes/justice-theme`; uPress log showed `c9ea012` as live `HEAD`.
- Live read-only revenue funnel check passed `8/8`, including the stricter registration prefill gate.

## Owner Meaning
A lawyer who fills contact details on the checkout fallback does not have to type the same name, phone and email again on the registration form. This makes the paid manual-invoice path feel more serious and lowers abandonment risk.

## Still Blocked
Automated recurring lawyer payments remain blocked until Grow/Meshulam approval and gateway/product mapping are complete.

## Safety
Theme prefill/checker changes and read-only live verification only. No CMS database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, charge, invoice, lawyer record, lead, CRM, email/SMS, GSC or GA4 setting was changed.
