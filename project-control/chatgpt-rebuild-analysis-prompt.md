# FULL-SITE SEO REBUILD ANALYSIS — jus-tice.co.il
### (Run on ChatGPT 5.6 Pro Extended, with Web Browsing AND Code/Data-Analysis tools enabled. Attach the 4-5 data files listed in §3 before sending.)

---

## 1. MISSION

You are acting as a principal-level SEO strategist and data analyst engaged to produce the **definitive, per-URL content-rebuild decision plan** for **jus-tice.co.il** — an Israeli legal-services website (Hebrew, RTL, market = google.co.il, YMYL legal niche). You have the site's complete real data attached. Your job is to analyze it and deliver **decisions, not options**: exactly what to do with every one of the 1,522 content pages, in what order, with what titles, in what hierarchy — so the site can be rebuilt without destroying what equity remains.

You must ground every methodological claim in either (a) the attached data (cite file + column + value) or (b) a cited external source per §5. Do not answer from generic memory.

## 2. THE SITE & SITUATION (all numbers are real, from Google Search Console API and the WordPress database)

- 1,522 published content pages: 1,211 posts of custom type "articles", 293 pages, 18 posts. All render at root-level URLs (`https://jus-tice.co.il/slug/`) regardless of post type.
- Content is largely AI-assisted, in Hebrew, across legal practice areas (family/divorce, criminal, medical malpractice, traffic, real estate, Portuguese citizenship, inheritance/wills, labor, torts/personal injury, debt execution, and more — the definitive list must come from the `practice_area` column plus your query-family analysis, not from this sentence).
- The site also hosts real interactive tools (court-simulation arena, malpractice claim-checker, meeting scheduler, legal-fee calculators) — pages of role "tool" exist and convert; do not treat them as thin content.
- Named attorney entity for E-E-A-T: Adv. Maya Rotenberg (author/reviewer bylines exist; bar-license verification is being added).
- **Traffic history (site-wide, from GSC daily data — also attached in full):**

| Month | Clicks | Impressions |
|---|---|---|
| 2025-03 | 1,928 | 271,878 |
| 2025-04 | 4,924 | 833,307 |
| 2025-05 | 6,096 | 1,036,914 |
| 2025-06 | 4,209 | 899,177 |
| 2025-07 | 4,505 | 993,981 |
| 2025-08 | 4,239 | 1,079,939 |
| 2025-09 | 1,825 | 361,023 |
| 2025-10 | 1,025 | 120,239 |
| 2025-11 | 1,043 | 115,769 |
| 2025-12 | 769 | 99,922 |
| 2026-01 | 261 | 40,847 |
| 2026-02 | 250 | 36,461 |
| 2026-03 | 173 | 29,098 |
| 2026-04 | 103 | 14,477 |
| 2026-05 | 496 | 70,623 |
| 2026-06 | 1,322 | 213,952 |
| 2026-07 (13 days) | 358 | 68,184 |

  Read this carefully: peak ~6,100 clicks/month (May 2025), a **cliff starting September 2025**, decay to near-death April 2026, partial recovery since May 2026. Diagnosing WHAT hit the site in Sept-Oct 2025 (and what the continued decay through April 2026 was) is deliverable D0.
- Current 90-day tier breakdown of all 1,522 pages: 103 pages with ≥5 clicks; 346 with 1-4 clicks; 416 seen-never-clicked; 483 under 20 impressions; 174 with zero impressions.
- Known incidents you must design around:
  1. `/medical-malpractice-lawyer/` is the topical pillar for רשלנות רפואית, but a new flagship-quality article (checker app embedded, ~15k+ words) currently sits on `/medical-malpractice-lawsuits-law-account/` — a URL whose ORIGINAL content (a 2022 inter-ministerial government report on malpractice-claim expenditure, 776k characters) is preserved and can be restored to an archive URL. The two URLs' titles currently target the same head term. Resolve this head-to-head explicitly in D3.
  2. Known internal duplicate sets: two Portuguese-citizenship/real-estate URL pairs, four divorce-fee pages, seven traffic-law pages, a criminal-fee pair. Find the rest yourself in the query-page file.
  3. Titles historically came from multiple render-time code filters, so `title_db` and `yoast_title_override` in the inventory may both differ from what Google saw. A one-source-of-truth reset is planned: **the `new_title` values you output will become the database truth.** Treat title design as high-stakes.
- An internal blueprint already exists and reached: consolidation-over-deletion, execution in cluster waves, title governance reset, no post-type conversion, no URL changes for surviving pages. **You are the second, independent brain: where your data analysis disagrees with any constraint or framing here, say so explicitly in D6 with evidence — do not silently comply, and do not silently rebel.**

## 3. ATTACHED FILES (read ALL with your code tool before deciding anything; all CSVs are UTF-8-with-BOM, Hebrew text throughout)

