# Full-Site Content Rebuild Blueprint — jus-tice.co.il

Status: PROPOSED — awaiting owner approval. No live changes are part of this
document. Written 2026-07-13 after the owner asked for a researched,
practitioner-grounded plan to take the whole site (1,522 real content pages,
1,904 clicks / 330,207 impressions in 90 days) through a full content
optimization: audit, hierarchy, titles, de-cannibalization, competitor
alignment, and safe republication.

The research behind every claim here is cited inline. Practitioner sources
(forums, case studies with numbers, post-mortems) were prioritized over
theory, per the owner's explicit instruction.

---

## Part 1 — What the research says, verdict by verdict

### 1.1 "Delete everything and rebuild from scratch" — NO. Consolidate-and-rebuild — YES.

Every hands-on source that measured outcomes says the same thing:

- Deletion alone produces ~nothing on small/mid sites. RecipeLion deactivated
  1,156 thin articles (<10 pageviews in 2 years, <100 words): no measurable
  impact either way. DigitalMarketer redirected 950 old posts: no traffic
  lift. Andy Crestodina (Orbit Media): don't even bother pruning under
  ~10,000 pages; crawl budget is a non-issue at our size (per Google's Gary
  Illyes). [orbitmedia.com/blog/deleting-old-content]
- Where "mass removal" produced the famous wins, it was really
  consolidation + quality rebuild, not deletion: Seer's insurance client
  (-17.3% YoY → +23% in 6 months) removed 14k duplicate/low-value pages AS
  PART of a quality program; Belkins pruned 400 pages (~66% of site) of
  poor AI writing and went 3,000 → ~10,000 monthly organic visits; the
  5M-page programmatic platform (+160% visits) was an extreme-scale case.
  Glenn Gabe, who has run these recoveries for years: "It's never just
  nuking content. It's improving quality overall." [gsqi.com, ahrefs.com,
  seerinteractive.com]
- Blank-slate relaunches are the classic disaster pattern: a documented case
  went from 82% visibility to 18% in a year because URLs changed without
  redirects; a medical-niche business lost ~$200k of revenue the same way.
  [domaindesignagency.com, kcseopro.com, searchengineland.com]
- The one pattern that matches our exact situation — a site with a large
  mass of AI-produced pages, most with zero traffic — is the scaled-content
  recovery pattern: consolidate thin pages into a smaller number of
  comprehensive, expert-attributed guides, 301 the thin URLs into them,
  rebuild E-E-A-T. One health site recovered in 24 days doing exactly this
  (removed 120+ AI articles, added doctor-reviewed content).
  [digitalapplied.com, rankability.com]

VERDICT: the feeling of "reset" the owner wants is delivered by
consolidation: hundreds of the 1,522 URLs will disappear INTO stronger
pages via 301. But no URL with clicks, impressions, or backlinks is ever
deleted; nothing is removed without a mapped 301 or a deliberate 410; and
the strong URLs keep their addresses and get rebuilt in place.

### 1.2 Per-URL disposition rules (the industry-standard buckets)

Consensus framework across sources (Incremys, RankTraq, Ahrefs, Gabe,
searchengineland):

- KEEP-IMPROVE — any page with clicks or real impressions. Rewrite in
  place on the same URL. John Mueller: updates need ≥~30% substantive
  change to register; one dataset showed structural rewrites averaging
  +454% keyword growth vs +211% for medium updates and ~0 for cosmetic
  ones. [content-whale.com, 39celsius.com]
- MERGE — same-intent overlapping pages: strongest URL survives, best
  content from all merged in, losers 301 to the winner. Survivor chosen by
  backlinks + history + relevance (77% of ~800 polled SEOs: redirect, don't
  just delete). [seroundtable.com, wpmudev.com]
- REBUILD — pillar/money pages get full SERP-brief-driven flagship content
  on their existing URL.
- PRUNE-410 — ONLY: zero impressions over 12-16 months AND zero backlinks
  AND no cluster fit AND no user value. Research says this bucket is index
  hygiene, not a growth lever — keep it small and honest.
