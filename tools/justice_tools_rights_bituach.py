"""The rights wave (21.10.2026): the National Insurance and health-insurance contributions dataset of the co.il tools
registry (rights_bituach), read by the contributions calculator on /national-insurance-calculator/ (dmei-bituach).
Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES) when the registry is rebuilt with --rights-checked-on.

Every value was read on checked_on from the official page named next to it: the National Insurance Institute's rate
pages for employees, the self-employed, those not working, early-pension recipients and students (all "from 1.1.2026"),
the health-insurance rate pages, the self-employed worked example, the contribution-coordination and refund pages, the
2026 dues calendar, the retirement-age table, and the National Insurance Law itself (the Institute's consolidated PDF:
chapter 1 for the definitions, chapter 15 for contributions, the tables). Section 47A of the Income Tax Ordinance is
read from Nevo. Nothing here is estimated. Three figures are derived by arithmetic from two official figures, and each
says so next to it: the employee's National Insurance share above retirement age (the published employee total minus
the published health rate), the same for the self-employed above retirement age, and the 5% minimum for an early
pension (5% x the 2026 average wage of section 2).

Cross-checks against the shared dataset rights_btl (tools/justice_tools_rights.py):
- the maximum insurable income 51,910 = 5 x basic amount 3 (b3, 10,382): Table 11 (lu'ach yod-alef), items 1 and 2;
- the minimum income of a self-employed person 3,442 = 25% x 13,769 (the 2026 average wage of section 2): Table 11,
  item 2; the same 3,442 is the income not from work that is not counted (s.348(a1));
- the reduced collection tier 7,703 is NOT 60% of the average wage in 2026: amendment 256 (from 1.1.2026) replaced
  "60% of the average wage" with a fixed "reduced collection tier" of 7,522 (s.334(a)), raised each 1 January by the
  CPI in 2026-2028 and by the average wage from 2029: 7,522 x the 2.4% CPI rise = 7,703 (the same 2.4% as b3).
"""
from __future__ import annotations

KEY = "rights_bituach"

BTL = "https://www.btl.gov.il"
RATES = BTL + "/Insurance/Rates/Pages/"
RATES_EMP = RATES + "%d7%9c%d7%a2%d7%95%d7%91%d7%93%d7%99%d7%9d%20%d7%a9%d7%9b%d7%99%d7%a8%d7%99%d7%9d.aspx"      # לעובדים שכירים
RATES_SELF = RATES + "%d7%9c%d7%a2%d7%a6%d7%9e%d7%90%d7%99%d7%9d.aspx"                                          # לעצמאים
RATES_NONE = (RATES + "%d7%9e%d7%99%20%d7%a9%d7%90%d7%99%d7%a0%d7%9d%20%d7%a2%d7%95%d7%91%d7%93%d7%99%d7%9d%20%d7%95"
              "%d7%91%d7%a2%d7%9c%d7%99%20%d7%94%d7%9b%d7%a0%d7%a1%d7%94%20%d7%a9%d7%9c%d7%90%20%d7%9e%d7%a2%d7%91%d7%95"
              "%d7%93%d7%94.aspx")                                                                                # למי שאינם עובדים
RATES_PENSION = RATES + "%d7%9c%d7%9e%d7%a7%d7%91%d7%9c%d7%99%20%d7%a4%d7%a0%d7%a1%d7%99%d7%94%20%d7%9e%d7%95%d7%a7%d7%93%d7%9e%d7%aa.aspx"  # למקבלי פנסיה מוקדמת
RATES_INDEX = RATES + "default.aspx"
HEALTH_RATES = (BTL + "/Insurance/Health_Insurance/Pages/%d7%a9%d7%99%d7%a2%d7%95%d7%a8%d7%99%20%d7%93%d7%9e%d7%99%20"
                "%d7%91%d7%99%d7%98%d7%95%d7%97%20%d7%91%d7%a8%d7%99%d7%90%d7%95%d7%aa.aspx")                    # שיעורי דמי ביטוח בריאות
