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
  Wave 3 (HAD-498)          Succession Law and the registrar's fee regulations (build_yerusha), the Land
                            Taxation Law, the purchase-tax regulations and the Tax Authority's instructions
                            1/2025 and 2/2026 (build_purchase_tax), the Third Schedule to the Planning and
                            Building Law (build_betterment)

Usage
  python tools/justice_tools_registry.py --checked-on 2026-10-12 \
      --cpi-json cpi.json --rates-dir ga/ --minwage-html btl.html --out assets/data/justice-tools-registry.json
  python tools/justice_tools_registry.py --checked-on 2026-10-13 --base assets/data/justice-tools-registry.json \
      --out assets/data/justice-tools-registry.json        (wave 3 only: keeps the other datasets as they are)
  add --wave4-checked-on <day> to rebuild the wave-4 datasets (HAD-502) with the --base refresh; a full rebuild (no
  --base) always builds them, read on --wave4-checked-on or, when it is not given, on --checked-on

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


# The government payments service of the Ministry of Justice (Registrar of Inheritance) lists what is charged: the
# reduced fee for an online request (reg. 1(א): 85% of item 1, charged in whole shekels) and the publication expenses of
# each request (Succession Regulations reg. 17(ג); the regulations give no amount). Read on the date below.
REGISTRAR_PAYMENTS = {
    "online_fee": 507,
    "publication": 66,
    "he": "שירות התשלומים הממשלתי, משרד המשפטים, אגרות לשירותי רשם הירושה",
    "url": "https://ecom.gov.il/counterspa/home/9/1/inheritanceRegistar?language=he",
    "checked_on": "2026-10-14",
}


def build_yerusha(checked_on: str) -> dict:
    """Intestate succession (wave 3, HAD-498): who inherits what when there is no will. The shares are the
    law's own fractions (Succession Law ss.10-17, 55), read on checked_on in the consolidated text; the
    registrar's fee and the objection window come from the 1998 fee regulations (current to 1.1.2026) and
    the 1998 Succession Regulations. Nothing here is estimated."""
    law = "https://www.nevo.co.il/law_html/law00/72178.htm"
    return {
        "name_he": "ירושה על פי דין",
        "publisher_he": "חוק הירושה ותקנותיו",
        "source_name": "חוק הירושה, התשכ\"ה-1965 (נוסח עדכני)",
        "source_url": law,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "law_he": "חוק הירושה, התשכ\"ה-1965",
        "law_url": law,
        "law_current_to": "2025-01-01",
        # s.11(א): the spouse's part of the rest of the estate, as [numerator, denominator].
        "spouse_half": [1, 2],
        "spouse_two_thirds": [2, 3],
        "spouse_apartment_min_years": 3,
        "sections": {
            "heirs": "סעיף 10", "spouse": "סעיף 11(א)", "spouse_all": "סעיף 11(ב)", "spouse_deduct": "סעיף 11(ג)",
            "order": "סעיף 12", "equal": "סעיף 13", "represent": "סעיף 14", "renounce": "סעיף 15",
            "adopted": "סעיף 16", "state": "סעיף 17", "cohabit": "סעיף 55", "born": "סעיף 3(ג)", "posthumous": "סעיף 3(ב)", "domicile": "סעיף 137",
        },
        "fees": {
            "order_fee": 597, "from": "2026-01-01", "online_pct": 85,
            "regulation_he": "תקנות הירושה (אגרות הרשם לעניני ירושה), התשנ\"ח-1998",
            "section": "תקנה 1(א) והתוספת, פרט 1",
            "exempt_section": "תקנה 4(5)",
            "url": "https://www.nevo.co.il/law_html/law00/72181.htm",
            "current_to": "2026-01-01",
            "indexed_he": "מתעדכנת ב-1 בינואר לפי המדד (תקנה 2)",
        },
        "objection_days": 14,
        "objection_he": "שבועיים מיום הפרסום, או יותר אם הרשם קבע",
        "objection_section": "תקנה 17(א)",
        # The publication is paid on top of the fee (reg. 17(ג)); the regulations give no amount, the government payments
        # service charges it per request (REGISTRAR_PAYMENTS, with its own checked_on).
        "publication_section": "תקנה 17(ג)",
        "payments": dict(REGISTRAR_PAYMENTS),
        "regulations_he": "תקנות הירושה, התשנ\"ח-1998",
        "regulations_url": "https://www.nevo.co.il/law_html/law00/98588.htm",
        "service_url": "https://www.gov.il/he/service/inheritance_order",
        "service_he": "האפוטרופוס הכללי, בקשה למתן צו ירושה לרשם לענייני ירושה",
    }


