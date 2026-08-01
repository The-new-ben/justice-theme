#!/usr/bin/env python3
"""Fail-closed, one-shot submission of the approved Justice sitemap to GSC.

The default-safe mode is an explicit ``--dry-run``. A mutation is possible only
with ``--execute`` plus two fresh, SHA-256-pinned proofs: the exact passing
P0.1.2 live-acceptance report and its subsequent clean technical crawl summary.
The property and sitemap are constants and cannot be overridden from the CLI.
"""

from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


REPO_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = (
    REPO_ROOT.parents[1]
    if REPO_ROOT.parent.name == ".codex-tmp"
    else REPO_ROOT
)
PROPERTY_URL = "https://jus-tice.co.il/"
BASE_URL = "https://jus-tice.co.il"
SITEMAP_URL = "https://jus-tice.co.il/sitemap_index.xml"
P0_HEALTH_URL = (
    "https://jus-tice.co.il/wp-json/justice-seo-recovery/v1/healthcheck"
)
READONLY_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
WRITE_SCOPE = "https://www.googleapis.com/auth/webmasters"
PRIMARY_CREDENTIALS = WORKSPACE_ROOT / ".env.gsc-service-account.json"
FALLBACK_CREDENTIALS = (
    WORKSPACE_ROOT / "credentials" / "jus-tice-theme-a21ab27d03d2.json"
)
ALLOWED_LIVE_ACCEPTANCE_DIR = (
    WORKSPACE_ROOT
    / "reports"
    / "seo-recovery-2026-07-31"
    / "release-path"
    / "p0-live-acceptance-2026-08-01"
)
ALLOWED_TECHNICAL_SUMMARY_DIR = (
    WORKSPACE_ROOT
    / "reports"
    / "seo-recovery-2026-07-31"
    / "post-p0-0.1.2-crawl-2026-08-01"
)
OUTPUT_DIR = (
    WORKSPACE_ROOT
    / "reports"
    / "seo-recovery-2026-07-31"
    / "gsc"
    / "post-p0-2026-08-01"
)
MAX_EVIDENCE_AGE = timedelta(hours=3)
MAX_EVIDENCE_BYTES = 5 * 1024 * 1024
EXPECTED_SCHEMA_VERSION = 7
EXPECTED_CHECK_COUNT = 53
EXPECTED_PLUGIN_VERSION = "0.1.2"
EXPECTED_PLUGIN_MARKER = "p0-plugin-only-20260801-v3"
EXPECTED_THEME = "justice-theme"
EXPECTED_THEME_VERSION = "2.23.0"
EXPECTED_THEME_MARKER = "2026-07-06-home-keywords-upperfold-v1"
EXPECTED_RELEASE_CONTRACT = "plugin_only_with_unchanged_live_theme"
EXPECTED_SITEMAP_UNIQUE_URLS = 2827
EXPECTED_SITEMAP_CHILD_COUNT = 10
IDENTITY_FIELDS = ("client_email", "project_id", "client_id", "private_key_id")
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
EXPECTED_ORDERED_CHECK_IDS = (
    "exact_public_and_authenticated_site_identity",
    "public_theme_health_version_and_marker",
    "robots_direct_yoast_sitemap_only",
    "p0_health_version_and_marker",
    "mobile_nav_recovery_inline_css_present_exactly_once",
    "authenticated_context_edit_reads_all_profiles",
    "importer_target_profile_preconditions_are_exact",
    "quarantined_profiles_remain_direct_404",
    "approved_profile_remains_direct_200",
    "custom_rest_lawyer_sitemap_excludes_quarantined_profiles",
    "map_feed_structurally_excludes_quarantined_profiles",
    "public_json_structurally_excludes_quarantined_profiles_native_lawyer_collection",
    "public_json_structurally_excludes_quarantined_profiles_knowledge_professionals_all",
    "public_json_structurally_excludes_quarantined_profiles_knowledge_professionals_family_law",
    "public_json_structurally_excludes_quarantined_profiles_matched_lawyers_family_law",
    "every_yoast_lawyer_sitemap_excludes_quarantined_profiles",
    "yoast_shadow_article_7905_absent_lawyer_archive_present_once",
    "yoast_shadow_term_170_absent_category_730_present_once",
    "listing_excludes_quarantined_profiles_lawyers",
    "listing_excludes_quarantined_profiles_city_tel_aviv",
    "listing_excludes_quarantined_profiles_sitemap_jus_tice",
    "listing_excludes_quarantined_profiles_site_map",
    "representative_html_surface_excludes_quarantined_profiles_homepage",
    "representative_html_surface_excludes_quarantined_profiles_lawyers_area_family_law_city_tel_aviv",
    "representative_html_surface_excludes_quarantined_profiles_practice_areas_family_law",
    "representative_html_surface_excludes_quarantined_profiles_criminal_lawyer_jerusalem",
    "representative_html_surface_excludes_quarantined_profiles_real_estate_lawyer_haifa",
    "representative_html_surface_excludes_quarantined_profiles_inheritance_lawyer",
    "representative_html_surface_excludes_quarantined_profiles_real_estate_lawyer_guide",
    "representative_html_surface_excludes_quarantined_profiles_medical_malpractice_lawyer",
    "representative_html_surface_excludes_quarantined_profiles_family_dispute_resolution",
    "representative_html_surface_excludes_quarantined_profiles_divorce_property_division",
    "representative_html_surface_excludes_quarantined_profiles_child_custody",
    "representative_html_surface_excludes_quarantined_profiles_child_support",
    "representative_html_surface_excludes_quarantined_profiles_divorce_mediation",
    "representative_html_surface_excludes_quarantined_profiles_consensual_divorce",
    "representative_html_surface_excludes_quarantined_profiles_rabbinical_agreement_approval",
    "representative_html_surface_excludes_quarantined_profiles_lawyer_registration_claim_profile_id_23405",
    "self_canonical_and_og_mediation_divorce",
    "canonical_surface_excludes_quarantined_profiles_mediation_divorce",
    "self_canonical_and_og_immigration_to_portugal",
    "canonical_surface_excludes_quarantined_profiles_immigration_to_portugal",
    "self_canonical_and_og_news",
    "canonical_surface_excludes_quarantined_profiles_news",
    "self_canonical_and_og_practice_areas_child_support",
    "canonical_surface_excludes_quarantined_profiles_practice_areas_child_support",
    "self_canonical_and_og_practice_areas_family_law",
    "canonical_surface_excludes_quarantined_profiles_practice_areas_family_law",
    "direct_200_self_canonical_what_is_a_contract",
    "direct_200_self_canonical_criminal_record_deletion",
    "importer_route_schema_observed_without_invocation",
    "approved_profile_presence_preserved_where_previously_present",
    "mission_temporary_snippets_and_routes_absent",
)
CRITICAL_ZERO_SUMMARY_FIELDS = (
    "crawl_fetch_errors",
    "sitemap_child_failures",
    "sitemap_cross_canonical",
    "sitemap_duplicate_occurrences",
    "sitemap_missing_canonical",
    "sitemap_noindex",
    "sitemap_non_200",
    "sitemap_non_https_urls",
    "sitemap_query_urls",
    "sitemap_redirects",
    "sitemap_robots_blocked",
)


