# Maya Rotenberg Lawyer Mini-site Readiness - 2026-05-22

Status: FIXED / VERIFIED LOCAL / BLOCKED LIVE QA / NO PUBLIC CMS CHANGE

## Summary
- FIXED / VERIFIED LOCAL: the lawyer profile template now includes the shared authority person slug in related-article lookup, so Maya content connected to `advocate-maya-rotenberg` can attach even while legacy slug handling is still present.
- VERIFIED LOCAL: 12/13 checks passed by source inspection across the profile template, directory archive, schema, authority helpers, REST guards and opt-in live migrations.
- BLOCKED: live public profile verification remains blocked until deployment/uPress cache state is controlled and `/lawyers/advocate-maya-rotenberg/` is checked directly.
- NOT VERIFIED: no desktop/mobile screenshot evidence was captured in this repo-only pass.
- SAFETY: no public CMS record, lawyer profile data, URL slug, redirect, canonical/noindex, sitemap, taxonomy, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## Checks
| Check | Scope | Status | Evidence | Next step |
|---|---|---|---|---|
| MAYA-MINI-001 | single lawyer profile public gate | VERIFIED LOCAL | single-justice_lawyer.php blocks unapproved public requests with 404 handling before template output. | Keep this guard in place before any profile publishing or route repair. |
| MAYA-MINI-002 | Maya related-article slug resolution | FIXED / VERIFIED LOCAL | single-justice_lawyer.php now adds the shared authority person slug into related article lookup. | After deployment, verify Maya profile related articles include content connected to advocate-maya-rotenberg. |
| MAYA-MINI-003 | connected lawyer article query | VERIFIED LOCAL | single-justice_lawyer.php queries published articles by connected_lawyer_slug, including backtick-wrapped values. | Keep the connected_lawyer_slug field populated on approved supporting articles. |
| MAYA-MINI-004 | no fake ratings or recommendations | VERIFIED LOCAL | single-justice_lawyer.php shows ratings/recommendations only after explicit CMS review signals and real counts. | Before publishing, confirm Maya has approved review/recommendation data or leave those modules empty. |
| MAYA-MINI-005 | profile view tracking gate | VERIFIED LOCAL | single-justice_lawyer.php keeps profile view tracking disabled by default and excludes bots/logged-in/admin-like views. | Only enable tracking after live QA and analytics expectations are defined. |
| MAYA-MINI-006 | lead form routing and spam guards | VERIFIED LOCAL | single-justice_lawyer.php includes assigned_lawyer_id, nonce, spam fields and attribution fields in the inquiry form. | After deploy, submit one controlled test lead only in an approved staging/live QA window. |
| MAYA-MINI-007 | lawyer archive public filtering | VERIFIED LOCAL | archive-justice_lawyer.php limits public directory output to approved lawyer IDs. | After deploy, confirm the directory excludes seed/demo lawyers and includes only approved profiles. |
| MAYA-MINI-008 | public REST output guards | VERIFIED LOCAL | inc/lawyer-rest-guards.php filters collections, blocks unapproved item reads and strips sensitive public response fields. | After deploy, read-only check anonymous REST for Maya and one unapproved profile ID. |
| MAYA-MINI-009 | Attorney and Person schema gates | VERIFIED LOCAL | inc/schema.php gates Attorney/Person schema behind public approval and inc/authority.php contains the Maya authority registry entry. | After deploy, inspect JSON-LD on /lawyers/advocate-maya-rotenberg/ and run Rich Results validation. |
| MAYA-MINI-010 | Maya slug/profile migrations are opt-in | VERIFIED LOCAL | inc/live-migrations.php keeps Maya slug, mini-site and source bootstraps behind false-by-default filters. | Do not enable these filters until owner approves the exact live migration step and rollback capture exists. |
| MAYA-MINI-011 | Maya identity helper | VERIFIED LOCAL | inc/template-tags.php can resolve Maya by canonical slug, legacy Hebrew slugs and title search before public approval checks. | Use this helper for route/schema/article connections instead of adding new one-off Maya matchers. |
| MAYA-MINI-012 | public live profile verification | BLOCKED | Existing authority gate records NOT LIVE VERIFIED and calls out the Maya redirect loop/live route check. | After uPress pull/deploy/cache clear, open /lawyers/advocate-maya-rotenberg/ and verify HTTP status, canonical, robots, schema and visible content. |
| MAYA-MINI-013 | visual screenshots | NOT VERIFIED | visual-qa-report.md still requires Maya public profile screenshots after deployment/live route repair. | Capture desktop/mobile screenshots after the live route is fixed; do not rely only on code inspection. |

## Upload Gate
- BLOCKED: do not publish, redirect, delete, noindex, canonicalize or migrate the Maya lawyer profile until owner approval, rollback capture, live route verification and screenshot QA are complete.
- READY FOR REVIEW: code-side safety is strong enough to prepare the Maya mini-site as a controlled candidate once the live route/cache issue is resolved.
