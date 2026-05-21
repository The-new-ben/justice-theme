# Real Estate Public Edit Package - 2026-05-21

Cycle time: 2026-05-21 20:45 Asia/Jerusalem

Status: REVIEW ONLY / NOT PUBLISHED

## Goal

Prepare the first controlled public edit batch for the Israeli real-estate cluster without changing WordPress content yet.

Primary commercial hub:

`https://jus-tice.co.il/real-estate-attorney/`

The batch is designed to move high-impression support traffic toward qualified real-estate lawyer intent while avoiding URL conflict, cannibalization, unsupported trust claims, broken redirects, 404s and premature canonical changes.

## Read-only live check

VERIFIED LIVE on 2026-05-21:

| URL | Status | Final URL | Canonical | Hub links found | Decision |
|---|---:|---|---|---:|---|
| `/real-estate-attorney/` | 200 | `/real-estate-attorney/` | `/real-estate-attorney/` | 3 | Hub usable. Keep URL and canonical. |
| `/real-estate-lawyer-guide/` | 200 | `/` | `/` | 0 | BLOCKED. Current live route resolves to homepage content/canonical; do not use in public link batch until route is repaired/rechecked. |
| `/lawyer-for-buying-or-selling-a-house/` | 200 | same URL | same URL | 0 | Ready for support-to-hub link after approval. |
| `/registration-of-real-estate-israel/` | 200 | same URL | same URL | 0 | Ready for support-to-hub link after approval. |
| `/land-appreciation-tax/` | 200 | same URL | same URL | 0 | Ready for support-to-hub link after approval. |
| `/real-estate-lawyer-cost-2025/` | 200 | same URL | same URL | 0 | Ready for support-to-hub link after approval. |
| `/real-estate-appraiser/` | 200 | same URL | same URL | 0 | Ready for support-to-hub link after approval. |

Important change from earlier planning: previous docs treated `/real-estate-lawyer-guide/` as recovered. The 2026-05-21 live check shows it currently resolves to the homepage. Treat it as BLOCKED until a fresh route fix/live QA cycle confirms self-canonical page content.

## Batch scope

Publish later only after owner approval:

1. Strengthen `/real-estate-attorney/` as the main money hub.
2. Add one contextual support-to-hub link from each safe Israeli support page.
3. Hold family-overlap pages until Family/Divorce cluster coordination.
4. Keep foreign-investment pages discoverable but out of the Israeli lawyer-lead path.
5. Do not change slugs, redirects, canonicals, noindex rules, titles, H1s, taxonomy or sitemap in this batch.

## Hub edit package

Target URL:

`https://jus-tice.co.il/real-estate-attorney/`

Role:

Primary commercial hub for:

- עורך דין מקרקעין
- עורך דין נדלן
- עורך דין קניית דירה
- עורך דין מכירת דירה
- בדיקת חוזה מכר
- רישום זכויות מקרקעין
- מס שבח ומיסוי מקרקעין
- איחור במסירת דירה מקבלן

Keep:

- Current URL.
- Self-canonical.
- Indexable status.
- Commercial hub role.

Rewrite/avoid:

- Avoid unsupported terms like "מומלץ", "הטוב ביותר", "מוביל", "מומחה" unless tied to verified credentials.
- Avoid "ייעוץ חינם" unless the business confirms a real, consistent free consultation offer.
- Avoid guaranteed outcome language for tax savings, claim success, registration speed or compensation.

Recommended H1 if owner later approves metadata edits:

`עורך דין מקרקעין לעסקת נדל"ן בישראל`

Recommended title if owner later approves metadata edits:

`עורך דין מקרקעין ונדל"ן | ליווי בעסקאות דירה, טאבו ומיסוי | Jus-Tice`

Recommended meta description if owner later approves metadata edits:

`מחפשים עורך דין מקרקעין? מדריך לבחירת ליווי משפטי לעסקת דירה, מכירה, רישום זכויות, מס שבח, חוזה מכר ועיכוב במסירת דירה.`

CMS-ready above-fold replacement paragraph:

```html
עסקת נדל"ן בישראל משלבת חוזה, רישום זכויות, מיסוי, מימון ולעיתים גם התנהלות מול קבלן, מוכר, קונה או רשות. בעמוד זה ריכזנו את המצבים שבהם כדאי לבדוק ליווי משפטי לפני חתימה, תשלום או רישום בטאבו, ואת המדריכים המשלימים לפי סוג העסקה.
```

CMS-ready hub internal navigation block:

```html
<h2>נושאים מרכזיים בעסקת מקרקעין</h2>
<ul>
  <li><a href="https://jus-tice.co.il/lawyer-for-buying-or-selling-a-house/">קניית או מכירת דירה</a></li>
  <li><a href="https://jus-tice.co.il/registration-of-real-estate-israel/">רישום זכויות מקרקעין וטאבו</a></li>
  <li><a href="https://jus-tice.co.il/land-appreciation-tax/">מס שבח ומיסוי מקרקעין</a></li>
  <li><a href="https://jus-tice.co.il/real-estate-lawyer-cost-2025/">עלות עורך דין בעסקת מקרקעין</a></li>
  <li><a href="https://jus-tice.co.il/real-estate-appraiser/">שמאי מקרקעין ובדיקת שווי</a></li>
</ul>
```

Placement:

Insert after the opening introduction or before the first long explanatory section. Do not replace existing useful body sections without a backup.

## Support-to-hub exact inserts

### `/lawyer-for-buying-or-selling-a-house/`

Status: READY AFTER OWNER APPROVAL

Suggested placement:

After the first section that explains when a lawyer is involved in a purchase or sale.

CMS-ready insert:

```html
בכל עסקת קנייה או מכירה כדאי לחבר את בדיקת החוזה, הערות האזהרה, המסים והרישום לתמונה משפטית אחת. אם אתם עדיין בשלב בחירת הליווי המשפטי, ראו גם את המדריך המרכזי על <a href="https://jus-tice.co.il/real-estate-attorney/">עורך דין מקרקעין לקניית או מכירת דירה</a>.
```

Reason:

Direct commercial overlap with apartment transaction queries. The page has high impressions and currently no body link to the hub in the live source check.

### `/registration-of-real-estate-israel/`

Status: READY AFTER OWNER APPROVAL

Suggested placement:

Near the section on practical registration steps, warnings, title issues or disputes.

CMS-ready insert:

```html
רישום זכויות הוא חלק אחד מתוך עסקת מקרקעין רחבה יותר. כאשר הרישום קשור לחוזה מכר, הערת אזהרה, העברת בעלות או מחלוקת בין צדדים, כדאי לקרוא גם על <a href="https://jus-tice.co.il/real-estate-attorney/">ליווי עורך דין מקרקעין בעסקת נדל"ן</a>.
```

Reason:

Registry/Tabu users often need transaction representation, but the page should not become the primary lawyer hub.

### `/land-appreciation-tax/`

Status: READY AFTER OWNER APPROVAL

Suggested placement:

Near the explanation of when tax is checked before a sale or transfer.

CMS-ready insert:

```html
מס שבח ומיסוי מקרקעין משפיעים על כדאיות העסקה ועל ניסוח החוזה. לפני חתימה או דיווח לרשויות, כדאי להבין גם מתי נדרש <a href="https://jus-tice.co.il/real-estate-attorney/">עורך דין מקרקעין שמלווה את העסקה</a>.
```

Reason:

Tax intent is transaction-adjacent and should support, not replace, the commercial hub.

### `/real-estate-lawyer-cost-2025/`

Status: READY AFTER OWNER APPROVAL

Suggested placement:

Near the cost table or the section explaining what the fee covers.

CMS-ready insert:

```html
המחיר הוא רק חלק מהבדיקה. בעסקת דירה חשוב להבין גם מה כלול בליווי המשפטי: בדיקת זכויות, חוזה, מסים, בטוחות ורישום. להרחבה ראו את המדריך המרכזי על <a href="https://jus-tice.co.il/real-estate-attorney/">עורך דין מקרקעין בעסקת דירה</a>.
```

