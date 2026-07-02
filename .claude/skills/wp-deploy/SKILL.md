---
name: wp-deploy
description: Agent-driven WordPress deploys and one-shot live-site operations for jus-tice.co.il. Use when asked to deploy plugin code, run a one-shot database routine on the live site, or verify what version is live. Encodes the temp-route pipeline and every gotcha that caused a real outage.
---

# wp-deploy: agent-driven deploys on jus-tice.co.il

Full handbook: project-control/agent-deploy-pipeline-handbook.md.
Tooling: scripts/deploy/ (zip builder, snippet template, deploy.sh).

## The two channels (never confuse them)

- THEME code deploys via git push to main + owner pull in uPress. The
  pipeline below is NOT for the theme.
- PLUGIN code (justice-core) and one-shot privileged operations can
  deploy agent-side via the temp-route pipeline, when the env vars
  WP_BASE_URL, WP_USER, WP_APP_PASSWORD exist (Environment settings,
  never committed, never printed).

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
