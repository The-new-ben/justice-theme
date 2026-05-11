# Real Estate Source And Legal Checklist

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / OWNER AND LEGAL APPROVAL REQUIRED / NO PUBLIC EXECUTION

This checklist is the source/legal gate for the Israeli real-estate, apartment purchase/sale, land registry, taxation, contractor-defect and rental support cluster. It does not approve public rewrites, title/H1/meta edits, URL changes, redirects, canonicals, sitemap changes, homepage edits, menu/taxonomy edits, related-card edits, lawyer-card edits or CMS/database writes.

## Evidence Used

VERIFIED:
- `project-control/real-estate-owner-approval-packet.md` and `.csv`.
- `project-control/content-master-inventory.csv`.
- `project-control/content-quality-audit.csv`.
- `project-control/gsc-keyword-page-map.csv`.
- `project-control/gsc-cannibalization-review.csv`.
- `project-control/gsc-content-priorities.csv`.
- `project-control/cluster-pillar-review.csv`.
- `project-control/url-migration-map.csv`.

VERIFIED GSC CONTEXT:
- `עורך דין מקרקעין` is mainly associated with the homepage, not a dedicated pillar.
- `/real-estate-lawyer-cost-2025/` is overloaded with support intent for sale-lawyer cost, buying apartment and sale agreement queries.
- `/real-estate-lawyer/` remains a strategic future clean slug, not an approved live URL.
- `/real-estate-attorney/` is the current commercial candidate and must be compared before any migration.
- International property/investment pages must be separated from Israeli real-estate lawyer intent.

NOT VERIFIED:
- Full GSC API export.
- GA4/conversion performance for real-estate pages.
- Legal review by an Israeli real-estate lawyer.
- Source freshness for every tax/registry/contract claim.
- Exact old Hebrew URL redirect behavior for all real-estate variants.

## Official Source Anchors To Use

Use these as source-review anchors before rewriting any practical legal guidance:

- Ministry of Justice / Land Registry and Settlement of Rights: online land-registry workflow and registry procedures, especially `https://www.gov.il/he/service/land_registration_extract`.
- Israel Tax Authority: seller/buyer guide for real-estate rights and online reporting obligations. Current official Tax Authority source URLs still need exact page selection before drafting.
- Ministry of Construction and Housing / Sale Law portal: new-apartment sale protections and Sale Law guidance, including `https://www.gov.il/he/departments/units/hagana-al-rochshey-dirot`, `https://www.gov.il/he/service/filing_a_complaint_against_apartment_seller`, and `https://www.gov.il/he/service/apartment-sell-report`.
- Israel Land Authority: RMI rights-transfer and long-term lease context where relevant, including `https://www.gov.il/en/service/guide-transfer-rights`.
- Local municipality guidance only as local examples, not national law. Tel Aviv guidance is useful for due-diligence examples such as land registry extract, building file, municipal debts and betterment levy checks: `https://www.tel-aviv.gov.il/Residents/Assets/Pages/TransferringRights.aspx`.

## Required Review Gates

Before any public rewrite or merge:

1. Legal-review gate: no advice-like transaction, tax, registration, contractor, defect, rental or planning claims without source/legal review.
2. URL gate: no migration from `/real-estate-attorney/` to `/real-estate-lawyer/` without a full old-to-new redirect/canonical/sitemap/internal-link map.
3. Traffic-risk gate: do not rewrite or redirect `/real-estate-lawyer-cost-2025/` blindly because it has visible GSC impressions.
4. Homepage gate: homepage may route real-estate intent to the approved pillar later, but no homepage section/link changes are approved here.
5. International-content gate: foreign property pages must not be used as local Israeli support content unless manually approved.
6. Tax gate: purchase tax, betterment tax, land appreciation tax and reporting deadlines need current official-source validation.
7. Registry gate: Tapu/Land Registry, warning notes, ownership checks and registration steps need source-backed wording.
8. Contractor gate: new-apartment, Sale Law, delivery delay, guarantees and defect claims need source/legal review.
9. Rental gate: rental agreement content should support the cluster but not compete with purchase/sale lawyer intent.
10. Schema gate: no Review/AggregateRating/LegalService schema expansion from this checklist.

## Page-Level Gate Summary

### `/real-estate-attorney/`

Status: current commercial candidate.

