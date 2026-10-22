"""The malpractice limitation clock (shaon-refui) on /medical-malpractice-statute-of-limitations/: the medical-malpractice
wave (22.10.2026, HAD-594). Discovered by tools/justice_tools_malpractice.py (glob), built with --malpractice-checked-on.

What this file adds, and what it does NOT repeat: the 7 years (Limitation Law s.5(1)), the age of 18 (s.10), the war window of
s.15A(a) (7.10.2023-6.4.2024), the rest-day rule (Interpretation Law s.10(c)) and the listed Independence days stay in
reg.car_accident.limitation and are read from there. The sections the injured person's clock already holds stay in
reg.injury_sheon and are read from there: Limitation Law s.6 (the start), s.7 (misconduct), s.8 (late discovery of the
facts), s.9 (admission), s.11 (mental or intellectual impairment), s.16 (the one-year floor after a stay), s.19, s.27, s.15A(c)-(e);
Civil Wrongs Ordinance s.89 and the 10 years of s.89(2), s.78 (dependants); the Insurance Contract Law s.31 (3 / 5 years) and
s.31A(b) (the insurer's warnings); the Patient's Rights Law s.18(a) (a copy of the record).

Here: what malpractice adds to the clock. Limitation Law s.5 (the period is of a claim "on which no action was filed": filing
stops the clock), s.14 (abroad), s.15 (an action dismissed so a new one can be filed: the time it was pending is not counted),
the two-year floor of s.16 after a stay under s.11, s.18 (a right passed by inheritance: not less than one year from the day
it passed), s.28 (the law binds the State: a state hospital too), the publication day of Amendment 8 (Sefer HaChukim 3151,
25.1.2024), which divides s.15A(a) from s.15A(c)-(d); Civil Wrongs Ordinance s.19 (the estate's claim survives), s.79 (who
files for the dependants, and the six months), s.89(1), the commencement of the New Version (1.10.1968); the Supreme Court
rulings the clock describes in words (each read in full on supremedecisions.court.gov.il on checked_on: file number, date,
the point, settled or open); the Ministry of Health tracks that run beside the court clock and the fact that no text read
sets a deadline for them (National Health Insurance Law ss.43-46, Patient's Rights Law ss.21 and 25, the Physicians
Ordinance s.41, the Ministry's services on gov.il); the 2004 government bill that proposed an outer limit for medical
treatment and was never enacted.

A ruling is described in words with its file number, never turned into a number the tool computes. Nothing here is
estimated; a figure the sources do not hold is not in the file.
"""
from __future__ import annotations

KEY = "malpractice_hityashnut"

LIMITATION_LAW = "https://www.nevo.co.il/law_html/law00/71809.htm"   # חוק ההתיישנות, התשי"ח-1958 (נוסח ל-21.7.2026)
TORTS = "https://www.nevo.co.il/law_html/law00/73015.htm"            # פקודת הנזיקין [נוסח חדש] (נוסח ל-18.9.2023)
PATIENT = "https://www.nevo.co.il/law_html/law00/71833.htm"          # חוק זכויות החולה, התשנ"ו-1996 (נוסח ל-6.4.2025)
PHYSICIANS = "https://www.nevo.co.il/law_html/law00/4803.htm"        # פקודת הרופאים [נוסח חדש], התשל"ז-1976
NHI_LAW = "https://www.btl.gov.il/Laws1/00_0003_000000.pdf"          # חוק ביטוח בריאות ממלכתי, התשנ"ד-1994 (נוסח המוסד לביטוח לאומי)
AMENDMENT_8 = "https://fs.knesset.gov.il/25/law/25_lsr_4019628.pdf"  # ספר החוקים 3151, 25.1.2024, עמ' 492
BILL_2004 = "https://fs.knesset.gov.il//16/law/16_ls1_517536.PDF"    # הצעת חוק ההתיישנות, התשס"ד-2004 (ה"ח הממשלה 125)
GOV_PROFESSIONS = "https://www.gov.il/he/service/public_ombudsman_for_medical_professions"
GOV_NHI_COMMISSIONER = "https://www.gov.il/he/service/national-health-insurance-law-complaint-submission"
GOV_INQUIRY_BOOKLET = ("https://www.gov.il/BlobFolder/reports/quality-national-prog-testing-board/he/"
                       "files_publications_units_quality_assurance_division_Quality_National_Prog_Testing_Board.pdf")
COURT = "https://supremedecisions.court.gov.il/Home/Download?path="


def _ruling(path: str) -> str:
    return COURT + path + "&type=2"


