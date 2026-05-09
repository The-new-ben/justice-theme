# Lawyer System Audit
Date: 2026-05-09

## VERIFIED From Repo
- CPT slug: `justice_lawyer`.
- Archive template: `archive-justice_lawyer.php`.
- Single template: `single-justice_lawyer.php`.
- Card template: `template-parts/cards/lawyer-card.php`.
- Meta fields registered in plugin code include identity, contact, commercial, analytics, and admin fields.
- Lead CPT exists as `justice_lead`.

## VERIFIED From Public Live HTML
- `/lawyers/` returns 10 lawyer profiles.
- Cards show name, firm, city/practice-area metadata, profile link, and contact CTA.

## VERIFIED By User / Project Knowledge
- Only `advocate-maya-rotenberg` is a verified lawyer client for public homepage featuring.

## STILL BROKEN
- Public live cards show city slugs such as `tel-aviv`, not Hebrew city names.
- Seed/demo profiles may be published and marked verified in legacy seeder code. This is a compliance/trust risk.
- Homepage public extract does not clearly show lawyer cards under the featured lawyers section, even though `/lawyers/` has profiles.

## Required Fixes
- Ensure `city` and `practice-areas` attach to `justice_lawyer`.
- Update seeder to create draft/private, unverified profiles unless explicitly demo-only.
- Add profile photo/initials design consistency.
- Add language, short bio, years, and clear sponsored label where applicable.
- Build the Maya Rotenberg profile as the first rich lawyer mini-site: video, articles, reviews, FAQ, social links, and lead tracking.
