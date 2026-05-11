# Content Decision Batches

Date: 2026-05-11
Status: IN PROGRESS / REVIEW ONLY

This file turns the refreshed public REST inventory into controlled decision batches.
It does not approve redirects, URL changes, noindex, deletions, public rewrites, canonical updates or sitemap changes.

## Generated Files

VERIFIED:
- `project-control/slug-conflict-review.csv`
- `project-control/editorial-slug-mapping-review.csv`
- `project-control/cluster-pillar-review.csv`
- `tools/content-audit/build-decision-review-batches.ps1`

## Batch 1 - Slug Conflicts

VERIFIED: `slug-conflict-review.csv` contains 15 target slug groups where multiple URLs currently point toward the same proposed clean slug.

Highest-risk groups:
- `child-support` - 30 competing rows; exact clean URL exists and needs GSC confirmation before merge/redirect decisions.
- `medical-malpractice-lawyer` - 27 competing rows; exact URL duplicate exists and needs careful review.
- `criminal-lawyer` - 13 competing rows; no exact clean `/criminal-lawyer/` public URL was found in the public URL map.
- `child-custody` - 12 competing rows; exact clean URL exists and needs GSC confirmation.
- `will` - 10 competing rows; needs editorial classification before choosing a pillar/support URL.
- `pretrial-detention` - 8 competing rows; no exact clean URL found.
- `divorce-lawyer` - 7 competing rows; exact clean URL exists and needs GSC confirmation before merges.

Decision rule:
- If an exact clean URL exists, review it as the likely primary URL.
- If no exact clean URL exists, select a primary URL only after GSC, SERP and owner review.
- Do not redirect old URLs until the redirect map is approved.

## Batch 2 - Editorial Slug Mapping Backlog

VERIFIED: `editorial-slug-mapping-review.csv` contains 481 rows that still need human slug/topic decisions.

Current review lanes:
- `classify_topic_first`: 266
- `manual_review`: 154
- `thin_content_review`: 35
- `legacy_outdated_review`: 26

Decision rule:
- Classify topic before proposing a slug.
- Check if the page is useful, outdated, thin, duplicate, international/non-local, or better merged into a pillar.
- Keep traffic risk as UNKNOWN until GSC evidence is attached.

## Batch 3 - Cluster Pillar Review

VERIFIED: `cluster-pillar-review.csv` contains 11 cluster rows.

Strategic clean pillar targets found in the public URL map:
- `family-law-divorce` -> `divorce-lawyer`
- `medical-malpractice` -> `medical-malpractice-lawyer`
- `traffic-law` -> `traffic-lawyer`

Strategic clean pillar targets not found by public URL:
- `criminal-law` -> expected `criminal-lawyer`
- `real-estate` -> expected `real-estate-lawyer`
- `personal-injury` -> expected `personal-injury-lawyer`
- `employment-law` -> expected `employment-lawyer`
- `inheritance-wills` -> expected `inheritance-lawyer`
- `cyber-privacy` -> expected `cyber-privacy-lawyer`

Review-only clusters:
- `outdated-corona-legacy`
- `needs-classification`

Decision rule:
- A long article is not automatically a pillar.
- A clean URL is not automatically approved.
- The real pillar must be chosen by search intent, GSC query/page data, SERP review, content quality, internal links and business priority.

## Approval Gates

BLOCKED until owner approval:
- URL changes
- 301 redirects
- content deletion
- noindex
- canonical changes
- sitemap inclusion/exclusion changes
- replacing strong old content with weaker new content

NOT VERIFIED:
- GSC traffic risk has not been merged into these files yet.
- Authenticated menu export is still blocked by WordPress REST 401.
- Private/draft content and full postmeta are not included in this public-only pass.

## Next Action

Use the three review CSVs to run the first GSC/SERP evidence pass on:
1. `criminal-lawyer`
2. `divorce-lawyer`
3. `child-support`
4. `medical-malpractice-lawyer`
5. `real-estate-lawyer`

