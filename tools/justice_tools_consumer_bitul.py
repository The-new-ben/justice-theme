"""The cancellation-rights checker (bitul-iska) on /bitul-iska/: the consumer-law wave (22.10.2026, HAD-593). Discovered by
tools/justice_tools_consumer.py (glob), built with --consumer-checked-on.

What this file holds, every value with the official text and the section it comes from:
- the Consumer Protection Law 1981 (Nevo, the consolidated text current to 30.9.2026): s.4ג (a store's posted return
  policy), s.13א, 13א1 + the fourth schedule (a fixed-term transaction; the gym item), s.13ג (a continuing transaction),
  s.13ד(ג) (its end within 3 / 6 business days), s.14 (door-to-door: 14 days, the effects), s.14ג (a distance sale: 14 days,
  the 2 and 7 days that are not rest days before a service, the exceptions), s.14ג1 (a person with a disability, a senior
  citizen 65+, a new immigrant: 4 months; added by Amendment 47, in force 30 days after 28.7.2016), s.14ג2 (tourism services
  fully abroad: the foreign provider's policy as a choice; Amendment 58, in force a month after 6.1.2019), s.14ה (the effects:
  14 days to refund, the fee 5% or 100 shekels whichever is lower, no fee for a defect, a mismatch, a late supply or a breach,
  installation up to 100), s.14ז (a credit voucher: at least 2 years), s.14ט (the ways to give notice; name and ID number in
  the notice), s.31א (compensation without proof of damage, up to 10,000 shekels, after a written request), s.32 (cancellation
  for misleading: refund in 7 days);
- the Consumer Protection (Cancellation of Transaction) Regulations 2010 (Nevo, current to 18.9.2023): the goods list of the
  schedule, the 50-shekel floor of the definition of goods, the windows of reg.2, the refund of regs.3-4 (7 business days, the
  same means of payment), the fee of reg.5 (5% or 100, the card clearing charge), the exceptions of reg.6;
- the Interpretation Law 1981 s.8 ("until" includes the day), s.10(a) (the first day is not counted), s.10(b) (months), s.10(c)
  (a period whose last days are rest days ends on the next day that is not one);
- the Payment Services Law 2019 (the Bank of Israel's consolidated text, current to 1.10.2024; in force 14.10.2020): s.17 (a
  guaranteed payment stopped when the goods were not supplied and the deal was cancelled), s.34 (cancelling a debit authority,
  a standing order: the relay within 2 business days, the stop within 1 business day), s.35 (cancelling one charge within 3
  business days, refunded within 1 business day), s.37, s.38;
- the Consumer Protection and Fair Trade Authority's page "ביטול עסקה: באינטרנט ובחנויות" (gov.il, updated 4.11.2025) for how
  the Authority applies the rules, and its complaint form;
- Amendment 74 (Reshumot 22.7.2026): call recordings from eight months after publication (not in force on checked_on).

What it does NOT repeat: the small-claims ceiling, the court fee rule and the 7-year limitation stay in reg.small_claims.
Nothing here is estimated; where a text sets no number (a refund day after a door-to-door cancellation, the counting of a
partial month in the gym formula, what a "business day" is in the Consumer Protection Law) the file says so in words.
"""
from __future__ import annotations

KEY = "consumer_bitul"

LAW = "https://www.nevo.co.il/law_html/law00/70305.htm"          # חוק הגנת הצרכן, התשמ"א-1981 (נוסח ל-30.9.2026)
REGS = "https://www.nevo.co.il/law_html/law00/84257.htm"         # תקנות הגנת הצרכן (ביטול עסקה), התשע"א-2010 (נוסח ל-18.9.2023)
INTERP = "https://www.nevo.co.il/law_html/law00/4667.htm"        # חוק הפרשנות, התשמ"א-1981 (נוסח ל-18.9.2023)
PSL = "https://www.boi.org.il/media/45chgare/173.pdf"            # חוק שירותי תשלום, התשע"ט-2019 (בנק ישראל, נוסח ל-1.10.2024)
GOVIL = "https://www.gov.il/he/pages/returns"                    # הרשות להגנת הצרכן ולסחר הוגן, עודכן 4.11.2025
AUTHORITY = "https://www.gov.il/he/departments/consumer_protection_and_fair_trade_authority"
COMPLAINT = "https://forms.gov.il/globaldata/getsequence/getHtmlForm.aspx?formtype=Pniot@Cpfta.gov.il"
A47 = "https://fs.knesset.gov.il//20/law/20_lsr_347848.pdf"      # ס"ח 2569, 28.7.2016, עמ' 1094
A58 = "https://fs.knesset.gov.il//20/law/20_lsr_528245.pdf"      # ס"ח 2773, 6.1.2019, עמ' 142
A74 = "https://fs.knesset.gov.il/25/law/25_lsr_14187324.pdf"     # ס"ח 3569, 22.7.2026, עמ' 904

