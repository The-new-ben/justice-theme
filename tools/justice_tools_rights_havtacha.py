"""The income-support dataset of the co.il tools registry (the rights wave 2B, 21.10.2026): the havtachat-hachnasa
instrument on /havtachat-hachnasa/. Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES) through KEY and build().

Every value was read on checked_on from the official text named next to it: the National Insurance Institute's income-
support pages (eligibility, the 2026 amounts by age group, working and the income disregards, other income, the car and its
exceptions, the employment service and the exemptions, the claim and the payment, the maximum period, separate eligibility,
the hearing, the appeal to the labour court), the Income Support Law, 1980 and the Income Support Regulations, 1982, both in
the Institute's own consolidated text (btl.gov.il/Laws1), and the Institute's retirement-age table.

The amounts derive from rights_btl. The law's "basic amount" (s.1, updated each January by the CPI) is basic amount 3 of
the Institute's table (10,382 from 1.1.2026): the second schedule gives every family's full benefit as a percentage of it
(column B under 55: single 20%, couple 27.5%, couple and a child 30%, couple and two children or more 33.5%, single parent
and a child 33.5%, single parent and two children or more 39%; column C from 55: 25%, 37.5%, 43.5%, 49.5%, and 42.5% and
52.5% less "the basic amount for a child", which is the income-support point of basic amount 2, 162). The disregards of
ss.12-12א are percentages of the average wage of section 2 of the National Insurance Law (13,769, rights_btl): 5% = 688,
7% = 964, 13% = 1,790, 17% = 2,341, 33.81% = 4,655 (the single parent's band); the determining amounts of s.7 and
regulation 9 at 55 and over are 38%, 54.5%, 60.5% and 66.5% of it. build() derives every one of them and stops if the
derivation does not give the Institute's published 2026 figure, so a new basic amount or average wage is never trusted
without a check. Nothing here is estimated; a figure the sources do not hold is not in the file (see
parts/havtachat-hachnasa/notes.md).
"""
from __future__ import annotations

from fractions import Fraction as F
from math import floor

from justice_tools_rights import build_rights_btl

KEY = "rights_havtacha"

BTL = "https://www.btl.gov.il/benefits/Income_support/Pages/"
MAIN = BTL + "default.aspx"                                                                             # הבטחת הכנסה: דף הענף
ELIGIBILITY = BTL + "zacautnew.aspx"                                                                   # תנאי הזכאות
TYPES = BTL + "%d7%a1%d7%95%d7%92%d7%99%20%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx"                          # סוגי הקצבה
AMOUNTS = BTL + "%d7%a1%d7%9b%d7%95%d7%9e%d7%99%20%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx"                  # סכום הקצבה (2026)
INCOME = BTL + "hishuvincome.aspx"                                                                     # חישוב ההכנסות
WORK = BTL + "zikui%20lhacnasa%20meavoda.aspx"                                                         # חישוב הקצבה לפי הכנסה מעבודה
CAR = BTL + "carreject.aspx"                                                                           # זכאות למי שבבעלותו רכב
EMPLOYMENT = BTL + "SerotTAasoka.aspx"                                                                 # רישום והתייצבות
EXEMPTION = BTL + "ptor.aspx"                                                                          # פטור מהתייצבות
CLAIM = BTL + "%d7%90%d7%95%d7%a4%d7%9f%20%d7%94%d7%92%d7%a9%d7%aa%20%d7%94%d7%aa%d7%91%d7%99%d7%a2%d7%94.aspx"  # איך מגישים
PERIOD = BTL + ("%d7%aa%d7%a7%d7%95%d7%a4%d7%aa%20%d7%94%d7%96%d7%9b%d7%90%d7%95%d7%aa%20"
                "%d7%94%d7%9e%d7%a8%d7%91%d7%99%d7%aa.aspx")                                            # תקופת הזכאות המרבית
