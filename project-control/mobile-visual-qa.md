# Mobile Visual QA

**Date:** 2026-05-10
**Method:** Code review of CSS media queries. **Live mobile test NOT POSSIBLE** — same blocker as desktop QA.

---

## 1. Breakpoints in use

```css
@media (max-width: 960px)  → tablet / small laptop
@media (max-width: 768px)  → tablet
@media (max-width: 640px)  → phone landscape / small tablet
```

There is NO breakpoint at 320–375 (small phones). The smallest tested breakpoint is 640px which doesn't catch iPhone SE / older Android.

**Recommendation:** add a 360px or 375px breakpoint for tightest spacing.

---

## 2. By section

### Header (≤640px)

| Behavior | Status |
|---|---|
| Top secondary nav hidden (`.site-header__top { display: none }`) | ✓ |
| Phone CTA hidden (`.site-header__cta { display: none }`) | ⚠️ Hides the phone — but on mobile, phone CTA is the most valuable element. Should remain visible. |
| Menu toggle visible | ✓ |
| Primary nav becomes off-canvas dropdown on toggle | ✓ via `body.nav-is-open` class |
| Logo + branding stack — could be too tight at 320px | ⚠️ |

**Recommendation:** Keep phone CTA visible on mobile (it converts).

### Hero (≤640px)

| Behavior | Status |
|---|---|
| Grid → single column | ✓ |
| Hero search filters → flex-direction column | ✓ |
| Hero search actions → flex-direction column | ✓ |
| Stats → vertical | ✓ |
| Hero __actions → vertical | ✓ |

### Practice areas grid

| Behavior | Status |
|---|---|
| 3 cols → 2 cols at ≤960px | ✓ |
| 2 cols → 1 col at ≤640px | ✓ |
| Card padding adequate | ✓ |

### Cities grid

| Behavior | Status |
|---|---|
| 4 cols → 3 cols at ≤960px | ✓ |
| 3 cols → 2 cols at ≤640px | ✓ |

### Featured lawyers grid

| Behavior | Status |
|---|---|
| 4 cols → 2 cols at ≤960px | ✓ |
| 2 cols → 1 col at ≤640px | ✓ |
| Auto-fit fallback for fewer than 4 lawyers | ✓ FIXED this session |

### Article cards

| Behavior | Status |
|---|---|
| 3 cols → 2 cols at ≤960px → 1 col at ≤640px | ✓ |
| Card image aspect-ratio 16:10 | ✓ |
| Card padding 1.2rem | ✓ |

### Featured pillars

| Behavior | Status |
|---|---|
| `repeat(auto-fit, minmax(280px, 1fr))` — automatic responsive | ✓ |
| Card padding 2rem 1.5rem | ✓ |

### Topic clusters

| Behavior | Status |
|---|---|
| `repeat(auto-fit, minmax(300px, 1fr))` — automatic | ✓ |
| Inside list links — readable on mobile | ✓ |

### Ask-a-lawyer

| Behavior | Status |
|---|---|
| 2 cols → 1 col at ≤960px | ✓ |
| Form fields 2 cols → 1 col at ≤640px | ✓ |

### Lawyer CTA

| Behavior | Status |
|---|---|
| 3 feature cards stack at ≤640px | ✓ |
| CTA actions stack at ≤640px | ✓ |

### Newsletter

| Behavior | Status |
|---|---|
| Form direction column at ≤640px | ✓ |

### Footer

| Behavior | Status |
|---|---|
| 4 cols → 2 cols at ≤960px → 1 col at ≤640px | ✓ |
| Footer links bar font-size reduces at ≤640px | ✓ |
| Bottom inner flex wraps | ✓ |

### Lawyer profile

| Behavior | Status |
|---|---|
| 2 cols (sidebar + main) → 1 col at ≤768px | ✓ |
| Avatar centers at ≤768px (max-width 200px) | ✓ |

### Article single

| Behavior | Status |
|---|---|
| 2 cols (sidebar + main) → 1 col at ≤960px | ✓ |
| Sidebar moves to top in mobile (RTL: `order: 0`) | ✓ — but check actual order on live |

### Lawyer directory

