# Maya Rotenberg Mini-Site CMS Status
Date: 2026-05-10

## Goal
Make the one verified lawyer profile, Advocate Maya Rotenberg, feel like a serious mini-site product rather than a basic card.

## FIXED IN CODE
- Added a narrow live migration in `inc/live-migrations.php`.
- The migration targets only the Maya Rotenberg `justice_lawyer` profile.
- It fills rich mini-site CMS fields only when those fields are empty.
- It does not overwrite future wp-admin edits.
- It does not invent ratings, reviews, photos, bar number, paid subscription, awards or ranking claims.

## CMS Fields Bootstrapped If Empty
- `profile_headline`
- `profile_subheadline`
- `bio_short`
- `profile_approach_title`
- `profile_approach`
- `profile_services`
- `profile_process`
- `profile_credentials`
- `profile_faqs`
- `profile_cta_title`
- `profile_cta_text`
- `verification_status` only if empty
- `featured_on_front` only if empty
- `lead_routing_enabled` only if empty

## Taxonomy Alignment
- Adds `family-law` practice area to Maya if the taxonomy exists.
- Adds `tel-aviv` city only if Maya has no city term yet.

## Verification
- VERIFIED: PHP lint passed locally for 120 PHP files.
- NOT VERIFIED LIVE: uPress has not pulled the latest repo commits.
- NOT VERIFIED LIVE: Maya profile slug `/lawyers/advocate-maya-rotenberg/` still needs live check after pull/cache.

## Next Admin Review
After deployment, open Maya's lawyer profile in wp-admin and review:
- phone
- WhatsApp
- email
- office address
- profile photo
- video URL
- actual bar/license status
- final copy tone approved by Maya
- whether lead routing should remain enabled
