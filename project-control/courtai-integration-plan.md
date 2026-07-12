# courtai (jus-tice.com) x jus-tice.co.il: integration and alliance plan

Date: 2026-07-12. Source: full deep-read of the courtai repo (added to the
session by owner order) plus live probes of the deployed app.

## What the system is

The React/Vite/Supabase platform deployed at jus-tice.com. The core product
the owner means by "the visual simulation" is HADMAIA / JURIS ARENA at
`/#/hadmaia` (src/juris-arena/): an agentic courtroom conference. A visitor
types one line, the engine generates a full cast (judge, lawyers, parties,
witnesses as realistic avatar tiles in a Zoom-style grid), runs an autonomous
multi-agent debate in realtime, lets the visitor talk 1:1 with any character,
vote, raise a hand, and even bring REAL humans into a LiveKit video room
inside the arena. Hebrew and English with full RTL; Hebrew voice via
ElevenLabs, English via browser speech. Anonymous, no login. Recordings can
be replayed via `?replay=<id>`.

Around it: lawyer-grade tools (source-locked Professional Mode, a paid
Hearing Readiness Memo, deadline engine, verdict lookup, skills scoring,
strategy panel) and practice management (CRM, matching, dashboards, intake,
RAG knowledge base) behind auth. 80 Supabase edge functions, Stripe present.

## Verified embed facts (probed live today)

- Purpose-built embed mode: `?embed=1` hides all chrome; `?domain=` presets
  the scenario type; postMessage `hadmaia:ready`/`hadmaia:resize`; a drop-in
  `embed.js` exists at jus-tice.com/embed.js.
- No X-Frame-Options and no CSP frame-ancestors anywhere: iframing works.
- A Groq model key IS baked into the deployed bundle (verified: `gsk_` hit
  in the production JS), so anonymous visitors get working AI without any
  key gate.
- The old "embed" on .co.il was only a LINK to one recorded channel in the
  theme tools strip (template-parts/redesign/ai-tools-strip.php:123). That
  is what the owner rejected as "not what I want".

## What shipped today (Phase 1, LIVE)

ops 2.11.x: `/legal-simulation/` on .co.il embeds the arena chrome-less,
full height, `domain=legal`, with honest Hebrew framing copy, a full-screen
escape hatch to jus-tice.com, disclaimer, homepage band link, nav-adjacent
discoverability via the tools layer, and a hand-written title/description
(strike map). Verified rendered: iframe present, title live.

## Risk flags for the owner (jus-tice.com side; not fixable from this repo)

1. CLIENT-SIDE MODEL KEY: the Groq key in the public bundle is extractable
   by anyone; abuse drains the owner's quota. Recommendation: remove
   VITE_GROQ_API_KEY from the build and let the app fall back to the
   `arena-llm-gateway` edge function (already built, key stays server-side).
2. INDEXING POSTURE: jus-tice.com robots.txt allows everything, but every
   path serves the same shell (canonical to root) and /sitemap.xml is 404.
   Decide: if the .com should rank in the US, add prerendered marketing
   routes + a sitemap; if not yet, keep as is (harmless for .co.il).
3. HashRouter URLs (`/#/hadmaia`) are invisible to crawlers; fine for an
   app, wrong for future .com SEO pages. Marketing pages should be real
   paths when the US SEO push starts.

## Phase 2: deep integration on .co.il (next ops cycles)

- Per-area presets: family/criminal/labor pillar pages embed the arena with
  a matching `?domain=` and a one-line "run this scenario" starter.
- Desk-to-arena handoff: after an AI-desk answer, offer "רוצים לראות איך
  טענה כזו נשמעת באולם? הריצו הדמיה" linking /legal-simulation/ with the
  visitor's one-liner passed through (arena supports intake text).
- Replay embeds in articles: notable recorded sessions (`?replay=`) embedded
  in matching guides as living examples.
- Monitor check: journey-monitor gains a `simulation` step (page 200 +
  iframe markup present).

## Phase 3: lawyer-side monetization bridge

- The arena's Professional Mode + Readiness Memo is a paid rehearsal tool:
  offer it as a perk/upsell to .co.il advertiser lawyers (they already pay
  for leads; rehearsal is a differentiated retention feature no Israeli
  directory offers).
- The lawyer-rankings index (prompt 6) carries an AI-adoption parameter that
  references arena/desk usage, making the two-site story visible in search.

## Phase 4: the alliance (owner strategy, agreed direction)

- jus-tice.co.il stays the Israeli SEO fortress (Hebrew, directory, guides,
  tools). jus-tice.com becomes the US/global product flagship (the demo the
  owner built: global court, professionals directory, workflows).
- Cross-brand: each site links the other as a product family ("Jus-Tice
  Israel" / "Jus-tice Global"), starting with the /legal-simulation/ page
  (done) and the ai-tools-for-lawyers pillar (prompt 5, in the factory).
- Lead exchange later: US-intent leads captured on .co.il (English queries,
  relocation/abroad pages) can route to .com workflows once .com has intake.
- Do NOT merge domains or duplicate content across them; two markets, two
  indexes, one brand system.

## Decision log

- 2026-07-12: Phase 1 shipped live same day as the deep-read. Direct iframe
  chosen over embed.js (no external script dependency; Autoptimize cannot
  break it; fixed responsive height acceptable for v1).
