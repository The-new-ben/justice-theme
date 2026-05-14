# Criminal Law Exit Review
**Date:** 2026-05-14
**Status:** PARTIAL — Ready for owner review before next field

---

## Layer Status Summary

| Layer | Name | Status | Notes |
|-------|------|--------|-------|
| 1 | Data & Risk Verification | PARTIAL | Master map exists (225K), high-traffic URLs identified |
| 2 | Competitor Playbook | COMPLETE | Semrush data integrated, 10 competitors mapped |
| 3 | Trust Cleanup | NOT_STARTED | Toxic anchors documented, needs Semrush export |
| 4 | Pillar Decision | COMPLETE | `/criminal-defense-attorney/` (ID 857) is safe pillar |
| 5 | Sub-Practice Mapping | COMPLETE | 10 sub-practices mapped with volume/KD |
| 6 | Guide/FAQ Mapping | COMPLETE | 8 guide topics mapped with existing coverage check |
| 7 | Anti-Cannibalization | PARTIAL | 13-page cannibalization documented, not resolved |
| 8 | Internal Linking | PARTIAL | Pillar-spoke links done, homepage/menu not verified |
| 9 | Journeys | PARTIAL | Documented in this review |
| 10 | Technical SEO | PARTIAL | Schema/meta done, sitemap needs server verification |
| 11 | E-E-A-T | COMPLETE | All 18 articles have author, disclaimer, date, sources |
| 12 | Business Alignment | PARTIAL | Lawyer CPT ready, Sharon Nahari profile pending |
| 13 | Authority Plan | NOT_STARTED | Documented, needs execution |
| 14 | Exit Review | THIS DOCUMENT | |

---

## What Was Actually Done (Verified)

### Content Deployed
- **1 Pillar** (Post 857): `/criminal-defense-attorney/` — 22.4K chars, E-E-A-T enriched
- **17 Spoke Articles** (Posts 19257-19304): All published via XML-RPC to `articles` CPT
- **3 Final Spokes Added**: tax-crimes (19300), criminal-negligence (19302), criminal-appeal (19304)
- **Total**: 18 articles live, ~100K+ chars of content

### SEO Infrastructure Added
- FAQPage schema (auto-detects FAQ sections, emits JSON-LD)
- LegalService schema on homepage
- Article schema on all articles (was existing)
- BreadcrumbList schema (was existing)
- Attorney schema on lawyer profiles (was existing)
- XML sitemap generator at `inc/sitemap.php` (serves `/justice-sitemap.xml`)
- SEO meta descriptions set on all 18 articles

### Taxonomy & Organization
- Created `criminal-law` category (ID 730) under Practice Areas (699)
- All 18 articles assigned to criminal-law category
- All articles use English URL slugs

### E-E-A-T Signals on Every Article
- Author: "צוות המשפט הפלילי של ג'סטיס"
- Experience: "ניסיון מעשי של למעלה מעשור"
- Sources: nevo.co.il, kolzchut.org.il, gov.il, knesset.gov.il
- Disclaimer: legal disclaimer on every page
- Date: "עודכן לאחרונה: מאי 2026"

---

## What Is Still Missing

### CRITICAL
1. **Sitemap server verification** — `/justice-sitemap.xml` rewrite rule needs permalink flush after uPress sync
2. **GSC sitemap submission** — 0 sitemaps registered; 0/18 articles indexed by Google
3. **Toxic backlink cleanup** — Casino/gambling spam anchors (payid, mostbet, kasyno) polluting trust
4. **13-page cannibalization** for "עורך דין פלילי" — not resolved yet

### HIGH PRIORITY
5. **Sub-practice pages** not created yet (sex-offences, family-violence, military, white-collar, etc.)
6. **City pages** not created (Tel Aviv KD 12, Beer Sheva KD 0)
7. **Homepage connection** — Criminal Law visibility in Practice Areas section not verified
8. **Menu integration** — Criminal Law in main navigation not verified
9. **Featured images** — No thumbnails set on any new article
10. **Sharon Nahari lawyer profile** — Not yet deployed

### MEDIUM PRIORITY
11. Guide content expansion (כתב אישום 1,900/mo, צו הרחקה 880/mo not covered)
12. Article word count expansion (most are 3-5K chars, competitors at 1,800-2,500 Hebrew words)
13. Review schema (no real reviews to mark up yet)
14. Open Graph images for social sharing
15. robots.txt audit

---

## Pillar Decision

| Property | Value |
|----------|-------|
| Current Pillar URL | `/criminal-defense-attorney/` |
| Post ID | 857 |
| Post Type | articles |
| Content Length | 22,474 chars |
| GSC Status | Crawled, not indexed (last crawl: 2026-03-04) |
| Category | criminal-law (ID 730) |
| Decision | KEEP as pillar. Do NOT change URL. |
| Future URL | Consider `/practice/criminal/` only after authority established |
| Migration Risk | HIGH — URL has GSC history, do not redirect without plan |

