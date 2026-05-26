# Criminal Law Owner Upload Review Package

Date: 2026-05-11
Status: READY FOR OWNER REVIEW / NO PUBLIC EXECUTION
Project area: Content upload readiness / SEO architecture / anti-cannibalization / internal links / source review

This package turns the first criminal-law content batch into an owner-review decision layer. It combines the outline queue, source/legal checklist and current-URL internal-link map so the next step is controlled approval, not isolated article upload.

This does not approve public content publishing, title/H1/meta changes, URL migration, redirects, canonicals, sitemap updates, taxonomy/category changes, internal-link execution, related-card metadata, schema changes, lawyer-card insertion, CRM/review work, wp-admin settings or CMS/database writes.

## Recommended Owner Decision

RECOMMENDED:
- Approve the first criminal-law group as a review-only upload package.
- Use current URLs only for the first draft/rewrite layer.
- Keep `/criminal-defense-attorney/` as the current planning pillar until `/criminal-lawyer/` route/migration work is approved.
- Approve drafting order: criminal pillar, police investigation, detention, indictment, drug offenses.
- Require source/legal review before any final Hebrew copy goes public.
- Require fake-data QA before any lawyer cards, ratings, reviews, phone numbers or CTA blocks are shown.

DO NOT APPROVE YET:
- `/criminal-lawyer/` migration.
- `/police-investigation/`, `/indictment/`, `/pretrial-detention/`, `/drug-offenses/` clean slugs.
- Redirects from old Hebrew/GSC-visible URLs.
- Sitemap inclusion changes.
- Related-card metadata writes.
- Public copy upload.
- Criminal-law lawyer cards, badges, reviews or ratings.

## Evidence Stack

VERIFIED:
- `project-control/criminal-law-content-upload-readiness-2026-05-11.md`
- `project-control/criminal-law-primary-selection-2026-05-11.md`
- `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.md`
- `project-control/criminal-law-source-legal-checklist-2026-05-11.md`
- `project-control/criminal-law-no-url-internal-link-map-2026-05-11.md`
- `project-control/criminal-law-primary-live-url-check-2026-05-11.csv`
- `project-control/criminal-law-primary-redirect-check-2026-05-11.csv`

NOT VERIFIED:
- Owner approval.
- Legal approval of final Hebrew wording.
- Authenticated wp-admin body/source state.
- GA4 lead/conversion value by criminal-law URL.
- Final mobile visual QA after content is rendered.
- Full GSC API export for all criminal-law variants.

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

### 1. Current Criminal-Law Planning Pillar

Current URL:
- `https://jus-tice.co.il/criminal-defense-attorney/`

Approval decision:
- APPROVE AS CURRENT PLANNING PILLAR / NO URL CHANGE.

Drafting priority:
- P1.

Why:
- Live URL is verified as `200`, self-canonical and aligned with criminal-lawyer title/H1 signals.
- `/criminal-lawyer/` currently redirects to the homepage and is unsafe as a live target.

Required before public upload:
- source/legal review.
- no fake lawyer card or fake rating block.
- mobile section QA.
- current-URL internal links only.

### 2. Police Investigation Support

Current URL:
- `https://jus-tice.co.il/%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%97%D7%A7%D7%99%D7%A8%D7%94-%D7%91%D7%9E%D7%A9%D7%98%D7%A8%D7%94/`

Approval decision:
- APPROVE AS CORE SUPPORT / EXPAND CURRENT URL / NO CLEAN SLUG YET.

Drafting priority:
- P2.

Why:
- Police investigation is a core criminal-law support intent and should connect to pillar, indictment and detention.

Required before public upload:
- legal review of rights wording.
- source-backed disclaimer.
- no interrogation-answer scripts.
- no future `/police-investigation/` links yet.

### 3. Detention Support Group

Current URLs:
- `https://jus-tice.co.il/detention-before-charge-or-trial/`
- `https://jus-tice.co.il/detention-days/`

