"""The annual-leave dataset of the co.il tools registry (the labor wave, 22.10.2026): the vacation instrument
(chufsha-shnatit) on /annual-leave-calculator/, and the redemption engine the final-settlement lane (gmar) imports.
Discovered by tools/justice_tools_labor.py (glob), built with --labor-checked-on.

Every value was read on checked_on from the official text named next to it:
- the Annual Leave Law, 1951 (Nevo's consolidated text, current to 21.7.2026): ss.1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13,
  14(b), 15, 17, 31 and the schedule (s.6);
- the amendment that set 16 days for the first five years from 1.1.2017: Annual Leave Law (Amendment No. 15 and Temporary
  Provision), 2016, Sefer HaHukim 2531 (16.2.2016) p.574, ss.1-2 (the Knesset's PDF);
- the table before that amendment (14 days for years 1-4, 16 for year 5): the law's text as published by the National
  Insurance Institute (amendments to 2013);
- the Ministry of Labor guide "חופשה שנתית" (published 15.7.2021): the law's table from 1.1.2017 in gross days and in
  work days for a 6-day and a 5-day week, the extension order on the shortened work week (net work days, the better of the
  two applies, and who it does not cover), the manpower-contractor order of 2.8.2004, the 200/240 examples, and the
  vacation-pay chapter;
- the Minimum Wage Law, 1987, s.1 ("daily minimum wage": the 25th part of the month for a 6-day week, the 21 2/3 part for
  a 5-day week): the only month-to-work-day ratio an Israeli statute states; the tool uses it to value a leave day of a
  monthly worker and says so;
- the Wage Protection Law, 1958 (Nevo, current to 7.11.2025): s.9 (a monthly wage is due at the end of the month), s.1
  ("the determining day": the ninth day after the due date; unpaid by then = a delayed wage) and the addendum to s.24(b),
  item (5) (the payslip shows the leave days given and the balance).
Nothing here is estimated; what the sources do not state (how many past years a court redeems, how a quarter's calendar-day
average turns into work days) is not a number in this file (see parts/chufsha/notes.md).
"""
from __future__ import annotations

KEY = "labor_chufsha"

LEAVE_LAW = "https://www.nevo.co.il/law_html/law00/71906.htm"            # חוק חופשה שנתית, התשי"א-1951 (נוסח ל-21.7.2026)
LEAVE_LAW_2013 = "https://www.btl.gov.il/Laws1/02_0082_000000.pdf"       # נוסח החוק באתר הביטוח הלאומי (תיקונים עד התשע"ג)
AMEND_15 = "https://fs.knesset.gov.il/20/law/20_lsr_321784.pdf"          # ס"ח 2531, 16.2.2016, עמ' 574: תיקון מס' 15 והוראת שעה
EXTENDED_REGS = "https://www.nevo.co.il/law_html/law00/71908.htm"        # תקנות חופשה שנתית (חופשה מוארכת), תשכ"ד-1963
GUIDE = "https://www.gov.il/he/Departments/Guides/annual-vacations"      # משרד העבודה, מדריך "חופשה שנתית", פורסם 15.7.2021
GUIDE_CH2 = GUIDE + "?chapterIndex=2"                                    # כללים לחישוב מספר ימי החופשה (200/240)
GUIDE_CH3 = GUIDE + "?chapterIndex=3"                                    # מספר ימי חופשה לפי ותק (החוק, צו ההרחבה, קבלן כוח אדם)
GUIDE_CH4 = GUIDE + "?chapterIndex=4"                                    # מועד החופשה השנתית
GUIDE_CH5 = GUIDE + "?chapterIndex=5"                                    # דמי חופשה, תמורת חופשה ופדיון חופשה
MIN_WAGE_LAW = "https://www.nevo.co.il/law_html/law00/98675.htm"         # חוק שכר מינימום, התשמ"ז-1987 (נוסח ל-5.3.2026)
WAGE_LAW = "https://www.nevo.co.il/law_html/law00/71689.htm"             # חוק הגנת השכר, התשי"ח-1958 (נוסח ל-7.11.2025)
COMPLAINT = "https://www.gov.il/he/service/work-rights-violation-complaints"  # הגשת תלונה על מעסיקים בשל הפרת חוקי עבודה


