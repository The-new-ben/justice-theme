"""The old-age dataset of the co.il tools registry (the rights wave 2B, 22.10.2026, HAD-585): the kitzbat-zikna instrument on
/elder-law-israel/. Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES) through KEY and build().

Every value was read on checked_on from the official text named next to it: the National Insurance Institute's old-age
pages (the conditions, the retirement age and the eligibility age, the qualifying period for a man and for a woman, the
income test with work income, other income and both, the partial pension, the amounts by family, the seniority, deferral
and dependants' increments, the deductions, the definitions of a spouse and a child, the income supplement, the transition
grant for women born 1960-1966, the claim, the payment, the special benefit for new immigrants, the appeal), chapter 11 of
the National Insurance Law (ss.238-251, 269א), its tables (table א1: the retirement age and the women's eligibility age by
birth month; tables ט and ט1: the maximum income) and chapter 1 (the definition of the retirement age), all in the
Institute's own consolidated text (btl.gov.il/Laws1), the Retirement Age Law, 2004 (its schedule, part ב, for women born
1956-1969, on nevo.co.il), and the Penal Law s.368ו (assault of an elderly person, nevo.co.il).

The amounts derive from rights_btl. The law's "basic amount" (s.1) for the old-age pension is basic amount 3 of the
Institute's table (10,382 from 1.1.2026): s.244(א) gives the pension as 17.7% of it (1,837.61 -> 1,838), s.247א 18.7% from
80 (1,941.43 -> 1,941), s.244(ב) 8.9% for a dependent spouse (924.00) and 5.6% for each of the first two children
(581.39 -> 581). Table ט1 gives the maximum income of s.245 as a share of the average wage of section 2 (13,769): 73.45%
without dependants (10,113.33 -> 10,113), 97.93% with one (13,483.98 -> 13,484), 7% more for each further one (963.83 ->
964); table ט item 1, 57% (7,848.33 -> 7,848), is the spouse's income limit of s.247; s.269א(א)(3) sets the transition
grant's determining amount at 73.5% (10,120.22 -> 10,120). build() derives every one of them and stops if the derivation
does not give the Institute's published 2026 figure, so a new basic amount or average wage is never trusted without a check.
Nothing here is estimated; a figure the sources do not hold is not in the file (see parts/kitzbat-zikna/notes.md).
"""
from __future__ import annotations

from fractions import Fraction as F
from math import floor

from justice_tools_rights import build_rights_btl

KEY = "rights_zikna"

BTL = "https://www.btl.gov.il/benefits/old_age/"
MAIN = BTL + "Pages/default.aspx"                                                                      # אזרח ותיק: דף הענף
CONDITIONS = BTL + "Conditions_of_eligibility/Pages/default.aspx"                                      # חמשת תנאי הזכאות
AGES = BTL + "Conditions_of_eligibility/gilMezake/Pages/default.aspx"                                  # הגיל המזכה
RETIREMENT = BTL + "Conditions_of_eligibility/gilMezake/Pages/gilPrisha.aspx"                          # גיל הפרישה (טבלה)
ELIGIBILITY_AGE = BTL + "Conditions_of_eligibility/gilMezake/Pages/gilZakaut.aspx"                     # גיל הזכאות: 70
INSURED_MAN = BTL + "Conditions_of_eligibility/mevutach/Pages/geverMevuta.aspx"                       # גבר מבוטח
INSURED_WOMAN = BTL + ("Conditions_of_eligibility/mevutach/Pages/"
                       "%D7%90%D7%99%D7%A9%D7%94%D7%9E%D7%91%D7%95%D7%98%D7%97%D7%AA.aspx")            # אישה מבוטחת
ACHSHARA_MAN = BTL + ("Conditions_of_eligibility/achshara/Pages/"
                      "%D7%AA%D7%A7%D7%95%D7%A4%D7%AA%D7%90%D7%9B%D7%A9%D7%A8%D7%94%D7%9C%D7%92%D7%91%D7%A8.aspx")  # אכשרה לגבר
ACHSHARA_WOMAN = BTL + "Conditions_of_eligibility/achshara/Pages/achsharaIsha.aspx"                     # אכשרה לאישה
INCOME_TEST = BTL + ("Conditions_of_eligibility/Pages/"
                     "%D7%94%D7%9B%D7%A0%D7%A1%D7%95%D7%AA%20%D7%91%D7%92%D7%99%D7%9C%20%D7%94%D7%A4%D7%A8%D7%99%D7%A9%D7%94.aspx")  # מבחן הכנסות
INCOME_WORK = BTL + "Conditions_of_eligibility/Pages/hachnasotMewavoda.aspx"                           # הכנסות מעבודה בלבד
INCOME_OTHER = BTL + "Conditions_of_eligibility/Pages/hachnasotLoMewavoda.aspx"                        # הכנסות שלא מעבודה בלבד
INCOME_BOTH = BTL + "Conditions_of_eligibility/Pages/hachnasotGamVegam.aspx"                           # גם וגם
INCOME_EXTRA = BTL + "Conditions_of_eligibility/Pages/HacnasaZikna.aspx"                                # תשלום נוסף והפרשי שכר
PAID = BTL + ("Conditions_of_eligibility/Pages/"
              "%D7%A9%D7%95%D7%9C%D7%9E%D7%95%20%D7%91%D7%A2%D7%93%D7%9A%20%D7%93%D7%9E%D7%99%20%D7%91%D7%99%D7%98%D7%95%D7%97"
              "%20%D7%9B%D7%97%D7%95%D7%A7.aspx")                                                      # שולמו דמי ביטוח כחוק
