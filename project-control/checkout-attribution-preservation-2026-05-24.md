# Checkout Attribution Preservation - 2026-05-24

## Goal
Keep paid-lawyer source attribution intact when a prospect moves from the plan page to the Grow-compliance checkout fallback and then into the lawyer registration form.

## Research Signal
- Justia sells paid lawyer visibility by practice area and metro area, so source and placement context matter for proving which paid surfaces create lawyer demand.
- Clio intake reporting emphasizes lead sources, matter types, revenue potential and dashboard visibility, so the checkout-to-registration step should not drop campaign data.

## What Changed
- `inc/payment-compliance-routes.php` now carries hidden attribution fields through the fallback checkout form:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `utm_content`
  - `outreach_segment`
  - optional `outreach_city`
  - optional `outreach_practice`
- If no campaign data exists, the fallback uses safe defaults: `checkout_fallback`, `manual_invoice`, `lawyer_acquisition` and `checkout_{plan}`.
- `tools/check-live-lawyer-revenue-funnel.mjs` now verifies that the checkout fallback preserves those hidden fields for the `lead_partner` paid path.

## Verification
- Local PHP syntax check passed for `inc/payment-compliance-routes.php`.
- Local Node syntax check passed for `tools/check-live-lawyer-revenue-funnel.mjs`.
- `git diff --check` passed with only existing line-ending warnings.
- Committed and pushed: `5cb8761 Preserve checkout lawyer attribution`.
- uPress Git pull completed for `wp-content/themes/justice-theme`; uPress log showed `5cb8761` as live `HEAD`.
- Live read-only revenue funnel check passed `8/8`, including the stricter checkout hidden-field attribution gate.

## Owner Meaning
When a paid lawyer prospect starts from a measurable plan-page CTA, the checkout handoff no longer loses the source/campaign context before registration. This protects the sales reporting needed to know which placements, messages and outreach sources are creating paid subscription opportunities.

## Still Blocked
Automated recurring lawyer payments remain blocked until Grow/Meshulam approval and gateway/product mapping are complete.

## Safety
Theme checkout-form hidden fields, checker and read-only live verification only. No CMS database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, charge, invoice, lawyer record, lead, CRM, email/SMS, GSC or GA4 setting was changed.
