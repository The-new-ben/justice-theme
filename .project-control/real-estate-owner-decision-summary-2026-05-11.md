# Real Estate Owner Decision Summary - 2026-05-11

Status: VERIFIED / OWNER REVIEW REQUIRED / NO PUBLIC EXECUTION

## Purpose

This is the short decision layer after the real-estate source/legal checklist, page decision matrix and side-by-side review.

It is meant to help the owner approve the next controlled batch without changing the live site.

## Evidence Reviewed

VERIFIED:
- `project-control/real-estate-source-legal-checklist-2026-05-11.md`
- `project-control/real-estate-page-decision-matrix-2026-05-11.md`
- `project-control/real-estate-side-by-side-review-2026-05-11.md`
- Existing GSC rows already recorded in `project-control/gsc-keyword-page-map.csv` and `project-control/gsc-content-priorities.csv`
- Inventory and audit rows from `project-control/content-master-inventory.csv`, `project-control/content-quality-audit.csv` and `project-control/url-migration-map.csv`

NOT VERIFIED:
- Fresh GSC browser screenshots for every real-estate page/query variant.
- GA4 landing-page, lead and conversion evidence.
- Final legal review of real-estate, tax, registry, contractor, rental and fee claims.
- WordPress admin confirmation for the empty/future routes.
- Owner approval for public implementation.

## Recommended Owner Decisions

### Decision 1 - Current Primary Candidate

Recommended:
- Treat `/real-estate-attorney/` as the current no-URL-change working primary for planning.

Why:
- It is a current public `200` page.
- It has a real title, H1 and self-canonical.
- It is the safest current commercial candidate while `/real-estate-lawyer/` is not ready.

Owner action:
- Approve `/real-estate-attorney/` as the working current primary, or ask for a different current URL.

### Decision 2 - Future Clean Slug

Recommended:
- Keep `/real-estate-lawyer/` future-only until routing and migration planning are fixed.

Why:
- The live route currently returns `200 OK`, but the fetched response has no title, H1, canonical, deployment marker or visible body sample.
- A `200` empty route can be worse than a clear 404 because it may confuse crawlers and internal-link planning.
- Migrating from `/real-estate-attorney/` or `/israeli_land_and_property_laws/` to `/real-estate-lawyer/` requires old-to-new mapping, redirects, canonicals, sitemap and internal-link updates.

Owner action:
- Approve a route/CMS audit for `/real-estate-lawyer/` before any link, sitemap or redirect decision.

### Decision 3 - Cost / Fee Support

Recommended:
- Protect `/real-estate-lawyer-cost-2025/` as support.
- Compare the Hebrew fee page before any merge or redirect.

Why:
- `/real-estate-lawyer-cost-2025/` carries visible GSC support demand for sale-lawyer, buying-apartment and sale-agreement variants.
- It is not the broad commercial pillar, but it is too valuable to redirect or canonicalize away blindly.
- The Hebrew fee page may overlap and needs side-by-side cost review.

Owner action:
- Approve protected support status for the cost page and keep the Hebrew fee page in merge-review only.

### Decision 4 - Broad Property-Laws Page

Recommended:
- Keep `/israeli_land_and_property_laws/` as support or merge-review, not the commercial primary.

Why:
- Its title/H1 includes broad `עורך דין מקרקעין` language.
- It can compete with `/real-estate-attorney/` if not repositioned.
- The URL map already proposed `/real-estate-lawyer/`, but that target is currently unsafe.

Owner action:
- Approve a comparison/repositioning review only. Do not migrate it yet.

### Decision 5 - Buying Apartment URL Strategy

Recommended:
- Keep `/buying-apartment/` future-only.
- Do not link, redirect or add it to sitemap yet.

Why:
- The live route currently resolves to homepage content with homepage canonical.
- Existing buying-apartment candidates include old Hebrew and article URLs with duplicate-target risk.
- The cost page also carries buying-apartment impressions, so the support structure must be planned carefully.

Owner action:
- Approve a buying-apartment comparison pack before creating or repairing the future slug.

