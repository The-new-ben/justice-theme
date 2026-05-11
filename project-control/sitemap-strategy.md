# Sitemap Strategy

Date: 2026-05-10  
Status: STRATEGY V1 - no sitemap or redirect changes executed

## Current Evidence

2026-05-11 ROBOTS STATIC FILE FIX:
- FIXED LIVE: root `robots.txt` now advertises `https://jus-tice.co.il/sitemap_index.xml`.
- VERIFIED LIVE: `robots.txt?codex_verify=...` returns HTTP 200, length 268, includes the sitemap directive, has no global `Disallow: /`, and does not block theme/CSS assets.
- VERIFIED LIVE: the sitemap index and sampled child sitemaps remain valid XML with zero first-party HTTP loc values:
  - `sitemap_index.xml`: 0 HTTP / 9 HTTPS
  - `page-sitemap.xml`: 0 HTTP / 11 HTTPS
  - `articles-sitemap1.xml`: 0 HTTP / 201 HTTPS
  - `articles-sitemap2.xml`: 0 HTTP / 200 HTTPS
  - `practice-areas-sitemap.xml`: 0 HTTP / 40 HTTPS
  - `category-sitemap.xml`: 0 HTTP / 16 HTTPS
- DECISION: the sitemap/robots technical baseline is now suitable for GSC sitemap submission review, but URL migration, redirects and content consolidation remain approval-gated.

2026-05-11 PUBLIC INTERNAL LINK HTTPS FIX:
- FIXED LIVE: public template links now explicitly render first-party permalinks through HTTPS normalization helpers.
- VERIFIED LIVE: related-content QA after uPress pull produced `project-control/live-related-content-qa-2026-05-11-after-public-link-https.csv`; all sampled rows are `VERIFIED` and sampled card URLs use `https://jus-tice.co.il/...`.
- SAFETY: this is rendered-output normalization only. It did not change stored URLs, slugs, redirects, sitemap inclusion rules, canonicals, content bodies, taxonomy, lawyer, CRM, review or database data.

2026-05-11 CACHE-BYPASS PATCH:
- CODE FIXED / NOT LIVE VERIFIED: added `rank_math/sitemap/enable_caching` with `__return_false` so Rank Math does not serve stale sitemap XML while HTTPS loc normalization is being verified.
- WHY: latest theme code was live, but child sitemap XML still emitted HTTP locs. `articles-sitemap2.xml?nocache=1` also returned 200 HTTP locs and zero HTTPS locs before the patch.
- SAFETY: this does not add, remove, redirect, migrate, noindex or canonicalize any URL. It only prevents Rank Math sitemap cache from masking the active normalization hooks.
- VERIFIED LIVE: after uPress pull to `4c7b45e`, sampled child sitemaps returned zero first-party HTTP locs:
  - `page-sitemap.xml`: 0 HTTP / 11 HTTPS
  - `articles-sitemap1.xml`: 0 HTTP / 201 HTTPS
  - `articles-sitemap2.xml`: 0 HTTP / 200 HTTPS
  - `practice-areas-sitemap.xml`: 0 HTTP / 40 HTTPS
  - `category-sitemap.xml`: 0 HTTP / 16 HTTPS
- NEXT CHECK: monitor the same counts after any Rank Math, permalink, cache or sitemap setting change.

2026-05-11 POST-PULL UPDATE:
- VERIFIED LIVE: uPress pull deployed the latest theme marker `2026-05-11-robots-sitemap-directive-v1`.
- VERIFIED LIVE: `https://jus-tice.co.il/sitemap_index.xml` returns valid XML and its child sitemap index entries use HTTPS.
- BLOCKED / NOT FIXED BY PULL: `https://jus-tice.co.il/articles-sitemap2.xml` still exposes 200 first-party `http://jus-tice.co.il` loc values and zero HTTPS loc values.
- VERIFIED: the child sitemap XML contains Rank Math output markers.
- INTERPRETATION: theme sitemap filters are live, but Rank Math child sitemap output is still cached or generated from settings/data that bypass the current normalization. Rank Math official documentation notes sitemap cache flushing after sitemap filter changes.
- NEXT SAFE ACTION: clear Rank Math sitemap cache and/or resave Rank Math sitemap/permalink settings, then recheck child sitemap HTTP loc counts before any GSC sitemap submission or URL migration.

