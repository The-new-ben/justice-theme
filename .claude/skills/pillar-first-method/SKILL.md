---
name: pillar-first-method
description: The complete runbook for taking a jus-tice.co.il practice pillar to #1 on its money keyword. MANDATORY when working on any pillar page (רשלנות רפואית, גירושין, פלילי, מקרקעין, ירושה, עבודה, תעבורה, בנקאות, ביטוח לאומי) or when the owner says "next pillar". Encodes the owner's non-negotiable laws (no אינדקס in public copy, no em dashes, every-letter-counts titles, searcher-language folds), the real-SERP teardown procedure with SerpApi, the parity doctrine (same signals, honest sources, never fabricate), and the lock criteria. Born 2026-07-20 on the medical-malpractice pillar.
---

# pillar-first-method: one pillar, first place, then lock

Owner mandate, verbatim intent: "We are not leaving this page until it's
first. Same signals as the winners. Don't tell me we don't have experience,
we find a way, honestly. Every word, every letter counts. This becomes a
skill so we never explain from scratch again."

## The owner's laws (absolute, checked on every edit)

1. **Public copy NEVER says firms are "in our index/אינדקס/מאגר".** They did
   not consent to indexing; legal exposure. Say: "בדקנו ומצאנו שהם בין
   המובילים בתחום" / "נחשבים למובילים". The word אינדקס is banned from all
   customer-facing copy, labels and menus.
2. **No em dashes anywhere in public copy.** Use colon or comma. Check
   rendered HTML including aria-labels and sprintf strings.
3. **Titles: head phrase + real demand modifiers + brand. Zero invented
   task-words.** Winners write proof ("40 שנות ניסיון", "97% הצלחה"); we
   write demand terms from PASF/autocomplete (מומלץ first, then the top
   family terms like בלידה, שכר טרחה). NEVER decorative tails.
4. **The upper fold speaks the searcher's words, not ours.** No tool
   self-talk ("הבודק שלנו עובר איתכם"), no inventory brags ("39 מדריכים"),
   no process prose. Definition in searcher language + the PASF links.
5. **Every claim sourced from real data.** Real firm years from their own
   public profiles, real judgment sums with case numbers, real counts.
   AggregateRating only from actually-collected reviews. A beautiful lie is
   a defect and a legal risk.

## The teardown procedure (before touching the page)

1. **Get the real SERP, never a search-tool approximation.** Sources in
   priority order: owner's SERP screenshot; SerpApi (key in
   `C:\Users\pro\justice\.env` as SERPAPI_KEY; harness:
   `scratchpad/serp-pull.py`, google.co.il gl=il hl=he); never rank targets
   from WebSearch ordering (burned once: compared a page not on page 1).
2. **Pull the demand map**: Google autocomplete keyless
   (`suggestqueries.google.com/complete/search?client=chrome&hl=he&gl=il` —
   responses decode as **cp1255**, not utf-8) + the SERP's
   People-Also-Search-For. These terms are the gift: they structure title,
   fold links, H2 skeleton and spokes.
3. **Fetch top-3 raw HTML as Googlebot** (curl, Googlebot-smartphone UA;
   some sites 000 on bot UA — retry browser UA) and run the signal matrix:
   title/meta/H-tree; exact-phrase and family density (winners run ~3%,
   fold 12-20 hits); menu topology by practice (winners: 0-3 off-topic
   anchors — isolation is a ranking pattern, measured); trust numbers
   (years/%/sums/ratings); schema types (note: #1 can rank with ZERO
   schema — schema is hygiene, not the decider); tel/forms/images.
4. **US SERP check** (SerpApi gl=us, translated head): US patterns predict
   IL. Finding that anchors our whole model: US page 1 carries DIRECTORIES
   (Super Lawyers ×3, Justia ×2) with the exact formula
   "Best [practice] Attorneys in [City] | Brand" — and IL already confirms
   it: midrag #1 מקרקעין, lawreviews #1 ירושה, divorce1 #1 גירושין.
   Directory pages beat firm sites on מומלץ/best intents. We never say
   "we can't because we're not a firm".

## The rebuild sequence (executed on medical-malpractice, repeat exactly)

1. **Title** (Yoast field via one-shot snippet — REST meta is not
   writable): `[head phrase] מומלץ | [top-2 PASF terms] | Jus-Tice`.
2. **Fold**: one-sentence definition in searcher words → conversion H2
   mirroring #1's hook ("מה הסיכוי של התביעה שלכם? בדקו בחינם") → PASF
   links paragraph (subtopic spokes + city guides). Kill everything
   self-referential.
