# Homepage Commercial Priority Map - 2026-05-18

## Why This Exists

The technical crawl blockers from the sampled audit are now cleared. The next traffic problem is signal distribution: the homepage currently renders the practice-area grid by term count, not by business priority, lead value, GSC opportunity, or lawyer monetization potential.

That means informational or historically large clusters can receive prominent homepage/internal-link weight even when the business needs qualified lawyer leads from commercial legal intent.

## Research Basis

- Google Search Central's SEO starter guidance says link text should tell users and Google something about the linked page, and site navigation should help users find important pages.
- Google's crawl-budget guidance says crawl demand is influenced by perceived site value and freshness; large sites should avoid wasting crawl attention on low-value URL exposure.
- Current large-site internal-linking best practice is to reserve global/homepage prominence for the most important commercial or pillar pages, then use contextual cluster links to support them.

Sources:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget
- https://www.ranktracker.com/blog/internal-linking-strategy-for-large-sites-100k-pages/

## Inputs Used

- `project-control/content-triage-2026-05-18.csv`
- `content-master/content-gap-map.csv`
- `reports/traffic-priority-audit-2026-05-18.csv`
- `front-page.php`
- `template-parts/sections/practice-areas-grid.php`
- Live read-only journey check: `tools/check-live-journeys.mjs`

## Current Homepage Finding

`template-parts/sections/practice-areas-grid.php` uses:

```php
'orderby' => 'count',
'order'   => 'DESC',
```

This is technically valid, but commercially weak. It rewards old content volume, not business priority.

## Recommended Homepage Priority Order

1. Family law and divorce
   - Why: strongest monetizable lawyer lead path now connected to Maya Rotenberg and already supported by many GSC-visible pages.
   - Primary hub: `/family-law/`
   - Support pages to connect: `/divorce-lawyer/`, `/free-divorce-agreement-template/`, `/divorce-costs-2025/`, `/child-custody/`, `/child-support/`
   - Safe next action: prepare homepage card copy and internal-link anchors; do not change taxonomy/public order until owner approves.

2. Medical malpractice
   - Why: recovered commercial route exists and P0 GSC rows show strong impressions around birth malpractice, medical experts, claim costs and examples.
   - Primary hub: `/medical-malpractice-lawyer/`
   - Support pages to connect: birth malpractice, cerebral palsy, anesthesia malpractice, medical expert list, claim example pages.
   - Safe next action: build a medical-malpractice pillar support map that links high-impression support pages back to the recovered hub.

3. Criminal law
   - Why: high GSC volume and already has a recovered stable hub, but some pages include risky "best/recommended" trust language and old broad informational intent.
   - Primary hub: `/criminal-defense-attorney/`
   - Support pages to connect: criminal certificate, police record deletion, DUI, police investigation, criminal lawyer cost.
   - Safe next action: rewrite trust-claim anchors and protect high-GSC pages before merging or pruning.

4. Real estate
   - Why: very high impressions and commercial lead value, but current top page copy includes trust-claim language such as "recommended" and "free consultation" that should be made factual.
   - Primary hub: `/real-estate-attorney/`
   - Support pages to connect: buying/selling apartment, real-estate prices, contract pages, cost pages.
   - Safe next action: rewrite trust-claim posture and decide whether `/real-estate-attorney/` or another canonical hub should be the homepage target.

5. Traffic law
   - Why: smaller than family/criminal/real-estate but has clear urgent commercial intent and easy lead-routing fit.
   - Primary hub: `/traffic-lawyer/`
   - Safe next action: audit support links from Marvad/license/drunk-driving pages into the hub.

6. Employment law
   - Why: meaningful P0 volume and practical lead intent, but should not outrank family/medical/criminal on the homepage until lawyer supply and lead monetization are confirmed.
   - Safe next action: cluster review before homepage promotion.

7. Inheritance and wills
   - Why: commercial intent exists, but many pages require source/legal review and careful document/media boundaries.
   - Safe next action: preserve as secondary homepage/navigation item until source-safe content package is approved.

8. Personal injury
   - Why: related to medical malpractice and damages, but current canonical strategy still needs cleanup.
   - Safe next action: map injury pages either to personal-injury hub or medical-malpractice hub before homepage prominence.

9. Portugal / foreign citizenship / relocation / USA / general country pages
   - Why: some have GSC volume, but they do not match the immediate lawyer-subscription goal as strongly as Israeli legal lead categories.
   - Safe next action: keep discoverable via sitemap/articles, but do not place above core Israeli legal money categories.

10. Broad informational/non-legal topics
   - Why: examples include website builders, general courts, broad country pages and other pages that may attract traffic but not lawyer payments.
   - Safe next action: classify and decide whether to preserve, de-emphasize, merge, or noindex after owner approval.

## Proposed Homepage Rule

Homepage practice-area cards should eventually use a controlled priority list rather than term count:

1. Owner-approved business priority.
2. Active lawyer supply and lead-routing availability.
3. GSC commercial opportunity.
4. Existing pillar health and crawlability.
5. Support-cluster quality.
6. Term count only as a fallback.

## Immediate Non-Public Next Actions

1. Create exact homepage card copy for the first five categories with factual, non-fake claims.
2. Build support-to-hub internal-link maps for family law and medical malpractice.
3. Review trust-claim rows before any homepage card says "best", "recommended", "leading", or "free consultation".
4. After owner approval, implement a small theme change that sorts homepage practice cards by a controlled priority list and verify live with user, lawyer, Googlebot and AI-bot journeys.

## Verification This Cycle

- `tools/check-live-journeys.mjs` passed live public user journey, lawyer registration journey, sitemap index and robots checks.
- This artifact is repo-only and does not change the public homepage yet.

## Safety

No public CMS/database row, homepage template, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
