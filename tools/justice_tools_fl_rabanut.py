"""The rabbinical-court fee ledger (the family + land wave, 21.10.2026, HAD-579): every fee of the Dayanim (Fees)
Regulations 1957 next to the same claim at the family court, the exemptions and refunds the regulations state, how
each forum is paid, and the periods the procedure regulations fix (appeal, leave to appeal, setting aside a judgment
given in absence, the 90 days of item 1(ג)).

REUSE: the fees the wave-4 divorce dataset already holds (divorce_cost.rabbinical / divorce_cost.family: divorce 457,
property 596, custody 417, maintenance 279, agreement 536, get request 326/457, certificate 326, dispute request
119/120, transcripts 118/88/86, appeal 775) are referenced by path ("ref"), never copied; this module adds every fee
of the schedules that was missing, and the inheritance fees reference inheritance_process. The engine resolves every
ref against the registry, and a golden test fails when a ref does not resolve.

Every value was read on checked_on from the official text named next to it:
- תקנות הדיינים (אגרות), התשי"ז-1957, Nevo consolidated text current to 22.1.2026 (the amounts in force since 1.1.2026,
  reg. 3ב: updated each 1 January by the November CPI, rounded to the whole shekel, 3ב(ב1));
- the rabbinical courts administration's fee table on data.gov.il (dataset 860, "עדכון אגרות בתי הדין הרבניים ינואר
  2026", modified 15.2.2026) and the gov.il payment collector "תשלום אגרות - בתי הדין הרבניים" (108 rows, read
  21.10.2026): the amounts the payment service charges for matters the schedule does not name (a ketubah claim, a change
  of an approved agreement, the 210 top-up, inheritance orders, protection orders);
- תקנות בית המשפט לעניני משפחה (אגרות), התשנ"ו-1995, Nevo text current to 1.7.2026 = the Courts Director's notice of
  21.6.2026 (in force 1.7.2026; reg. 4(א): updated 1 January and 1 July);
- תקנות בתי המשפט (אגרות), התשס"ז-2007, items 12א, 16ב and 17 as the Judiciary's fee guide states them from 1.1.2026;
- תקנות הדיון בבתי-הדין הרבניים בישראל, התשנ"ג (Nevo 500_027, current to 1.1.2026): regs. יט, לח, קכא, קלג, קלח, קמד, קמה;
- תקנות סדר הדין האזרחי, התשע"ט-2018, reg. 137(א) (60 days to appeal a judgment of the family court);
- חוק שיפוט בתי דין רבניים (נישואין וגירושין), התשי"ג-1953, ss.1, 3 (and the temporary provision of s.3 from 18.11.2025
  for two years) and 4א.
Nothing here is estimated: a fee the sources do not hold is not in the file, and the notes say so in words.
"""
from __future__ import annotations

KEY = "fl_rabanut"

RAB = "https://www.nevo.co.il/law_html/law00/70297.htm"            # תקנות הדיינים (אגרות), התשי"ז-1957
FAM = "https://www.nevo.co.il/law_html/law00/71537.htm"            # תקנות בית המשפט לעניני משפחה (אגרות), התשנ"ו-1995
PROC = "https://www.nevo.co.il/law_html/law01/500_027.htm"         # תקנות הדיון בבתי-הדין הרבניים בישראל, התשנ"ג
CIVIL = "https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי"      # תקנות סדר הדין האזרחי, התשע"ט-2018
JURIS = "https://he.wikisource.org/wiki/חוק_שיפוט_בתי_דין_רבניים_(נישואין_וגירושין)"
ADMIN = "https://data.gov.il/dataset/860"                          # תעריפי אגרות של בתי הדין הרבניים (ינואר 2026)
PAY_RAB = "https://www.gov.il/he/departments/dynamiccollectors/agrot_rbc"
FEE_GUIDE_FAM = "https://www.gov.il/he/pages/fee_guide?chapterIndex=2"
FEE_GUIDE_GEN = "https://www.gov.il/he/pages/fee_guide?chapterIndex=1"
FAM_NOTICE = "https://www.gov.il/BlobFolder/generalpage/family_fee/en/forms_familyfee010726.pdf"
PAY_FAM = "https://www.gov.il/he/pages/charges_trial?chapterIndex=1"
DISPUTE_FORM = "https://www.gov.il/he/service/asking_for_family_dispute_settlements"
FAM_EXEMPT = "https://www.gov.il/he/service/exempt_from_payment_of_a_fee"


def _fee(amount, item, he, src="regs"):
    """One fee: the amount in shekels, the item of the schedule, its words, and where the figure is read."""
    return {"amount": amount, "item": item, "he": he, "src": src}


