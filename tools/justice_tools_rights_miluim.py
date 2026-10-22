"""The reserve-duty dataset of the co.il tools registry (rights guide wave 2B, 21.10.2026): the tagmulei-miluim instrument on
/miluim-dismissal-protection/ (reserve-duty pay, the grants the IDF publishes for 2026, and the dismissal protection).
Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES) through KEY and build().

Every value was read on checked_on from the official text named next to it:
- the National Insurance Institute's reserve-service pages (conditions, the amount and the 40% addition, payment by status,
  the claim, deductions, the employer, the self-employed compensation, the change of 1.5.2025, the wartime pages, the
  calculator page) and the National Insurance Law [Consolidated Version], 1995, in the Institute's own consolidated text
  (btl.gov.il/Laws1): chapter 12 (sections 270-286), chapter 14 (section 296) and chapter 1 (the definition of a benefit);
- the Discharged Soldiers (Return to Work) Law, 1949 (nevo, current to 20.10.2026): sections 20, 21, 23, 41א, 41א1, 41א2, 41ג;
- the Equal Employment Opportunities Law, 1988 (nevo): section 2(א);
- the extension order of the collective agreement on reservists and their partners (Yalkut Hapirsumim 14498, 29.4.2026,
  gov.il) and the 2024 order it follows (Yalkut Hapirsumim 12159, 6.3.2024, published on miluim.idf.il);
- the IDF reservists' site (miluim.idf.il): the 2026 policy of rewards, grants and benefits (government decision of
  25.1.2026), the 2025 policy, the rewards page, the legal-representation page and the tax-credit page.

The pay figures derive from rights_btl: the maximum is basic amount 3 (10,382 from 1.1.2026) x 5 = 51,910 a month, / 30 =
1,730.33 a day; the minimum is 95% of it = 9,862.90, published as 9,863 a month, / 30 = 328.76 a day (s.270). build()
derives both from rights_btl and stops if the derivation does not give the Institute's published 2026 figures, so a new basic
amount is never trusted without a check. Nothing here is estimated; a figure the sources do not hold is not in the file (see
parts/tagmulei-miluim/notes.md).
"""
from __future__ import annotations

from justice_tools_rights import build_rights_btl

KEY = "rights_miluim"

BTL = "https://www.btl.gov.il/benefits/Reserve_Service/"
MAIN = BTL + "Pages/default.aspx"                                                                    # מילואים: דף הענף
CONDITIONS = BTL + "Pages/%d7%aa%d7%a0%d7%90%d7%99%20%d7%96%d7%9b%d7%90%d7%95%d7%aa.aspx"          # תנאי הזכאות
AMOUNT = BTL + "Pages/%d7%a9%d7%99%d7%a2%d7%95%d7%a8%d7%99%20%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx"   # סכום התגמול (2026)
BY_STATUS = BTL + "Pages/TagmulZacay.aspx"                                                          # תשלום התגמול לפי סוגי זכאים
CLAIM = BTL + ("Pages/%d7%9e%d7%a7%d7%95%d7%9d%20%d7%95%d7%90%d7%95%d7%a4%d7%9f%20%d7%94%d7%94%d7%92%d7%a9%d7%94"
               ".aspx")                                                                              # אופן הגשת התביעה
DEDUCTIONS = BTL + ("Pages/%d7%a0%d7%99%d7%9b%d7%95%d7%99%d7%99%d7%9d%20%d7%9e%d7%aa%d7%a9%d7%9c%d7%95%d7%9d%20"
                    "%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx")                                           # ניכויים מתשלום התגמול
EMPLOYER = BTL + "Pages/%d7%9e%d7%99%d7%93%d7%a2%20%d7%9c%d7%9e%d7%a2%d7%a1%d7%99%d7%a7.aspx"       # מעסיק עובד המשרת במילואים
SELF_COMP = BTL + "Pages/hefreshimLeatzmayi.aspx"                                                   # פיצוי לעובד עצמאי
CHANGE_2025 = BTL + "Pages/HisovTAGMOLSatHIROM.aspx"                                                # השינוי מ-1.5.2025
RAISE = BTL + "TosefetTAGMOL/Pages/default.aspx"                                                    # תוספת למי ששכרו עלה
OTHER_BENEFITS = BTL + ("Pages/%d7%9c%d7%9e%d7%a7%d7%91%d7%9c%20%d7%a7%d7%a6%d7%91%d7%90%d7%95%d7%aa%20"
                        "%d7%a0%d7%95%d7%a1%d7%a4%d7%95%d7%aa%20%d7%91%d7%9e%d7%95%d7%a1%d7%93.aspx")  # למקבל קצבאות נוספות
