"""The family + land wave (21.10.2026, HAD-579): the per-instrument datasets of tools/justice_tools_fl_<name>.py.

Each module defines KEY = "fl_<name>" and build(checked_on) -> dict, in the style of tools/justice_tools_inheritance.py:
every figure with its official source url and section, nothing estimated. The registry builder calls add_fl() when
--fl-checked-on is given (or on a full rebuild)."""
from __future__ import annotations

import importlib
from pathlib import Path


def fl_modules() -> list:
    """Every tools/justice_tools_fl_<name>.py next to this file, in name order."""
    here = Path(__file__).resolve().parent
    return sorted(p.stem for p in here.glob("justice_tools_fl_*.py"))


def add_fl(registry: dict, day: str | None) -> list:
    """Add every family + land dataset that exists, each with checked_on = day. Returns the keys."""
    if not day:
        return []
    registry["registry_version"] = max(registry["registry_version"], day)
    keys = []
    for name in fl_modules():
        module = importlib.import_module(name)
        if getattr(module, "READS_REGISTRY", False):
            continue  # built by add_fl_dependents(), after every other dataset
        registry[module.KEY] = module.build(day)
        keys.append(module.KEY)
    return keys


def add_fl_dependents(registry: dict, day: str | None) -> list:
    """The datasets that resolve their amounts from other datasets (READS_REGISTRY, the divorce price list of HAD-616):
    built last, from the registry being assembled, so a fee refreshed on this run reaches them on this run. Without a day,
    each keeps the checked_on it already has, and is rebuilt only when it is already in the registry."""
    keys = []
    for name in fl_modules():
        module = importlib.import_module(name)
        if not getattr(module, "READS_REGISTRY", False):
            continue
        when = day or (registry.get(module.KEY) or {}).get("checked_on")
        if not when:
            continue
        registry["registry_version"] = max(registry["registry_version"], when)
        registry[module.KEY] = module.build(when, registry)
        keys.append(module.KEY)
    return keys