- NOINDEX — pages users need but search doesn't (internal tools, thin
  utility pages). [gsqi.com — Gabe's "quality indexation" principle]

Contrarian check (Phil Rozek, localvisibilitysystem.com): heavy pruning
usually backfires; weak pages are individual problems, not a site-wide
penalty; pages with "accidental rankings" are salvageable; prune
incrementally and measure. His warnings are encoded above: conservative
410 bucket, incremental waves, rehab-first.

### 1.3 Posts → Pages conversion — NOT WORTH IT

- Post type has zero inherent ranking effect. "Search engines do not give
  special preference to a page over a post just because of its type."
  [jetpack.com, blogpros.com, devrix.com]
- URL-level hierarchy is a bonus signal at best. John Mueller: "If you have
  a URL structure that doesn't have any subdirectories at all, Google will
  still see that structure based on the internal linking," and "internal
  linking is super critical for SEO." Practitioner guidance for EXISTING
  sites: virtual silos (internal linking + breadcrumbs) specifically to
  avoid URL changes that burn existing equity. [semrush.com/blog/silo-seo,
  surferseo.com/blog/seo-silo]
- Our `articles` CPT already renders at root level (jus-tice.co.il/slug/),
  identical URL shape to pages. Converting 1,211 posts buys nothing Google
  can see; the hierarchy the owner wants is delivered by the cluster map,
  breadcrumb schema, and internal-link architecture — with zero URL risk.

### 1.4 Title governance — the owner is RIGHT: reset to one source of truth

Current state: 5-6 independent render-time title filters (theme money-map,
cluster-pillar-titles, lawyer-rest-guards, ops SEO bridge, ops
strike-titles) override what's stored in the DB. Consequence already
witnessed: wp-admin shows one title, the live page another; nobody can
audit titles from the database; "title risk" is unmeasurable.

Reset plan (pure win, zero ranking risk at cutover):
1. For every page, compute the title that CURRENTLY RENDERS live.
2. Write it into the DB (post_title + Yoast title field).
3. Delete ALL render-time title filters in the same deploy (including
   strike-titles.php built this session).
4. Verify rendered output is byte-identical after cutover (live-verify).
5. From then on, titles change only deliberately, per the keyword map, in
   the DB, visible in wp-admin. One page = one title = one owner query.

### 1.5 One-shot vs waves — one BLUEPRINT, executed in cluster waves

- Big-bang is "the most common cause of catastrophic failure"; it's only
  safe when everything (redirect map, parity) is guaranteed at a single
  cutover. Phased migrations stabilize faster and let damage be detected
  while small. [eight25media.com, migration-center.com]
- Belkins' cadence for their 66% prune: one subfolder per week, measuring
  continuously. [ahrefs.com]
- Publishing hundreds of AI-produced pages simultaneously pattern-matches
  Google's scaled-content-abuse profile (March 2026 crackdown: 100% of
  deindexed sites showed spammy AI-content signals). Waves + real E-E-A-T
  attribution + fact-verification is the antidote. [digitalapplied.com]
- YMYL recovery timelines are long (6-12 months) when you get hit — so the
  strategy optimizes for never getting hit. Re-ranking after major
  overhauls often needs a core-update cycle (10-14 week windows).
  [searchengineland.com/guide/google-core-updates, almcorp.com]
- Expectation-setting: a WebmasterWorld case of a 500-page quality overhaul
  showed zero rank movement after 4 weeks (engagement improved first) —
  silence for weeks is NORMAL, not failure. [webmasterworld.com/google/4622675.htm]

VERDICT: one master control sheet approved once ("once and for all"), then
executed practice-area-cluster by practice-area-cluster (~10-14 waves,
10-60 pages each, 1-2 weeks monitoring between). Each wave is atomic: its
pillar, clusters, merges, 301s, internal links, and titles all land
together so a cluster is never half-built.

### 1.6 E-E-A-T for legal YMYL (2025-2026 practitioner consensus)

- E-E-A-T is now effectively per-page: one weak page suppresses itself; one
  strong page can rank on a mediocre site. Legal content should be authored
  or reviewed by a verifiable attorney entity (Knowledge-Graph-resolvable:
  registry + LinkedIn + consistent sameAs chains). AI-Overview citation
  share follows entity confidence. [ipullrank.com, leadgen-economy.com]
