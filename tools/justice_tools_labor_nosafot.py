"""The overtime time-card dataset (the labor-law wave, 22.10.2026): the instrument on /overtime-pay-israel/ (tool id
shaot-nosafot).

It extends, never repeats, the rights wave 2A dataset rights_neto.overtime (tools/justice_tools_rights_neto.py), which
already holds 125% for the first two overtime hours of a day, 150% after them, 150% for the weekly rest, the 182-hour
divisor, the 42-hour week, 12 hours a day and 16 overtime hours a week; the engine reads those values from there. The
minimum wage rows are read from min_wage and the 7-year limitation from severance.limitation, both with their own
sources. This file adds only what the time card needs and they do not hold: the night-work definition and the shorter
day (s.1, s.2), the 45-hour week of the law and its 8-hour day, the 5-day week's 8.6/7.6 hours, the night worker's
58-hour week, the weekly rest (s.7), breaks (s.20, s.21), night shifts (s.22), the hours register (s.25), who the law
does not cover (s.30), the Wage Protection Law's pay day and "determining day" (s.9, s.10), the all-in wage rule (s.5),
the burden of proof (s.26ב), the delayed-wage compensation and its 1-year limit (s.17, s.17א), the Youth Labor Law
limits (s.20, s.21, s.24), the Ministry's directive that overtime is counted per day and per week, and the dated history.

Every value below was read on checked_on from the official text named next to it: Nevo's consolidated texts of the
Hours of Work and Rest Law 1951 (current to 18.9.2023), the Wage Protection Law 1958 (current to 7.11.2025), the
Limitation Law 1958 and the Youth Labor Law 1953 (current to 5.6.2024); the Ministry of Labor's BlobFolder PDFs: the
2018 extension order on the shorter week, the 2023 minimum-hourly-wage enforcement procedure, the 21.2.2018 enforcement
directive on unpaid overtime, and the legal department's February 2022 review of hours of work (which states the general
permit of 19.3.2018 and the 8.6/7.6 hours). The text files are in the wave's parts folder (sources/). Nothing is
estimated; what the sources do not state (a combined rate for overtime on the rest day, a 6-day week's daily split under
the 42-hour order, holiday pay) is not in the file.
"""
from __future__ import annotations

KEY = "labor_nosafot"

HOURS_LAW = "https://www.nevo.co.il/law_html/law00/5174.htm"        # חוק שעות עבודה ומנוחה, התשי"א-1951
WAGE_LAW = "https://www.nevo.co.il/law_html/law00/71689.htm"        # חוק הגנת השכר, התשי"ח-1958
LIMITATION_LAW = "https://www.nevo.co.il/law_html/law00/71809.htm"  # חוק ההתיישנות, התשי"ח-1958
YOUTH_LAW = "https://www.nevo.co.il/law_html/law00/4273.htm"        # חוק עבודת הנוער, התשי"ג-1953
WEEK_ORDER = ("https://www.gov.il/BlobFolder/dynamiccollectorresultitem/extention-order-short-week-2018/he/"
              "extention-order-short-week-2018.pdf")
DIVISOR = ("https://www.gov.il/BlobFolder/policy/instructions-regarding-hourly-minimum-wage-in-light-a-shorten-work-week/"
           "he/workers-rights_enforcement-and-exercise-of-rights_minimum-wage-enforcement-procedure.pdf")
DIRECTIVE = ("https://www.gov.il/BlobFolder/policy/directive-regarding-non-payment-of-minimum-wage-for-overtime-hours/he/"
             "procedures_non-payment-overtime-hours.pdf")
REVIEW = "https://www.gov.il/BlobFolder/legalinfo/rest-flexibility/he/workers-rights_rest-flexibility.pdf"
COMPLAINT = "https://www.gov.il/he/service/work-rights-violation-complaints"
PERMIT_SERVICE = "https://www.gov.il/he/service/request-for-employment-during-weekend-or-extra-hours"


