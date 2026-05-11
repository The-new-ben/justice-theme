# Traffic Law Support Decision Packet

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / NO URL CHANGE

This packet turns the current traffic-law inventory and targeted GSC evidence into a controlled review plan. It does not approve publishing, slug changes, redirects, noindex, canonical changes, sitemap changes, menu changes or content replacement.

## 2026-05-11 Content Upload Readiness Batch

CREATED:
- `project-control/traffic-law-content-upload-readiness-2026-05-11.md`
- `project-control/traffic-law-content-upload-readiness-2026-05-11.csv`

VERIFIED:
- `38` traffic-adjacent URL candidates reviewed.
- `/traffic-lawyer/` remains the current no-URL-change pillar candidate.
- Core support lanes are drunk driving, refusal/testing, breathalyzer, speeding, Marvad, license suspension/points and traffic evidence.
- Personal-injury car-accident pages and false-positive license/trafficking pages are separated out before category or sitemap changes.

NEXT:
- Create no-URL-change content outlines for the pillar and top support groups.
- Keep future slugs and redirects blocked until owner/legal approval.

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

## 2026-05-11 Owner Approval Packet

CREATED:
- `project-control/traffic-law-owner-approval-packet.md`
- `project-control/traffic-law-owner-approval-packet.csv`

RECOMMENDED:
- First traffic batch should be no-URL-change expansion of existing `/traffic-lawyer/`.
- Existing `/driving-under-the-influence/` should be reviewed/expanded before any `/drunk-driving/` slug decision.
- `/license-suspension/` should stay on hold until stronger GSC/source evidence exists.

BLOCKED:
- No public content edits, slugs, redirects, canonicals, sitemap updates or CMS writes until owner approval.

## 2026-05-11 Traffic / Criminal Wrong-Page Decision Packet

CREATED:
- `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.md`
- `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.csv`

VERIFIED:
- The drunk-driving lawyer query still maps to the will-revocation page, so the will page remains protected from traffic-law optimization.
- `/driving-under-the-influence/` is the current support candidate to review before any `/drunk-driving/` migration.

BLOCKED:
- No public drunk-driving content expansion, internal-link batch, slug migration, redirect, canonical, sitemap or title/H1/meta change is approved by this packet.

## 2026-05-11 Traffic Drunk-Driving Source Audit

CREATED:
- `project-control/traffic-drunk-driving-source-audit-2026-05-11.md`
- `project-control/traffic-drunk-driving-source-audit-2026-05-11.csv`

VERIFIED:
- `/driving-under-the-influence/` is the current support page to review first, not a duplicate-new-page task.
- `/traffic-lawyer/` is the current no-URL-change pillar candidate and already links to drunk-driving support.
- The wrong-page will URL has no visible drunk-driving terms in fetched text and must remain protected.

REVIEW:
- Sitewide `SiteNavigationElement` schema includes traffic-law URLs on the will page and still uses `http://` in those entries; source/generator is not verified.

NEXT:
- Draft no-URL-change expansion outline for `/driving-under-the-influence/`.
- Open schema/navigation-source audit before any schema or plugin-setting change.

## 2026-05-11 Traffic No-URL Outline Queue

CREATED:
- `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.md`
- `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.csv`

VERIFIED:
- `5` outline targets prepared across `10` current URLs.
- `/traffic-lawyer/` remains the current no-URL-change planning pillar.
- First support groups are drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
- `/drunk-driving/`, `/breathalyzer-test/`, `/license-suspension/`, `/traffic-evidence/` and `/fatal-road-accident-offenses/` remain blocked future-only slugs.

NEXT:
- Create source/legal checklist for the same five targets.
- Create current-URL internal-link map before final Hebrew copy or CMS upload.

BLOCKED:
- No public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action is approved by this outline queue.

## 2026-05-11 Traffic Source/Legal Checklist

CREATED:
- `project-control/traffic-law-source-legal-checklist-2026-05-11.md`
- `project-control/traffic-law-source-legal-checklist-2026-05-11.csv`

VERIFIED:
- `5` traffic-law page/topic gates mapped for traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
- Source anchors include police intoxication/breathalyzer procedures, Ministry of Transport point and suspension workflows, driver inquiry paths and Marvad medical-fitness workflows.
- Allowed claims, blocked claims, privacy/medical-risk level, disclaimer requirement and approval status are mapped per target.

NEXT:
- Create current-URL internal-link map for the same five targets.
- Then package the traffic-law upload group for owner approval before any public copy.

BLOCKED:
- No public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action is approved by this source/legal checklist.

## 2026-05-11 Traffic No-URL Internal Link Map

CREATED:
- `project-control/traffic-law-no-url-internal-link-map-2026-05-11.md`
- `project-control/traffic-law-no-url-internal-link-map-2026-05-11.csv`

VERIFIED:
- `31` planned current-URL relationships mapped.
- The map connects traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
- Future clean slugs remain blocked.
- Personal-injury car-accident compensation and will/inheritance wrong-page signals are excluded from the first traffic-defense related-link set.

NEXT:
- Package the traffic-law upload group for owner approval or start a controlled first-draft package after owner/legal approval.

BLOCKED:
- No public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action is approved by this internal-link map.

## 2026-05-11 Traffic Owner Upload Review Package

CREATED:
- `project-control/traffic-law-owner-upload-review-package-2026-05-11.md`
- `project-control/traffic-law-owner-upload-review-package-2026-05-11.csv`

RECOMMENDED:
- Owner approves planning package only, then draft `/traffic-lawyer/` first under source/legal review.
- Keep `/drunk-driving/`, `/breathalyzer-test/`, `/license-suspension/`, `/traffic-evidence/` and `/fatal-road-accident-offenses/` blocked as future-only slugs.

BLOCKED:
- No public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database action is approved by this owner package.

## CSV Detail

See `project-control/traffic-law-support-review.csv`.