def build(checked_on: str) -> dict:
    """The malpractice limitation clock: the safe last day, the dates that depend on a condition, and the tracks beside it."""
    return {
        "name_he": "שעון ההתיישנות ברשלנות רפואית: היום הבטוח, המועדים המותנים והמסלולים שלצדו",
        "publisher_he": "חוק ההתיישנות, פקודת הנזיקין, חוק זכויות החולה, חוק ביטוח בריאות ממלכתי, פקודת הרופאים, "
                        "בית המשפט העליון ומשרד הבריאות",
        "source_name": "חוק ההתיישנות, התשי\"ח-1958 (נוסח עדכני)",
        "source_url": LIMITATION_LAW,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "page": "/medical-malpractice-statute-of-limitations/",
        # Limitation Law 1958: what reg.car_accident and reg.injury_sheon do not hold.
        "limitation": {
            "he": "חוק ההתיישנות, התשי\"ח-1958",
            "url": LIMITATION_LAW,
            "current_to": "2026-07-21",
            "filed_section": "סעיף 5",
            "filed_he": "תקופת ההתיישנות היא של תביעה שלא הוגשה עליה תובענה: הגשת התביעה לבית המשפט עוצרת את השעון; "
                        "פנייה לעורך דין, תלונה או בקשת רשומה לא עוצרות אותו",
            "dismissed_section": "סעיף 15",
            "dismissed_he": "תובענה שנדחתה כך שאפשר להגיש תובענה חדשה על אותה עילה: הזמן שבין הגשתה לדחייתה לא נספר",
            "after_dismissal_years": 1,
            "after_stay_section": "סעיף 16",
            "incapacity_floor_years": 2,
            "incapacity_floor_he": "אחרי עיכוב בגלל ליקוי נפשי או שכלי (סעיף 11), התקופה לא מסתיימת לפני שעברו לפחות שנתיים מהיום שבו חדל העיכוב",
            "inheritance_section": "סעיף 18",
            "inheritance_years": 1,
            "inheritance_he": "זכות שעברה בירושה: תקופת ההתיישנות לא מסתיימת לפני שעברה לפחות שנה מהיום שבו עברה הזכות",
            "abroad_section": "סעיף 14",
            "abroad_he": "לא נספר הזמן שבו בעל דין היה במדינה שבגלל התנאים שם או היחסים שלה עם ישראל לא אפשר היה לקיים בירור משפטי",
            "state_section": "סעיף 28",
            "state_he": "החוק חל גם על המדינה: תביעה נגד בית חולים ממשלתי מתיישנת באותם כללים",
            "war_published": "2024-01-25",
            "war_eve": "2024-01-24",
            "war_published_he": "חוק ההתיישנות (תיקון מס' 8 – חרבות ברזל), התשפ\"ד-2024, ספר החוקים 3151, עמ' 492, פורסם ב-25.1.2024, בלי יום תחילה אחר",
            "war_published_url": AMENDMENT_8,
            "war_applies_he": "העיכוב חל על כל תביעה אזרחית שאינה מקרקעין שתקופתה לא הסתיימה ערב התיקון, וגם על תקופה שנקבעה בחוק אחר "
                              "(סעיף 15א(ה)), חוץ משבע הוראות שהסעיף מונה, ואף אחת מהן אינה של רשלנות רפואית",
        },
        # Civil Wrongs Ordinance [New Version]: the sections the malpractice clock adds to reg.injury_sheon.torts.
        "torts": {
            "he": "פקודת הנזיקין [נוסח חדש]",
            "url": TORTS,
            "current_to": "2023-09-18",
            "from": "1968-10-01",
            "from_section": "סעיף 93",
            "act_section": "סעיף 89(1)",
            "damage_section": "סעיף 89(2)",
            "negligence_section": "סעיף 35",
            "estate_section": "סעיף 19(א)",
            "estate_he": "במות אדם, עילות התביעה בשל עוולה שעמדו לו ממשיכות לעמוד לטובת העיזבון",
            "dependants_section": "סעיף 78",
            "dependants_he": "עוולה שגרמה למות אדם, ואותו אדם היה זכאי אותה שעה לפיצויים אילו לא מת: בן הזוג, ההורה והילד זכאים לפיצויים מהאחראי",
            "who_files_section": "סעיף 79",
            "who_files_months": 6,
            "who_files_he": "את תביעת התלויים מגישים מבצע הצוואה, מנהל העיזבון או היורשים לטובת בן הזוג, ההורה והילד; אם לא הוגשה בתוך 6 חודשים מהמוות, כל אחד מהם רשאי להגיש בשם כולם",
        },
        # Supreme Court rulings, each read in full on the court's site on checked_on. Words only, never a computed number.
        "case_law": [
            {"code": "s8_vs_89", "file": "רע\"א 901/07", "name_he": "מדינת ישראל – הוועדה לאנרגיה אטומית נ' גיא-ליפל", "date": "2010-09-19",
             "status": "settled", "url": _ruling("HebrewVerdicts/07/010/009/e04&fileName=07009010_e04.txt"),
             "point_he": "סעיף 89(2) לפקודה עוסק רק בגילוי מאוחר של הנזק עצמו, ורק לו יש תקרה של 10 שנים; גילוי מאוחר של שאר העובדות (הרשלנות, הקשר לטיפול) נבחן לפי סעיף 8, בלי תקרה; בשני הסעיפים המבחן אובייקטיבי והנטל על מי שטוען לגילוי מאוחר"},
            {"code": "s8_vs_89_origin", "file": "ע\"א 1254/99", "name_he": "המאירי נ' הכשרת הישוב", "date": "2000-06-07",
             "status": "settled", "url": _ruling("HebrewVerdicts/99/540/012/W02&fileName=99012540_W02.txt"),
             "point_he": "סעיף 89(2) דוחק את סעיף 8 רק לגבי רכיב הנזק; שאר כללי חוק ההתיישנות ממשיכים לחול לצדו"},
            {"code": "no_cap_link", "file": "ע\"א 4275/10", "name_he": "מולהי נ' משרד הבריאות", "date": "2012-02-22",
             "status": "settled", "url": _ruling("HebrewVerdicts/10/750/042/v11&fileName=10042750_v11.txt"),
             "point_he": "בגילוי מאוחר של הרשלנות או של הקשר הסיבתי אין מגבלה של 10 שנים: התקרה של סעיף 89(2) חלה רק על גילוי הנזק"},
            {"code": "objective", "file": "רע\"א 1101/20", "name_he": "שירותי בריאות כללית נ' פלוני", "date": "2020-05-21",
             "status": "settled", "url": _ruling("HebrewVerdicts/20/010/011/r04&fileName=20011010.R04"),
             "point_he": "גילוי מאוחר לפי סעיף 8 דורש שני תנאים: שהתובע לא ידע, ושגם בזהירות סבירה לא יכול היה לדעת; מה שאפשר היה לברר נחשב ידוע, ו\"קצה חוט\" ראשון כבר מתחיל את המרוץ"},
            {"code": "expert", "file": "ע\"א 1969/10", "name_he": "אבו שיבלי נ' מרכז רפואי זיו", "date": "2012-05-09",
             "status": "settled", "url": _ruling("HebrewVerdicts/10/690/019/z06&fileName=10019690_z06.txt"),
             "point_he": "התובע לא קובע את תחילת המרוץ לפי היום שבו בחר לפנות למומחה: המועד הוא היום שבו אפשר היה לגלות"},
            {"code": "minor_25", "file": "רע\"א 4288/15", "name_he": "מכבי שירותי בריאות נ' פלוני", "date": "2016-08-28",
             "status": "settled", "url": _ruling("HebrewVerdicts/15/880/042/z06&fileName=15042880_z06.txt"),
             "point_he": "תביעת קטין מתיישנת לכל המוקדם בגיל 25, גם כשהעילה נולדה ביום הלידה; תביעת ההורים על נזקם שלהם (הולדה בעוולה) מתיישנת 7 שנים מהלידה"},
            {"code": "minor_cap", "file": "ע\"א 2805/13", "name_he": "פלונית נ' משרד העבודה והרווחה", "date": "2015-04-16",
             "status": "open", "url": _ruling("HebrewVerdicts/13/050/028/w08&fileName=13028050_w08.txt"),
             "point_he": "מחסום עשר השנים של סעיף 89(2) תופס רק כשהנזק הוא היסוד היחיד שנעלם מהתובע (פסקאות 22-23); אם עשר השנים נעצרות בזמן הקטינות לא הוכרע שם, ולא נמצא פסק דין של בית המשפט העליון שמכריע בכך"},
            {"code": "estate_minor", "file": "ע\"א 9154/09 וע\"א 1945/09", "name_he": "עיזבון קטינים שנפטרו", "date": "2012-01-19",
             "status": "settled", "url": _ruling("HebrewVerdicts/09/540/091/p05&fileName=09091540_p05.txt"),
             "point_he": "עיכוב הקטינות של סעיף 10 לא עובר ליורשים הבגירים של ילד שנפטר; השופט הנדל (והשופט מלצר הצטרף להערותיו) הציע שהיורשים יקבלו את התקופה שנותרה לילד, עד 7 שנים מהפטירה ולא פחות משנה"},
            {"code": "dependants", "file": "רע\"א 901/07", "name_he": "גיא-ליפל, תביעות התלויים", "date": "2010-09-19",
             "status": "open", "url": _ruling("HebrewVerdicts/07/010/009/e04&fileName=07009010_e04.txt"),
             "point_he": "אם תביעת התלויים קיימת כשתביעת המנוח עצמו התיישנה לפני מותו: פסק דין ישן (ע\"א 506/82 זונטג, כפי שצוטט שם) אמר שכן, השופט עמית העיר שלא, והשופטת חיות חלקה; השאלה פתוחה"},
            {"code": "death_known", "file": "ע\"א 9788/07", "name_he": "מרמש נ' הדסה", "date": "2010-05-30",
             "status": "settled", "url": _ruling("HebrewVerdicts/07/880/097/h06&fileName=07097880_h06.txt"),
             "point_he": "בתביעה על מוות בבית חולים, גילוי מאוחר של יסוד הרשלנות נבחן לפי סעיף 8 (דעת הרוב)"},
        ],
        # The open questions the clock answers with the safe (earliest) date first.
        "open": {
            "minor_cap_he": "אם עשר השנים של סעיף 89(2) נעצרות בזמן הקטינות: לא הוכרע בבית המשפט העליון. הכלי מציג קודם את הקריאה המחמירה (התקרה רצה מיום הנזק), ולצדה את הקריאה המקילה (התקרה נמנית מגיל 18)",
            "dependants_he": "אם לתלויים יש תביעה כשתביעת המנוח התיישנה לפני מותו: שאלה פתוחה. הכלי מציג את המועד שלהם ומסמן את הספק",
            "estate_minor_he": "כמה זמן יש ליורשים של ילד שנפטר: ההלכה היא שעיכוב הקטינות לא עובר אליהם; הכלי מציג קודם את הקריאה המחמירה (שבע שנים מיום הנזק, ולא פחות משנה מהפטירה), ולצדה את הצעת השופט הנדל (שבע שנים מהפטירה)",
        },
        # The tracks beside the court clock. No text read sets a deadline for any of them, and none stops the court clock.
        "tracks": [
            {"code": "professions", "he": "תלונה לנציבות קבילות הציבור למקצועות רפואיים (חשש לרשלנות, אי מקצועיות, התנהגות לא ראויה של צוות)",
             "who_he": "משרד הבריאות", "section": "", "url": GOV_PROFESSIONS,
             "deadline_he": "בדף השירות לא נקבע מועד להגשה"},
            {"code": "nhi", "he": "קבילה לנציב לפי חוק ביטוח בריאות ממלכתי (זכאות לשירותים, תרופות, בדיקות מקופת החולים; לא רשלנות)",
             "who_he": "משרד הבריאות", "section": "סעיפים 43-46 לחוק ביטוח בריאות ממלכתי", "url": GOV_NHI_COMMISSIONER, "law_url": NHI_LAW,
             "deadline_he": "בחוק ובדף השירות לא נקבע מועד; לפי הדף, תלונות על רשלנות מטופלות בנציבות למקצועות רפואיים"},
            {"code": "officer", "he": "פנייה לאחראי על זכויות המטופלים במוסד הרפואי", "who_he": "בית החולים או קופת החולים",
             "section": "סעיף 25 לחוק זכויות החולה", "url": PATIENT, "deadline_he": "בחוק לא נקבע מועד"},
            {"code": "inquiry", "he": "ועדת בדיקה לתלונה או לאירוע חריג: ממצאיה ומסקנותיה נמסרים גם למטופל (סעיף 21(ב)); הפרוטוקול רק בצו בית משפט (סעיף 21(ד))",
             "who_he": "מנהל המוסד, מנהל קופת החולים או המנהל הכללי של משרד הבריאות", "section": "סעיף 21 לחוק זכויות החולה", "url": PATIENT,
             "booklet_url": GOV_INQUIRY_BOOKLET, "deadline_he": "בחוק ובחוברת משרד הבריאות על ועדות בדיקה לא נקבע מועד לבקשה"},
            {"code": "discipline", "he": "קובלנה משמעתית נגד רופא: על יסוד קובלנה של המנהל או של מי שנפגע", "who_he": "שר הבריאות",
             "section": "סעיף 41 לפקודת הרופאים", "url": PHYSICIANS, "deadline_he": "בפקודה לא נקבעה התיישנות לקובלנה"},
        ],
        "tracks_he": "אף אחד מהמסלולים האלה לא עוצר את שעון ההתיישנות של התביעה: רק הגשת תובענה לבית המשפט עוצרת אותו (סעיף 5 לחוק ההתיישנות)",
        # A proposal that never became law (shown only in the "what changed" table, marked as such).
        "bill_2004": {
            "he": "הצעת חוק ההתיישנות, התשס\"ד-2004 (הצעות חוק הממשלה 125)",
            "url": BILL_2004,
            "medical_years": 18,
            "medical_minor_years": 22,
            "what_he": "הוצע להחליף את סעיף 89(2) ב\"תקופת תקרה\": בתביעה שנושאה טיפול רפואי 18 שנים מיום המעשה, ו-22 שנים אם התובע היה אז קטין",
            "status_he": "לא נחקק; הדין היום הוא סעיף 89(2) וסעיף 8",
        },
    }
