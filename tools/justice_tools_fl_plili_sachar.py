"""Criminal defence fees by stage (sachar-orech-din-plili) on /criminal-defense-attorney/: "שכר טרחה של עורך דין פלילי"
(31.10.2026, HAD-651). Discovered by tools/justice_tools_fl.py (glob).

The criminal hub plan (HAD-650, tool ג2): one row per stage of the criminal process. The market range is built from the
fee ranges Israeli law offices and portals publish, read on 31.10.2026 and kept in justice_tools_fl_plili_sachar.json
beside this file: low is the lowest published low, high the highest published high, mid the median of the published
midpoints, and every source is listed with its link. The floor is the Israel Bar's recommended minimum tariff where the
tariff names the service. A stage with fewer than two published ranges shows no range. Illustrations, not a price quote.
"""
from __future__ import annotations

import json
from pathlib import Path

KEY = "fl_plili_sachar"
DATA = Path(__file__).resolve().parent / "justice_tools_fl_plili_sachar.json"

# The stages in the order of the process; the amounts come from the JSON.
STAGES = [
    {"id": "consult", "he": "ייעוץ לפני חקירה", "short_he": "ייעוץ",
     "includes_he": "פגישה לפני החקירה: מה החשד, מה הזכויות, מה אומרים ומה מביאים."},
    {"id": "interrogation", "he": "ליווי לחקירה במשטרה", "short_he": "ליווי לחקירה",
     "includes_he": "הכנה לחקירה והגעה לתחנה. עורך הדין לא נכנס לחדר החקירה, אבל אפשר להתייעץ איתו לפניה."},
    {"id": "arrest", "he": "דיון בהארכת מעצר", "short_he": "הארכת מעצר",
     "includes_he": "ייצוג בדיון אחד על הארכת המעצר לפני כתב אישום או על שחרור בתנאים. ערר על ההחלטה הוא הליך נפרד."},
    {"id": "arrest_full", "he": "מעצר עד תום ההליכים", "short_he": "מעצר עד תום ההליכים",
     "includes_he": "ייצוג בבקשה של התביעה להשאיר במעצר עד סוף המשפט: חלופת מעצר, תסקיר מעצר וערר."},
    {"id": "shimua", "he": "שימוע לפני כתב אישום", "short_he": "שימוע",
     "includes_he": "עיון בחומר החקירה וטיעון לפני התביעה, כדי שלא יוגש כתב אישום או שיוגש על פחות."},
    {"id": "trial_shalom", "he": "משפט בבית משפט השלום", "short_he": "משפט בשלום",
     "includes_he": "ניהול התיק מכתב האישום ועד גזר הדין: הסדר טיעון או הוכחות, וטיעונים לעונש."},
    {"id": "trial_district", "he": "תיק חמור בבית המשפט המחוזי", "short_he": "תיק במחוזי",
     "includes_he": "עבירות חמורות שנדונות במחוזי: ניהול הוכחות, עדים ומומחים, וטיעונים לעונש."},
    {"id": "appeal", "he": "ערעור פלילי", "short_he": "ערעור",
     "includes_he": "ערעור על ההרשעה או על העונש לערכאה שמעל."},
    {"id": "record", "he": "מחיקת רישום פלילי", "short_he": "מחיקת רישום",
     "includes_he": "בקשה למחיקת רישום או לקיצור תקופת ההתיישנות, וליווי עד ההחלטה."},
]

METHOD_HE = [
    "הטווח בכל שורה בנוי מהטווחים שמשרדי עורכי דין ואתרים משפטיים מפרסמים: הנמוך ביותר שפורסם עד הגבוה ביותר שפורסם, ואמצע הטווחים הוא החציון של נקודות האמצע. כל מקור מופיע בשורה עם קישור.",
    "שלב שיש לו פחות משני טווחים מפורסמים מופיע בלי טווח, ולא מוערך.",
    "המינימום הוא התעריף המינימלי המומלץ של לשכת עורכי הדין, לפני מע\"מ, רק כשהתעריף נוקב בשירות. זו המלצה ולא חובה, והמחיר בפועל נקבע בהסכם עם המשרד.",
    "הטווחים להמחשה ואינם הצעת מחיר. הם מתעדכנים כל רבעון.",
]


def build(checked_on: str) -> dict:
    """The fee rows with their ranges, floors and sources, from the JSON beside this file."""
    data = json.loads(DATA.read_text(encoding="utf-8"))
    rows = []
    for stage in STAGES:
        d = data["rows"].get(stage["id"], {})
        rows.append({**stage, "low": d.get("low"), "high": d.get("high"), "mid": d.get("mid"), "high_open": bool(d.get("high_open")), "n": len(d.get("sources", [])),
                     "floor": d.get("floor"), "sources": d.get("sources", []), "checked_on": data["checked_on"]})
    return {
        "name_he": "שכר טרחה של עורך דין פלילי",
        "checked_on": checked_on,
        "refresh_every_days": 92,
        "reviewed_he": "נבדק על ידי הצוות המשפטי של Justice",
        "default_stage": "consult",
        "vat_rate": 0.18,
        "rows": rows,
        "bar": data["bar"],
        "open_he": "ומעלה",
        "public_defender": data["public_defender"],
        "tariff_page": {"path": "/lawyer-fees-tariff/", "he": "תעריף לשכת עורכי הדין"},
        "caption_he": "שכר טרחה של עורך דין פלילי לפי שלב: הטווח שמתפרסם, המינימום בתעריף הלשכה, המקורות ותאריך הבדיקה",
        "vat_he": data["vat_he"],
        "disclaimer_he": "הטווחים להמחשה ואינם הצעת מחיר. בקשו הצעה בכתב לפי שלבים.",
        "sources": data["sources"],
        "method_he": METHOD_HE,
    }
