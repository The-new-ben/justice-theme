"""The children dataset of the co.il tools registry (rights wave 2B, 21.10.2026): the kitzbat-yeladim instrument on
/kitzbat-yeladim/ (the child allowance, the savings plan for every child, the supplement and the study grant). Loaded by
tools/justice_tools_rights.py (RIGHTS_MODULES) through KEY and build().

Every value was read on checked_on from the official text named next to it: the National Insurance Institute's children
pages (the allowance: conditions, the period, the amount, who receives it, the claim, a stay abroad, adoption; the savings
plan for every child: the amount, opening a plan, doubling it, the change of fund, the withdrawal; the study grant: who,
how much, the claim), the Institute's basic-amount table, and the National Insurance Law [Consolidated Version], 1995,
chapter 4 (children insurance, sections 65-74ו) and section 1 (the definition of the basic amount) in the Institute's own
consolidated text (btl.gov.il/Laws1).

The per-child amounts of 2026 (173 for the first and the fifth and later child, 219 for the second to the fourth) and the
income-support point (162) are basic amount 2 and live in rights_btl; they are NOT repeated here. The Institute's rates page
read on checked_on confirms them ("ראשון 173, שני 219, שלישי 219, רביעי 219, חמישי ואילך 173, החל מ-01.01.2026"). The
figures here that derive from a basic amount (113 = 70% of 162; 1,204 = 11.6% of basic amount 3, 10,382) are the amounts
the Institute publishes, and the tests check them against rights_btl. Nothing here is estimated; a figure the sources do not
hold is not in the file (see parts/kitzbat-yeladim/notes.md).
"""
from __future__ import annotations

KEY = "rights_yeladim"

BTL = "https://www.btl.gov.il/benefits/children/"
MAIN = BTL + "Pages/default.aspx"                                                                          # ילדים: דף הענף
RATES = BTL + "Pages/%d7%a9%d7%99%d7%a2%d7%95%d7%a8%d7%99%20%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx"            # סכום קצבת הילדים
CONDITIONS = BTL + "Pages/%d7%aa%d7%a0%d7%90%d7%99%20%d7%96%d7%9b%d7%90%d7%95%d7%aa.aspx"                     # תנאי הזכאות
PERIOD = BTL + "Pages/%d7%aa%d7%a7%d7%95%d7%a4%d7%aa%20%d7%94%d7%96%d7%9b%d7%90%d7%95%d7%aa.aspx"             # תקופת הזכאות
WHOM = BTL + "Pages/%d7%9c%d7%9e%d7%99%20%d7%9e%d7%a9%d7%95%d7%9c%d7%9e%d7%aa%20%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx"  # למי משולמת הקצבה
CLAIM = BTL + "Pages/%d7%90%d7%95%d7%a4%d7%9f%20%d7%94%d7%92%d7%a9%d7%aa%20%d7%94%d7%aa%d7%91%d7%99%d7%a2%d7%94.aspx"  # איך להגיש תביעה
ABROAD = BTL + "Pages/%d7%a9%d7%94%d7%95%d7%aa%20%d7%91%d7%97%d7%95%d7%a5%20%d7%9c%d7%90%d7%a8%d7%a5.aspx"     # שהות בחוץ לארץ
ADOPTION = BTL + "Pages/adoption.aspx"                                                                     # קצבת ילדים להורים מאמצים
APPEAL = BTL + "Pages/erur.aspx"                                                                           # ערעור על החלטות המוסד
CALCULATOR = "https://www.btl.gov.il/Simulators/childrenCalc/Pages/default.aspx"                          # מחשבוני המוסד: ילדים
SAVE = BTL + "HisahoLayeled/Pages/"
SAVINGS = SAVE + "default.aspx"                                                                            # תכנית חיסכון לכל ילד
SAVINGS_SUM = SAVE + "sum.aspx"                                                                            # סכום החיסכון והמענקים (מ-1.1.2026)
SAVINGS_NEW = SAVE + "nolad.aspx"                                                                          # פתיחת תכנית לילד שנולד, ברירת המחדל
SAVINGS_DOUBLE = SAVE + "HisahonKupot.aspx"                                                                # הכפלת סכום החיסכון
SAVINGS_CHANGE = SAVE + "mavar.aspx"                                                                       # שינוי הגוף החוסך והמסלול
SAVINGS_WITHDRAW = SAVE + "MeshihaHisahon.aspx"                                                            # משיכה של כספי החיסכון
SAVINGS_PERSONAL = "https://b2b.btl.gov.il/BTL.ILG.Payments/TochnitChisachonYeledListInfo.aspx"           # מידע אישי, בחירה והכפלה
STUDY = BTL + "%d7%9e%d7%a2%d7%a0%d7%a7%20%d7%9c%d7%99%d7%9e%d7%95%d7%93%d7%99%d7%9d/Pages/"
STUDY_MAIN = STUDY + "default.aspx"                                                                        # מענק לימודים
STUDY_AMOUNT = STUDY + "%d7%a9%d7%99%d7%a2%d7%95%d7%a8%d7%99%20%d7%94%d7%9e%d7%a2%d7%a0%d7%a7.aspx"          # סכום המענק (2026-2027 ו-2025-2026)
STUDY_CONDITIONS = STUDY + "%d7%aa%d7%a0%d7%90%d7%99%20%d7%96%d7%9b%d7%90%d7%95%d7%aa.aspx"                  # מי זכאי למענק לימודים
STUDY_CLAIM = STUDY + "submit.aspx"                                                                        # אופן הגשת התביעה למענק
FORMS = ("https://www.btl.gov.il/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/"
         "forms/children_forms/Pages/default.aspx")                                                        # טפסים: ילדים (5015, 5020, 5025, 5026)
