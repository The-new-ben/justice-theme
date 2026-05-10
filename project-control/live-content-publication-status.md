# Live Content Publication Status

Date: 2026-05-10  
Decision: EDITORIAL REPAIR AND ENRICHMENT MODE
Deployment model: GitHub/uPress pulls the repo into the live WordPress theme.

## CURRENT MODE
- Keep the existing family-law URLs.
- Do not delete, draft, redirect, or hide them as the primary action.
- Clean public article bodies so visitors see only useful Hebrew legal content.
- Move internal/project notes into a draft-only WordPress page titled `Internal Editorial Notes — Family Law Cluster`.
- Treat future legal content as `articles` CPT drafts first; use page URLs only for the existing repair flow and controlled migration decisions.

## VERIFIED
- The repo now contains a narrow one-time publisher in `inc/live-content-publication.php`.
- The publisher targets only the first family-law cluster and only the exact approved repo draft files.
- Public URLs use short English slugs while Hebrew titles, H1s and body content remain Hebrew.
- Existing root page content is backed up into post meta before it is replaced.
- The publisher adds SEO title, SEO description, AEO summary, GEO summary, cluster meta, connected lawyer slug, source-audit meta and a public legal disclaimer.
- The publisher adds internal cluster links across the full family-law topic group.
- Automatic creation of new public pages is disabled.
- The manual action now repairs existing family-law pages only after preflight; it does not create missing pages by default.
- The editorial repair action updates existing pages in place with public-facing body content and leaves merge/redirect decisions for later approval.
- The internal notes sync creates a draft-only WordPress page for owner/team notes.

## CODE FIXED
- `functions.php` now loads `inc/live-content-publication.php`.
- `inc/seo.php` now respects page-level `seo_title` and `seo_description` fields and exposes AEO/GEO summaries as meta tags.
- `inc/schema.php` now emits Article schema for repo-published legal content pages, not only the `articles` CPT.
- `assets/css/premium-pass-3.css` now styles the public cluster navigation, lawyer CTA and legal disclaimer blocks.

## PUBLIC LINKS TO REPAIR / ENRICH
These URLs exist as the working family-law cluster. The immediate task is public-body cleanup and enrichment, not deletion:

1. https://jus-tice.co.il/divorce-lawyer/
2. https://jus-tice.co.il/consensual-divorce/
3. https://jus-tice.co.il/divorce-mediation/
4. https://jus-tice.co.il/child-support/
5. https://jus-tice.co.il/child-custody/
6. https://jus-tice.co.il/divorce-property-division/
7. https://jus-tice.co.il/family-dispute-resolution/

## CLUSTER / HIERARCHY
- Pillar: `/divorce-lawyer/`
- Supporting pages:
  - `/consensual-divorce/`
  - `/divorce-mediation/`
  - `/child-support/`
  - `/child-custody/`
  - `/divorce-property-division/`
  - `/family-dispute-resolution/`
- Every page receives a visible "מסלול קריאה באשכול משפחה וגירושין" internal-link module.
- Every page is connected to `advocate-maya-rotenberg` through `connected_lawyer_slug`.
- Every page uses the `Legal Pillar Page` template for hero, lead form, related topics and lawyer-directory connection.

## NOT VERIFIED LIVE
- The editorial repair code has not yet been visually verified on the live site after uPress pull/cache refresh.
- The stricter v3 repair code has not yet been visually verified on the live site after uPress pull/cache refresh.
- Search Console data is not yet used for traffic-risk scoring.
- Human legal review and source review are still owner/lawyer review items.

## CODE FIX - 2026-05-10 v3
- The repair cleaner now removes whole internal Markdown sections when the body contains strong team-only markers, even if the section heading is not matched exactly.
- Strong markers include `NOT VERIFIED`, `PARTIAL:`, `READY NEXT`, `CMS`, `CRM`, `GSC`, `LegalTech`, `Tools > Jus-Tice`, `FAQ schema`, `source audit`, and `project-control/...`.
- Removed internal sections are still collected into the draft-only `Internal Editorial Notes — Family Law Cluster` page.
- Next required proof: after uPress pulls, recheck the seven URLs and confirm those markers no longer appear in public article bodies.

## CODE FIX - 2026-05-10 v4
- The repair now runs under a new v4 version marker and purges cache after repairing the pages.
- Cache purge coverage includes WordPress post/object cache plus common cache-plugin hooks/functions for LiteSpeed, WP Rocket, W3 Total Cache, Autoptimize, SG CachePress and Cache Enabler-style hooks.
- This is still not a substitute for a uPress pull. It only helps after the latest theme code actually executes on WordPress.