LAW_HE = "חוק הגנת הצרכן, התשמ\"א-1981"
REGS_HE = "תקנות הגנת הצרכן (ביטול עסקה), התשע\"א-2010"


def build(checked_on: str) -> dict:
    """The cancellation-rights checker: which route, the last day, the fee, the refund and its day, the notice."""
    return {
        "name_he": "ביטול עסקה: זכות הביטול, היום האחרון, דמי הביטול וההחזר",
        "publisher_he": "חוק הגנת הצרכן, תקנות הגנת הצרכן (ביטול עסקה), חוק הפרשנות, חוק שירותי תשלום, "
                        "הרשות להגנת הצרכן ולסחר הוגן",
        "source_name": LAW_HE + " (נוסח עדכני)",
        "source_url": LAW,
        "checked_on": checked_on,
        "refresh_every_days": 180,
        # Amendment 74 (call recordings) comes into force eight months after 22.7.2026 unless postponed: read the texts again.
        "next_update": "2027-03-22",
        "law": {"he": LAW_HE, "url": LAW, "current_to": "2026-09-30"},
        "regs": {
            "he": REGS_HE,
            "url": REGS,
            "current_to": "2023-09-18",
            "published": "2010-09-14",
            "gazette_he": "ק\"ת 6927, עמ' 16",
            "in_force_months": 3,          # reg. 7: three months from publication
            "in_force_section": "תקנה 7",
            "in_force": "2010-12-14",      # 14.9.2010 + 3 months (Interpretation Law s.10(b))
        },
        "interpretation": {
            "he": "חוק הפרשנות, התשמ\"א-1981",
            "url": INTERP,
            "until_section": "סעיף 8",
            "until_he": "\"עד\" לעניין זמן: עד ועד בכלל",
            "first_day_section": "סעיף 10(א)",
            "first_day_he": "תקופה קצובה בימים מיום פלוני: אותו יום לא בא במניין",
            "months_section": "סעיף 10(ב)",
            "months_he": "תקופה בחודשים מסתיימת בחודש האחרון ביום שמספרו כמספר יום האירוע, ואם אין בחודש יום כזה, ביומו האחרון",
            "rest_section": "סעיף 10(ג)",
            "rest_he": "ימי מנוחה נמנים בתקופה, זולת אם הם הימים האחרונים שבה: אז התקופה מסתיימת ביום שאחריהם",
            "rest_days_he": "ימי מנוחה: שבת וחגי ישראל לפי סעיף 18א לפקודת סדרי השלטון והמשפט (ראש השנה, יום הכיפורים, סוכות ושמיני עצרת, פסח ושביעי של פסח, שבועות) ויום העצמאות",
        },
        # A business day: the Consumer Protection Law does not define it; the Payment Services Law leaves it to the contract
        # with the bank (s.1). The tool counts Sunday to Thursday that are not rest days, and says so wherever it counts them.
        "business_day_he": "החוק לא מגדיר \"יום עסקים\"; הכלי סופר ימים א' עד ה' שאינם ימי מנוחה",
        "fee": {
            "pct": 5,
            "cap": 100,
            "law_section": "סעיף 14ה(ב)(1)",
            "regs_section": "תקנה 5(א)",
            "includes_section": "סעיף 14ה(ד)",
            "includes_he": "דמי ביטול כוללים גם משלוח, אריזה וכל הוצאה אחרת שהעוסק טוען שהוציא בשל העסקה או ביטולה",
            "none_section": "סעיף 14ה(א)(1)",
            "none_he": "ביטול בשל פגם, אי התאמה לפרטים שנמסרו, אי אספקה במועד או הפרה אחרת של העוסק: בלי דמי ביטול",
            "clearing_section": "תקנה 5(ב)",
            "clearing_he": "בחנות, בתשלום בכרטיס אשראי: העוסק רשאי לחייב גם בעמלת הסליקה שנגבתה ממנו על העסקה, אם הוכיח אותה",
            "install_cap": 100,
            "install_law_section": "סעיף 14ה(ב2)",
            "install_door_section": "סעיף 14(ב)(2)",
            "install_regs_section": "תקנה 3(ג)",
            "install_he": "התקנה בבית לצורך שירות: עד 100 ש\"ח הוצאות התקנה, נוסף על דמי הביטול",
            "damage_section": "סעיף 14ה(ג)",
            "damage_he": "העוסק רשאי לתבוע את נזקיו אם ערך הנכס פחת בגלל הרעה משמעותית במצבו",
        },
        # In a store: the regulations (s.14ו of the law). "Goods" means goods whose price paid is over 50 shekels (reg.1).
        "store": {
            "min_price": 50,
            "min_section": "תקנה 1 (ההגדרה \"טובין\")",
            "condition_he": "הטובין מוחזרים לעוסק, לא נפגמו ולא נעשה בהם שימוש; החזרה באריזה המקורית היא ראיה מספקת לאי-שימוש",
            "condition_section": "תקנה 2",
            "open_ok_he": "פתיחת האריזה המקורית כשלעצמה אינה שימוש (פרטים 1 עד 3, 6 ו-23); חיבור לחשמל, לגז או למים הוא שימוש",
            "open_ok_section": "תקנה 2(1)",
            "receipt_days": 14,
            "nonrest_days_after": 2,
            "before_service_nonrest": 14,
            "event_before_service_nonrest": 2,
            "jewel_max": 3000,
            "late_delivery_months": 6,
            # the items of the schedule, by the reader's choice in the tool (item numbers of the schedule to reg.2)
            "items": {
                "furniture": {"item": "1", "rule": "receipt", "he": "ריהוט", "open_ok": True},
                "home": {"item": "2", "rule": "receipt", "he": "ציוד לבית ולגן, למעט כלי אוכל לא ארוזים", "open_ok": True},
                "electric": {"item": "3", "rule": "receipt", "he": "מכשיר חשמלי ומכשיר אלקטרוני, לרבות ציוד קצה (טלפון)", "open_ok": True},
                "sealed": {"item": "4", "rule": "receipt", "he": "טובין באריזתם המקורית שלא נפתחה בידי הצרכן", "open_ok": False},
                "ordered": {"item": "5", "rule": "receipt", "he": "טובין שהוזמנו וטרם סופקו (לא לפי מידות או דרישות מיוחדות)", "open_ok": False},
                "water": {"item": "6", "rule": "receipt", "he": "מטהר מים ומיתקן למים מינרליים", "open_ok": True},
                "clothing": {"item": "7", "rule": "two_days", "he": "ביגוד והנעלה (בתנאי שתווית המחיר, אם יש, לא הוסרה)", "open_ok": False},
                "travel": {"item": "8", "rule": "before_service", "he": "שירותי הארחה, נסיעה, חופש ובילוי, למעט אם הם כולם מחוץ לישראל", "open_ok": False},
                "course": {"item": "9", "rule": "before_service", "he": "חוגים וקורסים (למעט קורס פסיכומטרי)", "open_ok": False},
                "continuing": {"item": "10-19", "rule": "deal_doc", "he": "קוסמטיקה ואסתטיקה, נופש ארוך טווח, מועדון הנחות, טלפון קווי, סלולר, אינטרנט, כבלים ולוויין, מועדון כושר או ספא, מועדון היכרויות, מינוי להגרלות", "open_ok": False},
                "gym": {"item": "17", "rule": "deal_doc", "he": "חברות או מינוי במועדון כושר או ספא", "open_ok": False},
                "car": {"item": "21", "rule": "car", "he": "רכב חדש שנרכש מיבואן (כל עוד לא נרשם על שם הקונה)", "open_ok": False},
                "jewelry": {"item": "22", "rule": "two_days", "he": "תכשיט שמחירו עד 3,000 ש\"ח", "open_ok": False},
                "watch": {"item": "23", "rule": "receipt", "he": "שעון", "open_ok": True},
            },
            "event_item": "20",
            "event_he": "טובין ושירותים שנמכרו באירוע הצגה (אירוע שהעוסק הזמין אליו צרכנים, גם בפיתוי של מתנה או זכייה)",
            "car_section": "תקנה 2(6)",
            "clothing_section": "תקנה 2(2)",
            "jewel_section": "תקנה 2(7)",
            "receipt_section": "תקנה 2(1)",
            "service_section": "תקנה 2(3)",
            "continuing_section": "תקנה 2(4)",
            "event_section": "תקנה 2(5)",
            "service_goods_section": "תקנה 3(ב)",
            "service_goods_he": "טובין שנדרשו לצורך קבלת שירות (למשל ממיר): מחזירים גם אחרי שימוש, אם לא נפגמו",
            "proportional_section": "תקנה 3(ד)",
            "proof_section": "תקנה 3(א)",
            "proof_he": "מציגים חשבונית, סרט קופה, פתק החלפה או הוכחה אחרת לעסקה, למועדה, לסכום ולאמצעי התשלום",
            "branches_section": "תקנה 3(ה)",
            "branches_he": "ההחזרה אצל העוסק שבו נקנה המוצר ובכל סניף או נקודת מכירה שלו (לא אצל זכיין שתלה הודעה על כך)",
            "refund_business_days": 7,
            "refund_section": "תקנה 4(א)",
            "refund_he": "במועד הביטול ככל שאפשר, ולא יאוחר משבעה ימי עסקים, באותו אופן שבו שולם; מזומן במזומן או בשיק מזומן; כרטיס אשראי: ביטול החיוב",
            "continuing_card_section": "תקנה 4(ב)",
            "continuing_card_he": "עסקה מתמשכת בכרטיס אשראי: הזיכוי במועד החיוב שאחרי הודעת הביטול; בהרשאה לחיוב חשבון: זיכוי החשבון",
            "exceptions": [
                {"code": "assembled", "section": "תקנה 6(א)(1)", "he": "ריהוט שהורכב בבית הצרכן"},
                {"code": "custom", "section": "תקנה 6(א)(2)", "he": "טובין שיוצרו במיוחד בעבור הצרכן לפי מידות או דרישות מיוחדות"},
                {"code": "lawforbids", "section": "תקנה 6(א)(3)", "he": "טובין שעל פי דין אין להחזירם"},
                {"code": "food", "section": "תקנה 6(א)(4)", "he": "מוצרי מזון"},
                {"code": "medicine", "section": "תקנה 6(א)(5)", "he": "תרופות ותוספי תזונה"},
                {"code": "perishable", "section": "תקנה 6(א)(6)", "he": "טובין פסידים"},
                {"code": "info", "section": "תקנה 6(א)(7)", "he": "מידע כהגדרתו בחוק המחשבים"},
                {"code": "media", "section": "תקנה 6(א)(8)", "he": "טובין הניתנים להקלטה, לשעתוק או לשכפול שהאריזה המקורית שלהם נפתחה"},
                {"code": "underwear", "section": "תקנה 6(א)(9)", "he": "הלבשה תחתונה, לרבות בגדי ים"},
                {"code": "gas", "section": "תקנה 6(א)(10)", "he": "גז"},
                {"code": "jewel_high", "section": "תקנה 6(א)(11)", "he": "תכשיט שמחירו מעל 3,000 ש\"ח (שעונים אינם בכלל זה)"},
                {"code": "abroad", "section": "תקנה 6(א)(12)", "he": "שירותי הארחה, נסיעה, חופש ובילוי שכולם מחוץ לישראל, אם העוסק גילה מראש את תנאי הביטול של נותן השירות שם (נטל ההוכחה עליו)"},
            ],
            "late6_section": "תקנה 6(ב)",
            "late6_he": "מי שביקש שהטובין יסופקו יותר משישה חודשים אחרי העסקה: אין זכות ביטול אחרי מועד ההספקה",
            "vouchers_section": "תקנה 6(ג)",
            "vouchers_he": "עסקה ששולמה בתווי קנייה, בשובר מתנה או בכרטיס מגנטי נטען: אין זכות ביטול לפי התקנות",
        },
        # A store's own return policy for goods outside the list (s.4ג).
        "policy": {
            "section": "סעיף 4ג",
            "sign_he": "עוסק חייב להציג במקום העסק מודעה על מדיניות החזרת טובין שלא עקב פגם; בלי מודעה, חזקה שאפשר להחזיר",
            "refused_days": 7,
            "refused_section": "סעיף 4ג(ב)",
            "refused_he": "עוסק שסירב בניגוד למדיניות שבמודעה (או בלי מודעה): מחזירים בתוך שבעה ימים מיום הסירוב ומקבלים את מלוא התמורה באופן שבו שולם",
            "comp_section": "סעיף 31א(א)(1)-(2)",
        },
        "voucher": {
            "section": "סעיף 14ז",
            "years": 2,
            "he": "שובר זיכוי (כשאין זכות להחזר כספי): בסכום ששולם, בתוקף שנתיים לפחות, בלי חשבונית ובלי הגבלה למכירות מיוחדות",
            "change_pct": 5,
            "change_cap": 100,
            "change_he": "מימוש בפחות מסכום השובר: הפרש של עד 5% או 100 ש\"ח (הנמוך) מקבלים במזומן",
        },
        # A distance sale (s.14ג).
        "distance": {
            "section": "סעיף 14ג(ג)",
            "days": 14,
            "goods_section": "סעיף 14ג(ג)(1)",
            "service_section": "סעיף 14ג(ג)(2)",
            "service_before_nonrest": 2,
            "travel_before_nonrest": 7,
            "travel_section": "סעיף 14ג(ד)(2)",
            "define_section": "סעיף 14ג(ו)",
            "define_he": "עסקה שנעשתה בעקבות שיווק מרחוק (דואר, טלפון, רדיו, טלוויזיה, תקשורת אלקטרונית, קטלוג או מודעה), בלי נוכחות משותפת של הצדדים",
            "price_he": "מחיר הנכס כולל את דמי ההובלה ואת כל תוספת שהצרכן משלם",
            "doc_section": "סעיף 14ג(ב)",
            "doc_he": "העוסק מוסר בכתב, לא יאוחר מההספקה, מסמך עם פרטיו, המחיר, דרך הביטול, היצרן והאחריות; 14 הימים נמנים מהמאוחר מבין קבלת המוצר וקבלת המסמך",
            "exceptions": [
                {"code": "perishable", "section": "סעיף 14ג(ד)(1)", "he": "טובין פסידים"},
                {"code": "info", "section": "סעיף 14ג(ד)(3)", "he": "מידע כהגדרתו בחוק המחשבים"},
                {"code": "custom", "section": "סעיף 14ג(ד)(4)", "he": "טובין שיוצרו במיוחד בעבור הצרכן בעקבות העסקה"},
                {"code": "media", "section": "סעיף 14ג(ד)(5)", "he": "טובין הניתנים להקלטה, לשעתוק או לשכפול שהצרכן פתח את אריזתם המקורית"},
            ],
            "refund_days": 14,
            "refund_section": "סעיף 14ה",
            "refund_he": "העוסק מחזיר את מה ששולם, מבטל את החיוב ומוסר עותק מהודעת ביטול החיוב, בתוך 14 ימים מיום קבלת הודעת הביטול",
            "return_section": "סעיף 14ה(ב)(2)",
            "return_he": "בביטול שלא בשל פגם: הצרכן מחזיר את המוצר למקום העסק של העוסק",
            "collect_section": "סעיף 14ה(א)(2)",
            "collect_he": "בביטול בשל פגם, אי התאמה או אי אספקה: הצרכן מעמיד את המוצר לרשות העוסק במקום שבו נמסר לו ומודיע על כך",
            "proportional_section": "סעיף 14ה(ב1)",
            "proportional_he": "עסקה מתמשכת שהשירות בה התחיל: הצרכן משלם את התמורה היחסית בעד השירות שניתן",
            "abroad_section": "סעיף 14ג2",
            "abroad_he": "שירותי תיירות שכולם מחוץ לישראל באמצעות נותן שירות שם: העוסק רשאי להציע לבחור בין זכות הביטול לבין מדיניות הביטול של נותן השירות, אחרי שגילה אותה מראש; בחירה במדיניות שכוללת החזר: ההחזר במועדי סעיף 14ה",
            "abroad_flight_he": "טיסה מישראל או אליה עם חניית ביניים: קטע הטיסה מיעד הביניים אינו שירות שכולו מחוץ לישראל",
        },
        # Door-to-door (רוכלות, s.14) and its definition (s.8).
        "door": {
            "section": "סעיף 14(א)",
            "days": 14,
            "goods_section": "סעיף 14(א)(1)",
            "service_section": "סעיף 14(א)(2)",
            "define_section": "סעיף 8",
            "define_he": "עוסק שבא בלי הזמנה למקום המגורים, העבודה, הלימודים או השירות הצבאי של הצרכן או לכל מקום שאינו בית העסק, או שפנה ביוזמתו ובעקבות זה הגיע למקום הצרכן כדי לקשור עסקה",
            "perishable_section": "סעיף 14(ג)",
            "effects_section": "סעיף 14(ב)",
            "effects_he": "העוסק משיב את התמורה ששולמה; במכר, הצרכן מעמיד את הנכס לרשות העוסק במקום שבו נמסר; בשירות מתמשך שהתחיל, התמורה היחסית; הסעיף אינו מתיר דמי ביטול",
            "refund_days_he": "סעיף 14 לא קובע תוך כמה ימים העוסק משיב את התמורה",
            "started_he": "בשירות שאינו מתמשך: רק אם השירות עוד לא התחיל",
        },
        # A person with a disability, a senior citizen, a new immigrant (s.14ג1, Amendment 47).
        "special": {
            "months": 4,
            "door_section": "סעיף 14ג1(ב)",
            "distance_section": "סעיף 14ג1(ג)",
            "senior_age": 65,
            "immigrant_years": 5,
            "define_section": "סעיף 14ג1(א)",
            "conversation_he": "בעסקת מכר מרחוק: רק אם ההתקשרות כללה שיחה בין העוסק לצרכן, גם בתקשורת אלקטרונית",
            "proof_section": "סעיף 14ג1(ד)",
            "proof_he": "העוסק רשאי לבקש תעודה אחת בלבד: תעודת אזרח ותיק, תעודת עולה או זכאות כעולה, או תעודה על מוגבלות לתקופה של יותר משישה חודשים (או תעודה מהתוספת החמישית)",
            "not_store_he": "ארבעת החודשים חלים על עסקה ברוכלות ועל עסקת מכר מרחוק בלבד, לא על קנייה בחנות",
            "amendment_he": "חוק הגנת הצרכן (תיקון מס' 47), התשע\"ו-2016",
            "published": "2016-07-28",
            "in_force_days": 30,
            "in_force": "2016-08-27",   # 28.7.2016 + 30 days (Interpretation Law s.10(a)); for transactions made from that day
            "url": A47,
        },
        # Ending a continuing transaction (a subscription): s.13ד(ג), the ways of s.14ט.
        "ongoing": {
            "section": "סעיף 13ד(ג)",
            "end_business_days": 3,
            "end_business_days_mail": 6,
            "he": "החוזה מסתיים בתוך שלושה ימי עסקים מיום מסירת הודעת הביטול (בדואר רשום: שישה ימי עסקים מיום מסירתה למשלוח), אלא אם הצרכן נקב מועד מאוחר יותר; מאז אין חיוב בעד טובין או שירותים",
            "define_section": "סעיף 13ג(א)",
            "disclosure_section": "סעיף 13ג(ב)(3)",
            "disclosure_he": "לפני ההתקשרות העוסק חייב לגלות בעל פה ובכתב את זכות הביטול ואת התשלומים שבשל הביטול, אם יש, לפי תנאי העסקה",
            "fixed_term_section": "סעיף 13א(ב)-(ג)",
            "fixed_term_he": "בעסקה לתקופה קצובה עם הרשאה לחיוב: העוסק מודיע על מועד הסיום 60 עד 30 ימים לפניו, ובלי הסכמת הצרכן ההתקשרות לא נמשכת אחריו",
            "overcharge_section": "סעיף 13ד1",
            "overcharge_he": "חיוב ביתר בעסקה מתמשכת: העוסק בודק בתוך 10 ימי עסקים ומשיב בתוך 4 ימי עסקים עם ריבית ותשלום הוצאות",
        },
        # The fourth schedule, item 2: a fixed-term transaction with a gym (s.13א1).
        "gym": {
            "section": "התוספת הרביעית, פרט 2",
            "law_section": "סעיף 13א1",
            "effect_months": 1,
            "written_he": "הודעת ביטול בכתב; הביטול נכנס לתוקף בתום חודש מיום מסירתה",
            "proportional_he": "החלק היחסי של התמורה בעד זכות השימוש עד שהביטול נכנס לתוקף",
            "fee_he": "דמי ביטול: מספר החודשים מתחילת העסקה ועד שהביטול נכנס לתוקף, כפול ההפרש בין המחיר החודשי בעסקה למחיר החודשי במסלול החלופי (לתקופה לא קצובה), ורק אם המסלול החלופי נמסר בכתב לפני ההתקשרות",
            "cap_pcts": [25, 20, 17],
            "cap_he": "דמי הביטול לא יעלו על הנמוך מבין: 25%, 20% או 17% מהתמורה (ביטול בשליש הראשון, השני או האחרון של התקופה), והסכום שהיה משולם על יתרת התקופה",
            "consideration_he": "תמורה: כל תשלום לעוסק בקשר לעסקה, כולל דמי רישום; המחיר החודשי בעסקה הוא התמורה חלקי מספר חודשי השימוש",
        },
        # Misleading (s.32) and exploiting distress.
        "mislead": {
            "section": "סעיף 32(א)",
            "he": "עסקה שנעשתה בעקבות הטעיה מהותית (סעיף 2) או ניצול מצוקה (סעיף 3): מבטלים בתוך זמן סביר מהיום שבו נודע על ההטעיה",
            "refund_days": 7,
            "refund_section": "סעיף 32(ב)",
            "refund_he": "העוסק משיב את התמורה בתוך שבעה ימים מיום קבלת ההודעה, באותו אופן שבו שולמה; הצרכן מעמיד את הנכס לרשות העוסק במקום שבו נמסר",
        },
        # The ways to give notice (s.14ט).
        "channels": [
            {"code": "phone", "section": "סעיף 14ט(א)(1)", "he": "בעל פה: בטלפון או במקום העסק (לא כשהחוק דורש הודעה בכתב)"},
            {"code": "mail", "section": "סעיף 14ט(א)(2)", "he": "בדואר רשום"},
            {"code": "email", "section": "סעיף 14ט(א)(3)", "he": "בדואר אלקטרוני"},
            {"code": "fax", "section": "סעיף 14ט(א)(4)", "he": "בפקס, אם יש לעוסק"},
            {"code": "web", "section": "סעיף 14ט(א)(5)", "he": "באינטרנט, בעסקה שאפשר לעשות באינטרנט: בקישור ייעודי בדף הבית של האתר (סעיף 14ט(ב))"},
        ],
        "channels_section": "סעיף 14ט",
        "notice_details_section": "סעיף 14ט(ג)",
        "notice_details_he": "בהודעת הביטול מציינים שם ומספר זהות (בטלפון: גם פרט מזהה שסוכם בעת ההתקשרות)",
        "store_channel_he": "בחנות לפי התקנות (סעיף 14ו) דרכי סעיף 14ט לא חלות: מחזירים בבית העסק או בכל סניף שלו, עם הוכחת הקנייה",
        "store_channel_section": "סעיף 14ט(ז)",
        "written_only_he": "הודעה בכתב נדרשת ביחידת נופש (סעיף 14א(ג)) ובמכון כושר לתקופה קצובה (התוספת הרביעית)",
        # Compensation without proof of damage (s.31א): the paragraphs that touch a cancellation; the pitzui tool computes.
        "comp": {
            "max": 10000,
            "section": "סעיף 31א(א)",
            "demand_section": "סעיף 31א(ב)",
            "demand_he": "לפני תביעה לפיצויים לדוגמה שולחים לעוסק בקשה בכתב; בביטול עסקת מכר מרחוק ובביטול עסקה מתמשכת, הודעת הביטול עצמה מספיקה",
            "door": "סעיף 31א(א)(3)",
            "distance": "סעיף 31א(א)(4)",
            "ongoing": "סעיף 31א(א)(2ב)",
            "abroad": "סעיף 31א(א)(4ב)",
            "policy": "סעיף 31א(א)(1)-(2)",
        },
        # The Payment Services Law: a standing order (a debit authority) and a guaranteed (card) payment.
        "psl": {
            "he": "חוק שירותי תשלום, התשע\"ט-2019",
            "url": PSL,
            "current_to": "2024-10-01",
            "in_force": "2020-10-14",
            "in_force_section": "סעיף 77(א)",
            "authz_section": "סעיף 34(א)",
            "authz_he": "את הרשאה לחיוב (הוראת קבע בבנק או בכרטיס) מבטלים בכל עת בהודעה לבנק או לחברת הכרטיס, או לעוסק",
            "relay_business_days": 2,
            "stop_business_days": 1,
            "stop_section": "סעיף 34(ב)",
            "stop_he": "מי שקיבל את ההודעה מעביר אותה לצד השני בהקדם ולא יאוחר משני ימי עסקים; לא יאוחר מיום עסקים אחד מקבלתה, העוסק לא דורש ונותן שירותי התשלום לא מבצע חיוב מכוח ההרשאה",
            "charge_cancel_business_days": 3,
            "charge_refund_business_days": 1,
            "charge_section": "סעיף 35(א)",
            "charge_he": "חיוב מסוים מכוח הרשאה מבטלים בהודעה לנותן שירותי התשלום בתוך שלושה ימי עסקים מהחיוב; הסכום מוחזר בתוך יום עסקים אחד",
            "unused_months": 24,
            "unused_section": "סעיף 34(ג)",
            "excess_section": "סעיף 37",
            "excess_he": "חיוב שחרג מההרשאה (אחרי שפקעה, בסכום או במועד אחר): ההפרש מוחזר בתוך יום עסקים אחד",
            "unreasonable_section": "סעיף 38(א)",
            "unreasonable_days": 7,
            "guaranteed_section": "סעיף 17(א)",
            "guaranteed_he": "תשלום מובטח (כמו כרטיס אשראי) על נכס או שירות שלא סופק אף שעבר מועד האספקה, אחרי שהודעתם לעוסק על הביטול: מודיעים לחברת הכרטיס, והיא מפסיקה את החיוב ממועד ההודעה",
            "business_day_he": "\"יום עסקים\" בחוק שירותי תשלום: כפי שנקבע בחוזה עם נותן שירותי התשלום (סעיף 1)",
        },
        "authority": {
            "he": "הרשות להגנת הצרכן ולסחר הוגן",
            "page_url": GOVIL,
            "page_updated": "2025-11-04",
            "home_url": AUTHORITY,
            "complaint_url": COMPLAINT,
        },
        # What changed and when: only dates an official text sets.
        "changes": [
            {"from": "2010-12-14", "he": "תקנות הגנת הצרכן (ביטול עסקה) נכנסות לתוקף: זכות ביטול בחנות לרשימת מוצרים ושירותים, דמי ביטול 5% או 100 ש\"ח", "section": "תקנה 7 (שלושה חודשים מהפרסום ב-14.9.2010)", "url": REGS},
            {"from": "2016-08-27", "he": "תיקון 47: ארבעה חודשים לאדם עם מוגבלות, לאזרח ותיק (65 ומעלה) ולעולה חדש, בעסקה ברוכלות ובעסקת מכר מרחוק שכללה שיחה", "section": "סעיף 14ג1; תחילה 30 ימים מהפרסום ב-28.7.2016", "url": A47},
            {"from": "2019-02-06", "he": "תיקון 58: בשירותי תיירות שכולם מחוץ לישראל העוסק רשאי להציע בחירה במדיניות הביטול של נותן השירות", "section": "סעיף 14ג2; תחילה חודש מהפרסום ב-6.1.2019", "url": A58},
            {"from": "2020-10-14", "he": "חוק שירותי תשלום נכנס לתוקף: ביטול הוראת קבע בכל עת, ביטול חיוב בתוך שלושה ימי עסקים", "section": "סעיפים 34, 35, 77(א)", "url": PSL},
            {"from": "2027-03-22", "he": "תיקון 74 (פורסם 22.7.2026): חובת הקלטת שיחות בעסקאות מסוימות מ-750 ש\"ח, שמירה שנתיים ומסירה לצרכן בתוך 10 ימי עסקים; תחילה שמונה חודשים מהפרסום, והשר רשאי לדחות עד ארבעה חודשים", "section": "סעיף 16ד; סעיף 10 לחוק המתקן", "url": A74},
        ],
    }
