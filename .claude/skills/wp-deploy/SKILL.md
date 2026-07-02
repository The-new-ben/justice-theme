---
name: wp-deploy
description: Agent-driven WordPress deploys and one-shot live-site operations for jus-tice.co.il. Use when asked to deploy plugin code, run a one-shot database routine on the live site, or verify what version is live. Encodes the temp-route pipeline and every gotcha that caused a real outage.
---

# wp-deploy: agent-driven deploys on jus-tice.co.il

Full handbook: project-control/agent-deploy-pipeline-handbook.md.
Tooling: scripts/deploy/ (zip builder, snippet template, deploy.sh).

## The channels (never confuse them)

- justice-ops PLUGIN (live since 2026-07-02, the owner's chosen
  architecture, mirrors his nad-lan.co.il site): all NEW live site
  behavior ships as hooks inside justice-ops/, delivered by the
  core-native Update URI protocol. Bump version + constant, run
  python3 scripts/deploy/build-ops-zip.py <ver> (asserts version sync
  with plugin-dist/justice-ops.json), push to main. WordPress cron
  auto-installs it (justice-ops is in auto_update_plugins) within ~12h;
  for instant delivery use the temp-route pipeline below to call
  wp_update_plugins() + Plugin_Upgrader->upgrade(). Verify:
  GET /wp-json/justice-ops/v1/healthcheck returns the new version.
  Proven live end to end 2026-07-02 (1.0.0 -> 1.0.1 via core updater).
- THEME code deploys via git push to main + owner pull in uPress. Owner
  direction: theme trends toward static chrome; ongoing changes migrate
  into justice-ops hooks. NEVER Theme_Upgrader zips (owner veto: it
  kills the server .git and the uPress Pull button).
- One-shot privileged operations deploy agent-side via the temp-route
  pipeline, when the env vars WP_BASE_URL, WP_USER, WP_APP_PASSWORD
  exist (Environment settings, never committed, never printed). These
  are SET in the session environment as of 2026-07-02.

## justice-ops gotchas

- GitHub raw propagation: after push, the manifest URL can serve the
  OLD version for a few minutes. Poll with a fresh query param until
  it flips before triggering an update check.
- Do not curl the plugin's own bucket URL (?nlcb=time()/900) while
  testing: you prime GitHub's CDN with the stale response at exactly
  the URL the plugin will fetch. Use a different param, or seed the
  justice_ops_manifest_v1 transient inside the trigger route.
- NEVER call wp_maybe_auto_update() in a trigger route: the site has
  ~50 plugins in auto_update_plugins and it updates ALL of them.
  Upgrade only justice-ops/justice-ops.php explicitly.
- /wp-json/wp/v2/users/me only exposes roles with ?context=edit.

## Deploy loop (plugin)

1. Bump Version in justice-core/justice-core.php header.
2. php -l every changed file. A deployed syntax error is an outage.
3. python3 scripts/deploy/build-plugin-zip.py <ver> (asserts version
   sync, forward-slash paths, main file present).
4. Assert the changed feature string is inside the zip, not just the
   version.
5. Commit + push so the GitHub raw URL serves the zip.
6. scripts/deploy/deploy.sh <ver>: auth preflight, create temp Code
   Snippets route, POST it, verify, DELETE the snippet, confirm 404.
7. Verify independently: GET /wp-json/justice/v1/healthcheck (theme
   version + deploy marker), homepage 200, and the changed surface by
   RENDERED BODY (slice from <body>, assert new marker present AND old
   marker absent; head assets contain class names and false-positive).

## One-shot live operations (no file deploy)

Wrap the operation INSIDE an admin-gated REST route in a temp snippet
(create, call once, delete). NEVER at the top level of a global
snippet: global snippets run on every request at plugins_loaded and a
fatal there takes down the whole site including the REST API you need
to remove it.

## Gotchas that cost real outages (do not relearn)

1. Prefer install(overwrite_package:true) over the transient+upgrade
   dance: update-checker filters can rewrite the forced transient and
   silently deploy nothing.
2. GitHub raw caches ~5 min: always append ?nlcb=<time()> to zip URLs.
3. Never zip with Windows tools: backslash paths extract wrong. Only
   the Python builder; it asserts namelist has no backslashes.
4. Snippets created via REST: scope global + active true, with an
   explicit route you call; single-use snippets may never execute.
5. Pretty permalinks must be ON or custom REST namespaces 404.
6. Do not trust the deploy response body: proxies can return nginx 404
   bodies on success. Truth is the healthcheck + rendered pages.
7. Emergency recovery, in order: rename plugin folder in File Manager;
   define('CODE_SNIPPETS_SAFE_MODE', true) in wp-config; UPDATE
   wp_snippets SET active=0; WordPress recovery-mode email link.

## Iron rules that still apply to every deploy

php -l before build; bump JUSTICE_DEPLOY_MARKER for theme releases;
verify live after every deploy; no em/en dashes in anything; never
print credentials to logs or chat.

## Live-verified state (2026-07-02)

- Pipeline smoke PASSED end to end on production: snippet create ->
  authed call -> unauthed 401 -> delete 204 -> 404 -> site healthy.
- Code Snippets 3.9.6 active (installed via POST wp/v2/plugins).
- WARNING: live runs ultra-justice-engine 1.0.0 as the active companion
  plugin; justice-core is NOT installed. Do not install the
  justice-core zip while ultra-justice-engine is active (duplicate
  function names, probable fatal). Plugin deploys must target
  ultra-justice-engine or migrate it first, owner-approved.
- Credentials: WP_USER/WP_APP_PASSWORD from environment or owner chat;
  never committed, never echoed.

## Cache discipline (learned 2026-07-02, cost an owner panic, twice)

The live site runs SIX cache layers plus the owner's browser: uPress
SeoEdge edge cache (nginx level, x-cached-engine-header: SeoEdge,
OUTSIDE WordPress; purge it with an HTTP PURGE request per URL:
curl -X PURGE https://jus-tice.co.il/), SiteGround sg-cachepress,
Autoptimize (aggregated CSS/JS with its own store), WP-Optimize page
cache, Asset CleanUp, and the object cache. A deploy that lands on
disk is INVISIBLE until they are purged. Every deploy runs the full
purge block (see deploy-snippet-template.php) AND the SeoEdge PURGE,
then verifies with the live-verify skill (MANDATORY, owner law): fetch
the rendered page, assert the new probe present and the old artifact
absent, grep inside the autoptimize bundles for CSS/JS probes. The
owner's browser also caches: tell them Ctrl+Shift+R.

## Server facts verified 2026-07-02

- shell_exec and exec are DISABLED on uPress: agent-side git pull on
  the server is impossible. Theme autonomy requires the
  Theme_Upgrader zip route (owner decision pending: it removes the
  server's .git so the uPress Pull button dies permanently).
