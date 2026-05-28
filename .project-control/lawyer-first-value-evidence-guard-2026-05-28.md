# Lawyer First Value Evidence Guard

Date: 2026-05-28
Status: LOCAL_VERIFIED_DEPLOY_REQUIRED

## Purpose

Prevent the owner/admin from closing the paid first-value queue with a status-only click. A paid lawyer now needs private payment evidence plus first-value proof before the quick action can mark `activation_status=first_value`.

## What Changed

- Added owner-only fields on lawyer profiles:
  - `first_value_evidence_url`
  - `first_value_outcome_note`
- Added a helper gate: `justice_theme_lawyer_has_first_value_evidence`.
- Blocked the `Mark first value delivered` quick action unless an outcome note or private proof URL exists.
- Added a visible admin queue warning when a paid lawyer is still missing first-value proof.
- Updated deployment marker/version to `2026-05-28-lawyer-first-value-evidence-guard-v1` / `1.1.78`.

## Safety

- No public CMS content was changed.
- No redirects, canonicals, noindex rules, sitemaps, taxonomies, menus, payments, invoices, CRM records, users, or live leads were changed.
- No lawyer was marked paid.
- No first-value event was marked.
- No paid LLM/API spend was used.

## Current Blockers

- Grow/Meshulam KYC/payment status and real settlement proof remain blockers.
- A real lawyer payment, invoice/receipt evidence, and owner-verified first-value outcome are still required before claiming revenue.

## Verification To Run

## Local Verification

- `php -l inc/lawyer-onboarding.php`: passed.
- `php -l functions.php`: passed.
- `.project-control/scripts/check-payment-proof-operator-readiness.ps1 -Root .`: passed.
- `.project-control/scripts/check-mobile-menu-stability.ps1 -Root .`: passed.
- PowerShell checker parse gate: passed.
- `git diff --check`: passed.

## Deployment Verification Still Required

- Commit and push the code.
- Pull Git in uPress for `wp-content/themes/justice-theme`.
- Verify live marker/version.
- Run revenue readiness and live mobile menu browser QA.