class GateError(RuntimeError):
    """A fail-closed precondition was not satisfied."""


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_text(value: datetime | None = None) -> str:
    return (value or utc_now()).astimezone(timezone.utc).isoformat().replace(
        "+00:00", "Z"
    )


def utc_slug(value: datetime | None = None) -> str:
    return (value or utc_now()).astimezone(timezone.utc).strftime(
        "%Y%m%dT%H%M%S%fZ"
    )


def parse_utc(value: Any, field: str) -> datetime:
    if not isinstance(value, str) or not value:
        raise GateError(f"{field} must be a non-empty UTC timestamp.")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise GateError(f"{field} is not a valid ISO-8601 timestamp.") from exc
    if parsed.tzinfo is None:
        raise GateError(f"{field} must include a timezone.")
    return parsed.astimezone(timezone.utc)


def reject_duplicate_keys(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    output: dict[str, Any] = {}
    for key, value in pairs:
        if key in output:
            raise GateError(f"Duplicate JSON key rejected: {key}")
        output[key] = value
    return output


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def safe_error(exc: Exception) -> dict[str, Any]:
    status = None
    reason = str(exc)
    if isinstance(exc, HttpError):
        status = getattr(exc.resp, "status", None)
        try:
            reason = exc._get_reason()
        except Exception:
            reason = type(exc).__name__
    reason = re.sub(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+", "[redacted-email]", reason
    )
    reason = re.sub(r"(?i)bearer\s+[^\s,;]+", "Bearer [redacted]", reason)
    reason = re.sub(
        r"-----BEGIN [^-]+-----.*?-----END [^-]+-----",
        "[redacted-key]",
        reason,
        flags=re.DOTALL,
    )
    return {
        "type": type(exc).__name__,
        "http_status": status,
        "reason": reason.replace("\r", " ").replace("\n", " ")[:600],
    }


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate all gates and list GSC state without submitting.",
    )
    mode.add_argument(
        "--execute",
        action="store_true",
        help="Permit the one exact sitemap.submit call after all gates pass.",
    )
    parser.add_argument(
        "--expected-live-acceptance-evidence",
        type=Path,
        required=True,
        help="Exact schema-7 P0.1.2 post-release live-acceptance JSON report.",
    )
    parser.add_argument(
        "--expected-live-acceptance-sha256",
        required=True,
        help="Exact SHA-256 of the P0.1.2 live-acceptance report.",
    )
    parser.add_argument(
        "--expected-technical-summary-evidence",
        type=Path,
        required=True,
        help="Exact fresh post-P0.1.2 technical-summary.json crawl report.",
    )
    parser.add_argument(
        "--expected-technical-summary-sha256",
        required=True,
        help="Exact SHA-256 of the post-P0.1.2 technical summary.",
    )
    return parser.parse_args(argv)