HEALTH_PENSIONERS = (BTL + "/Insurance/Health_Insurance/Pages/%d7%a9%d7%99%d7%a2%d7%95%d7%a8%d7%99%20%d7%93%d7%9e%d7%99%20"
                     "%d7%91%d7%99%d7%98%d7%95%d7%97%20%d7%91%d7%a8%d7%99%d7%90%d7%95%d7%aa%20%d7%9c%d7%9e%d7%a7%d7%91%d7%9c"
                     "%d7%99%20%d7%a7%d7%a6%d7%91%d7%90%d7%95%d7%aa%20%d7%9e%d7%9f%20%d7%94%d7%9e%d7%95%d7%a1%d7%93%20%d7%9c"
                     "%d7%91%d7%99%d7%98%d7%95%d7%97%20%d7%9c%d7%90%d7%95%d7%9e%d7%99%20%d7%95%d7%9e%d7%92%d7%95%d7%a4%d7%99"
                     "%d7%9d%20%d7%90%d7%97%d7%a8%d7%99%d7%9d.aspx")                                               # למקבלי קצבה
SELF = BTL + "/Insurance/National%20Insurance/type_list/Self_Employed/Pages/"
SE_EXAMPLE = SELF + "hishov.dmey.bituach.aspx"       # דוגמה לחישוב דמי ביטוח לעובד עצמאי שזהו עיסוקו היחיד
SE_HOWTOPAY = SELF + "howtopay.aspx"                 # איך משלמים?
SE_TIKUN = SELF + "tikun.aspx"                       # תיקון מקדמות
MIXED = (BTL + "/Insurance/National%20Insurance/type_list/%D7%A2%D7%95%D7%91%D7%93%20%D7%A9%D7%9B%D7%99%D7%A8%20%D7%95%D7%92%D7%9D"
         "%20%D7%A2%D7%95%D7%91%D7%93%20%D7%A2%D7%A6%D7%9E%D7%90%D7%99/Pages/default.aspx")                    # עובד שכיר וגם עובד עצמאי
STUDENT = BTL + "/Insurance/National%20Insurance/type_list/TlmidStodent/Pages/SecomTlmid.aspx"
PENSION_EXEMPT = BTL + "/Insurance/Pensyonerim/Pages/Ptor.aspx"
TEUM_WHEN = BTL + "/Insurance/Teum/Pages/mizakay.aspx"
TEUM_MAIN = BTL + "/Insurance/Teum/Pages/masik-ikari.aspx"
TEUM_REFUND = BTL + "/Insurance/Teum/Hechzer/Pages/default.aspx"
TEUM_ONLINE = "https://b2b.btl.gov.il/BTL.ILG.Payments/HechzerDmeyBituachInfo.aspx"
FORMS = BTL + "/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/forms/"
FORM_672 = FORMS + "insurance_forms/Pages/672%20-%20%D7%91%D7%A7%D7%A9%D7%94%20%D7%9C%D7%AA%D7%99%D7%A7%D7%95%D7%9F%20%D7%9E%D7%A7%D7%93%D7%9E%D7%95%D7%AA.aspx"
FORM_657 = FORMS + "Employers_forms/Pages/t657.aspx"
FORM_752 = FORMS + "Employers_forms/Pages/bakashaLehejzerDmeBituhaj.aspx"
PERSONAL = "https://ps.btl.gov.il/"
DUES_CALENDAR = BTL + "/Pages/BenefitsPaymentDates.aspx"
RETIREMENT = BTL + "/benefits/old_age/Conditions_of_eligibility/gilMezake/Pages/gilPrisha.aspx"
LAW_CH1 = BTL + "/Laws1/00_0001_000001.pdf"          # חוק הביטוח הלאומי, פרק א' (הגדרות: עובד עצמאי, השכר הממוצע, הסכום הבסיסי)
LAW_CH15 = BTL + "/Laws1/00_0001_000015.pdf"         # פרק ט"ו: דמי ביטוח (סעיפים 334 עד 370)
LAW_TABLES = BTL + "/Laws1/00_0001_000020.pdf"       # הלוחות (לוח י"א: הכנסה מרבית ומזערית)
ORDINANCE = "https://www.nevo.co.il/law_html/law01/255_001.htm"   # פקודת מס הכנסה [נוסח חדש], סעיף 47א