def build_purchase_tax(checked_on: str) -> dict:
    """Purchase tax on a home (wave 3, HAD-498). The brackets are in the law (s.9(ג1ג)(3), s.9(ג1ו)) and in
    the Tax Authority's execution instruction 1/2025, which states they stay frozen (single home) until
    15.1.2028 and that the 8%/10% rule for an additional home runs to 31.12.2026. The oleh and disability
    tracks are purchase-tax regulations 12א and 11(א); the replacement-home windows and the war extension
    are s.9(ג1ג)(2)(ב) and instruction 2/2026. VAT for the full-cost panel: the 2005 VAT rate order."""
    law = "https://www.nevo.co.il/law_html/law01/276_002.htm"
    regs = "https://www.nevo.co.il/law_html/law01/276_019.htm"
    inst1 = "https://www.gov.il/BlobFolder/policy/inst-01-2025-3/he/realestate_inst-01-2025-3.pdf"
    inst2 = "https://www.gov.il/BlobFolder/policy/inst-02-2026-1/he/realestate_inst-02-2026.pdf"
    inst24 = "https://www.gov.il/BlobFolder/policy/reinst-02-2024/he/realestate_reinst-02-2024.pdf"
    inst26 = "https://www.gov.il/BlobFolder/policy/inst-01-2026/he/realestate_inst-01-2026.pdf"
    notice = "https://www.gov.il/he/pages/pa121026-2"
    return {
        "name_he": "מס רכישה על דירת מגורים",
        "publisher_he": "רשות המסים",
        "source_name": "רשות המסים, הוראת ביצוע מיסוי מקרקעין 1/2026: עדכון הסכומים והקפאת הסכומים",
        "source_url": inst26,
        "simulator_url": "https://www.misim.gov.il/svsimurechisha/",
        "checked_on": checked_on,
        "refresh_every_days": 92,
        "next_update": "2027-02-11",
        "law_he": "חוק מיסוי מקרקעין (שבח ורכישה), התשכ\"ג-1963",
        "law_url": law,
        "regulations_he": "תקנות מיסוי מקרקעין (שבח ורכישה) (מס רכישה), התשל\"ה-1974",
        "regulations_url": regs,
        # Each track: brackets as [upper limit of the bracket (None = no limit), rate %], valid from-to (inclusive).
        "tracks": {
            "single": {"from": "2024-01-16", "to": "2028-01-15", "section": "סעיף 9(ג1ג)(3)",
                       "brackets": [[1978745, 0], [2347040, 3.5], [6055070, 5], [20183565, 8], [None, 10]],
                       "source_he": "הוראות ביצוע 2/2024 (מ-16.1.2024), 1/2025 ו-1/2026, סעיף 2(א): המדרגות קפואות עד 15.1.2028",
                       "url": inst26, "url_2024": inst24, "url_2025": inst1},
            # Extended to 31.12.2026 by order (ק"ת 11633), then to 10.2.2027 inclusive by s.38 of Basic Law: The Knesset
            # after the Knesset dissolved (Tax Authority notice of 12.10.2026). Also every purchase by a non-resident.
            "additional": {"from": "2024-01-16", "to": "2027-02-10", "section": "סעיף 9(ג1ו)",
                           "brackets": [[6055070, 8], [None, 10]],
                           "source_he": "הודעת רשות המסים מ-12.10.2026: הוראת השעה מוארכת עד 10.2.2027 (כולל) לפי סעיף 38 לחוק יסוד: הכנסת; הוראות ביצוע 1/2025 ו-1/2026, סעיף 2(ב)",
                           "url": notice, "url_instruction": inst26},
            "oleh": {"from": "2024-08-15", "to": "2028-01-15", "section": "תקנה 12א",
                     "brackets": [[1978745, 0], [6055070, 0.5], [20183565, 8]], "max_value": 20183565,
                     "years_before": 1, "years_after": 7, "times": 1,
                     "source_he": "תקנות מס רכישה, תקנה 12א (מ-15.8.2024), בהפניה לסכומי סעיף 9(ג1ג)(3); הוראת ביצוע 1/2026, סעיף 2(ג)", "url": regs},
            "disabled": {"from": "2024-01-16", "to": "2028-01-15", "section": "תקנה 11(א)",
                         "brackets": [[1978745, 0], [2500000, 0.5]], "cap": 2500000, "flat_above_cap": 0.5, "times": 2,
                         # Reg. 11(א) opening words: 0.5% on the whole value, and the brackets only when one of
                         # s.9(ג1ג)(2)(א)-(ג) holds (a sole home, or a replacement home).
                         "flat_not_sole": 0.5,
                         "sole_he": "המדרגות 0% ו-0.5% חלות רק כשהדירה יחידה או חלופית (סעיף 9(ג1ג)(2)); אחרת 0.5% על כל השווי (תקנה 11(א))",
                         "source_he": "תקנות מס רכישה, תקנה 11(א)(1)-(2)", "url": regs},
        },
        "replacement": {
            "section": "סעיף 9(ג1ג)(2)(ב)",
            # Months to sell the previous only home, by the day the new one was bought (instruction 2/2026, note 2).
            "windows": [{"from": "2023-06-01", "to": "2025-05-31", "months": 18}, {"from": "2025-06-01", "to": None, "months": 24}],
            "contractor_months": 12,
            # A contractor purchase may use the later of 12 months from delivery and the ordinary window from the
            # purchase day (Tax Authority instruction 2/2016, s.2.1: "לפי המאוחר").
            "contractor_later_he": "ברכישה מקבלן: 12 חודשים מהמסירה, או התקופה הרגילה מיום הרכישה, לפי המאוחר (הוראת ביצוע 2/2016, סעיף 2.1)",
            "contractor_later_url": "https://www.gov.il/BlobFolder/policy/real-estate-tax-inst-02-2016/he/Policy_realEstateTaxationInst_hor02-2016.pdf",
            "war": {"from": "2026-02-28", "to": "2026-05-31", "add_months": 3, "floor": "2026-08-31",
                    "law_he": "חוק הארכת תקופות ודחיית מועדים (הוראת שעה - חרבות ברזל) (תיקון), התשפ\"ו-2026, סעיף 3א (ספר החוקים 3507, 26.3.2026)",
                    "source_he": "רשות המסים, הוראת ביצוע מיסוי מקרקעין 2/2026, 30.3.2026", "url": inst2},
        },
        "share_ignored_he": "דירה נוספת שחלקכם בה אינו עולה על שליש, ובדירה שקיבלתם בירושה אינו עולה על מחצית, לא נספרת (סעיף 9(ג1ג)(4)(א) וסעיף 49ג(3))",
        "share_ignored_max": [1, 3], "share_ignored_inherited_max": [1, 2],
        "couple_he": "בני זוג וילדיהם מתחת לגיל 18 הם רוכש אחד (סעיף 9(ג1ג)(4)(ג))",
        "resident_he": "המדרגות של דירה יחידה הן ליחיד תושב ישראל, כולל מי שבתוך שנתיים מהרכישה נעשה תושב ישראל לראשונה או תושב חוזר ותיק (סעיף 9(ג1ג)(2) ו-(4)(ב)); מי שאינו תושב משלם כמו על דירה נוספת",
        # Interpretation Law 1981 s.10(ג): rest days that are the last days of a period are not counted.
        "rest_day_he": "מועד שחל בשבת, בחג (סעיף 18א לפקודת סדרי השלטון והמשפט) או ביום העצמאות עובר ליום שאחריו שאינו יום מנוחה (חוק הפרשנות, סעיף 10(ג)); כולל יום העצמאות, לפי 5 באייר וכללי ההקדמה והדחייה",
        "independence_days": ["2025-05-01", "2026-04-22", "2027-05-12"],
        "independence_source": "בנק ישראל, רשימות החגים 2025-2026 ו-2027 (kamakama.gov.il), נקראו 14.10.2026",
        "declare_days": 30, "declare_section": "סעיף 73(ג)",
        "pay_days": 60, "pay_section": "סעיף 90א", "late_section": "סעיף 94(א)",
        "vat_pct": 18, "vat_from": "2025-01-01", "vat_prior": {"pct": 17, "from": "2015-10-01"},
        "vat_he": "צו מס ערך מוסף (שיעור המס על עסקה ועל יבוא טובין), התשס\"ה-2005, סעיף 1",
        "vat_url": "https://www.nevo.co.il/law_html/law01/999_481.htm",
    }


