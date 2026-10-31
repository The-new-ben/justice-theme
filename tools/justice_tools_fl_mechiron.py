"""The divorce calculator and price list (machshevon-gerushin) on /divorce-lawyer/: "מחשבון גירושין" and "מחירון גירושין"
(31.10.2026, HAD-616). Discovered by tools/justice_tools_fl.py (glob), built with --fl-checked-on.

What this file adds, and what it does NOT repeat. Every official amount the calculator and the price list show is already in
the registry: the Dayanim (Fees) Regulations 1957 and the Family Court (Fees) Regulations 1995 (reg.divorce_cost, wave 4,
and reg.fl_rabanut, HAD-579), the district court's appeal items (reg.fl_rabanut.appeal_court), the Bar's recommended
minimum tariff (reg.divorce_cost.bar), the notary's tariff (reg.prenup.routes.notary) and legal aid (reg.malpractice_mechir
.legal_aid). OFFICIAL below names each row by its registry path; build() resolves the amount, the item and the url from the
registry at build time and stores them next to the path, so the page's data island carries this dataset alone, and the
golden test (tests/js/test-divorce-calc.mjs) fails when a stored amount no longer equals the value at its path. The few
official amounts the registry did not hold (the execution office and the notary's signature verification) carry their own
source here.

MARKET is what named offices, mediators and experts publish, read on 31.10.2026: every source with its url, a short quote,
whether VAT is included and the read day; a source that gives a price "per hour from each side" carries factor 2 to bring it
to "per hour for the couple". Never one firm's price and never estimated: the engine takes the lowest published low, the
highest published high and the median of the sources' mid-points; a row without a verified source is "לא נבדק" and never
enters a total. Only official pages and Adv. Maya Rotenberg's office site are linked from the page ("link": True); other
offices are named with their domain, so the price list never becomes a link list to competitors.
"""
from __future__ import annotations

import json
from pathlib import Path

KEY = "fl_mechiron"
# Built after every other dataset, from the registry being assembled (tools/justice_tools_fl.py add_fl_dependents()).
READS_REGISTRY = True
REGISTRY = Path(__file__).resolve().parent.parent / "assets" / "data" / "justice-tools-registry.json"
LINKED = ("rotenberglaw.co.il", "gov.il", "nevo.co.il", "idi.org.il", "knesset.gov.il")

DAYANIM = "תקנות הדיינים (אגרות)"
FAMILY = "תקנות בית המשפט לעניני משפחה (אגרות)"
COURTS_FEES = "תקנות בתי המשפט (אגרות)"
BAR = "כללי לשכת עורכי הדין (התעריף המינימלי המומלץ)"
NOTARY = "תקנות הנוטריונים (שכר שירותים)"
AID = "תקנות הסיוע המשפטי"
ADMIN = "טבלת התשלומים של הנהלת בתי הדין הרבניים"

