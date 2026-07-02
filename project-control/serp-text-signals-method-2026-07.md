# The SERP text-signals method: ranking lifts from words alone

Date: 2026-07-02. Owner-ordered research: prove that pages can climb
competitive keywords with TEXT changes only (title, meta, H1, intro,
internal anchors), no new articles and no backlinks, then encode the
method as a repeatable skill and run it on our money pages.

## 1. The proof (real published cases, with numbers)

1. SearchPilot controlled SEO A/B split tests (the strongest evidence
   class that exists: half the page group gets the new text, half does
   not, measured at 95% confidence):
   - Adding "the best" to title tags: +10% organic traffic.
   - Fully capitalizing titles incl. brand: +17.5% organic traffic.
   - Shortening titles / removing weak words on a travel site: +11%.
   - Counter-proofs that the effect is causal, not noise: adding
     airport codes to titles: -16%; static prices in titles: -7%.
   Source: searchpilot.com case-study library ("10 SEO A/B tests that
   delivered over 10% more traffic", "The best title tag experiment",
   "Split testing titles and H1s").
2. Hurrdat Marketing client case: 23 blog posts, changes to title tags
   and H1s ONLY (removed pipe+brand, used the freed pixel width for
   query words): +57.1% clicks and +63.5% impressions on average
   within one month. Source: hurrdatmarketing.com title tag case study.
3. Ethan Lazuk mini case study: swapping the word ORDER of an existing
   title/H1 (audience segment before product type, matching how people
   actually search): daily clicks rose from ~8 to ~25 (about 3x) within
   days, settling at ~3x. Source: ethanlazuk.com title-tag-case-study.
4. OutreachMama on-page-only case: +117% ranking improvement with zero
   backlinks: rewritten title/H1/copy, internal anchor reinforcement
   and FAQ schema. Source: outreachmama.com on-page SEO case study.
5. Zyppy (Cyrus Shepard) data studies already cited in our
   TITLE-BLUEPRINT: 41,000-title rewrite study (50-60 char titles keep
   the lowest Google-rewrite rate) and the 23-million internal links
   study (descriptive, query-matching anchor text correlates with more
   clicks to the target page).
6. Our own first result 2026-06 to 2026-07: the strict GSC method
   (this repo) took the criminal pillar from a stuffed legacy title to
   a SERP-pattern title and the strike pages of batch 1/2 are the same
   play at scale. Measure in the next GSC pull.

## 2. Why it works (mechanism, not magic)

- Positions 4-25 ("striking distance") are where Google already
  believes the page is relevant; what is being tested is whether the
  snippet matches the query intent and earns the click. Title, meta,
  H1 and first paragraph are the highest-weight relevance and CTR
  surfaces that can be changed in minutes.
- Google rewrites weak titles; staying in the 50-60 character band
  with the head keyword first keeps the title you wrote in the SERP.
- Internal anchor text is a ranking input the site controls fully:
  a spoke receiving 5+ descriptive anchors ("what people type") from
  its pillar and siblings outranks the same page with generic anchors.
- One page per query family: two of our pages splitting one query is
  how a 13k-impression family sits at position 25. Differentiated
  titles stop the split without URL changes.

## 3. The method, step by step (encoded in the serp-strike skill)

1. PICK targets from real GSC data only: position 4-25 AND
   impressions >= some floor (we use 1,000 for head families, 300 for
   long tail). Sort by impressions. Page-1 rows with CTR < 1% are
   snippet failures and come first.
2. MAP each query family to the page that actually receives it
   (query-page GSC export, or the live WP search API as proxy).
3. READ THE SERP for the head query (top 10): collect the winners'
   exact vocabulary, synonyms, trust tokens (numbers, counts, year),
   and format (guide, price table, comparison, directory).
4. REWRITE render-layer only:
   - Title: head query first, one SERP synonym, one trust word from
     the SERP's own vocabulary, 50-60 chars, brand after a pipe. No
     dashes, no superlatives, no promises (Bar rules + Google spam).
   - Meta description: answer the query's next question, 140-160
     chars, includes the secondary query wordings.
   - H1 mirrors the title (Google checks consistency).
   - If several own pages split the family: give each ONE distinct
     sub-intent (cost page vs city page vs how-to page) and link all
     of them into the family's hub.
5. MESH: make sure the page is a spoke in its cluster (pillar links
   down, spoke links up, siblings cross-link) so its anchors carry the
   new query vocabulary sitewide.
6. FRESHNESS: if the query or the old title carries a year, render the
   CURRENT year via wp_date, never hardcode.
7. MEASURE: wait 2-4 weeks, re-pull GSC, keep winners, iterate losers.
   Do not change a winning title twice in one cycle.

## 4. Where it lives in this repo

- Title/meta/H1 overrides: inc/seo.php justice_theme_money_query_seo_map
  (+ justice_theme_year_fresh_seo_map for year tokens).
- Pillar titles: inc/cluster-pillar-titles.php.
- Taxonomy hubs: justice_theme_practice_area_seo_override in inc/seo.php.
- Internal mesh: inc/content-clusters.php (spokes list; the hub block
  and backlink block render from it automatically).
- The repeatable procedure: .claude/skills/serp-strike/SKILL.md.

## 5. Applied so far (2026-07-03)

Batch 1: 9 strike pages + 6 taxonomy hubs + directory head terms.
Batch 2: 10 more pages incl. tabu family, DUI refusal, money
laundering + year-freshness engine + 12 new mesh spokes.
Batch 3 (this doc's session): labor pillar consult vocabulary, criminal
offense types page, malpractice fee page de-cannibalized from the
pillar, lawyer-fees-guide year token.
