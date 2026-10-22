"""The cost and fee estimator of a medical-malpractice claim (alut-tviaa-refuit) on /medical-malpractice-cost/: the
medical-malpractice wave (22.10.2026, HAD-594). Discovered by tools/justice_tools_malpractice.py (glob), built with
--malpractice-checked-on.

What this file adds, and what it does NOT repeat: the magistrates' court amount (2,500,000 on the filing day, Courts Law
s.51(a)(2); the district court above it, s.40(1)) stays in reg.small_claims; the VAT rate (18%, the VAT rate order s.1),
the road-accident fee caps (8/11/13%, road law s.16(a) and the Bar rules of 1977), the rest-day rule (Interpretation Law
s.10(c)) and the listed Independence days stay in reg.car_accident. All are read from there. Here: the Court Fees
Regulations 2007 for a claim for bodily injury (reg.1 the definition, reg.5 the fixed fee and who pays its parts at each
ending, reg.11 the yearly update, reg.12 indexation, reg.14 the exemption, reg.19 legal-aid parties, items 2, 9, 34 and 35
of the schedule as in force from 1.1.2026), the Civil Procedure Regulations 2018 on medical experts (reg.87 the opinion
attached to the claim and the counter-opinion, regs.88-92 the court's expert and who pays, reg.93) and on costs (regs.
151-157), the Bar Association Law 1961 (ss.81-87: no maximum fee unless set; an excessive contingency fee), the Bar ethics
rules (rule 9(b) a percentage fee, rule 10 the lawyer may carry witness and court expenses), and Legal Aid (the Law ss.2-6,
the Regulations regs.1A, 2, 3A, 5, 8 and the first schedule, the Ministry of Justice service page and its eligibility table
from 1.2.2026).

Every value was read on checked_on from the official text named next to it (Nevo's consolidated texts, the judiciary's fee
notice on gov.il, the Ministry of Justice's legal-aid pages). Nothing here is estimated. No official tariff exists for a
private expert opinion: the few published ranges kept below are labelled official=False, are shown only as "what firms and
institutes publish", and are never added to a total unless the reader picks one.
"""
from __future__ import annotations

KEY = "malpractice_mechir"

FEES_REGS = "https://www.nevo.co.il/law_html/law00/74160.htm"     # תקנות בתי המשפט (אגרות), התשס"ז-2007 (נוסח ל-1.1.2026)
FEES_NOTICE = "https://www.gov.il/BlobFolder/guide/fee_guide/he/8869-11-19_fees_cf1126.pdf"  # הודעת בתי המשפט (אגרות), התשפ"ו-2025
FEES_GUIDE = "https://www.gov.il/he/pages/fee_guide?chapterIndex=1"   # הרשות השופטת: אגרות בבתי המשפט - כללי (עודכן 7.9.2026)
CPR = "https://www.nevo.co.il/law_html/law00/157751.htm"           # תקנות סדר הדין האזרחי, התשע"ט-2018 (נוסח ל-19.10.2026)
COURTS = "https://www.nevo.co.il/law_html/law00/74849.htm"         # חוק בתי המשפט [נוסח משולב] (נוסח ל-1.9.2026)
BAR_LAW = "https://www.nevo.co.il/law_html/law01/p179_001.htm"     # חוק לשכת עורכי הדין, התשכ"א-1961
ETHICS = "https://www.nevo.co.il/law_html/law00/4415.htm"          # כללי לשכת עורכי הדין (אתיקה מקצועית), התשמ"ו-1986
ROAD = "https://www.nevo.co.il/law_html/law00/4554.htm"            # חוק פיצויים לנפגעי תאונות דרכים (נוסח ל-14.8.2025)
LEGAL_AID_LAW = "https://www.nevo.co.il/law_html/Law01/325_001.htm"   # חוק הסיוע המשפטי, התשל"ב-1972 (נוסח ל-15.6.2026)
LEGAL_AID_REGS = "https://www.nevo.co.il/law_html/Law01/325_003.htm"  # תקנות הסיוע המשפטי, התשל"ג-1973
LEGAL_AID_SERVICE = "https://www.gov.il/he/service/legal_aid_application"  # משרד המשפטים, עודכן 16.8.2026
LEGAL_AID_TABLE = "https://www.gov.il/BlobFolder/service/legal_aid_application/he/application-1701.pdf"  # מ-1.2.2026


