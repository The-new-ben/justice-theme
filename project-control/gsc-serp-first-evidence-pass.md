# GSC / SERP First Evidence Overlay

Date: 2026-05-11
Status: IN PROGRESS / REVIEW ONLY

## Purpose

This pass connects the refreshed content inventory and slug conflict queues to the Search Console evidence already documented in the repo.

It does not approve URL changes, redirects, noindex decisions, canonical changes, sitemap changes, content replacement, or deletion.

## Created

- `project-control/content-decision-evidence-overlay.csv`

## VERIFIED

- The public inventory/audit files exist and were refreshed before this pass.
- `slug-conflict-review.csv` identifies high-risk conflict groups including `child-support`, `medical-malpractice-lawyer`, `criminal-lawyer`, `child-custody`, `divorce-lawyer`, `divorce-mediation`, and `traffic-lawyer`.
- `cluster-pillar-review.csv` separates strategic pillar targets from heuristic long-article picks.
- Existing `GSC_BROWSER_VERIFIED` rows show real query-to-page evidence for:
  - `עורך דין פלילי`
  - `דין פלילי`
  - `עורך דין גירושין`
  - `גישור גירושין`
  - `עורך דין לענייני משפחה`
  - `עורך דין מקרקעין`
  - `עורך דין רשלנות רפואית`
  - `עורך דין נזיקין`
  - `עורך דין תעבורה`
  - `קניית דירה`
  - `חוזה מכר`
  - `צוואה`
  - `התנגדות לצוואה`
- Old Hebrew URLs and media/document URLs are already visible in GSC for several topics, so any migration must protect old URL signals with a controlled redirect plan.

## NOT VERIFIED

- Fresh browser GSC data was not captured in this specific pass.
- GSC traffic has not been merged row-by-row into all `1,220` inventory rows.
- `child-support` still needs a direct GSC pass for `מזונות ילדים`, `חישוב מזונות`, `בעמ 919/15`, and related variants.
- `employment-lawyer` still needs a direct GSC pass for employment-law terms.
- Broad inheritance-lawyer intent is weakly verified; will-related variants have evidence, but `עורך דין ירושה` showed no visible rows in the earlier pass.
- Authenticated menu export is still blocked by REST `401`, so menu/internal-link decisions are not final.

## BLOCKED

- URL migration execution is blocked until owner approval.
- Redirect execution is blocked until old URL -> new URL mapping is approved.
- Public content rewriting/publishing is blocked until duplicate/cannibalization and source review are complete.
- Noindex/delete decisions are blocked until owner approval and GSC risk review.

## First Decisions To Review

1. `criminal-lawyer`
   - Current evidence: old Hebrew criminal-law URL receives the visible criminal-lawyer impressions.
   - Risk: no clean exact `/criminal-lawyer/` URL in the public map; several pages compete for criminal intent.
   - Next: choose/create/strengthen the clean pillar, map old criminal URLs, then approve redirects later.

2. `divorce-lawyer`
   - Current evidence: clean `/divorce-lawyer/` exists, but an old Hebrew divorce-lawyer URL has 960 impressions.
   - Risk: HIGH URL migration risk.
   - Next: protect the old URL, merge useful content, and require redirect/internal-link/canonical/sitemap plan.

3. `child-support`
   - Current evidence: clean `/child-support/` exists and there are 30 conflict rows.
   - Risk: traffic not yet verified for child-support variants.
   - Next: run GSC query pass before deciding merge/redirect support pages.

4. `medical-malpractice-lawyer`
   - Current evidence: fee article receives broad malpractice-lawyer query impressions; exact clean pillar URL has duplicate rows.
   - Risk: HIGH because the current visible page intent may not match the desired pillar.
   - Next: resolve exact duplicate records, choose pillar/support split, protect fee article traffic.

5. `real-estate-lawyer`
   - Current evidence: homepage and real-estate cost article receive lawyer-intent impressions; strategic clean pillar is missing from public URL map.
   - Risk: MEDIUM.
   - Next: plan/create/strengthen clean pillar and route real-estate support pages into it.

## Safe Next Queries

Run these GSC browser filters next, then update the overlay:

- `מזונות ילדים`
- `חישוב מזונות`
- `בעמ 919/15`
- `משמורת ילדים`
- `עורך דין דיני עבודה`
- `דיני עבודה`
- `עורך דין ירושה`
- `עורך דין צוואות וירושות`
- `עורך דין תאונות דרכים`
- `עורך דין תאונת עבודה`

## 2026-05-11 Targeted Queue Added

CREATED:
- `project-control/targeted-gsc-query-queue.csv`
- `project-control/targeted-gsc-query-queue.md`

VERIFIED:
- The safe next queries are now expanded into a row-level queue with expected primary URLs, support URLs, decision rules and status labels.
- This keeps the next GSC browser session focused on evidence collection rather than content rewriting.

## 2026-05-11 Targeted Browser Pass 001

CREATED:
- `project-control/gsc-targeted-query-pass-2026-05-11.csv`
- `project-control/gsc-targeted-query-pass-2026-05-11.md`

VERIFIED:
- The browser-accessible GSC property is the URL-prefix property `https://jus-tice.co.il/`.
- `מזונות ילדים`: `160` impressions, `0` clicks, old calculator URL owns all visible rows.
- `חישוב מזונות`: `131` impressions, `0` clicks, old calculator URL owns all visible rows.
- `מחשבון מזונות`: `70` impressions, `0` clicks, old calculator URL owns all visible rows.
- `משמורת ילדים`: `611` impressions, split between `what-is-child-custody` and `ChildCustody.pdf`.
- `דיני עבודה`: `614` impressions, mostly `israeli-labor-law`, with additional homepage/service/support-page overlap.

REVIEW:
- Child-support and custody clean URLs require merge/internal-link/document strategy before any migration.
- Employment needs an informational-vs-lawyer-intent split before selecting final English slugs.

## Execution Rule

Map first. Decide second. Execute later in controlled batches.

No URL, redirect, canonical, sitemap, content-body, taxonomy, menu, lawyer, CRM, review, plugin-state, wp-admin setting, or database change was made in this pass.

## 2026-05-11 Targeted GSC Pass 2 Overlay

VERIFIED:
- Child-support sub-variants `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, `הלכת המזונות החדשה`, and `בע"מ 919/15` returned no visible rows in the checked browser filters.
- `משמורת בלעדית לאם` maps to an old Hebrew case-law URL with `107` impressions and average position `9.6`; protect it as support/merge-review material under the child-custody cluster.
- `חקירה במשטרה` returned no visible rows.
- `עבירות סמים` is a very low-sample criminal support gap: 2 impressions split between a case-law page and an old criminal-lawyer page.
- `נהיגה בשכרות` maps to a will-revocation URL, confirming a wrong-page match and a traffic-law support gap.

BLOCKED:
- This overlay is evidence only. Do not redirect, noindex, canonicalize, rewrite, delete or migrate URLs from it without approved maps.
