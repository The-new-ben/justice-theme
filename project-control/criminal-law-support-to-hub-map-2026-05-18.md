# Criminal Law Support-to-Hub Map - 2026-05-18

## Goal

Turn existing criminal-law traffic into qualified lawyer-lead intent by connecting high-impression support pages to the commercial criminal-law hub:

`https://jus-tice.co.il/criminal-defense-attorney/`

This is a planning artifact only. It does not edit public content, redirects, taxonomy, or WordPress data.

## Research Basis

- Google says crawlable internal links should use real `<a href>` elements and descriptive anchor text so users and Google understand the destination page.
- Current internal-linking best practice is to connect every related support page back to the hub with natural, varied anchors rather than repeating one exact-match phrase everywhere.
- Competitor review for Israeli criminal-defense pages shows the strongest commercial pages organize around police investigation, arrest, sex offenses, drug offenses, criminal record, white-collar/economic offenses, price/cost, and court representation.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://seoglen.com/guides/internal-linking-seo
- https://sasson-oren.co.il/
- https://www.mizrahi-law.co.il/
- https://peretz-law.co.il/
- https://www.criminallaw.co.il/

## Live Technical Check

Googlebot-style fetch passed for the hub and sampled support URLs:

- `/criminal-defense-attorney/` - 200, indexable, self-canonical.
- `/apply-for-police-criminal-information-certificates/` - 200, indexable, self-canonical.
- `/sex-crime-lawyer/` - 200, indexable, self-canonical.
- `/drug-related-crime/` - 200, indexable, self-canonical.
- `/how-much-will-a-criminal-defense-lawyer-cost/` - 200, indexable, self-canonical.
- `/tax-investigation-guide/` - 200, indexable, self-canonical.
- `/famous-criminal-defense-lawyer/` - 200, indexable, self-canonical.
- `/what-is-money-laundering/` - 200, indexable, self-canonical.

## Priority Link Targets

| Priority | Source URL | GSC evidence | Target hub | Anchor direction | Reason |
|---|---|---:|---|---|---|
| P0 | Hebrew slug: police stations list | 118,014 impressions, 482 clicks | `/criminal-defense-attorney/` | ייעוץ לפני חקירה במשטרה | Massive practical police-intent page; should route urgent users to criminal-defense help. |
| P0 | `/criminal-defense-attorney/` | 62,561 impressions, 10 clicks | self | עורך דין פלילי | Hub is live and should remain protected. |
| P0 | Hebrew slug: famous criminal-defense lawyers | 52,640 impressions, 96 clicks | `/criminal-defense-attorney/` | איך לבחור עורך דין פלילי | Trust-claim risk; rewrite away from famous/best/leading framing before public edit. |
| P0 | `/apply-for-police-criminal-information-certificates/` | 38,667 impressions, 188 clicks | `/criminal-defense-attorney/` | מחיקת רישום פלילי ותעודת מידע פלילי | Strong criminal-record intent; high clicks. |
| P0 | Hebrew slug: recommended criminal lawyer price list | 38,017 impressions, 234 clicks | `/criminal-defense-attorney/` | כמה עולה עורך דין פלילי | Strong price/commercial intent; remove "recommended" framing. |
| P0 | `/sex-crime-lawyer/` | 27,904 impressions, 34 clicks | `/criminal-defense-attorney/` | ייצוג בעבירות מין | High-risk, high-value subpractice; needs careful ethical language. |
| P0 | `/drug-related-crime/` | 24,014 impressions, 3 clicks | `/criminal-defense-attorney/` | ייצוג בעבירות סמים | Clear criminal defense subtopic. |
| P0 | `/how-much-will-a-criminal-defense-lawyer-cost/` | 23,313 impressions, 224 clicks | `/criminal-defense-attorney/` | עלות ייצוג עורך דין פלילי | High commercial cost intent; title includes recommended price language risk. |
| P0 | `/tax-investigation-guide/` | 22,811 impressions, 115 clicks | `/criminal-defense-attorney/` | ליווי בחקירת מס ועבירות מס | Criminal/tax intersection; likely commercial. |
| P0 | `/traffic-lawyer/` | 20,330 impressions | `/criminal-defense-attorney/` | ייצוג בתיק תעבורה פלילי | Has duplicate-target conflict; do not edit until traffic/criminal boundary is approved. |
| P0 | Hebrew article: indictment cancellation | 18,431 impressions, 11 clicks | `/criminal-defense-attorney/` | ביטול כתב אישום | Strong litigation intent. |
| P0 | `/famous-criminal-defense-lawyer/` | 16,268 impressions, 90 clicks | `/criminal-defense-attorney/` | בחירת עורך דין פלילי | Trust-claim risk; preserve traffic but rewrite claims. |
| P0 | `/lawyer-near-me-criminal-law/` | 12,986 impressions, 13 clicks | `/criminal-defense-attorney/` | עורך דין פלילי באזור שלך | Local/service intent; avoid ranking/rating claims. |
| P0 | `/what-is-money-laundering/` | 12,548 impressions, 11 clicks | `/criminal-defense-attorney/` | ייצוג בעבירות הלבנת הון | White-collar criminal intent. |
| P0 | `/sexual-offenses/` | 11,557 impressions, 11 clicks | `/criminal-defense-attorney/` | ייעוץ וייצוג בעבירות מין | Sensitive support page; wording must be careful and factual. |
| P0 | `/economic-crimes-white-collar-lawyer/` | 11,283 impressions, 20 clicks | `/criminal-defense-attorney/` | עבירות כלכליות וצווארון לבן | Strong commercial criminal subpractice. |
| P0 | `/leading-criminal-law-firm/` | 10,533 impressions, 16 clicks | `/criminal-defense-attorney/` | משרד עורכי דין פלילי | Trust-claim risk; remove "leading" unless substantiated. |
| P0 | Hebrew slug: arrest proceeding/criminal lawyer cost | 10,165 impressions, 22 clicks | `/criminal-defense-attorney/` | עורך דין מעצרים | Urgent commercial intent. |

