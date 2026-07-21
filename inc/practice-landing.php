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
		'divorce-lawyer'      => array(
			'term_slug'      => 'family-law',
			'featured_lawyer' => 'advocate-maya-rotenberg',
			'reviewed_by'     => 'עו"ד מאיה רוטנברג',
			'reviewed_by_title'  => 'עורכת דין לענייני משפחה ומגשרת',
			'reviewed_by_sameas' => 'https://rotenberglaw.co.il/',
			'title'          => 'עורך דין גירושין',
			'display_title'  => 'עורך דין גירושין',
			'keyword'        => 'עורך דין גירושין',
			'summary'        => 'איך בוחרים עורך דין גירושין מומלץ: השוואת משרדים, מחירים ושכר טרחה, שאלות לפגישה ראשונה ומדריכי עומק על הסכם גירושין, מזונות ומשמורת.',
			'hide_signals'   => true,
			'show_map'       => true,
			'quick_path'     => array(
				array( 'label' => 'עורך דין גירושין מחיר', 'url' => '/divorce-costs-2025/' ),
				array( 'label' => 'הסכם גירושין', 'url' => '/free-divorce-agreement-template/' ),
				array( 'label' => 'מזונות ילדים', 'url' => '/child-support/' ),
				array( 'label' => 'משמורת ילדים', 'url' => '/child-custody-guide/' ),
				array( 'label' => 'גישור גירושין', 'url' => '/divorce-mediation/' ),
			),
			'practice_scope' => array(
				array( 'label' => 'עורך דין גירושין', 'url' => '/divorce-lawyer/' ),
				array( 'label' => 'הסכם גירושין', 'url' => '/free-divorce-agreement-template/' ),
				array( 'label' => 'עלויות גירושין ושכר טרחה', 'url' => '/divorce-costs-2025/' ),
				array( 'label' => 'מזונות ילדים', 'url' => '/child-support/' ),
				array( 'label' => 'משמורת ילדים', 'url' => '/child-custody-guide/' ),
				array( 'label' => 'גישור גירושין', 'url' => '/divorce-mediation/' ),
				array( 'label' => 'אישור הסכם ברבנות', 'url' => '/rabbinical-agreement-approval/' ),
			),
			'supporting'     => array(
				array( 'label' => 'הסכם גירושין: דוגמה להורדה', 'url' => '/free-divorce-agreement-template/' ),
				array( 'label' => 'כמה עולה גירושין', 'url' => '/divorce-costs-2025/' ),
				array( 'label' => 'מחשבון מזונות ילדים', 'url' => '/child-support/' ),
				array( 'label' => 'משמורת ילדים: המדריך', 'url' => '/child-custody-guide/' ),
				array( 'label' => 'גישור גירושין', 'url' => '/divorce-mediation/' ),
				array( 'label' => 'אישור הסכם גירושין ברבנות', 'url' => '/rabbinical-agreement-approval/' ),
			),
		),
		'criminal-defense-attorney' => array(
			'term_slug'      => 'criminal-law',
			'reviewed_by'    => 'עו"ד בן בטש',
			'title'          => 'עורך דין פלילי',
			'display_title'  => 'עורך דין פלילי',
			'keyword'        => 'עורך דין פלילי',
			'summary'        => 'זומנתם לחקירה, נעצרתם או קיבלתם כתב אישום? כך בוחרים עורך דין פלילי מומלץ: השוואת סנגורים לפי סוג העבירה, שכר טרחה וזמינות למעצר, וכל שלבי ההליך הפלילי צעד אחר צעד.',
			'hide_signals'   => true,
			'show_map'       => true,
			'quick_path'     => array(
				array( 'label' => 'עורך דין פלילי מחירון ושכר טרחה', 'url' => '/criminal-law-price-list-lawyer-recommended-review-costs/' ),
				array( 'label' => 'מעצר וימי מעצר', 'url' => '/detention-days/' ),
				array( 'label' => 'עבירות סמים', 'url' => '/drug-offenses-criminal-lawyer/' ),
				array( 'label' => 'עבירות מין', 'url' => '/sex-crime-lawyer/' ),
				array( 'label' => 'מחיקת רישום פלילי', 'url' => '/criminal-record-expungement/' ),
				array( 'label' => 'תעודת יושר', 'url' => '/apply-for-police-criminal-information-certificates/' ),
			),
			'practice_scope' => array(
				array( 'label' => 'עורך דין פלילי', 'url' => '/criminal-defense-attorney/' ),
				array( 'label' => 'מחירון שכר טרחה', 'url' => '/criminal-law-price-list-lawyer-recommended-review-costs/' ),
				array( 'label' => 'מעצר ימים', 'url' => '/detention-days/' ),
				array( 'label' => 'עבירות סמים', 'url' => '/drug-offenses-criminal-lawyer/' ),
				array( 'label' => 'עבירות מין', 'url' => '/sex-crime-lawyer/' ),
				array( 'label' => 'מחיקת רישום פלילי', 'url' => '/criminal-record-expungement/' ),
				array( 'label' => 'מפת ההליך הפלילי', 'url' => '/criminal-process-map/' ),
			),
			'supporting'     => array(
				array( 'label' => 'מפת ההליך הפלילי: זכויות ומועדים', 'url' => '/criminal-process-map/' ),
				array( 'label' => 'כמה עולה עורך דין פלילי', 'url' => '/criminal-law-price-list-lawyer-recommended-review-costs/' ),
				array( 'label' => 'מחיקת עבר פלילי', 'url' => '/criminal-record-expungement/' ),
				array( 'label' => 'תעודת יושר: המדריך', 'url' => '/apply-for-police-criminal-information-certificates/' ),
				array( 'label' => 'ערעור פלילי', 'url' => '/criminal-appeal/' ),
			),
		),
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
			'term_slug'  => 'inheritance-law',
			'title'      => 'ירושה וצוואות',
			'keyword'    => 'עורך דין ירושה',
			'summary'    => 'מידע על צוואות, ירושות, התנגדות לצוואה, ניהול עיזבון וסכסוכים משפחתיים סביב רכוש.',
			'supporting' => array(
				array( 'label' => 'מהי ירושה', 'url' => '/inheritance/' ),
				array( 'label' => 'צו ירושה', 'url' => '/inheritance-order/' ),
				array( 'label' => 'צוואה', 'url' => '/will-and-testament/' ),
				array( 'label' => 'התנגדות לצוואה', 'url' => '/will-probate-objection/' ),
				array( 'label' => 'צו קיום צוואה', 'url' => '/what-is-a-probate-order/' ),
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
				array( 'label' => 'פגיעות לידה ורשלנות רפואית', 'url' => '/birth-injury/' ),
				array( 'label' => 'רשלנות רפואית בהרדמה', 'url' => '/anesthesia-medical-malpractice/' ),
				array( 'label' => 'רשלנות בניתוח', 'url' => '/surgical-errors-medical-malpractice/' ),
				array( 'label' => 'מהי רשלנות רפואית', 'url' => '/what-is-medical-malpractice-definition-examples/' ),
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

/**
 * Return the normalized public request path for route-level practice guards.
 *
 * @return string
 */
function justice_theme_practice_landing_request_path(): string {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );

	return '/' . trim( $request_path, '/' ) . '/';
}

