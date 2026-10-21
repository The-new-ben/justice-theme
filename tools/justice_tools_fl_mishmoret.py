"""The parenting-time dataset of the co.il tools registry (the family + land wave, 21.10.2026, HAD-579): the mishmoret
instrument on /child-custody/ (a parenting-time planner: the nights of a year per parent, the split of the official school
holidays, the age rules of the law and the rulings, and what the split does to child support). Loaded by
tools/justice_tools_fl.py through KEY and build().

Every value was read on checked_on from the official text named next to it:
- the Ministry of Education's director-general circular for the school year 5787 (2026-2027), notice 0363 (kindergartens,
  elementary and middle schools in official Jewish education, published 30.3.2026) and notice 0364 (the upper divisions,
  same day), linked from the Ministry's "לוח חופשות - חוזר מנכ\"ל" page, which also states the opening day of 5788
  (1.9.2027) and nothing else of that year yet;
- the Legal Capacity and Guardianship Law, 1962 (Nevo's consolidated text, current to 19.1.2026): ss.3, 14, 15, 17, 18,
  19, 24, 25;
- the Family Court (Procedure) Regulations, 2020 (Nevo, current to 8.9.2025): chapter 2, hearing the child, regs. 49-57;
- the Welfare (Procedure in Matters of Minors, Mentally Ill Persons and Absent Persons) Law, 1955 (Nevo): ss.2, 4, 5;
- the Supreme Court's judgment in בע"מ 919/15 (19.7.2017), Justice Fogelman's opinion, paras. 1-3 (the court's own text,
  saved by the family wave on 14.10.2026); the support rules by age stay in child_support (tools/justice_tools_family.py),
  which the instrument reads too.
The arrangement templates and the way a vacation is cut into nights are this tool's templates, labelled as such: no law
sets a schedule (divorce_agreement.schedule_he). Nothing here is estimated; a figure the sources do not hold is not in the
file (see parts/mishmoret/notes.md).
"""
from __future__ import annotations

KEY = "fl_mishmoret"

MOE_PAGE = "https://pop.education.gov.il/maagal_hashana/vacation-schedule/"        # לוח חופשות - חוזר מנכ"ל (תשפ"ז, תשפ"ח)
MOE_K9 = "https://apps.education.gov.il/mankal/Hodaa.aspx?siduri=362"              # הודעה 0363: גנים, יסודי, חטיבות ביניים
MOE_UPPER = "https://apps.education.gov.il/mankal/Hodaa.aspx?siduri=363"           # הודעה 0364: חטיבות עליונות
MOE_MAONOT = "https://meyda.education.gov.il/files/PreSchool/maonot/jewish2026-2027.pdf"  # לוח חופשות במעונות יום, תשפ"ז
CAPACITY = "https://www.nevo.co.il/law_html/law00/70325.htm"                        # חוק הכשרות המשפטית והאפוטרופסות
CAPACITY_MOJ = "https://www.gov.il/BlobFolder/generalpage/guardian_080825/he/guardianlaw0725.pdf"  # נוסח משרד המשפטים
FAMILY_REGS = "https://www.nevo.co.il/law_html/law00/196390.htm"                    # תקנות בית המשפט לענייני משפחה (סדרי דין)
WELFARE = "https://www.nevo.co.il/law_html/Law01/055_081.htm"                       # חוק הסעד (סדרי דין בעניני קטינים...)
RULING = ("https://supremedecisions.court.gov.il/Home/Download?path=HebrewVerdicts\\15\\190\\009\\m29"
          "&fileName=15009190_m29.txt&type=2")                                       # בע"מ 919/15 (the court's text)
SVC_DISPUTE = "https://www.gov.il/he/service/asking_for_family_dispute_settlements"  # בקשה ליישוב סכסוך (הרשות השופטת)
SVC_AGREEMENT = "https://www.gov.il/he/service/couple-family-agreement"             # אישור הסכם בבית המשפט לענייני משפחה
MOLSA = "https://www.gov.il/he/pages/molsa-families-in-divorce-proceedings-sight-and-custody-arrangements?chapterIndex=2"


