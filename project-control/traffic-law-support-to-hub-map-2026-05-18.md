# Traffic Law Support-to-Hub Map - 2026-05-18

## Goal

Turn traffic-law demand into qualified lawyer-lead intent by connecting the right support pages to the commercial traffic-law hub:

`https://jus-tice.co.il/traffic-lawyer/`

This is a planning artifact only. It does not edit public content, redirects, taxonomy, WordPress data, or uPress deployment state.

## Research Basis

- Google says internal links should be crawlable `<a href>` links and anchor text should help users and Google understand the destination.
- Current 2026 internal-linking guidance recommends a hub-and-spoke structure where support pages link back to the correct service page with natural, intent-specific anchors.
- Current Israeli traffic-law competitor pages cluster around drunk driving, license suspension, traffic points, speeding, phone use while driving, driving while disqualified, new-driver offenses, accident representation, administrative disqualification, vehicle impound/use bans, and court representation.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://seoglen.com/guides/internal-linking-seo
- https://ranalaw.co.il/
- https://law-ym.co.il/
- https://www.davidgolan.com/
- https://shaviv-law.com/
- https://no2yanshuf.co.il/

## Live Technical Check

Googlebot-style fetch passed for the commercial hub and sampled support/boundary URLs:

- `/traffic-lawyer/` - 200, indexable, self-canonical in previous source check, 88 KB response.
- `/driving-under-the-influence/` - 200, 75 KB response.
- `/driving-under-the-influence-of-drugs/` - 200, 73 KB response.
- `/dui-refusal-blood-breath-urine-test/` - 200, indexable, self-canonical in previous source check, 73 KB response.
- `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/` - 200, indexable, self-canonical in previous source check, 71 KB response.
- `/car-accident-auto-injury-lawyer/` - 200, indexable, self-canonical in previous source check, 77 KB response.
- `/medical-fitness-tests-for-driving-marvad-info/` - 200, 66 KB response.

One route needs follow-up:

- `/קטגוריות-מאמרים/דיני-תעבורה` returned 404 while the GSC mirror shows 1,116 impressions. This needs route/history review before any redirect or recovery.

## Priority Link Targets

| Priority | Source URL | GSC evidence | Target hub | Anchor direction | Reason |
|---|---|---:|---|---|---|
| P0 | `/traffic-lawyer/` | 20,330 impressions, 0 clicks | self | traffic lawyer | Main commercial hub; high impressions but weak click capture. |
| P0 | `/driving-under-the-influence/` | 14,990 impressions, 0 clicks | `/traffic-lawyer/` | drunk-driving traffic lawyer | Direct traffic-law money intent. |
| P0 | `/dui-refusal-blood-breath-urine-test/` | 6,426 impressions, 1 click | `/traffic-lawyer/` | refusal to alcohol or drug test | Direct DUI/procedure intent. |
| P0 | `/driving-under-the-influence-of-drugs/` | 7,731 impressions, 2 clicks | `/traffic-lawyer/` and criminal boundary | drugged-driving representation | Shared traffic/criminal intent; do not classify only as drug crimes. |
| P0 | `/car-accident-auto-injury-lawyer/` | 8,445 impressions, 0 clicks | boundary: traffic + personal injury | fatal accident traffic representation | Criminal traffic and injury boundary; do not merge blindly. |
| P0 | `/medical-fitness-tests-for-driving-marvad-info/` | 32,854 impressions, 79 clicks | boundary: traffic + medical fitness | license medical fitness review | Very high demand but medical-fitness boundary; keep factual and source-based. |
| P0 | PDF: traffic-offense table / ordinance asset | 8,096 impressions, 11 clicks | `/traffic-lawyer/` through an HTML explainer | traffic offense penalties and points | PDF has demand but weak conversion/crawl control; create or map to HTML before public link edits. |
| P1 | `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/` | 269 impressions, 0 clicks | `/traffic-lawyer/` | license points and disqualification | Lower GSC demand, but competitor pages heavily cover points/suspension. |
| P1 | `/פסק-דין-תעבורה-עין-הנץ.../` | 988 impressions, 17 clicks | `/traffic-lawyer/` | traffic camera evidence | Evidence/enforcement support; good topical authority after review. |
| P1 | `/זיכוי-נהג-משאית.../` | 358 impressions, 1 click | `/traffic-lawyer/` | professional-driver traffic defense | Commercially relevant but case-specific; rewrite carefully. |

## Boundary And False-Positive Rules

Traffic-law pages must not become a dumping ground for unrelated "traffic" words.

- `drug-trafficking`, `human-trafficking`, `sex-trafficking`, and `cybersex-trafficking` are criminal-law pages, not traffic-law pages.
- `business-license` and business-licensing Hebrew URLs are licensing/business-law pages, not traffic-law pages.
- `rental-agreement` captured "car rental contract" queries, but its core topic is real estate, so it should not feed the traffic hub.
- Corona/license-extension articles are outdated and should not be promoted until owner approves cleanup/noindex/merge handling.
- Personal-injury car-accident pages can link to traffic-law only where the intent is traffic prosecution, fatal accident defense, license consequences, or police/court representation.

## Recommended First Public Batch After Approval

1. Strengthen `/traffic-lawyer/` title/meta/on-page CTA with factual language around traffic representation, drunk driving, license suspension, points, and traffic court.
2. Add one contextual link from `/driving-under-the-influence/` to `/traffic-lawyer/`.
3. Add one contextual link from `/dui-refusal-blood-breath-urine-test/` to `/traffic-lawyer/`.
4. Add a boundary link from `/driving-under-the-influence-of-drugs/` to both traffic-law and criminal-law hubs.
5. Review the 404 traffic-category URL and decide between route recovery, redirect, or leave-404 based on actual old content and GSC trend.
6. Convert or surround high-impression PDFs with HTML explainers so users and Google reach conversion paths instead of dead-end files.

## Safety

No public CMS/database content, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
