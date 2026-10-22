"""The severance upgrade of the labor wave (22.10.2026): the payslip components that make the severance salary and the
pension-deposit check of the pitzuyim instrument on /severance-pay-calculator/. Loaded by tools/justice_tools_labor.py
through KEY and build().

Every value was read on checked_on from the official text named next to it:
- the calculation regulations (תקנות פיצויי פיטורים (חישוב הפיצויים, והתפטרות שרואים אותה כפיטורים), התשכ"ד-1964),
  current version to 18.9.2023 on Nevo: reg. 1 (the components), 1א (one job), 6 (a temporary change), 9 (pay by output);
- the Severance Pay Law, 1963 (current to 30.1.2025 on Nevo): s.14 (payments instead of severance, only as approved) and
  s.26 (money paid instead of severance is not returnable, not pledgeable, not attachable);
- the comprehensive pension extension order, consolidated version (צו הרחבה לביטוח פנסיוני מקיף במשק [נוסח משולב]),
  Yalkut HaPirsumim 6302 of 27.9.2011, pages 6938-6942, as published by the Ministry of Labor on gov.il: s.6(ב)-(ד)
  (the insured salary, its ceiling, the rate table 2008-2014), s.7 (the employer's severance deposits replace severance
  under s.14 only for the salary, components, periods and rates deposited), s.8 (not returnable), s.9 (the completion to
  8.33%);
- the 2016 order that raised the rates (צו הרחבה בדבר הגדלת ההפרשות לביטוח פנסיוני במשק, 23.5.2016, Yalkut 7287), as
  cited by the Knesset Research and Information Center; its 2017 rates are read from registry.rights_neto.pension, never
  copied here.

Read, never duplicated: registry.severance (the law, the regulations' url, the 1998 general approval 72% / 100%, the
notice law, the tax ceiling, the late-payment rule, the limitation), registry.rights_neto.pension (6 / 6.5 / 6 from
1.1.2017), registry.rights_btl.avg_wage (the s.2 average wage, the order's ceiling) and registry.min_wage.
Nothing here is estimated. Open questions are in parts/pitzuyim/notes.md of the wave's scratch folder.
"""
from __future__ import annotations

KEY = "labor_pitzuyim"

REGS = "https://www.nevo.co.il/law_html/law00/4567.htm"            # the 1964 calculation regulations, current to 18.9.2023
LAW = "https://www.nevo.co.il/law_html/law00/4566.htm"             # the Severance Pay Law, current to 30.1.2025
ORDER = "https://www.gov.il/BlobFolder/guide/labor-wage/he/workers-rights_working-conditions_pension_H096.pdf"
KNESSET = ("https://fs.knesset.gov.il/globaldocs/MMM/07dcb0f8-423d-ef11-815f-005056aac6c3/"
           "2_07dcb0f8-423d-ef11-815f-005056aac6c3_11_20749.pdf")  # the Knesset research paper citing the 2016 order
FORM_161 = "https://www.gov.il/he/service/notice-of-retirement"   # רשות המסים: הודעה על פרישה מעבודה (טופס 161)
COMPLAINT = "https://www.gov.il/he/service/work-rights-violation-complaints"  # משרד העבודה: תלונה על הפרת זכויות
NET_HAMISHPAT = "https://www.court.gov.il/ngcs.web.site/homepage.aspx"  # נט המשפט: הגשה מקוונת לבתי הדין לעבודה


