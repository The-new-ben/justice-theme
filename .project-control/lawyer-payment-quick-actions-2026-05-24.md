# Lawyer Payment Quick Actions - 2026-05-24

## Goal

Reduce manual friction in the paid lawyer pipeline. The owner should not need to open every lawyer profile just to move a paid registration from invoice requested to invoice sent, paid, blocked, or cancelled.

## Change

- Added one-click owner-only payment follow-up actions in the Lawyer Onboarding table.
- Supported quick actions:
  - `invoice_requested` to `invoice_sent`
  - `invoice_requested` to `payment_blocked`
  - `invoice_sent` to `payment_confirmed`
  - `invoice_sent` to `payment_blocked`
  - `invoice_sent` to `payment_cancelled`
  - blocked/cancelled reopen paths
- Reused the same timestamp and internal-note logic as the individual lawyer activation box.
- Added a success notice after a quick action and keeps the owner in the filtered payment queue.

## Safety

- Owner/admin only.
- Nonce protected.
- Requires `edit_post` permission for the lawyer profile.
- No public profile output changed.
- No payment gateway call, invoice sending, public CMS content, redirects, canonicals, noindex, sitemaps, or taxonomies changed.

## Verification

- PHP syntax check passed for `inc/lawyer-onboarding.php`.
- Quick action URLs are generated only from validated internal payment statuses.

