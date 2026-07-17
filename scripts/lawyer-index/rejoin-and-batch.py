#!/usr/bin/env python3
"""Offline rejoin: full-index CSV x rankings-latest.csv -> importer payload batches.

Owner privacy rule: rankings-latest.csv (guide brand/scores) NEVER touches
the production web server. This script runs locally, joins the two
datasets by exact full_name match, strips the ranking data down to the
internal-only {guide, tier, label, area, year} shape the importer already
treats as write-once internal meta (jt_rank_entry), and writes batch files
of <=200 rows ready to POST to justice-ops/v1/lawyer-index-import-v2.

Usage: python3 scripts/lawyer-index/rejoin-and-batch.py
Reads:
  - the uploaded full-index CSV (13 columns, path below)
  - project-control/lawyer-index/rankings-latest.csv (14 columns)
Writes:
  - project-control/lawyer-index/batches/batch-NN.json (dry_run:false payloads,
    <=200 rows each, rank_entries embedded per row)
  - project-control/lawyer-index/JOIN-REPORT.md (match stats, unmatched names)
"""
import csv
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FULL_INDEX_CSV = "/root/.claude/uploads/2a51acae-d32c-518b-86d0-9a472cff9716/72f4e090-israeli_law_firms_full_index.csv"
RANKINGS_CSV = os.path.join(ROOT, "project-control", "lawyer-index", "rankings-latest.csv")
BATCH_DIR = os.path.join(ROOT, "project-control", "lawyer-index", "batches")
REPORT_PATH = os.path.join(ROOT, "project-control", "lawyer-index", "JOIN-REPORT.md")
BATCH_SIZE = 200


def load_full_index():
    with open(FULL_INDEX_CSV, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def load_rankings():
    with open(RANKINGS_CSV, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def main():
    full_rows = load_full_index()
    rank_rows = load_rankings()

    rank_by_name = {}
    for r in rank_rows:
        name = r["full_name"].strip()
        rank_by_name.setdefault(name, []).append(r)

    os.makedirs(BATCH_DIR, exist_ok=True)
    for old in os.listdir(BATCH_DIR):
        if old.startswith("batch-") and old.endswith(".json"):
            os.remove(os.path.join(BATCH_DIR, old))

    payload_rows = []
    matched = 0
    unmatched_names = []

    for row in full_rows:
        name = row["full_name"].strip()
        rank_matches = rank_by_name.get(name, [])

        if rank_matches:
            matched += 1
        else:
            unmatched_names.append(name)

        seen_entries = set()
        rank_entries = []
        for m in rank_matches:
            key = (m["guide_code"], m["guide_practice_label"], m["rank_year"])
            if key in seen_entries:
                continue
            seen_entries.add(key)
            rank_entries.append({
                "guide": m["guide_code"].strip(),
                "tier": int(m["rank_tier"]) if str(m["rank_tier"]).strip().isdigit() else 0,
                "label": m["rank_label_raw"].strip(),
                "area": m["guide_practice_label"].strip(),
                "year": int(m["rank_year"]) if str(m["rank_year"]).strip().isdigit() else 0,
            })

        payload_rows.append({
            "full_name": name,
            "entity_type": "firm",
            "office_address": row.get("office_address", "").strip(),
            "city": row.get("city", "").strip(),
            "phone": row.get("phone", "").strip(),
            "website": row.get("website", "").strip(),
            "email": row.get("email", "").strip(),
            "practice_areas": row.get("practice_areas", "").strip(),
            "firm_size_lawyers": row.get("firm_size_lawyers", "").strip(),
            "founded_year": row.get("founded_year", "").strip(),
            "branches": row.get("branches", "").strip(),
            "short_description": row.get("short_description", "").strip(),
            "address_source_url": row.get("address_source_url", "").strip(),
            "notes": row.get("notes", "").strip(),
            "rank_entries": rank_entries,
        })

    batch_files = []
    for i in range(0, len(payload_rows), BATCH_SIZE):
        chunk = payload_rows[i:i + BATCH_SIZE]
        idx = i // BATCH_SIZE + 1
        path = os.path.join(BATCH_DIR, f"batch-{idx:02d}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"dry_run": True, "rows": chunk}, f, ensure_ascii=False)
        batch_files.append((path, len(chunk)))

    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        f.write("# Offline rejoin report\n\n")
        f.write(f"- full-index rows: {len(full_rows)}\n")
        f.write(f"- rankings rows: {len(rank_rows)} ({len(rank_by_name)} unique names)\n")
        f.write(f"- matched (rank_entries attached): {matched}\n")
        f.write(f"- unmatched (rank_entries empty - firm appears only in the full-index pass): {len(unmatched_names)}\n")
        f.write(f"- batches written: {len(batch_files)} (<= {BATCH_SIZE} rows each), dry_run:true by default\n\n")
        if unmatched_names:
            f.write("## Unmatched names (first 40)\n\n")
            for n in unmatched_names[:40]:
                f.write(f"- {n}\n")

    print(f"full-index rows: {len(full_rows)}")
    print(f"matched to rankings: {matched}")
    print(f"unmatched: {len(unmatched_names)}")
    print(f"batches: {len(batch_files)}")
    for path, n in batch_files:
        print(f"  {os.path.relpath(path, ROOT)}: {n} rows")


if __name__ == "__main__":
    main()
