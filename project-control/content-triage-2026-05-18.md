# Content Triage - 2026-05-18

## Research Basis

- Google's core-update guidance says to assess dropped pages and improve or remove unhelpful content; deleting unhelpful content can help stronger content perform better.
- Google's helpful-content guidance emphasizes people-first content, clear purpose, and content that leaves users satisfied.
- Because this is legal/YMYL-style content, no noindex, deletion, redirect, canonical, title/H1, taxonomy or body change should happen without owner/legal/GSC review.

Sources:
- https://developers.google.com/search/docs/appearance/core-updates
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget

## Inputs Used

- `project-control/url-migration-map.csv`
- `reports/site-health-audit-2026-05-18.csv`
- `content-master/gsc/gsc-url-summary.csv`
- `content-master/content-gap-map.csv`

## Output

- CSV: `project-control/content-triage-2026-05-18.csv`

## Summary

- Total triage candidates: 2055
- P0 protect/rewrite/merge candidates: 821
- P1 review-before-noindex/merge candidates: 612
- P2 owner-approval candidates: 622

## Recommendation Counts

- PROTECT_AND_REWRITE_OR_MERGE: 821
- REVIEW_BEFORE_NOINDEX_OR_MERGE: 585
- HOLD: 470
- MERGE_MAPPING_REVIEW: 93
- NOINDEX_OR_MERGE_CANDIDATE_AFTER_OWNER_APPROVAL: 40
- FIX_TECHNICAL_FIRST: 27
- REWRITE_TRUST_CLAIMS: 19

## Cluster Counts

- needs-classification: 593
- UNKNOWN: 388
- criminal-law: 238
- family-law-divorce: 169
- family-law: 125
- real-estate: 104
- employment-law: 104
- medical-malpractice: 83
- legal-database-rulings: 54
- inheritance-wills: 42
- personal-injury: 41
- traffic-law: 36
- outdated-corona-legacy: 29
- cyber-privacy: 21
- tax-law: 19
- notary-foreign: 9

## Highest-Priority Candidates

1. P0 PROTECT_AND_REWRITE_OR_MERGE: UNKNOWN
   - URL: https://jus-tice.co.il/%D7%AA%D7%97%D7%A0%D7%95%D7%AA-%D7%9E%D7%A9%D7%98%D7%A8%D7%94-%D7%9B%D7%AA%D7%95%D7%91%D7%AA-%D7%98%D7%9C%D7%A4%D7%95%D7%9F-%D7%A8%D7%A9%D7%99%D7%9E%D7%94-%D7%90%D7%A8%D7%A6%D7%99%D7%AA-%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F
   - Cluster: criminal-law
   - Evidence: 482 clicks, 118014 impressions, reasons: direct_gsc_high_value_url|gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
2. P0 PROTECT_AND_REWRITE_OR_MERGE: עורך דין מקרקעין מומלץ | עורך דין מקרקעין מחיר | ייעוץ חינם
   - URL: https://jus-tice.co.il/real-estate-attorney
   - Cluster: real-estate
   - Evidence: 17 clicks, 88601 impressions, reasons: trust_claim_review|gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
3. P0 PROTECT_AND_REWRITE_OR_MERGE: עורך דין פלילי | עו”ד פלילי | משרדי עורכי דין פליליים
   - URL: https://jus-tice.co.il/criminal-defense-attorney
   - Cluster: criminal-law
   - Evidence: 10 clicks, 62561 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
4. P0 PROTECT_AND_REWRITE_OR_MERGE: UNKNOWN
   - URL: https://jus-tice.co.il/%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%93%D7%99%D7%9F/%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%94%D7%93%D7%99%D7%9F-%D7%94%D7%9E%D7%A4%D7%95%D7%A8%D7%A1%D7%9E%D7%99%D7%9D-%D7%91%D7%99%D7%95%D7%AA%D7%A8-%D7%9C%D7%94%D7%92%D7%A0%D7%94-%D7%A4%D7%9C%D7%99%D7%9C
   - Cluster: criminal-law
   - Evidence: 96 clicks, 52640 impressions, reasons: direct_gsc_high_value_url|gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