# group: rb | fam | appeal | bar | notary | exec | aid. "ref" is the registry path of the amount (a number, or an object
# with "amount" and "item"); "item_ref" / "url_ref" where the item or the url live apart. "zero_he" names a row that costs
# nothing; "note_he" may hold {v}, filled with the value at "note_ref".
OFFICIAL = [
    # The rabbinical court (the get is given only there).
    {"id": "rb_request", "group": "rb", "he": "בקשה ליישוב סכסוך, הצעד הראשון במחלוקת", "ref": "divorce_cost.rabbinical.request", "item_ref": "divorce_cost.rabbinical.items.request", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_divorce", "group": "rb", "he": "תביעת גירושין", "ref": "divorce_cost.rabbinical.divorce", "item_ref": "divorce_cost.rabbinical.items.divorce", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_transcript_divorce", "group": "rb", "he": "אגרת פרוטוקול בתביעת גירושין", "ref": "divorce_cost.rabbinical.transcript_divorce", "item_ref": "divorce_cost.rabbinical.items.transcript_divorce", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_property", "group": "rb", "he": "תביעה רכושית הכרוכה בגירושין: איזון משאבים, דירה", "ref": "divorce_cost.rabbinical.property", "item_ref": "divorce_cost.rabbinical.items.property", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_custody", "group": "rb", "he": "החזקת ילדים (משמורת)", "ref": "divorce_cost.rabbinical.custody", "item_ref": "divorce_cost.rabbinical.items.custody", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_support", "group": "rb", "he": "תביעת מזונות", "amount": 0, "zero_he": "פטור למי שתובע", "note_he": "{v} ₪ משלם הצד השני אם בית הדין מחייב אותו בהוצאות", "note_ref": "divorce_cost.rabbinical.support", "item_ref": "divorce_cost.rabbinical.items.support_exempt", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_transcript_other", "group": "rb", "he": "אגרת פרוטוקול בתביעות האחרות", "ref": "divorce_cost.rabbinical.transcript_other", "item_ref": "divorce_cost.rabbinical.items.transcript_other", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_agreement", "group": "rb", "he": "בקשה לתת להסכם גירושין תוקף של פסק דין", "ref": "divorce_cost.rabbinical.agreement", "item_ref": "divorce_cost.rabbinical.items.agreement", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_get_free", "group": "rb", "he": "סידור הגט כששני בני הזוג בארץ", "amount": 0, "zero_he": "בלי אגרה", "item_ref": "divorce_cost.rabbinical.items.get_free", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_get_request", "group": "rb", "he": "בקשה נפרדת לסידור גט (למשל אחרי אישור הסכם בבית המשפט)", "ref": "divorce_cost.rabbinical.get_request", "item_ref": "divorce_cost.rabbinical.items.get_request", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_get_request_abroad", "group": "rb", "he": "בקשה לסידור גט כשאחד מבני הזוג בחוץ לארץ", "ref": "divorce_cost.rabbinical.get_request_abroad", "item_ref": "divorce_cost.rabbinical.items.get_request_abroad", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_certificate", "group": "rb", "he": "תעודת גירושין, לכל אחד מבני הזוג", "ref": "divorce_cost.rabbinical.certificate", "item_ref": "divorce_cost.rabbinical.items.certificate", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_ketubah", "group": "rb", "he": "תביעת כתובה או פיצוי גירושין", "ref": "fl_rabanut.rab.admin.ketubah", "url_ref": "fl_rabanut.rab.admin_table.url", "src_he": ADMIN},
    {"id": "rb_shalom", "group": "rb", "he": "תביעת שלום בית", "ref": "fl_rabanut.rab.fees.shalom", "url_ref": "fl_rabanut.rab.url", "src_he": DAYANIM},
    {"id": "rb_mored", "group": "rb", "he": "תביעה להכרזה כמורד או כמורדת", "ref": "fl_rabanut.rab.fees.mored", "url_ref": "fl_rabanut.rab.url", "src_he": DAYANIM},
    {"id": "rb_order", "group": "rb", "he": "בקשה לצו עיקול, עיכוב יציאה מהארץ או מניעה", "ref": "fl_rabanut.rab.fees.order", "url_ref": "fl_rabanut.rab.url", "src_he": DAYANIM},
    {"id": "rb_urgent", "group": "rb", "he": "סעד דחוף או זמני בתקופת עיכוב ההליכים", "ref": "fl_rabanut.rab.admin.urgent", "url_ref": "fl_rabanut.rab.admin_table.url", "src_he": ADMIN},
    {"id": "rb_protection", "group": "rb", "he": "בקשה לצו הגנה", "ref": "fl_rabanut.rab.admin.protection", "zero_he": "בלי אגרה", "url_ref": "fl_rabanut.rab.admin_table.url", "src_he": ADMIN},
    {"id": "rb_change_agreement", "group": "rb", "he": "שינוי הסכם גירושין שאושר", "ref": "fl_rabanut.rab.admin.change_agreement", "url_ref": "fl_rabanut.rab.admin_table.url", "src_he": ADMIN},
    {"id": "rb_prenup", "group": "rb", "he": "אישור הסכם ממון בבית הדין", "ref": "fl_rabanut.rab.fees.prenup", "url_ref": "fl_rabanut.rab.url", "src_he": DAYANIM},
    {"id": "rb_affidavit", "group": "rb", "he": "אישור חתימה על תצהיר שלא במהלך הדיון", "ref": "fl_rabanut.rab.fees.affidavit", "url_ref": "fl_rabanut.rab.url", "src_he": DAYANIM},
    {"id": "rb_appeal", "group": "rb", "he": "ערעור לבית הדין הרבני הגדול", "ref": "divorce_cost.rabbinical.appeal", "item_ref": "divorce_cost.rabbinical.items.appeal", "url_ref": "divorce_cost.rabbinical.url", "src_he": DAYANIM},
    {"id": "rb_appeal_leave", "group": "rb", "he": "בקשת רשות ערעור על החלטה אחרת", "ref": "fl_rabanut.rab.fees.appeal_leave", "url_ref": "fl_rabanut.rab.url", "src_he": DAYANIM},
    # The family court (the property, the children, the support, the agreement; never the get).
    {"id": "fam_request", "group": "fam", "he": "בקשה ליישוב סכסוך, הצעד הראשון במחלוקת", "ref": "divorce_cost.family.request", "item_ref": "divorce_cost.family.items.request", "url_ref": "divorce_cost.family.url", "src_he": FAMILY},
    {"id": "fam_property", "group": "fam", "he": "תביעה רכושית בין בני זוג: איזון משאבים, פירוק שיתוף", "ref": "divorce_cost.family.property", "item_ref": "divorce_cost.family.items.property", "url_ref": "divorce_cost.family.url", "src_he": FAMILY},
    {"id": "fam_custody", "group": "fam", "he": "תביעה בעניין החזקת ילדים וזמני שהות", "ref": "divorce_cost.family.custody", "item_ref": "divorce_cost.family.items.custody", "url_ref": "divorce_cost.family.url", "src_he": FAMILY},
    {"id": "fam_support", "group": "fam", "he": "תביעת מזונות", "ref": "divorce_cost.family.support", "item_ref": "divorce_cost.family.items.support", "url_ref": "divorce_cost.family.url", "src_he": FAMILY},
    {"id": "fam_agreement", "group": "fam", "he": "אישור הסכם בין בני הזוג (הסכם גירושין או הסכם ממון)", "ref": "divorce_cost.family.agreement", "item_ref": "divorce_cost.family.items.agreement", "url_ref": "divorce_cost.family.url", "src_he": FAMILY},
    {"id": "fam_transcript", "group": "fam", "he": "אגרת פרוטוקול", "ref": "divorce_cost.family.transcript", "item_ref": "divorce_cost.family.items.transcript", "url_ref": "divorce_cost.family.url", "src_he": FAMILY},
    {"id": "fam_written", "group": "fam", "he": "בקשה בכתב", "ref": "fl_rabanut.fam.fees.written", "url_ref": "fl_rabanut.fam.url", "src_he": FAMILY},
    # Appeals on a family-court judgment, in the district court.
    {"id": "district_appeal", "group": "appeal", "he": "ערעור על פסק דין של בית המשפט לענייני משפחה (רכוש, מזונות, משמורת)", "ref": "fl_rabanut.appeal_court.appeal", "url_ref": "fl_rabanut.appeal_court.url", "src_he": COURTS_FEES},
    {"id": "district_leave", "group": "appeal", "he": "בקשת רשות ערעור על החלטת ביניים באותן תביעות", "ref": "fl_rabanut.appeal_court.leave", "url_ref": "fl_rabanut.appeal_court.url", "src_he": COURTS_FEES},
    # The Bar's recommended minimum (not binding, rule 2; VAT on top, rule 1): per side and its lawyer.
    {"id": "bar_get_consent", "group": "bar", "he": "סידור גט בהסכמה", "ref": "divorce_cost.bar.get_consent", "item_ref": "divorce_cost.bar.items.get_consent", "url_ref": "divorce_cost.bar.url", "src_he": BAR, "vat": True},
    {"id": "bar_get_contested", "group": "bar", "he": "תביעה לגט בלי הסכמה", "ref": "divorce_cost.bar.get_contested", "item_ref": "divorce_cost.bar.items.get_contested", "url_ref": "divorce_cost.bar.url", "src_he": BAR, "vat": True},
    {"id": "bar_custody_agreed", "group": "bar", "he": "החזקת ילדים בהסכמה", "ref": "divorce_cost.bar.custody_agreed", "item_ref": "divorce_cost.bar.items.custody_agreed", "url_ref": "divorce_cost.bar.url", "src_he": BAR, "vat": True},
    {"id": "bar_custody_opposed", "group": "bar", "he": "החזקת ילדים שיש בה התנגדות", "ref": "divorce_cost.bar.custody_opposed", "item_ref": "divorce_cost.bar.items.custody_opposed", "url_ref": "divorce_cost.bar.url", "src_he": BAR, "vat": True},
    {"id": "bar_agreement", "group": "bar", "he": "עריכת הסכם לפסק הגט (לא פחות מ-)", "ref": "divorce_cost.bar.agreement_min", "item_ref": "divorce_cost.bar.items.agreement", "url_ref": "divorce_cost.bar.url", "src_he": BAR, "vat": True},
    {"id": "bar_extra_hearing", "group": "bar", "he": "כל דיון נוסף", "ref": "divorce_cost.bar.extra_hearing", "item_ref": "divorce_cost.bar.items.extra_hearing", "url_ref": "divorce_cost.bar.url", "src_he": BAR, "vat": True},
    # The notary's tariff is a fixed price: a notary may not charge more or less (the regulations), VAT on top.
    {"id": "notary_prenup", "group": "notary", "he": "אימות הסכם ממון לפני הנישואין", "ref": "prenup.routes.notary.fee", "item_ref": "prenup.routes.notary.fee_item", "url_ref": "prenup.routes.notary.fee_url", "src_he": NOTARY, "vat": True},
    {"id": "notary_prenup_copy", "group": "notary", "he": "כל העתק נוסף של ההסכם המאומת", "ref": "prenup.routes.notary.fee_copy", "item_ref": "prenup.routes.notary.fee_copy_item", "url_ref": "prenup.routes.notary.fee_url", "src_he": NOTARY, "vat": True},
    # Legal aid (the Ministry of Justice): the participation fee replaces the lawyer's fee for who is eligible.
    {"id": "aid_low", "group": "aid", "he": "סיוע משפטי: אגרת השתתפות, למי שהכנסתו עד מחצית הסף", "ref": "malpractice_mechir.legal_aid.participation_low", "item_ref": "malpractice_mechir.legal_aid.participation_section", "url_ref": "malpractice_mechir.legal_aid.regs_url", "src_he": AID, "note_he": "הסף: הכנסה עד {v} ₪ בחודש למשק בית של עד שלוש נפשות", "note_ref": "malpractice_mechir.legal_aid.income_base"},
    {"id": "aid_high", "group": "aid", "he": "סיוע משפטי: אגרת השתתפות, מעל מחצית הסף", "ref": "malpractice_mechir.legal_aid.participation_high", "item_ref": "malpractice_mechir.legal_aid.participation_section", "url_ref": "malpractice_mechir.legal_aid.regs_url", "src_he": AID, "note_he": "ועוד {v} ₪ לכל נפש מהרביעית", "note_ref": "malpractice_mechir.legal_aid.per_person"},
    {"id": "aid_advance", "group": "aid", "he": "סיוע משפטי: מקדמה שנזקפת על חשבון אגרת ההשתתפות", "ref": "malpractice_mechir.legal_aid.advance", "item_ref": "malpractice_mechir.legal_aid.advance_section", "url_ref": "malpractice_mechir.legal_aid.regs_url", "src_he": AID},
    {"id": "mahut", "group": "aid", "he": "פגישות מהו\"ת ביחידת הסיוע (עד ארבע)", "amount": 0, "zero_he": "בלי תשלום", "item_ref": "divorce_cost.disputes.sections.meetings", "url_ref": "divorce_cost.disputes.regs_url", "src_he": "תקנות להסדר התדיינויות בסכסוכי משפחה, טופס 2"},
    # Notary signature and copy (Nevo, the consolidated text current to 1.1.2026): the regulations' fixed price, VAT on top.
    {"id": "notary_signature", "group": "notary", "he": "אימות חתימה, חותם ראשון", "amount": 197, "item": "התוספת, פרט 1(א)", "url": "https://www.nevo.co.il/law_html/law00/90738.htm", "src_he": NOTARY, "vat": True},
    {"id": "notary_signature_extra", "group": "notary", "he": "כל חותם נוסף על אותו מסמך", "amount": 77, "item": "התוספת, פרט 1(ב)", "url": "https://www.nevo.co.il/law_html/law00/90738.htm", "src_he": NOTARY, "vat": True},
    {"id": "notary_copy", "group": "notary", "he": "אישור העתק של מסמך, העמוד הראשון", "amount": 77, "item": "התוספת, פרט 2(א)", "url": "https://www.nevo.co.il/law_html/law00/90738.htm", "src_he": NOTARY, "vat": True, "note_he": "ועוד 13 ₪ לכל עמוד נוסף"},
    # The execution office: its official fee table did not open for checking (gov.il). Shown as "לא נבדק", never totalled.
    {"id": "exec_support", "group": "exec", "he": "פתיחת תיק מזונות בהוצאה לפועל", "unchecked": True, "url": "https://www.gov.il/he/service/opening_alimony_file", "src_he": "רשות האכיפה והגבייה", "note_he": "לפי שני משרדי עורכי דין (oferadv.co.il, ekulyo-law.co.il) הפתיחה פטורה מאגרה. את טבלת האגרות של רשות האכיפה לא הצלחנו לפתוח לבדיקה"},
    {"id": "exec_judgment", "group": "exec", "he": "פתיחת תיק לביצוע פסק דין כספי (למשל איזון משאבים שלא שולם)", "unchecked": True, "url": "https://www.gov.il/he/service/opening_judgment_order_file", "src_he": "רשות האכיפה והגבייה", "note_he": "לפי משרדי עורכי דין: 1% מהחוב, עם מינימום שמשרדים מציינים כ-93 או 109 ₪. לא נבדק מול הטבלה הרשמית"},
]


