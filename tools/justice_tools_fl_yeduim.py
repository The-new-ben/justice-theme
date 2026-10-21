"""The cohabiting-partners dataset of the co.il tools registry (the family + land wave, 21.10.2026, HAD-579): the
yeduim-batzibur instrument on /cohabiting-couples-rights/ (a rights map for cohabiting partners: what you have, what you
must prove). Loaded by tools/justice_tools_fl.py (glob) through KEY and build().

Every value was read on checked_on from the official text named next to it (copies in the wave's parts/yeduim/sources):
the Succession Law, 1965 (ss.11, 55-60, nevo, current to 1.1.2025); the National Insurance Law [Consolidated], 1995 in
the Institute's own consolidated text (s.1 "אשתו", s.238, s.296: btl.gov.il/Laws1) and the Institute's pages on
cohabitants, survivors (widow, widower, the 2026 amounts, the grant) and its questionnaires 107 and 112; the Income Tax
Ordinance (s.1 "בן זוג", s.9(6ו), s.40(ב), nevo, current to 27.9.2026), form 101 and the Tax Authority's 2025 guide to
form 1301; the Family Court Law, 1995 (s.1, current to 18.9.2023); the Capacity and Guardianship Law, 1962 (s.14, current
to 19.1.2026); the Family Law Amendment (Maintenance) Law, 1959 (ss.2, 3, 3א, current to 6.11.2023); the Spouses'
Property Relations Law, 1973 (current to 22.8.2024); the Pension Savings Division Law, 2014 (s.2); the Notaries (Service
Fees) Regulations, 1978 (item 6, current to 1.1.2026); and C.A. 52/80 Shahar v. Friedman, 38(1) P.D. 443 (1984), from the
copy on gov.il. The family-court fee for approving an agreement (541, item 6א), VAT, the inheritance-order fees and the
Supreme Court's 5620/24 (the Property Relations Law is for married couples) are read from the existing datasets prenup and
yerusha, not repeated here. Nothing is estimated; what the sources do not state is said in words (parts/yeduim/notes.md).
"""
from __future__ import annotations

KEY = "fl_yeduim"

