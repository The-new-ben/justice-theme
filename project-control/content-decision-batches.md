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

## 2026-05-11 Cyber-Privacy Owner Approval Packet

CREATED:
- `project-control/cyber-privacy-owner-approval-packet.md`
- `project-control/cyber-privacy-owner-approval-packet.csv`

VERIFIED:
- Strategic `/cyber-privacy-lawyer/` is not a verified current public URL; `cluster-pillar-review.csv` lists it as a strategic target only.
- The heuristic selected `/fbi-cyber-division/` as the cyber/privacy pillar by word count, so manual owner review is required.
- `/cyber-lawyer/` exists as the strongest current service candidate with `6,405` words, quality `8/10`, and internal links.
- `/fbi-cyber-division/` has `21,917` words and quality `6/10`, but its FBI/international-security intent should not become the local lawyer-service pillar by default.
- `/cyber-laws/` has `13,956` words and quality `8/10`.
- `/cybercrime-lawyer-roll/` has `4,455` words and quality `6/10`.
- `/what-is-cyberattack/` has `3,744` words and quality `6/10`.
- `/cyber-insurance/` has `2,832` words and quality `6/10`.
- `/cybersex-trafficking/` has `2,819` words and quality `8/10`, but needs criminal/cyber boundary review.
- The privacy overview article is thin at `763` words with quality `4/10`.
- `/police-records-data-deletion/` is thin/outdated at `530` words with quality `2/10` and needs boundary classification.

NOT VERIFIED:
- Direct GSC rows for cyber/privacy terms are missing from the checked keyword map and content priorities.

RECOMMENDED:
- Owner approval for a no-URL-change primary-selection, cyber support, privacy support, criminal/cyber boundary, direct GSC/SERP and source/legal review planning batch.
- Protect `/cyber-lawyer/` as current service candidate until a redirect/canonical/sitemap/internal-link map is approved.
- Separate cyber lawyer/service intent from FBI/international-security, cyber insurance, privacy/defamation/reputation, data deletion, lawyer-AI/legal-tech and criminal cybersex content.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards or CMS writes until explicit approval.

## 2026-05-11 Personal-Injury And Damages Owner Approval Packet

CREATED:
- `project-control/personal-injury-owner-approval-packet.md`
- `project-control/personal-injury-owner-approval-packet.csv`

VERIFIED:
- Strategic `/personal-injury-lawyer/` is not a verified current public URL; `cluster-pillar-review.csv` lists it as a strategic target only.
- The heuristic selected `/punitive-damage/` as the personal-injury pillar by word count, so manual owner review is required.
- `/tort-lawyer/` exists as a local damages/service candidate but is thin at `507` words with quality `4/10`.
- `/punitive-damage/` has `57,276` words and quality `6/10`, but it is a specialist punitive-damages topic, not an approved commercial pillar.
- `/personal-injury-law/` is US-focused, has `8,005` words and quality `6/10`, and should be separated from Israeli local service intent.
- `/car-accident-auto-injury-lawyer/` has `590` words, quality `2/10`, and carries the visible car-accident GSC signal.
- `car-accident-lawyer` has `4` conflict rows and `0` exact current clean URL rows.
- GSC browser evidence maps `תאונת דרכים` mainly to `/car-accident-auto-injury-lawyer/` with `79-84` impressions.
- GSC browser evidence maps `עורך דין נזיקין` only to a low-sample old category/verdict URL with `2` impressions.
- `תאונת עבודה` returned no visible rows in the checked GSC browser pass.

RECOMMENDED:
- Owner approval for a no-URL-change primary-selection, tort-law support, car-accident migration-risk, work-accident recheck and source/legal review planning batch.
- Protect `/car-accident-auto-injury-lawyer/` until a redirect/canonical/sitemap/internal-link map is approved.
- Separate Israeli personal-injury/damages intent from US personal-injury, medical malpractice, traffic/criminal accident, insurance and national-insurance/work-accident intent.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards or CMS writes until explicit approval.

