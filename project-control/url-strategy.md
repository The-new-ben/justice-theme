# URL Strategy
Date: 2026-05-09
Status: ACTIVE DECISION - mapping first, no redirects yet

## Decision

The site is Hebrew-first in content and UI, but public URLs and slugs should be short, clean English.

Hebrew stays in:
- page titles
- H1/H2 headings
- menus
- breadcrumbs labels
- visible article/profile content
- taxonomy display names

English is required for:
- page slugs
- post/article slugs
- lawyer profile slugs
- taxonomy term slugs
- public CPT rewrite bases where practical
- menu URL paths
- redirects and canonical URL targets

## Reason

English slugs are easier to read, share, type, maintain, debug, redirect, track in analytics, and integrate with SEO/GSC tooling. Hebrew content remains the product and SEO language; only the URL path is normalized to English.

## Examples

| Hebrew title / keyword | Target slug | Target URL |
|---|---|---|
| עורך דין גירושין | `divorce-lawyer` | `/divorce-lawyer/` |
| עורך דין פלילי | `criminal-lawyer` | `/criminal-lawyer/` |
| עורך דין מקרקעין | `real-estate-lawyer` | `/real-estate-lawyer/` |
| עורך דין רשלנות רפואית | `medical-malpractice-lawyer` | `/medical-malpractice-lawyer/` |
| גירושין בהסכמה | `consensual-divorce` | `/consensual-divorce/` |
| מזונות ילדים | `child-support` | `/child-support/` |
| קניית דירה | `buying-apartment` | `/buying-apartment/` |

## Migration Protocol

1. Export all current live URLs before changing slugs.
2. Pull GSC data if available.
3. Fill `project-control/url-migration-map.csv`.
4. Mark `traffic_risk` as `LOW`, `MEDIUM`, `HIGH`, or `UNKNOWN`.
5. Choose one primary URL per intent.
6. Do not change high-traffic URLs without review.
7. Do not create thin city/practice doorway pages.
8. Add 301 redirects only after the full mapping is approved.
9. Update internal links and breadcrumbs after migration.
10. Update sitemap and check canonicals after migration.
11. Keep theme-side live data migrations disabled by default; enabling a slug/profile migration must be explicit, documented, and tied to the approved URL migration map.

## Current State

## VERIFIED
- Live Maya Rotenberg lawyer URL was observed with a Hebrew slug.
- Repo seeder already targets `advocate-maya-rotenberg` for the Maya profile.
- Future seed lawyers are intended to use English slugs.

## NOT VERIFIED
- Full live URL inventory.
- GSC traffic by page.
- Existing redirect rules.
- Current sitemap canonical targets.

## BLOCKED
- Any live slug migration is blocked until inventory and redirect map are complete.

## 2026-05-11 Control Update
- FIXED IN CODE: Maya Rotenberg automatic slug migration is now opt-in only through `justice_theme_enable_maya_slug_migration`.
- FIXED IN CODE: Maya mini-site/profile metadata bootstraps are now opt-in only through `justice_theme_enable_maya_minisite_bootstrap` and `justice_theme_enable_maya_public_sources_bootstrap`.
- WHY: a Git/uPress pull should deploy templates safely, not silently change live URLs or profile CMS fields before owner approval.