MARKET_SOURCES = {
 "lawyer_consult": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/2025-divorce-attorney-prices",
   "low": 500,
   "high": 1500,
   "vat": "none",
   "quote_he": "עלותה יכולה לנוע בין 500–1,500 ש\"ח",
   "read_on": "2026-10-31",
   "what_he": "פגישת ייעוץ עם עו\"ד גירושין"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 750,
   "high": 1500,
   "vat": "none",
   "quote_he": "משרד מוביל: 750–1,500 ₪ לפגישת ייעוץ של כשעה.",
   "read_on": "2026-10-31",
   "what_he": "פגישת ייעוץ (משרד מוביל)"
  },
  {
   "name_he": "משרד עו\"ד אייל סייג",
   "url": "https://www.sayag-law.co.il/price-divorce-lawyer/",
   "low": 300,
   "high": 800,
   "vat": "none",
   "quote_he": "ייעוץ ראשוני (פגישה) | ₪800 – ₪300",
   "read_on": "2026-10-31",
   "what_he": "ייעוץ ראשוני (פגישה)"
  },
  {
   "name_he": "עו\"ד עופר סטרוסקי",
   "url": "https://www.stroosky-law.co.il/lawyerprice",
   "low": 500,
   "high": 1000,
   "vat": "none",
   "quote_he": "מחיר פגישה עם עורך דין גירושין נעה בסביבות 500-1000 ש\"ח",
   "read_on": "2026-10-31",
   "what_he": "פגישה עם עו\"ד גירושין"
  },
  {
   "name_he": "משרד עו\"ד חגית לב",
   "url": "https://www.adv-office.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A/",
   "low": 800,
   "high": 1600,
   "vat": "plus",
   "quote_he": "פגישת ייעוץ ראשונה (עד שעה) | 800-1,600 ₪ + מע\"מ",
   "read_on": "2026-10-31",
   "what_he": "פגישת ייעוץ ראשונה (עד שעה)"
  },
  {
   "name_he": "עו\"ד אמיר כהן",
   "url": "https://advfamily.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2026/",
   "low": 300,
   "high": 1500,
   "vat": "none",
   "quote_he": "פגישת ייעוץ ראשונית נמשכת בדרך כלל כשעה ועולה בין 300 ל-1,500 ₪",
   "read_on": "2026-10-31",
   "what_he": "פגישת ייעוץ ראשונית"
  },
  {
   "name_he": "משרד עו\"ד מורן גוהר",
   "url": "https://www.gohar-law.com/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%97%D7%99%D7%A8",
   "low": 700,
   "high": 1500,
   "vat": "none",
   "quote_he": "פגישת ייעוץ ראשונית | 700–1,500 ₪",
   "read_on": "2026-10-31",
   "what_he": "פגישת ייעוץ ראשונית"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Tip/14207",
   "low": 600,
   "high": 1500,
   "vat": "none",
   "quote_he": "פגישת ייעוץ תעלה בין 600 -1,500 ש\"ח לשעה,",
   "read_on": "2026-10-31",
   "what_he": "פגישת ייעוץ"
  }
 ],
 "lawyer_agreement": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/2025-divorce-attorney-prices",
   "low": 7000,
   "high": 20000,
   "vat": "none",
   "quote_he": "טווח העלות לרוב נע בין 7,000–20,000 ש\"ח.",
   "read_on": "2026-10-31",
   "what_he": "הסכם גירושין בהסכמה"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 7000,
   "high": 15000,
   "vat": "none",
   "quote_he": "משרד מוביל: 7,000–15,000 ₪ לעריכת הסכם גירושין מלא",
   "read_on": "2026-10-31",
   "what_he": "הסכם גירושין מלא (משרד מוביל)"
  },
  {
   "name_he": "משרד עו\"ד אייל סייג",
   "url": "https://www.sayag-law.co.il/price-divorce-lawyer/",
   "low": 5000,
   "high": 15000,
   "vat": "none",
   "quote_he": "הסכם גירושין בהסכמה | ₪15,000 – ₪5,000",
   "read_on": "2026-10-31",
   "what_he": "הסכם גירושין בהסכמה"
  },
  {
   "name_he": "עו\"ד אביטל חורף",
   "url": "https://lawdin.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%94%D7%A1%D7%9B%D7%9E%D7%94/",
   "low": 5000,
   "high": 15000,
   "vat": "none",
   "quote_he": "שכר טרחת עורך דין לשני בני הזוג, בין ₪5,000-15,000 ש\"ח.",
   "read_on": "2026-10-31",
   "what_he": "שכר טרחה, גירושין בהסכמה"
  },
  {
   "name_he": "משרד עו\"ד חגית לב",
   "url": "https://www.adv-office.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A/",
   "low": 15000,
   "high": 20000,
   "vat": "plus",
   "quote_he": "עריכת הסכם גירושים כאשר כבר קיימות הסכמות מהותיות | 15,000-20,000 ₪ + מע\"מ",
   "read_on": "2026-10-31",
   "what_he": "עריכת הסכם גירושין כשיש הסכמות מהותיות"
  },
  {
   "name_he": "עו\"ד אמיר כהן",
   "url": "https://advfamily.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2026/",
   "low": 4000,
   "high": 15000,
   "vat": "none",
   "quote_he": "העלות נעה בין 4,000 ל-15,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "עריכת הסכם גירושין"
  },
  {
   "name_he": "משרד עו\"ד מורן גוהר",
   "url": "https://www.gohar-law.com/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%97%D7%99%D7%A8",
   "low": 6000,
   "high": 15000,
   "vat": "none",
   "quote_he": "עריכת הסכם גירושין פשוט בהסכמה | 6,000–15,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "עריכת הסכם גירושין פשוט בהסכמה"
  },
  {
   "name_he": "כמהעולה.co.il (פורטל, לא משרד)",
   "url": "https://xn--8dbacwhj3a.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F/",
   "low": 8000,
   "high": 20000,
   "vat": "none",
   "quote_he": "8,000–20,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "הסכם גירושין מלא"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Price/23699",
   "low": 7000,
   "high": 15000,
   "vat": "none",
   "quote_he": "נע בדרך כלל בין 7,000 ל- 15,000 ש\"ח.",
   "read_on": "2026-10-31",
   "what_he": "עריכת הסכם גירושין בהסכמה"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Price/23369",
   "low": 7000,
   "high": 15000,
   "vat": "plus",
   "quote_he": "עלות הכנת הסכם גירושין נעה לרוב בין 7,000 ל-15,000 ש\"ח פלוס מע\"מ",
   "read_on": "2026-10-31",
   "what_he": "ניסוח הסכם גירושין (נפרד משעות הגישור)"
  },
  {
   "name_he": "כמהזה (פורטל, לא משרד)",
   "url": "https://www.kamaze.co.il/Reviews/15195/Com/divorce-cost",
   "low": 10000,
   "high": 20000,
   "vat": "none",
   "quote_he": "יכול לנוע בין 10,000 ל 20,000 ש\"ח",
   "read_on": "2026-10-31",
   "what_he": "גירושין פשוטים בהסכמה, מחיר קבוע"
  }
 ],
 "lawyer_claim": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 10000,
   "high": 20000,
   "vat": "none",
   "quote_he": "משרד מוביל: 10,000–20,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "תביעת משמורת (משרד מוביל)"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 8000,
   "high": 15000,
   "vat": "none",
   "quote_he": "משרד מוביל: 8,000–15,000 ₪, תלוי מספר דיונים מורכבים.",
   "read_on": "2026-10-31",
   "what_he": "תביעת מזונות (משרד מוביל)"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 15000,
   "high": 35000,
   "vat": "none",
   "quote_he": "משרד מוביל: 15,000–35,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "תביעת רכוש (משרד מוביל)"
  },
  {
   "name_he": "משרד עו\"ד חגית לב",
   "url": "https://www.adv-office.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A/",
   "low": 50000,
   "high": 150000,
   "vat": "plus",
   "quote_he": "תביעת רכוש | 50,000-150,000 ₪ + מע\"מ",
   "read_on": "2026-10-31",
   "what_he": "תביעת רכוש"
  },
  {
   "name_he": "משרד עו\"ד חגית לב",
   "url": "https://www.adv-office.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A/",
   "low": 40000,
   "high": 80000,
   "vat": "plus",
   "quote_he": "תביעת מזונות | 40,000-80,000 ₪ + מע\"מ",
   "read_on": "2026-10-31",
   "what_he": "תביעת מזונות"
  },
  {
   "name_he": "משרד עו\"ד חגית לב",
   "url": "https://www.adv-office.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A/",
   "low": 40000,
   "high": 80000,
   "vat": "plus",
   "quote_he": "תביעה בענייני ילדים וזמני שהות | 40,000-80,000 ₪ + מע\"מ",
   "read_on": "2026-10-31",
   "what_he": "תביעה בענייני ילדים וזמני שהות"
  },
  {
   "name_he": "משרד עו\"ד מורן גוהר",
   "url": "https://www.gohar-law.com/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%97%D7%99%D7%A8",
   "low": 7000,
   "high": 20000,
   "vat": "none",
   "quote_he": "הכנת תביעה או כתב הגנה בנושא מסוים | 7,000–20,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "הכנת תביעה או כתב הגנה בנושא אחד"
  },
  {
   "name_he": "כמהעולה.co.il (פורטל, לא משרד)",
   "url": "https://xn--8dbacwhj3a.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F/",
   "low": 8000,
   "high": 35000,
   "vat": "none",
   "quote_he": "8,000–35,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "ניהול תביעה אחת (רכוש, מזונות או ילדים)"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Price/23699",
   "low": 5000,
   "high": 10000,
   "vat": "none",
   "quote_he": "המחיר של תביעת מזונות נע בדרך כלל בין 5,000 ל-10,000 ש\"ח.",
   "read_on": "2026-10-31",
   "what_he": "תביעת מזונות"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Tip/14207",
   "low": 10000,
   "high": 15000,
   "vat": "none",
   "quote_he": "טווח המחירים עבור כל נושא נע בין 10,000-15,000 ש\"ח",
   "read_on": "2026-10-31",
   "what_he": "טיפול בנושא אחד (רכוש/מזונות/משמורת)"
  }
 ],
 "lawyer_contested": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/2025-divorce-attorney-prices",
   "low": 30000,
   "high": 150000,
   "vat": "none",
   "quote_he": "עלול להגיע ל-30,000–150,000 ש\"ח, ואף יותר במקרים חריגים",
   "read_on": "2026-10-31",
   "what_he": "ניהול הליך משפטי מלא (גירושין במחלוקת)"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 20000,
   "high": 50000,
   "vat": "none",
   "quote_he": "20,000–50,000 ₪ כשכר טרחה גלובלי, לא כולל הוצאות נלוות",
   "read_on": "2026-10-31",
   "what_he": "הליך במחלוקת, שכר טרחה גלובלי (משרד מוביל)"
  },
  {
   "name_he": "משרד עו\"ד אייל סייג",
   "url": "https://www.sayag-law.co.il/price-divorce-lawyer/",
   "low": 15000,
   "high": 50000,
   "vat": "none",
   "quote_he": "גירושין ללא הסכמה | ₪50,000 – ₪15,000",
   "read_on": "2026-10-31",
   "what_he": "גירושין ללא הסכמה"
  },
  {
   "name_he": "משרד עו\"ד אייל סייג",
   "url": "https://www.sayag-law.co.il/price-divorce-lawyer/",
   "low": 30000,
   "high": 150000,
   "vat": "none",
   "quote_he": "ניהול תיק מורכב (רכוש, משמורת) | ₪150,000 – ₪30,000",
   "read_on": "2026-10-31",
   "what_he": "ניהול תיק מורכב (רכוש, משמורת)"
  },
  {
   "name_he": "עו\"ד עופר סטרוסקי",
   "url": "https://www.stroosky-law.co.il/lawyerprice",
   "low": 30000,
   "high": 150000,
   "vat": "plus",
   "quote_he": "שבין 30,000 + מע\"מ ועד 150,000 ש\"ח",
   "read_on": "2026-10-31",
   "what_he": "ניהול תביעות גירושין, סכום גלובלי"
  },
  {
   "name_he": "משרד עו\"ד חגית לב",
   "url": "https://www.adv-office.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A/",
   "low": 90000,
   "high": 250000,
   "vat": "plus",
   "quote_he": "ייצוג מלא בתיק גירושים מורכב | 90,000-250,000 ₪ + מע\"מ",
   "read_on": "2026-10-31",
   "what_he": "ייצוג מלא בתיק גירושין מורכב"
  },
  {
   "name_he": "עו\"ד אמיר כהן",
   "url": "https://advfamily.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2026/",
   "low": 30000,
   "high": 150000,
   "vat": "none",
   "quote_he": "30,000 – 150,000+ ₪",
   "read_on": "2026-10-31",
   "what_he": "גירושין במחלוקת, הליך מלא"
  },
  {
   "name_he": "משרד עו\"ד מורן גוהר",
   "url": "https://www.gohar-law.com/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%97%D7%99%D7%A8",
   "low": 30000,
   "high": 80000,
   "vat": "none",
   "quote_he": "ניהול תיק גירושין הכולל מספר הליכים | 30,000–80,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "ניהול תיק גירושין עם כמה הליכים"
  },
  {
   "name_he": "כמהעולה.co.il (פורטל, לא משרד)",
   "url": "https://xn--8dbacwhj3a.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F/",
   "low": 25000,
   "high": 130000,
   "vat": "none",
   "quote_he": "25,000–130,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "ניהול הליך גירושין משפטי מלא"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Price/23699",
   "low": 10000,
   "high": 25000,
   "vat": "none",
   "quote_he": "ולנוע בין 10,000 ל-25,000 ש\"ח.",
   "read_on": "2026-10-31",
   "what_he": "גירושין במחלוקת"
  }
 ],
 "lawyer_hearing": [
  {
   "name_he": "משרד עו\"ד חגית לב",
   "url": "https://www.adv-office.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A/",
   "low": 2500,
   "high": 2500,
   "vat": "plus",
   "quote_he": "דיון נוסף שאינו דיון הוכחות | 2,500 ₪ + מע\"מ",
   "read_on": "2026-10-31",
   "what_he": "דיון נוסף שאינו דיון הוכחות"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Tip/14207",
   "low": 1000,
   "high": 3000,
   "vat": "none",
   "quote_he": "עלות הוספת דיון תנוע בדרך כלל בין 1,000 -3,000 ש\"ח",
   "read_on": "2026-10-31",
   "what_he": "הוספת דיון"
  }
 ],
 "lawyer_hour": [
  {
   "name_he": "משרד עו\"ד אייל סייג",
   "url": "https://www.sayag-law.co.il/price-divorce-lawyer/",
   "low": 400,
   "high": 1500,
   "vat": "none",
   "quote_he": "ייעוץ שעתי | ₪1,500 – ₪400",
   "read_on": "2026-10-31",
   "what_he": "ייעוץ שעתי"
  },
  {
   "name_he": "כמהזה (פורטל, לא משרד)",
   "url": "https://www.kamaze.co.il/Reviews/15195/Com/divorce-cost",
   "low": 800,
   "high": 1500,
   "vat": "none",
   "quote_he": "עורכי דין בישראל גובים בדרך כלל בין 800 ל-1,500 ש\"ח לשעה",
   "read_on": "2026-10-31",
   "what_he": "שכר עו\"ד לשעה"
  }
 ],
 "mediation_hour": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/2025-divorce-attorney-prices",
   "low": 700,
   "high": 2000,
   "vat": "none",
   "quote_he": "לרוב בין 700–2,000 ש\"ח לשעה",
   "read_on": "2026-10-31",
   "what_he": "גישור גירושין, שעת גישור"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 500,
   "high": 1000,
   "vat": "none",
   "quote_he": "משרד מוביל כמגשר: 500–1,000 ₪ לשעת גישור.",
   "read_on": "2026-10-31",
   "what_he": "גישור, שעת גישור (משרד מוביל כמגשר)"
  },
  {
   "name_he": "עו\"ד אמיר כהן",
   "url": "https://advfamily.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2026/",
   "low": 600,
   "high": 750,
   "vat": "plus",
   "quote_he": "הליך הגישור עולה 600–750 ₪ לשעה מכל צד (בתוספת מע\"מ)",
   "read_on": "2026-10-31",
   "factor": 2,
   "what_he": "גישור, שעת גישור"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Price/23369",
   "low": 1200,
   "high": 2000,
   "vat": "plus",
   "quote_he": "שעת ייעוץ עם עורך דין המוסמך גם כמגשר עולה בין 1,200 ל-2,000 שקלים",
   "read_on": "2026-10-31",
   "what_he": "שעה עם עו\"ד מגשר"
  },
  {
   "name_he": "JDN (תוכן שיווקי)",
   "url": "https://www.jdn.co.il/consumer/2539058/",
   "low": 600,
   "high": 750,
   "vat": "none",
   "quote_he": "התעריף הממוצע לשעת גישור נע בין 600 ל-750 שקלים לשני בני הזוג",
   "read_on": "2026-10-31",
   "what_he": "שעת גישור (ממוצע)"
  },
  {
   "name_he": "JDN (תוכן שיווקי)",
   "url": "https://www.jdn.co.il/consumer/2539058/",
   "low": 900,
   "high": 1250,
   "vat": "none",
   "quote_he": "מגשרים בכירים עשויים לגבות בין 900 ל-1,250 שקלים לשעה",
   "read_on": "2026-10-31",
   "what_he": "שעת גישור, מגשר בכיר"
  }
 ],
 "mediation_process": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 5000,
   "high": 10000,
   "vat": "none",
   "quote_he": "5,000–10,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "גישור, מחיר קבוע לכמה פגישות"
  },
  {
   "name_he": "משרד עו\"ד אייל סייג",
   "url": "https://www.sayag-law.co.il/price-divorce-lawyer/",
   "low": 3000,
   "high": 8000,
   "vat": "none",
   "quote_he": "גישור גירושין | ₪8,000 – ₪3,000",
   "read_on": "2026-10-31",
   "what_he": "גישור גירושין"
  },
  {
   "name_he": "עו\"ד אמיר כהן",
   "url": "https://advfamily.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2026/",
   "low": 5000,
   "high": 12000,
   "vat": "none",
   "quote_he": "5,000 ל-12,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "גישור, עלות כוללת"
  },
  {
   "name_he": "משרד עו\"ד מורן גוהר",
   "url": "https://www.gohar-law.com/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%97%D7%99%D7%A8",
   "low": 8000,
   "high": 25000,
   "vat": "none",
   "quote_he": "הליך גישור גירושין | 8,000–25,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "הליך גישור גירושין"
  },
  {
   "name_he": "JDN (תוכן שיווקי)",
   "url": "https://www.jdn.co.il/consumer/2539058/",
   "low": 4000,
   "high": 12000,
   "vat": "none",
   "quote_he": "העלות שלו נעה בין 4,000 ל-12,000 שקלים",
   "read_on": "2026-10-31",
   "what_he": "הליך גישור טיפוסי, עלות כוללת"
  }
 ],
 "lawyer_mediation": [
  {
   "name_he": "כמהעולה.co.il (פורטל, לא משרד)",
   "url": "https://xn--8dbacwhj3a.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F/",
   "low": 6000,
   "high": 15000,
   "vat": "none",
   "quote_he": "6,000–15,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "ליווי משפטי בתהליך גישור (בלי שכר המגשר)"
  }
 ],
 "appraiser": [
  {
   "name_he": "מידרג (טיפ: שמאי מקרקעין חוות דעת לבית משפט)",
   "url": "https://www.midrag.co.il/Content/Tip/20646",
   "low": 4000,
   "high": 6000,
   "vat": "none",
   "quote_he": "יחד עם חוות הדעת לבית המשפט של אותה דירה, ינוע בין 4,000-6,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "שמאי מקרקעין - הערכת שווי דירה כולל חוות דעת לבית משפט (דוגמה)"
  },
  {
   "name_he": "מידרג (מחירון שמאי מקרקעין)",
   "url": "https://www.midrag.co.il/Content/Price/8151",
   "low": 4000,
   "high": 4500,
   "vat": "none",
   "quote_he": "עבור חוות דעת מקצועית לבית משפט של אותו נכס בדיוק תשלמו 4,000-4,500 ₪",
   "read_on": "2026-10-31",
   "what_he": "שמאי מקרקעין - חוות דעת לבית משפט (דוגמה)"
  },
  {
   "name_he": "דפי זהב (מחירון שמאות, חיפה)",
   "url": "https://www.d.co.il/priceList-49080/",
   "low": 2376,
   "high": 5400,
   "vat": "none",
   "quote_he": "הערכת שווי דירה למטרת פירוק שיתוף במקרקעין - כולל הגשה לבית משפט",
   "read_on": "2026-10-31",
   "what_he": "שמאי מקרקעין - הערכת דירה לפירוק שיתוף כולל הגשה לבית משפט"
  }
 ],
 "actuary": [
  {
   "name_he": "רו\"ח אהוד שושן",
   "url": "https://eshoshan.co.il/actuary-cost-divorce/",
   "low": 5000,
   "high": 8000,
   "vat": "plus",
   "quote_he": "5,000 עד 8,000 ש”ח בתוספת מע”מ לשני הצדדים",
   "read_on": "2026-10-31",
   "what_he": "אקטואר - חוות דעת לאיזון חיסכון פנסיוני בגירושין"
  },
  {
   "name_he": "קרט משרד עורכי דין",
   "url": "https://karat-law.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%90%D7%A7%D7%98%D7%95%D7%90%D7%A8-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F/",
   "low": 5000,
   "high": 8000,
   "vat": "none",
   "quote_he": "עלות ממוצעת: 5,000-8,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "אקטואר גירושין - חוות דעת בסיסית"
  },
  {
   "name_he": "קרט משרד עורכי דין",
   "url": "https://karat-law.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%90%D7%A7%D7%98%D7%95%D7%90%D7%A8-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F/",
   "low": 8000,
   "high": 18000,
   "vat": "none",
   "quote_he": "עלות ממוצעת: 8,000-18,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "אקטואר גירושין - חוות דעת מורכבת"
  },
  {
   "name_he": "קרט משרד עורכי דין",
   "url": "https://karat-law.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%90%D7%A7%D7%98%D7%95%D7%90%D7%A8-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F/",
   "low": 15000,
   "high": 25000,
   "vat": "none",
   "quote_he": "עלות ממוצעת: 15,000-25,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "אקטואר גירושין - חוות דעת מקיפה"
  },
  {
   "name_he": "expertv",
   "url": "https://www.expertv.co.il/divorce-actuary-price/",
   "low": 3000,
   "high": 6000,
   "vat": "none",
   "quote_he": "חוות דעת אקטוארית בסיסית נע בין 3,000 ל-6,000 ש\"ח",
   "read_on": "2026-10-31",
   "what_he": "אקטואר גירושין - חוות דעת בסיסית"
  },
  {
   "name_he": "עו\"ד אמיר כהן (advfamily)",
   "url": "https://advfamily.co.il/articles/%D7%90%D7%A7%D7%98%D7%95%D7%90%D7%A8-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F",
   "low": 4200,
   "high": 4200,
   "vat": "none",
   "quote_he": "עלות חוות הדעת: 4,200 ₪ בלבד",
   "read_on": "2026-10-31",
   "what_he": "אקטואר גירושין - דוגמת תיק"
  }
 ],
 "business_valuation": [
  {
   "name_he": "קבוצת הורייזן תאגידים",
   "url": "https://horizon.org.il/blog/company-valuation-3-methods-guide/",
   "low": 15000,
   "high": 25000,
   "vat": "none",
   "quote_he": "בעסק קטן עם דוחות מסודרים בענף סטנדרטי, עולה בערך 15 עד 25 אלף שקלים",
   "read_on": "2026-10-31",
   "what_he": "הערכת שווי עסק קטן"
  },
  {
   "name_he": "קבוצת הורייזן תאגידים",
   "url": "https://horizon.org.il/blog/company-valuation-3-methods-guide/",
   "low": 30000,
   "high": 50000,
   "vat": "none",
   "quote_he": "עולה בערך 30 עד 50 אלף שקלים",
   "read_on": "2026-10-31",
   "what_he": "הערכת שווי עסק בינוני"
  },
  {
   "name_he": "קבוצת הורייזן תאגידים",
   "url": "https://horizon.org.il/blog/company-valuation-3-methods-guide/",
   "low": 60000,
   "high": 150000,
   "vat": "none",
   "quote_he": "עולה בערך 60 עד 150 אלף שקלים",
   "read_on": "2026-10-31",
   "what_he": "הערכת שווי מורכבת (כולל לבית משפט)"
  }
 ],
 "court_expert": [
  {
   "name_he": "מכון סול לפסיכותרפיה",
   "url": "https://www.soulpsy.co.il/diagnoses/parenting-evaluation/",
   "low": 15000,
   "high": 40000,
   "vat": "none",
   "quote_he": "נעות בין 15,000 ל-40,000 שקלים",
   "read_on": "2026-10-31",
   "what_he": "הערכת מסוגלות הורית פרטית (מכון)"
  },
  {
   "name_he": "עו\"ד ומגשר כרמי רונן",
   "url": "https://www.carmironen-law.co.il/%D7%9E%D7%94%D7%99-%D7%9E%D7%A1%D7%95%D7%92%D7%9C%D7%95%D7%AA-%D7%94%D7%95%D7%A8%D7%99%D7%AA",
   "low": 8000,
   "high": 15000,
   "vat": "none",
   "quote_he": "הורה אחד וילד אחד יכולה לעלות בין 8,000 ל-15,000 ש\"ח",
   "read_on": "2026-10-31",
   "what_he": "הערכת מסוגלות הורית - בסיסית (הורה וילד)"
  },
  {
   "name_he": "עו\"ד ומגשר כרמי רונן",
   "url": "https://www.carmironen-law.co.il/%D7%9E%D7%94%D7%99-%D7%9E%D7%A1%D7%95%D7%92%D7%9C%D7%95%D7%AA-%D7%94%D7%95%D7%A8%D7%99%D7%AA",
   "low": 0,
   "high": 30000,
   "vat": "none",
   "quote_he": "המחיר עשוי להגיע ל-30,000 ש\"ח ואף יותר",
   "read_on": "2026-10-31",
   "what_he": "הערכת מסוגלות הורית - מורכבת"
  }
 ],
 "coordinator_hour": [
  {
   "name_he": "דבי סיידה ושות' (המגשרת עו\"ד זהבית דבי)",
   "url": "https://hamegasheret.co.il/post-divorce-mediation",
   "low": 600,
   "high": 750,
   "vat": "plus",
   "quote_he": "600-750 ₪ פלוס מע\"מ לשעה מכל צד",
   "read_on": "2026-10-31",
   "factor": 2,
   "what_he": "תיאום הורי (מתאם הורי) - שעה"
  },
  {
   "name_he": "תקדין - מאמר עו\"ד ליטל יעקובוביץ דראי",
   "url": "https://portal.takdin.co.il/Article/Article/4187366",
   "low": 300,
   "high": 500,
   "vat": "none",
   "quote_he": "העלויות נעות לרוב סביב 300-500 שקל לשעה",
   "read_on": "2026-10-31",
   "what_he": "תיאום הורי (מתאם הורי) - שעה"
  }
 ],
 "lawyer_appeal": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 15000,
   "high": 40000,
   "vat": "none",
   "quote_he": "משרד מוביל: 15,000–40,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "ערעור על פסק דין בענייני משפחה - משרד מוביל"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 8000,
   "high": 20000,
   "vat": "none",
   "quote_he": "עו\"ד פחות מנוסה: 8,000–20,000 ₪",
   "read_on": "2026-10-31",
   "what_he": "ערעור על פסק דין בענייני משפחה - עו\"ד פחות מנוסה"
  }
 ],
 "lawyer_execution": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 5000,
   "high": 12000,
   "vat": "none",
   "quote_he": "5,000–12,000 ₪ בריטיינר או אחוז מסוים מהגבייה (10%–20%)",
   "read_on": "2026-10-31",
   "what_he": "גביית מזונות בהוצאה לפועל - משרד מוביל"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג",
   "url": "https://rotenberglaw.co.il/family-lawyer-price-list",
   "low": 3000,
   "high": 7000,
   "vat": "none",
   "quote_he": "עו\"ד פחות מנוסה: 3,000–7,000 ₪ או אחוז גבייה קטן יותר",
   "read_on": "2026-10-31",
   "what_he": "גביית מזונות בהוצאה לפועל - עו\"ד פחות מנוסה"
  }
 ],
 "divorce_consent_total": [
  {
   "name_he": "עו\"ד אביטל חורף",
   "url": "https://lawdin.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%94%D7%A1%D7%9B%D7%9E%D7%94/",
   "low": 7000,
   "high": 18000,
   "vat": "none",
   "what_he": "עלות כוללת, גירושין בהסכמה (כולל אגרות)",
   "quote_he": "העלות הכוללת של גירושין בהסכמה ללא מחלוקת בישראל נעה בין ₪7,000-18,000",
   "read_on": "2026-10-31"
  },
  {
   "name_he": "עו\"ד אמיר כהן",
   "url": "https://advfamily.co.il/%D7%A2%D7%9C%D7%95%D7%AA-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2026/",
   "low": 7000,
   "high": 18000,
   "vat": "none",
   "what_he": "גירושין בהסכמה, עלות כוללת",
   "quote_he": "7,000 – 18,000 ₪",
   "read_on": "2026-10-31"
  },
  {
   "name_he": "משרד עו\"ד אייל סייג",
   "url": "https://www.sayag-law.co.il/price-divorce-lawyer/",
   "low": 7000,
   "high": 18000,
   "vat": "none",
   "what_he": "גירושין בהסכמה, ליווי מלא",
   "quote_he": "גירושין בהסכמה (ליווי מלא) | ₪18,000 – ₪7,000",
   "read_on": "2026-10-31"
  }
 ],
 "lawyer_prenup": [
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Price/10212",
   "low": 3500,
   "high": 8000,
   "vat": "plus",
   "what_he": "עריכת הסכם ממון",
   "quote_he": "אשר נע בין 3,500-8,000 ₪ ללא מע\"מ",
   "read_on": "2026-10-31"
  },
  {
   "name_he": "מידרג (פורטל, לא משרד)",
   "url": "https://www.midrag.co.il/Content/Price/10212",
   "low": 8000,
   "high": 10000,
   "vat": "none",
   "what_he": "הסכם ממון מורכב",
   "quote_he": "יש עורכי דין שיגבו גם 8,000-10,000 ₪",
   "read_on": "2026-10-31"
  }
 ],
 "pleader": [
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג (27.1.2025)",
   "url": "https://rotenberglaw.co.il/divorce-lawyer-srevices-price",
   "low": 12000,
   "high": 30000,
   "vat": "none",
   "what_he": "טוען רבני – ייצוג בבית הדין (משרד מוביל)",
   "quote_he": "משרד מוביל (טוען רבני ידוע): 12,000-30,000 ₪",
   "read_on": "2026-10-31"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג (27.1.2025)",
   "url": "https://rotenberglaw.co.il/divorce-lawyer-srevices-price",
   "low": 6000,
   "high": 15000,
   "vat": "none",
   "what_he": "טוען רבני – ייצוג בבית הדין (טוען צעיר)",
   "quote_he": "טוען רבני \"צעיר\": 6,000-15,000 ₪",
   "read_on": "2026-10-31"
  },
  {
   "name_he": "ספץ (עודכן 19.10.2025)",
   "url": "https://service.spetz.co.il/service/%D7%A2%D7%9C%D7%95%D7%AA-%D7%98%D7%95%D7%A2%D7%9F-%D7%A8%D7%91%D7%A0%D7%99/",
   "low": 12000,
   "high": 40000,
   "vat": "none",
   "what_he": "טוען רבני – ליווי תיק מלא",
   "quote_he": "ליווי תיק מלא 12,000–40,000 ₪",
   "read_on": "2026-10-31"
  }
 ],
 "pleader_agreement": [
  {
   "name_he": "ספץ (עודכן 19.10.2025)",
   "url": "https://service.spetz.co.il/service/%D7%A2%D7%9C%D7%95%D7%AA-%D7%98%D7%95%D7%A2%D7%9F-%D7%A8%D7%91%D7%A0%D7%99/",
   "low": 4000,
   "high": 12000,
   "vat": "none",
   "what_he": "טוען רבני – הסכם גירושין/ממון",
   "quote_he": "הסכם גירושין/ממון 4,000–12,000 ₪",
   "read_on": "2026-10-31"
  }
 ],
 "collaborative": [
  {
   "name_he": "מוסכם – גישור גירושין (muskam.co.il)",
   "url": "https://muskam.co.il/costs/%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%9C%D7%94%D7%AA%D7%92%D7%A8%D7%A9-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C/",
   "low": 20000,
   "high": 30000,
   "vat": "none",
   "what_he": "גירושין בשיתוף פעולה",
   "quote_he": "עלות הליך של גירושין בשיתוף פעולה נע בין 20,000 ל-30,000 ₪ לכל צד.",
   "read_on": "2026-10-31"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג (27.1.2025)",
   "url": "https://rotenberglaw.co.il/divorce-lawyer-srevices-price",
   "low": 8000,
   "high": 20000,
   "vat": "none",
   "what_he": "גירושין בשיתוף פעולה (Collaborative Divorce) – משרד מוביל",
   "quote_he": "8,000-20,000 ₪ מכל צד",
   "read_on": "2026-10-31"
  },
  {
   "name_he": "משרד עו\"ד מאיה רוטנברג (27.1.2025)",
   "url": "https://rotenberglaw.co.il/divorce-lawyer-srevices-price",
   "low": 15000,
   "high": 30000,
   "vat": "none",
   "what_he": "גירושין בשיתוף פעולה עם אנשי מקצוע – משרד מוביל",
   "quote_he": "15,000-30,000 ₪ לכל צד",
   "read_on": "2026-10-31"
  }
 ]
}

