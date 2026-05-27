# Manual Invoice Bridge

Date: 2026-05-27
Status: code prepared for live deployment
Deploy marker: 2026-05-27-manual-invoice-bridge-v1

## What changed

- Added an owner-only `Manual invoice bridge while Grow/Meshulam is blocked` panel to Justice CRM.
- The panel links directly to:
  - invoice-requested lawyer/onboarding queue,
  - payment-link-needed queue,
  - payment-link-ready queue,
  - lawyer plan payment setup.
- Added a copyable checklist for manual invoice/payment handling before marking a lawyer or lead as paid.

## Revenue purpose

Grow/Meshulam remains a payment blocker, so the fastest safe revenue path is a controlled manual invoice or Morning/Grow payment-link process. The CRM now points the owner from lead/lawyer demand to invoice queue, payment link, evidence, and activation gates.

## Not done

- No public CMS content was published.
- No live payment gateway settings, product prices, redirects, canonicals, noindex, sitemap, or taxonomies were changed.
- No real invoice, payment link, lead, lawyer, prospect, supplier, or customer record was created.

## Blockers

- Grow/Meshulam online checkout and recurring billing remain provider-gated.
- Actual revenue still requires a real lawyer or supplier accepting terms, a real invoice/payment link, and private payment evidence.

## Readiness to profit

Estimated readiness: 54%.

Reason: the CRM now exposes the manual payment fallback from the same operations screen as the lead queues. This is still not a paid conversion until real payment evidence exists.
