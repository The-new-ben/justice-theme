"""The advance-notice dataset of the co.il tools registry (the labor wave, 22.10.2026): the notice instrument
(hodaa-mukdemet) on /notice-of-dismissal/. Discovered by tools/justice_tools_labor.py (glob), built with
--labor-checked-on.

What this file adds, and what it does NOT repeat: the notice tiers of ss.3-4 (6 / 6 + 2.5 a month / a month; 14 and 21
days for a wage worker), the end-of-work certificate days (14 / 7), the late-payment rule of the Wage Protection Law s.20
and the 7-year limitation stay in reg.severance and are read from there. The pregnancy months (6) and the 60 days after
the birth-and-parenting leave stay in reg.rights_leida.protect. Here: the sections of the Advance Notice Law the tool
cites, the Annual Leave Law rule on vacation inside a dismissal notice (s.5(a)(7)), the other protected periods of the
Women's Employment Law s.9 (fertility treatment, shelter, miscarriage, unpaid leave after the birth), the reserve-duty
protections of the Discharged Soldiers (Reinstatement) Law ss.41A and 41A2, the hearing page and the form-161 service.

Every value was read on checked_on from the official text named next to it (Nevo's consolidated texts and gov.il).
Nothing here is estimated; a figure the sources do not hold is not in the file.
"""
from __future__ import annotations

KEY = "labor_hodaa"

NOTICE_LAW = "https://www.nevo.co.il/law_html/law00/71704.htm"     # חוק הודעה מוקדמת לפיטורים ולהתפטרות, התשס"א-2001 (נוסח ל-18.9.2023)
LEAVE_LAW = "https://www.nevo.co.il/law_html/law00/71906.htm"      # חוק חופשה שנתית, התשי"א-1951 (נוסח ל-21.7.2026)
WOMEN_LAW = "https://www.nevo.co.il/law_html/law01/p176_001.htm"   # חוק עבודת נשים, התשי"ד-1954 (נוסח ל-1.6.2026)
SOLDIERS_LAW = "https://www.nevo.co.il/law_html/law00/71925.htm"   # חוק החיילים המשוחררים (החזרה לעבודה), התש"ט-1949 (נוסח ל-20.10.2026)
SOLDIERS_MIRROR = "https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%97%D7%99%D7%99%D7%9C%D7%99%D7%9D_%D7%94%D7%9E%D7%A9%D7%95%D7%97%D7%A8%D7%A8%D7%99%D7%9D_(%D7%94%D7%97%D7%96%D7%A8%D7%94_%D7%9C%D7%A2%D7%91%D7%95%D7%93%D7%94)"
GUIDE = "https://www.gov.il/he/departments/guides/notice-of-dismissal-and-resignation"   # משרד העבודה, מדריך, פורסם 24.1.2021
HEARING = "https://www.gov.il/he/Departments/General/disciplinary-hearing"             # משרד העבודה, היחידה ליחסי עבודה, פורסם 18.8.2021
PERMIT = "https://www.gov.il/he/service/workers-dismissal-due-to-women-employment-law"  # בקשה להיתר פיטורים לפי חוק עבודת נשים
PREGNANCY_GUIDE = "https://www.gov.il/he/Departments/Guides/labor-rights-during-pregnancy-and-birthwork"
FORM_161 = "https://www.gov.il/he/service/notice-of-retirement"                        # רשות המסים: הודעה על פרישה מעבודה (טופס 161 חדש)
FORM_161_PDF = "https://www.gov.il/BlobFolder/service/notice-of-retirement/he/tofes-161.pdf"


