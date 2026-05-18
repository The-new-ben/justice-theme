# Family Law Support-to-Hub Map - 2026-05-18

## Goal

Turn existing family/divorce traffic into qualified lawyer-lead intent by connecting high-impression support pages to the commercial family-law hub:

`https://jus-tice.co.il/family-law/`

This is a planning artifact only. It does not edit public content, redirects, taxonomy, or WordPress data.

## Research Basis

- Google says crawlable internal links and descriptive anchor text help users and Google understand destination pages.
- Google's SEO starter guidance emphasizes useful content, clear navigation, and helping users reach important pages.
- Competitor review for Israeli family/divorce searches shows the strongest commercial pages repeatedly organize around divorce agreement, costs, custody/parental responsibility, child support, dispute resolution, property division, mediation and process checklists.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://gertelaw.co.il/divorce-agreement/
- https://www.lawreviews.co.il/article/divorce-by-mutual-consent
- https://divorcify.co.il/he/calculators/divorce-cost
- https://www.sayag-law.co.il/cost-divorce-how-much/

## Live Technical Check

Googlebot-style fetch passed for the hub and sampled support URLs:

- `/family-law/` - 200, indexable, self-canonical.
- `/free-divorce-agreement-template/` - 200, indexable, self-canonical.
- `/joint-custody-shared-parenting/` - 200, indexable, self-canonical.
- `/child-custody-modification/` - 200, indexable, self-canonical.
- `/divorce-costs-2025/` - 200, indexable, self-canonical.
- `/request-for-family-dispute-settlements/` - 200, indexable, self-canonical.
- `/how-much-does-a-divorce-agreement-cost/` - 200, indexable, self-canonical.

## Priority Link Targets

| Priority | Source URL | GSC evidence | Target hub | Anchor direction | Reason |
|---|---|---:|---|---|---|
| P0 | `/free-divorce-agreement-template/` | 36,900 impressions, 185 clicks | `/family-law/` | עורך דין לענייני משפחה לפני חתימה על הסכם גירושין | Strongest family/divorce page by clicks; high conversion intent around agreement review. |
| P0 | Hebrew slug: child-support calculator | 17,808 impressions, 16 clicks | `/family-law/` | בדיקת מזונות ילדים עם עורך דין לענייני משפחה | Calculator intent is practical and can convert when users need case-specific advice. |
| P0 | `/joint-custody-shared-parenting/` | 16,996 impressions, 5 clicks | `/family-law/` | אחריות הורית וזמני שהות | Modernize language away from only "custody"; competitor/source signals point to parental responsibility/time arrangements. |
| P0 | Hebrew slug: updated divorce guide | 16,790 impressions, 128 clicks | `/family-law/` | ליווי משפטי בהליך גירושין | High clicks; should reinforce the main hub, not compete with it. |
| P0 | `/child-custody-modification/` | 14,186 impressions, 20 clicks | `/family-law/` | שינוי זמני שהות ומשמורת ילדים | Specific conversion intent for changed circumstances. |
| P0 | `/divorce-costs-2025/` | 13,272 impressions, 31 clicks | `/family-law/` | עלות עורך דין גירושין | Strong price/commercial query; keep factual, no price promises. |
| P0 | Hebrew slug: recommended divorce lawyer/how to find/cost | 13,216 impressions | `/family-law/` | איך לבחור עורך דין גירושין | Trust-claim risk; rewrite away from "recommended" before public edits. |
| P0 | `/living-apart-together-legal-rights/` | 11,439 impressions, 59 clicks | `/family-law/` | זכויות ידועים בציבור | High clicks and adjacent family-law commercial intent. |
| P0 | DOCX divorce agreement download | 10,193 impressions, 18 clicks | `/family-law/` | בדיקת הסכם גירושין לפני שימוש במסמך | File asset traffic should route users to a safe legal review path. |
| P0 | Hebrew slug: divorce mediation explainer | 9,609 impressions | `/family-law/` | גישור גירושין והסכם משפחתי | Mediation/process intent; connect to hub carefully. |
| P0 | `/request-for-family-dispute-settlements/` | 9,284 impressions, 4 clicks | `/family-law/` | בקשה ליישוב סכסוך לפני הליך משפחה | Mandatory process intent; strong pre-litigation entry point. |
| P0 | `/divorce-mediation-basics/` | 8,732 impressions | `/family-law/` | גישור גירושין | Contains trust-claim risk because title includes "recommended"; rewrite first. |
| P0 | `/cohabitation-property-rights-for-unmarried-couples/` | 8,713 impressions, 13 clicks | `/family-law/` | חלוקת רכוש בין ידועים בציבור | Strong property/family intent. |
| P0 | `/how-much-does-a-divorce-agreement-cost/` | 8,698 impressions | `/family-law/` | כמה עולה הסכם גירושין אצל עורך דין | Price intent; keep factual and avoid fee guarantees. |
| P0 | `/divorce-everything-you-need-to-know/` | 8,326 impressions, 2 clicks | `/family-law/` | עורך דין גירושין ומשפחה | Broad divorce guide should support the hub. |
| P0 | `/what-is-child-custody/` | 6,648 impressions | `/family-law/` | משמורת ילדים וזמני שהות | Good custody support page; align terminology. |
| P0 | `/trusted-divorce-attorney-guide/` | 6,447 impressions | `/family-law/` | בחירת עורך דין לענייני משפחה | Trust-claim risk; remove "recommended/experienced/reputation" claims unless substantiated. |
| P0 | `/strategic-divorce-cost-planning/` | 6,437 impressions, 5 clicks | `/family-law/` | תכנון הליך גירושין ועלויות | Strategy/price intent; useful support-to-hub source. |

## Anchor Rules Before Public Editing

Use descriptive, varied anchors. Avoid unsupported trust claims.

Allowed anchor patterns:

- `עורך דין לענייני משפחה`
- `עורך דין גירושין`
- `בדיקת הסכם גירושין`
- `עלות עורך דין גירושין`
- `מזונות ילדים`
- `זמני שהות ומשמורת ילדים`
- `בקשה ליישוב סכסוך`
- `חלוקת רכוש בגירושין`
- `זכויות ידועים בציבור`

Avoid unless owner/legal approves exact substantiation:

- `מומלץ`
- `הטוב ביותר`
- `מוביל`
- `בעל מוניטין`
- `ייעוץ חינם`
- `הצלחה מובטחת`
- `הדרך הזולה ביותר`

## Safe Implementation Sequence

1. Confirm `/family-law/` remains the commercial hub for this batch.
2. Back up each live source page before CMS editing.
3. Add one contextual factual link from each approved source page to `/family-law/`.
4. Use varied anchors matching the source topic; do not repeat the same exact-match anchor everywhere.
5. Do not change slugs, canonicals, redirects, titles, H1s, taxonomies, noindex rules, or downloadable assets in this pass.
6. Re-run Googlebot fetch checks for each edited page and `/family-law/`.
7. Watch GSC query/page mapping weekly: support pages should keep informational intent while `/family-law/` should gain stronger commercial relevance.

## Owner Approval Needed Before Public Edit

- Confirm that `/family-law/` is the hub to strengthen for family/divorce leads.
- Confirm whether Maya Rotenberg remains the initial paid lead recipient for this category.
- Confirm whether trust-claim language should be rewritten to factual selection/checklist language in the first CMS edit batch.

## Safety

No public CMS/database row, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
