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
| B007 | RESOLVED | Homepage status path, mobile menu, and link hygiene release deployed live | uPress Git log shows commit `522bf59a` as `HEAD -> main`; after uPress cache clear, live homepage serves marker `2026-05-28-homepage-status-path-v1`, theme version `1.1.70`, the new homepage customer status path, canonical menu links, and mobile menu revenue actions | Keep running `.project-control/scripts/check-live-deploy.ps1`, `.project-control/scripts/check-live-mobile-menu-browser-qa.ps1`, `.project-control/scripts/check-homepage-revenue-paths.ps1`, `.project-control/scripts/check-live-link-hygiene.ps1`, and `.project-control/scripts/check-revenue-readiness-gate.ps1` after future deploys |
