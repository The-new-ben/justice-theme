"""The inheritance-process dataset of the co.il tools registry (the inheritance wave, 21.10.2026): the inheritance-order
planner, the waiver-affidavit generator, the dispute navigator, the heirs' agreement generator and the objection clock.
Imported by tools/justice_tools_registry.py (--inheritance-checked-on); kept in a module of its own so the other waves'
builders stay untouched.

Every value was read on checked_on from the official text named next to it: the Succession Law and the Succession
Regulations (Nevo's consolidated texts), the registrar's fee regulations in the text from 1.1.2026 (Kovetz HaTakanot 12149,
25.12.2025), the family-court fee regulations in the text from 1.7.2026, the Bar's recommended minimum tariff for 2026, the
Land Taxation Law, the Land Law, the Legal Capacity and Guardianship Law, and the government payments service for the
amounts it charges. Nothing here is estimated; a figure the sources do not hold is not in the file.
"""
from __future__ import annotations

LAW = "https://www.nevo.co.il/law_html/law00/72178.htm"            # חוק הירושה, התשכ"ה-1965
REGS = "https://www.nevo.co.il/law_html/law00/98588.htm"           # תקנות הירושה, התשנ"ח-1998
FEES = "https://www.nevo.co.il/law_html/law00/72181.htm"           # תקנות הירושה (אגרות הרשם לעניני ירושה), התשנ"ח-1998
FAMILY_FEES = "https://www.nevo.co.il/law_html/law00/71537.htm"    # תקנות בית המשפט לעניני משפחה (אגרות), התשנ"ו-1995
BAR = "https://www.nevo.co.il/law_html/law00/4425.htm"             # כללי לשכת עורכי הדין (התעריף המינימלי המומלץ), התש"ס-2000
LAND_TAX = "https://www.nevo.co.il/law_html/law00/72138.htm"       # חוק מיסוי מקרקעין (שבח ורכישה), התשכ"ג-1963
LAND_LAW = "https://he.wikisource.org/wiki/חוק_המקרקעין"           # חוק המקרקעין, התשכ"ט-1969 (נוסח מלא ופתוח)
CAPACITY = "https://www.nevo.co.il/law_html/law00/70325.htm"       # חוק הכשרות המשפטית והאפוטרופסות, התשכ"ב-1962
EVIDENCE = "https://he.wikisource.org/wiki/פקודת_הראיות"           # פקודת הראיות [נוסח חדש], התשל"א-1971
NOTARY_FEES = "https://www.nevo.co.il/law_html/law00/90738.htm"    # תקנות הנוטריונים (שכר שירותים), התשל"ט-1978
PAYMENTS = "https://ecom.gov.il/counterspa/home/9/1/inheritanceRegistar?language=he"
SVC_ORDER = "https://www.gov.il/he/service/inheritance_order"
SVC_PROBATE = "https://www.gov.il/he/service/probate-order"
SVC_FEES = "https://www.gov.il/he/departments/general/inheritance_fees"
VAT_URL = "https://www.nevo.co.il/law_html/law01/999_481.htm"