## 2026-05-11 Inheritance-Wills Owner Approval Packet

CREATED:
- `project-control/inheritance-wills-owner-approval-packet.md`
- `project-control/inheritance-wills-owner-approval-packet.csv`

VERIFIED:
- `will` has `10` conflict rows and `0` exact current clean `/will/` URLs.
- Strategic `/inheritance-lawyer/` is not a verified current public URL; `cluster-pillar-review.csv` lists it as a strategic target only.
- The heuristic selected `/most-recommended-family-lawyer/` as the inheritance-wills pillar by word count, so manual owner review is required.
- `/inheritance/` is thin at `705` words with quality `4/10`.
- `/will-and-testament/` is thin/outdated at `682` words with quality `4/10`.
- `/will-probate-objection/` is thin/outdated at `618` words with quality `2/10`.
- `/what-is-a-probate-order/` is thin at `573` words with quality `4/10`.
- `/inheritance-order/` has `2,182` words, quality `5/10`, and needs rewrite review.
- `/revocation-of-a-will-and-reviving-previous-will/` has `11,861` words, quality `4/10`, and also has low-sample wrong-page traffic-law matches.
- GSC browser evidence maps `צוואה` to a case-law page with `126` impressions, an old Hebrew wills/inheritance URL with `43` impressions, a DOCX file with `6` impressions, and several support/case-law URLs.
- GSC browser evidence maps `התנגדות לצוואה` to a case-law page with `120` impressions.
- Exact `עורך דין ירושה` showed no visible rows in the checked GSC browser pass.

RECOMMENDED:
- Owner approval for a no-URL-change primary-selection, will-guide, will-contest, probate/inheritance-order, document/media and source/legal review planning batch.
- Protect old Hebrew, case-law and document/template URLs until a redirect/canonical/sitemap/internal-link map is approved.
- Separate local Israeli inheritance-lawyer service intent from will guide, will contest, inheritance/probate procedure and international inheritance/wills intent.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, document/media deletion/replacement/noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards or CMS writes until explicit approval.

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

## 2026-05-11 Targeted GSC Pass 2 Decision Notes

VERIFIED:
- The child-support long-tail variants checked in pass 2 showed zero visible rows; do not create thin articles for them yet.
- `משמורת בלעדית לאם` is a high-position old case-law support URL and should be protected during the child-custody merge/redirect review.
- `עבירות סמים` and `נהיגה בשכרות` remain support gaps for the criminal/traffic clusters, but current samples are too small for immediate migration decisions.

NEXT:
- Run a third targeted GSC pass for criminal/traffic variants: `זכויות חשוד`, `כתב אישום`, `מעצר ימים`, `סגירת תיק פלילי`, `עורך דין עבירות סמים`, `עורך דין נהיגה בשכרות`, `פסילה מנהלית`, and `שלילת רישיון נהיגה`.

## 2026-05-11 Targeted GSC Pass 3 Decision Notes

VERIFIED:
- Several criminal support terms returned no visible rows, so they should not be created as thin pages from GSC evidence alone.
- `כתב אישום` currently maps to a specific Netanyahu indictment URL and the homepage; neither should become the general indictment support page.
- `עורך דין נהיגה בשכרות` remains a wrong-page traffic-law signal on a will-revocation URL.

NEXT:
- Build review-only criminal and traffic support decision packets before any content or URL execution.
- Criminal packet should compare `/criminal-lawyer/`, `/indictment/`, `/police-investigation/`, `/drug-offenses/` and existing old criminal/case-law URLs.
- Traffic packet should compare `/traffic-lawyer/`, `/drunk-driving/`, `/license-suspension/` and existing traffic/case/PDF URLs.

## 2026-05-11 Criminal And Traffic Support Decision Packets

