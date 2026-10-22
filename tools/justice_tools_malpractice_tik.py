"""The medical-malpractice case check (tik-rashlanut) on /what-is-medical-malpractice-definition-examples/: the
medical-malpractice wave (22.10.2026, HAD-594). Discovered by tools/justice_tools_malpractice.py (glob), built with
--malpractice-checked-on.

What this file holds: the elements of the tort of negligence and the damage it needs (Civil Wrongs Ordinance ss.2, 35, 36),
the rule that moves the burden to the defendant (s.41, "the thing speaks for itself"), the estate and the dependants (ss.19,
78), the informed-consent duty (Patients' Rights Law ss.13-15 and the First Schedule), the medical record (s.17) and the
right to a copy (s.18), the inquiry committee and the quality committee (ss.21-23) and the patients' rights officer (s.25),
the expert-opinion rule of the Civil Procedure Regulations 2018 (regs. 87-88, 91-93), the disciplinary route of the
Physicians Ordinance (ss.41, 44), the Ministry of Health complaint services, and the case law the tool names in words, each
with its file number and the official text that names it. The 7-year limitation, the age of 18 and the war window stay in
reg.car_accident.limitation and are read from there (never repeated here).

Every value was read on checked_on from the official text named next to it (Nevo's consolidated texts, gov.il, the State
Comptroller's report). Nothing here is estimated, and the tool computes no number from a court ruling: the rulings are
described in words with their file numbers. The evidence lists and the expert fields are practical advice and are marked so.
"""
from __future__ import annotations

KEY = "malpractice_tik"

TORTS = "https://www.nevo.co.il/law_html/law00/73015.htm"       # פקודת הנזיקין [נוסח חדש] (נוסח ל-18.9.2023)
PATIENT = "https://www.nevo.co.il/law_html/law00/71833.htm"     # חוק זכויות החולה, התשנ"ו-1996 (נוסח ל-6.4.2025)
CIVPRO = "https://www.nevo.co.il/law_html/law00/157751.htm"     # תקנות סדר הדין האזרחי, התשע"ט-2018 (נוסח ל-19.10.2026)
PHYSICIANS = "https://www.nevo.co.il/law_html/law00/4803.htm"   # פקודת הרופאים [נוסח חדש], התשל"ז-1976 (נוסח ל-7.8.2025)
COMPLAINT = "https://www.gov.il/he/service/public_ombudsman_for_medical_professions"   # משרד הבריאות, עודכן 26.4.2026
NHI_COMPLAINT = "https://www.gov.il/he/service/national-health-insurance-law-complaint-submission"  # עודכן 9.4.2026
NHI_AUTHORITY = "https://www.gov.il/he/departments/general/public-complaints-commission-authority"  # פורסם 30.5.2021
COMPTROLLER = "https://library.mevaker.gov.il/sites/DigitalLibrary/Documents/2012-62-208-Beriut.pdf"  # דוח שנתי 62, עמ' 217
SUPREME = "https://supremedecisions.court.gov.il/"
CLOCK_PAGE = "/medical-malpractice-statute-of-limitations/"
RECORDS_PAGE = "/obtaining-medical-records-copy/"
COST_PAGE = "/medical-malpractice-cost/"


