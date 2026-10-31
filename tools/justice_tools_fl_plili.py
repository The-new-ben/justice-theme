"""Choosing a criminal defence lawyer (bchirat-orech-din-plili) on /criminal-defense-attorney/: "בחירת עורך דין פלילי"
(31.10.2026, HAD-651). Discovered by tools/justice_tools_fl.py (glob).

The criminal hub plan (HAD-650, tool ג1): five answers (the stage, the offence, the court district, how urgent, the
budget) become the matching guide of the criminal pyramid, the profile of the lawyer the reader needs, the urgent step
first when someone is under arrest, seven questions for the first meeting, the warning signs, the fee range of that stage
(reg.fl_plili_sachar, the fee table beside it) and the criminal lawyers of the site's directory. It ranks no one and holds
no price of its own. The arrest facts are the Criminal Procedure (Enforcement Powers - Arrests) Law, 1996, sections 17,
29, 33 and 34, read on 31.10.2026. No superlative (the Bar's advertising rule 2א).
"""
from __future__ import annotations

KEY = "fl_plili"

QUESTIONS = [
    {"id": "stage", "he": "איפה אתם עכשיו", "type": "one", "default": "before", "options": [
        {"v": "before", "he": "זומנתי לחקירה"},
        {"v": "arrest", "he": "נעצרתי, או שבן משפחה עצור"},
        {"v": "indict", "he": "כתב אישום או מכתב לשימוע"},
        {"v": "convict", "he": "הורשעתי, או שיש גזר דין"},
        {"v": "record", "he": "רישום פלילי ישן"},
    ]},
    {"id": "offence", "he": "במה החשד", "type": "one", "default": "violence", "options": [
        {"v": "drugs", "he": "סמים"},
        {"v": "violence", "he": "אלימות או איומים"},
        {"v": "sex", "he": "עבירת מין"},
        {"v": "white", "he": "הונאה, מס או הלבנת הון"},
        {"v": "traffic", "he": "תעבורה או נהיגה בשכרות"},
        {"v": "other", "he": "משהו אחר"},
    ]},
    {"id": "urgency", "he": "כמה זה דחוף", "type": "one", "default": "week", "options": [
        {"v": "now", "he": "היום או מחר"},
        {"v": "week", "he": "השבוע"},
        {"v": "plan", "he": "יש זמן לבדוק"},
    ]},
    {"id": "budget", "he": "מה התקציב", "type": "one", "default": "mid", "options": [
        {"v": "pd", "he": "אין לי אפשרות לשלם"},
        {"v": "low", "he": "עד 5,000 ₪"},
        {"v": "mid", "he": "5,000 עד 20,000 ₪"},
        {"v": "high", "he": "מעל 20,000 ₪"},
    ]},
]

# The budget answers as numbers, to set them against the fee range of the stage.
BUDGET_CAP = {"pd": 0, "low": 5000, "mid": 20000, "high": None}

# The court districts. The directory filters by city (/lawyers/?area=criminal-law&city=<slug>), read on 31.10.2026.
DISTRICTS = [
    {"v": "", "he": "לא יודע", "court_he": "", "city": ""},
    {"v": "north", "he": "צפון", "court_he": "בית המשפט המחוזי בנצרת ובתי משפט השלום במחוז הצפון", "city": ""},
    {"v": "haifa", "he": "חיפה", "court_he": "בית המשפט המחוזי בחיפה ובתי משפט השלום במחוז חיפה", "city": "haifa"},
    {"v": "center", "he": "מרכז", "court_he": "בית המשפט המחוזי מרכז-לוד ובתי משפט השלום במחוז המרכז", "city": ""},
    {"v": "tlv", "he": "תל אביב", "court_he": "בית המשפט המחוזי בתל אביב-יפו ובתי משפט השלום במחוז תל אביב", "city": "tel-aviv"},
    {"v": "jerusalem", "he": "ירושלים", "court_he": "בית המשפט המחוזי בירושלים ובתי משפט השלום במחוז ירושלים", "city": "jerusalem"},
    {"v": "south", "he": "דרום", "court_he": "בית המשפט המחוזי בבאר שבע ובתי משפט השלום במחוז הדרום", "city": "beer-sheva"},
]

# The guide for each stage: the pyramid's tier-1 page and its exact anchor (HAD-643 table).
GUIDE = {
    "before": {"path": "/police-investigation-rights/", "he": "זכויות חשוד בחקירה במשטרה"},
    "arrest": {"path": "/arrest-detention-lawyer-israel/", "he": "עורך דין מעצרים"},
    "indict": {"path": "/criminal-indictment/", "he": "כתב אישום: מה קורה אחרי ההגשה"},
    "convict": {"path": "/criminal-appeal/", "he": "ערעור פלילי"},
    "record": {"path": "/criminal-record-deletion/", "he": "מחיקת רישום פלילי"},
}
# The offence guide: the pyramid's tier-2 page and its exact anchor.
OFFENCE_GUIDE = {
    "drugs": {"path": "/drug-related-crime/", "he": "עבירות סמים"},
    "violence": {"path": "/assault-charges-lawyer/", "he": "עבירת תקיפה"},
    "sex": {"path": "/sexual-offenses/", "he": "עבירות מין"},
    "white": {"path": "/white-collar-crime-israel/", "he": "עבירות צווארון לבן"},
    "traffic": {"path": "/driving-under-influence/", "he": "נהיגה בשכרות"},
    "other": {"path": "/criminal-offenses-lawyer-criminal-sentencing-process-arrest/", "he": "סוגי עבירות פליליות ועונשיהן"},
}

