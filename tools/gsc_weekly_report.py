#!/usr/bin/env python3
"""Generate weekly Search Console opportunity CSVs.

Requires environment variables:
GSC_SITE_URL, GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY
"""

from __future__ import annotations

import csv
import datetime as dt
import json
import os
import sys
from pathlib import Path

import requests


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "project-control"
API_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
TOKEN_URL = "https://oauth2.googleapis.com/token"


def main() -> int:
    site_url = os.environ.get("GSC_SITE_URL", "https://jus-tice.co.il/")
    client_email = os.environ.get("GSC_CLIENT_EMAIL", "")
    private_key = os.environ.get("GSC_PRIVATE_KEY", "").replace("\\n", "\n")

    if not client_email or not private_key:
        write_empty_reports("BLOCKED: missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY secrets")
        return 0

    try:
        import google.auth.transport.requests
        from google.oauth2 import service_account
    except ImportError:
        print("Missing google-auth. Install with: pip install google-auth requests", file=sys.stderr)
        return 1

    credentials_info = {
        "type": "service_account",
        "client_email": client_email,
        "private_key": private_key,
        "token_uri": TOKEN_URL,
    }
    credentials = service_account.Credentials.from_service_account_info(
        credentials_info,
        scopes=[API_SCOPE],
    )
    credentials.refresh(google.auth.transport.requests.Request())

    end_date = dt.date.today() - dt.timedelta(days=3)
    start_date = end_date - dt.timedelta(days=28)

    rows = query_gsc(site_url, credentials.token, start_date, end_date)
    write_reports(rows)
    print(f"Wrote {len(rows)} GSC rows for {start_date} to {end_date}")
    return 0


def query_gsc(site_url: str, token: str, start_date: dt.date, end_date: dt.date) -> list[dict]:
    endpoint = f"https://www.googleapis.com/webmasters/v3/sites/{requests.utils.quote(site_url, safe='')}/searchAnalytics/query"
    body = {
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "dimensions": ["query", "page", "device", "country"],
        "rowLimit": 25000,
        "startRow": 0,
    }
    response = requests.post(
        endpoint,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        data=json.dumps(body),
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()

    rows: list[dict] = []
    for row in data.get("rows", []):
        keys = row.get("keys", ["", "", "", ""])
        rows.append(
            {
                "query": keys[0] if len(keys) > 0 else "",
                "page": keys[1] if len(keys) > 1 else "",
                "device": keys[2] if len(keys) > 2 else "",
                "country": keys[3] if len(keys) > 3 else "",
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr": row.get("ctr", 0),
                "position": row.get("position", 0),
            }
        )

    return rows


def write_reports(rows: list[dict]) -> None:
    OUT.mkdir(exist_ok=True)
    write_csv(OUT / "gsc-opportunities.csv", rows)
    write_csv(OUT / "gsc-low-ctr.csv", [r for r in rows if float(r["impressions"]) >= 100 and float(r["ctr"]) < 0.03])
    write_csv(OUT / "gsc-position-5-20.csv", [r for r in rows if 5 <= float(r["position"]) <= 20])
    write_csv(OUT / "gsc-cannibalization.csv", cannibalization_rows(rows))


def cannibalization_rows(rows: list[dict]) -> list[dict]:
    by_query: dict[str, set[str]] = {}
    for row in rows:
        if row["query"]:
            by_query.setdefault(row["query"], set()).add(row["page"])

    cannibalized = {query for query, pages in by_query.items() if len(pages) > 1}
    return [row for row in rows if row["query"] in cannibalized]


def write_empty_reports(reason: str) -> None:
    OUT.mkdir(exist_ok=True)
    headers = ["query", "page", "device", "country", "clicks", "impressions", "ctr", "position", "status"]
    for filename in ("gsc-opportunities.csv", "gsc-low-ctr.csv", "gsc-position-5-20.csv", "gsc-cannibalization.csv"):
        with (OUT / filename).open("w", newline="", encoding="utf-8") as fh:
            writer = csv.DictWriter(fh, fieldnames=headers)
            writer.writeheader()
            writer.writerow({"status": reason})


def write_csv(path: Path, rows: list[dict]) -> None:
    headers = ["query", "page", "device", "country", "clicks", "impressions", "ctr", "position"]
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    raise SystemExit(main())
