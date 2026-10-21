"""The dispute-settlement clock dataset (the family + land wave, 21.10.2026, HAD-579): the instrument on
/request-for-family-dispute-settlements/ (tool id yishuv-sichsuch).

It extends the wave-4 dataset divorce_cost.disputes (tools/justice_tools_registry.py), which already holds the four
meetings, the 45/15/60/75/15 days and their sections; those values were re-read against the law on checked_on (see
"verified" below) and are read by the engine from divorce_cost, never copied here. The request fees are read the same
way from divorce_cost.family.request and divorce_cost.rabbinical.request; "fee_check" repeats them only so a test
fails if the two datasets ever drift apart.

Every value below was read on checked_on from the official text named next to it: the Family Disputes Settlement Law
2014 and its 2016 regulations (Nevo's consolidated texts, amendment 3 in force from 8.12.2020, the regulations as last
amended on 2.4.2024), the Interpretation Law, the two fee regulations, and the two official service pages (the
Judiciary's page on gov.il, updated 15.10.2026, and the rabbinical courts' page, updated 10.12.2025). Nothing is
estimated; what the sources do not state is not in the file.
"""
from __future__ import annotations

KEY = "fl_sichsuch"

LAW = "https://www.nevo.co.il/law_html/law01/501_151.htm"         # חוק להסדר התדיינויות בסכסוכי משפחה, התשע"ה-2014
REGS = "https://www.nevo.co.il/law_html/law01/501_431.htm"        # תקנות להסדר התדיינויות בסכסוכי משפחה, התשע"ו-2016
INTERPRETATION = "https://www.nevo.co.il/law_html/law00/4667.htm"  # חוק הפרשנות, התשמ"א-1981
FAMILY_FEES = "https://www.nevo.co.il/law_html/law00/71537.htm"   # תקנות בית המשפט לעניני משפחה (אגרות), התשנ"ו-1995
RABBINICAL_FEES = "https://www.nevo.co.il/law_html/law00/70297.htm"  # תקנות הדיינים (אגרות), התשי"ז-1957
SVC_COURT = "https://www.gov.il/he/service/asking_for_family_dispute_settlements"   # הרשות השופטת, עודכן 15.10.2026
SVC_RBC = "https://www.gov.il/he/service/opening-a-dispute-resolution-case"           # בתי הדין הרבניים, עודכן 10.12.2025
SVC_FORM7 = "https://www.gov.il/he/service/shorten-or-extend-delay-proceedings-family-dispute"
SVC_FORM6 = "https://www.gov.il/he/service/request_urgent_relief_other_way_request_to_settle_dispute"
SVC_FORM5 = "https://www.gov.il/he/service/asking_for_prohibited_steps_order"
SVC_EXEMPT = "https://www.gov.il/he/service/exempt_from_payment_of_a_fee"
SVC_APPROVE = "https://www.gov.il/he/service/couple-family-agreement"
NET = "https://www.court.gov.il/ngcs.web.site/homepage.aspx"
RBC_PAY = "https://www.gov.il/he/Departments/DynamicCollectors/agrot_rbc?skip=0"
MAHUT_GUIDE = "https://www.gov.il/apps/Digital-Gov/mahut-process/"


