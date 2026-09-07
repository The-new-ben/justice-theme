<?php
/**
 * Entity wave 3: real estate. 47 pages, researched 2026-09-07 from official
 * sources only: the official land-registry fee notice effective 1.1.2026,
 * frozen purchase-tax brackets (16.1.2024 to 15.1.2028), the planning
 * administration's TAMA 38 status page, consolidated law texts, gov.il and
 * kolzchut. Every number carries its source; the five unverifiable items
 * from the research run are excluded or rephrased without the unverified
 * number. Slugs validated against all 1,561 live site slugs and 686 head
 * words plus waves 1-2: zero collisions.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(

	array(
		'slug'      => 'second-hand-apartment-purchase-steps',
		'title'     => 'שלבי רכישת דירה יד שנייה: הצד המשפטי',
		'seo_title' => 'קניית דירה יד שנייה: השלבים המשפטיים והאגרות | Jus-Tice',
		'seo_desc'  => 'מהחוזה ועד הטאבו: דרישת הכתב, הערת אזהרה מיד אחרי החתימה, הצהרה למיסוי מקרקעין תוך 30 יום, ומדרגת האפס עד 1,978,745 שח.',
		'intro'     => 'רכישת דירה יד שנייה נגמרת מבחינת החוק רק ברישום בטאבו. אלה השלבים המשפטיים, המועדים והאגרות המעודכנות לשנת 2026.',
		'facts'     => array(
			array( 'עסקה במקרקעין טעונה רישום ונגמרת ברישום (סעיף 7 לחוק המקרקעין); ההתחייבות טעונה מסמך בכתב (סעיף 8)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'הצהרה למיסוי מקרקעין תוך 30 יום מיום העסקה (סעיף 73 לחוק מיסוי מקרקעין)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'רישום הערת אזהרה: אגרה 188 ש"ח; אגרת רישום המכר עצמו: 44 ש"ח (תעריפי 2026)', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'מס רכישה לדירה יחידה: מדרגת 0 אחוזים עד 1,978,745 ש"ח', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה', 'כל זכות' ),
		),
		'official'  => array(
			array( 'בקשה לרישום מכר', 'https://www.gov.il/he/service/bill_of_sale' ),
			array( 'הפקת נסח רישום מקרקעין', 'https://www.gov.il/he/service/land_registration_extract' ),
		),
		'related'   => array( 'warning-note-registration-tabu', 'transfer-ownership-tabu-documents', 'acquisition-tax-brackets-2026' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'developer-apartment-purchase-stages',
		'title'     => 'רכישת דירה מקבלן: שלבים והבטחת התשלומים',
		'seo_title' => 'קניית דירה מקבלן: מפרט, בטוחות ומקדמות | Jus-Tice',
		'seo_desc'  => 'מה מגיע לרוכש מקבלן: מפרט לפי חוק המכר, בטוחה על הכספים לפי חוק הבטחת השקעות, ומקדמת מס שבח רק אחרי 80 אחוזים מהתמורה.',
		'intro'     => 'קנייה מקבלן מוגנת בשני חוקים ייעודיים: חוק המכר (דירות) שמחייב מפרט ותקופות בדק, וחוק הבטחת ההשקעות שמגן על הכסף שלכם עד המסירה.',
		'facts'     => array(
			array( 'המוכר חייב לצרף לחוזה מפרט והוראות תחזוקה (סעיף 2 לחוק המכר (דירות))', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
			array( 'כספי הרוכש מובטחים בבטוחה לפי חוק המכר (דירות) (הבטחת השקעות), בדרך כלל ערבות בנקאית או פוליסת ביטוח, ובליווי בנקאי משלמים בשוברים', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
			array( 'מקדמת מס שבח ברכישה מקבלן: חובת התשלום קמה רק אחרי ששולמו מעל 80 אחוזים מהתמורה', 'https://www.kolzchut.org.il/he/תשלום_מקדמת_מס_שבח_על_ידי_הרוכש', 'כל זכות' ),
			array( 'תקופות הבדק לפי התוספת לחוק: שנה עד 7 שנים לפי סוג הליקוי, ואחריהן 3 שנות אחריות', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המכר (דירות), הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)' ),
			array( 'מיסוי מקרקעין, רשות המסים', 'https://www.gov.il/he/departments/topics/realty_taxation/govil-landing-page' ),
		),
		'related'   => array( 'guarantee-sale-law-meaning', 'warranty-bedek-periods', 'advance-shevach-payment-buyer' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'selling-apartment-documents-stages',
		'title'     => 'מכירת דירה: מסמכים, דיווחים ושלבים',
		'seo_title' => 'מכירת דירה: הדיווחים והאישורים הנדרשים | Jus-Tice',
		'seo_desc'  => 'מה המוכר חייב: הצהרה למיסוי מקרקעין תוך 30 יום, מס שבח 25 אחוזים על השבח הריאלי או פטור דירה יחידה, ואישורי מסים ועירייה לטאבו.',
		'intro'     => 'מכירת דירה היא קודם כל שרשרת של דיווחים ואישורים: בלי אישורי המסים ותעודת העירייה, הקונה לא יוכל להירשם ואתם לא תסיימו את העסקה.',
		'facts'     => array(
			array( 'הצהרת המוכר למיסוי מקרקעין: תוך 30 יום (סעיף 73)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'מס שבח ליחיד: 25 אחוזים על השבח הריאלי (סעיף 48א(ב)), אלא אם חל פטור', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'רישום המכר מותנה באישורי מיסוי מקרקעין (סעיף 16 לחוק)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'נדרשת תעודת עירייה לרשם המקרקעין על היעדר חובות', 'https://www.tel-aviv.gov.il/Residents/Assets/Pages/TransferringRights.aspx', 'עיריית תל אביב' ),
		),
		'official'  => array(
			array( 'בקשה לרישום מכר', 'https://www.gov.il/he/service/bill_of_sale' ),
			array( 'פטור ממס שבח דירה יחידה, כל זכות', 'https://www.kolzchut.org.il/he/פטור_ממס_שבח_במכירת_דירה_יחידה' ),
		),
		'related'   => array( 'appreciation-tax-single-apartment-exemption', 'clearance-certificates-tabu-transfer' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'warning-note-registration-tabu',
		'title'     => 'רישום הערת אזהרה: איך, כמה עולה ולמה מיד',
		'seo_title' => 'רישום הערת אזהרה: 188 שח וההליך המלא | Jus-Tice',
		'seo_desc'  => 'הערת אזהרה נרשמת מיד אחרי חתימת החוזה: אגרה 188 שח, מחיקה 127 שח, הבסיס בסעיפים 126-127 לחוק המקרקעין, וגם בהגשה מקוונת.',
		'intro'     => 'הערת האזהרה היא ביטוח הרישום של הקונה: היא חוסמת עסקה סותרת ומזהירה כל מי שבודק את הנכס. נרשמת בדרך כלל מיד עם חתימת החוזה.',
		'facts'     => array(
			array( 'הבסיס: סעיפים 126 עד 127 לחוק המקרקעין; ההערה מונעת רישום עסקה הסותרת את ההתחייבות', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'אגרת רישום: 188 ש"ח; אגרת מחיקה: 127 ש"ח (מ-1.1.2026)', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'קיימת הגשה דיגיטלית בהסכמת כל הצדדים, בשירות המקוון של הרשות לרישום', 'https://www.gov.il/he/departments/land_registration/govil-landing-page', 'הרשות לרישום' ),
		),
		'official'  => array(
			array( 'הרשות לרישום והסדר זכויות מקרקעין', 'https://www.gov.il/he/departments/land_registration/govil-landing-page' ),
			array( 'הודעת האגרות 2026', 'https://www.gov.il/he/pages/fees-2026' ),
		),
		'related'   => array( 'hearat-azhara-meaning', 'second-hand-apartment-purchase-steps' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'transfer-ownership-tabu-documents',
		'title'     => 'העברת בעלות בטאבו: המסמכים והשלבים',
		'seo_title' => 'העברת בעלות בטאבו: מסמכים, אישורים ואגרה | Jus-Tice',
		'seo_desc'  => 'מה צריך להעברת בעלות: שטרי מכר חתומים, אישורי מיסוי מקרקעין, תעודת עירייה, ואגרת רישום של 44 שח. ההגשה גם מקוונת.',
		'intro'     => 'העברת הבעלות בטאבו היא הקילומטר האחרון של העסקה, והיא נעצרת בלי המסמכים הנכונים. זו הרשימה המלאה, עם האגרה המעודכנת.',
		'facts'     => array(
			array( 'אגרת רישום מכר: 44 ש"ח (תעריפי 2026)', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'נדרשים אישורי מיסוי מקרקעין (סעיף 16 לחוק מיסוי מקרקעין) ותעודת עירייה על היעדר חובות', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'נדרשים שטרי מכר חתומים ומאומתים; הבקשה מוגשת ללשכת הרישום, כולל בשירות מקוון', 'https://www.gov.il/he/service/bill_of_sale', 'gov.il' ),
		),
		'official'  => array(
			array( 'בקשה לרישום מכר', 'https://www.gov.il/he/service/bill_of_sale' ),
			array( 'לשכות רישום המקרקעין', 'https://www.gov.il/he/pages/contact_chambers_registration' ),
		),
		'related'   => array( 'clearance-certificates-tabu-transfer', 'offices-land-registry-israel' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'mortgage-registration-tabu',
		'title'     => 'רישום משכנתה בטאבו: הליך ואגרה',
		'seo_title' => 'רישום משכנתה בטאבו: 188 שח וההליך | Jus-Tice',
		'seo_desc'  => 'רישום משכנתה, העברתה או שינוי תנאיה: אגרה של 188 שח לפי תעריפי 2026. ובנכסי רמי: התחייבות לרישום משכנתא מקוונת.',
		'intro'     => 'הבנק לא משחרר את כספי המשכנתה בלי רישום. אגרת הרישום קבועה בהודעת האגרות הרשמית, ובנכסי רשות מקרקעי ישראל ההתחייבות מופקת מקוון.',
		'facts'     => array(
			array( 'אגרת רישום משכנתה: 188 ש"ח, וכך גם העברת משכנתה או שינוי תנאיה (תעריפי 2026)', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'בנכסי רשות מקרקעי ישראל מופקת התחייבות לרישום משכנתא בשירות מקוון', 'https://www.gov.il/he/departments/israel_land_authority/govil-landing-page', 'רמ"י' ),
		),
		'official'  => array(
			array( 'הודעת האגרות 2026', 'https://www.gov.il/he/pages/fees-2026' ),
			array( 'רשות מקרקעי ישראל', 'https://www.gov.il/he/departments/israel_land_authority/govil-landing-page' ),
		),
		'related'   => array( 'removing-mortgage-after-repayment', 'second-hand-apartment-purchase-steps' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'removing-mortgage-after-repayment',
		'title'     => 'מחיקת משכנתה אחרי סילוק ההלוואה',
		'seo_title' => 'מחיקת משכנתה מהטאבו: מתי חינם ומתי 188 שח | Jus-Tice',
		'seo_desc'  => 'סילקתם את המשכנתה? רישום פדיון מלא כשהכסף שולם ישירות לבעל המשכנתה פטור מאגרה. נדרש שטר פדיון מהבנק.',
		'intro'     => 'משכנתה שסולקה לא נמחקת לבד מהטאבו. צריך לרשום פדיון, ובתרחיש הנפוץ, כשהכסף שולם ישירות לבנק, המחיקה אפילו לא עולה כסף.',
		'facts'     => array(
			array( 'רישום פדיון מלא של משכנתה כשהכסף שולם ישירות לבעל המשכנתה: פטור מכל אגרה (תעריפי 2026)', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'אם הכסף הופקד בלשכה: אגרה 188 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'נדרש שטר פדיון מהבנק בעל המשכנתה, לפי נוהלי הרשות לרישום', 'https://www.gov.il/he/departments/land_registration/govil-landing-page', 'הרשות לרישום' ),
		),
		'official'  => array(
			array( 'הרשות לרישום והסדר זכויות מקרקעין', 'https://www.gov.il/he/departments/land_registration/govil-landing-page' ),
		),
		'related'   => array( 'mortgage-registration-tabu', 'nesach-tabu-online-cost' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'gift-transfer-apartment-relatives',
		'title'     => 'העברה ללא תמורה בין קרובים: מס ורישום',
		'seo_title' => 'העברת דירה במתנה לקרוב: שליש מס רכישה | Jus-Tice',
		'seo_desc'  => 'מתנה לקרוב: מס רכישה של שליש מהרגיל, פטור מס שבח לנותן לפי סעיף 62, תקופות צינון של 3 עד 4 שנים למקבל, ואגרת רישום 44 שח.',
		'intro'     => 'העברת דירה במתנה בין קרובים נהנית ממס מופחת, אבל יש לה כללים משלה: מי נחשב קרוב, מה הפטור של הנותן, וכמה שנים המקבל חייב לחכות לפני שימכור בפטור.',
		'facts'     => array(
			array( 'מס רכישה למקבל המתנה: שליש מהמס הרגיל (תקנה 20 לתקנות מס רכישה); קרוב: בן זוג, הורה, צאצא, בן זוג של צאצא, אח ואחות', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה', 'כל זכות' ),
			array( 'מתנה לקרוב פטורה ממס שבח אצל הנותן (סעיף 62 לחוק מיסוי מקרקעין)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'תקופות צינון למקבל שמוכר בפטור: 3 עד 4 שנים (סעיף 49ו)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'אגרת רישום ההעברה: 44 ש"ח (תעריפי 2026)', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
		),
		'official'  => array(
			array( 'חוק מיסוי מקרקעין, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)' ),
		),
		'related'   => array( 'mecher-lelo-tmura-term', 'acquisition-tax-brackets-2026' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'condominium-registration-order',
		'title'     => 'רישום בית משותף: תנאים, מסמכים ואגרות',
		'seo_title' => 'רישום בית משותף: התנאים והאגרות 2026 | Jus-Tice',
		'seo_desc'  => 'בית עם שתי דירות ומעלה ראוי להירשם כבית משותף: בקשה 163 שח ועוד 98 שח לדירה, צו של המפקח, תשריט ותקנון.',
		'intro'     => 'רישום בית משותף מסדיר את הבעלות הנפרדת על כל דירה ואת הרכוש המשותף. הצו ניתן על ידי המפקח על רישום המקרקעין, ואלה התנאים והאגרות.',
		'facts'     => array(
			array( 'בית עם שתי דירות או יותר ראוי להירשם כבית משותף (סעיף 142 לחוק המקרקעין); הצו ניתן על ידי המפקח (סעיף 143)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'אגרות 2026: בקשה 163 ש"ח ועוד 98 ש"ח לכל דירה; רישום תקנון מוסכם 163 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'נדרשים תשריט של הבית ותקנון', 'https://www.gov.il/he/departments/land_registration/govil-landing-page', 'הרשות לרישום' ),
		),
		'official'  => array(
			array( 'חוק המקרקעין', 'https://he.wikisource.org/wiki/חוק_המקרקעין' ),
			array( 'הודעת האגרות 2026', 'https://www.gov.il/he/pages/fees-2026' ),
		),
		'related'   => array( 'amending-condominium-order', 'shared-house-common-property', 'supervisor-condominium-disputes' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'amending-condominium-order',
		'title'     => 'תיקון צו בית משותף: מתי ואיך',
		'seo_title' => 'תיקון צו בית משותף: ההליך והאגרות | Jus-Tice',
		'seo_desc'  => 'הרחבתם, פיצלתם או הצמדתם? צו הבית המשותף מתוקן אצל המפקח לפי סעיף 145: בקשה 163 שח ועוד 98 שח לכל דירה שנוספה.',
		'intro'     => 'כשהבניין משתנה, הצו חייב להתעדכן: הרחבות, הצמדות ופיצולים דורשים תיקון צו בית משותף אצל המפקח על רישום המקרקעין.',
		'facts'     => array(
			array( 'המפקח רשאי לתקן צו רישום לאחר מתן הודעה לנוגעים בדבר (סעיף 145 לחוק המקרקעין)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'אגרות 2026: בקשה לתיקון צו 163 ש"ח; עם הגשת טענות 163 ש"ח; ולכל דירה שהוספה בצו 98 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
		),
		'official'  => array(
			array( 'חוק המקרקעין', 'https://he.wikisource.org/wiki/חוק_המקרקעין' ),
			array( 'הודעת האגרות 2026', 'https://www.gov.il/he/pages/fees-2026' ),
		),
		'related'   => array( 'condominium-registration-order', 'supervisor-condominium-disputes' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'leasehold-capitalization-rami',
		'title'     => 'היוון חכירה והקניית בעלות ברמ"י',
		'seo_title' => 'חוזה חכירה מהוון והקניית בעלות מרמ"י | Jus-Tice',
		'seo_desc'  => 'רפורמת רמי מקנה בעלות לחוכרים עירוניים בחוזה מהוון, בחלק מהנכסים ללא תמורה. מה זה היוון ואיך בודקים את הזכויות.',
		'intro'     => 'רוב קרקעות המדינה מוחכרות ולא נמכרות, אבל רפורמת רשות מקרקעי ישראל משנה את התמונה: חוכרים עירוניים בחוזה מהוון מקבלים בעלות, חלקם בלי לשלם.',
		'facts'     => array(
			array( 'ברפורמת רמ"י מוקנית בעלות לחוכרים עירוניים בחוזה מהוון, בחלק מהנכסים ללא תמורה', 'https://www.gov.il/he/pages/reform-1', 'רמ"י' ),
			array( 'תפקידי הרשות קבועים בסעיף 2א לחוק רשות מקרקעי ישראל, ובהם קידום הרישום בפנקסי המקרקעין', 'https://he.wikisource.org/wiki/חוק_רשות_מקרקעי_ישראל', 'נוסח החוק' ),
			array( 'שירותי מידע על נכס ואישור זכויות זמינים מקוון במערכת רמ"י שלי', 'https://www.gov.il/he/departments/israel_land_authority/govil-landing-page', 'רמ"י' ),
		),
		'official'  => array(
			array( 'עמוד הרפורמה של רמ"י', 'https://www.gov.il/he/pages/reform-1' ),
			array( 'חוק רשות מקרקעי ישראל', 'https://he.wikisource.org/wiki/חוק_רשות_מקרקעי_ישראל' ),
		),
		'related'   => array( 'rami-israel-land-authority', 'hachira-ledorot-meaning' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'planning-information-request',
		'title'     => 'תיק מידע להיתר: הגשה, זמנים ותוקף',
		'seo_title' => 'תיק מידע להיתר בנייה: 30 ימי עבודה ותוקף שנתיים | Jus-Tice',
		'seo_desc'  => 'הוועדה המקומית מוסרת תיק מידע תוך 30 ימי עבודה עם הארכה אפשרית של 30 יום, בתנאי תשלום אגרה. התוקף שנתיים וההגשה ברישוי זמין.',
		'intro'     => 'לפני שמתכננים בנייה, מבקשים תיק מידע מהוועדה המקומית. תקנות רישוי הבנייה קובעות לוח זמנים מחייב לוועדה ותוקף לתשובה.',
		'facts'     => array(
			array( 'הוועדה מוסרת תיק מידע תוך 30 ימי עבודה, עם אפשרות הארכה ב-30 יום במקרים מורכבים (תקנות רישוי בנייה, התשע"ו-2016)', 'https://he.wikisource.org/wiki/תקנות_התכנון_והבנייה_(רישוי_בנייה)', 'התקנות' ),
			array( 'תנאי לקליטת הבקשה: תשלום אגרה', 'https://he.wikisource.org/wiki/תקנות_התכנון_והבנייה_(רישוי_בנייה)', 'התקנות' ),
			array( 'תוקף תיק המידע: שנתיים; ההגשה דרך מערכת רישוי זמין', 'https://www.gov.il/he/departments/iplan/govil-landing-page', 'מינהל התכנון' ),
		),
		'official'  => array(
			array( 'מינהל התכנון', 'https://www.gov.il/he/departments/iplan/govil-landing-page' ),
		),
		'related'   => array( 'local-planning-committees', 'opposing-city-building-plan' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'opposing-city-building-plan',
		'title'     => 'התנגדות לתוכנית בניין עיר: מי, מתי, איך',
		'seo_title' => 'התנגדות לתב"ע: 60 יום ומי רשאי להגיש | Jus-Tice',
		'seo_desc'  => 'כל מי שעשוי להיפגע מתוכנית רשאי להתנגד לפי סעיף 100 לחוק התכנון והבנייה, בתוך 60 יום מהפרסום, גם בשירות מקוון חינמי.',
		'intro'     => 'תוכנית בניין עיר שמופקדת פותחת חלון התנגדויות. סעיפים 100 עד 103 לחוק התכנון והבנייה קובעים מי רשאי, עד מתי, ואיך מגישים.',
		'facts'     => array(
			array( 'כל מי שעשוי לראות את עצמו נפגע מהתוכנית רשאי להתנגד (סעיף 100 לחוק התכנון והבנייה)', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'המועד: 60 יום מהפרסום (סעיף 102)', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'מינהל התכנון מפעיל שירות מקוון חינמי להגשת התנגדות', 'https://www.gov.il/he/departments/iplan/govil-landing-page', 'מינהל התכנון' ),
		),
		'official'  => array(
			array( 'חוק התכנון והבנייה', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה' ),
			array( 'אתר מידע תכנוני', 'https://mavat.iplan.gov.il' ),
		),
		'related'   => array( 'vaadot-arar-planning-building', 'local-planning-committees' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'acquisition-tax-brackets-2026',
		'title'     => 'מדרגות מס רכישה 2026: דירה יחידה ודירה נוספת',
		'seo_title' => 'מס רכישה 2026: כל המדרגות והסכומים | Jus-Tice',
		'seo_desc'  => 'דירה יחידה: 0 אחוזים עד 1,978,745 שח ובהדרגה עד 10 אחוזים. דירה נוספת: 8 אחוזים עד 6,055,070 שח ו-10 מעל. המדרגות קפואות עד 2028.',
		'intro'     => 'אלה מדרגות מס הרכישה בתוקף, קפואות מ-16.1.2024 עד 15.1.2028. החישוב מדורג: כל מדרגה חלה רק על החלק שבתוכה. הבסיס בסעיף 9 לחוק מיסוי מקרקעין.',
		'facts'     => array(
			array( 'דירה יחידה: 0 אחוזים עד 1,978,745 ש"ח; 3.5 אחוזים עד 2,347,040 ש"ח; 5 אחוזים עד 6,055,070 ש"ח; 8 אחוזים עד 20,183,565 ש"ח; 10 אחוזים מעל', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה', 'כל זכות' ),
			array( 'דירה נוספת: 8 אחוזים עד 6,055,070 ש"ח ו-10 אחוזים מעל', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה', 'כל זכות' ),
			array( 'החישוב מדורג, והבסיס בסעיף 9 לחוק מיסוי מקרקעין', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'סימולטור רשמי של רשות המסים זמין לחישוב מדויק', 'https://www.misim.gov.il/svsimurechisha', 'רשות המסים' ),
		),
		'official'  => array(
			array( 'סימולטור מס רכישה, רשות המסים', 'https://www.misim.gov.il/svsimurechisha' ),
			array( 'חישוב מס רכישה, כל זכות', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה' ),
		),
		'related'   => array( 'olim-disabled-purchase-tax-relief', 'refund-purchase-tax-replacement' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'appreciation-tax-single-apartment-exemption',
		'title'     => 'מס שבח ופטור דירה יחידה',
		'seo_title' => 'פטור מס שבח דירה יחידה: התנאים והתקרה | Jus-Tice',
		'seo_desc'  => 'מס שבח ליחיד 25 אחוזים על השבח הריאלי, ופטור דירה יחידה לפי סעיף 49ב(2): בעלות 18 חודשים, דירה אחת, ותקרה של 5,008,000 שח.',
		'intro'     => 'מכירת דירה יחידה יכולה להיות פטורה לגמרי ממס שבח, אם עומדים בתנאי סעיף 49ב(2). מעל התקרה, החלק העודף חייב במס.',
		'facts'     => array(
			array( 'שיעור מס השבח ליחיד: 25 אחוזים על השבח הריאלי (סעיף 48א(ב))', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'תנאי הפטור: בעלות על הדירה 18 חודשים לפחות, והיא הדירה היחידה במועד המכירה (סעיף 49ב(2))', 'https://www.kolzchut.org.il/he/פטור_ממס_שבח_במכירת_דירה_יחידה', 'כל זכות' ),
			array( 'תקרת הפטור: 5,008,000 ש"ח (בתוקף 2024 עד 2027)', 'https://www.kolzchut.org.il/he/פטור_ממס_שבח_במכירת_דירה_יחידה', 'כל זכות' ),
			array( 'דירה של בן זוג או ילד קטין נספרת במניין הדירות', 'https://www.kolzchut.org.il/he/פטור_ממס_שבח_במכירת_דירה_יחידה', 'כל זכות' ),
		),
		'official'  => array(
			array( 'פטור מס שבח דירה יחידה, כל זכות', 'https://www.kolzchut.org.il/he/פטור_ממס_שבח_במכירת_דירה_יחידה' ),
			array( 'חוק מיסוי מקרקעין', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)' ),
		),
		'related'   => array( 'shevach-rechisha-taxation-law-1963', 'advance-shevach-payment-buyer' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'betterment-levy-israel',
		'title'     => 'היטל השבחה: מהות, שיעור ומועד תשלום',
		'seo_title' => 'היטל השבחה: 50 אחוזים ומתי משלמים | Jus-Tice',
		'seo_desc'  => 'היטל ההשבחה הוא מחצית מעליית השווי שיצרה תוכנית, הקלה או שימוש חורג, ומשולם במימוש: מכירה או היתר. כולל פטור הרחבה עד 140 מר.',
		'intro'     => 'כשתוכנית חדשה מעלה את שווי הנכס שלכם, הוועדה המקומית גובה מחצית מהעלייה. זה היטל ההשבחה, מכוח התוספת השלישית לחוק התכנון והבנייה.',
		'facts'     => array(
			array( 'השיעור: מחצית (50 אחוזים) מההשבחה (התוספת השלישית לחוק התכנון והבנייה, מכוח סעיף 196א)', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'משולם לוועדה המקומית בעת מימוש זכויות: מכירה או קבלת היתר', 'https://www.kolzchut.org.il/he/היטל_השבחה', 'כל זכות' ),
			array( 'נוצר מאישור תוכנית, הקלה או שימוש חורג', 'https://www.kolzchut.org.il/he/היטל_השבחה', 'כל זכות' ),
			array( 'פטור לבנייה או הרחבה של דירת מגורים עד 140 מ"ר, בתנאי מגורים 4 שנים (סעיף 19(ג)(1) לתוספת)', 'https://www.kolzchut.org.il/he/היטל_השבחה', 'כל זכות' ),
			array( 'רישום הערה על חוב היטל בטאבו: 182 ש"ח (תעריפי 2026)', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
		),
		'official'  => array(
			array( 'היטל השבחה, כל זכות', 'https://www.kolzchut.org.il/he/היטל_השבחה' ),
			array( 'חוק התכנון והבנייה', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה' ),
		),
		'related'   => array( 'vaadot-arar-planning-building', 'tichnun-construction-law-1965' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'tabu-registration-fees-2026',
		'title'     => 'אגרות רישום מקרקעין 2026: הטבלה המלאה',
		'seo_title' => 'אגרות טאבו 2026: כל הסכומים הרשמיים | Jus-Tice',
		'seo_desc'  => 'מכר 44 שח, משכנתה 188 שח, הערת אזהרה 188 שח, נסח מקוון 18 שח, בית משותף 163 שח ועוד. מההודעה הרשמית בתוקף מ-1.1.2026.',
		'intro'     => 'זו טבלת אגרות רישום המקרקעין המלאה, מתוך הודעת המקרקעין (אגרות) הרשמית שבתוקף מ-1 בינואר 2026.',
		'facts'     => array(
			array( 'עסקאות: רישום מכר או שכירות 44 ש"ח; משכנתה 188 ש"ח; ירושה 188 ש"ח; הערת אזהרה 188 ש"ח ומחיקתה 127 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'תשריטים: פיצול או איחוד 158 ש"ח לחלקה; רישום ראשון 2 אחוזים מהשווי; מחיקת רישום 121 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'בתים משותפים: בקשה 163 ש"ח ועוד 98 ש"ח לדירה; תקנון מוסכם 163 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'נסחים ועיון: נסח מקוון 18 ש"ח; נסח מאושר 88 ש"ח; נסח מרוכז 154 ש"ח; עיון בפנקסים 85 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'זיקת הנאה: רישום 164 ש"ח או 103 ש"ח לפי סוג הבקשה', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
		),
		'official'  => array(
			array( 'הודעת האגרות 2026', 'https://www.gov.il/he/pages/fees-2026' ),
		),
		'related'   => array( 'nesach-tabu-online-cost', 'warning-note-registration-tabu' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'olim-disabled-purchase-tax-relief',
		'title'     => 'מס רכישה לעולים ולנכים: השיעורים המיוחדים',
		'seo_title' => 'הנחת מס רכישה לעולה חדש ולנכה | Jus-Tice',
		'seo_desc'  => 'עולים: 0 אחוזים עד 1,978,745 שח ו-0.5 אחוזים עד 6,055,070 שח בדירה יחידה. נכים: 0.5 אחוזים, פעמיים בחיים. כל התנאים.',
		'intro'     => 'עולים חדשים ונכים זכאים לשיעורי מס רכישה מיוחדים, לפי תקנות מס רכישה. אלה השיעורים והתנאים המעודכנים.',
		'facts'     => array(
			array( 'עולים (מ-15.8.2024, דירה יחידה): 0 אחוזים עד 1,978,745 ש"ח; 0.5 אחוזים עד 6,055,070 ש"ח; 8 אחוזים עד התקרה (תקנות 12 ו-12א)', 'https://www.kolzchut.org.il/he/הנחה_במס_רכישה_לעולים', 'כל זכות' ),
			array( 'חלון הזכאות לעולה: משנה לפני העלייה עד 7 שנים אחריה', 'https://www.kolzchut.org.il/he/הנחה_במס_רכישה_לעולים', 'כל זכות' ),
			array( 'נכים (תקנה 11, דירה יחידה עד 2,500,000 ש"ח): 0 אחוזים עד 1,978,745 ש"ח ו-0.5 אחוזים על היתרה; בכל מקרה אחר 0.5 אחוזים על כל השווי', 'https://www.kolzchut.org.il/he/הנחה_במס_רכישה_לנכים', 'כל זכות' ),
			array( 'הזכאות לנכה: פעמיים בחיים; דרגות מזכות ובהן 75 אחוזי אי כושר לצמיתות או 100 אחוזים רפואית', 'https://www.kolzchut.org.il/he/הנחה_במס_רכישה_לנכים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'הנחה במס רכישה לעולים, כל זכות', 'https://www.kolzchut.org.il/he/הנחה_במס_רכישה_לעולים' ),
			array( 'הנחה במס רכישה לנכים, כל זכות', 'https://www.kolzchut.org.il/he/הנחה_במס_רכישה_לנכים' ),
		),
		'related'   => array( 'acquisition-tax-brackets-2026', 'shevach-rechisha-taxation-law-1963' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'advance-shevach-payment-buyer',
		'title'     => 'מקדמת מס שבח שמשלם הרוכש',
		'seo_title' => 'מקדמת מס שבח: 7.5 או 15 אחוזים ומתי | Jus-Tice',
		'seo_desc'  => 'הרוכש מעביר חלק מהתמורה ישירות לרשות המסים כמקדמה על חשבון מס השבח של המוכר: השיעורים, המועד, והחריג של דירת מגורים מזכה.',
		'intro'     => 'תיקון 70 לחוק מיסוי מקרקעין הפך את הרוכש לצינור תשלום: חלק מהתמורה עובר ישירות לרשות המסים כמקדמה על חשבון מס השבח של המוכר.',
		'facts'     => array(
			array( 'השיעור: 15 אחוזים מהתמורה כשיום הרכישה של המוכר עד 7.11.2001, ו-7.5 אחוזים אחריו; ברכישה מחברה תמיד 7.5 אחוזים (סעיף 15(ב) עד (ה))', 'https://www.kolzchut.org.il/he/תשלום_מקדמת_מס_שבח_על_ידי_הרוכש', 'כל זכות' ),
			array( 'חובת התשלום קמה אחרי ששולמו מעל 40 אחוזים מהתמורה, וברכישה מקבלן מעל 80 אחוזים', 'https://www.kolzchut.org.il/he/תשלום_מקדמת_מס_שבח_על_ידי_הרוכש', 'כל זכות' ),
			array( 'המקדמה לא חלה כשנתבקש פטור דירת מגורים מזכה', 'https://www.kolzchut.org.il/he/תשלום_מקדמת_מס_שבח_על_ידי_הרוכש', 'כל זכות' ),
		),
		'official'  => array(
			array( 'מקדמת מס שבח, כל זכות', 'https://www.kolzchut.org.il/he/תשלום_מקדמת_מס_שבח_על_ידי_הרוכש' ),
			array( 'חוק מיסוי מקרקעין', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)' ),
		),
		'related'   => array( 'selling-apartment-documents-stages', 'appreciation-tax-single-apartment-exemption' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'clearance-certificates-tabu-transfer',
		'title'     => 'אישורי מסים לטאבו: מה נדרש להעברת זכויות',
		'seo_title' => 'אישורי מסים לטאבו: שבח, רכישה ועירייה | Jus-Tice',
		'seo_desc'  => 'בלי אישורי מס שבח ומס רכישה אין רישום (סעיף 16), ונדרשת גם תעודת עירייה על היעדר חובות כולל היטל השבחה.',
		'intro'     => 'הטאבו לא רושם עסקה בלי שרשות המסים והעירייה אישרו שאין חובות. אלה האישורים הנדרשים ומאיפה מוציאים אותם.',
		'facts'     => array(
			array( 'אין רישום עסקה בלי אישורי מיסוי מקרקעין: מס שבח ומס רכישה (סעיף 16 לחוק מיסוי מקרקעין)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'נדרשת תעודת עירייה לרשם המקרקעין על היעדר חובות, כולל היטל השבחה', 'https://www.tel-aviv.gov.il/Residents/Assets/Pages/TransferringRights.aspx', 'עיריית תל אביב' ),
			array( 'ההצהרות למיסוי מקרקעין מוגשות תוך 30 יום (סעיף 73), ומצב השומה נבדק בשירות מקוון', 'https://www.gov.il/he/service/real_estate_shuma', 'gov.il' ),
		),
		'official'  => array(
			array( 'בדיקת מצב שומה', 'https://www.gov.il/he/service/real_estate_shuma' ),
		),
		'related'   => array( 'transfer-ownership-tabu-documents', 'selling-apartment-documents-stages' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'refund-purchase-tax-replacement',
		'title'     => 'החזר מס רכישה במכירת הדירה הישנה',
		'seo_title' => 'החזר מס רכישה: חלון 24 החודשים | Jus-Tice',
		'seo_desc'  => 'קניתם דירה חלופית לפני שמכרתם את הישנה? מכירה בתוך 24 חודשים מזכה בחישוב לפי מדרגות דירה יחידה ובהחזר ההפרש.',
		'intro'     => 'מי שקונה דירה חדשה לפני שמכר את הישנה משלם תחילה מס כדירה נוספת, אבל החוק נותן חלון: מכירת הדירה הישנה בזמן מזכה בחישוב מחדש ובהחזר.',
		'facts'     => array(
			array( 'רוכש דירה חלופית נחשב בעל דירה יחידה אם מכר את הדירה הקודמת בתוך 24 חודשים', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה', 'כל זכות' ),
			array( 'אחרי המכירה מדווחים למשרד מיסוי מקרקעין ומקבלים חישוב מחדש והחזר של ההפרש', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חישוב מס רכישה, כל זכות', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה' ),
			array( 'סימולטור רשות המסים', 'https://www.misim.gov.il/svsimurechisha' ),
		),
		'related'   => array( 'acquisition-tax-brackets-2026', 'appreciation-tax-single-apartment-exemption' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'offices-land-registry-israel',
		'title'     => 'לשכות רישום המקרקעין: פריסה ויצירת קשר',
		'seo_title' => 'לשכות הטאבו בישראל: הרשימה המלאה | Jus-Tice',
		'seo_desc'  => 'תשע לשכות רישום מקרקעין ושתי שלוחות, מוקד 8653 כוכבית, קבלת קהל בזימון תור, ודואל ייעודי לכל לשכה.',
		'intro'     => 'תשע לשכות רישום מקרקעין פועלות ברחבי הארץ, ולכל אחת אזור שיפוט משלה. הרשימה מהעמוד הרשמי של הרשות לרישום.',
		'facts'     => array(
			array( 'הלשכות: ירושלים, תל אביב, חיפה, באר שבע, חולון, נצרת, נתניה, פתח תקווה ורחובות, ולצדן שלוחות בעכו ובאשדוד', 'https://www.gov.il/he/pages/contact_chambers_registration', 'gov.il' ),
			array( 'מוקד טלפוני ארצי: 8653 כוכבית; קבלת קהל בזימון תור מראש', 'https://www.gov.il/he/pages/contact_chambers_registration', 'gov.il' ),
			array( 'לכל לשכה דואר אלקטרוני ייעודי', 'https://www.gov.il/he/pages/contact_chambers_registration', 'gov.il' ),
		),
		'official'  => array(
			array( 'לשכות רישום המקרקעין', 'https://www.gov.il/he/pages/contact_chambers_registration' ),
		),
		'related'   => array( 'bureau-land-registration-settlement', 'transfer-ownership-tabu-documents' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'bureau-land-registration-settlement',
		'title'     => 'הרשות לרישום והסדר זכויות מקרקעין',
		'seo_title' => 'הרשות לרישום מקרקעין: תפקידים ושירותים | Jus-Tice',
		'seo_desc'  => 'ארבעת תחומי הרשות: רישום מקרקעין, המפקחים על הבתים המשותפים, הסדר זכויות, והלשכה הארצית לתשתיות. כולל שירותים דיגיטליים.',
		'intro'     => 'הרשות לרישום והסדר זכויות מקרקעין במשרד המשפטים היא הגוף שמאחורי הטאבו. אלה תחומי הפעילות והשירותים הדיגיטליים שלה.',
		'facts'     => array(
			array( 'ארבעה תחומים: רישום מקרקעין, מפקחים על רישום מקרקעין בהליך מנהלי ושיפוטי, הסדר זכויות, ולשכה ארצית לרישום תשתיות לאומיות', 'https://www.gov.il/he/departments/land_registration/govil-landing-page', 'gov.il' ),
			array( 'הרשות מפעילה שירותים דיגיטליים, ובהם רישום הערת אזהרה מקוון והפקת נסחים', 'https://www.gov.il/he/departments/land_registration/govil-landing-page', 'gov.il' ),
		),
		'official'  => array(
			array( 'דף הרשות לרישום', 'https://www.gov.il/he/departments/land_registration/govil-landing-page' ),
		),
		'related'   => array( 'offices-land-registry-israel', 'supervisor-condominium-disputes' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'rami-israel-land-authority',
		'title'     => 'רשות מקרקעי ישראל: מה היא מנהלת',
		'seo_title' => 'רמ"י: תפקידים, מועצה ומוקד | Jus-Tice',
		'seo_desc'  => 'רשות מקרקעי ישראל מנהלת את מרבית קרקעות המדינה: הקצאת קרקע, הגנת זכויות וקידום רישום. מוקד 5575 כוכבית.',
		'intro'     => 'רוב הקרקע בישראל היא קרקע מדינה, ורשות מקרקעי ישראל מנהלת אותה. הרשות הוקמה ב-2010 כגלגולו של מינהל מקרקעי ישראל.',
		'facts'     => array(
			array( 'הרשות מנהלת את מרבית הקרקעות בשטח מדינת ישראל', 'https://www.gov.il/he/departments/israel_land_authority/govil-landing-page', 'gov.il' ),
			array( 'תפקידיה בסעיף 2א לחוק: הקצאת קרקע למגורים, הגנת זכויות בעלים וחוכרים, קידום רישום ומניעת ריכוזיות', 'https://he.wikisource.org/wiki/חוק_רשות_מקרקעי_ישראל', 'נוסח החוק' ),
			array( 'מועצת מקרקעי ישראל מונה 13 חברים (סעיף 4א); מוקד הרשות: 5575 כוכבית', 'https://www.gov.il/he/departments/israel_land_authority/govil-landing-page', 'gov.il' ),
		),
		'official'  => array(
			array( 'רשות מקרקעי ישראל', 'https://www.gov.il/he/departments/israel_land_authority/govil-landing-page' ),
			array( 'חוק רשות מקרקעי ישראל', 'https://he.wikisource.org/wiki/חוק_רשות_מקרקעי_ישראל' ),
		),
		'related'   => array( 'leasehold-capitalization-rami', 'hachira-ledorot-meaning' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'misui-mekarkein-regional-offices',
		'title'     => 'משרדי מיסוי מקרקעין: מי מטפל בעסקה שלכם',
		'seo_title' => 'משרדי מיסוי מקרקעין האזוריים ובדיקת שומה | Jus-Tice',
		'seo_desc'  => 'העסקה מדווחת למשרד מיסוי המקרקעין האזורי לפי מיקום הנכס. בדיקת מצב שומה מקוונת ומערכת מייצגים, עם קישורים רשמיים.',
		'intro'     => 'הצהרות מס שבח ומס רכישה מטופלות במשרד מיסוי המקרקעין האזורי שבתחומו נמצא הנכס. את מצב השומה בודקים היום בלי לצאת מהבית.',
		'facts'     => array(
			array( 'הטיפול בעסקאות נעשה במשרדים אזוריים לפי מיקום הנכס; לכל משרד עמוד רשמי עם פרטי קשר', 'https://www.gov.il/he/government-service-branches/real-estate-taxation-central-2', 'gov.il' ),
			array( 'מצב שומה נבדק בשירות מקוון רשמי', 'https://www.gov.il/he/service/real_estate_shuma', 'gov.il' ),
			array( 'מייצגים עובדים מול הרשות במערכת מייצגים ייעודית', 'https://www.gov.il/he/service/real_estate_representative_system', 'gov.il' ),
		),
		'official'  => array(
			array( 'בדיקת מצב שומה', 'https://www.gov.il/he/service/real_estate_shuma' ),
			array( 'מיסוי מקרקעין, רשות המסים', 'https://www.gov.il/he/departments/topics/realty_taxation/govil-landing-page' ),
		),
		'related'   => array( 'acquisition-tax-brackets-2026', 'clearance-certificates-tabu-transfer' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'local-planning-committees',
		'title'     => 'הוועדות המקומיות לתכנון ובנייה',
		'seo_title' => 'הוועדה המקומית לתכנון ובנייה: סמכויות | Jus-Tice',
		'seo_desc'  => 'הוועדה המקומית מנפיקה היתרי בנייה ותיקי מידע, גובה היטל השבחה ומקבלת דיווחי עבודות פטורות. כך עובדים מולה.',
		'intro'     => 'הוועדה המקומית לתכנון ובנייה היא הכתובת לכל מה שקשור בבנייה בעיר שלכם: היתרים, מידע תכנוני והיטל השבחה.',
		'facts'     => array(
			array( 'הוועדות מנפיקות היתרי בנייה (סעיף 145 לחוק התכנון והבנייה) ותיקי מידע בתוך 30 ימי עבודה', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'גובות היטל השבחה מכוח התוספת השלישית לחוק', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'דיווח על עבודות פטורות מהיתר לפי תקנות 2014 נעשה לוועדה המקומית', 'https://www.gov.il/he/departments/iplan/govil-landing-page', 'מינהל התכנון' ),
		),
		'official'  => array(
			array( 'מינהל התכנון', 'https://www.gov.il/he/departments/iplan/govil-landing-page' ),
		),
		'related'   => array( 'planning-information-request', 'vaadot-arar-planning-building', 'minhal-hatichnun-israel' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'vaadot-arar-planning-building',
		'title'     => 'ועדות הערר לתכנון ובנייה: מתי פונים',
		'seo_title' => 'ועדת ערר לתכנון ובנייה: על מה ואיך עוררים | Jus-Tice',
		'seo_desc'  => 'ועדת ערר בכל מחוז דנה בעררים על החלטות הוועדות המקומיות, בפיצויי סעיף 197 ובהיטל השבחה. ההגשה גם מקוונת.',
		'intro'     => 'מי שנפגע מהחלטת ועדה מקומית לא חייב ללכת ישר לבית משפט: בכל מחוז פועלת ועדת ערר לתכנון ובנייה, בראשות עורך דין.',
		'facts'     => array(
			array( 'ועדת ערר פועלת בכל מחוז, ובראשה עורך דין בעל ותק של 5 שנים לפחות (סעיף 12א לחוק התכנון והבנייה)', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'הוועדה דנה בעררים על החלטות ואי החלטות של ועדות מקומיות, וגם בפיצויי סעיף 197 ובהיטל השבחה', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'הגשה מקוונת דרך מינהל התכנון, למעט עררי פיצויים והיטל השבחה', 'https://www.gov.il/he/departments/iplan/govil-landing-page', 'מינהל התכנון' ),
		),
		'official'  => array(
			array( 'חוק התכנון והבנייה', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה' ),
			array( 'מינהל התכנון', 'https://www.gov.il/he/departments/iplan/govil-landing-page' ),
		),
		'related'   => array( 'opposing-city-building-plan', 'betterment-levy-israel' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'supervisor-condominium-disputes',
		'title'     => 'המפקח על רישום המקרקעין: סכסוכי בתים משותפים',
		'seo_title' => 'סכסוך שכנים בבית משותף: המפקח מכריע | Jus-Tice',
		'seo_desc'  => 'למפקח על רישום המקרקעין סמכות שיפוטית בסכסוכים בין בעלי דירות לפי סעיפים 72 עד 77, והערעור על החלטתו לבית המשפט המחוזי.',
		'intro'     => 'סכסוך בין שכנים בבית משותף לא מתחיל בבית משפט: הסמכות נתונה למפקח על רישום המקרקעין, שהוא גם ערכאה שיפוטית ייעודית.',
		'facts'     => array(
			array( 'למפקח סמכות שיפוטית בסכסוכים בין בעלי דירות בבית משותף (סעיפים 72 עד 77 לחוק המקרקעין)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'ערעור על החלטת המפקח: לבית המשפט המחוזי', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'המפקח גם נותן את צו רישום הבית המשותף (סעיף 143) ומתקן אותו (סעיף 145)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'הרשות לרישום והסדר זכויות מקרקעין', 'https://www.gov.il/he/departments/land_registration/govil-landing-page' ),
		),
		'related'   => array( 'condominium-registration-order', 'shared-house-common-property' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'minhal-hatichnun-israel',
		'title'     => 'מינהל התכנון: מערכות ושירותים',
		'seo_title' => 'מינהל התכנון: רישוי זמין, מבאת ומידע תכנוני | Jus-Tice',
		'seo_desc'  => 'המערכות של מינהל התכנון: רישוי זמין להיתרים, תכנון זמין לתוכניות, אתר מידע תכנוני, והשירותים המקוונים להתנגדות ולערר.',
		'intro'     => 'מינהל התכנון מפעיל את התשתית הדיגיטלית של עולם התכנון בישראל. אלה המערכות והשירותים שתפגשו בכל הליך תכנוני.',
		'facts'     => array(
			array( 'המערכות המרכזיות: רישוי זמין, תכנון זמין (מבא"ת) ואתר מידע תכנוני', 'https://www.gov.il/he/departments/iplan/govil-landing-page', 'מינהל התכנון' ),
			array( 'שירותים מקוונים: הגשת התנגדות, הגשת ערר ודיווח עבודות פטורות מהיתר', 'https://www.gov.il/he/departments/iplan/govil-landing-page', 'מינהל התכנון' ),
			array( 'אתר המידע התכנוני מרכז את התוכניות וההליכים לפי כתובת וגוש חלקה', 'https://mavat.iplan.gov.il', 'מבא"ת' ),
		),
		'official'  => array(
			array( 'מינהל התכנון', 'https://www.gov.il/he/departments/iplan/govil-landing-page' ),
			array( 'אתר מידע תכנוני', 'https://mavat.iplan.gov.il' ),
		),
		'related'   => array( 'local-planning-committees', 'opposing-city-building-plan', 'tama-38-status-2026' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'nesach-tabu-online-cost',
		'title'     => 'נסח טאבו: איך מוציאים וכמה עולה',
		'seo_title' => 'נסח טאבו: 18 שח מקוון והזמנה בדקות | Jus-Tice',
		'seo_desc'  => 'נסח אלקטרוני חתום 18 שח, נסח מאושר 88 שח, נסח מרוכז לבית משותף 154 שח. איך מזמינים ואיך מאתרים גוש וחלקה לפי כתובת.',
		'intro'     => 'נסח הטאבו הוא תעודת הזהות של הנכס, וכל בדיקה משפטית מתחילה בו. מוציאים אותו מקוון תוך דקות, ואלה המחירים הרשמיים לשנת 2026.',
		'facts'     => array(
			array( 'נסח אלקטרוני חתום: 18 ש"ח; נסח מאושר: 88 ש"ח; נסח מרוכז לבית משותף: 154 ש"ח; עיון בפנקסים: 85 ש"ח (תעריפי 2026)', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'ההפקה בשירות מקוון רשמי, כולל נסח בחותמת אפוסטיל', 'https://www.gov.il/he/service/land_registration_extract', 'gov.il' ),
			array( 'איתור גוש וחלקה לפי כתובת: בכלי הרשמי של הרשות לרישום', 'https://www.gov.il/he/departments/land_registration/govil-landing-page', 'הרשות לרישום' ),
		),
		'official'  => array(
			array( 'הפקת נסח רישום מקרקעין', 'https://www.gov.il/he/service/land_registration_extract' ),
			array( 'הודעת האגרות 2026', 'https://www.gov.il/he/pages/fees-2026' ),
		),
		'related'   => array( 'tabu-registration-fees-2026', 'hearat-azhara-meaning' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'mekarkein-law-1969',
		'title'     => 'חוק המקרקעין: הסעיפים שכל רוכש חייב להכיר',
		'seo_title' => 'חוק המקרקעין 1969: הסעיפים המרכזיים | Jus-Tice',
		'seo_desc'  => 'עסקה נגמרת ברישום (סעיף 7), דרישת הכתב (סעיף 8), עסקאות נוגדות (סעיף 9), חכירה לדורות, בתים משותפים והערת אזהרה.',
		'intro'     => 'חוק המקרקעין משנת 1969 הוא חוקת הנדל"ן של ישראל. חמישה סעיפים ממנו מלווים כל עסקת דירה, מהחתימה ועד הרישום.',
		'facts'     => array(
			array( 'עסקה במקרקעין טעונה רישום ונגמרת ברישום (סעיף 7)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'התחייבות לעשות עסקה טעונה מסמך בכתב (סעיף 8)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'עסקאות נוגדות: עדיפות לעסקה הראשונה, אלא אם השנייה נרשמה בתום לב (סעיף 9)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'שכירות מעל 5 שנים היא חכירה, ומעל 25 שנים חכירה לדורות (סעיף 3)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'בתים משותפים בסעיפים 52 עד 77; הערת אזהרה בסעיפים 126 עד 127', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המקרקעין, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_המקרקעין' ),
		),
		'related'   => array( 'hearat-azhara-meaning', 'condominium-registration-order', 'second-hand-apartment-purchase-steps' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'sale-apartments-law-1973',
		'title'     => 'חוק המכר דירות: מפרט, בדק והבטחת כספים',
		'seo_title' => 'חוק המכר דירות: הזכויות מול הקבלן | Jus-Tice',
		'seo_desc'  => 'מפרט חובה, תקופות בדק של שנה עד 7 שנים, אחריות 3 שנים נוספות, ו-20 שנה על אי התאמה יסודית. וחוק הבטחת ההשקעות לצדו.',
		'intro'     => 'חוק המכר (דירות) משנת 1973 הוא מגילת הזכויות של רוכש דירה חדשה: מה הקבלן חייב למסור, כמה זמן הוא אחראי, ואיך הכסף מוגן.',
		'facts'     => array(
			array( 'חובת צירוף מפרט והוראות תחזוקה לחוזה (סעיף 2)', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
			array( 'תקופות בדק לפי התוספת: שנה עד 7 שנים לפי סוג הליקוי', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
			array( 'תקופת אחריות: 3 שנים נוספות מתום הבדק (סעיף 4); אי התאמה יסודית בחלקים נושאי עומסים: עד 20 שנה', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
			array( 'לצדו פועל חוק המכר (דירות) (הבטחת השקעות) משנת 1974: ערבות בנקאית או ביטוח על כספי הרוכש', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המכר (דירות), הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)' ),
		),
		'related'   => array( 'warranty-bedek-periods', 'guarantee-sale-law-meaning', 'developer-apartment-purchase-stages' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'shevach-rechisha-taxation-law-1963',
		'title'     => 'חוק מיסוי מקרקעין: מפת הדרכים',
		'seo_title' => 'חוק מיסוי מקרקעין: הסעיפים שקובעים כמה תשלמו | Jus-Tice',
		'seo_desc'  => 'מס רכישה בסעיף 9, מס שבח 25 אחוזים בסעיף 48א, הצהרה תוך 30 יום, מקדמת הרוכש, אישורי המסים לטאבו והפטורים המרכזיים.',
		'intro'     => 'חוק מיסוי מקרקעין (שבח ורכישה) משנת 1963 קובע את שני המסים של כל עסקת דירה. אלה הסעיפים שמנהלים את הכסף בעסקה שלכם.',
		'facts'     => array(
			array( 'מס רכישה מוטל על הרוכש (סעיף 9); מס שבח ליחיד 25 אחוזים על השבח הריאלי (סעיף 48א(ב))', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'הצהרה על העסקה תוך 30 יום (סעיף 73); מקדמת הרוכש בסעיף 15(ב)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'תוקף הרישום מותנה באישורי מסים (סעיף 16)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'פטור דירה יחידה בסעיף 49ב(2) עם תקרה בסעיף 49א(א1); פטור מתנה לקרוב בסעיף 62 עם צינון בסעיף 49ו', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק מיסוי מקרקעין, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)' ),
			array( 'מיסוי מקרקעין, רשות המסים', 'https://www.gov.il/he/departments/topics/realty_taxation/govil-landing-page' ),
		),
		'related'   => array( 'acquisition-tax-brackets-2026', 'appreciation-tax-single-apartment-exemption', 'advance-shevach-payment-buyer' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'fair-rental-law-2017',
		'title'     => 'חוק שכירות הוגנת: מה מותר ומה אסור בחוזה',
		'seo_title' => 'חוק שכירות הוגנת: ערובה, תיקונים ואיסורים | Jus-Tice',
		'seo_desc'  => 'תקרת הערובה, תיקון ליקוי דחוף תוך 3 ימים ולא דחוף תוך 30, ומה אסור לגלגל על השוכר: ביטוח מבנה, השבחות ותיווך של המשכיר.',
		'intro'     => 'תיקון שכירות הוגנת משנת 2017 הכניס לחוק השכירות והשאילה פרק שלם על שכירות למגורים, עם כללים שאי אפשר להתנות עליהם לרעת השוכר.',
		'facts'     => array(
			array( 'תקרת הערובה: הנמוך מבין שליש מדמי השכירות לכל התקופה או פי 3 משכר הדירה החודשי (סעיף 25י)', 'https://he.wikisource.org/wiki/חוק_השכירות_והשאילה', 'נוסח החוק' ),
			array( 'תיקון ליקוי שאינו דחוף: עד 30 יום; ליקוי דחוף: עד 3 ימים (סעיף 25ח)', 'https://he.wikisource.org/wiki/חוק_השכירות_והשאילה', 'נוסח החוק' ),
			array( 'אסור לגלגל על השוכר: ביטוח מבנה, השבחות, ודמי תיווך כשהמשכיר הזמין את המתווך (סעיף 25ט)', 'https://he.wikisource.org/wiki/חוק_השכירות_והשאילה', 'נוסח החוק' ),
			array( 'דירה שאינה ראויה למגורים מוגדרת בתוספת הראשונה; התחולה: שכירות מגורים מ-3 חודשים עד 10 שנים', 'https://he.wikisource.org/wiki/חוק_השכירות_והשאילה', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק השכירות והשאילה, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_השכירות_והשאילה' ),
		),
		'related'   => array( 'protected-tenancy-law-israel', 'mekarkein-law-1969' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'tichnun-construction-law-1965',
		'title'     => 'חוק התכנון והבנייה: היתר, הקלה ושימוש חורג',
		'seo_title' => 'חוק התכנון והבנייה: המושגים והסעיפים | Jus-Tice',
		'seo_desc'  => 'מתי צריך היתר בנייה (סעיף 145), מה זה שימוש חורג והקלה, איך מתנגדים לתוכנית, ומאיפה מגיע היטל ההשבחה.',
		'intro'     => 'חוק התכנון והבנייה משנת 1965 קובע מה מותר לבנות ואיפה. אלה המושגים והסעיפים שכל בעל נכס פוגש.',
		'facts'     => array(
			array( 'עבודות הטעונות היתר קבועות בסעיף 145', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'שימוש חורג: שימוש למטרה שלא הותרה בתוכנית (הגדרה בסעיף 1, הליך בסעיף 146); הקלה: סטייה מהוראות תוכנית', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'התנגדויות לתוכניות: סעיפים 100 עד 103', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
			array( 'היטל השבחה: מכוח סעיף 196א והתוספת השלישית; ועדות ערר: סעיף 12א', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק התכנון והבנייה, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_התכנון_והבניה' ),
			array( 'מינהל התכנון', 'https://www.gov.il/he/departments/iplan/govil-landing-page' ),
		),
		'related'   => array( 'betterment-levy-israel', 'local-planning-committees', 'planning-information-request' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'protected-tenancy-law-israel',
		'title'     => 'חוק הגנת הדייר: למי הוא עוד רלוונטי',
		'seo_title' => 'דייר מוגן ודמי מפתח: מה נשאר מהחוק | Jus-Tice',
		'seo_desc'  => 'חוק הגנת הדייר חל רק על מי ששילם דמי מפתח או חליפיו: מי נחשב דייר מוגן, מה זה דמי מפתח, ולמה החוק לא חל על שכירות רגילה.',
		'intro'     => 'חוק הגנת הדייר שייך לעולם אחר של שוק הדיור, אבל הוא עדיין חי בנכסים ותיקים. חשוב לדעת מתי הוא חל ומתי ממש לא.',
		'facts'     => array(
			array( 'החוק: חוק הגנת הדייר (נוסח משולב) משנת 1972; דייר מוגן הוא מי ששילם דמי מפתח או חליף של דייר מוגן', 'https://www.kolzchut.org.il/he/דייר_מוגן_לפי_חוק_הגנת_הדייר', 'כל זכות' ),
			array( 'נכס שב-20.8.1968 לא היה בו דייר מוגן: החוק לא יחול עליו כל עוד לא הושכר בדמי מפתח', 'https://www.kolzchut.org.il/he/דייר_מוגן_לפי_חוק_הגנת_הדייר', 'כל זכות' ),
			array( 'דמי מפתח הם תמורה שאינה שכר דירה; שכר הדירה של דייר מוגן מפוקח', 'https://www.kolzchut.org.il/he/דייר_מוגן_לפי_חוק_הגנת_הדייר', 'כל זכות' ),
		),
		'official'  => array(
			array( 'דייר מוגן, כל זכות', 'https://www.kolzchut.org.il/he/דייר_מוגן_לפי_חוק_הגנת_הדייר' ),
		),
		'related'   => array( 'fair-rental-law-2017', 'mekarkein-law-1969' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'pinuy-binuy-law-compensation',
		'title'     => 'חוק פינוי ובינוי: רוב נדרש ודייר סרבן',
		'seo_title' => 'פינוי בינוי: רוב שני שלישים והסרבן | Jus-Tice',
		'seo_desc'  => 'עסקת פינוי בינוי דורשת הסכמת שני שלישים מבעלי הדירות, סרבן בלתי סביר חשוף לתביעה, והדיירים פטורים ממס שבח ומהיטל השבחה.',
		'intro'     => 'פינוי ובינוי הוא העסקה שבה הבניין הישן מוחלף בחדש. החוק קובע איזה רוב מספיק כדי להתקדם, ומה קורה עם מי שמסרב בלי סיבה סבירה.',
		'facts'     => array(
			array( 'נדרשת הסכמת בעלי שני שלישים מהדירות במתחם', 'https://www.kolzchut.org.il/he/פינוי-בינוי', 'כל זכות' ),
			array( 'דייר סרבן בלתי סביר חשוף לתביעת נזק מיתר בעלי הדירות', 'https://www.kolzchut.org.il/he/פינוי-בינוי', 'כל זכות' ),
			array( 'הדיירים פטורים ממס שבח, מהיטל השבחה וממס רכישה בעסקת הפינוי', 'https://www.kolzchut.org.il/he/פינוי-בינוי', 'כל זכות' ),
			array( 'הכרזת מתחם פינוי ובינוי: סעיף 14 לחוק הרשות להתחדשות עירונית, במינימום 24 יחידות דיור', 'https://he.wikisource.org/wiki/חוק_הרשות_הממשלתית_להתחדשות_עירונית', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'פינוי בינוי, כל זכות', 'https://www.kolzchut.org.il/he/פינוי-בינוי' ),
			array( 'חוק הרשות להתחדשות עירונית', 'https://he.wikisource.org/wiki/חוק_הרשות_הממשלתית_להתחדשות_עירונית' ),
		),
		'related'   => array( 'hitchadshut-ironit-authority-law', 'tama-38-status-2026' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'hitchadshut-ironit-authority-law',
		'title'     => 'חוק הרשות הממשלתית להתחדשות עירונית',
		'seo_title' => 'הרשות להתחדשות עירונית: מה היא נותנת לדיירים | Jus-Tice',
		'seo_desc'  => 'החוק משנת 2016: קידום מיזמים, מנהלות עירוניות, ממונה לפניות דיירים, והכרזת מתחמי פינוי ובינוי של 24 יחידות לפחות.',
		'intro'     => 'חוק הרשות הממשלתית להתחדשות עירונית משנת 2016 הקים את הגוף שמרכז את תחום ההתחדשות, ונתן לדיירים כתובת לפניות ולהגנה.',
		'facts'     => array(
			array( 'הרשות פועלת במשרד הבינוי והשיכון (סעיף 3), ותפקידיה קידום מיזמים, איתור מתחמים ותמריצים (סעיף 4)', 'https://he.wikisource.org/wiki/חוק_הרשות_הממשלתית_להתחדשות_עירונית', 'נוסח החוק' ),
			array( 'ממונה לעניין פניות דיירים: עורך דין בעל 5 שנות ניסיון (סעיף 7)', 'https://he.wikisource.org/wiki/חוק_הרשות_הממשלתית_להתחדשות_עירונית', 'נוסח החוק' ),
			array( 'מנהלות עירוניות להתחדשות (סעיף 2); הכרזת מתחמי פינוי ובינוי בסעיף 14, לפחות 24 יחידות דיור', 'https://he.wikisource.org/wiki/חוק_הרשות_הממשלתית_להתחדשות_עירונית', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק הרשות להתחדשות עירונית, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_הרשות_הממשלתית_להתחדשות_עירונית' ),
		),
		'related'   => array( 'pinuy-binuy-law-compensation', 'tama-38-status-2026' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'hearat-azhara-meaning',
		'title'     => 'הערת אזהרה: מה היא נותנת ולמה אסור לוותר',
		'seo_title' => 'הערת אזהרה: המשמעות וההגנה שהיא נותנת | Jus-Tice',
		'seo_desc'  => 'הערת אזהרה מעידה על התחייבות לעסקה וחוסמת רישום עסקה סותרת. מה היא נותנת לקונה, ולמה רושמים אותה מיד אחרי החתימה.',
		'intro'     => 'בין החתימה לרישום הבעלות עוברים חודשים, ובזמן הזה הערת האזהרה היא ההגנה של הקונה: היא מעידה על ההתחייבות וחוסמת עסקה סותרת.',
		'facts'     => array(
			array( 'הערת אזהרה היא רישום המעיד על התחייבות בכתב לעשות עסקה או להימנע ממנה (סעיף 126 לחוק המקרקעין)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'משנרשמה, לא תירשם עסקה הסותרת את ההתחייבות (סעיף 127)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'אגרת הרישום: 188 ש"ח (תעריפי 2026); נרשמת בדרך כלל מיד עם חתימת החוזה', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
		),
		'official'  => array(
			array( 'הערת אזהרה, כל זכות', 'https://www.kolzchut.org.il/he/הערת_אזהרה' ),
			array( 'חוק המקרקעין', 'https://he.wikisource.org/wiki/חוק_המקרקעין' ),
		),
		'related'   => array( 'warning-note-registration-tabu', 'zichron-dvarim-apartment-risks' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'zichron-dvarim-apartment-risks',
		'title'     => 'זיכרון דברים בדירה: למה הוא מסוכן',
		'seo_title' => 'זיכרון דברים בקניית דירה: הסיכון המלא | Jus-Tice',
		'seo_desc'  => 'זיכרון דברים עם מסוימות וגמירות דעת הוא חוזה מחייב: הוא קובע את יום המכירה לצורכי מס ומחייב הצהרה תוך 30 יום. אל תחתמו לפני ייעוץ.',
		'intro'     => 'זיכרון דברים נשמע כמו שלב לא מחייב, אבל בעיני החוק הוא יכול להיות החוזה עצמו, על כל המשמעויות: מס, מועדים ופיצויים.',
		'facts'     => array(
			array( 'מסמך בכתב עם מסוימות וגמירות דעת עשוי להיות חוזה מחייב, בהתאם לדרישת הכתב שבסעיף 8 לחוק המקרקעין', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'חתימתו נחשבת יום המכירה לצורכי מס, ומחייבת הצהרה למיסוי מקרקעין תוך 30 יום (סעיף 73)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'הפרת זיכרון דברים מחייב חושפת לתביעת פיצויים', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המקרקעין', 'https://he.wikisource.org/wiki/חוק_המקרקעין' ),
			array( 'חוק מיסוי מקרקעין', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)' ),
		),
		'related'   => array( 'hearat-azhara-meaning', 'second-hand-apartment-purchase-steps' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'guarantee-sale-law-meaning',
		'title'     => 'ערבות חוק מכר: הבטוחה של רוכש דירה מקבלן',
		'seo_title' => 'ערבות חוק מכר: איך הכסף שלכם מוגן | Jus-Tice',
		'seo_desc'  => 'חוק הבטחת ההשקעות מחייב את הקבלן להעמיד בטוחה על כספי הרוכש: ערבות בנקאית או פוליסת ביטוח, ובליווי בנקאי תשלום בשוברים בלבד.',
		'intro'     => 'הכסף ששילמתם לקבלן מוגן בחוק ייעודי: חוק המכר (דירות) (הבטחת השקעות) משנת 1974. אלה הבטוחות המוכרות ואיך משלמים נכון.',
		'facts'     => array(
			array( 'הקבלן חייב להעמיד בטוחה על כספי הרוכש לפי חוק הבטחת ההשקעות; הבטוחות העיקריות: ערבות בנקאית או פוליסת ביטוח', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
			array( 'בפרויקט בליווי בנקאי התשלומים משולמים בשוברים בלבד', 'https://www.gov.il/he/departments/topics/realty_taxation/govil-landing-page', 'gov.il' ),
		),
		'official'  => array(
			array( 'חוק המכר (דירות)', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)' ),
		),
		'related'   => array( 'developer-apartment-purchase-stages', 'warranty-bedek-periods' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'hachira-ledorot-meaning',
		'title'     => 'חכירה לדורות: מה זה אומר בפועל',
		'seo_title' => 'חכירה לדורות מול בעלות: ההבדל בפועל | Jus-Tice',
		'seo_desc'  => 'שכירות מעל 25 שנים היא חכירה לדורות, ורוב קרקעות המדינה מוחכרות דרך רמי. מה זה חוזה מהוון ומה משנה הרפורמה.',
		'intro'     => 'הרבה דירות בישראל אינן בבעלות מלאה אלא בחכירה לדורות מהמדינה. בפועל, חוזה מהוון מתנהג כמעט כמו בעלות, והרפורמה סוגרת את הפער.',
		'facts'     => array(
			array( 'שכירות לתקופה של מעל 25 שנים היא חכירה לדורות (סעיף 3 לחוק המקרקעין)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'רוב קרקעות המדינה מוחכרות ומנוהלות על ידי רשות מקרקעי ישראל', 'https://www.gov.il/he/departments/israel_land_authority/govil-landing-page', 'רמ"י' ),
			array( 'חוזה מהוון: דמי החכירה שולמו מראש; ברפורמה מוקנית בעלות מלאה לחוכרים עירוניים רבים ללא תמורה', 'https://www.gov.il/he/pages/reform-1', 'רמ"י' ),
		),
		'official'  => array(
			array( 'עמוד הרפורמה של רמ"י', 'https://www.gov.il/he/pages/reform-1' ),
		),
		'related'   => array( 'leasehold-capitalization-rami', 'rami-israel-land-authority' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'shared-house-common-property',
		'title'     => 'בית משותף ורכוש משותף: זכויות וחובות',
		'seo_title' => 'רכוש משותף בבניין: מה כלול ומי מחליט | Jus-Tice',
		'seo_desc'  => 'הגג, הקירות, חדר המדרגות והמעלית הם רכוש משותף לפי סעיף 52. הניהול לפי תקנון, שינוי בתקנון מוסכם ברוב שני שלישים.',
		'intro'     => 'בבית משותף אתם בעלים של הדירה ושותפים בכל השאר. חוק המקרקעין מגדיר מה נחשב רכוש משותף ואיך מנהלים אותו.',
		'facts'     => array(
			array( 'רכוש משותף: הקרקע, הגגות, הקירות החיצוניים, המסד, חדרי המדרגות, מעליות ומקלטים (סעיף 52 לחוק המקרקעין)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
			array( 'הניהול לפי תקנון (סעיף 61); תקנון מוסכם נקבע ברוב של שני שלישים (סעיף 62), ואגרת רישומו 163 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
			array( 'סכסוכים בין בעלי הדירות נדונים אצל המפקח (סעיפים 72 עד 77)', 'https://he.wikisource.org/wiki/חוק_המקרקעין', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המקרקעין', 'https://he.wikisource.org/wiki/חוק_המקרקעין' ),
		),
		'related'   => array( 'condominium-registration-order', 'supervisor-condominium-disputes' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'tama-38-status-2026',
		'title'     => 'תמ"א 38 בשנת 2026: מה נשאר ומה מחליף אותה',
		'seo_title' => 'תמ"א 38 בתוקף עד 18.5.2026: המצב המלא | Jus-Tice',
		'seo_desc'  => 'התמא פקעה ארצית ב-1.10.2023, ובוועדות שעמדו בתנאים היא חלה עד 18.5.2026 או עד אישור תכנית מחליפה, המוקדם מביניהם.',
		'intro'     => 'תמ"א 38 בדרך החוצה, אבל לא בכל מקום באותו קצב. זה הסטטוס הרשמי מהחלטות המועצה הארצית, נכון להיום.',
		'facts'     => array(
			array( 'התמ"א פקעה ארצית ב-1.10.2023', 'https://www.gov.il/he/pages/decisions-tama38', 'מינהל התכנון' ),
			array( 'בוועדות מקומיות שעמדו בתנאי המועצה הארצית היא חלה עד 18.5.2026 או עד אישור תכנית מחליפה, המוקדם מביניהם', 'https://www.gov.il/he/pages/decisions-tama38', 'מינהל התכנון' ),
			array( 'ההחלטות הרלוונטיות: 5.11.2019, 5.4.2022, 20.4.2023, 2.1.2024 ו-6.8.2024', 'https://www.gov.il/he/pages/decisions-tama38', 'מינהל התכנון' ),
			array( 'את ההמשך מסדירות תוכניות מחליפות לפי סעיף 23 לתמ"א או תוכניות מתאר מקומיות', 'https://www.gov.il/he/pages/tama38-apps', 'מינהל התכנון' ),
		),
		'official'  => array(
			array( 'החלטות המועצה הארצית על תמ"א 38', 'https://www.gov.il/he/pages/decisions-tama38' ),
			array( 'יישום תמ"א 38, מינהל התכנון', 'https://www.gov.il/he/pages/tama38-apps' ),
		),
		'related'   => array( 'pinuy-binuy-law-compensation', 'hitchadshut-ironit-authority-law', 'local-planning-committees' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'combination-deal-taxation',
		'title'     => 'עסקת קומבינציה: איך היא עובדת',
		'seo_title' => 'עסקת קומבינציה: קרקע תמורת בנייה | Jus-Tice',
		'seo_desc'  => 'בעל קרקע מוכר ליזם חלק מהמקרקעין תמורת שירותי בנייה על החלק הנותר: המבנה, חובת הדיווח תוך 30 יום, והביטחונות שחשוב לעגן.',
		'intro'     => 'בעסקת קומבינציה בעל הקרקע לא מקבל כסף אלא דירות: הוא מוכר ליזם חלק מהמקרקעין, והתמורה היא שירותי בנייה על החלק שנשאר בידיו.',
		'facts'     => array(
			array( 'המבנה: מכירת חלק מהמקרקעין ליזם תמורת שירותי בנייה על החלק הנותר', 'https://www.gov.il/he/departments/topics/realty_taxation/govil-landing-page', 'רשות המסים' ),
			array( 'חובת ההצהרה למיסוי מקרקעין תוך 30 יום חלה כרגיל (סעיף 73)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'מומלץ לעגן ערבויות וביטחונות כמו בעסקת קבלן, כי התמורה מתקבלת רק בסוף הבנייה', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'מיסוי מקרקעין, רשות המסים', 'https://www.gov.il/he/departments/topics/realty_taxation/govil-landing-page' ),
		),
		'related'   => array( 'shevach-rechisha-taxation-law-1963', 'pinuy-binuy-law-compensation' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'mecher-lelo-tmura-term',
		'title'     => 'מכר ללא תמורה: המונח וההשלכות',
		'seo_title' => 'מכר ללא תמורה: מתנה, מס וצינון | Jus-Tice',
		'seo_desc'  => 'העברת דירה במתנה: שליש מס רכישה למקבל, פטור שבח לנותן לקרוב, תקופות צינון של 3 עד 4 שנים, ודיווח תוך 30 יום כרגיל.',
		'intro'     => 'מכר ללא תמורה הוא השם המשפטי של העברת נכס במתנה, בדרך כלל בתוך המשפחה. גם מתנה היא עסקה לכל דבר: דיווח, מס ורישום.',
		'facts'     => array(
			array( 'מס רכישה למקבל: שליש מהמס הרגיל (תקנה 20 לתקנות מס רכישה)', 'https://www.kolzchut.org.il/he/חישוב_מס_רכישה', 'כל זכות' ),
			array( 'פטור מס שבח לנותן במתנה לקרוב (סעיף 62); למקבל תקופת צינון של 3 עד 4 שנים לפני מכירה בפטור (סעיף 49ו)', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)', 'נוסח החוק' ),
			array( 'גם מתנה מחייבת דיווח תוך 30 יום ורישום בטאבו, באגרה של 44 ש"ח', 'https://www.gov.il/he/pages/fees-2026', 'הודעת האגרות הרשמית' ),
		),
		'official'  => array(
			array( 'חוק מיסוי מקרקעין', 'https://he.wikisource.org/wiki/חוק_מיסוי_מקרקעין_(שבח_ורכישה)' ),
		),
		'related'   => array( 'gift-transfer-apartment-relatives', 'acquisition-tax-brackets-2026' ),
		'pillar'    => 'real-estate-attorney',
	),

	array(
		'slug'      => 'warranty-bedek-periods',
		'title'     => 'תקופת בדק ותקופת אחריות בדירה חדשה',
		'seo_title' => 'תקופות בדק ואחריות: כמה זמן הקבלן אחראי | Jus-Tice',
		'seo_desc'  => 'צנרת 4 שנים, סדקים 5, חיפויים חיצוניים 7, כל השאר שנה, ואחריהן 3 שנות אחריות. אי התאמה יסודית: עד 20 שנה. מהתוספת לחוק.',
		'intro'     => 'לכל ליקוי בדירה חדשה יש שעון משלו: התוספת לחוק המכר (דירות) קובעת תקופת בדק לפי סוג הליקוי, ואחריה תקופת אחריות.',
		'facts'     => array(
			array( 'צנרת והסקה: 4 שנים; רטיבות בגג, בקירות ובמקלט: 4 שנים; מכונות ודוודים: 3 שנים', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'התוספת לחוק' ),
			array( 'שקיעת מרצפות: 3 שנים; סדקים עוברים: 5 שנים; קילוף חיפויים חיצוניים: 7 שנים; כל אי התאמה אחרת: שנה', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'התוספת לחוק' ),
			array( 'תקופת אחריות: 3 שנים נוספות מתום הבדק, ובה נטל ההוכחה עובר לרוכש (סעיף 4)', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
			array( 'אי התאמה יסודית בחלקים נושאי עומסים: עד 20 שנה', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המכר (דירות), הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_המכר_(דירות)' ),
		),
		'related'   => array( 'sale-apartments-law-1973', 'guarantee-sale-law-meaning', 'developer-apartment-purchase-stages' ),
		'pillar'    => 'real-estate-attorney',
	),

);