PARTIAL = BTL + "Pages/%D7%A7%D7%A6%D7%91%D7%AA%20%D7%96%D7%A7%D7%A0%D7%94%20%D7%99%D7%97%D7%A1%D7%99%D7%AA.aspx"  # קצבה חלקית
AMOUNTS = BTL + "Shum/Pages/Shum.aspx"                                                                 # סכומי הקצבה לפי המשפחה
ADDITIONS = BTL + "Shum/Pages/Tosafot.aspx"                                                            # תוספות לקצבה
DEDUCTIONS = BTL + "Shum/Pages/Nicuyim.aspx"                                                           # ניכויים מהקצבה
SENIORITY = BTL + "Pages/tosefetVetek.aspx"                                                            # תוספת ותק
DEFERRAL = BTL + "Pages/t-dchiyatkitsba.aspx"                                                          # תוספת דחיית קצבה
DEPENDANTS = BTL + ("Pages/%D7%AA%D7%95%D7%A1%D7%A4%D7%AA%20%D7%91%D7%A2%D7%93%20%D7%91%D7%9F%20%D7%96%D7%95%D7%92"
                    "%20%D7%95%D7%99%D7%9C%D7%93%D7%99%D7%9D.aspx")                                     # תוספת עבור בן זוג וילדים
DEF_WIFE = BTL + "HaddarotZikna/Pages/BatZug.aspx"                                                     # הגדרת בת זוג
DEF_HUSBAND = BTL + "HaddarotZikna/Pages/BenZug.aspx"                                                  # הגדרת בן זוג
DEF_CHILD = BTL + "HaddarotZikna/Pages/HagdaratYeled.aspx"                                             # הגדרת ילד
SUPPLEMENT = BTL + "hashHachZ/Pages/default.aspx"                                                      # השלמת הכנסה
SUPPLEMENT_AMOUNTS = BTL + "hashHachZ/Pages/schumim.aspx"                                              # סכומי השלמת הכנסה
SUPPLEMENT_INCOME = BTL + "hashHachZ/Pages/HCNsOT.aspx"                                                # השפעת ההכנסות
GRANT = BTL + "MankMavrATR/Pages/default.aspx"                                                         # מענק מעבר
GRANT_CONDITIONS = BTL + "MankMavrATR/Pages/MankMavrTnaim.aspx"                                        # תנאי המענק
GRANT_AMOUNT = BTL + "MankMavrATR/Pages/ScomMankMavr.aspx"                                             # סכום המענק
GRANT_CLAIM = BTL + "MankMavrATR/Pages/BksaMankMavr.aspx"                                              # הגשת בקשה למענק
CLAIM = BTL + "Pages/%D7%90%D7%95%D7%A4%D7%9F%20%D7%94%D7%92%D7%A9%D7%AA%20%D7%94%D7%AA%D7%91%D7%99%D7%A2%D7%94.aspx"  # הגשת התביעה
PAYMENT = BTL + "Pages/%D7%9E%D7%95%D7%A2%D7%93%20%D7%94%D7%AA%D7%A9%D7%9C%D7%95%D7%9D.aspx"           # תשלום הקצבה
FROM_OTHER = BTL + ("Pages/%D7%9E%D7%A2%D7%91%D7%A8%20%D7%9E%D7%A7%D7%91%D7%9C%D7%AA%20%D7%A7%D7%A6%D7%91%D7%90%D7%95%D7%AA"
                    "%20%D7%90%D7%97%D7%A8%D7%95%D7%AA%20%D7%9C%D7%A7%D7%91%D7%9C%D7%AA%20%D7%A7%D7%A6%D7%91%D7%AA%20"
                    "%D7%96%D7%A7%D7%A0%D7%94.aspx")                                                    # מעבר מקצבאות אחרות
SPECIAL = BTL + "Pages/%d7%92%d7%9e%d7%9c%d7%aa%20%d7%96%d7%a7%d7%a0%d7%94%20%d7%9e%d7%99%d7%95%d7%97%d7%93%d7%aa.aspx"  # גמלה מיוחדת
CALCULATOR = BTL + "Pages/BdikatZacautZikna.aspx"                                                      # המחשבון של המוסד
APPEAL_BASE = ("https://www.btl.gov.il/benefits/%D7%A2%D7%A8%D7%A2%D7%95%D7%A8%20%D7%A2%D7%9C%20%D7%94%D7%97%D7%9C%D7%98%D7%95%D7%AA"
               "%20%D7%94%D7%9E%D7%95%D7%A1%D7%93%20%D7%9C%D7%91%D7%99%D7%98%D7%95%D7%97%20%D7%9C%D7%90%D7%95%D7%9E%D7%99/Pages/")
