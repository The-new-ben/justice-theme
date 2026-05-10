# Visual QA Report — Desktop

**Date:** 2026-05-10
**Method:** Code review of templates + CSS. **Live visual test NOT POSSIBLE without browser access to live URL.** Where I write "should look like X" it's based on the CSS rules; the actual rendered output on jus-tice.co.il has NOT been visually inspected.

---

## 1. What I checked

| Area | Files reviewed |
|---|---|
| Header | `header.php`, `template-parts/layout/site-header.php`, CSS lines for `.site-header*` |
| Hero | `template-parts/sections/hero.php`, CSS for `.hero*` |
| Practice areas grid | `template-parts/sections/practice-areas-grid.php`, `template-parts/cards/practice-area-card.php`, CSS for `.practice-area-card*` |
| Cities grid | `template-parts/sections/cities-grid.php`, CSS for `.cities-grid*`, `.city-card*` |
| Featured lawyers | `template-parts/sections/featured-lawyers.php`, `template-parts/cards/lawyer-card.php`, CSS for `.lawyer-card*`, `.lawyers-grid` |
| Latest articles | `template-parts/sections/latest-articles.php`, `template-parts/cards/article-card.php`, CSS for `.article-card*`, `.article-grid*` |
| Featured pillars | `template-parts/sections/featured-pillars.php`, CSS for `.pillar-card*` |
| Topic clusters | `template-parts/sections/topic-clusters.php`, CSS for `.cluster-card*` |
| Ask-a-lawyer | `template-parts/sections/ask-lawyer.php`, CSS for `.ask-lawyer*` |
| Trust section | `template-parts/sections/trust-section.php`, CSS for `.trust-section*` |
| Lawyer CTA | `template-parts/sections/lawyer-cta.php`, CSS for `.lawyer-cta*` |
| Newsletter | `template-parts/sections/newsletter.php`, CSS for `.newsletter*` |
| CTA section | `template-parts/sections/cta-section.php`, CSS for `.cta-section*` |
| Footer | `template-parts/layout/site-footer.php`, CSS for `.site-footer*`, `.footer-links*` |
| Article single | `single-articles.php`, CSS for `.single-article*`, `.entry-content*`, `.editorial-note*` |
| Lawyer profile single | `single-justice_lawyer.php`, CSS for `.lawyer-profile*` |
| Lawyer directory archive | `archive-justice_lawyer.php`, CSS for `.lawyer-directory*`, `.directory-filters*` |
| Article archive | `archive-articles.php`, CSS for `.archive-*` |
| Practice-areas taxonomy | `taxonomy-practice-areas.php`, CSS for `.taxonomy-*` |
| Search results | `search.php`, CSS for `.search-header*` |
| 404 | `404.php`, CSS for `.error-404*` |
| Breadcrumbs | `inc/breadcrumbs.php`, CSS for `.breadcrumbs*` |

---

## 2. Findings — what looks weak

### 2.1 Header

| Issue | Severity | Status |
|---|---|---|
| Logo: no logo currently set on live (`has_custom_logo()` false → text fallback) | High | Owner action — upload logo. Theme supports SVG/PNG up to 80px tall, 260px wide |
| Logo: no recommended dimensions in admin UI | Low | Could add admin notice on Customizer > Header |
| Site header top trust line is hardcoded text — boring | Low | Could rotate based on page type |
| Mobile menu toggle uses ☰ unicode character (`\2630`) — looks generic | Low | Replace with SVG hamburger icon |
| Phone CTA in header ("03-6161535" default) doesn't match site WhatsApp ("0544705733") | Low | Owner: confirm intended phone in Customizer |

### 2.2 Hero

| Issue | Severity | Status |
|---|---|---|
| Hero search "city" dropdown is hardcoded list, NOT pulled from `city` taxonomy | Medium | Should query terms once they exist on live |
| Hero stats default: when no articles exist, shows "0 מאמרים משפטיים" | Low | OK — honest signal that content is being built |
| Hero panel "תחומי משפט נפוצים" only shows 8 terms; current site has 0 published terms (live) → empty panel | High | Owner action — create taxonomy terms |
| H1 font scales correctly via clamp(); good | n/a | ✓ |

### 2.3 Practice areas grid

