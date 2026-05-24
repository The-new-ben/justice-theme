# Lawyer Manual Invoice Handoff - 2026-05-24

## Goal

Reduce friction between a paid lawyer registration and the owner's manual invoice follow-up.

## Change

- Manual-invoice lawyer registrations now show a copy-ready handoff message inside the owner-only Lawyer Onboarding admin queue.
- The message confirms no automatic charge happened, asks for the practical activation details, and points to the lawyer dashboard after activation.
- The handoff appears only for `payment_path=manual_invoice` and is hidden once payment is confirmed or cancelled.

## Safety

- Admin UI only.
- No email/SMS is sent automatically.
- No payment, invoice, profile activation, CMS record, redirect, canonical, noindex, sitemap, taxonomy, lead, CRM, GSC/GA4 or wp-admin setting changed.

## Verification

- `php -l inc/lawyer-onboarding.php`
- `git diff --check`
- After deployment, owner can open WP Admin -> Lawyer Onboarding and expand `Copy invoice handoff` for manual-invoice rows.