def build(checked_on: str) -> dict:
    """The leave table by seniority (law and extension order), the partial-year rules, when leave is taken, what it pays,
    the redemption on leaving and the dates that follow."""
    return {
        "name_he": "חופשה שנתית: ימים לפי ותק, שנה חלקית, דמי חופשה ופדיון בסיום העבודה",
        "publisher_he": "חוק חופשה שנתית, משרד העבודה (מדריך חופשה שנתית), חוק שכר מינימום וחוק הגנת השכר",
        "source_name": "חוק חופשה שנתית, התשי\"א-1951 (נוסח עדכני)",
        "source_url": LEAVE_LAW,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        # The table changes only by an amendment of the law or a new extension order; checked once a year.
        "next_update": "2027-10-22",
        "law": {
            "he": "חוק חופשה שנתית, התשי\"א-1951",
            "short_he": "חוק חופשה שנתית",
            "url": LEAVE_LAW,
            "current_to": "2026-07-21",
            # s.1: the work year is the calendar year (twelve months from 1 January).
            "work_year_he": "שנת עבודה היא שנה קלנדרית: 12 חודשים שמתחילים ב-1 בינואר",
            "sections": {
                "work_year": "סעיף 1", "length": "סעיף 3(א)", "full_year": "סעיף 3(ב)", "part_year": "סעיף 3(ג)",
                "temp": "סעיף 4", "not_counted": "סעיף 5", "when": "סעיף 6(א)", "own_day": "סעיף 6(ב)", "carry": "סעיף 7(א)",
                "split": "סעיף 8", "start_notice": "סעיף 9", "pay": "סעיף 10", "pay_monthly": "סעיף 10(ב)(1)",
                "pay_wage": "סעיף 10(ב)(2)", "pay_due": "סעיף 11", "redeem": "סעיף 13", "dispute": "סעיף 14(ב)",
                "temp_pay": "סעיף 15(א)", "as_wage": "סעיף 17", "limitation": "סעיף 31",
            },
            # s.3(א), last sentence: the law counts calendar days, one weekly rest day in every seven days of leave.
            "gross_he": "החוק סופר ימי לוח: בימי החופשה נכללת מנוחה שבועית אחת לכל שבעה ימי חופשה",
            "full_year_days": 200,      # s.3(ב): the relationship lasted the whole work year
            "part_year_days": 240,      # s.3(ג): the relationship lasted part of the work year
            "fraction_he": "חלק של יום חופשה לא יובא במניין",
            "temp_days": 75,            # s.4(א): a wage worker who worked fewer than 75 consecutive days gets no leave
            "temp_pct": 4,              # s.15(א): ... but a leave equivalent of at least 4% of the wage
            "temp_he": "עובד לפי שעה או יום שעבד פחות מ-75 ימים רצופים אצל אותו מעסיק אינו מקבל ימי חופשה, אלא תמורת חופשה של 4% לפחות משכר העבודה",
            "not_counted_he": [
                "ימי שירות מילואים",
                "ימי חג שלא עובדים בהם (לא ימי המנוחה השבועית)",
                "ימי תקופת לידה והורות",
                "ימים שבהם אי אפשר לעבוד בגלל תאונה או מחלה",
                "ימי אבל במשפחה שבהם לא עובדים",
                "ימי שביתה או השבתה",
                "ימי הודעה מוקדמת לפיטורים, עד 14 ימים",
            ],
            "notice_days_not_counted": 14,   # s.5(א)(7)
            "when_he": "החופשה ניתנת בחודש האחרון של שנת העבודה שבעדה היא מגיעה, או במהלך שנת העבודה שאחריה",
            "own_day_he": "יום אחד במהלך השנה במועד שבוחרים, ועוד יום אחד מהימים שבתוספת לחוק (למשל ערב ראש השנה, צום גדליה, ערב יום הכיפורים, יום האזכרה של קרוב משפחה), בהודעה למעסיק 30 ימים מראש",
            "own_day_notice": 30,            # s.6(ב)
            "carry_min_days": 7,             # s.7(א)
            "carry_years": 2,                # s.7(א)
            "carry_he": "אין לצבור חופשה; בהסכמת המעסיק אפשר לקחת לפחות 7 ימים בשנה ולצרף את היתרה לחופשה של שתי שנות העבודה הבאות",
            "split_he": "החופשה רצופה; בהסכמה אפשר לחלק אותה, ובלבד שחלק אחד יהיה 7 ימים לפחות",
            "start_notice_days": 14,         # s.9(א): the start date is set at least 14 days ahead (parts of 7 days or more)
            "pay_monthly_he": "עובד חודשי: השכר שהיה מקבל בעד אותה תקופה אילו המשיך לעבוד",
            "pay_wage_he": "עובד לפי שעה או יום: השכר היומי הממוצע כפול ימי החופשה; השכר היומי הממוצע הוא שכר רבע השנה שלפני החופשה חלקי 90, ואם היו בו חודשים לא מלאים, לפי בחירת העובד, רבע השנה המלא ביותר ב-12 החודשים שלפני החופשה",
            "quarter_divisor": 90,           # s.10(ב)(2)
            "pay_due_he": "דמי החופשה משולמים לכל המאוחר ביום תשלום השכר הרגיל; ביציאה לחופשה של 7 ימים לפחות אפשר לבקש אותם עד יומיים לפני",
            "redeem_he": "מי שהפסיק לעבוד לפני שקיבל את החופשה שהגיעה לו עד אותו יום, מקבל פדיון חופשה: הסכום שהיה מקבל כדמי חופשה אילו יצא לחופשה ביום שבו הפסיק לעבוד",
            "as_wage_he": "דמי חופשה, פדיון חופשה ותמורת חופשה דינם כדין שכר עבודה",
            "dispute_he": "מחלוקת על חישוב דמי החופשה או הפדיון מכריע בית הדין האזורי לעבודה",
            "limitation_years": 3,           # s.31
            "limitation_he": "תקופת ההתיישנות לכל תביעה לפי חוק חופשה שנתית היא שלוש שנים",
        },
        # The table of s.3(א) from 1.1.2017, as the Ministry's guide prints it: gross (calendar) days and the work days
        # inside them for a 6-day and a 5-day week. A row holds the seniority years from..to (to null = and on).
        "law_table": {
            "he": "ימי החופשה לפי ותק לפי החוק, מ-1.1.2017",
            "from": "2017-01-01",
            "section": "סעיף 3(א)",
            "url": GUIDE_CH3,
            "rows": [
                {"from": 1, "to": 5, "gross": 16, "net6": 14, "net5": 12},
                {"from": 6, "to": 6, "gross": 18, "net6": 16, "net5": 14},
                {"from": 7, "to": 7, "gross": 21, "net6": 18, "net5": 15},
                {"from": 8, "to": 8, "gross": 22, "net6": 19, "net5": 16},
                {"from": 9, "to": 9, "gross": 23, "net6": 20, "net5": 17},
                {"from": 10, "to": 10, "gross": 24, "net6": 21, "net5": 18},
                {"from": 11, "to": 11, "gross": 25, "net6": 22, "net5": 19},
                {"from": 12, "to": 12, "gross": 26, "net6": 23, "net5": 20},
                {"from": 13, "to": 13, "gross": 27, "net6": 24, "net5": 20},
                {"from": 14, "to": None, "gross": 28, "net6": 24, "net5": 20},
            ],
        },
        # The extension order on the shortened work week (the guide, chapter 3): net work days; the better of the law and
        # the order applies; it does not cover the workplaces listed in "excluded_he".
        "order_table": {
            "he": "צו ההרחבה בדבר הנהגת שבוע עבודה מקוצר",
            "short_he": "צו ההרחבה (שבוע עבודה מקוצר)",
            "url": GUIDE_CH3,
            "better_he": "כשיש פער בין החוק לצו ההרחבה, העובד זכאי למספר הימים הגבוה מביניהם",
            "excluded_he": [
                "מקום עבודה שמועסקים בו פחות מארבעה עובדים",
                "עובדים ומעסיקים שהמעבר לשבוע של 5 ימים הוסדר לגביהם בהסכם קיבוצי",
                "חברה ממשלתית",
                "חברה עירונית",
                "מעסיק שוועדת הפיקוח קבעה שהצו לא יחול עליו",
            ],
            "rows": [
                {"from": 1, "to": 2, "net6": 12, "net5": 10},
                {"from": 3, "to": 4, "net6": 13, "net5": 11},
                {"from": 5, "to": 5, "net6": 14, "net5": 12},
                {"from": 6, "to": 8, "net6": 19, "net5": 17},
                {"from": 9, "to": None, "net6": 26, "net5": 23},
            ],
        },
        "manpower_table": {
            "he": "צו ההרחבה בעניין אספקת שירותי כוח אדם (2.8.2004)",
            "short_he": "צו ההרחבה לעובדי קבלן כוח אדם",
            "url": GUIDE_CH3,
            "rows": [
                {"from": 1, "to": 4, "net6": 13, "net5": 11},
                {"from": 5, "to": 5, "net6": 14, "net5": 12},
                {"from": 6, "to": 8, "net6": 19, "net5": 17},
                {"from": 9, "to": None, "net6": 26, "net5": 23},
            ],
        },
        # What changed and when (only published values): the s.3(א) table before amendment 15, the temporary provision of
        # the second half of 2016, and the table from 1.1.2017 (law_table).
        "history": {
            "before": {
                "he": "לפני תיקון 15 (הנוסח עד 30.6.2016)",
                "url": LEAVE_LAW_2013,
                "rows": [
                    {"from": 1, "to": 4, "gross": 14},
                    {"from": 5, "to": 5, "gross": 16},
                    {"from": 6, "to": 6, "gross": 18},
                    {"from": 7, "to": 7, "gross": 21},
                ],
                "after_he": "משנה 8: יום נוסף לכל שנה, עד 28 יום",
            },
            "amendment": {
                "he": "חוק חופשה שנתית (תיקון מס' 15 והוראת שעה), התשע\"ו-2016",
                "gazette_he": "ספר החוקים 2531, 16.2.2016, עמ' 574",
                "url": AMEND_15,
                "from": "2017-01-01",
                "temp_from": "2016-07-01",
                "temp_days": 15,
                "change_he": "בסעיף 3(א)(1) במקום \"מ-4\" בא \"מ-5\" ובמקום \"14\" בא \"16\", ופסקה (2) נמחקה (סעיף 1); התחילה ב-1.1.2017 (סעיף 2(א))",
                "temp_he": "מ-1.7.2016 ועד 1.1.2017 קוראים בסעיף 3(א)(1) 15 במקום 14 (סעיף 2(ב))",
            },
            "order_he": "צו ההרחבה בעניין אספקת שירותי כוח אדם, 2.8.2004",
            "order_from": "2004-08-02",
        },
        # The value of a leave day. The law values leave by the pay of the period (s.10); no statute gives a month-to-work-day
        # divisor for leave. The Minimum Wage Law s.1 does, for the daily minimum wage, and the tool uses that ratio.
        "day_ratio": {
            "he": "חוק שכר מינימום, התשמ\"ז-1987, סעיף 1, ההגדרה \"שכר מינימום יומי\"",
            "url": MIN_WAGE_LAW,
            "w6": 25,
            # 21 2/3 exactly (the law's fraction): numerator and denominator, so no rounding enters the registry.
            "w5_num": 65,
            "w5_den": 3,
            "w5_he": "21⅔",
            "note_he": "החוק לא קובע במה מחלקים שכר חודשי כדי לקבל יום חופשה; המחשבון משתמש ביחס שחוק שכר מינימום קובע לשכר היומי: חלק 25 מהחודש בשבוע של 6 ימים, וחלק 21⅔ בשבוע של 5 ימים. אפשר להקליד במקומו את ערך היום מהתלוש",
        },
        "wage": {
            "he": "חוק הגנת השכר, התשי\"ח-1958",
            "url": WAGE_LAW,
            "current_to": "2025-11-07",
            "due_section": "סעיף 9",
            "due_he": "שכר חודשי משולם עם תום החודש שבעדו הוא משתלם",
            "late_day": 9,                   # s.1: "היום הקובע" = the ninth day after the due date
            "late_section": "סעיף 1, \"היום הקובע\"",
            "late_he": "שכר שלא שולם עד היום התשיעי שאחרי מועד התשלום הוא שכר מולן, ונוסף לו פיצוי הלנת שכר (סעיף 17)",
            "payslip_section": "התוספת לסעיף 24(ב), פרט (5)",
            "payslip_he": "תלוש השכר מציין את ימי החופשה שניתנו בתקופת התשלום ואת יתרת ימי החופשה",
        },
        "extended": {
            "he": "תקנות חופשה שנתית (חופשה מוארכת), תשכ\"ד-1963",
            "url": EXTENDED_REGS,
            "text_he": "בעבודות מסוימות (למשל קרינה מייננת, ייצור זכוכית, מקצועות מסוימים בבתי חולים) ובענפים שיש להם הסכם או צו הרחבה (למשל חקלאות, מתכת, חשמל ואלקטרוניקה) מגיעה חופשה ארוכה יותר",
        },
        "guide": {
            "he": "משרד העבודה, היחידה ליחסי עבודה: מדריך \"חופשה שנתית\"",
            "url": GUIDE,
            "published": "2021-07-15",
            "ch2": GUIDE_CH2, "ch3": GUIDE_CH3, "ch4": GUIDE_CH4, "ch5": GUIDE_CH5,
            "minimum_he": "הזכויות במדריך הן זכויות המינימום לפי החוק; הסכם קיבוצי, צו הרחבה ענפי או חוזה אישי יכולים לתת יותר",
        },
        "services": {
            "complaint_he": "הגשת תלונה על מעסיק בשל הפרת חוקי עבודה (משרד העבודה)",
            "complaint_url": COMPLAINT,
        },
    }