Role: compare as current no-URL-change primary candidate.

Gate:
- Needs title/H1/body/source review before pillar approval.
- Do not migrate to `/real-estate-lawyer/` yet.

### `/real-estate-lawyer/`

Status: future strategic slug only.

Role: migration target candidate.

Gate:
- Needs approved redirect/canonical/sitemap/internal-link plan.
- Do not create a duplicate page while `/real-estate-attorney/` exists.

### Homepage

Status: current accidental GSC carrier for real-estate lawyer intent.

Role: broad portal entry, not real-estate pillar.

Gate:
- Later homepage link/section update can route users to the approved real-estate pillar.
- No homepage change is approved by this checklist.

### `/real-estate-lawyer-cost-2025/`

Status: current high-impression support page.

Role: protect and keep as cost/sale support pending rewrite review.

Gate:
- Do not redirect, noindex, canonicalize away or rewrite titles before approval.
- Later it should link to the approved pillar, buying-apartment support and sale-agreement support.

### Buying-Apartment Support

Future candidate: `/buying-apartment/`.

Role: support page for apartment-purchase legal checks.

Gate:
- Compare old Hebrew buying pages, `/apartment/`, `/lawyer-for-buying-or-selling-a-house/` and checklist-style articles first.
- Avoid mixing foreign-property investment content into Israeli apartment purchase guidance.

### Sale Agreement Support

Future candidate: `/real-estate-purchase-agreement/`.

Role: support page for sale/purchase agreement checks.

Gate:
- Compare existing contractor-contract, sale-registration, handwritten-agreement and case-law pages first.
- Needs source/legal review before practical contract guidance.

### Registry And Tapu Support

Current pages:
- `/land-registration/`
- `/registration-of-real-estate-israel/`
- `/real-estate-registration-procedure-israel/`

Role: practical support, not service pillar.

Gate:
- Needs official Land Registry source review.
- Likely EXPAND or MERGE later, but no action is approved now.

### Tax Support

Current page:
- `/land-appreciation-tax/`

Role: tax support for sale/purchase cluster.

Gate:
- Needs current Tax Authority source review before any claim about exemptions, calculations, reporting or deadlines.

### Contractor / Defect Support

Current examples:
- `/common-construction-defects-and-how-to-manage-them/`
- contractor-contract and delivery-delay case-law pages.

Role: support or specialist subcluster.

Gate:
- Needs Sale Law and contractor/defect source review.
- Do not merge into the main pillar without intent separation.

### International Property Content

Current examples:
- `/buying-property-in-greece/`
- `/real-estate-investing/`
- `/guide-buying-property-portugal-israelis/`
- `/real-estate-usa/`

Role: separate international property/investment cluster.

Gate:
- Do not use as local Israeli real-estate lawyer support cards without manual editorial approval.

## Recommended Next Work

RECOMMENDED:
1. Create a real-estate page decision matrix.
2. Run a side-by-side comparison of `/real-estate-attorney/`, `/real-estate-lawyer-cost-2025/`, `/israeli_land_and_property_laws/`, `/land-registration/`, `/registration-of-real-estate-israel/`, `/land-appreciation-tax/`, `/rental-agreement/`, buying-apartment candidates and contractor/defect candidates.
3. Run direct GSC/browser checks for `מס רכישה`, `מס שבח`, `טאבו`, `חוזה שכירות`, `איחור במסירת דירה`, `ליקויי בנייה`, `עורך דין קניית דירה`, and `עורך דין מכירת דירה`.
4. Build a real-estate internal-link plan only after page roles are approved.
5. Build a URL migration map only after owner/legal approval.

## Blocked Actions

BLOCKED:
- Public content edits.
- Title/H1/meta edits.
- URL or slug changes.
- Redirects.
- Canonical changes.
- Sitemap changes.
- Robots/noindex changes.
- Homepage section/link changes.
- Menu/taxonomy changes.
- Related-card/manual-card changes.
- Lawyer-card/profile changes.
- Review/rating/schema changes.
- CMS, wp-admin, plugin-state or database writes.

## Safety

VERIFIED:
- This file is a documentation-only source/legal planning gate.
- No public real-estate content, URL, redirect, canonical, sitemap, menu, taxonomy, homepage, lawyer, review, CRM, plugin-state, wp-admin setting or database state was changed.
