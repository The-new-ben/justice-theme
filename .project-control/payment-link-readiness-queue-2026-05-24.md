# Payment Link Readiness Queue - 2026-05-24

## What changed

The Lawyer Onboarding payment command center now separates manual-invoice registrations into payment-link readiness states:

- `Needs payment link`
- `Payment link ready`

This closes the gap between "billing details exist" and "the owner has actually created/pasted the payment request link."

## Research basis

- Grow Payment Links supports payment requests that can be sent through WhatsApp, email, SMS and other digital channels.
- Morning / Green Invoice documents payment links, payment buttons and standing-order links as practical collection paths before or alongside deeper automation.
- For Jus-Tice, the highest-friction manual revenue step is not only collecting billing details; it is turning those details into a concrete payment URL and keeping that URL attached to the lawyer record.

Sources:

- https://grow.business/payment-links-guides/
- https://www.greeninvoice.co.il/magazine/digital-payments-guide/

## Files changed

- `inc/lawyer-onboarding.php`

## Owner-facing behavior

Open WordPress admin -> Lawyer Onboarding -> Paid registration command center.

New cards:

- `Needs payment link`: manual-invoice registrations that have legal billing name and invoice email, are still unpaid, but do not yet have a saved manual payment link.
- `Payment link ready`: unpaid manual-invoice registrations that already have a saved payment link.

The next money action now prioritizes `Create payment links` after overdue payments and missing billing details. The filtered list can be opened with:

- `payment_link_status=needed`
- `payment_link_status=ready`

## Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed.
- Code commit `f02fdfe Add payment link readiness queue` was pushed to `main`.
- uPress Git pull completed and the uPress log showed `f02fdfe` as live `HEAD`.
- `node tools/check-live-lawyer-revenue-funnel.mjs` passed `9/9` after deployment.

## Completion assessment

- Materially advanced: the owner can now identify billing-ready lawyer registrations that still need a payment link before invoice chasing.
- Relevant goal: lawyer subscriptions and manual revenue collection.
- Estimated completion for manual lawyer revenue pipeline: 97%.
- Still blocked: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping before real recurring charges can be enabled.
- Where to notice it: WordPress admin -> Lawyer Onboarding -> Paid registration command center.

## Safety

Admin-only reporting/filtering and read-only live checks only. No CMS database write happened during this cycle, and no public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.