def build_betterment(checked_on: str) -> dict:
    """Betterment levy (wave 3, HAD-498): the Third Schedule to the Planning and Building Law, read on
    checked_on in the consolidated text: the rate (s.3, 3א), payment at realisation (s.7), the residence
    deferral (s.19(ג)), the exemptions the tool uses (s.19(ב)(9), (10), (10א)), the local reductions of the
    quarter rate (s.19(ב2)(1)) and the appeal routes and periods (s.14)."""
    law = "https://www.nevo.co.il/law_html/law01/044_001.htm"
    return {
        "name_he": "היטל השבחה",
        "publisher_he": "חוק התכנון והבניה, התוספת השלישית",
        "source_name": "חוק התכנון והבניה, התשכ\"ה-1965, התוספת השלישית (נוסח עדכני)",
        "source_url": law,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "law_he": "חוק התכנון והבניה, התשכ\"ה-1965, התוספת השלישית",
        "law_url": law,
        # Rates as [numerator, denominator] of the betterment.
        "rates": {
            "regular": {"rate": [1, 2], "section": "סעיף 3"},
            "pinui": {"rate": [1, 4], "section": "סעיף 3א(א)", "local_section": "סעיף 3א(ב)",
                      "local_rates": {"half": [1, 2], "quarter": [1, 4], "none": [0, 1]},
                      "local_he": "הרשות המקומית רשאית לקבוע באזור מסוים מחצית, רבע או פטור (סעיף 3א(ב))"},
            # s.19(ב)(10א)(ב)-(ג): on an "other lot", or under a plan conditioned on strengthening, the quarter
            # applies only to the qualifying part; the rest pays half.
            "seismic": {"rate": [1, 4], "section": "סעיף 19(ב)(10א)(א)", "rest_rate": [1, 2], "rest_section": "סעיף 19(ב)(10א)(ב)-(ג)",
                        "local_he": "הרשות המקומית רשאית לקבוע, להיתרים בתחומה, שלא ישולם היטל או שישולם שמינית "
                                    "ההשבחה במקום רבע (סעיף 19(ב2)(1)). בדקו בוועדה המקומית אם התקבלה החלטה כזאת"},
            "tama38": {"rate": [0, 1], "section": "סעיף 19(ב)(10)(א)", "beyond_rate": [1, 4], "beyond_floors": 2.5,
                       "local_he": "על החלק שמעבר ל-2.5 קומות, הרשות המקומית רשאית לקבוע, להיתרים בתחומה, שלא ישולם "
                                   "היטל או שישולם שמינית ההשבחה במקום רבע (סעיף 19(ב2)(1)). בדקו בוועדה המקומית אם "
                                   "התקבלה החלטה כזאת"},
            # s.19(ב)(9)(א): only a protected space within the area set under the Civil Defence Law is exempt;
            # betterment from any other area, even in the same permit, pays the regular half (s.3).
            "mamad": {"rate": [0, 1], "section": "סעיף 19(ב)(9)", "beyond_rate": [1, 2], "beyond_section": "סעיף 3",
                      "area_he": "הפטור חל על ממ\"ד בשטח שנקבע לפי חוק ההתגוננות האזרחית, ומאז תיקון 163 (2025) גם על "
                                 "השטח הנוסף לממ\"ד לפי סעיף 151(ג)(2), בתנאים שבסעיף 19(ב)(9)(ג). השבחה משטח אחר, גם באותו "
                                 "היתר, חייבת בהיטל הרגיל של מחצית (סעיף 3)"},
        },
        # s.19(ב2)(1): for the quarter in TAMA 38 (beyond 2.5 floors) and seismic plans, the local authority may set
        # no levy or an eighth for permits in its area.
        "local_q_rates": {"eighth": [1, 8], "none": [0, 1]}, "local_q_section": "סעיף 19(ב2)(1)",
        "residence_max_sqm": 140, "residence_section": "סעיף 19(ג)(1)",
        "residence_sale_years": 4, "residence_sale_section": "סעיף 19(ג)(2)",
        "storage_max_sqm": 20, "storage_section": "סעיף 19(ג1)",
        "pay_section": "סעיף 7(א)", "partial_section": "סעיף 7(ב)", "partners_section": "סעיף 11(א)",
        "linkage_section": "סעיף 9", "interest_section": "סעיף 15",
        "appeal_days": 45, "appeal_section": "סעיף 14(א)", "schedule_appeal_years": 1,
        "independence_days": ["2025-05-01", "2026-04-22", "2027-05-12"],
        "independence_source": "בנק ישראל, רשימות החגים 2025-2026 ו-2027 (kamakama.gov.il), נקראו 14.10.2026",
        "appraiser_section": "סעיף 14(ב)(1)", "appraiser_appeal_days": 45, "appraiser_appeal_section": "סעיף 14(ב)(4)",
        "recheck_max": 90000, "recheck_section": "סעיף 14(ב1)", "recheck_decide_days": 14, "recheck_reply_days": 21,
        "recheck_chief_days": 21, "recheck_fallback_days": 30,
        "demand_days": 90, "demand_section": "סעיף 4(4)(א)",
    }



