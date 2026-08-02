#!/usr/bin/env python3
"""Deploy the exact protected-main Justice Ops artifact with live rollback.

This driver is deliberately scoped to ``justice-ops/justice-ops.php`` on
https://jus-tice.co.il.  It creates one temporary, administrator-gated Code
Snippets bridge.  Before installation the bridge copies and exports every live
plugin file byte-for-byte.  The client writes that export to a local rollback
ZIP and manifest, verifies it, and only then permits ``Plugin_Upgrader`` to
overwrite the plugin.

Any installer or HTTP acceptance failure requests an exact restore from the
fresh server-side copy.  Every run emits credential-free evidence.  The bridge
is hard-deleted and its route, lock, state and temporary files must be absent
before a run can pass.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import html as html_module
import io
import json
import os
import re
import secrets
import subprocess
import sys
import tempfile
import time
import urllib.parse
import zipfile
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from typing import Any, Iterable, Mapping


# Imported lazily in ``main`` so the offline self-test also works with ``-S``.
requests: Any = None


REPO_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = (
    REPO_ROOT.parents[1] if REPO_ROOT.parent.name == ".codex-tmp" else REPO_ROOT
)
TEMPLATE_PATH = REPO_ROOT / "tools" / "templates" / "justice-ops-deploy-helper.php.tpl"
DEFAULT_OUTPUT_DIR = (
    WORKSPACE_ROOT
    / "reports"
    / "seo-recovery-2026-07-31"
    / "release-path"
    / "justice-ops-deploy-2026-08-02"
)

REPOSITORY = "The-new-ben/justice-theme"
TARGET_BASE_URL = "https://jus-tice.co.il"
PLUGIN_SLUG = "justice-ops"
PLUGIN_BASENAME = "justice-ops/justice-ops.php"
HEALTH_ROUTE = "justice-ops/v1/healthcheck"
HELPER_NAMESPACE = "justice-ops-deploy/v1"
DEPLOY_TOOL_REPOSITORY_PATH = "tools/wp_deploy_justice_ops.py"
HELPER_TEMPLATE_REPOSITORY_PATH = (
    "tools/templates/justice-ops-deploy-helper.php.tpl"
)
REQUIRED_CHECK_NAME = "repository-release-guard"
REPOSITORY_RULESET_ID = 20160370
LOCK_OPTION = "justice_ops_deploy_lock_v1"
RECOVERY_PROOF_CONTRACT = "justice-ops-upress-recovery-proof-v2"
RECOVERY_PLUGIN_PATH = "wp-content/plugins/justice-ops"
RECOVERY_MARKER_ROOT = "wp-content/upgrade"
RECOVERY_UPRESS_PID = 90517
RECOVERY_PROOF_MAX_AGE_SECONDS = 15 * 60
OPERATION_NONCE_BYTES = 32
SAFE_AUTO_ROLLBACK_PHASES = frozenset(
    {
        "prepared",
        "sealed",
        "installed_pending_stabilization",
        "stabilized_pending_confirmation",
        "finalized",
        "prior_restored",
    }
)
MAX_ARTIFACT_BYTES = 25 * 1024 * 1024
MAX_PLUGIN_BYTES = 20 * 1024 * 1024
MAX_FILE_BYTES = 5 * 1024 * 1024
MAX_FILES = 250
MAX_EVIDENCE_MESSAGE_CHARS = 500

_SAFE_EVIDENCE_IDENTIFIER_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,127}$")
_EVIDENCE_CONTROL_CHARS_RE = re.compile(r"[\x00-\x1f\x7f]")

RELEASE_MARKER = 'data-jt-family-release="2026-08-02-r1"'
MAYA_PATH = "/family-law-lawyer-recommended-divorce-wills-inheritances/"
MAYA_RELEASE_MARKER = 'data-jt-maya-profile-release="2026-08-02-r1"'
MAYA_CONTENT_MARKER = 'data-jt-maya-profile-content="2026-08-02-r1"'
MAYA_DISCLOSURE_MARKER = 'data-jt-commercial-disclosure="maya-rotenberg"'
MAYA_SCHEMA_ID = "justice-maya-profile-schema"
MAYA_SCHEMA_TYPES = frozenset({"WebPage", "BreadcrumbList", "ListItem"})
OLD_REVIEW_MARKERS = (
    "eeat-reviewed-footer",
    "legal-pillar-reviewed",
    "legal-pillar-hero__reviewed",
    "single-article__author",
)

FORBIDDEN_REVIEW_TEXT_PATTERNS = (
    re.compile(r"\breviewed\s+by\b", re.IGNORECASE),
    re.compile(r"\breviewer\b", re.IGNORECASE),
    re.compile(r"נבדק(?:ה)?\s+על\s+ידי"),
    re.compile(r"נערך(?:ה)?\s+על\s+ידי"),
    re.compile(r"ביקורת\s+משפטית\s+של"),
)

AFFECTED_PATHS = (
    "/",
    "/family-law/",
    "/divorce-lawyer/",
    "/online-family-law-services/",
    "/experienced-family-law-attorney/",
    "/divorce-costs-2025/",
    "/lawyer-fees-guide/",
    MAYA_PATH,
    "/lawyers/",
    "/legal-help/",
    "/medical-malpractice-lawyer/",
)

PAGE_CONTRACTS: dict[str, dict[str, str]] = {
    "/family-law/": {
        "h1": "עורך דין לענייני משפחה: מציאת מומחה לפי הבעיה המשפטית",
        "title": "עורך דין לענייני משפחה: בחירה לפי סוג המקרה | Jus-Tice",
        "description": "איזה עורך דין לענייני משפחה מתאים למקרה שלכם, מתי נדרשת פעולה דחופה, אילו מסמכים להכין ואיך לבדוק ניסיון, זמינות ושכר טרחה לפני שבוחרים ייצוג.",
        "canonical": "https://jus-tice.co.il/family-law/",
    },
    "/divorce-lawyer/": {
        "h1": "עורך דין גירושין: בחירת ייצוג לפי מצב והליך",
        "title": "עורך דין גירושין: בחירת ייצוג לפי מצב והליך | Jus-Tice",
        "description": "מתי צריך עורך דין גירושין, איזה ניסיון לבדוק, אילו מסמכים להכין, מה לשאול על שכר הטרחה ואיך לפעול כשיש דיון, סיכון או מחלוקת דחופה.",
        "canonical": "https://jus-tice.co.il/divorce-lawyer/",
    },
    "/online-family-law-services/": {
        "h1": "שירותים מקוונים בדיני משפחה וגירושין",
        "title": "שירותים מקוונים בדיני משפחה: מה אפשר לבצע אונליין | Jus-Tice",
        "description": "רשימת פעולות רשמיות בדיני משפחה שניתן לבצע אונליין, עם קישור ישיר, דרישות, מסמכים, אגרה אם פורסמה ותאריך בדיקה לכל שירות.",
        "canonical": "https://jus-tice.co.il/online-family-law-services/",
    },
    "/experienced-family-law-attorney/": {
        "h1": "איך לבחור עורך דין לענייני משפחה: בדיקות לפני פגישה",
        "title": "איך לבחור עורך דין לענייני משפחה: בדיקות לפני פגישה | Jus-Tice",
        "description": "רשימת בדיקות ושאלות לפגישה עם עורך דין לענייני משפחה: ניסיון מתאים, זהות המטפל, אסטרטגיה, שכר טרחה, זמינות, פרטיות וסימני אזהרה.",
        "canonical": "https://jus-tice.co.il/experienced-family-law-attorney/",
    },
    "/divorce-costs-2025/": {
        "h1": "עלויות גירושין בישראל: אגרות, שכר טרחה והוצאות נלוות",
        "title": "כמה עולה להתגרש? עלויות גירושין ואגרות 2026 | Jus-Tice",
        "description": "כמה עולה להתגרש בישראל, אילו אגרות משלמים ומה צריך להופיע בהצעת שכר טרחה. סכומי אגרות רשמיים לשנת 2026 וכלי להשוואת היקף ועלות.",
        "canonical": "https://jus-tice.co.il/divorce-costs-2025/",
    },
    "/lawyer-fees-guide/": {
        "h1": "שכר טרחה עורך דין: איך בנוי המחיר ומה לבדוק בהצעה",
        "title": "שכר טרחה עורך דין: מודלי חיוב ובדיקת הצעה | Jus-Tice",
        "description": "איך בנוי שכר טרחה של עורך דין, מה ההבדל בין מחיר קבוע, שעה ושלב, אילו הוצאות לבדוק ואיך להשוות שתי הצעות על בסיס אותו היקף עבודה.",
        "canonical": "https://jus-tice.co.il/lawyer-fees-guide/",
    },
    MAYA_PATH: {
        "h1": "משרד מאיה רוטנברג בדיני משפחה: פרופיל ומקורות",
        "title": "משרד מאיה רוטנברג בדיני משפחה: פרופיל ומקורות | Jus-Tice",
        "description": "פרופיל מקורות של משרד מאיה רוטנברג: תחומי פעילות, רישום ב-Dun’s 100, תיעוד הייצוג בבע\"מ 919/15 וגילוי על הקשר המסחרי ל-Jus-Tice.",
        "canonical": "https://jus-tice.co.il/family-law-lawyer-recommended-divorce-wills-inheritances/",
        "release_marker": MAYA_RELEASE_MARKER,
    },
}

_COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")
_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
_VERSION_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+$")
_RUN_ID_RE = re.compile(
    r"^justice-ops-install-[0-9]{8}T[0-9]{6}Z-[a-f0-9]{8}$"
)
_SELF_HASH_MARKER = "__JUSTICE_OPS_HELPER_NORMALIZED_SHA256__"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def utc_slug() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_text(value: str) -> str:
    return sha256_bytes(value.encode("utf-8"))


def can_auto_rollback(status_reconciled: bool, observed_state: str) -> bool:
    """Rollback only from a successfully observed, explicitly safe phase."""

    return status_reconciled and observed_state in SAFE_AUTO_ROLLBACK_PHASES


def canonical_directory_digest(files: Mapping[str, Mapping[str, Any]]) -> str:
    """Hash path, byte count and content hash in one cross-runtime format."""

    digest = hashlib.sha256()
    for relative in sorted(files):
        item = files[relative]
        digest.update(relative.encode("utf-8"))
        digest.update(b"\0")
        digest.update(str(int(item["bytes"])).encode("ascii"))
        digest.update(b"\0")
        digest.update(str(item["sha256"]).lower().encode("ascii"))
        digest.update(b"\n")
    return digest.hexdigest()


def read_env(path: Path) -> dict[str, str]:
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
    if explicit is not None:
        resolved = explicit.expanduser().resolve()
        if not resolved.is_file():
            raise RuntimeError("The requested environment file does not exist.")
        return resolved
    candidates = [REPO_ROOT / ".env", WORKSPACE_ROOT / ".env", Path.cwd() / ".env"]
    for candidate in candidates:
        if candidate.resolve().is_file():
            return candidate.resolve()
    raise RuntimeError("No .env file was found; pass --env-file explicitly.")


def redact(value: Any, secrets_to_remove: Iterable[str]) -> Any:
    secrets_tuple = tuple(item for item in secrets_to_remove if item)
    if isinstance(value, dict):
        return {str(key): redact(item, secrets_tuple) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [redact(item, secrets_tuple) for item in value]
    if isinstance(value, str):
        result = value
        for secret in secrets_tuple:
            result = result.replace(secret, "[REDACTED]")
        return result
    return value


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Deploy protected Justice Ops with an exact live rollback snapshot."
    )
    parser.add_argument("--commit", required=True, dest="commit_sha")
    parser.add_argument("--version", required=True)
    parser.add_argument("--artifact-sha256", required=True)
    parser.add_argument("--expected-live-version", required=True)
    parser.add_argument(
        "--recovery-probe-evidence",
        type=Path,
        required=True,
        help="Fresh credential-free JSON proving the uPress file-recovery channel is reachable.",
    )
    parser.add_argument("--expected-live-manifest", type=Path)
    parser.add_argument("--expected-live-directory-sha256", default="")
    parser.add_argument(
        "--accept-observed-live-inventory",
        action="store_true",
        help="Explicitly accept the freshly observed full inventory when no prior manifest exists.",
    )
    parser.add_argument("--env-file", type=Path)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--timeout", type=int, default=240)
    return parser.parse_args(argv)


def validate_args(args: argparse.Namespace) -> tuple[str, str, str, str]:
    commit_sha = str(args.commit_sha).strip().lower()
    version = str(args.version).strip()
    artifact_sha256 = str(args.artifact_sha256).strip().lower()
    prior_version = str(args.expected_live_version).strip()
    if not _COMMIT_RE.fullmatch(commit_sha):
        raise RuntimeError("--commit must be an exact 40-character lowercase SHA.")
    if not _VERSION_RE.fullmatch(version) or not _VERSION_RE.fullmatch(prior_version):
        raise RuntimeError("Release and prior versions must be plain semantic versions.")
    if not _SHA256_RE.fullmatch(artifact_sha256):
        raise RuntimeError("--artifact-sha256 must contain 64 lowercase hex characters.")
    if args.expected_live_directory_sha256:
        args.expected_live_directory_sha256 = str(
            args.expected_live_directory_sha256
        ).strip().lower()
        if not _SHA256_RE.fullmatch(args.expected_live_directory_sha256):
            raise RuntimeError("--expected-live-directory-sha256 is invalid.")
    evidence_inputs = sum(
        (
            args.expected_live_manifest is not None,
            bool(args.expected_live_directory_sha256),
            bool(args.accept_observed_live_inventory),
        )
    )
    if evidence_inputs != 1:
        raise RuntimeError(
            "Choose exactly one live-inventory gate: manifest, canonical digest, "
            "or --accept-observed-live-inventory."
        )
    if args.timeout < 30 or args.timeout > 600:
        raise RuntimeError("--timeout must be between 30 and 600 seconds.")
    return commit_sha, version, artifact_sha256, prior_version


def artifact_url(commit_sha: str, version: str) -> str:
    return (
        f"https://raw.githubusercontent.com/{REPOSITORY}/{commit_sha}/"
        f"plugin-dist/{PLUGIN_SLUG}-{version}.zip"
    )


def raw_repository_url(commit_sha: str, repository_path: str) -> str:
    return (
        f"https://raw.githubusercontent.com/{REPOSITORY}/{commit_sha}/"
        f"{repository_path}"
    )


def github_get_json(path: str, timeout: int) -> dict[str, Any]:
    response = requests.get(  # type: ignore[name-defined]
        f"https://api.github.com/repos/{REPOSITORY}/{path.lstrip('/')}",
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "Jus-Tice-Justice-Ops-Release/1.0",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        timeout=timeout,
        allow_redirects=False,
    )
    if response.status_code != 200 or response.history:
        raise RuntimeError(f"GitHub provenance request failed for {path}.")
    payload = response.json()
    if not isinstance(payload, dict):
        raise RuntimeError("GitHub provenance returned an invalid payload.")
    return payload


def verify_release_provenance(commit_sha: str, timeout: int) -> dict[str, Any]:
    main = github_get_json("commits/main", timeout)
    if str(main.get("sha") or "").lower() != commit_sha:
        raise RuntimeError("The requested release is not the current protected main head.")
    checks = github_get_json(f"commits/{commit_sha}/check-runs?per_page=100", timeout)
    runs = checks.get("check_runs")
    if not isinstance(runs, list):
        raise RuntimeError("GitHub check-runs payload is invalid.")
    matching = [
        row
        for row in runs
        if isinstance(row, dict)
        and str(row.get("name") or "") == REQUIRED_CHECK_NAME
        and str(row.get("head_sha") or "").lower() == commit_sha
    ]
    if (
        len(matching) != 1
        or matching[0].get("status") != "completed"
        or matching[0].get("conclusion") != "success"
    ):
        raise RuntimeError("The required protected-main release guard is not successful.")
    app = matching[0].get("app")
    owner = app.get("owner") if isinstance(app, dict) else None
    if (
        not isinstance(app, dict)
        or int(app.get("id") or 0) != 15368
        or str(app.get("slug") or "") != "github-actions"
        or str(app.get("name") or "") != "GitHub Actions"
        or not isinstance(owner, dict)
        or str(owner.get("login") or "") != "github"
    ):
        raise RuntimeError("The release guard did not run under the pinned GitHub Actions app.")
    ruleset = github_get_json(f"rulesets/{REPOSITORY_RULESET_ID}", timeout)
    conditions = ruleset.get("conditions")
    ref_name = conditions.get("ref_name") if isinstance(conditions, dict) else None
    rules = ruleset.get("rules")
    if (
        int(ruleset.get("id") or 0) != REPOSITORY_RULESET_ID
        or str(ruleset.get("name") or "") != "Protect main releases"
        or str(ruleset.get("enforcement") or "") != "active"
        or str(ruleset.get("target") or "") != "branch"
        or ruleset.get("bypass_actors") not in ([], None)
        or not isinstance(ref_name, dict)
        or "~DEFAULT_BRANCH" not in list(ref_name.get("include") or [])
        or not isinstance(rules, list)
    ):
        raise RuntimeError("The pinned main-release ruleset is absent or changed.")
    rule_types = {str(rule.get("type") or "") for rule in rules if isinstance(rule, dict)}
    if not {"pull_request", "required_linear_history", "required_status_checks"}.issubset(
        rule_types
    ):
        raise RuntimeError("The main-release ruleset lost a required protection rule.")
    status_rules = [
        rule
        for rule in rules
        if isinstance(rule, dict) and rule.get("type") == "required_status_checks"
    ]
    if len(status_rules) != 1:
        raise RuntimeError("The main-release ruleset status-check rule is ambiguous.")
    parameters = status_rules[0].get("parameters")
    contexts = parameters.get("required_status_checks") if isinstance(parameters, dict) else None
    if (
        not isinstance(parameters, dict)
        or parameters.get("strict_required_status_checks_policy") is not True
        or not isinstance(contexts, list)
        or not any(
            isinstance(item, dict) and item.get("context") == REQUIRED_CHECK_NAME
            for item in contexts
        )
    ):
        raise RuntimeError("The protected ruleset lost the strict release-guard context.")
    return {
        "main_sha": commit_sha,
        "required_check": REQUIRED_CHECK_NAME,
        "check_run_id": int(matching[0].get("id") or 0),
        "conclusion": "success",
        "check_app_id": 15368,
        "ruleset_id": REPOSITORY_RULESET_ID,
        "ruleset_name": "Protect main releases",
        "ruleset_enforcement": "active",
    }


def verify_protected_driver_sources(commit_sha: str, timeout: int) -> dict[str, Any]:
    entries: dict[str, Any] = {}
    for repository_path, local_path in (
        (DEPLOY_TOOL_REPOSITORY_PATH, Path(__file__).resolve()),
        (HELPER_TEMPLATE_REPOSITORY_PATH, TEMPLATE_PATH.resolve()),
    ):
        response = requests.get(  # type: ignore[name-defined]
            raw_repository_url(commit_sha, repository_path),
            headers={"User-Agent": "Jus-Tice-Justice-Ops-Driver-Source/1.0"},
            timeout=timeout,
            allow_redirects=False,
        )
        if response.status_code != 200 or response.history or not response.content:
            raise RuntimeError(f"Protected source is unavailable: {repository_path}")
        protected = response.content.replace(b"\r\n", b"\n")
        local = local_path.read_bytes().replace(b"\r\n", b"\n")
        if protected != local:
            raise RuntimeError(f"Local source differs from protected main: {repository_path}")
        entries[repository_path] = {
            "url": raw_repository_url(commit_sha, repository_path),
            "sha256": sha256_bytes(protected),
            "matches_local": True,
        }
    return entries


def safe_relative_member(name: str) -> str:
    if "\\" in name or name.startswith("/") or name.endswith("/"):
        raise RuntimeError(f"Unsafe or non-file ZIP entry: {name}")
    path = PurePosixPath(name)
    if path.is_absolute() or any(part in ("", ".", "..") for part in path.parts):
        raise RuntimeError(f"Unsafe ZIP path: {name}")
    if len(path.parts) < 2 or path.parts[0] != PLUGIN_SLUG:
        raise RuntimeError(f"ZIP member is outside {PLUGIN_SLUG}/: {name}")
    return str(PurePosixPath(*path.parts[1:]))


def inspect_artifact(
    url: str, expected_sha256: str, expected_version: str, timeout: int
) -> tuple[dict[str, Any], bytes, dict[str, dict[str, Any]]]:
    response = requests.get(  # type: ignore[name-defined]
        url,
        headers={"User-Agent": "Jus-Tice-Justice-Ops-Artifact/1.0"},
        timeout=timeout,
        allow_redirects=False,
    )
    if response.status_code != 200 or response.history:
        raise RuntimeError("Immutable Justice Ops artifact did not return direct HTTP 200.")
    payload = response.content
    if not payload or len(payload) > MAX_ARTIFACT_BYTES:
        raise RuntimeError("Artifact is empty or exceeds the bounded size.")
    observed_sha256 = sha256_bytes(payload)
    if observed_sha256 != expected_sha256:
        raise RuntimeError("Immutable artifact SHA-256 does not match the release input.")

    files: dict[str, dict[str, Any]] = {}
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        infos = archive.infolist()
        if not infos or len(infos) > MAX_FILES:
            raise RuntimeError("Artifact file count is outside the bounded contract.")
        total = 0
        for info in infos:
            relative = safe_relative_member(info.filename)
            unix_mode = info.external_attr >> 16
            if info.is_dir() or info.file_size < 0 or info.file_size > MAX_FILE_BYTES:
                raise RuntimeError(f"Artifact member size is unsafe: {info.filename}")
            if info.date_time != (1980, 1, 1, 0, 0, 0) or info.create_system != 3:
                raise RuntimeError(f"Artifact member is not deterministic: {info.filename}")
            if unix_mode != 0o100644:
                raise RuntimeError(f"Artifact member mode changed: {info.filename}")
            if info.compress_type != zipfile.ZIP_DEFLATED:
                raise RuntimeError(f"Artifact member compression changed: {info.filename}")
            body = archive.read(info.filename)
            total += len(body)
            if len(body) != info.file_size or total > MAX_PLUGIN_BYTES:
                raise RuntimeError("Artifact expansion exceeds the bounded contract.")
            if relative in files:
                raise RuntimeError(f"Duplicate artifact member: {relative}")
            files[relative] = {
                "bytes": len(body),
                "sha256": sha256_bytes(body),
            }
        required = {
            "justice-ops.php",
            "family-content-release.php",
            "review-claims-off.php",
            "maya-profile-release.php",
            "release-update-control.php",
        }
        if not required.issubset(files):
            raise RuntimeError("Artifact is missing a required release file.")
        main = archive.read(f"{PLUGIN_SLUG}/justice-ops.php").decode("utf-8-sig")
        release = archive.read(f"{PLUGIN_SLUG}/family-content-release.php").decode(
            "utf-8-sig"
        )
        maya_release = archive.read(
            f"{PLUGIN_SLUG}/maya-profile-release.php"
        ).decode("utf-8-sig")
        update_control = archive.read(
            f"{PLUGIN_SLUG}/release-update-control.php"
        ).decode("utf-8-sig")

    header = re.search(r"^\s*\*\s*Version:\s*([^\r\n]+)$", main, re.MULTILINE)
    constant = re.search(
        r"JUSTICE_OPS_VERSION'\s*,\s*'([^']+)'", main, re.MULTILINE
    )
    if (
        not header
        or header.group(1).strip() != expected_version
        or not constant
        or constant.group(1) != expected_version
    ):
        raise RuntimeError("Artifact header and runtime version are not exact.")
    for marker in (
        RELEASE_MARKER,
        "שותפה עסקית ולקוחה משלמת",
        "justice_ops_verified_lead_mailbox",
    ):
        if marker not in release:
            raise RuntimeError(f"Artifact release marker is missing: {marker}")
    for include in (
        "require_once __DIR__ . '/maya-profile-release.php';",
        "require_once __DIR__ . '/release-update-control.php';",
    ):
        if include not in main:
            raise RuntimeError(f"Artifact main file is missing a required module: {include}")
    for marker in (
        MAYA_CONTENT_MARKER,
        MAYA_DISCLOSURE_MARKER,
        "data-jt-maya-profile-release=",
        MAYA_SCHEMA_ID,
        "justice_ops_maya_profile_release_rest_finalize",
    ):
        if marker not in maya_release:
            raise RuntimeError(f"Artifact Maya release marker is missing: {marker}")
    for marker in (
        "justice-ops/justice-ops.php",
        "auto_update_plugin",
        "/release-update-control",
        "expected_state_sha256",
    ):
        if marker not in update_control:
            raise RuntimeError(f"Artifact update-control marker is missing: {marker}")

    result = {
        "url": url,
        "sha256": observed_sha256,
        "bytes": len(payload),
        "file_count": len(files),
        "expanded_bytes": total,
        "directory_sha256": canonical_directory_digest(files),
        "header_version": expected_version,
        "runtime_version": expected_version,
    }
    return result, payload, files


def lint_artifact_php(payload: bytes) -> dict[str, Any]:
    with tempfile.TemporaryDirectory(prefix="justice-ops-artifact-lint-") as temp:
        root = Path(temp)
        with zipfile.ZipFile(io.BytesIO(payload)) as archive:
            archive.extractall(root)
        php_files = sorted((root / PLUGIN_SLUG).rglob("*.php"))
        if not php_files:
            raise RuntimeError("No PHP files were extracted from the release artifact.")
        for php_file in php_files:
            result = subprocess.run(
                ["php", "-l", str(php_file)],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.returncode != 0:
                raise RuntimeError(
                    f"Artifact PHP lint failed for {php_file.name}: "
                    f"{result.stdout}{result.stderr}"
                )
    return {"passed": True, "php_file_count": len(php_files)}


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


class WordpressClient:
    """WordPress REST client with the narrow UPress HTML-403 fallback."""

    def __init__(self, base_url: str, user: str, password: str):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()  # type: ignore[name-defined]
        self.session.auth = (user, password)
        self.session.headers.update(
            {
                "Accept": "application/json",
                "User-Agent": "Jus-Tice-Justice-Ops-Deploy/1.0",
            }
        )

    @staticmethod
    def is_host_html_403(response: Any) -> bool:
        content_type = str(response.headers.get("Content-Type", "")).lower()
        prefix = str(response.text[:400]).lower()
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
    ) -> Any:
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
            fallback_params: dict[str, Any] = {"rest_route": f"/{normalized}"}
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

    def all_snippets(self) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        page = 1
        pages = 1
        while page <= pages:
            response = self.request(
                "GET",
                "code-snippets/v1/snippets",
                params={"per_page": 100, "page": page},
            )
            payload = response.json()
            if not isinstance(payload, list):
                raise RuntimeError("Code Snippets collection payload is invalid.")
            rows.extend(payload)
            pages = int(response.headers.get("X-WP-TotalPages", "1"))
            page += 1
        return rows

    def get_snippet(self, snippet_id: int) -> Any:
        return self.request(
            "GET",
            f"code-snippets/v1/snippets/{snippet_id}",
            require_success=False,
        )


class SeoDocumentProbe(HTMLParser):
    """Collect SEO-sensitive HTML facts without accepting first-match ambiguity."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._body_depth = 0
        self._title_depth = 0
        self._h1_depth = 0
        self._ignored_depth = 0
        self._script_type = ""
        self._script_id = ""
        self._title_parts: list[str] = []
        self._h1_parts: list[str] = []
        self._script_parts: list[str] = []
        self._body_text_parts: list[str] = []
        self.titles: list[str] = []
        self.h1s: list[str] = []
        self.descriptions: list[str] = []
        self.canonicals: list[str] = []
        self.meta_robots: list[str] = []
        self.json_ld: list[str] = []
        self.json_ld_ids: list[str] = []

    @staticmethod
    def _attributes(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
        return {str(key).lower(): str(value or "") for key, value in attrs}

    @staticmethod
    def _normalize(parts: Iterable[str]) -> str:
        return re.sub(r"\s+", " ", " ".join(parts)).strip()

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        tag = tag.lower()
        values = self._attributes(attrs)
        if tag == "body":
            self._body_depth += 1
        elif self._body_depth and tag in {"script", "style", "noscript", "template"}:
            self._ignored_depth += 1
        if tag == "title":
            self._title_depth += 1
            self._title_parts = []
        if self._body_depth and tag == "h1":
            self._h1_depth += 1
            self._h1_parts = []
        if tag == "meta":
            name = values.get("name", "").strip().lower()
            content = html_module.unescape(values.get("content", "").strip())
            if name == "description":
                self.descriptions.append(content)
            elif name == "robots":
                self.meta_robots.append(content)
        elif tag == "link":
            rel_tokens = {item.lower() for item in values.get("rel", "").split()}
            if "canonical" in rel_tokens:
                self.canonicals.append(
                    html_module.unescape(values.get("href", "").strip())
                )
        elif tag == "script":
            self._script_type = values.get("type", "").strip().lower()
            self._script_id = values.get("id", "").strip()
            self._script_parts = []

    def handle_startendtag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        self.handle_starttag(tag, attrs)
        if tag.lower() not in {"meta", "link", "img", "input", "br", "hr"}:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title" and self._title_depth:
            self.titles.append(self._normalize(self._title_parts))
            self._title_parts = []
            self._title_depth -= 1
        if tag == "h1" and self._h1_depth:
            self.h1s.append(self._normalize(self._h1_parts))
            self._h1_parts = []
            self._h1_depth -= 1
        if tag == "script":
            if self._script_type == "application/ld+json":
                self.json_ld.append("".join(self._script_parts).strip())
                self.json_ld_ids.append(self._script_id)
            self._script_type = ""
            self._script_id = ""
            self._script_parts = []
        if self._body_depth and tag in {"script", "style", "noscript", "template"}:
            self._ignored_depth = max(0, self._ignored_depth - 1)
        if tag == "body" and self._body_depth:
            self._body_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._title_depth:
            self._title_parts.append(data)
        if self._h1_depth:
            self._h1_parts.append(data)
        if self._script_type:
            self._script_parts.append(data)
        if self._body_depth and not self._ignored_depth:
            self._body_text_parts.append(data)

    @property
    def body_text(self) -> str:
        return self._normalize(self._body_text_parts)


def _json_contains_reviewer_claim(value: Any) -> bool:
    if isinstance(value, dict):
        for key, item in value.items():
            normalized = re.sub(r"[^a-z]", "", str(key).lower())
            if normalized in {"reviewedby", "reviewer", "legalreviewer"}:
                return True
            if _json_contains_reviewer_claim(item):
                return True
        return False
    if isinstance(value, list):
        return any(_json_contains_reviewer_claim(item) for item in value)
    if isinstance(value, str):
        return any(pattern.search(value) for pattern in FORBIDDEN_REVIEW_TEXT_PATTERNS)
    return False


def _json_ld_types(value: Any) -> set[str]:
    """Return every explicit Schema.org type in one decoded JSON-LD document."""

    found: set[str] = set()
    if isinstance(value, dict):
        schema_type = value.get("@type")
        if isinstance(schema_type, str) and schema_type:
            found.add(schema_type)
        elif isinstance(schema_type, list):
            found.update(item for item in schema_type if isinstance(item, str) and item)
        for item in value.values():
            found.update(_json_ld_types(item))
    elif isinstance(value, list):
        for item in value:
            found.update(_json_ld_types(item))
    return found


def inspect_seo_html(html: str, headers: Mapping[str, Any]) -> dict[str, Any]:
    lower = html.lower()
    body_position = lower.find("<body")
    if body_position < 0:
        raise RuntimeError("Public page has no rendered body.")
    body = html[body_position:]
    parser = SeoDocumentProbe()
    parser.feed(html)
    parser.close()
    reviewer_json_ld = False
    json_ld_valid = True
    json_ld_documents: list[Any] = []
    json_ld_types: set[str] = set()
    for raw in parser.json_ld:
        try:
            parsed = json.loads(raw)
        except (ValueError, json.JSONDecodeError):
            json_ld_valid = False
            json_ld_documents.append(None)
            continue
        json_ld_documents.append(parsed)
        json_ld_types.update(_json_ld_types(parsed))
        reviewer_json_ld = reviewer_json_ld or _json_contains_reviewer_claim(parsed)
    reviewer_text_matches = [
        pattern.pattern
        for pattern in FORBIDDEN_REVIEW_TEXT_PATTERNS
        if pattern.search(parser.body_text)
    ]
    return {
        "titles": parser.titles,
        "h1s": parser.h1s,
        "descriptions": parser.descriptions,
        "canonicals": parser.canonicals,
        "meta_robots": parser.meta_robots,
        "x_robots_tag": str(headers.get("X-Robots-Tag", "")),
        "release_marker_count": body.count(RELEASE_MARKER),
        "maya_release_marker_count": body.count(MAYA_RELEASE_MARKER),
        "maya_content_marker_count": body.count(MAYA_CONTENT_MARKER),
        "maya_disclosure_marker_count": body.count(MAYA_DISCLOSURE_MARKER),
        "old_review_markers": [marker for marker in OLD_REVIEW_MARKERS if marker in body],
        "reviewer_text_matches": reviewer_text_matches,
        "reviewer_json_ld": reviewer_json_ld,
        "json_ld_valid": json_ld_valid,
        "json_ld_ids": list(parser.json_ld_ids),
        "json_ld_documents": json_ld_documents,
        "json_ld_types": sorted(json_ld_types),
        "body": body,
    }


def verify_site_identity(client: WordpressClient) -> dict[str, Any]:
    settings = client.request(
        "GET", "wp/v2/settings", params={"_fields": "title,url"}, require_success=False
    )
    index = client.request("GET", "", require_success=False)
    if settings.status_code != 200 or index.status_code != 200:
        raise RuntimeError("Authenticated WordPress identity preflight failed.")
    settings_payload = settings.json()
    index_payload = index.json()
    if not isinstance(settings_payload, dict) or not isinstance(index_payload, dict):
        raise RuntimeError("WordPress identity payload is invalid.")
    observed = {
        str(settings_payload.get("url") or "").rstrip("/"),
        str(index_payload.get("url") or "").rstrip("/"),
        str(index_payload.get("home") or "").rstrip("/"),
    }
    if observed != {TARGET_BASE_URL}:
        raise RuntimeError("Authenticated WordPress identity is not Jus-Tice.")
    return {
        "settings_status": settings.status_code,
        "rest_index_status": index.status_code,
        "url": TARGET_BASE_URL,
        "title": str(settings_payload.get("title") or ""),
    }


def public_request(
    base_url: str,
    route_or_path: str,
    *,
    timeout: int,
    rest: bool = False,
    cache_bust: bool = True,
) -> Any:
    headers = public_request_headers(rest=rest, cache_bust=cache_bust)
    cache_buster = secrets.token_hex(8)
    if rest:
        normalized = route_or_path.lstrip("/")
        response = requests.get(  # type: ignore[name-defined]
            f"{base_url.rstrip('/')}/wp-json/{normalized}",
            headers=headers,
            params={"jt_release_probe": cache_buster} if cache_bust else None,
            timeout=timeout,
            allow_redirects=False,
        )
        if WordpressClient.is_host_html_403(response):
            response = requests.get(  # type: ignore[name-defined]
                f"{base_url.rstrip('/')}/",
                headers=headers,
                params={
                    "rest_route": f"/{normalized}",
                    **({"jt_release_probe": cache_buster} if cache_bust else {}),
                },
                timeout=timeout,
                allow_redirects=False,
            )
        return response
    suffix = ""
    if cache_bust:
        separator = "&" if "?" in route_or_path else "?"
        suffix = f"{separator}jt_release_probe={cache_buster}"
    return requests.get(  # type: ignore[name-defined]
        f"{base_url.rstrip('/')}{route_or_path}{suffix}",
        headers=headers,
        timeout=timeout,
        allow_redirects=False,
    )


def public_request_headers(*, rest: bool, cache_bust: bool) -> dict[str, str]:
    headers = {
        "Accept": "application/json" if rest else "text/html,application/xhtml+xml",
        "User-Agent": "Jus-Tice-Justice-Ops-Acceptance/1.0",
    }
    if cache_bust:
        headers["Cache-Control"] = "no-cache"
    return headers


def response_summary(response: Any) -> dict[str, Any]:
    summary: dict[str, Any] = {
        "status": int(response.status_code),
        "content_type": str(response.headers.get("Content-Type", "")).split(";", 1)[0],
    }
    try:
        payload = response.json()
    except (ValueError, json.JSONDecodeError):
        return summary
    if isinstance(payload, dict):
        data = payload.get("data")
        error_shaped = payload.get("success") is False or (
            isinstance(data, dict)
            and isinstance(data.get("status"), int)
            and not isinstance(data.get("status"), bool)
        )
        for key in (
            "success",
            "operation",
            "state",
            "version",
            "marker",
            "active",
            "directory_sha256",
            "file_count",
            "lock_acquired",
            "lock_released",
            "helper_deleted",
            "helper_absent_after",
            "backup_removed",
            "rollback_zip_sha256",
            "rollback_zip_bytes",
            "rollback_transport",
            "rollback_attempted",
            "rollback_succeeded",
            "cache",
            "prior_version",
            "prior_active",
            "database_preconditions",
            "recovery_held",
            "recovery_proof",
            "stale_lock_policy",
            "disk_capacity",
            "cleanup_phase",
            "cleanup_terminal",
            "state_deleted",
            "state_absent_after",
            "lock_absent_after",
            "backup_verified_before",
            "operation_nonce_sha256",
            "state_revision",
            "mutation_started",
            "operation_lease",
            "last_operation",
            "current_identity",
            "prior_directory_sha256",
            "candidate_directory_sha256",
            "options_snapshot_match",
            "recovery_held",
            "rollback",
            "post_option_fingerprint",
            "install_cache",
            "finalize_cache",
            "stabilization_match",
            "post_options_match",
            "current_post_option_fingerprint",
            "stored_post_option_fingerprint",
            "ready",
            "marker_inspection",
            "lock_inspection",
            "lock_inspection_after",
            "prior_identity",
            "candidate_mutation_started",
            "state_persisted",
            "own_lock_acquired",
            "own_lock_absent_after",
            "backup_root_created",
            "backup_root_absent_after",
            "marker_consumed",
            "safe_to_retire_helper",
            "foreign_lock_present",
            "lock_acquisition",
            "cleanup_errors",
        ):
            if key in payload:
                summary[key] = payload[key]
        if error_shaped:
            accepted_error_code = False
            for key in ("code", "failure_reason", "failure_stage"):
                value = payload.get(key)
                if isinstance(value, str) and _SAFE_EVIDENCE_IDENTIFIER_RE.fullmatch(value):
                    summary[key] = value
                    if key == "code":
                        accepted_error_code = True
            message = payload.get("message")
            if isinstance(message, str):
                summary["message_sha256"] = sha256_text(message)
                safe_message = _EVIDENCE_CONTROL_CHARS_RE.sub(" ", message).strip()
                if (
                    accepted_error_code
                    and safe_message
                    and len(safe_message) <= MAX_EVIDENCE_MESSAGE_CHARS
                ):
                    summary["message"] = safe_message
        if isinstance(data, dict):
            for key in (
                "status",
                "state",
                "rollback_attempted",
                "rollback_succeeded",
                "lock_released",
                "helper_deleted",
            ):
                if key in data:
                    summary[key] = data[key]
    return summary


def is_proven_safe_pre_mutation_failure(summary: Mapping[str, Any]) -> bool:
    """Return true only for a helper failure with complete negative-mutation proof."""

    return bool(
        summary.get("success") is False
        and summary.get("candidate_mutation_started") is False
        and summary.get("state_absent_after") is True
        and summary.get("own_lock_absent_after") is True
        and summary.get("backup_root_absent_after") is True
        and summary.get("safe_to_retire_helper") is True
    )


def snippet_identity(row: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "id": int(row.get("id") or 0),
        "name": str(row.get("name") or ""),
        "active": row.get("active"),
        "scope": str(row.get("scope") or ""),
        "code_sha256": sha256_text(str(row.get("code") or "")),
    }


def matching_snippets(
    rows: Iterable[Mapping[str, Any]], helper_id: int, helper_name: str
) -> list[Mapping[str, Any]]:
    return [
        row
        for row in rows
        if int(row.get("id") or 0) == helper_id
        or str(row.get("name") or "") == helper_name
    ]


def php_literal(value: Any) -> str:
    if isinstance(value, (str, int, float)) or value is None or isinstance(value, bool):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, list):
        return "array(" + ",".join(php_literal(item) for item in value) + ")"
    if isinstance(value, tuple):
        return php_literal(list(value))
    if isinstance(value, dict):
        return "array(" + ",".join(
            f"{php_literal(str(key))}=>{php_literal(item)}"
            for key, item in value.items()
        ) + ")"
    raise TypeError(f"Unsupported PHP literal: {type(value).__name__}")


