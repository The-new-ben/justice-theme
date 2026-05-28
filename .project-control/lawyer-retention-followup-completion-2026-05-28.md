# Lawyer Retention Follow-Up Completion

Date: 2026-05-28
Status: LOCAL_VERIFIED_DEPLOY_REQUIRED

## Purpose

Close the gap after the paid retention follow-up due queue. The owner can now complete a due retention follow-up only after the account has payment proof, first-value proof, a retention review, a recorded outcome, a due next-step date, and an owner retention note.

## What Changed

- Added a guarded owner action: `justice_mark_lawyer_retention_followup_completed`.
- Added quick-action URL helper: `justice_theme_lawyer_retention_followup_completed_quick_action_url`.
- Added owner-only completion metadata:
  - `first_value_retention_followup_completed_at`,
  - `first_value_retention_followup_source`.
- Completion requires:
  - `payment_followup_status = payment_confirmed`,
  - private `manual_payment_evidence_url`,
  - first-value proof URL or outcome note,
  - `first_value_retention_started_at`,
  - non-empty retention outcome,
  - due `first_value_retention_next_step_due_at`,
  - non-empty `first_value_retention_note`.
- When completed, the action records completion, keeps an internal note, and reschedules the next retention follow-up date based on outcome:
  - retained: 30 days,
  - follow-up needed: 3 days,
  - at risk: 2 days.
- Added admin notices for completed, blocked, and proof-missing states.
- Added `Mark follow-up handled` in the lawyer onboarding table only when the proof gates and due-date gate pass.
- Updated deployment marker/version to `2026-05-28-lawyer-retention-followup-completion-v1` / `1.1.82`.

## Safety

- No public CMS content was changed.
- No redirects, canonicals, noindex rules, sitemaps, taxonomies, menus, payments, invoices, CRM records, users, or live leads were changed.
- No lawyer was marked paid, retained, followed-up, completed, or at risk.
- No paid LLM/API spend was used.

## Current Blockers

- Grow/Meshulam KYC/payment status and real settlement proof remain blockers.
- A real lawyer payment, invoice/receipt evidence, first-value proof, retention review, retention outcome, and real follow-up action are still required before claiming retained revenue quality.

## Verification To Run

- PHP syntax for touched PHP files.
- Payment-proof operator readiness gate.
- Mobile-menu source gate.
- PowerShell checker parse gate.
- Live deploy verification after commit, push, and uPress Pull Git.
