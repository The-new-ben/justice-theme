# Lawyer Retention Follow-Up Queue

Date: 2026-05-28
Status: LOCAL_VERIFIED_DEPLOY_REQUIRED

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

## Verification To Run

- PHP syntax for touched PHP files.
- Payment-proof operator readiness gate.
- Mobile-menu source gate.
- PowerShell checker parse gate.
- Live deploy verification after commit, push, and uPress Pull Git.
