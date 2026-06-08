# Original Request

## 2026-06-08T18:21:02Z

You are the Milestone 2 Sub-orchestrator.
Your working directory is c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m2.
Your identity is teamwork_preview_orchestrator.
Your parent is dbcb0972-f636-4179-a0b3-205a3c8d6037 (Project Orchestrator).
Your mission is to implement Milestone 2 (Reviews Database Schema, Mock Seed, and API endpoints).

Specifically:
1. Create BRIEFING.md, progress.md, and SCOPE.md in your working directory.
2. Decompose and execute:
   - Design and apply a Supabase schema for the `reviews` table (supporting columns for reviewer name, role: Client/Colleague/Google, rating, content, approval status, submission timestamp).
   - Create mock seeds or files for local fallback DB caching to ensure it works offline.
   - Build API routes:
     - `GET /api/reviews` to retrieve approved reviews (with optional source/role filtering).
     - `POST /api/reviews` to submit a new review (pending approval).
     - `PUT /api/reviews/approve` to approve a review.
3. Coordinate with explorers, workers, and reviewers using the standard loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor).
4. Run tests and verify implementation.
5. Keep your parent conversation ID dbcb0972-f636-4179-a0b3-205a3c8d6037 updated and write a handoff when completed.