def build_will_cost(checked_on: str) -> dict:
    """What a will costs, from signing to the probate order (wave 4, HAD-502). The forms and the path are the
    Succession Law (ss.8א, 18-24, 35, 39, 66-67א, current text read on checked_on); the registrar's fees are the
    1998 fee regulations as updated on 1.1.2026 (Kovetz HaTakanot 12149, 25.12.2025); the notary's fees are the
    notary fee regulations as updated on 1.1.2026 (Kovetz HaTakanot 12158, 29.12.2025), plus VAT (reg. 1) at the
    rate of the 2005 VAT order (18% from 1.1.2025). The reduced online fee and the publication expenses of a probate
    request are the amounts charged by the government payments service (REGISTRAR_PAYMENTS)."""
    law = "https://www.nevo.co.il/law_html/law00/72178.htm"
    fees = "https://www.nevo.co.il/law_html/law00/72181.htm"
    notary = "https://www.nevo.co.il/law_html/law00/90738.htm"
    regs = "https://www.nevo.co.il/law_html/law00/98588.htm"
    return {
        "name_he": "עלות צוואה, מהחתימה ועד צו הקיום",
        "publisher_he": "חוק הירושה, תקנות האגרות של הרשם ותעריף הנוטריונים",
        "source_name": "תקנות הירושה (אגרות הרשם לעניני ירושה), התשנ\"ח-1998, ותקנות הנוטריונים (שכר שירותים), התשל\"ט-1978, בנוסח מ-1.1.2026",
        "source_url": fees,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "law_he": "חוק הירושה, התשכ\"ה-1965",
        "law_url": law,
        "sections": {
            "forms": "סעיף 18", "handwritten": "סעיף 19", "witnesses": "סעיף 20", "deposit": "סעיף 21",
            "authority": "סעיף 22", "notary": "סעיף 22(ז)", "mutual": "סעיף 8א", "witness_capacity": "סעיף 24",
            "beneficiary_witness": "סעיף 35", "probate_needed": "סעיף 39", "orders": "סעיף 66", "objection": "סעיף 67",
            "to_court": "סעיף 67א",
        },
        "registrar": {
            "regulation_he": "תקנות הירושה (אגרות הרשם לעניני ירושה), התשנ\"ח-1998",
            "url": fees, "from": "2026-01-01", "gazette_he": "קובץ התקנות 12149, 25.12.2025",
            "order": 597, "item_order": "התוספת, פרט 1",
            "amend": 597, "item_amend": "התוספת, פרט 2",
            "will_before_registrar": 280, "item_will": "התוספת, פרט 4",
            "deposit": 126, "item_deposit": "התוספת, פרט 5",
            "deposit_free_years": 5, "item_deposit_free": "התוספת, פרט 5א",
            "online_pct": 85, "online_section": "תקנה 1(א)", "online_rule_section": "תקנה 14(ד) לתקנות הירושה",
            "indexed_he": "מתעדכנות ב-1 בינואר לפי מדד נובמבר (תקנה 2)",
            "payments": dict(REGISTRAR_PAYMENTS),
        },
        "notary": {
            "regulation_he": "תקנות הנוטריונים (שכר שירותים), התשל\"ט-1978",
            "url": notary, "from": "2026-01-01", "gazette_he": "קובץ התקנות 12158, 29.12.2025",
            "will_first": 293, "will_additional": 147, "will_extra_certificate": 88, "item_will": "פרט 4",
            "item_will_translate": "פרט 4(ד) ופרט 3(א)",
            "translate_first100": 251, "translate_per100_to1000": 197, "translate_per100_above": 99,
            "outside_first_hour": 645, "outside_half_hour": 197, "item_outside": "פרט 9(א)",
            "night_pct": 50, "item_night": "פרט 10",
            "foreign_language": 104, "item_foreign": "פרט 12",
            "signature_first": 197, "signature_additional": 77, "copy_first_page": 77, "copy_more_pages": 13,
            "life_certificate": 197, "affidavit_first": 200, "affidavit_additional": 80,
            "law_he": "חוק הנוטריונים, התשל\"ו-1976, סעיף 34(5)",
            "law_url": "https://www.nevo.co.il/law_html/law00/72998.htm",
            "indexed_he": "מתעדכן ב-1 בינואר לפי מדד נובמבר (תקנה 4)",
        },
        "vat": {"pct": 18, "from": "2025-01-01", "he": "צו מס ערך מוסף (שיעור המס על עסקה ועל יבוא טובין), התשס\"ה-2005, סעיף 1",
                "url": "https://www.nevo.co.il/law_html/law01/999_481.htm"},
        # The Israel Bar's recommended minimum tariff (2000 rules, current to 5.1.2026): a non-binding recommendation
        # (rule 2), before VAT (rule 1), indexed each 1 January (rule 3). Shown as a reference, never as a price.
        "bar": {
            "rules_he": "כללי לשכת עורכי הדין (התעריף המינימלי המומלץ), התש\"ס-2000", "url": "https://www.nevo.co.il/law_html/law00/4425.htm",
            "current_to": "2026-01-05", "will": 2161, "mutual": 3159, "deposit_other": 1068,
            "probate_pct": 1.5, "probate_min": 4281, "objection_add_pct": 25,
            "items": {"will": "התוספת, פרט 11(3)(א)", "mutual": "פרט 11(3)(ב)", "deposit_other": "פרט 11(3)(ג)", "probate": "פרט 4.א(4)"},
            "note_he": "המלצה לחברי הלשכה שאינה מחייבת (כלל 2); מע\"מ נוסף על הסכום (כלל 1); מתעדכן ב-1 בינואר (כלל 3)",
        },
        "regulations_he": "תקנות הירושה, התשנ\"ח-1998",
        "regulations_url": regs,
        "objection_days": 14, "objection_section": "תקנה 17(א)", "publication_section": "תקנה 17(ג)",
        "deposit_section": "תקנה 6",
        "notary_fixed_he": "שכר הנוטריון קבוע בתקנות: נוטריון שגובה יותר, או פחות בלי טעם מספיק, עובר עבירת משמעת "
                           "(סעיף 34(5) לחוק הנוטריונים). על השכר נוסף מע\"מ (תקנה 1)",
        "witness_he": "שני עדים בגירים וכשירים (סעיף 24). הוראה שמזכה עד, את מי שערך את הצוואה או את בן הזוג שלהם, "
                      "בטלה (סעיף 35)",
        "handwritten_he": "כל הצוואה בכתב ידכם, עם תאריך בכתב ידכם וחתימה (סעיף 19). מודפסת או בכתב יד של אחר: זו "
                          "לא צוואה בכתב יד",
        "deposit_in_person_he": "את הצוואה מפקידים בעצמכם, במשרד הרשם לענייני ירושה, עם המקור ותעודה מזהה (סעיף 21(א), "
                                "תקנה 6). צוואה בפני רשות שנחתמה בחתימה אלקטרונית מאושרת אפשר להפקיד גם באתר האפוטרופוס "
                                "הכללי (תקנה 6א). אפשר לקבל את הצוואה בחזרה בכל עת (סעיף 21(ג))",
        "publication_he": "הודעה על הבקשה מתפרסמת באתר האפוטרופוס הכללי וברשומות, והוצאות הפרסום על המבקש (תקנה 17): "
                          f"{REGISTRAR_PAYMENTS['publication']} ₪ לכל בקשה, לפי שירות התשלומים הממשלתי",
        "court_he": "הוגשה התנגדות: הבקשה עוברת לבית המשפט לענייני משפחה (סעיף 67א), והאגרות שם לא מחושבות כאן",
    }


