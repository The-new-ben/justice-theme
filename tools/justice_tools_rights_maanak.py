"""The work-grant dataset of the co.il tools registry (the rights wave 2A, 22.10.2026, HAD-578): the maanak-avoda
instrument on /maanak-avoda/ (מענק עבודה, "מס הכנסה שלילי"). Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES)
through KEY and build().

Every value was read on checked_on from the official text named next to it: the Work Grant Law (חוק להגדלת שיעור
ההשתתפות בכוח העבודה ולצמצום פערים חברתיים (מענק עבודה), התשס"ח-2007) in its current version on Nevo, with the
indexation notice י"פ 14248 of 11.2.2026 (in force from 1.1.2026); the Israel Tax Authority's guides for tax years 2025 and
2024 on gov.il, its claim service, topic page, FAQ and press releases of 15.7.2026 and 2.9.2026; the Tax Authority PDF
guide "דע זכויותיך וחובותיך" 2025 and 2024 (appendix A).

Which year's amounts: the Tax Authority applies, for tax year X, the amounts indexed on 1 January of year X+1 (guide 2025:
"הסכומים נכונים לפי המדד הידוע ב-1.1.2026"). So the figures now printed in the law are the tax-year-2025 figures. For tax
year 2024 the Tax Authority published only the bands and the maxima, not the inner breakpoints; the tool checks the band
and leaves the exact 2024 amount to the official simulator. Tax year 2026 amounts are published after 1.1.2027.
Nothing here is estimated (open questions: parts/maanak/facts.md in the wave's scratch folder).
"""
from __future__ import annotations

KEY = "rights_maanak"

LAW = "https://www.nevo.co.il/law_html/law01/999_877.htm"                      # the law, current version, with the 11.2.2026 notice
TOPIC = "https://www.gov.il/he/departments/topics/work_grant"                  # רשות המסים: מענק עבודה (דף הנושא)
SERVICE = "https://www.gov.il/he/service/submitting-an-online-claim-for-job-grant"  # הגשת בקשה מקוונת למענק עבודה
CLAIM = "https://secapp.taxes.gov.il/gmMhsBakasha/"                            # the online claim (personal area)
GUIDE_2025 = "https://www.gov.il/he/pages/work-grant-guide-2025"               # מדריך מענק עבודה לשנת המס 2025
GUIDE_2024 = "https://www.gov.il/he/pages/work-grant-guide-2024"               # מדריך מענק עבודה לשנת המס 2024
PDF_2025 = "https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf"
PDF_2024 = "https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2024.pdf"
FAQ = "https://www.gov.il/he/Departments/DynamicCollectors/shelot-vetshuvot-taxes2?skip=0&subject=06"
SIMULATOR = "https://www.misim.gov.il/shmaanakavoda/frmFirst.aspx"             # the Tax Authority simulator (2025, 2024)
ELIGIBILITY = "https://www.misim.gov.il/gmmhszakaut/"                          # בדיקת זכאות (from July, 5 tries per ID)
STATUS = "https://www.misim.gov.il/gmmhsberur/firstpage.aspx"                  # בירור סטטוס הבקשה
FORM_120 = "https://www.gov.il/he/service/itc-120"                             # ייפוי כוח
FORM_930 = "https://www.gov.il/he/service/itc930"                              # יורש חוקי
PRESS_JUL = "https://www.gov.il/he/pages/sa150726-4"                           # 15.7.2026: first installment for 2025
PRESS_SEP = "https://www.gov.il/he/pages/020926-1"                             # 2.9.2026: second installment brought forward


