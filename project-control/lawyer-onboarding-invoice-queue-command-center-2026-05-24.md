# Lawyer Onboarding Invoice Queue Command Center - 2026-05-24

## Goal

Make paid lawyer registrations impossible to miss in the owner admin flow.

The public registration path now marks paid-plan submissions as `invoice_requested` when automatic checkout is not ready. This cycle adds the matching back-office command center so the owner can see and act on those requests quickly.

## Change

- Added a paid registration command center to `Lawyer Onboarding`.
- Added live counts for:
  - invoice requested,
  - manual invoice path,
  - profile ready,
  - first value reached.
- Added a direct `Open invoice queue` filter for registrations with `payment_followup_status=invoice_requested`.
- Kept the action language practical: verify lawyer/plan, send Morning/Grow/manual payment instructions, activate only after payment confirmation.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.

## Safety

Admin/theme code and documentation only.

No public CMS/database record, payment setting, WooCommerce product, Grow/Meshulam setting, redirect, canonical, noindex, sitemap, taxonomy, lead, lawyer record, or outreach action was changed.
