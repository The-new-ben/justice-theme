"""The maternity dataset of the co.il tools registry (the rights wave, 21.10.2026): the dmei-leida instrument on
/maternity-allowance/ (maternity allowance and the birth grant). Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES)
through KEY and build().

Every value was read on checked_on from the official text named next to it: the National Insurance Institute's maternity
pages (the maternity allowance: conditions, the period and its extensions, the amount, the claim; the allowance for the
partner; the birth grant; the multiple-birth allowance; the hospitalization grant), the gov.il service page "תביעה לתשלום
דמי לידה", the National Insurance Law [Consolidated Version], 1995, chapter 3 (maternity insurance, sections 39-61) and
section 296 in the Institute's own consolidated text (btl.gov.il/Laws1), and the Women's Employment Law, 1954 (nevo).
Basic amount 1 (10,514 from 1.1.2026) lives in rights_btl; the figures here that derive from it (1,752.33 = 10,514 x 5 / 30;
2,103 / 946 / 631 = 20% / 9% / 6% of it; 10,514 / 15,771 / 5,257 = 100% / 150% / 50% of it) are the amounts the Institute
publishes, and the tests check them against rights_btl. Nothing here is estimated; a figure the sources do not hold is not
in the file (see parts/dmei-leida/notes.md).
"""
from __future__ import annotations

KEY = "rights_leida"

BTL = "https://www.btl.gov.il/benefits/maternity/"
MAIN = BTL + "Pages/default.aspx"                                                        # אמהות: דף הענף
ALLOWANCE = BTL + "Childbirth_Allowance/Pages/default.aspx"                              # דמי לידה - אמהות
CONDITIONS = BTL + "Childbirth_Allowance/Pages/%D7%AA%D7%A0%D7%90%D7%99%20%D7%94%D7%96%D7%9B%D7%90%D7%95%D7%AA.aspx"  # תנאי הזכאות
PERIOD = (BTL + "Childbirth_Allowance/Pages/%d7%aa%d7%a7%d7%95%d7%a4%d7%aa%20%d7%94%d7%96%d7%9b%d7%90%d7%95%d7%aa%20"
          "%d7%94%d7%9e%d7%a8%d7%91%d7%99%d7%aa.aspx")                                   # תקופת הזכאות לדמי לידה (והארכות)
AMOUNT = BTL + "Childbirth_Allowance/Pages/ShiureyLeda.aspx"                             # סכום דמי הלידה (1,752.33)
CLAIM = (BTL + "Childbirth_Allowance/Pages/%d7%90%d7%95%d7%a4%d7%9f%20%d7%94%d7%92%d7%a9%d7%aa%20"
         "%d7%94%d7%aa%d7%91%d7%99%d7%a2%d7%94.aspx")                                    # איך להגיש תביעה לדמי לידה
