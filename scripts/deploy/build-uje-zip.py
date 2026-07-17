#!/usr/bin/env python3
"""Build plugin-dist/ultra-justice-engine-<version>.zip from ultra-justice-engine/.

Usage: python3 scripts/deploy/build-uje-zip.py <version>

Ultra Justice Engine is a SEPARATE plugin from justice-ops (live active,
1.0.0 baseline) - it owns the justice_lawyer CPT registration, its meta
schema, and the practice-areas/city taxonomies. justice-core is a repo-side
future migration target only (owner order: do not activate beside
ultra-justice-engine) - never build or deploy that zip while UJE is active.

Asserts before writing anything: the version argument matches both the
plugin header Version and the UJE_VERSION constant in
ultra-justice-engine/ultra-justice-engine.php. After writing, re-opens the
zip and asserts every path uses forward slashes and the main file is
present with the version string inside.
"""
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "ultra-justice-engine"
MAIN = SRC / "ultra-justice-engine.php"
DIST = ROOT / "plugin-dist"


def fail(msg: str) -> None:
    print(f"FATAL: {msg}")
    sys.exit(1)


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: build-uje-zip.py <version>")
    version = sys.argv[1]

    src = MAIN.read_text(encoding="utf-8")
    header = re.search(r"^\s*\*\s*Version:\s*(\S+)", src, re.M)
    constant = re.search(r"UJE_VERSION',\s*'([^']+)'", src)
    if not header or header.group(1) != version:
        fail(f"header Version is {header.group(1) if header else 'missing'}, expected {version}")
    if not constant or constant.group(1) != version:
        fail(f"UJE_VERSION is {constant.group(1) if constant else 'missing'}, expected {version}")

    DIST.mkdir(exist_ok=True)
    zip_name = f"ultra-justice-engine-{version}.zip"
    out = DIST / zip_name
    files = sorted(p for p in SRC.rglob("*") if p.is_file())
    if MAIN not in files:
        fail("ultra-justice-engine/ultra-justice-engine.php missing from source dir")

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in files:
            arcname = "ultra-justice-engine/" + path.relative_to(SRC).as_posix()
            zf.write(path, arcname)

    with zipfile.ZipFile(out) as zf:
        names = zf.namelist()
        if any("\\" in n for n in names):
            fail("zip contains backslash paths")
        if "ultra-justice-engine/ultra-justice-engine.php" not in names:
            fail("main plugin file missing from zip")
        body = zf.read("ultra-justice-engine/ultra-justice-engine.php").decode("utf-8")
        if f"Version: {version}" not in body or f"'{version}'" not in body:
            fail("version strings missing inside zipped main file")

    print(f"built {out.relative_to(ROOT)} ({out.stat().st_size} bytes, {len(names)} files)")


if __name__ == "__main__":
    main()
