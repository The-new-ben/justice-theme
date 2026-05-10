# Risks

| ID | Risk | Impact | Probability | Mitigation | Owner |
|---|---|---|---|---|---|
| R001 | Lawyer advertising non-compliance | Legal action against site owner | Medium | Complete compliance research before any paid features | dev |
| R002 | Content cannibalization worsens during build | Ranking drops on existing keywords | High | Complete content inventory before creating new pillar pages | dev |
| R003 | Old URL structure changes break 200+ indexed pages | Massive traffic loss | High | No redirects until inventory is complete; use canonical tags first | dev |
| R004 | uPress Git sync fails during heavy push | Site goes down temporarily | Low | Test pushes incrementally; keep rollback commit hash | dev |
| R005 | Lawyer CPT schema conflicts with existing plugins | Data corruption | Low | Register CPT with unique prefixes; check for CPT UI conflicts | dev |
| R006 | GSC integration delayed indefinitely | SEO strategy based on guesses, not data | Medium | Prepare integration code; push user for credentials | dev |
| R007 | Demo expectations exceed what's buildable in time | Stakeholder disappointment | Medium | Set clear demo-readiness checklist; show roadmap for future phases | dev |
| R008 | Mobile UX broken on key pages | Loss of 60%+ traffic (mobile-first Israel) | High | Prioritize mobile audit before demo | dev |

---

## * AUDIT V2 ADDITIONS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

| ID | Risk | Impact | Probability | Mitigation | Owner |
|---|---|---|---|---|---|
| R009 | Fictional lawyers presented as real profiles | Legal liability if users contact fake numbers; brand credibility destroyed | High | Unpublish seed data or add explicit "DEMO" markers immediately | dev + owner |
| R010 | Taxonomy fragmentation (35+ overlapping terms) | SEO keyword cannibalization across multiple thin pages | High | Create merge map; consolidate to 15-20 canonical terms with 301 redirects | dev |
| R011 | 7 legacy CPTs indexed by search engines | Orphaned content pages ranking for irrelevant queries; crawl budget waste | Medium | Deregister CPTs; noindex existing pages; 301 redirect to articles | dev |
| R012 | Mixed http/https internal links | Browser mixed-content warnings; redirect overhead on every click | Medium | Global find-replace http:// → https:// in templates and DB | dev |