SEPARATE = BTL + "separate.aspx"                                                                       # זכאות בנפרד מבן הזוג
STUDY = BTL + "study.aspx"                                                                             # הורה עצמאי שלומד
CHANGES = BTL + "%d7%a9%d7%99%d7%a0%d7%95%d7%99%d7%99%d7%9d.aspx"                                       # הודעה על שינויים
HEARING = BTL + "shimoa.aspx"                                                                          # שימוע למקבל הבטחת הכנסה
NEW_RESIDENT = BTL + "newtoshav.aspx"                                                                  # תושב פחות מ-24 חודשים
SINCE_2002 = BTL + "20020223-3597.aspx"                                                                # מקבלים ברציפות מ-2002
RELATED = BTL + "kitsbaotNosafot.aspx"                                                                 # קצבאות נוספות קשורות
APPEAL = ("https://www.btl.gov.il/benefits/%d7%a2%d7%a8%d7%a2%d7%95%d7%a8%20%d7%a2%d7%9c%20%d7%94%d7%97%d7%9c%d7%98%d7%95%d7%aa"
          "%20%d7%94%d7%9e%d7%95%d7%a1%d7%93%20%d7%9c%d7%91%d7%99%d7%98%d7%95%d7%97%20%d7%9c%d7%90%d7%95%d7%9e%d7%99/Pages/"
          "%d7%91%d7%aa%d7%99%20%d7%94%d7%93%d7%99%d7%9f%20%d7%94%d7%90%d7%96%d7%95%d7%a8%d7%99%d7%99%d7%9d%20"
          "%d7%9c%d7%a2%d7%91%d7%95%d7%93%d7%94.aspx")                                                  # ערעור לבית הדין לעבודה
PAY_DATES = "https://www.btl.gov.il/Pages/BenefitsPaymentDates.aspx"                                   # לוח תשלומי קצבאות
CALCULATOR = "https://www.btl.gov.il/Simulators/Pages/IncomeSupportCalc.aspx"                          # המחשבון של המוסד
FORM_PAGE = ("https://www.btl.gov.il/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/forms/"
             "Income_Support_forms/Pages/5619%20-%20%D7%98%D7%95%D7%A4%D7%A1%20%D7%9E%D7%99%D7%9C%D7%95%D7%99%20%D7%A2%D7%A6"
             "%D7%9E%D7%99-%D7%AA%D7%91%D7%99%D7%A2%D7%94%20%D7%9C%D7%92%D7%9E%D7%9C%D7%AA%20%D7%94%D7%91%D7%98%D7%97%D7%AA%20"
             "%D7%94%D7%9B%D7%A0%D7%A1%D7%94.aspx")                                                     # טופס 5619
FORM_ONLINE = "https://govforms.gov.il/mw/forms/T5619@btl.gov.il"                                      # תביעה מקוונת (5619)
FORM_PDF = "https://www.btl.gov.il/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/Documents/t5619.pdf"
TAASUKA = "https://www.taasuka.gov.il/applicants/loginform?ReturnUrl=/applicants/bureauregister/"     # הרשמה בשירות התעסוקה
RETIREMENT = "https://www.btl.gov.il/benefits/old_age/Conditions_of_eligibility/gilMezake/Pages/gilPrisha.aspx"  # גיל הפרישה
OLD_AGE_SUPPLEMENT = "https://www.btl.gov.il/benefits/old_age/hashHachZ/Pages/default.aspx"           # השלמת הכנסה לאזרח ותיק
LAW = "https://www.btl.gov.il/Laws1/00_0002_000000.pdf"                                                # חוק הבטחת הכנסה, התשמ"א-1980
REGS = "https://www.btl.gov.il/Laws1/02_0002_111450.pdf"                                               # תקנות הבטחת הכנסה, התשמ"ב-1982
SIM = "https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep"        # the rehearsal (catalog)

