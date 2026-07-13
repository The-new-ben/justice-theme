# WAVE 1 CONTENT FACTORY — Medical Malpractice Cluster, jus-tice.co.il
### (Run on ChatGPT 5.6 Sol, Work mode, Extra High, web search ON. Attach: `wave-1-malpractice-work-order.csv`, `D2-new-page-gaps.csv`, `R1-live-serp-benchmark-15-queries.csv`. This prompt produces PUBLISH-READY Hebrew content as a structured sheet.)

## 1. MISSION

You are the senior Hebrew legal-content team (strategist + attorney-editor + writer) producing the complete, final content for **Wave 1** of the jus-tice.co.il rebuild: the medical-malpractice cluster. Every page you produce must be engineered to compete for position 1-5 on google.co.il against the CURRENT live top-10 for its query — not "good content" in the abstract. An approved disposition plan already exists (attached); you write within it. Output is a machine-ingestible sheet that an engineering agent uploads via the WordPress API — exact fields, no prose around them.

## 2. SCOPE — exactly 33 content units

From `wave-1-malpractice-work-order.csv`:
- **25 REBUILD rows** — full new article per row, on the existing URL, for the row's `primary_query`, carrying the row's `new_title`.
- **4 MERGE winners** — for the 4 redirect pairs in the file, integrate any unique value of the loser page into the winner's new content (the winners are among the 25 or get an integration note).
- **4 GAP pages** from `D2-new-page-gaps.csv` (medical-malpractice rows: limitation periods, compensation, disability percentages/compensation, dental malpractice) — full new article each + proposed root-level Hebrew slug.
- **DO NOT produce**: the pillar `/medical-malpractice-lawyer/` and the 2022-report page (handled separately from existing verified assets), and the 18 NOINDEX rows (no content needed).

## 3. METHOD PER PAGE (repeat for every unit; browsing mandatory)

1. **Live SERP brief first.** Search the page's `primary_query` on google.co.il (Hebrew). Record: dominant intent and format (guide/service/tool/QA), the entities+subtopics the top pages cover, their approximate depth, their title patterns, People-Also-Ask questions. The brief decides structure and length — match the format that ranks, then exceed it.
2. **Information gain requirement.** Every page must contain at least 2 elements the current top-10 does NOT have, chosen from: identified Israeli case law with case numbers and outcomes; concrete שקל compensation figures from published rulings; step-by-step process with real deadlines; decision table or checklist; reference to our interactive tools (בודק עילה לרשלנות רפואית, מחשבון התיישנות, סימולציית משפט, קביעת פגישה) with their real on-site anchors; official-source data (משרד הבריאות, נתוני בתי המשפט). Name the elements in `information_gain` column.
3. **Legal accuracy rules — YMYL, non-negotiable.** Cite only statutes, sections and cases you can verify against official/primary sources during this run (nevo.co.il, wikisource, gov.il, court.gov.il, kolzchut.org.il). Every legal claim gets an inline source. If you cannot verify a fact you want to use, write `[TODO-VERIFY: <claim>]` instead of asserting it — a fact-verification pass runs after you. **Inventing case law = failed output.**
4. **E-E-A-T block.** Each article ends with: author/review attribution to עו"ד מיה רוטנברג (license number placeholder `[LICENSE]`), last-review date placeholder `[REVIEW-DATE]`, a sources list (linked), and the medical-legal boundary disclaimer.
5. **Structure.** H1 = row's title intent (may differ slightly from `<title>`; state it). H2/H3 hierarchy; short first paragraph that answers the query directly in 2-3 sentences (featured-snippet/AI-Overview ready); FAQ section with 3-6 real PAA questions; tables where data warrants. Hebrew, RTL, professional but plain — write to a worried client, not to a law journal.
6. **Internal links.** Per the cluster linking model: every cluster/support page links UP to the pillar `/medical-malpractice-lawyer/` with a descriptive Hebrew anchor, and to 2-4 sibling pages from this wave's list where contextually real. Provide them in `internal_links` as `anchor => /target-slug/` pairs. No links to NOINDEX or merged-away URLs.
7. **Length is an output of the brief, not a quota.** Procedural queries: complete but concise. Head informational queries: comprehensive (typically 2,500-5,000 Hebrew words if that's what the SERP demands). No padding, no repetition, no year-stuffing.

## 4. OUTPUT FORMAT — the sheet is the deliverable

Produce **one downloadable CSV (UTF-8)** `wave1-content.csv`, one row per unit, columns exactly:
`url` (existing URL or NEW:/proposed-slug/), `action`, `primary_query`, `title`, `meta_description`, `h1`, `content_html` (full article, clean semantic HTML: h2/h3/p/ul/ol/table/blockquote only, no inline styles/scripts), `faq_json` (array of {q,a} for FAQPage schema), `internal_links` (anchor=>target; one per line), `sources` (name + URL; one per line), `information_gain` (the named elements), `word_count`, `notes` (merge-integration or TODO-VERIFY summary).

- Never truncate `content_html`. If the file gets too large for one output, deliver `wave1-content-part1.csv`, `part2`, … until all 33 rows exist. Announce "PART k/N".
- Also produce a short chat summary: per-query SERP verdict table (query → format that ranks → our angle) and any places you deviated from the attached plan, with reasons. Deviations are allowed only with explicit reasoning; silent deviation = failed output.

## 5. QUALITY BAR / SELF-CHECK BEFORE FINAL OUTPUT

- Every row's `title` matches the work-order's `new_title` (or you flagged the deviation).
- Zero unsourced legal claims; zero invented citations; TODO-VERIFY used honestly.
- Every page passes the "so what" test: a reader in this situation knows what to do next after reading.
- First paragraph of every page directly answers the query (no "בעולם המודרני של היום" openers).
- Internal links resolve only to wave-1 survivor URLs or the pillar.
- The 4 merge winners explicitly absorbed the losers' unique value (`notes` says what was taken).
