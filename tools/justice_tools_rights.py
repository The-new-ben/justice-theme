"""The rights-guide wave (21.10.2026): the shared National Insurance figures every rights instrument reads, and the loader
of the per-instrument datasets (tools/justice_tools_rights_<name>.py, each with KEY and build(checked_on)).
Imported by tools/justice_tools_registry.py (--rights-checked-on); kept in modules of their own so the other waves'
builders stay untouched.

Every value here was read on checked_on from the National Insurance Institute's own pages named next to it. Nothing is
estimated; a figure the sources do not hold is not in the file.
"""
from __future__ import annotations

import importlib

BTL_AVG_WAGE = ("https://www.btl.gov.il/Mediniyut/GeneralData/Pages/"
                "%d7%a9%d7%9b%d7%a8%20%d7%9e%d7%9e%d7%95%d7%a6%d7%a2.aspx")          # שכר ממוצע לפי סעיפים 1 ו-2
BTL_BASIC = ("https://www.btl.gov.il/Mediniyut/GeneralData/Pages/"
             "%d7%94%d7%a1%d7%9b%d7%95%d7%9d%20%d7%94%d7%91%d7%a1%d7%99%d7%a1%d7%99%20%d7%9c%d7%97%d7%99%d7%a9%d7%95%d7%91%20"
             "%d7%a7%d7%a6%d7%91%d7%90%d7%95%d7%aa.aspx")                                  # הסכום הבסיסי לחישוב קצבאות
BTL_LAW = "https://www.btl.gov.il/Laws1/00_0001_000001.pdf"                    # חוק הביטוח הלאומי, פרק א' (סעיפים 1 ו-2), באתר המוסד

# The per-instrument datasets of the wave, in the order the registry prints them. A module that is not there yet is skipped,
# so each builder adds its own file without touching this one.
RIGHTS_MODULES = (
    "justice_tools_rights_bituach",   # rights_bituach: national insurance and health contributions (/national-insurance-calculator/)
    "justice_tools_rights_tax",       # rights_tax: tax years, brackets, credit points (/nekudot-zikui/, /guide-tax-calculator-updated-2025/)
    "justice_tools_rights_avtala",    # rights_avtala: unemployment benefit (/unemployment-benefits-eligibility/)
    "justice_tools_rights_leida",     # rights_leida: maternity allowance and birth grant (/maternity-allowance/)
    "justice_tools_rights_nechut",    # rights_nechut: general disability pension (/general-disability-pension-2026/)
    "justice_tools_rights_maanak",    # rights_maanak: the work grant, wave 2A (/maanak-avoda/)
    "justice_tools_rights_neto",      # rights_neto: gross to net salary, wave 2A (/net-salary-calculator/)
    # wave 2B (22.10.2026, HAD-585): old age, reserve duty, children, income support
    "justice_tools_rights_zikna",     # rights_zikna: old-age pension and the retirement age (/elder-law-israel/)
    "justice_tools_rights_miluim",    # rights_miluim: reserve-duty pay, the published grants, the protection (/miluim-dismissal-protection/)
    "justice_tools_rights_yeladim",   # rights_yeladim: child allowance and the savings plan (/kitzbat-yeladim/)
    "justice_tools_rights_havtacha",  # rights_havtacha: income support (/havtachat-hachnasa/)
)


def build_rights_btl(checked_on: str) -> dict:
    """The National Insurance figures that several instruments share: the average wage of sections 1 and 2 of the National
    Insurance Law and the basic amounts, each from 1.1.2026 as the Institute publishes them."""
    return {
        "name_he": "נתוני היסוד של הביטוח הלאומי לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי, מחקר ותכנון: נתונים כלליים",
        "source_name": "המוסד לביטוח לאומי: שכר ממוצע לפי סעיפים 1 ו-2 לחוק הביטוח הלאומי; הסכום הבסיסי לחישוב קצבאות",
        "source_url": BTL_AVG_WAGE,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995",
        "law_url": BTL_LAW,
        "from": "2026-01-01",
        # השכר הממוצע החל מ-1.1.2026 (the Institute's page, read on checked_on).
        "avg_wage": {
            "s1_benefits": 13566, "s1_contributions": 13566,
            "s2_benefits": 13769, "s2_contributions": 13769,
            "section_1_he": "סעיף 1 לחוק", "section_2_he": "סעיף 2 לחוק",
            "url": BTL_AVG_WAGE,
            "he": "השכר הממוצע מ-1.1.2026: לפי סעיף 1 לחוק 13,566 ש\"ח (קצבאות ודמי ביטוח); לפי סעיף 2 לחוק 13,769 ש\"ח (קצבאות ודמי ביטוח)",
        },
        # הסכום הבסיסי מ-1.1.2026 (the Institute's page, read on checked_on).
        "basic_amount": {
            "b1": 10514,
            "b1_he": "סכום בסיסי 1: מענק לידה, דמי לידה, נפגעי עבודה, דמי תאונה, מענק בר מצווה, גמלה למתנדב ומענק פטירה",
            "b2_child_first_fifth": 173, "b2_child_second_to_fourth": 219, "b2_income_support": 162,
            "b2_he": "סכום בסיסי 2: קצבת ילדים ונקודת קצבה בהבטחת הכנסה",
            "b3": 10382, "b3_change_pct": 2.4,
            "b3_he": "סכום בסיסי 3: קצבאות שאינן מעודכנות לפי סכום בסיסי אחר, וחישוב ההכנסה המרבית לגביית דמי ביטוח",
            "b4": 11352, "b4_change_pct": 3.4,
            "b4_he": "סכום בסיסי 4: קצבת נכות כללית והקצבאות שסכומיהן נגזרים ממנה",
            "url": BTL_BASIC,
        },
    }


def add_rights(registry: dict, day: str | None) -> list:
    """Add the shared figures and every per-instrument dataset that exists, each with checked_on = day. Returns the keys."""
    if not day:
        return []
    registry["registry_version"] = max(registry["registry_version"], day)
    registry["rights_btl"] = build_rights_btl(day)
    keys = ["rights_btl"]
    for name in RIGHTS_MODULES:
        try:
            module = importlib.import_module(name)
        except ModuleNotFoundError as error:
            if error.name != name:
                raise
            continue
        registry[module.KEY] = module.build(day)
        keys.append(module.KEY)
    return keys
