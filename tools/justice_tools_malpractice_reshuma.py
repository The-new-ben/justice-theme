"""The medical-records request generator (bakashat-reshuma) on /obtaining-medical-records-copy/: the medical-malpractice
wave (22.10.2026, HAD-594). Discovered by tools/justice_tools_malpractice.py (glob), built with --malpractice-checked-on.

What this file holds, each value with the official text it was read from on checked_on:
- the Patients' Rights Law 1996 (Nevo, current to 6.4.2025): s.17 the duty to keep a record (personal notes are not part of
  it), s.18 the right to the record and a copy, s.18(c)-(e) withholding with the ethics committee, ss.19-20 confidentiality
  and disclosure with consent, ss.22(e)-23 facts a quality committee found, s.25 the patients' rights officer, s.27(a)(1) the
  IDF Medical Corps, s.28(b) the offence, s.16 the medical power of attorney;
- the maximum-payment regulations 2019 (Nevo, current to 18.9.2023; Kovetz HaTakanot 8146 of 8.1.2019, page 1784): who the
  caps cover, 10 shekels for a computerised copy, the Ministry's tariff for a paper copy, the 5 years, the deceased patient's
  relative (6 months, 30 days), the free items, the application from 1.1.2011, the Prison Service exclusion;
- the Ministry of Health tariff (תעריפון, the price list of the government and public hospitals): the lines for copying a
  record in force from 1.10.2026, tariff A (people paying for themselves), and the published values of L0268 since 2023;
- the Director-General's circular 9/2019 (in force from 10.1.2021, updated 10.7.2024): who may receive a copy and what each
  one shows, the waiver of confidentiality and its contents, minors, guardians, heirs, sensitive records, no original record,
  and section C.22: each institution publishes its own response time (no number of days is set);
- the Public Health (Keeping of Records) Regulations 1976 (Nevo, current to 7.2.2024): the periods by record type for a
  hospital, and reg. 4(e) (they do not bind a state or municipal hospital); the Medical Administration circulars 21/2005
  (a newborn's own record from 1.7.2005) and 42/2006 (keep the mother's birth record 25 years: a recommendation);
- the Legal Capacity and Guardianship Law 1962 (Nevo, current to 19.1.2026): s.3 (a minor is under 18), s.14 (the parents
  are the natural guardians);
- the Ministry's complaint services. The HMO and hospital pages are listed only as WHERE a request is sent, never as the
  source of a figure.
Nothing here is estimated. The 7-year limitation and the age of 18 are read from reg.car_accident.limitation, not repeated.
"""
from __future__ import annotations

KEY = "malpractice_reshuma"

LAW = "https://www.nevo.co.il/law_html/law00/71833.htm"            # חוק זכויות החולה, התשנ"ו-1996 (נוסח ל-6.4.2025)
REGS = "https://www.nevo.co.il/law_html/law00/159312.htm"          # תקנות התשלום המרבי, התשע"ט-2019 (נוסח ל-18.9.2023)
RECORDS = "https://www.nevo.co.il/law_html/law00/74724.htm"        # תקנות בריאות העם (שמירת רשומות), התשל"ז-1976 (נוסח ל-7.2.2024)
CAPACITY = "https://www.nevo.co.il/law_html/law00/70325.htm"       # חוק הכשרות המשפטית והאפוטרופסות (נוסח ל-19.1.2026)
GOV = "https://www.gov.il"
TARIFF = GOV + "/he/departments/dynamiccollectors/moh-price-list"  # תעריפון משרד הבריאות (רשימת הקבצים)
TARIFF_HELP = GOV + "/he/Departments/publications/reports/moh-price-list-description"
TARIFF_FILE = GOV + "/BlobFolder/dynamiccollectorresultitem/spl-m{tag}/he/files_databases_moh-price-list_{year}_spl-m{tag}.xlsx"
TARIFF_CHANGES = GOV + "/BlobFolder/dynamiccollectorresultitem/spl-011026changes-pdf/he/files_databases_moh-price-list_2026_spl-011026changes-PDF.pdf"
CIRCULAR = GOV + "/BlobFolder/policy/mk09-2019/he/files_circulars_reg_mk09_2019.pdf"
CIRCULAR_PAGE = GOV + "/he/pages/mk09-2019"
NEWBORN_2005 = GOV + "/BlobFolder/policy/mr21-2005/he/files_circulars_mr_mr21_2005.pdf"
NEWBORN_2006 = GOV + "/BlobFolder/policy/mr42-2006/he/files_circulars_mr_mr42_2006.pdf"
COMPLAINT_NHI = GOV + "/he/service/national-health-insurance-law-complaint-submission"
COMMISSION = GOV + "/he/departments/units/public-complaints-commission/govil-landing-page"
COMPLAINT_PROFESSIONS = GOV + "/he/service/public_ombudsman_for_medical_professions"


