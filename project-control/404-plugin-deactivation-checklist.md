# 404 Plugin Deactivation Checklist
Date: 2026-05-11
Status: READY FOR OWNER APPROVAL

## Purpose

Deactivate the active `All 404 Redirect to Homepage` plugin in a controlled way so missing URLs return real Hebrew 404 pages instead of 301 redirects to the homepage.

## Approval Gate

Do not proceed until the owner explicitly approves deactivating:

- `All 404 Redirect to Homepage`

This is a live plugin-state change.

## Pre-Change Checks

1. Run `tools/check-404-routing.ps1`.
2. Confirm current fake URL behavior is still blocked: fake URL returns 301 to homepage.
3. Confirm homepage returns 200.
4. Confirm `/articles/` returns 200.
5. Confirm `/lawyers/` returns 200.
6. Confirm `/robots.txt` includes `sitemap_index.xml`.
7. Confirm `/sitemap_index.xml` returns XML.

## Baseline Verification

2026-05-11 baseline result:

- VERIFIED: `tools/check-404-routing.ps1` runs successfully in this Windows workspace.
- BLOCKED: fake generated URLs still return `301 Location: https://jus-tice.co.il/`.
- BLOCKED: invalid `/?p=99999999` still returns `301 Location: https://jus-tice.co.il/`.
- VERIFIED: homepage returns HTTP 200.
- VERIFIED: `/articles/` returns HTTP 200.
- VERIFIED: `/lawyers/` returns HTTP 200.
- VERIFIED: `/robots.txt` includes `sitemap_index.xml`.
- VERIFIED: `/sitemap_index.xml` returns XML.

Interpretation: the checker is ready for the post-change pass, and the current failed 404 checks are expected while `All 404 Redirect to Homepage` remains active.

## Live Change

Owner-approved action:

1. In uPress or WordPress plugin manager, deactivate `All 404 Redirect to Homepage`.
2. Do not delete the plugin.
3. Do not change `.htaccess`.
4. Do not change permalink settings.
5. Do not add new redirect rules.
6. Clear cache only if the first post-change checks still show stale 301 behavior.

## Post-Change Checks

1. Run `tools/check-404-routing.ps1`.
2. Confirm fake URL returns HTTP 404.
3. Confirm invalid `/?p=99999999` returns HTTP 404.
4. Confirm fake URL does not redirect to homepage.
5. Confirm fake URL does not show the homepage hero.
6. Confirm homepage returns HTTP 200.
7. Confirm `/articles/` returns HTTP 200.
8. Confirm `/lawyers/` returns HTTP 200.
9. Confirm `/robots.txt` still includes `sitemap_index.xml`.
10. Confirm `/sitemap_index.xml` remains XML.
11. Capture desktop and mobile screenshots of one fake URL if the 404 is fixed.

## Rollback

If valid core pages break after deactivation:

1. Reactivate `All 404 Redirect to Homepage`.
2. Clear cache if needed.
3. Run `tools/check-404-routing.ps1` again.
4. Document the regression before trying a different redirect strategy.

## Expected Final State

- FIXED: fake URLs return real HTTP 404.
- FIXED: public visitors see the Hebrew 404 page.
- FIXED: Google no longer sees arbitrary missing URLs redirected to the homepage.
- VERIFIED: homepage and important public pages remain healthy.
- NOT CHANGED: no URL migration, redirect map, `.htaccess`, permalink structure, content body, taxonomy, sitemap inclusion, canonical, lawyer data, CRM data, review data or database row is changed.