### Decision 6 - Sale/Purchase Agreement URL Strategy

Recommended:
- Keep `/real-estate-purchase-agreement/` future-only.
- Do not link, redirect or add it to sitemap yet.

Why:
- The live route currently resolves to homepage content with homepage canonical.
- Existing agreement, contractor-contract and sale-registration pages need source/legal comparison before a new support slug is approved.

Owner action:
- Approve a sale-agreement comparison pack before creating or repairing the future slug.

### Decision 7 - Registry / Tax / Rental / Contractor Support

Recommended:
- Keep these as support lanes, not broad commercial pillars:
  - `/land-registration/`
  - `/registration-of-real-estate-israel/`
  - `/real-estate-registration-procedure-israel/`
  - `/land-appreciation-tax/`
  - `/rental-agreement/`
  - `/online-rent-agreement/`
  - `/common-construction-defects-and-how-to-manage-them/`
  - `/tma-38-and-urban-renewal-lawyer/`

Why:
- Registry and registration pages are thin/overlapping.
- The registration procedure page is extremely long and low quality; it is not a pillar by word count.
- Tax, rental, contractor and urban-renewal pages need source/legal review before public rewrite.
- `/online-rent-agreement/` is a live page but inventory says `0` words, so it needs owner/tool review before noindex/remove/redirect decisions.

Owner action:
- Approve support status and keep public execution blocked.

### Decision 8 - International Property Boundary

Recommended:
- Separate international property pages from Israeli real-estate lawyer-service intent.

Why:
- `/buying-property-in-greece/` is long and high quality by audit score, but its intent is international property/investment, not Israeli real-estate lawyer service.
- `/apartment/` is abroad/investment framed.
- International pages can pollute related cards and internal links if they appear under local Israeli real-estate lawyer pages.

Owner action:
- Approve international-property as a separate cluster.

### Decision 9 - Internal Links

Recommended:
- Do not create live internal links yet.
- The next planning artifact can be an internal-link map marked `PLANNED_NEEDS_OWNER_APPROVAL`, but it must avoid unsafe future routes.

Why:
- `/real-estate-lawyer/`, `/buying-apartment/` and `/real-estate-purchase-agreement/` are unsafe live destinations right now.
- If the final primary remains `/real-estate-attorney/`, support links should point there until a full URL migration is approved.

Owner action:
- Approve whether the next internal-link plan should use `/real-estate-attorney/` as the temporary primary target and exclude unsafe future slugs.

## Safe Next Batch

Recommended next work before any public CMS action:
1. Direct GSC browser pass for:
   - עורך דין מקרקעין
   - עורך דין מקרקעין מומלץ
   - עורך דין מקרקעין מחיר
   - עורך דין מכירת דירה
   - עורך דין קניית דירה
   - קניית דירה
   - חוזה מכר
   - רישום מקרקעין
   - מס שבח
2. Route/CMS audit for:
   - `/real-estate-lawyer/`
   - `/buying-apartment/`
   - `/real-estate-purchase-agreement/`
3. Approval-gated internal-link plan that:
   - uses only safe current URLs,
   - marks future slugs as blocked,
   - keeps all rows `PLANNED_NEEDS_OWNER_APPROVAL`.
4. Outline-only expansion plan for `/real-estate-attorney/` after owner/legal review.
5. Support comparison pack for the cost, Hebrew fee, buying-apartment and sale-agreement pages.

## Blocked Actions

BLOCKED:
- Public content edits.
- Title/H1/meta changes.
- URL/slug changes.
- 301 redirects.
- Canonical changes.
- Sitemap changes.
- Noindex/robots changes.
- Menu, breadcrumb, related-card or homepage changes.
- Lawyer-card/profile wiring.
- CMS/database writes.
- Review/rating/CRM changes.

## Safety

VERIFIED:
- This summary is documentation only.
- No live public content, URL, redirect, sitemap, canonical, noindex, menu, taxonomy, internal-link, related-card, lawyer-card, CRM, review, wp-admin setting or database state was changed.
