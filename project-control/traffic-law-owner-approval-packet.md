# Traffic Law Owner Approval Packet

Date: 2026-05-11  
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the traffic-law GSC, SERP, inventory and internal-link evidence into a proposed first execution batch. It does not approve or execute any public content rewrite, URL change, redirect, canonical change, sitemap change, noindex action, taxonomy/menu change or CMS write.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change traffic-law expansion batch.

Why this batch is relatively safe:
- `/traffic-lawyer/` already exists.
- The current pillar is thin (`1,399` words in the public inventory).
- Traffic-law SERPs show clear commercial lawyer-service intent.
- GSC evidence is low-sample, so there is no strong high-traffic URL that should block a careful expansion of the existing clean URL.
- Existing support pages already exist and should be reviewed/expanded before creating new duplicate slugs.

## Current Evidence

VERIFIED:
- `project-control/content-master-inventory.csv`.
- `project-control/content-decision-evidence-overlay.csv`.
- `project-control/traffic-law-support-decision-packet.md`.
- `project-control/traffic-law-support-review.csv`.
- `project-control/serp-criminal-traffic-review-2026-05-11.md`.
- `project-control/serp-criminal-traffic-review-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page or lead data.
- Authenticated menu export.
- Legal/source review of article claims.
- Owner approval for editing public content.

## Page Decisions For Approval

### 1. Traffic Pillar

Current URL:
- `https://jus-tice.co.il/traffic-lawyer/`

Current inventory facts:
- Published article.
- Word count: `1,399`.
- Already links out to drunk driving, refusal/test content, medical road-safety, speeding and breathalyzer content.

2026-05-11 pass-2 carry-forward:
- VERIFIED: `project-control/gsc-targeted-query-pass-2-2026-05-11.csv` records both `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` with `7` impressions each on `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`.
- VERIFIED: the same wrong-page pattern also appears in the documented third targeted pass, so this is not a one-off note.
- INTERPRETATION: the will-revocation page is being associated with traffic-law language by Google, but it should not be rewritten or optimized for traffic-law intent.
- RECOMMENDED: solve the mismatch through traffic-law content quality, a clear `/traffic-lawyer/` pillar, review of `/driving-under-the-influence/`, and careful internal links after approval.
- BLOCKED: do not create `/drunk-driving/`, redirect `/driving-under-the-influence/`, or edit the will-revocation URL for drunk-driving intent from this evidence alone.

Recommended action:
- APPROVE EXPAND / NO URL CHANGE.

Proposed public intent:
- A person looking for a traffic lawyer who needs to understand penalties, license risk, court process, when a lawyer is useful, and what to do next.

Required sections:
- מהו עורך דין תעבורה ומתי צריך לפנות אליו?
- באילו עבירות תעבורה עורך דין יכול לסייע?
- נהיגה בשכרות ובדיקת ינשוף.
- פסילה מנהלית ושלילת רישיון.
- מהירות מופרזת ונקודות.
- תאונות דרכים: מתי זה תעבורה ומתי זה נזיקין.
- מה להביא לפגישה עם עורך דין.
- טעויות נפוצות.
- שאלות ותשובות.
- מאמרים קשורים.
- עורכי דין רלוונטיים, רק אם קיימים פרופילים אמיתיים ומאושרים.
- הסתייגות משפטית.

### 2. Drunk Driving Support

Current URL:
- `https://jus-tice.co.il/driving-under-the-influence/`

Current inventory facts:
- Published article.
- Word count: `516`.
- Existing URL means `/drunk-driving/` must not be created blindly.

GSC evidence:
- `עורך דין נהיגה בשכרות` has `7` impressions on `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`.
- This is a wrong-page match.

Recommended action:
- APPROVE REVIEW + EXPAND EXISTING PAGE / NO NEW URL YET.

Blocked:
- Do not create `/drunk-driving/`.
- Do not redirect `/driving-under-the-influence/`.
- Do not optimize the will-revocation page for traffic intent.

### 3. Breathalyzer / Yanshuf

Current URL:
- `https://jus-tice.co.il/yanshuf-breathalyzer-test/`

Current inventory facts:
- Published article.
- Word count: `484`.

Recommended action:
- KEEP AS SUPPORT / EXPAND LATER.

Relationship:
- Support page under `/traffic-lawyer/`.
- Should link to drunk-driving content and back to the traffic pillar.

