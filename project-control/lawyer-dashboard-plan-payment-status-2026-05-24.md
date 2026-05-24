# Lawyer Dashboard Plan Payment Status - 2026-05-24

## Why this was done

The lawyer private area should not only show profile and lead data. A lawyer who entered a paid/manual-invoice path needs a clear status line showing the selected plan, payment stage, activation stage and next action. This reduces founder support work and makes the paid subscription path feel like a real managed product.

## What changed

- Added a `Plan and payment` card to the logged-in lawyer dashboard when a linked profile exists.
- The card reads existing profile metadata only:
  - `plan_type`
  - `subscription_status`
  - `payment_path`
  - `payment_followup_status`
  - `payment_followup_due_at`
  - `activation_status`
- The card gives a contextual next action:
  - active subscription: request profile update;
  - payment confirmed: request first content asset;
  - invoice sent: review selected plan;
  - invoice/manual path pending: prepare profile material.
- Added responsive CSS for the card.
- Updated the live revenue-funnel checker so the deployed CSS marker is covered.

## Safety

- Frontend display and CSS only.
- Reads existing profile metadata; no database writes.
- No public CMS content, URL, redirect, canonical/noindex, sitemap or taxonomy change.
- No payment, invoice, product, gateway, lawyer record, lead record, CRM, email/SMS, GSC or GA4 setting changed.

## Verification

Pending:

- `php -l page-lawyer-dashboard.php`
- `node --check tools/check-live-lawyer-revenue-funnel.mjs`
- `git diff --check`
- uPress pull after commit/push because this is public theme code.