APPEAL = BTL + "Pages/irur.aspx"                                                                    # ערעור על החלטות המוסד
CALCULATOR = BTL + "Pages/Calculator.aspx"                                                          # מחשבון התגמולים של המוסד
WAR = "https://www.btl.gov.il/HaravotBarzel1/KizbeotHB/MiloeimHB/Pages/MsrtimMiloeim.aspx"         # משרתים במילואים (תקופת חירום)
WAR_2026 = "https://www.btl.gov.il/StateOfEmergency/ShaagatHari/KizbeotHB/MiloeimHB/Pages/MsrtimMiloeim.aspx"  # אותו דף במלחמת 2026
FORM_502 = "https://www.btl.gov.il/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/forms/Reserve_Service_forms/Pages/502.aspx"  # תביעה אישית (502)
DIFF_FORM = "https://forms.btl.gov.il/Form/NkStart/TviaLehefresh"                                  # תביעת הפרש (עלייה מעל 20%)
LAW = "https://www.btl.gov.il/Laws1/00_0001_000012.pdf"                                            # חוק הביטוח הלאומי, פרק י"ב (270-286)
CLAIMS_LAW = "https://www.btl.gov.il/Laws1/00_0001_000014.pdf"                                     # חוק הביטוח הלאומי, פרק י"ד (296)
GENERAL_LAW = "https://www.btl.gov.il/Laws1/00_0001_000001.pdf"                                    # חוק הביטוח הלאומי, פרק א' (הגדרת "גמלה")
SOLDIERS_LAW = "https://www.nevo.co.il/law_html/law00/71925.htm"                                   # חוק החיילים המשוחררים (החזרה לעבודה)
EQUAL_LAW = "https://www.nevo.co.il/law_html/law00/5016.htm"                                       # חוק שוויון ההזדמנויות בעבודה
ORDER_2026 = "https://www.gov.il/BlobFolder/legalinfo/tak-14498/he/laws_tk-14498.pdf"              # צו ההרחבה, י"פ 14498, 29.4.2026
ORDER_2024 = ("https://api.miluim.idf.il/api/v1/Media/ooahuywl/"
              "%D7%A6%D7%95-%D7%94%D7%A8%D7%97%D7%91%D7%94-%D7%AA%D7%A2%D7%A1%D7%95%D7%A7%D7%AA%D7%99.pdf")  # צו ההרחבה, י"פ 12159, 6.3.2024
IDF = "https://www.miluim.idf.il/articles-list/"
POLICY_2026 = IDF + "%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-2026/"                             # מדיניות 2026 (החלטת ממשלה 25.1.2026)
POLICY_2025 = IDF + "%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-2025/"                             # מדיניות 2025 (החלטת ממשלה 2540)
REWARDS = IDF + "%D7%AA%D7%92%D7%9E%D7%95%D7%9C%D7%99%D7%9D-2025/"                                 # תגמולים (לשנת 2025, שולמו ב-2026)
LEGAL_AID = IDF + "%D7%99%D7%99%D7%A6%D7%95%D7%92-%D7%9E%D7%A9%D7%A4%D7%98%D7%99/"                 # ייצוג משפטי במימון משרד הביטחון
TAX_POINTS = IDF + ("%D7%97%D7%99%D7%99%D7%9C%D7%99-%D7%9E%D7%99%D7%9C%D7%95%D7%90%D7%99%D7%9D-%D7%91%D7%9E%D7%A2%D7%A8%D7%9A-"
                    "%D7%9E%D7%96%D7%9B%D7%94-%D7%94%D7%98%D7%91%D7%94-%D7%91%D7%9E%D7%A1-%D7%91%D7%93%D7%A8%D7%9A-"
                    "%D7%90%D7%9C%D7%99%D7%9B%D7%9D/")                                              # נקודות זיכוי למשרתי מילואים
FUND = IDF + ("%D7%A7%D7%A8%D7%9F-%D7%94%D7%A1%D7%99%D7%95%D7%A2-%D7%9C%D7%9E%D7%A9%D7%A8%D7%AA%D7%99-"
              "%D7%94%D7%9E%D7%99%D7%9C%D7%95%D7%90%D7%99%D7%9D/")                                  # קרן הסיוע למשרתי המילואים


def _pay(btl: dict) -> dict:
    """The 2026 daily minimum and maximum, derived from basic amount 3 and checked against the Institute's figures."""
    b3 = btl["basic_amount"]["b3"]
    max_month = b3 * 5
    max_daily = round(max_month / 30 + 1e-9, 2)
    min_month_exact = b3 * 95 / 100
    min_daily = round(min_month_exact / 30 + 1e-9, 2)
    published = {"max_month": 51910, "max_daily": 1730.33, "min_month": 9863, "min_daily": 328.76}
    derived = {"max_month": max_month, "max_daily": max_daily, "min_month": round(min_month_exact), "min_daily": min_daily}
    if derived != published:
        raise ValueError(f"rights_miluim: the derived 2026 pay limits {derived} differ from the Institute's {published}: re-read the pages")
    return published


