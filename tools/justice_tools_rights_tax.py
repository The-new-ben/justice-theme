"""The rights wave (21.10.2026): the income-tax dataset of the co.il tools registry (rights_tax), read by the credit-points
builder on /nekudot-zikui/ (nekudot-zikui) and the salaried refund calculator on /guide-tax-calculator-updated-2025/
(hechzer-mas). Loaded by tools/justice_tools_rights.py (RIGHTS_MODULES) when the registry is rebuilt with
--rights-checked-on.

Every value was read on checked_on from the Tax Authority's own publications and the Income Tax Ordinance:
- the yearly "לוח עזר לחישוב מס הכנסה ממשכורת ושכר עבודה" booklets for January 2020 to January 2026 (the 2026 booklet in
  its April 2026 edition, after the bracket law of 31.3.2026): the annual brackets, the surtax line of s.121ב, the credit
  point value of s.33א, the donation minimum and maximum of s.46;
- the Tax Authority's notices to employers on each change of the credit points: 18.5.2022 (the 2022 temporary extra
  point for children 6-12), 21.7.2022 (new immigrants, amendment 262), 3.1.2024 (the 2023 law: 6-12 extra point in 2022
  and 2023, 6-17 from 2024), 26.3.2024 (children up to three, amendment 271, from 1.1.2024), 16.12.2025 (reservists who
  served as combatants, s.39ב, amendment 283, from 1.1.2026), 30.3.2026 (the 2026 bracket law);
- the Ordinance on Nevo, the text current to 27.9.2026: ss.33א, 34-40ה, 45, 45א, 46, 121, 121ב, 159א, 160;
- the "דע זכויותיך" annual-report guide for 2025 (the children table, the degree rules before and from 2023, the
  discharged soldier, the returning minor), Form 101 for 2026, Form 106, Form 135 for 2025, and the gov.il service
  pages for Form 135 and for tax coordination.
Nothing here is estimated. A figure the sources do not hold is not in the file: the list of eligible towns (s.11) is a
link to the official list, not a percentage; interest and linkage on a refund (s.159א) are stated as a rule, not
computed, because the payment day is unknown.
"""
from __future__ import annotations

KEY = "rights_tax"

ORDINANCE = "https://www.nevo.co.il/law_html/law00/84255.htm"                    # פקודת מס הכנסה [נוסח חדש]
GOV = "https://www.gov.il/BlobFolder"
BOOKLETS_PAGE = "https://www.gov.il/he/pages/income-tax-monthly-deductions-booklet"
BOOKLET = GOV + "/generalpage/income-tax-monthly-deductions-booklet/he/"
B2020 = BOOKLET + "luachyanoar.pdf"                                                  # לוח עזר, ינואר 2020
B2021 = BOOKLET + "itc_itc_necuyim2021-1.pdf"                                        # לוח עזר, ינואר 2021
B_YEAR = BOOKLET + "generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-{y}.pdf"
EMP = GOV + "/dynamiccollectorresultitem/"
N_2022_KIDS = EMP + "employers-info-190522/he/IncomeTax_IncomeTaxRepresentInfo_employers-info-180522.pdf"   # 18.5.2022
N_2022_OLIM = EMP + "-1represent-info-27722/he/IncomeTax_IncomeTaxRepresentInfo_%C2%A0represent-info-%2027722.pdf"  # 21.7.2022
N_2024_KIDS = EMP + "employers-info-030124/he/IncomeTax_employers-info-030124.pdf"                          # 3.1.2024
N_2024_TODDLERS = EMP + "employers-info-260324/he/IncomeTax_employers-info-260324.pdf"                      # 26.3.2024
N_2025_RESERVE = EMP + "employers-info161225-1/he/IncomeTax_employers-info161225-1.pdf"                    # 16.12.2025
N_2026_BRACKETS = EMP + "employers-info-300326-1/he/IncomeTax_IncomeTaxEmployersInfo_employers-info-300326-1.pdf"  # 30.3.2026
GUIDE_2025 = GOV + "/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf"
FORM_101 = GOV + "/service/itc101/he/Service_Pages_Income_tax_annual-report-2024_itc101.pdf"
FORM_106 = GOV + "/service/itc-106/he/Service_Pages_Income_tax_itc106.pdf"
FORM_116 = GOV + "/service/tax-coordination-online/he/Service_Pages_Income_tax_annual-report-2024_itc116-2024.pdf"
FORM_135 = GOV + "/service/reporting-and-payment-2025-annual-tax-report-for-individuals/he/Service_Pages_Income_tax_annual-report-2026_itc135-2025.pdf"
SVC_135 = "https://www.gov.il/he/service/itc135"
SVC_COORD = "https://www.gov.il/he/service/tax-coordination-online"
ONLINE_135 = "https://secapp.taxes.gov.il/srbksOpentik/#/mainPage"
PERSONAL_AREA = "https://secapp.taxes.gov.il/srsherutatzmi"
SIM_REFUND = "https://secapp.taxes.gov.il/shSimulatorMas/main.aspx"
SIM_POINTS = "https://secapp.taxes.gov.il/srsimulatorNZ/#/simulator"
GUIDE_REFUND = "https://www.gov.il/he/Departments/Guides/tax-return-application-guide"


