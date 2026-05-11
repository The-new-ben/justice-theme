# Family / Divorce Current-URL Upload Readiness

Date: 2026-05-11  
Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGES

This batch consolidates the existing family/divorce owner packets, publication-readiness tracker, GSC evidence notes, source-audit files and inventory scan into one upload-readiness queue. It does not approve public content edits, CMS writes, URL changes, redirects, canonical changes, noindex changes, sitemap changes, menu changes, related-card changes, lawyer-card changes, Maya Rotenberg profile edits, review/rating/schema work or database updates.

## Batch Scope

VERIFIED:
- `92` inventory rows were scanned using family/divorce/custody/support/mediation/agreement/property/dispute keyword signals.
- `58` current URL or URL-reference items were advanced into the family/divorce review queue.
- Existing control files already cover the main family/divorce layer:
  - `project-control/divorce-family-owner-approval-packet.md`
  - `project-control/child-support-owner-approval-packet.md`
  - `project-control/child-custody-owner-approval-packet.md`
  - `project-control/family-law-content-cluster-map.md`
  - `project-control/family-law-publication-readiness.csv`
  - `project-control/publication-review-family-law-cluster.md`
- The first seven clean English family-law pages already exist in the planning layer:
  - `/divorce-lawyer/`
  - `/consensual-divorce/`
  - `/divorce-mediation/`
  - `/child-support/`
  - `/child-custody/`
  - `/divorce-property-division/`
  - `/family-dispute-resolution/`

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page, lead and conversion data.
- Legal review of family/divorce/custody/support/property/mediation claims.
- Browser verification for every source URL in the source audits.
- Final live cleanliness of the seven public family-law pages after uPress pull/cache execution.
- Owner approval for merge, redirect, noindex, canonical, sitemap or document strategy.

## Main Decision

RECOMMENDED:
- Treat family/divorce as the most upload-ready content cluster, but only as a controlled no-URL-change repair/enrichment project until owner/legal review is complete.
- Keep `/divorce-lawyer/` as the current clean commercial divorce pillar candidate.
- Keep `/child-support/`, `/child-custody/`, `/divorce-mediation/`, `/consensual-divorce/`, `/divorce-property-division/` and `/family-dispute-resolution/` as support pages.
- Protect the old Hebrew divorce article, child-support calculator URL, custody article/PDF, mediation DOCX and high-position custody case-law URL.
- Separate broad family-lawyer intent from divorce-lawyer intent until `/family-law/`, `/family-lawyer/` and lawyer-directory filter roles are approved.

BLOCKED:
- Do not redirect old URLs yet.
- Do not remove or noindex PDF/DOCX assets yet.
- Do not create `/family-lawyer/` as a new public page yet.
- Do not publish final legal copy until source/legal review is complete.
- Do not show Maya Rotenberg reviews, ratings, badges or reputation claims unless verified in a later lawyer-profile/reputation batch.

## Content Architecture

### Pillar Candidate

`/divorce-lawyer/`
- Role: commercial/informational divorce-lawyer pillar.
- Current state: clean English URL exists; old GSC-visible Hebrew article still owns stronger query evidence.
- Upload posture: draft/repair/enrich only after comparison with old article and owner approval.
- Sitemap posture: include only after public body is clean, source-reviewed, internally linked and self-canonical.

### Support Pages

`/consensual-divorce/`
- Role: low-conflict divorce and agreement path.
- Merge risks: agreement overview, free template, rabbinical approval and mutual-divorce agreement pages.
- Sitemap posture: include after source/legal review and merge plan.

`/divorce-mediation/`
- Role: mediation suitability/comparison support.
- Merge risks: mediation DOCX, `/divorce-mediation-cons-pros/`, `/divorce-mediation-basics/`, `/family-mediation-updated-trends/`.
- Sitemap posture: include after DOCX strategy and mediation-page comparison.

`/child-support/`
- Role: child-support guide.
- Migration risk: old calculator URL currently owns visible child-support/calculation demand in checked GSC evidence.
- Sitemap posture: include after calculator/tool relationship is approved.