Approval decision:
- APPROVE DETENTION-BEFORE-CHARGE AS CURRENT PRIMARY DETENTION SUPPORT CANDIDATE / REVIEW DETENTION-DAYS AS SUPPORT OR MERGE.

Drafting priority:
- P3.

Why:
- Detention is urgent user intent and a necessary support lane for investigation and indictment.

Required before public upload:
- owner decision on expand vs merge.
- legal review of time/extension/release wording.
- no release guarantees.
- no future `/pretrial-detention/` links yet.

### 4. Indictment Support

Current URL:
- `https://jus-tice.co.il/articles/%D7%9E%D7%97%D7%99%D7%A7%D7%AA-%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%97%D7%96%D7%A8%D7%94-%D7%9E%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%91%D7%99%D7%98%D7%95%D7%9C/`

Approval decision:
- APPROVE AS CORE SUPPORT / EXPAND CURRENT URL / DO NOT USE NETANYAHU CASE PAGE AS GENERAL GUIDE.

Drafting priority:
- P4.

Why:
- The current article is the best general indictment-support candidate in the reviewed set, but GSC also shows specific-case ambiguity that must be protected.

Required before public upload:
- legal review of hearing/deadline/cancellation wording.
- no outcome promises.
- no future `/indictment/` links yet.

### 5. Drug Offenses Support

Current URL:
- `https://jus-tice.co.il/drug-offenses-criminal-lawyer/`

Approval decision:
- APPROVE AS CORE SUPPORT LARGE ASSET / CONSOLIDATE CURRENT URL / NO DUPLICATE CLEAN SLUG YET.

Drafting priority:
- P5.

Why:
- This is a large existing asset and should be consolidated rather than duplicated by a new `/drug-offenses/` page.

Required before public upload:
- legal review of offense categories, thresholds and penalties.
- clear cannabis-fine limitation.
- no obstruction/concealment instructions.
- no future `/drug-offenses/` links yet.

## Required Pre-Upload Checklist

Before any public upload:
1. Owner approves page roles and current URL use.
2. Legal/source reviewer approves final Hebrew wording.
3. Final draft includes disclaimer and last-reviewed date.
4. No fake lawyer cards, fake ratings, fake reviews or fake badges appear.
5. CTAs route only to verified working lead/contact flows.
6. Internal links use current approved URLs only.
7. Related articles use semantic criminal-law relationships only.
8. Mobile layout is checked after content render.
9. Breadcrumbs and headings match page role.
10. Sitemap/canonical posture remains unchanged unless separately approved.
11. GSC annotation/monitoring plan is prepared for later publication.
12. Redirect map is not changed until future clean slugs are approved.

## Publishing Order

Recommended controlled order:
1. Draft and review `/criminal-defense-attorney/`.
2. Draft and review police investigation.
3. Draft and review detention support.
4. Draft and review indictment support.
5. Draft and review drug offenses.
6. QA links, mobile layout, breadcrumbs and related-card logic together.
7. Only then decide whether this group is ready for CMS upload.

## Anti-Cannibalization Rules

- Do not create a second broad criminal-lawyer page.
- Do not let `/criminal-lawyer/` appear in internal links until it is a real page.
- Do not convert support pages into competing service pillars.
- Do not use old GSC-visible Hebrew URLs as new link targets until redirect strategy is approved.
- Do not use "best/top/famous criminal lawyer" language unless separately reviewed and compliant.
- Do not merge foreign/international criminal-law pages into the Israeli criminal-law service cluster.

## Owner Approval Options

Option A - Approve planning package only:
- Safe next step.
- Allows Hebrew draft preparation under these constraints.
- Does not change the public site.

Option B - Approve one-page draft first:
- Start with `/criminal-defense-attorney/`.
- Slower but safest for legal/source review.

Option C - Hold criminal-law upload and repeat this process for traffic law:
- Useful if owner wants a second cluster prepared before drafting.

Recommended:
- Option A, then draft the current criminal pillar first.

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