def _year(y: int, point: int, brackets: list, surtax: int, dmin: int, dmax: int, source_he: str, url: str, **extra) -> dict:
    """One tax year: the annual brackets ([upper limit or None, rate %]), the s.121ב line, the credit point a month, the
    s.46 donation minimum ("a sum exceeding") and maximum, and the booklet the figures were read from."""
    row = {
        "year": y,
        "point_month": point, "point_year": point * 12,
        "brackets": brackets,
        "surtax": {"threshold": surtax, "pct": 3},
        "donation": {"min": dmin, "max": dmax},
        "source_he": source_he, "url": url,
    }
    row.update(extra)
    return row


# The annual brackets of personal-exertion income (s.121(ב)(1) and s.121(א)), as each January booklet prints them.
BR_2020 = [[75960, 10], [108960, 14], [174960, 20], [243120, 31], [505920, 35], [None, 47]]
BR_2021 = [[75480, 10], [108360, 14], [173880, 20], [241680, 31], [502920, 35], [None, 47]]
BR_2022 = [[77400, 10], [110880, 14], [178080, 20], [247440, 31], [514920, 35], [None, 47]]
BR_2023 = [[81480, 10], [116760, 14], [187440, 20], [260520, 31], [542160, 35], [None, 47]]
BR_2024 = [[84120, 10], [120720, 14], [193800, 20], [269280, 31], [560280, 35], [None, 47]]
# 2026: the 20% bracket to 228,000 and the 31% bracket to 301,200, by the bracket law of 31.3.2026, retroactive to 1.1.2026.
BR_2026 = [[84120, 10], [120720, 14], [228000, 20], [301200, 31], [560280, 35], [None, 47]]

