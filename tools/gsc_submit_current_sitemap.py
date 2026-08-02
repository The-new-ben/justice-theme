#!/usr/bin/env python3
"""Fail-closed submission gate for the current Justice sitemap evidence.

The exact GSC property, sitemap, crawl summary path, and expected inventory are
constants. The operator must pin the current summary SHA-256 on the command
line. Dry-run is read-only. Execute delegates the sole mutation and all GSC
race checks to gsc_submit_clean_sitemap.run_execute.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable
from urllib.parse import urlsplit

import requests
from googleapiclient.discovery import build

import gsc_submit_clean_sitemap as clean


PROPERTY_URL = "https://jus-tice.co.il/"
BASE_URL = "https://jus-tice.co.il/"
SITEMAP_URL = "https://jus-tice.co.il/sitemap_index.xml"
ROBOTS_URL = "https://jus-tice.co.il/robots.txt"
EXPECTED_CHILD_COUNT = 10
EXPECTED_URL_COUNT = 2827
MAX_EVIDENCE_AGE = timedelta(hours=3)
MAX_FUTURE_SKEW = timedelta(minutes=5)
MAX_PUBLIC_RESPONSE_BYTES = 2 * 1024 * 1024
HTTP_TIMEOUT_SECONDS = 30
XML_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9"
AUDIT_USER_AGENT = "JusticeGscSubmissionGate/1.0 (+https://jus-tice.co.il/)"
CRITICAL_ZERO_FIELDS = (
    "crawl_fetch_errors",
    "sitemap_child_failures",
    "sitemap_duplicate_occurrences",
    "sitemap_cross_canonical",
    "sitemap_missing_canonical",
    "sitemap_noindex",
    "sitemap_non_200",
    "sitemap_non_https_urls",
    "sitemap_query_urls",
    "sitemap_redirects",
    "sitemap_robots_blocked",
)
SUMMARY_DIR = (
    clean.WORKSPACE_ROOT
    / "reports"
    / "seo-recovery-2026-07-31"
    / "gsc-sitemap-submission-2026-08-02"
    / "full-live-audit"
)
SUMMARY_PATH = SUMMARY_DIR / "technical-summary.json"
OUTPUT_DIR = (
    clean.WORKSPACE_ROOT
    / "reports"
    / "seo-recovery-2026-07-31"
    / "gsc-sitemap-submission-2026-08-02"
    / "submission-evidence"
)


class GateError(clean.GateError):
    """A current-evidence submission precondition was not satisfied."""


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true")
    mode.add_argument("--execute", action="store_true")
    parser.add_argument(
        "--expected-technical-summary-evidence",
        type=Path,
        required=True,
        help="Must be the one fixed current full-crawl technical summary path.",
    )
    parser.add_argument(
        "--expected-technical-summary-sha256",
        required=True,
        help="Exact lowercase SHA-256 of that summary.",
    )
    return parser.parse_args(argv)


def validate_underlying_contract() -> None:
    expected = {
        "PROPERTY_URL": PROPERTY_URL,
        "SITEMAP_URL": SITEMAP_URL,
        "READONLY_SCOPE": "https://www.googleapis.com/auth/webmasters.readonly",
        "WRITE_SCOPE": "https://www.googleapis.com/auth/webmasters",
    }
    for name, value in expected.items():
        if getattr(clean, name, None) != value:
            raise GateError(f"Underlying submission contract mismatch: {name}.")
    if clean.BASE_URL.rstrip("/") + "/" != BASE_URL:
        raise GateError("Underlying submission contract mismatch: BASE_URL.")


def require_exact_int(report: dict[str, Any], field: str, expected: int) -> None:
    value = report.get(field)
    if type(value) is not int or value != expected:
        raise GateError(f"Technical summary requires {field} == {expected}.")


def validate_summary(
    path: Path,
    expected_sha256: str,
    *,
    now: datetime | None = None,
    required_path: Path = SUMMARY_PATH,
) -> dict[str, Any]:
    checked_at = (now or clean.utc_now()).astimezone(timezone.utc)
    required = required_path.resolve()
    supplied = path.expanduser().resolve()
    if supplied != required:
        raise GateError("Technical summary path is not the exact approved path.")

    report, resolved, actual_sha256, size = clean.load_pinned_json(
        path,
        expected_sha256,
        allowed_dir=required.parent,
        filename_pattern=r"technical-summary\.json",
        label="current technical summary",
    )
    if report.get("base_url") != BASE_URL:
        raise GateError("Technical summary targets the wrong base URL.")

    generated = clean.parse_utc(report.get("generated_at_utc"), "generated_at_utc")
    if generated > checked_at + MAX_FUTURE_SKEW:
        raise GateError("Technical summary generation is implausibly in the future.")
    if checked_at - generated > MAX_EVIDENCE_AGE:
        raise GateError("Technical summary is older than the three-hour gate.")

    require_exact_int(report, "sitemap_child_count", EXPECTED_CHILD_COUNT)
    for field in (
        "sitemap_url_occurrences",
        "sitemap_unique_urls",
        "sitemap_indexable",
    ):
        require_exact_int(report, field, EXPECTED_URL_COUNT)
    for field in CRITICAL_ZERO_FIELDS:
        require_exact_int(report, field, 0)

    return {
        "relative_path": clean.evidence_label(resolved),
        "sha256": actual_sha256,
        "bytes": size,
        "generated_at_utc": report["generated_at_utc"],
        "checked_at_utc": clean.utc_text(checked_at),
        "age_seconds_at_gate": round((checked_at - generated).total_seconds(), 3),
        "exact_base": BASE_URL,
        "exact_property": PROPERTY_URL,
        "exact_sitemap": SITEMAP_URL,
        "sitemap_child_count": EXPECTED_CHILD_COUNT,
        "sitemap_url_occurrences": EXPECTED_URL_COUNT,
        "sitemap_unique_urls": EXPECTED_URL_COUNT,
        "sitemap_indexable": EXPECTED_URL_COUNT,
        "critical_zero_fields": {field: 0 for field in CRITICAL_ZERO_FIELDS},
        "all_current_summary_gates_passed": True,
        "secret_material_recorded": False,
    }


def response_bytes(response: Any, label: str) -> bytes:
    content = response.content
    if not isinstance(content, bytes):
        raise GateError(f"{label} response content is not bytes.")
    if not content or len(content) > MAX_PUBLIC_RESPONSE_BYTES:
        raise GateError(f"{label} response size is outside the approved range.")
    return content


def require_direct_200(response: Any, expected_url: str, label: str) -> None:
    if response.status_code != 200:
        raise GateError(f"{label} did not return direct HTTP 200.")
    if response.url != expected_url:
        raise GateError(f"{label} final URL is not exact.")
    if getattr(response, "history", None):
        raise GateError(f"{label} followed a redirect.")


def parse_robots_sitemaps(raw: bytes) -> list[str]:
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise GateError("robots.txt is not valid UTF-8 text.") from exc
    values: list[str] = []
    for line in text.splitlines():
        without_comment = line.split("#", 1)[0].strip()
        match = re.match(r"(?i)^sitemap\s*:\s*(\S+)\s*$", without_comment)
        if match:
            values.append(match.group(1))
    return values


def validate_sitemap_index_xml(raw: bytes) -> list[str]:
    upper = raw.upper()
    if b"<!DOCTYPE" in upper or b"<!ENTITY" in upper:
        raise GateError("Sitemap index contains a forbidden declaration.")
    try:
        root = ET.fromstring(raw)
    except ET.ParseError as exc:
        raise GateError("Sitemap index is not valid XML.") from exc
    if root.tag != f"{{{XML_NAMESPACE}}}sitemapindex":
        raise GateError("Sitemap XML root is not the exact sitemapindex type.")

    expected_child_tag = f"{{{XML_NAMESPACE}}}sitemap"
    expected_loc_tag = f"{{{XML_NAMESPACE}}}loc"
    children = list(root)
    if len(children) != EXPECTED_CHILD_COUNT:
        raise GateError("Live sitemap index does not contain exactly 10 children.")
    urls: list[str] = []
    for child in children:
        if child.tag != expected_child_tag:
            raise GateError("Sitemap index contains an unexpected child element.")
        locs = child.findall(expected_loc_tag)
        if len(locs) != 1 or not isinstance(locs[0].text, str):
            raise GateError("Each child sitemap must contain one non-empty loc.")
        url = locs[0].text.strip()
        parts = urlsplit(url)
        if (
            parts.scheme != "https"
            or parts.netloc != "jus-tice.co.il"
            or not parts.path.endswith(".xml")
            or parts.query
            or parts.fragment
        ):
            raise GateError("Child sitemap URL is outside the exact safe contract.")
        urls.append(url)
    if len(set(urls)) != EXPECTED_CHILD_COUNT:
        raise GateError("Live sitemap index contains duplicate child URLs.")
    return urls


def fetch_live_surface(
    *,
    get: Callable[..., Any] = requests.get,
    checked_at: datetime | None = None,
) -> dict[str, Any]:
    headers = {"User-Agent": AUDIT_USER_AGENT, "Accept": "text/plain, application/xml, text/xml"}
    options = {
        "headers": headers,
        "timeout": HTTP_TIMEOUT_SECONDS,
        "allow_redirects": False,
    }
    robots = get(ROBOTS_URL, **options)
    require_direct_200(robots, ROBOTS_URL, "robots.txt")
    robots_raw = response_bytes(robots, "robots.txt")
    directives = parse_robots_sitemaps(robots_raw)
    if directives != [SITEMAP_URL]:
        raise GateError("robots.txt must contain one exact Sitemap directive.")

    sitemap = get(SITEMAP_URL, **options)
    require_direct_200(sitemap, SITEMAP_URL, "sitemap index")
    sitemap_raw = response_bytes(sitemap, "sitemap index")
    content_type = str(sitemap.headers.get("content-type", "")).split(";", 1)[0].strip().lower()
    if content_type not in ("application/xml", "text/xml", "application/rss+xml"):
        raise GateError("Sitemap index did not return an approved XML content type.")
    child_urls = validate_sitemap_index_xml(sitemap_raw)
    timestamp = (checked_at or clean.utc_now()).astimezone(timezone.utc)
    return {
        "checked_at_utc": clean.utc_text(timestamp),
        "robots": {
            "url": ROBOTS_URL,
            "status": 200,
            "bytes": len(robots_raw),
            "sha256": hashlib.sha256(robots_raw).hexdigest(),
            "sitemap_directive_count": 1,
            "exact_sitemap_directive": SITEMAP_URL,
        },
        "sitemap_index": {
            "url": SITEMAP_URL,
            "status": 200,
            "content_type": content_type,
            "bytes": len(sitemap_raw),
            "sha256": hashlib.sha256(sitemap_raw).hexdigest(),
            "root": "sitemapindex",
            "child_count": len(child_urls),
            "unique_child_count": len(set(child_urls)),
            "child_urls_recorded": False,
        },
        "direct_requests_without_redirects": True,
        "secret_material_recorded": False,
    }


def same_summary_identity(initial: dict[str, Any], current: dict[str, Any]) -> None:
    for field in ("relative_path", "sha256", "bytes"):
        if current.get(field) != initial.get(field):
            raise GateError("Current technical summary identity changed after the initial gate.")


def build_record(
    mode: str,
    summary: dict[str, Any],
    public_surface: dict[str, Any],
    credentials: dict[str, Any],
) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "generated_at": clean.utc_text(),
        "operation": "current_evidence_one_shot_gsc_sitemap_submission",
        "mode": mode,
        "exact_base": BASE_URL,
        "exact_property": PROPERTY_URL,
        "exact_sitemap": SITEMAP_URL,
        "technical_summary_gate": summary,
        "public_surface_gate": public_surface,
        "credentials": credentials,
        "mutation": {
            "explicit_execute_flag": mode == "execute",
            "submit_call_count": 0,
            "mutation_performed": False,
            "state": "not_started",
        },
        "credentials_or_tokens_recorded": False,
    }


def enforce_exact_post_list(
    code: int, path: Path, record: dict[str, Any]
) -> tuple[int, Path, dict[str, Any]]:
    if record.get("mutation", {}).get("submit_call_count") != 1:
        return code, path, record
    after = record.get("sitemaps_after")
    exact = bool(
        isinstance(after, dict)
        and after.get("count") == 1
        and after.get("exact_target_present") is True
        and isinstance(after.get("items"), list)
        and len(after["items"]) == 1
        and after["items"][0].get("path") == SITEMAP_URL
    )
    record["post_list_exact_target_only"] = exact
    if not exact:
        record["outcome"] = "submit_not_verified_by_exact_post_list"
        code = 4
    clean.write_json_atomic(path, record)
    return code, path, record


def run_with_service(
    service: Any,
    *,
    mode: str,
    summary_path: Path,
    summary_sha256: str,
    summary: dict[str, Any],
    public_surface: dict[str, Any],
    credentials_evidence: dict[str, Any],
    get: Callable[..., Any] = requests.get,
    output_dir: Path = OUTPUT_DIR,
    required_summary_path: Path = SUMMARY_PATH,
) -> tuple[int, Path, dict[str, Any]]:
    record = build_record(mode, summary, public_surface, credentials_evidence)
    if mode == "dry-run":
        return clean.run_dry(service, record, output_dir=output_dir)

    def mutation_boundary_gate() -> dict[str, Any]:
        current = validate_summary(
            summary_path,
            summary_sha256,
            required_path=required_summary_path,
        )
        same_summary_identity(summary, current)
        live = fetch_live_surface(get=get)
        return {
            "checked_at_utc": clean.utc_text(),
            "technical_summary": current,
            "public_surface": live,
            "summary_file_reread": True,
            "summary_sha256_rechecked": True,
            "freshness_rechecked_at_mutation_boundary": True,
            "secret_material_recorded": False,
        }

    code, path, result = clean.run_execute(
        service,
        record,
        revalidate_evidence=mutation_boundary_gate,
        output_dir=output_dir,
    )
    return enforce_exact_post_list(code, path, result)


def write_rejection(mode: str, error: Exception) -> Path:
    record = {
        "schema_version": 1,
        "generated_at": clean.utc_text(),
        "completed_at": clean.utc_text(),
        "operation": "current_evidence_one_shot_gsc_sitemap_submission",
        "mode": mode,
        "exact_property": PROPERTY_URL,
        "exact_sitemap": SITEMAP_URL,
        "outcome": "rejected_fail_closed",
        "error": clean.safe_error(error),
        "mutation": {
            "explicit_execute_flag": mode == "execute",
            "submit_call_count": 0,
            "mutation_performed": False,
            "state": "rejected",
        },
        "credentials_or_tokens_recorded": False,
    }
    path = clean.timestamped_path(OUTPUT_DIR, "current-rejected")
    clean.write_json_exclusive(path, record)
    return path


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    mode = "execute" if args.execute else "dry-run"
    try:
        validate_underlying_contract()
        summary = validate_summary(
            args.expected_technical_summary_evidence,
            args.expected_technical_summary_sha256,
        )
        public_surface = fetch_live_surface()
        scope = clean.WRITE_SCOPE if args.execute else clean.READONLY_SCOPE
        credentials, credentials_evidence = clean.load_validated_credentials(scope)
        service = build(
            "searchconsole",
            "v1",
            credentials=credentials,
            cache_discovery=False,
        )
        code, path, result = run_with_service(
            service,
            mode=mode,
            summary_path=args.expected_technical_summary_evidence,
            summary_sha256=args.expected_technical_summary_sha256,
            summary=summary,
            public_surface=public_surface,
            credentials_evidence=credentials_evidence,
        )
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
                    "error": clean.safe_error(exc),
                },
                ensure_ascii=True,
            ),
            file=sys.stderr,
        )
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
