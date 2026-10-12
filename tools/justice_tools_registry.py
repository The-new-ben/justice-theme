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
  Recuperation pay (T03)    gov.il extension orders (Yalkut HaPirsumim 7417, 11651, 14863), the 2024 and
                            2025 havraa laws (Sefer HaChukim 3180, 3384): see build_havraa()
  Small claims (T05)        gov.il fee guide (Courts Authority), the 1976 procedure regulations and the
                            Courts Law: see build_small_claims()

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


def build_havraa(checked_on: str) -> dict:
    """Recuperation pay (T03, HAD-490). gov.il refuses scripted reads, so these rows were read on
    checked_on from the official files linked in each row (Ministry of Labor extension orders in
    Yalkut HaPirsumim, the 2024 and 2025 laws in Sefer HaChukim, the Accountant General's guide and
    the Ministry of Education circular) and are kept here, never typed into a page. A refresh means
    re-reading those files; nothing here is estimated."""
    gov = "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/"
    law_2024 = "https://fs.knesset.gov.il/25/law/25_lsr_4232982.pdf"
    law_2025 = "https://fs.knesset.gov.il/25/law/25_lsr_6133485.pdf"
    return {
        "name_he": "דמי הבראה (קצובת הבראה)",
        "publisher_he": "משרד העבודה",
        "source_name": "משרד העבודה, מאגר צווי הרחבה: צו הרחבה בדבר השתתפות המעסיק בהוצאות הבראה ונופש",
        "source_url": "https://www.gov.il/he/Departments/DynamicCollectors/extension-orders?skip=0",
        "guide_url": "https://www.gov.il/he/pages/convalescence-pay?chapterIndex=2",
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "order_he": "צו הרחבה בדבר השתתפות המעביד בהוצאות הבראה ונופש (ילקוט הפרסומים 7417, 8.1.2017)",
        "order_url": gov + "extention-order-recovery-recreation-2016/he/extention-order-recovery-recreation-2016.pdf",
        "payment_months_he": "יוני עד ספטמבר",
        # [first work year, last work year (None = and on), days]: the order, s.5(א).
        "days": [[1, 1, 5], [2, 3, 6], [4, 10, 7], [11, 15, 8], [16, 19, 9], [20, None, 10]],
        "private_rates": [
            {"from": "2014-01-01", "rate": 378.0, "label_he": "החל משנת 2014",
             "source_he": "משרד העבודה, מדריך 'קצובת הבראה', פרק החישוב; צו ההרחבה, ילקוט הפרסומים 7417, סעיף 2(א)",
             "url": "https://www.gov.il/he/pages/convalescence-pay?chapterIndex=2"},
            {"from": "2023-07-01", "rate": 418.0, "label_he": "מ-1.7.2023",
             "source_he": "צו הרחבה בדבר השתתפות המעסיק בהוצאות הבראה ונופש, ילקוט הפרסומים 11651, 20.9.2023, סעיף 3",
             "url": gov + "11651/he/workers-rights_work-relations_11651.pdf"},
            {"from": "2026-01-01", "rate": 451.5, "label_he": "שנת ההבראה 2026",
             "source_he": "צו הרחבה בדבר השתתפות המעסיק בהוצאות הבראה ונופש, ילקוט הפרסומים 14863, 18.8.2026, סעיף 3",
             "url": gov + "order14863/he/workers-rights_order14863.pdf"},
        ],
        "freezes": [
            {"year": 2024, "law_he": "חוק הקפאה והפחתה של דמי הבראה בשנת 2024 לשם תקצוב הטבות לחיילי מילואים, התשפ\"ד-2024",
             "section": "סעיף 2(א)", "url": law_2024},
            {"year": 2025, "law_he": "חוק הקפאה והפחתה של דמי הבראה בשנת 2025, התשפ\"ה-2025",
             "section": "סעיף 2(א)", "url": law_2025},
        ],
        "deductions": [
            {"year": 2024, "days": 1, "half_salary_max": 6000, "half_months_he": "ינואר עד מרץ 2024", "half_requires_five_days": True,
             "law_he": "חוק הקפאה והפחתה של דמי הבראה בשנת 2024 לשם תקצוב הטבות לחיילי מילואים, התשפ\"ד-2024",
             "gazette_he": "ספר החוקים 3180, 18.3.2024", "sections": "סעיפים 1, 3(א) ו-8", "url": law_2024},
            {"year": 2025, "days": 1, "half_salary_max": 6150, "half_months_he": "אוקטובר עד דצמבר 2024", "half_requires_five_days": False,
             "price_min": 418.0, "price_max": 471.4,
             "law_he": "חוק הקפאה והפחתה של דמי הבראה בשנת 2025, התשפ\"ה-2025",
             "gazette_he": "ספר החוקים 3384, 27.3.2025 (פרק ז')", "sections": "סעיפים 1, 3(א) ו-8", "url": law_2025},
        ],
        # Comparison only: public-sector havraa follows public-sector agreements, not this order.
        "public_rates": [
            {"year": 2024, "rate": 471.4, "scope_he": "עובדי המדינה, למעט דירוג רופאים",
             "source_he": "אגף החשב הכללי, 'דמי הבראה, ביגוד ומענק יובל'",
             "url": "https://www.gov.il/he/pages/clothing-and-service-bonus"},
            {"year": 2025, "rate": 471.4, "scope_he": "הסכום של 2024 נשמר",
             "source_he": "חוק הקפאה והפחתה של דמי הבראה בשנת 2025, סעיף 2(א): הסכום של 2024 נשמר",
             "url": law_2025},
            {"year": 2026, "rate": 511.6, "scope_he": "עובדי הוראה",
             "source_he": "משרד החינוך, חוזר לבעלויות תשפ\"ו/7, 22.6.2026",
             "url": "https://meyda.education.gov.il/files/Sherut/manakyovelh.pdf"},
        ],
        "limitation_years": 7,
        "limitation_he": "חוק ההתיישנות, התשי\"ח-1958, סעיפים 5(1) ו-6",
        "limitation_url": "https://www.nevo.co.il/law_html/law00/71809.htm",
        "labor_court_he": "חוק בית הדין לעבודה, התשכ\"ט-1969, סעיף 24(א)(1)",
        "labor_court_url": "https://www.nevo.co.il/law_html/law01/042_001.htm",
    }


