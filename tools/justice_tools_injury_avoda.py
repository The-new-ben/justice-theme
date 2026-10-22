"""The work-injury dataset of the co.il tools registry (the road-accident and personal-injury wave, 22.10.2026, HAD-591): the
work-injury journey instrument (teunat-avoda) on /work-accident-guide/. Discovered by tools/justice_tools_injury.py (glob),
built with --injury-checked-on.

What this file adds, and what it does NOT repeat: the basic amount 1 (10,514 from 1.1.2026, the base of the injury
allowance maximum, s.97(a)) and the average wage by section 2 (13,769 from 1.1.2026, the base of the increased grant for an
injury before 21) stay in reg.rights_btl and are read from there. The 7-year limitation of a civil claim against the employer
or a third party stays in reg.car_accident.limitation. Here: chapter 5 of the National Insurance Law (the insured, the work
accident and its presumptions, the injury allowance, the disability grant and pension, the degree, the appeal), the claim
period of s.296 and the third-party sections of chapter 14, the 1956 degree regulations (reg. 15, 16, 17, 18a, 19a, 20, 27,
28, 36), and the Institute's pages with the 2026 figures (the daily maximum 1,314.25, the monthly maximum 39,428, both from
1.1.2026), the forms (211, 250, 283, 200, 910) and the deadlines the Institute publishes.

Every value was read on checked_on from the official text named next to it: the consolidated law and regulations as the
National Insurance Institute publishes them (btl.gov.il/Laws1, with the amendment notes), the Institute's own pages, and
gov.il. Nothing here is estimated; a figure the sources do not hold is not in the file.
"""
from __future__ import annotations

KEY = "injury_avoda"

BTL = "https://www.btl.gov.il"
CH5 = f"{BTL}/Laws1/00_0001_000005.pdf"      # חוק הביטוח הלאומי, פרק ה': ביטוח נפגעי עבודה (סעיפים 75-149א)
CH14 = f"{BTL}/Laws1/00_0001_000014.pdf"     # פרק י"ד: גמלאות - הוראות כלליות (סעיפים 296-333)
REGS_1956 = f"{BTL}/Laws1/02_0001_150700.pdf"  # תקנות הביטוח הלאומי (קביעת דרגת נכות לנפגעי עבודה), התשט"ז-1956
WI = f"{BTL}/benefits/Work_Injury"
IA = f"{WI}/%D7%93%D7%9E%D7%99%20%D7%A4%D7%92%D7%99%D7%A2%D7%94"   # /דמי פגיעה
WD = f"{WI}/Work_injury_benefit"
APPEAL = f"{BTL}/benefits/%D7%A2%D7%A8%D7%A2%D7%95%D7%A8%20%D7%A2%D7%9C%20%D7%94%D7%97%D7%9C%D7%98%D7%95%D7%AA%20%D7%94%D7%9E%D7%95%D7%A1%D7%93%20%D7%9C%D7%91%D7%99%D7%98%D7%95%D7%97%20%D7%9C%D7%90%D7%95%D7%9E%D7%99"
FORMS = f"{BTL}/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D"

