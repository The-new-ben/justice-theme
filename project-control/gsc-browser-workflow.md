# GSC Browser Workflow

Date: 2026-05-10
Status: ACTIVE - browser UI access verified

## Access Status

VERIFIED:
- Google Search Console browser access is available for `https://jus-tice.co.il/`.
- Access was completed through the owner-authorized Google account. The account email/password are not recorded in this repo.
- Property opened: `https://jus-tice.co.il/`.
- Performance report opened: Search results / Performance.
- Date range checked: last 3 months.

NOT VERIFIED:
- Search Console API credentials.
- Full CSV export from GSC. The in-app browser shows the export menu, but file downloads are not supported by the current browser tool.
- 12-month comparison.

## Browser-Only Workflow Used

1. Open GSC property `https://jus-tice.co.il/`.
2. Go to Performance -> Search results.
3. Confirm date range: last 3 months.
4. Use query filters with `Queries containing`.
5. For each keyword, check:
   - summary metrics: clicks, impressions, CTR, average position
   - Queries tab
   - Pages tab
6. Record visible GSC rows into repo CSVs.

Browser shortcut used for repeatable filtered views:

```text
https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fjus-tice.co.il%2F&query=*KEYWORD
```

The `query=*KEYWORD` view corresponds to a query-contains filter in the GSC UI.

## First Session Summary

Date range:
- Last 3 months.

Site totals visible in GSC:
- 482 clicks.
- 72.9K impressions.
- 0.7% CTR.
- Average position 33.8.

Keywords checked:
- `עורך דין פלילי`
- `דין פלילי`
- `עורך דין גירושין`
- `גישור גירושין`
- `עורך דין לענייני משפחה`

Important finding:
- The competitive terms are not currently led by clean pillar URLs.
- Google is often associating queries with old Hebrew slugs, uploaded documents, homepage, and scattered legacy articles.

Evidence:
- Screenshot: `project-control/visual-evidence/gsc-family-lawyer-pages-2026-05-10.png`

## Files Produced

- `project-control/gsc-cannibalization-review.csv`
- `project-control/gsc-keyword-page-map.csv`
- `project-control/gsc-content-priorities.csv`
- `project-control/gsc-cannibalization-method.md`

## Limitations

- Browser UI rows are visible sample rows, not a full exported GSC dataset.
- GSC can truncate or omit anonymized query data.
- Filtering by query can change totals because data is aggregated differently by query/page.
- Download CSV is blocked by the in-app browser. Google Sheets export was visible but did not complete through the automation.
- API export is still the preferred full-data path later.

## Next GSC Session

Completed in second browser pass:
- `עורך דין מקרקעין`
- `עורך דין רשלנות רפואית`
- `עורך דין נזיקין`
- `עורך דין תעבורה`

Second pass findings:
- `עורך דין מקרקעין`: 153 impressions, 0 clicks, average position 15.8. Pages visible: homepage with 136 impressions and `/real-estate-lawyer-cost-2025/` with 17 impressions. This is a strong page-2 opportunity and a weak-primary-page signal.
- `עורך דין רשלנות רפואית`: 1.34K impressions, 0 clicks, average position 49.5. Top visible query variants are birth, pregnancy and c-section malpractice. Visible Pages tab exposed the fee article `/articles/שכר-טרחה-עורך-דין-רשלנות-רפואית/`, so full export/deeper review is needed before final mapping.
- `עורך דין נזיקין`: 2 impressions, 0 clicks, average position 48. Low sample, but the only visible URL is an old Hebrew verdict/topic URL, not a clean personal-injury pillar.
- `עורך דין תעבורה`: 15 impressions, 0 clicks, average position 45.8. Homepage receives most impressions; no clean traffic-lawyer pillar owns the query.

Second pass evidence:
- Screenshot: `project-control/visual-evidence/gsc-pass-2-traffic-law-2026-05-10.png`

## Page-To-Query Pass

Completed in third browser pass:
- `https://jus-tice.co.il/real-estate-lawyer-cost-2025/`
- `https://jus-tice.co.il/wp-content/uploads/2022/06/06102016_1.pdf`
- `https://jus-tice.co.il/wp-content/uploads/2023/03/ATTORNEY-LIST-December-2017-1.pdf`
- `https://jus-tice.co.il/wp-content/uploads/2023/05/Italy_List_of_English-speaking_lawyers.pdf`

Page-to-query findings:
- `/real-estate-lawyer-cost-2025/`: 2 clicks, 3.85K impressions, 0.1% CTR, average position 50.1. Queries are mostly sale/purchase apartment lawyer cost/payment intent, so this should become a strong support page for `/real-estate-lawyer/`, not the main pillar.
- `06102016_1.pdf`: 99 clicks, 928 impressions, 10.7% CTR, average position 8.1. This is a real high-traffic media URL around Israel Securities Authority/personnel/contact queries. Do not remove during media cleanup.
- `ATTORNEY-LIST-December-2017-1.pdf`: 19 clicks, 1.39K impressions, 1.4% CTR, average position 13.5. Search intent is foreign/Greece lawyer list, not core Israeli legal marketplace.
- `Italy_List_of_English-speaking_lawyers.pdf`: 9 clicks, 1.35K impressions, 0.7% CTR, average position 11.1. Search intent is Italy/foreign lawyer list, not core Israeli legal marketplace.

