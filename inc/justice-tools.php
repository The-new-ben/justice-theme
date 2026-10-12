<?php
/**
 * The co.il tools program, wave 1 (HAD-485): the "instrument" shell, T04 (CPI linkage and the
 * Interest Adjudication Law) and T02 (minimum wage back-pay).
 *
 * Extends the legal-tools framework that already lives here: [jt_fee_calculator]
 * (inc/fee-calculator.php), the /legal-tools/ hub and its HAD-454 hero (inc/legal-tools-app.php),
 * the justice_legal_tool post type, and the justice-ops [justice_calc] family. Same idea, one level
 * up: every number is read from ONE dated registry (assets/data/justice-tools-registry.json), the
 * example result is in the server HTML, and the calculation path cites the exact section.
 *
 * Shortcodes (no page is created by this file; placing them is an editor step):
 *   [justice_tool name="hatzmada"]                       answer box + instrument
 *   [justice_tool name="sachar-minimum" answer="0"]       instrument without the answer box
 *   [justice_tool_section name="hatzmada" part="method"]  part: method | numbers | compare | sources | updated
 *   [justice_tools_index]                                 hub cards with the data stamp
 *
 * Claude Design board: https://claude.ai/artifact/JHKhphmy9L1QbYYUk2KX4e
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Read a JSON file from assets/data once per request.
 *
 * @param string $file File name under assets/data.
 * @return array
 */
function justice_tools_json( string $file ): array {
	static $cache = array();
	if ( isset( $cache[ $file ] ) ) {
		return $cache[ $file ];
	}
	$path = JUSTICE_THEME_DIR . '/assets/data/' . $file;
	$data = is_readable( $path ) ? json_decode( (string) file_get_contents( $path ), true ) : null;
	$cache[ $file ] = is_array( $data ) ? $data : array();
	return $cache[ $file ];
}

function justice_tools_registry(): array {
	return justice_tools_json( 'justice-tools-registry.json' );
}

function justice_tools_snapshots(): array {
	return justice_tools_json( 'justice-tools-snapshots.json' );
}

/**
 * The tools this file renders. Page URLs come from backlog.csv (HAD-477); the new URL for T04
 * passed url_word_audit (hatzmada 0 owners, madad 0 owners).
 */
