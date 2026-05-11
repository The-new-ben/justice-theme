# Real Estate Side-By-Side Review - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NO PUBLIC EXECUTION

## Purpose

This file compares the existing real-estate, apartment purchase/sale, registry, tax, rental, contractor/defect and international-property pages before any rewrite, merge, URL migration, redirect, canonical, sitemap, internal-link, related-card, menu, title/H1/meta or CMS action.

Data used:
- `project-control/content-master-inventory.csv`
- `project-control/content-quality-audit.csv`
- `project-control/url-migration-map.csv`
- `project-control/gsc-keyword-page-map.csv`
- `project-control/gsc-content-priorities.csv`
- `project-control/real-estate-owner-approval-packet.md`
- `project-control/real-estate-source-legal-checklist-2026-05-11.md`
- `project-control/real-estate-page-decision-matrix-2026-05-11.md`

## Live URL Verification

VERIFIED on 2026-05-11:
- `https://jus-tice.co.il/real-estate-attorney/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/real-estate-lawyer-cost-2025/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/israeli_land_and_property_laws/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/lawyer-for-buying-or-selling-a-house/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/land-registration/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/registration-of-real-estate-israel/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/real-estate-registration-procedure-israel/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/land-appreciation-tax/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/rental-agreement/` returns `200`, has a title/H1, and self-canonicalizes.
- `https://jus-tice.co.il/online-rent-agreement/` returns `200`, has a title/H1, and self-canonicalizes, even though inventory word count is `0`.
- `https://jus-tice.co.il/buying-property-in-greece/` returns `200`, has a title/H1, and self-canonicalizes.
- The Hebrew fee URL, first-apartment article URL, contractor/defect URL and TMA/urban-renewal URL returned `200` in the bounded status check.

REVIEW / ROUTING RISK:
- `https://jus-tice.co.il/real-estate-lawyer/` returns `200 OK` but the fetched response had no title, H1, canonical, deployment marker or visible body sample. Treat it as a broken/empty live route until verified in WordPress and GSC.
- `https://jus-tice.co.il/buying-apartment/` resolves to homepage content with canonical `https://jus-tice.co.il/`.
- `https://jus-tice.co.il/real-estate-purchase-agreement/` resolves to homepage content with canonical `https://jus-tice.co.il/`.
- Future slugs that resolve to homepage content must not be used in sitemaps, internal links, redirects or related cards until routing is fixed and approved.

## Executive Decision

VERIFIED:
- `/real-estate-attorney/` is the only safe current commercial real-estate lawyer candidate for no-URL-change planning.
- `/real-estate-lawyer/` is not ready as a future migration target because the live route currently behaves like an empty 200 response.
- `/real-estate-lawyer-cost-2025/` is a high-impression support page, not the broad commercial pillar.
- `/israeli_land_and_property_laws/` carries broad "real-estate lawyer/property laws" language and may compete with the commercial candidate if not repositioned.
- `/buying-apartment/` and `/real-estate-purchase-agreement/` are unsafe as live destinations because they currently show homepage content/canonical.
- Registry and registration pages are thin and overlapping; the huge registration procedure page is not a pillar by word count.
- International property content must remain outside the Israeli real-estate lawyer-service cluster.

BLOCKED:
- No public execution is approved from this comparison.

## Side-By-Side Summary

