"""The general-disability-pension dataset of the co.il tools registry (the rights wave, 21.10.2026): the kitzbat-nechut
instrument on /general-disability-pension-2026/. Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES) through KEY and
build().

Every value was read on checked_on from the official text named next to it: the National Insurance Institute's general
disability pages (eligibility, the 2026 amounts, the payment, working while receiving the pension and its four tables by
degree, the claim, the medical percentage, the degree of incapacity, the medical committee, the appeals, the re-examination,
the fast track, the homemaker pages) and the National Insurance Law [Consolidated Version], 1995, in the Institute's own
consolidated text (btl.gov.il/Laws1): chapter 9 (sections 195-222), chapter 14 (section 296) and the schedules (schedule 8.1,
schedule 9).

The amounts derive from rights_btl. Section 200(b): the full single pension is 25% of the basic amount (basic amount 4,
11,352 from 1.1.2026, "for the general disability pension and the benefits derived from it"), 2,838; section 200(a): the full
monthly pension is 107% + 20.6% + 21.40% + 17% of it = 41.5% of the basic amount = 4,711.08, which the Institute pays as
4,711; section 201(a): a partial degree d pays d x (107% + 17%) + 21.40% of 2,838 (3,211.48, 2,894.76 and 2,718.80 for 74%,
65% and 60%: paid 3,211, 2,894, 2,718); section 200(c)-(d): a spouse 12.5% and each of the first two children 10% of the
basic amount, raised by 7% (1,518.33 and 1,214.66: paid 1,518 and 1,214), and a partial degree d times those (rounded to the
shekel: 1,123/898, 987/789, 911/728). build() derives every one of them from rights_btl and stops if the derivation does not
give the Institute's published 2026 table, so a new basic amount is never trusted without a check. The work-income
thresholds are percentages of the average wage of section 2 (13,769 from 1.1.2026, rights_btl): 21% = 2,891.49 (s.201(b),
"more than 2,891"), 50.23% = 6,916.17, 68% = 9,362.92, 93% = 12,805.17 (schedule 8.1; "up to 6,916"), 60% = 8,261.40
(s.195, "lower than 8,261"), 57% = 7,848.33 (schedule 9, "up to 7,848"), 11.37% = 1,565.54 (s.202(b)(3), "1,566"); the
minimum of s.202(c) is 2.68% of the basic amount, 304.23. Nothing here is estimated; a figure the sources do not hold is not
in the file (see parts/kitzbat-nechut/notes.md).
"""
from __future__ import annotations

from fractions import Fraction as F
from math import ceil, floor

from justice_tools_rights import build_rights_btl

KEY = "rights_nechut"

BTL = "https://www.btl.gov.il/benefits/Disability/Pages/"
MAIN = BTL + "default.aspx"                                                                       # נכות כללית: דף הענף
CONDITIONS = BTL + ("%d7%94%d7%96%d7%9b%d7%90%d7%99%d7%9d%20%d7%9c%d7%a7%d7%a6%d7%91%d7%aa%20%d7%a0%d7%9b%d7%95%d7%aa%20"
                    "%d7%97%d7%95%d7%93%d7%a9%d7%99%d7%aa.aspx")                                      # תנאי זכאות
SUM = BTL + "%d7%a9%d7%99%d7%a2%d7%95%d7%a8%d7%99%20%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx"           # סכום הקצבה (2026)
PAY = BTL + "%d7%aa%d7%a9%d7%9c%d7%95%d7%9d%20%d7%94%d7%a7%d7%a6%d7%91%d7%94.aspx"                 # תשלום הקצבה
WORK = BTL + "laavod.aspx"                                                                        # לעבוד ולקבל קצבת נכות
WORK_100 = BTL + "100per.aspx"                                                                    # הטבלה לדרגה 100% או 75%
WORK_74 = BTL + "74Per.aspx"                                                                      # הטבלה לדרגה 74%
WORK_65 = BTL + "65Per.aspx"                                                                      # הטבלה לדרגה 65%
WORK_60 = BTL + "60Per.aspx"                                                                      # הטבלה לדרגה 60%
SUBMIT = BTL + "%d7%94%d7%92%d7%a9%d7%aa%20%d7%94%d7%aa%d7%91%d7%99%d7%a2%d7%94.aspx"               # אופן הגשת התביעה
MEDICAL = BTL + ("%d7%a7%d7%91%d7%99%d7%a2%d7%aa%20%d7%90%d7%97%d7%95%d7%96%20%d7%94%d7%a0%d7%9b%d7%95%d7%aa%20"
                 "%d7%94%d7%a8%d7%a4%d7%95%d7%90%d7%99%d7%aa.aspx")                                   # קביעת אחוז הנכות הרפואית
