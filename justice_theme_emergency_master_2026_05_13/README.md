# Jus-Tice Content Master — README
**Last updated:** 2026-05-13  
**Canonical folder:** `C:\Users\pro\justice\justice-theme\justice_theme_emergency_master_2026_05_13\`

---

## ⚠️ CRITICAL RULES — READ BEFORE DOING ANYTHING

1. **Do NOT upload jt-deploy plugin** — contains a mass family-law tagging bug
2. **Do NOT change live URLs** without owner approval and a tested redirect plan
3. **Do NOT run bulk imports** without dry run + backup + owner sign-off
4. **Do NOT push to production branch** without explicit owner approval
5. **Work ONLY from this folder** — do not create competing master files elsewhere

---

## What This Folder Is

This is the single source of truth for the Jus-Tice.co.il content restructure project.

It contains:
- The master content database (1,455 URLs)
- Real GSC data (1,474 pages, 33,154 queries — pulled 2026-05-13)
- 1,198 content body .md files (article bodies from WordPress)
- Criminal Law cluster plan (first execution cluster)
- Competitor research
- Plugin risk audit
- Archive manifest
- Agent workflow rules

---

## Current Master File Status

| Field | Status |
|---|---|
| Total rows | 1,455 |
| post_id populated | 586 (869 MISSING — need WP REST pull) |
| content_body_file | 583 matched |
| GSC data (12m) | 1,451 rows populated |
| categories | ALL UNKNOWN — need WP REST pull |
| practice_area | ALL UNKNOWN — need WP REST pull |
| tags | ALL UNKNOWN — need WP REST pull |

---

## Folder Structure

```
justice_theme_emergency_master_2026_05_13/
  README.md                          ← you are here
  content-master/
    master-content-database.csv      ← MASTER — primary source of truth
    master-content-database.xlsx     ← Excel version
    master-database-fields.md        ← field definitions
    methodology.md                   ← how classifications were made
    missing-data-request.csv         ← 15 items of missing data
    content-gap-map.csv              ← gaps across all practice areas
    cluster-priority-plan.csv        ← cluster execution order
    backups/                         ← timestamped backups
    gsc/                             ← real GSC data (pulled 2026-05-13)
    content-bodies/                  ← 1,198 .md article files
    clusters/
      criminal-law/                  ← FIRST EXECUTION CLUSTER
    redirects/
      redirect-map-template.csv      ← template only — NOT approved
    manifests/
      archive_manifest.csv           ← what was archived and where
      uploaded-file-manifest.csv
      rar-file-manifest.csv
    competitor-research/
      competitor-gap-research-2026.md
      competitor-gap-matrix.csv
  agent-workflow/
    AGENT_RULES.md                   ← rules every agent must follow
    NEXT_AGENT_HANDOFF.md            ← current session handoff
    PROMPT_TO_AGENT.md               ← next agent instructions
  plugin-review/
    plugin-risk-audit.md             ← plugin risks and recommendations
    plugin-recommendations.md        ← safe plugin actions
```

---

## First Execution Cluster: Criminal Law

- **140 URLs** identified
- **3,216 clicks** over 12 months, **796K impressions**
- Cluster map: `content-master/clusters/criminal-law/criminal-law-master-map.csv`
- Content gaps: `content-master/clusters/criminal-law/criminal-law-content-gaps.csv`
- Redirect plan: **DRAFT ONLY** — not approved

**Next step for this cluster:** Pull WordPress post_id and categories for all 140 criminal-law URLs, then present the merge/redirect decisions to the owner for approval before any live changes.

---

## What Must Happen Before Any Live Change

1. Owner reviews Criminal Law cluster map
2. WP REST data pull completes categories/practice_area/post_id
3. Redirect plan reviewed and approved URL by URL
4. Backup confirmed
5. Dry run completed
6. Rollback plan exists
