# Personal Injury / Damages Page Decision Matrix - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NO PUBLIC EXECUTION

Purpose:
Classify the personal-injury, damages, tort-law, car-accident, insurance and work-accident pages before any rewrite, merge, URL migration, redirect, canonical, sitemap, title/H1/meta, internal-link, related-card, menu or CMS action.

This matrix uses:
- `project-control/personal-injury-owner-approval-packet.md`
- `project-control/personal-injury-source-legal-checklist-2026-05-11.md`
- `project-control/content-master-inventory.csv`
- `project-control/content-quality-audit.csv`
- `project-control/gsc-keyword-page-map.csv`
- `project-control/gsc-content-priorities.csv`
- `project-control/slug-conflict-review.csv`

No row in this matrix approves a live-site action.

## Live URL Verification

VERIFIED on 2026-05-11:
- `https://jus-tice.co.il/tort-lawyer/` returns `200`.
- `https://jus-tice.co.il/punitive-damage/` returns `200`.
- `https://jus-tice.co.il/car-accident-auto-injury-lawyer/` returns `200`.
- `https://jus-tice.co.il/israel-road-accident-compensation-law/` returns `200`.
- `https://jus-tice.co.il/compulsory-motor-vehicle-insurance/` returns `200`.
- `https://jus-tice.co.il/personal-injury-law/` returns `200`.
- `https://jus-tice.co.il/tort-reform/` returns `200`.
- `https://jus-tice.co.il/outline-of-tort-law/` returns `200`.
- `https://jus-tice.co.il/deep-pocket/` returns `200`.

NOT VERIFIED in this pass:
- Exact old Hebrew/taxonomy verdict URL for `עורך דין נזיקין`.
- Future clean slugs `/personal-injury-lawyer/`, `/car-accident-lawyer/` and `/work-accident-lawyer/` as approved current pages.
- Full GSC API traffic risk.
- GA4 conversion and lead value.

## Page Decisions

### `/personal-injury-lawyer/`

Decision:
- STRATEGIC FUTURE SLUG / NO CURRENT EXECUTION.

Reason:
- It is the strategic clean commercial target, but no approved current public page or migration map exists.
- Creating it now could duplicate `/tort-lawyer/` or existing accident pages.

Allowed next work:
- Owner primary-selection decision.
- Side-by-side comparison.
- URL migration planning only after approval.

Blocked:
- No page creation.
- No redirect.
- No sitemap/canonical/menu change.

### `/tort-lawyer/`

Decision:
- CURRENT THIN DAMAGES/SERVICE CANDIDATE / COMPARE BEFORE EXPANDING.

Reason:
- Direct 200 current page.
- 507 words, quality 4/10, thin, no internal links.
- It may be the safest current local service page until a future clean pillar is approved.

Allowed next work:
- Side-by-side comparison with old verdict/category URL and support pages.
- Source-backed outline proposal.

Blocked:
- No rewrite, title/H1/meta change or internal-link execution without approval.

### `/car-accident-auto-injury-lawyer/`

Decision:
- PROTECT AS CURRENT GSC-VISIBLE CAR-ACCIDENT CANDIDATE.

Reason:
- Direct 200 current page.
- Thin/outdated, but GSC visible for `תאונת דרכים`.
- It is a migration-risk page because a future `/car-accident-lawyer/` slug may be cleaner but is not approved.

Allowed next work:
- Side-by-side comparison.
- Source/legal rewrite outline.
- Migration map draft after owner approval.

Blocked:
- No redirect to `/car-accident-lawyer/`.
- No title/H1/meta/body rewrite.
- No canonical/sitemap/internal-link switch.

### `/car-accident-lawyer/`

Decision:
- STRATEGIC FUTURE CLEAN SLUG / NO CURRENT EXECUTION.

Reason:
- `slug-conflict-review.csv` records conflict risk and no exact current clean URL was verified.
- The current GSC-visible car-accident page must be protected first.

Allowed next work:
- Primary selection and old-to-new mapping only.

Blocked:
- No duplicate page creation.
- No migration without 301 redirect plan.

### `/israel-road-accident-compensation-law/`

Decision:
- KEEP AS ROAD-ACCIDENT LEGAL SUPPORT AFTER SOURCE REVIEW.

Reason:
- Direct 200 current page.
- Thin/outdated but relevant to the car-accident cluster.
- Should support the car-accident page, not compete with it.

Allowed next work:
- Source-backed rewrite outline using the road-accident compensation law and public rights sources.

Blocked:
- Do not make it the commercial service pillar.

### `/compulsory-motor-vehicle-insurance/`

