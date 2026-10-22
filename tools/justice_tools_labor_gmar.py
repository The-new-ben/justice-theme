"""The final-settlement dataset of the co.il tools registry (the labor wave, 22.10.2026): the combined "what am I owed when
I leave" instrument (gmar-cheshbon) on /gmar-cheshbon/. Discovered by tools/justice_tools_labor.py (glob), built with
--labor-checked-on.

What this file adds, and what it does NOT repeat. The instrument composes the sibling engines, and every figure they use
stays in their datasets: severance, notice, s.14, the tax ceiling, the late-payment rule for severance (s.20(b)), the
certificate days and the 7-year limitation in reg.severance; the payslip components and the pension-deposit check in
reg.labor_pitzuyim; the vacation table, the day ratio, the Wage Protection Law s.9 due day and the ninth-day rule of s.1
("the determining day") in reg.labor_chufsha; recuperation days and prices in reg.havraa; the form-161 service link in
reg.labor_hodaa. Here only what none of them holds: the due day of a wage paid by the hour or day (Wage Protection Law
s.10), the written demand that sets the severance due day of a resignation the law treats as a dismissal (s.20(c)), the
employer's notice to the fund (s.20(e)), the deductions allowed from the last wage (s.25(a)(6)-(7), (b)), the Sick Pay Law
rules the final settlement meets (sick pay only for an absence, ss.2(a) and 4; no dismissal inside the sick-pay period,
s.4A; agreed terms, s.12), the Tax Authority's timing of form 161, and the Ministry of Labor's complaint service.

Every value was read on checked_on from the official text named next to it (Nevo's consolidated texts and gov.il). Nothing
here is estimated; a figure the sources do not hold is not in the file.
"""
from __future__ import annotations

KEY = "labor_gmar"

WAGE_LAW = "https://www.nevo.co.il/law_html/law00/71689.htm"     # חוק הגנת השכר, התשי"ח-1958 (נוסח ל-7.11.2025)
SICK_LAW = "https://www.nevo.co.il/law_html/law00/71572.htm"     # חוק דמי מחלה, התשל"ו-1976 (נוסח ל-18.9.2023)
FORM_161 = "https://www.gov.il/he/service/notice-of-retirement"   # רשות המסים: הודעה על פרישה מעבודה (טופס 161 חדש)
TOPIC = "https://www.gov.il/he/departments/topics/termination-of-employment/govil-landing-page"   # משרד העבודה: פיטורים וסיום העסקה
COMPLAINT = "https://www.gov.il/he/service/work-rights-violation-complaints"                      # משרד העבודה: הגשת תלונה על מעסיקים


