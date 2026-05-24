# Paid Registration Owner Alert - 2026-05-24

## What changed

The owner email for new lawyer registrations now behaves like a revenue alert when the registration is a paid manual-invoice signup.

## Why this matters

The admin queue now has MRR visibility, due dates and exports, but the first owner touch starts from the notification email. A paid lawyer registration should immediately show expected monthly value, the invoice follow-up deadline and the exact next action.

## Implementation

- Paid manual-invoice registrations use a stronger subject line: `Paid lawyer registration needs invoice - X NIS/mo`.
- The email body now starts with:
  - next owner action
  - expected monthly value
  - expected annual value
  - invoice due date
  - invoice queue link
  - Plan Payments setup link
- Non-paid/free registrations keep the regular pending-review subject, but still include the review/setup links for owner context.

## Safety

This only changes future owner notification text. It does not email the lawyer, send an invoice, charge anyone, activate a profile, publish content, change products, change gateway settings, change redirects, change canonicals/noindex, change taxonomies, change sitemaps or touch public CMS records.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed.
