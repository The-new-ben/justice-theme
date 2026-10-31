"""The criminal process step by step, and the suspect's rights (31.10.2026, HAD-651), on /criminal-defense-attorney/:
"ההליך הפלילי שלב אחרי שלב" (halich-plili) and "הזכויות שלכם בחקירה ובמעצר" (zchuyot-chashud).
Discovered by tools/justice_tools_fl.py (glob).

The criminal hub plan (HAD-650, tools ג3 and ג4). Every fact in justice_tools_fl_plili_halich.json beside this file was
read on 31.10.2026 in the consolidated statute text (Wikisource): the Criminal Procedure Law, the Arrests Law, the
Interrogation of Suspects Law, the Criminal Procedure (Testimony) Ordinance, the Crime Victims' Rights Law, the Criminal
Information and Rehabilitation Law 2019 (which replaced the Criminal Register Law of 1981 on 12.7.2022) and the Basic Law:
the President. A fact that could not be confirmed in the law text is left out. Quotes are marked as quotes; the rest is
plain wording of the section, marked so.
"""
from __future__ import annotations

import json
from pathlib import Path

KEY = "fl_plili_halich"
DATA = Path(__file__).resolve().parent / "justice_tools_fl_plili_halich.json"

MODES = [
    {"v": "interrogation", "he": "זומנתי לחקירה באזהרה"},
    {"v": "arrest", "he": "נעצרתי"},
]


def build(checked_on: str) -> dict:
    """The steps with their facts and guides, and the rights by situation."""
    data = json.loads(DATA.read_text(encoding="utf-8"))
    return {
        "name_he": "ההליך הפלילי והזכויות שלכם",
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "reviewed_he": "נבדק על ידי הצוות המשפטי של Justice",
        "steps": data["steps"],
        "rights": data["rights"],
        "modes": MODES,
        "sources": [
            {"name_he": "חוק סדר הדין הפלילי [נוסח משולב], התשמ\"ב-1982", "url": "https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%A1%D7%93%D7%A8_%D7%94%D7%93%D7%99%D7%9F_%D7%94%D7%A4%D7%9C%D7%99%D7%9C%D7%99", "text_he": "סעיפים 60א (שימוע), 67א, 74 (עיון בחומר החקירה), 152, 199 עד 201 (ערעור)."},
            {"name_he": "חוק סדר הדין הפלילי (סמכויות אכיפה - מעצרים), התשנ\"ו-1996", "url": data["urls"]["arrests"], "text_he": "סעיפים 17, 21, 28, 29, 32, 33, 34, 61."},
            {"name_he": "חוק סדר הדין הפלילי (חקירת חשודים), התשס\"ב-2002", "url": data["urls"]["interrogation"], "text_he": "סעיפים 2 ו-7: חקירה בשפת החשוד ותיעוד חזותי."},
            {"name_he": "פקודת הפרוצדורה הפלילית (עדות)", "url": data["urls"]["evidence"], "text_he": "סעיף 2(2): אין חובה להשיב על שאלה שהתשובה עליה מפלילה."},
            {"name_he": "חוק המידע הפלילי ותקנת השבים, התשע\"ט-2019", "url": "https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%9E%D7%99%D7%93%D7%A2_%D7%94%D7%A4%D7%9C%D7%99%D7%9C%D7%99_%D7%95%D7%AA%D7%A7%D7%A0%D7%AA_%D7%94%D7%A9%D7%91%D7%99%D7%9D", "text_he": "סעיפים 19, 21, 22 ו-25: התיישנות, מחיקה וקיצור בידי הנשיא."},
        ],
        "method_he": [
            "כל עובדה נבדקה בנוסח המשולב של החוק ב-31.10.2026, עם הסעיף שלה. עובדה שלא אומתה לא מופיעה.",
            "ציטוט מהחוק מופיע במרכאות; השאר בניסוח חופשי של הסעיף.",
            "חוק המרשם הפלילי משנת 1981 בוטל ב-12.7.2022; ההתיישנות והמחיקה הן לפי חוק המידע הפלילי ותקנת השבים.",
        ],
    }
