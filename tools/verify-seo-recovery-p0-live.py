#!/usr/bin/env python3
"""Read-only pre/post acceptance verifier for the plugin-only SEO Recovery P0 release.

The verifier reads WordPress credentials from a local .env file, never writes
them to output, and performs only GET and OPTIONS requests against the
live site. It never invokes a mutating REST method.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import html
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass, replace
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Iterable, Mapping, Sequence


ROOT = Path(__file__).resolve().parents[1]
TARGET_BASE_URL = "https://jus-tice.co.il"
REPORT_SCHEMA_VERSION = 6
DEFAULT_REPORT_DIR = (
    ROOT
    / "reports"
    / "seo-recovery-2026-07-31"
    / "release-path"
    / "p0-live-acceptance-2026-08-01"
)

PROFILE_IDS = (23405, 23406, 19130)
QUARANTINED_PROFILE_IDS = (23405, 23406)
APPROVED_PROFILE_ID = 19130
APPROVED_PROFILE_PATH = "/lawyers/advocate-maya-rotenberg/"
QUARANTINED_PROFILE_PATHS_BY_TITLE = {
    "מאיה רוטנברג חברת עורכי דין": "/lawyers/מאיה-רוטנברג-חברת-עורכי-דין/",
    "מאיה רוטנברג משרד עורכי דין": "/lawyers/מאיה-רוטנברג-משרד-עורכי-דין/",
}

CANONICAL_SURFACES = (
    "/mediation-divorce/",
    "/immigration-to-portugal/",
    # Yoast removes the category base on this site. WordPress exposes /news/
    # as term 505's native link; /category/news/ is its pre-existing redirect
    # alias and is not the archive document whose canonical is under test.
    "/news/",
    "/practice-areas/child-support/",
    "/practice-areas/family-law/",
)
HTML_LISTING_SURFACES = (
    "/lawyers/",
    "/city/tel-aviv/",
    "/sitemap-jus-tice/",
    "/site-map/",
)
REPRESENTATIVE_HTML_SURFACES = (
    "/",
    "/lawyers/?area=family-law&city=tel-aviv",
    "/practice-areas/family-law/",
    "/criminal-lawyer-jerusalem/",
    "/real-estate-lawyer-haifa/",
    "/inheritance-lawyer/",
    "/real-estate-lawyer-guide/",
    "/medical-malpractice-lawyer/",
    "/family-dispute-resolution/",
    "/divorce-property-division/",
    "/child-custody/",
    "/child-support/",
    "/divorce-mediation/",
    "/consensual-divorce/",
    "/rabbinical-agreement-approval/",
    "/lawyer-registration/?claim_profile_id=23405",
)
PUBLIC_JSON_SURFACES = (
    (
        "native_lawyer_collection",
        "wp/v2/justice_lawyer",
        {
            "per_page": 100,
            "_fields": "id,title,link,slug",
        },
        None,
    ),
    (
        "knowledge_professionals_all",
        "justice/v1/knowledge/professionals",
        {},
        "professionals",
    ),
    (
        "knowledge_professionals_family_law",
        "justice/v1/knowledge/professionals",
        {"area": "family-law"},
        "professionals",
    ),
    (
        "matched_lawyers_family_law",
        "justice/v1/legal-tools/matched-lawyers",
        {"area": "family-law"},
        "lawyers",
    ),
)
DIRECT_REDIRECT_REPAIRS = (
    "/what-is-a-contract/",
    "/criminal-record-deletion/",
)

DEFAULT_HEALTH_ROUTE = "justice-seo-recovery/v1/healthcheck"
DEFAULT_REQUIRED_PLUGIN_VERSION = "0.1.1"
DEFAULT_REQUIRED_PLUGIN_MARKER = "p0-plugin-only-20260801-v2"
DEFAULT_THEME_HEALTH_ROUTE = "justice/v1/healthcheck"
DEFAULT_REQUIRED_LIVE_THEME = "justice-theme"
DEFAULT_REQUIRED_LIVE_THEME_VERSION = "2.23.0"
DEFAULT_REQUIRED_LIVE_THEME_MARKER = "2026-07-06-home-keywords-upperfold-v1"
EXPECTED_ROBOTS_SITEMAP_URL = f"{TARGET_BASE_URL}/sitemap_index.xml"

KNOWN_TEMP_SNIPPET_PREFIXES = (
    "tmp-justice-ops-live-digest-",
    "tmp-snippet-cleanup-",
    "tmp-plugin-live-files-",
    "tmp-seo-recovery-",
    "tmp-justice-seo-recovery-",
    "tmp-seo-p0-",
    "tmp-p0-",
)
KNOWN_TEMP_ROUTE_PREFIXES = (
    "/seo-recovery-forensics/v1/",
    "/seo-recovery-deploy/v1/",
    "/justice-seo-recovery-deploy/v1/",
    "/agentdeploy/v1/",
    "/justicedeploy/v1/",
)

IMPORTER_PROFILE_PRECONDITIONS = {
    23405: "מאיה רוטנברג חברת עורכי דין",
    23406: "מאיה רוטנברג משרד עורכי דין",
}

MAX_BODY_BYTES = 12 * 1024 * 1024
USER_AGENT = "Justice-SEO-Recovery-Acceptance/1.0"


class VerificationError(RuntimeError):
    """A safe, credential-free verification error."""


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_iso(value: datetime | None = None) -> str:
    return (value or utc_now()).isoformat().replace("+00:00", "Z")


def timestamp_slug(value: datetime | None = None) -> str:
    return (value or utc_now()).strftime("%Y%m%dT%H%M%SZ")


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def parse_dotenv(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].lstrip()
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", key):
            continue
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        values[key] = value
    return values


def dotenv_candidates(explicit: Path | None) -> list[Path]:
    candidates: list[Path] = []
    if explicit is not None:
        candidates.append(explicit)
    candidates.extend((Path.cwd() / ".env", ROOT / ".env"))
    candidates.extend(parent / ".env" for parent in list(ROOT.parents)[:4])
    unique: list[Path] = []
    seen: set[str] = set()
    for candidate in candidates:
        resolved = candidate.expanduser().resolve(strict=False)
        marker = os.path.normcase(str(resolved))
        if marker not in seen:
            seen.add(marker)
            unique.append(resolved)
    return unique


def load_configuration(
    explicit_env_file: Path | None,
    base_url_override: str | None,
) -> tuple[dict[str, str], Path | None]:
    loaded: dict[str, str] = {}
    used_path: Path | None = None
    for candidate in dotenv_candidates(explicit_env_file):
        if candidate.is_file():
            loaded.update(parse_dotenv(candidate))
            used_path = candidate
            break
    if explicit_env_file is not None and used_path is None:
        raise VerificationError("the explicitly selected .env file does not exist")

    def first_value(*names: str) -> str:
        for name in names:
            value = os.environ.get(name) or loaded.get(name)
            if value:
                return value
        return ""

    config = {
        "WP_BASE_URL": base_url_override
        or first_value("WP_BASE_URL", "JUSTICE_WP_BASE_URL"),
        "WP_USER": first_value("WP_USER", "JUSTICE_WP_USER"),
        "WP_APP_PASSWORD": first_value(
            "WP_APP_PASSWORD",
            "JUSTICE_WP_APP_PASSWORD",
        ),
    }
    missing = [key for key, value in config.items() if not value]
    if missing:
        raise VerificationError(
            "missing required .env values: " + ", ".join(sorted(missing))
        )
    config["WP_BASE_URL"] = validate_target_base_url(config["WP_BASE_URL"])
    return config, used_path


def redact_text(value: object, secrets: Iterable[str]) -> str:
    text = str(value)
    for secret in secrets:
        if secret:
            text = text.replace(secret, "[REDACTED]")
    return text


def uri_from_iri(value: str) -> str:
    parts = urllib.parse.urlsplit(value)
    hostname = parts.hostname.encode("idna").decode("ascii") if parts.hostname else ""
    if parts.port is not None:
        hostname = f"{hostname}:{parts.port}"
    if parts.username or parts.password:
        raise VerificationError("URLs containing user information are not allowed")
    path = urllib.parse.quote(urllib.parse.unquote(parts.path), safe="/:@!$&'()*+,;=-._~")
    query = urllib.parse.quote(urllib.parse.unquote(parts.query), safe="=&/:@!$'()*+,;?-._~")
    return urllib.parse.urlunsplit((parts.scheme, hostname, path, query, ""))


def normalize_url(value: str, base_url: str | None = None) -> str:
    if base_url:
        value = urllib.parse.urljoin(base_url.rstrip("/") + "/", value)
    parts = urllib.parse.urlsplit(uri_from_iri(html.unescape(value.strip())))
    scheme = parts.scheme.lower()
    host = (parts.hostname or "").lower()
    if not scheme or not host:
        return ""
    port = parts.port
    if port and not ((scheme == "https" and port == 443) or (scheme == "http" and port == 80)):
        host = f"{host}:{port}"
    path = re.sub(r"/{2,}", "/", urllib.parse.unquote(parts.path or "/"))
    if path != "/" and not path.endswith("/"):
        path += "/"
    path = urllib.parse.quote(path, safe="/:@!$&'()*+,;=-._~")
    return urllib.parse.urlunsplit((scheme, host, path, "", ""))


def normalize_document_url(value: str, base_url: str) -> str:
    """Normalize a canonical/og URL only when query and fragment are absent."""

    resolved = urllib.parse.urljoin(base_url.rstrip("/") + "/", html.unescape(value.strip()))
    parts = urllib.parse.urlsplit(resolved)
    if parts.query or parts.fragment:
        return ""
    return normalize_url(resolved)


def validate_target_base_url(value: str) -> str:
    """Fail closed unless the configured destination is the exact production root."""

    candidate = value.strip()
    try:
        raw_parts = urllib.parse.urlsplit(candidate)
        parts = urllib.parse.urlsplit(uri_from_iri(candidate))
        port = parts.port
    except (UnicodeError, ValueError) as error:
        raise VerificationError(f"invalid WordPress base URL: {error}") from None
    if (
        parts.scheme.lower() != "https"
        or (parts.hostname or "").lower() != "jus-tice.co.il"
        or port is not None
        or parts.username is not None
        or parts.password is not None
        or parts.path not in ("", "/")
        or bool(raw_parts.query)
        or bool(raw_parts.fragment)
        or normalize_url(candidate) != normalize_url(TARGET_BASE_URL)
    ):
        raise VerificationError(
            f"WordPress base URL must be the exact production root {TARGET_BASE_URL}"
        )
    return TARGET_BASE_URL


def url_origin(value: str) -> tuple[str, str, int | None]:
    parts = urllib.parse.urlsplit(value)
    scheme = parts.scheme.lower()
    host = (parts.hostname or "").lower()
    port = parts.port
    if port is None:
        port = 443 if scheme == "https" else 80 if scheme == "http" else None
    return scheme, host, port


class RecordingRedirectHandler(urllib.request.HTTPRedirectHandler):
    def __init__(self, request_url: str) -> None:
        super().__init__()
        self.chain: list[dict[str, object]] = []
        self.allowed_origin = url_origin(request_url)

    def redirect_request(
        self,
        request: urllib.request.Request,
        file_pointer: Any,
        code: int,
        message: str,
        headers: Mapping[str, str],
        new_url: str,
    ) -> urllib.request.Request | None:
        resolved_url = urllib.parse.urljoin(request.full_url, new_url)
        self.chain.append(
            {
                "status": int(code),
                "from": request.full_url,
                "to": resolved_url,
            }
        )
        if url_origin(resolved_url) != self.allowed_origin:
            return None
        return super().redirect_request(
            request,
            file_pointer,
            code,
            message,
            headers,
            resolved_url,
        )


@dataclass
class HttpResult:
    requested_url: str
    status: int
    final_url: str
    headers: dict[str, str]
    body: bytes
    redirects: list[dict[str, object]]
    transport: str = "direct"
    pretty_preflight_status: int | None = None

    @property
    def text(self) -> str:
        content_type = self.headers.get("content-type", "")
        charset_match = re.search(r"charset=([^;\s]+)", content_type, re.I)
        charset = charset_match.group(1).strip("\"'") if charset_match else "utf-8"
        try:
            return self.body.decode(charset, errors="replace")
        except LookupError:
            return self.body.decode("utf-8", errors="replace")

    def json_value(self) -> Any:
        return json.loads(self.text)

    def summary(self) -> dict[str, object]:
        return {
            "status": self.status,
            "requested_url": self.requested_url,
            "final_url": self.final_url,
            "redirects": self.redirects,
            "transport": self.transport,
            "pretty_preflight_status": self.pretty_preflight_status,
            "content_type": self.headers.get("content-type", ""),
            "bytes": len(self.body),
            "sha256": sha256_bytes(self.body),
        }


class WordPressClient:
    def __init__(
        self,
        base_url: str,
        username: str,
        application_password: str,
        timeout: float,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        token = base64.b64encode(
            f"{username}:{application_password}".encode("utf-8")
        ).decode("ascii")
        self.authorization = f"Basic {token}"
        self._authenticated_site_verified = False

    def public_url(self, path: str) -> str:
        return uri_from_iri(f"{self.base_url}/{path.lstrip('/')}")

    def request_url(
        self,
        method: str,
        url: str,
        *,
        authenticated: bool = False,
        json_body: object | None = None,
        transport: str = "direct",
        _identity_probe: bool = False,
    ) -> HttpResult:
        method = method.upper()
        if method not in {"GET", "OPTIONS"} or json_body is not None:
            raise VerificationError(
                "live acceptance verifier refuses mutating HTTP requests"
            )
        encoded_url = uri_from_iri(url)
        if authenticated:
            if url_origin(encoded_url) != url_origin(self.base_url):
                raise VerificationError(
                    "refused to send WordPress credentials outside the exact target origin"
                )
            if not self._authenticated_site_verified and not _identity_probe:
                raise VerificationError(
                    "authenticated WordPress request attempted before site identity verification"
                )
        headers = {
            "Accept": "application/json, application/xml, text/xml, text/html;q=0.9, */*;q=0.5",
            "Cache-Control": "no-cache",
            "User-Agent": USER_AGENT,
        }
        data: bytes | None = None
        if authenticated:
            headers["Authorization"] = self.authorization
        if json_body is not None:
            data = json.dumps(
                json_body,
                ensure_ascii=False,
                separators=(",", ":"),
            ).encode("utf-8")
            headers["Content-Type"] = "application/json"
        request = urllib.request.Request(
            encoded_url,
            data=data,
            headers=headers,
            method=method,
        )
        redirect_handler = RecordingRedirectHandler(encoded_url)
        opener = urllib.request.build_opener(redirect_handler)
        try:
            response = opener.open(request, timeout=self.timeout)
            try:
                body = response.read(MAX_BODY_BYTES + 1)
                status = int(response.status)
                final_url = response.geturl()
                response_headers = {
                    key.lower(): value for key, value in response.headers.items()
                }
            finally:
                response.close()
        except urllib.error.HTTPError as error:
            try:
                body = error.read(MAX_BODY_BYTES + 1)
                status = int(error.code)
                final_url = error.geturl()
                response_headers = {
                    key.lower(): value for key, value in error.headers.items()
                }
            finally:
                error.close()
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            raise VerificationError(
                f"HTTP {method} failed for {encoded_url}: {error.reason if isinstance(error, urllib.error.URLError) else error}"
            ) from None
        if len(body) > MAX_BODY_BYTES:
            raise VerificationError(
                f"response exceeded {MAX_BODY_BYTES} bytes for {encoded_url}"
            )
        return HttpResult(
            requested_url=encoded_url,
            status=status,
            final_url=final_url,
            headers=response_headers,
            body=body,
            redirects=list(redirect_handler.chain),
            transport=transport,
        )

    @staticmethod
    def is_host_html_403(result: HttpResult) -> bool:
        if result.status != 403:
            return False
        try:
            result.json_value()
            return False
        except (json.JSONDecodeError, UnicodeDecodeError):
            pass
        content_type = result.headers.get("content-type", "").lower()
        prefix = result.text[:2048].lower()
        return "application/json" not in content_type and (
            "text/html" in content_type
            or "<html" in prefix
            or "<!doctype html" in prefix
        )

    def rest(
        self,
        method: str,
        route: str,
        *,
        params: Mapping[str, object] | None = None,
        authenticated: bool = False,
        json_body: object | None = None,
        _identity_probe: bool = False,
    ) -> HttpResult:
        route = route.strip("/")
        if _identity_probe and (
            method.upper() != "GET" or route != "wp/v2/settings"
        ):
            raise VerificationError("invalid authenticated site identity probe")
        query = urllib.parse.urlencode(params or {}, doseq=True)
        pretty_url = f"{self.base_url}/wp-json/{route}"
        if query:
            pretty_url += "?" + query
        result = self.request_url(
            method,
            pretty_url,
            authenticated=authenticated,
            json_body=json_body,
            transport="pretty",
            _identity_probe=_identity_probe,
        )
        if not self.is_host_html_403(result):
            return result

        fallback_params: dict[str, object] = {"rest_route": f"/{route}"}
        fallback_params.update(params or {})
        fallback_url = f"{self.base_url}/?{urllib.parse.urlencode(fallback_params, doseq=True)}"
        fallback = self.request_url(
            method,
            fallback_url,
            authenticated=authenticated,
            json_body=json_body,
            transport="query-fallback",
            _identity_probe=_identity_probe,
        )
        return replace(fallback, pretty_preflight_status=result.status)

    def mark_authenticated_site_verified(self) -> None:
        self._authenticated_site_verified = True


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.canonicals: list[str] = []
        self.og_urls: list[str] = []
        self.hrefs: list[str] = []
        self.text_nodes: list[str] = []
        self.attribute_values: list[dict[str, str]] = []
        self.json_ld_blocks: list[str] = []
        self._json_ld_chunks: list[str] | None = None

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        tag_name = tag.lower()
        values = {key.lower(): value or "" for key, value in attrs}
        for name, value in values.items():
            if value.strip():
                self.attribute_values.append(
                    {
                        "tag": tag_name,
                        "name": name,
                        "value": value.strip(),
                    }
                )
        href = values.get("href", "").strip()
        if href:
            self.hrefs.append(href)
        if tag_name == "link" and "canonical" in values.get("rel", "").lower().split():
            if href:
                self.canonicals.append(href)
        if tag_name == "meta":
            property_name = (values.get("property") or values.get("name") or "").lower()
            if property_name == "og:url" and values.get("content"):
                self.og_urls.append(values["content"].strip())
        if (
            tag_name == "script"
            and values.get("type", "").split(";", 1)[0].strip().lower()
            == "application/ld+json"
        ):
            self._json_ld_chunks = []

    def handle_data(self, data: str) -> None:
        normalized = re.sub(r"\s+", " ", html.unescape(data)).strip()
        if normalized:
            self.text_nodes.append(normalized)
        if self._json_ld_chunks is not None:
            self._json_ld_chunks.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "script" and self._json_ld_chunks is not None:
            self.json_ld_blocks.append("".join(self._json_ld_chunks))
            self._json_ld_chunks = None


def parse_page(result: HttpResult) -> PageParser:
    parser = PageParser()
    parser.feed(result.text)
    parser.close()
    return parser


def parse_xml_locs(result: HttpResult) -> tuple[list[str], str | None]:
    try:
        root = ET.fromstring(result.body)
    except ET.ParseError as error:
        return [], str(error)
    locs: list[str] = []
    for element in root.iter():
        if element.tag.rsplit("}", 1)[-1].lower() == "loc" and element.text:
            value = element.text.strip()
            if value:
                locs.append(value)
    return locs, None


def normalized_link_counts(
    urls: Iterable[str],
    targets: Mapping[int, str],
    base_url: str,
) -> dict[str, int]:
    normalized_urls = [normalize_url(url, base_url) for url in urls]
    return {
        str(profile_id): sum(
            1 for value in normalized_urls if value == normalize_url(target_url)
        )
        for profile_id, target_url in targets.items()
    }


def json_ld_strings(blocks: Iterable[str]) -> tuple[list[str], int]:
    strings: list[str] = []
    parse_errors = 0

    def walk(value: object) -> None:
        if isinstance(value, str):
            strings.append(value)
        elif isinstance(value, list):
            for item in value:
                walk(item)
        elif isinstance(value, dict):
            for item in value.values():
                walk(item)

    for block in blocks:
        try:
            walk(json.loads(html.unescape(block)))
        except (json.JSONDecodeError, TypeError):
            parse_errors += 1
    return strings, parse_errors


def normalize_exact_text(value: object) -> str:
    return re.sub(r"\s+", " ", html.unescape(str(value))).strip()


def parsed_json_ld_values(blocks: Iterable[str]) -> tuple[list[object], int]:
    values: list[object] = []
    parse_errors = 0
    for block in blocks:
        try:
            values.append(json.loads(html.unescape(block)))
        except (json.JSONDecodeError, TypeError):
            parse_errors += 1
    return values, parse_errors


def structured_profile_matches(
    values: Iterable[object],
    targets: Mapping[int, str],
    base_url: str,
) -> dict[str, list[dict[str, object]]]:
    bad_ids = set(QUARANTINED_PROFILE_IDS)
    bad_titles = {
        normalize_exact_text(title): profile_id
        for profile_id, title in IMPORTER_PROFILE_PRECONDITIONS.items()
    }
    bad_urls = {
        normalize_url(targets[profile_id]): profile_id
        for profile_id in QUARANTINED_PROFILE_IDS
    }
    id_key_names = {
        "id",
        "lawyer_id",
        "post_id",
        "professional_id",
        "profile_id",
    }
    id_matches: list[dict[str, object]] = []
    url_matches: list[dict[str, object]] = []
    title_matches: list[dict[str, object]] = []

    def walk(value: object, path: str, semantic_key: str = "") -> None:
        if isinstance(value, dict):
            for key, item in value.items():
                key_text = str(key)
                child_path = f"{path}.{key_text}" if path else key_text
                walk(item, child_path, key_text)
            return
        if isinstance(value, list):
            for index, item in enumerate(value):
                walk(item, f"{path}[{index}]", semantic_key)
            return

        normalized_key = re.sub(
            r"[^a-z0-9]+",
            "_",
            semantic_key.lower(),
        ).strip("_")
        exact_id: int | None = None
        if normalized_key in id_key_names:
            if isinstance(value, int) and not isinstance(value, bool):
                exact_id = value
            elif isinstance(value, str) and value.strip().isdigit():
                exact_id = int(value.strip())
        if exact_id in bad_ids:
            id_matches.append(
                {
                    "path": path,
                    "profile_id": exact_id,
                }
            )

        if not isinstance(value, str):
            return
        exact_text = normalize_exact_text(value)
        if exact_text in bad_titles:
            title_matches.append(
                {
                    "path": path,
                    "profile_id": bad_titles[exact_text],
                    "title": exact_text,
                }
            )
        try:
            exact_url = normalize_url(value, base_url)
        except (UnicodeError, ValueError):
            exact_url = ""
        if exact_url in bad_urls:
            url_matches.append(
                {
                    "path": path,
                    "profile_id": bad_urls[exact_url],
                    "url": exact_url,
                }
            )

    for root_index, value in enumerate(values):
        walk(value, f"$[{root_index}]")
    return {
        "exact_id_matches": id_matches,
        "exact_decoded_url_matches": url_matches,
        "exact_title_matches": title_matches,
    }


def html_profile_identity_observation(
    parser: PageParser,
    targets: Mapping[int, str],
    base_url: str,
) -> dict[str, object]:
    json_ld_values, json_ld_parse_errors = parsed_json_ld_values(
        parser.json_ld_blocks
    )
    matches = structured_profile_matches(json_ld_values, targets, base_url)
    bad_ids = set(QUARANTINED_PROFILE_IDS)
    bad_titles = {
        normalize_exact_text(title): profile_id
        for profile_id, title in IMPORTER_PROFILE_PRECONDITIONS.items()
    }

    for index, row in enumerate(parser.attribute_values):
        value = row.get("value", "").strip()
        if value.isdigit() and int(value) in bad_ids:
            matches["exact_id_matches"].append(
                {
                    "path": f"attribute[{index}].{row.get('name', '')}",
                    "profile_id": int(value),
                }
            )
        exact_text = normalize_exact_text(value)
        if exact_text in bad_titles:
            matches["exact_title_matches"].append(
                {
                    "path": f"attribute[{index}].{row.get('name', '')}",
                    "profile_id": bad_titles[exact_text],
                    "title": exact_text,
                }
            )

    for index, text_node in enumerate(parser.text_nodes):
        if text_node in bad_titles:
            matches["exact_title_matches"].append(
                {
                    "path": f"text_node[{index}]",
                    "profile_id": bad_titles[text_node],
                    "title": text_node,
                }
            )
    return {
        **matches,
        "json_ld_block_count": len(parser.json_ld_blocks),
        "json_ld_parse_errors": json_ld_parse_errors,
        "comparison_method": (
            "parsed HTML attributes and text nodes plus parsed JSON-LD exact "
            "identity equality; numeric and text substrings are ignored"
        ),
    }


def raw_target_presence(body: str, target_url: str) -> bool:
    normalized = normalize_url(target_url)
    path = urllib.parse.unquote(urllib.parse.urlsplit(normalized).path)
    encoded_path = urllib.parse.quote(path, safe="/")
    variants = {
        normalized,
        normalized.replace("/", r"\/"),
        path,
        encoded_path,
        encoded_path.replace("/", r"\/"),
    }
    decoded = html.unescape(body)
    return any(variant and variant in decoded for variant in variants)


def reference_observation(
    result: HttpResult,
    urls: Iterable[str],
    targets: Mapping[int, str],
    base_url: str,
    *,
    json_ld_blocks: Iterable[str] = (),
) -> dict[str, object]:
    counts = normalized_link_counts(urls, targets, base_url)
    blocks = list(json_ld_blocks)
    structured_strings, json_ld_parse_errors = json_ld_strings(blocks)
    structured_counts = normalized_link_counts(
        structured_strings,
        targets,
        base_url,
    )
    references: dict[str, object] = {}
    for profile_id, target_url in targets.items():
        parsed_count = counts[str(profile_id)]
        raw_present = raw_target_presence(result.text, target_url)
        json_ld_raw_present = any(
            raw_target_presence(block, target_url) for block in blocks
        )
        json_ld_parsed_count = structured_counts[str(profile_id)]
        references[str(profile_id)] = {
            "target_url": normalize_url(target_url),
            "parsed_url_count": parsed_count,
            "raw_present": raw_present,
            "json_ld_block_count": len(blocks),
            "json_ld_parse_errors": json_ld_parse_errors,
            "json_ld_parsed_url_count": json_ld_parsed_count,
            "json_ld_raw_present": json_ld_raw_present,
            "json_ld_present": bool(
                json_ld_parsed_count or json_ld_raw_present
            ),
            "present": bool(
                parsed_count
                or raw_present
                or json_ld_parsed_count
                or json_ld_raw_present
            ),
        }
    return references


def json_object(result: HttpResult, label: str) -> dict[str, Any]:
    try:
        value = result.json_value()
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        raise VerificationError(f"{label} returned invalid JSON: {error}") from None
    if not isinstance(value, dict):
        raise VerificationError(f"{label} did not return a JSON object")
    return value


def stable_json_sha256(value: object) -> str:
    serialized = json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return sha256_bytes(serialized)


def site_identity_observation(client: WordPressClient) -> dict[str, object]:
    """Verify public identity before the one permitted authenticated probe."""

    expected = normalize_url(TARGET_BASE_URL)
    public_result = client.rest("GET", "")
    if public_result.status != 200:
        raise VerificationError(
            f"public WordPress REST index returned HTTP {public_result.status}"
        )
    public_payload = json_object(public_result, "public WordPress REST index")
    public_url = normalize_url(str(public_payload.get("url") or ""))
    public_home = normalize_url(str(public_payload.get("home") or ""))
    if (
        public_url != expected
        or public_home != expected
        or url_origin(public_result.final_url) != url_origin(TARGET_BASE_URL)
    ):
        raise VerificationError(
            "public WordPress REST identity does not match the exact target site"
        )

    settings_result = client.rest(
        "GET",
        "wp/v2/settings",
        params={"_fields": "url"},
        authenticated=True,
        _identity_probe=True,
    )
    if settings_result.status != 200:
        raise VerificationError(
            f"authenticated WordPress settings identity returned HTTP {settings_result.status}"
        )
    settings_payload = json_object(
        settings_result,
        "authenticated WordPress settings identity",
    )
    settings_url = normalize_url(str(settings_payload.get("url") or ""))
    if (
        settings_url != expected
        or url_origin(settings_result.final_url) != url_origin(TARGET_BASE_URL)
    ):
        raise VerificationError(
            "authenticated WordPress settings identity does not match the exact target site"
        )
    client.mark_authenticated_site_verified()
    return {
        "expected_base_url": TARGET_BASE_URL,
        "public_rest_index": {
            "request": public_result.summary(),
            "url": public_url,
            "home": public_home,
        },
        "authenticated_settings": {
            "request": settings_result.summary(),
            "url": settings_url,
        },
    }


def profile_record(
    client: WordPressClient,
    profile_id: int,
) -> tuple[dict[str, object], HttpResult]:
    result = client.rest(
        "GET",
        f"wp/v2/justice_lawyer/{profile_id}",
        params={
            "context": "edit",
            "_fields": (
                "id,title,status,slug,link,modified_gmt,practice-areas,city"
            ),
        },
        authenticated=True,
    )
    if result.status != 200:
        raise VerificationError(
            f"authenticated profile {profile_id} returned HTTP {result.status}"
        )
    payload = json_object(result, f"authenticated profile {profile_id}")
    required_field_names = (
        "id",
        "title",
        "status",
        "slug",
        "link",
        "modified_gmt",
        "practice-areas",
        "city",
    )
    missing_fields = [
        field for field in required_field_names if field not in payload
    ]
    if missing_fields:
        raise VerificationError(
            f"authenticated profile {profile_id} omitted required fields: "
            + ", ".join(missing_fields)
        )
    observed_id = int(payload.get("id") or 0)
    if observed_id != profile_id:
        raise VerificationError(
            f"authenticated profile {profile_id} returned ID {observed_id}"
        )
    title_value = payload.get("title")
    title = ""
    if isinstance(title_value, dict):
        title = html.unescape(str(title_value.get("rendered") or "")).strip()
    record = {
        "id": observed_id,
        "status": str(payload.get("status") or ""),
        "title": title,
        "slug": str(payload.get("slug") or ""),
        "link": str(payload.get("link") or ""),
        "modified_gmt": str(payload.get("modified_gmt") or ""),
        "practice_area_term_ids": payload.get("practice-areas"),
        "city_term_ids": payload.get("city"),
        "body_sha256": sha256_bytes(result.body),
        "request": result.summary(),
    }
    return record, result


def collect_profiles(
    client: WordPressClient,
) -> dict[str, dict[str, object]]:
    records: dict[str, dict[str, object]] = {}
    for profile_id in PROFILE_IDS:
        record, _ = profile_record(client, profile_id)
        records[str(profile_id)] = record
    return records


def profile_targets(
    client: WordPressClient,
    records: Mapping[str, Mapping[str, object]],
) -> dict[int, str]:
    targets: dict[int, str] = {}
    expected_titles = set(QUARANTINED_PROFILE_PATHS_BY_TITLE)
    observed_titles: set[str] = set()
    for profile_id in PROFILE_IDS:
        record = records.get(str(profile_id), {})
        title = str(record.get("title") or "")
        if profile_id == APPROVED_PROFILE_ID:
            path = APPROVED_PROFILE_PATH
        else:
            path = QUARANTINED_PROFILE_PATHS_BY_TITLE.get(title, "")
            if not path:
                raise VerificationError(
                    f"authenticated profile {profile_id} has an unexpected title"
                )
            observed_titles.add(title)

        expected_url = normalize_url(client.public_url(path))
        observed_url = normalize_url(str(record.get("link") or ""))
        expected_slug = urllib.parse.unquote(path.strip("/").rsplit("/", 1)[-1])
        observed_slug = urllib.parse.unquote(str(record.get("slug") or "").strip("/"))
        if (
            not observed_url
            or url_origin(observed_url) != url_origin(client.base_url)
            or observed_url != expected_url
            or observed_slug != expected_slug
        ):
            raise VerificationError(
                f"authenticated profile {profile_id} link or slug changed"
            )
        targets[profile_id] = observed_url
    if observed_titles != expected_titles:
        raise VerificationError(
            "the quarantined profile titles do not map one-to-one to their public URLs"
        )
    return targets


def importer_route_observation(client: WordPressClient) -> dict[str, object]:
    result = client.rest(
        "OPTIONS",
        "justice-ops/v1/lawyer-index-import",
        authenticated=True,
    )
    if result.status != 200:
        raise VerificationError(
            f"lawyer importer OPTIONS returned HTTP {result.status}"
        )
    payload = json_object(result, "lawyer importer OPTIONS")
    endpoint_rows: list[dict[str, object]] = []
    endpoints = payload.get("endpoints")
    if not isinstance(endpoints, list):
        raise VerificationError("lawyer importer OPTIONS has no endpoints array")
    for endpoint in endpoints:
        if not isinstance(endpoint, dict):
            raise VerificationError("lawyer importer OPTIONS endpoint is not an object")
        methods = endpoint.get("methods")
        args = endpoint.get("args")
        endpoint_rows.append(
            {
                "methods": sorted(str(method).upper() for method in methods)
                if isinstance(methods, list)
                else [],
                "argument_names": sorted(str(name) for name in args)
                if isinstance(args, dict)
                else [],
            }
        )
    schema = {
        "namespace": str(payload.get("namespace") or ""),
        "methods": sorted(
            str(method).upper() for method in payload.get("methods", [])
        )
        if isinstance(payload.get("methods"), list)
        else [],
        "endpoints": endpoint_rows,
    }
    return {
        "request": result.summary(),
        "request_method": "OPTIONS",
        "schema": schema,
        "schema_sha256": stable_json_sha256(schema),
        "profile_preconditions": {
            str(profile_id): expected_title
            for profile_id, expected_title in IMPORTER_PROFILE_PRECONDITIONS.items()
        },
    }


def collect_snippets(
    client: WordPressClient,
    snippet_prefixes: Sequence[str],
    route_prefixes: Sequence[str],
) -> dict[str, object]:
    snippets: list[dict[str, Any]] = []
    page = 1
    total_pages = 1
    page_requests: list[dict[str, object]] = []
    while page <= total_pages:
        result = client.rest(
            "GET",
            "code-snippets/v1/snippets",
            params={"per_page": 100, "page": page},
            authenticated=True,
        )
        page_requests.append(result.summary())
        if result.status != 200:
            raise VerificationError(
                f"Code Snippets collection page {page} returned HTTP {result.status}"
            )
        try:
            payload = result.json_value()
        except (json.JSONDecodeError, UnicodeDecodeError) as error:
            raise VerificationError(
                f"Code Snippets collection returned invalid JSON: {error}"
            ) from None
        if isinstance(payload, dict):
            page_items = payload.get("snippets") or payload.get("data") or []
        else:
            page_items = payload
        if not isinstance(page_items, list):
            raise VerificationError("Code Snippets collection is not an array")
        snippets.extend(item for item in page_items if isinstance(item, dict))
        header_pages = result.headers.get("x-wp-totalpages", "")
        if header_pages.isdigit():
            total_pages = max(1, int(header_pages))
        elif len(page_items) >= 100:
            total_pages = page + 1
        if total_pages > 100:
            raise VerificationError("Code Snippets pagination exceeded 100 pages")
        page += 1

    targeted: list[dict[str, object]] = []
    unclassified_tmp: list[dict[str, object]] = []
    for snippet in snippets:
        name = str(snippet.get("name") or "")
        if not name.lower().startswith("tmp-"):
            continue
        code = str(snippet.get("code") or "")
        matched_by = [
            f"name:{prefix}"
            for prefix in snippet_prefixes
            if name.lower().startswith(prefix.lower())
        ]
        matched_by.extend(
            f"route:{prefix}"
            for prefix in route_prefixes
            if prefix.strip("/").lower() in code.lower()
        )
        summary = {
            "id": int(snippet.get("id") or 0),
            "name": name,
            "active": bool(snippet.get("active")),
            "scope": str(snippet.get("scope") or ""),
        }
        if matched_by:
            summary["matched_by"] = sorted(set(matched_by))
            targeted.append(summary)
        else:
            unclassified_tmp.append(summary)

    index_result = client.rest("GET", "")
    if index_result.status != 200:
        raise VerificationError(
            f"WordPress REST index returned HTTP {index_result.status}"
        )
    index_payload = json_object(index_result, "WordPress REST index")
    routes_value = index_payload.get("routes")
    if not isinstance(routes_value, dict):
        raise VerificationError("WordPress REST index has no routes object")
    registered_routes = sorted(str(route) for route in routes_value)
    temporary_routes = sorted(
        route
        for route in registered_routes
        if any(route.lower().startswith(prefix.lower()) for prefix in route_prefixes)
    )

    return {
        "collection_requests": page_requests,
        "total_snippets": len(snippets),
        "targeted_matches": sorted(targeted, key=lambda row: (row["id"], row["name"])),
        "unclassified_tmp": sorted(
            unclassified_tmp,
            key=lambda row: (row["id"], row["name"]),
        ),
        "rest_index_request": index_result.summary(),
        "temporary_registered_routes": temporary_routes,
    }


def health_observation(
    client: WordPressClient,
    health_route: str,
) -> dict[str, object]:
    result = client.rest("GET", health_route)
    value: dict[str, Any] = {}
    json_error = ""
    try:
        parsed = result.json_value()
        if isinstance(parsed, dict):
            value = parsed
        else:
            json_error = "response is not an object"
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        json_error = str(error)
    return {
        "request": result.summary(),
        "authenticated": False,
        "version": str(value.get("version") or ""),
        "marker": str(value.get("marker") or ""),
        "response_fields": sorted(str(key) for key in value),
        "json_error": json_error,
    }


def theme_health_observation(
    client: WordPressClient,
    health_route: str,
) -> dict[str, object]:
    result = client.rest("GET", health_route)
    payload = json_object(result, "public theme healthcheck") if result.status == 200 else {}
    return {
        "request": result.summary(),
        "authenticated": False,
        "theme": str(payload.get("theme") or ""),
        "theme_version": str(payload.get("theme_version") or ""),
        "deploy_marker": str(payload.get("deploy_marker") or ""),
        "response_fields": sorted(str(key) for key in payload),
    }


def robots_observation(client: WordPressClient) -> dict[str, object]:
    def summarize(result: HttpResult) -> dict[str, object]:
        sitemap_values: list[str] = []
        for raw_line in result.text.splitlines():
            active_line = raw_line.split("#", 1)[0].strip()
            if not active_line or ":" not in active_line:
                continue
            name, value = active_line.split(":", 1)
            if name.strip().lower() == "sitemap" and value.strip():
                sitemap_values.append(value.strip())

        directive_rows: list[dict[str, object]] = []
        for value in sitemap_values:
            absolute = urllib.parse.urljoin(TARGET_BASE_URL + "/", value)
            resolved = normalize_document_url(absolute, TARGET_BASE_URL)
            raw_lower = html.unescape(value).lower()
            resolved_path = urllib.parse.unquote(
                urllib.parse.urlsplit(resolved or absolute).path
            ).lower()
            forbidden_kinds: list[str] = []
            if (
                "/wp-json/" in raw_lower
                or "rest_route=" in raw_lower
                or "/justice/v1/sitemap/" in raw_lower
            ):
                forbidden_kinds.append("rest")
            if resolved_path == "/wp-sitemap.xml" or resolved_path.startswith(
                "/wp-sitemap-"
            ):
                forbidden_kinds.append("core")
            if not resolved:
                forbidden_kinds.append("invalid")
            elif resolved != normalize_url(EXPECTED_ROBOTS_SITEMAP_URL):
                forbidden_kinds.append("deprecated_or_unapproved")
            directive_rows.append(
                {
                    "value": value,
                    "resolved_url": resolved,
                    "forbidden_kinds": forbidden_kinds,
                }
            )

        content_type = result.headers.get("content-type", "")
        return {
            "request": result.summary(),
            "content_type_media_type": content_type.split(";", 1)[0]
            .strip()
            .lower(),
            "sitemap_directive_count": len(directive_rows),
            "sitemap_directives": directive_rows,
        }

    authoritative_result = client.request_url(
        "GET",
        client.public_url("/robots.txt"),
    )
    cache_buster = timestamp_slug()
    cache_busted_result = client.request_url(
        "GET",
        client.public_url("/robots.txt")
        + "?"
        + urllib.parse.urlencode({"justice_p0_verify": cache_buster}),
    )
    authoritative = summarize(authoritative_result)
    cache_busted = summarize(cache_busted_result)
    return {
        "expected_sitemap_url": normalize_url(EXPECTED_ROBOTS_SITEMAP_URL),
        "authoritative": authoritative,
        "cache_busted": cache_busted,
        "cache_buster": cache_buster,
        "semantic_match": (
            authoritative.get("content_type_media_type")
            == cache_busted.get("content_type_media_type")
            and authoritative.get("sitemap_directives")
            == cache_busted.get("sitemap_directives")
        ),
        "body_sha256_match": authoritative_result.summary().get("sha256")
        == cache_busted_result.summary().get("sha256"),
    }


def public_profile_observations(
    client: WordPressClient,
    targets: Mapping[int, str],
) -> dict[str, dict[str, object]]:
    observations: dict[str, dict[str, object]] = {}
    for profile_id, target_url in sorted(targets.items()):
        result = client.request_url("GET", target_url)
        observations[str(profile_id)] = {
            "url": normalize_url(target_url),
            "request": result.summary(),
        }
    return observations


def custom_sitemap_observation(
    client: WordPressClient,
    targets: Mapping[int, str],
) -> dict[str, object]:
    result = client.rest("GET", "justice/v1/sitemap/lawyers")
    locs, parse_error = parse_xml_locs(result)
    return {
        "request": result.summary(),
        "xml_error": parse_error,
        "loc_count": len(locs),
        "references": reference_observation(
            result,
            locs,
            targets,
            client.base_url,
        ),
    }


def map_feed_observation(
    client: WordPressClient,
    targets: Mapping[int, str],
) -> dict[str, object]:
    result = client.rest(
        "GET",
        "justice/v1/map/offices",
        params={"justice_p0_verify": timestamp_slug()},
    )
    if result.status != 200:
        raise VerificationError(f"map feed returned HTTP {result.status}")
    payload = json_object(result, "map feed")
    features = payload.get("features")
    if not isinstance(features, list):
        raise VerificationError("map feed has no features array")

    bad_ids = set(QUARANTINED_PROFILE_IDS)
    bad_urls = {
        profile_id: normalize_url(targets[profile_id])
        for profile_id in QUARANTINED_PROFILE_IDS
    }
    id_matches: list[dict[str, object]] = []
    url_matches: list[dict[str, object]] = []
    lawyer_feature_count = 0
    for index, feature in enumerate(features):
        if not isinstance(feature, dict):
            continue
        properties = feature.get("properties")
        if not isinstance(properties, dict):
            continue
        if str(properties.get("kind") or "").lower() == "lawyer":
            lawyer_feature_count += 1

        property_id = properties.get("id")
        exact_id: int | None = None
        if isinstance(property_id, int) and not isinstance(property_id, bool):
            exact_id = property_id
        elif isinstance(property_id, str) and property_id.strip().isdigit():
            exact_id = int(property_id.strip())
        if exact_id in bad_ids:
            id_matches.append(
                {
                    "feature_index": index,
                    "properties_id": exact_id,
                }
            )

        property_url = properties.get("url")
        decoded_url = (
            normalize_url(str(property_url), client.base_url)
            if isinstance(property_url, str) and property_url.strip()
            else ""
        )
        for profile_id, bad_url in bad_urls.items():
            if decoded_url and decoded_url == bad_url:
                url_matches.append(
                    {
                        "feature_index": index,
                        "profile_id": profile_id,
                        "properties_url": decoded_url,
                    }
                )

    return {
        "request": result.summary(),
        "geojson_type": str(payload.get("type") or ""),
        "feature_count": len(features),
        "lawyer_feature_count": lawyer_feature_count,
        "quarantined_target_urls": {
            str(profile_id): url for profile_id, url in bad_urls.items()
        },
        "exact_properties_id_matches": id_matches,
        "decoded_properties_url_matches": url_matches,
        "comparison_method": (
            "parsed GeoJSON properties.id exact integer equality and decoded "
            "properties.url normalized URL equality; raw substrings are ignored"
        ),
    }


def public_json_surface_observations(
    client: WordPressClient,
    targets: Mapping[int, str],
) -> dict[str, dict[str, object]]:
    def expected_rest_url(route: str, params: Mapping[str, object]) -> str:
        query = urllib.parse.urlencode(params, doseq=True)
        value = f"{client.base_url}/wp-json/{route.strip('/')}"
        if query:
            value += "?" + query
        return uri_from_iri(value)

    observations: dict[str, dict[str, object]] = {}
    for key, route, params, collection_key in PUBLIC_JSON_SURFACES:
        requests: list[dict[str, object]] = []
        expected_urls: list[str] = []
        json_errors: list[dict[str, object]] = []
        payload: object | None = None
        rows: list[object] = []
        page_count = 1

        if collection_key is None:
            page = 1
            total_pages = 1
            page_payloads_valid = True
            while page <= total_pages:
                page_params = dict(params)
                page_params["page"] = page
                result = client.rest("GET", route, params=page_params)
                requests.append(result.summary())
                expected_urls.append(expected_rest_url(route, page_params))
                try:
                    page_payload = result.json_value()
                except (json.JSONDecodeError, UnicodeDecodeError) as error:
                    page_payload = None
                    json_errors.append({"page": page, "error": str(error)})
                if not isinstance(page_payload, list):
                    page_payloads_valid = False
                else:
                    rows.extend(page_payload)
                header_pages = result.headers.get("x-wp-totalpages", "")
                if header_pages.isdigit():
                    total_pages = max(1, int(header_pages))
                if total_pages > 100:
                    raise VerificationError(
                        "native public lawyer collection exceeded 100 pages"
                    )
                page += 1
            page_count = total_pages
            payload = rows
            collection: object = rows
            payload_type_valid = page_payloads_valid
        else:
            result = client.rest("GET", route, params=params)
            requests.append(result.summary())
            expected_urls.append(expected_rest_url(route, params))
            try:
                payload = result.json_value()
            except (json.JSONDecodeError, UnicodeDecodeError) as error:
                payload = None
                json_errors.append({"page": 1, "error": str(error)})
            collection = (
                payload.get(collection_key) if isinstance(payload, dict) else None
            )
            rows = collection if isinstance(collection, list) else []
            payload_type_valid = isinstance(payload, dict)

        expected_payload_type = "array" if collection_key is None else "object"
        structurally_valid = (
            payload_type_valid
            and isinstance(collection, list)
            and all(isinstance(row, dict) for row in rows)
            and not json_errors
        )
        matches = structured_profile_matches(
            [payload] if payload is not None else [],
            targets,
            client.base_url,
        )
        observations[key] = {
            "route": route,
            "params": dict(params),
            "expected_url": expected_urls[0] if expected_urls else "",
            "expected_urls": expected_urls,
            "request": requests[0] if requests else {},
            "requests": requests,
            "authenticated": False,
            "expected_payload_type": expected_payload_type,
            "collection_key": collection_key,
            "structurally_valid": structurally_valid,
            "page_count": page_count,
            "row_count": len(rows),
            "all_rows_are_objects": all(isinstance(row, dict) for row in rows),
            "json_errors": json_errors,
            "reported_area": str(payload.get("area") or "")
            if isinstance(payload, dict)
            else "",
            **matches,
            "comparison_method": (
                "parsed JSON semantic ID keys plus exact decoded URL and exact "
                "full-string title equality; numeric and text substrings are ignored"
            ),
        }
    return observations


def is_lawyer_sitemap(url: str) -> bool:
    path = urllib.parse.urlsplit(url).path.lower()
    filename = path.rsplit("/", 1)[-1]
    return "sitemap" in filename and bool(
        re.search(r"(?:justice[_-]?)?lawyer", filename)
    )


def yoast_sitemaps_observation(
    client: WordPressClient,
    targets: Mapping[int, str],
) -> dict[str, object]:
    index_url = client.public_url("/sitemap_index.xml")
    index_result = client.request_url("GET", index_url)
    index_locs, index_error = parse_xml_locs(index_result)
    lawyer_urls = sorted({url for url in index_locs if is_lawyer_sitemap(url)})
    base_origin = urllib.parse.urlsplit(client.base_url)
    sitemap_rows: list[dict[str, object]] = []
    union_reference = {str(profile_id): False for profile_id in targets}
    for url in lawyer_urls:
        parts = urllib.parse.urlsplit(url)
        same_origin = (
            parts.scheme.lower() == base_origin.scheme.lower()
            and (parts.hostname or "").lower() == (base_origin.hostname or "").lower()
        )
        if not same_origin:
            sitemap_rows.append(
                {
                    "url": url,
                    "same_origin": False,
                    "request": None,
                    "xml_error": "external sitemap URL refused",
                    "loc_count": 0,
                    "references": {},
                }
            )
            continue
        result = client.request_url("GET", url)
        locs, parse_error = parse_xml_locs(result)
        references = reference_observation(
            result,
            locs,
            targets,
            client.base_url,
        )
        for profile_id, observation in references.items():
            if bool(observation["present"]):
                union_reference[profile_id] = True
        sitemap_rows.append(
            {
                "url": url,
                "same_origin": True,
                "request": result.summary(),
                "xml_error": parse_error,
                "loc_count": len(locs),
                "references": references,
            }
        )
    return {
        "index_request": index_result.summary(),
        "index_xml_error": index_error,
        "index_loc_count": len(index_locs),
        "lawyer_sitemap_count": len(lawyer_urls),
        "lawyer_sitemaps": sitemap_rows,
        "union_presence": union_reference,
    }


def html_surface_observation(
    client: WordPressClient,
    path: str,
    targets: Mapping[int, str],
) -> dict[str, object]:
    expected_url = uri_from_iri(client.public_url(path))
    result = client.request_url("GET", expected_url)
    parser = parse_page(result)
    return {
        "expected_url": expected_url,
        "request": result.summary(),
        "authenticated": False,
        "href_count": len(parser.hrefs),
        "references": reference_observation(
            result,
            (*parser.hrefs, *parser.og_urls),
            targets,
            client.base_url,
            json_ld_blocks=parser.json_ld_blocks,
        ),
        "profile_identity": html_profile_identity_observation(
            parser,
            targets,
            client.base_url,
        ),
    }


def html_listing_observations(
    client: WordPressClient,
    targets: Mapping[int, str],
) -> dict[str, dict[str, object]]:
    observations: dict[str, dict[str, object]] = {}
    for path in HTML_LISTING_SURFACES:
        observations[path] = html_surface_observation(client, path, targets)
    return observations


def representative_html_observations(
    client: WordPressClient,
    targets: Mapping[int, str],
) -> dict[str, dict[str, object]]:
    observations: dict[str, dict[str, object]] = {}
    for path in REPRESENTATIVE_HTML_SURFACES:
        observations[path] = html_surface_observation(client, path, targets)
    return observations


def canonical_surface_observations(
    client: WordPressClient,
    targets: Mapping[int, str],
) -> dict[str, dict[str, object]]:
    observations: dict[str, dict[str, object]] = {}
    for path in CANONICAL_SURFACES:
        expected_url = normalize_url(client.public_url(path))
        result = client.request_url("GET", client.public_url(path))
        parser = parse_page(result)
        observations[path] = {
            "expected_url": expected_url,
            "request": result.summary(),
            "canonicals": [
                normalize_document_url(value, result.final_url)
                for value in parser.canonicals
            ],
            "og_urls": [
                normalize_document_url(value, result.final_url)
                for value in parser.og_urls
            ],
            "references": reference_observation(
                result,
                (*parser.hrefs, *parser.og_urls),
                targets,
                client.base_url,
                json_ld_blocks=parser.json_ld_blocks,
            ),
        }
    return observations


def direct_redirect_observations(
    client: WordPressClient,
) -> dict[str, dict[str, object]]:
    observations: dict[str, dict[str, object]] = {}
    for path in DIRECT_REDIRECT_REPAIRS:
        expected_url = normalize_url(client.public_url(path))
        result = client.request_url("GET", client.public_url(path))
        parser = parse_page(result)
        observations[path] = {
            "expected_url": expected_url,
            "request": result.summary(),
            "canonicals": [
                normalize_document_url(value, result.final_url)
                for value in parser.canonicals
            ],
        }
    return observations


def add_check(
    checks: list[dict[str, object]],
    check_id: str,
    passed: bool,
    evidence: object,
    *,
    enforced: bool,
) -> None:
    checks.append(
        {
            "id": check_id,
            "passed": bool(passed),
            "enforced": enforced,
            "evidence": evidence,
        }
    )


def request_is_direct_200(observation: Mapping[str, object]) -> bool:
    request = observation.get("request")
    if not isinstance(request, dict):
        return False
    expected = str(observation.get("expected_url") or "")
    return (
        request.get("status") == 200
        and request.get("redirects") == []
        and normalize_url(str(request.get("final_url") or "")) == expected
    )


def request_is_exact_direct_200(observation: Mapping[str, object]) -> bool:
    request = observation.get("request")
    if not isinstance(request, dict):
        return False
    expected_url = str(observation.get("expected_url") or "")
    requested_url = str(request.get("requested_url") or "")
    return (
        request.get("status") == 200
        and request.get("redirects") == []
        and request.get("transport") == "direct"
        and bool(requested_url)
        and requested_url == request.get("final_url")
        and (not expected_url or requested_url == expected_url)
    )


def reference_present(observation: Mapping[str, object], profile_id: int) -> bool:
    references = observation.get("references")
    if not isinstance(references, dict):
        return False
    value = references.get(str(profile_id))
    return isinstance(value, dict) and bool(value.get("present"))


def approved_presence_map(observations: Mapping[str, object]) -> dict[str, bool]:
    result: dict[str, bool] = {}
    sitemaps = observations.get("sitemaps")
    if isinstance(sitemaps, dict):
        custom = sitemaps.get("custom")
        if isinstance(custom, dict):
            result["custom_rest_lawyer_sitemap"] = reference_present(
                custom,
                APPROVED_PROFILE_ID,
            )
        yoast = sitemaps.get("yoast")
        if isinstance(yoast, dict):
            union = yoast.get("union_presence")
            result["yoast_lawyer_sitemaps"] = (
                isinstance(union, dict) and bool(union.get(str(APPROVED_PROFILE_ID)))
            )
    listings = observations.get("html_listings")
    if isinstance(listings, dict):
        for path in HTML_LISTING_SURFACES:
            surface = listings.get(path)
            result[path] = isinstance(surface, dict) and reference_present(
                surface,
                APPROVED_PROFILE_ID,
            )
    return result


def build_checks(
    observations: Mapping[str, object],
    *,
    expect: str,
    required_plugin_version: str,
    required_plugin_marker: str,
    required_live_theme: str,
    required_live_theme_version: str,
    required_live_theme_marker: str,
    baseline: Mapping[str, object] | None,
    strict_all_tmp_snippets: bool,
) -> list[dict[str, object]]:
    enforced = expect == "post"
    checks: list[dict[str, object]] = []

    site_identity = observations.get("site_identity")
    site_identity = site_identity if isinstance(site_identity, dict) else {}
    public_identity = site_identity.get("public_rest_index")
    public_identity = public_identity if isinstance(public_identity, dict) else {}
    authenticated_identity = site_identity.get("authenticated_settings")
    authenticated_identity = (
        authenticated_identity if isinstance(authenticated_identity, dict) else {}
    )
    public_identity_request = public_identity.get("request")
    public_identity_request = (
        public_identity_request if isinstance(public_identity_request, dict) else {}
    )
    authenticated_identity_request = authenticated_identity.get("request")
    authenticated_identity_request = (
        authenticated_identity_request
        if isinstance(authenticated_identity_request, dict)
        else {}
    )
    expected_identity = normalize_url(TARGET_BASE_URL)
    identity_ok = (
        site_identity.get("expected_base_url") == TARGET_BASE_URL
        and public_identity_request.get("status") == 200
        and authenticated_identity_request.get("status") == 200
        and public_identity.get("url") == expected_identity
        and public_identity.get("home") == expected_identity
        and authenticated_identity.get("url") == expected_identity
    )
    add_check(
        checks,
        "exact_public_and_authenticated_site_identity",
        identity_ok,
        site_identity,
        enforced=enforced,
    )

    theme_health = observations.get("theme_health")
    theme_health = theme_health if isinstance(theme_health, dict) else {}
    theme_health_request = theme_health.get("request")
    theme_health_request = (
        theme_health_request if isinstance(theme_health_request, dict) else {}
    )
    theme_health_ok = (
        theme_health.get("authenticated") is False
        and theme_health_request.get("status") == 200
        and theme_health_request.get("redirects") == []
        and theme_health_request.get("transport") == "pretty"
        and theme_health_request.get("pretty_preflight_status") is None
        and theme_health_request.get("requested_url")
        == theme_health_request.get("final_url")
        and theme_health_request.get("requested_url")
        == f"{TARGET_BASE_URL}/wp-json/{DEFAULT_THEME_HEALTH_ROUTE}"
        and theme_health.get("theme") == required_live_theme
        and theme_health.get("theme_version") == required_live_theme_version
        and theme_health.get("deploy_marker") == required_live_theme_marker
    )
    add_check(
        checks,
        "public_theme_health_version_and_marker",
        theme_health_ok,
        {
            "precondition": "live_theme_must_remain_unchanged",
            "request": theme_health_request,
            "authenticated": theme_health.get("authenticated"),
            "theme": theme_health.get("theme"),
            "theme_version": theme_health.get("theme_version"),
            "deploy_marker": theme_health.get("deploy_marker"),
            "required_unchanged_live_theme": required_live_theme,
            "required_unchanged_live_theme_version": required_live_theme_version,
            "required_unchanged_live_theme_marker": required_live_theme_marker,
        },
        enforced=enforced,
    )

    robots = observations.get("robots")
    robots = robots if isinstance(robots, dict) else {}
    authoritative_robots = robots.get("authoritative")
    authoritative_robots = (
        authoritative_robots if isinstance(authoritative_robots, dict) else {}
    )
    cache_busted_robots = robots.get("cache_busted")
    cache_busted_robots = (
        cache_busted_robots if isinstance(cache_busted_robots, dict) else {}
    )

    def robots_variant_ok(
        variant: Mapping[str, object],
        *,
        authoritative: bool,
    ) -> bool:
        request = variant.get("request")
        request = request if isinstance(request, dict) else {}
        directives = variant.get("sitemap_directives")
        directives = directives if isinstance(directives, list) else []
        if len(directives) != 1 or not isinstance(directives[0], dict):
            return False
        directive = directives[0]
        requested_url = str(request.get("requested_url") or "")
        query = urllib.parse.parse_qs(urllib.parse.urlsplit(requested_url).query)
        request_target_ok = (
            requested_url == f"{TARGET_BASE_URL}/robots.txt"
            if authoritative
            else (
                url_origin(requested_url) == url_origin(TARGET_BASE_URL)
                and urllib.parse.urlsplit(requested_url).path == "/robots.txt"
                and sorted(query) == ["justice_p0_verify"]
                and len(query.get("justice_p0_verify", [])) == 1
                and bool(query["justice_p0_verify"][0])
            )
        )
        return (
            request.get("status") == 200
            and request.get("redirects") == []
            and request.get("transport") == "direct"
            and requested_url == request.get("final_url")
            and request_target_ok
            and variant.get("content_type_media_type") == "text/plain"
            and variant.get("sitemap_directive_count") == 1
            and directive.get("value") == EXPECTED_ROBOTS_SITEMAP_URL
            and directive.get("resolved_url")
            == normalize_url(EXPECTED_ROBOTS_SITEMAP_URL)
            and directive.get("forbidden_kinds") == []
        )

    robots_ok = (
        robots_variant_ok(authoritative_robots, authoritative=True)
        and robots_variant_ok(cache_busted_robots, authoritative=False)
        and robots.get("semantic_match") is True
        and robots.get("body_sha256_match") is True
    )
    add_check(
        checks,
        "robots_direct_yoast_sitemap_only",
        robots_ok,
        {
            "expected_sitemap_url": normalize_url(EXPECTED_ROBOTS_SITEMAP_URL),
            "authoritative": authoritative_robots,
            "cache_busted": cache_busted_robots,
            "semantic_match": robots.get("semantic_match"),
            "body_sha256_match": robots.get("body_sha256_match"),
        },
        enforced=enforced,
    )

    health = observations.get("health")
    health = health if isinstance(health, dict) else {}
    health_request = health.get("request") if isinstance(health.get("request"), dict) else {}
    plugin_health_ok = (
        health.get("authenticated") is False
        and health_request.get("status") == 200
        and health_request.get("redirects") == []
        and health_request.get("transport") == "pretty"
        and health_request.get("pretty_preflight_status") is None
        and health_request.get("requested_url") == health_request.get("final_url")
        and health_request.get("requested_url")
        == f"{TARGET_BASE_URL}/wp-json/{DEFAULT_HEALTH_ROUTE}"
        and str(health_request.get("content_type") or "")
        .lower()
        .startswith("application/json")
        and health.get("json_error") == ""
        and health.get("version") == required_plugin_version
        and health.get("marker") == required_plugin_marker
    )
    add_check(
        checks,
        "p0_health_version_and_marker",
        plugin_health_ok,
        {
            "contract": "required_plugin_must_be_active",
            "request": health_request,
            "authenticated": health.get("authenticated"),
            "version": health.get("version"),
            "marker": health.get("marker"),
            "required_plugin_version": required_plugin_version,
            "required_plugin_marker": required_plugin_marker,
            "json_error": health.get("json_error"),
        },
        enforced=enforced,
    )

    profiles = observations.get("profiles")
    profiles = profiles if isinstance(profiles, dict) else {}
    authenticated_profiles = profiles.get("authenticated")
    public = profiles.get("public")
    authenticated_profiles = (
        authenticated_profiles if isinstance(authenticated_profiles, dict) else {}
    )
    public = public if isinstance(public, dict) else {}
    auth_ok = all(
        isinstance(authenticated_profiles.get(str(profile_id)), dict)
        and authenticated_profiles[str(profile_id)].get("id") == profile_id
        and authenticated_profiles[str(profile_id)].get("request", {}).get("status")
        == 200
        and bool(authenticated_profiles[str(profile_id)].get("title"))
        and authenticated_profiles[str(profile_id)].get("status") == "publish"
        for profile_id in PROFILE_IDS
    )
    add_check(
        checks,
        "authenticated_context_edit_reads_all_profiles",
        auth_ok,
        {
            "observed_ids": sorted(
                int(key) for key in authenticated_profiles if key.isdigit()
            )
        },
        enforced=enforced,
    )

    importer_preconditions_ok = all(
        isinstance(authenticated_profiles.get(str(profile_id)), dict)
        and authenticated_profiles[str(profile_id)].get("title") == expected_title
        and authenticated_profiles[str(profile_id)].get("status") == "publish"
        for profile_id, expected_title in IMPORTER_PROFILE_PRECONDITIONS.items()
    )
    add_check(
        checks,
        "importer_target_profile_preconditions_are_exact",
        importer_preconditions_ok,
        {
            str(profile_id): {
                "expected_title": expected_title,
                "observed_title": authenticated_profiles.get(
                    str(profile_id),
                    {},
                ).get("title")
                if isinstance(authenticated_profiles.get(str(profile_id)), dict)
                else None,
                "status": authenticated_profiles.get(str(profile_id), {}).get(
                    "status"
                )
                if isinstance(authenticated_profiles.get(str(profile_id)), dict)
                else None,
            }
            for profile_id, expected_title in IMPORTER_PROFILE_PRECONDITIONS.items()
        },
        enforced=enforced,
    )

    quarantined_statuses: dict[str, object] = {}
    quarantined_ok = True
    for profile_id in QUARANTINED_PROFILE_IDS:
        row = public.get(str(profile_id))
        request = row.get("request") if isinstance(row, dict) else {}
        status = request.get("status") if isinstance(request, dict) else None
        redirects = request.get("redirects") if isinstance(request, dict) else None
        final_url = normalize_url(str(request.get("final_url") or "")) if isinstance(request, dict) else ""
        expected_url = str(row.get("url") or "") if isinstance(row, dict) else ""
        passed = status == 404 and redirects == [] and final_url == expected_url
        quarantined_ok = quarantined_ok and passed
        quarantined_statuses[str(profile_id)] = {
            "status": status,
            "redirects": redirects,
            "final_url": final_url,
            "expected_url": expected_url,
        }
    add_check(
        checks,
        "quarantined_profiles_remain_direct_404",
        quarantined_ok,
        quarantined_statuses,
        enforced=enforced,
    )

    approved_row = public.get(str(APPROVED_PROFILE_ID))
    approved_request = approved_row.get("request") if isinstance(approved_row, dict) else {}
    approved_url = str(approved_row.get("url") or "") if isinstance(approved_row, dict) else ""
    approved_ok = (
        isinstance(approved_request, dict)
        and approved_request.get("status") == 200
        and approved_request.get("redirects") == []
        and normalize_url(str(approved_request.get("final_url") or "")) == approved_url
    )
    add_check(
        checks,
        "approved_profile_remains_direct_200",
        approved_ok,
        {
            "status": approved_request.get("status") if isinstance(approved_request, dict) else None,
            "url": approved_url,
        },
        enforced=enforced,
    )

    sitemaps = observations.get("sitemaps")
    sitemaps = sitemaps if isinstance(sitemaps, dict) else {}
    custom = sitemaps.get("custom")
    custom = custom if isinstance(custom, dict) else {}
    custom_request = custom.get("request") if isinstance(custom.get("request"), dict) else {}
    custom_bad = [
        profile_id
        for profile_id in QUARANTINED_PROFILE_IDS
        if reference_present(custom, profile_id)
    ]
    add_check(
        checks,
        "custom_rest_lawyer_sitemap_excludes_quarantined_profiles",
        custom_request.get("status") == 200
        and custom.get("xml_error") is None
        and not custom_bad,
        {
            "status": custom_request.get("status"),
            "xml_error": custom.get("xml_error"),
            "quarantined_references": custom_bad,
        },
        enforced=enforced,
    )

    map_feed = observations.get("map_feed")
    map_feed = map_feed if isinstance(map_feed, dict) else {}
    map_request = map_feed.get("request")
    map_request = map_request if isinstance(map_request, dict) else {}
    map_id_matches = map_feed.get("exact_properties_id_matches")
    map_url_matches = map_feed.get("decoded_properties_url_matches")
    map_id_matches = map_id_matches if isinstance(map_id_matches, list) else []
    map_url_matches = map_url_matches if isinstance(map_url_matches, list) else []
    map_ok = (
        map_request.get("status") == 200
        and map_feed.get("geojson_type") == "FeatureCollection"
        and int(map_feed.get("feature_count") or 0) > 0
        and not map_id_matches
        and not map_url_matches
    )
    add_check(
        checks,
        "map_feed_structurally_excludes_quarantined_profiles",
        map_ok,
        {
            "request": map_request,
            "geojson_type": map_feed.get("geojson_type"),
            "feature_count": map_feed.get("feature_count"),
            "lawyer_feature_count": map_feed.get("lawyer_feature_count"),
            "exact_properties_id_matches": map_id_matches,
            "decoded_properties_url_matches": map_url_matches,
            "comparison_method": map_feed.get("comparison_method"),
        },
        enforced=enforced,
    )

    public_json_surfaces = observations.get("public_json_surfaces")
    public_json_surfaces = (
        public_json_surfaces if isinstance(public_json_surfaces, dict) else {}
    )
    for key, _route, _params, _collection_key in PUBLIC_JSON_SURFACES:
        surface = public_json_surfaces.get(key)
        surface = surface if isinstance(surface, dict) else {}
        requests = surface.get("requests")
        requests = requests if isinstance(requests, list) else []
        expected_urls = surface.get("expected_urls")
        expected_urls = expected_urls if isinstance(expected_urls, list) else []
        id_matches = surface.get("exact_id_matches")
        url_matches = surface.get("exact_decoded_url_matches")
        title_matches = surface.get("exact_title_matches")
        id_matches = id_matches if isinstance(id_matches, list) else []
        url_matches = url_matches if isinstance(url_matches, list) else []
        title_matches = title_matches if isinstance(title_matches, list) else []
        reported_area_ok = (
            surface.get("reported_area") == "family-law"
            if key == "matched_lawyers_family_law"
            else True
        )
        public_direct_ok = (
            surface.get("authenticated") is False
            and bool(requests)
            and len(requests) == len(expected_urls)
            and all(
                isinstance(request, dict)
                and request.get("status") == 200
                and request.get("redirects") == []
                and request.get("transport") == "pretty"
                and request.get("pretty_preflight_status") is None
                and request.get("requested_url") == request.get("final_url")
                and request.get("requested_url") == expected_url
                and str(request.get("content_type") or "")
                .lower()
                .startswith("application/json")
                for request, expected_url in zip(requests, expected_urls)
            )
        )
        add_check(
            checks,
            "public_json_structurally_excludes_quarantined_profiles_" + key,
            public_direct_ok
            and surface.get("structurally_valid") is True
            and reported_area_ok
            and not id_matches
            and not url_matches
            and not title_matches,
            {
                "route": surface.get("route"),
                "params": surface.get("params"),
                "expected_urls": expected_urls,
                "requests": requests,
                "expected_payload_type": surface.get("expected_payload_type"),
                "collection_key": surface.get("collection_key"),
                "structurally_valid": surface.get("structurally_valid"),
                "page_count": surface.get("page_count"),
                "row_count": surface.get("row_count"),
                "reported_area": surface.get("reported_area"),
                "exact_id_matches": id_matches,
                "exact_decoded_url_matches": url_matches,
                "exact_title_matches": title_matches,
                "comparison_method": surface.get("comparison_method"),
            },
            enforced=enforced,
        )

    yoast = sitemaps.get("yoast")
    yoast = yoast if isinstance(yoast, dict) else {}
    index_request = yoast.get("index_request") if isinstance(yoast.get("index_request"), dict) else {}
    lawyer_sitemaps = yoast.get("lawyer_sitemaps")
    lawyer_sitemaps = lawyer_sitemaps if isinstance(lawyer_sitemaps, list) else []
    yoast_failures: list[dict[str, object]] = []
    for sitemap in lawyer_sitemaps:
        if not isinstance(sitemap, dict):
            continue
        request = sitemap.get("request") if isinstance(sitemap.get("request"), dict) else {}
        bad_ids = [
            profile_id
            for profile_id in QUARANTINED_PROFILE_IDS
            if reference_present(sitemap, profile_id)
        ]
        if (
            not sitemap.get("same_origin")
            or request.get("status") != 200
            or sitemap.get("xml_error") is not None
            or bad_ids
        ):
            yoast_failures.append(
                {
                    "url": sitemap.get("url"),
                    "same_origin": sitemap.get("same_origin"),
                    "status": request.get("status"),
                    "xml_error": sitemap.get("xml_error"),
                    "quarantined_references": bad_ids,
                }
            )
    yoast_ok = (
        index_request.get("status") == 200
        and yoast.get("index_xml_error") is None
        and int(yoast.get("lawyer_sitemap_count") or 0) > 0
        and len(lawyer_sitemaps) == int(yoast.get("lawyer_sitemap_count") or 0)
        and not yoast_failures
    )
    add_check(
        checks,
        "every_yoast_lawyer_sitemap_excludes_quarantined_profiles",
        yoast_ok,
        {
            "index_status": index_request.get("status"),
            "lawyer_sitemap_count": yoast.get("lawyer_sitemap_count"),
            "failures": yoast_failures,
        },
        enforced=enforced,
    )

    html_listings = observations.get("html_listings")
    html_listings = html_listings if isinstance(html_listings, dict) else {}
    for path in HTML_LISTING_SURFACES:
        surface = html_listings.get(path)
        surface = surface if isinstance(surface, dict) else {}
        request = surface.get("request") if isinstance(surface.get("request"), dict) else {}
        bad_ids = [
            profile_id
            for profile_id in QUARANTINED_PROFILE_IDS
            if reference_present(surface, profile_id)
        ]
        add_check(
            checks,
            "listing_excludes_quarantined_profiles_"
            + re.sub(r"[^a-z0-9]+", "_", path.lower()).strip("_"),
            surface.get("authenticated") is False
            and request_is_exact_direct_200(surface)
            and not bad_ids,
            {
                "path": path,
                "expected_url": surface.get("expected_url"),
                "request": request,
                "quarantined_references": bad_ids,
            },
            enforced=enforced,
        )

    representative_html = observations.get("representative_html_surfaces")
    representative_html = (
        representative_html if isinstance(representative_html, dict) else {}
    )
    for path in REPRESENTATIVE_HTML_SURFACES:
        surface = representative_html.get(path)
        surface = surface if isinstance(surface, dict) else {}
        profile_identity = surface.get("profile_identity")
        profile_identity = (
            profile_identity if isinstance(profile_identity, dict) else {}
        )
        bad_references = [
            profile_id
            for profile_id in QUARANTINED_PROFILE_IDS
            if reference_present(surface, profile_id)
        ]
        id_matches = profile_identity.get("exact_id_matches")
        url_matches = profile_identity.get("exact_decoded_url_matches")
        title_matches = profile_identity.get("exact_title_matches")
        id_matches = id_matches if isinstance(id_matches, list) else []
        url_matches = url_matches if isinstance(url_matches, list) else []
        title_matches = title_matches if isinstance(title_matches, list) else []
        surface_slug = re.sub(r"[^a-z0-9]+", "_", path.lower()).strip("_")
        add_check(
            checks,
            "representative_html_surface_excludes_quarantined_profiles_"
            + (surface_slug or "homepage"),
            request_is_exact_direct_200(surface)
            and surface.get("authenticated") is False
            and not bad_references
            and not id_matches
            and not url_matches
            and not title_matches,
            {
                "path": path,
                "expected_url": surface.get("expected_url"),
                "request": surface.get("request"),
                "quarantined_url_references": bad_references,
                "exact_id_matches": id_matches,
                "exact_decoded_url_matches": url_matches,
                "exact_title_matches": title_matches,
                "comparison_method": profile_identity.get("comparison_method"),
            },
            enforced=enforced,
        )

    canonical_surfaces = observations.get("canonical_surfaces")
    canonical_surfaces = canonical_surfaces if isinstance(canonical_surfaces, dict) else {}
    for path in CANONICAL_SURFACES:
        surface = canonical_surfaces.get(path)
        surface = surface if isinstance(surface, dict) else {}
        expected_url = str(surface.get("expected_url") or "")
        canonicals = surface.get("canonicals")
        og_urls = surface.get("og_urls")
        canonicals = canonicals if isinstance(canonicals, list) else []
        og_urls = og_urls if isinstance(og_urls, list) else []
        passed = (
            request_is_exact_direct_200(surface)
            and canonicals == [expected_url]
            and og_urls == [expected_url]
        )
        add_check(
            checks,
            "self_canonical_and_og_"
            + re.sub(r"[^a-z0-9]+", "_", path.lower()).strip("_"),
            passed,
            {
                "path": path,
                "expected_url": expected_url,
                "canonicals": canonicals,
                "og_urls": og_urls,
                "request": surface.get("request"),
            },
            enforced=enforced,
        )
        bad_ids = [
            profile_id
            for profile_id in QUARANTINED_PROFILE_IDS
            if reference_present(surface, profile_id)
        ]
        add_check(
            checks,
            "canonical_surface_excludes_quarantined_profiles_"
            + re.sub(r"[^a-z0-9]+", "_", path.lower()).strip("_"),
            request_is_exact_direct_200(surface) and not bad_ids,
            {
                "path": path,
                "quarantined_references": bad_ids,
                "references": {
                    str(profile_id): surface.get("references", {}).get(
                        str(profile_id),
                        {},
                    )
                    if isinstance(surface.get("references"), dict)
                    else {}
                    for profile_id in QUARANTINED_PROFILE_IDS
                },
                "request": surface.get("request"),
            },
            enforced=enforced,
        )

    redirects = observations.get("direct_redirect_repairs")
    redirects = redirects if isinstance(redirects, dict) else {}
    for path in DIRECT_REDIRECT_REPAIRS:
        surface = redirects.get(path)
        surface = surface if isinstance(surface, dict) else {}
        expected_url = str(surface.get("expected_url") or "")
        canonicals = surface.get("canonicals")
        canonicals = canonicals if isinstance(canonicals, list) else []
        add_check(
            checks,
            "direct_200_self_canonical_"
            + re.sub(r"[^a-z0-9]+", "_", path.lower()).strip("_"),
            request_is_exact_direct_200(surface) and canonicals == [expected_url],
            {
                "path": path,
                "expected_url": expected_url,
                "canonicals": canonicals,
                "request": surface.get("request"),
            },
            enforced=enforced,
        )

    importer_route = observations.get("importer_route")
    importer_route = importer_route if isinstance(importer_route, dict) else {}
    importer_request = importer_route.get("request")
    importer_request = importer_request if isinstance(importer_request, dict) else {}
    importer_schema = importer_route.get("schema")
    importer_schema = importer_schema if isinstance(importer_schema, dict) else {}
    importer_endpoints = importer_schema.get("endpoints")
    importer_endpoints = (
        importer_endpoints if isinstance(importer_endpoints, list) else []
    )
    route_shape_ok = (
        importer_route.get("request_method") == "OPTIONS"
        and importer_request.get("status") == 200
        and importer_schema.get("namespace") == "justice-ops/v1"
        and importer_schema.get("methods") == ["POST"]
        and len(importer_endpoints) == 1
        and isinstance(importer_endpoints[0], dict)
        and importer_endpoints[0].get("methods") == ["POST"]
    )
    baseline_schema_sha256 = ""
    if baseline is not None:
        baseline_observations = baseline.get("observations")
        if isinstance(baseline_observations, dict):
            baseline_importer_route = baseline_observations.get("importer_route")
            if isinstance(baseline_importer_route, dict):
                baseline_schema_sha256 = str(
                    baseline_importer_route.get("schema_sha256") or ""
                )
    schema_matches_baseline = (
        bool(baseline_schema_sha256)
        and importer_route.get("schema_sha256") == baseline_schema_sha256
    )
    add_check(
        checks,
        "importer_route_schema_observed_without_invocation",
        route_shape_ok
        and (baseline is None or schema_matches_baseline),
        {
            "request_method": importer_route.get("request_method"),
            "request_status": importer_request.get("status"),
            "schema": importer_schema,
            "schema_sha256": importer_route.get("schema_sha256"),
            "baseline_schema_sha256": baseline_schema_sha256,
            "schema_matches_baseline": schema_matches_baseline,
            "route_invoked": False,
        },
        enforced=enforced,
    )

    if baseline is not None:
        baseline_observations = baseline.get("observations")
        baseline_observations = (
            baseline_observations if isinstance(baseline_observations, dict) else {}
        )
        expected_presence = {
            key: value
            for key, value in approved_presence_map(baseline_observations).items()
            if value
        }
        current_presence = approved_presence_map(observations)
        preserved = bool(expected_presence) and all(
            current_presence.get(key) is True for key in expected_presence
        )
    else:
        expected_presence = {
            key: value
            for key, value in approved_presence_map(observations).items()
            if value
        }
        current_presence = approved_presence_map(observations)
        preserved = bool(expected_presence)
    add_check(
        checks,
        "approved_profile_presence_preserved_where_previously_present",
        preserved,
        {
            "expected_present_surfaces": sorted(expected_presence),
            "current_presence": current_presence,
        },
        enforced=enforced,
    )

    snippets = observations.get("temporary_snippets")
    snippets = snippets if isinstance(snippets, dict) else {}
    targeted = snippets.get("targeted_matches")
    unclassified = snippets.get("unclassified_tmp")
    routes = snippets.get("temporary_registered_routes")
    targeted = targeted if isinstance(targeted, list) else []
    unclassified = unclassified if isinstance(unclassified, list) else []
    routes = routes if isinstance(routes, list) else []
    snippets_ok = not targeted and not routes and (
        not strict_all_tmp_snippets or not unclassified
    )
    add_check(
        checks,
        "mission_temporary_snippets_and_routes_absent",
        snippets_ok,
        {
            "targeted_matches": targeted,
            "temporary_registered_routes": routes,
            "unclassified_tmp": unclassified,
            "strict_all_tmp_snippets": strict_all_tmp_snippets,
        },
        enforced=enforced,
    )

    return checks


def collect_observations(
    client: WordPressClient,
    *,
    health_route: str,
    theme_health_route: str,
    snippet_prefixes: Sequence[str],
    route_prefixes: Sequence[str],
) -> dict[str, object]:
    site_identity = site_identity_observation(client)
    authenticated_profiles = collect_profiles(client)
    targets = profile_targets(client, authenticated_profiles)
    importer_route = importer_route_observation(client)
    robots = robots_observation(client)
    theme_health = theme_health_observation(client, theme_health_route)
    health = health_observation(client, health_route)
    public_profiles = public_profile_observations(client, targets)
    custom_sitemap = custom_sitemap_observation(client, targets)
    map_feed = map_feed_observation(client, targets)
    public_json_surfaces = public_json_surface_observations(client, targets)
    yoast_sitemaps = yoast_sitemaps_observation(client, targets)
    html_listings = html_listing_observations(client, targets)
    representative_html = representative_html_observations(client, targets)
    canonical_surfaces = canonical_surface_observations(client, targets)
    direct_repairs = direct_redirect_observations(client)
    snippets = collect_snippets(client, snippet_prefixes, route_prefixes)
    return {
        "site_identity": site_identity,
        "robots": robots,
        "theme_health": theme_health,
        "health": health,
        "profiles": {
            "authenticated": authenticated_profiles,
            "public": public_profiles,
        },
        "sitemaps": {
            "custom": custom_sitemap,
            "yoast": yoast_sitemaps,
        },
        "map_feed": map_feed,
        "public_json_surfaces": public_json_surfaces,
        "html_listings": html_listings,
        "representative_html_surfaces": representative_html,
        "canonical_surfaces": canonical_surfaces,
        "direct_redirect_repairs": direct_repairs,
        "importer_route": importer_route,
        "temporary_snippets": snippets,
    }


def resolve_report_path(value: Path | None, expect: str, now: datetime) -> Path:
    filename = f"p0-live-{expect}-{timestamp_slug(now)}.json"
    if value is None:
        return DEFAULT_REPORT_DIR / filename
    expanded = value.expanduser().resolve(strict=False)
    if expanded.suffix.lower() == ".json":
        return expanded
    return expanded / filename


def find_baseline(explicit: Path | None, report_path: Path) -> Path:
    if explicit is not None:
        candidate = explicit.expanduser().resolve(strict=False)
        if not candidate.is_file():
            raise VerificationError("the selected pre baseline file does not exist")
        return candidate
    candidates = sorted(report_path.parent.glob("p0-live-pre-*.json"))
    if not candidates:
        raise VerificationError(
            "post verification requires --baseline or a pre report in the report directory"
        )
    return candidates[-1]


def report_check_ids(checks: object) -> list[str]:
    if not isinstance(checks, list):
        raise VerificationError("the verification report has no checks array")
    if not checks:
        raise VerificationError("the verification report has an empty checks array")

    check_ids: list[str] = []
    for check in checks:
        if not isinstance(check, dict):
            raise VerificationError("the verification report has a malformed check")
        check_id = check.get("id")
        if not isinstance(check_id, str) or not check_id.strip():
            raise VerificationError("the verification report has a check without an ID")
        check_ids.append(check_id)

    if len(check_ids) != len(set(check_ids)):
        raise VerificationError("the verification report has duplicate check IDs")
    return check_ids


def values_equal_exact(left: object, right: object) -> bool:
    """Compare JSON-compatible values without bool/int or int/float coercion."""

    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return left.keys() == right.keys() and all(
            values_equal_exact(left[key], right[key]) for key in left
        )
    if isinstance(left, list):
        return len(left) == len(right) and all(
            values_equal_exact(left_item, right_item)
            for left_item, right_item in zip(left, right)
        )
    return left == right


def load_baseline(
    path: Path,
    expected_base_url: str,
    expected_configuration: Mapping[str, object],
    expected_check_ids: Sequence[str],
) -> dict[str, object]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise VerificationError(f"could not read pre baseline: {error}") from None
    if not isinstance(value, dict) or value.get("expect") != "pre":
        raise VerificationError("the selected baseline is not a P0 pre report")
    schema_version = value.get("schema_version")
    if type(schema_version) is not int or schema_version != REPORT_SCHEMA_VERSION:
        raise VerificationError("the selected baseline uses an obsolete report schema")
    if normalize_url(str(value.get("base_url") or "")) != normalize_url(expected_base_url):
        raise VerificationError("the pre baseline targets a different base URL")
    baseline_configuration = value.get("configuration")
    if not isinstance(baseline_configuration, dict):
        raise VerificationError("the pre baseline has no configuration object")
    dynamic_configuration_keys = {"env_file_found"}
    baseline_contract = {
        key: item
        for key, item in baseline_configuration.items()
        if key not in dynamic_configuration_keys
    }
    expected_contract = {
        key: item
        for key, item in expected_configuration.items()
        if key not in dynamic_configuration_keys
    }
    if not values_equal_exact(baseline_contract, expected_contract):
        raise VerificationError("the pre baseline uses a different verification contract")
    if not isinstance(value.get("observations"), dict):
        raise VerificationError("the pre baseline has no observations object")
    if report_check_ids(value.get("checks")) != list(expected_check_ids):
        raise VerificationError(
            "the pre baseline uses a different ordered check-ID contract"
        )
    return value


def save_report(path: Path, report: Mapping[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(
        json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    os.replace(temporary, path)


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Record or enforce live acceptance for the plugin-only SEO Recovery "
            "P0 release while requiring the live theme to remain unchanged."
        ),
    )
    parser.add_argument("--expect", choices=("pre", "post"), required=True)
    parser.add_argument("--env-file", type=Path)
    parser.add_argument("--base-url")
    parser.add_argument("--report", type=Path)
    parser.add_argument("--baseline", type=Path)
    parser.add_argument(
        "--plugin-health-route",
        "--health-route",
        dest="plugin_health_route",
        default=DEFAULT_HEALTH_ROUTE,
    )
    parser.add_argument(
        "--required-plugin-version",
        "--expected-version",
        dest="required_plugin_version",
        default=DEFAULT_REQUIRED_PLUGIN_VERSION,
    )
    parser.add_argument(
        "--required-plugin-marker",
        "--expected-marker",
        dest="required_plugin_marker",
        default=DEFAULT_REQUIRED_PLUGIN_MARKER,
    )
    parser.add_argument(
        "--unchanged-live-theme-health-route",
        "--theme-health-route",
        dest="unchanged_live_theme_health_route",
        default=DEFAULT_THEME_HEALTH_ROUTE,
    )
    parser.add_argument(
        "--required-unchanged-live-theme",
        "--expected-theme",
        dest="required_unchanged_live_theme",
        default=DEFAULT_REQUIRED_LIVE_THEME,
    )
    parser.add_argument(
        "--required-unchanged-live-theme-version",
        "--expected-theme-version",
        dest="required_unchanged_live_theme_version",
        default=DEFAULT_REQUIRED_LIVE_THEME_VERSION,
    )
    parser.add_argument(
        "--required-unchanged-live-theme-marker",
        "--expected-theme-marker",
        dest="required_unchanged_live_theme_marker",
        default=DEFAULT_REQUIRED_LIVE_THEME_MARKER,
    )
    parser.add_argument("--timeout", type=float, default=60.0)
    parser.add_argument(
        "--snippet-prefix",
        action="append",
        default=[],
        help="Additional mission-owned temporary snippet name prefix.",
    )
    parser.add_argument(
        "--temp-route-prefix",
        action="append",
        default=[],
        help="Additional temporary REST route prefix that must disappear.",
    )
    parser.add_argument(
        "--strict-all-tmp-snippets",
        action="store_true",
        help="Also fail post verification for unclassified tmp-* snippet names.",
    )
    args = parser.parse_args(argv)
    if args.timeout <= 0 or args.timeout > 300:
        parser.error("--timeout must be greater than 0 and no more than 300 seconds")
    if args.expect == "pre" and args.baseline is not None:
        parser.error("--baseline is valid only with --expect post")
    if args.plugin_health_route.strip("/") != DEFAULT_HEALTH_ROUTE:
        parser.error(
            "--plugin-health-route must remain the exact public "
            "justice-seo-recovery/v1/healthcheck route"
        )
    if args.required_plugin_version != DEFAULT_REQUIRED_PLUGIN_VERSION:
        parser.error(
            "--required-plugin-version must remain the release version "
            f"{DEFAULT_REQUIRED_PLUGIN_VERSION}"
        )
    if args.required_plugin_marker != DEFAULT_REQUIRED_PLUGIN_MARKER:
        parser.error(
            "--required-plugin-marker must remain the release marker "
            f"{DEFAULT_REQUIRED_PLUGIN_MARKER}"
        )
    if (
        args.unchanged_live_theme_health_route.strip("/")
        != DEFAULT_THEME_HEALTH_ROUTE
    ):
        parser.error(
            "--unchanged-live-theme-health-route must remain the exact public "
            "justice/v1/healthcheck route"
        )
    if args.required_unchanged_live_theme != DEFAULT_REQUIRED_LIVE_THEME:
        parser.error(
            "--required-unchanged-live-theme must remain the unchanged live theme "
            f"{DEFAULT_REQUIRED_LIVE_THEME}"
        )
    if (
        args.required_unchanged_live_theme_version
        != DEFAULT_REQUIRED_LIVE_THEME_VERSION
    ):
        parser.error(
            "--required-unchanged-live-theme-version must remain the unchanged "
            f"live version {DEFAULT_REQUIRED_LIVE_THEME_VERSION}"
        )
    if (
        args.required_unchanged_live_theme_marker
        != DEFAULT_REQUIRED_LIVE_THEME_MARKER
    ):
        parser.error(
            "--required-unchanged-live-theme-marker must remain the unchanged "
            f"live marker {DEFAULT_REQUIRED_LIVE_THEME_MARKER}"
        )
    return args


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    started = utc_now()
    report_path = resolve_report_path(args.report, args.expect, started)
    report: dict[str, object] = {
        "schema_version": REPORT_SCHEMA_VERSION,
        "expect": args.expect,
        "generated_at_utc": utc_iso(started),
        "completed_at_utc": None,
        "base_url": args.base_url or "",
        "configuration": {
            "release_contract": "plugin_only_with_unchanged_live_theme",
            "target_base_url": TARGET_BASE_URL,
            "expected_robots_sitemap_url": EXPECTED_ROBOTS_SITEMAP_URL,
            "plugin_health_route": args.plugin_health_route.strip("/"),
            "required_plugin_version": args.required_plugin_version,
            "required_plugin_marker": args.required_plugin_marker,
            "unchanged_live_theme_health_route": (
                args.unchanged_live_theme_health_route.strip("/")
            ),
            "required_unchanged_live_theme": args.required_unchanged_live_theme,
            "required_unchanged_live_theme_version": (
                args.required_unchanged_live_theme_version
            ),
            "required_unchanged_live_theme_marker": (
                args.required_unchanged_live_theme_marker
            ),
            "profile_ids": list(PROFILE_IDS),
            "canonical_surfaces": list(CANONICAL_SURFACES),
            "html_listing_surfaces": list(HTML_LISTING_SURFACES),
            "representative_html_surfaces": list(REPRESENTATIVE_HTML_SURFACES),
            "public_json_surfaces": [
                {
                    "key": key,
                    "route": route,
                    "params": params,
                    "collection_key": collection_key,
                }
                for key, route, params, collection_key in PUBLIC_JSON_SURFACES
            ],
            "direct_redirect_repairs": list(DIRECT_REDIRECT_REPAIRS),
        },
        "baseline": None,
        "observations": {},
        "checks": [],
        "overall": {"passed": False, "status": "started"},
    }
    secrets: list[str] = []
    try:
        config, env_path = load_configuration(args.env_file, args.base_url)
        secrets = [config["WP_USER"], config["WP_APP_PASSWORD"]]
        report["base_url"] = config["WP_BASE_URL"]
        report["configuration"]["env_file_found"] = env_path is not None

        snippet_prefixes = tuple(
            dict.fromkeys((*KNOWN_TEMP_SNIPPET_PREFIXES, *args.snippet_prefix))
        )
        route_prefixes = tuple(
            prefix if prefix.startswith("/") else "/" + prefix
            for prefix in dict.fromkeys(
                (*KNOWN_TEMP_ROUTE_PREFIXES, *args.temp_route_prefix)
            )
        )
        report["configuration"]["temporary_snippet_prefixes"] = list(
            snippet_prefixes
        )
        report["configuration"]["temporary_route_prefixes"] = list(
            route_prefixes
        )
        report["configuration"]["strict_all_tmp_snippets"] = (
            args.strict_all_tmp_snippets
        )

        expected_check_ids = report_check_ids(
            build_checks(
                {},
                expect=args.expect,
                required_plugin_version=args.required_plugin_version,
                required_plugin_marker=args.required_plugin_marker,
                required_live_theme=args.required_unchanged_live_theme,
                required_live_theme_version=(
                    args.required_unchanged_live_theme_version
                ),
                required_live_theme_marker=(
                    args.required_unchanged_live_theme_marker
                ),
                baseline=None,
                strict_all_tmp_snippets=args.strict_all_tmp_snippets,
            )
        )

        baseline: dict[str, object] | None = None
        baseline_path: Path | None = None
        if args.expect == "post":
            baseline_path = find_baseline(args.baseline, report_path)
            baseline = load_baseline(
                baseline_path,
                config["WP_BASE_URL"],
                report["configuration"],
                expected_check_ids,
            )
            report["baseline"] = {
                "path": str(baseline_path),
                "sha256": sha256_bytes(baseline_path.read_bytes()),
                "generated_at_utc": baseline.get("generated_at_utc"),
            }

        client = WordPressClient(
            config["WP_BASE_URL"],
            config["WP_USER"],
            config["WP_APP_PASSWORD"],
            args.timeout,
        )
        observations = collect_observations(
            client,
            health_route=args.plugin_health_route,
            theme_health_route=args.unchanged_live_theme_health_route,
            snippet_prefixes=snippet_prefixes,
            route_prefixes=route_prefixes,
        )
        report["observations"] = observations
        checks = build_checks(
            observations,
            expect=args.expect,
            required_plugin_version=args.required_plugin_version,
            required_plugin_marker=args.required_plugin_marker,
            required_live_theme=args.required_unchanged_live_theme,
            required_live_theme_version=(
                args.required_unchanged_live_theme_version
            ),
            required_live_theme_marker=args.required_unchanged_live_theme_marker,
            baseline=baseline,
            strict_all_tmp_snippets=args.strict_all_tmp_snippets,
        )
        current_check_ids = report_check_ids(checks)
        if current_check_ids != expected_check_ids:
            raise VerificationError(
                "the current run produced a different ordered check-ID contract"
            )
        report["checks"] = checks
        observed_failures = [check["id"] for check in checks if not check["passed"]]
        enforced_failures = [
            check["id"]
            for check in checks
            if check["enforced"] and not check["passed"]
        ]
        if args.expect == "pre":
            report["overall"] = {
                "passed": True,
                "status": "baseline_recorded",
                "observed_post_condition_failures": observed_failures,
                "enforced_failures": [],
            }
            exit_code = 0
        else:
            passed = not enforced_failures
            report["overall"] = {
                "passed": passed,
                "status": "passed" if passed else "failed",
                "observed_post_condition_failures": observed_failures,
                "enforced_failures": enforced_failures,
            }
            exit_code = 0 if passed else 1
    except Exception as error:  # The report must survive every fail-closed exit.
        safe_error = redact_text(error, secrets)
        report["fatal_error"] = safe_error
        report["overall"] = {
            "passed": False,
            "status": "fatal_error",
            "enforced_failures": ["fatal_error"],
        }
        exit_code = 2

    report["completed_at_utc"] = utc_iso()
    try:
        save_report(report_path, report)
    except Exception as error:
        safe_error = redact_text(error, secrets)
        print(f"ERROR: could not save evidence report: {safe_error}", file=sys.stderr)
        return 2

    overall = report.get("overall")
    status = overall.get("status") if isinstance(overall, dict) else "unknown"
    print(f"SEO Recovery P0 plugin-only live verifier: {status}")
    print(f"Evidence: {report_path}")
    if exit_code:
        failures = overall.get("enforced_failures") if isinstance(overall, dict) else []
        if failures:
            print("Failures: " + ", ".join(str(value) for value in failures))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