APPEAL = BTL + "Pages/erur.aspx"                                                                       # ערעור על החלטה
APPEAL_COMMITTEE = APPEAL_BASE + "vadatviot.aspx"                                                      # ועדת תביעות
APPEAL_COURT = APPEAL_BASE + ("%D7%91%D7%AA%D7%99%20%D7%94%D7%93%D7%99%D7%9F%20%D7%94%D7%90%D7%96%D7%95%D7%A8%D7%99%D7%99%D7%9D%20"
                              "%D7%9C%D7%A2%D7%91%D7%95%D7%93%D7%94.aspx")                              # בית הדין לעבודה
LEGAL_AID = APPEAL_BASE + "%D7%A1%D7%99%D7%95%D7%A2%20%D7%9E%D7%A9%D7%A4%D7%98%D7%99.aspx"              # סיוע משפטי
BASIC = ("https://www.btl.gov.il/Mediniyut/GeneralData/Pages/"
         "%d7%94%d7%a1%d7%9b%d7%95%d7%9d%20%d7%94%d7%91%d7%a1%d7%99%d7%a1%d7%99%20%d7%9c%d7%97%d7%99%d7%a9%d7%95%d7%91%20"
         "%d7%a7%d7%a6%d7%91%d7%90%d7%95%d7%aa.aspx")                                                    # הסכום הבסיסי
LAW = "https://www.btl.gov.il/Laws1/00_0001_000011.pdf"                    # חוק הביטוח הלאומי, פרק י"א (ss.238-269ג)
LAW_TABLES = "https://www.btl.gov.il/Laws1/00_0001_000020.pdf"             # לוחות החוק: א1, ט, ט1
LAW_GENERAL = "https://www.btl.gov.il/Laws1/00_0001_000001.pdf"            # פרק א': הגדרת "גיל הפרישה"
RETIREMENT_LAW = "https://www.nevo.co.il/law_html/law00/73761.htm"         # חוק גיל פרישה, התשס"ד-2004
PENAL_LAW = "https://www.nevo.co.il/law_html/law00/70301.htm"              # חוק העונשין: סעיף 368ו
SIM = ("https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=court_rehearsal"
       "&topic=general")                                                    # the rehearsal (catalog)

# Table א1, part א of the National Insurance Law (the definition of "גיל הפרישה" in s.1): men by month of birth; and for
# women born until December 1955; women born from 1956 take the Retirement Age Law (s.1(ב) of the definition), whose
# schedule, part ב, runs from 62 (born May 1947 to December 1959) to 64 and 9 months (born 1969); s.3 of that law: 65 from
# 1970. Rows: [from YYYY-MM or None, to YYYY-MM or None, years, months]. The Institute's own table (RETIREMENT) agrees.
MEN_RETIREMENT = [
    [None, "1939-06", 65, 0], ["1939-07", "1939-08", 65, 4], ["1939-09", "1940-04", 65, 8], ["1940-05", "1940-12", 66, 0],
    ["1941-01", "1941-08", 66, 4], ["1941-09", "1942-04", 66, 8], ["1942-05", None, 67, 0],
]
WOMEN_RETIREMENT = [
    [None, "1944-06", 60, 0], ["1944-07", "1944-08", 60, 4], ["1944-09", "1945-04", 60, 8], ["1945-05", "1945-12", 61, 0],
    ["1946-01", "1946-08", 61, 4], ["1946-09", "1947-04", 61, 8], ["1947-05", "1959-12", 62, 0],
    ["1960-01", "1960-12", 62, 4], ["1961-01", "1961-12", 62, 8], ["1962-01", "1962-12", 63, 0], ["1963-01", "1963-12", 63, 3],
    ["1964-01", "1964-12", 63, 6], ["1965-01", "1965-12", 63, 9], ["1966-01", "1966-12", 64, 0], ["1967-01", "1967-12", 64, 3],
    ["1968-01", "1968-12", 64, 6], ["1969-01", "1969-12", 64, 9], ["1970-01", None, 65, 0],
]
# Table א1, part ד (s.245(א)(2)): the women's old-age eligibility age by month of birth; 70 from May 1950. Men: 70 (s.245(א)(1)).
WOMEN_ELIGIBILITY = [
    [None, "1939-06", 65, 0], ["1939-07", "1939-08", 65, 4], ["1939-09", "1940-04", 65, 8], ["1940-05", "1940-12", 66, 0],
    ["1941-01", "1941-08", 66, 4], ["1941-09", "1942-04", 66, 8], ["1942-05", "1944-12", 67, 0], ["1945-01", "1945-08", 67, 4],
    ["1945-09", "1946-04", 67, 8], ["1946-05", "1946-12", 68, 0], ["1947-01", "1947-08", 68, 4], ["1947-09", "1948-04", 68, 8],
    ["1948-05", "1948-12", 69, 0], ["1949-01", "1949-08", 69, 4], ["1949-09", "1950-04", 69, 8], ["1950-05", None, 70, 0],
]
# The Institute's tables, "החל ב- 01.01.2026" (AMOUNTS, DEPENDANTS, INCOME_WORK, INCOME_OTHER, INCOME_BOTH, PARTIAL, DEF_WIFE,
# GRANT_CONDITIONS). build() checks that the law's percentages of rights_btl give exactly these.
PUBLISHED_AMOUNTS = {"single": 1838, "single80": 1941, "couple": 2762, "couple80": 2865, "single_child": 2419,
                     "couple_child": 3343, "single_children": 3000, "couple_children": 3924, "spouse": 924, "child": 581}