# The children table, per period: [first age, last age, points] for column 1 (a married woman, and an unmarried parent
# whose children live with him or her and who receives the child allowance: s.66(ג)(4), s.40(ב)(1)) and column 2 (a
# married man, and an unmarried parent whose children do not live with him or her: s.66(ג)(5), s.40(ב)(1א)). The age is
# the tax year minus the year of birth (0 = the year of birth, 18 = the year of majority).
KIDS_2020 = {
    "from": 2020, "to": 2021,
    "col1": [[0, 0, 1.5], [1, 5, 2.5], [6, 17, 1], [18, 18, 0.5]],
    "col2": [[0, 0, 1.5], [1, 5, 2.5]],
    "source_he": "הודעת רשות המסים למעסיקים, 18.5.2022: הטבלה \"לפני הוראת השעה\"; לוחות העזר 2020 ו-2021, פרק ז",
    "url": N_2022_KIDS,
}
KIDS_2022 = {
    "from": 2022, "to": 2023,
    "col1": [[0, 0, 1.5], [1, 5, 2.5], [6, 12, 2], [13, 17, 1], [18, 18, 0.5]],
    "col2": [[0, 0, 1.5], [1, 5, 2.5], [6, 12, 1]],
    "source_he": "חוק הגדלת נקודות זיכוי להורים במס הכנסה (הוראת שעה), התשפ\"ב-2022: נקודה נוספת לכל הורה לילד בן 6 עד 12, בשנים 2022 ו-2023 (הודעות רשות המסים 18.5.2022 ו-3.1.2024)",
    "url": N_2024_KIDS,
}
KIDS_2024 = {
    "from": 2024, "to": 2026,
    "col1": [[0, 0, 2.5], [1, 2, 4.5], [3, 3, 3.5], [4, 5, 2.5], [6, 17, 2], [18, 18, 0.5]],
    "col2": [[0, 0, 2.5], [1, 2, 4.5], [3, 3, 3.5], [4, 5, 2.5], [6, 17, 1]],
    "source_he": "חוק הגדלת נקודות זיכוי להורים במס הכנסה, התשפ\"ג-2023 (נקודה נוספת לילד בן 6 עד 17 מ-2024) וחוק סיוע להורים לילדים עד גיל שלוש, התשפ\"ד-2024 (תיקון 271: עוד נקודה בשנת הלידה, שתיים בגיל שנה ושנתיים ואחת בגיל שלוש, מ-1.1.2024)",
    "url": N_2024_TODDLERS,
}


