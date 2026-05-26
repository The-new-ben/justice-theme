# Authority Person Profile Schema Gate - 2026-05-22

## Status

FIXED / VERIFIED LOCAL / NOT LIVE VERIFIED.

This pass advances T315 without publishing new content, creating a Ben page, changing CMS rows, or touching live redirects.

## What Changed

- FIXED: `justice_lawyer` schema now returns nothing for unapproved public profiles unless the current user can edit that profile.
- FIXED: approved lawyer pages now get a stable `Attorney` schema `@id`.
- FIXED: verified lawyer Person schema is emitted only through the central authority registry.
- FIXED: Maya Rotenberg can resolve to the verified authority registry even if the live post still has a legacy Hebrew slug, as long as the title clearly matches the Maya profile.
- FIXED: lawyer schema `sameAs` URLs can be assembled from approved CMS fields: website, source URL, social URLs and `profile_public_sources`.
- VERIFIED: the authority safety checker now covers `11/11` checks.

## Safety Decisions

- Ben Batash is still not in the verified person registry.
- `/about/ben-batash/` was not created in this pass.
- Ben's entity page remains BLOCKED until the owner supplies verified facts, approved role language, profile photo decision, bar/license evidence where relevant, external profile links and final public wording.
- No `sameAs` URL is added for Jus-Tice Organization until the external profile is live and verified.
- No public lawyer profile, article attribution, CMS content, URL, redirect, canonical/noindex, sitemap, taxonomy, lead, payment, GSC/GA4, wp-admin setting or uPress deployment changed.

## Verification

- VERIFIED LOCAL: `php -l inc/authority.php`
- VERIFIED LOCAL: `php -l inc/schema.php`
- VERIFIED LOCAL: `node --check tools/check-eeat-authority-safety.mjs`
- VERIFIED LOCAL: `node tools/check-eeat-authority-safety.mjs`
- VERIFIED LOCAL: checker generated `reports/eeat-authority-safety-2026-05-22.csv` and `.json` with `11/11` checks verified.
- NOT LIVE VERIFIED: live Maya profile JSON-LD, Rich Results and screenshots still require uPress pull/cache clear and the Maya permalink loop/admin redirect issue to be resolved.

## Next Required Actions

1. Deploy/pull code on uPress only after owner approval.
2. Clear cache and resolve the Permalink Manager Maya redirect loop if it still exists.
3. Open `/lawyers/advocate-maya-rotenberg/` and verify that it returns 200.
4. Inspect JSON-LD and Rich Results output for Attorney + Person schema.
5. Owner supplies Ben entity facts and links before any `/about/ben-batash/` page or Ben Person schema is added.
