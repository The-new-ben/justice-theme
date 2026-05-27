# Blockers
Date: 2026-05-09

| ID | Status | Blocker | Impact | Required Action |
|---|---|---|---|---|
| B001 | BLOCKED | No authenticated live WP access in this session | Cannot verify active plugin, PHP/WP version, debug log, menus, media library, spam source | Provide WP admin, WP-CLI, SSH, or authenticated REST access |
| B002 | BLOCKED | GitHub sync target not documented | Cannot safely delete/rename plugin folders | Confirm whether sync target is theme folder only or full `wp-content` structure |
| B003 | BLOCKED | Active plugin path unknown | Cannot safely migrate `ultra-justice-engine` to `justice-core` | Run `wp plugin list` or inspect Plugins screen |
| B004 | BLOCKED | No GSC access | Cannot build real query/page cannibalization map | Connect Google Search Console or export data |
| B005 | BLOCKED | No browser visual QA completed in this pass | Cannot claim premium visual quality | Run desktop/mobile visual QA after source changes deploy locally or live |
| B006 | BLOCKED | uPress Pull Git blocked because Codex cannot control Chrome through the Chrome extension | Commit `9c51a843` with footer trust path is pushed to GitHub but not live; live site still serves marker `2026-05-27-mobile-menu-lead-actions-v1` instead of `2026-05-27-footer-trust-path-v1`. Chrome is now running and Profile 2 was opened; the Codex extension and native host checks pass, but `agent.browsers.get("extension")` still returns `Browser is not available: extension`. | Reinstall/repair the Codex Chrome plugin from the Codex plugin UI or manually run Pull Git in uPress for `wp-content/themes/justice-theme`, then re-check live marker |
