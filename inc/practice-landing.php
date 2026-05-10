<?php
/**
 * Practice landing-page helpers for English slug pages.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return controlled configuration for public English practice slugs.
 *
 * @param string $slug Page or route slug.
 * @return array|null
 */
function justice_theme_get_practice_landing_config( string $slug ): ?array {
	$slug = sanitize_title( $slug );

	$configs = array(
		'family-law'          => array(
			'term_slug'       => 'family-law',
			'title'           => 'דיני משפחה וגירושין',
			'keyword'         => 'עורך דין לענייני משפחה',
			'summary'         => 'מרכז מידע למשפחה, גירושין, הסכמים, ילדים, מזונות, חלוקת רכוש וסכסוכי משפחה. המטרה היא לעזור להבין את המסלול, להתכונן נכון ולפנות לעורכת דין מתאימה כאשר צריך ליווי אישי.',
			'featured_lawyer' => 'advocate-maya-rotenberg',
			'supporting'      => array(
				array( 'label' => 'עורך דין גירושין', 'url' => '/divorce-lawyer/' ),
				array( 'label' => 'גירושין בהסכמה', 'url' => '/consensual-divorce/' ),
				array( 'label' => 'גישור גירושין', 'url' => '/divorce-mediation/' ),
				array( 'label' => 'מזונות ילדים', 'url' => '/child-support/' ),
				array( 'label' => 'משמורת וזמני שהות', 'url' => '/child-custody/' ),
				array( 'label' => 'חלוקת רכוש בגירושין', 'url' => '/divorce-property-division/' ),
				array( 'label' => 'יישוב סכסוך במשפחה', 'url' => '/family-dispute-resolution/' ),
			),
		),
		'criminal-law'        => array(
			'term_slug'  => 'criminal-law',
			'title'      => 'משפט פלילי',
			'keyword'    => 'עורך דין פלילי',
			'summary'    => 'מידע ראשוני על חקירות, מעצרים, כתבי אישום, זכויות חשוד וניהול סיכונים לפני פנייה לעורך דין פלילי.',
			'supporting' => array(
				array( 'label' => 'חקירה במשטרה', 'url' => '/police-investigation/' ),
				array( 'label' => 'כתב אישום', 'url' => '/indictment/' ),
				array( 'label' => 'מעצר ימים', 'url' => '/pretrial-detention/' ),
				array( 'label' => 'עבירות סמים', 'url' => '/drug-offenses/' ),
			),
		),
		'traffic-law'         => array(
			'term_slug'  => 'traffic-law',
			'title'      => 'דיני תעבורה',
			'keyword'    => 'עורך דין תעבורה',
			'summary'    => 'מרכז מידע על דוחות, נקודות, שלילת רישיון, נהיגה בשכרות, תאונות דרכים והיערכות לפני טיפול משפטי.',
			'supporting' => array(
				array( 'label' => 'נהיגה בשכרות', 'url' => '/drunk-driving/' ),
				array( 'label' => 'שלילת רישיון', 'url' => '/license-suspension/' ),
				array( 'label' => 'תאונת דרכים', 'url' => '/car-accident-lawyer/' ),
			),
		),
		'real-estate-law'     => array(
			'term_slug'  => 'real-estate-law',
			'title'      => 'מקרקעין ונדל"ן',
			'keyword'    => 'עורך דין מקרקעין',
			'summary'    => 'מידע על עסקאות נדל"ן, חוזי מכר, רישום בטאבו, ליקויי בנייה, התחדשות עירונית ובדיקות לפני חתימה.',
			'supporting' => array(
				array( 'label' => 'קניית דירה', 'url' => '/buying-apartment/' ),
				array( 'label' => 'חוזה מכר', 'url' => '/real-estate-purchase-agreement/' ),
				array( 'label' => 'רישום בטאבו', 'url' => '/land-registry/' ),
				array( 'label' => 'ליקויי בנייה', 'url' => '/construction-defects/' ),
			),
		),
		'labor-law'           => array(
			'term_slug'  => 'labor-law',
			'title'      => 'דיני עבודה',
			'keyword'    => 'עורך דין עבודה',
			'summary'    => 'מידע לעובדים ומעסיקים על פיטורים, זכויות עובדים, שכר, הסכמים, שימוע וסכסוכי עבודה.',
			'supporting' => array(),
		),
		'inheritance'         => array(
			'term_slug'  => 'inheritance',
			'title'      => 'ירושה וצוואות',
			'keyword'    => 'עורך דין ירושה',
			'summary'    => 'מידע על צוואות, ירושות, התנגדות לצוואה, ניהול עיזבון וסכסוכים משפחתיים סביב רכוש.',
			'supporting' => array(
				array( 'label' => 'צוואה', 'url' => '/will/' ),
				array( 'label' => 'התנגדות לצוואה', 'url' => '/will-contest/' ),
			),
		),
		'torts'               => array(
			'term_slug'  => 'torts',
			'title'      => 'נזיקין',
			'keyword'    => 'עורך דין נזיקין',
			'summary'    => 'מידע על נזקי גוף, תאונות, אחריות, פיצויים, איסוף מסמכים ובדיקת היתכנות לפני תביעה.',
			'supporting' => array(
				array( 'label' => 'תאונת עבודה', 'url' => '/work-accident-lawyer/' ),
			),
		),
		'medical-malpractice' => array(
			'term_slug'  => 'medical-malpractice',
			'title'      => 'רשלנות רפואית',
			'keyword'    => 'עורך דין רשלנות רפואית',
			'summary'    => 'מידע על בדיקת רשלנות רפואית, חוות דעת, מסמכים רפואיים, נזק, קשר סיבתי וסיכוני תביעה.',
			'supporting' => array(
				array( 'label' => 'רשלנות רפואית בהריון', 'url' => '/pregnancy-malpractice/' ),
				array( 'label' => 'רשלנות רפואית בלידה', 'url' => '/birth-malpractice/' ),
			),
		),
		'national-insurance'  => array(
			'term_slug'  => 'national-insurance',
			'title'      => 'ביטוח לאומי',
			'keyword'    => 'עורך דין ביטוח לאומי',
			'summary'    => 'מידע על קצבאות, ועדות רפואיות, נכות, תאונות עבודה, ערעורים והכנת מסמכים לביטוח לאומי.',
			'supporting' => array(),
		),
	);

	return $configs[ $slug ] ?? null;
}

/**
 * Determine whether a generic page should render as a practice landing page.
 *
 * @param WP_Post|null $post Post object.
 * @return bool
 */
function justice_theme_is_practice_landing_page( ?WP_Post $post ): bool {
	if ( ! $post instanceof WP_Post || 'page' !== $post->post_type ) {
		return false;
	}

	return null !== justice_theme_get_practice_landing_config( $post->post_name );
}