### 4. Speeding

Current URL:
- `https://jus-tice.co.il/speeding/`

Current inventory facts:
- Published article.
- Word count: `536`.

Recommended action:
- KEEP AS SUPPORT / EXPAND LATER.

Relationship:
- Support page under `/traffic-lawyer/`.

### 5. Driving Under Influence Of Drugs

Current URL:
- `https://jus-tice.co.il/driving-under-the-influence-of-drugs/`

Current inventory facts:
- Published article.
- Word count: `500`.

Recommended action:
- KEEP AS SUPPORT / REVIEW BOUNDARY WITH CRIMINAL-LAW CLUSTER.

Relationship:
- Traffic-law support page.
- Also relevant to criminal-law/drug-offense content, so internal linking must be careful.

### 6. License Suspension

Candidate URL:
- `https://jus-tice.co.il/license-suspension/`

Current evidence:
- No selected current page.
- GSC filters for `פסילה מנהלית` and `שלילת רישיון נהיגה` returned no visible rows.
- SERP/source evidence suggests intent exists, but it can split between driver-license, professional-license, administrative and court-suspension meanings.

Recommended action:
- HOLD / DO NOT CREATE YET.

Next review:
- Check old content for driver-license suspension pages.
- Separate driver-license suspension from professional-license suspension.
- Recheck GSC variants before page creation.

### 7. Car Accident Boundary

Current URL:
- `https://jus-tice.co.il/car-accident-auto-injury-lawyer/`

Current evidence:
- Low GSC sample.
- Traffic-law and personal-injury intent overlap.

Recommended action:
- KEEP SEPARATE / DO NOT FOLD INTO TRAFFIC PILLAR.

Rule:
- Traffic-law content should explain the legal traffic offense side.
- Personal-injury content should explain compensation/damages side.

## Proposed Internal Links

If owner approves the no-URL-change expansion batch:
- `/traffic-lawyer/` should link to:
  - `/driving-under-the-influence/`
  - `/yanshuf-breathalyzer-test/`
  - `/speeding/`
  - `/driving-under-the-influence-of-drugs/`
  - future `/license-suspension/` only after approval
  - car-accident content only as a boundary link
- Each support article should link back naturally to `/traffic-lawyer/`.
- Drunk-driving and breathalyzer articles should link to each other.
- Avoid over-optimized anchor text.
- Use natural Hebrew anchors.

## Source / Legal Review Checklist

Before editing public content:
- Verify official/public sources for drunk-driving, breathalyzer, traffic points, license suspension and medical fitness to drive.
- Confirm current legal statements.
- Avoid promising outcomes.
- Add a clear legal-information disclaimer.
- Do not cite private or unverified legal claims.

## Sitemap / Canonical / Redirect Position

For this proposed first batch:
- Redirects: NOT REQUIRED if URLs are kept.
- Canonical changes: NOT REQUIRED unless current page markup is wrong.
- Sitemap changes: NOT REQUIRED if existing published URLs remain in sitemap.
- Internal-link updates: REQUIRED after content approval.
- URL migration map: keep `drunk-driving` and `license-suspension` as future candidates only.

## Approval Questions

Owner approval needed:
1. Approve expanding existing `/traffic-lawyer/` as the traffic-law pillar with no URL change?
2. Approve reviewing and expanding existing `/driving-under-the-influence/` instead of creating `/drunk-driving/` now?
3. Approve holding `/license-suspension/` until more GSC/source evidence exists?
4. Approve internal links between the traffic pillar and existing support pages?
5. Confirm whether traffic-law is a priority cluster before criminal-law, or whether criminal-law should go first despite higher URL risk?

## Blocked Actions

BLOCKED until explicit owner approval:
- Editing public page bodies.
- Changing titles/H1/meta.
- Changing slugs.
- Creating `/drunk-driving/`.
- Creating `/license-suspension/`.
- Adding redirects.
- Changing canonicals.
- Changing sitemap inclusion.
- Deleting/noindexing old traffic pages.
- Editing the will-revocation page for traffic-law intent.

## Recommended Next Step

If approved:
1. Draft a no-URL-change content brief for `/traffic-lawyer/`.
2. Draft a no-URL-change content brief for `/driving-under-the-influence/`.
3. Build a source list.
4. Build the internal-link update map.
5. Only then prepare CMS update drafts for owner/legal review.