- Concretely for us: every rebuilt page carries Maya's author/reviewer
  entity (bar license number STILL PENDING from owner), links to primary
  law (wikisource/nevo/court decisions — our fact-verification workflow
  already does this), dateModified honesty, and Person/Attorney schema.

### 1.7 SERP/competitor gap analysis without paid tools

Standard no-cost workflow [12amagency.com, searchengineland.com,
semrush.com/blog/content-gap-analysis]:
- GSC 16-month query+page export = demand + current position per query.
- Manual top-10 teardown per money query on google.co.il (our serp-anatomy
  skill already encodes this): titles, first paragraphs, subtopics/entities,
  word counts, schema, EEAT signals.
- Autocomplete + People-Also-Ask + related searches = demand map and NEW
  page candidates ("discovering more page potential").
- Budget honesty: ~2-4 hours per money-page teardown; full competitive
  audit of a site this size = weeks. That is the real cost of doing it
  right, and it is what the owner asked for.

---

## Part 2 — The process, stage by stage

### Stage 0 — Freeze & snapshot (before anything moves)
- Export ALL 1,522 pages' full content + every SEO meta field into a
  timestamped archive committed to this repo (revision-independent backup;
  the malpractice incident proved WP revisions alone cannot be assumed).
- Owner/host-level DB backup confirmed.
- Write-path rule, permanent: every future content write goes through
  wp_update_post / REST so a WP revision ALWAYS exists. The direct-$wpdb
  path that bypassed revisions is banned.
- Rollback guarantee: pre-wave snapshot per page + revision + versioned
  redirect map file → any wave reversible in minutes.

### Stage 1 — Data gathering (where the info comes from)
1. GSC API: 16-month query+page dataset (not just 90 days). — HAVE ACCESS
2. Inventory CSV of all 1,522 pages. — DONE (2026-07-13)
3. Internal link graph extracted from post bodies (orphans, redirect-pointing
   links, anchor text). — CAN BUILD
4. Backlinks per URL: GSC UI "Links" report export. — NEEDS OWNER (the one
   dataset the API doesn't expose; UI steps will be provided). Without it,
   merge-survivor decisions lose their strongest signal.
5. Live SERP top-10 + autocomplete per money query (google.co.il, Hebrew).
6. Competitor set per practice area, derived from those SERPs (who actually
   ranks — not who we assume ranks).

### Stage 2 — Keyword & topic map (the brain of the rebuild)
- One primary query family per surviving URL + secondary queries + intent +
  role (pillar / cluster / support / tool / trust) + cluster assignment.
- Site tree: ~10-14 practice-area pillars → clusters (guides, calculators,
  tools, FAQ) → long-tail support. Max 3 clicks from home to anything.
- Cannibalization is eliminated ON PAPER here, before any writing: no two
  URLs share a primary query; head-term titles are unique site-wide.
- Gap output: list of queries with demand and no owning URL = NEW pages.

### Stage 3 — Disposition sheet (the "order them" step)
Extends the inventory CSV with: primary_query, intent, role, cluster,
action (KEEP-IMPROVE / MERGE→target / REBUILD / PRUNE-410 / NOINDEX),
merge_target, new_title, redirect_from[]. Rules from §1.2.
OWNER APPROVES THE SHEET BEFORE ANY EXECUTION. The sheet is the contract —
this is the "once and for all" moment.

### Stage 4 — Per-page briefs (money pages first)
serp-anatomy teardown per pillar query → brief: target length (set by what
actually ranks, not by feel), required subtopics/entities, schema, internal
links in/out, the ONE primary query, the exact title. Content substance
comes from the owner's Deep Research runs (he wants longer/stronger than
the malpractice piece); every legal claim passes the fact-verification
workflow against primary sources before publish. Engine choice (ChatGPT /
Gemini / other) is free — the brief and verification constrain quality, not
the engine brand.

