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

## Public Source Layer
- CODE FIXED: `single-justice_lawyer.php` can now display a public-facing source/reference sidebox when `profile_public_sources` or `profile_source_summary` exists.
- CODE FIXED: `inc/live-migrations.php` now has a separate Maya public-source bootstrap that can run even if the first mini-site bootstrap already ran.
- SOURCE FOUND: official firm site, official about page, Dun's 100, Psakdin, Easy and official press-page references are documented in `project-control/maya-rotenberg-public-source-audit.md`.
- SAFETY: the source bootstrap does not set phone, WhatsApp, email, photo, awards, ratings, reviews, bar number or case-achievement claims.

## Taxonomy Alignment
- Adds `family-law` practice area to Maya if the taxonomy exists.
- Adds `tel-aviv` city only if Maya has no city term yet.

## Verification
- VERIFIED: PHP lint passed locally for 122 PHP files after the latest mini-site engagement pass.
- LIVE VERIFIED BROKEN: `/lawyers/advocate-maya-rotenberg/` and the old Hebrew Maya lawyer URL currently enter a redirect loop.
- CAUSE OBSERVED: response headers show `X-Redirect-By: Permalink Manager` sending English URL to the Hebrew URL, while WordPress/theme redirect logic sends the Hebrew URL back to English.
- FIXED IN CODE: the theme-side Hebrew-to-English Maya redirect is disabled by default behind the `justice_theme_enable_maya_slug_redirect` filter, so deployment should stop the loop.
- STILL NEEDS ADMIN: remove/update the Permalink Manager custom redirect/permalink for Maya so the canonical English slug `/lawyers/advocate-maya-rotenberg/` can be final.
- NOT VERIFIED LIVE: mini-site engagement module requires uPress pull/cache refresh.
- NOT VERIFIED LIVE: public-source sidebox requires uPress pull/cache refresh and a profile render after deployment.

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
