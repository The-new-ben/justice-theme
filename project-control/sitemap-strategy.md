# Sitemap Strategy

Date: 2026-05-10  
Status: STRATEGY V1 - no sitemap or redirect changes executed

## Current Evidence

2026-05-11 CRIMINAL LAW NO-URL-CHANGE OUTLINE QUEUE:
- VERIFIED / REVIEW ONLY: `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.md` and `.csv` prepare `5` outline targets across `6` current URLs.
- CURRENT SITEMAP POSTURE: `/criminal-defense-attorney/`, police investigation, indictment, detention and drug offenses can be considered for sitemap inclusion only after owner/legal/source review and content expansion.
- HOLD OUT: `/criminal-lawyer/`, `/police-investigation/`, `/indictment/`, `/pretrial-detention/` and `/drug-offenses/` remain future-only and must not be added to sitemap until route repair and migration planning are approved.
- SAFETY: no sitemap inclusion rule, redirect, canonical, URL slug, taxonomy term, content body, lawyer, CRM, review, wp-admin setting or database row was changed.

2026-05-11 CRIMINAL LAW NO-URL INTERNAL LINK MAP:
- VERIFIED / REVIEW ONLY: `project-control/criminal-law-no-url-internal-link-map-2026-05-11.md` and `.csv` map `21` planned current-URL relationships.
- SITEMAP IMPACT: sitemap inclusion should wait until these internal links and source-reviewed content can be executed together.
- SAFETY: no sitemap inclusion rule, redirect, canonical, URL slug, taxonomy term, content body, internal-link, related-card, lawyer, CRM, review, wp-admin setting or database row was changed.

2026-05-11 CRIMINAL LAW PRIMARY SELECTION:
- VERIFIED LIVE: `/criminal-defense-attorney/` returns `200 OK`, self-canonicalizes and has criminal-lawyer title/H1 signals.
- BLOCKED: `/criminal-lawyer/`, the old Hebrew broad criminal-lawyer URL and a legacy deep criminal-law URL currently redirect to the homepage.
- DECISION: do not include `/criminal-lawyer/` in the sitemap until it is a real approved destination.
- CURRENT PLANNING PRIMARY: `/criminal-defense-attorney/`.
- SAFETY: no sitemap inclusion rule, redirect, canonical, URL slug, taxonomy term, content body, lawyer, CRM, review, wp-admin setting or database row was changed.

2026-05-11 CRIMINAL LAW CONTENT UPLOAD READINESS:
- VERIFIED / REVIEW ONLY: `project-control/criminal-law-content-upload-readiness-2026-05-11.md` and `.csv` map `50` higher-value criminal-law candidates after extracting `220` raw criminal-adjacent inventory matches.
- DECISION: `/criminal-lawyer/` should remain a strategic future sitemap target only until the primary page, old Hebrew GSC-visible URL, 301 redirect plan, internal links and canonical consistency are approved.
- CURRENT CANDIDATE: `/criminal-defense-attorney/` is the current clean-ish primary candidate to compare before migration.
- INCLUDE LATER ONLY AFTER APPROVAL: selected criminal pillar, police investigation, indictment, detention, drug offenses, sex offenses, economic/white-collar crime, tax offenses, criminal record deletion and criminal defenses.
- HOLD OUT: old GSC-visible Hebrew URL until redirect plan, thin detention/drug pages, foreign-law pages, legal-career pages, victim-rights pages, defamation/police-complaint boundary pages, traffic-criminal and cyber-criminal boundary pages unless separately approved.
- SAFETY: no sitemap inclusion rule, redirect, canonical, URL slug, taxonomy term, content body, lawyer, CRM, review, wp-admin setting or database row was changed.

