# Lawyer Payment Readiness Board - 2026-05-24

## What changed

The owner-only Lawyer Plan Payments screen now opens with a revenue-readiness board before the product mapping table.

## Why this matters

The payment setup previously showed the raw requirements and product IDs, but did not answer the owner-level question: can we sell now, can checkout automate now, and what is the next blocker? This change makes that decision visible in one place.

## Implementation

- Added an Owner Revenue Status panel to the Plan Payments admin screen.
- Shows whether automatic recurring checkout is ready or blocked.
- Shows whether manual invoice selling is available now.
- Shows how many of the four paid plan checkout products are mapped and ready.
- Shows the next owner action based on the current blocker:
  - missing WooCommerce / Subscriptions / gateway requirement
  - missing product IDs
  - mapped products that are not purchasable subscription products
  - controlled checkout smoke test when automatic checkout appears ready
- Added quick buttons to open the invoice queue and test the manual paid signup path.

## Safety

This is admin-only visibility and navigation. It does not create products, change gateway settings, charge anyone, send invoices, send emails/SMS, activate a lawyer, publish a profile, change public content, change redirects, change canonicals/noindex, change taxonomies, change sitemaps, or touch public CMS records.

## Verification

- `php -l inc/lawyer-plans.php` passed.
- `git diff --check` passed.

## Remaining blocker

Grow/Morning approval and payment-product mapping are still the blockers for automatic recurring lawyer payments. Until that is complete, the manual invoice path remains the practical revenue bridge.