CREATED:
- `project-control/criminal-law-support-decision-packet.md`
- `project-control/criminal-law-support-review.csv`
- `project-control/traffic-law-support-decision-packet.md`
- `project-control/traffic-law-support-review.csv`

VERIFIED:
- Criminal-law planning now separates the strategic `/criminal-lawyer/` pillar from old Hebrew service pages, existing criminal support articles, case-law pages, and possible future support slugs.
- `criminal-lawyer` has 13 conflict rows and no exact current clean `/criminal-lawyer/` URL in the public map, so primary selection is not approved yet.
- `drug-offenses-criminal-lawyer/` already exists and is long; do not create `/drug-offenses/` as a duplicate without a keep-or-migrate decision.
- Traffic-law planning now separates the exact `/traffic-lawyer/` pillar from thin support pages, possible future `/drunk-driving/`, possible `/license-suspension/`, wrong-page will traffic matches, and car-accident cross-cluster intent.
- `driving-under-the-influence/` already exists; do not create `/drunk-driving/` until the existing page is reviewed.

BLOCKED:
- No URL changes, redirects, noindex, canonical changes, sitemap changes, content rewrites, deletions, taxonomy/menu edits or CMS writes are approved from these packets.

NEXT:
- Run SERP review and owner approval packets for criminal and traffic before execution batches.

## 2026-05-11 Criminal And Traffic SERP Evidence Pass

CREATED:
- `project-control/serp-criminal-traffic-review-2026-05-11.md`
- `project-control/serp-criminal-traffic-review-2026-05-11.csv`

VERIFIED:
- Criminal-law SERPs support `/criminal-lawyer/` as the strategic commercial pillar, but old Hebrew criminal-lawyer URLs and existing support pages must be compared before any migration or merge decision.
- `דין פלילי` is broad enough to cannibalize the commercial pillar if it is split into a separate page without a clear informational intent.
- `חקירה במשטרה`, `כתב אישום`, `מעצר ימים`, and `עבירות סמים` are support intents, not random article ideas; each needs old-content comparison and source/legal review.
- Traffic-law SERPs support expanding the existing `/traffic-lawyer/` page as the pillar.
- `נהיגה בשכרות` supports a dedicated support path, but existing `/driving-under-the-influence/` must be reviewed before any `/drunk-driving/` URL decision.

BLOCKED:
- No URL changes, redirects, noindex, canonical changes, sitemap changes, content rewrites, deletions, taxonomy/menu edits or CMS writes are approved from this SERP pass.

NEXT:
- Prepare the first owner-approval packet for either criminal pillar cleanup or traffic pillar expansion.

## 2026-05-11 Traffic-Law Owner Approval Packet

CREATED:
- `project-control/traffic-law-owner-approval-packet.md`
- `project-control/traffic-law-owner-approval-packet.csv`

VERIFIED:
- `/traffic-lawyer/` already exists and is the safest first traffic pillar candidate because the proposed first batch can avoid URL migration.
- The current pillar is thin (`1,399` words in the public inventory).
- Existing support pages are also thin: `/driving-under-the-influence/`, `/yanshuf-breathalyzer-test/`, `/speeding/`, and `/driving-under-the-influence-of-drugs/`.
- GSC wrong-page evidence for drunk-driving lawyer intent should be handled through traffic content/internal-link planning, not by editing the will-revocation page.

RECOMMENDED:
- Owner approval for a no-URL-change traffic pillar expansion batch.
- Hold `/drunk-driving/` and `/license-suspension/` as future migration/candidate URLs only.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits or CMS writes until explicit approval.

## 2026-05-11 Criminal-Law Owner Approval Packet

CREATED:
- `project-control/criminal-law-owner-approval-packet.md`
- `project-control/criminal-law-owner-approval-packet.csv`