Reason:

The cost page has strong commercial demand but should not carry the broad money hub alone.

### `/real-estate-appraiser/`

Status: READY AFTER OWNER APPROVAL

Suggested placement:

Near the section comparing appraisal, legal checks and transaction risk.

CMS-ready insert:

```html
שמאי מקרקעין בודק שווי ומצב תכנוני, אבל בעסקת דירה נדרשת גם בדיקה משפטית של הזכויות, החוזה והרישום. ראו גם מתי כדאי לערב <a href="https://jus-tice.co.il/real-estate-attorney/">עורך דין מקרקעין בעסקת נדל"ן</a>.
```

Reason:

Appraiser intent is close to transaction diligence and can naturally support lawyer-lead conversion.

### `/real-estate-lawyer-guide/`

Status: BLOCKED / ROUTE RISK

Do not add or promote this page in the edit batch until live QA confirms:

- Final URL stays `/real-estate-lawyer-guide/`.
- Canonical is `/real-estate-lawyer-guide/`.
- H1/body are real guide content, not homepage content.
- Page links contextually to `/real-estate-attorney/`.

If repaired, use this CMS-ready insert:

```html
מדריך זה מסביר את תחום דיני המקרקעין באופן כללי. אם אתם לפני חתימה, תשלום, רישום בטאבו או משא ומתן על דירה, עברו לעמוד המרכזי על <a href="https://jus-tice.co.il/real-estate-attorney/">עורך דין מקרקעין לעסקת נדל"ן</a>.
```

## Hold items

Do not edit in this batch:

| URL | Status | Reason |
|---|---|---|
| Hebrew shared-apartment partition article | HOLD | Family/real-estate overlap; coordinate with Family/Divorce internal-link plan. |
| `/marital-property-agreement/` | HOLD | Family property agreement overlap; avoid breaking Family/Divorce pillar map. |
| `/spouse-property-registration-guide/` | HOLD | High-click family/real-estate overlap; coordinate before adding cross-cluster links. |
| Hebrew real-estate consultant slug | HOLD | Needs content-quality review; may be advisory/non-legal rather than lawyer-lead intent. |

## De-emphasize items

Preserve these pages, but do not add them to the Israeli real-estate lawyer hub flow in this batch:

- `/low-value-invest-abroad/`
- `/buying-property-in-greece/`
- `/investing-in-greece-real-estate/`
- `/apartment/`
- `/real-estate-united-kingdom/`
- `/portugal-real-estate/`

Reason:

They may have traffic, but the business value and lawyer-lead routing differ from Israeli property-law intent. They should be handled later as an international real-estate or investment-content cluster.

## Anti-cannibalization rules

Must not be skipped:

- `/real-estate-attorney/` remains the only primary broad commercial hub.
- `/lawyer-for-buying-or-selling-a-house/` remains purchase/sale support.
- `/registration-of-real-estate-israel/` remains registry/Tabu support.
- `/land-appreciation-tax/` remains tax support.
- `/real-estate-lawyer-cost-2025/` remains cost support.
- `/real-estate-appraiser/` remains appraisal support.
- `/real-estate-lawyer-guide/` remains blocked until route QA passes.
- No page should receive a title/H1 that makes it compete with the broad hub unless the whole URL plan is reopened.

## Redirect and canonical notes

No redirects in this batch.

No canonical changes in this batch.

No noindex changes in this batch.

No sitemap changes in this batch except later normal sitemap refresh after approved public content edits.

Future slug `/real-estate-lawyer/` remains blocked until route/CMS audit and migration map are approved. Do not link to it yet.

## Internal-link map

Required links after approval:

