# Real Estate Owner Approval Packet

Date: 2026-05-11
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the real-estate/mekarkein inventory, GSC browser evidence, content-quality audit, topic-cluster data and URL conflict map into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, taxonomy/menu changes, homepage changes, lawyer-card changes or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change real-estate primary-selection, homepage-signal, support-page and international-content cleanup planning batch.
- Treat `/real-estate-attorney/` as the current published commercial pillar candidate.
- Treat `/real-estate-lawyer/` as a strategic future slug only, not an approved migration target yet.
- Protect `/real-estate-lawyer-cost-2025/` because it owns visible GSC demand for sale-lawyer, buying-apartment and sale-agreement queries.
- Do not let the homepage remain the accidental primary page for `עורך דין מקרקעין`.
- Separate Israeli real-estate legal help from international investment/property content before internal-link generation or URL migration.

Why:
- GSC browser evidence maps `עורך דין מקרקעין` mostly to the homepage, not to a dedicated real-estate lawyer page.
- `/real-estate-attorney/` exists, has `6,941` words and quality score `6/10`, but needs comparison before it becomes the approved pillar.
- `/real-estate-lawyer/` does not appear as an exact current public URL in the inventory.
- `/real-estate-lawyer-cost-2025/` has `11,330` words, quality score `6/10`, and owns multiple support-intent query rows.
- The real-estate cluster is polluted by international property/investment content, and the heuristic currently picked a Greece property article as the cluster pillar by word count.

## Current Evidence

VERIFIED:
- `project-control/content-master-inventory.csv`.
- `project-control/content-quality-audit.csv`.
- `project-control/gsc-keyword-page-map.csv`.
- `project-control/gsc-content-priorities.csv`.
- `project-control/slug-conflict-review.csv`.
- `project-control/topic-clusters.csv`.
- `project-control/cannibalization-map.csv`.
- `project-control/internal-link-map.csv`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page, lead and conversion data.
- Fresh SERP review for each real-estate subtopic.
- Source/legal review for tax, registry, contractor, sale agreement, buying apartment, rental and planning claims.
- Owner approval for real-estate primary URL, homepage link changes, menu/taxonomy changes, redirect/canonical/sitemap decisions or content rewrites.
- Verified lawyer-directory mapping for real-estate lawyers.

## Query Evidence From GSC Browser Pass

VERIFIED:
- `עורך דין מקרקעין`: homepage has `136` impressions, `0` clicks, `0%` CTR and average position `15.8`.
- `עורך דין מקרקעין`: `/real-estate-lawyer-cost-2025/` has `17` impressions and should be support, not primary.
- `עורך דין מקרקעין ייעוץ חינם`: homepage has `135` impressions and average position `15.8`.
- `עורך דין מכירת דירה`: `/real-estate-lawyer-cost-2025/` has `3.85K` impressions, `2` clicks, `0.1%` CTR and average position `50.1`.
- `קניית דירה`: `/real-estate-lawyer-cost-2025/` has about `871-885` impressions, while `/apartment/` has only `10` impressions and `/land-appreciation-tax/` has `3`.
- `חוזה מכר`: `/real-estate-lawyer-cost-2025/` has `31` impressions, suggesting a missing/weak sale-agreement support page.

Interpretation:
- The homepage is currently carrying service intent it should mostly route into a dedicated real-estate pillar.
- The cost page is overloaded: it is acting as support for sale, buying and agreement queries.
- A future `/buying-apartment/` support page is strategically useful, but no exact current URL exists and old content must be compared first.
- A future `/real-estate-purchase-agreement/` support page may be needed, but existing contract and sale-registration pages must be reviewed first.

## Page Decisions For Approval

### 1. Current Commercial Pillar Candidate

Current URL:
- `https://jus-tice.co.il/real-estate-attorney/`

Current facts:
- Public REST ID `1149`.
- Title: `עורך דין מקרקעין מומלץ | עורך דין מקרקעין מחיר | ייעוץ חינם`.
- Word count: `6,941`.
- Quality score: `6/10`.
- Media count: `1`.

Recommended action:
- COMPARE AS CURRENT PRIMARY / NO URL CHANGE.

Blocked:
- No title/H1/meta, body, canonical, sitemap, URL or redirect changes until owner approval.

### 2. Strategic Clean Slug

Future candidate:
- `/real-estate-lawyer/`

Current facts:
- Not found as an exact current public URL in the inventory.
- User strategy prefers short clean English slugs, but this is a migration decision.

Recommended action:
- STRATEGIC FUTURE SLUG / MIGRATION MAP REQUIRED.

Blocked:
- Do not create, migrate, redirect, canonicalize or add to sitemap until `/real-estate-attorney/` and old URLs are compared and a redirect map is approved.

### 3. Homepage Carrying Real-Estate Service Intent

Current URL:
- `https://jus-tice.co.il/`

Current facts:
- GSC: `136` impressions for `עורך דין מקרקעין`.
- GSC priority row: `עורך דין מקרקעין ייעוץ חינם` has `135` impressions and average position `15.8` on homepage.