PAGES = {
    "main": f"{WI}/Pages/default.aspx",
    "what_is": f"{WI}/Pages/%D7%9E%D7%94%D7%99%20%D7%A4%D7%92%D7%99%D7%A2%D7%94%20%D7%91%D7%A2%D7%91%D7%95%D7%93%D7%94.aspx",
    "insured": f"{WI}/Pages/%D7%9E%D7%99%20%D7%9E%D7%91%D7%95%D7%98%D7%97.aspx",
    "ia_main": f"{IA}/Pages/default.aspx",
    "ia_conditions": f"{IA}/Pages/%D7%AA%D7%A0%D7%90%D7%99%20%D7%94%D7%96%D7%9B%D7%90%D7%95%D7%AA%20%D7%9C%D7%93%D7%9E%D7%99%20%D7%A4%D7%92%D7%99%D7%A2%D7%94.aspx",
    "ia_period": f"{IA}/Pages/%D7%AA%D7%A9%D7%9C%D7%95%D7%9D%20%D7%93%D7%9E%D7%99%20%D7%94%D7%A4%D7%92%D7%99%D7%A2%D7%94.aspx",
    "ia_rate": f"{IA}/Pages/%D7%A9%D7%99%D7%A2%D7%95%D7%A8%20%D7%93%D7%9E%D7%99%20%D7%94%D7%A4%D7%92%D7%99%D7%A2%D7%94%20%D7%9C%D7%99%D7%95%D7%9D.aspx",
    "ia_claim": f"{IA}/Pages/%D7%90%D7%95%D7%A4%D7%9F%20%D7%94%D7%92%D7%A9%D7%AA%20%D7%AA%D7%91%D7%99%D7%A2%D7%94%20%D7%9C%D7%93%D7%9E%D7%99%20%D7%A4%D7%92%D7%99%D7%A2%D7%94.aspx",
    "wd_main": f"{WD}/Pages/default.aspx",
    "wd_committee": f"{WD}/KviatDarga/Pages/%D7%91%D7%93%D7%99%D7%A7%D7%94%20%D7%A2%D7%9C%20%D7%99%D7%93%D7%99%20%D7%95%D7%A2%D7%93%D7%94%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA.aspx",
    "wd_rates": f"{WD}/Pages/%D7%A9%D7%99%D7%A2%D7%95%D7%A8%20%D7%95%D7%9E%D7%A7%D7%95%D7%9D%20%D7%AA%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A7%D7%A6%D7%91%D7%AA%20%D7%94%D7%A0%D7%9B%D7%95%D7%AA%20%D7%95%D7%9E%D7%A2%D7%A0%D7%A7%20%D7%94%D7%A0%D7%9B%D7%95%D7%AA%20%D7%9E%D7%A2%D7%91%D7%95%D7%93%D7%94.aspx",
    "wd_claim": f"{WD}/Pages/%D7%90%D7%95%D7%A4%D7%9F%20%D7%94%D7%92%D7%A9%D7%AA%20%D7%94%D7%AA%D7%91%D7%99%D7%A2%D7%94.aspx",
    "wd_arar": f"{WD}/Pages/%D7%A2%D7%A8%D7%A8%20%D7%A2%D7%9C%20%D7%94%D7%97%D7%9C%D7%98%D7%AA%20%D7%94%D7%95%D7%95%D7%A2%D7%93%D7%94%20%D7%94%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA.aspx",
    "wd_recheck": f"{WD}/Pages/%D7%91%D7%93%D7%99%D7%A7%D7%94%20%D7%9E%D7%97%D7%93%D7%A9.aspx",
    "wd_combine": f"{WD}/Pages/zirof-dargot-necot.aspx",
    "wd_needy": f"{WD}/Pages/%D7%94%D7%9B%D7%A8%D7%94%20%D7%9B%D7%A0%D7%9B%D7%94-%D7%A0%D7%96%D7%A7%D7%A7.aspx",
    "wd_special": f"{WD}/Pages/HatavotNifgaeyAvoda.aspx",
    "wd_deductions": f"{WD}/Pages/%D7%A0%D7%99%D7%9B%D7%95%D7%99%D7%99%D7%9D%20%D7%9E%D7%AA%D7%A9%D7%9C%D7%95%D7%9D%20%D7%94%D7%A7%D7%A6%D7%91%D7%94.aspx",
    "wd_other": f"{WD}/Pages/%D7%9C%D7%9E%D7%A7%D7%91%D7%9C%20%D7%A7%D7%A6%D7%91%D7%90%D7%95%D7%AA%20%D7%A0%D7%95%D7%A1%D7%A4%D7%95%D7%AA%20%D7%91%D7%9E%D7%95%D7%A1%D7%93.aspx",
    "claims_committee": f"{APPEAL}/Pages/vadatviot.aspx",
    "labor_court": f"{APPEAL}/Pages/%D7%91%D7%AA%D7%99%20%D7%94%D7%93%D7%99%D7%9F%20%D7%94%D7%90%D7%96%D7%95%D7%A8%D7%99%D7%99%D7%9D%20%D7%9C%D7%A2%D7%91%D7%95%D7%93%D7%94.aspx",
    "legal_aid": f"{APPEAL}/Pages/%D7%A1%D7%99%D7%95%D7%A2%20%D7%9E%D7%A9%D7%A4%D7%98%D7%99.aspx",
    "calc_eligibility": f"{BTL}/Simulators/Pages/Pgia.aspx",
    "calc_disability": f"{BTL}/Simulators/Pages/NifgaeyAvodaCalc.aspx",
    "calc_weighted": f"{BTL}/Simulators/Pages/NecutCalc.aspx",
    "fee_limit": f"{WI}/Pages/SHAR-TIRHA.aspx",
    "survivors": f"{WI}/%D7%96%D7%9B%D7%95%D7%99%D7%95%D7%AA%20%D7%91%D7%A0%D7%99%20%D7%9E%D7%A9%D7%A4%D7%97%D7%94%20%D7%A9%D7%9C%20%D7%A0%D7%A4%D7%98%D7%A8%20%D7%9E%D7%A4%D7%92%D7%99%D7%A2%D7%94%20%D7%91%D7%A2%D7%91%D7%95%D7%93%D7%94/Pages/default.aspx",
}
EMPLOYER_REPORT = "https://www.gov.il/he/service/report-of-a-work-accident"   # משרד העבודה, עודכן 26.12.2023