def build_helper_code(
    *,
    run_id: str,
    helper_id: int,
    helper_name: str,
    route_base: str,
    token: str,
    commit_sha: str,
    version: str,
    prior_version: str,
    immutable_artifact_url: str,
    artifact_sha256: str,
    artifact_bytes: int,
    artifact_expanded_bytes: int,
    candidate_files: Mapping[str, Mapping[str, Any]],
    recovery_proof: Mapping[str, Any],
) -> tuple[str, str]:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    replacements = {
        "__RUN_ID__": php_literal(run_id),
        "__HELPER_ID__": str(helper_id),
        "__HELPER_NAME__": php_literal(helper_name),
        "__ROUTE_BASE__": php_literal(route_base),
        "__TOKEN__": php_literal(token),
        "__TOKEN_SHA256__": php_literal(sha256_text(token)),
        "__COMMIT_SHA__": php_literal(commit_sha),
        "__VERSION__": php_literal(version),
        "__PRIOR_VERSION__": php_literal(prior_version),
        "__ARTIFACT_URL__": php_literal(immutable_artifact_url),
        "__ARTIFACT_SHA256__": php_literal(artifact_sha256),
        "__ARTIFACT_BYTES__": str(artifact_bytes),
        "__ARTIFACT_EXPANDED_BYTES__": str(artifact_expanded_bytes),
        "__PLUGIN_BASENAME__": php_literal(PLUGIN_BASENAME),
        "__PLUGIN_SLUG__": php_literal(PLUGIN_SLUG),
        "__TARGET_BASE_URL__": php_literal(TARGET_BASE_URL),
        "__LOCK_OPTION__": php_literal(LOCK_OPTION),
        "__STATE_OPTION__": php_literal(
            "justice_ops_deploy_state_" + sha256_text(run_id)[:20]
        ),
        "__AFFECTED_PATHS__": php_literal(list(AFFECTED_PATHS)),
        "__CANDIDATE_FILES__": php_literal(dict(candidate_files)),
        "__RECOVERY_PROOF__": php_literal(dict(recovery_proof["payload"])),
        "__RECOVERY_MARKER_SHA256__": php_literal(
            str(recovery_proof["marker_sha256"])
        ),
        "__RECOVERY_MARKER_BYTES__": str(int(recovery_proof["marker_bytes"])),
    }
    code = template
    for placeholder, replacement in replacements.items():
        if placeholder not in code:
            raise RuntimeError(f"Helper template placeholder is missing: {placeholder}")
        code = code.replace(placeholder, replacement)
    unresolved = sorted(set(re.findall(r"__[A-Z0-9_]+__", code)))
    if unresolved != [_SELF_HASH_MARKER]:
        raise RuntimeError(f"Unexpected unresolved helper placeholders: {unresolved}")
    normalized_sha256 = sha256_text(code)
    code = code.replace(_SELF_HASH_MARKER, normalized_sha256)
    return code, normalized_sha256


