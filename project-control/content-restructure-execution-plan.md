# Content Restructure Execution Plan

Date: 2026-05-10
Status: ACTIVE PLAN - execute inventory before rewriting/publishing

## Executive Rule

Stop random article creation. The next project stage is:

EXPORT -> INVENTORY -> QUALITY AUDIT -> CANNIBALIZATION MAP -> URL MIGRATION MAP -> TOPIC CLUSTERS -> INTERNAL LINK MAP -> REVIEW -> APPROVED CMS UPDATE -> REDIRECTS -> VERIFICATION.

No public rewrite, import, redirect, noindex or delete happens before the inventory and owner-approved decisions.

## 1. Available Tools

AVAILABLE now:
- Local repo and scripts.
- Public WordPress REST API for published public data.
- Git for versioning CSVs, scripts and docs.
- PowerShell for export and CSV processing.
- Web research for official source/competitor references.

BLOCKED until credentials:
- wp-admin.
- WordPress Application Password.
- WP All Export.
- Google Search Console data.
- uPress cache/deployment controls.
- Database/phpMyAdmin.

## 2. Export Method

### Pass A - Public REST Snapshot

Use `tools/content-audit/wp-rest-export.ps1` to export public content.

Expected files:
- `project-control/exports/all-content-export.csv`
- `project-control/exports/all-posts-export.csv`
- `project-control/exports/all-pages-export.csv`
- `project-control/exports/all-articles-export.csv`
- `project-control/exports/all-categories-export.csv`
- `project-control/exports/all-tags-export.csv`
- `project-control/exports/all-taxonomies-export.csv`
- `project-control/exports/all-menus-export.csv`
- `project-control/exports/all-media-export.csv`
- `project-control/exports/all-internal-links-export.csv`
- `project-control/exports/all-url-export.csv`
- `project-control/content-master-inventory.csv`

Command after approval to run export:

```powershell
powershell -ExecutionPolicy Bypass -File tools\content-audit\wp-rest-export.ps1 -SiteUrl "https://jus-tice.co.il" -OutDir "project-control\exports"
```

Pass A limitation:
- Published/public content only.
- Menu items may be missing because public REST returned 401.
- Private/draft/meta/SEO/plugin data may be incomplete.
- Traffic data remains unknown.

### Pass A Result - 2026-05-10

VERIFIED:
- Public REST export completed.
- `project-control/content-master-inventory.csv` contains 1,220 public content rows.
- `project-control/exports/all-articles-export.csv` contains the public articles export.
- `project-control/exports/all-pages-export.csv` contains public pages.
- `project-control/exports/all-url-export.csv` contains the first URL inventory.
- `project-control/exports/all-internal-links-export.csv` contains 1,707 extracted internal links.

BLOCKED:
- `all-menus-export.csv` is empty because WordPress menu items returned REST 401.
- GSC click/impression/position fields remain `UNKNOWN`.

NEXT:
- Review generated maps before approving any rewrite, merge, redirect or slug change.

### Pass B - Authenticated REST Export

After owner creates a WordPress Application Password:

```powershell
$env:JUSTICE_WP_USER="admin-user"
$env:JUSTICE_WP_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
powershell -ExecutionPolicy Bypass -File tools\content-audit\wp-rest-export.ps1 -SiteUrl "https://jus-tice.co.il" -OutDir "project-control\exports-auth" -Authenticated
```

This should add:
- draft/private/pending content
- postmeta exposed in `context=edit`
- menu items
- richer media records
- exact edit slugs/statuses

### Pass C - WP All Export

Use only if wp-admin is available and owner approves plugin use.

Export:
- `articles`
- `pages`
- `posts`
- `justice_lawyer`
- taxonomies
- media
- postmeta
- SEO plugin fields
- redirects if plugin supports them

### Pass D - Database Read-Only

Use only if REST/WP All Export cannot expose required data.

Tables to read only:
- `wp_posts`
- `wp_postmeta`
- `wp_terms`
- `wp_term_taxonomy`
- `wp_term_relationships`
- `wp_options` for permalink/menus/widgets/redirects
- SEO plugin tables/options if present

No UPDATE/DELETE in this project phase.

## 3. Master Inventory Schema

The master inventory must contain:

`id, post_type, status, current_url, current_slug, proposed_english_slug, title, h1, seo_title, meta_description, language, word_count, content_hash, excerpt, date_published, date_modified, author, categories, tags, practice_area, city, parent_page, canonical_url, internal_links_out, internal_links_in, media_count, featured_image, top_keyword, secondary_keywords, search_intent, topic_cluster, pillar_candidate, duplicate_title_risk, duplicate_topic_risk, cannibalization_group, gsc_clicks_3m, gsc_impressions_3m, gsc_ctr_3m, gsc_position_3m, gsc_clicks_12m, gsc_impressions_12m, traffic_risk, content_quality_score, recommended_action, redirect_needed, notes`

Fields unavailable in Pass A should be blank or `UNKNOWN`, not invented.

## 4. Content Quality Scoring

Create/update `project-control/content-quality-audit.csv`.

Score 1-10:
- 1-2: spam, unusable, duplicate, broken, internal notes, or no clear legal value.
- 3-4: thin, outdated, weak intent match, poor structure.
- 5-6: usable but needs expansion, sources, links, CTA or cluster role.
- 7-8: strong public article but needs final source/legal review or linking.
- 9-10: pillar-quality, public-ready after legal/source check.