def build(checked_on: str) -> dict:
    """The work-injury journey: is it a work accident, the injury allowance, the disability grant or pension, the deadlines."""
    return {
        "name_he": "נפגעי עבודה: תאונת עבודה, דמי פגיעה, מענק או קצבת נכות מעבודה, והמועדים",
        "publisher_he": "חוק הביטוח הלאומי (פרק ה' ופרק י\"ד), תקנות קביעת דרגת נכות לנפגעי עבודה 1956, המוסד לביטוח לאומי ומשרד העבודה",
        "source_name": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, פרק ה': ביטוח נפגעי עבודה (הנוסח שמפרסם המוסד לביטוח לאומי)",
        "source_url": CH5,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "pages": PAGES,
        "law": {
            "he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995",
            "chapter_he": "פרק ה': ביטוח נפגעי עבודה",
            "url": CH5,
            "general_url": CH14,
            "sections": {
                "insured": "סעיף 75", "self_registered": "סעיף 77(א)", "definitions": "סעיף 79", "presumptions": "סעיף 80",
                "way": "סעיף 80(1)", "rescue": "סעיף 80(2)", "other_person": "סעיף 80(3)", "break": "סעיף 80(4)",
                "committee": "סעיף 80(6)", "deviation": "סעיף 81(א)", "deviation_ok": "סעיף 81(ב)", "breach": "סעיף 82",
                "causality": "סעיף 83", "hernia": "סעיף 84", "hearing": "סעיף 84א", "disease": "סעיף 85",
                "in_kind": "סעיף 86", "allowance": "סעיף 92(א)", "allowance_max": "סעיף 92(ב)", "injury_day": "סעיף 93(א)",
                "waiting": "סעיף 93(ב)", "first_period": "סעיף 94", "first_period_self": "סעיף 94(ב)(2)", "rate": "סעיף 97(א)",
                "contributions": "סעיף 97(ד)", "regular_wage": "סעיף 98", "both": "סעיף 99", "partial": "סעיף 102",
                "disabled_def": "סעיף 103", "entitlement": "סעיף 104", "full_pension": "סעיף 105", "pension": "סעיף 106",
                "grant": "סעיף 107(א)", "grant_young": "סעיף 107(ב)", "index": "סעיף 110", "special": "סעיף 112",
                "capitalise": "סעיף 113", "grant_then_pension": "סעיף 114", "young_pension": "סעיף 115",
                "degree": "סעיף 118", "temporary": "סעיף 119", "previous": "סעיף 120", "combine": "סעיף 121",
                "arar": "סעיף 122", "court": "סעיף 123", "certificate": "סעיף 126", "survivors": "סעיף 130",
                "claim_period": "סעיף 296(א)", "late_claim": "סעיף 296(ב)(1)", "advance": "סעיף 302(א)(3)",
                "third_party": "סעיף 328(א)", "road_deduct": "סעיף 328א(ב)(2)", "on_account": "סעיף 329", "split": "סעיף 330",
            },
        },
        # Chapter 5, s.79-82 and the Institute's page "מהי פגיעה בעבודה". Each circumstance is a presumption the law states.
        "accident": {
            "work_he": "תאונה שאירעה תוך כדי העבודה ועקב העבודה אצל המעסיק או מטעמו; בעובד עצמאי: תוך כדי העיסוק במשלח היד ועקב העיסוק בו",
            "work_section": "סעיף 79",
            "causality_he": "תאונה שאירעה לעובד תוך כדי עבודה נחשבת גם תאונה עקב העבודה, אם לא הוכח ההיפך",
            "circumstances": [
                {"code": "work", "section": "סעיף 79", "he": "תוך כדי העבודה ועקב העבודה"},
                {"code": "way", "section": "סעיף 80(1)", "he": "בדרך מהבית (או מהמקום שבו ישנים) לעבודה, מהעבודה הביתה, או ממקום עבודה אחד לאחר, כולל תאונת דרכים"},
                {"code": "break", "section": "סעיף 80(4)", "he": "בהפסקה שנקבעה על דעת המעסיק ואינה עולה על 3 שעות, במקום שבו סועדים או בדרך אליו וממנו (לעובד שכיר)", "max_hours": 3},
                {"code": "rescue", "section": "סעיף 80(2)", "he": "בשעת העבודה, במקום העבודה או בסביבתו הקרובה, תוך הצלת גוף או רכוש או מניעת נזק"},
                {"code": "other_person", "section": "סעיף 80(3)", "he": "בשעת העבודה, מפגיעה שגרם אדם אחר בחפץ שנמצא במקום העבודה, בלי שהנפגע היה שותף לגרימתה"},
                {"code": "committee", "section": "סעיף 80(6)", "he": "בשעת מילוי תפקיד בוועד העובדים ובדרך אליו וממנו (לעובד שכיר)"},
            ],
            "btl_more_he": "לפי דף הביטוח הלאומי נחשבות גם תקיפה תוך כדי ועקב העבודה (כולל תקיפה מינית) שגרמה נזק גופני או נפשי ומצריכה טיפול, פגיעה בעבודה מהבית תוך כדי ועקב העבודה, ופגיעה נפשית עקב \"אירוע מיוחד\" בעבודה",
            # s.81(a): a substantial stop or deviation on the way breaks the presumption, unless it was for a duty to the
            # employer; s.81(b): escorting a child (the Institute's page: up to age 10) or the morning prayer is not one.
            "deviation": {
                "section": "סעיף 81(א)", "ok_section": "סעיף 81(ב)", "child_age": 10,
                "he": "תאונה בדרך לא נחשבת תאונת עבודה אם הייתה בדרך הפסקה או סטייה של ממש מהדרך המקובלת שלא לצורך חובה כלפי המעסיק (או העיסוק, בעצמאי)",
                "ok_he": "הפסקה או סטייה כדי ללוות ילד לגן, למעון או למקום אחר שבו הוא נמצא לפי הסדר קבע ולהחזירו משם (לפי דף הביטוח הלאומי: ילד עד גיל 10, או שבגלל ליקוי צריך ליווי), או כדי להתפלל תפילת בוקר בציבור בבית התפילה הקבוע, לא נחשבת סטייה של ממש",
            },
            # s.81(a), the end: on the way, an accident attributed mainly to the insured's gross negligence is not a work
            # accident unless it caused at least four weeks of incapacity, disability or death.
            "gross": {"section": "סעיף 81(א)", "min_days": 28, "he": "תאונה בדרך שיש לייחס בעיקר לרשלנות פושעת של הנפגע לא נחשבת תאונת עבודה, אלא אם גרמה אי-כושר של ארבעה שבועות לפחות, נכות או מוות"},
            # s.82: negligence against a lawful instruction or the employer's instructions.
            "breach": {"section": "סעיף 82", "min_days": 10, "he": "תאונה שאירעה כשהנפגע נהג ברשלנות שלא לפי הוראה חוקית או הוראות המעסיק לא נחשבת תאונת עבודה, אלא אם בגללה נפטר, נעשה נכה או לא היה מסוגל לעבוד 10 ימים לפחות, ולולא ההתנהגות הזאת הייתה נחשבת תאונת עבודה"},
            # s.77(a) and the Institute's pages: a self-employed person is covered only if registered at the time of the
            # injury (or did what was required to register); the injury allowance pages add: and paid the contributions on time.
            "self_registered": {"section": "סעיף 77(א)", "he": "לעובד עצמאי, תנאי לגמלה הוא שבזמן הפגיעה היה רשום בביטוח הלאומי כעובד עצמאי או עשה את המוטל עליו כדי להירשם", "btl_he": "לפי דף הביטוח הלאומי, דמי פגיעה לעצמאי משולמים רק אם היה רשום כעצמאי בזמן הפגיעה ושילם את דמי הביטוח במועד"},
            "hernia_he": "בקע מפשעתי מוכר רק אם הופיע בעבודה ממאמץ לא רגיל או ממכה באזור הבטן, והנפגע הפסיק לעבוד וקיבל טיפול בתוך 72 שעות (סעיף 84)",
            "hearing_he": "ליקוי שמיעה מרעש מוכר רק אם הייתה חשיפה לרעש מזיק, השמיעה ירדה ב-20 דציבל לפחות בכל אוזן, והתביעה הוגשה בתוך 12 חודשים מהתיעוד הראשון (סעיף 84א)",
            "disease_he": "מחלת מקצוע היא מחלה שנקבעה בתקנות כמחלת מקצוע, שהמבוטח חלה בה עקב עבודתו (סעיפים 79 ו-85)",
        },
        # Chapter 5, sign D (ss.92-102) and the Institute's pages "שיעור דמי הפגיעה ליום" and "תקופת תשלום דמי הפגיעה".
        "allowance": {
            "pct": 75,
            "quarter_days": 90,
            "section": "סעיף 97(א)",
            "base_section": "סעיף 98(א)",
            # s.97(a): no more than 75% of the basic amount (reg.rights_btl.basic_amount.b1) × 5, divided by 30.
            "cap_multiple": 5,
            "cap_divisor": 30,
            "cap_pct": 75,
            "max_daily": 1314.25,
            "max_daily_from": "2026-01-01",
            "max_daily_url": PAGES["ia_rate"],
            "max_daily_he": "מקסימום דמי הפגיעה ליום 1,314.25 ש\"ח (החל ב-1.1.2026)",
            "max_days": 91,
            "max_weeks": 13,
            "max_section": "סעיף 92(ב)",
            "waiting_days": 2,
            "waiting_unless_days": 12,
            "waiting_section": "סעיף 93(ב)",
            "waiting_btl_he": "לפי דף הביטוח הלאומי: מי שנעדר פחות מ-12 יום מקבל דמי פגיעה מהיום השלישי שלמחרת יום הפגיעה; מי שנעדר יותר מ-12 יום מקבל מהיום שלמחרת יום הפגיעה (בחוק: 12 ימים לפחות בנוסף על יום הפגיעה)",
            "injury_day_section": "סעיף 93(א)",
            "injury_day_he": "בעד יום הפגיעה לא משולמים דמי פגיעה, והמעסיק משלם לעובד את שכר אותו יום",
            "first_period_days": 12,
            "first_period_section": "סעיף 94",
            "first_period_he": "את דמי הפגיעה של 12 הימים הראשונים משלם הביטוח הלאומי וגובה אותם מהמעסיק (חוץ ממעסיק של עובד במשק בית); לעובד זה לא משנה דבר",
            "self_first_section": "סעיף 94(ב)(2)",
            "self_first_he": "לעובד עצמאי לא משולמים דמי פגיעה בעד 12 הימים הראשונים שבעדם הוא זכאי להם",
            "employer_reg22_he": "מעסיק שקיבל הרשאה לפי תקנה 22 משלם את דמי הפגיעה בעצמו, לא פחות ממה שמגיע לפי החוק, והביטוח הלאומי מחזיר לו",
            "income_he": "השכר החייב בדמי ביטוח, כולל שעות נוספות, פרמיות ומענקים (ביגוד, הבראה, משכורת 13)",
            "alt_base_he": "75% מההכנסה ב-3 החודשים המלאים שלפני ה-1 בחודש שבו הופסקה העבודה, או מחודש הפגיעה עד יום הפגיעה ושני החודשים שלפניו, חלקי 90: הגבוה מבין השניים",
            "self_base_he": "לעובד עצמאי: לפי ההכנסה בשנת המס השוטפת",
            "several_he": "עובד אצל כמה מעסיקים: דמי הפגיעה מחושבים לפי ההכנסות מכל המעסיקים",
            "deductions_he": "מדמי הפגיעה מנוכים מס הכנסה, דמי ביטוח לאומי ודמי ביטוח בריאות",
            "sick_days_he": "ימים שבעדם משולמים דמי פגיעה לא יורדים ממכסת ימי המחלה",
            "partial_section": "סעיף 102",
            "partial_hours": 8,
            "partial_max_weeks": 13,
            "partial_he": "מי שצמצם שעות עבודה בגלל אי-כושר חלקי מהפגיעה מקבל דמי פגיעה מופחתים: שמינית מדמי הפגיעה ליום לכל שעת אי-כושר שאושרה, עד 8 שעות ביום, ולא יותר מ-13 שבועות",
            "no_allowance_he": "לא זכאים לדמי פגיעה: מי שעבד בפועל בתקופת אי-הכושר, אסיר או עציר, חייל בשירות קבע, ועובד זר ששוהה בארץ שלא כחוק",
        },
        # Chapter 5, sign E (ss.103-117) and the Institute's page "שיעורי קצבת נכות מעבודה".
        "disability": {
            "grant_min": 9,
            "pension_min": 20,
            "temp_min": 9,
            "entitle_section": "סעיף 104",
            "full_section": "סעיף 105(א)",
            "full_he": "קצבה חודשית לנכות של 100%: דמי הפגיעה ליום שהיו משתלמים למבוטח, כפול 30",
            "full_days": 30,
            "max_monthly": 39428,
            "max_monthly_from": "2026-01-01",
            "max_monthly_url": PAGES["wd_rates"],
            "max_monthly_he": "מקסימום הקצבה בחודש 39,428 ש\"ח (החל ב-1.1.2026) למבוטח שכיר ועצמאי",
            "pension_section": "סעיף 106",
            "pension_he": "בנכות של פחות מ-100%, הקצבה היא אחוז הנכות מקצבת ה-100%",
            "grant_months": 43,
            "grant_section": "סעיף 107(א)",
            "grant_he": "מענק חד-פעמי לדרגה יציבה של 9% עד פחות מ-20%: 43 קצבאות חודשיות",
            "late_months": 12,
            "late_he": "תביעה שהוגשה אחרי 12 חודשים מהחודש שבו נוצרו התנאים למענק: המענק משולם, אבל פוחת בקצבה חודשית אחת לכל חודש מתום 12 החודשים ועד חודש הגשת התביעה",
            "young_age": 21,
            "young_section": "סעיף 107(ב)",
            "young_he": "מי שנפגע לפני גיל 21 (חוץ מבן קיבוץ) ומקבל מענק: המענק מחושב כאילו הייתה הכנסתו החודשית בגובה השכר הממוצע",
            "pay_day": 28,
            "pay_he": "קצבת נכות מעבודה משולמת ב-28 בכל חודש",
            "income_he": "הכנסה מעבודה או מכל מקור אחר לא משפיעה על קצבת נכות מעבודה",
            "index_section": "סעיף 110",
            "index_he": "קצבת הנכות משתנה ב-1 בינואר בכל שנה לפי עליית המדד",
            "temporary_section": "סעיף 119",
            "temporary_he": "דרגה זמנית יכולה לחול גם מלפני יום הקביעה, ולעתיד לא ליותר משנה אחת מיום הקביעה",
            "temporary_max_months": 12,
            "special_min": 75,
            "special_alt_min": 65,
            "special_section": "סעיף 112",
            "special_he": "דרגה יציבה של 75% ומעלה (או 65% עד 74% עם קושי בהליכה, באישור רופא המוסד): אפשר לתבוע קצבה מיוחדת או מענק מיוחד לטיפול אישי ולהוצאות מיוחדות",
            "certificate_min": 20,
            "certificate_section": "סעיף 126",
            "certificate_he": "דרגה יציבה של 20% ומעלה מזכה בתעודת נכה",
            "grant_then_pension_section": "סעיף 114",
            "grant_then_pension_he": "מי שקיבל מענק והנכות עלתה לדרגה שמזכה בקצבה: המענק ששולם מקוזז מהקצבה",
            "young_pension_section": "סעיף 115",
            "young_pension_he": "קצבה של מי שנפגע לפני גיל 18 גדלה בגיל 18 ושוב בגיל 21, ומי שנפגע בין 18 ל-21 גדלה בגיל 21, כפי שנקבע בתקנות",
            "capitalise_section": "סעיף 113",
            "capitalise_he": "בדרגה של 20% ומעלה, ובהסכמת הנכה, המוסד רשאי לשלם מענק (היוון) במקום הקצבה, למי שיש לו הכנסה קבועה מספקת או סיכוי מבוסס לה",
            "income_support_he": "מי שזכאי ליותר מקצבה אחת מהביטוח הלאומי בוחר באחת מהן; כמה קצבאות נכות מעבודה יחד לא עולות על קצבה של 100%",
        },
        # The 1956 degree regulations (btl.gov.il/Laws1/02_0001_150700.pdf).
        "regs": {
            "he": "תקנות הביטוח הלאומי (קביעת דרגת נכות לנפגעי עבודה), התשט\"ז-1956",
            "url": REGS_1956,
            "reg15": {
                "section": "תקנה 15(א)", "cond_section": "תקנה 15(ב)", "only_section": "תקנה 15(ד)",
                "max_share": 50, "grant_cap": 19, "grant_cap_below": 20,
                "he": "הוועדה רשאית לקבוע דרגת נכות יציבה גדולה עד מחצית מזו שנקבעה לפי המבחנים, בשים לב למקצוע ולגיל; אם הדרגה פחותה מ-20%, הדרגה אחרי ההגדלה לא תעלה על 19%, ובכל מקרה אחר לא על 100%",
                "cond_he": "הוועדה מתחשבת במקצוע כשלדעתה הנפגע לא מסוגל לחזור לעבודתו או לעיסוקו והנכות הביאה לירידה ניכרת ולא זמנית בהכנסותיו",
                "only_he": "ההגדלה רק בפגימות שנובעות מהפגיעה בעבודה הזאת",
                "from": "2000-04-01",
            },
            "reg16": {"section": "תקנה 16", "min": 65, "he": "אם עקב הפגיעה נמנע כל סיכוי לעבודה והדרגה לפי המבחנים היא 65% לפחות, הוועדה רשאית לקבוע 100%"},
            "reg17": {"section": "תקנה 17", "from_months": 12, "to_months": 60, "min": 20, "he": "בין 12 ל-60 חודשים אחרי שנקבעה לאחרונה דרגה יציבה של 20% ומעלה, אפשר לבקש מהרשות לקבוע אם הנכות הביאה לירידה ניכרת ולא זמנית בהכנסות (תקנה 15); אם תקנה 15 כבר הופעלה, גם המוסד רשאי לבקש לשנות"},
            "reg18a": {"section": "תקנה 18א", "months": 4, "he": "נכה נזקק (נכות זמנית, אין סיכוי סביר לעבודה כלשהי עקב הפגיעה ואין הכנסה מהתעסקות): הרשות רשאית לקבוע נכות זמנית של 100% לתקופה של עד 4 חודשים", "btl_he": "לפי דף הביטוח הלאומי, הקצבה תאושר לכל היותר עבור 12 החודשים שלפני הגשת התביעה, ובתום התקופה מגישים בקשה חדשה"},
            "reg19a": {"section": "תקנה 19א", "he": "דרגת נכות שמזכה בקצבה ומבוטאת בשבר: השבר מעוגל לשלם כלפי מעלה"},
            "reg20": {"section": "תקנה 20", "he": "הדרגה חלה מתאריך הגשת הבקשה, אבל הוועדה רשאית לקבוע תאריך מוקדם יותר"},
            "reg27": {"section": "תקנה 27(א)", "days": 30, "he": "ערר על החלטת הוועדה הרפואית מגישים לוועדה לערעורים תוך 30 יום מהתאריך שבו נמסרה ההחלטה; גם המוסד רשאי לערור באותו מועד"},
            "reg28": {"section": "תקנה 28", "days": 30, "he": "ערר שהוגש במועד בלי נימוקים: המועד להגשת הנימוקים מוארך ב-30 ימים נוספים"},
            "reg36": {"section": "תקנה 36(א)", "months": 6, "he": "החמרה: אחרי 6 חודשים מאז נקבעה לאחרונה הדרגה, ועם אישור בכתב של רופא מוסמך מקופת החולים, אפשר לבקש קביעה מחדש (בהסכמת רופא מוסמך גם קודם)"},
            "reg12_he": "צירוף דרגות נכות מכמה פגיעות בעבודה (סעיף 121 ותקנה 12): כשההכנסות ירדו לצמיתות ב-50% או יותר בגלל הצטברות הנכויות",
        },
        "combine": {"section": "סעיף 121", "income_drop_pct": 50, "min_weighted": 65, "url": PAGES["wd_combine"], "he": "מי שנקבעו לו דרגות נכות מכמה תאונות עבודה: כשיש צמצום קבוע של 50% או יותר בהכנסות בגלל הצטברות הנכויות, אפשר לצרף את הדרגות; התוצאה: קצבה במקום מענק, או דרגה משוקללת של 65% לפחות למי שכבר מקבל קצבה"},
        # The deadlines, each with its rule.
        "deadlines": {
            "claim_months": 12,
            "claim_section": "סעיף 296(א)",
            "claim_he": "תביעה לגמלת כסף מגישים תוך 12 חודשים מהיום שבו נוצרה עילת התביעה",
            "claim_btl_he": "לפי דפי הביטוח הלאומי, תביעה לדמי פגיעה ותביעה לגמלת נכות מעבודה מגישים בתוך 12 חודשים מיום הפגיעה; את התביעה לגמלת נכות מומלץ להגיש סמוך לסיום דמי הפגיעה",
            "late_back_months": 12,
            "late_section": "סעיף 296(ב)(1)",
            "late_he": "תביעה מאוחרת: גמלה לא משולמת בעד יותר מ-12 החודשים שקדמו לחודש הגשת התביעה",
            "arar_days": 30,
            "reasons_days": 30,
            "court_days": 60,
            "court_section": "סעיף 123",
            "court_he": "על החלטת הוועדה הרפואית לעררים אפשר לערער רק בשאלה משפטית, לבית הדין האזורי לעבודה, בתוך 60 יום ממועד קבלת ההודעה על ההחלטה",
            "claims_committee_months": 6,
            "claims_committee_he": "על החלטת פקיד התביעות אפשר לפנות לוועדת התביעות (טופס בל/910) בתוך 6 חודשים מתאריך מכתב הדחייה; הפנייה לא דוחה את המועד לבית הדין",
            "labor_court_months": 12,
            "labor_court_he": "תביעה לבית הדין האזורי לעבודה על החלטת הביטוח הלאומי מגישים בתוך 12 חודשים מיום שנמסרה ההחלטה",
            "interpretation_he": "חוק הפרשנות, התשמ\"א-1981, סעיף 10(ג): מועד שחל ביום מנוחה עובר ליום שאחריו",
        },
        "forms": {
            "claim": {"code": "בל/211", "he": "תביעה לתשלום דמי פגיעה והודעה על פגיעה בעבודה", "url": PAGES["ia_claim"], "form_url": f"{FORMS}/Documents/t211.pdf"},
            "referral": {"code": "בל/250", "he": "טופס למתן טיפול רפואי לנפגע בעבודה, שכיר: המעסיק ממלא וחותם", "url": f"{FORMS}/forms/Work_Disability_and_Dependants_forms/Pages/matanTipul.aspx"},
            "referral_self": {"code": "בל/283", "he": "הפניה לטיפול רפואי לעצמאי", "url": f"{FORMS}/forms/Work_Disability_and_Dependants_forms/Pages/tipulREfuiLeatzmaii.aspx"},
            "disability": {"code": "בל/200", "he": "תביעה לקביעת דרגת נכות מעבודה", "url": PAGES["wd_claim"], "form_url": f"{FORMS}/Documents/t200.pdf"},
            "claims_committee": {"code": "בל/910", "he": "פנייה לוועדת תביעות", "url": PAGES["claims_committee"]},
            "certificate_he": "תעודה רפואית ראשונה לנפגע בעבודה: הרופא בקופת החולים נותן אותה לפי טופס ההפניה, ובה האבחנה ותקופת אי-הכושר",
            "road_docs_he": "תאונת דרכים: מצרפים לתביעה דוח משטרה, צילום תעודת הביטוח והעתק מהתביעה לחברת הביטוח",
        },
        "employer_report": {
            "days_over": 3,
            "he": "לפי פקודת התאונות ומחלות משלח יד (הודעה), 1945, המעסיק חייב לדווח מיד למפקח עבודה אזורי על פגיעה בעבודה שגרמה ליותר משלושה ימי אי-כושר לעבודה, או למות העובד",
            "url": EMPLOYER_REPORT,
            "updated": "2023-12-26",
        },
        "road": {
            "way_section": "סעיף 80(1)",
            "deduct_section": "סעיף 328א(ב)(2)",
            "deduct_from": "2023-01-01",
            "deduct_he": "כשבית משפט מחייב מבטח לשלם פיצויים לפי חוק פיצויים לנפגעי תאונות דרכים למי שזכאי לגמלה בשל אותו מקרה, סכום הגמלה מופחת מהפיצויים (מ-1.1.2023 המוסד לא תובע את המבטח, וההפחתה נעשית בפסק הדין)",
            "url": CH14,
        },
        "third_party": {
            "section": "סעיף 328(א)",
            "he": "כשהמקרה מחייב גם צד שלישי בפיצויים לפי פקודת הנזיקין, המוסד רשאי לתבוע ממנו את הגמלה ששילם; מי שתובע צד שלישי מודיע על כך למחלקת נפגעי עבודה בסניף",
            "on_account_he": "תשלום שהתקבל מצד שלישי על חשבון פיצויים: המוסד רשאי לזקוף עד 75% ממנו על חשבון הגמלה (סעיף 329)",
            "url": CH14,
        },
        "help": {
            "yad_he": "ייעוץ והכנה חינם לוועדות הרפואיות במרכזי \"יד מכוונת\" של הביטוח הלאומי",
            "yad_phone": "*2496",
            "aid_he": "סיוע משפטי חינם לערעור בבית הדין לעבודה: הלשכות לסיוע משפטי של משרד המשפטים",
            "advance_he": "מי שעדיין לא חזר לעבודה ונותרה לו נכות רשאי לבקש מקדמה בסניף (סעיף 302)",
            "fee_he": "החוק מגביל את שכר הטרחה שמייצגים (חברות מיצוי זכויות, עורכי דין) רשאים לגבות בתביעות נפגעי עבודה; הסכומים בדף הביטוח הלאומי",
        },
        # What changed and when: each row from the amendment notes of the Institute's consolidated text.
        "changes": [
            {"date": "2000-04-01", "section": "תקנה 15(א)", "url": REGS_1956, "he": "תקנה 15: הוועדה רשאית רק להגדיל את הדרגה היציבה (עד מחצית), בשים לב למקצוע ולגיל; קודם יכלה גם להקטין"},
            {"date": "2002-02-01", "section": "סעיפים 92(ב) ו-102(ג)", "url": CH5, "he": "תקופת דמי הפגיעה קוצרה מ-26 שבועות ל-13 שבועות (גם בדמי פגיעה מופחתים)"},
            {"date": "2003-01-01", "section": "סעיף 107(א)", "url": CH5, "he": "המועד שאחריו מענק נכות פוחת בגלל תביעה מאוחרת: 12 חודשים במקום 48"},
            {"date": "2003-06-01", "section": "סעיף 107(א)", "url": CH5, "he": "מענק נכות מעבודה: 43 קצבאות חודשיות במקום 70"},
            {"date": "2005-01-01", "section": "סעיף 104(ב)(2), (ג)", "url": CH5, "he": "הסף לקצבה בדרגה זמנית ולמענק: 9% במקום 5%"},
            {"date": "2005-04-01", "section": "סעיף 94", "url": CH5, "he": "תקופת הזכאות הראשונה (שהמעסיק מחזיר, ושעצמאי לא מקבל בעדה): 12 ימים במקום 9"},
            {"date": "2006-01-01", "section": "סעיפים 97(א) ו-110", "url": CH5, "he": "התקרה ליום: 75% מהסכום הבסיסי כפול 5 חלקי 30; קצבת הנכות מוצמדת למדד ב-1 בינואר"},
            {"date": "2026-01-01", "section": "סעיף 97(א)", "url": PAGES["ia_rate"], "he": "מקסימום דמי הפגיעה ליום: 1,314.25 ₪; מקסימום קצבת נכות מעבודה: 39,428 ₪ בחודש"},
        ],
        # Read-only notes on the live page (/work-accident-guide/, modified 23.8.2026) that the page copy corrects.
        "counted_he": "משרד העבודה: מדי שנה מתרחשות במשק אלפי תאונות עבודה, ועשרות מהן מסתיימות במוות (דף הדיווח, עודכן 26.12.2023)",
    }
