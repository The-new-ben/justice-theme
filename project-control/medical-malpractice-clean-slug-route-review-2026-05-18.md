# Medical Malpractice Clean Slug Route Review - 2026-05-18

## Purpose

Review the blocked clean support slugs after the theme-owned medical-malpractice link fix:

- `/birth-malpractice/`
- `/pregnancy-malpractice/`
- `/diagnosis-malpractice/`

This is an evidence packet only. No public CMS content, URL slug, redirect, canonical, noindex, sitemap, taxonomy, lawyer profile, lead/payment setting, GSC setting, or database row was changed.

## Research basis

- Google redirect guidance: use a redirect when content has moved or when there is a meaningful new destination; choose the destination you want Google to show.
- Google HTTP/soft-404 guidance: if content looks like an error or empty page, Google may treat it as soft 404 even if the server returns 200.
- Google people-first/YMYL guidance: legal and medical topics require high trust; route recovery should not create thin or unsupported pages.

Sources:

- https://developers.google.com/search/docs/crawling-indexing/301-redirects
- https://developers.google.com/search/docs/advanced/crawling/http-network-errors
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## Evidence summary

Repo evidence:

- `project-control/medical-malpractice-owner-approval-packet.csv` already says the old Hebrew birth-malpractice page has visible GSC demand: 661 impressions for birth-malpractice intent and 419 impressions for pregnancy-malpractice intent.
- `project-control/medical-malpractice-current-url-upload-readiness-2026-05-11.csv` marks the future clean slugs as future-only until split approval.
- `project-control/url-migration-map.csv` shows multiple rows proposed toward `/medical-malpractice-lawyer/`, with many `TARGET_SLUG_CONFLICT_NEEDS_REVIEW` rows.

Live evidence checked with Googlebot-style requests:

| Intent | Candidate URL | Live status | Interpretation |
| --- | --- | ---: | --- |
| Clean birth slug | `/birth-malpractice/` | 404 | Do not link; not safe to recover blindly. |
| Clean pregnancy slug | `/pregnancy-malpractice/` | 404 | Do not link; no approved split page exists. |
| Clean diagnosis slug | `/diagnosis-malpractice/` | 404 | Do not link; there is a live specific diagnosis article at `/medical-malpractice-8271/`. |
| Birth representation | `/medical-malpractice-lawyer-birth-representation/` | 200 | Live specific birth-intent page. |
| Recommended birth lawyer | `/medical-malpractice-lawyer-birth-recommended/` | 200 | Live specific birth-intent page. |
| Birth injury parent | `/birth-injury/` | 200 | Live support page, already used by theme fix. |
| Birth injury lawyer | `/birth-injury-lawyer/` | 200 | Live support/commercial boundary page. |
| Birth injury causes | `/birth-injury-causes/` | 200 | Live support page; source/legal review needed before stronger promotion. |
| Brain damage at birth | `/brain-damage-at-birth/` | 200 | Live sensitive support page; source/legal review needed. |
| Diagnosis article | `/medical-malpractice-8271/` | 200 | Live diagnosis-specific page. |
| Old pregnancy/birth Hebrew row 8400 | old encoded URL | 404 | Its proposed broad target was `/medical-malpractice-lawyer/`, but this needs equivalence review. |
| Birth verdict row 7964 | old article URL | 200 to `/personal-injury-verdict-judge-lawsuit-damages-claim/` | Existing live destination is a verdict/personal-injury page, not the clean birth slug. |

## Decision

Do not create route-level 200 pages for `/birth-malpractice/`, `/pregnancy-malpractice/`, or `/diagnosis-malpractice/` yet.

Do not broadly redirect all three to `/medical-malpractice-lawyer/`.

Reason: these are YMYL medical/legal topics, and the repo already shows overlapping live pages, GSC demand on old Hebrew birth/pregnancy content, and duplicate/ambiguous proposed targets. A broad route recovery would risk cannibalization, soft-404 style mismatch, and loss of existing GSC signals.

## Recommended next actions

1. For birth malpractice:
   - Compare `/medical-malpractice-lawyer-birth-representation/`, `/medical-malpractice-lawyer-birth-recommended/`, `/birth-injury/`, `/birth-injury-lawyer/`, and the old Hebrew GSC-visible birth/pregnancy page.
   - Choose one primary birth-malpractice page before any redirect or clean slug recovery.

2. For pregnancy malpractice:
   - Do not publish a separate clean page until pregnancy intent is separated from birth intent.
   - If pregnancy stays together with birth, redirect should go to the chosen birth/pregnancy parent, not the generic medical-malpractice hub.

3. For diagnosis malpractice:
   - Compare `/medical-malpractice-8271/`, `/medical-malpractice-common-errors-doctors-hospitals/`, and `/what-is-medical-malpractice-definition-examples/`.
   - If `/medical-malpractice-8271/` is the best equivalent, consider a precise redirect from `/diagnosis-malpractice/` to that page after owner/legal approval.

4. Before any public action:
   - Pull GSC page-level clicks/impressions for each candidate.
   - Check whether the candidate pages have author/reviewer/source signals.
   - Check canonicals and noindex state live.
   - Decide: keep 404, precise 301, content refresh, merge, or controlled route.

## Safety statement

The only safe public action already completed was removing links to the 404 clean slugs. The clean slugs themselves remain blocked for route-history, GSC, source/legal, and owner approval review.
