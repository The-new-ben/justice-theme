# Logo And Favicon Status
Date: 2026-05-10

## VERIFIED
- Repo contains only one brand image: `assets/images/logo.png`.
- `assets/images/logo.png` is a 1.4KB dummy placeholder and should not be used as the final visible logo.
- Live screenshots show the code-based Jus-Tice wordmark with the red dot in the header.
- Dummy logo text is not visible in the latest public homepage screenshots.

## FIXED IN CODE
- Header and footer already use a code-based Jus-Tice lockup when no WordPress custom logo exists.
- Red dot is present and CSS-animated.
- Added `assets/images/favicon.svg` as a temporary branded site icon.
- Added a `wp_head` fallback icon in `inc/seo.php`, only used when WordPress has no Site Icon configured.
- Bumped theme asset version to `1.0.1` to help CSS/icon cache refresh.

## NOT VERIFIED
- Old final logo in WordPress Media Library.
- WordPress Site Icon setting.
- Whether uPress/live cache has pulled the new favicon fallback.

## BLOCKED
- Media Library and Site Identity require wp-admin or authenticated browser access.

## NEXT ACTION
1. Open wp-admin > Appearance > Customize > Site Identity.
2. Check Custom Logo and Site Icon.
3. Search Media Library for old Jus-Tice logo with red dot.
4. If found, set it as Custom Logo and Site Icon.
5. If not found, keep the code lockup/fallback favicon marked TEMPORARY until a final logo file is created.

## 2026-05-10 Branding Update

- FOUND: owner-provided old logo in Downloads as a Hebrew-named PNG.
- VERIFIED: full logo is 1781x1654, so it is useful as a logo reference but not a direct Site Icon upload.
- CODE FIXED: old dummy `assets/images/logo.png` was replaced with the provided Jus-Tice logo source.
- CODE FIXED: `assets/images/justice-logo-full.png` keeps a reference copy.
- CODE FIXED: square fallback icon files now exist: `site-icon-512.png`, `favicon-512.png`, `favicon-192.png`, `apple-touch-icon.png`, `favicon-48.png`, `favicon-32.png`, `favicon-16.png`, `favicon.ico`, and `favicon.svg`.
- LIVE VERIFIED: current live page already outputs icon tags from WordPress/media/plugin layers and sampled live icon files return HTTP 200.
- NOT VERIFIED: wp-admin Site Icon selected media item and final browser-tab appearance after deploying this fallback batch.
