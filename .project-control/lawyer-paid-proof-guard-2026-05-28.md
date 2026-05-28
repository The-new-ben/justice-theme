# Lawyer Paid Proof Guard

Date: 2026-05-28
Status: PUSH_READY_DEPLOY_REQUIRED

## Scope

This pass closes a revenue-proof gap in lawyer onboarding.

The public lawyer funnel already explains the manual invoice to payment-proof path. The admin onboarding screen now follows the same rule: a lawyer cannot be treated as paid unless a private payment evidence URL is saved.

## What Changed

- Added `manual_payment_evidence_url` as an owner/admin-only lawyer meta field.
- Added `justice_theme_lawyer_has_manual_payment_evidence()` as the reusable guard.
- Blocked `payment_confirmed` when no private payment evidence exists.
- Redirects quick actions back to the final guarded payment queue, not the attempted status.
- Hid the `Mark paid` quick action until payment evidence exists.
- Excluded no-proof records from paid profile count and confirmed monthly value.
- Added payment evidence to invoice queue CSV exports.
- Added admin warnings for invoice-sent and legacy paid records without evidence.

## Verification

Local verification passed:

- `php -l inc/lawyer-onboarding.php`
- `php -l functions.php`
- `.project-control/scripts/check-payment-proof-operator-readiness.ps1`
- `.project-control/scripts/check-mobile-menu-stability.ps1`

The payment-proof operator gate now requires the lawyer onboarding paid-evidence guard.

## Deployment Target

- Theme version: `1.1.74`
- Deployment marker: `2026-05-28-lawyer-paid-proof-guard-v1`

## Not Published By This Report

- No WordPress public CMS content changed.
- No live payment was created.
- No invoice was issued.
- No WooCommerce product, order, subscription, webhook, gateway setting, redirect, canonical, noindex, sitemap, or taxonomy changed.
- No lead or lawyer was marked paid.

## Remaining Blockers

- Grow/Meshulam KYC and/or provider readiness still block a verified online payment lifecycle.
- The owner/admin still needs to create or save real private payment evidence before any lawyer can be counted as paid.
- This guard does not prove revenue; it prevents premature revenue claims.
