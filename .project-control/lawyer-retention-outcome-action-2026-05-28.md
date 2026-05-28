# Lawyer Retention Outcome Action

Date: 2026-05-28
Status: LOCAL_VERIFIED_DEPLOY_REQUIRED

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

## Verification To Run

- PHP syntax for touched PHP files.
- Payment-proof operator readiness gate.
- Mobile-menu source gate.
- PowerShell checker parse gate.
- Live deploy verification after commit, push, and uPress Pull Git.
