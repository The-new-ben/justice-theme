# Traffic / Criminal Wrong-Page Decision Packet

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / NO PUBLIC EXECUTION
Project area: Content architecture / GSC / cannibalization / URL safety

This packet converts the latest targeted GSC evidence into owner-review decisions for the traffic-law and criminal-law support clusters. It does not approve publishing, rewriting, title/H1/meta changes, URL changes, redirects, noindex, canonical changes, sitemap changes, menu changes, related-card changes, lawyer-card changes, CRM/review work or CMS/database writes.

## Purpose

VERIFIED: GSC shows one clear wrong-page signal: `עורך דין נהיגה בשכרות` maps to `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`, which is an inheritance/will-revocation page.

The safest response is not to optimize the will page for traffic-law queries. The safest response is to protect the will page, strengthen or review the correct traffic-law support page, and keep criminal-law support topics in a controlled selection queue.

## Evidence Used

VERIFIED:
- `project-control/gsc-targeted-query-pass-3-2026-05-11.md`
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`
- `project-control/traffic-law-support-review.csv`
- `project-control/criminal-law-support-review.csv`
- `project-control/traffic-law-support-decision-packet.md`
- `project-control/criminal-law-support-decision-packet.md`
- `project-control/serp-criminal-traffic-review-2026-05-11.md`
- `project-control/serp-criminal-traffic-review-2026-05-11.csv`

NOT VERIFIED:
- GA4 landing-page and lead data for these pages.
- Full GSC API export for all criminal/traffic variants.
- Authenticated WordPress postmeta, menus and manual related-link fields.
- Legal/source review of the current drunk-driving, indictment, police-investigation, detention and drug-offense articles.
- Owner approval for any URL migration or public rewrite.

## Verified Signals

VERIFIED:
- `עורך דין נהיגה בשכרות` had 7 impressions and 0 clicks in the targeted GSC pass, all mapped to `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`.
- `כתב אישום` had 4 impressions and 0 clicks. The visible pages were a specific Netanyahu indictment page and the homepage, not a general indictment guide.
- `זכויות חשוד`, `מעצר ימים`, `סגירת תיק פלילי`, `עורך דין עבירות סמים`, `פסילה מנהלית`, and `שלילת רישיון נהיגה` returned no visible rows in the latest targeted filters.
- `https://jus-tice.co.il/traffic-lawyer/` exists and remains the current traffic-law pillar candidate for planning.
- `https://jus-tice.co.il/driving-under-the-influence/` exists and is the current drunk-driving support candidate, but it is thin in the inventory.
- `https://jus-tice.co.il/drug-offenses-criminal-lawyer/` exists and is a substantial criminal support asset, so a new `/drug-offenses/` URL would be a migration decision, not a new duplicate-page task.
- The old Hebrew criminal-lawyer page has visible GSC value and must not be changed without an approved migration map.

## Owner-Review Decisions

### 1. Will-revocation page

Decision: PROTECT / DO NOT OPTIMIZE FOR TRAFFIC LAW

VERIFIED: the will-revocation page is receiving a small wrong-page drunk-driving signal.

RECOMMENDED:
- Keep the page focused on inheritance and wills.
- Do not add drunk-driving keywords to its title, H1, meta description or body just because GSC shows the wrong query.
- Audit why the page matched the query before adding any disambiguation.
- Only consider a contextual internal link away from this page if a real page-source/content audit explains why Google confused the intent.

BLOCKED:
- No rewrite of this page for traffic law.
- No redirect.
- No canonical change.
- No noindex.
- No sitemap removal.

### 2. Drunk-driving support page

Decision: REVIEW / STRENGTHEN CORRECT PAGE BEFORE ANY SLUG MIGRATION

Current candidate:
- `https://jus-tice.co.il/driving-under-the-influence/`

Future candidate:
- `https://jus-tice.co.il/drunk-driving/`

RECOMMENDED:
- Review the existing page content before creating or linking to a new `/drunk-driving/` URL.
- If the current URL is kept, expand it as the support page and connect it to `/traffic-lawyer/`, breathalyzer, license suspension and traffic-lawyer lead paths.
- If the clean future slug is approved later, prepare a full migration plan: old URL -> 301 -> new URL -> sitemap -> internal links -> canonical consistency.