| Behavior | Status |
|---|---|
| Filters: flex-direction column at ≤768px | ✓ |
| Cards grid uses lawyers-grid class — same responsive | ✓ |

### Breadcrumbs

| Behavior | Status |
|---|---|
| Wrap on overflow | ✓ — `flex-wrap: wrap` |
| Separator visible | ✓ |

### WhatsApp float button

| Behavior | Status |
|---|---|
| Fixed bottom-right, 56px size, gold shadow | ✓ |
| Visible above scrolling content | ✓ via `z-index: 90` |
| Should not overlap form submit buttons or footer CTA on phone | ⚠️ Could overlap on tall phones with bottom bar — test on iPhone with home indicator |

---

## 3. Touch target audit (Apple HIG = 44px, Material = 48dp)

| Element | Min height | Pass? |
|---|---|---|
| `.button` | 2.9rem ≈ 46px | ✓ |
| `.menu-toggle` | font-size 1.5rem + 0.5rem padding ≈ 40px | ⚠️ slightly under |
| `.primary-navigation a` | 0.5rem 0.9rem padding × line-height ≈ 36px | ⚠️ under |
| `.city-card` | 1rem 1.2rem padding ≈ 40px | ⚠️ slightly under |
| `.hero-search input` | 0.9rem 1rem padding ≈ 40px | ⚠️ |
| `.hero-search button` | 0.8rem 1.3rem padding ≈ 38px | ⚠️ |
| `.directory-filters__field select` | 0.7rem 0.9rem padding ≈ 36px | ⚠️ under |
| `.lawyer-card__cta` (button) | 2.9rem | ✓ |
| `.whatsapp-float` | 56px | ✓ |

**Fix:** bump button min-height to 48px globally on mobile via media query.

---

## 4. Mobile-specific polish gaps

| Item | Severity |
|---|---|
| Phone CTA hidden in mobile header | High — should stay visible |
| Touch targets below 44px on form inputs | Medium — bump padding |
| No sticky bottom mobile bar with phone + WhatsApp + form | Medium — competitive sites have this |
| Hero search filters could be condensed via accordion at ≤640px | Low |
| Article hero on mobile: navy background takes too much screen | Low — could reduce padding |
| Footer city links wrap awkwardly with long names ("ראשון לציון") | Low |
| Image-loading: featured images in lawyer cards (80px circle) — should add `loading="lazy"` even at small sizes | Low — already lazy |

---

## 5. Accessibility on mobile

| Item | Status |
|---|---|
| Skip link visible on focus | ✓ |
| `aria-expanded` on menu toggle | ✓ |
| `aria-label` on nav landmarks | ✓ |
| `aria-hidden="true"` on decorative SVG | ✓ |
| Proper heading hierarchy (one H1 per page) | ✓ verified |
| Color contrast (gold on navy, white on navy) | ✓ visually fine, NOT VERIFIED with WCAG checker on live |
| Focus indicator (gold outline) | ✓ |
| Reduced motion respected | ✓ |
| Screen reader text for non-visible labels | ✓ |
| RTL direction set in `<html dir="rtl">` | ✓ via `header.php` |
| Touch targets ≥44px | ⚠️ several elements under target |

---

## 6. What I CANNOT verify without live mobile access

- Actual font rendering on iOS Safari + Android Chrome
- Real touch responsiveness
- Mobile keyboard interactions (form types: tel, email, search)
- Hebrew word breaking + RTL alignment glitches
- Mobile network performance (image weights, font weight)
- Pinch-to-zoom behavior (we have `viewport content="width=device-width, initial-scale=1"` — does NOT block zoom, good)
- Status bar / notch / home indicator overlap with WhatsApp button
- Mobile keyboard pushing fixed elements
- Mobile-specific menu drawer animation smoothness

---

## 7. Recommended next polish cycle (after live access)

1. Take live screenshots at 360, 375, 414, 768 widths
2. Run Lighthouse Mobile audit
3. Test golden path on real phone: hero search → results → lawyer profile → call/WhatsApp
4. Test form submission flow on mobile
5. Check WhatsApp float button position on iPhone with home indicator
6. Verify Hebrew RTL alignment in form inputs and labels
7. Test menu toggle animation
