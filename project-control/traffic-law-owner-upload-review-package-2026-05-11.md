# Traffic Law Owner Upload Review Package

Date: 2026-05-11
Status: READY FOR OWNER REVIEW / NO PUBLIC EXECUTION
Project area: Content upload readiness / SEO architecture / anti-cannibalization / internal links / source review

This package turns the first traffic-law content batch into an owner-review decision layer. It combines the outline queue, source/legal checklist and current-URL internal-link map so the next step is controlled approval, not isolated article upload.

This does not approve public content publishing, title/H1/meta changes, URL migration, redirects, canonicals, sitemap updates, taxonomy/category changes, internal-link execution, related-card metadata, schema changes, lawyer-card insertion, CRM/review work, wp-admin settings or CMS/database writes.

## Recommended Owner Decision

RECOMMENDED:
- Approve the first traffic-law group as a review-only upload package.
- Use current URLs only for the first draft/rewrite layer.
- Keep `/traffic-lawyer/` as the current planning pillar.
- Approve drafting order: traffic pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk, Marvad/medical fitness.
- Require source/legal review before any final Hebrew copy goes public.
- Require fake-data QA before any lawyer cards, ratings, reviews, phone numbers or CTA blocks are shown.

DO NOT APPROVE YET:
- `/drunk-driving/` migration.
- `/breathalyzer-test/` consolidation slug.
- `/license-suspension/` creation or migration.
- `/traffic-evidence/` or `/fatal-road-accident-offenses/` support slugs.
- Redirects from current traffic URLs.
- Sitemap inclusion changes.
- Related-card metadata writes.
- Public copy upload.
- Traffic-law lawyer cards, badges, reviews or ratings.

## Evidence Stack

VERIFIED:
- `project-control/traffic-law-content-upload-readiness-2026-05-11.md`
- `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.md`
- `project-control/traffic-law-source-legal-checklist-2026-05-11.md`
- `project-control/traffic-law-no-url-internal-link-map-2026-05-11.md`
- `project-control/traffic-law-support-decision-packet.md`
- `project-control/traffic-law-owner-approval-packet.md`

NOT VERIFIED:
- Owner approval.
- Legal approval of final Hebrew wording.
- Authenticated wp-admin body/source state.
- GA4 lead/conversion value by traffic-law URL.
- Final mobile visual QA after content is rendered.
- Full GSC API export for all traffic-law variants.

## Current Approval Scope

Approve now, if owner agrees:
- page role.
- current URL use.
- section outline direction.
- source/legal gate requirement.
- current-URL internal-link plan.
- blocked future slug posture.
- no fake lawyer/trust-data rule.

Still blocked:
- publishing final content.
- changing URLs.
- adding redirects.
- changing canonicals.
- adding sitemap entries.
- adding internal links in CMS.
- changing menus/breadcrumbs.
- adding lawyer cards or lead routing.
- adding review/rating schema.

## Upload Batch Targets

### 1. Current Traffic-Law Planning Pillar

Current URL:
- `https://jus-tice.co.il/traffic-lawyer/`

Approval decision:
- APPROVE AS CURRENT PLANNING PILLAR / NO URL CHANGE.

Drafting priority:
- P1.

Why:
- Current exact clean URL already exists.
- The public inventory marked it as thin for a commercial/service pillar.
- The first traffic-law batch can improve structure without URL migration.

Required before public upload:
- source/legal review.
- no fake lawyer card or fake rating block.
- mobile section QA.
- current-URL internal links only.

### 2. Drunk Driving Support

Current URL:
- `https://jus-tice.co.il/driving-under-the-influence/`

Approval decision:
- APPROVE AS CORE SUPPORT / EXPAND CURRENT URL / NO CLEAN SLUG YET.

Drafting priority:
- P2.

Why:
- Drunk-driving queries showed wrong-page signals on a will/inheritance page.
- The current traffic support URL exists and should be improved before creating `/drunk-driving/`.

Required before public upload:
- legal/source review of testing, license and court-consequence wording.
- no threshold, deadline or penalty claim without review.
- do not edit the will-revocation page for traffic intent.
- no future `/drunk-driving/` links yet.

### 3. Breathalyzer / Refusal / Testing Support Group

Current URLs:
- `https://jus-tice.co.il/dui-refusal-blood-breath-urine-test/`
- `https://jus-tice.co.il/yanshuf-breathalyzer-test/`
- `https://jus-tice.co.il/blood-alcohol-content-breathalyzer/`

Approval decision:
- APPROVE AS SUPPORT GROUP / DECIDE MERGE OR SEPARATE SUPPORT SET BEFORE FINAL UPLOAD.