# The Institute's 2026 table (AMOUNTS, "סכום הקצבה החל מ- 01.01.2026"). build() checks that the second schedule's percentages
# of rights_btl give exactly these.
PUBLISHED = {
    "b": {"single": 2076, "couple": 2855, "couple1": 3115, "couple2": 3478, "parent1": 3478, "parent2": 4049},
    "c": {"single": 2596, "couple": 3893, "couple1": 4516, "couple2": 5139, "parent1": 4250, "parent2": 5289},
}
# Ages 20 to 24 who report to the employment service (the left column of the 20-24 table); with children the amount is the
# same as from 25. The law lets the ministers set it between 50% and 80% of the full amount (s.5(ה)(3)); the published
# 2026 figures are 80% of it, to the shekel.
PUBLISHED_YOUNG = {"single": 1661, "couple": 2284, "couple1": 3115, "couple2": 3478, "parent1": 3478, "parent2": 4049}
YOUNG_PCT = 80
# "סכום ההכנסה מעבודה שאפשר להרוויח ועדיין להיות זכאי לקצבה חלקית (בתנאי שזו ההכנסה היחידה)": the Institute's column.
PUBLISHED_MAX_WORK = {
    "b": {"single": 3654, "couple": 5043, "couple1": 5579, "couple2": 6529, "parent1": 8914, "parent2": 9865},
    "c": {"single": 5232, "couple": 7504, "couple1": 8330, "couple2": 9318, "parent1": 10774, "parent2": 12506},
}
# The work-income page (WORK, "החל מ- 01.01.2026"): the disregard and the single parent's band, each derived below.
PUBLISHED_WORK = {"b_single": 688, "b_family": 964, "c_single": 1790, "c_family": 2341, "parent_band": 4655, "worker_from": 3442}
# The second schedule (s.5(א), התוספת השנייה), columns B and C, items 1-4 and 7-8 ("אלמנה או הורה עצמאי").
PCT = {
    "single": ("20", "25"), "couple": ("27.5", "37.5"), "couple1": ("30", "43.5"), "couple2": ("33.5", "49.5"),
    "parent1": ("33.5", "42.5"), "parent2": ("39", "52.5"),
}
# Regulation 9(ב) and (ב1): the determining amounts of s.7 (55 and over), the higher of a percentage of the average wage
# (raised by 5 points for a single person and 7.5 for the others) and a number of credit points.
DETERMINING = {
    "single": {"pct": "33", "uplift": "5", "points": "11.25"},
    "couple": {"pct": "47", "uplift": "7.5", "points": "16.25"},
    "couple1": {"pct": "53", "uplift": "7.5", "points": "16.25"},
    "couple2": {"pct": "59", "uplift": "7.5", "points": "16.25", "points_working": "21.25"},
}
# The Institute's retirement-age table (RETIREMENT): men 67; women by the month of birth.
WOMEN_RETIREMENT = [  # [from YYYY-MM, to YYYY-MM, years, months]
    ["1947-05", "1959-12", 62, 0], ["1960-01", "1960-12", 62, 4], ["1961-01", "1961-12", 62, 8], ["1962-01", "1962-12", 63, 0],
    ["1963-01", "1963-12", 63, 3], ["1964-01", "1964-12", 63, 6], ["1965-01", "1965-12", 63, 9], ["1966-01", "1966-12", 64, 0],
    ["1967-01", "1967-12", 64, 3], ["1968-01", "1968-12", 64, 6], ["1969-01", "1969-12", 64, 9], ["1970-01", None, 65, 0],
]
# The basic-amount page (rights_btl's own source): basic amount 3 and the income-support point of the years before 2026, as
# published (2026 is in rights_btl).
HISTORY = [
    {"from": "2023-01-01", "b3": 9493, "point": 153, "change_pct": 5.3},
    {"from": "2024-01-01", "b3": 9806, "point": 158, "change_pct": 3.3},
    {"from": "2025-01-01", "b3": 10139, "point": 158, "change_pct": 3.4},
]
KINDS = ("single", "couple", "couple1", "couple2", "parent1", "parent2")


def _round(x: F) -> int:
    """To the nearest shekel, a half up (the Institute's published figures all fit)."""
    return floor(x + F(1, 2))


def _derive(b3: int, point: int, avg: int) -> tuple[dict, dict, dict, dict]:
    amounts = {"b": {}, "c": {}}
    for kind in KINDS:
        pb, pc = (F(p) / 100 for p in PCT[kind])
        amounts["b"][kind] = _round(F(b3) * pb)
        amounts["c"][kind] = _round(F(b3) * pc - (point if kind.startswith("parent") else 0))
    young = {k: (_round(F(b3) * F(PCT[k][0]) / 100 * F(YOUNG_PCT, 100)) if k in ("single", "couple") else amounts["b"][k]) for k in KINDS}
    work = {
        "b_single": _round(F(avg) * 5 / 100), "b_family": _round(F(avg) * 7 / 100),
        "c_single": _round(F(avg) * 13 / 100), "c_family": _round(F(avg) * 17 / 100),
        "parent_band": _round(F(avg) * F("33.81") / 100), "worker_from": _round(F(avg) * 25 / 100),
    }
    # The credit-point alternative of regulation 9 is computed by the engine from rights_tax (the credit point of the year);
    # in 2026 it is far below the percentage (21.25 x 242 = 5,142.50 at most), so the published figures are the percentages.
    det = {kind: _round(F(avg) * (F(d["pct"]) + F(d["uplift"])) / 100) for kind, d in DETERMINING.items()}
    return amounts, young, work, det


