#!/usr/bin/env python3
"""Build the deterministic Justice SEO Recovery P0 plugin artifact."""

from __future__ import annotations

import hashlib
import re
import sys
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PLUGIN_DIR = ROOT / "justice-seo-recovery-p0"
PLUGIN_FILE = PLUGIN_DIR / "justice-seo-recovery-p0.php"
DIST_DIR = ROOT / "plugin-dist"
VERSION_RE = re.compile(rb"^\s*\*\s*Version:\s*([^\s]+)\s*$", re.MULTILINE)


def fail(message: str) -> None:
    raise SystemExit(f"ERROR: {message}")


def main() -> None:
    if not PLUGIN_FILE.is_file() or PLUGIN_FILE.is_symlink():
        fail("justice-seo-recovery-p0.php is missing or is a symlink")

    raw = PLUGIN_FILE.read_bytes().replace(b"\r\n", b"\n")
    match = VERSION_RE.search(raw)
    if not match:
        fail("plugin Version header is missing")
    version = match.group(1).decode("ascii")
    if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", version):
        fail(f"unsupported semantic version: {version}")
    if len(sys.argv) > 2:
        fail("usage: build-seo-recovery-p0-zip.py [version]")
    if len(sys.argv) == 2 and sys.argv[1] != version:
        fail(f"requested version {sys.argv[1]} differs from header {version}")

    DIST_DIR.mkdir(parents=True, exist_ok=True)
    output = DIST_DIR / f"justice-seo-recovery-p0-{version}.zip"
    arcname = "justice-seo-recovery-p0/justice-seo-recovery-p0.php"
    info = zipfile.ZipInfo(arcname, date_time=(1980, 1, 1, 0, 0, 0))
    # Store the tiny one-file plugin without DEFLATE. Stored ZIP bytes are
    # stable across zlib versions and operating systems.
    info.compress_type = zipfile.ZIP_STORED
    info.create_system = 3
    info.external_attr = 0o100644 << 16

    with zipfile.ZipFile(
        output,
        mode="w",
        compression=zipfile.ZIP_STORED,
    ) as archive:
        archive.writestr(
            info,
            raw,
            compress_type=zipfile.ZIP_STORED,
        )

    with zipfile.ZipFile(output) as archive:
        infos = archive.infolist()
        if len(infos) != 1 or infos[0].filename != arcname:
            fail("artifact member set is invalid")
        if infos[0].date_time != (1980, 1, 1, 0, 0, 0):
            fail("artifact timestamp is not deterministic")
        if archive.read(arcname) != raw:
            fail("artifact content differs from normalized source")

    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    print(f"built {output.relative_to(ROOT)}")
    print(f"sha256 {digest}")


if __name__ == "__main__":
    main()
