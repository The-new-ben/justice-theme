# Money-Query Post-Edit Verification - 2026-05-19

Branch: `codex/money-query-seo-batch-001`  
Applies to: PR #9 / Linear HAD-65  
Status: execution checklist, no live CMS edits yet

## Objective

After owner/legal approval, the five Batch 001 pages can receive title, H1 and intro edits in WordPress. This checklist prevents a common SEO failure: making edits, then not proving Googlebot can still crawl the page or that the new title/H1 actually rendered.

## Research Used

- Google Search Console URL Inspection guidance: after changing an owned URL, use URL Inspection to test the live URL and request indexing when appropriate.
- Google recrawl guidance: recently changed pages can be submitted for re-indexing, and the operator must be an owner or full user of the Search Console property.
- Google title-link guidance: titles should be descriptive, concise, page-specific and aligned with prominent page text.

## Pages In Batch

| URL | Current PR #9 status |
|---|---|
| `/real-estate-attorney/` | Ready for owner/legal approval |
| `/criminal-defense-attorney/` | Ready, but fix/check double-H1 risk |
| `/sex-crime-lawyer/` | Ready, but needs sensitive YMYL tone review |
| `/prenup-attorney/` | Ready, should align with family-law authority after PR #8 |
| `/traffic-lawyer/` | Ready, but also needs paid-lawyer supply coverage |

## Before Editing

1. Confirm PR #8 authority path status.
2. Confirm owner/legal approval for exact title/H1/intro text.
3. Keep URLs unchanged.
4. Keep canonicals unchanged.
5. Keep sitemap/noindex settings unchanged.
6. Save the latest snapshot:
   - run `node tools/snapshot-money-query-pages.mjs`
   - confirm `reports/money-query-preedit-snapshot-2026-05-19.csv` is refreshed or create a dated follow-up report.

## After Each WordPress Edit

Run the snapshot tool again and compare against the pre-edit report.

Required pass criteria:

| Check | Must pass |
|---|---|
| HTTP status | 200 |
| Final URL | Same target URL |
| XML sitemap | Still YES |
| Canonical | Still self-canonical |
| Noindex | NO |
| H1 count | Prefer 1; criminal page must be checked carefully because it currently has 2 |
| Title/H1 | Match approved title/H1 direction |
| Lead intent | YES |
| Page content | Intro answers the user situation, risk, documents/facts, lawyer need and next action |

## Search Console Steps

For each edited page:

1. Open Google Search Console URL Inspection.
2. Inspect the full URL.
3. Run live test.
4. Confirm the live test is crawlable and not blocked by robots/noindex.
5. If the live test is valid, click Request Indexing.
6. Record the request date in the tracking CSV.

Important: a successful live test does not guarantee ranking or indexing. It only confirms Google can access and parse the live URL.

## Measurement Schedule

| Time after edit | What to check |
|---|---|
| Same day | Rendered title/H1, indexability, sitemap/canonical/noindex, lead CTA |
| 7 days | GSC URL Inspection last crawl and title rendering if visible |
| 14 days | Query/page clicks, impressions, CTR, average position |
| 28 days | CTR and lead-form interaction trend |
| 45 days | Decide keep/iterate/escalate content rewrite |

## Tracking Fields

Use these fields in the follow-up CSV:

- URL
- edit date
- approved title
- approved H1
- editor
- reviewer
- URL Inspection request date
- post-edit status
- post-edit canonical
- post-edit noindex
- post-edit H1 count
- 14-day clicks
- 14-day impressions
- 14-day CTR
- 28-day clicks
- 28-day impressions
- 28-day CTR
- notes

## Completion Assessment

Money-query SEO recovery moves from **35% to 37%**.

What materially advanced: we now have a pre-edit snapshot and a post-edit verification path. This reduces the risk of approved CMS edits breaking crawlability, canonical state, sitemap inclusion, title/H1 rendering, or lead capture.

What remains blocked: owner/legal approval, actual WordPress edits, Search Console recrawl requests, and GSC performance movement.

Where the owner can notice now: PR #9 and this verification file.  
Where the owner can notice later: edited page titles/H1s and Search Console CTR movement.

