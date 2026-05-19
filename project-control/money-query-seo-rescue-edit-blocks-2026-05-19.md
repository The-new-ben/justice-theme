# Money Query SEO Rescue Edit Blocks - 2026-05-19

Status: VERIFIED PLANNING / REVIEW ONLY / NO PUBLIC CHANGES

Cycle time: 2026-05-19 11:17 Asia/Jerusalem

## Scope

This package prepares exact owner-review edit blocks for the two highest-value money-query rescue pages from `project-control/money-query-seo-rescue-batch-001-2026-05-18.md`.

Reviewed pages:

1. `/real-estate-attorney/`
2. `/criminal-defense-attorney/`

These are not CMS-ready approvals. They are controlled edit instructions for title/H1/meta/intro/CTA/internal links while preserving the current URLs.

## Evidence Used

- `content-master/gsc/gsc-url-summary.csv`
- `project-control/gsc-money-query-opportunity-map-2026-05-18.csv`
- `project-control/money-query-seo-rescue-batch-001-2026-05-18.md`
- `project-control/real-estate-support-to-hub-map-2026-05-18.csv`
- `project-control/criminal-law-support-to-hub-map-2026-05-18.csv`
- Live Googlebot-style checks run on 2026-05-19.

Live verification:

| URL | HTTP | Canonical | Robots | Status |
|---|---:|---|---|---|
| `/real-estate-attorney/` | 200 | self-canonical | index, follow | VERIFIED |
| `/criminal-defense-attorney/` | 200 | self-canonical | index, follow | VERIFIED |

Supporting link target checks:

- VERIFIED 200: `/real-estate-lawyer-guide/`
- VERIFIED 200: `/lawyer-for-buying-or-selling-a-house/`
- VERIFIED 200: `/registration-of-real-estate-israel/`
- VERIFIED 200: `/real-estate-lawyer-cost-2025/`
- VERIFIED 200: `/lawyers/?area=real-estate-law`
- VERIFIED 200: `/police-investigation-rights/`
- VERIFIED 200: `/criminal-lawyer-cost/`
- VERIFIED 200: `/how-much-will-a-criminal-defense-lawyer-cost/`
- VERIFIED 200: `/apply-for-police-criminal-information-certificates/`
- VERIFIED 200: `/sex-crime-lawyer/`
- VERIFIED 200: `/drug-related-crime/`
- VERIFIED 200: `/lawyers/?area=criminal-law`
- REVIEW: `/articles/criminal-indictment/` redirects; use `/criminal-indictment/` or `/indictment-cancellation/` only after page-role review.

## Page 1 - `/real-estate-attorney/`

### Current Risk

GSC summary: 17 clicks, 88,601 impressions, 0.02% CTR, average position 58.6.

Live page currently uses:

- Title: `עורך דין מקרקעין מומלץ | עורך דין מקרקעין מחיר | ייעוץ חינם | Jus-Tice.co.il`
- H1: `עורך דין מקרקעין מומלץ | עורך דין מקרקעין מחיר | ייעוץ חינם`

Risk:

- `מומלץ` and `ייעוץ חינם` are trust/offer claims that should not be used unless substantiated and approved.
- The title/H1 read like a keyword stack instead of a clear legal-service page.
- The page should become the commercial hub for real-estate lawyer matching, while support pages keep transaction, registration, price and guide intent.

### Recommended SEO Title

`עורך דין מקרקעין: קנייה, מכירה, חוזים ורישום זכויות | Jus-Tice`

### Recommended H1

`עורך דין מקרקעין לקנייה, מכירה ורישום נכס`

### Recommended Meta Description

`מדריך מעשי למציאת עורך דין מקרקעין: בדיקות לפני קנייה או מכירה, חוזה, טאבו, מיסוי, מסירה מקבלן ומתי לפנות לייעוץ משפטי.`

### Recommended Intro Block

```html
<p>עסקת מקרקעין היא בדרך כלל אחת ההחלטות הכספיות הגדולות ביותר שאדם מקבל. לפני חתימה על חוזה קנייה, מכירה, העברה או רישום זכויות, חשוב להבין מה בדיוק נבדק: זהות בעלי הזכויות, מצב הרישום בטאבו או ברשות מקרקעי ישראל, משכנתאות ושעבודים, היתרי בנייה, מסים, מועדי מסירה וסיכונים שמופיעים רק במסמכים.</p>

<p>עורך דין מקרקעין יכול לעזור בבדיקת העסקה, בניסוח או בדיקת החוזה, בניהול המשא ומתן, ברישום הזכויות ובהתמודדות עם בעיות כמו איחור במסירה, מחלוקת בין שותפים, חריגות בנייה או דרישות מס. המטרה של Jus-Tice היא לעזור לכם להבין איזה סוג ליווי משפטי נדרש לפני שמתקדמים לעסקה או לפנייה לעורך דין.</p>
```

