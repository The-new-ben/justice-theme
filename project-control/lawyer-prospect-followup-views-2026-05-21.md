# Lawyer Prospect Follow-up Views - 2026-05-21

## Why This Matters
- Goal: stop warm lawyer prospects from disappearing after the first message.
- Money path: the owner needs a daily view of due/overdue lawyer follow-ups, plus fast status actions, so the first paid lawyer can be closed with discipline.
- This is admin-only and does not send messages automatically.

## Research Input
- HubSpot treats tasks as record-linked reminders with priority, due date, reminders and follow-up creation after logged activity.
- Salesforce's 2026 pipeline guidance stresses that leads do not close by themselves; pipeline health depends on clear next steps, regular review and follow-up automation.
- Practical takeaway for Jus-Tice: every prospect should have a next-action date, and the CRM list should surface due/overdue work without requiring the owner to open every record.

Sources:
- https://knowledge.hubspot.com/tasks/create-tasks
- https://www.salesforce.com/sales/pipeline/management/

## What Changed
- Updated the private `justice_prospect` admin list under Lawyer Onboarding -> Lawyer Prospects.
- Added prospect list views:
  - Due now
  - Overdue
  - Today
  - Upcoming
- Each view filters by the `prospect_next_action_at` date.
- The Next action column now labels records as Overdue, Due today, Scheduled or No date set.
- Added list-level quick action buttons:
  - Contacted today
  - Set follow-up
  - Proposal sent
  - Won / onboarding
  - Lost / not fit

## Verification
- `php -l inc/lawyer-prospects.php` passed.
- `git diff --check` passed, with only the existing Windows line-ending warning.
- Pushed `a8a9493 Show due follow-ups in lawyer prospect list`.
- uPress Git pull succeeded; uPress log shows `a8a9493 Show due follow-ups in lawyer prospect list` as `HEAD -> main, origin/main, origin/HEAD`.
- Public unauthenticated admin URL check redirects to `wp-login.php`; the follow-up request hit the uPress login protector challenge and did not expose the admin prospect list publicly.

## Completion Assessment
- Materially advanced: the owner can now work lawyer prospects from a daily due/overdue list instead of relying on memory.
- Still blocked: no outreach sent, no prospect updated, no signup, no paid subscription, and Grow/payment product mapping still needs final approval/activation.
- Lawyer acquisition execution readiness: 70% -> 74%.
- Prospect follow-up readiness: 62% -> 72%.
- First paid-lawyer readiness: remains 90% until real outreach produces a signup or payment setup moves.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> Lawyer Prospects -> Due now / Overdue / Today / Upcoming.

## Safety
- Repo theme admin code/docs plus uPress pull/live login-gate check only.
- No public CMS database page edited.
- No public page changed.
- No 301 redirect package touched.
- No Grow action taken.
- No card charged.
- No payment setting changed.
- No product, lawyer, lead, prospect or order record created.
- No outreach sent.