WEIGHTED = BTL + "chishuvDargatNehutMeshuklelet.aspx"                                              # מחשבון נכות משוקללת של המוסד
DEGREE = BTL + ("%d7%a7%d7%91%d7%99%d7%a2%d7%aa%20%d7%93%d7%a8%d7%92%d7%aa%20%d7%90%d7%99%e2%80%93%d7%94%d7%9b%d7%95%d7%a9%d7%a8"
                "%20%d7%9c%d7%94%d7%a9%d7%aa%d7%9b%d7%a8%20%d7%90%d7%95%20%d7%9c%d7%aa%d7%a4%d7%a7%d7%93%20%d7%91%d7%9e%d7%a9%d7%a7"
                "%20%d7%91%d7%99%d7%aa.aspx")                                                         # קביעת דרגת אי-הכושר
COMMITTEE = BTL + ("%d7%91%d7%93%d7%99%d7%a7%d7%94%20%d7%a2%d7%9c%20%d7%99%d7%93%d7%99%20%d7%95%d7%a2%d7%93%d7%94%20"
                   "%d7%a8%d7%a4%d7%95%d7%90%d7%99%d7%aa.aspx")                                       # בדיקה על ידי ועדה רפואית
PROCESS = BTL + "tipulBetvia.aspx"                                                                 # תהליך הטיפול בתביעה
APPEAL = BTL + ("%d7%a2%d7%a8%d7%a2%d7%95%d7%a8%20%d7%a2%d7%9c%20%d7%90%d7%97%d7%95%d7%96%20%d7%94%d7%a0%d7%9b%d7%95%d7%aa%20"
                "%d7%94%d7%a8%d7%a4%d7%95%d7%90%d7%99%d7%aa%20%d7%93%d7%a8%d7%92%d7%aa%20%d7%90%d7%99%20%d7%94%d7%9b%d7%95%d7%a9"
                "%d7%a8%20%d7%90%d7%97%d7%a8.aspx")                                                   # ערעור על אחוז הנכות / הדרגה
RECHECK = BTL + ("%d7%91%d7%a7%d7%a9%d7%94%20%d7%9c%d7%a7%d7%91%d7%99%d7%a2%d7%94%20%d7%9e%d7%97%d7%93%d7%a9%20%d7%a9%d7%9c%20"
                 "%d7%90%d7%97%d7%95%d7%96%20%d7%94%d7%a0%d7%9b%d7%95%d7%aa%20%d7%94%d7%a8%d7%a4%d7%95%d7%90%d7%99%d7%aa.aspx")  # בדיקה מחדש
FAST = BTL + "MaslulYarok.aspx"                                                                    # מסלול מהיר
CHANGES = BTL + "hodaaAlShinuim.aspx"                                                              # הודעה על שינויים
FEE = BTL + "scharTircha.aspx"                                                                     # הגבלת שכר הטרחה של מייצגים
TRANSFER = BTL + "kitzbaAchret.aspx"                                                               # מעבר לקצבה אחרת (אזרח ותיק)
HOMEMAKER = "https://www.btl.gov.il/Audience/akeretBayit/akeretBayitNeja/Pages/"
HOMEMAKER_MAIN = HOMEMAKER + "default.aspx"                                                        # קצבת נכות לעקרת בית
HOMEMAKER_CONDITIONS = HOMEMAKER + "tnaiZakaut.aspx"                                               # תנאי הזכאות (50% רפואית)
HOMEMAKER_SUM = HOMEMAKER + "shiuureHakitzba.aspx"                                                 # סכומי הקצבה לעקרת בית
CALCULATOR = "https://www.btl.gov.il/Simulators/NehutIndex/Pages/Calculator.aspx"                  # מחשבון סכום קצבת נכות של המוסד
DOCS_CALCULATOR = "https://www.btl.gov.il/Simulators/NehutIndex/Pages/TviaDocs.aspx"              # מחשבון המסמכים הרפואיים לתביעה
CLAIM_FORM = "https://govforms.gov.il/mw/forms/T7801@btl.gov.il"                                  # תביעה לקצבת נכות (7801), מקוון
CLAIM_PDF = ("https://www.btl.gov.il/%d7%98%d7%a4%d7%a1%d7%99%d7%9d%20%d7%95%d7%90%d7%99%d7%a9%d7%95%d7%a8%d7%99%d7%9d"
             "/Documents/t7801.pdf")                                                               # טופס 7801 להדפסה
