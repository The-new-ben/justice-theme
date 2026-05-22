# Homepage SEO Strategy

Date: 2026-05-10  
Status: GSC/GA4-INFORMED STRATEGY - no live content changes executed

## Role Of The Homepage

The homepage should be treated as a primary entity page for Jus-Tice:

- Hebrew legal portal.
- Lawyer directory entry point.
- Legal information library.
- Initial legal guidance and lead-routing platform.
- Lawyer onboarding/marketplace doorway.

The homepage should not try to rank for every legal practice keyword by stuffing text. It should establish the platform clearly and route users into strong pillar pages.

## GSC Evidence

VERIFIED:
- Query filter `עורך דין` showed 9 clicks, 10.4K impressions, 0.1% CTR, average position 50.6.
- Query filter `עורכי דין` showed 4 clicks, 2.49K impressions, 0.2% CTR, average position 29.7.
- The broad lawyer intent is scattered across specific legacy pages and does not appear to be clearly owned by `/` or `/lawyers/`.
- For some practice-area queries, the homepage appears because the correct pillar is weak or missing:
  - `עורך דין מקרקעין`
  - `עורך דין תעבורה`
  - some family-law variants

GA4 SUPPORT:
- Homepage received 396 views and 108 active users in the visible Pages and screens report.
- Average engagement was 6m10s, which is unusually strong compared with many legacy pages.

## Target Concepts

Primary broad concepts:
- עורך דין
- עורכי דין
- פורטל משפטי
- מידע משפטי
- מציאת עורך דין
- עורכי דין לפי תחום
- עורכי דין לפי עיר
- הכוונה משפטית ראשונית

The homepage should link naturally to:
- `/lawyers/`
- `/divorce-lawyer/`
- `/criminal-lawyer/`
- `/family-law/` or chosen family-law hub
- `/real-estate-lawyer/`
- `/medical-malpractice-lawyer/`
- `/personal-injury-lawyer/`
- `/traffic-lawyer/`
- `/employment-lawyer/`
- `/inheritance-lawyer/`

## Recommended Homepage Title / H1 / Meta

Recommended title:

```text
Jus-Tice | פורטל משפטי למציאת עורכי דין, מידע משפטי והכוונה ראשונית
```

Recommended H1:

```text
פורטל משפטי חכם למציאת מידע, עורכי דין והכוונה משפטית
```

Recommended meta description:

```text
מצאו מידע משפטי, מדריכים ועורכי דין לפי תחום ואזור. התחילו מהבעיה המשפטית שלכם וקבלו הכוונה ראשונית לפני פנייה לעורך דין.
```

Status:
- RECOMMENDED ONLY.
- Do not deploy until current title/H1/meta are exported and compared.

## Required Homepage Sections

CUSTOMER-READY STRUCTURE:

1. Clear brand and value proposition.
2. Search/discovery entry by legal issue, practice area and city.
3. Lawyer-directory entry.
4. Major practice-area hubs.
5. Latest/important public legal guides.
6. Lawyer cards only if profiles are real, verified, draft-safe, or clearly marked as not recommendation.
7. Lead CTA that does not promise legal advice if only routing/intake is provided.
8. Lawyer onboarding CTA separated from consumer CTA.
9. Trust language without fake verification/recommendation/success claims.
10. Internal links to major pillars.

## Internal Linking Strategy

Homepage should link to pillars with natural Hebrew anchors, for example:

- מדריך לעורך דין גירושין
- מידע על עורך דין פלילי
- עורכי דין לענייני משפחה
- עורך דין מקרקעין
- רשלנות רפואית
- דיני נזיקין ותאונות
- עורך דין תעבורה
- ירושה וצוואות

Do not over-optimize by repeating exact anchors too many times. Use the homepage as a hub that helps users move by problem, not as a keyword dump.

## Directory Strategy

The broad plural term `עורכי דין` should be owned mainly by `/lawyers/`, with the homepage supporting it.

Recommended:
- Homepage hero CTA -> `/lawyers/`.
- Practice cards -> pillar pages and/or filtered directory pages where filters are stable.
- Article CTAs -> relevant pillar + directory, not generic homepage.
- Footer -> `/lawyers/` and major hubs.

## Risks

HIGH:
- If homepage continues to capture practice-area impressions because pillars are weak, Google may not understand which page should rank.
- If `/lawyers/` remains weak, broad `עורכי דין` intent may continue to leak into lawyer-marketing pages, old content, and unrelated pages.

