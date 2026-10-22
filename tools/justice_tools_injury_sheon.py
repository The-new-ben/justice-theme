"""The injured person's clock (shaon-nezikin) on /tort-lawyer/: the road-accident and personal-injury wave (22.10.2026,
HAD-591). Discovered by tools/justice_tools_injury.py (glob), built with --injury-checked-on.

What this file adds, and what it does NOT repeat: the 7-year limitation (Limitation Law s.5(1)), the age of 18 (s.10),
the war window of s.15A (7.10.2023-6.4.2024), the rest-day rule (Interpretation Law s.10(c)) and the listed Independence
days, the 60 days of interim payments (Road Accident Victims Compensation Law s.5(b)), the lawyer's fee caps (8/11/13% and
VAT), Karnit (s.12) and the National Insurance deduction (s.328A) stay in reg.car_accident and are read from there. The
small-claims ceiling (39,900 from 1.1.2026) and the magistrates' court amount (2,500,000, Courts Law s.51(a)(2)) stay in
reg.small_claims. Here: the other sections of the Limitation Law the clock uses (ss.6-9, 11, 16, 18A, 19, 27), the Civil
Wrongs Ordinance (s.89 the day the cause of action arises and the 10-year cap on late-discovered damage; ss.23, 35, 41A-41B,
68, 78, 88), the Insurance Contract Law (ss.22-24, 27-28, 31, 31A, 68, 70), the road-accident sections who-pays needs (ss.2,
3, 5A, 5E(b), 6B, 8), the Motor Vehicle Insurance Ordinance s.3(a)(2), the Road Traffic Regulations reg.144 (the driver's
duties after an accident with a casualty), the police online report service, the National Insurance Law s.296 (12 months to
claim), the work-injury and accident-allowance periods and appeal deadlines from btl.gov.il, the Labor Court Law s.24, the
Patient's Rights Law s.18 and the Ministry of Education's student accident policy for 2026-27.

Every value was read on checked_on from the official text named next to it (Nevo's consolidated texts, the Institute's
Laws1 PDFs and pages, gov.il). Nothing here is estimated; a figure the sources do not hold is not in the file. Medical
malpractice is out of scope (its own rules): this file holds no clock for it.
"""
from __future__ import annotations

KEY = "injury_sheon"

