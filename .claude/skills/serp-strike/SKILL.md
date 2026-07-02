---
name: serp-strike
description: Lift competitive-keyword rankings with text-only changes (title, meta, H1, internal anchors) grounded in GSC strike-zone data and live SERP vocabulary. Use when asked to improve SEO, CTR or rankings for existing pages without writing new articles or changing URLs.
---

# SERP strike: text-only ranking lifts

Proven method (see project-control/serp-text-signals-method-2026-07.md
for the published evidence: SearchPilot A/B tests +10-17.5%, Hurrdat
+57% clicks from titles/H1 only, and more). Everything here is
render-layer: no new URLs, no new articles, no DB content writes.

## Hard rules (owner law, never violate)

- No em-dashes or en-dashes anywhere. No Hebrew AI-teller phrases.
- No new slugs or redirects without per-URL owner approval.
- No superlatives or outcome promises in titles (Bar rules + Google
  spam policy): never "הטוב ביותר", "מנצח", "מובטח".
- Every number shown must be computed from real CMS/GSC data.
- php -l every changed file; bump JUSTICE_DEPLOY_MARKER on deploy.

## Procedure

1. Load the latest GSC pull (reports/gsc-live-*/queries.csv). Select
   the strike zone: position 4-25, impressions >= 300 (>= 1000 for
   head families). Add page-1 rows (pos <= 10) with CTR < 1%: those
   are snippet failures and rank first in priority.
2. Map each query family to its live page: the query-page GSC export
   if present, otherwise the live WP search API:
   GET https://jus-tice.co.il/wp-json/wp/v2/search?search={query}.
3. Read the live SERP for the head query (WebSearch). Record the
   winners' exact vocabulary, synonyms, trust tokens (counts, years,
   review numbers) and format (guide / price table / directory).
4. Write the override in inc/seo.php justice_theme_money_query_seo_map
   keyed by the page's post_name:
   - title (page H1): head query first, no brand.
   - seo_title: same + " | Jus-Tice", total 50-60 characters.
   - description: 140-160 chars, answers the query's next question,
     weaves the secondary query wordings.
   - intro: OPTIONAL, only when the first paragraph truly mismatches
     the query intent.
   Year tokens go in justice_theme_year_fresh_seo_map (wp_date('Y'),
   never hardcoded). Pillar pages use inc/cluster-pillar-titles.php;
   practice-areas taxonomy pages use
   justice_theme_practice_area_seo_override.
5. De-cannibalize: if several own pages receive one family, give each
   ONE distinct sub-intent in its title (cost vs city vs how-to) so
   they stop splitting the query.
6. Mesh: ensure the page is a spoke in inc/content-clusters.php (the
   pillar hub block and spoke backlinks render automatically from the
   map). Verify each added slug is live (HTTP 200) first: dead slugs
   are silently skipped by the resolver but must not be added.
7. Verify: php -l changed files, scan the diff for em/en-dashes and
   AI tellers, check title lengths (50-60 chars incl. brand), bump
   version + marker, commit, push to main, tell the owner to pull.
8. Measure in the NEXT GSC pull (2-4 weeks): keep winners, iterate
   losers, never touch a winning title twice in one cycle. Log what
   shipped in project-control/HANDOFF-MEGA-2026-07.md.
