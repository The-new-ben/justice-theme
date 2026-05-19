# Real Estate Buy/Sell Support Edit Blocks - 2026-05-19

Status: VERIFIED PLANNING / REVIEW ONLY / NO PUBLIC CHANGES

Cycle time: 2026-05-19 12:22 Asia/Jerusalem

## Scope

This package prepares exact owner-review edit blocks for the high-impression real-estate transaction support page:

`/lawyer-for-buying-or-selling-a-house/`

The page should remain a focused support page for apartment purchase/sale intent. It should not be redirected into `/real-estate-attorney/`, and it should not compete with the broader real-estate lawyer hub. The first safe action is to preserve the URL, remove unsupported expert/claim-heavy wording, clarify transaction intent, and add contextual links to the hub and related support pages.

## Evidence Used

- `content-master/gsc/gsc-url-summary.csv`
- `justice_theme_emergency_master_2026_05_13/content-master/seo-rescue/output/gsc/gsc_query_page_12m.csv`
- `project-control/money-query-seo-rescue-batch-001-2026-05-18.csv`
- `project-control/real-estate-cluster-consolidation-packet-2026-05-18.md`
- `project-control/real-estate-support-to-hub-map-2026-05-18.csv`
- Live `curl.exe` checks run on 2026-05-19.

## Live Verification

VERIFIED LIVE:

| URL | HTTP | Canonical | Robots | Status |
|---|---:|---|---|---|
| `/lawyer-for-buying-or-selling-a-house/` | 200 | self-canonical | index, follow | VERIFIED |

Current live fields:

- Title: `עורך דין קניית דירה | עו"ד מכירת דירה | מומחה בעסקאות מקרקעין | Jus-Tice.co.il`
- H1: `עורך דין קניית דירה | עו"ד מכירת דירה | מומחה בעסקאות מקרקעין`
- Meta description: `עורך דין קניית דירה | עו"ד מכירת דירה | מומחה בעסקאות מקרקעין - עורך דין קניית דירה עו"ד מכירת דירה. מתקשרים בעסקת מקרקעין? על מנת לוודא כי השקעתם את כספכם במקום הנכון, הנכם זקוקים לייצוג משפטי של עורך דין מקרקעין מקצועי ומנוסה.`
- OG title: same as current title
- OG description: same as current meta description
- Current visible H2s: `הערת מערכת`, `צריכים עזרה משפטית?`, `מצאו את עורך הדין המתאים לכם — עכשיו`, `מדריכים משפטיים קשורים`
- Source size: `81,393` bytes
- Source link count: `82`

Current internal-link gap:

| Target path | Source occurrences |
|---|---:|
| `/real-estate-attorney/` | 0 |
| `/real-estate-lawyer-guide/` | 0 |
| `/registration-of-real-estate-israel/` | 0 |
| `/real-estate-lawyer-cost-2025/` | 0 |
| `/land-appreciation-tax/` | 0 |
| `/real-estate-appraiser/` | 0 |

Supporting link target checks:

- VERIFIED 200: `/real-estate-attorney/`
- VERIFIED 200: `/real-estate-lawyer-guide/`
- VERIFIED 200: `/registration-of-real-estate-israel/`
- VERIFIED 200: `/real-estate-lawyer-cost-2025/`
- VERIFIED 200: `/land-appreciation-tax/`
- VERIFIED 200: `/real-estate-appraiser/`
- VERIFIED 200: `/lawyers/?area=real-estate-law`

## GSC Opportunity

VERIFIED:

- URL summary: `/lawyer-for-buying-or-selling-a-house` has `3` clicks, `35,650` impressions, `0.01%` CTR and average position `61.5`.
- The URL summary labels this as `HIGH` traffic risk and `DO_NOT_TOUCH_HIGH_TRAFFIC_URL`; therefore preserve the URL and avoid redirects.
- Query-page export shows clear apartment purchase/sale intent mapping to this page.

Top query rows from the 12-month query-page mirror:

| Query | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| `עורך דין קניית דירה` | 0 | 3,361 | 0.0000 | 75.4 |
| `עורך דין קניית דירה מקבלן` | 0 | 2,794 | 0.0000 | 75.3 |
| `עורך דין מכירת דירה` | 0 | 2,619 | 0.0000 | 59.2 |
| `עורך דין רכישת דירה` | 0 | 2,475 | 0.0000 | 80.0 |
| `עורך דין לקניית דירה` | 0 | 1,425 | 0.0000 | 53.6 |
| `עו"ד מכירת דירה` | 0 | 1,227 | 0.0000 | 55.8 |
| `מתי משלמים לעורך דין קניית דירה` | 0 | 1,047 | 0.0000 | 18.2 |
| `עורך דין לרכישת דירה` | 0 | 959 | 0.0000 | 78.3 |
| `עורכי דין קניית דירה` | 0 | 508 | 0.0000 | 65.0 |
| `עו"ד רכישת דירה` | 0 | 506 | 0.0000 | 59.2 |
| `עורך דין מכר דירה` | 0 | 497 | 0.0000 | 67.3 |
| `שכר טרחת עו ד ברכישת דירה יד שניה` | 0 | 489 | 0.0000 | 44.5 |
| `עו"ד קניית דירה` | 0 | 436 | 0.0000 | 55.2 |
| `עורכי דין מכירת דירה` | 0 | 426 | 0.0000 | 65.3 |
| `שכר טרחה עורך דין קניית דירה יד שניה` | 0 | 390 | 0.0000 | 41.2 |

Interpretation:

- This is a live, indexable, high-impression support page with almost no clicks.
- The page should stay distinct from `/real-estate-attorney/` because apartment purchase/sale is a narrower transactional intent.
- The current title/H1/meta use `מומחה`, which should be removed unless there is a verified lawyer-profile basis.
- The page needs a clear support-to-hub link to the main real-estate attorney page and contextual links to registration, cost, tax and appraisal support pages.

## Recommended SEO Title

`עורך דין קניית דירה ומכירת דירה: חוזה, בדיקות ורישום | Jus-Tice`

## Recommended H1

`עורך דין קניית דירה או מכירת דירה: בדיקות, חוזה ורישום זכויות`

## Recommended Meta Description

`מדריך מעשי לקנייה או מכירת דירה: בדיקות לפני חתימה, חוזה מכר, תשלומים, קבלן, טאבו, מסמכים ושאלות שכדאי להכין לפני פנייה לעורך דין מקרקעין.`

## Recommended OG Title

`עורך דין קניית דירה ומכירת דירה: חוזה ורישום זכויות`

## Recommended OG Description

Same as meta description.

## Recommended Intro Block

```html
<p>קנייה או מכירה של דירה היא עסקת מקרקעין עם שלבים משפטיים, כספיים ורישומיים: בדיקת זכויות, הערות אזהרה, משכנתה, מסים, מועדי תשלום, מסירה ורישום. גם כאשר העסקה נראית פשוטה, טעות בסעיף חוזה, בלוח תשלומים או בבדיקת הזכויות יכולה להשפיע על היכולת להשלים את העסקה.</p>

<p>העמוד הזה מיועד למי שנמצא לפני חתימה על זיכרון דברים או חוזה, מקבל טיוטה ממוכר, קונה או קבלן, או רוצה להבין אילו מסמכים ושאלות להכין לפני פנייה לעורך דין מקרקעין. אם אתם מחפשים התאמה רחבה יותר של עורך דין לעסקת מקרקעין, ראו גם את המדריך הראשי בנושא <a href="https://jus-tice.co.il/real-estate-attorney/">עורך דין מקרקעין</a>.</p>
```

## Recommended Practical Section

```html
<h2>מה לבדוק לפני חתימה על עסקת דירה?</h2>
<ul>
  <li>מי רשום כבעל הזכויות בנכס והאם קיימות הערות, שעבודים, עיקולים או מגבלות רישום.</li>
  <li>האם מדובר בדירה יד שנייה, דירה מקבלן, דירה בירושה, דירת השקעה או עסקה עם תנאי מימון מיוחדים.</li>
  <li>מה לוח התשלומים, אילו בטוחות ניתנות לקונה ומה קורה אם אחד הצדדים לא עומד במועדים.</li>
  <li>אילו מסים והוצאות נלוות עשויים להיות רלוונטיים, כולל מס רכישה, מס שבח, היטל השבחה ושכר טרחה.</li>
  <li>מה נדרש לצורך רישום הזכויות לאחר החתימה, ואילו מסמכים צריך להכין מראש.</li>
  <li>האם יש פערים בין נסח הרישום, היתר הבנייה, מצב הדירה בפועל וההתחייבויות בחוזה.</li>
</ul>
```

