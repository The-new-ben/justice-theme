#!/usr/bin/env python3
"""Focused, network-free tests for gsc_submit_clean_sitemap.py."""

from __future__ import annotations

import hashlib
import importlib.util
import json
import shutil
import sys
import tempfile
import types
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable


def install_google_import_stubs() -> None:
    """Make the helper importable on a clean, network-free CI runner."""

    google = types.ModuleType("google")
    google.__path__ = []  # type: ignore[attr-defined]
    oauth2 = types.ModuleType("google.oauth2")
    oauth2.__path__ = []  # type: ignore[attr-defined]
    service_account = types.ModuleType("google.oauth2.service_account")

    class Credentials:
        @classmethod
        def from_service_account_file(cls, *_args: object, **_kwargs: object) -> object:
            raise AssertionError("unit tests must not load Google credentials")

    service_account.Credentials = Credentials  # type: ignore[attr-defined]
    oauth2.service_account = service_account  # type: ignore[attr-defined]
    google.oauth2 = oauth2  # type: ignore[attr-defined]

    googleapiclient = types.ModuleType("googleapiclient")
    googleapiclient.__path__ = []  # type: ignore[attr-defined]
    discovery = types.ModuleType("googleapiclient.discovery")
    errors = types.ModuleType("googleapiclient.errors")

    def forbidden_build(*_args: object, **_kwargs: object) -> object:
        raise AssertionError("unit tests must not construct a live Google client")

    class HttpError(Exception):
        pass

    discovery.build = forbidden_build  # type: ignore[attr-defined]
    errors.HttpError = HttpError  # type: ignore[attr-defined]
    googleapiclient.discovery = discovery  # type: ignore[attr-defined]
    googleapiclient.errors = errors  # type: ignore[attr-defined]

    sys.modules.update(
        {
            "google": google,
            "google.oauth2": oauth2,
            "google.oauth2.service_account": service_account,
            "googleapiclient": googleapiclient,
            "googleapiclient.discovery": discovery,
            "googleapiclient.errors": errors,
        }
    )


install_google_import_stubs()


MODULE_PATH = Path(__file__).with_name("gsc_submit_clean_sitemap.py")
SPEC = importlib.util.spec_from_file_location("gsc_submit_clean_sitemap", MODULE_PATH)
assert SPEC and SPEC.loader
gsc = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(gsc)


def live_acceptance_report(now: datetime) -> dict[str, Any]:
    completed = now - timedelta(minutes=10)
    return {
        "schema_version": 7,
        "base_url": gsc.BASE_URL,
        "expect": "post",
        "generated_at_utc": (completed - timedelta(minutes=5)).isoformat(),
        "completed_at_utc": completed.isoformat(),
        "overall": {
            "passed": True,
            "status": "passed",
            "enforced_failures": [],
            "observed_post_condition_failures": [],
        },
        "checks": [
            {"id": check_id, "enforced": True, "passed": True, "evidence": {}}
            for check_id in gsc.EXPECTED_ORDERED_CHECK_IDS
        ],
        "configuration": {
            "target_base_url": gsc.BASE_URL,
            "expected_robots_sitemap_url": gsc.SITEMAP_URL,
            "required_plugin_version": gsc.EXPECTED_PLUGIN_VERSION,
            "required_plugin_marker": gsc.EXPECTED_PLUGIN_MARKER,
            "required_unchanged_live_theme": gsc.EXPECTED_THEME,
            "required_unchanged_live_theme_version": gsc.EXPECTED_THEME_VERSION,
            "required_unchanged_live_theme_marker": gsc.EXPECTED_THEME_MARKER,
            "release_contract": gsc.EXPECTED_RELEASE_CONTRACT,
        },
        "observations": {
            "health": {
                "version": gsc.EXPECTED_PLUGIN_VERSION,
                "marker": gsc.EXPECTED_PLUGIN_MARKER,
                "request": {
                    "status": 200,
                    "requested_url": gsc.P0_HEALTH_URL,
                    "final_url": gsc.P0_HEALTH_URL,
                    "redirects": [],
                },
            },
            "sitemaps": {
                "yoast": {
                    "index_loc_count": 10,
                    "index_xml_error": None,
                    "index_request": {
                        "status": 200,
                        "requested_url": gsc.SITEMAP_URL,
                        "final_url": gsc.SITEMAP_URL,
                        "redirects": [],
                        "sha256": "a" * 64,
                    },
                }
            },
            "robots": {
                "authoritative": {
                    "request": {"status": 200},
                    "sitemap_directive_count": 1,
                    "sitemap_directives": [{"value": gsc.SITEMAP_URL}],
                }
            },
        },
    }


