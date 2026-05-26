# GSC Money Query Opportunity Map - 2026-05-18

Cycle time: 2026-05-18 18:04 Asia/Jerusalem

## Research basis

- Google Search Console Performance reports support query/page filtering, impressions, clicks, CTR and average position. The official guidance explicitly recommends reviewing low-CTR pages and improving titles/snippets/content where the page is worth keeping. Source: https://support.google.com/webmasters/answer/7576553
- Google's Search Console guidance says that if important queries have low CTR, check titles and snippets and whether they accurately answer the search. Source: https://support.google.com/webmasters/answer/10268906
- Google's title/snippet guidance says titles and snippets should accurately describe the page and match what users are looking for. Source: https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets

## What I mined

Source file:

- `justice_theme_emergency_master_2026_05_13/content-master/gsc-mirror/gsc-query-page-master.csv`

Filter:

- `is_money_keyword = TRUE`
- `impressions >= 100`
- `CTR < 2.5%`
- sorted by impressions descending

## Top commercial opportunities

| Priority | Query | URL | Clicks | Impressions | CTR | Position | Cluster | Initial interpretation |
|---:|---|---|---:|---:|---:|---:|---|---|
| 1 | עורך דין מקרקעין | `/real-estate-attorney/` | 1 | 7,986 | 0.01% | 64.6 | Real estate | Very high commercial intent; page is live/indexable but too weak for the query. Needs title/H1/content/internal-link review against `/real-estate-lawyer-guide/`. |
| 2 | ביטול כתב אישום | `/articles/...מחיקת-כתב-אישום.../` | 0 | 7,771 | 0.00% | 39.8 | Criminal | Strong criminal-law informational-to-commercial bridge. Should support the criminal hub and relevant lawyer matching. |
| 3 | עורך דין עבירות מין | `/sex-crime-lawyer/` | 0 | 7,171 | 0.00% | 68.4 | Criminal | Commercial YMYL query with no clicks. Needs trust, scope, visible lawyer route and related criminal hub links. |
| 4 | עורך דין פלילי מומלץ | `/עורכי-דין/...הגנה-פליל/` | 0 | 7,160 | 0.00% | 23.6 | Criminal | Better average position than most rows, but no CTR. Likely title/snippet/search-intent mismatch. |
| 5 | עורך דין פלילי בתל אביב | `/משרד-עורכי-דין-פלילי-הכי-טוב-תל-אביב/` | 0 | 6,482 | 0.00% | 49.3 | Criminal/local | Local commercial query. Needs city-intent cleanup and routing to real lawyer inventory. |
| 6 | עורך דין הסכם ממון | `/prenup-attorney/` | 0 | 6,251 | 0.00% | 59.0 | Family | High family-law commercial intent. Needs support-to-hub and lawyer CTA review. |
| 7 | עורך דין רשלנות רפואית בלידה | `/עורך-דין-רשלנות-רפואית-בלידה-מומלץ/` | 0 | 5,763 | 0.00% | 39.5 | Medical malpractice | Exact money query. Needs route relationship review against `/medical-malpractice-lawyer/` and birth injury support pages. |
| 8 | חיפוש עורך דין לפי שם | Homepage | 21 | 3,891 | 0.54% | 9.3 | Directory/search | High-value directory intent with page-one visibility and weak CTR. Homepage/directory search UX and snippet deserve attention. |
| 9 | עורך דין תעבורה | `/traffic-lawyer/` | 0 | 3,455 | 0.00% | 63.9 | Traffic | Core commercial hub has visibility but no clicks. Needs hub intent, title/H1 and support links. |
| 10 | עורך דין פלילי | `/criminal-defense-attorney/` | 0 | 2,929 | 0.00% | 58.9 | Criminal | Core commercial hub has visibility but no clicks. Needs consolidation around competing criminal pages. |

## Live Googlebot-style check

Sampled priority URLs returned HTTP 200 and indexable:

- `/real-estate-attorney/`
- criminal indictment cancellation article
- `/sex-crime-lawyer/`
- `/prenup-attorney/`
- `/traffic-lawyer/`
- `/criminal-defense-attorney/`
- `/real-estate-lawyer-guide/`
- homepage

No noindex blocker was detected in the sampled HTML. That means the current issue is probably not basic indexability for these rows. It is more likely intent alignment, ranking strength, internal linking, content depth, SERP title/snippet quality, and cluster cannibalization.

## Recommended action order

1. Real estate cluster: decide the relationship between `/real-estate-attorney/` and `/real-estate-lawyer-guide/`, then strengthen the main commercial page for `עורך דין מקרקעין`.
2. Criminal cluster: map the competing criminal-law money pages and choose the canonical commercial hub/support structure before editing titles.
3. Family/prenup cluster: review `/prenup-attorney/` as a commercial route and connect it to the family-law lawyer journey.
4. Medical-malpractice birth cluster: map exact query route to the existing medical-malpractice hub and birth-injury support pages.
5. Homepage/directory query: improve the homepage/directory search promise for `חיפוש עורך דין לפי שם` without hiding the lawyer registration journey.

## Guardrails

- Do not edit public CMS titles, H1s, meta descriptions, slugs or redirects until the cluster owner-review packet is prepared.
- Do not merge or redirect pages just because two pages target similar words; first check query/page overlap, backlinks, historical traffic and live page role.
- Do not treat low CTR at position 60 the same as low CTR at position 9. Position-9 homepage CTR is a title/snippet/conversion-path opportunity; position-60 pages need content depth, links and authority first.

## Safety

This cycle changed only repo planning/status artifacts. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment changed.
