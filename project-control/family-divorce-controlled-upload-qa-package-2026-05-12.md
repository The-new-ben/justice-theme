# Family / Divorce Controlled Upload QA Package

Date: 2026-05-12
Status: VERIFIED PLANNING / REVIEW ONLY / NO PUBLIC CHANGES

This package defines how to safely review, upload and verify the first Family/Divorce page if the owner approves the clean `/divorce-lawyer/` body. It does not approve publishing, redirects, noindex, canonical changes, sitemap changes, taxonomy changes or CMS/database edits.

## Scope

Wave 1A candidate:
- `/divorce-lawyer/`
- Clean body source: `content-drafts/divorce-lawyer-public-body-he.md`
- Current clean draft size: `2,374` words across `92` lines

Not included in this first QA package:
- Bulk upload of the six support pages.
- Redirecting or retiring old Hebrew duplicate URLs.
- Removing or changing PDF, DOCX, calculator, case-law or legacy support assets.
- Review/rating/schema/reputation features.
- Maya Rotenberg profile changes.

## Current Status

VERIFIED:
- The clean public body exists.
- The clean body has no internal planning notes, `TODO`/`TBD`, fake ratings, fake review claims, fake trust labels or guaranteed-result claims.
- The first upload package, related-content rules, protected-asset rules, taxonomy rules and disclaimer/CTA rules already exist.

BLOCKED:
- Owner/legal/source approval of the clean body.
- Any public upload, draft import or CMS change.
- Any redirect, noindex, canonical, deletion, old URL retirement or sitemap-removal decision until GSC API export and owner approval.

## Upload Principle

Use the smallest safe first move:
1. Approve the clean `/divorce-lawyer/` body.
2. Update only the existing `/divorce-lawyer/` page body/title/meta/taxonomy if approved.
3. Keep all old duplicate URLs and protected assets live.
4. Verify the public page immediately after upload.
5. Monitor Search Console after publication.

Do not publish the whole Family/Divorce cluster as a dump.

## Pre-Upload Checks

MUST PASS:
- Owner approves the clean Hebrew body.
- Source/legal review either approves the draft or accepts it as general informational content pending later full legal review.
- Save the current live `/divorce-lawyer/` body/title/meta before overwriting anything.
- Confirm the target URL remains `/divorce-lawyer/`; no slug change.
- Confirm title/H1/meta contain divorce-lawyer intent without top/recommended/trusted/rating language.
- Confirm visible disclaimer and safe CTA disclaimer are present.
- Confirm no Review, AggregateRating or fake trust schema is added.
- Confirm taxonomy is limited to approved first-wave practice areas: `family-law` and `divorce`.
- Confirm related cards are limited to the allowed Family/Divorce support paths or disabled until support pages are approved.

## Post-Upload Checks

MUST VERIFY:
- `/divorce-lawyer/` returns `200`.
- `/divorce-lawyer/` is self-canonical or uses the approved canonical.
- `/divorce-lawyer/` is indexable unless a separate noindex decision is approved.
- H1 is `עורך דין גירושין`.
- The first viewport clearly says the page is for people looking for divorce-lawyer help.
- No internal notes, draft notes, source notes, competitor notes or planning sections are visible.
- Disclaimer and CTA disclaimer are visible.
- Internal links use HTTPS and resolve to approved support URLs.
- Blocked related-card categories do not appear: ranking/trust pages, Maya/profile pages, city pages, LegalTech/tool promises, old document assets and duplicate old URLs.
- Protected old URLs, PDFs, DOCX, calculator URLs, case-law pages and support assets still resolve as before.
- No redirects, noindex, deletion, canonical or sitemap-removal changes were accidentally applied.
- Mobile and desktop page scans show readable headings, no overlapping CTA/card text and no broken layout.

## Rollback Rule

If upload QA finds a serious issue:
- Restore the previous `/divorce-lawyer/` body/title/meta from the saved backup.
- Do not change old URLs or protected assets while debugging.
- Log the issue in `project-control/visual-qa-report.md` and `project-control/current-status.md`.

## GSC Follow-Up

After GSC API access is connected:
- Export query/page data for `/divorce-lawyer/`.
- Export query/page data for the old Hebrew divorce URL.
- Export query/page data for protected Family/Divorce PDFs, DOCX files, calculator URLs and case-law URLs.
- Do not make redirect/noindex/canonical/sitemap-removal decisions until this export is reviewed.

## Decision

RECOMMENDED:
- Treat `/divorce-lawyer/` as the first controlled upload candidate after owner approval.
- Keep this first upload narrow.
- Use this QA package as the checklist before moving to the six support pages.

BLOCKED:
- No public upload or CMS edit has been made.
- No public URL, redirect, canonical, noindex, sitemap, taxonomy, related-card, lawyer-profile, review/rating, CRM, wp-admin setting or database action is approved by this package.