def technical_summary_report(now: datetime) -> dict[str, Any]:
    return {
        "base_url": gsc.PROPERTY_URL,
        "generated_at_utc": (now - timedelta(minutes=5)).isoformat(),
        "crawl_fetch_errors": 0,
        "sitemap_child_count": 10,
        "sitemap_child_failures": 0,
        "sitemap_cross_canonical": 0,
        "sitemap_duplicate_occurrences": 0,
        "sitemap_indexable": 2827,
        "sitemap_missing_canonical": 0,
        "sitemap_noindex": 0,
        "sitemap_non_200": 0,
        "sitemap_non_https_urls": 0,
        "sitemap_query_urls": 0,
        "sitemap_redirects": 0,
        "sitemap_robots_blocked": 0,
        "sitemap_unique_urls": 2827,
        "sitemap_url_occurrences": 2827,
    }


def write_report(
    directory: Path,
    report: dict[str, Any],
    name: str,
) -> tuple[Path, str]:
    path = directory / name
    raw = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    path.write_bytes(raw)
    return path, hashlib.sha256(raw).hexdigest()


def import_helper_at(path: Path, module_name: str) -> Any:
    spec = importlib.util.spec_from_file_location(module_name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class WorkspaceRootResolutionTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.workspace = Path(self.temp.name) / "shared-workspace"

    def tearDown(self) -> None:
        self.temp.cleanup()

    def copy_and_import(self, repo_root: Path, module_name: str) -> Any:
        tools_directory = repo_root / "tools"
        tools_directory.mkdir(parents=True)
        target = tools_directory / MODULE_PATH.name
        shutil.copyfile(MODULE_PATH, target)
        return import_helper_at(target, module_name)

    def test_nested_worktree_uses_shared_workspace_for_state(self) -> None:
        nested_repo = self.workspace / ".codex-tmp" / "release-worktree"
        module = self.copy_and_import(nested_repo, "gsc_nested_worktree_test")

        self.assertEqual(module.REPO_ROOT, nested_repo.resolve())
        self.assertEqual(Path(module.__file__).resolve().parents[1], module.REPO_ROOT)
        self.assertEqual(module.WORKSPACE_ROOT, self.workspace.resolve())
        self.assertEqual(
            module.PRIMARY_CREDENTIALS,
            self.workspace / ".env.gsc-service-account.json",
        )
        self.assertEqual(
            module.FALLBACK_CREDENTIALS,
            self.workspace / "credentials" / "jus-tice-theme-a21ab27d03d2.json",
        )
        self.assertEqual(
            module.ALLOWED_LIVE_ACCEPTANCE_DIR,
            self.workspace
            / "reports"
            / "seo-recovery-2026-07-31"
            / "release-path"
            / "p0-live-acceptance-2026-08-01",
        )
        self.assertEqual(
            module.ALLOWED_TECHNICAL_SUMMARY_DIR,
            self.workspace
            / "reports"
            / "seo-recovery-2026-07-31"
            / "post-p0-0.1.2-crawl-2026-08-01",
        )
        self.assertEqual(
            module.OUTPUT_DIR,
            self.workspace
            / "reports"
            / "seo-recovery-2026-07-31"
            / "gsc"
            / "post-p0-2026-08-01",
        )

        now = datetime(2026, 8, 1, 6, 0, tzinfo=timezone.utc)
        module.ALLOWED_LIVE_ACCEPTANCE_DIR.mkdir(parents=True)
        acceptance_path, acceptance_digest = write_report(
            module.ALLOWED_LIVE_ACCEPTANCE_DIR,
            live_acceptance_report(now),
            "p0-live-post-20260801T055000Z.json",
        )
        acceptance = module.validate_live_acceptance_evidence(
            acceptance_path,
            acceptance_digest,
            now=now,
        )

        module.ALLOWED_TECHNICAL_SUMMARY_DIR.mkdir(parents=True)
        summary_path, summary_digest = write_report(
            module.ALLOWED_TECHNICAL_SUMMARY_DIR,
            technical_summary_report(now),
            "technical-summary.json",
        )
        summary = module.validate_technical_summary_evidence(
            summary_path,
            summary_digest,
            acceptance_completed_at=acceptance["completed_at_utc"],
            now=now,
        )
        self.assertEqual(
            acceptance["relative_path"],
            "reports/seo-recovery-2026-07-31/release-path/"
            "p0-live-acceptance-2026-08-01/"
            "p0-live-post-20260801T055000Z.json",
        )
        self.assertEqual(
            summary["relative_path"],
            "reports/seo-recovery-2026-07-31/"
            "post-p0-0.1.2-crawl-2026-08-01/technical-summary.json",
        )

    def test_near_match_parent_does_not_escape_repo_root(self) -> None:
        ordinary_repo = self.workspace / ".codex-tmp-near-match" / "worktree"
        module = self.copy_and_import(ordinary_repo, "gsc_ordinary_repo_test")
        self.assertEqual(module.REPO_ROOT, ordinary_repo.resolve())
        self.assertEqual(Path(module.__file__).resolve().parents[1], module.REPO_ROOT)
        self.assertEqual(module.WORKSPACE_ROOT, ordinary_repo.resolve())
        self.assertEqual(
            module.PRIMARY_CREDENTIALS,
            ordinary_repo / ".env.gsc-service-account.json",
        )
        self.assertEqual(
            module.ALLOWED_LIVE_ACCEPTANCE_DIR.parts[: len(ordinary_repo.parts)],
            ordinary_repo.parts,
        )


class FakeRequest:
    def __init__(self, callback: Callable[[], dict[str, Any]]) -> None:
        self.callback = callback

    def execute(self, num_retries: int = -1) -> dict[str, Any]:
        if num_retries != 0:
            raise AssertionError("Every API call must explicitly disable retries")
        return self.callback()


class FakeSites:
    def __init__(self, owner_states: list[bool]) -> None:
        self.owner_states = owner_states
        self.list_calls = 0

    def list(self) -> FakeRequest:
        def callback() -> dict[str, Any]:
            index = min(self.list_calls, len(self.owner_states) - 1)
            owner = self.owner_states[index]
            self.list_calls += 1
            return {
                "siteEntry": [
                    {
                        "siteUrl": gsc.PROPERTY_URL,
                        "permissionLevel": "siteOwner" if owner else "siteRestrictedUser",
                    }
                ]
            }

        return FakeRequest(callback)


class FakeSitemaps:
    OTHER_SITEMAP_URL = "https://jus-tice.co.il/other-sitemap.xml"

    def __init__(
        self,
        present_before: bool = False,
        other_present_before: bool = False,
        submit_error: Exception | None = None,
        appear_on_list_call: int | None = None,
    ) -> None:
        self.paths: list[str] = []
        if present_before:
            self.paths.append(gsc.SITEMAP_URL)
        if other_present_before:
            self.paths.append(self.OTHER_SITEMAP_URL)
        self.submit_error = submit_error
        self.appear_on_list_call = appear_on_list_call
        self.list_calls = 0
        self.submit_calls = 0
        self.submit_arguments: list[tuple[str, str]] = []

    def list(self, *, siteUrl: str) -> FakeRequest:
        if siteUrl != gsc.PROPERTY_URL:
            raise AssertionError("Wrong property")

        def callback() -> dict[str, Any]:
            self.list_calls += 1
            if (
                self.appear_on_list_call == self.list_calls
                and self.OTHER_SITEMAP_URL not in self.paths
            ):
                self.paths.append(self.OTHER_SITEMAP_URL)
            return {
                "sitemap": [
                    {"path": path, "errors": 0, "warnings": 0}
                    for path in self.paths
                ]
            }

        return FakeRequest(callback)

    def submit(self, *, siteUrl: str, feedpath: str) -> FakeRequest:
        self.submit_arguments.append((siteUrl, feedpath))

        def callback() -> dict[str, Any]:
            self.submit_calls += 1
            if self.submit_error is not None:
                raise self.submit_error
            if gsc.SITEMAP_URL not in self.paths:
                self.paths.append(gsc.SITEMAP_URL)
            return {}

        return FakeRequest(callback)


class FakeService:
    def __init__(
        self,
        *,
        owner_states: list[bool] | None = None,
        present_before: bool = False,
        other_present_before: bool = False,
        submit_error: Exception | None = None,
        appear_on_list_call: int | None = None,
    ) -> None:
        self.sites_resource = FakeSites(owner_states or [True, True])
        self.sitemaps_resource = FakeSitemaps(
            present_before,
            other_present_before,
            submit_error,
            appear_on_list_call,
        )

    def sites(self) -> FakeSites:
        return self.sites_resource

    def sitemaps(self) -> FakeSitemaps:
        return self.sitemaps_resource


def base_record(mode: str = "execute") -> dict[str, Any]:
    return gsc.base_record(
        mode,
        {"sha256": "a" * 64, "overall_status": "passed", "check_count": 53},
        {
            "sha256": "b" * 64,
            "sitemap_url_occurrences": 2827,
            "sitemap_unique_urls": 2827,
            "sitemap_indexable": 2827,
        },
        {"same_service_account_identity": True, "secret_fields_recorded": False},
    )


def successful_recheck() -> dict[str, Any]:
    return {
        "checked_at_utc": "2026-08-01T06:00:00Z",
        "both_files_reread": True,
        "both_sha256_pins_rechecked": True,
        "freshness_rechecked_at_mutation_boundary": True,
    }


class DualEvidenceGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.now = datetime(2026, 8, 1, 6, 0, tzinfo=timezone.utc)
        self.temp = tempfile.TemporaryDirectory()
        self.directory = Path(self.temp.name)
        self.acceptance_directory = self.directory / "acceptance"
        self.summary_directory = self.directory / "crawl"
        self.acceptance_directory.mkdir()
        self.summary_directory.mkdir()

    def tearDown(self) -> None:
        self.temp.cleanup()

    def write_acceptance(
        self, report: dict[str, Any] | None = None
    ) -> tuple[Path, str]:
        return write_report(
            self.acceptance_directory,
            report or live_acceptance_report(self.now),
            "p0-live-post-20260801T055000Z.json",
        )

    def write_summary(
        self, report: dict[str, Any] | None = None
    ) -> tuple[Path, str]:
        return write_report(
            self.summary_directory,
            report or technical_summary_report(self.now),
            "technical-summary.json",
        )

    def validate_acceptance(self, path: Path, digest: str) -> dict[str, Any]:
        return gsc.validate_live_acceptance_evidence(
            path,
            digest,
            now=self.now,
            allowed_dir=self.acceptance_directory,
        )

    def validate_summary(
        self,
        path: Path,
        digest: str,
        *,
        acceptance_completed_at: str | None = None,
    ) -> dict[str, Any]:
        accepted_at = acceptance_completed_at or live_acceptance_report(self.now)[
            "completed_at_utc"
        ]
        return gsc.validate_technical_summary_evidence(
            path,
            digest,
            acceptance_completed_at=accepted_at,
            now=self.now,
            allowed_dir=self.summary_directory,
        )

    def test_accepts_exact_fresh_dual_evidence(self) -> None:
        acceptance_path, acceptance_digest = self.write_acceptance()
        acceptance = self.validate_acceptance(acceptance_path, acceptance_digest)
        summary_path, summary_digest = self.write_summary()
        summary = self.validate_summary(
            summary_path,
            summary_digest,
            acceptance_completed_at=acceptance["completed_at_utc"],
        )
        self.assertEqual(acceptance["check_count"], 53)
        self.assertTrue(acceptance["all_checks_enforced_and_passed"])
        self.assertEqual(summary["sitemap_url_occurrences"], 2827)
        self.assertEqual(summary["sitemap_unique_urls"], 2827)

    def test_immediate_recheck_rereads_both_exact_hash_pins(self) -> None:
        acceptance_path, acceptance_digest = self.write_acceptance()
        acceptance = self.validate_acceptance(acceptance_path, acceptance_digest)
        summary_path, summary_digest = self.write_summary()
        summary = self.validate_summary(
            summary_path,
            summary_digest,
            acceptance_completed_at=acceptance["completed_at_utc"],
        )

        acceptance_path.write_bytes(acceptance_path.read_bytes() + b" ")
        with self.assertRaisesRegex(gsc.GateError, "SHA-256 does not match"):
            gsc.revalidate_submission_evidence(
                acceptance_path,
                acceptance_digest,
                summary_path,
                summary_digest,
                acceptance,
                summary,
                now=self.now,
                live_allowed_dir=self.acceptance_directory,
                technical_allowed_dir=self.summary_directory,
            )

    def test_immediate_recheck_rejects_proof_that_aged_out(self) -> None:
        acceptance_path, acceptance_digest = self.write_acceptance()
        acceptance = self.validate_acceptance(acceptance_path, acceptance_digest)
        summary_path, summary_digest = self.write_summary()
        summary = self.validate_summary(
            summary_path,
            summary_digest,
            acceptance_completed_at=acceptance["completed_at_utc"],
        )

        with self.assertRaisesRegex(gsc.GateError, "older than the three-hour gate"):
            gsc.revalidate_submission_evidence(
                acceptance_path,
                acceptance_digest,
                summary_path,
                summary_digest,
                acceptance,
                summary,
                now=self.now + timedelta(hours=4),
                live_allowed_dir=self.acceptance_directory,
                technical_allowed_dir=self.summary_directory,
            )
        self.assertEqual(summary["sitemap_indexable"], 2827)
        self.assertTrue(summary["all_critical_sitemap_gates_zero"])

    def test_rejects_missing_live_acceptance_file(self) -> None:
        path = self.acceptance_directory / "p0-live-post-20260801T055000Z.json"
        with self.assertRaisesRegex(gsc.GateError, "regular non-symlink"):
            self.validate_acceptance(path, "0" * 64)

    def test_rejects_missing_technical_summary_file(self) -> None:
        path = self.summary_directory / "technical-summary.json"
        with self.assertRaisesRegex(gsc.GateError, "regular non-symlink"):
            self.validate_summary(path, "0" * 64)

    def test_rejects_live_acceptance_outside_exact_root(self) -> None:
        path, digest = write_report(
            self.directory,
            live_acceptance_report(self.now),
            "p0-live-post-20260801T055000Z.json",
        )
        with self.assertRaisesRegex(gsc.GateError, "outside the approved directory"):
            self.validate_acceptance(path, digest)

    def test_rejects_technical_summary_outside_exact_root(self) -> None:
        path, digest = write_report(
            self.directory,
            technical_summary_report(self.now),
            "technical-summary.json",
        )
        with self.assertRaisesRegex(gsc.GateError, "outside the approved directory"):
            self.validate_summary(path, digest)

    def test_rejects_live_acceptance_hash_mismatch(self) -> None:
        path, _ = self.write_acceptance()
        with self.assertRaisesRegex(gsc.GateError, "does not match"):
            self.validate_acceptance(path, "0" * 64)

    def test_rejects_technical_summary_hash_mismatch(self) -> None:
        path, _ = self.write_summary()
        with self.assertRaisesRegex(gsc.GateError, "does not match"):
            self.validate_summary(path, "0" * 64)

    def test_rejects_schema_6_live_acceptance(self) -> None:
        report = live_acceptance_report(self.now)
        report["schema_version"] = 6
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "schema version 7"):
            self.validate_acceptance(path, digest)

    def test_rejects_float_schema_7_live_acceptance(self) -> None:
        report = live_acceptance_report(self.now)
        report["schema_version"] = 7.0
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "schema version 7"):
            self.validate_acceptance(path, digest)

    def test_rejects_50_check_live_acceptance(self) -> None:
        report = live_acceptance_report(self.now)
        report["checks"] = report["checks"][:50]
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "exactly 53 checks"):
            self.validate_acceptance(path, digest)

    def test_rejects_duplicate_live_acceptance_check_ids(self) -> None:
        report = live_acceptance_report(self.now)
        report["checks"][-1]["id"] = report["checks"][0]["id"]
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "not unique"):
            self.validate_acceptance(path, digest)

    def test_rejects_reordered_live_acceptance_checks(self) -> None:
        report = live_acceptance_report(self.now)
        report["checks"][0], report["checks"][1] = (
            report["checks"][1],
            report["checks"][0],
        )
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "exact ordered contract"):
            self.validate_acceptance(path, digest)

    def test_rejects_failed_live_acceptance_check(self) -> None:
        report = live_acceptance_report(self.now)
        report["checks"][0]["passed"] = False
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "did not pass"):
            self.validate_acceptance(path, digest)

    def test_rejects_unenforced_live_acceptance_check(self) -> None:
        report = live_acceptance_report(self.now)
        report["checks"][0]["enforced"] = False
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "did not pass"):
            self.validate_acceptance(path, digest)

    def test_rejects_wrong_p0_1_2_marker(self) -> None:
        report = live_acceptance_report(self.now)
        report["configuration"]["required_plugin_marker"] = "wrong-marker"
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "configuration mismatch"):
            self.validate_acceptance(path, digest)

    def test_rejects_wrong_p0_1_2_version(self) -> None:
        report = live_acceptance_report(self.now)
        report["configuration"]["required_plugin_version"] = "0.1.1"
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "configuration mismatch"):
            self.validate_acceptance(path, digest)

    def test_rejects_observed_health_marker_mismatch(self) -> None:
        report = live_acceptance_report(self.now)
        report["observations"]["health"]["marker"] = "wrong-marker"
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "exact direct P0.1.2 health"):
            self.validate_acceptance(path, digest)

    def test_rejects_stale_live_acceptance(self) -> None:
        path, digest = self.write_acceptance()
        with self.assertRaisesRegex(gsc.GateError, "older than"):
            gsc.validate_live_acceptance_evidence(
                path,
                digest,
                now=self.now + timedelta(hours=4),
                allowed_dir=self.acceptance_directory,
            )

    def test_rejects_stale_technical_summary(self) -> None:
        report = technical_summary_report(self.now)
        report["generated_at_utc"] = (self.now - timedelta(hours=4)).isoformat()
        path, digest = self.write_summary(report)
        with self.assertRaisesRegex(gsc.GateError, "older than"):
            self.validate_summary(
                path,
                digest,
                acceptance_completed_at=(self.now - timedelta(hours=5)).isoformat(),
            )

    def test_rejects_technical_summary_before_acceptance(self) -> None:
        report = technical_summary_report(self.now)
        report["generated_at_utc"] = (self.now - timedelta(minutes=20)).isoformat()
        path, digest = self.write_summary(report)
        with self.assertRaisesRegex(gsc.GateError, "predates"):
            self.validate_summary(path, digest)

    def test_rejects_nonzero_duplicate_sitemap_occurrences(self) -> None:
        report = technical_summary_report(self.now)
        report["sitemap_duplicate_occurrences"] = 1
        path, digest = self.write_summary(report)
        with self.assertRaisesRegex(
            gsc.GateError, "sitemap_duplicate_occurrences == 0"
        ):
            self.validate_summary(path, digest)

    def test_rejects_nonzero_critical_sitemap_failure(self) -> None:
        report = technical_summary_report(self.now)
        report["sitemap_cross_canonical"] = 1
        path, digest = self.write_summary(report)
        with self.assertRaisesRegex(gsc.GateError, "sitemap_cross_canonical == 0"):
            self.validate_summary(path, digest)

    def test_rejects_wrong_sitemap_population(self) -> None:
        report = technical_summary_report(self.now)
        report["sitemap_unique_urls"] = 2826
        path, digest = self.write_summary(report)
        with self.assertRaisesRegex(gsc.GateError, "sitemap_unique_urls == 2827"):
            self.validate_summary(path, digest)

    def test_rejects_wrong_technical_summary_base_url(self) -> None:
        report = technical_summary_report(self.now)
        report["base_url"] = "https://example.test/"
        path, digest = self.write_summary(report)
        with self.assertRaisesRegex(gsc.GateError, "wrong base URL"):
            self.validate_summary(path, digest)

    def test_rejects_wrong_child_sitemap_count(self) -> None:
        report = technical_summary_report(self.now)
        report["sitemap_child_count"] = 9
        path, digest = self.write_summary(report)
        with self.assertRaisesRegex(gsc.GateError, "sitemap_child_count == 10"):
            self.validate_summary(path, digest)

    def test_rejects_boolean_disguised_as_zero(self) -> None:
        report = technical_summary_report(self.now)
        report["sitemap_non_200"] = False
        path, digest = self.write_summary(report)
        with self.assertRaisesRegex(gsc.GateError, "sitemap_non_200 == 0"):
            self.validate_summary(path, digest)

    def test_rejects_wrong_sitemap_contract(self) -> None:
        report = live_acceptance_report(self.now)
        report["configuration"]["expected_robots_sitemap_url"] = "https://example.test/sitemap.xml"
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "configuration mismatch"):
            self.validate_acceptance(path, digest)

    def test_rejects_wrong_live_sitemap_child_count(self) -> None:
        report = live_acceptance_report(self.now)
        report["observations"]["sitemaps"]["yoast"]["index_loc_count"] = 9
        path, digest = self.write_acceptance(report)
        with self.assertRaisesRegex(gsc.GateError, "direct valid sitemap index"):
            self.validate_acceptance(path, digest)

    def test_rejects_duplicate_json_keys(self) -> None:
        path = self.acceptance_directory / "p0-live-post-20260801T055000Z.json"
        raw = b'{"schema_version":7,"schema_version":7}'
        path.write_bytes(raw)
        digest = hashlib.sha256(raw).hexdigest()
        with self.assertRaisesRegex(gsc.GateError, "Duplicate JSON key"):
            self.validate_acceptance(path, digest)


class ApiFlowTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.output = Path(self.temp.name)

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_dry_run_never_constructs_or_executes_submit(self) -> None:
        service = FakeService()
        code, path, record = gsc.run_dry(
            service, base_record("dry-run"), output_dir=self.output
        )
        self.assertEqual(code, 0)
        self.assertTrue(path.is_file())
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)
        self.assertEqual(service.sitemaps_resource.submit_arguments, [])
        self.assertFalse(record["mutation"]["mutation_performed"])

    def test_execute_calls_exact_submit_once_and_lists_after(self) -> None:
        service = FakeService()
        recheck_calls = 0

        def counted_recheck() -> dict[str, Any]:
            nonlocal recheck_calls
            recheck_calls += 1
            return successful_recheck()

        code, path, record = gsc.run_execute(
            service,
            base_record(),
            revalidate_evidence=counted_recheck,
            output_dir=self.output,
        )
        self.assertEqual(code, 0)
        self.assertEqual(service.sites_resource.list_calls, 2)
        self.assertEqual(service.sitemaps_resource.list_calls, 3)
        self.assertEqual(service.sitemaps_resource.submit_calls, 1)
        self.assertEqual(
            service.sitemaps_resource.submit_arguments,
            [(gsc.PROPERTY_URL, gsc.SITEMAP_URL)],
        )
        self.assertEqual(record["mutation"]["submit_call_count"], 1)
        self.assertEqual(record["outcome"], "submitted_once_and_listed_after")
        self.assertEqual(recheck_calls, 1)
        self.assertTrue(
            record["evidence_revalidated_immediately_before_submit"][
                "freshness_rechecked_at_mutation_boundary"
            ]
        )
        self.assertTrue(path.is_file())

    def test_already_present_is_noop(self) -> None:
        service = FakeService(present_before=True)
        code, _, record = gsc.run_execute(
            service,
            base_record(),
            revalidate_evidence=successful_recheck,
            output_dir=self.output,
        )
        self.assertEqual(code, 3)
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)
        self.assertEqual(service.sitemaps_resource.submit_arguments, [])
        self.assertEqual(
            record["outcome"]
            if "outcome" in record
            else record["mutation"]["state"],
            "already_present_no_submit",
        )

    def test_dry_run_rejects_any_existing_submission(self) -> None:
        service = FakeService(other_present_before=True)
        with self.assertRaisesRegex(gsc.GateError, "zero existing"):
            gsc.run_dry(service, base_record("dry-run"), output_dir=self.output)
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)

    def test_execute_rejects_non_target_existing_submission(self) -> None:
        service = FakeService(other_present_before=True)
        with self.assertRaisesRegex(gsc.GateError, "zero existing"):
            gsc.run_execute(
                service,
                base_record(),
                revalidate_evidence=successful_recheck,
                output_dir=self.output,
            )
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)
        self.assertFalse(gsc.one_shot_path(self.output).exists())

    def test_immediate_sitemap_race_blocks_submit(self) -> None:
        service = FakeService(appear_on_list_call=2)
        code, path, record = gsc.run_execute(
            service,
            base_record(),
            revalidate_evidence=successful_recheck,
            output_dir=self.output,
        )
        self.assertEqual(code, 2)
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)
        self.assertEqual(record["mutation"]["submit_call_count"], 0)
        self.assertEqual(record["mutation"]["state"], "sitemap_recheck_failed")
        self.assertEqual(record["outcome"], "blocked_before_submit")
        self.assertEqual(record["sitemaps_immediately_before_submit"]["count"], 1)
        self.assertEqual(path, gsc.one_shot_path(self.output))

    def test_immediate_permission_failure_blocks_submit(self) -> None:
        service = FakeService(owner_states=[True, False])
        code, _, record = gsc.run_execute(
            service,
            base_record(),
            revalidate_evidence=successful_recheck,
            output_dir=self.output,
        )
        self.assertEqual(code, 2)
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)
        self.assertEqual(record["mutation"]["submit_call_count"], 0)
        self.assertEqual(record["mutation"]["state"], "permission_recheck_failed")
        self.assertEqual(record["outcome"], "blocked_before_submit")

    def test_submit_error_is_not_retried(self) -> None:
        service = FakeService(submit_error=RuntimeError("synthetic transport failure"))
        code, _, record = gsc.run_execute(
            service,
            base_record(),
            revalidate_evidence=successful_recheck,
            output_dir=self.output,
        )
        self.assertEqual(code, 4)
        self.assertEqual(service.sitemaps_resource.submit_calls, 1)
        self.assertEqual(record["mutation"]["submit_call_count"], 1)
        self.assertEqual(record["outcome"], "submit_not_verified_after_single_attempt")

    def test_immediate_evidence_recheck_failure_blocks_submit(self) -> None:
        service = FakeService()

        def expired_recheck() -> dict[str, Any]:
            raise gsc.GateError("Live-acceptance evidence is older than the three-hour gate.")

        code, path, record = gsc.run_execute(
            service,
            base_record(),
            revalidate_evidence=expired_recheck,
            output_dir=self.output,
        )
        self.assertEqual(code, 2)
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)
        self.assertEqual(record["mutation"]["submit_call_count"], 0)
        self.assertEqual(record["mutation"]["state"], "evidence_recheck_failed")
        self.assertEqual(record["outcome"], "blocked_before_submit")
        self.assertEqual(path, gsc.one_shot_path(self.output))

    def test_existing_one_shot_journal_blocks_all_api_calls(self) -> None:
        service = FakeService()
        journal = gsc.one_shot_path(self.output)
        journal.write_text("{}\n", encoding="utf-8")
        with self.assertRaisesRegex(gsc.GateError, "already exists"):
            gsc.run_execute(
                service,
                base_record(),
                revalidate_evidence=successful_recheck,
                output_dir=self.output,
            )
        self.assertEqual(service.sites_resource.list_calls, 0)
        self.assertEqual(service.sitemaps_resource.list_calls, 0)
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)