2026-05-11 MEDIA / IMAGE SITEMAP HTTPS FIX:
- FIXED LIVE: first-party image/media URLs now normalize to HTTPS in public media helpers and Rank Math image sitemap filters.
- VERIFIED SOURCE: Rank Math official docs list `rank_math/sitemap/urlimages` for changing images included in XML sitemaps and `rank_math/sitemap/xml_img_src` for changing image URL output.
- WHY: the after-theme scan left only media/sitemap/content findings: 69 `SEO_PLUGIN_SITEMAP_MEDIA` and 2 `CONTENT_MEDIA_OUTPUT`.
- LIVE VERIFIED: uPress top commit is `a74a28b`, static marker returns `2026-05-11-media-sitemap-https-v1`, and the after-scan records 42 `VERIFIED` resources with 0 `REVIEW` findings.
- FIXED LIVE: sampled `<image:loc>` and rendered content-image findings no longer expose first-party `http://jus-tice.co.il/wp-content/uploads/...` in the bounded scan.
- NEXT CHECK: keep the clean scan as the current pre-migration sitemap baseline, and rerun before any GSC sitemap submission or URL migration batch.
- SAFETY: no media record, sitemap inclusion rule, redirect, canonical, URL slug, taxonomy term, content body, lawyer, CRM, review, wp-admin setting or database row was changed.

2026-05-11 THEME TERM-LINK HTTPS FIX:
- FIXED LIVE: public template taxonomy links now normalize first-party term URLs to HTTPS before rendering.
- VERIFIED LIVE: uPress top commit is `005af18` and static marker returns `2026-05-11-theme-term-link-https-v1`.
- REVIEW BASELINE: `project-control/public-http-internal-link-scan-2026-05-11-classified-before-theme-fix.csv` separates 54 theme-display findings from plugin/media/content review lanes.
- VERIFIED AFTER-SCAN: `project-control/public-http-internal-link-scan-2026-05-11-after-theme-term-link-https.csv` shows 0 remaining `THEME_DISPLAY_FIX` findings.
- REVIEW REMAINS: remaining first-party HTTP references are media/sitemap/content lanes: 69 `SEO_PLUGIN_SITEMAP_MEDIA` and 2 `CONTENT_MEDIA_OUTPUT`.
- DECISION: fix visible theme output first, then handle media/sitemap/plugin or stored-content references as separate review lanes; do not use this as redirect or URL-migration approval.
- NEXT CHECK: classify whether remaining media URLs should be normalized by sitemap/plugin config, media metadata, content rendering, or left alone pending traffic review.
- SAFETY: no sitemap inclusion rule, redirect, canonical, URL slug, taxonomy term, content body, lawyer, CRM, review, wp-admin setting or database row was changed.

2026-05-11 BROAD PUBLIC HTTP SCAN:
- IN PROGRESS / REVIEW: `tools/check-public-http-internal-links.ps1` now checks public HTML and sitemap XML for first-party HTTP references.
- REVIEW FINDING: `project-control/public-http-internal-link-scan-2026-05-11.csv` records 199 remaining first-party HTTP references in the bounded sample.
- REVIEW FINDING: 77 findings are in sitemap child XML, mostly media upload URLs.
- REVIEW FINDING: rendered HTML still exposes some first-party HTTP internal page/category/article links.
- DECISION: the content/URL migration project must include a source-classified HTTPS cleanup map before GSC sitemap submission is treated as clean.
- SAFETY: this scan did not add, remove, redirect, migrate, noindex, canonicalize or edit any URL.

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
- VERIFIED: Rank Math official docs document `rank_math/sitemap/urlimages` and `rank_math/sitemap/xml_img_src` for image sitemap URL handling.
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
# 2026-05-11 Traffic Law Sitemap Posture

VERIFIED / REVIEW ONLY:
- `project-control/traffic-law-content-upload-readiness-2026-05-11.md` and `.csv` reviewed `38` traffic-adjacent URLs before any sitemap execution.
- Include `/traffic-lawyer/` after owner approval as the traffic-law pillar.
- Include only expanded/source-reviewed support pages for drunk driving, testing/refusal, breathalyzer, speeding, Marvad, license suspension/points and traffic evidence.
- Hold thin pages, outdated Corona traffic pages, unapproved future slugs, personal-injury accident pages and false-positive license/trafficking pages out of the traffic-law sitemap plan until their correct cluster is approved.

BLOCKED:
- No sitemap entry, sitemap removal, noindex, canonical, redirect or category change is approved by this review-only batch.