| Source | Target | Anchor | Status |
|---|---|---|---|
| `/real-estate-attorney/` | `/lawyer-for-buying-or-selling-a-house/` | קניית או מכירת דירה | READY |
| `/real-estate-attorney/` | `/registration-of-real-estate-israel/` | רישום זכויות מקרקעין וטאבו | READY |
| `/real-estate-attorney/` | `/land-appreciation-tax/` | מס שבח ומיסוי מקרקעין | READY |
| `/real-estate-attorney/` | `/real-estate-lawyer-cost-2025/` | עלות עורך דין בעסקת מקרקעין | READY |
| `/real-estate-attorney/` | `/real-estate-appraiser/` | שמאי מקרקעין ובדיקת שווי | READY |
| `/lawyer-for-buying-or-selling-a-house/` | `/real-estate-attorney/` | עורך דין מקרקעין לקניית או מכירת דירה | READY |
| `/registration-of-real-estate-israel/` | `/real-estate-attorney/` | ליווי עורך דין מקרקעין בעסקת נדל"ן | READY |
| `/land-appreciation-tax/` | `/real-estate-attorney/` | עורך דין מקרקעין שמלווה את העסקה | READY |
| `/real-estate-lawyer-cost-2025/` | `/real-estate-attorney/` | עורך דין מקרקעין בעסקת דירה | READY |
| `/real-estate-appraiser/` | `/real-estate-attorney/` | עורך דין מקרקעין בעסקת נדל"ן | READY |
| `/real-estate-lawyer-guide/` | `/real-estate-attorney/` | עורך דין מקרקעין לעסקת נדל"ן | BLOCKED |

## Upload checklist

Before upload:

1. Back up each source page body and SEO fields.
2. Confirm owner approval for the exact Hebrew insert text.
3. Confirm the business can receive real-estate leads.
4. Confirm no fake "recommended", "expert", "best" or "free consultation" claim remains unless substantiated.
5. Recheck all source URLs return 200 and self-canonicalize.
6. Keep `/real-estate-lawyer-guide/` out of the batch unless route QA passes.

During upload:

1. Edit hub first.
2. Edit one support page at a time.
3. Add only one contextual link per support page.
4. Do not change slugs, canonicals, redirects, robots or taxonomy.
5. Save screenshots or HTML exports for before/after evidence.

After upload:

1. Fetch every edited URL as Googlebot-style HTML.
2. Confirm HTTP 200, no noindex, correct canonical and the expected link exists.
3. Confirm hub links back to support pages.
4. Confirm sitemap still includes edited URLs.
5. Request GSC URL inspection/indexing only after the batch is stable.
6. Monitor GSC query/page movement for `עורך דין מקרקעין`, `עורך דין נדלן`, `עורך דין קניית דירה`, `עורך דין מכירת דירה`, `מס שבח`, `רישום זכויות מקרקעין`.

## What can publish first

After approval, first public batch:

1. `/real-estate-attorney/` hub intro and hub navigation block.
2. `/lawyer-for-buying-or-selling-a-house/` support-to-hub insert.
3. `/registration-of-real-estate-israel/` support-to-hub insert.
4. `/land-appreciation-tax/` support-to-hub insert.
5. `/real-estate-lawyer-cost-2025/` support-to-hub insert.
6. `/real-estate-appraiser/` support-to-hub insert.

## What should wait

- `/real-estate-lawyer-guide/` until route QA is fixed.
- Family/real-estate overlap pages until the Family/Divorce cluster map is coordinated.
- International real-estate pages until a separate business strategy exists.
- `/real-estate-lawyer/` future slug until migration, redirects, sitemap, canonical and route plan are approved.

## Verification in this cycle

- VERIFIED LIVE: 7 public URLs fetched read-only.
- VERIFIED LIVE: `/real-estate-attorney/` returned 200 and self-canonicalized.
- VERIFIED LIVE: five support pages returned 200 and self-canonicalized.
- BLOCKED LIVE: `/real-estate-lawyer-guide/` currently resolves to homepage content/canonical.
- NOT PUBLISHED: no CMS/database/page/redirect/canonical/sitemap/taxonomy edit was made.

## Safety

This package is repo documentation only. It did not change public article bodies, WordPress database rows, titles, H1s, meta descriptions, URL slugs, redirects, canonicals, robots/noindex rules, taxonomy terms, sitemap settings, lawyer profiles, lead records, payment settings, GA4/GSC settings, wp-admin settings or uPress deployment state.
