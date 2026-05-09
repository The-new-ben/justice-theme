# Blockers
Date: 2026-05-09

| ID | Status | Blocker | Impact | Required Action |
|---|---|---|---|---|
| B001 | BLOCKED | No authenticated live WP access in this session | Cannot verify active plugin, PHP/WP version, debug log, menus, media library, spam source | Provide WP admin, WP-CLI, SSH, or authenticated REST access |
| B002 | BLOCKED | GitHub sync target not documented | Cannot safely delete/rename plugin folders | Confirm whether sync target is theme folder only or full `wp-content` structure |
| B003 | BLOCKED | Active plugin path unknown | Cannot safely migrate `ultra-justice-engine` to `justice-core` | Run `wp plugin list` or inspect Plugins screen |
| B004 | BLOCKED | No GSC access | Cannot build real query/page cannibalization map | Connect Google Search Console or export data |
| B005 | BLOCKED | No browser visual QA completed in this pass | Cannot claim premium visual quality | Run desktop/mobile visual QA after source changes deploy locally or live |
