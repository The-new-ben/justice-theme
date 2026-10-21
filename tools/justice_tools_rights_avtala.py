"""The unemployment-benefit dataset of the co.il tools registry (the rights wave, 21.10.2026): the dmei-avtala instrument
on /unemployment-benefits-eligibility/. Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES) through KEY and build().

Every value was read on checked_on from the official text named next to it: the National Insurance Institute's unemployment
pages (conditions, the amount and its calculation, the maximum days, the payment, the reasons for stopping work, repeat
claims, women aged 57 to 67, unpaid leave, the claim and the possible working days of 2026), and the National Insurance Law
[Consolidated Version], 1995, chapter 7 (sections 158-177) and schedule 7, in the Institute's own consolidated text
(btl.gov.il/Laws1). The average wage of section 2 (13,769 from 1.1.2026) lives in rights_btl; the figures here that derive
from it (550.76 = 13,769 / 25; 367.17 = two thirds of it; 201.03 = 1.46% of it; 468.15 = 85% of 550.76; 7,848 = 57% of it)
are the amounts the Institute publishes, and the tests check them against rights_btl. Nothing here is estimated; a figure
the sources do not hold is not in the file (see parts/dmei-avtala/notes.md).
"""
from __future__ import annotations

KEY = "rights_avtala"

BTL ="https://www.btl.gov.il/benefits/Unemployment/Pages/"
MAIN = BTL + "default.aspx"                                   # אבטלה: דף הענף
ZAKAUT = BTL + "zakaut.aspx"                                  # תנאי הזכאות (5 תנאים)
QUALIFY_EXTRA = BTL + "DaysHaxhsharaAvt.aspx"                 # חודשים נוספים שיכולים להיכלל בתקופת האכשרה
ATTEND = BTL + "Avtala_att.aspx"                              # רישום והתייצבות בשירות התעסוקה
DAYS = BTL + "tkufat_zakaut.aspx"                             # כמה זמן אפשר לקבל דמי אבטלה? (טבלת הימים המרביים)
SUBMIT = BTL + "submit.aspx"                                  # איך מגישים תביעה? (מסמכים, 12 חודשים, תביעה חוזרת)
SUM = BTL + "sum.aspx"                                        # סכום הקצבה (טבלאות 2026, התקרות)
CALC = BTL + "hisuv.aspx"                                     # איך מחשבים את דמי האבטלה? (/150, 415, המדרגות)
REASONS = BTL + "nesibothafsakatavoda.aspx"                   # סיבות להפסקת עבודה והשפעתן על דמי האבטלה
PAY = BTL + "pay.aspx"                                        # תשלום הקצבה (ה-12 לחודש, 5 ימים, 90 ימים)
WORKDAYS = BTL + "workdays.aspx"                              # מספר ימי העבודה האפשריים בחודש (2026)
REPEAT = BTL + "MovtalHozer.aspx"                             # מובטל חוזר (180%, 85%, 468.15)
WOMEN = BTL + "zecoyot-nasim.aspx"                            # נשים מובטלות בגילאי 57 עד 67 (300 ימים, 201.03)
LEAVE = BTL + "avthlat.aspx"                                  # עובד בחופשה ללא תשלום (30 יום, ימי חופשה)
AFTER_BIRTH = BTL + "dmeyavtalalenashimachreydeyda.aspx"      # נשים לאחר לידה
INCOMES = BTL + "incomes.aspx"                                # הכנסות בתקופת האבטלה
LAW = "https://www.btl.gov.il/Laws1/00_0001_000007.pdf"       # חוק הביטוח הלאומי, פרק ז': ביטוח אבטלה (סעיפים 158-177)
SCHEDULES = "https://www.btl.gov.il/Laws1/00_0001_000020.pdf"  # חוק הביטוח הלאומי, הלוחות (לוח א1 חלק ב', לוח ז')
CALCULATOR = "https://www.btl.gov.il/Simulators/Pages/AvtalaCalcNew.aspx"        # מחשבון חישוב דמי אבטלה של המוסד
ELIGIBILITY_CALC = "https://www.btl.gov.il/Simulators/Pages/ZacautAvtalaNew.aspx"  # מחשבון בדיקת זכאות של המוסד
CLAIM_FORM = "https://govforms.gov.il/mw/forms/T1500@btl.gov.il"                 # תביעה לדמי אבטלה (1500), מקוון
ONE_CLICK = "https://www.gov.il/he/multiservice/unemployment-payment-and-job-seeking"  # רישום ותביעה בטופס אחד
TAASUKA = "https://www.taasuka.gov.il/"                                          # שירות התעסוקה, רישום מקוון
TAASUKA_GUIDE = "https://www.taasuka.gov.il/applicants/dmeiavtala/"              # שירות התעסוקה: דמי אבטלה


