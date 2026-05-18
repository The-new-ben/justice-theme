# Real Estate Cluster Consolidation Packet - 2026-05-18

Cycle time: 2026-05-18 18:12 Asia/Jerusalem

## Research basis

- Google Search Console Performance reports should be used to review queries, pages, impressions, clicks, CTR and average position before deciding what to improve. Source: https://support.google.com/webmasters/answer/7576553
- Google canonical guidance says the canonical URL should represent the best representative page among duplicate or very similar pages, but canonicalization is not a substitute for deciding each page's unique purpose. Source: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Google's title-link guidance warns against weak or boilerplate titles and says title links should describe the page's primary content clearly. Source: https://developers.google.com/search/docs/appearance/title-link

## Why this cluster is first

The latest GSC query/page mirror shows real-estate money queries with thousands of impressions and almost no clicks:

| Query | URL | Clicks | Impressions | CTR | Position |
|---|---|---:|---:|---:|---:|
| עורך דין מקרקעין | `/real-estate-attorney/` | 1 | 7,986 | 0.01% | 64.6 |
| עורך דין נדלן | `/real-estate-attorney/` | 0 | 3,712 | 0.00% | 57.5 |
| עורך דין קניית דירה | `/lawyer-for-buying-or-selling-a-house/` | 0 | 3,533 | 0.00% | 74.8 |
| עורך דין מקרקעין | `/real-estate-lawyer-guide/` | 1 | 3,232 | 0.03% | 78.2 |
| עורך דין קניית דירה מקבלן | `/lawyer-for-buying-or-selling-a-house/` | 0 | 2,899 | 0.00% | 75.4 |
| עורך דין מכירת דירה | `/lawyer-for-buying-or-selling-a-house/` | 0 | 2,812 | 0.00% | 58.6 |
| משרד עורכי דין מקרקעין | `/real-estate-attorney/` | 0 | 1,701 | 0.00% | 72.6 |
| עורך דין לענייני נדלן | `/real-estate-lawyer-guide/` | 0 | 1,693 | 0.00% | 76.8 |

## Live Googlebot-style signal check

All sampled pages returned HTTP 200, indexable, and self-canonical:

| URL | Current role | Live title/H1 signal | Decision |
|---|---|---|---|
| `/real-estate-attorney/` | Main commercial hub candidate | Title/H1 target `עורך דין מקרקעין מומלץ`, price and free consultation | Make this the primary money hub for `עורך דין מקרקעין` and `עורך דין נדלן`. |
| `/real-estate-lawyer-guide/` | Educational guide/support page | Title says guide, H1 is broader `דיני מקרקעין` | Keep as informational support; do not let it compete as the primary money hub. |
| `/lawyer-for-buying-or-selling-a-house/` | Transaction sub-service | Title/H1 target apartment purchase/sale | Keep as a focused buying/selling support page that links up to the hub. |
| `/registration-of-real-estate-israel/` | Registry support page | Title/H1 target land registry rights | Keep as support content for Tabu/registration intent. |
| `/rental-agreement/` | Rental contract support | Title/H1 target rental agreement | Keep informational; lower priority for lawyer marketplace unless connected to lease-dispute demand. |
| `/online-rent-agreement/` | Tool/document intent | Title/H1 target online rental contract | Keep as separate tool/document intent; not the commercial lawyer hub. |

## Consolidation decision

Do not redirect or canonicalize these pages together now. They are not simple duplicates:

- `/real-estate-attorney/` should be the commercial money hub.
- `/real-estate-lawyer-guide/` should become the broad explanatory support article and link clearly to the hub.
- `/lawyer-for-buying-or-selling-a-house/` should serve apartment purchase/sale queries and link clearly to the hub.
- `/registration-of-real-estate-israel/` should serve registry/Tabu queries and link clearly to the hub.
- Rental-contract pages should stay separate unless a later commercial lease-lawyer path is created.

The main problem is likely authority and intent distribution, not a noindex or canonical bug.

## Owner-approval edit packet

These are the safe public changes to prepare next, but not execute without approval:

1. On `/real-estate-attorney/`, clarify above-the-fold commercial promise around real estate lawyer matching, apartment purchase/sale, registration, contractor delivery delay and urgent consultation.
2. On `/real-estate-lawyer-guide/`, make it explicitly a guide/support page and add a prominent internal link to `/real-estate-attorney/` with natural Hebrew anchor text around finding a real estate lawyer.
3. On `/lawyer-for-buying-or-selling-a-house/`, keep the page for purchase/sale intent and add a support-to-hub link for users who need a lawyer match.
4. On `/registration-of-real-estate-israel/`, add a contextual support-to-hub link where users face registration disputes or need representation.
5. Do not move Portugal/foreign real-estate investment content into the core hub unless there is a separate international real-estate strategy.

## Next technical checks before public edit

- Check whether `/real-estate-attorney/`, `/real-estate-lawyer-guide/` and `/lawyer-for-buying-or-selling-a-house/` already link to each other in body content.
- Check if the HTML sitemap and footer surface the money hub.
- Check Search Console query overlap again after the next export to verify whether the hub starts receiving the intended query set.

## Safety

This cycle changed only repo planning/status artifacts and ran read-only live checks. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment changed.
