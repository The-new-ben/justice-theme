# jus-tice.co.il — MASTER PROGRESS TRACKER
> Last updated: 2026-05-07 10:20 IST

## STATUS: 🔴 CRITICAL — SITE COMPROMISED + FULL REBUILD NEEDED

## CRITICAL FINDINGS ⚠️
- [!] Homepage contains MASSIVE casino spam injection (~285 lines, 20+ gambling brands)
- [!] `articles` CPT is NOT visible in REST API (show_in_rest = false)
- [!] `practice-areas` taxonomy NOT visible in REST API
- [!] Legacy CPTs still registered in code (labor_law, small_claims, etc.)
- [!] 3 SEO plugins running simultaneously (Rank Math + AIOSEO + Squirrly)
- [!] ~26 active plugins — severe bloat
- [!] Theme is `droneit` (custom by Dronit), NOT Elementor-based

## COMPLETED ✅
- [x] Database credentials extracted (.env.upress)
- [x] Post type consolidation in DB (1,199 articles)
- [x] Category slug migration (Hebrew → English) in DB
- [x] 9 spam categories deleted from DB
- [x] Auto-categorization by keyword in DB
- [x] Keyword research (5 tiers)
- [x] Pillar page strategy (10 planned)
- [x] **FULL TECHNICAL AUDIT** — documented in artifacts/technical_audit.md

## IN PROGRESS 🔄
- [ ] Casino spam cleanup (PRIORITY 1)
- [ ] Plugin deactivation (conflicting SEO plugins)
- [ ] Find and fix `articles` CPT registration
- [ ] Find and fix `practice-areas` taxonomy registration

## BLOCKED 🚫
- [ ] Homepage visual redesign — blocked by spam cleanup + theme decision
- [ ] SEO configuration — blocked by plugin conflicts
- [ ] Performance optimization — blocked by plugin cleanup

## TODO 📋 (Prioritized)
### Phase 1: Emergency (Today)
1. [ ] Clean casino spam from homepage
2. [ ] Deactivate conflicting plugins (AIOSEO, Squirrly)
3. [ ] Audit Code Snippets + WPCode for malicious code
4. [ ] Fix `articles` CPT REST API visibility
5. [ ] Fix `practice-areas` taxonomy REST API visibility

### Phase 2: Architecture (Today)
6. [ ] Deregister legacy CPTs
7. [ ] Flush permalinks
8. [ ] Theme decision and implementation
9. [ ] 301 redirects for migrated URLs

### Phase 3: Visual (Today + Tomorrow)
10. [ ] Homepage redesign
11. [ ] Category/practice area pages
12. [ ] Article template
13. [ ] Navigation menu rebuild
14. [ ] Mobile optimization

### Phase 4: SEO & Performance (Tomorrow)
15. [ ] Rank Math full configuration
16. [ ] Schema markup
17. [ ] Breadcrumbs
18. [ ] Image optimization
19. [ ] Core Web Vitals optimization
20. [ ] Google Search Console setup

## FILES & SCRIPTS
| File | Purpose |
|------|---------|
| `.env.upress` | Database/FTP/API credentials |
| `sql/` | All migration SQL scripts |
| `PROGRESS.md` | This file — master tracker |
| `keywords.md` | Keyword research results |
| `artifacts/technical_audit.md` | Full technical audit document |
