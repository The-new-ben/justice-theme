---
name: google-god-mode
description: Become Google for a target page and its query family. Owner law (2026-07-14): before and after any ranking-critical change, crawl the RENDERED page like Googlebot (mobile-first), score it like the Quality Rater Guidelines, benchmark the live Israeli AND US SERPs, map every relevance gap (content, above-the-fold, structure, internal world), fix within lanes, and never declare victory without rendered proof. Use when asked to rank a page, publish content that must rank, audit "why aren't we first", or build out a topic world around a pillar.
---

# google-god-mode: think like Google, judge like a rater, land like a user

Owner order, verbatim intent: "You become Google, and you think you check
like a spider through the page, and you see it as relevancy, as Google...
map the gap what you as Google would like to see... Google wants the user
to land on relevant text... it has to be a whole world. We must be first."

Born from a real failure this skill exists to prevent: the pillar passed
every HTML-probe check (title, H1, strings present) while REAL users and
Googlebot landed on a white void — the hero text rendered white-on-white
because a later stylesheet killed the section background. curl said
"live"; the rendered page said "empty". HTML probes are necessary, never
sufficient.

## The five passes (run in order; each produces evidence, not vibes)

### PASS 1 — Spider the rendered page (mobile-first, like Googlebot)
1. Fetch the live URL fresh (cache-busted) AND render it. In-container:
   Playwright with executablePath '/opt/pw-browsers/chromium' +
   `--no-sandbox`; the proxy blocks Chromium's network, so build a file://
   harness from production-fetched HTML/CSS/JS when needed. Set a mobile
   viewport (390x844) — Google indexes MOBILE-first. If rendering is
   impossible, statically trace the CSS cascade for every above-the-fold
   element (what background, what color, computed order of stylesheets)
   and say explicitly that visual QA was static.
2. Above-the-fold audit, first three viewports: what text is VISIBLE and
   readable (contrast, not just present in DOM)? Where does the first
   paragraph that answers the query appear — viewport 1 or viewport 4?
   Screenshot or computed-style evidence, saved to the record.
3. DOM-order audit: main content must come before template chrome
   (related boxes, lead forms, CTA bands) inside the content region.
   Google reads DOM order; users read visual order; both must lead with
   relevance.
4. Contrast traps checklist (each burned us once): section background
   overridden at equal specificity by a later file; light text over
   transparent; headings inheriting dark-on-dark inside dark cards;
   tables wider than the mobile viewport with no overflow scroll;
   floating widgets (WhatsApp/chat/a11y) covering content.

### PASS 2 — Score like the Quality Rater Guidelines
For the target query, answer in writing:
- Needs Met: does the landing text answer the dominant intent within the
  first visible screen? Is there an answer-first block under the H1?
- Page Quality: E-E-A-T block present per CLAUDE.md law (right person,
  bottom placement, no false claims); visible effort/originality (tables,
  verified numbers, tools) vs competitor boilerplate.
- Trust: every legal claim sourced or TODO-VERIFIED away; no invented
  case numbers; schema says exactly what the visible page says.

### PASS 3 — Benchmark the SERPs (Israel AND abroad)
1. Israeli SERP via SerpApi (google.co.il, gl=il, hl=he) for the head
   query + the family. Who ranks 1-5, what page TYPE (firm page, guide,
   directory, gov), their word counts, their above-the-fold answer.
2. US SERP (gl=us) for the translated head term — Google benchmarks
   patterns abroad; PAA there predicts IL PAA six months out. Mirror the
   winning answer blocks, adapted and verified for Israeli law.
3. Corpus check: our page must contain everything the top corpus covers
   (coverage map, no topic below their level) plus information gain they
   don't have. List missing subtopics BY NAME with evidence.

### PASS 4 — Map the world (the pillar is a capital city, not an island)
- Every head-term pillar needs its orbit: spokes per sub-intent, a
  reference layer (laws, rulings, sources — imported primary material
  with added structure, like Wikipedia with everything inside), tools,
  and internal links BOTH directions with descriptive anchors.
- Gap map deliverable: table of [need | exists? | where | action],
  covering content gaps, reference gaps (which laws/verdicts should be
  importable pages), tool gaps, and wiring gaps (orphan spokes, missing
  pillar->spoke links).
- Anti-cannibalization law stands: one query = one page; reference pages
  target reference intents, never the money query.

### PASS 5 — Fix, verify, prove
- Fix within lanes: content edits via REST (revision-safe, gate-clean);
  CSS/JS via justice-ops deploy (wp-deploy skill); theme templates via
  repo commit for owner pull; titles/meta in the DB (Yoast fields) only.
- After every fix: re-run PASS 1 on the rendered result + live-verify
  skill rules (fresh fetch, purge first, remind owner Ctrl+Shift+R).
- Report format: what Google saw before, what it sees now, evidence
  (screenshots/computed styles/probe strings), what remains blocked and
  on whom.

## MANDATORY for every article (owner order, 2026-07-15)

No article gets written, prompted, or published on this site without this
pass. Not by Claude, not by ChatGPT, not by anyone. A run card or content
prompt that skips any item below is invalid:

1. **Real Israeli SERP pulled** (SerpApi, google.co.il, gl=il hl=he) for
   the primary query: who ranks 1-10, page types, PAA questions.
2. **US SERP signals pulled** (gl=us) for the translated query: PAA there
   predicts Israeli demand; adapt, verify for Israeli law, never copy.
3. **Competitor suck-down**: crawl the ranking pages themselves. Extract
   full heading outlines, word counts, first paragraphs. The prompt embeds
   this teardown, per competitor, with what wins and what's missing. Never
   tell the writer "go research" - hand it the battlefield.
4. **Skeleton dictated in the prompt**: the full H2/H3 map is DESIGNED from
   the SERP+corpus evidence and written into the prompt with per-section
   orders (what to cover, target length, tables, links). The writer fills
   a designed structure; it does not invent one.
5. **First-paragraph engineering**: exact spec in the prompt - the query
   phrase early, a direct answer to the dominant intent in 2-4 sentences,
   a concrete value promise, zero superlatives.
6. **Entity/synonym map in the prompt**: the terms Google expects on a
   relevant page (synonyms, related entities, statute names, institution
   names), to be used naturally.
7. **Anti-cannibalization boundaries in the prompt**: the queries owned by
   OTHER pages on this site, each marked "one paragraph + link only, never
   a full section here". One query = one page, forever.
8. **Style law embedded**: no em/en dashes, no AI-teller phrases,
   TODO-VERIFY for every unverified fact, answer-first blocks, allowed-tag
   whitelist, closed internal-link allowlist.
9. **Output contract**: exact deliverable format + manifest, so QA is
   mechanical.

## Standing laws that bind every pass
- Never bypass the publication-safety gate; drafts for anything unproven.
- Truth gate: verified facts or nothing; unverifiable claims get removed,
  not softened into weasel words.
- Attribution per CLAUDE.md table (Ben everywhere except family = Maya,
  tools = team/none, bottom placement, schema == visible text).
- Loud failure: if a pass cannot run (no browser, no SerpApi credits),
  say so in the record; never fake a green check.
