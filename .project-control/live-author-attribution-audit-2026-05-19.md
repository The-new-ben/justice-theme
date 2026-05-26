# Live Author Attribution Audit - 2026-05-19

## Why This Audit Exists

The owner reported that a remote team put Ben Batash as writer/byline across criminal articles. For legal/YMYL pages, that is only safe when the person has a public, verifiable author/reviewer entity and practice-area authority.

This audit gives us live evidence before public CMS edits.

## Research Basis

Google Article structured data allows author to be a `Person` or `Organization`, and recommends author `url` or `sameAs` when identifying an author. For legal/YMYL content, the safer default is organization/editorial attribution until a person has a verified authority chain.

Sources:

- Google Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google people-first / E-E-A-T guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Quality Rater Guidelines: https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf

## What Was Built

Created `tools/check-live-author-attribution.mjs`.

The script:

- Reads `content-master/gsc/gsc-url-summary.csv`.
- Selects likely criminal-law/high-risk legal URLs.
- Fetches live pages as Googlebot.
- Detects visible Ben Batash attribution.
- Parses JSON-LD Article schema and detects Ben as schema author.
- Writes a CSV report.

Initial output:

- `reports/live-author-attribution-audit-2026-05-19.csv`

## Results

Checked: 80 live URLs.

Found:

- 45 URLs with visible Ben attribution.
- 45 URLs with Ben as Article schema author.
- 35 URLs with no Ben attribution detected.
- 0 fetch errors.

Important examples:

| URL | Impressions | Visible Ben | Schema Ben | Action |
|---|---:|---|---|---|
| `/criminal-defense-attorney` | 62,561 | YES | YES | Replace with organization author or verified reviewer |
| `/apply-for-police-criminal-information-certificates` | 38,667 | YES | YES | Replace with organization author or verified reviewer |
| `/police-records-data-deletion` | 34,081 | YES | YES | Replace with organization author or verified reviewer |
| `/sex-crime-lawyer` | 27,904 | YES | YES | Replace with organization author or verified reviewer |
| `/drug-related-crime` | 24,014 | YES | YES | Replace with organization author or verified reviewer |
| `/tax-investigation-guide` | 22,811 | YES | YES | Replace with organization author or verified reviewer |

Additional issue found:

- One high-impression criminal-law URL in the GSC mirror returned 404 during this audit. This needs separate URL recovery review, not an author-only fix.

## Recommendation

1. Merge PR #8 after review to stop the template-level unsafe author pattern.
2. Run this audit again after uPress deployment.
3. Any remaining `visible_ben_attribution=YES` after PR #8 is likely stored CMS content or another template/plugin source.
4. Do not assign Ben as a criminal-law author/reviewer until his verified entity page and external corroboration exist.
5. Use Jus-Tice organization/editorial attribution as the safe default.

## Safety

- Read-only live fetches only.
- No WordPress CMS/database writes.
- No public URLs, redirects, canonicals, noindex, taxonomy, sitemap, payment, user, lead, lawyer profile, Google Business Profile, social profile, GA4, GSC, or uPress setting changed.
