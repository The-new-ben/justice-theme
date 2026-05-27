# Blockers
Date: 2026-05-09

| ID | Status | Blocker | Impact | Required Action |
|---|---|---|---|---|
| B001 | BLOCKED | No authenticated live WP access in this session | Cannot verify active plugin, PHP/WP version, debug log, menus, media library, spam source | Provide WP admin, WP-CLI, SSH, or authenticated REST access |
| B002 | BLOCKED | GitHub sync target not documented | Cannot safely delete/rename plugin folders | Confirm whether sync target is theme folder only or full `wp-content` structure |
| B003 | BLOCKED | Active plugin path unknown | Cannot safely migrate `ultra-justice-engine` to `justice-core` | Run `wp plugin list` or inspect Plugins screen |
| B004 | BLOCKED | No GSC access | Cannot build real query/page cannibalization map | Connect Google Search Console or export data |
| B005 | RESOLVED | Footer trust path browser visual QA completed for this pass | Live desktop and mobile checks found the footer trust path, WhatsApp/form links, and no horizontal overflow | Evidence: `output/playwright/footer-trust-desktop-live-2026-05-27.png`, `output/playwright/footer-trust-mobile-live-2026-05-27.png` |
| B006 | RESOLVED | uPress Pull Git / live deploy no longer blocked for footer trust path | Live site now serves marker `2026-05-27-footer-trust-path-v1`, theme version `1.1.66`, `site-footer__trust-path`, and `footer_trust_path`; old marker is absent | Keep using `.project-control/scripts/check-live-deploy.ps1` after future pulls |
| B007 | BLOCKED | Mobile menu and link hygiene release is pushed to Git but not deployed on the live site | The live homepage still serves marker `2026-05-27-footer-trust-path-v1`; expected marker `2026-05-28-mobile-menu-stability-v1` and theme version `1.1.69` are missing, and the live mobile menu still exposes legacy `?page_id=315` until uPress pulls the latest Git state | In uPress Git management for `wp-content/themes/justice-theme`, run Pull Git, then run `.project-control/scripts/check-live-deploy.ps1`, `.project-control/scripts/check-live-link-hygiene.ps1`, `.project-control/scripts/check-live-mobile-menu-browser-qa.ps1`, and `.project-control/scripts/check-revenue-readiness-gate.ps1`. Evidence: `.project-control/live-mobile-menu-browser-qa-2026-05-28.md` |