def build_inheritance_process(checked_on: str) -> dict:
    """The process after a death: the request for an order, the waiver, the objection, the dispute routes and the heirs'
    agreement. Fees are the published amounts; days are the periods the regulations set; sections are quoted by number."""
    return {
        "name_he": "ההליך אחרי הפטירה: צו ירושה, הסתלקות, התנגדות, סכסוך והסכם בין יורשים",
        "publisher_he": "חוק הירושה ותקנותיו, תקנות האגרות, תעריף הלשכה",
        "source_name": "חוק הירושה, התשכ\"ה-1965 (נוסח עדכני), ותקנות הירושה, התשנ\"ח-1998",
        "source_url": LAW,
        "checked_on": checked_on,
        "refresh_every_days": 365,
        "next_update": "2027-01-01",
        "law_he": "חוק הירושה, התשכ\"ה-1965",
        "law_url": LAW,
        "law_current_to": "2025-01-01",
        "regulations_he": "תקנות הירושה, התשנ\"ח-1998",
        "regulations_url": REGS,
        # The law, section by section, as the tools cite it.
        "sections": {
            "renounce": "סעיף 6", "renounce_who": "סעיף 6(ב)", "renounce_minor": "סעיף 6(ג)", "renounce_conditional": "סעיף 6(ד)",
            "transfer_share": "סעיף 7", "mutual": "סעיף 8א", "agreement_in_life_void": "סעיף 8",
            "forms": "סעיף 18", "handwritten": "סעיף 19", "witnesses": "סעיף 20", "deposit": "סעיף 21", "authority": "סעיף 22",
            "witness_capacity": "סעיף 24", "defects": "סעיף 25", "capacity": "סעיף 26", "freedom": "סעיף 27",
            "coercion": "סעיף 30", "one_year": "סעיף 31", "clerical": "סעיף 32", "unclear": "סעיף 33", "illegal": "סעיף 34",
            "beneficiary_involved": "סעיף 35", "revocation": "סעיף 36", "partial": "סעיף 38",
            "support": "סעיפים 56 ו-57", "support_when": "סעיף 60",
            "orders": "סעיף 66", "publication": "סעיף 67", "to_court": "סעיף 67א", "binding": "סעיף 71",
            "amend": "סעיף 72", "good_faith": "סעיף 73",
            "manager": "סעיף 78", "manager_who": "סעיף 79",
            "division_agreement": "סעיף 110", "division_court": "סעיף 111", "division_rules": "סעיפים 112 עד 117",
            "no_manager": "סעיף 121", "heirs_together": "סעיף 122",
            "family_court": "סעיף 151", "religious_court": "סעיף 155",
            "domicile": "סעיף 136", "jurisdiction_abroad": "סעיף 137",
        },
        "regulation_sections": {
            "request": "תקנה 14", "online": "תקנה 14(ד)", "death_affidavit": "תקנה 15", "renounce_affidavit": "תקנה 16",
            "publication": "תקנה 17(א)", "publication_cost": "תקנה 17(ג)", "other_will": "תקנה 18", "objection": "תקנה 19",
            "transfer": "תקנה 20", "parties": "תקנה 21", "order_no_objection": "תקנה 23", "amend": "תקנה 27",
            "support_claim": "תקנה 28", "manager_request": "תקנות 31 עד 45",
        },
        # Periods the regulations set (days). None of them is a court's working estimate.
        "days": {
            "objection": 14, "objection_he": "שבועיים מיום הפרסום, או יותר אם הרשם קבע (תקנה 17(א))",
            "other_will_notice": 14, "other_will_he": "למי שזוכה בצוואה אחרת שנמצאה במרשם: 14 ימים להתנגד (תקנה 18)",
            "amend_response": 14, "amend_he": "ליורשים שקיבלו בקשה לתיקון או לביטול צו: 14 ימים לתשובה (תקנה 27)",
            "online_original_will": 7, "online_original_he": "בהגשה מקוונת של בקשה לצו קיום: את הצוואה המקורית מוסרים לרשם בתוך 7 ימים (תקנה 14)",
            "support_after_division_months": 6, "support_he": "מזונות מן העיזבון מבקשים לפני החלוקה; עד 6 חודשים אחריה, אם יש טעם (סעיף 60)",
        },
        # The registrar's fee regulations, the text from 1.1.2026 (every item of the schedule).
        "registrar": {
            "regulation_he": "תקנות הירושה (אגרות הרשם לעניני ירושה), התשנ\"ח-1998",
            "url": FEES,
            "from": "2026-01-01",
            "gazette_he": "קובץ התקנות 12149, 25.12.2025",
            "indexed_he": "מתעדכנות ב-1 בינואר לפי המדד (תקנה 2)",
            "online_pct": 85,
            "online_section": "תקנה 1(א)",
            "exempt_section": "תקנה 4(5)",
            "exempt_he": "בן זוג, ילד, הורה או אח של מי שנפטר עקב פעולות מלחמה או איבה, או בשירות צבאי: פטור מאגרה",
            "items": {
                "order": {"he": "בקשה למתן צו ירושה או צו קיום צוואה", "amount": 597, "item": "התוספת, פרט 1"},
                "amend": {"he": "בקשה לתיקון או ביטול צו ירושה או צו קיום צוואה", "amount": 597, "item": "פרט 2"},
                "manager": {"he": "בקשה למינוי מנהל עיזבון", "amount": 597, "item": "פרט 3"},
                "will_before_registrar": {"he": "עשיית צוואה בפני רשם לענייני ירושה", "amount": 280, "item": "פרט 4"},
                "deposit": {"he": "הפקדת צוואה", "amount": 126, "item": "פרט 5"},
                "deposit_free": {"he": "הפקדה בלי צוואה קודמת שהופקדה ב-5 השנים שלפני", "amount": 0, "item": "פרט 5א"},
                "clerical": {"he": "תיקון טעות סופר בהחלטת הרשם, בתוך 30 ימים", "amount": 0, "item": "פרט 6"},
                "inspect": {"he": "עיון בתיק בארכיון הרשם", "amount": 32, "item": "פרט 7"},
                "copy_page": {"he": "העתק מאושר, לכל עמוד", "amount": 6.1, "item": "פרט 8"},
                "other": {"he": "כל בקשה אחרת לפעולה או לשירות", "amount": 280, "item": "פרט 9"},
            },
            # What the government payments service charges (the reduced fee as charged, not 597 x 85% = 507.45).
            "payments": {
                "online_fee": 507, "publication": 66,
                "he": "שירות התשלומים הממשלתי, משרד המשפטים, אגרות לשירותי רשם הירושה",
                "url": PAYMENTS, "checked_on": "2026-10-14",
            },
        },
        # The family court's fees, the text from 1.7.2026 (indexed on 1 January and 1 July, reg. 4(א)).
        "family_court": {
            "regulation_he": "תקנות בית המשפט לעניני משפחה (אגרות), התשנ\"ו-1995",
            "url": FAMILY_FEES,
            "current_to": "2026-07-01",
            "indexed_he": "מתעדכנות פעמיים בשנה, ב-1 בינואר וב-1 ביולי (תקנה 4(א))",
            "items": {
                "objection": {"he": "התנגדות למתן צו ירושה או צו קיום צוואה", "amount": 1151, "item": "התוספת הראשונה, פרט 4"},
                "amend": {"he": "בקשה לתיקון או ביטול צו ירושה או צו קיום צוואה", "amount": 1183, "item": "פרט 4א"},
                "manager": {"he": "בקשה למינוי מנהל עיזבון", "amount": 1183, "item": "פרט 4ב"},
                "property": {"he": "תביעה בענייני רכוש שאינה לסכום כסף קצוב", "amount": 3481, "item": "פרט 2"},
                "other": {"he": "כל תביעה אחרת", "amount": 574, "item": "פרט 6"},
                "written": {"he": "בקשה בכתב", "amount": 282, "item": "פרט 7"},
            },
            "objection_filed_he": "את ההתנגדות מגישים לרשם לענייני ירושה, והיא נדונה בבית המשפט לענייני משפחה (סעיף 67א לחוק; תקנות 19 ו-20)",
        },
        # The Bar's recommended minimum tariff (non-binding, before VAT), updated for 2026.
        "bar": {
            "rules_he": "כללי לשכת עורכי הדין (התעריף המינימלי המומלץ), התש\"ס-2000",
            "url": BAR,
            "current_to": "2026-01-05",
            "probate_pct": 1.5, "probate_min": 4281, "objection_add_pct": 25, "hearing": 754,
            "partition_pct": 3, "partition_min": 6307, "nonmonetary": 6307, "interim": 741,
            "registration_per_unit": 2190,
            "items": {
                "probate": "התוספת, פרט 4.א(4)(א)", "objection": "פרט 4.א(4)(ב)", "hearing": "פרט 4.א(4)(ג)",
                "partition": "פרט 3(ב): פירוק שיתוף במקרקעין", "nonmonetary": "פרט 3(ב): תביעה שאינה ניתנת להערכה בכסף",
                "interim": "פרט 3(ב): בקשת ביניים", "registration": "פרט 11(9)(ח)",
            },
            "note_he": "המלצה לחברי הלשכה שאינה מחייבת (כלל 2); מע\"מ נוסף על הסכום (כלל 1); מתעדכן ב-1 בינואר (כלל 3)",
        },
        "vat": {"pct": 18, "from": "2025-01-01", "he": "צו מס ערך מוסף (שיעור המס על עסקה ועל יבוא טובין), התשס\"ה-2005, סעיף 1", "url": VAT_URL},
        # An affidavit before a notary (the notary tariff, items 7 and 10) when no lawyer verifies it for free.
        "notary": {
            "regulation_he": "תקנות הנוטריונים (שכר שירותים), התשל\"ט-1978", "url": NOTARY_FEES, "from": "2026-01-01",
            "affidavit_first": 200, "affidavit_additional": 80, "item": "פרט 7",
        },
        "evidence_he": "תצהיר נחתם בפני עורך דין, נוטריון, שופט או רשם, אחרי אזהרה (סעיף 15 לפקודת הראיות)",
        "evidence_url": EVIDENCE,
        # Land taxation: inheritance is not a sale, the first division among heirs is not a sale, the inherited home.
        "land_tax": {
            "law_he": "חוק מיסוי מקרקעין (שבח ורכישה), התשכ\"ג-1963", "url": LAND_TAX,
            "inheritance_not_sale": "סעיף 4",
            "division_not_sale": "סעיף 5(ג)(4)",
            "division_he": "חלוקת נכסי עיזבון בין יורשים אינה מכירה, כל עוד לא ניתנה תמורה בכסף או בשווה כסף שאינו נכס מנכסי העיזבון",
            "gift_is_sale": "סעיף 1 (הגדרת מכירה)",
            "gift_he": "העברת זכות במקרקעין בלי תמורה היא מכירה לעניין החוק (סעיף 1, הגדרת מכירה): ויתור שאינו הסתלקות לפי סעיף 6 הוא מתנה",
            "inherited_home": "סעיף 49ב(5)",
            "inherited_home_he": "פטור במכירת דירה שהתקבלה בירושה כשהמוכר הוא בן זוג, צאצא או בן זוג של צאצא של המוריש; לפני פטירתו הייתה למוריש דירת מגורים אחת בלבד; ואילו היה בחיים ומוכר אותה היה פטור",
        },
        "land_law": {
            "law_he": "חוק המקרקעין, התשכ\"ט-1969", "url": LAND_LAW,
            "partition_right": "סעיף 37", "partition_how": "סעיף 38", "partition_in_kind": "סעיף 39", "partition_sale": "סעיף 40", "spouses_home": "סעיף 40א",
            "partition_he": "כל שותף במקרקעין רשאי בכל עת לדרוש את פירוק השיתוף (סעיף 37); בהסכם, ובלעדיו בצו בית משפט (סעיף 38): חלוקה בעין כשאפשר (סעיף 39), ואם לא, מכירה וחלוקת הפדיון (סעיף 40)",
        },
        "capacity": {
            "law_he": "חוק הכשרות המשפטית והאפוטרופסות, התשכ\"ב-1962", "url": CAPACITY,
            "minor_property": "סעיף 20", "guardian": "סעיף 47",
            "he": "העברה, חלוקה או ויתור על דירה או על זכות של קטין, ועסקה בין הקטין להוריו: רק באישור בית המשפט מראש (סעיף 20); אפוטרופוס: סעיף 47",
        },
        "courts": {
            "family_he": "בית המשפט לענייני משפחה (סעיף 151 לחוק הירושה; סעיף 1(6) לחוק בית המשפט לעניני משפחה)",
            "religious_he": "בית דין דתי רשאי לתת צו ירושה או צו קיום רק כשכל הנוגעים בדבר הסכימו לכך בכתב (סעיף 155)",
            "mediation_he": "בית המשפט רשאי, בהסכמת בעלי הדין, להעביר את העניין לגישור (סעיף 79ג לחוק בתי המשפט)",
            "mediation_url": "https://www.nevo.co.il/law_html/law01/055_002.htm",
        },
        # gov.il: who may file online (the Custodian General's service), read on checked_on through Kol Zchut's mirror of
        # the service page; the rule itself is the Custodian General's, not the regulations'.
        "online_rule": {
            "he": "מייצג מגיש מקוון בלבד; מי שאינו מיוצג מגיש מקוון או ידני; כשבין היורשים יש אחים, אחיינים, סבים, דודים או בני דודים של המנוח, מגישים ידנית בלבד",
            "url": SVC_ORDER,
            "probate_url": SVC_PROBATE,
            "tabu_he": "כשלמנוח היו זכויות במקרקעין, אפשר לבקש עם הבקשה לצו גם את רישום היורשים בטאבו",
            "fees_url": SVC_FEES,
        },
        # What reg. 14 (and the service page) ask for, by condition. The planner picks the lines that apply.
        "documents": [
            {"key": "form", "he": "טופס הבקשה (טופס 1 לצו ירושה, טופס 2 לצו קיום), או הטופס המקוון, כשכל עובדה מאומתת בתצהיר", "section": "תקנה 14(א)", "when": "always"},
            {"key": "death", "he": "תעודת פטירה; כשלמנוח לא הייתה תעודת זהות ישראלית: תעודת פטירה מקורית או העתק נאמן למקור", "section": "תקנה 14(ב)", "when": "always"},
            {"key": "death_affidavit", "he": "כשאין תעודת פטירה: תצהירים על המוות מהמבקש ומאדם נוסף (הרשם רשאי לחקור את המצהירים)", "section": "תקנה 15", "when": "no_certificate"},
            {"key": "will", "he": "הצוואה המקורית; בהגשה מקוונת מוסרים אותה לרשם בתוך 7 ימים", "section": "תקנה 14(ב)", "when": "will"},
            {"key": "notice", "he": "אישור על משלוח הודעה בדואר רשום לכל היורשים (או הזוכים) על הגשת הבקשה, או תצהיר על מסירה אישית", "section": "תקנה 14(ב)", "when": "several_heirs"},
            {"key": "poa", "he": "ייפוי כוח, כשהמבקש מיוצג בידי עורך דין", "section": "תקנה 14", "when": "represented"},
            {"key": "renounce", "he": "תצהיר הסתלקות של כל יורש שמוותר על חלקו, מאומת בידי עורך דין", "section": "סעיף 6 לחוק; תקנה 16", "when": "renounce"},
            {"key": "minor_renounce", "he": "הסתלקות של קטין או של מי שמונה לו אפוטרופוס: אישור בית המשפט", "section": "סעיף 6(ג); תקנה 16", "when": "renounce_minor"},
            {"key": "predeceased", "he": "ליורש שנפטר אחרי המוריש: תעודת פטירה שלו, או צו הירושה או צו הקיום שניתן בעיזבונו", "section": "תקנה 14", "when": "predeceased"},
            {"key": "guardian", "he": "יורש קטין, חסוי או נעדר: מציינים זאת בבקשה, ומצרפים צו מינוי אפוטרופוס או ייפוי כוח מתמשך שנכנס לתוקף", "section": "טופס הבקשה (תקנה 14)", "when": "minor"},
            {"key": "foreign", "he": "מסמכים מחוץ לארץ: עם אימות (אפוסטיל) ותרגום מאושר כשהם לא בעברית, בערבית או באנגלית", "section": "הנחיות הרשם לענייני ירושה", "when": "abroad"},
            {"key": "fee", "he": "אישור תשלום האגרה והוצאות הפרסום (בלי אגרה הבקשה לא מתקבלת)", "section": "תקנה 1(ב) לתקנות האגרות; תקנה 17(ג)", "when": "always"},
            {"key": "tabu", "he": "כשיש מקרקעין: הבקשה המשולבת לרישום היורשים בטאבו, עם נסח רישום", "section": "האפוטרופוס הכללי, השירות המקוון", "when": "real_estate"},
        ],
        # The objection: what reg. 19 requires in the written objection.
        "objection_contents": [
            {"he": "פרטי המתנגד, הקשר שלו למנוח ומה הזכות שהוא טוען לה (יורש על פי דין, זוכה בצוואה אחרת, נושה)", "section": "תקנה 19"},
            {"he": "נימוקי ההתנגדות, עילה אחרי עילה, עם סעיף החוק לכל אחת", "section": "תקנה 19"},
            {"he": "תצהיר מאומת בפני עורך דין שתומך בעובדות", "section": "תקנה 19"},
            {"he": "המסמכים שתומכים בטענות: צוואה קודמת, מסמכים רפואיים, התכתבויות", "section": "תקנה 19"},
            {"he": "קבלה על תשלום האגרה, וייפוי כוח כשיש ייצוג", "section": "תקנה 19; תקנות האגרות של בית המשפט לענייני משפחה"},
            {"he": "העתקים לכל הצדדים: המתנגד ממציא את ההתנגדות למבקש", "section": "תקנה 19"},
        ],
        # Grounds to object, the section and the evidence each needs. The strength words are the tool's, the sections the law's.
        "grounds": [
            {"key": "capacity", "he": "המצווה לא ידע להבחין בטיבה של צוואה (מחלה, דמנציה, מצב רפואי בזמן החתימה)", "section": "סעיף 26", "evidence": "תיק רפואי, חוות דעת של רופא, עדות של מי שראה את המצווה באותה תקופה", "effect": "הצוואה בטלה"},
            {"key": "coercion", "he": "אונס, איום, השפעה בלתי הוגנת, תחבולה או תרמית", "section": "סעיף 30(א)", "evidence": "תלות במי שזכה, בידוד מהמשפחה, מעורבות הזוכה בעריכה, שינוי חד מצוואה קודמת", "effect": "ההוראה בטלה; אם עברה שנה מאז שפסקה ההשפעה והמצווה לא ביטל, הטענה נחלשת (סעיף 31)"},
            {"key": "mistake", "he": "הוראה שנעשתה מחמת טעות", "section": "סעיף 30(ב)", "evidence": "מה המצווה חשב ומה היה באמת; בית המשפט מתקן כשאפשר לקבוע את כוונתו", "effect": "תיקון, ואם אי אפשר, בטלות ההוראה"},
            {"key": "beneficiary", "he": "מי שערך את הצוואה, עד לה או בן זוגם זוכה בה", "section": "סעיף 35", "evidence": "מי ניסח, מי העיד, מי נכח; הקשר שלהם לזוכה", "effect": "ההוראה לטובתם בטלה"},
            {"key": "form", "he": "פגם בצורה: בלי תאריך, בלי חתימה, בלי שני עדים, לא בכתב יד המצווה", "section": "סעיפים 19 עד 23 ו-25", "evidence": "הצוואה עצמה; מי היו העדים ומה ראו", "effect": "בית המשפט רשאי לקיים למרות הפגם כשאין ספק שזו צוואת אמת (סעיף 25)"},
            {"key": "revoked", "he": "צוואה מאוחרת יותר, או ביטול מפורש או בהשמדה", "section": "סעיף 36", "evidence": "הצוואה המאוחרת, אישור הפקדה, עדים להשמדה", "effect": "המאוחרת גוברת במה שסותר"},
            {"key": "mutual", "he": "צוואה הדדית שבוטלה בלי הודעה לבן הזוג, או אחרי מותו בלי הסתלקות", "section": "סעיף 8א", "evidence": "שתי הצוואות ההדדיות, הודעת הביטול, מה קיבל הנותר", "effect": "הביטול לא תקף"},
            {"key": "unclear", "he": "אי אפשר להבין מהצוואה מי הזוכה או מה ההוראה", "section": "סעיף 33", "evidence": "נוסח הצוואה; מסמכים שמסבירים אותה", "effect": "ההוראה בטלה"},
            {"key": "illegal", "he": "הוראה בלתי חוקית, בלתי מוסרית או בלתי אפשרית", "section": "סעיף 34", "evidence": "ההוראה עצמה", "effect": "ההוראה בטלה; השאר עומד כשאפשר להפריד (סעיף 38)"},
            {"key": "forgery", "he": "חתימה או כתב יד שאינם של המצווה", "section": "סעיפים 19 ו-20", "evidence": "השוואת כתב יד, מומחה למסמכים, עדים", "effect": "אין צוואה"},
        ],
        # The dispute routes: what to file, where, the fee that applies and the clock.
        "routes": [
            {"key": "objection", "he": "התנגדות לבקשה לצו", "where": "לרשם לענייני ירושה; נדונה בבית המשפט לענייני משפחה", "fee": "family_court.objection", "clock": "days.objection", "sections": "סעיפים 67 ו-67א; תקנות 17, 19 ו-20"},
            {"key": "amend", "he": "בקשה לתיקון או לביטול צו שכבר ניתן", "where": "למי שנתן את הצו; כשאפשר היה לטעון קודם, הרשם מעביר לבית המשפט", "fee": "registrar.amend", "fee_court": "family_court.amend", "clock": "days.amend_response", "sections": "סעיף 72; תקנה 27"},
            {"key": "manager", "he": "בקשה למינוי מנהל עיזבון", "where": "לבית המשפט; לרשם רק בהסכמת כל הנוגעים בדבר", "fee": "registrar.manager", "fee_court": "family_court.manager", "sections": "סעיפים 78 ו-79; תקנות 31 עד 45"},
            {"key": "partition", "he": "תביעה לפירוק שיתוף בדירה", "where": "בית המשפט לענייני משפחה (בין קרובים) או בית משפט השלום", "fee": "family_court.property", "sections": "סעיפים 37 עד 40 לחוק המקרקעין"},
            {"key": "declaration", "he": "תביעה להצהרה על היקף העיזבון, לחשבונות או להשבה", "where": "בית המשפט לענייני משפחה", "fee": "family_court.property", "sections": "סעיפים 121 ו-122 לחוק הירושה; סעיף 1(6) לחוק בית המשפט לעניני משפחה"},
            {"key": "support", "he": "תביעה למזונות מן העיזבון", "where": "בית המשפט לענייני משפחה", "fee": "family_court.other", "clock": "days.support_after_division_months", "sections": "סעיפים 56 עד 65; תקנה 28"},
            {"key": "agreement", "he": "הסכם חלוקה בין היורשים, בלי בית משפט", "where": "בין היורשים; מגישים לרשם או לבית המשפט רק כשיש קטין או חסוי", "fee": "", "sections": "סעיף 110; סעיף 5(ג)(4) לחוק מיסוי מקרקעין"},
            {"key": "mediation", "he": "גישור בין היורשים", "where": "מגשר מוסכם, או בהפניית בית המשפט", "fee": "", "sections": "סעיף 79ג לחוק בתי המשפט"},
        ],
        "limitation": {
            "law_he": "חוק ההתיישנות, התשי\"ח-1958", "url": "https://www.nevo.co.il/law_html/law00/71809.htm",
            "years": 7, "section": "סעיף 5(1)", "land_years": 15, "land_section": "סעיף 5(2)", "discovery_section": "סעיף 8",
            "he": "תביעה שאינה במקרקעין מתיישנת אחרי 7 שנים (סעיף 5(1)); במקרקעין 15 שנים (סעיף 5(2)); כשהעובדות נעלמו מהתובע, מהיום שנודעו לו (סעיף 8)",
        },
        "service_he": "האפוטרופוס הכללי, הרשם לענייני ירושה",
        "service_url": SVC_ORDER,
    }
