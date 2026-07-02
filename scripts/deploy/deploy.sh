#!/usr/bin/env bash
# Agent-driven deploy loop: create temp route -> call -> verify -> delete.
# Requires env vars (Environment settings, NEVER committed):
#   WP_BASE_URL   e.g. https://jus-tice.co.il
#   WP_USER       admin username with update_plugins
#   WP_APP_PASSWORD  WordPress application password
# Usage: scripts/deploy/deploy.sh <zip-version>
# Runbook: project-control/agent-deploy-pipeline-handbook.md
set -euo pipefail

VER="${1:?usage: deploy.sh <zip-version>}"
: "${WP_BASE_URL:?missing WP_BASE_URL}"
: "${WP_USER:?missing WP_USER}"
: "${WP_APP_PASSWORD:?missing WP_APP_PASSWORD}"

DIR="$(cd "$(dirname "$0")" && pwd)"
TMP_SNIPPET="$(mktemp)"
sed "s/__ZIP_VERSION__/${VER}/" "$DIR/deploy-snippet-template.php" | tail -n +2 > "$TMP_SNIPPET"

echo "== A. auth preflight (no secrets printed)"
ROLES=$(curl -sm 20 -u "$WP_USER:$WP_APP_PASSWORD" "$WP_BASE_URL/wp-json/wp/v2/users/me?_fields=roles")
echo "$ROLES" | grep -q administrator || { echo "FATAL: user is not administrator: $ROLES"; exit 1; }

echo "== B. create temp snippet"
PAYLOAD=$(python3 -c "import json,sys; print(json.dumps({'name':'tmp-agent-deploy','code':open(sys.argv[1]).read(),'scope':'global','active':True}))" "$TMP_SNIPPET")
SID=$(curl -sm 30 -u "$WP_USER:$WP_APP_PASSWORD" -H "Content-Type: application/json" \
  -d "$PAYLOAD" "$WP_BASE_URL/wp-json/code-snippets/v1/snippets" \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))")
[ -n "$SID" ] || { echo "FATAL: snippet create failed (is Code Snippets active?)"; exit 1; }
echo "snippet id: $SID"

cleanup() {
  echo "== D. delete temp snippet"
  curl -sm 30 -u "$WP_USER:$WP_APP_PASSWORD" -X DELETE \
    "$WP_BASE_URL/wp-json/code-snippets/v1/snippets/$SID" -o /dev/null -w "deleted: %{http_code}\n"
  curl -sm 20 -u "$WP_USER:$WP_APP_PASSWORD" -X POST "$WP_BASE_URL/wp-json/justicedeploy/v1/run" \
    -o /dev/null -w "route after delete: %{http_code} (want 404)\n"
  rm -f "$TMP_SNIPPET"
}
trap cleanup EXIT

echo "== C. run deploy route"
curl -sm 180 -u "$WP_USER:$WP_APP_PASSWORD" -X POST "$WP_BASE_URL/wp-json/justicedeploy/v1/run"
echo
echo "== C2. independent verification"
curl -sm 20 "$WP_BASE_URL/wp-json/justice/v1/healthcheck" || true
echo
curl -sm 20 -o /dev/null -w "homepage: %{http_code}\n" "$WP_BASE_URL/?cb=$(date +%s)"