### Recommended Practical Section

```html
<h2>מתי כדאי לפנות לעורך דין מקרקעין?</h2>
<ul>
  <li>לפני חתימה על זיכרון דברים, חוזה רכישה או חוזה מכירה.</li>
  <li>כאשר יש פער בין הרישום בפועל לבין מה שהמוכר או הקבלן מציגים.</li>
  <li>לפני רכישת דירה מקבלן, דירה יד שנייה, מגרש, משרד או נכס מסחרי.</li>
  <li>כאשר קיימים שעבודים, הערות אזהרה, חריגות בנייה או מחלוקת בין בעלים.</li>
  <li>כאשר צריך להבין מס רכישה, מס שבח, היטל השבחה או רישום זכויות.</li>
</ul>
```

### Recommended CTA Block

```html
<p><strong>צריכים להבין איזה עורך דין מתאים לעסקת מקרקעין?</strong> השאירו פרטים עם סוג העסקה, מיקום הנכס והשלב שבו אתם נמצאים. הפנייה תיבדק לפי תחום, דחיפות ואזור, ללא הבטחה לתוצאה משפטית וללא תחליף לייעוץ פרטני.</p>
```

### Recommended Internal Links

Add contextual links from the body, not only related cards:

| Destination | Anchor Direction | Role |
|---|---|---|
| `/real-estate-lawyer-guide/` | `מדריך לדיני מקרקעין` | explanatory support |
| `/lawyer-for-buying-or-selling-a-house/` | `עורך דין לקנייה או מכירה של דירה` | transaction support |
| `/registration-of-real-estate-israel/` | `רישום זכויות בטאבו וברשות מקרקעי ישראל` | registration support |
| `/real-estate-lawyer-cost-2025/` | `כמה עולה עורך דין מקרקעין` | price-intent support |
| `/lawyers/?area=real-estate-law` | `חיפוש עורכי דין בתחום מקרקעין` | directory path |

### Inbound Link Requests

When owner approves CMS edits, add support-to-hub links from:

- `/real-estate-lawyer-guide/`
- `/lawyer-for-buying-or-selling-a-house/`
- `/registration-of-real-estate-israel/`
- `/real-estate-lawyer-cost-2025/`

Use anchors around `עורך דין מקרקעין`, `ליווי משפטי בעסקת מקרקעין`, and `בדיקת חוזה מקרקעין`, not generic `קראו עוד`.

## Page 2 - `/criminal-defense-attorney/`

### Current Risk

GSC summary: 10 clicks, 62,561 impressions, 0.02% CTR, average position 56.4.

Live page currently uses:

- Title: `עורך דין פלילי | עו"ד פלילי | משרדי עורכי דין פליליים`
- H1: `עורך דין פלילי בישראל: המדריך המלא | מעודכן 2026`

Risk:

- The title is short and broad but does not expose urgent intent: investigation, arrest, hearing, indictment.
- The H1 reads as an informational guide, while the GSC target is a commercial defense-lawyer hub.
- Some existing support links are good, but the page needs a clearer above-the-fold user path and safer sensitive-topic language.

### Recommended SEO Title

`עורך דין פלילי: חקירה, מעצר, שימוע וכתב אישום | Jus-Tice`

### Recommended H1

`עורך דין פלילי לפני חקירה, מעצר או כתב אישום`

### Recommended Meta Description

`מדריך מעשי למי שצריך עורך דין פלילי: זכויות לפני חקירה, מעצר, שימוע, כתב אישום, רישום פלילי ומה להכין לפני פנייה.`

### Recommended Intro Block

```html
<p>כאשר מתקבל זימון לחקירה, מתבצע מעצר, נפתח תיק פלילי או נשקל כתב אישום, הזמן שבו מקבלים החלטות ראשונות חשוב מאוד. לפני שמוסרים גרסה, חותמים על מסמך או מגיעים לדיון, כדאי להבין מה הזכויות, מה שלב ההליך, אילו מסמכים קיימים ומה הסיכון המשפטי האפשרי.</p>

<p>עורך דין פלילי מלווה חשודים, נחקרים ונאשמים מול המשטרה, התביעה, הפרקליטות ובתי המשפט. הליווי יכול להתחיל עוד לפני חקירה, להמשיך בדיוני מעצר ושחרור, בשימוע לפני כתב אישום, במשא ומתן מול התביעה, בניהול תיק פלילי ובטיפול ברישום פלילי. Jus-Tice מרכז מידע מעשי ועוזר לכוון את הפנייה לפי סוג ההליך והדחיפות.</p>
```

