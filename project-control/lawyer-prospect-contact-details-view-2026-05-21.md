# Lawyer Prospect Contact Details View - 2026-05-21

## Why This Matters
- Goal: make sure every active lawyer prospect has at least one real contact channel before outreach.
- Money path: a prospect without email or phone is not reachable pipeline; it is research debt.
- This is admin-only and reads private prospect metadata; it does not send messages or create records.

## Research Input
- HubSpot contact management stresses complete contact records, logged sales activities, calls, emails, follow-ups and automatic record updates.
- HubSpot enrichment material frames missing contact/company fields as sales friction because reps spend time researching instead of selling.
- Salesforce sales data guidance frames quality sales data as the foundation for faster revenue decisions and a complete business view.
- Practical takeaway: the sales command center should flag active prospects that cannot yet be contacted.

Sources:
- https://www.hubspot.com/products/crm/contact-management
- https://www.hubspot.com/products/artificial-intelligence/use-cases/enrich-contact-data
- https://www.salesforce.com/sales/data/

## What Changed
- Updated `inc/lawyer-prospects.php`.
- Added a private `Needs contact details` view for `justice_prospect` records with no email and no phone.
- The view excludes `won` and `lost`, while treating missing status as active/research debt.
- Updated `inc/lawyer-onboarding.php`.
- Added a `Needs contact details` card to the Lawyer sales command center.
- Updated the next-best-action logic so missing contact details come after overdue/due follow-ups and before scheduling/proposal/hot/new outreach.

## Verification
- `php -l inc/lawyer-prospects.php` passed.
- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed with only the existing Windows line-ending warning.
- Pushed `2c8f893 Add prospect contact details view`.
- uPress Git pull succeeded; uPress Git log shows `2c8f893 Add prospect contact details view` as HEAD before this documentation correction.
- Public unauthenticated admin URL check for the `Needs contact details` list redirects to `wp-login.php`; the follow-up request hit uPress Login Protector and did not expose the private list.

## Completion Assessment
- Materially advanced: the owner can now separate reachable prospects from research debt before the first paid-lawyer outreach batch.
- Still blocked: no outreach sent, no prospect updated, no signup, no paid subscription, and Grow/payment approval remains outside this change.
- Lawyer acquisition execution readiness: 82% -> 84%.
- Prospect follow-up/readiness discipline: 86% -> 88%.
- First paid-lawyer readiness: remains 90% until real outreach/signups or payment setup moves.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> Lawyer Prospects -> Needs contact details; also Lawyer Onboarding -> Lawyer sales command center.

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
