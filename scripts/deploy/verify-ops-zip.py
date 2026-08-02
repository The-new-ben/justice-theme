#!/usr/bin/env python3
"""Verify a built Justice Ops artifact, including linting extracted PHP."""

from __future__ import annotations

import hashlib
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[2]


def fail(message: str) -> None:
    raise SystemExit(f"FATAL: {message}")


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: verify-ops-zip.py <version>")

    version = sys.argv[1]
    artifact = ROOT / "plugin-dist" / f"justice-ops-{version}.zip"
    if not artifact.is_file():
        fail(f"artifact does not exist: {artifact}")

    with zipfile.ZipFile(artifact) as archive:
        names = archive.namelist()
        if not names or any("\\" in name for name in names):
            fail("artifact has no files or contains a backslash path")
        for name in names:
            path = PurePosixPath(name)
            if path.is_absolute() or ".." in path.parts:
                fail(f"unsafe archive path: {name}")
            if not name.startswith("justice-ops/"):
                fail(f"file outside plugin root: {name}")

        required = {
            "justice-ops/justice-ops.php",
            "justice-ops/family-content-release.php",
            "justice-ops/real-estate-content-release.php",
            "justice-ops/review-claims-off.php",
            "justice-ops/maya-profile-release.php",
            "justice-ops/comparison-content-reset.php",
            "justice-ops/release-update-control.php",
        }
        missing = required.difference(names)
        if missing:
            fail(f"required files missing: {sorted(missing)}")

        main_source = archive.read("justice-ops/justice-ops.php").decode("utf-8")
        release_source = archive.read(
            "justice-ops/family-content-release.php"
        ).decode("utf-8")
        real_estate_source = archive.read(
            "justice-ops/real-estate-content-release.php"
        ).decode("utf-8")
        maya_source = archive.read(
            "justice-ops/maya-profile-release.php"
        ).decode("utf-8")
        comparison_source = archive.read(
            "justice-ops/comparison-content-reset.php"
        ).decode("utf-8")
        update_control_source = archive.read(
            "justice-ops/release-update-control.php"
        ).decode("utf-8")
        router_source = archive.read("justice-ops/lead-router.php").decode("utf-8")
        map_source = archive.read("justice-ops/map-cinema.php").decode("utf-8")
        firm_strip_source = archive.read(
            "justice-ops/firm-match-strip.php"
        ).decode("utf-8")
        tools_source = archive.read("justice-ops/tools-discovery.php").decode("utf-8")
        if f"Version: {version}" not in main_source or f"'{version}'" not in main_source:
            fail("version markers are missing from the zipped main file")
        for module_include in (
            "require_once __DIR__ . '/maya-profile-release.php';",
            "require_once __DIR__ . '/comparison-content-reset.php';",
            "require_once __DIR__ . '/release-update-control.php';",
            "require_once __DIR__ . '/real-estate-content-release.php';",
        ):
            if module_include not in main_source:
                fail(f"required module include is missing: {module_include}")
        for marker in (
            'data-jt-family-release="2026-08-02-r2"',
            'data-jt-card-visibility-note="general"',
            "justice_ops_verified_lead_mailbox",
            "justice_ops_internal_lead_hold_enabled",
        ):
            if marker not in release_source:
                fail(f"release marker is missing from the zipped module: {marker}")
        for marker in (
            'data-jt-real-estate-release="2026-08-02-r1"',
            "justice_ops_real_estate_release_contracts",
            "/real-estate-attorney/",
            "/real-estate-lawyer-guide/",
            "/lawyer-for-buying-or-selling-a-house/",
            "/real-estate-lawyer-cost-2025/",
            "justice_ops_real_estate_release_sanitize_schema_value",
        ):
            if marker not in real_estate_source:
                fail(f"real-estate release marker is missing: {marker}")
        for marker in (
            'data-jt-maya-profile-content="2026-08-02-r2"',
            'data-jt-profile-transparency="visibility-policy"',
            'rel="sponsored"',
            "justice-maya-profile-schema",
        ):
            if marker not in maya_source:
                fail(f"Maya release marker is missing: {marker}")
        for marker in (
            'data-jt-comparison-content="2026-08-02-r3"',
            'data-jt-comparison-disclosure="visibility-policy"',
            'data-jt-comparison-universe="u0-2026-08-02"',
            'data-jt-comparison-evidence-date="2026-08-02"',
            "בדיקת המקורות: 1 וב־2 באוגוסט 2026",
            "justice-family-comparison-schema",
            "justice_ops_comparison_control_schema",
            "הכרטיסים המוצגים כאן מסודרים לפי שם המשפחה הרשמי בעברית",
            "https://www.israelbar.biz/lawyer-fd/?lawyer=",
        ):
            if marker not in comparison_source:
                fail(f"comparison release marker is missing: {marker}")
        public_release_sources = release_source + maya_source + comparison_source
        for forbidden in (
            "שותפה עסקית",
            "לקוחה משלמת",
            "פרופיל פרימיום",
            "חשיפה מוגברת",
            "היחידה מבין המועמדים",
            "ליתר המועמדים אין קשר מסחרי",
            "הקשר העסקי, התשלום",
            "התשלום והשותפות",
            "גילוי על הקשר המסחרי ל-Jus-Tice",
            'data-jt-commercial-disclosure=',
            "אין למועמד או למועמדת קשר מסחרי",
            'class="jt-comparison-card is-commercial"',
            "jt-comparison-card__relationship",
        ):
            if forbidden in public_release_sources:
                fail(f"candidate-specific relationship marker remains: {forbidden}")
        for marker in (
            "justice-ops/justice-ops.php",
            "auto_update_plugin",
            "/release-update-control",
            "expected_state_sha256",
        ):
            if marker not in update_control_source:
                fail(f"release update-control marker is missing: {marker}")
        if "routing is on owner hold" not in router_source:
            fail("lead router does not enforce the owner hold")
        if "/family-law/" not in map_source or "מציגים משרדים שנבדקו" in map_source:
            fail("map bridge is missing or still carries the unsupported vetting claim")
        if "כרטיס רשום" not in firm_strip_source:
            fail("the live registered-card disclosure was not preserved")
        if "bottom:18px" not in tools_source or "bottom:76px" not in tools_source:
            fail("the live AI button placement was not preserved")

        with tempfile.TemporaryDirectory(prefix="justice-ops-verify-") as temporary:
            archive.extractall(temporary)
            php_files = sorted(Path(temporary, "justice-ops").rglob("*.php"))
            if not php_files:
                fail("no PHP files were extracted")
            for php_file in php_files:
                result = subprocess.run(
                    ["php", "-l", str(php_file)],
                    check=False,
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0:
                    fail(
                        f"zipped PHP lint failed for {php_file.name}: "
                        f"{result.stdout}{result.stderr}"
                    )

    digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
    print(
        f"verified {artifact.name}: files={len(names)} "
        f"sha256={digest} extracted_php_lint=PASS"
    )


if __name__ == "__main__":
    main()