DURATIONS = {
 "agree": {
  "he": "גירושין בהסכמה",
  "sources": [
   {
    "name_he": "המכון הישראלי לדמוקרטיה, דו-שנתון דת ומדינה 2024 (נתוני הנהלת בתי הדין הרבניים)",
    "url": "https://www.idi.org.il/religion-and-state/2024/?chapter=58137",
    "low": 2,
    "high": 2,
    "what_he": "גירושין בהסכמה בבית הדין הרבני – ממוצע מפתיחה עד סגירת התיק (2023)",
    "quote_he": "ומאז ירד בהדרגה עד תקופה של כחודשיים (58 ימים) בשנת 2023.",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": True
   },
   {
    "name_he": "המכון הישראלי לדמוקרטיה, דו-שנתון דת ומדינה 2024",
    "url": "https://www.idi.org.il/religion-and-state/2024/?chapter=58137",
    "low": 3,
    "high": 3,
    "what_he": "גירושין בהסכמה בבית הדין הרבני – ממוצע 2010–2018",
    "quote_he": "בשנים 2018-2010 הוא עמד בממוצע על כשלושה חודשים",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": True
   },
   {
    "name_he": "מידרג – תשובות עורכי דין לשאלה",
    "url": "https://www.midrag.co.il/Expanel/Question/2389",
    "low": 0.5,
    "high": 3,
    "what_he": "גירושין בהסכמה – הערכות עורכי דין (פאנל מידרג)",
    "quote_he": "בכל מקרה ההליך / ההליכים נמשכים עד 3 חודשים.",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": False
   },
   {
    "name_he": "עו\"ד רון מיור",
    "url": "https://majorlaw.co.il/%D7%9B%D7%9E%D7%94-%D7%96%D7%9E%D7%9F-%D7%9C%D7%95%D7%A7%D7%97-%D7%94%D7%9C%D7%99%D7%9A-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C",
    "low": 1,
    "high": 3,
    "what_he": "גירושין בהסכמה – משך",
    "quote_he": "יכולים להסתיים תוך חודש עד שלושה חודשים",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": False
   },
   {
    "name_he": "משרד עו\"ד אביטל חורף (lawdin.co.il, 2026)",
    "url": "https://lawdin.co.il/%D7%9B%D7%9E%D7%94-%D7%96%D7%9E%D7%9F-%D7%9C%D7%95%D7%A7%D7%97%D7%99%D7%9D-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9D/",
    "low": 3,
    "high": 6,
    "what_he": "גירושין בהסכמה – משך",
    "quote_he": "גירושים אלה יכולים להסתיים תוך 3-6 חודשים",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": False
   }
  ]
 },
 "mediate": {
  "he": "גישור גירושין",
  "sources": []
 },
 "compromise": {
  "he": "פשרה באמצע הדרך",
  "sources": []
 },
 "contested": {
  "he": "גירושין במחלוקת מלאה",
  "sources": [
   {
    "name_he": "המכון הישראלי לדמוקרטיה, דו-שנתון דת ומדינה 2024",
    "url": "https://www.idi.org.il/religion-and-state/2024/?chapter=58137",
    "low": 8.5,
    "high": 8.5,
    "what_he": "גירושין במחלוקת בבית הדין הרבני – מהגשת תביעה עד פסק דין לגט",
    "quote_he": "הזמן הממוצע מהגשת התביעה ועד מתן פסק הדין הוא 259 ימים",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": True
   },
   {
    "name_he": "המכון הישראלי לדמוקרטיה, דו-שנתון דת ומדינה 2024",
    "url": "https://www.idi.org.il/religion-and-state/2024/?chapter=58137",
    "low": 12,
    "high": 12,
    "what_he": "גירושין במחלוקת בבית הדין הרבני – עד מתן הגט (ללא סנקציות)",
    "quote_he": "כלומר כשנה בסך הכול",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": True
   },
   {
    "name_he": "עו\"ד רון מיור",
    "url": "https://majorlaw.co.il/%D7%9B%D7%9E%D7%94-%D7%96%D7%9E%D7%9F-%D7%9C%D7%95%D7%A7%D7%97-%D7%94%D7%9C%D7%99%D7%9A-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C",
    "low": 12,
    "high": 24,
    "what_he": "גירושין במחלוקת – משך",
    "quote_he": "הליך עם מחלוקות נמשך לרוב בין שנה לשנתיים, ולעיתים יותר.",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": False
   },
   {
    "name_he": "עו\"ד אלי קשתי (8.6.2026)",
    "url": "https://kashtylaw.com/blog/kama-zman-grushin",
    "low": 12,
    "high": 36,
    "what_he": "גירושין בסכסוך מלא – משך",
    "quote_he": "הליך בסכסוך מלא יכול להימשך שנה עד שלוש שנים, ולעתים אף יותר.",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": False
   },
   {
    "name_he": "משרד עו\"ד אביטל חורף (lawdin.co.il, 2026)",
    "url": "https://lawdin.co.il/%D7%9B%D7%9E%D7%94-%D7%96%D7%9E%D7%9F-%D7%9C%D7%95%D7%A7%D7%97%D7%99%D7%9D-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9D/",
    "low": 12,
    "high": 18,
    "what_he": "גירושין במחלוקת – משך ממוצע",
    "quote_he": "גורם להם לארוך 12-18 חודשים בממוצע",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": False
   }
  ]
 },
 "refusal": {
  "he": "סרבנות גט: עד הסנקציה הראשונה של בית הדין",
  "sources": [
   {
    "name_he": "המכון הישראלי לדמוקרטיה, דו-שנתון דת ומדינה 2024",
    "url": "https://www.idi.org.il/religion-and-state/2024/?chapter=58137",
    "low": 24.6,
    "high": 24.6,
    "what_he": "סירוב גט – עד הסנקציה הראשונה (צו הגבלה)",
    "quote_he": "הסנקציה הראשונה בתיק ניתנה בממוצע 749 ימים",
    "read_on": "2026-10-31",
    "status": "verified",
    "link": True
   }
  ]
 }
}