def lint_php_snippet(code: str) -> dict[str, Any]:
    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".php",
            prefix="justice-ops-helper-",
            delete=False,
            encoding="utf-8",
            newline="\n",
        ) as handle:
            handle.write("<?php\n")
            handle.write(code)
            temp_path = Path(handle.name)
        result = subprocess.run(
            ["php", "-l", str(temp_path)],
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            raise RuntimeError(f"Generated helper PHP lint failed: {result.stdout}{result.stderr}")
        return {"passed": True, "sha256": sha256_text(code)}
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


def parse_expected_live_manifest(path: Path) -> dict[str, dict[str, Any]]:
    payload = json.loads(path.resolve().read_text(encoding="utf-8-sig"))
    candidates: Any = payload
    if isinstance(payload, dict) and isinstance(payload.get("live"), dict):
        candidates = payload["live"].get("files")
    elif isinstance(payload, dict) and isinstance(payload.get("files"), dict):
        candidates = payload.get("files")
    if not isinstance(candidates, dict) or not candidates:
        raise RuntimeError("Expected live manifest does not contain a file map.")
    result: dict[str, dict[str, Any]] = {}
    for raw_path, raw_item in candidates.items():
        relative = str(PurePosixPath(str(raw_path).replace("\\", "/")))
        if relative.startswith(f"{PLUGIN_SLUG}/"):
            relative = relative[len(PLUGIN_SLUG) + 1 :]
        safe_relative_member(f"{PLUGIN_SLUG}/{relative}")
        if not isinstance(raw_item, dict):
            raise RuntimeError(f"Invalid expected file record: {relative}")
        digest = str(raw_item.get("sha256") or "").lower()
        byte_count = raw_item.get("bytes")
        if not _SHA256_RE.fullmatch(digest) or type(byte_count) is not int or byte_count < 0:
            raise RuntimeError(f"Invalid expected file identity: {relative}")
        result[relative] = {"sha256": digest, "bytes": byte_count}
    return result


def validate_recovery_probe(
    path: Path, commit_sha: str, artifact_sha256: str, prior_version: str
) -> dict[str, Any]:
    resolved = path.expanduser().resolve()
    if not resolved.is_file():
        raise RuntimeError("The required uPress recovery-probe evidence file is absent.")
    raw = resolved.read_bytes()
    if not raw or len(raw) > 4096 or raw.startswith(b"\xef\xbb\xbf"):
        raise RuntimeError("The uPress recovery marker must be bounded UTF-8 without a BOM.")
    try:
        payload = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, ValueError, json.JSONDecodeError) as error:
        raise RuntimeError("The uPress recovery marker is not valid UTF-8 JSON.") from error
    if not isinstance(payload, dict):
        raise RuntimeError("The uPress recovery-probe evidence is not a JSON object.")
    expected_keys = {
        "contract",
        "target",
        "upress_pid",
        "plugin_path",
        "commit_sha",
        "artifact_sha256",
        "prior_version",
        "challenge",
        "issued_at_utc",
        "expires_at_utc",
        "marker_filename",
        "marker_path",
    }
    if set(payload) != expected_keys:
        raise RuntimeError("The uPress recovery marker field set is not exact.")
    canonical = (
        json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        + "\n"
    ).encode("utf-8")
    if raw != canonical:
        raise RuntimeError(
            "The uPress recovery marker must use canonical sorted compact JSON plus one newline."
        )
    target = str(payload.get("target") or "").rstrip("/")
    issued_raw = str(payload.get("issued_at_utc") or "")
    expires_raw = str(payload.get("expires_at_utc") or "")
    try:
        issued = datetime.fromisoformat(issued_raw.replace("Z", "+00:00"))
        expires = datetime.fromisoformat(expires_raw.replace("Z", "+00:00"))
    except ValueError as error:
        raise RuntimeError("The uPress recovery marker timestamp is invalid.") from error
    if issued.tzinfo is None or expires.tzinfo is None:
        raise RuntimeError("The uPress recovery marker timestamps must include a timezone.")
    issued_utc = issued.astimezone(timezone.utc)
    expires_utc = expires.astimezone(timezone.utc)
    now = datetime.now(timezone.utc)
    age_seconds = (now - issued_utc).total_seconds()
    lifetime_seconds = (expires_utc - issued_utc).total_seconds()
    challenge = str(payload.get("challenge") or "").lower()
    expected_filename = (
        f".justice-ops-upress-recovery-{challenge[:32]}.json"
        if _SHA256_RE.fullmatch(challenge)
        else ""
    )
    expected_marker_path = (
        f"{RECOVERY_MARKER_ROOT}/{expected_filename}" if expected_filename else ""
    )
    if (
        payload.get("contract") != RECOVERY_PROOF_CONTRACT
        or target != TARGET_BASE_URL
        or type(payload.get("upress_pid")) is not int
        or payload.get("upress_pid") != RECOVERY_UPRESS_PID
        or payload.get("plugin_path") != RECOVERY_PLUGIN_PATH
        or str(payload.get("commit_sha") or "").lower() != commit_sha
        or str(payload.get("artifact_sha256") or "").lower() != artifact_sha256
        or str(payload.get("prior_version") or "") != prior_version
        or not _SHA256_RE.fullmatch(challenge)
        or payload.get("challenge") != challenge
        or payload.get("marker_filename") != expected_filename
        or payload.get("marker_path") != expected_marker_path
        or age_seconds < -60
        or age_seconds > RECOVERY_PROOF_MAX_AGE_SECONDS
        or lifetime_seconds <= 0
        or lifetime_seconds > RECOVERY_PROOF_MAX_AGE_SECONDS
        or expires_utc <= now
    ):
        raise RuntimeError(
            "The uPress marker is stale or is not bound to this exact site and release."
        )
    return {
        "path": str(resolved),
        "sha256": sha256_bytes(raw),
        "marker_sha256": sha256_bytes(raw),
        "marker_bytes": len(raw),
        "marker_filename": expected_filename,
        "marker_path": expected_marker_path,
        "target": target,
        "upress_pid": RECOVERY_UPRESS_PID,
        "plugin_path": RECOVERY_PLUGIN_PATH,
        "commit_sha": commit_sha,
        "artifact_sha256": artifact_sha256,
        "prior_version": prior_version,
        "challenge_sha256": sha256_text(challenge),
        "issued_at_utc": issued_utc.isoformat(),
        "expires_at_utc": expires_utc.isoformat(),
        "age_seconds": int(max(0, age_seconds)),
        "payload": payload,
        "verified_server_marker_required": True,
        "single_use_delete_required": True,
        "passed": True,
    }