def build(checked_on: str) -> dict:
    """The school year 5787 vacations by stage, the law's age rules with their sections, hearing the child, the welfare
    officer's report, and the ruling's definition of shared physical custody."""
    return {
        "name_he": "זמני שהות, חופשות בית הספר וכללי הגיל במשמורת ילדים",
        "publisher_he": "משרד החינוך (חוזר המנכ\"ל, לוח החופשות), חוק הכשרות המשפטית והאפוטרופסות, תקנות בית המשפט לענייני משפחה",
        "source_name": "חוזר מנכ\"ל משרד החינוך, הודעות 0363 ו-0364 (30.3.2026): לוח החופשות והחגים בשנת הלימודים תשפ\"ז",
        "source_url": MOE_K9,
        "checked_on": checked_on,
        "refresh_every_days": 183,
        # The Ministry publishes the next year's vacations in the spring (5787's on 30.3.2026).
        "next_update": "2027-04-01",
        "school_year": {
            "he": "תשפ\"ז",
            "first_day": "2026-09-01",
            "sector_he": "החינוך הרשמי בחברה היהודית",
            "page_url": MOE_PAGE,
            "next_he": "תשפ\"ח",
            "next_first_day": "2027-09-01",
            "next_published_he": "מלוח שנת הלימודים תשפ\"ח פורסם עד עכשיו רק יום הפתיחה, 1.9.2027; החגים של סתיו 2027 עוד לא פורסמו",
            "other_sectors_he": "לחברה הדרוזית, לחברה הערבית ולחינוך המוכר שאינו רשמי יש לוחות נפרדים באותו עמוד של משרד החינוך",
            "maonot_he": "למעונות היום (לידה עד גיל 3) יש לוח אחר, שכולל ימי חופשה לבחירה, ולכן הכלי לא מחשב אותו",
            "maonot_url": MOE_MAONOT,
        },
        # Which calendar the children follow; the summer starts the day after the last school day.
        "stages": {
            "k6": {"he": "גן ובית ספר יסודי", "last_day": "2027-06-30", "notice_he": "חוזר מנכ\"ל, הודעה 0363", "section_he": "סעיף 1: סיום שנת הלימודים", "url": MOE_K9, "published": "2026-03-30"},
            "mid": {"he": "חטיבת ביניים", "last_day": "2027-06-20", "notice_he": "חוזר מנכ\"ל, הודעה 0363", "section_he": "סעיף 1: סיום שנת הלימודים", "url": MOE_K9, "published": "2026-03-30"},
            "high": {"he": "חטיבה עליונה", "last_day": "2027-06-20", "notice_he": "חוזר מנכ\"ל, הודעה 0364", "section_he": "סעיף 1: סיום שנת הלימודים", "url": MOE_UPPER, "published": "2026-03-30"},
        },
        # Every vacation of 5787: the first day without school and the day school resumes, as the circular states them
        # (section 3, "חגי ישראל"). Where the circular names one day only (Independence Day), the next day is an ordinary
        # school day. A stage-specific value overrides the common one.
        "breaks": [
            {"key": "rh", "he": "ראש השנה", "off": "2026-09-11", "resume": "2026-09-14",
             "text_he": "ערב ראש השנה ושני ימי החג, 11 עד 13 בספטמבר 2026; הלימודים מתחדשים ב-14 בספטמבר", "section_he": "סעיף 3"},
            {"key": "tishrei", "he": "יום הכיפורים וסוכות", "off": "2026-09-20", "resume": "2026-10-04", "by_stage": {"high": {"resume": "2026-10-05"}},
             "text_he": "יום הכיפורים 20-21 בספטמבר, ימי החופשה שביניהם 22-24 בספטמבר, וסוכות 25 בספטמבר עד 3 באוקטובר 2026; בחטיבות העליונות גם אסרו חג, 4 באוקטובר",
             "section_he": "סעיף 3: שלוש שורות רצופות"},
            {"key": "hanukkah", "he": "חנוכה", "off": "2026-12-06", "resume": "2026-12-13",
             "text_he": "6 עד 12 בדצמבר 2026; הלימודים מתחדשים ב-13 בדצמבר", "section_he": "סעיף 3"},
            {"key": "purim", "he": "פורים", "off": "2027-03-23", "resume": "2027-03-25",
             "text_he": "23-24 במרץ 2027; תענית אסתר, 22 במרץ, היא יום לימודים", "section_he": "סעיף 3"},
            {"key": "pesach", "he": "פסח", "off": "2027-04-13", "resume": "2027-04-29",
             "text_he": "13 עד 28 באפריל 2027; אסרו חג, 29 באפריל, הוא יום לימודים", "section_he": "סעיף 3"},
            {"key": "indep", "he": "יום העצמאות", "off": "2027-05-12", "resume": "2027-05-13",
             "text_he": "12 במאי 2027; ל\"ג בעומר (25 במאי) ויום ירושלים (4 ביוני) הם ימי לימודים", "section_he": "סעיף 3"},
            {"key": "shavuot", "he": "שבועות", "off": "2027-06-10", "resume": "2027-06-13",
             "text_he": "10-11 ביוני 2027; הלימודים מתחדשים ב-13 ביוני", "section_he": "סעיף 3"},
            {"key": "summer", "he": "החופש הגדול", "off": "2027-07-01", "resume": "2027-09-01", "by_stage": {"mid": {"off": "2027-06-21"}, "high": {"off": "2027-06-21"}},
             "text_he": "מהיום שאחרי סיום שנת הלימודים (30 ביוני בגנים וביסודי, 20 ביוני בחטיבות) ועד פתיחת שנת הלימודים תשפ\"ח, 1 בספטמבר 2027",
             "section_he": "סעיף 1 וסעיף 11: פתיחת תשפ\"ח"},
        ],
        # This tool's template for cutting a vacation into nights (not a rule of law): the vacation's nights run from the
        # evening of the last school day to the night before school resumes; a vacation of at least long_from_nights
        # nights splits into two halves, the first half the longer one.
        "template": {
            "long_from_nights": 6,
            "he": "תבנית של הכלי, לא כלל משפטי: החופשה מתחילה בערב של יום הלימודים האחרון ונגמרת בבוקר שבו חוזרים ללימודים",
            "halves_he": "חופשה של 6 לילות ומעלה מתחלקת לשני חצאים; חופשה קצרה עוברת שלמה להורה אחד, לסירוגין",
            "alternate_he": "כל חופשה שלמה להורה אחד, לסירוגין, והחופש הגדול חצי-חצי; בשנה הבאה הסדר מתהפך",
        },
        "law": {
            "he": "חוק הכשרות המשפטית והאפוטרופסות, התשכ\"ב-1962",
            "url": CAPACITY,
            "moj_url": CAPACITY_MOJ,
            "current_to": "2026-01-19",
            "minor_until": 18,
            "tender_until": 6,
            "sections": {
                "minor": "סעיף 3", "natural": "סעיף 14", "content": "סעיף 15", "duty": "סעיף 17", "consent": "סעיף 18(א)",
                "dispute": "סעיף 19", "agreement": "סעיף 24", "no_agreement": "סעיף 25",
            },
            "minor_he": "קטין הוא מי שלא מלאו לו 18 שנה (סעיף 3)",
            "natural_he": "שני ההורים הם האפוטרופסים הטבעיים של ילדיהם, גם אחרי פרידה (סעיף 14)",
            "content_he": "האפוטרופסות כוללת את החובה והזכות לדאוג לצורכי הילד, וצמודה לה הרשות להחזיק בו ולקבוע את מקום מגוריו (סעיף 15)",
            "consent_he": "בכל עניין שבאפוטרופסות ההורים פועלים בהסכמה; עניין שאינו סובל דיחוי, כל הורה לבדו (סעיף 18(א))",
            "agreement_he": "הורים שחיים בנפרד יכולים להסכים מי יחזיק בילד ומה יהיו זמני הקשר עם ההורה השני; ההסכם טעון אישור בית המשפט, שמאשר אותו רק אם הוא לטובת הילד (סעיף 24)",
            "no_agreement_he": "בלי הסכם, בית המשפט קובע לפי טובת הילד, ובלבד שילדים עד גיל 6 יהיו אצל אמם אם אין סיבות מיוחדות להורות אחרת (סעיף 25)",
        },
        "child_heard": {
            "he": "תקנות בית המשפט לענייני משפחה (סדרי דין), התשפ\"א-2020",
            "url": FAMILY_REGS,
            "current_to": "2025-09-08",
            "from_age": 6,
            "sections": {"right": "תקנה 49", "order": "תקנה 50", "age": "תקנה 51(ב)", "alone": "תקנה 51(ג)", "choice": "תקנה 52", "secret": "תקנה 55", "agreement": "תקנה 57", "matters": "תקנה 15(א)(3)"},
            "right_he": "בתובענה בעניין ילד, כולל זמני שהות, בית המשפט נותן לילד הזדמנות להביע את רגשותיו, דעותיו ורצונותיו, ונותן להם משקל ראוי לפי גילו ובגרותו (תקנה 49)",
            "age_he": "בית המשפט שומע ילד בן 6 לפחות; ילד צעיר יותר, אם ראה לנכון, למשל כשאחיו הגדולים נשמעים (תקנה 51(ב))",
            "how_he": "הילד נשמע בלי ההורים ובאי כוחם, לפני השופט או לפני עובד סוציאלי של יחידת הסיוע, לפי בחירתו, ודבריו חסויים (תקנות 51(ג), 52 ו-55)",
            "agreement_he": "כשמאשרים הסכם, בית המשפט בודק אם הילד נשמע, ויכול להפנות את ההורים ליחידת הסיוע (תקנה 57)",
        },
        "welfare": {
            "he": "חוק הסעד (סדרי דין בעניני קטינים, חולי נפש ונעדרים), התשט\"ו-1955",
            "url": WELFARE,
            "sections": {"report": "סעיף 2", "parties": "סעיף 4", "examine": "סעיף 5(א)"},
            "report_he": "בית המשפט רשאי לצוות על עובד סוציאלי לעניין סדרי דין לחקור בעניין הילד ולחוות דעתו בתסקיר בכתב (סעיף 2)",
            "parties_he": "התסקיר נמסר לצדדים, והם רשאים לטעון נגדו, אלא אם בית המשפט הורה מטעמים מיוחדים שלא לגלות אותו (סעיף 4)",
            "examine_he": "בית המשפט רשאי לזמן את העובד הסוציאלי להיחקר, גם בלי תסקיר (סעיף 5(א))",
        },
        "ruling": {
            "he": "בע\"מ 919/15 פלוני נ' פלונית",
            "date": "2017-07-19",
            "url": RULING,
            "equal_nights": 7,
            "equal_of": 14,
            "equal_month_nights": 15,
            "equal_month_of": 30,
            "paras": {"terms": "חוות דעת השופט פוגלמן, פסקה 1", "tender": "פסקה 2", "equal": "פסקה 3"},
            "terms_he": "האפוטרופסות כוללת \"משמורת משפטית\" (הדאגה לצורכי הילד) ו\"משמורת פיזית\" (ההחזקה וקביעת מקום המגורים) (פסקה 1)",
            "tender_he": "בלי סיבות מיוחדות, המשמורת הפיזית של ילדים עד גיל 6 נמסרת לאם: \"חזקת הגיל הרך\" (פסקה 2, בהפניה לבע\"ם 1858/14, פסקה לג)",
            "equal_he": "משמורת פיזית משותפת: חלוקה שווה של זמני השהות, 7 לילות ב-14 ימים או 15 לילות ב-30 ימים (פסקה 3)",
        },
        "services": {
            "dispute_he": "בקשה ליישוב סכסוך, לפני תביעה בענייני הילדים",
            "dispute_url": SVC_DISPUTE,
            "agreement_he": "בקשה לאישור הסכם בבית המשפט לענייני משפחה",
            "agreement_url": SVC_AGREEMENT,
            "molsa_he": "משרד הרווחה: משמורת וחלוקת זמני שהות",
            "molsa_url": MOLSA,
            "moe_he": "משרד החינוך: לוח החופשות, חוזר מנכ\"ל",
            "moe_url": MOE_PAGE,
        },
    }