def build(checked_on: str) -> dict:
    """The payslip components (reg. 1 of the 1964 regulations), the pension order's rate table and its s.14 rules, and the
    official next steps."""
    # Reg. 1(א)-(ג), 1א, 9 of the 1964 regulations. status: in = counted; avg = counted at the average of the 12 months
    # before the dismissal (reg. 9); out = not in the list of reg. 1(א); check = a fixed payment under another name: the
    # regulation's list decides, and whether it is in fact base pay is for the labour court (the tool never guesses).
    components = [
        {"code": "base", "he": "שכר יסוד", "status": "in", "section": "תקנה 1(א)(1)",
         "rule_he": "שכר יסוד נכנס לשכר הקובע"},
        {"code": "seniority", "he": "תוספת ותק", "status": "in", "section": "תקנה 1(א)(2)",
         "rule_he": "תוספת ותק נכנסת לשכר הקובע"},
        {"code": "col", "he": "תוספת יוקר המחיה", "status": "in", "section": "תקנה 1(א)(3)",
         "rule_he": "תוספת יוקר המחיה נכנסת לשכר הקובע"},
        {"code": "family", "he": "תוספת משפחה", "status": "in", "section": "תקנה 1(א)(4)",
         "rule_he": "תוספת משפחה נכנסת לשכר הקובע"},
        {"code": "dept", "he": "תוספת מחלקתית או מקצועית", "status": "in", "section": "תקנה 1(ב)",
         "rule_he": "תוספת מחלקתית או מקצועית נחשבת לחלק משכר היסוד"},
        {"code": "commission", "he": "עמלות, תשלום לפי תפוקה או מהפדיון", "status": "avg", "section": "תקנה 9",
         "rule_he": "שכר שמשולם בעד עבודה מסוימת, מחלק מהפדיון או לפי כמות התוצרת נכנס לפי הממוצע של 12 החודשים שלפני הפיטורים"},
        {"code": "overtime", "he": "שעות נוספות (גם גלובליות)", "status": "out", "section": "תקנה 1(א)",
         "rule_he": "לא ברשימת הרכיבים שבתקנה 1(א)"},
        {"code": "travel", "he": "החזר הוצאות נסיעה", "status": "out", "section": "תקנה 1(א)",
         "rule_he": "לא ברשימת הרכיבים שבתקנה 1(א)"},
        {"code": "havraa", "he": "דמי הבראה", "status": "out", "section": "תקנה 1(א)",
         "rule_he": "לא ברשימת הרכיבים שבתקנה 1(א)"},
        {"code": "bonus", "he": "מענק או בונוס", "status": "out", "section": "תקנה 1(א)",
         "rule_he": "לא ברשימת הרכיבים שבתקנה 1(א)"},
        {"code": "benefit", "he": "שווי רכב, טלפון או ארוחות", "status": "out", "section": "תקנה 1(א)",
         "rule_he": "לא ברשימת הרכיבים שבתקנה 1(א)"},
        {"code": "other", "he": "תוספת קבועה אחרת (בשם אחר)", "status": "check", "section": "תקנה 1(א)",
         "rule_he": "לא ברשימה שבתקנה 1(א), ולכן לא נכנסת בחישוב. אם היא בעצם שכר היסוד בשם אחר, את זה מכריע בית הדין לעבודה"},
    ]
    return {
        "name_he": "השכר הקובע לפיצויים ובדיקת ההפרשות לפיצויים בקופה",
        "publisher_he": "תקנות חישוב הפיצויים, חוק פיצויי פיטורים וצו ההרחבה לביטוח פנסיוני מקיף במשק",
        "source_name": "תקנות פיצויי פיטורים (חישוב הפיצויים, והתפטרות שרואים אותה כפיטורים), התשכ\"ד-1964, תקנה 1",
        "source_url": REGS,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "regs": {
            "he": "תקנות פיצויי פיטורים (חישוב הפיצויים, והתפטרות שרואים אותה כפיטורים), התשכ\"ד-1964",
            "url": REGS, "current_to": "2023-09-18",
            "plain_he": "לא היה השכר משולם לפי הרכיבים שבתקנה 1(א), נכנס שכר העבודה הרגיל בלי תוספות",  # reg. 1(ג)
            "plain_section": "תקנה 1(ג)",
            "one_job_he": "נכנס רק השכר בעד משרה אחת אצל אותו מעסיק, כמקובל באותה עבודה",  # reg. 1א
            "one_job_section": "תקנה 1א",
            "temp_he": "שינוי זמני בשכר האחרון לא נספר: מחשבים כאילו לא חל",  # reg. 6
            "temp_section": "תקנה 6",
        },
        "components": components,
        "law": {
            "url": LAW, "current_to": "2025-01-30",
            "s14_he": "תשלום לקרן פנסיה או לקופה בא במקום פיצויי פיטורים רק אם נקבע כך בהסכם קיבוצי או אושר בצו של שר העבודה, ובמידה שנקבע או אושר",
            "s14_section": "סעיף 14",
            "s26_he": "סכומים ששולמו במקום פיצויי פיטורים לפי סעיף 14, או לקופת גמל לפיצויים או לקצבה, אינם חלק מנכסי המעסיק בפטירה, בפשיטת רגל או בפירוק, כל עוד תביעות העובדים לפי החוק לא סולקו",
            "s26_section": "סעיף 26(א)(2)",
        },
        "order": {
            "he": "צו הרחבה לביטוח פנסיוני מקיף במשק [נוסח משולב]",
            "gazette_he": "י\"פ 6302, 27.9.2011, עמ' 6938-6942",
            "url": ORDER,
            "first_from": "2008-01-01",
            # s.6(ד): the monthly deposits, as a percent of the insured salary, from each date on (employer = the employer's
            # benefits part; severance = the employer's severance part; employee = the employee's part).
            "rows": [
                {"from": "2008-01-01", "employer": 0.833, "employee": 0.833, "severance": 0.834, "total": 2.5},
                {"from": "2009-01-01", "employer": 1.66, "employee": 1.66, "severance": 1.68, "total": 5},
                {"from": "2010-01-01", "employer": 2.5, "employee": 2.5, "severance": 2.5, "total": 7.5},
                {"from": "2011-01-01", "employer": 3.33, "employee": 3.33, "severance": 3.34, "total": 10},
                {"from": "2012-01-01", "employer": 4.16, "employee": 4.16, "severance": 4.18, "total": 12.5},
                {"from": "2013-01-01", "employer": 5, "employee": 5, "severance": 5, "total": 15},
                {"from": "2014-01-01", "employer": 6, "employee": 5.5, "severance": 6, "total": 17.5},
            ],
            "rows_section": "סעיף 6(ד) לצו",
            "insured_he": "השכר המבוטח הוא השכר ורכיביו במשמעם בחוק פיצויי פיטורים ובתקנות",  # s.6(ב)
            "insured_section": "סעיף 6(ב) לצו",
            "cap_he": "חובת הביטוח חלה על השכר המשולם או על השכר הממוצע במשק, הנמוך מביניהם",  # s.6(ג)
            "cap_section": "סעיף 6(ג) לצו",
            "cover_he": "הפרשות המעסיק לפיצויים לפי הצו באות במקום פיצויי פיטורים לפי סעיף 14, בעד השכר, הרכיבים, התקופות והשיעורים שבעדם הופרשו בלבד; על שכר, רכיבים, תקופות או שיעורים שלא הופרשו, הזכות לפיצויים נשארת",  # s.7
            "cover_section": "סעיף 7 לצו",
            "return_he": "ההפקדות לפיצויים לא חוזרות למעסיק, אלא אם נשללו הפיצויים בפסק דין לפי סעיפים 16 ו-17 לחוק או שהעובד משך את הכספים לפני אירוע מזכה",  # s.8
            "return_section": "סעיף 8 לצו",
            "completion_he": "המעסיק רשאי להשלים את ההפרשה לפיצויים עד 8.33% מהשכר; לא העביר את ההשלמה, ישלם אותה לפי החוק בעד התקופה, השכר והרכיבים שלא הופרשו",  # s.9(א)-(ב)
            "completion_section": "סעיף 9 לצו",
            "full_rate": 8.33,
        },
        "increase_2016": {
            "he": "צו הרחבה בדבר הגדלת ההפרשות לביטוח פנסיוני במשק",
            "signed": "2016-05-23",
            "gazette_he": "י\"פ 7287",
            "source_he": "הכנסת, מרכז המחקר והמידע (מסמך על זכויות פנסיוניות ופיצויי פיטורים)",
            "source_url": KNESSET,
        },
        "services": {
            "form_161": {"he": "טופס 161: המעסיק מודיע לרשות המסים על סיום העבודה ועל הפיצויים, והעובד בוחר מה לעשות בהם", "url": FORM_161},
            "complaint": {"he": "תלונה למשרד העבודה על הפרת זכויות עובדים", "url": COMPLAINT},
            "court": {"he": "תביעה בבית הדין האזורי לעבודה: הגשה מקוונת בנט המשפט", "url": NET_HAMISHPAT},
        },
    }
