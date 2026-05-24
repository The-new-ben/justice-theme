# Maya Lawyer Live Read-Only QA - 2026-05-22

Status: BLOCKED LIVE QA / VERIFIED LIVE READ-ONLY PARTIAL / NO PUBLIC CHANGES

## Summary
- VERIFIED LIVE READ-ONLY: fetched https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/ and anonymous WordPress REST only.
- ROUTE STATUS: 404; final URL https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/.
- VERIFIED ROWS: 1/7.
- BLOCKED ROWS: 5/7.
- NOT SCREENSHOT VERIFIED: no browser screenshots were captured in this Node fetch check.
- SAFETY: no public CMS record, lawyer profile data, URL slug, redirect, canonical/noindex, sitemap, taxonomy, media, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## Page Evidence
- Title: Page not found | Jus-Tice.co.il
- H1 count: 1
- H1 texts: העמוד לא נמצא
- Canonical: -
- Robots: noindex, follow
- Schema types: WebSite | BreadcrumbList
- Hebrew characters in visible text: 1249

## Checks
| Check | Scope | Status | Evidence | Issues | Next step |
|---|---|---|---|---|---|
| MAYA-LIVE-001 | profile route status and final path | BLOCKED LIVE QA | HTTP 404; final URL https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/ | http_404 | After deploy/cache control, require HTTP 200 on the canonical Maya profile path. |
| MAYA-LIVE-002 | canonical and robots | BLOCKED LIVE QA | canonical=-; robots=noindex, follow | canonical_missing_or_mismatch;noindex_detected | Require self-canonical and index/follow only after profile approval and route repair. |
| MAYA-LIVE-003 | visible profile identity | BLOCKED LIVE QA | title=Page not found / Jus-Tice.co.il; h1=העמוד לא נמצא | page_not_found_title;not_profile_http_200 | Open the rendered profile after route repair and verify Maya profile content, not a 404 or homepage fallback. |
| MAYA-LIVE-004 | Attorney or Person JSON-LD | BLOCKED LIVE QA | schema_types=WebSite / BreadcrumbList | route_not_eligible_for_schema_until_http_200 | After profile route repair, inspect JSON-LD and run Rich Results validation. |
| MAYA-LIVE-005 | anonymous lawyer REST type discovery | VERIFIED LIVE READ-ONLY | types_http=200; rest_base=justice_lawyer | - | Keep anonymous REST type discovery available only with public response guards. |
| MAYA-LIVE-006 | anonymous Maya REST slug lookup | BLOCKED LIVE QA | rest_http=200; count=0; ids=-; links=- | rest_count_0 | After route/profile approval, require exactly one public approved Maya profile record or keep public route blocked. |
| MAYA-LIVE-007 | desktop and mobile screenshot evidence | NOT VERIFIED | Node fetch check does not capture rendered screenshots. | not_screenshot_verified | Capture desktop and mobile screenshots after live route checks pass. |

## Decision
- BLOCKED LIVE QA: do not mark the Maya Rotenberg mini-site live-ready until the route returns HTTP 200, self-canonical, index/follow, expected profile content, approved Attorney/Person schema and desktop/mobile screenshots.
