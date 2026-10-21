"""The contractor-purchase instrument (the family + land wave, 22.10.2026, HAD-579): buying a new apartment from a
contractor, three clocks in one: the payments and their linkage to the residential building input index, the
compensation for a late delivery, and the inspection / warranty periods after delivery; plus the securities the
Investments Law requires for every payment.

Every value was read on checked_on from the official text named next to it:
- חוק המכר (דירות), התשל"ג-1973, consolidated text (the open law book, revision of 25.12.2025, which carries
  amendment 9, ס"ח תשפ"ב 914): s.4 (non-conformity; inspection period = the addendum, warranty period = 3 years from
  its end, 20 years for a fundamental non-conformity), s.4א (notice: one year for what could be found at delivery),
  s.4ב (the right to repair; two years of repeated repairs), s.5א (delay compensation: two versions, for contracts
  made from 7.7.2022 and up to 6.7.2022), s.5ב (arrears interest only after 7 days), s.5ג (linkage, contracts from
  7.7.2022), s.7א(ב) (a waiver as a condition of delivery is void), the addendum (the ten inspection periods);
- the Ministry of Construction and Housing page on amendment 9 (published 5.7.2022): in force 7.7.2022, for contracts
  made from that day; the first 20% of the price never linked; the tiers of the compensation;
- חוק המכר (דירות) (הבטחת השקעות של רוכשי דירות), התשל"ה-1974 (consolidated text with the 2026 amendment, ס"ח
  תשפ"ו 365): ss.2, 2א, 2א1, 3, 3א, 3א1, 3ב, 3ג, 3ג2;
- the Central Bureau of Statistics price-index API, series 200010 (מדד מחירי תשומה בבנייה למגורים - כללי), every month
  from 1.2015 to the latest published month, as published (base July 2011 = 100 up to July 2025, base July 2025 = 100
  from August 2025), and the CBS linkage calculator API for the chaining coefficient between the two bases (1.387)
  and for the day an index becomes the "known" one (probes on 22.10.2026: on the 15th the previous index still
  applies, from the 16th the new one).
Nothing here is estimated: the rent of a similar apartment, the price and the dates are the user's own inputs; a month
the CBS has not published is not in the file, and the tool says so in words.
"""
from __future__ import annotations

KEY = "fl_kablan"

LAW = "https://he.wikisource.org/wiki/חוק_המכר_(דירות)"                                     # חוק המכר (דירות), התשל"ג-1973
INV = "https://he.wikisource.org/wiki/חוק_המכר_(דירות)_(הבטחת_השקעות_של_רוכשי_דירות)"      # חוק ההבטחה, התשל"ה-1974
GOV9 = "https://www.gov.il/he/pages/9th-amendment"                                          # משרד הבינוי והשיכון, תיקון 9
REMEDIES = "https://he.wikisource.org/wiki/חוק_החוזים_(תרופות_בשל_הפרת_חוזה)"               # s.18 (frustration)
CBS_API = "https://api.cbs.gov.il/index/data/price?id=200010&format=json&download=false"
CBS_CALC_API = "https://api.cbs.gov.il/index/data/calculator/200010"
# The CBS linkage calculator (the old /he/Pages/מחשבון-הצמדה.aspx address is a 404 since the CBS site moved, checked 22.10.2026).
CBS_CALC = "https://www.cbs.gov.il/he/CBSNewBrand/Pages/Calculator.aspx"
SMALL_FORM = "https://www.gov.il/he/service/filing_a_small_claim"

