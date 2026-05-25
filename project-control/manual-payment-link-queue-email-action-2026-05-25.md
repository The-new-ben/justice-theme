# Manual Payment Link Queue Email Action - 2026-05-25

## Why this was done
- A real Grow/Morning payment link is only useful for the investor demo if it can be sent to the lawyer/customer without hunting through the edit screen.
- The existing system could email a saved manual payment link from the profile edit box, but the Lawyer Onboarding queue only displayed the link.

## What changed
- Added a nonce-protected owner action for sending the saved manual payment link email from Lawyer Onboarding.
- Added a `Send payment link email` / `Resend payment link email` button beside saved payment links in the payment-follow-up column.
- Added a browser confirmation prompt before sending.
- The action reuses the existing email function, recipient selection, internal notes and status meta:
  - billing invoice email first,
  - lawyer email second,
  - `manual_payment_link_sent_at`,
  - `manual_payment_link_sent_to`,
  - `manual_payment_link_email_last_result`,
  - payment follow-up moves to `invoice_sent` after successful send unless already paid/cancelled.
- Added an admin notice showing the result after the send attempt.

## Files changed
- `inc/lawyer-onboarding.php`

## Verification
- `php -l inc/lawyer-onboarding.php`

## Safety
- No email was sent during this repo change.
- The live action is owner/admin-only, requires edit permission and a nonce, and asks for confirmation before sending.
- No payment link, invoice, refund, recurring billing, provider setting, public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting was changed.