def build(checked_on: str) -> dict:
    """The final settlement: what the sibling datasets do not hold."""
    return {
        "name_he": "גמר חשבון: מועדי השכר האחרון, ניכויים, ימי מחלה וטופס 161",
        "publisher_he": "חוק הגנת השכר, חוק דמי מחלה, רשות המסים ומשרד העבודה",
        "source_name": "חוק הגנת השכר, התשי\"ח-1958 (נוסח עדכני)",
        "source_url": WAGE_LAW,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "wage": {
            "he": "חוק הגנת השכר, התשי\"ח-1958",
            "url": WAGE_LAW,
            "current_to": "2025-11-07",
            # s.10: a wage by the hour, day, week or output is paid at the end of the half-month in which the work was done,
            # unless a collective agreement or the contract sets another day; with advances during a full month, s.9 applies.
            "hourly_section": "סעיף 10",
            "hourly_he": "שכר לפי שעה, יום, שבוע או תוצרת משולם בתום מחצית החודש שבו הועסק העובד, אם לא נקבע מועד אחר בהסכם קיבוצי או בחוזה; מי שהועסק כל החודש וקיבל מקדמות: לפי סעיף 9, עם תום החודש",
            # s.20(c): severance due not under s.1(a) or s.5 of the Severance Pay Law (e.g. a resignation the law treats as a
            # dismissal): the due day applies only after a written demand that names the ground; a later demand moves it.
            "demand_section": "סעיף 20(ג)",
            "demand_he": "מי שזכאי לפיצויים שלא מכוח סעיפים 1(א) או 5 לחוק פיצויי פיטורים (למשל התפטרות שדינה כפיטורים): המועד לתשלום חל רק אחרי דרישה בכתב למעסיק שמציינת את העילה; דרישה שנמסרה אחרי היום האחרון קובעת את המועד ליום מסירתה",
            # s.20(e): no late-severance compensation on the fund's part if the employer told the fund in writing, within 15
            # days of the due day, that it consents to the payment.
            "fund_notice_section": "סעיף 20(ה)",
            "fund_notice_days": 15,
            "fund_notice_he": "על הסכום שמגיע מהקופה אין פיצוי הלנה אם המעסיק הודיע לקופה בכתב, תוך 15 ימים מהמועד לתשלום הפיצויים, שהוא מסכים לתשלום",
            # s.20(b2): the employer may reduce the severance and the late compensation by a debt the worker owes it.
            "offset_section": "סעיף 20(ב2)",
            "offset_he": "המעסיק רשאי להפחית מפיצויי הפיטורים חוב שהעובד חייב לו",
            # s.25: the closed list of deductions; on leaving, the balance of a debt (advances included) may come off the last wage.
            "deduct_section": "סעיף 25",
            "deduct_he": "משכר עבודה מנכים רק את מה שבסעיף 25(א): ניכוי לפי חיקוק, תרומות ודמי חבר בהסכמה, תשלומים שוטפים לקופות גמל, חוב לפי התחייבות בכתב (עד רבע מהשכר) ומקדמות",
            "deduct_last_section": "סעיף 25(ב)",
            "deduct_last_he": "עובד שחדל לעבוד: המעסיק רשאי לנכות משכרו האחרון כל יתרת חוב שהעובד חייב לו, כולל מקדמות",
            "payslip_section": "סעיף 24",
        },
        "sick": {
            "he": "חוק דמי מחלה, התשל\"ו-1976",
            "url": SICK_LAW,
            "current_to": "2023-09-18",
            # s.2(a): sick pay is due to a worker absent from work because of illness; nothing in the law pays unused days.
            "absence_section": "סעיף 2(א)",
            "absence_he": "דמי מחלה משולמים לעובד שנעדר מעבודתו עקב מחלה: מחצית בימים השני והשלישי, מלאים מהיום הרביעי. החוק לא קובע תשלום בעד ימים שלא נוצלו, ולכן בסיום העבודה הם לא נפדים לפי החוק",
            # s.4(a): one and a half days for each full month of work, up to 90 days.
            "accrual_section": "סעיף 4(א)",
            "accrual_days_per_month": 1.5,
            "accrual_max_days": 90,
            # s.4A: no dismissal of a worker absent because of illness during the accrued sick-pay period (exceptions in (b)).
            "no_dismissal_section": "סעיף 4א",
            "no_dismissal_he": "אסור לפטר עובד שנעדר בגלל מחלה בתקופת ימי המחלה הצבורים לו, אלא אם ניתנה הודעה מוקדמת לפני ההיעדרות, או שהעסק נסגר או בפשיטת רגל או פירוק",
            # s.12(a): where a collective agreement or the agreed terms give sick pay too, the worker chooses either.
            "agreed_section": "סעיף 12(א)",
            "agreed_he": "הסכם קיבוצי או תנאי עבודה מוסכמים יכולים לתת יותר; העובד בוחר לפי איזה מהם לקבל",
        },
        "form_161": {
            # The Tax Authority's service page: the employer reports the final retirement at its time, and gives the form to
            # the assessing officer and to the worker.
            "he": "הודעה על פרישה מעבודה (טופס 161)",
            "url": FORM_161,
            "when_he": "הדיווח נעשה במועד הפרישה המוחלטת והסופית, כשנצברו לעובד סכומים וזכויות, בין שהם משולמים ישירות מהמעסיק ובין שדרך קופות גמל",
            "to_he": "המעסיק מוסר את הטופס המלא לפקיד השומה שבו מתנהל תיק הניכויים שלו, וגם לעובד",
            "worker_he": "העובד ממלא בחלק ב' את בחירותיו לגבי מענקי הפרישה; כשחלפו יותר משלושה חודשים מהפרישה, מצרפים גם אישור יתרה עדכני מהקופות",
        },
        "ministry": {
            "topic_he": "משרד העבודה: פיטורים וסיום העסקה",
            "topic_url": TOPIC,
            "complaint_he": "משרד העבודה: הגשת תלונה על מעסיקים בשל הפרת חוקי עבודה",
            "complaint_url": COMPLAINT,
            "complaint_note_he": "תלונה פותחת הליך עונשי או מינהלי נגד המעסיק, ואפשר להגיש אותה גם בעילום שם; את הכסף עצמו תובעים בבית הדין האזורי לעבודה",
        },
    }
