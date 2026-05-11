# Criminal Law Owner Approval Packet

Date: 2026-05-11  
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the criminal-law GSC, SERP, inventory, slug-conflict and support-page evidence into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, taxonomy/menu changes or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Do not approve criminal-law URL migration yet.
- Approve a primary-selection and consolidation-planning batch first.

Why:
- The public map shows `criminal-lawyer` has `13` conflict rows and no exact current `/criminal-lawyer/` URL.
- GSC evidence shows old Hebrew criminal-lawyer URLs still receive visible impressions.
- The inventory also contains an existing clean page:
  - `https://jus-tice.co.il/criminal-defense-attorney/`
  - title: `עורך דין פלילי | עו"ד פלילי | משרדי עורכי דין פליליים`
  - word count: `9,086`
- Therefore, the core decision is not simply "create `/criminal-lawyer/`"; it is whether the primary should be:
  - the existing clean `/criminal-defense-attorney/`,
  - the old Hebrew URL with GSC signal,
  - or a controlled future `/criminal-lawyer/` migration.

## Current Evidence

VERIFIED:
- `project-control/content-master-inventory.csv`.
- `project-control/url-migration-map.csv`.
- `project-control/slug-conflict-review.csv`.
- `project-control/content-decision-evidence-overlay.csv`.
- `project-control/criminal-law-support-decision-packet.md`.
- `project-control/criminal-law-support-review.csv`.
- `project-control/serp-criminal-traffic-review-2026-05-11.md`.
- `project-control/serp-criminal-traffic-review-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page or lead data.
- Authenticated menu export.
- Full content-quality review of old criminal pages.
- Legal/source review of public criminal-law claims.
- Owner approval for choosing a primary URL.

## Primary URL Decision

### Option A: Keep `/criminal-defense-attorney/` As Primary For Now

Current URL:
- `https://jus-tice.co.il/criminal-defense-attorney/`

Inventory facts:
- Published.
- Word count: `9,086`.
- Hebrew title already targets `עורך דין פלילי`.

Possible benefit:
- No immediate URL migration.
- Existing clean English URL.
- Likely easier first content/design/internal-link improvement path.

Risk:
- Slug is longer and less aligned with the planned short slug strategy than `/criminal-lawyer/`.
- GSC evidence still needs page-to-query confirmation for this page.

Approval status:
- OWNER DECISION REQUIRED.

### Option B: Migrate Toward `/criminal-lawyer/`

Future target:
- `https://jus-tice.co.il/criminal-lawyer/`

Possible benefit:
- Shorter, cleaner, easier-to-understand URL.
- Better fit with the global pillar naming pattern.

Risk:
- No exact current `/criminal-lawyer/` URL was found in the public map.
- `13` conflict rows currently point toward the same target slug.
- Old Hebrew URLs with impressions require a full 301/internal-link/canonical/sitemap map.

Approval status:
- NOT APPROVED / MIGRATION BLOCKED.

### Option C: Keep Old Hebrew URL As Temporary Traffic Holder

Known old URL:
- `https://jus-tice.co.il/משרד-עורכי-דין-פלילי-הכי-טוב-תל-אביב/`

Evidence:
- Existing GSC maps show visible impressions for broad criminal-lawyer intent.

Possible benefit:
- Avoids disrupting current search signals.

Risk:
- Hebrew slug is not aligned with the clean English slug strategy.
- It may be too city/superlative-oriented for a national criminal-law pillar.

Approval status:
- PROTECT FOR NOW / DO NOT TOUCH.

## Support Page Decisions

### Police Investigation

Existing page:
- `https://jus-tice.co.il/הכנה-לחקירה-במשטרה/`

Candidate target:
- `https://jus-tice.co.il/police-investigation/`

Facts:
- Published old Hebrew page.
- Word count: `510`.
- GSC checked filter returned no visible rows.
- SERP supports practical rights/procedure intent.

Recommended action:
- Review and expand existing content first.
- Do not create a duplicate `/police-investigation/` page before URL decision.

### Indictment

Existing candidates:
- `https://jus-tice.co.il/articles/מחיקת-כתב-אישום-חזרה-מכתב-אישום-ביטול/`
- `https://jus-tice.co.il/נוסח-כתב-האישום-נגד-בנימין-נתניהו-תיקים-1000-2000-4000/`

Candidate target:
- `https://jus-tice.co.il/indictment/`

Facts:
- GSC for `כתב אישום` has only `4` impressions.
- Most visible impressions are on a specific Netanyahu indictment page.
- That page should not become the general public article.

