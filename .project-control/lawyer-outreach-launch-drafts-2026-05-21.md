# Lawyer Outreach Launch Drafts - 2026-05-21

## Why This Matters
- Goal: move from "the page is ready" to "the owner can start a small, tracked lawyer outreach batch."
- Money path: first paid lawyer needs manual selling before recurring payment approval is fully smooth.
- This makes outreach safer and more measurable without sending anything automatically.

## Research Input
- Google Analytics says campaign URLs should use `utm_source`, `utm_medium` and `utm_campaign`, and `utm_content` should distinguish different creatives/messages.
- Google also warns that inconsistent naming and case differences split campaign data into separate rows.
- Israeli anti-spam commentary around section 30A of the Communications Law describes opt-in limits for commercial messages and unsubscribe expectations.
- Practical takeaway: do not build a bulk sender. Use small manual batches, personalize messages, track each batch consistently, and respect removal requests.

Sources:
- https://support.google.com/analytics/answer/10917952
- https://www.law.co.il/en/news/2016/08/19/israeli-anti-spam-law-amended-for-first-time/

## What Changed
- Updated the owner-only WordPress admin screen: Lawyer Onboarding -> Outreach Links.
- Added three copyable message variants using the existing `utm_content` field:
  - `message_a`: lead-partner early access angle
  - `message_b`: measured professional page angle
  - `message_c`: visibility and fit-check angle
- Added a personal opening line field that is copied into the message but not added to the tracked registration URL.
- Added an owner-only warning that the screen is for manual outreach drafts only, not bulk email/SMS.
- Added batch rules: 10-20 lawyers per segment, one segment per batch, change only one variable, personalize the first sentence, and watch source data after real submissions.

## Verification
- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed, with only the existing Windows line-ending warning.
- Pushed `45d817a Improve lawyer outreach launch drafts`.
- uPress Git pull succeeded; uPress log shows `45d817a Improve lawyer outreach launch drafts` as `HEAD -> main, origin/main, origin/HEAD`.
- Live direct public/admin URL check redirects to WordPress login, has `noindex`, and does not expose the outreach screen text publicly.

## Completion Assessment
- Materially advanced: the owner can now create cleaner tracked outreach links and message drafts for the first lawyer batch.
- Still blocked: no actual outreach sent, no signup, no paid subscription, Grow/payment final approval and product mapping still need final confirmation.
- Lawyer acquisition execution readiness: 55% -> 63%.
- First paid-lawyer readiness: remains 90% until real outreach produces a signup or payment setup moves.
- Owner-visible after WordPress admin login: Lawyer Onboarding -> Outreach Links.

## Safety
- Repo theme admin code/docs plus uPress pull/live login-gate check only.
- No public CMS database page edited.
- No public page changed.
- No 301 redirect package touched.
- No Grow action taken.
- No card charged.
- No payment setting changed.
- No product, lawyer, lead or order record created.
- No outreach sent.