YAD = "https://www.btl.gov.il/snifim/Pages/yadMechavenet1.aspx"                                   # יד מכוונת: הכנה לוועדות, חינם
INCOME_SUPPORT = "https://www.btl.gov.il/benefits/Income_support/Pages/default.aspx"              # הבטחת הכנסה
LAW = "https://www.btl.gov.il/Laws1/00_0001_000009.pdf"                                           # חוק הביטוח הלאומי, פרק ט': ביטוח נכות (195-222)
LAW_GENERAL = "https://www.btl.gov.il/Laws1/00_0001_000014.pdf"                                   # פרק י"ד: גמלאות, הוראות כלליות (296)
SCHEDULES = "https://www.btl.gov.il/Laws1/00_0001_000020.pdf"                                     # הלוחות (לוח ח1, לוח ט)

# The Institute's 2026 table (SUM, "החל מ-01.01.2026"), by degree: the monthly pension, the addition for each of the first
# two children, the addition for a spouse. build() checks that the law's percentages of rights_btl give exactly these.
PUBLISHED = {
    "100": {"pension": 4711, "child": 1214, "spouse": 1518},
    "74": {"pension": 3211, "child": 898, "spouse": 1123},
    "65": {"pension": 2894, "child": 789, "spouse": 987},
    "60": {"pension": 2718, "child": 728, "spouse": 911},
}
# The Institute's other 2026 figures, each derived from the average wage of section 2 below.
PUBLISHED_WORK = {"full_add_from": 2891, "free_upto": 6916, "new_claim_max": 8261, "spouse_income_max": 7848, "disregard": 1566}
# The upper wage of the flat row ("2,892 - X") on the Institute's tables for 74%, 65% and 60%.
PUBLISHED_CROSSOVER = {"74": 11278, "65": 12071, "60": 12511}

COMPONENTS = [  # section 200(a): percentages of the full single pension (25% of the basic amount, s.200(b))
    {"pct": "107", "section": "סעיף 200(א)(1)", "partial": "degree", "he": "הקצבה הבסיסית"},
    {"pct": "20.6", "section": "סעיף 200(א)(2)", "partial": "none",
     "he": "מה שהיה הקצבה החודשית הנוספת: סעיף 200א בוטל בתיקון 200 (1.3.2018) ונכלל כאן; רק בדרגה מלאה"},
    {"pct": "21.40", "section": "סעיף 200(א)(3)", "partial": "whole", "he": "תוספת מתיקון 200 (1.3.2018), שמשולמת במלואה גם בדרגה חלקית"},
    {"pct": "17", "section": "סעיף 200(א)(4)(א)", "partial": "degree", "he": "תוספת מתיקון 227 (1.1.2022)"},
]
TIERS = [  # schedule 8.1 (s.202(b)(2)): the deduction from the full monthly pension by the parts of the work income
    {"to_pct": "50.23", "rate": 0, "he": "עד 50.23% מהשכר הממוצע"},
    {"to_pct": "68", "rate": 30, "he": "מעל 50.23% ועד 68%"},
    {"to_pct": "93", "rate": 40, "he": "מעל 68% ועד 93%"},
    {"to_pct": None, "rate": 60, "he": "מעל 93% מהשכר הממוצע"},
]


def _half_up(x: F) -> int:
    return floor(x + F(1, 2))


