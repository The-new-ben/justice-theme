"""Choosing a divorce lawyer (bchirat-orech-din) on /divorce-lawyer/: "בחירת עורך דין גירושין" (31.10.2026, HAD-616).
Discovered by tools/justice_tools_fl.py (glob), built with --fl-checked-on.

Ben, 31.10.2026: "a tool that, as it were, searches a divorce lawyer for you". It does not rank lawyers and does not pretend
to search the market: it turns six answers into the profile of the lawyer the reader needs (the forum, the subjects, the
urgent step), the questions to ask at the first meeting, the warning signs, the route to price in the divorce calculator,
and the family-law lawyers in the site's directory for the reader's city. The site's featured family lawyer (Adv. Maya
Rotenberg) is shown by name and role, with no label or explanation (Ben 31.10.2026 night, HAD-648: "write nothing, she is
part of the office"), never as a search result. The rules follow the page's own table "איזה עורך דין מתאים למקרה שלכם"
(the chapter the tool sits in), so the tool and the text never disagree. No superlative ("המומלצת", "הטובה ביותר"): the
Bar's advertising rules (rule 2א) bar self-praise in a lawyer's advertising.
"""
from __future__ import annotations

KEY = "fl_bchira"

QUESTIONS = [
    {"id": "stage", "he": "איפה זה עומד", "type": "one", "default": "agree", "options": [
        {"v": "think", "he": "עוד מתלבטים"},
        {"v": "agree", "he": "מסכימים על רוב הדברים"},
        {"v": "dispute", "he": "יש מחלוקת"},
        {"v": "case", "he": "כבר יש תיק פתוח"},
    ]},
    {"id": "open", "he": "מה פתוח ביניכם", "type": "many", "default": ["kids", "home"], "options": [
        {"v": "kids", "he": "ילדים"},
        {"v": "home", "he": "דירה"},
        {"v": "business", "he": "עסק, מניות או אופציות"},
        {"v": "pension", "he": "פנסיה וחסכונות"},
        {"v": "abroad", "he": "נכס, נישואין או בן זוג בחו\"ל"},
    ]},
    {"id": "urgent", "he": "משהו דחוף", "type": "one", "default": "none", "options": [
        {"v": "none", "he": "אין דחיפות"},
        {"v": "violence", "he": "אלימות או איום"},
        {"v": "assets", "he": "חשש להברחת רכוש"},
        {"v": "travel", "he": "חשש שילד יוצא מהארץ"},
    ]},
    {"id": "forum", "he": "איפה ההליך", "type": "one", "default": "none", "options": [
        {"v": "none", "he": "עוד לא נפתח"},
        {"v": "rabbinical", "he": "בית הדין הרבני"},
        {"v": "family", "he": "בית המשפט לענייני משפחה"},
    ]},
    {"id": "focus", "he": "מה הכי חשוב לכם", "type": "one", "default": "agree", "options": [
        {"v": "agree", "he": "לסיים בהסכמה"},
        {"v": "cost", "he": "להוזיל"},
        {"v": "full", "he": "ליווי צמוד בכל שלב"},
    ]},
]

# The cities the directory filters by (/lawyers/?area=family-law&city=<slug>), read on the site 31.10.2026.
CITIES = [
    {"slug": "", "he": "כל הארץ"},
    {"slug": "tel-aviv", "he": "תל אביב"},
    {"slug": "jerusalem", "he": "ירושלים"},
    {"slug": "haifa", "he": "חיפה"},
    {"slug": "rishon-lezion", "he": "ראשון לציון"},
    {"slug": "petah-tikva", "he": "פתח תקווה"},
    {"slug": "netanya", "he": "נתניה"},
    {"slug": "beer-sheva", "he": "באר שבע"},
    {"slug": "ashdod", "he": "אשדוד"},
    {"slug": "holon", "he": "חולון"},
    {"slug": "herzliya", "he": "הרצליה"},
    {"slug": "kfar-saba", "he": "כפר סבא"},
    {"slug": "modiin", "he": "מודיעין"},
    {"slug": "bnei-brak", "he": "בני ברק"},
    {"slug": "ashkelon", "he": "אשקלון"},
]