def build(checked_on: str) -> dict:
    """The case check: the five elements, what proves each, who carries the burden, the expert rule and the parallel tracks."""
    return {
        "name_he": "בדיקת תיק רשלנות רפואית: חמשת היסודות, מה מוכיח כל אחד ומה חסר",
        "publisher_he": "פקודת הנזיקין, חוק זכויות החולה, תקנות סדר הדין האזרחי, פקודת הרופאים, משרד הבריאות ומבקר המדינה",
        "source_name": "פקודת הנזיקין [נוסח חדש] (נוסח עדכני)",
        "source_url": TORTS,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        # Civil Wrongs Ordinance [New Version]: the tort of negligence, the damage, the burden of s.41, the estate, the dependants.
        "torts": {
            "he": "פקודת הנזיקין [נוסח חדש]",
            "url": TORTS,
            "current_to": "2023-09-18",
            "negligence_section": "סעיף 35",
            "negligence_he": "התרשלות היא מעשה או מחדל שאדם סביר ונבון לא היה עושה, או אי-שימוש במיומנות ובזהירות שאדם סביר ונבון וכשיר לפעול באותו משלח יד היה נוקט באותן נסיבות; מי שגורם ברשלנותו נזק לזולתו עושה עוולה",
            "duty_section": "סעיף 36",
            "duty_he": "חובת הזהירות מוטלת כלפי כל אדם שאדם סביר היה צריך לראות מראש שהוא עלול להיפגע מהמעשה או מהמחדל",
            "damage_section": "סעיף 2",
            "damage_he": "נזק הוא אבדן חיים, אבדן נכס, נוחות, רווחה גופנית או שם טוב, או חיסור מהם",
            "res_ipsa_section": "סעיף 41",
            "res_ipsa_he": "הדבר מעיד על עצמו: כשמתקיימים שלושה תנאים, על הנתבע להוכיח שלא התרשל",
            "res_ipsa_conditions_he": [
                "לתובע לא הייתה ידיעה או יכולת לדעת מה היו הנסיבות שגרמו לנזק",
                "הנזק נגרם על ידי נכס שלנתבע הייתה שליטה מלאה עליו",
                "האירוע מתיישב יותר עם המסקנה שהנתבע לא נקט זהירות סבירה מאשר עם המסקנה שנקט",
            ],
            "estate_section": "סעיף 19(א)",
            "estate_he": "כשאדם נפטר, עילות התביעה בשל עוולה שעמדו לו ממשיכות לעמוד לטובת עזבונו",
            "dependants_section": "סעיף 78",
            "dependants_he": "עוולה שגרמה למותו של אדם: בן הזוג, ההורה והילד זכאים לפיצויים מהאחראי",
            "contributory_section": "סעיף 68(א)",
            "contributory_he": "נזק שנגרם מקצתו באשם הניזוק: הפיצויים מופחתים לפי מידת אחריותו",
            "late_section": "סעיף 89(2)",
            "late_he": "נזק שלא התגלה ביום שאירע: ההתיישנות נמנית מיום הגילוי, אבל התביעה מתיישנת אם לא הוגשה תוך עשר שנים מיום אירוע הנזק",
        },
        # Patients' Rights Law 1996: informed consent, the record, the inquiry and quality committees, the rights officer.
        "patient": {
            "he": "חוק זכויות החולה, התשנ\"ו-1996",
            "url": PATIENT,
            "current_to": "2025-04-06",
            "carer_section": "סעיף 2",
            "carer_he": "מטפל הוא, בין השאר, רופא, רופא שיניים, אח או אחות, מיילדת, פסיכולוג ופיזיותרפיסט; טיפול רפואי כולל גם אבחון, טיפול מונע וטיפול סיעודי",
            "consent_section": "סעיף 13",
            "consent_he": "לא נותנים טיפול רפואי בלי הסכמה מדעת של המטופל; לשם כך המטפל מוסר את המידע הרפואי הדרוש, באורח סביר, בשלב מוקדם ככל האפשר",
            "consent_items_he": [
                "האבחנה והסיכויים (הפרוגנוזה) של המצב הרפואי",
                "מהות הטיפול המוצע, ההליך, המטרה, התועלת הצפויה והסיכויים",
                "הסיכונים, כולל תופעות לוואי, כאב ואי נוחות",
                "הסיכויים והסיכונים של טיפולים חלופיים או של העדר טיפול",
                "שהטיפול חדשני, אם הוא כזה",
            ],
            "form_section": "סעיף 14",
            "form_he": "הסכמה מדעת יכולה להיות בכתב, בעל פה או בהתנהגות",
            "written_section": "סעיף 14(ב)",
            "written_he": "לטיפול שבתוספת הראשונה ההסכמה ניתנת במסמך בכתב שכולל את תמצית ההסבר",
            "schedule_he": "ניתוחים (חוץ מכירורגיה זעירה), צינתורים של כלי דם, דיאליזה, הקרנות, הפריה חוץ-גופית וכימותרפיה",
            "schedule_section": "התוספת הראשונה",
            "emergency_section": "סעיף 15(3)",
            "emergency_he": "במצב חירום רפואי מותר לתת טיפול דחוף בלי הסכמה מדעת אם בגלל נסיבות החירום אי אפשר לקבל אותה; טיפול שבתוספת הראשונה בהסכמת שלושה רופאים, אלא אם הנסיבות לא מאפשרות",
            "record_section": "סעיף 17(א)",
            "record_he": "המטפל מתעד את מהלך הטיפול ברשומה רפואית: הטיפול שניתן, העבר הרפואי, האבחון והוראות הטיפול",
            "keeper_section": "סעיף 17(ב)",
            "keeper_he": "המטפל, ובמוסד רפואי מנהל המוסד, אחראים לניהול השוטף של הרשומה ולשמירתה לפי כל דין",
            "access_section": "סעיף 18(א)",
            "access_he": "מטופל זכאי לקבל מהמטפל או מהמוסד מידע רפואי מהרשומה הרפואית שלו, לרבות העתק",
            "inquiry_section": "סעיף 21",
            "inquiry_he": "ועדת בדיקה בודקת תלונה של מטופל או אירוע חריג; ממנים אותה מנהל המוסד, מנהל קופת החולים או המנהל הכללי של משרד הבריאות או מי שהסמיך (21(א))",
            "inquiry_findings_section": "סעיף 21(ב)-(ד)",
            "inquiry_findings_he": "הממצאים והמסקנות נמסרים למטופל; הפרוטוקול נמסר רק למי שמינה את הוועדה ולמנהל הכללי, אלא אם בית משפט הורה למסור אותו",
            "quality_section": "סעיף 22",
            "quality_he": "החומר של ועדת בקרה ואיכות חסוי ולא משמש ראיה, אבל ממצאים עובדתיים על מצב המטופל, הטיפול ותוצאותיו נרשמים ברשומה הרפואית (22(ה))",
            "objection_section": "סעיף 23",
            "objection_he": "מטופל שסבור שממצאים עובדתיים לא נרשמו ברשומה רשאי להגיש השגה לוועדת אתיקה",
            "officer_section": "סעיף 25",
            "officer_he": "בכל מוסד רפואי יש אחראי לזכויות המטופל שמקבל תלונות; תלונה על איכות הטיפול עוברת למנהל המוסד",
        },
        # Civil Procedure Regulations 2018, chapter 14 (experts).
        "procedure": {
            "he": "תקנות סדר הדין האזרחי, התשע\"ט-2018",
            "url": CIVPRO,
            "current_to": "2026-10-19",
            "expert_section": "תקנה 87(א)",
            "expert_he": "מי שרוצה להוכיח עניין שברפואה מצרף לכתב הטענות שלו חוות דעת של מומחה בתחום מומחיותו",
            "exam_section": "תקנה 87(ב)",
            "exam_he": "תובע שהגיש חוות דעת רפואית נבדק, לדרישת הנתבע, אצל מומחה מטעם הנתבע",
            "counter_section": "תקנה 87(ג)",
            "counter_days": 60,
            "counter_he": "חוות דעת נגדית לחוות הדעת הרפואית של הנתבע: בתוך 60 ימים מהיום שהומצאה, או במועד אחר שבית המשפט הורה",
            "exempt_section": "תקנה 87(ד)",
            "exempt_he": "בית המשפט רשאי לפטור מצירוף חוות הדעת או לדחות את מועד הגשתה; מבקשים את זה לכל המאוחר עם כתב התביעה",
            "sanction_section": "תקנה 93(א)",
            "sanction_he": "מי שלא צירף חוות דעת רפואית ולא קיבל פטור לא יכול להביא עדות של מומחה רפואי מטעמו, אלא מטעמים מיוחדים",
            "court_expert_section": "תקנה 88(א)",
            "court_expert_he": "בית המשפט רשאי בכל עת למנות מומחה מטעמו",
            "agreed_section": "תקנה 88(ד)",
            "agreed_he": "מומחה שמונה בהסכמה: חוות הדעת של הצדדים לא מוגשות, ואלה שהוגשו נחשבות כאילו לא התקבלו כראיה, אלא אם בית המשפט הורה אחרת",
            "questions_section": "תקנה 91(ג)",
            "questions_days": 14,
            "questions_he": "שאלות הבהרה למומחה בית המשפט: בקשת רשות לא יאוחר מ-14 ימים מקבלת חוות הדעת",
            "fees_section": "תקנה 92(א)",
            "fees_he": "בית המשפט קובע את שכרו של המומחה מטעמו ומי משלם אותו",
        },
        # Physicians Ordinance [New Version] 1976: the disciplinary route.
        "discipline": {
            "he": "פקודת הרופאים [נוסח חדש], התשל\"ז-1976",
            "url": PHYSICIANS,
            "current_to": "2025-08-07",
            "section": "סעיף 41",
            "he_rule": "על יסוד קובלנה של המנהל או של אדם שנפגע, השר רשאי לבטל רישיון של רופא, להתלות אותו, או לתת נזיפה או התראה",
            "grounds_he": "בין העילות: חוסר יכולת או רשלנות חמורה (41(3)), והפרת הוראה של חוק זכויות החולה (41(7))",
            "hearing_section": "סעיף 44(א)",
            "hearing_he": "לפני צו כזה הרופא מקבל הזדמנות להתגונן לפני ועדה",
            "no_money_he": "ההליך המשמעתי לא פוסק פיצויים",
            # Patients' Rights Law s.34 added the same ground (a breach of the law) to s.45 of the Dentists Ordinance.
            "dentist_he": "פקודת רופאי השיניים [נוסח חדש], התשל\"ט-1979",
            "dentist_section": "סעיף 45",
            "dentist_basis": "סעיף 34 לחוק זכויות החולה הוסיף לסעיף 45 שלה את העילה של הפרת חוק זכויות החולה",
        },
        # What changed and when: only dates an official text states.
        "changes": [
            {"from": "1996", "he": "חוק זכויות החולה: חובת ההסכמה מדעת (סעיפים 13-15), חובת הרשומה (סעיף 17) והזכות לעותק (סעיף 18); "
                                   "הפרת החוק נוספה לעילות המשמעת של רופאים ורופאי שיניים (סעיפים 33-34)", "source": "חוק זכויות החולה, התשנ\"ו-1996", "url": PATIENT},
            {"from": "2021-01-01", "he": "תקנות סדר הדין האזרחי החדשות נכנסו לתוקף: חוות דעת רפואית מצורפת לכתב התביעה (תקנה 87(א)), ומי שלא צירף ולא קיבל פטור לא מביא מומחה רפואי (תקנה 93(א))",
             "source": "תקנה 180(ג) לתקנות סדר הדין האזרחי, התשע\"ט-2018", "url": CIVPRO},
        ],
        # Ministry of Health complaint services (gov.il), read on checked_on.
        "tracks": {
            "complaint_url": COMPLAINT,
            "complaint_updated": "2026-04-26",
            "complaint_he": "תלונה לנציבות קבילות הציבור למקצועות רפואיים במשרד הבריאות: על חשש לרשלנות, לאי-מקצועיות או להתנהגות לא ראויה של בעלי מקצוע רפואי; אפשר גם לערער על הטיפול בתלונה",
            "complaint_phone": "*5400",
            "nhi_url": NHI_COMPLAINT,
            "nhi_updated": "2026-04-09",
            "nhi_he": "קבילה לנציבות הקבילות לחוק ביטוח בריאות ממלכתי: על קופת החולים, כשלא נתנה שירות, בדיקה או תרופה שבסל; תלונות על רשלנות רפואית מטופלות בנציבות למקצועות רפואיים",
            "nhi_free_he": "השירות ניתן ללא עלות",
            "nhi_authority_url": NHI_AUTHORITY,
            "nhi_authority_published": "2021-05-30",
            "nhi_sections": "סעיפים 43 עד 46 לחוק ביטוח בריאות ממלכתי",
            "no_extension_he": "החלטות הנציב לא מאריכות מועד שנקבע בחוק: הגשת תלונה או בירורה לא מאריכים אותו",
        },
        # Case law, described in words only; each file number as the official text names it. No number is computed from them.
        "caselaw": {
            "court_url": SUPREME,
            "comptroller_url": COMPTROLLER,
            "comptroller_he": "מבקר המדינה, דוח שנתי 62 (2012), משרד הבריאות: תביעות רשלנות רפואית, עמ' 217",
            "evidentiary_he": "נזק ראייתי: כשאין רשומה רפואית על האירוע או שהרשומה לא מלאה, בתי המשפט מעבירים את נטל השכנוע למוסד הרפואי, להוכיח שלא התרשל",
            "evidentiary_file": "ע\"א 9328/02",
            "evidentiary_parties": "מאיר נ' לאור",
            "evidentiary_year": 2004,
            "autonomy_he": "פגיעה באוטונומיה: הפסיקה הכירה בעילה של פגיעה ביכולת של המטופל להחליט על הטיפול, למשל כשלא קיבל מידע על מצבו, גם בלי להוכיח שההסבר החסר גרם לנזק הגופני",
            "autonomy_files": ["ע\"א 2781/93", "ע\"א 9936/07"],
            "autonomy_parties": "דעקה נ' בית החולים כרמל חיפה; בן דוד נ' ענטבי",
            "outside_basket_he": "חובת ההסבר כוללת לפי הפסיקה גם בדיקות שאינן בסל ושאפשר לעשות באופן פרטי",
            "outside_basket_file": "ע\"א 4960/04",
            "chance_he": "האם אפשר לקבל פיצוי על פגיעה בסיכויי ההחלמה, כשהקשר בין הטיפול לנזק כולו לא מוכח לפי מאזן ההסתברויות, היא שאלה שבית המשפט העליון דן בה בדיון נוסף",
            "chance_file": "דנ\"א 4693/05",
            "chance_parties": "בית החולים כרמל נ' מלול",
            "chance_year": 2010,
        },
        # Practical advice (not law): the documents to gather by the kind of event, and the expert's field.
        "kinds": {
            "birth": {"he": "לידה", "expert_he": "מיילדות; לתינוק גם רפואת יילודים או נוירולוגיית ילדים",
                      "docs_he": ["רצועות הניטור העוברי המלאות", "הפרטוגרמה ויומן חדר הלידה", "ציוני אפגר וגזים מחבל הטבור", "תיק הפגייה והדמיות המוח של התינוק", "תיק מעקב ההיריון בקופה"]},
            "surgery": {"he": "ניתוח", "expert_he": "התחום הכירורגי של הניתוח",
                        "docs_he": ["דוח הניתוח", "גיליון ההרדמה", "רישומי ההתאוששות והסיעוד", "הדמיות לפני הניתוח ואחריו"]},
            "diagnosis": {"he": "אבחון מאוחר או שגוי", "expert_he": "התחום שהיה צריך לאבחן (למשל רפואת משפחה, דימות או אונקולוגיה)",
                          "docs_he": ["סיכומי הביקורים וההפניות", "תוצאות הבדיקות עם התאריכים", "ההדמיות עצמן והפענוחים", "תיק הקופה מאותה תקופה"]},
            "anesthesia": {"he": "הרדמה", "expert_he": "הרדמה",
                           "docs_he": ["ההערכה שלפני ההרדמה", "גיליון ההרדמה", "רישומי ההתאוששות", "טופס ההסכמה להרדמה"]},
            "medication": {"he": "תרופה", "expert_he": "התחום של הרופא שנתן או רשם את התרופה",
                           "docs_he": ["המרשמים", "גיליון מתן התרופות", "רישומי הסיעוד", "קבלה מבית המרקחת"]},
            "dental": {"he": "טיפול שיניים", "expert_he": "רפואת שיניים בתחום הטיפול",
                       "docs_he": ["הכרטיס הדנטלי", "צילומי הרנטגן והסי-טי", "תוכנית הטיפול והצעת המחיר", "טופס ההסכמה"]},
            "consent": {"he": "ההסבר לפני הטיפול", "expert_he": "התחום של הטיפול שניתן",
                        "docs_he": ["טופס ההסכמה ודף ההסבר", "סיכום השיחה לפני הטיפול, אם נכתב", "רשימה שלכם של מה שנאמר, מתי ומי נכח"]},
        },
        "common_docs_he": ["הרשומה הרפואית המלאה של הטיפול", "מכתב השחרור וסיכומי הביקור", "מסמכי הנזק: אישורי מחלה, קביעת נכות, קבלות ותלושי שכר", "יומן אישי: תאריכים, מה נאמר ומי נכח"],
        "pages": {"clock": CLOCK_PAGE, "records": RECORDS_PAGE, "cost": COST_PAGE},
    }
