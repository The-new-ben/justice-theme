# Homepage Visual Generation Standard

Date: 2026-05-28.
Scope: internal-only image and thumbnail standard for the Jus-Tice homepage rebuild and future lawyer/profile pages.

## Project Manager Check

- Active goals: make Jus-Tice look like a premium legal marketplace, keep homepage visuals realistic, protect Lighthouse/Core Web Vitals, and avoid misleading legal/profile claims.
- Sub-goals: homepage hero image, Open Graph image, thumbnails, lawyer profile photos, avatar fallback, Hebrew alt text, and browser visual QA.
- Completed this cycle: generated one internal-only homepage hero preview with the built-in image tool and added a live homepage image-markup checker.
- Incomplete / internal-only / not published: no generated image was wired into the public site, no CMS media was uploaded, and no public template/image replacement was deployed.
- Blockers: real lawyer profile assets and real review/profile proof are still needed before publishing profile-heavy visuals; payment proof remains blocked separately.
- Readiness to profit: visual standards improve trust/conversion readiness, but revenue is still 0% proven until a real paid lawyer/payment/invoice exists.
- Honesty statement: this is a standard, prompt packet, and read-only checker. It is not a public visual redesign and does not prove Lighthouse scores, rankings, CRM routing, invoices, or payments.

## Sources Used

- Google image SEO best practices: https://developers.google.com/search/docs/appearance/google-images
- WordPress featured images/post thumbnails: https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
- Web.dev Largest Contentful Paint: https://web.dev/articles/lcp
- Google Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals

## Minimum Generated Image Requirements

- Use realistic human legal-help scenes, not symbolic scales, generic courtrooms, abstract gradients, or fake law-firm imagery.
- No readable private data, no fake logos, no invented lawyer names, no fake badges, no fabricated ratings, and no false outcome claims.
- Homepage hero: landscape 16:9, recommended source 1280x720 or larger, with clear negative space for Hebrew copy.
- Open Graph: prepare 1200x630 crop separately.
- Cards/thumbnails: prepare 4:3 or 16:9 crop and verify mobile crop.
- Lawyer profile image: professional headshot style only when based on a real lawyer asset or explicitly approved generated placeholder marked internal-only.
- Avatar fallback: neutral initials/brand-safe graphic is safer than fake human faces when lawyer identity is not real.
- Accessibility: every non-decorative image needs useful Hebrew alt text; decorative icons may use empty alt.
- Performance: set width and height, avoid lazy-loading the LCP hero image, use `decoding`, and run Lighthouse before deployment.
- QA proof: desktop and mobile screenshot are required before claiming the visual is ready.

## Internal Preview Prompt Used

Tool actually used: built-in `image_gen` tool. No paid API key or external LLM API was used.

Prompt:

```text
Use case: photorealistic-natural
Asset type: Jus-Tice homepage hero image preview, internal-only
Primary request: Create a realistic editorial photo for an Israeli legal-help website. Scene: an adult in a modern Israeli apartment at a kitchen table organizing legal documents and using a smartphone to contact a lawyer by message, with a calm professional legal advisor visible in a subtle video-call frame on a laptop screen but no readable text. Subject: everyday person seeking legal help, not a courtroom and not a law-firm advertisement. Style/medium: premium photorealistic editorial photography, natural texture, realistic skin, realistic hands, modern local interior. Composition/framing: horizontal 16:9, subject on the right third, clean negative space on the left for Hebrew website copy overlay, camera at table height, documents visible but private details blurred/unreadable. Lighting/mood: natural daylight, calm, trustworthy, focused, human. Color palette: restrained neutral interior with deep navy and warm accent details, not monochrome. Constraints: no logos, no fake law firm names, no visible private data, no readable text, no badges, no courthouse drama, no scales of justice, no exaggerated symbols, no watermark, no distorted hands, no AI-looking plastic avatar style.
```

The generated preview remains internal-only. It was not copied into the theme and was not published.

## Live Homepage Image Markup Check

New checker:

```text
.project-control/scripts/check-homepage-visual-assets.ps1
```

It verifies:

- rendered homepage `<img>` elements exist,
- each image has an `alt` attribute,
- non-decorative images do not use empty alt text,
- each image has width and height,
- each image has loading and decoding attributes,
- homepage hero image exists and has dimensions, non-empty alt, eager loading, and high fetch priority.

Verification result on 2026-05-28T05:16:12Z:

- Pass: true.
- Image count: 6.
- Hero image count: 2.
- Hero ready: true.
- Missing alt attributes: 0.
- Empty non-decorative alt text: 0.
- Missing width/height: 0.
- Missing loading attributes: 0.
- Missing decoding attributes: 0.
- Hero image: `homepage-legal-help-hero.jpg`, `1280x720`, `loading="eager"`, `fetchpriority="high"`, Hebrew alt text present.

Supporting checks rerun in the same cycle:

- `.project-control/scripts/check-homepage-premium-readiness.ps1`: pass true, no failures, no warnings.
- `.project-control/scripts/check-live-deploy.ps1`: live marker and version still present.

## Required Before Homepage Visual Deployment

1. Select or generate final hero, OG, and thumbnail assets.
2. Copy approved final assets into the theme or CMS media library only after owner approval.
3. Preserve existing homepage content and lawyer-search keywords.
4. Run:
   - `.project-control/scripts/check-homepage-visual-assets.ps1`
   - `.project-control/scripts/check-homepage-premium-readiness.ps1`
   - `.project-control/scripts/check-live-mobile-menu-browser-qa.ps1`
   - Lighthouse/PageSpeed or Chrome Lighthouse.
5. Capture desktop and mobile screenshots.
6. Report what is live, what remains internal-only, and whether the image is owner asset, licensed/public asset, or generated.

## Not Changed

- No public webpage was updated.
- No media was uploaded to WordPress.
- No CMS/database, redirect, canonical, noindex, sitemap, or taxonomy setting was changed.
- No payment, invoice, lead, or lawyer account was created.
