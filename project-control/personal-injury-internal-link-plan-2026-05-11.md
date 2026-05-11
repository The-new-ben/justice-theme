# Personal Injury / Damages Internal-Link Plan - 2026-05-11

Status: VERIFIED / PLANNED / NEEDS OWNER APPROVAL

## Purpose

This plan maps the internal links and related-content relationships that should connect the personal-injury, damages, tort-law, road-accident and insurance cluster after owner/legal approval.

It does not change the website.

Evidence inputs:
- `project-control/personal-injury-source-legal-checklist-2026-05-11.md`
- `project-control/personal-injury-page-decision-matrix-2026-05-11.md`
- `project-control/personal-injury-side-by-side-review-2026-05-11.md`
- `project-control/internal-link-map.csv`
- `project-control/gsc-content-priorities.csv`

## Rules

VERIFIED:
- Links should use natural Hebrew anchor text.
- Supporting articles should link back to the approved primary service page.
- The primary service page should link to support pages only after its role is approved.
- Car-accident links must protect the current GSC-visible URL until migration is approved.
- Work-accident links must wait for the national-insurance/employment/personal-injury boundary decision.
- International/US personal-injury content must not be mixed into Israeli-law service intent without clear boundary wording.

BLOCKED:
- No template edits.
- No CMS edits.
- No related-card edits.
- No menu/breadcrumb/taxonomy edits.
- No URL, redirect, canonical or sitemap edits.

## Proposed Structure

### Current Service Candidate

Current broad Israeli damages candidate:
- `/tort-lawyer/`

Future clean commercial candidate after approval:
- `/personal-injury-lawyer/`

Why:
- `/tort-lawyer/` is a current 200 page and has local damages/service intent, but it is thin.
- `/personal-injury-lawyer/` is strategically useful, but it is not an approved current page and should not be created blindly.
- If the owner later approves `/personal-injury-lawyer/`, the link map must be migrated through an old-to-new redirect/canonical/sitemap plan.

### Car-Accident Subcluster

Current protected car-accident candidate:
- `/car-accident-auto-injury-lawyer/`

Future clean car-accident candidate after approval:
- `/car-accident-lawyer/`

Support pages:
- `/israel-road-accident-compensation-law/`
- `/compulsory-motor-vehicle-insurance/`

Why:
- `/car-accident-auto-injury-lawyer/` has visible GSC evidence for road-accident terms.
- The future `/car-accident-lawyer/` slug should not be created or redirected to until a full map exists.

### Tort-Law Support

Support pages:
- `/punitive-damage/`
- `/tort-reform/`
- `/outline-of-tort-law/`
- `/deep-pocket/`

Why:
- These pages can strengthen the broad damages cluster, but they should not compete with the service page.
- Long pages such as `/punitive-damage/` and `/tort-reform/` must not become service pillars by word count alone.

### International Boundary

Separate page:
- `/personal-injury-law/`

Why:
- It is US/international content and must not become part of Israeli personal-injury lawyer intent without explicit boundary wording.

## Link Priorities

CRITICAL:
- Support-to-service links from car-accident, compensation-law and insurance pages back to the approved broad damages service page.
- Service-to-car-accident links from `/tort-lawyer/` to `/car-accident-auto-injury-lawyer/` while the current page is protected.

HIGH:
- Car-accident page links to compensation-law and compulsory-insurance support pages.
- Tort concept pages link back to the broad damages service page.
- Support pages should not target the same title/H1 intent as the service page.

MEDIUM:
- Specialist links from `/tort-lawyer/` to punitive damages, tort reform and tort-law overview pages.
- Boundary link from US personal-injury page to Israeli damages page only with clear wording.

BLOCKED:
- Any link to `/personal-injury-lawyer/` or `/car-accident-lawyer/` as a live destination before those URLs are approved.
- Any work-accident link structure before boundary review.
- Any related-card or template implementation before owner approval.

## Existing Link Context

VERIFIED:
- `internal-link-map.csv` already shows `/israel-road-accident-compensation-law/` linking to `/tort-lawyer/`.
- Several sitemap/helper pages link to the cluster, but those are not a real semantic user journey.
- Most current cluster pages have no meaningful outgoing internal links in the audit.

REVIEW:
- Related-content cards on sampled live pages may drift into medical-malpractice or generic legal content. This plan should eventually feed manual related URLs or cluster-aware related-card logic.

## Key Warnings

VERIFIED:
- `/tort-lawyer/` is thin; adding links alone will not make it a high-quality pillar.
- `/car-accident-auto-injury-lawyer/` is thin/outdated, but it is the current GSC-visible car-accident URL and must be protected.
- `/punitive-damage/` is huge but too narrow for broad service intent.
- `/personal-injury-law/` is US-focused and should not be pulled into the Israeli service cluster as a normal support page.
- Old Hebrew damages/category URL variants currently redirect to the homepage while routing/plugin behavior is unresolved, so exact URL capture is still required.

## Next Safe Work

1. Owner decides whether `/tort-lawyer/` remains the current primary service page or whether `/personal-injury-lawyer/` becomes the future approved target.
2. Owner decides whether `/car-accident-auto-injury-lawyer/` should be rewritten in place first or migrated later to `/car-accident-lawyer/`.
3. Source/legal review approves the car-accident, compensation-law and insurance support wording.
4. Internal-link rows move from `PLANNED_NEEDS_OWNER_APPROVAL` to `APPROVED_FOR_CMS_OR_TEMPLATE`.
5. Only then should the links be added to page content, related-card metadata or templates.

## Safety

VERIFIED:
- This is a documentation and CSV planning pass only.
- No public links were added.
- No live related cards, menus, breadcrumbs, sitemap, canonical, redirects, CMS records, titles, H1s, meta descriptions, lawyer cards, CRM data or review data were changed.