5. P0 PROTECT_AND_REWRITE_OR_MERGE: UNKNOWN
   - URL: https://jus-tice.co.il/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%94%D7%97%D7%96%D7%A8%D7%99-%D7%9E%D7%A1-%D7%A2%D7%9D-%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F
   - Cluster: tax-law
   - Evidence: 80 clicks, 50948 impressions, reasons: direct_gsc_high_value_url|gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
6. P0 PROTECT_AND_REWRITE_OR_MERGE: בניית אתרים חינם: מהי האופציה לבניית האתרים הטובה ביותר בחינם? | אתר בחינם
   - URL: https://jus-tice.co.il/beginners-guide-how-to-choose-the-best-website-builder
   - Cluster: needs-classification
   - Evidence: 28 clicks, 47788 impressions, reasons: trust_claim_review|gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
7. P0 PROTECT_AND_REWRITE_OR_MERGE: דרכון גרמני לישראלים | עורך דין דרכון גרמני | יתרונות דרכון אזרחות גרמנית
   - URL: https://jus-tice.co.il/german-passport
   - Cluster: needs-classification
   - Evidence: 13 clicks, 46747 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
8. P0 PROTECT_AND_REWRITE_OR_MERGE: עורך דין הגירה | עו”ד הגירה לחו”ל | רילוקיישן לישראלים
   - URL: https://jus-tice.co.il/immigration-lawyer
   - Cluster: needs-classification
   - Evidence: 100 clicks, 43300 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
9. P0 PROTECT_AND_REWRITE_OR_MERGE: מחירים עדכניים (2025) ותחזית לשוק הנדל”ן | רכישת נדל”ן בישראל בלווי עורך דין
   - URL: https://jus-tice.co.il/israel-real-estate-price-forecast
   - Cluster: needs-classification
   - Evidence: 53 clicks, 39708 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
10. P0 PROTECT_AND_REWRITE_OR_MERGE: טופס בקשה לתעודת מידע פלילי | תעודת יושר | היעדר מרשם פלילי
   - URL: https://jus-tice.co.il/apply-for-police-criminal-information-certificates
   - Cluster: criminal-law
   - Evidence: 188 clicks, 38667 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
11. P0 PROTECT_AND_REWRITE_OR_MERGE: UNKNOWN
   - URL: https://jus-tice.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%9E%D7%95%D7%9E%D7%9C%D7%A5-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%A4%D7%9C%D7%99%D7%9C%D7%99
   - Cluster: criminal-law
   - Evidence: 234 clicks, 38017 impressions, reasons: direct_gsc_high_value_url|gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
12. P0 PROTECT_AND_REWRITE_OR_MERGE: איפה הכי זול לקנות דירה בעולם | השקעות נדל”ן בחו”ל לישראלים
   - URL: https://jus-tice.co.il/low-value-invest-abroad
   - Cluster: real-estate
   - Evidence: 128 clicks, 37005 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
13. P0 PROTECT_AND_REWRITE_OR_MERGE: הסכם גירושין דוגמא | תבנית הסכם גירושין | טופס הסכם גירושין בחינם
   - URL: https://jus-tice.co.il/free-divorce-agreement-template
   - Cluster: family-law-divorce
   - Evidence: 185 clicks, 36900 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
14. P0 PROTECT_AND_REWRITE_OR_MERGE: עורך דין קניית דירה | עו”ד מכירת דירה | מומחה בעסקאות מקרקעין
   - URL: https://jus-tice.co.il/lawyer-for-buying-or-selling-a-house
   - Cluster: real-estate
   - Evidence: 3 clicks, 35650 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
15. P0 PROTECT_AND_REWRITE_OR_MERGE: מחיקת רישום משטרתי | ביטול רישום של תיקים סגורים
   - URL: https://jus-tice.co.il/police-records-data-deletion
   - Cluster: needs-classification
   - Evidence: 8 clicks, 34081 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
16. P0 PROTECT_AND_REWRITE_OR_MERGE: מיהו שופט? סוגי שופטים | מהו תפקידו של שופט בית משפט
   - URL: https://jus-tice.co.il/court-judge
   - Cluster: needs-classification
   - Evidence: 235 clicks, 33846 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
17. P0 PROTECT_AND_REWRITE_OR_MERGE: ארצות הברית (ארה”ב) | דסק ארצות הברית USA
   - URL: https://jus-tice.co.il/about-usa
   - Cluster: needs-classification
   - Evidence: 41 clicks, 33775 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
