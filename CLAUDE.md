# Jus-Tice project standing rules

## E-E-A-T attribution law (owner order, 2026-07-14 — permanent)

WHO may be credited, and where:

| Content | Attribution | Notes |
|---|---|---|
| Family-law articles (divorce, custody, מזונות, הסכמי ממון...) | עו"ד מאיה רוטנברג | The ONLY practice area she is ever attributed on. She is a family-law lawyer cooperating with the site. |
| Every other practice area (malpractice, criminal, real estate...) | עו"ד בן בטש (the owner, a lawyer) as reviewer | Never Maya. |
| Tools, calculators, generators, automatic apps | "צוות Jus-Tice" (Justice Team) or nothing | Never a named lawyer on automatic tools. |
| Calculators / minor utility pages | Attribution OPTIONAL | A reviewer line is not a must on every page. |

PLACEMENT: attribution/reviewer lines go at the BOTTOM of the article,
never at the top. No license numbers "up front"; a license number may
appear only inside the bottom block.

TRUTH GATE: a "reviewed by" claim may appear only where review actually
happened. Schema (JSON-LD) must SAY THE SAME THING as the visible page —
never a different name in schema vs text, never reviewedBy on a page with
no visible reviewer. reviewedBy stays OFF site-wide (ops 2.18.1 kill
switch) until a real per-page review flow exists.

DO NOT build new attribution engines/injectors. Attribution is written in
the content itself per these rules. Every content prompt (run cards, war
prompts, factory manuals) must carry the correct per-area block.

## Content pipeline (standing, owner-confirmed)

Deep Research (owner's ChatGPT) writes raw mega-content from run cards
that embed: real Israeli SERPs (SerpApi), full competitor page corpus,
work order, link allowlist. Raw output lands as a WORDPRESS DRAFT titled
"RAW: RUN x — <name>" (Cowork pastes it via wp-admin in the browser, or
the owner drags the file to Claude Code). Engineering (Claude Code) takes
it from the draft: QA gauntlet, fact-verification of every TODO-VERIFY
against primary sources, no-AI-teller pass, benchmark against the attached
competitor corpus (must contain everything competitors/SERP cover, never
below their level), correct E-E-A-T block per the table above, then hold
for owner approval before publishing. Publication is wave-atomic per the
rebuild plan (project-control/rebuild-plan-2026-07/). EVERY article prompt
must pass the google-god-mode mandatory pass first (IL SERP + US signals +
competitor suck-down + dictated skeleton + entity map + anti-cannibalization
boundaries) - owner order 2026-07-15, see .claude/skills/google-god-mode.

## Design + skills laws (owner order 2026-07-16)

- The central private skills repo is github.com/The-new-ben/agent-skills
  (access per session via add_repo; stays private). After ANY change to
  .claude/skills/* here, run its tools/sync-from-repo.sh
  /home/user/justice-theme justice-theme and push - knowledge accumulates
  there for every future chat/agent.
- Design work runs under the owner's cross-project laws: god-mode
  (benchmark/QA/evidence/wide-spectrum) and aesthetic-ownership from
  nad-lan (ONE of everything, no stacked floating elements, judge every
  screenshot, a beautiful lie is a defect). Floating/fixed UI changes must
  pass .claude/skills/floating-elements-discipline; any text-over-photo
  hero must pass .claude/skills/hero-text-readability.

## Other standing laws (see project-control/ for full records)

- Never bypass the publication-safety gate or any safety mechanism.
- Loud failure over silent fallback: if an engine is down, the user sees
  an honest outage state, never a fabricated answer.
- Never report anything as live without verifying the RENDERED live page
  (live-verify skill). Owner browser cache: remind Ctrl+Shift+R.
- Titles/meta live in the DB (Yoast fields) — the single source of truth
  (wave 0). No render-time title engines.
- .env (WP app password, SerpApi key) is never committed and never printed.
- Theme deploys via owner pull; plugin ships via justice-ops (wp-deploy
  skill). Content writes must create revisions (wp_update_post/REST).
