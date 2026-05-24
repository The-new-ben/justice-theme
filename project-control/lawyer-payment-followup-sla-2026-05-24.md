# Lawyer Payment Follow-Up SLA - 2026-05-24

## What changed

Added payment follow-up due dates to the manual-invoice lawyer revenue path.

Rules:

- `invoice_requested`: due in 1 day, because the owner should verify and send the invoice quickly.
- `invoice_sent`: due in 2 days, because the owner should chase payment instead of letting the prospect cool off.
- `payment_confirmed`, `payment_blocked`, `payment_cancelled`, or no manual state: due date is cleared.

## Owner-visible behavior

In WP Admin -> Lawyer Onboarding:

- The paid registration command center now prioritizes overdue payment follow-ups before new invoice work.
- New cards show overdue payment follow-ups and payment follow-ups due within 48 hours.
- Overdue and due-soon filters open the matching lawyer registrations.
- Each payment row shows a due/overdue badge when a due date exists.
- The CSV export now includes `payment_followup_due_at` and `payment_followup_urgency`.

## Why it matters

The manual invoice path is the fastest way to collect money before recurring Grow checkout is fully approved. This turns manual payment work into a daily operating queue instead of a passive status list.

## Safety

- Admin-only operational metadata.
- No public page, public profile, lead, payment, invoice, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4, email/SMS, or wp-admin setting was changed.
- No automatic charge, invoice send, or customer message is triggered.

## Verification

- `php -l inc/lawyer-onboarding.php`
- `git diff --check`