# CBS series 200010, as published (read 22.10.2026 from CBS_API, startPeriod 01-2015). Base July 2011 = 100.
SERIES_2011 = (
    "2015-01=106.5 2015-02=106.4 2015-03=106.6 2015-04=106.6 2015-05=106.6 2015-06=106.6 2015-07=106.7 2015-08=106.9 2015-09=107.0 2015-10=107.1 "
    "2015-11=107.0 2015-12=107.4 2016-01=107.7 2016-02=107.5 2016-03=107.5 2016-04=107.8 2016-05=108.0 2016-06=108.1 2016-07=108.5 2016-08=108.5 "
    "2016-09=108.8 2016-10=108.8 2016-11=109.0 2016-12=109.0 2017-01=109.0 2017-02=109.2 2017-03=109.2 2017-04=109.4 2017-05=109.4 2017-06=109.6 "
    "2017-07=109.8 2017-08=110.3 2017-09=110.5 2017-10=110.7 2017-11=110.8 2017-12=111.1 2018-01=111.7 2018-02=112.0 2018-03=112.1 2018-04=112.4 "
    "2018-05=112.5 2018-06=112.6 2018-07=112.9 2018-08=113.1 2018-09=113.1 2018-10=113.2 2018-11=113.2 2018-12=113.3 2019-01=114.0 2019-02=114.1 "
    "2019-03=114.1 2019-04=114.2 2019-05=114.3 2019-06=114.3 2019-07=114.3 2019-08=114.4 2019-09=114.4 2019-10=114.3 2019-11=114.3 2019-12=114.5 "
    "2020-01=114.7 2020-02=114.7 2020-03=114.9 2020-04=114.8 2020-05=114.7 2020-06=114.7 2020-07=114.7 2020-08=114.8 2020-09=114.7 2020-10=114.6 "
    "2020-11=114.6 2020-12=115.1 2021-01=115.8 2021-02=116.0 2021-03=116.6 2021-04=117.5 2021-05=118.3 2021-06=119.0 2021-07=119.3 2021-08=120.0 "
    "2021-09=120.3 2021-10=120.6 2021-11=121.2 2021-12=121.5 2022-01=122.5 2022-02=123.1 2022-03=124.3 2022-04=125.5 2022-05=126.1 2022-06=126.8 "
    "2022-07=127.4 2022-08=127.5 2022-09=127.5 2022-10=127.5 2022-11=127.3 2022-12=127.3 2023-01=128.8 2023-02=128.6 2023-03=128.9 2023-04=129.3 "
    "2023-05=129.2 2023-06=129.6 2023-07=129.3 2023-08=129.4 2023-09=129.5 2023-10=129.7 2023-11=129.8 2023-12=129.8 2024-01=130.2 2024-02=129.9 "
    "2024-03=130.2 2024-04=130.1 2024-05=130.7 2024-06=131.2 2024-07=131.7 2024-08=132.0 2024-09=132.5 2024-10=132.8 2024-11=133.2 2024-12=133.6 "
    "2025-01=137.1 2025-02=137.7 2025-03=138.2 2025-04=138.4 2025-05=138.6 2025-06=138.6 2025-07=138.7 "
)
# Base July 2025 = 100 (from August 2025).
SERIES_2025 = (
    "2025-08=100.4 2025-09=100.4 2025-10=100.5 2025-11=101.1 2025-12=101.2 2026-01=101.3 2026-02=101.5 2026-03=101.7 2026-04=102.8 2026-05=103.4 "
    "2026-06=103.6 2026-07=103.5 2026-08=103.9 2026-09=104.0 "
)


def _series(text: str) -> dict:
    out = {}
    for pair in text.split():
        month, value = pair.split("=")
        out[month] = float(value)
    return out


def _rule(he: str, section: str, url: str = LAW) -> dict:
    return {"he": he, "section": section, "url": url}