function justice_tools_catalog(): array {
	return array(
		'hatzmada'       => array(
			'name'      => 'מחשבון הצמדה למדד וריבית',
			'title'     => 'מחשבון הצמדה למדד וריבית לפי חוק פסיקת ריבית והצמדה',
			'promise'   => 'כמה שווה היום סכום מאז, ומה בית המשפט מוסיף לו. כולל תשלומים חלקיים וטבלה לבית המשפט.',
			'question'  => 'כמה שווה היום סכום מתאריך קודם, עם הצמדה וריבית כחוק?',
			'page'      => '/hatzmada-madad/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'checked_on', 'cpi', 'interest' ),
			'next_text' => 'הצעד הבא: לצרף את הטבלה לכתב התביעה או לבקשה בהוצאה לפועל',
			'primary'   => array( 'label' => 'הורדת הטבלה לבית המשפט', 'act' => 'csv' ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון בתביעה הכספית', 'topic' => 'general', 'purpose' => 'court_rehearsal' ),
			'lawyer'    => array( 'label' => 'עורך דין ליטיגציה', 'path' => '/lawyers/' ),
			'sticky'    => 'היתרה',
		),
		'sachar-minimum' => array(
			'name'      => 'בודק שכר מינימום',
			'title'     => 'בודק שכר מינימום: קיבלתם לפחות את המינימום?',
			'promise'   => 'חודש אחרי חודש, גם כשהשכר עלה ב-1 באפריל, וכמה חסר בסך הכול.',
			'question'  => 'האם השכר שלי לא נמוך משכר המינימום, ומה הפער?',
			'page'      => '/minimum-wage-israel-2025/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'checked_on', 'min_wage' ),
			'next_text' => 'הצעד הבא: לשלוח למעסיק מכתב דרישה עם הפירוט',
			'primary'   => array( 'label' => 'הפקת מכתב דרישה', 'act' => 'letter' ),
			// Conversion to a hearing is 2 in the backlog (below 3), so no rehearsal button here.
			'rehearse'  => null,
			'more'      => array( array( 'label' => 'הצמדה וריבית לפער', 'path' => '/hatzmada-madad/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/israeli-labor-law/' ),
			'sticky'    => 'חסר',
		),
	);
}

/** 1.4.2026 from 2026-04-01; 8.2026 from 2026-08. */
function justice_tools_he_date( string $iso ): string {
	$parts = array_map( 'intval', explode( '-', $iso ) );
	if ( 3 === count( $parts ) ) {
		return $parts[2] . '.' . $parts[1] . '.' . $parts[0];
	}
	return 2 === count( $parts ) ? $parts[1] . '.' . $parts[0] : $iso;
}

function justice_tools_he_month( string $key ): string {
	$months = array( 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר' );
	list( $y, $m ) = array_map( 'intval', explode( '-', $key ) );
	return ( $months[ $m - 1 ] ?? '' ) . ' ' . $y;
}

function justice_tools_money( $n, int $digits = 2 ): string {
	return '<span class="jtool-amt"><bdi>' . number_format( (float) $n, $digits, '.', ',' ) . '</bdi> ₪</span>';
}

/** CPI value on the latest base's scale, using the CBS chaining coefficients in the registry. */
function justice_tools_cpi_chained( array $cpi, string $key ): ?float {
	$value = null;
	foreach ( $cpi['series'] as $row ) {
		if ( $row[0] === $key ) {
			$value = (float) $row[1];
			break;
		}
	}
	if ( null === $value ) {
		return null;
	}
	$factor = 1.0;
	$found  = false;
	foreach ( $cpi['bases'] as $base ) {
		if ( $key >= $base['from'] && $key <= $base['to'] ) {
			$found = true;
		}
		if ( $found && null !== $base['to_next'] ) {
			$factor *= (float) $base['to_next'];
		}
	}
	return $value / $factor;
}

function justice_tools_shift_month( string $key, int $delta ): string {
	list( $y, $m ) = array_map( 'intval', explode( '-', $key ) );
	$total = $y * 12 + ( $m - 1 ) + $delta;
	return sprintf( '%04d-%02d', intdiv( $total, 12 ), $total % 12 + 1 );
}

function justice_tools_latest_rate( array $rows ): array {
	return $rows[ count( $rows ) - 1 ] ?? array( 'from' => '', 'rate' => null );
}

/** The 2-3 sentence answer box (page standard A2), every number read from the registry. */
function justice_tools_answer( string $name ): string {
	$reg = justice_tools_registry();
	if ( 'hatzmada' === $name && ! empty( $reg['cpi'] ) ) {
		$cpi      = $reg['cpi'];
		$latest   = $cpi['latest_month'];
		$year_ago = justice_tools_shift_month( $latest, -12 );
		$now      = justice_tools_cpi_chained( $cpi, $latest );
		$then     = justice_tools_cpi_chained( $cpi, $year_ago );
		$change   = ( $now && $then ) ? round( ( $now / $then - 1 ) * 100, 1 ) : null;
		$value    = null;
		foreach ( $cpi['series'] as $row ) {
			if ( $row[0] === $latest ) {
				$value = $row[1];
			}
		}
		$base   = end( $cpi['bases'] );
		$linked = justice_tools_latest_rate( $reg['interest']['linked'] );
		$text   = '<strong>מחשבון הצמדה למדד</strong> מחשב כמה שווה היום סכום מתאריך קודם, לפי מדד המחירים לצרכן של הלמ"ס. '
			. 'המדד האחרון שפורסם הוא מדד ' . esc_html( justice_tools_he_month( $latest ) ) . ': <bdi>' . esc_html( (string) $value ) . '</bdi> נקודות בבסיס ממוצע ' . esc_html( $base['id'] )
			. ( null !== $change ? ', שינוי של <bdi>' . esc_html( number_format( $change, 1 ) ) . '%</bdi> לעומת ' . esc_html( justice_tools_he_month( $year_ago ) ) : '' ) . '. '
			. 'על חוב שנפסק נוספת ריבית צמודה של <bdi>' . esc_html( (string) $linked['rate'] ) . '%</bdi> לשנה מ-' . esc_html( justice_tools_he_date( $linked['from'] ) ) . ' (החשב הכללי). '
			. 'נבדק ' . esc_html( justice_tools_he_date( $reg['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'sachar-minimum' === $name && ! empty( $reg['min_wage'] ) ) {
		$mw  = $reg['min_wage'];
		$row = $mw['rows'][ count( $mw['rows'] ) - 1 ];
		$text = '<strong>שכר המינימום בישראל מ-' . esc_html( justice_tools_he_date( $row['from'] ) ) . '</strong> הוא ' . justice_tools_money( $row['monthly'] ) . ' לחודש במשרה מלאה, '
			. justice_tools_money( $row['hourly_182'] ) . ' לשעה בהיקף של 182 שעות בחודש ו-' . justice_tools_money( $row['hourly_186'] ) . ' לשעה לפי 186 שעות, '
			. justice_tools_money( $row['daily_5'] ) . ' ליום בשבוע של 5 ימים ו-' . justice_tools_money( $row['daily_6'] ) . ' בשבוע של 6 ימים. '
			. 'המקור: ' . esc_html( $mw['publisher_he'] ) . ', נבדק ' . esc_html( justice_tools_he_date( $mw['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

function justice_tools_stamp( string $name ): string {
	$reg = justice_tools_registry();
	if ( 'hatzmada' === $name ) {
		$linked = justice_tools_latest_rate( $reg['interest']['linked'] ?? array() );
		return 'מדד ' . justice_tools_he_month( $reg['cpi']['latest_month'] ?? '' ) . ' · ריבית מ-' . justice_tools_he_date( $linked['from'] ) . ' · נבדק ' . justice_tools_he_date( $reg['checked_on'] ?? '' );
	}
	$rows = $reg['min_wage']['rows'] ?? array();
	$last = end( $rows );
	return 'בתוקף מ-' . justice_tools_he_date( $last['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $reg['min_wage']['checked_on'] ?? '' );
}

/** Official sources used by the tool's result (anatomy part H). */
function justice_tools_sources( string $name ): array {
	$reg = justice_tools_registry();
	$checked = justice_tools_he_date( $reg['checked_on'] ?? '' );
	if ( 'hatzmada' === $name ) {
		$cpi = $reg['cpi'];
		$int = $reg['interest'];
		$l   = justice_tools_latest_rate( $int['linked'] );
		$s   = justice_tools_latest_rate( $int['shekel'] );
		$f   = justice_tools_latest_rate( $int['arrears_fee'] );
		return array(
			array( 'name' => $cpi['source_name'], 'url' => $cpi['official_calculator_url'], 'text' => 'מדד ' . justice_tools_he_month( $cpi['latest_month'] ) . ' ומקדמי הקישור בין הבסיסים, כפי שמחשבון ההצמדה של הלמ"ס מיישם. נבדק ' . $checked . '.' ),
			array( 'name' => $int['source_name'], 'url' => $int['source_url'], 'text' => 'ריבית צמודה ' . $l['rate'] . '%, ריבית שקלית ' . $s['rate'] . '%, דמי פיגורים ' . $f['rate'] . '%, בתוקף מ-' . justice_tools_he_date( $l['from'] ) . ', ושיעורי הרבעונים מ-1.1.2025. נבדק ' . $checked . '.' ),
			array( 'name' => $int['law_he'], 'url' => $int['law_url'], 'text' => 'סעיפים 1, 2, 4א, 5, 5א, 6 (נוסח מעודכן ל-1.1.2025, אתר בנק ישראל).' ),
			array( 'name' => 'חוק פסיקת ריבית והצמדה (תיקון מס\' 9), התשפ"ד-2023', 'url' => $int['amendment_url'], 'text' => 'סעיף 117: הוראות מעבר לסכומים מלפני 1.1.2025 (ספר החוקים 3117).' ),
			array( 'name' => $int['regulations_he'], 'url' => $int['regulations_url'], 'text' => 'הנוסחה של כל שיעור ופרסומו בכל רבעון.' ),
		);
	}
	$mw  = $reg['min_wage'];
	$row = $mw['rows'][ count( $mw['rows'] ) - 1 ];
	return array(
		array( 'name' => $mw['source_name'], 'url' => $mw['source_url'], 'text' => number_format( (float) $row['monthly'], 2 ) . ' ₪ לחודש, ' . $row['hourly_182'] . ' ₪ לשעה (182 שעות), ' . $row['hourly_186'] . ' ₪ (186 שעות), בתוקף מ-' . justice_tools_he_date( $row['from'] ) . ', וכל השורות מ-' . justice_tools_he_date( $mw['rows'][0]['from'] ) . '. נבדק ' . justice_tools_he_date( $mw['checked_on'] ) . '.' ),
		array( 'name' => $mw['law_he'], 'url' => $mw['law_url'], 'text' => 'סעיפים 1, 2, 3, 8.' ),
		array( 'name' => $mw['youth_regulations_he'], 'url' => $mw['youth_regulations_url'], 'text' => 'תקנות 4 עד 6: ' . $mw['youth_pct']['under16'] . '%, ' . $mw['youth_pct']['age16'] . '%, ' . $mw['youth_pct']['age17'] . '%, חניך ' . $mw['youth_pct']['apprentice'] . '%, לשעה חלקי ' . $mw['youth_hours_divisor'] . '.' ),
	);
}

function justice_tools_sources_html( string $name ): string {
	$items = '';
	foreach ( justice_tools_sources( $name ) as $s ) {
		$items .= '<li><a href="' . esc_url( $s['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $s['name'] ) . '</a>: ' . esc_html( $s['text'] ) . '</li>';
	}
	return '<ul>' . $items . '</ul>';
}

function justice_tools_rehearse_url( array $tool ): string {
	if ( empty( $tool['rehearse'] ) ) {
		return '';
	}
	if ( function_exists( 'justice_theme_article_simulation_url' ) ) {
		return justice_theme_article_simulation_url( $tool['rehearse']['topic'], $tool['rehearse']['purpose'] );
	}
	return 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=' . rawurlencode( $tool['rehearse']['purpose'] );
}

/** Enqueue the stylesheet and the tool's bundle (35 KB gzipped budget; measured in the PR). */
function justice_tools_enqueue( string $name ): void {
	$css = JUSTICE_THEME_DIR . '/assets/css/justice-tools.css';
	wp_enqueue_style( 'justice-tools', JUSTICE_THEME_URI . '/assets/css/justice-tools.css', array(), is_readable( $css ) ? (string) filemtime( $css ) : JUSTICE_THEME_VERSION );
	$js = JUSTICE_THEME_DIR . '/assets/js/tools/dist/' . $name . '.js';
	if ( is_readable( $js ) ) {
		wp_enqueue_script( 'justice-tool-' . $name, JUSTICE_THEME_URI . '/assets/js/tools/dist/' . $name . '.js', array(), (string) filemtime( $js ), true );
	}
}

/** Enqueue in the head when the page body holds a tool, so the instrument paints styled. */
function justice_tools_early_enqueue(): void {
	if ( ! is_singular() ) {
		return;
	}
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post ) {
		return;
	}
	if ( preg_match_all( '/\[justice_tool\s[^\]]*name="([a-z-]+)"/', (string) $post->post_content, $m ) ) {
		foreach ( array_unique( $m[1] ) as $name ) {
			if ( isset( justice_tools_catalog()[ $name ] ) ) {
				justice_tools_enqueue( $name );
			}
		}
	}
	if ( has_shortcode( (string) $post->post_content, 'justice_tools_index' ) || has_shortcode( (string) $post->post_content, 'justice_tool_section' ) ) {
		$css = JUSTICE_THEME_DIR . '/assets/css/justice-tools.css';
		wp_enqueue_style( 'justice-tools', JUSTICE_THEME_URI . '/assets/css/justice-tools.css', array(), is_readable( $css ) ? (string) filemtime( $css ) : JUSTICE_THEME_VERSION );
	}
}
add_action( 'wp_enqueue_scripts', 'justice_tools_early_enqueue', 20 );

/** WebApplication JSON-LD (page standard C4): price 0, he-IL, no review or rating markup. */
function justice_tools_webapp_schema( string $name, array $tool ): string {
	$reg = justice_tools_registry();
	$url = function_exists( 'get_permalink' ) && get_permalink() ? get_permalink() : home_url( $tool['page'] );
	$schema = array(
		'@context'            => 'https://schema.org',
		'@type'               => 'WebApplication',
		'name'                => $tool['name'],
		'url'                 => $url,
		'description'         => $tool['promise'],
		'applicationCategory' => $tool['category'],
		'operatingSystem'     => 'Any',
		'inLanguage'          => 'he-IL',
		'isAccessibleForFree' => true,
		'offers'              => array( '@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'ILS' ),
		'dateModified'        => (string) ( $reg['checked_on'] ?? '' ),
		'publisher'           => array( '@type' => 'Organization', 'name' => 'Jus-Tice', 'url' => home_url( '/' ) ),
	);
	return '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG ) . '</script>';
}

/**
 * [justice_tool name="hatzmada"]: answer box + the instrument, with the example result already
 * in the server HTML. JavaScript then makes it live; without it the page still shows a real answer.
 *
 * @param array|string $atts Shortcode attributes.
 * @return string
 */
function justice_tools_shortcode( $atts ): string {
	static $printed = array();
	$atts    = shortcode_atts( array( 'name' => '', 'answer' => '1' ), $atts, 'justice_tool' );
	$name    = sanitize_key( (string) $atts['name'] );
	$catalog = justice_tools_catalog();
	$snaps   = justice_tools_snapshots();
	if ( ! isset( $catalog[ $name ], $snaps[ $name ] ) || isset( $printed[ $name ] ) ) {
		return '';
	}
	$printed[ $name ] = true;
	$tool = $catalog[ $name ];
	$snap = $snaps[ $name ];
	$reg  = justice_tools_registry();
	justice_tools_enqueue( $name );

	$data = array();
	foreach ( $tool['data'] as $key ) {
		if ( isset( $reg[ $key ] ) ) {
			$data[ $key ] = $reg[ $key ];
		}
	}
	$id       = 'jtool-' . $name;
	$rehearse = justice_tools_rehearse_url( $tool );
	$more     = '';
	if ( $rehearse ) {
		$more .= '<a href="' . esc_url( $rehearse ) . '" target="_blank" rel="noopener" data-act="rehearse">' . esc_html( $tool['rehearse']['label'] ) . '</a>';
	}
	foreach ( $tool['more'] ?? array() as $link ) {
		$more .= '<a href="' . esc_url( home_url( $link['path'] ) ) . '">' . esc_html( $link['label'] ) . '</a>';
	}
	$more .= '<a href="' . esc_url( home_url( $tool['lawyer']['path'] ) ) . '" data-act="lawyer">' . esc_html( $tool['lawyer']['label'] ) . '</a>';

	$actions = '<div class="jtool-actions">'
		. '<button class="jtool-btn" type="button" data-act="link">העתקת קישור (בלי פרטים אישיים)</button>'
		. '<button class="jtool-btn" type="button" data-act="whatsapp">וואטסאפ</button>'
		. '<button class="jtool-btn" type="button" data-act="copy">העתקת התוצאה</button>'
		. '<button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button>'
		. '<button class="jtool-btn" type="button" data-act="save">שמירה במכשיר הזה</button>'
		. '</div><p class="jtool-toast" data-jtool-toast role="status" aria-live="polite"></p>';

	$html  = '1' === (string) $atts['answer'] ? justice_tools_answer( $name ) : '';
	$html .= '<section class="jtool" id="' . esc_attr( $id ) . '" data-jtool="' . esc_attr( $name ) . '" data-jtool-data="' . esc_attr( $id ) . '-data" aria-labelledby="' . esc_attr( $id ) . '-title">'
		. '<div class="jtool__head"><div><h2 class="jtool__title" id="' . esc_attr( $id ) . '-title">' . esc_html( $tool['title'] ) . '</h2><p class="jtool__promise">' . esc_html( $tool['promise'] ) . '</p></div>'
		. '<a class="jtool-stamp" href="#' . esc_attr( $id ) . '-sources"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>' . esc_html( justice_tools_stamp( $name ) ) . '</a></div>'
		. '<p class="jtool-scope" data-jtool-shared hidden style="margin:12px 24px 0 !important">נפתח מקישור שיתוף. התשובות נטענו מהקישור ולא נשמרו אצלנו, והחישוב רץ שוב עם הנתונים העדכניים.</p>'
		. '<p class="jtool-scope" data-jtool-saved hidden style="margin:12px 24px 0 !important">יש חישוב שמור במכשיר הזה. <button class="jtool-linkbtn" type="button" data-act="restore">לטעון אותו</button> <button class="jtool-linkbtn" type="button" data-act="clear">למחוק</button></p>'
		. '<div class="jtool__body"><div class="jtool-form" role="group" aria-label="' . esc_attr( 'הנתונים ל' . $tool['name'] ) . '" data-jtool-form>' . $snap['form'] . '</div>'
		. '<div class="jtool-result" id="' . esc_attr( $id ) . '-result" data-jtool-result>' . $snap['result'] . '</div></div>'
		. '<div class="jtool-details" data-jtool-details>' . $snap['details'] . '</div>'
		. '<div class="jtool-details">' . $actions . '</div>'
		. '<div class="jtool-next"><p class="jtool-next__text">' . esc_html( $tool['next_text'] ) . '</p><div class="jtool-next__cta">'
		. '<button class="jtool-btn jtool-btn--primary" type="button" data-act="' . esc_attr( $tool['primary']['act'] ) . '">' . esc_html( $tool['primary']['label'] ) . '</button>'
		. '<div class="jtool-next__more">' . $more . '</div></div></div>'
		. '<details class="jtool-sources" id="' . esc_attr( $id ) . '-sources"><summary>מקורות (נבדקו ב-' . esc_html( justice_tools_he_date( $reg['checked_on'] ?? '' ) ) . ')</summary>' . justice_tools_sources_html( $name ) . '</details>'
		. '<p class="jtool-foot">מידע כללי, לא ייעוץ משפטי. מה שהקלדתם לא נשמר אצלנו. החישוב נבנה על ידי צוות Jus-Tice.</p>'
		. '<div class="jtool-sticky" data-show="0"><span>' . esc_html( $tool['sticky'] ) . '</span><strong data-jtool-sticky-figure>' . justice_tools_money( $snap['total'] ) . '</strong><a href="#' . esc_attr( $id ) . '-result">פרטים</a></div>'
		. '</section>'
		. '<script type="application/json" id="' . esc_attr( $id ) . '-data">' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP ) . '</script>'
		. justice_tools_webapp_schema( $name, $tool );
	return $html;
}
add_shortcode( 'justice_tool', 'justice_tools_shortcode' );

/** Current-numbers table (page standard A5): every row has a value, valid-from date and source. */
function justice_tools_numbers_html( string $name ): string {
	$reg = justice_tools_registry();
	if ( 'hatzmada' === $name ) {
		$cpi  = $reg['cpi'];
		$rows = '';
		$keys = array_slice( array_column( $cpi['series'], 0 ), -13 );
		$prev = null;
		foreach ( $keys as $key ) {
			$chained = justice_tools_cpi_chained( $cpi, $key );
			if ( null !== $prev ) {
				$value = '';
				foreach ( $cpi['series'] as $row ) {
					if ( $row[0] === $key ) {
						$value = $row[1];
					}
				}
				$base = '';
				foreach ( $cpi['bases'] as $b ) {
					if ( $key >= $b['from'] && $key <= $b['to'] ) {
						$base = $b['id'];
					}
				}
				$rows = '<tr><td data-th="חודש המדד">' . esc_html( justice_tools_he_month( $key ) ) . '</td><td data-th="המדד"><bdi>' . esc_html( (string) $value ) . '</bdi></td><td data-th="בסיס">ממוצע ' . esc_html( $base ) . '</td><td data-th="שינוי חודשי"><bdi>' . esc_html( number_format( ( $chained / $prev - 1 ) * 100, 1 ) ) . '%</bdi></td><td data-th="מקור"><a href="' . esc_url( $cpi['official_calculator_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $cpi['publisher_he'] ) . '</a></td></tr>' . $rows;
			}
			$prev = $chained;
		}
		$int   = $reg['interest'];
		$irows = '';
		foreach ( array_reverse( array_keys( $int['linked'] ) ) as $i ) {
			$irows .= '<tr><td data-th="בתוקף מ">' . esc_html( justice_tools_he_date( $int['linked'][ $i ]['from'] ) ) . '</td><td data-th="ריבית שקלית"><bdi>' . esc_html( (string) $int['shekel'][ $i ]['rate'] ) . '%</bdi></td><td data-th="ריבית צמודה"><bdi>' . esc_html( (string) $int['linked'][ $i ]['rate'] ) . '%</bdi></td><td data-th="דמי פיגורים"><bdi>' . esc_html( (string) $int['arrears_fee'][ $i ]['rate'] ) . '%</bdi></td><td data-th="מקור"><a href="' . esc_url( $int['source_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $int['publisher_he'] ) . '</a></td></tr>';
		}
		return '<div class="jtool-page"><h3>מדד המחירים לצרכן ב-12 החודשים האחרונים</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">חודש המדד</th><th scope="col">המדד</th><th scope="col">בסיס</th><th scope="col">שינוי חודשי</th><th scope="col">מקור</th></tr></thead><tbody>' . $rows . '</tbody></table></div>'
			. '<h3>שיעורי הריבית לפי חוק פסיקת ריבית והצמדה, לשנה</h3><div class="jtool-datawrap"><table class="jtool-datatable"><caption>ריבית שקלית וריבית צמודה: סעיף 2 לחוק. דמי פיגורים: סעיף 5א. השיעור חל מתחילת הרבעון.</caption><thead><tr><th scope="col">בתוקף מ</th><th scope="col">ריבית שקלית</th><th scope="col">ריבית צמודה</th><th scope="col">דמי פיגורים</th><th scope="col">מקור</th></tr></thead><tbody>' . $irows . '</tbody></table></div>'
			. '<p class="jtool-updated">נבדק מול הלמ"ס ומול החשב הכללי ב-' . esc_html( justice_tools_he_date( $reg['checked_on'] ) ) . '.</p></div>';
	}
	$mw    = $reg['min_wage'];
	$rows  = '';
	foreach ( array_reverse( $mw['rows'] ) as $row ) {
		$rows .= '<tr><td data-th="בתוקף מ">' . esc_html( justice_tools_he_date( $row['from'] ) ) . '</td><td data-th="לחודש">' . justice_tools_money( $row['monthly'] ) . '</td><td data-th="לשעה, 182 שעות">' . ( null === $row['hourly_182'] ? '—' : justice_tools_money( $row['hourly_182'] ) ) . '</td><td data-th="לשעה, 186 שעות">' . justice_tools_money( $row['hourly_186'] ) . '</td><td data-th="ליום, 5 ימים">' . justice_tools_money( $row['daily_5'] ) . '</td><td data-th="ליום, 6 ימים">' . justice_tools_money( $row['daily_6'] ) . '</td><td data-th="מקור"><a href="' . esc_url( $mw['source_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $mw['publisher_he'] ) . '</a></td></tr>';
	}
	$last  = $mw['rows'][ count( $mw['rows'] ) - 1 ];
	$youth = '';
	$ages  = array( 'under16' => 'מתחת לגיל 16', 'age16' => 'גיל 16', 'age17' => 'גיל 17', 'apprentice' => 'חניך' );
	foreach ( $ages as $key => $label ) {
		$pct     = (int) $mw['youth_pct'][ $key ];
		$monthly = round( $last['monthly'] * $pct / 100, 2 );
		$hourly  = round( $monthly / $mw['youth_hours_divisor'], 2 );
		$youth  .= '<tr><td data-th="גיל">' . esc_html( $label ) . '</td><td data-th="משכר המינימום"><bdi>' . $pct . '%</bdi></td><td data-th="לחודש">' . justice_tools_money( $monthly ) . '</td><td data-th="לשעה">' . justice_tools_money( $hourly ) . '</td><td data-th="מקור"><a href="' . esc_url( $mw['youth_regulations_url'] ) . '" target="_blank" rel="noopener">תקנות 4 עד 6</a></td></tr>';
	}
	return '<div class="jtool-page"><h3>שכר המינימום לפי תאריך התחולה (גיל 18 ומעלה)</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">בתוקף מ</th><th scope="col">לחודש</th><th scope="col">לשעה, 182 שעות</th><th scope="col">לשעה, 186 שעות</th><th scope="col">ליום, 5 ימים</th><th scope="col">ליום, 6 ימים</th><th scope="col">מקור</th></tr></thead><tbody>' . $rows . '</tbody></table></div>'
		. '<h3>שכר מינימום לנוער ולחניכים מ-' . esc_html( justice_tools_he_date( $last['from'] ) ) . '</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">גיל</th><th scope="col">משכר המינימום</th><th scope="col">לחודש</th><th scope="col">לשעה, חלקי ' . esc_html( (string) $mw['youth_hours_divisor'] ) . '</th><th scope="col">מקור</th></tr></thead><tbody>' . $youth . '</tbody></table></div>'
		. '<p class="jtool-updated">שכר המינימום נבדק מול ' . esc_html( $mw['publisher_he'] ) . ' ב-' . esc_html( justice_tools_he_date( $mw['checked_on'] ) ) . '. השכר לנוער מחושב מהאחוז שבתקנות.</p></div>';
}

/** Comparison table (page standard A6). */
function justice_tools_compare_html( string $name ): string {
	if ( 'hatzmada' === $name ) {
		$snap = justice_tools_snapshots()['hatzmada'] ?? array();
		return '<div class="jtool-page">' . ( $snap['compare_table'] ?? '' ) . '</div>';
	}
	$rows = justice_tools_registry()['min_wage']['rows'] ?? array();
	if ( count( $rows ) < 2 ) {
		return '';
	}
	$a     = $rows[ count( $rows ) - 2 ];
	$b     = $rows[ count( $rows ) - 1 ];
	$cells = array( 'monthly' => 'לחודש', 'hourly_182' => 'לשעה, 182 שעות', 'hourly_186' => 'לשעה, 186 שעות', 'daily_5' => 'ליום, 5 ימים', 'daily_6' => 'ליום, 6 ימים' );
	$body  = '';
	foreach ( $cells as $key => $label ) {
		$change = $a[ $key ] ? ( $b[ $key ] / $a[ $key ] - 1 ) * 100 : 0;
		$body  .= '<tr><td data-th="רכיב">' . esc_html( $label ) . '</td><td data-th="מ-' . esc_attr( justice_tools_he_date( $a['from'] ) ) . '">' . justice_tools_money( $a[ $key ] ) . '</td><td data-th="מ-' . esc_attr( justice_tools_he_date( $b['from'] ) ) . '">' . justice_tools_money( $b[ $key ] ) . '</td><td data-th="תוספת">' . justice_tools_money( $b[ $key ] - $a[ $key ] ) . '</td><td data-th="שינוי"><bdi>' . esc_html( number_format( $change, 1 ) ) . '%</bdi></td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>שכר המינימום מ-' . esc_html( justice_tools_he_date( $a['from'] ) ) . ' מול מ-' . esc_html( justice_tools_he_date( $b['from'] ) ) . '</caption><thead><tr><th scope="col">רכיב</th><th scope="col">מ-' . esc_html( justice_tools_he_date( $a['from'] ) ) . '</th><th scope="col">מ-' . esc_html( justice_tools_he_date( $b['from'] ) ) . '</th><th scope="col">תוספת</th><th scope="col">שינוי</th></tr></thead><tbody>' . $body . '</tbody></table></div></div>';
}

/**
 * [justice_tool_section name="..." part="method|numbers|compare|sources|updated"]: the page sections
 * that page-standard.txt says come from the registry, never retyped.
 *
 * @param array|string $atts Shortcode attributes.
 * @return string
 */
function justice_tools_section_shortcode( $atts ): string {
	$atts = shortcode_atts( array( 'name' => '', 'part' => '' ), $atts, 'justice_tool_section' );
	$name = sanitize_key( (string) $atts['name'] );
	if ( ! isset( justice_tools_catalog()[ $name ] ) ) {
		return '';
	}
	$reg  = justice_tools_registry();
	$snap = justice_tools_snapshots()[ $name ] ?? array();
	switch ( (string) $atts['part'] ) {
		case 'method':
			return '<div class="jtool-page jtool-method"><p>לדוגמה, ' . esc_html( $snap['sentence'] ?? '' ) . ' כך הכלי מחשב את זה, שורה אחרי שורה:</p>' . ( $snap['method'] ?? '' ) . '</div>';
		case 'numbers':
			return justice_tools_numbers_html( $name );
		case 'compare':
			return justice_tools_compare_html( $name );
		case 'sources':
			return '<div class="jtool-page jtool-sources-list">' . justice_tools_sources_html( $name ) . '</div>';
		case 'updated':
			return '<p class="jtool-updated">הנתונים בעמוד נבדקו מול המקורות הרשמיים ב-' . esc_html( justice_tools_he_date( $reg['checked_on'] ?? '' ) ) . '.</p>';
	}
	return '';
}
add_shortcode( 'justice_tool_section', 'justice_tools_section_shortcode' );

/** [justice_tools_index]: hub cards (design-spec B11) with each tool's question and data stamp. */
function justice_tools_index_shortcode(): string {
	$cards = '';
	foreach ( justice_tools_catalog() as $name => $tool ) {
		$cards .= '<a class="jtool-card" href="' . esc_url( home_url( $tool['page'] ) ) . '"><strong>' . esc_html( $tool['name'] ) . '</strong><span>' . esc_html( $tool['question'] ) . '</span><small>' . esc_html( justice_tools_stamp( $name ) ) . '</small></a>';
	}
	return '<div class="jtool-page jtool-cards">' . $cards . '</div>';
}
add_shortcode( 'justice_tools_index', 'justice_tools_index_shortcode' );
