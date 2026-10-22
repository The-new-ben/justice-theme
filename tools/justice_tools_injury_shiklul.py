"""The disability-degree dataset of the co.il tools registry (the road-accident and personal-injury wave, 22.10.2026,
HAD-591): the shiklul-nechut instrument on /regulations-insurance-1956/. Discovered by tools/justice_tools_injury.py
(glob), built with --injury-checked-on.

What this file holds: the rules of the National Insurance (Determining the Degree of Disability of Work-Injury Victims)
Regulations 1956 that turn a committee's items into a degree (reg. 11 the weighting, the caps and the left-hander rule,
reg. 14 a similar item, reg. 15 the increase of up to half and its 19% / 100% limits, reg. 16, reg. 17, reg. 18, reg. 18a,
reg. 19 a paired organ, reg. 19a the rounding, regs. 20-21, the appeal of regs. 27-28, the re-determination of regs. 36-37,
the cumulative degree of regs. 12-12c), the sections of chapter 5 of the National Insurance Law that turn a degree into a
grant or a pension (ss.103-107, 112, 113, 117, 119-123), the 1984 general-disability regulations that reuse the same list
with their own rounding and their list of items left out, the 1976 road-accident regulations that point to the same tests,
the Institute's 2011 circular on reg. 15, its appeal pages and its booklet, a curated list of common items of the schedule
(item number and %, both columns where the schedule has a right and a left one) and the two tables of the schedule that are
two-dimensional (sight, item 52(1); hearing, item 72(1)).

What it does NOT repeat: the road-accident figures (the 1% per percent, the age cut of reg. 3, the sections of the 1975 law)
stay in reg.car_accident; the general-disability gates (60%, 40% with 25%) stay in reg.rights_nechut.medical; the 2026
injury-allowance and pension amounts belong to the work-injury instrument (injury_avoda).

Every value was read on checked_on from the official text named next to it. The regulations: Nevo's consolidated text and
the Institute's consolidated text (btl.gov.il/Laws1), both including the amendment of KT 12359 (15.4.2026, in force
1.5.2026). The two tables were transcribed from the Institute's PDF and checked cell by cell against Nevo's HTML table;
build() stops if a table is not the symmetric table both sources print. Nothing here is estimated.
"""
from __future__ import annotations

KEY = "injury_shiklul"

REGS = "https://www.nevo.co.il/law_html/law01/039_052.htm"                 # תקנות הביטוח הלאומי (קביעת דרגת נכות לנפגעי עבודה), תשט"ז-1956
REGS_BTL = "https://www.btl.gov.il/Laws1/02_0001_150700.pdf"              # אותן תקנות, הנוסח המשולב של המוסד (85 עמודים, כולל התוספת)
GENERAL_REGS = "https://www.btl.gov.il/Laws1/02_0001_180900.pdf"          # תקנות הביטוח הלאומי (ביטוח נכות) (קביעת אחוזי נכות רפואית ...), התשמ"ד-1984
REHAB_REGS = "https://www.btl.gov.il/Laws1/02_0001_149100.pdf"            # תקנות הביטוח הלאומי (שיקום מקצועי), התשט"ז-1956
LAW_CH5 = "https://www.btl.gov.il/Laws1/00_0001_000005.pdf"               # חוק הביטוח הלאומי [נוסח משולב], פרק ה': ביטוח נפגעי עבודה
BTL_WORK = "https://www.btl.gov.il/benefits/Work_Injury/Work_injury_benefit/"
PERMANENT = BTL_WORK + "KviatDarga/Pages/%D7%A7%D7%91%D7%99%D7%A2%D7%AA%20%D7%93%D7%A8%D7%92%D7%AA%20%D7%94%D7%A0%D7%9B%D7%95%D7%AA.aspx"  # דרגת נכות לצמיתות
TAKANA15 = BTL_WORK + "KviatDarga/Pages/Takana_15.aspx"                   # תקנה 15 ותקנה 17
APPEAL = BTL_WORK + ("Pages/%D7%A2%D7%A8%D7%A8%20%D7%A2%D7%9C%20%D7%94%D7%97%D7%9C%D7%98%D7%AA%20%D7%94%D7%95%D7%95%D7%A2%D7%93%D7%94"
                     "%20%D7%94%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA.aspx")  # ערר על החלטת הוועדה הרפואית - גמלת נכות מעבודה
APPEAL_COMMITTEE = "https://www.btl.gov.il/benefits/vaadotRefuiyot/erurVadot/Pages/erurNechutMeavoda.aspx"
CIRCULAR15 = ("https://www.btl.gov.il/benefits/HozrimGimlaot/Hozrim/%D7%97%D7%95%D7%96%D7%A8%20%D7%91%D7%A0%D7%95%D7%A9%D7%90%20"
              "%D7%AA%D7%A7%D7%A0%D7%94%2015%20%D7%9E%D7%99%D7%95%D7%9D%201%20%D7%91%D7%9E%D7%A8%D7%A5%202011%20"
              "%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98.pdf")             # חוזר נפגעי עבודה בנושא תקנה 15, מיום 1.3.2011