| Current URL | Words | Quality | Current Role | Evidence | Recommended Action |
|---|---:|---:|---|---|---|
| `/real-estate-attorney/` | 6,941 | 6 | Current commercial candidate | Live 200, self-canonical, title/H1 target real-estate lawyer, current inventory page | COMPARE_AS_CURRENT_PRIMARY |
| `/real-estate-lawyer/` | Not in inventory | Not verified | Future strategic slug only | Live route returns 200 but no title/H1/canonical/marker/body sample | ROUTING_AUDIT_BEFORE_USE |
| `/real-estate-lawyer-cost-2025/` | 11,330 | 6 | Protected cost/sale support | Live 200, self-canonical, high GSC support impressions | PROTECT_SUPPORT_NOT_PRIMARY |
| `/israeli_land_and_property_laws/` | 5,479 | 6 | Broad info/support or merge-review | Live 200, self-canonical, title/H1 includes real-estate lawyer/property law | REPOSITION_OR_MERGE_REVIEW |
| Hebrew fee page | 9,735 | Not matched | Fee/cost support | Live 200; likely overlaps cost article | SIDE_BY_SIDE_COST_REVIEW |
| `/lawyer-for-buying-or-selling-a-house/` | 2,192 | 5 | Buy/sell support | Live 200, self-canonical, title/H1 targets apartment buying/selling lawyer | SUPPORT_OR_MERGE_REVIEW |
| `/buying-apartment/` | Not current exact URL | Not verified | Future support slug | Live route shows homepage content and homepage canonical | DO_NOT_LINK_OR_MIGRATE_YET |
| First-apartment article URL | 2,379 | 5 | Buying-apartment support candidate | Live 200 in status check; URL map has duplicate target to `/buying-apartment/` | COMPARE_BEFORE_MIGRATION |
| `/apartment/` | 5,553 | 3 | International/abroad property support | Live 200, self-canonical, title/H1 is abroad/investment framed | SEPARATE_FROM_LOCAL_CLUSTER |
| `/common-construction-defects-and-how-to-manage-them/` | 1,824 | 5 | Contractor/defect support | Live 200 in status check; needs Sale Law/source review | SOURCE_BACKED_SUPPORT_REVIEW |
| `/land-registration/` | 434 | 2 | Land registry support | Live 200, self-canonical, thin | EXPAND_AFTER_SOURCE_REVIEW |
| `/registration-of-real-estate-israel/` | 487 | 2 | Registration support/merge-review | Live 200, self-canonical, thin overlap with registry | MERGE_OR_EXPAND_REVIEW |
| `/real-estate-registration-procedure-israel/` | 117,178 | 3 | Source-mined review asset | Live 200, self-canonical, extreme length | AUDIT_BEFORE_REWRITE_OR_MERGE |
| `/land-appreciation-tax/` | 2,781 | 6 | Tax support | Live 200, self-canonical, tax accuracy/source freshness needed | KEEP_AS_TAX_SUPPORT |
| `/rental-agreement/` | 5,460 | 6 | Rental support | Live 200, self-canonical, separate rental intent | KEEP_AS_RENTAL_SUPPORT |
| `/online-rent-agreement/` | 0 | 2 | Tool/product placeholder or thin page | Live 200, self-canonical, inventory body empty | OWNER_REVIEW_BEFORE_NOINDEX_OR_REMOVE |
| `/buying-property-in-greece/` | 29,988 | 8 | International property page | Live 200, self-canonical, not local Israeli service intent | SEPARATE_INTERNATIONAL_CLUSTER |
| `/tma-38-and-urban-renewal-lawyer/` | 575 | Not matched | Urban-renewal support | Live 200 in status check, thin specialist service page | EXPAND_OR_SUPPORT_REVIEW |
| `/real-estate-purchase-agreement/` | Not current exact URL | Not verified | Future support slug | Live route shows homepage content and homepage canonical | DO_NOT_LINK_OR_MIGRATE_YET |

## Cannibalization Findings

VERIFIED:
- The broad real-estate lawyer lane is split across the homepage, `/real-estate-attorney/`, `/israeli_land_and_property_laws/` and the cost/sale support page.
- `/real-estate-attorney/` is the safest current no-URL-change commercial candidate, but its title/H1 mixes "recommended", cost and free-consultation language. This needs owner/legal review before any title or content action.
- `/israeli_land_and_property_laws/` has a broad `עורך דין מקרקעין` title/H1 and should be repositioned as legal-background support or merge-reviewed so it does not compete with the service page.
- `/real-estate-lawyer-cost-2025/` owns useful support demand and should feed the pillar later, not become the pillar.
- Hebrew fee/cost pages may duplicate the cost article and should be compared before any merge or redirect.
- Future clean support slugs are currently unsafe because they either return empty content (`/real-estate-lawyer/`) or homepage content/canonical (`/buying-apartment/`, `/real-estate-purchase-agreement/`).
- Registry and registration pages overlap and are thin, while the huge registration procedure page is too long and low-quality to become a pillar.
- International property pages can pollute related content and topical signals if connected to local Israeli real-estate lawyer intent.

