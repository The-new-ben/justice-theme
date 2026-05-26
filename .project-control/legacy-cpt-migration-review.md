# Legacy CPT Migration Review
Date: 2026-05-10
Status: PLANNING / NO MIGRATION EXECUTED

## Why This Exists

GSC indexing examples still show old CPT-style URLs such as `/labor_law/...`. The current content strategy is to treat public legal content as Articles, while lawyers remain lawyer profiles and leads remain leads.

## Current Evidence

- VERIFIED: sampled GSC indexing example includes `https://jus-tice.co.il/labor_law/גיוס-עובדים/`.
- VERIFIED: exported content also shows legacy-looking paths such as `/tort/...` and `/corona-virus/...` inside the Articles inventory.
- RISK: some old URLs may still have impressions, links or internal references.

## Migration Rule

Do not deregister, delete, redirect or noindex a legacy CPT path until:

1. matching Article/page content is found,
2. word count and public quality are compared,
3. GSC performance is checked if available,
4. target English slug is approved,
5. redirect map row exists,
6. sitemap and internal links are ready,
7. owner approves the batch.

## First Review Candidates

| Candidate | Cluster | First Action | Status |
|---|---|---|---|
| `/labor_law/גיוס-עובדים/` | employment law | Compare against any Articles version for recruitment/employment content | NEEDS COMPARISON |
| `/tort/פקודת-הנזיקין-נוסח-חדש/` | personal injury / tort law | Decide whether this is legislation/source content or should be wrapped/linked | NEEDS COMPARISON |
| `/corona-virus/...` | outdated corona legacy | Decide archive/noindex/keep as historical only after GSC review | NEEDS OWNER REVIEW |

## Recommended Actions

- Useful evergreen legal article: migrate/merge into Articles, then redirect later after approval.
- Legal source/reference: keep as source or wrap in a source-library page.
- Outdated emergency/Covid article: archive or noindex later only after traffic review.
- Thin duplicate: merge into stronger page, redirect later only after approval.

## Next Step

Build `project-control/legacy-cpt-url-map.csv` from REST export, sitemap child files and GSC examples.