1. **`jus-tice-full-site-inventory.csv`** — all 1,522 content pages. Columns: `tier` (traffic tier as above), `id` (WordPress post ID), `type` (articles/page/post), `url`, `title_db` (title stored in DB), `yoast_title_override` (SEO-plugin title field if set), `meta_description`, `practice_area` (taxonomy terms), `word_count_est`, `created`, `last_modified`, `impressions_90d`, `clicks_90d`, `avg_position` (90-day).
2. **`gsc-query-page-16mo.csv`** — Search Console, last 16 months, top 25,000 query×page pairs (API cap; sorted by clicks). Columns: `query` (Hebrew), `page` (path), `clicks`, `impressions`, `ctr_pct`, `position`. **This is the keyword-mapping backbone**: 16,162 distinct queries; 4,276 queries where ≥2 of our URLs both received impressions (the cannibalization surface).
3. **`gsc-page-16mo.csv`** — per-URL 16-month lifetime totals (2,799 URLs incl. dead/redirected ones). Columns: `page`, `clicks`, `impressions`, `ctr_pct`, `position`. Use for prune-threshold decisions: a page with ~0 impressions across 16 months is provably invisible, not merely young.
4. **`gsc-daily-16mo.csv`** — site-wide daily clicks/impressions/CTR/position, 478 days. Use for D0 collapse dating.
5. *(Optional, if attached)* **GSC Links export** ("most linked pages"). Any URL in it must never be pruned; merge losers with backlinks must 301. If this file is absent, flag every PRUNE/MERGE decision as "pending backlink check" in the rationale column rather than assuming zero backlinks.

## 4. DELIVERABLES

- **D0 — Collapse diagnosis.** Date the September-2025 cliff precisely from the daily file; correlate against the documented Google update timeline (browse for it: core updates, spam updates, site-reputation/scaled-content enforcement 2025-2026); state the most probable cause(s) with confidence levels, what the continued decay through April 2026 implies, and what the May-June 2026 partial recovery implies. This diagnosis must shape everything downstream (a scaled-content/quality suppression is fixed by consolidation + E-E-A-T, not by more publishing).
- **D1 — Full disposition table, ALL 1,522 URLs.** Produce with your code tool as a **downloadable CSV** (never truncate; show only a top-100 priority table in chat). Keep every inventory column and ADD: `action` ∈ {KEEP-IMPROVE, REBUILD, MERGE, PRUNE-410, NOINDEX}; `merge_target_url`; `primary_query` (Hebrew); `secondary_queries` (Hebrew, ≤5, ;-separated); `intent` ∈ {hire-lawyer, informational-guide, template/tool, cost/fees, trust/about, local}; `cluster_id`; `role` ∈ {pillar, cluster, support, tool, trust}; `priority_wave` (integer, 1 = first); `new_title` (Hebrew, ≤60 chars — required for every KEEP-IMPROVE/REBUILD page, minimum top 300 by priority); `new_meta_description` (Hebrew, ≤155 chars, same coverage); `rationale` (≤15 words, English, citing the deciding data).
- **D2 — Site hierarchy tree.** Practice-area pillars (derive the count from the data; expect ~8-14) → clusters → support/tool pages; every surviving URL assigned. Plus a **new-pages gap list**: queries with demonstrated demand (in file 2 and/or your live SERP checks) that no surviving URL owns — query, intent, proposed Hebrew slug, proposed title, priority.
- **D3 — Cannibalization resolution table.** Every query family with ≥2 competing URLs: family head term, competing URLs with their clicks/impressions/position, the designated winner, action per loser (merge/301/differentiate with new primary query). Include the explicit malpractice pillar-vs-article resolution and URL-level plan (which URL carries the flagship content, where the 2022 report lives, what 301s where).
- **D4 — Title governance system.** Formula per page role (pillar/cluster/tool/fees...), head-term uniqueness rule (no two pages lead with the same head term — prove uniqueness across all titles you propose with a code check), year-token policy (when a year in the title helps vs hurts in Hebrew legal SERPs), and length/brand-suffix policy.
- **D5 — Execution wave plan.** Ordered waves (each = one topical cluster, ≤60 changed pages): what ships together (rebuilt content, merges, 301s, internal-link updates, titles), entry criteria, exit criteria (what GSC metrics must look like before the next wave), monitoring checklist, rollback triggers. Recommend which cluster is Wave 1 and justify from the data.
- **D6 — Risk memo + dissent.** Top 10 ways this plan could damage the site, each with mitigation — must cover: scaled-content-abuse exposure (mass AI republishing), YMYL E-E-A-T requirements for legal content per 2025-2026 evidence, redirect-map errors, title-change ranking flux, and the risk of pruning pages whose value the data can't see (backlinks, navigation, brand). Plus your explicit disagreements with §2/§6 framing, if any, with evidence.
- **D7 — Executive summary.** One page, plain language, imperative: do this, then this. A non-SEO reader must be able to follow it.
- **D8 — Source list.** Check ≥40 sources, cite ≥25 actually used. ≥60% must be hands-on practitioner material from 2023-2026: case studies with numbers, named consultants' recovery write-ups, forum post-mortems (Reddit r/SEO, r/bigseo, r/TechSEO, WebmasterWorld, X threads). Google's official docs allowed as baseline but must not dominate.

