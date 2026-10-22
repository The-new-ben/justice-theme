"""The medical-malpractice wave (22.10.2026, HAD-594): the per-instrument datasets of
tools/justice_tools_malpractice_<name>.py.

Each module defines KEY = "malpractice_<name>" and build(checked_on) -> dict, in the style of tools/justice_tools_inheritance.py:
every figure with its official source url and section, nothing estimated. The registry builder calls add_malpractice() when
--malpractice-checked-on is given (or on a full rebuild)."""
from __future__ import annotations

import importlib
from pathlib import Path


def malpractice_modules() -> list:
    """Every tools/justice_tools_malpractice_<name>.py next to this file, in name order."""
    here = Path(__file__).resolve().parent
    return sorted(p.stem for p in here.glob("justice_tools_malpractice_*.py"))


def add_malpractice(registry: dict, day: str | None) -> list:
    """Add every medical-malpractice dataset that exists, each with checked_on = day. Returns the keys."""
    if not day:
        return []
    registry["registry_version"] = max(registry["registry_version"], day)
    keys = []
    for name in malpractice_modules():
        module = importlib.import_module(name)
        registry[module.KEY] = module.build(day)
        keys.append(module.KEY)
    return keys