def _derive(b4: int, avg: int) -> tuple[dict, dict, dict]:
    """The 2026 amounts and thresholds from the basic amount and the average wage, by the law's percentages. The Institute
    pays whole shekels: the pensions and the full additions are the whole part of the exact amount; a partial degree's
    addition is the degree times the whole full addition, to the nearest shekel (every cell of the published table fits)."""
    unit = F(b4) * F(25, 100)
    pct = {c["section"]: F(c["pct"]) / 100 for c in COMPONENTS}
    whole = pct["סעיף 200(א)(3)"]
    by_degree = pct["סעיף 200(א)(1)"] + pct["סעיף 200(א)(4)(א)"]
    spouse = floor(F(b4) * F(125, 1000) * F(107, 100))
    child = floor(F(b4) * F(10, 100) * F(107, 100))
    out = {"100": {"pension": floor(unit * sum(pct.values())), "child": child, "spouse": spouse}}
    for d in ("74", "65", "60"):
        k = F(int(d), 100)
        out[d] = {"pension": floor(unit * (k * by_degree + whole)), "child": _half_up(k * child), "spouse": _half_up(k * spouse)}
    work = {
        "full_add_from": floor(F(avg) * F(21, 100)),
        "free_upto": floor(F(avg) * F("50.23") / 100),
        "new_claim_max": floor(F(avg) * F(60, 100)),
        "spouse_income_max": floor(F(avg) * F(57, 100)),
        "disregard": _half_up(F(avg) * F("11.37") / 100),
    }
    t2 = F(avg) * F(68, 100)
    t1 = F(avg) * F("50.23") / 100
    cross = {}
    for d in ("74", "65", "60"):
        gap = out["100"]["pension"] - out[d]["pension"]          # the deduction at which the full pension minus it = the partial
        done = (t2 - t1) * F(30, 100)
        cross[d] = ceil(t2 + (gap - done) / F(40, 100))          # inside the 40% part for all three degrees in 2026
    return out, work, cross