### Recommended Practical Section

```html
<h2>באילו מצבים פנייה מוקדמת לעורך דין פלילי חשובה במיוחד?</h2>
<ul>
  <li>זימון לחקירה במשטרה או חקירה באזהרה.</li>
  <li>מעצר, בקשה להארכת מעצר או שחרור בתנאים.</li>
  <li>מכתב יידוע, שימוע לפני כתב אישום או כתב אישום שכבר הוגש.</li>
  <li>חשד לעבירות אלימות, רכוש, סמים, מין, מרמה, מס או צווארון לבן.</li>
  <li>בקשה למחיקת רישום פלילי או טיפול בהשלכות של תיק קודם.</li>
</ul>
```

### Recommended CTA Block

```html
<p><strong>קיבלתם זימון לחקירה, נעצרתם או הוגש כתב אישום?</strong> השאירו פרטים קצרים על שלב ההליך, סוג החשד והדחיפות. הפנייה תיבדק לצורך התאמה ראשונית לעורך דין בתחום הפלילי, בלי הבטחה לתוצאה ובלי להחליף ייעוץ משפטי פרטני.</p>
```

### Recommended Internal Links

Add contextual links from the body, not only related cards:

| Destination | Anchor Direction | Role |
|---|---|---|
| `/police-investigation-rights/` | `זכויות בחקירה משטרתית` | investigation support |
| `/criminal-lawyer-cost/` | `כמה עולה עורך דין פלילי` | price-intent support |
| `/apply-for-police-criminal-information-certificates/` | `רישום פלילי ותעודת מידע פלילי` | record support |
| `/sex-crime-lawyer/` | `עורך דין עבירות מין` | sensitive subpractice |
| `/drug-related-crime/` | `עבירות סמים` | subpractice support |
| `/lawyers/?area=criminal-law` | `חיפוש עורכי דין בתחום הפלילי` | directory path |

### Inbound Link Requests

When owner approves CMS edits, add support-to-hub links from:

- `/police-investigation-rights/`
- `/criminal-lawyer-cost/`
- `/how-much-will-a-criminal-defense-lawyer-cost/`
- `/apply-for-police-criminal-information-certificates/`
- `/sex-crime-lawyer/`
- `/drug-related-crime/`

Use anchors around `עורך דין פלילי`, `ייעוץ לפני חקירה`, `ליווי בהליך פלילי`, and `ייצוג בעבירות פליליות`.

## Do Not Change Yet

- Do not redirect `/real-estate-attorney/` or `/criminal-defense-attorney/`.
- Do not canonicalize support pages into the hubs.
- Do not delete or noindex support pages.
- Do not add `Review` or `AggregateRating` schema.
- Do not use fake ranking language such as `מומלץ`, `הכי טוב`, `מוביל`, `אמין`, or guaranteed-result wording.
- Do not overwrite existing strong body content without backup.
- Do not add city-lawyer claims unless real lawyer coverage exists.
- Do not publish without owner approval.

## Upload Order Recommendation

1. Owner approves this edit block package.
2. Back up current CMS body, title, H1, SEO title, meta, schema and related-card settings for both URLs.
3. Apply `/real-estate-attorney/` title/H1/meta/intro/CTA/internal links first.
4. QA `/real-estate-attorney/`: HTTP 200, self-canonical, indexable, no trust-claim leak, all new links 200.
5. Apply `/criminal-defense-attorney/` title/H1/meta/intro/CTA/internal links.
6. QA `/criminal-defense-attorney/`: HTTP 200, self-canonical, indexable, no trust-claim leak, all new links 200.
7. Monitor GSC query/page changes after recrawl.

## Ready

- VERIFIED: two high-impression money URLs selected.
- VERIFIED: current live URL/index/canonical state checked.
- VERIFIED: support-link targets checked for live 200 status.
- READY FOR REVIEW: exact title/H1/meta/intro/CTA/internal-link blocks.

## Still Blocked

- BLOCKED: owner approval before CMS edits.
- BLOCKED: legal/source review before publishing sensitive criminal-law copy.
- BLOCKED: no GSC post-change monitoring can happen until public edits are approved and indexed.

## Safety

This cycle created repo-only planning files and ran read-only live checks. No public CMS/database row, article body, title, H1, meta description, URL slug, redirect, noindex, canonical, sitemap, taxonomy, internal link, related-card, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment was changed.
