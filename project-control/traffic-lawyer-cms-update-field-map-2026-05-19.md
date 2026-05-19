# Traffic Lawyer CMS Update Field Map - 2026-05-19

Status: VERIFIED PLANNING / REVIEW ONLY / NO PUBLIC CHANGES

Cycle time: 2026-05-19 12:08 Asia/Jerusalem

## Purpose

This map turns the owner-review traffic-lawyer SEO rescue block for `/traffic-lawyer/` into a practical CMS update worksheet.

It does not approve any public edit. Traffic law touches license loss, intoxication, accidents, medical fitness and criminal-adjacent issues, so the body copy remains blocked until owner approval, current-field backup and legal/source review. The first update should preserve the existing URL and strengthen the hub before any redirect, canonical, noindex, sitemap or support-page migration.

## Source Inputs

VERIFIED:
- Traffic edit source: `project-control/traffic-lawyer-seo-rescue-edit-blocks-2026-05-19.md`
- Traffic support-to-hub source: `project-control/traffic-law-support-to-hub-map-2026-05-18.md`
- Traffic no-URL internal-link source: `project-control/traffic-law-no-url-internal-link-map-2026-05-11.md`
- Traffic upload readiness source: `project-control/traffic-law-content-upload-readiness-2026-05-11.md`
- Current live URL: `https://jus-tice.co.il/traffic-lawyer/`
- Current live status: `200`
- Current canonical: `https://jus-tice.co.il/traffic-lawyer/`
- Current robots: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`

## Current Live Snapshot

VERIFIED LIVE on 2026-05-19 with `curl.exe` after PowerShell `Invoke-WebRequest` failed locally with a null-reference error:

- URL: `https://jus-tice.co.il/traffic-lawyer/`
- HTTP: `200`
- Source size: `77,819` bytes
- Canonical: `https://jus-tice.co.il/traffic-lawyer/`
- Robots: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
- Current title: `עורך דין תעבורה | עורכי דין לענייני תעבורה | Jus-Tice.co.il`
- Current H1: `עורך דין תעבורה`
- Current meta description: `עורך דין תעבורה - נתפסת נוהג תחת השפעת אלכוהול? נסעת במהירות מופרזת? היית מעורב בתאונת דרכים? עורך דין תעבורה מייצג נהגים במגוון של עבירות תנועה. תפקידו של עורך הדין הוא`
- Current OG title: same as current title
- Current OG description: same as current meta description
- Current visible H2s include traffic-lawyers, editor note, legal-help CTA, lawyer-match CTA and related legal guides
- Current source link count from the prior rescue check: `87`

Supporting link target checks:

| URL | Status |
|---|---:|
| `/driving-under-the-influence/` | VERIFIED 200 |
| `/dui-refusal-blood-breath-urine-test/` | VERIFIED 200 |
| `/driving-under-the-influence-of-drugs/` | VERIFIED 200 |
| `/yanshuf-breathalyzer-test/` | VERIFIED 200 |
| `/blood-alcohol-content-breathalyzer/` | VERIFIED 200 |
| `/speeding/` | VERIFIED 200 |
| `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/` | VERIFIED 200 |
| `/medical-institute-for-road-safety/` | VERIFIED 200 |
| `/medical-fitness-tests-for-driving-marvad-info/` | VERIFIED 200 |
| `/standards-of-medical-fitness-to-drive/` | VERIFIED 200 |
| `/lawyers/?area=traffic-law` | VERIFIED 200 |

## GSC Baseline

VERIFIED from local GSC mirror:

- `/traffic-lawyer` has `0` clicks, `20,330` impressions, `0.00%` CTR and average position `67.9`.
- Exact traffic-lawyer queries already map to `/traffic-lawyer/`, including `עורך דין תעבורה` with `3,290` impressions and `0` clicks.
- This is not an indexation failure. The first fix should improve query match, first-screen relevance, CTA clarity and contextual support links while preserving the URL.

## Recommended CMS Field Values

Use these only after owner approval, field backup and legal/source review:

