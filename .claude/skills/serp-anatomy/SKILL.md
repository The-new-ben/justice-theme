---
name: serp-anatomy
description: Full-page SERP reverse-engineering for a keyword family, from live data only: autocomplete demand map, top-10 composition per intent, verbatim teardown of the number-one pages (title, H1, first paragraph, schema, EEAT signals), why-Google-chose-them synthesis, and a gap plan against our own page. Use when asked to map, research, or analyze a SERP or keyword before deciding how to rank. Feeds the serp-strike skill with its targets.
---

# serp-anatomy: reverse-engineer a SERP before touching a page

Grounded in published method (sources at bottom) plus this repo's
tooling constraints. Everything is measured, nothing guessed. Output
always lands in project-control/serp-anatomy-<topic>-<YYYY-MM>.md.
Worked example: project-control/serp-anatomy-divorce-lawyer-2026-07.md.

## Environment facts (do not relearn)

- Google full SERP scrape is BLOCKED here: curl gets the enable-JS
  shell, WebFetch gets the same, and headless Chromium gets
  ERR_CONNECTION_RESET from the sandbox proxy. Do not burn time.
- What DOES work headless:
  - GSC exports in reports/gsc-live-*/: Google's own position and CTR
    telemetry per query. This is the ground truth for OUR standing.
  - Google autocomplete API (real demand data, no JS wall):
    https://suggestqueries.google.com/complete/search?client=firefox&hl=he&gl=il&q=...
  - WebSearch for the top-10 competitive set per query.
  - curl for competitor LANDING PAGES (verbatim title, H1, first
    paragraph, JSON-LD types, modified_time). WebFetch for narrative
    teardowns of structure and content.
- SERP FEATURES (ads, map pack, PAA boxes) are invisible to all our
  channels: ask the owner for incognito screenshots when local pack
  or PAA presence would change the play.

## Procedure

1. GSC family pull: every query containing the head tokens, sorted by
   impressions; note position and CTR per variant; total the family.
   Segment into intents (head, price, local, reputation, doc/template,
   how-to).
2. Autocomplete demand map: seed the head term plus prefixes (letter
   probes and question forms). New suggestions = demand Google itself
   completes toward. Flag suggestions with no matching page of ours.
3. Top-10 composition per intent (WebSearch): classify every result
   by the 3 C's (content TYPE: practitioner site, directory, article,
   platform; FORMAT: guide, price table, profile, list; ANGLE: years
   number, price transparency, negotiation-first). The composition IS
   the intent verdict: 10/10 practitioner sites means hire-a-person
   intent and an article cannot win there.
4. Number-one deep dive, verbatim via curl, for EACH intent's leader:
   - title tag and meta description (note when desc is MISSING and
     the page still wins: content and entity beat meta polish)
   - H1 (exact string; compare to title; note keyword-mirroring)
   - FIRST PARAGRAPH verbatim: winners mirror the query phrase early,
     state a statistic or concrete number, then promise the breakdown
   - JSON-LD @type inventory (Person, Organization, Article,
     BreadcrumbList, GeoCoordinates are the practitioner stack)
   - freshness: year token in H1 or title vs article:modified_time
   - EEAT audit per Google's rater criteria: named person, photo,
     years number, license, media proof, NAMED testimonials,
     quantified claims (8 out of 10 settle), address and phone
     (entity locality), author bio
5. WebFetch teardown of 3-5 more winners: heading map, word count
   band, tables and calculators, FAQ depth, CTA count and placement,
   internal-link density (winners in YMYL legal run 80+ topical links
   and 20+ service pages).
6. Our page, same teardown, same criteria. Produce a ranked gap
   table: what the SERP rewards that we lack, ordered by impact.
7. Synthesis: why Google chose each winner, stated as transferable
   rules (intent-format match, person-entity EEAT, topical
   exclusivity, quantified claims, freshness tokens, mesh depth).
8. Play sequence: order strikes by winnable-first (format matches we
   can produce, positions 4-25, snippet failures), ending with head
   terms that need practitioner-grade EEAT. Hand each strike to the
   serp-strike skill. Log the doc in project-control and the handoff.

## Hard rules inherited (owner law)

No em or en dashes. No AI-teller phrases. No superlatives or outcome
promises. Numbers only from real data (GSC, CMS, autocomplete,
verbatim competitor quotes). Never fabricate a SERP position: if a
channel is blocked, say so and use GSC telemetry instead.

## Sources that teach this method (verified 2026-07)

- Ahrefs, search intent and the 3 C's (content type, format, angle):
  https://ahrefs.com/blog/search-intent/
- Google, helpful-content self-assessment questions:
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google, E-E-A-T addition to the Search Quality Rater Guidelines:
  https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t
- Google, Search Quality Rater Guidelines overview (PQ and Needs Met):
  https://services.google.com/fh/files/misc/hsw-sqrg.pdf
- Text-only lift evidence (SearchPilot A/B tests and more):
  project-control/serp-text-signals-method-2026-07.md
