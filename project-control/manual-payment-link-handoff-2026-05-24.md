# Manual Payment Link Handoff - 2026-05-24

## What changed

The manual lawyer-payment path now has a structured place to store the actual payment request once the owner creates it in Grow, Morning / Green Invoice, or another approved manual payment tool.

## Research basis

- Grow Payment Links supports sending payment requests by WhatsApp, email, SMS and other channels, including quick payment links and recurring-payment links.
- Morning / Green Invoice documents payment buttons, payment links and standing-order links as manual or semi-manual ways to collect payment without waiting for a full automated integration.
- For Jus-Tice, this means the near-term revenue path should not stop at "invoice sent"; the owner needs the exact payment URL/reference connected to the lawyer record and, when ready, visible in the lawyer's private area.

Sources:

- https://grow.business/payment-links-guides/
- https://www.greeninvoice.co.il/magazine/digital-payments-guide/

## Files changed

- `inc/lawyer-onboarding.php`
- `page-lawyer-dashboard.php`
- `assets/css/premium-pass-3.css`
- `tools/check-live-lawyer-revenue-funnel.mjs`

## Owner-facing behavior

Open WordPress admin -> edit a lawyer record -> `Jus-Tice Lawyer Activation`.

New owner-only fields:

- `Manual payment link`
- `Invoice/payment reference`

Those values are also included in:

- the Lawyer Onboarding payment queue CSV export
- the copyable invoice handoff context/message
- the Lawyer Onboarding payment column

If a logged-in lawyer is at `invoice_sent` status and a manual payment link exists, the private dashboard plan card changes the action button to `Complete payment` and opens the saved link in a new tab.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `php -l page-lawyer-dashboard.php` passed.
- `node --check tools/check-live-lawyer-revenue-funnel.mjs` passed.
- `git diff --check` passed.
- Code commit `7dacc59 Add manual payment link handoff` was pushed to `main`.
- uPress Git pull completed and the uPress log showed `7dacc59` as live `HEAD`.
- `node tools/check-live-lawyer-revenue-funnel.mjs` passed `9/9` after deployment.

## Completion assessment

- Materially advanced: once the owner creates a Grow/Morning payment link, it can now be attached to the lawyer record, exported, copied into handoff text and shown to the lawyer in the private dashboard.
- Relevant goal: lawyer subscriptions and manual revenue collection.
- Estimated completion for manual lawyer revenue pipeline: 96%.
- Still blocked: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping before real recurring charges can be enabled.
- Where to notice it: WordPress admin -> lawyer edit screen -> `Jus-Tice Lawyer Activation`; logged-in lawyer dashboard after `invoice_sent` and a saved payment link.

## Safety

Admin-only metadata fields, export columns, handoff text, private-dashboard conditional display and read-only live checks only. No CMS database write happened during this cycle, and no public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.
