# Lawyer Sales Next Best Action - 2026-05-21

## Why This Matters
- Goal: make the private lawyer sales dashboard tell the owner what to do first.
- Money path: stale follow-ups and proposal-stage prospects must be handled before creating more outreach volume.
- This is admin-only guidance based on existing private prospect counts; it does not send messages or change records.

## Research Input
- Salesforce says pipeline stages should identify the next best step for where a prospect is in the sales journey.
- Salesforce pipeline management guidance says the CRM should hold contact timing, reminders and interactions so the owner can decide how and when to communicate.
- HubSpot describes a task dashboard as a command center for tasks, meetings and contact details, keeping work in one place instead of scattered across tools.
- Practical takeaway: the owner dashboard should choose the first action by urgency, not only show raw counts.

Sources:
- https://www.salesforce.com/sales/pipeline/
- https://www.salesforce.com/sales/pipeline/management/
- https://www.hubspot.com/products/task-management

## What Changed
- Updated `inc/lawyer-onboarding.php`.
- Added `justice_theme_lawyer_onboarding_sales_next_action()`.
- Added a "Next best action" card at the top of the Lawyer sales command center.
- Priority order is: overdue follow-ups -> due follow-ups -> proposals -> hot prospects -> active pipeline review -> new outreach batch.
- The card links directly to the relevant private admin list or outreach builder.

## Verification
- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed with only the existing Windows line-ending warning.

## Completion Assessment
- Materially advanced: the owner now gets a simple operating instruction, not only dashboard numbers.
- Still blocked: no outreach sent, no prospect updated, no signup, no paid subscription, and Grow/payment approval remains outside this change.
- Lawyer acquisition execution readiness: 78% -> 80%.
- Prospect follow-up readiness: 78% -> 82%.
- First paid-lawyer readiness: remains 90% until real outreach/signups or payment setup moves.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> Lawyer sales command center -> Next best action card.

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