SPLIT_FORM = "https://govforms.gov.il/mw/forms/T5020@btl.gov.il"                                           # בקשה לפיצול תיק (5020), מקוון
BASIC = ("https://www.btl.gov.il/Mediniyut/GeneralData/Pages/"
         "%d7%94%d7%a1%d7%9b%d7%95%d7%9d%20%d7%94%d7%91%d7%a1%d7%99%d7%a1%d7%99%20%d7%9c%d7%97%d7%99%d7%a9%d7%95%d7%91%20"
         "%d7%a7%d7%a6%d7%91%d7%90%d7%95%d7%aa.aspx")                                                      # הסכום הבסיסי לחישוב קצבאות (טבלה לפי שנים)
INCOME_SUPPORT = "https://www.btl.gov.il/benefits/Income_support/Pages/default.aspx"                      # הבטחת הכנסה
ALIMONY = "https://www.btl.gov.il/benefits/Alimony/Pages/default.aspx"                                    # מזונות
OLD_AGE_SUPPLEMENT = "https://www.btl.gov.il/benefits/old_age/hashHachZ/Pages/default.aspx"               # אזרח ותיק עם השלמת הכנסה
SURVIVORS_SUPPLEMENT = "https://www.btl.gov.il/benefits/Survivors_%20Insurance/t.hvtachat.hachnasa/Pages/default.aspx"  # שאירים עם השלמת הכנסה
LAW = "https://www.btl.gov.il/Laws1/00_0001_000004.pdf"                                                   # חוק הביטוח הלאומי, פרק ד': ביטוח ילדים (סעיפים 65-74ו)
LAW_GENERAL = "https://www.btl.gov.il/Laws1/00_0001_000001.pdf"                                           # חוק הביטוח הלאומי, פרק א': סעיף 1, הגדרת "הסכום הבסיסי"


