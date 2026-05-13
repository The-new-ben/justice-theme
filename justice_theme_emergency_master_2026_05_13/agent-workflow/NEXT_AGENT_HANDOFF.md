# NEXT AGENT HANDOFF
**Date:** 2026-05-13  
**Prepared by:** Antigravity (emergency consolidation session)  
**Canonical folder:** `C:\Users\pro\justice\justice-theme\justice_theme_emergency_master_2026_05_13\`

---

## 1. What Was Reviewed

- Root `justice` folder: 20 subdirectories, 35 files, including multiple stale ZIPs and test folders
- `justice-theme/` full structure including active theme files
- `project-control.rar` (21.9 MB) — extracted to `extracted-project-control/`
- `project-control-codex.rar` (38.2 MB) — extracted to `extracted-project-control-codex/`
- `justice-theme/tools/gsc/gsc-pull.js` — GSC API tool, confirmed working
- Emergency master folder: `justice_theme_emergency_master_2026_05_13/`
- Old inventory: `project-control/content-master/content-master-inventory.csv` (1,199 rows)
- Content body files: `project-control/content-master/content-bodies/` (1,198 .md files)
- Live GSC data: freshly pulled 2026-05-13

---

## 2. What Was Archived (Documented, Not Moved)

Files documented in:
- `arch-archive/2026-05-13-project-consolidation/archive_manifest.csv`
- `content-master/manifests/archive_manifest.csv` (canonical copy)

**417 files documented** across:
- `project-control/` (old version — superseded)
- `reports/` (old reports — superseded)
- `extracted-project-control/` (RAR extraction — data reconciled)
- `extracted-project-control-codex/` (Codex RAR extraction — data reconciled)
- `justice-theme/project-control/` (duplicate)
- `justice-theme/reports/` (duplicate)

> Note: Files are DOCUMENTED, not physically moved. Physical move pending owner approval.

---

## 3. What Was Extracted from RARs

### project-control.rar
Key files found and used:
- `content-master/content-master-inventory.csv` — 1,199 rows with post_ids, word counts, content_body_file references
- `content-master/content-bodies/` — 1,198 .md article body files
- `full-inventory.csv` — basic 5-column WP export
- `family-law-cluster.csv` / `family-law-decision-map.csv` — old family law planning
- `url-migration-map.csv` — old redirect map (not reviewed in full)

### project-control-codex.rar
Key files found and used:
- `serp-criminal-traffic-review-2026-05-11.csv` — 10 criminal SERP keyword reviews with recommendations
- `topic-clusters.csv` — pillar/support cluster map (all clusters)
- `url-migration-map.csv` — 352 KB redirect map
- `traffic-law-content-upload-readiness-2026-05-11.csv` — traffic law cluster plan
- `real-estate-owner-approval-packet.csv/md` — real estate decisions
- Multiple SERP, source audit, and cluster planning files per practice area

---

## 4. What Was Added to the Master File

Master file: `content-master/master-content-database.csv`

**Before this session:**
- 1,455 rows
- 4 rows had post_id
- 0 rows had categories
- 0 rows had content bodies

**After this session:**
- 1,455 rows (unchanged)
- **586 rows now have real post_id** (matched from old inventory by URL)
- **583 rows now have content_body_file** populated
- **583 rows now have content_body_available = YES**
- **1,451 rows now have real GSC 12m data** (clicks, impressions, CTR, position from live API)
- Backup created: `content-master/backups/master-content-database-2026-05-13-1330.csv`

**Still UNKNOWN in master:**
- categories: ALL 1,455 rows (requires WP REST pull)
- practice_area: ALL 1,455 rows (requires WP REST pull)
- tags: ALL 1,455 rows (requires WP REST pull)
- post_id: 869 rows still missing (requires WP REST pull)
- content_body: 872 rows still missing (requires REST content export)

---

## 5. Data Still Missing

See full list: `content-master/missing-data-request.csv`

Priority order:
1. **CRITICAL:** Sitemap — 0 found via API. Verify at jus-tice.co.il/sitemap.xml and submit via GSC.
2. **CRITICAL:** WordPress categories, tags, practice_area taxonomy — pull via REST API
3. **CRITICAL:** post_id for 869 rows — pull via REST API
4. **HIGH:** wp_status (publish/draft) for all 1,455 rows
5. **HIGH:** active plugin list — confirm CPT UI, cache, WAF, redirect plugin
6. **HIGH:** existing redirect rules — prevent redirect chains
7. **HIGH:** backlink data — before redirecting any HIGH traffic URL
8. **MEDIUM:** rank_math titles/descriptions per post
9. **MEDIUM:** GSC 3-month data (re-run gsc-pull.js with 3m date range)

---

## 6. GSC Data Pulled

**Tool:** `justice-theme/tools/gsc/gsc-pull.js`  
**Date:** 2026-05-13  
**Token:** Auto-refreshed successfully  
**Property:** https://jus-tice.co.il/

| File | Rows | Location |
|---|---|---|
| gsc_pages_12m.csv | 1,474 | content-master/gsc/ |
| gsc_queries_12m.csv | 33,154 | content-master/gsc/ |
| gsc_query_page_12m.csv | 3,252 | content-master/gsc/ |
| gsc_cannibalization_map.csv | 124 | content-master/gsc/ |
| gsc_low_ctr_opportunities.csv | 672 | content-master/gsc/ |
| gsc_striking_distance.csv | 140 | content-master/gsc/ |
| gsc_traffic_drop_analysis.csv | 343 | content-master/gsc/ |

**3m data:** Copies of 12m files exist as 3m placeholders. To get real 3m data, re-run gsc-pull.js with startDate modified to 3 months ago.

---

## 7. WordPress Data Pulled

**NONE pulled directly in this session.** The GSC pull was completed. WP REST data pull was blocked by lack of credentials in scope.

To pull WordPress data, use:
```
GET https://jus-tice.co.il/wp-json/wp/v2/articles?per_page=100&page=1
GET https://jus-tice.co.il/wp-json/wp/v2/categories?per_page=100
GET https://jus-tice.co.il/wp-json/wp/v2/practice-areas?per_page=100
```

These require either:
- WordPress Application Password (ask owner)
- Or public REST access if articles are published

---

## 8. Content Bodies Matched

- **1,198 content body .md files** are now in `content-master/content-bodies/`
- **583 master rows** have content_body_file populated (matched by URL)
- **872 rows** still lack content body (need WP REST content export or manual match)
- The content body files contain the article HTML/Markdown as exported from WordPress

---

## 9. Top SEO Risks

1. **0 sitemaps submitted** — Google may not be discovering all 1,474 indexed URLs properly
2. **124 cannibalization groups** — Multiple pages competing for the same query
3. **672 low-CTR pages** — High impressions but <2% CTR = major title/meta optimization opportunity
4. **Average position 36+ on high-traffic URLs** — Content is found but rarely clicked
5. **Hebrew URL slugs** — Not normalized; create redirect chains on any slug change
6. **No E-E-A-T signals** — No named authors, no reviewers, no editorial policy page
7. **jt-deploy plugin** — DANGEROUS. Must not be uploaded. Contains mass family-law tagging bug.

---

## 10. Top Business Opportunities

1. **Criminal Law cluster (140 URLs, 3,216 clicks/yr, 796K impressions)** — Large unoptimized cluster with high commercial intent. First to implement.
2. **Criminal lawyer service page** — Pillar page for "עורך דין פלילי" is missing. SERP confirms high commercial demand.
3. **Low CTR optimization** — 672 pages with 1,000+ impressions but <2% CTR. Better titles alone could 2-3x traffic.
4. **PDF traffic capture** — Top URL by clicks is a PDF file (608 clicks). This should become a proper article or landing page.
5. **court-judge/ page** — 234 clicks, 33K impressions. What is this page? Investigate and optimize.
6. **Lawyer directory** — Not yet built. This is the primary monetization vehicle.
7. **Practice + city pages** — Major traffic opportunity. Not yet built.
8. **WhatsApp CTA** — High-urgency legal queries need immediate contact option. Not implemented.

---

## 11. Criminal Law Cluster Decision

**CONFIRMED: Criminal Law is the first complete execution cluster.**

Evidence:
- 140 URLs in cluster
- 3,216 clicks / 796,250 impressions over 12 months
- 42 HIGH traffic URLs, 46 MEDIUM, 52 LOW
- SERP review confirms strong commercial demand for עורך דין פלילי
- Narrower than Family Law (188 URLs) with clearer intent structure
- Codex contains dedicated SERP research for criminal keywords
- Fallback: Traffic Law (25 URLs, LOW complexity) if criminal proves too complex

**Cluster map:** `content-master/clusters/criminal-law/criminal-law-master-map.csv` — 140 rows  
**Content gaps:** `content-master/clusters/criminal-law/criminal-law-content-gaps.csv` — 12 gap items  
**Redirect draft:** `content-master/clusters/criminal-law/criminal-law-redirect-plan-draft.csv` — DRAFT, NOT APPROVED

---

## 12. Must Be Approved by Owner Before Implementation

| Item | Risk if skipped |
|---|---|
| Redirect plan for any URL | Traffic loss, broken links |
| URL changes for HIGH traffic URLs | SEO damage |
| Any bulk REST API update | Data corruption |
| Publishing jt-deploy plugin | Mass mis-tagging of all articles |
| Adding lawyer profiles | Regulatory / Bar Association risk |
| Paid placement launch | Legal advertising compliance risk |
| "Recommended lawyer" language | Bar Association regulatory violation |

---

## 13. Exact Next Steps

### Immediate (no owner approval needed)
1. **Fix sitemap** — Verify Rank Math is active and sitemap is submitted via GSC UI
2. **Pull WP REST data** — Get categories, practice_area, tags, post_id for all posts
3. **Update master file** with WP REST data

### Requires owner input
4. **Review Criminal Law cluster map** — Owner reviews 140 URLs and confirms KEEP/MERGE/REDIRECT per row
5. **Approve pilot redirect plan** — Start with 5-10 LOW traffic criminal URLs only
6. **Provide lawyer for E-E-A-T** — Name any one verified lawyer to serve as content reviewer
7. **Confirm paid profile model** — Review compliance rules before building lawyer directory
8. **Confirm sitemap status** — Log into GSC and check Coverage and Sitemaps tabs

### After owner approval
9. Run small batch REST API update for criminal cluster taxonomy (practice_area, categories)
10. Create criminal law pillar page (עורך דין פלילי)
11. Create editorial policy page (מדיניות עריכה)
12. Create advertiser disclosure page

---

## 14. Blockers

| Blocker | What's needed |
|---|---|
| WP REST categories/taxonomy pull | WordPress Application Password or confirmed public REST access |
| Backlink data | Ahrefs / Moz / SEMrush account access |
| Active plugin list | wp-admin access or WP-CLI on server |
| Redirect validation | Screaming Frog or similar tool |
| GSC 3-month data | Re-run gsc-pull.js with 3m date window |
| Owner decision on Criminal Law map | Owner review time |

---

## Deliverables Created This Session

```
content-master/master-content-database.csv         — ENRICHED (586 post_ids, 583 bodies, 1451 GSC rows)
content-master/master-content-database.xlsx         — ORIGINAL (not re-generated - use CSV as truth)
content-master/missing-data-request.csv             — 15 items
content-master/cluster-priority-plan.csv            — 12 clusters prioritized
content-master/backups/master-content-database-2026-05-13-1330.csv  — backup
content-master/gsc/gsc_pages_12m.csv               — 1,474 rows
content-master/gsc/gsc_queries_12m.csv              — 33,154 rows
content-master/gsc/gsc_query_page_12m.csv           — 3,252 rows
content-master/gsc/gsc_cannibalization_map.csv      — 124 cannibalization groups
content-master/gsc/gsc_low_ctr_opportunities.csv    — 672 rows
content-master/gsc/gsc_striking_distance.csv        — 140 rows
content-master/gsc/gsc_traffic_drop_analysis.csv    — 343 rows
content-master/gsc/gsc_indexing_export_or_notes.md  — manual action notes
content-master/clusters/criminal-law/criminal-law-master-map.csv     — 140 rows
content-master/clusters/criminal-law/criminal-law-content-gaps.csv   — 12 gap items
content-master/clusters/criminal-law/criminal-law-redirect-plan-draft.csv — DRAFT ONLY
content-master/competitor-research/competitor-gap-research-2026.md
content-master/competitor-research/competitor-gap-matrix.csv
content-master/content-bodies/                      — 1,198 .md files
content-master/manifests/archive_manifest.csv       — 417 documented files
plugin-review/plugin-risk-audit.md
arch-archive/2026-05-13-project-consolidation/archive_manifest.csv
```
