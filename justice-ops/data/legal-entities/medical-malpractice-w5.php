<?php
/**
 * Entity wave 5: medical malpractice, the owner's top-priority vertical.
 * 47 pages researched 2026-09-07 from official sources only: consolidated
 * law texts on wikisource (Torts Ordinance, Patient Rights Law, Physicians
 * Ordinance, Prescription Law, National Health Insurance Law, State
 * Liability Law, medical-records regulations, court-fee regulations at 2026
 * amounts), gov.il services and units, BTL, and kolzchut. Four items the
 * research could not anchor to an official text (case-law ranges for pain
 * and suffering, customary fee percentages, the 3 percent discount rate in
 * tort judgments, the loss-of-chance precedent) were excluded, not guessed.
 * Slugs validated against all 1,555 live URLs and waves 1-4: zero exact or
 * head-word collisions. Related links also reach the site's existing
 * malpractice articles so the old pages and the new layer strengthen each
 * other.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(

	array(
		'slug'      => 'checking-negligence-claim-grounds',
		'title'     => 'איך בודקים אם יש עילת תביעת רשלנות רפואית',
		'seo_title' => 'עילת תביעה ברשלנות רפואית: ארבעת היסודות | Jus-Tice',
		'seo_desc'  => 'חובת זהירות, התרשלות, נזק וקשר סיבתי: ארבעת היסודות שבודקים לפני תביעה, לפי סעיפים 35 ו-36 לפקודת הנזיקין, ומה קורה כשהרישום הרפואי חסר.',
		'intro'     => 'לא כל תוצאה רעה של טיפול היא רשלנות. לפני שפונים לערכאות בודקים ארבעה יסודות קבועים בפקודת הנזיקין, ואת הדרך להוכיח אותם מתוך התיק הרפואי וחוות דעת מומחה.',
		'facts'     => array(
			array( 'רשלנות מוגדרת בסעיף 35 לפקודת הנזיקין: מעשה שאדם סביר ונבון לא היה עושה באותן נסיבות, או מחדל ממעשה שאדם סביר היה עושה', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'סעיף 36 קובע שחובת הזהירות חלה כלפי כל אדם שצריך היה לצפות מראש שעלול להיפגע', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'יסודות התביעה: חובת זהירות, התרשלות, נזק וקשר סיבתי; לא כל טעות באבחון היא רשלנות, רק טעות בלתי סבירה', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית', 'כל זכות' ),
			array( 'שלבי הבדיקה: איסוף התיעוד הרפואי, קבלת חוות דעת מומחה, ורק אז הגשה לערכאה המתאימה', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית', 'כל זכות' ),
			array( 'בהיעדר רישומים רפואיים עשוי נטל השכנוע לעבור לנתבע, מה שמכונה נזק ראייתי', 'https://www.kolzchut.org.il/he/העברת_נטל_השכנוע_בשל_אי_שמירת_רישומים_רפואיים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'הגדרת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית' ),
			array( 'הגשת תביעת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית' ),
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
		),
		'related'   => array( 'known-complication-versus-negligence', 'obtaining-medical-records-copy', 'attaching-expert-opinion-claim', 'what-is-medical-malpractice-definition-examples' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'obtaining-medical-records-copy',
		'title'     => 'קבלת העתק רשומה רפואית מבית חולים ומקופת חולים',
		'seo_title' => 'העתק תיק רפואי: הזכות, העלות והטופס | Jus-Tice',
		'seo_desc'  => 'הזכות לתיק הרפואי לפי סעיף 18 לחוק זכויות החולה, תשלום מרבי של 10 ש"ח לרשומה ממוחשבת, מה ניתן חינם, ומה נדרש כדי למסור מידע לצד שלישי.',
		'intro'     => 'התיק הרפואי הוא הבסיס לכל בדיקת רשלנות. החוק מקנה למטופל זכות לקבל אותו, והתקנות מגבילות את מה שמותר לגבות עליו. אלה המספרים והשלבים.',
		'facts'     => array(
			array( 'הזכות לקבל מידע רפואי מהרשומה קבועה בסעיף 18 לחוק זכויות החולה, התשנ"ו-1996', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'התשלום המרבי בעד העתק רשומה ממוחשבת שנוצרה בחמש השנים שקדמו לבקשה: 10 ש"ח כולל המרה לקובץ', 'https://he.wikisource.org/wiki/תקנות_זכויות_החולה_(תשלום_מרבי_בעד_מסירת_העתק_רשומה_רפואית_או_עיון_בה)', 'תקנות התשלום המרבי' ),
			array( 'צפייה מקוונת ברשומה ללא תשלום; אסור לגבות תשלום על עצם הגשת הבקשה (תקנה 4)', 'https://he.wikisource.org/wiki/תקנות_זכויות_החולה_(תשלום_מרבי_בעד_מסירת_העתק_רשומה_רפואית_או_עיון_בה)', 'תקנות התשלום המרבי' ),
			array( 'ללא תשלום גם מכתב שחרור, סיכום ביקור, גיליון מיון, תוצאות בדיקה שלא באשפוז, מרשמים והפניות בתוקף', 'https://he.wikisource.org/wiki/תקנות_זכויות_החולה_(תשלום_מרבי_בעד_מסירת_העתק_רשומה_רפואית_או_עיון_בה)', 'תקנות התשלום המרבי' ),
			array( 'רשומה שאינה ממוחשבת מתומחרת לפי תעריפון משרד הבריאות; לדוגמה 109 ש"ח לאיתור וצילום עד 10 עמודים', 'https://www.kolzchut.org.il/he/קבלת_מידע_מהרשומה_הרפואית', 'כל זכות' ),
			array( 'מסירת מידע לגורם שלישי מחייבת טופס ויתור סודיות חתום', 'https://www.kolzchut.org.il/he/ויתור_על_סודיות_רפואית', 'כל זכות' ),
		),
		'official'  => array(
			array( 'רשומות רפואיות, משרד הבריאות', 'https://www.gov.il/he/departments/topics/medical_records/govil-landing-page' ),
			array( 'תחום רישום ומידע רפואי, משרד הבריאות', 'https://www.gov.il/he/departments/units/medical_registration_unit/govil-landing-page' ),
			array( 'קבלת מידע מהרשומה הרפואית, כל זכות', 'https://www.kolzchut.org.il/he/קבלת_מידע_מהרשומה_הרפואית' ),
		),
		'related'   => array( 'evidentiary-damage-records', 'preservation-medical-records-regulations', 'checking-negligence-claim-grounds' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'attaching-expert-opinion-claim',
		'title'     => 'חוות דעת רפואית כתנאי להגשת תביעת רשלנות',
		'seo_title' => 'חוות דעת מומחה בתביעת רשלנות רפואית: תקנה 87 | Jus-Tice',
		'seo_desc'  => 'תקנה 87 לתקנות סדר הדין האזרחי מחייבת לצרף חוות דעת מומחה לכל עניין שברפואה, 60 ימים לחוות דעת נגדית, ומתי בית המשפט פוטר מהחובה.',
		'intro'     => 'בלי חוות דעת של מומחה רפואי אין תביעת רשלנות רפואית. תקנות סדר הדין קובעות מתי מצרפים אותה, מה המועדים לחוות דעת נגדית, ומתי אפשר לבקש פטור.',
		'facts'     => array(
			array( 'תקנה 87(א) לתקנות סדר הדין האזרחי: בעל דין המבקש להוכיח עניין שברפואה מצרף לכתב טענותיו חוות דעת של מומחה בתחום מומחיותו', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'תובע החולק על חוות דעת רפואית שצורפה לכתב ההגנה מגיש חוות דעת נגדית בתוך 60 ימים מהמצאתה (תקנה 87(ג))', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'בית המשפט רשאי לפטור בעל דין מצירוף חוות דעת אם מצא הצדקה לכך (תקנה 87(ד))', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'חוות דעת מומחה בכתב קבילה כראיה בשאלה שבמדע או בידיעה מקצועית (סעיף 20 לפקודת הראיות)', 'https://he.wikisource.org/wiki/פקודת_הראיות', 'פקודת הראיות' ),
			array( 'ללא חוות דעת לא ניתן להוכיח את יסוד ההתרשלות', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית', 'כל זכות' ),
		),
		'official'  => array(
			array( 'תקנות סדר הדין האזרחי, הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי' ),
			array( 'פקודת הראיות, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הראיות' ),
			array( 'הגשת תביעת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית' ),
		),
		'related'   => array( 'opinion-expert-witness-medicine', 'appointed-court-expert', 'venue-malpractice-claim-court', 'medical-expert-testimony-malpractice-lawsuit' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'venue-malpractice-claim-court',
		'title'     => 'לאיזה בית משפט מגישים תביעת רשלנות רפואית',
		'seo_title' => 'שלום או מחוזי: הסמכות בתביעת רשלנות רפואית | Jus-Tice',
		'seo_desc'  => 'עד 2.5 מיליון ש"ח בשלום, מעל זה במחוזי. האגרה הראשונית בנזקי גוף (839 או 1,429 ש"ח ב-2026) ו-120 הימים לכתב הגנה בתביעת רשלנות רפואית.',
		'intro'     => 'הערכאה נקבעת לפי סכום התביעה, והאגרה בנזקי גוף משולמת בשני חלקים. תביעת רשלנות רפואית גם מקבלת בתקנות מועד הגנה ארוך מהרגיל.',
		'facts'     => array(
			array( 'בית משפט השלום דן בתביעות אזרחיות עד 2.5 מיליון ש"ח (סעיף 51(א)(2) לחוק בתי המשפט)', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'חוק בתי המשפט' ),
			array( 'בית המשפט המחוזי דן בכל עניין שאינו בסמכות השלום, מכוח הסמכות השיורית בסעיף 40', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'חוק בתי המשפט' ),
			array( 'בתביעת נזקי גוף משלמים בעת ההגשה סכום ראשוני בלבד: 839 ש"ח בשלום ו-1,429 ש"ח במחוזי (פרטים 34 ו-35 לתוספת, סכומי 2026), והיתרה נדחית לפי תקנה 5(ב)', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'בתביעה שעניינה רשלנות רפואית כתב ההגנה מוגש בתוך 120 ימים במקום 60 (תקנה 9(ב) לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
		),
		'official'  => array(
			array( 'הרשות השופטת', 'https://www.gov.il/he/departments/the_judicial_authority/govil-landing-page' ),
			array( 'טבלת אגרות בתי המשפט', 'https://www.gov.il/he/departments/general/fees_16' ),
			array( 'חוק בתי המשפט, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט' ),
		),
		'related'   => array( 'costs-litigation-losing-party', 'deadline-suing-medical-negligence', 'appealing-malpractice-judgment' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'deadline-suing-medical-negligence',
		'title'     => 'התיישנות תביעת רשלנות רפואית',
		'seo_title' => 'התיישנות ברשלנות רפואית: 7 שנים, קטינים, גילוי מאוחר | Jus-Tice',
		'seo_desc'  => 'שבע שנים מיום העילה, מניין מיום הגילוי כשהעובדות נעלמו, קטין תובע עד גיל 25, ותקרת 10 השנים בסעיף 89 לפקודת הנזיקין.',
		'intro'     => 'תקופת ההתיישנות היא השאלה הראשונה בכל תיק רשלנות רפואית. הכלל הוא שבע שנים, אבל חוק ההתיישנות ופקודת הנזיקין קובעים חריגים לשני הכיוונים.',
		'facts'     => array(
			array( 'תקופת ההתיישנות בתביעה שאינה במקרקעין: 7 שנים (סעיף 5 לחוק ההתיישנות), מיום שנולדה העילה (סעיף 6)', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
			array( 'התיישנות שלא מדעת (סעיף 8): נעלמו מהתובע העובדות מסיבות שאינן תלויות בו, המניין מתחיל ביום שנודעו לו', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
			array( 'קטין: הזמן שעד גיל 18 אינו נמנה (סעיף 10), כך שקטין שנפגע יכול לתבוע עד גיל 25', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית', 'כל זכות' ),
			array( 'מגבלה עליונה בנזיקין כשהנזק הוא רכיב בעילה: לא יאוחר מ-10 שנים מיום אירוע הנזק (סעיף 89(2) לפקודת הנזיקין)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
		),
		'official'  => array(
			array( 'חוק ההתיישנות, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_ההתיישנות' ),
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'הגשת תביעת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית' ),
		),
		'related'   => array( 'hityashnut-law-1958', 'holada-beavla-lawsuit', 'venue-malpractice-claim-court', 'medical-malpractice-statute-of-limitations' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'complaint-health-ministry-commissioner',
		'title'     => 'הגשת תלונה לנציב קבילות הציבור למקצועות רפואיים',
		'seo_title' => 'תלונה על רופא במשרד הבריאות: איך ומה יוצא | Jus-Tice',
		'seo_desc'  => 'תלונה חינם לנציבות הקבילות למקצועות רפואיים: טופס מקוון, דואר או מוקד 5400 כוכבית, מענה ראשוני בכשבועיים, ומה הנציבות יכולה ומה לא יכולה לעשות.',
		'intro'     => 'לצד תביעת פיצויים קיים מסלול מנהלי חינם במשרד הבריאות. הוא לא פוסק כסף, אבל הוא יכול להוביל לוועדת בדיקה ולהליך משמעתי, והממצאים שלו משמשים בהמשך.',
		'facts'     => array(
			array( 'הנציבות מטפלת בחשד להתנהגות לא אתית או לחריגה בלתי סבירה מהסטנדרט הטיפולי, במערכת הציבורית והפרטית', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לנציב_קבילות_הציבור_למקצועות_רפואיים', 'כל זכות' ),
			array( 'ההגשה בחינם; מענה ראשוני בתוך כשבועיים', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לנציב_קבילות_הציבור_למקצועות_רפואיים', 'כל זכות' ),
			array( 'דרכי הגשה: טופס מקוון בשירות הגשת תלונה על בעלי מקצועות רפואיים, דואר לרחוב ירמיהו 39 ירושלים, או מוקד 5400 כוכבית', 'https://www.gov.il/he/service/public_ombudsman_for_medical_professions', 'gov.il' ),
			array( 'תוצאות אפשריות: בירור, העברה לגורם מוסמך, מינוי ועדת בדיקה ודיווח למנכ"ל משרד הבריאות; הנציבות אינה פוסקת פיצוי כספי', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לנציב_קבילות_הציבור_למקצועות_רפואיים', 'כל זכות' ),
			array( 'תלונה על הפרת סל השירותים של קופת חולים מטופלת בנציבות הקבילות לחוק ביטוח בריאות ממלכתי, לא כאן', 'https://www.kolzchut.org.il/he/נציבות_קבילות_הציבור_לחוק_ביטוח_בריאות_ממלכתי', 'כל זכות' ),
		),
		'official'  => array(
			array( 'הגשת תלונה על בעלי מקצועות רפואיים, gov.il', 'https://www.gov.il/he/service/public_ombudsman_for_medical_professions' ),
			array( 'נציבות קבילות הציבור למקצועות רפואיים', 'https://www.gov.il/he/departments/units/medical_professions_ombudsman_unit/govil-landing-page' ),
			array( 'מוקד קול הבריאות', 'https://www.gov.il/he/service/kol-briut-moked' ),
		),
		'related'   => array( 'commissioner-public-complaints-medical', 'disciplinary-complaint-against-doctor', 'internal-hospital-inquiry-committee' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'internal-hospital-inquiry-committee',
		'title'     => 'ועדת בדיקה בבית חולים לפי סעיף 21 לחוק זכויות החולה',
		'seo_title' => 'ועדת בדיקה אחרי אירוע רפואי חריג: מה מקבל המטופל | Jus-Tice',
		'seo_desc'  => 'ועדת בדיקה לפי סעיף 21: ממצאיה ומסקנותיה נמסרים למטופל, הפרוטוקול חסוי אלא בצו בית משפט, וההבדל מוועדת בקרה ואיכות שדיוניה אינם ראיה.',
		'intro'     => 'אחרי אירוע חריג בית החולים עשוי להקים ועדת בדיקה. החוק קובע מה מהתוצרים שלה מגיע למטופל ומה נשאר חסוי, וזה משפיע ישירות על התביעה.',
		'facts'     => array(
			array( 'ועדת בדיקה מוקמת לבדיקת תלונה או אירוע חריג; ממצאיה ומסקנותיה נמסרים גם למטופל (סעיף 21 לחוק זכויות החולה)', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'פרוטוקול דיוני הוועדה חסוי; בית משפט רשאי להורות על מסירתו אם הצורך בגילוי לשם עשיית צדק עדיף', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'ועדת בקרה ואיכות (סעיף 22): דיוניה ומסקנותיה חסויים ולא ישמשו ראיה, אך ממצאים עובדתיים מתועדים ברשומה הרפואית', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'במקביל ניתן להתלונן ישירות לאחראי לפניות הציבור בבית החולים', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לבית_חולים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק זכויות החולה, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה' ),
			array( 'הגשת תלונה לבית חולים, כל זכות', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לבית_חולים' ),
			array( 'נציבות קבילות הציבור למקצועות רפואיים', 'https://www.gov.il/he/departments/units/medical_professions_ombudsman_unit/govil-landing-page' ),
		),
		'related'   => array( 'complaint-health-ministry-commissioner', 'patient-rights-law-1996', 'evidentiary-damage-records' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'disciplinary-complaint-against-doctor',
		'title'     => 'תלונה משמעתית נגד רופא לפי פקודת הרופאים',
		'seo_title' => 'הליך משמעתי נגד רופא: עילות, שימוע וערעור | Jus-Tice',
		'seo_desc'  => 'עילות המשמעת בסעיף 41 לפקודת הרופאים, אמצעי המשמעת מהתראה עד ביטול רישיון, שימוע ב-30 יום מראש, ערעור למחוזי בתוך שלושה חודשים.',
		'intro'     => 'ההליך המשמעתי נפרד מתביעת הפיצויים: הוא לא מקנה כסף, אבל יכול להוביל להתליית רישיון או לביטולו. כך הוא מתחיל, מי מנהל אותו ומה תוצאותיו.',
		'facts'     => array(
			array( 'עילות משמעת (סעיף 41 לפקודת הרופאים): התנהגות שאינה הולמת רופא, רשלנות חמורה או אי-יכולת, הרשעה בעבירה, הפרת הוראות חוק זכויות החולה ועוד', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'אמצעי המשמעת בצו שר הבריאות: התראה, נזיפה, התליית רישיון לתקופה קצובה או ביטולו', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'בטרם צו נשמע הרופא בפני ועדה (סעיף 44), בהודעה בכתב לפחות 30 יום מראש', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'ערעור על צו שר הבריאות לבית המשפט המחוזי בתוך שלושה חודשים (סעיף 47)', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'ההליך מנוהל ביחידת הדין המשמעתי של משרד הבריאות; הדיונים פומביים ככלל וההחלטות מתפרסמות במאגר ייעודי', 'https://www.gov.il/he/departments/dynamiccollectors/disciplinary-action', 'מאגר החלטות המשמעת' ),
			array( 'ההליך המשמעתי נפרד מתביעת פיצויים אזרחית ואינו מקנה פיצוי', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לנציב_קבילות_הציבור_למקצועות_רפואיים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'יחידת הדין המשמעתי, משרד הבריאות', 'https://www.gov.il/he/departments/units/prosecution_unit/govil-landing-page' ),
			array( 'מאגר החלטות ועדות המשמעת', 'https://www.gov.il/he/departments/dynamiccollectors/disciplinary-action' ),
			array( 'תקנות הרופאים (סדרי דין בדיון משמעתי)', 'https://www.gov.il/he/pages/rofim12' ),
		),
		'related'   => array( 'tribunal-medical-discipline', 'physicians-ordinance-1976', 'complaint-health-ministry-commissioner' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'hmo-negligence-claim',
		'title'     => 'תביעת רשלנות רפואית נגד קופת חולים',
		'seo_title' => 'תביעה נגד קופת חולים על טיפול רשלני | Jus-Tice',
		'seo_desc'  => 'תביעת נזיקין נגד קופת חולים מוגשת לבית משפט אזרחי ולא לבית הדין לעבודה (סעיף 54(ב)), הקופה אחראית כמעבידה לפי סעיף 13 לפקודת הנזיקין.',
		'intro'     => 'קופת חולים היא הנתבעת הטבעית כשהרשלנות קרתה במרפאה בקהילה. סעיף אחד בחוק ביטוח בריאות ממלכתי קובע לאיזו ערכאה הולכים, ופקודת הנזיקין קובעת למה הקופה אחראית.',
		'facts'     => array(
			array( 'לבית הדין לעבודה סמכות ייחודית בסכסוכי מבוטח וקופה, למעט תביעת נזיקין (סעיף 54(ב) לחוק ביטוח בריאות ממלכתי); תביעת רשלנות נגד קופה מוגשת לבתי המשפט האזרחיים', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'קופה אחראית כמעבידה למעשי עובדיה שנעשו תוך כדי עבודתם (סעיף 13 לפקודת הנזיקין) וכמעסיקת שלוח (סעיף 14)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'הערכאה לפי סכום: עד 2.5 מיליון ש"ח בשלום, מעל זה במחוזי (סעיף 51(א)(2) לחוק בתי המשפט)', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'חוק בתי המשפט' ),
			array( 'אסור לקופה להגביל או לשלול פנייה לערכאות (סעיף 54(א))', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'לפני תביעה מקבלים את העתק הרשומה מהקופה, בהליך מוסדר בכל ארבע הקופות', 'https://www.kolzchut.org.il/he/קבלת_מידע_מהרשומה_הרפואית', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק ביטוח בריאות ממלכתי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי' ),
			array( 'הגשת קבילה לפי חוק ביטוח בריאות ממלכתי, gov.il', 'https://www.gov.il/he/service/national-health-insurance-law-complaint-submission' ),
			array( 'קבלת מידע מהרשומה הרפואית, כל זכות', 'https://www.kolzchut.org.il/he/קבלת_מידע_מהרשומה_הרפואית' ),
		),
		'related'   => array( 'health-funds-legal-status', 'vicarious-hospital-responsibility', 'venue-malpractice-claim-court' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'compromise-mediation-malpractice-cases',
		'title'     => 'פשרה וגישור בתביעות רשלנות רפואית',
		'seo_title' => 'פשרה וגישור ברשלנות רפואית: סעיף 79א והאגרה | Jus-Tice',
		'seo_desc'  => 'פסיקה בדרך של פשרה לפי סעיף 79א, גישור לפי 79ג, ופטור מיתרת האגרה בנזקי גוף כשההליך מסתיים בפשרה לפני תום קדם המשפט השלישי.',
		'intro'     => 'רוב תיקי הרשלנות הרפואית לא מגיעים לפסק דין. החוק נותן לצדדים שני מסלולים מוסדרים לסיום מוקדם, ותקנות האגרות מתגמלות מי שמסיים מוקדם.',
		'facts'     => array(
			array( 'בית משפט רשאי, בהסכמת הצדדים, לפסוק בדרך של פשרה (סעיף 79א לחוק בתי המשפט)', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'חוק בתי המשפט' ),
			array( 'גישור: הליך שבו מגשר מביא את הצדדים להסכמה בלא סמכות הכרעה (סעיף 79ג)', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'חוק בתי המשפט' ),
			array( 'בתביעת נזקי גוף שהסתיימה בפשרה או בהסדר גישור לפני תום קדם המשפט השלישי ניתן פטור מיתרת האגרה (תקנה 5(ב)(2) לתקנות האגרות)', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'הסתיים ההליך בפסק דין לחובת הנתבע, הנתבע נושא ביתרת האגרה ומשפה את התובע (תקנה 5(ב)(5))', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
		),
		'official'  => array(
			array( 'חוק בתי המשפט, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט' ),
			array( 'תקנות בתי המשפט (אגרות), הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)' ),
			array( 'הרשות השופטת', 'https://www.gov.il/he/departments/the_judicial_authority/govil-landing-page' ),
		),
		'related'   => array( 'costs-litigation-losing-party', 'contingency-fee-injury-claims', 'venue-malpractice-claim-court', 'medical-malpractice-settlement' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'claiming-disability-social-security',
		'title'     => 'קצבת נכות כללית במקביל לתביעת רשלנות רפואית',
		'seo_title' => 'נכות כללית וגם פיצוי מרשלנות: איך זה עובד | Jus-Tice',
		'seo_desc'  => 'תנאי הזכאות לנכות כללית, סכומי 2026 (4,711 ש"ח לדרגה מלאה), זכות השיפוי של המוסד לביטוח לאומי לפי סעיף 328, והגבלת שכר הטרחה בייצוג.',
		'intro'     => 'מי שנותר עם נכות אחרי טיפול רפואי יכול לפנות למוסד לביטוח לאומי בלי להוכיח אשם, ובמקביל לנהל תביעת נזיקין. שני המסלולים משפיעים זה על זה.',
		'facts'     => array(
			array( 'זכאות לקצבת נכות כללית: תושב ישראל מגיל 18 עד גיל פרישה, נכות רפואית של 60% לפחות (או 40% כשליקוי אחד הוא 25% לפחות) ודרגת אי-כושר של 50% ומעלה', 'https://www.kolzchut.org.il/he/קצבת_נכות_כללית', 'כל זכות' ),
			array( 'סכומי הקצבה החודשית ב-2026: דרגת אי-כושר מלאה 4,711 ש"ח; 74% 3,211 ש"ח; 65% 2,894 ש"ח; 60% 2,718 ש"ח', 'https://www.kolzchut.org.il/he/קצבת_נכות_כללית', 'כל זכות' ),
			array( 'ההגשה למוסד לביטוח לאומי, גם באופן מקוון; מוקד 6050 כוכבית', 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx', 'ביטוח לאומי' ),
			array( 'כשאותו אירוע מזכה גם בגמלה וגם בפיצויים מצד שלישי, המוסד רשאי לתבוע מהמזיק שיפוי על הגמלאות (סעיף 328 לחוק הביטוח הלאומי)', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי', 'חוק הביטוח הלאומי' ),
			array( 'שכר טרחה עבור סיוע בתביעת נכות כללית מוגבל בחוק (סעיפים 315א עד 315ט לחוק הביטוח הלאומי)', 'https://www.kolzchut.org.il/he/הגבלת_שכר_טרחה_עבור_סיוע_או_ייצוג_בתביעה_לקצבת_נכות_כללית', 'כל זכות' ),
		),
		'official'  => array(
			array( 'נכות כללית, המוסד לביטוח לאומי', 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx' ),
			array( 'קצבת נכות כללית, כל זכות', 'https://www.kolzchut.org.il/he/קצבת_נכות_כללית' ),
			array( 'חוק הביטוח הלאומי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי' ),
		),
		'related'   => array( 'nechut-klalit-benefit', 'deducting-national-insurance-benefits', 'components-compensation-damage', 'medical-malpractice-disability-percentages' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'appointed-court-expert',
		'title'     => 'מומחה רפואי מטעם בית המשפט',
		'seo_title' => 'מומחה מטעם בית המשפט בתיק רשלנות רפואית | Jus-Tice',
		'seo_desc'  => 'תקנה 88 מאפשרת מינוי מומחה מטעם בית המשפט, חוות דעתו מוגשת בתוך 60 ימים, בעלי הדין רשאים לשלוח שאלות הבהרה ולבקש בדיקה של הנפגע.',
		'intro'     => 'כשחוות הדעת של הצדדים סותרות, בית המשפט ממנה מומחה משלו. לחוות הדעת שלו משקל מכריע בפועל, והתקנות קובעות בדיוק איך הוא עובד.',
		'facts'     => array(
			array( 'בית המשפט רשאי בכל עת למנות מומחה מטעמו לעניין שבמומחיות (תקנה 88(א) לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'מומחה בית המשפט רשאי לדרוש מבעל דין להעמיד לבדיקה את נושא חוות הדעת (תקנה 90)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'חוות דעת מומחה בית המשפט מוגשת בתוך 60 ימים מיום שנודע לו על המינוי, אלא אם הורה בית המשפט אחרת (תקנה 91(א))', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'בעל דין רשאי לבקש רשות לשלוח למומחה שאלות הבהרה על חוות דעתו (תקנה 91(ג))', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
		),
		'official'  => array(
			array( 'תקנות סדר הדין האזרחי, הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי' ),
			array( 'פקודת הראיות, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הראיות' ),
			array( 'הרשות השופטת', 'https://www.gov.il/he/departments/the_judicial_authority/govil-landing-page' ),
		),
		'related'   => array( 'attaching-expert-opinion-claim', 'opinion-expert-witness-medicine', 'appealing-malpractice-judgment' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'appealing-malpractice-judgment',
		'title'     => 'ערעור על פסק דין בתביעת רשלנות רפואית',
		'seo_title' => 'ערעור ברשלנות רפואית: 60 יום, הערכאה והאגרה | Jus-Tice',
		'seo_desc'  => '60 ימים להגשת ערעור, משלום למחוזי וממחוזי לעליון בזכות, אגרות הערעור לשנת 2026 (1,654 ש"ח ו-3,539 ש"ח) ואגרת בקשת רשות ערעור.',
		'intro'     => 'פסק דין ברשלנות רפואית ניתן לערעור בזכות בערכאה שמעל. המועד קצר וקבוע בתקנות, והאגרות מתעדכנות מדי שנה.',
		'facts'     => array(
			array( 'המועד להגשת ערעור: 60 ימים מיום המצאת ההחלטה (תקנה 137(א) לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'פסק דין של שלום: ערעור בזכות למחוזי (סעיף 52 לחוק בתי המשפט); פסק דין של מחוזי כערכאה ראשונה: ערעור בזכות לעליון (סעיף 41)', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'חוק בתי המשפט' ),
			array( 'אגרת ערעור על פסק דין של שלום: 1,654 ש"ח; על פסק דין של מחוזי לעליון: 3,539 ש"ח (סכומי 2026, פרטים 16 ו-27 לתוספת)', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'בקשת רשות ערעור על פסק דין של מחוזי בערעור: 1,187 ש"ח (פרט 26, סכומי 2026)', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
		),
		'official'  => array(
			array( 'תקנות סדר הדין האזרחי, הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי' ),
			array( 'תקנות בתי המשפט (אגרות), הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)' ),
			array( 'הרשות השופטת', 'https://www.gov.il/he/departments/the_judicial_authority/govil-landing-page' ),
		),
		'related'   => array( 'venue-malpractice-claim-court', 'costs-litigation-losing-party', 'appointed-court-expert' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'components-compensation-damage',
		'title'     => 'ראשי הנזק בתביעת רשלנות רפואית',
		'seo_title' => 'ראשי נזק ברשלנות רפואית: ממה מורכב הפיצוי | Jus-Tice',
		'seo_desc'  => 'הגדרת נזק ונזק ממון בפקודת הנזיקין, כלל הריחוק בסעיף 76, חובת פירוט נזק ממון, וראשי הנזק המוכרים: הוצאות רפואיות, עזרת צד שלישי, שיקום, ניידות והשתכרות.',
		'intro'     => 'הפיצוי בתביעת רשלנות רפואית אינו סכום אחד אלא סכום של ראשי נזק, שכל אחד מהם מוכח בנפרד. פקודת הנזיקין מגדירה מה נחשב נזק ומה אפשר לתבוע עליו.',
		'facts'     => array(
			array( 'נזק לפי סעיף 2 לפקודת הנזיקין: אובדן חיים, נכס, נוחות, רווחה גופנית או שם טוב, או חיסור מהם; נזק ממון: הפסד או הוצאה ממשיים הניתנים לשומה בכסף', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'פיצויים ניתנים רק בשל נזק שעלול לבוא באורח טבעי במהלכם הרגיל של הדברים ושבא במישרין מעוולת הנתבע (סעיף 76(1))', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'נזק ממון מחייב פירוט בכתב התביעה (סעיף 76(2))', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'ראשי נזק מוכרים בפסיקת פיצויים על נכות: הוצאות רפואיות, עזרת צד שלישי, שיקום, חינוך, דיור, ניידות ואובדן כושר השתכרות', 'https://www.kolzchut.org.il/he/תביעה_בעקבות_לידת_אדם_עם_נכות_בשל_כשל_באבחון_או_רשלנות_רפואית', 'כל זכות' ),
			array( 'אין נפרעים אלא פעם אחת בשל אותו נזק (סעיף 77)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'פקודת הנזיקין, כל זכות', 'https://www.kolzchut.org.il/he/פקודת_הנזיקין' ),
			array( 'הגשת תביעת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית' ),
		),
		'related'   => array( 'pain-suffering-compensation-caselaw', 'capitalization-future-damages', 'deducting-national-insurance-benefits', 'medical-malpractice-compensation' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'pain-suffering-compensation-caselaw',
		'title'     => 'כאב וסבל ונזק לא ממוני ברשלנות רפואית',
		'seo_title' => 'כאב וסבל ברשלנות רפואית: הבסיס בחוק | Jus-Tice',
		'seo_desc'  => 'נזק לא ממוני מוכר בסעיף 2 לפקודת הנזיקין, נפסק לפי שיקול דעת בית המשפט בלי תקרה סטטוטורית, בשונה מתאונות דרכים, וכולל קיצור תוחלת חיים ואובדן הנאות חיים.',
		'intro'     => 'הכאב, הסבל ואובדן הנאות החיים הם ראש נזק שאינו ניתן לחישוב חשבונאי. בתביעות רשלנות רפואית הוא נפסק לפי שיקול דעת, ולא לפי נוסחה קבועה בחוק.',
		'facts'     => array(
			array( 'הבסיס החוקי: נזק כולל אובדן נוחות ורווחה גופנית וחיסור מהם (סעיף 2 לפקודת הנזיקין), כלומר הכרה בנזק שאינו נזק ממון', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'הגדרת פשרה בתקנות האגרות כוללת פסיקה לפי סעיף 79א לחוק בתי המשפט ולפי סעיף 4(ג) לחוק פיצויים לנפגעי תאונות דרכים', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'קיצור תוחלת חיים ואובדן הנאות חיים נתבעים כראשי נזק לא ממוניים במסגרת סעיף 76 לפקודה', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'ההוכחה נשענת על חוות דעת מומחה לגבי הנכות והשלכותיה (תקנה 87 לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'הגדרת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית' ),
			array( 'הרשות השופטת', 'https://www.gov.il/he/departments/the_judicial_authority/govil-landing-page' ),
		),
		'related'   => array( 'components-compensation-damage', 'loss-chances-recovery-doctrine', 'dependents-estate-claims-death' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'deducting-national-insurance-benefits',
		'title'     => 'ניכוי גמלאות ביטוח לאומי מפיצויי רשלנות רפואית',
		'seo_title' => 'ניכוי קצבאות ביטוח לאומי מהפיצוי: סעיפים 328 ו-330 | Jus-Tice',
		'seo_desc'  => 'זכות השיפוי של המוסד לביטוח לאומי לפי סעיף 328, תקרת 75% כשהתביעות נדונות יחד (סעיף 330), ניכוי גמלה בתביעת עובד ותקנות ההיוון.',
		'intro'     => 'מי שמקבל קצבה מהביטוח הלאומי בגלל הנזק לא מקבל את אותו כסף פעמיים. החוק קובע איך הגמלאות מנוכות מהפיצוי ומה נשאר לנפגע.',
		'facts'     => array(
			array( 'כשהאירוע מזכה גם בגמלה וגם בפיצויים מצד שלישי, המוסד לביטוח לאומי רשאי לתבוע מהמזיק שיפוי על הגמלאות ששילם ושעתיד לשלם (סעיף 328(א) לחוק הביטוח הלאומי)', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי', 'חוק הביטוח הלאומי' ),
			array( 'כשתביעת הנפגע ותביעת המוסד נדונות יחד, המוסד לא יקבל יותר מ-75% מסך הפיצויים, והנפגע זכאי ליתרה (סעיף 330(א))', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי', 'חוק הביטוח הלאומי' ),
			array( 'בתביעת עובד נגד מעביד הגמלה מנוכה מסכום הפיצויים (סעיף 82 לפקודת הנזיקין)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'שווי הגמלאות העתידיות לניכוי מחושב בהיוון לפי תקנות הביטוח הלאומי (היוון)', 'https://he.wikisource.org/wiki/תקנות_הביטוח_הלאומי_(היוון)', 'תקנות ההיוון' ),
		),
		'official'  => array(
			array( 'חוק הביטוח הלאומי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי' ),
			array( 'תקנות הביטוח הלאומי (היוון)', 'https://he.wikisource.org/wiki/תקנות_הביטוח_הלאומי_(היוון)' ),
			array( 'נכות כללית, המוסד לביטוח לאומי', 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx' ),
		),
		'related'   => array( 'claiming-disability-social-security', 'capitalization-future-damages', 'components-compensation-damage' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'contingency-fee-injury-claims',
		'title'     => 'שכר טרחת עורך דין בתביעות רשלנות רפואית ונזיקין',
		'seo_title' => 'שכר טרחה ברשלנות רפואית: מה מוגבל בחוק ומה לא | Jus-Tice',
		'seo_desc'  => 'בתביעות רשלנות רפואית אין תקרת שכר טרחה בדין; לשם השוואה, בתאונות דרכים התקרה היא 8%, 11% או 13%, ובנכות כללית מול ביטוח לאומי השכר מוגבל בחוק.',
		'intro'     => 'שכר הטרחה בתביעות רשלנות רפואית נקבע בהסכם, לא בחוק. לעומת זאת בשני תחומים סמוכים המחוקק הגביל אותו במפורש, וההשוואה עוזרת להבין מה מקובל.',
		'facts'     => array(
			array( 'בתביעות פלת"ד קיימת תקרה בדין: 8% בפשרה לפני הגשת תביעה, 11% בפשרה אחרי הגשה, 13% כשנפסק סכום בפסק דין, בתוספת מע"מ', 'https://www.kolzchut.org.il/he/הגבלת_שכר_הטרחה_של_עורכי_דין_המטפלים_בתביעות_של_נפגעי_תאונות_דרכים', 'כל זכות' ),
			array( 'בייצוג מול ביטוח לאומי בנכות כללית שכר הטרחה מוגבל בחוק (סעיפים 315א עד 315ט לחוק הביטוח הלאומי); אסור לגבות מעבר לקבוע', 'https://www.kolzchut.org.il/he/הגבלת_שכר_טרחה_עבור_סיוע_או_ייצוג_בתביעה_לקצבת_נכות_כללית', 'כל זכות' ),
			array( 'מי שנגבה ממנו שכר מעל התקרה החוקית זכאי להחזר', 'https://www.kolzchut.org.il/he/הגבלת_שכר_הטרחה_של_עורכי_דין_המטפלים_בתביעות_של_נפגעי_תאונות_דרכים', 'כל זכות' ),
			array( 'בתביעת נזקי גוף האגרה הראשונית נמוכה (839 ש"ח בשלום ב-2026) והיתרה נדחית לסוף ההליך, מה שמקטין את ההוצאה בפתיחה', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
		),
		'official'  => array(
			array( 'הגבלת שכר טרחה בתאונות דרכים, כל זכות', 'https://www.kolzchut.org.il/he/הגבלת_שכר_הטרחה_של_עורכי_דין_המטפלים_בתביעות_של_נפגעי_תאונות_דרכים' ),
			array( 'הגבלת שכר טרחה בנכות כללית, כל זכות', 'https://www.kolzchut.org.il/he/הגבלת_שכר_טרחה_עבור_סיוע_או_ייצוג_בתביעה_לקצבת_נכות_כללית' ),
			array( 'חוק הביטוח הלאומי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי' ),
		),
		'related'   => array( 'costs-litigation-losing-party', 'compromise-mediation-malpractice-cases', 'claiming-disability-social-security', 'medical-malpractice-cost' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'costs-litigation-losing-party',
		'title'     => 'אגרות והוצאות משפט בתביעת רשלנות רפואית',
		'seo_title' => 'אגרת תביעת רשלנות רפואית 2026 ומי משלם בסוף | Jus-Tice',
		'seo_desc'  => 'אגרת נזקי גוף 2026: 8,061 ש"ח בשלום ו-50,380 ש"ח במחוזי, מתוכם 839 או 1,429 ש"ח בהגשה. מי נושא ביתרה לפי התוצאה, פטור בפשרה ובקשת פטור מאגרה.',
		'intro'     => 'האגרה בתביעת נזקי גוף בנויה כך שהתובע משלם מעט בכניסה והיתרה נקבעת לפי התוצאה. אלה הסכומים המעודכנים לשנת 2026 והכללים על מי הם נופלים.',
		'facts'     => array(
			array( 'אגרת תביעת נזקי גוף (תקנה 5 עם פרטים 2 ו-9 לתוספת): 8,061 ש"ח בשלום ו-50,380 ש"ח במחוזי בסכומי 2026; בעת ההגשה משולמים רק 839 ש"ח בשלום או 1,429 ש"ח במחוזי', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'זכה התובע, הנתבע נושא באגרה ומשפה את התובע (תקנה 5(ב)(5)); נדחתה התביעה, התובע משלם את היתרה (תקנה 5(ב)(7))', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'פטור מיתרת האגרה אם ההליך הסתיים בפשרה, גישור או בוררות לפני תום קדם המשפט השלישי (תקנה 5(ב)(2))', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'בקשה לפטור מאגרה מוסדרת בתקנה 14, בצירוף תצהיר על מצב כלכלי; בנזקי גוף מוגשת עד 15 ימים מהמועד לתשלום', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'טבלת האגרות הרשמית מתפרסמת באתר בתי המשפט', 'https://www.gov.il/he/departments/general/fees_16', 'gov.il' ),
		),
		'official'  => array(
			array( 'תקנות בתי המשפט (אגרות), הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)' ),
			array( 'טבלת אגרות בתי המשפט', 'https://www.gov.il/he/departments/general/fees_16' ),
			array( 'הרשות השופטת', 'https://www.gov.il/he/departments/the_judicial_authority/govil-landing-page' ),
		),
		'related'   => array( 'venue-malpractice-claim-court', 'contingency-fee-injury-claims', 'compromise-mediation-malpractice-cases', 'medical-malpractice-costs' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'dependents-estate-claims-death',
		'title'     => 'תביעת תלויים ועיזבון במקרה פטירה מרשלנות רפואית',
		'seo_title' => 'פטירה מרשלנות רפואית: תביעת תלויים ועיזבון | Jus-Tice',
		'seo_desc'  => 'העילה אינה פוקעת במות הנפגע ועוברת לעיזבון (סעיף 19), בן זוג, הורה וילד תובעים על הפסד התמיכה (סעיפים 78 עד 80), כולל הוצאות קבורה.',
		'intro'     => 'כשמטופל נפטר בעקבות רשלנות רפואית נפתחות שתי תביעות נפרדות: של העיזבון ושל התלויים בו. פקודת הנזיקין מגדירה מי תובע ועל מה.',
		'facts'     => array(
			array( 'עילת התביעה אינה פוקעת במות הנפגע והיא עוברת לטובת העיזבון (סעיף 19 לפקודת הנזיקין)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'תביעת תלויים: בן זוג, הורה וילד של המנוח זכאים לפיצוי על הפסדי התמיכה (סעיפים 78 עד 80)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'הפיצוי לתלויים מחושב לפי הפסד הממון שנגרם להם בפועל, כולל הוצאות קבורה (סעיף 80)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'תקופת ההתיישנות: 7 שנים (סעיף 5 לחוק ההתיישנות), בכפוף למגבלת סעיף 89 לפקודה', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'חוק ההתיישנות, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_ההתיישנות' ),
			array( 'פקודת הנזיקין, כל זכות', 'https://www.kolzchut.org.il/he/פקודת_הנזיקין' ),
		),
		'related'   => array( 'components-compensation-damage', 'deadline-suing-medical-negligence', 'hityashnut-law-1958' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'capitalization-future-damages',
		'title'     => 'היוון פיצויים ונזקים עתידיים ברשלנות רפואית',
		'seo_title' => 'היוון פיצויים: איך מתרגמים הפסד עתידי לסכום אחד | Jus-Tice',
		'seo_desc'  => 'היוון הופך הפסדים עתידיים מתמשכים לסכום חד-פעמי בערך נוכחי. תקנות הביטוח הלאומי (היוון) קובעות ריבית של 3% ולוחות חיים לחישוב.',
		'intro'     => 'פיצוי על נכות משולם פעם אחת, אבל הנזק נמשך שנים. ההיוון הוא הנוסחה שמתרגמת הפסד עתידי לסכום נוכחי, וכל אחוז ריבית משנה את התוצאה.',
		'facts'     => array(
			array( 'היוון: תרגום הפסדים עתידיים מתמשכים (שכר, עזרה, קצבאות) לסכום חד-פעמי בערך נוכחי; העיקרון מיושם גם בניכוי גמלאות ביטוח לאומי', 'https://he.wikisource.org/wiki/תקנות_הביטוח_הלאומי_(היוון)', 'תקנות ההיוון' ),
			array( 'שיעור הריבית להיוון קצבאות לפי תקנה 15(1) לתקנות הביטוח הלאומי (היוון), בנוסחן המעודכן: 3%', 'https://he.wikisource.org/wiki/תקנות_הביטוח_הלאומי_(היוון)', 'תקנות ההיוון' ),
			array( 'ההיוון נעשה על סמך לוחות חיים (תוחלת חיים) שבתוספות לתקנות', 'https://he.wikisource.org/wiki/תקנות_הביטוח_הלאומי_(היוון)', 'תקנות ההיוון' ),
			array( 'שווי הגמלאות העתידיות שהמוסד תובע מהמזיק לפי סעיף 328 מחושב באותה שיטה', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי', 'חוק הביטוח הלאומי' ),
		),
		'official'  => array(
			array( 'תקנות הביטוח הלאומי (היוון)', 'https://he.wikisource.org/wiki/תקנות_הביטוח_הלאומי_(היוון)' ),
			array( 'המוסד לביטוח לאומי', 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx' ),
			array( 'חוק הביטוח הלאומי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי' ),
		),
		'related'   => array( 'deducting-national-insurance-benefits', 'components-compensation-damage', 'claiming-disability-social-security' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'commissioner-public-complaints-medical',
		'title'     => 'נציבות קבילות הציבור למקצועות רפואיים',
		'seo_title' => 'נציב הקבילות למקצועות רפואיים: סמכויות ותהליך | Jus-Tice',
		'seo_desc'  => 'היחידה במשרד הבריאות שמבררת קבילות על איכות טיפול והתנהגות מטפלים, בחינם ובכל המערכת. מה בסמכותה, מה לא, ואיך עוקבים אחרי תלונה.',
		'intro'     => 'זהו הגוף שאליו מגיעה תלונה על רופא, אחות או מטפל אחר. הוא לא בית משפט ולא פוסק פיצוי, אבל בסמכותו להעביר ממצאים להליך משמעתי.',
		'facts'     => array(
			array( 'הנציבות היא יחידה במשרד הבריאות המבררת קבילות על איכות טיפול והתנהגות מקצועית של מטפלים, בבתי חולים ובקהילה', 'https://www.gov.il/he/departments/units/medical_professions_ombudsman_unit/govil-landing-page', 'gov.il' ),
			array( 'הבירור בחינם, פתוח לכל אדם, כולל על המערכת הפרטית', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לנציב_קבילות_הציבור_למקצועות_רפואיים', 'כל זכות' ),
			array( 'בסמכות הנציבות להעביר ממצאים להליך משמעתי לפי פקודת הרופאים ולהמליץ על ועדת בדיקה', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לנציב_קבילות_הציבור_למקצועות_רפואיים', 'כל זכות' ),
			array( 'הנציבות אינה דנה בזכאות לפי סל הבריאות ואינה פוסקת פיצוי', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לנציב_קבילות_הציבור_למקצועות_רפואיים', 'כל זכות' ),
			array( 'מעקב אחר תלונה במוקד קול הבריאות, 5400 כוכבית', 'https://www.gov.il/he/service/kol-briut-moked', 'gov.il' ),
		),
		'official'  => array(
			array( 'נציבות קבילות הציבור למקצועות רפואיים, gov.il', 'https://www.gov.il/he/departments/units/medical_professions_ombudsman_unit/govil-landing-page' ),
			array( 'הגשת תלונה על בעלי מקצועות רפואיים', 'https://www.gov.il/he/service/public_ombudsman_for_medical_professions' ),
			array( 'מוקד קול הבריאות', 'https://www.gov.il/he/service/kol-briut-moked' ),
		),
		'related'   => array( 'complaint-health-ministry-commissioner', 'kvilot-health-insurance-law', 'ministry-health-regulator-role' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'ministry-health-regulator-role',
		'title'     => 'משרד הבריאות כרגולטור של מערכת הבריאות',
		'seo_title' => 'משרד הבריאות: פיקוח, רישוי ומשמעת | Jus-Tice',
		'seo_desc'  => 'על מה משרד הבריאות מפקח: הכרה בקופות החולים, רישוי מקצועות הרפואה, רגולציה של הרשומה הרפואית, יחידת הדין המשמעתי ונציבות הקבילות.',
		'intro'     => 'משרד הבריאות הוא הרגולטור של כל שרשרת הטיפול: מרישיון הרופא ועד הכרה בקופת חולים. לנפגע רשלנות חשוב לדעת אילו יחידות שלו רלוונטיות.',
		'facts'     => array(
			array( 'שר הבריאות מכיר בקופות חולים ומפקח עליהן לפי חוק ביטוח בריאות ממלכתי (סעיפים 24 ו-25)', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'המשרד מסדיר את רישוי מקצועות הרפואה והבריאות: רפואה, סיעוד, פיזיותרפיה ועוד', 'https://www.gov.il/he/departments/topics/medical-professions-licensing/govil-landing-page', 'gov.il' ),
			array( 'תחום רישום ומידע רפואי במשרד אחראי לרגולציה של תיעוד, קידוד ושמירת מידע רפואי', 'https://www.gov.il/he/departments/units/medical_registration_unit/govil-landing-page', 'gov.il' ),
			array( 'המשרד מפעיל את יחידת הדין המשמעתי ואת נציבות הקבילות למקצועות רפואיים', 'https://www.gov.il/he/departments/units/prosecution_unit/govil-landing-page', 'gov.il' ),
			array( 'שר הבריאות מוסמך להתקין תקנות לפי חוק זכויות החולה (סעיף 32)', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
		),
		'official'  => array(
			array( 'משרד הבריאות', 'https://www.gov.il/he/departments/ministry_of_health/govil-landing-page' ),
			array( 'רישוי מקצועות רפואיים', 'https://www.gov.il/he/departments/topics/medical-professions-licensing/govil-landing-page' ),
			array( 'תחום רישום ומידע רפואי', 'https://www.gov.il/he/departments/units/medical_registration_unit/govil-landing-page' ),
		),
		'related'   => array( 'licensing-doctors-verification', 'commissioner-public-complaints-medical', 'governmental-hospitals-state-liability' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'tribunal-medical-discipline',
		'title'     => 'ועדות המשמעת למקצועות הרפואה',
		'seo_title' => 'ועדת משמעת לרופאים: הרכב, דיון ופרסום | Jus-Tice',
		'seo_desc'  => 'הרכב ועדת המשמעת (שני אנשי מקצוע ומשפטן), דיונים פומביים, סדרי הדין בתקנות הרופאים משנת 1976, מאגר ההחלטות ואמצעי המשמעת לפי סעיף 41.',
		'intro'     => 'ועדות המשמעת הן הערכאה המקצועית שדנה ברופאים ובבעלי מקצועות בריאות אחרים. ההליך פומבי ברובו והחלטותיו מתפרסמות, ולכן הן מקור מידע לתובעים.',
		'facts'     => array(
			array( 'יחידת הדין המשמעתי במשרד הבריאות מנהלת הליכי משמעת נגד בעלי מקצועות רפואיים ופרא-רפואיים', 'https://www.gov.il/he/departments/units/prosecution_unit/govil-landing-page', 'gov.il' ),
			array( 'הרכב ועדת משמעת ככלל: שני אנשי מקצוע, אחד מהם נציג האיגוד המקצועי, ומשפטן; הנילון רשאי להיות מיוצג בעורך דין', 'https://www.gov.il/he/departments/units/prosecution_unit/govil-landing-page', 'gov.il' ),
			array( 'סדרי הדין: תקנות הרופאים (סדרי דין בדיון משמעתי), התשל"ו-1976', 'https://www.gov.il/he/pages/rofim12', 'gov.il' ),
			array( 'ההחלטות מתפרסמות במאגר החלטות ועדות המשמעת', 'https://www.gov.il/he/departments/dynamiccollectors/disciplinary-action', 'מאגר ההחלטות' ),
			array( 'אמצעי המשמעת האפשריים: התראה, נזיפה, התליית רישיון או ביטולו (סעיף 41 לפקודת הרופאים)', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
		),
		'official'  => array(
			array( 'יחידת הדין המשמעתי, משרד הבריאות', 'https://www.gov.il/he/departments/units/prosecution_unit/govil-landing-page' ),
			array( 'מאגר החלטות ועדות המשמעת', 'https://www.gov.il/he/departments/dynamiccollectors/disciplinary-action' ),
			array( 'תקנות הרופאים (סדרי דין בדיון משמעתי)', 'https://www.gov.il/he/pages/rofim12' ),
		),
		'related'   => array( 'disciplinary-complaint-against-doctor', 'physicians-ordinance-1976', 'licensing-doctors-verification' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'health-funds-legal-status',
		'title'     => 'קופות החולים כנתבעות בתביעות רשלנות רפואית',
		'seo_title' => 'המעמד המשפטי של קופת חולים ואחריותה בנזיקין | Jus-Tice',
		'seo_desc'  => 'קופת חולים היא תאגיד ללא מטרות רווח שהוכר בידי שר הבריאות, חייבת לקבל כל תושב, אחראית כמעבידה לפי סעיפים 13 ו-14 לפקודת הנזיקין ונתבעת בבית משפט אזרחי.',
		'intro'     => 'ארבע קופות החולים הן הנתבעות הנפוצות ביותר בתביעות רשלנות בקהילה. המעמד המשפטי שלהן קבוע בחוק ביטוח בריאות ממלכתי, והאחריות בפקודת הנזיקין.',
		'facts'     => array(
			array( 'קופת חולים מוכרת היא תאגיד ללא מטרות רווח שהוכר בידי שר הבריאות (סעיפים 24 ו-25 לחוק ביטוח בריאות ממלכתי)', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'ארבע הקופות הקיימות מוכרות מכוח סעיף 67 (הכרה בקופה קיימת)', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'קופה חייבת לקבל כל תושב שבחר להירשם בה ללא תנאים (סעיף 4(ג)) ולספק את סל השירותים (סעיפים 3, 7 ו-8 והתוספות)', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'אחריותה בנזיקין: כמעבידה של רופאיה ועובדיה (סעיף 13 לפקודת הנזיקין) וכמעסיקת שלוחים (סעיף 14)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'תביעת נזיקין נגד קופה נדונה בבתי המשפט האזרחיים, לא בבית הדין לעבודה (סעיף 54(ב))', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
		),
		'official'  => array(
			array( 'חוק ביטוח בריאות ממלכתי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי' ),
			array( 'משרד הבריאות', 'https://www.gov.il/he/departments/ministry_of_health/govil-landing-page' ),
			array( 'הגשת קבילה לפי חוק ביטוח בריאות ממלכתי', 'https://www.gov.il/he/service/national-health-insurance-law-complaint-submission' ),
		),
		'related'   => array( 'hmo-negligence-claim', 'mamlachti-health-insurance-law', 'vicarious-hospital-responsibility' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'governmental-hospitals-state-liability',
		'title'     => 'בתי החולים הממשלתיים ומי הנתבע בתביעה נגדם',
		'seo_title' => 'רשלנות בבית חולים ממשלתי: הנתבעת היא המדינה | Jus-Tice',
		'seo_desc'  => 'בתי החולים הממשלתיים אינם אישיות משפטית נפרדת, הנתבעת היא מדינת ישראל לפי חוק הנזיקים האזרחיים (אחריות המדינה), והרופא נהנה מחסינות לפי סעיף 7א.',
		'intro'     => 'תביעה על רשלנות בבית חולים ממשלתי מוגשת נגד המדינה, לא נגד בית החולים ולא נגד הרופא. שלושה חיקוקים מסבירים למה, ומה זה משנה בפועל.',
		'facts'     => array(
			array( 'בתי החולים הממשלתיים מאוגדים בחטיבת המרכזים הרפואיים הממשלתיים של משרד הבריאות ואינם אישיות משפטית נפרדת; הנתבעת היא מדינת ישראל', 'https://www.gov.il/he/departments/units/governmental_health_centers/govil-landing-page', 'gov.il' ),
			array( 'דין המדינה בנזיקין כדין כל גוף מואגד (סעיף 2 לחוק הנזיקים האזרחיים (אחריות המדינה), התשי"ב-1952)', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)', 'חוק אחריות המדינה' ),
			array( 'פטור המדינה על מעשה בתחום הרשאה חוקית אינו חל על רשלנות (סעיף 3)', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)', 'חוק אחריות המדינה' ),
			array( 'לרופא עובד ציבור חסינות אישית על מעשה בתפקיד, למעט מעשה ביודעין בכוונה לגרום נזק, והתביעה מופנית למדינה (סעיף 7א לפקודת הנזיקין)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'שמירת רשומות בבתי חולים מוסדרת בתקנות בריאות העם (שמירת רשומות), התשל"ז-1976', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)', 'תקנות שמירת רשומות' ),
		),
		'official'  => array(
			array( 'חטיבת המרכזים הרפואיים הממשלתיים', 'https://www.gov.il/he/departments/units/governmental_health_centers/govil-landing-page' ),
			array( 'רשימת המרכזים הרפואיים הממשלתיים', 'https://www.gov.il/he/pages/health-centers-list' ),
			array( 'חוק הנזיקים האזרחיים (אחריות המדינה)', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)' ),
		),
		'related'   => array( 'liability-state-law-1952', 'immunity-public-employees-lawsuit', 'vicarious-hospital-responsibility' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'nechut-klalit-benefit',
		'title'     => 'נכות כללית בביטוח לאומי לנפגעי רשלנות רפואית',
		'seo_title' => 'קצבת נכות כללית 2026: תנאים, דרגות וסכומים | Jus-Tice',
		'seo_desc'  => 'תנאי הזכאות לנכות כללית, ארבע דרגות אי-הכושר, הסכומים לשנת 2026 מ-2,718 עד 4,711 ש"ח, תקרת ההכנסה 8,261 ש"ח, וההגשה למוסד לביטוח לאומי.',
		'intro'     => 'קצבת נכות כללית לא דורשת הוכחת אשם ולא מחכה לפסק דין. מי שנותר עם נכות בעקבות טיפול רפואי בודק אותה במקביל לתביעה. אלה התנאים והמספרים.',
		'facts'     => array(
			array( 'תנאי הזכאות: תושב, גיל 18 עד פרישה, נכות רפואית 60% לפחות (או 40% עם ליקוי אחד של 25% ומעלה), אובדן כושר השתכרות של 50% לפחות', 'https://www.kolzchut.org.il/he/קצבת_נכות_כללית', 'כל זכות' ),
			array( 'דרגות אי-כושר: 60%, 65%, 74% ו-100% (75% נחשבת מלאה)', 'https://www.kolzchut.org.il/he/קצבת_נכות_כללית', 'כל זכות' ),
			array( 'סכומי 2026: קצבה מלאה 4,711 ש"ח לחודש; 74% 3,211 ש"ח; 65% 2,894 ש"ח; 60% 2,718 ש"ח', 'https://www.kolzchut.org.il/he/קצבת_נכות_כללית', 'כל זכות' ),
			array( 'תקרת הכנסה מעבודה לזכאות: 8,261 ש"ח לחודש (2026)', 'https://www.kolzchut.org.il/he/קצבת_נכות_כללית', 'כל זכות' ),
			array( 'ההגשה למוסד לביטוח לאומי, כולל טופס מקוון; מוקד 6050 כוכבית', 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx', 'ביטוח לאומי' ),
			array( 'הקצבה אינה תלויה בהוכחת אשם; במקביל ניתן לנהל תביעת נזיקין, בכפוף לזכות השיפוי של המוסד לפי סעיף 328', 'https://he.wikisource.org/wiki/חוק_הביטוח_הלאומי', 'חוק הביטוח הלאומי' ),
		),
		'official'  => array(
			array( 'נכות כללית, המוסד לביטוח לאומי', 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx' ),
			array( 'קצבת נכות כללית, כל זכות', 'https://www.kolzchut.org.il/he/קצבת_נכות_כללית' ),
			array( 'המוסד לביטוח לאומי, אודות', 'https://www.btl.gov.il/About/Pages/default.aspx' ),
		),
		'related'   => array( 'claiming-disability-social-security', 'deducting-national-insurance-benefits', 'capitalization-future-damages' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'kvilot-health-insurance-law',
		'title'     => 'נציבות הקבילות לחוק ביטוח בריאות ממלכתי',
		'seo_title' => 'קופת חולים מסרבת לשירות מהסל: למי פונים | Jus-Tice',
		'seo_desc'  => 'נציב הקבילות לחוק ביטוח בריאות ממלכתי: מינוי לחמש שנים לפי סעיף 43, קבילה על קופה או נותן שירות, אכיפה אחרי 21 יום לפי סעיף 46א, וטופס מקוון.',
		'intro'     => 'כשהבעיה היא סירוב של קופת חולים לתת שירות שמגיע מהסל, הכתובת היא נציבות אחרת מזו שמטפלת ברשלנות. כך מבדילים ביניהן ואיך מגישים.',
		'facts'     => array(
			array( 'נציב הקבילות ממונה בידי שר הבריאות באישור הממשלה ומועצת הבריאות, לתקופת כהונה של 5 שנים (סעיף 43 לחוק ביטוח בריאות ממלכתי)', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'כל תושב רשאי לקבול על קופת חולים, נותן שירותים או מי מטעמם בענייני החוק והסל', 'https://www.kolzchut.org.il/he/נציבות_קבילות_הציבור_לחוק_ביטוח_בריאות_ממלכתי', 'כל זכות' ),
			array( 'נמצאה תלונה על אי-מתן שירות מוצדקת ולא פעלה הקופה בתוך 21 ימים, ניתן לפנות למנהל לאכיפת ההחלטה (סעיף 46א)', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'הגשת קבילה בטופס מקוון בשירות הייעודי', 'https://www.gov.il/he/service/national-health-insurance-law-complaint-submission', 'gov.il' ),
			array( 'תלונות על איכות טיפול והתנהגות מטפלים אינן בסמכותה; הן מופנות לנציבות הקבילות למקצועות רפואיים', 'https://www.kolzchut.org.il/he/נציבות_קבילות_הציבור_לחוק_ביטוח_בריאות_ממלכתי', 'כל זכות' ),
		),
		'official'  => array(
			array( 'הגשת קבילה לפי חוק ביטוח בריאות ממלכתי, gov.il', 'https://www.gov.il/he/service/national-health-insurance-law-complaint-submission' ),
			array( 'חוק ביטוח בריאות ממלכתי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי' ),
			array( 'נציבות הקבילות לחוק ביטוח בריאות ממלכתי, כל זכות', 'https://www.kolzchut.org.il/he/נציבות_קבילות_הציבור_לחוק_ביטוח_בריאות_ממלכתי' ),
		),
		'related'   => array( 'commissioner-public-complaints-medical', 'mamlachti-health-insurance-law', 'health-funds-legal-status' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'licensing-doctors-verification',
		'title'     => 'בדיקת רישיון רופא במאגרי משרד הבריאות',
		'seo_title' => 'איך בודקים אם לרופא יש רישיון בתוקף | Jus-Tice',
		'seo_desc'  => 'ייחוד העיסוק ברפואה לפי סעיף 2 לפקודת הרופאים, שירות החיפוש הפומבי של משרד הבריאות, המאגר הרשמי של בעלי הרישיונות והמקצועות המוסדרים.',
		'intro'     => 'לפני בחירת מומחה לחוות דעת, ולפני תביעה נגד רופא, בודקים במאגר הרשמי אם יש לו רישיון ובאיזו התמחות. הבדיקה חינם ופתוחה לציבור.',
		'facts'     => array(
			array( 'העיסוק ברפואה מותר רק לבעל רישיון לפי פקודת הרופאים (סעיף 2)', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'משרד הבריאות מפעיל שירות חיפוש פומבי במאגרי בעלי רישיון במקצועות הרפואה והבריאות', 'https://www.gov.il/he/service/licensed-medical-practitioners', 'gov.il' ),
			array( 'המאגר הרשמי, ובו פנקס הרופאים, זמין באתר ייעודי של משרד הבריאות', 'https://practitioners.health.gov.il/', 'מאגר בעלי הרישיונות' ),
			array( 'המקצועות המוסדרים כוללים רפואה, רפואת שיניים, סיעוד, פיזיותרפיה, פסיכולוגיה ועוד', 'https://www.gov.il/he/departments/topics/medical-professions-licensing/govil-landing-page', 'gov.il' ),
			array( 'בדיקת רישיון והתמחות רלוונטית לבחירת מומחה לחוות דעת ולבדיקת הנתבע', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חיפוש בעלי רישיון במקצועות הבריאות, gov.il', 'https://www.gov.il/he/service/licensed-medical-practitioners' ),
			array( 'מאגר בעלי הרישיונות של משרד הבריאות', 'https://practitioners.health.gov.il/' ),
			array( 'רישוי מקצועות רפואיים', 'https://www.gov.il/he/departments/topics/medical-professions-licensing/govil-landing-page' ),
		),
		'related'   => array( 'physicians-ordinance-1976', 'tribunal-medical-discipline', 'opinion-expert-witness-medicine', 'types-of-doctors-medical-specializations-israel' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'kol-habriut-hotline',
		'title'     => 'מוקד קול הבריאות 5400 של משרד הבריאות',
		'seo_title' => 'מוקד 5400 כוכבית: מה מבררים ואיך | Jus-Tice',
		'seo_desc'  => 'קול הבריאות הוא מוקד השירות של משרד הבריאות: 5400 כוכבית או 08-6241010, ימים א עד ה 8:00 עד 18:00, שבע שפות, הגשה ומעקב של תלונות לנציבות הקבילות.',
		'intro'     => 'המוקד הטלפוני של משרד הבריאות הוא נקודת הכניסה הפשוטה ביותר לבירור, לתלונה ולמעקב. אלה המספרים, השעות והשפות.',
		'facts'     => array(
			array( 'קול הבריאות הוא מוקד השירות והמידע הטלפוני של משרד הבריאות: 5400 כוכבית או 08-6241010', 'https://www.gov.il/he/service/kol-briut-moked', 'gov.il' ),
			array( 'שעות פעילות: ימים א עד ה 8:00 עד 18:00, שישי וערבי חג 8:00 עד 13:00', 'https://www.gov.il/he/service/kol-briut-moked', 'gov.il' ),
			array( 'מענה בעברית, ערבית, רוסית, אנגלית, צרפתית, אמהרית וטיגרינית, כולל תרגום רפואי ותרגום מרחוק לשפת סימנים', 'https://www.gov.il/he/service/kol-briut-moked', 'gov.il' ),
			array( 'דרך המוקד מגישים ומעדכנים תלונות לנציבות הקבילות למקצועות רפואיים ובודקים סטטוס טיפול', 'https://www.kolzchut.org.il/he/הגשת_תלונה_לנציב_קבילות_הציבור_למקצועות_רפואיים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'מוקד קול הבריאות, gov.il', 'https://www.gov.il/he/service/kol-briut-moked' ),
			array( 'משרד הבריאות', 'https://www.gov.il/he/departments/ministry_of_health/govil-landing-page' ),
			array( 'הגשת תלונה על בעלי מקצועות רפואיים', 'https://www.gov.il/he/service/public_ombudsman_for_medical_professions' ),
		),
		'related'   => array( 'complaint-health-ministry-commissioner', 'commissioner-public-complaints-medical', 'obtaining-medical-records-copy' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'patient-rights-law-1996',
		'title'     => 'חוק זכויות החולה התשנו 1996: הסעיפים המרכזיים',
		'seo_title' => 'חוק זכויות החולה: הסכמה מדעת, רשומה וועדות | Jus-Tice',
		'seo_desc'  => 'סעיף 13 הסכמה מדעת, סעיף 14 הסכמה בכתב לניתוחים ולטיפולים שבתוספת, סעיפים 17 ו-18 הרשומה הרפואית והזכות לקבלה, סעיפים 21 ו-22 ועדות בדיקה ובקרה.',
		'intro'     => 'חוק זכויות החולה הוא החוק שכל תביעת רשלנות רפואית נשענת עליו: הוא קובע מה חייבים להסביר למטופל, מה חייבים לתעד, ומה המטופל זכאי לקבל.',
		'facts'     => array(
			array( 'סעיף 13: אין מטפלים במטופל אלא בהסכמה מדעת, לאחר מסירת המידע הרפואי הדרוש להחלטה', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'סעיף 14: הסכמה בכתב, בעל פה או בהתנהגות; לטיפולים שבתוספת (ניתוחים, צנתור, דיאליזה, כימותרפיה, הקרנות, הפריה חוץ-גופית) נדרשת הסכמה בכתב', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'סעיף 17: חובת המטפל לתעד את מהלך הטיפול ברשומה רפואית; סעיף 18: זכות המטופל לקבל מידע והעתקים מהרשומה', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'סעיפים 21 ו-22: ועדת בדיקה, שממצאיה נמסרים למטופל, וועדת בקרה ואיכות, שדיוניה חסויים', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'סעיף 20: החריגים למסירת מידע לצד שלישי: הסכמה, חובה בדין, המשך טיפול, ועדת אתיקה', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'הפרת הוראות החוק היא גם עילת משמעת לפי פקודת הרופאים (סעיף 41)', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
		),
		'official'  => array(
			array( 'חוק זכויות החולה, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה' ),
			array( 'חוק זכויות החולה, כל זכות', 'https://www.kolzchut.org.il/he/חוק_זכויות_החולה' ),
			array( 'משרד הבריאות', 'https://www.gov.il/he/departments/ministry_of_health/govil-landing-page' ),
		),
		'related'   => array( 'informed-consent-treatment', 'internal-hospital-inquiry-committee', 'obtaining-medical-records-copy' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'nezikin-ordinance-negligence',
		'title'     => 'פקודת הנזיקין: עוולת הרשלנות בסעיפים 35, 36 ו-41',
		'seo_title' => 'פקודת הנזיקין ורשלנות רפואית: הסעיפים שקובעים | Jus-Tice',
		'seo_desc'  => 'סעיף 35 מגדיר רשלנות, סעיף 36 את חובת הזהירות, סעיף 41 מעביר את נטל ההוכחה, סעיף 19 והסעיפים 78 עד 80 עוסקים בפטירה, וסעיף 89 בתקרת 10 השנים.',
		'intro'     => 'פקודת הנזיקין היא הבסיס לכל תביעת רשלנות רפואית. אלה הסעיפים שמופיעים בכל כתב תביעה, עם ההסבר מה כל אחד מהם עושה.',
		'facts'     => array(
			array( 'סעיף 35: רשלנות היא מעשה שאדם סביר ונבון לא היה עושה, או מחדל ממעשה שהיה עושה, לרבות שימוש לא מיומן במשלח יד', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'סעיף 36: החובה מוטלת כלפי כל אדם כשאדם סביר צריך היה לצפות מראש פגיעה', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'סעיף 41 (הדבר מעיד על עצמו): בהתקיים שלושת התנאים עובר נטל ההוכחה לנתבע להראות שלא התרשל', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'סעיף 19: העילה עוברת לעיזבון; סעיפים 78 עד 80: תביעת תלויים', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'סעיף 89(2): מגבלת 10 שנים מיום אירוע הנזק', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'סעיפים 13 ו-14: אחריות מעביד ושולח, הבסיס לתביעת מוסדות רפואיים', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'פקודת הנזיקין, כל זכות', 'https://www.kolzchut.org.il/he/פקודת_הנזיקין' ),
			array( 'הגדרת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית' ),
		),
		'related'   => array( 'res-ipsa-loquitur-israel', 'checking-negligence-claim-grounds', 'dependents-estate-claims-death', 'tort-lawsuit-negligence-damages-israel' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'hityashnut-law-1958',
		'title'     => 'חוק ההתיישנות התשיח 1958 בתביעות רפואיות',
		'seo_title' => 'חוק ההתיישנות בתביעות נגד רופאים: הסעיפים | Jus-Tice',
		'seo_desc'  => 'סעיף 5 שבע שנים, סעיף 6 מיום העילה, סעיף 8 גילוי מאוחר, סעיף 10 קטינות, סעיף 11 ליקוי נפשי, ולצדם מגבלת 10 השנים בסעיף 89 לפקודת הנזיקין.',
		'intro'     => 'חוק ההתיישנות קובע את שעון החול של התביעה. בתביעות רפואיות שלושה סעיפים שלו עוצרים או דוחים את המניין, ופקודת הנזיקין מוסיפה תקרה משלה.',
		'facts'     => array(
			array( 'סעיף 5: התיישנות בשאינו מקרקעין 7 שנים; סעיף 6: המניין מיום שנולדה העילה', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
			array( 'סעיף 8: גילוי מאוחר; נעלמו העובדות מסיבות שאינן תלויות בתובע, המניין מיום הגילוי', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
			array( 'סעיף 10: קטינות; הזמן עד גיל 18 אינו נמנה', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
			array( 'סעיף 11: תקופה שבה התובע לא היה מסוגל לדאוג לענייניו בשל ליקוי נפשי או שכלי אינה נמנית', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
			array( 'בנזיקין חלה במקביל מגבלת סעיף 89(2) לפקודת הנזיקין: 10 שנים מאירוע הנזק', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
		),
		'official'  => array(
			array( 'חוק ההתיישנות, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_ההתיישנות' ),
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'הגשת תביעת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגשת_תביעת_רשלנות_רפואית' ),
		),
		'related'   => array( 'deadline-suing-medical-negligence', 'holada-beavla-lawsuit', 'nezikin-ordinance-negligence' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'physicians-ordinance-1976',
		'title'     => 'פקודת הרופאים נוסח חדש התשלז 1976',
		'seo_title' => 'פקודת הרופאים: רישוי, משמעת וערעור | Jus-Tice',
		'seo_desc'  => 'סעיף 2 ייחוד העיסוק, סעיף 41 עילות המשמעת ואמצעיה, סעיף 44 שימוע ב-30 יום מראש, סעיף 47 ערעור למחוזי בתוך שלושה חודשים, וסדרי הדין משנת 1976.',
		'intro'     => 'פקודת הרופאים מסדירה מי רשאי לעסוק ברפואה ומה קורה לרופא שחרג מהכללים. היא לא מקנה פיצוי לנפגע, אבל היא הבסיס להליך המשמעתי.',
		'facts'     => array(
			array( 'סעיף 2: ייחוד העיסוק; רק בעל רישיון רשאי לעסוק ברפואה', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'סעיף 41: עילות משמעת, ובהן התנהגות שאינה הולמת, השגת רישיון במצג כוזב, רשלנות חמורה או אי-יכולת, הרשעה בעבירה והפרת חוק זכויות החולה', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'אמצעי משמעת בצו שר הבריאות: ביטול רישיון, התלייה, נזיפה, התראה (סעיף 41)', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'סעיף 44: שימוע בפני ועדה הכוללת משפטן לפני מתן צו, בהודעה 30 יום מראש', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'סעיף 47: ערעור לבית המשפט המחוזי בתוך שלושה חודשים', 'https://he.wikisource.org/wiki/פקודת_הרופאים', 'פקודת הרופאים' ),
			array( 'סדרי הדיון: תקנות הרופאים (סדרי דין בדיון משמעתי), התשל"ו-1976', 'https://www.gov.il/he/pages/rofim12', 'gov.il' ),
		),
		'official'  => array(
			array( 'פקודת הרופאים, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הרופאים' ),
			array( 'תקנות הרופאים (סדרי דין בדיון משמעתי)', 'https://www.gov.il/he/pages/rofim12' ),
			array( 'מאגר החלטות ועדות המשמעת', 'https://www.gov.il/he/departments/dynamiccollectors/disciplinary-action' ),
		),
		'related'   => array( 'disciplinary-complaint-against-doctor', 'tribunal-medical-discipline', 'licensing-doctors-verification' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'mamlachti-health-insurance-law',
		'title'     => 'חוק ביטוח בריאות ממלכתי התשנד 1994',
		'seo_title' => 'חוק ביטוח בריאות ממלכתי: סל, קופות וקבילות | Jus-Tice',
		'seo_desc'  => 'סעיף 3 זכאות כל תושב, סעיפים 7 ו-8 סל השירותים, סעיף 4(ג) חובת קבלה, פרק ט נציב הקבילות, וסעיף 54(ב) שמוציא תביעות נזיקין מבית הדין לעבודה.',
		'intro'     => 'חוק ביטוח בריאות ממלכתי הוא המסגרת של הרפואה הציבורית. לנפגע רשלנות חשובים בו בעיקר מעמד הקופות והסעיף שקובע לאיזו ערכאה הולכים.',
		'facts'     => array(
			array( 'סעיף 3: כל תושב זכאי לשירותי בריאות; המדינה אחראית למימון הסל', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'סעיף 7: סל שירותי הבריאות מוגדר בתוספת השנייה והשלישית; סעיף 8: שינוי הסל בצו', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'סעיף 4(ג): קופה חייבת לקבל כל תושב שבחר בה', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'פרק ט (סעיפים 43 ואילך): נציב קבילות לחוק', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
			array( 'סעיף 54(ב): סמכות ייחודית לבית הדין לעבודה בסכסוכי מבוטח וקופה, למעט תביעות נזיקין', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
		),
		'official'  => array(
			array( 'חוק ביטוח בריאות ממלכתי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי' ),
			array( 'הגשת קבילה לפי חוק ביטוח בריאות ממלכתי', 'https://www.gov.il/he/service/national-health-insurance-law-complaint-submission' ),
			array( 'נציבות הקבילות לחוק, כל זכות', 'https://www.kolzchut.org.il/he/נציבות_קבילות_הציבור_לחוק_ביטוח_בריאות_ממלכתי' ),
		),
		'related'   => array( 'health-funds-legal-status', 'kvilot-health-insurance-law', 'hmo-negligence-claim' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'immunity-public-employees-lawsuit',
		'title'     => 'חסינות עובדי ציבור בתביעות רשלנות רפואית: סעיף 7א',
		'seo_title' => 'אפשר לתבוע אישית רופא בבית חולים ממשלתי? | Jus-Tice',
		'seo_desc'  => 'סעיף 7א לפקודת הנזיקין נותן לעובד ציבור חסינות אישית, המדינה נכנסת בנעליו בהודעת הכרה בחסינות, והיא עצמה חבה בנזיקין כמו כל גוף מואגד.',
		'intro'     => 'רופא בבית חולים ממשלתי הוא עובד ציבור, ולכן התביעה נגדו אישית נדחית והמדינה באה במקומו. כך המנגנון עובד ומה החריג היחיד.',
		'facts'     => array(
			array( 'סעיף 7א לפקודת הנזיקין: לעובד ציבור חסינות מפני תביעה על מעשה שנעשה תוך כדי תפקידו השלטוני, למעט מעשה ביודעין מתוך כוונה לגרום נזק', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'המנגנון: המדינה מוסרת הודעת הכרה בחסינות, התביעה נגד העובד נדחית והמדינה באה בנעליו; לתובע זכות לחלוק על קיום החסינות', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'המדינה עצמה חבה בנזיקין כמו כל גוף מואגד (סעיף 2 לחוק הנזיקים האזרחיים (אחריות המדינה))', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)', 'חוק אחריות המדינה' ),
			array( 'הרשאה חוקית אינה פוטרת מרשלנות (סעיף 3 לאותו חוק)', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)', 'חוק אחריות המדינה' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'חוק הנזיקים האזרחיים (אחריות המדינה)', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)' ),
			array( 'חטיבת המרכזים הרפואיים הממשלתיים', 'https://www.gov.il/he/departments/units/governmental_health_centers/govil-landing-page' ),
		),
		'related'   => array( 'governmental-hospitals-state-liability', 'liability-state-law-1952', 'vicarious-hospital-responsibility' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'preservation-medical-records-regulations',
		'title'     => 'תקנות בריאות העם (שמירת רשומות): תקופות השמירה',
		'seo_title' => 'כמה שנים בית חולים חייב לשמור תיק רפואי | Jus-Tice',
		'seo_desc'  => 'תיק אשפוז 20 שנה, סיכום מחלה וספר לידות 100 שנה, תיק מרפאת חוץ ומיון 7 שנים, ספר ניתוחים 10 שנים, ומה קורה לרשומות כשבית חולים נסגר.',
		'intro'     => 'התקנות קובעות כמה זמן כל מסמך רפואי חייב להישמר. כשמוסד רפואי לא עומד בהן, התוצאה בתביעה עשויה להיות העברת נטל ההוכחה אליו.',
		'facts'     => array(
			array( 'תיק רפואי של חולה בבית חולים כללי: 20 שנה לאחר האשפוז או הטיפול האחרון (ואם אין גיליון סיכום מחלה, 25 שנה או 7 שנים לאחר הפטירה, המוקדם)', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)', 'תקנות שמירת רשומות' ),
			array( 'גיליון סיכום מחלה ומכתב סיכום לרופא המטפל: 100 שנה; ספר לידות וספר פטירות: 100 שנה', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)', 'תקנות שמירת רשומות' ),
			array( 'תיק מרפאת חוץ ומסמכי חדר מיון: 7 שנים; ספר ניתוחים וספר מרדימים: 10 שנים', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)', 'תקנות שמירת רשומות' ),
			array( 'לא תוצא רשומה מבית חולים ללא הרשאת הממונה, ובהעברה נשמר העתק (תקנה 3)', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)', 'תקנות שמירת רשומות' ),
			array( 'נסגר בית חולים, הרשומות מועברות לבית חולים שהוא מוסד ממוסדות המדינה (תקנה 3(ד))', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)', 'תקנות שמירת רשומות' ),
			array( 'התקנות מתפרסמות גם בעמוד ייעודי באתר משרד הבריאות', 'https://www.gov.il/he/pages/briut10', 'gov.il' ),
		),
		'official'  => array(
			array( 'תקנות בריאות העם (שמירת רשומות), הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)' ),
			array( 'עמוד התקנות באתר משרד הבריאות', 'https://www.gov.il/he/pages/briut10' ),
			array( 'תחום רישום ומידע רפואי', 'https://www.gov.il/he/departments/units/medical_registration_unit/govil-landing-page' ),
		),
		'related'   => array( 'obtaining-medical-records-copy', 'evidentiary-damage-records', 'patient-rights-law-1996' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'liability-state-law-1952',
		'title'     => 'חוק הנזיקים האזרחיים (אחריות המדינה) התשיב 1952',
		'seo_title' => 'אחריות המדינה בנזיקין על טיפול רפואי | Jus-Tice',
		'seo_desc'  => 'סעיף 2 משווה את דין המדינה לכל גוף מואגד, סעיף 3 פוטר מעשה בהרשאה חוקית אך לא רשלנות, והחוק הוא הבסיס לתביעות נגד בתי חולים ממשלתיים.',
		'intro'     => 'החוק משנת 1952 הוא שמאפשר לתבוע את מדינת ישראל על רשלנות בבית חולים ממשלתי. הוא קצר, ושני סעיפים בו עושים את כל העבודה.',
		'facts'     => array(
			array( 'סעיף 2: דין המדינה לעניין אחריות בנזיקים כדין כל גוף מואגד', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)', 'חוק אחריות המדינה' ),
			array( 'סעיף 3: אין המדינה אחראית על מעשה בתחום הרשאה חוקית שנעשה בתום לב, אך היא אחראית על רשלנות שבמעשה', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)', 'חוק אחריות המדינה' ),
			array( 'החוק הוא הבסיס לתביעות נגד בתי חולים ממשלתיים, שבהן הנתבעת היא מדינת ישראל', 'https://www.gov.il/he/departments/units/governmental_health_centers/govil-landing-page', 'gov.il' ),
			array( 'החריגים המרכזיים, כגון פעולה מלחמתית בסעיף 5, אינם רלוונטיים לטיפול רפואי אזרחי', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)', 'חוק אחריות המדינה' ),
		),
		'official'  => array(
			array( 'חוק הנזיקים האזרחיים (אחריות המדינה), הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)' ),
			array( 'חטיבת המרכזים הרפואיים הממשלתיים', 'https://www.gov.il/he/departments/units/governmental_health_centers/govil-landing-page' ),
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
		),
		'related'   => array( 'governmental-hospitals-state-liability', 'immunity-public-employees-lawsuit', 'nezikin-ordinance-negligence' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'informed-consent-treatment',
		'title'     => 'הסכמה מדעת לטיפול רפואי',
		'seo_title' => 'הסכמה מדעת: מה חייבים להסביר ומתי היעדרה רשלנות | Jus-Tice',
		'seo_desc'  => 'המידע שחובה למסור לפי סעיף 13(ב): אבחנה, מהות הטיפול, סיכונים וחלופות. צורות ההסכמה, הטיפולים שדורשים חתימה, החריגים בסעיף 15 והמשמעות בתביעה.',
		'intro'     => 'טיפול ללא הסכמה מדעת הוא עילה עצמאית, גם כשהטיפול עצמו בוצע כראוי. החוק מפרט מה חייבים להסביר ואיך ההסכמה ניתנת.',
		'facts'     => array(
			array( 'המידע שחובה למסור (סעיף 13(ב) לחוק זכויות החולה): האבחנה והפרוגנוזה, מהות הטיפול ומטרתו, הסיכויים והסיכונים כולל תופעות לוואי וכאב, טיפולים חלופיים, והיות הטיפול חדשני', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'צורות ההסכמה: בכתב, בעל פה או בהתנהגות (סעיף 14); בכתב לניתוחים למעט כירורגיה זעירה, צנתור, דיאליזה, כימותרפיה, הקרנות והפריה חוץ-גופית', 'https://www.kolzchut.org.il/he/הסכמה_מדעת_לטיפול_רפואי', 'כל זכות' ),
			array( 'חריגים (סעיף 15): מצב חירום רפואי; סכנה חמורה, באישור ועדת אתיקה, גם נגד רצון המטופל', 'https://www.kolzchut.org.il/he/הסכמה_מדעת_לטיפול_רפואי', 'כל זכות' ),
			array( 'טיפול ללא הסכמה מדעת עשוי להקים עילת רשלנות ותקיפה', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק זכויות החולה, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה' ),
			array( 'הסכמה מדעת לטיפול רפואי, כל זכות', 'https://www.kolzchut.org.il/he/הסכמה_מדעת_לטיפול_רפואי' ),
			array( 'משרד הבריאות', 'https://www.gov.il/he/departments/ministry_of_health/govil-landing-page' ),
		),
		'related'   => array( 'patient-rights-law-1996', 'checking-negligence-claim-grounds', 'misdiagnosis-delayed-diagnosis' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'evidentiary-damage-records',
		'title'     => 'נזק ראייתי ורשומה רפואית חסרה',
		'seo_title' => 'רישום רפואי חסר: מתי נטל ההוכחה עובר למוסד | Jus-Tice',
		'seo_desc'  => 'חובת התיעוד בסעיף 17 לחוק זכויות החולה, הפסיקה שמעבירה את נטל השכנוע כשרישומים לא נשמרו, ותקופות השמירה שמגדירות מה נחשב חסר.',
		'intro'     => 'כשהתיק הרפואי חסר, המטופל לא יכול להוכיח מה קרה, ולכן הפסיקה מעבירה את הנטל אל מי שהיה חייב לתעד. זה אחד הכלים החזקים בתביעת רשלנות.',
		'facts'     => array(
			array( 'חובת התיעוד: מטפל מתעד את מהלך הטיפול ברשומה רפואית (סעיף 17 לחוק זכויות החולה)', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'בפסיקה: אי-שמירת רישומים רפואיים עשויה להעביר את נטל השכנוע אל המוסד הרפואי', 'https://www.kolzchut.org.il/he/העברת_נטל_השכנוע_בשל_אי_שמירת_רישומים_רפואיים', 'כל זכות' ),
			array( 'חובות השמירה הקונקרטיות (20 שנה לתיק אשפוז, 100 שנה לסיכום מחלה) קבועות בתקנות בריאות העם (שמירת רשומות)', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)', 'תקנות שמירת רשומות' ),
			array( 'רשומה רפואית מוגדרת בסעיף 2 לחוק זכויות החולה', 'https://www.kolzchut.org.il/he/רשומה_רפואית', 'כל זכות' ),
		),
		'official'  => array(
			array( 'העברת נטל השכנוע בשל אי-שמירת רישומים, כל זכות', 'https://www.kolzchut.org.il/he/העברת_נטל_השכנוע_בשל_אי_שמירת_רישומים_רפואיים' ),
			array( 'חוק זכויות החולה, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה' ),
			array( 'תקנות בריאות העם (שמירת רשומות)', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)' ),
		),
		'related'   => array( 'preservation-medical-records-regulations', 'obtaining-medical-records-copy', 'res-ipsa-loquitur-israel' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'opinion-expert-witness-medicine',
		'title'     => 'חוות דעת מומחה רפואי',
		'seo_title' => 'חוות דעת מומחה רפואי: קבילות, חזקה ומי כשיר | Jus-Tice',
		'seo_desc'  => 'סעיף 20 לפקודת הראיות מכשיר חוות דעת בכתב, סעיף 21 קובע חזקת חתימה, תקנה 87 דורשת מומחה בתחום מומחיותו, ובדיקת המומחיות במאגר הרישיונות.',
		'intro'     => 'חוות דעת מומחה היא הראיה המרכזית בתביעת רשלנות רפואית. פקודת הראיות ותקנות סדר הדין קובעות מתי היא קבילה, מה היא חייבת לכלול ומי רשאי לחתום עליה.',
		'facts'     => array(
			array( 'חוות דעת מומחה בכתב קבילה כראיה בשאלה שבמדע או בידיעה מקצועית (סעיף 20 לפקודת הראיות)', 'https://he.wikisource.org/wiki/פקודת_הראיות', 'פקודת הראיות' ),
			array( 'חזקת חתימה: חוות דעת ותעודת רופא שנעשו בישראל, חזקה שהחתימה נכונה (סעיף 21)', 'https://he.wikisource.org/wiki/פקודת_הראיות', 'פקודת הראיות' ),
			array( 'בעניין שברפואה חובה לצרף חוות דעת של מומחה בתחום מומחיותו (תקנה 87(א) לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'חוות דעת מטעם בית המשפט מוגשת עם רשימת האסמכתאות (תקנה 91(ב)) וניתן לשלוח שאלות הבהרה (תקנה 91(ג))', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'בדיקת מומחיות הרופא במאגר הרישיונות הרשמי של משרד הבריאות', 'https://practitioners.health.gov.il/', 'מאגר בעלי הרישיונות' ),
		),
		'official'  => array(
			array( 'פקודת הראיות, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הראיות' ),
			array( 'תקנות סדר הדין האזרחי, הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי' ),
			array( 'מאגר בעלי הרישיונות של משרד הבריאות', 'https://practitioners.health.gov.il/' ),
		),
		'related'   => array( 'attaching-expert-opinion-claim', 'appointed-court-expert', 'licensing-doctors-verification', 'medical-malpractice-witnesses-experts-testimony' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'loss-chances-recovery-doctrine',
		'title'     => 'אובדן סיכויי החלמה ברשלנות רפואית',
		'seo_title' => 'אובדן סיכויי החלמה: איך מפצים על איחור באבחון | Jus-Tice',
		'seo_desc'  => 'כשאיחור באבחון הקטין את סיכויי ההחלמה, הפיצוי נגזר משיעור הסיכוי שאבד. הבסיס בסעיף 76 לפקודת הנזיקין וההוכחה בחוות דעת מומחה לפי תקנה 87.',
		'intro'     => 'לא תמיד אפשר להוכיח שהרשלנות גרמה לנזק כולו. כשהיא רק הקטינה את סיכויי ההחלמה, בתי המשפט פוסקים פיצוי חלקי לפי הסיכוי שאבד.',
		'facts'     => array(
			array( 'הבסיס הנורמטיבי לפיצוי: סעיף 76 לפקודת הנזיקין, פיצוי בשל נזק שבא במישרין מעוולת הנתבע', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'אבחון מאוחר של מחלה הוא מהדוגמאות המרכזיות לרשלנות באבחון', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית', 'כל זכות' ),
			array( 'ההוכחה נעשית באמצעות חוות דעת מומחה על שיעורי ההחלמה בגילוי מוקדם מול מאוחר (תקנה 87 לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
			array( 'גילוי מאוחר של הנזק מפעיל את סעיף 8 לחוק ההתיישנות, שמתחיל את המניין מיום הגילוי', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'הגדרת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית' ),
			array( 'תקנות סדר הדין האזרחי, הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי' ),
		),
		'related'   => array( 'misdiagnosis-delayed-diagnosis', 'components-compensation-damage', 'pain-suffering-compensation-caselaw' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'holada-beavla-lawsuit',
		'title'     => 'הולדה בעוולה: תביעת הורים על כשל באבחון בהיריון',
		'seo_title' => 'הולדה בעוולה: מי תובע, עד מתי ועל מה | Jus-Tice',
		'seo_desc'  => 'תביעת הורים על רשלנות במעקב היריון ששללה מהם את הבחירה, הלכת המר ששללה את תביעת הילד, מועד ההגשה עד גיל 7, ומרכיבי הפיצוי לכל חיי הילד.',
		'intro'     => 'כשמום לא אובחן בהיריון בגלל רשלנות, ההורים תובעים על השלילה של זכות הבחירה. הפסיקה קבעה מי רשאי לתבוע, עד מתי, ומה נכלל בפיצוי.',
		'facts'     => array(
			array( 'העילה: רשלנות במעקב היריון (אי-גילוי מום, אי-הפניה לבדיקות, פענוח רשלני) ששללה מההורים את הבחירה להפסיק היריון כדין', 'https://www.kolzchut.org.il/he/תביעה_בעקבות_לידת_אדם_עם_נכות_בשל_כשל_באבחון_או_רשלנות_רפואית', 'כל זכות' ),
			array( 'התובעים הם ההורים; תביעת הילד עצמו (חיים בעוולה) נשללה בפסיקת בית המשפט העליון בעניין המר, עם הוראת מעבר שפקעה ב-28.8.2015', 'https://www.kolzchut.org.il/he/תביעה_בעקבות_לידת_אדם_עם_נכות_בשל_כשל_באבחון_או_רשלנות_רפואית', 'כל זכות' ),
			array( 'מועד ההגשה להורים: עד הגיע הילד לגיל 7', 'https://www.kolzchut.org.il/he/תביעה_בעקבות_לידת_אדם_עם_נכות_בשל_כשל_באבחון_או_רשלנות_רפואית', 'כל זכות' ),
			array( 'הפיצוי: הוצאות גידול הילד וכל צרכיו, כולל בבגרות ולכל חייו: הוצאות רפואיות, עזרת צד שלישי, שיקום, חינוך, דיור, ניידות ואובדן השתכרות', 'https://www.kolzchut.org.il/he/תביעה_בעקבות_לידת_אדם_עם_נכות_בשל_כשל_באבחון_או_רשלנות_רפואית', 'כל זכות' ),
			array( 'נדרשת חוות דעת מומחה (תקנה 87 לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
		),
		'official'  => array(
			array( 'תביעה בעקבות לידת אדם עם נכות, כל זכות', 'https://www.kolzchut.org.il/he/תביעה_בעקבות_לידת_אדם_עם_נכות_בשל_כשל_באבחון_או_רשלנות_רפואית' ),
			array( 'תקנות סדר הדין האזרחי, הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי' ),
			array( 'נכות, המוסד לביטוח לאומי (גמלת ילד נכה)', 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx' ),
		),
		'related'   => array( 'obstetric-injury-negligence', 'deadline-suing-medical-negligence', 'components-compensation-damage', 'medical-malpractice-pregnancy-birth' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'obstetric-injury-negligence',
		'title'     => 'פגיעות לידה ורשלנות במעקב היריון ולידה',
		'seo_title' => 'פגיעה בלידה: מתי היא עילת תביעה | Jus-Tice',
		'seo_desc'  => 'פגיעת לידה כשלעצמה אינה רשלנות; נדרשת סטייה מהסטנדרט וקשר סיבתי. קטין תובע עד גיל 25, ספר הלידות נשמר 100 שנה, ובמקביל בודקים גמלת ילד נכה.',
		'intro'     => 'לידה היא האירוע הרפואי שמניב את התביעות הגדולות ביותר, ודווקא בו ההבחנה בין סיבוך לרשלנות היא הקשה ביותר. אלה היסודות המשפטיים, בלי הרפואה.',
		'facts'     => array(
			array( 'פגיעת לידה כשלעצמה אינה מוכיחה רשלנות; נדרש להוכיח סטייה מסטנדרט הטיפול הסביר וקשר סיבתי (סעיפים 35 ו-36 לפקודת הנזיקין)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'לקטין שנפגע בלידה מרוץ ההתיישנות מתחיל בגיל 18, כלומר תביעה עד גיל 25 (סעיף 10 לחוק ההתיישנות)', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
			array( 'ספר הלידות בבית החולים נשמר 100 שנה, והתיעוד המיילדותי הוא בסיס התביעה', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)', 'תקנות שמירת רשומות' ),
			array( 'כשל באבחון מומים לפני הלידה נדון כתביעת הולדה בעוולה של ההורים', 'https://www.kolzchut.org.il/he/תביעה_בעקבות_לידת_אדם_עם_נכות_בשל_כשל_באבחון_או_רשלנות_רפואית', 'כל זכות' ),
			array( 'במקביל ניתן לבחון זכאות לגמלת ילד נכה במוסד לביטוח לאומי', 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx', 'ביטוח לאומי' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'תקנות בריאות העם (שמירת רשומות)', 'https://he.wikisource.org/wiki/תקנות_בריאות_העם_(שמירת_רשומות)' ),
			array( 'תביעה בעקבות לידת אדם עם נכות, כל זכות', 'https://www.kolzchut.org.il/he/תביעה_בעקבות_לידת_אדם_עם_נכות_בשל_כשל_באבחון_או_רשלנות_רפואית' ),
		),
		'related'   => array( 'holada-beavla-lawsuit', 'deadline-suing-medical-negligence', 'evidentiary-damage-records', 'birth-injury', 'cerebral-palsy' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'known-complication-versus-negligence',
		'title'     => 'סיבוך מוכר מול התרשלות רפואית',
		'seo_title' => 'סיבוך אחרי ניתוח: רשלנות או סיכון מוכר | Jus-Tice',
		'seo_desc'  => 'המבחן הוא סבירות ההתנהגות ולא התוצאה (סעיף 35), רק טעות בלתי סבירה היא רשלנות, וגם סיבוך מוכר מקים עילה אם לא הוסבר מראש לפי סעיף 13(ב).',
		'intro'     => 'לכל ניתוח יש סיכונים ידועים, ולא כל תוצאה רעה היא רשלנות. ההבחנה נעשית בשני מבחנים: האם המטפל נהג כמטפל סביר, והאם הסיכון הוסבר מראש.',
		'facts'     => array(
			array( 'המבחן המשפטי: לא התוצאה הרעה אלא סבירות ההתנהגות; רשלנות רק כשמטפל סביר היה נוהג אחרת (סעיף 35 לפקודת הנזיקין)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'לא כל טעות באבחון היא רשלנות; רק טעות בלתי סבירה', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית', 'כל זכות' ),
			array( 'גם סיבוך מוכר עשוי להקים עילה אם לא נמסר למטופל מראש כנדרש בהסכמה מדעת: סיכונים, תופעות לוואי וחלופות (סעיף 13(ב) לחוק זכויות החולה)', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה', 'חוק זכויות החולה' ),
			array( 'ההבחנה מוכרעת בחוות דעת מומחה (תקנה 87 לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
		),
		'official'  => array(
			array( 'הגדרת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית' ),
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'חוק זכויות החולה, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_זכויות_החולה' ),
		),
		'related'   => array( 'checking-negligence-claim-grounds', 'informed-consent-treatment', 'res-ipsa-loquitur-israel', 'medical-malpractice-surgery' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'misdiagnosis-delayed-diagnosis',
		'title'     => 'רשלנות באבחון ואיחור באבחנה',
		'seo_title' => 'אבחנה שגויה או מאוחרת: מתי תובעים | Jus-Tice',
		'seo_desc'  => 'דוגמאות לרשלנות באבחון: אי-ביצוע בדיקות מקובלות, פענוח שגוי, אי-הפניה לבירור. המבחן הוא הרופא הסביר, הנזק מנוסח כאובדן סיכויי החלמה וההתיישנות מיום הגילוי.',
		'intro'     => 'איחור באבחון הוא הסוג הנפוץ ביותר של תביעות רשלנות רפואית. השאלה אינה אם הרופא טעה, אלא אם רופא סביר באותן נסיבות היה מגלה בזמן.',
		'facts'     => array(
			array( 'דוגמאות מוכרות לרשלנות באבחון: אי-ביצוע בדיקות מקובלות (צילום, בדיקות דם, ביופסיה), פענוח שגוי, אי-הפניה להמשך בירור', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית', 'כל זכות' ),
			array( 'טעות אבחנתית היא רשלנות רק כשהיא בלתי סבירה במבחן הרופא הסביר (סעיף 35 לפקודת הנזיקין)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'באיחור באבחון הנזק מנוסח לרוב כאובדן סיכויי החלמה', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית', 'כל זכות' ),
			array( 'גילוי מאוחר של הנזק מפעיל את סעיף 8 לחוק ההתיישנות, שמתחיל את המניין מיום הגילוי', 'https://he.wikisource.org/wiki/חוק_ההתיישנות', 'חוק ההתיישנות' ),
		),
		'official'  => array(
			array( 'הגדרת רשלנות רפואית, כל זכות', 'https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית' ),
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'חוק ההתיישנות, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_ההתיישנות' ),
		),
		'related'   => array( 'loss-chances-recovery-doctrine', 'deadline-suing-medical-negligence', 'checking-negligence-claim-grounds', 'medical-malpractice-common-errors-doctors-hospitals' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'vicarious-hospital-responsibility',
		'title'     => 'אחריות שילוחית של בית חולים וקופת חולים',
		'seo_title' => 'מתי המוסד הרפואי אחראי לרשלנות הרופא | Jus-Tice',
		'seo_desc'  => 'מעביד חב על מעשה עובד לפי סעיף 13, שולח על שלוח לפי סעיף 14, קבלן עצמאי רק בחריגי סעיף 15, בבתי חולים ממשלתיים החבות על המדינה ובקופות על הקופה.',
		'intro'     => 'התובע כמעט אף פעם לא תובע רק את הרופא: המוסד שהעסיק אותו אחראי לצדו. פקודת הנזיקין קובעת מתי, ושני חוקים נוספים משלימים את התמונה.',
		'facts'     => array(
			array( 'מעביד חב על מעשה עובד שנעשה תוך כדי עבודתו או שהרשה או אשרר אותו (סעיף 13 לפקודת הנזיקין)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'המעסיק שלוח שאינו עובד חב על מעשי השלוח בביצוע השליחות (סעיף 14)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'מעסיק קבלן עצמאי ככלל אינו חב, למעט חריגים: התרשל בבחירתו, התערב בעבודתו, הרשה או אשרר (סעיף 15)', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'בבתי חולים ממשלתיים החבות מוטלת על המדינה (סעיף 2 לחוק הנזיקים האזרחיים (אחריות המדינה) וסעיף 7א לפקודה)', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)', 'חוק אחריות המדינה' ),
			array( 'בקופות חולים הקופה נתבעת כמעבידת המטפלים ברשת מרפאותיה (סעיפים 24 ו-25 לחוק ביטוח בריאות ממלכתי, מעמד הקופה)', 'https://he.wikisource.org/wiki/חוק_ביטוח_בריאות_ממלכתי', 'חוק ביטוח בריאות ממלכתי' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'חוק הנזיקים האזרחיים (אחריות המדינה)', 'https://he.wikisource.org/wiki/חוק_הנזיקים_האזרחיים_(אחריות_המדינה)' ),
			array( 'חטיבת המרכזים הרפואיים הממשלתיים', 'https://www.gov.il/he/departments/units/governmental_health_centers/govil-landing-page' ),
		),
		'related'   => array( 'health-funds-legal-status', 'governmental-hospitals-state-liability', 'hmo-negligence-claim' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

	array(
		'slug'      => 'res-ipsa-loquitur-israel',
		'title'     => 'הדבר מדבר בעד עצמו: סעיף 41 לפקודת הנזיקין',
		'seo_title' => 'סעיף 41: מתי נטל ההוכחה עובר לרופא | Jus-Tice',
		'seo_desc'  => 'שלושת תנאי סעיף 41: היעדר ידיעה של התובע, שליטה מלאה של הנתבע, ואירוע שמתיישב יותר עם התרשלות. התוצאה: על הנתבע להוכיח שלא התרשל.',
		'intro'     => 'כשמטופל נכנס לניתוח בריא ויוצא פגוע ואיש לא יודע למה, החוק מאפשר להעביר את נטל ההוכחה אל מי ששלט במצב. אלה התנאים המדויקים.',
		'facts'     => array(
			array( 'שלושת תנאי סעיף 41: לתובע לא הייתה ידיעה על הנסיבות; הנזק נגרם על ידי נכס שלנתבע שליטה מלאה עליו; אירוע הנזק מתיישב יותר עם התרשלות מאשר עם זהירות', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'התוצאה: על הנתבע הראיה שלא הייתה התרשלות שיחוב עליה', 'https://he.wikisource.org/wiki/פקודת_הנזיקין', 'פקודת הנזיקין' ),
			array( 'דוקטרינה משלימה בפסיקה: העברת נטל השכנוע כשרישומים רפואיים לא נשמרו', 'https://www.kolzchut.org.il/he/העברת_נטל_השכנוע_בשל_אי_שמירת_רישומים_רפואיים', 'כל זכות' ),
			array( 'טענת סעיף 41 אינה פוטרת מצירוף חוות דעת מומחה לעניין שברפואה (תקנה 87 לתקנות סדר הדין האזרחי)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי', 'תקנות סדר הדין האזרחי' ),
		),
		'official'  => array(
			array( 'פקודת הנזיקין, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הנזיקין' ),
			array( 'העברת נטל השכנוע בשל אי-שמירת רישומים, כל זכות', 'https://www.kolzchut.org.il/he/העברת_נטל_השכנוע_בשל_אי_שמירת_רישומים_רפואיים' ),
			array( 'תקנות סדר הדין האזרחי, הנוסח המלא', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_האזרחי' ),
		),
		'related'   => array( 'nezikin-ordinance-negligence', 'evidentiary-damage-records', 'known-complication-versus-negligence' ),
		'pillar'    => 'medical-malpractice-lawyer',
	),

);
