# CourtAI juris-arena port into the gated AI tools app

Date: 2026-07-02. Source repo: github.com/The-new-ben/courtai (now public).

## Why a port and not an embed

courtai is a full React 18 + Supabase + Express platform with no live
deployment (README references localhost only). Embedding the actual app
requires its own hosting project: Vite build, Supabase project + keys,
Express/Netlify functions. Additionally this session's sandbox blocks
git/API downloads outside justice-theme (page-level reads via web fetch
only), so a faithful code import was not possible from here.

## What was ported (protocol-faithful)

Mapped from src/juris-arena/engine as read from the public repo:

| courtai engine file | port in legal-tools-app.js |
|---|---|
| ArenaTrialProtocolEngine.ts | court-arena order of proceedings: opening -> plaintiff case -> defense case -> closings -> ruling; direct exam = open-ended, cross = leading yes/no |
| ArenaDebateEngine.ts | transcript format with per-role turns of 2-4 sentences, judge rules strictly on the evidence, Hebrew enforcement |
| ArenaCaseDocket.ts | docket sheet in the free template |
| Evidence protocol (Upgrade 8) | exhibit labels (P-1 / ת/1) with admission status |
| Goal trees (Upgrade 9) | per-side victory conditions section |
| CaseStrengthAnalyzer.ts | post-ruling strength analysis section |
| ContradictionDetector.ts | contradictions-detected section |

One AI call per simulation (the whole staged transcript in one
generation) to respect the mu-plugin cost guards (3 calls per IP per
day, site daily spend cap).

## When courtai deploys for real

Swap path: point the court-arena tool card and the article-mesh link at
the deployed courtai URL (or embed its ArenaShell via iframe) and retire
the single-call transcript. The lead-gate should stay in front.
