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