def decode_live_manifest(payload: Mapping[str, Any]) -> dict[str, dict[str, Any]]:
    rows = payload.get("files")
    if not isinstance(rows, list) or not rows or len(rows) > MAX_FILES:
        raise RuntimeError("Live snapshot did not return a bounded file list.")
    manifest: dict[str, dict[str, Any]] = {}
    total = 0
    for row in rows:
        if not isinstance(row, dict):
            raise RuntimeError("Live snapshot file record is invalid.")
        relative = str(row.get("path") or "")
        safe_relative_member(f"{PLUGIN_SLUG}/{relative}")
        if relative in manifest:
            raise RuntimeError(f"Duplicate live file: {relative}")
        digest = str(row.get("sha256") or "").lower()
        byte_count = row.get("bytes")
        if (
            not _SHA256_RE.fullmatch(digest)
            or type(byte_count) is not int
            or byte_count < 0
            or byte_count > MAX_FILE_BYTES
        ):
            raise RuntimeError(f"Live snapshot identity is invalid: {relative}")
        total += byte_count
        if total > MAX_PLUGIN_BYTES:
            raise RuntimeError("Live snapshot exceeds the bounded plugin size.")
        manifest[relative] = {"bytes": byte_count, "sha256": digest}
    reported_digest = str(payload.get("directory_sha256") or "").lower()
    if canonical_directory_digest(manifest) != reported_digest:
        raise RuntimeError("Live directory digest differs from the exported bytes.")
    if int(payload.get("file_count") or 0) != len(manifest):
        raise RuntimeError("Live file count differs from the exported bytes.")
    return manifest


def download_live_snapshot(
    client: WordpressClient,
    route_base: str,
    token: str,
    helper_code_sha256: str,
    timeout: int,
    manifest: Mapping[str, Mapping[str, Any]],
) -> tuple[dict[str, bytes], list[dict[str, Any]]]:
    """Download bounded batches from the fresh server copy and verify each byte."""

    paths = sorted(manifest)
    bodies: dict[str, bytes] = {}
    batches: list[dict[str, Any]] = []
    for offset in range(0, len(paths), 8):
        requested = paths[offset : offset + 8]
        response = call_helper(
            client,
            route_base,
            "export",
            token,
            helper_code_sha256,
            timeout,
            extra_body={"paths": requested},
        )
        content_type = str(response.headers.get("Content-Type", "")).lower()
        payload = response.json() if "json" in content_type else {}
        if (
            response.status_code != 200
            or not isinstance(payload, dict)
            or payload.get("success") is not True
            or not isinstance(payload.get("files"), list)
        ):
            raise RuntimeError("A live rollback export batch failed.")
        rows = payload["files"]
        if len(rows) != len(requested):
            raise RuntimeError("A live rollback export batch changed cardinality.")
        observed_batch: list[str] = []
        for row in rows:
            if not isinstance(row, dict):
                raise RuntimeError("A live rollback export record is invalid.")
            relative = str(row.get("path") or "")
            if relative not in requested or relative in bodies:
                raise RuntimeError("A live rollback export path changed.")
            encoded = row.get("data_base64")
            if not isinstance(encoded, str):
                raise RuntimeError(f"Live rollback data is absent: {relative}")
            try:
                body = base64.b64decode(encoded, validate=True)
            except (ValueError, TypeError) as error:
                raise RuntimeError(f"Live rollback base64 is invalid: {relative}") from error
            expected = manifest[relative]
            if (
                len(body) != int(expected["bytes"])
                or sha256_bytes(body) != str(expected["sha256"])
            ):
                raise RuntimeError(f"Live rollback bytes do not match: {relative}")
            bodies[relative] = body
            observed_batch.append(relative)
        if sorted(observed_batch) != requested:
            raise RuntimeError("A live rollback export batch omitted a requested file.")
        batches.append(
            {
                "batch": len(batches) + 1,
                "status": response.status_code,
                "file_count": len(requested),
                "paths_sha256": sha256_text("\n".join(requested)),
            }
        )
    if set(bodies) != set(manifest):
        raise RuntimeError("The complete live rollback export is incomplete.")
    return bodies, batches