## Content Quality Findings

VERIFIED:
- Strongest current commercial candidate: `/real-estate-attorney/`, but it needs a cleaner practical legal-service structure before final pillar approval.
- Strongest support-by-GSC candidate: `/real-estate-lawyer-cost-2025/`, but it is overloaded and should support sale, purchase and agreement subtopics.
- Thin support pages: `/land-registration/`, `/registration-of-real-estate-israel/`, `/online-rent-agreement/`, `/tma-38-and-urban-renewal-lawyer/`.
- Long but not automatically primary: `/real-estate-lawyer-cost-2025/`, `/buying-property-in-greece/`, `/real-estate-registration-procedure-israel/`, Hebrew fee page.
- Empty/routing-risk pages: `/real-estate-lawyer/`, `/buying-apartment/`, `/real-estate-purchase-agreement/`.
- International-boundary pages: `/buying-property-in-greece/`, `/apartment/`, and other overseas-property articles should live in a separate cluster.

## Role Proposal

Planning only:

1. Current real-estate commercial lane:
   - Current candidate: `/real-estate-attorney/`
   - Future alternative only after routing and migration approval: `/real-estate-lawyer/`

2. Cost / fee / sale support:
   - Protected support: `/real-estate-lawyer-cost-2025/`
   - Merge-review support: Hebrew fee page
   - Support/compare: `/lawyer-for-buying-or-selling-a-house/`

3. Buying-apartment support:
   - Future slug only: `/buying-apartment/`
   - Compare before migration: first-apartment article, old Hebrew buying-apartment article, `/lawyer-for-buying-or-selling-a-house/`, `/real-estate-lawyer-cost-2025/`

4. Sale/purchase-agreement support:
   - Future slug only: `/real-estate-purchase-agreement/`
   - Compare before migration: contractor-contract guide, sale-registration request page and relevant agreement/case pages.

5. Registry / tax / practical support:
   - `/land-registration/`
   - `/registration-of-real-estate-israel/`
   - `/real-estate-registration-procedure-israel/`
   - `/land-appreciation-tax/`

6. Rental support:
   - `/rental-agreement/`
   - `/online-rent-agreement/` only after owner/tool review.

7. Contractor / defect / urban renewal:
   - `/common-construction-defects-and-how-to-manage-them/`
   - `/tma-38-and-urban-renewal-lawyer/`

8. International boundary:
   - `/buying-property-in-greece/`
   - `/apartment/`
   - Other overseas property pages stay separate from local Israeli service intent.

## Immediate Non-Public Recommendations

REVIEW:
- Treat `/real-estate-attorney/` as the working current primary only for planning. Do not change title/H1/meta yet.
- Audit `/real-estate-lawyer/` routing before any sitemap, redirect, canonical or internal-link decision.
- Do not link to `/buying-apartment/` or `/real-estate-purchase-agreement/` until they stop resolving to homepage content/canonical.
- Protect `/real-estate-lawyer-cost-2025/` and use it later as support after the primary page is approved.
- Run direct GSC page filters for `/real-estate-attorney/`, `/real-estate-lawyer-cost-2025/`, `/israeli_land_and_property_laws/`, Hebrew fee page and `/lawyer-for-buying-or-selling-a-house/`.
- Create the internal-link plan only after owner/legal review confirms page roles.

BLOCKED:
- No slug changes.
- No redirects.
- No canonicals.
- No sitemap changes.
- No internal-link edits.
- No related-card edits.
- No content edits.
- No title/H1/meta edits.
- No CMS writes.

## Next Safe Step

Create an approval-gated real-estate internal-link plan only after owner confirms:
- whether `/real-estate-attorney/` is the current working primary,
- whether `/real-estate-lawyer/` should be repaired as a future slug,
- which cost/buying/registry/tax/rental pages remain support,
- and which future slugs must stay blocked until routing is fixed.
