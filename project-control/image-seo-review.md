# Image SEO Review

Date: 2026-05-10  
Status: REVIEW PLAN - no image/template changes executed

## Goal

Images should support trust, comprehension and SEO without creating performance or layout problems.

## Requirements

For every important image:
- descriptive Hebrew alt text where the image conveys meaning.
- empty alt only for purely decorative images.
- stable dimensions or aspect ratio.
- responsive sizes.
- compression.
- lazy loading where appropriate, but not for critical hero/LCP assets unless tested.
- no important content delivered only as CSS background images.
- file names that are descriptive where practical.

## Current Risks

NOT VERIFIED:
- Lawyer cards and profiles may lack real approved photos.
- Article cards may lack thumbnails or use placeholders.
- Logo/favicon may still be text/fallback-only.
- Media URLs in GSC include PDFs/DOCX and possible legacy assets that need review.
- Mobile image dimensions and CLS have not been fully verified.

## Template-Specific Notes

Homepage:
- Hero visual must not push important text below the fold on mobile.
- Legal-field cards should not rely on decorative images for meaning.

Article pages:
- Featured image should have stable dimensions.
- Source/official links should not be hidden behind image-only controls.

Lawyer profiles:
- Professional photo should be approved and not fake.
- Placeholder should be neutral and clearly not a real photo.

## Source-Based Notes

Google image guidance says crawlers can find images in standard `<img>` elements and not CSS background images. Google mobile-first guidance also calls for equivalent image alt text and quality across mobile and desktop.

## Next Action

Add image fields to the template QA pass:
- missing alt.
- missing width/height.
- oversized asset.
- placeholder vs real image.
- LCP/CLS risk.
