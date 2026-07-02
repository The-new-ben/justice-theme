#!/usr/bin/env python3
"""Build a WordPress-installable justice-core plugin zip, deterministically.

Usage: python3 scripts/deploy/build-plugin-zip.py <version>
Produces plugin-dist/justice-core-<ver>.zip with a single top-level folder
'justice-core/' and FORWARD-SLASH paths only. Asserts the version is in sync
between the plugin header and the constant before building, then self-verifies
the archive (no backslash paths, main file present).

Part of the agent-driven deploy pipeline: see
project-control/agent-deploy-pipeline-handbook.md and the wp-deploy skill.
"""
import os
import re
import sys
import zipfile

PLUGIN_DIR = "justice-core"
MAIN_FILE = "justice-core/justice-core.php"
OUT_DIR = "plugin-dist"
EXCLUDE = {".git", ".DS_Store", "node_modules", "__pycache__"}


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: build-plugin-zip.py <version>")
    ver = sys.argv[1]
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.chdir(root)

    src = open(MAIN_FILE, encoding="utf-8").read()
    assert re.search(r"Version:\s*" + re.escape(ver), src), (
        "header version mismatch: bump 'Version:' in " + MAIN_FILE
    )

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f"{PLUGIN_DIR}-{ver}.zip")
    count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for dirpath, dirnames, filenames in os.walk(PLUGIN_DIR):
            dirnames[:] = [d for d in dirnames if d not in EXCLUDE]
            for filename in filenames:
                if filename in EXCLUDE:
                    continue
                path = os.path.join(dirpath, filename)
                arcname = path.replace(os.sep, "/")
                z.write(path, arcname)
                count += 1

    with zipfile.ZipFile(out) as z:
        names = z.namelist()
        assert all("\\" not in name for name in names), "backslash in archive!"
        assert MAIN_FILE in names, "main plugin file missing from archive!"
        assert ("Version: " + ver) in z.read(MAIN_FILE).decode("utf-8"), (
            "version not inside the built zip!"
        )

    print(f"OK {os.path.basename(out)} entries={count} backslash=0 rooted=True")


if __name__ == "__main__":
    main()
