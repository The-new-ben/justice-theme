# No-URL-Change Remediation Batch 001
Date: 2026-05-10
Status: VERIFIED IN REPO / NO LIVE CHANGES EXECUTED

## Purpose

This batch turns the first GSC indexing classifications into controlled work that can improve the site without changing public URLs, redirects, canonicals, sitemap settings, or published article bodies.

The rule for this batch is simple:

- classify first,
- compare existing content,
- protect URLs with GSC signals,
- prepare merge/expansion decisions,
- do not delete, redirect, noindex, or migrate yet.

## Included Workstreams

1. Media and document URL policy.
2. Legacy CPT migration review.
3. Divorce mediation duplicate/merge review.
4. Thin real-content review.
5. High-risk old URL protection.
6. Sitemap/HTTPS blocker follow-up.

Detailed rows are in `project-control/no-url-change-remediation-batch-001.csv`.

## Key Findings

- VERIFIED: GSC indexing examples include media/PDF/DOCX URLs. These should not be deleted blindly because some media URLs already have clicks/impressions.
- VERIFIED: legacy CPT-style URLs still appear in coverage examples, including `/labor_law/...`.
- VERIFIED: `/divorce-mediation-basics/` already exists with 1,045 words and overlaps the newer `/divorce-mediation/` page.
- VERIFIED: the older family mediation page `/family-mediation-updated-trends/` is much deeper at 20,334 words and may contain useful material for a future consolidated mediation guide.
- VERIFIED: several older mediation pages are thin and should be merge candidates rather than separate SEO targets.
- LIVE VERIFIED BLOCKER: active sitemaps still expose many `http://` URLs, so URL migration remains blocked.

## Approved Actions For This Batch

- Create review notes.
- Update internal project-control maps.
- Identify primary/supporting/merge candidates.
- Prepare internal link recommendations.
- Prepare owner-review questions.

## Not Approved In This Batch

- No deletes.
- No redirects.
- No noindex rules.
- No slug changes.
- No canonical changes.
- No sitemap setting changes.
- No public content overwrite.
- No CMS import or publication.

## Next Safe Task

Prepare the first no-URL-change homepage/directory SEO batch:

- title/H1/meta recommendations,
- stronger internal links to approved pillar candidates,
- related-content rules,
- no slug or redirect changes.
