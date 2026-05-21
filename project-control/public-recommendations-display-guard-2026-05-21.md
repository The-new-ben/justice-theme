# Public Recommendations Display Guard
Date: 2026-05-21
Status: CODE FIXED / NOT LIVE VERIFIED

## Purpose

T367 already had a first-party recommendation CPT and a public lawyer-profile display path, but the public query needed a stricter source guard.

The risk: a recommendation record could be marked `approved_public` and `confirmed` while using a Google/manual-import source type. That could accidentally turn the first-party display section into republished Google review content.

## Current Source Review

- Google Business Profile prohibited/restricted content policy covers reviews and review manipulation, including fake engagement and selective solicitation risk: https://support.google.com/business/answer/2622994
- Google Business Profile API policy requires proper purpose/consent and limits automated/programmatic use of Business Profile APIs: https://developers.google.com/my-business/content/policies

## What Changed

- Added `justice_theme_recommendation_source_type_options()`.
- Added `justice_theme_public_recommendation_source_types()`.
- Added `justice_theme_lawyer_public_recommendation_meta_query()`.
- Updated public recommendation count queries to require:
  - linked lawyer ID;
  - `recommendation_moderation=approved_public`;
  - `recommendation_permission=confirmed`;
  - `recommendation_source_type=first_party` by default.
- Updated public recommendation list query with the same source guard.
- Updated the admin source-type selector labels so Google links are clearly reference-only by default.
- Sanitized/validated saved recommendation source types.

## Public Display Rules

VERIFIED in code:

- Public display requires the recommendation CPT to exist.
- Public display requires the lawyer profile display path to opt in.
- Public display requires a published recommendation post.
- Public display requires `approved_public`.
- Public display requires `confirmed` permission.
- Public display now requires first-party source type by default.
- Google-linked or manual-imported recommendation records do not appear publicly unless a future code filter explicitly changes the allowed source list.

## What Did Not Change

- No Google API connection.
- No Google review import.
- No Google review text publication.
- No outbound SMS/email.
- No public review schema.
- No public AggregateRating schema.
- No lawyer/profile/customer/recommendation record was created or edited.
- No CMS database change was made.

## Verification

- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- NOT LIVE VERIFIED: this code has not been verified on the public server after uPress pull/cache refresh.
- NOT AUTHENTICATED VERIFIED: the admin selector was not visually checked in WordPress admin because no authenticated admin session was available in this cycle.

## Remaining Work

- Run authenticated QA for the recommendation request token/intake flow.
- Add owner-approved public profile section QA after real approved first-party recommendation records exist.
- Decide separately whether Google Business Profile API is worth connecting for metadata only.
- Keep review schema blocked until source policy, permission workflow and public display rules are fully approved.
