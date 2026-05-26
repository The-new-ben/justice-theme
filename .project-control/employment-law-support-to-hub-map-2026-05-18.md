# Employment Law Support-to-Hub Map - 2026-05-18

## Goal

Turn employment-law demand into qualified lawyer-lead intent by connecting the right support pages to the commercial employment-law hub:

`https://jus-tice.co.il/labor-lawyer/`

This is a planning artifact only. It does not edit public content, redirects, taxonomy, WordPress data, or uPress deployment state.

## Research Basis

- Google says internal links should be crawlable `<a href>` links and anchor text should help users and Google understand the destination.
- Current 2026 internal-linking guidance recommends service hubs supported by related detail pages with varied, topically relevant anchors.
- Current Israeli employment-law competitor pages cluster around dismissal, severance, wage withholding, employee rights, employer representation, employment contracts, hearings before dismissal, harassment at work, discrimination, pregnancy/parental rights, pensions, overtime, and labor-court representation.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://seoglen.com/guides/internal-linking-seo
- https://www.vakrat.co.il/
- https://orental-law.com/
- https://www.vb-adv.com/labor.html
- https://albarakyoseph.co.il/services/labor-law/
- https://www.fridmanwork.com/employment-law

## Live Technical Check

Googlebot-style fetch passed for the commercial hub and sampled support/boundary URLs:

- `/labor-lawyer/` - 200, indexable, self-canonical, 71 KB response.
- `/employment-contract/` - 200, indexable, self-canonical, 82 KB response.
- `/employer-worker-relationship/` - 200, indexable, self-canonical, 132 KB response.
- `/israeli-labor-law/` - 200, indexable, canonical to `/practice-areas/israeli-labor-law/`, 129 KB response.
- `/income-protection-insurance/` - 200, indexable, self-canonical, 79 KB response.
- `/working-permit-for-foreign-workers/` - 200, indexable, self-canonical, 88 KB response.

Two high-impression routes need follow-up:

- `/labor-law/חוק-הודעה-מוקדמת-לפיטורים-ולהתפטרות` redirected/normalized to `/labor-law/law-2731/` and returned 404 while the GSC mirror shows 5,467 impressions.
- `/האם-יש-מקום-להכיר-בשליחים-של-וולט-כעובדי-וולט` returned 404 while the GSC mirror shows 5,806 impressions.

## Priority Link Targets

| Priority | Source URL | GSC evidence | Target hub | Anchor direction | Reason |
|---|---|---:|---|---|---|
| P0 | `/labor-lawyer/` | 29,862 impressions, 3 clicks | self | employment lawyer | Main commercial hub; high impressions but weak click capture. |
| P0 | `/employment-contract/` | 5,933 impressions, 3 clicks | `/labor-lawyer/` | employment contract lawyer | Strong employer/employee contract intent. |
| P0 | `/employer-worker-relationship/` | 4,704 impressions, 13 clicks | `/labor-lawyer/` | employee-employer relationship lawyer | Core employment classification/support page. |
| P0 | `/israeli-labor-law/` | 2,199 impressions, 1 click | `/labor-lawyer/` | Israeli labor law consultation | Broad legal explainer; canonical points to practice-area route. |
| P0-BLOCKER | `/labor-law/חוק-הודעה-מוקדמת-לפיטורים-ולהתפטרות` | 5,467 impressions, 0 clicks | route review first | notice before dismissal and resignation | High-value firing/termination topic; live fetch returned 404. |
| P0-BLOCKER | Hebrew Wolt courier employee-status page | 5,806 impressions, 14 clicks | route review first | worker classification and platform couriers | High-value employee/contractor topic; live fetch returned 404. |
| P1 | `/working-permit-for-foreign-workers/` | 15,903 impressions, 3 clicks | boundary: employment + immigration/compliance | foreign-worker employment permit | Commercial employer compliance intent, but needs boundary handling. |
| P1 | `/income-protection-insurance/` | 6,062 impressions, 0 clicks | boundary: employment + insurance/disability | loss-of-work-capacity rights | Work-capacity/insurance boundary; keep factual and avoid promoting as pure employment law. |
| P1 | Work-injury disability regulations page | 11,274 impressions, 37 clicks | boundary: employment + national insurance + injury | work injury rights | Strong demand but not pure labor-law representation; coordinate with personal-injury/benefits. |
| P1 | Sexual-harassment-at-work case page | 2,455 impressions, 15 clicks | `/labor-lawyer/` with sensitivity review | workplace sexual harassment claim | Employment-law support, but sensitive content needs careful legal/ethical language. |
| P1 | Employer-representation article | 1,400 impressions, 0 clicks | `/labor-lawyer/` | employer representation in labor law | Direct lawyer-lead intent for paying employer clients. |

## Boundary And False-Positive Rules

Employment-law pages must not absorb unrelated "work", "wage", or "employee" terms blindly.

- Foreign real-estate/Airbnb pages that were classified as employment-law are not employment-law support pages.
- Work-injury, disability, and loss-of-work-capacity pages are employment/insurance/national-insurance/personal-injury boundaries.
- Foreign-worker permit pages may support the hub only as employer compliance, not as general immigration advice.
- Corona workplace rules and emergency-workplace articles are outdated and should not be promoted until owner approves cleanup/noindex/merge handling.
- PDF court decisions with demand should be surrounded by HTML explainers before being promoted as conversion assets.

## Recommended First Public Batch After Approval

1. Strengthen `/labor-lawyer/` with factual click-intent language around dismissal, severance, wage claims, employment contracts, employer representation, worker rights and labor-court representation.
2. Add one contextual link from `/employment-contract/` to `/labor-lawyer/`.
3. Add one contextual link from `/employer-worker-relationship/` to `/labor-lawyer/`.
4. Review the early-notice/firing 404 route and Wolt courier 404 route before deciding route recovery or redirect.
5. Keep sensitive pages such as workplace sexual harassment for a separate legal/ethical review batch.
6. Hold outdated corona/emergency-workplace pages until owner approves cleanup or consolidation.

## Safety

No public CMS/database content, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