VERIFIED:
- The criminal-law cluster is higher-risk than the traffic-law first batch because there is no exact current `/criminal-lawyer/` URL in the public map.
- Existing clean `/criminal-defense-attorney/` is published, has `9,086` words, and already targets `עורך דין פלילי` in the title.
- Old Hebrew criminal-lawyer URLs still have visible GSC signal and must be protected until a migration map is approved.
- Support targets (`police-investigation`, `indictment`, `pretrial-detention`, `drug-offenses`) all have existing old/current assets that must be compared before any new slug is created.

RECOMMENDED:
- Owner approval for a primary-selection/consolidation planning batch, not URL migration.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits or CMS writes until explicit approval.

## 2026-05-11 Child-Support Owner Approval Packet

CREATED:
- `project-control/child-support-owner-approval-packet.md`
- `project-control/child-support-owner-approval-packet.csv`

VERIFIED:
- `child-support` remains the largest current target-slug conflict group with `30` conflict rows.
- `/child-support/` is the likely guide candidate, exists as a clean URL, has `2,767` words and has a quality heuristic of `8/10`.
- GSC browser evidence maps visible child-support/calculation demand to the old calculator URL, not to `/child-support/`.
- `מזונות ילדים` has `160` impressions, `חישוב מזונות` has `131` impressions, and `מחשבון מזונות` has `70` impressions on `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`.
- `בע"מ 919/15`, calculation, change/reduction/shared-support and rabbinical-jurisdiction claims require source/legal review before public edits.

RECOMMENDED:
- Owner approval for a no-URL-change comparison and source/legal planning batch.
- Protect the old calculator URL until a support/tool strategy, redirect map, canonical plan, sitemap plan and owner approval exist.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, calculator/tool claims, lawyer cards or CMS writes until explicit approval.

## 2026-05-11 Child-Custody Owner Approval Packet

CREATED:
- `project-control/child-custody-owner-approval-packet.md`
- `project-control/child-custody-owner-approval-packet.csv`

VERIFIED:
- `child-custody` has `12` conflict rows and an exact clean `/child-custody/` candidate.
- `/child-custody/` is published, has `2,397` words and has a quality heuristic of `7/10`.
- GSC browser evidence maps broad `משמורת ילדים` demand to `what-is-child-custody/` and `ChildCustody.pdf`, not to `/child-custody/`.
- GSC browser evidence maps `משמורת בלעדית לאם` to an old Hebrew case-law URL with `107` impressions and average position `9.6`.
- The custody PDF is a document URL risk and must have a document strategy before any redirect, noindex, deletion or replacement.

RECOMMENDED:
- Owner approval for a no-URL-change comparison, source/legal review and document-strategy planning batch.
- Protect `what-is-child-custody/`, `ChildCustody.pdf`, and the old sole-mother case-law URL until migration and document maps are approved.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, robots/media/document changes, taxonomy/menu edits, lawyer cards or CMS writes until explicit approval.

## 2026-05-11 Employment-Law Owner Approval Packet

CREATED:
- `project-control/employment-law-owner-approval-packet.md`
- `project-control/employment-law-owner-approval-packet.csv`

VERIFIED:
- `/labor-lawyer/` is the current service-page candidate but is thin at `689` words and quality score `4/10`.
- Future `/employment-lawyer/` is cleaner strategically but is not an exact current public URL.
- GSC browser evidence maps `עורך דין דיני עבודה` mostly to the homepage.
- GSC browser evidence maps broad `דיני עבודה` mostly to `/israeli-labor-law/`.
- Lawyer-facing content such as `/legal-courses-for-lawyers/` should be separated from public legal-help intent.

RECOMMENDED:
- Owner approval for a no-URL-change primary-selection, SERP review, source/legal review and internal-link planning batch.
- Protect `/israeli-labor-law/` as informational support and do not treat homepage as the employment primary.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, homepage changes, noindex, canonical changes, sitemap changes, taxonomy/menu edits, lawyer cards or CMS writes until explicit approval.

## 2026-05-11 Divorce And Family-Law Owner Approval Packet

CREATED:
- `project-control/divorce-family-owner-approval-packet.md`
- `project-control/divorce-family-owner-approval-packet.csv`

