---
name: hero-text-readability
description: MANDATORY when building or fixing any hero/banner where text sits on a photograph. The research-backed techniques for making every word readable on any image, on any screen, without killing the photo - and the verification steps (real screenshots at 390px and 1440px, both directions asserted). Born from the jus-tice.co.il daylight-hero build, 2026-07-16.
---

# Hero text over photos - readability law

A hero photo is worthless if the words on it can't be read, and a
readable hero is worthless if the photo dies under a heavy filter. These
are the techniques that satisfy both, ranked by reliability, with the
sources that back them.

## The technique ladder (pick the least destructive that works)

1. **Panel behind the text (the winner for busy photos).** A solid or
   near-solid rectangle under the text block. NN/g literally calls the
   mildly-transparent rectangle behind text "dead simple and very
   reliable" (Image-Focused Design: Is Bigger Better?, nngroup.com).
   The premium variant: frosted glass - `rgba(255,255,255,.86-.92)` +
   `backdrop-filter: blur(6-8px)` + hairline border + soft shadow.
   The photo stays 100% unfiltered around the panel; contrast inside the
   panel is guaranteed regardless of image content. This is what shipped
   on jus-tice.co.il (owner rejected gradients; photo untouched).
2. **Scrim / gradient overlay.** A dark or brand-tint layer (or a
   directional gradient scoped to the text side). Smashing Magazine's
   "Handling Text Over Images in CSS" and CSS-Tricks' "Design
   Considerations: Text on Images" both treat overlays as the standard
   fix. Cost: the whole photo dims. Use when the image itself is the
   mood and the text is short.
3. **Text shadow / soft glow.** Works for ONE short line (a title on a
   documentary photo), never for paragraphs. `text-shadow: 0 1px 3px
   rgba(0,0,0,.6)` class of fixes.
4. **Art-directed image.** Choose/crop the photo so the text zone lands
   on naturally quiet area (sky, sea, shadow), and bake a
   `center X%` object-position per breakpoint. Combine with 1-3.

## Hard rules

- **Contrast is measured, not felt**: body text on the panel needs
  WCAG AA 4.5:1 minimum (aim AAA 7:1 - navy #14213d on rgba-white
  passes AAA). wcag.com/designers documents why text-over-image is a
  chronic failure mode; never trust eyeballing a bright photo.
- **Mobile gets its own image**: a separate crop, sized for the
  viewport (jus-tice ships a 900w/151KB mobile variant vs 1920w
  desktop). Serving the desktop hero to phones costs LCP and usually
  breaks the text zone.
- **RTL is a first-class direction**: a gradient built for LTR
  (dark-left/text-right) lands BACKWARDS in Hebrew. Every directional
  technique is checked in the page's real direction. (This exact bug
  shipped once - owner caught "dark fonts on dark picture".)
- **License and credit**: a Commons/CC photo carries visible credit ON
  the page, and the credit MUST name the image actually displayed -
  swapping the photo without swapping the credit is a truth-gate
  violation (caught 2026-07-16: statue credit under a skyline photo).
- **No text baked into images.** Real HTML text only - SEO, i18n,
  zoom, screen readers.

## Verification (no claim without pixels)

1. Deploy, purge, fetch the RENDERED page fresh.
2. Headless screenshots at 390x844 and 1440x900 (file:// harness with
   localized CSS + images when the container blocks external loads).
3. LOOK at both screenshots: every word legible? panel intact? photo
   alive? credit visible and correct?
4. Assert both directions in the live CSS: new image URLs present, old
   technique's rules (gradients etc.) absent.

## Sources (fetched and applied 2026-07-16)

- nngroup.com - Image-Focused Design ("a mildly-transparent rectangle
  behind the text is dead simple and very reliable")
- smashingmagazine.com - Handling Text Over Images in CSS (overlay,
  gradient, blur/frost techniques with code)
- css-tricks.com - Design Considerations: Text on Images (scrims,
  panels, positioning)
- wcag.com/designers - contrast failure modes for text over imagery
- ishadeed.com - Handling Text Over Image (defensive CSS patterns)
- Law-firm daylight-skyline references: Miami video-hero firm,
  Atlanta skyline firm, Houston (Gaux), Dallas (Vela Wood drone),
  Albuquerque (Martone) - the genre norm is a bright city hero with a
  contained text block.