BLOCKED:
- No duplicate new drunk-driving article.
- No slug migration.
- No redirect.
- No title/H1/meta execution.

### 3. Traffic-law pillar

Decision: KEEP AS PLANNING PRIMARY / EXPAND ONLY AFTER REVIEW

Candidate:
- `https://jus-tice.co.il/traffic-lawyer/`

RECOMMENDED:
- Treat `/traffic-lawyer/` as the current no-URL-change pillar candidate.
- Review content depth, lawyer-card readiness, CTA quality, related articles and mobile layout together.
- Add support links only after the drunk-driving and license-suspension support roles are approved.

BLOCKED:
- No sitemap, menu, breadcrumb or related-card expansion until support roles are approved.

### 4. Criminal-law support pages

Decision: KEEP IN PRIMARY-SELECTION QUEUE / DO NOT MIGRATE YET

RECOMMENDED:
- Keep `/criminal-lawyer/` as the strategic target, but do not execute until the old Hebrew GSC-visible page, any existing clean candidate and support assets are compared.
- Treat indictment as a support topic, but do not use the Netanyahu indictment article as the general indictment pillar.
- Review existing drug-offense content before deciding whether `/drug-offenses/` should exist.
- Keep police investigation, detention, suspect rights and closing-case pages in the support backlog until source/legal and content-quality checks are complete.

BLOCKED:
- No criminal-law URL migration.
- No redirects.
- No case-law deletion.
- No canonical/noindex changes.
- No sitemap or menu changes.

## Next Controlled Batch

Recommended next action:
1. Run a source/content audit of `/driving-under-the-influence/`, `/traffic-lawyer/` and the will-revocation wrong-page URL to identify why the wrong GSC match happened.
2. Build a no-URL-change drunk-driving content expansion outline for owner/legal review.
3. Build a criminal-law support source/legal checklist for indictment, police investigation, detention and drug offenses.
4. Only after approval, create an internal-link map with `PLANNED_NEEDS_OWNER_APPROVAL` rows.

## GSC / Analytics Session Summary

Checked:
- Date range: last 3 months, from the existing targeted GSC pass.
- Queries: suspect rights, indictment, detention, criminal case closure, drug-offense lawyer, drunk-driving lawyer, administrative suspension and driver-license revocation variants.
- Pages: GSC Pages tab from targeted filters.
- Filters: query filters in Search Console.
- GSC sections: Performance > Search results.
- GA4 sections: NOT VERIFIED in this packet.

Found:
- Top opportunity: drunk-driving support intent is not owned by the correct page.
- Cannibalization risk: creating `/drunk-driving/`, `/drug-offenses/` or `/criminal-lawyer/` without migration review could duplicate existing assets.
- Weak primary pages: traffic pillar and criminal pillar still need source/content/template review.
- Low CTR pages: indictment and drunk-driving rows have 0 clicks, but samples are small.
- Position 5-20 pages: Netanyahu indictment page appears strongly for the exact indictment query, but it is not the general guide.
- Indexing problems: NOT VERIFIED in this packet.
- Performance problems: NOT VERIFIED in this packet.

Recommended:
- Pillar decisions: keep `/traffic-lawyer/` as planning primary; keep `/criminal-lawyer/` strategic but blocked.
- Merge decisions: none approved; drunk-driving and drug-offenses are migration-review questions.
- Title updates: blocked.
- Internal links: plan only after page roles are approved.
- Content expansions: drunk-driving and traffic-lawyer should be reviewed first.
- Sitemap actions: blocked.
- Redirect risks: high if future clean slugs are used before migration maps.

Not executed:
- URL changes.
- Redirects.
- Deletions.
- Content rewrites.
- Title/H1/meta changes.
- Internal-link, sitemap, canonical, menu, related-card or CMS writes.

Next action:
- Audit the current drunk-driving support page and the will-revocation wrong-page match before drafting any public content change.