VERIFIED:
- `/divorce-lawyer/` exists as a clean candidate with `3,205` words and quality score `8/10`.
- GSC browser evidence maps `עורך דין גירושין` mostly to the old Hebrew divorce-lawyer article with `960` impressions, not to `/divorce-lawyer/`.
- A divorce-related PDF has `45` impressions for `עורך דין גירושין`.
- `גישור גירושין` maps mostly to an uploaded DOCX with `86` impressions, not to `/divorce-mediation/`.
- Clean support pages already exist for consensual divorce, mediation, property division and family dispute resolution.
- Maya Rotenberg is related to the family/divorce path but her profile remains a separate mini-site/profile approval task.

RECOMMENDED:
- Owner approval for a no-URL-change side-by-side comparison, document strategy, source/legal review and internal-link planning batch.
- Protect old high-impression article and PDF/DOCX document URLs until redirect/document maps are approved.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, document/media deletion, robots/media noindex, homepage changes, canonical changes, sitemap changes, taxonomy/menu edits, Maya profile edits, lawyer cards or CMS writes until explicit approval.

## 2026-05-11 Medical-Malpractice Owner Approval Packet

CREATED:
- `project-control/medical-malpractice-owner-approval-packet.md`
- `project-control/medical-malpractice-owner-approval-packet.csv`

VERIFIED:
- `medical-malpractice-lawyer` has `27` conflict rows and `2` exact current records for the same public URL.
- `/medical-malpractice-lawyer/` has two public REST records: ID `11607` with `5,135` words and quality score `6/10`, and ID `1130` with `3,287` words and quality score `8/10`.
- GSC browser evidence maps visible `עורך דין רשלנות רפואית` demand to the fee article with `145` impressions, not to the clean pillar.
- GSC browser evidence maps `רשלנות רפואית בלידה` to the old Hebrew birth-malpractice page with `661` impressions.
- GSC browser evidence maps `רשלנות רפואית בהריון` to the same birth-malpractice page with `419` impressions, indicating overlap/cannibalization risk.
- The cluster includes thin/specialist support pages and some unrelated contamination that must be classified before internal-link generation or migration.

RECOMMENDED:
- Owner approval for no-URL-change duplicate identity review, side-by-side content comparison, source/legal review and internal-link planning.
- Protect the fee article and old Hebrew birth-malpractice URL until redirect/canonical/sitemap maps are approved.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, taxonomy/menu edits, lawyer cards, review/rating/schema or CMS writes until explicit approval.

## 2026-05-11 Real-Estate Owner Approval Packet

CREATED:
- `project-control/real-estate-owner-approval-packet.md`
- `project-control/real-estate-owner-approval-packet.csv`

VERIFIED:
- `/real-estate-attorney/` exists as current commercial candidate with `6,941` words and quality score `6/10`.
- Exact `/real-estate-lawyer/` was not found as a current public URL; it remains a future migration target only.
- GSC browser evidence maps `עורך דין מקרקעין` mainly to the homepage with `136` impressions.
- GSC content priorities map `עורך דין מכירת דירה` to `/real-estate-lawyer-cost-2025/` with `3.85K` impressions and very low CTR.
- `קניית דירה` and `חוזה מכר` also map to the cost page, showing support-page overload.
- Real-estate cluster evidence includes international property pages, and the heuristic selected a Greece article as pillar by word count.

RECOMMENDED:
- Owner approval for no-URL-change primary comparison, homepage routing review, support-page comparison, source/legal review and international-cluster cleanup.
- Protect homepage and `/real-estate-lawyer-cost-2025/` signals until the pillar, redirect/canonical/sitemap and internal-link plan is approved.

BLOCKED:
- No public content edits, title/H1/meta changes, URL changes, redirects, homepage changes, noindex, canonical changes, sitemap changes, taxonomy/menu edits, related-card edits, lawyer cards or CMS writes until explicit approval.