def _pair(total, health):
    """The National Insurance share of a published total rate: total minus the published health rate, per tier."""
    return [round(total[0] - health[0], 2), round(total[1] - health[1], 2)]


def build(checked_on: str) -> dict:
    """National Insurance and health contributions for 2026: the tier, the ceiling, the minimums, every rate by status
    and age, the self-employed base and its 52% deduction, coordination and refunds, the dues calendar and the forms."""
    health_emp = [3.23, 5.17]   # health insurance, employee and self-employed: 3.23% to the tier, 5.17% above (HEALTH_RATES)
    return {
        "name_he": "דמי ביטוח לאומי ודמי ביטוח בריאות לשנת 2026",
        "publisher_he": "המוסד לביטוח לאומי: שיעורי וסכומי דמי ביטוח; חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995",
        "source_name": "המוסד לביטוח לאומי: שיעורי דמי ביטוח לאומי ודמי ביטוח בריאות (החל מ-1.1.2026)",
        "source_url": RATES_INDEX,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "from": "2026-01-01",
        "year": 2026,
        "law_he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995",
        "law_url": LAW_CH15,
        "law_ch1_url": LAW_CH1,
        "law_tables_url": LAW_TABLES,
        "health_law_he": "חוק ביטוח בריאות ממלכתי, התשנ\"ד-1994",
        # מדרגת גבייה מופחתת: s.334(a) as amended by amendment 256 from 1.1.2026: 7,522 updated each 1 January by the CPI
        # (2026-2028), then by the average wage (from 2029). The Institute publishes 7,703 from 1.1.2026 (RATES_EMP and
        # every rate page). 7,522 x 1.024 = 7,702.5 -> 7,703; the CPI rise is the 2.4% of rights_btl.basic_amount.b3_change_pct.
        "tier": {
            "amount": 7703, "from": "2026-01-01", "base_amount": 7522, "base_year": 2025,
            "section": "סעיף 334(א) לחוק", "amendment_he": "תיקון 256, מ-1.1.2026",
            "he": "מדרגת הגבייה המופחתת: 7,522 ש\"ח, מתעדכנת ב-1 בינואר לפי עליית המדד בשנים 2026 עד 2028, ומ-2029 לפי עליית השכר הממוצע",
            "not_60_he": "מ-1.1.2026 החוק לא מגדיר עוד את המדרגה כ-60% מהשכר הממוצע: התיקון החליף את הביטוי בכל מקום בביטוי \"מדרגת הגבייה המופחתת\"",
            "url": LAW_CH15, "published_url": RATES_EMP,
        },
        # ההכנסה המרבית: Table 11, item 1 (employee) and item 2 (self-employed): the basic amount x 5. b3 = 10,382 (rights_btl)
        # x 5 = 51,910, which the Institute publishes from 1.1.2026 (RATES_EMP, RATES_SELF, PENSION_EXEMPT).
        "max": {
            "amount": 51910, "from": "2026-01-01", "basic_amount": 10382, "times": 5,
            "section": "לוח י\"א, פרטים 1 ו-2; סעיף 348(א)",
            "he": "ההכנסה המרבית החייבת בדמי ביטוח: הסכום הבסיסי כפול 5",
            "url": LAW_TABLES, "published_url": RATES_EMP,
        },
        # הכנסה מזערית לעובד עצמאי: Table 11, item 2: 25% of the average wage; 25% x 13,769 (s.2, rights_btl) = 3,442.25,
        # published as 3,442 (RATES_SELF: "מי שהכנסתו נמוכה מ-3,442 ש\"ח לחודש, ישלם דמי ביטוח מהכנסה מזערית").
        "min_self": {
            "amount": 3442, "pct": 25, "section": "לוח י\"א, פרט 2; סעיף 348(ב)",
            "he": "עצמאי שהכנסתו נמוכה מההכנסה המזערית משלם כאילו הכנסתו היתה ההכנסה המזערית",
            "lower_he": "לעצמאי אין הכנסה מזערית נמוכה יותר בלוח י\"א; הכנסה מזערית של 5% (פרט 3) חלה על מקבלי דמי אבטלה, מתנדבים בשירות לאומי ותלמידי ישיבה, ושל 15% (פרט 4) על מבוטח אחר",
            "definition_he": "עובד עצמאי לעניין החוק: עוסק במשלח ידו 20 שעות בשבוע בממוצע לפחות, או שהכנסתו החודשית הממוצעת ממנו לפחות 50% מהשכר הממוצע, או 12 שעות בשבוע לפחות עם הכנסה שלא פחתה מהסכום שבלוח א'",
            "definition_section": "סעיף 1 לחוק, הגדרת \"עובד עצמאי\"",
            "url": RATES_SELF, "law_url": LAW_TABLES, "definition_url": LAW_CH1,
        },
        # Income not from work that is not counted: s.348(a1), 25% of the average wage; the Institute's example deducts
        # 3,442 from 12,000 of rent (RATES_NONE).
        "passive_exempt": {"amount": 3442, "pct": 25, "section": "סעיף 348(א1)", "url": RATES_NONE},
        # Early pension below the minimum of Table 11 item 3 with no other income: pay as if the pension were that minimum
        # (s.345b(c)(2)). Derived: 5% x 13,769 (s.2 average wage 2026, rights_btl) = 688.45; the Institute publishes no figure.
        "min_pension": {"amount": 688.45, "pct": 5, "derived": True, "section": "סעיף 345ב(ג)(2); לוח י\"א, פרט 3", "url": LAW_CH15},
        # Employees: the Institute's table "from 1.2.2025" with the 2026 tier and ceiling (RATES_EMP), columns employee /
        # employer per tier. The health rate of an employee is 3.23% / 5.17% (HEALTH_RATES); for the two bands above
        # retirement age the page publishes only the employee total, so the National Insurance share is that total minus
        # the health rate (derived, marked "derived").
        "employee": {
            "url": RATES_EMP, "health_url": HEALTH_RATES, "rates_from_he": "שיעורים בתוקף מ-1.2.2025, סכומי המדרגה והתקרה מ-1.1.2026",
            "work": {"he": "מגיל 18 ועד גיל הפרישה", "row_he": "טור 1 בטופס 102", "bl": [1.04, 7], "health": health_emp, "employer": [4.51, 7.6]},
            "u18": {"he": "מי שטרם מלאו לו 18", "bl": [0, 0], "health": [0, 0], "employer": [0.61, 2.12]},
            "w_ret": {"he": "אישה בין גיל הפרישה שלה לגיל הפרישה לגבר, שאינה מקבלת קצבת אזרח ותיק", "total": [3.95, 10.24],
                      "health": health_emp, "bl": _pair([3.95, 10.24], health_emp), "derived": True, "employer": [4.17, 7.12]},
            "r67": {"he": "נשים וגברים בין גיל 67 לגיל 70 שאינם מקבלים קצבת אזרח ותיק", "total": [3.93, 10.03],
                    "health": health_emp, "bl": _pair([3.93, 10.03], health_emp), "derived": True, "employer": [4.13, 6.96]},
            "oap": {"he": "נשים וגברים המקבלים קצבת אזרח ותיק", "bl": [0, 0], "health": [0, 0], "employer": [0.61, 2.12],
                    "section": "סעיף 342(ג)(2)", "section_he": "המעסיק לא מנכה משכר מי שמקבל קצבת אזרח ותיק, ומי שהגיע לגיל 70"},
            "disabled": {"he": "מקבלי קצבת נכות מעבודה או נכות כללית ויש להם אישור שנתי מהביטוח הלאומי", "bl": [0, 0],
                         "health": health_emp, "employer": [0.61, 2.12]},
        },
        # Self-employed (RATES_SELF, from 1.1.2026).
        "self": {
            "url": RATES_SELF,
            "work": {"he": "מגיל 18 ועד גיל הפרישה", "bl": [4.47, 12.83], "health": health_emp},
            "u18": {"he": "מי שטרם מלאו לו 18 (פטור מדמי ביטוח בריאות)", "bl": [0.26, 0.78], "health": [0, 0]},
            "oap": {"he": "מי שמקבל קצבת אזרח ותיק (דמי ביטוח הבריאות מנוכים מהקצבה)", "bl": [0.26, 0.78], "health": [0, 0]},
            "ret": {"he": "מי שהגיע לגיל הפרישה ולא מקבל קצבת אזרח ותיק", "total": [6.92, 15.79], "health": health_emp,
                    "bl": _pair([6.92, 15.79], health_emp), "derived": True},
            # The base: s.345(b)(1)(a) deducts the contributions allowed under s.47A of the Ordinance (52% of the National
            # Insurance contributions, not health) before the rates apply; the Institute's formula and worked example
            # (SE_EXAMPLE): x = (y + m*3*0.52*(t2-t1)) / (1 + t2*0.52) a quarter; 12,000 a month -> base 34,690 a quarter,
            # contributions 3,864 a quarter.
            "deduct_pct": 52, "deduct_section": "סעיף 47א(א) לפקודת מס הכנסה", "deduct_url": ORDINANCE,
            "base_section": "סעיף 345(ב)(1)(א) לחוק", "example_url": SE_EXAMPLE,
            "example": {"monthly_income": 12000, "quarter_base": 34690, "quarter_total": 3864},
            "advance_he": "עד השומה הסופית משלמים מקדמות לפי ההכנסה העדכנית שבידי הביטוח הלאומי; עם השומה מחושבים ההפרשים (סעיף 345(ב)(1) ו-(ג))",
        },
        # Employee and self-employed together: income from all sources up to the ceiling (MIXED); the reduced rate on the
        # self-employed income only up to the gap between the salary and the tier (s.342(f)).
        "mixed": {"section": "סעיף 342(ו)", "url": MIXED,
                  "he": "על ההכנסה כעצמאי חל השיעור המופחת רק על ההפרש בין השכר למדרגה המופחתת"},
        # Early pension (RATES_PENSION, from 1.1.2026): deducted in full from the pensioner (no employer share).
        "pension": {
            "url": RATES_PENSION, "bl": [1.02, 6.79], "health": health_emp,
            "section": "סעיף 345ב", "cap_section": "סעיף 345ב(ג)(1)", "with_work_section": "סעיף 345ב(ה)",
            "definition_he": "קצבה המשתלמת מכוח חיקוק או הסכם עבודה לפני גיל הפרישה, אחרי פרישה מוחלטת או חלקית (סעיף 345ב(א))",
            "exempt_he": "פטורים מניכוי מהפנסיה, באישור חתום מהביטוח הלאומי: אלמנה המקבלת קצבת שאירים או קצבת תלויים בנפגעי עבודה, ונכה המקבל קצבת נכות כללית בשיעור 75% (יציבה, או זמנית לשנה לפחות) או קצבת נכות מעבודה 100% לצמיתות",
            "exempt_url": PENSION_EXEMPT,
        },
        # Not working (RATES_NONE, from 1.1.2026).
        "none": {
            "url": RATES_NONE, "bl": 143, "health": 123, "total": 266,
            "passive": {"bl": [6.92, 7], "health": [5.17, 5.17]},
            "example": {"income": 12000, "base": 8558, "total": 1035},
            # s.342(a): an insured woman under chapter 3 only, as the wife of an insured man, does not pay; HEALTH_RATES: every
            # resident from 18 pays health insurance "except a homemaker (a married woman who does not work and whose spouse is insured)".
            "homemaker_he": "אישה נשואה שאינה עובדת ובן זוגה מבוטח פטורה מדמי ביטוח לאומי ובריאות",
            "homemaker_section": "סעיף 342(א) לחוק", "homemaker_url": HEALTH_RATES,
        },
        "student": {"total": 171, "url": STUDENT, "he": "תלמיד (סטודנט) שלא עובד: דמי ביטוח לאומי ובריאות בשיעור המינימום"},
        # Health insurance deducted from an old-age pension (HEALTH_PENSIONERS, from 1.1.2026).
        "oap_health": {"single": 237, "with_supplement": 123, "couple": 340, "url": HEALTH_PENSIONERS,
                       "other_income_he": "מי שמקבל קצבת אזרח ותיק פטור מדמי ביטוח בריאות על הכנסה אחרת"},
        # Several payers (s.342(b), (d), (e)): each employer pays as if it alone were the employer; the employee owes or is
        # refunded the difference against the contributions "as if paid by one employer". The secondary employer
        # deducts at the full rate also below the tier (s.342(e)(3)) once form 101 says there is other income (TEUM_MAIN).
        "coordination": {
            "section_each": "סעיף 342(ב)", "section_diff": "סעיף 342(ד)", "section_secondary": "סעיף 342(ה)(3)",
            "order_he": "שכר, הכנסה כעצמאי, הכנסה שלא מעבודה, פנסיה מוקדמת",
            "when_url": TEUM_WHEN, "main_url": TEUM_MAIN, "refund_url": TEUM_REFUND, "online_url": TEUM_ONLINE,
            "refund_years": 7,
            "form_low": {"number": "657", "he": "בקשה לתיאום עבור עובד או מקבל פנסיה מוקדמת ממספר מקורות הכנסה", "url": FORM_657,
                         "when_he": "ההכנסה אצל המעסיק העיקרי נמוכה ממדרגת הגבייה המופחתת"},
            "form_max": {"number": "752", "he": "בקשה לתיאום דמי ביטוח לבעלי הכנסות גבוהות מההכנסה המרבית", "url": FORM_752,
                         "when_he": "ההכנסה מכל המעסיקים יחד עולה על ההכנסה המרבית"},
            "current_year_he": "תיאום לשנה הנוכחית עושים דרך המעסיק או משלם הפנסיה, עם אישור לתיאום מהביטוח הלאומי",
        },
        # Self-employed advances: the dues calendar of 2026 (DUES_CALENDAR, month by month: "מועד דיווח ותשלום דמי ביטוח",
        # for the self-employed and employers); a standing order is charged on the 22nd for the month before (SE_HOWTOPAY).
        "dues": {
            "url": DUES_CALENDAR, "standing_order_day": 22, "howtopay_url": SE_HOWTOPAY,
            "dates": ["2026-01-15", "2026-02-15", "2026-03-15", "2026-04-15", "2026-05-15", "2026-06-15",
                      "2026-07-15", "2026-08-16", "2026-09-15", "2026-10-15", "2026-11-15", "2026-12-15"],
            "he": "מועד הדיווח והתשלום של דמי הביטוח לעצמאים ולמעסיקים, לפי לוח המועדים של הביטוח הלאומי",
        },
        "advance_fix": {"form": "672", "he": "בקשה לתיקון מקדמות", "url": FORM_672, "page_url": SE_TIKUN, "min_change_pct": 10,
                        "per_year": 4, "rule_he": "רק אם ההכנסה השתנתה ב-10% לפחות, פעם אחת בכל רבעון"},
        "personal_url": PERSONAL,
        # Retirement age (RETIREMENT): men 67; women by month of birth; the old-age pension is not income-tested from 70.
        "retirement": {
            "url": RETIREMENT, "men": [67, 0], "entitlement_age": 70,
            # [last birth month (YYYY-MM) of the row, years, months]; born after the last row: 65.
            "women": [["1944-06", 60, 0], ["1944-08", 60, 4], ["1945-04", 60, 8], ["1945-12", 61, 0], ["1946-08", 61, 4],
                      ["1947-04", 61, 8], ["1959-12", 62, 0], ["1960-12", 62, 4], ["1961-12", 62, 8], ["1962-12", 63, 0],
                      ["1963-12", 63, 3], ["1964-12", 63, 6], ["1965-12", 63, 9], ["1966-12", 64, 0], ["1967-12", 64, 3],
                      ["1968-12", 64, 6], ["1969-12", 64, 9]],
            "women_after": [65, 0],
        },
    }