## 5. REQUIRED LIVE WEB RESEARCH (do not skip; browsing is mandatory)

- **R1 — Live SERP teardown, google.co.il, Hebrew.** For at least these 15 seed head-queries (extend the list to any pillar you define that isn't covered): עורך דין רשלנות רפואית · רשלנות רפואית · עורך דין גירושין · הסכם גירושין · עורך דין פלילי · מחיקת רישום פלילי · תעודת יושר · עורך דין תעבורה · עורך דין מקרקעין · אזרחות פורטוגלית · עורך דין ירושה · צוואה · עורך דין תאונות דרכים · חוזה שכירות · עורך דין דיני עבודה. For each: who is in the top 10 (domains), what content type ranks (pillar page / long guide / directory / firm homepage), approximate depth/structure, title patterns. Feed the findings into the affected clusters' dispositions, briefs baseline (what length/structure it actually takes to rank), and the gap list.
- **R2 — Competitor profiles.** The 5-8 Israeli legal domains recurring across R1 SERPs: their architecture (how they structure practice areas), scale, and what they do that we don't.
- **R3 — Policy verification.** Verify current (2025-2026) state of: Google core-update timeline (for D0), scaled-content-abuse enforcement, YMYL/E-E-A-T expectations for legal, and site-recovery timelines — from primary sources + reputable practitioner analyses.

## 6. HARD CONSTRAINTS (violating any = failed output; check compliance in M8)

- **C1.** No blank-slate proposals: never "delete the site / start a fresh domain / mass-delete and republish."
- **C2.** Any URL with clicks > 0 (16mo) OR impressions ≥ 50 (16mo) OR known backlinks → action must be KEEP-IMPROVE, REBUILD, or MERGE-as-winner. Exception: a same-intent duplicate may MERGE-as-loser into a clearly stronger winner (state the strength evidence in rationale).
- **C3.** Every MERGE loser 301s directly to its winner (no chains); every winner is itself KEEP-IMPROVE or REBUILD.
- **C4.** PRUNE-410 only if ALL hold: ~0 impressions across 16 months AND no backlinks AND no cluster fit AND no user/navigation value. When uncertain → NOINDEX or MERGE, never PRUNE. Deletion is index hygiene, not a growth lever — do not build the plan around it.
- **C5.** Surviving pages keep their exact URLs. Hierarchy is expressed by internal linking + breadcrumbs, not URL moves. No post-type conversion. (Already evaluated: post type has no ranking effect; URL changes are pure risk here.)
- **C6.** One primary query per URL; no two URLs share a primary query; no two titles lead with the same head term.
- **C7.** All queries/titles/meta in Hebrew exactly as searched (verify phrasing against live autocomplete/SERPs when uncertain — e.g., עו"ד vs עורך דין variants, ו/ה/ל/ב prefixes, singular/plural are one family). Analysis prose in English.
- **C8.** Wave-based execution only; nothing may assume >60 changed pages land in one step.
- **C9.** Every "Google does X" claim carries a 2023-2026 citation; every non-obvious per-URL call cites the deciding data in `rationale`.
- **C10.** Every KEEP-IMPROVE/REBUILD content brief assumes attorney author/review attribution + citations to primary Israeli law (חקיקה/פסיקה) — YMYL is not optional.

## 7. METHOD (work in this order, using the code tool for every data step)

1. **M1** Load and profile all files: row counts, joins (inventory↔page-16mo on path), histograms by tier/type/practice_area; list data-quality issues found.
2. **M2** D0 collapse dating from the daily file (changepoint detection or clear before/after windows) + update-timeline correlation from R3.
3. **M3** Build Hebrew query families from file 2 (normalize variants per C7); compute per-family: total demand, our best URL, all competing URLs.
4. **M4** Cannibalization scan → D3 (include severity: position gap <3 and impression ratio >0.5 = high).
5. **M5** Assign primary query, role, cluster per URL → D2 hierarchy; derive the gap list.
6. **M6** Disposition per URL per §6 → D1. Reconcile: the five action counts must sum to exactly 1,522 — print the histogram.
7. **M7** Titles (D4) with programmatic uniqueness proof; waves (D5); risks (D6).
8. **M8** Self-audit pass: re-verify C1-C10 against your own outputs with code where possible (no chains, no shared primary queries, action sum, C2 violations); list what you found and fixed. Only then produce final deliverables.

## 8. OUTPUT FORMAT

- Deliver D1 (and D2/D3 if large) as **downloadable files**; D0, D5-D8 as structured chat text. If your environment cannot attach files, emit D1 as sequential numbered CSV code blocks covering all 1,522 rows — say "BATCH k/N" and continue until complete. **Never silently truncate.**
- Straight answers. No hedging, no "you might consider." Where data is insufficient, decide anyway and prefix the rationale with `ASSUMPTION:` plus what evidence would flip the call.
- Your output will be machine-checked against §6 and then executed wave-by-wave by an engineering agent with WordPress and Search Console API access; write for that pipeline: exact URLs, exact Hebrew titles, exact redirect pairs.