Recommended action:
- Build a general indictment support decision only after comparing the existing cancellation/general pages.
- Do not redirect or repurpose the Netanyahu case page.

### Pretrial Detention / Arrest

Existing candidates:
- `https://jus-tice.co.il/detention-days/`
- `https://jus-tice.co.il/detention-before-charge-or-trial/`
- `https://jus-tice.co.il/הליך-המעצר-כמה-עולה-עורך-דין-מעצרים-מחירון-עוד-פלילי/`
- several old case-law/arrest pages.

Candidate target:
- `https://jus-tice.co.il/pretrial-detention/`

Facts:
- `pretrial-detention` has `8` conflict rows and no exact clean current slug.
- The checked GSC filter for `מעצר ימים` returned no visible rows.

Recommended action:
- Select one support primary only after content-quality and source/legal review.
- Keep short old pages as merge/support candidates, not automatic redirects.

### Drug Offenses

Existing pages:
- `https://jus-tice.co.il/drug-offenses-criminal-lawyer/`
- `https://jus-tice.co.il/drug-related-crime/`
- `https://jus-tice.co.il/drug-trafficking/`
- `https://jus-tice.co.il/drug-possession/`

Candidate target:
- `https://jus-tice.co.il/drug-offenses/`

Facts:
- `drug-offenses-criminal-lawyer/` is a very large existing asset (`51,621` words in the public inventory).
- Broad GSC sample for `עבירות סמים` is low, only `2` impressions split across old/case-law URLs.
- Lawyer-intent drug-offense query returned no visible rows.

Recommended action:
- Do not create `/drug-offenses/` now.
- Review whether the existing large page should stay at its current slug, be trimmed/structured, or later migrate with redirects.

## Proposed Internal-Link Direction

After owner approval and primary URL selection:
- The chosen criminal pillar should link to:
  - police investigation,
  - indictment,
  - pretrial detention,
  - drug offenses,
  - sex offenses,
  - white-collar/tax offenses,
  - criminal record/deletion topics where relevant.
- Support pages should link back naturally to the chosen primary.
- Existing old case-law pages should link to the public guide only when editorially relevant.
- Do not over-optimize anchors.
- Use natural Hebrew anchors.

## Source / Legal Review Checklist

Before editing public content:
- Verify current official/public legal sources for suspect rights, police questioning, indictment process, detention, drug offenses and criminal records.
- Avoid promising legal outcomes.
- Avoid "best", "top", "recommended" claims unless there is a documented, compliant rule.
- Add clear legal-information disclaimer.
- Separate Israeli criminal-law content from foreign/international criminal-law articles.
- Remove or keep separate old news/case pages that do not serve current Israeli search intent.

## Sitemap / Canonical / Redirect Position

For this proposed first criminal batch:
- Redirects: NOT APPROVED.
- Canonical changes: NOT APPROVED.
- Sitemap changes: NOT APPROVED.
- URL migration: NOT APPROVED.
- Internal-link plan: APPROVABLE after primary selection.
- Content brief: APPROVABLE after owner chooses primary direction.

## Approval Questions

Owner approval needed:
1. Should the first criminal-law primary review compare `/criminal-defense-attorney/` against the old Hebrew URL and future `/criminal-lawyer/`?
2. Should `/criminal-defense-attorney/` stay as the primary for now to avoid URL migration?
3. Should `/criminal-lawyer/` remain the long-term target, with migration later only after a full 301/internal-link/canonical/sitemap map?
4. Should the old Hebrew criminal-lawyer URL be protected until GSC/API and owner review are complete?
5. Should the first execution batch be content-quality review and internal-link planning only, with no public CMS edits?

## Blocked Actions

BLOCKED until explicit owner approval:
- Editing public page bodies.
- Changing titles/H1/meta.
- Creating `/criminal-lawyer/`.
- Renaming `/criminal-defense-attorney/`.
- Redirecting the old Hebrew URL.
- Redirecting support pages.
- Creating `/police-investigation/`, `/indictment/`, `/pretrial-detention/`, or `/drug-offenses/`.
- Adding canonical or sitemap changes.
- Deleting/noindexing old case-law pages.

## Recommended Next Step

1. Owner chooses the primary direction:
   - keep `/criminal-defense-attorney/` for now,
   - migrate later to `/criminal-lawyer/`,
   - or protect old Hebrew URL while deeper GSC/API review is performed.
2. After that, create a content-quality comparison sheet for the primary candidates.
3. Then create an internal-link plan and source/legal checklist.
4. Only then draft public CMS updates.