# The profile: one sentence built from the answers.
PROFILE = {
    "stage": {
        "before": "עורך דין פלילי לייעוץ לפני החקירה: מה אומרים, מתי שותקים ומה מביאים",
        "arrest": "עורך דין מעצרים שיכול להגיע עכשיו לתחנה ולדיון בהארכת המעצר, ולבקש שחרור בתנאים או חלופת מעצר",
        "indict": "סנגור לתיק אחרי כתב אישום או לפני שימוע: עיון בחומר החקירה, טענות מקדמיות, משא ומתן להסדר טיעון או ניהול הוכחות",
        "convict": "עורך דין לערעור פלילי על הכרעת הדין או על גזר הדין",
        "record": "עורך דין לבקשה למחיקת רישום פלילי או לקיצור תקופת ההתיישנות",
    },
    "offence": {
        "drugs": "עם ניסיון בעבירות סמים",
        "violence": "עם ניסיון בעבירות אלימות ואיומים",
        "sex": "עם ניסיון בעבירות מין, שעובד בדיסקרטיות",
        "white": "עם ניסיון בעבירות כלכליות, מס והלבנת הון, ועבודה עם רואה חשבון",
        "traffic": "עם ניסיון בתעבורה ובנהיגה בשכרות",
        "other": "",
    },
    "urgency": {
        "now": "זמינות מיידית, גם בלילה ובסוף שבוע",
        "week": "פגישה השבוע, לפני המועד הבא",
        "plan": "זמן לפגוש שניים או שלושה עורכי דין ולהשוות הצעות",
    },
}

# The urgent step: under arrest the law's clock runs before any comparison of lawyers.
URGENT = {
    "he": "עצור זכאי להיפגש עם עורך דין ולהתייעץ איתו, וזכאי שתימסר הודעה על מעצרו לאדם קרוב ולעורך הדין שבחר. מי שנעצר מובא בפני שופט בתוך 24 שעות, ושופט מאריך מעצר לפני כתב אישום ב-15 ימים לכל היותר בכל פעם.",
    "law_he": "חוק סדר הדין הפלילי (סמכויות אכיפה - מעצרים), סעיפים 17, 29, 33 ו-34",
    "anchor": "/arrest-detention-lawyer-israel/",
}

# The questions for the first meeting: "all" always, then by answer, at most 7.
ASK = [
    {"when": "all", "he": "כמה תיקים בעבירות כמו שלי ניהלת בשנה האחרונה, ובאיזה בית משפט?"},
    {"when": "all", "he": "מי יופיע בדיונים בפועל, ומי זמין אם יהיה מעצר בלילה או בסוף שבוע?"},
    {"when": "all", "he": "מה שכר הטרחה לכל שלב, ומה לא כלול בו (חוות דעת, ערר, ערעור)?"},
    {"when": "stage:before", "he": "מה אומרים ומה לא אומרים בחקירה באזהרה, ומתי עדיף לשתוק?"},
    {"when": "stage:before", "he": "האם להביא לחקירה מסמכים, או למסור גרסה מאוחר יותר?"},
    {"when": "stage:arrest", "he": "מה הסיכוי לשחרור בתנאים או לחלופת מעצר, ומי יכול לחתום כערב?"},
    {"when": "stage:arrest", "he": "אם המעצר יוארך, האם נגיש ערר, ומתי?"},
    {"when": "stage:indict", "he": "מה מצאת בחומר החקירה, והאם יש מקום לבקש שימוע או לנהל משא ומתן להסדר טיעון?"},
    {"when": "stage:indict", "he": "האם יש טענות מקדמיות, כמו פגם בכתב האישום או הגנה מן הצדק?"},
    {"when": "stage:convict", "he": "עד מתי אפשר להגיש ערעור, ועל מה: על ההרשעה, על העונש או על שניהם?"},
    {"when": "stage:record", "he": "מתי הרישום שלי מתיישן או נמחק לפי החוק, ומה אפשר לבקש לפני כן?"},
    {"when": "offence:drugs", "he": "האם יש כאן טענה לשימוש עצמי, ומה זה משנה בעונש?"},
    {"when": "offence:violence", "he": "האם יש צו הרחקה או תנאים מגבילים, ואיך מבקשים לשנות אותם?"},
    {"when": "offence:sex", "he": "איך מתנהלת עדות המתלונן או המתלוננת, ומה לגבי איסור פרסום שם?"},
    {"when": "offence:white", "he": "האם צריך רואה חשבון או מומחה כלכלי, ומי משלם עליו?"},
    {"when": "offence:traffic", "he": "מה קורה לרישיון הנהיגה עד הדיון, ואיך מבקשים לבטל פסילה מנהלית?"},
    {"when": "urgency:now", "he": "אתה יכול להגיע עכשיו לתחנה או לדיון?"},
]

