# E-E-A-T Authority Safety Hardening - 2026-05-22

## Status

FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED / NO PUBLIC CMS CHANGE

This cycle hardens T315 by closing the remaining repo-side authority risk in the active theme code.

## Problem Found

The newer authority layer in `inc/authority.php` already defines the safer model:

- Article author defaults to the Jus-Tice organization.
- Named `reviewedBy` output is allowed only through verified person records and practice-area fit.
- Visible article attribution in `single-articles.php` uses the controlled helper.

However, two older code paths were still active:

- `inc/schema.php` still contained the old hardcoded Ben Person author block and referenced `$reviewer` without defining it.
- `inc/eeat.php` still auto-injected legacy E-E-A-T bylines, Person schema and Article schema from a hardcoded practice-area registry.

That combination could reintroduce unsafe named authors/reviewers even after the governance pass.

## Fix

- Updated `inc/schema.php` so Article schema now gets `author` from `justice_theme_authority_organization_schema()`.
- Updated `inc/schema.php` so `reviewedBy` is defined only through `justice_theme_authority_article_reviewer_schema()`.
- Removed the hardcoded `#author-ben-btesh` Article schema author block.
- Updated `inc/eeat.php` so legacy automatic Person schema/byline/content injection is disabled by default.
- Added `justice_eeat_legacy_auto_injection_enabled()` with the opt-in filter `justice_theme_enable_legacy_eeat_auto_injection`.
- Created `tools/check-eeat-authority-safety.mjs`.
- Generated `reports/eeat-authority-safety-2026-05-22.csv`.
- Generated `reports/eeat-authority-safety-2026-05-22.json`.

## Verification

VERIFIED LOCAL:

- `php -l inc/schema.php`
- `php -l inc/eeat.php`
- `node --check tools/check-eeat-authority-safety.mjs`
- `node tools/check-eeat-authority-safety.mjs`

The checker returned `6/6 VERIFIED`.

## Safety Boundary

This does not create Ben's entity page, enrich Maya's live profile, add external sameAs links, change Google Business Profile, publish social profiles, update live CMS content, change public lawyer cards, change URLs, change redirects/canonicals/noindex, change sitemap, change taxonomy, change CRM or deploy to uPress.

## Remaining T315 Work

- Create `/about/editorial-policy/`.
- Build Ben entity page only after owner supplies verified facts and approved external links.
- Enrich Maya's profile only after owner-approved source verification.
- Add Organization `sameAs` only after verified company profiles exist.
- Run live Rich Results/schema validation after deploy/pull.
