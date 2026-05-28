# Lawyer Paid First Value Queue

Date: 2026-05-28
Status: PUSH_READY_DEPLOY_REQUIRED

## Scope

This pass closes the post-payment handoff gap in lawyer onboarding.

After a lawyer has private payment evidence, the owner should immediately see whether first value has been delivered. A paid lawyer without first value is a retention risk, not a completed revenue loop.

## What Changed

- Added `justice_theme_lawyer_onboarding_paid_needs_first_value_meta_query()`.
- Added a count and expected monthly value for paid lawyers whose first value is missing.
- Added the `paid_needs_first_value` admin filter.
- Added the “Paid, first value missing” card in the payment command center.
- Promoted “Deliver first value to paid lawyers” as the next money action when the queue is non-empty.
- Added a row-level warning: “Paid: deliver first value before repeating this source.”
- Updated the payment-proof operator gate to require this first-value queue.

## Verification To Run

- `php -l inc/lawyer-onboarding.php`
- `php -l functions.php`
- `.project-control/scripts/check-payment-proof-operator-readiness.ps1`
- `.project-control/scripts/check-mobile-menu-stability.ps1`
- `.project-control/scripts/check-live-deploy.ps1` after uPress Pull Git.

## Deployment Target

- Theme version: `1.1.76`
- Deployment marker: `2026-05-28-lawyer-paid-first-value-queue-v1`

## Not Published By This Pass

- No public CMS page was changed.
- No lead, lawyer, invoice, payment, WooCommerce order, subscription, webhook, gateway setting, redirect, canonical, noindex, sitemap, or taxonomy was changed.
- No lawyer was marked paid and no first value was recorded by this code.

## Remaining Blockers

- A real paid lawyer still requires invoice/payment evidence and owner/admin execution.
- Grow/Meshulam provider/KYC/payment lifecycle is still not verified.
- The first-value queue shows what must be handled; it does not prove that first value happened.