def build(checked_on: str) -> dict:
    """The clock, the exceptions, the forms and the filing channels of a request to settle a family dispute."""
    return {
        "name_he": "השעון של בקשה ליישוב סכסוך: פגישות מהו\"ת, עיכוב הליכים והגשת תביעה",
        "publisher_he": "החוק להסדר התדיינויות בסכסוכי משפחה ותקנותיו, הרשות השופטת ובתי הדין הרבניים",
        "source_name": "חוק להסדר התדיינויות בסכסוכי משפחה, התשע\"ה-2014 (נוסח עדכני), ותקנות להסדר התדיינויות בסכסוכי משפחה, התשע\"ו-2016",
        "source_url": LAW,
        "checked_on": checked_on,
        "refresh_every_days": 183,
        # The request fees (read from divorce_cost) change every 1 January (both courts) and 1 July (family court).
        "next_update": "2027-01-01",
        "law_he": "חוק להסדר התדיינויות בסכסוכי משפחה, התשע\"ה-2014",
        "law_url": LAW,
        "regs_he": "תקנות להסדר התדיינויות בסכסוכי משפחה, התשע\"ו-2016",
        "regs_url": REGS,
        "regs_year": 2016,
        # Kovetz HaTakanot 11231, 2.4.2024: the last amendment shown in the consolidated text (regulation 7(א2)).
        "regs_last_amended": "2024-04-02",
        "interpretation_he": "חוק הפרשנות, התשמ\"א-1981",
        "interpretation_url": INTERPRETATION,
        # s.10(א): the day of the event is not counted; 10(ב): a period in months or years ends on the same day number,
        # or on the month's last day; 10(ג): rest days count unless they are the period's last days.
        "interpretation_sections": {"days": "סעיף 10(א)", "months": "סעיף 10(ב)", "rest": "סעיף 10(ג)"},
        # When the law applies (s.7; the order for the sharia courts; amendment 3, s.10(ב) of the amending law).
        "start": {
            "law": "2016-07-17", "law_section": "סעיף 7",
            "sharia": "2022-11-30", "sharia_he": "בבתי הדין השרעיים החוק חל מ-30.11.2022 (צו לפי סעיף 7)",
            "amend3": "2020-12-08",
            "amend3_he": "התקופות של היום (60 או 75 ימי עיכוב, 5 ימים להודעה, ימי החג שלא נספרים) חלות על בקשה שהוגשה מ-8.12.2020 (תיקון מס' 3, סעיף 10(ב) לחוק המתקן)",
            "permanent_he": "החוק קבוע: סעיף 9, שקבע לו תוקף זמני, בוטל בתיקון מס' 3",
            # The text before amendment 3 (shown struck through in Nevo's consolidated text of s.3(ד)-(ה)).
            "old_he": "לפני 8.12.2020 העיכוב היה 45 ימים, או 60 אם הוארך, ולהודעת הצדדים היו 10 ימים (הנוסח הקודם של סעיף 3(ד) ו-(ה))",
        },
        # What divorce_cost.disputes says, re-read against the law on checked_on (each key with the section that holds it).
        "verified": {
            "on": checked_on,
            "meetings_max": "סעיף 3(ב)(1): ארבע פגישות מהו\"ת; יחידת הסיוע רשאית לקיים פחות",
            "meetings_days": "סעיף 3(ב)(3): כל הפגישות בתוך 45 ימים מיום הגשת הבקשה",
            "extend_days": "סעיף 3(ב)(3): יחידת הסיוע רשאית להאריך פעם אחת ב-15 ימים, בהודעה לערכאה ולצדדים",
            "stay_days": "סעיף 3(ה): 60 ימים מיום הגשת הבקשה",
            "stay_days_extended": "סעיף 3(ה): 75 ימים אם התקופה הוארכה לפי סעיף 3(ב)(3)",
            "claim_days": "סעיף 4: מי שהגיש את הבקשה רשאי להגיש תובענה בתוך 15 ימים",
            "pause": "סעיף 6א(א)(1) ו-(ג)",
            "abroad": "סעיף 4א(1)",
            "free": "תקנות 2016, טופס 2, פרט (5)",
        },
        # Periods beyond divorce_cost.disputes, each with its section.
        "periods": {
            "notice_days": 5, "notice_section": "סעיף 3(ד); תקנה 8(א)",
            "notice_he": "בתוך 5 ימים מפגישת המהו\"ת האחרונה כל צד מודיע ליחידת הסיוע ולצד השני, בטופס 3, אם הוא רוצה להמשיך בהליך חלופי; 5 הימים נספרים בתוך התקופות של סעיף 3(ב)",
            "agreed_claim_days": 15, "agreed_section": "סעיף 3(ה); תקנה 8(א) ו-(ג)",
            "agreed_he": "הסכמתם בכתב (טופס 3) להאריך את העיכוב עד יום מסוים: אין תביעות עד אז, ואם לא הגעתם להסכם, מי שהגיש את הבקשה תובע בתוך 15 ימים מסוף ההארכה",
            "stop_claim_days": 15, "stop_section": "תקנה 8(ד)",
            "stop_he": "צד שרוצה להפסיק את ההליך לפני סוף ההארכה המוסכמת מודיע בכתב לצד השני, עם העתק לערכאה וליחידת הסיוע; מי שהגיש את הבקשה תובע בתוך 15 ימים מיום ההודעה",
            "court_section": "סעיף 3(ה) וסעיף 5(א)(5); תקנה 16",
            "court_he": "ערכאה שקיצרה או האריכה את העיכוב (בקשה בטופס 7): המועדים שבחוק רצים מסוף העיכוב החדש (תקנה 16(ו)); קיצור לעניין אחד לא פותח את שאר העניינים",
            "relief_months": 5, "relief_section": "סעיף 3(ז)(4)",
            "relief_he": "צו לסעד דחוף או זמני עומד 5 חודשים מיום שניתן, אלא אם הערכאה קבעה תקופה אחרת; אם הערכאה המוסמכת החליטה בו אחרי שהוגשו התביעות, הוא עומד עד ההחלטה",
            "repeat_years": 1, "repeat_section": "סעיף 3(י)(1)",
            "repeat_he": "בשנה שאחרי בקשה ליישוב סכסוך, מי שהגיע לפגישות המהו\"ת יכול להגיש תביעה בלי בקשה חדשה, אחרי שעברו התקופות ו-15 הימים",
            "repeat2_section": "סעיף 3(י)(2)",
            "repeat2_he": "עברה יותר משנה: אפשר בלי בקשה חדשה רק אם תלויה ועומדת ביניכם תביעה בעניין משפחתי, או שהסתיימה בשנה האחרונה",
            "second_request_section": "תקנה 2א(ב)",
            "second_request_he": "בקשה שנייה בין אותם צדדים לא מתקבלת, בשום ערכאה, לפני שעברה תקופת העיכוב של הבקשה הראשונה",
            "service_days": 3, "service_section": "תקנה 3(ב)(3)",
            "service_he": "כשעורך דין מגיש את הבקשה, הוא מוסר למשיב את העתק הבקשה וההזמנה בתוך 3 ימים מיום ההגשה",
            "more_meetings": 3, "more_section": "תקנה 3(א)",
            "more_he": "בסוף הפגישה הראשונה יחידת הסיוע מזמנת לעד 3 פגישות נוספות, לפי הצורך",
            "response_days": 10, "response_section": "תקנה 11(א)",
            "response_he": "על בקשה לסעד זמני (טופס 5) המשיב עונה בתוך 10 ימים, עם תצהיר",
            "passport_days": 30, "passport_section": "תקנה 12(א)(2)",
            "urgent_strike_days": 60, "urgent_strike_section": "תקנה 3(ה)",
            "urgent_strike_he": "בקשה ליישוב סכסוך שהוגשה עם בקשה לסעד דחוף נמחקת בתוך 60 ימים מההחלטה בסעד, אם המבקש לא הודיע שיש עוד עניינים ולא הגיע לפגישת המהו\"ת",
            "lawyer_years": 5, "lawyer_section": "סעיף 3(ב)(4)",
            "lawyer_he": "עורך דין של יחידת הסיוע, עם 5 שנות ניסיון לפחות בדיני משפחה והכשרה ביישוב סכסוכים, משתתף בפגישות לפי שיקול דעת היחידה",
            "young_age": 21, "young_section": "סעיף 2, הגדרת \"תובענה בעניין של סכסוך משפחתי\", פסקה (6)",
            "child_age": 18, "child_section": "סעיף 2, הגדרת \"ילדה או ילד\"",
        },
        # The meetings (s.3(ב)-(ד), (ח1); regulations 3-7; form 2).
        "meetings": {
            "summons_he": "ההזמנה לפגישת מהו\"ת היא כמו הזמנה לדיון בבית המשפט", "summons_section": "סעיף 3(ב)(1); טופס 2, פרט (7)",
            "in_person_he": "הצדדים מתייצבים בעצמם; יחידת הסיוע רשאית להיפגש עם כל אחד לחוד", "in_person_section": "סעיף 3(ב)(2)",
            "first_alone_he": "לפגישה הראשונה באים בלי עורך דין; לא מנסים בה ליישב את הסכסוך המשפטי, רק הסדרים זמניים אם שניכם רוצים", "first_alone_section": "תקנה 5(ב); טופס 2, פרט (6)",
            "lawyers_join_he": "פגישה שיחידת הסיוע ייעדה לניסיון ליישב את הסכסוך: אפשר לצרף אליה את עורכי הדין", "lawyers_join_section": "תקנה 5(ג)",
            "free_he": "פגישות המהו\"ת בלי תשלום", "free_section": "טופס 2, פרט (5)",
            "no_sign_he": "לא חותמים בפגישות על הסכם ולא מתחייבים לפני שניתנה הזדמנות להתייעץ עם עורך דין", "no_sign_section": "תקנה 5(ה)",
            "confidential_he": "מה שנאמר ביחידת הסיוע חסוי ואסור בפרסום; היחידה מדווחת רק אם הגעתם", "confidential_section": "תקנה 6; סעיף 3(ח1)(1)",
            "remote_he": "במקרים חריגים, בהחלטה מנומקת בכתב, אפשר לקיים פגישות מחוץ ליחידה או בתקשורת מרחוק", "remote_section": "תקנה 5(ו)",
            "recommend_he": "בסוף הפגישה האחרונה יחידת הסיוע ממליצה על הדרך: ייעוץ, גישור, גירושין בשיתוף פעולה או טיפול", "recommend_section": "סעיף 3(ד); תקנה 7(א)",
            "mediator_he": "הסכמתם לגישור: יחידת הסיוע מביאה שם של מגשר מרשימת המגשרים בענייני משפחה, ששכרו לא עולה על שכר הטרחה המרבי; מותר לבחור מגשר אחר", "mediator_section": "תקנה 7(א1) ו-(ד)",
            "agreement_he": "הגעתם להסכמה: הערכאה רשאית לתת לה תוקף של פסק דין, גם לפני סוף העיכוב", "agreement_section": "סעיף 3(ט)",
            "children_he": "בפגישות אפשר לקבוע בהסכמה הסדרים לילדים: מזונות, החזקה וזמני שהות", "children_section": "סעיף 3(ג)(4)",
        },
        "nonattend": {
            "he": "צד שלא התייצב: יחידת הסיוע מדווחת, והערכאה רשאית, לבקשת הצד שהגיע, לחייב אותו בהוצאות, להאריך את העיכוב ולמחוק בקשה או תביעה שהוא הגיש",
            "section": "תקנה 4(א); סעיף 3(ח1)(1)",
            "after_he": "גם אחרי סוף העיכוב, כל ערכאה שמוגשת לה תביעה רשאית לחייב בהוצאות את מי שלא הגיע",
            "after_section": "תקנה 4(ב)",
            "shorten_he": "מי שלא התייצב לפגישה לא יכול לבקש קיצור של העיכוב, אלא באישור מטעמים מיוחדים",
            "shorten_section": "תקנה 16(ג)",
        },
        # Which claims need a request first (s.2, definitions; s.3(א)) and which do not (s.2; s.4א; s.3(י)).
        "scope": {
            "subjects": [
                {"key": "divorce", "he": "נישואין וגירושין, חוץ מתביעת גירושין שמוגשת בהסכמה", "section": "סעיף 2, פסקה (1)"},
                {"key": "property", "he": "יחסי ממון ותביעות כספיות או רכושיות בין בני הזוג, חוץ מירושה", "section": "סעיף 2, פסקה (2)"},
                {"key": "support", "he": "מזונות ומדור של בן או בת זוג ושל ילד, כולל מזונות זמניים", "section": "סעיף 2, פסקה (3)"},
                {"key": "children", "he": "כל עניין של ילד לפי חוק הכשרות המשפטית והאפוטרופסות: החזקה, זמני שהות, אפוטרופסות", "section": "סעיף 2, פסקה (4)"},
                {"key": "parentage", "he": "אבהות או אמהות שלא בהסכמה", "section": "סעיף 2, פסקה (5)"},
                {"key": "young", "he": "מזונות או סכסוך עם ילד בגיר שעוד לא מלאו לו 21", "section": "סעיף 2, פסקה (6)"},
            ],
            "excluded": [
                {"key": "consent", "he": "תביעת גירושין או אבהות שמוגשת בהסכמת שני הצדדים", "section": "סעיף 2, פסקאות (1) ו-(5)"},
                {"key": "agreement", "he": "בקשה לאישור הסכם, ערעור, אכיפה וביצוע של החלטה, ואכיפת פסק חוץ", "section": "סעיף 2, הגדרת \"תובענה\""},
                {"key": "inheritance", "he": "תביעה בענייני ירושה", "section": "סעיף 2, פסקה (2)"},
                {"key": "hague", "he": "החזרת ילד חטוף לפי אמנת האג, ועיכוב יציאה בקשר אליה", "section": "סעיף 2, פסקה (4)"},
            ],
            "not_applicable": [
                {"key": "abroad", "he": "מקום המושב של אחד הצדדים אינו בישראל", "section": "סעיף 4א(1)"},
                {"key": "state", "he": "המדינה צד להליך (חוץ מאבהות או אמהות שלא בהסכמה)", "section": "סעיף 4א(2)"},
                {"key": "violence", "he": "הליך לפי החוק למניעת אלימות במשפחה (צו הגנה)", "section": "סעיף 4א(3)"},
                {"key": "stalking", "he": "הליך לפי חוק מניעת הטרדה מאיימת", "section": "סעיף 4א(4)"},
            ],
        },
        # Urgent and temporary relief, at any time (s.3(ז); regulations 2א, 10-14).
        "urgent": {
            "anytime_he": "בקשה לסעד דחוף, לסעד זמני לשמירת המצב הקיים או לעיכוב יציאה מהארץ מגישים בכל עת, גם בתקופת העיכוב",
            "anytime_section": "סעיף 3(ז)(1)",
            "list": [
                {"key": "medical", "he": "פעולה רפואית דחופה בילד, כשההורים לא מסכימים", "section": "תקנה 12(א)(1)", "no_request": True},
                {"key": "passport", "he": "דרכון ויציאה של ילד לחוץ לארץ, כשהנסיעה בתוך 30 ימים מהבקשה", "section": "תקנה 12(א)(2)", "no_request": True},
                {"key": "support", "he": "מזונות או קשר של ילד עם הורה, כשההמתנה לפגישה הראשונה תגרום נזק של ממש", "section": "תקנה 12(א)(3)", "no_request": False},
                {"key": "shelter", "he": "אישה במקלט לנשים נפגעות אלימות: להחזיק בילדים ולקבל את ההחלטות הנדרשות", "section": "תקנה 12(א)(3א)", "no_request": False},
                {"key": "school", "he": "רישום ילד למוסד לימודים, סמוך לתחילת הלימודים", "section": "תקנה 12(א)(3ב)", "no_request": True},
                {"key": "divorce", "he": "תביעת גירושין דחופה כשבן הזוג שגר בחוץ לארץ נמצא בישראל, או בנסיבות מיוחדות", "section": "תקנה 12(א)(4)", "no_request": True},
                {"key": "exit", "he": "עיכוב יציאה של ילד מהארץ", "section": "תקנה 2א(א)", "no_request": True},
            ],
            "no_request_section": "תקנה 2א(א)",
            "no_request_he": "בלי בקשה ליישוב סכסוך המזכירות מקבלת רק סעד דחוף לפי תקנה 12(א)(1), (2), (3ב) ו-(4), ועיכוב יציאה של ילד; כל השאר, כולל סעד זמני, רק אחרי בקשה",
            "support_only_urgent_he": "מזונות זמניים וקשר עם ילד מבקשים בתקופת העיכוב רק כסעד דחוף לפי תקנה 12(א)(3)",
            "support_only_urgent_section": "תקנה 12(ה)",
            "temporary_he": "סעד זמני לשמירת המצב הקיים, כולל עיכוב יציאה מהארץ או עיקול: טופס 5, קצר, עם אסמכתאות ותצהיר",
            "temporary_section": "תקנה 10(א)",
            "no_double_he": "ערכאה לא נותנת סעד דחוף או זמני בעניין שערכאה אחרת כבר נתנה בו סעד, ולא דנה אז בשאלת הסמכות",
            "no_double_section": "סעיף 3(ז)(3) ו-(ח)",
        },
        # Shortening or extending the stay (regulation 16; form 7).
        "court_change": {
            "shorten": [
                {"he": "העברת ילד למסגרת חינוכית, בדחיפות", "section": "תקנה 16(א)(1)"},
                {"he": "טיפול פסיכולוגי דחוף, או בדיקה, טיפול או אשפוז פסיכיאטרי בילד", "section": "תקנה 16(א)(2)"},
                {"he": "בקשה חדשה בתוך שנה מבקשה קודמת שעברה תקופתה, או התדיינות בעניין משפחתי אחר בין הצדדים", "section": "תקנה 16(א)(3)"},
                {"he": "מזונות, החזקה או קשר, כשההמתנה לסוף העיכוב תגרום נזק של ממש", "section": "תקנה 16(א)(4)"},
                {"he": "כתובת הצד השני לא ידועה, או שהוא בחוץ לארץ לתקופה שלא מאפשרת פגישות", "section": "תקנה 16(א)(5)"},
                {"he": "כתב אישום נגד הצד השני על אלימות או עבירת מין כלפי בן הזוג או הילדים", "section": "תקנה 16(א)(6)"},
                {"he": "אחד הצדדים אסיר או עצור עד תום ההליכים", "section": "תקנה 16(א)(6א)"},
                {"he": "אישה שנמצאת במקלט לנשים נפגעות אלימות", "section": "תקנה 16(א)(7)"},
                {"he": "צו כינוס או פשיטת רגל לאחד הצדדים, לתביעת רכוש או מזונות", "section": "תקנה 16(א)(9)"},
                {"he": "יחידת הסיוע המליצה, כי ההמתנה תגרום נזק של ממש", "section": "תקנה 16(א)(10)"},
            ],
            "extend": [
                {"he": "הצד השני ביטל פגישות או לא הגיע אליהן בחוסר תום לב", "section": "תקנה 16(ב)(1)"},
                {"he": "אבל, מחלה או מחלה של בן משפחה מדרגה ראשונה מנעו את הפגישות", "section": "תקנה 16(ב)(2)"},
                {"he": "צד היה בחוץ לארץ ביום הבקשה וצפוי לחזור בקרוב", "section": "תקנה 16(ב)(3)"},
            ],
        },
        # Maintenance and housing relate back to the request (regulation 15(ב)).
        "support_back": {
            "he": "תביעת מזונות או מדור שמוגשת בסוף תקופת העיכוב נחשבת כאילו הוגשה ביום הבקשה ליישוב סכסוך; מועד התשובה של הצד השני נספר מיום ההגשה בפועל",
            "section": "תקנה 15(ב)",
        },
        "forms": {
            "1": {"he": "טופס 1: בקשה ליישוב סכסוך", "section": "תקנה 2", "url": SVC_COURT,
                  "note_he": "בלי טענות ובלי עובדות על הסכסוך או על הסמכות (סעיף 3(א)); מציינים שפה אם לא דוברים עברית"},
            "2": {"he": "טופס 2: הזמנה לפגישת המהו\"ת הראשונה", "section": "תקנה 3(א)", "url": SVC_COURT},
            "3": {"he": "טופס 3: הודעת הצדדים על המשך ההליך, על הסכם או על אי-הסכמה", "section": "תקנה 8", "url": SVC_RBC},
            "4": {"he": "טופס 4: הודעה נלווית לתביעה שמוגשת אחרי העיכוב", "section": "תקנה 9", "url": SVC_COURT},
            "5": {"he": "טופס 5: בקשה לסעד זמני (שמירת המצב הקיים, עיכוב יציאה, עיקול)", "section": "תקנה 10", "url": SVC_FORM5},
            "6": {"he": "טופס 6: בקשה לסעד דחוף", "section": "תקנה 12", "url": SVC_FORM6},
            "7": {"he": "טופס 7: בקשה לקצר או להאריך את תקופת עיכוב ההליכים", "section": "תקנה 16(ד)", "url": SVC_FORM7},
        },
        # Where and how to file (regulation 2: by local jurisdiction; the two official service pages).
        "filing": {
            "local_he": "מגישים לפי כללי הסמכות המקומית של הערכאה", "local_section": "תקנה 2",
            "family": {
                "name_he": "בית המשפט לענייני משפחה",
                "unit_he": "יחידת הסיוע שליד בית המשפט לענייני משפחה",
                "url": SVC_COURT, "updated": "2026-10-15",
                "channels": [
                    "במזכירות בית המשפט, בכל בית משפט במחוז, ומשלמים את האגרה בעת ההגשה",
                    "בדואר רשום לבית המשפט לפי הסמכות המקומית, עם קבלה על האגרה המדויקת",
                    "באתר נט המשפט: רק עורכי דין",
                    "לא בפקס",
                ],
                "net_url": NET,
                "exempt_he": "פטור מאגרה בגלל חוסר יכולת: בקשה עם תצהיר; קבלת הבטחת הכנסה היא ראיה לכאורה", "exempt_section": "תקנה 9 לתקנות האגרות", "exempt_url": SVC_EXEMPT,
                "fee_regulation_url": FAMILY_FEES,
            },
            "rabbinical": {
                "name_he": "בית הדין הרבני",
                "unit_he": "יחידת הסיוע שליד בית הדין הרבני",
                "url": SVC_RBC, "updated": "2025-12-10",
                "channels": [
                    "בטופס מקוון באתר בתי הדין הרבניים, אחרי טופס הסכמה לקבל כתבי בית דין באופן אלקטרוני",
                    "בדואר אלקטרוני לבית הדין, בטופס הידני",
                    "במזכירות בית הדין",
                ],
                "attach_he": "צילום תעודת זהות עם הספח, ואישור תשלום האגרה",
                "pay_url": RBC_PAY,
                "phone_he": "מרכז המידע של בתי הדין הרבניים: 5889*",
                "exempt_he": "אפשר לבקש הנחה או דחייה של האגרה; מי שמיוצג בסיוע המשפטי פטור", "exempt_section": "דף השירות של בתי הדין הרבניים",
                "no_refund_he": "על אגרת הבקשה ליישוב סכסוך אין הקטנה כשההליך נגמר מוקדם", "no_refund_section": "תקנה 12(ב) לתקנות הדיינים (אגרות)",
                "fee_regulation_url": RABBINICAL_FEES,
            },
            "guide_url": MAHUT_GUIDE,
            "approve_url": SVC_APPROVE,
        },
        "pause": {
            "he": "בספירת הימים של החוק לא נספרים שני ימי ראש השנה, יום הכיפורים, י\"ד עד כ\"ב בתשרי וי\"ד עד כ\"א בניסן; ב-15 הימים להגשת תביעה הם נספרים, אלא אם היום האחרון נופל בהם",
            "section": "סעיף 6א(א)(1) ו-(ג)",
            "sharia_he": "בבתי הדין השרעיים לא נספרים ימי עיד אל-פיטר ועיד אל-אדחא (סעיף 6א(א)(2)); הכלי לא מחשב אותם",
        },
        # The request fees, as divorce_cost holds them on checked_on (the engine reads divorce_cost; a test compares).
        "fee_check": {"family_request": 120, "family_item": "פרט 13", "family_current_to": "2026-07-01",
                      "rabbinical_request": 119, "rabbinical_item": "פרט 19(טז)", "rabbinical_current_to": "2026-01-22"},
    }