| Issue | Severity | Status |
|---|---|---|
| Every term gets identical "§" icon | Medium | Each term should have unique icon (custom field on taxonomy) |
| Empty state when no terms: section renders header + empty grid | Low | Section should `return` early if no terms (it does — line 19) |
| Card description trimmed at 22 words; if term has no description, no description shown — OK | n/a | ✓ |

### 2.4 Cities grid

| Issue | Severity | Status |
|---|---|---|
| 12 cities hardcoded; 4th source of truth (also in hero, footer, plugin) | Medium | Unify into `city` taxonomy |
| `←` arrow uses unicode | Low | OK as-is for now |
| All city cards link to `/lawyers/?city=slug` — works, will be empty until lawyers exist | n/a | Honest |

### 2.5 Featured lawyers

| Issue | Severity | Status |
|---|---|---|
| Default 4-column grid breaks visually with 1–3 lawyers (huge gaps) | High | FIXED via auto-fit min 220px |
| Empty state SVG (person icon) is fine, copy is honest | n/a | ✓ |
| When lawyers exist but none have `featured_until >= today`, falls into empty state | Medium | Needs admin awareness — featured spots require setting the date |

### 2.6 Latest articles

| Issue | Severity | Status |
|---|---|---|
| Returns early if no articles (good) | n/a | ✓ |
| 3-column grid → 2 → 1 responsive, OK | n/a | ✓ |
| Article cards use placeholder gradient when no thumbnail — looks decent but generic | Low | Owner: add featured images to all articles |

### 2.7 Featured pillars

| Issue | Severity | Status |
|---|---|---|
| 6 pillar cards — well-designed with consistent SVG icons | n/a | ✓ |
| Cards link to either taxonomy term link OR directory fallback | n/a | ✓ FIXED |
| Auto-fit grid `repeat(auto-fit, minmax(280px, 1fr))` handles all widths | n/a | ✓ |
| Hover state: lift + gradient background — premium feel | n/a | ✓ |

### 2.8 Topic clusters

| Issue | Severity | Status |
|---|---|---|
| 4 cluster cards — fine | n/a | ✓ |
| Inside each card: 4 article links — empty state shown when no articles | n/a | ✓ |
| Cluster title border-bottom in gold — nice accent | n/a | ✓ |

### 2.9 Ask-a-lawyer

| Issue | Severity | Status |
|---|---|---|
| Form action FIXED → posts to admin-post.php | n/a | ✓ |
| Success/missing notice | n/a | ✓ added CSS this session |
| 2-column layout on desktop (content + form) | n/a | ✓ |

### 2.10 Trust section

| Issue | Severity | Status |
|---|---|---|
| FIXED: removed fake "10+ years" | n/a | ✓ |
| Conditional render if all stats zero | n/a | ✓ |
| Numbers glow with subtle text-shadow gold | n/a | ✓ premium feel |

### 2.11 Lawyer CTA (B2B)

| Issue | Severity | Status |
|---|---|---|
| FIXED: emojis → SVGs | n/a | ✓ |
| 3 feature cards in grid | n/a | ✓ |
| Links to `/lawyer-registration/` and `/lawyer-plans/` — pages don't exist | High | Owner action — create pages |

### 2.12 Newsletter

| Issue | Severity | Status |
|---|---|---|
| Form not wired to anything | Critical | NOT FIXED — needs Mailchimp/SendinBlue or simple subscriber CPT |
| Visual layout OK | n/a | ✓ |

### 2.13 CTA section (homepage bottom)

| Issue | Severity | Status |
|---|---|---|
| Centered, gradient bg, dual buttons | n/a | ✓ premium feel |

### 2.14 Footer

| Issue | Severity | Status |
|---|---|---|
| Dense links bar (practice areas + cities) | n/a | ✓ Justia/din.co.il pattern |
| 4-column main grid | n/a | ✓ |
| Two menu locations (legal_areas, footer_trust) — empty unless menus assigned | High | Owner action — assign menus |
| WhatsApp float button bottom-right | n/a | ✓ Israeli UX pattern |
| Disclaimer text bottom — short and clear | n/a | ✓ YMYL appropriate |

### 2.15 Breadcrumbs

| Issue | Severity | Status |
|---|---|---|
| Background was cream — looked too soft | Medium | FIXED — now white with bottom border for sharpness |
| Separator was `›` — felt heavy | Low | FIXED — now `‹` (arrow ish, RTL appropriate, lighter) |
| Spacing was tight | Low | FIXED — added padding, gap |
| Active item not visually distinct | Low | FIXED — bold + dark color for current |