def build_car_accident(checked_on: str) -> dict:
    """Road-accident compensation (wave 4, HAD-502): the Road Accident Victims Compensation Law, 1975 (current to
    14.8.2025), the 1976 non-pecuniary regulations (current to 18.9.2023), the 1977 Bar rules on the maximum fee, the
    Limitation Law (current to 21.7.2026) and the National Insurance average wage from 1.1.2026, all read on checked_on.
    The statutory maximum for pain and suffering has no official publisher of its current amount: the tool works in
    shares of it and never states it in shekels on its own. The CBS average wage was not readable (bot wall), so the
    earnings ceiling is stated as at least three times the National Insurance figure."""
    law = "https://www.nevo.co.il/law_html/law00/4554.htm"
    regs = "https://www.nevo.co.il/law_html/law00/4555.htm"
    rules = "https://www.nevo.co.il/law_html/law00/4407.htm"
    lim = "https://www.nevo.co.il/law_html/law00/71809.htm"
    return {
        "name_he": "פיצויים לנפגעי תאונות דרכים",
        "publisher_he": "חוק הפיצויים לנפגעי תאונות דרכים ותקנותיו",
        "source_name": "חוק פיצויים לנפגעי תאונות דרכים, התשל\"ה-1975 (נוסח עדכני)",
        "source_url": law,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "law_he": "חוק פיצויים לנפגעי תאונות דרכים, התשל\"ה-1975",
        "law_url": law, "law_from": "1976-09-25", "law_current_to": "2025-08-14",
        "sections": {"liability": "סעיף 2(ג)", "exclusions": "סעיף 7", "heads": "סעיף 4(א)", "interim": "סעיף 5(ב)",
                     "expert": "סעיף 6א", "other_law": "סעיף 6ב", "only_cause": "סעיף 8(א)", "fee": "סעיף 16(א)", "karnit": "סעיף 12"},
        "exclusions_he": "לפי סעיף 7 אין זכאות למי שגרם לתאונה במתכוון, למי שנהג ברכב בלי רשות (או נסע בו בידיעה), "
                         "למי שנהג בלי רישיון נהיגה (חוץ מרישיון שפקע בגלל אגרה שלא שולמה או הגבלה של ההוצאה לפועל), "
                         "למי שהשתמש ברכב לעבירה מסוג פשע, למי שנהג בלי ביטוח, ולבעל רכב שהרשה לנהוג בו בלי ביטוח",
        "regs_he": "תקנות הפיצויים לנפגעי תאונות דרכים (חישוב פיצויים בשל נזק שאינו נזק ממון), התשל\"ו-1976",
        "regs_url": regs, "regs_current_to": "2023-09-18",
        "nonpecuniary": {
            "max_lira": 100000, "max_section": "סעיף 4(א)(3)", "linkage_section": "סעיף 4(ב)",
            "hospital_permille": 2, "disability_pct_per_pct": 1, "age_from": 30, "age_pct_per_year": 1,
            "no_permanent_max_pct": 10, "death_pct": 25,
            "sections": {"hospital": "תקנה 2(א)(1)", "disability": "תקנה 2(א)(2)", "other": "תקנה 2(ב)", "age": "תקנה 3", "death": "תקנה 4"},
            "max_he": "הסכום המקסימלי הוא 100,000 לירות, צמוד למדד המחירים לצרכן מיום תחילת החוק או מיום הגדלתו (סעיפים "
                      "4(א)(3) ו-4(ב)). אין מפרסם רשמי לסכום המעודכן בשקלים, ולכן הכלי מחשב באחוזים ממנו, ובשקלים רק "
                      "כשאתם מזינים את הסכום שקיבלתם מבית המשפט או מחברת הביטוח",
        },
        "earnings": {
            "ceiling_multiple": 3, "section": "סעיף 4(א)(1)", "tax_cap_pct": 25, "tax_section": "סעיף 4(א)(2)",
            "nii": [{"from": "2026-01-01", "s1": 13566, "s2": 13769,
                     "url": "https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%9E%D7%95%D7%A6%D7%A2.aspx",
                     "source_he": "המוסד לביטוח לאומי, שכר ממוצע לפי סעיפים 1 ו-2 לחוק הביטוח הלאומי, מ-1.1.2026"}],
            "cbs_he": "נתון הלמ\"ס לא נבדק (האתר חוסם קריאה אוטומטית), ולכן התקרה מוצגת כ\"לפחות\"",
        },
        "fees": {
            "rules_he": "כללי לשכת עורכי הדין (תעריף מקסימלי לשכר טרחה בטיפול בתביעות לפי חוק פיצויים לנפגעי תאונות דרכים), התשל\"ז-1977",
            "rules_url": rules,
            "stages": {"none": {"pct": 8, "section": "סעיף 16(א); כלל 4", "he": "בלי תביעה בבית המשפט"},
                       "settle": {"pct": 11, "section": "כלל 3", "he": "פשרה אחרי שהוגשה תביעה"},
                       "judgment": {"pct": 13, "section": "סעיף 16(א); כלל 2", "he": "פסק דין"}},
            "vat_section": "כלל 5", "vat_pct": 18,
            "vat_he": "צו מס ערך מוסף (שיעור המס על עסקה ועל יבוא טובין), התשס\"ה-2005, סעיף 1",
            "vat_url": "https://www.nevo.co.il/law_html/law01/999_481.htm",
            "refund_he": "מי ששילם יותר מהתעריף המקסימלי זכאי להחזר העודף (סעיף 16(א))",
        },
        "limitation": {
            "he": "חוק ההתיישנות, התשי\"ח-1958", "url": lim, "years": 7, "section": "סעיף 5(1)", "adult_age": 18,
            "minor_section": "סעיף 10", "war": {"from": "2023-10-07", "to": "2024-04-06", "section": "סעיף 15א(א)"},
            "interpretation_he": "חוק הפרשנות, התשמ\"א-1981, סעיף 10(ג)",
        },
        "independence_days": ["2025-05-01", "2026-04-22", "2027-05-12"],
        "interim_days": 60,
        "interim_he": "המבטח משלם, כחלק מהפיצויים, הוצאות ריפוי ותשלומים חודשיים למחיה, תוך 60 ימים מקבלת דרישה בכתב (סעיף 5(ב))",
        "expert_he": "את הנכות הרפואית קובע מומחה שבית המשפט ממנה; הצדדים לא מביאים מומחה משלהם בלי רשות (סעיף 6א)",
        "nii_he": "תאונה בדרך לעבודה או בעבודה היא גם תאונת עבודה: גמלאות הביטוח הלאומי מנוכות מהפיצויים "
                  "(סעיף 328א לחוק הביטוח הלאומי)",
        "nii_law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, סעיף 328א",
        "nii_law_url": "https://www.btl.gov.il/Laws1/00_0001_000000.pdf",
        "karnit_he": "נהג לא ידוע, בלי ביטוח או מבטח בפירוק: התביעה נגד קרנית (סעיף 12)",
    }

