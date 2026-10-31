"""Criminal offences and their maximum penalties (onshei-averot) on /criminal-defense-attorney/: "עבירות פליליות ועונשן
המרבי" (31.10.2026, HAD-651). Discovered by tools/justice_tools_fl.py (glob).

The criminal hub plan (HAD-650, tool ג5): one row per common offence, its section, the maximum penalty as the statute
states it and the court that hears it by the Courts Law's seven-year rule, with a link to the site's guide for that
offence. Every row in justice_tools_fl_plili_onashim.json beside this file was read on 31.10.2026 in the consolidated
statute text (Wikisource, checked against Nevo), with the exact words. A row that could not be confirmed is left out.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

KEY = "fl_plili_onashim"
DATA = Path(__file__).resolve().parent / "justice_tools_fl_plili_onashim.json"

FAMILIES = [
    {"v": "all", "he": "הכול"},
    {"v": "drugs", "he": "סמים"},
    {"v": "violence", "he": "אלימות ואיומים"},
    {"v": "sex", "he": "עבירות מין"},
    {"v": "white", "he": "מרמה והלבנת הון"},
    {"v": "tax", "he": "מס"},
    {"v": "traffic", "he": "תעבורה"},
    {"v": "cyber", "he": "מחשבים"},
]

# The site's guide for each family: the pyramid's offence pages (HAD-643).
GUIDE = {
    "drugs": {"path": "/drug-related-crime/", "he": "עבירות סמים"},
    "violence": {"path": "/assault-charges-lawyer/", "he": "עבירת תקיפה"},
    "sex": {"path": "/sexual-offenses/", "he": "עבירות מין"},
    "white": {"path": "/white-collar-crime-israel/", "he": "עבירות צווארון לבן"},
    "tax": {"path": "/tax-investigation-guide/", "he": "חקירת מס"},
    "traffic": {"path": "/driving-under-influence/", "he": "נהיגה בשכרות"},
    "cyber": {"path": "/criminal-offenses-lawyer-criminal-sentencing-process-arrest/", "he": "סוגי עבירות פליליות ועונשיהן"},
}

LAW_SHORT = {
    "פקודת הסמים המסוכנים [נוסח חדש], התשל\"ג-1973": "פקודת הסמים המסוכנים",
    "חוק העונשין, התשל\"ז-1977": "חוק העונשין",
    "חוק איסור הלבנת הון, התש\"ס-2000": "חוק איסור הלבנת הון",
    "פקודת מס הכנסה [נוסח חדש]": "פקודת מס הכנסה",
    "פקודת התעבורה [נוסח חדש]": "פקודת התעבורה",
    "חוק המחשבים, התשנ\"ה-1995": "חוק המחשבים",
}

YEARS_HE = {2: "שנתיים", 3: "3 שנים", 4: "4 שנים", 5: "5 שנים", 7: "7 שנים", 10: "10 שנים", 16: "16 שנים", 20: "20 שנים"}

METHOD_HE = [
    "כל שורה נבדקה בנוסח המשולב של החוק, עם הסעיף והמילים המדויקות, ב-31.10.2026. שורה שלא אומתה לא מופיעה.",
    "העונש בטבלה הוא העונש המרבי שבחוק. העונש בפועל נקבע לפי הנסיבות, העבר הפלילי והטיעונים, ולרוב הוא נמוך בהרבה.",
    "בית המשפט נקבע לפי כלל חוק בתי המשפט: עבירה שעונשה עד שבע שנות מאסר נדונה בבית משפט השלום, וחמורה ממנה במחוזי. יש חריגים, למשל עבירות כלכליות מסוימות והחלטות של הפרקליטות.",
]


def _row(r: dict) -> dict:
    years = r.get("max_years")
    agg = r.get("max_years_aggravated")
    if years:
        max_short = f"{YEARS_HE.get(years, f'{years} שנים')} מאסר"
        if agg:
            max_short += f" ({YEARS_HE.get(agg, f'{agg} שנים')} בנסיבות מחמירות)"
        court = "שלום" if years <= 7 else "מחוזי"
    else:
        max_short = "פסילת רישיון לשנתיים לפחות" if r["id"] == "drunk-driving-disqualification" else ""
        court = ""
    return {
        "id": r["id"],
        "family": r["family"],
        "offence_he": r["offence_he"],
        "law_he": LAW_SHORT.get(r["law_he"], r["law_he"]),
        "law_full_he": r["law_he"],
        "section": re.sub(r"\s\((?:[^()]|\([^)]*\))*\)", "", r["section"]).replace(" + ", " ו-"),
        "max_years": years,
        "max_short_he": max_short,
        "max_he": r["max_he"],
        "court_he": court,
        "quote_he": r["quote"],
        "url": r["url"],
        "read_on": "2026-10-31",
    }


def build(checked_on: str) -> dict:
    """The verified rows, the families, the guides and the court rule."""
    data = json.loads(DATA.read_text(encoding="utf-8"))
    rows = [_row(r) for r in data["rows"] if r.get("verified")]
    courts = data["courts"]
    return {
        "name_he": "עבירות פליליות ועונשן המרבי",
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "reviewed_he": "נבדק על ידי הצוות המשפטי של Justice",
        "families": FAMILIES,
        "guide": GUIDE,
        "rows": rows,
        "court_rule_he": "בית משפט השלום דן בעבירות שעונשן עד שבע שנות מאסר; חמורות מזה נדונות בבית המשפט המחוזי. יש חריגים.",
        "court_url": courts["url"],
        "caption_he": "עבירות נפוצות: הסעיף, העונש המרבי שבחוק ובית המשפט, לפי נוסח החוק ב-31.10.2026",
        "sources": [
            {"name_he": "חוק העונשין, התשל\"ז-1977 (נוסח משולב)", "url": "https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%A2%D7%95%D7%A0%D7%A9%D7%99%D7%9F", "text_he": "סעיפים 192, 345, 348, 379, 380, 382, 415."},
            {"name_he": "פקודת הסמים המסוכנים [נוסח חדש], התשל\"ג-1973", "url": "https://he.wikisource.org/wiki/%D7%A4%D7%A7%D7%95%D7%93%D7%AA_%D7%94%D7%A1%D7%9E%D7%99%D7%9D_%D7%94%D7%9E%D7%A1%D7%95%D7%9B%D7%A0%D7%99%D7%9D", "text_he": "סעיפים 7, 13 ו-19א."},
            {"name_he": "חוק בתי המשפט [נוסח משולב], התשמ\"ד-1984", "url": courts["url"], "text_he": "סעיפים 40 ו-51: מה נדון בשלום ומה במחוזי."},
            {"name_he": "חוק איסור הלבנת הון, פקודת מס הכנסה, פקודת התעבורה וחוק המחשבים", "url": "https://he.wikisource.org/wiki/%D7%A4%D7%A7%D7%95%D7%93%D7%AA_%D7%94%D7%AA%D7%A2%D7%91%D7%95%D7%A8%D7%94", "text_he": "סעיף 3(א) לחוק איסור הלבנת הון, סעיף 220 לפקודת מס הכנסה, סעיפים 39א ו-62(3) לפקודת התעבורה, סעיפים 4 ו-5 לחוק המחשבים."},
        ],
        "method_he": METHOD_HE,
    }
