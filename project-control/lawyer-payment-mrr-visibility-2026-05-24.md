# Lawyer Payment MRR Visibility - 2026-05-24

## What changed

The owner-only Lawyer Onboarding payment command center now shows estimated monthly revenue value, not only queue counts.

## Why this matters

The manual invoice path is currently the fastest bridge to revenue while Grow/Morning recurring checkout remains incomplete. A queue with only counts treats a Pro registration and a Full Service registration the same. This change lets the owner prioritize overdue, requested, and sent invoice follow-ups by expected monthly money.

## Implementation

- Aligned internal expected monthly values with the public lawyer plan prices:
  - Pro: 349 NIS/mo
  - Featured: 749 NIS/mo
  - Lead Partner: 1,490 NIS/mo
  - Full Service: 2,490 NIS/mo
- Added monthly value totals to the payment command center cards:
  - invoice requested potential
  - overdue payment value at risk
  - due-within-48h scheduled value
  - sent invoice pending value
  - confirmed payment value
  - total manual invoice path value
- Added the active next-money queue value to the command center action box.
- Added per-lawyer expected monthly value to the onboarding table plan column.
- Added `expected_monthly_nis` and `expected_annual_nis` columns to payment queue CSV exports.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed.

## Safety

This is admin/owner visibility only. It does not charge anyone, send invoices, send emails/SMS, activate a lawyer, publish a profile, change public content, change redirects, change canonicals/noindex, change taxonomies, change sitemaps, or touch the public CMS database.

## Remaining blocker

Automatic recurring lawyer checkout still depends on completing Grow/Morning approval and payment product mapping. Until then, the manual invoice path remains the operational revenue bridge.
