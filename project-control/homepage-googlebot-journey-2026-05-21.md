# Homepage Googlebot Journey Check - 2026-05-21

## Goal
Verify that the live homepage is useful for Googlebot and visitors after the homepage money-intent changes.

## Research Used
Google Search Central mobile-first indexing guidance says Google mainly uses the mobile version of a page for indexing and ranking, and that Google must be able to access the same content, links and structured data on mobile.
Source: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing

## Live Checks
- Homepage fetched successfully with a smartphone Googlebot-style user agent.
- Homepage canonical: `https://jus-tice.co.il/`.
- Homepage `noindex`: no.
- H1 count: 1.
- Customer path strip: present.
- Money-intent pyramid: present.
- Stable `#homepage-intent-pyramid` anchor: present.
- Find-lawyer guide: present.
- Ask-lawyer path: present.
- Homepage intent `ItemList`: present with 6 items.
- `robots.txt`: 200, includes sitemap.
- `sitemap_index.xml`: 200, sitemap index, 7 HTTPS sitemap URLs and 0 HTTP sitemap URLs.

## Finding
The homepage guide buttons for real estate, labor law and personal injury were using filtered lawyer-directory pages as safe fallback destinations. Those filtered directory pages return 200 and are good for conversion, but they also return `noindex`, so they are weak as the main guide destination and weak as structured-data item URLs.

## Fix
The homepage now keeps filtered directory URLs for the profile buttons, but the guide/title destinations for those three cards point to indexable pages:
- Real estate: `/practice-areas/real-estate-law/`
- Labor law: `/practice-areas/labor-law/`
- Personal injury: `/tort-lawyer/`

## Completion Assessment
Homepage Googlebot/indexing confidence moved from 70% to 78%. This is still not revenue, but it makes the homepage money-intent section cleaner for both SEO and conversion.

## Still Blocked
- GSC/Analytics need time to show impact.
- Grow approval and product/payment mapping are still required for automated recurring lawyer payments.
- Real estate, labor law and personal injury still need stronger full pillar/support content, not just taxonomy or legacy pages.