# The addendum of the Sale (Apartments) Law (s.4): the inspection period of each kind of defect, in years (with a short
# label for the clock).
ADDENDUM = [
    (1, "מסגרות ונגרות, כולל אלומיניום ופלסטיק (ליקוי)", "מסגרות ונגרות", 2),
    (2, "ריצוף וחיפוי פנים, כולל שקיעות ושחיקה (ליקוי)", "ריצוף וחיפוי פנים", 2),
    (3, "מכונות ודוודים (כשל בתפקוד ובעמידות)", "מכונות ודוודים", 3),
    (4, "פיתוח החצר, חניות, מדרכות ושבילים ומערכותיהם (ליקוי)", "פיתוח החצר", 3),
    (5, "מערכות הבידוד התרמי (כשל)", "בידוד תרמי", 3),
    (6, "צנרת: מים, הסקה, מרזבים, דלוחין וביוב, כולל נזילות (כשל)", "צנרת ונזילות", 4),
    (7, "איטום המבנה: חללים תת-קרקעיים, קירות, תקרות וגגות (כשל)", "איטום", 4),
    (8, "סדקים ברוחב של יותר מ-1.5 מ\"מ ברכיבים לא נושאים", "סדקים", 5),
    (9, "התנתקות, התקלפות או התפוררות של חיפויי חוץ", "חיפויי חוץ", 7),
    (10, "כל אי-התאמה אחרת שאינה יסודית", "כל ליקוי אחר", 1),
]