Recommended action:
- HOMEPAGE LINKING/SECTION REVIEW ONLY.

Blocked:
- No homepage copy, layout, CTA, menu or internal-link changes from this packet alone.

### 4. Cost / Sale-Lawyer Support Page

Current URL:
- `https://jus-tice.co.il/real-estate-lawyer-cost-2025/`

Current facts:
- Public REST ID `12655`.
- Word count: `11,330`.
- Quality score: `6/10`.
- GSC: `3.85K` impressions for `עורך דין מכירת דירה`, `885` impressions for `קניית דירה`, and `31` impressions for `חוזה מכר`.

Recommended action:
- PROTECT / KEEP AS SUPPORT / COMPARE BEFORE REWRITE.

Blocked:
- No title/meta rewrite, merge, redirect or canonical change until the pillar and support roles are approved.

### 5. Buying Apartment Support

Future candidate:
- `/buying-apartment/`

Known current URLs:
- Old Hebrew buying-apartment unequal-shares article: ID `11261`, `15,570` words, quality `6/10`.
- `/apartment/`: `5,553` words, quality `3/10`, international/abroad framing.
- `/lawyer-for-buying-or-selling-a-house/`: `2,192` words, quality `5/10`.
- `/articles/מדריך-מקיף-לקניית-דירה-ראשונה/`: `2,379` words, quality `5/10`.
- Old purchase-process checklist article: ID `10130`, `1,224` words, quality `5/10`.

Recommended action:
- SUPPORT-PAGE COMPARISON / NO NEW PAGE YET.

Blocked:
- Do not create `/buying-apartment/` or redirect existing pages until comparison and owner approval are complete.

### 6. Sale Agreement / Contract Support

Future candidate:
- `/real-estate-purchase-agreement/`

Known current URLs:
- Contractor-contract guide: ID `11746`, `1,141` words, quality `4/10`.
- Sale-registration request page: ID `7983`, `58` words, quality `2/10`.
- Handwritten property agreement cancellation: ID `10588`, `38,656` words, quality `6/10`.

Recommended action:
- SUPPORT-PAGE STRATEGY REQUIRED.

Blocked:
- Do not publish a new agreement page or merge old legal/case pages before source/legal review.

### 7. Registry, Tax And Practical Support Pages

Current URLs:
- `/land-registration/`: `434` words, quality `2/10`, marked `EXPAND`.
- `/registration-of-real-estate-israel/`: `487` words, quality `2/10`, marked `EXPAND`.
- `/real-estate-registration-procedure-israel/`: `117,178` words, quality `3/10`, marked `REWRITE`.
- `/land-appreciation-tax/`: `2,781` words, quality `6/10`.
- `/rental-agreement/`: `5,460` words, quality `6/10`.
- `/online-rent-agreement/`: `0` words, quality `2/10`.

Recommended action:
- KEEP/EXPAND/SOURCE-REVIEW AS SUPPORT.

Blocked:
- No bulk rewrite, noindex, redirect or sitemap decisions until each support role is approved.

### 8. International Real-Estate Contamination

Examples:
- `/buying-property-in-greece/`: `29,988` words, quality `8/10`.
- `/real-estate-investing/`: `15,079` words, quality `6/10`.
- `/guide-buying-property-portugal-israelis/`: `19,850` words, quality `6/10`.
- `/apartment/`: abroad/investment framing and weak quality score `3/10`.

Current issue:
- Topic-cluster heuristic selected a Greece property page as the real-estate cluster pillar by word count.
- Related-content QA already found and fixed one international-card issue on a local real-estate cost page, but editorial classification still matters.

Recommended action:
- SEPARATE INTERNATIONAL PROPERTY FROM ISRAELI REAL-ESTATE LAW.

Blocked:
- Do not use international investment pages as support cards for Israeli lawyer-service pages unless manually approved.

## Source And Legal Review Checklist

Before any rewrite or merge, verify:
- Purchase/sale transaction stages in Israel.
- Lawyer role and fee language without misleading guarantees.
- Land Registry/Tapu process and official source links.
- Purchase tax, betterment tax and capital gains language.
- Contractor agreement, warning signs, delivery delay, guarantees and registration claims.
- Rental agreement and online contract claims.
- Planning/building rights and roof-rights claims.
- No unsupported “recommended lawyer”, “free consultation” or price promises unless approved.

## 2026-05-11 Page Decision Matrix Addendum

CREATED:
- `project-control/real-estate-page-decision-matrix-2026-05-11.md`
- `project-control/real-estate-page-decision-matrix-2026-05-11.csv`

VERIFIED:
- `/real-estate-attorney/` remains the current no-URL-change commercial candidate.
- `/real-estate-lawyer/` remains a future strategic slug only and is blocked until a migration map is approved.
- `/real-estate-lawyer-cost-2025/` is protected as high-impression support content.
- `/israeli_land_and_property_laws/`, fee/cost pages, buying-apartment candidates, registry, registration, tax, rental, contractor/defect and international-property pages are now separated by role.
- `/buying-apartment/` and `/real-estate-purchase-agreement/` remain future support slugs only until existing content and duplicate-target risks are reviewed.

