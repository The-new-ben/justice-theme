# Lawyer Payment Timeline Audit Trail - 2026-05-24

## Goal

Make the manual lawyer payment path operational while Grow recurring billing is still pending. The owner needs to know which paid registrations already received an invoice, which ones paid, and which ones are blocked or cancelled.

## Change

- Added owner-only timestamp fields for manual payment milestones:
  - `invoice_sent_at`
  - `payment_confirmed_at`
  - `payment_blocked_at`
  - `payment_cancelled_at`
- When the owner changes the payment follow-up status on a lawyer profile, the first timestamp for that milestone is saved automatically.
- The timestamp is shown in the lawyer activation box and in the Lawyer Onboarding command-center table.
- Each payment follow-up change also appends an internal note.

## Safety

- No public page output changed.
- No payment gateway call was added.
- No public CMS content, redirects, canonicals, noindex settings, sitemap settings, or taxonomies changed.
- The change only stores and displays owner/admin workflow metadata.

## Verification

- PHP syntax check passed for `inc/lawyer-onboarding.php`.
- The code path is limited to the `justice_lawyer` admin save hook and the owner-only onboarding dashboard.

