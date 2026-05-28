# Lawyer Retention Review Action

Date: 2026-05-28
Status: LIVE_VERIFIED

## Purpose

Turn a paid lawyer's first value into an owner-controlled retention step. The system should not stop at `first_value`; the owner must confirm satisfaction, renewal/upsell path, churn risk, or the next useful lead/service commitment before scaling paid acquisition.

## What Changed

- Added owner-only retention meta:
  - `first_value_retention_due_at`
  - `first_value_retention_started_at`
  - `first_value_retention_source`
  - `first_value_retention_note`
- The first-value quick action now schedules a retention review due date when one is missing.
- Added a paid first-value retention queue: `paid_needs_retention_review`.
- Added an admin quick action: `Mark retention review started`.
- The retention quick action is blocked unless paid status, private payment proof, first-value status, first-value timestamp, and first-value proof are all present.
- Updated deployment marker/version to `2026-05-28-lawyer-retention-review-action-v1` / `1.1.79`.

## Safety

- No public CMS content was changed.
- No redirects, canonicals, noindex rules, sitemaps, taxonomies, menus, payments, invoices, CRM records, users, or live leads were changed.
- No lawyer was marked paid.
- No first-value or retention event was marked.
- No paid LLM/API spend was used.

## Current Blockers

- Grow/Meshulam KYC/payment status and real settlement proof remain blockers.
- A real lawyer payment, invoice/receipt evidence, first-value proof, and owner retention review are still required before claiming revenue quality.

## Local Verification

- `php -l inc/lawyer-onboarding.php`: passed.
- `php -l functions.php`: passed.
- `.project-control/scripts/check-payment-proof-operator-readiness.ps1 -Root .`: passed.
- `.project-control/scripts/check-mobile-menu-stability.ps1 -Root .`: passed.
- PowerShell checker parse gate: passed.
- `git diff --check`: passed.

## Deployment Verification

- Code commit: `632617d1 Add paid lawyer retention review action`.
- Pushed to `origin/codex/live-homepage-conversion-release` and `origin/main`.
- uPress Pull Git completed for `wp-content/themes/justice-theme`.
- uPress Git log showed `632617d1` as `HEAD -> main`.
- Live deploy gate passed:
  - marker: `2026-05-28-lawyer-retention-review-action-v1`.
  - theme version: `1.1.79`.
  - old marker absent: `2026-05-28-lawyer-first-value-evidence-guard-v1`.
- Live revenue readiness gate passed with readiness `ready_for_owner_payment_admin_test`.
- Live route matrix and live link hygiene checks passed.
- Lawyer plan, registration, and dashboard payment-proof route checks passed.
- Live mobile menu browser QA passed.
- Visual evidence: `output/playwright/live-mobile-menu-open-1779937802.png`.

## Honesty Statement

This release improves the owner/admin control layer after a paid lawyer receives first value. It does not prove real revenue, payment settlement, invoice issuance, CRM routing, lawyer handoff, first-value delivery, or retention success. The next business proof still requires the owner/admin to complete a real payment, save private payment evidence, save first-value proof, and start a real retention/renewal review.
