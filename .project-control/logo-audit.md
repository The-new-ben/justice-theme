# Logo Audit
Date: 2026-05-09

## VERIFIED
- Repo contains `assets/images/logo.png`.
- Theme header uses `the_custom_logo()` when a logo is configured.
- Theme footer uses the custom logo when configured, otherwise a text lockup.
- `assets/images/logo.png` is a dummy asset and must not be used as the visible fallback brand.
- Repo fallback now renders a code-based Jus-Tice wordmark in header and footer when no custom logo is configured.
- The fallback wordmark includes a red animated dot, matching the requested old identity direction.
- Live homepage public HTML includes `Image: Jus-Tice Logo` near the footer, suggesting a logo asset exists live.

## NOT VERIFIED
- Whether the old Jus-Tice identity is present in the media library.
- Whether the header custom logo is configured live.
- Whether logo contrast and sizing are correct on mobile.
- Whether the live site has pulled the repo change and stopped rendering the dummy logo.

## Recommended Repo Action
- Verify live header/footer logo after GitHub/Upress pull.
- Do not claim the final brand identity is restored until the old logo source is verified.
- Replace or delete `assets/images/logo.png` only after confirming no live Customizer/media dependency still references it.