def build(checked_on: str) -> dict:
    """The general disability pension for 2026: who is eligible, the amount by degree, the additions for a spouse and children,
    the work-income model of the law to integrate disabled people into work, the clock (90 days, 12 months back, 60 days to
    appeal) and the claim, each with the section of the law or the Institute's page it was read from."""
    btl = build_rights_btl(checked_on)
    b4 = btl["basic_amount"]["b4"]
    avg = btl["avg_wage"]["s2_benefits"]
    amounts, work, cross = _derive(b4, avg)
    if amounts != PUBLISHED or work != PUBLISHED_WORK or cross != PUBLISHED_CROSSOVER:
        raise ValueError(f"rights_nechut: the law's percentages of rights_btl no longer give the Institute's table: "
                         f"{amounts} {work} {cross}; re-read {SUM} and {WORK}")
    return {
        "name_he": "קצבת נכות כללית לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי, ענף נכות כללית",
        "source_name": "המוסד לביטוח לאומי: נכות כללית (תנאי זכאות, סכום הקצבה, לעבוד ולקבל קצבת נכות, תשלום, ערעור); חוק הביטוח הלאומי, פרק ט'",
        "source_url": SUM,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, פרק ט': ביטוח נכות",
        "law_url": LAW,
        "general_law_url": LAW_GENERAL,
        "schedules_url": SCHEDULES,
        "pages": {
            "main": MAIN, "conditions": CONDITIONS, "sum": SUM, "pay": PAY, "work": WORK, "submit": SUBMIT, "medical": MEDICAL,
            "weighted": WEIGHTED, "degree": DEGREE, "committee": COMMITTEE, "process": PROCESS, "appeal": APPEAL,
            "recheck": RECHECK, "fast": FAST, "changes": CHANGES, "fee": FEE, "transfer": TRANSFER,
            "homemaker": HOMEMAKER_MAIN, "homemaker_conditions": HOMEMAKER_CONDITIONS, "homemaker_sum": HOMEMAKER_SUM,
            "calculator": CALCULATOR, "docs_calculator": DOCS_CALCULATOR, "income_support": INCOME_SUPPORT,
        },
        # סעיף 195, הגדרת "מבוטח": תושב ישראל שמלאו לו 18 וטרם הגיע לגיל הפרישה; דף הגשת התביעה: גברים 67, נשים 62 עד 65 לפי
        # תאריך הלידה (לוח א1), ואפשר להגיש תביעה עד 12 חודשים אחרי גיל הפרישה.
        "age": {
            "min": 18, "men_max": 67, "women_from": 62, "women_max": 65, "claim_after_months": 12,
            "section": "סעיף 195 (הגדרת \"מבוטח\")", "schedule": "לוח א1", "url": CONDITIONS, "submit_url": SUBMIT,
            "women_he": "גיל הפרישה לאישה הוא 62 עד 65, לפי חודש הלידה (לוח א1)",
            "over_he": "מגיל הפרישה אין קצבת נכות כללית חדשה; מי שכבר מקבל עובר לקצבת אזרח ותיק, ותביעה על התקופה שלפני גיל הפרישה אפשר להגיש עד 12 חודשים אחריו",
            "transfer_url": TRANSFER,
        },
        # סעיף 208(א): נכות רפואית של 60% לפחות, או 40% לפחות כשנקבעו 25% לפחות בשל ליקוי יחיד; עקרת בית: 50% (דף תנאי
        # הזכאות לעקרת בית). קביעת אחוז הנכות: חישוב משוקלל, לא חיבור (20% ועוד 10% מתוך 80% שנותרו = 28%).
        "medical": {
            "min": 60, "alt_min": 40, "single_min": 25, "section": "סעיף 208(א)", "url": CONDITIONS,
            "homemaker_min": 50, "homemaker_url": HOMEMAKER_CONDITIONS,
            "weighted_he": "כמה ליקויים: כל ליקוי נוסף מחושב מתוך מה שנותר, לא בחיבור. לדוגמה 20% ו-10%: 20% ועוד 10% מתוך 80% = 28%",
            "weighted_url": MEDICAL, "calculator_url": WEIGHTED,
            "filtered_he": "ליקויים שהתקנות קובעות שאינם משפיעים על הכושר להשתכר (\"ליקויים מנופים\") לא נכנסים לחישוב",
        },
        # סעיף 195, הגדרת "עקרת בית": מי שלא עבדה כשכירה או כעצמאית 12 חודשים רצופים או 24 חודשים מתוך 48 שלפני התביעה, ולא חיה
        # בנפרד מבן זוגה 24 חודשים; דף תנאי הזכאות לעקרת בית: נכות רפואית 50%, אובדן 50% מהכושר לתפקד במשק הבית.
        "homemaker": {
            "worked_months": 12, "worked_any_months": 24, "window_months": 48, "apart_months": 24,
            "section": "סעיף 195 (הגדרת \"עקרת בית\")", "url": HOMEMAKER_CONDITIONS, "main_url": HOMEMAKER_MAIN,
            "def_he": "אישה נשואה שלא עבדה כשכירה או כעצמאית 12 חודשים רצופים, או 24 חודשים מתוך 48 שלפני התביעה, ולא חיה בנפרד מבן הזוג 24 חודשים",
            "test_he": "נבדק הכושר לתפקד במשק הבית, במכון להערכה תפקודית",
            "worker_he": "מי שעבדה 12 חודשים רצופים, או 24 חודשים מתוך 48 שלפני התביעה, נבדקת ככל מבוטח, לפי הכושר להשתכר",
        },
        # סעיף 195, הגדרת "נכה" פסקה (2): אובדן של 50% לפחות מהכושר להשתכר; סעיף 209(א1): הדרגה 60%, 65%, 74% או 100%, ומעל 74%
        # נקבעת 100%; סעיף 210: דרגה זמנית לשנתיים לכל היותר; דף הסכום: "דרגה מלאה (100% או 75%)".
        "degree": {
            "min_loss": 50, "levels": [60, 65, 74, 100], "full_above": 74,
            "section": "סעיף 209(א1)", "loss_section": "סעיף 195 (הגדרת \"נכה\")", "temp_years": 2, "temp_section": "סעיף 210",
            "url": DEGREE,
            "he_75": "דרגה של 75% שנקבעה בעבר משולמת כדרגה מלאה",
        },
        # סעיפים 200 ו-201; דף סכום הקצבה, החל מ-1.1.2026 (נגזר מסכום בסיסי 4 שב-rights_btl, ראו למעלה).
        "pension": {
            "single_full_pct": 25, "single_full_section": "סעיף 200(ב)", "total_pct_of_basic": 41.5,
            "components": [{"pct": float(c["pct"]), "section": c["section"], "partial": c["partial"], "he": c["he"]} for c in COMPONENTS],
            "amounts": PUBLISHED,
            "section": "סעיף 200(א)", "partial_section": "סעיף 201(א)", "url": SUM,
            "basic_he": "סכום בסיסי 4, שממנו נגזרת קצבת הנכות הכללית",
        },
        # סעיף 200(ג)-(ד): בן זוג 12.5% וכל אחד משני הילדים הראשונים 10% מהסכום הבסיסי, בתוספת 7%; לוח ט פרט 1: הכנסת בן הזוג עד
        # 57% מהשכר הממוצע (7,848); דף הסכום: בן הזוג לא מקבל קצבה אחרת.
        "dependents": {
            "spouse_pct": 12.5, "child_pct": 10, "uplift_pct": 7, "section": "סעיף 200(ג)-(ד)", "children_max": 2,
            "spouse_income_pct": 57, "spouse_income_max": PUBLISHED_WORK["spouse_income_max"], "spouse_section": "לוח ט, פרט 1",
            "url": SUM,
            "spouse_he": "בן או בת זוג שהכנסתם עד 7,848 ש\"ח ברוטו בחודש ואינם מקבלים קצבה אחרת",
            "kids_he": "רק שני הילדים הראשונים: עד גיל 18, או עד 24 בשירות צבאי או לאומי, או שעונים להגדרת ילד",
            "homemaker_he": "עקרת בית נכה מקבלת תוספת רק בעד ילדיה, לא בעד בן זוג",
            "homemaker_url": HOMEMAKER_SUM,
        },
        # חוק השילוב בעבודה (תיקון 109, "חוק לרון") בנוסחו מתיקון 187 (1.1.2017): סעיף 202(ב)(2) ולוח ח1; סעיף 201(ב); סעיף 202(ג);
        # סעיף 209(ד); דף "לעבוד ולקבל קצבת נכות" וארבע הטבלאות לפי דרגה, החל מ-1.1.2026.
        "work": {
            "new_claim_pct": 60, "new_claim_max": PUBLISHED_WORK["new_claim_max"], "new_claim_days": 90, "new_claim_window_months": 15,
            "new_claim_section": "סעיף 195 (הגדרת \"נכה\"), פסקה (3)", "new_claim_url": CONDITIONS,
            "full_add_pct": 21, "full_add_from": PUBLISHED_WORK["full_add_from"], "full_add_section": "סעיף 201(ב)",
            "tiers": [{"to_pct": float(t["to_pct"]) if t["to_pct"] else None, "rate": t["rate"], "he": t["he"]} for t in TIERS],
            "tiers_section": "סעיף 202(ב)(2); לוח ח1", "free_upto": PUBLISHED_WORK["free_upto"], "crossover": PUBLISHED_CROSSOVER,
            "min_pct_of_basic": 2.68, "min_section": "סעיף 202(ג)",
            "protect_section": "סעיף 209(ד)",
            "protect_he": "דרגת אי-הכושר נשארת גם כשעובדים; מי שהקצבה שלו נפסקה רק בגלל הכנסה מעבודה, וההכנסה ירדה מתחת ל-8,261 ש\"ח, חוזר לקצבה בלי ועדה רפואית, כל עוד הדרגה בתוקף",
            "benefits_months": 36,
            "benefits_he": "מי שהפסיק לקבל קצבה רק בגלל הכנסה גבוהה זכאי להטבות הנלוות עוד 36 חודשים",
            "income_he": "ההכנסה ברוטו מעבודה כשכיר או כעצמאי, כולל תשלומים נוספים כמו הבראה, ביגוד ובונוסים",
            "avg_wage_he": "השכר הממוצע לפי סעיף 2 לחוק",
            "url": WORK, "tables": {"100": WORK_100, "74": WORK_74, "65": WORK_65, "60": WORK_60},
        },
        # סעיף 202(ב)(3): הכנסה שלא מעבודה מנוכה מההפרש בין הקצבה המשולמת לקצבה החודשית המלאה, אחרי 11.37% מהשכר הממוצע (1,566);
        # עקרת בית (דף הסכומים לעקרת בית): כל ההכנסה מנוכה מתוספת הילדים, ולא פחות מקצבה מלאה.
        "other_income": {
            "disregard_pct": 11.37, "disregard": PUBLISHED_WORK["disregard"], "section": "סעיף 202(ב)(3)", "url": SUM,
            "he": "הכנסה שלא מעבודה (פנסיה, שכר דירה, מלגה, קצבה אחרת) משפיעה רק כשהקצבה עם התוספות גבוהה מהקצבה המלאה: 1,566 ש\"ח ממנה לא נחשבים, והשאר מופחת, אבל לא מתחת לקצבה המלאה",
            "homemaker_he": "לעקרת בית: כל ההכנסה שלא מעבודה מופחתת מתוספת הילדים, ולא מתחת לקצבה המלאה",
            "homemaker_url": HOMEMAKER_SUM,
            "alimony_he": "מזונות שהאב משלם בעד הילדים לא מופחתים מתוספת הילדים; מזונות בעד האם נחשבים הכנסה שלא מעבודה",
        },
        # סעיף 196(ב): הזכות מתחילה בתום 90 ימים מהתאריך הקובע (דף התשלום: "מהיום ה-91", לדוגמה 1.1.2020 -> 1.4.2020);
        # סעיף 196(ג): דרגה 100% לשישה חודשים לפחות, קצבה מלאה בעד הימים 31 עד 90; סעיף 195: התאריך הקובע לא יקדם ל-15 החודשים
        # שלפני הגשת התביעה; סעיף 207(א): התביעה נדונה בתום 90 ימים; סעיף 296(ב)(1): לכל היותר 12 חודשים שלפני חודש ההגשה;
        # דף התשלום: ב-28 בכל חודש עבור אותו חודש.
        "clock": {
            "wait_days": 90, "start_section": "סעיף 196(ב)",
            "early_from_day": 31, "early_to_day": 90, "early_min_months": 6, "early_section": "סעיף 196(ג)",
            "det_back_months": 15, "det_section": "סעיף 195 (הגדרת \"התאריך הקובע\")",
            "consider_days": 90, "consider_section": "סעיף 207(א)",
            "retro_months": 12, "retro_section": "סעיף 296(ב)(1)",
            "pay_day": 28, "url": PAY,
            "pay_he": "קצבת הנכות משולמת ב-28 בכל חודש עבור אותו חודש; בחגים המועד עשוי לזוז",
            "early_he": "מי שנקבעה לו דרגה 100% לשישה חודשים לפחות מקבל קצבה מלאה כבר מהיום ה-31, עם התוספות לבן הזוג ולילדים",
        },
        # דף הערעור: ועדה רפואית לעררים (אחוזי נכות) וועדה לעררים (דרגה) בתוך 60 ימים מקבלת ההודעה; משם לבית הדין האזורי לעבודה
        # בשאלה משפטית בלבד בתוך 60 ימים (סעיף 213); החלטות אחרות של פקיד התביעות: לבית הדין בתוך 12 חודשים.
        "appeal": {
            "days": 60, "court_days": 60, "other_court_months": 12, "url": APPEAL,
            "section": "סעיף 211", "court_section": "סעיף 213",
            "medical_he": "על אחוזי הנכות הרפואית (מי שנקבעו לו פחות מ-80%, או דרגה של 74% ומטה): ערר בכתב ומנומק לוועדה רפואית לעררים, דרך הסניף, בתוך 60 ימים מקבלת ההודעה",
            "degree_he": "על דרגת אי-הכושר (נדחה, או נקבעה דרגה של 74% ומטה): ערר לוועדה לעררים, בתוך 60 ימים מקבלת ההודעה",
            "court_he": "על החלטת ועדת העררים: ערעור לבית הדין האזורי לעבודה, בשאלה משפטית בלבד, בתוך 60 ימים מקבלת ההחלטה",
            "other_he": "על החלטה אחרת של פקיד התביעות (הכנסות, תקופות עבודה, גיל): תביעה לבית הדין האזורי לעבודה בתוך 12 חודשים מקבלת ההודעה",
            "lower_he": "ועדת העררים יכולה גם להוריד; כשהיא שוקלת להוריד היא מודיעה, ולעיתים אפשר לבטל את הערר",
            "rest_he": "מועד שחל בשבת או בחג נדחה ליום שאחריו (חוק הפרשנות, סעיף 10(ג))",
        },
        # דף הבדיקה מחדש: אחרי 6 חודשים מהקביעה האחרונה, כשהתביעה נדחתה או נקבעה דרגה חלקית; אחוזים רפואיים בלבד בהחמרה: דרגה 75%
        # או 100%, אחרי 12 חודשים; המוסד רשאי גם להפחית.
        "recheck": {
            "months": 6, "medical_months": 12, "url": RECHECK,
            "he": "בדיקה מחדש אפשר לבקש 6 חודשים אחרי הקביעה האחרונה, אם התביעה נדחתה או נקבעה דרגה חלקית; גם אז המוסד רשאי להפחית",
            "income_he": "מי שנדחה בגלל הכנסות גבוהות והכנסותיו ירדו מגיש תביעה חוזרת בלי המתנה",
        },
        # דף ההודעה על שינויים: בתוך 30 יום.
        "changes": {"days": 30, "url": CHANGES,
                    "he": "על כל שינוי בהכנסות (שלכם או של בן הזוג), במצב המשפחתי או בכתובת מודיעים בתוך 30 יום, עם תלוש שכר או אישור על הפסקת עבודה"},
        # דף הגשת התביעה: טופס 7801, מקוון או בטלפון *3928; המסמכים; מסלול מהיר (30 יום); יד מכוונת (חינם, *2496).
        "claim": {
            "form": "7801", "form_url": CLAIM_FORM, "pdf_url": CLAIM_PDF, "phone": "*3928", "url": SUBMIT,
            "docs_calculator_url": DOCS_CALCULATOR,
            "docs_he": [
                "טופס התביעה 7801, מקוון באתר הממשלתי או בטלפון *3928",
                "מסמכים רפואיים: סיכומי מחלה, המחלות הכרוניות, הטיפולים והתרופות (מחשבון המסמכים של המוסד מפרט לפי אבחנה)",
                "שכירים: 15 תלושי השכר האחרונים, או אישור המעסיק על תקופת העבודה והשכר (בטופס התביעה)",
                "פירוט דמי מחלה מהמעסיק, או תשלום מחברת ביטוח, בעד התקופות שבהן לא עבדתם ב-15 החודשים האחרונים",
                "עצמאים: הצהרה במחלקת הביטוח והגבייה על השינויים בעבודה ובהכנסות, והשומות האחרונות",
                "הכנסות שלא מעבודה ב-15 החודשים האחרונים: פנסיה, תשלומים מחברת ביטוח, מזונות, הכנסה מרכוש",
                "מי שמגיש בשם אחר: ייפוי כוח, צו אפוטרופוס או פסק דין (סעיף 4 בטופס)",
            ],
            "fast_days": 30, "fast_url": FAST,
            "fast_he": "מחלה ממארת בטיפול פעיל, ALS, ליקוי נפשי של 50% ומעלה, השתלה בשנה האחרונה ומחלות קשות בטיפול פעיל: מסלול מהיר, המוסד משתדל לסיים בתוך 30 ימים",
            "prep_he": "ייעוץ והכנה לוועדה הרפואית, חינם, במרכזי יד מכוונת (*2496)", "prep_url": YAD,
            "committee_he": [
                "להביא תעודה מזהה עם תמונה; בלעדיה לא נבדקים",
                "לפרט את כל התלונות של היום, גם קושי בעבודה ועזרה ברחצה, בלבוש, באכילה ובניידות; אפשר להגיש מסמך כתוב, והוא מצורף לדוח",
                "להביא מסמכים רפואיים חדשים שאינם בתיק, וצילום שלהם להשאיר בוועדה",
                "מותר להביא מלווה, מתרגם או עורך דין, ולבקש שהמלווה יהיה בבדיקה",
                "רופא שמכיר אתכם אישית או מטפל בכם לא יכול לשבת בוועדה: מודיעים על כך",
            ],
            "committee_url": COMMITTEE,
            "income_support_he": "מי שאין לו או למשפחתו הכנסה בודק זכאות להבטחת הכנסה עד שתתקבל קצבת הנכות",
            "income_support_url": INCOME_SUPPORT,
        },
        "fee_url": FEE,
        "calculator_url": CALCULATOR,
    }