18. P0 PROTECT_AND_REWRITE_OR_MERGE: UNKNOWN
   - URL: https://jus-tice.co.il/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%A6%D7%91%D7%90%D7%99
   - Cluster: UNKNOWN
   - Evidence: 34 clicks, 33065 impressions, reasons: direct_gsc_high_value_url|gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
19. P0 PROTECT_AND_REWRITE_OR_MERGE: מה זה מרב״ד?- מידע על המכון הרפואי לבטיחות בדרכים
   - URL: https://jus-tice.co.il/medical-fitness-tests-for-driving-marvad-info
   - Cluster: needs-classification
   - Evidence: 79 clicks, 32854 impressions, reasons: gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT
20. P0 PROTECT_AND_REWRITE_OR_MERGE: UNKNOWN
   - URL: https://jus-tice.co.il/%D7%90%D7%99%D7%A4%D7%94-%D7%94%D7%9B%D7%99-%D7%9E%D7%A9%D7%AA%D7%9C%D7%9D-%D7%9C%D7%9E%D7%A9%D7%A7%D7%99%D7%A2-%D7%94%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99-%D7%9C%D7%A7%D7%A0%D7%95%D7%AA-%D7%93%D7%99%D7%A8%D7%94-%D7%91%D7%A2%D7%95%D7%9C%D7%9D
   - Cluster: real-estate
   - Evidence: 107 clicks, 31186 impressions, reasons: direct_gsc_high_value_url|gsc_do_not_touch_high_traffic_url
   - Gate: OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT

## High-Value Content Gaps To Connect After Cleanup

1. family-law: איך לבחור עורך דין גירושין (`how-to-choose-divorce-lawyer`)
   - Why: User intent includes comparison and choosing counsel; strong conversion page.
2. family-law: כמה עולה עורך דין גירושין ומה משפיע על המחיר (`divorce-lawyer-cost`)
   - Why: Competitors often answer pricing; high commercial intent.
3. family-law: מסמכים שצריך להכין לפני גירושין (`divorce-documents-checklist`)
   - Why: Practical checklist; good lead magnet/document intent.
4. family-law: גישור גירושין מול הליך בבית משפט (`divorce-mediation-vs-court`)
   - Why: Clarifies decision path; supports mediation and divorce pillar.
5. family-law: הסכם גירושין: מה חייב להופיע בו (`divorce-agreement-checklist`)
   - Why: Document-focused, high user intent.
6. family-law: הסכם ממון לפני נישואין ואחרי נישואין (`prenuptial-agreement-guide`)
   - Why: High-value family-law keyword, supports lawyer leads.
7. family-law: מזונות ילדים: מדריך מעשי להורים (`child-support-guide`)
   - Why: Core family topic; should have practical sources/calculators later.
8. family-law: משמורת וזמני שהות: איך זה עובד (`child-custody-visitation-guide`)
   - Why: Core family topic; currently cannibalization appeared in GSC sample.
9. criminal-law: מה לעשות לפני חקירה במשטרה (`before-police-investigation`)
   - Why: Urgent high-intent criminal lead topic.
10. criminal-law: זכויות נחקר במשטרה (`suspect-rights-police-investigation`)
   - Why: Practical rights-wiki page, strong user value.
11. criminal-law: מעצר ימים: מה המשפחה צריכה לדעת (`pretrial-detention-family-guide`)
   - Why: Urgent, family member search intent.
12. criminal-law: כתב אישום: שלבים, סיכונים ואפשרויות (`indictment-guide`)
   - Why: Core criminal procedure support page.

## Safe Next Actions

1. Review P0 and P1 rows first; do not noindex, delete, redirect, canonicalize or merge any URL with GSC evidence until owner/legal approval.
2. For outdated corona rows with no visible GSC protection, prepare a batch proposal: keep as historical archive, merge into a current practical guide, or noindex after approval.
3. For trust-claim rows such as "מומלץ", "מובילים", "ייעוץ חינם", rewrite claims into factual, source-safe language before public upload.
4. For medical-malpractice and family-law conflicts, map support pages to the recovered commercial hubs before adding new content.

## Safety

This cycle created analysis artifacts only. No public CMS/database row, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.