PUBLISHED_INCOME = {"single": 10113, "couple": 13484, "spouse_limit": 7848, "grant_det": 10120, "min_partial": 184,
                    "end_single": 14402, "end_couple": 20082, "seniority_max_example": 2757}
PUBLISHED_OTHER = {"single": [30339, 34627], "couple": [40452, 47050], "couple_pension": [40452, 44740]}
PUBLISHED_BOTH = {"single": [10113, 20226], "couple": [13484, 26968]}
# The percentages of the law (ss.244, 247א; tables ט and ט1; s.269א(א)(3)).
PCT = {"basic": "17.7", "basic80": "18.7", "spouse": "8.9", "child": "5.6"}
MAX_PCT = {"none": "73.45", "one": "97.93", "each": "7"}
# The supplement's 2026 table (SUPPLEMENT_AMOUNTS): the pension with the income supplement, by family and age band.
SUPPLEMENT_TABLE = {
    "to70": {"single": 4375, "couple": 6912, "single_child": 7305, "single_children": 8426, "couple_child": 8035, "couple_children": 9156},
    "to80": {"single": 4418, "couple": 6981, "single_child": 7374, "single_children": 8496, "couple_child": 8102, "couple_children": 9226},
    "from80": {"single": 4460, "couple": 7048, "single_child": 7442, "single_children": 8563, "couple_child": 8171, "couple_children": 9292},
}
# Basic amount 3 of the years before 2026, as the Institute's basic-amount page publishes them (2026 is in rights_btl).
HISTORY = [{"from": "2024-01-01", "b3": 9806, "change_pct": 3.3}, {"from": "2025-01-01", "b3": 10139, "change_pct": 3.4}]
# Table ט1 (s.245(ג)) since 1.1.2022 (amendment 228): 63.97% / 85.3% in 2022 only, then 73.45% / 97.93%; until 31.12.2021
# the maximum income was table ט (57% / 76%).
MAX_HISTORY = [
    {"from": "", "to": "2021-12-31", "none": 57, "one": 76, "each": 7, "table": "לוח ט'"},
    {"from": "2022-01-01", "to": "2022-12-31", "none": 63.97, "one": 85.3, "each": 7, "table": "לוח ט1 (הוראת תחולה)"},
    {"from": "2023-01-01", "to": "", "none": 73.45, "one": 97.93, "each": 7, "table": "לוח ט1"},
]


def _round(x: F) -> int:
    """To the nearest shekel, a half up (every published figure of the year fits)."""
    return floor(x + F(1, 2))


def _derive(b3: int, avg: int) -> tuple[dict, dict]:
    pct = {k: F(v) / 100 for k, v in PCT.items()}
    single = _round(b3 * pct["basic"])
    single80 = _round(b3 * pct["basic80"])
    spouse = _round(b3 * pct["spouse"])
    child = _round(b3 * pct["child"])
    amounts = {
        "single": single, "single80": single80, "couple": single + spouse, "couple80": single80 + spouse,
        "single_child": single + child, "couple_child": single + spouse + child, "single_children": single + 2 * child,
        "couple_children": single + spouse + 2 * child, "spouse": spouse, "child": child,
    }
    max_single = _round(F(avg) * F(MAX_PCT["none"]) / 100)
    max_couple = _round(F(avg) * F(MAX_PCT["one"]) / 100)
    top = single + single // 2  # the Institute's own example: the pension with the full 50% seniority increment
    min_partial = _round(F(single) / 10)
    # The pension ends where 60% of the income above the maximum leaves less than the minimum (s.245(ב)); the published
    # ceilings are that income for a pension with the full seniority increment, to the shekel (see notes.md).
    end_single = _round(F(avg) * F(MAX_PCT["none"]) / 100 + F(top - min_partial) / F("0.6"))
    couple_top = (single + spouse) * 3 // 2
    end_couple = _round(F(avg) * F(MAX_PCT["one"]) / 100 + F(couple_top - min_partial) / F("0.6"))
    income = {
        "single": max_single, "couple": max_couple, "spouse_limit": _round(F(avg) * 57 / 100),
        "grant_det": _round(F(avg) * F("73.5") / 100), "min_partial": min_partial, "end_single": end_single,
        "end_couple": end_couple, "seniority_max_example": top,
    }
    return amounts, income


