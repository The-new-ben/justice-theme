# Lawyer Registration Paid State Gate - 2026-05-24

## Goal
Prevent a paid lawyer arriving from `/lawyer-plans/` or the checkout fallback from accidentally submitting the registration form as the free plan if front-end JavaScript is slow, blocked or not executed.

## What Changed
- `page-lawyer-registration.php` now renders the selected `plan_interest` option server-side with WordPress `selected()` attributes.
- `tools/check-live-lawyer-revenue-funnel.mjs` now includes a live gate for `/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice`.
- The live gate checks that the page keeps:
  - the paid registration form,
  - the selected plan context,
  - `payment_path=manual_invoice`,
  - `data-selected-plan="lead_partner"`,
  - the actual selected `lead_partner` option,
  - the no-automatic-charge wording.

## Verification
- Local PHP syntax check passed for `page-lawyer-registration.php`.
- Local Node syntax check passed for `tools/check-live-lawyer-revenue-funnel.mjs`.
- `git diff --check` passed with only the existing line-ending warnings.
- Committed and pushed: `6bbf7ae Harden paid lawyer registration state`.
- uPress Git pull completed for `wp-content/themes/justice-theme`; uPress log showed `6bbf7ae` as live `HEAD`.
- Live read-only revenue funnel check passed `8/8`, including `registration-paid-manual-form-state`.

## Owner Meaning
The paid registration path is safer for real outreach: a lawyer clicking the Lead Partner/manual-invoice path lands on a form that preserves the paid plan in the HTML itself, not only in JavaScript state.

## Still Blocked
- Automated recurring lawyer payments remain blocked until Grow/Meshulam approval and gateway/product mapping are completed.
- This does not create a lawyer account, product, charge, invoice or public CMS content.

## Safety
Theme code and live read-only verification only. No CMS database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, charge, invoice, lawyer record, lead, CRM, email/SMS, GSC or GA4 setting was changed.