## Recommended CTA Block

```html
<p><strong>צריכים הכוונה לפני קנייה או מכירת דירה?</strong> השאירו פרטים קצרים על סוג העסקה, שלב החתימה, האם מדובר בדירה יד שנייה או קבלן, מצב הרישום והאם כבר הועברה טיוטת חוזה. הפנייה תיבדק לפי תחום, דחיפות ואזור, ללא הבטחה לתוצאה וללא תחליף לייעוץ משפטי פרטני.</p>
```

## Recommended Internal Links

Add contextual links from the body, not only related cards:

| Destination | Anchor direction | Role |
|---|---|---|
| `/real-estate-attorney/` | `עורך דין מקרקעין` | main commercial hub |
| `/real-estate-lawyer-guide/` | `מדריך לדיני מקרקעין` | broad explanatory support |
| `/registration-of-real-estate-israel/` | `רישום זכויות בטאבו וברשות מקרקעי ישראל` | registration support |
| `/real-estate-lawyer-cost-2025/` | `שכר טרחה ועלות עורך דין מקרקעין` | price-intent support |
| `/land-appreciation-tax/` | `מס שבח ומיסוי מקרקעין` | transaction tax support |
| `/real-estate-appraiser/` | `שמאות מקרקעין ובדיקת שווי` | appraisal support |
| `/lawyers/?area=real-estate-law` | `חיפוש עורכי דין מקרקעין` | directory path |

## Boundary Rules

- Keep this page focused on buying and selling apartments. Do not broaden it into the general real-estate hub.
- Do not redirect or canonicalize it to `/real-estate-attorney/`; GSC labels it high-risk and the query set is distinct enough to preserve.
- Do not merge foreign real-estate investment content into this page.
- Do not use this page for rental contract intent; rental pages should stay separate.
- Do not add city-lawyer claims unless real lawyer coverage exists.
- Do not add Review or AggregateRating schema.

## Do Not Change Yet

- Do not change the slug.
- Do not redirect this page.
- Do not canonicalize this page into `/real-estate-attorney/`.
- Do not remove it from the sitemap.
- Do not delete or noindex it.
- Do not create new URL variants for purchase/sale intent.
- Do not add `מומלץ`, `הכי טוב`, `מוביל`, `אמין`, `מומחה`, guaranteed-result language or fake ratings.
- Do not publish without owner approval and backup of current fields.

## Upload Order Recommendation

1. Owner approves or edits this support edit block package.
2. Back up current CMS body, title, H1, SEO title, meta, schema and related-card settings for `/lawyer-for-buying-or-selling-a-house/`.
3. Apply title/H1/meta/OG/intro/practical/CTA/internal links.
4. QA `/lawyer-for-buying-or-selling-a-house/`: HTTP 200, self-canonical, indexable, no trust-claim leak, all new links 200.
5. After `/real-estate-attorney/` hub QA passes, confirm hub-to-support and support-to-hub links work as a pair.
6. Monitor GSC query/page changes after recrawl.

## Ready

- VERIFIED: high-impression real-estate support page selected.
- VERIFIED: current live URL/index/canonical state checked.
- VERIFIED: current title/H1/meta contain claim-heavy wording that should be neutralized.
- VERIFIED: source currently lacks links to the real-estate hub and key support pages.
- VERIFIED: support-link targets checked for live 200 status.
- READY FOR REVIEW: exact title/H1/meta/intro/CTA/internal-link blocks.

## Still Blocked

- BLOCKED: owner approval before CMS edits.
- BLOCKED: backup of current fields before any public edit.
- BLOCKED: no GSC post-change monitoring can happen until public edits are approved and indexed.
- BLOCKED: no redirect/canonical/noindex/sitemap/taxonomy action is approved.

## Safety

This cycle created repo-only planning files and ran read-only live checks. No public CMS/database row, article body, title, H1, meta description, URL slug, redirect, noindex, canonical, sitemap, taxonomy, internal link, related-card, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment was changed.
