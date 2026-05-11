# Homepage Visual Assets Registry
**Last updated:** 2026-05-11

## Image Assets

| Asset | Section | File Path | CMS? | Alt Text | Mobile Risk | Status |
|-------|---------|-----------|------|----------|-------------|--------|
| Hero background | Hero | `assets/images/hero-bg.png` | No (theme fallback) | Legal consultation office | Medium (668KB) | ✅ Live |
| Logo wordmark | Header | `assets/images/logo.png` | Yes (Customizer override) | Jus-Tice logo | None (80KB) | ✅ Live |
| Favicon | Browser tab | `assets/images/favicon.png` | Yes (Customizer override) | — | None (389KB, needs optimization) | ✅ Live |
| Guide hero | Find Lawyer Guide | `assets/images/guide-hero.png` | No (not yet used in template) | Person researching legal info | Medium | ⚠️ Generated, not wired |
| OG share image | Meta/Social | `assets/images/og-default.png` | No (theme fallback in seo.php) | Jus-Tice brand card | None | ✅ Live via og:image |

## SVG Assets (Zero Performance Cost)

| Asset | Section | Source | CMS? | Status |
|-------|---------|--------|------|--------|
| 12 practice area icons | Practice Areas Grid | `inc/practice-area-icons.php` | Slug-mapped | ✅ Live |
| 6 guide step icons | Find Lawyer Guide | Inline SVG in template | No | ✅ Live |
| Fallback card icon | Practice Area Card | Inline SVG | No | ✅ Live |

## CSS Visual Assets (No File Weight)

| Visual | Section | Method | Status |
|--------|---------|--------|--------|
| CTA dot pattern | CTA Section | CSS radial-gradient | ✅ Live |
| Hero overlay | Hero | CSS linear-gradient over image | ✅ Live |
| Trust section bg | Trust | CSS linear-gradient | ✅ Live |
| Red dot pulse | Logo / Eyebrows | CSS @keyframes | ✅ Live |
| Card color borders | Practice Areas | CSS data-attribute selectors | ✅ Live |

## Missing / Needed Assets

| Need | Section | Priority | Notes |
|------|---------|----------|-------|
| Article card thumbnails | Latest Articles | Medium | Depends on post featured images in CMS |
| Lawyer profile photos | Featured Lawyers | High | Depends on real lawyer onboarding |
| Ask-lawyer section visual | Ask Lawyer | Low | Could use CSS illustration or subtle bg |
| Footer brand visual | Footer | Low | Logo is sufficient |
| ~~OG image for sharing~~ | ~~Meta~~ | ~~Done~~ | ✅ Created and wired in seo.php |

## Performance Notes

- Hero image: 668KB PNG — should be converted to WebP (est. ~150KB)
- Favicon: 389KB PNG — oversized for icon, should be resized to 180x180 max
- All SVG icons: inline, zero HTTP requests
- All CSS visuals: zero HTTP requests
- Lazy loading: images below fold should use `loading="lazy"`
- No animation libraries loaded — pure CSS animations only

## Optimization TODO

1. Convert hero-bg.png → WebP (saves ~500KB)
2. Resize favicon.png to 180x180px (saves ~350KB)
3. Add `loading="lazy"` to all below-fold images
4. Add explicit `width`/`height` to prevent CLS
5. Generate OG share image (1200x630)
