# Publication Review - Family Law Cluster

Date: 2026-05-10  
Status: EDITORIAL REPAIR APPROVED FOR EXISTING LIVE PAGES; MERGE/CANNIBALIZATION REVIEW CONTINUES

## Summary
The seven family-law URLs should be kept, cleaned, expanded and connected. The problem is not the existence of the pages; the problem is that internal/editorial notes leaked into the public article body.

The public pages must contain only public-facing Hebrew legal information for a visitor arriving from Google. Team notes, source-review notes, GSC notes, CMS notes and next-action notes belong in an internal draft only.

## Immediate Fix Applied
- Automatic creation of missing public pages is disabled.
- The previous draft/restore cleanup routine is disabled by default.
- Existing live family-law pages are repaired in place with public-facing article body content.
- WordPress will create/update a draft-only page titled `Internal Editorial Notes — Family Law Cluster`.
- Content imports into the `articles` CPT now use public-cleaned body content and store internal notes separately.
- `publication-cannibalization-check.csv` now marks the seven URLs as `APPROVED_FOR_EDITORIAL_REPAIR`.

## Page Review

| Page | Public Content Clean Before Repair | Internal Notes Found | Duplicate Risk | Existing Related Pages | Current Action | Later Owner Review |
|---|---:|---:|---:|---|---|---:|
| `/divorce-lawyer/` | No | Yes | Yes | `/family-law/`, `/experienced-family-law-attorney/`, `/divorce-costs-2025/` | EDITORIAL_REPAIR_EXISTING_PAGE | Yes |
| `/consensual-divorce/` | No | Yes | Yes | `/what-is-a-divorce-settlement-agreement/`, `/rabbinical-agreement-approval/` | EDITORIAL_REPAIR_EXISTING_PAGE | Yes |
| `/divorce-mediation/` | No | Yes | Yes | `/divorce-mediation-cons-pros/`, `/family-mediation-updated-trends/` | EDITORIAL_REPAIR_EXISTING_PAGE | Yes |
| `/child-support/` | No | Yes | Yes | `/family-law/`, `/experienced-family-law-attorney/`, `/divorce-costs-2025/` | EDITORIAL_REPAIR_EXISTING_PAGE | Yes |
| `/child-custody/` | No | Yes | Yes | old Hebrew custody URL, `/mom-full-custody/`, `/custody-rights-for-fathers/` | EDITORIAL_REPAIR_EXISTING_PAGE | Yes |
| `/divorce-property-division/` | No | Yes | Medium | `/family-law/`, `/divorce-costs-2025/`, `/leading-divorce-lawyers-worldwide/` | EDITORIAL_REPAIR_EXISTING_PAGE | Yes |
| `/family-dispute-resolution/` | No | Yes | Yes | `/request-for-family-dispute-settlements`, `/form-6-request-urgent-relief-dispute-settlement/` | EDITORIAL_REPAIR_EXISTING_PAGE | Yes |

## What Must Still Happen
1. Recheck the seven live URLs after uPress pulls the editorial repair commit.
2. Confirm public bodies do not contain internal notes.
3. Compare each page against the older related pages.
4. Merge stronger old sections into the new cluster page where useful.
5. Keep one canonical URL per search intent.
6. Document 301 redirect needs in `url-migration-map.csv`, but do not execute redirects without approval.
7. Continue expanding weaker supporting pages toward the 5,000-word class where the keyword is competitive.

## Current Public Status
LIVE NEEDS RECHECK after uPress pull/cache refresh. Expected result: the pages remain public, the public body is clean, and internal notes exist only in the draft/private editorial note.