def build_divorce_cost(checked_on: str) -> dict:
    """What a divorce costs (wave 4, HAD-502), for a Jewish couple whose get is given in the rabbinical court: the
    Dayanim (Fees) Regulations 1957 (current to 22.1.2026), the Family Court (Fees) Regulations 1995 (current to
    1.7.2026), the Family Disputes Settlement Law 2014 and its 2016 regulations, the Spouses Property Relations Law
    1973, and the Israel Bar's recommended minimum tariff (2000 rules, current to 5.1.2026; non-binding, before
    VAT), all read on checked_on. No duration of a contested case is stated: the law sets none."""
    rab = "https://www.nevo.co.il/law_html/law00/70297.htm"
    fam = "https://www.nevo.co.il/law_html/law00/71537.htm"
    disp = "https://www.nevo.co.il/law_html/law01/501_151.htm"
    prop = "https://www.nevo.co.il/law_html/law00/72138.htm"
    bar = "https://www.nevo.co.il/law_html/law00/4425.htm"
    return {
        "name_he": "עלות גירושין ולוח הזמנים שבחוק",
        "publisher_he": "תקנות האגרות של בתי הדין הרבניים ושל בית המשפט לענייני משפחה",
        "source_name": "תקנות הדיינים (אגרות), התשי\"ז-1957, ותקנות בית המשפט לעניני משפחה (אגרות), התשנ\"ו-1995 (נוסח עדכני)",
        "source_url": rab,
        "checked_on": checked_on,
        "refresh_every_days": 183,
        "next_update": "2027-01-01",
        "scope_he": "הכלי מחשב גירושין של בני זוג יהודים, שהגט שלהם ניתן בבית הדין הרבני. לבני זוג מוסלמים, נוצרים או "
                    "דרוזים יש בית דין דתי אחר ואגרות אחרות, והכלי לא מחשב אותם",
        "rabbinical": {
            "regulation_he": "תקנות הדיינים (אגרות), התשי\"ז-1957", "url": rab, "current_to": "2026-01-22",
            "divorce": 457, "property": 596, "custody": 417, "support": 279, "agreement": 536,
            "get_request": 326, "get_request_abroad": 457, "certificate": 326, "request": 119,
            "transcript_divorce": 118, "transcript_other": 88, "appeal": 775,
            "items": {
                "divorce": "התוספת הראשונה, פרט 4(1)(א)", "property": "פרט 4(1)(ב)", "custody": "פרט 7",
                "support_exempt": "פרט 3(א) ותקנה 14א", "agreement": "פרט 4(2)", "get_request": "פרט 4(3)(א)",
                "get_request_abroad": "פרט 4(3)(ב)", "get_free": "פרט 4(3)(ג)", "get_special": "פרט 4(3)(ח)",
                "certificate": "פרט 4(4)(א)", "request": "פרט 19(טז)",
                "transcript_divorce": "התוספת השנייה, פרט 1", "transcript_other": "התוספת השנייה, פרט 2", "appeal": "פרט 15(א)",
            },
            "indexed_he": "מתעדכנות ב-1 בינואר לפי מדד נובמבר (תקנה 3ב)",
        },
        "family": {
            "regulation_he": "תקנות בית המשפט לעניני משפחה (אגרות), התשנ\"ו-1995", "url": fam, "current_to": "2026-07-01",
            "property": 601, "support": 283, "custody": 421, "agreement": 541, "request": 120, "transcript": 86,
            "items": {"property": "התוספת הראשונה, פרט 2א", "support": "פרט 5", "custody": "פרט 6ב", "agreement": "פרט 6א",
                      "request": "פרט 13", "transcript": "התוספת השנייה"},
            "indexed_he": "מתעדכנות פעמיים בשנה, ב-1 בינואר וב-1 ביולי (תקנה 4(א))",
        },
        "disputes": {
            "law_he": "חוק להסדר התדיינויות בסכסוכי משפחה, התשע\"ה-2014", "url": disp,
            "regs_url": "https://www.nevo.co.il/law_html/law01/501_431.htm",
            "meetings_max": 4, "meetings_days": 45, "extend_days": 15, "stay_days": 60, "stay_days_extended": 75, "claim_days": 15,
            "sections": {"first": "סעיף 3(א)", "meetings": "סעיף 3(ב)(1)", "meetings_days": "סעיף 3(ב)(3)", "stay": "סעיף 3(ה)",
                         "claims": "סעיף 4", "exceptions": "סעיף 2, ההגדרות \"תובענה\" ו\"תובענה בעניין של סכסוך משפחתי\""},
            "free_he": "פגישות המהו\"ת אינן כרוכות בתשלום (תקנות 2016, טופס 2)",
            "permanent_he": "החוק קבוע מאז תיקון מס' 3 (8.12.2020): סעיף התפוגה בוטל",
        },
        "property_law": {
            "law_he": "חוק יחסי ממון בין בני זוג, התשל\"ג-1973", "url": prop, "from": "1974-01-01",
            "sections": {"balance": "סעיף 5(א)", "pension": "סעיף 5(ג)", "early": "סעיף 5א", "debts": "סעיף 6(א)",
                         "half": "סעיף 6(ב)", "deviate": "סעיף 8", "pre1974": "סעיף 14", "agreement": "סעיף 2"},
            "excluded_he": "נכסים שהיו לכם ערב הנישואין, מתנה או ירושה בתקופת הנישואין, גמלת ביטוח לאומי ופיצוי על נזק גוף "
                           "או מוות לפי דין, ונכסים שהסכמתם בכתב לא לאזן (סעיף 5(א))",
        },
        "bar": {
            "rules_he": "כללי לשכת עורכי הדין (התעריף המינימלי המומלץ), התש\"ס-2000", "url": bar, "current_to": "2026-01-05",
            "get_consent": 1287, "get_contested": 3173, "custody_agreed": 1287, "custody_opposed": 3008, "agreement_min": 2480,
            "extra_hearing": 498,
            "items": {"get_consent": "התוספת, פרט 8(5)", "get_contested": "פרט 8(6)", "custody_agreed": "פרט 8(7)",
                      "custody_opposed": "פרט 8(8)", "agreement": "פרט 8(9)", "property": "פרטים 1 ו-3", "extra_hearing": "פרט 8(15)"},
            "note_he": "המלצה לחברי הלשכה שאינה מחייבת (כלל 2); מע\"מ נוסף על הסכום (כלל 1); מתעדכן ב-1 בינואר (כלל 3). "
                       "לכל צד ועורך הדין שלו",
        },
        "vat": {"pct": 18, "from": "2025-01-01", "he": "צו מס ערך מוסף (שיעור המס על עסקה ועל יבוא טובין), התשס\"ה-2005, סעיף 1",
                "url": "https://www.nevo.co.il/law_html/law01/999_481.htm"},
        "refund_he": "הסתיים ההליך בהסכמה מוקדם: בבית הדין הרבני האגרה קטנה ב-50% לפני שמיעת ראיות וב-25% אחריה (תקנה 12), "
                     "ובבית המשפט לענייני משפחה משלמים מחצית בפשרה עד קדם המשפט (תקנה 8(ב)). על הבקשה ליישוב סכסוך אין החזר",
        "meetings_he": "עד 4 פגישות מידע, היכרות ותיאום ביחידת הסיוע, בלי תשלום, בתוך 45 ימים מהבקשה (פעם אחת אפשר להאריך "
                       "ב-15). עד 60 ימים, או 75, אי אפשר להגיש תביעה (סעיף 3)",
        "support_he": "בבית הדין הרבני מי שמגיש תביעת מזונות פטור מאגרה; אם בית הדין מחייב את הצד השני בהוצאות, הוא משלם "
                      "את האגרה (תקנה 14א). בבית המשפט לענייני משפחה האגרה 283 ₪",
        "get_request_he": "אם מגישים בקשה נפרדת לסידור גט, היא עולה 326 ₪, ו-457 ₪ כשאחד מבני הזוג בחוץ לארץ (פרט 4(3)(א)-(ב))",
        "abroad_he": "כשמקום המושב של אחד מבני הזוג אינו בישראל, החוק להסדר התדיינויות לא חל (סעיף 4א(1)): אין בקשה "
                     "ליישוב סכסוך, אין פגישות מהו\"ת ואין עיכוב הליכים",
        "pause_he": "בספירת 45, 60 ו-75 הימים לא נספרים ראש השנה, יום הכיפורים, י\"ד עד כ\"ב בתשרי ו-י\"ד עד כ\"א בניסן "
                    "(סעיף 6א(א)(1)); ב-15 הימים להגשת התביעה הם נספרים, אלא אם היום האחרון חל בהם (סעיף 6א(ג))",
        "pre1974_he": "נישאתם לפני 1.1.1974: הסדר איזון המשאבים לא חל עליכם (סעיף 14 לחוק יחסי ממון), והחלוקה נקבעת לפי "
                      "הדין שקדם לו. החישוב כאן לא מתאים למקרה שלכם",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--checked-on", required=True)
    parser.add_argument("--cpi-json")
    parser.add_argument("--rates-dir", help="folder with ga-hist-<id>.xlsx files saved from ga.mof.gov.il")
    parser.add_argument("--minwage-html")
    parser.add_argument("--out", required=True)
    parser.add_argument("--base", help="existing registry: keep its CPI, interest, minimum-wage, havraa and small-claims "
                                         "datasets and its checked_on, and rebuild only the wave-3 datasets (HAD-498)")
    parser.add_argument("--wave3-checked-on", help="the day the wave-3 sources were read (default: --checked-on)")
    parser.add_argument("--wave4-checked-on", help="the day the wave-4 sources were read (HAD-502); when given, the will-cost, "
                                                   "road-accident and divorce-cost datasets are built too")
    args = parser.parse_args()
    wave3_day = args.wave3_checked_on or args.checked_on
    wave4_day = args.wave4_checked_on
    if args.base:
        base = json.loads(Path(args.base).read_text(encoding="utf-8"))
        registry = {key: base[key] for key in ("schema", "registry_version", "checked_on", "note_he", "cpi", "interest",
                                               "min_wage", "havraa", "small_claims")}
        registry["registry_version"] = wave3_day
        registry["yerusha"] = build_yerusha(wave3_day)
        registry["purchase_tax"] = build_purchase_tax(wave3_day)
        registry["betterment"] = build_betterment(wave3_day)
        # Keep the wave-4 datasets of the base when they are not rebuilt (review, PR 126): a refresh of another wave never
        # drops a live tool's data.
        kept = [key for key in WAVE4_KEYS if key in base]
        for key in kept:
            registry[key] = base[key]
        if kept and not wave4_day:
            registry["registry_version"] = max(registry["registry_version"], base["registry_version"])
        add_wave4(registry, wave4_day)
        write_registry(registry, args.out)
        return 0

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
        "yerusha": build_yerusha(wave3_day),
        "purchase_tax": build_purchase_tax(wave3_day),
        "betterment": build_betterment(wave3_day),
    }
    # A full rebuild reads every source again, so it always builds the wave-4 datasets: a registry without them would
    # leave three live tools without data (review, PR 126).
    add_wave4(registry, wave4_day or args.checked_on)
    write_registry(registry, args.out)
    return 0


