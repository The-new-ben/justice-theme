# Traffic Law Support Decision Packet

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / NO URL CHANGE

This packet turns the current traffic-law inventory and targeted GSC evidence into a controlled review plan. It does not approve publishing, slug changes, redirects, noindex, canonical changes, sitemap changes, menu changes or content replacement.

## Evidence Used

VERIFIED:
- `project-control/content-master-inventory.csv`.
- `project-control/url-migration-map.csv`.
- `project-control/slug-conflict-review.csv`.
- `project-control/gsc-keyword-page-map.csv`.
- `project-control/gsc-cannibalization-review.csv`.
- `project-control/gsc-content-priorities.csv`.
- `project-control/content-decision-evidence-overlay.csv`.
- `project-control/gsc-targeted-query-pass-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page or lead data.
- Authenticated menu/internal-link export.
- Legal/source review of old traffic articles.

## Main Finding

VERIFIED: `https://jus-tice.co.il/traffic-lawyer/` exists and is the clean pillar candidate, but the cluster is weak and uneven.

The GSC evidence is low-sample. The broad `עורך דין תעבורה` query mostly points to the homepage and one narrow traffic ruling. Drunk-driving queries point to a will-revocation page, which is a wrong-page match. Driver-license suspension variants checked in the latest pass have no visible rows.

## Proposed Structure For Review

Primary pillar candidate:
- `https://jus-tice.co.il/traffic-lawyer/`

Existing support pages to review:
- `https://jus-tice.co.il/driving-under-the-influence/`
- `https://jus-tice.co.il/yanshuf-breathalyzer-test/`
- `https://jus-tice.co.il/speeding/`

Possible future clean targets:
- `https://jus-tice.co.il/drunk-driving/`
- `https://jus-tice.co.il/license-suspension/`

Cross-cluster boundary:
- `https://jus-tice.co.il/car-accident-lawyer/` should be handled with personal injury and traffic-law intent separated.

## Decision Notes

VERIFIED:
- `traffic-lawyer` has an exact current URL, but the article is only 1399 words in the public inventory.
- The traffic pillar already links to drunk-driving, breathalyzer, speeding and medical road-safety pages.
- `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` map to a will-revocation page in GSC, which is a wrong-page match.
- Existing `https://jus-tice.co.il/driving-under-the-influence/` exists, but it is thin at 516 words.
- `פסילה מנהלית` and `שלילת רישיון נהיגה` returned no visible rows in the targeted pass.
- A broader `שלילת רישיון` signal previously pointed to a Ministry of Health professional-license PDF, not driver-license suspension.

IN PROGRESS:
- Decide whether to keep `/driving-under-the-influence/` or later migrate it to `/drunk-driving/`.
- Decide whether `/license-suspension/` is needed as a driver-license page or should wait for stronger SERP/GSC evidence.
- Separate car accident compensation pages from traffic defense pages.

BLOCKED:
- URL changes.
- 301 redirects.
- Deleting case-law traffic pages.
- Optimizing the will-revocation page for traffic-law queries.
- Canonical or sitemap changes.

## Recommended Next Action

1. Run SERP review for `עורך דין תעבורה`, `נהיגה בשכרות`, `עורך דין נהיגה בשכרות`, `פסילה מנהלית`, `שלילת רישיון נהיגה`, and `תאונת דרכים`.
2. Review the current `/traffic-lawyer/` content and decide if it becomes the pillar with expansion.
3. Review `/driving-under-the-influence/` before creating any `/drunk-driving/` duplicate.
4. Build a traffic internal-link batch only after primary/support decisions are approved.

## 2026-05-11 SERP Evidence Pass

VERIFIED:
- `עורך דין תעבורה` is a commercial/service SERP with traffic-lawyer profiles, license-risk messaging, consultation CTAs, and links into drunk driving, speeding, suspension and accident topics.
- `נהיגה בשכרות` has a clear dedicated-support pattern and should connect to `/traffic-lawyer/` plus breathalyzer content.
- `/traffic-lawyer/` already exists and should be expanded as the pillar candidate instead of creating a competing traffic-law pillar.
- `/driving-under-the-influence/` already exists, so `/drunk-driving/` is a migration/rename question, not a new article task.
- `פסילה מנהלית` and `שלילת רישיון נהיגה` need more review because the intent can split between driver-license, professional-license, administrative and court-suspension meanings.

DECISION IMPACT:
- Keep `/traffic-lawyer/` as the primary candidate.
- Review/expand `/driving-under-the-influence/` before any `/drunk-driving/` decision.
- Keep `/license-suspension/` as a candidate only after clearer source/GSC/content evidence.
- Do not optimize the will-revocation page for traffic-law queries; it remains a wrong-page signal to fix through controlled content and internal-link planning later.

See:
- `project-control/serp-criminal-traffic-review-2026-05-11.md`
- `project-control/serp-criminal-traffic-review-2026-05-11.csv`

## CSV Detail

See `project-control/traffic-law-support-review.csv`.
