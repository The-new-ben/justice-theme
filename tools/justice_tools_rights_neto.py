"""The net-salary dataset of the co.il tools registry (the rights wave 2A, 22.10.2026, HAD-578): the sachar-neto
instrument on /net-salary-calculator/ (gross to net, 2026). Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES)
through KEY and build().

This file holds only what the net salary adds to the registry: the brackets, the credit point and the credit-point rules
live in rights_tax; the National Insurance and health rates, the reduced tier and the ceiling in rights_bituach; the
minimum wage in min_wage. Every value here was read on checked_on from the official text named next to it: the Tax
Authority's 2026 monthly deductions booklet (updated April 2026), its employers notice of 30.3.2026, the Income Tax
Ordinance (ss.3(ה), 3(ה3), 45א, 47) and the salary-withholding regulations of 1993 on Nevo, the Hours of Work and Rest
Law, 1951, and the Labor Ministry's extension orders (the 42-hour week of 2018, travel expenses of 2016, comprehensive
pension insurance of 2011 with the 2016-2017 rates as the Knesset Research Center states them), and the National
Insurance Institute's employer letter 651 (04.2026) on several employers. Nothing is estimated; the open questions are in
parts/neto/facts.md in the wave's scratch folder.
"""
from __future__ import annotations

KEY = "rights_neto"

BOOKLET = ("https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/"
           "generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf")
NOTICE = ("https://www.gov.il/BlobFolder/dynamiccollectorresultitem/employers-info-300326-1/he/"
          "IncomeTax_IncomeTaxEmployersInfo_employers-info-300326-1.pdf")
ORDINANCE = "https://www.nevo.co.il/law_html/law01/255_001.htm"                  # פקודת מס הכנסה
WITHHOLDING = "https://www.nevo.co.il/law_html/law01/255_163.htm"                # תקנות הניכוי ממשכורת, התשנ"ג-1993
HOURS_LAW = "https://www.nevo.co.il/law_html/law00/5174.htm"                     # חוק שעות עבודה ומנוחה, התשי"א-1951
WEEK_ORDER = ("https://www.gov.il/BlobFolder/dynamiccollectorresultitem/extention-order-short-week-2018/he/"
              "extention-order-short-week-2018.pdf")                             # צו ההרחבה לקיצור שבוע העבודה (42 שעות)
DIVISOR = ("https://www.gov.il/BlobFolder/policy/instructions-regarding-hourly-minimum-wage-in-light-a-shorten-work-week/he/"
           "workers-rights_enforcement-and-exercise-of-rights_minimum-wage-enforcement-procedure.pdf")  # 182 שעות לחודש
TRAVEL_ORDER = ("https://www.gov.il/BlobFolder/dynamiccollectorresultitem/extention-order-travel-expenses-2016/he/"
                "extention-order-travel-expenses-2016.pdf")                      # 22.60 ₪ ליום מ-1.2.2016
PENSION_ORDER = "https://www.gov.il/BlobFolder/guide/labor-wage/he/workers-rights_working-conditions_pension_H096.pdf"
PENSION_RATES = ("https://fs.knesset.gov.il/globaldocs/MMM/07dcb0f8-423d-ef11-815f-005056aac6c3/"
                 "2_07dcb0f8-423d-ef11-815f-005056aac6c3_11_20749.pdf")         # מרכז המחקר והמידע של הכנסת, 21.11.2024
FORM_101 = "https://www.gov.il/BlobFolder/service/itc101/he/Service_Pages_Income_tax_annual-report-2024_itc101.pdf"
COORDINATION = "https://www.gov.il/he/service/tax-coordination-online"
FORM_116 = ("https://www.gov.il/BlobFolder/service/tax-coordination-online/he/"
            "Service_Pages_Income_tax_annual-report-2024_itc116-2024.pdf")
BL_LETTER = ("https://www.btl.gov.il/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/"
             "Documents/t651.pdf")                                               # מכתב למעסיקים בל/651 (04.2026)