def load_pinned_json(
    path: Path,
    expected_sha256: str,
    *,
    allowed_dir: Path,
    filename_pattern: str,
    label: str,
) -> tuple[dict[str, Any], Path, str, int]:
    expected_sha256 = expected_sha256.strip().lower()
    if not SHA256_RE.fullmatch(expected_sha256):
        raise GateError(f"The expected {label} SHA-256 is not 64 lowercase hex.")

    allowed = allowed_dir.resolve()
    resolved = path.expanduser().resolve()
    if resolved.parent != allowed:
        raise GateError(f"{label.capitalize()} is outside the approved directory.")
    if path.is_symlink() or not resolved.is_file():
        raise GateError(f"{label.capitalize()} must be a regular non-symlink file.")
    if not re.fullmatch(filename_pattern, resolved.name):
        raise GateError(f"{label.capitalize()} filename is not approved.")
    size = resolved.stat().st_size
    if size <= 0 or size > MAX_EVIDENCE_BYTES:
        raise GateError(f"{label.capitalize()} has an invalid size.")

    raw = resolved.read_bytes()
    actual_sha256 = sha256_bytes(raw)
    if not hmac.compare_digest(actual_sha256, expected_sha256):
        raise GateError(f"{label.capitalize()} SHA-256 does not match exactly.")
    try:
        report = json.loads(raw.decode("utf-8"), object_pairs_hook=reject_duplicate_keys)
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise GateError(f"{label.capitalize()} is not valid UTF-8 JSON.") from exc
    if not isinstance(report, dict):
        raise GateError(f"{label.capitalize()} root must be an object.")
    return report, resolved, actual_sha256, size


def evidence_label(resolved: Path) -> str:
    try:
        return resolved.relative_to(WORKSPACE_ROOT).as_posix()
    except ValueError:
        # Used only by dependency-injected unit tests with temporary directories.
        return resolved.name


