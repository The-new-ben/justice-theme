"""The closing ledger of an apartment deal (the family + land wave, 21.10.2026, HAD-579): the all-in cost of buying or
selling an apartment, on /real-estate-lawyer-cost-2025/ (articles 12655).

REUSE: purchase tax, its tracks, the 30/60-day deadlines of the buyer (ss.73(ג), 90א, 94(א)) and the VAT rate (18% from
1.1.2025, 17% before) are read from reg.purchase_tax; the seller's deadlines (ss.73(א), 90א) from reg.shevach.deadlines.
This module adds only what those datasets do not hold:
- the Land Registry fees: תקנות המקרקעין (אגרות), התשל"ה-1974, the schedule as replaced by הודעת המקרקעין (אגרות),
  התשפ"ו-2025 (signed 21.12.2025, in force 1.1.2026; gov.il announcement 23.12.2025; Nevo consolidated text current to
  6.1.2026). Reg. 2(ב): updated each 1 January by the November CPI; 2(ב1): rounded to the whole shekel; 2(ג): the
  Director General of the Ministry of Justice publishes the schedule. Reg. 21: who pays.
- the lawyer's fee: no binding fee exists. Section 81 of the Bar Association Law 1961 (as replaced in 1993) lets the
  Bar set a minimum tariff "as a recommendation that does not bind"; the rules in force are כללי לשכת עורכי הדין
  (התעריף המינימלי המומלץ), התש"ס-2000, rule 2 (not binding), rule 1 (plus VAT), rule 3 (indexed each 1 January). The
  schedule items for a property deal (11(1) contract drafting, 11(9) registration, 11(10) a contractor's buyer) are
  copied as Nevo shows them (current to 5.1.2026); the Bar's own 2026 notice was not found, so the page says the text
  date and not more.
- the seller's advance (s.15(ב)-(ג) of the Land Taxation Law): 7.5% (right acquired from 7.11.2001) or 15% (before) of
  the price, withheld by the buyer once more than 40% is paid; not when a qualifying-home exemption is claimed (s.15(ח)(1)).
- the ethics rule on one lawyer for both sides (rule 14 of the 1986 ethics rules).
Nothing here is estimated: market prices of lawyers, brokers, appraisers and advisers are not published by any official
source, so they are the user's own inputs and the module holds none.
"""
from __future__ import annotations

KEY = "fl_iska"

TABU_REGS = "https://www.nevo.co.il/law_html/law00/72910.htm"     # תקנות המקרקעין (אגרות), התשל"ה-1974 (to 6.1.2026)
TABU_PAGE = "https://www.gov.il/he/pages/fees-2026"                  # the 2026 update announcement (23.12.2025)
TABU_NOTICE = "https://www.gov.il/BlobFolder/news/fees-2026/he/files_fees-2026.pdf"  # הודעת המקרקעין (אגרות), התשפ"ו-2025
BAR_LAW = "https://www.nevo.co.il/law_html/law01/p179_001.htm"       # חוק לשכת עורכי הדין, התשכ"א-1961, s.81
BAR_TARIFF = "https://www.nevo.co.il/law_html/law00/4425.htm"        # התעריף המינימלי המומלץ, התש"ס-2000 (to 5.1.2026)
ETHICS = "https://www.nevo.co.il/law_html/law00/4415.htm"            # כללי האתיקה המקצועית, התשמ"ו-1986, rule 14
LAND_TAX = "https://www.nevo.co.il/law_html/law01/276_002.htm"       # חוק מיסוי מקרקעין (שבח ורכישה), התשכ"ג-1963
DECLARE_SERVICE = "https://www.gov.il/he/service/real-estate-tax-7000"
EXTRACT_SERVICE = "https://www.gov.il/he/service/land_registration_extract"
REGISTER_GUIDE = "https://www.gov.il/he/service/guide-register-rights"


def _fee(amount, item, he):
    """One Land Registry fee: shekels, the item of the schedule, its words (schedule in force from 1.1.2026)."""
    return {"amount": amount, "item": item, "he": he}