NEVO = "https://www.nevo.co.il/law_html/"
SUCCESSION = NEVO + "law00/72178.htm"            # חוק הירושה, התשכ"ה-1965 (נוסח עדכני ל-1.1.2025): סעיפים 11, 55-60
FAMILY_COURT = NEVO + "law00/98460.htm"          # חוק בית המשפט לעניני משפחה, התשנ"ה-1995 (נוסח עדכני ל-18.9.2023): סעיף 1
CAPACITY = NEVO + "law00/70325.htm"              # חוק הכשרות המשפטית והאפוטרופסות, התשכ"ב-1962: סעיף 14
MAINTENANCE = NEVO + "law00/71532.htm"           # חוק לתיקון דיני המשפחה (מזונות), התשי"ט-1959: סעיפים 2, 3, 3א
PROPERTY_LAW = NEVO + "law00/72138.htm"          # חוק יחסי ממון בין בני זוג, התשל"ג-1973: סעיפים 1-3
PENSION_SPLIT = NEVO + "law01/501_070.htm"       # חוק לחלוקת חיסכון פנסיוני בין בני זוג שנפרדו, התשע"ד-2014: סעיף 2
NOTARY_FEES = NEVO + "law00/90738.htm"           # תקנות הנוטריונים (שכר שירותים), התשל"ט-1978 (נוסח עדכני ל-1.1.2026)
TAX_ORDINANCE = NEVO + "law00/84255.htm"         # פקודת מס הכנסה [נוסח חדש] (נוסח עדכני ל-27.9.2026)
BTL = "https://www.btl.gov.il/"
NII_CH1 = BTL + "Laws1/00_0001_000001.pdf"       # חוק הביטוח הלאומי, פרק א': סעיף 1, ההגדרה "אשתו"
NII_CH11 = BTL + "Laws1/00_0001_000011.pdf"      # פרק י"א: סעיף 238, ההגדרות "אלמנה" ו"אלמן"
NII_CH14 = BTL + "Laws1/00_0001_000014.pdf"      # פרק י"ד: סעיף 296, מועד לתביעת גמלת כסף
NII_COHAB = BTL + "Insurance/National%20Insurance/Pages/yeduyimBtzibur.aspx"   # ידועים בציבור (דמי ביטוח לאומי)
FORMS = BTL + "%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/"
FORM_107_PAGE = FORMS + "forms/insurance_forms/Pages/107%20-%20%D7%A9%D7%90%D7%9C%D7%95%D7%9F%20%D7%9C%D7%99%D7%93%D7%95%D7%A2%D7%99%D7%9D%20%D7%91%D7%A6%D7%99%D7%91%D7%95%D7%A8.aspx"
FORM_107_PDF = FORMS + "Documents/t107.pdf"      # שאלון מפורט לידועים בציבור (בל/107)
FORM_112_PAGE = FORMS + "forms/insurance_forms/Pages/BL112.aspx"
FORM_112_PDF = FORMS + "Documents/T112.pdf"      # שאלון מפורט לידועים בציבור במקרה שאחד מבני הזוג נפטר
SURV = BTL + "benefits/Survivors_%20Insurance/"
SURV_MAIN = SURV + "Pages/default.aspx"
SURV_WIDOW = SURV + "tnaaiZakaut/nimneEmSherim/Pages/almana.aspx"
SURV_WIDOWER = SURV + "tnaaiZakaut/nimneEmSherim/Pages/alman.aspx"
SURV_AMOUNTS = SURV + "shiuraihakizba/Pages/k.almanim.aspx"
SURV_GRANT = SURV + "Pages/%d7%9e%d7%a2%d7%a0%d7%a7%20%d7%a9%d7%90%d7%99%d7%a8%d7%99%d7%9d.aspx"
SURV_CLAIM = SURV + "Pages/%d7%90%d7%95%d7%a4%d7%9f%20%d7%94%d7%92%d7%a9%d7%aa%20%d7%94%d7%aa%d7%91%d7%99%d7%a2%d7%94.aspx"
SURV_CALC = BTL + "Simulators/Pages/SherimCalc.aspx"
ALIMONY_RATES = BTL + "benefits/Alimony/Pages/%d7%a9%d7%99%d7%a2%d7%95%d7%a8%d7%99%20%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx"
RULING_52_80 = "https://www.gov.il/BlobFolder/generalpage/spotify-floater-2/he/sf-21.pdf"   # ע"א 52/80, הנוסח המלא
FORM_101 = "https://www.gov.il/BlobFolder/service/itc101/he/Service_Pages_Income_tax_annual-report-2024_itc101.pdf"
TAX_GUIDE = "https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf"


