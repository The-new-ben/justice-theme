"""The small claim against a business (tviot-ktanot, the ktanot lane of the consumer-law wave, 22.10.2026, HAD-593) on
/small-claims-court-israel/ and, in fee mode, /small-claims-fee-calculator/. Discovered by tools/justice_tools_consumer.py
(glob), built with --consumer-checked-on.

What this file adds, and what it does NOT repeat: the ceiling (39,900 from 1.1.2026, the notice of 22.12.2025), the fee rule
of reg. 6(a) (1%, rounded up to 5, at least 50), five claims a year (s.60(b)), the defence 30 days (reg. 4(b)), the 60/40/7
days before the hearing, setting aside in 30 days (reg. 12), the 5-page body (reg. 3(e)), the online limits (5 plaintiffs, 5
defendants), the 7-year limitation and the labor-court carve-out stay in reg.small_claims and are read from there. Here: the
claim heads and the legal ground each head rests on, compensation without proof of damage of the Consumer Protection Law
s.31A (the list of paragraphs, the 10,000 maximum, 50,000 for a repeated, continuing or aggravated breach, the written
request before suing), the grounds by kind of case (defect and warranty, a flight, a subscription that kept charging, a
refund not paid, a supply not made, a price above the shown price), the Aviation Services Law's own 4-year limitation (s.19)
and its 21-day refund (s.3(a)(2)), the statement-of-claim contents (reg. 3(b)-(e)), the judgment within 7 days of the end of
the hearing (reg. 15(a)), leave to appeal in 30 days (reg. 16(a), the count of reg. 16A, the Courts Law s.64), what happens
when there is no defence (reg. 10) or a party does not appear (reg. 11), the Execution Office form 30 days after the debtor
received the judgment (the Courts Authority's page), the documents the Courts Authority recommends per kind of claim, the
choice above the ceiling (s.61(1) another court; reg. 25(b) of the Civil Procedure Regulations 2018 on one cause of action,
one claim) and the dated official values for "what changed".

Every value was read on checked_on from the official text named next to it (Nevo's consolidated texts, gov.il pages of the
Courts Authority and their PDFs, a district-court judgment published on gov.il for the quoted text of reg. 25(b)). Nothing
here is estimated; a figure the sources do not hold is not in the file. The amount of compensation the reader asks is the
reader's own; this file holds only the law's maximum.
"""
from __future__ import annotations

KEY = "consumer_ktanot"

REGS = "https://www.nevo.co.il/law_html/law00/98563.htm"        # תקנות שיפוט בתביעות קטנות (סדרי דין), התשל"ז-1976 (נוסח ל-14.4.2025)
COURTS = "https://www.nevo.co.il/law_html/law00/74849.htm"      # חוק בתי המשפט [נוסח משולב], התשמ"ד-1984 (נוסח ל-1.9.2026)
CPL = "https://www.nevo.co.il/law_html/law00/70305.htm"         # חוק הגנת הצרכן, התשמ"א-1981 (נוסח ל-30.9.2026)
WARRANTY = "https://www.nevo.co.il/law_html/law00/74025.htm"    # תקנות הגנת הצרכן (אחריות ושירות לאחר מכירה), התשס"ו-2006 (נוסח ל-18.9.2023)
AVIATION = "https://www.nevo.co.il/law_html/law00/119611.htm"   # חוק שירותי תעופה (פיצוי וסיוע בשל ביטול טיסה או שינוי בתנאיה), התשע"ב-2012 (נוסח ל-5.2.2026)
SERVICE = "https://www.gov.il/he/service/filing_a_small_claim"  # הרשות השופטת, הגשת תביעה קטנה (עודכן 8.10.2026)
GUIDE = "https://www.gov.il/he/pages/small_claims_courts_guide?chapterIndex=2"   # הנחיות למתדיין (עודכן 24.4.2025)
DESCRIPTION = "https://www.gov.il/he/pages/small_claims_description_guide"       # תביעה קטנה: המלצות להגשה (עודכן 21.7.2024)
EXECUTION = "https://www.gov.il/he/pages/paymentbyverdict_2023"                  # קבלת כסף שנפסק (עודכן 7.1.2024)
FEE_GUIDE = "https://www.gov.il/he/pages/fee_guide?chapterIndex=3"               # מדריך האגרות (פורסם 25.6.2026, עודכן 7.9.2026)
NOTICE = "https://www.gov.il/BlobFolder/guide/fee_guide/he/8869-11-19_fees_scf1126.pdf"   # הודעת מנהל בתי המשפט, 22.12.2025
EXEMPT = "https://www.gov.il/he/service/exempt_from_payment_of_a_fee"
DEFENCE = "https://www.gov.il/he/service/statement_of_defense_in_small_claims"
FORM = "https://www.gov.il/BlobFolder/generalpage/en_tr_01/he/sc21825.docx"      # טופס תביעה קטנה להגשה ידנית
COURT_FINDER = "https://www.gov.il/BlobFolder/generalpage/en_tr_01/he/localauthority16724.xlsx"
MEDIATION = "https://www.gov.il/BlobFolder/generalpage/en_tr_01/he/smallclaimsmediation.pdf"
INTERPRETER = "https://www.gov.il/he/service/notice_order_interpreter"
CPR_QUOTE = "https://www.gov.il/BlobFolder/dynamiccollectorresultitem/decision14903-01-24a/he/14903-01-24.pdf"


