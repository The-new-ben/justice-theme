# Lawyer Retention Follow-Up Queue

Date: 2026-05-28
Status: LIVE_VERIFIED

## Purpose

Turn retention outcomes into time-bound owner actions. A paid lawyer can be marked retained, follow-up, or churn risk, but the relationship is not operationally stable until the next owner action is handled when due.

## What Changed

- Added a paid retention follow-up due queue: `paid_retention_followup_due`.
- The queue requires:
  - confirmed payment status,
  - private payment evidence,
  - recorded retention outcome,
  - non-empty `first_value_retention_next_step_due_at`,
  - due date at or before the current WordPress time.
- Added a command-center card: `Retention follow-up due`.
- Added next-money priority: `Work due retention follow-ups`.
- Added due-status badge display beside retention next-step dates in the lawyer onboarding table.
- Updated deployment marker/version to `2026-05-28-lawyer-retention-followup-queue-v1` / `1.1.81`.

## Safety

- No public CMS content was changed.
- No redirects, canonicals, noindex rules, sitemaps, taxonomies, menus, payments, invoices, CRM records, users, or live leads were changed.
- No lawyer was marked paid, retained, followed-up, or at risk.
- No paid LLM/API spend was used.

## Current Blockers

- Grow/Meshulam KYC/payment status and real settlement proof remain blockers.
- A real lawyer payment, invoice/receipt evidence, first-value proof, retention review, retention outcome, and real follow-up action are still required before claiming revenue quality.

## Local Verification Completed

- PHP syntax passed for `inc/lawyer-onboarding.php` and `functions.php`.
- Payment-proof operator readiness gate passed, including `lawyer_onboarding_retention_followup_due_queue`.
- Mobile-menu source gate passed.
- PowerShell checker parse gate passed for `.project-control/scripts/*.ps1`.
- `git diff --check` passed before commit.

## Live Deployment Verification

- Code commit: `0ef2b432 Add paid lawyer retention follow-up queue`.
- Pushed to `origin/codex/live-homepage-conversion-release` and `origin/main`.
- uPress Pull Git completed for `wp-content/themes/justice-theme`.
- uPress Git log showed `0ef2b432` as `HEAD -> main`.
- Live deploy gate passed:
  - marker: `2026-05-28-lawyer-retention-followup-queue-v1`,
  - version: `1.1.81`,
  - previous marker absent.
- Revenue readiness gate passed with readiness `ready_for_owner_payment_admin_test`.
- Lawyer plans payment-proof path gate passed.
- Lawyer registration revenue bridge gate passed.
- Lawyer dashboard payment-proof preview gate passed.
- Live route/link hygiene passed, including `/about/` status 200 and no exposed `?page_id=` links in checked live pages.
- Live mobile menu browser QA passed:
  - hamburger opens,
  - panel remains visible,
  - mobile WhatsApp and lawyer-plan actions are visible,
  - no legacy `page_id` link is present in primary navigation,
  - close button remains touch-sized and inside the viewport.
- Visual evidence: `output/playwright/live-mobile-menu-open-1779939691.png`.

## Honesty Statement

This release improves owner visibility after a real paid-lawyer retention outcome is recorded. It does not prove real revenue, payment settlement, invoice issuance, CRM routing, lawyer handoff, first-value delivery, retained revenue, or completion of the due follow-up action.