# The profile: one sentence built from the answers (the engine joins the parts in this order).
PROFILE = {
    "stage": {
        "think": "עורך דין לדיני משפחה לפגישת ייעוץ אחת לפני כל צעד: מה הזכויות שלכם, אילו מסלולים יש, ומה לא לעשות עכשיו",
        "agree": "עורך דין לדיני משפחה שמנסח הסכמי גירושין ומביא אותם לאישור, או מגשר עם רקע משפטי ובדיקה של עורך דין לכל צד",
        "dispute": "עורך דין לדיני משפחה עם ניסיון בהתדיינות: בקשה ליישוב סכסוך, תביעות ודיונים, ומשא ומתן במקביל",
        "case": "עורך דין שמכיר מקרוב את הערכאה שבה התיק מתנהל ויכול להיכנס לתיק פתוח בלי לאבד מועדים",
    },
    "forum": {
        "none": "",
        "rabbinical": "שמופיע באופן קבוע בבית הדין הרבני (אפשר גם טוען רבני לצד עורך הדין)",
        "family": "שמופיע באופן קבוע בבית המשפט לענייני משפחה",
    },
    "open": {
        "kids": "עם ניסיון באחריות הורית, זמני שהות ומזונות ילדים",
        "home": "שמבין באיזון משאבים ובחלוקת דירה",
        "business": "שעובד עם מעריך שווי ועם רואה חשבון בעסק, מניות ואופציות",
        "pension": "שעובד עם אקטואר בחלוקת פנסיה וחסכונות",
        "abroad": "עם ניסיון בדיני משפחה בין-לאומיים",
    },
    "focus": {
        "agree": "המטרה: הסכם שמכסה את הכול ומאושר בערכאה",
        "cost": "המטרה: מחיר כולל בכתב, ומה שאפשר לעשות לבד בלי לוותר על בדיקה",
        "full": "המטרה: ליווי צמוד, עם זמינות שסוכמה מראש",
    },
}

# The urgent step comes before the lawyer: a sentence and an anchor on the page.
URGENT = {
    "violence": {"he": "קודם כול הגנה: במצב חירום מתקשרים למשטרה (100). צו הגנה מבקשים מבית המשפט, ואין צורך לחכות לעורך דין כדי לפנות.", "anchor": "#יש-מצב-דחוף-פועלים-קודם-להגנה-על-אדם-ילד-או-זכות"},
    "assets": {"he": "חשש להברחת רכוש: עורך הדין צריך לדעת להגיש מהר בקשה לסעד זמני, כמו עיקול או צו מניעה. שאלו על זה בשיחה הראשונה.", "anchor": "#יש-מצב-דחוף-פועלים-קודם-להגנה-על-אדם-ילד-או-זכות"},
    "travel": {"he": "חשש שילד יוצא מהארץ: מבקשים מיד צו עיכוב יציאה מהארץ. זו בקשה דחופה, לפני כל משא ומתן.", "anchor": "#יש-מצב-דחוף-פועלים-קודם-להגנה-על-אדם-ילד-או-זכות"},
}

# The questions for the first meeting: "all" always, then by answer, at most 7 in the result.
ASK = [
    {"when": "all", "he": "כמה תיקים כמו שלנו ניהלת בשנה האחרונה, ובאיזו ערכאה?"},
    {"when": "all", "he": "מי בפועל יטפל בתיק ביום יום, ומי יופיע בדיונים?"},
    {"when": "all", "he": "מה שכר הטרחה, לפי שלבים או במחיר כולל, ומה לא כלול בו (אגרות, מומחים, ערעור)?"},
    {"when": "stage:think", "he": "מה אסור לי לעשות לפני שאני מדבר עם הצד השני, ואילו מסמכים כדאי לאסוף עכשיו?"},
    {"when": "stage:agree", "he": "האם ההסכם יכסה גם מזונות, זמני שהות, רכוש ופנסיה, ובאיזו ערכאה נאשר אותו?"},
    {"when": "stage:dispute", "he": "מה התוכנית לפגישות המהו\"ת אחרי הבקשה ליישוב סכסוך, ומתי נכון להגיש תביעה?"},
    {"when": "stage:case", "he": "מה המועד הקרוב בתיק, ומה צריך להגיש עד אליו?"},
    {"when": "forum:rabbinical", "he": "כמה פעמים הופעת בבית הדין האזורי שבו התיק יתנהל?"},
    {"when": "open:kids", "he": "איך אתה עובד מול תסקיר של עובדת סוציאלית ומול יחידת הסיוע?"},
    {"when": "open:business", "he": "עם איזה מעריך שווי או רואה חשבון אתה עובד, ומי משלם עליו?"},
    {"when": "open:pension", "he": "איך מחלקים את הפנסיה אצלנו, ומי מכין את חוות הדעת האקטוארית?"},
    {"when": "open:abroad", "he": "איזו מדינה מוסמכת לדון אצלנו, ומי מטפל בצד של הדין הזר?"},
    {"when": "focus:cost", "he": "מה אפשר לעשות לבד כדי להוזיל, ומה אסור לחסוך עליו?"},
]

