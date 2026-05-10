# Mobile First Template Review

Date: 2026-05-10  
Status: REVIEW PLAN - no code changes executed

## Principle

Mobile is not a secondary polish pass. For Google and for users, mobile must contain the same important content, headings, links, structured data and metadata as desktop.

## Templates To Review

| Template | SEO role | Mobile risk | Status |
|---|---|---|---|
| Homepage | entity/hub page | hidden pillar links or weak hero CTA | NEEDS VISUAL RECHECK |
| Article page | long-form SEO content | overwhelming related blocks, CTA overlap, poor heading rhythm | NEEDS VISUAL RECHECK |
| Practice/category page | hub/pillar discovery | thin archive layout, no related lawyers/articles | NEEDS DESIGN REVIEW |
| Lawyer directory | broad lawyer intent | filters too low/hidden, cards too tall, fake-data risk | NEEDS LIVE REVIEW |
| Lawyer profile | mini-site/lead conversion | contact actions not sticky enough or too intrusive | NEEDS LIVE REVIEW |
| Search page | discovery | English labels and weak no-results UX | PARTIAL FIX IN REPO |
| 404 page | recovery | English copy risk, missing useful links | NEEDS REVIEW |
| Footer | crawl/navigation | too dense or hidden links | NEEDS MOBILE QA |

## Mobile Requirements

- no horizontal overflow.
- readable Hebrew body text.
- clear H1/H2 hierarchy.
- tappable CTAs.
- visible logo.
- favicon/app icon verified for mobile bookmark/search-branding readiness.
- crawlable internal links in `<a href>`.
- forms with labels.
- related content limited and relevant.
- images have width/height or stable aspect ratios.
- no layout shift from cards/placeholders.
- no primary content loaded only after user interaction.

## Source-Based Notes

Google mobile-first guidance emphasizes equivalent desktop/mobile content, headings, structured data and metadata. It also warns against lazy-loading primary content only after user interaction.

## Next Action

Run visual/mobile screenshots for:
1. `/`
2. `/articles/`
3. one article page
4. one category/practice page
5. `/lawyers/`
6. one lawyer profile
7. search results
8. 404 page

Then update this file with LIVE VERIFIED / VISUAL VERIFIED statuses.

## 2026-05-10 Mobile Visual Findings

Evidence:
- `project-control/visual-evidence/integrated-home-mobile-2026-05-10.png`
- `project-control/visual-evidence/integrated-articles-mobile-2026-05-10.png`
- `project-control/visual-evidence/integrated-article-rabbinical-agreement-mobile-2026-05-10.png`
- `project-control/visual-evidence/integrated-lawyers-mobile-2026-05-10.png`
- `project-control/visual-evidence/integrated-practice-family-mobile-2026-05-10.png`
- `project-control/visual-evidence/integrated-search-divorce-mobile-2026-05-10.png`
- `project-control/visual-evidence/integrated-not-found-mobile-2026-05-10.png`

VISUAL VERIFIED:
- Homepage mobile has a visible logo, hamburger, topic strip, hero visual, H1 and lead CTA.
- Articles archive mobile has breadcrumbs, strong Hebrew page heading and visible category/list entry.
- Article sample mobile has breadcrumbs, H1 and readable first content cards.
- Lawyer directory mobile loads with breadcrumbs and search/filter controls.

NOT CUSTOMER-READY:
- Sticky WhatsApp/lead CTA overlaps lower first-viewport content on article/search/practice views.
- Accessibility floating button overlaps important content on several mobile views.
- Search mobile form looks unstyled/native and weak compared with the rest of the design.
- Sample lawyer profile mobile does not render a mini-site; it shows homepage content instead.
- 404 mobile test shows homepage content instead of a proper recovery page.
- Practice page mobile first viewport is dense and visually fragile; it needs a tighter mobile layout pass.

CODE FIXED / NOT LIVE VERIFIED:
- Archive/search document titles were fixed in `inc/seo.php` after this visual pass, but live output requires deployment/cache refresh.

Next action:
- Fix mobile overlay spacing and verify hamburger menu contents.
- Recheck 404 and lawyer profile routing after latest deployment.

## 2026-05-10 Logo/Favicon Mobile Requirement

- CODE FIXED: 180, 192 and 512 square app-icon fallback assets now exist under `assets/images/`.
- CODE FIXED: WordPress Site Icon remains preferred; theme fallback only runs when no Site Icon exists.
- NOT LIVE VERIFIED: mobile browser tab/bookmark icon after deploying `2026-05-10-branding-v1`.
- NEXT: after uPress pull/cache clear, recheck mobile header logo scale, footer brand, browser tab icon and add-to-home-screen icon if available.