def validate_live_acceptance_evidence(
    path: Path,
    expected_sha256: str,
    *,
    now: datetime | None = None,
    allowed_dir: Path = ALLOWED_LIVE_ACCEPTANCE_DIR,
) -> dict[str, Any]:
    now = (now or utc_now()).astimezone(timezone.utc)
    report, resolved, actual_sha256, size = load_pinned_json(
        path,
        expected_sha256,
        allowed_dir=allowed_dir,
        filename_pattern=r"p0-live-post-\d{8}T\d{6}Z\.json",
        label="live-acceptance evidence",
    )

    if (
        type(report.get("schema_version")) is not int
        or report.get("schema_version") != EXPECTED_SCHEMA_VERSION
    ):
        raise GateError("Live-acceptance evidence must use exact schema version 7.")
    if report.get("expect") != "post":
        raise GateError("Live-acceptance evidence is not a post-condition report.")
    if report.get("base_url") != BASE_URL:
        raise GateError("Live-acceptance evidence targets the wrong base URL.")
    overall = report.get("overall")
    if not isinstance(overall, dict):
        raise GateError("Live-acceptance evidence is missing overall status.")
    if overall.get("passed") is not True or overall.get("status") != "passed":
        raise GateError("Live-acceptance evidence did not pass.")
    if overall.get("enforced_failures") != []:
        raise GateError("Live-acceptance evidence contains enforced failures.")
    if overall.get("observed_post_condition_failures") != []:
        raise GateError("Live-acceptance evidence contains observed post failures.")

    completed = parse_utc(report.get("completed_at_utc"), "completed_at_utc")
    generated = parse_utc(report.get("generated_at_utc"), "generated_at_utc")
    if completed < generated:
        raise GateError("Live-acceptance completion predates generation.")
    if completed > now + timedelta(minutes=5):
        raise GateError("Live-acceptance completion is implausibly in the future.")
    if now - completed > MAX_EVIDENCE_AGE:
        raise GateError("Live-acceptance evidence is older than the three-hour gate.")

    checks = report.get("checks")
    if not isinstance(checks, list) or len(checks) != EXPECTED_CHECK_COUNT:
        raise GateError("Live-acceptance evidence must contain exactly 53 checks.")
    ids: list[str] = []
    for check in checks:
        if not isinstance(check, dict):
            raise GateError("Every live-acceptance check must be an object.")
        check_id = check.get("id")
        if not isinstance(check_id, str) or not check_id:
            raise GateError("Every live-acceptance check must have an ID.")
        ids.append(check_id)
        if check.get("enforced") is not True or check.get("passed") is not True:
            raise GateError(f"Live-acceptance check did not pass: {check_id}")
    if len(ids) != len(set(ids)):
        raise GateError("Live-acceptance check IDs are not unique.")
    if tuple(ids) != EXPECTED_ORDERED_CHECK_IDS:
        raise GateError("Live-acceptance check IDs are not the exact ordered contract.")

    config = report.get("configuration")
    if not isinstance(config, dict):
        raise GateError("Live-acceptance evidence is missing release configuration.")
    required_config = {
        "target_base_url": BASE_URL,
        "expected_robots_sitemap_url": SITEMAP_URL,
        "required_plugin_version": EXPECTED_PLUGIN_VERSION,
        "required_plugin_marker": EXPECTED_PLUGIN_MARKER,
        "required_unchanged_live_theme": EXPECTED_THEME,
        "required_unchanged_live_theme_version": EXPECTED_THEME_VERSION,
        "required_unchanged_live_theme_marker": EXPECTED_THEME_MARKER,
        "release_contract": EXPECTED_RELEASE_CONTRACT,
    }
    for key, expected in required_config.items():
        if config.get(key) != expected:
            raise GateError(f"Live-acceptance configuration mismatch: {key}")

    observations = report.get("observations")
    if not isinstance(observations, dict):
        raise GateError("Live-acceptance evidence is missing observations.")
    health = observations.get("health")
    if not isinstance(health, dict):
        raise GateError("Live-acceptance evidence is missing plugin health.")
    health_request = health.get("request")
    if (
        health.get("version") != EXPECTED_PLUGIN_VERSION
        or health.get("marker") != EXPECTED_PLUGIN_MARKER
        or not isinstance(health_request, dict)
        or health_request.get("status") != 200
        or health_request.get("requested_url") != P0_HEALTH_URL
        or health_request.get("final_url") != P0_HEALTH_URL
        or health_request.get("redirects") != []
    ):
        raise GateError(
            "Live-acceptance evidence does not prove exact direct P0.1.2 health."
        )
    yoast = observations.get("sitemaps", {}).get("yoast", {})
    index_request = yoast.get("index_request", {})
    if (
        index_request.get("status") != 200
        or index_request.get("requested_url") != SITEMAP_URL
        or index_request.get("final_url") != SITEMAP_URL
        or index_request.get("redirects") != []
        or yoast.get("index_xml_error") is not None
        or type(yoast.get("index_loc_count")) is not int
        or yoast.get("index_loc_count") != EXPECTED_SITEMAP_CHILD_COUNT
    ):
        raise GateError(
            "Live-acceptance evidence does not prove a direct valid sitemap index."
        )

    robots = observations.get("robots", {}).get("authoritative", {})
    directives = robots.get("sitemap_directives")
    if (
        robots.get("request", {}).get("status") != 200
        or robots.get("sitemap_directive_count") != 1
        or not isinstance(directives, list)
        or len(directives) != 1
        or directives[0].get("value") != SITEMAP_URL
    ):
        raise GateError(
            "Live-acceptance evidence does not prove the exact robots sitemap."
        )

    return {
        "relative_path": evidence_label(resolved),
        "sha256": actual_sha256,
        "bytes": size,
        "schema_version": report["schema_version"],
        "generated_at_utc": report["generated_at_utc"],
        "completed_at_utc": report["completed_at_utc"],
        "age_seconds_at_gate": round((now - completed).total_seconds(), 3),
        "overall_status": overall["status"],
        "check_count": len(checks),
        "all_checks_enforced_and_passed": True,
        "plugin_version_observed": health["version"],
        "plugin_marker_observed": health["marker"],
        "sitemap_index_status": index_request["status"],
        "sitemap_index_sha256": index_request.get("sha256"),
        "secret_material_recorded": False,
    }