def build(checked_on: str) -> dict:
    # ---- The Dayanim (Fees) Regulations: the fees the wave-4 dataset did not hold (first schedule, Nevo 22.1.2026). ----
    rab_fees = {
        "permit": _fee(326, "פרט 1(א)", "בקשה להיתר נישואין"),
        "permit_100": _fee(457, "פרט 1(ב)", "אישור פסק דין סופי להיתר נישואין בידי נשיא בית הדין הגדול (חתימת מאה רבנים)"),
        "permit_90": _fee(326, "פרט 1(ג)", "בקשה להתיר נישואין למעוברת או לאישה בתוך 90 ימים מהגט או מפטירת הבעל"),
        "marriage_validity": _fee(326, "פרט 1(ד)", "תביעה או בקשה בקשר לקיום או לביטול נישואין"),
        "marriage_stay": _fee(326, "פרט 1(ה)", "בקשה לעיכוב נישואין"),
        "prenup": _fee(326, "פרט 1(ו)", "אישור הסכם ממון לפי סעיף 2 לחוק יחסי ממון בין בני זוג"),
        "ketubah_estate": _fee(457, "פרט 1(ז)", "תביעת כתובה מעיזבון"),
        "single": _fee(326, "פרט 1(ח)", "בקשה לאישור רווקות או פנוי לצורך סידור נישואין"),
        "shalom": _fee(326, "פרט 2(א)", "תביעה לשלום בית, כולל בקשות לצווים הנלווים לה"),
        "shalom_interim": _fee(326, "פרט 2(ב)", "הליך ביניים בשלום בית, בנפרד מהתביעה"),
        "money_noval": _fee(596, "פרט 4(1)(ג)", "תביעה כספית הכרוכה בגירושין שאינה ניתנת להערכה בכסף"),
        "separation": _fee(457, "פרט 4(1)(ה)", "תביעה או בקשה לצו הפרדה, בנוסף לתביעה העיקרית"),
        "mored": _fee(457, "פרט 4(1)(ו)", "תביעה להכרזה כמורד או כמורדת"),
        "divorce_interim": _fee(326, "פרט 4(1)(ז)", "הליך ביניים בגירושין המוגש בנפרד מהתביעה"),
        "get_agent": _fee(457, "פרט 4(3)(ד)", "סידור גט בידי שליח (בארץ), בנוסף לבקשה"),
        "get_outside": _fee(457, "פרט 4(3)(ה)", "סידור גט מחוץ לבית הדין, בנוסף לבקשה"),
        "get_delivery": _fee(326, "פרט 4(3)(ו)", "בקשה למסירת גט שנשלח ממקום אחר"),
        "certificate_copy": _fee(326, "פרט 4(4)(ב)", "העתק מאושר של תעודת גירושין"),
        "divorce_confirm": _fee(457, "פרט 4(5)(א)", "בקשה לאישור גירושין (ועוד 457 ₪ לאישור עצמו, פרט 4(5)(ב)-(ג))"),
        "guardian": _fee(326, "פרט 6(א)", "בקשה למינוי אפוטרופוס לפסול דין או לקטין"),
        "adoption": _fee(417, "פרט 8", "בקשה לאימוץ"),
        "appeal_leave": _fee(596, "פרט 15(ב)", "בקשת רשות ערעור על החלטה אחרת בתביעה לפי פרטים 3, 4(1)(א)-(ד), 4(2) או 7"),
        "appeal_other": _fee(297, "פרט 15(ג)", "ערעור או בקשת רשות ערעור בכל עניין אחר"),
        "appeal_extend": _fee(52, "פרט 15(ד)", "בקשה להארכת המועד להגשת ערעור או בקשת רשות ערעור"),
        "copy": _fee(7, "פרט 16(א)", "העתק מפסק דין, החלטה, פרוטוקול או מסמך, עד שבעה עמודים"),
        "copy_certify": _fee(7, "פרט 16(ב)", "אישור העתק"),
        "absent": _fee(326, "פרט 17", "בקשה לביטול פסק דין שניתן שלא בפני בעל הדין (בתוך 15 ימים מההודעה: פטור)"),
        "order": _fee(326, "פרט 18(א)", "בקשה לצו עיקול, צו עיכוב יציאה מהארץ או צו מניעה"),
        "order_cancel": _fee(326, "פרט 18(ב)", "בקשה לביטול צו עיקול, עיכוב יציאה או מניעה"),
        "transfer": _fee(457, "פרט 19(ב)", "בקשה להעביר תביעה או תיק לבית דין אחר או להרכב אחר"),
        "status": _fee(457, "פרט 19(ו)", "בקשה לתיקון המצב האישי"),
        "single_cert": _fee(326, "פרט 19(ז)", "בקשה לתעודת רווקות"),
        "widow": _fee(326, "פרט 19(ט)", "בקשה לאישור אלמנות"),
        "judaism": _fee(326, "פרט 19(י)", "בקשה לאישור יהדות"),
        "other_request": _fee(326, "פרט 19(יג)", "בקשה שלא נקבעה לה אגרה"),
        "affidavit": _fee(52, "פרט 19(יד)", "אישור חתימה על תצהיר שלא במהלך הדיון"),
    }
    # The percent rules of the schedule (amount = max(pct% x value, min)).
    rab_pct = {
        "money_val": {"pct": 1, "min": 358, "item": "פרט 4(1)(ד)",
                      "he": "תביעה כספית הכרוכה בגירושין שאפשר להעריך בכסף: 1% מערכה, ולא פחות מ-358 ₪"},
        "shalom_money": {"pct": 0.5, "min": 326, "item": "פרט 2(ג)",
                         "he": "תביעת שלום בית שכוללת תביעות כספיות: תוספת של חצי אחוז מסכומן, ולא פחות מ-326 ₪"},
    }
    # Fees the payment service charges for matters the schedule does not name (data.gov.il 860 + the gov.il collector).
    rab_admin = {
        "ketubah": _fee(326, "טבלת ההנהלה: כתובה/פיצוי גירושין", "תביעת כתובה או פיצוי גירושין", "admin"),
        "change_agreement": _fee(326, "טבלת ההנהלה: שינוי הסכם גירושין", "שינוי הסכם גירושין שאושר", "admin"),
        "agreement_topup": _fee(210, "טבלת ההנהלה: השלמה מבקשה משותפת לאישור הסכם גירושין", "השלמה מבקשה משותפת לאישור הסכם", "admin"),
        "protection": _fee(0, "טבלת ההנהלה: צווי הגנה, אגרה 0", "בקשה לצו הגנה", "admin"),
        "inheritance": _fee(597, "טבלת ההנהלה: צו ירושה, צו קיום צוואה", "בקשה לצו ירושה או לצו קיום צוואה", "admin"),
        "inheritance_objection": _fee(597, "טבלת ההנהלה: התנגדות לצו ירושה", "התנגדות לצו ירושה או לצו קיום צוואה", "admin"),
        "inheritance_amend": _fee(597, "טבלת ההנהלה: תיקון או ביטול צו", "בקשה לתיקון או לביטול צו ירושה או צו קיום", "admin"),
        "inheritance_manager": _fee(597, "טבלת ההנהלה: מינוי מנהל עזבון", "בקשה למינוי מנהל עיזבון", "admin"),
        "dispute_shorten": _fee(326, "טבלת ההנהלה: קיצור או הארכה של עיכוב ההליכים", "בקשה לקצר או להאריך את תקופת עיכוב ההליכים", "admin"),
        "urgent": _fee(326, "טבלת ההנהלה: סעד דחוף, סעד זמני בהליך יישוב סכסוך", "בקשה לסעד דחוף או זמני בתקופת עיכוב ההליכים", "admin"),
    }
    # ---- The family court's fees missing from the wave-4 dataset (first schedule, text in force from 1.7.2026). ----
    fam_fees = {
        "money": {"pct": 1, "min": 574, "item": "פרט 1", "he": "תביעה לסכום כסף קצוב: 1% מהסכום, ולא פחות מ-574 ₪"},
        "spouse_money": {"pct": 1, "min": 361, "item": "פרט 1א",
                         "he": "תביעה בין בני זוג לסכום קצוב הנובעת מהקשר ביניהם (שאינה מזונות): 1% מהסכום, ולא פחות מ-361 ₪"},
        "property_other": _fee(3481, "פרט 2", "תביעה בענייני רכוש שאינה לסכום קצוב, שלא בין בני זוג"),
        "other": _fee(574, "פרט 6", "כל תביעה אחרת, לרבות אישור הסכם שאינו בין בני זוג"),
        "written": _fee(282, "פרט 7", "בקשה בכתב"),
        "will_judge": _fee(609, "פרט 8", "עשיית צוואה לפני שופט"),
        "will_proof": _fee(609, "פרט 9", "הוכחת צוואה לפי סעיף 68(ב) לחוק הירושה"),
        "copy_page": _fee(6, "פרט 11", "העתק מאושר מכל מסמך שבתיק, לכל עמוד"),
        "registrar_appeal": _fee(609, "פרט 12", "ערעור על החלטת רשם או רשם לענייני ירושה"),
    }
    # The district court (appeals on the family court), the Court Fees Regulations 2007, the text from 1.1.2026.
    appeal_court = {
        "regulation_he": "תקנות בתי המשפט (אגרות), התשס\"ז-2007", "url": FEE_GUIDE_GEN, "from": "2026-01-01",
        "appeal": _fee(775, "פרט 16ב", "ערעור על פסק דין של בית המשפט לענייני משפחה בתביעה לפי פרטים 1א, 2א, 5 או 6ב"),
        "leave": _fee(596, "פרט 12א", "בקשת רשות ערעור על החלטת ביניים של בית המשפט לענייני משפחה באותן תביעות"),
        "other": _fee(1067, "פרט 17", "ערעור אחר או ערר בבית המשפט המחוזי"),
    }

    # ---- The calculator's procedures: each with its fee at the rabbinical court and at the family court. A "ref" is a
    # path into the registry (the wave-4 dataset, this one, or inheritance_process); "na_he" says why a forum has none.
    D = "divorce_cost.rabbinical."
    F = "divorce_cost.family."
    R = KEY + ".rab.fees."
    A = KEY + ".rab.admin."
    M = KEY + ".fam.fees."
    T1 = {"ref": D + "transcript_divorce", "item_ref": D + "items.transcript_divorce"}
    T2 = {"ref": D + "transcript_other", "item_ref": D + "items.transcript_other"}
    TF = {"ref": F + "transcript", "item_ref": F + "items.transcript"}
    only_rab = "רק בבית הדין הרבני: ענייני נישואין וגירושין של יהודים בשיפוטו הייחודי (סעיף 1 לחוק השיפוט)"
    procedures = [
        # Opening the file and the divorce itself.
        {"id": "req", "group": "open", "he": "בקשה ליישוב סכסוך",
         "rab": {"ref": D + "request", "item_ref": D + "items.request", "note_he": "בלי החזר בסיום מוקדם (תקנה 12(ב))"},
         "fam": {"ref": F + "request", "item_ref": F + "items.request", "note_he": "בלי אגרת פרוטוקול (התוספת השנייה)"},
         "follows_forum": True},
        {"id": "div", "group": "open", "he": "תביעת גירושין", "refundable": True, "divorce": True,
         "rab": {"ref": D + "divorce", "item_ref": D + "items.divorce", "protocol": T1}, "fam": None, "na_he": only_rab},
        {"id": "joint", "group": "open", "he": "בקשה משותפת לגירושין (סידור גט בהסכמה)", "divorce": True,
         "rab": {"ref": D + "get_request", "item_ref": D + "items.get_request",
                 "abroad_ref": D + "get_request_abroad", "abroad_item_ref": D + "items.get_request_abroad"},
         "fam": None, "na_he": only_rab},
        {"id": "agree", "group": "open", "he": "אישור הסכם גירושין (תוקף של פסק דין)", "refundable": True,
         "rab": {"ref": D + "agreement", "item_ref": D + "items.agreement", "topup_ref": A + "agreement_topup"},
         "fam": {"ref": F + "agreement", "item_ref": F + "items.agreement", "protocol": TF}, "follows_forum": True},
        {"id": "shalom", "group": "open", "he": "תביעה לשלום בית", "refundable": True,
         "rab": {"ref": R + "shalom", "protocol": T2}, "fam": None,
         "na_he": "אין תביעה כזאת בבית המשפט: שלום בית נדון בבית הדין הרבני"},
        {"id": "mored", "group": "open", "he": "תביעה להכרזה כמורד או כמורדת", "refundable": True,
         "rab": {"ref": R + "mored", "protocol": T2}, "fam": None, "na_he": only_rab},
        # Claims linked to the divorce (the same claim in either forum).
        {"id": "prop", "group": "linked", "he": "חלוקת רכוש (איזון משאבים)", "refundable": True, "follows_forum": True,
         "rab": {"ref": D + "property", "item_ref": D + "items.property", "protocol": T2},
         "fam": {"ref": F + "property", "item_ref": F + "items.property", "protocol": TF}},
        {"id": "cust", "group": "linked", "he": "החזקת ילדים וזמני שהות", "refundable": True, "follows_forum": True,
         "rab": {"ref": D + "custody", "item_ref": D + "items.custody", "protocol": T2},
         "fam": {"ref": F + "custody", "item_ref": F + "items.custody", "protocol": TF}},
        {"id": "sup", "group": "linked", "he": "מזונות ילדים או אישה (התביעה לקבלם)", "refundable": True, "follows_forum": True,
         "rab": {"ref": D + "support", "item_ref": D + "items.support_exempt", "exempt": True,
                 "note_he": "התובע פטור, גם מאגרת הפרוטוקול (תקנות 14א ו-3א(ב))"},
         "fam": {"ref": F + "support", "item_ref": F + "items.support", "protocol": TF}},
        {"id": "supch", "group": "linked", "he": "הפחתה או ביטול של מזונות (בקשת המשלם)", "refundable": True, "follows_forum": True,
         "rab": {"ref": D + "support", "item_ref": KEY + ".rab.items.support", "protocol": T2,
                 "note_he": "טבלת ההנהלה גובה 279 ₪ על בקשה להפחתה או לביטול"},
         "fam": {"ref": F + "support", "item_ref": F + "items.support", "protocol": TF}},
        {"id": "ketubah", "group": "linked", "he": "כתובה או פיצוי גירושין", "refundable": True, "follows_forum": True, "value": True,
         "rab": {"ref": A + "ketubah", "pct_ref": KEY + ".rab.pct.money_val",
                 "note_he": "בפתיחת התיק נגבים 326 ₪ (טבלת ההנהלה); לפי פרט 4(1)(ד) תביעה כספית הכרוכה בגירושין: 1% מערכה ולא פחות מ-358 ₪, ובית הדין רשאי להעריך את השווי ולגבות הפרש (תקנה 5)"},
         "fam": {"pct_ref": M + "spouse_money", "protocol": TF}},
        {"id": "orders", "group": "linked", "he": "צו עיכוב יציאה מהארץ, עיקול או צו מניעה", "follows_forum": True,
         "rab": {"ref": R + "order"},
         "fam": {"ref": M + "written", "note_he": "בקשה בכתב; אגרת הפרוטוקול נגבית על תובענות, ולכן לא נוספה כאן"}},
        {"id": "protect", "group": "linked", "he": "צו הגנה (מניעת אלימות במשפחה)", "follows_forum": True,
         "rab": {"ref": A + "protection"},
         "fam": {"amount0": True, "item": "תקנה 7(1)", "note_he": "תובענה לפי החוק למניעת אלימות במשפחה פטורה מאגרה"}},
        # The get and the certificates.
        {"id": "get_agent", "group": "get", "he": "סידור גט בשליח", "rab": {"ref": R + "get_agent"}, "fam": None, "na_he": only_rab},
        {"id": "get_outside", "group": "get", "he": "סידור גט מחוץ לבית הדין", "rab": {"ref": R + "get_outside"}, "fam": None, "na_he": only_rab},
        {"id": "cert_copy", "group": "get", "he": "העתק מאושר של תעודת גירושין", "rab": {"ref": R + "certificate_copy"}, "fam": None, "na_he": only_rab},
        # After the judgment.
        {"id": "appeal", "group": "after", "he": "ערעור על פסק דין (גירושין, רכוש, מזונות, ילדים, הסכם)", "follows_forum": True,
         "rab": {"ref": D + "appeal", "item_ref": D + "items.appeal", "note_he": "לבית הדין הרבני הגדול"},
         "fam": {"ref": KEY + ".appeal_court.appeal.amount", "item_ref": KEY + ".appeal_court.appeal.item",
                 "note_he": "לבית המשפט המחוזי (תקנות בתי המשפט (אגרות), התשס\"ז-2007)"}},
        {"id": "leave", "group": "after", "he": "בקשת רשות ערעור על החלטת ביניים", "follows_forum": True,
         "rab": {"ref": R + "appeal_leave"},
         "fam": {"ref": KEY + ".appeal_court.leave.amount", "item_ref": KEY + ".appeal_court.leave.item"}},
        {"id": "appeal_other", "group": "after", "he": "ערעור בעניין אחר", "follows_forum": True,
         "rab": {"ref": R + "appeal_other"},
         "fam": {"ref": KEY + ".appeal_court.other.amount", "item_ref": KEY + ".appeal_court.other.item"}},
        {"id": "extend", "group": "after", "he": "בקשה להארכת המועד לערעור", "rab": {"ref": R + "appeal_extend"}, "fam": None, "fam_unknown": True,
         "na_he": "לא נמצא פרט אגרה נפרד לבקשה כזאת בבית המשפט המחוזי בטבלת הרשות השופטת"},
        {"id": "absent", "group": "after", "he": "ביטול פסק דין שניתן בהיעדר צד", "follows_forum": True,
         "rab": {"ref": R + "absent", "free_days": 15},
         "fam": {"ref": M + "written", "note_he": "בקשה בכתב"}},
        {"id": "change", "group": "after", "he": "שינוי הסכם גירושין שאושר", "rab": {"ref": A + "change_agreement"}, "fam": None, "fam_unknown": True,
         "na_he": "בבית המשפט האגרה לפי נושא התביעה: מזונות 283, החזקת ילדים 421, רכוש 601 ₪ (פרטים 5, 6ב, 2א)"},
        # Marriage and personal status (the rabbinical court only).
        {"id": "permit", "group": "status", "he": "היתר נישואין", "rab": {"ref": R + "permit"}, "fam": None, "na_he": only_rab},
        {"id": "permit_90", "group": "status", "he": "היתר נישואין בתוך 90 ימים מהגט, או למעוברת", "rab": {"ref": R + "permit_90"}, "fam": None, "na_he": only_rab},
        {"id": "single", "group": "status", "he": "אישור רווקות או פנוי לנישואין", "rab": {"ref": R + "single"}, "fam": None, "na_he": only_rab},
        {"id": "prenup", "group": "status", "he": "אישור הסכם ממון", "follows_forum": True,
         "rab": {"ref": R + "prenup", "note_he": "לפני הנישואין או אחריהם"},
         "fam": {"ref": F + "agreement", "item_ref": F + "items.agreement", "protocol": TF}},
        {"id": "annul", "group": "status", "he": "ביטול נישואין", "rab": {"ref": R + "marriage_validity"}, "fam": None, "na_he": only_rab},
        {"id": "widow", "group": "status", "he": "אישור אלמנות", "rab": {"ref": R + "widow"}, "fam": None, "na_he": only_rab},
        {"id": "judaism", "group": "status", "he": "בירור יהדות", "rab": {"ref": R + "judaism"}, "fam": None, "na_he": only_rab},
        # Inheritance (the rabbinical court only when every party agreed in writing, Succession Law s.155).
        {"id": "inh", "group": "inherit", "he": "צו ירושה או צו קיום צוואה", "follows_forum": True,
         "rab": {"ref": A + "inheritance"},
         "fam": {"ref": "inheritance_process.registrar.items.order.amount", "item_ref": "inheritance_process.registrar.items.order.item",
                 "note_he": "הבקשה מוגשת לרשם לענייני ירושה, לא לבית המשפט; 85% בהגשה מקוונת"}},
        {"id": "inh_obj", "group": "inherit", "he": "התנגדות לצו ירושה או לצו קיום צוואה", "follows_forum": True,
         "rab": {"ref": A + "inheritance_objection"},
         "fam": {"ref": "inheritance_process.family_court.items.objection.amount", "item_ref": "inheritance_process.family_court.items.objection.item"}},
        {"id": "inh_amend", "group": "inherit", "he": "תיקון או ביטול צו ירושה", "follows_forum": True,
         "rab": {"ref": A + "inheritance_amend"},
         "fam": {"ref": "inheritance_process.family_court.items.amend.amount", "item_ref": "inheritance_process.family_court.items.amend.item"}},
        {"id": "inh_mgr", "group": "inherit", "he": "מינוי מנהל עיזבון", "follows_forum": True,
         "rab": {"ref": A + "inheritance_manager"},
         "fam": {"ref": "inheritance_process.family_court.items.manager.amount", "item_ref": "inheritance_process.family_court.items.manager.item"}},
    ]

    # ---- The full first schedule of the Dayanim (Fees) Regulations, for the page table (amount None = exempt or
    # "expenses"; pct rows carry the rule). Read from Nevo, current to 22.1.2026. ----
    def row(item, he, amount=None, kind="fee", group=""):
        return {"item": item, "he": he, "amount": amount, "kind": kind, "group": group}
    schedule = [
        row("1(א)", "בקשה להיתר נישואין", 326, group="נישואין"),
        row("1(ב)", "אישור פסק דין סופי להיתר נישואין בידי נשיא בית הדין הגדול (חתימת מאה רבנים)", 457, group="נישואין"),
        row("1(ג)", "היתר נישואין למעוברת או לאישה בתוך 90 ימים מהגט או מפטירת הבעל", 326, group="נישואין"),
        row("1(ד)", "תביעה או בקשה בקשר לקיום או לביטול נישואין", 326, group="נישואין"),
        row("1(ה)", "בקשה לעיכוב נישואין", 326, group="נישואין"),
        row("1(ו)", "אישור הסכם ממון (סעיף 2 לחוק יחסי ממון)", 326, group="נישואין"),
        row("1(ז)", "תביעת כתובה מעיזבון", 457, group="נישואין"),
        row("1(ח)", "אישור רווקות או פנוי לצורך סידור נישואין", 326, group="נישואין"),
        row("2(א)", "תביעה לשלום בית, כולל צווים נלווים", 326, group="שלום בית"),
        row("2(ב)", "הליך ביניים בנפרד מהתביעה", 326, group="שלום בית"),
        row("2(ג)", "שלום בית עם תביעות כספיות: תוספת חצי אחוז מסכומן, ולא פחות מ-326 ₪", 326, "pct", group="שלום בית"),
        row("3(א)", "תביעת מזונות ומדור, כולל הגדלה, הפחתה, ביטול ומזונות ילדים (התובע פטור, תקנה 14א)", 279, group="מזונות"),
        row("3(ב)", "בקשת ביניים בתביעת מזונות או מדור", None, "exempt", group="מזונות"),
        row("4(1)(א)", "תביעה לגירושין והנלווים", 457, group="גירושין"),
        row("4(1)(ב)", "תביעה לחלוקת רכוש הכרוכה בגירושין", 596, group="גירושין"),
        row("4(1)(ג)", "תביעה כספית כרוכה שאינה ניתנת להערכה בכסף", 596, group="גירושין"),
        row("4(1)(ד)", "תביעה כספית כרוכה שניתן להעריכה: 1% מערכה, ולא פחות מ-358 ₪", 358, "pct", group="גירושין"),
        row("4(1)(ה)", "תביעה או בקשה לצו הפרדה, בנוסף לתביעה העיקרית", 457, group="גירושין"),
        row("4(1)(ו)", "תביעה להכרזה כמורד או כמורדת", 457, group="גירושין"),
        row("4(1)(ז)", "הליך ביניים המוגש בנפרד מהתביעה", 326, group="גירושין"),
        row("4(2)", "בקשה לתת להסכם גירושין תוקף של פסק דין (כולל הסכם מזונות)", 536, group="גירושין"),
        row("4(3)(א)", "בקשה לסידור גט כששני בני הזוג בארץ", 326, group="גט"),
        row("4(3)(ב)", "בקשה לסידור גט כשאחד מהם בחוץ לארץ", 457, group="גט"),
        row("4(3)(ג)", "סידור הגט כששניהם בארץ", None, "exempt", group="גט"),
        row("4(3)(ד)", "סידור גט בידי שליח (בארץ), תוספת", 457, group="גט"),
        row("4(3)(ה)", "סידור גט מחוץ לבית הדין, תוספת", 457, group="גט"),
        row("4(3)(ו)", "בקשה למסירת גט שנשלח ממקום אחר", 326, group="גט"),
        row("4(3)(ז)", "מסירה מחוץ לבית הדין של גט שנשלח ממקום אחר, תוספת", 457, group="גט"),
        row("4(3)(ח)", "הסדר מיוחד לסידור הגט או למסירתו: ההוצאות בפועל, בנוסף", None, "expenses", group="גט"),
        row("4(4)(א)", "תעודת גירושין, לכל צד", 326, group="גט"),
        row("4(4)(ב)", "העתק מאושר של תעודת גירושין", 326, group="גט"),
        row("4(5)(א)", "בקשה לאישור גירושין", 457, group="גט"),
        row("4(5)(ב)", "אישור גירושין שסודרו בארץ, תוספת", 457, group="גט"),
        row("4(5)(ג)", "אישור גירושין שסודרו בחוץ לארץ, תוספת", 457, group="גט"),
        row("4(5)(ד)", "בקשה וסידור גט של עיגון", None, "exempt", group="גט"),
        row("4(5)(ה)", "סידור גט ביוזמת בית הדין", None, "exempt", group="גט"),
        row("5", "בקשה לחליצה וסידורה", None, "exempt", group="חליצה"),
        row("6(א)", "מינוי אפוטרופוס לפסול דין או לקטין", 326, group="אפוטרופסות"),
        row("6(ב)", "מינוי אפוטרופוס לצורך משפט", None, "exempt", group="אפוטרופסות"),
        row("6(ג)", "מינוי מנהל לרכוש של נעדר", 457, group="אפוטרופסות"),
        row("6(ד)", "בקשת אפוטרופוס או מנהל להוראות", None, "exempt", group="אפוטרופסות"),
        row("6(ה)", "אפוטרופסות ייחודית של הורה או אפוטרופוס נוסף", None, "exempt", group="אפוטרופסות"),
        row("7", "בקשה להחזקת ילדים", 417, group="ילדים"),
        row("8", "בקשה לאימוץ", 417, group="ילדים"),
        row("10(א)", "כינון הקדש, כולל אישור השטר", 326, group="הקדשות"),
        row("10(ב)", "מינוי מנהל הקדש", 326, group="הקדשות"),
        row("10(ג)", "התנגדות למינוי מנהל הקדש", 326, group="הקדשות"),
        row("10(ד)", "צו מינוי או ביטול מינוי של מנהל הקדש", 326, group="הקדשות"),
        row("10(ה)", "ביטול הקדש", 457, group="הקדשות"),
        row("10(ו)", "ביטול מינוי מנהל הקדש", 457, group="הקדשות"),
        row("10(ז)", "בקשת מנהל הקדש להוראות", None, "exempt", group="הקדשות"),
        row("11(א)", "בקשה לגירות", 457, group="גירות"),
        row("11(ב)", "סידור גירות, תוספת", 457, group="גירות"),
        row("11(ג)(1)", "תעודת גירות", 326, group="גירות"),
        row("11(ג)(2)", "העתק תעודת גירות", 65, group="גירות"),
        row("11(ד)", "סידור גיור לחומרה", None, "exempt", group="גירות"),
        row("12(א)", "בקשה לדון בתביעת ממון (גם בוררות)", 65, group="תביעות ממון"),
        row("12(ב)", "חתימת שטר בוררות, התובע בלבד, בנוסף", 326, group="תביעות ממון"),
        row("12(ג)", "פסק דין בתביעת ממון, התובע בלבד", 65, group="תביעות ממון"),
        row("13(א)", "משלוח הזמנות ומסמכים בארץ", None, "exempt", group="הזמנות"),
        row("13(ב)", "משלוח לחוץ לארץ או בהסדר מיוחד: ההוצאות בפועל", None, "expenses", group="הזמנות"),
        row("14(א)-(ד)", "גביית עדות או השבעה מחוץ לבית הדין, או להעברה לחוץ לארץ", 457, group="עדות"),
        row("15(א)", "ערעור או ערעור שכנגד בעניין לפי פרטים 3, 4(1)(א)-(ד), 4(2) או 7", 775, group="ערעורים"),
        row("15(ב)", "בקשת רשות ערעור על החלטה אחרת באותם עניינים", 596, group="ערעורים"),
        row("15(ג)", "ערעור או בקשת רשות ערעור בכל עניין אחר", 297, group="ערעורים"),
        row("15(ד)", "בקשה להארכת המועד לערעור או לבקשת רשות ערעור", 52, group="ערעורים"),
        row("16(א)", "העתק מפסק דין, החלטה, פרוטוקול או מסמך, עד שבעה עמודים", 7, group="העתקים"),
        row("16(ב)", "אישור העתק", 7, group="העתקים"),
        row("17", "ביטול פסק דין שניתן שלא בפני בעל הדין (בתוך 15 ימים מההודעה: פטור)", 326, group="פסק דין בהיעדר"),
        row("18(א)-(ג)", "צו עיקול, עיכוב יציאה או מניעה, או ביטולו", 326, group="צווים"),
        row("19(א)", "רישיון לטוען רבני", 1632, group="שונות"),
        row("19(ב)", "העברת תביעה לבית דין אחר או להרכב אחר", 457, group="שונות"),
        row("19(ג)", "אישור זהות שמות במסמכים", 326, group="שונות"),
        row("19(ד)", "דחייה או הקדמה של מועד דיון או של הקראת פסק דין", None, "exempt", group="שונות"),
        row("19(ה)", "בקשה לאשר שהמבקש צד למשפט", 65, group="שונות"),
        row("19(ו)", "תיקון המצב האישי", 457, group="שונות"),
        row("19(ז)", "תעודת רווקות", 326, group="שונות"),
        row("19(ח)", "קביעת כשרות, יוחסין או אבהות", 326, group="שונות"),
        row("19(ט)", "אישור אלמנות", 326, group="שונות"),
        row("19(י)", "אישור יהדות", 326, group="שונות"),
        row("19(יא)", "אישור שהמבקש כהן או אינו כהן", 326, group="שונות"),
        row("19(יב)", "השלשת פיקדונות לפי פסק דין", None, "exempt", group="שונות"),
        row("19(יג)", "בקשה שלא נקבעה לה אגרה", 326, group="שונות"),
        row("19(יד)", "אישור חתימה על תצהיר שלא בדיון", 52, group="שונות"),
        row("19(טו)", "תצהיר לפני דיין לפי חוק שירות ביטחון", 65, group="שונות"),
        row("19(טז)", "בקשה ליישוב סכסוך לפי החוק להסדר התדיינויות בסכסוכי משפחה", 119, group="שונות"),
    ]

    return {
        "name_he": "אגרות בית הדין הרבני ובית המשפט לענייני משפחה, זו לצד זו",
        "publisher_he": "תקנות הדיינים (אגרות), תקנות בית המשפט לעניני משפחה (אגרות), טבלת האגרות של הנהלת בתי הדין הרבניים",
        "source_name": "תקנות הדיינים (אגרות), התשי\"ז-1957 (נוסח עדכני ל-22.1.2026)",
        "source_url": RAB,
        "checked_on": checked_on,
        "refresh_every_days": 92,
        "next_update": "2027-01-01",
        "rab": {
            "regulation_he": "תקנות הדיינים (אגרות), התשי\"ז-1957", "url": RAB, "current_to": "2026-01-22", "from": "2026-01-01",
            "indexed_he": "מתעדכנות ב-1 בינואר לפי מדד נובמבר ומעוגלות לשקל השלם (תקנה 3ב)",
            "next_update": "2027-01-01",
            "items": {"support": "פרט 3(א)", "protocol_1": "התוספת השנייה, פרט 1", "protocol_2": "התוספת השנייה, פרט 2"},
            "fees": rab_fees,
            "pct": rab_pct,
            "admin": rab_admin,
            "admin_table": {"he": "תעריפי אגרות של בתי הדין הרבניים (data.gov.il, מאגר 860)", "url": ADMIN,
                            "updated": "2026-02-15", "version_he": "עדכון אגרות בתי הדין הרבניים ינואר 2026"},
            "payment": {"he": "תשלום אגרות - בתי הדין הרבניים (gov.il)", "url": PAY_RAB,
                        "how_he": "לפני הגשת המסמכים לפתיחת התיק, בכרטיס אשראי בלבד, אגרה אחת בכל תשלום (אפשר בתשלומי קרדיט); מרכז המידע הארצי 5889*",
                        "checked_on": checked_on},
            "rules": {
                "pay_first": {"section": "תקנה 4", "he": "מי שבשמו ההליך משלם את האגרה לפני שמתחילים בו"},
                "each_claim": {"section": "תקנה 9", "he": "תובענה שכוללת כמה תביעות: אגרה על כל תביעה לחוד, בלי אגרה נוספת על עילה נוספת"},
                "counter": {"section": "תקנה 10", "he": "תביעה שכנגד: אותה אגרה כאילו הוגשה לבד"},
                "restore": {"section": "תקנה 11", "days": 15, "he": "תיק שנמחק והוחזר לרשימה בבקשה בתוך 15 ימים מצו המחיקה: מחצית האגרה; אחרי כן, האגרה המלאה"},
                "refund_early": {"section": "תקנה 12(א)(1)", "pct": 50, "he": "הדיון הסתיים לפי בקשת המגיש לפני שמיעת ראיות (או טענות): האגרה קטנה ב-50%"},
                "refund_late": {"section": "תקנה 12(א)(2)", "pct": 25, "he": "הסתיים אחרי שמיעת ראיות: האגרה קטנה ב-25%, והעודף מוחזר"},
                "refund_not": {"section": "תקנה 12(ב)", "he": "אין הקטנה על בקשה ליישוב סכסוך"},
                "repeat_appeal": {"section": "תקנה 13", "he": "ערעור חוזר אחרי שהתיק הוחזר מבית הדין הגדול: בלי אגרה נוספת"},
                "free": {"section": "תקנה 14", "he": "בלי אגרה: העתק מאושר ראשון של פסק דין למי שביקש בתוך חודש, בקשה לביטול או למחיקה של תביעה, בקשה להחזר אגרה, בקשה לדחיית תשלום, דחיית דיון בגלל מילואים, ועיון בתיק"},
                "support": {"section": "תקנה 14א", "he": "בתביעת מזונות התובע פטור מאגרה; אם בעל הדין שכנגד חויב בהוצאות, הוא חייב באגרה"},
                "defer": {"section": "תקנה 15", "days": 15, "he": "מי שאינו יכול לשלם מצרף בקשה לוועדה לדחיית תשלום; תעודה של לשכת הסיוע המשפטי היא ראיה לכאורה. סירבה הוועדה, משלמים בתוך זמן שקבעה, עד 15 ימים"},
                "exempt_after": {"section": "תקנה 17", "he": "בגמר הדיון אפשר לבקש פטור מאגרה שנדחתה, למי שאינו יכול לשלם"},
                "legal_aid": {"section": "תקנה 22א", "he": "פטור מאגרה: מי שמיוצג בידי הסיוע המשפטי בהליך שאושר, ומי שזכאי לשירות לפי התוספת לחוק הסיוע המשפטי"},
                "value": {"section": "תקנה 5", "he": "תביעה לפי שווי: בית הדין או הוועדה רשאים להעריך את השווי ולגבות את ההפרש"},
            },
        },
        "fam": {
            "regulation_he": "תקנות בית המשפט לעניני משפחה (אגרות), התשנ\"ו-1995", "url": FAM, "current_to": "2026-07-01", "from": "2026-07-01",
            "notice_he": "הודעת בית המשפט לענייני משפחה (אגרות), התשפ\"ו-2026 (21.6.2026)", "notice_url": FAM_NOTICE,
            "guide_url": FEE_GUIDE_FAM,
            "indexed_he": "מתעדכנות פעמיים בשנה, ב-1 בינואר וב-1 ביולי (תקנה 4(א))",
            "next_update": "2027-01-01",
            "fees": fam_fees,
            "payment": {"he": "חיובים ואמצעי תשלום במערכת בתי המשפט (הרשות השופטת)", "url": PAY_FAM,
                        "how_he": "בכרטיס אשראי באתר נט המשפט (תשלומים), במזכירות בית המשפט או במוקד 3852*, וגם בשובר, בהעברה בנקאית או בהרשאה לחיוב",
                        "checked_on": checked_on},
            "exempt_service": {"he": "בקשה לפטור מתשלום אגרה בגלל חוסר יכולת כלכלית", "url": FAM_EXEMPT},
            "rules": {
                "pay_first": {"section": "תקנה 2(א)", "he": "בית המשפט לא נזקק להליך עד שהאגרה ואגרת הפרוטוקול שולמו, אלא אם המגיש פטור"},
                "each_claim": {"section": "תקנה 2(ב)", "he": "אגרה על כל תביעה ותביעה לפי פריטי התוספת, יהיו מספר הסעדים אשר יהיו"},
                "demand": {"section": "תקנה 2(ד)", "days": 7, "he": "לא שולמה אגרה: המזכירות דורשת לשלם בתוך 7 ימים; לא שולמה, ההליך נמחק"},
                "copy_free": {"section": "תקנה 3(ב)", "he": "כל בעל דין מקבל עותק מאושר אחד של הפרוטוקול ושל פסק הדין בלי תשלום"},
                "transfer": {"section": "תקנה 5", "he": "תובענה שהועברה מבית משפט אחר או מהרשם לענייני ירושה: האגרה ששולמה נחשבת ששולמה"},
                "legal_aid": {"section": "תקנה 6(6)-(7)", "he": "פטור מאגרה: מי שמיוצג בידי הסיוע המשפטי בהליך שאושר, ומי שזכאי לשירות לפי התוספת לחוק"},
                "bereaved": {"section": "תקנה 6(4)-(5)", "he": "פטור למשפחות של מי שנפטר או נפגע בפעולות איבה או בשירות צבאי, בהליכי ירושה ואפוטרופסות הנוגעים לכך"},
                "matters": {"section": "תקנה 7", "he": "פטורים: תובענה לפי החוק למניעת אלימות במשפחה או להחזרת קטין חטוף, בקשת ביניים בתביעת מזונות, בקשה לפטור, הזמנת עדים ועיון בתיק"},
                "refund_all": {"section": "תקנה 8(א)", "he": "התביעה הועברה לבוררות או הסתיימה בהסדר פישור: בית המשפט רשאי להורות על החזר כל האגרה"},
                "refund_half": {"section": "תקנה 8(ב)", "pct": 50, "he": "התביעה הסתיימה בפשרה עד קדם המשפט: משלמים מחצית האגרה"},
                "exempt": {"section": "תקנה 9", "days": 15, "he": "בקשה לפטור בתצהיר על הרכוש וההכנסות; החלטת פטור קודמת, חייב מוגבל באמצעים, פשיטת רגל (בשנתיים האחרונות) או קבלת הבטחת הכנסה הן ראיה לכאורה; אגרה שלא פוטרה משולמת בתוך 15 ימים מההחלטה"},
            },
        },
        "appeal_court": appeal_court,
        # Periods the procedure regulations fix (days). Nothing here is a court's working time.
        "deadlines": {
            "rab_url": PROC, "rab_he": "תקנות הדיון בבתי-הדין הרבניים בישראל, התשנ\"ג", "rab_current_to": "2026-01-01",
            "appeal": {"days": 30, "section": "תקנה קלח(1)", "he": "ערעור לבית הדין הרבני הגדול: 30 ימים מיום מתן פסק הדין; מי שלא ידע מראש על מועד מתן הפסק, מהיום שהודע לו (קלח(2))"},
            "leave": {"days": 10, "section": "תקנה קלג(2)", "he": "בקשת רשות ערעור על החלטת ביניים: 10 ימים מיום מתן ההחלטה"},
            "cross": {"days": 15, "section": "תקנה קמה(1)", "he": "ערעור שכנגד: 15 ימים מהיום שהמשיב קיבל את כתב הערעור"},
            "answer": {"days": 15, "section": "תקנה קמד", "he": "תשובה לערעור: 15 ימים מהיום שכתב הערעור נמסר"},
            "absent": {"days": 30, "section": "תקנה קכא", "he": "ביטול פסק דין שניתן במעמד צד אחד: 30 ימים מהיום שהעתק פסק הדין נמסר"},
            "absent_free": {"days": 15, "section": "התוספת הראשונה, פרט 17", "he": "בקשה לביטול שמוגשת בתוך 15 ימים מהיום שהודע על פסק הדין: פטורה מאגרה"},
            "venue": {"days": 30, "section": "תקנה יט(1)", "he": "טענת חוסר סמכות מקומית: בכתב, בתוך 30 ימים מקבלת התביעה"},
            "summons": {"days": 30, "section": "תקנה לח(1)", "he": "בתביעה שאינה למזונות, ההזמנה לדיון נשלחת לפחות 30 ימים לפני הדיון"},
            "permit_90": {"days": 90, "section": "התוספת הראשונה, פרט 1(ג)", "he": "נישואין בתוך 90 ימים מהגט מחייבים בקשה להיתר"},
            "fam_appeal": {"days": 60, "section": "תקנה 137(א)", "url": CIVIL,
                           "law_he": "תקנות סדר הדין האזרחי, התשע\"ט-2018",
                           "he": "ערעור על פסק דין של בית המשפט לענייני משפחה: 60 ימים מיום שפסק הדין הומצא"},
        },
        "jurisdiction": {
            "law_he": "חוק שיפוט בתי דין רבניים (נישואין וגירושין), התשי\"ג-1953", "url": JURIS,
            "exclusive_he": "ענייני נישואין וגירושין של יהודים אזרחי ישראל או תושביה בשיפוטם הייחודי של בתי הדין הרבניים (סעיף 1)",
            "linked_he": "תביעת גירושין שהוגשה לבית הדין הרבני מושכת אליו כל עניין שכרוך בה, ובהוראת השעה גם מזונות הילדים והשבת הוצאות עליהם (סעיף 3)",
            "temp_from": "2025-11-18", "temp_to": "2027-11-18",
            "temp_he": "הוראת השעה בסעיף 3, לשנתיים מ-18.11.2025: מזונות ילדי הזוג נכללים בעניינים הכרוכים בתביעת הגירושין",
            "abroad_section": "סעיף 4א",
            "succession_he": "בית דין דתי נותן צו ירושה או צו קיום רק כשכל הנוגעים בדבר הסכימו בכתב (סעיף 155 לחוק הירושה)",
        },
        "forms": {
            "dispute": {"he": "בקשה ליישוב סכסוך במשפחה (טופס 1, הרשות השופטת)", "url": DISPUTE_FORM},
        },
        "procedures": procedures,
        "schedule": schedule,
    }
