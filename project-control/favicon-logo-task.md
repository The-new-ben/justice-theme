# Favicon + Logo + Search Branding Task

Date: 2026-05-10  
Status: CODE FIXED / PARTIAL LIVE VERIFIED / WP-ADMIN SITE ICON NOT VERIFIED

## 2026-05-11 Branding Polish V3 Verification

- CODE FIXED: removed the duplicate fallback favicon block from `header.php`; favicon/app-icon fallback is centralized in `inc/seo.php`.
- VERIFIED LOCAL: `inc/seo.php` preserves WordPress Site Icon priority by returning early when `has_site_icon()` is true.
- CODE FIXED: premium brand polish CSS moved to `4.3.1`, theme version moved to `1.0.4`, and deployment marker moved to `2026-05-11-branding-polish-v3`.
- VERIFIED LOCAL: new premium-pass brand/trust rules no longer use negative `letter-spacing`.
- VERIFIED LOCAL: `git diff --check` passed with only normal Windows LF-to-CRLF warnings.
- VERIFIED LOCAL: PHP lint passed for all PHP files using the owner-provided local PHP zip extracted to a temporary runtime.
- NOT LIVE VERIFIED: public homepage source still reports marker `2026-05-11-media-sitemap-https-v1`; uPress pull/cache refresh is needed before live visual/favicon verification.
- BLOCKED: WordPress admin Site Icon media item, browser tab rendering after deploy, mobile bookmark icon, and Google search favicon refresh still need authenticated/live verification.

## Source Guidance

- Google favicon guidance: favicon must be crawlable by Googlebot and Googlebot-Image, use a stable URL, and be larger than the minimum 8x8 where possible. Source: https://developers.google.com/search/docs/appearance/favicon-in-search
- WordPress Site Icon guidance: preferred Site Icon asset is square and at least 512x512 PNG. Source: https://wordpress.org/documentation/article/create-a-favicon/

## Current Logo Status

- LIVE VERIFIED: public homepage currently outputs multiple favicon/icon tags from WordPress/media/plugin layers.
- LIVE VERIFIED: crawlable existing live icon URLs return 200:
  - `https://jus-tice.co.il/wp-content/uploads/2024/06/cropped-favicon.png`
  - `https://jus-tice.co.il/wp-content/uploads/fbrfg/favicon-32x32.png`
  - `https://jus-tice.co.il/wp-content/uploads/fbrfg/android-chrome-192x192.png`
- VERIFIED IN REPO: old/draft logo file was provided by the owner in Downloads as `logo justice.png` / Hebrew-named PNG.
- VERIFIED IN REPO: previous `assets/images/logo.png` was a dummy placeholder and has been replaced with the provided Jus-Tice logo source.
- PARTIALLY ACCEPTED: the old scale mark is usable for favicon/app icon, but the full old logo is too tall for direct header use without admin/customizer cropping.

## Old Logo Search

- FOUND: provided owner asset in Downloads: `logo justice.png` / Hebrew-named PNG.
- FOUND: media export includes existing favicon uploads from 2024 and 2025.
- NOT VERIFIED: wp-admin Media Library search, Custom Logo setting and Site Icon setting require authenticated admin/customizer review.
- NOT FOUND IN REPO: no `wp-content/uploads/`, old backup assets or GeneratePress/customizer backup directory exists in this repo.

## Selected Assets

Repo fallback assets now exist:

| Asset | Path | Status | Notes |
|---|---|---|---|
| Full logo PNG | `assets/images/logo.png` | CODE FIXED | Provided owner logo source, not square |
| Full logo archive copy | `assets/images/justice-logo-full.png` | CODE FIXED | Safe reference copy |
| SVG favicon | `assets/images/favicon.svg` | CODE FIXED | Square SVG fallback with legal mark and red accent |
| ICO favicon | `assets/images/favicon.ico` | CODE FIXED | Contains 16/32/48 PNG entries |
| 512 icon | `assets/images/favicon-512.png` | CODE FIXED | Square 512x512 |
| WordPress Site Icon candidate | `assets/images/site-icon-512.png` | CODE FIXED | Square 512x512, upload candidate |
| 192 app icon | `assets/images/favicon-192.png` | CODE FIXED | Square 192x192 |
| Apple touch icon | `assets/images/apple-touch-icon.png` | CODE FIXED | Square 180x180 |
| Small favicons | `assets/images/favicon-48.png`, `favicon-32.png`, `favicon-16.png` | CODE FIXED | Browser/search fallback sizes |
| Web app manifest | `assets/images/site.webmanifest` | CODE FIXED | Stable mobile bookmark/install manifest |

## WordPress Site Icon Status

- LIVE VERIFIED: the live page outputs WordPress/plugin icon tags, including 32x32, 192x192, 180x180 and 512x512 icon links.
- NEEDS LIVE ADMIN VERIFICATION: whether the WordPress Site Icon option itself is set, which media item is selected, and whether RealFaviconGenerator or another plugin is overriding/duplicating tags.
- RECOMMENDED ADMIN ACTION: upload/select `assets/images/site-icon-512.png` as the WordPress Site Icon if the current media icon is not the approved final icon.

## Theme Fallback Status

- CODE FIXED: `inc/seo.php` keeps WordPress Site Icon as the preferred source by returning early when `has_site_icon()` is true.
- CODE FIXED: fallback now emits stable repo URLs for:
  - `favicon.ico`
  - `favicon.svg`
  - `favicon-512.png`
  - `apple-touch-icon.png`
