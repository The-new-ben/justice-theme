# Lawyer Sponsored Placement Payment Separation - 2026-05-25

## What Changed
- Added `sponsored_placement_status` as a CMS-controlled placement state separate from `subscription_status`.
- Added owner controls on the lawyer edit screen:
  - Sponsored/top placement status.
  - Priority score.
- Updated lawyer bulk actions:
  - "reserve sponsored/top slot" now reserves placement without marking payment active.
  - Added "clear sponsored/top slot".
  - Fact-hold action also holds sponsored placement.
- Updated lawyer card and homepage/directory scoring to use the same shared sort logic.

## Why This Matters
The owner asked for sponsored lawyers, homepage/internal-page floating, batch hide/reveal, and a smart CMS-driven system. A previous bulk action could accidentally make a profile look like it had an active paid subscription by setting `subscription_status=active`. That is not acceptable for a real investor/payment demo.

This change separates:
- Real money state: `subscription_status`, `plan_type`, payment/invoice/Grow proof.
- Placement/sales state: `sponsored_placement_status`, `priority_score`.

## Public Behavior
- Real active paid plans still rank highest and may show a sponsored badge.
- `sponsored_placement_status=active` can show a sponsored badge when the owner explicitly confirms the placement.
- `sponsored_placement_status=reserved` can raise ordering for sales/demo review, but it does not claim payment.
- Fact-gated profiles still do not expose premium facts/photos/reviews until source/owner/lawyer approval is real.

## Revenue Impact
- Improves the sponsored-placement sales workflow and investor demo honesty.
- Makes it possible to prepare premium inventory without pretending money arrived.
- Realized revenue remains NIS 0 until Grow/Morning payment, invoice, subscription, lead delivery and CRM follow-up are completed.

## Verification
- `php -l inc/template-tags.php` passed.
- `php -l inc/lawyer-visibility.php` passed.
- `php -l template-parts/cards/lawyer-card.php` passed.
- `php -l template-parts/sections/featured-lawyers.php` passed.

## Safety
- Repo code/docs only.
- No live CMS database edit.
- No imported lawyer data.
- No competitor photos, reviews, ratings, contact details or profile text copied.
- No payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.