/**
 * Render the family-law practice hub when another content item owns /family-law/.
 *
 * The CMS currently has a court-judgment content item at this money URL. This
 * render-only guard preserves the URL while preventing the wrong title/H1 from
 * reaching users or Googlebot. It does not edit the database or create a
 * redirect.
 */
function justice_theme_is_family_law_practice_route(): bool {
	return ! is_admin() && '/family-law/' === justice_theme_practice_landing_request_path();
}

/**
 * Render the medical-malpractice commercial hub when the route would otherwise
 * be a 404. The URL is linked internally and appears in GSC data, so recovering
 * it is safer than letting users and Googlebot hit a dead money page.
 */
function justice_theme_is_medical_malpractice_practice_route(): bool {
	return ! is_admin() && '/medical-malpractice-lawyer/' === justice_theme_practice_landing_request_path();
}

/**
 * Recover the high-impression real-estate lawyer guide route when WordPress
 * would otherwise serve it as a 404.
 */
function justice_theme_is_real_estate_lawyer_guide_route(): bool {
	return ! is_admin() && '/real-estate-lawyer-guide/' === justice_theme_practice_landing_request_path();
}

/**
 * Recover the strategic inheritance/wills lawyer route when WordPress would
 * otherwise serve a 404 or noindexed fallback directory page.
 */
function justice_theme_is_inheritance_lawyer_practice_route(): bool {
	return ! is_admin() && '/inheritance-lawyer/' === justice_theme_practice_landing_request_path();
}

/**
 * Mark a controlled practice route as a real 200 response, even when WordPress
 * initially resolved the request as a 404.
 */
function justice_theme_mark_controlled_practice_route_found(): void {
	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404  = false;
		$wp_query->is_page = true;
	}

	status_header( 200 );
}

/**
 * Apply SEO plugin filters for the controlled family-law route.
 */