def build(checked_on: str) -> dict:
    """The advance notice in both directions, what may and may not run inside it, and who must not be dismissed now."""
    return {
        "name_he": "הודעה מוקדמת לפיטורים ולהתפטרות: התקופה, התשלום והתקופות המוגנות",
        "publisher_he": "חוק הודעה מוקדמת, חוק חופשה שנתית, חוק עבודת נשים, חוק החיילים המשוחררים, משרד העבודה ורשות המסים",
        "source_name": "חוק הודעה מוקדמת לפיטורים ולהתפטרות, התשס\"א-2001 (נוסח עדכני)",
        "source_url": NOTICE_LAW,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        # The tiers themselves are read from reg.severance.notice (ss.3-4), never repeated here.
        "law": {
            "he": "חוק הודעה מוקדמת לפיטורים ולהתפטרות, התשס\"א-2001",
            "short_he": "חוק הודעה מוקדמת",
            "url": NOTICE_LAW,
            "current_to": "2023-09-18",
            "sections": {
                "duty": "סעיף 2(א)-(ב)", "written": "סעיף 2(ג)", "monthly": "סעיף 3", "wage": "סעיף 4", "resign": "סעיף 5",
                "waive_fire": "סעיף 6(א)", "waive_resign": "סעיף 6(ב)", "none_fire": "סעיף 7(א)", "none_resign": "סעיף 7(ב)",
                "cert": "סעיף 8(א)", "cert_late": "סעיף 8(ב)", "court": "סעיף 9", "exceptions": "סעיף 10", "rights": "סעיף 12",
                "other_rules": "סעיף 13(ב)", "start": "סעיף 15",
            },
            # s.1: the pay types and the "regular wage" are those of the Severance Pay Law ss.12-13.
            "definitions_he": "עובד במשכורת (חודשי) ועובד בשכר (לפי שעה או יום) כהגדרתם בסעיף 12 לחוק פיצויי פיטורים; שכר רגיל: השכר שמשמש לחישוב פיצויי פיטורים לפי סעיף 13 לאותו חוק",
            "definitions_section": "סעיף 1",
            "written_he": "ההודעה ניתנת בכתב, ומציינת את יום הוצאתה ואת היום שבו הפיטורים או ההתפטרות נכנסים לתוקף",
            "resign_he": "סעיפים 3 ו-4 חלים גם על הודעה מוקדמת להתפטרות, בשינויים המחויבים",
            "waive_he": "המעסיק רשאי לוותר על עבודה בפועל בתקופת ההודעה, כולה או מקצתה, ובלבד שישלם את השכר הרגיל בעד התקופה שעליה ויתר",
            "none_fire_he": "מעסיק שפיטר בלי הודעה מוקדמת משלם לעובד פיצוי בסכום השכר הרגיל בעד התקופה שבה לא ניתנה ההודעה",
            "none_resign_he": "עובד שהפסיק לעבוד בלי הודעה מוקדמת משלם למעסיק פיצוי בסכום השכר הרגיל בעד התקופה שבה לא ניתנה ההודעה",
            "cert_he": "בסיום העבודה המעסיק נותן אישור בכתב על תחילת יחסי העבודה וסיומם",
            "exceptions_he": "סעיפים 2 עד 7 לא חלים על עובד בנסיבות מיוחדות שבהן אין לדרוש ממנו לעבוד בתקופת ההודעה, ועל מעסיק כשהעובד שפוטר אינו זכאי לפיצויים לפי סעיפים 16 או 17 לחוק פיצויי פיטורים או לפי החלטת בית דין למשמעת",
            "rights_he": "החוק לא גורע מזכות לפי חוק אחר, הסכם קיבוצי או חוזה עבודה: הודעה ארוכה יותר בחוזה או בהסכם גוברת",
            "court_he": "לבית הדין האזורי לעבודה סמכות ייחודית בתביעה לפי החוק",
            "start_he": "החוק בתוקף מה-1 בחודש שאחרי פרסומו (2001); סעיף 8(ב) (הקנס על אי-מתן אישור) שישה חודשים אחר כך",
        },
        # Annual Leave Law s.5(a)(7): notice days are not counted as vacation days unless they exceed 14, and only beyond.
        "leave": {
            "he": "חוק חופשה שנתית, התשי\"א-1951",
            "url": LEAVE_LAW,
            "current_to": "2026-07-21",
            "section": "סעיף 5(א)(7)",
            "free_days": 14,
            "rule_he": "ימי הודעה מוקדמת לפיטורים לא באים במניין ימי החופשה, אלא אם עלו על ארבעה עשר, ובמידה שעלו",
            "redeem_section": "סעיף 13",
            "redeem_he": "עובד שחדל לעבוד לפני שקיבל את החופשה שהגיעה לו מקבל פדיון חופשה",
        },
        # Women's Employment Law s.9 (the periods that the pregnancy months and the 60 days of reg.rights_leida.protect
        # do not cover). Every gate is a flag with its section, never a verdict.
        "women": {
            "he": "חוק עבודת נשים, התשי\"ד-1954",
            "url": WOMEN_LAW,
            "current_to": "2026-06-01",
            "permit_url": PERMIT,
            "permit_he": "בקשה להיתר פיטורים או לפגיעה בהיקף משרה או הכנסה, לפי חוק עבודת נשים (משרד העבודה)",
            "guide_url": PREGNANCY_GUIDE,
            "not_counted_section": "סעיף 9(ג)(3)",
            "not_counted_he": "במניין ימי ההודעה המוקדמת לפיטורים לא באות תקופת הלידה וההורות, 60 הימים שאחריה וההיעדרות לפי סעיף 7(ד)(1) ו-60 הימים שאחריה",
            "fixed_term_section": "סעיף 9(ז)",
            "fixed_term_he": "לעניין ההגנות, פיטורים כוללים אי-חידוש חוזה לתקופה קצובה של 12 חודשים או יותר, או קצר יותר שהאריך העסקה קודמת",
            "compensation_section": "סעיף 13א(ב)(1)",
            "compensation_he": "בית הדין לעבודה שמצא פיטורים בניגוד לסעיף 9 פוסק פיצויים של לפחות 150% מהשכר בתקופה המזכה, אלא מטעמים מיוחדים",
            "compensation_pct": 150,
            "gates": [
                {"code": "pregnant", "section": "סעיף 9(א)", "he": "בהיריון, לפני היציאה לתקופת לידה והורות: פיטורים רק בהיתר משר העבודה, והיתר לא יינתן אם הפיטורים בקשר להיריון; חל אחרי 6 חודשי עבודה אצל אותו מעסיק או באותו מקום עבודה", "not_counted": False, "days_after": 0},
                {"code": "leave", "section": "סעיף 9(ג)(1)", "he": "בתקופת לידה והורות (וגם בהיעדרות לפי סעיף 7(ג)(2) או (ג2)): אסור לפטר, ואסור לתת הודעת פיטורים שתחול בתקופה הזאת", "not_counted": True, "days_after": 0},
                {"code": "after_leave", "section": "סעיף 9(ג)(1א)", "he": "60 ימים אחרי תום תקופת הלידה וההורות: פיטורים או הודעת פיטורים שחלה בהם רק בהיתר, והוא יינתן רק כשהעסק חדל לפעול או בפשיטת רגל או פירוק, ולא בקשר ללידה", "not_counted": True, "days_after": 60},
                {"code": "unpaid_after", "section": "סעיף 9(ג)(2)", "he": "בחופשה ללא תשלום שאחרי תקופת הלידה וההורות (סעיף 7(ד)(1)), בהיעדרות בתקופת הנקה (סעיף 7(ג)(1ג)) או לפי סעיף 7(ד1), ו-60 ימים אחריהן: פיטורים רק בהיתר, ולא בקשר ללידה או להיעדרות", "not_counted": True, "days_after": 60},
                {"code": "fertility", "section": "סעיף 9(ה)", "he": "טיפולי פוריות או הפריה חוץ-גופית (עד שתי לידות אצל אותו מעסיק): בימי ההיעדרות ו-150 ימים אחריהם, או 150 ימים מתחילת הטיפולים כשלא נעדרו; פיטורים רק בהיתר. מי שלא נעדרו: להודיע למעסיק לא יאוחר מ-3 ימי עבודה מההודעה המוקדמת, ולמסור אישור רופא בתוך 14 ימים; חל אחרי 6 חודשי עבודה", "not_counted": False, "days_after": 150, "notify_work_days": 3, "doctor_days": 14},
                {"code": "shelter", "section": "סעיף 9(ד)", "he": "שהייה במקלט לנשים מוכות: בימי ההיעדרות ו-150 ימים אחריהם פיטורים רק בהיתר; התקופות האלה לא באות במניין ימי ההודעה", "not_counted": True, "days_after": 150},
                {"code": "miscarriage", "section": "סעיף 9(ו)", "he": "היעדרות אחרי הפלה (סעיף 7(א): שבוע, ובאישור רופא עד 6 שבועות): אסור לפטר ואסור לתת הודעת פיטורים שתחול בימים האלה; הם לא באים במניין ימי ההודעה", "not_counted": True, "days_after": 0},
            ],
            # s.9(c)(2c), from 28.2.2026 / 1.3.2026 (the Economic Assistance Plan (Temporary Provision) (Employment) Law 2026).
            "unpaid_2026": {"from": "2026-02-28", "section": "סעיף 9(ג)(2ג)", "he": "חופשה ללא תשלום של 10 ימים רצופים לפחות בתקופה הקובעת, או של 5 ימים רצופים לפחות שהתחילה ב-28.2.2026 או ב-1.3.2026, שחלה ב-60 הימים שאחרי הלידה או ההיעדרות: לא נספרת במניין 60 הימים"},
        },
        # Discharged Soldiers (Reinstatement) Law s.41A (reserve duty) and s.41A2 (the partner of a reservist).
        "reserve": {
            "he": "חוק החיילים המשוחררים (החזרה לעבודה), התש\"ט-1949",
            "url": SOLDIERS_LAW,
            "current_to": "2026-10-20",
            "committee_he": "ועדת התעסוקה",
            "because_section": "סעיף 41א(א1)",
            "because_he": "אסור לפטר בשל שירות מילואים, קריאה אליו או שירות צפוי (גם בשל תדירותו או משכו); פיטורים כאלה בטלים",
            "during_section": "סעיף 41א(ב)",
            "during_he": "בתקופת שירות המילואים פיטורים רק בהיתר מוועדת התעסוקה; אחרי שירות של יותר מיומיים רצופים, גם 30 ימים אחרי סופו (ולא פגיעה בהיקף המשרה או בהכנסה)",
            "after_days": 30,
            "min_days_for_after": 3,
            "not_counted_section": "סעיף 41א(ג)",
            "not_counted_he": "במניין ימי ההודעה המוקדמת לפיטורים לא באות תקופת השירות ו-30 הימים שאחריה",
            "partner_section": "סעיף 41א2(ה)",
            "partner_he": "עובד שעימו ילד (עד גיל 14, או תלמיד עם צרכים מיוחדים) שבן זוגו או ההורה האחר של ילדו בשירות מילואים בנסיבות חירום (סעיף 8 לחוק שירות המילואים) או של 21 ימים רצופים לפחות: אסור לפטר או להוציא לחופשה ללא תשלום בתקופת השירות ו-14 ימים אחריה, אלא בהיתר; בתנאי שהודיע למעסיק בכתב לא יאוחר מ-3 ימי עבודה מההודעה על הכוונה לפטר",
            "partner_after_days": 14,
            "partner_min_days": 21,
            "partner_child_age": 14,
            "partner_notify_work_days": 3,
            "partner_not_counted_section": "סעיף 41א2(ח)",
            "partner_not_counted_he": "במניין ימי ההודעה המוקדמת שניתנה בתקופת השירות של בן הזוג לא באה תקופת השירות",
            # The partner protections (ה)-(ט) are a temporary provision: the open full text marks them "הוראת שעה מיום
            # 29.4.2026 עד 30 יום מסיום תקופת תוקפה של ההכרזה על מצב מיוחד בעורף"; Nevo's s.41א1 says "בתקופת תוקפו של הסעיף".
            "partner_from": "2026-04-29",
            "partner_temp_he": "הוראת שעה מ-29.4.2026 ועד 30 יום אחרי סוף ההכרזה על מצב מיוחד בעורף",
            "partner_temp_url": SOLDIERS_MIRROR,
            "compensation_section": "סעיף 21(ג)(2)",
            "compensation_he": "ועדת התעסוקה רשאית לתת צו לפיצויים של חמש פעמים השכר החודשי (בפיטורים בניגוד לסעיפים 41א או 41א2: או חמש פעמים השכר הממוצע במשק, הגבוה מביניהם)",
        },
        # The Ministry of Labor's pages.
        "guide": {
            "he": "משרד העבודה: הודעה מוקדמת לפיטורים ולהתפטרות", "url": GUIDE, "published": "2021-01-24",
            # The chapter "תקופת ההודעה המוקדמת": the wage worker's table, months of work 1-36 -> notice days; more than 36
            # months: a month. The monthly worker before a full year: "עד לשלושה שבועות לכל היותר".
            "wage_table": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19,
                           21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26],
            "monthly_max_he": "עובדים שלא צברו שנת עבודה מלאה: יום לכל אחד מששת החודשים הראשונים ויומיים וחצי לכל חודש נוסף, עד שלושה שבועות לכל היותר",
            "counting_he": "חודש העבודה שבו ניתנת ההודעה נספר, כמו בטבלה של משרד העבודה",
            # The same chapter: a contract may not shorten a dismissal notice, and may not lengthen a resignation notice.
            "contract_he": "בהסכם העבודה אי אפשר לקבוע הודעה קצרה מזו שבחוק במקרה של פיטורים, ולא הודעה ארוכה מזו שבחוק במקרה של התפטרות",
        },
        "hearing": {
            "he": "משרד העבודה: הרקע לפיטורים ולהתפטרות והזכות לשימוע",
            "url": HEARING,
            "published": "2021-08-18",
            "duty_he": "הפסיקה הכירה בחובת המעסיק לקיים שימוע לפני ההחלטה לפטר, גם במגזר הפרטי: לתת מראש את המידע והנימוקים, לאפשר לעיין במסמכים ולהשמיע טענות",
            "rights_he": "אפשר לבוא לשימוע עם עורך דין או נציג אחר (גם בן משפחה) ועם נציג ועד העובדים; את השימוע מתעדים בפרוטוקול ומוסרים לעובד העתק",
            "resign_he": "מי שמתפטר בגלל הרעה מוחשית בתנאים: משרד העבודה ממליץ להתריע מראש, כדי לתת למעסיק הזדמנות לתקן",
        },
        "form_161": {
            "he": "הודעה על פרישה מעבודה (טופס 161)",
            "url": FORM_161,
            "pdf_url": FORM_161_PDF,
            "from": "2024-01-01",
            "from_he": "מ-1.1.2024 מעסיקים מדווחים על פרישה מעבודה בטופס 161 החדש (גם דיגיטלית); העובד ממלא בו את בחירותיו לגבי מענקי הפרישה",
        },
    }
