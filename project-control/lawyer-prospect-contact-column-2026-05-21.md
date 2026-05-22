# Lawyer Prospect Contact Column - 2026-05-21

## Why This Matters
- Goal: help the owner scan the private lawyer prospect list and immediately see whether a prospect is reachable.
- Money path: outreach speed depends on knowing which prospects have email/phone and which are still research debt.
- This is admin-only display code; it does not send messages or change records.

## Research Input
- Pipedrive contact-management guidance emphasizes keeping contact information and deals together so teams can follow up while prospects are warm.
- Clio Grow lead/contact API fields include email and phone number for leads/contacts, which confirms that contact channels are core intake data in legal CRM workflows.
- Practical takeaway: the private prospect list should expose contact readiness directly in the table, not force the owner to open each record.

Sources:
- https://www.pipedrive.com/en/crm/solutions/crm-for-contact-managers
- https://docs.developers.clio.com/clio-grow/api-reference/

## What Changed
- Updated `inc/lawyer-prospects.php`.
- Added a `Contact` column to the private `justice_prospect` admin list.
- Shows email as a `mailto:` link when present.
- Shows phone as a `tel:` link when present.
- Shows `Missing email + phone` in red when no contact channel exists.

## Verification
- `php -l inc/lawyer-prospects.php` passed.
- `git diff --check` passed with only the existing Windows line-ending warning.
- Pushed `33848ba Add prospect contact column`.
- uPress Git pull succeeded; uPress Git log shows `33848ba Add prospect contact column` as HEAD before this documentation correction.
- Public unauthenticated admin URL check redirects to `wp-login.php`; the follow-up request hit uPress Login Protector and did not expose the private prospect list.

## Completion Assessment
- Materially advanced: the owner can now scan prospect reachability at list level before opening records.
- Still blocked: no outreach sent, no prospect updated, no signup, no paid subscription, and Grow/payment approval remains outside this change.
- Lawyer acquisition execution readiness: 84% -> 85%.
- Prospect follow-up/readiness discipline: 88% -> 89%.
- First paid-lawyer readiness: remains 90% until real outreach/signups or payment setup moves.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> Lawyer Prospects -> Contact column.

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
