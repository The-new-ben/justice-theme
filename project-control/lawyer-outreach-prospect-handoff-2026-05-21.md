# Lawyer Outreach Prospect Handoff - 2026-05-21

## Why This Matters
- Goal: turn manual lawyer outreach into a measurable sales pipeline, not loose WhatsApp/email memory.
- Money path: every lawyer contacted should have a private prospect record with source, plan, expected value, next action and outcome.
- This is admin-only. It helps the owner sell, follow up and learn which segment can become the first paid subscription.

## Research Input
- Clio Grow tracks marketing sources on contacts and matters so firms can connect outreach and online channels to the client pipeline.
- Clio Grow reporting includes source, status, estimated value, conversion rate, revenue and pipeline value.
- Practical takeaway for Jus-Tice: every manual outreach link should hand off to a prospect record before or immediately after the first message, so follow-up and revenue learning are visible.

Sources:
- https://help.clio.com/hc/en-us/articles/25315194374299-Clio-Grow-Marketing-Sources
- https://help.clio.com/hc/en-us/articles/29739406189339-Clio-Grow-Reports

## What Changed
- Updated the owner-only WordPress admin screen: Lawyer Onboarding -> Outreach Links.
- Added a "Prospect pipeline handoff" section with two buttons:
  - Add prospect with these batch defaults
  - Open prospect pipeline
- The prospect button opens a prefilled private admin draft for `justice_prospect`; it does not create a record until the owner saves it.
- Prefill now carries practice, city, target plan, priority, status, source URL, expected monthly value, demand signal and owner note.
- Updated the private Prospect Sales Details form so safe query-string prefill works on new prospect drafts.
- Updated the private Manual Outreach Kit so prospect-created messages keep UTM/outreach attribution, or reuse the Outreach Links registration URL when present.
- Added a batch rule reminding the owner to create a prospect record before sending or immediately after the first reply.

## Verification
- `php -l inc/lawyer-onboarding.php` passed.
- `php -l inc/lawyer-prospects.php` passed.
- `git diff --check` passed, with only the existing Windows line-ending warning.
- Pushed `4327606 Connect outreach links to prospect pipeline`.
- uPress Git pull succeeded; uPress log shows `4327606 Connect outreach links to prospect pipeline` as `HEAD -> main, origin/main, origin/HEAD`.
- Public unauthenticated admin URL check redirects to `wp-login.php`; the follow-up request hit the uPress login protector challenge and did not expose the admin tool.

## Completion Assessment
- Materially advanced: the first manual lawyer batch can now be connected to a real follow-up record and expected monthly value.
- Still blocked: no outreach sent, no prospect saved, no signup, no paid subscription, and Grow/payment product mapping still needs final approval/activation.
- Lawyer acquisition execution readiness: 63% -> 70%.
- Prospect follow-up readiness: 45% -> 62%.
- First paid-lawyer readiness: remains 90% until real outreach produces a signup or payment setup moves.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> Outreach Links, then "Add prospect with these batch defaults"; also Lawyer Onboarding -> Lawyer Prospects.

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
