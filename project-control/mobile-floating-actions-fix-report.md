# Mobile Floating Actions Fix Report

Date: 2026-05-10
Status: CODE FIXED / NOT LIVE VERIFIED

## Finding

- LIVE VERIFIED BEFORE FIX: mobile homepage screenshot showed the Pojo accessibility launcher over customer-facing hero content.
- LIVE VERIFIED BEFORE FIX: the theme WhatsApp float and lower mobile lead/chat CTA competed for the same bottom-screen area.
- Evidence: `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`.

## Code Change

- `assets/css/premium-pass-3.css`
- Reduced the mobile WhatsApp float to 48px.
- Raised the WhatsApp float above the bottom CTA zone.
- Lowered its mobile stacking priority.
- Added mobile bottom safe-space padding.
- Moved the Pojo accessibility toolbar away from the middle of the first viewport.
- Capped the accessibility overlay height on mobile.

## Verification

- VERIFIED: `git diff --check` passed.
- NOT LIVE VERIFIED: public site still needs uPress pull/cache refresh.
- NOT VISUAL VERIFIED AFTER FIX: requires fresh mobile screenshots after deployment.

## Next Action

After deployment, recheck:
- homepage mobile first viewport.
- one article page mobile.
- `/lawyers/` mobile.
- footer mobile.
- opened accessibility toolbar overlay.