Drafting priority:
- P3.

Why:
- Testing/refusal content supports drunk-driving intent and should not compete as a second broad pillar.
- Three current URLs exist and need role clarity before related cards, sitemap decisions or future slug work.

Required before public upload:
- owner decision on merge vs support set.
- legal review of refusal/evidence wording.
- no testing-manipulation instructions.
- no future `/breathalyzer-test/` links yet.

### 4. Speeding / Points / License Risk Support

Current URLs:
- `https://jus-tice.co.il/speeding/`
- `https://jus-tice.co.il/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/`

Approval decision:
- APPROVE AS SUPPORT GROUP / EXPAND CURRENT URLS / NO LICENSE-SUSPENSION SLUG YET.

Drafting priority:
- P4.

Why:
- Speeding and points/license risk are core traffic-law user journeys.
- `/license-suspension/` is still mixed-intent and evidence-light, so the current pages should be used first.

Required before public upload:
- legal review of point totals, correction measures, hearing and suspension wording.
- no guarantee about point removal or license retention.
- separate driver-license risk from professional-license issues.
- no future `/license-suspension/` links yet.

### 5. Marvad / Medical Fitness Support Group

Current URLs:
- `https://jus-tice.co.il/medical-institute-for-road-safety/`
- `https://jus-tice.co.il/medical-fitness-tests-for-driving-marvad-info/`
- `https://jus-tice.co.il/standards-of-medical-fitness-to-drive/`

Approval decision:
- APPROVE AS SUPPORT GROUP / REVIEW CONSOLIDATION / NO FUTURE SLUG YET.

Drafting priority:
- P5.

Why:
- Marvad/medical fitness is a real traffic-license support lane but carries high medical/privacy risk.
- The group should be source-reviewed and possibly consolidated before public rewrite.

Required before public upload:
- legal/source review of appeal, licensing and medical-fitness wording.
- no medical advice.
- no fitness or appeal outcome promises.
- privacy-aware copy and disclaimer.

## Required Pre-Upload Checklist

Before any public upload:
1. Owner approves page roles and current URL use.
2. Legal/source reviewer approves final Hebrew wording.
3. Final draft includes disclaimer and last-reviewed date.
4. No fake lawyer cards, fake ratings, fake reviews or fake badges appear.
5. CTAs route only to verified working lead/contact flows.
6. Internal links use current approved URLs only.
7. Related articles use semantic traffic-law relationships only.
8. Mobile layout is checked after content render.
9. Breadcrumbs and headings match page role.
10. Sitemap/canonical posture remains unchanged unless separately approved.
11. GSC annotation/monitoring plan is prepared for later publication.
12. Redirect map is not changed until future clean slugs are approved.

## Publishing Order

Recommended controlled order:
1. Draft and review `/traffic-lawyer/`.
2. Draft and review `/driving-under-the-influence/`.
3. Draft and review testing/refusal support group.
4. Draft and review speeding/points/license-risk support group.
5. Draft and review Marvad/medical-fitness support group.
6. QA links, mobile layout, breadcrumbs and related-card logic together.
7. Only then decide whether this group is ready for CMS upload.

## Anti-Cannibalization Rules

- Do not create a second broad traffic-lawyer page.
- Do not create `/drunk-driving/` until `/driving-under-the-influence/` migration is approved.
- Do not create `/license-suspension/` until driver-license intent is separated from professional/medical-license intent.
- Do not let testing/refusal pages compete as broad drunk-driving pillars.
- Do not mix personal-injury road-accident compensation into the traffic-defense cluster.
- Do not use will/inheritance pages as related traffic content because of wrong-page GSC signals.
- Do not use "best/top/recommended traffic lawyer" language unless separately reviewed and compliant.

## Owner Approval Options

Option A - Approve planning package only:
- Safe next step.
- Allows Hebrew draft preparation under these constraints.
- Does not change the public site.

Option B - Approve one-page draft first:
- Start with `/traffic-lawyer/`.
- Slower but safest for legal/source review.

Option C - Hold traffic-law upload and repeat this process for another cluster:
- Useful if owner wants one more cluster prepared before drafting.

Recommended:
- Option A, then draft the current traffic pillar first.

## Status

READY FOR OWNER REVIEW:
- outline structure.
- source/legal gates.
- internal-link map.
- upload order.
- blocked future slugs.
- anti-cannibalization rules.

BLOCKED:
- public upload.
- URL migration.
- sitemap changes.
- redirects.
- internal-link execution.
- related-card execution.
- lawyer-card/profile/review insertion.
