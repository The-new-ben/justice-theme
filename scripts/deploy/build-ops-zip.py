#!/usr/bin/env python3
"""Build plugin-dist/justice-ops-<version>.zip from the justice-ops/ source dir.

Usage: python3 scripts/deploy/build-ops-zip.py <version>

Asserts before writing anything:
- the version argument matches both the plugin header Version and the
  JUSTICE_OPS_VERSION constant in justice-ops/justice-ops.php
- the manifest plugin-dist/justice-ops.json carries the same version and a
  download_url ending in the zip name being built
After writing, re-opens the zip and asserts every path uses forward slashes
(backslash paths extract wrong on Linux hosts) and the main file is present.
"""
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "justice-ops"
MAIN = SRC / "justice-ops.php"
DIST = ROOT / "plugin-dist"
MANIFEST = DIST / "justice-ops.json"


def fail(msg: str) -> None:
    print(f"FATAL: {msg}")
    sys.exit(1)


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: build-ops-zip.py <version>")
    version = sys.argv[1]

    src = MAIN.read_text(encoding="utf-8")
    header = re.search(r"^\s*\*\s*Version:\s*(\S+)", src, re.M)
    constant = re.search(r"JUSTICE_OPS_VERSION',\s*'([^']+)'", src)
    if not header or header.group(1) != version:
        fail(f"header Version is {header.group(1) if header else 'missing'}, expected {version}")
    if not constant or constant.group(1) != version:
        fail(f"JUSTICE_OPS_VERSION is {constant.group(1) if constant else 'missing'}, expected {version}")

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    zip_name = f"justice-ops-{version}.zip"
    if manifest.get("version") != version:
        fail(f"manifest version is {manifest.get('version')}, expected {version}")
    if not str(manifest.get("download_url", "")).endswith(zip_name):
        fail(f"manifest download_url does not end with {zip_name}")

    out = DIST / zip_name
    files = sorted(p for p in SRC.rglob("*") if p.is_file())
    if MAIN not in files:
        fail("justice-ops/justice-ops.php missing from source dir")

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in files:
            arcname = "justice-ops/" + path.relative_to(SRC).as_posix()
            zf.write(path, arcname)

    with zipfile.ZipFile(out) as zf:
        names = zf.namelist()
        if any("\\" in n for n in names):
            fail("zip contains backslash paths")
        if "justice-ops/justice-ops.php" not in names:
            fail("main plugin file missing from zip")
        body = zf.read("justice-ops/justice-ops.php").decode("utf-8")
        if f"Version: {version}" not in body or f"'{version}'" not in body:
            fail("version strings missing inside zipped main file")

    print(f"built {out.relative_to(ROOT)} ({out.stat().st_size} bytes, {len(names)} files)")


if __name__ == "__main__":
    main()
