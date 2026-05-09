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
