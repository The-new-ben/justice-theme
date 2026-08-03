#!/usr/bin/env python3
"""Focused regression tests for the Justice Ops server recovery location."""

from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path


_DRIVER_PATH = Path(__file__).resolve().with_name("wp_deploy_justice_ops.py")
_DRIVER_SPEC = importlib.util.spec_from_file_location(
    "justice_ops_deploy_driver_under_test",
    _DRIVER_PATH,
)
if _DRIVER_SPEC is None or _DRIVER_SPEC.loader is None:
    raise RuntimeError(f"Cannot load local deployment driver: {_DRIVER_PATH}")
deploy = importlib.util.module_from_spec(_DRIVER_SPEC)
_DRIVER_SPEC.loader.exec_module(deploy)


class ServerRecoveryRootContractTest(unittest.TestCase):
    def setUp(self) -> None:
        self.template = deploy.TEMPLATE_PATH.read_text(encoding="utf-8")

    def test_recovery_survives_wordpress_upgrader_scratch_sweep(self) -> None:
        result = deploy.generated_recovery_root_self_test(self.template)

        self.assertTrue(result["passed"])
        self.assertTrue(result["simulated_scratch_deleted"])
        self.assertTrue(result["simulated_recovery_survived"])
        self.assertEqual(result["wordpress_upgrader_scratch"], "wp-content/upgrade")
        self.assertEqual(
            result["server_recovery_prefix"],
            "wp-content/.justice-ops-recovery-",
        )

    def test_legacy_recovery_root_inside_upgrade_is_rejected(self) -> None:
        tampered = self.template.replace(
            "WP_CONTENT_DIR . '/.justice-ops-recovery-'",
            "WP_CONTENT_DIR . '/upgrade/.justice-ops-recovery-'",
        )

        with self.assertRaisesRegex(
            RuntimeError,
            "server recovery root contract changed|re-entered WP_Upgrader scratch space",
        ):
            deploy.generated_recovery_root_self_test(tampered)


if __name__ == "__main__":
    unittest.main()