---

## Category Page Status

| Property | Value |
|----------|-------|
| Category Name | משפט פלילי |
| Slug | criminal-law |
| ID | 730 |
| Parent | Practice Areas (699) |
| Article Count | 18 |
| URL | `/category/criminal-law/` |
| Type | WP Taxonomy (category) |
| Template | Default archive |
| Has Intro Text | No (needs writing) |
| Has Breadcrumbs | Yes (theme built-in) |
| Links to Pillar | No (needs adding) |
| Shows Correct Articles | Yes |

**Recommended Category Intro (safe to add):**

> משפט פלילי עוסק במצבים שבהם אדם נחקר, חשוד, נאשם או מורשע בעבירה פלילית. בעמוד זה ריכזנו מדריכים ומידע כללי על חקירה במשטרה, זכויות נחקר, מעצר, כתב אישום, רישום פלילי ותחומי ייצוג נפוצים. המידע באתר הוא כללי ואינו מחליף ייעוץ משפטי פרטני.

---

## GSC / Sitemap Status

| Property | Value |
|----------|-------|
| Sitemap Working | NOT VERIFIED (needs uPress sync + permalink flush) |
| Submitted in GSC | No |
| Criminal Pages Included | Yes (in generated XML) |
| Articles Indexed | 0 of 18 |
| Top Criminal Query | "עורך דין פלילי" (14,455 impressions, 13 pages cannibalizing) |
| Top Cannibalization | 13 pages compete for head term |
| Protected URLs | Post 857 (`/criminal-defense-attorney/`) |

---

## Semrush Playbook Integration

| Action | Status |
|--------|--------|
| Toxic anchors documented | COMPLETE (in playbook-actions.csv) |
| Competitor patterns documented | COMPLETE (in competitor-patterns.md) |
| Money keyword pages mapped | COMPLETE (in subpractice-map.csv) |
| Procedure/explainer pages mapped | COMPLETE (in guide-content-map.csv) |
| Silo architecture designed | COMPLETE (in SITE-ARCHITECTURE.md) |
| Location pages mapped | COMPLETE (5 cities identified) |
| Linking rules documented | COMPLETE (in workflow YAML) |
| Authority tasks listed | COMPLETE (in authority-plan.md) |
| Multi-practice future-proofing | COMPLETE (in cluster-priority-plan.csv) |

---

## Ready to Move to Next Field?

**NOT READY.** Remaining blockers:

1. Sitemap must be live and submitted to GSC
2. At least some articles must be indexed
3. Sharon Nahari lawyer profile must be deployed
4. Homepage/menu connection must be verified
5. Category page intro text should be added

**Estimated effort to become ready:** 1 execution session (2-3 hours)

---

## Next 10 Action Items

1. Sync uPress + flush permalinks to activate sitemap
2. Submit `/justice-sitemap.xml` to GSC
3. Deploy Sharon Nahari lawyer profile via XML-RPC
4. Add category intro text for criminal-law
5. Verify homepage Practice Areas links to criminal law
6. Create first sub-practice page: עורך דין סמים (KD 11, quick win)
7. Create first city page: עורך דין פלילי בתל אביב (KD 12, quick win)
8. Expand pillar to 2,500 Hebrew words (currently ~1,800 words)
9. Create כתב אישום guide (1,900/mo, KD 20)
10. Prepare toxic backlink export for disavow review

---

## Honesty Statement

**What I verified:** All 18 articles are live on WordPress (confirmed via XML-RPC success responses). E-E-A-T footers added to all articles (confirmed via enrich-eeat.js output). Category created and assigned (confirmed via assign-categories.js). Meta descriptions set (confirmed). GSC URL inspection ran on all 18 URLs showing 0 indexed. Schema code added to `inc/schema.php` and `inc/sitemap.php` (code committed to Git).

**What I inferred:** Sitemap will work after permalink flush (based on WordPress rewrite rule registration pattern). FAQPage schema will fire correctly (based on regex pattern matching against article HTML).

**What I changed:** Added `inc/sitemap.php`, modified `inc/schema.php` (FAQPage + LegalService), modified `functions.php` (added sitemap include). All changes committed to Git.

**What remains unsafe:** Sitemap not yet verified on live server. No articles indexed by Google yet. Toxic backlinks not cleaned. 13-page cannibalization not resolved. Homepage/menu connection not verified (would need browser access).

**Can we move to next field?** PARTIAL. The content and architecture are solid. The critical blockers are: (1) sitemap live verification, (2) GSC submission, (3) at least a few articles indexed. Once those are confirmed, we can safely begin Family Law or Real Estate Law as the next cluster.