# How the calculator and the price list compute (the "איך חישבנו" list, printed on the page and in the print summary).
METHOD_HE = [
    "אגרות: הסכום שבתקנות האגרות בנוסח העדכני, לפי המסלול והערכאה שבחרתם. על אגרה אין מע\"מ.",
    "שכר טרחה ומומחים: אין להם מחירון רשמי. לכל שירות אספנו את המחירים שמשרדים, מגשרים ומומחים מפרסמים, וקראנו כל מקור ב-31.10.2026. \"נמוך\" הוא הנמוך שבמחירים שפורסמו, \"גבוה\" הוא הגבוה שבהם, ו\"צפוי\" הוא החציון של אמצעי הטווחים, כך שמשרד אחד יקר או זול לא מזיז אותו.",
    "מחיר שפורסם כולל מע\"מ הוחזר למחיר לפני מע\"מ. מחיר שהמקור לא ציין אם הוא כולל מע\"מ נחשב כמחיר לפני מע\"מ, כדי שהחישוב לא יקטין את העלות. על שכר טרחה ועל מומחים נוסף מע\"מ של 18%.",
    "מחיר שפורסם לשעה מכל צד הוכפל, כדי להשוות אותו למחיר לשעה לשני בני הזוג.",
    "החלוקה בין הצדדים: כל צד משלם לעורך הדין שלו ואת תעודת הגירושין שלו; מי שפותח הליך משלם את אגרות התביעות; המגשר, מומחה מוסכם, מומחה בית המשפט, המתאם ההורי ואגרת אישור ההסכם מתחלקים לפי מה שבחרתם, וברירת המחדל היא חצי-חצי.",
    "במחלוקת כל צד מביא שמאי, אקטואר או מעריך שווי משלו, אלא אם סימנתם מומחה מוסכם אחד. בפשרה באמצע הדרך שכר הטרחה מחושב לפי המחיר של תביעה אחת לכל נושא שנפתח, ולא יותר מהמחיר של הליך מלא במחלוקת.",
    "בגישור כל צד בודק את ההסכם בפגישת ייעוץ אצל עורך דין משלו. עורך דין אחד לשניכם מחושב כעורך דין אחד שמנסח, ועוד פגישת ייעוץ לצד השני אצל עורך דין אחר.",
    "סיוע משפטי: שכר עורך הדין של צד א מוחלף באגרת ההשתתפות שבתקנות; את עורך הדין משלם הסיוע המשפטי.",
    "הצעת מחיר שהזנתם מחליפה את הטווח שמתפרסם, לצד א בלבד.",
    "זמן: הימים שהחוק קובע בהליך שמתחיל בבקשה ליישוב סכסוך, וחודשים לפי מה שמתפרסם. להליך במחלוקת החוק לא קובע משך.",
    "מה יוזיל: המחשבון מחשב מחדש את אותו תרחיש עם שינוי אחד בכל פעם, ומציג רק שינויים שחוסכים כסף, מהגדול לקטן.",
]