def build(checked_on: str) -> dict:
    """The rules a weekly time card is measured against, each with its section and source."""
    return {
        "name_he": "שעות נוספות ועבודה במנוחה השבועית: כרטיס הנוכחות מול החוק",
        "publisher_he": "חוק שעות עבודה ומנוחה, חוק הגנת השכר, צו ההרחבה לקיצור שבוע העבודה ומשרד העבודה",
        "source_name": "חוק שעות עבודה ומנוחה, התשי\"א-1951 (נוסח עדכני); צו הרחבה בדבר קיצור שבוע העבודה במשק (2018); "
                       "חוק הגנת השכר, התשי\"ח-1958; הלשכה המשפטית במשרד העבודה",
        "source_url": HOURS_LAW,
        "checked_on": checked_on,
        "refresh_every_days": 183,
        # The minimum wage (min_wage) changes every 1 April; nothing in this file has a fixed update day.
        "next_update": "2027-04-01",
        "law_he": "חוק שעות עבודה ומנוחה, התשי\"א-1951",
        "law_short_he": "חוק שעות עבודה ומנוחה",
        "law_url": HOURS_LAW,
        "law_current_to": "2023-09-18",
        "wage_law_he": "חוק הגנת השכר, התשי\"ח-1958",
        "wage_law_url": WAGE_LAW,
        "wage_law_current_to": "2025-11-07",
        "limitation_url": LIMITATION_LAW,
        "youth_law_he": "חוק עבודת הנוער, התשי\"ג-1953",
        "youth_law_url": YOUTH_LAW,
        "order_he": "צו הרחבה בדבר קיצור שבוע העבודה במשק",
        "order_url": WEEK_ORDER,
        "review_he": "הלשכה המשפטית במשרד העבודה: חוק שעות עבודה ומנוחה, גמישות בשעות העבודה בעידן המודרני (פברואר 2022)",
        "review_url": REVIEW,
        "directive_he": "משרד העבודה, הלשכה המשפטית (תביעה): הנחייה לעניין אי תשלום שעות נוספות (21.2.2018)",
        "directive_url": DIRECTIVE,
        "divisor_he": "משרד העבודה: הנחיית אכיפה בנוגע לשכר מינימום שעתי לאור צו ההרחבה (25.4.2023)",
        "divisor_url": DIVISOR,
        # s.1: "overtime" = hours beyond the day of s.2 or the week of s.3 (or one set under s.4).
        "overtime_def": {"he": "שעות נוספות הן שעות העבודה שמעבר ליום העבודה או מעבר לשבוע העבודה", "section": "סעיף 1"},
        # s.1: "night work" = work of which at least two hours fall between 22:00 and 06:00.
        "night": {
            "from": "22:00", "to": "06:00", "min_hours": 2,
            "he": "עבודת לילה: עבודה ששעתיים ממנה לפחות הן בין 22:00 ל-06:00",
            "section": "סעיף 1 (הגדרת עבודת לילה)",
        },
        # s.2(א) 8 hours; s.2(ב) 7 hours at night, on the day before the weekly rest and before a holiday the worker does
        # not work on; s.3 a 45-hour week (the extension order brings it to 42).
        "day": {
            "regular": 8, "short": 7,
            "he": "יום עבודה: עד 8 שעות; בעבודת לילה, ביום שלפני המנוחה השבועית וביום שלפני חג: עד 7 שעות",
            "section": "סעיף 2(א) ו-2(ב)",
        },
        "law_week": {"hours": 45, "section": "סעיף 3"},
        # The 2018 order (its 42 hours and 182 divisor are read from rights_neto.overtime): the week shortened by one hour to 42, by one fixed shortened day (2.1, 2.2); the hour cut from
        # that day, if worked, is paid as an overtime hour (2.5); the hourly wage on 182 hours a month (2.8). Published
        # 19.3.2018 (the review, p.11 and the 2023 procedure), in force 1.4.2018 (the 2023 procedure).
        "order": {
            "from": "2018-04-01", "published": "2018-03-19", "agreement": "7019/2017",
            "he": "שבוע העבודה: 42 שעות בלי הפחתה בשכר, בקיצור של שעה ביום אחד קבוע בשבוע (היום המקוצר)",
            "short_hour_he": "עבודה בשעה שהופחתה ביום המקוצר משולמת כשעה נוספת",
            "section": "סעיפים 2.1, 2.2 ו-2.5 לתוספת לצו",
            "divisor_section": "סעיף 2.8 לתוספת לצו",
        },
        # The legal department's review (Feb. 2022), p.23: the day is limited to 8.6 hours and, under the order, one fixed
        # day is shortened to 7.6 hours (4 x 8.6 + 7.6 = 42: the 5-day week).
        "five": {
            "day": 8.6, "short": 7.6,
            "he": "שבוע של 5 ימים: יום עבודה עד 8.6 שעות, ויום קבוע אחד מקוצר ל-7.6 שעות (4 × 8.6 + 7.6 = 42)",
            "section": "הלשכה המשפטית במשרד העבודה, סקירה מפברואר 2022, עמ' 23, לפי צו ההרחבה",
        },
        # The general permit of 19.3.2018 (Yalkut HaPirsumim 7732, p.6284), per the review p.13: a day of up to 12 hours
        # with overtime, up to 16 overtime hours a week, and a night worker's week of up to 58 hours with overtime. The
        # first two are also in rights_neto.overtime (max_day, max_week_overtime); the 58 is new here.
        "permit": {
            "published": "2018-03-19", "night_week": 58, "gazette_he": "י\"פ התשע\"ח 7732, עמ' 6284",
            "he": "ההיתר הכללי להעסקה בשעות נוספות: עד 12 שעות ביום כולל שעות נוספות, עד 16 שעות נוספות בשבוע; עובד בעבודת לילה: עד 58 שעות בשבוע כולל שעות נוספות",
            "section": "ההיתר הכללי מ-19.3.2018 (לפי סקירת הלשכה המשפטית, עמ' 13)",
            "replaced_he": "ההיתר ביטל את שני ההיתרים הקודמים, לשבוע של 5 ימים ולשבוע של 6 ימים",
            "service_url": PERMIT_SERVICE,
        },
        # The enforcement directive of 21.2.2018: overtime is counted per day and per week, never per month; days above
        # the daily quota are not offset against shorter days unless the work is under a "flexible hours" arrangement.
        "count": {
            "he": "שעות נוספות נספרות לפי כל יום ולפי כל שבוע, לא לפי חודש: אין לקזז יום ארוך מול יום קצר, אלא בהסדר של שעות גמישות",
            "section": "הנחיית משרד העבודה מ-21.2.2018",
        },
        # s.16(א); s.16(ב) the time-off alternative only for monthly workers in the s.4(א)(2)/4(ב) jobs.
        "pay": {
            "he": "שתי השעות הנוספות הראשונות של היום: לפחות 125% מהשכר הרגיל; כל שעה אחריהן: לפחות 150%",
            "section": "סעיף 16(א)",
            "rest_off_he": "בעבודות שבסעיף 4(א)(2) ו-4(ב), לעובד בשכר חודשי, המעסיק רשאי לתת מנוחה של שעה ורבע (ושעה וחצי) במקום התשלום",
            "rest_off_section": "סעיף 16(ב)",
        },
        # s.17(א)(1) 150%; s.17(ב) a monthly worker may get 1.5 hours of rest per hour instead.
        "rest_pay": {
            "he": "שעות במנוחה השבועית: לפחות 150% מהשכר הרגיל",
            "section": "סעיף 17(א)(1)",
            "monthly_off_he": "לעובד בשכר חודשי המעסיק רשאי לתת מנוחה של שעה וחצי לפחות לכל שעה במקום הגמול",
            "monthly_off_section": "סעיף 17(ב)",
            "combined_he": "החוק אינו קובע שיעור מצטבר לשעות שמעבר ליום עבודה רגיל בתוך המנוחה השבועית; המחשבון מציג את מה שסעיף 17 קובע (150%) ומסמן את השעות האלה",
        },
        # s.18: the "regular wage" includes every addition the employer pays; the 2018 directive: it is never below the
        # minimum wage.
        "regular": {
            "he": "השכר הרגיל לעניין הגמול כולל את כל התוספות שהמעסיק משלם",
            "section": "סעיף 18",
            "min_he": "השכר הרגיל אינו יכול להיות נמוך משכר המינימום",
            "min_section": "הנחיית משרד העבודה מ-21.2.2018",
        },
        # s.7(א) 36 consecutive hours; s.7(ב) Saturday for a Jewish worker; Saturday, Sunday or Friday for others.
        "rest": {
            "hours": 36,
            "he": "מנוחה שבועית: לפחות 36 שעות רצופות, הכוללות את יום השבת ליהודי, ולמי שאינו יהודי את השבת, יום ראשון או יום שישי לפי המקובל עליו",
            "section": "סעיף 7",
            "permit_he": "העסקה במנוחה השבועית אסורה בלי היתר",
            "permit_section": "סעיפים 9 ו-12",
        },
        # s.20(א)-(ג): a break of 3/4 hour on a day of 6 hours or more, incl. one continuous half hour; a break where the
        # worker must stay counts as work. s.21: 8 hours between one working day and the next.
        "break": {
            "min_day": 6, "minutes": 45, "continuous": 30,
            "he": "ביום של 6 שעות ומעלה: הפסקה של 45 דקות לפחות, מהן חצי שעה רצופה; הפסקה שבה המעסיק דורש להישאר במקום העבודה נספרת כשעות עבודה",
            "section": "סעיף 20(א) ו-20(ג)",
        },
        "gap": {"hours": 8, "he": "בין יום עבודה למשנהו: הפסקה של 8 שעות לפחות", "section": "סעיף 21"},
        # s.22(א): in a shift workplace, night work no more than one week in two.
        "night_shift": {"he": "במפעל שעובדים בו במשמרות: לא יותר משבוע אחד של עבודת לילה בכל שבועיים", "section": "סעיף 22(א)"},
        # s.25(א), (א1): a running register of hours actually worked.
        "register": {
            "he": "המעסיק חייב לנהל פנקס שעות עבודה, שעות נוספות ומנוחה שבועית, עם רישום שוטף של השעות בפועל",
            "section": "סעיף 25",
        },
        # s.30(א)(5)-(6) (and (1)-(4)): the law does not apply to management, positions of special personal trust, and
        # workers whose hours the employer cannot supervise at all; a dispute goes to the labor court (s.30(ב)).
        "excluded": {
            "he": "החוק לא חל על עובדים בתפקידי הנהלה או בתפקידים הדורשים מידה מיוחדת של אמון אישי, ועל עובדים שהמעסיק אינו יכול לפקח כלל על שעות עבודתם",
            "section": "סעיף 30(א)(5) ו-(6)",
            "dispute_he": "מחלוקת אם העובד בקבוצות האלה מוכרעת בבית הדין לעבודה",
            "dispute_section": "סעיף 30(ב)",
        },
        # Wage Protection Law s.9 (a monthly wage is paid at the end of the month it is paid for), s.10 (hourly, daily or
        # weekly: at the end of the half-month, unless agreed otherwise or advances were paid through the month), s.1
        # ("determining day" = the 9th day after the payment date; a wage not paid by then is a delayed wage).
        "pay_day": {
            "after_days": 9,
            "he": "שכר חודשי משולם עם תום החודש; שכר שלא שולם עד היום התשיעי שאחריו הוא שכר מולן",
            "section": "סעיפים 1 (היום הקובע) ו-9 לחוק הגנת השכר",
            "hourly_he": "שכר לפי שעה, יום או שבוע: בתום מחצית החודש, אלא אם נקבע אחרת בהסכם או שהעובד הועסק כל החודש וקיבל מקדמות",
            "hourly_section": "סעיף 10 לחוק הגנת השכר",
        },
        # s.17(א): delayed-wage compensation = the higher of 5% for the first week and 10% for each week after, or
        # linkage + 20% a month; s.17א(א): that right (unlike the wage) lapses one year after the wage became delayed, or 60
        # days after the late wage was received, whichever is earlier (the regional court may extend the 60 days to 90).
        "delay": {
            "comp_years": 1,
            "he": "לשכר מולן מתווסף פיצוי הלנת שכר: הגבוה מבין 5% לשבוע הראשון ו-10% לכל שבוע אחריו, לבין הפרשי הצמדה ועוד 20% לחודש",
            "section": "סעיף 17(א) לחוק הגנת השכר",
            "limit_he": "הזכות לפיצוי הלנת שכר (לא לשכר עצמו) מתיישנת שנה מהיום שבו השכר נעשה מולן, או 60 ימים מהיום שבו קיבלתם את השכר המולן, המוקדם מביניהם (בית הדין האזורי רשאי להאריך את 60 הימים ל-90)",
            "limit_section": "סעיף 17א(א) לחוק הגנת השכר",
        },
        # Wage Protection Law s.5: an all-in wage that includes overtime or rest-day pay is regular wage only (unless an
        # approved collective agreement says otherwise); s.24: the payslip itemises overtime; s.26ב(ג): without the line
        # on the payslip, the wage is presumed all-in, i.e. regular wage without overtime.
        "global": {
            "he": "שכר כולל שנקבע \"כולל שעות נוספות\" נחשב לשכר רגיל בלבד, אלא אם נקבע אחרת בהסכם קיבוצי שאושר",
            "section": "סעיף 5 לחוק הגנת השכר",
            "slip_he": "בתלוש השכר מפרטים את גמול השעות הנוספות: מספר השעות והסכום",
            "slip_section": "סעיף 24 לחוק הגנת השכר והתוספת לו",
            "presume_he": "אם התלוש לא כולל את רכיב השעות הנוספות, חזקה שהשכר ששולם הוא שכר רגיל שאינו כולל אותן",
            "presume_section": "סעיף 26ב(ג) לחוק הגנת השכר",
        },
        # s.26ב(א)-(ב): without an hours register the employer bears the burden of proving the hours, for up to 15 overtime
        # hours a week or 60 a month.
        "burden": {
            "week": 15, "month": 60,
            "he": "אם המעסיק לא מציג פנקס שעות עבודה, עליו להוכיח שהעובד לא עבד את השעות שבמחלוקת, עד 15 שעות נוספות בשבוע או 60 בחודש",
            "section": "סעיף 26ב(א) ו-(ב) לחוק הגנת השכר",
        },
        # Limitation Law s.5(1) (7 years) and s.6 (from the day the cause arose): the same 7 years severance.limitation
        # holds; the engine reads the years from there.
        "limitation": {"he": "תביעה לשכר (כולל גמול שעות נוספות) מתיישנת 7 שנים מהיום שבו נולדה העילה", "section": "סעיפים 5(1) ו-6 לחוק ההתיישנות"},
        # Youth Labor Law s.20(א) 8 hours a day and 40 a week; s.20(א1) up to 9 a day where the Hours Law allows a longer
        # day (s.5(א)), still 40 a week; s.21(א) no work on the weekly rest; s.24 no night work: 20:00-08:00 for those under
        # the Compulsory Education Law, 22:00-06:00 for a 16-17 year old it does not apply to.
        "youth": {
            "day": 8, "day_long": 9, "week": 40,
            "he": "נער (עד גיל 18): עד 8 שעות ביום ו-40 בשבוע, בלי עבודה במנוחה השבועית ובלי עבודת לילה (20:00 עד 08:00 למי שחוק לימוד חובה חל עליו; 22:00 עד 06:00 לצעיר שאינו חייב בלימודים)",
            "section": "סעיפים 20, 21 ו-24 לחוק עבודת הנוער",
        },
        "complaint": {
            "he": "תלונה למשרד העבודה (מינהל הסדרה ואכיפה) על הפרת חוקי עבודה, עם תלושי שכר ודוחות נוכחות",
            "url": COMPLAINT,
        },
        # The dated values the law and the Ministry published (the timeline on the page). Only published values.
        "history": [
            {"from": "1951-09-28", "he": "חוק שעות עבודה ומנוחה נכנס לתוקף: יום עבודה של 8 שעות (7 בלילה ובערב מנוחה), שבוע של 45 שעות, 125% ו-150% לשעות נוספות, 150% במנוחה השבועית",
             "section": "סעיפים 2, 3, 16, 17 ו-37", "url": HOURS_LAW},
            # The 2023 procedure: "on 1.12.96 the extension order to the framework agreement was published, signed after
            # collective agreement 27010/95; it cut the week from 45 to 43 hours; the hour value on 186 hours a month".
            {"from": "1996-12-01", "he": "פורסם צו ההרחבה להסכם המסגרת (הסכם קיבוצי 27010/95): שבוע העבודה מ-45 ל-43 שעות, וערך השעה לפי 186 שעות בחודש",
             "section": "נוהל האכיפה של משרד העבודה מ-25.4.2023", "url": DIVISOR},
            {"from": "2018-03-19", "he": "היתר כללי חדש להעסקה בשעות נוספות: עד 12 שעות ביום, עד 16 שעות נוספות בשבוע, 58 שעות לעובד לילה",
             "section": "י\"פ התשע\"ח 7732, עמ' 6284", "url": REVIEW},
            {"from": "2018-04-01", "he": "צו ההרחבה לקיצור שבוע העבודה: 42 שעות בשבוע ויום מקוצר אחד, שכר השעה לפי 182 שעות בחודש",
             "section": "סעיפים 2.1, 2.2 ו-2.8 לתוספת לצו", "url": WEEK_ORDER},
        ],
    }
