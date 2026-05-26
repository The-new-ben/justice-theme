# Payment / Subscription Architecture
Date: 2026-05-09

## VERIFIED
- Repo now includes a safe lawyer plans layer:
  - `page-lawyer-plans.php`
  - `inc/lawyer-plans.php`
  - dashboard CTA to `/lawyer-plans/`
- Plan keys match the lawyer profile meta model:
  - `free`
  - `pro`
  - `featured`
  - `lead_partner`
  - `full_service`
- Buttons route to WooCommerce checkout only if a WooCommerce product ID is mapped in `justice_lawyer_plan_product_ids`.
- If WooCommerce or product mapping is not active, buttons fall back to `/lawyer-registration/?plan_interest={plan}`.

## NOT VERIFIED
- WooCommerce is installed live.
- WooCommerce Subscriptions is installed live.
- Checkout, taxes, invoices, refunds, payment gateways, and subscription renewals.
- Israeli lawyer advertising / paid placement / lead model compliance.

## Source Notes
- WooCommerce Subscriptions official docs describe subscription products as product types with recurring billing terms, pricing schedule, optional signup fee and optional trial.
- WooCommerce official shortcode docs note that checkout can be rendered through WooCommerce checkout functionality/blocks/shortcodes, but this repo should not force a checkout shortcode without live plugin setup.

Sources:
- https://woocommerce.com/document/subscriptions/creating-subscription-products/
- https://woocommerce.com/document/woocommerce-shortcodes/

## Decision
Do not activate live payments from theme code.

Use the theme only for:
- plan presentation
- product ID mapping helper
- registration fallback
- dashboard upgrade CTA

Use WooCommerce admin for:
- product creation
- subscription terms
- payment gateways
- checkout pages
- taxes/invoices

## Required Before Live Billing
1. Confirm legal/ethical rules for lawyer advertising, sponsored placements, lead routing and fee structures.
2. Install WooCommerce and, if recurring plans are needed, WooCommerce Subscriptions.
3. Create products for approved plans.
4. Store product IDs in `justice_lawyer_plan_product_ids`.
5. Test checkout in sandbox.
6. Add Terms for Lawyers, Advertising Disclosure, cancellation/refund rules and privacy language.
7. Only then switch public copy from "approval required" to active billing language.