VERIFIED:
- GSC Sitemaps section was opened in the browser.
- A "Submitted sitemaps" area was visible.
- Public recheck on 2026-05-10 21:42 Asia/Jerusalem found `https://jus-tice.co.il/sitemap_index.xml` returns valid XML with 9 child sitemap URLs.
- Public recheck found `https://jus-tice.co.il/page-sitemap.xml` returns valid XML with 11 URLs, but 10 are `http://` URLs.
- Public recheck found `https://jus-tice.co.il/articles-sitemap1.xml` returns valid XML with 252 URLs, but 238 are `http://` URLs.
- Public recheck found `https://jus-tice.co.il/articles-sitemap2.xml` returns valid XML with 217 URLs, all `http://`.
- Public recheck found `https://jus-tice.co.il/practice-areas-sitemap.xml` returns valid XML with 48 locs, including 34 `http://` locs and at least one media/image URL.
- Public recheck found `https://jus-tice.co.il/category-sitemap.xml` returns valid XML with 17 HTTPS locs.

PARTIAL / RISK:
- No submitted sitemap row was captured in the browser DOM snapshot.
- Public checks showed both `https://jus-tice.co.il/sitemap.xml` and `https://jus-tice.co.il/wp-sitemap.xml` redirecting to the homepage instead of returning XML.
- GSC Page indexing reports 198 indexed pages and 1.58K not indexed pages.
- GSC HTTPS reports 412 Non-HTTPS URLs, 25 HTTPS URLs and 222 HTTPS-not-evaluated URLs.
- The live active sitemap still exposes hundreds of `http://` content URLs. This likely explains or contributes to the GSC Non-HTTPS report and is a migration blocker.

CODE FIXED / LIVE VERIFIED WHERE NOTED:
- Theme-level first-party canonical, hreflang and Open Graph URLs now normalize to HTTPS.
- WordPress core sitemap entries now normalize first-party `loc` URLs to HTTPS when core sitemaps are active.
- Public frontend first-party links generated through WordPress URL helpers and major theme templates now normalize to HTTPS; sampled related-card URLs are LIVE VERIFIED as HTTPS.
- Plugin sitemap compatibility filters now normalize first-party URLs emitted through supported Yoast, Rank Math and AIOSEO sitemap hooks.
- Robots.txt now appends the verified active sitemap index when the directive is absent.
- The active live sitemap still requires post-deployment recheck because plugin cache/settings may need a uPress/wp-admin cache clear before changed hooks affect XML output.

EVIDENCE FILE:
- `project-control/sitemap-live-verification.csv`

DECISION:
- Sitemap setup is a migration blocker until verified.

## Sitemap Goals

Google should see:

```text
old URL -> 301 redirect -> approved new URL -> 200 response -> self-canonical -> in sitemap -> internally linked
```

The sitemap must not contain:
- old redirected URLs
- internal search URLs
- duplicate filter URLs
- tag archives that create cannibalization
- demo lawyer profiles
- private/draft/internal editorial notes
- low-quality media/doc URLs unless intentionally kept/indexed
- URLs that canonicalize elsewhere

## URL Groups To Include

Priority 1:
- Homepage `/`
- Lawyer directory `/lawyers/`
- Approved pillar pages:
  - `/divorce-lawyer/`
  - `/criminal-lawyer/`
  - `/real-estate-lawyer/`
  - `/medical-malpractice-lawyer/`
  - `/personal-injury-lawyer/`
  - `/traffic-lawyer/`
  - `/employment-lawyer/`
  - `/inheritance-lawyer/`

Priority 2:
- Supporting guides in approved clusters:
  - `/divorce-mediation/`
  - `/consensual-divorce/`
  - `/child-support/`
  - `/child-custody/`
  - `/divorce-property-division/`
  - `/family-dispute-resolution/`
  - `/police-investigation/`
  - `/indictment/`
  - `/pretrial-detention/`
  - `/buying-apartment/`
  - `/real-estate-purchase-agreement/`
  - `/birth-malpractice/`
  - `/pregnancy-malpractice/`
  - `/car-accident-lawyer/`
  - `/will/`
  - `/will-contest/`

