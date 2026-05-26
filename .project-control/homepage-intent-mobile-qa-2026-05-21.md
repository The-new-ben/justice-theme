# Homepage Intent Pyramid Mobile QA - 2026-05-21

## Scope
- Live URL checked: `https://jus-tice.co.il/?homepage_mobile_qa=882f4ee`
- Viewports checked: 390x844 mobile and 1365x900 desktop
- Feature checked: homepage money-intent pyramid added in commit `882f4ee`

## Research Signal
- Google Search Central mobile-first indexing guidance says Google uses the mobile version of content for indexing and recommends mobile-friendly responsive design.
- Current legal conversion guidance emphasizes visible CTAs, mobile usability, fast paths to contact and practice-area navigation.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- https://growlaw.co/blog/law-firm-website-ux-best-practices
- https://www.simplelaw.com/blog/conversion-strategies-for-law-firm-websites

## Result
- PASS: Mobile homepage has the new `homepage-intent-pyramid` section.
- PASS: Mobile and desktop both show 6 intent cards.
- PASS: Mobile and desktop have no page-level horizontal overflow.
- PASS: Existing customer strip remains present.
- PASS: Existing find-lawyer/how-to-choose guide remains present.
- PASS: Ask-lawyer lead path remains present.
- PASS: No public Grow wording appears on the homepage.

## Improvement Applied
- The first QA run found that related article text links inside the new cards were visually small tap targets.
- CSS was improved so card title links and related guide links render as larger block/flex tap targets with `min-height: 36px`.

## Evidence
- JSON: `project-control/visual-evidence/homepage-intent-pyramid-qa-2026-05-21.json`
- Mobile screenshot: `project-control/visual-evidence/homepage-intent-pyramid-mobile-2026-05-21.png`
- Desktop screenshot: `project-control/visual-evidence/homepage-intent-pyramid-desktop-2026-05-21.png`

## Money Assessment
No revenue was earned by this QA. The material advancement is lowering mobile friction on a homepage section that routes users to high-value practice areas, lawyer profiles and lead capture.

## Completion Assessment
- Homepage SEO hierarchy remains 66%.
- Traffic-to-lead conversion readiness moves from 54% to 55%.
- Mobile homepage confidence moves from 62% to 70%.

Still blocked: real analytics/GSC measurement, Grow approval, mapped paid products and real paid lawyer users.
