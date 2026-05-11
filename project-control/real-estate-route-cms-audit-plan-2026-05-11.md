# Real Estate Route / CMS Audit Plan - 2026-05-11

Status: VERIFIED / REVIEW ONLY / OWNER APPROVAL REQUIRED / NO PUBLIC EXECUTION

## Purpose

This plan documents the route and CMS audit needed before the real-estate future slugs can be used in internal links, redirects, canonicals, sitemaps, breadcrumbs, related cards, menus or content plans.

It does not approve route fixes, page creation, redirects, canonical changes, sitemap changes, content edits or CMS writes.

## Routes Checked

VERIFIED on 2026-05-11:
- `https://jus-tice.co.il/real-estate-lawyer/`
- `https://jus-tice.co.il/buying-apartment/`
- `https://jus-tice.co.il/real-estate-purchase-agreement/`

## Live Findings

### ROUTE-RE-001 - `/real-estate-lawyer/`

Live behavior:
- Status/effective URL: `200 https://jus-tice.co.il/real-estate-lawyer/`
- Response bytes: `0`
- Title: missing.
- H1: missing.
- Canonical: missing.
- Deployment marker: missing.

Interpretation:
- This is an empty `200 OK` route.
- It is not safe as a sitemap, canonical, redirect, internal-link or related-card target.
- It should remain future-only until the CMS/route source is identified.

Risk:
- HIGH SEO risk if linked or submitted because Google may see an empty successful page.
- HIGH migration risk if old pages are redirected to it.

Required audit:
- Check WordPress admin for a page/post/custom object with slug `real-estate-lawyer`.
- Check page status: published, draft, private, trash or empty page.
- Check if a plugin, Rank Math, 404 handler, uPress cache/SeoEdge rule, `.htaccess`, nginx rule or theme route is generating the empty response.
- Check permalink rules and slug conflicts.
- Check whether the URL exists in sitemap output.
- Check whether GSC has indexed, discovered or excluded it.

Unblock criteria:
- Either the route becomes a real approved page with body content, title/H1, self-canonical and sitemap/internal-link plan, or it remains blocked and excluded from all link/migration plans.

### ROUTE-RE-002 - `/buying-apartment/`

Live behavior:
- Status/effective URL: `200 https://jus-tice.co.il/`
- Title: homepage title.
- H1: homepage H1.
- Canonical: `https://jus-tice.co.il/`
- Deployment marker: `2026-05-11-branding-polish-v3`

Interpretation:
- The route currently resolves to homepage content and homepage canonical.
- It is not a real buying-apartment page right now.
- It must not be used as a support destination until routing is fixed and the competing buying-apartment content is compared.

Risk:
- HIGH SEO risk if linked because it creates a misleading support URL that canonicalizes to homepage.
- HIGH migration risk because existing old buying-apartment rows have duplicate-target proposals to this slug.

Required audit:
- Check if `/buying-apartment/` exists in WordPress as a page/post or only as a proposed slug in the migration map.
- Check redirect and 404-to-homepage behavior.
- Check whether a permalink rewrite, plugin rule or cached rule is sending this path to homepage.
- Compare current buying-apartment candidates before creating or repairing the route:
  - old Hebrew buying-apartment article,
  - first-apartment guide under `/articles/`,
  - `/lawyer-for-buying-or-selling-a-house/`,
  - `/real-estate-lawyer-cost-2025/`,
  - `/apartment/` as an international/abroad boundary.

Unblock criteria:
- A real support page exists, is owner/legal approved, self-canonicalizes, is mapped from old URLs only after redirect planning, and is included in sitemap/internal-link plans only after approval.

### ROUTE-RE-003 - `/real-estate-purchase-agreement/`

Live behavior:
- Status/effective URL: `200 https://jus-tice.co.il/`
- Title: homepage title.
- H1: homepage H1.
- Canonical: `https://jus-tice.co.il/`
- Deployment marker: `2026-05-11-branding-polish-v3`

Interpretation:
- The route currently resolves to homepage content and homepage canonical.
- It is not a real sale/purchase-agreement support page right now.
- It must not be used in links, sitemap, redirects or related cards.

Risk:
- HIGH SEO risk if linked because it looks like a valid support URL but canonicalizes to homepage.
- HIGH content risk because agreement, contractor-contract and sale-registration pages need source/legal comparison first.

Required audit:
- Check if `/real-estate-purchase-agreement/` exists in WordPress or only as a proposed future slug.
- Check redirect and 404-to-homepage behavior.
- Check whether contractor-contract, sale-registration, agreement cancellation or contract-related pages already serve the intent.
- Check official/legal source gates before creating support content.

Unblock criteria:
- A real approved agreement support page exists or the slug stays blocked. It must not be linked, submitted, canonicalized or used as a redirect target while it shows homepage content.

## Global Route Audit Checklist

Before any future slug is unblocked, verify:
1. The route returns a non-empty response.
2. The page has the intended title, H1 and body content.
3. Canonical matches the intended final URL.
4. The route is not homepage content.
5. The route is not an empty `200`.
6. The route is not created only by a plugin fallback.
7. The route appears in sitemap only after approval.
8. Internal links point to it only after approval.
9. Old URLs are mapped before any redirect.
10. GSC indexing status is checked after route repair.
11. Cache/SeoEdge behavior is cleared and verified.
12. Mobile/template rendering is checked only after content exists.

## Recommended Owner Decisions

RECOMMENDED:
- Keep `/real-estate-lawyer/`, `/buying-apartment/` and `/real-estate-purchase-agreement/` blocked from all internal links, redirects, canonicals, sitemap plans and related cards.
- Use `/real-estate-attorney/` as the current safe planning primary until migration is approved.
- Do not create or repair future slugs until the underlying content roles are approved.
- Treat route repair as a controlled technical/SEO batch, not as a content upload.

## Blocked Actions

BLOCKED:
- Route repair.
- Page creation.
- Public content edits.
- Title/H1/meta changes.
- Redirects.
- Canonical changes.
- Sitemap changes.
- Internal-link changes.
- Related-card/menu/breadcrumb/homepage changes.
- CMS/database writes.
- wp-admin setting changes.

## Next Safe Step

After owner approval:
1. Perform wp-admin/CMS lookup for the three slugs.
2. Check redirect/404 plugin state and cache/SeoEdge behavior.
3. Decide whether each slug should become a real page, stay blocked, or be reserved for later migration.
4. Only then build the real-estate internal-link plan using safe current URLs and `PLANNED_NEEDS_OWNER_APPROVAL` rows.

## Safety

VERIFIED:
- This is documentation-only.
- No public route, content, URL, redirect, canonical, sitemap, noindex, menu, taxonomy, internal-link, related-card, lawyer-card, CRM, review, wp-admin setting or database state was changed.