WAVE4_KEYS = ("will_cost", "car_accident", "divorce_cost")


def add_wave4(registry: dict, day: str | None) -> None:
    """Wave 4 (HAD-502): the will-cost, road-accident and divorce-cost datasets, each with its own checked_on."""
    if not day:
        return
    registry["registry_version"] = day
    registry["will_cost"] = build_will_cost(day)
    registry["car_accident"] = build_car_accident(day)
    registry["divorce_cost"] = build_divorce_cost(day)


def write_registry(registry: dict, out: str) -> None:
    text = json.dumps(registry, ensure_ascii=False, indent=1)
    # One CPI month per line ("YYYY-MM", value) and one rate row per line keep reviews readable.
    text = re.sub(r'\[\n\s*("\d{4}-\d{2}"),\n\s*([\d.]+)\n\s*\]', r'[\1, \2]', text)
    text = re.sub(r'\{\n\s*("from": "[\d-]+"),\n\s*("rate": [\d.]+)\n\s*\}', r'{\1, \2}', text)
    # One havraa seniority band per line: [first work year, last work year, days].
    text = re.sub(r'\[\n\s*(\d+),\n\s*(\d+|null),\n\s*(\d+)\n\s*\]', r'[\1, \2, \3]', text)
    # LF on every platform: CI rejects CRLF (git diff --check), and Windows would otherwise write CRLF.
    # Wave 3: one purchase-tax bracket per line ([upper limit or null, rate %]) and one fraction per line.
    text = re.sub(r'\[\n\s*(\d+|null),\n\s*([\d.]+)\n\s*\]', r'[\1, \2]', text)
    with open(out, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(text + "\n")
    print(f"wrote {out}: CPI to {registry['cpi']['latest_month']}, "
          f"{len(registry['interest']['linked'])} interest quarters, {len(registry['min_wage']['rows'])} minimum-wage rows, "
          f"wave 3 checked {registry['purchase_tax']['checked_on']}")


if __name__ == "__main__":
    sys.exit(main())