def write_local_rollback(
    run_dir: Path,
    run_id: str,
    prior_version: str,
    bodies: Mapping[str, bytes],
    manifest: Mapping[str, Mapping[str, Any]],
) -> dict[str, Any]:
    run_dir.mkdir(parents=True, exist_ok=True)
    zip_path = run_dir / f"{run_id}.live-rollback.zip"
    manifest_path = run_dir / f"{run_id}.live-rollback.manifest.json"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for relative in sorted(bodies):
            info = zipfile.ZipInfo(
                f"{PLUGIN_SLUG}/{relative}", date_time=(1980, 1, 1, 0, 0, 0)
            )
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, bodies[relative], compresslevel=9)
    zip_bytes = zip_path.read_bytes()
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as archive:
        reread = {
            safe_relative_member(info.filename): archive.read(info.filename)
            for info in archive.infolist()
        }
    if dict(reread) != dict(bodies):
        raise RuntimeError("Local rollback ZIP readback differs from the live bytes.")
    record = {
        "schema_version": 1,
        "run_id": run_id,
        "created_at_utc": utc_now(),
        "target": TARGET_BASE_URL,
        "plugin": PLUGIN_BASENAME,
        "prior_version": prior_version,
        "file_count": len(manifest),
        "directory_sha256": canonical_directory_digest(manifest),
        "files": dict(manifest),
        "rollback_zip": str(zip_path),
        "rollback_zip_sha256": sha256_bytes(zip_bytes),
        "rollback_zip_bytes": len(zip_bytes),
    }
    manifest_path.write_text(
        json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    os.chmod(zip_path, 0o600)
    os.chmod(manifest_path, 0o600)
    record["manifest"] = str(manifest_path)
    return record


def compare_live_gate(
    args: argparse.Namespace,
    observed: Mapping[str, Mapping[str, Any]],
) -> dict[str, Any]:
    observed_digest = canonical_directory_digest(observed)
    if args.expected_live_manifest is not None:
        expected = parse_expected_live_manifest(args.expected_live_manifest)
        if dict(expected) != dict(observed):
            expected_paths = set(expected)
            observed_paths = set(observed)
            changed = sorted(
                path
                for path in expected_paths & observed_paths
                if expected[path] != observed[path]
            )
            raise RuntimeError(
                "Live plugin inventory differs from the expected manifest: "
                f"missing={sorted(expected_paths-observed_paths)}, "
                f"extra={sorted(observed_paths-expected_paths)}, changed={changed}."
            )
        return {
            "mode": "expected_manifest",
            "path": str(args.expected_live_manifest.resolve()),
            "file_count": len(expected),
            "directory_sha256": observed_digest,
            "matched": True,
        }
    if args.expected_live_directory_sha256:
        if observed_digest != args.expected_live_directory_sha256:
            raise RuntimeError("Live canonical directory digest changed.")
        return {
            "mode": "expected_canonical_digest",
            "directory_sha256": observed_digest,
            "matched": True,
        }
    return {
        "mode": "explicit_observed_inventory_acceptance",
        "directory_sha256": observed_digest,
        "file_count": len(observed),
        "matched": True,
    }


def require_cache_confirmation(cache: Any) -> dict[str, Any]:
    if not isinstance(cache, dict):
        raise RuntimeError("The deploy helper did not return a cache confirmation object.")
    expected_urls = [f"{TARGET_BASE_URL}{path}" for path in AFFECTED_PATHS]
    observed_urls = cache.get("affected_urls")
    modes = cache.get("confirmation_modes")
    page_cache_modes = cache.get("page_cache_confirmation_modes")
    recognized_page_cache_modes = {
        "litespeed_purge_all_handler",
        "litespeed_url_handlers_dispatched",
        "rocket_clean_domain_called",
        "w3tc_flush_all_called",
        "canonical_edge_purge_http_confirmed",
    }
    if (
        cache.get("confirmed") is not True
        or cache.get("object_cache_flush_result") is not True
        or not isinstance(modes, list)
        or not modes
        or not isinstance(page_cache_modes, list)
        or not page_cache_modes
        or not set(page_cache_modes).issubset(recognized_page_cache_modes)
        or not set(page_cache_modes).issubset(set(modes))
        or observed_urls != expected_urls
    ):
        raise RuntimeError("Required object and page-cache confirmation is incomplete.")
    return {
        "confirmed": True,
        "confirmation_modes": list(modes),
        "page_cache_confirmation_modes": list(page_cache_modes),
        "affected_urls": list(observed_urls),
        "object_cache_flush_result": True,
        "edge_purge_confirmed_count": int(cache.get("edge_purge_confirmed_count") or 0),
    }


def semantic_page_fingerprint(probe: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "titles": list(probe["titles"]),
        "h1s": list(probe["h1s"]),
        "descriptions": list(probe["descriptions"]),
        "canonicals": list(probe["canonicals"]),
        "meta_robots": list(probe["meta_robots"]),
        "x_robots_tag": str(probe["x_robots_tag"]),
        "release_marker_count": int(probe["release_marker_count"]),
        "maya_release_marker_count": int(probe["maya_release_marker_count"]),
        "maya_content_marker_count": int(probe["maya_content_marker_count"]),
        "maya_disclosure_marker_count": int(probe["maya_disclosure_marker_count"]),
        "old_review_markers": list(probe["old_review_markers"]),
        "reviewer_text_matches": list(probe["reviewer_text_matches"]),
        "reviewer_json_ld": bool(probe["reviewer_json_ld"]),
        "json_ld_valid": bool(probe["json_ld_valid"]),
        "json_ld_ids": list(probe["json_ld_ids"]),
        "json_ld_types": list(probe["json_ld_types"]),
    }


def capture_prior_public(base_url: str, timeout: int) -> dict[str, Any]:
    pages: dict[str, Any] = {}
    for path in PAGE_CONTRACTS:
        response = public_request(
            base_url, path, timeout=timeout, cache_bust=False
        )
        if response.status_code != 200 or response.history or response.url != f"{base_url}{path}":
            raise RuntimeError(f"Prior canonical page did not return direct HTTP 200: {path}")
        probe = inspect_seo_html(response.text, response.headers)
        pages[path] = semantic_page_fingerprint(probe)
    return {"canonical_unbusted": True, "pages": pages}


def _assert_maya_candidate_schema(
    contract: Mapping[str, str], probe: Mapping[str, Any]
) -> None:
    documents = probe["json_ld_documents"]
    if probe["json_ld_ids"] != [MAYA_SCHEMA_ID] or len(documents) != 1:
        raise RuntimeError("Maya candidate requires exactly one controlled JSON-LD script.")
    document = documents[0]
    if not isinstance(document, dict) or document.get("@context") != "https://schema.org":
        raise RuntimeError("Maya candidate JSON-LD context is not exact.")
    if set(probe["json_ld_types"]) != MAYA_SCHEMA_TYPES:
        raise RuntimeError("Maya candidate JSON-LD contains missing or unsupported schema types.")
    graph = document.get("@graph")
    if not isinstance(graph, list) or len(graph) != 2:
        raise RuntimeError("Maya candidate JSON-LD graph cardinality is not exact.")
    web_pages = [node for node in graph if isinstance(node, dict) and node.get("@type") == "WebPage"]
    breadcrumbs = [
        node
        for node in graph
        if isinstance(node, dict) and node.get("@type") == "BreadcrumbList"
    ]
    if len(web_pages) != 1 or len(breadcrumbs) != 1:
        raise RuntimeError("Maya candidate requires one WebPage and one BreadcrumbList node.")
    page = web_pages[0]
    if (
        page.get("@id") != f"{contract['canonical']}#webpage"
        or page.get("url") != contract["canonical"]
        or page.get("name") != contract["h1"]
        or page.get("description") != contract["description"]
        or page.get("inLanguage") != "he-IL"
    ):
        raise RuntimeError("Maya candidate WebPage schema values differ from the page contract.")
    items = breadcrumbs[0].get("itemListElement")
    if not isinstance(items, list) or len(items) != 3:
        raise RuntimeError("Maya candidate breadcrumb schema cardinality is not exact.")
    expected_items = (
        (1, "https://jus-tice.co.il/"),
        (2, "https://jus-tice.co.il/family-law/"),
        (3, contract["canonical"]),
    )
    for item, (position, target) in zip(items, expected_items, strict=True):
        if (
            not isinstance(item, dict)
            or item.get("@type") != "ListItem"
            or item.get("position") != position
            or item.get("item") != target
        ):
            raise RuntimeError("Maya candidate breadcrumb schema values are not exact.")


def _assert_candidate_page(path: str, contract: Mapping[str, str], response: Any) -> dict[str, Any]:
    expected_url = f"{TARGET_BASE_URL}{path}"
    if response.status_code != 200 or response.history or response.url != expected_url:
        raise RuntimeError(f"Candidate page did not return canonical direct HTTP 200: {path}")
    probe = inspect_seo_html(response.text, response.headers)
    if probe["titles"] != [contract["title"]]:
        raise RuntimeError(f"Candidate requires exactly one exact title on {path}: {probe['titles']!r}")
    if probe["h1s"] != [contract["h1"]]:
        raise RuntimeError(f"Candidate H1 contract differs on {path}: {probe['h1s']!r}")
    if probe["descriptions"] != [contract["description"]]:
        raise RuntimeError(f"Candidate requires exactly one exact meta description on {path}.")
    if probe["canonicals"] != [contract["canonical"]]:
        raise RuntimeError(f"Candidate requires exactly one exact canonical on {path}: {probe['canonicals']!r}")
    robots = " ".join(probe["meta_robots"]).lower()
    x_robots = str(probe["x_robots_tag"]).lower()
    if "noindex" in robots or "noindex" in x_robots:
        raise RuntimeError(f"Candidate unexpectedly noindexes {path} via meta or X-Robots-Tag.")
    release_marker = contract.get("release_marker", RELEASE_MARKER)
    if str(probe["body"]).count(release_marker) != 1:
        raise RuntimeError(f"Candidate requires exactly one rendered release marker on {path}.")
    if probe["old_review_markers"]:
        raise RuntimeError(
            f"Unsupported reviewer markup remains on {path}: {probe['old_review_markers']}"
        )
    if probe["reviewer_text_matches"] or probe["reviewer_json_ld"]:
        raise RuntimeError(f"Unsupported reviewer text or JSON-LD remains on {path}.")
    if not probe["json_ld_valid"]:
        raise RuntimeError(f"Malformed JSON-LD remains on candidate page {path}.")
    body = str(probe["body"])
    if path == MAYA_PATH:
        if (
            probe["maya_content_marker_count"] != 1
            or probe["maya_disclosure_marker_count"] != 1
        ):
            raise RuntimeError("Maya candidate body or commercial disclosure marker is not exact.")
        _assert_maya_candidate_schema(contract, probe)
    if path in ("/family-law/", "/divorce-lawyer/"):
        if (
            body.count("jt-premium-card__disclosure") != 1
            or body.count("שותפה עסקית ולקוחה משלמת") != 1
            or "מעל 20 שנות" in body
            or body.count("הפרטים לא יועברו לעורך דין ללא אישור נוסף ממני") != 1
        ):
            raise RuntimeError(f"Maya disclosure contract differs on {path}.")
    result = semantic_page_fingerprint(probe)
    result.update(
        {
            "status": response.status_code,
            "canonical_url": response.url,
            "x_robots_checked": True,
            "reviewer_json_ld_absent": True,
            "reviewer_text_absent": True,
        }
    )
    return result


def verify_candidate_public(base_url: str, version: str, timeout: int) -> dict[str, Any]:
    health = public_request(base_url, HEALTH_ROUTE, timeout=timeout, rest=True)
    health_summary = response_summary(health)
    if (
        health.status_code != 200
        or health_summary.get("version") != version
        or health_summary.get("marker") != "self-update-proof-v1"
    ):
        raise RuntimeError("Public Justice Ops health does not expose the candidate.")

    pages: dict[str, Any] = {}
    for path, contract in PAGE_CONTRACTS.items():
        first = public_request(base_url, path, timeout=timeout, cache_bust=False)
        second = public_request(base_url, path, timeout=timeout, cache_bust=False)
        first_result = _assert_candidate_page(path, contract, first)
        second_result = _assert_candidate_page(path, contract, second)
        if first_result != second_result:
            raise RuntimeError(f"Two canonical unbusted acceptance reads differ on {path}.")
        pages[path] = first_result
    home = public_request(base_url, "/", timeout=timeout, cache_bust=False)
    if home.status_code != 200:
        raise RuntimeError("Homepage health canary failed after candidate install.")
    return {
        "health": health_summary,
        "pages": pages,
        "homepage_status": home.status_code,
        "canonical_unbusted_reads_per_page": 2,
    }


def verify_prior_public(
    base_url: str,
    prior_version: str,
    timeout: int,
    baseline: Mapping[str, Any],
) -> dict[str, Any]:
    health = public_request(base_url, HEALTH_ROUTE, timeout=timeout, rest=True)
    summary = response_summary(health)
    if health.status_code != 200 or summary.get("version") != prior_version:
        raise RuntimeError("Automatic rollback did not restore the prior public health version.")
    expected_pages = baseline.get("pages")
    if not isinstance(expected_pages, dict) or set(expected_pages) != set(PAGE_CONTRACTS):
        raise RuntimeError("The prior page-contract semantic baseline is incomplete.")
    pages: dict[str, Any] = {}
    for path in PAGE_CONTRACTS:
        observed_rounds: list[dict[str, Any]] = []
        for _ in range(2):
            response = public_request(base_url, path, timeout=timeout, cache_bust=False)
            fingerprint = _assert_prior_page(
                base_url, path, response, expected_pages[path]
            )
            observed_rounds.append(fingerprint)
        if observed_rounds[0] != observed_rounds[1]:
            raise RuntimeError(f"Two canonical rollback reads differ on {path}.")
        pages[path] = observed_rounds[0]
    return {
        "health": summary,
        "pages": pages,
        "exact_prior_fingerprints_restored": True,
        "canonical_unbusted_reads_per_page": 2,
    }


def _assert_prior_page(
    base_url: str,
    path: str,
    response: Any,
    expected_fingerprint: Mapping[str, Any],
) -> dict[str, Any]:
    """Require the rollback page to equal its captured pre-install semantics."""

    expected_url = f"{base_url}{path}"
    if response.status_code != 200 or response.history or response.url != expected_url:
        raise RuntimeError(f"Rollback page is not canonical direct HTTP 200: {path}")
    probe = inspect_seo_html(response.text, response.headers)
    fingerprint = semantic_page_fingerprint(probe)
    if fingerprint != dict(expected_fingerprint):
        raise RuntimeError(f"Rollback did not restore the exact SEO fingerprint on {path}.")
    return fingerprint


def helper_route(route_base: str, operation: str) -> str:
    return f"{HELPER_NAMESPACE}{route_base}/{operation}"


def call_helper(
    client: WordpressClient,
    route_base: str,
    operation: str,
    token: str,
    helper_code_sha256: str,
    timeout: int,
    extra_body: Mapping[str, Any] | None = None,
    operation_nonce: str | None = None,
) -> Any:
    nonce = operation_nonce or secrets.token_hex(OPERATION_NONCE_BYTES)
    if not _SHA256_RE.fullmatch(nonce):
        raise RuntimeError("A helper operation nonce is outside the exact contract.")
    body: dict[str, Any] = {
        "token": token,
        "helper_code_sha256": helper_code_sha256,
        "operation_nonce": nonce,
    }
    if extra_body:
        body.update(extra_body)
    return client.request(
        "POST",
        helper_route(route_base, operation),
        json_body=body,
        timeout=timeout,
        require_success=False,
    )


def reconcile_install_timeout(
    client: WordpressClient,
    route_base: str,
    token: str,
    helper_code_sha256: str,
    install_nonce: str,
    timeout: int,
) -> dict[str, Any]:
    """Poll only; never race a timed-out installer with an automatic rollback."""

    deadline = time.monotonic() + min(max(timeout, 30), 180)
    expected_nonce_sha256 = sha256_text(install_nonce)
    observations: list[dict[str, Any]] = []
    while True:
        response = call_helper(
            client,
            route_base,
            "status",
            token,
            helper_code_sha256,
            min(timeout, 30),
        )
        payload = response.json() if "json" in response.headers.get("Content-Type", "") else {}
        summary = response_summary(response)
        observations.append(summary)
        if response.status_code != 200 or not isinstance(payload, dict) or payload.get("success") is not True:
            return {"resolved": False, "reason": "status_unavailable", "observations": observations}
        state = str(payload.get("state") or "")
        if state in {
            "installed_pending_stabilization",
            "prior_restored",
            "sealed",
            "prepared",
            "finalized",
        }:
            return {
                "resolved": True,
                "state": state,
                "payload": payload,
                "observations": observations,
            }
        if state != "installing":
            return {
                "resolved": False,
                "reason": "unknown_state",
                "state": state,
                "observations": observations,
            }
        lease = payload.get("operation_lease")
        if (
            not isinstance(lease, dict)
            or lease.get("name") != "install"
            or lease.get("nonce_sha256") != expected_nonce_sha256
        ):
            return {
                "resolved": False,
                "reason": "install_lease_identity_changed",
                "state": state,
                "observations": observations,
            }
        if time.monotonic() >= deadline:
            return {
                "resolved": False,
                "reason": "install_still_ambiguous",
                "state": state,
                "lease_expires_epoch": int(lease.get("lease_expires_epoch") or 0),
                "observations": observations,
            }
        time.sleep(2)


def external_cleanup_fallback(
    client: WordpressClient,
    helper_id: int,
    helper_name: str,
    allowed_hashes: Iterable[str],
) -> dict[str, Any]:
    evidence: dict[str, Any] = {"attempted": False, "requests": []}
    matches = matching_snippets(client.all_snippets(), helper_id, helper_name)
    if not matches:
        evidence["absent_before_fallback"] = True
        return evidence
    allowed = set(allowed_hashes)
    if len(matches) != 1:
        evidence["refused_identity_mismatch"] = True
        return evidence
    identity = snippet_identity(matches[0])
    if (
        identity["id"] != helper_id
        or identity["name"] != helper_name
        or identity["scope"] != "global"
        or identity["code_sha256"] not in allowed
    ):
        evidence["refused_identity_mismatch"] = True
        return evidence
    evidence["attempted"] = True
    if identity["active"] is True:
        response = client.request(
            "PUT",
            f"code-snippets/v1/snippets/{helper_id}/deactivate",
            json_body={},
            require_success=False,
        )
        evidence["requests"].append({"operation": "deactivate", "status": response.status_code})
    for attempt in (1, 2):
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


def save_evidence(
    output_dir: Path, run_id: str, evidence: Mapping[str, Any], secrets_to_remove: Iterable[str]
) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    path = output_dir / f"{run_id}.json"
    sanitized = redact(dict(evidence), secrets_to_remove)
    path.write_text(
        json.dumps(sanitized, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return path


def deployment_contract_self_test() -> dict[str, Any]:
    class FakeResponse:
        def __init__(self, status_code: int, payload: Mapping[str, Any]) -> None:
            self.status_code = status_code
            self.headers = {"Content-Type": "application/json; charset=UTF-8"}
            self._payload = dict(payload)

        def json(self) -> dict[str, Any]:
            return dict(self._payload)

    snippet_source = "<?php\n" + ("echo 'sensitive';\n" * 200) + "?>"
    snippet_summary = response_summary(
        FakeResponse(
            200,
            {
                "id": 404,
                "name": "temporary-helper",
                "active": True,
                "code": snippet_source,
            },
        )
    )
    if "code" in snippet_summary or "message" in snippet_summary:
        raise RuntimeError("A non-error Code Snippets payload leaked source into evidence.")

    controlled_message = "An active or recently expired deployment lock exists."
    controlled_summary = response_summary(
        FakeResponse(
            409,
            {
                "success": False,
                "code": "justice_ops_preflight_failed",
                "message": controlled_message,
                "failure_reason": "foreign_lock_recent",
                "failure_stage": "lock_preflight",
                "candidate_mutation_started": False,
                "state_absent_after": True,
                "own_lock_absent_after": True,
                "backup_root_absent_after": True,
                "safe_to_retire_helper": True,
            },
        )
    )
    if (
        controlled_summary.get("code") != "justice_ops_preflight_failed"
        or controlled_summary.get("failure_reason") != "foreign_lock_recent"
        or controlled_summary.get("failure_stage") != "lock_preflight"
        or controlled_summary.get("message") != controlled_message
        or controlled_summary.get("message_sha256") != sha256_text(controlled_message)
        or not is_proven_safe_pre_mutation_failure(controlled_summary)
    ):
        raise RuntimeError("A bounded controlled helper failure lost its safe evidence.")
    incomplete_controlled = dict(controlled_summary)
    incomplete_controlled["own_lock_absent_after"] = False
    if is_proven_safe_pre_mutation_failure(incomplete_controlled):
        raise RuntimeError("An incomplete cleanup proof was accepted as safe.")

    unsafe_error_summary = response_summary(
        FakeResponse(
            500,
            {
                "success": False,
                "code": snippet_source,
                "message": "x" * (MAX_EVIDENCE_MESSAGE_CHARS + 1),
            },
        )
    )
    if "code" in unsafe_error_summary or "message" in unsafe_error_summary:
        raise RuntimeError("Unbounded error evidence was retained.")
    if "message_sha256" not in unsafe_error_summary:
        raise RuntimeError("Unbounded error evidence lost its non-reversible digest.")

    sample_files = {
        "justice-ops.php": {"bytes": 3, "sha256": sha256_bytes(b"abc")},
        "family-content-release.php": {"bytes": 3, "sha256": sha256_bytes(b"def")},
    }
    first = canonical_directory_digest(sample_files)
    second = canonical_directory_digest(dict(reversed(list(sample_files.items()))))
    if first != second or not _SHA256_RE.fullmatch(first):
        raise RuntimeError("Canonical directory digest is not deterministic.")
    if (
        can_auto_rollback(False, "sealed")
        or can_auto_rollback(True, "")
        or can_auto_rollback(True, "installing")
        or can_auto_rollback(True, "cleanup_pending")
        or not can_auto_rollback(True, "prior_restored")
        or not can_auto_rollback(True, "sealed")
        or not can_auto_rollback(True, "stabilized_pending_confirmation")
    ):
        raise RuntimeError("Safe timeout rollback phase gating changed.")
    ordinary_headers = public_request_headers(rest=False, cache_bust=False)
    busted_headers = public_request_headers(rest=False, cache_bust=True)
    if "Cache-Control" in ordinary_headers or busted_headers.get("Cache-Control") != "no-cache":
        raise RuntimeError("Canonical unbusted request headers are not ordinary cacheable headers.")
    expected_cache_urls = [f"{TARGET_BASE_URL}{path}" for path in AFFECTED_PATHS]
    valid_cache = {
        "confirmed": True,
        "confirmation_modes": ["litespeed_purge_all_handler"],
        "page_cache_confirmation_modes": ["litespeed_purge_all_handler"],
        "object_cache_flush_result": True,
        "affected_urls": expected_cache_urls,
        "edge_purge_confirmed_count": 0,
    }
    if require_cache_confirmation(valid_cache)["confirmed"] is not True:
        raise RuntimeError("Recognized page-cache confirmation was rejected.")
    autoptimize_only = dict(valid_cache)
    autoptimize_only["confirmation_modes"] = ["autoptimize_clearall_called"]
    autoptimize_only["page_cache_confirmation_modes"] = []
    try:
        require_cache_confirmation(autoptimize_only)
    except RuntimeError:
        pass
    else:
        raise RuntimeError("Autoptimize-only cache confirmation was accepted.")

    class FakePageResponse:
        def __init__(self, path: str, markup: str) -> None:
            self.status_code = 200
            self.url = f"{TARGET_BASE_URL}{path}"
            self.history: list[Any] = []
            self.headers = {"Content-Type": "text/html; charset=UTF-8"}
            self.text = markup

    prior_2352_family_html = (
        '<html><head><title>Prior family title</title>'
        '<meta name="description" content="Prior family description">'
        '<link rel="canonical" href="https://jus-tice.co.il/family-law/">'
        '</head><body data-jt-family-release="2026-08-02-r1">'
        '<h1>Prior family H1</h1><p>Prior family body</p></body></html>'
    )
    prior_2352_family_response = FakePageResponse(
        "/family-law/", prior_2352_family_html
    )
    prior_2352_family_fingerprint = semantic_page_fingerprint(
        inspect_seo_html(
            prior_2352_family_response.text, prior_2352_family_response.headers
        )
    )
    if prior_2352_family_fingerprint["release_marker_count"] != 1:
        raise RuntimeError("The 2.35.2 prior-baseline fixture lost its family marker.")
    _assert_prior_page(
        TARGET_BASE_URL,
        "/family-law/",
        prior_2352_family_response,
        prior_2352_family_fingerprint,
    )
    wrong_zero_marker_baseline = dict(prior_2352_family_fingerprint)
    wrong_zero_marker_baseline["release_marker_count"] = 0
    try:
        _assert_prior_page(
            TARGET_BASE_URL,
            "/family-law/",
            prior_2352_family_response,
            wrong_zero_marker_baseline,
        )
    except RuntimeError:
        pass
    else:
        raise RuntimeError("Rollback accepted a marker-zero assumption over the 2.35.2 baseline.")

    maya_contract = PAGE_CONTRACTS[MAYA_PATH]
    maya_schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": f"{maya_contract['canonical']}#webpage",
                "url": maya_contract["canonical"],
                "name": maya_contract["h1"],
                "description": maya_contract["description"],
                "inLanguage": "he-IL",
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{maya_contract['canonical']}#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Jus-Tice",
                        "item": "https://jus-tice.co.il/",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "דיני משפחה",
                        "item": "https://jus-tice.co.il/family-law/",
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": maya_contract["h1"],
                        "item": maya_contract["canonical"],
                    },
                ],
            },
        ],
    }
    maya_schema_json = json.dumps(
        maya_schema, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    )
    maya_description_attribute = html_module.escape(
        maya_contract["description"], quote=True
    )
    maya_candidate_html = (
        f'<html><head><title>{maya_contract["title"]}</title>'
        f'<meta name="description" content="{maya_description_attribute}">'
        f'<link rel="canonical" href="{maya_contract["canonical"]}">'
        f'<script type="application/ld+json" id="{MAYA_SCHEMA_ID}">{maya_schema_json}</script>'
        '</head><body data-jt-maya-profile-release="2026-08-02-r1">'
        f'<h1>{maya_contract["h1"]}</h1>'
        '<section data-jt-maya-profile-content="2026-08-02-r1">'
        '<p data-jt-commercial-disclosure="maya-rotenberg">גילוי מסחרי</p>'
        '</section></body></html>'
    )
    maya_candidate_response = FakePageResponse(MAYA_PATH, maya_candidate_html)
    maya_candidate_fingerprint = _assert_candidate_page(
        MAYA_PATH, maya_contract, maya_candidate_response
    )
    if (
        maya_candidate_fingerprint["maya_release_marker_count"] != 1
        or maya_candidate_fingerprint["maya_content_marker_count"] != 1
        or maya_candidate_fingerprint["maya_disclosure_marker_count"] != 1
        or set(maya_candidate_fingerprint["json_ld_types"]) != MAYA_SCHEMA_TYPES
    ):
        raise RuntimeError("Maya candidate acceptance evidence is incomplete.")
    maya_noindex = maya_candidate_html.replace(
        "<head>", '<head><meta name="robots" content="noindex,follow">', 1
    )
    try:
        _assert_candidate_page(
            MAYA_PATH, maya_contract, FakePageResponse(MAYA_PATH, maya_noindex)
        )
    except RuntimeError:
        pass
    else:
        raise RuntimeError("Maya candidate acceptance permitted noindex.")

    maya_prior_html = (
        '<html><head><title>Legacy Maya title</title>'
        '<meta name="description" content="Legacy Maya description">'
        f'<link rel="canonical" href="{maya_contract["canonical"]}">'
        '</head><body><h1>Legacy Maya H1</h1><p>Legacy body</p></body></html>'
    )
    maya_prior_response = FakePageResponse(MAYA_PATH, maya_prior_html)
    maya_prior_fingerprint = semantic_page_fingerprint(
        inspect_seo_html(maya_prior_response.text, maya_prior_response.headers)
    )
    _assert_prior_page(
        TARGET_BASE_URL, MAYA_PATH, maya_prior_response, maya_prior_fingerprint
    )
    try:
        _assert_prior_page(
            TARGET_BASE_URL,
            MAYA_PATH,
            maya_candidate_response,
            maya_prior_fingerprint,
        )
    except RuntimeError:
        pass
    else:
        raise RuntimeError("Maya rollback accepted candidate semantics over the prior baseline.")

    if safe_relative_member("justice-ops/a/b.php") != "a/b.php":
        raise RuntimeError("Safe ZIP path normalization failed.")
    for unsafe in ("../x", "justice-ops/../x", "/justice-ops/x", "other/x"):
        try:
            safe_relative_member(unsafe)
        except RuntimeError:
            pass
        else:
            raise RuntimeError(f"Unsafe ZIP path was accepted: {unsafe}")

    snapshot_payload = {
        "file_count": 2,
        "directory_sha256": first,
        "files": [
            {"path": path, "bytes": item["bytes"], "sha256": item["sha256"]}
            for path, item in sorted(sample_files.items())
        ],
    }
    decoded_manifest = decode_live_manifest(snapshot_payload)
    if decoded_manifest != sample_files:
        raise RuntimeError("Live snapshot manifest decoding changed.")
    with tempfile.TemporaryDirectory(prefix="justice-ops-rollback-self-test-") as temp:
        rollback = write_local_rollback(
            Path(temp),
            "justice-ops-install-20260802T000000Z-00000000",
            "2.35.0",
            {"justice-ops.php": b"abc", "family-content-release.php": b"def"},
            sample_files,
        )
        if rollback["directory_sha256"] != first or rollback["file_count"] != 2:
            raise RuntimeError("Local exact rollback ZIP round-trip changed.")

    now = datetime.now(timezone.utc).replace(microsecond=0)
    proof_challenge = "e" * 64
    proof_filename = ".justice-ops-upress-recovery-" + proof_challenge[:32] + ".json"
    proof_payload = {
        "artifact_sha256": "d" * 64,
        "challenge": proof_challenge,
        "commit_sha": "0" * 40,
        "contract": RECOVERY_PROOF_CONTRACT,
        "expires_at_utc": (now + timedelta(minutes=10)).isoformat(),
        "issued_at_utc": now.isoformat(),
        "marker_filename": proof_filename,
        "marker_path": f"{RECOVERY_MARKER_ROOT}/{proof_filename}",
        "plugin_path": RECOVERY_PLUGIN_PATH,
        "prior_version": "2.35.0",
        "target": TARGET_BASE_URL,
        "upress_pid": RECOVERY_UPRESS_PID,
    }
    proof_bytes = (
        json.dumps(
            proof_payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")
        )
        + "\n"
    ).encode("utf-8")
    with tempfile.TemporaryDirectory(prefix="justice-ops-proof-self-test-") as temp:
        proof_path = Path(temp) / proof_filename
        proof_path.write_bytes(proof_bytes)
        proof_result = validate_recovery_probe(
            proof_path, "0" * 40, "d" * 64, "2.35.0"
        )
        if (
            proof_result["marker_sha256"] != sha256_bytes(proof_bytes)
            or proof_result["marker_path"] != f"{RECOVERY_MARKER_ROOT}/{proof_filename}"
            or proof_result["upress_pid"] != RECOVERY_UPRESS_PID
        ):
            raise RuntimeError("Challenge-bound uPress marker validation changed.")
        proof_path.write_text(json.dumps(proof_payload, indent=2), encoding="utf-8")
        try:
            validate_recovery_probe(proof_path, "0" * 40, "d" * 64, "2.35.0")
        except RuntimeError:
            pass
        else:
            raise RuntimeError("Non-canonical uPress marker bytes were accepted.")

    dummy = {
        "justice-ops.php": {"bytes": 1, "sha256": "a" * 64},
        "family-content-release.php": {"bytes": 1, "sha256": "b" * 64},
        "review-claims-off.php": {"bytes": 1, "sha256": "c" * 64},
    }
    recovery_payload = {
        "artifact_sha256": "d" * 64,
        "challenge": "e" * 64,
        "commit_sha": "0" * 40,
        "contract": RECOVERY_PROOF_CONTRACT,
        "expires_at_utc": "2026-08-02T00:15:00+00:00",
        "issued_at_utc": "2026-08-02T00:00:00+00:00",
        "marker_filename": ".justice-ops-upress-recovery-" + "e" * 32 + ".json",
        "marker_path": "wp-content/upgrade/.justice-ops-upress-recovery-"
        + "e" * 32
        + ".json",
        "plugin_path": RECOVERY_PLUGIN_PATH,
        "prior_version": "2.35.0",
        "target": TARGET_BASE_URL,
        "upress_pid": RECOVERY_UPRESS_PID,
    }
    recovery_bytes = (
        json.dumps(
            recovery_payload,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )
        + "\n"
    ).encode("utf-8")
    code, normalized = build_helper_code(
        run_id="justice-ops-install-20260802T000000Z-00000000",
        helper_id=123,
        helper_name="tmp-justice-ops-install-20260802T000000Z-00000000",
        route_base="/justice-ops-install-20260802T000000Z-00000000",
        token="0" * 64,
        commit_sha="0" * 40,
        version="2.35.2",
        prior_version="2.35.0",
        immutable_artifact_url=(
            "https://raw.githubusercontent.com/The-new-ben/justice-theme/"
            + "0" * 40
            + "/plugin-dist/justice-ops-2.35.2.zip"
        ),
        artifact_sha256="d" * 64,
        artifact_bytes=123,
        artifact_expanded_bytes=321,
        candidate_files=dummy,
        recovery_proof={
            "payload": recovery_payload,
            "marker_sha256": sha256_bytes(recovery_bytes),
            "marker_bytes": len(recovery_bytes),
        },
    )
    lint = lint_php_snippet(code)
    if normalized not in code or _SELF_HASH_MARKER in code:
        raise RuntimeError("Generated helper self-hash contract failed.")
    preflight_route = code.find("$expected_route_base . '/preflight'")
    prepare_route = code.find("$expected_route_base . '/prepare'")
    lock_insert = code.find("INSERT IGNORE INTO {$wpdb->options}")
    lock_acquire = code.find("$acquire_raw_option_once( $lock_option, $lock_value )")
    marker_consume = code.find("$inspect_recovery_marker( true )", lock_acquire)
    if (
        preflight_route < 0
        or prepare_route <= preflight_route
        or "$inspect_recovery_marker( false )" not in code
        or lock_insert < 0
        or "add_option( $lock_option" in code
        or lock_acquire < 0
        or marker_consume <= lock_acquire
        or "if ( $cleanup_can_continue && $lock_acquired )" not in code
    ):
        raise RuntimeError("Protected preflight, lock acquisition or marker ordering changed.")
    for proof_field in (
        "'candidate_mutation_started'",
        "'state_absent_after'",
        "'own_lock_absent_after'",
        "'backup_root_absent_after'",
        "'marker_consumed'",
        "'safe_to_retire_helper'",
        "'foreign_lock_present'",
    ):
        if proof_field not in code:
            raise RuntimeError(f"Generated helper lost cleanup proof field: {proof_field}")
    backup_cleanup = code.find("$backup_removed = $remove_directory")
    final_lock_release = code.find("$lock_released = $release_lock", backup_cleanup)
    if backup_cleanup < 0 or final_lock_release <= backup_cleanup:
        raise RuntimeError("Terminal cleanup no longer releases the global lock last.")
    if "'page_cache_confirmation_modes'" not in code:
        raise RuntimeError("Generated helper lost the page-cache confirmation contract.")
    if (
        "'finalize', 'stabilized_pending_confirmation'" not in code
        or "$expected_route_base . '/confirm-finalized'" not in code
        or "'confirm_finalized', 'finalized'" not in code
        or "'stabilization_match'=> $stabilization_match" not in code
        or "'finalize', 'finalized'" in code
    ):
        raise RuntimeError("Fresh-request stabilization confirmation phases changed.")
    return {
        "passed": True,
        "canonical_digest": first,
        "rollback_round_trip_sha256": rollback["rollback_zip_sha256"],
        "generated_helper_sha256": sha256_text(code),
        "generated_helper_lint": lint,
        "recovery_marker_validation_sha256": proof_result["marker_sha256"],
        "prior_2_35_2_marker_baseline": prior_2352_family_fingerprint[
            "release_marker_count"
        ],
        "maya_candidate_and_rollback_contracts": True,
    }