`/child-custody/`
- Role: custody/parenting-time guide.
- Migration risk: `what-is-child-custody/`, custody PDF and sole-mother case-law URL carry visible query evidence.
- Sitemap posture: include after document/case-law strategy is approved.

`/divorce-property-division/`
- Role: property/assets/debt division support.
- Merge risks: property division, pension, ketubah, apartment and resource-balancing case-law pages.
- Sitemap posture: include after source/legal and duplicate review.

`/family-dispute-resolution/`
- Role: pre-lawsuit family dispute process and urgent-relief triage.
- Merge risks: `request-for-family-dispute-settlements`, form 6 urgent relief and dispute-resolution performance pages.
- Sitemap posture: include after cannibalization review.

## Anti-Cannibalization Rules

VERIFIED / KEEP:
- `/divorce-lawyer/` owns divorce-lawyer hiring intent.
- `/consensual-divorce/` owns agreement/low-conflict divorce intent.
- `/divorce-mediation/` owns mediation suitability and process intent.
- `/child-support/` owns practical child-support guide intent, but calculator/tool intent remains protected separately.
- `/child-custody/` owns broad custody/parenting-time guide intent, but case-law pages remain support/reference pages.
- `/divorce-property-division/` owns property/assets/debt division guide intent.
- `/family-dispute-resolution/` owns opening process / dispute-resolution intent.

BLOCKED / DO NOT DO:
- Do not let broad "family lawyer" pages compete with `/divorce-lawyer/`.
- Do not let "recommended/top/best family lawyer" articles imply rankings, verification or recommendations without policy and real data.
- Do not let PDFs/DOCX files disappear from Google without an approved replacement, link and redirect/noindex strategy.
- Do not merge case-law pages into generic guides by deleting the source pages blindly.

## Internal-Link Requirements Before Upload

Each page in the first family/divorce cluster must have:
- one contextual link to the divorce pillar where relevant,
- one or more support links to sibling pages,
- a lawyer-directory entry point for family-law lawyers only if cards are real and safe,
- a source/legal reference area where appropriate,
- breadcrumbs that reflect the final hierarchy,
- related articles selected by semantic cluster, not random latest posts,
- mobile-safe layout with no internal editorial notes visible.

## Related Content Rules

Allowed related-content sources:
- same family/divorce cluster,
- direct support pages listed in the CSV,
- high-quality case-law pages only when they are clearly labelled as case/legal-source context,
- Maya Rotenberg mini-site only after profile facts are verified.

Blocked related-content sources:
- random international property pages,
- criminal/traffic/personal-injury pages,
- fake rankings or fake recommended-lawyer pages,
- internal/editorial notes,
- demo/fake lawyer cards,
- unverified review/rating blocks.

## Upload Readiness

READY FOR OWNER REVIEW:
- page roles,
- support hierarchy,
- protected high-risk URLs,
- merge candidates,
- future-only slugs,
- sitemap posture,
- internal-link requirements,
- related-content boundaries.

NOT READY FOR PUBLIC UPLOAD:
- legal accuracy,
- final source verification,
- old/new side-by-side merges,
- document strategy,
- redirect map,
- canonical plan,
- live page cleanup verification,
- Maya lawyer mini-site/reputation proof.

## Next Safe Step

RECOMMENDED:
1. Owner approves the no-URL-change family/divorce comparison batch.
2. Recheck the seven public family-law URLs after uPress pull/cache refresh.
3. Compare the old Hebrew divorce article against `/divorce-lawyer/`.
4. Compare child-support calculator against `/child-support/`.
5. Compare `what-is-child-custody/`, custody PDF and old custody case-law against `/child-custody/`.
6. Create a family/divorce redirect-and-document strategy only after those comparisons.
7. Prepare final upload order and internal-link execution list.

BLOCKED:
- No public content body, title, H1, meta, URL, slug, redirect, canonical, noindex, sitemap, taxonomy, category, menu, breadcrumb, related-card, lawyer-card, review/rating/schema, CRM, wp-admin setting or database row change was executed by this batch.