Priority 3:
- Important legacy articles that still satisfy user intent and are not duplicates.
- Case-law pages only if they are intentionally preserved as case library pages and internally linked from guides.
- Approved lawyer profiles once real consent/verification status is clear.

## Category / Hub Pages

Include only if:
- They are useful landing pages, not thin archives.
- They have unique intro copy, related articles, related lawyers, FAQ/CTA where appropriate.
- Their taxonomy terms have been consolidated.
- They do not duplicate a stronger pillar page.

Candidate hubs:
- Family law / divorce
- Criminal law
- Real estate
- Medical malpractice
- Personal injury / damages
- Traffic law
- Employment law
- Inheritance / wills
- National insurance
- Cyber/privacy

## Media URLs

Do not include random media URLs in a primary sitemap unless intentionally strategic.

However:
- Do not remove high-traffic media URLs blindly.
- GSC shows some PDFs have clicks/impressions.
- If a PDF is valuable, create an HTML wrapper and link/canonical carefully only after review.

## Sitemap Build Method

Preferred:
- Use WordPress dynamic sitemap generated by a reliable SEO plugin or a controlled custom sitemap module.

Required before activation:
1. Validate XML.
2. Confirm only canonical public URLs are included.
3. Confirm all URLs return 200 over HTTPS.
4. Confirm no query/filter/private/demo URLs are included.
5. Submit in GSC.
6. Record last read date and discovered URL count.

## Migration Batch Checklist

For each approved migration batch:

1. Update `url-migration-map.csv`.
2. Update `redirect-map.csv`.
3. Update internal links.
4. Update canonical tags.
5. Update sitemap.
6. Test old URLs return 301.
7. Test new URLs return 200.
8. Test sitemap contains new URLs only.
9. Test old URLs are not in sitemap.
10. Monitor GSC indexing and redirects after deployment.

## Current Blockers

BLOCKED / NEEDS LIVE ADMIN:
- Verify active sitemap generator.
- Check whether an SEO plugin is active.
- Check why default sitemap aliases `/sitemap.xml` and `/wp-sitemap.xml` redirect to homepage while `/sitemap_index.xml` works.
- Monitor whether active sitemap child files keep zero `http://` locs after Rank Math, permalink, cache or sitemap setting changes.
- Monitor robots.txt after cache/server/plugin changes; root static file is fixed live as of 2026-05-11 07:00.
- Check if a redirect/catch-all rule is masking missing XML/404s.
- Check whether practice-area sitemap should include media/image URLs or only canonical taxonomy URLs.

## 2026-05-11 Hook Source Notes

- VERIFIED: Yoast official developer docs document `wpseo_xml_sitemap_post_url` for altering sitemap post URLs.
- VERIFIED: Rank Math official docs document `rank_math/sitemap/entry`, `rank_math/sitemap/xml_post_url`, and `rank_math/sitemap/post_type_archive_link`.
- SOURCE: `https://rankmath.com/docs/filters-and-hooks/admin/sitemap/`
- VERIFIED: AIOSEO official docs document `aioseo_sitemap_indexes` with `loc` entries.
- LIMITATION: plugin cache/settings may still require wp-admin/uPress cache clear before XML output changes are visible.

## Current Decision

NO URL MIGRATION UNTIL:
- sitemap XML is valid,
- redirect map is approved,
- high-risk URLs are reviewed,
- internal links/canonicals are ready,
- owner approves batch execution.

## Design / Cluster Dependency

ADDED 2026-05-10:
- Sitemap inclusion should reflect the final content and design hierarchy, not only which URLs exist.
- Pillar pages should be included only when they have a useful layout: explanatory copy, support links, related lawyers where appropriate, FAQ/checklist, lead CTA and self-canonical.
- Category/hub pages should not enter the sitemap as thin archives.
- Filter/query URLs should stay out of the sitemap unless converted into curated indexable hubs.
- Lawyer pages should be included only when profile status, consent/verification language and contact data are acceptable for public display.

Status: ACCEPTED STRATEGY / NOT LIVE EXECUTED.
