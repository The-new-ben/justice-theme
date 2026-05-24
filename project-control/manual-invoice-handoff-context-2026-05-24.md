# Manual Invoice Handoff Context - 2026-05-24

## What changed

The owner-only manual invoice handoff now carries a compact internal context line next to the copy-ready message.

## Why this matters

The manual invoice path is the active revenue bridge while recurring checkout is blocked. Before this change, the copied handoff message existed, but the owner still had to look across columns for plan value, due date, payment status and activation status. Now the context is attached to the handoff block and CSV export.

## Implementation

- Added an owner-only invoice context helper for manual-invoice lawyer registrations.
- The context includes:
  - selected plan
  - expected monthly value
  - expected annual value
  - payment follow-up status
  - activation status
  - invoice due date and urgency, when available
- The context appears above the copy-ready handoff textarea in Lawyer Onboarding.
- Payment queue CSV exports now include `invoice_handoff_context` before `invoice_handoff_message`.

## Safety

This is owner/admin-only visibility. It does not send messages, send invoices, charge anyone, activate a lawyer, publish a profile, change public content, change products, change gateway settings, change redirects, change canonicals/noindex, change taxonomies, change sitemaps or touch public CMS records.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed.
