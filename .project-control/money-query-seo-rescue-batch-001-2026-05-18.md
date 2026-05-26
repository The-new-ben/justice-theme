# Money Query SEO Rescue Batch 001 - 2026-05-18

Status: REPO ONLY / OWNER-REVIEW PACKET / NO PUBLIC CMS CHANGES

## Purpose

Prepare the first high-impact SEO rescue batch for money queries that already have Google impressions but weak or zero CTR.

This packet is designed to run in parallel with the commercial lawyer funnel. The goal is to feed the future lawyer registration/payment system with higher-quality commercial traffic.

## Research Basis

Sources checked this cycle:
- Google Search Console Performance report guidance: `https://support.google.com/webmasters/answer/7576553`
- Google title link/snippet guidance: `https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets`
- Current law-firm intake/search guidance: match user intent, reduce form friction, and connect commercial searches to a clear next action.

Applied rules:
- Prioritize pages with real impressions and low CTR.
- Match the title/H1/intro to the actual query language.
- Keep titles descriptive and concise.
- Avoid fake "best", "recommended", rankings, guarantees, fake ratings or unsupported lawyer claims.
- Do not redirect/canonicalize until route history, backlinks and query overlap are checked.

## Source Evidence

Source artifacts:
- `project-control/gsc-money-query-opportunity-map-2026-05-18.md`
- `project-control/gsc-money-query-opportunity-map-2026-05-18.csv`
- `reports/traffic-priority-audit-2026-05-18.csv`

Core GSC signal:
- These pages are not blocked from crawling/indexing in the sampled checks.
- The problem is mostly intent alignment, title/snippet weakness, content depth, internal links and commercial trust.

## Batch 001 Pages

### 1. Real Estate Lawyer Hub

URL:
- `https://jus-tice.co.il/real-estate-attorney/`

Main query:
- `עורך דין מקרקעין`

GSC signal:
- 1 click / 7,986 impressions / 0.01% CTR / average position 64.6

Current issue:
- High commercial intent exists, but the page probably does not look like the strongest answer for Israeli real-estate lawyer intent.

Proposed public edit:
- Title: `עורך דין מקרקעין | קניית דירה, מכירה ורישום זכויות | Jus-Tice`
- H1: `עורך דין מקרקעין`
- Intro angle: explain when a buyer/seller needs a real-estate lawyer, what documents and risks matter, and how Jus-Tice helps compare relevant lawyers by transaction type and location.
- Add support links to:
  - `/real-estate-lawyer-guide/`
  - `/lawyer-for-buying-or-selling-a-house/`
  - `/registration-of-real-estate-israel/`
  - `/land-appreciation-tax/`

Guardrail:
- Do not merge with `/real-estate-lawyer-guide/`; keep guide as educational support page.

### 2. Criminal Indictment Cancellation Article

URL:
- `https://jus-tice.co.il/articles/מחיקת-כתב-אישום-חזרה-מכתב-אישום-ביטול/`

Main query:
- `ביטול כתב אישום`

GSC signal:
- 0 clicks / 7,771 impressions / 0.00% CTR / average position 39.8

Current issue:
- Strong informational-to-commercial bridge, but likely title/snippet does not clearly promise the practical decision path.

Proposed public edit:
- Title: `ביטול כתב אישום | מתי אפשר לבקש ומה בודקים לפני פנייה לעורך דין`
- H1: `ביטול כתב אישום`
- Intro angle: define cancellation/withdrawal/amendment of indictment, list the first legal checks, and route urgent readers toward criminal-law guidance without promising outcomes.
- Add support links to:
  - `/criminal-defense-attorney/`
  - `/criminal-law/`
  - `/sex-crime-lawyer/` only where contextually relevant

Guardrail:
- Do not promise dismissal, acquittal or guaranteed result.

### 3. Sex Crime Lawyer Hub

URL:
- `https://jus-tice.co.il/sex-crime-lawyer/`

Main query:
- `עורך דין עבירות מין`

GSC signal:
- 0 clicks / 7,171 impressions / 0.00% CTR / average position 68.4

Current issue:
- YMYL criminal query needs trust, privacy, process clarity and careful language.

Proposed public edit:
- Title: `עורך דין עבירות מין | ייעוץ לחשודים, נפגעים והליכי חקירה | Jus-Tice`
- H1: `עורך דין עבירות מין`
- Intro angle: explain urgent first steps, privacy, investigation/arraignment stages, and how to find a relevant criminal lawyer by area and case type.
- Add support links to:
  - `/criminal-defense-attorney/`
  - criminal investigation/support articles where live and relevant

Guardrail:
- Avoid sensational phrasing, judgmental wording and any guarantee of legal outcome.

### 4. Prenup / Financial Agreement Hub

URL:
- `https://jus-tice.co.il/prenup-attorney/`

Main query:
- `עורך דין הסכם ממון`

GSC signal:
- 0 clicks / 6,251 impressions / 0.00% CTR / average position 59.0

Current issue:
- Family-law commercial intent is clear, but the page should answer why a lawyer is needed and what the process includes.

Proposed public edit:
- Title: `עורך דין הסכם ממון | ניסוח, אישור ושינוי הסכם | Jus-Tice`
- H1: `עורך דין הסכם ממון`
- Intro angle: cover before marriage, during marriage, second chapter, property separation, approval in court/notary where relevant, and common mistakes.
- Add support links to:
  - `/family-law/`
  - `/divorce-lawyer/` if live and contextually relevant
  - property/family support pages with verified live status

Guardrail:
- Do not make universal legal advice; keep it as general information and lawyer matching.

### 5. Traffic Lawyer Hub

URL:
- `https://jus-tice.co.il/traffic-lawyer/`

Main query:
- `עורך דין תעבורה`

GSC signal:
- 0 clicks / 3,455 impressions / 0.00% CTR / average position 63.9

Current issue:
- Core commercial hub has visibility but needs stronger intent match and support links to common offense types.

Proposed public edit:
- Title: `עורך דין תעבורה | נהיגה בשכרות, נקודות, שלילה ותאונות | Jus-Tice`
- H1: `עורך דין תעבורה`
- Intro angle: explain urgent traffic-law situations, common offense categories, what documents to prepare, and how to choose a relevant traffic lawyer.
- Add support links to:
  - `/driving-under-the-influence/`
  - `/dui-refusal-blood-breath-urine-test/`
  - `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/`
  - `/car-accident-auto-injury-lawyer/`

Guardrail:
- Do not promote unrelated trafficking pages; keep the support cluster strictly traffic-law.

## Implementation Recommendation

Do not edit all five live pages blindly.

Recommended order:
1. Real estate hub first, because it has the highest impressions and a clean commercial route.
2. Traffic lawyer hub second, because it has a stable commercial route and support pages.
3. Prenup third, after verifying family-law support links.
4. Criminal indictment article fourth, because it is article/CMS content and needs legal/source review.
5. Sex-crime hub fifth, because it is sensitive YMYL and needs extra tone/privacy review.

## Measurement Plan

After public edits:
- Request URL Inspection recrawl for each edited URL.
- Annotate the change date in the GSC tracking sheet.
- Review after 14, 28 and 45 days:
  - impressions;
  - clicks;
  - CTR;
  - average position;
  - whether Google rewrote the title;
  - lead-form interactions from those URLs.

## Safety Statement

This packet is repo-only. No public CMS title, H1, meta description, article body, slug, redirect, canonical, noindex, sitemap setting, taxonomy term, lawyer profile, lead record, payment setting, GA4/GSC setting, WordPress database row or uPress deployment was changed.