DIFFERENCES = BTL + "Childbirth_Allowance/Pages/hefreshim.aspx"                          # תביעה לתשלום הפרשים
FATHER = BTL + "Childbirth_Allowance/Pages/dmailaidaleav.aspx"                           # דמי לידה לאב
FATHER_CONDITIONS = BTL + "dmeLedaLaav/Pages/tnaey%20zakaoot%20ledmeyleda%20laav.aspx"   # תנאי הזכאות לאב
FATHER_PERIOD = BTL + "dmeLedaLaav/Pages/meshech_av.aspx"                                # כמה זמן אפשר לקבל דמי לידה לאב
FATHER_AMOUNT = BTL + "dmeLedaLaav/Pages/shihor%20smeyleda%20laav.aspx"                  # סכום דמי הלידה לאב
FATHER_CLAIM = BTL + "dmeLedaLaav/Pages/hagashat%20tviha.aspx"                           # אופן הגשת התביעה לאב
GRANT = BTL + "maanakleda/Pages/default.aspx"                                            # מענק לידה
GRANT_AMOUNT = BTL + "maanakleda/Pages/ShiurMaanakLeda.aspx"                             # סכום המענק (2026)
GRANT_CONDITIONS = BTL + "maanakleda/Pages/TnaeyZacaut.aspx"                             # תנאי הזכאות למענק
GRANT_CLAIM = BTL + "maanakleda/Pages/OfenHagashatTvia.aspx"                             # אופן הגשת התביעה למענק
MULTIPLE = BTL + "Pages/%d7%a7%d7%a6%d7%91%d7%aa%20%d7%9c%d7%99%d7%93%d7%94.aspx"        # קצבת לידה רב-עוברית (טבלת 2026)
HOSPITAL = BTL + "Pages/%d7%9e%d7%a2%d7%a0%d7%a7%20%d7%90%d7%a9%d7%a4%d7%95%d7%96.aspx"   # מימון הוצאות אשפוז היולדת
CALCULATOR = "https://www.btl.gov.il/Simulators/Pages/DmeyLedaCalc.aspx"                 # מחשבון דמי הלידה של המוסד
GOV_SERVICE = "https://www.gov.il/he/service/claim_for_birth_payment"                    # gov.il: תביעה לתשלום דמי לידה
CLAIM_FORM = "https://govforms.gov.il/mw/forms/t355@btl.gov.il"                          # תביעה לדמי לידה (355), מקוון
CLAIM_PDF = "https://www.btl.gov.il/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/Documents/T355.pdf"  # טופס 355 להדפסה
LAW = "https://www.btl.gov.il/Laws1/00_0001_000003.pdf"                                   # חוק הביטוח הלאומי, פרק ג': ביטוח אימהות (סעיפים 39-61)
CLAIMS_LAW = "https://www.btl.gov.il/Laws1/00_0001_000014.pdf"                            # חוק הביטוח הלאומי, פרק י"ד: סעיף 296
WORK_LAW = "https://www.nevo.co.il/law_html/law01/p176_001.htm"                           # חוק עבודת נשים, התשי"ד-1954