- CODE FIXED: theme version bumped to `1.0.2` and deployment marker to `2026-05-10-branding-v1`.

## Google Favicon Readiness

- CODE FIXED: fallback assets are square where required.
- CODE FIXED: 48px, 192px and 512px PNGs exist.
- CODE FIXED: fallback URL paths are stable theme asset paths.
- LIVE VERIFIED: current live favicon URLs are crawlable with HTTP 200.
- LIVE VERIFIED: `robots.txt` returned 200 and did not output blocking rules in the public check.
- NEEDS LIVE VERIFICATION AFTER DEPLOY: source should include the new fallback tags only when WordPress Site Icon is absent. If Site Icon is present, WordPress/plugin tags should remain primary.

## Browser Tab Test

- LIVE VERIFIED: current live page includes favicon tags in source.
- NOT LIVE VERIFIED AFTER FIX: browser tab still needs manual visual recheck after uPress pull/cache refresh.

## Mobile Test

- CODE FIXED: app icon sizes exist: 180, 192 and 512.
- NOT LIVE VERIFIED AFTER FIX: add-to-home-screen / mobile bookmark icon not checked.

## Search Result Readiness

- PARTIAL: current live favicon files are crawlable and square-size tags exist.
- BLOCKED: Google result favicon cannot be forced immediately. After final Site Icon selection, use GSC URL inspection for the homepage and allow recrawl.
- NEEDS OWNER DECISION: approve whether the old blue-scale mark is the final public favicon or only a temporary fallback.

## Verification Checklist

- CODE FIXED: logo asset is no longer the dummy placeholder.
- CODE FIXED: 512x512 Site Icon candidate exists.
- CODE FIXED: 16/32/48/180/192/512 icon assets exist.
- CODE FIXED: SVG and ICO fallback assets exist.
- CODE FIXED: fallback icon tags respect WordPress Site Icon priority.
- CODE FIXED: red accent animation is slightly faster in the header fallback wordmark.
- NOT LIVE VERIFIED: final browser tab after deploy.
- NOT LIVE VERIFIED: final mobile bookmark icon.
- NOT LIVE VERIFIED: wp-admin Site Icon selected media item.
- NOT LIVE VERIFIED: Google search result update.

## Next Actions

1. Owner/uPress pulls latest repo and clears cache.
2. Check public source for deployment marker `2026-05-10-branding-v1`.
3. Open wp-admin -> Appearance/Site Identity and verify Custom Logo and Site Icon.
4. If Site Icon is not approved, upload/select `assets/images/site-icon-512.png`.
5. Recheck homepage desktop/mobile header and browser tab.
6. Recheck Google Search Console URL inspection for homepage after final icon is selected.

## 2026-05-10 Post-uPress Pull Verification

- LIVE VERIFIED: homepage source now contains deployment marker `2026-05-10-branding-v1`.
- LIVE VERIFIED: source no longer contains the old deployment marker.
- LIVE VERIFIED: theme asset version `1.0.2` is present.
- LIVE VERIFIED: theme fallback icon files are crawlable:
  - `https://jus-tice.co.il/wp-content/themes/justice-theme/assets/images/favicon.svg` - 200
  - `https://jus-tice.co.il/wp-content/themes/justice-theme/assets/images/favicon.ico` - 200
  - `https://jus-tice.co.il/wp-content/themes/justice-theme/assets/images/favicon-512.png` - 200
  - `https://jus-tice.co.il/wp-content/themes/justice-theme/assets/images/apple-touch-icon.png` - 200
  - `https://jus-tice.co.il/wp-content/themes/justice-theme/assets/images/site-icon-512.png` - 200
  - `https://jus-tice.co.il/wp-content/themes/justice-theme/assets/images/logo.png` - 200
- LIVE VERIFIED: WordPress/media/plugin icon tags remain the active public icon output, so the theme fallback does not emit duplicate fallback tags while WordPress reports an existing Site Icon.
- VISUAL VERIFIED: screenshots captured:
  - `project-control/visual-evidence/homepage-branding-post-pull-desktop-2026-05-10.png`
  - `project-control/visual-evidence/homepage-branding-post-pull-mobile-2026-05-10.png`
- STILL NEEDS ADMIN REVIEW: wp-admin Site Icon selected media item, Custom Logo selected media item, and whether duplicate favicon plugin outputs should be simplified.

## 2026-05-11 Manifest / Mobile Bookmark Pass

- CODE FIXED: added `assets/images/site.webmanifest` with stable 192x192 and 512x512 icon references.
- CODE FIXED: `inc/seo.php` now emits the manifest link only when WordPress has no Site Icon, so the live RealFaviconGenerator/WordPress icon stack is not duplicated.
- VERIFIED LOCALLY: icon dimensions were checked: 16x16, 32x32, 48x48, 180x180, 192x192 and 512x512 square PNG assets exist.
- VERIFIED LOCALLY: full logo source remains 1781x1654 and should not be uploaded raw as the Site Icon without crop/export.
- PARTIAL LIVE VERIFIED: current public source already includes `/wp-content/uploads/fbrfg/site.webmanifest`.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-branding-manifest-v1`.
- LIVE CHECK NEEDED: homepage source should not include duplicate manifest links while WordPress Site Icon exists; theme fallback manifest should be available only if the admin icon stack is absent.