## Anchor Rules Before Public Editing

Use descriptive, varied anchors. Avoid unsupported trust claims.

Allowed anchor patterns:

- `עורך דין פלילי`
- `ייעוץ לפני חקירה במשטרה`
- `ייצוג בדיון מעצר`
- `ביטול כתב אישום`
- `מחיקת רישום פלילי`
- `עבירות סמים`
- `עבירות מין`
- `עבירות הלבנת הון`
- `עבירות כלכליות וצווארון לבן`
- `עלות עורך דין פלילי`

Avoid unless owner/legal approves exact substantiation:

- `מומלץ`
- `הטוב ביותר`
- `מוביל`
- `מפורסם`
- `דירוג עורכי דין`
- `ייעוץ חינם`
- `זמין 24/7`
- `הצלחה מובטחת`
- `עונש מופחת מובטח`

## Safe Implementation Sequence

1. Confirm `/criminal-defense-attorney/` remains the commercial hub for this batch.
2. Back up each live source page before CMS editing.
3. Start with lower-risk pages: criminal certificate/record, cost, drug offenses, money laundering, economic crimes.
4. Hold sex-offense, victim, and sensitive case-law pages for extra legal/ethical review before adding conversion CTAs.
5. Add one contextual factual link from each approved source page to `/criminal-defense-attorney/`.
6. Do not change slugs, canonicals, redirects, titles, H1s, taxonomies, noindex rules, or case-law URLs in this pass.
7. Re-run Googlebot fetch checks for each edited page and `/criminal-defense-attorney/`.
8. Watch GSC weekly: support pages should keep informational intent while the hub gains stronger commercial relevance.

## Owner Approval Needed Before Public Edit

- Confirm that `/criminal-defense-attorney/` is the hub to strengthen for criminal leads.
- Confirm current lawyer supply and lead-routing ownership for criminal-law leads.
- Approve rewriting "recommended/best/leading/famous" language into factual selection/checklist language.
- Approve how sensitive sex-offense and victim-related pages should link to commercial representation pages.

## Safety

No public CMS/database row, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