- Page/post URL: `https://jus-tice.co.il/traffic-lawyer/`
- Slug: `/traffic-lawyer/`
- Post title / H1: `עורך דין תעבורה לנהיגה בשכרות, נקודות ושלילת רישיון`
- SEO title: `עורך דין תעבורה: נהיגה בשכרות, נקודות, שלילה ומשפט | Jus-Tice`
- Meta description: `מדריך מעשי למי שצריך עורך דין תעבורה: דוחות, נקודות, נהיגה בשכרות, מהירות מופרזת, פסילה, מרבד, משפט תעבורה ומה להכין לפני פנייה.`
- OG title: `עורך דין תעבורה: דוחות, נקודות ושלילת רישיון`
- OG description: same as meta description
- Breadcrumb label: `עורך דין תעבורה`
- Canonical: keep `https://jus-tice.co.il/traffic-lawyer/`
- Robots: keep index/follow after post-upload QA
- Practice-area taxonomy: existing traffic-law practice area only; do not create a new term during this edit
- Body source: use the intro, practical section, CTA block and internal-link instructions from `project-control/traffic-lawyer-seo-rescue-edit-blocks-2026-05-19.md`

## Backup Before Any CMS Edit

Before touching the live page, save:

- Current full body content.
- Current WordPress post title and visible H1.
- Current SEO title.
- Current meta description.
- Current OG title and OG description.
- Current canonical.
- Current robots setting if editable.
- Current taxonomy terms.
- Current related links/cards.
- Current schema JSON-LD output if visible.
- Current page source.
- Desktop and mobile screenshots if possible.

Do not overwrite the body until rollback material exists.

## Internal Links To Add From The Body

Add these as contextual links inside body copy, not only as related cards:

| Destination | Anchor direction | Role | Status |
|---|---|---|---|
| `/driving-under-the-influence/` | `נהיגה בשכרות` | drunk-driving support | VERIFIED 200 |
| `/dui-refusal-blood-breath-urine-test/` | `סירוב לבדיקת ינשוף או בדיקת אלכוהול` | DUI testing/refusal support | VERIFIED 200 |
| `/yanshuf-breathalyzer-test/` | `בדיקת ינשוף` | breathalyzer support | VERIFIED 200 |
| `/blood-alcohol-content-breathalyzer/` | `רמת אלכוהול ובדיקת נשיפה` | alcohol-testing support | VERIFIED 200 |
| `/speeding/` | `מהירות מופרזת` | speeding support | VERIFIED 200 |
| `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/` | `נקודות ופסילת רישיון` | points/disqualification support | VERIFIED 200 |
| `/medical-fitness-tests-for-driving-marvad-info/` | `בדיקות מרבד וכשירות לנהיגה` | medical-fitness boundary support | VERIFIED 200 |
| `/lawyers/?area=traffic-law` | `חיפוש עורכי דין תעבורה` | directory path | VERIFIED 200 |

## Inbound Link Batch

Later, after owner approval and after `/traffic-lawyer/` passes upload QA, add support-to-hub links from:

- `/driving-under-the-influence/`
- `/dui-refusal-blood-breath-urine-test/`
- `/driving-under-the-influence-of-drugs/`
- `/yanshuf-breathalyzer-test/`
- `/speeding/`
- `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/`
- `/medical-fitness-tests-for-driving-marvad-info/`

Recommended anchors:

- `עורך דין תעבורה`
- `ייצוג בבית משפט לתעבורה`
- `ליווי לפני שלילת רישיון`
- `עבירת נהיגה בשכרות`
- `בדיקת נקודות ופסילה`

Do not add the inbound batch before the hub edit is approved, backed up, legal/source-reviewed and QA-verified.

## Boundary Links

REVIEW ONLY:
- `/driving-under-the-influence-of-drugs/` can link to both `/traffic-lawyer/` and `/criminal-defense-attorney/` only after context review because the intent can be traffic and criminal.
- `/car-accident-auto-injury-lawyer/` must not be merged into the traffic-law hub. Link only where the page discusses traffic defense, license consequences or traffic prosecution.
- `/medical-institute-for-road-safety/`, `/medical-fitness-tests-for-driving-marvad-info/` and `/standards-of-medical-fitness-to-drive/` should stay factual and source-based. Do not turn them into private medical advice pages.

