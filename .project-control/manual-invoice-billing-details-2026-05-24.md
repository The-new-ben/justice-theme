# Manual Invoice Billing Details - 2026-05-24

## Purpose

Reduce manual invoice back-and-forth for paid lawyer registrations while Grow/Meshulam recurring payments are still blocked.

## Research Basis

- Morning / Green Invoice describes digital payment flows where a business can collect payment while producing an invoice/receipt, add a payment button to a sent document, or send payment links and recurring-payment links.
- That means the manual fallback should collect enough billing context early so the owner can send the correct invoice/payment request faster after license/commercial review.

Source:
- https://www.greeninvoice.co.il/magazine/digital-payments-guide/

## What Changed

- `page-lawyer-registration.php` now shows an optional billing-details block only on the paid manual-invoice registration path.
- The block collects:
  - billing legal/business name
  - business ID / licensed business number / ID
  - invoice email
  - invoice address
- `inc/lawyer-onboarding.php` saves those fields on the lawyer draft.
- Owner notification emails now include the billing details.
- Manual invoice handoff context now includes billing details when available.
- Payment queue CSV exports now include the billing fields.
- `tools/check-live-lawyer-revenue-funnel.mjs` now verifies the live paid manual-invoice registration path renders and prefills those fields.

## Verification

- `php -l page-lawyer-registration.php` passed.
- `php -l inc/lawyer-onboarding.php` passed.
- `node --check tools/check-live-lawyer-revenue-funnel.mjs` passed.
- `git diff --check` passed.
- Code was committed as `51d3c1d Collect manual invoice billing details`.
- uPress Git pull completed successfully and the log showed `51d3c1d` as live `HEAD`.
- Public lawyer revenue funnel check passed `9/9` after deployment, including the stricter billing-details gate.

## Owner Value

When a paid lawyer registers before automatic recurring checkout is approved, the owner can already have invoice-ready details in the queue and export. This should shorten the time from signup to manual payment request.

## Remaining Blocker

Automatic recurring lawyer payments remain blocked until Grow/Meshulam approval plus gateway/product mapping are complete.

## Safety

Optional paid-path form fields, owner-only metadata/reporting and read-only live checks only. No CMS database write happened during this cycle, no public content publishing, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting was changed.
