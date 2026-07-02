#!/usr/bin/env bash
# One-shot pipeline bring-up. Run once after the owner supplies the
# application password. Does EVERYTHING itself:
#   1. auth preflight (admin role check, no secrets printed)
#   2. ensures the Code Snippets plugin is installed + active (core
#      wp/v2/plugins REST can install from wordpress.org)
#   3. verifies pretty permalinks via the healthcheck route
#   4. runs the full deploy loop end to end with the current
#      justice-core zip (idempotent overwrite install: safe to re-run)
# Usage: WP_APP_PASSWORD is read from the environment, never echoed.
#   WP_BASE_URL=https://jus-tice.co.il WP_USER=<admin> WP_APP_PASSWORD=<pw> \
#     scripts/deploy/bringup.sh <zip-version>
set -euo pipefail

VER="${1:?usage: bringup.sh <zip-version>}"
: "${WP_BASE_URL:?missing WP_BASE_URL}"
: "${WP_USER:?missing WP_USER}"
: "${WP_APP_PASSWORD:?missing WP_APP_PASSWORD}"
AUTH=(-u "$WP_USER:$WP_APP_PASSWORD")

echo "== 1. auth preflight"
ME=$(curl -sm 20 "${AUTH[@]}" "$WP_BASE_URL/wp-json/wp/v2/users/me?_fields=id,slug,roles")
echo "$ME" | grep -q administrator || { echo "FATAL: not an administrator: $ME"; exit 1; }
echo "auth OK (administrator)"

echo "== 2. Code Snippets plugin"
CS=$(curl -sm 30 "${AUTH[@]}" "$WP_BASE_URL/wp-json/wp/v2/plugins?search=code-snippets" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['status'] if d else 'missing')" 2>/dev/null || echo missing)
if [ "$CS" = "missing" ]; then
  echo "installing code-snippets from wordpress.org..."
  curl -sm 90 "${AUTH[@]}" -H "Content-Type: application/json" \
    -d '{"slug":"code-snippets","status":"active"}' \
    "$WP_BASE_URL/wp-json/wp/v2/plugins" | python3 -c "import sys,json; d=json.load(sys.stdin); print('installed:', d.get('status', d))"
elif [ "$CS" != "active" ]; then
  echo "activating code-snippets..."
  PLUGIN_ID=$(curl -sm 30 "${AUTH[@]}" "$WP_BASE_URL/wp-json/wp/v2/plugins?search=code-snippets" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['plugin'])")
  curl -sm 30 "${AUTH[@]}" -X PUT -H "Content-Type: application/json" \
    -d '{"status":"active"}' "$WP_BASE_URL/wp-json/wp/v2/plugins/$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$PLUGIN_ID")" \
    | python3 -c "import sys,json; print('status:', json.load(sys.stdin).get('status'))"
else
  echo "code-snippets already active"
fi

echo "== 3. healthcheck (pretty permalinks + live version)"
curl -sm 20 "$WP_BASE_URL/wp-json/justice/v1/healthcheck" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('live theme:', d.get('theme_version'), '| marker:', d.get('deploy_marker'))" \
  || echo "WARN: healthcheck 404: theme not pulled yet or permalinks not pretty"

echo "== 4. full deploy loop smoke (idempotent reinstall of justice-core $VER)"
"$(dirname "$0")/deploy.sh" "$VER"

echo "== BRING-UP COMPLETE"
