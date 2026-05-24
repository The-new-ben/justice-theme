# Lawyer Payment Follow-Up Statuses - 2026-05-24

## Goal

Turn manual invoice handling from a vague owner memory task into a tracked revenue workflow.

The previous cycle made paid registrations visible in the admin invoice queue. This cycle adds status movement after that first queue item appears.

## Change

- Added owner-only payment follow-up states:
  - invoice requested,
  - invoice sent,
  - payment confirmed,
  - payment blocked,
  - payment cancelled.
- Added a payment follow-up status selector to the lawyer activation meta box.
- Updated payment badges and notes so the owner sees the right next action.
- Expanded the paid registration command center with counts for invoice sent and payment confirmed.
- Added filters for invoice sent, confirmed, blocked and cancelled payment states.

## Why It Matters

A lawyer signup can now move through the practical first-money path:

1. Paid plan registration.
2. Invoice requested.
3. Invoice sent.
4. Payment confirmed.
5. Profile activation / first value.

This is enough to operate manually until Grow/Meshulam recurring payments are fully approved and mapped.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.

## Safety

Admin/theme code and documentation only.

No public CMS/database row, public content, payment processor setting, WooCommerce product, Grow/Meshulam setting, redirect, canonical, noindex, sitemap, taxonomy, lead, lawyer record, or outreach action was changed.
