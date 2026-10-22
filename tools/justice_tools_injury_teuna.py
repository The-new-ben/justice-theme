"""The road-accident claim dataset of the co.il tools registry (the injury wave, 22.10.2026, HAD-591): the upgrade of the
road-accident instrument (teunat-drachim) on /israel-road-accident-compensation-law/. Discovered by
tools/justice_tools_injury.py (glob), built with --injury-checked-on.

What this file adds, and what it does NOT repeat: the 1976 formula (2 permille a day, 1% per point, the age cut, 10%,
25%), the 100,000-lira maximum and its linkage section, the earnings ceiling x3 with the 2026 National Insurance average
wage, the 25% tax cap, the Bar fee caps 8 / 11 / 13% and VAT 18%, the limitation 7 years / 18 / the war window, the 60
days of s.5(b), the s.6A expert line, s.7, s.12 and the s.328A line all stay in reg.car_accident and are read from there.
Here: the rest of the law's rules the instrument now computes or flags (the ceiling reduced with a partial loss, the
interim-payment route of ss.5A-5E, periodic payments, the expert's procedure and days, who pays under ss.2-3 and 12, the
Civil Wrongs Ordinance sections that s.4(a) applies), the dated values for the "what changed" table (the average wage of
2023-2025, VAT 17% before 1.1.2025, s.328A from 1.1.2023, the 2024 limitation amendment), the official route to the
maximum in shekels (no official body publishes it), and the capitalisation question (no law or regulation sets the rate).

Every value was read on checked_on from the official text named next to it (Nevo's consolidated texts, btl.gov.il Laws1
PDFs and pages, Karnit, the Bank of Israel, gov.il). Nothing here is estimated; a figure the sources do not hold is not in
the file, and the gaps are named in words (capitalisation, the current maximum in shekels).
"""
from __future__ import annotations

KEY = "injury_teuna"

PAGE = "/israel-road-accident-compensation-law/"
LAW = "https://www.nevo.co.il/law_html/law00/4554.htm"             # חוק פיצויים לנפגעי תאונות דרכים, התשל"ה-1975 (נוסח ל-14.8.2025)
ORDINANCE = "https://www.nevo.co.il/law_html/law00/73015.htm"      # פקודת הנזיקין [נוסח חדש] (נוסח ל-18.9.2023)
PERIODIC_REGS = "https://www.nevo.co.il/law_html/law00/4557.htm"   # תקנות ... (תשלומים עיתיים), התשל"ח-1978 (נוסח ל-18.9.2023)
EXPERTS_REGS = "https://www.btl.gov.il/Laws1/02_0054_100004.pdf"   # תקנות ... (מומחים), התשמ"ז-1986 (ק"ת 4982; תיקונים ק"ת 5258, 6800)
NII_LAW = "https://www.btl.gov.il/Laws1/00_0001_000000.pdf"        # חוק הביטוח הלאומי [נוסח משולב], התשנ"ה-1995, סעיף 328א (עמ' 229)
BTL_WAGE = "https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%9E%D7%95%D7%A6%D7%A2.aspx"
BTL_RETIRE = "https://www.btl.gov.il/benefits/old_age/Conditions_of_eligibility/gilMezake/Pages/gilPrisha.aspx"
BTL_WORK = "https://www.btl.gov.il/benefits/Work_Injury/Pages/default.aspx"
KARNIT_SUIT = "https://www.karnit.co.il/suit/"                     # הגשת תביעה לקרנית: טופס, ערכת מסמכים, ויתור על סודיות
KARNIT_INSURER = "https://www.karnit.co.il/insurenceqry/"          # שאילתת מבטח לרכב (סעיף 15א1 לחוק)
CBS_CALC = "https://www.cbs.gov.il/he/CBSNewBrand/Pages/Calculator.aspx"   # = reg.cpi.official_calculator_url (a test keeps them equal)
NEW_SHEKEL_LAW = "https://www.boi.org.il/media/l5abksks/newshekellaw1985.pdf"
AV_REPORT = "https://www.gov.il/BlobFolder/reports/self-driving-cars/ar/self-driving-cars-report.pdf"
LIMITATION = "https://www.nevo.co.il/law_html/law00/71809.htm"
VAT_ORDER = "https://www.nevo.co.il/law_html/law01/999_481.htm"


