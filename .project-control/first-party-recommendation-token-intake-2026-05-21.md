# First-Party Recommendation Token Intake
Date: 2026-05-21
Status: CODE FIXED / NOT LIVE VERIFIED

## Purpose

T367 needed a controlled way to collect real client recommendations without publishing anything automatically and without mixing Google review content into Jus-Tice first-party recommendations.

This cycle adds the missing intake layer:

- owner/admin creates a one-time recommendation link for a lawyer;
- client opens a noindex token URL and submits a recommendation;
- the submission becomes a draft `justice_recommendation` record;
- owner approval remains mandatory before public display.

## What Changed

- Added private admin-only token records with CPT `justice_reco_token`.
- Token records store a SHA-256 hash, linked lawyer ID, status, expiry, creator and submitted recommendation ID.
- Plain tokens are not stored after creation.
- New admin action: `justice_create_lawyer_recommendation_token`.
- Lawyer Onboarding now has a `Create recommendation link` button for each listed lawyer.
- After creation, Lawyer Onboarding shows a copyable one-time link in an admin notice.
- Public intake is handled through `/?justice_recommendation_token=...`.
- The intake page is standalone, Hebrew, `noindex,nofollow`, cache-disabled and does not use a crawlable archive route.
- The public form includes a honeypot, nonce, permission checkbox, display name, relationship/context, optional rating and recommendation text.

## Submission Rules

VERIFIED in code:

- Token must exist, be active and not expired.
- Token expires by default after 30 days.
- One token is consumed after one submission.
- Bot/honeypot submissions consume the token but do not create a public/draft recommendation.
- Real submissions create a draft `justice_recommendation` record only.
- Submission meta is set to:
  - `recommendation_source_type=first_party`;
  - `recommendation_permission=confirmed`;
  - `recommendation_moderation=draft_review`;
  - linked lawyer ID;
  - client display name/context;
  - optional rating.
- Owner receives an admin email notification only after a recommendation is submitted.

## Public Display Safety

The previous public display guard still applies.

A submitted recommendation does not appear on a lawyer profile until all of these are true:

- recommendation post is published;
- `recommendation_moderation=approved_public`;
- `recommendation_permission=confirmed`;
- `recommendation_source_type=first_party`;
- linked lawyer profile has public recommendation display enabled.

## What Did Not Change

- No Google API connection.
- No Google OAuth.
- No Google review import.
- No outbound client SMS/email.
- No public review schema.
- No AggregateRating schema.
- No automatic public display.
- No public lawyer/recommendation/customer record was created in this repo cycle.
- No redirect, sitemap, canonical, public content or payment setting changed.

## Verification

- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.
- VERIFIED LOCAL: `git diff --check` passed with normal Windows line-ending warnings only.
- NOT AUTHENTICATED VERIFIED: no WordPress admin session was available to click the admin token button.
- NOT LIVE VERIFIED: no uPress pull/cache refresh or live token form submission was run in this cycle.

## Remaining Work

- Run authenticated owner QA:
  - create recommendation link from Lawyer Onboarding;
  - open token URL;
  - submit one safe test recommendation;
  - confirm draft record, token status and owner notification;
  - approve one record manually and verify public profile display.
- Keep Google API and outbound SMS/email blocked until owner approves provider, copy, consent and policy posture.
- Keep public Review/AggregateRating schema blocked until the first-party approval workflow is proven with real records.