Then update the URL migration map only as a proposed plan, not as live URL changes.

## 2026-05-11 Evidence Overlay

CREATED:
- `project-control/content-decision-evidence-overlay.csv`
- `project-control/gsc-serp-first-evidence-pass.md`

VERIFIED:
- Existing `GSC_BROWSER_VERIFIED` rows were mapped onto the first decision queue.
- High-risk evidence exists for `divorce-lawyer`, `medical-malpractice-lawyer`, `criminal-lawyer`, `real-estate-lawyer`, `divorce-mediation`, and will/inheritance variants.
- `child-support` has a verified inventory conflict but NOT VERIFIED traffic risk until a direct `מזונות ילדים` GSC pass is run.

BLOCKED:
- No URL migration, redirect, noindex, canonical, sitemap, content rewrite, or deletion may be executed from this overlay alone.
- Owner approval and direct GSC/SERP review remain required before changing live public URLs or page bodies.

## 2026-05-11 Child-Support Packet

CREATED:
- `project-control/child-support-content-decision-packet.md`
- `project-control/child-support-conflict-review.csv`

VERIFIED:
- `child-support` is the largest conflict group in the first queue.
- `/child-support/` is the clean public guide candidate.
- Old case-law, doctrine, calculator, rabbinical-court and changed-circumstances pages need support/merge review rather than automatic primary selection.

NOT VERIFIED:
- Direct GSC traffic for child-support query variants.

BLOCKED:
- No child-support URL, redirect, noindex, canonical, sitemap or content rewrite action before GSC, source/legal review and owner approval.

## 2026-05-11 Targeted GSC Query Queue

CREATED:
- `project-control/targeted-gsc-query-queue.csv`
- `project-control/targeted-gsc-query-queue.md`

VERIFIED:
- The next query sequence is now explicit instead of scattered through notes.
- The queue covers the unresolved child-support, child-custody, employment-law, inheritance/wills, work/car-accident, traffic/drunk-driving, and criminal-support gaps.
- Each row states the expected primary URL, supporting URLs, known current signal, GSC tabs to check, and decision rules for clean URL, old URL and multiple-URL outcomes.

NEXT:
- Run the first browser pass for the child-support and adjacent family-law queries.
- Then update `gsc-keyword-page-map.csv`, `gsc-cannibalization-review.csv`, `gsc-content-priorities.csv`, `content-decision-evidence-overlay.csv`, and the relevant topic packet.

BLOCKED:
- The queue is not approval for URL migration, redirects, noindex, canonical changes, sitemap changes, content rewrites, deletions, taxonomy/menu changes or CMS writes.

## 2026-05-11 Targeted GSC Browser Pass 001

CREATED:
- `project-control/gsc-targeted-query-pass-2026-05-11.csv`
- `project-control/gsc-targeted-query-pass-2026-05-11.md`

VERIFIED:
- `מזונות ילדים`, `חישוב מזונות`, and `מחשבון מזונות` are currently owned in GSC by the old URL `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`.
- `משמורת ילדים` is split between `https://jus-tice.co.il/what-is-child-custody/` and `https://jus-tice.co.il/wp-content/uploads/2021/07/ChildCustody.pdf`.
- `דיני עבודה` is split across an informational page, homepage, a weak service page, case/support pages and one lawyer-facing page.
- Exact `עורך דין ירושה` and `עורך דין צוואות וירושות` filters returned no visible rows.

REVIEW:
- Child support and custody clean URLs remain candidates, but they are not current GSC winners for the checked queries.
- Old URLs and document URLs now have verified migration risk and must be protected until owner-approved redirect/document strategy.

BLOCKED:
- No URL migration, redirect, noindex, canonical, sitemap, content rewrite, document removal, taxonomy/menu change or CMS write is approved from this pass.