MEDIUM:
- Broad terms are extremely competitive. Homepage changes alone will not rank without strong directory, pillars, internal links, and real lawyer/data quality.

## Next Batch Candidate

After inventory/title export:

1. Confirm current homepage title/H1/meta.
2. Confirm current `/lawyers/` title/H1/meta.
3. Strengthen homepage internal links to approved pillar URLs.
4. Strengthen `/lawyers/` as directory primary.
5. Add GA4 events to homepage CTA and search actions.

No URL changes required for this batch.

## Design Alignment Gate

ADDED 2026-05-10:
- Homepage SEO decisions must be reviewed together with homepage layout, mobile order, CTA placement, related links, card behavior and analytics events.
- The homepage should visibly support the broad portal concepts without keyword stuffing: lawyer directory, legal fields, article library, intake/lead flow and lawyer onboarding.
- Use `project-control/homepage-seo-design-alignment.md` as the working design/SEO checklist before any final homepage rewrite or template change.

Status: PLANNED / NOT LIVE EXECUTED.

## 2026-05-22 Competitor-Aligned Homepage Strategy

Evidence:
- `project-control/homepage-competitor-aligned-strategy-2026-05-22.md`.
- `project-control/homepage-competitor-aligned-strategy-2026-05-22.csv`.

VERIFIED RESEARCH:
- Current Din, PsakDin, Mishpati and Justia pages/search results still support the core homepage direction: search-first discovery, practice/category navigation, editorial proof, lawyer profile value, paid-placement clarity and reporting.

VERIFIED LOCAL:
- `front-page.php` already has a strong portal stack: hero, intake, intent pyramid, practice areas, find-lawyer guide, featured lawyers, LegalTech, lawyer CTA, latest articles, ask lawyer, trust and final CTA.

RECOMMENDED:
- Do not rebuild the homepage.
- Refine section roles and copy.
- Move later from latest-only article exposure toward curated cluster guides.
- Keep paid lawyer messaging around profile, visibility, contact path and monthly reporting, not guaranteed leads.

BLOCKED:
- No public homepage copy, template, title/H1/meta, link, URL, redirect, canonical/noindex, sitemap, taxonomy, lawyer card, lead/CRM, payment or uPress action is approved by this strategy.

## 2026-05-11 Homepage Line-By-Line Review

Evidence:
- `project-control/homepage-line-by-line-review-2026-05-11.md`.
- `project-control/homepage-line-by-line-review-2026-05-11.csv`.

VERIFIED:
- The live homepage title/meta/H1 already support the broad legal-help and lawyer-directory direction.
- The homepage is still the best current broad entry according to the existing GSC homepage pass.
- The public scrape showed the shorter `front-page.php` section stack, not the full richer `page-home.php` stack.

Recommended next planning batch:
1. Decide authoritative homepage template.
2. Create owner-approved section order.
3. Curate major pillar links instead of relying on taxonomy count/order.
4. Verify hero search filters against `/lawyers/`.
5. Verify lead form delivery, phone number and GA4 events.
6. Run mobile visual QA only after approved template/content changes.

Status:
- REVIEW ONLY.
- NO PUBLIC HOMEPAGE CHANGE.

## 2026-05-11 Section Order And Pillar Link Proposal

Evidence:
- `project-control/homepage-section-order-proposal-2026-05-11.md`.
- `project-control/homepage-section-order-proposal-2026-05-11.csv`.
- `project-control/homepage-curated-pillar-link-map-2026-05-11.csv`.

VERIFIED:
- The proposal keeps the homepage as broad portal/entity entry and `/lawyers/` as the directory path to strengthen.
- The proposal avoids promoting clean slugs that currently resolve to the homepage.
- The proposal separates consumer legal-help sections from lawyer onboarding and future LegalTech/product sections.

Next approval gate:
- Owner approves the section order and link map, then a no-URL-change implementation checklist can be created.

## 2026-05-11 Controlled Homepage Implementation Checklist

Evidence:
- `project-control/homepage-controlled-implementation-checklist-2026-05-11.md`.
- `project-control/homepage-controlled-implementation-checklist-2026-05-11.csv`.

VERIFIED:
- The implementation checklist now exists and keeps the first homepage execution batch reversible and no-URL-change.
- The homepage should keep its current broad legal-help title/H1/meta in the first batch unless separately approved.
- Curated pillar/fallback links should be used only after owner approval and live URL verification.

BLOCKED:
- No public homepage implementation is approved yet.
- Sitemap, canonical, redirects, robots/noindex, title/H1/meta, menu and CMS/database changes remain blocked.