### Stage 5 — Execution in waves (how it goes back up safely)
Per cluster wave, atomically: rebuilt pillar + clusters published; titles
and meta written INTO THE DB (post-title-governance reset per §1.4); 301s
for merged URLs; internal links updated so nothing points at a redirect;
sitemap regenerated; GSC URL-inspection on flagships; live-verify on every
touched URL. Then 1-2 weeks of GSC monitoring before the next wave.
Suggested wave 1: medical malpractice cluster — it structurally resolves
tonight's open items (original report → restored on an archive URL;
flagship content → the true pillar /medical-malpractice-lawyer/; the
account URL 301s or becomes a distinct-intent support page) as part of the
architecture instead of as a patch. Executes ONLY with the approved sheet.

### Stage 6 — Measurement & honesty
Per-wave GSC dashboard (impressions/clicks/position per touched URL),
monthly cannibalization re-scan, quarterly re-audit. Expectations in
writing: silence for the first weeks is normal; YMYL re-ranking is a
months-scale process across core-update cycles; anyone promising faster is
selling something.

---

## Part 3 — Open decisions for the owner
1. Approve the wave model (one blueprint, cluster waves) vs literal one-shot.
2. GSC UI backlink export (only dataset I cannot pull myself).
3. Confirm posts stay posts (no CPT conversion) given §1.3 evidence.
4. Title-governance reset (§1.4) — approve as Stage 0.5; it is independent
   of content and removes the wp-admin-vs-live lying permanently.
5. Content engine + Deep Research cadence per cluster (his runs feed Stage 4).
6. Maya's bar license number (blocks the E-E-A-T layer).
7. The AI-desk fallback removal remains a separate open item, unchanged,
   awaiting his call.

## Source index (research base, 2026-07-13)
Pruning/consolidation: orbitmedia.com/blog/deleting-old-content ·
gsqi.com/marketing-blog/remove-versus-improve-low-quality-thin-content ·
ahrefs.com/blog/content-pruning · seerinteractive.com (insurance case) ·
seo.ai/blog/content-pruning-case-study-cnet · goinflow.com pruning cases ·
localvisibilitysystem.com/2025/07/22/heavy-content-pruning-is-a-bad-move ·
seroundtable.com/seo-redirect-when-pruning-old-content-27413.html ·
searchengineland.com/guide/content-pruning-for-ai-search
Relaunch failures: domaindesignagency.com (82%→18% case) · kcseopro.com ·
searchengineland.com/website-redesign-avoid-seo-disaster-440169
Big-bang vs phased: eight25media.com/blog/phased-vs-big-bang-cms-migration ·
migration-center.com · digitalapplied.com/blog/seo-site-migration-2026
Rewrites: content-whale.com (454%/211% dataset) · 39celsius.com ·
wordai.com/blog/can-rewriting-my-content-improve-my-rankings
Cannibalization/merging: searchengineland.com/guide/keyword-cannibalization ·
yoast.com/keyword-cannibalization · semrush.com/blog/keyword-mapping ·
wpmudev.com/blog/seo-articles-301-redirects
Architecture: semrush.com/blog/silo-seo · surferseo.com/blog/seo-silo ·
legalbrandmarketing.com (legal site architecture) · susodigital.com
(law-firm +936% case)
Posts vs pages: jetpack.com · blogpros.com · devrix.com · wpbeginner.com
AI-content risk: digitalapplied.com/blog/scaled-content-abuse ·
rankability.com/data/does-google-penalize-ai-content ·
pravinkumar.co (what Google actually penalizes)
E-E-A-T/YMYL: ipullrank.com/eeat-ymyl-ai-search · leadgen-economy.com ·
frac.tl/author-bios-eeat
Recovery timelines: searchengineland.com/guide/google-core-updates ·
almcorp.com (Dec 2025 core update) · userp.io (HCU recovery times) ·
webmasterworld.com/google/4622675.htm (overhaul timeline thread)
Gap analysis: 12amagency.com/blog/how-to-do-a-manual-content-gap-analysis ·
searchengineland.com/build-ai-powered-content-gap-analysis-workflow ·
surferseo.com/blog/content-gap-analysis