def require_exact_int(
    report: dict[str, Any], field: str, expected: int, *, label: str
) -> None:
    value = report.get(field)
    if type(value) is not int or value != expected:
        raise GateError(f"{label.capitalize()} requires {field} == {expected}.")


def validate_technical_summary_evidence(
    path: Path,
    expected_sha256: str,
    *,
    acceptance_completed_at: str,
    now: datetime | None = None,
    allowed_dir: Path = ALLOWED_TECHNICAL_SUMMARY_DIR,
) -> dict[str, Any]:
    now = (now or utc_now()).astimezone(timezone.utc)
    report, resolved, actual_sha256, size = load_pinned_json(
        path,
        expected_sha256,
        allowed_dir=allowed_dir,
        filename_pattern=r"technical-summary\.json",
        label="technical summary",
    )
    if report.get("base_url") != PROPERTY_URL:
        raise GateError("Technical summary targets the wrong base URL.")

    generated = parse_utc(report.get("generated_at_utc"), "generated_at_utc")
    acceptance_completed = parse_utc(
        acceptance_completed_at, "acceptance_completed_at_utc"
    )
    if generated < acceptance_completed:
        raise GateError(
            "Technical summary predates the accepted P0.1.2 live condition."
        )
    if generated > now + timedelta(minutes=5):
        raise GateError("Technical summary generation is implausibly in the future.")
    if now - generated > MAX_EVIDENCE_AGE:
        raise GateError("Technical summary is older than the three-hour gate.")

    for field in CRITICAL_ZERO_SUMMARY_FIELDS:
        require_exact_int(report, field, 0, label="technical summary")
    require_exact_int(
        report,
        "sitemap_child_count",
        EXPECTED_SITEMAP_CHILD_COUNT,
        label="technical summary",
    )
    for field in (
        "sitemap_url_occurrences",
        "sitemap_unique_urls",
        "sitemap_indexable",
    ):
        require_exact_int(
            report,
            field,
            EXPECTED_SITEMAP_UNIQUE_URLS,
            label="technical summary",
        )

    return {
        "relative_path": evidence_label(resolved),
        "sha256": actual_sha256,
        "bytes": size,
        "generated_at_utc": report["generated_at_utc"],
        "age_seconds_at_gate": round((now - generated).total_seconds(), 3),
        "not_before_live_acceptance_completed_at_utc": acceptance_completed_at,
        "sitemap_child_count": report["sitemap_child_count"],
        "sitemap_child_failures": report["sitemap_child_failures"],
        "sitemap_url_occurrences": report["sitemap_url_occurrences"],
        "sitemap_unique_urls": report["sitemap_unique_urls"],
        "sitemap_indexable": report["sitemap_indexable"],
        "sitemap_direct_200_inferred": EXPECTED_SITEMAP_UNIQUE_URLS,
        "critical_zero_fields": {
            field: report[field] for field in CRITICAL_ZERO_SUMMARY_FIELDS
        },
        "all_critical_sitemap_gates_zero": True,
        "secret_material_recorded": False,
    }


def revalidate_submission_evidence(
    live_acceptance_path: Path,
    live_acceptance_sha256: str,
    technical_summary_path: Path,
    technical_summary_sha256: str,
    initial_live_acceptance: dict[str, Any],
    initial_technical_summary: dict[str, Any],
    *,
    now: datetime | None = None,
    live_allowed_dir: Path = ALLOWED_LIVE_ACCEPTANCE_DIR,
    technical_allowed_dir: Path = ALLOWED_TECHNICAL_SUMMARY_DIR,
) -> dict[str, Any]:
    """Reread and revalidate both pinned proofs at the mutation boundary."""

    checked_at = (now or utc_now()).astimezone(timezone.utc)
    live_acceptance = validate_live_acceptance_evidence(
        live_acceptance_path,
        live_acceptance_sha256,
        now=checked_at,
        allowed_dir=live_allowed_dir,
    )
    technical_summary = validate_technical_summary_evidence(
        technical_summary_path,
        technical_summary_sha256,
        acceptance_completed_at=live_acceptance["completed_at_utc"],
        now=checked_at,
        allowed_dir=technical_allowed_dir,
    )

    for label, initial, current in (
        ("live acceptance", initial_live_acceptance, live_acceptance),
        ("technical summary", initial_technical_summary, technical_summary),
    ):
        for field in ("relative_path", "sha256", "bytes"):
            if current.get(field) != initial.get(field):
                raise GateError(
                    f"Immediate {label} identity changed after the initial gate."
                )

    return {
        "checked_at_utc": utc_text(checked_at),
        "live_acceptance": live_acceptance,
        "technical_summary": technical_summary,
        "both_files_reread": True,
        "both_sha256_pins_rechecked": True,
        "freshness_rechecked_at_mutation_boundary": True,
    }