def build(checked_on: str) -> dict:
    """The road-accident claim beyond the 1976 formula: heads of damage, future loss, interim payments, the expert."""
    return {
        "name_he": "תביעת פיצויים לפי חוק הפיצויים לנפגעי תאונות דרכים: ראשי הנזק, הפסד כושר השתכרות, תשלומים תכופים והמומחה",
        "publisher_he": "חוק הפיצויים לנפגעי תאונות דרכים ותקנותיו, פקודת הנזיקין, חוק הביטוח הלאומי, הביטוח הלאומי וקרנית",
        "source_name": "חוק פיצויים לנפגעי תאונות דרכים, התשל\"ה-1975 (נוסח עדכני ל-14.8.2025), ותקנותיו",
        "source_url": LAW,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "page": PAGE,
        # Who pays (ss.2(a), 3(a)-(b), 12(a)); the motorcycle split of s.3(c) is between insurers only.
        "who": {
            "vehicle_section": "סעיף 2(א)",
            "vehicle_he": "המשתמש ברכב מנועי חייב לפצות את הנפגע על נזק גוף בתאונת דרכים שבה מעורב הרכב, ובפועל התביעה מוגשת לחברת ביטוח החובה של אותו רכב",
            "inside_section": "סעיף 3(א)",
            "inside_he": "בתאונה של כמה כלי רכב, כל נוהג אחראי לנזקי הגוף של מי שנסע ברכב שלו: נהג ונוסע תובעים את ביטוח החובה של הרכב שבו נסעו",
            "outside_section": "סעיף 3(ב)",
            "outside_he": "מי שנפגע מחוץ לכלי הרכב בתאונה של כמה כלי רכב (למשל הולך רגל) יכול לתבוע את הנוהגים יחד ולחוד, כלומר כל אחד מהמבטחים",
            "karnit_section": "סעיף 12(א)",
            "karnit_reasons_he": "הנוהג האחראי לא ידוע, לנוהג אין ביטוח חובה או שהביטוח לא מכסה, או שהמבטח בפירוק או בניהול מורשה",
            "permitted_section": "סעיף 7א",
            "permitted_he": "מי שנהג בהיתר מהבעלים בלי שידע שאין ביטוח, ולא היה סביר שיידע, תובע את קרנית",
            "dependants_section": "סעיף 7ב",
            "dependants_he": "תלויים בנפגע זכאים לתבוע גם כשהנפגע עצמו לא היה זכאי לפי סעיף 7",
            "exclusive_section": "סעיף 8(א)",
            "exclusive_he": "מי שיש לו עילה לפי החוק לא תובע על נזק הגוף לפי פקודת הנזיקין, חוץ מתאונה שאדם אחר גרם במתכוון",
            "insurer_lookup_section": "סעיף 15א1",
            "insurer_lookup_he": "קרנית מוסרת לנפגע את שם המבטח של הרכב ומספר הפוליסה לפי מספר הרישוי",
            "insurer_lookup_url": KARNIT_INSURER,
            "karnit_suit_url": KARNIT_SUIT,
            "karnit_suit_he": "תביעה לקרנית: טופס תביעה, ערכת מסמכים וויתור על סודיות רפואית, למחלקת התביעות בדוא\"ל, בפקס או בדואר",
            "motorcycle_section": "סעיף 3(ג)",
            "motorcycle_he": "בתאונה של אופנוע ורכב אחר, מבטחי הרכב האחר משלמים למבטחי האופנוע 75% מהפיצויים: חלוקה בין המבטחים, שלא משנה את הפיצוי לנפגע",
            "compromise_section": "סעיף 4(ג)",
            "compromise_he": "כשבעלי הדין מסכימים, בית המשפט יכול לתת פסק דין על דרך הפשרה, ואפשר לערער עליו כמו על כל פסק דין",
        },
        # s.4(a): the Civil Wrongs Ordinance sections that apply to the claim, and the three the instrument shows.
        "ordinance": {
            "he": "פקודת הנזיקין [נוסח חדש]",
            "url": ORDINANCE,
            "current_to": "2023-09-18",
            "applied_he": "סעיפים 19 עד 22, 76 עד 83, 86, 88 ו-89",
            "applied_section": "סעיף 4(א)",
            "damage_he": "נזק הוא אבדן חיים, אבדן נכס, נוחות, רווחה גופנית או שם טוב, או חיסור מהם",
            "damage_section": "סעיף 2",
            "particulars_section": "סעיף 76(2)",
            "particulars_he": "על נזק ממון (הוצאות, הפסד שכר) נפסקים פיצויים רק אם פרטיו נמסרו בכתב התביעה או בצירוף לו: לשמור קבלות ותלושים",
            "insurance_section": "סעיף 86",
            "insurance_he": "סכום ששולם או מגיע מחוזה ביטוח פרטי (למשל ביטוח תאונות אישיות) לא מנוכה מהפיצויים",
            "discovery_section": "סעיף 89(2)",
            "discovery_years": 10,
            "discovery_he": "נזק שלא התגלה ביום שאירע: ההתיישנות מתחילה ביום הגילוי, אבל התביעה מתיישנת אם לא הוגשה תוך 10 שנים מיום הנזק",
        },
        # The heads of damage of a bodily-injury claim, each with the rule an official text gives it.
        "heads": [
            {"code": "nonpec", "he": "כאב וסבל (נזק שאינו נזק ממון)", "rule": "formula", "section": "סעיף 4(א)(3); תקנות 2 עד 4"},
            {"code": "past", "he": "הפסד השתכרות בעבר: החודשים שבהם לא עבדתם", "rule": "ceiling", "section": "סעיף 4(א)(1)-(2)"},
            {"code": "future", "he": "הפסד כושר השתכרות בעתיד: לפי הנכות התפקודית", "rule": "ceiling_reduced", "section": "סעיף 4(א)(1)-(2)"},
            {"code": "medical", "he": "הוצאות רפואיות, תרופות ואשפוז", "rule": "interim", "section": "סעיף 5(ב)(1); סעיף 76(2) לפקודה"},
            {"code": "help", "he": "עזרת הזולת וסיעוד", "rule": "interim_monthly", "section": "סעיף 5(ב)(2); סעיף 76(2) לפקודה"},
            {"code": "travel", "he": "נסיעות והוצאות אחרות", "rule": "particulars", "section": "סעיף 76(2) לפקודה"},
        ],
        # s.4(a)(1): with a loss below 100%, the maximum income counted is reduced by the same share.
        "earnings": {
            "partial_he": "כשאבדן ההשתכרות או כושר ההשתכרות פחות מ-100%, גם ההכנסה המרבית (פי 3 מהשכר הממוצע) מופחתת באותו שיעור",
            "partial_section": "סעיף 4(א)(1), סיפה",
            "eve_he": "השכר הממוצע הקובע הוא זה של ערב קביעת הפיצוי, הגבוה מבין נתוני הלמ\"ס והביטוח הלאומי",
            # btl.gov.il, "שכר ממוצע לפי סעיפים 1 ו-2 לחוק הביטוח הלאומי", the benefits columns (קצבאות); 2026 is in
            # reg.car_accident.earnings.nii and is not repeated here.
            "avg_wage_url": BTL_WAGE,
            "avg_wage_rows": [
                {"from": "2023-01-01", "s1": 11730, "s2": 11870},
                {"from": "2024-01-01", "s1": 12379, "s2": 12536},
                {"from": "2025-01-01", "s1": 13153, "s2": 13316},
            ],
            "avg_wage_column_he": "קצבאות",
        },
        # Future loss: what the official texts say, and what they do not.
        "future": {
            "capitalisation_he": "אין חוק ואין תקנה שקובעים באיזה שיעור מהוונים פיצוי על הפסד עתידי בתביעה לפי חוק הפיצויים; בית המשפט מהוון לפי שיעור שנקבע בפסיקה. לכן הכלי מציג את ההפסד לחודש ואת הסכום בלי היוון, ולא ערך נוכחי",
            "capitalisation_checked_he": "נבדקו: החוק ותקנותיו בנבו (תקנות כאב וסבל, תקנון קרנית, תקנות התשלומים העיתיים, צו חלוקת הנטל), תקנות המומחים, פקודת הנזיקין",
            "periodic_he": "תקנות פיצויים לנפגעי תאונות דרכים (תשלומים עיתיים), התשל\"ח-1978",
            "periodic_url": PERIODIC_REGS,
            "periodic_section": "תקנה 1",
            "periodic_law_section": "סעיף 6",
            "periodic_threshold_pct": 40,
            "periodic_rule_he": "בית המשפט מוסמך לפסוק שהפיצויים על הפסד כושר השתכרות והוצאות מתמשכות ישולמו בתשלומים עיתיים צמודים למדד, כשהנפגע יפסיד 40% או יותר מכושר השתכרותו, כשהפיצויים הם מקור עיקרי למחייתו, או כשהם ניתנו לתלויים בנפגע שנפטר",
            "periodic_increase_months": 6,
            "periodic_increase_section": "תקנה 2(א)",
            "periodic_increase_he": "אפשר לבקש להגדיל את התשלומים כשהמצב החמיר בגלל התאונה וחלפו 6 חודשים מהקביעה האחרונה",
            "retire_url": BTL_RETIRE,
            "retire_men": 67,
            "retire_women_he": "60 עד 65, לפי תאריך הלידה",
            "retire_he": "גיל הפרישה לפי הביטוח הלאומי: 67 לגברים; לנשים 60 עד 65 לפי תאריך הלידה (יש מחשבון באתר)",
        },
        # The statutory maximum of s.4(a)(3): no official body publishes its current shekel amount; the route instead.
        "max": {
            "increase_he": "או מיום שבו שר המשפטים הגדיל את הסכום בצו (סעיף 4(א)(3)); צו כזה לא נמצא בחקיקת המשנה של החוק בנבו",
            "currency_he": "כל סכום שנאמר בלירות או בשקלים נחשב לסכום שווה ערך בשקלים חדשים",
            "currency_section": "סעיף 2(ג) לחוק מטבע השקל החדש, התשמ\"ה-1985",
            "currency_url": NEW_SHEKEL_LAW,
            "cbs_calculator_url": CBS_CALC,
            "none_he": "לא מצאנו גוף רשמי שמפרסם את הסכום המעודכן בשקלים: לא קרנית, לא רשות שוק ההון ולא הרשות השופטת",
            "report_he": "דו\"ח של צוות בראשות משרד המשפטים ורשות שוק ההון על רכבים עצמאיים (קובץ מ-14.3.2024) כתב שהתקרה \"עומדת כיום על 180,000 ₪\"",
            "report_amount": 180000,
            "report_file_date": "2024-03-14",
            "report_url": AV_REPORT,
            "report_use_he": "זה סכום מעוגל של אותה עת ולא פרסום רשמי של הסכום העדכני, ולכן הכלי לא משתמש בו בחישוב",
        },
        # Interim payments, ss.5-5E (the 60 days and the s.5(b) sentence are in reg.car_accident).
        "interim": {
            "items_he": "הוצאות ריפוי, כולל אשפוז (סעיף 5(ב)(1)), ותשלומים חודשיים לריפוי, לסיעוד ולמחיה עד ההחלטה הסופית, לפי ההכנסה שלפני התאונה ועד ההכנסה המרבית (סעיף 5(ב)(2))",
            "court_section": "סעיף 5א",
            "court_he": "עברו 60 ימים מהדרישה בלי תשלום: אפשר להגיש בקשה לתשלום תכוף לבית משפט השלום, גם בנפרד מהתביעה העיקרית",
            "decision_section": "סעיף 5ב(א)",
            "decision_he": "בית המשפט שפוסק תשלום תכוף קובע מועד אחרון להגשת התביעה העיקרית",
            "late_pct": 12,
            "late_section": "סעיף 5ד",
            "late_he": "מי שלא שילם תשלום תכוף במועד משלם הפרשי הצמדה וריבית צמודה של 12% לשנה מהמועד עד התשלום, אלא אם בית המשפט קבע שיעור נמוך יותר",
            "again_months": 6,
            "again_section": "סעיף 5ה(א)",
            "max_years": 2,
            "max_section": "סעיף 5ה(ב)",
            "max_he": "בית המשפט לא פוסק תשלום תכוף בעד תקופה של יותר משנתיים מיום התאונה, אלא מטעמים שיירשמו (סעיף 5ה(ג))",
            "refund_section": "סעיף 5ז(א)",
            "refund_he": "נדחתה התביעה העיקרית, או שלא הוגשה עד המועד שבית המשפט קבע, המבטח זכאי להחזר התשלום התכוף; כך גם סכום ששולם מעל מה שנפסק",
            "health_section": "סעיף 5(ה)",
            "health_he": "שירותי בריאות שבסל לפי חוק ביטוח בריאות ממלכתי ניתנים בקופת החולים ולא משולמים כתשלום תכוף, חוץ ממי שזכאי לגמלה לפי פרק ה' לחוק הביטוח הלאומי",
        },
        # The court's medical expert: s.6A and the 1986 regulations (the 1976 regulations tie the % to the 1956 schedule).
        "expert": {
            "regs_he": "תקנות פיצויים לנפגעי תאונות דרכים (מומחים), התשמ\"ז-1986",
            "url": EXPERTS_REGS,
            "criteria_he": "אחוזי הנכות לכאב וסבל נקבעים לפי המבחנים שבתוספת לתקנות הביטוח הלאומי (קביעת דרגות נכות לנפגעי עבודה), התשט\"ז-1956",
            "criteria_section": "תקנה 2(א)(2) לתקנות הכאב והסבל",
            "request_section": "תקנה 2",
            "request_he": "את הבקשה למינוי מומחה מצרפים לכתב התביעה, עם תצהיר, ויתור על סודיות רפואית וסיכומי האשפוז",
            "hearing_days": 60,
            "hearing_section": "תקנה 6(א)",
            "docs_days": 15,
            "docs_section": "תקנה 8(א)",
            "docs_he": "תוך 15 ימים מההודעה על המינוי, הנפגע שולח למומחה ולבעלי הדין את כל המסמכים על הטיפול והבדיקות, בלי חוות דעת רפואית",
            "others_days": 45,
            "others_section": "תקנה 8(ב)",
            "object_days": 7,
            "object_section": "תקנה 10(א)",
            "opinion_days": 30,
            "opinion_section": "תקנה 15(א)",
            "opinion_he": "המומחה מגיש חוות דעת תוך 30 ימים מקבלת כל המסמכים ותוצאות הבדיקות, אלא אם בית המשפט הורה אחרת",
            "questions_days": 30,
            "questions_section": "תקנה 15(ב)",
            "questions_he": "שאלות הבהרה בכתב למומחה: תוך 30 ימים מקבלת חוות הדעת; המומחה משיב תוך 15 ימים",
            "summon_days": 45,
            "summon_section": "תקנה 15(ג)",
            "summon_he": "בקשה לזמן את המומחה לחקירה: 45 ימים לפני שמיעת הראיות, או תוך 7 ימים מההודעה על מועדה",
            "procedure_section": "תקנה 21",
            "procedure_he": "על ההליכים חלות תקנות סדר הדין האזרחי (חוץ מפרק י\"א), ולכן מועד דיוני יכול להשתנות בימי פגרה; עורך הדין בודק",
            "from": "1986-12-01",
            "amended_he": "תוקנו בק\"ת 5258 (26.3.1990) ובק\"ת 6800 (2.8.2009)",
        },
        # National Insurance Law s.328A (amendment 204; in force from 1.1.2023 after amendment 225B).
        "nii": {
            "url": NII_LAW,
            "section": "סעיף 328א(ב)(2)",
            "from": "2023-01-01",
            "he": "כשבית המשפט מחייב מבטח לשלם פיצויים לפי חוק הפיצויים לנפגע שזכאי לגמלה מהביטוח הלאומי בשל אותו מקרה, סכום הגמלה שהמוסד חייב לשלם מופחת מהפיצויים",
            "no_suit_section": "סעיף 328א(ב)(1)",
            "no_suit_he": "הביטוח הלאומי לא תובע את מבטח הרכב על הגמלאות ששילם",
            "work_url": BTL_WORK,
            "work_he": "תאונת דרכים בדרך לעבודה או בעבודה יכולה להיות גם תאונת עבודה: תביעה לדמי פגיעה ולנכות מעבודה בביטוח הלאומי",
        },
        # Limitation: the late-discovery rule is in the Ordinance (s.89(2) above); the war window is in reg.car_accident.
        "limitation": {
            "url": LIMITATION,
            "amendment_he": "חוק ההתיישנות (תיקון מס' 8 – חרבות ברזל), התשפ\"ד-2024",
            "revive_section": "סעיף 15א(ג)",
            "revive_he": "תקופה שהסתיימה בין 7.10.2023 לערב תחילת התיקון נחשבת כאילו לא הסתיימה",
            "court_section": "סעיף 15א(ד)",
            "court_he": "בית המשפט רשאי לקבוע, מטעמים מיוחדים, שתביעה שהתיישנה לפני התיקון לא תחזור לחיים",
            "minor_note_he": "לקטין: 7 שנים מגיל 18",
        },
        # VAT on the fee: the rate before 1.1.2025 (the current 18% is reg.car_accident.fees.vat_pct).
        "vat": {
            "url": VAT_ORDER,
            "prev_pct": 17,
            "prev_from": "2015-10-01",
            "prev_gazette_he": "צו תשע\"ה-2015, ק\"ת 7553",
            "from": "2025-01-01",
            "gazette_he": "צו תשפ\"ד-2024, ק\"ת 11179 מיום 28.2.2024",
        },
        "law_start": {"he": "החוק והתקנות לכאב וסבל נכנסו לתוקף", "section": "סעיף 23(א); תקנה 5"},
    }
