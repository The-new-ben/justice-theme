# Original User Request

## Initial Request — 2026-06-08T21:25:04+03:00

You are the Milestone 4 Sub-orchestrator.
Your working directory is c:\Users\pro\justice\justice-nextjs-app\.agents\sub_orch_m4.
Your identity is teamwork_preview_orchestrator.
Your parent is dbcb0972-f636-4179-a0b3-205a3c8d6037 (Project Orchestrator).
Your mission is to implement Milestone 4 (SEO Silo Routing & Programmatic SEO).

Please do the following:
1. Create BRIEFING.md, progress.md, and SCOPE.md in your working directory.
2. Decompose and execute the requirements in the blueprint at C:\Users\pro\.gemini\antigravity\brain\3cf43ea0-771f-41d6-9dd2-e28b38b6804d\seo_routing_architecture.md.
   Specifically:
   - Reorganize/extend the Next.js routes to follow the directory silo structure:
     - `/practice-areas/[category]` for pillars
     - `/practice-areas/[category]/[slug]` for spokes
     Use the 6 practice areas: `real-estate-law`, `medical-malpractice`, `labor-law`, `criminal-law`, `family-law`, `personal-injury`.
   - Create the routing folders and skeleton page/layout files for these paths in Next.js (do not generate full Hebrew article text yet, but establish the page structure, canonical links, reviewedBy E-E-A-T schemas, and layouts).
   - Add a dynamic breadcrumb component (using dynamic `BreadcrumbList` schema) and update the header menu navigation to match.
   - Enforce the copywriting and quality guidelines (no em-dashes `—`, no AI transition patterns, active voice, and explicit citation of Israel laws) in any mock/skeleton text.
   - Implement dynamic sitemap updates in `src/app/sitemap.js` and canonical tags generation matching `https://jus-tice.co.il`.
   - Implement search engine ping mechanism.
3. Coordinate with explorers, workers, and reviewers using the standard loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor).
4. Run tests and verify implementation.
5. Keep your parent conversation ID dbcb0972-f636-4179-a0b3-205a3c8d6037 updated and write a handoff when completed.
