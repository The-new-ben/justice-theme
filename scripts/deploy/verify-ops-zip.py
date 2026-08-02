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
            "justice-ops/review-claims-off.php",
        }
        missing = required.difference(names)
        if missing:
            fail(f"required files missing: {sorted(missing)}")

        main_source = archive.read("justice-ops/justice-ops.php").decode("utf-8")
        release_source = archive.read(
            "justice-ops/family-content-release.php"
        ).decode("utf-8")
        router_source = archive.read("justice-ops/lead-router.php").decode("utf-8")
        map_source = archive.read("justice-ops/map-cinema.php").decode("utf-8")
        firm_strip_source = archive.read(
            "justice-ops/firm-match-strip.php"
        ).decode("utf-8")
        tools_source = archive.read("justice-ops/tools-discovery.php").decode("utf-8")
        if f"Version: {version}" not in main_source or f"'{version}'" not in main_source:
            fail("version markers are missing from the zipped main file")
        for marker in (
            'data-jt-family-release="2026-08-02-r1"',
            "שותפה עסקית ולקוחה משלמת",
            "justice_ops_verified_lead_mailbox",
            "justice_ops_internal_lead_hold_enabled",
        ):
            if marker not in release_source:
                fail(f"release marker is missing from the zipped module: {marker}")
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
