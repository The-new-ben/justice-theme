# Priority Pages CMS Repair Packet - 2026-05-22

Status: FIXED / VERIFIED LIVE READ-ONLY / BLOCKED PUBLIC EXECUTION

This packet converts the live read-only priority page findings into exact operator instructions. It does not approve public CMS edits, redirects, canonical changes, noindex changes, sitemap changes, taxonomy changes, or URL deletion.

## Source Findings

- VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` is live and maps to public `articles` CPT ID `19261`.
- VERIFIED LIVE READ-ONLY: `/plea-bargain/` is live and maps to public `articles` CPT ID `19279`.
- BLOCKED LIVE QA: both live article records have two rendered H1s: one template H1 and one duplicate body/content H1.
- BLOCKED LIVE QA: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` return HTTP `404`, have missing canonical, expose `noindex`, and have no public hit in `pages`, `posts`, or `articles`.
- VERIFIED LOCAL RISK: `reports/semrush/build-priority-pages.js` writes through `/wp-json/wp/v2/pages`, but the two live repaired objects are `articles`. Do not use that publisher to repair article CPT content.

## Safe Repair Order

1. Capture rollback material for every object before any wp-admin edit.
2. Repair only the duplicate body/content H1 on live `articles` ID `19261`.
3. Repair only the duplicate body/content H1 on live `articles` ID `19279`.
4. Rerun `node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22`.
5. Keep the four 404 clean slugs blocked until owner approval, source/legal review, and focused GSC evidence decide whether to update an existing asset, create a new object, or hold.

## Per URL Instructions

### `/criminal-lawyer-cost/`

- Current state: HTTP `200`; public `articles` CPT ID `19261`; duplicate H1.
- Operator action after rollback capture: edit article body only and remove or demote the first body/content H1. Keep the template title H1.
- Do not change: slug, permalink, status, canonical, robots, taxonomy, sitemap, schema, redirects, internal links, or SEO title unless separately approved.

### `/plea-bargain/`

- Current state: HTTP `200`; public `articles` CPT ID `19279`; duplicate H1.
- Operator action after rollback capture: edit article body only and remove or demote the first body/content H1. Keep the template title H1.
- Do not change: slug, permalink, status, canonical, robots, taxonomy, sitemap, schema, redirects, internal links, or SEO title unless separately approved.

### `/medical-malpractice-diagnosis-errors/`

- Current state: HTTP `404`; no public `pages`, `posts`, or `articles` hit.
- Related existing asset: article ID `8271`, slug `/medical-malpractice-8271/`, covers diagnosis-error intent and is already flagged for expansion/review.
- Operator action: do not create the clean slug blindly. First compare ID `8271` against the planned clean draft, run focused GSC if available, then decide whether to update ID `8271`, create a new support article, or later redirect.

### `/joint-custody/`

- Current state: HTTP `404`; no public `pages`, `posts`, or `articles` hit.
- Related protected asset: article ID `5405`, slug `/joint-custody-shared-parenting/`, marked `DO_NOT_TOUCH_HIGH_TRAFFIC_URL` with strong impression history in the repo baseline.
- Operator action: do not create `/joint-custody/` as a duplicate. Keep the current live asset reachable until focused GSC and owner approval decide whether to keep, expand, merge, or redirect.

### `/medication-errors-malpractice/`

- Current state: HTTP `404`; no public `pages`, `posts`, or `articles` hit.
- Related existing asset: no strong equivalent found in the current quick repo evidence.
- Operator action: likely a new support article candidate, but still blocked until source/legal review, article-vs-page content model decision, and rollback-ready CMS creation plan.

### `/divorce-pension-split/`

- Current state: HTTP `404`; no public `pages`, `posts`, or `articles` hit.
- Related existing assets: `/divorce-property-division/` page ID `19215`, `/divorce-rights-law-pension/` article ID `8252`, `/divorce-agreement-pension/` article ID `7048`, and `/unequal-pension-split-verdict-against-husband/` article ID `11205`.
- Operator action: do not create a duplicate pension page before comparing overlap with the existing property division and pension assets. Focused GSC and owner approval should decide whether this becomes a new support URL or a merge/update under an existing URL.

## Rollback Material Required

Before public repair, capture and store outside Git or in the approved operator location:

- WP object ID and content type.
- Current editor body/content export.
- Current title, slug, status, permalink, author, date, modified date, categories, tags, and custom taxonomy fields.
- Current SEO title, meta description, canonical, robots/noindex, schema, and social fields.
- Current featured image/media references.
- Current desktop and mobile screenshots if a browser-capable environment is available.
- Exact before URL result from the read-only checker.

## Must Not Be Skipped

- Rollback capture before edit.
- Correct content type targeting: `articles` for IDs `19261` and `19279`.
- Duplicate/cannibalization review before creating any of the four 404 clean slugs.
- Focused GSC review before retiring, redirecting, canonicalizing, or replacing protected current URLs.
- Post-repair read-only QA and screenshot QA where available.

## Can Wait

- Broad internal-link cleanup across the whole site.
- Full sitemap/taxonomy redesign.
- Redirect execution for old weak URLs.
- Canonical consolidation for overlapping Family Law and Medical Malpractice pages.
- Screenshot QA for the four 404 slugs until they actually resolve.

## Verification After Repair

Run:

```powershell
node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22
```

Expected first-stage result after only H1 repair:

- `/criminal-lawyer-cost/`: HTTP `200`, one H1, canonical self, index/follow, public `articles` ID `19261`.
- `/plea-bargain/`: HTTP `200`, one H1, canonical self, index/follow, public `articles` ID `19279`.
- Four 404 clean slugs: may remain BLOCKED until owner-approved object restoration or creation.

## Public Execution Status

BLOCKED. This packet is ready for owner/operator review, but no public CMS action is approved by this repo change.
