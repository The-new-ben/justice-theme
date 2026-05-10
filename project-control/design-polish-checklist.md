# Design Polish Checklist

Date: 2026-05-10  
Status: ACTIVE LAUNCH CHECKLIST

## Brand Identity

- CODE FIXED: repo logo fallback is no longer the dummy placeholder.
- CODE FIXED: favicon/app icon fallback set exists in SVG, ICO and PNG sizes.
- CODE FIXED: header red-dot animation is slightly faster.
- NOT LIVE VERIFIED: browser tab favicon after `2026-05-10-branding-v1` deploy.
- NOT LIVE VERIFIED: wp-admin Custom Logo and Site Icon selected asset.
- NEEDS OWNER DECISION: approve old blue-scale mark as final favicon or temporary fallback.

## Header

- LIVE VERIFIED: fallback Jus-Tice wordmark is visible before this branding batch.
- CODE FIXED: fallback wordmark scale is slightly reduced.
- NOT LIVE VERIFIED: new post-branding header size after deployment.

## Footer

- PARTIAL: footer uses custom logo if set, otherwise fallback wordmark.
- NOT LIVE VERIFIED: footer logo after final Custom Logo/Site Icon admin selection.

## Mobile

- CODE FIXED: floating action collision batch exists.
- CODE FIXED: mobile app-icon fallback assets exist.
- NOT LIVE VERIFIED: mobile header/logo/floating controls after deployment.

## SEO / Search Branding

- LIVE VERIFIED: current live favicon URLs are crawlable with HTTP 200.
- CODE FIXED: stable theme fallback URLs exist.
- NOT LIVE VERIFIED: final Google result favicon refresh.
- NEXT: after final icon is selected, request homepage recrawl in GSC.

## 2026-05-10 Post-Pull Verification

- LIVE VERIFIED: `2026-05-10-branding-v1` marker is public.
- LIVE VERIFIED: fallback theme icon assets return HTTP 200.
- LIVE VERIFIED: header logo is visible on desktop and mobile.
- PARTIAL: theme WhatsApp float is improved, but third-party green chat/lead bubble still overlaps lower mobile hero cards.
- NOT VERIFIED: wp-admin Custom Logo and Site Icon selected media items.
- NEXT: verify/admin-clean favicon outputs and fix third-party mobile chat bubble placement.
