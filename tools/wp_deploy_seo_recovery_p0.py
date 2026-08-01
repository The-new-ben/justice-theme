#!/usr/bin/env python3
"""Install or deactivate the bounded Justice SEO Recovery P0 plugin.

The utility deploys only an immutable, SHA-256-pinned GitHub artifact. It uses
an administrator-gated, self-deleting Code Snippets REST bridge and records a
credential-free JSON evidence file for every attempted run.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import secrets
import subprocess
import sys
import tempfile
import urllib.parse
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


REPO_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = (
    REPO_ROOT.parents[1]
    if REPO_ROOT.parent.name == ".codex-tmp"
    else REPO_ROOT
)
DEFAULT_OUTPUT_DIR = (
    WORKSPACE_ROOT
    / "reports"
    / "seo-recovery-2026-07-31"
    / "release-path"
    / "seo-recovery-p0-deploy-2026-08-01"
)

REPOSITORY = "The-new-ben/justice-theme"
TARGET_BASE_URL = "https://jus-tice.co.il"
RELEASE_RULESET_ID = 20160370
REQUIRED_CHECK_NAME = "repository-release-guard"
PLUGIN_SLUG = "justice-seo-recovery-p0"
PLUGIN_BASENAME = f"{PLUGIN_SLUG}/{PLUGIN_SLUG}.php"
SUPPORTED_VERSION = "0.1.1"
HEALTH_ROUTE = "justice-seo-recovery/v1/healthcheck"
HEALTH_MARKER = "p0-plugin-only-20260801-v2"
REQUIRED_LIVE_THEME_VERSION = "2.23.0"
REQUIRED_LIVE_THEME_MARKER = "2026-07-06-home-keywords-upperfold-v1"
THEME_HEALTH_ROUTE = "justice/v1/healthcheck"
DEPLOY_TOOL_REPOSITORY_PATH = "tools/wp_deploy_seo_recovery_p0.py"
HELPER_NAMESPACE = "justice-seo-recovery-deploy/v1"
MAX_ARTIFACT_BYTES = 20 * 1024 * 1024
MAX_PLUGIN_FILE_BYTES = 1024 * 1024

AFFECTED_PATHS = (
    "/mediation-divorce/",
    "/divorce-mediation/",
    "/immigration-to-portugal/",
    "/portugal-relocation/",
    "/category/news/",
    "/legal-news/",
    "/practice-areas/child-support/",
    "/child-support/",
    "/practice-areas/family-law/",
    "/family-law/",
    "/lawyers/",
    "/city/tel-aviv/",
    "/lawyers/מאיה-רוטנברג-חברת-עורכי-דין/",
    "/lawyers/מאיה-רוטנברג-משרד-עורכי-דין/",
    "/sitemap-jus-tice/",
    "/site-map/",
    "/html-sitemap/",
    "/sitemap_index.xml",
    "/justice_lawyer-sitemap.xml",
    "/justice_lawyer-sitemap2.xml",
    "/wp-json/justice/v1/sitemap",
    "/wp-json/justice/v1/sitemap/lawyers",
    "/?rest_route=/justice/v1/sitemap",
    "/?rest_route=/justice/v1/sitemap/lawyers",
)

_COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")
_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
_VERSION_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?$")
_SELF_HASH_MARKER = "__JUSTICE_P0_NORMALIZED_CODE_SHA256__"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def utc_slug() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def read_env(path: Path) -> dict[str, str]:
    """Read a simple dotenv file without exposing its values."""

    values: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[7:].lstrip()
        key, value = line.split("=", 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "'\"":
            value = value[1:-1]
        values[key.strip()] = value
    return values


def resolve_env_file(explicit: Path | None) -> Path:
    """Find the authorized workspace dotenv without broad filesystem search."""

    if explicit is not None:
        resolved = explicit.expanduser().resolve()
        if not resolved.is_file():
            raise RuntimeError("The requested environment file does not exist.")
        return resolved

    candidates: list[Path] = [
        REPO_ROOT / ".env",
        WORKSPACE_ROOT / ".env",
        Path.cwd() / ".env",
    ]
    for parent in list(Path.cwd().resolve().parents)[:3]:
        candidates.append(parent / ".env")

    seen: set[Path] = set()
    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved in seen:
            continue
        seen.add(resolved)
        if resolved.is_file():
            return resolved

    raise RuntimeError(
        "No .env file was found. Pass --env-file with the authorized workspace file."
    )


def redact(value: Any, secrets_to_remove: Iterable[str]) -> Any:
    """Recursively remove credentials and one-time tokens from evidence."""

    secret_values = tuple(item for item in secrets_to_remove if item)
    if isinstance(value, dict):
        return {str(key): redact(item, secret_values) for key, item in value.items()}
    if isinstance(value, list):
        return [redact(item, secret_values) for item in value]
    if isinstance(value, tuple):
        return [redact(item, secret_values) for item in value]
    if isinstance(value, str):
        redacted = value
        for secret_value in secret_values:
            redacted = redacted.replace(secret_value, "[REDACTED]")
        return redacted
    return value


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Install or deactivate the SHA-pinned SEO Recovery P0 plugin."
    )
    parser.add_argument("action", choices=("install", "deactivate"))
    parser.add_argument(
        "--commit",
        "--commit-sha",
        dest="commit_sha",
        required=True,
        help="Exact 40-character commit SHA from protected main.",
    )
    parser.add_argument("--version", required=True)
    parser.add_argument("--artifact-sha256", required=True)
    parser.add_argument(
        "--expected-prior-state",
        choices=("absent", "inactive_exact", "active_exact"),
        required=True,
    )
    parser.add_argument("--env-file", type=Path)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--timeout", type=int, default=240)
    return parser.parse_args(argv)


def validate_release_inputs(args: argparse.Namespace) -> tuple[str, str, str]:
    commit_sha = str(args.commit_sha).strip().lower()
    version = str(args.version).strip()
    artifact_sha256 = str(args.artifact_sha256).strip().lower()

    if not _COMMIT_RE.fullmatch(commit_sha):
        raise RuntimeError("--commit must be an exact 40-character hexadecimal SHA.")
    if not _VERSION_RE.fullmatch(version):
        raise RuntimeError("--version must be a plain semantic version.")
    if version != SUPPORTED_VERSION:
        raise RuntimeError(
            f"This deploy utility is pinned to P0 version {SUPPORTED_VERSION}."
        )
    if not _SHA256_RE.fullmatch(artifact_sha256):
        raise RuntimeError("--artifact-sha256 must be 64 hexadecimal characters.")
    if args.timeout < 30 or args.timeout > 600:
        raise RuntimeError("--timeout must be between 30 and 600 seconds.")
    if args.action == "install" and args.expected_prior_state not in (
        "absent",
        "inactive_exact",
    ):
        raise RuntimeError("Install requires prior state absent or inactive_exact.")
    if args.action == "deactivate" and args.expected_prior_state != "active_exact":
        raise RuntimeError("Deactivate requires prior state active_exact.")

    return commit_sha, version, artifact_sha256


def artifact_url(commit_sha: str, version: str) -> str:
    return (
        "https://raw.githubusercontent.com/"
        f"{REPOSITORY}/{commit_sha}/plugin-dist/{PLUGIN_SLUG}-{version}.zip"
    )


def plugin_source_url(commit_sha: str) -> str:
    return (
        "https://raw.githubusercontent.com/"
        f"{REPOSITORY}/{commit_sha}/{PLUGIN_BASENAME}"
    )


def inspect_deploy_tool_source_contract(
    commit_sha: str, timeout: int
) -> dict[str, Any]:
    """Require this local mutation driver to equal protected-main source."""

    url = (
        "https://raw.githubusercontent.com/"
        f"{REPOSITORY}/{commit_sha}/{DEPLOY_TOOL_REPOSITORY_PATH}"
    )
    response = requests.get(
        url,
        headers={"User-Agent": "Jus-Tice-SEO-Recovery-P0-Driver-Source/0.1"},
        timeout=timeout,
        allow_redirects=False,
    )
    if response.status_code != 200 or not response.content:
        raise RuntimeError("Protected deploy-tool source did not return direct HTTP 200.")
    protected_source = response.content.replace(b"\r\n", b"\n")
    local_source = Path(__file__).read_bytes().replace(b"\r\n", b"\n")
    if protected_source != local_source:
        raise RuntimeError(
            "Local deploy tool differs from the same file on protected main."
        )
    return {
        "url": url,
        "sha256": hashlib.sha256(protected_source).hexdigest(),
        "local_sha256": hashlib.sha256(local_source).hexdigest(),
        "source_matches_local": True,
    }


def github_json(path: str, timeout: int) -> dict[str, Any]:
    response = requests.get(
        f"https://api.github.com/repos/{REPOSITORY}/{path.lstrip('/')}",
        headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "Jus-Tice-SEO-Recovery-P0-Provenance/0.1",
        },
        timeout=timeout,
        allow_redirects=False,
    )
    if response.status_code != 200:
        raise RuntimeError("GitHub provenance request did not return direct HTTP 200.")
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict):
        raise RuntimeError("GitHub provenance endpoint returned an invalid payload.")
    return payload


def verify_release_provenance(commit_sha: str, timeout: int) -> dict[str, Any]:
    """Require the exact active-ruleset main head and its successful guard."""

    ruleset = github_json(f"rulesets/{RELEASE_RULESET_ID}", timeout)
    rules = ruleset.get("rules") if isinstance(ruleset.get("rules"), list) else []
    rule_types = {str(rule.get("type") or "") for rule in rules if isinstance(rule, dict)}
    status_rules = [
        rule for rule in rules
        if isinstance(rule, dict) and rule.get("type") == "required_status_checks"
    ]
    status_parameters = (
        status_rules[0].get("parameters")
        if len(status_rules) == 1 and isinstance(status_rules[0].get("parameters"), dict)
        else {}
    )
    required_checks = status_parameters.get("required_status_checks")
    required_checks = required_checks if isinstance(required_checks, list) else []
    required_contexts = {
        str(item.get("context") or "")
        for item in required_checks
        if isinstance(item, dict)
    }
    conditions = ruleset.get("conditions") if isinstance(ruleset.get("conditions"), dict) else {}
    ref_name = conditions.get("ref_name") if isinstance(conditions.get("ref_name"), dict) else {}
    ruleset_valid = (
        int(ruleset.get("id") or 0) == RELEASE_RULESET_ID
        and ruleset.get("enforcement") == "active"
        and ruleset.get("target") == "branch"
        and not ruleset.get("bypass_actors")
        and "~DEFAULT_BRANCH" in (ref_name.get("include") or [])
        and {"deletion", "non_fast_forward", "required_linear_history", "pull_request", "required_status_checks"}.issubset(rule_types)
        and status_parameters.get("strict_required_status_checks_policy") is True
        and required_contexts == {REQUIRED_CHECK_NAME}
    )
    if not ruleset_valid:
        raise RuntimeError("The required active main release ruleset changed.")

    main_ref = github_json("git/ref/heads/main", timeout)
    main_object = main_ref.get("object") if isinstance(main_ref.get("object"), dict) else {}
    main_sha = str(main_object.get("sha") or "").lower()
    if main_sha != commit_sha:
        raise RuntimeError("--commit is not the current protected main head.")

    check_payload = github_json(f"commits/{commit_sha}/check-runs", timeout)
    check_runs = check_payload.get("check_runs")
    check_runs = check_runs if isinstance(check_runs, list) else []
    successful = [
        run for run in check_runs
        if isinstance(run, dict)
        and run.get("name") == REQUIRED_CHECK_NAME
        and str(run.get("head_sha") or "").lower() == commit_sha
        and run.get("status") == "completed"
        and run.get("conclusion") == "success"
        and isinstance(run.get("app"), dict)
        and run["app"].get("slug") == "github-actions"
    ]
    if not successful:
        raise RuntimeError("The protected main commit lacks a successful release guard.")
    guard = sorted(successful, key=lambda row: int(row.get("id") or 0))[-1]
    return {
        "ruleset_id": RELEASE_RULESET_ID,
        "ruleset_name": str(ruleset.get("name") or ""),
        "ruleset_enforcement": str(ruleset.get("enforcement") or ""),
        "ruleset_rule_types": sorted(rule_types),
        "strict_required_check": REQUIRED_CHECK_NAME,
        "main_head_sha": main_sha,
        "guard_check_id": int(guard.get("id") or 0),
        "guard_conclusion": str(guard.get("conclusion") or ""),
        "guard_details_url": str(guard.get("details_url") or ""),
    }


class WordpressClient:
    """Minimal WordPress REST client with a narrow UPress HTML-403 fallback."""

    def __init__(self, base_url: str, user: str, password: str):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.auth = (user, password)
        self.session.headers.update(
            {
                "Accept": "application/json",
                "User-Agent": "Jus-Tice-SEO-Recovery-P0-Deploy/0.1",
            }
        )

    @staticmethod
    def is_host_html_403(response: requests.Response) -> bool:
        content_type = response.headers.get("Content-Type", "").lower()
        prefix = response.text[:400].lower()
        return (
            response.status_code == 403
            and "json" not in content_type
            and ("<html" in prefix or "<!doctype" in prefix)
        )

    def request(
        self,
        method: str,
        route: str,
        *,
        json_body: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
        timeout: int = 60,
        require_success: bool = True,
    ) -> requests.Response:
        normalized = route.lstrip("/")
        response = self.session.request(
            method,
            f"{self.base_url}/wp-json/{normalized}",
            json=json_body,
            params=params,
            timeout=timeout,
            allow_redirects=False,
        )
        if self.is_host_html_403(response):
            fallback_params = {"rest_route": f"/{normalized}"}
            if params:
                fallback_params.update(params)
            response = self.session.request(
                method,
                f"{self.base_url}/",
                json=json_body,
                params=fallback_params,
                timeout=timeout,
                allow_redirects=False,
            )
        if require_success:
            response.raise_for_status()
        return response

    def get_snippet(self, snippet_id: int) -> requests.Response:
        return self.request(
            "GET",
            f"code-snippets/v1/snippets/{snippet_id}",
            require_success=False,
        )

    def all_snippets(self) -> list[dict[str, Any]]:
        snippets: list[dict[str, Any]] = []
        page = 1
        total_pages = 1
        while page <= total_pages:
            response = self.request(
                "GET",
                "code-snippets/v1/snippets",
                params={"per_page": 100, "page": page},
            )
            payload = response.json()
            if not isinstance(payload, list):
                raise RuntimeError("Code Snippets collection returned an invalid payload.")
            snippets.extend(payload)
            total_pages = int(response.headers.get("X-WP-TotalPages", "1"))
            page += 1
        return snippets


def validate_target_base_url(value: str) -> str:
    parts = urllib.parse.urlsplit(value.strip())
    if (
        parts.scheme.lower() != "https"
        or (parts.hostname or "").lower() != "jus-tice.co.il"
        or parts.port not in (None, 443)
        or parts.username
        or parts.password
        or parts.query
        or parts.fragment
        or parts.path.rstrip("/")
    ):
        raise RuntimeError("WP_BASE_URL must be exactly https://jus-tice.co.il.")
    return TARGET_BASE_URL


def verify_site_identity(client: WordpressClient) -> dict[str, Any]:
    response = client.request(
        "GET",
        "wp/v2/settings",
        params={"_fields": "title,url"},
        require_success=False,
    )
    if response.status_code != 200 or response.history:
        raise RuntimeError("Authenticated WordPress site identity preflight failed.")
    payload = response.json()
    if not isinstance(payload, dict):
        raise RuntimeError("WordPress settings returned an invalid site identity.")
    settings_url = str(payload.get("url") or "").rstrip("/")
    index_response = client.request("GET", "", require_success=False)
    if index_response.status_code != 200 or index_response.history:
        raise RuntimeError("WordPress REST index identity preflight failed.")
    index_payload = index_response.json()
    if not isinstance(index_payload, dict):
        raise RuntimeError("WordPress REST index returned an invalid site identity.")
    site_url = str(index_payload.get("url") or "").rstrip("/")
    home_url = str(index_payload.get("home") or "").rstrip("/")
    if (
        settings_url != TARGET_BASE_URL
        or site_url != TARGET_BASE_URL
        or home_url != TARGET_BASE_URL
    ):
        raise RuntimeError("Authenticated WordPress site identity does not match Jus-Tice.")
    return {
        "settings_status": response.status_code,
        "settings_redirect_count": len(response.history),
        "rest_index_status": index_response.status_code,
        "rest_index_redirect_count": len(index_response.history),
        "settings_url": settings_url,
        "site_url": site_url,
        "home_url": home_url,
        "title": str(payload.get("title") or ""),
    }


def response_summary(response: requests.Response) -> dict[str, Any]:
    """Return a bounded response summary without reflecting request secrets."""

    summary: dict[str, Any] = {
        "status": response.status_code,
        "content_type": response.headers.get("Content-Type", "").split(";", 1)[0],
    }
    try:
        payload = response.json()
    except (ValueError, json.JSONDecodeError):
        return summary
    if isinstance(payload, dict):
        for key in (
            "code",
            "success",
            "action",
            "plugin",
            "version",
            "marker",
            "active",
            "files_preserved",
            "helper_deleted",
            "helper_absent_after",
            "lock_released",
            "artifact_sha256",
            "artifact_bytes",
            "plugin_file_sha256",
            "prior_state",
            "rollback_attempted",
            "rollback_succeeded",
            "cache",
        ):
            if key in payload:
                summary[key] = payload[key]
        data = payload.get("data")
        if isinstance(data, dict):
            for key in (
                "status",
                "helper_deleted",
                "helper_absent_after",
                "lock_released",
                "rollback_attempted",
                "rollback_succeeded",
            ):
                if key in data:
                    summary[key] = data[key]
    return summary


def inspect_artifact(
    url: str,
    source_url: str,
    expected_sha256: str,
    expected_version: str,
    timeout: int,
) -> dict[str, Any]:
    """Independently fetch and validate the immutable release artifact."""

    response = requests.get(
        url,
        headers={"User-Agent": "Jus-Tice-SEO-Recovery-P0-Artifact-Probe/0.1"},
        timeout=timeout,
        allow_redirects=False,
    )
    if response.status_code != 200:
        raise RuntimeError("Immutable artifact did not return direct HTTP 200.")
    payload = response.content
    if not payload or len(payload) > MAX_ARTIFACT_BYTES:
        raise RuntimeError("Artifact size is empty or exceeds the bounded limit.")

    observed_sha256 = hashlib.sha256(payload).hexdigest()
    if observed_sha256 != expected_sha256:
        raise RuntimeError("Immutable artifact SHA-256 does not match the release input.")

    required_name = PLUGIN_BASENAME
    with zipfile.ZipFile(io.BytesIO(payload), "r") as archive:
        names = archive.namelist()
        if len(names) > 200:
            raise RuntimeError("Artifact contains an unexpected number of entries.")
        for name in names:
            if (
                "\\" in name
                or name.startswith("/")
                or any(part in ("", ".", "..") for part in name.rstrip("/").split("/"))
            ):
                raise RuntimeError("Artifact contains an unsafe ZIP path.")
        if names != [required_name]:
            raise RuntimeError("Artifact member set differs from the one-file release contract.")
        info = archive.getinfo(required_name)
        if (
            info.is_dir()
            or info.file_size <= 0
            or info.file_size > MAX_PLUGIN_FILE_BYTES
            or info.compress_size <= 0
            or info.file_size > info.compress_size * 20
            or info.date_time != (1980, 1, 1, 0, 0, 0)
            or info.create_system != 3
            or (info.external_attr >> 16) != 0o100644
            or info.compress_type != zipfile.ZIP_STORED
        ):
            raise RuntimeError("Artifact expansion bounds differ from the release contract.")
        main_php_bytes = archive.read(required_name)
        main_php = main_php_bytes.decode("utf-8-sig")

    source_response = requests.get(
        source_url,
        headers={"User-Agent": "Jus-Tice-SEO-Recovery-P0-Source-Probe/0.1"},
        timeout=timeout,
        allow_redirects=False,
    )
    if source_response.status_code != 200:
        raise RuntimeError("Protected plugin source did not return direct HTTP 200.")
    source_bytes = source_response.content.replace(b"\r\n", b"\n")
    if source_bytes != main_php_bytes:
        raise RuntimeError(
            "Artifact plugin bytes differ from source at the same protected commit."
        )

    version_match = re.search(
        r"^\s*\*\s*Version:\s*([^\r\n]+)$", main_php, flags=re.MULTILINE
    )
    if not version_match or version_match.group(1).strip() != expected_version:
        raise RuntimeError("Artifact plugin header version does not match --version.")

    return {
        "url": url,
        "sha256": observed_sha256,
        "bytes": len(payload),
        "zip_entries": len(names),
        "plugin_entry": required_name,
        "plugin_entry_bytes": info.file_size,
        "plugin_entry_compressed_bytes": info.compress_size,
        "plugin_entry_sha256": hashlib.sha256(main_php_bytes).hexdigest(),
        "source_url": source_url,
        "source_sha256": hashlib.sha256(source_bytes).hexdigest(),
        "source_matches_artifact": True,
        "header_version": expected_version,
    }


def php_literal(value: Any) -> str:
    """JSON scalars and arrays are valid PHP literals for the values used here."""

    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def build_helper_code(
    *,
    action: str,
    route_path: str,
    helper_id: int,
    helper_name: str,
    token: str,
    commit_sha: str,
    version: str,
    expected_artifact_sha256: str,
    expected_artifact_bytes: int,
    expected_plugin_file_sha256: str,
    expected_prior_state: str,
    immutable_artifact_url: str,
) -> tuple[str, str]:
    """Build PHP with an embedded normalized self-hash contract."""

    replacements = {
        "__ACTION__": php_literal(action),
        "__ROUTE_PATH__": php_literal(route_path),
        "__HELPER_ID__": str(helper_id),
        "__HELPER_NAME__": php_literal(helper_name),
        "__TOKEN__": php_literal(token),
        "__COMMIT_SHA__": php_literal(commit_sha),
        "__VERSION__": php_literal(version),
        "__ARTIFACT_SHA256__": php_literal(expected_artifact_sha256),
        "__ARTIFACT_BYTES__": str(expected_artifact_bytes),
        "__PLUGIN_FILE_SHA256__": php_literal(expected_plugin_file_sha256),
        "__EXPECTED_PRIOR_STATE__": php_literal(expected_prior_state),
        "__ARTIFACT_URL__": php_literal(immutable_artifact_url),
        "__TARGET_BASE_URL__": php_literal(TARGET_BASE_URL),
        "__PLUGIN_BASENAME__": php_literal(PLUGIN_BASENAME),
        "__AFFECTED_PATHS__": php_literal(list(AFFECTED_PATHS)),
        "__LOCK_NAME__": php_literal("justice_seo_recovery_p0_deploy_lock"),
    }

    code = r'''
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-seo-recovery-deploy/v1', __ROUTE_PATH__, array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$expected_action          = __ACTION__;
			$expected_route_path      = __ROUTE_PATH__;
			$expected_helper_id       = __HELPER_ID__;
			$expected_helper_name     = __HELPER_NAME__;
			$expected_token           = __TOKEN__;
			$expected_commit_sha      = __COMMIT_SHA__;
			$expected_version         = __VERSION__;
			$expected_artifact_sha256 = __ARTIFACT_SHA256__;
			$expected_artifact_bytes  = __ARTIFACT_BYTES__;
			$expected_plugin_sha256   = __PLUGIN_FILE_SHA256__;
			$expected_prior_state     = __EXPECTED_PRIOR_STATE__;
			$artifact_url             = __ARTIFACT_URL__;
			$expected_base_url        = __TARGET_BASE_URL__;
			$plugin_basename          = __PLUGIN_BASENAME__;
			$affected_paths           = __AFFECTED_PATHS__;
			$lock_name                = __LOCK_NAME__;
			$expected_normalized_hash = "__JUSTICE_P0_NORMALIZED_CODE_SHA256__";

			$temp_file          = '';
			$lock_acquired      = false;
			$lock_released      = false;
			$helper_deleted     = false;
			$helper_absent_after = false;
			$operation_result   = null;
			$failure_code       = '';
			$failure_message    = '';
			$failure_status     = 500;
			$mutation_started   = false;
			$rollback_attempted = false;
			$rollback_succeeded = true;
			$rollback_message   = '';

			try {
				$provided_token = (string) $request->get_param( 'token' );
				if ( ! hash_equals( $expected_token, $provided_token ) ) {
					throw new RuntimeException( 'The one-time operation token is invalid.', 403 );
				}

				if (
					$expected_base_url !== untrailingslashit( home_url( '/' ) )
					|| $expected_base_url !== untrailingslashit( site_url( '/' ) )
				) {
					throw new RuntimeException( 'The WordPress site identity changed.', 409 );
				}

				if (
					! function_exists( 'Code_Snippets\\get_snippet' )
					|| ! function_exists( 'Code_Snippets\\delete_snippet' )
				) {
					throw new RuntimeException( 'The required Code Snippets API is unavailable.', 500 );
				}

				$self = \Code_Snippets\get_snippet( $expected_helper_id, false );
				$provided_code_sha256 = strtolower( (string) $request->get_param( 'helper_code_sha256' ) );
				$self_code = $self ? (string) $self->code : '';
				$normalization_marker = '__JUSTICE_P0_' . 'NORMALIZED_CODE_SHA256__';
				$normalized_self_code = str_replace(
					$expected_normalized_hash,
					$normalization_marker,
					$self_code
				);
				$self_valid =
					$self
					&& $expected_helper_id === (int) $self->id
					&& $expected_helper_name === (string) $self->name
					&& 'global' === (string) $self->scope
					&& true === (bool) $self->active
					&& false === (bool) $self->network
					&& method_exists( $self, 'is_trashed' )
					&& false === $self->is_trashed()
					&& 1 === preg_match( '/^[a-f0-9]{64}$/', $provided_code_sha256 )
					&& hash_equals( $provided_code_sha256, hash( 'sha256', $self_code ) )
					&& hash_equals( $expected_normalized_hash, hash( 'sha256', $normalized_self_code ) )
					&& false !== strpos( $self_code, $expected_route_path )
					&& false !== strpos( $self_code, $expected_commit_sha );

				if ( ! $self_valid ) {
					throw new RuntimeException( 'The helper identity, state, or code hash changed.', 409 );
				}

				$lock_value = wp_json_encode( array(
					'helper_id'  => $expected_helper_id,
					'commit_sha' => $expected_commit_sha,
					'action'     => $expected_action,
					'created_at' => time(),
				) );
				$lock_acquired = add_option( $lock_name, $lock_value, '', false );
				if ( ! $lock_acquired ) {
					throw new RuntimeException( 'The bounded deployment lock is already held.', 409 );
				}

				require_once ABSPATH . 'wp-admin/includes/file.php';
				require_once ABSPATH . 'wp-admin/includes/misc.php';
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
				require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

				$plugin_file = WP_PLUGIN_DIR . '/' . $plugin_basename;
				$plugin_dir  = dirname( $plugin_file );
				$plugin_directory_exact = static function ( string $directory, string $expected_file ): bool {
					if ( ! is_dir( $directory ) || ! is_file( $expected_file ) || is_link( $directory ) || is_link( $expected_file ) ) {
						return false;
					}

					$expected_path = wp_normalize_path( $expected_file );
					$file_count     = 0;
					$iterator       = new RecursiveIteratorIterator(
						new RecursiveDirectoryIterator( $directory, FilesystemIterator::SKIP_DOTS ),
						RecursiveIteratorIterator::SELF_FIRST
					);
					foreach ( $iterator as $item ) {
						if ( $item->isLink() || $item->isDir() || ! $item->isFile() ) {
							return false;
						}
						$file_count++;
						if ( wp_normalize_path( $item->getPathname() ) !== $expected_path ) {
							return false;
						}
					}

					return 1 === $file_count;
				};
				$plugin_exists = is_file( $plugin_file );
				$current_active = $plugin_exists && is_plugin_active( $plugin_basename );
				$current_version = '';
				$current_plugin_sha256 = '';
				if ( $plugin_exists ) {
					$current_data = get_plugin_data( $plugin_file, false, false );
					$current_version = (string) ( $current_data['Version'] ?? '' );
					$current_hash = hash_file( 'sha256', $plugin_file );
					$current_plugin_sha256 = is_string( $current_hash ) ? strtolower( $current_hash ) : '';
				}
				$current_exact =
					$plugin_exists
					&& $plugin_directory_exact( $plugin_dir, $plugin_file )
					&& $expected_version === $current_version
					&& hash_equals( $expected_plugin_sha256, $current_plugin_sha256 );
				if (
					! $plugin_exists
					&& ! file_exists( $plugin_dir )
					&& ! is_link( $plugin_dir )
				) {
					$current_state = 'absent';
				} elseif ( $current_exact && $current_active ) {
					$current_state = 'active_exact';
				} elseif ( $current_exact && ! $current_active ) {
					$current_state = 'inactive_exact';
				} else {
					$current_state = 'different';
				}
				if ( $expected_prior_state !== $current_state ) {
					throw new RuntimeException( 'The installed plugin prior state changed.', 409 );
				}

				if ( 'install' === $expected_action ) {
					$temp_file = download_url( $artifact_url, 180 );
					if ( is_wp_error( $temp_file ) ) {
						throw new RuntimeException( 'The immutable artifact could not be downloaded.', 502 );
					}

					$observed_artifact_sha256 = hash_file( 'sha256', $temp_file );
					if (
						! is_string( $observed_artifact_sha256 )
						|| ! hash_equals( $expected_artifact_sha256, strtolower( $observed_artifact_sha256 ) )
					) {
						throw new RuntimeException( 'The downloaded artifact SHA-256 does not match.', 409 );
					}

					$artifact_bytes = filesize( $temp_file );
					if ( ! is_int( $artifact_bytes ) || $expected_artifact_bytes !== $artifact_bytes ) {
						throw new RuntimeException( 'The downloaded artifact byte count changed.', 409 );
					}

					$mutation_started = true;
					if ( 'absent' === $expected_prior_state ) {
						$skin = new WP_Ajax_Upgrader_Skin();
						$upgrader = new Plugin_Upgrader( $skin );
						$installed = $upgrader->install(
							$temp_file,
							array( 'overwrite_package' => false )
						);
						if ( is_wp_error( $installed ) || true !== $installed ) {
							throw new RuntimeException( 'Plugin_Upgrader did not confirm installation.', 500 );
						}
					}

					if ( ! is_plugin_active( $plugin_basename ) ) {
						$activated = activate_plugin( $plugin_basename, '', false, false );
						if ( is_wp_error( $activated ) ) {
							throw new RuntimeException( 'The reviewed plugin could not be activated.', 500 );
						}
					}

					wp_clean_plugins_cache( true );
					clearstatcache( true, $plugin_file );
					if (
						! is_file( $plugin_file )
						|| ! is_plugin_active( $plugin_basename )
						|| ! $plugin_directory_exact( $plugin_dir, $plugin_file )
					) {
						throw new RuntimeException( 'Installed plugin state could not be verified.', 500 );
					}
					$plugin_data = get_plugin_data( $plugin_file, false, false );
					$installed_hash = hash_file( 'sha256', $plugin_file );
					if (
						$expected_version !== (string) ( $plugin_data['Version'] ?? '' )
						|| ! is_string( $installed_hash )
						|| ! hash_equals( $expected_plugin_sha256, strtolower( $installed_hash ) )
					) {
						throw new RuntimeException( 'Installed plugin bytes do not match the reviewed artifact.', 409 );
					}

					$operation_result = array(
						'success'         => true,
						'action'          => 'install',
						'plugin'          => $plugin_basename,
						'version'         => $expected_version,
						'active'          => true,
						'artifact_sha256' => $expected_artifact_sha256,
						'artifact_bytes'  => is_int( $artifact_bytes ) ? $artifact_bytes : 0,
						'plugin_file_sha256' => $expected_plugin_sha256,
						'prior_state'     => $expected_prior_state,
					);
				} elseif ( 'deactivate' === $expected_action ) {
					$mutation_started = true;
					deactivate_plugins( $plugin_basename, false, false );
					wp_clean_plugins_cache( true );
					clearstatcache( true, $plugin_file );
					if (
						is_plugin_active( $plugin_basename )
						|| ! is_file( $plugin_file )
						|| ! $plugin_directory_exact( $plugin_dir, $plugin_file )
					) {
						throw new RuntimeException( 'Plugin deactivation or file preservation failed.', 500 );
					}
					$plugin_data_after = get_plugin_data( $plugin_file, false, false );
					$plugin_hash_after = hash_file( 'sha256', $plugin_file );
					if (
						$expected_version !== (string) ( $plugin_data_after['Version'] ?? '' )
						|| ! is_string( $plugin_hash_after )
						|| ! hash_equals( $expected_plugin_sha256, strtolower( $plugin_hash_after ) )
					) {
						throw new RuntimeException( 'Plugin files changed during deactivation.', 409 );
					}

					$operation_result = array(
						'success'         => true,
						'action'          => 'deactivate',
						'plugin'          => $plugin_basename,
						'version'         => $expected_version,
						'active'          => false,
						'files_preserved' => true,
						'plugin_file_sha256' => $expected_plugin_sha256,
						'prior_state'     => $expected_prior_state,
					);
				} else {
					throw new RuntimeException( 'Unsupported bounded operation.', 400 );
				}

				$affected_urls = array();
				foreach ( $affected_paths as $path ) {
					$url = home_url( $path );
					$affected_urls[] = $url;
					do_action( 'litespeed_purge_url', $url );
				}

				do_action( 'litespeed_purge_all' );
				$object_cache_flush_result = null;
				if ( function_exists( 'wp_cache_flush' ) ) {
					$object_cache_flush_result = (bool) wp_cache_flush();
				}
				if ( function_exists( 'rocket_clean_files' ) ) {
					rocket_clean_files( $affected_urls );
				}
				if ( function_exists( 'rocket_clean_domain' ) ) {
					rocket_clean_domain();
				}
				if ( function_exists( 'w3tc_flush_all' ) ) {
					w3tc_flush_all();
				}
				if ( function_exists( 'wp_cache_clear_cache' ) ) {
					wp_cache_clear_cache();
				}
				if ( class_exists( 'autoptimizeCache' ) && method_exists( 'autoptimizeCache', 'clearall' ) ) {
					autoptimizeCache::clearall();
				}
				if ( function_exists( 'sg_cachepress_purge_cache' ) ) {
					sg_cachepress_purge_cache();
				}
				clean_post_cache( 23405 );
				clean_post_cache( 23406 );
				$map_transient_delete_result = delete_transient( 'justice_map_geojson_v1' );

				$operation_result['cache'] = array(
					'object_cache_flush_result'       => $object_cache_flush_result,
					'map_transient_delete_result'      => $map_transient_delete_result,
					'litespeed_purge_all_dispatched'  => true,
					'litespeed_url_purge_dispatches'  => count( $affected_urls ),
					'affected_urls'                    => $affected_urls,
				);
			} catch ( Throwable $error ) {
				if ( $mutation_started ) {
					$rollback_attempted = true;
					$rollback_succeeded = false;
					try {
						if ( 'absent' === $expected_prior_state ) {
							if ( is_plugin_active( $plugin_basename ) ) {
								deactivate_plugins( $plugin_basename, false, false );
							}
							wp_clean_plugins_cache( true );
							if ( is_file( $plugin_file ) || is_dir( $plugin_dir ) ) {
								$deleted = delete_plugins( array( $plugin_basename ) );
								if ( is_wp_error( $deleted ) || true !== $deleted ) {
									throw new RuntimeException( 'Could not remove the newly installed rollback target.' );
								}
							}
							clearstatcache( true, $plugin_file );
							if ( file_exists( $plugin_dir ) || is_link( $plugin_dir ) ) {
								throw new RuntimeException( 'Rollback did not restore the absent plugin state.' );
							}
						} else {
							if ( ! is_file( $plugin_file ) ) {
								throw new RuntimeException( 'Rollback target plugin file disappeared.' );
							}
							if ( 'inactive_exact' === $expected_prior_state && is_plugin_active( $plugin_basename ) ) {
								deactivate_plugins( $plugin_basename, false, false );
							}
							if ( 'active_exact' === $expected_prior_state && ! is_plugin_active( $plugin_basename ) ) {
								$reactivated = activate_plugin( $plugin_basename, '', false, false );
								if ( is_wp_error( $reactivated ) ) {
									throw new RuntimeException( 'Rollback could not reactivate the exact plugin.' );
								}
							}
							wp_clean_plugins_cache( true );
							clearstatcache( true, $plugin_file );
							$rollback_data = get_plugin_data( $plugin_file, false, false );
							$rollback_hash = hash_file( 'sha256', $plugin_file );
							$rollback_active = is_plugin_active( $plugin_basename );
							$expected_active = 'active_exact' === $expected_prior_state;
							if (
								$expected_active !== $rollback_active
								|| ! $plugin_directory_exact( $plugin_dir, $plugin_file )
								|| $expected_version !== (string) ( $rollback_data['Version'] ?? '' )
								|| ! is_string( $rollback_hash )
								|| ! hash_equals( $expected_plugin_sha256, strtolower( $rollback_hash ) )
							) {
								throw new RuntimeException( 'Rollback did not restore the exact plugin state.' );
							}
						}
						$rollback_succeeded = true;
					} catch ( Throwable $rollback_error ) {
						$rollback_message = $rollback_error->getMessage();
					}
				}
				$failure_code    = 'justice_p0_operation_failed';
				$failure_message = $error->getMessage();
				if ( ! $rollback_succeeded ) {
					$failure_message .= ' Rollback failed: ' . $rollback_message;
				}
				$failure_status  = (int) $error->getCode();
				if ( $failure_status < 400 || $failure_status > 599 ) {
					$failure_status = 500;
				}
			} finally {
				if ( is_string( $temp_file ) && '' !== $temp_file && file_exists( $temp_file ) ) {
					@unlink( $temp_file );
				}
				if ( $lock_acquired ) {
					$lock_released = delete_option( $lock_name );
				}
				if ( function_exists( 'Code_Snippets\\delete_snippet' ) ) {
					$helper_deleted = (bool) \Code_Snippets\delete_snippet( $expected_helper_id, false );
				}
				if ( function_exists( 'Code_Snippets\\get_snippet' ) ) {
					$helper_after = \Code_Snippets\get_snippet( $expected_helper_id, false );
					$helper_absent_after = ! $helper_after || 0 === (int) $helper_after->id;
				}
			}

			if ( ! $helper_deleted || ! $helper_absent_after ) {
				return new WP_Error(
					'justice_p0_helper_cleanup_failed',
					'The temporary deployment helper could not hard-delete itself.',
					array(
						'status'              => 500,
						'helper_deleted'      => $helper_deleted,
						'helper_absent_after' => $helper_absent_after,
						'lock_released'       => $lock_released,
						'rollback_attempted'  => $rollback_attempted,
						'rollback_succeeded'  => $rollback_succeeded,
					)
				);
			}

			if ( '' !== $failure_code ) {
				return new WP_Error(
					$failure_code,
					$failure_message,
					array(
						'status'              => $failure_status,
						'helper_deleted'      => true,
						'helper_absent_after' => true,
						'lock_released'       => $lock_released,
						'rollback_attempted'  => $rollback_attempted,
						'rollback_succeeded'  => $rollback_succeeded,
					)
				);
			}

			$operation_result['commit_sha']          = $expected_commit_sha;
			$operation_result['helper_deleted']      = true;
			$operation_result['helper_absent_after'] = true;
			$operation_result['lock_released']       = $lock_released;
			$operation_result['rollback_attempted']  = false;
			$operation_result['rollback_succeeded']  = true;
			return $operation_result;
		},
	) );
} );
'''.strip()

    for marker, replacement in replacements.items():
        code = code.replace(marker, replacement)

    unresolved = [marker for marker in replacements if marker in code]
    if unresolved:
        raise RuntimeError(f"Generated helper contains unresolved markers: {unresolved}")
    if code.count(f'"{_SELF_HASH_MARKER}"') != 1:
        raise RuntimeError("Generated helper self-hash slot is not unique.")

    normalized_hash = sha256_text(code)
    final_code = code.replace(
        f'"{_SELF_HASH_MARKER}"', f'"{normalized_hash}"', 1
    )
    if _SELF_HASH_MARKER in final_code:
        raise RuntimeError("Generated helper contains an unresolved self-hash slot.")

    return final_code, normalized_hash


def lint_php_snippet(code: str) -> dict[str, Any]:
    """Lint the exact generated helper without persisting its token."""

    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", suffix=".php", delete=False
        ) as handle:
            handle.write("<?php\n")
            handle.write(code)
            handle.write("\n")
            temp_path = Path(handle.name)
        completed = subprocess.run(
            ["php", "-l", str(temp_path)],
            capture_output=True,
            text=True,
            timeout=30,
            check=False,
        )
        if completed.returncode != 0:
            raise RuntimeError("Generated PHP helper failed the local syntax gate.")
        return {"passed": True, "php_lint_exit_code": completed.returncode}
    except FileNotFoundError as error:
        raise RuntimeError("PHP is required to lint the generated helper.") from error
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


def snippet_identity(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": int(row.get("id") or 0),
        "name": str(row.get("name") or ""),
        "active": row.get("active"),
        "scope": str(row.get("scope") or ""),
        "code_sha256": sha256_text(str(row.get("code") or "")),
    }


def matching_snippets(
    rows: Iterable[dict[str, Any]], helper_id: int, helper_name: str
) -> list[dict[str, Any]]:
    return [
        row
        for row in rows
        if int(row.get("id") or 0) == helper_id
        or str(row.get("name") or "") == helper_name
    ]


def external_cleanup_fallback(
    client: WordpressClient,
    *,
    helper_id: int,
    helper_name: str,
    allowed_code_sha256: Iterable[str],
) -> dict[str, Any]:
    """Authenticated fallback if the callback could not hard-delete itself."""

    evidence: dict[str, Any] = {"attempted": False, "requests": []}
    rows = client.all_snippets()
    matches = matching_snippets(rows, helper_id, helper_name)
    if not matches:
        evidence["absent_before_fallback"] = True
        return evidence

    identity = snippet_identity(matches[0]) if len(matches) == 1 else {}
    allowed_hashes = set(allowed_code_sha256)
    if (
        len(matches) != 1
        or identity.get("id") != helper_id
        or identity.get("name") != helper_name
        or identity.get("scope") != "global"
        or identity.get("code_sha256") not in allowed_hashes
    ):
        evidence["refused_identity_mismatch"] = True
        return evidence

    evidence["attempted"] = True
    if matches[0].get("active") is True:
        response = client.request(
            "PUT",
            f"code-snippets/v1/snippets/{helper_id}/deactivate",
            json_body={},
            require_success=False,
        )
        evidence["requests"].append(
            {"operation": "deactivate", "status": response.status_code}
        )

    for attempt in range(1, 3):
        response = client.request(
            "DELETE",
            f"code-snippets/v1/snippets/{helper_id}",
            json_body={"force": True},
            params={"force": "true"},
            require_success=False,
        )
        evidence["requests"].append(
            {"operation": "delete", "attempt": attempt, "status": response.status_code}
        )
        if not matching_snippets(client.all_snippets(), helper_id, helper_name):
            break

    evidence["absent_after_fallback"] = not matching_snippets(
        client.all_snippets(), helper_id, helper_name
    )
    return evidence


def public_rest_request(
    base_url: str, route: str, *, timeout: int = 60
) -> requests.Response:
    """Issue an unauthenticated public verification with the narrow WAF fallback."""

    normalized = route.lstrip("/")
    headers = {
        "Accept": "application/json",
        "User-Agent": "Jus-Tice-SEO-Recovery-P0-Public-Verify/0.1",
    }
    response = requests.get(
        f"{base_url.rstrip('/')}/wp-json/{normalized}",
        headers=headers,
        params={"justice_p0_probe": secrets.token_hex(8)},
        timeout=timeout,
        allow_redirects=False,
    )
    if WordpressClient.is_host_html_403(response):
        response = requests.get(
            f"{base_url.rstrip('/')}/",
            headers=headers,
            params={
                "rest_route": f"/{normalized}",
                "justice_p0_probe": secrets.token_hex(8),
            },
            timeout=timeout,
            allow_redirects=False,
        )
    return response


def verify_live_theme_precondition(base_url: str, timeout: int) -> dict[str, Any]:
    """Require the observed live theme baseline without modifying theme files."""

    response = requests.get(
        f"{base_url.rstrip('/')}/wp-json/{THEME_HEALTH_ROUTE}",
        headers={
            "Accept": "application/json",
            "User-Agent": "Jus-Tice-SEO-Recovery-P0-Theme-Precondition/0.1",
        },
        params={"justice_p0_theme_probe": secrets.token_hex(8)},
        timeout=timeout,
        allow_redirects=False,
    )
    if response.status_code != 200:
        raise RuntimeError("Live theme healthcheck did not return direct HTTP 200.")
    try:
        payload = response.json()
    except (ValueError, json.JSONDecodeError) as error:
        raise RuntimeError("Live theme healthcheck returned invalid JSON.") from error
    if not isinstance(payload, dict):
        raise RuntimeError("Live theme healthcheck returned an invalid payload.")
    if (
        payload.get("theme") != "justice-theme"
        or payload.get("theme_version") != REQUIRED_LIVE_THEME_VERSION
        or payload.get("deploy_marker") != REQUIRED_LIVE_THEME_MARKER
    ):
        raise RuntimeError(
            "The live theme differs from the recorded plugin-only precondition."
        )
    return {
        "status": response.status_code,
        "redirect_count": len(response.history),
        "theme": str(payload.get("theme") or ""),
        "theme_version": str(payload.get("theme_version") or ""),
        "deploy_marker": str(payload.get("deploy_marker") or ""),
    }


def save_evidence(
    output_dir: Path,
    run_id: str,
    evidence: dict[str, Any],
    secrets_to_remove: Iterable[str],
) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    destination = output_dir / f"{run_id}.json"
    safe_evidence = redact(evidence, secrets_to_remove)
    destination.write_text(
        json.dumps(safe_evidence, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return destination


def state_reconciliation_observation(
    *,
    action: str,
    expected_prior_state: str,
    passed: bool,
    callback_attempted: bool,
    callback_confirmed: bool,
    desired_state_observed_by_health: bool,
    callback_reported_failed_rollback: bool,
) -> dict[str, Any]:
    """Describe fail-closed operator work after an attempted mutation."""

    requires_operator_reconciliation = bool(not passed and callback_attempted)
    if action == "install" and expected_prior_state == "absent":
        required_reconciliation = (
            "Inspect exact plugin state. If the exact plugin was installed, deactivate it; "
            "then remove only the exact SHA-pinned plugin files to restore the absent state."
        )
    elif action == "install":
        required_reconciliation = (
            "Inspect exact plugin state. If the exact plugin is active, deactivate it and "
            "preserve the already-reviewed files to restore inactive_exact."
        )
    else:
        required_reconciliation = (
            "Inspect exact plugin state. If the exact plugin is inactive, reactivate the "
            "same SHA-pinned files to restore active_exact."
        )

    return {
        "expected_prior_state": expected_prior_state,
        "callback_attempted": callback_attempted,
        "callback_confirmed": callback_confirmed,
        "desired_state_observed_by_health": desired_state_observed_by_health,
        "callback_reported_failed_rollback": callback_reported_failed_rollback,
        "automatic_reconciliation_performed": False,
        "state_is_ambiguous": requires_operator_reconciliation,
        "requires_operator_reconciliation": requires_operator_reconciliation,
        "safe_to_resume_without_reconciliation": not requires_operator_reconciliation,
        "required_reconciliation": (
            required_reconciliation
            if requires_operator_reconciliation
            else "none"
        ),
    }


def deployment_contract_self_test() -> dict[str, Any]:
    """Exercise source identity, helper syntax, and fail-closed state guidance."""

    plugin_source = (
        REPO_ROOT / PLUGIN_BASENAME
    ).read_text(encoding="utf-8-sig")
    plugin_header = re.search(
        r"^\s*\*\s*Version:\s*([^\r\n]+)$",
        plugin_source,
        flags=re.MULTILINE,
    )
    plugin_version = re.search(
        r"define\(\s*['\"]JUSTICE_P0_VERSION['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)",
        plugin_source,
    )
    plugin_marker = re.search(
        r"define\(\s*['\"]JUSTICE_P0_MARKER['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)",
        plugin_source,
    )
    if (
        not plugin_header
        or plugin_header.group(1).strip() != SUPPORTED_VERSION
        or not plugin_version
        or plugin_version.group(1) != SUPPORTED_VERSION
        or not plugin_marker
        or plugin_marker.group(1) != HEALTH_MARKER
    ):
        raise RuntimeError("Local plugin identity differs from deploy-tool constants.")

    helper_lints: list[dict[str, Any]] = []
    for action, prior_state in (
        ("install", "absent"),
        ("install", "inactive_exact"),
        ("deactivate", "active_exact"),
    ):
        helper_code, _ = build_helper_code(
            action=action,
            route_path="/run-self-test",
            helper_id=999999,
            helper_name="tmp-seo-p0-self-test",
            token="a" * 64,
            commit_sha="b" * 40,
            version=SUPPORTED_VERSION,
            expected_artifact_sha256="c" * 64,
            expected_artifact_bytes=1234,
            expected_plugin_file_sha256="d" * 64,
            expected_prior_state=prior_state,
            immutable_artifact_url=artifact_url("b" * 40, SUPPORTED_VERSION),
        )
        helper_lints.append(
            {
                "action": action,
                "prior_state": prior_state,
                **lint_php_snippet(helper_code),
            }
        )

    preflight_failure = state_reconciliation_observation(
        action="install",
        expected_prior_state="absent",
        passed=False,
        callback_attempted=False,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
    )
    lost_response = state_reconciliation_observation(
        action="install",
        expected_prior_state="absent",
        passed=False,
        callback_attempted=True,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
    )
    if (
        preflight_failure["requires_operator_reconciliation"] is not False
        or lost_response["requires_operator_reconciliation"] is not True
        or lost_response["safe_to_resume_without_reconciliation"] is not False
        or "remove only" not in str(lost_response["required_reconciliation"])
    ):
        raise RuntimeError("Fail-closed deployment reconciliation contract changed.")

    return {
        "passed": True,
        "required_live_theme_version": REQUIRED_LIVE_THEME_VERSION,
        "required_live_theme_marker": REQUIRED_LIVE_THEME_MARKER,
        "plugin_version": SUPPORTED_VERSION,
        "plugin_marker": HEALTH_MARKER,
        "helper_lints": helper_lints,
        "lost_response_requires_reconciliation": True,
    }


def run(args: argparse.Namespace) -> tuple[int, Path, dict[str, Any]]:
    commit_sha, version, expected_artifact_sha256 = validate_release_inputs(args)
    immutable_url = artifact_url(commit_sha, version)
    immutable_source_url = plugin_source_url(commit_sha)
    run_id = f"seo-recovery-p0-{args.action}-{utc_slug()}-{secrets.token_hex(4)}"
    helper_name = f"tmp-{run_id}"
    route_path = f"/run-{run_id}"
    route = f"{HELPER_NAMESPACE}{route_path}"
    token = secrets.token_hex(32)

    evidence: dict[str, Any] = {
        "schema_version": 1,
        "run_id": run_id,
        "started_at_utc": utc_now(),
        "action": args.action,
        "release": {
            "repository": REPOSITORY,
            "protected_commit_sha": commit_sha,
            "version": version,
            "artifact_sha256": expected_artifact_sha256,
            "immutable_artifact_url": immutable_url,
            "immutable_source_url": immutable_source_url,
            "plugin_basename": PLUGIN_BASENAME,
            "expected_prior_state": args.expected_prior_state,
            "mutation_scope": "plugin_only_preserve_live_theme",
            "required_live_theme_version": REQUIRED_LIVE_THEME_VERSION,
            "required_live_theme_marker": REQUIRED_LIVE_THEME_MARKER,
        },
        "helper": {"name": helper_name, "route": route},
        "checks": {},
        "passed": False,
    }

    secrets_to_remove: list[str] = [token]
    client: WordpressClient | None = None
    helper_id: int | None = None
    helper_code_sha256 = ""
    helper_allowed_code_sha256: set[str] = set()
    callback_success = False
    execution_error = ""

    try:
        env_file = resolve_env_file(args.env_file)
        env = read_env(env_file)
        missing = [
            key
            for key in ("WP_BASE_URL", "WP_USER", "WP_APP_PASSWORD")
            if not env.get(key)
        ]
        if missing:
            raise RuntimeError(
                "The environment file is missing required WordPress application-auth keys."
            )
        secrets_to_remove.extend(
            [env["WP_USER"], env["WP_APP_PASSWORD"]]
        )
        base_url = validate_target_base_url(env["WP_BASE_URL"])
        evidence["target"] = {"base_url": base_url}

        evidence["checks"]["protected_release_provenance"] = (
            verify_release_provenance(commit_sha, args.timeout)
        )
        evidence["checks"]["protected_deploy_tool_source"] = (
            inspect_deploy_tool_source_contract(commit_sha, args.timeout)
        )
        artifact_preflight = inspect_artifact(
            immutable_url,
            immutable_source_url,
            expected_artifact_sha256,
            version,
            args.timeout,
        )
        evidence["checks"]["client_artifact_preflight"] = artifact_preflight

        client = WordpressClient(
            base_url, env["WP_USER"], env["WP_APP_PASSWORD"]
        )
        evidence["checks"]["authenticated_site_identity"] = verify_site_identity(
            client
        )
        if args.action == "install":
            evidence["checks"]["required_live_theme_precondition"] = (
                verify_live_theme_precondition(base_url, args.timeout)
            )
        snippets_before = client.all_snippets()
        evidence["checks"]["authenticated_collection_preflight"] = {
            "passed": True,
            "count": len(snippets_before),
        }
        if any(str(row.get("name") or "") == helper_name for row in snippets_before):
            raise RuntimeError("The unique temporary helper name already exists.")

        placeholder_code = f"/* inactive placeholder for {helper_name} */"
        helper_allowed_code_sha256.add(sha256_text(placeholder_code))
        created_response = client.request(
            "POST",
            "code-snippets/v1/snippets",
            json_body={
                "name": helper_name,
                "code": placeholder_code,
                "scope": "global",
                "active": False,
            },
        )
        created = created_response.json()
        helper_id = int(created["id"])
        evidence["helper"]["id"] = helper_id

        helper_code, normalized_code_sha256 = build_helper_code(
            action=args.action,
            route_path=route_path,
            helper_id=helper_id,
            helper_name=helper_name,
            token=token,
            commit_sha=commit_sha,
            version=version,
            expected_artifact_sha256=expected_artifact_sha256,
            expected_artifact_bytes=int(artifact_preflight["bytes"]),
            expected_plugin_file_sha256=str(
                artifact_preflight["plugin_entry_sha256"]
            ),
            expected_prior_state=args.expected_prior_state,
            immutable_artifact_url=immutable_url,
        )
        helper_code_sha256 = sha256_text(helper_code)
        helper_allowed_code_sha256.add(helper_code_sha256)
        evidence["helper"].update(
            {
                "code_sha256": helper_code_sha256,
                "normalized_self_sha256": normalized_code_sha256,
            }
        )
        evidence["checks"]["generated_php_lint"] = lint_php_snippet(helper_code)

        client.request(
            "PUT",
            f"code-snippets/v1/snippets/{helper_id}",
            json_body={
                "name": helper_name,
                "code": helper_code,
                "scope": "global",
                "active": False,
            },
        )
        inactive_response = client.get_snippet(helper_id)
        inactive_response.raise_for_status()
        inactive_identity = snippet_identity(inactive_response.json())
        expected_inactive = {
            "id": helper_id,
            "name": helper_name,
            "active": False,
            "scope": "global",
            "code_sha256": helper_code_sha256,
        }
        evidence["checks"]["inactive_helper_preflight"] = inactive_identity
        if inactive_identity != expected_inactive:
            raise RuntimeError("Inactive helper identity, state, or code hash changed.")

        activate_response = client.request(
            "PUT",
            f"code-snippets/v1/snippets/{helper_id}/activate",
            json_body={},
            require_success=False,
        )
        evidence["checks"]["helper_activation_status"] = activate_response.status_code
        if activate_response.status_code != 200:
            raise RuntimeError("Temporary helper activation failed.")

        active_response = client.get_snippet(helper_id)
        active_response.raise_for_status()
        active_identity = snippet_identity(active_response.json())
        expected_active = dict(expected_inactive)
        expected_active["active"] = True
        evidence["checks"]["active_helper_preflight"] = active_identity
        if active_identity != expected_active:
            raise RuntimeError("Active helper identity, state, or code hash changed.")

        evidence["checks"]["operation_callback_attempted"] = True
        callback_response = client.request(
            "POST",
            route,
            json_body={
                "token": token,
                "helper_code_sha256": helper_code_sha256,
            },
            timeout=args.timeout,
            require_success=False,
        )
        callback_summary = response_summary(callback_response)
        evidence["checks"]["operation_callback"] = callback_summary
        callback_success = (
            callback_response.status_code == 200
            and callback_summary.get("success") is True
            and callback_summary.get("action") == args.action
            and callback_summary.get("plugin") == PLUGIN_BASENAME
            and callback_summary.get("version") == version
            and callback_summary.get("prior_state") == args.expected_prior_state
            and callback_summary.get("plugin_file_sha256")
            == artifact_preflight["plugin_entry_sha256"]
            and callback_summary.get("helper_deleted") is True
            and callback_summary.get("helper_absent_after") is True
            and callback_summary.get("lock_released") is True
            and callback_summary.get("rollback_attempted") is False
            and callback_summary.get("rollback_succeeded") is True
        )
        if args.action == "install":
            callback_success = (
                callback_success
                and callback_summary.get("active") is True
                and callback_summary.get("artifact_sha256")
                == expected_artifact_sha256
            )
        else:
            callback_success = (
                callback_success
                and callback_summary.get("active") is False
                and callback_summary.get("files_preserved") is True
            )
        if not callback_success:
            raise RuntimeError("The bounded WordPress callback did not pass acceptance.")
    except Exception as error:  # noqa: BLE001 - evidence must cover every failure.
        execution_error = str(error)
        evidence["error"] = {
            "type": type(error).__name__,
            "message": execution_error,
        }
    finally:
        if client is not None and helper_id is None and helper_allowed_code_sha256:
            try:
                undiscovered = [
                    row
                    for row in client.all_snippets()
                    if str(row.get("name") or "") == helper_name
                ]
                if len(undiscovered) == 1:
                    candidate = snippet_identity(undiscovered[0])
                    if (
                        candidate.get("scope") == "global"
                        and candidate.get("code_sha256")
                        in helper_allowed_code_sha256
                    ):
                        helper_id = int(candidate["id"])
                        evidence["helper"]["id"] = helper_id
                        evidence["checks"]["helper_id_recovered_after_error"] = True
            except Exception as discovery_error:  # noqa: BLE001
                evidence["checks"]["helper_id_recovery_error"] = {
                    "type": type(discovery_error).__name__
                }
        if client is not None and helper_id is not None and helper_allowed_code_sha256:
            try:
                evidence["checks"]["external_cleanup_fallback"] = (
                    external_cleanup_fallback(
                        client,
                        helper_id=helper_id,
                        helper_name=helper_name,
                        allowed_code_sha256=helper_allowed_code_sha256,
                    )
                )
            except Exception as cleanup_error:  # noqa: BLE001
                evidence["checks"]["external_cleanup_fallback"] = {
                    "attempted": True,
                    "error": type(cleanup_error).__name__,
                }

    helper_absent = False
    helper_direct_absent = False
    route_absent = False
    health_ok = False
    theme_unchanged_ok = args.action != "install"
    if client is not None and helper_id is not None:
        try:
            snippets_after = client.all_snippets()
            helper_absent = not matching_snippets(
                snippets_after, helper_id, helper_name
            )
            helper_direct = client.get_snippet(helper_id)
            route_after = client.request(
                "POST", route, json_body={}, require_success=False
            )
            helper_direct_summary = response_summary(helper_direct)
            route_after_summary = response_summary(route_after)
            helper_direct_absent = (
                helper_direct.status_code == 500
                and helper_direct_summary.get("code") == "rest_cannot_get"
            )
            route_absent = (
                route_after.status_code == 404
                and route_after_summary.get("code") == "rest_no_route"
            )
            evidence["checks"]["final_helper_cleanup"] = {
                "collection_count": len(snippets_after),
                "id_and_name_absent_from_collection": helper_absent,
                "direct_get": helper_direct_summary,
                "direct_get_confirms_absence": helper_direct_absent,
                "route_after": route_after_summary,
                "route_after_confirms_absence": route_absent,
            }

            public_health = public_rest_request(
                client.base_url, HEALTH_ROUTE, timeout=60
            )
            health_summary = response_summary(public_health)
            evidence["checks"]["public_health"] = health_summary
            if args.action == "install":
                health_ok = (
                    public_health.status_code == 200
                    and health_summary.get("version") == version
                    and health_summary.get("marker") == HEALTH_MARKER
                )
            else:
                health_ok = (
                    public_health.status_code == 404
                    and health_summary.get("code") == "rest_no_route"
                )

            if args.action == "install":
                evidence["checks"]["live_theme_unchanged_after_install"] = (
                    verify_live_theme_precondition(client.base_url, 60)
                )
                theme_unchanged_ok = True
        except Exception as verification_error:  # noqa: BLE001
            evidence["checks"]["final_verification_error"] = {
                "type": type(verification_error).__name__
            }

    passed = (
        callback_success
        and helper_absent
        and helper_direct_absent
        and route_absent
        and health_ok
        and theme_unchanged_ok
    )
    if execution_error and passed:
        passed = False
    desired_state_observed_by_health = (
        (args.action == "install" and health_ok)
        or (args.action == "deactivate" and health_ok)
    )
    callback_summary = (
        evidence.get("checks", {}).get("operation_callback", {})
        if isinstance(evidence.get("checks"), dict)
        else {}
    )
    callback_reported_failed_rollback = (
        isinstance(callback_summary, dict)
        and callback_summary.get("rollback_attempted") is True
        and callback_summary.get("rollback_succeeded") is not True
    )
    callback_attempted = (
        evidence.get("checks", {}).get("operation_callback_attempted") is True
        if isinstance(evidence.get("checks"), dict)
        else False
    )
    evidence["state_reconciliation"] = state_reconciliation_observation(
        action=args.action,
        expected_prior_state=args.expected_prior_state,
        passed=passed,
        callback_attempted=callback_attempted,
        callback_confirmed=callback_success,
        desired_state_observed_by_health=desired_state_observed_by_health,
        callback_reported_failed_rollback=callback_reported_failed_rollback,
    )
    evidence["passed"] = passed
    evidence["finished_at_utc"] = utc_now()

    output = save_evidence(
        args.output_dir.resolve(), run_id, evidence, secrets_to_remove
    )
    return (0 if passed else 3), output, redact(evidence, secrets_to_remove)


def main(argv: list[str] | None = None) -> int:
    effective_argv = list(sys.argv[1:] if argv is None else argv)
    if effective_argv == ["--self-test"]:
        try:
            print(
                json.dumps(
                    deployment_contract_self_test(),
                    ensure_ascii=False,
                    indent=2,
                )
            )
            return 0
        except Exception as error:  # noqa: BLE001 - self-test must fail closed.
            print(
                json.dumps(
                    {
                        "passed": False,
                        "error": type(error).__name__,
                        "message": str(error),
                    },
                    ensure_ascii=False,
                    indent=2,
                )
            )
            return 2

    try:
        import requests as requests_module
    except ModuleNotFoundError:
        print(
            json.dumps(
                {
                    "passed": False,
                    "error": "MissingDependency",
                    "message": (
                        "The deployment path requires the Python 'requests' package."
                    ),
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        return 2
    globals()["requests"] = requests_module

    args = parse_args(effective_argv)
    try:
        exit_code, output, evidence = run(args)
    except Exception as error:  # Input failure before evidence initialization.
        print(
            json.dumps(
                {
                    "passed": False,
                    "error": type(error).__name__,
                    "message": str(error),
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        return 2

    summary = {
        "evidence": str(output),
        "passed": bool(evidence.get("passed")),
        "action": evidence.get("action"),
        "commit_sha": evidence.get("release", {}).get("protected_commit_sha"),
        "version": evidence.get("release", {}).get("version"),
        "helper_absent": evidence.get("checks", {})
        .get("final_helper_cleanup", {})
        .get("id_and_name_absent_from_collection", False),
        "route_after_status": evidence.get("checks", {})
        .get("final_helper_cleanup", {})
        .get("route_after", {})
        .get("status"),
        "requires_operator_reconciliation": evidence.get(
            "state_reconciliation", {}
        ).get(
            "requires_operator_reconciliation", False
        ),
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