def build_small_claims(checked_on: str) -> dict:
    """Small claims (T05, HAD-490): the ceiling notice and the fee rule from the Courts Authority's
    fee guide on gov.il, the procedure rules from the regulations' consolidated text, the court rules
    from the Courts Law; read on checked_on."""
    return {
        "name_he": "בית המשפט לתביעות קטנות",
        "publisher_he": "הרשות השופטת",
        "source_name": "הרשות השופטת, מדריך האגרות: אגרות בבתי המשפט לתביעות קטנות",
        "source_url": "https://www.gov.il/he/pages/fee_guide?chapterIndex=3",
        "service_url": "https://www.gov.il/he/service/filing_a_small_claim",
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "ceiling": [
            {"from": "2026-01-01", "amount": 39900, "notice_date": "2025-12-22",
             "source_he": "הודעת מנהל בתי המשפט מיום 22.12.2025 לפי סעיף 2(ג) לצו בתי המשפט (שינוי סכום התביעה בתביעות קטנות), התשס\"ח-2008",
             "url": "https://www.gov.il/BlobFolder/guide/fee_guide/he/8869-11-19_fees_scf1126.pdf"},
        ],
        "fee": {"pct": 1, "min": 50, "round_up_to": 5,
                "regulation_he": "תקנות שיפוט בתביעות קטנות (סדרי דין), התשל\"ז-1976",
                "section": "תקנה 6(א)",
                "regulation_url": "https://www.nevo.co.il/law_html/law00/98563.htm"},
        "law_he": "חוק בתי המשפט [נוסח משולב], התשמ\"ד-1984",
        "law_url": "https://www.nevo.co.il/law_html/law00/74849.htm",
        "max_claims_per_year": 5,
        # Where a claim goes when it is not a small claim: Courts Law s.51(א)(2) (magistrate court, civil claims
        # other than land up to 2,500,000 NIS on the filing day) and s.40(1) (district court, the rest).
        "magistrate_max": 2500000,
        "magistrate_section": "סעיף 51(א)(2)",
        "district_section": "סעיף 40(1)",
        "deadlines": {"defence_days": 30, "service_check_days_before": 60, "plaintiff_service_days_before": 40,
                      "witness_request_days_before": 60, "interpreter_days_before": 7, "set_aside_days": 30},
        "claim_body_max_pages": 5,
        "online_max_plaintiffs": 5,
        "online_max_defendants": 5,
        "limitation_years": 7,
        "limitation_he": "חוק ההתיישנות, התשי\"ח-1958, סעיפים 5(1) ו-6",
        "limitation_url": "https://www.nevo.co.il/law_html/law00/71809.htm",
        "labor_court_he": "חוק בית הדין לעבודה, התשכ\"ט-1969, סעיף 24(א)(1)",
        "labor_court_url": "https://www.nevo.co.il/law_html/law01/042_001.htm",
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
        "havraa": build_havraa(args.checked_on),
        "small_claims": build_small_claims(args.checked_on),
    }
    text = json.dumps(registry, ensure_ascii=False, indent=1)
    # One CPI month per line ("YYYY-MM", value) and one rate row per line keep reviews readable.
    text = re.sub(r'\[\n\s*("\d{4}-\d{2}"),\n\s*([\d.]+)\n\s*\]', r'[\1, \2]', text)
    text = re.sub(r'\{\n\s*("from": "[\d-]+"),\n\s*("rate": [\d.]+)\n\s*\}', r'{\1, \2}', text)
    # One havraa seniority band per line: [first work year, last work year, days].
    text = re.sub(r'\[\n\s*(\d+),\n\s*(\d+|null),\n\s*(\d+)\n\s*\]', r'[\1, \2, \3]', text)
    # LF on every platform: CI rejects CRLF (git diff --check), and Windows would otherwise write CRLF.
    with open(args.out, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(text + "\n")
    print(f"wrote {args.out}: CPI to {registry['cpi']['latest_month']}, "
          f"{len(registry['interest']['linked'])} interest quarters, {len(registry['min_wage']['rows'])} minimum-wage rows")
    return 0


if __name__ == "__main__":
    sys.exit(main())