LIMITATION_LAW = "https://www.nevo.co.il/law_html/law00/71809.htm"   # חוק ההתיישנות, התשי"ח-1958 (נוסח ל-21.7.2026)
TORTS = "https://www.nevo.co.il/law_html/law00/73015.htm"            # פקודת הנזיקין [נוסח חדש] (נוסח ל-18.9.2023)
INSURANCE = "https://www.nevo.co.il/law_html/law00/71902.htm"        # חוק חוזה הביטוח, התשמ"א-1981 (נוסח ל-23.6.2025)
ROAD = "https://www.nevo.co.il/law_html/law00/4554.htm"              # חוק פיצויים לנפגעי תאונות דרכים (נוסח ל-14.8.2025)
MOTOR = "https://www.nevo.co.il/law_html/law00/74501.htm"            # פקודת ביטוח רכב מנועי [נוסח חדש] (נוסח ל-1.1.2025)
TRAFFIC_REGS = "https://www.nevo.co.il/law_html/law01/p230_011.htm"  # תקנות התעבורה, התשכ"א-1961
COURTS = "https://www.nevo.co.il/law_html/law00/74849.htm"           # חוק בתי המשפט [נוסח משולב] (נוסח ל-1.9.2026)
LABOR_COURT = "https://www.nevo.co.il/law_html/law01/042_001.htm"    # חוק בית הדין לעבודה, התשכ"ט-1969 (נוסח ל-3.1.2025)
PATIENT = "https://www.nevo.co.il/law_html/law00/71833.htm"          # חוק זכויות החולה, התשנ"ו-1996 (נוסח ל-6.4.2025)
NI_CH5 = "https://www.btl.gov.il/Laws1/00_0001_000005.pdf"           # חוק הביטוח הלאומי, פרק ה': ביטוח נפגעי עבודה
NI_CH14 = "https://www.btl.gov.il/Laws1/00_0001_000014.pdf"          # חוק הביטוח הלאומי, פרק י"ד: גמלאות, הוראות כלליות
BTL = "https://www.btl.gov.il"
WORK_MAIN = BTL + "/benefits/Work_Injury/Pages/default.aspx"
WORK_DISABILITY_CLAIM = BTL + "/benefits/Work_Injury/Work_injury_benefit/Pages/%d7%90%d7%95%d7%a4%d7%9f%20%d7%94%d7%92%d7%a9%d7%aa%20%d7%94%d7%aa%d7%91%d7%99%d7%a2%d7%94.aspx"
WORK_MEDICAL_APPEAL = BTL + "/benefits/Work_Injury/Work_injury_benefit/Pages/%d7%a2%d7%a8%d7%a8%20%d7%a2%d7%9c%20%d7%94%d7%97%d7%9c%d7%98%d7%aa%20%d7%94%d7%95%d7%95%d7%a2%d7%93%d7%94%20%d7%94%d7%a8%d7%a4%d7%95%d7%90%d7%99%d7%aa.aspx"
APPEAL_BASE = BTL + "/benefits/%d7%a2%d7%a8%d7%a2%d7%95%d7%a8%20%d7%a2%d7%9c%20%d7%94%d7%97%d7%9c%d7%98%d7%95%d7%aa%20%d7%94%d7%9e%d7%95%d7%a1%d7%93%20%d7%9c%d7%91%d7%99%d7%98%d7%95%d7%97%20%d7%9c%d7%90%d7%95%d7%9e%d7%99/Pages"
APPEAL_COMMITTEE = APPEAL_BASE + "/vadatviot.aspx"
APPEAL_COURT = APPEAL_BASE + "/%d7%91%d7%aa%d7%99%20%d7%94%d7%93%d7%99%d7%9f%20%d7%94%d7%90%d7%96%d7%95%d7%a8%d7%99%d7%99%d7%9d%20%d7%9c%d7%a2%d7%91%d7%95%d7%93%d7%94.aspx"
ACCIDENT_MAIN = BTL + "/benefits/Accident_Injury/Pages/default.aspx"
ACCIDENT_CONDITIONS = BTL + "/benefits/Accident_Injury/Pages/%d7%aa%d7%a0%d7%90%d7%99%20%d7%96%d7%9b%d7%90%d7%95%d7%aa.aspx"
ACCIDENT_CLAIM = BTL + "/benefits/Accident_Injury/Pages/%d7%90%d7%95%d7%a4%d7%9f%20%d7%94%d7%92%d7%a9%d7%aa%20%d7%94%d7%aa%d7%91%d7%99%d7%a2%d7%94.aspx"
ACCIDENT_DAYS = BTL + "/benefits/Accident_Injury/Pages/%d7%aa%d7%a7%d7%95%d7%a4%d7%aa%20%d7%94%d7%96%d7%9b%d7%90%d7%95%d7%aa%20%d7%94%d7%9e%d7%a8%d7%91%d7%99%d7%aa.aspx"
FEE_CAP = BTL + "/benefits/Work_Injury/Pages/SHAR-TIRHA.aspx"
POLICE_REPORT = "https://www.gov.il/he/service/traffic-accident-notice"   # משטרת ישראל, עודכן 25.6.2026
MOE_POLICY = "https://meyda.education.gov.il/files/bituach/Personal-accidents/insurance_policy_2026-27.pdf"


