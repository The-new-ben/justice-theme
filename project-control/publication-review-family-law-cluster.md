# Publication Review - Family Law Cluster

Date: 2026-05-10  
Status: BLOCKED FOR PUBLICATION UNTIL MERGE/CANNIBALIZATION REVIEW IS COMPLETE

## Summary
The seven family-law drafts are not safe to auto-publish as public pages in their current workflow.

The drafts contain useful public legal explanation, but they also include internal planning sections such as CMS structure, CRM routing, LegalTech product notes, source-review status, publication blockers, cannibalization notes and NOT VERIFIED labels. Those sections belong in `project-control/`, not in WordPress public pages.

## Immediate Fix Applied
- Automatic family-cluster publication is disabled in code.
- The wp-admin manual publisher now runs preflight checks.
- The publisher blocks pages unless `publication-cannibalization-check.csv` explicitly approves them.
- The publisher strips internal-only sections before public conversion.
- The publisher blocks output if safety markers remain after stripping.

## Page Review

| Page | Public Content Clean | Internal Notes Found | Duplicate Risk | Existing Related Pages | Recommended Action | Owner Approval Needed |
|---|---:|---:|---:|---|---|---:|
| `/divorce-lawyer/` | No | Yes | Yes | `/family-law/`, `/experienced-family-law-attorney/`, `/divorce-costs-2025/` | NEEDS_OWNER_REVIEW | Yes |
| `/consensual-divorce/` | No | Yes | Yes | `/what-is-a-divorce-settlement-agreement/`, `/rabbinical-agreement-approval/` | MERGE_WITH_EXISTING_PAGE | Yes |
| `/divorce-mediation/` | No | Yes | Yes | `/divorce-mediation-cons-pros/`, `/family-mediation-updated-trends/` | MERGE_WITH_EXISTING_PAGE | Yes |
| `/child-support/` | No | Yes | Yes | `/family-law/`, `/experienced-family-law-attorney/`, `/divorce-costs-2025/` | NEEDS_OWNER_REVIEW | Yes |
| `/child-custody/` | No | Yes | Yes | old Hebrew `/תחומי-התמחות/דיני-משפחה/משמורת-ילדים/`, `/mom-full-custody/`, `/custody-rights-for-fathers/` | MERGE_WITH_EXISTING_PAGE | Yes |
| `/divorce-property-division/` | No | Yes | Medium | `/family-law/`, `/divorce-costs-2025/`, `/leading-divorce-lawyers-worldwide/` | NEEDS_OWNER_REVIEW | Yes |
| `/family-dispute-resolution/` | No | Yes | Yes | `/request-for-family-dispute-settlements`, `/form-6-request-urgent-relief-dispute-settlement/` | MERGE_WITH_EXISTING_PAGE | Yes |

## What Must Happen Before Live Publication
1. Compare each new draft with existing indexed pages.
2. Keep the stronger existing URL if it has traffic or better content.
3. Merge useful new sections into the existing page where relevant.
4. Use a new English slug only when the page is truly the chosen canonical URL.
5. Document redirects in `url-migration-map.csv`, but do not execute redirects without approval.
6. Remove all internal notes from public body content.
7. Add public sources and public internal links.
8. Only then mark the row in `publication-cannibalization-check.csv` as `APPROVED_FOR_PUBLICATION`, `APPROVED_FOR_UPDATE`, or `APPROVED_FOR_MERGE`.

## Current Public Status
LIVE NOT VERIFIED as published. Previous public checks showed the seven proposed URLs redirecting to the homepage, so the unsafe publication did not appear live at the time of review.