def build(checked_on: str) -> dict:
    """The income-tax figures of 2020 to 2026 and the credit-point rules of each year, with the section and the source."""
    return {
        "name_he": "מס הכנסה לשכירים 2020 עד 2026: מדרגות, נקודות זיכוי והחזר מס",
        "publisher_he": "רשות המסים בישראל; פקודת מס הכנסה [נוסח חדש]",
        "source_name": "רשות המסים: לוח עזר לחישוב מס הכנסה ממשכורת ושכר עבודה, ינואר 2020 עד ינואר 2026 (מעודכן לאפריל 2026)",
        "source_url": BOOKLETS_PAGE,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "law_he": "פקודת מס הכנסה [נוסח חדש]",
        "law_url": ORDINANCE,
        "law_current_to": "2026-09-27",
        "current_year": 2026,
        "first_year": 2020,
        # Each tax year with the figures of its own January booklet (2025: the 2024 figures, frozen; 2026: frozen, and
        # the 20% and 31% brackets widened by the law of 31.3.2026).
        "years": {
            "2020": _year(2020, 219, BR_2020, 651600, 190, 9350000, "לוח עזר ינואר 2020", B2020),
            "2021": _year(2021, 218, BR_2021, 647640, 190, 9294000, "לוח עזר ינואר 2021 (מדד שלילי, 0.6%-)", B2021),
            "2022": _year(2022, 223, BR_2022, 663240, 190, 9517000, "לוח עזר ינואר 2022", B_YEAR.format(y=2022),
                          change_he="חוק הגדלת נקודות זיכוי להורים במס הכנסה (הוראת שעה) פורסם ב-18.5.2022, רטרואקטיבית מ-1.1.2022: נקודה נוספת לכל הורה לילד בן 6 עד 12",
                          change_url=N_2022_KIDS, change_ages=[6, 12]),
            "2023": _year(2023, 235, BR_2023, 698280, 200, 10019808, "לוח עזר ינואר 2023", B_YEAR.format(y=2023),
                          change_he="לפי לוח העזר של ינואר 2023 הנקודה הנוספת לילד בן 6 עד 12 ניתנה בתלוש רק עד פברואר 2023; חוק הגדלת נקודות זיכוי להורים במס הכנסה והרחבת מענק עבודה, התשפ\"ג-2023 (ספר החוקים 3048) החיל אותה על כל שנת 2023",
                          change_url=N_2024_KIDS, change_ages=[6, 12]),
            "2024": _year(2024, 242, BR_2024, 721560, 207, 10354816, "לוח עזר ינואר 2024", B_YEAR.format(y=2024),
                          change_he="חוק סיוע להורים לילדים עד גיל שלוש פורסם ב-20.3.2024, רטרואקטיבית מ-1.1.2024: עוד נקודה בשנת הלידה, שתיים בגיל שנה ושנתיים ואחת בגיל שלוש",
                          change_url=N_2024_TODDLERS, change_ages=[0, 3]),
            "2025": _year(2025, 242, BR_2024, 721560, 207, 10354816, "לוח עזר ינואר 2025 (הקפאה)", B_YEAR.format(y=2025), frozen=True),
            "2026": _year(2026, 242, BR_2026, 721560, 207, 10354816, "לוח עזר ינואר 2026, מעודכן לאפריל 2026", B_YEAR.format(y=2026),
                          frozen=True, change_he="מדרגת 20% עד 228,000 ומדרגת 31% עד 301,200 בשנה, רטרואקטיבית מ-1.1.2026 (חוק ההתייעלות הכלכלית 2026, פורסם 31.3.2026)",
                          change_url=N_2026_BRACKETS),
        },
        # The freeze of 2025-2027: no indexation of the s.120ב amounts on 1 January of those years.
        "freeze": {
            "he": "חוק ההתייעלות הכלכלית (תיקוני חקיקה להשגת יעדי התקציב לשנת התקציב 2025) (הקפאת עדכוני מס ומס יסף), התשפ\"ה-2024: ב-1 בינואר 2025 עד 2027 לא מתואמים הסכומים שמתואמים לפי סעיף 120ב",
            "from": 2025, "to": 2027, "law_he": "ספר החוקים 3342, 26.12.2024", "url": B_YEAR.format(y=2025),
        },
        "brackets_section": "סעיף 121",
        "surtax_section": "סעיף 121ב",
        "surtax_capital_he": "מ-2025 עוד 2% על הכנסה ממקורות הוניים מעל אותו סכום (סעיף 121ב(א1)); לא חל על משכורת",
        "point_section": "סעיף 33א",
        # The credit points of the individual (Ordinance, the text current to 27.9.2026; the 2025 guide, chapter ד).
        "points": {
            "resident": {"pts": 2, "section": "סעיף 34", "he": "תושב ישראל"},
            "travel": {"pts": 0.25, "section": "סעיף 36", "he": "זיכוי נסיעה לתושב ישראל"},
            "woman": {"pts": 0.5, "section": "סעיף 36א", "he": "אישה"},
            "spouse": {"pts": 1, "section": "סעיף 37", "he": "בן או בת זוג שכלכלתם עליכם, כשאחד מכם הגיע לגיל פרישה או עיוור או נכה לפי סעיף 9(5)"},
            "single_parent": {"pts": 1, "section": "סעיף 40(ב)(2)", "he": "הורה במשפחה חד-הורית שהילדים אצלו, מקבל בגינם קצבת ילדים ולא מנהל משק בית משותף עם יחיד אחר"},
            "sole_parent": {"pts": 1, "section": "סעיף 40(ב)(1ב)", "he": "הורה יחיד: ההורה השני נפטר או לא רשום במרשם האוכלוסין; מקבל את שתי העמודות ועוד נקודה"},
            "support": {"pts": 1, "section": "סעיף 40(ב)(2)", "he": "הורה החי בנפרד שהילדים לא אצלו ומשתתף בכלכלתם לפי פסק דין (נקודה אחת, או חלק ממנה לפי חלקו)"},
            "alimony": {"pts": 1, "section": "סעיף 40א", "he": "גרוש שנישא שוב ומשלם מזונות לבן הזוג לשעבר"},
            "disabled_child": {"pts": 2, "section": "סעיף 45(א)", "he": "לכל ילד משותק, עיוור או עם מוגבלות שכלית-התפתחותית; לאחד מבני הזוג, לפי בחירתם; לא יחד עם זיכוי לפי סעיף 44"},
            "kids_sections": {"married_woman": "סעיף 66(ג)(4)", "married_man": "סעיף 66(ג)(5)", "single_with": "סעיף 40(ב)(1)", "single_without": "סעיף 40(ב)(1א)"},
            "kids_max_age": 18,
            "kids_single_max_age": 18,
            "kids_move_he": "אם רשאית להעביר נקודה אחת משנת הלידה לשנה שאחריה (טופס 116ד); הסכום הכולל לא משתנה",
            "kids": [KIDS_2020, KIDS_2022, KIDS_2024],
            # Discharged soldiers and national service (s.39א): 36 months from the month after the month of discharge.
            "soldier": {
                "months": 36, "full_rate_num": 1, "full_rate_den": 6, "short_rate_num": 1, "short_rate_den": 12,
                "min_months_man": 23, "min_months_woman": 22, "section": "סעיף 39א",
                "he": "חייל משוחרר: 1/6 נקודה לחודש (2 בשנה) ב-36 החודשים שאחרי חודש השחרור, אם שירת לפחות 23 חודשים מלאים (גבר) או 22 (אישה); אחרת 1/12 לחודש. שירות לאומי נחשב שירות סדיר",
                "url": GUIDE_2025,
            },
            # New immigrants (s.35): monthly fractions from the month of entry; amendment 262 for those who came from 1.1.2022.
            "immigrant": {
                "reform_from": "2022-01-01", "section": "סעיף 35(א)",
                "before": [[18, 1, 4], [12, 1, 6], [12, 1, 12]],
                "after": [[12, 1, 12], [18, 1, 4], [12, 1, 6], [12, 1, 12]],
                "he": "עולה: חלקי נקודה לכל חודש מחודש העלייה; מי שעלה מ-1.1.2022: 1/12 ב-12 החודשים הראשונים, 1/4 ב-18 הבאים, 1/6 ב-12 ו-1/12 ב-12 (54 חודשים); לפני כן: 1/4 ב-18, 1/6 ב-12 ו-1/12 ב-12 (42 חודשים). קטין חוזר (עזב כקטין וחזר אחרי 5 שנים לפחות) נחשב עולה",
                "returning_he": "תושב חוזר ותיק או תושב חוזר: אין נקודות זיכוי לפי סעיף 35, מלבד מי ששב בין 16.5.2010 ל-30.9.2012 (תקופת 54 החודשים שלו הסתיימה לפני 2020). להקלות אחרות (הוראת השעה לשנים 2026 עד 2030) יש בקשה נפרדת",
                "url": N_2022_OLIM,
            },
            # Degrees and professional certificates (ss.40ג-40ה). The temporary rule for those who finished in 2014-2022;
            # the Ordinance's own rule for those who finished from 1.1.2023.
            "degree": {
                "sections": {"ba": "סעיף 40ג(א)", "ma": "סעיף 40ג(א)", "med": "סעיף 40ג(ד)(1)", "cert": "סעיף 40ד", "either": "סעיף 40ה"},
                "rule_from": 2023,
                "rule": {"ba": [1, 3], "ma": [0.5, 2], "cert": [1, 3], "med": [[1, 3], [0.5, 2]]},
                "temp": {"from": 2014, "to": 2022, "ba": 1, "ma": 0.5, "cert": 1, "med": [1, 0.5]},
                "rule_he": "מי שסיים מ-1.1.2023: תואר ראשון 1 נקודה לכל שנת לימודים, עד 3 שנים; תואר שני חצי נקודה לשנה, עד 2; תעודת מקצוע 1 נקודה לשנה, עד 3; תואר שלישי ברפואה או ברפואת שיניים 1 נקודה ב-3 שנים ועוד חצי ב-2; מהשנה שאחרי סיום הלימודים",
                "temp_he": "מי שסיים בשנים 2014 עד 2022 (הוראת השעה): נקודה אחת לתואר ראשון או לתעודת מקצוע וחצי נקודה לתואר שני, בשנה אחת בלבד: השנה שאחרי הסיום או זו שאחריה, לפי בחירה",
                "form_he": "טופס 119: הצהרה על סיום לימודים, עם אישור הזכאות",
                "url": GUIDE_2025,
            },
            # Reservists who served as combatants (s.39ב, amendment 283): days in the previous tax year; from 2026.
            "reservist": {
                "from_year": 2026, "section": "סעיף 39ב",
                "temp_years": [2026, 2027],
                "temp_bands": [[30, 39, 0.5], [40, 49, 0.75]],
                "base_days": 50, "base_pts": 1, "step_days": 5, "step_pts": 0.25, "max_pts": 4,
                "he": "מי ששירת במילואים כלוחם בשנה הקודמת: 2026 ו-2027 (הוראת שעה): 30 עד 39 ימים חצי נקודה, 40 עד 49 שלושה רבעים, 50 ימים נקודה אחת ועוד רבע לכל 5 ימים נוספים, עד 4 נקודות. לפי אישור צה\"ל בלבד",
                "url": N_2025_RESERVE,
            },
            "youth_he": "מי שמלאו לו או לבן זוגו 16 ועוד לא 18: נקודה (סעיף 40ב); לא בחישוב",
        },
        # What a salaried employee writes on Form 101 (2026), part ח, for each category.
        "form101": {
            "url": FORM_101, "year": 2026,
            "items": {
                "resident": "חלק ח, סעיף 1", "immigrant": "חלק ח, סעיף 4", "spouse": "חלק ח, סעיף 5",
                "single_parent": "חלק ח, סעיף 6", "kids_col1": "חלק ח, סעיף 7", "kids_col2": "חלק ח, סעיף 8",
                "sole_parent": "חלק ח, סעיף 9", "support": "חלק ח, סעיף 10", "disabled_child": "חלק ח, סעיף 11",
                "alimony": "חלק ח, סעיף 12", "soldier": "חלק ח, סעיף 14", "degree": "חלק ח, סעיף 15 (וטופס 119)",
                "reservist": "חלק ח, סעיף 16 (ואישור צה\"ל)", "woman": "חלק ב: מין", "kids_list": "חלק ג: הילדים ושנות הלידה",
                "one_employer": "חלק ה: \"אבקש לקבל נקודות זיכוי ומדרגות מס כנגד הכנסתי זו\" אצל מעסיק אחד בלבד",
            },
            "when_he": "ממלאים בתחילת העבודה ובתחילת כל שנת מס, ומודיעים על שינוי תוך שבוע",
        },
        # Two employers: the points and the brackets at one; tax coordination for the other (Form 116 or online).
        "coordination": {
            "he": "יותר ממעסיק אחד: את נקודות הזיכוי והמדרגות מקבלים אצל מעסיק אחד (טופס 101, חלק ה). כדי שהמעסיק השני לא ינכה מס מרבי, עורכים תיאום מס לשנה הנוכחית: מקוון באזור האישי או בטופס 116 לפקיד השומה",
            "service_url": SVC_COORD, "form_url": FORM_116, "form": "116",
            "current_year_only_he": "תיאום מס עורכים לשנה הנוכחית בלבד; על שנים שעברו מבקשים החזר",
        },
        # Form 106 (what the employer gives after the year) and the Form 135 fields the figures go to.
        "form106": {
            "url": FORM_106,
            "fields": {
                "months": {"where": "חלק א, למעלה: חודשי העבודה 1 עד 12", "field": ""},
                "salary": {"where": "חלק א, סעיף 1: משכורת", "field": "158/172"},
                "tax": {"where": "חלק ב, סעיף 13: מס הכנסה שנוכה ושולם (כולל מס נוסף)", "field": "042"},
                "pension": {"where": "חלק ב, סעיף 15: לקופת גמל לקצבה כעמית שכיר", "field": "045/086"},
                "life": {"where": "חלק ב, סעיף 15: לביטוח חיים", "field": "036/081"},
                "donations": {"where": "חלק ב, סעיף 15: לתרומות למוסדות ציבור", "field": "037/237"},
                "points": {"where": "חלק ג, סעיף 16: מספר נקודות הזיכוי שניתנו", "field": ""},
            },
            "two_fields_he": "המספר הראשון לבן הזוג הרשום, השני לבן או בת הזוג",
        },
        # The refund: Form 135, six years back, and the interest and linkage rule (stated, not computed).
        "refund": {
            "years_back": 6, "section": "סעיף 160(א)",
            "he": "בקשה להחזר מס על שנה מסוימת מגישים עד שש שנים אחריה: על 2020 עד 31.12.2026, על 2021 עד 31.12.2027, וכן הלאה",
            "interest": {
                "pct": 4, "section": "סעיף 159א(א) ו-(ג); סעיף 160(א)",
                "he": "ההחזר משולם עם הפרשי הצמדה למדד וריבית של 4% לשנה, מתום שנת המס או מיום התשלום, המאוחר, ועד יום ההחזר. הסכום תלוי ביום התשלום ולכן לא מחושב כאן",
            },
            "form_url": FORM_135, "service_url": SVC_135, "online_url": ONLINE_135, "personal_url": PERSONAL_AREA,
            "guide_url": GUIDE_REFUND, "simulator_url": SIM_REFUND,
            "documents": [
                "טופס 106 מכל מעסיק ומכל משלם קצבה, לכל שנה (גם לבן או בת הזוג)",
                "אישורים מהמוסד לביטוח לאומי על דמי אבטלה, דמי לידה, תגמולי מילואים או דמי פגיעה, אם היו",
                "קבלות על תרומות למוסד ציבורי מוכר (סעיף 46)",
                "אישורים שנתיים על ביטוח חיים וקופת גמל לקצבה ששילמתם בעצמכם",
                "לפי העניין: טופס 119 ואישור זכאות לתואר; תעודת שחרור; תעודת עולה; פסק דין למזונות; טופס 116א לילד עם מוגבלות",
                "צילום צ'ק או אישור בנק לחשבון שאליו יועבר ההחזר",
            ],
        },
        "donation": {"pct": 35, "income_cap_pct": 30, "section": "סעיף 46(א)", "carry_years": 3,
                     "he": "תרומה למוסד ציבורי מוכר או לקרן לאומית: זיכוי של 35% מהתרומות בשנה, כשהסך עולה על המינימום של אותה שנה; עד 30% מההכנסה החייבת או עד התקרה השנתית, הנמוך; היתרה עוברת ל-3 השנים הבאות"},
        "insurance": {"life_pct": 25, "pension_pct": 35, "section": "סעיף 45א",
                      "he": "ביטוח חיים: זיכוי של 25% מהפרמיה; קופת גמל לקצבה ששילמתם בעצמכם: 35%. שניהם בתוך תקרות סעיף 45א(ד) ו-(ה), שמחושבות יחד עם ההפרשות שבתלוש, ולכן הכלי מציג את הזיכוי האפשרי בנפרד ולא מוסיף אותו להחזר"},
        "towns": {"section": "סעיף 11", "url": B_YEAR.format(y=2026),
                  "he": "תושבי יישוב מוטב מקבלים הנחה באחוזים עד תקרה, לפי רשימת היישובים של כל שנה (לוח העזר, פרק ח). הכלי לא מחשב את ההנחה"},
        "immigrant_relief_he": "עולה חדש או תושב חוזר ותיק שהגיע בין 5.11.2025 ל-31.12.2026: פטור על הכנסה מיגיעה אישית בשנים 2026 עד 2030 עד תקרה שנתית (הוראת השעה, חוק ההתייעלות הכלכלית 2026); לא בחישוב",
        "simulators": {"points": SIM_POINTS, "refund": SIM_REFUND},
        "booklets_url": BOOKLETS_PAGE,
        "guide_url": GUIDE_2025,
    }
