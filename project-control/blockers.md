# Blockers

## B001 — No access to justice-core plugin files locally
- **Status:** ACTIVE
- **Impact:** Cannot register Lawyer CPT, Lead CPT, or City taxonomy
- **Mitigation:** Need to either clone the plugin repo or create the files locally and push via FTP/uPress file manager
- **Owner:** dev

## B002 — No Google Search Console credentials
- **Status:** ACTIVE
- **Impact:** Cannot pull real keyword/traffic data for content strategy
- **Mitigation:** User needs to grant GSC access or share API credentials
- **Owner:** site owner

## B003 — No payment gateway set up
- **Status:** EXPECTED (Phase 3)
- **Impact:** Cannot implement lawyer subscription payments
- **Mitigation:** Plan the system now, implement when ready
- **Owner:** site owner

## B004 — Israeli Bar advertising rules need verification
- **Status:** IN PROGRESS
- **Impact:** Cannot safely build paid profiles, reviews, or rankings without compliance
- **Mitigation:** Creating compliance research document now
- **Owner:** dev

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

## B005 — Fictional lawyers displayed as real profiles
- **Status:** ACTIVE — 🔴 P0
- **Impact:** 10 seed lawyers with fake phone numbers publicly visible at /lawyers/ and homepage. Credibility and potential legal risk if users attempt to contact them.
- **Mitigation:** Unpublish all 10 seed lawyers OR add visible "DEMO" disclaimer to each card
- **Owner:** dev + site owner

## B006 — Legacy CPTs cannot be deregistered without admin access
- **Status:** ACTIVE
- **Impact:** 7 orphaned CPTs (labor_law, small_claims, corona_virus, supreme_court, tort, goverment-gazette, yada_wiki) bloating REST API and admin UI
- **Mitigation:** Requires either WP Admin plugin deactivation OR justice-core code change to explicitly deregister
- **Owner:** dev

## B007 — Taxonomy fragmentation requires manual merge
- **Status:** ACTIVE
- **Impact:** 35+ overlapping practice-area terms causing SEO cannibalization. Cannot be automated without data mapping.
- **Mitigation:** Create merge map CSV, then execute via WP-CLI or REST API with auth
- **Owner:** dev
