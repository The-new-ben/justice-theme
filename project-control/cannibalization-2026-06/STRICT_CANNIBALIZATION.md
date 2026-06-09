# Strict Cannibalization Map — derived from 16-month GSC mirror

Generated from `reports/gsc/query-page-combined.csv` (3376 query↔URL rows; 1485 URLs).

## Detection rule
A query is cannibalized when ≥2 of your URLs rank for it in the 16-month window AND each URL accumulated ≥10 impressions. Winner per query = max clicks → min avg position → max impressions.

## Headline numbers
- Queries with cannibalization signal: **13** of 3187 (0%).
- URLs that appear as a LOSER in at least one cannibalization (i.e. competing with a stronger sibling): **13**.
- Clean root-slug URLs that WIN ≥3 cannibalized queries (pillar candidates): **0**.

## Pillar candidates by cluster (clean root URLs that win ≥3 cannibalized queries, ≥100 total impressions)

## Top 25 supporting/loser URLs (candidates to demote or merge into a pillar)
| URL | Times beaten | Cluster guess |
|---|---:|---|
| `עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש` | 3 | family-law |
| `prenuptial-agreements-overview` | 2 | family-law |
| `strategic-divorce-cost-planning` | 1 | family-law |
| `פסד-חיוב-גט-בגין-מאיסות-אישה-בבעל-פירוד-ממושך-ומשניכר-כי-פני-הצדדים-לגירושין-134` | 1 | family-law |
| `wp-content/uploads/2021/07/ChildCustody.pdf` | 1 | family-law |
| `what-is-child-custody` | 1 | family-law |
| `legal-services-in-portugal` | 1 | international |
| `sofia-galvao` | 1 | general |
| `cms-law-firm` | 1 | general |
| `how-much-does-a-divorce-agreement-cost` | 1 | family-law |
| `בית-הדין-הרבני-קנה-סמכות-למרות-הגשת-תובענה-בעניין-החזקת-ילדים` | 1 | general |
| `תחומי-התמחות/דיני-משפחה/פסקי-דין-גירושין-דיני-משפחה-2022` | 1 | family-law |
| `changing-or-canceling-a-prenuptial-agreement` | 1 | family-law |

## Auto-derived pillar map written to `project-control/cannibalization-2026-06/pillars-from-gsc.json`