RECOMMENDED:
- Run a real-estate side-by-side comparison next.
- Then create an approval-gated internal-link plan only after owner/legal approval chooses page roles.

BLOCKED:
- No public title/H1/meta, content body, URL, redirect, canonical, sitemap, internal-link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin setting or CMS/database action is approved by this matrix alone.

## Internal-Link Direction

Recommended later structure, pending owner approval:
- Homepage -> approved real-estate pillar with natural legal-help anchor.
- Approved real-estate pillar -> sale/purchase cost, buying apartment, sale agreement, land registry, land appreciation tax, rental agreement, contractor agreement and relevant lawyer directory.
- Cost article -> approved pillar plus buying-apartment and sale-agreement support pages.
- Buying-apartment support -> approved pillar, cost page, land registry and purchase-agreement support.
- International property pages -> separate international/property-investment cluster, not local real-estate lawyer intent.

## Sitemap / Canonical / Redirect Position

BLOCKED:
- No sitemap inclusion/exclusion changes.
- No canonical changes.
- No redirects.
- No `/real-estate-lawyer/` migration.
- No noindex decisions.

Required before migration:
- Full real-estate URL inventory.
- Side-by-side content comparison of current pillar and support candidates.
- GSC query/page confirmation for major subtopics.
- SERP review for `עורך דין מקרקעין`, `קניית דירה`, `עורך דין מכירת דירה`, `חוזה מכר`.
- Source/legal review.
- Internal-link map.
- Redirect/canonical/sitemap plan.
- Owner approval.

## Owner Questions

1. Should `/real-estate-attorney/` remain the current commercial pillar, or should `/real-estate-lawyer/` become the future migration target?
2. Should the homepage continue to rank for real-estate lawyer intent, or should it intentionally route that demand to the pillar?
3. Should `/real-estate-lawyer-cost-2025/` stay as a cost/sale support page rather than primary?
4. Which existing buying-apartment pages should be merged, rewritten or kept as support?
5. Should international real-estate pages be separated into a different cluster and excluded from local lawyer related cards?
6. Which registry/tax/contract pages require source/legal review before publication changes?
7. Which real-estate lawyer profiles should be mapped before pillar expansion?

## Blocked Actions

BLOCKED until explicit approval:
- Public content body edits.
- Title/H1/meta edits.
- URL/slug changes.
- Redirects.
- Canonical changes.
- Sitemap changes.
- Noindex/robots changes.
- Homepage copy/layout/link changes.
- Menu/taxonomy changes.
- Related-content/manual-card changes.
- Creating `/real-estate-lawyer/`, `/buying-apartment/` or `/real-estate-purchase-agreement/`.
- Lawyer card/profile edits.
- CMS, wp-admin, plugin-state or database writes.

## Next Approved Work

If owner approves this review-only packet, the next safe work is:
1. Build a side-by-side comparison of `/real-estate-attorney/`, `/real-estate-lawyer-cost-2025/`, `/lawyer-for-buying-or-selling-a-house/`, `/apartment/`, ID `11261`, and registry/tax/contract support pages.
2. Run deeper GSC browser/manual evidence for `עורך דין מקרקעין`, `עורך דין מכירת דירה`, `קניית דירה`, `חוזה מכר`, `מס שבח`, `טאבו`, and `חוזה שכירות`.
3. Create a source/legal review checklist for real-estate transaction claims.
4. Create an internal-link map for the Israeli real-estate cluster.
5. Draft a redirect/canonical/sitemap decision map only after owner approval.

## 2026-05-11 Source/Legal Checklist Addendum

VERIFIED:
- Created `project-control/real-estate-source-legal-checklist-2026-05-11.md`.
- Created `project-control/real-estate-source-legal-checklist-2026-05-11.csv`.
- The checklist maps source/legal gates for `/real-estate-attorney/`, future `/real-estate-lawyer/`, homepage routing, `/real-estate-lawyer-cost-2025/`, future `/buying-apartment/`, future `/real-estate-purchase-agreement/`, registry pages, tax pages, contractor/defect pages, rental support and international-property contamination.
- Official/public source anchors are now identified for Land Registry, Tax Authority, Sale Law, RMI rights context and municipal due-diligence examples.

NEXT:
- Build a page decision matrix and side-by-side comparison before internal-link, rewrite or migration planning.

BLOCKED:
- The source/legal checklist does not approve public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, homepage edits, related-card edits, lawyer cards, review/rating/schema, CRM, wp-admin settings or CMS/database writes.

## Safety

VERIFIED:
- This packet is documentation and planning only.
- No public content, URL, redirect, canonical, sitemap, noindex, taxonomy, menu, homepage, lawyer, review, CRM, plugin-state, wp-admin setting or database state was changed.