3. **Hero panel** = the PASF links themselves (config `quick_path` as
   {label,url} arrays in the practice route). Icon signal strips that don't
   carry the head phrase: `hide_signals => true`.
4. **Topic isolation**: route sets `$GLOBALS['justice_practice_scope']` =
   pure-family topics bar (7 spokes, all URLs verified 200 BEFORE shipping).
5. **Firms band**: template renders up to 6 real firm cards by
   `practice-areas` term (config `term_slug` — VERIFY the term slug against
   the taxonomy REST count first; burned once: config said 'inheritance'
   (6 items) while 122 firms lived under 'inheritance-law'). Band copy per
   law #1. Empty result = loud HTML marker, never silent collapse.
6. **Body H2 skeleton**: rewrite to the queries themselves (רשלנות רפואית
   בלידה, כמה פיצויים, שכר טרחה) — not clever self-referential headings.
7. **Trust blocks (the honest parity)**: real judgment sums with case
   numbers from the rulings library; firm strip carries the firms' own real
   years; reviewed-by attorney entity (name + license) on the page; images
   with exact-match alts. This is how a directory carries "experience"
   signals honestly: we aggregate the winners' proof.
8. **Schema hygiene**: dedupe FAQPage/WebSite, drop CollectionPage on
   routes, keep LegalService + FAQPage(13). Add Person when the
   reviewed-by entity ships.
9. **Verify rendered after every step** (curl, purge SeoEdge per URL
   first; browser screenshots die on this machine after scroll — one fresh
   Chrome tab per capture, top-anchored).
10. **Watch GSC weekly** (service-account JWT via openssl; Hebrew filters
    must be UTF-8 files via --data-binary, inline shell Hebrew returns
    empty) — position + CTR on the head family is the scoreboard.

## Parity techniques library (the "how they do it" the owner asked for)

Legit signal-replication, per the practitioner literature: content-format
parity + 10x (Backlinko/Ahrefs competitor-analysis method), link-gap
replication (domains linking to 2+ competitors), SERP-feature capture
(FAQ/snippet restructuring), entity SEO for E-E-A-T (Person/Organization
schema + sameAs + consistent NAP + digital PR mentions), hub-and-spoke
topical authority (dominate informational queries so money pages inherit),
barnacle placements (be listed where Google already trusts). For Jus-Tice
specifically: a real GBP for the company itself (legal-information service)
builds entity trust for brand queries — it will not enter the עורך-דין
local pack and must never pretend to be a law office. Red lines: no faked
reviews/ratings, no invented experience, no impersonating a firm.

## The 2026-07-21 hardening (born from the criminal-pillar failure)

6. **The parity gate is mandatory.** Run `python scripts/site-audit.py` (a
   READ-ONLY checker in the theme repo) before any "done" report. It grades
   every pillar for: firms band (unique, twin-deduped), map, reviewed-by,
   form depth, AI-tells, jargon, banned words, em dashes, stale years,
   dead/empty links. Exit 2 = you are not done. The changed page must never
   be the worst row.
7. **Upper-fold law, site-wide.** Booking form, firms band and map belong
   before the article body on EVERY content page, not only pillars. The
   cinema map lazy-loads near the viewport, so it never blocks reading.
8. **No AI-tells.** Research what ChatGPT-style filler looks like in Hebrew
   and never write it: "במדריך זה", "אנו נסקור", "חשוב לציין", "לסיכום",
   "בעידן המודרני", "יתרה מכך", "מגוון רחב של" and the rest of the list in
   site-audit.py. Winners open with the searcher's situation, not with meta
   prose about the guide.
9. **Never noindex a content article.** Not a decision the agent may make,
   ever. Thin pages get ENRICHED (band, map, pillar link), not hidden.
10. **No self-firing content engines, ever.** All four legacy engines were
    deleted 2026-07-21 (guard, importer, seeder, auto-publisher). Quality
    enforcement is read-only checkers; content changes are explicit,
    reviewed, revision-backed one-shots.
11. **Every verification ends with a real screenshot.** Server-side greps
    are necessary but not sufficient; the owner sees pixels.

## Rollout order and lock criteria

רשלנות רפואית (current) → גירושין/משפחה → פלילי → מקרקעין → ירושה →
עבודה → נזיקין → תעבורה → בנקאות ומימון → ביטוח לאומי.
A pillar is LOCKED when: teardown file committed to
`.project-control/seo/`, all 10 rebuild steps rendered-verified, and two
consecutive weekly GSC reads show the head family climbing. Until lock, the
pillar stays the active work item — "we are not leaving the page".
