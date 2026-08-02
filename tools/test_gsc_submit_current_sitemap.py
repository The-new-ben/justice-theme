#!/usr/bin/env python3
"""Tests for the current-evidence GSC sitemap submission gate."""

from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import gsc_submit_current_sitemap as gsc


def summary_report(now: datetime) -> dict[str, Any]:
    report: dict[str, Any] = {
        "generated_at_utc": (now - timedelta(minutes=5)).isoformat(),
        "base_url": gsc.BASE_URL,
        "sitemap_child_count": gsc.EXPECTED_CHILD_COUNT,
        "sitemap_url_occurrences": gsc.EXPECTED_URL_COUNT,
        "sitemap_unique_urls": gsc.EXPECTED_URL_COUNT,
        "sitemap_indexable": gsc.EXPECTED_URL_COUNT,
    }
    report.update({field: 0 for field in gsc.CRITICAL_ZERO_FIELDS})
    return report


def write_summary(path: Path, report: dict[str, Any]) -> str:
    raw = (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    path.write_bytes(raw)
    return hashlib.sha256(raw).hexdigest()


def sitemap_xml(child_count: int = gsc.EXPECTED_CHILD_COUNT) -> bytes:
    children = "".join(
        "<sitemap><loc>"
        f"https://jus-tice.co.il/child-{index}-sitemap.xml"
        "</loc></sitemap>"
        for index in range(child_count)
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        f'<sitemapindex xmlns="{gsc.XML_NAMESPACE}">{children}</sitemapindex>'
    ).encode("utf-8")


class FakeResponse:
    def __init__(
        self,
        url: str,
        content: bytes,
        *,
        status: int = 200,
        content_type: str = "text/plain; charset=UTF-8",
        history: list[Any] | None = None,
    ) -> None:
        self.url = url
        self.content = content
        self.status_code = status
        self.headers = {"content-type": content_type}
        self.history = history or []


class FakeGet:
    def __init__(
        self,
        *,
        robots: FakeResponse | None = None,
        sitemap: FakeResponse | None = None,
        events: list[str] | None = None,
    ) -> None:
        self.robots = robots or FakeResponse(
            gsc.ROBOTS_URL,
            f"User-agent: *\nSitemap: {gsc.SITEMAP_URL}\n".encode("utf-8"),
        )
        self.sitemap = sitemap or FakeResponse(
            gsc.SITEMAP_URL,
            sitemap_xml(),
            content_type="text/xml; charset=UTF-8",
        )
        self.events = events if events is not None else []

    def __call__(self, url: str, **kwargs: Any) -> FakeResponse:
        self.assert_safe_options(kwargs)
        if url == gsc.ROBOTS_URL:
            self.events.append("get:robots")
            return self.robots
        if url == gsc.SITEMAP_URL:
            self.events.append("get:sitemap")
            return self.sitemap
        raise AssertionError(f"Unexpected URL: {url}")

    @staticmethod
    def assert_safe_options(kwargs: dict[str, Any]) -> None:
        if kwargs.get("allow_redirects") is not False:
            raise AssertionError("Redirects must be disabled")
        if kwargs.get("timeout") != gsc.HTTP_TIMEOUT_SECONDS:
            raise AssertionError("Exact timeout was not used")
        headers = kwargs.get("headers", {})
        if headers.get("User-Agent") != gsc.AUDIT_USER_AGENT:
            raise AssertionError("Exact audit user agent was not used")


class FakeRequest:
    def __init__(self, payload: dict[str, Any], event: str, events: list[str]) -> None:
        self.payload = payload
        self.event = event
        self.events = events

    def execute(self, num_retries: int = 0) -> dict[str, Any]:
        if num_retries != 0:
            raise AssertionError("API retries are forbidden")
        self.events.append(self.event)
        return self.payload


class FakeSites:
    def __init__(self, events: list[str]) -> None:
        self.events = events

    def list(self) -> FakeRequest:
        return FakeRequest(
            {
                "siteEntry": [
                    {"siteUrl": gsc.PROPERTY_URL, "permissionLevel": "siteOwner"}
                ]
            },
            "api:sites.list",
            self.events,
        )


class FakeSitemaps:
    def __init__(
        self,
        events: list[str],
        list_states: list[list[dict[str, Any]]] | None = None,
    ) -> None:
        self.events = events
        self.list_states = list_states or [[], [], [{"path": gsc.SITEMAP_URL}]]
        self.list_calls = 0
        self.submit_calls = 0
        self.submit_arguments: list[tuple[str, str]] = []

    def list(self, *, siteUrl: str) -> FakeRequest:
        if siteUrl != gsc.PROPERTY_URL:
            raise AssertionError("Wrong property")
        index = min(self.list_calls, len(self.list_states) - 1)
        state = self.list_states[index]
        self.list_calls += 1
        return FakeRequest({"sitemap": state}, "api:sitemaps.list", self.events)

    def submit(self, *, siteUrl: str, feedpath: str) -> FakeRequest:
        self.submit_calls += 1
        self.submit_arguments.append((siteUrl, feedpath))
        return FakeRequest({}, "api:sitemaps.submit", self.events)


class FakeService:
    def __init__(
        self,
        events: list[str],
        list_states: list[list[dict[str, Any]]] | None = None,
    ) -> None:
        self.sites_resource = FakeSites(events)
        self.sitemaps_resource = FakeSitemaps(events, list_states)

    def sites(self) -> FakeSites:
        return self.sites_resource

    def sitemaps(self) -> FakeSitemaps:
        return self.sitemaps_resource


class SummaryGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.now = datetime(2026, 8, 2, 7, 0, tzinfo=timezone.utc)
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "technical-summary.json"

    def tearDown(self) -> None:
        self.temp.cleanup()

    def validate(self, report: dict[str, Any] | None = None) -> dict[str, Any]:
        digest = write_summary(self.path, report or summary_report(self.now))
        return gsc.validate_summary(
            self.path,
            digest,
            now=self.now,
            required_path=self.path,
        )

    def test_accepts_exact_fresh_pinned_summary(self) -> None:
        evidence = self.validate()
        self.assertEqual(evidence["exact_property"], gsc.PROPERTY_URL)
        self.assertEqual(evidence["exact_sitemap"], gsc.SITEMAP_URL)
        self.assertEqual(evidence["sitemap_unique_urls"], 2827)
        self.assertTrue(evidence["all_current_summary_gates_passed"])

    def test_rejects_wrong_exact_path(self) -> None:
        digest = write_summary(self.path, summary_report(self.now))
        with self.assertRaisesRegex(gsc.GateError, "exact approved path"):
            gsc.validate_summary(
                self.path,
                digest,
                now=self.now,
                required_path=self.path.with_name("different.json"),
            )

    def test_rejects_hash_mismatch(self) -> None:
        write_summary(self.path, summary_report(self.now))
        with self.assertRaisesRegex(gsc.clean.GateError, "does not match"):
            gsc.validate_summary(
                self.path,
                "0" * 64,
                now=self.now,
                required_path=self.path,
            )

    def test_rejects_stale_summary(self) -> None:
        report = summary_report(self.now)
        report["generated_at_utc"] = (self.now - timedelta(hours=4)).isoformat()
        with self.assertRaisesRegex(gsc.GateError, "older than"):
            self.validate(report)

    def test_rejects_wrong_base(self) -> None:
        report = summary_report(self.now)
        report["base_url"] = "https://example.test/"
        with self.assertRaisesRegex(gsc.GateError, "wrong base URL"):
            self.validate(report)

    def test_rejects_every_nonzero_critical_field(self) -> None:
        for field in gsc.CRITICAL_ZERO_FIELDS:
            with self.subTest(field=field):
                report = summary_report(self.now)
                report[field] = 1
                with self.assertRaisesRegex(gsc.GateError, f"{field} == 0"):
                    self.validate(report)

    def test_rejects_wrong_inventory_counts(self) -> None:
        for field, expected in (
            ("sitemap_child_count", 10),
            ("sitemap_url_occurrences", 2827),
            ("sitemap_unique_urls", 2827),
            ("sitemap_indexable", 2827),
        ):
            with self.subTest(field=field):
                report = summary_report(self.now)
                report[field] = expected - 1
                with self.assertRaisesRegex(gsc.GateError, f"{field} == {expected}"):
                    self.validate(report)

    def test_rejects_boolean_disguised_as_integer(self) -> None:
        report = summary_report(self.now)
        report["sitemap_non_200"] = False
        with self.assertRaisesRegex(gsc.GateError, "sitemap_non_200 == 0"):
            self.validate(report)


class PublicSurfaceGateTests(unittest.TestCase):
    def test_accepts_one_exact_directive_and_direct_valid_index(self) -> None:
        evidence = gsc.fetch_live_surface(get=FakeGet())
        self.assertEqual(evidence["robots"]["sitemap_directive_count"], 1)
        self.assertEqual(evidence["sitemap_index"]["child_count"], 10)
        self.assertTrue(evidence["direct_requests_without_redirects"])

    def test_rejects_second_sitemap_directive(self) -> None:
        robots = FakeResponse(
            gsc.ROBOTS_URL,
            (
                f"Sitemap: {gsc.SITEMAP_URL}\n"
                "Sitemap: https://jus-tice.co.il/other.xml\n"
            ).encode("utf-8"),
        )
        with self.assertRaisesRegex(gsc.GateError, "one exact"):
            gsc.fetch_live_surface(get=FakeGet(robots=robots))

    def test_rejects_wrong_sitemap_directive(self) -> None:
        robots = FakeResponse(
            gsc.ROBOTS_URL,
            b"Sitemap: https://jus-tice.co.il/sitemap.xml\n",
        )
        with self.assertRaisesRegex(gsc.GateError, "one exact"):
            gsc.fetch_live_surface(get=FakeGet(robots=robots))

    def test_rejects_redirect_or_non_200(self) -> None:
        for response in (
            FakeResponse(gsc.ROBOTS_URL, b"x", status=301),
            FakeResponse(gsc.ROBOTS_URL, b"x", history=[object()]),
        ):
            with self.subTest(status=response.status_code, history=bool(response.history)):
                with self.assertRaisesRegex(gsc.GateError, "direct HTTP 200|redirect"):
                    gsc.fetch_live_surface(get=FakeGet(robots=response))

    def test_rejects_invalid_xml(self) -> None:
        response = FakeResponse(
            gsc.SITEMAP_URL,
            b"<not-xml",
            content_type="text/xml",
        )
        with self.assertRaisesRegex(gsc.GateError, "valid XML"):
            gsc.fetch_live_surface(get=FakeGet(sitemap=response))

    def test_rejects_wrong_xml_root(self) -> None:
        response = FakeResponse(
            gsc.SITEMAP_URL,
            f'<urlset xmlns="{gsc.XML_NAMESPACE}"/>'.encode("utf-8"),
            content_type="text/xml",
        )
        with self.assertRaisesRegex(gsc.GateError, "exact sitemapindex"):
            gsc.fetch_live_surface(get=FakeGet(sitemap=response))

    def test_rejects_wrong_live_child_count(self) -> None:
        response = FakeResponse(
            gsc.SITEMAP_URL,
            sitemap_xml(9),
            content_type="text/xml",
        )
        with self.assertRaisesRegex(gsc.GateError, "exactly 10"):
            gsc.fetch_live_surface(get=FakeGet(sitemap=response))

    def test_rejects_query_child_url(self) -> None:
        raw = sitemap_xml().replace(
            b"child-0-sitemap.xml",
            b"child-0-sitemap.xml?unsafe=1",
        )
        response = FakeResponse(gsc.SITEMAP_URL, raw, content_type="text/xml")
        with self.assertRaisesRegex(gsc.GateError, "safe contract"):
            gsc.fetch_live_surface(get=FakeGet(sitemap=response))


class OneShotFlowTests(unittest.TestCase):
    def setUp(self) -> None:
        self.now = datetime.now(timezone.utc)
        self.temp = tempfile.TemporaryDirectory()
        self.directory = Path(self.temp.name)
        self.summary_path = self.directory / "technical-summary.json"
        self.summary_sha = write_summary(
            self.summary_path,
            summary_report(self.now),
        )
        self.summary = gsc.validate_summary(
            self.summary_path,
            self.summary_sha,
            now=self.now,
            required_path=self.summary_path,
        )

    def tearDown(self) -> None:
        self.temp.cleanup()

    @staticmethod
    def credentials() -> dict[str, Any]:
        return {
            "same_service_account_identity": True,
            "identity_values_recorded": False,
            "secret_fields_recorded": False,
        }

    def test_execute_refetches_at_boundary_then_submits_once(self) -> None:
        events: list[str] = []
        get = FakeGet(events=events)
        public = gsc.fetch_live_surface(get=get)
        service = FakeService(events)
        code, path, record = gsc.run_with_service(
            service,
            mode="execute",
            summary_path=self.summary_path,
            summary_sha256=self.summary_sha,
            summary=self.summary,
            public_surface=public,
            credentials_evidence=self.credentials(),
            get=get,
            output_dir=self.directory,
            required_summary_path=self.summary_path,
        )
        self.assertEqual(code, 0)
        self.assertTrue(path.is_file())
        self.assertEqual(service.sitemaps_resource.submit_calls, 1)
        self.assertEqual(
            service.sitemaps_resource.submit_arguments,
            [(gsc.PROPERTY_URL, gsc.SITEMAP_URL)],
        )
        self.assertEqual(
            events,
            [
                "get:robots",
                "get:sitemap",
                "api:sites.list",
                "api:sitemaps.list",
                "api:sites.list",
                "api:sitemaps.list",
                "get:robots",
                "get:sitemap",
                "api:sitemaps.submit",
                "api:sitemaps.list",
            ],
        )
        self.assertTrue(record["post_list_exact_target_only"])
        self.assertEqual(record["mutation"]["submit_call_count"], 1)
        self.assertTrue(
            record["evidence_revalidated_immediately_before_submit"]
            ["summary_sha256_rechecked"]
        )

    def test_execute_blocks_before_submit_if_boundary_fetch_fails(self) -> None:
        events: list[str] = []
        initial_get = FakeGet(events=events)
        public = gsc.fetch_live_surface(get=initial_get)
        bad_robots = FakeResponse(gsc.ROBOTS_URL, b"Sitemap: https://example.test/x.xml\n")
        bad_get = FakeGet(robots=bad_robots, events=events)
        service = FakeService(events)
        code, _, record = gsc.run_with_service(
            service,
            mode="execute",
            summary_path=self.summary_path,
            summary_sha256=self.summary_sha,
            summary=self.summary,
            public_surface=public,
            credentials_evidence=self.credentials(),
            get=bad_get,
            output_dir=self.directory,
            required_summary_path=self.summary_path,
        )
        self.assertEqual(code, 2)
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)
        self.assertEqual(record["mutation"]["state"], "evidence_recheck_failed")
        self.assertEqual(record["mutation"]["submit_call_count"], 0)

    def test_execute_rejects_post_list_with_extra_sitemap(self) -> None:
        events: list[str] = []
        get = FakeGet(events=events)
        public = gsc.fetch_live_surface(get=get)
        target = {"path": gsc.SITEMAP_URL}
        extra = {"path": "https://jus-tice.co.il/extra.xml"}
        service = FakeService(events, [[], [], [target, extra]])
        code, _, record = gsc.run_with_service(
            service,
            mode="execute",
            summary_path=self.summary_path,
            summary_sha256=self.summary_sha,
            summary=self.summary,
            public_surface=public,
            credentials_evidence=self.credentials(),
            get=get,
            output_dir=self.directory,
            required_summary_path=self.summary_path,
        )
        self.assertEqual(code, 4)
        self.assertEqual(service.sitemaps_resource.submit_calls, 1)
        self.assertFalse(record["post_list_exact_target_only"])
        self.assertEqual(record["outcome"], "submit_not_verified_by_exact_post_list")

    def test_dry_run_is_read_only_and_requires_zero_existing(self) -> None:
        events: list[str] = []
        get = FakeGet(events=events)
        public = gsc.fetch_live_surface(get=get)
        service = FakeService(events, [[]])
        code, path, record = gsc.run_with_service(
            service,
            mode="dry-run",
            summary_path=self.summary_path,
            summary_sha256=self.summary_sha,
            summary=self.summary,
            public_surface=public,
            credentials_evidence=self.credentials(),
            get=get,
            output_dir=self.directory,
            required_summary_path=self.summary_path,
        )
        self.assertEqual(code, 0)
        self.assertTrue(path.is_file())
        self.assertEqual(service.sitemaps_resource.submit_calls, 0)
        self.assertFalse(record["mutation"]["mutation_performed"])

    def test_evidence_records_do_not_contain_secret_values(self) -> None:
        record = gsc.build_record(
            "dry-run",
            self.summary,
            gsc.fetch_live_surface(get=FakeGet()),
            self.credentials(),
        )
        serialized = json.dumps(record)
        for forbidden in ("private_key", "access_token", "refresh_token", "client_email"):
            self.assertNotIn(forbidden, serialized)


class CliTests(unittest.TestCase):
    @staticmethod
    def evidence_args() -> list[str]:
        return [
            "--expected-technical-summary-evidence",
            str(gsc.SUMMARY_PATH),
            "--expected-technical-summary-sha256",
            "0" * 64,
        ]

    def test_mode_is_required(self) -> None:
        with self.assertRaises(SystemExit):
            gsc.parse_args(self.evidence_args())

    def test_modes_are_mutually_exclusive(self) -> None:
        with self.assertRaises(SystemExit):
            gsc.parse_args(["--dry-run", "--execute", *self.evidence_args()])

    def test_explicit_execute_is_not_dry_run(self) -> None:
        args = gsc.parse_args(["--execute", *self.evidence_args()])
        self.assertTrue(args.execute)
        self.assertFalse(args.dry_run)


if __name__ == "__main__":
    unittest.main(verbosity=2)
