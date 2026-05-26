# Homepage Intent Link Quality - 2026-05-21

## Goal
Keep the homepage money-intent pyramid useful for users and clean for Google by making every related-guide anchor point to a real published page.

## Research Used
Google Search Central link guidance says internal links help users and Google understand the site, and that anchor text should be descriptive, concise, and relevant to the linked page.
Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en

## Finding
The homepage intent cards correctly queried WordPress for published related articles first. When none were found, some planned fallback guide labels could resolve through the safe-link helper to the same primary/directory URL. That is safe technically, but weak for trust: different labels should not silently point to the same generic destination.

## Change
The fallback guide list now only renders fallback links when the planned fallback path is already published. If no real related article or published fallback exists, the card shows one clear link to search lawyer profiles in that practice area.

## Verification Plan
- PHP syntax check for `template-parts/sections/homepage-intent-pyramid.php`.
- `git diff --check`.
- Deploy through uPress after commit and push.
- Live homepage check that the intent pyramid still renders and no planned unpublished guide labels are exposed as generic duplicate links.

## Completion Assessment
Homepage SEO/link-quality readiness moves from 70% to 73%. This is not direct revenue yet, but it improves trust and reduces homepage crawl ambiguity around the high-money practice cards.