TEXTS = {
    "one_lawyer_he": "עורך דין אחד יכול לנסח לשניכם הסכם בהסכמה, אבל הוא לא יכול לייצג את האינטרס של כל אחד מכם מול השני. לכן המחשבון מוסיף פגישת ייעוץ לצד השני אצל עורך דין אחר.",
    "complexity_he": "בהסכמה ובגישור המחיר הוא להסכם אחד שסוגר את כל הנושאים. ככל שיש יותר נושאים פתוחים (ילדים, דירה, פנסיה, עסק), המחיר נוטה לקצה העליון של הטווח, לא מעליו.",
    "self_he": "בלי עורך דין משלמים רק אגרות. החוק לא מחייב ייצוג, והסיכון הוא הסכם שמשאיר פתוחים מזונות, פנסיה, דירה או הסדרי שהות.",
    "pleader_he": "טוען רבני רשאי לייצג בבית הדין הרבני בלבד: מי שאינו עורך דין לא ייצג שם אדם אחר אלא אם קיבל רישיון טוען רבני (תקנה 1 לתקנות הטוענים הרבניים); בבית המשפט לענייני משפחה מייצג רק עורך דין.",
    "pleader_family_he": "טוען רבני מופיע בבית הדין הרבני בלבד. בבית המשפט לענייני משפחה המחשבון מחשב עורך דין.",
    "quote_he": "הצעת המחיר שהזנתם החליפה את הטווח שמתפרסם, רק לצד א. לצד ב החישוב נשאר לפי המחירים שמשרדים מפרסמים.",
    "missing_he": "לחלק מהשירותים שבחרתם לא מצאנו מחיר מפורסם שאפשר לבדוק, ולכן הם לא נכנסו לסכום. במחירון הם מסומנים \"לא נבדק\".",
    "no_savings_he": "בבחירות האלה אין שינוי אחד שיוזיל עוד: זה כבר המסלול הזול.",
    "duration_unknown_he": "לא מצאנו לזה מקור שאפשר לבדוק",
    "duration_note_he": "הזמן בפועל תלוי בתור לדיונים בערכאה ובמה שנשאר פתוח ביניכם",
    "pricelist_lede_he": "כל שורה רשמית מגיעה מהתקנה ומהפרט שלה; כל שורת שוק מראה את המחירים שמתפרסמים, כמה מקורות יש לה ואם המחיר כולל מע\"מ. מחיר שלא מצאנו לו מקור שאפשר לבדוק מסומן \"לא נבדק\".",
    "pricelist_foot_he": "מחירי השוק הם טווחים שמשרדים מפרסמים, לא מחירון ולא הצעת מחיר של משרד כלשהו. משרדי עורכי דין שאינם עו\"ד מאיה רוטנברג מופיעים בשמם ובכתובת האתר, בלי קישור.",
}