class CliGateTests(unittest.TestCase):
    @staticmethod
    def evidence_args() -> list[str]:
        return [
            "--expected-live-acceptance-evidence",
            "acceptance.json",
            "--expected-live-acceptance-sha256",
            "0" * 64,
            "--expected-technical-summary-evidence",
            "technical-summary.json",
            "--expected-technical-summary-sha256",
            "1" * 64,
        ]

    def test_mode_is_mandatory(self) -> None:
        with self.assertRaises(SystemExit):
            gsc.parse_args(self.evidence_args())

    def test_modes_are_mutually_exclusive(self) -> None:
        with self.assertRaises(SystemExit):
            gsc.parse_args(["--dry-run", "--execute", *self.evidence_args()])

    def test_both_evidence_pairs_are_mandatory(self) -> None:
        with self.assertRaises(SystemExit):
            gsc.parse_args(
                [
                    "--dry-run",
                    "--expected-live-acceptance-evidence",
                    "acceptance.json",
                    "--expected-live-acceptance-sha256",
                    "0" * 64,
                ]
            )

    def test_explicit_dry_run_remains_non_execute_mode(self) -> None:
        args = gsc.parse_args(["--dry-run", *self.evidence_args()])
        self.assertTrue(args.dry_run)
        self.assertFalse(args.execute)


if __name__ == "__main__":
    unittest.main(verbosity=2)