def credential_identity(data: dict[str, Any]) -> tuple[str, ...]:
    values = tuple(str(data.get(field, "")) for field in IDENTITY_FIELDS)
    if any(not value for value in values):
        raise GateError("Service-account identity fields are incomplete.")
    return values


def load_validated_credentials(scope: str) -> tuple[Any, dict[str, Any]]:
    if scope not in (READONLY_SCOPE, WRITE_SCOPE):
        raise GateError("Unexpected Google authorization scope.")
    if not PRIMARY_CREDENTIALS.is_file():
        raise GateError("The requested ignored service-account file is absent.")
    primary_data = json.loads(PRIMARY_CREDENTIALS.read_text(encoding="utf-8"))
    primary_identity = credential_identity(primary_data)
    identity_fingerprint = hashlib.sha256(
        "\0".join(primary_identity).encode("utf-8")
    ).hexdigest()
    try:
        credentials = service_account.Credentials.from_service_account_file(
            str(PRIMARY_CREDENTIALS), scopes=[scope]
        )
        evidence = {
            "requested_source": PRIMARY_CREDENTIALS.name,
            "requested_source_google_parse_ok": True,
            "actual_source": PRIMARY_CREDENTIALS.name,
            "same_service_account_identity": True,
        }
    except ValueError:
        if not FALLBACK_CREDENTIALS.is_file():
            raise GateError("Requested service-account private key is invalid.")
        fallback_data = json.loads(FALLBACK_CREDENTIALS.read_text(encoding="utf-8"))
        if credential_identity(fallback_data) != primary_identity:
            raise GateError("Valid fallback does not match the requested account identity.")
        credentials = service_account.Credentials.from_service_account_file(
            str(FALLBACK_CREDENTIALS), scopes=[scope]
        )
        evidence = {
            "requested_source": PRIMARY_CREDENTIALS.name,
            "requested_source_google_parse_ok": False,
            "requested_source_error": "Invalid private key",
            "actual_source": FALLBACK_CREDENTIALS.relative_to(
                WORKSPACE_ROOT
            ).as_posix(),
            "same_service_account_identity": True,
        }
    evidence.update(
        {
            "identity_fields_compared": list(IDENTITY_FIELDS),
            "identity_fingerprint_sha256": identity_fingerprint,
            "scope": scope,
            "identity_values_recorded": False,
            "secret_fields_recorded": False,
        }
    )
    return credentials, evidence


def api_execute(request: Any) -> dict[str, Any]:
    result = request.execute(num_retries=0)
    return result if isinstance(result, dict) else {}


def property_access(service: Any) -> dict[str, Any]:
    sites = api_execute(service.sites().list()).get("siteEntry", [])
    match = next(
        (item for item in sites if item.get("siteUrl") == PROPERTY_URL), None
    )
    return {
        "property": PROPERTY_URL,
        "accessible": match is not None,
        "permission_level": match.get("permissionLevel") if match else None,
        "site_owner": bool(match and match.get("permissionLevel") == "siteOwner"),
        "accessible_property_count": len(sites),
        "other_property_urls_recorded": False,
    }


def select_sitemap(item: dict[str, Any]) -> dict[str, Any]:
    return {
        key: item.get(key)
        for key in (
            "path",
            "lastSubmitted",
            "isPending",
            "isSitemapsIndex",
            "type",
            "lastDownloaded",
            "warnings",
            "errors",
            "contents",
        )
        if key in item
    }


def sitemap_state(service: Any) -> dict[str, Any]:
    response = api_execute(service.sitemaps().list(siteUrl=PROPERTY_URL))
    items = [select_sitemap(item) for item in response.get("sitemap", [])]
    return {
        "count": len(items),
        "exact_target_present": any(item.get("path") == SITEMAP_URL for item in items),
        "items": items,
    }


def base_record(
    mode: str,
    live_acceptance_evidence: dict[str, Any],
    technical_summary_evidence: dict[str, Any],
    credentials_evidence: dict[str, Any],
) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "generated_at": utc_text(),
        "operation": "one_shot_gsc_sitemap_submission",
        "mode": mode,
        "exact_property": PROPERTY_URL,
        "exact_sitemap": SITEMAP_URL,
        "live_acceptance_gate": live_acceptance_evidence,
        "technical_summary_gate": technical_summary_evidence,
        "credentials": credentials_evidence,
        "mutation": {
            "explicit_execute_flag": mode == "execute",
            "submit_call_count": 0,
            "mutation_performed": False,
            "state": "not_started",
        },
        "credentials_or_tokens_recorded": False,
    }