def _sources(reg: dict) -> list:
    """The official texts behind the instrument and the price list, for the sources box."""
    d = reg["divorce_cost"]
    la = reg["malpractice_mechir"]["legal_aid"]
    return [
        {"name_he": d["rabbinical"]["regulation_he"], "url": d["rabbinical"]["url"], "text_he": "התוספת הראשונה (פרטים 3, 4, 7, 15 ו-19) והשנייה; נוסח עדכני ל-" + d["rabbinical"]["current_to"] + ". הפרטים הנוספים לפי " + reg["fl_rabanut"]["rab"]["admin_table"]["url"]},
        {"name_he": d["family"]["regulation_he"], "url": d["family"]["url"], "text_he": "התוספת הראשונה (פרטים 2א, 5, 6א, 6ב, 7 ו-13) והשנייה; נוסח עדכני ל-" + d["family"]["current_to"]},
        {"name_he": reg["fl_rabanut"]["appeal_court"]["regulation_he"], "url": reg["fl_rabanut"]["appeal_court"]["url"], "text_he": "פרטים 12א ו-16ב: ערעור ורשות ערעור על פסק דין של בית המשפט לענייני משפחה"},
        {"name_he": d["bar"]["rules_he"], "url": d["bar"]["url"], "text_he": "התוספת, פרט 8; " + d["bar"]["note_he"]},
        {"name_he": reg["prenup"]["routes"]["notary"]["fee_he"], "url": reg["prenup"]["routes"]["notary"]["fee_url"], "text_he": "פרט 11: אימות הסכם ממון והעתק; מחיר קבוע מ-" + reg["prenup"]["routes"]["notary"]["fee_from"]},
        {"name_he": la["regs_he"], "url": la["regs_url"], "text_he": la["participation_section"] + ": " + la["participation_he"]},
        {"name_he": la["table_he"], "url": la["table_url"], "text_he": la["means_he"]},
        {"name_he": d["disputes"]["law_he"], "url": d["disputes"]["url"], "text_he": "סעיפים 3 ו-4: הבקשה ליישוב סכסוך, פגישות המהו\"ת, עיכוב ההליכים והימים להגשת תביעה"},
        {"name_he": d["vat"]["he"], "url": d["vat"]["url"], "text_he": "מע\"מ " + str(d["vat"]["pct"]) + "% מ-" + d["vat"]["from"]},
    ]

