<?php
/**
 * Entity wave 2: criminal law. 47 pages, researched 2026-09-07 from official
 * sources only (consolidated law texts at current amounts, gov.il and
 * police.gov.il pages, kolzchut, 2026 public-defender and witness tariffs).
 * Every number carries its source; the four unverifiable items from the
 * research run are excluded, not guessed. Slugs validated against all
 * 1,562 live site slugs and 665 existing head words: zero collisions.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(

	array(
		'slug'      => 'summons-interrogation-warning-rights',
		'title'     => 'זימון לחקירה באזהרה במשטרה: זכויות הנחקר',
		'seo_title' => 'חקירה באזהרה: הזכויות המלאות של הנחקר | Jus-Tice',
		'seo_desc'  => 'זומנתם לחקירה באזהרה? אלה הזכויות לפי החוק: היוועצות בעורך דין, זכות השתיקה, חקירה בשפה שאתם מבינים ותיעוד נאמן.',
		'intro'     => 'זימון לחקירה באזהרה אומר שאתם חשודים. לפני שנכנסים לחדר החקירות, כדאי לדעת בדיוק מה החוק מחייב את המשטרה ומה מותר לכם.',
		'facts'     => array(
			array( 'עצור זכאי להיפגש עם עורך דין ללא דיחוי; הקצין הממונה רשאי לדחות את הפגישה שעות ספורות, עד 24 שעות בחשש לשיבוש חקירה, ועד 48 שעות בעבירות ביטחון (סעיף 34 לחוק המעצרים)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'חובה להודיע לחשוד על זכות השתיקה ולהסביר שאינו חייב להשיב', 'https://www.kolzchut.org.il/he/זכות_השתיקה_במהלך_חקירה', 'כל זכות' ),
			array( 'חקירת חשוד מתנהלת בשפתו או בשפה שהוא מבין, כולל שפת סימנים (סעיף 2 לחוק חקירת חשודים)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(חקירת_חשודים)', 'נוסח החוק' ),
			array( 'התיעוד בכתב חייב לשקף נכונה את המתרחש בחקירה מראשיתה ועד סופה (סעיף 4(ב))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(חקירת_חשודים)', 'נוסח החוק' ),
			array( 'עד, בלי אזהרה, חייב להשיב, למעט שאלות מפלילות (סעיף 47 לפקודת הראיות)', 'https://www.kolzchut.org.il/he/זכות_השתיקה_במהלך_חקירה', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק המעצרים, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)' ),
			array( 'חוק חקירת חשודים', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(חקירת_חשודים)' ),
		),
		'related'   => array( 'consultation-before-police-questioning', 'silence-right-interrogation', 'recording-interrogation-documentation' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'consultation-before-police-questioning',
		'title'     => 'זכות היוועצות בעורך דין לפני חקירה',
		'seo_title' => 'ייעוץ עורך דין לפני חקירה: הזכות והמועדים | Jus-Tice',
		'seo_desc'  => 'זכות ההיוועצות בעורך דין לפני חקירה: פגישה ללא דיחוי לפי סעיף 34, מדרג הדחיות המותר, וסניגור ציבורי כבר בשלב המעצר.',
		'intro'     => 'הזכות להתייעץ עם עורך דין לפני חקירה מעוגנת בסעיף 34 לחוק המעצרים: פגישה ללא דיחוי. אלה הכללים, הדחיות המותרות בחוק, ומי מקבל סניגור ציבורי.',
		'facts'     => array(
			array( 'הפגישה עם עורך הדין ניתנת ללא דיחוי; דחייה מותרת שעות ספורות, עד 24 שעות בחשש לשיבוש, ועד 48 שעות בעבירות ביטחון', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'עצור לצורכי חקירה חסר אמצעים זכאי לסניגור ציבורי כבר בשלב המעצר', 'https://www.kolzchut.org.il/he/ייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי', 'כל זכות' ),
			array( 'לקטין חשוד זכות היוועצות נפרדת עם עורך דין וגם עם הורה', 'https://www.kolzchut.org.il/he/התייעצות_של_קטין_חשוד_עם_עורך_דין', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק המעצרים, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)' ),
			array( 'ייצוג על ידי סניגור ציבורי', 'https://www.kolzchut.org.il/he/ייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי' ),
		),
		'related'   => array( 'summons-interrogation-warning-rights', 'eligibility-public-defender-income', 'days-detention-extension' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'days-detention-extension',
		'title'     => 'מעצר ימים: הארכת מעצר לצורך חקירה',
		'seo_title' => 'מעצר ימים: 24 שעות, 15 יום, ומי מאשר יותר | Jus-Tice',
		'seo_desc'  => 'כללי מעצר הימים: הבאה בפני שופט תוך 24 שעות, הארכות של עד 15 יום, מעל 30 יום רק באישור היועמש ומעל 75 יום רק בעליון.',
		'intro'     => 'מעצר ימים הוא מעצר לצורך חקירה, לפני כתב אישום, וחוק המעצרים קובע לו שעון מדויק: מי מאריך, בכמה, ומאיזה שלב נדרש אישור מיוחד.',
		'facts'     => array(
			array( 'הבאה בפני שופט לא יאוחר מ-24 שעות מהמעצר; עד 48 שעות לפעולות חקירה דחופות בעבירות ביטחון (סעיפים 29 עד 30)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'כל הארכה שיפוטית: עד 15 ימים (סעיף 17(א))', 'https://www.kolzchut.org.il/he/מעצר_ימים_(מעצר_לצורך_חקירה)', 'כל זכות' ),
			array( 'מעל 30 ימים ברצף באותו אירוע: רק באישור היועץ המשפטי לממשלה (סעיף 17(ב))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'מעל 75 ימים מצטברים: הארכה רק על ידי שופט בית המשפט העליון (סעיף 17(ג))', 'https://www.kolzchut.org.il/he/מעצר_ימים_(מעצר_לצורך_חקירה)', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק המעצרים, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)' ),
			array( 'מעצר ימים, כל זכות', 'https://www.kolzchut.org.il/he/מעצר_ימים_(מעצר_לצורך_חקירה)' ),
		),
		'related'   => array( 'remand-until-proceedings-end', 'bail-release-conditions', 'erer-remand-decisions' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'remand-until-proceedings-end',
		'title'     => 'מעצר עד תום ההליכים: תקרות ועילות',
		'seo_title' => 'מעצר עד תום ההליכים: 30 יום, 9 חודשים וחלופות | Jus-Tice',
		'seo_desc'  => 'מעצר עד תום ההליכים לפי סעיף 21: שחרור אם המשפט לא החל תוך 30 יום, תקרת 9 חודשים, הארכות העליון, וחלופות המעצר.',
		'intro'     => 'אחרי הגשת כתב אישום, התביעה יכולה לבקש מעצר עד תום ההליכים לפי סעיף 21 לחוק המעצרים. אבל למעצר הזה יש תקרות זמן ברורות ועילות שחרור.',
		'facts'     => array(
			array( 'אם המשפט לא החל תוך 30 יום מהגשת כתב האישום, קמה עילת שחרור', 'https://www.kolzchut.org.il/he/מעצר_עד_תום_ההליכים', 'כל זכות' ),
			array( '9 חודשים ללא הכרעת דין: שחרור, אלא אם שופט בית המשפט העליון האריך', 'https://www.kolzchut.org.il/he/מעצר_עד_תום_ההליכים', 'כל זכות' ),
			array( 'הארכות שופט עליון: עד 90 ימים בכל פעם, ועד 150 ימים במקרים מורכבים', 'https://www.kolzchut.org.il/he/מעצר_עד_תום_ההליכים', 'כל זכות' ),
			array( 'חלופות מעצר: מעצר בית, ערבות, פיקוח אלקטרוני', 'https://www.kolzchut.org.il/he/מעצר_עד_תום_ההליכים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'מעצר עד תום ההליכים, כל זכות', 'https://www.kolzchut.org.il/he/מעצר_עד_תום_ההליכים' ),
			array( 'חוק המעצרים, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)' ),
		),
		'related'   => array( 'days-detention-extension', 'bail-release-conditions', 'ktav-ishum-contents' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'bail-release-conditions',
		'title'     => 'שחרור בערובה: תנאים וסוגי ערבויות',
		'seo_title' => 'שחרור בערובה: תנאים, מועדי ערר והחזר ההפקדה | Jus-Tice',
		'seo_desc'  => 'איך נקבעת ערובה לשחרור ממעצר, אילו תנאים נלווים מותרים, מתי הערבות בטלה (180 יום בלי כתב אישום) ואיך עוררים.',
		'intro'     => 'שחרור בערובה הוא ברירת המחדל שהחוק מעדיף על מעצר. סעיף 46 לחוק המעצרים קובע איך נקבע גובה הערובה, ומה קורה כשהתיק לא מתקדם.',
		'facts'     => array(
			array( 'בקביעת הערובה נשקלים מהות העבירה, העבר הפלילי והמצב הכלכלי (סעיף 46)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'תנאים נלווים אפשריים: מעצר בית, איסור יציאה מהארץ עם הפקדת דרכון, איסור קשר, פיקוח קצין מבחן', 'https://www.kolzchut.org.il/he/חלופת_מעצר_בהחלטת_בית_משפט_(שחרור_בערבות)', 'כל זכות' ),
			array( 'פיקוח קצין מבחן כתנאי: עד שישה חודשים (סעיף 48(א))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'לא הוגש כתב אישום תוך 180 ימים: הערבות ותנאיה בטלים וההפקדה מוחזרת', 'https://www.kolzchut.org.il/he/החזר_דמי_ערבות_על-ידי_המשטרה', 'כל זכות' ),
			array( 'ערר על החלטת שחרור של קצין ממונה: לבית משפט השלום תוך 14 ימים (סעיף 53)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חלופת מעצר בהחלטת בית משפט', 'https://www.kolzchut.org.il/he/חלופת_מעצר_בהחלטת_בית_משפט_(שחרור_בערבות)' ),
			array( 'החזר דמי ערבות', 'https://www.kolzchut.org.il/he/החזר_דמי_ערבות_על-ידי_המשטרה' ),
		),
		'related'   => array( 'surety-bond-cost', 'remand-until-proceedings-end', 'erer-remand-decisions' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'shimua-section-60a-deadlines',
		'title'     => 'שימוע לפי סעיף 60א: מועדים והגשת בקשה',
		'seo_title' => 'שימוע 60א: 30 הימים שיכולים למנוע כתב אישום | Jus-Tice',
		'seo_desc'  => 'שימוע לפי סעיף 60א לחסדפ: הודעת היידוע בעבירות פשע, 30 ימים להגשת בקשה מנומקת בכתב, והנחיות הפרקליטות.',
		'intro'     => 'בעבירות פשע, לפני שמוגש כתב אישום, החוק נותן לחשוד חלון הזדמנות: הודעת יידוע לפי סעיף 60א, ו-30 ימים לשכנע את התביעה לא להגיש.',
		'facts'     => array(
			array( 'בעבירת פשע רשות התביעה שולחת לחשוד הודעה על העברת חומר החקירה (סעיף 60א(א))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'לחשוד 30 ימים מקבלת ההודעה לפנות בבקשה מנומקת בכתב להימנע מהגשת כתב אישום (סעיף 60א(ד))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'ההסדרה הפרקטית נמצאת בהנחיות פרקליט המדינה, באוסף ההנחיות הרשמי', 'https://www.gov.il/he/Departments/DynamicCollectors/guidelines-state-attorney', 'הנחיות הפרקליטות' ),
		),
		'official'  => array(
			array( 'חוק סדר הדין הפלילי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי' ),
			array( 'אוסף הנחיות פרקליט המדינה', 'https://www.gov.il/he/Departments/DynamicCollectors/guidelines-state-attorney' ),
		),
		'related'   => array( 'ktav-ishum-contents', 'conditional-arrangement-terms-amounts', 'objection-closing-case-file' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'conditional-arrangement-terms-amounts',
		'title'     => 'הסדר מותנה: תנאים וסגירת תיק בלי כתב אישום',
		'seo_title' => 'הסדר מותנה: מי זכאי ואיך נסגר התיק | Jus-Tice',
		'seo_desc'  => 'הסדר מותנה סוגר תיק בלי כתב אישום ובלי הרשעה: תנאי הזכאות לפי סעיפים 67א-67ב, תקופות הפיקוח, וזכות הנפגע להביע עמדה.',
		'intro'     => 'הסדר מותנה מאפשר לסגור תיק פלילי בלי כתב אישום ובלי הרשעה, בתמורה לעמידה בתנאים. סעיפים 67א עד 67יא לחוק סדר הדין הפלילי קובעים מי זכאי ואיך.',
		'facts'     => array(
			array( 'זכאות: עונש העבירה נמוך מ-3 שנות מאסר, אין רישום פלילי בחמש השנים שקדמו, אין חקירות או משפטים תלויים, והעונש המתאים אינו כולל מאסר בפועל', 'https://www.kolzchut.org.il/he/סגירת_תיק_פלילי_ללא_הגשת_כתב_אישום_באמצעות_הסדר_מותנה', 'כל זכות' ),
			array( 'תקופת פיקוח על התנאים: עד שנה, ובהמלצת קצין מבחן עד 18 חודשים (סעיף 67ג)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'נפגע עבירת מין או אלימות חמורה רשאי להביע עמדה תוך 14 יום', 'https://www.kolzchut.org.il/he/סגירת_תיק_פלילי_ללא_הגשת_כתב_אישום_באמצעות_הסדר_מותנה', 'כל זכות' ),
			array( 'עילת הסגירה נרשמת כסגירה בהסדר; הפרת התנאים מובילה להגשת כתב אישום', 'https://www.kolzchut.org.il/he/סגירת_תיק_פלילי_ללא_הגשת_כתב_אישום_באמצעות_הסדר_מותנה', 'כל זכות' ),
		),
		'official'  => array(
			array( 'הסדר מותנה, כל זכות', 'https://www.kolzchut.org.il/he/סגירת_תיק_פלילי_ללא_הגשת_כתב_אישום_באמצעות_הסדר_מותנה' ),
			array( 'מאגר ההסדרים המותנים בפרקליטות', 'https://www.gov.il/he/Departments/DynamicCollectors/conditional-order' ),
		),
		'related'   => array( 'shimua-section-60a-deadlines', 'objection-closing-case-file', 'expunge-closed-cases-record' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'bargain-plea-agreement',
		'title'     => 'הסדר טיעון: איך זה עובד ומתי בית המשפט מתערב',
		'seo_title' => 'הסדר טיעון: מה מקבלים, מי מאשר ומי מתנגד | Jus-Tice',
		'seo_desc'  => 'הסדר טיעון: הודאה תמורת הקלה בכתב האישום או בעונש, אישור בית המשפט, וזכות נפגעי עבירות חמורות להביע עמדה לפי סעיף 17.',
		'intro'     => 'רוב התיקים הפליליים בישראל מסתיימים בהסדר טיעון: הנאשם מודה בעובדות תמורת הקלה. ההסדר טעון אישור בית משפט, ולנפגעי עבירות חמורות יש בו קול.',
		'facts'     => array(
			array( 'ההקלה יכולה להיות תיקון כתב האישום, הפחתת סעיפים או הסכמה לעונש מופחת', 'https://www.kolzchut.org.il/he/הסדר_טיעון', 'כל זכות' ),
			array( 'ההסדר טעון אישור בית משפט; דחייה רק בחריגה קיצונית מהסביר', 'https://www.kolzchut.org.il/he/הסדר_טיעון', 'כל זכות' ),
			array( 'נפגעי עבירת מין או אלימות חמורה זכאים להביע עמדה על ההסדר (סעיף 17 לחוק זכויות נפגעי עבירה)', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'הסדר טיעון, כל זכות', 'https://www.kolzchut.org.il/he/הסדר_טיעון' ),
			array( 'חוק זכויות נפגעי עבירה', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה' ),
		),
		'related'   => array( 'conditional-arrangement-terms-amounts', 'ktav-ishum-contents', 'victims-rights-law-2001' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'stay-proceedings-attorney-general',
		'title'     => 'עיכוב הליכים פליליים בידי היועץ המשפטי לממשלה',
		'seo_title' => 'עיכוב הליכים: איך מבקשים ומתי מחדשים | Jus-Tice',
		'seo_desc'  => 'עיכוב הליכים לפי סעיף 231: בקשה ליועמש אחרי כתב אישום, חידוש עד 5 שנים בפשע ושנה בעוון, והעילות שמתקבלות.',
		'intro'     => 'היועץ המשפטי לממשלה מוסמך לעכב הליכים פליליים בכל שלב אחרי הגשת כתב האישום ולפני הכרעת הדין, לפי סעיף 231 לחוק סדר הדין הפלילי. היחידה בפרקליטות מטפלת בכאלף בקשות בשנה.',
		'facts'     => array(
			array( 'חידוש הליכים אחרי עיכוב: בפשע עד 5 שנים, בעוון עד שנה (סעיף 232)', 'https://www.gov.il/he/pages/stay-of-proceeding-practical-information-guidelines', 'gov.il' ),
			array( 'העילות המקובלות: נסיבות חריגות של העבירה או נסיבות אישיות מיוחדות; טענת חוסר ראיות אינה עילה', 'https://www.gov.il/he/pages/stay-of-proceeding-practical-information-guidelines', 'gov.il' ),
			array( 'היחידה לעיכוב הליכים בפרקליטות מטפלת בכ-1,000 בקשות בשנה', 'https://www.gov.il/he/pages/stay-of-proceeding-about', 'gov.il' ),
		),
		'official'  => array(
			array( 'היחידה לעיכוב הליכים', 'https://www.gov.il/he/departments/topics/stay_of_proceedings/govil-landing-page' ),
			array( 'שאלות ותשובות עיכוב הליכים', 'https://www.gov.il/he/departments/faq/stayofproceeding-faq' ),
		),
		'related'   => array( 'pardon-request-president', 'bargain-plea-agreement', 'retrial-request-supreme' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'objection-closing-case-file',
		'title'     => 'ערר על סגירת תיק חקירה',
		'seo_title' => 'ערר על סגירת תיק: 60 יום ולמי מגישים | Jus-Tice',
		'seo_desc'  => 'נסגר התיק בעניינכם? ערר מוגש תוך 60 ימים, הנמען נקבע לפי עילת הסגירה, ואין חובה בעורך דין. לפי סעיפים 64-65 לחסדפ.',
		'intro'     => 'מי שנפגע מהחלטה לסגור תיק חקירה רשאי לערור עליה. סעיפים 64 עד 65 לחוק סדר הדין הפלילי קובעים את המועד, והנמען משתנה לפי עילת הסגירה.',
		'facts'     => array(
			array( 'מועד ההגשה: תוך 60 ימים מקבלת ההודעה על הסגירה', 'https://www.kolzchut.org.il/he/ערר_על_סגירת_תיק_חקירה', 'כל זכות' ),
			array( 'הנמען לפי העילה: חוסר אשמה או ראיות אל פרקליט המדינה; היעדר עניין לציבור אל היועץ המשפטי לממשלה', 'https://www.kolzchut.org.il/he/ערר_על_סגירת_תיק_חקירה', 'כל זכות' ),
			array( 'הערר מוגש דרך הגורם שסגר את התיק, וניתן לבקש ארכה', 'https://www.kolzchut.org.il/he/ערר_על_סגירת_תיק_חקירה', 'כל זכות' ),
			array( 'אין צורך בעורך דין להגשת ערר', 'https://www.kolzchut.org.il/he/ערר_על_סגירת_תיק_חקירה', 'כל זכות' ),
		),
		'official'  => array(
			array( 'ערר על סגירת תיק, כל זכות', 'https://www.kolzchut.org.il/he/ערר_על_סגירת_תיק_חקירה' ),
			array( 'חוק סדר הדין הפלילי', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי' ),
		),
		'related'   => array( 'shimua-section-60a-deadlines', 'expunge-closed-cases-record', 'victims-rights-law-2001' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'pardon-request-president',
		'title'     => 'בקשת חנינה מנשיא המדינה',
		'seo_title' => 'בקשת חנינה: איך מגישים לנשיא המדינה | Jus-Tice',
		'seo_desc'  => 'הגשת בקשת חנינה לנשיא: מקוון דרך מחלקת חנינות במשרד המשפטים, מי רשאי להגיש, ומדיניות מיצוי ההליכים. כולל טלפון לבירורים.',
		'intro'     => 'חנינה היא סמכות נשיא המדינה, והבקשה מוגשת דרך מחלקת חנינות במשרד המשפטים. הנשיא דן בבקשה ככלל רק אחרי שמוצו כל ההליכים המשפטיים.',
		'facts'     => array(
			array( 'הבקשה מוגשת באופן מקוון דרך שירות מחלקת חנינות במשרד המשפטים', 'https://www.gov.il/he/service/pardon_request', 'gov.il' ),
			array( 'רשאים להגיש: המבקש עצמו, עורך דינו או קרוב מדרגה ראשונה', 'https://www.gov.il/he/service/pardon_request', 'gov.il' ),
			array( 'בירורים: מחלקת חנינות בבית הנשיא, טלפון 02-6707211, בימי חול 9:00 עד 11:00', 'https://www.gov.il/he/pages/20-05-2024', 'gov.il' ),
			array( 'לנפגע עבירה שירות ייעודי להגשת עמדה בעניין בקשת חנינה', 'https://www.gov.il/he/service/victims_of_crime_position_regading_pardon', 'gov.il' ),
		),
		'official'  => array(
			array( 'הגשת בקשת חנינה', 'https://www.gov.il/he/service/pardon_request' ),
			array( 'מחלקת חנינות', 'https://www.gov.il/he/departments/ministry_of_justice_pardons/govil-landing-page' ),
		),
		'related'   => array( 'stay-proceedings-attorney-general', 'retrial-request-supreme', 'takanat-hashavim-law-2019' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'expunge-closed-cases-record',
		'title'     => 'ביטול רישום משטרתי של תיקים סגורים',
		'seo_title' => 'מחיקת תיק סגור מהרישום המשטרתי: 5 או 7 שנים | Jus-Tice',
		'seo_desc'  => 'תיקי עוון וחטא נמחקים אוטומטית אחרי 7 שנים; בקשה יזומה אפשרית אחרי 5 שנים בעוון ו-7 בפשע. איך מגישים ולמי.',
		'intro'     => 'תיק שנסגר לא נעלם מעצמו מהרישום המשטרתי, אבל החוק קובע גם מחיקה אוטומטית וגם מסלול בקשה יזומה. אלה הכללים והמועדים.',
		'facts'     => array(
			array( 'תיקי עוון וחטא נמחקים אוטומטית לאחר 7 שנים מהאירוע, בכפוף לחריגים', 'https://www.kolzchut.org.il/he/ביטול_רישום_משטרתי_של_תיקים_סגורים', 'כל זכות' ),
			array( 'בקשה יזומה לביטול: בפשע לאחר 7 שנים, בעוון לאחר 5 שנים', 'https://www.kolzchut.org.il/he/ביטול_רישום_משטרתי_של_תיקים_סגורים', 'כל זכות' ),
			array( 'המחליט: ראש אגף חקירות ומודיעין או קצין שהוסמך, לפי קריטריונים שקבעו השרים', 'https://www.kolzchut.org.il/he/ביטול_רישום_משטרתי_של_תיקים_סגורים', 'כל זכות' ),
			array( 'ההגשה מקוונת בהזדהות ממשלתית; רק בעל הרישום רשאי להגיש; טלפון מדור מידע פלילי 02-5429757', 'https://www.kolzchut.org.il/he/ביטול_רישום_משטרתי_של_תיקים_סגורים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'ביטול רישום משטרתי, כל זכות', 'https://www.kolzchut.org.il/he/ביטול_רישום_משטרתי_של_תיקים_סגורים' ),
			array( 'חוק המידע הפלילי ותקנת השבים', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים' ),
		),
		'related'   => array( 'mishtarti-vs-plili-record', 'takanat-hashavim-law-2019', 'registry-criminal-information-police' ),
		'pillar'    => 'police-records-data-deletion',
	),

	array(
		'slug'      => 'inspection-material-section-74',
		'title'     => 'עיון בחומר חקירה לפי סעיף 74',
		'seo_title' => 'עיון בחומר חקירה: הזכות של הנאשם וסניגורו | Jus-Tice',
		'seo_desc'  => 'אחרי כתב אישום, הנאשם וסניגורו רשאים לעיין בחומר החקירה ולהעתיקו לפי סעיף 74. מחלוקות מוכרעות בבית המשפט וערר תוך 30 יום.',
		'intro'     => 'מרגע שהוגש כתב אישום, ההגנה זכאית לראות את כל חומר החקירה. סעיף 74 לחוק סדר הדין הפלילי קובע את הזכות, את מנגנון ההכרעה במחלוקות ואת מועד הערר.',
		'facts'     => array(
			array( 'הנאשם וסניגורו רשאים לעיין בחומר החקירה בכל זמן סביר ולהעתיקו (סעיף 74(א))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'מחלוקת על היקף החומר מוכרעת בבית המשפט הדן באישום (סעיף 74(ב))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'על החלטת בית המשפט ניתן לערור תוך 30 ימים (סעיף 74(ה))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק סדר הדין הפלילי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי' ),
		),
		'related'   => array( 'ktav-ishum-contents', 'remand-until-proceedings-end', 'bargain-plea-agreement' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'retrial-request-supreme',
		'title'     => 'משפט חוזר: עילות והגשת בקשה',
		'seo_title' => 'משפט חוזר: ארבע העילות ואיך מגישים | Jus-Tice',
		'seo_desc'  => 'משפט חוזר לפי סעיף 31 לחוק בתי המשפט: ראיה שהתבררה כשקרית, ראיות חדשות, הרשעת אחר או חשש לעיוות דין. הסניגוריה מייצגת חינם.',
		'intro'     => 'משפט חוזר הוא מנגנון תיקון ההרשעות של המשפט הישראלי. סעיף 31 לחוק בתי המשפט קובע ארבע עילות, והסמכות להורות עליו נתונה לבית המשפט העליון.',
		'facts'     => array(
			array( 'ארבע העילות: ראיה שהתבררה כזיוף או שקר, ראיות חדשות, אדם אחר הורשע באותו מעשה, חשש ממשי לעיוות דין', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'נוסח החוק' ),
			array( 'מאז 2001 הסניגוריה הציבורית מוסמכת לייצג מורשעים בבקשות למשפט חוזר, במחלקה ארצית ייעודית', 'https://www.gov.il/he/pages/retrail_department', 'gov.il' ),
			array( 'פנייה מקוונת לסניגוריה: ללא תשלום', 'https://www.gov.il/he/service/request-for-representation-by-the-public-defender-office', 'gov.il' ),
		),
		'official'  => array(
			array( 'מחלקת משפטים חוזרים בסניגוריה', 'https://www.gov.il/he/pages/retrail_department' ),
			array( 'חוק בתי המשפט', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט' ),
		),
		'related'   => array( 'exoneration-compensation-defense-costs', 'pardon-request-president', 'arkaot-criminal-courts' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'eligibility-public-defender-income',
		'title'     => 'זכאות לסניגור ציבורי: קטגוריות ומבחן הכנסה',
		'seo_title' => 'סניגור ציבורי: מי זכאי ומה מבחן ההכנסה 2026 | Jus-Tice',
		'seo_desc'  => 'זכאות לסניגור ציבורי: לפי חומרת העבירה, לפי מצב אישי, ולפי מבחן הכנסה של עד 9,225 שח למשפחה. כל הקטגוריות המעודכנות.',
		'intro'     => 'הסניגוריה הציבורית מייצגת את מי שהחוק קבע שזכאי לייצוג, לפי חומרת העבירה, המצב האישי או מבחן כלכלי. אלה הקטגוריות והמספרים המעודכנים לשנת 2026.',
		'facts'     => array(
			array( 'זכאות לפי חומרה: נאשם בעבירה שדינה 10 שנות מאסר ומעלה במחוזי; חסר אמצעים בעבירה שדינה 5 שנים ומעלה; נאשם שהתביעה מבקשת לו מאסר בפועל', 'https://www.kolzchut.org.il/he/ייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי', 'כל זכות' ),
			array( 'זכאות ללא מבחן כלכלי: קטינים, אדם אילם, עיוור או חירש, חשש ללקות נפשית, ומינוי בהוראת בית משפט', 'https://www.kolzchut.org.il/he/ייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי', 'כל זכות' ),
			array( 'המבחן הכלכלי לשנת 2026: הכנסה עד 9,225 ש"ח למשפחה של עד 3 נפשות, בתוספת 826 ש"ח לכל נפש נוספת; רכוש נזיל עד 41,307 ש"ח', 'https://www.kolzchut.org.il/he/ייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי', 'כל זכות' ),
			array( 'עצור לצורכי חקירה חסר אמצעים, ומי שהוגשה נגדו בקשת מעצר עד תום ההליכים: זכאים', 'https://www.kolzchut.org.il/he/ייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי', 'כל זכות' ),
		),
		'official'  => array(
			array( 'ייצוג על ידי סניגור ציבורי, כל זכות', 'https://www.kolzchut.org.il/he/ייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי' ),
			array( 'פנייה מקוונת לסניגוריה הציבורית', 'https://www.gov.il/he/service/request-for-representation-by-the-public-defender-office' ),
		),
		'related'   => array( 'agra-criminal-proceedings-exemption', 'sanegoria-public-defense-districts', 'consultation-before-police-questioning' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'agra-criminal-proceedings-exemption',
		'title'     => 'אגרות בהליך פלילי: מה פטור ומה משלמים',
		'seo_title' => 'אגרות בהליך פלילי: הפטור והחריגים | Jus-Tice',
		'seo_desc'  => 'הליכים פליליים פטורים מאגרת בית משפט לפי תקנה 20(8). מה כן משלמים: אגרת סניגוריה ציבורית 537 עד 1,474 שח לפי הערכאה.',
		'intro'     => 'בניגוד להליך האזרחי, ההליך הפלילי כמעט נקי מאגרות: בקשה במשפט פלילי, ערעור פלילי ודיון נוסף פטורים מאגרת בית משפט. מה שכן קיים: אגרת הסניגוריה הציבורית.',
		'facts'     => array(
			array( 'בקשה או עניין במשפט פלילי, ערעור פלילי ובקשה לדיון נוסף פלילי: פטורים מאגרה (תקנה 20(8) לתקנות בתי המשפט (אגרות))', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'חריג: קובלנה פלילית פרטית וערעור הקובל עליה חייבים באגרה', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)', 'תקנות האגרות' ),
			array( 'אגרת סניגוריה ציבורית (2026): נאשם במחוזי 1,474 ש"ח; בבית משפט אחר 537 ש"ח, או 737 ש"ח כשהתובע פרקליט; מערער בעליון 1,474 ש"ח', 'https://www.kolzchut.org.il/he/הגשת_בקשה_לייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי', 'כל זכות' ),
			array( 'הייצוג אינו מותנה בתשלום האגרה; התשלום תוך 60 יום מהמינוי, וקיימים פטורים והקלות', 'https://www.kolzchut.org.il/he/הגשת_בקשה_לייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי', 'כל זכות' ),
		),
		'official'  => array(
			array( 'תקנות בתי המשפט (אגרות)', 'https://he.wikisource.org/wiki/תקנות_בתי_המשפט_(אגרות)' ),
			array( 'הגשת בקשה לסניגור ציבורי, כל זכות', 'https://www.kolzchut.org.il/he/הגשת_בקשה_לייצוג_על_ידי_סניגור_ציבורי_בהליך_פלילי' ),
		),
		'related'   => array( 'eligibility-public-defender-income', 'exoneration-compensation-defense-costs', 'reimbursement-witnesses-court' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'exoneration-compensation-defense-costs',
		'title'     => 'פיצוי לנאשם שזוכה: סעיף 80 לחוק העונשין',
		'seo_title' => 'פיצוי על מעצר ומאסר שווא אחרי זיכוי | Jus-Tice',
		'seo_desc'  => 'סעיף 80 לחוק העונשין: פיצוי והוצאות הגנה לנאשם שזוכה. תקרת הפיצוי ליום מעצר, תקרות הוצאות ההגנה לשנת 2026, ומתי חורגים.',
		'intro'     => 'נאשם שזוכה יכול לקבל פיצוי על ימי המעצר והמאסר והחזר הוצאות הגנה, לפי סעיף 80 לחוק העונשין. אלה העילות, התקרות והמספרים המעודכנים.',
		'facts'     => array(
			array( 'שתי עילות בסעיף 80(א): לא היה יסוד להאשמה, או נסיבות אחרות המצדיקות זאת; הפסיקה בשיקול דעת בית המשפט', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'תקרת הפיצוי ליום מעצר או מאסר: אחד חלקי 25 מהשכר החודשי הממוצע במשק ביום ההחלטה (תקנה 8 לתקנות הפיצויים)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_(פיצויים_בשל_מעצר_או_מאסר)', 'התקנות' ),
			array( 'תקרות הוצאות הגנה (עדכון אפריל 2026): 2,840 עד 5,680 ש"ח לפי ערכאה וסוג שירות, בתוספת מע"מ', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_(פיצויים_בשל_מעצר_או_מאסר)', 'התקנות' ),
			array( 'בית המשפט רשאי לחרוג עד 50 אחוזים מעל התקרה מטעמי צדק', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_(פיצויים_בשל_מעצר_או_מאסר)', 'התקנות' ),
		),
		'official'  => array(
			array( 'תקנות הפיצויים בשל מעצר או מאסר', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_(פיצויים_בשל_מעצר_או_מאסר)' ),
			array( 'חוק העונשין', 'https://he.wikisource.org/wiki/חוק_העונשין' ),
		),
		'related'   => array( 'retrial-request-supreme', 'remand-until-proceedings-end', 'agra-criminal-proceedings-exemption' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'surety-bond-cost',
		'title'     => 'כמה עולה ערבות: הפקדה, ערבות עצמית וצד שלישי',
		'seo_title' => 'כמה עולה ערבות לשחרור ממעצר | Jus-Tice',
		'seo_desc'  => 'אין תעריף קבוע לערבות: הגובה נקבע לפי העבירה, העבר והמצב הכלכלי. סוגי הערובה, ומתי ההפקדה חוזרת (180 יום בלי כתב אישום).',
		'intro'     => 'לערבות אין מחירון. סעיף 46 לחוק המעצרים קובע שהגובה נקבע לפי מהות העבירה, העבר הפלילי והמצב הכלכלי של המשוחרר. אלה סוגי הערובה ומתי הכסף חוזר.',
		'facts'     => array(
			array( 'סוגי ערובה: התחייבות עצמית, הפקדה כספית וערבות צד שלישי, לבד או במשולב', 'https://www.kolzchut.org.il/he/חלופת_מעצר_בהחלטת_בית_משפט_(שחרור_בערבות)', 'כל זכות' ),
			array( 'הפקדה במשטרה מוחזרת אם לא הוגש כתב אישום תוך 180 ימים', 'https://www.kolzchut.org.il/he/החזר_דמי_ערבות_על-ידי_המשטרה', 'כל זכות' ),
			array( 'הפקדה בקופת בית המשפט משוחררת בהחלטת בית המשפט, בבקשה למזכירות', 'https://www.kolzchut.org.il/he/החזר_דמי_ערבות_על-ידי_המשטרה', 'כל זכות' ),
		),
		'official'  => array(
			array( 'החזר דמי ערבות, כל זכות', 'https://www.kolzchut.org.il/he/החזר_דמי_ערבות_על-ידי_המשטרה' ),
			array( 'חוק המעצרים', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)' ),
		),
		'related'   => array( 'bail-release-conditions', 'days-detention-extension', 'agra-criminal-proceedings-exemption' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'reimbursement-witnesses-court',
		'title'     => 'שכר עדים והחזר הוצאות בהליך פלילי',
		'seo_title' => 'שכר עדים במשפט פלילי: התעריפים המעודכנים | Jus-Tice',
		'seo_desc'  => 'כמה משלמים לעד: עד 122 שח להתייצבות של עד 4 שעות, עד 237 שח ליום מלא, ודמי לינה עד 161 שח. תעריפי 2026 מהתקנות.',
		'intro'     => 'עד שמתייצב במשפט פלילי זכאי לשכר בטלה ולהחזר הוצאות, לפי תקנה 10 לתקנות סדר הדין הפלילי. אלה התעריפים המעודכנים לשנת 2026.',
		'facts'     => array(
			array( 'שכר בטלה: עד 122 ש"ח להתייצבות של עד 4 שעות; עד 237 ש"ח ליום של יותר מ-4 שעות', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_הפלילי', 'התקנות' ),
			array( 'דמי לינה מחוץ לבית, כנגד קבלה: עד 161 ש"ח', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_הפלילי', 'התקנות' ),
			array( 'תעריפי רופא: תעודה רפואית עד 38 ש"ח; חוות דעת בכתב עד 122 ש"ח', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_הפלילי', 'התקנות' ),
			array( 'הסכומים מתעדכנים בכל 1 בינואר לפי מדד המחירים לצרכן (תקנה 10א)', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_הפלילי', 'התקנות' ),
		),
		'official'  => array(
			array( 'תקנות סדר הדין הפלילי', 'https://he.wikisource.org/wiki/תקנות_סדר_הדין_הפלילי' ),
		),
		'related'   => array( 'agra-criminal-proceedings-exemption', 'ed-medina-state-witness', 'arkaot-criminal-courts' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'prosecution-state-districts',
		'title'     => 'פרקליטות המדינה: המחוזות הפליליים',
		'seo_title' => 'פרקליטויות המחוז הפליליות: המפה המלאה | Jus-Tice',
		'seo_desc'  => 'שש פרקליטויות מחוז פליליות: ירושלים, תל אביב, מרכז, חיפה, צפון ודרום. מה כל אחת מכסה ומי מולכם בתיק.',
		'intro'     => 'בכל מחוז גיאוגרפי פועלות שתי פרקליטויות, פלילית ואזרחית. בתיק פלילי, הפרקליטות המחוזית היא הצד שמולכם. אלה המחוזות והכיסוי שלהם.',
		'facts'     => array(
			array( 'המחוזות הפליליים: ירושלים, תל אביב, מרכז, חיפה, צפון (נצרת) ודרום (באר שבע)', 'https://www.gov.il/he/Departments/General/departments', 'gov.il' ),
			array( 'מחוז מרכז הפלילי: כ-175 עובדים, מהם 108 פרקליטים, ומשרת מעל 2.5 מיליון תושבים', 'https://www.gov.il/he/pages/central-criminal-about', 'gov.il' ),
			array( 'מחוז חיפה הפלילי: כ-100 עובדים, כ-60 פרקליטים, שיפוט מגבול לבנון עד חדרה', 'https://www.gov.il/he/pages/haifa-criminal-about', 'gov.il' ),
		),
		'official'  => array(
			array( 'מחוזות ומחלקות הפרקליטות', 'https://www.gov.il/he/Departments/General/departments' ),
			array( 'אודות התחום הפלילי בפרקליטות', 'https://www.gov.il/he/pages/criminal-about' ),
		),
		'related'   => array( 'mahash-police-investigations-department', 'ombudsman-prosecution-complaints', 'stay-proceedings-attorney-general' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'sanegoria-public-defense-districts',
		'title'     => 'הסניגוריה הציבורית: מחוזות ודרכי פנייה',
		'seo_title' => 'הסניגוריה הציבורית: טלפונים לפי מחוז ופנייה | Jus-Tice',
		'seo_desc'  => 'ששת מחוזות הסניגוריה הציבורית עם כל הטלפונים, הפנייה המקוונת ללא תשלום, והבסיס בחוק הסניגוריה הציבורית משנת 1995.',
		'intro'     => 'הסניגוריה הציבורית פועלת מ-1996 כיחידה עצמאית במשרד המשפטים, מכוח חוק הסניגוריה הציבורית. אלה המחוזות, הטלפונים ודרך הפנייה.',
		'facts'     => array(
			array( 'שישה מחוזות: תל אביב, ירושלים, חיפה, צפון, מרכז ודרום', 'https://www.kolzchut.org.il/he/הסניגוריה_הציבורית', 'כל זכות' ),
			array( 'טלפונים: ארצית 073-3923503; תל אביב 073-3923639; ירושלים 073-3926035; חיפה 073-3921001; צפון 073-3929801; מרכז 073-3923579; דרום 073-3922487', 'https://www.kolzchut.org.il/he/הסניגוריה_הציבורית', 'כל זכות' ),
			array( 'פנייה מקוונת בטופס ממשלתי, ללא תשלום', 'https://www.gov.il/he/service/request-for-representation-by-the-public-defender-office', 'gov.il' ),
		),
		'official'  => array(
			array( 'הסניגוריה הציבורית, כל זכות', 'https://www.kolzchut.org.il/he/הסניגוריה_הציבורית' ),
			array( 'דף הסניגוריה הציבורית', 'https://www.gov.il/he/departments/public-defense/govil-landing-page' ),
		),
		'related'   => array( 'eligibility-public-defender-income', 'retrial-request-supreme', 'agra-criminal-proceedings-exemption' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'mahash-police-investigations-department',
		'title'     => 'מח"ש: המחלקה לחקירות שוטרים',
		'seo_title' => 'מח"ש: איך מגישים תלונה נגד שוטר | Jus-Tice',
		'seo_desc'  => 'המחלקה לחקירות שוטרים במשרד המשפטים חוקרת עבירות של אנשי משטרה. מי רשאי להתלונן, איך מגישים ומה קורה אחרי.',
		'intro'     => 'מח"ש, המחלקה לחקירות שוטרים במשרד המשפטים, היא הגוף שחוקר חשדות פליליים נגד אנשי משטרה. כל אדם רשאי להגיש תלונה, וההגשה מקוונת.',
		'facts'     => array(
			array( 'מח"ש מוסמכת לחקור עבירות פליליות של אנשי משטרה שעונשן מעל שנת מאסר', 'https://www.gov.il/he/Departments/General/complaint_against_police', 'gov.il' ),
			array( 'כל אדם רשאי להתלונן, על עבירה במילוי תפקיד או מחוצה לו', 'https://www.gov.il/he/Departments/General/complaint_against_police', 'gov.il' ),
			array( 'הגשת תלונה בטופס מקוון בלבד, עם אפשרות לצרף קבצים ותיעוד', 'https://www.gov.il/he/service/filing_a_complaint_against_police', 'gov.il' ),
		),
		'official'  => array(
			array( 'הגשת תלונה נגד שוטר', 'https://www.gov.il/he/service/filing_a_complaint_against_police' ),
			array( 'דף מח"ש', 'https://www.gov.il/he/departments/topics/investigation_police_department/govil-landing-page' ),
		),
		'related'   => array( 'prosecution-state-districts', 'ombudsman-prosecution-complaints', 'summons-interrogation-warning-rights' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'registry-criminal-information-police',
		'title'     => 'מדור מידע פלילי: תעודות ועיון במרשם',
		'seo_title' => 'תעודת מידע פלילי מהמשטרה: איך מקבלים | Jus-Tice',
		'seo_desc'  => 'הנפקת תעודת מידע פלילי: בתחנה, בשגרירות או אונליין, כולל תעודה דיגיטלית בעברית ובאנגלית. מה מופיע בה ומה לא.',
		'intro'     => 'תעודת מידע פלילי מונפקת לפי חוק המידע הפלילי ותקנת השבים, והיא כוללת רק מה שהחוק מתיר: הרשעות שלא התיישנו ותיקים תלויים. כך מוציאים אותה.',
		'facts'     => array(
			array( 'הגשה: בכל תחנת משטרה, בשגרירות ישראל בחו"ל או אונליין', 'https://www.gov.il/he/service/request-for-criminal-information-certificate', 'gov.il' ),
			array( 'מדצמבר 2024 מונפקת גם תעודה דיגיטלית בעברית ובאנגלית בשירות מקוון', 'https://www.gov.il/he/service/request-for-criminal-information-certificate', 'gov.il' ),
			array( 'התעודה כוללת רק הרשעות שלא התיישנו או נמחקו, ותיקים תלויים ועומדים', 'https://www.gov.il/he/departments/general/police_criminal_information_certificates', 'gov.il' ),
			array( 'עיון עצמי במרשם: בהצגה על מסך בתחנת משטרה (סעיף 4 לחוק); טלפון המדור 02-5429757', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'הנפקת תעודת מידע פלילי', 'https://www.gov.il/he/service/request-for-criminal-information-certificate' ),
			array( 'חוק המידע הפלילי ותקנת השבים', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים' ),
		),
		'related'   => array( 'mishtarti-vs-plili-record', 'expunge-closed-cases-record', 'takanat-hashavim-law-2019' ),
		'pillar'    => 'police-records-data-deletion',
	),

	array(
		'slug'      => 'unit-cyber-crime-national',
		'title'     => 'יחידת הסייבר הארצית של משטרת ישראל',
		'seo_title' => 'יחידת הסייבר הארצית בלהב 433 | Jus-Tice',
		'seo_desc'  => 'יחידת הסייבר הארצית מובילה את המאבק בפשיעת סייבר: חלוקת העבודה מול היחידות המרחביות, המדור להגנת ילדים ברשת ויחידה 105.',
		'intro'     => 'יחידת הסייבר הארצית פועלת בתוך להב 433 ומובילה את המאבק בפשיעת הסייבר בישראל, לצד יחידות סייבר מרחביות ויחידה 105 להגנה על ילדים ברשת.',
		'facts'     => array(
			array( 'חלוקת העבודה: היחידות המרחביות מגיבות לחקירות; היחידה הארצית חושפת פשיעה יזומה', 'https://www.police.gov.il/join/cyber', 'משטרת ישראל' ),
			array( 'מפעילה מדור ייעודי לחשיפת פוגעים מינית בילדים ברשת, בשיתוף אינטרפול', 'https://www.police.gov.il/join/cyber', 'משטרת ישראל' ),
			array( 'לצדה פועלת יחידה מבצעית 105, המטה הלאומי להגנה על ילדים ברשת', 'https://www.gov.il/he/departments/units/operational_unit', 'gov.il' ),
		),
		'official'  => array(
			array( 'יחידת הסייבר, אגף החקירות והמודיעין', 'https://www.gov.il/he/pages/police_investigations_and_intelligence_department_cyber_unit' ),
			array( 'יחידה 105', 'https://www.gov.il/he/departments/units/operational_unit' ),
		),
		'related'   => array( 'mahash-police-investigations-department', 'prosecution-state-districts', 'wiretapping-law-1979' ),
		'pillar'    => 'lahav-433',
	),

	array(
		'slug'      => 'rehabilitation-prisoner-authority',
		'title'     => 'הרשות לשיקום האסיר',
		'seo_title' => 'הרשות לשיקום האסיר: שירותים ופנייה | Jus-Tice',
		'seo_desc'  => 'הרשות לשיקום האסיר פועלת מ-1984 מכוח חוק ייעודי: הוסטלים, מרכזי יום, הכשרה מקצועית ופיקוח. כתובת, טלפון ומייל.',
		'intro'     => 'הרשות לשיקום האסיר היא הגוף הסטטוטורי שמלווה אסירים משוחררים חזרה לחיים: דיור, תעסוקה, טיפול ופיקוח. הוקמה ב-1984 מכוח חוק הרשות לשיקום האסיר.',
		'facts'     => array(
			array( 'כפופה למשרד הרווחה והביטחון החברתי, כגוף סטטוטורי טיפולי שיקומי', 'https://www.gov.il/he/pages/about_us111', 'gov.il' ),
			array( 'השירותים: הוסטלים, מרכזי יום, דירות מעבר, מענקי הכשרה מקצועית ופיקוח אלקטרוני', 'https://www.gov.il/he/pages/about_us111', 'gov.il' ),
			array( 'המטה: כנפי נשרים 24, ירושלים; טלפון 02-5420700', 'https://www.gov.il/he/pages/contact_rasha', 'gov.il' ),
		),
		'official'  => array(
			array( 'דף הרשות לשיקום האסיר', 'https://www.gov.il/he/departments/pra' ),
			array( 'מידע לאסיר משוחרר', 'https://www.gov.il/he/pages/information_for_the_released' ),
		),
		'related'   => array( 'prison-visits-rights', 'probation-service-adults', 'takanat-hashavim-law-2019' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'prison-visits-rights',
		'title'     => 'ביקורים בשירות בתי הסוהר: כללים וזכויות',
		'seo_title' => 'ביקור אסיר: תיאום, שעות וכללי כניסה | Jus-Tice',
		'seo_desc'  => 'איך מתאמים ביקור אסיר: טלפון 074-7837777, שעות הביקורים בימי חמישי, ראשון ושישי, משך עד שעה, ומה מביאים לכניסה.',
		'intro'     => 'ביקור אסיר מתואם מראש מול צוות התיאום של המתקן, והכללים המלאים קבועים בפקודת נציבות ייעודית. אלה השעות, הכללים ומה שצריך להביא.',
		'facts'     => array(
			array( 'תיאום ביקור טלפוני מול צוות התיאום במתקן: 074-7837777', 'https://www.gov.il/he/pages/klaley_bikur', 'שירות בתי הסוהר' ),
			array( 'שעות ביקור רגילות: חמישי וראשון 9:00 עד 12:00 ו-14:00 עד 16:00; שישי 9:00 עד 14:00; אין ביקורים בשבת ובחג', 'https://www.gov.il/he/pages/klaley_bikur', 'שירות בתי הסוהר' ),
			array( 'משך הביקור: עד שעה, בשיקול דעת מפקד בית הסוהר', 'https://www.gov.il/he/pages/klaley_bikur', 'שירות בתי הסוהר' ),
			array( 'כניסה עם תעודה רשמית עם תמונה; תושב חוץ עם דרכון; אסיר משוחרר לא יבקר ללא אישור מראש', 'https://www.gov.il/he/pages/klaley_bikur', 'שירות בתי הסוהר' ),
		),
		'official'  => array(
			array( 'איך קובעים ביקור', 'https://www.gov.il/he/pages/klaley_bikur' ),
			array( 'שאלות ותשובות ביקורים', 'https://www.gov.il/he/departments/faq/bikurim_ips' ),
		),
		'related'   => array( 'rehabilitation-prisoner-authority', 'remand-until-proceedings-end', 'victims-rights-law-2001' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'ombudsman-prosecution-complaints',
		'title'     => 'נציבות תלונות הציבור על מייצגי המדינה בערכאות',
		'seo_title' => 'תלונה על פרקליט או תובע: הנציבות הייעודית | Jus-Tice',
		'seo_desc'  => 'הנציבות שמבררת תלונות על פרקליטים, תביעה משטרתית ותביעה עירונית: הבסיס בחוק משנת 2016 ואיך פונים.',
		'intro'     => 'מי שנפגע מהתנהלות פרקליט או תובע מטעם המדינה יכול לפנות לנציבות ייעודית שהוקמה בחוק בשנת 2016. היא מבררת תלונות על כלל מייצגי המדינה בערכאות.',
		'facts'     => array(
			array( 'הנציבות מוסמכת לברר תלונות על פרקליטים, תביעה משטרתית, תביעה עירונית ועורכי דין חיצוניים מטעם המדינה', 'https://www.gov.il/he/pages/law_082016', 'gov.il' ),
			array( 'הנציב מתמנה על ידי שר המשפטים, וכשיר להתמנות שופט בית המשפט העליון', 'https://www.gov.il/he/pages/law_082016', 'gov.il' ),
			array( 'הנציבות החליפה את נציבות הביקורת על מערך התביעה; הנציב הראשון היה השופט בדימוס דוד רוזן', 'https://www.gov.il/he/pages/law_082016', 'gov.il' ),
		),
		'official'  => array(
			array( 'דף הנציבות', 'https://www.gov.il/he/departments/ministry_of_justice_commission/govil-landing-page' ),
		),
		'related'   => array( 'prosecution-state-districts', 'mahash-police-investigations-department', 'objection-closing-case-file' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'arkaot-criminal-courts',
		'title'     => 'ערכאות המשפט הפלילי: שלום, מחוזי, עליון',
		'seo_title' => 'איזה בית משפט דן באיזו עבירה פלילית | Jus-Tice',
		'seo_desc'  => 'חלוקת הסמכויות הפלילית: שלום עד 7 שנות מאסר, מחוזי בכל השאר ובערעורים, הרכב שלושה בעבירות חמורות, והכל פטור מאגרה.',
		'intro'     => 'איזו ערכאה תדון בתיק שלכם נקבע לפי חומרת העבירה, בחוק בתי המשפט. אלה הכללים: מהשלום, דרך המחוזי ועד העליון.',
		'facts'     => array(
			array( 'בית משפט השלום: עבירות שעונשן קנס או מאסר עד 7 שנים, בכפוף לחריגים (סעיף 51)', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'נוסח החוק' ),
			array( 'בית המשפט המחוזי: כל עניין פלילי שאינו בסמכות השלום, וערעורים על השלום (סעיף 40)', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'נוסח החוק' ),
			array( 'הרכב שלושה חובה בעבירות שעונשן 10 שנות מאסר ומעלה (סעיף 37)', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'נוסח החוק' ),
			array( 'ערעור בזכות על פסק דין; ברשות על החלטות אחרות (סעיפים 41 ו-52); הליכים פליליים פטורים מאגרה', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק בתי המשפט', 'https://he.wikisource.org/wiki/חוק_בתי_המשפט' ),
			array( 'מאגר החלטות בית המשפט העליון', 'https://supremedecisions.court.gov.il' ),
		),
		'related'   => array( 'retrial-request-supreme', 'classification-offenses-het-avon-pesha', 'agra-criminal-proceedings-exemption' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'probation-service-adults',
		'title'     => 'שירות המבחן למבוגרים',
		'seo_title' => 'שירות המבחן למבוגרים: תסקירים ופיקוח | Jus-Tice',
		'seo_desc'  => 'שירות המבחן למבוגרים במשרד הרווחה: תסקירים לבית המשפט, פיקוח ושיקום, 4 מחוזות ו-25 לשכות בפריסה ארצית.',
		'intro'     => 'שירות המבחן למבוגרים הוא הגוף שמכין את התסקירים לבית המשפט ומפקח על חלופות ענישה ושיקום. הוא מטפל בחשודים, נאשמים ונפגעי עבירה מגיל 18.',
		'facts'     => array(
			array( 'פריסה: 4 מחוזות (חיפה והצפון, תל אביב והמרכז, ירושלים, באר שבע והדרום), 26 נפות ו-25 לשכות', 'https://www.gov.il/he/departments/units/molsa-units-adult-probation-service', 'gov.il' ),
			array( 'התפקידים: אבחון, תסקירים לבית המשפט, פיקוח ושיקום בקהילה', 'https://www.gov.il/he/departments/units/molsa-units-adult-probation-service', 'gov.il' ),
			array( 'מפקח גם על תנאי הסדר מותנה כשנקבע פיקוח קצין מבחן (סעיף 67ג לחוק סדר הדין הפלילי)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'דף שירות המבחן למבוגרים', 'https://www.gov.il/he/departments/units/molsa-units-adult-probation-service' ),
		),
		'related'   => array( 'conditional-arrangement-terms-amounts', 'rehabilitation-prisoner-authority', 'youth-law-trial-punishment' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'onshin-law-1977-structure',
		'title'     => 'חוק העונשין: מבנה וסעיפים מרכזיים',
		'seo_title' => 'חוק העונשין: המבנה והסעיפים שחשוב להכיר | Jus-Tice',
		'seo_desc'  => 'חוק העונשין משנת 1977: חלק מקדמי, כללי ועבירות, סיווג חטא עוון פשע בסעיף 24, הסייגים לאחריות ופיצוי הזיכוי בסעיף 80.',
		'intro'     => 'חוק העונשין משנת 1977 הוא ספר העבירות והעונשים של ישראל: כ-450 סעיפים בשלושה חלקים. אלה הסעיפים שכל מי שנקלע להליך פלילי פוגש.',
		'facts'     => array(
			array( 'המבנה: חלק מקדמי (סעיפים 1 עד 3), חלק כללי (4 עד 40יד) וחלק העבירות (41 עד 387)', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'סעיף 24: סיווג העבירות לפשע, עוון וחטא לפי חומרת העונש', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'הסייגים לאחריות פלילית: הגנה עצמית (34י), הגנת בית מגורים (34י1), זוטי דברים (34יז)', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'סעיף 80: פיצוי והוצאות הגנה לנאשם שזוכה', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק העונשין, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_העונשין' ),
		),
		'related'   => array( 'classification-offenses-het-avon-pesha', 'self-defense-criminal-sayag', 'exoneration-compensation-defense-costs' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'seder-din-plili-law',
		'title'     => 'חוק סדר הדין הפלילי',
		'seo_title' => 'חוק סדר הדין הפלילי: המפה המלאה של ההליך | Jus-Tice',
		'seo_desc'  => 'החוק שמנהל את ההליך הפלילי: התיישנות בסעיף 9, שימוע ב-60א, ערר על סגירה ב-64, הסדר מותנה ב-67א ועיכוב הליכים ב-231.',
		'intro'     => 'חוק סדר הדין הפלילי הוא מפת הדרכים של ההליך כולו: מהחקירה, דרך ההעמדה לדין ועד הערעור. אלה הסעיפים שמסדירים את הצמתים המרכזיים.',
		'facts'     => array(
			array( 'סעיף 9: התיישנות עבירות: פשע 10 שנים, עוון 5 שנים, חטא שנה', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'סעיף 60א: יידוע חשוד בפשע ו-30 ימים לבקשת שימוע', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'סעיף 62: העמדה לדין כשיש ראיות מספיקות ונסיבות מתאימות; סעיף 64: ערר על אי העמדה לדין תוך 60 ימים', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'סעיפים 67א עד 67יא: סגירת תיק בהסדר מותנה; סעיף 74: עיון בחומר; סעיף 85: תוכן כתב האישום', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'סעיפים 231 עד 232: עיכוב הליכים וחידושם, עד 5 שנים בפשע ושנה בעוון', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק סדר הדין הפלילי, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי' ),
		),
		'related'   => array( 'maatzarim-law-1996', 'onshin-law-1977-structure', 'limitation-period-offenses' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'maatzarim-law-1996',
		'title'     => 'חוק המעצרים: כל המספרים',
		'seo_title' => 'חוק המעצרים: כל המועדים והתקרות במקום אחד | Jus-Tice',
		'seo_desc'  => '24 שעות לשופט, הארכות של 15 יום, 30 יום באישור יועמש, 75 יום בעליון, 9 חודשים עד הכרעה ו-180 יום לביטול ערובה.',
		'intro'     => 'חוק סמכויות אכיפה (מעצרים) משנת 1996 הוא שעון העצר של ההליך הפלילי. ריכזנו כאן את כל המספרים שהחוק קובע, עם הסעיפים.',
		'facts'     => array(
			array( 'הבאה בפני שופט: עד 24 שעות (סעיף 29(א)); 48 שעות בעבירות ביטחון (סעיף 30)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'מעצר ימים: הארכות עד 15 יום; מעל 30 יום באישור היועמ"ש; מעל 75 יום רק בשופט עליון (סעיף 17)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'היוועצות בעורך דין: סעיף 34, עם מדרג דחיות עד 48 שעות', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'מעצר עד תום ההליכים: סעיף 21; תקרת 9 חודשים והארכות עליון של 90 או 150 יום', 'https://www.kolzchut.org.il/he/מעצר_עד_תום_ההליכים', 'כל זכות' ),
			array( 'ערר: על החלטת בית משפט תוך 30 ימים; על החלטת קצין ממונה תוך 14 ימים (סעיף 53); ערובה בטלה אחרי 180 יום בלי כתב אישום (סעיף 58)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המעצרים, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)' ),
		),
		'related'   => array( 'days-detention-extension', 'remand-until-proceedings-end', 'erer-remand-decisions' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'takanat-hashavim-law-2019',
		'title'     => 'חוק המידע הפלילי ותקנת השבים',
		'seo_title' => 'חוק המידע הפלילי: התיישנות ומחיקת רישום | Jus-Tice',
		'seo_desc'  => 'החוק שהחליף את חוק המרשם הפלילי: תקופות התיישנות של 4 עד 10 שנים, מחיקה אחריהן, והמבנה הכפול של מרשם פלילי ומשטרתי.',
		'intro'     => 'חוק המידע הפלילי ותקנת השבים נכנס לתוקף ביולי 2022 והחליף את חוק המרשם הפלילי הישן. הוא קובע מתי הרשעה מתיישנת, מתי היא נמחקת, ומי רשאי לראות מה.',
		'facts'     => array(
			array( 'התיישנות לבגירים (סעיף 19): ללא מאסר בפועל 4 שנים; מאסר עד 5 שנים: 7 שנים בתוספת תקופת המאסר; מאסר מעל 5 שנים: 10 שנים בתוספת תקופת המאסר', 'https://www.kolzchut.org.il/he/תקופת_ההתיישנות_ותקופת_המחיקה_של_פרט_במרשם_הפלילי', 'כל זכות' ),
			array( 'תקופת המחיקה נמנית מתום תקופת ההתיישנות (סעיף 21): 7 שנים נוספות, או 10 במאסר מעל 5 שנים', 'https://www.kolzchut.org.il/he/תקופת_ההתיישנות_ותקופת_המחיקה_של_פרט_במרשם_הפלילי', 'כל זכות' ),
			array( 'המבנה הכפול: מרשם פלילי (סעיף 8, הרשעות ועונשים) מול מרשם משטרתי (סעיף 27, תיקים תלויים וסגורים)', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים', 'נוסח החוק' ),
			array( 'זכות עיון עצמי: על גבי מסך בתחנת משטרה (סעיף 4)', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המידע הפלילי ותקנת השבים, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים' ),
			array( 'תקופות התיישנות ומחיקה, כל זכות', 'https://www.kolzchut.org.il/he/תקופת_ההתיישנות_ותקופת_המחיקה_של_פרט_במרשם_הפלילי' ),
		),
		'related'   => array( 'mishtarti-vs-plili-record', 'expunge-closed-cases-record', 'registry-criminal-information-police' ),
		'pillar'    => 'police-records-data-deletion',
	),

	array(
		'slug'      => 'victims-rights-law-2001',
		'title'     => 'חוק זכויות נפגעי עבירה',
		'seo_title' => 'חוק זכויות נפגעי עבירה: כל הזכויות בהליך | Jus-Tice',
		'seo_desc'  => 'זכויות נפגע העבירה: מידע על ההליך, עיון בכתב האישום, הגנה מפני הנאשם, ליווי בחקירה, והבעת עמדה על הסדרי טיעון וחנינה.',
		'intro'     => 'חוק זכויות נפגעי עבירה משנת 2001 העמיד את הנפגע בעמדת שותף להליך: זכות לדעת, זכות להישמע וזכות להגנה. אלה הזכויות המרכזיות.',
		'facts'     => array(
			array( 'זכות למידע על שלבי ההליך (סעיף 8) וזכות לעיין בכתב האישום (סעיף 9)', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה', 'נוסח החוק' ),
			array( 'הגנה מפני קשר עם החשוד (סעיף 6) והגבלת מסירת פרטים אישיים בעבירות מין ואלימות (סעיף 7)', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה', 'נוסח החוק' ),
			array( 'זכות לליווי בחקירה (סעיף 14)', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה', 'נוסח החוק' ),
			array( 'נפגעי עבירות מין ואלימות חמורה: הבעת עמדה על הסדר טיעון (סעיף 17), שחרור מוקדם (סעיף 19) וחנינה (סעיף 20)', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק זכויות נפגעי עבירה, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה' ),
			array( 'פורטל נפגעי עבירה, כל זכות', 'https://www.kolzchut.org.il/he/נפגעי_עבירה' ),
		),
		'related'   => array( 'bargain-plea-agreement', 'objection-closing-case-file', 'pardon-request-president' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'dangerous-drugs-ordinance',
		'title'     => 'פקודת הסמים המסוכנים: עונשים וכמויות',
		'seo_title' => 'פקודת הסמים: העונשים והכמויות בחוק | Jus-Tice',
		'seo_desc'  => 'החזקה לצריכה עצמית עד 3 שנות מאסר, שלא לצריכה עצמית עד 20 שנה, חזקת 15 גרם בקנאביס, ועד 25 שנה בעבירות כלפי קטינים.',
		'intro'     => 'פקודת הסמים המסוכנים היא החוק שקובע את העונשים על החזקה, שימוש וסחר. ההבחנה המרכזית: צריכה עצמית מול כל השאר, והגבול בקנאביס עובר ב-15 גרם.',
		'facts'     => array(
			array( 'החזקה או שימוש שלא לצריכה עצמית: עד 20 שנות מאסר; לצריכה עצמית: עד 3 שנות מאסר (סעיף 7)', 'https://he.wikisource.org/wiki/פקודת_הסמים_המסוכנים', 'נוסח הפקודה' ),
			array( 'חזקת שלא לצריכה עצמית בקנאביס: החזקה מעל 15 גרם (התוספת השנייה)', 'https://he.wikisource.org/wiki/פקודת_הסמים_המסוכנים', 'נוסח הפקודה' ),
			array( 'סחר בסמים: עד 20 שנות מאסר (סעיף 13)', 'https://he.wikisource.org/wiki/פקודת_הסמים_המסוכנים', 'נוסח הפקודה' ),
			array( 'עבירות כלפי קטינים: עד 25 שנות מאסר (סעיף 21)', 'https://he.wikisource.org/wiki/פקודת_הסמים_המסוכנים', 'נוסח הפקודה' ),
		),
		'official'  => array(
			array( 'פקודת הסמים המסוכנים, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הסמים_המסוכנים' ),
		),
		'related'   => array( 'classification-offenses-het-avon-pesha', 'limitation-period-offenses', 'youth-law-trial-punishment' ),
		'pillar'    => 'drug-related-crime',
	),

	array(
		'slug'      => 'youth-law-trial-punishment',
		'title'     => 'חוק הנוער: שפיטה, ענישה ודרכי טיפול',
		'seo_title' => 'חוק הנוער: איך שופטים קטינים בישראל | Jus-Tice',
		'seo_desc'  => 'גיל אחריות פלילית 12, איסור מאסר מתחת לגיל 14, איסור חקירת לילה, זכות לנוכחות הורה, והסכמת יועמש לדין באיחור של שנה.',
		'intro'     => 'קטינים נשפטים לפי כללים נפרדים, שנקבעו בחוק הנוער (שפיטה, ענישה ודרכי טיפול). ההגנות מתחילות כבר בחקירה ונמשכות עד גזר הדין.',
		'facts'     => array(
			array( 'גיל האחריות הפלילית: 12 (סייג הקטינות בסעיף 34ו לחוק העונשין)', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'קטין מתחת לגיל 14 שנעצר יובא בפני שופט תוך 12 שעות לכל היותר (סעיף 10ג)', 'https://he.wikisource.org/wiki/חוק_הנוער_(שפיטה,_ענישה_ודרכי_טיפול)', 'נוסח החוק' ),
			array( 'אין להטיל מאסר על קטין שטרם מלאו לו 14 בשעת גזר הדין (סעיף 25(ד))', 'https://he.wikisource.org/wiki/חוק_הנוער_(שפיטה,_ענישה_ודרכי_טיפול)', 'נוסח החוק' ),
			array( 'איסור חקירת לילה: מתחת לגיל 14 בין 20:00 ל-7:00; בני 14 עד 18 בין 22:00 ל-7:00 (סעיף 9ד)', 'https://he.wikisource.org/wiki/חוק_הנוער_(שפיטה,_ענישה_ודרכי_טיפול)', 'נוסח החוק' ),
			array( 'זכות לנוכחות הורה או קרוב בחקירה (סעיף 9ח); העמדה לדין בחלוף שנה מהמעשה רק בהסכמת היועמ"ש (סעיף 14)', 'https://he.wikisource.org/wiki/חוק_הנוער_(שפיטה,_ענישה_ודרכי_טיפול)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק הנוער, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_הנוער_(שפיטה,_ענישה_ודרכי_טיפול)' ),
		),
		'related'   => array( 'consultation-before-police-questioning', 'probation-service-adults', 'recording-interrogation-documentation' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'wiretapping-law-1979',
		'title'     => 'חוק האזנת סתר',
		'seo_title' => 'חוק האזנת סתר: מתי חוקי ומה העונש | Jus-Tice',
		'seo_desc'  => 'האזנת סתר בלי היתר: עד 5 שנות מאסר. היתר לחקירת פשע רק מנשיא מחוזי לשלושה חודשים, וראיה מהאזנה אסורה פסולה.',
		'intro'     => 'חוק האזנת סתר משנת 1979 מגן על השיחות הפרטיות שלכם: האזנה בלי היתר כדין היא עבירה חמורה, וההיתרים ניתנים רק בצמרת המערכת.',
		'facts'     => array(
			array( 'האזנת סתר ללא היתר כדין: עד 5 שנות מאסר (סעיף 2(א))', 'https://he.wikisource.org/wiki/חוק_האזנת_סתר', 'נוסח החוק' ),
			array( 'היתר לחקירת פשע: נשיא בית משפט מחוזי או סגן שהוסמך; תוקף עד 3 חודשים עם אפשרות חידוש (סעיף 6)', 'https://he.wikisource.org/wiki/חוק_האזנת_סתר', 'נוסח החוק' ),
			array( 'האזנה לביטחון המדינה: היתר ראש הממשלה או שר הביטחון, עד 3 חודשים (סעיף 4)', 'https://he.wikisource.org/wiki/חוק_האזנת_סתר', 'נוסח החוק' ),
			array( 'ראיה שהושגה בהאזנה שלא כדין פסולה, למעט חריגים בעבירות חמורות באישור בית משפט (סעיף 13)', 'https://he.wikisource.org/wiki/חוק_האזנת_סתר', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק האזנת סתר, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_האזנת_סתר' ),
		),
		'related'   => array( 'recording-interrogation-documentation', 'inspection-material-section-74', 'unit-cyber-crime-national' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'ed-medina-state-witness',
		'title'     => 'עד מדינה',
		'seo_title' => 'עד מדינה: ההגדרה בחוק ודרישת הסיוע | Jus-Tice',
		'seo_desc'  => 'עד מדינה הוא שותף לעבירה שמעיד תמורת טובת הנאה. עדותו טעונה סיוע, דרישה ראייתית מוגברת לפי סעיף 54א לפקודת הראיות.',
		'intro'     => 'עד מדינה הוא שותף לעבירה שהפך לעד תביעה תמורת טובת הנאה. דווקא בגלל העסקה הזו, החוק דורש לעדותו חיזוק ראייתי מוגבר.',
		'facts'     => array(
			array( 'ההגדרה: שותף לאותה עבירה המעיד מטעם התביעה לאחר שניתנה או הובטחה לו טובת הנאה (סעיף 54א לפקודת הראיות)', 'https://he.wikisource.org/wiki/פקודת_הראיות', 'נוסח הפקודה' ),
			array( 'עדות שותף רגיל טעונה דבר לחיזוקה; עדות עד מדינה טעונה סיוע, דרישה מוגברת', 'https://he.wikisource.org/wiki/פקודת_הראיות', 'נוסח הפקודה' ),
			array( 'הודאת נאשם קבילה רק אם ניתנה חופשית ומרצון (סעיף 12)', 'https://he.wikisource.org/wiki/פקודת_הראיות', 'נוסח הפקודה' ),
		),
		'official'  => array(
			array( 'פקודת הראיות, הנוסח המלא', 'https://he.wikisource.org/wiki/פקודת_הראיות' ),
		),
		'related'   => array( 'silence-right-interrogation', 'ktav-ishum-contents', 'reimbursement-witnesses-court' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'silence-right-interrogation',
		'title'     => 'זכות השתיקה: בחקירה ובמשפט',
		'seo_title' => 'זכות השתיקה: מה מותר ומה המחיר הראייתי | Jus-Tice',
		'seo_desc'  => 'חשוד רשאי לשתוק לגמרי, עד רק מול שאלות מפלילות. חובת היידוע, וההשלכה: שתיקה עשויה לשמש חיזוק לראיות התביעה.',
		'intro'     => 'זכות השתיקה היא מהיסודות של ההליך הפלילי, אבל יש לה כללים ומחיר. ההבדל בין חשוד לעד, חובת היידוע, והמשמעות הראייתית של השתיקה.',
		'facts'     => array(
			array( 'חשוד רשאי שלא להשיב כלל; עד רשאי לסרב רק לשאלות מפלילות (סעיף 47 לפקודת הראיות)', 'https://www.kolzchut.org.il/he/זכות_השתיקה_במהלך_חקירה', 'כל זכות' ),
			array( 'חובת יידוע החשוד על הזכות: סעיף 28(א) לחוק המעצרים', 'https://www.kolzchut.org.il/he/זכות_השתיקה_במהלך_חקירה', 'כל זכות' ),
			array( 'שתיקת חשוד בחקירה עשויה לשמש חיזוק לראיות התביעה', 'https://www.kolzchut.org.il/he/זכות_השתיקה_במהלך_חקירה', 'כל זכות' ),
			array( 'במשפט: הזכות מוסדרת בסעיפים 161 עד 162 לחוק סדר הדין הפלילי', 'https://www.kolzchut.org.il/he/זכות_השתיקה_במהלך_חקירה', 'כל זכות' ),
		),
		'official'  => array(
			array( 'זכות השתיקה, כל זכות', 'https://www.kolzchut.org.il/he/זכות_השתיקה_במהלך_חקירה' ),
			array( 'חוק המעצרים', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)' ),
		),
		'related'   => array( 'summons-interrogation-warning-rights', 'consultation-before-police-questioning', 'ed-medina-state-witness' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'classification-offenses-het-avon-pesha',
		'title'     => 'חטא, עוון, פשע: סיווג עבירות לפי חומרה',
		'seo_title' => 'חטא, עוון או פשע: מה ההבדל ולמה זה קובע | Jus-Tice',
		'seo_desc'  => 'הסיווג בסעיף 24 לחוק העונשין קובע התיישנות, זכאות להסדר מותנה ומחיקת רישום: פשע מעל 3 שנות מאסר, עוון עד 3, חטא עד 3 חודשים.',
		'intro'     => 'שלוש מילים קטנות שמכריעות הרבה: חטא, עוון ופשע. הסיווג לפי סעיף 24 לחוק העונשין קובע את ההתיישנות, את הזכאות להסדר מותנה ואת גורל הרישום.',
		'facts'     => array(
			array( 'פשע: עונש חמור משלוש שנות מאסר; עוון: מאסר מעל 3 חודשים ועד 3 שנים; חטא: עד 3 חודשים (סעיף 24)', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'הסיווג קובע התיישנות: פשע 10 שנים, עוון 5, חטא שנה (סעיף 9 לחוק סדר הדין הפלילי)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'הסיווג קובע זכאות להסדר מותנה: רק עבירות שעונשן פחות מ-3 שנות מאסר', 'https://www.kolzchut.org.il/he/סגירת_תיק_פלילי_ללא_הגשת_כתב_אישום_באמצעות_הסדר_מותנה', 'כל זכות' ),
			array( 'הסיווג משפיע על מחיקת רישום משטרתי: מחיקה אוטומטית אחרי 7 שנים בעוון ובחטא', 'https://www.kolzchut.org.il/he/ביטול_רישום_משטרתי_של_תיקים_סגורים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק העונשין', 'https://he.wikisource.org/wiki/חוק_העונשין' ),
			array( 'חוק סדר הדין הפלילי', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי' ),
		),
		'related'   => array( 'onshin-law-1977-structure', 'limitation-period-offenses', 'conditional-arrangement-terms-amounts' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'zutei-dvarim-defense',
		'title'     => 'זוטי דברים: הסייג לאחריות פלילית',
		'seo_title' => 'הגנת זוטי דברים: סעיף 34יז לחוק העונשין | Jus-Tice',
		'seo_desc'  => 'זוטי דברים: אין אחריות פלילית על מעשה קל ערך לאור טיבו, נסיבותיו, תוצאותיו והאינטרס הציבורי. איך הסייג עובד בפועל.',
		'intro'     => 'לא כל מעשה שנופל להגדרת עבירה ראוי להליך פלילי. סייג זוטי הדברים בסעיף 34יז לחוק העונשין קובע שמעשה קל ערך אינו מקים אחריות פלילית.',
		'facts'     => array(
			array( 'סעיף 34יז: אין אחריות פלילית אם המעשה קל ערך לאור טיבו, נסיבותיו, תוצאותיו והאינטרס הציבורי', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'זהו סייג מהחלק הכללי של החוק, לצד הגנה עצמית, צורך וכורח', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'העיקרון מוחל גם בשלב התביעה, כשיקול בסגירת תיק בעילת נסיבות העניין', 'https://www.kolzchut.org.il/he/סגירת_תיק_פלילי', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק העונשין, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_העונשין' ),
		),
		'related'   => array( 'self-defense-criminal-sayag', 'classification-offenses-het-avon-pesha', 'objection-closing-case-file' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'self-defense-criminal-sayag',
		'title'     => 'הגנה עצמית בדין הפלילי',
		'seo_title' => 'הגנה עצמית: מתי היא פוטרת מאחריות פלילית | Jus-Tice',
		'seo_desc'  => 'סעיף 34י לחוק העונשין: הדיפה מיידית של תקיפה שלא כדין עם סכנה מוחשית. וסעיף 34י1: הגנת בית המגורים מול מתפרץ.',
		'intro'     => 'הגנה עצמית היא סייג לאחריות פלילית, לא רישיון לאלימות. סעיף 34י לחוק העונשין קובע את התנאים המדויקים, וסעיף 34י1 מוסיף את הגנת בית המגורים.',
		'facts'     => array(
			array( 'סעיף 34י: אין אחריות פלילית למעשה שהיה דרוש באופן מיידי להדוף תקיפה שלא כדין שנשקפה ממנה סכנה מוחשית', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'סעיף 34י1: הגנת בית המגורים: הדיפת מתפרץ לבית מגורים, בית עסק או משק חקלאי בכוונה לבצע עבירה', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
			array( 'הסייגים חלים לצד צורך, כורח וזוטי דברים (סעיפים 34יא עד 34יז)', 'https://he.wikisource.org/wiki/חוק_העונשין', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק העונשין, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_העונשין' ),
		),
		'related'   => array( 'zutei-dvarim-defense', 'onshin-law-1977-structure', 'classification-offenses-het-avon-pesha' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'ktav-ishum-contents',
		'title'     => 'כתב אישום: מה הוא חייב להכיל',
		'seo_title' => 'כתב אישום: התוכן לפי סעיף 85 ומה קורה אחריו | Jus-Tice',
		'seo_desc'  => 'מה חייב להופיע בכתב אישום: העובדות, הוראות החיקוק ועדי התביעה. ומה נפתח אחרי ההגשה: עיון בחומר וזכויות הנפגע.',
		'intro'     => 'כתב האישום הוא המסמך שפותח את המשפט הפלילי, וסעיף 85 לחוק סדר הדין הפלילי קובע בדיוק מה חייב להופיע בו. מרגע הגשתו נפתחות זכויות חדשות לשני הצדדים.',
		'facts'     => array(
			array( 'סעיף 85: שם בית המשפט, המאשים, פרטי הנאשם, תיאור העובדות, הוראות החיקוק ושמות עדי התביעה', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'ההחלטה להעמיד לדין: ראיות מספיקות ונסיבות מתאימות (סעיף 62)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'לאחר ההגשה קמה זכות העיון בחומר החקירה (סעיף 74)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'נפגע העבירה זכאי לעיין בכתב האישום (סעיף 9 לחוק זכויות נפגעי עבירה)', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק סדר הדין הפלילי', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי' ),
			array( 'חוק זכויות נפגעי עבירה', 'https://he.wikisource.org/wiki/חוק_זכויות_נפגעי_עבירה' ),
		),
		'related'   => array( 'shimua-section-60a-deadlines', 'inspection-material-section-74', 'bargain-plea-agreement' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'recording-interrogation-documentation',
		'title'     => 'תיעוד והקלטת חקירה: חובות המשטרה',
		'seo_title' => 'הקלטת חקירה: מתי חובה ומה החריגים | Jus-Tice',
		'seo_desc'  => 'תיעוד חזותי חובה בחקירת חשוד בעבירות שעונשן 10 שנים ומעלה, תיעוד בכתב נאמן מראשית ועד סוף, וחקירה בשפת החשוד.',
		'intro'     => 'חוק חקירת חשודים קובע מה המשטרה חייבת לתעד ואיך. בעבירות החמורות, החקירה חייבת להיות מצולמת, ובכל חקירה התיעוד חייב לשקף את האמת.',
		'facts'     => array(
			array( 'חובת תיעוד חזותי בחקירת חשוד בעבירות שעונשן המרבי 10 שנות מאסר ומעלה (סעיף 7 והתוספת)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(חקירת_חשודים)', 'נוסח החוק' ),
			array( 'חריג הוראת שעה: החובה אינה חלה בעבירות ביטחון, עם החרגות לקטינים ולאנשים עם מוגבלות (סעיף 17)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(חקירת_חשודים)', 'נוסח החוק' ),
			array( 'התיעוד בכתב חייב לשקף נכונה את המתרחש מראשית החקירה ועד סופה (סעיף 4(ב))', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(חקירת_חשודים)', 'נוסח החוק' ),
			array( 'החקירה ותיעודה בשפת החשוד או בשפה שהוא מבין (סעיפים 2 ו-8)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(חקירת_חשודים)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק חקירת חשודים, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(חקירת_חשודים)' ),
		),
		'related'   => array( 'summons-interrogation-warning-rights', 'silence-right-interrogation', 'wiretapping-law-1979' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'limitation-period-offenses',
		'title'     => 'התיישנות עבירות פליליות',
		'seo_title' => 'התיישנות עבירות: שנה, 5, 10 או 30 שנים | Jus-Tice',
		'seo_desc'  => 'אחרי כמה שנים אי אפשר להעמיד לדין: חטא שנה, עוון 5 שנים, פשע 10 שנים, ועבירות שדינן מיתה או מאסר עולם 30 שנים.',
		'intro'     => 'לכל עבירה יש שעון התיישנות, שאחריו אי אפשר עוד להעמיד לדין. סעיף 9 לחוק סדר הדין הפלילי קובע את המדרג, ולעבירות קטינים יש כלל מיוחד.',
		'facts'     => array(
			array( 'סעיף 9: פשע 10 שנים, עוון 5 שנים, חטא שנה', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'עבירות שדינן מיתה או מאסר עולם: 30 שנים', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי', 'נוסח החוק' ),
			array( 'העמדה לדין על עבירת קטין בחלוף שנה: טעונה הסכמת היועץ המשפטי לממשלה (סעיף 14 לחוק הנוער)', 'https://he.wikisource.org/wiki/חוק_הנוער_(שפיטה,_ענישה_ודרכי_טיפול)', 'נוסח החוק' ),
			array( 'התיישנות הרישום הפלילי היא מסלול נפרד, לפי סעיף 19 לחוק המידע הפלילי', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק סדר הדין הפלילי', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי' ),
			array( 'חוק המידע הפלילי ותקנת השבים', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים' ),
		),
		'related'   => array( 'classification-offenses-het-avon-pesha', 'takanat-hashavim-law-2019', 'seder-din-plili-law' ),
		'pillar'    => 'criminal-defense-attorney',
	),

	array(
		'slug'      => 'mishtarti-vs-plili-record',
		'title'     => 'רישום משטרתי מול רישום פלילי: ההבדל',
		'seo_title' => 'רישום משטרתי או פלילי: מה ההבדל ומה נמחק | Jus-Tice',
		'seo_desc'  => 'המרשם הפלילי מכיל הרשעות ועונשים; המרשם המשטרתי תיקים תלויים וסגורים. מה מופיע בתעודה, ומה ניתן לביטול.',
		'intro'     => 'הרבה מבלבלים ביניהם, אבל אלה שני מרשמים שונים בחוק: המרשם הפלילי של ההרשעות, והמרשם המשטרתי של התיקים. להבדל יש משמעות מעשית גדולה.',
		'facts'     => array(
			array( 'המרשם הפלילי (סעיף 8 לחוק המידע הפלילי): הרשעות, עונשים, צווי מבחן וקביעות דין', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים', 'נוסח החוק' ),
			array( 'המרשם המשטרתי (סעיף 27): תיקים תלויים ועומדים, תיקים סגורים וזיכויים', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים', 'נוסח החוק' ),
			array( 'תעודת מידע פלילי מציגה רק פרטים שלא התיישנו או נמחקו, ותיקים תלויים', 'https://www.gov.il/he/departments/general/police_criminal_information_certificates', 'gov.il' ),
			array( 'תיקים סגורים ניתנים לביטול: אוטומטית אחרי 7 שנים בעוון ובחטא, או בבקשה יזומה', 'https://www.kolzchut.org.il/he/ביטול_רישום_משטרתי_של_תיקים_סגורים', 'כל זכות' ),
		),
		'official'  => array(
			array( 'חוק המידע הפלילי ותקנת השבים', 'https://he.wikisource.org/wiki/חוק_המידע_הפלילי_ותקנת_השבים' ),
			array( 'ביטול רישום משטרתי, כל זכות', 'https://www.kolzchut.org.il/he/ביטול_רישום_משטרתי_של_תיקים_סגורים' ),
		),
		'related'   => array( 'takanat-hashavim-law-2019', 'registry-criminal-information-police', 'expunge-closed-cases-record' ),
		'pillar'    => 'police-records-data-deletion',
	),

	array(
		'slug'      => 'erer-remand-decisions',
		'title'     => 'ערר על החלטות מעצר ושחרור',
		'seo_title' => 'ערר על החלטת מעצר: מועדים וערכאות | Jus-Tice',
		'seo_desc'  => 'ערר על החלטת מעצר מוגש לערכאה שמעל תוך 30 ימים; על החלטת קצין ממונה לבית משפט השלום תוך 14 ימים. הדיון בשופט יחיד.',
		'intro'     => 'החלטות מעצר ושחרור אינן סוף פסוק: סעיף 53 לחוק המעצרים קובע מסלול ערר מהיר, עם מועדים שחשוב לא לפספס.',
		'facts'     => array(
			array( 'ערר על החלטת בית משפט בענייני מעצר, שחרור והפרת ערובה: לערכאה שמעל, תוך 30 ימים (סעיף 53)', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'בית המשפט שלערעור רשאי להאריך את המועד מטעמים שיירשמו', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'מי ששוחרר בערובה על ידי קצין ממונה: ערר לבית משפט השלום תוך 14 ימים', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
			array( 'הדיון בערר מתקיים בפני שופט יחיד', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)', 'נוסח החוק' ),
		),
		'official'  => array(
			array( 'חוק המעצרים, הנוסח המלא', 'https://he.wikisource.org/wiki/חוק_סדר_הדין_הפלילי_(סמכויות_אכיפה_-_מעצרים)' ),
		),
		'related'   => array( 'days-detention-extension', 'remand-until-proceedings-end', 'bail-release-conditions' ),
		'pillar'    => 'criminal-defense-attorney',
	),

);