RED_FLAGS = [
    "מבטיח תוצאה, זיכוי או \"סגירת תיק\". אף עורך דין לא יכול להבטיח מה יחליטו המשטרה, הפרקליטות או השופט.",
    "מספר על \"קשרים\" במשטרה, בפרקליטות או בבית המשפט. זה לא שירות משפטי, וזה עלול לסבך אתכם.",
    "דורש את כל שכר הטרחה מראש, בלי הסכם בכתב שמפרט מה כלול בכל שלב.",
    "מציע לייצג גם אדם נוסף מאותו תיק, כמו שותף לחשד או מתלונן. זה ניגוד עניינים.",
]

# Which rows of the fee table (reg.fl_plili_sachar.rows) price each stage.
FEE_ROWS = {
    "before": ["consult", "interrogation"],
    "arrest": ["arrest", "arrest_full"],
    "indict": ["shimua", "trial_shalom", "trial_district"],
    "convict": ["appeal"],
    "record": ["record"],
}

TEXTS = {
    "method_he": [
        "הכלי בונה פרופיל מתוך חמש התשובות: השלב, העבירה, המחוז, הדחיפות והתקציב. כל שלב מוביל למדריך שלו באתר, וכל עבירה למדריך העבירה.",
        "השאלות לפגישה נבחרות לפי התשובות: שלוש לכל מצב, ועוד אחת לכל שלב, עבירה ודחיפות, עד שבע.",
        "טווח שכר הטרחה מגיע מטבלת שכר הטרחה שבעמוד, עם המקור והתאריך של כל שורה.",
        "התשובות לא נשמרות אצלנו. קישור השיתוף מכיל רק את הבחירות.",
    ],
}


def _sources() -> list:
    return [
        {"name_he": "חוק סדר הדין הפלילי (סמכויות אכיפה - מעצרים), התשנ\"ו-1996", "url": "https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%A1%D7%93%D7%A8_%D7%94%D7%93%D7%99%D7%9F_%D7%94%D7%A4%D7%9C%D7%99%D7%9C%D7%99_(%D7%A1%D7%9E%D7%9B%D7%95%D7%99%D7%95%D7%AA_%D7%90%D7%9B%D7%99%D7%A4%D7%94_%E2%80%93_%D7%9E%D7%A2%D7%A6%D7%A8%D7%99%D7%9D)",
         "text_he": "סעיף 17: עד 15 ימים בכל הארכת מעצר לפני כתב אישום ועד 30 ימים ברצף; סעיף 29: הבאה בפני שופט בתוך 24 שעות; סעיף 33: הודעה לקרוב ולעורך דין; סעיף 34: פגישה עם עורך דין."},
        {"name_he": "כללי לשכת עורכי הדין (אתיקה מקצועית), התשמ\"ו-1986", "url": "https://www.nevo.co.il/law_html/law00/4415.htm",
         "text_he": "כלל 14: עורך דין לא מייצג שני צדדים שיש ביניהם ניגוד עניינים."},
        {"name_he": "מדריך עורכי הדין למשפט פלילי באתר", "url": "https://jus-tice.co.il/lawyers/?area=criminal-law",
         "text_he": "הסינון לפי עיר כפי שהוא באתר ב-31.10.2026."},
    ]


def build(checked_on: str) -> dict:
    """The selector's questions, rules and texts. No price of its own: the fee range comes from reg.fl_plili_sachar."""
    return {
        "name_he": "בחירת עורך דין פלילי",
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "reviewed_he": "נבדק על ידי הצוות המשפטי של Justice",
        "questions": QUESTIONS,
        "budget_cap": BUDGET_CAP,
        "districts": DISTRICTS,
        "guide": GUIDE,
        "offence_guide": OFFENCE_GUIDE,
        "profile": PROFILE,
        "urgent": URGENT,
        "ask": ASK,
        "red_flags": RED_FLAGS,
        "fee_rows": FEE_ROWS,
        "public_defender": {"path": "/eligibility-public-defender-income/", "he": "זכאות לסנגוריה ציבורית"},
        "choose": {"path": "/how-to-choose-criminal-defense-attorney/", "he": "איך בוחרים עורך דין פלילי"},
        "rating": {"path": "/criminal-lawyers-rating/", "he": "דירוג עורכי דין פליליים"},
        "directory": {"path": "/lawyers/", "area": "criminal-law"},
        "sources": _sources(),
        **TEXTS,
    }