def build(checked_on: str) -> dict:
    """Reserve-duty pay (תגמולי מילואים) for 2026, the 40% addition, the self-employed compensation, the payer and the claim;
    the dismissal protection of the Discharged Soldiers Law and the 2026 extension order; the grants the IDF publishes for
    2026 by activity tier; each with the section or the page it was read from."""
    btl = build_rights_btl(checked_on)
    limits = _pay(btl)
    return {
        "name_he": "תגמולי מילואים, מענקי מילואים והגנה מפיטורים לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי, ענף מילואים; משרד הביטחון וצה\"ל; משרד העבודה",
        "source_name": "המוסד לביטוח לאומי: מילואים (תנאי זכאות, סכום התגמול, תשלום לפי סוגי זכאים, הגשת תביעה); חוק הביטוח הלאומי, פרק י\"ב; חוק החיילים המשוחררים (החזרה לעבודה); צו ההרחבה של 29.4.2026; אתר המילואים של צה\"ל: מדיניות 2026",
        "source_url": MAIN,
        "checked_on": checked_on,
        "refresh_every_days": 90,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, פרק י\"ב: תגמולים למשרתים במילואים",
        "law_url": LAW,
        "claims_law_url": CLAIMS_LAW,
        "general_law_url": GENERAL_LAW,
        "pages": {
            "main": MAIN, "conditions": CONDITIONS, "amount": AMOUNT, "by_status": BY_STATUS, "claim": CLAIM,
            "deductions": DEDUCTIONS, "employer": EMPLOYER, "self_comp": SELF_COMP, "change_2025": CHANGE_2025, "raise": RAISE,
            "other_benefits": OTHER_BENEFITS, "appeal": APPEAL, "calculator": CALCULATOR, "war": WAR, "form_502": FORM_502,
            "diff_form": DIFF_FORM,
        },
        # סעיפים 270, 272 ו-273; סכום התגמול ותשלום לפי סוגי זכאים (btl): השכר ב-3 החודשים שקדמו לחודש השירות חלקי 90;
        # מקסימום 5 פעמים הסכום הבסיסי (51,910 לחודש, 1,730.33 ליום), מינימום 95% ממנו (9,863 לחודש, 328.76 ליום), מ-1.1.2026.
        "pay": {
            "basic_key": "b3", "max_mult": 5, "min_pct": 95, "divisor_month": 30,
            "max_month": limits["max_month"], "max_daily": limits["max_daily"],
            "min_month": limits["min_month"], "min_daily": limits["min_daily"], "from": "2026-01-01",
            "quarter_months": 3, "quarter_divisor": 90, "long_months": 6, "short_days": 60, "month_floor_pct": 68,
            "section_max": "סעיף 270 (התגמול המרבי)", "section_min": "סעיף 270 (התגמול המזערי)", "section_rate": "סעיף 272",
            "section_base": "סעיף 273(א)(1)", "section_floor": "סעיף 273(א)(2)", "section_short": "סעיף 273(ב)",
            "url": AMOUNT, "status_url": BY_STATUS,
            "he": "השכר או ההכנסה ברוטו ב-3 החודשים שקדמו ל-1 בחודש שבו התחיל השירות, חלקי 90, ליום; לא פחות מ-328.76 ש\"ח ולא יותר מ-1,730.33 ש\"ח ליום (מ-1.1.2026)",
            "includes_he": "בחישוב נכללים גם דמי מחלה, דמי לידה, תמורת חופשה, תגמולי מילואים, דמי אבטלה ודמי פגיעה",
            "floor_he": "ההכנסה של כל חודש ברבע השנה נחשבת לפחות 68% מהסכום הבסיסי, גם בחודש בלי עבודה",
            "short_he": "מי שעבד פחות מ-60 ימים ב-3 החודשים: לפי 3 החודשים שבחר מתוך 6 החודשים שקדמו לחודש השירות",
            "min_he": "סטודנט, מי שלא עובד, ומי ששכרו נמוך מהמינימום: 328.76 ש\"ח ליום",
            "min_law_he": "התגמול המזערי הוא 95% מהסכום הבסיסי לחודש, חלקי 30 (תיקון 260, מ-1.1.2026; לפני כן 68%, ולמי שנקרא לשירות בין 7.10.2023 ל-31.12.2025: 95% בהוראת שעה)",
            "bonus_min": 1611, "bonus_months": 12,
            "bonus_he": "תשלום נוסף (בונוס, ביגוד, הבראה) מעל 1,611 ש\"ח (רבע משכר המינימום) מחלקים ב-12 ומוסיפים לחודש התשלום ול-11 החודשים שלפניו",
            "bonus_url": CALCULATOR,
        },
        # סעיף 271(א); סכום התגמול (btl): שבוע של 7 ימים משולם כ-7; יתרה של 6 ימים כ-7; יתרה קטנה מ-6 כפול 1.4.
        "addition": {
            "week": 7, "factor": 1.4, "six": 6, "six_paid": 7, "section": "סעיף 271(א)", "url": AMOUNT,
            # The Institute's own table (service days -> days paid), for the tests. Its row 120 -> 122 breaks its own rule and
            # s.271(א) (120 = 17 x 7 + 1 -> 120.4); the instrument follows the law, and the tests name that row (notes.md).
            "table": [[7, 7], [20, 21], [21, 21], [22, 22.4], [28, 28], [29, 29.4], [33, 35], [42, 42], [44, 44.8], [56, 56],
                      [60, 61.6], [65, 65.8], [70, 70], [75, 77], [80, 81.2], [90, 91], [100, 100.8], [120, 122], [140, 140], [160, 161]],
            "he": "מחלקים את ימי השירות ב-7: כל שבוע משולם כ-7 ימים; שארית של 6 ימים משולמת כ-7, ושארית קטנה מ-6 כפול 1.4 (תוספת של 40%)",
            "war_he": "בתקופת המלחמה: התגמול על ימי השירות משולם בתחילת כל חודש על החודש הקודם, והתוספת חודשיים אחרי סיום השירות",
            "war_url": WAR, "war_2026_url": WAR_2026,
        },
        # סעיף 271(ב); סכום התגמול (btl).
        "half_day": {
            "factor": 0.5, "max_hours": 6, "section": "סעיף 271(ב)", "url": AMOUNT,
            "he": "שירות חצי יומי (עד 6 שעות כולל הנסיעות, לפי אישור צבאי): מחצית מהתגמול ליום",
        },
        # פיצוי לעובד עצמאי (btl): 25% מהתגמול לפי ההכנסה כעצמאי, ולפחות לפי התגמול המזערי; התגמול והפיצוי יחד עד המקסימום ליום.
        "self": {
            "comp_pct": 25, "url": SELF_COMP, "auto_weeks": 3, "claim_url": CLAIM,
            "he": "עצמאי שמדווח ומשלם דמי ביטוח כסדרם מקבל פיצוי של 25% מהתגמול המחושב לפי הכנסתו כעצמאי, ולפי התגמול המזערי כשההכנסה נמוכה ממנו; התגמול והפיצוי יחד לא יותר מ-1,730.33 ש\"ח ליום",
            "basis_he": "בשלב הראשון לפי המקדמות ב-3 החודשים שלפני השירות, חלקי 90; אחרי השומה הסופית החישוב נעשה מחדש: הפרשים משולמים, ותגמול עודף נגבה",
            "auto_he": "ברוב המקרים התגמול משולם לעצמאי אוטומטית לפי דיווח צה\"ל; מי שלא קיבל אותו בתוך 3 שבועות מסיום השירות מגיש תביעה אישית (טופס 502)",
            "years_he": "לשירות בשנים 2023 עד 2025 חלה הוראת שעה: התגמול לפי השומה הסופית או לפי ההכנסה שבבסיס המקדמות, הגבוהה",
        },
        # סעיף 274(א); סכום התגמול (btl): מי שהפסיק לעבוד ולא חלפו יותר מ-60 ימים.
        "stopped": {
            "days": 60, "section": "סעיף 274(א)", "url": AMOUNT,
            "he": "מי שהפסיק לעבוד ולא חלפו יותר מ-60 ימים עד השירות: כאילו יצא למילואים ביום שהפסיק, לפי 3 החודשים שקדמו להפסקת העבודה",
        },
        # סעיף 279(א); סכום התגמול (btl): שירות שהתחיל בתוך 60 ימים מסיום השירות הקודם, אם זה לטובתו.
        "drag": {
            "days": 60, "section": "סעיף 279(א)", "url": AMOUNT,
            "he": "מי שהתחיל שירות בתוך 60 ימים מסיום שירות קודם: אם זה לטובתו, לפי ההכנסה ב-3 החודשים שקדמו לשירות הראשון",
        },
        # סעיף 274ב (תיקון 253, מ-1.5.2025) וסעיף 279(ב); השינוי מ-1.5.25 (btl).
        "emergency": {
            "gap_days": 90, "raise_pct": 20, "raise_months": 3, "from": "2025-05-01",
            "section": "סעיף 274ב", "drag_section": "סעיף 279(ב)", "url": CHANGE_2025, "diff_url": DIFF_FORM,
            "he": "בתקופת חירום (קריאה לפי סעיף 8 לחוק שירות המילואים): שכיר או מי שלא עובד שנקרא לשירות נוסף, וה-1 בחודש השירות חל פחות מ-90 ימים אחרי סיום שירות קודם בתקופת החירום, מקבל תגמול לפי ההכנסה שלפני השירות הראשון בתקופת החירום; עלייה של עד 20% נכנסת לחישוב, ועלייה גבוהה יותר רק אם נמשכה 3 חודשים רצופים לפחות והוכח שהיא מעבודה",
            "page_he": "אם ההכנסה ירדה: לפי ההכנסה הקודמת; עלתה עד 20%: לפי ההכנסה הנוכחית; עלתה ב-20% ומעלה: לפי ההכנסה הקודמת ועוד 20%, והיתרה בבקשת הפרשים",
            "self_he": "השינוי חל על שכיר או מי שלא עובד; משרת ששכרו נפגע בגלל שינוי מעמד (עצמאי שהפך לשכיר וכדומה) מתבקש לפנות למוסד לבדיקה אישית",
        },
        # סעיפים 276, 280; תשלום לפי סוגי זכאים, אופן הגשת התביעה, מעסיק (btl).
        "payer": {
            "employer_days": 75, "section": "סעיף 276(א)", "institute_section": "סעיף 276(ב)", "transfer_section": "סעיף 280",
            "url": BY_STATUS, "claim_url": CLAIM, "employer_url": EMPLOYER, "form_502_url": FORM_502,
            "army_form": "3010", "personal_form": "502", "employer_form": "501",
            "employer_he": "שכיר בשכר חודשי, או שעבד 75 ימים לפחות ב-3 החודשים אצל מעסיק אחד: המעסיק ממשיך לשלם את השכר במועד הרגיל, והמוסד מעביר לו את התגמול (טופס 501)",
            "diff_he": "אם התגמול שהמוסד העביר למעסיק גבוה מהשכר ששולם על ימי השירות, המעסיק מעביר את ההפרש לעובד, לכל המאוחר ביום תשלום השכר של החודש שבו קיבל את התגמול",
            "institute_he": "כל השאר (עובד יומי או שעתי שעבד פחות מ-75 ימים, עצמאי, סטודנט, מי שלא עובד): המוסד משלם ישירות",
            "personal_he": "תביעה אישית בטופס 502 עם אישור השירות מהצבא (טופס 3010), מקוונת באתר המוסד; סטודנט ומי שלא עובד מקבלים בתקופת המלחמה תשלום אוטומטי בתחילת כל חודש",
            "count_he": "ב-75 הימים נספרים גם שבתות וחגים, ימי חופשה, ימי מחלה או תאונה וימי אבל",
            "salary_he": "תגמול שמשולם דרך המעסיק נחשב שכר עבודה, עם הניכויים הרגילים",
        },
        # סעיף 296(א) ו-(ב)(1); סעיף 1 (הגדרת "גמלה" כוללת גמלה לפי פרק י"ב).
        "claim": {
            "deadline_months": 12, "section": "סעיף 296(א)", "late_section": "סעיף 296(ב)(1)", "url": CLAIMS_LAW,
            "benefit_section": "סעיף 1 (\"גמלה\")", "benefit_url": GENERAL_LAW,
            "he": "תביעה לגמלת כסף מגישים בתוך 12 חודשים מהיום שבו נוצרה העילה (וגמלה לפי פרק י\"ב היא גמלה לעניין זה); תביעה מאוחרת משולמת רק בעד 12 החודשים שלפני הגשתה",
            "safe_he": "המחשבון סופר את 12 החודשים מהיום הראשון של השירות, המועד המוקדם והבטוח",
        },
        # סעיף 272(ג); למקבל קצבאות נוספות (btl).
        "unemployment": {
            "section": "סעיף 272(ג)", "url": OTHER_BENEFITS,
            "he": "מי שהיה זכאי לדמי אבטלה סמוך לפני השירות מקבל בימי השירות תגמול בלבד, אבל לא פחות מדמי האבטלה שהיו מגיעים לו",
        },
        # ניכויים מתשלום התגמול (btl).
        "deductions": {
            "url": DEDUCTIONS,
            "he": "מהתגמול מנוכים דמי ביטוח לאומי ובריאות (בתביעה אישית של שכיר: ביטוח בריאות בלבד), מס הכנסה לפי לוח הניכוי לעובדים יומיים, והפרשות לפנסיה כאילו המשיך לעבוד",
        },
        # חוק החיילים המשוחררים (החזרה לעבודה), תש"ט-1949, נוסח עדכני ל-20.10.2026 (nevo).
        "protect": {
            "law_he": "חוק החיילים המשוחררים (החזרה לעבודה), התש\"ט-1949", "law_url": SOLDIERS_LAW,
            "during_section": "סעיף 41א(ב)", "after_days": 30, "after_min_days": 3, "after_section": "סעיף 41א(ב)",
            "cause_section": "סעיף 41א(א1)", "burden_section": "סעיף 41א(ד)", "notice_section": "סעיף 41א(ג)",
            "contract_section": "סעיף 41א(ה)", "penalty_section": "סעיף 41א1", "inform_section": "סעיף 41ג",
            "during_he": "בזמן שירות המילואים אסור לפטר בלי היתר מוועדת התעסוקה",
            "after_he": "בשירות של יותר מיומיים רצופים: גם 30 ימים אחרי תום השירות אסור לפטר, ואסור לפגוע בהיקף המשרה או בהכנסה, בלי היתר",
            "cause_he": "פיטורים בשל שירות מילואים, קריאה לשירות או שירות צפוי, גם בשל תדירותו או משכו, אסורים בכל זמן ובטלים",
            "permit_he": "הוועדה נותנת היתר רק מטעמים מיוחדים שיירשמו, ורק אם המעסיק הוכיח שהפיטורים אינם בשל שירות המילואים",
            "notice_he": "ימי השירות ו-30 הימים שאחריו לא נספרים בימי ההודעה המוקדמת",
            "income_he": "פגיעה בהכנסה שחלה במקום העבודה מכוח דין או הסכם קיבוצי, או ברכיב שכר לפי תפוקה שלא בגלל המעסיק, אינה פגיעה לעניין זה",
            "contract_he": "אי חידוש חוזה לתקופה קצובה של 12 חודשים ומעלה (או חוזה קצר שהאריך העסקה קודמת) הוא פיטורים",
            "inform_he": "מי שקיבל צו קריאה מודיע למעסיק בתוך זמן סביר",
            "committee": {
                "members": 4, "decide_days": 15, "section": "סעיף 20(ג)", "claim_section": "סעיף 21", "url": SOLDIERS_LAW,
                "he": "בוועדת התעסוקה ארבעה חברים: יושב ראש הכשיר לכהן כשופט בית משפט השלום, עובד הלשכה להכוונת חיילים משוחררים במשרד הביטחון, נציג ארגון העובדים ונציג ארגוני המעסיקים; היא דנה ופוסקת ככל האפשר בתוך 15 ימים",
            },
            "remedy": {
                "wage_mult": 5, "avg_mult": 5, "section": "סעיף 21(ג)", "url": SOLDIERS_LAW,
                "he": "צו להחזרה לעבודה (בהסכמת העובד), פיצוי של 5 משכורות חודשיות, או שניהם יחד כשהפיצוי לפי הנזק בפועל; במי שפוטר בניגוד לסעיף 41א: 5 משכורות או 5 פעמים השכר הממוצע במשק (סעיף 1 לחוק הביטוח הלאומי), הגבוה",
            },
            "appeal": {
                "days": 20, "section": "סעיף 23(א)", "url": SOLDIERS_LAW,
                "he": "על החלטת ועדת התעסוקה מערערים לבית הדין האזורי לעבודה בתוך 20 ימים מיום מסירת ההודעה",
            },
            "spouse": {
                "child_age": 14, "after_days": 14, "min_days": 21, "section": "סעיף 41א2(ה)", "url": SOLDIERS_LAW,
                "he": "בן או בת זוג של משרת מילואים, שעימו ילד מתחת לגיל 14: אסור לפטר או להוציא לחל\"ת בזמן השירות ו-14 ימים אחריו בלי היתר, בשירות בצו 8 או בשירות של 21 ימים רצופים לפחות, אם הודיע למעסיק בכתב",
            },
            "order": {
                "he": "צו הרחבה להסכם קיבוצי בעניין משרתי המילואים ובני זוגם וצבירת חופשה שנתית לעובדים מסוימים",
                "url": ORDER_2026, "published": "2026-04-29", "signed": "2026-04-28", "from": "2026-01-01",
                "clause_from": "2026-04-29", "min_days": 60, "consecutive": 7, "ext_from_day": 31, "ext_to_day": 60,
                "gap_days": 5, "committee_days": 14,
                "section": "סעיף 5 לצו", "unpaid_section": "סעיף 6 לצו", "committee_section": "סעיף 7 לצו",
                "conditions_section": "סעיף 8 לצו", "days_section": "סעיף 2.4 לצו", "spouse_section": "סעיף 12.1 לצו",
                "ext_he": "60 ימי מילואים מצטברים או יותר בשנה קלנדרית, ושבעה ימים רצופים לפחות: אסור לפטר גם ב-30 הימים שאחרי 30 הימים שלאחר תום השירות, אלא מטעמים מיוחדים ובלי קשר לשירות; בתוקף מיום פרסום הצו, 29.4.2026, לתקופה בלתי קצובה",
                "unpaid_he": "אסור להוציא לחופשה ללא תשלום גם ב-30 הימים שאחרי 30 הימים שלאחר תום השירות, אלא מטעמים מיוחדים, בלי קשר לשירות ובהסכמת העובד, או כשהעובד רוצה בכך והשניים הסכימו",
                "committee_he": "מחלוקת על פיטורים או חל\"ת בימים 31 עד 60 מכריעה ועדת הפיקוח (פנייה בדוא\"ל שמתפרסם באתר משרד העבודה) בתוך 14 ימים, ועד ההכרעה הפיטורים לא נכנסים לתוקף",
                "conditions_he": "בזמן השירות וב-60 הימים שאחריו אסור לפגוע בתנאי העבודה, לרבות העברה לתפקיד אחר והוספה או גריעה של מטלות",
                "days_he": "ימי מילואים מצטברים בשנה קלנדרית: הימים של אותה שנה, וגם ימים מהשנה הקודמת כשהשירות נמשך ברצף לתוך השנה (הפסקות של עד 5 ימים בין שירות לשירות לא שוברות את הרצף)",
                "spouse_days": [[0, 30, 0], [31, 60, 2], [61, 90, 4], [91, 120, 6], [121, None, 8]],
                "spouse_he": "בן או בת זוג של משרת המילואים (עם ילד מתחת לגיל 14, ילד חולה, קרוב עם מוגבלות או הורה חולה) זכאים לימי היעדרות בתשלום מעבר לדין, לפי הימים המצטברים של המשרת בשנה, ורק בזמן שירות פעיל שלו",
                "labor_url": "https://www.gov.il/he/pages/reserve-protection2",
                "prev": {"url": ORDER_2024, "published": "2024-03-06", "from": "2023-10-07", "to": "2024-12-31",
                         "he": "הצו הקודם (י\"פ 12159, 6.3.2024): 60 ימי מילואים בתקופה 7.10.2023 עד 31.12.2024 הגנו גם בימים 31 עד 60"},
            },
            "equal": {
                "law_he": "חוק שוויון ההזדמנויות בעבודה, התשמ\"ח-1988", "law_url": EQUAL_LAW, "section": "סעיף 2(א)",
                "he": "שירות מילואים, של העובד או של בן הזוג, וגם קריאה לשירות או שירות צפוי, הם עילת הפליה אסורה בקבלה לעבודה, בתנאים, בקידום ובפיטורים",
            },
            "legal_aid_url": LEGAL_AID,
            "legal_aid_he": "משרתי מילואים ששירתו יותר מ-3 ימים רצופים ופוטרו, זומנו לשימוע או הוצאו לחל\"ת בתקופת ההגנה עשויים לקבל ייצוג משפטי במימון משרד הביטחון",
        },
        # אתר המילואים של צה"ל: מדיניות תגמולים, מענקים והטבות למשרתי המילואים - שנת 2026 (החלטת ממשלה מ-25.1.2026).
        "grants": {
            "year": 2026, "decision": "2026-01-25", "url": POLICY_2026, "prev_url": POLICY_2025, "rewards_url": REWARDS,
            "fund_url": FUND,
            "tiers": ["ap", "a", "b", "c", "d", "e"],
            "tier_he": {"ap": "א'+", "a": "א'", "b": "ב'", "c": "ג'", "d": "ד'", "e": "ה'"},
            "tier_examples_he": "לדוגמה בלבד: א'+ גדודים לוחמים, א' חטיבות, ב' אוגדות, ג' הגמ\"ר, ד' יחידות הדרכה ואבטחה, ה' פיקודים ומטות; המדרג נקבע לפי פקודות הצבא (מוקד המילואים 1111, שלוחה 4 ואז 1)",
            "routine_he": "ב-2026 נספר גם שירות בצו שגרה, לא רק בצו 8",
            "old8": {"from": "2023-10-07", "to": "2025-12-31",
                     "he": "ימי מילואים בצו 8 מ-7.10.2023 עד 31.12.2025 נספרים במניין 40 ו-60 הימים"},
            "budget_he": "לפי החלטת הממשלה, ההטבות מותנות באישור חוק התקציב לשנת 2026; לכל מענק מתפרסמת מדיניות ייעודית, והסכום הסופי מופיע באזור האישי באתר המילואים",
            "special": {
                "from_day": 61, "counts_old8": True, "paid_on": "2027-05-01", "payer_he": "מופת, לחשבון הבנק המעודכן בצה\"ל",
                "rates": {"ap": 133, "a": 113, "b": 86, "c": 60, "d": 40, "e": 30},
                "he": "תגמול מיוחד מהיום ה-61 (כולל) של שירות בכל סוג צו ב-2026, לפי מדרג; משולם ב-1.5.2027; פטור מניכוי מס",
            },
            "personal": {
                "min_days": 40, "from_day": 31, "heading_from_day": 41, "counts_old8": True,
                "rates": {"ap": 46, "a": 39, "b": 31, "c": 31, "d": 18, "e": 11},
                "he": "מענק הוצאות אישיות: מי שביצע 40 ימי שירות ומעלה ב-2026; משולם באופן יומי אחרי צבירת 40 ימים, עבור ימי השירות מהיום ה-31; פחות מ-40 ימים: אין מענק, גם לא חלקי",
                "check_he": "בדף המדיניות כותרת הסכומים אומרת \"מהיום ה-41\", ושתי הפסקאות אומרות \"החל מהיום ה-31\"; המחשבון מראה את שני המספרים",
            },
            "family": {
                "min_days": 40, "from_day": 41, "child_age": 14, "counts_old8": True,
                "rates": {"ap": 83, "a": 71, "b": 60, "c": 60, "d": 33, "e": 21},
                "he": "מענק משפחה מוגדל: מי שביצע 40 ימי שירות לפחות ב-2026 ויש לו ילד עד גיל 14; משולם באופן יומי אחרי צבירת 40 ימים, מהיום ה-41",
            },
            "household": {
                "min_days": 45, "amounts": {"ap": 1250, "a": 1065, "b": 815}, "paid_he": "בספטמבר 2026, על ידי מופת",
                "he": "מענק כלכלת הבית מוגדל: מדרגים א'+, א' ו-ב' שביצעו 45 ימי שירות לפחות ב-2026; חד פעמי",
            },
            "special_family": {
                "min_days": 45, "amount": 2000,
                "he": "מענק משפחה מיוחדת: 2,000 ש\"ח למי ששירת 45 ימים לפחות ב-2026 והוא הורה לתלמיד עם צרכים מיוחדים או לילד שמקבל גמלת ילד נכה; חד פעמי",
            },
            "voucher": {
                "min_days": 45, "to_day": 60, "valid_he": "הזכאות חד פעמית וניתנת עד סוף 2028",
                # [base at 45 days, about-this-much for each day 46-60, maximum] without / with a child under 14.
                "rows": {
                    "ap": {"none": [2630, 58, 3500], "kids": [3375, 75, 4500]},
                    "a": {"none": [2200, 50, 2950], "kids": [2925, 65, 3900]},
                    "b": {"none": [1700, 40, 2300], "kids": [2250, 50, 3000]},
                    "c": {"none": [780, 18, 1050], "kids": [1020, 22, 1350]},
                    "d": {"none": [780, 18, 1050], "kids": [1020, 22, 1350]},
                    "e": {"none": [605, 13, 800], "kids": [760, 16, 1000]},
                },
                "he": "שובר נופש: 45 ימי שירות לפחות בכל סוג צו בין 1.1.2026 ל-31.12.2026; תוספת של כ-X ש\"ח לכל יום מהיום ה-46 עד היום ה-60, עד הסכום המרבי",
            },
            "wallet": {
                "min_days": 10,
                "tiers": {
                    "ap": {"bands": [[1, 30, 45], [31, 45, 120], [46, None, 70]], "max": 5000},
                    "a": {"bands": [[1, 30, 40], [31, 45, 100], [46, None, 60]], "max": 4250},
                    "b": {"bands": [[1, 30, 30], [31, 45, 80], [46, None, 45]], "max": 3250},
                },
                "he": "ארנק דיגיטלי (פייטר): מדרגים א'+, א' ו-ב' שביצעו 10 ימי שירות לפחות ב-2026; לתשלום אגרות למדינה, פנאי ורווחה; היישום צפוי בקיץ 2026",
            },
            # Published 2026 items that need facts the instrument does not ask for: listed, not computed.
            "info": [
                {"key": "camps", "he": "קייטנות: מדרגים א'+, א' ו-ב', 20 ימי שירות ב-2026 מתוכם 3 בתקופת קייטנה (או 21 ימים בקיץ); 500 ש\"ח לילד ראשון ו-250 לכל ילד נוסף, עד 2,000 (א'+, א') או 1,300 (ב') בשנה"},
                {"key": "birth", "he": "מענק חופשת לידה: 45 ימי שירות ב-2026, ובן או בת הזוג לא חזרו לעבודה 21 ימים לפחות מעבר לדמי הלידה, בזמן השירות; עד 10,700 ש\"ח לכל לידה ב-2026"},
                {"key": "moving", "he": "מעבר דירה: מדרגים א'+, א' ו-ב', 45 ימי שירות ב-2026 במועד המעבר; 2,500 ש\"ח, בניכוי סיוע קודם"},
                {"key": "mental", "he": "סיוע נפשי: מדרגים א'+, א' ו-ב', 50 ימי שירות מ-1.1.2026; 80% מעלות טיפול ועד 240 ש\"ח למפגש, עד תקרה לפי מדרג וילדים"},
                {"key": "commanders", "he": "מענק שנתי למפקדים במדרגים א'+ וא' (54 ימי שירות בתפקיד פיקודי; סטודנט 40): מג\"ד 20,000, סמג\"ד ומ\"פ 10,000, סמ\"פ ומ\"מ 5,000 ש\"ח"},
                {"key": "students", "he": "סטודנטים ששירתו 50 ימים מ-23.10.2025 עד 30.9.2026: סיוע בשכר הלימוד של תשפ\"ו, 100% (א'+), 85% (א'), 65% (ב'), 30% (ג', ד'), 22% (ה')"},
            ],
            # The Tax Authority's additional reward, as published for service in 2025 (paid in May 2026). The 2026 table was not
            # on the site on checked_on, so the instrument shows it as a check, not as money.
            "additional_2025": {
                "bands": [[10, 14.5, 1452], [15, 19.5, 2904], [20, 36.5, 4356], [37, None, 5808]], "personal": 266,
                "personal_days": [5, 9.5], "paid_he": "במאי 2026, על ידי רשות המסים", "url": REWARDS,
                "he": "התגמול הנוסף של רשות המסים לפי ימי המילואים בשנה (פורסם לשירות ב-2025, שולם במאי 2026): 10 עד 14.5 ימים 1,452, 15 עד 19.5 2,904, 20 עד 36.5 4,356, 37 ומעלה 5,808 ש\"ח; 5 עד 9.5 ימים ברצף: 266 ש\"ח",
            },
            # The 2025 policy, for "what changed": by array (combat / the HGMR / the other units).
            "prev2025": {
                "special": [133, 60, 40], "personal_per10": [466, 310, 266], "family_per10": [833, 600, 500], "household_extra": 1250,
                "url": POLICY_2025,
            },
        },
        # נקודות הזיכוי במס הכנסה (סעיף 39ב) נקראות מ-rights_tax; אתר המילואים: ימי 2026 מזכים ב-2027, במדרגים א'+, א' ו-ב'.
        "tax": {
            "tiers": ["ap", "a", "b"], "url": TAX_POINTS, "path": "/nekudot-zikui/",
            "he": "נקודות זיכוי במס הכנסה על ימי המילואים של השנה הקודמת, למשרתים במערך מזכה (מדרגים א'+, א' ו-ב'), לפי אישור באזור האישי באתר המילואים; שכירים מגישים אותו למעסיק עם טופס 101",
        },
        # "What changed and when": published values and dated rules only.
        "history": [
            {"date": "2026-01-01", "he": "מינימום 328.76 ומקסימום 1,730.33 ש\"ח ליום (9,863 ו-51,910 לחודש); סכום בסיסי 10,382 ש\"ח (ב-2025: 10,139)", "section": "סעיף 270", "url": AMOUNT},
            {"date": "2026-01-01", "he": "התגמול המזערי עוגן כ-95% מהסכום הבסיסי (תיקון 260); קודם 68%, ו-95% בהוראת שעה למי שנקרא בין 7.10.2023 ל-31.12.2025", "section": "סעיף 270", "url": LAW},
            {"date": "2026-01-25", "he": "החלטת הממשלה לשנת 2026: מענקים לפי מדרג פעילות, גם על שירות בצו שגרה", "section": "מדיניות 2026", "url": POLICY_2026},
            {"date": "2026-04-29", "he": "צו ההרחבה: הגנה בימים 31 עד 60 למי שצבר 60 ימים בשנה ו-7 ימים רצופים, לתקופה בלתי קצובה", "section": "סעיף 5 לצו", "url": ORDER_2026},
            {"date": "2025-05-01", "he": "שירות נוסף בתקופת חירום בתוך 90 ימים: לפי ההכנסה שלפני השירות הראשון, ועלייה עד 20%", "section": "סעיף 274ב", "url": CHANGE_2025},
            {"date": "2023-10-07", "he": "משוחררי קבע: התגמול לפי המשכורת בשירות הקבע (תיקון 255, בתוקף מ-1.6.2025, חל על שירות מ-7.10.2023)", "section": "סעיף 274ג", "url": LAW},
            {"date": "2024-03-06", "he": "הצו הקודם: הגנה בימים 31 עד 60 למי ששירת 60 ימים בתקופה 7.10.2023 עד 31.12.2024", "section": "צו 2024", "url": ORDER_2024},
        ],
        "calculator_url": CALCULATOR,
    }
