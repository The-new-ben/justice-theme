# Recommendation Token Safety Checker
Date: 2026-05-21
Status: TOOLING ADDED / VERIFIED LOCAL

## Purpose

The first-party recommendation token flow now touches admin UI, a public noindex intake form and draft recommendation creation. Before live QA or future SMS/schema work, the project needs a repeatable guard that checks the most important safety rules did not regress.

## What Changed

- Added `tools/check-recommendation-token-safety.mjs`.
- The checker reads `inc/lawyer-recommendations.php` and `inc/lawyer-onboarding.php`.
- It verifies token, intake, moderation and public-display guard conditions from code.

## Checked Rules

VERIFIED by the tool:

- token CPT exists and is not public;
- token hash meta exists;
- token values are SHA-256 hashed;
- public token page is served through `template_redirect`;
- public token page contains `noindex,nofollow`;
- public form includes a honeypot;
- valid submissions create draft recommendation records;
- submissions do not publish recommendation records;
- submissions set `recommendation_source_type=first_party`;
- submissions set `recommendation_permission=confirmed`;
- submissions set `recommendation_moderation=draft_review`;
- submissions do not set `approved_public`;
- token is consumed after submission or honeypot hit;
- owner notification exists for real submissions;
- public display guard still requires `approved_public`, `confirmed` and source-type filtering;
- onboarding admin exposes the create-link action and generated-link notice;
- recommendation token flow does not add `AggregateRating` or Review schema.

## Verification

- VERIFIED LOCAL: `node --check tools/check-recommendation-token-safety.mjs` passed.
- VERIFIED LOCAL: `node tools/check-recommendation-token-safety.mjs` passed.
- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.

## Remaining Work

- Run this checker before uPress pull and after any future recommendation/review/schema/SMS change.
- Still run authenticated WordPress QA because static tooling cannot prove actual admin click-through, database writes or email delivery.
