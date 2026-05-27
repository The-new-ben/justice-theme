# Homepage Router CRM Triage

Date: 2026-05-27

## What Changed

- Homepage situation-card leads now resolve to `public_homepage_form` instead of generic public site source.
- New leads from `homepage_legal_help_router` receive a source-specific owner next step.
- The admin leads list displays readable source labels such as `Homepage situation card`.
- The source-channel and next-step logic was applied across the shipped lead-submission plugin copies.

## Revenue Path

Homepage situation card -> prefilled public lead -> CRM source label -> fast first contact -> paid/approved lawyer handoff -> invoice or payment evidence.

## Verification Required

- PHP syntax checks for changed files.
- Live deployment marker after uPress Pull Git.
- A controlled non-customer form test can verify the exact meta values, but no real customer outreach should happen without explicit owner approval.

## Honest Status

This improves lead handling after capture. It does not create revenue by itself, does not contact real people, and does not solve Grow/Meshulam payment readiness.

Estimated readiness to profit after deployment: 51%.