def build(checked_on: str) -> dict:
    """The injured person's clock: who pays, the first 30 days, the limitation dates and the deadlines the law sets."""
    return {
        "name_he": "השעון של הנפגע: מי משלם, 30 הימים הראשונים, ההתיישנות והמועדים",
        "publisher_he": "חוק ההתיישנות, פקודת הנזיקין, חוק חוזה הביטוח, חוק הפיצויים לנפגעי תאונות דרכים, חוק הביטוח הלאומי, "
                        "חוק בתי המשפט, תקנות התעבורה, המוסד לביטוח לאומי ומשטרת ישראל",
        "source_name": "חוק ההתיישנות, התשי\"ח-1958 (נוסח עדכני)",
        "source_url": LIMITATION_LAW,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        # Limitation Law: what reg.car_accident.limitation does not hold (it holds 7 years, s.5(1), 18, s.10, the war window).
        "limitation": {
            "he": "חוק ההתיישנות, התשי\"ח-1958",
            "url": LIMITATION_LAW,
            "current_to": "2026-07-21",
            "start_section": "סעיף 6",
            "start_he": "תקופת ההתיישנות מתחילה ביום שבו נולדה עילת התובענה",
            "late_section": "סעיף 8",
            "late_he": "נעלמו מהתובע העובדות שמהוות את העילה, מסיבות שלא היו תלויות בו ושגם בזהירות סבירה לא יכול היה למנוע, ההתיישנות מתחילה ביום שבו נודעו לו",
            "misconduct_section": "סעיף 7",
            "misconduct_he": "המרוץ מושעה כל עוד התובע לא תבע כי הנתבע או מי מטעמו הטעה אותו ביודעין, הפעיל נגדו כוח, איים עליו או ניצל את מצוקתו",
            "admission_section": "סעיף 9",
            "admission_he": "הודאה של הנתבע בכתב או לפני בית משפט בקיום הזכות, או ביצוע מקצתה (למשל תשלום), מתחילה את ההתיישנות מחדש מיום ההודאה",
            "incapacity_section": "סעיף 11",
            "incapacity_he": "לא נספר הזמן שבו התובע לא היה מסוגל לדאוג לענייניו מחמת ליקוי נפשי או שכלי ולא היה לו אפוטרופוס",
            "after_stay_section": "סעיף 16",
            "after_stay_years": 1,
            "after_stay_he": "אחרי עיכוב לפי סעיפים 10 ו-12 עד 15, התקופה לא מסתיימת לפני שעברה לפחות שנה מהיום שבו חדל העיכוב (שנתיים אחרי עיכוב לפי סעיף 11)",
            "sexual_section": "סעיף 18א",
            "sexual_age": 28,
            "sexual_he": "בתביעה בשל תקיפה מינית בקטין, התעללות בקטין בידי בן משפחה או אחראי, או תקיפה מינית לפני גיל 21 תוך ניצול יחסי אמון או מרות: לא נספר הזמן עד גיל 28",
            "agreed_section": "סעיף 19",
            "agreed_min_months": 6,
            "agreed_he": "אפשר להסכים בחוזה נפרד בכתב על תקופה ארוכה יותר, או (שלא במקרקעין) קצרה יותר אבל לא פחות משישה חודשים",
            "other_laws_section": "סעיף 27",
            "other_laws_he": "החוק לא פוגע בתקופת התיישנות שנקבעה בדין אחר, כמו 3 השנים של חוק חוזה הביטוח",
            "war_section": "סעיף 15א",
            "war_other_laws_section": "סעיף 15א(ה)",
            "war_he": "בתביעה שהתקופה שלה לא הסתיימה ערב תחילת תיקון מס' 8 (חרבות ברזל, 2024), לא נספרים הימים מ-7.10.2023 עד 6.4.2024; הכלל חל גם על התיישנות שנקבעה בחוק אחר",
            "war_ended_section": "סעיף 15א(ג)-(ד)",
            "war_ended_he": "תקופה שהסתיימה בין 7.10.2023 לערב תחילת התיקון רואים כאילו טרם הסתיימה, אבל בית המשפט רשאי מטעמים מיוחדים לקבוע שזה לא יחול",
            "amendment_year": 2024,
        },
        # Civil Wrongs Ordinance [New Version]: when a tort claim "arises", and the torts the clock names.
        "torts": {
            "he": "פקודת הנזיקין [נוסח חדש]",
            "url": TORTS,
            "current_to": "2023-09-18",
            "start_section": "סעיף 89",
            "act_he": "כשהעילה היא מעשה או מחדל: היום שבו אירעו (ואם נמשכו, היום שבו חדלו)",
            "damage_he": "כשהעילה היא נזק: היום שבו אירע הנזק; נזק שלא התגלה ביום שאירע: היום שבו התגלה, אבל התביעה מתיישנת אם לא הוגשה בתוך עשר שנים מיום אירוע הנזק",
            "late_cap_years": 10,
            "late_cap_section": "סעיף 89(2)",
            "road_applies_section": "סעיף 4(א)",
            "road_applies_he": "על פיצוי נפגע תאונת דרכים חלים סעיפים 19 עד 22, 76 עד 83, 86, 88 ו-89 לפקודת הנזיקין (סעיף 4(א) לחוק הפיצויים)",
            "negligence_section": "סעיף 35",
            "negligence_he": "מי שהתרשל כלפי מי שהיה חייב להיזהר כלפיו וגרם לו נזק, עושה עוולה של רשלנות",
            "assault_section": "סעיף 23",
            "assault_he": "תקיפה היא שימוש בכוח במתכוון נגד גופו של אדם בלי הסכמתו, וגם ניסיון או איום כזה",
            "dog_section": "סעיף 41א",
            "dog_he": "בעל הכלב או מי שמחזיק בו דרך קבע חייב לפצות על נזק גוף שגרם הכלב, גם בלי התרשלות",
            "dog_defences_section": "סעיף 41ב",
            "dog_defences_he": "ההגנות היחידות: התגרות של הניזוק בכלב, תקיפת הבעלים או בני משפחתם בידי הניזוק, או הסגת גבול שלו במקרקעי הבעלים",
            "crime_section": "סעיף 88",
            "crime_he": "כשהעובדות הן גם עבירה פלילית, זה לא חוסם את התביעה האזרחית; אם הן עשויות להיות פשע, בית המשפט מעכב את ההליך עד שהמשטרה יודעת עליהן",
            "death_section": "סעיף 78",
            "death_he": "עוולה שגרמה למות אדם: בן הזוג, ההורה והילד זכאים לפיצויים מהאחראי",
            "child_section": "סעיף 9(ב)",
            "child_he": "קטין יכול לתבוע על עוולה",
        },
        # Insurance Contract Law 1981: one's own policy (personal accident, health) and a liability policy of the wrongdoer.
        "insurance": {
            "he": "חוק חוזה הביטוח, התשמ\"א-1981",
            "url": INSURANCE,
            "current_to": "2025-06-23",
            "notice_section": "סעיף 22",
            "notice_he": "קרה מקרה הביטוח: המבוטח מודיע למבטח מיד לאחר שנודע לו",
            "docs_section": "סעיף 23(ב)",
            "docs_he": "המבוטח מוסר למבטח בתוך זמן סביר אחרי שנדרש את המידע והמסמכים הדרושים לבירור החבות",
            "late_section": "סעיף 24",
            "late_he": "הודעה מאוחרת פוגעת בתגמולים רק במידה שהיה בה כדי לאפשר למבטח להקטין את חבותו, ולא כשהאיחור מוצדק או לא הכביד על הבירור",
            "pay_section": "סעיף 27",
            "pay_days": 30,
            "pay_he": "התגמולים משולמים בתוך 30 ימים מהיום שבו היו בידי המבטח המידע והמסמכים הדרושים; חלק שאינו שנוי במחלוקת בתום לב, בתוך 30 ימים ממסירת התביעה",
            "interest_section": "סעיף 28(א)",
            "interest_he": "על התגמולים מתווספים הפרשי הצמדה מיום מקרה הביטוח, וריבית צמודה מתום 30 ימים ממסירת התביעה",
            "limit_section": "סעיף 31",
            "limit_years": 3,
            "limit_long_years": 5,
            "limit_long_he": "ביטוח חיים, ביטוח מפני מחלות ואשפוז וביטוח סיעודי",
            "limit_he": "התיישנות של תביעה לתגמולי ביטוח: 3 שנים מיום מקרה הביטוח; בביטוח חיים, מחלות ואשפוז וביטוח סיעודי: 5 שנים",
            "limit_disability_he": "כשהעילה היא נכות ממחלה או מתאונה, התקופה נמנית מהיום שבו קמה הזכות לתבוע לפי תנאי הפוליסה",
            "limit_not_stopped_he": "מסירת התביעה למבטח לא עוצרת את מרוץ ההתיישנות",
            "warn_section": "סעיף 31א(ב)",
            "warn_months": [12, 3],
            "warn_he": "מבוטח שהודיע על המקרה: המבטח חייב להתריע בכתב 12 חודשים ושלושה חודשים לפני סוף ההתיישנות, גם כשמתנהל משא ומתן",
            "third_party_section": "סעיף 68",
            "third_party_he": "בביטוח אחריות (של בעל העסק, הרשות, המעסיק), הנפגע רשאי לדרוש שהמבטח ישלם לו ישירות את התגמולים שהמבטח חייב למבוטח",
            "liability_section": "סעיף 70",
            "liability_he": "בביטוח אחריות, תביעת המבוטח נגד המבטח לא מתיישנת כל עוד לא התיישנה תביעת הנפגע נגד המבוטח",
        },
        # Road Accident Victims Compensation Law 1975: the sections who-pays uses (reg.car_accident holds the rest).
        "road": {
            "he": "חוק פיצויים לנפגעי תאונות דרכים, התשל\"ה-1975",
            "url": ROAD,
            "current_to": "2025-08-14",
            "user_section": "סעיף 2(א)",
            "user_he": "המשתמש ברכב מנועי חייב לפצות את הנפגע על נזק גוף בתאונת דרכים שבה מעורב הרכב, בלי קשר לאשם (סעיף 2(ג))",
            "passengers_section": "סעיף 3(א)",
            "passengers_he": "בתאונה של כמה כלי רכב, כל נוהג אחראי לנזקי הגוף של מי שנסע בכלי הרכב שלו",
            "outside_section": "סעיף 3(ב)",
            "outside_he": "מי שנפגע מחוץ לכלי הרכב בתאונה של כמה כלי רכב: הנוהגים חייבים כלפיו יחד ולחוד",
            "driver_policy_he": "פקודת ביטוח רכב מנועי [נוסח חדש], התש\"ל-1970",
            "driver_policy_url": MOTOR,
            "driver_policy_section": "סעיף 3(א)(2)",
            "driver_policy_text_he": "ביטוח החובה מכסה גם את בעל הרכב והנוהג בו בהיתר מפני נזק גוף שנגרם להם בתאונת דרכים",
            "interim_court_section": "סעיף 5א(א)",
            "interim_court_he": "עברו 60 ימים מהדרישה בכתב והתשלום התכוף לא שולם: אפשר לבקש אותו מבית משפט השלום, גם לפני התביעה העיקרית (סעיף 5א(ב))",
            "interim_max_section": "סעיף 5ה(ב)",
            "interim_max_years": 2,
            "interim_max_he": "בית המשפט לא פוסק תשלום תכוף בעד תקופה של יותר משנתיים מיום התאונה",
            "interim_late_section": "סעיף 5ד",
            "interim_late_pct": 12,
            "interim_late_he": "מי שלא שילם תשלום תכוף במועד משלם הפרשי הצמדה וריבית צמודה של 12% לשנה, אלא אם בית המשפט קבע שיעור נמוך יותר",
            "binding_section": "סעיף 6ב",
            "binding_he": "דרגת נכות שנקבעה לפי כל דין (למשל בוועדה רפואית של הביטוח הלאומי) לפני שמיעת הראיות מחייבת גם בתביעה לפי החוק, אלא אם בית המשפט התיר לסתור אותה",
            "exclusive_section": "סעיף 8(א)",
            "exclusive_he": "מי שיש לו עילה לפי חוק הפיצויים לא תובע על נזק הגוף לפי פקודת הנזיקין, אלא אם נפגע בתאונה שאדם אחר גרם במתכוון",
            "health_section": "סעיף 2(ב1)",
            "health_he": "שירותי בריאות שבסל לתושב ניתנים מקופת החולים לפי חוק ביטוח בריאות ממלכתי, ולא מהמבטח (חוץ מזכאים לגמלה לפי פרק ה' לחוק הביטוח הלאומי ומקרים שבסעיף)",
        },
        # Road Traffic Regulations 1961, reg.144 (an accident with a casualty) and the police's online report.
        "traffic": {
            "he": "תקנות התעבורה, התשכ\"א-1961",
            "url": TRAFFIC_REGS,
            "section": "תקנה 144(א)",
            "stop_he": "נוהג רכב המעורב בתאונה שבה נהרג או נפגע אדם: עוצר מיד, מגיש עזרה, מזעיק אמבולנס ומשטרה לפי הצורך וממתין לשירותי ההצלה (תקנה 144(א)(1)-(2))",
            "details_section": "תקנה 144(א)(3)",
            "details_he": "הנוהג מוסר לשוטר, לנפגע או למי שהיה איתו את שמו ומענו, מספר רישיון הנהיגה, מספר הרכב ושם בעליו, ומציג את תעודת הביטוח",
            "police_section": "תקנה 144(א)(4)",
            "police_he": "הנוהג מודיע מיד ככל האפשר, בדרך המהירה ביותר, לתחנת המשטרה הקרובה",
            "property_section": "תקנה 145(ג)(2)",
            "property_hours": 24,
            "property_he": "נזק לרכב חונה בלי השגחה או לרכוש בלי בעליו: הודעה למשטרה בתוך 24 שעות",
            "report_he": "דיווח מקוון למשטרה על תאונת דרכים קלה",
            "report_url": POLICE_REPORT,
            "report_updated": "2026-06-25",
            "report_hours": 24,
            "report_days": 10,
            "report_when_he": "אפשר לדווח באתר כשאין נפגעים, או כשהנפגעים טופלו ושוחררו ממוסד רפואי בתוך 24 שעות; אחרת במוקד 110 או בתחנת משטרה",
            "report_why_he": "לפי המשטרה, האישור תנאי להגשת תביעה לחברות הביטוח ולהכרה בטיפול הרפואי כטיפול בעקבות תאונה; בתאונת עבודה מציגים אותו גם לביטוח הלאומי",
            "report_medical_he": "דיווח בלי מסמכים רפואיים מסווג כתאונת נזק בלבד",
        },
        # National Insurance: the claim period (s.296), work injury (chapter 5 + btl), the accident allowance, appeals.
        "nii": {
            "he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995",
            "claim_url": NI_CH14,
            "claim_section": "סעיף 296(א)",
            "claim_months": 12,
            "claim_he": "כל תביעה לגמלת כסף מוגשת בתוך 12 חודשים מהיום שבו נוצרה עילת התביעה",
            "late_section": "סעיף 296(ב)(1)",
            "late_months": 12,
            "late_grant_months": 18,
            "late_he": "תביעה מאוחרת: הגמלה משולמת לכל היותר בעד 12 החודשים שלפני החודש שבו הוגשה; מענק, רק אם לא עברו 18 חודשים מהחודש שבו נוצרו התנאים",
            "work": {
                "url": NI_CH5,
                "page_url": WORK_MAIN,
                "weeks": 13,
                "weeks_section": "סעיף 92(ב)",
                "days": 91,
                "days_he": "דמי פגיעה משולמים על סמך אישורים רפואיים לתקופה של עד 91 ימים מיום הפגיעה",
                "injury_day_section": "סעיף 93(א)",
                "injury_day_he": "בעד יום הפגיעה לא משולמים דמי פגיעה, והמעסיק משלם לנפגע את שכר אותו יום",
                "first_days": 12,
                "first_days_section": "סעיף 94",
                "first_days_he": "בעד 12 הימים הראשונים המעסיק מחזיר למוסד את דמי הפגיעה ששולמו לעובד",
                "form_employer": "בל/250",
                "form_self": "בל/283",
                "form_claim": "211",
                "form_employer_claim": "בל/284",
                "forms_he": "שכיר: המעסיק מפנה לטיפול רפואי בטופס בל/250; עצמאי: טופס בל/283; התביעה לדמי פגיעה (טופס 211) עם טופס בל/284 מהמעסיק ומסמכים רפואיים",
                "disability_claim_url": WORK_DISABILITY_CLAIM,
                "disability_claim_months": 12,
                "disability_claim_he": "תביעה לגמלת נכות מעבודה מגישים בתוך 12 חודשים ממועד הפגיעה; רצוי סמוך לסוף תקופת דמי הפגיעה",
                "medical_appeal_url": WORK_MEDICAL_APPEAL,
                "medical_appeal_days": 30,
                "medical_reasons_days": 30,
                "medical_appeal_he": "ערר על החלטת הוועדה הרפואית מדרג ראשון: בכתב ובנימוקים, בתוך 30 ימים מקבלת ההודעה; ערר בלי נימוקים: עוד 30 ימים לנימוקים",
                "court_days": 60,
                "court_he": "על החלטת הוועדה הרפואית לעררים: ערעור בשאלה משפטית בלבד לבית הדין האזורי לעבודה, בתוך 60 ימים מקבלת ההודעה",
                "changes": [
                    {"from": "2002-02-01", "section": "סעיף 92(ב)", "he": "התקופה המרבית של דמי פגיעה קוצרה מ-26 שבועות ל-13 שבועות (תיקון 47)"},
                    {"from": "2005-04-01", "section": "סעיף 94", "he": "תקופת הזכאות הראשונה שהמעסיק נושא בה הוארכה מ-9 ל-12 ימים (תיקון 79)"},
                ],
            },
            "accident": {
                "url": ACCIDENT_MAIN,
                "conditions_url": ACCIDENT_CONDITIONS,
                "claim_url": ACCIDENT_CLAIM,
                "days_url": ACCIDENT_DAYS,
                "min_age": 18,
                "exam_hours": 72,
                "exam_late_days": 14,
                "exam_he": "בדיקה רפואית בתוך 72 שעות משעת התאונה; נזק שהתגלה רק בתוך שבועיים מהתאונה נבדק לגופו",
                "claim_days": 90,
                "claim_he": "תביעה לדמי תאונה מגישים בתוך 90 ימים מיום התאונה; איחור בגלל אשפוז, שהות בחוץ לארץ וכדומה נבדק לגופו",
                "max_days": 90,
                "max_he": "דמי תאונה משולמים לכל היותר 90 ימים רצופים מהיום שאחרי התאונה, ולא יותר מ-90 ימים בשנה קלנדרית",
                "worker_from_day": 3,
                "nonworker_from_day": 15,
                "who_he": "שכיר, עצמאי, מי שאינו עובד ועקרת בית, מגיל 18 עד גיל הפרישה, שנפגעו בתאונה שאינה תאונת דרכים ואינה תאונת עבודה (בבית, בפנאי, בחופשה)",
                "not_with_he": "מי שזכאי לתשלום מגורם אחר על אותם ימים (דמי מחלה, חוק הפיצויים) לא מקבל דמי תאונה; פיצוי מביטוח תאונות אישיות פרטי לא פוגע בזכאות",
            },
            "appeal": {
                "committee_url": APPEAL_COMMITTEE,
                "committee_months": 6,
                "committee_form": "בל/910",
                "committee_he": "פנייה לוועדת התביעות (טופס בל/910) לבדיקה מחודשת של החלטת פקיד התביעות: בתוך 6 חודשים מתאריך מכתב הדחייה; היא לא עוצרת את המועד לבית הדין",
                "court_url": APPEAL_COURT,
                "court_months": 12,
                "court_he": "תביעה לבית הדין האזורי לעבודה על החלטת הביטוח הלאומי: בתוך 12 חודשים מיום שנמסרה ההחלטה",
                "legal_aid_he": "מי שמערער לבית הדין יכול לבקש סיוע משפטי בחינם מהלשכות לסיוע משפטי של משרד המשפטים",
            },
            "fee_url": FEE_CAP,
            "fee_he": "החוק מגביל את שכר הטרחה של מייצג (עורך דין, חברה למיצוי זכויות) בתביעות לביטוח הלאומי, ובהן תאונות עבודה; ייעוץ והכנה לוועדות רפואיות ניתנים חינם במרכזי יד מכוונת",
        },
        # Which court: the Courts Law (the amount is read from reg.small_claims) and the Labor Court Law s.24.
        "courts": {
            "he": "חוק בתי המשפט [נוסח משולב], התשמ\"ד-1984",
            "url": COURTS,
            "current_to": "2026-09-01",
            "magistrate_he": "תביעה אזרחית שסכומה ביום הגשתה עד הסכום שבסעיף 51(א)(2): בית משפט השלום, גם אם הסכום עלה אחר כך בגלל הצמדה, ריבית או הוצאות",
            "raise_section": "סעיף 51(ב)",
            "raise_he": "הסכום לא צמוד למדד: שר המשפטים רשאי להגדילו בצו",
            "district_he": "מעל הסכום: בית המשפט המחוזי (סעיף 40(1))",
            "labor_he": "חוק בית הדין לעבודה, התשכ\"ט-1969",
            "labor_url": LABOR_COURT,
            "labor_current_to": "2025-01-03",
            "labor_nii_section": "סעיף 24(א)(5)",
            "labor_nii_he": "תביעות נגד הביטוח הלאומי נדונות בבית הדין האזורי לעבודה",
            "labor_tort_section": "סעיף 24(א)(1)",
            "labor_tort_he": "תביעת נזיקין של עובד נגד המעסיק (לפי פקודת הנזיקין) אינה בסמכות בית הדין לעבודה: היא מוגשת לבית המשפט האזרחי לפי הסכום",
        },
        "patient": {
            "he": "חוק זכויות החולה, התשנ\"ו-1996",
            "url": PATIENT,
            "current_to": "2025-04-06",
            "section": "סעיף 18(א)",
            "records_he": "מטופל זכאי לקבל מהמטפל או מהמוסד הרפואי מידע רפואי מהרשומה הרפואית שלו, לרבות העתק",
        },
        # The Ministry of Education's student accident policy for the school year 2026-27 (read from its PDF).
        "students": {
            "he": "משרד החינוך: פוליסה לביטוח תאונות אישיות לתלמידים, שנת הלימודים התשפ\"ז",
            "url": MOE_POLICY,
            "from": "2026-09-01",
            "to": "2027-08-31",
            "base_sum": 336180,
            "who_he": "תלמידים שהרשות המקומית או מוסד החינוך צירפו להסדר, בכל שעה משעות היממה, בישראל, בין שיש קשר לפעילות בית הספר ובין שלא",
            "excluded_he": "לא חלה על תאונת דרכים בישראל (שם חל חוק הפיצויים) ולא על נזק מטיפול רפואי",
            "claim_he": "התביעה מוגשת למבטח שבפוליסה בטופס תביעה עם מסמכים רפואיים, בדרך כלל דרך ההורים",
        },
        "malpractice_he": "לרשלנות רפואית כללים משלה, והכלי לא מחשב לה מועדים. כדאי לפנות לעורך דין שעוסק בתחום",
    }
