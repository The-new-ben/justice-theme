# Child Support Content Decision Packet

Date: 2026-05-11
Status: IN PROGRESS / REVIEW ONLY

## Purpose

This packet reviews the largest current content conflict group: `child-support`.

It does not approve URL changes, redirects, content deletion, noindex, canonical changes, sitemap changes, or live CMS edits.

## VERIFIED

- `slug-conflict-review.csv` identifies `child-support` as the largest current target-slug conflict group with `30` rows.
- The exact clean URL exists: `https://jus-tice.co.il/child-support/`.
- The exact clean URL is a public guide candidate:
  - Title: `מזונות ילדים: מדריך מעשי לפני הסכם, תביעה או שינוי מצב`
  - Public REST word count: `2,767`
  - Quality heuristic: `8/10`
  - Current links out include the divorce pillar, custody, mediation, property division, family dispute resolution, consensual divorce, and the family-law lawyer directory.
- The group contains many long old case-law and doctrine pages. Several are much longer than the clean guide, but length alone does not make them the primary URL.
- `child-support-source-audit.csv` exists and already marks several source claims as `VERIFY_BEFORE_PUBLICATION`, `LAWYER_REVIEW_REQUIRED`, or `NOT_VERIFIED`.

## NOT VERIFIED

- Direct GSC traffic for `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, `הלכת המזונות החדשה`, `בע"מ 919/15`, and related variants is still missing from the current evidence overlay.
- Full legal/source review of the child-support guide is not complete.
- Official source for exact `בע״ם 919/15` wording is still not verified.
- Any child-support calculator/tool framing is not approved for publication.

## 2026-05-11 Targeted GSC Browser Evidence

VERIFIED:
- `מזונות ילדים`: `160` impressions, `0` clicks, `0%` CTR, average position `49.6`.
- `חישוב מזונות`: `131` impressions, `0` clicks, `0%` CTR, average position `54.9`.
- `מחשבון מזונות`: `70` impressions, `0` clicks, `0%` CTR, average position `30.0`.
- All three visible child-support/calculation filters mapped to `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`.
- `בעמ 919/15` returned no visible rows for this exact typed filter.

REVIEW:
- The clean `/child-support/` guide did not appear for the checked child-support variants.
- The old calculator URL is now a verified traffic-risk/support/tool page, not a page to remove or redirect blindly.
- Calculator intent may need a compliant support article or tool plan, but no calculator/tool framing is approved without legal/source review.

BLOCKED:
- No redirect from the old calculator URL.
- No deletion/noindex of the old calculator URL.
- No publication of calculator claims or formula language without legal review.

## Preliminary Decision

Recommended primary candidate:

- `https://jus-tice.co.il/child-support/`

Why:

- It has the clean English slug.
- It is already written as a public-facing practical guide rather than a case-law dump.
- It links into the family-law cluster.
- It can absorb carefully reviewed public-facing summaries from old content.

Important caution:

- This is not final approval. It is a review candidate only until GSC, source/legal review, owner approval, and redirect planning are complete.

## Content Lanes

Primary guide candidate:

- `/child-support/`

Likely support or merge-review pages:

- `בע״ם 919/15 | הלכת המזונות החדשה`
- `משמורת מזונות | ההלכה החדשה במזונות 919/15`
- `בג״ץ 5988-21 ... סמכות בית דין רבני מזונות ילדים`
- `סמכות בתי הדין הרבניים במזונות ילדים ... בג״ץ 5988/21`
- `מחשבון מזונות ילדים 2023`
- Pages about changed circumstances, calculation method, rabbinical jurisdiction, expenses, and case examples.

Do not treat as primary without review:

- Long case-law pages.
- Old Hebrew slug pages.
- Calculator/tool pages.
- Mixed custody/support pages.

## Recommended GSC Filters

Run these before final URL decisions:

- `מזונות ילדים`
- `חישוב מזונות`
- `מחשבון מזונות`
- `בעמ 919/15`
- `הלכת המזונות החדשה`
- `מזונות משותפת`
- `הפחתת מזונות`
- `שינוי מזונות`
- `מזונות ילדים בית דין רבני`

For each filter:

- Open Pages.
- Record all URLs.
- Record clicks, impressions, CTR, and average position.
- Mark whether the visible URL should be primary, support, merge, or redirect-later.
- Do not execute changes.

## Recommended Future URL Strategy

Do not change anything yet.

Possible final structure after approval:

- Primary: `/child-support/`
- Support: `/child-support-calculation/` or no separate page if calculator intent is weak.
- Support: `/change-child-support/` if GSC supports changed-circumstances intent.
- Support: `/child-support-rabbinical-court/` only if GSC/legal review supports separate intent.
- Case-law pages: keep as supporting/case resources, merge summaries into guide, or redirect later only after GSC/owner approval.

## Approval Gates

BLOCKED until approval:

- 301 redirects.
- Slug changes.
- Noindex.
- Deleting old pages.
- Replacing old content with weaker summaries.
- Publishing calculator claims.
- Adding FAQ schema.
- Adding legal conclusions about age bands, `בע״ם 919/15`, medor, expenses, or formulas without legal review.

## Files

- `project-control/child-support-conflict-review.csv`
- `project-control/child-support-source-audit.csv`
- `project-control/content-decision-evidence-overlay.csv`
- `project-control/slug-conflict-review.csv`
- `project-control/url-migration-map.csv`
- `project-control/content-quality-audit.csv`
- `project-control/internal-link-map.csv`

## Safety

No public content body, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, menu, lawyer record, CRM record, review data, plugin state, wp-admin setting, or database row was changed.
