# 404 Redirect Source Review
Date: 2026-05-11
Status: VERIFIED SOURCE / OWNER APPROVAL NEEDED

## Summary

The uncontrolled fake-URL behavior is now traced to an active WordPress plugin, not to the Jus-Tice theme routing code.

## Verified Evidence

- VERIFIED: uPress WordPress plugin manager lists `All 404 Redirect to Homepage`.
- VERIFIED: the plugin status is active (`פעיל`).
- VERIFIED: the plugin description states that it redirects random 404 links to the homepage or another page using a 301 redirect.
- VERIFIED: live fake public URLs return `301 Location: https://jus-tice.co.il`.
- VERIFIED: the live 301 response has no `X-Redirect-By` header and no theme `X-Justice-Route-Guard` header.
- Evidence screenshot: `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.

## Interpretation

The theme guards are deployed, but this active plugin is designed to intercept 404 responses and issue 301 redirects. That explains why arbitrary fake URLs still redirect to the homepage before the theme can render the Hebrew 404 template.

## SEO Risk

- Broken or removed URLs do not show a real 404.
- Google may see many unrelated old/fake URLs collapse into the homepage.
- This can create soft-404 and homepage relevance dilution risk.
- It can hide broken internal links during the content inventory and URL migration project.
- It conflicts with the controlled migration rule: old URL -> approved 301 -> correct new URL, not old URL -> homepage.

## Recommended Fix

Owner-approved controlled action:

1. Deactivate `All 404 Redirect to Homepage`.
2. Clear relevant page/cache layers if needed.
3. Verify a fake URL returns HTTP 404 with Hebrew 404 content.
4. Verify the homepage still returns HTTP 200.
5. Verify key pages still return HTTP 200.
6. Verify existing approved redirects, if any, are still handled by the intended redirect system.
7. Keep the plugin installed but inactive until the URL migration map is approved.

## Rollback

If unexpected live behavior appears after deactivation:

1. Reactivate `All 404 Redirect to Homepage`.
2. Clear cache if needed.
3. Recheck the same sampled URLs.
4. Document the regression before trying a different redirect strategy.

## Do Not Do

- Do not delete the plugin yet.
- Do not add homepage catch-all redirects.
- Do not edit `.htaccess` blindly.
- Do not change permalink structure.
- Do not execute URL migration redirects before the approved migration map exists.

