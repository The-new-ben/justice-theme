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
            "justice-ops/criminal-content-release.php",
            "justice-ops/real-estate-content-release.php",
            "justice-ops/country-content-release.php",
            "justice-ops/review-claims-off.php",
            "justice-ops/maya-profile-release.php",
            "justice-ops/comparison-content-reset.php",
            "justice-ops/release-update-control.php",
            "justice-ops/cyprus-content-bridge.php",
            "justice-ops/content-first-order.php",
            "justice-ops/title-stability.php",
            "justice-ops/professional-cards.php",
            "justice-ops/hfcm-legacy-card-retirement.php",
        }
        missing = required.difference(names)
        if missing:
            fail(f"required files missing: {sorted(missing)}")

        main_source = archive.read("justice-ops/justice-ops.php").decode("utf-8")
        release_source = archive.read(
            "justice-ops/family-content-release.php"
        ).decode("utf-8")
        criminal_source = archive.read(
            "justice-ops/criminal-content-release.php"
        ).decode("utf-8")
        real_estate_source = archive.read(
            "justice-ops/real-estate-content-release.php"
        ).decode("utf-8")
        country_source = archive.read(
            "justice-ops/country-content-release.php"
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
        professional_cards_source = archive.read(
            "justice-ops/professional-cards.php"
        ).decode("utf-8")
        cyprus_bridge_source = archive.read(
            "justice-ops/cyprus-content-bridge.php"
        ).decode("utf-8")
        content_first_source = archive.read(
            "justice-ops/content-first-order.php"
        ).decode("utf-8")
        title_stability_source = archive.read(
            "justice-ops/title-stability.php"
        ).decode("utf-8")
        hfcm_retirement_source = archive.read(
            "justice-ops/hfcm-legacy-card-retirement.php"
        ).decode("utf-8")
        tools_source = archive.read("justice-ops/tools-discovery.php").decode("utf-8")
        if f"Version: {version}" not in main_source or f"'{version}'" not in main_source:
            fail("version markers are missing from the zipped main file")
        for module_include in (
            "require_once __DIR__ . '/content-freeze.php';",
            "require_once __DIR__ . '/release-update-control.php';",
            "require_once __DIR__ . '/compat-stubs.php';",
            "require_once __DIR__ . '/redirects-off.php';",
            "require_once __DIR__ . '/cleanup-2026-09.php';",
            "require_once __DIR__ . '/review-claims-off.php';",
            "require_once __DIR__ . '/title-authority.php';",
            "require_once __DIR__ . '/title-stability.php';",
            "require_once __DIR__ . '/practice-polish.php';",
            "require_once __DIR__ . '/seo-hierarchy.php';",
            "require_once __DIR__ . '/professional-cards.php';",
            "require_once __DIR__ . '/advertise.php';",
            "require_once __DIR__ . '/lead-router.php';",
            "require_once __DIR__ . '/scheduler.php';",
            "require_once __DIR__ . '/calculators.php';",
            "require_once __DIR__ . '/doc-generators.php';",
            "require_once __DIR__ . '/rent-gen.php';",
            "require_once __DIR__ . '/divorce-gen.php';",
            "require_once __DIR__ . '/malpractice-checker.php';",
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
            'data-jt-criminal-release="2026-08-03-r2"',
            'data-jt-criminal-hero="2026-08-03-r2"',
            "justice_ops_criminal_release_r2_enabled",
            "משרדים בתחום הפלילי",
            "משרדי עורכי דין במשפט פלילי",
        ):
            if marker not in criminal_source:
                fail(f"criminal release marker is missing: {marker}")
        for forbidden in (
            "נבדקו ונמצאו מובילים",
            "משרדי עורכי דין מובילים במשפט פלילי",
        ):
            if forbidden not in criminal_source:
                fail(f"criminal fail-closed source marker is missing: {forbidden}")
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
            'data-jt-country-schema-release="2026-08-02-r1"',
            "justice_ops_country_schema_release_paths",
            "/portugal-lawyers/",
            "/practice-areas/portugal/",
            "/usa-lawyers/",
            "/california-lawyers/",
            "justice_ops_real_estate_release_filter_schema_scripts",
        ):
            if marker not in country_source:
                fail(f"country release marker is missing: {marker}")
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
        if "סיור במפת המשרדים" not in map_source or "סיור אווירי מעל המשרדים המובילים" in map_source:
            fail("map control is missing the neutral label or retains the unsupported ranking label")
        for marker in (
            "אנשי מקצוע משפטיים נוספים",
            "return $content . $strip;",
            "justice_fms_has_public_sponsored_placement",
        ):
            if marker not in firm_strip_source:
                fail(f"organic end-of-content card marker is missing: {marker}")
        if "כרטיס רשום" in firm_strip_source:
            fail("the obsolete registered-card label remains in organic inventory")
        for marker in (
            "'sponsored_label' => 'מקודם'",
            "$settings['sponsored_label'] = 'מקודם';",
            "justice_cards_has_public_sponsored_placement",
            "justice_cards_has_verified_jurisdiction_eligibility",
        ):
            if marker not in professional_cards_source:
                fail(f"verified sponsored-card marker is missing: {marker}")
        for marker in (
            "justice_ops_cyprus_bridge_allowlist",
            "justice_ops_cyprus_bridge_transition_batch",
            "justice_ops_cyprus_bridge_reconcile_public_caches",
            "/cyprus-prices/",
        ):
            if marker not in cyprus_bridge_source:
                fail(f"Cyprus exact-release bridge marker is missing: {marker}")
        if "justice_ops_content_first_filter" not in content_first_source:
            fail("content-first terminal ordering filter is missing")
        if "justice_ops_title_stability_script" not in title_stability_source:
            fail("narrow title-stability module is missing")
        for marker in (
            "retire-hfcm-legacy-head-cards-v2",
            "justice_ops_hfcm_retirement_snapshot",
            "justice_ops_hfcm_retirement_locked_state",
            "justice_ops_hfcm_retirement_is_complete",
            "FOR UPDATE",
            "script_id IN (5,6,7)",
            "lawyer-card-container",
            "jus-tice-expert.webp",
        ):
            if marker not in hfcm_retirement_source:
                fail(f"HFCM retirement marker is missing: {marker}")
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
