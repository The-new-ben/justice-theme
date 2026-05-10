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

Run the next same process for:
- page-to-query check for `/`, `/real-estate-lawyer-cost-2025/`, malpractice fee article and the high-impression PDFs
- `קניית דירה`
- `חוזה מכר`
- `רשלנות רפואית בלידה`
- `רשלנות רפואית בהריון`
- `תאונת עבודה`
- `תאונת דרכים`
- high-impression PDF/document URLs
- homepage low-CTR / position 5-20 opportunities
