# Priority Pages CMS Rollback Capture Template - 2026-05-22

Status: VERIFIED PLANNING / BLOCKED PUBLIC EXECUTION / NO PUBLIC CHANGES

Purpose: give the owner/operator an exact rollback-capture worksheet before any approved priority-page CMS repair. This template supports the current priority page repair packet only. It does not authorize editor saves, REST writes, redirects, canonical changes, noindex changes, slug changes, sitemap changes, taxonomy changes, media uploads, lawyer-card changes, lead/CRM changes, GSC/GA4 changes, wp-admin setting changes, database writes or uPress deployment.

## When To Use This

Use this after the owner approves a specific public action and before opening any WordPress editor in write mode. If the owner decision is still `HOLD_PUBLIC_REPAIR`, this worksheet remains planning-only.

Immediate repair candidates:

- `/criminal-lawyer-cost/` - public `articles` CPT ID `19261`; duplicate body/content H1.
- `/plea-bargain/` - public `articles` CPT ID `19279`; duplicate body/content H1.

Blocked decision candidates:

- `/medical-malpractice-diagnosis-errors/` - compare against existing article ID `8271` at `/medical-malpractice-8271/`.
- `/joint-custody/` - protect existing article ID `5405` at `/joint-custody-shared-parenting/`.
- `/medication-errors-malpractice/` - likely new support article candidate, but source/legal review is still required.
- `/divorce-pension-split/` - compare against page ID `19215` and pension-related article IDs `8252`, `7048`, and `11205`.

## Required Capture Fields For Existing Objects

Capture these fields before any edit or save:

- WordPress object ID.
- Object type: `articles`, `pages`, `posts`, or other exact CPT.
- Current title.
- Current slug and full permalink.
- Current status.
- Current editor body/content in full.
- Current body first heading and any body H1 location.
- Public rendered URL and preview URL if available.
- SEO title.
- Meta description.
- Canonical URL.
- Robots/indexing setting.
- Category, tag and custom taxonomy terms.
- Featured image ID and URL.
- Schema, FAQ, related-content and manual-link fields if present.
- Revision ID and revision timestamp.
- Public checker row or public HTTP/canonical/robots evidence.
- Desktop screenshot path before repair, if available.
- Mobile screenshot path before repair, if available.
- Owner decision value and timestamp.
- Operator name and capture date/time.
- Rollback storage location.

Do not commit secrets, database dumps, admin cookies, app passwords, wp-config data, private client information or raw exports containing credentials. If a database export is needed, store it outside Git unless the owner explicitly approves a sanitized artifact.

## Page-Specific Capture Notes

### `/criminal-lawyer-cost/`

Required before repair:

- Confirm object type is `articles`, not `pages`.
- Confirm object ID is `19261`.
- Capture current rendered H1 count and duplicate body H1 evidence from the live checker.
- Capture editor body section that contains the duplicate body/content H1.

Allowed after approval and backup:

- Remove or demote only the body/content H1.

Still blocked:

- Slug, canonical, noindex, title/meta, taxonomy, sitemap, redirect, schema and internal-link changes.

### `/plea-bargain/`

Required before repair:

- Confirm object type is `articles`, not `pages`.
- Confirm object ID is `19279`.
- Capture current rendered H1 count and duplicate body H1 evidence from the live checker.
- Capture editor body section that contains the duplicate body/content H1.

Allowed after approval and backup:

- Remove or demote only the body/content H1.

Still blocked:

- Slug, canonical, noindex, title/meta, taxonomy, sitemap, redirect, schema and internal-link changes.

### `/medical-malpractice-diagnosis-errors/`

Required before any clean-slug creation:

- Capture article ID `8271` at `/medical-malpractice-8271/`.
- Compare current body, title, slug, SEO fields and intent against the planned diagnosis-error clean draft.
- Record focused GSC evidence if available.
- Record source/legal review decision.

Still blocked:

- Creating `/medical-malpractice-diagnosis-errors/`, redirecting ID `8271`, canonicalizing either URL, or retiring the old/current asset.

### `/joint-custody/`

Required before any clean-slug creation:

- Capture article ID `5405` at `/joint-custody-shared-parenting/`.
- Confirm the current protected URL remains HTTP `200`, indexable and reachable.
- Record focused GSC evidence and owner decision for keep/merge/redirect.

Still blocked:

- Creating `/joint-custody/` as a duplicate, redirecting `/joint-custody-shared-parenting/`, changing canonical/noindex, or retiring the protected asset.

### `/medication-errors-malpractice/`

Required before creation:

- Capture source/legal approval.
- Capture article-vs-page content model decision.
- Capture planned title, slug, parent/pillar links, taxonomy and SEO fields.
- Confirm no existing equivalent asset was found or record the discovered equivalent.

Still blocked:

- Creating a public object, adding sitemap entry, adding internal links or changing medical-malpractice taxonomy.

### `/divorce-pension-split/`

Required before any clean-slug creation:

- Capture page ID `19215` at `/divorce-property-division/`.
- Capture or review pension-related article IDs `8252`, `7048`, and `11205`.
- Compare overlap and decide whether the target should be a new support page, an update to an existing asset, or a later merge.
- Record focused GSC evidence if available.

Still blocked:

- Creating `/divorce-pension-split/` as a duplicate, redirecting existing pension/property URLs, changing canonical/noindex, or retiring old assets.

## After Approved Repair

Run:

```powershell
node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22
```

For first-stage H1 repair only, expected result:

- `/criminal-lawyer-cost/`: HTTP `200`, one H1, self canonical, index/follow, public `articles` ID `19261`.
- `/plea-bargain/`: HTTP `200`, one H1, self canonical, index/follow, public `articles` ID `19279`.
- Four clean slugs may remain blocked until separately approved.

## Public Execution Status

BLOCKED. This template is ready for owner/operator use, but no public CMS action is approved by this repo change.