Page-to-query limitations:
- Root homepage page filtering via direct browser URL behaved like broad property data, so it is not used as homepage-only proof.
- One Hebrew article URL from the malpractice query-to-page pass did not return reliable page-filter data through direct URL filtering; retry via visible UI controls or API/export later.

Page-to-query evidence:
- Screenshot: `project-control/visual-evidence/gsc-page-query-pdf-06102016-2026-05-10.png`
- CSV: `project-control/gsc-page-query-review.csv`

Run the next same process for:
- `קניית דירה`
- `חוזה מכר`
- `רשלנות רפואית בלידה`
- `רשלנות רפואית בהריון`
- `תאונת עבודה`
- `תאונת דרכים`
- high-impression PDF/document URLs
- homepage low-CTR / position 5-20 opportunities

## Support Cluster Query Pass

Completed in fourth browser pass:
- `קניית דירה`
- `חוזה מכר`
- `רשלנות רפואית בלידה`
- `רשלנות רפואית בהריון`
- `תאונת עבודה`
- `תאונת דרכים`

Support cluster findings:
- `קניית דירה`: 885 impressions, 0 clicks, average position 71.2. `/real-estate-lawyer-cost-2025/` owns 871 impressions, meaning the cost article is overloaded and should support a stronger `/buying-apartment/` page plus `/real-estate-lawyer/`.
- `חוזה מכר`: 31 impressions, 0 clicks, average position 75.6. Only `/real-estate-lawyer-cost-2025/` appears, so `/real-estate-purchase-agreement/` is missing or too weak.
- `רשלנות רפואית בלידה`: 661 impressions, 0 clicks, average position 40.5. Old Hebrew URL `/עורך-דין-רשלנות-רפואית-בלידה-מומלץ/` owns all visible impressions and is a high-risk migration candidate.
- `רשלנות רפואית בהריון`: 419 impressions, 0 clicks, average position 65.9. The same birth-malpractice URL appears, showing pregnancy/birth intent overlap that needs careful splitting or merging.
- `תאונת עבודה`: no visible rows for this exact filter in the last 3 months.
- `תאונת דרכים`: 84 impressions, 0 clicks, average position 57.6. `/car-accident-auto-injury-lawyer/` owns most impressions and must be reviewed before deciding whether `/car-accident-lawyer/` becomes the final slug.

Support cluster evidence:
- Screenshot: `project-control/visual-evidence/gsc-support-pass-car-accident-2026-05-10.png`

Next GSC browser checks:
- variants for work accidents: `עורך דין תאונת עבודה`, `פגיעה בעבודה`, `תאונת עבודה ביטוח לאומי`
- traffic subtopics: `נהיגה בשכרות`, `שלילת רישיון`
- inheritance subtopics: `עורך דין ירושה`, `צוואה`, `התנגדות לצוואה`
- page-to-query checks for `/real-estate-lawyer-cost-2025/`, `/עורך-דין-רשלנות-רפואית-בלידה-מומלץ/`, and `/car-accident-auto-injury-lawyer/`

## Work / Traffic / Inheritance Variant Pass

Completed in fifth browser pass:
- `עורך דין תאונת עבודה`
- `פגיעה בעבודה`
- `תאונת עבודה ביטוח לאומי`
- `נהיגה בשכרות`
- `שלילת רישיון`
- `עורך דין ירושה`
- `צוואה`
- `התנגדות לצוואה`

Variant findings:
- Work accident variants returned no visible rows in the last 3 months. This does not mean the market has no demand; it means Jus-Tice currently has no visible exact-query signal for those checked variants.
- `נהיגה בשכרות`: 8 impressions, 0 clicks, average position 55.3. The visible page is a will-revocation article, so this is a wrong-page match and low-sample traffic-law content gap.
- `שלילת רישיון`: 8 impressions, 0 clicks, average position 6.3. The visible URL is a Ministry of Health license-suspension PDF, and the visible queries are doctor/nurse license revocation, not driver's license suspension.
- `עורך דין ירושה`: no visible rows for the exact query.
- `צוואה`: 201 impressions, 0 clicks, average position 39.6. The query is split across case-law pages, an old Hebrew wills/inheritance page, a will DOCX, probate content and will-revocation content.
- `התנגדות לצוואה`: 121 impressions, 0 clicks, average position 31. The old case-law page `/psakdin/התנגדות-לצוואה-בשל-השפעה-בלתי-הוגנת/` owns 120 impressions.

Variant evidence:
- Screenshot: `project-control/visual-evidence/gsc-variants-pass-wills-2026-05-10.png`

Next GSC browser checks:
- page-to-query checks for `/real-estate-lawyer-cost-2025/`, `/עורך-דין-רשלנות-רפואית-בלידה-מומלץ/`, `/car-accident-auto-injury-lawyer/`, and `/psakdin/התנגדות-לצוואה-בשל-השפעה-בלתי-הוגנת/`
- variants for `עורך דין צוואה וירושה`, `צו קיום צוואה`, `צו ירושה`, `ניהול עיזבון`
- national-insurance variants: `ועדה רפואית`, `קצבת נכות`, `עורך דין ביטוח לאומי`