function justice_theme_prepare_family_law_practice_route_meta(): void {
	$config = justice_theme_get_practice_landing_config( 'family-law' );
	if ( empty( $config ) ) {
		return;
	}

	$title         = 'דיני משפחה וגירושין | עורך דין לענייני משפחה | Jus-Tice';
	$description   = 'מרכז מידע משפטי על דיני משפחה, גירושין, מזונות, משמורת, חלוקת רכוש וסכסוכי משפחה, עם מדריכים מעשיים וחיבור לעורכי דין בתחום.';
	$canonical_url = justice_theme_public_url( home_url( '/family-law/' ) );

	justice_theme_mark_controlled_practice_route_found();

	add_filter(
		'pre_get_document_title',
		static function () use ( $title ): string {
			return $title;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_title',
		static function () use ( $title ): string {
			return $title;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_metadesc',
		static function () use ( $description ): string {
			return $description;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_canonical',
		static function () use ( $canonical_url ): string {
			return $canonical_url;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_robots',
		static function (): string {
			return 'index, follow';
		},
		PHP_INT_MAX
	);
}

/**
 * Apply SEO plugin filters for the controlled medical-malpractice route.
 */
function justice_theme_prepare_medical_malpractice_practice_route_meta(): void {
	$config = justice_theme_get_practice_landing_config( 'medical-malpractice' );
	if ( empty( $config ) ) {
		return;
	}

	$title          = trim( ( $config['title'] ?? '' ) . ' | ' . ( $config['keyword'] ?? '' ) . ' | Jus-Tice' );
	$description    = wp_strip_all_tags( (string) ( $config['summary'] ?? '' ) );
	$canonical_url  = justice_theme_public_url( home_url( '/medical-malpractice-lawyer/' ) );
	$robots_content = 'index, follow';

	justice_theme_mark_controlled_practice_route_found();

	add_filter(
		'pre_get_document_title',
		static function () use ( $title ): string {
			return $title;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_title',
		static function () use ( $title ): string {
			return $title;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_metadesc',
		static function () use ( $description ): string {
			return $description;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_canonical',
		static function () use ( $canonical_url ): string {
			return $canonical_url;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_robots',
		static function () use ( $robots_content ): string {
			return $robots_content;
		},
		PHP_INT_MAX
	);
}

/**
 * Apply SEO plugin filters for the controlled real-estate lawyer guide route.
 */
function justice_theme_prepare_real_estate_lawyer_guide_route_meta(): void {
	$config = justice_theme_get_practice_landing_config( 'real-estate-law' );
	if ( empty( $config ) ) {
		return;
	}

	$title          = 'מדריך עורך דין מקרקעין | קנייה, מכירה ורישום דירה | Jus-Tice';
	$description    = 'מרכז מידע על קנייה ומכירת דירה, חוזי מכר, רישום זכויות, מיסוי מקרקעין, איחור במסירה ובדיקות משפטיות לפני עסקת נדל"ן.';
	$canonical_url  = justice_theme_public_url( home_url( '/real-estate-lawyer-guide/' ) );
	$robots_content = 'index, follow';

	justice_theme_mark_controlled_practice_route_found();

	add_filter(
		'pre_get_document_title',
		static function () use ( $title ): string {
			return $title;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_title',
		static function () use ( $title ): string {
			return $title;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_metadesc',
		static function () use ( $description ): string {
			return $description;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_canonical',
		static function () use ( $canonical_url ): string {
			return $canonical_url;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_robots',
		static function () use ( $robots_content ): string {
			return $robots_content;
		},
		PHP_INT_MAX
	);
}

/**
 * Apply SEO plugin filters for the controlled inheritance/wills lawyer route.
 */
function justice_theme_prepare_inheritance_lawyer_practice_route_meta(): void {
	$config = justice_theme_get_practice_landing_config( 'inheritance' );
	if ( empty( $config ) ) {
		return;
	}

	$title          = 'עורך דין ירושה וצוואות | צו ירושה, צוואה והתנגדות לצוואה | Jus-Tice';
	$description    = 'מרכז מידע על צוואות, ירושות, צו ירושה, צו קיום צוואה, התנגדות לצוואה וניהול עיזבון, עם חיבור לעורכי דין בתחום ירושה וצוואות.';
	$canonical_url  = justice_theme_public_url( home_url( '/inheritance-lawyer/' ) );
	$robots_content = 'index, follow';

	justice_theme_mark_controlled_practice_route_found();

	add_filter(
		'pre_get_document_title',
		static function () use ( $title ): string {
			return $title;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_title',
		static function () use ( $title ): string {
			return $title;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_metadesc',
		static function () use ( $description ): string {
			return $description;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_canonical',
		static function () use ( $canonical_url ): string {
			return $canonical_url;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_robots',
		static function () use ( $robots_content ): string {
			return $robots_content;
		},
		PHP_INT_MAX
	);
}

/**
 * Prepare metadata early for the family-law route.
 */
function justice_theme_maybe_prepare_family_law_practice_route(): void {
	if ( justice_theme_is_family_law_practice_route() ) {
		justice_theme_prepare_family_law_practice_route_meta();
	}

	if ( justice_theme_is_medical_malpractice_practice_route() ) {
		justice_theme_prepare_medical_malpractice_practice_route_meta();
	}

	if ( justice_theme_is_real_estate_lawyer_guide_route() ) {
		justice_theme_prepare_real_estate_lawyer_guide_route_meta();
	}

	if ( justice_theme_is_inheritance_lawyer_practice_route() ) {
		justice_theme_prepare_inheritance_lawyer_practice_route_meta();
	}
}
add_action( 'template_redirect', 'justice_theme_maybe_prepare_family_law_practice_route', -3500 );

/**
 * Page-based pillars: expose the config practice scope to the header
 * topics bar before get_header() runs.
 */
function justice_theme_set_practice_scope_for_pages(): void {
	if ( is_admin() ) {
		return;
	}
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post || 'page' !== $post->post_type ) {
		return;
	}
	$config = justice_theme_get_practice_landing_config( $post->post_name );
	if ( is_array( $config ) && ! empty( $config['practice_scope'] ) ) {
		$GLOBALS['justice_practice_scope'] = array_map(
			function ( $item ) {
				return array( 'label' => $item['label'], 'url' => home_url( $item['url'] ) );
			},
			$config['practice_scope']
		);
	}
}
add_action( 'template_redirect', 'justice_theme_set_practice_scope_for_pages', -3400 );

/**
 * Get the controlled practice-route template for the current request.
 *
 * @return string
 */
function justice_theme_get_controlled_practice_route_template(): string {
	if ( justice_theme_is_family_law_practice_route() ) {
		$practice_template = locate_template( 'practice-family-law-route.php' );
		return $practice_template ?: '';
	}

	if ( justice_theme_is_medical_malpractice_practice_route() ) {
		$practice_template = locate_template( 'practice-medical-malpractice-route.php' );
		return $practice_template ?: '';
	}

	if ( justice_theme_is_real_estate_lawyer_guide_route() ) {
		$practice_template = locate_template( 'practice-real-estate-guide-route.php' );
		return $practice_template ?: '';
	}

	if ( justice_theme_is_inheritance_lawyer_practice_route() ) {
		$practice_template = locate_template( 'practice-inheritance-lawyer-route.php' );
		return $practice_template ?: '';
	}

	return '';
}

/**
 * Render controlled practice routes before later redirect plugins can run.
 */
function justice_theme_render_controlled_practice_route_before_redirect_plugins(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}

	$practice_template = justice_theme_get_controlled_practice_route_template();

	if ( '' === $practice_template ) {
		return;
	}

	if ( ! headers_sent() ) {
		header( 'X-Justice-Route-Guard: controlled-practice-early-render', true );
	}

	include $practice_template;
	exit;
}
add_action( 'template_redirect', 'justice_theme_render_controlled_practice_route_before_redirect_plugins', -999999 );

/**
 * Use the controlled practice template for /family-law/ even if a post owns it.
 *
 * @param string $template Template path selected by WordPress.
 * @return string
 */
function justice_theme_use_family_law_practice_template( string $template ): string {
	$practice_template = justice_theme_get_controlled_practice_route_template();

	if ( '' !== $practice_template ) {
		return $practice_template;
	}

	return $template;
}
add_filter( 'template_include', 'justice_theme_use_family_law_practice_template', -3500 );


/**
 * Flag-proof template routing for practice-landing pages.
 *
 * An early ops-side query clobbers the main query flags on some money URLs
 * (measured live: queried object = page 7274 while is_page=false and
 * is_single=true), so the core loader skips page.php and serves single.php.
 * Route by the QUERIED OBJECT, never by the corrupted flags.
 */
function justice_theme_force_practice_landing_template( $template ) {
	$q = get_queried_object();
	if ( ! $q instanceof WP_Post || 'page' !== $q->post_type ) {
		return $template;
	}
	if ( null === justice_theme_get_practice_landing_config( $q->post_name ) ) {
		return $template;
	}
	$page_template = locate_template( 'page.php' );
	return $page_template ?: $template;
}
add_filter( 'template_include', 'justice_theme_force_practice_landing_template', 9999999 );