def write_json_atomic(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    payload = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    try:
        with temporary.open("x", encoding="utf-8", newline="\n") as handle:
            handle.write(payload)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def write_json_exclusive(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    with path.open("x", encoding="utf-8", newline="\n") as handle:
        handle.write(payload)
        handle.flush()
        os.fsync(handle.fileno())


def timestamped_path(output_dir: Path, label: str) -> Path:
    return output_dir / f"gsc-sitemap-submit-{label}-{utc_slug()}.json"


def one_shot_path(output_dir: Path) -> Path:
    target_key = hashlib.sha256(
        f"{PROPERTY_URL}\n{SITEMAP_URL}".encode("utf-8")
    ).hexdigest()[:16]
    return output_dir / f"gsc-sitemap-submit-once-{target_key}.json"


def run_dry(
    service: Any,
    record: dict[str, Any],
    *,
    output_dir: Path = OUTPUT_DIR,
) -> tuple[int, Path, dict[str, Any]]:
    access = property_access(service)
    if not access["site_owner"]:
        raise GateError("Exact GSC property is not accessible as siteOwner.")
    record["property_access"] = access
    before = sitemap_state(service)
    record["sitemaps_before"] = before
    if before["count"] != 0:
        raise GateError("The GSC property must have zero existing sitemap submissions.")
    record["mutation"].update(
        {
            "state": "dry_run_complete",
            "mutation_performed": False,
            "submit_call_count": 0,
        }
    )
    record["completed_at"] = utc_text()
    path = timestamped_path(output_dir, "dry-run")
    write_json_exclusive(path, record)
    return 0, path, record


def run_execute(
    service: Any,
    record: dict[str, Any],
    *,
    revalidate_evidence: Callable[[], dict[str, Any]],
    output_dir: Path = OUTPUT_DIR,
    after_submit_hook: Callable[[], None] | None = None,
) -> tuple[int, Path, dict[str, Any]]:
    journal = one_shot_path(output_dir)
    if journal.exists():
        raise GateError("The one-shot journal already exists; submission is blocked.")

    initial_access = property_access(service)
    if not initial_access["site_owner"]:
        raise GateError("Exact GSC property is not accessible as siteOwner.")
    before = sitemap_state(service)
    record["property_access_initial"] = initial_access
    record["sitemaps_before"] = before
    if before["exact_target_present"]:
        record["mutation"].update(
            {
                "state": "already_present_no_submit",
                "mutation_performed": False,
                "submit_call_count": 0,
            }
        )
        record["completed_at"] = utc_text()
        path = timestamped_path(output_dir, "already-present")
        write_json_exclusive(path, record)
        return 3, path, record
    if before["count"] != 0:
        raise GateError("The GSC property must have zero existing sitemap submissions.")

    record["mutation"]["state"] = "armed_one_shot"
    record["one_shot_journal"] = journal.name
    write_json_exclusive(journal, record)

    immediate_access: dict[str, Any] | None = None
    submit_error: dict[str, Any] | None = None
    after: dict[str, Any] | None = None
    try:
        immediate_access = property_access(service)
        record["property_access_immediately_before_submit"] = immediate_access
        if not immediate_access["site_owner"]:
            record["mutation"]["state"] = "permission_recheck_failed"
            raise GateError("Immediate siteOwner verification failed; no submit call made.")

        immediate_sitemaps = sitemap_state(service)
        record["sitemaps_immediately_before_submit"] = immediate_sitemaps
        if immediate_sitemaps["count"] != 0:
            record["mutation"]["state"] = "sitemap_recheck_failed"
            raise GateError(
                "Immediate zero-existing-submissions verification failed; "
                "no submit call made."
            )

        try:
            immediate_evidence = revalidate_evidence()
            if not isinstance(immediate_evidence, dict):
                raise GateError(
                    "Immediate evidence revalidation returned an invalid record."
                )
            record["evidence_revalidated_immediately_before_submit"] = (
                immediate_evidence
            )
        except Exception:
            record["mutation"]["state"] = "evidence_recheck_failed"
            raise

        # This is the sole mutation call. There is intentionally no retry.
        record["mutation"]["submit_call_count"] = 1
        record["mutation"]["state"] = "submit_call_dispatched"
        api_execute(
            service.sitemaps().submit(
                siteUrl=PROPERTY_URL,
                feedpath=SITEMAP_URL,
            )
        )
        record["mutation"]["mutation_performed"] = True
        record["mutation"]["state"] = "submit_response_success"
        if after_submit_hook is not None:
            after_submit_hook()
    except Exception as exc:
        submit_error = safe_error(exc)
        record["mutation"]["mutation_performed"] = (
            False if record["mutation"]["submit_call_count"] == 0 else None
        )
        if record["mutation"]["submit_call_count"] == 0:
            if record["mutation"]["state"] not in (
                "permission_recheck_failed",
                "sitemap_recheck_failed",
                "evidence_recheck_failed",
            ):
                record["mutation"]["state"] = "pre_submit_gate_failed"
        else:
            record["mutation"]["state"] = "submit_result_ambiguous"
        record["mutation"]["error"] = submit_error

    try:
        after = sitemap_state(service)
        record["sitemaps_after"] = after
    except Exception as exc:
        record["sitemaps_after_error"] = safe_error(exc)

    target_present = bool(after and after.get("exact_target_present"))
    if record["mutation"]["submit_call_count"] == 1 and submit_error is None and target_present:
        record["outcome"] = "submitted_once_and_listed_after"
        exit_code = 0
    elif record["mutation"]["submit_call_count"] == 1 and target_present:
        record["outcome"] = "target_listed_after_ambiguous_submit_response"
        exit_code = 4
    elif record["mutation"]["submit_call_count"] == 0:
        record["outcome"] = "blocked_before_submit"
        exit_code = 2
    else:
        record["outcome"] = "submit_not_verified_after_single_attempt"
        exit_code = 4
    record["completed_at"] = utc_text()
    write_json_atomic(journal, record)
    return exit_code, journal, record


def write_rejection(
    mode: str,
    error: Exception,
    *,
    output_dir: Path = OUTPUT_DIR,
) -> Path:
    record = {
        "schema_version": 1,
        "generated_at": utc_text(),
        "completed_at": utc_text(),
        "operation": "one_shot_gsc_sitemap_submission",
        "mode": mode,
        "exact_property": PROPERTY_URL,
        "exact_sitemap": SITEMAP_URL,
        "outcome": "rejected_fail_closed",
        "error": safe_error(error),
        "mutation": {
            "explicit_execute_flag": mode == "execute",
            "submit_call_count": 0,
            "mutation_performed": False,
            "state": "rejected",
        },
        "credentials_or_tokens_recorded": False,
    }
    path = timestamped_path(output_dir, "rejected")
    write_json_exclusive(path, record)
    return path


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    mode = "execute" if args.execute else "dry-run"
    try:
        live_acceptance = validate_live_acceptance_evidence(
            args.expected_live_acceptance_evidence,
            args.expected_live_acceptance_sha256,
        )
        technical_summary = validate_technical_summary_evidence(
            args.expected_technical_summary_evidence,
            args.expected_technical_summary_sha256,
            acceptance_completed_at=live_acceptance["completed_at_utc"],
        )
        scope = WRITE_SCOPE if args.execute else READONLY_SCOPE
        credentials, credentials_evidence = load_validated_credentials(scope)
        service = build(
            "searchconsole",
            "v1",
            credentials=credentials,
            cache_discovery=False,
        )
        record = base_record(
            mode,
            live_acceptance,
            technical_summary,
            credentials_evidence,
        )
        if args.execute:
            code, path, result = run_execute(
                service,
                record,
                revalidate_evidence=lambda: revalidate_submission_evidence(
                    args.expected_live_acceptance_evidence,
                    args.expected_live_acceptance_sha256,
                    args.expected_technical_summary_evidence,
                    args.expected_technical_summary_sha256,
                    live_acceptance,
                    technical_summary,
                ),
            )
        else:
            code, path, result = run_dry(service, record)
        print(
            json.dumps(
                {
                    "outcome": result.get("outcome")
                    or result.get("mutation", {}).get("state"),
                    "evidence": str(path),
                    "submit_call_count": result["mutation"]["submit_call_count"],
                    "mutation_performed": result["mutation"]["mutation_performed"],
                },
                ensure_ascii=True,
            )
        )
        return code
    except Exception as exc:
        path = write_rejection(mode, exc)
        print(
            json.dumps(
                {
                    "outcome": "rejected_fail_closed",
                    "evidence": str(path),
                    "submit_call_count": 0,
                    "mutation_performed": False,
                    "error": safe_error(exc),
                },
                ensure_ascii=True,
            ),
            file=sys.stderr,
        )
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