# The market rows: id -> group, label, unit, note. Their sources are in MARKET_SOURCES (read 31.10.2026).
MARKET_ROWS = [
    {"id": "lawyer_consult", "group": "lawyers", "he": "פגישת ייעוץ עם עורך דין גירושין", "unit_he": "לפגישה של כשעה", "note_he": "יש משרדים שהשיחה הראשונה אצלם בלי תשלום, ויש שמקזזים אותה משכר הטרחה"},
    {"id": "lawyer_hour", "group": "lawyers", "he": "שכר עורך דין לשעה", "unit_he": "לשעה"},
    {"id": "lawyer_agreement", "group": "lawyers", "he": "עריכת הסכם גירושין בהסכמה", "unit_he": "לעורך הדין שמנסח"},
    {"id": "divorce_consent_total", "group": "lawyers", "he": "גירושין בהסכמה, הכול כלול (שכר טרחה, אגרות והוצאות)", "unit_he": "לשני בני הזוג יחד"},
    {"id": "lawyer_claim", "group": "lawyers", "he": "תביעה אחת: מזונות, משמורת או רכוש", "unit_he": "לתביעה, לצד", "note_he": "תביעה רכושית מורכבת או הליך מלא בתביעה אחת מגיעים לקצה העליון"},
    {"id": "lawyer_contested", "group": "lawyers", "he": "הליך גירושין מלא במחלוקת", "unit_he": "לצד", "note_he": "עסק, הון, נכסים בחו\"ל או מאבק ממושך על הילדים מגיעים לקצה העליון"},
    {"id": "lawyer_hearing", "group": "lawyers", "he": "דיון נוסף מעבר למה שהוסכם", "unit_he": "לדיון"},
    {"id": "lawyer_appeal", "group": "lawyers", "he": "ערעור על פסק דין בענייני משפחה", "unit_he": "להליך"},
    {"id": "lawyer_execution", "group": "lawyers", "he": "גביית מזונות בהוצאה לפועל", "unit_he": "להליך", "note_he": "יש משרדים שגובים במקום זה אחוז מהגבייה"},
    {"id": "lawyer_prenup", "group": "lawyers", "he": "עריכת הסכם ממון", "unit_he": "להסכם"},
    {"id": "lawyer_mediation", "group": "mediation", "he": "ליווי משפטי מלא לאורך גישור (בלי שכר המגשר)", "unit_he": "לצד"},
    {"id": "mediation_hour", "group": "mediation", "he": "שעת גישור", "unit_he": "לשעה, לשני בני הזוג", "note_he": "מקור שמפרסם מחיר לשעה מכל צד הוכפל כדי להשוות"},
    {"id": "mediation_process", "group": "mediation", "he": "הליך גישור גירושין שלם", "unit_he": "לשני בני הזוג"},
    {"id": "appraiser", "group": "experts", "he": "שמאי מקרקעין: חוות דעת על דירה לבית המשפט", "unit_he": "לחוות דעת"},
    {"id": "actuary", "group": "experts", "he": "אקטואר: חוות דעת לחלוקת פנסיה וזכויות", "unit_he": "לחוות דעת"},
    {"id": "business_valuation", "group": "experts", "he": "הערכת שווי לעסק או לחברה", "unit_he": "להערכה", "note_he": "עסק קטן עם דוחות מסודרים בקצה התחתון; חברה מורכבת לבית המשפט בקצה העליון"},
    {"id": "court_expert", "group": "experts", "he": "הערכת מסוגלות הורית (מכון או מומחה פרטי)", "unit_he": "להערכה", "note_he": "מומחה שבית המשפט ממנה מהרשימה של משרד הרווחה: בית המשפט קובע את השכר ומי משלם; את הסכום הרשמי לא בדקנו"},
    {"id": "pleader", "group": "rabbinic", "he": "טוען רבני: ליווי תיק מלא בבית הדין", "unit_he": "לצד"},
    {"id": "pleader_agreement", "group": "rabbinic", "he": "טוען רבני: הסכם גירושין", "unit_he": "להסכם"},
    {"id": "collaborative", "group": "mediation", "he": "גירושין בשיתוף פעולה (עורך דין לכל צד, בלי בית משפט)", "unit_he": "לצד", "note_he": "עם אנשי מקצוע נוספים (יועץ, אקטואר) מגיעים לקצה העליון"},
    {"id": "coordinator_hour", "group": "experts", "he": "מתאם הורי (תיאום הורי)", "unit_he": "לשעה, לשני ההורים", "note_he": "מקור שמפרסם מחיר לשעה מכל צד הוכפל כדי להשוות"},
]

PRICE_GROUPS = [
    {"id": "rb", "open": True, "kind": "official", "he": "אגרות בית הדין הרבני"},
    {"id": "fam", "open": True, "kind": "official", "he": "אגרות בית המשפט לענייני משפחה"},
    {"id": "appeal", "kind": "official", "he": "ערעור בבית המשפט המחוזי"},
    {"id": "bar", "kind": "official", "he": "התעריף המינימלי המומלץ של לשכת עורכי הדין: רצפה, לא מחייב, לכל צד, ועוד מע\"מ"},
    {"id": "notary", "kind": "official", "he": "נוטריון: מחיר קבוע בתקנות, ועוד מע\"מ"},
    {"id": "exec", "kind": "official", "he": "הוצאה לפועל"},
    {"id": "aid", "kind": "official", "he": "סיוע משפטי ושירותים בלי תשלום"},
    {"id": "lawyers", "open": True, "kind": "market", "he": "שכר טרחה של עורכי דין לגירושין ולדיני משפחה"},
    {"id": "rabbinic", "kind": "market", "he": "טוען רבני"},
    {"id": "mediation", "kind": "market", "he": "גישור וגירושין בשיתוף פעולה"},
    {"id": "experts", "kind": "market", "he": "מומחים: שמאי, אקטואר, הערכת שווי, מסוגלות הורית, תיאום הורי"},
]


def _get(reg: dict, path: str):
    cur = reg
    for k in path.split("."):
        if not isinstance(cur, dict) or k not in cur:
            raise KeyError(path)
        cur = cur[k]
    return cur


def _official(reg: dict, checked_on: str) -> list:
    out = []
    for row in OFFICIAL:
        r = {k: v for k, v in row.items() if k not in ("item_ref", "url_ref", "note_ref")}
        if "ref" in row:
            v = _get(reg, row["ref"])
            r["amount"] = v["amount"] if isinstance(v, dict) else v
            if isinstance(v, dict) and v.get("item"):
                r["item"] = v["item"]
        if "item_ref" in row:
            r["item"] = _get(reg, row["item_ref"])
        if "url_ref" in row:
            r["url"] = _get(reg, row["url_ref"])
        if "note_ref" in row:
            r["note_he"] = row["note_he"].replace("{v}", f"{_get(reg, row['note_ref']):,}")
            r["note_ref"] = row["note_ref"]
        r.setdefault("vat", False)
        # The day the row's own dataset was checked against the official text (the registry path's top-level dataset);
        # rows read here for the first time carry this dataset's day.
        path = row.get("ref") or row.get("note_ref") or row.get("item_ref")
        r.setdefault("checked_on", reg[path.split(".")[0]]["checked_on"] if path else checked_on)
        out.append(r)
    return out


def _market() -> list:
    out = []
    for row in MARKET_ROWS:
        r = dict(row)
        srcs = []
        for s in MARKET_SOURCES.get(row["id"], []):
            s = dict(s)
            s["status"] = "verified"
            s["link"] = any(d in s["url"] for d in LINKED)
            srcs.append(s)
        r["sources"] = srcs
        out.append(r)
    return out


def build(checked_on: str, registry: dict | None = None) -> dict:
    """The divorce calculator and price list: official rows resolved from the registry, market rows with their sources,
    the published durations, and the texts the instrument and the page print. `registry` is the registry being assembled
    (so a refresh of the fee datasets flows in on the same run); without it, the committed registry is read."""
    reg = registry if registry is not None else json.loads(REGISTRY.read_text(encoding="utf-8"))
    return {
        "name_he": "מחשבון גירושין ומחירון גירושין",
        "publisher_he": "תקנות הדיינים (אגרות), תקנות בית המשפט לעניני משפחה (אגרות), תקנות בתי המשפט (אגרות), כללי לשכת עורכי הדין, "
                        "תקנות הנוטריונים, תקנות הסיוע המשפטי, ופרסומי משרדים, מגשרים ומומחים",
        "source_name": "תקנות הדיינים (אגרות), התשי\"ז-1957, ותקנות בית המשפט לעניני משפחה (אגרות), התשנ\"ו-1995 (נוסח עדכני)",
        "source_url": _get(reg, "divorce_cost.rabbinical.url"),
        "checked_on": checked_on,
        "refresh_every_days": 183,
        "next_update": "2027-01-01",
        "reviewed_he": "נבדק על ידי הצוות המשפטי של Justice",
        "official": _official(reg, checked_on),
        "market": _market(),
        "durations": DURATIONS,
        "price_groups": PRICE_GROUPS,
        "sources": _sources(reg),
        "method_he": METHOD_HE,
        **TEXTS,
    }