def build(checked_on: str) -> dict:
    """Income support for 2026: who is eligible (residence, age, the employment test, the exclusions, the car and the assets),
    the full benefit by age group and family, the income disregards, the determining amount from 55, the car deduction,
    the payment and the deadlines, each with the section of the law or the Institute's page it was read from."""
    btl = build_rights_btl(checked_on)
    b3 = btl["basic_amount"]["b3"]
    point = btl["basic_amount"]["b2_income_support"]
    avg = btl["avg_wage"]["s2_benefits"]
    amounts, young, work, det = _derive(b3, point, avg)
    det_published_ok = all(det[k] == PUBLISHED_MAX_WORK["c"][k] for k in ("single", "couple", "couple1"))
    if amounts != PUBLISHED or young != PUBLISHED_YOUNG or work != PUBLISHED_WORK or not det_published_ok:
        raise ValueError(f"rights_havtacha: the law's percentages of rights_btl no longer give the Institute's 2026 table: "
                         f"{amounts} {young} {work} {det}; re-read {AMOUNTS} and {WORK}")
    supplement = _round(F(b3) * F("7.95") / 100)
    if supplement != 825:
        raise ValueError(f"rights_havtacha: 7.95% of {b3} is {supplement}, the Institute publishes 825; re-read {AMOUNTS}")
    return {
        "name_he": "הבטחת הכנסה לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי, ענף הבטחת הכנסה",
        "source_name": "המוסד לביטוח לאומי: הבטחת הכנסה (תנאי זכאות, סכום הקצבה, חישוב ההכנסות, רכב, התייצבות ופטור, תביעה); חוק הבטחת הכנסה ותקנותיו",
        "source_url": AMOUNTS,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "law_he": "חוק הבטחת הכנסה, התשמ\"א-1980",
        "law_url": LAW,
        "regs_he": "תקנות הבטחת הכנסה, התשמ\"ב-1982",
        "regs_url": REGS,
        "rehearse_url": SIM,
        "pages": {
            "main": MAIN, "eligibility": ELIGIBILITY, "types": TYPES, "amounts": AMOUNTS, "income": INCOME, "work": WORK,
            "car": CAR, "employment": EMPLOYMENT, "exemption": EXEMPTION, "claim": CLAIM, "period": PERIOD,
            "separate": SEPARATE, "study": STUDY, "changes": CHANGES, "hearing": HEARING, "new_resident": NEW_RESIDENT,
            "since_2002": SINCE_2002, "related": RELATED, "appeal": APPEAL, "pay_dates": PAY_DATES,
            "calculator": CALCULATOR, "retirement": RETIREMENT, "old_age_supplement": OLD_AGE_SUPPLEMENT,
            "taasuka": TAASUKA,
        },
        # סעיף 2(ב): תושב ישראל 24 חודשים רצופים לפני התביעה (לא חל על מי שמקבל קצבה לפי פרק ה' או י"א לחוק הביטוח); דף
        # "תושב פחות מ-24 חודשים": עולה חדש 12 חודשים בארץ ועד 5 שנים מהעלייה, ומקבלי קצבאות מסוימות.
        "residence": {
            "months": 24, "section": "סעיף 2(ב)", "url": ELIGIBILITY, "new_url": NEW_RESIDENT,
            "new_he": "תושב פחות מ-24 חודשים רצופים יכול להיות זכאי: עולה חדש ששהה בארץ 12 חודשים ועדיין לא חלפו 5 שנים מהעלייה, מי שמקבל קצבת אזרח ותיק, שאירים או נכות מעבודה, או מי שבן הזוג שלו עונה על אחד מאלה",
        },
        # דף תנאי הזכאות, "תנאי שני – גיל": מגיל 20; בנסיבות מיוחדות מגיל 18; הורה לילד בכל גיל. סעיף 2(ה) ו-5(ה)(3): בני 20 עד 24
        # לפי כללים, בשיעור של 50% עד 80% מהקצבה המלאה; תקנה 1א: מתחת ל-20 נשוי, הורה או בהיריון. סעיף 5(א)(2): טור ב' מתחת
        # ל-55, טור ג' מגיל 55; סעיף 5(א)(1): מגיל הפרישה המסלול הוא השלמת הכנסה לקצבת אזרח ותיק.
        "age": {
            "min": 20, "special_min": 18, "young_to": 24, "older_from": 55, "men_retirement": 67,
            "women_retirement": WOMEN_RETIREMENT, "women_retirement_from": 62, "women_retirement_max": 65,
            "section": "סעיף 2(א) ו-2(ה)", "young_section": "סעיף 5(ה)(3)", "column_section": "סעיף 5(א)(2)",
            "under20_section": "תקנה 1א לתקנות", "url": ELIGIBILITY, "retirement_url": RETIREMENT,
            "special_he": "מתחת לגיל 20 אפשר לקבל קצבה רק בנסיבות מיוחדות: נשואים, הורים לילד, היריון, מחלה, גמילה מסמים או מאלכוהול, לימודים באולפן או תכנית שיקומית מאושרת (מגיל 18)",
            "retirement_he": "מגיל הפרישה הקצבה היא השלמת הכנסה לקצבת אזרח ותיק, בסכומים של טור א' בתוספת השנייה, בתביעה אחרת",
            "women_he": "גיל הפרישה לאישה נקבע לפי חודש הלידה: 62 לילידות עד 1959, ועולה בהדרגה עד 65 לילידות 1970 ואילך",
        },
        # סעיף 5(א) והתוספת השנייה (טור ב' עד 55, טור ג' מ-55); דף סכום הקצבה, החל מ-1.1.2026 (נגזר מסכום בסיסי 3 ומנקודת
        # הקצבה שב-rights_btl, ראו למעלה).
        "amounts": {
            "pct": {k: {"b": float(F(v[0])), "c": float(F(v[1])), "less_point": k.startswith("parent")} for k, v in PCT.items()},
            "b": PUBLISHED["b"], "c": PUBLISHED["c"], "young": PUBLISHED_YOUNG, "young_pct": YOUNG_PCT,
            "young_law_min_pct": 50, "young_law_max_pct": 80,
            "max_work": PUBLISHED_MAX_WORK,
            "section": "סעיף 5(א) והתוספת השנייה", "url": AMOUNTS,
            "basic_he": "הסכום הבסיסי של חוק הבטחת הכנסה הוא סכום בסיסי 3 של המוסד; \"הסכום הבסיסי לילד\" הוא נקודת הקצבה של סכום בסיסי 2",
            "couple_he": "לבני זוג משולמת קצבה אחת, לפי הנתונים של בן הזוג שמזכים בסכום הגבוה (סעיף 6)",
            "child_he": "ילד: עד גיל 18, עד 20 בלימודי תיכון או בגרות או במסגרת קדם-צבאית, עד 21 בהתנדבות שדחתה את השירות, ועד 24 בשירות סדיר, לאומי או עתודה",
        },
        # סעיף 12א (עד 55) והתוספת השלישית; סעיף 12 (מ-55): ניכוי ראשון באחוזים מהשכר הממוצע, ואחר כך חלק מהיתרה; הורה
        # עצמאי: 75% מהחלק עד 33.81% מהשכר הממוצע ו-40% ממה שמעליו. דף "חישוב הקצבה לפי הכנסה מעבודה", החל מ-1.1.2026.
        "work": {
            "first": {"b": {"single": PUBLISHED_WORK["b_single"], "family": PUBLISHED_WORK["b_family"]},
                      "c": {"single": PUBLISHED_WORK["c_single"], "family": PUBLISHED_WORK["c_family"]}},
            "first_pct": {"b": {"single": 5, "family": 7}, "c": {"single": 13, "family": 17}},
            "counted_pct": {"b": {"single": 70, "couple": 70, "couple1": 67.5, "couple2": 62.5}, "c": 60},
            "parent": {"band_pct": 33.81, "band": PUBLISHED_WORK["parent_band"], "low_pct": 25, "high_pct": 60},
            "section_b": "סעיף 12א והתוספת השלישית", "section_c": "סעיף 12", "parent_section": "סעיף 12(א)(2)",
            "url": WORK, "income_url": INCOME,
            "includes_he": "הכנסה מעבודה כשכיר או כעצמאי, וגם דמי אבטלה, דמי לידה, גמלה לשמירת היריון, דמי פגיעה ותגמולי מילואים: מכולם רק חלק נחשב",
            "pension_he": "פנסיה מעבודה (לא מהביטוח הלאומי): רק הניכוי הראשון חל עליה, והוא משותף לעבודה ולפנסיה",
            "example_he": "הדוגמה של המוסד: הורה עצמאי בן 38 שמרוויח 4,800 ש\"ח ברוטו: 25% מ-3,691 (4,655 פחות 964) ועוד 60% מ-145 = 1,010 ש\"ח שמופחתים מהקצבה",
        },
        # דף חישוב ההכנסות: הכנסה שלא מעבודה (קצבאות, רווחי הון, מזונות שמקבלים) מנוכה במלואה; סעיף 10 והדף: לא נחשבות קצבת
        # ילדים, ילד נכה, שירותים מיוחדים, ניידות, סיעוד ועוד.
        "other_income": {
            "section": "סעיף 9", "url": INCOME,
            "he": "הכנסה שלא מעבודה, כמו קצבה אחרת, מזונות שמקבלים, שכר דירה או רווחי הון, מנוכה מהקצבה במלואה",
            "excluded_he": "לא נחשבות הכנסה: קצבת ילדים, קצבת ילד נכה, שירותים מיוחדים לנכה, גמלת ניידות, גמלת סיעוד, דמי מחיה לאלמנה וליתום ועוד",
            "alimony_paid_he": "מי שמשלם מזונות לפי פסק דין ואינו גר עם מי שמקבל אותם: המזונות שהוא משלם מנוכים מההכנסה שלו, עד סכום הקצבה",
        },
        # סעיף 7 ותקנה 9 (סכומים קובעים): מגיל 55, ליחיד ולבני זוג שניהם מעל 55, הקצבה לא תעלה על ההפרש בין הסכום הקובע לבין
        # ההכנסה (כולה, לפני הניכויים של סעיף 12). לא חל מתחת ל-55, מגיל הפרישה, ועל הורה עצמאי (פרטים 7-8).
        "determining": {
            "rules": {k: {"pct": float(F(d["pct"])), "uplift": float(F(d["uplift"])), "points": float(F(d["points"])),
                          "points_working": float(F(d.get("points_working", d["points"])))} for k, d in DETERMINING.items()},
            "points_working_he": "בזוג עם שני ילדים: 21.25 נקודות כשבת הזוג עובדת, 16.25 כשלא",
            "by_wage": det, "points_he": "או מספר נקודות הזיכוי שבתקנה, כפול נקודת הזיכוי החודשית של השנה: הגבוה מהשניים",
            "section": "סעיף 7; תקנה 9", "url": REGS, "published_url": AMOUNTS,
            "he": "מגיל 55, ליחיד ולזוג ששניהם מעל 55: הקצבה לא עולה על ההפרש בין \"הסכום הקובע\" לבין ההכנסה כולה; מעל הסכום הקובע אין קצבה",
            "conflict_he": "בזוג עם שני ילדים מגיל 55, הטבלה של המוסד מראה הכנסה מרבית של 9,318 ש\"ח, ולפי תקנה 9 הסכום הקובע הוא 9,156 ש\"ח: בטווח שביניהם כדאי לבדוק מול פקיד התביעות",
        },
        # סעיף 9א; תקנה 10(ג) ו-10ב; דף הרכב ודף חישוב ההכנסות, החל מ-1.1.2026.
        "car": {
            "limit": 46138, "limit_retirement": 65343, "credit_worker": 19610, "credit_other": 10380,
            "worker_pct": 25, "worker_from": PUBLISHED_WORK["worker_from"], "rate_pct": 3,
            "section": "סעיף 9א; תקנות 10(ג) ו-10ב", "url": CAR, "income_url": INCOME,
            "value_he": "שווי הרכב נקבע לפי מחירון לוי יצחק ולפי הרישיון (דגם, שנה, בעלים), במחירון ינואר או יולי, ומ-2026 גם לפי הקילומטראז'",
            "rule_he": "רכב אחד (גם אופנוע) ששוויו עד 46,138 ש\"ח: מהקצבה מנוכים 3% משווי הרכב, אחרי הפחתה של 19,610 ש\"ח למי שמרוויח מעבודה יותר מ-3,442 ש\"ח, או 10,380 ש\"ח לאחרים",
            "over_he": "רכב ששוויו עולה על 46,138 ש\"ח, או שני רכבים, שוללים את הקצבה, אלא אם מתקיים אחד החריגים",
            "exceptions_he": [
                "רכב של מי שזכאי לגמלת ניידות, או מורשה נהיגה של נכה לפי הביטוח הלאומי",
                "התובע, בן הזוג או ילד נכים ברגליים, לפי רופא הביטוח הלאומי",
                "משולמת קצבת ילד נכה בעד הילד",
                "רישיון הרכב הופקד במשרד הרישוי בגלל מחלה שמונעת עבודה",
                "הסעה קבועה של בן משפחה לטיפולים רפואיים, לפי חוות דעת של רופא הביטוח הלאומי",
            ],
            "three_months_he": "רכב לא שולל קצבה עד 3 חודשים כשמחליפים רכב, כשילד הפסיק לקבל קצבת ילד נכה, או לאלמן או אלמנה בלי רישיון אחרי הפטירה",
            "change_he": "פיטורים, התפטרות או ירידה בשכר לא משנים את ההפחתה משווי הרכב בחודש השינוי ובחודשיים שאחריו, אם הייתה קצבה בשלושת החודשים שלפני",
        },
        # סעיף 9(ג): "סכום שאינו מובא בחשבון": כסף עד פי 4 מהסכום הבסיסי ליחיד, פי 6 למי שיש לו בן זוג או ילד; תקנה 10: הכנסה
        # מנכס לפי שיעור הריבית (4.17% מ-1.1.2026) ונכס מקרקעין לפי ייעודו; דירת המגורים לא נחשבת.
        "assets": {
            "free_x": {"single": 4, "family": 6}, "section": "סעיף 9(ג)", "url": INCOME,
            "interest_pct": 4.17, "interest_from": "2026-01-01", "interest_section": "תקנה 10(א)",
            "he": "דירת המגורים לא נחשבת. חיסכון עד פי 4 מהסכום הבסיסי (יחיד) או פי 6 (עם בן זוג או ילד) לא נחשב; מעל זה, ההכנסה מהנכס מחושבת לפי שיעור הריבית שבתקנות ומפחיתה את הקצבה",
            "realty_he": "נכס מקרקעין נוסף, משק חקלאי או קרקע: ההכנסה נקבעת לפי ייעוד הנכס ושומת שמאי, והזכאות נבדקת בסניף",
        },
        # סעיף 2(א) ו-3א; דף ההתייצבות ודף הפטור.
        "employment": {
            "section": "סעיף 2(א); סעיף 4", "refuse_section": "סעיף 3א", "refuse_months": 2, "url": EMPLOYMENT,
            "exemption_url": EXEMPTION, "taasuka_url": TAASUKA,
            "he": "מי שלא עובד, או עובד במשרה חלקית, נרשם ומתייצב בשירות התעסוקה, וכך גם בן הזוג: הקצבה משפחתית",
            "fulltime_he": "מי שעובד 36 שעות בשבוע פטור מהתייצבות, לפי אישור הביטוח הלאומי",
            "refuse_he": "מי שסירב לעבודה מתאימה ששירות התעסוקה הציע לא יקבל קצבה בחודש הסירוב ובחודש שאחריו",
            "missed_he": "מי שלא התייצב באחד הימים שנקבעו לא יקבל קצבה באותו חודש, חוץ ממחלה עם אישור, אבל על קרוב מדרגה ראשונה ומילואים",
            "groups_he": [
                "היריון, מהשבוע ה-13", "הורה לילד עד גיל שנתיים (אחד ההורים)", "חולה שאינו מסוגל לעבוד מעל 30 יום (עד 6 חודשים)",
                "מטפל בבן משפחה חולה, 45 ימים רצופים לפחות", "שיקום מקצועי או אולפן", "שהות במקלט לנשים נפגעות אלימות מעל 30 יום",
                "דר רחוב שהוכר", "גמילה מסמים או מאלכוהול", "הכשרה מקצועית מטעם שירות התעסוקה", "מי שהגיע לגיל הפרישה",
            ],
        },
        # סעיף 3: אין זכאות למי שבמוסד על חשבון המדינה, בשירות סדיר ואשתו, חבר בתאגיד שאחראי לכלכלת חבריו (קיבוץ, מושב שיתופי),
        # תלמיד במוסד שנקבע (ישיבה, השכלה גבוהה); הורה עצמאי לומד: 16 מתוך 20 חודשים, עד 36 חודשים, לא לתואר שני או שלישי.
        "exclusions": {
            "section": "סעיף 3", "url": ELIGIBILITY, "study_url": STUDY,
            "student_he": "מי שלומד במוסד להשכלה גבוהה לא זכאי, חוץ מהכשרה מקצועית של שירות התעסוקה",
            "parent_study_he": "הורה עצמאי יכול ללמוד (לא לתואר שני או שלישי) ולהמשיך לקבל קצבה עד 36 חודשים, אם קיבל הבטחת הכנסה או דמי מזונות ב-16 מתוך 20 החודשים שלפני תחילת הלימודים",
            "parent_study": {"months": 16, "of": 20, "max_months": 36},
            "yeshiva_he": "תלמיד ישיבה אינו זכאי", "kibbutz_he": "חבר קיבוץ או מושב שיתופי אינו זכאי",
            "army_he": "מי שמשרת, או שבן הזוג משרת, שירות סדיר בצה\"ל אינו זכאי",
        },
        # סעיף 5(ז): אישה בטור ג' שמלאו לה 62 וטרם הגיעה לגיל הפרישה: 7.95% מהסכום הבסיסי, לפי שנת הלידה; דף הסכום: 825 ש"ח.
        "women": {
            "pct": 7.95, "amount": supplement, "from_age": 62, "born_from": 1960, "born_to": 1964,
            "months": {"1960": 4, "1961": 8, "1962": 12, "1963": 15, "1964": 18}, "section": "סעיף 5(ז)", "url": AMOUNTS,
            "he": "אישה שנולדה מ-1.1.1960 עד 31.12.1964 מקבלת תוספת של 825 ש\"ח מהחודש שבו מלאו לה 62 ועד גיל הפרישה",
        },
        # דף הסכום: ניכויים מהקצבה.
        "deductions": {
            "health": 123, "spouse_away": _round(F(b3) * F("7.5") / 100), "spouse_away_pct": 7.5, "section": "סעיף 6(ד)", "url": AMOUNTS,
            "health_he": "מי שלא עובד: מהקצבה מנוכים דמי ביטוח בריאות מינימליים, 123 ש\"ח",
            "spouse_away_he": "בן זוג במוסד על חשבון המדינה או שאינו תושב ישראל: מהקצבה מופחתים 779 ש\"ח",
        },
        # סעיף 8: גמלה של פחות מ-6 ש"ח לא משולמת (אלא למי שמקבל קצבה לפי חוק הביטוח).
        "min_pay": 6, "min_pay_section": "סעיף 8",
        # סעיף 14(א); דף התביעה ודף התקופה: מהחודש שבו הוגשה התביעה, בלי רטרואקטיבי, חוץ מחודש אחד אחורה לדורש עבודה, הכשרה
        # מקצועית ועובד בשכר נמוך; התשלום ב-12 לחודש עבור החודש הקודם; שינויים בתוך 30 יום; שימוע 45 ימים; ערעור 12 חודשים.
        "clock": {
            "from_claim_month": True, "section": "סעיף 14(א)", "url": PERIOD, "claim_url": CLAIM,
            "retro_he": "קצבה משולמת מהחודש שבו הוגשה התביעה, בלי תשלום רטרואקטיבי; דורש עבודה שהתייצב, מי שבהכשרה מקצועית ועובד בשכר נמוך יכולים לקבל גם בעד החודש שלפני, אם התקיימו בו כל התנאים",
            "pay_day": 12, "pay_he": "הקצבה משולמת ב-12 בכל חודש עבור החודש הקודם, חוץ מהתשלום הראשון; בחגים המועד עשוי לזוז",
            "pay_example": "2026-10-12", "pay_url": PAY_DATES,
            "full_month_he": "הקצבה משולמת עבור חודש מלא: מי שהתחיל להתייצב באמצע החודש מקבל עליו רק כשיש סיבה מוצדקת לפטור",
            "changes_days": 30, "changes_url": CHANGES,
            "changes_he": "על כל שינוי בהכנסות שלכם או של בן הזוג, במצב המשפחתי או בכתובת מודיעים בתוך 30 יום",
            "hearing_days": 45, "hearing_url": HEARING,
            "hearing_he": "לפני הפסקת קצבה בגלל ידוע בציבור או שימוש קבוע ברכב נשלחת הודעה, והקצבה ממשיכה; יש 45 ימים להציג עמדה בכתב או בסניף",
            "appeal_months": 12, "appeal_alimony_months": 6, "appeal_url": APPEAL,
            "appeal_he": "על החלטת הביטוח הלאומי מגישים ערעור לבית הדין האזורי לעבודה בתוך 12 חודשים מהיום שבו נמסרה ההחלטה; אפשר לבקש סיוע משפטי חינם",
        },
        # דף טופס 5619: תביעה מקוונת או ידנית; מקבלי אזרח ותיק או שאירים ממלאים טופס 430.
        "claim": {
            "form": "5619", "form_url": FORM_PAGE, "online_url": FORM_ONLINE, "pdf_url": FORM_PDF, "url": CLAIM,
            "old_age_form": "430",
            "docs_he": [
                "טופס התביעה 5619, מקוון או ידני; אפשר להגיש קודם ולשלוח מסמכים אחר כך, כדי לא לאבד את החודש",
                "אישור התייצבות משירות התעסוקה (הוא מגיע לביטוח הלאומי ישירות), או המסמך של קבוצת הפטור",
                "תלושי שכר או אישור מעסיק על היקף המשרה והתשלומים החד-פעמיים, ושל בן הזוג",
                "אישורים על הכנסות שלא מעבודה: פנסיה, מזונות, שכר דירה, חסכונות",
                "רישיון הרכב, ואם יש חריג: אישור רפואי או אישור ניידות",
            ],
        },
        # תוספת רביעית (סעיף 30א) ודף המקבלים מ-2002: מי שקיבל קצבה בדצמבר 2002 ברציפות מקבל לפי טבלה אחרת.
        "since_2002": {"url": SINCE_2002, "section": "סעיף 30א והתוספת הרביעית",
                       "he": "מי שקיבל קצבה בדצמבר 2002 וממשיך ברציפות (בלי הפסקה של 6 חודשים) מקבל לפי טבלה אחרת"},
        "related": {"url": RELATED, "he": "משפחה חד-הורית או עם 4 ילדים ומעלה שמקבלת הבטחת הכנסה מקבלת מענק לימודים בתחילת שנת הלימודים, בעד ילדים מגיל 6 עד 18"},
        # The years before 2026 (the 2026 row is rights_btl's own basic amount 3 and income-support point).
        "history": HISTORY, "history_url": btl["basic_amount"]["url"],
    }
