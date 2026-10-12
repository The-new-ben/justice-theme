#!/usr/bin/env python3
"""Build or refresh assets/data/justice-tools-registry.json from the official sources.

The co.il tools (HAD-485) read every number from ONE dated registry. This script is the only
way that file is written: it pulls each series from its official publisher and records where
and when it was checked. Nothing is typed in by hand except the chaining coefficients' check
(which is recomputed from the CBS calculator) and the minimum-wage rows, which are parsed from
the National Insurance Institute table.

Sources
  CPI (series 120010)       https://api.cbs.gov.il/index/data/price  (Central Bureau of Statistics)
  CPI chaining check        https://api.cbs.gov.il/index/data/calculator/120010
  Interest Adjudication Law https://ga.mof.gov.il/api/rate/history/<id>  (Accountant General)
  Minimum wage              https://www.btl.gov.il/Mediniyut/GeneralData/Pages/שכר מינימום.aspx

Usage
  python tools/justice_tools_registry.py --checked-on 2026-10-12 \
      --cpi-json cpi.json --rates-dir ga/ --minwage-html btl.html --out assets/data/justice-tools-registry.json

Every input can be a saved file (so a reviewer can rebuild the exact registry from the files
attached to the PR) or omitted to fetch live. The script never estimates a missing value: a
series it cannot read stops the run.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
CBS_PRICE = "https://api.cbs.gov.il/index/data/price?id=120010&format=json&download=false&startPeriod=01-1990&endPeriod=12-2030&lang=he&PageSize=1000"
GA_HISTORY = "https://ga.mof.gov.il/api/rate/history/{id}"
BTL_MINWAGE = "https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D.aspx"

# Chaining coefficient from each CBS base to the next one, as the CBS linkage calculator applies
# them (checked 12.10.2026 by reproducing the calculator's own results; see tests/js/fixtures).
CPI_CHAIN = {
    "1987": 2.421, "1993": 1.581, "1998": 1.064, "2000": 1.068, "2002": 1.038, "2006": 1.051,
    "2008": 1.061, "2010": 1.052, "2012": 1.020, "2014": 0.989, "2016": 1.010, "2018": 1.003,
    "2020": 1.059, "2022": 1.074,
}
GA_IDS = {"shekel": 10, "linked": 12, "arrears_fee": 17, "value_a": 14, "value_b": 15, "inflation_expectations": 16}


def fetch(url: str, referer: str | None = None) -> bytes:
    headers = {"User-Agent": UA, "Accept-Language": "he-IL,he;q=0.9"}
    if referer:
        headers["Referer"] = referer
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=60) as response:
        return response.read()


def build_cpi(raw: dict, checked_on: str) -> dict:
    months = raw["month"][0]["date"]
    rows = sorted(((m["year"], m["month"], m["currBase"]["value"], m["currBase"]["baseDesc"]) for m in months))
    series, bases = [], []
    for year, month, value, base_desc in rows:
        base_id = re.search(r"(\d{4})", base_desc).group(1)
        key = f"{year:04d}-{month:02d}"
        series.append([key, value])
        if not bases or bases[-1]["id"] != base_id:
            if bases:
                bases[-1]["to"] = series[-2][0]
            bases.append({"id": base_id, "label": f"ממוצע {base_id} = 100", "from": key, "to": None,
                          "to_next": None})
    bases[-1]["to"] = series[-1][0]
    for base in bases[:-1]:
        if base["id"] not in CPI_CHAIN:
            raise SystemExit(f"No chaining coefficient for base {base['id']}")
        base["to_next"] = CPI_CHAIN[base["id"]]
    latest = series[-1][0]
    return {
        "name_he": "מדד המחירים לצרכן - כללי",
        "code": 120010,
        "publisher_he": "הלשכה המרכזית לסטטיסטיקה",
        "source_name": "הלשכה המרכזית לסטטיסטיקה, ממשק המדדים (סדרה 120010)",
        "source_url": "https://api.cbs.gov.il/index/data/price?id=120010&format=json&download=false",
        "official_calculator_url": "https://www.cbs.gov.il/he/Pages/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-%D7%94%D7%A6%D7%9E%D7%93%D7%94.aspx",
        "checked_on": checked_on,
        "refresh_every_days": 31,
        "latest_month": latest,
        "known_from_day": 16,
        "known_rule_he": "מדד של חודש מסוים נחשב ידוע מה-16 בחודש שאחריו, כפי שמחשבון ההצמדה של הלמ\"ס מיישם",
        "bases": bases,
        "series": series,
    }


def read_ga_history(path_or_bytes) -> list[list]:
    import io
    import openpyxl  # only needed when building the registry, never at runtime

    book = openpyxl.load_workbook(io.BytesIO(path_or_bytes), data_only=True)
    out = []
    for date_text, rate in list(book.active.iter_rows(values_only=True))[2:]:
        if not date_text or rate is None:
            continue
        day, month, year = (int(x) for x in str(date_text).split("/"))
        out.append([f"{year:04d}-{month:02d}-{day:02d}", float(rate)])
    return out


def build_interest(histories: dict, checked_on: str) -> dict:
    regime_start = "2025-01-01"
    out = {
        "law_he": "חוק פסיקת ריבית והצמדה, התשכ\"א-1961 (בנוסחו מ-1.1.2025, תיקון מס' 9)",
        "law_url": "https://www.boi.org.il/media/cdeg25cb/184a.pdf",
        "amendment_url": "https://fs.knesset.gov.il/25/law/25_lsr_3568695.pdf",
        "regulations_he": "תקנות פסיקת ריבית והצמדה (קביעת השיעורים במונחים שנתיים של ריבית שקלית, ריבית צמודה ודמי פיגורים, דרך חישובם ואופן פרסומם), התשפ\"ה-2024",
        "regulations_url": "https://www.nevo.co.il/law_html/law00/232127.htm",
        "publisher_he": "אגף החשב הכללי, משרד האוצר",
        "source_name": "אתר הריביות של החשב הכללי (ga.mof.gov.il), היסטוריית שיעורים",
        "source_url": "https://ga.mof.gov.il/",
        "open_data_url": "https://data.gov.il/dataset/accountantgeneralinterest",
        "checked_on": checked_on,
        "refresh_every_days": 92,
        "regime_start": regime_start,
    }
    for key, rows in histories.items():
        out[key] = [{"from": d, "rate": r} for d, r in rows if d >= regime_start]
        if not out[key]:
            raise SystemExit(f"No {key} rows from {regime_start}")
    return out


def build_minwage(page_html: str, checked_on: str) -> dict:
    text = re.sub(r"(?s)<script.*?</script>|<style.*?</style>", "", page_html)
    text = html.unescape(re.sub(r"<[^>]+>", "|", text)).replace("​", "")
    text = re.sub(r"\s*\|[\s|]*", "|", text)
    start = text.find("שכר מינימום החל מ-1.4.1997")
    if start < 0:
        raise SystemExit("BTL minimum wage table not found")
    cells = [c.strip() for c in text[start:].split("|") if c.strip()]
    rows, i = [], 0
    date_re = re.compile(r"^\d{1,2}\.\d{1,2}\.\d{4}$")
    num_re = re.compile(r"^[\d,]+\.?\d*$")
    while i < len(cells):
        if date_re.match(cells[i]):
            nums = []
            j = i + 1
            while j < len(cells) and not date_re.match(cells[j]) and num_re.match(cells[j]):
                if num_re.match(cells[j]):
                    nums.append(float(cells[j].replace(",", "")))
                j += 1
            day, month, year = (int(x) for x in cells[i].split("."))
            rows.append((f"{year:04d}-{month:02d}-{day:02d}", nums))
            i = j
        else:
            i += 1
    parsed = []
    for date, nums in rows:
        if date < "2015-04-01":
            continue
        if len(nums) == 5:
            daily5, daily6, hourly186, hourly182, monthly = nums
        elif len(nums) == 4:
            daily5, daily6, hourly186, monthly = nums
            hourly182 = None
        else:
            raise SystemExit(f"Unexpected BTL row {date}: {nums}")
        parsed.append({"from": date, "monthly": monthly, "hourly_186": hourly186, "hourly_182": hourly182,
                       "daily_5": daily5, "daily_6": daily6})
    parsed.sort(key=lambda r: r["from"])
    return {
        "law_he": "חוק שכר מינימום, התשמ\"ז-1987",
        "law_url": "https://www.nevo.co.il/law_html/law00/98675.htm",
        "youth_regulations_he": "תקנות שכר מינימום (נוער עובד וחניכים), התשמ\"ח-1987",
        "youth_regulations_url": "https://www.btl.gov.il/Laws1/02_0021_100000.pdf",
        "publisher_he": "המוסד לביטוח לאומי",
        "source_name": "המוסד לביטוח לאומי, נתונים כלליים: שכר מינימום",
        "source_url": BTL_MINWAGE,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update_he": "1 באפריל בכל שנה (סעיף 1 לחוק, ההגדרה 'שכר מינימום')",
        "youth_pct": {"under16": 70, "age16": 75, "age17": 83, "apprentice": 60},
        "youth_hours_divisor": 173,
        "youth_full_time_weekly_hours": 40,
        "rows": parsed,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--checked-on", required=True)
    parser.add_argument("--cpi-json")
    parser.add_argument("--rates-dir", help="folder with ga-hist-<id>.xlsx files saved from ga.mof.gov.il")
    parser.add_argument("--minwage-html")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    cpi_raw = json.loads(Path(args.cpi_json).read_text(encoding="utf-8")) if args.cpi_json else json.loads(fetch(CBS_PRICE))
    histories = {}
    for key, rate_id in GA_IDS.items():
        if args.rates_dir:
            blob = (Path(args.rates_dir) / f"ga-hist-{rate_id}.xlsx").read_bytes()
        else:
            blob = fetch(GA_HISTORY.format(id=rate_id), referer="https://ga.mof.gov.il/")
        histories[key] = read_ga_history(blob)
    page = Path(args.minwage_html).read_text(encoding="utf-8", errors="replace") if args.minwage_html else fetch(BTL_MINWAGE).decode("utf-8", "replace")

    registry = {
        "schema": 1,
        "registry_version": args.checked_on,
        "checked_on": args.checked_on,
        "note_he": "כל מספר שמוצג בכלים של jus-tice.co.il נקרא מהקובץ הזה בלבד. כל סדרה נבדקה מול המפרסם הרשמי בתאריך checked_on.",
        "cpi": build_cpi(cpi_raw, args.checked_on),
        "interest": build_interest(histories, args.checked_on),
        "min_wage": build_minwage(page, args.checked_on),
    }
    text = json.dumps(registry, ensure_ascii=False, indent=1)
    # One CPI month per line ("YYYY-MM", value) and one rate row per line keep reviews readable.
    text = re.sub(r'\[\n\s*("\d{4}-\d{2}"),\n\s*([\d.]+)\n\s*\]', r'[\1, \2]', text)
    text = re.sub(r'\{\n\s*("from": "[\d-]+"),\n\s*("rate": [\d.]+)\n\s*\}', r'{\1, \2}', text)
    Path(args.out).write_text(text + "\n", encoding="utf-8")
    print(f"wrote {args.out}: CPI to {registry['cpi']['latest_month']}, "
          f"{len(registry['interest']['linked'])} interest quarters, {len(registry['min_wage']['rows'])} minimum-wage rows")
    return 0


if __name__ == "__main__":
    sys.exit(main())
