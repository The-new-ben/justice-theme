# Criminal Law Cluster — Upload Readiness Report
Date: 2026-05-13
Prepared by: claude-agent
Status: SOFT_LAUNCH_ONLY — see decision below

## SUMMARY

Full Criminal Law migration is NOT SAFE YET.
Criminal Law SOFT LAUNCH (pillar page upgrade) IS READY — pending owner approval.

---

## VERIFIED FACTS

- Total Criminal Law articles in WP: **138**
  - Source: WP REST /wp/v2/articles?practice-areas=170
  - Practice area ID: 170 (משפט פלילי, slug: criminal-law)
  - All 138 confirmed as `status: publish`

- GSC match rate: **133/138** (96.4%)
  - 5 articles have no GSC data (new or unindexed)
  - Source: performance-pages.csv (12m)

- DO_NOT_TOUCH URLs (≥100 clicks/12m): **8 URLs**
  - See: criminal-law-do-not-touch-urls.csv
  - Must NOT be redirected, merged, deleted, or slug-changed

- Low-risk rows (safe to update content only): **102/138**
  - Verified by: <100 clicks 12m + no slug change needed

- Existing pillar candidate: **/criminal-defense-attorney/** (ID: 857)
  - Current GSC: 10 clicks, 62,561 impressions, 0.02% CTR, position 56.4 (12m)
  - STRIKING DISTANCE — enormous impressions, terrible CTR
  - Cause: old content, position 56, English URL for Hebrew queries

- /criminal-lawyer/ slug: **301 redirect → homepage**
  - This redirect is currently wasting signal
  - NOT safe to change without owner approval

- Pillar content: READY — see `post-857-NEW-content-paste-ready.html`
  - Status: paste-ready HTML (converted from 5,000-word draft)
  - Quality: HIGH — 38 H2s, 13 H3s, 20 internal links, FAQ, disclaimer, CTA

---

## HARD STOP CHECKLIST

| Gate | Status | Notes |
|---|---|---|
| Master data enriched enough | PARTIAL | 46/88 fields populated |
| Criminal Law row count verified | VERIFIED | 138 confirmed from WP |
| Post IDs for core pages | VERIFIED | All 138 have real post IDs |
| High-traffic URLs protected | VERIFIED | 8 DO_NOT_TOUCH identified |
| GSC data reconciled | YES (12m) | 133/138 matched |
| Cannibalization reviewed | PARTIAL | Cannib map exists, needs owner review |
| Redirect plan approved | NO | /criminal-lawyer/ → homepage unresolved |
| Rollback plan exists | YES | See post-857-OWNER-ACTION-PACKAGE.md |
| Owner approval | NOT YET | Required before any publish |

**Result: NOT SAFE for full migration. SAFE for soft-launch content update.**

---

## DECISION

### CHOSEN PATH: OPTION A — SOFT LAUNCH (PILLAR UPGRADE)

Rationale:
- /criminal-defense-attorney/ (ID 857) has 62,561 impressions but terrible CTR
- Content quality is likely outdated/weak (10 clicks from 62K impressions = nearly 0 CTR)
- Our 5,000-word pillar draft addresses every query intent in the cluster
- Upgrading this one page (no redirect, no URL change, no slug change) could 10x CTR
- Safe: existing URL preserved, no migrations, no redirects, no deletions

### WHAT SOFT LAUNCH MEANS

1. UPDATE existing article ID 857 (/criminal-defense-attorney/) with pillar draft content
   - Do NOT change slug
   - Do NOT change URL
   - Update content body, H1, H2s, meta title, meta description
   - Add disclaimer, internal links, CTA
   - Owner previews → owner publishes

2. DO NOT change /criminal-lawyer/ redirect yet
   - Document recommendation: redirect should eventually → /criminal-defense-attorney/
   - Owner decision required

3. DO NOT touch the 8 DO_NOT_TOUCH URLs

4. DO NOT run any mass migration

---

## WHAT MUST NOT HAPPEN

- DO NOT publish without owner approval
- DO NOT change slug of /criminal-defense-attorney/
- DO NOT change /criminal-lawyer/ redirect target
- DO NOT redirect, merge, or delete any of the 8 DO_NOT_TOUCH URLs
- DO NOT mass-update all 138 articles
- DO NOT push sensitive files to main/production branch