def _tariff_url(day: str) -> str:
    """The tariff file of an effective day (YYYY-MM-DD), as the Ministry names it (spl-m<ddmmyy>)."""
    y, m, d = day.split("-")
    return TARIFF_FILE.format(tag=f"{d}{m}{y[2:]}", year=y)


def build(checked_on: str) -> dict:
    """The right to a copy of the medical record, what it costs, who sends what, how long a hospital keeps it."""
    return {
        "name_he": "בקשה לקבלת העתק מהרשומה הרפואית: הזכות, העלות, המסמכים ותקופות השמירה",
        "publisher_he": "חוק זכויות החולה, תקנות התשלום המרבי בעד העתק רשומה רפואית, תעריפון משרד הבריאות, חוזר המנהל "
                        "הכללי 9/2019, תקנות בריאות העם (שמירת רשומות) וחוק הכשרות המשפטית והאפוטרופסות",
        "source_name": "חוק זכויות החולה, התשנ\"ו-1996 (נוסח עדכני)",
        "source_url": LAW,
        "checked_on": checked_on,
        # The tariff is raised several times a year (1.1.2026, 15.3.2026, 1.4.2026, 1.9.2026, 1.10.2026 were read).
        "refresh_every_days": 90,
        "next_update": "2027-01-01",
        "law": {
            "he": "חוק זכויות החולה, התשנ\"ו-1996",
            "url": LAW,
            "current_to": "2025-04-06",
            "record_section": "סעיף 17(א)",
            "record_he": "מטפל יתעד את מהלך הטיפול ברשומה רפואית: פרטים מזהים, הטיפול שקיבל המטופל, עברו הרפואי, האבחון והוראות הטיפול; תרשומת אישית של המטפל אינה חלק מהרשומה",
            "keep_section": "סעיף 17(ב)",
            "keep_he": "המטפל, ובמוסד רפואי מנהל המוסד, אחראים לניהול הרשומה ולשמירתה בהתאם לכל דין",
            "right_section": "סעיף 18(א)",
            "right_he": "מטופל זכאי לקבל מהמטפל או מהמוסד הרפואי מידע רפואי מהרשומה הרפואית המתייחסת אליו, לרבות העתק",
            "team_section": "סעיף 18(ב)",
            "withhold_section": "סעיף 18(ג)",
            "withhold_he": "מטפל רשאי שלא למסור מידע אם הוא עלול לגרום נזק חמור לבריאות הגופנית או הנפשית של המטופל או לסכן את חייו; עליו להודיע מיד לוועדת האתיקה ולצרף את המידע ואת נימוקיו",
            "ethics_section": "סעיף 18(ד)-(ה)",
            "ethics_he": "ועדת האתיקה רשאית לאשר את ההחלטה, לבטלה או לשנותה, ורשאית לשמוע את המטופל",
            "secrecy_section": "סעיף 19",
            "disclose_section": "סעיף 20(א)(1)",
            "disclose_he": "מטפל או מוסד רפואי רשאים למסור מידע רפואי לאחר אם המטופל נתן את הסכמתו",
            "disclose_min_section": "סעיף 20(ב)",
            "findings_section": "סעיף 22(ה)",
            "objection_section": "סעיף 23(א)",
            "objection_he": "סברו המטופל או נציגו שממצאים עובדתיים של ועדת בקרה ואיכות לא תועדו ברשומה, רשאים הם להגיש השגה לוועדת האתיקה",
            "officer_section": "סעיף 25",
            "officer_he": "בכל מוסד רפואי ממונה עובד אחראי לזכויות המטופל: ייעוץ וסיוע במימוש הזכויות, קבלת תלונות ובדיקתן",
            "idf_section": "סעיף 27(א)(1)",
            "idf_he": "לעניין סעיפים 17 עד 23 רואים את חיל הרפואה של צה\"ל, מערך הרפואה של המשטרה ומחלקת הרפואה של שירות בתי הסוהר כמוסד רפואי",
            "penalty_section": "סעיף 28(ב)",
            "penalty_he": "המפר חובה מן החובות שבסעיף 17 (ניהול הרשומה ושמירתה) דינו קנס",
            "poa_section": "סעיף 16",
        },
        "regs": {
            "he": "תקנות זכויות החולה (תשלום מרבי בעד מסירת העתק רשומה רפואית או עיון בה), התשע\"ט-2019",
            "short_he": "תקנות התשלום המרבי",
            "url": REGS,
            "current_to": "2023-09-18",
            "kt_he": "ק\"ת 8146, עמ' 1784",
            "published": "2019-01-08",
            "start_days": 90,                    # תקנה 7: תחילתן 90 ימים מיום פרסומן
            "paper_from": "2019-12-25",          # תקנה 7: תחילת תקנה 3(ב) ביום 25.12.2019
            "applies_from": "2011-01-01",        # תקנה 8(א): רשומה שנוצרה מיום 1.1.2011
            "years": 5,                          # תקנה 3(ג): רשומה שנוצרה בחמש השנים שקדמו לבקשה
            "computerised_max": 10,              # התוספת, פרט 1: הפקת העתק רשומה ממוחשבת, כולל המרה לקובץ
            "extra_disc": 0,                     # התוספת, פרט 2: כל תקליטור נוסף
            "deceased_months": 6,                # תקנה 3(ד): הטיפולים בששת החודשים שקדמו לפטירה
            "deceased_days": 30,                 # תקנה 3(ד): הבקשה הוגשה בתוך 30 ימים מיום הפטירה
            "sections": {
                "definitions": "תקנה 1",
                "unit": "תקנה 2",
                "computerised": "תקנה 3(א)",
                "paper": "תקנה 3(ב)",
                "five": "תקנה 3(ג)",
                "deceased": "תקנה 3(ד)",
                "online": "תקנה 4(א)",
                "filing": "תקנה 4(ב)",
                "free": "תקנה 4(ג)",
                "rx": "תקנה 4(ד)",
                "other_law": "תקנה 4(ה)",
                "keep_law": "תקנה 5",
                "start": "תקנה 7",
                "applies": "תקנה 8(א)",
                "foster": "תקנה 8(ב)",
                "prisons": "תקנה 8(ג)",
                "schedule": "התוספת",
            },
            "capped_he": "המטופל עצמו, מיופה כוחו שהוא קרובו, או האפוטרופוס שלו",
            "relative_he": "בן זוג, הורה, הורה של הורה, צאצא, אח או אחות, או בן זוג או צאצא של כל אחד מאלה, לרבות באימוץ",
            "insurer_he": "בקשה של מבטח או מטעמו אינה \"בקשה\" לפי התקנות",
            "unit_he": "כל הרשומה של אדם במוסד רפואי אחד היא יחידה אחת; בקופת חולים: הרשומה הממוחשבת של הקופה יחידה אחת, והרשומה שאינה ממוחשבת יחידה אחת בכל מחוז; רשומה ממוחשבת ורשומה שאינה ממוחשבת הן יחידות נפרדות",
            "computerised_he": "הפקת העתק רשומה ממוחשבת, בפלט, בתקליטור או במדיה אחרת, כולל המרה לקובץ, וכולל בדיקות דימות על תקליטור",
            "paper_he": "העתק רשומה שאינה ממוחשבת: לכל היותר הסכום שבתעריפון משרד הבריאות",
            "deceased_he": "קרוב אחד של מטופל שנפטר, על הטיפולים בששת החודשים שלפני הפטירה, אם ביקש בתוך 30 ימים מיום הפטירה, משלם לכל היותר כמו אפוטרופוס",
            "free": [
                {"code": "online", "section": "תקנה 4(א)", "he": "צפייה מקוונת ברשומה, אם המוסד או הקופה נותנים אותה"},
                {"code": "filing", "section": "תקנה 4(ב)", "he": "הגשת הבקשה עצמה; התשלום נגבה רק במועד מסירת ההעתק"},
                {"code": "summary", "section": "תקנה 4(ג)(1)", "he": "פעם אחת, בגמר הטיפול או בשחרור: מכתב שחרור, סיכום ביקור, סיכום טיפול או סיכום אשפוז, גיליון מחלה וגיליון מיון"},
                {"code": "test", "section": "תקנה 4(ג)(2)", "he": "פעם אחת: העתק בדיקה, תוצאותיה ופענוחה, כשנעשתה שלא באשפוז"},
                {"code": "followup", "section": "תקנה 4(ג)(3)", "he": "פעם אחת: הוראות להמשך טיפול, גם בסיום ביקור בחדר מיון"},
                {"code": "medical", "section": "תקנה 4(ג)(4)", "he": "פעם אחת: סיכומים לגורמים רפואיים"},
                {"code": "rx", "section": "תקנה 4(ד)", "he": "מרשמים והפניות בתוקף (למטופל, למיופה כוחו הקרוב או לאפוטרופוס)"},
                {"code": "law", "section": "תקנה 4(ה)", "he": "כל מסמך שמגיע בלי תשלום לפי דין אחר"},
            ],
        },
        "tariff": {
            "he": "תעריפון משרד הבריאות",
            "url": TARIFF,
            "help_url": TARIFF_HELP,
            "changes_url": TARIFF_CHANGES,
            "from": "2026-10-01",
            "file_url": _tariff_url("2026-10-01"),
            "raise_pct": 2.14,
            "column_he": "תעריף א': אזרחי ישראל המשלמים בעצמם",
            "scope_he": "תעריפי האשפוז והשירותים בבתי החולים הממשלתיים והציבוריים, לפי צו פיקוח על מחירים",
            "items": {
                "L0268": {"he": "איתור והעתקת מסמכים עד 10 עמודים", "amount": 146, "pages": 10},
                "L0269": {"he": "העתקת מסמכים, כל 2 עמודים נוספים", "amount": 1, "per_pages": 2},
                "L9413": {"he": "תדפיס מחשב מתוך רשומות מידע", "amount": 62},
                "L6497": {"he": "העתקת סרט וידאו, אקו, צנתור, תקליטור", "amount": 153},
                "L6498": {"he": "איתור והעתקת צילום מתיק צילומים", "amount": 57},
                "L6499": {"he": "העתקת כל צילום נוסף מתיק צילומים", "amount": 24},
            },
            # Tariff A of L0268 (locating and copying documents up to 10 pages) in each file read on checked_on.
            "history": [
                {"from": "2023-01-01", "L0268": 120, "url": _tariff_url("2023-01-01")},
                {"from": "2024-01-01", "L0268": 127, "url": _tariff_url("2024-01-01")},
                {"from": "2025-01-01", "L0268": 133, "url": _tariff_url("2025-01-01")},
                {"from": "2025-04-01", "L0268": 136, "url": _tariff_url("2025-04-01")},
                {"from": "2025-10-01", "L0268": 139, "url": _tariff_url("2025-10-01")},
                {"from": "2026-04-01", "L0268": 141, "url": _tariff_url("2026-04-01")},
                {"from": "2026-09-01", "L0268": 143, "url": _tariff_url("2026-09-01")},
                {"from": "2026-10-01", "L0268": 146, "url": _tariff_url("2026-10-01")},
            ],
        },
        "circular": {
            "he": "חוזר המנהל הכללי 9/2019: אמות מידה לניהול רשומת מטופל במערכת הבריאות",
            "short_he": "חוזר המנהל הכללי 9/2019",
            "url": CIRCULAR,
            "page_url": CIRCULAR_PAGE,
            "published": "2019-12-15",
            "from": "2021-01-10",
            "updated": "2024-07-10",
            "sections": {
                "who": "סעיף ג.3",
                "waiver_when": "סעיף ג.5",
                "waiver": "סעיף ג.6",
                "waiver_date": "סעיף ג.7",
                "oral": "סעיף ג.8",
                "self": "סעיף ג.9",
                "rep": "סעיף ג.10",
                "guardian": "סעיף ג.11",
                "deceased": "סעיף ג.12",
                "sensitive": "סעיף ג.14",
                "minor": "סעיף ג.16",
                "withhold": "סעיף ג.18",
                "original": "סעיף ג.20",
                "during": "סעיף ג.21",
                "publish": "סעיף ג.22",
                "retention": "פרק ד",
            },
            "self_he": "המטופל עצמו, אחרי הצגת תעודה מזהה עם תמונה (תעודת זהות, רישיון נהיגה או דרכון)",
            "no_phone_he": "אין מוסרים מידע רפואי בטלפון; בקשה בדואר או בדואר אלקטרוני, שבה אי אפשר לזהות פנים אל פנים, צריכה כתב ויתור על סודיות",
            "waiver_items": [
                "פרטי המבקש ופרטי הקשר איתו",
                "תאריך הבקשה",
                "פרטי המטופל: שם מלא, מספר זהות, שנת לידה, כתובת וטלפון",
                "סוג המידע שמותר למסור, והמוסדות שאליהם מופנה הוויתור",
                "שחרור מחובת הסודיות ומטענות בגין מסירת המידע",
                "הסייגים שהמטופל ביקש",
                "חתימת המטופל ותאריך",
                "חתימת עד (רופא, אחות, עורך דין, בעל מקצוע בריאות ברישיון, רשם רפואי, מורשה חתימה בבנק או סוכן ביטוח), או העתק תעודה מזהה של המטופל",
            ],
            "waiver_check_he": "המוסד בודק מקור או העתק מאושר, חתימה בעט, שהטופס מופנה אליו, ושהוא נחתם בפרק זמן סביר לפני הבקשה",
            "rep_he": "מיופה כוח יכול להיות כל מי שפונה בשם המטופל, אם המטופל נתן לו כתב ויתור על סודיות רפואית",
            "guardian_he": "אפוטרופוס לגוף מציג צו מינוי בתוקף (מקור או העתק מאושר) ותעודה מזהה; אפוטרופסות לרכוש בלבד אינה מספיקה",
            "minor_he": "אחד ההורים או אפוטרופוס שמונה לקטין חותם; די בהורה אחד, אלא אם ידוע שההורה השני מתנגד",
            "deceased_he": "ככלל המידע נמסר ליורשים, שמציגים אחד מאלה: צו ירושה, צו קיום צוואה, צו בית משפט, או תצהיר מאומת בפני עורך דין שהמבקש יורש ושאין יורשים אחרים או שכולם מסכימים",
            "deceased_court_he": "אם התצהיר סותר את הרשומה (למשל גירושין, סכסוך במשפחה, התנגדות של המנוח, יורש שאינו קרוב), נדרש צו מבית משפט",
            "sensitive_he": "מידע \"חסוי ביותר\" (בריאות הנפש, הפריה חוץ גופית, הפסקת הריון, גנטיקה, התמכרויות, אימוץ, תקיפה מינית ועוד) נמסר רק לפי כתב ויתור מיוחד ומפורש, בתאריך סמוך לבקשה",
            "original_he": "אין מוסרים רשומה מקורית; בהליך משפטי היא מוצגת לפי צו שיפוטי",
            "during_he": "בזמן האשפוז נמנעים ככל האפשר מצילום הרשומה, כי היא עוד לא שלמה, אלא לחוות דעת שנייה או מסיבה עניינית אחרת",
            "publish_he": "כל מוסד רפואי מפרסם באתר שלו את טופס הבקשה, את הדרכים לפנות ואת המסמכים הנדרשים, את זמן המענה לפנייה ואת התעריפים",
            "retention_he": "במוסדות המדינה ובבתי חולים של רשויות מקומיות חלים חוק הארכיונים ותקנותיו; במוסדות אחרים, תקנות בריאות העם (שמירת רשומות) ופרק ה' לחוק זכויות החולה",
        },
        # No law, regulation or circular read here sets a number of days to answer a request (circular 9/2019 C.22).
        "response": {
            "days": None,
            "section": "סעיף ג.22",
            "he": "אין בחוק, בתקנות או בחוזר המנהל הכללי מספר ימים למענה. החוזר מחייב כל מוסד לפרסם באתר שלו את זמן המענה לפנייה",
        },
        "retention": {
            "he": "תקנות בריאות העם (שמירת רשומות), התשל\"ז-1976",
            "url": RECORDS,
            "current_to": "2024-02-07",
            "section": "תקנה 4(א) והתוספת",
            "scope_he": "בית חולים (כמשמעותו בסעיף 24 לפקודת בריאות העם)",
            "state_section": "תקנה 4(ה)",
            "state_he": "תקנות משנה (א) עד (ג) של תקנה 4 לא חלות על בית חולים שהוא מוסד ממוסדות המדינה או של רשות מקומית",
            "doctor_section": "תקנה 4(ד)",
            "doctor_he": "רופא בבית החולים רשאי להורות לשמור רשומה מסוימת יותר זמן",
            "find_section": "תקנה 2",
            "find_he": "בית החולים אחראי להחזקת הרשומות כך שאפשר לאתר אותן בתוך זמן סביר",
            "transfer_section": "תקנה 3(ג)",
            "transfer_he": "ביקש אדם להעביר רשומה שנעשתה לגביו לבית חולים אחר, יורה הממונה להעביר אותה",
            "closed_section": "תקנה 3(ד)",
            "closed_he": "בית חולים שנסגר מעביר את הרשומות לבית חולים של המדינה",
            "rows": {
                "1": {"he": "תיק רפואי של חולה בבית חולים כללי (למעט מרפאת חוץ), למעט גליון סיכום מחלה", "years": 20, "after_he": "לאחר האשפוז או הטיפול האחרון", "no_summary_years": 25, "death_years": 7},
                "2": {"he": "תיק רפואי במרפאת חוץ של בית החולים", "years": 7, "after_he": "לאחר הטיפול האחרון"},
                "3": {"he": "גליון סיכום מחלה או מכתב סיכום לרופא המטפל", "years": 100, "after_he": ""},
                "6": {"he": "מסמכי חדר מיון", "years": 7, "after_he": ""},
                "7": {"he": "ספר בדיקות מעבדה", "years": 10, "after_he": "לאחר הרישום האחרון"},
                "8": {"he": "ספר ניתוחים", "years": 10, "after_he": "לאחר הרישום האחרון"},
                "9": {"he": "ספר הרופאים המרדימים", "years": 10, "after_he": "לאחר הרישום האחרון"},
                "10": {"he": "ספר לידות", "years": 100, "after_he": "לאחר הרישום האחרון"},
                "13": {"he": "צילום רנטגן, למעט הדוחות על הממצאים", "years": 10, "after_he": "מתום הטיפול האחרון בתיק הצילומים", "death_years": 7},
                "14": {"he": "תרשים במכון או במעבדה, ממצא פתולוגי", "years": 10, "after_he": ""},
                "15": {"he": "תרשים במכון או במעבדה, ממצא שלילי", "years": 2, "after_he": ""},
                "17": {"he": "ספר רפורטים של אחיות, רישום הוראות הרופאים", "years": 7, "after_he": "לאחר הרישום האחרון (הוראות שהועתקו לתיק: 30 יום לאחר ההעתקה)"},
                "18": {"he": "ספר מסירת משמרות של אחיות, דו\"ח על טיפולים", "years": 7, "after_he": "לאחר הרישום האחרון"},
            },
            "newborn": {
                "he": "חוזר מינהל הרפואה 21/2005: נוהל שמירת רשומה רפואית של היילוד",
                "url": NEWBORN_2005,
                "from": "2005-07-01",
                "years": 25,
                "death_years": 7,
                "rule_he": "מיום 1.7.2005 מנהלים רשומה נפרדת לתינוק מרגע הלידה, ושומרים אותה 25 שנה או 7 שנים לאחר הפטירה, לפי המוקדם",
                "mother_he": "חוזר מינהל הרפואה 42/2006: שמירת רשומה רפואית של היילוד",
                "mother_url": NEWBORN_2006,
                "mother_years": 25,
                "mother_rule_he": "מאחר שאפשר לתבוע על רשלנות בלידה גם אחרי 25 שנה, מומלץ לשמור גם את רשומת היולדת 25 שנים (המלצה, לא חובה בתקנות)",
            },
        },
        # Which row of the schedule holds each document a request names. A document that is filed in the patient's file
        # follows row 1; a register (ספר) or a separate chart follows its own row. CTG strips are not named in the schedule.
        "documents": {
            "all": {"he": "התיק הרפואי המלא", "rows": ["1", "3", "6", "13", "17"]},
            "adm": {"he": "גיליון קבלה ואנמנזה", "rows": ["1"]},
            "op": {"he": "דוח הניתוח", "rows": ["1", "8"]},
            "an": {"he": "רישום ההרדמה (גיליון הרדמה)", "rows": ["1", "9"]},
            "ct": {"he": "רישומי המוניטור בלידה (ניטור עוברי)", "rows": ["1", "14", "15"], "unnamed": True},
            "im": {"he": "בדיקות דימות, הפענוחים והתקליטורים", "rows": ["13", "1"]},
            "nu": {"he": "רישומי הסיעוד (גיליונות אחיות)", "rows": ["1", "17", "18"]},
            "co": {"he": "טופסי ההסכמה לטיפול", "rows": ["1"]},
            "lb": {"he": "תוצאות מעבדה", "rows": ["1", "7"]},
            "er": {"he": "גיליון חדר המיון", "rows": ["6"], "free": "summary"},
            "su": {"he": "מכתב השחרור וסיכום האשפוז", "rows": ["3"], "free": "summary"},
        },
        "capacity": {
            "he": "חוק הכשרות המשפטית והאפוטרופסות, התשכ\"ב-1962",
            "url": CAPACITY,
            "current_to": "2026-01-19",
            "minor_section": "סעיף 3",
            "minor_age": 18,
            "parents_section": "סעיף 14",
            "parents_he": "ההורים הם האפוטרופסים הטבעיים של ילדיהם הקטינים",
        },
        "complaints": {
            "nhi_he": "הגשת קבילה לפי חוק ביטוח בריאות ממלכתי (על קופת חולים או נותן שירות)",
            "nhi_url": COMPLAINT_NHI,
            "commission_he": "נציבות קבילות הציבור, משרד הבריאות",
            "commission_url": COMMISSION,
            "professions_he": "תלונה על בעלי מקצועות רפואיים",
            "professions_url": COMPLAINT_PROFESSIONS,
        },
        # Where a request is SENT (the bodies' own pages, read on checked_on). Never a source of a legal figure.
        "where": [
            {"code": "clalit", "he": "כללית: רשומות רפואיות מהתיק הרפואי", "kind": "hmo", "url": "https://www.clalit.co.il/he/myrights/fees/Pages/medical-records.aspx"},
            {"code": "maccabi", "he": "מכבי: מסירת מידע רפואי לחברים", "kind": "hmo", "url": "https://www.maccabi4u.co.il/eligibilites/3235/"},
            {"code": "sheba", "he": "שיבא: מחלקת רשומות ומידע רפואי", "kind": "hospital", "url": "https://www.sheba.co.il/general/clinics/medical-records-and-information"},
            {"code": "hadassah", "he": "הדסה: רשומות רפואיות", "kind": "hospital", "url": "https://he.hadassah.org.il/patient-information/hadassah-medical-records/"},
            {"code": "tasmc", "he": "איכילוב: רשומות רפואיות", "kind": "hospital", "url": "https://www.tasmc.org.il/service-info/service-info/medical-records/"},
        ],
    }
