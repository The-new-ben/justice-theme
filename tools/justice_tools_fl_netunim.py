"""Divorce statistics (netunei-gerushin) on /divorce-lawyer/: "נתוני גירושין בישראל" (31.10.2026, HAD-616 b).
Discovered by tools/justice_tools_fl.py (glob), built with --fl-checked-on.

Every number is in justice_tools_fl_netunim.json next to this file, copied from the published tables, each with the table
and its publication date: the Statistical Abstract of Israel 2026, chapter 2 (table 2.20: marriages and divorces by
religion since 1955; table 2.25: divorcing by age and sex, 2024; table 2.21: by locality, 2024; published 12.10.2026 and
20.7.2026), the 2024 Abstract's table 2.31 (by district, 2022: the latest by district), the CBS "divorce, selected data,
by religion, 2000-2024" (15.9.2026: crude rates, rates per 1,000 married, median ages), the rabbinical courts' datasets on
data.gov.il (files opened, couples divorced, rulings by wording) and the Israel Democracy Institute's 2024 biennial report
(sanctions, the outcome of claims, the time to the get). Nothing is estimated: a year a source did not publish is missing,
and 2025 (not yet published by the CBS on 31.10.2026) is not in the CBS series.
"""
from __future__ import annotations

import json
from pathlib import Path

KEY = "fl_netunim"
DATA = Path(__file__).resolve().parent / "justice_tools_fl_netunim.json"

GROUPS = [
    {"id": "all", "he": "כולם", "in_he": "", "among_he": ""},
    {"id": "jews", "he": "יהודים", "in_he": "יהודים", "among_he": "בקרב יהודים"},
    {"id": "muslims", "he": "מוסלמים", "in_he": "מוסלמים", "among_he": "בקרב מוסלמים"},
    {"id": "christians", "he": "נוצרים", "in_he": "נוצרים", "among_he": "בקרב נוצרים"},
    {"id": "druze", "he": "דרוזים", "in_he": "דרוזים", "among_he": "בקרב דרוזים"},
]

METRICS = [
    {"id": "count", "he": "זוגות שהתגרשו", "source": "cbs_220", "kind": "count",
     "note_he": "מספר הזוגות שהתגרשו בשנה, בבתי הדין הדתיים ובבתי המשפט לענייני משפחה"},
    {"id": "rate", "he": "לכל 1,000 תושבים", "source": "cbs_select", "kind": "rate",
     "note_he": "גירושין לכל 1,000 תושבים (שיעור גירושין גולמי)"},
    {"id": "married", "he": "לכל 1,000 נשואים", "source": "cbs_select", "kind": "rate",
     "note_he": "מתגרשים לכל 1,000 נשואים ונשואות בני 15 ומעלה"},
    {"id": "ratio", "he": "מול חתונות", "source": "cbs_220", "kind": "rate",
     "note_he": "גירושין לכל 100 חתונות באותה שנה. זה אינו שיעור הנישואין שמסתיימים בגירושין"},
    {"id": "age_m", "he": "גיל הגבר בגירושין", "source": "cbs_select", "kind": "age",
     "note_he": "הגיל החציוני של גבר שהתגרש באותה שנה"},
    {"id": "age_f", "he": "גיל האישה בגירושין", "source": "cbs_select", "kind": "age",
     "note_he": "הגיל החציוני של אישה שהתגרשה באותה שנה"},
]

METHOD_HE = [
    "כל מספר בכלי מועתק מלוח שפורסם, עם שם הלוח ותאריך הפרסום שלו. שנה שלא פורסמה חסרה, ואינה מוערכת. נתוני הלמ\"ס ל-2025 עוד לא פורסמו ב-31.10.2026.",
    "הלמ\"ס סופרת את כל הגירושין במרשם האוכלוסין: בבתי הדין הדתיים ובבתי המשפט לענייני משפחה. בתי הדין הרבניים סופרים את הגיטין שסודרו אצלם. לכן ב-2024 הלמ\"ס מונה 12,489 זוגות יהודים שהתגרשו, ובתי הדין 11,539: זו הגדרה שונה, לא סתירה.",
    "\"מול חתונות\" הוא מספר הגירושין בשנה חלקי מספר החתונות באותה שנה, כפול 100. זה אינו שיעור הנישואין שמסתיימים בגירושין: מי שמתגרש השנה התחתן לרוב שנים רבות קודם. השיעור \"לכל 1,000 נשואים\" הוא המדד המדויק יותר, והלמ\"ס מפרסמת אותו מ-2000.",
    "הערות הלמ\"ס נשמרות: ב-2006 וב-2008 נוספו לסדרה מקרים שלא נכללו קודם (קפיצה בסדרה), וב-1996 חסרים כ-500 דיווחי גירושין של יהודים בנפות צפת, כנרת, חיפה ופתח תקווה.",
    "הפילוח לפי גיל ולפי עיר הוא של 2024; הלוח העדכני לפי מחוז הוא של 2022. הנתונים על התביעות בבתי הדין הרבניים, הזמן עד הגט והסנקציות לקוחים מהדו-שנתון של המכון הישראלי לדמוקרטיה, שעיבד את נתוני הנהלת בתי הדין.",
]


def build(checked_on: str) -> dict:
    """The series by year and community, the breakdowns, the rabbinical courts' tables and the texts."""
    data = json.loads(DATA.read_text(encoding="utf-8"))
    latest = max(data["series"]["count"]["all"])
    return {
        "name_he": "נתוני גירושין בישראל",
        "checked_on": checked_on,
        "refresh_every_days": 183,
        "reviewed_he": "נבדק על ידי הצוות המשפטי של Justice",
        "latest_year": latest,
        "groups": GROUPS,
        "metrics": METRICS,
        "series": data["series"],
        "breakdowns": data["breakdowns"],
        "rabbinical_tables": data["rabbinical_tables"],
        "facts": data["facts"],
        "sources": data["sources"],
        "table_caption_he": "זוגות שהתגרשו בישראל לפי שנה ודת, וחתונות באותה שנה. מקור: הלשכה המרכזית לסטטיסטיקה, השנתון הסטטיסטי לישראל 2026, לוח 2.20 (12.10.2026)",
        "method_he": METHOD_HE,
    }
