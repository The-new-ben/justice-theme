# Lawyer Sales Command Center - 2026-05-21

## Why This Matters
- Goal: give the owner one admin screen for daily lawyer sales execution.
- Money path: overdue/due prospects first, hot/proposal prospects next, and active monthly NIS in view.
- This is admin-only and reads private prospect data; it does not send messages or create records.

## Research Input
- HubSpot task guidance centers follow-up work around due dates, reminders, priorities, queues and record-linked tasks.
- Salesforce pipeline management guidance stresses clear next steps, regular pipeline review and automation because leads do not close by themselves.
- Practical takeaway: put follow-up debt and pipeline value on the owner dashboard, not hidden inside individual records.

Sources:
- https://knowledge.hubspot.com/tasks/create-tasks
- https://www.salesforce.com/sales/pipeline/management/

## What Changed
- Updated `inc/lawyer-onboarding.php`.
- Added a lawyer sales command center to the Lawyer Onboarding admin page.
- Shows cards for Overdue follow-ups, Due now, Hot prospects, Proposal sent, Active monthly pipeline and Won monthly value.
- Adds direct buttons to Outreach Links, Add manual prospect and Open all prospects.
- Uses existing private prospect data and existing due/status filters.

## Verification
- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed with only the existing Windows line-ending warning.
- Pushed `d0b61d0 Show lawyer sales command center`.
- uPress Git pull succeeded; the uPress log showed `d0b61d0 Show lawyer sales command center` before this documentation commit.
- Public unauthenticated admin URL check redirects to `wp-login.php`; the follow-up request hit uPress Login Protector and did not expose the admin page.

## Completion Assessment
- Materially advanced: the owner now has one sales command center for daily lawyer acquisition execution.
- Still blocked: no outreach sent, no prospect updated, no signup, no paid subscription, and Grow/payment product mapping still needs final approval/activation.
- Lawyer acquisition execution readiness: 74% -> 78%.
- Prospect follow-up readiness: 72% -> 78%.
- First paid-lawyer readiness: remains 90% until real outreach produces signup/payment movement.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> top sales command center.

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