def build(checked_on: str) -> dict:
    s2011 = _series(SERIES_2011)
    s2025 = _series(SERIES_2025)
    latest = max(s2025)
    return {
        "name_he": "קניית דירה מקבלן: תשלומים והצמדה, איחור במסירה, בדק ואחריות, ובטוחות",
        "publisher_he": "הכנסת (חוק המכר (דירות) וחוק ההבטחה), משרד הבינוי והשיכון, הלשכה המרכזית לסטטיסטיקה",
        "source_name": "חוק המכר (דירות), התשל\"ג-1973, בנוסח תיקון מס' 9 (התשפ\"ב-2022)",
        "source_url": LAW,
        "checked_on": checked_on,
        "refresh_every_days": 31,
        # The index of October 2026 becomes the known one from 16.11.2026 (CBS calculator rule: known from the 16th).
        "next_update": "2026-11-16",
        "law": {
            "he": "חוק המכר (דירות), התשל\"ג-1973",
            "url": LAW,
            "amend9_he": "חוק המכר (דירות) (תיקון מס' 9), התשפ\"ב-2022",
            "amend9_from": "2022-07-07",
            "amend9_url": GOV9,
            "amend9_page_he": "משרד הבינוי והשיכון: תיקון מספר 9 לחוק המכר (דירות), פורסם 5.7.2022",
            # s.11(ד) of the open law book prints "7.7.2023" as the day amendment 9 began, while the section notes
            # and the ministry page say 7.7.2022; the ministry page is followed (notes.md, open questions).
            "amend9_section": "סעיף 11(ד)",
        },
        "index": {
            "code": 200010,
            "name_he": "מדד מחירי תשומה בבנייה למגורים - כללי",
            "publisher_he": "הלשכה המרכזית לסטטיסטיקה",
            "source_url": CBS_API,
            "calculator_api": CBS_CALC_API,
            "official_calculator_url": CBS_CALC,
            "latest_month": latest,
            "known_from_day": 16,
            "known_rule_he": "מדד של חודש מסוים הוא המדד הידוע מה-16 בחודש שאחריו: כך מחשבון ההצמדה של הלמ\"ס מיישם (נבדק ב-15 וב-16 בינואר, בספטמבר ובאוקטובר 2026)",
            "bases": [
                {"id": "2011-07", "label_he": "יולי 2011 = 100", "to": "2025-07"},
                {"id": "2025-07", "label_he": "יולי 2025 = 100", "from": "2025-08"},
            ],
            # Old-base value of the new base month (July 2025 = 138.7 in base July 2011): the CBS calculator API returns
            # "chaining_coefficient": 1.387 for any period that crosses the change of base.
            "chaining": {"from_base": "2011-07", "to_base": "2025-07", "coefficient": 1.387, "url": CBS_CALC_API,
                         "he": "מקדם הקישור בין הבסיסים, כפי שמחשבון הלמ\"ס מחזיר"},
            "series_2011": s2011,
            "series_2025": s2025,
            # A CBS calculator answer kept for the golden test: 100 NIS from 6.1.2025 (index of 11.2024 = 133.2, base
            # 2011) to 9.1.2026 (index of 11.2025 = 101.1, base 2025) = 105.27.
            "calc_check": {"from_month": "2024-11", "to_month": "2025-11", "sum": 100, "to_value": 105.27},
        },
        "linkage": {
            "from": "2022-07-07",
            "max_share_pct": 50,
            "unlinked_first_pct": 20,
            "none": _rule("תשלום של הקונה למוכר לא יוצמד לשום מדד ולא תיווסף לו ריבית, חוץ מריבית פיגורים", "סעיף 5ג(א)"),
            "half": _rule("מותר להסכים שעד מחצית מכל תשלום תוצמד למדד תשומות הבנייה, ובלבד ש-20% מהמחיר החוזי המשולמים במועד החתימה או לפני כל תשלום אחר לא יוצמדו", "סעיף 5ג(ב)"),
            "until": _rule("ההצמדה נמשכת עד מועד שאינו מאוחר ממועד המסירה שבחוזה; כשהאיחור באשמת הקונה בלבד או בנסיבות של סיכול, התקרה הזאת לא חלה", "סעיף 5ג(ג)"),
            "index_def": _rule("המדד: מדד מחירי תשומה בבנייה למגורים שמפרסמת הלמ\"ס, שפורסם לאחרונה לפני מועד ההצמדה", "סעיף 5ג(ד)"),
            "first20_he": "20% הראשונים מהמחיר אינם צמודים לעולם (דף משרד הבינוי והשיכון)",
            "first20_url": GOV9,
            "old_he": "בחוזה שנחתם עד 6.7.2022 החוק לא מגביל את ההצמדה: היא נקבעת בחוזה (סעיף 11(ד) והנוסח שלפני תיקון 9)",
            "secured": _rule("הכספים המובטחים בערבות או בפוליסה צמודים לפי שיטת ההצמדה שבחוזה, ואם אין, למדד תשומות הבנייה", "סעיף 3א1 לחוק ההבטחה", INV),
        },
        "delay": {
            "new": {
                "from": "2022-07-07",
                "section": "סעיף 5א(א)",
                "grace_months": 1,
                "tiers": [
                    {"from_month": 2, "to_month": 4, "mult": 1, "item": "סעיף 5א(א)(1)"},
                    {"from_month": 5, "to_month": 10, "mult": 1.25, "item": "סעיף 5א(א)(2)"},
                    {"from_month": 11, "to_month": None, "mult": 1.5, "item": "סעיף 5א(א)(3)"},
                ],
                "rule": _rule("אם הדירה לא נמסרה כשחלף חודש מהמועד שבחוזה, הקונה זכאי לפיצוי בלי להוכיח נזק, על כל חודש או חלק ממנו מתום החודש הראשון ועד המסירה, או לפיצוי שבחוזה, הגבוה מביניהם", "סעיף 5א(א)"),
                "pay": _rule("הפיצוי משולם בתום כל חודש, בעד אותו חודש", "סעיף 5א(ב)"),
                "except": _rule("אין פיצוי לפי הסעיף אם האיחור נגרם רק בגלל הקונה, או בנסיבות של סיכול לפי סעיף 18(א) לחוק החוזים (תרופות)", "סעיף 5א(ג)"),
            },
            "old": {
                "to": "2022-07-06",
                "section": "סעיף 5א(א) (נוסח לחוזים עד 6.7.2022)",
                "grace_days": 60,
                "tiers": [
                    {"from_month": 1, "to_month": 8, "mult": 1.5, "item": "סעיף 5א(א)(1) בנוסח הקודם"},
                    {"from_month": 9, "to_month": None, "mult": 1.25, "item": "סעיף 5א(א)(2) בנוסח הקודם"},
                ],
                "rule": _rule("אם הדירה לא נמסרה כשחלפו 60 ימים מהמועד שבחוזה, הקונה זכאי לפיצוי בלי להוכיח נזק, על כל חודש או חלק ממנו מהמועד שבחוזה ועד המסירה, או לפיצוי שבחוזה, הגבוה מביניהם", "סעיף 5א(א) בנוסח הקודם"),
                "pay": _rule("הפיצוי משולם בתום כל חודש; הפיצוי בעד 60 הימים הראשונים משולם בתום 60 הימים", "סעיף 5א(ב) בנוסח הקודם"),
                "except": _rule("הצדדים יכלו להסכים שהפיצוי לא יחול על איחור מנסיבות שאינן בשליטת המוכר ושהסיכון להן אינו מוטל עליו", "סעיף 5א(ג) בנוסח הקודם"),
            },
            "rent_he": "דמי שכירות של דירה דומה בגודלה ובמיקומה: החוק לא קובע סכום, לכן מקלידים את שכר הדירה של דירה דומה (מודעות, שמאי)",
            "waiver": _rule("ויתור על זכויות האיחור או הליקויים, כתנאי למסירת הדירה, לתיקונים או להעברת זכויות, בטל", "סעיף 7א(ב)"),
            "frustration_url": REMEDIES,
        },
        "warranty": {
            "inspection": _rule("תקופת בדק: התקופה שבתוספת לחוק לכל סוג ליקוי, מיום העמדת הדירה לרשות הקונה; אי-התאמה שהתגלתה בה היא באחריות המוכר אלא אם הוכיח שהקונה גרם לה", "סעיפים 4(א)(2) ו-4(ג)"),
            "warranty_years": 3,
            "warranty": _rule("תקופת אחריות: שלוש שנים מתום תקופת הבדק; בה הקונה צריך להוכיח שמקור אי-ההתאמה בתכנון, בעבודה או בחומרים", "סעיפים 4(א)(3) ו-4(ג)"),
            "fundamental_years": 20,
            "fundamental": _rule("אי-התאמה יסודית (בחלקים הנושאים של הבניין, היציבות והבטיחות): 20 שנים מהמסירה; גם אחר כך אם הקונה מוכיח שמקורה בתכנון, בעבודה או בחומרים", "סעיף 4(א)(4) ו-(5)"),
            "visible_years": 1,
            "visible": _rule("אי-התאמה שאפשר היה לגלות במסירה: מודיעים למוכר תוך שנה מהמסירה", "סעיף 4א(א)(1)"),
            "hidden": _rule("אי-התאמה שלא אפשר היה לגלות בבדיקה סבירה: מודיעים תוך זמן סביר מהגילוי", "סעיף 4א(א)(2) ו-(ב)"),
            "repair": _rule("נותנים למוכר הזדמנות לתקן; אם הליקוי חזר תוך שנתיים מההודעה, או שתיקון דחוף לא נעשה בזמן סביר, הקונה רשאי לתקן על חשבון המוכר", "סעיף 4ב"),
            "items": [{"n": n, "he": he, "short_he": short, "years": years, "item": f"התוספת, פרט ({n})"} for n, he, short, years in ADDENDUM],
        },
        "arrears": {"days": 7, "rule": _rule("ריבית פיגורים על תשלום של הקונה רק אחרי 7 ימים מהמועד שבחוזה, ובשיעור שקבע השר", "סעיף 5ב")},
        "registration": _rule("רישום הבית המשותף תוך שנה מרישום החלוקה או מהמסירה (המאוחר), ורישום הזכויות של הקונה תוך 6 חודשים מרישום הבית או מהמסירה (המאוחר)", "סעיף 6ב"),
        "legal_fees": _rule("השתתפות הקונה בשכר עורך הדין של המוכר מוגבלת בתקנות, והקונה משלם ישירות לעורך הדין ומקבל חשבונית", "סעיף 6ג"),
        "guarantee": {
            "law_he": "חוק המכר (דירות) (הבטחת השקעות של רוכשי דירות), התשל\"ה-1974",
            "url": INV,
            "free_pct": 7,
            "free": _rule("המוכר לא יקבל יותר מ-7% מהמחיר אלא אם נתן לקונה אחת מהבטוחות שבחוק", "סעיף 2", INV),
            "securities": [
                _rule("ערבות בנקאית (או מנותן ערבות אחר) להחזר כל הכספים ששולמו, בלי רכיב המע\"מ", "סעיף 2(1)", INV),
                _rule("פוליסת ביטוח שהקונה מוטב בה ודמי הביטוח שולמו מראש", "סעיף 2(2)", INV),
                _rule("משכנתה ראשונה על הדירה או על חלק יחסי מהקרקע לטובת הקונה", "סעיף 2(3)", INV),
                _rule("הערת אזהרה על הדירה או על חלק יחסי מהקרקע, בלי שעבוד או עיקול שקודמים לה", "סעיף 2(4)", INV),
                _rule("העברת הבעלות או הזכות בדירה על שם הקונה, נקייה משעבוד ומעיקול", "סעיף 2(5)", INV),
            ],
            "notice": _rule("בחתימה המוכר מודיע בכתב על הזכות לבטוחה ועל דרכיה; מוכר בלי ליווי בנקאי מודיע על כך בכתב עד החתימה", "סעיף 2א1", INV),
            "voucher": _rule("בפרויקט בליווי משלמים רק בשוברים מפנקס השוברים, לחשבון הליווי", "סעיף 3ב(ג)-(ד)", INV),
            "days_business": 14,
            "per_payment": _rule("על כל תשלום בשובר, הבנק או המבטח המלווה ממציא ערבות או פוליסה תוך 14 ימי עסקים", "סעיף 3ב(ה)", INV),
            "vat": _rule("הערבות לא כוללת את רכיב המע\"מ; במימוש, המע\"מ מוחזר לקונה מקרן במשרד האוצר", "סעיפים 2(1) ו-3ג2", INV),
            "costs": _rule("העמלות וההוצאות של הבטוחה על המוכר", "סעיף 3א", INV),
            "replace": _rule("ערבות או פוליסה אפשר להחליף בהערת אזהרה, משכנתה או רישום רק אחרי שהבנייה הושלמה והחזקה נמסרה", "סעיף 2א", INV),
            "lender": _rule("הבנק שנותן משכנתה מעביר את הכסף למוכר רק אחרי שווידא שניתנה בטוחה", "סעיף 3ג", INV),
            "cap": _rule("המוכר לא יקבל תשלומים בשיעורים העולים על מה שקבעו התקנות, אלא אם הובטחו בערבות או בפוליסה", "סעיף 3", INV),
        },
        "small_claims_form_url": SMALL_FORM,
        "sources": [
            {"he": "חוק המכר (דירות), התשל\"ג-1973 (נוסח מעודכן, כולל תיקון 9)", "url": LAW, "sections_he": "סעיפים 4, 4א, 4ב, 5א, 5ב, 5ג, 6ב, 6ג, 7א, 11(ד), התוספת"},
            {"he": "משרד הבינוי והשיכון: תיקון מספר 9 לחוק המכר (דירות)", "url": GOV9, "sections_he": "בתוקף מ-7.7.2022; 20% הראשונים לא צמודים; מדרגות הפיצוי"},
            {"he": "חוק המכר (דירות) (הבטחת השקעות של רוכשי דירות), התשל\"ה-1974", "url": INV, "sections_he": "סעיפים 2, 2א, 2א1, 3, 3א, 3א1, 3ב, 3ג, 3ג2"},
            {"he": "הלמ\"ס: מדד מחירי תשומה בבנייה למגורים (סדרה 200010)", "url": CBS_API, "sections_he": f"כל חודש מ-1.2015 עד {int(latest[5:])}.{latest[:4]}; מקדם קישור 1.387"},
        ],
    }
