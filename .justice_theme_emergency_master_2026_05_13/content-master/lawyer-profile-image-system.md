# Lawyer Profile Image System
**Date:** 2026-05-14

## Source Photo Policy

1. **Owner-provided photos** are the primary source. The lawyer or firm provides a professional headshot.
2. **Public professional photos** from the lawyer's website or bar association profile may be used if clearly authorized for directory use.
3. **AI-assisted editing** is allowed ONLY for consistent crop, background removal, lighting adjustment, and style normalization. NOT for generating or altering a person's appearance.
4. **Never fabricate a photo** that misrepresents the lawyer's appearance.
5. If no approved photo is available, use a **placeholder** and mark it `PLACEHOLDER`.

## Image Dimensions

| Usage | Dimensions | Aspect Ratio |
|-------|-----------|-------------|
| Source upload | ≥1024×1024 | 1:1 preferred |
| Card thumbnail | 200×200 | 1:1 |
| Profile hero | 400×500 | 4:5 |
| Directory grid | 300×300 | 1:1 |

## Crop Rules

- Center face in frame
- Head + shoulders visible
- Consistent headroom (10-15% above head)
- `object-fit: cover` in CSS
- No layout shift (fixed aspect ratio containers)
- Responsive `srcset` if multiple sizes available

## Placeholder Rules

When no approved photo exists:
- Use a neutral professional silhouette/icon
- Background color: site brand color (#1a1a2e or similar)
- No text on placeholder
- No gender assumption in silhouette
- Alt text: "תמונת פרופיל — [lawyer name]"
- Mark in CMS: `_profile_image_status` = `placeholder`

## AI/Photo-Editing Policy

| Allowed | NOT Allowed |
|---------|------------|
| Crop to standard size | Generate a fake face |
| Remove cluttered background | Alter facial features |
| Normalize lighting/color | Add fake settings/props |
| Compress/optimize | Create misleading composite |
| Convert format (JPEG→WebP) | Add text/branding on photo |

## Media Library Naming Convention

```
lawyer-profile-{slug}.jpg
lawyer-profile-{slug}-thumb.jpg
```

Example:
```
lawyer-profile-advocate-sharon-nahari.jpg
lawyer-profile-advocate-sharon-nahari-thumb.jpg
```

## Connection to WordPress

- Profile photo = **Featured Image** on `justice_lawyer` CPT post
- Set via: `wp_insert_attachment()` + `set_post_thumbnail($post_id, $attachment_id)`
- Or via REST API: POST to `/wp-json/wp/v2/justice_lawyer/{id}` with `featured_media: {attachment_id}`
- Or via WP Admin: Lawyer → Edit → Set Featured Image

## Future Lawyer Onboarding Workflow

1. Lawyer provides photo during onboarding
2. Photo reviewed for quality/professionalism
3. Cropped to standard dimensions
4. Uploaded to media library with naming convention
5. Set as featured image on lawyer post
6. Alt text set to "עו״ד [name]"
7. Verified on profile page and directory card

## Current Status

| Lawyer | Photo Status | Action Needed |
|--------|-------------|---------------|
| Adv. Sharon Nahari (19309) | ❌ MISSING | Need owner-provided photo or placeholder |
