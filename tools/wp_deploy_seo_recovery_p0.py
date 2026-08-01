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
from typing import Any, Iterable, Mapping


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
RELEASE_WORKFLOW_PATH = ".github/workflows/repository-release-guard.yml"
RELEASE_WORKFLOW_NAME = "Repository Release Guard"
PLUGIN_SLUG = "justice-seo-recovery-p0"
PLUGIN_BASENAME = f"{PLUGIN_SLUG}/{PLUGIN_SLUG}.php"
SUPPORTED_VERSION = "0.1.2"
SUPPORTED_PRIOR_VERSION = "0.1.1"
SUPPORTED_PRIOR_MARKER = "p0-plugin-only-20260801-v2"
SUPPORTED_PRIOR_COMMIT_SHA = "639fc74da19cbc58769bc614487a57898a98e815"
SUPPORTED_PRIOR_ARTIFACT_SHA256 = (
    "f8139efa86e185235faa1e66119719d7e4af0a5138eab69be54d266cbd7180d9"
)
SUPPORTED_PRIOR_PLUGIN_FILE_SHA256 = (
    "c3a70cee3831ccb5cdabd910cf12af0c35fd3b0b81f964c1f795acec002b6b5c"
)
HEALTH_ROUTE = "justice-seo-recovery/v1/healthcheck"
HEALTH_MARKER = "p0-plugin-only-20260801-v3"
MOBILE_NAV_STYLE_ELEMENT_ID = "justice-p0-mobile-nav-recovery-inline-css"
MOBILE_NAV_CSS_MARKER = "justice-p0-mobile-nav-recovery-v1"
REQUIRED_LIVE_THEME_VERSION = "2.23.0"
REQUIRED_LIVE_THEME_MARKER = "2026-07-06-home-keywords-upperfold-v1"
THEME_HEALTH_ROUTE = "justice/v1/healthcheck"
DEPLOY_TOOL_REPOSITORY_PATH = "tools/wp_deploy_seo_recovery_p0.py"
HELPER_NAMESPACE = "justice-seo-recovery-deploy/v1"
DEPLOY_LOCK_CONTRACT = "justice-seo-recovery-p0-lock-v1"
DEPLOY_LOCK_SCHEMA_VERSION = 1
DEPLOY_LOCK_STALE_AFTER_SECONDS = 4 * 60 * 60
MAX_ARTIFACT_BYTES = 20 * 1024 * 1024
MAX_PLUGIN_FILE_BYTES = 1024 * 1024

AFFECTED_PATHS = (
    "/",
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
    "/practice-areas/criminal-law/",
    "/lawyers/",
    "/city/tel-aviv/",
    "/lawyers/מאיה-רוטנברג-חברת-עורכי-דין/",
    "/lawyers/מאיה-רוטנברג-משרד-עורכי-דין/",
    "/sitemap-jus-tice/",
    "/site-map/",
    "/html-sitemap/",
    "/sitemap_index.xml",
    "/articles-sitemap.xml",
    "/articles-sitemap2.xml",
    "/justice_lawyer-sitemap.xml",
    "/justice_lawyer-sitemap2.xml",
    "/category-sitemap.xml",
    "/practice-areas-sitemap.xml",
    "/wp-json/justice/v1/sitemap",
    "/wp-json/justice/v1/sitemap/lawyers",
    "/?rest_route=/justice/v1/sitemap",
    "/?rest_route=/justice/v1/sitemap/lawyers",
)

_COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")
_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
_VERSION_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?$")
_SELF_HASH_MARKER = "__JUSTICE_P0_NORMALIZED_CODE_SHA256__"
_DEPLOY_RUN_ID_RE = re.compile(
    r"^seo-recovery-p0-(?:install|deactivate|reactivate|rollback-supported-prior)-"
    r"[0-9]{8}T[0-9]{6}Z-[a-f0-9]{8}$"
)
VALID_DEPLOY_TRANSITIONS = frozenset(
    {
        ("install", "absent"),
        ("install", "inactive_exact"),
        ("install", "inactive_supported_prior"),
        ("deactivate", "active_exact"),
        ("deactivate", "active_supported_prior"),
        ("reactivate", "inactive_supported_prior"),
        ("rollback-supported-prior", "active_exact"),
    }
)
DEPLOY_LOCK_OWNER_KEYS = frozenset(
    {
        "schema_version",
        "contract",
        "base_url",
        "plugin",
        "run_id",
        "helper_id",
        "helper_name",
        "route_path",
        "helper_code_sha256",
        "commit_sha",
        "action",
        "expected_prior_state",
        "owner_nonce_sha256",
        "acquired_at",
    }
)


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
    parser.add_argument(
        "action",
        choices=(
            "install",
            "deactivate",
            "reactivate",
            "rollback-supported-prior",
        ),
    )
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
        choices=(
            "absent",
            "inactive_exact",
            "active_exact",
            "inactive_supported_prior",
            "active_supported_prior",
        ),
        required=True,
    )
    parser.add_argument("--expected-prior-version", default="")
    parser.add_argument("--expected-prior-marker", default="")
    parser.add_argument("--expected-prior-artifact-sha256", default="")
    parser.add_argument("--expected-prior-plugin-file-sha256", default="")
    parser.add_argument("--env-file", type=Path)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--timeout", type=int, default=240)
    return parser.parse_args(argv)


def validate_release_inputs(
    args: argparse.Namespace,
) -> tuple[str, str, str, str, str, str, str]:
    commit_sha = str(args.commit_sha).strip().lower()
    version = str(args.version).strip()
    artifact_sha256 = str(args.artifact_sha256).strip().lower()
    prior_version = str(args.expected_prior_version).strip()
    prior_marker = str(args.expected_prior_marker).strip()
    prior_artifact_sha256 = str(args.expected_prior_artifact_sha256).strip().lower()
    prior_plugin_file_sha256 = str(
        args.expected_prior_plugin_file_sha256
    ).strip().lower()

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
    allowed_transitions = {
        "install": {"absent", "inactive_exact", "inactive_supported_prior"},
        "deactivate": {"active_exact", "active_supported_prior"},
        "reactivate": {"inactive_supported_prior"},
        "rollback-supported-prior": {"active_exact"},
    }
    if args.expected_prior_state not in allowed_transitions[args.action]:
        raise RuntimeError(
            f"{args.action} does not accept prior state {args.expected_prior_state}."
        )

    uses_supported_prior = (
        args.expected_prior_state
        in {"inactive_supported_prior", "active_supported_prior"}
        or args.action == "rollback-supported-prior"
    )
    supplied_prior = (
        prior_version,
        prior_marker,
        prior_artifact_sha256,
        prior_plugin_file_sha256,
    )
    pinned_prior = (
        SUPPORTED_PRIOR_VERSION,
        SUPPORTED_PRIOR_MARKER,
        SUPPORTED_PRIOR_ARTIFACT_SHA256,
        SUPPORTED_PRIOR_PLUGIN_FILE_SHA256,
    )
    if uses_supported_prior and supplied_prior != pinned_prior:
        raise RuntimeError(
            "Supported-prior operations require the exact pinned 0.1.1 "
            "version, marker, artifact SHA-256, and plugin-file SHA-256."
        )
    if not uses_supported_prior and any(supplied_prior):
        raise RuntimeError(
            "Prior release pins are valid only for a supported-prior state."
        )

    return (
        commit_sha,
        version,
        artifact_sha256,
        prior_version,
        prior_marker,
        prior_artifact_sha256,
        prior_plugin_file_sha256,
    )


def artifact_url(commit_sha: str, version: str) -> str:
    return (
        "https://raw.githubusercontent.com/"
        f"{REPOSITORY}/{commit_sha}/plugin-dist/{PLUGIN_SLUG}-{version}.zip"
    )


def prior_artifact_url() -> str:
    return artifact_url(SUPPORTED_PRIOR_COMMIT_SHA, SUPPORTED_PRIOR_VERSION)


def prior_plugin_source_url() -> str:
    return plugin_source_url(SUPPORTED_PRIOR_COMMIT_SHA)


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


def parse_guard_details_url(details_url: str, check_run_id: int) -> tuple[int, int]:
    """Bind one GitHub Actions check run to its exact repository run and job."""

    try:
        parts = urllib.parse.urlsplit(details_url)
    except (UnicodeError, ValueError) as error:
        raise RuntimeError("Release guard details URL is invalid.") from error
    match = re.fullmatch(
        r"/The-new-ben/justice-theme/actions/runs/([1-9][0-9]*)/job/([1-9][0-9]*)",
        parts.path,
    )
    if (
        parts.scheme != "https"
        or parts.netloc != "github.com"
        or parts.username is not None
        or parts.password is not None
        or parts.query
        or parts.fragment
        or match is None
    ):
        raise RuntimeError("Release guard details URL is not the exact Actions job URL.")
    run_id = int(match.group(1))
    job_id = int(match.group(2))
    if job_id != check_run_id:
        raise RuntimeError("Release guard job ID does not equal its check-run ID.")
    return run_id, job_id


def verify_guard_workflow_run(
    guard: dict[str, Any],
    *,
    commit_sha: str,
    timeout: int,
) -> dict[str, Any]:
    """Prove a successful check is the exact protected push workflow and job."""

    check_run_id = int(guard.get("id") or 0)
    details_url = str(guard.get("details_url") or "")
    run_id, job_id = parse_guard_details_url(details_url, check_run_id)
    actions_run = github_json(f"actions/runs/{run_id}", timeout)
    workflow_path = str(actions_run.get("path") or "")
    repository = (
        actions_run.get("repository")
        if isinstance(actions_run.get("repository"), dict)
        else {}
    )
    head_repository = (
        actions_run.get("head_repository")
        if isinstance(actions_run.get("head_repository"), dict)
        else {}
    )
    expected_run_url = f"https://github.com/{REPOSITORY}/actions/runs/{run_id}"
    run_valid = (
        int(actions_run.get("id") or 0) == run_id
        and workflow_path
        in {RELEASE_WORKFLOW_PATH, f"{RELEASE_WORKFLOW_PATH}@main"}
        and actions_run.get("event") == "push"
        and actions_run.get("head_branch") == "main"
        and str(actions_run.get("head_sha") or "").lower() == commit_sha
        and actions_run.get("status") == "completed"
        and actions_run.get("conclusion") == "success"
        and repository.get("full_name") == REPOSITORY
        and head_repository.get("full_name") == REPOSITORY
        and actions_run.get("html_url") == expected_run_url
    )
    if not run_valid:
        raise RuntimeError("Release guard Actions run provenance changed.")

    actions_job = github_json(f"actions/jobs/{job_id}", timeout)
    expected_job_api_url = (
        f"https://api.github.com/repos/{REPOSITORY}/actions/jobs/{job_id}"
    )
    expected_run_api_url = (
        f"https://api.github.com/repos/{REPOSITORY}/actions/runs/{run_id}"
    )
    expected_check_api_url = (
        f"https://api.github.com/repos/{REPOSITORY}/check-runs/{check_run_id}"
    )
    job_valid = (
        int(actions_job.get("id") or 0) == job_id
        and int(actions_job.get("run_id") or 0) == run_id
        and actions_job.get("name") == REQUIRED_CHECK_NAME
        and actions_job.get("status") == "completed"
        and actions_job.get("conclusion") == "success"
        and str(actions_job.get("head_sha") or "").lower() == commit_sha
        and actions_job.get("head_branch") == "main"
        and actions_job.get("workflow_name") == RELEASE_WORKFLOW_NAME
        and actions_job.get("html_url") == details_url
        and actions_job.get("url") == expected_job_api_url
        and actions_job.get("run_url") == expected_run_api_url
        and actions_job.get("check_run_url") == expected_check_api_url
    )
    if not job_valid:
        raise RuntimeError("Release guard Actions job provenance changed.")

    return {
        "guard_run_id": run_id,
        "guard_job_id": job_id,
        "guard_workflow_path": workflow_path,
        "guard_workflow_name": str(actions_job.get("workflow_name") or ""),
        "guard_event": str(actions_run.get("event") or ""),
        "guard_head_branch": str(actions_run.get("head_branch") or ""),
        "guard_head_sha": str(actions_run.get("head_sha") or "").lower(),
        "guard_repository": str(repository.get("full_name") or ""),
        "guard_head_repository": str(head_repository.get("full_name") or ""),
        "guard_run_status": str(actions_run.get("status") or ""),
        "guard_run_conclusion": str(actions_run.get("conclusion") or ""),
        "guard_job_status": str(actions_job.get("status") or ""),
        "guard_job_conclusion": str(actions_job.get("conclusion") or ""),
    }


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
    workflow_provenance = verify_guard_workflow_run(
        guard,
        commit_sha=commit_sha,
        timeout=timeout,
    )
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
        **workflow_provenance,
    }


