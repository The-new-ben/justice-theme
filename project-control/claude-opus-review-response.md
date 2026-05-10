# Claude/Opus Review Response
Date: 2026-05-10

Scope: Treat the Claude/Opus review as a senior audit, verify each finding, port only safe changes, and prioritize customer-facing readiness.

## Findings Response

| Finding | Source file / page | Status | Code verified | Live verified | What changed | Still remains | Next action |
|---|---|---|---|---|---|---|---|
| Do not merge Claude branch wholesale because it deletes newer platform work | `origin/claude/justice-website-review-aovSK` | ACCEPTED | VERIFIED | NOT APPLICABLE | Documented in `branch-review-claude-aovsk.md` | Continue cherry-pick-only policy | Keep `main` as source of truth |
| Ask-lawyer form was `action="#"` | `template-parts/sections/ask-lawyer.php` | ALREADY FIXED | VERIFIED by PHP lint | NEEDS LIVE VERIFICATION | Form was wired to `admin-post.php?action=justice_submit_lead` in commit `e511c00` | Live public HTML did not show the fix yet | Verify Upress pull/cache and submit a test lead |
| Footer WhatsApp setting missing | `inc/lead-ui.php`, footer | ALREADY FIXED | VERIFIED by PHP lint | NEEDS LIVE VERIFICATION | Added `justice_whatsapp` Customizer field | Admin customizer value not inspected | Verify in wp-admin Customizer |
| Filter/search pages need canonical/noindex handling | `inc/seo.php`, `/lawyers/?area=family-law` | PARTIALLY ACCEPTED | VERIFIED by PHP lint | PARTIAL | Canonicals are live; code has noindex/follow for filters | Public filtered page did not show `noindex` yet | Verify Upress pull/cache and rendered robots tag |
| Lawyer pages need schema without fake claims | `inc/schema.php` | ACCEPTED / ALREADY FIXED | VERIFIED by PHP lint | NEEDS LIVE VERIFICATION | Conservative `Attorney` schema added, no fake ratings | Needs live lawyer URL check after slug fix | Verify Maya profile schema |
| Profile view counter inflates with bots/admins | `single-justice_lawyer.php` | ACCEPTED / ALREADY FIXED | VERIFIED by PHP lint | NOT VERIFIED | Bot/admin/feed/ajax/cron skips added | Live data effect cannot be checked publicly | Monitor profile_views after deploy |
| Breadcrumbs look raw | `/articles/`, article pages | ACCEPTED | VERIFIED by PHP lint / CSS diff | NEEDS LIVE VERIFICATION | Added premium breadcrumb CSS, removed visible ordered-list numbering, RTL separator fixed | Needs live pull and screenshot | Re-screenshot `/articles/` and article page |
| Header menu is too thin | live homepage | ACCEPTED | VERIFIED by PHP lint | NEEDS LIVE VERIFICATION | Added primary-menu augmentation for missing Lawyers, Practice Areas, Articles, Q&A, Lawyer Signup | Real wp-admin menu still needs assignment/cleanup | Verify live after Upress; then fix menu in wp-admin |
| Logo/favicon weak | live homepage, browser tab | ACCEPTED | VERIFIED by file/code | PARTIAL | Red-dot lockup already live; added temporary SVG favicon fallback | Old media-library logo not found from repo | Inspect wp-admin Media/Site Identity |
| Lawyer cards imply paid/sponsored status on demo data | `/lawyers/` | ACCEPTED | VERIFIED by PHP lint | NEEDS LIVE VERIFICATION | Sponsored badge now requires active subscription and non-seed data; city slugs mapped to Hebrew labels where possible | Existing live demo profiles still public | Draft/unpublish demo profiles after backup |
| Article pages do not speak strongly enough to intent | single article pages | ACCEPTED | VERIFIED by PHP lint | NEEDS LIVE VERIFICATION | Added article intent panel: problem, lawyer threshold, Jus-Tice path | Needs live pull; long-form content still requires review | Verify article page screenshot |
| 404 / internal routing weak | `/not-a-real-page-justice-qa/` | ACCEPTED | CODE FIXED / LIVE BLOCKED | NOT VERIFIED | 404 copy made Hebrew/customer-friendly | Live test currently returns homepage with HTTP 200, so WordPress 404 is not reached | Investigate permalink/plugin/server routing in wp-admin/uPress |

## What From Claude Was Implemented
- Safe branch findings were ported in `e511c00`: lead form wiring, WhatsApp customizer, canonical/noindex code, attorney schema, view-count hardening. Proof: PHP lint passed for 120 files.
- Customer-facing follow-up was implemented in this pass: menu augmentation, breadcrumb polish, fallback favicon, article intent panel, safer lawyer-card labels. Proof: PHP lint passed locally.

## What From Claude Was Not Implemented
- Wholesale merge of the Claude branch: rejected because it removes newer platform/content/GSC/legaltech work.
- Legacy plugin deletion/rename: blocked until active live plugin path is verified.
- Removing `post` from taxonomy ownership everywhere: partially rejected until live spam/content ownership is audited.

## What Still Needs Live Manual Work
- wp-admin: verify/assign primary, mobile, footer and legal-area menus.
- wp-admin Site Identity: upload final logo and site icon if the old logo exists in Media Library.
- uPress: confirm GitHub pull reached the active theme and clear cache.
- wp-admin/API: draft or remove public demo lawyers after backup.
- GSC: connect property and export query/page data before URL migration.
- WordPress/permalink/server: investigate why a fake URL returns homepage instead of a real 404.