def run(args: argparse.Namespace) -> tuple[int, Path, dict[str, Any]]:
    commit_sha, version, artifact_sha256, prior_version = validate_args(args)
    run_id = f"justice-ops-install-{utc_slug()}-{secrets.token_hex(4)}"
    if not _RUN_ID_RE.fullmatch(run_id):
        raise RuntimeError("Generated run ID is outside the release contract.")
    helper_name = f"tmp-{run_id}"
    route_base = f"/{run_id}"
    token = secrets.token_hex(32)
    immutable_url = artifact_url(commit_sha, version)
    run_dir = args.output_dir.resolve() / run_id

    evidence: dict[str, Any] = {
        "schema_version": 1,
        "run_id": run_id,
        "started_at_utc": utc_now(),
        "target": TARGET_BASE_URL,
        "release": {
            "repository": REPOSITORY,
            "protected_commit_sha": commit_sha,
            "version": version,
            "artifact_sha256": artifact_sha256,
            "immutable_artifact_url": immutable_url,
            "plugin_basename": PLUGIN_BASENAME,
            "expected_live_version": prior_version,
        },
        "helper": {"name": helper_name, "route_base": route_base},
        "checks": {},
        "passed": False,
    }
    secrets_to_remove: list[str] = [token]
    client: WordpressClient | None = None
    helper_id: int | None = None
    helper_hash = ""
    allowed_hashes: set[str] = set()
    prepare_attempted = False
    prepared = False
    mutation_attempted = False
    candidate_install_attempted = False
    candidate_observed = False
    rollback_confirmed = False
    finalized = False
    execution_error = ""
    live_state_ambiguous = False
    status_reconciled = False
    helper_safe_to_retire = False
    safe_pre_mutation_failure = False
    control_plane_reconciliation_required = False
    prior_public_baseline: dict[str, Any] = {}

    try:
        env_file = resolve_env_file(args.env_file)
        env = read_env(env_file)
        missing = [
            key for key in ("WP_BASE_URL", "WP_USER", "WP_APP_PASSWORD") if not env.get(key)
        ]
        if missing:
            raise RuntimeError("WordPress application-auth keys are missing from the env file.")
        secrets_to_remove.extend((env["WP_USER"], env["WP_APP_PASSWORD"]))
        base_url = validate_target_base_url(env["WP_BASE_URL"])

        recovery_proof = validate_recovery_probe(
            args.recovery_probe_evidence, commit_sha, artifact_sha256, prior_version
        )
        evidence["checks"]["uPress_recovery_probe"] = {
            key: value for key, value in recovery_proof.items() if key != "payload"
        }
        evidence["checks"]["protected_release_provenance"] = verify_release_provenance(
            commit_sha, args.timeout
        )
        evidence["checks"]["protected_driver_sources"] = verify_protected_driver_sources(
            commit_sha, args.timeout
        )
        artifact_info, artifact_payload, candidate_files = inspect_artifact(
            immutable_url, artifact_sha256, version, args.timeout
        )
        evidence["checks"]["immutable_artifact"] = artifact_info
        evidence["checks"]["artifact_php_lint"] = lint_artifact_php(artifact_payload)

        client = WordpressClient(base_url, env["WP_USER"], env["WP_APP_PASSWORD"])
        evidence["checks"]["authenticated_site_identity"] = verify_site_identity(client)
        prior_health = public_request(base_url, HEALTH_ROUTE, timeout=60, rest=True)
        prior_health_summary = response_summary(prior_health)
        evidence["checks"]["prior_public_health"] = prior_health_summary
        if (
            prior_health.status_code != 200
            or prior_health_summary.get("version") != prior_version
            or prior_health_summary.get("marker") != "self-update-proof-v1"
        ):
            raise RuntimeError("Live Justice Ops prior health differs from the release input.")
        prior_public_baseline = capture_prior_public(base_url, min(args.timeout, 120))
        evidence["checks"]["prior_six_page_baseline"] = prior_public_baseline

        snippets_before = client.all_snippets()
        evidence["checks"]["snippet_collection_preflight"] = {
            "count": len(snippets_before),
            "unique_name_absent": not any(
                str(row.get("name") or "") == helper_name for row in snippets_before
            ),
        }
        if not evidence["checks"]["snippet_collection_preflight"]["unique_name_absent"]:
            raise RuntimeError("The unique helper name already exists.")

        placeholder = f"/* inactive placeholder for {helper_name} */"
        allowed_hashes.add(sha256_text(placeholder))
        create = client.request(
            "POST",
            "code-snippets/v1/snippets",
            json_body={
                "name": helper_name,
                "code": placeholder,
                "scope": "global",
                "active": False,
            },
        )
        created = create.json()
        helper_id = int(created.get("id") or 0)
        if helper_id <= 0:
            raise RuntimeError("Code Snippets did not return a valid helper ID.")
        evidence["helper"]["id"] = helper_id

        helper_code, normalized_sha = build_helper_code(
            run_id=run_id,
            helper_id=helper_id,
            helper_name=helper_name,
            route_base=route_base,
            token=token,
            commit_sha=commit_sha,
            version=version,
            prior_version=prior_version,
            immutable_artifact_url=immutable_url,
            artifact_sha256=artifact_sha256,
            artifact_bytes=int(artifact_info["bytes"]),
            artifact_expanded_bytes=int(artifact_info["expanded_bytes"]),
            candidate_files=candidate_files,
            recovery_proof=recovery_proof,
        )
        helper_hash = sha256_text(helper_code)
        allowed_hashes.add(helper_hash)
        evidence["helper"].update(
            {"code_sha256": helper_hash, "normalized_self_sha256": normalized_sha}
        )
        evidence["checks"]["generated_helper_lint"] = lint_php_snippet(helper_code)

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
        inactive = client.get_snippet(helper_id)
        inactive.raise_for_status()
        expected_inactive = {
            "id": helper_id,
            "name": helper_name,
            "active": False,
            "scope": "global",
            "code_sha256": helper_hash,
        }
        observed_inactive = snippet_identity(inactive.json())
        evidence["checks"]["inactive_helper_identity"] = observed_inactive
        if observed_inactive != expected_inactive:
            raise RuntimeError("Inactive helper identity or code changed.")
        activation = client.request(
            "PUT",
            f"code-snippets/v1/snippets/{helper_id}/activate",
            json_body={},
            require_success=False,
        )
        if activation.status_code != 200:
            raise RuntimeError("Temporary helper activation failed.")
        active = client.get_snippet(helper_id)
        active.raise_for_status()
        expected_active = dict(expected_inactive)
        expected_active["active"] = True
        observed_active = snippet_identity(active.json())
        evidence["checks"]["active_helper_identity"] = observed_active
        if observed_active != expected_active:
            raise RuntimeError("Active helper identity or code changed.")

        preflight = call_helper(
            client, route_base, "preflight", token, helper_hash, args.timeout
        )
        preflight_payload = (
            preflight.json()
            if "json" in preflight.headers.get("Content-Type", "")
            else {}
        )
        preflight_summary = response_summary(preflight)
        evidence["checks"]["preflight_callback"] = preflight_summary
        if (
            preflight.status_code != 200
            or not isinstance(preflight_payload, dict)
            or preflight_payload.get("success") is not True
            or preflight_payload.get("ready") is not True
        ):
            safe_pre_mutation_failure = is_proven_safe_pre_mutation_failure(
                preflight_summary
            )
            helper_safe_to_retire = safe_pre_mutation_failure
            control_plane_reconciliation_required = bool(
                preflight_summary.get("foreign_lock_present") is True
                or not safe_pre_mutation_failure
            )
            reason = str(preflight_summary.get("failure_reason") or "unknown_failure")
            message = str(preflight_summary.get("message") or "No safe message returned.")
            raise RuntimeError(f"Server preflight failed [{reason}]: {message}")
        preflight_marker = preflight_payload.get("marker_inspection")
        preflight_prior = preflight_payload.get("prior_identity")
        if (
            not isinstance(preflight_marker, dict)
            or preflight_marker.get("consumed") is not False
            or preflight_marker.get("marker_present") is not True
            or preflight_marker.get("single_use_deleted") is not False
            or preflight_marker.get("marker_sha256") != recovery_proof["marker_sha256"]
            or preflight_marker.get("marker_filename")
            != recovery_proof["marker_filename"]
            or not isinstance(preflight_prior, dict)
            or preflight_prior.get("version") != prior_version
            or preflight_prior.get("active") is not True
            or preflight_payload.get("candidate_mutation_started") is not False
            or preflight_payload.get("state_absent_after") is not True
            or preflight_payload.get("own_lock_acquired") is not False
            or preflight_payload.get("own_lock_absent_after") is not True
            or preflight_payload.get("backup_root_absent_after") is not True
            or preflight_payload.get("marker_consumed") is not False
            or preflight_payload.get("safe_to_retire_helper") is not True
        ):
            control_plane_reconciliation_required = True
            raise RuntimeError("Server preflight proof is incomplete or changed.")
        helper_safe_to_retire = True

        prepare_attempted = True
        helper_safe_to_retire = False
        prepare = call_helper(
            client, route_base, "prepare", token, helper_hash, args.timeout
        )
        prepare_payload = prepare.json() if "json" in prepare.headers.get("Content-Type", "") else {}
        prepare_summary = response_summary(prepare)
        evidence["checks"]["prepare_callback"] = prepare_summary
        if prepare.status_code != 200 or not isinstance(prepare_payload, dict) or prepare_payload.get("success") is not True:
            safe_pre_mutation_failure = is_proven_safe_pre_mutation_failure(
                prepare_summary
            )
            helper_safe_to_retire = safe_pre_mutation_failure
            control_plane_reconciliation_required = bool(
                prepare_summary.get("foreign_lock_present") is True
                or not safe_pre_mutation_failure
            )
            reason = str(prepare_summary.get("failure_reason") or "unknown_failure")
            message = str(prepare_summary.get("message") or "No safe message returned.")
            raise RuntimeError(f"Server-side snapshot preparation failed [{reason}]: {message}")
        consumed = prepare_payload.get("recovery_proof")
        if (
            not isinstance(consumed, dict)
            or consumed.get("single_use_deleted") is not True
            or consumed.get("marker_sha256") != recovery_proof["marker_sha256"]
            or consumed.get("marker_filename") != recovery_proof["marker_filename"]
        ):
            raise RuntimeError("The server did not consume the exact single-use uPress marker.")
        prepared = True
        observed_live = decode_live_manifest(prepare_payload)
        bodies, export_batches = download_live_snapshot(
            client,
            route_base,
            token,
            helper_hash,
            args.timeout,
            observed_live,
        )
        evidence["checks"]["live_rollback_export_batches"] = export_batches
        rollback_artifact = write_local_rollback(
            run_dir, run_id, prior_version, bodies, observed_live
        )
        evidence["local_rollback"] = rollback_artifact
        if rollback_artifact["directory_sha256"] != prepare_payload.get("directory_sha256"):
            raise RuntimeError("Local rollback manifest differs from the server backup.")
        live_gate = compare_live_gate(args, observed_live)
        evidence["checks"]["live_inventory_gate"] = live_gate
        if prepare_payload.get("prior_version") != prior_version or prepare_payload.get("prior_active") is not True:
            raise RuntimeError("Prepared live plugin state differs from the expected active prior.")

        rollback_zip_bytes = Path(rollback_artifact["rollback_zip"]).read_bytes()
        seal = call_helper(
            client,
            route_base,
            "seal",
            token,
            helper_hash,
            args.timeout,
            extra_body={
                "rollback_zip_base64": base64.b64encode(rollback_zip_bytes).decode("ascii"),
                "rollback_zip_sha256": rollback_artifact["rollback_zip_sha256"],
                "rollback_zip_bytes": len(rollback_zip_bytes),
            },
        )
        seal_summary = response_summary(seal)
        evidence["checks"]["server_rollback_zip_seal"] = seal_summary
        if (
            seal.status_code != 200
            or seal_summary.get("success") is not True
            or seal_summary.get("state") != "sealed"
            or seal_summary.get("rollback_zip_sha256")
            != rollback_artifact["rollback_zip_sha256"]
            or seal_summary.get("rollback_zip_bytes") != len(rollback_zip_bytes)
        ):
            raise RuntimeError("The server did not seal the exact local rollback ZIP.")

        candidate_install_attempted = True
        mutation_attempted = True
        install_nonce = secrets.token_hex(OPERATION_NONCE_BYTES)
        try:
            install = call_helper(
                client,
                route_base,
                "install",
                token,
                helper_hash,
                args.timeout,
                operation_nonce=install_nonce,
            )
            install_summary = response_summary(install)
        except requests.exceptions.Timeout:  # type: ignore[union-attr]
            reconciliation = reconcile_install_timeout(
                client,
                route_base,
                token,
                helper_hash,
                install_nonce,
                args.timeout,
            )
            evidence["checks"]["install_timeout_reconciliation"] = reconciliation
            if (
                reconciliation.get("resolved") is not True
                or reconciliation.get("state") != "installed_pending_stabilization"
            ):
                raise RuntimeError(
                    "Timed-out install remains ambiguous; no concurrent rollback was attempted."
                )
            install = None
            install_summary = dict(reconciliation["payload"])
        evidence["checks"]["install_callback"] = install_summary
        if (install is not None and install.status_code != 200) or install_summary.get("success") is not True:
            raise RuntimeError("Plugin_Upgrader callback did not pass exact acceptance.")
        if (
            install_summary.get("state") != "installed_pending_stabilization"
        ):
            raise RuntimeError("Installed plugin did not enter the fresh-request stabilization phase.")
        identity = install_summary.get("current_identity")
        if isinstance(identity, dict):
            observed_version = identity.get("version")
            observed_active = identity.get("active")
            observed_digest = identity.get("directory_sha256")
            observed_count = identity.get("file_count")
            install_cache = install_summary.get("install_cache")
        else:
            observed_version = install_summary.get("version")
            observed_active = install_summary.get("active")
            observed_digest = install_summary.get("directory_sha256")
            observed_count = install_summary.get("file_count")
            install_cache = install_summary.get("cache")
        if (
            observed_version != version
            or observed_active is not True
            or observed_digest != artifact_info["directory_sha256"]
            or observed_count != artifact_info["file_count"]
        ):
            raise RuntimeError("Installed plugin identity differs from the reviewed artifact.")
        evidence["checks"]["install_cache_confirmation"] = require_cache_confirmation(
            install_cache
        )

        finalize = call_helper(
            client, route_base, "finalize", token, helper_hash, args.timeout
        )
        finalize_summary = response_summary(finalize)
        evidence["checks"]["finalize_callback"] = finalize_summary
        stabilized = (
            finalize.status_code == 200
            and finalize_summary.get("success") is True
            and finalize_summary.get("state") == "stabilized_pending_confirmation"
            and finalize_summary.get("version") == version
            and finalize_summary.get("active") is True
            and finalize_summary.get("directory_sha256")
            == artifact_info["directory_sha256"]
            and finalize_summary.get("file_count") == artifact_info["file_count"]
        )
        if not stabilized:
            raise RuntimeError("Fresh-request stabilization did not verify the candidate.")
        evidence["checks"]["finalize_cache_confirmation"] = require_cache_confirmation(
            finalize_summary.get("cache")
        )

        stabilization_status = call_helper(
            client, route_base, "status", token, helper_hash, args.timeout
        )
        stabilization_status_summary = response_summary(stabilization_status)
        evidence["checks"]["independent_stabilization_status"] = (
            stabilization_status_summary
        )
        stabilization_identity = stabilization_status_summary.get("current_identity")
        if (
            stabilization_status.status_code != 200
            or stabilization_status_summary.get("success") is not True
            or stabilization_status_summary.get("state")
            != "stabilized_pending_confirmation"
            or stabilization_status_summary.get("stabilization_match") is not True
            or stabilization_status_summary.get("post_options_match") is not True
            or stabilization_status_summary.get("current_post_option_fingerprint")
            != finalize_summary.get("post_option_fingerprint")
            or stabilization_status_summary.get("stored_post_option_fingerprint")
            != finalize_summary.get("post_option_fingerprint")
            or not isinstance(stabilization_identity, dict)
            or stabilization_identity.get("version") != version
            or stabilization_identity.get("active") is not True
            or stabilization_identity.get("directory_sha256")
            != artifact_info["directory_sha256"]
            or stabilization_identity.get("file_count") != artifact_info["file_count"]
        ):
            raise RuntimeError(
                "Independent fresh status did not match the durable stabilization snapshot."
            )

        confirm = call_helper(
            client,
            route_base,
            "confirm-finalized",
            token,
            helper_hash,
            args.timeout,
        )
        confirm_summary = response_summary(confirm)
        evidence["checks"]["confirm_finalized_callback"] = confirm_summary
        if (
            confirm.status_code != 200
            or confirm_summary.get("success") is not True
            or confirm_summary.get("state") != "finalized"
            or confirm_summary.get("stabilization_match") is not True
            or confirm_summary.get("version") != version
            or confirm_summary.get("active") is not True
            or confirm_summary.get("directory_sha256")
            != artifact_info["directory_sha256"]
            or confirm_summary.get("file_count") != artifact_info["file_count"]
            or confirm_summary.get("post_option_fingerprint")
            != finalize_summary.get("post_option_fingerprint")
        ):
            raise RuntimeError("Durable stabilization could not transition to finalized.")

        public_acceptance = verify_candidate_public(
            base_url, version, min(args.timeout, 120)
        )
        evidence["checks"]["public_candidate_acceptance"] = public_acceptance
        candidate_observed = True
        acceptance_sha256 = sha256_text(
            json.dumps(public_acceptance, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        )
        cleanup = call_helper(
            client,
            route_base,
            "cleanup",
            token,
            helper_hash,
            args.timeout,
            extra_body={
                "terminal": "finalized",
                "acceptance_sha256": acceptance_sha256,
            },
        )
        cleanup_summary = response_summary(cleanup)
        evidence["checks"]["terminal_cleanup_callback"] = cleanup_summary
        finalized = bool(
            cleanup.status_code == 200
            and cleanup_summary.get("success") is True
            and cleanup_summary.get("state") == "cleanup_complete"
            and cleanup_summary.get("cleanup_terminal") == "finalized"
            and cleanup_summary.get("lock_released") is True
            and cleanup_summary.get("lock_absent_after") is True
            and cleanup_summary.get("state_deleted") is True
            and cleanup_summary.get("state_absent_after") is True
            and cleanup_summary.get("helper_deleted") is True
            and cleanup_summary.get("helper_absent_after") is True
            and cleanup_summary.get("backup_removed") is True
            and cleanup_summary.get("backup_verified_before") is True
        )
        if not finalized:
            raise RuntimeError("Terminal cleanup did not acknowledge recovery-safe retirement.")
    except Exception as error:  # noqa: BLE001 - release evidence covers all failures.
        execution_error = str(error)
        evidence["error"] = {"type": type(error).__name__, "message": execution_error}
        observed_state = ""
        if (
            client is not None
            and helper_id is not None
            and helper_hash
            and not helper_safe_to_retire
        ):
            try:
                ambiguous_status = call_helper(
                    client, route_base, "status", token, helper_hash, args.timeout
                )
                ambiguous_summary = response_summary(ambiguous_status)
                evidence["checks"]["ambiguous_state_reconciliation"] = ambiguous_summary
                observed_state = str(ambiguous_summary.get("state") or "")
                if (
                    ambiguous_status.status_code == 200
                    and ambiguous_summary.get("success") is True
                ):
                    status_reconciled = True
                    prepared = observed_state in {
                        "prepared",
                        "sealed",
                        "installing",
                        "installed_pending_stabilization",
                        "stabilized_pending_confirmation",
                        "finalized",
                        "prior_restored",
                        "cleanup_pending",
                    }
                    mutation_attempted = bool(
                        ambiguous_summary.get("mutation_started")
                        or observed_state
                        in {
                            "installing",
                            "installed_pending_stabilization",
                            "stabilized_pending_confirmation",
                            "finalized",
                            "prior_restored",
                            "cleanup_pending",
                        }
                    )
                    if observed_state in {"installing", "cleanup_pending"} or (
                        prepare_attempted and not prepared
                    ):
                        live_state_ambiguous = True
                elif prepare_attempted or prepared or mutation_attempted:
                    live_state_ambiguous = True
            except Exception as status_error:  # noqa: BLE001
                if prepare_attempted or prepared or mutation_attempted:
                    live_state_ambiguous = True
                evidence["checks"]["ambiguous_state_reconciliation_error"] = {
                    "type": type(status_error).__name__,
                    "message": str(status_error),
                }
        if (
            client is not None
            and helper_id is not None
            and prepared
            and not finalized
            and can_auto_rollback(status_reconciled, observed_state)
        ):
            try:
                rollback = call_helper(
                    client, route_base, "rollback", token, helper_hash, args.timeout
                )
                rollback_payload = (
                    rollback.json()
                    if "json" in rollback.headers.get("Content-Type", "")
                    else {}
                )
                rollback_summary = response_summary(rollback)
                evidence["checks"]["automatic_rollback_callback"] = rollback_summary
                if (
                    rollback.status_code != 200
                    or not isinstance(rollback_payload, dict)
                    or rollback_payload.get("success") is not True
                    or rollback_payload.get("state") != "prior_restored"
                    or rollback_payload.get("rollback_succeeded") is not True
                    or rollback_payload.get("recovery_held") is not True
                ):
                    raise RuntimeError("Automatic rollback did not enter prior_restored.")
                rollback_detail = rollback_payload.get("rollback")
                if rollback_payload.get("rollback_attempted") is True:
                    if (
                        not isinstance(rollback_detail, dict)
                        or rollback_detail.get("prior_version") != prior_version
                        or rollback_detail.get("prior_active") is not True
                        or rollback_detail.get("directory_sha256")
                        != evidence.get("local_rollback", {}).get("directory_sha256")
                        or rollback_detail.get("file_count")
                        != evidence.get("local_rollback", {}).get("file_count")
                        or rollback_detail.get("options_readback_match") is not True
                    ):
                        raise RuntimeError("Rollback file, version, active or option readback is incomplete.")
                    evidence["checks"]["rollback_cache_confirmation"] = require_cache_confirmation(
                        rollback_detail.get("cache")
                    )
                prior_acceptance = verify_prior_public(
                    TARGET_BASE_URL,
                    prior_version,
                    min(args.timeout, 120),
                    prior_public_baseline,
                )
                evidence["checks"]["automatic_rollback_public"] = prior_acceptance
                rollback_acceptance_sha256 = sha256_text(
                    json.dumps(
                        prior_acceptance,
                        ensure_ascii=False,
                        sort_keys=True,
                        separators=(",", ":"),
                    )
                )
                cleanup = call_helper(
                    client,
                    route_base,
                    "cleanup",
                    token,
                    helper_hash,
                    args.timeout,
                    extra_body={
                        "terminal": "prior_restored",
                        "acceptance_sha256": rollback_acceptance_sha256,
                    },
                )
                cleanup_summary = response_summary(cleanup)
                evidence["checks"]["automatic_rollback_cleanup"] = cleanup_summary
                rollback_confirmed = bool(
                    cleanup.status_code == 200
                    and cleanup_summary.get("success") is True
                    and cleanup_summary.get("state") == "cleanup_complete"
                    and cleanup_summary.get("cleanup_terminal") == "prior_restored"
                    and cleanup_summary.get("lock_released") is True
                    and cleanup_summary.get("lock_absent_after") is True
                    and cleanup_summary.get("state_deleted") is True
                    and cleanup_summary.get("state_absent_after") is True
                    and cleanup_summary.get("helper_deleted") is True
                    and cleanup_summary.get("helper_absent_after") is True
                    and cleanup_summary.get("backup_removed") is True
                    and cleanup_summary.get("backup_verified_before") is True
                )
                if not rollback_confirmed:
                    raise RuntimeError("Rollback cleanup did not retire recovery material safely.")
            except Exception as rollback_error:  # noqa: BLE001
                evidence["checks"]["automatic_rollback_error"] = {
                    "type": type(rollback_error).__name__,
                    "message": str(rollback_error),
                }
    finally:
        if (
            client is not None
            and helper_id is not None
            and (
                (not prepare_attempted and not prepared)
                or helper_safe_to_retire
                or finalized
                or rollback_confirmed
            )
        ):
            try:
                evidence["checks"]["external_helper_cleanup_fallback"] = (
                    external_cleanup_fallback(
                        client, helper_id, helper_name, allowed_hashes
                    )
                )
            except Exception as cleanup_error:  # noqa: BLE001
                evidence["checks"]["external_helper_cleanup_fallback"] = {
                    "attempted": True,
                    "error": type(cleanup_error).__name__,
                }

    helper_absent = False
    helper_direct_absent = False
    route_absent = False
    lock_absent = False
    if client is not None and helper_id is not None:
        try:
            rows_after = client.all_snippets()
            helper_absent = not matching_snippets(rows_after, helper_id, helper_name)
            direct_after = client.get_snippet(helper_id)
            direct_summary = response_summary(direct_after)
            helper_direct_absent = bool(
                direct_after.status_code == 500
                and direct_summary.get("code") == "rest_cannot_get"
            )
            route_after = client.request(
                "POST",
                helper_route(route_base, "status"),
                json_body={},
                require_success=False,
            )
            route_summary = response_summary(route_after)
            route_absent = route_after.status_code == 404 and route_summary.get("code") == "rest_no_route"
            evidence["checks"]["final_helper_and_route_cleanup"] = {
                "helper_absent_from_collection": helper_absent,
                "direct_get": direct_summary,
                "direct_get_confirms_absence": helper_direct_absent,
                "route": route_summary,
                "route_absent": route_absent,
            }
            # Once the bridge is absent, a successful finalize/rollback callback is
            # the only authenticated proof that the CAS-owned lock was removed.
            terminal = evidence["checks"].get("terminal_cleanup_callback") or evidence[
                "checks"
            ].get("automatic_rollback_cleanup")
            lock_absent = bool(
                isinstance(terminal, dict)
                and terminal.get("lock_released") is True
                and terminal.get("lock_absent_after") is True
            )
        except Exception as verification_error:  # noqa: BLE001
            evidence["checks"]["final_cleanup_verification_error"] = {
                "type": type(verification_error).__name__
            }

    passed = bool(
        not execution_error
        and candidate_observed
        and finalized
        and helper_absent
        and helper_direct_absent
        and route_absent
        and lock_absent
    )
    requires_plugin_rollback = bool(
        candidate_install_attempted
        and not passed
        and not finalized
        and not rollback_confirmed
    )
    requires_control_plane_reconciliation = bool(
        control_plane_reconciliation_required
        or (
            not passed
            and not finalized
            and not rollback_confirmed
            and not safe_pre_mutation_failure
            and (prepare_attempted or prepared or live_state_ambiguous)
        )
    )
    evidence["state_reconciliation"] = {
        "prepare_attempted": prepare_attempted,
        "prepared": prepared,
        "mutation_attempted": mutation_attempted,
        "candidate_install_attempted": candidate_install_attempted,
        "candidate_observed": candidate_observed,
        "candidate_runtime_observed": candidate_observed,
        "finalized": finalized,
        "automatic_rollback_confirmed": rollback_confirmed,
        "helper_absent": helper_absent,
        "helper_direct_absent": helper_direct_absent,
        "route_absent": route_absent,
        "lock_absent": lock_absent,
        "status_reconciled": status_reconciled,
        "live_state_ambiguous": live_state_ambiguous,
        "safe_pre_mutation_failure": safe_pre_mutation_failure,
        "helper_safe_to_retire": helper_safe_to_retire,
        "requires_control_plane_reconciliation": requires_control_plane_reconciliation,
        "requires_plugin_rollback": requires_plugin_rollback,
        "preserved_helper_on_unknown_state": bool(
            live_state_ambiguous and not finalized and not rollback_confirmed
        ),
        "requires_uPress_recovery": requires_plugin_rollback,
    }
    evidence["passed"] = passed
    evidence["finished_at_utc"] = utc_now()
    output = save_evidence(args.output_dir.resolve(), run_id, evidence, secrets_to_remove)
    return (0 if passed else 3), output, redact(evidence, secrets_to_remove)


def main(argv: list[str] | None = None) -> int:
    effective = list(sys.argv[1:] if argv is None else argv)
    if effective == ["--self-test"]:
        try:
            print(json.dumps(deployment_contract_self_test(), ensure_ascii=False, indent=2))
            return 0
        except Exception as error:  # noqa: BLE001
            print(
                json.dumps(
                    {"passed": False, "error": type(error).__name__, "message": str(error)},
                    ensure_ascii=False,
                    indent=2,
                )
            )
            return 2

    try:
        import requests as requests_module
    except ModuleNotFoundError:
        print(json.dumps({"passed": False, "error": "MissingDependency", "message": "requests is required."}))
        return 2
    globals()["requests"] = requests_module

    args = parse_args(effective)
    try:
        exit_code, output, evidence = run(args)
    except Exception as error:  # argument/pre-evidence failure
        print(
            json.dumps(
                {"passed": False, "error": type(error).__name__, "message": str(error)},
                ensure_ascii=False,
                indent=2,
            )
        )
        return 2
    print(
        json.dumps(
            {
                "evidence": str(output),
                "passed": bool(evidence.get("passed")),
                "commit_sha": evidence.get("release", {}).get("protected_commit_sha"),
                "version": evidence.get("release", {}).get("version"),
                "rollback_zip": evidence.get("local_rollback", {}).get("rollback_zip"),
                "requires_uPress_recovery": evidence.get("state_reconciliation", {}).get(
                    "requires_uPress_recovery", False
                ),
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
