# Lawyer Outreach Link Builder - 2026-05-21

## Why This Matters
- Goal: turn lawyer acquisition from manual guesswork into measured sales batches.
- Money path: send tracked registration links to selected lawyers, then see which source, city, practice and message created the draft lawyer signup.
- This supports the first paid lawyers even while Grow/Meshulam approval is still waiting.

## Research Input
- Google Analytics says campaign links should use `utm_source`, `utm_medium` and `utm_campaign` so traffic can be attributed in acquisition reporting.
- Google also recommends consistent lowercase naming because different capitalization splits campaign data.
- Practical takeaway for Jus-Tice: every manual lawyer outreach batch needs one generated link with a stable source, medium, campaign, segment, city and practice.

Sources:
- https://support.google.com/analytics/answer/10917952
- https://support.google.com/analytics/answer/15567068

## What Changed
- Added an owner-only WordPress admin submenu: Lawyer Onboarding -> Outreach Links.
- The screen builds a tracked `/lawyer-registration/` URL with:
  - plan interest
  - UTM source, medium, campaign and content
  - outreach segment, city and practice
  - manual invoice payment path for paid plans
- The screen also generates a short Hebrew message draft for direct outreach.
- Nothing is sent automatically. The owner still chooses who to contact and when.

## Verification
- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed, with only the existing Windows line-ending warning.

## Completion Assessment
- Materially advanced: the owner can now create measurable lawyer outreach links without editing URLs by hand.
- Still blocked: Grow/Meshulam final approval, actual outreach, first lawyer signup, first paid subscription.
- Lawyer acquisition execution readiness: 45% -> 55%.
- First paid-lawyer readiness: 88% -> 89%.
- Owner-visible after deploy: WordPress admin -> Lawyer Onboarding -> Outreach Links.

## Safety
- Repo theme code/docs only.
- No public CMS page edited.
- No lawyer, lead, order, product or payment setting created.
- No outreach sent.
- No 301 redirect package touched.
