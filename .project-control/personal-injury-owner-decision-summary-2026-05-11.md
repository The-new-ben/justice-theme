# Personal Injury / Damages Owner Decision Summary - 2026-05-11

Status: VERIFIED / OWNER REVIEW REQUIRED / NO PUBLIC EXECUTION

## Purpose

This is the short decision layer after the personal-injury/damages source checklist, page matrix, side-by-side review, internal-link plan and SERP review.

It is meant to help the owner approve the next controlled batch without changing the live site.

## Evidence Reviewed

VERIFIED:
- `project-control/personal-injury-source-legal-checklist-2026-05-11.md`
- `project-control/personal-injury-page-decision-matrix-2026-05-11.md`
- `project-control/personal-injury-side-by-side-review-2026-05-11.md`
- `project-control/personal-injury-internal-link-plan-2026-05-11.md`
- `project-control/serp-personal-injury-damages-review-2026-05-11.md`
- Existing GSC rows already recorded in `project-control/gsc-keyword-page-map.csv` and `project-control/gsc-content-priorities.csv`

NOT VERIFIED:
- Fresh GSC browser screenshots for every damages/road-accident/work-accident variant.
- GA4 landing-page and conversion evidence.
- Final legal review of damages, road-accident, insurance and work-accident claims.
- Owner approval for public implementation.

## Recommended Owner Decisions

### Decision 1 - Current Primary Candidate

Recommended:
- Treat `/tort-lawyer/` as the current broad Israeli damages/service candidate for planning.

Why:
- It is a current public 200 page.
- It matches local damages/service intent better than specialist concept pages.
- It is thin, so it needs approved expansion before it can be a real pillar.

Owner action:
- Approve it as the current no-URL-change working primary, or ask for a different current URL.

### Decision 2 - Future Clean Slug

Recommended:
- Keep `/personal-injury-lawyer/` as future-only.

Why:
- It is strategically cleaner, but not approved as the current live target.
- Using it now could create duplicates or require unsafe redirect/canonical decisions.

Owner action:
- Approve future migration planning only after the current page is expanded or compared and the redirect map is ready.

### Decision 3 - Car-Accident URL Strategy

Recommended:
- Protect `/car-accident-auto-injury-lawyer/` and improve/review it in place first.
- Keep `/car-accident-lawyer/` future-only.

Why:
- GSC-visible road-accident signal currently sits on `/car-accident-auto-injury-lawyer/`.
- The future clean slug is desirable, but migration requires old-to-new mapping, redirects, canonicals, sitemap and internal-link updates.

Owner action:
- Approve in-place review/outline before any migration.

### Decision 4 - Support Pages

Recommended:
- Keep these as support/specialist pages:
  - `/israel-road-accident-compensation-law/`
  - `/compulsory-motor-vehicle-insurance/`
  - `/punitive-damage/`
  - `/tort-reform/`
  - `/outline-of-tort-law/`
  - `/deep-pocket/`

Why:
- They strengthen the cluster but should not compete as broad service pillars.
- Some are thin/outdated and need source-backed review.

Owner action:
- Approve support roles, not public edits yet.

### Decision 5 - Work Accident Boundary

Recommended:
- Keep `/work-accident-lawyer/` future-only.

Why:
- SERP evidence shows work accident overlaps personal injury, national insurance and employment law.
- Current checked GSC row had no visible result.

Owner action:
- Decide later whether work accident belongs under personal injury, national insurance, employment law, or its own controlled subcluster.

### Decision 6 - Internal Links

Recommended:
- Keep the internal-link CSV as `PLANNED_NEEDS_OWNER_APPROVAL`.
- Do not add links publicly yet.

Why:
- Internal links should follow the approved primary/support roles.
- If the final primary changes, link targets must change too.

Owner action:
- Approve rows only after primary URL and car-accident strategy are approved.

### Decision 7 - Old URLs And Migration

Recommended:
- Do not redirect or noindex old Hebrew/taxonomy damages URLs yet.

Why:
- GSC has at least one old verdict/category-style damages URL with weak signal.
- Some old variants currently redirect to the homepage because of routing/plugin behavior.

Owner action:
- Approve an exact old-URL capture and 404/redirect routing review before migration.

## Safe Next Batch

Recommended next work before any public CMS action:
1. Direct GSC browser pass for:
   - עורך דין נזיקין
   - נזקי גוף
   - תביעת נזיקין
   - פיצויים נזקי גוף
   - תאונת דרכים
   - עורך דין תאונות דרכים
   - תאונת עבודה
   - עורך דין תאונת עבודה
2. Exact old URL capture for damages/taxonomy/verdict URLs.
3. Outline-only expansion plan for `/tort-lawyer/`.
4. Outline-only in-place review plan for `/car-accident-auto-injury-lawyer/`.
5. Owner/legal approval before any public title, content, URL, link or redirect change.

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
- No live public content, URL, redirect, sitemap, canonical, noindex, menu, taxonomy, related-card, lawyer-card, CRM, review, wp-admin setting or database state was changed.

