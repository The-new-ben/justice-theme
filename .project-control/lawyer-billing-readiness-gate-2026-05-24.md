# Lawyer Billing Readiness Gate - 2026-05-24

## What changed

The Lawyer Onboarding command center now separates manual-invoice registrations into two operational states:

- Needs billing details
- Billing ready

This gives the owner a fast way to see which paid lawyer registrations cannot yet receive a clean invoice/payment link because the legal billing name or invoice email is missing.

## Research basis

- Grow Payment Links are designed for sending a payment request by WhatsApp, email, SMS or social channels, including one-time and recurring payment-link flows.
- Morning / Green Invoice describes invoice/payment-button/payment-link/standing-order flows, including recurring-payment links for retainer-style services.
- The practical revenue implication is simple: the owner can move faster only when invoice identity and invoice email are collected before manual payment follow-up.

Sources:

- https://grow.business/payment-links-guides/
- https://www.greeninvoice.co.il/magazine/digital-payments-guide/

## Files changed

- `inc/lawyer-onboarding.php`

## Owner-facing behavior

Open WordPress admin -> Lawyer Onboarding. In the paid registration command center, two new cards appear:

- `Needs billing details`: manual-invoice registrations missing legal billing name or invoice email.
- `Billing ready`: manual-invoice registrations with the required invoice identity and invoice email already present.

Both cards link to filtered Lawyer Onboarding views. The "next money action" now prioritizes missing billing details after overdue payment follow-up, before ordinary invoice chasing.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed.
- Code commit `fed6aa0 Add lawyer billing readiness gate` was pushed to `main`.
- uPress Git pull completed and the uPress log showed `fed6aa0` as live `HEAD`.
- `node tools/check-live-lawyer-revenue-funnel.mjs` passed `9/9` after deployment.

## Completion assessment

- Materially advanced: manual invoice operations can now distinguish invoice-ready paid registrations from registrations that still need billing cleanup.
- Relevant goal: lawyer subscriptions and revenue operations.
- Estimated completion for manual lawyer revenue pipeline: 95%.
- Still blocked: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping before real recurring charges can be enabled.
- Where to notice it: WordPress admin -> Lawyer Onboarding -> paid registration command center.

## Safety

Admin-only reporting/filtering and read-only live checks only. No CMS database write happened during this cycle, and no public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.