Recommended actions:
- KEEP
- EXPAND
- REWRITE
- MERGE
- SPLIT
- SUPPORT_PILLAR
- MAKE_PILLAR
- REDIRECT_LATER
- NOINDEX_LATER
- DELETE_ONLY_AFTER_APPROVAL
- SPAM_REVIEW
- LEGAL_REVIEW

## 5. Duplicate And Cannibalization Method

Use multiple signals:
- exact title match
- normalized title match
- slug similarity
- content hash equality
- content text similarity
- repeated target keyword
- same category/practice area
- same SERP/search intent
- same internal-link target role
- GSC query overlap when access exists

Output:
- `project-control/cannibalization-map.csv`

Every important keyword must have:
- one recommended primary URL
- supporting URLs
- merge candidates
- redirect-later candidates
- owner approval flag

## 6. URL Migration Method

Final decision:
- Hebrew content and UI.
- Short clean English public slugs.

Before migration:
1. Export current URLs.
2. Check GSC traffic.
3. Check duplicate slug targets.
4. Pick canonical page per intent.
5. Map old -> new.
6. Mark redirect required.
7. Mark internal link updates.
8. Mark canonical/sitemap updates.
9. Owner approves.

Output:
- `project-control/url-migration-map.csv`
- `project-control/slug-normalization-rules.md`

No redirect executes until owner approval.

## 7. Topic Cluster Map

Create/update `project-control/topic-clusters.csv`.

Required clusters:
1. Family law / divorce
2. Criminal law
3. Real estate
4. Medical malpractice
5. Personal injury / damages
6. Traffic law
7. Employment law
8. Inheritance / wills
9. National insurance
10. Cyber/privacy if content exists

Each cluster gets:
- pillar URL
- supporting articles
- missing articles
- related lawyers
- related categories
- source model
- status

## 8. Internal Link Map

Create `project-control/internal-link-map.csv`.

Rules:
- supporting -> pillar
- pillar -> supporting
- related support -> related support
- article -> lawyer directory
- article -> official source
- category -> pillar
- lawyer -> signed/relevant articles

Anchor text must be natural Hebrew, not over-optimized.

## 9. GSC Integration

When GSC is available, export:
- `project-control/gsc-page-query-export.csv`
- `project-control/gsc-cannibalization.csv`
- `project-control/gsc-low-ctr-opportunities.csv`
- `project-control/gsc-position-5-20.csv`
- `project-control/gsc-url-risk.csv`

Use Search Console Search Analytics API dimensions:
- query
- page
- date
- device
- country

No high-traffic URL migration without GSC review.

## 10. CMS Update Method

After maps are approved:

1. Import/refresh content as drafts only.
2. Merge old useful sections into chosen canonical drafts.
3. Preserve old URLs until redirect map is approved.
4. Update internal links in draft content.
5. Legal/source review.
6. Owner approval.
7. Publish/update canonical article.
8. Add 301 redirect from old URL to new URL.
9. Verify canonical, sitemap and internal links.
10. Monitor 404s and GSC after migration.

## 11. Rollback Plan

Before any CMS write:
- Export old post content.
- Save old slug, post ID and modified date.
- Save old canonical/meta.
- Save old internal links if available.

Rollback:
- restore old content/slug
- remove redirect
- clear cache
- re-submit sitemap if needed
- document rollback in `project-control/changelog.md`

## 12. Approval Gates

Owner approval required before:
- publishing major rewritten pages
- changing live slugs
- adding redirects
- deleting content
- noindexing content
- installing export/SEO plugins
- database access
- replacing high-traffic pages

Legal review required before:
- public YMYL legal claims
- legal process details
- rights/eligibility claims
- lawyer advertising/verification claims
- AI/legal-tech tool legal disclaimers

## 13. Timeline

Phase 1: Access plan and executable export plan - complete in repo.
Phase 2: Public REST export - next safe execution step.
Phase 3: Quality audit v1 - after export.
Phase 4: Cannibalization and URL migration maps - after quality audit.
Phase 5: GSC overlay - when credentials exist.
Phase 6: Owner decisions - pillars, merges, redirects.
Phase 7: CMS draft imports/updates - after decisions.
Phase 8: Live migration and verification - after approval.

## 14. What Can Be Automated

- public REST export
- URL extraction
- word count
- content hash
- title/slug duplicate detection
- English slug suggestions for known legal topics
- internal link graph
- draft quality pre-score
- GSC opportunity reports
- redirect-map generation

## 15. What Needs Human Review

- final pillar choice where old pages have traffic
- merge decisions
- title/meta strategy
- lawyer-related claims
- public wording for sensitive topics
- UX/navigation decisions

## 16. What Needs Legal Review

- legal rights/process claims
- limitations/eligibility
- limitation periods
- court/rabbinical/case-law interpretation
- paid lawyer placement/review/ranking language
- AI/legal document generation disclaimers

## 17. Sources

- WordPress REST API post schema/list endpoint: https://developer.wordpress.org/rest-api/reference/posts/
- WP All Export plugin: https://wordpress.org/plugins/wp-all-export/
- Google Search Console Search Analytics API: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- Google canonical and duplicate URL guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Kol Zchut public information model: https://www.kolzchut.org.il/