BOOKLET = ("https://www.btl.gov.il/Publications/booklet/hebrew_booklet/Documents/%D7%9E%D7%99%D7%93%D7%A2%20%D7%9C%D7%A0%D7%91%D7%93%D7%A7%20"
           "%D7%91%D7%95%D7%95%D7%A2%D7%93%D7%94%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA%20%D7%9C%D7%A0%D7%A4%D7%92%D7%A2%D7%99%20"
           "%D7%A2%D7%91%D7%95%D7%93%D7%94.pdf")                             # מידע לנבדק בוועדה רפואית לנפגעי עבודה (2015)
CALCULATOR = "https://www.btl.gov.il/benefits/Disability/Pages/chishuvDargatNehutMeshuklelet.aspx"   # מחשבון נכות משוקללת של המוסד
FORM_210 = "https://www.btl.gov.il/%D7%98%D7%A4%D7%A1%D7%99%D7%9D%20%D7%95%D7%90%D7%99%D7%A9%D7%95%D7%A8%D7%99%D7%9D/Documents/t210.pdf"
SPEC_BOOK = "https://www.btl.gov.il/laws/documents/sefermivhanim.pdf"     # ספר המבחנים (הנוסח הסרוק הישן; לקריאה בלבד)

# The schedule, item 52(1): sight with full optical correction. Rows (one eye) and columns (the other eye) are the same ten
# classes, letters א..י; the cell is the degree. Read from btl.gov.il/Laws1/02_0001_150700.pdf p.66 and Nevo's table.
VISION_LABELS = ["6/6", "6/9", "6/12", "6/15-6/18", "6/21-6/24", "6/30-6/36", "6/60", "3/60", "1/60", "NLP"]
VISION = [
    [0, 0, 0, 10, 10, 15, 20, 25, 30, 30],
    [0, 0, 5, 10, 10, 15, 20, 25, 30, 30],
    [0, 5, 10, 15, 15, 20, 25, 30, 35, 40],
    [10, 10, 15, 20, 25, 30, 30, 35, 40, 45],
    [10, 10, 15, 25, 30, 40, 40, 45, 50, 55],
    [15, 15, 20, 30, 40, 50, 55, 60, 65, 70],
    [20, 20, 25, 30, 40, 55, 70, 75, 80, 90],
    [25, 25, 30, 35, 45, 60, 75, 90, 90, 95],
    [30, 30, 35, 40, 50, 65, 80, 90, 100, 100],
    [30, 30, 40, 45, 55, 70, 90, 95, 100, 100],
]
# Item 72(1): hearing, the loss in decibels of each ear (the average of 500, 1000 and 2000 cycles a second, as the item
# says), in 14 classes from 15-20 dB to "more than 80". Read from the same PDF pp.74-75 and Nevo's table.
HEARING_BANDS = [[15, 20], [21, 25], [26, 30], [31, 35], [36, 40], [41, 45], [46, 50], [51, 55], [56, 60], [61, 65], [66, 70],
                 [71, 75], [76, 80], [81, None]]
HEARING = [
    [0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10],
    [0, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 10, 15, 15],
    [0, 5, 10, 10, 10, 10, 10, 15, 15, 15, 15, 15, 15, 20],
    [0, 5, 10, 15, 15, 15, 15, 15, 15, 20, 20, 20, 20, 20],
    [5, 5, 10, 15, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25],
    [5, 10, 10, 15, 20, 25, 25, 25, 25, 25, 25, 25, 30, 30],
    [5, 10, 10, 15, 20, 25, 25, 30, 30, 30, 30, 30, 30, 30],
    [5, 10, 15, 15, 20, 25, 30, 30, 30, 35, 35, 35, 35, 35],
    [5, 10, 15, 15, 20, 25, 30, 30, 35, 35, 40, 40, 40, 40],
    [5, 10, 15, 20, 20, 25, 30, 35, 35, 40, 40, 40, 45, 45],
    [10, 10, 15, 20, 25, 25, 30, 35, 40, 40, 45, 45, 45, 50],
    [10, 10, 15, 20, 25, 25, 30, 35, 40, 40, 45, 50, 50, 50],
    [10, 15, 15, 20, 25, 30, 30, 35, 40, 45, 45, 50, 55, 55],
    [10, 15, 20, 20, 25, 30, 30, 35, 40, 45, 50, 50, 55, 60],
]

# The joint caps of reg. 11(ג)(1): several impairments of the same joint never above that joint's unfavourable ankylosis.
JOINTS = {
    "shoulder": {"he": "כתף", "cap_item": "41(3)(ב)", "cap_he": "קשיון לא נוח של פרק הכתף", "r": 50, "l": 40},
    "elbow": {"he": "מרפק", "cap_item": "41(6)(ב)", "cap_he": "קשיון לא נוח במרפק", "r": 40, "l": 30},
    "wrist": {"he": "שורש כף היד", "cap_item": "41(10)(ג)", "cap_he": "קשיון לא נוח של שורש היד", "r": 40, "l": 30},
    "hip": {"he": "ירך", "cap_item": "48(1)(ב)", "cap_he": "קשיון לא נוח של פרק הירך", "r": 50, "l": 50},
    "knee": {"he": "ברך", "cap_item": "48(2)(ד)", "cap_he": "קשיון לא נוח של הברך", "r": 50, "l": 50},
    "ankle": {"he": "קרסול", "cap_item": "48(3)(ג)", "cap_he": "קשיון לא נוח של הקרסול", "r": 30, "l": 30},
}