def verify_supported_prior_provenance(
    candidate_commit_sha: str, timeout: int
) -> dict[str, Any]:
    """Prove the pinned 0.1.1 release is a guarded ancestor of candidate main."""

    comparison = github_json(
        f"compare/{SUPPORTED_PRIOR_COMMIT_SHA}...{candidate_commit_sha}",
        timeout,
    )
    base_commit = (
        comparison.get("base_commit")
        if isinstance(comparison.get("base_commit"), dict)
        else {}
    )
    merge_base = (
        comparison.get("merge_base_commit")
        if isinstance(comparison.get("merge_base_commit"), dict)
        else {}
    )
    if (
        comparison.get("status") not in {"ahead", "identical"}
        or str(base_commit.get("sha") or "").lower()
        != SUPPORTED_PRIOR_COMMIT_SHA
        or str(merge_base.get("sha") or "").lower()
        != SUPPORTED_PRIOR_COMMIT_SHA
    ):
        raise RuntimeError("Pinned supported prior is not an ancestor of candidate main.")

    check_payload = github_json(
        f"commits/{SUPPORTED_PRIOR_COMMIT_SHA}/check-runs",
        timeout,
    )
    check_runs = check_payload.get("check_runs")
    check_runs = check_runs if isinstance(check_runs, list) else []
    successful = [
        run
        for run in check_runs
        if isinstance(run, dict)
        and run.get("name") == REQUIRED_CHECK_NAME
        and str(run.get("head_sha") or "").lower()
        == SUPPORTED_PRIOR_COMMIT_SHA
        and run.get("status") == "completed"
        and run.get("conclusion") == "success"
        and isinstance(run.get("app"), dict)
        and run["app"].get("slug") == "github-actions"
    ]
    if not successful:
        raise RuntimeError("Pinned supported prior lacks its successful release guard.")
    guard = sorted(successful, key=lambda row: int(row.get("id") or 0))[-1]
    workflow_provenance = verify_guard_workflow_run(
        guard,
        commit_sha=SUPPORTED_PRIOR_COMMIT_SHA,
        timeout=timeout,
    )
    return {
        "prior_commit_sha": SUPPORTED_PRIOR_COMMIT_SHA,
        "candidate_commit_sha": candidate_commit_sha,
        "comparison_status": str(comparison.get("status") or ""),
        "merge_base_sha": str(merge_base.get("sha") or "").lower(),
        "guard_check_name": REQUIRED_CHECK_NAME,
        "guard_check_id": int(guard.get("id") or 0),
        "guard_conclusion": str(guard.get("conclusion") or ""),
        "guard_details_url": str(guard.get("details_url") or ""),
        **workflow_provenance,
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


def cache_evidence_is_exact(value: object) -> bool:
    """Accept cache evidence only when the required object flush returned exact true."""

    return bool(
        isinstance(value, dict)
        and value.get("object_cache_flush_result") is True
        and value.get("litespeed_purge_all_dispatched") is True
        and value.get("litespeed_url_purge_dispatches") == len(AFFECTED_PATHS)
        and value.get("affected_urls")
        == [f"{TARGET_BASE_URL}{path}" for path in AFFECTED_PATHS]
        and value.get("post_cache_ids") == [7905, 23405, 23406]
        and value.get("term_cache_ids") == [170, 730]
    )


def stale_lock_record_is_recoverable(
    value: object,
    *,
    protected_commit_sha: str,
    now_epoch: int,
    next_action: str,
    next_expected_prior_state: str,
) -> bool:
    """Mirror the exact server stale-owner contract without coupling old/new actions."""

    if (
        not isinstance(value, dict)
        or frozenset(value) != DEPLOY_LOCK_OWNER_KEYS
        or (next_action, next_expected_prior_state) not in VALID_DEPLOY_TRANSITIONS
    ):
        return False
    run_id = value.get("run_id")
    helper_id = value.get("helper_id")
    acquired_at = value.get("acquired_at")
    action = value.get("action")
    expected_prior_state = value.get("expected_prior_state")
    return bool(
        value.get("schema_version") == DEPLOY_LOCK_SCHEMA_VERSION
        and type(value.get("schema_version")) is int
        and value.get("contract") == DEPLOY_LOCK_CONTRACT
        and value.get("base_url") == TARGET_BASE_URL
        and value.get("plugin") == PLUGIN_BASENAME
        and isinstance(run_id, str)
        and _DEPLOY_RUN_ID_RE.fullmatch(run_id)
        and type(helper_id) is int
        and helper_id > 0
        and value.get("helper_name") == f"tmp-{run_id}"
        and value.get("route_path") == f"/run-{run_id}"
        and isinstance(value.get("helper_code_sha256"), str)
        and _SHA256_RE.fullmatch(str(value.get("helper_code_sha256")))
        and value.get("commit_sha") == protected_commit_sha
        and _COMMIT_RE.fullmatch(protected_commit_sha)
        and isinstance(action, str)
        and isinstance(expected_prior_state, str)
        and (action, expected_prior_state) in VALID_DEPLOY_TRANSITIONS
        and isinstance(value.get("owner_nonce_sha256"), str)
        and _SHA256_RE.fullmatch(str(value.get("owner_nonce_sha256")))
        and type(acquired_at) is int
        and acquired_at > 0
        and type(now_epoch) is int
        and now_epoch - acquired_at > DEPLOY_LOCK_STALE_AFTER_SECONDS
    )


def lock_evidence_is_accepted(value: object) -> bool:
    """Accept only a fully acquired, ownership-checked, owner-CAS-released lock."""

    if not isinstance(value, dict):
        return False
    common_valid = (
        value.get("contract") == DEPLOY_LOCK_CONTRACT
        and value.get("schema_version") == DEPLOY_LOCK_SCHEMA_VERSION
        and type(value.get("schema_version")) is int
        and value.get("stale_after_seconds") == DEPLOY_LOCK_STALE_AFTER_SECONDS
        and type(value.get("stale_after_seconds")) is int
        and value.get("acquired") is True
        and value.get("owner_reread_exact") is True
        and type(value.get("owner_assertions_passed")) is int
        and int(value.get("owner_assertions_passed") or 0) > 0
        and value.get("owner_assertion_failed") is False
        and value.get("release_required") is True
        and value.get("release_attempted") is True
        and value.get("release_precondition_exact") is True
        and value.get("release_cas_rows") == 1
        and type(value.get("release_cas_rows")) is int
        and value.get("release_absence_confirmed") is True
        and value.get("release_error") == ""
        and value.get("released") is True
    )
    if not common_valid:
        return False

    mode = value.get("acquisition_mode")
    if mode == "fresh_add":
        return bool(
            value.get("stale_lock_inspected") is False
            and value.get("stale_lock_identity_valid") is False
            and value.get("stale_lock_age_seconds") is None
            and value.get("stale_owner_sha256") == ""
            and value.get("stale_action") == ""
            and value.get("stale_expected_prior_state") == ""
            and value.get("stale_transition_valid") is False
            and value.get("stale_cas_rows") == 0
            and type(value.get("stale_cas_rows")) is int
            and value.get("old_helper_present") is None
            and value.get("old_helper_identity_valid") is None
            and value.get("old_helper_deleted") is None
            and value.get("old_helper_absent_after") is None
            and value.get("prior_process_death_ambiguity") is False
            and value.get("exact_prior_state_precondition_verified") is False
        )
    if mode != "stale_cas":
        return False

    stale_age = value.get("stale_lock_age_seconds")
    old_helper_present = value.get("old_helper_present")
    stale_transition = (
        value.get("stale_action"),
        value.get("stale_expected_prior_state"),
    )
    return bool(
        value.get("stale_lock_inspected") is True
        and value.get("stale_lock_identity_valid") is True
        and type(stale_age) is int
        and stale_age > DEPLOY_LOCK_STALE_AFTER_SECONDS
        and isinstance(value.get("stale_owner_sha256"), str)
        and _SHA256_RE.fullmatch(str(value.get("stale_owner_sha256")))
        and stale_transition in VALID_DEPLOY_TRANSITIONS
        and value.get("stale_transition_valid") is True
        and value.get("stale_cas_rows") == 1
        and type(value.get("stale_cas_rows")) is int
        and type(old_helper_present) is bool
        and value.get("old_helper_identity_valid") is True
        and (
            value.get("old_helper_deleted") is True
            if old_helper_present
            else value.get("old_helper_deleted") is None
        )
        and value.get("old_helper_absent_after") is True
        and value.get("prior_process_death_ambiguity") is True
        and value.get("exact_prior_state_precondition_verified") is True
    )


def lock_release_cleanup_is_proven(
    callback_summary: Mapping[str, Any],
    *,
    callback_attempted: bool,
) -> bool:
    """Distinguish a proven no-lock path from an acquired-and-released lock."""

    if not callback_attempted:
        return True
    lock = callback_summary.get("lock")
    if not isinstance(lock, dict):
        return False
    if callback_summary.get("lock_acquired") is False:
        return bool(
            callback_summary.get("lock_release_required") is False
            and callback_summary.get("lock_release_attempted") is False
            and callback_summary.get("lock_released") is None
            and lock.get("acquisition_mode") == "not_acquired"
            and lock.get("acquired") is False
            and lock.get("release_required") is False
            and lock.get("release_attempted") is False
            and lock.get("released") is None
        )
    return bool(
        callback_summary.get("lock_acquired") is True
        and callback_summary.get("lock_release_required") is True
        and callback_summary.get("lock_release_attempted") is True
        and callback_summary.get("lock_released") is True
        and lock.get("release_required") is True
        and lock.get("release_attempted") is True
        and lock.get("release_precondition_exact") is True
        and lock.get("release_cas_rows") == 1
        and type(lock.get("release_cas_rows")) is int
        and lock.get("release_absence_confirmed") is True
        and lock.get("release_error") == ""
        and lock.get("released") is True
    )


def stale_helper_cleanup_is_proven(
    callback_summary: Mapping[str, Any],
    *,
    callback_attempted: bool,
) -> bool:
    """Prove a stale predecessor was absent or exactly deleted after ownership CAS."""

    if not callback_attempted:
        return True
    lock = callback_summary.get("lock")
    if not isinstance(lock, dict):
        return False
    mode = lock.get("acquisition_mode")
    if mode in {"not_acquired", "fresh_add"}:
        return True
    old_helper_present = lock.get("old_helper_present")
    return bool(
        mode == "stale_cas"
        and lock.get("stale_lock_identity_valid") is True
        and type(old_helper_present) is bool
        and lock.get("old_helper_identity_valid") is True
        and (
            lock.get("old_helper_deleted") is True
            if old_helper_present
            else lock.get("old_helper_deleted") is None
        )
        and lock.get("old_helper_absent_after") is True
    )


def modeled_stale_helper_cleanup(
    *,
    initially_present: bool,
    deletion_confirmed: bool | None,
    post_cas_reread_absent: bool,
) -> dict[str, object]:
    """Model conditional deletion followed by an unconditional post-CAS reread."""

    old_helper_deleted = deletion_confirmed if initially_present else None
    deletion_proven = (
        deletion_confirmed is True if initially_present else deletion_confirmed is None
    )
    return {
        "old_helper_deleted": old_helper_deleted,
        "post_cas_absence_reread_performed": True,
        "old_helper_absent_after": post_cas_reread_absent,
        "stale_recovery_cleanup_only": bool(
            deletion_proven and post_cas_reread_absent
        ),
        "event_order": [
            "ownership_cas",
            *(["conditional_exact_delete"] if initially_present else []),
            "post_cas_absence_reread",
            "mark_cleanup_only" if deletion_proven and post_cas_reread_absent else "stop",
        ],
    }


def modeled_callback_mutation_decision(
    *,
    acquisition_mode: str,
    exact_prior_state: bool,
) -> dict[str, object]:
    """Model the hard gate separating cleanup-only takeover from fresh mutation."""

    if not exact_prior_state:
        stale_cleanup_only = acquisition_mode == "stale_cas"
        return {
            "outcome": (
                "stale_prior_state_mismatch_cleanup_only"
                if stale_cleanup_only
                else "prior_state_mismatch"
            ),
            "failure_code": (
                "justice_p0_stale_lock_recovered_reconciliation_required"
                if stale_cleanup_only
                else "justice_p0_operation_failed"
            ),
            "stale_recovery_cleanup_only": stale_cleanup_only,
            "exact_prior_state_precondition_verified": False,
            "requested_transition_runs": False,
            "requires_operator_reconciliation": stale_cleanup_only,
        }
    if acquisition_mode == "stale_cas":
        return {
            "outcome": "stale_lock_recovered_cleanup_only",
            "failure_code": "justice_p0_stale_lock_recovered_reconciliation_required",
            "stale_recovery_cleanup_only": True,
            "exact_prior_state_precondition_verified": True,
            "requested_transition_runs": False,
            "requires_operator_reconciliation": True,
        }
    return {
        "outcome": "fresh_owner_may_run_requested_transition",
        "failure_code": "",
        "stale_recovery_cleanup_only": False,
        "exact_prior_state_precondition_verified": False,
        "requested_transition_runs": acquisition_mode == "fresh_add",
        "requires_operator_reconciliation": False,
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
            "commit_sha",
            "plugin",
            "version",
            "marker",
            "active",
            "files_preserved",
            "restored_supported_prior",
            "temp_files_cleanup_complete",
            "stale_recovery_cleanup_only",
            "helper_deleted",
            "helper_absent_after",
            "lock",
            "lock_acquired",
            "lock_release_required",
            "lock_release_attempted",
            "lock_released",
            "artifact_sha256",
            "artifact_bytes",
            "plugin_file_sha256",
            "prior_state",
            "result_state",
            "expected_prior_version",
            "expected_prior_marker",
            "expected_prior_artifact_sha256",
            "expected_prior_plugin_file_sha256",
            "rollback_attempted",
            "rollback_succeeded",
            "rollback_cache",
            "cache",
        ):
            if key in payload:
                summary[key] = payload[key]
        data = payload.get("data")
        if isinstance(data, dict):
            for key in (
                "status",
                "temp_files_cleanup_complete",
                "stale_recovery_cleanup_only",
                "helper_deleted",
                "helper_absent_after",
                "lock",
                "lock_acquired",
                "lock_release_required",
                "lock_release_attempted",
                "lock_released",
                "rollback_attempted",
                "rollback_succeeded",
                "rollback_cache",
            ):
                if key in data:
                    summary[key] = data[key]
    return summary


def inspect_artifact(
    url: str,
    source_url: str,
    expected_sha256: str,
    expected_version: str,
    expected_marker: str,
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
    marker_match = re.search(
        r"define\(\s*['\"]JUSTICE_P0_MARKER['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)",
        main_php,
    )
    if not marker_match or marker_match.group(1) != expected_marker:
        raise RuntimeError("Artifact plugin marker does not match the release contract.")

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
        "marker": expected_marker,
    }


def inspect_prior_artifact(
    url: str, source_url: str, timeout: int
) -> dict[str, Any]:
    """Fetch and validate the sole supported rollback artifact."""

    response = requests.get(
        url,
        headers={"User-Agent": "Jus-Tice-SEO-Recovery-P0-Prior-Probe/0.1"},
        timeout=timeout,
        allow_redirects=False,
    )
    if response.status_code != 200:
        raise RuntimeError("Immutable prior artifact did not return direct HTTP 200.")
    payload = response.content
    if not payload or len(payload) > MAX_ARTIFACT_BYTES:
        raise RuntimeError("Prior artifact size is empty or exceeds the bounded limit.")
    if hashlib.sha256(payload).hexdigest() != SUPPORTED_PRIOR_ARTIFACT_SHA256:
        raise RuntimeError("Immutable prior artifact SHA-256 changed.")

    with zipfile.ZipFile(io.BytesIO(payload), "r") as archive:
        names = archive.namelist()
        if names != [PLUGIN_BASENAME]:
            raise RuntimeError("Prior artifact member set changed.")
        info = archive.getinfo(PLUGIN_BASENAME)
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
            raise RuntimeError("Prior artifact expansion bounds changed.")
        plugin_bytes = archive.read(PLUGIN_BASENAME)

    if hashlib.sha256(plugin_bytes).hexdigest() != SUPPORTED_PRIOR_PLUGIN_FILE_SHA256:
        raise RuntimeError("Prior artifact plugin-file SHA-256 changed.")
    source_response = requests.get(
        source_url,
        headers={"User-Agent": "Jus-Tice-SEO-Recovery-P0-Prior-Source/0.1"},
        timeout=timeout,
        allow_redirects=False,
    )
    if source_response.status_code != 200 or not source_response.content:
        raise RuntimeError("Historical prior plugin source did not return direct HTTP 200.")
    normalized_source_bytes = source_response.content.replace(b"\r\n", b"\n").replace(
        b"\r", b"\n"
    )
    if normalized_source_bytes != plugin_bytes:
        raise RuntimeError("Historical prior source differs from its ZIP member.")
    try:
        plugin_source = plugin_bytes.decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise RuntimeError("Prior plugin source is not valid UTF-8.") from error
    version_match = re.search(
        r"^\s*\*\s*Version:\s*([^\r\n]+)$",
        plugin_source,
        flags=re.MULTILINE,
    )
    marker_match = re.search(
        r"define\(\s*['\"]JUSTICE_P0_MARKER['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)",
        plugin_source,
    )
    if (
        not version_match
        or version_match.group(1).strip() != SUPPORTED_PRIOR_VERSION
        or not marker_match
        or marker_match.group(1) != SUPPORTED_PRIOR_MARKER
    ):
        raise RuntimeError("Prior artifact version or marker changed.")

    return {
        "url": url,
        "sha256": SUPPORTED_PRIOR_ARTIFACT_SHA256,
        "bytes": len(payload),
        "zip_entries": 1,
        "plugin_entry": PLUGIN_BASENAME,
        "plugin_entry_bytes": info.file_size,
        "plugin_entry_compressed_bytes": info.compress_size,
        "plugin_entry_sha256": SUPPORTED_PRIOR_PLUGIN_FILE_SHA256,
        "source_url": source_url,
        "source_sha256": hashlib.sha256(normalized_source_bytes).hexdigest(),
        "source_matches_artifact": True,
        "header_version": SUPPORTED_PRIOR_VERSION,
        "marker": SUPPORTED_PRIOR_MARKER,
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
    expected_marker: str,
    expected_artifact_sha256: str,
    expected_artifact_bytes: int,
    expected_plugin_file_sha256: str,
    expected_prior_state: str,
    expected_prior_version: str,
    expected_prior_marker: str,
    expected_prior_artifact_sha256: str,
    expected_prior_plugin_file_sha256: str,
    immutable_artifact_url: str,
    immutable_prior_artifact_url: str,
    expected_prior_artifact_bytes: int,
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
        "__MARKER__": php_literal(expected_marker),
        "__ARTIFACT_SHA256__": php_literal(expected_artifact_sha256),
        "__ARTIFACT_BYTES__": str(expected_artifact_bytes),
        "__PLUGIN_FILE_SHA256__": php_literal(expected_plugin_file_sha256),
        "__EXPECTED_PRIOR_STATE__": php_literal(expected_prior_state),
        "__EXPECTED_PRIOR_VERSION__": php_literal(expected_prior_version),
        "__EXPECTED_PRIOR_MARKER__": php_literal(expected_prior_marker),
        "__EXPECTED_PRIOR_ARTIFACT_SHA256__": php_literal(
            expected_prior_artifact_sha256
        ),
        "__EXPECTED_PRIOR_PLUGIN_FILE_SHA256__": php_literal(
            expected_prior_plugin_file_sha256
        ),
        "__ARTIFACT_URL__": php_literal(immutable_artifact_url),
        "__PRIOR_ARTIFACT_URL__": php_literal(immutable_prior_artifact_url),
        "__PRIOR_ARTIFACT_BYTES__": str(expected_prior_artifact_bytes),
        "__TARGET_BASE_URL__": php_literal(TARGET_BASE_URL),
        "__PLUGIN_BASENAME__": php_literal(PLUGIN_BASENAME),
        "__AFFECTED_PATHS__": php_literal(list(AFFECTED_PATHS)),
        "__LOCK_NAME__": php_literal("justice_seo_recovery_p0_deploy_lock"),
        "__LOCK_CONTRACT__": php_literal(DEPLOY_LOCK_CONTRACT),
        "__LOCK_SCHEMA_VERSION__": str(DEPLOY_LOCK_SCHEMA_VERSION),
        "__LOCK_STALE_AFTER_SECONDS__": str(DEPLOY_LOCK_STALE_AFTER_SECONDS),
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
			$expected_marker          = __MARKER__;
			$expected_artifact_sha256 = __ARTIFACT_SHA256__;
			$expected_artifact_bytes  = __ARTIFACT_BYTES__;
			$expected_plugin_sha256   = __PLUGIN_FILE_SHA256__;
			$expected_prior_state     = __EXPECTED_PRIOR_STATE__;
			$expected_prior_version   = __EXPECTED_PRIOR_VERSION__;
			$expected_prior_marker    = __EXPECTED_PRIOR_MARKER__;
			$expected_prior_artifact_sha256 = __EXPECTED_PRIOR_ARTIFACT_SHA256__;
			$expected_prior_plugin_sha256 = __EXPECTED_PRIOR_PLUGIN_FILE_SHA256__;
			$artifact_url             = __ARTIFACT_URL__;
			$prior_artifact_url       = __PRIOR_ARTIFACT_URL__;
			$expected_prior_artifact_bytes = __PRIOR_ARTIFACT_BYTES__;
			$expected_base_url        = __TARGET_BASE_URL__;
			$plugin_basename          = __PLUGIN_BASENAME__;
			$affected_paths           = __AFFECTED_PATHS__;
			$lock_name                = __LOCK_NAME__;
			$lock_contract            = __LOCK_CONTRACT__;
			$lock_schema_version      = __LOCK_SCHEMA_VERSION__;
			$lock_stale_after_seconds = __LOCK_STALE_AFTER_SECONDS__;
			$expected_normalized_hash = "__JUSTICE_P0_NORMALIZED_CODE_SHA256__";

			$temp_file          = '';
			$prior_temp_file    = '';
			$lock_acquired      = false;
			$lock_release_required = false;
			$lock_release_attempted = false;
			$lock_released      = null;
			$lock_value         = '';
			$temp_files_cleanup_complete = true;
			$temp_files_cleanup_message = '';
			$lock_evidence      = array(
				'contract' => $lock_contract,
				'schema_version' => $lock_schema_version,
				'stale_after_seconds' => $lock_stale_after_seconds,
				'acquisition_mode' => 'not_acquired',
				'acquired' => false,
				'owner_reread_exact' => false,
				'stale_lock_inspected' => false,
				'stale_lock_identity_valid' => false,
				'stale_lock_age_seconds' => null,
				'stale_owner_sha256' => '',
				'stale_action' => '',
				'stale_expected_prior_state' => '',
				'stale_transition_valid' => false,
				'stale_cas_rows' => 0,
				'old_helper_present' => null,
				'old_helper_identity_valid' => null,
				'old_helper_deleted' => null,
				'old_helper_absent_after' => null,
				'prior_process_death_ambiguity' => false,
				'exact_prior_state_precondition_verified' => false,
				'owner_assertions_passed' => 0,
				'owner_assertion_failed' => false,
				'release_required' => false,
				'release_attempted' => false,
				'release_precondition_exact' => false,
				'release_cas_rows' => 0,
				'release_absence_confirmed' => false,
				'release_error' => '',
				'released' => null,
			);
			$helper_deleted     = false;
			$helper_absent_after = false;
			$operation_result   = null;
			$failure_code       = '';
			$failure_message    = '';
			$failure_status     = 500;
			$mutation_started   = false;
			$stale_recovery_cleanup_only = false;
			$rollback_attempted = false;
			$rollback_succeeded = true;
			$rollback_message   = '';
			$rollback_cache     = null;
			$original_plugin_bytes = null;
			$original_active    = false;
			$restore_original   = null;

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

				$expected_run_id = 0 === strpos( $expected_helper_name, 'tmp-' )
					? substr( $expected_helper_name, 4 )
					: '';
				if (
					1 !== preg_match( '/^seo-recovery-p0-(?:install|deactivate|reactivate|rollback-supported-prior)-[0-9]{8}T[0-9]{6}Z-[a-f0-9]{8}$/', $expected_run_id )
					|| '/run-' . $expected_run_id !== $expected_route_path
				) {
					throw new RuntimeException( 'The deployment run fingerprint changed.', 409 );
				}

				$lock_owner_nonce_sha256 = hash(
					'sha256',
					$expected_token . '|' . wp_generate_uuid4() . '|' . microtime( true )
				);
				$lock_acquired_at = time();
				$lock_value = wp_json_encode( array(
					'schema_version' => $lock_schema_version,
					'contract' => $lock_contract,
					'base_url' => $expected_base_url,
					'plugin' => $plugin_basename,
					'run_id' => $expected_run_id,
					'helper_id' => $expected_helper_id,
					'helper_name' => $expected_helper_name,
					'route_path' => $expected_route_path,
					'helper_code_sha256' => $provided_code_sha256,
					'commit_sha' => $expected_commit_sha,
					'action' => $expected_action,
					'expected_prior_state' => $expected_prior_state,
					'owner_nonce_sha256' => $lock_owner_nonce_sha256,
					'acquired_at' => $lock_acquired_at,
				) );
				if ( ! is_string( $lock_value ) || '' === $lock_value ) {
					throw new RuntimeException( 'The bounded deployment owner record could not be encoded.', 500 );
				}

				$read_raw_lock = static function () use ( $lock_name ) {
					global $wpdb;
					$row = $wpdb->get_row(
						$wpdb->prepare(
							"SELECT option_value FROM {$wpdb->options} WHERE option_name = %s LIMIT 1",
							$lock_name
						),
						ARRAY_A
					);
					if ( '' !== (string) $wpdb->last_error ) {
						throw new RuntimeException( 'The raw deployment lock query failed.', 500 );
					}
					if ( null === $row ) {
						return null;
					}
					if ( ! is_array( $row ) || ! array_key_exists( 'option_value', $row ) || ! is_string( $row['option_value'] ) ) {
						throw new RuntimeException( 'The raw deployment lock row is unreadable.', 500 );
					}
					return $row['option_value'];
				};
				$cas_update_lock = static function ( string $old_value, string $new_value ) use ( $lock_name ): int {
					global $wpdb;
					$rows = $wpdb->query(
						$wpdb->prepare(
							"UPDATE {$wpdb->options} SET option_value = %s WHERE option_name = %s AND BINARY option_value = BINARY %s",
							$new_value,
							$lock_name,
							$old_value
						)
					);
					return is_int( $rows ) ? $rows : -1;
				};
			$cas_delete_lock = static function ( string $owner_value ) use ( $lock_name ): int {
					global $wpdb;
					$rows = $wpdb->query(
						$wpdb->prepare(
							"DELETE FROM {$wpdb->options} WHERE option_name = %s AND BINARY option_value = BINARY %s",
							$lock_name,
							$owner_value
						)
					);
				return is_int( $rows ) ? $rows : -1;
			};
			$assert_lock_owner = static function () use (
				&$lock_acquired,
				$lock_value,
				$read_raw_lock,
				&$lock_evidence
			): void {
				$raw_owner = $read_raw_lock();
				if (
					! $lock_acquired
					|| ! is_string( $raw_owner )
					|| ! hash_equals( $lock_value, $raw_owner )
				) {
					$lock_evidence['owner_assertion_failed'] = true;
					throw new RuntimeException( 'Exact deployment lock ownership was lost.', 409 );
				}
				$lock_evidence['owner_assertions_passed']++;
			};

				$lock_acquired = add_option( $lock_name, $lock_value, '', false );
				if ( $lock_acquired ) {
					$lock_release_required = true;
					$lock_evidence['acquisition_mode'] = 'fresh_add';
				$lock_evidence['acquired'] = true;
				$lock_evidence['release_required'] = true;
				wp_cache_delete( $lock_name, 'options' );
				$assert_lock_owner();
				$lock_evidence['owner_reread_exact'] = true;
				} else {
					$lock_evidence['stale_lock_inspected'] = true;
					$stale_raw = $read_raw_lock();
					if ( ! is_string( $stale_raw ) || '' === $stale_raw ) {
						throw new RuntimeException( 'Existing deployment lock identity is unknown.', 409 );
					}
					$stale = json_decode( $stale_raw, true );
					$expected_lock_keys = array(
						'acquired_at', 'action', 'base_url', 'commit_sha', 'contract',
						'expected_prior_state', 'helper_code_sha256', 'helper_id',
						'helper_name', 'owner_nonce_sha256', 'plugin', 'route_path',
						'run_id', 'schema_version',
					);
					$observed_lock_keys = is_array( $stale ) ? array_keys( $stale ) : array();
					sort( $observed_lock_keys, SORT_STRING );
					sort( $expected_lock_keys, SORT_STRING );
					$stale_run_id = is_array( $stale ) && isset( $stale['run_id'] ) && is_string( $stale['run_id'] )
						? $stale['run_id']
						: '';
					$stale_acquired_at = is_array( $stale ) && isset( $stale['acquired_at'] ) && is_int( $stale['acquired_at'] )
						? $stale['acquired_at']
						: 0;
				$stale_age = time() - $stale_acquired_at;
				$stale_transition = is_array( $stale )
					&& isset( $stale['action'], $stale['expected_prior_state'] )
					&& is_string( $stale['action'] )
					&& is_string( $stale['expected_prior_state'] )
					? $stale['action'] . '|' . $stale['expected_prior_state']
					: '';
				$stale_transition_valid = in_array(
					$stale_transition,
					array(
						'install|absent',
						'install|inactive_exact',
						'install|inactive_supported_prior',
						'deactivate|active_exact',
						'deactivate|active_supported_prior',
						'reactivate|inactive_supported_prior',
						'rollback-supported-prior|active_exact',
					),
					true
				);
				$stale_identity_valid =
						is_array( $stale )
							&& $observed_lock_keys === $expected_lock_keys
							&& $lock_schema_version === $stale['schema_version']
							&& $lock_contract === $stale['contract']
							&& $expected_base_url === $stale['base_url']
							&& $plugin_basename === $stale['plugin']
							&& is_int( $stale['helper_id'] )
							&& $stale['helper_id'] > 0
							&& $stale['helper_id'] !== $expected_helper_id
							&& is_string( $stale['helper_name'] )
							&& 'tmp-' . $stale_run_id === $stale['helper_name']
							&& $stale['helper_name'] !== $expected_helper_name
							&& is_string( $stale['route_path'] )
							&& '/run-' . $stale_run_id === $stale['route_path']
							&& $stale['route_path'] !== $expected_route_path
							&& 1 === preg_match( '/^seo-recovery-p0-(?:install|deactivate|reactivate|rollback-supported-prior)-[0-9]{8}T[0-9]{6}Z-[a-f0-9]{8}$/', $stale_run_id )
							&& is_string( $stale['helper_code_sha256'] )
							&& 1 === preg_match( '/^[a-f0-9]{64}$/', $stale['helper_code_sha256'] )
							&& $expected_commit_sha === $stale['commit_sha']
						&& $stale_transition_valid
							&& is_string( $stale['owner_nonce_sha256'] )
							&& 1 === preg_match( '/^[a-f0-9]{64}$/', $stale['owner_nonce_sha256'] )
							&& $stale_acquired_at > 0
							&& $stale_age > $lock_stale_after_seconds;
					$lock_evidence['stale_lock_identity_valid'] = $stale_identity_valid;
				$lock_evidence['stale_lock_age_seconds'] = $stale_acquired_at > 0 ? $stale_age : null;
				$lock_evidence['stale_owner_sha256'] = hash( 'sha256', $stale_raw );
				$lock_evidence['stale_action'] = is_array( $stale ) && is_string( $stale['action'] ?? null ) ? $stale['action'] : '';
				$lock_evidence['stale_expected_prior_state'] = is_array( $stale ) && is_string( $stale['expected_prior_state'] ?? null ) ? $stale['expected_prior_state'] : '';
				$lock_evidence['stale_transition_valid'] = $stale_transition_valid;
					if ( ! $stale_identity_valid ) {
						throw new RuntimeException( 'Existing deployment lock is fresh or has an unknown fingerprint.', 409 );
					}

					$old_helper = \Code_Snippets\get_snippet( (int) $stale['helper_id'], false );
					$old_helper_present = $old_helper && 0 !== (int) $old_helper->id;
					$lock_evidence['old_helper_present'] = (bool) $old_helper_present;
					$old_helper_identity_valid = ! $old_helper_present || (
						(int) $stale['helper_id'] === (int) $old_helper->id
							&& (string) $stale['helper_name'] === (string) $old_helper->name
							&& 'global' === (string) $old_helper->scope
							&& false === (bool) $old_helper->network
							&& method_exists( $old_helper, 'is_trashed' )
							&& false === $old_helper->is_trashed()
							&& hash_equals(
								(string) $stale['helper_code_sha256'],
								hash( 'sha256', (string) $old_helper->code )
							)
					);
					$lock_evidence['old_helper_identity_valid'] = $old_helper_identity_valid;
					if ( ! $old_helper_identity_valid ) {
						throw new RuntimeException( 'Stale lock helper identity cannot be proven.', 409 );
					}

					$stale_cas_rows = $cas_update_lock( $stale_raw, $lock_value );
					$lock_evidence['stale_cas_rows'] = $stale_cas_rows;
					if ( 1 !== $stale_cas_rows ) {
						throw new RuntimeException( 'Stale deployment lock ownership CAS was lost.', 409 );
					}
					$lock_acquired = true;
					$lock_release_required = true;
					$lock_evidence['acquisition_mode'] = 'stale_cas';
					$lock_evidence['acquired'] = true;
					$lock_evidence['release_required'] = true;
				$lock_evidence['prior_process_death_ambiguity'] = true;
				wp_cache_delete( $lock_name, 'options' );
				$assert_lock_owner();
				$lock_evidence['owner_reread_exact'] = true;

				$old_helper_deleted = null;
				if ( $old_helper_present ) {
					$assert_lock_owner();
					$old_helper_deleted = (bool) \Code_Snippets\delete_snippet( (int) $stale['helper_id'], false );
					if ( ! $old_helper_deleted ) {
						throw new RuntimeException( 'Exact stale deployment helper could not be deleted.', 500 );
					}
				}
				$old_helper_after = \Code_Snippets\get_snippet( (int) $stale['helper_id'], false );
				$old_helper_absent_after = ! $old_helper_after || 0 === (int) $old_helper_after->id;
				$lock_evidence['old_helper_deleted'] = $old_helper_deleted;
				$lock_evidence['old_helper_absent_after'] = $old_helper_absent_after;
				if ( ! $old_helper_absent_after ) {
					throw new RuntimeException( 'Exact stale deployment helper absence is unproven.', 500 );
				}
				$stale_recovery_cleanup_only = true;
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
				$extract_marker = static function ( string $file ): string {
					$source = @file_get_contents( $file );
					if ( ! is_string( $source ) ) {
						return '';
					}
					$matches = array();
					if ( 1 !== preg_match( "/define\\s*\\(\\s*['\"]JUSTICE_P0_MARKER['\"]\\s*,\\s*['\"]([^'\"]+)['\"]\\s*\\)/", $source, $matches ) ) {
						return '';
					}
					return (string) $matches[1];
				};
				$inspect_installed = static function () use (
					$plugin_file,
					$plugin_dir,
					$plugin_basename,
					$plugin_directory_exact,
					$extract_marker,
					$expected_version,
					$expected_marker,
					$expected_plugin_sha256,
					$expected_prior_version,
					$expected_prior_marker,
					$expected_prior_plugin_sha256
				): array {
					$exists = is_file( $plugin_file );
					$active = $exists && is_plugin_active( $plugin_basename );
					$version = '';
					$marker = '';
					$sha256 = '';
					$directory_exact = $exists && $plugin_directory_exact( $plugin_dir, $plugin_file );
					if ( $exists ) {
						$data = get_plugin_data( $plugin_file, false, false );
						$version = (string) ( $data['Version'] ?? '' );
						$marker = $extract_marker( $plugin_file );
						$hash = hash_file( 'sha256', $plugin_file );
						$sha256 = is_string( $hash ) ? strtolower( $hash ) : '';
					}
					$target_exact =
						$directory_exact
							&& $expected_version === $version
							&& $expected_marker === $marker
							&& hash_equals( $expected_plugin_sha256, $sha256 );
					$prior_exact =
						$directory_exact
							&& '' !== $expected_prior_version
							&& $expected_prior_version === $version
							&& $expected_prior_marker === $marker
							&& hash_equals( $expected_prior_plugin_sha256, $sha256 );
					if ( ! $exists && ! file_exists( $plugin_dir ) && ! is_link( $plugin_dir ) ) {
						$state = 'absent';
					} elseif ( $target_exact ) {
						$state = $active ? 'active_exact' : 'inactive_exact';
					} elseif ( $prior_exact ) {
						$state = $active ? 'active_supported_prior' : 'inactive_supported_prior';
					} else {
						$state = 'different';
					}
					return array(
						'state' => $state,
						'exists' => $exists,
						'active' => $active,
						'version' => $version,
						'marker' => $marker,
						'plugin_file_sha256' => $sha256,
						'directory_exact' => $directory_exact,
					);
				};
				$current = $inspect_installed();
				$current_state = (string) $current['state'];
				if ( $expected_prior_state !== $current_state ) {
					throw new RuntimeException( 'The installed plugin prior state changed.', 409 );
				}
				if ( 'stale_cas' === $lock_evidence['acquisition_mode'] ) {
					$lock_evidence['exact_prior_state_precondition_verified'] = true;
					throw new RuntimeException(
						'Stale deployment ownership was recovered without running the requested transition. Operator reconciliation is required.',
						409
					);
				}

				$original_active = (bool) $current['active'];
				if ( (bool) $current['exists'] ) {
					$original_plugin_bytes = file_get_contents( $plugin_file );
					if ( ! is_string( $original_plugin_bytes ) || '' === $original_plugin_bytes ) {
						throw new RuntimeException( 'The exact prior plugin bytes could not be captured.', 500 );
					}
				}

			$purge_release_caches = static function () use ( $affected_paths, $assert_lock_owner ): array {
				$assert_lock_owner();
					$affected_urls = array();
					foreach ( $affected_paths as $path ) {
						$url = home_url( $path );
						$affected_urls[] = $url;
						do_action( 'litespeed_purge_url', $url );
					}
					do_action( 'litespeed_purge_all' );
					if ( ! function_exists( 'wp_cache_flush' ) ) {
						throw new RuntimeException( 'The required WordPress object-cache flush API is unavailable.' );
					}
					$object_cache_flush_result = wp_cache_flush();
					if ( true !== $object_cache_flush_result ) {
						throw new RuntimeException( 'WordPress object-cache flush did not return exact true.' );
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
					foreach ( array( 7905, 23405, 23406 ) as $post_id ) {
						clean_post_cache( $post_id );
					}
					clean_term_cache( array( 170 ), 'practice-areas' );
					clean_term_cache( array( 730 ), 'category' );
					$map_transient_delete_result = delete_transient( 'justice_map_geojson_v1' );
					return array(
						'object_cache_flush_result' => $object_cache_flush_result,
						'map_transient_delete_result' => $map_transient_delete_result,
						'litespeed_purge_all_dispatched' => true,
						'litespeed_url_purge_dispatches' => count( $affected_urls ),
						'affected_urls' => $affected_urls,
						'post_cache_ids' => array( 7905, 23405, 23406 ),
						'term_cache_ids' => array( 170, 730 ),
					);
				};

			$remove_exact_plugin_directory = static function () use ( $plugin_dir, $plugin_basename, $assert_lock_owner ): void {
					$expected_directory = WP_PLUGIN_DIR . '/' . dirname( $plugin_basename );
					if ( wp_normalize_path( $plugin_dir ) !== wp_normalize_path( $expected_directory ) ) {
						throw new RuntimeException( 'Refused an out-of-scope plugin directory operation.' );
					}
					if ( is_link( $plugin_dir ) ) {
						throw new RuntimeException( 'Refused a symlinked plugin directory operation.' );
					}
					if ( ! file_exists( $plugin_dir ) ) {
						return;
					}
					$iterator = new RecursiveIteratorIterator(
						new RecursiveDirectoryIterator( $plugin_dir, FilesystemIterator::SKIP_DOTS ),
						RecursiveIteratorIterator::CHILD_FIRST
					);
				foreach ( $iterator as $item ) {
					$path = $item->getPathname();
					$assert_lock_owner();
					$removed = ( $item->isLink() || $item->isFile() ) ? @unlink( $path ) : @rmdir( $path );
						if ( ! $removed ) {
							throw new RuntimeException( 'Could not remove the bounded plugin rollback target.' );
						}
					}
				$assert_lock_owner();
				if ( ! @rmdir( $plugin_dir ) ) {
						throw new RuntimeException( 'Could not remove the bounded plugin directory.' );
					}
				};

				$restore_original = static function () use (
					$expected_prior_state,
					$original_plugin_bytes,
					$original_active,
					$plugin_file,
					$plugin_dir,
					$plugin_basename,
				$remove_exact_plugin_directory,
				$inspect_installed,
				$purge_release_caches,
				$assert_lock_owner
			): array {
				$assert_lock_owner();
				if ( is_plugin_active( $plugin_basename ) ) {
					$assert_lock_owner();
					deactivate_plugins( $plugin_basename, false, false );
				}
				$assert_lock_owner();
				wp_clean_plugins_cache( true );
				$remove_exact_plugin_directory();
					if ( 'absent' !== $expected_prior_state ) {
						if ( ! is_string( $original_plugin_bytes ) || '' === $original_plugin_bytes ) {
							throw new RuntimeException( 'Captured rollback bytes are unavailable.' );
						}
					$assert_lock_owner();
					if ( ! wp_mkdir_p( $plugin_dir ) ) {
						throw new RuntimeException( 'Could not recreate the exact plugin directory.' );
					}
					$assert_lock_owner();
					$written = file_put_contents( $plugin_file, $original_plugin_bytes, LOCK_EX );
						if ( ! is_int( $written ) || strlen( $original_plugin_bytes ) !== $written ) {
							throw new RuntimeException( 'Could not restore the exact captured plugin bytes.' );
						}
					$assert_lock_owner();
					@chmod( $plugin_file, 0644 );
					$assert_lock_owner();
					wp_clean_plugins_cache( true );
					if ( $original_active ) {
						$assert_lock_owner();
						$activated = activate_plugin( $plugin_basename, '', false, false );
							if ( is_wp_error( $activated ) ) {
								throw new RuntimeException( 'Could not reactivate the exact restored plugin.' );
							}
						}
				}
				$assert_lock_owner();
				wp_clean_plugins_cache( true );
					clearstatcache( true, $plugin_file );
					$restored = $inspect_installed();
					if ( $expected_prior_state !== (string) $restored['state'] ) {
						throw new RuntimeException( 'Recovery did not restore the exact prior state.' );
					}
					return array(
						'state' => $restored['state'],
						'version' => $restored['version'],
						'marker' => $restored['marker'],
						'plugin_file_sha256' => $restored['plugin_file_sha256'],
						'cache' => $purge_release_caches(),
					);
				};

				$download_pinned = static function (
					string $url,
					string $expected_sha256,
					int $expected_bytes,
					string $label
			) use ( $expected_token, $expected_commit_sha, $assert_lock_owner ): string {
					if ( '' === $url || false !== strpos( $url, '?' ) || false !== strpos( $url, '#' ) ) {
						throw new RuntimeException( 'Immutable artifact URL shape changed.', 409 );
					}
					$nonce = hash(
						'sha256',
						$expected_token . '|' . $expected_commit_sha . '|' . $label . '|' . wp_generate_uuid4() . '|' . microtime( true )
				);
				$cache_busted_url = $url . '?nlcb=' . rawurlencode( $nonce );
				$assert_lock_owner();
				$downloaded = download_url( $cache_busted_url, 180 );
					if ( is_wp_error( $downloaded ) ) {
						throw new RuntimeException( 'The immutable artifact could not be downloaded.', 502 );
					}
					$observed_hash = hash_file( 'sha256', $downloaded );
					$observed_bytes = filesize( $downloaded );
					if (
						! is_string( $observed_hash )
							|| ! hash_equals( $expected_sha256, strtolower( $observed_hash ) )
							|| ! is_int( $observed_bytes )
						|| $expected_bytes !== $observed_bytes
				) {
					$assert_lock_owner();
					@unlink( $downloaded );
						throw new RuntimeException( 'The downloaded artifact bytes do not match.', 409 );
					}
					return $downloaded;
				};

				if ( 'install' === $expected_action ) {
					$temp_file = $download_pinned(
						$artifact_url,
						$expected_artifact_sha256,
						$expected_artifact_bytes,
						'candidate'
					);
					$artifact_bytes = $expected_artifact_bytes;

					$mutation_started = true;
					if ( in_array( $expected_prior_state, array( 'absent', 'inactive_supported_prior' ), true ) ) {
						$skin = new WP_Ajax_Upgrader_Skin();
						$upgrader = new Plugin_Upgrader( $skin );
						$assert_lock_owner();
						$installed = $upgrader->install(
							$temp_file,
							array( 'overwrite_package' => 'inactive_supported_prior' === $expected_prior_state )
						);
						if ( is_wp_error( $installed ) || true !== $installed ) {
							throw new RuntimeException( 'Plugin_Upgrader did not confirm installation.', 500 );
						}
					}

					if ( ! is_plugin_active( $plugin_basename ) ) {
						$assert_lock_owner();
						$activated = activate_plugin( $plugin_basename, '', false, false );
						if ( is_wp_error( $activated ) ) {
							throw new RuntimeException( 'The reviewed plugin could not be activated.', 500 );
						}
					}

					$assert_lock_owner();
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
						|| $expected_marker !== $extract_marker( $plugin_file )
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
						'marker'          => $expected_marker,
						'active'          => true,
						'artifact_sha256' => $expected_artifact_sha256,
						'artifact_bytes'  => is_int( $artifact_bytes ) ? $artifact_bytes : 0,
						'plugin_file_sha256' => $expected_plugin_sha256,
						'prior_state'     => $expected_prior_state,
						'result_state'    => 'active_exact',
					);
				} elseif ( 'deactivate' === $expected_action ) {
					$mutation_started = true;
					$assert_lock_owner();
					deactivate_plugins( $plugin_basename, false, false );
					$assert_lock_owner();
					wp_clean_plugins_cache( true );
					clearstatcache( true, $plugin_file );
					$after_deactivation = $inspect_installed();
					$expected_inactive_state = 'active_supported_prior' === $expected_prior_state
						? 'inactive_supported_prior'
						: 'inactive_exact';
					if ( $expected_inactive_state !== (string) $after_deactivation['state'] ) {
						throw new RuntimeException( 'Plugin deactivation or file preservation failed.', 500 );
					}

					$operation_result = array(
						'success'         => true,
						'action'          => 'deactivate',
						'plugin'          => $plugin_basename,
						'version'         => $after_deactivation['version'],
						'marker'          => $after_deactivation['marker'],
						'active'          => false,
						'files_preserved' => true,
						'artifact_sha256' => 'active_supported_prior' === $expected_prior_state ? $expected_prior_artifact_sha256 : $expected_artifact_sha256,
						'artifact_bytes'  => 'active_supported_prior' === $expected_prior_state ? $expected_prior_artifact_bytes : $expected_artifact_bytes,
						'plugin_file_sha256' => $after_deactivation['plugin_file_sha256'],
						'prior_state'     => $expected_prior_state,
						'result_state'    => $expected_inactive_state,
					);
				} elseif ( 'reactivate' === $expected_action ) {
					$mutation_started = true;
					$assert_lock_owner();
					$activated = activate_plugin( $plugin_basename, '', false, false );
					if ( is_wp_error( $activated ) ) {
						throw new RuntimeException( 'The exact supported prior could not be reactivated.', 500 );
					}
					$assert_lock_owner();
					wp_clean_plugins_cache( true );
					clearstatcache( true, $plugin_file );
					$after_reactivation = $inspect_installed();
					if ( 'active_supported_prior' !== (string) $after_reactivation['state'] ) {
						throw new RuntimeException( 'Abort recovery did not restore active supported prior.', 500 );
					}
					$operation_result = array(
						'success' => true,
						'action' => 'reactivate',
						'plugin' => $plugin_basename,
						'version' => $after_reactivation['version'],
						'marker' => $after_reactivation['marker'],
						'active' => true,
						'files_preserved' => true,
						'artifact_sha256' => $expected_prior_artifact_sha256,
						'artifact_bytes' => $expected_prior_artifact_bytes,
						'plugin_file_sha256' => $after_reactivation['plugin_file_sha256'],
						'prior_state' => $expected_prior_state,
						'result_state' => 'active_supported_prior',
					);
				} elseif ( 'rollback-supported-prior' === $expected_action ) {
					$prior_temp_file = $download_pinned(
						$prior_artifact_url,
						$expected_prior_artifact_sha256,
						$expected_prior_artifact_bytes,
						'prior'
					);
					$mutation_started = true;
					$skin = new WP_Ajax_Upgrader_Skin();
					$upgrader = new Plugin_Upgrader( $skin );
					$assert_lock_owner();
					$installed = $upgrader->install(
						$prior_temp_file,
						array( 'overwrite_package' => true )
					);
					if ( is_wp_error( $installed ) || true !== $installed ) {
						throw new RuntimeException( 'Plugin_Upgrader did not restore supported prior.', 500 );
					}
					if ( ! is_plugin_active( $plugin_basename ) ) {
						$assert_lock_owner();
						$activated = activate_plugin( $plugin_basename, '', false, false );
						if ( is_wp_error( $activated ) ) {
							throw new RuntimeException( 'The restored supported prior could not be activated.', 500 );
						}
					}
					$assert_lock_owner();
					wp_clean_plugins_cache( true );
					clearstatcache( true, $plugin_file );
					$after_supported_rollback = $inspect_installed();
					if ( 'active_supported_prior' !== (string) $after_supported_rollback['state'] ) {
						throw new RuntimeException( 'Supported-prior rollback identity verification failed.', 409 );
					}
					$operation_result = array(
						'success' => true,
						'action' => 'rollback-supported-prior',
						'plugin' => $plugin_basename,
						'version' => $after_supported_rollback['version'],
						'marker' => $after_supported_rollback['marker'],
						'active' => true,
						'restored_supported_prior' => true,
						'artifact_sha256' => $expected_prior_artifact_sha256,
						'artifact_bytes' => $expected_prior_artifact_bytes,
						'plugin_file_sha256' => $after_supported_rollback['plugin_file_sha256'],
						'prior_state' => $expected_prior_state,
						'result_state' => 'active_supported_prior',
					);
				} else {
					throw new RuntimeException( 'Unsupported bounded operation.', 400 );
				}

				$operation_result['expected_prior_version'] = $expected_prior_version;
				$operation_result['expected_prior_marker'] = $expected_prior_marker;
				$operation_result['expected_prior_artifact_sha256'] = $expected_prior_artifact_sha256;
				$operation_result['expected_prior_plugin_file_sha256'] = $expected_prior_plugin_sha256;
				$operation_result['cache'] = $purge_release_caches();
			} catch ( Throwable $error ) {
				if ( $mutation_started ) {
					$rollback_attempted = true;
					$rollback_succeeded = false;
					try {
						if ( ! is_callable( $restore_original ) ) {
							throw new RuntimeException( 'Exact recovery closure was unavailable.' );
						}
						$restoration = $restore_original();
						$rollback_cache = $restoration['cache'];
						$rollback_succeeded = true;
					} catch ( Throwable $rollback_error ) {
						$rollback_message = $rollback_error->getMessage();
					}
				}
				$failure_code    = $stale_recovery_cleanup_only
					? 'justice_p0_stale_lock_recovered_reconciliation_required'
					: 'justice_p0_operation_failed';
				$failure_message = $error->getMessage();
				if ( ! $rollback_succeeded ) {
					$failure_message .= ' Rollback failed: ' . $rollback_message;
				}
				$failure_status  = (int) $error->getCode();
				if ( $failure_status < 400 || $failure_status > 599 ) {
					$failure_status = 500;
				}
			} finally {
				foreach ( array( $temp_file, $prior_temp_file ) as $owned_temp_file ) {
					if ( ! is_string( $owned_temp_file ) || '' === $owned_temp_file || ! file_exists( $owned_temp_file ) ) {
						continue;
					}
					try {
						if ( $lock_acquired ) {
							$assert_lock_owner();
						}
						if ( ! @unlink( $owned_temp_file ) ) {
							throw new RuntimeException( 'An owned deployment temporary file could not be removed.' );
						}
					} catch ( Throwable $temp_cleanup_error ) {
						$temp_files_cleanup_complete = false;
						$temp_files_cleanup_message = $temp_cleanup_error->getMessage();
					}
				}
				if ( function_exists( 'Code_Snippets\\delete_snippet' ) ) {
					try {
						if ( $lock_acquired ) {
							$assert_lock_owner();
						}
						$helper_deleted = (bool) \Code_Snippets\delete_snippet( $expected_helper_id, false );
					} catch ( Throwable $helper_cleanup_error ) {
						$helper_deleted = false;
					}
				}
				if ( function_exists( 'Code_Snippets\\get_snippet' ) ) {
					try {
						$helper_after = \Code_Snippets\get_snippet( $expected_helper_id, false );
						$helper_absent_after = ! $helper_after || 0 === (int) $helper_after->id;
					} catch ( Throwable $helper_absence_error ) {
						$helper_absent_after = false;
					}
				}

				$pre_release_cleanup_complete =
					$temp_files_cleanup_complete
					&& $helper_deleted
					&& $helper_absent_after;
				if ( ! $pre_release_cleanup_complete && '' === $failure_code && $mutation_started ) {
					$rollback_attempted = true;
					$rollback_succeeded = false;
					try {
						if ( ! is_callable( $restore_original ) ) {
							throw new RuntimeException( 'Exact cleanup recovery closure was unavailable.' );
						}
						$cleanup_restoration = $restore_original();
						$rollback_cache = $cleanup_restoration['cache'];
						$rollback_succeeded = true;
					} catch ( Throwable $cleanup_rollback_error ) {
						$rollback_message = $cleanup_rollback_error->getMessage();
					}
				}

				if ( $lock_acquired ) {
					$lock_release_attempted = true;
					$lock_evidence['release_attempted'] = true;
					try {
						$assert_lock_owner();
						$lock_evidence['release_precondition_exact'] = true;
						wp_cache_delete( $lock_name, 'options' );
					} catch ( Throwable $release_precondition_error ) {
						$lock_evidence['release_error'] = $release_precondition_error->getMessage();
					}
					try {
						$lock_release_rows = $cas_delete_lock( $lock_value );
					} catch ( Throwable $release_cas_error ) {
						$lock_release_rows = -1;
						$lock_evidence['release_error'] = $release_cas_error->getMessage();
					}
					$lock_evidence['release_cas_rows'] = $lock_release_rows;
					try {
						$lock_release_absent = null === $read_raw_lock();
					} catch ( Throwable $release_read_error ) {
						$lock_release_absent = false;
						$lock_evidence['release_error'] = $release_read_error->getMessage();
					}
					$lock_evidence['release_absence_confirmed'] = $lock_release_absent;
					$lock_released =
						true === $lock_evidence['release_precondition_exact']
						&& 1 === $lock_release_rows
						&& $lock_release_absent;
					$lock_evidence['released'] = $lock_released;
				}
			}

			$lock_cleanup_complete = ! $lock_release_required || true === $lock_released;
			$cleanup_complete =
				$temp_files_cleanup_complete
				&& $helper_deleted
				&& $helper_absent_after
				&& $lock_cleanup_complete;

			if ( ! $cleanup_complete ) {
				return new WP_Error(
					'justice_p0_helper_cleanup_failed',
					'The temporary deployment helper or lock cleanup did not complete.',
					array(
						'status'              => 500,
						'temp_files_cleanup_complete' => $temp_files_cleanup_complete,
						'temp_files_cleanup_message' => $temp_files_cleanup_message,
						'stale_recovery_cleanup_only' => $stale_recovery_cleanup_only,
						'helper_deleted'      => $helper_deleted,
						'helper_absent_after' => $helper_absent_after,
						'lock'                 => $lock_evidence,
						'lock_acquired'        => $lock_acquired,
						'lock_release_required' => $lock_release_required,
						'lock_release_attempted' => $lock_release_attempted,
						'lock_released'       => $lock_released,
						'rollback_attempted'  => $rollback_attempted,
						'rollback_succeeded'  => $rollback_succeeded,
						'rollback_cache'      => $rollback_cache,
					)
				);
			}

			if ( '' !== $failure_code ) {
				return new WP_Error(
					$failure_code,
					$failure_message,
					array(
						'status'              => $failure_status,
						'temp_files_cleanup_complete' => $temp_files_cleanup_complete,
						'temp_files_cleanup_message' => $temp_files_cleanup_message,
						'stale_recovery_cleanup_only' => $stale_recovery_cleanup_only,
						'helper_deleted'      => $helper_deleted,
						'helper_absent_after' => $helper_absent_after,
						'lock'                 => $lock_evidence,
						'lock_acquired'        => $lock_acquired,
						'lock_release_required' => $lock_release_required,
						'lock_release_attempted' => $lock_release_attempted,
						'lock_released'       => $lock_released,
						'rollback_attempted'  => $rollback_attempted,
						'rollback_succeeded'  => $rollback_succeeded,
						'rollback_cache'      => $rollback_cache,
					)
				);
			}

			$operation_result['commit_sha']          = $expected_commit_sha;
			$operation_result['temp_files_cleanup_complete'] = $temp_files_cleanup_complete;
			$operation_result['stale_recovery_cleanup_only'] = false;
			$operation_result['helper_deleted']      = true;
			$operation_result['helper_absent_after'] = true;
			$operation_result['lock']                = $lock_evidence;
			$operation_result['lock_acquired']       = $lock_acquired;
			$operation_result['lock_release_required'] = $lock_release_required;
			$operation_result['lock_release_attempted'] = $lock_release_attempted;
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
    helper_absent: bool,
    helper_direct_absent: bool,
    route_absent: bool,
    temp_files_cleanup_complete: bool,
    lock_cleanup_proven: bool,
    stale_helper_cleanup_proven: bool,
    prior_process_death_ambiguity: bool,
    exact_prior_state_precondition_verified: bool,
) -> dict[str, Any]:
    """Describe fail-closed operator work after an attempted mutation."""

    cleanup_proven = bool(
        helper_absent
        and helper_direct_absent
        and route_absent
        and temp_files_cleanup_complete
        and lock_cleanup_proven
        and stale_helper_cleanup_proven
    )
    stale_recovery_precondition_unresolved = bool(
        prior_process_death_ambiguity
        and not exact_prior_state_precondition_verified
    )
    requires_operator_reconciliation = bool(
        prior_process_death_ambiguity
        or (
            not passed
            and (
                callback_attempted
                or not cleanup_proven
                or callback_reported_failed_rollback
                or stale_recovery_precondition_unresolved
            )
        )
    )
    if action == "install" and expected_prior_state == "absent":
        required_reconciliation = (
            "Inspect exact plugin state. If the exact plugin was installed, deactivate it; "
            "then remove only the exact SHA-pinned plugin files to restore the absent state."
        )
    elif action == "install":
        required_reconciliation = (
            "Inspect exact plugin state. For an inactive_supported_prior start, run only "
            "rollback-supported-prior from active_exact; otherwise deactivate the exact "
            "target and preserve its reviewed files."
        )
    elif action == "deactivate" and expected_prior_state == "active_supported_prior":
        required_reconciliation = (
            "Inspect exact plugin state. If exact 0.1.1 is inactive, run the bounded "
            "reactivate action to restore active_supported_prior before resuming."
        )
    elif action == "rollback-supported-prior":
        required_reconciliation = (
            "Inspect exact plugin state. Restore either active_exact 0.1.2 or the exact "
            "active_supported_prior 0.1.1 with the pinned rollback action before resuming."
        )
    elif action == "reactivate":
        required_reconciliation = (
            "Inspect exact plugin state. If it is inactive_supported_prior, rerun only "
            "the bounded reactivate action. If it is active_supported_prior, verify the "
            "exact health identity and complete helper, route, and lock cleanup before resuming."
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
        "helper_absent": helper_absent,
        "helper_direct_absent": helper_direct_absent,
        "route_absent": route_absent,
        "temp_files_cleanup_complete": temp_files_cleanup_complete,
        "lock_cleanup_proven": lock_cleanup_proven,
        "stale_helper_cleanup_proven": stale_helper_cleanup_proven,
        "cleanup_proven": cleanup_proven,
        "prior_process_death_ambiguity": prior_process_death_ambiguity,
        "exact_prior_state_precondition_verified": (
            exact_prior_state_precondition_verified
        ),
        "stale_recovery_precondition_unresolved": (
            stale_recovery_precondition_unresolved
        ),
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
    mobile_nav_style_element_id = re.search(
        r"define\(\s*['\"]JUSTICE_P0_MOBILE_NAV_STYLE_ELEMENT_ID['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)",
        plugin_source,
    )
    mobile_nav_css_marker = re.search(
        r"define\(\s*['\"]JUSTICE_P0_MOBILE_NAV_CSS_MARKER['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)",
        plugin_source,
    )
    if (
        not plugin_header
        or plugin_header.group(1).strip() != SUPPORTED_VERSION
        or not plugin_version
        or plugin_version.group(1) != SUPPORTED_VERSION
        or not plugin_marker
        or plugin_marker.group(1) != HEALTH_MARKER
        or not mobile_nav_style_element_id
        or mobile_nav_style_element_id.group(1) != MOBILE_NAV_STYLE_ELEMENT_ID
        or not mobile_nav_css_marker
        or mobile_nav_css_marker.group(1) != MOBILE_NAV_CSS_MARKER
        or "data-noptimize=\"1\"" not in plugin_source
        or "wp_add_inline_style" in plugin_source
        or "wp_enqueue_style" in plugin_source
    ):
        raise RuntimeError("Local plugin identity differs from deploy-tool constants.")

    valid_transitions = (
        ("install", "absent", False),
        ("install", "inactive_exact", False),
        ("install", "inactive_supported_prior", True),
        ("deactivate", "active_exact", False),
        ("deactivate", "active_supported_prior", True),
        ("reactivate", "inactive_supported_prior", True),
        ("rollback-supported-prior", "active_exact", True),
    )

    def release_args(action: str, prior_state: str, use_prior: bool) -> argparse.Namespace:
        return argparse.Namespace(
            action=action,
            commit_sha="b" * 40,
            version=SUPPORTED_VERSION,
            artifact_sha256="c" * 64,
            expected_prior_state=prior_state,
            expected_prior_version=SUPPORTED_PRIOR_VERSION if use_prior else "",
            expected_prior_marker=SUPPORTED_PRIOR_MARKER if use_prior else "",
            expected_prior_artifact_sha256=(
                SUPPORTED_PRIOR_ARTIFACT_SHA256 if use_prior else ""
            ),
            expected_prior_plugin_file_sha256=(
                SUPPORTED_PRIOR_PLUGIN_FILE_SHA256 if use_prior else ""
            ),
            timeout=240,
        )

    helper_lints: list[dict[str, Any]] = []
    for action, prior_state, use_prior in valid_transitions:
        validated = validate_release_inputs(
            release_args(action, prior_state, use_prior)
        )
        prior_values = validated[3:]
        helper_code, _ = build_helper_code(
            action=action,
            route_path="/run-self-test",
            helper_id=999999,
            helper_name="tmp-seo-p0-self-test",
            token="a" * 64,
            commit_sha="b" * 40,
            version=SUPPORTED_VERSION,
            expected_marker=HEALTH_MARKER,
            expected_artifact_sha256="c" * 64,
            expected_artifact_bytes=1234,
            expected_plugin_file_sha256="d" * 64,
            expected_prior_state=prior_state,
            expected_prior_version=prior_values[0],
            expected_prior_marker=prior_values[1],
            expected_prior_artifact_sha256=prior_values[2],
            expected_prior_plugin_file_sha256=prior_values[3],
            immutable_artifact_url=artifact_url("b" * 40, SUPPORTED_VERSION),
            immutable_prior_artifact_url=(
                prior_artifact_url() if use_prior else ""
            ),
            expected_prior_artifact_bytes=4321 if use_prior else 0,
        )
        required_helper_fragments = (
            "?nlcb=",
            "$purge_release_caches",
            "$restore_original",
            "rollback_cache",
            "inactive_supported_prior",
            "active_supported_prior",
            "rollback-supported-prior",
            "AND BINARY option_value = BINARY %s",
            "true !== $object_cache_flush_result",
            "$assert_lock_owner();",
        )
        if any(fragment not in helper_code for fragment in required_helper_fragments):
            raise RuntimeError("Generated helper lost a recovery or cache contract.")
        if use_prior and prior_artifact_url() not in helper_code:
            raise RuntimeError(
                "Generated helper is not pinned to the historical prior ZIP URL."
            )
        release_cas_position = helper_code.rfind(
            "$lock_release_rows = $cas_delete_lock( $lock_value );"
        )
        cleanup_restore_position = helper_code.rfind(
            "$cleanup_restoration = $restore_original();"
        )
        release_cache_position = helper_code.rfind(
            "wp_cache_delete( $lock_name, 'options' );",
            0,
            release_cas_position,
        )
        release_read_position = helper_code.find(
            "$lock_release_absent = null === $read_raw_lock();",
            release_cas_position,
        )
        stale_transfer_position = helper_code.find(
            "$stale_cas_rows = $cas_update_lock( $stale_raw, $lock_value );"
        )
        old_helper_present_if_position = helper_code.find(
            "if ( $old_helper_present ) {",
            stale_transfer_position,
        )
        old_helper_delete_position = helper_code.find(
            "$old_helper_deleted = (bool) \\Code_Snippets\\delete_snippet(",
            old_helper_present_if_position,
        )
        old_helper_reread_position = helper_code.find(
            "$old_helper_after = \\Code_Snippets\\get_snippet(",
            old_helper_delete_position,
        )
        old_helper_absence_position = helper_code.find(
            "$lock_evidence['old_helper_absent_after'] = $old_helper_absent_after;",
            old_helper_reread_position,
        )
        old_helper_if_closed_before_reread = bool(
            re.search(
                r"if \( \$old_helper_present \) \{.*?\n\t{4}\}\n\t{4}"
                r"\$old_helper_after = \\Code_Snippets\\get_snippet\(",
                helper_code,
                flags=re.DOTALL,
            )
        )
        stale_cleanup_flag_position = helper_code.find(
            "$stale_recovery_cleanup_only = true;",
            old_helper_absence_position,
        )
        current_state_position = helper_code.find(
            "$current = $inspect_installed();",
            stale_cleanup_flag_position,
        )
        prior_mismatch_position = helper_code.find(
            "if ( $expected_prior_state !== $current_state ) {",
            current_state_position,
        )
        exact_precondition_position = helper_code.find(
            "$lock_evidence['exact_prior_state_precondition_verified'] = true;",
            prior_mismatch_position,
        )
        stale_cleanup_stop_position = helper_code.find(
            "Stale deployment ownership was recovered without running the requested transition.",
            exact_precondition_position,
        )
        original_capture_position = helper_code.find(
            "$original_active = (bool) $current['active'];",
            stale_cleanup_stop_position,
        )
        action_branch_position = helper_code.find(
            "if ( 'install' === $expected_action ) {",
            original_capture_position,
        )
        stale_runtime_prefix = helper_code[
            stale_transfer_position:original_capture_position
        ]
        forbidden_stale_takeover_mutations = (
            "download_url(",
            "Plugin_Upgrader",
            "activate_plugin(",
            "deactivate_plugins(",
            "file_put_contents(",
            "wp_mkdir_p(",
            "wp_cache_flush(",
            "clean_post_cache(",
            "clean_term_cache(",
            "$purge_release_caches",
            "$restore_original",
        )
        post_release = helper_code[release_cas_position:]
        forbidden_post_release_mutations = (
            "activate_plugin(",
            "deactivate_plugins(",
            "Plugin_Upgrader",
            "file_put_contents(",
            "wp_mkdir_p(",
            "$restore_original();",
            "wp_cache_flush(",
            "clean_post_cache(",
            "clean_term_cache(",
            "wp_cache_delete(",
        )
        if (
            "delete_option( $lock_name" in helper_code
            or helper_code.count("$assert_lock_owner();") < 15
            or cleanup_restore_position < 0
            or not cleanup_restore_position < release_cas_position
            or not release_cache_position < release_cas_position < release_read_position
            or not (
                stale_transfer_position
                < old_helper_present_if_position
                < old_helper_delete_position
                < old_helper_reread_position
                < old_helper_absence_position
                < stale_cleanup_flag_position
                < current_state_position
                < prior_mismatch_position
                < exact_precondition_position
                < stale_cleanup_stop_position
                < original_capture_position
                < action_branch_position
            )
            or not old_helper_if_closed_before_reread
            or any(
                fragment in stale_runtime_prefix
                for fragment in forbidden_stale_takeover_mutations
            )
            or "justice_p0_stale_lock_recovered_reconciliation_required"
            not in helper_code
            or "$failure_code    = $stale_recovery_cleanup_only" not in helper_code
            or any(
                fragment in post_release
                for fragment in forbidden_post_release_mutations
            )
            or "$expected_action === $stale['action']" in helper_code
            or "$expected_prior_state === $stale['expected_prior_state']" in helper_code
        ):
            raise RuntimeError(
                "Generated helper lost owner-CAS, release-last, or cross-action recovery safety."
            )
        helper_lints.append(
            {
                "action": action,
                "prior_state": prior_state,
                **lint_php_snippet(helper_code),
            }
        )

    invalid_transitions = (
        ("install", "active_exact", False),
        ("deactivate", "inactive_exact", False),
        ("reactivate", "active_supported_prior", True),
        ("rollback-supported-prior", "inactive_supported_prior", True),
    )
    for action, prior_state, use_prior in invalid_transitions:
        try:
            validate_release_inputs(release_args(action, prior_state, use_prior))
        except RuntimeError:
            continue
        raise RuntimeError("Invalid deployment transition was accepted.")

    for field in (
        "expected_prior_version",
        "expected_prior_marker",
        "expected_prior_artifact_sha256",
        "expected_prior_plugin_file_sha256",
    ):
        drifted = release_args("deactivate", "active_supported_prior", True)
        original = str(getattr(drifted, field))
        setattr(drifted, field, ("0" if original[:1] != "0" else "1") + original[1:])
        try:
            validate_release_inputs(drifted)
        except RuntimeError:
            continue
        raise RuntimeError(f"Drifted prior pin was accepted: {field}")

    if (
        SUPPORTED_PRIOR_COMMIT_SHA not in prior_artifact_url()
        or SUPPORTED_PRIOR_COMMIT_SHA not in prior_plugin_source_url()
        or ("b" * 40) in prior_artifact_url()
    ):
        raise RuntimeError("Supported-prior URLs are not pinned to historical 0.1.1.")

    local_prior_zip = (
        REPO_ROOT
        / "plugin-dist"
        / f"{PLUGIN_SLUG}-{SUPPORTED_PRIOR_VERSION}.zip"
    ).read_bytes()
    historical_source_result = subprocess.run(
        [
            "git",
            "show",
            f"{SUPPORTED_PRIOR_COMMIT_SHA}:{PLUGIN_BASENAME}",
        ],
        cwd=REPO_ROOT,
        capture_output=True,
        check=False,
    )
    if historical_source_result.returncode != 0:
        raise RuntimeError("Could not read the pinned historical prior source.")
    historical_source = historical_source_result.stdout.replace(
        b"\r\n", b"\n"
    ).replace(b"\r", b"\n")
    with zipfile.ZipFile(io.BytesIO(local_prior_zip), "r") as prior_archive:
        if prior_archive.namelist() != [PLUGIN_BASENAME]:
            raise RuntimeError("Local supported-prior ZIP member set changed.")
        historical_member = prior_archive.read(PLUGIN_BASENAME)
    if (
        hashlib.sha256(local_prior_zip).hexdigest()
        != SUPPORTED_PRIOR_ARTIFACT_SHA256
        or hashlib.sha256(historical_member).hexdigest()
        != SUPPORTED_PRIOR_PLUGIN_FILE_SHA256
        or historical_source != historical_member
    ):
        raise RuntimeError(
            "Historical prior source, ZIP, or pinned hashes no longer agree."
        )

    valid_cache = {
        "object_cache_flush_result": True,
        "litespeed_purge_all_dispatched": True,
        "litespeed_url_purge_dispatches": len(AFFECTED_PATHS),
        "affected_urls": [f"{TARGET_BASE_URL}{path}" for path in AFFECTED_PATHS],
        "post_cache_ids": [7905, 23405, 23406],
        "term_cache_ids": [170, 730],
    }
    rejected_cache = {**valid_cache, "object_cache_flush_result": False}
    fresh_lock = {
        "contract": DEPLOY_LOCK_CONTRACT,
        "schema_version": DEPLOY_LOCK_SCHEMA_VERSION,
        "stale_after_seconds": DEPLOY_LOCK_STALE_AFTER_SECONDS,
        "acquisition_mode": "fresh_add",
        "acquired": True,
        "owner_reread_exact": True,
        "stale_lock_inspected": False,
        "stale_lock_identity_valid": False,
        "stale_lock_age_seconds": None,
        "stale_owner_sha256": "",
        "stale_action": "",
        "stale_expected_prior_state": "",
        "stale_transition_valid": False,
        "stale_cas_rows": 0,
        "old_helper_present": None,
        "old_helper_identity_valid": None,
        "old_helper_deleted": None,
        "old_helper_absent_after": None,
        "prior_process_death_ambiguity": False,
        "exact_prior_state_precondition_verified": False,
        "owner_assertions_passed": 20,
        "owner_assertion_failed": False,
        "release_required": True,
        "release_attempted": True,
        "release_precondition_exact": True,
        "release_cas_rows": 1,
        "release_absence_confirmed": True,
        "release_error": "",
        "released": True,
    }
    stale_lock = {
        **fresh_lock,
        "acquisition_mode": "stale_cas",
        "stale_lock_inspected": True,
        "stale_lock_identity_valid": True,
        "stale_lock_age_seconds": DEPLOY_LOCK_STALE_AFTER_SECONDS + 1,
        "stale_owner_sha256": "a" * 64,
        "stale_action": "install",
        "stale_expected_prior_state": "absent",
        "stale_transition_valid": True,
        "stale_cas_rows": 1,
        "old_helper_present": True,
        "old_helper_identity_valid": True,
        "old_helper_deleted": True,
        "old_helper_absent_after": True,
        "prior_process_death_ambiguity": True,
        "exact_prior_state_precondition_verified": True,
    }
    bad_release_lock = {**fresh_lock, "release_cas_rows": 0, "released": False}
    if (
        not cache_evidence_is_exact(valid_cache)
        or cache_evidence_is_exact(rejected_cache)
        or not lock_evidence_is_accepted(fresh_lock)
        or not lock_evidence_is_accepted(stale_lock)
        or lock_evidence_is_accepted(bad_release_lock)
    ):
        raise RuntimeError("Cache or lock evidence acceptance contract changed.")

    now_epoch = 2_000_000_000
    stale_owner = {
        "schema_version": DEPLOY_LOCK_SCHEMA_VERSION,
        "contract": DEPLOY_LOCK_CONTRACT,
        "base_url": TARGET_BASE_URL,
        "plugin": PLUGIN_BASENAME,
        "run_id": "seo-recovery-p0-install-20260731T000000Z-deadbeef",
        "helper_id": 123,
        "helper_name": "tmp-seo-recovery-p0-install-20260731T000000Z-deadbeef",
        "route_path": "/run-seo-recovery-p0-install-20260731T000000Z-deadbeef",
        "helper_code_sha256": "c" * 64,
        "commit_sha": "b" * 40,
        "action": "install",
        "expected_prior_state": "absent",
        "owner_nonce_sha256": "d" * 64,
        "acquired_at": now_epoch - DEPLOY_LOCK_STALE_AFTER_SECONDS - 1,
    }
    cross_action_recovery = stale_lock_record_is_recoverable(
        stale_owner,
        protected_commit_sha="b" * 40,
        now_epoch=now_epoch,
        next_action="rollback-supported-prior",
        next_expected_prior_state="active_exact",
    )
    same_action_retry = stale_lock_record_is_recoverable(
        stale_owner,
        protected_commit_sha="b" * 40,
        now_epoch=now_epoch,
        next_action="install",
        next_expected_prior_state="absent",
    )
    unknown_owner = {**stale_owner, "unknown": True}
    fresh_owner = {
        **stale_owner,
        "acquired_at": now_epoch - DEPLOY_LOCK_STALE_AFTER_SECONDS,
    }
    future_owner = {**stale_owner, "acquired_at": now_epoch + 1}
    invalid_epoch_owner = {**stale_owner, "acquired_at": -1}
    if (
        not cross_action_recovery
        or not same_action_retry
        or stale_lock_record_is_recoverable(
            unknown_owner,
            protected_commit_sha="b" * 40,
            now_epoch=now_epoch,
            next_action="install",
            next_expected_prior_state="absent",
        )
        or stale_lock_record_is_recoverable(
            fresh_owner,
            protected_commit_sha="b" * 40,
            now_epoch=now_epoch,
            next_action="install",
            next_expected_prior_state="absent",
        )
        or stale_lock_record_is_recoverable(
            future_owner,
            protected_commit_sha="b" * 40,
            now_epoch=now_epoch,
            next_action="install",
            next_expected_prior_state="absent",
        )
        or stale_lock_record_is_recoverable(
            invalid_epoch_owner,
            protected_commit_sha="b" * 40,
            now_epoch=now_epoch,
            next_action="install",
            next_expected_prior_state="absent",
        )
    ):
        raise RuntimeError("Fresh, unknown, future, or cross-action lock recovery changed.")

    stale_exact_decision = modeled_callback_mutation_decision(
        acquisition_mode="stale_cas",
        exact_prior_state=True,
    )
    stale_mismatch_decision = modeled_callback_mutation_decision(
        acquisition_mode="stale_cas",
        exact_prior_state=False,
    )
    fresh_exact_decision = modeled_callback_mutation_decision(
        acquisition_mode="fresh_add",
        exact_prior_state=True,
    )
    present_helper_cleanup = modeled_stale_helper_cleanup(
        initially_present=True,
        deletion_confirmed=True,
        post_cas_reread_absent=True,
    )
    absent_helper_cleanup = modeled_stale_helper_cleanup(
        initially_present=False,
        deletion_confirmed=None,
        post_cas_reread_absent=True,
    )
    if (
        stale_exact_decision.get("requested_transition_runs") is not False
        or stale_exact_decision.get("requires_operator_reconciliation") is not True
        or stale_exact_decision.get("stale_recovery_cleanup_only") is not True
        or stale_mismatch_decision.get("requested_transition_runs") is not False
        or stale_mismatch_decision.get("requires_operator_reconciliation") is not True
        or stale_mismatch_decision.get("stale_recovery_cleanup_only") is not True
        or stale_mismatch_decision.get("exact_prior_state_precondition_verified")
        is not False
        or stale_mismatch_decision.get("failure_code")
        != "justice_p0_stale_lock_recovered_reconciliation_required"
        or fresh_exact_decision.get("requested_transition_runs") is not True
        or present_helper_cleanup.get("old_helper_deleted") is not True
        or present_helper_cleanup.get("post_cas_absence_reread_performed") is not True
        or present_helper_cleanup.get("stale_recovery_cleanup_only") is not True
        or absent_helper_cleanup.get("old_helper_deleted") is not None
        or absent_helper_cleanup.get("post_cas_absence_reread_performed") is not True
        or absent_helper_cleanup.get("old_helper_absent_after") is not True
        or absent_helper_cleanup.get("stale_recovery_cleanup_only") is not True
        or "conditional_exact_delete"
        in list(absent_helper_cleanup.get("event_order") or [])
        or list(absent_helper_cleanup.get("event_order") or [])[-2:]
        != ["post_cas_absence_reread", "mark_cleanup_only"]
    ):
        raise RuntimeError("Cleanup-only stale takeover mutation gate changed.")

    if parse_guard_details_url(
        "https://github.com/The-new-ben/justice-theme/actions/runs/123/job/456",
        456,
    ) != (123, 456):
        raise RuntimeError("Exact guard details URL parsing changed.")
    rejected_guard_urls = (
        "http://github.com/The-new-ben/justice-theme/actions/runs/123/job/456",
        "https://evil.example/The-new-ben/justice-theme/actions/runs/123/job/456",
        "https://github.com/The-new-ben/justice-theme/actions/runs/123/job/456?x=1",
        "https://github.com/The-new-ben/justice-theme/actions/runs/123/job/457",
    )
    for rejected_url in rejected_guard_urls:
        try:
            parse_guard_details_url(rejected_url, 456)
        except RuntimeError:
            continue
        raise RuntimeError("A non-exact guard details URL was accepted.")

    clean_preflight_failure = state_reconciliation_observation(
        action="install",
        expected_prior_state="absent",
        passed=False,
        callback_attempted=False,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
        helper_absent=True,
        helper_direct_absent=True,
        route_absent=True,
        temp_files_cleanup_complete=True,
        lock_cleanup_proven=True,
        stale_helper_cleanup_proven=True,
        prior_process_death_ambiguity=False,
        exact_prior_state_precondition_verified=False,
    )
    preflight_cleanup_unknown = state_reconciliation_observation(
        action="install",
        expected_prior_state="absent",
        passed=False,
        callback_attempted=False,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
        helper_absent=False,
        helper_direct_absent=False,
        route_absent=False,
        temp_files_cleanup_complete=True,
        lock_cleanup_proven=True,
        stale_helper_cleanup_proven=True,
        prior_process_death_ambiguity=False,
        exact_prior_state_precondition_verified=False,
    )
    activation_failure = state_reconciliation_observation(
        action="install",
        expected_prior_state="absent",
        passed=False,
        callback_attempted=True,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
        helper_absent=True,
        helper_direct_absent=True,
        route_absent=True,
        temp_files_cleanup_complete=True,
        lock_cleanup_proven=True,
        stale_helper_cleanup_proven=True,
        prior_process_death_ambiguity=False,
        exact_prior_state_precondition_verified=False,
    )
    identity_get_failure = state_reconciliation_observation(
        action="install",
        expected_prior_state="absent",
        passed=False,
        callback_attempted=False,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
        helper_absent=True,
        helper_direct_absent=False,
        route_absent=True,
        temp_files_cleanup_complete=True,
        lock_cleanup_proven=True,
        stale_helper_cleanup_proven=True,
        prior_process_death_ambiguity=False,
        exact_prior_state_precondition_verified=False,
    )
    cleanup_failure = state_reconciliation_observation(
        action="install",
        expected_prior_state="absent",
        passed=False,
        callback_attempted=False,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
        helper_absent=True,
        helper_direct_absent=True,
        route_absent=False,
        temp_files_cleanup_complete=False,
        lock_cleanup_proven=False,
        stale_helper_cleanup_proven=False,
        prior_process_death_ambiguity=True,
        exact_prior_state_precondition_verified=False,
    )
    reactivate_failure = state_reconciliation_observation(
        action="reactivate",
        expected_prior_state="inactive_supported_prior",
        passed=False,
        callback_attempted=True,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
        helper_absent=True,
        helper_direct_absent=True,
        route_absent=True,
        temp_files_cleanup_complete=True,
        lock_cleanup_proven=True,
        stale_helper_cleanup_proven=True,
        prior_process_death_ambiguity=False,
        exact_prior_state_precondition_verified=False,
    )
    recovered_stale_owner = state_reconciliation_observation(
        action="rollback-supported-prior",
        expected_prior_state="active_exact",
        passed=True,
        callback_attempted=True,
        callback_confirmed=True,
        desired_state_observed_by_health=True,
        callback_reported_failed_rollback=False,
        helper_absent=True,
        helper_direct_absent=True,
        route_absent=True,
        temp_files_cleanup_complete=True,
        lock_cleanup_proven=True,
        stale_helper_cleanup_proven=True,
        prior_process_death_ambiguity=True,
        exact_prior_state_precondition_verified=True,
    )
    failed_stale_precondition = state_reconciliation_observation(
        action="rollback-supported-prior",
        expected_prior_state="active_exact",
        passed=False,
        callback_attempted=True,
        callback_confirmed=False,
        desired_state_observed_by_health=False,
        callback_reported_failed_rollback=False,
        helper_absent=True,
        helper_direct_absent=True,
        route_absent=True,
        temp_files_cleanup_complete=True,
        lock_cleanup_proven=True,
        stale_helper_cleanup_proven=True,
        prior_process_death_ambiguity=True,
        exact_prior_state_precondition_verified=False,
    )
    reactivate_guidance = str(reactivate_failure["required_reconciliation"])
    if (
        clean_preflight_failure["requires_operator_reconciliation"] is not False
        or preflight_cleanup_unknown["requires_operator_reconciliation"] is not True
        or activation_failure["requires_operator_reconciliation"] is not True
        or identity_get_failure["requires_operator_reconciliation"] is not True
        or cleanup_failure["requires_operator_reconciliation"] is not True
        or cleanup_failure["safe_to_resume_without_reconciliation"] is not False
        or recovered_stale_owner["requires_operator_reconciliation"] is not True
        or failed_stale_precondition["requires_operator_reconciliation"] is not True
        or failed_stale_precondition["stale_recovery_precondition_unresolved"]
        is not True
        or "remove only" not in str(activation_failure["required_reconciliation"])
        or "inactive_supported_prior" not in reactivate_guidance
        or "active_supported_prior" not in reactivate_guidance
        or "active_exact" in reactivate_guidance
    ):
        raise RuntimeError("Fail-closed deployment reconciliation contract changed.")

    return {
        "passed": True,
        "required_live_theme_version": REQUIRED_LIVE_THEME_VERSION,
        "required_live_theme_marker": REQUIRED_LIVE_THEME_MARKER,
        "plugin_version": SUPPORTED_VERSION,
        "plugin_marker": HEALTH_MARKER,
        "mobile_nav_css_marker": MOBILE_NAV_CSS_MARKER,
        "supported_prior": {
            "commit_sha": SUPPORTED_PRIOR_COMMIT_SHA,
            "version": SUPPORTED_PRIOR_VERSION,
            "marker": SUPPORTED_PRIOR_MARKER,
            "artifact_sha256": SUPPORTED_PRIOR_ARTIFACT_SHA256,
            "plugin_file_sha256": SUPPORTED_PRIOR_PLUGIN_FILE_SHA256,
            "historical_source_matches_zip_member": True,
        },
        "helper_lints": helper_lints,
        "valid_transition_count": len(valid_transitions),
        "pin_drift_rejections": 4,
        "lost_response_requires_reconciliation": True,
    }


def run(args: argparse.Namespace) -> tuple[int, Path, dict[str, Any]]:
    (
        commit_sha,
        version,
        expected_artifact_sha256,
        expected_prior_version,
        expected_prior_marker,
        expected_prior_artifact_sha256,
        expected_prior_plugin_file_sha256,
    ) = validate_release_inputs(args)
    immutable_url = artifact_url(commit_sha, version)
    immutable_prior_url = (
        prior_artifact_url()
        if expected_prior_artifact_sha256
        else ""
    )
    immutable_prior_source_url = (
        prior_plugin_source_url()
        if expected_prior_artifact_sha256
        else ""
    )
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
            "expected_prior_version": expected_prior_version,
            "expected_prior_marker": expected_prior_marker,
            "expected_prior_artifact_sha256": expected_prior_artifact_sha256,
            "expected_prior_plugin_file_sha256": (
                expected_prior_plugin_file_sha256
            ),
            "immutable_prior_artifact_url": immutable_prior_url,
            "immutable_prior_source_url": immutable_prior_source_url,
            "supported_prior_commit_sha": (
                SUPPORTED_PRIOR_COMMIT_SHA if expected_prior_artifact_sha256 else ""
            ),
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
        if expected_prior_artifact_sha256:
            evidence["checks"]["protected_supported_prior_provenance"] = (
                verify_supported_prior_provenance(commit_sha, args.timeout)
            )
        evidence["checks"]["protected_deploy_tool_source"] = (
            inspect_deploy_tool_source_contract(commit_sha, args.timeout)
        )
        artifact_preflight = inspect_artifact(
            immutable_url,
            immutable_source_url,
            expected_artifact_sha256,
            version,
            HEALTH_MARKER,
            args.timeout,
        )
        evidence["checks"]["client_artifact_preflight"] = artifact_preflight
        prior_artifact_preflight: dict[str, Any] | None = None
        if immutable_prior_url:
            prior_artifact_preflight = inspect_prior_artifact(
                immutable_prior_url,
                immutable_prior_source_url,
                args.timeout,
            )
            evidence["checks"]["client_supported_prior_artifact_preflight"] = (
                prior_artifact_preflight
            )

        client = WordpressClient(
            base_url, env["WP_USER"], env["WP_APP_PASSWORD"]
        )
        evidence["checks"]["authenticated_site_identity"] = verify_site_identity(
            client
        )
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
            expected_marker=HEALTH_MARKER,
            expected_artifact_sha256=expected_artifact_sha256,
            expected_artifact_bytes=int(artifact_preflight["bytes"]),
            expected_plugin_file_sha256=str(
                artifact_preflight["plugin_entry_sha256"]
            ),
            expected_prior_state=args.expected_prior_state,
            expected_prior_version=expected_prior_version,
            expected_prior_marker=expected_prior_marker,
            expected_prior_artifact_sha256=expected_prior_artifact_sha256,
            expected_prior_plugin_file_sha256=(
                expected_prior_plugin_file_sha256
            ),
            immutable_artifact_url=immutable_url,
            immutable_prior_artifact_url=immutable_prior_url,
            expected_prior_artifact_bytes=(
                int(prior_artifact_preflight["bytes"])
                if prior_artifact_preflight is not None
                else 0
            ),
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
        supported_prior_result = args.action in {
            "reactivate",
            "rollback-supported-prior",
        } or args.expected_prior_state == "active_supported_prior"
        expected_result_version = (
            expected_prior_version if supported_prior_result else version
        )
        expected_result_marker = (
            expected_prior_marker if supported_prior_result else HEALTH_MARKER
        )
        expected_result_artifact_sha256 = (
            expected_prior_artifact_sha256
            if supported_prior_result
            else expected_artifact_sha256
        )
        expected_result_plugin_sha256 = (
            expected_prior_plugin_file_sha256
            if supported_prior_result
            else str(artifact_preflight["plugin_entry_sha256"])
        )
        expected_result_artifact_bytes = (
            int(prior_artifact_preflight["bytes"])
            if supported_prior_result and prior_artifact_preflight is not None
            else int(artifact_preflight["bytes"])
        )
        expected_result_state = (
            "active_exact"
            if args.action == "install"
            else (
                "inactive_supported_prior"
                if args.action == "deactivate"
                and args.expected_prior_state == "active_supported_prior"
                else (
                    "inactive_exact"
                    if args.action == "deactivate"
                    else "active_supported_prior"
                )
            )
        )
        cache_summary = callback_summary.get("cache")
        cache_ok = cache_evidence_is_exact(cache_summary)
        lock_ok = lock_evidence_is_accepted(callback_summary.get("lock"))
        callback_success = (
            callback_response.status_code == 200
            and callback_summary.get("success") is True
            and callback_summary.get("action") == args.action
            and callback_summary.get("commit_sha") == commit_sha
            and callback_summary.get("plugin") == PLUGIN_BASENAME
            and callback_summary.get("version") == expected_result_version
            and callback_summary.get("marker") == expected_result_marker
            and callback_summary.get("prior_state") == args.expected_prior_state
            and callback_summary.get("result_state") == expected_result_state
            and callback_summary.get("plugin_file_sha256")
            == expected_result_plugin_sha256
            and callback_summary.get("artifact_sha256")
            == expected_result_artifact_sha256
            and callback_summary.get("artifact_bytes")
            == expected_result_artifact_bytes
            and callback_summary.get("expected_prior_version")
            == expected_prior_version
            and callback_summary.get("expected_prior_marker")
            == expected_prior_marker
            and callback_summary.get("expected_prior_artifact_sha256")
            == expected_prior_artifact_sha256
            and callback_summary.get("expected_prior_plugin_file_sha256")
            == expected_prior_plugin_file_sha256
            and callback_summary.get("temp_files_cleanup_complete") is True
            and callback_summary.get("stale_recovery_cleanup_only") is False
            and callback_summary.get("helper_deleted") is True
            and callback_summary.get("helper_absent_after") is True
            and callback_summary.get("lock_acquired") is True
            and callback_summary.get("lock_release_required") is True
            and callback_summary.get("lock_release_attempted") is True
            and callback_summary.get("lock_released") is True
            and callback_summary.get("rollback_attempted") is False
            and callback_summary.get("rollback_succeeded") is True
            and cache_ok
            and lock_ok
        )
        if args.action == "install":
            callback_success = (
                callback_success
                and callback_summary.get("active") is True
            )
        elif args.action == "deactivate":
            callback_success = (
                callback_success
                and callback_summary.get("active") is False
                and callback_summary.get("files_preserved") is True
            )
        elif args.action == "reactivate":
            callback_success = (
                callback_success
                and callback_summary.get("active") is True
                and callback_summary.get("files_preserved") is True
            )
        else:
            callback_success = (
                callback_success
                and callback_summary.get("active") is True
                and callback_summary.get("restored_supported_prior") is True
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
    theme_unchanged_ok = False
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
            elif args.action == "deactivate":
                health_ok = (
                    public_health.status_code == 404
                    and health_summary.get("code") == "rest_no_route"
                )
            else:
                health_ok = (
                    public_health.status_code == 200
                    and health_summary.get("version") == expected_prior_version
                    and health_summary.get("marker") == expected_prior_marker
                )

            evidence["checks"]["live_theme_unchanged_after_operation"] = (
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
        or (args.action == "reactivate" and health_ok)
        or (args.action == "rollback-supported-prior" and health_ok)
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
    callback_lock = (
        callback_summary.get("lock")
        if isinstance(callback_summary, dict)
        and isinstance(callback_summary.get("lock"), dict)
        else {}
    )
    temp_files_cleanup_complete = bool(
        not callback_attempted
        or (
            isinstance(callback_summary, dict)
            and callback_summary.get("temp_files_cleanup_complete") is True
        )
    )
    lock_cleanup_proven = lock_release_cleanup_is_proven(
        callback_summary if isinstance(callback_summary, dict) else {},
        callback_attempted=callback_attempted,
    )
    stale_cleanup_proven = stale_helper_cleanup_is_proven(
        callback_summary if isinstance(callback_summary, dict) else {},
        callback_attempted=callback_attempted,
    )
    prior_process_death_ambiguity = (
        callback_lock.get("prior_process_death_ambiguity") is True
    )
    exact_prior_state_precondition_verified = (
        callback_lock.get("exact_prior_state_precondition_verified") is True
    )
    if prior_process_death_ambiguity:
        passed = False
    evidence["state_reconciliation"] = state_reconciliation_observation(
        action=args.action,
        expected_prior_state=args.expected_prior_state,
        passed=passed,
        callback_attempted=callback_attempted,
        callback_confirmed=callback_success,
        desired_state_observed_by_health=desired_state_observed_by_health,
        callback_reported_failed_rollback=callback_reported_failed_rollback,
        helper_absent=helper_absent,
        helper_direct_absent=helper_direct_absent,
        route_absent=route_absent,
        temp_files_cleanup_complete=temp_files_cleanup_complete,
        lock_cleanup_proven=lock_cleanup_proven,
        stale_helper_cleanup_proven=stale_cleanup_proven,
        prior_process_death_ambiguity=prior_process_death_ambiguity,
        exact_prior_state_precondition_verified=(
            exact_prior_state_precondition_verified
        ),
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
