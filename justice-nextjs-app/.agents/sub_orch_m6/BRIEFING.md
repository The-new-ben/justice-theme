# BRIEFING — 2026-06-09T00:15:00+03:00

## Mission
Implement Milestone 6 (E-E-A-T Advisory Board UI & dynamic schema integration) including the index page, practice areas page integration, dynamic JSON-LD reviewedBy schemas, premium UI components, and copywriting compliance.

## 🔒 My Identity
- Archetype: teamwork_preview_orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m6
- Original parent: Project Orchestrator
- Original parent conversation ID: dbcb0972-f636-4179-a0b3-205a3c8d6037

## 🔒 My Workflow
- **Pattern**: Project / Iteration Loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor)
- **Scope document**: c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m6\SCOPE.md
1. **Decompose**: Decompose the implementation into distinct files and modules to touch (index page, components, hub/spoke page schema upgrades, and validation).
2. **Dispatch & Execute**:
   - **Direct (iteration loop)**: Iterate: Explorer → Worker → Reviewer → Challenger → Auditor -> gate.
   - **Delegate (sub-orchestrator)**: None (Milestone 6 is small enough for direct iteration loop).
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Self-succeed at 16 spawns. Write handoff.md, spawn successor, and exit.
- **Work items**:
  1. Setup configuration files [done]
  2. Perform initial exploration of existing code [pending]
  3. Execute implementation iteration loop [pending]
  4. Run E2E tests and verify [pending]
- **Current phase**: 1
- **Current focus**: Setup and explore

## 🔒 Key Constraints
- DO NOT CHEAT: All implementations must be genuine.
- Never write, modify, or create source code files directly as the orchestrator.
- Do not reuse a subagent after it has delivered its handoff — always spawn fresh.
- UI must match premium glassmorphism/Apple-style light theme design patterns.
- Hebrew compliance copywriting rules: no em-dashes `—` (use normal punctuation), no AI transition patterns, and active voice.

## Current Parent
- Conversation ID: dbcb0972-f636-4179-a0b3-205a3c8d6037
- Updated: not yet

## Key Decisions Made
- [TBD]

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_m6 | teamwork_preview_explorer | Codebase exploration and E-E-A-T analysis | completed | 76872ce4-bfa7-41be-a641-f646ec88ae4e |
| worker_m6 | teamwork_preview_worker | Implement E-E-A-T Advisory Board UI and Schema integration | completed | e70c787d-b540-4c8e-9bff-11cdc2d92246 |
| reviewer_m6_1 | teamwork_preview_reviewer | Code correctness, Apple theme styling and E2E verification | in-progress | 168856a7-1e27-47d6-9bdf-87ecb4adabd0 |
| reviewer_m6_2 | teamwork_preview_reviewer | E-E-A-T schemas, copywriting rules and linter check | in-progress | 92324fda-9fb8-443a-ac9c-ba7af9010021 |
| challenger_m6_1 | teamwork_preview_challenger | Build, E2E test, and edge condition verification | in-progress | 5c29a497-cf60-41ca-8bbe-442e21473d96 |
| challenger_m6_2 | teamwork_preview_challenger | Sitemap and redirects stress testing | in-progress | bd731fa0-1df2-4fb1-97ae-479d458f66bc |
| auditor_m6 | teamwork_preview_auditor | Forensic integrity audit to detect hardcoding or dummy code | in-progress | ccbb7873-35a8-4346-9a03-97fad862833f |

## Succession Status
- Succession required: no
- Spawn count: 7 / 16
- Pending subagents: 168856a7-1e27-47d6-9bdf-87ecb4adabd0, 92324fda-9fb8-443a-ac9c-ba7af9010021, 5c29a497-cf60-41ca-8bbe-442e21473d96, bd731fa0-1df2-4fb1-97ae-479d458f66bc, ccbb7873-35a8-4346-9a03-97fad862833f
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: task-15
- Safety timer: none
- On succession: kill all timers before spawning successor
- On context truncation: run manage_task(Action="list") — re-create if missing

## Artifact Index
- c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m6\original_prompt.md — Original prompt record
- c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m6\BRIEFING.md — Briefing file
- c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m6\progress.md — Heartbeat and state checkpoint
- c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m6\SCOPE.md — Milestone scope and interface contracts
