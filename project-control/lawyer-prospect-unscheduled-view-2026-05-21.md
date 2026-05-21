# Lawyer Prospect Unscheduled View - 2026-05-21

## Why This Matters
- Goal: prevent active lawyer prospects from sitting in the pipeline with no next action date.
- Money path: each active prospect needs a clear next step, a follow-up date, or a final won/lost decision.
- This is admin-only and reads private prospect metadata; it does not send messages or create records.

## Research Input
- Salesforce warns that unclear next actions create fuzzy pipeline data and recommends stage criteria so sellers know the next step.
- Salesforce pipeline guidance says healthy pipeline flow requires prospects to move forward in a set time frame or be filtered out.
- HubSpot task guidance emphasizes task queues, due dates and action items so follow-up work does not scatter across tools.
- Practical takeaway: active prospects with no next action date should have their own view and should be prioritized before new outreach.

Sources:
- https://www.salesforce.com/ca/sales/team-productivity/sales-productivity-pitfalls/
- https://www.salesforce.com/sales/pipeline
- https://www.hubspot.com/products/task-management

## What Changed
- Updated `inc/lawyer-prospects.php`.
- Added an admin-only `Needs scheduling` view for `justice_prospect` records with no `prospect_next_action_at`.
- The view excludes `won` and `lost` records because those intentionally clear the next-action date.
- Updated `inc/lawyer-onboarding.php`.
- Added a `Needs scheduling` card to the Lawyer sales command center.
- Updated the next-best-action logic so unscheduled active prospects come after overdue/due follow-ups and before proposals/hot/new outreach.

## Verification
- `php -l inc/lawyer-prospects.php` passed.
- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed with only the existing Windows line-ending warning.

## Completion Assessment
- Materially advanced: the owner can now find active prospects with no next step before they stall.
- Still blocked: no outreach sent, no prospect updated, no signup, no paid subscription, and Grow/payment approval remains outside this change.
- Lawyer acquisition execution readiness: 80% -> 82%.
- Prospect follow-up readiness: 82% -> 86%.
- First paid-lawyer readiness: remains 90% until real outreach/signups or payment setup moves.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> Lawyer Prospects -> Needs scheduling; also Lawyer Onboarding -> Lawyer sales command center.

## Safety
- Repo theme admin code/docs only until uPress pull.
- No public CMS database page edited.
- No public page changed.
- No 301 redirect package touched.
- No Grow action taken.
- No card charged.
- No payment setting changed.
- No product/lawyer/lead/prospect/order record created.
- No outreach sent.