def build(checked_on: str) -> dict:
    """The claim against a business: heads, the ground of each, the outline, the timeline and the documents."""
    return {
        "name_he": "תביעה קטנה נגד עסק: ראשי התביעה, כתב התביעה, המסמכים והמועדים",
        "publisher_he": "תקנות שיפוט בתביעות קטנות, חוק בתי המשפט, חוק הגנת הצרכן, חוק שירותי תעופה והרשות השופטת",
        "source_name": "תקנות שיפוט בתביעות קטנות (סדרי דין), התשל\"ז-1976 (נוסח עדכני)",
        "source_url": REGS,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        # The small-claims ceiling is re-indexed every 1 January (the notice of 22.12.2025, by the December CPI).
        "next_update": "2027-01-01",
        "regs": {
            "he": "תקנות שיפוט בתביעות קטנות (סדרי דין), התשל\"ז-1976",
            "url": REGS,
            "current_to": "2025-04-14",
            # reg. 3(b): the heading of the statement of claim; 3(c): its body; 3(d): what is attached; 3(e): 5 pages.
            "outline_section": "תקנה 3",
            "header_he": ["שם התובע ומספר זהותו", "מען המגורים ופרטי התקשרות של התובע, כולל דואר אלקטרוני וטלפון נייד",
                          "שם הנתבע ומספר זהותו אם אפשר לברר; תאגיד: מספר הרישום",
                          "מען המגורים או העסק של הנתבע ופרטי התקשרות, כולל דואר אלקטרוני וטלפון נייד אם אפשר לברר",
                          "הסעד המבוקש"],
            "body_he": ["מקום המעשה או המחדל שבשלו תובעים", "הסעד המבוקש", "נימוקי התביעה",
                        "רשימת המסמכים שעליהם מבקשים להסתמך", "רשימת העדים",
                        "אם מעדיפים דיון באמצעי טכנולוגי (תקנה 13(ב)) או הכרעה על יסוד הכתב (תקנה 13(ג))",
                        "מספר התביעות הקטנות שהוגשו במהלך השנה האחרונה"],
            "attach_he": ["המסמכים שעליהם מבקשים להסתמך, אם הם ברשותכם",
                          "הצהרה שכל האמור בכתב התביעה אמת או למיטב ידיעתכם, עם מקור הידיעה"],
            "attach_section": "תקנה 3(ד)",
            "late_doc_he": "בית המשפט רשאי להתיר מסמך שלא צורף, אם הוא דרוש לפסק הדין או מסיבה חשובה אחרת",
            "no_defence_section": "תקנה 10",
            "no_defence_he": "נתבע שלא הגיש כתב הגנה במועד: בית המשפט נותן פסק דין על יסוד כתב התביעה בלבד, אלא אם ראה מן הצדק להזמין את הצדדים",
            "absence_section": "תקנה 11",
            "absence_he": "שני הצדדים לא התייצבו: התביעה נמחקת; הנתבע לא התייצב: פסק דין על יסוד כתב התביעה, אחרי הצהרת התובע; התובע לא התייצב: התביעה נדחית",
            "hearing_section": "תקנה 13(א)",
            "hearing_he": "בית המשפט קובע את סדר הראיות והטענות ומברר את המחלוקת באופן פעיל",
            "judgment_section": "תקנה 15(א)",
            "judgment_max_days": 7,
            "judgment_he": "פסק הדין ניתן בתום הדיון; בית המשפט רשאי לדחות אותו עד 7 ימים",
            "appeal_section": "תקנה 16(א)",
            "appeal_days": 30,
            "appeal_he": "בקשה לרשות ערעור על פסק הדין: 30 ימים מיום מתן פסק הדין",
            "count_section": "תקנה 16א",
            "count_he": "הימים נספרים מיום המצאת המסמך; החלטה שניתנה במעמד בעלי הדין נספרת מיום הדיון; ימי פגרה של בית המשפט נספרים, אלא אם בית המשפט הורה אחרת",
            "powers_section": "תקנה 9",
            "powers_he": "לבית המשפט סמכויות של בית משפט שלום בעניינים שבסדר דין, והוא רשאי שלא להשתמש בהן",
            "exempt_section": "תקנה 6(ב)",
        },
        "courts_law": {
            "he": "חוק בתי המשפט [נוסח משולב], התשמ\"ד-1984",
            "url": COURTS,
            "current_to": "2026-09-01",
            "other_court_section": "סעיף 61(1)",
            "other_court_he": "אפשר להגיש את התביעה לבית משפט אחר במקום לבית המשפט לתביעות קטנות",
            "procedure_section": "סעיף 62",
            "procedure_he": "בית המשפט רשאי לקבל ראיה שלא הייתה קבילה בבית משפט אחר, ואינו קשור בסדרי הדין של בתי משפט אחרים",
            "lawyer_section": "סעיף 63(א)",
            "appeal_section": "סעיף 64",
            "appeal_he": "ערעור לבית המשפט המחוזי רק אם שופט של בית המשפט המחוזי נתן רשות; שופט אחד דן בו",
        },
        # Civil Procedure Regulations 2018, reg. 25(b), quoted word for word in a Tel Aviv District Court judgment that the
        # Courts Authority publishes on gov.il (ע"א 14903-01-24). The regulations' own Nevo page was not reachable today.
        "splitting": {
            "he": "תקנות סדר הדין האזרחי, התשע\"ט-2018",
            "section": "תקנה 25(ב)",
            "quote_he": "תובע יכלול בכתב התביעה את כל הסעדים המבוקשים בשל עילת תביעה אחת, אלא אם כן הרשה לו בית המשפט או הדין מתיר שלא לתבעו במסגרת אותה תביעה",
            "url": CPR_QUOTE,
            "via_he": "כפי שצוטטה בע\"א 14903-01-24 (בית המשפט המחוזי בתל אביב-יפו)",
        },
        "heads": {
            "price": {"he": "המחיר או ההחזר שלא שולם", "basis_he": "השבת מה ששולם, לפי העילה של המקרה"},
            "fee": {"he": "דמי ביטול שנגבו שלא כדין", "basis_he": "השבת דמי הביטול מעבר למה שהחוק מתיר",
                    "section": "סעיף 14ה לחוק הגנת הצרכן", "url": CPL},
            "repair": {"he": "עלות תיקון או החלפה", "basis_he": "הנזק הממשי: מה ששולם או יידרש לתיקון או להחלפה, עם הצעת מחיר או קבלה",
                       "section": "סעיף 31(א) לחוק הגנת הצרכן", "url": CPL},
            "comp": {"he": "פיצויים לדוגמה (בלי הוכחת נזק)", "basis_he": "הסכום שאתם מבקשים; בית המשפט קובע",
                     "section": "סעיף 31א לחוק הגנת הצרכן", "url": CPL},
            "flight": {"he": "פיצוי כספי לפי חוק שירותי תעופה", "basis_he": "לפי התוספת הראשונה לחוק, לכל נוסע",
                       "section": "סעיף 6(א)(3) לחוק שירותי תעופה", "url": AVIATION},
            "other": {"he": "הוצאות שנגרמו בגלל ההפרה", "basis_he": "הוצאות ממשיות עם קבלות (משלוח, נסיעות, החלפה זמנית)",
                      "section": "סעיף 31(א) לחוק הגנת הצרכן", "url": CPL},
        },
        "costs_he": "האגרה אינה ראש תביעה ואינה מתווספת לסכום: מבקשים בסוף כתב התביעה לחייב את הנתבע בהוצאות המשפט, ובית המשפט מחליט",
        # Consumer Protection Law s.31A: compensation that does not depend on damage, for a breach of a listed provision.
        "exemplary": {
            "he": "חוק הגנת הצרכן, התשמ\"א-1981",
            "url": CPL,
            "current_to": "2026-09-30",
            "section": "סעיף 31א",
            "max": 10000,
            "max_section": "סעיף 31א(א)",
            "aggravated_max": 50000,
            "aggravated_section": "סעיף 31א(ג)(1)",
            "aggravated_he": "הפרה חוזרת, הפרה נמשכת או נסיבות מחמירות (סעיף 23א(ב))",
            "demand_section": "סעיף 31א(ב)",
            "demand_he": "לא מגישים תביעה לפיצויים לדוגמה לפני ששלחתם או מסרתם לעסק בקשה בכתב (גם בדואר אלקטרוני); במנוי מתמשך די בהודעת ביטול שלא נמסרה בעל פה, ובביטול עסקת מכר מרחוק (סעיף 14ג(ג)) די בביטול עצמו",
            "considerations_section": "סעיף 31א(ה)",
            "considerations_he": "בית המשפט שוקל אכיפה והרתעה, עידוד הצרכן לממש זכויות, חומרת ההפרה, שווי העסקה והיקף עסקי העוסק, ולא את גובה הנזק",
            "also_section": "סעיף 31א(ו)",
            "also_he": "הפיצויים לדוגמה לא גורעים מפיצויים על הנזק או מכל סעד אחר בשל אותה הפרה",
            "paragraphs": [
                {"code": "1", "label": "31א(א)(1)", "he": "לא הושבה התמורה לפי מדיניות החזרת הטובין שבמודעה (סעיף 4ג(ב))"},
                {"code": "1a", "label": "31א(א)(1א)", "he": "לא סופק למקום שהוסכם, אחרי הטעיה על מקום האספקה"},
                {"code": "2", "label": "31א(א)(2)", "he": "לא הושבה התמורה כשלא הוצגה מודעת מדיניות החזרה (סעיף 4ג(ב) ו-(ג))"},
                {"code": "2a", "label": "31א(א)(2א)", "he": "עסקה לתקופה קצובה: המשיכו לחייב אחרי סיום העסקה (סעיף 13א)"},
                {"code": "2b", "label": "31א(א)(2ב)", "he": "עסקה מתמשכת: המשיכו לחייב אחרי הודעת ביטול (סעיפים 13ד(ג) ו-14ט)"},
                {"code": "2b1", "label": "31א(א)(2ב1)", "he": "לא הוחזר סכום עודף שנגבה בעסקה מתמשכת (סעיף 13ד1)"},
                {"code": "2c", "label": "31א(א)(2ג)", "he": "נדרשה עמלה או נשללה דרך תשלום, בניגוד לסעיף 13ח"},
                {"code": "3", "label": "31א(א)(3)", "he": "רוכלות: לא הושב מה שהתקבל אחרי ביטול (סעיף 14(ב))"},
                {"code": "4", "label": "31א(א)(4)", "he": "ביטול מכר מרחוק או יחידת נופש: לא הושב המחיר או לא בוטל החיוב (סעיף 14ה)"},
                {"code": "4a", "label": "31א(א)(4א)", "he": "שירותי רפואה מתמשכים: לא הושב המחיר אחרי ביטול (סעיף 13ז(1))"},
                {"code": "4b", "label": "31א(א)(4ב)", "he": "שירותי תיירות בחו\"ל: לא הושב המחיר אחרי ביטול (סעיף 14ג2)"},
                {"code": "5", "label": "31א(א)(5)", "he": "לא חויבתם במחיר שהוצג על הטובין (סעיף 17ב(ד))"},
                {"code": "6", "label": "31א(א)(6)", "he": "סירוב לתשלום בשקלים לפי שער החליפין (סעיף 17ז(ב))"},
                {"code": "7", "label": "31א(א)(7)", "he": "לא נמסרה תעודת אחריות או מדבקת אחריות (סעיף 18א)"},
                {"code": "8", "label": "31א(א)(8)", "he": "לא תוקן קלקול בתקופת האחריות, או לא סופקו חלקי חילוף (סעיף 18א(1))"},
            ],
        },
        # The legal grounds by kind of case: each a section of an official text, for the outline's "the legal grounds".
        "kinds": {
            "def": {"he": "מוצר פגום או אחריות שלא כובדה", "docs": "products", "par": "8", "grounds": [
                {"section": "סעיף 18א לחוק הגנת הצרכן", "url": CPL, "he": "חובת השירות לאחר מכירה: תיקון ליקויים והחלפה בתקופת האחריות, לפי התקנות"},
                {"section": "תקנות הגנת הצרכן (אחריות ושירות לאחר מכירה), התשס\"ו-2006", "url": WARRANTY, "he": "תקופת האחריות, זמני התיקון והחלפה או החזר"},
                {"section": "סעיף 31(א) לחוק הגנת הצרכן", "url": CPL, "he": "הפרת פרקים ב' עד ד'1 לחוק היא עוולה, והנזק נתבע לפי פקודת הנזיקין"}]},
            "flt": {"he": "טיסה שבוטלה, התעכבה או הוקדמה", "docs": "aviation", "grounds": [
                {"section": "סעיפים 3 ו-6 לחוק שירותי תעופה", "url": AVIATION, "he": "ההטבות לנוסע בטיסה שבוטלה: סיוע, השבת תמורה או כרטיס חלופי, ופיצוי כספי לפי התוספת הראשונה"},
                {"section": "סעיף 7 לחוק שירותי תעופה", "url": AVIATION, "he": "טיסה שהמריאה באיחור: הסיוע, ומ-5 שעות השבה או כרטיס חלופי"},
                {"section": "סעיף 3(א)(2) לחוק שירותי תעופה", "url": AVIATION, "he": "השבת התמורה בתוך 21 ימים מהפנייה בכתב"}]},
            "sub": {"he": "מנוי או עסקה מתמשכת שהמשיכו לחייב", "docs": "products", "par": "2b", "grounds": [
                {"section": "סעיף 13ד(ג) לחוק הגנת הצרכן", "url": CPL, "he": "החוזה מסתיים בתוך 3 ימי עסקים מהודעת הביטול (6 ימי עסקים בדואר רשום), ואין לחייב אחרי מועד הביטול"},
                {"section": "סעיף 14ט לחוק הגנת הצרכן", "url": CPL, "he": "הדרכים למסור הודעת ביטול: בעל פה, דואר רשום, דואר אלקטרוני, פקס, אינטרנט"}]},
            "ref": {"he": "החזר שלא שולם אחרי ביטול עסקה", "docs": "products", "par": "4", "grounds": [
                {"section": "סעיף 14ה לחוק הגנת הצרכן", "url": CPL, "he": "אחרי ביטול כדין: השבת המחיר בתוך 14 ימים מקבלת הודעת הביטול, וביטול החיוב"},
                {"section": "סעיף 14ג(ג) לחוק הגנת הצרכן", "url": CPL, "he": "זכות הביטול בעסקת מכר מרחוק"}]},
            "sup": {"he": "מוצר או שירות שלא סופקו בזמן", "docs": "products", "grounds": [
                {"section": "סעיף 14ה(א) לחוק הגנת הצרכן", "url": CPL, "he": "ביטול עסקת מכר מרחוק בשל אי אספקה במועד שנקבע: השבת המחיר בתוך 14 ימים, בלי דמי ביטול"},
                {"section": "סעיף 31(א) לחוק הגנת הצרכן", "url": CPL, "he": "הפרת פרקים ב' עד ד'1 לחוק היא עוולה"}]},
            "prc": {"he": "חויבתם יותר מהמחיר שהוצג", "docs": "products", "par": "5", "grounds": [
                {"section": "סעיף 17ב(ד) לחוק הגנת הצרכן", "url": CPL, "he": "המחיר המחייב הוא המחיר שהוצג על הטובין, גם אם בקופה הוא גבוה יותר"}]},
            "oth": {"he": "מחלוקת אחרת עם עסק", "docs": "other", "grounds": [
                {"section": "סעיף 31(א) לחוק הגנת הצרכן", "url": CPL, "he": "הפרת פרקים ב' עד ד'1 לחוק היא עוולה"}]},
        },
        # The Aviation Services Law's own clock: a claim for breaching it is limited to 4 years (s.19), not 7.
        "aviation": {
            "he": "חוק שירותי תעופה (פיצוי וסיוע בשל ביטול טיסה או שינוי בתנאיה), התשע\"ב-2012",
            "url": AVIATION,
            "current_to": "2026-02-05",
            "limitation_years": 4,
            "limitation_section": "סעיף 19",
            "refund_days": 21,
            "refund_section": "סעיף 3(א)(2)",
        },
        # The documents the Courts Authority recommends per kind of claim (DESCRIPTION, updated 21.7.2024), and what the
        # regulations require (reg. 3(d)). Plus the defendant's ID: without it no Execution Office file (SERVICE).
        "documents": {
            "url": DESCRIPTION,
            "updated": "2024-07-21",
            "products": ["אישור הזמנה, או העתק של הסכם השירות", "קבלות או חשבוניות",
                         "אסמכתאות לפגם במוצר או בשירות: תצלומים, חוות דעת מומחה", "תיעוד ההתכתבות עם הנתבע"],
            "aviation": ["סיכום הזמנה", "קבלה או חשבונית", "אסמכתאות להפסד כספי: קבלות וחשבוניות",
                         "תיעוד ההתכתבות עם הנתבע"],
            "other": ["תיעוד ההתכתבות עם הנתבע", "כל מסמך אחר שיכול לסייע בהוכחת הטענות"],
            "media_he": "הקלטות או סרטונים: מציינים בנימוקי התביעה, מגישים בהחסן נייד למזכירות עם תמליל",
            "facts_products": ["איזה מוצר או שירות הוזמן", "תאריך העסקה", "תאריך קבלת המוצר או השירות", "עלות העסקה",
                               "מה הבעיה", "איך חושב סכום התביעה", "הניסיונות להגיע להסכמה"],
            "facts_aviation": ["תאריך הזמנת הטיסה", "תאריך הטיסה המתוכנן ומה קרה בפועל", "סכום העסקה ותאריך התשלום",
                               "פרטי המקרה", "איך חושב סכום התביעה", "הניסיונות להגיע להסכמה"],
            "id_he": "מספר הזהות של הנתבע (או מספר התאגיד): בלעדיו אי אפשר לפתוח תיק בהוצאה לפועל אם פסק הדין לא יקוים",
            "id_url": SERVICE,
        },
        # The Courts Authority's service page (updated 8.10.2026) and its guide pages.
        "judiciary": {
            "service_url": SERVICE,
            "service_updated": "2026-10-08",
            "guide_url": GUIDE,
            "guide_updated": "2025-04-24",
            "fee_guide_url": FEE_GUIDE,
            "fee_guide_updated": "2026-09-07",
            "notice_url": NOTICE,
            "exempt_url": EXEMPT,
            "defence_url": DEFENCE,
            "form_url": FORM,
            "court_finder_url": COURT_FINDER,
            "mediation_url": MEDIATION,
            "interpreter_url": INTERPRETER,
            "online_he": "הגשה מקוונת מהמחשב בלבד, דרך מערכת ההזדהות הלאומית; תשלום האגרה בכרטיס אשראי; קבצי PDF עד 70 מגה",
            "one_hearing_he": "בתביעה קטנה מתקיים בדרך כלל דיון אחד, עם כל העדים והמסמכים",
            "mediation_he": "תיק שנמצא מתאים מקבל הזמנה להליך גישור",
            "osek_he": "כדי לתבוע עוסק פטור או מורשה, תובעים את בעל העסק כאדם פרטי",
            "hebrew_he": "מגישים את התביעה בעברית בלבד",
        },
        # The Courts Authority's page on collecting money that was awarded (updated 7.1.2024).
        "execution": {
            "url": EXECUTION,
            "updated": "2024-01-07",
            "after_days": 30,
            "he": "30 ימים אחרי שהחייב קיבל את פסק הדין, מבקשים במזכירות כל בית משפט את הטופס \"אישור בדבר המצאת פסק דין\" ופותחים איתו תיק בהוצאה לפועל",
        },
        # What changed and when: only dated values of official texts. The previous ceilings are in the Courts Director's earlier
        # notices (the 2026 notice cites י"פ התשפ"ה עמ' 2137); their text was not reachable today, so no older amount is shown.
        "changes": [
            {"from": "2026-01-01", "he": "התקרה בתביעות קטנות: 39,900 ₪, לפי שינוי המדד מדצמבר 2024 לדצמבר 2025",
             "src_he": "הודעת מנהל בתי המשפט, 22.12.2025", "url": NOTICE},
            {"from": "2026-02-05", "he": "חוק שירותי תעופה, נוסח עדכני: התיישנות 4 שנים (סעיף 19), השבת תמורה בתוך 21 ימים (סעיף 3(א)(2))",
             "src_he": "חוק שירותי תעופה, נוסח ל-5.2.2026", "url": AVIATION},
            {"from": "2025-04-14", "he": "התקנות בנוסחן העדכני: אגרה 1% מעוגלת ל-5 ₪ ולפחות 50 ₪ (תקנה 6(א)), גוף כתב התביעה עד 5 עמודים (תקנה 3(ה)), דיון בהיוועדות חזותית או הכרעה על יסוד הכתב (תקנה 13)",
             "src_he": "תקנות שיפוט בתביעות קטנות, נוסח ל-14.4.2025", "url": REGS},
            {"from": "2026-09-01", "he": "חוק בתי המשפט בנוסחו העדכני: סעיף 60(א)(1) נוקב ב-39,900 ₪",
             "src_he": "חוק בתי המשפט, נוסח ל-1.9.2026", "url": COURTS},
            {"from": "2026-09-07", "he": "מדריך האגרות של הרשות השופטת עודכן: פרק התביעות הקטנות מ-1.1.2026",
             "src_he": "הרשות השופטת, מדריך האגרות", "url": FEE_GUIDE},
            {"from": "2026-10-08", "he": "דף ההגשה עודכן: עד 5 תובעים ו-5 נתבעים בהגשה מקוונת, בקשה לזימון עד 60 ימים לפני הדיון, מתורגמן 7 ימים לפני",
             "src_he": "הרשות השופטת, הגשת תביעה קטנה", "url": SERVICE},
        ],
        "update_rule_he": "התקרה מתעדכנת ב-1 בינואר בכל שנה לפי שינוי המדד שפורסם בדצמבר לעומת דצמבר הקודם, בהודעת מנהל בתי המשפט",
    }
