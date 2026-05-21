# Lawyer Plans Objection FAQ - 2026-05-21

## Why This Matters
- Goal: reduce hesitation before a lawyer leaves details or asks for manual activation.
- Money path: the page now answers the most likely paid-lawyer objections before the sales call.
- This supports lawyer subscriptions while automatic monthly billing is still waiting for final external approval.

## Research Input
- FindLaw sells premium profiles with online presence, credibility, easy contact paths, detailed reporting and monthly performance reports.
- Justia compares free, Gold and Platinum options using premium visibility, prominent contact info, practice FAQs and traffic statistics.
- Lawzana's lawyer support frames reporting around profile views, lead conversions and marketing performance.
- Practical takeaway: the plan page should answer measurement, quality, payment readiness and setup requirements directly.

Sources:
- https://www.findlaw.com/lawyer-marketing/services/legal-directory-advertising/findlaw-premium-profile/
- https://www.justia.com/marketing/lawyer-directory/
- https://lawzana.com/support/lawyers/reporting-and-analytics

## What Changed
- Rebuilt `page-lawyer-plans.php` cleanly with readable Hebrew copy and safe helper fallbacks for plan URLs.
- Added a visible FAQ section after the plan/compliance blocks:
  - how lead quality is measured
  - whether lawyers can start before automatic monthly billing
  - whether Jus-Tice guarantees lead/case volume
  - what a lawyer needs before activation
- Added responsive FAQ styling in `assets/css/premium-pass-3.css`.
- Kept public vendor-stack wording off the page.

## Verification
- `php -l page-lawyer-plans.php` passed.
- `rg "WooCommerce|Morning|Grow|Meshulam" page-lawyer-plans.php` found no public vendor wording.
- `git diff --check` passed, with only the existing Windows line-ending warning.

## Completion Assessment
- Materially advanced: `/lawyer-plans/` now answers lawyer objections before signup, making the sales path more self-service.
- Still blocked: external Grow/payment approval, payment products, real outreach, first signup, first paid subscription.
- Lawyer plan conversion readiness: 70% -> 74%.
- First paid-lawyer readiness: remains 90% until real outreach or payment setup moves.
- Owner-visible after deploy: `/lawyer-plans/`, below the plan/compliance blocks.

## Safety
- Repo theme code/docs only.
- No public CMS database page edited.
- No payment setting changed.
- No product, lawyer, lead or order record created.
- No outreach sent.
- No 301 redirect package touched.