### 2.16 Article single

| Issue | Severity | Status |
|---|---|---|
| Hero header with dark navy bg + gold accent term | n/a | ✓ premium |
| Sidebar sticky CTA box | n/a | ✓ |
| Editorial note disclaimer | n/a | ✓ YMYL signal |
| H2 underline accent | n/a | ✓ |
| No author/reviewer byline | High (E-E-A-T) | NOT FIXED — needs editorial decision |

### 2.17 Lawyer profile single

| Issue | Severity | Status |
|---|---|---|
| 2-column grid (sidebar + main) | n/a | ✓ |
| Photo area 1:1 aspect, placeholder uses initials (mb_substr) | n/a | ✓ |
| Contact card with phone CTA + WhatsApp + email + website + address | n/a | ✓ |
| Quick stats: years experience + Bar # | n/a | ✓ |
| Practice area tags as pills | n/a | ✓ |
| Details table (location, languages, license, verified) | n/a | ✓ |
| Inquiry form conditional on `lead_routing_enabled` | n/a | ✓ |
| Schema.org Attorney emitted | n/a | ✓ ADDED this session |
| View counter excludes bots/admins/feeds | n/a | ✓ FIXED this session |
| No "share profile" buttons | Low | Could add |
| No "report incorrect info" link | Medium | Required for compliance |

### 2.18 Lawyer directory archive

| Issue | Severity | Status |
|---|---|---|
| Filter bar with area + city + keyword | n/a | ✓ |
| Empty state with B2B CTA | n/a | ✓ |
| Pagination with Hebrew arrows | n/a | ✓ |
| Removed orphan `</main>` | n/a | ✓ FIXED this session |

### 2.19 Article archive

| Issue | Severity | Status |
|---|---|---|
| 2-column with sidebar (term list) + grid | n/a | ✓ |
| Hebrew pagination | n/a | ✓ |
| Sidebar empty if no terms | Low | Acceptable |

### 2.20 Practice-areas taxonomy archive

| Issue | Severity | Status |
|---|---|---|
| Header with eyebrow + H1 + description + CTA | n/a | ✓ |
| Articles in grid | n/a | ✓ |
| No lawyer carousel here yet (would be premium addition) | Medium | TODO |
| Description from term shown via wpautop | n/a | ✓ |

---

## 3. Premium polish features confirmed

| Feature | File / CSS |
|---|---|
| Heebo font from Google | `inc/enqueue.php` |
| Navy/gold/cream palette | `:root` in `main.css` |
| Custom property scale for shadows, radii | `:root` |
| Section fade-in animation on scroll | `main.css` `@keyframes fadeInUp` |
| Reduced-motion media query honored | `main.css` |
| Hover micro-animations on cards | `main.css` |
| Focus-visible gold ring | `main.css`, `accessibility.css` |
| WhatsApp float button | `site-footer.php`, `main.css` |
| H2 gold underline accent | `main.css` `.entry-content h2::after` |
| Article media gradient overlay on hover | `main.css` |

---

## 4. Open visual gaps (priority order)

1. **No logo on live** — owner uploads to Customizer
2. **No menus assigned to footer locations** — owner assigns in Appearance > Menus
3. **No taxonomy terms on live** — owner creates via WP Admin
4. **No lawyer profiles on live** (NOT VERIFIED) — owner creates or seeds
5. **No author byline on articles** — needs editorial decision
6. **Newsletter form not wired** — needs integration
7. **`/lawyer-registration/` page doesn't exist** — owner creates
8. **`/lawyer-plans/` page doesn't exist** — owner creates
9. **Per-term icon system** — practice-area cards all show `§`
10. **Lawyer profile "report incorrect info" link** — compliance gap
11. **Empty `components.css` and tiny `accessibility.css`** — either populate or remove from enqueue

---

## 5. What I CANNOT verify without live access

- Real loading speed
- Real fonts loading correctly (Hebrew rendering)
- Real visual stacking of sections
- Real responsive behavior at 320px / 375px / 414px / 768px
- Console errors
- Network errors (404 assets, missing images)
- Real cross-browser (Safari iOS especially)
- Live screenshots
- Lighthouse score
- Core Web Vitals

These all require browser access to https://jus-tice.co.il — BLOCKED until that's available.