def build(checked_on: str) -> dict:
    """The old-age pension for 2026: who is insured, the retirement age and the eligibility age by sex and month of birth,
    the qualifying period, the income test between them, the pension by family with the seniority, deferral and dependants'
    increments, the transition grant, the supplement, the claim, the payment and the appeal, each with the section of the law
    or the Institute's page it was read from."""
    btl = build_rights_btl(checked_on)
    b3 = btl["basic_amount"]["b3"]
    avg = btl["avg_wage"]["s2_benefits"]
    amounts, income = _derive(b3, avg)
    extra_dep = _round(F(avg) * F(MAX_PCT["each"]) / 100)
    if amounts != PUBLISHED_AMOUNTS or income != PUBLISHED_INCOME:
        raise ValueError(f"rights_zikna: the law's percentages of rights_btl no longer give the Institute's 2026 table: "
                         f"{amounts} {income}; re-read {AMOUNTS}, {INCOME_WORK} and {PARTIAL}")
    # The other-income bands (INCOME_OTHER): full up to 3 x the maximum income; the band's width is the same 60% rule of
    # s.245(ב) applied to the pension with the full seniority increment (single 2,757, couple 4,143), down to the minimum.
    width = {k: F(v * 3 // 2 - income["min_partial"]) / F("0.6") for k, v in (("single", amounts["single"]), ("couple", amounts["couple"]))}
    other = {
        "single": [3 * income["single"], _round(3 * income["single"] + width["single"])],
        "couple": [3 * income["couple"], _round(3 * income["couple"] + width["couple"])],
        "couple_pension": [3 * income["couple"], _round(3 * income["couple"] + width["single"])],
    }
    both = {"single": [income["single"], 2 * income["single"]], "couple": [income["couple"], 2 * income["couple"]]}
    if other != PUBLISHED_OTHER or both != PUBLISHED_BOTH:
        raise ValueError(f"rights_zikna: the other-income bands no longer follow the maximum income: {other} {both}; "
                         f"re-read {INCOME_OTHER} and {INCOME_BOTH}")
    return {
        "name_he": "קצבת אזרח ותיק (קצבת זקנה) וגיל הפרישה לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי, ענף אזרח ותיק",
        "source_name": "המוסד לביטוח לאומי: אזרח ותיק (תנאי זכאות, גיל הפרישה, אכשרה, מבחן הכנסות, סכום הקצבה ותוספות, מענק מעבר, תביעה); חוק הביטוח הלאומי, פרק י\"א ולוחותיו; חוק גיל פרישה",
        "source_url": AMOUNTS,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, פרק י\"א",
        "law_url": LAW,
        "tables_url": LAW_TABLES,
        "general_url": LAW_GENERAL,
        "retirement_law_he": "חוק גיל פרישה, התשס\"ד-2004",
        "retirement_law_url": RETIREMENT_LAW,
        "rehearse_url": SIM,
        "pages": {
            "main": MAIN, "conditions": CONDITIONS, "ages": AGES, "retirement": RETIREMENT, "eligibility_age": ELIGIBILITY_AGE,
            "insured_man": INSURED_MAN, "insured_woman": INSURED_WOMAN, "achshara_man": ACHSHARA_MAN,
            "achshara_woman": ACHSHARA_WOMAN, "income_test": INCOME_TEST, "income_work": INCOME_WORK,
            "income_other": INCOME_OTHER, "income_both": INCOME_BOTH, "income_extra": INCOME_EXTRA, "paid": PAID,
            "partial": PARTIAL, "amounts": AMOUNTS, "additions": ADDITIONS, "deductions": DEDUCTIONS, "seniority": SENIORITY,
            "deferral": DEFERRAL, "dependants": DEPENDANTS, "def_wife": DEF_WIFE, "def_husband": DEF_HUSBAND,
            "def_child": DEF_CHILD, "supplement": SUPPLEMENT, "supplement_amounts": SUPPLEMENT_AMOUNTS,
            "supplement_income": SUPPLEMENT_INCOME, "grant": GRANT, "grant_conditions": GRANT_CONDITIONS,
            "grant_amount": GRANT_AMOUNT, "grant_claim": GRANT_CLAIM, "claim": CLAIM, "payment": PAYMENT,
            "from_other": FROM_OTHER, "special": SPECIAL, "calculator": CALCULATOR, "appeal": APPEAL,
            "appeal_committee": APPEAL_COMMITTEE, "appeal_court": APPEAL_COURT, "legal_aid": LEGAL_AID, "basic": BASIC,
        },
        # Table א1 parts א and ד; the Retirement Age Law, schedule part ב and s.3; s.245(א). The Institute's pages: "גיל הפרישה
        # לגברים הוא 67 ... לנשים 60 עד 65 שנים ונקבע לפי תאריך הלידה"; "גיל הזכאות לגברים ולנשים הוא 70".
        "ages": {
            "men_retirement": MEN_RETIREMENT, "women_retirement": WOMEN_RETIREMENT, "women_eligibility": WOMEN_ELIGIBILITY,
            "men_eligibility": 70, "men_now": 67, "women_now_from": 62, "women_now_to": 65, "law_from_1956": "1956-01",
            "section": "סעיף 245(א); לוח א1 חלקים א' ו-ד'", "retirement_section": "לוח א1, חלק א'; חוק גיל פרישה, התוספת, חלק ב'",
            "url": RETIREMENT, "eligibility_url": ELIGIBILITY_AGE, "law_url": LAW, "tables_url": LAW_TABLES,
            "retirement_law_url": RETIREMENT_LAW,
            "he": "קצבת אזרח ותיק משולמת מגיל הפרישה בהתאם למבחן הכנסות, ומגיל הזכאות (70) בלי קשר להכנסות",
            "women_he": "גיל הפרישה לאישה נקבע לפי חודש הלידה: 62 לילידות מאי 1947 עד 1959, ועולה בהדרגה עד 65 לילידות 1970 ואילך (התיקון של 2021)",
        },
        # s.246; the Institute's pages for a man and for a woman.
        "achshara": {
            "last10_months": 60, "total_months": 144, "section": "סעיף 246", "url": ACHSHARA_MAN, "woman_url": ACHSHARA_WOMAN,
            "he": "60 חודשי ביטוח בתוך 10 השנים שלפני הגיל המזכה, או 144 חודשי ביטוח, או 60 חודשים לפחות כשחודשי הביטוח מאז שנעשו תושבים רבים מהחודשים שבלי ביטוח",
            "exempt_he": "פטורה מתקופת אכשרה אישה שהגיעה לגיל הפרישה כשהיא רווקה, גרושה, אלמנה שלא מקבלת קצבת שאירים או תלויים, עגונה, נשואה למי שאינו מבוטח, או שקיבלה קצבת נכות כללית בחודש שלפני",
            "basic70_he": "אישה שחייבת בתקופת אכשרה ולא צברה אותה זכאית בגיל 70 לקצבה בסיסית, אם הייתה תושבת 60 חודשים מתוך 10 השנים שלפני, או 144 חודשים",
            "housewife_he": "עקרת בית (נשואה למבוטח ואינה עובדת) לא חייבת בדמי ביטוח, ויכולה להיות זכאית לקצבה בגיל 70",
            "later_he": "אפשר להמשיך לצבור תקופת אכשרה גם אחרי גיל הפרישה, ומרגע ההשלמה יש זכאות",
            "returning_he": "תושב חוזר שלא צבר תקופת אכשרה עשוי לקבל גמלת אזרח ותיק מיוחדת עד שיצבור אותה",
        },
        # s.240 and the insured pages: a man who immigrated after the age in the table, a woman after her retirement age, is not
        # insured; the special benefit (SPECIAL) is paid by the treasury: the basic amounts, no seniority or deferral, and an
        # income test also after 70.
        "insured": {
            "section": "סעיף 240", "url": INSURED_MAN, "woman_url": INSURED_WOMAN, "special_url": SPECIAL,
            "he": "מבוטחים תושבי ישראל מגיל 18 שנולדו בישראל, או שעלו לראשונה לפני גיל 62 (גבר) או לפני גיל הפרישה (אישה)",
            "special_he": "מי שעלה אחרי הגיל הזה עשוי לקבל גמלת אזרח ותיק מיוחדת מאוצר המדינה: בסכומי הקצבה הבסיסית, בלי תוספת ותק ודחייה, ובמבחן הכנסות גם אחרי גיל 70",
        },
        # s.244(א), s.247א, s.244(ב); the Institute's table of amounts and the dependants page, "החל ב- 01.01.2026".
        "amounts": {
            "pct": {k: float(F(v)) for k, v in PCT.items()}, "published": PUBLISHED_AMOUNTS,
            "basic": amounts["single"], "basic80": amounts["single80"], "spouse": amounts["spouse"], "child": amounts["child"],
            "max_children": 2, "from80": 80, "section": "סעיף 244", "section80": "סעיף 247א", "url": AMOUNTS,
            "dependants_url": DEPENDANTS, "law_url": LAW,
            "both_he": "אם כל אחד מבני הזוג עונה על תנאי הזכאות, כל אחד מקבל קצבה ליחיד",
            "children_he": "התוספת עבור ילדים משולמת עבור שני ילדים לכל היותר; כששני ההורים מקבלים קצבה, רק למקבל הקצבה הגבוהה",
            "housewife_he": "אישה שמקבלת קצבה כעקרת בית אינה זכאית לתוספת עבור בן זוג וילדים",
        },
        # s.248 (since amendment 187, 1.1.2019: from the first year); SENIORITY.
        "seniority": {
            "pct_per_year": 2, "max_pct": 50, "section": "סעיף 248", "url": SENIORITY, "law_url": LAW,
            "he": "2% לכל שנת ביטוח מלאה (12 חודשים, גם לא רצופים), עד 50%: 25 שנים מגיעים לתקרה",
            "women_he": "לאישה נספרות תקופות שבהן עבדה, הייתה רווקה, גרושה, אלמנה בלי קצבת שאירים, עגונה, נשואה למי שאינו מבוטח, או קיבלה קצבת נכות",
        },
        # s.249(א)-(ג); DEFERRAL and ADDITIONS.
        "deferral": {
            "pct_per_year": 5, "nine_months": 9, "section": "סעיף 249", "url": DEFERRAL, "law_url": LAW,
            "he": "5% מהקצבה המלאה (כולל תוספת הוותק) לכל שנה מגיל הפרישה ועד 70 שבה הקצבה לא שולמה בגלל הכנסה מעבודה, או שבה ויתרו על קצבה חלקית",
            "nine_he": "הכנסה כזאת במשך 9 חודשים לפחות מתוך שנה נחשבת כהכנסה של כל השנה",
            "other_he": "מי שיש לו הכנסות גבוהות שלא מעבודה בלבד לא זכאי לתוספת דחייה",
            "avtala_he": "דמי אבטלה נחשבים הכנסה מעבודה, גם במבחן ההכנסות וגם לתוספת הדחייה",
        },
        # s.245(ב)-(ג); table ט1; the Institute's income-test pages, "החל מ- 01.01.2026".
        "income_test": {
            "max_pct": {k: float(F(v)) for k, v in MAX_PCT.items()}, "single": income["single"], "couple": income["couple"],
            "extra_dep": extra_dep, "deduct_pct": 60, "min_partial_pct": 10, "min_partial": income["min_partial"],
            "end_single": income["end_single"], "end_couple": income["end_couple"], "top_example": income["seniority_max_example"],
            "other": PUBLISHED_OTHER, "both": PUBLISHED_BOTH, "other_mult": 3, "both_other_mult": 2,
            "history": MAX_HISTORY, "section": "סעיף 245(ב)", "table_section": "לוח ט1", "url": INCOME_TEST,
            "work_url": INCOME_WORK, "other_url": INCOME_OTHER, "both_url": INCOME_BOTH, "extra_url": INCOME_EXTRA,
            "partial_url": PARTIAL, "law_url": LAW, "tables_url": LAW_TABLES,
            "he": "מגיל הפרישה ועד 70: מי שהכנסתו עולה על ההכנסה המרבית מקבל קצבה פחות 60% מההפרש, ולא פחות מ-10% מהקצבה הבסיסית; מתחת לזה אין קצבה",
            "excluded_he": "הכנסה מפנסיה, בישראל או בחו\"ל, לא נחשבת; גם הפרשי הצמדה פטורים ממס על פיקדונות וחסכונות",
            "extra_he": "תשלום נוסף (הבראה, ביגוד, מענק) של יותר מ-25% משכר המינימום מתחלק ל-12 חודשים; הפרשי שכר נזקפים לחודש שבעדו שולמו",
            "other_he": "הכנסה שלא מעבודה (שכר דירה, ריבית): קצבה מלאה עד פי 3 מההכנסה המרבית; עם הכנסה מעבודה, עד פי 2 ממנה כשהכנסת העבודה מתחת להכנסה המרבית",
            "dependants_he": "ההכנסה המרבית לפי מספר התלויים: בלי תלויים 73.45% מהשכר הממוצע, עם תלוי אחד 97.93%, ועוד 7% לכל תלוי נוסף",
            "waive_he": "אפשר לוותר על הקצבה החלקית ולקבל אחר כך קצבה גבוהה יותר עם תוספת דחייה",
            "disability_he": "מי שקיבל קצבת נכות כללית עד גיל הפרישה עובר לקצבת אזרח ותיק בלי מבחן הכנסות, והקצבה לא תהיה נמוכה מקצבת הנכות האחרונה",
            "report_he": "על כל שינוי בהכנסות מודיעים עד גיל 70, וגם על הכנסות בן או בת הזוג",
        },
        # s.247 and table ט item 1; DEF_WIFE and DEF_HUSBAND, "החל ב- 01.01.2026".
        "spouse": {
            "income_limit": income["spouse_limit"], "limit_pct": 57, "wife_min_age": 45, "wife_free_age": 67,
            "husband_min_age": 50, "husband_free_age": 70, "together_months": 12, "section": "סעיף 247", "url": DEPENDANTS,
            "wife_url": DEF_WIFE, "husband_url": DEF_HUSBAND, "child_url": DEF_CHILD, "law_url": LAW,
            "wife_he": "בת זוג: נשואה או ידועה בציבור שנה לפחות (או שילדה לו ילד), בת 45 ומעלה או שיש עמה ילד שלו, והכנסתה עד 7,848 ש\"ח או שהיא בת 67 ומעלה",
            "husband_he": "בן זוג: נשוי או ידוע בציבור שנה לפחות, בן 50 עד 70 עם הכנסה עד 7,848 ש\"ח, או בן 70 ומעלה",
            "pension_he": "התוספת משולמת עבור בן זוג שאינו מקבל קצבה מהביטוח הלאומי",
            "child_he": "ילד: עד 18; עד 20 בלימודי תיכון, בגרות או מכינה קדם-צבאית; עד 21 בהתנדבות שדחתה את השירות; עד 24 בשירות סדיר, לאומי או עתודה",
        },
        # s.269א (amendment 228, 1.1.2022); GRANT_CONDITIONS, GRANT_AMOUNT, GRANT_CLAIM, "החל ב- 01.01.2026".
        "grant": {
            "born_from": 1960, "born_to": 1966, "from_age": 62, "months": 4,
            "rates": {"1960": 4000, "1961": 4000, "1962": 4000, "1963": 3750, "1964": 3500, "1965": 3250, "1966": 3000},
            "det_pct": 73.5, "det": income["grant_det"], "other_year": 60000, "claim_age": 64, "claim_months": 24,
            "section": "סעיף 269א", "url": GRANT, "conditions_url": GRANT_CONDITIONS, "amount_url": GRANT_AMOUNT,
            "claim_url": GRANT_CLAIM, "law_url": LAW,
            "he": "אישה שנולדה בשנים 1960 עד 1966 עשויה לקבל מענק מעבר בעד 4 החודשים שמיום שמלאו לה 62",
            "conditions_he": [
                "אין הכנסה מעבודה (כשכירה או כעצמאית) מגיל 62 ועד 62 ו-4 חודשים, ולא חופשה ללא תשלום מרצון",
                "הכנסה מפנסיה, מתגמולים או מקצבאות עד 10,120 ש\"ח לחודש",
                "הכנסה שנתית שלא מעבודה עד 60,000 ש\"ח בשנת המס שבה מלאו לה 61",
                "תקופת אכשרה מלאה, או פטור ממנה",
                "לא מקבלת הבטחת הכנסה, דמי מזונות, קצבת נכות כללית או דמי אבטלה (נבדק בכל אחד מ-4 החודשים)",
            ],
            "rate_he": "הסכום לחודש: לפי שנת הלידה, או ההפרש בין 10,120 ש\"ח לבין ההכנסה מקצבאות ופנסיה, הנמוך מהשניים",
            "survivor_he": "מי שמקבלת קצבת שאירים מקבלת השלמה עד גובה המענק",
            "deadline_he": "מגישים עד גיל 64",
        },
        # SUPPLEMENT, SUPPLEMENT_AMOUNTS, SUPPLEMENT_INCOME, "החל מ- 01.01.2026": the pointer; the computation is in /havtachat-hachnasa/.
        "supplement": {
            "table": SUPPLEMENT_TABLE, "health": 123, "pension_disregard": {"single": 1790, "couple": 2823},
            "work_disregard": {"single": 3236, "couple": 3786}, "work_pct": 60, "url": SUPPLEMENT,
            "amounts_url": SUPPLEMENT_AMOUNTS, "income_url": SUPPLEMENT_INCOME,
            "he": "למקבלי קצבת אזרח ותיק עם הכנסות נמוכות משולמת תוספת השלמת הכנסה, עד הסכומים שבטבלה",
        },
        # DEDUCTIONS, "החל ב- 01.01.2026".
        "health": {
            "single": 237, "couple": 340, "supplement": 123, "url": DEDUCTIONS,
            "he": "מהקצבה מנוכים דמי ביטוח בריאות: 237 ש\"ח ליחיד, 340 ש\"ח לזוג, 123 ש\"ח למקבלי השלמת הכנסה",
            "wife_he": "לאישה נשואה לא מנוכים דמי ביטוח בריאות מהקצבה",
        },
        # CLAIM and PAYMENT; s.296 (the retroactive months, as the Institute's claim page states them).
        "claim": {
            "retro_months": 12, "retro_after70_months": 48, "pay_day": 28, "cutoff_day": 15, "url": CLAIM,
            "payment_url": PAYMENT, "calculator_url": CALCULATOR,
            "he": "מגישים תביעה עם מסמכים על ההכנסות: אישור מעסיק על סיום או צמצום העבודה, הצהרת עצמאי, חוזה שכירות או אישור ריבית",
            "mail_he": "חודש לפני גיל הפרישה נשלח טופס התביעה בדואר, ולנשים גם פירוט תקופות הביטוח",
            "retro_he": "תביעה אחרי גיל הפרישה: עד 12 חודשים אחורה; אחרי גיל 70: עד 48 חודשים, ושנה אחת מהם יכולה להיות לפני 70 לפי מבחן ההכנסות",
            "pay_he": "הקצבה משולמת ב-28 בכל חודש, עבור אותו חודש",
            "first_he": "מי שנולד לפני ה-15 בחודש מתחיל לקבל בחודש שבו הגיע לגיל המזכה; מי שנולד אחרי ה-15, בחודש שאחריו",
        },
        # APPEAL, APPEAL_COMMITTEE, APPEAL_COURT, LEGAL_AID.
        "appeal": {
            "committee_months": 6, "court_months": 12, "committee_form": "בל/910", "url": APPEAL,
            "committee_url": APPEAL_COMMITTEE, "court_url": APPEAL_COURT, "legal_aid_url": LEGAL_AID,
            "he": "על החלטה אפשר לפנות לוועדת תביעות בתוך 6 חודשים (טופס בל/910), ולהגיש תביעה לבית הדין האזורי לעבודה בתוך 12 חודשים מיום ההחלטה; אפשר לבקש סיוע משפטי חינם",
        },
        # FROM_OTHER and INCOME_TEST: general disability and income support stop at the retirement age.
        "from_other": {
            "url": FROM_OTHER,
            "he": "קצבת נכות כללית והבטחת הכנסה משולמות עד גיל הפרישה; משם קצבת אזרח ותיק, ולמי שקיבל נכות, לא פחות מקצבת הנכות האחרונה",
        },
        # PAID: a salaried worker's employer pays; a self-employed person and a non-worker pay themselves, until the age.
        "paid": {"url": PAID, "he": "שכיר לא נפגע מחוב של המעסיק; עצמאי ומי שלא עובד משלמים בעצמם עד הגיל המזכה, וחוב בדמי ביטוח מעכב או מקטין את הקצבה"},
        # Penal Law s.368ו (assault of a person 65 or older).
        "penal": {"url": PENAL_LAW, "section": "סעיף 368ו לחוק העונשין", "age": 65, "harm_years": 5, "serious_years": 7,
                  "he": "התוקף אדם בן 65 ומעלה וגורם לו חבלה של ממש: עד 5 שנות מאסר; חבלה חמורה: עד 7 שנים"},
        # The years before 2026 (the 2026 row is rights_btl's own basic amount 3).
        "history": HISTORY, "history_url": BASIC,
    }
