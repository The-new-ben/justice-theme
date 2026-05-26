# Real Estate Support-to-Hub Map - 2026-05-18

## Goal

Turn real-estate traffic into qualified lawyer-lead intent by connecting Israeli property-law support pages to the commercial real-estate hub:

`https://jus-tice.co.il/real-estate-attorney/`

The newly recovered guide route should serve as a secondary explainer:

`https://jus-tice.co.il/real-estate-lawyer-guide/`

This is a planning artifact only. It does not edit public content, redirects, taxonomy, or WordPress data.

## Research Basis

- Google says internal links should be crawlable `<a href>` links and should use anchor text that helps users and Google understand the destination.
- Current internal-linking guidance recommends every related support page link back to the correct hub with natural, varied anchors.
- Competitor review for Israeli real-estate-law searches shows strong commercial pages cluster around buying/selling apartments, contract review, land registry, real-estate tax, late delivery by contractor, appraisers, property agreements and transaction risk checks.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://seoglen.com/guides/internal-linking-seo
- https://www.realestatelawyer.co.il/
- https://adiben-adv.co.il/
- https://www.at-realestatelaw.co.il/
- https://sgdlawyer.co.il/
- https://peteladv.co.il/

## Live Technical Check

Googlebot-style fetch passed for the hub and sampled support URLs:

- `/real-estate-attorney/` - 200, indexable, self-canonical.
- `/real-estate-lawyer-guide/` - 200, indexable, self-canonical.
- `/lawyer-for-buying-or-selling-a-house/` - 200, indexable, self-canonical.
- `/registration-of-real-estate-israel/` - 200, indexable, self-canonical.
- `/land-appreciation-tax/` - 200, indexable, self-canonical.
- `/real-estate-lawyer-cost-2025/` - 200, indexable, self-canonical.
- `/real-estate-appraiser/` - 200, indexable, self-canonical.
- `/marital-property-agreement/` - 200, indexable, self-canonical.
- `/spouse-property-registration-guide/` - 200, indexable, self-canonical.

## Priority Link Targets

| Priority | Source URL | GSC evidence | Target hub | Anchor direction | Reason |
|---|---|---:|---|---|---|
| P0 | `/real-estate-attorney/` | 88,601 impressions, 17 clicks | self | עורך דין מקרקעין | Main commercial hub; title has trust-claim risk: "recommended/free consultation". |
| P0 | `/real-estate-lawyer-guide/` | 26,708 impressions, 7 clicks | `/real-estate-attorney/` | עורך דין מקרקעין לעסקת נדל"ן | Newly recovered route; should support the main commercial hub. |
| P0 | `/lawyer-for-buying-or-selling-a-house/` | 35,650 impressions, 3 clicks | `/real-estate-attorney/` | עורך דין קניית דירה ומכירת דירה | Direct money intent for apartment transactions. |
| P0 | `/registration-of-real-estate-israel/` | 17,400 impressions, 15 clicks | `/real-estate-attorney/` | רישום זכויות מקרקעין | Practical transaction/legal step. |
| P0 | Hebrew article: partition of shared apartment | 16,201 impressions, 8 clicks | `/real-estate-attorney/` | פירוק שיתוף בדירה | Strong real-estate/family overlap; coordinate with family cluster before public edits. |
| P0 | `/land-appreciation-tax/` | 11,831 impressions, 2 clicks | `/real-estate-attorney/` | מס שבח ומיסוי מקרקעין | Tax/legal transaction intent. |
| P0 | `/real-estate-lawyer-cost-2025/` | 10,927 impressions, 3 clicks | `/real-estate-attorney/` | עלות עורך דין מכירת דירה | Price/commercial intent; keep factual. |
| P0 | `/real-estate-appraiser/` | 10,295 impressions, 9 clicks | `/real-estate-attorney/` | שמאות מקרקעין בעסקת דירה | Helpful transaction-support page. |
| P0 | `/marital-property-agreement/` | 8,072 impressions, 13 clicks | `/real-estate-attorney/` | הסכם ממון על דירה | Family/real-estate overlap; coordinate with family cluster. |
| P0 | Hebrew case page: late apartment delivery from contractor | 7,725 impressions, 7 clicks | `/real-estate-attorney/` | פיצוי על איחור במסירת דירה | High commercial dispute intent; good support-to-hub candidate. |
| P0 | `/spouse-property-registration-guide/` | 7,432 impressions, 84 clicks | `/real-estate-attorney/` | רישום דירה על שם אחד מבני הזוג | High-click family/real-estate overlap. |
| P0 | Hebrew slug: real-estate consultant | 7,404 impressions, 10 clicks | `/real-estate-attorney/` | בדיקה משפטית לפני עסקת נדל"ן | Needs content review; can be de-emphasized if too advisory/non-legal. |

## High-Traffic But Lower Business Priority

These URLs have GSC demand but should not outrank Israeli lawyer-lead pages in homepage/global priorities:

- `/low-value-invest-abroad/` - 37,005 impressions, 128 clicks.
- Hebrew slug: most worthwhile country for Israeli investor - 31,186 impressions, 107 clicks.
- `/buying-property-in-greece/` - 30,418 impressions, 40 clicks.
- `/investing-in-greece-real-estate/` - 27,183 impressions, 22 clicks.
- Hebrew slug: investing in Dubai - 16,161 impressions, 59 clicks.
- `/apartment/` - 12,916 impressions.
- Cyprus, UK, New York, Portugal and other foreign-investment pages.

Safe posture: preserve and classify these pages, but do not let them dominate homepage cards, main navigation, or commercial-lawyer lead routing until the business confirms foreign-real-estate lawyer monetization.

## Anchor Rules Before Public Editing

Allowed anchor patterns:

- `עורך דין מקרקעין`
- `עורך דין קניית דירה`
- `עורך דין מכירת דירה`
- `בדיקת חוזה מכר`
- `רישום זכויות מקרקעין`
- `מס שבח ומיסוי מקרקעין`
- `פיצוי על איחור במסירת דירה`
- `פירוק שיתוף בדירה`
- `הסכם ממון על דירה`

Avoid unless owner/legal approves exact substantiation:

- `מומלץ`
- `הטוב ביותר`
- `מוביל`
- `מומחה` when not tied to verified credentials
- `ייעוץ חינם`
- `העסקה המשתלמת ביותר`
- `רווח מובטח`
- `חיסכון מס מובטח`

## Safe Implementation Sequence

1. Confirm `/real-estate-attorney/` remains the main commercial hub and `/real-estate-lawyer-guide/` remains the secondary explainer.
2. Back up each live source page before CMS editing.
3. Start with Israeli transaction pages: buying/selling, registration, tax, cost, appraiser, late delivery.
4. Hold family-overlap pages for coordination with the family-law cluster.
5. Keep foreign-investment pages discoverable but not homepage-priority unless monetization is confirmed.
6. Add one contextual factual link from each approved source page to `/real-estate-attorney/`.
7. Do not change slugs, canonicals, redirects, titles, H1s, taxonomies, noindex rules or foreign-cluster URLs in this pass.
8. Re-run Googlebot fetch checks for each edited page and both hub routes.

## Owner Approval Needed Before Public Edit

- Confirm whether real-estate leads are currently monetizable and who receives them.
- Confirm `/real-estate-attorney/` as the main hub.
- Approve rewriting "recommended/free consultation/expert" language into factual selection/checklist language.
- Decide whether foreign-real-estate traffic should be monetized or de-emphasized.

## Safety

No public CMS/database row, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
