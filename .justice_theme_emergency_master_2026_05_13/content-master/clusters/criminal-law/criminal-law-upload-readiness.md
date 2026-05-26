# Criminal Law Upload Readiness Report
**Date:** 2026-05-13  
**Status:** NOT_SAFE_YET

---

## Verdict: NOT_SAFE_YET

Criminal Law cannot be uploaded or migrated until the blockers below are resolved.

---

## Cluster Stats

| Metric | Value |
|---|---|
| Total rows | 175 |
| Rows with real post_id | 173 (99%) |
| Rows missing post_id | 2 |
| Rows with wp_status | 173 (99%) |
| Rows with content body file | 175 (100%) |
| Rows with practice_area from WP | 173 (99%) |
| Rows with GSC 3m data | 28 (16%) |
| Rows with GSC 12m data | 175 (100%) |
| Rows with top_queries | 19 (11%) |
| HIGH traffic rows | 13 |
| MEDIUM traffic rows | 82 |
| LOW traffic rows | 80 |
| Cannibalization groups | 3 |
| READY_FOR_REVIEW | 160 |
| DO_NOT_TOUCH | 13 |

---

## What Is Complete

- **post_id:** 173/175 rows have real WordPress post IDs. 2 rows are non-WP URLs (PDFs or external).
- **content_body:** 175/175 rows have content body files referenced. Physical file match needs spot-check.
- **practice_area from WP REST:** 173/175 rows have real practice-area taxonomy from WordPress (mainly `משפט פלילי` = criminal-law, ID 170).
- **GSC 12m traffic data:** All 175 rows have real 12-month click/impression data.
- **Traffic risk classification:** All rows classified (HIGH/MEDIUM/LOW).
- **Pillar-support map:** Draft created with 17 pillar and sub-pillar nodes.

## What Is Incomplete

1. **GSC 3m data:** Only 28/175 rows have 3-month GSC data. Most criminal pages have low recent traffic. This is not a blocker but limits trend analysis.
2. **Top queries:** Only 19/175 rows have query data populated. The remaining rows had no matching query+page data in GSC 3m. Not a blocker for structure but limits keyword targeting.
3. **Rank Math SEO meta:** Not pulled for any row. Requires authenticated WP REST API access (Application Password). Not a hard blocker but important for title/meta optimization.
4. **Backlink data:** Not available for any row. Marked NEEDS_BACKLINK_TOOL. Not blocking structure but blocks safe redirect decisions for HIGH traffic URLs.
5. **Internal link map:** Not yet created. Needs content body parsing to identify existing internal links. Not blocking readiness assessment but needed before implementation.
6. **Content quality audit:** Not done at article level. Word count, H1/H2 structure, and quality scores not populated for most rows.

---

## Blockers Preventing Upload

### HARD BLOCKERS (must resolve before ANY upload)

1. **No main pillar page exists.** The main criminal law pillar page (`עורך דין פלילי`) does not exist on the site. It must be created before restructuring support pages around it.
2. **13 HIGH traffic URLs must not be changed.** These URLs have 100+ clicks or 20,000+ impressions in 12 months. Any URL change, slug change, or redirect for these pages requires explicit owner approval with backlink analysis first.
3. **Redirect plan is DRAFT only.** No redirect has been approved. All 175 rows have `implementation_status = DRAFT_ONLY_DO_NOT_IMPLEMENT`.
4. **Owner has not reviewed or approved the cluster map.** The 175-row classification and the pillar-support hierarchy have not been seen or approved by the site owner.
5. **No rollback plan exists.** If something goes wrong during upload, there is no tested rollback mechanism on the live site.
6. **No safe plugin exists.** The Justice Content Ops plugin has not been built yet. The old jt-deploy plugin is DANGEROUS and must not be used.

### SOFT BLOCKERS (should resolve before upload but not strictly required)

7. **2 rows missing post_id.** These are likely non-article URLs (PDFs, external). Should be verified.
8. **Backlink data missing.** Cannot safely redirect any HIGH traffic URL without knowing inbound links.
9. **Rank Math meta not pulled.** Cannot optimize titles/descriptions without knowing current SEO settings.
10. **Internal link map missing.** Cannot properly plan internal linking strategy without parsing content bodies.

---

## HIGH Traffic URLs — DO NOT TOUCH

These 13 URLs must NOT be changed without explicit owner approval:

| Clicks 12m | Impressions 12m | URL (truncated) |
|---|---|---|
| 474 | 116,816 | תחנות-משטרה-כתובת-... |
| 302 | 23,380 | lahav-433/ |
| 232 | 37,574 | מחירון-מומלץ-עורך-דין-פלילי/ |
| 217 | 22,996 | how-much-will-a-criminal-defense-lawyer-cost/ |
| 187 | 38,238 | apply-for-police-criminal-information-certificates/ |
| 162 | 11,082 | shoplifting/ |
| 146 | 4,313 | הרשעת-נאשם-בעבירות/ |
| 132 | 2,099 | פסק-דין-... |
| 127 | 13,480 | מחיקת-רישום-פלילי/ |
| 103 | 5,334 | פסק-דין-... |
| ~100+ | varies | 3 additional rows above threshold |

---

## Proposed Pillars (17 nodes)

1. **MAIN PILLAR:** עורך דין פלילי (Criminal Defense Lawyer) — NEEDS CREATION
2. חקירה במשטרה (Police Investigation)
3. זכויות נחקר (Suspect Rights)
4. מעצר (Arrest)
5. כתב אישום (Indictment)
6. רישום פלילי / מחיקת רישום (Criminal Record)
7. עבירות סמים (Drug Offenses)
8. עבירות מין (Sex Offenses)
9. עבירות אלימות (Violence)
10. צווארון לבן (White Collar)
11. גניבה / שוד / רכוש (Property Crimes)
12. הליך פלילי (Criminal Process)
13. שימוע לפני כתב אישום (Pre-Indictment Hearing) — support
14. הסדר מותנה (Conditional Arrangement) — support
15. סגירת תיק פלילי (Case Closure) — support
16. עלות עורך דין פלילי (Criminal Lawyer Cost) — support
17. להב 433 (Lahav 433) — support

---

## What Must Be Approved by Owner

1. The 175-row cluster classification — is every row correctly assigned?
2. The 17-node pillar-support hierarchy — is this the right structure?
3. The 13 HIGH traffic URL protection list — confirmed no changes?
4. The proposed English slugs for new pillar pages
5. Content merge decisions for overlapping articles
6. Timeline for creating the main pillar page
7. Which lawyer(s) to name as reviewer for E-E-A-T

---

## Recommendation

**Proceed to owner review of the cluster map and pillar hierarchy.**  
Do NOT build the import plugin or execute any URL changes until the owner approves the structure.

Next steps:
1. Present `criminal-law-master-map.csv` (175 rows) to owner
2. Present `criminal-law-pillar-support-map.csv` (17 pillars) to owner
3. Get owner decision on HIGH traffic URL protection
4. Build Justice Content Ops plugin with dry-run only
5. Run dry-run validation on 5 LOW traffic criminal law articles as proof of concept