# Curated items of the schedule (part A), each exactly as the schedule prints it: "r"/"l" when the item has a right and a
# left column (upper limbs), "pct" otherwise. "joint" ties the item to a cap of reg. 11(ג)(1); "limb" marks an item that
# needs a side; "general_out" marks an item that the 1984 general-disability regulations leave out of their list of
# impairments (their schedule, items 23, 25, 27, 44: 37(8)(א), 41(1)(ד), 48(2)(ה)II, 75(1)(ב)).
ITEMS = [
    # Spine, item 37 (pp.56-57).
    {"id": "c37-5a", "item": "37(5)(א)", "area": "spine", "he": "הגבלת תנועות בעמוד השדרה הצווארי, בצורה קלה", "pct": 10},
    {"id": "c37-5b", "item": "37(5)(ב)", "area": "spine", "he": "הגבלת תנועות בעמוד השדרה הצווארי, בצורה בינונית", "pct": 20},
    {"id": "c37-5c", "item": "37(5)(ג)", "area": "spine", "he": "הגבלת תנועות בעמוד השדרה הצווארי, בצורה קשה", "pct": 30},
    {"id": "c37-7a", "item": "37(7)(א)", "area": "spine", "he": "הגבלת תנועות בעמוד השדרה המותני, בצורה קלה", "pct": 10},
    {"id": "c37-7b", "item": "37(7)(ב)", "area": "spine", "he": "הגבלת תנועות בעמוד השדרה המותני, בצורה בינונית", "pct": 20},
    {"id": "c37-7c", "item": "37(7)(ג)", "area": "spine", "he": "הגבלת תנועות בעמוד השדרה המותני, בצורה קשה", "pct": 30},
    {"id": "c37-8a", "item": "37(8)(א)", "area": "spine", "he": "שבר של גוף חוליה שהתרפא, בלי תזוזה ניכרת ובלי הגבלת תנועה", "pct": 5, "general_out": True},
    {"id": "c37-8b", "item": "37(8)(ב)", "area": "spine", "he": "שבר של גוף חוליה שהתרפא, עם תזוזה ניכרת ובלי הגבלת תנועה", "pct": 10},
    # Shoulder, elbow, wrist, item 41 (pp.59-60).
    {"id": "c41-4b", "item": "41(4)(ב)", "area": "arm", "he": "הגבלת תנועות בכתף: הרמה עד גובה השכם", "r": 15, "l": 15, "joint": "shoulder", "limb": True},
    {"id": "c41-4c", "item": "41(4)(ג)", "area": "arm", "he": "הגבלת תנועות בכתף: עד 45 מעלות מהגוף, או הגבלה ניכרת בסיבוב", "r": 25, "l": 25, "joint": "shoulder", "limb": True},
    {"id": "c41-4d", "item": "41(4)(ד)", "area": "arm", "he": "הגבלת תנועות בכתף: עד 30 מעלות מהגוף", "r": 35, "l": 35, "joint": "shoulder", "limb": True},
    {"id": "c41-1d", "item": "41(1)(ד)", "area": "arm", "he": "נקיעה חוזרת של הכתף, אחרי ניתוח, פעולת הזרוע טובה", "r": 5, "l": 5, "joint": "shoulder", "limb": True, "general_out": True},
    {"id": "c41-7a3", "item": "41(7)(א)(III)", "area": "arm", "he": "הגבלת כיפוף במרפק: כיפוף אפשרי מ-0 עד 90 מעלות", "r": 15, "l": 10, "joint": "elbow", "limb": True},
    {"id": "c41-10e", "item": "41(10)(ה)", "area": "arm", "he": "הגבלה בתנועות שורש היד, כיפוף גבי אפשרי של 15 מעלות", "r": 10, "l": 5, "joint": "wrist", "limb": True},
    # Fingers, items 43-44 (pp.61-62).
    {"id": "c43-1c", "item": "43(1)(ג)", "area": "hand", "he": "קטיעת הגליל הסופי של האגודל", "r": 15, "l": 10, "limb": True},
    {"id": "c43-2c", "item": "43(2)(ג)", "area": "hand", "he": "קטיעת 2 או 1.5 גלילים של האצבע המורה", "r": 10, "l": 10, "limb": True},
    {"id": "c44-2", "item": "44(2)", "area": "hand", "he": "קשיון נוח של האגודל", "r": 10, "l": 10, "limb": True},
    {"id": "c44-3", "item": "44(3)", "area": "hand", "he": "קשיון נוח של האצבע המורה (אצבע 2)", "r": 7, "l": 7, "limb": True},
    # Hip, knee and ankle, item 48 (pp.63-64).
    {"id": "c48-1g", "item": "48(1)(ז)", "area": "leg", "he": "פרק הירך: הגבלה בינונית בכל התנועות", "pct": 30, "joint": "hip", "limb": True},
    {"id": "c48-2b", "item": "48(2)(ב)", "area": "leg", "he": "ברך: אי-יציבות אחורית-קדמית עם התעקמות הברך תחת כובד משקל הגוף", "pct": 20, "joint": "knee", "limb": True},
    {"id": "c48-2e2", "item": "48(2)(ה)(II)", "area": "leg", "he": "ברך: הגבלת כיפוף, כיפוף אפשרי מ-0 עד 70 מעלות", "pct": 5, "joint": "knee", "limb": True, "general_out": True},
    {"id": "c48-2e3", "item": "48(2)(ה)(III)", "area": "leg", "he": "ברך: הגבלת כיפוף, כיפוף אפשרי מ-0 עד 45 מעלות", "pct": 10, "joint": "knee", "limb": True},
    {"id": "c48-2e4", "item": "48(2)(ה)(IV)", "area": "leg", "he": "ברך: הגבלת כיפוף, כיפוף אפשרי מ-0 עד 30 מעלות", "pct": 20, "joint": "knee", "limb": True},
    {"id": "c48-2z1", "item": "48(2)(ז)(I)", "area": "leg", "he": "ברך: נזק במניסקוס בצורה קלה", "pct": 10, "joint": "knee", "limb": True},
    {"id": "c48-2z2", "item": "48(2)(ז)(II)", "area": "leg", "he": "ברך: נזק במניסקוס עם נעילה (LOCKING)", "pct": 20, "joint": "knee", "limb": True},
    {"id": "c48-2z4", "item": "48(2)(ז)(IV)", "area": "leg", "he": "ברך: אחרי ניתוח להוצאת המניסקוס, עם שינויים ארטרוטיים קלים", "pct": 10, "joint": "knee", "limb": True},
    {"id": "c48-3a", "item": "48(3)(א)", "area": "leg", "he": "קרסול: הגבלה ניכרת של התנועות", "pct": 10, "joint": "ankle", "limb": True},
    # Ear (tinnitus), item 72(4)(ד) (p.75); hearing and sight come from the two tables below.
    {"id": "c72-4d2", "item": "72(4)(ד)(II)", "area": "senses", "he": "חבלה אקוסטית: רעש תמידי באוזניים, בלי הפחתת שמיעה בתדירויות הדיבור", "pct": 10},
    # Scars, item 75 (p.78).
    {"id": "c75-1b", "item": "75(1)(ב)", "area": "skin", "he": "צלקות בגוף, מכאיבות או מכערות", "pct": 10, "general_out": True},
    {"id": "c75-1c", "item": "75(1)(ג)", "area": "skin", "he": "צלקות בגוף, נרחבות באזורים מרובים", "pct": 20},
    {"id": "c75-2b", "item": "75(2)(ב)", "area": "skin", "he": "צלקות בפנים ובצוואר, מכערות או משנות את צורת העפעפיים, האף, השפתיים או האוזניים", "pct": 10},
    {"id": "c75-2c", "item": "75(2)(ג)", "area": "skin", "he": "צלקות בפנים ובצוואר, רחבות עם כיעור ניכר", "pct": 20},
    # Mental health, item 34(ב): anxiety disorders, reaction to severe stress and post-traumatic stress disorder (p.55).
    {"id": "c34b2", "item": "34(ב)(2)", "area": "mind", "he": "הפרעת דחק בתר-חבלתית (פוסט-טראומה) או חרדה: הפרעה קלה בתפקוד, הגבלה קלה עד בינונית בכושר העבודה", "pct": 10},
    {"id": "c34b3", "item": "34(ב)(3)", "area": "mind", "he": "פוסט-טראומה או חרדה: צורך בטיפול תרופתי, הפרעה בינונית בתפקוד ובכושר העבודה", "pct": 20},
    {"id": "c34b4", "item": "34(ב)(4)", "area": "mind", "he": "פוסט-טראומה או חרדה: טיפול תרופתי קבוע, הפרעה והגבלה ניכרות", "pct": 30},
    {"id": "c34b5", "item": "34(ב)(5)", "area": "mind", "he": "פוסט-טראומה או חרדה: טיפול תרופתי קבוע, הפרעה והגבלה קשות", "pct": 50},
]
AREAS = {"spine": "עמוד השדרה", "arm": "כתף, מרפק ושורש היד", "hand": "אצבעות היד", "leg": "ירך, ברך וקרסול",
         "senses": "שמיעה וראייה", "skin": "צלקות", "mind": "נפש (פוסט-טראומה וחרדה)"}