def build(checked_on: str) -> dict:
    return {
        "name_he": "העלות המלאה של קניית דירה או מכירתה",
        "publisher_he": "משרד המשפטים (רישום המקרקעין), רשות המסים ולשכת עורכי הדין",
        "source_name": "הודעת המקרקעין (אגרות), התשפ\"ו-2025; חוק מיסוי מקרקעין; כללי התעריף המינימלי המומלץ",
        "source_url": TABU_PAGE,
        "checked_on": checked_on,
        "refresh_every_days": 92,
        # The Land Registry fees change each 1 January (reg. 2(ב)); so does the Bar's tariff (rule 3(א)).
        "next_update": "2027-01-01",
        "tabu": {
            "regulation_he": "תקנות המקרקעין (אגרות), התשל\"ה-1974",
            "url": TABU_REGS,
            "notice_he": "הודעת המקרקעין (אגרות), התשפ\"ו-2025",
            "notice_url": TABU_NOTICE,
            "page_url": TABU_PAGE,
            "from": "2026-01-01",
            "current_to": "2026-01-06",
            "update_he": "האגרות מתעדכנות ב-1 בינואר של כל שנה לפי מדד נובמבר, ומעוגלות לשקל השלם (תקנה 2(ב) ו-(ב1))",
            "update_section": "תקנה 2(ב)",
            "payer_he": "את אגרת המשכנתה משלם הלווה; אגרה של פעולה אחרת משלם מי שהזכות נרשמת על שמו, ובמכר זה הקונה (תקנה 21)",
            "payer_section": "תקנה 21",
            "fees": {
                "sale": _fee(44, "פרט 1", "רישום מכר (העברת הבעלות על שם הקונה)"),
                "warning": _fee(188, "פרט 13(א)(1)", "רישום הערת אזהרה לטובת הקונה"),
                "warning_delete": _fee(127, "פרט 13(ב)", "מחיקת הערת אזהרה על פי בקשת הצדדים"),
                "mortgage": _fee(188, "פרט 2(א)", "רישום משכנתה"),
                "mortgage_delete_direct": _fee(0, "פרט 2(ג)(1)", "מחיקת משכנתה כשהכסף שולם ישירות לבנק: פטור"),
                "mortgage_delete_deposit": _fee(188, "פרט 2(ג)(2)", "מחיקת משכנתה כשהכסף מופקד בלשכת רישום המקרקעין"),
                "extract_online": _fee(18, "פרט 7(א2)", "נסח טאבו מקוון"),
                "extract_counter": _fee(88, "פרט 7(א)", "נסח טאבו בלשכה"),
            },
        },
        "bar": {
            "law_he": "חוק לשכת עורכי הדין, התשכ\"א-1961",
            "law_url": BAR_LAW,
            "law_section": "סעיף 81",
            "law_text_he": "הלשכה רשאית לקבוע תעריף מינימלי לשכר טרחה, שיהיה המלצה לחברי הלשכה ולא יחייב אותם (סעיף 81, בנוסחו מ-1993)",
            "rules_he": "כללי לשכת עורכי הדין (התעריף המינימלי המומלץ), התש\"ס-2000",
            "url": BAR_TARIFF,
            "current_to": "2026-01-05",
            "binding": False,
            "rule2_he": "התעריף הוא המלצה שאינה מחייבת (כלל 2)",
            "rule2_section": "כלל 2",
            "vat_he": "השכר המינימלי המומלץ הוא הסכום שבתעריף ועוד מע\"מ (כלל 1)",
            "index_he": "הסכומים מתעדכנים ב-1 בינואר לפי המדד (כלל 3); הם מוצגים כפי שהם בנוסח באתר נבו המעודכן ל-5.1.2026",
            "drafting": {
                "item": "פרט 11(1)",
                "he": "עריכת חוזה, לפי שווי נושא החוזה",
                # [upper bound of the band, rate %]; above the last bound: by agreement, at least top_min.
                "brackets": [[95004, 2], [377607, 1.5], [761062, 1.25], [2283281, 1], [3806082, 0.75]],
                "first_min": 790,
                "top_from": 3806082,
                "top_min": 37761,
                "top_he": "שווי מעל 3,806,082 ₪: לפי הסכם, אך לא פחות מ-37,761 ₪ (פרט 11(1)(ו))",
            },
            "registration": {
                "item": "פרט 11(9)(ג)",
                "he": "רישום מכר כשעורך הדין לא ערך את החוזה: 1% עד 633,967 ₪ ו-0.75% מהשווי שמעל",
                "threshold": 633967,
                "rate_low": 1,
                "rate_high": 0.75,
                "drafted_item": "פרט 11(9)(א)",
                "drafted_he": "מי שערך את החוזה לא מקבל שכר נפרד על פעולות הרישום (פרט 11(9)(א))",
            },
            "contractor": {
                "item": "פרט 11(10)",
                "buyer_pct": 0.25,
                "he": "בדירה שנקנית מקבלן, הפרט קובע 0.25% משווי החוזה לעורך הדין של הקונה, בכפוף לצו פיקוח על מחירי מצרכים ושירותים (קביעת מחיר מרבי לשירותי נותן שירות בהיעדר רישום זכויות בפנקסי המקרקעין), התש\"ס-1999",
            },
        },
        "ethics": {
            "rules_he": "כללי לשכת עורכי הדין (אתיקה מקצועית), התשמ\"ו-1986",
            "url": ETHICS,
            "section": "כלל 14(ב) ו-14(ד)",
            "he": "עורך דין לא מייצג שני צדדים שיש ביניהם ניגוד עניינים (כלל 14(ב)); אבל מותר לו לערוך הסכם ולטפל בעסקה כשהצדדים הסכימו על כך בכתב (כלל 14(ד))",
        },
        "advance": {
            "law_url": LAND_TAX,
            "section": "סעיף 15(ב)-(ג)",
            "pct_after": 7.5,
            "pct_before": 15,
            "cutoff": "2001-11-07",
            "paid_over_pct": 40,
            "exempt_section": "סעיף 15(ח)(1)",
            "he": "כשהתמורה בכסף, הקונה מעביר לרשות המסים מקדמה על חשבון מס השבח של המוכר: 7.5% מהמחיר אם המוכר רכש את הזכות מ-7.11.2001, ו-15% אם לפני כן, מהתשלום שבו שולמו יותר מ-40% מהמחיר או במועד ההצהרה של הקונה, המאוחר מהשניים (סעיף 15(ב)-(ג))",
            "exempt_he": "המקדמה לא חלה במכירת דירת מגורים מזכה כשמבקשים עליה פטור (סעיף 15(ח)(1))",
        },
        "services": {
            "declare": {"he": "הצהרה על עסקת מקרקעין (רשות המסים)", "url": DECLARE_SERVICE},
            "extract": {"he": "הפקת נסח טאבו (רישום המקרקעין)", "url": EXTRACT_SERVICE},
            "register": {"he": "רישום זכויות במקרקעין: הפעולות והמסמכים", "url": REGISTER_GUIDE},
        },
    }