RED_FLAGS = [
    "מבטיח תוצאה או \"ניצחון\". אף עורך דין לא יכול להבטיח מה יפסוק שופט או דיין.",
    "דוחק לפתוח הליך לפני ששמע את כל התמונה ובדק אפשרות להסכמה.",
    "לא נותן הצעת שכר טרחה בכתב, או לא מפרט מה לא כלול בה.",
    "מציע לייצג את שניכם כשיש ביניכם מחלוקת. זה ניגוד עניינים שכללי האתיקה של עורכי הדין אוסרים.",
]

# Which preset of the divorce calculator prices this situation (machshevon-ui.js PRESETS).
CALC_PRESET = {"think": "plain", "agree": "kids", "dispute": "war", "case": "half"}

FEATURED = {
    "name_he": "עו\"ד מאיה רוטנברג",
    "city_he": "תל אביב",
    "path": "/lawyers/advocate-maya-rotenberg/",
    "label_he": "עורכת דין גירושין ודיני משפחה",
}

TEXTS = {
    "method_he": [
        "הכלי עונה על שאלה אחת: איזה עורך דין מתאים למצב שלכם. הוא בונה פרופיל מתוך שש התשובות, לפי הטבלה \"איזה עורך דין מתאים למקרה שלכם\" שבעמוד: שלב ההליך, הערכאה, הנושאים הפתוחים והדחיפות.",
        "השאלות לפגישה נבחרות לפי התשובות: שלוש לכל מצב, ועוד אחת לכל נושא פתוח, עד שבע.",
        "הכלי לא מדרג עורכי דין, לא שוקל ביקורות ולא בודק זמינות או מחיר של משרד מסוים. את עלות ההליך מחשב מחשבון הגירושין שבעמוד.",
        "התשובות לא נשמרות אצלנו. קישור השיתוף מכיל רק את הבחירות, בלי שמות.",
    ],
}


def _sources() -> list:
    return [
        {"name_he": "כללי לשכת עורכי הדין (אתיקה מקצועית), התשמ\"ו-1986", "url": "https://www.nevo.co.il/law_html/law00/4415.htm",
         "text_he": "כלל 14(ב): עורך דין לא מייצג שני צדדים שיש ביניהם ניגוד עניינים."},
        {"name_he": "חוק להסדר התדיינויות בסכסוכי משפחה, התשע\"ה-2014", "url": "https://www.nevo.co.il/law_html/law01/501_151.htm",
         "text_he": "סעיף 3: בקשה ליישוב סכסוך ופגישות המהו\"ת לפני הגשת תביעה בסכסוך משפחתי."},
        {"name_he": "מדריך עורכי הדין לדיני משפחה באתר", "url": "https://jus-tice.co.il/lawyers/?area=family-law",
         "text_he": "הסינון לפי עיר כפי שהוא באתר ב-31.10.2026."},
    ]


def build(checked_on: str) -> dict:
    """The chooser's questions, rules and texts. No number and no price: the cost lives in the divorce calculator."""
    return {
        "name_he": "בחירת עורך דין גירושין",
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "reviewed_he": "נבדק על ידי הצוות המשפטי של Justice",
        "questions": QUESTIONS,
        "cities": CITIES,
        "profile": PROFILE,
        "urgent": URGENT,
        "ask": ASK,
        "red_flags": RED_FLAGS,
        "calc_preset": CALC_PRESET,
        "featured": FEATURED,
        "directory": {"path": "/lawyers/", "area": "family-law"},
        "sources": _sources(),
        **TEXTS,
    }
