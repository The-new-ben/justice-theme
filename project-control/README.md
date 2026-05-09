# Project Control — Jus-Tice Dominant Legal Portal

This directory contains the operational control system for building Israel's dominant legal portal.

## File Index

| File | Purpose |
|---|---|
| `current-status.md` | What is true right now |
| `next-actions.md` | Ordered priority queue |
| `task-board.csv` | All tasks with tracking columns |
| `changelog.md` | Every code/content/config change |
| `decisions.md` | Strategic/technical decisions and rationale |
| `blockers.md` | Anything stopping progress |
| `demo-readiness.md` | Demo checklist |
| `risks.md` | Risks, impact, mitigation |
| `workflow.yml` | Working process definition |
| `linear-sync.md` | Linear ↔ repo sync log |

## Working Method

1. Read `current-status.md`
2. Pick highest-priority unblocked task from `next-actions.md`
3. Update `task-board.csv` → status = "in_progress"
4. Work on that task only
5. Make the smallest useful change
6. Verify it
7. Document files changed in `changelog.md`
8. Update Linear
9. Update `next-actions.md`
10. Move to next task
