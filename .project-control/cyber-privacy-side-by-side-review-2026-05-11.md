# Cyber / Privacy Side-By-Side Content Review - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NO URL CHANGE

## Purpose

This file compares the existing cyber/privacy assets before any content rewrite, merge, URL migration, redirect, canonical, sitemap, related-card or CMS action.

Data used:
- `project-control/content-master-inventory.csv`
- `project-control/content-quality-audit.csv`
- `project-control/url-migration-map.csv`
- `project-control/internal-link-map.csv`
- `project-control/gsc-cyber-national-gap-pass-2026-05-11.csv`
- `project-control/gsc-cyber-privacy-support-pass-2026-05-11.csv`
- `project-control/serp-cyber-privacy-review-2026-05-11.md`

## Executive Decision

VERIFIED:
- `/cyber-lawyer/` is still the best current service-page candidate by title, clean URL, quality score and local commercial intent.
- `/cybercrime-lawyer-roll/` has the only visible GSC row for `עורך דין סייבר`, but it should not become the primary page automatically.
- The old Hebrew privacy-injury URL must be protected and compared because it has visible GSC impressions for `פגיעה בפרטיות` and `הגנת הפרטיות`.
- Long pages such as `/fbi-cyber-division/`, `/cyber-laws/`, and the Hebrew `תפקידם של עורכי דין בתחום הסייבר` page must not be chosen as pillars by word count alone.

BLOCKED:
- No public execution is approved from this comparison.

## Side-By-Side Summary

| Current URL | Words | Quality | Current Role | Evidence | Recommended Action |
|---|---:|---:|---|---|---|
| `/cyber-lawyer/` | 6,405 | 8 | Current cyber service candidate | Clean URL, title targets cyber lawyer, internal links exist; reverse GSC page check showed no visible rows | KEEP_AS_CURRENT_CANDIDATE / compare before edits |
| Hebrew `תפקידם של עורכי דין בתחום הסייבר` URL | 9,576 | 8 | Possible duplicate/support role page | Long, internal links exist, Hebrew slug needs mapping | COMPARE_FOR_MERGE_OR_SUPPORT |
| `/cybercrime-lawyer-roll/` | 4,455 | 6 | Cybercrime/cyber-lawyer support | Only visible GSC row for `עורך דין סייבר`: 42 impressions | SUPPORT_BOUNDARY_REVIEW |
| `/cyber-laws/` | 13,956 | 8 | Informational cyber-law guide | Long and clean, but can cannibalize service intent | SUPPORT_OR_INFORMATIONAL_HUB_REVIEW |
| `/fbi-cyber-division/` | 21,917 | 6 | International/FBI context | Longest page, but intent is not local Israeli service | PROTECT_SUPPORT_NOT_PRIMARY |
| `/what-is-cyberattack/` | 3,744 | 6 | Technical/business explainer | No visible GSC rows for `מתקפת סייבר`; no internal links | SUPPORT_GUIDE_REVIEW |
| `/cyber-insurance/` | 2,832 | 6 | Business/insurance support | Clean URL; distinct insurance intent | BUSINESS_SUPPORT_REVIEW |
| `/cybersex-trafficking/` | 2,819 | 8 | Criminal/cyber sensitive support | Quality score 8; criminal/cyber boundary | CRIMINAL_CYBER_BOUNDARY_REVIEW |
| Old Hebrew privacy-injury URL | 4,121 | 6 | Privacy support / migration-risk page | 38 impressions for `פגיעה בפרטיות`; 7 for `הגנת הפרטיות`; outdated/rewrite flag | PROTECT_COMPARE_REWRITE_LATER |
| Privacy overview article | 763 | 4 | Thin privacy support | Needs expansion; no internal links | EXPAND_OR_MERGE_AFTER_SOURCE_REVIEW |
| Google/privacy/defamation case URL | 11,079 | 4 | Case-law support | Outdated/rewrite flag; not a practical guide | CASE_SUPPORT_REVIEW |
| Intimate-image privacy case URL | 15,163 | 6 | Case-law support | Privacy/defamation overlap, no internal links | CASE_SUPPORT_REVIEW |
| Privacy/audio case URL | 3,580 | 6 | Case-law support | Privacy/family boundary, no internal links | CASE_SUPPORT_REVIEW |
| `/police-records-data-deletion/` | 530 | 2 | Criminal records / data deletion boundary | Thin, outdated, unclear intent, no internal links | REWRITE_OR_REBUILD_AFTER_BOUNDARY_REVIEW |

## Cannibalization Findings

VERIFIED:
- The cluster has at least three broad cyber-lawyer/cyber-law assets that can compete if all are optimized for `עורך דין סייבר`:
  - `/cyber-lawyer/`
  - `/cybercrime-lawyer-roll/`
  - Hebrew `תפקידם של עורכי דין בתחום הסייבר`
- `/cyber-laws/` is strong enough to become an informational guide, but should not compete with the service page for hiring intent.
- `/fbi-cyber-division/` is too international/FBI-specific to be the primary Israeli lawyer-service page.
- Privacy content is fragmented between a practical old Hebrew support page, a thin overview, and case-law pages.

## Role Proposal

Planning only:

1. Primary service candidate:
   - `/cyber-lawyer/`

2. Cyber support pages:
   - `/cybercrime-lawyer-roll/`
   - `/cyber-laws/`
   - `/what-is-cyberattack/`
   - `/cyber-insurance/`

3. Criminal/cyber boundary:
   - `/cybersex-trafficking/`

4. International/context support:
   - `/fbi-cyber-division/`

5. Privacy support lane:
   - Old Hebrew privacy-injury URL
   - Privacy overview article
   - Privacy/defamation case-law URLs

6. Data deletion boundary:
   - `/police-records-data-deletion/`

## Immediate Non-Public Recommendations

REVIEW:
- Compare `/cyber-lawyer/` with the Hebrew `תפקידם של עורכי דין בתחום הסייבר` page before any service-page rewrite.
- Review whether useful text from `/cybercrime-lawyer-roll/` should support `/cyber-lawyer/`.
- Keep `/cyber-laws/` informational and avoid title/H1 overlap with `/cyber-lawyer/`.
- Protect the old privacy-injury URL from accidental redirect or overwrite.
- Rebuild `/police-records-data-deletion/` only after deciding whether it is criminal-record support, privacy/data deletion, or both.

BLOCKED:
- No slug changes.
- No redirects.
- No canonicals.
- No sitemap changes.
- No internal-link edits.
- No content edits.
- No CMS writes.

## Next Safe Step

Create a cyber/privacy internal-link plan with statuses marked `PLANNED_NEEDS_APPROVAL`, or move to homepage line-by-line SEO/design alignment using the verified homepage GSC data.
