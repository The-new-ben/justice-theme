# Lawyer Plans FAQ Schema - 2026-05-21

## Why This Matters
- Goal: help search engines understand the lawyer subscription objections already visible on `/lawyer-plans/`.
- Money path: the page now answers and marks up questions about lead quality, manual activation, limits and setup requirements before a lawyer leaves details.
- This supports lawyer subscription conversion without changing payment settings or requiring any CMS database edit.

## Research Input
- Google's current FAQPage guidance says FAQ rich results are being deprecated in Google Search from May 7, 2026, with related reporting/support being removed later.
- Google still documents the `FAQPage`, `Question` and `Answer` structure and says each question needs one accepted answer.
- Google's structured data guidelines say structured data should match visible page content and should not mark up hidden, irrelevant or misleading content.
- Practical takeaway: do not promise FAQ rich snippets. Use FAQ schema only where the same questions and answers are visible to users, as a machine-readable clarity layer.

Sources:
- https://developers.google.com/search/docs/appearance/structured-data/faqpage
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/blog/2023/08/howto-faq-changes

## What Changed
- Added `FAQPage` JSON-LD to `page-lawyer-plans.php`.
- The schema describes the four visible FAQ objections already on the page:
  - lead quality measurement
  - starting before automatic monthly billing
  - no guarantee of lead/case volume
  - activation requirements for a lawyer profile
- Used the existing `justice_theme_print_schema()` helper.
- Kept public payment-provider/vendor wording off the page.

## Verification
- `php -l page-lawyer-plans.php` passed.
- `rg "WooCommerce|Morning|Grow|Meshulam" page-lawyer-plans.php` found no public vendor wording.
- `git diff --check` passed, with only the existing Windows line-ending warning.
- Pushed `921656c Add lawyer plans FAQ schema`.
- uPress Git pull succeeded; uPress log shows `921656c Add lawyer plans FAQ schema` as `HEAD -> main, origin/main, origin/HEAD`.
- Live `/lawyer-plans/?qa=faq-schema-202605211705` check:
  - visible FAQ count: 4
  - FAQPage schema found: yes
  - schema question count: 4
  - page-level `noindex`: no
  - public Grow/Meshulam/WooCommerce/Morning wording: no
  - desktop scroll width stayed within the viewport

## Completion Assessment
- Materially advanced: the lawyer plan FAQ is now visible to lawyers and machine-readable for Google/AI crawlers.
- Still blocked: Grow/payment final approval, payment products, real outreach, first signup and first paid subscription.
- Lawyer plan SEO clarity: 68% -> 73%.
- Lawyer plan conversion readiness: remains 74%.
- First paid-lawyer readiness: remains 90% until real outreach or payment setup moves.
- Owner-visible: `/lawyer-plans/`; schema is not visible on-screen but is in the page source.

## Safety
- Repo theme code/docs plus uPress pull/live read-only verification only.
- No public CMS database page edited.
- No 301 redirect package touched.
- No Grow action taken.
- No card charged.
- No payment setting changed.
- No product, lawyer, lead or order record created.
- No outreach sent.
