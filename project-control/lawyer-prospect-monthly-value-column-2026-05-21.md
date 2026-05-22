# Lawyer Prospect Monthly Value Column - 2026-05-21

## Why This Matters
- Goal: help the owner prioritize lawyer prospects by expected monthly revenue.
- Money path: when time is limited, higher expected monthly NIS opportunities should be easy to see and sort.
- This is admin-only display/sorting code; it does not send messages or change records.

## Research Input
- Pipedrive's pipeline guidance says deal value can be used for sorting so teams can focus on high-revenue opportunities.
- Pipedrive deal-management guidance shows value and priority as core pipeline details that should be visible at a glance.
- Practical takeaway: expected monthly NIS belongs in the private prospect list, not only inside each prospect record or in aggregate dashboard totals.

Sources:
- https://support.pipedrive.com/en/article/how-are-deals-ordered-in-the-pipeline-view
- https://www.pipedrive.com/en/products/sales/deal-management/

## What Changed
- Updated `inc/lawyer-prospects.php`.
- Added a `Monthly value` column to the private `justice_prospect` admin list.
- Shows `prospect_expected_monthly_nis` as a formatted NIS value or `Not set`.
- Made `Monthly value` sortable by numeric expected monthly NIS.
- Made the existing `Next action` column sortable by next action date.

## Verification
- `php -l inc/lawyer-prospects.php` passed.
- `git diff --check` passed with only the existing Windows line-ending warning.
- Pushed `36dccca Add prospect monthly value column`.
- uPress Git pull succeeded; uPress Git log shows `36dccca Add prospect monthly value column` as HEAD before this documentation correction.
- Public unauthenticated admin URL check for a value-sorted prospect list redirects to `wp-login.php`; the follow-up request hit uPress Login Protector and did not expose the private list.

## Completion Assessment
- Materially advanced: the owner can now sort lawyer prospects by revenue potential instead of treating all prospects equally.
- Still blocked: no outreach sent, no prospect updated, no signup, no paid subscription, and Grow/payment approval remains outside this change.
- Lawyer acquisition execution readiness: 85% -> 86%.
- Prospect follow-up/readiness discipline: 89% -> 90%.
- First paid-lawyer readiness: remains 90% until real outreach/signups or payment setup moves.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> Lawyer Prospects -> Monthly value column.

## Safety
- Repo theme admin code/docs plus uPress pull/live login-gate check only.
- No public CMS database page edited.
- No public page changed.
- No 301 redirect package touched.
- No Grow action taken.
- No card charged.
- No payment setting changed.
- No product/lawyer/lead/prospect/order record created.
- No outreach sent.
