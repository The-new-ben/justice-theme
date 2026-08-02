<?php
/**
 * Comparison-intent presentation bridge for the existing family-lawyer list.
 *
 * The stored WordPress record and URL remain untouched. On the one allowlisted
 * public route, unsupported legacy prose is replaced at render time by a
 * source-linked, fact-only comparison. This keeps rollback immediate and does
 * not mutate the database, candidate profiles or any other URL.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return the one immutable public contract owned by this bridge.
 *
 * @return array<string,string>
 */
function justice_ops_comparison_content_contract(): array {
	return array(
		'path'        => '/the-recommended-family-lawyers/',
		'h1'          => 'השוואת עורכי דין לענייני משפחה וגירושין לפי נתונים',
		'seo_title'   => 'השוואת עורכי דין לענייני משפחה לפי נתונים | Jus-Tice',
		'description' => 'השוואת עורכי דין לענייני משפחה וגירושין לפי רישום פעיל, תחומי עיסוק, מיקום ומועד קבלה, עם מתודולוגיה, מקורות והסבר על אופן הצגת הכרטיסים.',
		'canonical'   => 'https://jus-tice.co.il/the-recommended-family-lawyers/',
	);
}

/**
 * Return the normalized request path.
 */
function justice_ops_comparison_request_path(): string {
	$path = (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
	$path = '/' . trim( $path, '/' ) . '/';

	return '//' === $path ? '/' : $path;
}

/**
 * Restrict every change in this module to the exact preserved URL.
 */
function justice_ops_comparison_is_target(): bool {
	$contract = justice_ops_comparison_content_contract();

	return $contract['path'] === justice_ops_comparison_request_path();
}

/**
 * Let operations retire this presentation bridge without changing content.
 */
function justice_ops_comparison_bridge_enabled(): bool {
	$enabled = true;

	if ( function_exists( 'get_option' ) ) {
		$enabled = '0' !== (string) get_option( 'justice_ops_comparison_content_reset_enabled', '1' );
	}

	return (bool) apply_filters( 'justice_ops_comparison_content_reset_enabled', $enabled );
}

/**
 * Require the already-reviewed exact-HTML helpers before changing this page.
 * The Maya profile module is loaded immediately before this module by the
 * plugin bootstrap. If that invariant changes, the comparison bridge fails
 * closed instead of leaving a title/body/schema split.
 */
function justice_ops_comparison_schema_helpers_available(): bool {
	return function_exists( 'justice_ops_maya_profile_release_remove_json_ld_scripts' )
		&& function_exists( 'justice_ops_maya_profile_release_strip_body_structured_attributes' );
}

/**
 * Register final metadata filters after theme and legacy title modules.
 */
function justice_ops_install_comparison_metadata_filters(): void {
	if (
		! justice_ops_comparison_bridge_enabled()
		|| ! justice_ops_comparison_is_target()
		|| ! justice_ops_comparison_schema_helpers_available()
	) {
		return;
	}

	add_filter( 'pre_get_document_title', 'justice_ops_comparison_title', PHP_INT_MAX );
	add_filter( 'wpseo_title', 'justice_ops_comparison_title', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_title', 'justice_ops_comparison_title', PHP_INT_MAX );
	add_filter( 'wpseo_twitter_title', 'justice_ops_comparison_title', PHP_INT_MAX );
	add_filter( 'aioseo_title', 'justice_ops_comparison_title', PHP_INT_MAX );
	add_filter( 'wpseo_metadesc', 'justice_ops_comparison_description', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_desc', 'justice_ops_comparison_description', PHP_INT_MAX );
	add_filter( 'wpseo_twitter_description', 'justice_ops_comparison_description', PHP_INT_MAX );
	add_filter( 'aioseo_description', 'justice_ops_comparison_description', PHP_INT_MAX );
	add_filter( 'wpseo_canonical', 'justice_ops_comparison_canonical', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_url', 'justice_ops_comparison_canonical', PHP_INT_MAX );
}
add_action( 'get_header', 'justice_ops_install_comparison_metadata_filters', PHP_INT_MAX );

/**
 * Return the comparison-specific SEO title.
 *
 * @param mixed $title Existing title.
 */
function justice_ops_comparison_title( $title ): string {
	return justice_ops_comparison_is_target()
		? justice_ops_comparison_content_contract()['seo_title']
		: (string) $title;
}

/**
 * Return the comparison-specific description.
 *
 * @param mixed $description Existing description.
 */
function justice_ops_comparison_description( $description ): string {
	return justice_ops_comparison_is_target()
		? justice_ops_comparison_content_contract()['description']
		: (string) $description;
}

/**
 * Keep the preserved URL self-canonical.
 *
 * @param mixed $canonical Existing canonical.
 */
function justice_ops_comparison_canonical( $canonical ): string {
	return justice_ops_comparison_is_target()
		? justice_ops_comparison_content_contract()['canonical']
		: (string) $canonical;
}

/**
 * Return the complete and deliberately narrow structured-data contract.
 * Candidate names are not emitted as ItemList entries because this release
 * does not claim a quality rank or recommendation score.
 *
 * @return array<string,mixed>
 */
function justice_ops_comparison_schema(): array {
	$contract = justice_ops_comparison_content_contract();

	return array(
		'@context' => 'https://schema.org',
		'@graph'   => array(
			array(
				'@type'       => 'WebPage',
				'@id'         => $contract['canonical'] . '#webpage',
				'url'         => $contract['canonical'],
				'name'        => $contract['h1'],
				'description' => $contract['description'],
				'inLanguage'  => 'he-IL',
			),
			array(
				'@type'           => 'BreadcrumbList',
				'@id'             => $contract['canonical'] . '#breadcrumb',
				'itemListElement' => array(
					array(
						'@type'    => 'ListItem',
						'position' => 1,
						'name'     => 'Jus-Tice',
						'item'     => 'https://jus-tice.co.il/',
					),
					array(
						'@type'    => 'ListItem',
						'position' => 2,
						'name'     => 'דיני משפחה',
						'item'     => 'https://jus-tice.co.il/family-law/',
					),
					array(
						'@type'    => 'ListItem',
						'position' => 3,
						'name'     => $contract['h1'],
						'item'     => $contract['canonical'],
					),
				),
			),
		),
	);
}

/**
 * Remove every legacy JSON-LD graph and insert the one controlled graph.
 */
function justice_ops_comparison_control_schema( string $html ): string {
	if ( ! justice_ops_comparison_schema_helpers_available() ) {
		return $html;
	}

	$clean   = justice_ops_maya_profile_release_remove_json_ld_scripts( $html );
	$options = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
	$json    = function_exists( 'wp_json_encode' )
		? wp_json_encode( justice_ops_comparison_schema(), $options )
		: json_encode( justice_ops_comparison_schema(), $options );

	if ( ! is_string( $json ) || '' === $json ) {
		return $clean;
	}

	$script = '<script type="application/ld+json" id="justice-family-comparison-schema">' . $json . '</script>';
	if ( false !== stripos( $clean, '</head>' ) ) {
		$inserted = preg_replace( '#</head>#i', $script . '</head>', $clean, 1 );
		return is_string( $inserted ) ? $inserted : $clean;
	}

	if ( false !== stripos( $clean, '<body' ) ) {
		$inserted = preg_replace( '#<body\b#i', $script . '<body', $clean, 1 );
		return is_string( $inserted ) ? $inserted : $clean;
	}

	return $clean;
}

/**
 * Return the bounded CSS for the fact-only comparison.
 */
function justice_ops_comparison_styles(): string {
	return '.jt-comparison-reset{color:#17324d}'
		. '.jt-comparison-intro{margin:0 0 2rem;padding:clamp(1.15rem,2.5vw,1.75rem);border:1px solid rgba(18,57,92,.16);border-radius:16px;background:#f7fafc;color:#17324d}'
		. '.jt-comparison-intro>p:first-child{margin-top:0;font-size:1.08rem;line-height:1.8}'
		. '.jt-comparison-disclosure{margin:1.1rem 0;padding:1rem 1.15rem;border-inline-start:4px solid #b36b00;background:#fff8e8;border-radius:10px;line-height:1.75}'
		. '.jt-comparison-role-links{margin-top:1.1rem;padding-top:1rem;border-top:1px solid rgba(18,57,92,.12)}'
		. '.jt-comparison-role-links strong{display:block;margin-bottom:.45rem}'
		. '.jt-comparison-role-links ul{margin:.25rem 0 0;padding-inline-start:1.2rem}'
		. '.jt-comparison-role-links li{margin:.35rem 0}'
		. '.jt-comparison-method{margin:2rem 0;padding:1.25rem 1.4rem;border:1px solid rgba(18,57,92,.14);border-radius:14px;background:#fff}'
		. '.jt-comparison-method h2{margin-top:0}'
		. '.jt-comparison-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:1rem;margin:1.25rem 0 2.5rem}'
		. '.jt-comparison-card{padding:1.2rem;border:1px solid rgba(18,57,92,.17);border-radius:14px;background:#fff;box-shadow:0 8px 24px rgba(18,57,92,.06)}'
		. '.jt-comparison-card h3{margin:.1rem 0 .8rem;font-size:1.25rem}'
		. '.jt-comparison-card__alias{display:block;margin-top:.25rem;font-size:.9rem;font-weight:500;color:#53697d}'
		. '.jt-comparison-card dl{display:grid;grid-template-columns:minmax(6.5rem,.42fr) 1fr;gap:.55rem .75rem;margin:0}'
		. '.jt-comparison-card dt{font-weight:800}'
		. '.jt-comparison-card dd{margin:0;min-width:0}'
		. '.jt-comparison-use{margin:2rem 0}'
		. '.jt-comparison-editorial{margin:3rem 0 1.5rem;padding:1.25rem 1.4rem;border:1px solid rgba(18,57,92,.14);border-radius:14px;background:#f8fafc}'
		. '.jt-comparison-editorial h2{margin-top:0;font-size:1.35rem}'
		. '.jt-comparison-editorial p:last-child{margin-bottom:0}'
		. '@media(max-width:640px){.jt-comparison-card dl{grid-template-columns:1fr}.jt-comparison-card dt{margin-top:.35rem}}';
}

/**
 * Attach styles only on the allowlisted page.
 */
function justice_ops_comparison_enqueue_styles(): void {
	if (
		! justice_ops_comparison_bridge_enabled()
		|| ! justice_ops_comparison_is_target()
		|| ! justice_ops_comparison_schema_helpers_available()
	) {
		return;
	}

	wp_add_inline_style( 'justice-ops-relevance', justice_ops_comparison_styles() );
}
add_action( 'wp_enqueue_scripts', 'justice_ops_comparison_enqueue_styles', 70 );

/**
 * Return the verified candidate facts in deterministic surname order.
 *
 * @return array<int,array<string,mixed>>
 */
function justice_ops_comparison_candidates(): array {
	return array(
		array(
			'id'         => 'C015',
			'name'       => 'שירלי-עמנואל אלמוג',
			'alias'      => 'שירלי אלמוג',
			'status'     => 'נמצאה התאמה פעילה לפי השם הרשמי והשם הציבורי.',
			'admission'  => '15 בדצמבר 2013',
			'practice'   => 'מעמד אישי ודיני משפחה; ירושות, צוואות ועיזבונות; גישור ופישור; ייצוג והופעה בבתי משפט',
			'office'     => 'ערד, ניגונים 54',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=W38BjpS3LTM',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C004',
			'name'       => 'יעקב בלס',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק.',
			'admission'  => '28 בנובמבר 1996',
			'practice'   => 'מעמד אישי ודיני משפחה; הוצאה לפועל; משפט פלילי',
			'office'     => 'חולון, אוסישקין מנחם 13',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=76e6y1dWvI4',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C003',
			'name'       => 'תבור גולדמן',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק.',
			'admission'  => '10 ביוני 2004',
			'practice'   => 'מעמד אישי ודיני משפחה; מקרקעין ונדל״ן; ירושות, צוואות ועיזבונות; גישור ופישור',
			'office'     => 'קריית טבעון, יצחק שדה 54א',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=2e9M5qWRwXQ',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C012',
			'name'       => 'מרדכי גרטל',
			'alias'      => 'מוטי גרטל',
			'status'     => 'נמצאה התאמה פעילה בין השם הרשמי לשם הציבורי לפי המשרד ותחומי העיסוק.',
			'admission'  => '20 ביוני 1996',
			'practice'   => 'מעמד אישי ודיני משפחה; מקרקעין ונדל״ן; ירושות, צוואות ועיזבונות; ייצוג והופעה בבתי משפט',
			'office'     => 'פתח תקווה, דרך יצחק רבין 2, קומה 17',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=dyKN79CVf9g',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C016',
			'name'       => 'חגית הלוי',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק לאחר הבחנה בין שמות דומים.',
			'admission'  => '15 ביוני 2009',
			'practice'   => 'כינוסים, פירוקים ופשיטת רגל; מעמד אישי ודיני משפחה; ירושות, צוואות ועיזבונות; ייצוג והופעה בבתי משפט',
			'office'     => 'ראשון לציון, עולי הגרדום 50/16',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=3%2Fctz58X%2FT8',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C006',
			'name'       => 'עודד וולף',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק.',
			'admission'  => '12 ביולי 2020',
			'practice'   => 'דיני עבודה; מעמד אישי ודיני משפחה; ירושות, צוואות ועיזבונות; ליטיגציה',
			'office'     => 'נס ציונה, מתחם יובלים, רחוב פרופ׳ אב 19',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=P%2BYxXR4z7K4',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C013',
			'name'       => 'שירי טל',
			'alias'      => '',
			'status'     => 'נמצאו שני כרטיסים פעילים בשם זהה. הכרטיס בחיפה הותאם לפי המשרד, התחום ומועד הקבלה.',
			'admission'  => '10 בפברואר 2022',
			'practice'   => 'מעמד אישי ודיני משפחה; פרסום ויחסי ציבור; כללי; ייצוג והופעה בבתי משפט',
			'office'     => 'חיפה, פלים 2',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=QSXUo1uLen8',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C009',
			'name'       => 'אלינור ליבוביץ',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק.',
			'admission'  => '30 בנובמבר 1987',
			'practice'   => 'מעמד אישי ודיני משפחה; ירושות, צוואות ועיזבונות; גישור ופישור; ייצוג והופעה בבתי משפט',
			'office'     => 'רמת גן, דרך בגין מנחם 11, מגדל רוגובין תדהר',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=LoGm%2BJ7XNeQ',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C002',
			'name'       => 'מיכל מוזס',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק.',
			'admission'  => '20 ביוני 1996',
			'practice'   => 'מעמד אישי ודיני משפחה; משפט אזרחי; מקרקעין ונדל״ן; ייצוג והופעה בבתי משפט',
			'office'     => 'תל אביב יפו, ויצמן 4',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=IvNGHfYodUc',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C017',
			'name'       => 'רמי רובין',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק.',
			'admission'  => '30 בנובמבר 1990',
			'practice'   => 'מעמד אישי ודיני משפחה; מקרקעין ונדל״ן; ירושות, צוואות ועיזבונות; ייצוג והופעה בבתי משפט',
			'office'     => 'ראשון לציון, לוי משה 11',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=IDse8EQ1FnA',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C001',
			'name'       => 'מאיה רוטנברג',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק.',
			'admission'  => '29 בנובמבר 2001',
			'practice'   => 'מעמד אישי ודיני משפחה; גישור ופישור',
			'office'     => 'תל אביב יפו, ולנברג ראול 18',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=XqzAMTJMiiE',
			'checked'    => '2 באוגוסט 2026',
		),
		array(
			'id'         => 'C014',
			'name'       => 'קרני שלו',
			'alias'      => '',
			'status'     => 'נמצאה התאמה פעילה בשם המדויק.',
			'admission'  => '2 בספטמבר 2009',
			'practice'   => 'חוזים; מעמד אישי ודיני משפחה; ירושות, צוואות ועיזבונות',
			'office'     => 'רמת גן, רמבה אייזיק 11',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=2GqavUNyGJY',
			'checked'    => '1 באוגוסט 2026',
		),
		array(
			'id'         => 'C007',
			'name'       => 'ענבר שמואלי',
			'alias'      => 'ענבר שמואלי אבואב',
			'status'     => 'נמצאה התאמה פעילה בין השם הרשמי לשם הציבורי לפי המשרד ותחומי העיסוק.',
			'admission'  => '15 ביוני 2005',
			'practice'   => 'מעמד אישי ודיני משפחה; מיסוי מקרקעין; מקרקעין ונדל״ן',
			'office'     => 'הוד השרון, סוקולוב 46, משרד 1014',
			'source'     => 'https://www.israelbar.biz/lawyer-fd/?lawyer=SBpBl0HTsFA',
			'checked'    => '1 באוגוסט 2026',
		),
	);
}

/**
 * Render one fact-only candidate card.
 *
 * @param array<string,mixed> $candidate Candidate record.
 */
function justice_ops_comparison_candidate_html( array $candidate ): string {
	$alias = '' !== (string) $candidate['alias']
		? '<span class="jt-comparison-card__alias">שם ציבורי נוסף: ' . esc_html( (string) $candidate['alias'] ) . '</span>'
		: '';

	return '<article class="jt-comparison-card" data-jt-candidate="' . esc_attr( (string) $candidate['id'] ) . '">'
		. '<h3>' . esc_html( (string) $candidate['name'] ) . $alias . '</h3><dl>'
		. '<dt>מעמד במקור</dt><dd>' . esc_html( (string) $candidate['status'] ) . '</dd>'
		. '<dt>מועד קבלה</dt><dd>' . esc_html( (string) $candidate['admission'] ) . '</dd>'
		. '<dt>תחומים בכרטיס</dt><dd>' . esc_html( (string) $candidate['practice'] ) . '</dd>'
		. '<dt>מען משרד</dt><dd>' . esc_html( (string) $candidate['office'] ) . '</dd>'
		. '<dt>מקור ובדיקה</dt><dd><a href="' . esc_url( (string) $candidate['source'] ) . '" rel="noopener noreferrer" target="_blank">כרטיס לשכת עורכי הדין</a>, נבדק ' . esc_html( (string) $candidate['checked'] ) . '</dd>'
		. '</dl></article>';
}

/**
 * Return the complete neutral public comparison body.
 */
function justice_ops_comparison_public_content_html(): string {
	$cards = '';
	foreach ( justice_ops_comparison_candidates() as $candidate ) {
		$cards .= justice_ops_comparison_candidate_html( $candidate );
	}

	return '<div class="jt-comparison-reset" data-jt-comparison-content="2026-08-02-r3">'
		. '<section class="jt-comparison-intro" aria-label="היקף ההשוואה והבהרת נראות"><p>מי שמחפש <strong>עורכי דין מומלצים לענייני משפחה</strong> או עורך דין גירושין צריך להשוות עובדות ולא סיסמאות. בעמוד הזה מוצגים נתונים מן הכרטיסים הציבוריים של לשכת עורכי הדין: התאמת זהות, מעמד פעיל, מועד קבלה, תחומי עיסוק ומען משרד. ההופעה אינה ציון איכות, הבטחת תוצאה או תחליף לבדיקת התאמה לתיק.</p>'
		. '<div class="jt-comparison-disclosure" data-jt-comparison-disclosure="visibility-policy" role="note"><strong>הבהרת נראות:</strong> ההופעה והיקף החשיפה בעמוד עשויים להיות מושפעים משיקולים מסחריים ועריכתיים של Jus-Tice. הכרטיסים המוצגים כאן מסודרים לפי שם המשפחה הרשמי בעברית, והסדר אינו דירוג מקצועי. אין להסיק מהופעה או מנראות המלצה, עצמאות מסחרית, היעדר קשר מסחרי או הבטחת התאמה. הנתונים העובדתיים נבדקו לפי המקורות המפורטים בכל כרטיס.</div>'
		. '<nav class="jt-comparison-role-links" aria-label="מדריכים משלימים לפי מטרת החיפוש"><strong>בחרו את העמוד שמתאים לשאלה:</strong><ul>'
		. '<li><a href="https://jus-tice.co.il/divorce-lawyer/">מתי צריך עורך דין גירושין ומה לבדוק בייצוג</a></li>'
		. '<li><a href="https://jus-tice.co.il/experienced-family-law-attorney/">בדיקות ושאלות לפני פגישת ייעוץ</a></li>'
		. '<li><a href="https://jus-tice.co.il/family-law/">איתור התחום המשפטי לפי סוג הבעיה המשפחתית</a></li>'
		. '<li><a href="https://jus-tice.co.il/divorce-costs-2025/">עלויות גירושין, אגרות והוצאות נלוות</a></li>'
		. '<li><a href="https://jus-tice.co.il/lawyer-fees-guide/">השוואת הצעות שכר טרחה של עורכי דין</a></li>'
		. '</ul></nav></section>'
		. '<section class="jt-comparison-method" data-jt-comparison-universe="u0-2026-08-02" aria-labelledby="jt-comparison-method-title"><h2 id="jt-comparison-method-title">איך נבנה המדגם</h2>'
		. '<p><strong>אוכלוסיית המחקר המצומצמת, U0:</strong> שמות ספקים מזוהים שנצפו בתוצאות חיפוש עבריות ציבוריות שנאספו ב־1 וב־2 באוגוסט 2026. קבוצת השאילתות כללה עורך דין גירושין, עורך דין לענייני משפחה, משרד עורכי דין גירושין מומלץ, עורכי דין משפחה מומלצים, עורך דין גירושין מומלץ, עורכי דין גירושין מומלצים, עורך דין משפחה מומלץ ועורך דין לענייני משפחה מומלץ. ההופעה בגוגל שימשה לאיתור בלבד ולא הוכיחה איכות או קבעה את סדר ההצגה.</p>'
		. '<p>בדיקה חוזרת של כוונת ההשוואה נערכה ב־2 באוגוסט 2026 ב־Google ישראל, בעברית, עבור ישראל, ללא התאמה אישית, כאשר גוגל הציגה את תל אביב יפו כמיקום. המדגם מוטה לטובת מי שכבר זכה לחשיפה בחיפוש ואינו מייצג את כל עורכי הדין בישראל.</p>'
		. '<p>לאחר האיתור הושוו השם, המעמד, תחומי העיסוק, מועד הקבלה ומען המשרד לכרטיס הציבורי של לשכת עורכי הדין. שלושה עשר כרטיסים מוצגים בסדר אלפביתי לפי שם המשפחה הרשמי. רשומה נוספת אינה מוצגת משום שלא נמצאה התאמת שם מדויקת ונמצאה סתירה בתחום הפעילות. זו החלטת ראיות בלבד, לא קביעה על רישיון או איכות מקצועית.</p>'
		. '<ul><li>לא ניתן ציון מספרי ולא נעשה שימוש בדירוג כוכבים.</li><li>ביקורות חיצוניות לא שימשו להכללה או להחרגה.</li><li>מועד קבלה אינו הוכחה להתאמה לתיק מסוים.</li><li>תחומי העיסוק ומען המשרד מתארים את הכרטיס הרשמי בלבד.</li><li>שיקולים מסחריים ועריכתיים עשויים להשפיע על הופעה ונראות. הכרטיסים המוצגים מסודרים לפי שם המשפחה הרשמי בעברית, וסדר זה אינו ציון איכות מקצועי.</li></ul></section>'
		. '<section aria-labelledby="jt-comparison-candidates-title"><h2 id="jt-comparison-candidates-title">השוואה עובדתית בין המועמדים</h2><div class="jt-comparison-grid">' . $cards . '</div></section>'
		. '<section class="jt-comparison-use" aria-labelledby="jt-comparison-use-title"><h2 id="jt-comparison-use-title">מה לבדוק לפני קביעת פגישה</h2><ol><li>מי יטפל בתיק בפועל ומי צפוי להופיע בדיונים.</li><li>האם תחומי העיסוק הרשומים מתאימים לסוג הבעיה ולשלב שבו אתם נמצאים.</li><li>איך בנוי שכר הטרחה, מה כלול ומה צפוי להיחשב הוצאה נוספת.</li><li>כיצד מתבצעות בדיקת ניגוד עניינים ושמירת מסמכים רגישים.</li><li>אילו מועדים דחופים קיימים ומה אפשר לבצע לפני הפגישה.</li></ol></section>'
		. '<section class="jt-comparison-editorial" data-jt-comparison-editorial="justice-team"><h2>עריכה, אחריות ותיקון מידע</h2><p><strong>צוות Jus-Tice</strong> אחראי למבנה ההשוואה ולהבהרה על אופן הצגת הכרטיסים. חבילת הראיות לגרסה זו ננעלה ב־2 באוגוסט 2026. לא מוצגת טענה שעורך דין מסוים בדק את העמוד או ממליץ על המועמדים.</p><p>פרטי מעמד, תחום ומען עשויים להשתנות. לתיקון נתון, השתמשו ב<a href="https://jus-tice.co.il/contact/">עמוד יצירת הקשר</a>, צרפו קישור לעמוד, ציינו את השדה המבוקש והוסיפו מקור תומך. אין לשלוח מסמכים משפטיים או מידע רגיש לצורך תיקון.</p><p>העמוד אינו ייעוץ משפטי, אינו דירוג מקצועי ואינו מבטיח תוצאה.</p></section>'
		. '</div>';
}

/**
 * Replace only the article-template H1 and preserve every attribute.
 */
function justice_ops_comparison_replace_h1( string $body ): string {
	$h1 = justice_ops_comparison_content_contract()['h1'];

	$updated = preg_replace_callback(
		'#(<h1\b[^>]*class=["\'][^"\']*\bsingle-article__title\b[^"\']*["\'][^>]*>)[\s\S]*?(</h1>)#iu',
		static function ( array $match ) use ( $h1 ): string {
			return $match[1] . esc_html( $h1 ) . $match[2];
		},
		$body,
		1
	);

	return is_string( $updated ) ? $updated : $body;
}

/**
 * Remove the unproved top-of-page reviewer claim from this page only.
 */
function justice_ops_comparison_strip_top_reviewer( string $body ): string {
	$updated = preg_replace(
		'#<div\b[^>]*class=["\'][^"\']*\bsingle-article__author\b[^"\']*["\'][^>]*>[\s\S]*?</div>#iu',
		'',
		$body,
		1
	);

	return is_string( $updated ) ? $updated : $body;
}

/**
 * Replace the stale article publication row with the exact evidence-check date.
 * This comparison is a controlled data treatment, not the legacy article.
 */
function justice_ops_comparison_control_header_meta( string $body ): string {
	$replacement = '<div class="single-article__meta" data-jt-comparison-evidence-date="2026-08-02"><span>בדיקת המקורות: 1 וב־2 באוגוסט 2026</span></div>';
	$updated     = preg_replace(
		'#<div\b[^>]*class=["\'][^"\']*\bsingle-article__meta\b[^"\']*["\'][^>]*>[\s\S]*?</div>#iu',
		$replacement,
		$body,
		1,
		$count
	);

	return is_string( $updated ) && 1 === $count ? $updated : $body;
}

/**
 * Mask raw-text elements and comments before applying bounded HTML rewrites.
 *
 * @param array<string,string> $protected Populated with token-to-source pairs.
 */
function justice_ops_comparison_protect_raw_text( string $body, array &$protected ): string {
	$protected = array();
	$prefix    = 'JTCR_' . substr( hash( 'sha256', $body ), 0, 12 );
	$updated   = preg_replace_callback(
		'#<(script|style|title|textarea|template|noscript|xmp)\b[^>]*>[\s\S]*?</\1\s*>|<!--[\s\S]*?-->#iu',
		static function ( array $match ) use ( &$protected, $prefix ): string {
			$token               = '<!--' . $prefix . '_' . count( $protected ) . '-->';
			$protected[ $token ] = $match[0];

			return $token;
		},
		$body
	);

	return is_string( $updated ) ? $updated : $body;
}

/**
 * Restore raw-text elements and comments byte-for-byte.
 *
 * @param array<string,string> $protected Token-to-source pairs.
 */
function justice_ops_comparison_restore_raw_text( string $body, array $protected ): string {
	return empty( $protected ) ? $body : strtr( $body, $protected );
}

/**
 * Replace the exact article-content container without relying on a nested-div
 * regular expression. Raw-text elements and comments are masked beforehand.
 */
function justice_ops_comparison_replace_article_content( string $body ): string {
	if ( false !== strpos( $body, 'data-jt-comparison-content=' ) ) {
		return $body;
	}

	$matched = preg_match(
		'#<div\b[^>]*class=["\'][^"\']*\bsingle-article__content\b[^"\']*["\'][^>]*>#iu',
		$body,
		$opening,
		PREG_OFFSET_CAPTURE
	);
	if ( 1 !== $matched ) {
		return $body;
	}

	$opening_html = (string) $opening[0][0];
	$opening_at   = (int) $opening[0][1];
	$content_at   = $opening_at + strlen( $opening_html );
	$cursor       = $content_at;
	$depth        = 1;
	$body_length  = strlen( $body );

	while ( $cursor < $body_length ) {
		$found = preg_match( '#</?div\b[^>]*>#iu', $body, $tag_match, PREG_OFFSET_CAPTURE, $cursor );
		if ( 1 !== $found ) {
			return $body;
		}

		$tag    = (string) $tag_match[0][0];
		$tag_at = (int) $tag_match[0][1];
		$cursor = $tag_at + strlen( $tag );

		if ( 0 === stripos( $tag, '</div' ) ) {
			--$depth;
			if ( 0 === $depth ) {
				return substr( $body, 0, $content_at )
					. justice_ops_comparison_public_content_html()
					. substr( $body, $tag_at );
			}
		} elseif ( ! preg_match( '#/\s*>$#', $tag ) ) {
			++$depth;
		}
	}

	return $body;
}

/**
 * Apply the idempotent, exact-URL rendered-body treatment.
 */
function justice_ops_comparison_filter_html( string $html ): string {
	if (
		! justice_ops_comparison_bridge_enabled()
		|| ! justice_ops_comparison_is_target()
		|| ! justice_ops_comparison_schema_helpers_available()
	) {
		return $html;
	}

	$original      = $html;
	$body_position = stripos( $html, '<body' );
	if ( false === $body_position ) {
		return $html;
	}

	$head = substr( $html, 0, $body_position );
	$body = substr( $html, $body_position );
	$raw  = array();
	$body = justice_ops_comparison_protect_raw_text( $body, $raw );
	$body = justice_ops_comparison_replace_h1( $body );
	$body = justice_ops_comparison_strip_top_reviewer( $body );
	$body = justice_ops_comparison_control_header_meta( $body );
	$body = justice_ops_comparison_replace_article_content( $body );
	if ( false === strpos( $body, 'data-jt-comparison-content=' ) ) {
		return $original;
	}

	if ( false === strpos( $body, 'data-jt-comparison-reset=' ) ) {
		$marked = preg_replace(
			'#<body\b#i',
			'<body data-jt-comparison-reset="2026-08-02-r3"',
			$body,
			1
		);
		if ( is_string( $marked ) ) {
			$body = $marked;
		}
	}

	$body = justice_ops_comparison_restore_raw_text( $body, $raw );
	$html = $head . $body;
	$html = justice_ops_maya_profile_release_strip_body_structured_attributes( $html );
	$html = justice_ops_comparison_control_schema( $html );
	if (
		1 !== substr_count( $html, '<script type="application/ld+json" id="justice-family-comparison-schema">' )
		|| 1 !== substr_count( $html, 'data-jt-comparison-evidence-date="2026-08-02"' )
	) {
		return $original;
	}

	return $html;
}

add_action(
	'template_redirect',
	static function (): void {
		if (
			is_admin()
			|| ! justice_ops_comparison_bridge_enabled()
			|| ! justice_ops_comparison_is_target()
			|| ! justice_ops_comparison_schema_helpers_available()
		) {
			return;
		}

		ob_start( 'justice_ops_comparison_filter_html' );
	},
	-1999999
);