## CODE FIX - 2026-05-10 v5
- Added a runtime public-content guard on `the_content` for the seven approved family-law slugs.
- If a page body still contains internal markers during rendering, the guard replaces the public output with the cleaned repo-draft article body, persists the cleaned body to the WordPress page, records `justice_runtime_guard_*` meta, and purges cache for that slug.
- This remains narrowly scoped: it does not create pages, does not delete pages, and does not run on unrelated content.
- Required proof: after uPress pulls, open one affected page and confirm the public body no longer contains internal markers.

## LIVE RECHECK - 2026-05-10 AFTER COMMIT d374407
- Result: STILL NEEDS uPress PULL / CACHE REFRESH / HOOK EXECUTION.
- All seven family-law URLs still expose internal markers publicly.
- The runtime guard is pushed to GitHub, but public HTML has not changed yet, so live WordPress is not running the latest pushed theme code or is serving an older cache layer.

## LIVE RECHECK - 2026-05-10 AFTER COMMIT d5824ed
- Result: STILL NEEDS uPress PULL / CACHE REFRESH / HOOK EXECUTION.
- All seven family-law URLs still expose internal markers publicly.
- GitHub `main` includes the v4 cache-purge repair, but public HTML has not changed yet.
- Required action remains: pull latest in uPress, then open `/wp-admin/` or any public page once so the repair hook executes, then recheck the seven URLs.

## LIVE RECHECK - 2026-05-10 AFTER COMMIT cd9b123
- Result: STILL NEEDS uPress PULL / CACHE REFRESH / HOOK EXECUTION.
- GitHub `main` has the v3 repair, but public HTML still exposes internal markers on all seven family-law URLs.
- Locally, the same seven repo drafts scan clean after the v3 cleanup function is applied.
- Interpretation: live WordPress is still serving the pre-v3 repaired bodies, or the latest theme code has not executed on the server yet.
- Required action: pull latest in uPress or open wp-admin after pull so the `init` repair hook can run, then recheck the seven URLs.

## LIVE RECHECK - 2026-05-10 AFTER COMMIT d3ff1d6
- Result: LIVE STILL NEEDS uPress PULL / CACHE REFRESH / HOOK EXECUTION.
- All seven family-law URLs returned HTTP 200.
- Public body still contained internal-note markers.
- Metadata markers such as `Slug target:` and `Primary keyword:` were not detected in this check, but internal-note markers remain.
- Expected after latest commit is active: pages stay public, public body is clean, and internal notes are moved to the draft-only internal editorial note.

## LIVE RECHECK - 2026-05-10
- Commit pushed: `8e28528`.
- Result: STILL NOT LIVE.
- Public checks for all seven intended URLs returned HTTP 200 only after redirecting to the homepage.
- The public HTML did not contain the new `justice-public-cluster`, `owner_approved_live_review`, or `justice:aeo-summary` markers.
- Meaning: GitHub has the publication package, but uPress/live WordPress has not pulled/executed it yet, or cache is still serving the old state.

## LIVE RECHECK - 2026-05-10 13:42 Asia/Jerusalem
- Result: UNSAFE PAGES ARE LIVE.
- All seven proposed URLs returned HTTP 200 at their own URL.
- Public HTML contained publication markers and internal-note markers.
- Emergency fix added in repo: on next uPress pull, `inc/live-content-publication.php` restores backed-up content where possible or moves generated pages to draft.
- This is reversible: old content backups are stored in post meta, and newly generated pages are drafted rather than deleted.

## LIVE RECHECK - 2026-05-10 13:52 Asia/Jerusalem
- Result: STILL UNSAFE LIVE.
- Commit `e17e0fa` is pushed to GitHub, but the public site still serves all seven unsafe pages.
- All seven pages still expose internal markers and publication markers.
- Conclusion: uPress/live WordPress has not pulled/executed the emergency quarantine yet, or cache is still serving old generated content.
- Required action: pull latest in uPress immediately, then open any public page once so the emergency quarantine runs.

## LIVE RECHECK - 2026-05-10 14:12 Asia/Jerusalem
- Result: STILL UNSAFE LIVE.
- Public checks again returned HTTP 200 for all seven family-law URLs.
- All seven still expose internal markers and publication markers.
- Browser/uPress automation is not available in this session; direct authenticated uPress/wp-admin action remains required.

## NEXT ACTION
1. Pull latest in uPress.
2. Open any public page or `/wp-admin/` once so the editorial repair runs.
3. Recheck all seven URLs for internal markers.
4. Continue merging stronger old content into these pages where cannibalization requires it.
5. Import future legal content into `articles` CPT drafts first, then approve publication after review.