def build(checked_on: str) -> dict:
    """The rights of cohabiting partners line by line: inheritance (s.55) and maintenance from the estate (s.57(ג)), the
    National Insurance status and the survivors' pension (s.1, s.238, the 2026 table, s.296), pension funds, income tax,
    children, property (the presumption of sharing of C.A. 52/80; the Property Relations Law does not apply), agreements and
    the notary's affidavit fee, separation; the court tests the proof meter names; what the Institute asks to see."""
    return {
        "name_he": "זכויות ידועים בציבור: מה יש לכם ומה צריך להוכיח",
        "publisher_he": "חוק הירושה, חוק הביטוח הלאומי, פקודת מס הכנסה, חוקי המשפחה ופסיקת בית המשפט העליון",
        "source_name": "חוק הירושה, התשכ\"ה-1965, סעיפים 55 ו-57(ג); חוק הביטוח הלאומי, סעיפים 1, 238 ו-296; ע\"א 52/80 שחר נ' פרידמן",
        "source_url": SUCCESSION,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        # חוק הירושה (נבו, נוסח עדכני ל-1.1.2025): סעיף 55 "מעין צוואה"; סעיף 57(ג) מזונות מן העיזבון; סעיף 60(א) המועד.
        "succession": {
            "law_he": "חוק הירושה, התשכ\"ה-1965",
            "url": SUCCESSION,
            "current_to": "2025-01-01",
            "s55": "סעיף 55",
            "s55_he": "איש ואשה החיים חיי משפחה במשק בית משותף ואינם נשואים זה לזה: כשאחד מהם מת, ואף אחד מהם לא היה נשוי לאחר בשעת המוות, רואים את הנשאר בחיים כאילו המוריש ציווה לו את מה שהיה מקבל בירושה אילו היו נשואים, אלא אם בצוואה יש הוראה אחרת, מפורשת או משתמעת",
            "s57c": "סעיף 57(ג)",
            "s57c_he": "באותם תנאים, הנשאר בחיים זכאי למזונות מן העיזבון כאילו היו נשואים",
            "s60": "סעיף 60(א)",
            "maint_after_months": 6,
            "maint_deadline_he": "בקשה למזונות מן העיזבון מגישים לפני חלוקת העיזבון; בית המשפט רשאי לדון בבקשה שהוגשה עד 6 חודשים אחרי החלוקה, אם הנסיבות מצדיקות",
            "s59_he": "בית המשפט מתחשב בשווי העיזבון, במה שהזכאי מקבל ממנו, ברמת החיים, ברכוש ובהכנסה של הזכאי (סעיף 59)",
            "s11": "סעיף 11(א)",
            "apartment_years_he": "סעיף 11(א)(2) נותן לבן זוג שהיה נשוי 3 שנים לפחות, כשהיורשים האחרים הם אחים או סבים, גם את חלקו של המוריש בדירה שגרו בה. איך מונים את 3 השנים לידועים בציבור, הסעיף לא אומר",
            "text_he": "נוסח סעיף 55 מדבר על \"איש ואשה\". בני זוג מאותו מין: צוואה מסירה את השאלה",
            "revoke": "סעיף 36(א)",
            "revoke_he": "צוואה לטובת בן הזוג לא מתבטלת מעצמה בפרידה: מבטלים אותה במפורש באחת מצורות הצוואה, או משמידים אותה",
        },
        # חוק בית המשפט לעניני משפחה, סעיף 1(2)(א): "בן משפחתו" כולל את הידועה בציבור כאישתו; סעיף 1(4): תובענה לאבהות.
        "family_court": {
            "law_he": "חוק בית המשפט לעניני משפחה, התשנ\"ה-1995",
            "url": FAMILY_COURT,
            "current_to": "2023-09-18",
            "section": "סעיף 1(2)(א)",
            "he": "מחלוקת אזרחית ביניכם, גם אחרי הפרידה, נדונה בבית המשפט לענייני משפחה: \"בן משפחתו\" כולל את הידועה בציבור ובן הזוג לשעבר",
            "paternity_section": "סעיף 1(4)",
        },
        # חוק הביטוח הלאומי בנוסח המשולב של המוסד (btl.gov.il/Laws1) ודפי המוסד, נקראו ב-21.10.2026.
        "nii": {
            "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995",
            "def_url": NII_CH1,
            "def_section": "סעיף 1, ההגדרה \"אשתו\"",
            "def_he": "\"אשתו\" כוללת את הידועה בציבור כאשתו והיא גרה עמו",
            "page_url": NII_COHAB,
            "status_he": "בני זוג שהביטוח הלאומי הכיר בהם כידועים בציבור נחשבים אצלו כנשואים, לזכויות ולחובות",
            "proactive_he": "הביטוח הלאומי רשאי לבחון את המעמד גם ביוזמתו, כשיש לו מידע שאתם גרים יחד ומנהלים משק בית משותף",
            "report_he": "מי שחי עם בן או בת זוג בלי נישואין מתבקש לעדכן את הביטוח הלאומי; בלי דיווח עלולים להיווצר חובות להחזיר",
            "same_sex_he": "זוגות מאותו מין שהוכרו כידועים בציבור בביטוח הלאומי שולחים גם הצהרה לבדיקת פטור מדמי ביטוח כעקר/ת בית",
            "form_107": "107",
            "form_107_url": FORM_107_PDF,
            "form_107_page": FORM_107_PAGE,
            "form_107_he": "שאלון מפורט לידועים בציבור (בל/107), עם מסמכים תומכים, למחלקת הביטוח והגבייה בסניף או באתר",
            "form_112": "112",
            "form_112_url": FORM_112_PDF,
            "form_112_page": FORM_112_PAGE,
            "form_112_he": "שאלון מפורט לידועים בציבור כשאחד מבני הזוג נפטר: בקשה להכרה בדיעבד",
            # מה השאלון 107 מבקש לצרף (סעיפים 3.2-3.8 בשאלון).
            "documents_he": [
                "ממתי אתם חיים יחד, והסיבה או האירוע לתאריך (משק בית משותף, טקס או אירוע סמלי), עם אישורים",
                "הכתובת המשותפת ומאיזה יום; מי הבעלים הרשום של הדירה; בשכירות: חוזי השכירות הקודמים והאחרון",
                "רכוש או ציוד משותף, עם אישורים או קבלות",
                "הסכם ממון או צוואה, אם יש",
                "אישור מוטבים: אם אחד מכם מוטב של השני בביטוח חיים, בקרן פנסיה או בקופת גמל",
                "חשבון בנק משותף, או ייפוי כוח בחשבון של השני",
                "חשבונות משק הבית בכתובת המשותפת: מים, ארנונה, חשמל, גז, טלפון, אינטרנט וטלוויזיה",
                "הופעה בציבור יחד כבני זוג, עם הוכחות",
                "ילדים משותפים: מספרי הזהות ותאריכי הלידה",
            ],
            "documents_section": "שאלון בל/107, סעיפים 2-3",
            # סעיף 238: אלמנה = אשתו בשעת הפטירה, להוציא מי שהיתה אשתו פחות משנה (מגיל 55: חצי שנה) ולא ילדה לו ילד;
            # אלמן = בן זוגה, כל עוד יש עמו ילד או שהכנסתו עד הסכום שבלוח ט', להוציא פחות משנה (מגיל 55: חצי שנה).
            # דפי המוסד "אלמנה" ו"אלמן": ידוע/ה בציבור שחי/ה עם הנפטר תחת קורת גג אחת שנה לפחות (חצי שנה מגיל 55).
            "survivors": {
                "section": "סעיף 238",
                "url": NII_CH11,
                "min_months": 12,
                "min_months_older": 6,
                "older_age": 55,
                "widow_child_he": "אלמנה שילדה לנפטר ילד זכאית גם בלי שנה של מגורים יחד",
                "widower_income_cap": 7848,
                "widower_cap_from": "2026-01-01",
                "widower_he": "אלמן בלי ילד זכאי רק אם ההכנסות שלו לא עולות על התקרה; כשיש עמו ילד אין בדיקת הכנסות",
                "separated_he": "מי שחיו בנפרד לפני הפטירה: פירוד של פחות מ-36 חודשים, או מגורים יחד בשנה האחרונה או בחלק ממנה",
                "several_he": "כשיש יותר מאלמנה אחת לאותו נפטר, הביטוח הלאומי בודק כל אחת כאילו היא האלמנה היחידה",
                "widow_url": SURV_WIDOW,
                "widower_url": SURV_WIDOWER,
                "amounts_url": SURV_AMOUNTS,
                "amounts_from": "2026-01-01",
                # סכומי הקצבה לחודש מ-1.1.2026 (דף "קצבה לאלמן ולאלמנה").
                "amounts": {
                    "age40to50": 1381,
                    "age50plus": 1838,
                    "age80plus": 1941,
                    "kid1": 2700,
                    "kid2": 3562,
                    "kid_extra": 862,
                    "half_old_age": 919,
                },
                "supplements_he": "על הסכומים נוספות תוספת ותק ותוספת דמי מחיה, לפי העניין",
                "grant_under_age": 40,
                "grant_pensions": 36,
                "grant_url": SURV_GRANT,
                "grant_he": "מענק שאירים חד-פעמי במקום קצבה",
                "claim_url": SURV_CLAIM,
                "calculator_url": SURV_CALC,
                "main_url": SURV_MAIN,
            },
            # סעיף 296(א): תביעה לגמלת כסף תוך 12 חודשים מהיום שנוצרה העילה; (ב)(1): תביעה מאוחרת משולמת לכל היותר
            # על 12 החודשים שלפני החודש שבו הוגשה; מענק: בתנאי שלא חלפו 18 חודשים מהחודש שבו נוצרו התנאים.
            "claim": {
                "months": 12,
                "late_back_months": 12,
                "grant_months": 18,
                "section": "סעיף 296(א)",
                "late_section": "סעיף 296(ב)(1)",
                "url": NII_CH14,
            },
            "alimony_he": "מזונות דרך הביטוח הלאומי: לאישה שחיה כידועה בציבור עם בן זוג חדש יש בטבלת המוסד שיעור נפרד, כמו לאישה שנישאה שוב",
            "alimony_url": ALIMONY_RATES,
        },
        # פקודת מס הכנסה (נבו, נוסח עדכני ל-27.9.2026); טופס 101; המדריך לדוח השנתי 2025 של רשות המסים.
        "tax": {
            "law_he": "פקודת מס הכנסה [נוסח חדש]",
            "url": TAX_ORDINANCE,
            "spouse_section": "סעיף 1, ההגדרה \"בן זוג\"",
            "spouse_he": "\"בן זוג\" בפקודה הוא אדם נשוי החי ומנהל משק בית משותף עם מי שנשוי לו. לכן הכללים של בן זוג רשום ושל חישוב נפרד או מאוחד לא חלים עליכם: כל אחד מכם נישום לבד",
            "joint_sections": "סעיפים 64ב-66",
            "single_parent_section": "סעיף 40(ב)",
            "single_parent_he": "הורה שמנהל משק בית משותף עם אדם אחר לא מסמן בטופס 101 את הסעיף של הורה במשפחה חד-הורית, ולא מקבל את נקודת הזיכוי שלו",
            "form101_url": FORM_101,
            "form101_item": "טופס 101, חלק ח, סעיף 6",
            "survivors_section": "סעיף 9(6ו)",
            "survivors_he": "בפטור ממס על קצבת שארים, \"קצבת שארים\" כוללת קצבה למי שהיה הידוע בציבור של הנפטר",
            "family_unit_he": "בפטור ממס שבח על דירת מגורים, רשות המסים רואה את המוכר, בן הזוג או הידוע בציבור והילדים עד גיל 18 כמוכר אחד",
            "guide_url": TAX_GUIDE,
            "guide_page": 56,
            "guide_he": "המדריך למילוי הדוח השנתי 2025 של רשות המסים",
        },
        # חוק הכשרות המשפטית והאפוטרופסות, סעיף 14; חוק המזונות, סעיפים 3 ו-3א.
        "children": {
            "capacity_he": "חוק הכשרות המשפטית והאפוטרופסות, התשכ\"ב-1962",
            "capacity_url": CAPACITY,
            "capacity_current_to": "2026-01-19",
            "guardian_section": "סעיף 14",
            "guardian_he": "ההורים הם האפוטרופסים הטבעיים של ילדיהם הקטינים, נשואים או לא",
            "maint_he": "חוק לתיקון דיני המשפחה (מזונות), התשי\"ט-1959",
            "maint_url": MAINTENANCE,
            "maint_current_to": "2023-11-06",
            "maint_section": "סעיפים 3 ו-3א",
            "support_he": "מזונות הילדים: אותו דין כמו להורים נשואים, לפי הדין האישי והלכת בע\"מ 919/15",
        },
        # חוק המזונות, סעיף 2(א): מזונות בן זוג לפי הדין האישי החל עליו.
        "spousal": {
            "section": "סעיף 2",
            "url": MAINTENANCE,
            "he": "חוק המזונות קובע מזונות בין בני זוג לפי הדין האישי שלהם (סעיף 2). החוק לא קובע מזונות בין ידועים בציבור בחייהם: טענה כזאת נשענת על הסכם ביניכם",
        },
        # ע"א 52/80 שחר נ' פרידמן, פ"ד לח(1) 443 (כרך לח, חלק ראשון, 1984): תקציר פסק הדין והנימוקים.
        "property": {
            "ruling_he": "ע\"א 52/80 שחר נ' פרידמן, פ\"ד לח(1) 443",
            "ruling_year": 1984,
            "ruling_url": RULING_52_80,
            "applies_he": "הלכת שיתוף הנכסים חלה גם על בני זוג שלא נישאו וחיים כידועים בציבור",
            "applies_para": "תקציר, ב(1)",
            "test_he": "ראיות לאורח חיים תקין ולמאמץ משותף יוצרות חזקה של כוונת שיתוף; הצד השני יכול לסתור אותה, למשל בהפרדה רכושית",
            "test_para": "תקציר, א(5)",
            "burden_he": "נטל ההוכחה כבד יותר מאשר בין נשואים: מי שטוען לשיתוף צריך להוכיח את הכוונה לשתף",
            "burden_para": "תקציר, ב(4)",
            "later_he": "שיתוף יכול להתחיל אחרי תחילת החיים המשותפים, ולחול גם על נכס שנרכש קודם",
            "later_para": "תקציר, ג(1)",
            "fact_he": "אם יש הסכם שיתוף בנכס, ומה היקפו, הן שאלות שבעובדה שנקבעות לפי כל הנסיבות",
            "fact_para": "תקציר, א(3)",
            "law_he": "חוק יחסי ממון בין בני זוג, התשל\"ג-1973",
            "law_url": PROPERTY_LAW,
            "law_current_to": "2024-08-22",
        },
        # חוק לחלוקת חיסכון פנסיוני, סעיף 2: "בן זוג" של חוסך כולל את הידוע בציבור כבן זוגו.
        "pension": {
            "split_he": "חוק לחלוקת חיסכון פנסיוני בין בני זוג שנפרדו, התשע\"ד-2014",
            "split_url": PENSION_SPLIT,
            "split_section": "סעיף 2",
            "split_rule_he": "חלוקת חיסכון פנסיוני על פי פסק דין חלה גם על ידועים בציבור: \"בן זוג\" של חוסך כולל את הידוע בציבור כבן זוגו",
            "fund_he": "קצבת שארים מקרן פנסיה או מביטוח מנהלים: מי נחשב בן זוג נקבע בתקנון הקרן או בפוליסה, והדרישות שונות מגוף לגוף. בקשו מהקרן את ההגדרה ואת רשימת המסמכים",
        },
        # תקנות הנוטריונים (שכר שירותים), התשל"ט-1978, נוסח עדכני ל-1.1.2026: פרט 6 (קבלה ואישור של תצהיר), פרט 10.
        "notary": {
            "regulation_he": "תקנות הנוטריונים (שכר שירותים), התשל\"ט-1978",
            "url": NOTARY_FEES,
            "from": "2026-01-01",
            "affidavit_first": 200,
            "affidavit_additional": 80,
            "affidavit_extra_cert": 77,
            "item": "פרט 6",
            "item_first": "פרט 6(א)",
            "item_additional": "פרט 6(ב)",
            "night_pct": 50,
            "night_item": "פרט 10",
            "fixed_he": "השכר קבוע בתקנות, ועוד מע\"מ (תקנה 1); בין 19:00 ל-08:00 או ביום מנוחה תוספת 50% (פרט 10)",
            "when_he": "אם גוף מבקש מכם תצהיר על החיים המשותפים (קרן, בנק, מעסיק), תצהיר אחד ששניכם חותמים עליו אצל נוטריון",
        },
        # מבחני מד ההוכחה: כל מבחן בשמו מתוך החוק או פסק הדין.
        "tests": [
            {"key": "family", "he": "חיי משפחה", "section": "חוק הירושה, סעיף 55", "url": SUCCESSION,
             "why_he": "קשר זוגי של חיים משותפים: מערכת יחסים אינטימית, קשירת גורל ורצון לחיות יחד (הגדרת הביטוח הלאומי)"},
            {"key": "household", "he": "משק בית משותף", "section": "חוק הירושה, סעיף 55", "url": SUCCESSION,
             "why_he": "מגורים יחד וניהול כלכלה משותפת של הבית"},
            {"key": "single", "he": "אף אחד מכם לא נשוי לאחר", "section": "חוק הירושה, סעיפים 55 ו-57(ג)", "url": SUCCESSION,
             "why_he": "תנאי לירושה ולמזונות מן העיזבון, בשעת המוות"},
            {"key": "roof", "he": "תחת קורת גג אחת שנה לפחות (חצי שנה מגיל 55), או ילד משותף", "section": "חוק הביטוח הלאומי, סעיף 238", "url": NII_CH11,
             "why_he": "תנאי לקצבת שארים מהביטוח הלאומי; הילד המשותף מספיק לאלמנה, לא לאלמן"},
            {"key": "sharing", "he": "אורח חיים תקין ומאמץ משותף", "section": "ע\"א 52/80, תקציר א(5)", "url": RULING_52_80,
             "why_he": "חזקת השיתוף ברכוש: כוונה לשתף בנכס, שמוכיחים מהנסיבות"},
        ],
    }
