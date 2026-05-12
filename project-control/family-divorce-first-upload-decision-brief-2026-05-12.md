# Family / Divorce First Upload Decision Brief

Date: 2026-05-12
Status: VERIFIED PLANNING / REVIEW ONLY / NO PUBLIC CHANGES

This is the short practical decision layer for the first Family/Divorce upload. It summarizes what is ready, what is blocked and what the safest next approval should be.

## Current Reality

VERIFIED:
- `/divorce-lawyer/` has a CMS-clean public body: `content-drafts/divorce-lawyer-public-body-he.md`.
- The six Wave 1B support bodies are CMS-clean and packaged for approval.
- The support bodies total `11,222` words across `435` lines.
- The controlled upload QA package for `/divorce-lawyer/` exists.
- Taxonomy, disclaimer/CTA, related-content and protected-asset rules exist.

BLOCKED:
- No public upload is approved.
- No CMS import is approved.
- No redirects, noindex, canonical, deletion, sitemap or URL migration action is approved.
- GSC API export is still not connected.
- Owner/legal/source approval is still needed.

## Honest Recommendation

RECOMMENDED:
Start with Wave 1A only: `/divorce-lawyer/`.

Why:
- It is the commercial anchor and highest-value Family/Divorce page.
- It can be improved without changing the URL.
- It lets us test one controlled upload path before touching six support pages.
- It protects old Hebrew URLs, PDFs, DOCX files, calculators and case-law assets.
- It avoids publishing a large batch before we know the CMS preview/live QA behavior.

Do not upload all seven pages as one dump.

## What Can Be Approved Now

Owner can approve:
1. `/divorce-lawyer/` clean body for first controlled upload.
2. The six support bodies as copy only, without public upload.
3. Lower-risk support pages for later upload after pillar QA: `/consensual-divorce/` and `/divorce-mediation/`.

Owner should hold or review more carefully:
- `/child-support/`
- `/child-custody/`
- `/divorce-property-division/`

Reason:
These pages involve children, money, property, business/pension claims or sensitive family facts, so they need stronger legal/source review or explicit owner acceptance as general informational content.

## Minimum Checks Before `/divorce-lawyer/` Upload

MUST PASS:
1. Owner approves the clean body or requests edits.
2. Current live body/title/meta are backed up before overwrite.
3. URL remains `/divorce-lawyer/`.
4. No old URLs are redirected, deleted, noindexed or canonicalized.
5. Title/H1/meta are unique and do not use fake trust language.
6. Visible no-legal-advice disclaimer remains in the page.
7. Related links/cards use approved Family/Divorce URLs only.
8. Taxonomy uses approved existing `practice-areas` terms only.
9. No Review, AggregateRating, fake rating, badge, top, recommended or trusted claim is added.
10. Post-upload QA checks status, canonical, indexability, mobile/desktop layout, related links, protected assets and obvious 404s.

## GSC API Position

GSC API is useful before upload and required before URL migration.

It is not required to approve clean public copy, but it is required before:
- redirecting old URLs,
- retiring old Hebrew URLs,
- changing canonical posture,
- changing noindex,
- removing assets from sitemap,
- deciding whether a legacy page is weak enough to merge/retire.

## Decision Needed From Owner

Choose one:
- APPROVE WAVE 1A ONLY: approve `/divorce-lawyer/` for controlled upload.
- APPROVE COPY ONLY: approve all clean support copy, but hold public upload.
- APPROVE LOWER-RISK SUPPORT LATER: approve `/consensual-divorce/` and `/divorce-mediation/` to follow after pillar QA.
- EDIT FIRST: request edits to specific pages before upload.
- WAIT FOR GSC API: hold all public upload until API export is available.

## Recommended Next Step

Best next step:
Approve or edit `content-drafts/divorce-lawyer-public-body-he.md`, then use `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.md` before any CMS action.

If approval is not ready:
Continue repo-only prep by creating the exact metadata/title/H1 package for `/divorce-lawyer/`, still with no CMS/public changes.

## Update - Metadata Package Created

VERIFIED:
- `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.md` now defines the exact recommended title, H1, meta description, OG fields, canonical, taxonomy and related-link boundaries for `/divorce-lawyer/`.
- `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.csv` records the same decision set in `20` rows.

NEXT:
- Owner approves or edits the clean body and metadata package together before any CMS/public change.
