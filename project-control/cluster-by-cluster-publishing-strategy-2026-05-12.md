# Cluster-by-Cluster Publishing Strategy

Date: 2026-05-12
Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGES

This document records the strategy shift from slow sitewide auditing toward staged, cluster-by-cluster publishing. It does not approve public uploads, redirects, URL changes, canonicals, sitemap changes, CMS writes, taxonomy changes, lawyer cards, reviews, ratings, schema, CRM changes or wp-admin settings.

## Decision

VERIFIED:
- Continue content architecture work, but stop waiting for a full 1,200-article audit before any upload.
- Finish one legal field at a time as a complete SEO cluster.
- Publish only after the cluster has URL conflict prevention, anti-cannibalization, English slug mapping, category role, pillar/support hierarchy, internal links, redirect posture, sitemap posture and post-publish monitoring.

RECOMMENDED ORDER:
1. Family Law / Divorce.
2. Criminal Law.
3. Medical Malpractice.
4. Traffic Law.
5. Real Estate.
6. Personal Injury / Damages.
7. Employment Law.
8. Inheritance / Wills.
9. National Insurance.
10. Cyber / Privacy.

## Why This Is Safer Than One Huge Migration

VERIFIED:
- A staged cluster release limits ranking risk to one topic group at a time.
- It creates smaller approval checkpoints.
- It makes rollback easier if Google responds badly.
- It lets us protect high-impression legacy URLs and documents before touching them.
- It produces faster visible progress without publishing disconnected articles.

NOT SAFE:
- Publishing random articles one by one without pillar/support mapping.
- Redirecting old Hebrew URLs before old/new comparison.
- Removing or noindexing PDFs, DOCX files, calculators or case-law URLs that already have GSC visibility.
- Changing sitemap/canonicals without a cluster-level map.
- Publishing duplicate support pages with the same intent.
- Showing fake lawyers, fake ratings, fake badges or unverified trust claims.

## Minimum Gate Before Any Cluster Upload

MUST NOT SKIP:
1. Current inventory of relevant existing URLs and documents.
2. GSC query/page evidence or API export for the cluster.
3. Strong old URLs and document assets marked as protected.
4. Pillar page selected.
5. Support pages selected.
6. Duplicate and cannibalization risks mapped.
7. English slug strategy recorded.
8. Current URL versus future URL decision recorded.
9. Title/H1/meta uniqueness reviewed.
10. Internal-link map prepared.
11. Redirect/canonical/sitemap posture documented.
12. Broken-link and 404 checks planned.
13. Related-content boundaries defined.
14. Category/taxonomy role defined.
15. Disclaimers and no-fake-trust policy confirmed.
16. Post-publish GSC monitoring plan prepared.

CAN WAIT:
- Full audit of every old article before the first cluster upload.
- Full sentence-by-sentence legal review of every general informational article.
- Advanced review/rating schema.
- Full lawyer reputation system.
- City x practice-area matrix.
- Full homepage redesign.
- Full GA4 dashboard.
- AI summaries and automated content tools.

## Family / Divorce First Cluster

RECOMMENDED:
- Treat Family/Divorce as the first upload candidate because it already has the strongest control layer.
- Keep `/divorce-lawyer/` as the current commercial divorce pillar candidate.
- Keep support pages under the current clean URLs already mapped.
- Protect old Hebrew divorce URL, divorce PDF, mediation DOCX, child-support calculator, custody PDF/article and custody case-law URL.
- Do not create public broad `/family-lawyer/` or ranking/recommended-lawyer pages yet.

CURRENT READINESS:
- VERIFIED: `58` family/divorce URL or URL-reference items advanced into review roles.
- VERIFIED: `82` planned current-URL relationship/control rows mapped.
- VERIFIED: `13` owner-review decisions packaged.
- NOT VERIFIED: GSC API export.
- NOT VERIFIED: final side-by-side old/new content comparison.
- NOT VERIFIED: live post-upload QA, because no upload was executed.

## Estimated Time

WITHOUT GSC API:
- Family/Divorce to upload-ready planning: about 3-5 focused work cycles.
- Family/Divorce controlled draft/upload package after approval: about 2-4 additional cycles.
- Each later cluster: about 3-6 cycles depending on old URL/document risk.
- First 5 major clusters: roughly 20-35 cycles.

WITH GSC API:
- Family/Divorce to upload-ready planning: about 1-3 focused work cycles.
- Each later cluster: about 2-4 cycles.
- First 5 major clusters: roughly 12-22 cycles.

INTERPRETATION:
- Full sitewide cleanup remains a larger project.
- A first useful content-upload wave can happen much sooner if we work cluster-by-cluster and avoid broad URL migration until the maps are approved.

## Approval Rule

BLOCKED:
- No public cluster upload, content overwrite, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, lawyer-card, review/rating/schema, CRM, wp-admin setting or database action is approved by this strategy document.

NEXT:
- Finish the Family/Divorce minimum pre-upload checklist.
- Get GSC API access or export query/page data manually for the Family/Divorce pages.
- Compare protected old URLs/documents with the clean pillar/support pages before upload.