def build(checked_on: str) -> dict:
    """The cost of a medical-malpractice claim: the court, the court fee and who pays it, experts, the lawyer's fee,
    costs when the claim fails, and legal aid."""
    return {
        "name_he": "כמה עולה תביעת רשלנות רפואית: אגרה, מומחים, שכר טרחה, מע\"מ וסיוע משפטי",
        "publisher_he": "תקנות בתי המשפט (אגרות), הודעת בתי המשפט (אגרות) התשפ\"ו-2025, תקנות סדר הדין האזרחי, "
                        "חוק לשכת עורכי הדין, חוק הסיוע המשפטי ותקנותיו, משרד המשפטים",
        "source_name": "תקנות בתי המשפט (אגרות), התשס\"ז-2007 (נוסח עדכני ל-1.1.2026)",
        "source_url": FEES_REGS,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        # reg.11: the amounts of the schedule are updated every 1 January by the November CPI.
        "next_update": "2027-01-01",
        # Which court: the amount and the sections are read from reg.small_claims (magistrate_max, s.51(a)(2), s.40(1)).
        "court": {
            "he": "חוק בתי המשפט [נוסח משולב], התשמ\"ד-1984",
            "url": COURTS,
            "current_to": "2026-09-01",
            "filing_day_he": "הסכום נבחן ביום הגשת התביעה, גם אם עלה אחר כך בגלל שערוך, הצמדה, ריבית, הוצאות משפט ושכר טרחה",
            "magistrate_he": "בית משפט השלום",
            "district_he": "בית המשפט המחוזי",
        },
        # Court Fees Regulations 2007: a claim for compensation for bodily injury pays a FIXED fee, in parts.
        "fees": {
            "he": "תקנות בתי המשפט (אגרות), התשס\"ז-2007",
            "url": FEES_REGS,
            "current_to": "2026-01-01",
            "notice_he": "הודעת בתי המשפט (אגרות), התשפ\"ו-2025",
            "notice_url": FEES_NOTICE,
            "from": "2026-01-01",
            "guide_he": "הרשות השופטת: אגרות בבתי המשפט",
            "guide_url": FEES_GUIDE,
            "definition_section": "תקנה 1",
            "definition_he": "תביעה לפיצויים בשל נזק גוף כוללת גם תביעה לשיפוי או לפיצוי על פנסיה, תגמולים וכל הוצאה אחרת ששולמו או שישולמו בשל נזקי גוף",
            "rule_section": "תקנה 5(א)",
            "rule_he": "בתביעה לפיצויים בשל נזקי גוף האגרה היא סכום קבוע (פרט 2 בבית משפט השלום, פרט 9 בבית המשפט המחוזי), ולא אחוז מהסכום הנתבע",
            # The schedule as in force from 1.1.2026 (the notice of 2025 under reg.11; the same amounts on Nevo).
            "magistrate": {"full": 8061, "full_item": "פרט 2", "first": 839, "first_item": "פרט 34"},
            "district": {"full": 50380, "full_item": "פרט 9", "first": 1429, "first_item": "פרט 35"},
            "first_section": "תקנה 5(ב)(1)",
            "first_he": "עם הגשת התביעה התובע משלם רק את החלק הראשון (פרט 34 בשלום, פרט 35 במחוזי), גם בבקשה לתשלום תכוף",
            "early_section": "תקנה 5(ב)(2)",
            "early_sessions": 3,
            "early_he": "ההליך בוטל או נמחק בידי התובע, הסתיים בפשרה, הועבר לבוררות או הסתיים בהסדר גישור לפני שהסתיימה ישיבת קדם המשפט השלישית: אין יתרה לשלם",
            "third_section": "תקנה 5(ב)(3)",
            "third_div": 3,
            "third_he": "ההליך בוטל, נמחק או נדחה לפני שהחלה שמיעת הראיות (ולא לפי תקנה 5(ב)(2)): התובע משלם שליש מהאגרה, בניכוי מה ששילם ובתוספת הפרשי הצמדה",
            "defendant_third_section": "תקנה 5(ב)(4)",
            "defendant_third_he": "ההליך הסתיים בפשרה, בבוררות או בגישור לפני שהחלה שמיעת הראיות (ולא לפי תקנה 5(ב)(2)): הנתבע משלם שליש מהאגרה בניכוי מה ששילם התובע, ומחזיר לתובע את מה ששילם בתוספת הפרשי הצמדה",
            "defendant_full_section": "תקנה 5(ב)(5)",
            "defendant_full_he": "פסק דין לחובת הנתבע, או פשרה, בוררות או גישור אחרי שהחלה שמיעת הראיות: הנתבע משלם את האגרה בניכוי מה ששילם התובע, ומחזיר לתובע את מה ששילם בתוספת הפרשי הצמדה",
            "waive_section": "תקנה 5(ב)(6)",
            "waive_he": "הליך שהסתיים בגישור או הועבר לבוררות (ולא לפי תקנה 5(ב)(2)): בית המשפט רשאי להורות שלא תשולם היתרה, אבל החלק הראשון לא מוחזר",
            "dismissed_section": "תקנה 5(ב)(7)",
            "dismissed_he": "התביעה נדחתה או נמחקה בפסק דין: התובע משלם את מלוא האגרה, בניכוי מה ששילם ובתוספת הפרשי הצמדה",
            "low_section": "תקנה 5(ג)",
            "low_pct": 60,
            "low_he": "תביעה במחוזי שבה הפיצוי שנפסק או שהוסכם נמוך מ-60% מסכום הסמכות של בית משפט השלום ביום ההגשה: הנתבע משלם את האגרה כשיעורה בבית משפט השלום, והתובע משלים את האגרה של המחוזי",
            "index_section": "תקנה 12",
            "index_he": "אגרה שלא שולמה במועד משולמת בתוספת הפרשי הצמדה למדד",
            "demand_section": "תקנה 2(ו)",
            "demand_days": 20,
            "demand_he": "התברר שהאגרה לא שולמה: נשלחת דרישת תשלום; לא שולמה בתוך 20 ימים מהמצאת הדרישה, בית המשפט רשאי למחוק את ההליך",
            "update_section": "תקנה 11",
            "update_he": "הסכומים מתעדכנים ב-1 בינואר של כל שנה לפי מדד המחירים לצרכן של נובמבר, ומעוגלים לשקל השלם",
            "exempt": {
                "section": "תקנה 14",
                "request_section": "תקנה 14(ב)",
                "request_days": 15,
                "request_he": "בתביעה לפיצויים בשל נזק גוף, בקשה לפטור מאגרה מוגשת לא יאוחר מ-15 ימים מהמועד שנקבע לתשלום האגרה לפי תקנה 5",
                "affidavit_section": "תקנה 14(א)",
                "affidavit_he": "הבקשה מוגשת עם תצהיר על הרכוש של המבקש, של בן הזוג ושל ההורים אם הוא סמוך על שולחנם, ועל ההכנסות בששת החודשים שלפני הבקשה",
                "test_section": "תקנה 14(ג)",
                "test_he": "בית המשפט רשאי לפטור, כולו או חלקו, אם אין ביכולת המבקש לשלם וההליך מגלה עילה",
                "evidence_section": "תקנה 14(ד)-(ה)",
                "evidence_he": "ראיה לכאורה לחוסר יכולת: פטור מאגרה בשנתיים האחרונות, חייב מוגבל באמצעים, פשיטת רגל או צו לפתיחת הליכי חדלות פירעון, או קבלת גמלת הבטחת הכנסה ביום הבקשה",
                "installments_section": "תקנה 14(ז)",
                "installments_he": "בית המשפט רשאי להתיר תשלום בשיעורים, בתוך זמן שיקבע",
                "winner_section": "תקנה 14(י)",
                "winner_he": "מי שקיבל פטור וזכה בתביעה: בית המשפט רשאי לחייב את הצד שכנגד בתשלום האגרה",
                "legal_aid_section": "תקנה 19(א)(7)",
                "legal_aid_he": "מי שמיוצג בידי עורך דין מטעם הסיוע המשפטי, בהליך שאושר לו כי ידו אינה משגת: פטור מאגרה",
            },
        },
        # Civil Procedure Regulations 2018 (in force from 1.1.2021): medical experts and costs.
        "experts": {
            "he": "תקנות סדר הדין האזרחי, התשע\"ט-2018",
            "url": CPR,
            "current_to": "2026-10-19",
            "from": "2021-01-01",
            "attach_section": "תקנה 87(א)",
            "attach_he": "מי שרוצה להוכיח עניין שברפואה מצרף לכתב הטענות חוות דעת של מומחה בתחום מומחיותו",
            "exam_section": "תקנה 87(ב)",
            "exam_he": "הנתבע רשאי לדרוש בכתב שהתובע ייבדק בידי מומחה מטעמו",
            "counter_section": "תקנה 87(ג)",
            "counter_days": 60,
            "counter_he": "תובע שרוצה לחלוק על חוות הדעת שצורפה לכתב ההגנה מגיש חוות דעת נגדית בתוך 60 ימים מהיום שהומצאה לו, או בזמן אחר שבית המשפט קבע",
            "postpone_section": "תקנה 87(ד)",
            "postpone_he": "בית המשפט רשאי לפטור מצירוף חוות הדעת או לדחות את מועד הגשתה; מבקשים זאת לכל המאוחר עם כתב התביעה",
            "missing_section": "תקנה 93(א)",
            "missing_he": "מי שלא צירף חוות דעת רפואית ולא קיבל פטור לא יוכל להשמיע עדות של מומחה רפואי מטעמו, אלא מטעמים מיוחדים",
            "no_tariff_he": "לחוות דעת של מומחה רפואי פרטי אין תעריף רשמי: המחיר נקבע בהסכם בין המזמין לבין המומחה",
            "court_section": "תקנה 88",
            "court_he": "בית המשפט רשאי בכל עת למנות מומחה מטעמו; הוא שוקל בין השאר את שווי התביעה, עניינה והיקף המחלוקת בין המומחים",
            "court_due_section": "תקנה 91(א)",
            "court_due_days": 60,
            "questions_section": "תקנה 91(ג)",
            "questions_days": 14,
            "questions_he": "בקשת רשות לשלוח למומחה של בית המשפט שאלות הבהרה: לא יאוחר מ-14 ימים מקבלת חוות הדעת",
            "pay_section": "תקנה 92(א)",
            "pay_he": "בית המשפט קובע את שכרו והוצאותיו של המומחה מטעמו ואת אופן התשלום, ורשאי להטיל אותם על בעלי הדין או על אחד מהם",
            "deposit_section": "תקנה 92(ב)",
            "deposit_he": "בית המשפט רשאי להורות להפקיד ערובה לשכר המומחה או לשלם לו ישירות, ובגמר המשפט הוא מחליט מי יישא בשכר",
            "count_section": "תקנה 179",
            "count_he": "מונים את הימים מיום המצאת המסמך, וימי פגרה של בית המשפט לא נספרים, אלא אם בית המשפט הורה אחרת; הכלי לא מנכה ימי פגרה ומציג את המועד המוקדם",
            "fail_section": "תקנה 92(ג)",
            "fail_he": "מי שלא שילם כפי שהורו לו: בית המשפט רשאי למחוק את כתבי הטענות שלו או לדחות את הדיון",
            # NOT official. Published by firms and institutes that sell or arrange opinions; shown labelled, never totalled.
            "published_ranges": [
                {"name_he": "מדאופיניון (מכון לחוות דעת רפואיות)", "url": "https://www.medopinion.co.il/%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%97%D7%95%D7%95%D7%AA-%D7%93%D7%A2%D7%AA-%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA/",
                 "host": "medopinion.co.il", "read_on": checked_on, "official": False, "low": 5000, "high": 20000,
                 "range_he": "מתחילה ב-5,000 ש\"ח, בדרך כלל לא פחות מ-10,000 ש\"ח, ויכולה להגיע ל-20,000 ש\"ח ויותר"},
                {"name_he": "נסים-דר, עורכי דין", "url": "https://www.gn-law.co.il/%D7%97%D7%95%D7%95%D7%AA-%D7%93%D7%A2%D7%AA-%D7%9E%D7%95%D7%9E%D7%97%D7%94-%D7%A8%D7%A4%D7%95%D7%90%D7%99/",
                 "host": "gn-law.co.il", "read_on": checked_on, "official": False, "low": 10000, "high": 20000,
                 "range_he": "בין 10,000 ל-20,000 ש\"ח ואף יותר; בהריון ובלידה עשויה לעבור 30,000 ש\"ח"},
                {"name_he": "פורום רופאים (מאמר של עורך דין)", "url": "https://www.forum-md.co.il/%D7%97%D7%95%D7%95%D7%AA-%D7%93%D7%A2%D7%AA-%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%AA/%D7%A2%D7%9C%D7%95%D7%AA-%D7%97%D7%95%D7%95%D7%AA-%D7%93%D7%A2%D7%AA-%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA-%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%AA/",
                 "host": "forum-md.co.il", "read_on": checked_on, "official": False, "low": None, "high": None,
                 "range_he": "מאלפי שקלים ועד עשרות אלפי שקלים, בלי מספר"},
                {"name_he": "דין (מאמר מ-14.5.2018)", "url": "https://www.din.co.il/articles/4211/B-23189/",
                 "host": "din.co.il", "read_on": checked_on, "official": False, "low": None, "high": None,
                 "range_he": "מכמה אלפי שקלים ועד עשרות אלפי שקלים, בלי מספר"},
                {"name_he": "ד\"ר עופר בר (רופא שכותב חוות דעת)", "url": "https://doctorbar.co.il/%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%97%D7%95%D7%95%D7%AA-%D7%93%D7%A2%D7%AA-%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA/",
                 "host": "doctorbar.co.il", "read_on": checked_on, "official": False, "low": None, "high": None,
                 "range_he": "בלי סכום: \"הגבוהה בקטגוריה\" ברשלנות רפואית, הכנה של 30 עד 60 ימים"},
            ],
        },
        # The lawyer's fee: no maximum for a malpractice claim in the texts read; the road-accident cap does not apply.
        "fee": {
            "cap_he": "לא מצאנו חוק, תקנה או כלל שקובעים תקרה לשכר טרחה של עורך דין בתביעת רשלנות רפואית. האחוז נקבע בהסכם בכתב בינכם לבין עורך הדין",
            "road_section": "סעיף 16(א)",
            "road_he": "התקרה של 8%, 11% ו-13% חלה רק על תביעות לפי חוק הפיצויים לנפגעי תאונות דרכים (סעיף 16(א) לחוק וכללי הלשכה מ-1977), ולא על תביעת רשלנות רפואית",
            "road_url": ROAD,
            "bar_he": "חוק לשכת עורכי הדין, התשכ\"א-1961",
            "bar_url": BAR_LAW,
            "minimum_section": "סעיף 81",
            "minimum_he": "התעריף המינימלי של הלשכה הוא המלצה שאינה מחייבת",
            "max_section": "סעיף 82",
            "max_he": "תעריף מקסימלי חל רק על סוגי שירותים ששר המשפטים קבע בתקנות",
            "excessive_section": "סעיף 84(ב)",
            "excessive_he": "שכר שתלוי בתוצאה, בעניין שאינו פלילי, שנראה ללשכה מופרז: הלשכה רשאית, לבקשת הלקוח, לקבוע את השכר המתאים",
            "separate_section": "סעיף 85",
            "separate_he": "אסור לגבות סכום אחד שכולל שכר טרחה והוצאות בלי להפריד ביניהם ובלי לפרט את ההוצאות",
            "refund_section": "סעיף 87",
            "refund_he": "מי ששילם יותר מהמגיע לפי סעיפים 82, 84 או 86 רשאי לדרוש את ההחזר, על אף כל הסכם",
            "ethics_he": "כללי לשכת עורכי הדין (אתיקה מקצועית), התשמ\"ו-1986",
            "ethics_url": ETHICS,
            "pct_section": "כלל 9(ב)",
            "pct_he": "מותר לחשב שכר טרחה כאחוז מנושא העניין, כשהדין מאפשר זאת",
            "expenses_section": "כלל 10",
            "expenses_he": "עורך דין רשאי לקבל על עצמו אחריות אישית להוצאות עדים ולהוצאות משפט אחרות",
            "base_he": "הכלי מחשב את האחוז על סכום הפיצוי שהזנתם. בדקו בהסכם על מה האחוז מחושב (עם או בלי הוצאות משפט וריבית) ומי מממן את חוות הדעת",
        },
        # Costs (CPR 2018 regs.151-157): what a party that loses may be ordered to pay. Words, never a number.
        "costs": {
            "purpose_section": "תקנה 151(א)",
            "purpose_he": "חיוב בהוצאות נועד לשפות את הצד שכנגד על הוצאותיו, לפי תוצאות ההליך, המשאבים שנדרשו והתנהלות הצדדים",
            "balance_section": "תקנה 151(ב)",
            "balance_he": "ההחלטה מאזנת בין זכות הגישה לבית המשפט, זכות הקניין והשוויון בין הצדדים",
            "award_section": "תקנה 152",
            "award_he": "בתום הדיון בית המשפט פוסק הוצאות סבירות והוגנות, אלא אם מצא טעמים מיוחדים שלא לחייב",
            "tariff_section": "תקנה 153(א)",
            "tariff_he": "שכר הטרחה שנפסק לטובת הזוכה לא יפחת מהתעריף המינימלי המומלץ של הלשכה, אלא מטעמים מיוחדים",
            "vat_section": "תקנה 153(ב)",
            "vat_he": "שכר הטרחה שנפסק כולל סכום השווה למע\"מ כשהזוכה שילם מע\"מ לעורך דינו",
            "factors_section": "תקנה 153(ג)",
            "factors_he": "בית המשפט מתחשב בשווי מה שנפסק מול מה שנתבע, בדרך ניהול הדיון, במורכבות ובמשאבים",
            "expenses_section": "תקנה 155(א)",
            "expenses_he": "הוצאות משפט (כמו חוות דעת) נפסקות רק אם פורטו בסיכומים במפורש, עם מסמכים",
            "security_section": "תקנה 157",
            "security_he": "בית המשפט רשאי לצוות על תובע לתת ערובה להוצאות הנתבע; לא ניתנה במועד, כתב התביעה נמחק",
        },
        # Legal Aid (Ministry of Justice): torts are within the matters; a means test and a merits test.
        "legal_aid": {
            "law_he": "חוק הסיוע המשפטי, התשל\"ב-1972",
            "law_url": LEGAL_AID_LAW,
            "law_current_to": "2026-06-15",
            "regs_he": "תקנות הסיוע המשפטי, התשל\"ג-1973",
            "regs_url": LEGAL_AID_REGS,
            "service_he": "משרד המשפטים: בקשה לסיוע משפטי",
            "service_url": LEGAL_AID_SERVICE,
            "service_updated": "2026-08-16",
            "table_he": "הסיוע המשפטי: זכאות כלכלית לסיוע משפטי החל מיום 1.2.26",
            "table_url": LEGAL_AID_TABLE,
            "matters_section": "תקנה 5(3)",
            "matters_he": "הסיוע ניתן בעניינים כספיים, לרבות נזיקין: תביעת רשלנות רפואית היא תביעת נזיקין",
            "means_section": "תקנה 2(ב)",
            "means_he": "יחיד או משפחה עד שלוש נפשות: הכנסה עד 67% מהשכר הממוצע במשק, ועוד 6% לכל נפש מהרביעית; ואין רכוש שאפשר לממש או ללוות בשבילו",
            "income_pct": 67,
            "extra_pct": 6,
            "property_times": 3,
            "base_persons": 3,
            # The Ministry's published table (from 1.2.2026; average wage 13,769 from 1.1.2026).
            "table_from": "2026-02-01",
            "income_base": 9225,
            "per_person": 826,
            "property_max": 41307,
            "avg_wage": 13769,
            "merits_section": "סעיף 4",
            "merits_he": "ראש הלשכה רשאי לדחות בקשה שאין לה בסיס סביר מבחינת הדין, העובדות או הראיות: נבחן גם הסיכוי של התביעה",
            "participation_section": "תקנה 1א",
            "participation_from": "2026-01-01",
            "participation_low": 78,
            "participation_high": 157,
            "participation_he": "אגרת השתתפות: 78 ש\"ח למי שהכנסתו עד מחצית הסכום שמזכה בסיוע, 157 ש\"ח מעליה",
            "advance_section": "תקנה 3א(א)",
            "advance": 39,
            "advance_he": "הבקשה נבדקת רק אחרי תשלום מקדמה של 39 ש\"ח, שנזקפת על חשבון אגרת ההשתתפות",
            "lawyer_he": "שכר עורך הדין שהסיוע ממנה משולם בידי הסיוע המשפטי ולא בידי מגיש הבקשה",
            "costs_he": "הוצאות שבית המשפט מטיל על מי שמיוצג בסיוע המשפטי: הסיוע לא נושא בהן",
            "awarded_section": "סעיף 6",
            "awarded_he": "הוצאות ושכר טרחה שנפסקו לטובת מי שקיבל סיוע רואים כאילו נפסקו לטובת אוצר המדינה, והלשכה מחזירה לו הוצאות סבירות שהוציא בעצמו",
            "repay_section": "תקנה 8(ב)",
            "repay_he": "פסק דין שמזכה בכספים שמאפשרים לשאת בהוצאות השירות: לפי דרישת ראש הלשכה מחזירים אותן, כולן או חלקן",
            "experts_section": "התוספת הראשונה",
            "experts_he": "הסיוע משלם הוצאות נחוצות, בהן שכר עדים מומחים ורופאים, עד הסכום שנקבע",
        },
        # What changed and when: only values an official text dates.
        "changes": [
            {"from": "2021-01-01", "he": "תקנות סדר הדין האזרחי, התשע\"ט-2018 נכנסו לתוקף: חוות דעת רפואית מצורפת לכתב הטענות (תקנה 87)", "src_he": "תקנה 180(ג) לתקנות סדר הדין האזרחי", "url": CPR},
            {"from": "2025-01-01", "he": "מע\"מ: 18% במקום 17% (גם על שכר טרחה)", "src_he": "צו מס ערך מוסף (שיעור המס), צו תשפ\"ד-2024", "url": "https://www.nevo.co.il/law_html/law01/999_481.htm"},
            {"from": "2025-01-01", "he": "סיוע משפטי: אגרת השתתפות 77 ש\"ח או 153 ש\"ח", "src_he": "תקנה 1א לתקנות הסיוע המשפטי, הודעה תשפ\"ה-2024", "url": LEGAL_AID_REGS},
            {"from": "2026-01-01", "he": "אגרת תביעת נזקי גוף: 839 ש\"ח בהגשה בשלום ו-1,429 ש\"ח במחוזי; האגרה המלאה 8,061 ש\"ח ו-50,380 ש\"ח", "src_he": "הודעת בתי המשפט (אגרות), התשפ\"ו-2025, לפי תקנה 11", "url": FEES_NOTICE},
            {"from": "2026-01-01", "he": "סיוע משפטי: אגרת השתתפות 78 ש\"ח או 157 ש\"ח", "src_he": "תקנה 1א לתקנות הסיוע המשפטי, הודעה תשפ\"ו-2025", "url": LEGAL_AID_REGS},
            {"from": "2026-02-01", "he": "סיוע משפטי: מבחן הכנסה עד 9,225 ש\"ח ליחיד או למשפחה עד 3 נפשות, ועוד 826 ש\"ח לכל נפש; רכוש עד 41,307 ש\"ח", "src_he": "משרד המשפטים, טבלת זכאות כלכלית מ-1.2.26", "url": LEGAL_AID_TABLE},
        ],
    }