def build(checked_on: str) -> dict:
    """Unemployment benefit for 2026: who is eligible, the daily wage, the rates, the ceilings, the days, the waiting days,
    repeat claims and the claim, each with the section of the law or the Institute's page it was read from."""
    return {
        "name_he": "דמי אבטלה לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי, ענף אבטלה",
        "source_name": "המוסד לביטוח לאומי: דמי אבטלה (תנאי זכאות, סכום הקצבה, תקופת הזכאות, תשלום); חוק הביטוח הלאומי, פרק ז'",
        "source_url": MAIN,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, פרק ז': ביטוח אבטלה",
        "law_url": LAW,
        "schedules_url": SCHEDULES,
        "pages": {
            "main": MAIN, "conditions": ZAKAUT, "qualify_extra": QUALIFY_EXTRA, "attend": ATTEND, "days": DAYS,
            "submit": SUBMIT, "sum": SUM, "calc": CALC, "reasons": REASONS, "pay": PAY, "workdays": WORKDAYS,
            "repeat": REPEAT, "women": WOMEN, "leave": LEAVE, "after_birth": AFTER_BIRTH, "incomes": INCOMES,
            "calculator": CALCULATOR, "eligibility_calculator": ELIGIBILITY_CALC,
        },
        # תנאי שני: גיל (זכאות.aspx: "מלאו לך 20 שנה, ועדיין לא הגעת לגיל 67"); סעיף 160(א); לוח א1 חלק ב': 67 למי שנולד ממאי 1942.
        "age": {
            "min": 20, "max": 67, "section": "סעיף 160(א)", "max_section": "לוח א1, חלק ב'", "url": ZAKAUT,
            "under20_he": "מתחת לגיל 20 (מגיל 18): רק מפרנס יחיד של משפחתו או מי שיש לו ילד שעיקר פרנסתו עליו, ובתנאים (סעיף 160(ג))",
            "over_max_he": "מגיל 67 אין דמי אבטלה; המוסד מפעיל מענק לבני 67 ומעלה, בבקשה נפרדת",
            "over_max_url": "https://forms.btl.gov.il/Form/Fill/Avtala67",
        },
        # תנאי חמישי: תקופת אכשרה; סעיף 161(א): 12 חודשים קלנדריים שבעדם שולמו דמי ביטוח אבטלה, בעד יום אחד או יותר בחודש,
        # בתוך 18 החודשים שבתכוף לתאריך הקובע. אין עוד כלל נפרד לשכיר יום (הנוסח הקודם, 300 ימים מתוך 540, הוחלף בתיקון 141).
        "qualify": {
            "months": 12, "window_months": 18, "section": "סעיף 161(א)", "url": ZAKAUT,
            "partial_he": "עבודה בחלק מהחודש, אפילו יום אחד, נחשבת לחודש עבודה מלא",
            "extra_he": "נכללים גם: עד 6 חודשי שירות סדיר, מילואים, ימי מחלה עם דמי מחלה, דמי לידה ושמירת היריון, דמי פגיעה, ימי אבל, תשלום במקום הודעה מוקדמת, ושני החודשים הראשונים של חל\"ת שהמעסיק שילם עליהם דמי ביטוח (סעיף 161(ג) ודף המוסד)",
            "extra_url": QUALIFY_EXTRA,
            "late_months": 3,
            "late_he": "מי שלא נרשם בסמוך להפסקת העבודה לא נפגע אם לא עברו 3 חודשים מיום הפסקת העבודה עד ה-1 בחודש שבו התייצב לראשונה, ובתנאי שהשלים את תקופת האכשרה בחודש שבו הפסיק לעבוד",
            "late_url": ATTEND,
        },
        # סעיף 170(א): ההכנסה בששת החודשים הקלנדריים האחרונים שבעדם שולמו דמי ביטוח אבטלה לפני התאריך הקובע; hisuv.aspx: מחולקת ב-150.
        "base": {
            "months": 6, "divisor": 150, "section": "סעיף 170(א)", "url": CALC,
            "he": "ההכנסה (החייבת בדמי ביטוח) ב-6 החודשים שקדמו לחודש שבו נרשמתם לראשונה בשירות התעסוקה, מחולקת ב-150",
            "favorable_section": "סעיף 170(ג)",
            "skip_he": "חודשים שבהם השכר הופחת שלא באשמתכם או בגלל מחלה, או שבהם קיבלתם דמי פגיעה, אפשר להחליף בחודשים הקודמים הסמוכים, עד 18 חודשים לפני ההתייצבות הראשונה; החישוב לפי הנוח לכם (סעיפים 170(ב1) ו-170(ג), ודף המוסד)",
            "skip_url": SUM,
            "floor_section": "סעיף 170(ו)",
            "floor_he": "השכר היומי הממוצע לא יפחת משכר המינימום היומי, או משכר מינימום חלקי למי שעבד במשרה חלקית",
        },
        # לוח ז' לחוק (סעיף 167(א)): "הסכום היומי הבסיסי" = הסכום הבסיסי מחולק ב-25; hisuv.aspx: 415 ש"ח החל ב-1.1.2026.
        # המדרגות: עד מחצית / עד שלושה רבעים / עד מלוא הסכום היומי הבסיסי / עד 5 פעמים הסכום היומי הבסיסי.
        "rates": {
            "basic_daily": 415, "basic_from": "2026-01-01", "young_under": 28,
            "section": "סעיף 167(א); לוח ז'", "url": CALC, "schedule_url": SCHEDULES,
            "tiers": [
                {"upto": 0.5, "pct": 80, "pct_young": 60, "he": "עד מחצית הסכום היומי הבסיסי"},
                {"upto": 0.75, "pct": 50, "pct_young": 40, "he": "ממחצית ועד שלושה רבעים ממנו"},
                {"upto": 1, "pct": 45, "pct_young": 35, "he": "משלושה רבעים ועד מלואו"},
                {"upto": 5, "pct": 30, "pct_young": 25, "he": "ממלואו ועד 5 פעמים הסכום היומי הבסיסי"},
            ],
        },
        # סעיף 167(ב): השכר היומי הממוצע במשק = השכר הממוצע מחולק ב-25; התקופה הראשונה = 125 ימי התשלום הראשונים.
        # sum.aspx ו-hisuv.aspx: 550.76 ש"ח ב-125 ימי התשלום הראשונים, 367.17 ש"ח מיום התשלום ה-126 (החל ב-1.1.2026).
        "cap": {
            "first_days": 125, "first": 550.76, "after": 367.17, "wage_divisor": 25,
            "section": "סעיף 167(ב)", "url": SUM,
            "he": "השכר היומי הממוצע במשק (השכר הממוצע לפי סעיף 2 מחולק ב-25) ב-125 ימי התשלום הראשונים, ושני שלישים ממנו מיום התשלום ה-126",
        },
        # sum.aspx: "דמי אבטלה לחודש (לפי 25 ימים)"; workdays.aspx: כל ימי השבוע חוץ משבת, ימי חג וערבי חג משולמים כשלא חלים בשבת.
        "month": {
            "table_days": 25, "table_url": SUM,
            "paid_weekdays_he": "ימים ראשון עד שישי; לא משולם על שבת, ומשולם על חג וערב חג שלא חלים בשבת",
            "url": WORKDAYS,
            "workdays_2026": {
                "2026-01": 26, "2026-02": 24, "2026-03": 27, "2026-04": 26, "2026-05": 26, "2026-06": 26,
                "2026-07": 27, "2026-08": 26, "2026-09": 26, "2026-10": 26, "2026-11": 26, "2026-12": 27,
            },
        },
        # סעיף 171(א): בחודש פלוני ובאחד עשר החודשים שקדמו לו; tkufat_zakaut.aspx: הטבלה לפי גיל ומספר התלויים.
        "days": {
            "section": "סעיף 171(א)", "url": DAYS, "dependents_many": 3, "window_months": 12,
            "window_he": "את הימים מנצלים בתוך 12 החודשים שמתחילים ב-1 בחודש שבו התייצבתם לראשונה",
            "bands": [
                {"from": 20, "to": 25, "few": 50, "many": 138, "few_section": "סעיף 171(א)(2ב)", "many_section": "סעיף 171(א)(1א)"},
                {"from": 25, "to": 28, "few": 67, "many": 138, "few_section": "סעיף 171(א)(2א)", "many_section": "סעיף 171(א)(1א)"},
                {"from": 28, "to": 35, "few": 100, "many": 138, "few_section": "סעיף 171(א)(3)", "many_section": "סעיף 171(א)(1א)"},
                {"from": 35, "to": 45, "few": 138, "many": 175, "few_section": "סעיף 171(א)(1א)", "many_section": "סעיף 171(א)(1)"},
                {"from": 45, "to": 67, "few": 175, "many": 175, "few_section": "סעיף 171(א)(1)", "many_section": "סעיף 171(א)(1)"},
            ],
            # tkufat_zakaut.aspx: מי נחשב תלוי (סעיף 247); 57% מהשכר הממוצע = 7,848 ש"ח החל ב-1.1.2026.
            "dependent_income_max": 7848,
            "dependents_he": "ילד עד גיל 18 (ובתנאים עד 24: סיום לימודים תיכוניים, התנדבות, שירות סדיר או לאומי); בת זוג שנשואה שנה לפחות או שילדה ילד, בת 45 ומעלה או שיש עמה ילד, והכנסתה עד 7,848 ש\"ח לחודש; בן זוג בן 70, או בן 50 ומעלה שהכנסתו עד 7,848 ש\"ח",
        },
        # zecoyot-nasim.aspx; סעיפים 171(א)(1ב), 171(א)(1ג) ו-167(ג): 300 ימים ב-18 חודשים לנשים שנולדו מ-1.1.1960, מגיל 57.
        "women": {
            "born_from": "1960-01-01", "from_age": 57, "upper_age": 60, "days": 300, "window_months": 18,
            "cap_from_day": 176, "cap": 201.03, "cap_pct_of_avg": 1.46,
            "section_57": "סעיף 171(א)(1ג)", "section_60": "סעיף 171(א)(1ב)", "cap_section": "סעיף 167(ג)", "url": WOMEN,
            "he": "אישה שנולדה מ-1.1.1960 ואילך, מגיל 57: עד 300 ימים בתוך 18 חודשים; מגיל 57 עד 60, מיום התשלום ה-176 לא יותר מ-201.03 ש\"ח ליום",
        },
        # סעיף 172; pay.aspx: 5 ימי האבטלה הראשונים בכל 4 חודשים רצופים, ואינם יורדים ממכסת הימים.
        "waiting": {
            "days": 5, "every_months": 4, "section": "סעיף 172", "url": PAY,
            "he": "לא משולמים 5 ימי האבטלה הראשונים בכל תקופה של 4 חודשים רצופים שמתחילה בתאריך הקובע (ה-1 בחודש ההתייצבות הראשונה); הם לא יורדים ממכסת הימים",
        },
        # סעיף 166(ב); nesibothafsakatavoda.aspx: התפטרות בלי הצדקה, 90 ימים מיום הפסקת העבודה; והסיבות המוצדקות שהמוסד מפרט.
        "resign": {
            "wait_days": 90, "section": "סעיף 166(ב)", "url": REASONS,
            "reasons_he": [
                "הרעה מוחשית בתנאי העבודה, או נסיבות שלא אפשרו להמשיך לעבוד",
                "המצב הבריאותי שלכם או של בן משפחה קרוב",
                "מעבר דירה או שינוי מקום העבודה: מרחק של יותר מ-60 ק\"מ, או 40 ק\"מ לאם לילד מתחת לגיל 7",
                "הטרדה מינית במקום העבודה",
                "בעלי תעודת מקצוע שעבדו בעבודה שאינה במקצוע ועוברים לעבודה במקצוע",
                "שהייה במקלט לנפגעי אלימות במשפחה",
                "התפטרות מעבודה חדשה של עד 6 חודשים, כשלא מימשתם את הזכאות הקודמת",
                "התפטרות מעבודה שנייה, עד 3 חודשים אחרי התפטרות מוצדקת מהראשונה",
            ],
            "docs_he": "מצרפים לתביעה מסמכים שמראים את הסיבה",
        },
        # nesibothafsakatavoda.aspx ו-avthlat.aspx: חל"ת ביוזמת המעסיק, 30 יום לפחות; ביוזמת העובד (מ-2.7.21) אין זכאות.
        "leave": {
            "min_days": 30, "url": LEAVE,
            "own_he": "מי שיצא לחל\"ת מיוזמתו, גם כשהחל\"ת מוצדק, לא זכאי לדמי אבטלה (מ-2.7.2021)",
            "vacation_he": "כשנותרו ימי חופשה אצל המעסיק, דמי האבטלה מתחילים רק בסיומם; לדוגמה: חל\"ת של 50 יום ו-20 ימי חופשה, זכאות מהיום ה-21",
        },
        # סעיף 166(ד) וסעיף 171(א1); pay.aspx: סירוב לעבודה מתאימה או להכשרה.
        "refuse": {
            "wait_days": 90, "cut_days": 30, "section": "סעיפים 166(ד) ו-171(א1)", "url": PAY,
            "he": "מי שמסרב לעבודה מתאימה או להכשרה: 90 ימים בלי דמי אבטלה מיום הסירוב, ו-30 ימים פחות במכסה, בכל סירוב",
        },
        # סעיף 171א; MovtalHozer.aspx: מתחת לגיל 40, תביעה נוספת בתוך 4 שנים אחרי מיצוי מלא: 80% מהימים, ותקרה של 85%.
        "repeat": {
            "under_age": 40, "period_months": 48, "days_pct": 80, "cap_pct": 85, "cap_first": 468.15,
            "section": "סעיף 171א", "url": REPEAT,
            "he": "מתחת לגיל 40: מי שקיבל דמי אבטלה על כל הימים המרביים, ותוך 4 שנים מתחילת הזכאות הקודמת תובע שוב, מקבל 80% מהימים, ובתקופה הנוספת עד 468.15 ש\"ח ליום (85% מהתקרה) ב-125 הימים הראשונים",
            "over_he": "מגיל 40: אם קיבלתם דמי אבטלה ב-11 החודשים שלפני התביעה, בכל חודש נבדק כמה ימים שולמו באותו חודש וב-11 שלפניו, גם בתביעה הקודמת, ולא משולם מעבר למכסה",
            "renew_he": "תביעה חוזרת מגישים רק אחרי 12 חודשים מתחילת הזכאות הקודמת; לפני כן ממשיכים באותה תביעה כל עוד נשארו ימים",
        },
        # pay.aspx: ב-12 לחודש או בסמוך לו, עבור ימי ההתייצבות בחודש הקודם.
        "pay": {
            "day_of_month": 12, "url": PAY,
            "he": "דמי אבטלה משולמים ב-12 לחודש או בסמוך לו, עבור ימי ההתייצבות בחודש הקודם; בחגים המועד עשוי לזוז",
        },
        # sum.aspx ו-hisuv.aspx: ניכויים.
        "deductions": {
            "ni_min": 48, "url": CALC,
            "he": "מדמי האבטלה מנוכים מס הכנסה במקור, דמי ביטוח לאומי לפי שיעור המינימום (48 ש\"ח) ודמי ביטוח בריאות לפי הסכום",
        },
        # Avtala_att.aspx ו-zakaut.aspx: רישום מקוון בשירות התעסוקה והתייצבות בלשכה בתוך 14 יום.
        "register": {
            "office_days": 14, "url": ZAKAUT, "taasuka_url": TAASUKA, "taasuka_guide_url": TAASUKA_GUIDE, "one_click_url": ONE_CLICK,
            "he": "נרשמים באתר שירות התעסוקה, ומתייצבים בלשכה הקרובה למקום המגורים בתוך 14 יום מהרישום באתר",
            "start_he": "דמי האבטלה מחושבים מיום הרישום הראשון בשירות התעסוקה, ולכן נרשמים מיד עם הפסקת העבודה, גם אחרי התפטרות",
        },
        # submit.aspx: תביעה (טופס 1500) בתוך 12 חודשים מההתייצבות הראשונה; טופס 100 מהמעסיק; המסמכים.
        "claim": {
            "form": "1500", "form_url": CLAIM_FORM, "one_click_url": ONE_CLICK, "deadline_months": 12, "url": SUBMIT,
            "deadline_he": "את התביעה והמסמכים מגישים בתוך 12 חודשים מהיום שבו התייצבתם לראשונה; תביעה מאוחרת משולמת רק על 12 החודשים שלפני ההגשה",
            "employer_form": "100",
            "employer_he": "המעסיק משדר למוסד טופס 100 עם נתוני השכר; אם לא שודר, מצרפים אישור מעסיק על התקופה והשכר או תלושים",
            "docs_he": [
                "תלושי השכר של 6 חודשי העבודה האחרונים, כולל החודש האחרון (וטופס 100 מהמעסיק, או תלושים של 12 מתוך 18 החודשים)",
                "אישור מהמעסיק על סיבת הפסקת העבודה ותאריכה, בחתימה ובחותמת",
                "בהתפטרות מוצדקת: המסמכים שמראים את הסיבה",
                "בחל\"ת של 30 יום לפחות: אישור מעסיק על תקופת החל\"ת ועל יתרת ימי החופשה",
                "מי שהשתחרר מצה\"ל בשנה וחצי האחרונות: תעודת שחרור",
                "מקבלי פנסיה: תלוש הפנסיה של החודש הראשון; מי שעובד בתקופת האבטלה: תלוש לכל חודש",
                "אישור על הנחה או פטור ממס הכנסה, אם יש",
            ],
        },
        "calculator_url": CALCULATOR,
        "eligibility_calculator_url": ELIGIBILITY_CALC,
    }
