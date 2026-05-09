# Logo Audit
Date: 2026-05-09

## VERIFIED
- Repo contains `assets/images/logo.png`.
- Theme header uses `the_custom_logo()` when a logo is configured.
- Theme footer uses the custom logo when configured, otherwise a text lockup.
- Live homepage public HTML includes `Image: Jus-Tice Logo` near the footer, suggesting a logo asset exists live.

## NOT VERIFIED
- Whether the old Jus-Tice identity is present in the media library.
- Whether the header custom logo is configured live.
- Whether `assets/images/logo.png` is the old identity or a temporary asset.
- Whether logo contrast and sizing are correct on mobile.

## Recommended Repo Action
- Keep the text lockup as fallback.
- Add docs and styling so `assets/images/logo.png` can be used as the default fallback only if no custom logo is set.
- Do not claim the final brand identity is restored until the old logo source is verified.
