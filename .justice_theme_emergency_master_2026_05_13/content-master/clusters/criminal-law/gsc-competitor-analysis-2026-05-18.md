# Criminal Law Cluster — GSC Competitor & Indexing Analysis
**Date:** 2026-05-18  
**Source:** GSC URL Inspection API + Search Analytics API (3-month data)

---

## Indexing Status (18 URLs)

| Status | Count | URLs |
|--------|-------|------|
| ✅ Indexed | 9 | criminal-record-check, criminal-record-deletion, drug-crimes, shoplifting-defense, lahav-433-guide, drug-possession, plea-bargain, arrest-rights, criminal-appeal |
| ❌ Crawled not indexed | 2 | **criminal-defense-attorney** (pillar!), criminal-negligence |
| ❌ Discovered not indexed | 3 | murder-charges, driving-under-influence, fraud-types |
| ❌ Unknown to Google | 2 | criminal-lawyer-cost, tax-crimes |
| ⚠️ Canonical/redirect issue | 2 | drug-trafficking (canonical), police-investigation-rights (redirect) |

**Root cause:** All issues stem from stale crawl data. Google hasn't recrawled these pages since before the May 17 SEO rescue. All pages currently return 200 OK with correct canonicals. Fix: request indexing via GSC web UI.

---

## Query Performance (Criminal Law - 30 days)

**Key finding: ZERO clicks on any criminal law query.** All traffic is impression-only.

### Top Queries by Impressions (30d)
| Query | Impressions | Avg Position |
|-------|-------------|-------------|
| מחיקת רישום פלילי | 14 | 68.9 |
| כתב אישום פלילי | 9 | 41.0 |
| בקשה למחיקת רישום פלילי | 7 | 87.4 |
| כתב אישום | 6 | 45.7 |
| מחיקת רישום פלילי כמה עולה | 4 | 36.5 |
| מחיקת עבר פלילי | 4 | 69.3 |
| בקשה למחיקת רישום משטרתי | 4 | 79.5 |

### Observations
1. **"מחיקת רישום פלילי" cluster** dominates — 14 queries related to criminal record deletion
2. **"כתב אישום" cluster** — 6 queries about criminal indictments
3. **The pillar query "עורך דין פלילי"** shows only 1 impression at position 1.0 — but linking to an OLD page (`/criminal-defense-attorney-roles-and-responsibilities/`), NOT the actual pillar
4. **Zero clicks** across all queries — positions are too low (avg 40-90)
5. **The pillar page itself gets NO search impressions** — because it's not indexed

### Competitive Gap Analysis
- The site appears for criminal record deletion queries but at positions 37-88 (page 4-9)
- The indictment queries land on `/articles/criminal-indictment/` which is NOT one of the 17 cluster articles
- The pillar page "עורך דין פלילי" is ranking at position 1 for one instance but for a DIFFERENT page
- No queries landing on the new spoke articles (murder-charges, drug-trafficking, etc.) because they're not indexed yet

---

## Priority Actions for GSC

1. **REQUEST INDEXING** for all 9 unindexed URLs via GSC web UI (owner action)
2. **Monitor in 1 week** — rerun `gsc-inspect-urls.js`
3. **After indexing confirmed** — check if impressions increase and positions improve
4. **Content gap**: "כתב אישום" (criminal indictment) gets 9+ impressions — consider adding to the spoke cluster if not already covered