def build(checked_on: str) -> dict:
    """The child allowance and the savings plan for 2026: the amount by the child's place in the count, the start and the
    end of the allowance, who receives it, the supplement for the third and the fourth child, the study grant, the monthly
    deposit and the grants of the savings plan, the default fund and the withdrawal ages, the claim, and the published
    values of earlier years; each with the section or the page it was read from."""
    return {
        "name_he": "קצבת ילדים ותכנית חיסכון לכל ילד לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי, ענף ילדים",
        "source_name": "המוסד לביטוח לאומי: קצבת ילדים (תנאי זכאות, תקופה, סכום, למי משולמת, תביעה), תכנית חיסכון לכל ילד, מענק לימודים; חוק הביטוח הלאומי, פרק ד'",
        "source_url": RATES,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, פרק ד': ביטוח ילדים",
        "law_url": LAW,
        "law_general_url": LAW_GENERAL,
        "pages": {
            "main": MAIN, "rates": RATES, "conditions": CONDITIONS, "period": PERIOD, "whom": WHOM, "claim": CLAIM,
            "abroad": ABROAD, "adoption": ADOPTION, "appeal": APPEAL, "calculator": CALCULATOR, "forms": FORMS,
            "savings": SAVINGS, "savings_sum": SAVINGS_SUM, "savings_new": SAVINGS_NEW, "savings_double": SAVINGS_DOUBLE,
            "savings_change": SAVINGS_CHANGE, "savings_withdraw": SAVINGS_WITHDRAW, "savings_personal": SAVINGS_PERSONAL,
            "study": STUDY_MAIN, "study_amount": STUDY_AMOUNT, "study_conditions": STUDY_CONDITIONS, "study_claim": STUDY_CLAIM,
            "basic": BASIC,
        },
        # סעיף 68(א): הקצבה לחודש בעד כל ילד שבמניין ילדיו של ההורה שווה לסכום הבסיסי הקבוע לגביו; סעיף 1, הגדרת "הסכום
        # הבסיסי", פסקה (2): (א) הילד הראשון והחמישי ואילך במניין, (ב) השני, השלישי והרביעי. הסכומים עצמם ב-rights_btl.
        # סעיף 65: "ילד" - ילד שנמצא בישראל ולא מלאו לו 18. סעיף 72(א): נוצרה הזכאות עד ה-15 בחודש - מה-1 באותו חודש,
        # אחרי ה-15 - מה-1 בחודש שאחריו; התשלום מסתיים ביום האחרון של החודש שבו נפסקה הזכאות (תקופת הזכאות, btl: "עד סוף
        # החודש בו מלאו לילד 18 שנה"). סכום הקצבה (btl): לפי מספר הילדים, תאריכי הלידה, ומיקום הילד במשפחה.
        "allowance": {
            "high_from": 2, "high_to": 4,
            "section": "סעיף 68(א)", "def_section": "סעיף 1, הגדרת \"הסכום הבסיסי\", פסקה (2)",
            "url": RATES, "order_url": RATES,
            "order_he": "הסכום לכל ילד לפי המקום שלו במניין הילדים של ההורה: הילד הראשון והחמישי ואילך בסכום אחד, השני עד הרביעי בסכום גבוה יותר",
            "count_he": "במניין נכנסים רק ילדים שעוד לא מלאו להם 18 ושנמצאים בישראל; כשהבכור יוצא מהמניין, כל אחד מהאחרים עולה מקום אחד",
            "end_age": 18, "child_section": "סעיף 65",
            "start_cutoff_day": 15, "start_section": "סעיף 72(א)", "period_url": PERIOD,
            "start_he": "ילד שנולד (עלה לארץ או אומץ) עד ה-15 בחודש: הקצבה מה-1 באותו חודש; מה-16 בחודש: מה-1 בחודש שאחריו",
            "end_he": "הקצבה משולמת עד סוף החודש שבו מלאו לילד 18",
            "alive_days": 7, "alive_section": "סעיף 72(ב)",
            "alive_he": "הקצבה משולמת בעד ילד שחי 7 ימים לפחות או שיצא מבית החולים",
            "death_months": 3, "death_section": "סעיף 72(ג)",
            "death_he": "נפטר ילד שבעדו שולמה קצבה: התשלום נמשך 3 חודשים מתום החודש שבו נפטר",
            "pay_day": 20, "pay_url": MAIN,
            "pay_he": "הקצבה משולמת ב-20 בכל חודש, בלי קשר להכנסות המשפחה, וברוב המקרים אוטומטית כחודש אחרי הלידה",
            "abroad_months": 3, "abroad_section": "סעיף 65(ב)", "abroad_url": ABROAD,
            "abroad_he": "ילד ששוהה בחוץ לארץ: הקצבה נמשכת 3 חודשים, ומהחודש הרביעי רק בשליחות, שבתון, טיפול רפואי שאין בארץ או לפי אמנה",
            "tax_section": "סעיף 73",
            "tax_he": "קצבת הילדים אינה נחשבת הכנסה לעניין מס הכנסה ותשלומי חובה",
            "debt_he": "הביטוח הלאומי רשאי לנכות מקצבת הילדים חוב של אחד ההורים לביטוח הלאומי",
            "update_he": "הסכומים מתעדכנים ב-1 בינואר של כל שנה לפי עליית המדד; ב-1.1.2025 לא עודכנו, ונשארו כפי שהיו ב-1.1.2024",
            "update_section": "סעיף 1, הגדרת \"הסכום הבסיסי\", העדכון בפסקה (3)",
        },
        # הסכום הבסיסי לחישוב קצבאות (btl), השורות של השנים הקודמות: סכום בסיסי 2 לילד הראשון והחמישי ואילך, לשני עד הרביעי,
        # ולעניין הבטחת הכנסה, וסכום בסיסי 3. שנת 2026 נמצאת ב-rights_btl.
        "history": {
            "url": BASIC,
            "rows": [
                {"from": "2025-01-01", "first_fifth": 169, "second_to_fourth": 214, "income_support": 158, "b3": 10139},
                {"from": "2024-01-01", "first_fifth": 169, "second_to_fourth": 214, "income_support": 158, "b3": 9806},
                {"from": "2023-01-01", "first_fifth": 164, "second_to_fourth": 207, "income_support": 153, "b3": 9493},
                {"from": "2022-01-01", "first_fifth": 156, "second_to_fourth": 197, "income_support": 145, "b3": 9015},
            ],
            "he": "סכום בסיסי 2 לפי שנים, מטבלת הסכום הבסיסי של הביטוח הלאומי",
        },
        # סעיף 68(ג) וסעיף 1, הגדרת "הסכום הבסיסי", פסקה (2)(ג); סכום קצבת הילדים (btl): "תוספת להורה המקבל קצבת קיום", 113
        # ש"ח לכל ילד, לילד השלישי והרביעי, להורה שמקבל הבטחת הכנסה, מזונות, אזרח ותיק עם השלמת הכנסה או שאירים עם השלמת הכנסה.
        "supplement": {
            "amount": 113, "pct_of_income_support": 70, "positions": [3, 4], "min_children": 3,
            "section": "סעיף 68(ג)", "url": RATES,
            "benefits": ["hb", "mz", "hh"],
            "he": "תוספת לקצבת הילדים להורה שמקבל הבטחת הכנסה, מזונות מהביטוח הלאומי, או קצבת אזרח ותיק או שאירים עם השלמת הכנסה: 113 ש\"ח לילד השלישי ולילד הרביעי במשפחה",
            "urls": {"hb": INCOME_SUPPORT, "mz": ALIMONY, "hh": OLD_AGE_SUPPLEMENT, "hh_survivors": SURVIVORS_SUPPLEMENT},
        },
        # סעיף 74(ב)(1), (ב)(2), (ב1), (ב2); מענק לימודים, סכום המענק, מי זכאי ואופן הגשת התביעה (btl).
        "study": {
            "amount": 1204, "pct_of_basic": 11.6, "basic_key": "b3",
            "school_year_he": "התשפ\"ז (2026-2027)", "born_from": "2009-01-01", "born_to": "2020-12-31",
            "pay_date": "2026-08-11", "check_months": ["2026-07", "2026-08"],
            "min_age": 6, "max_age": 18,
            "prev": {"amount": 1176, "school_year_he": "התשפ\"ו (2025-2026)", "born_from": "2008-01-01", "born_to": "2019-12-31", "paid_he": "אוגוסט 2025", "b3": 10139},
            "min_children": 4, "benefits4": ["hb", "mz", "nc", "hh", "old"],
            "section": "סעיף 74(ב)", "amount_section": "סעיף 74(ב)(2)", "month_section": "סעיף 74(ב1)", "four_section": "סעיף 74(ב2)",
            "url": STUDY_MAIN, "amount_url": STUDY_AMOUNT, "conditions_url": STUDY_CONDITIONS, "claim_url": STUDY_CLAIM,
            "claim_months": 18, "form": "5015", "split_form": "5020", "split_url": SPLIT_FORM,
            "who_he": "הורה עצמאי (משפחה חד-הורית), או משפחה עם 4 ילדים ויותר עד גיל 18 שבה הורה מקבל ביולי או באוגוסט הבטחת הכנסה, מזונות, נכות כללית, אזרח ותיק או שאירים",
            "auto_he": "רוב הזכאים מקבלים את המענק אוטומטית, לחשבון שאליו משולמת קצבת הילדים, ב-11 באוגוסט 2026",
            "claim_he": "הורה גרוש (בפעם הראשונה), הורה שחי בנפרד, עגונה, אישה במקלט, רווק או אלמן (בפעם הראשונה) ועולה חדש מגישים תביעה בטופס 5015; גרוש או חי בנפרד גם בקשה לפיצול תיק בטופס 5020",
            "late_he": "את התביעה מגישים בתוך 18 חודשים; אחרי זה משולם רק בעד 18 החודשים שלפני ההגשה",
            "grade_he": "ילד שלא נולד בתאריכים האלה ולומד בכיתה א' או י\"ב: ייתכן שזכאי, עם אישור לימודים",
            "payee_he": "המענק משולם להורה שמקבל את קצבת הילדים, ובגירושים להורה שהילדים אצלו, אלא אם ההורים הסכימו אחרת או שנקבע בפסק דין",
            "next_he": "את סכום המענק לשנת הלימודים הבאה המוסד מפרסם לפני אוגוסט; הסכום של השנה האחרונה הוא 1,204 ש\"ח",
        },
        # סעיפים 74ב-74ה; סכום החיסכון, פתיחת תכנית, הכפלה, שינוי ומשיכה (btl): 58 ש"ח בחודש מ-1.1.2026, ב-20 לחודש, עד גיל 18;
        # הורה יכול להוסיף 58 ש"ח מהקצבה (116 בסך הכול); מענקים: נולד עד 31.12.2016 - 582 בגיל 18; נולד מ-1.1.2017 - 291 בגיל 3
        # ו-291 בבר או בת מצווה (13 לבן, 12 לבת); לכולם 582 בגיל 21 אם לא נמשך כסף קודם לכן.
        "savings": {
            "monthly": 58, "parent_add": 58, "from": "2026-01-01", "pay_day": 20,
            "base_law": 50, "base_section": "סעיף 74ב(א)(1)", "add_section": "סעיף 74ב(א)(2)",
            "grant_18": 582, "grant_21": 582, "grant_3": 291, "grant_mitzvah": 291,
            "grant_3_age": 3, "mitzvah_boy": 13, "mitzvah_girl": 12, "grants_section": "סעיף 74ב(א)(1)(א)-(ב)",
            "new_from": "2017-01-01", "deposits_from": "2015-05",
            "withdraw_age": 18, "free_age": 21, "withdraw_section": "סעיף 74ג(ב)", "update_section": "סעיף 74ג(ג)",
            "choose_months": 6, "default_section": "סעיף 74ב(ד)(1א)", "report_he": "קופת הגמל או הבנק שולחים דוח על סכום החיסכון עד 1 במרץ בכל שנה",
            "report_section": "סעיף 74ב(ז)", "fees_age": 21,
            "url": SAVINGS_SUM, "new_url": SAVINGS_NEW, "double_url": SAVINGS_DOUBLE, "change_url": SAVINGS_CHANGE,
            "withdraw_url": SAVINGS_WITHDRAW, "personal_url": SAVINGS_PERSONAL, "main_url": SAVINGS,
            "he": "לכל ילד שבעדו משולמת קצבת ילדים, הביטוח הלאומי מפקיד 58 ש\"ח בחודש עד גיל 18, ב-20 לחודש, בחיסכון על שם הילד בקופת גמל או בבנק",
            "add_he": "ההורים יכולים להוסיף לחיסכון של כל ילד עוד 58 ש\"ח בחודש מקצבת הילדים (116 בסך הכול), מהחודש שאחרי הבחירה, ולבטל בכל שלב",
            "default_he": "בוחרים קופת גמל או בנק ומסלול בתוך 6 חודשים מהלידה; בלי בחירה: הקופה שנבחרה לילד הקודם, ואם לילד הקודם נבחר בנק או שזה הילד הראשון - קופת גמל להשקעה במסלול סיכון מוגבר",
            "withdraw_he": "את הכסף אפשר למשוך רק מתום החודש שבו מלאו לילד 18, וכל עוד לא מלאו לו 21 צריך אישור של הורה; מגיל 21 בכל עת ובלי אישור",
            "grant_old_he": "ילד שנולד עד 31.12.2016: מענק של 582 ש\"ח כשמלאו לו 18",
            "grant_new_he": "ילד שנולד מ-1.1.2017: מענק של 291 ש\"ח בגיל 3, ועוד 291 ש\"ח בבר או בת מצווה (13 לבן, 12 לבת), ובלי מענק בגיל 18",
            "grant_21_he": "ילד שלא משך את הכסף עד גיל 21: עוד 582 ש\"ח בגיל 21",
            "return_he": "הרווחים תלויים בקופה או בבנק ובמסלול שנבחרו; כאן מחושבות ההפקדות בלבד, בלי תשואה",
            "tax_he": "במשיכה מנוכה מס רווחי הון מהרווחים; מי שמשאיר את הכסף בקופת הגמל עד הפרישה ומקבל אותו כקצבה, בלי מס רווחי הון",
            "fees_he": "הביטוח הלאומי משלם את דמי הניהול עד גיל 21; אחר כך הם נגבים מהחיסכון",
            "medical_he": "ילד במצב רפואי שמסכן את חייו: אפשר למשוך לפני 18, באישור רופא של הביטוח הלאומי, לצרכיו הרפואיים",
            "freeze_he": "ב-1.1.2025 סכום החיסכון הבסיסי לא עודכן, ונשאר כפי שהיה ב-1.1.2024 (סעיף 74ה(4))",
        },
        # סעיף 69; למי משולמת הקצבה (btl).
        "payee": {
            "section": "סעיף 69", "url": WHOM,
            "he": "הקצבה משולמת לאם; בגירושים או בפרידה לאם גם במשמורת משותפת, ולאב רק כשהילדים אצלו בלבד",
            "agree_he": "אפשר לשלם להורה השני בהסכמה בין ההורים או לפי פסק דין, ובתנאי שכל הקצבה משולמת להורה אחד",
            "split_he": "כשחלק מהילדים אצל האם וחלק אצל האב: כל הורה מקבל בעד הילדים שאצלו, אחרי בקשה לפיצול תיק (טופס 5020)",
            "same_sex_he": "בני זוג מאותו מין שחיים יחד מקבלים קצבה אחת על כל הילדים המשותפים, ובוחרים למי היא משולמת",
            "guardian_he": "ילד שאינו אצל הוריו: לאפוטרופוס עם צו מינוי, או למי שהביטוח הלאומי מינה לקבל את הקצבה",
        },
        # איך להגיש תביעה, קצבת ילדים להורים מאמצים, טפסים (btl).
        "claim": {
            "deadline_months": 12, "back_months": 12, "url": CLAIM, "forms_url": FORMS,
            "form": "5025", "change_form": "5026", "split_form": "5020", "split_url": SPLIT_FORM,
            "auto_he": "ברוב המקרים הקצבה משולמת אוטומטית לפי נתוני הלידה שבית החולים מעביר; בלידה ראשונה האם מוסרת בבית החולים את פרטי חשבון הבנק שלה (או חשבון משותף)",
            "claim_he": "לידה בבית, לידה בחוץ לארץ, אימוץ, ילד שעלה בלי הוריו או ילד עם אפוטרופוס: מגישים תביעה לקצבת ילדים (טופס 5025)",
            "deadline_he": "את התביעה מגישים בתוך 12 חודשים מיום הלידה, העלייה או האימוץ; אחרי זה משולם רק בעד 12 החודשים שלפני ההגשה",
            "adoption_he": "באימוץ הקצבה מתחילה מיום קבלת הילד למשפחה (או כניסתו לארץ), לפי אותו כלל של ה-15 בחודש, בלי לחכות לצו האימוץ",
            "appeal_he": "על החלטה אפשר לפנות לוועדת התביעות של הביטוח הלאומי או לבית הדין לעבודה",
        },
        # סעיף 68(ב): סכום נפרד לילד רביעי ואילך שנולד לפני 1.6.2003. ילד כזה מלאו לו 18 לכל המאוחר ב-31.5.2021.
        "legacy": {
            "born_before": "2003-06-01", "section": "סעיף 68(ב)", "url": LAW,
            "he": "סכום נפרד לילד רביעי ואילך שנולד לפני 1.6.2003",
        },
    }
