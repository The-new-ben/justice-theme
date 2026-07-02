# The Agent-Driven WordPress Deploy Pipeline - Complete Portable Handbook

Owner-supplied 2026-07-02, installed into this repo the same day.
Local adaptations: builder at scripts/deploy/build-plugin-zip.py
(justice-core), snippet template at scripts/deploy/
deploy-snippet-template.php, orchestrator at scripts/deploy/deploy.sh,
healthcheck at GET /wp-json/justice/v1/healthcheck (inc/healthcheck.php),
procedure skill at .claude/skills/wp-deploy/SKILL.md.

The one-sentence idea: reviewed plugin code lives in Git; a build script
zips it; the zip is pushed to a public URL (GitHub raw); a TEMPORARY
admin-only REST route on the site runs WordPress's own Plugin_Upgrader
against that zip and deletes itself. The repo stays the source of truth;
only the deploy trigger moves from a human to the agent.

## Part 0: mental model
Clicking Update in wp-admin is WordPress running Plugin_Upgrader in an
authenticated admin request. Any actor with the update_plugins capability
can run the same class. Pipeline: [Git repo] -> build zip -> GitHub raw ->
temp REST route runs Plugin_Upgrader->install() -> live.
Safety properties: (1) ephemeral privilege: the route exists only for the
seconds of one deploy, create -> call -> delete; (2) idempotent install:
install($url, ['overwrite_package'=>true]) is the Upload->Replace path,
ignores version comparison, so re-runs and rollbacks are harmless;
(3) verify before trusting: health endpoint + changed page after every
deploy; (4) cache-bust everything: GitHub raw ~5 min, browser ?ver=,
host page caches.

## Part 1: prerequisites
Target site needs: WordPress 6.x+, an administrator user, an Application
Password for that user (wp-admin > Users > Profile > Application
Passwords), the free Code Snippets plugin active, the plugin code in Git,
a public HTTPS URL serving the zip (GitHub raw), pretty permalinks ON.
Recommended: WP Mail SMTP, File Manager (rescue hatch), Adminer, a cache
plugin (purged in the deploy route).
Credentials live OUTSIDE the repo as env vars, never printed:
WP_BASE_URL, WP_USER, WP_APP_PASSWORD. Auth preflight without leaking:
curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  "$WP_BASE_URL/wp-json/wp/v2/users/me?_fields=id,name,roles"
Expect the user with "administrator" in roles.

## Part 2: plugin repo prep
Single source of version truth: the plugin header Version and a version
constant kept in lockstep (the builder asserts the header). Enqueue every
asset with the version constant, never a hardcoded ?ver= (a frozen ver
once pinned browsers to a month-old script for weeks).
Healthcheck REST route (the most useful piece of the whole pipeline):
a public GET returning plugin/theme version + PHP + WP versions. Ours:
GET /wp-json/justice/v1/healthcheck.
Canonical zip builder: scripts/deploy/build-plugin-zip.py. Exists because
ad-hoc zip commands on Windows poison archives with backslash paths that
WordPress silently mis-extracts. Asserts: version in main file, forward
slashes only, main file present in archive, version inside the archive.
Optional update manifest json (plugin-dist/<slug>.json) so wp-admin can
show "update available" too.

## Part 3: release ritual (every version, in order)
1. Bump version in the header (and constant if present).
2. php -l every changed PHP file BEFORE building.
3. python3 scripts/deploy/build-plugin-zip.py <ver>
4. Assert the changed FEATURE is inside the zip, not just the version
   (a patch script that dies mid-run can bump the version but skip the
   feature).
5. Commit + push to the branch the raw URL serves (main). Confirm with
   curl -sI on the raw zip URL (may lag ~5 min; the nlcb buster in the
   route handles it).

## Part 4: the deploy route
The temp snippet registers POST /wp-json/justicedeploy/v1/run with
permission_callback current_user_can('update_plugins'). It requires the
wp-admin upgrader includes, builds the zip URL with ?nlcb=<time()>,
runs Plugin_Upgrader->install($zip, ['overwrite_package'=>true]),
re-activates the plugin if needed, purges caches, and returns the
upgrader messages. Full template: scripts/deploy/
deploy-snippet-template.php.
The loop over REST (Code Snippets API at wp-json/code-snippets/v1):
A. create snippet (scope global + active true so rest_api_init fires),
B. POST the deploy route with basic auth,
C. verify the healthcheck flipped,
D. DELETE the snippet (expect 204),
E. confirm the route 404s.
Orchestrated end to end by scripts/deploy/deploy.sh <ver>.

## Part 5: verification discipline
Never trust the response body alone: proxies/CDNs can return an nginx
404 body when the write succeeded. Truth is the effect, independently:
healthcheck version, changed page 200, homepage 200. Golden rule: verify
the RENDERED PAGE BODY, not whole-HTML substrings: enqueued CSS/JS in
head contain class names, so a marker grep can pass while the visible
page is unchanged (a theme filter once overrode content for a full day).
Slice from <body> and assert the NEW marker present AND the OLD absent.

## Part 6: gotchas (each cost real debugging)
1. Prefer install(overwrite_package) over the transient+upgrade() dance:
   a bundled update-checker's pre_set_site_transient_update_plugins
   filter can rewrite the forced transient and deploy nothing.
2. GitHub raw caches ~5 minutes: always ?nlcb=<time()> on the zip URL.
3. Windows-zipped archives poison paths: only the Python builder, assert
   no backslashes in namelist().
4. A single-use snippet activated via REST may never execute: use scope
   global + active true + an explicit route you call.
5. NEVER put one-shot privileged code at the TOP LEVEL of a global
   snippet: global snippets run on EVERY request at plugins_loaded; a
   fatal there takes the whole site down including the REST API you
   would use to remove it. One-shot code goes INSIDE an admin-gated REST
   route callback, always.
6. Lint before build, always. A deployed syntax error is an outage.
7. Assert the feature is inside the zip before deploying.
8. Pretty permalinks must be on or custom REST namespaces 404.

## Part 7: emergency recovery (write down BEFORE needed)
A. Rename the plugin folder in the host File Manager (site returns
   instantly, nothing deleted).
B. define('CODE_SNIPPETS_SAFE_MODE', true) in wp-config.php, delete the
   bad snippet via REST, remove the line.
C. Adminer: UPDATE wp_snippets SET active = 0; (adjust prefix).
D. WordPress recovery-mode email link on fatals.
After recovery: remove the offending snippet via REST, re-verify every
page, re-apply the change the SAFE way (reviewed plugin code).

## Part 8: scaling
One site: the loop above is the steady state (30+ releases, zero manual
clicks elsewhere). Fleet: parameterize the three env vars per site and
loop; keep a sites.json OUT of the repo. Permanent route variant: only
for fleets; harden with a shared-secret header compared via
hash_equals(), rate limiting and logging, shipped as a tiny ops plugin,
not a snippet. CI/CD: the same route works from GitHub Actions on push
to main. (Owner's source text was truncated mid-section 8.4 in
transmission; the loop above is complete and self-sufficient.)

## Status on jus-tice.co.il (2026-07-02)
Installed in repo and smoke-tested locally: builder (justice-core-1.0.0
zip verified: 16 entries, zero backslashes, version confirmed inside),
snippet template lints, deploy.sh syntax-checked, healthcheck route ships
with theme v2.15.0. NOT yet runnable end to end: WP_BASE_URL / WP_USER /
WP_APP_PASSWORD are not present in the session environment, and Code
Snippets REST access is unverified. Owner setup: create an application
password for an admin user, add the three env vars in the repository
Environment settings, confirm the Code Snippets plugin is active.
