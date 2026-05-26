# Lawyer Onboarding Revenue Proof Strip - 2026-05-25

## Why This Was Needed

The owner needs investor-safe revenue language. The system already tracks invoice requests, sent invoices and payment confirmations, but the command center needed a clear proof strip that says whether revenue is actually confirmed or only in the registration/manual-invoice pipeline.

## What Changed

- Added a revenue proof strip at the top of `Lawyer Onboarding -> Paid registration command center`.
- The strip shows:
  - whether any lawyer payment is owner-confirmed;
  - confirmed paid profile count and confirmed monthly plan value;
  - manual-invoice profile count and saved payment-link count;
  - a provider claim boundary that warns not to claim automatic recurring billing, refunds or invoice automation until Grow/Morning/Woo passes a controlled paid smoke test.

## Investor-Safe Use

- If confirmed paid profile count is `0`, say: registration, billing capture, manual invoice handoff and follow-up are live; realized paid revenue is not proven yet.
- If confirmed paid profile count is above `0`, open the paid rows before quoting revenue.
- For the next real payment test, create the Grow/Morning payment link, paste it into the lawyer record, send it from the admin panel, then mark payment confirmed only after the actual payment is visible in the provider/accounting system.

## Honest Limits

- This does not create a payment link.
- This does not send email or WhatsApp.
- This does not mark any lawyer as paid.
- This does not change live CMS records, provider settings, WooCommerce settings, products, subscriptions, invoices or refunds.

## Verification

- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- DEPLOYED: uPress Pull Git completed and the uPress activity log showed live HEAD `bbb32c6`.
- VERIFIED LIVE: wp-admin `Lawyer Onboarding` loaded the `Paid registration command center` with the new proof strip, `Manual payment bridge`, and `Provider claim boundary`.