def build(checked_on: str) -> dict:
    """Maternity allowance and the birth grant for 2026: the qualifying periods, the daily amount and its maximum, the period
    and its extensions, the partner's share, the grant by birth order, the multiple-birth allowance, the hospitalization grant,
    the job-protected leave and the dismissal protection, and the claim, each with the section or the page it was read from."""
    return {
        "name_he": "דמי לידה ומענק לידה לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי, ענף אמהות",
        "source_name": "המוסד לביטוח לאומי: דמי לידה (תנאי זכאות, תקופת הזכאות, סכום, הגשת תביעה), דמי לידה לאב, מענק לידה; חוק הביטוח הלאומי, פרק ג'; חוק עבודת נשים",
        "source_url": ALLOWANCE,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, פרק ג': ביטוח אימהות",
        "law_url": LAW,
        "claims_law_url": CLAIMS_LAW,
        "work_law_he": "חוק עבודת נשים, התשי\"ד-1954",
        "work_law_url": WORK_LAW,
        "pages": {
            "main": MAIN, "allowance": ALLOWANCE, "conditions": CONDITIONS, "period": PERIOD, "amount": AMOUNT, "claim": CLAIM,
            "differences": DIFFERENCES, "father": FATHER, "father_conditions": FATHER_CONDITIONS, "father_period": FATHER_PERIOD,
            "father_amount": FATHER_AMOUNT, "father_claim": FATHER_CLAIM, "grant": GRANT, "grant_amount": GRANT_AMOUNT,
            "grant_conditions": GRANT_CONDITIONS, "grant_claim": GRANT_CLAIM, "multiple": MULTIPLE, "hospital": HOSPITAL,
            "calculator": CALCULATOR, "gov_service": GOV_SERVICE,
        },
        # סעיף 50(א); תנאי הזכאות ותקופת הזכאות (btl), ודף השירות ב-gov.il: 10 מתוך 14 או 15 מתוך 22 -> 105 ימים (15 שבועות);
        # 6 מתוך 14 -> 56 ימים (8 שבועות); עבודה בחלק מהחודש נחשבת לחודש מלא.
        "qualify": {
            "full_months": 10, "full_window": 14, "full_alt_months": 15, "full_alt_window": 22, "full_days": 105, "full_weeks": 15,
            "full_section": "סעיף 50(א)(1)",
            "partial_months": 6, "partial_window": 14, "partial_days": 56, "partial_weeks": 8, "partial_section": "סעיף 50(א)(2)",
            "url": CONDITIONS, "period_url": PERIOD,
            "partial_month_he": "עבודה בחלק מהחודש נחשבת לחודש עבודה מלא",
            "extra_section": "סעיף 50(ב)",
            "extra_he": "נחשבים גם חודשים של דמי לידה קודמים, דמי פגיעה, דמי אבטלה, דמי תאונה, גמלה לשמירת היריון, דמי מחלה או חופשה מקופת גמל, שני החודשים הראשונים של חופשה ללא תשלום, הכשרה מקצועית מאושרת, ושירות צבאי או לאומי (סעיף 50(ב) ודף המוסד)",
            "self_he": "עצמאית: זכאותה נבדקת רק אם בזמן ההיריון הייתה רשומה בביטוח הלאומי כעובדת עצמאית ושילמה את דמי הביטוח עד יום הפסקת העבודה; חוב לביטוח הלאומי מסדירים לפני יום הפסקת העבודה",
            "both_he": "מי שעבדה גם כשכירה וגם כעצמאית: חודשי הביטוח נספרים בנפרד לכל סוג עבודה, ודמי הלידה משולמים לפי סך ההכנסות רק אם בכל סוג נצברה תקופת הזכאות",
            "both_url": GOV_SERVICE,
            "birth_week": 22, "birth_he": "לידה משבוע 22 ויום (גם לידה שקטה)",
            "stop_he": "הפסקת לעבוד בזמן ההיריון ולא עבדת בתקופת דמי הלידה",
        },
        # סעיף 54(א) ו-(ב); סכום דמי הלידה (btl) ו-gov.il: שכירה - השכר ב-3 החודשים המלאים שקדמו ל-1 בחודש הפסקת העבודה חלקי 90,
        # או ב-6 החודשים חלקי 180, הגבוה; עצמאית - לפי המקדמות, ובשלב שני לפי השומה (השנה או הקודמת, הגבוהה).
        "base": {
            "months_short": 3, "divisor_short": 90, "months_long": 6, "divisor_long": 180,
            "section": "סעיף 54(א)", "income_section": "סעיף 54(ב)(1)", "self_section": "סעיף 54(ב)(2)", "url": AMOUNT,
            "he": "השכר ב-3 החודשים המלאים שקדמו לחודש הפסקת העבודה חלקי 90, או ב-6 החודשים חלקי 180, הגבוה מביניהם",
            "example_he": "מי שהפסיקה לעבוד באמצע יולי: אפריל עד יוני, או ינואר עד יוני, הגבוה",
            "self_he": "עצמאית: בשלב הראשון לפי ההכנסה שעליה שולמו המקדמות ב-3 החודשים שלפני הפסקת העבודה, מול רבע מההכנסה בשומה של השנה הקודמת (אם יש), הגבוה; בשלב השני, כשמגיעה השומה של השנה שבה הפסיקה לעבוד, החישוב נעשה שוב לפי השומה הזאת או של השנה הקודמת, הגבוהה",
            "self_quarters": 4,
            "both_he": "שכירה שהיא גם עצמאית: לפי סך שתי ההכנסות, אך לא יותר ממקסימום דמי הלידה ליום",
            "drop_he": "אם השכר ב-6 החודשים ירד בגלל מחלה, תאונה, שביתה, השבתה, מלחמה, אבל או סיבה אחרת שאינה תלויה בך, ויש אישורים, המוסד בודק חישוב לפי שכר גבוה יותר או לפי חודשים קודמים",
            "reserve_he": "תגמולי מילואים ששולמו בזמן ההיריון נכנסים לחישוב",
        },
        # סעיף 53(א): שכר העבודה הרגיל, אך לא יותר מהסכום הבסיסי כפול 5 חלקי 30; סכום דמי הלידה (btl): 1,752.33 ש"ח ליום מ-1.1.2026.
        "max": {
            "daily": 1752.33, "b1_mult": 5, "divisor": 30, "from": "2026-01-01",
            "section": "סעיף 53(א)", "url": AMOUNT,
            "he": "עד 1,752.33 ש\"ח ליום (הסכום הבסיסי כפול 5, חלקי 30), מ-1.1.2026",
        },
        # סעיף 53(ד); סכום דמי הלידה (btl): מנוכים מס הכנסה ודמי ביטוח לאומי וביטוח בריאות.
        "deductions": {
            "section": "סעיף 53(ד)", "url": AMOUNT,
            "he": "מדמי הלידה מנוכים במקור מס הכנסה, דמי ביטוח לאומי ודמי ביטוח בריאות; אישור על הנחה או פטור ממס מגישים עם התביעה",
        },
        # סעיף 52; תקופת הזכאות (btl): היום הראשון לפי יום הפסקת העבודה, אך לא לפני 53 יום לפני הלידה (מלאים) או 28 יום (חלקיים).
        "start": {
            "before_full": 53, "before_partial": 28, "section": "סעיף 52(א)", "url": PERIOD,
            "he": "היום הראשון לדמי הלידה הוא יום הפסקת העבודה, אך לא לפני 53 יום לפני הלידה (בדמי לידה מלאים) או 28 יום (בחלקיים)",
        },
        # סעיף 51(א1); סעיף 6(ג)(1) לחוק עבודת נשים; תקופת הזכאות (btl): 3 שבועות לכל ילד נוסף (מלאים), שבועיים (חלקיים).
        "multiple": {
            "full_extra_days": 21, "partial_extra_days": 14, "section": "סעיף 51(א1)", "work_section": "סעיף 6(ג)(1) לחוק עבודת נשים", "url": PERIOD,
            "he": "לידה של יותר מילד אחד: 3 שבועות נוספים לכל ילד נוסף (תאומים 18 שבועות, שלישייה 21); בדמי לידה חלקיים שבועיים לכל ילד נוסף; משולם אוטומטית",
        },
        # סעיף 51(א); סעיפים 6(ב1), 6(ד) ו-6(ד2) לחוק עבודת נשים; תקופת הזכאות (btl) ו-gov.il.
        "hosp": {
            "min_days": 15, "mother_full": 28, "mother_partial": 14, "baby_full": 140, "baby_partial": 84,
            "total_full": 140, "total_partial": 84,
            "section": "סעיף 51(א)", "work_mother_section": "סעיף 6(ב1) לחוק עבודת נשים", "work_baby_section": "סעיף 6(ד) לחוק עבודת נשים", "work_total_section": "סעיף 6(ד2) לחוק עבודת נשים",
            "url": PERIOD, "gov_url": GOV_SERVICE,
            "mother_he": "אשפוז של היולדת 15 ימים לפחות (גם לא רצופים) בתקופת דמי הלידה: הארכה לפי ימי האשפוז, עד 4 שבועות (בדמי לידה חלקיים עד שבועיים)",
            "baby_he": "אשפוז של התינוק 15 ימים לפחות (גם לא רצופים): הארכה לפי ימי האשפוז, עד 20 שבועות (בדמי לידה חלקיים עד 12)",
            "window_he": "מי שעבדה 12 חודשים לפחות אצל אותו מעסיק לפני הלידה: אשפוז בתקופת דמי הלידה ועד 26 שבועות מהלידה; אחרת רק אשפוז בתקופת דמי הלידה",
            "combine_he": "אם גם היולדת וגם התינוק אושפזו פחות מ-15 יום, ותקופות האשפוז לא חפפו, אפשר לצרף אותן להארכה",
            "home_he": "אשפוז בית לא מקנה הארכה",
            "split_he": "אפשר לפצל: לחזור לעבודה אחרי 3 שבועות לפחות מהלידה, ולהמשיך את יתרת התקופה כשהתינוק יוצא מבית החולים",
            "claim_he": "את ההארכה או הפיצול מבקשים בתביעה נפרדת, מוקדם ככל האפשר, עם אישור בית החולים (ושכירה: אישור המעסיק)",
        },
        # סעיף 51(א3) (תיקון 261, מ-1.4.2026); סעיף 6(ד3) לחוק עבודת נשים; תקופת הזכאות (btl).
        "complex": {
            "days": 35, "from": "2026-04-01", "total_max_days": 140,
            "section": "סעיף 51(א3)", "work_section": "סעיף 6(ד3) לחוק עבודת נשים", "url": PERIOD,
            "he": "מ-1.4.2026: תינוק שהוכר בתוך תקופת הלידה וההורות כילד עם מוגבלות מורכבת, 5 שבועות נוספים, ובלבד שכל ההארכות יחד לא יעלו על 20 שבועות; רק למי שלא חזרה לעבוד",
        },
        # סעיף 49(ב), 49(ג)(3) ו-49(ד1); סעיף 6(ח) לחוק עבודת נשים; דמי לידה לאב (btl) ו-gov.il.
        "partner": {
            "min_days": 7, "together_days": 7, "together_twins_days": 21, "together_triplets_days": 35,
            "swap_after_days": 42, "partial_swap_days": 14,
            "months": 10, "window": 14, "alt_months": 15, "alt_window": 22,
            "section": "סעיף 49(ב)", "together_section": "סעיף 49(ד1)", "min_section": "סעיף 49(ג)(3)",
            "work_section": "סעיף 6(ח) לחוק עבודת נשים", "url": FATHER_PERIOD, "conditions_url": FATHER_CONDITIONS, "amount_url": FATHER_AMOUNT,
            "claim_url": FATHER_CLAIM,
            "together_he": "יחד עם היולדת: 7 ימים, על חשבון השבוע האחרון שלה (תאומים: עד 3 שבועות ברציפות, שלישייה: עד 5)",
            "swap_he": "במקום היולדת: רק אחרי 6 שבועות מהלידה, לפחות 7 ימים רצופים, ליתרת התקופה; מתחלפים פעם אחת בלבד",
            "partial_he": "כשליולדת דמי לידה חלקיים (56 ימים), בן הזוג יכול להחליף אותה ל-14 ימים בלבד, אחרי 42 ימים מהלידה",
            "qualify_he": "בן הזוג צריך תקופת אכשרה מלאה משלו: 10 מתוך 14 החודשים שלפני הפסקת עבודתו, או 15 מתוך 22",
            "return_he": "היולדת מוותרת בכתב על חלק מהתקופה וחוזרת לעבודה בזמן שבן הזוג בחופשה (בשבוע המשותף היא לא צריכה לחזור)",
            "amount_he": "דמי הלידה של בן הזוג מחושבים לפי השכר שלו, באותו כלל (3 חודשים חלקי 90 או 6 חלקי 180), עד אותו מקסימום",
            "notify_he": "כשדמי הלידה של היולדת משולמים אוטומטית, מודיעים לסניף לפני הלידה שבן הזוג יחליף אותה, כדי שלא ייווצר חוב",
            "form": "360",
        },
        # סעיף 6(ב) לחוק עבודת נשים: 26 שבועות, עד 7 לפני הלידה; פחות מ-12 חודשים אצל אותו מעסיק: 15 שבועות.
        "leave": {
            "weeks": 26, "before_max_weeks": 7, "short_weeks": 15, "seniority_months": 12,
            "section": "סעיף 6(ב)(1) לחוק עבודת נשים", "short_section": "סעיף 6(ב)(5) לחוק עבודת נשים", "shorten_section": "סעיף 6(ב)(2) לחוק עבודת נשים", "url": WORK_LAW,
            "he": "תקופת לידה והורות של 26 שבועות, מהם עד 7 שבועות לפני יום הלידה המשוער; 15 מהם בתשלום דמי לידה",
            "short_he": "מי שעבדה פחות מ-12 חודשים אצל אותו מעסיק או באותו מקום עבודה: 15 שבועות",
            "shorten_he": "אפשר לקצר, אבל לא פחות מ-15 שבועות (ועוד ההארכות), והמעסיק לא יכול לדחות את החזרה ביותר מ-3 שבועות מההודעה",
        },
        # סעיף 9 לחוק עבודת נשים.
        "protect": {
            "pregnancy_months": 6, "after_days": 60,
            "pregnancy_section": "סעיף 9(א) לחוק עבודת נשים", "leave_section": "סעיף 9(ג)(1) לחוק עבודת נשים", "after_section": "סעיף 9(ג)(1א) לחוק עבודת נשים", "url": WORK_LAW,
            "pregnancy_he": "בהיריון אסור לפטר בלי היתר, למי שעבדה 6 חודשים לפחות אצל אותו מעסיק; היתר לא יינתן אם הפיטורים בקשר להיריון",
            "leave_he": "בתקופת הלידה וההורות אסור לפטר, וגם לא לתת הודעת פיטורים שתחול בה",
            "after_he": "60 ימים אחרי תום תקופת הלידה וההורות אסור לפטר בלי היתר, והיתר יינתן רק כשהעסק חדל לפעול או בפשיטת רגל או פירוק, ולא בקשר ללידה",
        },
        # סעיף 7(ג)(3) לחוק עבודת נשים.
        "parent_hour": {
            "months": 4, "section": "סעיף 7(ג)(3) לחוק עבודת נשים", "url": WORK_LAW,
            "he": "4 חודשים מתום תקופת הלידה וההורות: שעת הורות, שעה ביום בלי ניכוי משכר, למי שעובדת במשרה מלאה",
        },
        # סעיף 7(ד)(1) לחוק עבודת נשים.
        "unpaid": {
            "max_months": 12, "section": "סעיף 7(ד)(1) לחוק עבודת נשים", "url": WORK_LAW,
            "he": "אחרי תקופת הלידה וההורות אפשר להיעדר ללא תשלום עד רבע ממספר החודשים שעבדת אצל אותו מעסיק, ולא יותר מ-12 חודשים מיום הלידה (בניכוי השבועות שמעבר ל-15 שכבר נוצלו)",
        },
        # סעיף 296; איך להגיש תביעה (btl) ו-gov.il: לא לפני 9 שבועות לפני הלידה המשוערת, ולא יאוחר מ-12 חודשים.
        "claim": {
            "earliest_weeks_before": 9, "deadline_months": 12,
            "section": "סעיף 296(א)", "late_section": "סעיף 296(ב)(1)", "url": CLAIM, "gov_url": GOV_SERVICE,
            "form": "355", "form_url": CLAIM_FORM, "pdf_url": CLAIM_PDF, "employer_form": "100",
            "deadline_he": "תביעה שמוגשת אחרי 12 חודשים מיום הפסקת העבודה עלולה לאבד את הזכאות; gov.il: לא יאוחר מ-12 חודשים מיום הזכאות הראשון",
            "employer_he": "המעסיק משדר למוסד טופס 100, וכך דמי הלידה משולמים בלי תביעה; אפשר לשדר גם בהיריון אם הפסקת לעבוד, אבל לא לפני 9 שבועות מיום הלידה המשוער",
            "sms_he": "אחרי לידה בבית חולים שכירה מקבלת מסרון שמבקש את אישורה לפנות למעסיק לדיווח על השכר; אישור המסרון חוסך את התביעה",
            "auto_he": [
                "עצמאית שילדה בבית חולים: התשלום אוטומטי אחרי שבית החולים מעביר את נתוני הלידה",
                "מעסיק שיש לו הסדר עם הביטוח הלאומי: הוא מעביר את התביעה בעצמו",
                "מי שקיבלה דמי אבטלה עד חודש לפני הלידה: אחרי ה-17 בחודש שאחרי חודש הלידה",
                "מי שקיבלה קצבה לשמירת היריון עד הלידה: אחרי שבית החולים מעביר את נתוני הלידה",
            ],
            "online_he": "מילוי התביעה המקוונת אפשרי רק אחרי הלידה",
            "docs_he": [
                "טופס התביעה, עם החלק של המעסיק על חודשי העבודה והשכר (בכמה מעסיקים: טופס לכל מעסיק)",
                "אם השכר ב-6 החודשים ירד מסיבה רפואית או אחרת: מכתב והאישורים",
                "לידת בית או לידה בחוץ לארץ: אישור רשמי על הלידה",
                "שירות צבאי או לאומי ב-22 החודשים שלפני הלידה: תעודת שחרור או אישור רשות השירות",
                "הכשרה מקצועית בשנתיים האחרונות: אישור על המקום ועל התקופה",
                "פטור או הנחה ממס הכנסה: האישור",
            ],
            "paid_he": "דמי הלידה משולמים בתשלום אחד לחשבון הבנק",
        },
        # סעיף 44; סכום המענק (btl): מ-1.1.2026.
        "grant": {
            "first": 2103, "second": 946, "third_plus": 631, "twins": 10514, "triplets": 15771, "each_extra": 5257,
            "pct_first": 20, "pct_second": 9, "pct_third": 6, "pct_twins": 100, "pct_triplets": 150, "pct_extra": 50,
            "section": "סעיף 44", "url": GRANT_AMOUNT, "conditions_url": GRANT_CONDITIONS, "claim_url": GRANT_CLAIM,
            "he": "מענק לידה לפי מספר הילדים במשפחה: 2,103 ש\"ח לילד הראשון, 946 לשני, 631 לשלישי ואילך; תאומים 10,514, שלישייה 15,771, ועוד 5,257 לכל ילד נוסף (מ-1.1.2026)",
            "paid_he": "משולם אוטומטית בתוך חודש מהלידה, לחשבון שבו משולמת קצבת הילדים (בלידה ראשונה: לחשבון שנמסר בבית החולים)",
            "family_he": "הספירה לפי הילדים שבעדם שולם מענק באותה משפחה",
            "abroad_he": "לידה בחוץ לארץ, אימוץ ופונדקאות: מגישים תביעה",
        },
        # סעיף 45; קצבת לידה רב-עוברית (btl): הטבלה מ-1.1.2026, 20 חודשים.
        "multi_allowance": {
            "min_babies": 3, "months": 20, "section": "סעיף 45", "url": MULTIPLE,
            "bands": [[1, 3], [4, 6], [7, 9], [10, 12], [13, 20]],
            "rows": [
                {"kids": 3, "amounts": [13458, 10514, 8411, 6308, 3680]},
                {"kids": 4, "amounts": [17874, 14194, 11565, 7886, 4626]},
                {"kids": 5, "amounts": [26285, 21028, 15771, 10514, 5993]},
            ],
            "he": "שלושה ילדים או יותר בלידה אחת: קצבה חודשית ל-20 חודשים מהחודש שאחרי הלידה, לפי מספר הילדים שבחיים (בחודש הראשון: בתום 30 יום מהלידה), אוטומטית",
        },
        # סעיף 43 ולוח ב1; מימון הוצאות אשפוז היולדת (btl).
        "hospital": {
            "amount": 19028, "from": "2026-01-10", "premature": 301930, "premature_grams": 1750, "premature_icu_days": 4,
            "section": "סעיף 43; לוח ב1", "url": HOSPITAL,
            "he": "מענק האשפוז, 19,028 ש\"ח (מ-10.1.2026), עובר ישירות לבית החולים, ולא ליולדת; לפג עד 1,750 גרם שאושפז 4 ימים לפחות בטיפול נמרץ יילודים, עוד 301,930 ש\"ח לבית החולים",
        },
        # סעיף 49ב (תיקון 264, הוראת שעה מ-31.3.2026 עד 31.3.2027); תנאי הזכאות (btl): לידה בין 28.2.2026 ל-14.4.2026 וחל"ת
        # בעקבות המלחמה: תקופת דמי האבטלה יכולה להשלים את תקופת האכשרה.
        "war": {
            "from": "2026-02-28", "to": "2026-04-14", "section": "סעיף 49ב", "url": CONDITIONS,
            "he": "מי שילדה בין 28.2.2026 ל-14.4.2026 ויצאה לחופשה ללא תשלום בעקבות המלחמה בזמן ההיריון: כשאין מספיק חודשי אכשרה, אפשר להביא בחשבון את תקופת דמי האבטלה ששולמו בעקבות החל\"ת, ואז ייתכנו דמי לידה חלקיים או מלאים",
        },
        # תביעה לתשלום הפרשים (btl) וסכום דמי הלידה: תשלומים נוספים מעל רבע משכר המינימום.
        "differences": {
            "min": 1611, "url": DIFFERENCES,
            "he": "אם אחרי התשלום המעסיק שילם עוד (הבראה, ביגוד, בונוס) מעל 1,611 ש\"ח (רבע משכר המינימום), מבקשים ממנו לשדר טופס 100 עם התשלומים, והמוסד בודק הפרשים",
        },
        "calculator_url": CALCULATOR,
        "gov_service_url": GOV_SERVICE,
    }
