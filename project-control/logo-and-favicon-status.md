# Logo And Favicon Status
Date: 2026-05-10

## VERIFIED
- Repo contains the owner-provided full Jus-Tice logo source at `assets/images/logo.png` and `assets/images/justice-logo-full.png`.
- `assets/images/logo.png` is no longer the old dummy placeholder; it is a 1781x1654 full logo reference and is not square enough to upload raw as the Site Icon.
- Repo contains square favicon/app icon assets at 16, 32, 48, 180, 192 and 512 pixels.
- Live screenshots show the code-based Jus-Tice wordmark with the red dot in the header.
- Dummy logo text is not visible in the latest public homepage screenshots.

## FIXED IN CODE
- Header and footer already use a code-based Jus-Tice lockup when no WordPress custom logo exists.
- Red dot is present and CSS-animated.
- Added `assets/images/favicon.svg`, PNG favicon sizes, ICO fallback and Apple/mobile icons.
- Added `assets/images/site.webmanifest` for mobile bookmark/install branding.
- Added `wp_head` fallback icon links in `inc/seo.php`, only used when WordPress has no Site Icon configured.
- Added a stable manifest link in `inc/seo.php`.

## NOT VERIFIED
- Old final logo in WordPress Media Library.
- WordPress Site Icon setting.
- Whether uPress/live cache has pulled the latest manifest pass.

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
