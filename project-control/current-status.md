# Current Status â€” Jus-Tice Legal Portal
# Last updated: 2026-05-09T09:52
# DEFCON 1 Engineering Mode engaged

---

## Verification Legend
- VERIFIED: tested and confirmed on live server
- NOT VERIFIED: code written, not deployed/confirmed
- FAILED: attempted and broken
- ASSUMPTION: logical inference, not tested
- BLOCKED: needs access or tooling

---

## Plugin Status

| Item | Status |
|------|--------|
| jus-tice-engine v1.0.0 (Namespaced jte_) (canonical) | NOT VERIFIED â€” built locally, not yet uploaded |
| justice-core-v3 (duplicate) | ASSUMPTION: may still be active on server â€” MUST deactivate |
| Build script (build.ps1) | VERIFIED: runs clean, produces jus-tice-engine.zip and jus-tice-ui.zip |
| Plugin ZIP structure | VERIFIED: justice-core\justice-core.php âœ“ |
| Theme ZIP structure | NOT VERIFIED: need to confirm internal folder name |

## Theme Status

| Item | Status |
|------|--------|
| jus-tice-ui v2.0.0 (Namespaced jtu_) (local) | NOT VERIFIED â€” not confirmed active on server |
| style.css with Theme Name header | VERIFIED: present locally |
| index.php | VERIFIED: present locally |
| Premium CSS (lawyer cards, lc namespace) | NOT VERIFIED â€” pending upload |

## REST API Status

| Endpoint | Status |
|----------|--------|
| GET /wp-json/jus-tice-engine/v1/health | NOT VERIFIED â€” plugin not yet uploaded |
| GET /wp-json/jus-tice-engine/v1/reports/spam | NOT VERIFIED |
| GET /wp-json/jus-tice-engine/v1/reports/plugins | NOT VERIFIED |

## Content Status

| Item | Status |
|------|--------|
| Casino/gambling spam on homepage | CONFIRMED PROBLEM â€” source unknown |
| Lawyer profiles seeded | ASSUMPTION: may exist from previous sessions |
| Seeder flag (justice_core_seeded_v4) | UNKNOWN â€” new flag for v4 |

## Site Status

| Item | Status |
|------|--------|
| jus-tice.co.il accessible | ASSUMPTION: Yes (based on user session) |
| Active theme | UNKNOWN â€” need REST verification |
| Active plugin | UNKNOWN â€” need REST verification |

---

## Immediate Next Steps

1. Upload `jus-tice-engine.zip` to live server (via wp-admin plugin upload)
   - FIRST: Deactivate justice-core-v3 in /wp-admin/plugins.php
   - THEN: Upload and activate justice-core v4
2. Verify: `GET /wp-json/jus-tice-engine/v1/health`
3. Run spam report: `GET /wp-json/jus-tice-engine/v1/reports/spam`
4. Run plugin report: `GET /wp-json/jus-tice-engine/v1/reports/plugins`
5. Upload `jus-tice-ui.zip` and activate
6. Visit homepage and /lawyers/ to verify layout

## Files Changed This Session (NOT VERIFIED on server)

- `justice-core/justice-core.php` â€” upgraded to v4.0.0
- `justice-core/includes/logger.php` â€” NEW: audit logger
- `justice-core/includes/seeder.php` â€” NEW: merged auto-seed + CSV seed
- `justice-core/includes/rest-content-tools.php` â€” NEW: content CRUD tools
- `justice-core/includes/rest-db-tools.php` â€” NEW: spam/duplicates/users/cron/options inspection
- `justice-theme/template-parts/cards/lawyer-card.php` â€” premium horizontal card (lc namespace)
- `justice-theme/assets/css/main.css` â€” premium CSS for lc cards
- `justice-theme/archive-justice_lawyer.php` â€” list layout (lawyers-list)
- `justice-theme/single-justice_lawyer.php` â€” lead form success notice
- `project-control/wordpress-plugin-theme-manual.md` â€” NEW
- `project-control/plugin-registry.md` â€” NEW
- `project-control/spam-investigation.md` â€” NEW
- `project-control/project-execution-guide.md` â€” NEW
- `build.ps1` â€” NEW: build/validation/zip script