BL_REGS = "https://www.btl.gov.il/Laws1/02_0001_110441.pdf"                      # תקנות הביטוח הלאומי (מעסיקים אחדים), 1997
BL_TEUM = "https://www.btl.gov.il/Insurance/Teum/Pages/default.aspx"
BL_CALC = "https://www.btl.gov.il/Simulators/Pages/BituahCalculator.aspx"
TAX_SIM = "https://secapp.taxes.gov.il/srsimulatorNZ/"


def build(checked_on: str) -> dict:
    """Gross to net in 2026: the pension and study-fund deposits and their tax ceilings, the pension credit, overtime, a
    second job (47% without coordination, National Insurance at the full rate), travel, and the monthly method."""
    return {
        "name_he": "שכר נטו 2026: ניכויים, הפקדות ותקרות",
        "publisher_he": "רשות המסים בישראל: לוח עזר לחישוב מס הכנסה ממשכורת 2026; משרד העבודה; המוסד לביטוח לאומי",
        "source_name": "לוח עזר לחישוב המס ממשכורת ומשכר עבודה לשנת 2026 (מעודכן לאפריל 2026); פקודת מס הכנסה; "
                       "תקנות מס הכנסה (ניכוי ממשכורת ומשכר עבודה), התשנ\"ג-1993; חוק שעות עבודה ומנוחה; צווי ההרחבה",
        "source_url": BOOKLET,
        "checked_on": checked_on,
        "refresh_every_days": 120,
        "next_update": "2027-01-01",
        "year": 2026,
        "booklet_url": BOOKLET,
        "notice_url": NOTICE,
        "ordinance_url": ORDINANCE,
        "withholding_url": WITHHOLDING,
        "method": {
            "he": "משכורת החודש כפול 12, המס לפי המדרגות השנתיות ומס היסף, פחות נקודות הזיכוי והזיכויים, חלקי 12",
            "section": "תקנות הניכוי ממשכורת, התוספת הראשונה (שיטת החישוב החודשית)",
            "rounding_he": "התקנות מתירות לעגל את המשכורת ואת המס לשקל השלם (שבר מעל 49 אגורות כלפי מעלה); תלושים "
                           "מציגים בדרך כלל אגורות, וההפרש קטן משקל",
            "url": WITHHOLDING,
        },
        "pension": {
            "employee_pct": 6, "employer_pct": 6.5, "severance_pct": 6, "severance_full_pct": 8.33,
            "from": "2017-01-01",
            "he": "חובת הביטוח הפנסיוני: עובד 6%, מעסיק 6.5% לתגמולים ו-6% לפיצויים (המעסיק רשאי להשלים ל-8.33%)",
            "cap_he": "החובה חלה על השכר או על השכר הממוצע במשק, הנמוך מביניהם; מעסיקים רבים מפקידים מכל השכר",
            "wait_he": "עובד חדש בלי קופה: 6 חודשי המתנה; מי שיש לו כבר קופה: מהיום הראשון, ומשולם אחרי 3 חודשים "
                       "רטרואקטיבית",
            "section": "צו ההרחבה לביטוח פנסיוני מקיף במשק (2011, כנוסחו מ-2017)",
            "url": PENSION_ORDER,
            "rates_url": PENSION_RATES,
        },
        "pension_credit": {
            "rate": 35, "share_pct": 7, "cap_month": 9700, "min_base_month": 189,
            "he": "זיכוי של 35% מהפקדות העובד לפנסיה, עד 7% מההכנסה המבוטחת ולא יותר מ-7% מ-9,700 ₪ בחודש",
            "section": "סעיף 45א לפקודה; תקרת הכנסה מזכה 9,700 ₪ לחודש (סעיף 47(א1)(1), מוקפאת 2025-2027)",
            "url": ORDINANCE,
            "cap_url": BOOKLET,
        },
        "employer_ceiling": {
            "tagmulim_salary_cap": 34423, "tagmulim_max_pct": 7.5,
            "severance_year_cap": 45600, "severance_month_cap": 3800, "severance_max_pct": 8.33,
            "he": "הפקדות המעסיק פטורות ממס עד 7.5% לתגמולים משכר של עד 34,423 ₪ בחודש (פי 2.5 מהשכר הממוצע), ולפיצויים "
                  "עד משכורת חודש בשנה ולא יותר מ-45,600 ₪ בשנה. מה שמעבר נזקף כהכנסה של העובד, גם לביטוח הלאומי",
            "section": "סעיף 3(ה3) לפקודה",
            "url": ORDINANCE,
            "cap_url": BOOKLET,
        },
        "study_fund": {
            "employee_pct": 2.5, "employer_pct": 7.5, "salary_cap": 15712, "year_cap": 188544,
            "he": "הפקדת המעסיק לקרן השתלמות פטורה ממס עד 7.5% משכר של עד 15,712 ₪ בחודש; הפקדה מעבר נזקפת כהכנסה. "
                  "הפקדת העובד (2.5% בדרך כלל, לפי הסכם) לא מזכה בהטבה. שעות נוספות והחזר הוצאות לא נכללים בשכר הקובע",
            "section": "סעיף 3(ה) לפקודה",
            "url": ORDINANCE,
            "cap_url": BOOKLET,
        },
        "overtime": {
            "first_pct": 125, "first_hours": 2, "next_pct": 150, "rest_pct": 150, "divisor": 182, "week_hours": 42,
            "max_day": 12, "max_week_overtime": 16,
            "he": "שעתיים נוספות ראשונות ביום: 125%; מהשעה השלישית: 150%; שעות במנוחה השבועית: 150%. שכר שעה של עובד "
                  "חודשי: השכר החודשי חלקי 182",
            "section": "סעיפים 16 ו-17 לחוק שעות עבודה ומנוחה; צו ההרחבה לקיצור שבוע העבודה (42 שעות מ-1.4.2018)",
            "url": HOURS_LAW,
            "week_url": WEEK_ORDER,
            "divisor_url": DIVISOR,
        },
        "travel": {
            "max_day": 22.60, "from": "2016-02-01",
            "he": "החזר הוצאות נסיעה: עד 22.60 ₪ ליום עבודה, לפי מחיר הנסיעה המוזל בתחבורה ציבורית; הוא חלק מההכנסה החייבת",
            "section": "צו ההרחבה בדבר השתתפות המעביד בהוצאות נסיעה (2016); סעיף 2(2)(א) לפקודה",
            "url": TRAVEL_ORDER,
        },
        "second_job": {
            "rate": 47, "surtax_month": 60130,
            "he": "בלי תיאום מס, המעסיק השני מנכה 47% מכל השכר (המס המרבי), ונקודות הזיכוי והמדרגות ניתנות אצל מעסיק אחד",
            "section": "תקנה 5(א) לתקנות הניכוי ממשכורת; טופס 101, חלק ה",
            "url": WITHHOLDING,
            "form101_url": FORM_101,
            "coordination_he": "תיאום מס מקוון באזור האישי או בטופס 116: כל מעסיק מנכה לפי השיעור שבאישור, והמס השנתי "
                               "מתיישר עם המס על סך ההכנסה",
            "coordination_url": COORDINATION,
            "form116_url": FORM_116,
            "bl_he": "המעסיק המשני מנכה דמי ביטוח לאומי ובריאות בשיעור המלא מהשקל הראשון, אלא אם הצגתם אישור תיאום "
                     "מהביטוח הלאומי לשנה הנוכחית; על שנים שעברו מבקשים החזר",
            "bl_section": "תקנות הביטוח הלאומי (מעסיקים אחדים), 1997; מכתב בל/651 (04.2026)",
            "bl_url": BL_LETTER,
            "bl_regs_url": BL_REGS,
            "bl_teum_url": BL_TEUM,
        },
        "employer": {
            "he": "עלות המעסיק: השכר, הפקדות הפנסיה, הפיצויים וקרן ההשתלמות, ודמי ביטוח לאומי של המעסיק (4.51% עד המדרגה "
                  "ו-7.6% מעליה, עד התקרה). מס שכר חל רק על מלכ\"רים ומוסדות כספיים",
            "url": BOOKLET,
        },
        "official": {
            "tax_simulator_url": TAX_SIM,
            "tax_simulator_he": "הסימולטור של רשות המסים מחשב נקודות זיכוי בלבד; מחשבון שכר נטו רשמי לא נמצא",
            "bl_calculator_url": BL_CALC,
        },
    }