## Redirect, Canonical And Sitemap Notes

VERIFIED PLANNING:
- Keep `/traffic-lawyer/` as the commercial traffic-law hub URL.
- Keep self-canonical unchanged.
- Keep robots index/follow after QA.
- Do not redirect support pages into the hub during this edit.
- Do not canonicalize support pages into the hub during this edit.
- Do not remove support pages from the sitemap during this edit.
- Do not delete or noindex support pages during this edit.
- Do not create or link to future clean slugs such as `/drunk-driving/`, `/breathalyzer-test/` or `/license-suspension/` until migration maps are approved.
- Do not resolve traffic/criminal or traffic/personal-injury boundaries in this first update.

## Sensitive-Topic And Trust Safety

BLOCKED:
- `מומלץ`
- `הכי טוב`
- `מוביל`
- `אמין`
- guaranteed outcomes
- case-result predictions
- license-saved/result-saved promises
- city-lawyer coverage claims unless real lawyer coverage exists
- instructions to evade police, testing, court or lawful license procedures
- private medical advice claims
- fake review or rating claims
- `Review` schema
- `AggregateRating` schema
- fake badge or verification language

Allowed:
- Neutral legal-help CTA.
- General rights/process explanation.
- WebPage, Article and Breadcrumb schema only if generated output matches visible content.
- Clear disclaimer that the content is general information and not private legal advice.

## Post-Upload QA

Run immediately after any approved CMS edit:

1. HTTP returns `200`.
2. Canonical remains `https://jus-tice.co.il/traffic-lawyer/`.
3. Robots remains index/follow; no accidental noindex.
4. Source title matches the recommended SEO title.
5. Visible page has exactly one H1 and it matches the recommended H1.
6. Meta description is present and does not include blocked trust/offer/outcome language.
7. OG title and description are present.
8. New internal links resolve to `200`.
9. No `Review` or `AggregateRating` schema appears.
10. No fake lawyer card, fake rating, fake badge or city-coverage claim appears.
11. Mobile and desktop screenshots show no obvious overflow or broken first viewport.
12. CTA has no outcome promise, panic language or implied free legal advice unless approved.
13. Body copy contains no instruction to evade testing, police, court, license procedures or medical-fitness rules.

## Upload Order

Recommended order after owner approval and legal/source review:

1. Back up all current fields and screenshots.
2. Apply title/H1, SEO title, meta description, OG title and OG description.
3. Add the approved intro block from the traffic edit source.
4. Add the practical section.
5. Add the neutral CTA block.
6. Add contextual internal links.
7. Save without changing slug, canonical, redirects, taxonomy hierarchy or sitemap settings.
8. Run post-upload QA.
9. Request indexing or monitor recrawl in GSC after QA passes.

## Ready

- VERIFIED: live URL is `200`, self-canonical and indexable.
- VERIFIED: current title, H1, meta, canonical, robots and source size are captured for comparison.
- VERIFIED: recommended title/H1/meta/OG fields are defined.
- VERIFIED: outbound support and directory links are live `200`.
- READY FOR REVIEW: operator can use this as the `/traffic-lawyer/` CMS update worksheet after owner approval and legal/source review.

## Still Blocked

- BLOCKED: owner approval before any public CMS edit.
- BLOCKED: legal/source review before publishing sensitive traffic-law copy.
- BLOCKED: actual CMS backup capture until wp-admin/export access is used.
- BLOCKED: post-upload QA until a public edit is approved and completed.
- BLOCKED: GSC monitoring until the page is edited and recrawled.
- BLOCKED: redirects, canonical consolidation, noindex, sitemap changes, taxonomy cleanup, future slugs, traffic/criminal boundaries and traffic/personal-injury boundary decisions remain out of scope for this first update.

## Safety

This cycle created repo-only planning files and ran read-only live checks. No public CMS/database row, article body, title, H1, meta description, URL slug, redirect, noindex, canonical, sitemap, taxonomy, internal link, related-card, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment was changed.
