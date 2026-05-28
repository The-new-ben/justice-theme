# Lawyer Retention Outcome Action

Date: 2026-05-28
Status: LIVE_VERIFIED

## Purpose

Make the paid-lawyer retention loop measurable. Starting a retention review is not enough; the owner should record whether the lawyer is retained, needs follow-up, or is at churn risk before calling the acquisition source repeatable.

## What Changed

- Added owner-only retention outcome meta:
  - `first_value_retention_outcome_status`
  - `first_value_retention_outcome_at`
  - `first_value_retention_outcome_source`
  - `first_value_retention_next_step_due_at`
- Added retention outcome options:
  - retained / renewal path confirmed
  - needs follow-up
  - churn risk / save needed
- Added a paid retention outcome queue: `paid_needs_retention_outcome`.
- Added admin quick actions:
  - `Mark retained`
  - `Needs follow-up`
  - `Churn risk`
- The quick action is blocked unless paid status, private payment proof, retention-review status, retention-review start time, and first-value proof are all present.
- Tightened the paid first-value queue so lawyers already in retention review, retained, or at-risk status are not incorrectly counted as missing first value.
- Updated deployment marker/version to `2026-05-28-lawyer-retention-outcome-action-v1` / `1.1.80`.

## Safety

- No public CMS content was changed.
- No redirects, canonicals, noindex rules, sitemaps, taxonomies, menus, payments, invoices, CRM records, users, or live leads were changed.
- No lawyer was marked paid, retained, followed-up, or at risk.
- No paid LLM/API spend was used.

## Current Blockers

- Grow/Meshulam KYC/payment status and real settlement proof remain blockers.
- A real lawyer payment, invoice/receipt evidence, first-value proof, and owner retention outcome are still required before claiming revenue quality.

## Local Verification

- `php -l inc/lawyer-onboarding.php`: passed.
- `php -l functions.php`: passed.
- `.project-control/scripts/check-payment-proof-operator-readiness.ps1 -Root .`: passed.
- `.project-control/scripts/check-mobile-menu-stability.ps1 -Root .`: passed.
- PowerShell checker parse gate: passed.
- `git diff --check`: passed.

## Deployment Verification

- Code commit: `770e8535 Add paid lawyer retention outcome action`.
- Pushed to `origin/codex/live-homepage-conversion-release` and `origin/main`.
- uPress Pull Git completed for `wp-content/themes/justice-theme`.
- uPress Git log showed `770e8535` as `HEAD -> main`.
- Live deploy gate passed:
  - marker: `2026-05-28-lawyer-retention-outcome-action-v1`.
  - theme version: `1.1.80`.
  - old marker absent: `2026-05-28-lawyer-retention-review-action-v1`.
- Live revenue readiness gate passed with readiness `ready_for_owner_payment_admin_test`.
- Live route matrix and live link hygiene checks passed.
- Lawyer plan, registration, and dashboard payment-proof route checks passed.
- Live mobile menu browser QA passed.
- Visual evidence: `output/playwright/live-mobile-menu-open-1779938960.png`.

## Honesty Statement

This release improves the owner/admin retention quality layer after a paid lawyer reaches first value and starts retention review. It does not prove real revenue, payment settlement, invoice issuance, CRM routing, lawyer handoff, first-value delivery, retention success, renewal, or reduced churn. The next business proof still requires the owner/admin to complete a real payment, save private payment evidence, save first-value proof, start a real retention review, and record a real retained/follow-up/churn-risk outcome.