def _check_tables() -> None:
    for name, t, n in (("VISION", VISION, 10), ("HEARING", HEARING, 14)):
        if len(t) != n or any(len(r) != n for r in t):
            raise SystemExit(f"injury_shiklul: {name} is not {n}x{n}")
        for i in range(n):
            for j in range(n):
                if t[i][j] != t[j][i]:
                    raise SystemExit(f"injury_shiklul: {name}[{i}][{j}] != [{j}][{i}]: not the symmetric table both sources print")
    ids = [x["id"] for x in ITEMS]
    if len(ids) != len(set(ids)):
        raise SystemExit("injury_shiklul: duplicate item id")


def build(checked_on: str) -> dict:
    """The rules that turn a committee's items into a degree, and what the degree means for three systems."""
    _check_tables()
    return {
        "name_he": "שקלול אחוזי נכות: תקנות קביעת דרגת נכות לנפגעי עבודה, תקנה 15 ומה הדרגה אומרת",
        "publisher_he": "תקנות הביטוח הלאומי (קביעת דרגת נכות לנפגעי עבודה), חוק הביטוח הלאומי והמוסד לביטוח לאומי",
        "source_name": "תקנות הביטוח הלאומי (קביעת דרגת נכות לנפגעי עבודה), תשט\"ז-1956 (נוסח עדכני)",
        "source_url": REGS,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "regs": {
            "he": "תקנות הביטוח הלאומי (קביעת דרגת נכות לנפגעי עבודה), תשט\"ז-1956",
            "short_he": "תקנות קביעת דרגת נכות",
            "url": REGS, "btl_url": REGS_BTL, "book_url": SPEC_BOOK,
            # Both consolidated texts carry KT 12359 (15.4.2026, p.1924-1926), in force 1.5.2026.
            "current_to": "2026-05-01",
            "last_amend_he": "ק\"ת 12359 מיום 15.4.2026, בתוקף מ-1.5.2026",
        },
        # Reg. 11: the degree by the schedule, the weighting, the caps, muscles and nerves, the left-hander.
        "rules": {
            "item": {"section": "תקנה 11(א)", "max": 100, "he": "דרגת הנכות נקבעת באחוזים כנקוב לצד כל פגימה ברשימה שבתוספת, ובלבד שלא תעלה על 100%"},
            "weighting": {"section": "תקנה 11(ב)", "he": "כמה פגימות באותה פגיעה: הפגימה עם האחוז הגבוה ביותר נכנסת במלואה; השנייה מוכפלת בהפרש שבין האחוז הראשון ל-100%; השלישית בהפרש שבין סכום השתיים ל-100%, וכן הלאה"},
            "joint_cap": {"section": "תקנה 11(ג)(1)", "he": "כמה פגימות באותו פרק: לא יותר מהאחוזים שנקבעו לקשיון לא נוח של אותו פרק"},
            "limb_cap": {"section": "תקנה 11(ג)(2)", "he": "כמה פגימות באותה גפה: לא יותר מהאחוזים שנקבעו לקטיעת החלק הפגום של הגפה"},
            "eye_cap": {"section": "תקנה 11(ג)(3)", "he": "כמה פגימות באותה עין: לא יותר מהאחוזים שנקבעו לעיוורון מלא של אותה עין"},
            "muscles": {"section": "תקנה 11(ד)", "he": "בקשיון או בהגבלת תנועה של פרק לא נכנס בחשבון נזק לשרירים הפועלים באותו פרק"},
            "nerve": {"section": "תקנה 11(ה)", "he": "בשיתוק של עצב לא נכנסים שיתוק סעיפי אותו עצב או נזק לשרירים שהוא מעצבב"},
            "lefty": {"section": "תקנה 11(ו)", "he": "לאיטר יד ימין: פגימה ביד שמאל נקבעת לפי המבחנים ליד ימין, ופגימה ביד ימין לפי המבחנים ליד שמאל"},
            "similar": {"section": "תקנה 14", "he": "ליקוי שלא פורט בתוספת: לפי האחוז של פגימה דומה; אם אין דומה, הוועדה קובעת בשיקול דעת בהתחשב במבחנים לאותו איבר או מערכת"},
            "special100": {"section": "תקנה 16", "min": 65, "he": "הוועדה רשאית לקבוע 100% כשנמנע מהנפגע כל סיכוי לעבודה והדרגה לפי תקנות 11, 14 ו-19 היא 65% לפחות"},
            "consult": {"section": "תקנה 16א", "he": "הגדלה של דרגה של 20% ומעלה לפי תקנה 15, הקטנה לפי תקנה 15 והגדלה לפי תקנה 16: רק אחרי התייעצות עם \"הרשות\" של תקנה 18א"},
            "income_review": {"section": "תקנה 17", "from_months": 12, "to_months": 60, "min": 20, "he": "בין 12 ל-60 חודשים מקביעה אחרונה של דרגה יציבה של 20% ומעלה: אפשר לתבוע מהרשות לקבוע אם הנכות הביאה לירידה ניכרת ולא לזמן מוגבל בהכנסות, בשיעורים ובתנאים של תקנה 15(א)"},
            "improve": {"section": "תקנה 18", "under": 20, "he": "דרגה של פחות מ-20% שהוועדה צופה בה שיפור בתוך שנה: הוועדה רשאית לקבוע אותה לפי המצב הצפוי בסוף השנה ולהגדילה בינתיים"},
            "needy": {"section": "תקנה 18א(ב)", "pct": 100, "months": 4, "he": "\"נכה נזקק\" (נכות זמנית, בלי סיכוי סביר לעבודה ובלי הכנסה מהתעסקות): הרשות רשאית לקבוע נכות זמנית של 100% לתקופה של עד 4 חודשים"},
            "paired": {"section": "תקנה 19", "he": "פגימה באבר זוגי כשהאבר השני היה פגום מקודם: מצרפים את פגימות שני האברים ומנכים את הפגימה הקודמת"},
            "rounding": {"section": "תקנה 19א", "he": "דרגת נכות המזכה בקצבה שמתבטאת בשבר: השבר מעוגל לשלם כלפי מעלה"},
            "start": {"section": "תקנה 20", "he": "הדרגה חלה מיום הגשת הבקשה; הוועדה רשאית לקבוע מועד מוקדם יותר, ודרגה שונה ממועד מאוחר יותר"},
            "recheck_date": {"section": "תקנה 21", "he": "הוועדה מחליטה אם הקביעה לתקופה בלתי מסוימת, ואם לא, מציינת את המועד לדיון מחדש"},
            "aggravation": {"section": "תקנה 36", "months": 6, "he": "עברו 6 חודשים מהקביעה האחרונה (גם אם הייתה לתקופה קצובה) ורופא מאשר בכתב החמרה או פגימה חדשה מאותה פגיעה: אפשר לבקש קביעה מחדש; לפני 6 חודשים רק בהסכמת רופא מוסמך"},
            "aggravation_from": {"section": "תקנה 37א", "hospital_days": 90, "he": "דרגה חדשה לפי תקנות 36-37 חלה מיום הבקשה; אם הנפגע אושפז בגלל ההחמרה, מיום האשפוז, אם הבקשה הוגשה בתוך 90 ימים מהשחרור"},
        },
        # Reg. 15 (as amended from 1.4.2000, KT 6026) and the Institute's circular of 1.3.2011.
        "r15": {
            "section": "תקנה 15(א)", "max_num": 1, "max_den": 2, "grant_cap": 19, "under": 20, "cap": 100,
            "he": "הוועדה רשאית לקבוע דרגת נכות יציבה גדולה עד מחצית מזו שנקבעה לפי המבחנים (או לפי תקנה 14), בשים לב למקצועו ולגילו של הנפגע; כשהדרגה פחותה מ-20% התוצאה לא תעלה על 19%, ובכל מקרה לא על 100%",
            "cond_section": "תקנה 15(ב)",
            "cond_he": "הוועדה מתחשבת במקצוע כשהנפגע לא מסוגל לחזור לעבודתו או לעיסוקו והנכות הביאה לירידה ניכרת, ולא לזמן מוגבל, בהכנסותיו",
            "only_section": "תקנה 15(ד)",
            "only_he": "רק על הפגימות מהפגיעה בעבודה, אחרי שנוכו פגימות שאינן קשורות בה",
            "stable_he": "רק בדרגה יציבה (לצמיתות); בדרגה זמנית תקנה 15 לא חלה",
            "page_url": TAKANA15, "page_he": "המוסד: זכאים הם נפגעי עבודה עם נכות לצמיתות שאינם מסוגלים לחזור לעבודתם ושהכנסותיהם נפגעו בשיעור של יותר מ-20%; ההחלטה בסמכות הוועדה הרפואית",
            "circular_url": CIRCULAR15, "circular_from": "2011-03-01",
            "circular_he": "חוזר המוסד בנושא תקנה 15 (1.3.2011): השיעור לפי מידת ההשפעה, קלה רבע, בינונית שליש, ניכרת חצי; או לפי הירידה בהכנסות: 20%-25% רבע, 26%-35% שליש, 36% ויותר חצי",
            "steps": [{"code": "q", "num": 1, "den": 4, "he": "רבע"}, {"code": "t", "num": 1, "den": 3, "he": "שליש"}, {"code": "h", "num": 1, "den": 2, "he": "חצי"}],
            "cumulative_he": "בצירוף נכויות (תקנה 12ב(ה)) הוועדה רשאית להחיל את תקנה 15 בעצמה, גם מעבר ל-19% (החוזר)",
        },
        # Regs. 12-12c and s.121 of the law: earlier work injuries counted together.
        "cumulative": {
            "section": "תקנות 12 עד 12ג", "law_section": "סעיף 121", "income_drop_pct": 50, "form_he": "טופס בל/210: תביעה לצירוף דרגות נכות מעבודה",
            "form_url": FORM_210,
            "he": "נכות מפגיעה קודמת בעבודה נכנסת לחשבון כשבגלל האופי המצטבר של הנכויות ההכנסה מעבודה ירדה דרך קבע ב-50% או יותר, והצירוף עשוי לזכות בקצבה במקום מענק או בדרגה של תקנה 16; הדרגה המצטברת מחושבת באותו שקלול של תקנה 11(ב)",
        },
        # Chapter 5 of the National Insurance Law [Consolidated Version] 1995 (btl.gov.il/Laws1).
        "law": {
            "he": "חוק הביטוח הלאומי [נוסח משולב], התשנ\"ה-1995, פרק ה' (ביטוח נפגעי עבודה)",
            "url": LAW_CH5,
            "stable_section": "סעיף 103(א)", "stable_he": "דרגה יציבה: דרגת נכות שאינה לזמן מוגבל ואינה זמנית; דרגה שאינה יציבה: דרגה לזמן מוגבל או זמנית",
            "pension_section": "סעיף 104(ב)", "pension_stable_min": 20, "pension_temp_min": 9,
            "grant_section": "סעיף 104(ג)", "grant_min": 9, "grant_below": 20,
            "full_section": "סעיף 105(א)", "full_days": 30, "full_he": "בדרגה 100% הקצבה לחודש שווה לדמי הפגיעה ליום כפול 30, ומעודכנת לפי סעיף 110",
            "partial_section": "סעיף 106", "partial_he": "בדרגה פחותה מ-100% הקצבה היא חלק יחסי מהקצבה המלאה, לפי אחוז הדרגה",
            "grant_calc_section": "סעיף 107(א)", "grant_months": 43, "late_months": 12,
            "grant_calc_he": "המענק: הקצבה החודשית כפול 43; תביעה שהוגשה יותר מ-12 חודשים אחרי החודש שבו נוצרו התנאים: המענק מופחת בקצבה חודשית לכל חודש מתום 12 החודשים ועד חודש התביעה",
            "special_section": "סעיף 112", "special_min": 75, "special_he": "דרגה יציבה של 75% לפחות: גם קצבה מיוחדת ומענק לסידורים חד-פעמיים, בסכומים ובכללים שנקבעו",
            "capitalize_section": "סעיף 113", "capitalize_min": 20, "capitalize_he": "דרגה של 20% ומעלה: המוסד רשאי, בהסכמת הנכה, לשלם מענק (היוון) במקום קצבה, כשיש לו הכנסה קבועה או סיכוי מבוסס להכנסה",
            "raise_section": "סעיף 117", "raise_min": 50, "raise_he": "דרגה של 50% ומעלה: הקצבה מוגדלת בשיעור שבלוח ו' לפי שנת הפגיעה",
            "unstable_section": "סעיף 119", "unstable_he": "דרגה שאינה יציבה יכולה לעלות על הקבוע במבחנים, עד 100%, ולעתיד לא יותר משנה מיום הקביעה",
            "previous_section": "סעיף 120(א)", "previous_he": "בקביעת הדרגה לא מתחשבים במום, פגם או ליקוי שהיו לפני הפגיעה (מלידה, ממחלה, מתאונה או מכל סיבה אחרת), וגם לא במה שבא אחריה ואינו תוצאה ישירה שלה",
            "appeal_section": "סעיף 122", "court_section": "סעיף 123", "court_he": "על החלטת הוועדה הרפואית לעררים: ערעור לבית הדין האזורי לעבודה בשאלה משפטית בלבד",
            "binding_section": "סעיף 124", "binding_he": "קביעת דרגת הנכות היא תנאי מוקדם לתובענה בבית הדין לעבודה בעניין זה, והיא מחייבת אותו",
            # s.104(ב)(2) and (ג): "9%" in place of "5%" by amendment 79, in force 1.1.2005 (the law's own note 20-21).
            "threshold_from": "2005-01-01", "threshold_before": 5,
        },
        # The Institute's booklet (2015) and pages: previous condition, temporary degree, rehabilitation, payment day.
        "institute": {
            "booklet_url": BOOKLET, "booklet_he": "מידע לנבדק בוועדה רפואית לנפגעי עבודה (המוסד לביטוח לאומי, 2015)",
            "permanent_url": PERMANENT,
            "example_he": "דוגמת המוסד: 20% בגב ו-10% ברגל: 20% מתוך 100%, ועוד 10% מתוך 80% שנשארו = 8%; סך הכול 28% משוקלל",
            "example": [20, 10], "example_total": 28,
            "previous_he": "הוועדה קובעת דרגה רק לליקויים שנגרמו מהפגיעה בעבודה: ליקוי שקדם לתאונה ויש לו הוכחה במסמכים רפואיים מופחת. דוגמת המוסד: הגבלה קשה בעמוד השדרה 30%, הגבלה קלה מלפני התאונה 10%: הנבדק מקבל 20%",
            "previous_example": [30, 10, 20],
            "temp_he": "מצב שאינו קבוע ועשוי להשתנות: דרגה זמנית, לכל היותר לתקופה עתידית של שנה; בתום התקופה מוזמנים לוועדה נוספת",
            "start_he": "הדרגה נקבעת מסיום התקופה שבעדה שולמו דמי פגיעה; בלי דמי פגיעה, ממחרת יום הפגיעה",
            "calculator_url": CALCULATOR,
            "calculator_he": "מחשבון הנכות המשוקללת של המוסד (לפי סוג הוועדה, סעיף עיקרי וסעיף משנה, מצב קודם ותוספת תקנה 15)",
        },
        "rehab": {"he": "תקנות הביטוח הלאומי (שיקום מקצועי), התשט\"ז-1956", "url": REHAB_REGS, "section": "תקנה 3(א)(1)", "min": 10,
                  "rule_he": "שיקום מקצועי: כשדרגת הנכות מהפגיעה בעבודה נקבעה ל-10% לפחות (או עלולה להגיע ל-10%) והנפגע לא מסוגל לחזור לעבודתו הקודמת או לעבודה מתאימה אחרת, או צריך הכשרה כדי לחזור"},
        # Regs. 27-28 and the Institute's appeal pages (read 22.10.2026).
        "appeal": {
            "section": "תקנה 27(א)", "days": 30, "reasons_section": "תקנה 28", "reasons_extra": 30, "institute_days": 30,
            "he": "ערר לוועדה הרפואית לעררים: בתוך 30 ימים מהיום שבו נמסרה ההחלטה; ערר שהוגש בזמן בלי נימוקים: עוד 30 ימים לנימוקים מתום המועד",
            "court_days": 60, "court_he": "על החלטת הוועדה הרפואית לעררים: ערעור לבית הדין האזורי לעבודה, בשאלה משפטית בלבד, בתוך 60 ימים מקבלת ההודעה",
            "url": APPEAL, "committee_url": APPEAL_COMMITTEE,
            "withdraw_he": "מי שערר והוועדה לעררים שוקלת להוריד את הדרגה רשאי לבטל את הערר, והדרגה נשארת כפי שנקבעה (חוברת המוסד); בערר של המוסד אין אפשרות כזו",
            "powers_section": "תקנה 30(א)", "powers_he": "הוועדה לעררים רשאית לאשר, לבטל או לשנות את ההחלטה, גם בלי שהתבקשה, בין שהערר של הנפגע ובין שהוא של המוסד",
        },
        # The 1984 general-disability regulations: the same list (parts A and D of the schedule) with exceptions.
        "general": {
            "he": "תקנות הביטוח הלאומי (ביטוח נכות) (קביעת אחוזי נכות רפואית, מינוי ועדות לעררים והוראות שונות), התשמ\"ד-1984",
            "url": GENERAL_REGS,
            "list_section": "תקנה 1 (\"רשימת ליקויים\") ותקנה 2", "list_he": "הליקויים בחלקים א' ו-ד' של התוספת לתקנות נפגעי עבודה, למעט הפריטים שבתוספת לתקנות 1984",
            "weighting_section": "תקנה 3(א)", "rounding_section": "תקנה 3(ב)", "rounding_he": "אחוז נכות רפואית מצטבר שמתבטא בשבר: השבר מעוגל לשלם כלפי מעלה",
            "similar_section": "תקנה 4", "temp_section": "תקנה 6", "temp_years": 2, "temp_he": "נכות רפואית זמנית, כל עוד המצב לא יציב, לתקופה של עד שנתיים מיום הקביעה",
            "start_section": "תקנה 5", "start_months": 36,
            "out_section": "התוספת (תקנה 1)",
            "hearing_out_db": 40, "hearing_out_he": "פרט 72(1) לא נכנס לחשבון כשהירידה בשמיעה באחת האוזניים לא עולה על 40 דציבל",
            "vision_out_max": 25, "vision_out_except": "3/60",
            "vision_out_he": "פרטים 52(1)-52(2) לא נכנסים לחשבון כשאחוז הנכות מכל סעיף או מצירוף שניהם לא עולה על 25%, אלא אם חדות הראייה באחת העיניים היא 3/60",
            "r15_he": "תקנה 15 חלה רק על נפגעי עבודה ומתנדבים (חוזר המוסד), ולא בקביעת נכות רפואית לנכות כללית",
        },
        # The 1976 road-accident regulations point to the same tests; the 1975 law binds a degree set under another law.
        "road": {
            "tests_section": "תקנה 2(א)(2)",
            "tests_he": "\"אחוזי הנכות\" לצורך הפיצוי על נזק שאינו נזק ממון: כפי שנקבעו בהתאם למבחנים שבתוספת לתקנות הביטוח הלאומי (קביעת דרגות נכות לנפגעי עבודה), תשט\"ז-1956",
            "binding_section": "סעיף 6ב",
            "binding_he": "דרגת נכות שנקבעה על פי כל דין בשל הפגיעה מאותה תאונת דרכים, לפני שמיעת הראיות, מחייבת גם בתביעה לפי חוק הפיצויים; בית המשפט רשאי להתיר ראיות לסתור מטעמים מיוחדים שיירשמו",
            "expert_section": "סעיף 6א",
            "r15_he": "תקנה 15 היא \"סטייה\" מהמבחנים בגלל המקצוע והגיל; תקנות הנזק שאינו ממון מפנות למבחנים עצמם, ולכן הכלי מעביר לכלי תאונות הדרכים את הדרגה לפי המבחנים, בלי תקנה 15",
        },
        "tables": {
            "vision": {"item": "52(1)", "he": "ליקויים בכושר הראייה (חדות הראייה נמדדת עם תיקון אופטי מלא)", "labels": VISION_LABELS, "grid": VISION,
                       "page": 66, "url": REGS_BTL},
            "hearing": {"item": "72(1)", "he": "ליקוי שמיעה: לוח אחוזי הנכות לפי מדידה אודיומטרית", "bands": HEARING_BANDS, "grid": HEARING,
                        "freq_he": "הירידה הממוצעת בתדירויות הדיבור 500, 1000 ו-2000 מחזורים בשנייה", "min_db": 15, "page": 74, "url": REGS_BTL},
        },
        "joints": JOINTS,
        "areas": AREAS,
        "items": ITEMS,
        # What changed and when: only dates an official text gives.
        "changes": [
            {"date": "2000-04-01", "he": "תקנה 15: הוועדה רשאית רק להגדיל את הדרגה (נמחקה האפשרות להקטין), בשים לב למקצוע ולגיל (במקום גם המין)", "src": "ק\"ת 6026, התש\"ס, עמ' 412", "url": REGS_BTL},
            {"date": "2005-01-01", "he": "הסף לקצבה בדרגה זמנית ולמענק בדרגה יציבה עלה מ-5% ל-9% (תיקון 79 לחוק, עם הוראת תחולה)", "src": "סעיף 104(ב)(2) ו-(ג) לחוק", "url": LAW_CH5},
            {"date": "2011-03-01", "he": "חוזר המוסד בנושא תקנה 15: רבע, שליש או חצי לפי מידת ההשפעה או הירידה בהכנסות", "src": "חוזר נפגעי עבודה", "url": CIRCULAR15},
            {"date": "2016-10-01", "he": "תיקון רחב של התוספת (ק\"ת 7584, התשע\"ו): חל על מי שעניינו נדון בוועדה או בוועדה לעררים מיום זה", "src": "ק\"ת 7584 וק\"ת 7678", "url": REGS_BTL},
            {"date": "2018-12-01", "he": "פרטים 5 עד 8 בחלק א' של התוספת הוחלפו (ק\"ת 8101, התשע\"ט)", "src": "ק\"ת 8101", "url": REGS_BTL},
            {"date": "2026-05-01", "he": "הוראות השעה מ-2016 נעשו קבועות: מזכיר ועדות שאינו עובד המוסד (תקנה 27ב), ערר המוסד בתוך 30 ימים מהיום שההחלטה נמסרה למוסד", "src": "ק\"ת 12359, התשפ\"ו", "url": REGS_BTL},
        ],
    }
