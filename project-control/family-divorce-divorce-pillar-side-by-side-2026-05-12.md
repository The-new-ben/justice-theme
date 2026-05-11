# Family / Divorce Pillar Side-by-Side Review

Date: 2026-05-12
Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGES

This compares the current clean divorce pillar candidate with the old Hebrew divorce URL that currently has GSC visibility. It does not approve publishing, rewriting, redirects, deletion, noindex, canonical changes, sitemap changes, internal-link execution, related-card changes, lawyer-card changes, schema, CRM changes or CMS writes.

## Pages Compared

### Clean Pillar Candidate

URL:
- `https://jus-tice.co.il/divorce-lawyer/`

VERIFIED LIVE:
- HTTP `200`.
- Self-canonical: `https://jus-tice.co.il/divorce-lawyer/`.
- H1: `עורך דין גירושין: מדריך עומק לבחירה נכונה, תהליך, עלויות, ילדים ורכוש`.
- Meta description exists and matches divorce-lawyer guide intent.
- Exported public word count: `3,205`.
- Repo draft exists at `content-drafts/divorce-lawyer-pillar-he.md`, about `5,083` words.
- Current role: commercial/informational pillar.

Strengths:
- Clean English URL.
- Correct primary intent.
- Better topical structure than old page.
- Covers process, costs, documents, children, custody, support, property, agreements and lawyer selection.
- Can support internal links to six Family/Divorce support pages.

Weaknesses / checks before upload:
- Title/H1 may be long for SERP display.
- Legal/source review still required.
- Needs side-by-side merge from old page and duplicate pages.
- Needs GSC API export before redirect/canonical decisions.
- Needs no-fake-trust check before any lawyer/profile CTA.

### Old Hebrew URL

URL:
- `https://jus-tice.co.il/עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/`

VERIFIED LIVE:
- HTTP `200`.
- Self-canonical to the same old Hebrew URL.
- H1: `עורך דין גירושין, דיני משפחה וצוואות | עורך דין גירושין המלצות`.
- Exported public word count: `697`.
- Exported title mixes divorce, family law, wills and recommendation language.
- GSC browser evidence: `960` impressions for `עורך דין גירושין`, `0` clicks, `0%` CTR, average position `64.5`.

Strengths:
- Currently visible to Google for the money query.
- Contains local/service intent around divorce lawyer selection.
- May have historical signals or internal links.

Weaknesses:
- Thin compared with the new pillar.
- Hebrew URL is long and ugly when shared.
- H1/title use recommendation language that creates trust/compliance risk.
- Topic is too broad: divorce, family law, wills, recommendations and Maya-style positioning in one page.
- Not enough to compete with top legal results.
- It should not block the new structure indefinitely.

## Decision

RECOMMENDED:
- Use `/divorce-lawyer/` as the future primary pillar.
- Keep the old Hebrew URL live for now because it has GSC visibility.
- Merge any genuinely useful old-page material into `/divorce-lawyer/`.
- After GSC API export and owner approval, decide whether the old URL should 301 to `/divorce-lawyer/` or remain as a narrow support page.

IMPORTANT:
- The old page is protected from careless deletion, not protected forever.
- If the new pillar becomes stronger and the old page has no distinct role, redirecting later is reasonable and probably desirable.
- Do not preserve weak recommendation/trust language just because the old page has impressions.

## Content Merge Notes

MERGE INTO `/divorce-lawyer/`:
- Any clear explanation of when a lawyer is needed.
- Any practical divorce-lawyer selection guidance.
- Any useful cost/process discussion after source review.
- Any Maya/profile reference only if converted into factual, verified, non-ranking language.

DO NOT MERGE:
- "recommended lawyer" claims without documented criteria.
- "top/trusted/best" style claims.
- broad wills/inheritance sections.
- unverified local/service superiority claims.
- outdated price claims without date/source.

## Upload Decision

FIRST PUBLIC CANDIDATE AFTER APPROVAL:
- `/divorce-lawyer/`.

UPLOAD TYPE:
- Repair/enrich existing clean page, not create a new page.

DO NOT DO YET:
- Do not redirect the old Hebrew URL.
- Do not noindex the old Hebrew URL.
- Do not canonicalize old URL to `/divorce-lawyer/`.
- Do not remove PDF/DOCX assets.
- Do not add fake ratings, reviews, recommended-lawyer badges or Maya ranking claims.

NEXT:
- Use GSC API tomorrow to confirm query/page distribution.
- Compare the old Hebrew page, `/divorce-lawyer/`, and duplicate target-slug pages as a single migration group.
- Prepare a redirect/canonical decision only after the stronger pillar content is approved.

## Safe Publishing Sequence

1. Finalize `/divorce-lawyer/` as the pillar.
2. Shorten title/meta if needed.
3. Merge useful old page content.
4. Add disclaimers and source/legal review markers.
5. Link to support pages only after support roles are approved.
6. Keep old Hebrew URL live during first upload.
7. Monitor GSC.
8. Decide redirect/canonical later.

## Blocked Actions

BLOCKED:
- Public content overwrite.
- Redirects.
- Noindex.
- Canonical changes.
- Sitemap changes.
- Deleting old URLs.
- Internal-link execution.
- Review/rating/trust badge language.
- Maya profile/ranking claims.
- CMS/database writes.