Decision:
- KEEP OR REWRITE AS INSURANCE SUPPORT / NOT PRIMARY.

Reason:
- Direct 200 current page.
- Thin/outdated quality 2/10.
- Insurance intent is support intent, not broad damages or lawyer-service intent.

Allowed next work:
- Rewrite outline after source/legal review.

Blocked:
- No policy-specific advice.
- No service-pillar role.

### `/punitive-damage/`

Decision:
- PROTECT AS SPECIALIST SUPPORT / NOT BROAD PILLAR BY WORD COUNT.

Reason:
- Direct 200 current page.
- Very long article, but the intent is specialist punitive damages, not broad lawyer-service intent.
- It was selected heuristically by word count and must not become pillar automatically.

Allowed next work:
- Specialist support classification.
- Internal link planning after owner approval.

Blocked:
- No pillar assignment.
- No content replacement.

### `/tort-reform/`

Decision:
- KEEP AS INFORMATIONAL TORT SUPPORT / REVIEW FOR CURRENTNESS.

Reason:
- Direct 200 current page.
- 7,072 words, quality 6/10, but no internal links.
- Reform/current-law framing requires legal review.

Allowed next work:
- Compare with `/outline-of-tort-law/` and `/tort-lawyer/`.

Blocked:
- Do not make it the broad service page.

### `/outline-of-tort-law/`

Decision:
- KEEP AS INFORMATIONAL SUPPORT OR MERGE CANDIDATE.

Reason:
- Direct 200 current page.
- 1,443 words, quality 5/10, no internal links.
- It can support an approved service page if not duplicative.

Allowed next work:
- Compare against tort-law support pages.

Blocked:
- No merge or rewrite without side-by-side review.

### `/deep-pocket/`

Decision:
- NARROW CONCEPT SUPPORT / EXPAND OR MERGE REVIEW.

Reason:
- Direct 200 current page.
- Thin 507-word tort concept page.
- Likely support only.

Allowed next work:
- Decide whether to expand as glossary/support or merge into a tort overview.

Blocked:
- No standalone pillar use.

### `/personal-injury-law/`

Decision:
- SEPARATE US/INTERNATIONAL CONTENT FROM ISRAELI SERVICE CLUSTER.

Reason:
- Direct 200 current page.
- US-focused title and content.
- Must not compete with Israeli `נזקי גוף`, `נזיקין` or `תאונות דרכים` pages.

Allowed next work:
- International cluster classification.
- Disclaimer and internal-link boundary review.

Blocked:
- Do not merge into Israeli personal-injury pillar.

### `/work-accident-lawyer/`

Decision:
- FUTURE BOUNDARY TOPIC / RECHECK BEFORE PRIORITIZATION.

Reason:
- Work accident may belong to personal injury, employment law and national insurance.
- Checked GSC row for `תאונת עבודה` showed no visible rows in the current pass.

Allowed next work:
- More GSC/SERP checks.
- Boundary matrix across national insurance, employment and damages.

Blocked:
- No new page or internal-link structure yet.

### Old Hebrew/taxonomy verdict URL for `עורך דין נזיקין`

Decision:
- PROTECT / EXACT URL RECHECK REQUIRED.

Reason:
- GSC browser evidence mapped `עורך דין נזיקין` weakly to an old verdict/category-style URL.
- Exact URL needs rechecking before any old-to-new mapping.

Allowed next work:
- Exact URL capture.
- Compare whether it should remain case-law/category support.

Blocked:
- No redirect.
- No deletion.
- No canonical/noindex decision.

## Cluster-Level Decisions

Primary decision remains open:
- current possible service page: `/tort-lawyer/`.
- future clean commercial slug: `/personal-injury-lawyer/`.
- car-accident current page: `/car-accident-auto-injury-lawyer/`.
- future car-accident slug: `/car-accident-lawyer/`.

Recommended next safe step:
1. Side-by-side comparison of the current service/support pages.
2. Exact old URL capture for the GSC-visible Hebrew/taxonomy verdict URL.
3. GSC browser checks for `נזקי גוף`, `תביעת נזיקין`, `עורך דין תאונות דרכים`, `תאונת עבודה` variants.
4. Draft internal-link map only after owner approves primary/support roles.

## Blocked Actions

BLOCKED until owner and legal review approve:
- public content rewrite.
- title/H1/meta changes.
- URL/slug changes.
- 301 redirects.
- noindex/canonical/sitemap changes.
- menu/taxonomy/breadcrumb changes.
- internal-link or related-card execution.
- lawyer-card/profile wiring.
- CMS/database writes.