def build(checked_on: str) -> dict:
    """The work grant: who is eligible (age, children, single parent, real estate), the 2025 amounts with every band and
    rate of the law, the 2024 published bands, the claim window, the payment calendar and the objection."""
    k12 = {"floor": 2450, "p1": 4260, "p2": 5680, "ceiling": 7390, "base": 100, "rate_in": 16.1, "max": 390,
           "rate_out": 23, "extra_threshold": 1420, "published_top": 7289, "section": "סעיף 2(1)"}
    k3 = {"floor": 2450, "p1": 4260, "p2": 5680, "ceiling": 8100, "base": 140, "rate_in": 23.5, "max": 570,
          "rate_out": 23.5, "extra_threshold": 1420, "published_top": 8020, "section": "סעיף 2(2)"}
    return {
        "name_he": "מענק עבודה (מס הכנסה שלילי): שנות המס 2025 ו-2024",
        "publisher_he": "רשות המסים בישראל; חוק מענק עבודה, התשס\"ח-2007",
        "source_name": "חוק להגדלת שיעור ההשתתפות בכוח העבודה ולצמצום פערים חברתיים (מענק עבודה), התשס\"ח-2007, "
                       "בנוסח העדכני (הודעת עדכון מ-11.2.2026); מדריכי רשות המסים לשנות המס 2025 ו-2024",
        "source_url": GUIDE_2025,
        "checked_on": checked_on,
        "refresh_every_days": 90,
        "next_update": "2027-01-01",
        "law_he": "חוק להגדלת שיעור ההשתתפות בכוח העבודה ולצמצום פערים חברתיים (מענק עבודה), התשס\"ח-2007",
        "law_short_he": "חוק מענק עבודה",
        "law_url": LAW,
        "notice_he": "הודעת עדכון סכומים, ילקוט הפרסומים 14248 (11.2.2026), בתוקף מ-1.1.2026",
        "index_rule_he": "לשנת מס מסוימת חלים הסכומים המעודכנים ב-1 בינואר של השנה שאחריה; הסכומים מתעדכנים לפי המדד "
                         "ומעוגלים ל-10 ₪ (סעיף 8(א))",
        "index_section": "סעיף 8(א)",
        "claim_year": 2025,
        "years_open": [2025, 2024],
        "age": {"with_kids": 21, "no_kids": 55, "section": "סעיפים 1 ו-2",
                "he": "גיל 21 ומעלה להורה; גיל 55 ומעלה למי שאין לו ילדים (הגיל שמלאו בשנת המס)",
                "history_he": "עד 2021 הגיל היה 23; מ-1.1.2025 הגיל 21 קבוע בחוק (תיקון 20)"},
        "child_under": 19,
        "child_he": "ילד שטרם מלאו לו 19 בשנת המס (לשנת 2025: לא מלאו לו 19 עד 31.12.2025)",
        "toddler_under": 3,
        "toddler_he": "פעוט: ילד שטרם מלאו לו 3 במהלך שנת המס (שנת הלידה, השנה שבה מלאה לו שנה והשנה שבה מלאו לו שנתיים)",
        "single_he": "הורה יחיד: הילדים אצלו וכלכלתם עליו, הוא חי בנפרד מההורה השני ואין לו בן זוג, לרבות ידוע בציבור (סעיף 6ב(א))",
        "real_estate": {"section": "סעיף 3(א)(1)",
                        "he": "אין זכאות אם לעובד, לבן הזוג או לילד הסמוך על שולחנו יש, במועד כלשהו בשנת המס, זכות "
                              "במקרקעין בישראל או בחו\"ל שאינה דירת מגורים יחידה, וחלקם יחד עולה על 50%"},
        "work_income_he": "שכר עבודה (לא פנסיה), הכנסה מעסק או משלח יד, וגם דמי לידה, גמלת שמירת היריון ותגמולי מילואים. "
                          "חודש שבו שולמו דמי אבטלה אינו חודש עבודה (סעיף 1)",
        "extra_income_he": "הכנסה נוספת, כגון פנסיה או גמלת נפגעי עבודה, מקטינה את המענק (סעיף 4)",
        "relative_he": "חודש שבו ההכנסה היחידה היתה ממעסיק קרוב משפחה (או מחברה שבשליטתו) לא נספר (סעיף 2)",
        "months_he": "המענק = הסכום החודשי לפי ההכנסה החודשית הממוצעת בשנה, כפול מספר חודשי העבודה בפועל (חופשה, מחלה, "
                     "לידה ומילואים נספרים; חודשי דמי אבטלה לא)",
        "self_employed_he": "עצמאי זכאי באותם תנאים, בשינויים המחויבים, אם הגיש דוח שנתי; לא אם היה חייב בניהול ספרים ולא "
                            "ניהל, או שספריו נפסלו סופית (סעיפים 17 ו-17א). הכנסה מעסק נספרת אחרי ההוצאות המותרות",
        "adjusted_min_wage_he": "מי שנקבע לו שכר מינימום מותאם (עובד עם מוגבלות) זכאי בלי תנאי הגיל 55, והסכומים 2,450 "
                                "ו-4,260 מוכפלים במקדם (סעיף 6). המחשבון לא מחשב את המקדם: את הסכום המדויק נותן הסימולטור הרשמי",
        "parent_pct": 150,
        "parent_section": "סעיף 6א",
        "years": {
            "2025": {
                "status": "full",
                "index_he": "הסכומים לפי המדד הידוע ב-1.1.2026, כפי שהם מופיעים בחוק ובמדריך רשות המסים לשנת המס 2025",
                "guide_url": GUIDE_2025,
                "pdf_url": PDF_2025,
                "regular": {"k12": k12, "k3": k3},
                "spouse": {"base": 14210, "pivot": 5680, "cap": 1710, "rate_k12": 23, "rate_k3": 23.5, "section": "סעיף 5"},
                "spouse_toddler": {"base": 16180, "pivot": 5690, "cap": 3100, "section": "סעיף 6ב1(ב)"},
                "single": {
                    "k12": {"floor": 1510, "p1": 4260, "p2": 8000, "ceiling": 11190, "base": 100, "rate_in": 10.8,
                            "max": 390, "rate_out": 11.6, "extra_threshold": 3740, "section": "סעיף 6ב(א)(1)"},
                    "k3": {"floor": 1510, "p1": 4260, "p2": 8940, "ceiling": 13660, "base": 140, "rate_in": 15.5,
                           "max": 570, "rate_out": 11.6, "extra_threshold": 4680, "section": "סעיף 6ב(א)(2)"},
                    "pct": 150, "extra_section": "סעיף 6ב(ב)",
                },
                "toddler": {"floor": 2460, "p1": 4270, "rate_in": 28.3, "max": 500,
                            "k12": {"p2": 7390, "rate_out": 34.5, "published_top": 8781},
                            "k3": {"p2": 8100, "rate_out": 35.25, "published_top": 9462},
                            "section": "סעיף 6ב1(א)",
                            "he": "תוספת לכל פעוט, משולמת ב-100% (לא מוכפלת ב-150%); אפשר לקבל אותה גם כשההכנסה מעל התקרה הרגילה"},
                "single_toddler": {"floor": 1500, "p1": 4270, "rate_in": 18.7, "max": 500,
                                   "k12": {"p2": 8000, "end": 11190, "published_top": 11063},
                                   "k3": {"p2": 8950, "end": 13660, "published_top": 13474},
                                   "section": "סעיף 6ב2(א)"},
                "women60": {"born_from": 1960, "age_from": 60, "age_below": 67, "floor": 920, "p1": 4150, "p2": 6100,
                            "ceiling": 8930, "base": 140, "rate_in": 33.21, "max": 1210, "rate_out": 42,
                            "extra_threshold": 1950,
                            "spouse": {"base": 15210, "pivot_self": 6100, "cap_self": 2820, "pivot_spouse": 5510,
                                       "cap_spouse": 1650, "rate": 42},
                            "section": "סעיף 6ה",
                            "he": "עובדת שנולדה ב-1.1.1960 או אחריו, בגיל 60 ועד לפני 67 בשנת המס: מקבלת את הגבוה מבין המסלול "
                                  "הזה למסלול הרגיל (לא מוכפל ב-150%)"},
                "min_month": 20,
                "min_he": "סכום חודשי נמוך מ-20 ₪ אינו משולם (רשות המסים); בחוק: מענק כולל נמוך מ-20 ₪ (סעיף 3(ב))",
                "min_section": "סעיף 3(ב)",
                "single_payment_max": 950,
                "max_year": 10260,
                "max_year_he": "המענק המרבי בלי תוספת פעוטות: 10,260 ₪ בשנה (570 × 150% × 12)",
                "opens": "2026-01-01",
                "deadline_online": "2027-12-31",
                "deadline_post": "2026-12-26",
                "deadline_he": "בקשה מקוונת עד 31.12.2027; בסניפי הדואר עד 26.12.2026",
                "deadline_url": TOPIC,
                "paid_he": "התשלום הראשון לשנת 2025 שולם ב-16.7.2026; השני הוקדם ל-9.9.2026",
                "paid_url": PRESS_SEP,
            },
            "2024": {
                "status": "bands",
                "index_he": "הסכומים לפי המדד הידוע ב-1.1.2025 (מדריך רשות המסים לשנת המס 2024)",
                "guide_url": GUIDE_2024,
                "pdf_url": PDF_2024,
                "bands": {"k12": [2390, 7220], "k3": [2390, 7910], "single_k12": [1470, 10930],
                          "single_k3": [1470, 13340], "toddler_k12": [2400, 8582], "toddler_k3": [2400, 9243],
                          "women60": [900, 8720]},
                "toddler_max": 490,
                "max_year": 10080,
                "single_payment_max": 930,
                "opens": "2025-01-01",
                "deadline_online": "2026-12-31",
                "deadline_he": "בקשה מקוונת עד 31.12.2026",
                "deadline_url": FAQ,
                "inner_he": "רשות המסים פרסמה לשנת 2024 את טווחי ההכנסה ואת המקסימום בלבד; את הסכום המדויק נותן הסימולטור הרשמי",
            },
        },
        "next_year_he": "על שנת המס 2026 מגישים מ-1.1.2027 ועד 31.12.2028; הסכומים יפורסמו בעדכון של 1.1.2027",
        "advance_he": "עובדת שכירה בת 60 עד 66 שהגישה בקשה חד-פעמית מקבלת 75% מהמענק של 2026 מראש, ברבעונים, והיתרה עד 15.7.2027 (סעיף 6ה(ה)-(ו))",
        "payments": {
            "section": "סעיף 12",
            "rows": [
                {"filed_by": "06-30", "dates": ["07-15", "10-15", "12-15", "+02-15"]},
                {"filed_by": "09-30", "dates": ["10-15", "12-15", "+02-15"]},
                {"filed_by": "11-30", "dates": ["12-15", "+02-15"]},
            ],
            "he": "המענק משולם בתשלומים שווים לפי מועד ההגשה: עד 30.6 ארבעה (15.7, 15.10, 15.12, 15.2), עד 30.9 שלושה, "
                  "עד 30.11 שניים (15.12, 15.2). מענק קטן מהסכום לתשלום אחד משולם בבת אחת במועד הראשון",
            "late_he": "לבקשה שהוגשה אחרי 30.11 של השנה שאחרי שנת המס אין לוח תשלומים מפורסם; ההחלטה ניתנת תוך 90 יום (סעיף 9)",
            "url": GUIDE_2025,
        },
        "decision": {"days": 90, "section": "סעיף 9",
                     "he": "החלטה תוך 90 יום מהבקשה או עד 15 ביולי של השנה שאחרי שנת המס, המאוחר מביניהם"},
        "objection": {"days": 30, "section": "סעיפים 10 ו-11",
                      "he": "השגה מנומקת בכתב לפקיד השומה תוך 30 יום מקבלת ההחלטה; אם לא הוחלט בה תוך 90 יום היא מתקבלת; "
                            "על ההחלטה בהשגה מערערים לבית המשפט המחוזי"},
        "not_income": {"section": "סעיף 16", "he": "המענק אינו הכנסה לעניין מס הכנסה, ביטוח לאומי, הבטחת הכנסה ודמי "
                                                 "ביטוח בריאות, ואי אפשר לעקל אותו, למעט מזונות שנפסקו (סעיף 16)"},
        "false_he": "בקשה כוזבת: עד שנת מאסר, ושלילת המענק לאותה שנה ולשנתיים שאחריה (סעיף 15)",
        "requires_he": "המעסיק דיווח על השכר (טופס 126/856) עד 30.4 של השנה שאחרי שנת המס, ומי שחייב בדוח שנתי (הוא או בן "
                       "הזוג) הגיש אותו (סעיף 7)",
        "claim_url": CLAIM,
        "service_url": SERVICE,
        "topic_url": TOPIC,
        "faq_url": FAQ,
        "simulator_url": SIMULATOR,
        "eligibility_url": ELIGIBILITY,
        "status_url": STATUS,
        "form_120_url": FORM_120,
        "form_930_url": FORM_930,
        "press_jul_url": PRESS_JUL,
        "press_sep_url": PRESS_SEP,
        "post_he": "בסניפי הדואר: עם תעודה מזהה וצ'ק או אישור בנק על חשבון על שמכם, לשנה האחרונה בלבד",
    }
