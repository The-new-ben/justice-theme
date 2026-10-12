<?php
/**
 * The co.il tools program: the "instrument" shell, wave 1 (HAD-485): T04 (CPI linkage and the
 * Interest Adjudication Law) and T02 (minimum wage back-pay); wave 2 (HAD-490): T03 (recuperation
 * pay) and T05 (small claims: fit, fee, deadlines, claim structure, rehearsal; fee-only mode).
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
 *   [justice_tool name="havraa"]                         T03, recuperation pay
 *   [justice_tool name="tviot-ktanot"]                   T05, small claims (full instrument)
 *   [justice_tool name="tviot-ktanot" mode="fee"]        T05, fee only (/small-claims-fee-calculator/)
 *   [justice_tool_section name="hatzmada" part="method"]  part: method | numbers | compare | sources | updated
 *                                                         (add mode="fee" for the fee-only page's method)
 *   [justice_tools_index]                                 hub cards with the data stamp
 *
 * Claude Design boards: https://claude.ai/artifact/JHKhphmy9L1QbYYUk2KX4e (wave 1),
 * https://claude.ai/artifact/759KGxB7GDSy5NHaajW8sJ (wave 2)
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
		// Wave 2 (HAD-490). Board: https://claude.ai/artifact/759KGxB7GDSy5NHaajW8sJ
		'havraa'         => array(
			'name'      => 'מחשבון דמי הבראה',
			'title'     => 'מחשבון דמי הבראה לפי צו ההרחבה',
			'promise'   => 'כמה ימים ובכמה, לשנה הזאת או לכל התקופה, כולל מה שלא שולם ומכתב דרישה.',
			'question'  => 'כמה דמי הבראה מגיעים לי, לפי ותק ואחוז משרה?',
			'page'      => '/havraa-pay-calculator/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'checked_on', 'havraa' ),
			'next_text' => 'הצעד הבא: לבדוק בתלוש של יוני עד ספטמבר שהסכום שולם, ואם לא, לשלוח למעסיק מכתב דרישה',
			'primary'   => array( 'label' => 'הפקת מכתב דרישה', 'act' => 'letter' ),
			// Conversion to a hearing is 2 in the backlog (below 3), so no rehearsal button here.
			'rehearse'  => null,
			'more'      => array( array( 'label' => 'בודק שכר מינימום', 'path' => '/minimum-wage-israel-2025/' ), array( 'label' => 'הצמדה וריבית לחוב', 'path' => '/hatzmada-madad/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/israeli-labor-law/' ),
			'sticky'    => 'מגיע',
		),
		'tviot-ktanot'   => array(
			'name'      => 'בודק תביעות קטנות ואגרה',
			'title'     => 'תביעה קטנה: אפשר? כמה אגרה? עד מתי?',
			'promise'   => 'בדיקת התאמה, האגרה בעיגול הנכון, המועדים, שלד כתב התביעה ותרגול הדיון.',
			'question'  => 'האם התביעה שלי מתאימה לתביעות קטנות, וכמה אגרה אשלם?',
			'page'      => '/small-claims-court-israel/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'checked_on', 'small_claims' ),
			'next_text' => 'הצעד הבא: לתרגל את הדיון מול שופטת וירטואלית, לפני שעומדים מולה באמת',
			// Conversion 5 (a direct hearing): the rehearsal is the primary next step, after the result.
			'primary'   => array( 'label' => 'לתרגל את הדיון בתביעה הקטנה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון בתביעה הקטנה', 'topic' => 'general', 'purpose' => 'court_rehearsal' ),
			'more'      => array( array( 'label' => 'הגשה באתר הרשות השופטת', 'url' => 'https://www.gov.il/he/service/filing_a_small_claim' ), array( 'label' => 'מחשבון הצמדה וריבית לסכום', 'path' => '/hatzmada-madad/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין ליטיגציה', 'path' => '/lawyers/' ),
			'sticky'    => 'אגרה',
			// The stage bar of a combined tool (design-spec 3, board T05-desktop): check, fee, deadlines, claim, rehearse.
			'stages'    => array( array( 'אפשר לתבוע כאן?', 'result' ), array( 'האגרה', 'jt5-fee-h' ), array( 'המועדים', 'jt5-dl-h' ), array( 'כתב התביעה', 'jt5-claim-h' ), array( 'תרגול הדיון', 'next' ) ),
			'modes'     => array(
				'fee' => array(
					'name'      => 'מחשבון אגרת תביעה קטנה',
					'title'     => 'מחשבון אגרת תביעה קטנה',
					'promise'   => 'האגרה המדויקת, עם העיגול כלפי מעלה שמחשבונים רבים שוכחים.',
					'question'  => 'כמה אגרה משלמים על תביעה קטנה?',
					'page'      => '/small-claims-fee-calculator/',
					'next_text' => 'הצעד הבא: לבדוק שהתביעה בכלל מתאימה לתביעות קטנות, ומה המועדים',
					'primary'   => array( 'label' => 'בדיקה מלאה, מועדים וכתב תביעה', 'path' => '/small-claims-court-israel/' ),
					'more'      => array(),
					'stages'    => array(),
				),
			),
		),
	);
}

/** A tool's catalog entry, with a mode's overrides applied (e.g. tviot-ktanot in fee-only mode). */
function justice_tools_tool( string $name, string $mode = '' ): array {
	$catalog = justice_tools_catalog();
	$tool    = $catalog[ $name ] ?? array();
	if ( '' !== $mode && isset( $tool['modes'][ $mode ] ) ) {
		$tool = array_merge( $tool, $tool['modes'][ $mode ] );
	}
	return $tool;
}

/** The snapshot of a tool (or of one of its modes), as built by tools/build-justice-tools.mjs. */
function justice_tools_snapshot( string $name, string $mode = '' ): array {
	$snap = justice_tools_snapshots()[ $name ] ?? array();
	if ( '' !== $mode ) {
		return isset( $snap[ $mode ] ) && is_array( $snap[ $mode ] ) ? $snap[ $mode ] : array();
	}
	return $snap;
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

/** The last private-sector havraa day price and the year it is for. */
function justice_tools_havraa_latest( array $hv ): array {
	$rates = $hv['private_rates'] ?? array();
	$last  = $rates ? $rates[ count( $rates ) - 1 ] : array( 'from' => '', 'rate' => 0 );
	return array( 'rate' => (float) $last['rate'], 'year' => substr( (string) $last['from'], 0, 4 ), 'row' => $last );
}

function justice_tools_public_rate( array $hv, int $year ): ?array {
	foreach ( $hv['public_rates'] ?? array() as $row ) {
		if ( (int) $row['year'] === $year ) {
			return $row;
		}
	}
	return null;
}

/** The small-claims ceiling in force today (the last row of the registry). */
function justice_tools_sc_ceiling( array $sc ): array {
	$rows = $sc['ceiling'] ?? array();
	return $rows ? $rows[ count( $rows ) - 1 ] : array( 'from' => '', 'amount' => 0 );
}

/** Today's date (Y-m-d). Tests pin it with the JUSTICE_TOOLS_TODAY constant. */
function justice_tools_today(): string {
	return defined( 'JUSTICE_TOOLS_TODAY' ) ? (string) JUSTICE_TOOLS_TODAY : gmdate( 'Y-m-d' );
}

/** True once the registry's next_update date has come with no newer ceiling row (the ceiling is re-indexed each 1 January). */
function justice_tools_sc_ceiling_unknown( array $sc ): bool {
	$ceil = justice_tools_sc_ceiling( $sc );
	$next = (string) ( $sc['next_update'] ?? '' );
	return '' !== $next && justice_tools_today() >= $next && (string) $ceil['from'] < $next;
}

/** Reg. 6(a): 1% rounded UP to a multiple of 5 ₪, never below 50 ₪ (the same rule as tviot-engine.js). */
function justice_tools_sc_fee( array $sc, float $amount ): float {
	$step = (int) $sc['fee']['round_up_to'] * 100;
	$pct  = (int) round( $amount * 100 ) * (float) $sc['fee']['pct'] / 100;
	$fee  = (int) ( ceil( $pct / $step - 1e-9 ) * $step );
	return max( $fee, (int) $sc['fee']['min'] * 100 ) / 100;
}

/** The 2-3 sentence answer box (page standard A2), every number read from the registry. */
function justice_tools_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'havraa' === $name && ! empty( $reg['havraa'] ) ) {
		$hv     = $reg['havraa'];
		$latest = justice_tools_havraa_latest( $hv );
		$days   = $hv['days'];
		$pub    = justice_tools_public_rate( $hv, (int) $latest['year'] );
		$text   = '<strong>דמי הבראה ' . esc_html( $latest['year'] ) . ' במגזר הפרטי</strong>: ' . justice_tools_money( $latest['rate'] ) . ' ליום הבראה, לפי ' . esc_html( preg_replace( '/^צו הרחבה בדבר השתתפות המעסיק בהוצאות הבראה ונופש, /', 'צו ההרחבה שפורסם ב', (string) $latest['row']['source_he'] ) ) . '. '
			. 'מספר הימים לפי ותק: <bdi>' . (int) $days[0][2] . '</bdi> בשנה הראשונה ועד <bdi>' . (int) $days[ count( $days ) - 1 ][2] . '</bdi> משנה <bdi>' . (int) $days[ count( $days ) - 1 ][0] . '</bdi>, במשרה חלקית באופן יחסי, והזכאות מתחילה רק אחרי שנת עבודה מלאה. '
			. ( $pub ? 'בשירות הציבורי ערך יום ההבראה ל-' . esc_html( $latest['year'] ) . ' הוא ' . justice_tools_money( $pub['rate'], 1 ) . ' (' . esc_html( preg_replace( '/,.*$/', '', (string) $pub['source_he'] ) ) . ', ' . esc_html( $pub['scope_he'] ) . '). ' : '' )
			. 'נבדק ' . esc_html( justice_tools_he_date( $hv['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'tviot-ktanot' === $name && ! empty( $reg['small_claims'] ) ) {
		$sc   = $reg['small_claims'];
		$ceil = justice_tools_sc_ceiling( $sc );
		$f    = $sc['fee'];
		if ( justice_tools_sc_ceiling_unknown( $sc ) ) {
			// Past the 1 January update with no new row: say what was checked, never present it as today's ceiling.
			$text = '<strong>תקרת התביעות הקטנות מתעדכנת ב-1 בינואר לפי המדד</strong>, והתקרה החדשה עוד לא נבדקה כאן. התקרה שנבדקה אחרונה: ' . justice_tools_money( $ceil['amount'], 0 ) . ' מ-' . esc_html( justice_tools_he_date( $ceil['from'] ) ) . '. '
				. 'האגרה היא <bdi>' . esc_html( (string) $f['pct'] ) . '%</bdi> מסכום התביעה, מעוגלת כלפי מעלה לכפולה של <bdi>' . (int) $f['round_up_to'] . '</bdi> ₪, ולא פחות מ-' . justice_tools_money( $f['min'], 0 ) . ' (' . esc_html( $f['section'] ) . ' לתקנות שיפוט בתביעות קטנות). '
				. 'בדקו את התקרה העדכנית באתר ' . esc_html( $sc['publisher_he'] ) . '. נבדק ' . esc_html( justice_tools_he_date( $sc['checked_on'] ) ) . '.';
			return '<div class="jtool-answer"><p>' . $text . '</p></div>';
		}
		if ( 'fee' === $mode ) {
			$example = (float) ( justice_tools_snapshot( 'tviot-ktanot' )['input']['amount'] ?? 0 );
			$text    = '<strong>אגרת תביעה קטנה</strong> היא <bdi>' . esc_html( (string) $f['pct'] ) . '%</bdi> מסכום התביעה, מעוגלת כלפי מעלה לכפולה של <bdi>' . (int) $f['round_up_to'] . '</bdi> ₪ ולא פחות מ-' . justice_tools_money( $f['min'], 0 ) . ': על ' . justice_tools_money( $example, 0 ) . ' משלמים ' . justice_tools_money( justice_tools_sc_fee( $sc, $example ), 0 )
				. ', ועל התקרה, ' . justice_tools_money( $ceil['amount'], 0 ) . ' (מ-' . esc_html( justice_tools_he_date( $ceil['from'] ) ) . '), ' . justice_tools_money( justice_tools_sc_fee( $sc, (float) $ceil['amount'] ), 0 ) . '. '
				. 'המקור: ' . esc_html( $f['section'] ) . ' ל' . esc_html( $f['regulation_he'] ) . ' ומדריך האגרות של ' . esc_html( $sc['publisher_he'] ) . '. נבדק ' . esc_html( justice_tools_he_date( $sc['checked_on'] ) ) . '.';
			return '<div class="jtool-answer"><p>' . $text . '</p></div>';
		}
		$text = '<strong>תביעה קטנה אפשר להגיש עד ' . justice_tools_money( $ceil['amount'], 0 ) . '</strong> מ-' . esc_html( justice_tools_he_date( $ceil['from'] ) ) . ' (הודעת מנהל בתי המשפט, <bdi>' . esc_html( justice_tools_he_date( $ceil['notice_date'] ) ) . '</bdi>). '
			. 'האגרה היא <bdi>' . esc_html( (string) $f['pct'] ) . '%</bdi> מסכום התביעה, מעוגלת כלפי מעלה לכפולה של <bdi>' . (int) $f['round_up_to'] . '</bdi> ₪, ולא פחות מ-' . justice_tools_money( $f['min'], 0 ) . ' (' . esc_html( $f['section'] ) . ' לתקנות שיפוט בתביעות קטנות). '
			. 'רק יחיד יכול לתבוע, כולל עוסק פטור או מורשה; חברה בע"מ לא. נבדק ' . esc_html( justice_tools_he_date( $sc['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
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

function justice_tools_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'havraa' === $name ) {
		$latest = justice_tools_havraa_latest( $reg['havraa'] ?? array() );
		return number_format( $latest['rate'], 2 ) . ' ₪ לשנת ' . $latest['year'] . ' · נבדק ' . justice_tools_he_date( $reg['havraa']['checked_on'] ?? '' );
	}
	if ( 'tviot-ktanot' === $name ) {
		$sc   = $reg['small_claims'] ?? array();
		$ceil = justice_tools_sc_ceiling( $sc );
		if ( 'fee' === $mode ) {
			return $sc['fee']['pct'] . '% · מינימום ' . $sc['fee']['min'] . ' ₪ · נבדק ' . justice_tools_he_date( $sc['checked_on'] ?? '' );
		}
		return 'תקרה ' . number_format( (float) $ceil['amount'] ) . ' ₪ מ-' . justice_tools_he_date( $ceil['from'] ) . ' · נבדק ' . justice_tools_he_date( $sc['checked_on'] ?? '' )
			. ( justice_tools_sc_ceiling_unknown( $sc ) ? ' · ייתכן שהתקרה התעדכנה' : '' );
	}
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
	if ( 'havraa' === $name ) {
		$hv  = $reg['havraa'];
		$out = array(
			array( 'name' => $hv['order_he'], 'url' => $hv['order_url'], 'text' => 'סעיף 5(א): ימים לפי ותק; 5(ב): שנה ראשונה; 5(ג): משרה חלקית; 5(ד): תשלום ב' . $hv['payment_months_he'] . '; 6: היעדרויות; 7(א): ביטול הגבלת השנתיים. נבדק ' . $checked . '.' ),
		);
		foreach ( $hv['private_rates'] as $row ) {
			$out[] = array( 'name' => $row['source_he'], 'url' => $row['url'], 'text' => number_format( (float) $row['rate'], 2 ) . ' ₪ ליום הבראה, ' . $row['label_he'] . '. נבדק ' . $checked . '.' );
		}
		foreach ( $hv['deductions'] as $d ) {
			$out[] = array( 'name' => $d['law_he'] . ' (' . $d['gazette_he'] . ')', 'url' => $d['url'], 'text' => 'הקפאת המחיר, ניכוי של יום הבראה אחד ב-' . $d['year'] . ' (חצי יום לשכר עד ' . number_format( (float) $d['half_salary_max'] ) . ' ₪ ב' . $d['half_months_he'] . '), והחלק שנוכה לא משולם אחר כך: ' . $d['sections'] . '.' );
		}
		foreach ( $hv['public_rates'] as $p ) {
			$out[] = array( 'name' => $p['source_he'], 'url' => $p['url'], 'text' => 'להשוואה בלבד: ' . number_format( (float) $p['rate'], 1 ) . ' ₪ ליום ב-' . $p['year'] . ' (' . $p['scope_he'] . ').' );
		}
		$out[] = array( 'name' => $hv['limitation_he'], 'url' => $hv['limitation_url'], 'text' => $hv['limitation_years'] . ' שנות התיישנות מיום שנולדה העילה.' );
		$out[] = array( 'name' => $hv['labor_court_he'], 'url' => $hv['labor_court_url'], 'text' => 'תביעה בין עובד למעסיק מוגשת לבית הדין האזורי לעבודה.' );
		return $out;
	}
	if ( 'tviot-ktanot' === $name ) {
		$sc   = $reg['small_claims'];
		$ceil = justice_tools_sc_ceiling( $sc );
		$dl   = $sc['deadlines'];
		return array(
			array( 'name' => $ceil['source_he'], 'url' => $ceil['url'], 'text' => number_format( (float) $ceil['amount'] ) . ' ₪ מ-' . justice_tools_he_date( $ceil['from'] ) . '. נבדק ' . $checked . '.' ),
			array( 'name' => $sc['fee']['regulation_he'], 'url' => $sc['fee']['regulation_url'], 'text' => 'תקנה 2: מקום השיפוט; 3: תוכן כתב התביעה; 4(ב): כתב הגנה תוך ' . $dl['defence_days'] . ' יום; 6(א): אגרה ' . $sc['fee']['pct'] . '%, מעוגלת כלפי מעלה לכפולה של ' . $sc['fee']['round_up_to'] . ' ₪, לפחות ' . $sc['fee']['min'] . ' ₪; 7(ב1): מסירה בידי התובע ' . $dl['plaintiff_service_days_before'] . ' יום לפני הדיון; 12: ביטול החלטה תוך ' . $dl['set_aside_days'] . ' יום.' ),
			array( 'name' => $sc['law_he'], 'url' => $sc['law_url'], 'text' => 'סעיף 60: מי תובע ועל מה, ויותר מ-' . $sc['max_claims_per_year'] . ' תביעות בשנה; 63: ייצוג ברשות בית המשפט; 64: ערעור ברשות.' ),
			array( 'name' => $sc['source_name'], 'url' => $sc['source_url'], 'text' => 'מדריך האגרות: התקרה והאגרה. נבדק ' . $checked . '.' ),
			array( 'name' => 'הרשות השופטת, הגשת תביעה קטנה', 'url' => $sc['service_url'], 'text' => 'מי יכול לתבוע; בדיקת מסירה וזימון עדים ' . $dl['service_check_days_before'] . ' יום לפני הדיון; מתורגמן ' . $dl['interpreter_days_before'] . ' ימים לפני; הגשה מקוונת עד ' . $sc['online_max_plaintiffs'] . ' תובעים ו-' . $sc['online_max_defendants'] . ' נתבעים.' ),
			array( 'name' => $sc['limitation_he'], 'url' => $sc['limitation_url'], 'text' => $sc['limitation_years'] . ' שנות התיישנות מיום שנולדה העילה.' ),
			array( 'name' => $sc['labor_court_he'], 'url' => $sc['labor_court_url'], 'text' => 'סכסוך בין עובד למעסיק: בית הדין לעבודה, לא תביעות קטנות.' ),
		);
	}
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

/** The numbered stage bar of a combined tool; each stage is a link to its part of the instrument. */
function justice_tools_stages_html( array $tool, string $id ): string {
	if ( empty( $tool['stages'] ) ) {
		return '';
	}
	$items = '';
	foreach ( $tool['stages'] as $i => $stage ) {
		$target = in_array( $stage[1], array( 'result', 'next' ), true ) ? $id . '-' . $stage[1] : $stage[1];
		$items .= '<li><a href="#' . esc_attr( $target ) . '"><span class="jtool-stages__n" aria-hidden="true">' . ( $i + 1 ) . '</span><span class="jtool-stages__t">' . esc_html( $stage[0] ) . '</span></a></li>';
	}
	return '<nav class="jtool-stages" aria-label="שלבי הכלי"><ol>' . $items . '</ol></nav>';
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
	$atts    = shortcode_atts( array( 'name' => '', 'answer' => '1', 'mode' => '' ), $atts, 'justice_tool' );
	$name    = sanitize_key( (string) $atts['name'] );
	$catalog = justice_tools_catalog();
	$mode    = sanitize_key( (string) $atts['mode'] );
	if ( '' !== $mode && ! isset( $catalog[ $name ]['modes'][ $mode ] ) ) {
		$mode = '';
	}
	$snap = justice_tools_snapshot( $name, $mode );
	// One instrument per tool per page: two copies would share field ids and one share link.
	if ( ! isset( $catalog[ $name ] ) || empty( $snap['form'] ) || isset( $printed[ $name ] ) ) {
		return '';
	}
	$printed[ $name ] = true;
	$tool = justice_tools_tool( $name, $mode );
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
	$primary  = $tool['primary'];
	$more     = '';
	if ( $rehearse && empty( $primary['rehearse'] ) ) {
		$more .= '<a href="' . esc_url( $rehearse ) . '" target="_blank" rel="noopener" data-act="rehearse">' . esc_html( $tool['rehearse']['label'] ) . '</a>';
	}
	foreach ( $tool['more'] ?? array() as $link ) {
		$more .= isset( $link['url'] )
			? '<a href="' . esc_url( $link['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $link['label'] ) . '</a>'
			: '<a href="' . esc_url( home_url( $link['path'] ) ) . '">' . esc_html( $link['label'] ) . '</a>';
	}
	$more .= '<a href="' . esc_url( home_url( $tool['lawyer']['path'] ) ) . '" data-act="lawyer">' . esc_html( $tool['lawyer']['label'] ) . '</a>';
	// The primary next step: an action in the tool (letter, CSV), the rehearsal, or another page.
	if ( ! empty( $primary['rehearse'] ) && $rehearse ) {
		$primary_html = '<a class="jtool-btn jtool-btn--primary" href="' . esc_url( $rehearse ) . '" target="_blank" rel="noopener" data-act="rehearse">' . esc_html( $primary['label'] ) . '</a>';
	} elseif ( isset( $primary['path'] ) ) {
		$primary_html = '<a class="jtool-btn jtool-btn--primary" href="' . esc_url( home_url( $primary['path'] ) ) . '">' . esc_html( $primary['label'] ) . '</a>';
	} else {
		$primary_html = '<button class="jtool-btn jtool-btn--primary" type="button" data-act="' . esc_attr( $primary['act'] ?? '' ) . '">' . esc_html( $primary['label'] ) . '</button>';
	}

	$actions = '<div class="jtool-actions">'
		. '<button class="jtool-btn" type="button" data-act="link">העתקת קישור (בלי פרטים אישיים)</button>'
		. '<button class="jtool-btn" type="button" data-act="whatsapp">וואטסאפ</button>'
		. '<button class="jtool-btn" type="button" data-act="copy">העתקת התוצאה</button>'
		. '<button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button>'
		. '<button class="jtool-btn" type="button" data-act="save">שמירה במכשיר הזה</button>'
		. '</div><p class="jtool-toast" data-jtool-toast role="status" aria-live="polite"></p>';

	// The tool title is a heading by role, not an <h2> tag: a plugin outside this repo inserts the page's
	// "בעמוד הזה" table of contents right before the first <h2> in the content, and with an <h2> title it
	// landed inside the tool card and pushed the form below the fold (HAD-487). The TOC now starts after the tool.
	$html  = '1' === (string) $atts['answer'] ? justice_tools_answer( $name, $mode ) : '';
	$html .= '<section class="jtool" id="' . esc_attr( $id ) . '" data-jtool="' . esc_attr( $name ) . '"' . ( '' !== $mode ? ' data-jtool-mode="' . esc_attr( $mode ) . '"' : '' ) . ' data-jtool-data="' . esc_attr( $id ) . '-data" aria-labelledby="' . esc_attr( $id ) . '-title">'
		. '<div class="jtool__head"><div><div class="jtool__title" role="heading" aria-level="2" id="' . esc_attr( $id ) . '-title">' . esc_html( $tool['title'] ) . '</div><p class="jtool__promise">' . esc_html( $tool['promise'] ) . '</p></div>'
		. '<a class="jtool-stamp" href="#' . esc_attr( $id ) . '-sources"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>' . esc_html( justice_tools_stamp( $name, $mode ) ) . '</a></div>'
		. justice_tools_stages_html( $tool, $id )
		. '<p class="jtool-scope" data-jtool-shared hidden style="margin:12px 24px 0 !important">נפתח מקישור שיתוף. התשובות נטענו מהקישור ולא נשמרו אצלנו, והחישוב רץ שוב עם הנתונים העדכניים.</p>'
		. '<p class="jtool-scope" data-jtool-saved hidden style="margin:12px 24px 0 !important">יש חישוב שמור במכשיר הזה. <button class="jtool-linkbtn" type="button" data-act="restore">לטעון אותו</button> <button class="jtool-linkbtn" type="button" data-act="clear">למחוק</button></p>'
		. '<div class="jtool__body"><div class="jtool-form" role="group" aria-label="' . esc_attr( 'הנתונים ל' . $tool['name'] ) . '" data-jtool-form>' . $snap['form'] . '</div>'
		. '<div class="jtool-result" id="' . esc_attr( $id ) . '-result" data-jtool-result>' . $snap['result'] . '</div></div>'
		. '<div class="jtool-details" data-jtool-details>' . $snap['details'] . '</div>'
		. '<div class="jtool-details">' . $actions . '</div>'
		. '<div class="jtool-next" id="' . esc_attr( $id ) . '-next"><p class="jtool-next__text">' . esc_html( $tool['next_text'] ) . '</p><div class="jtool-next__cta">'
		. $primary_html
		. '<div class="jtool-next__more">' . $more . '</div></div></div>'
		. '<details class="jtool-sources" id="' . esc_attr( $id ) . '-sources"><summary>מקורות (נבדקו ב-' . esc_html( justice_tools_he_date( $reg['checked_on'] ?? '' ) ) . ')</summary>' . justice_tools_sources_html( $name ) . '</details>'
		. '<p class="jtool-foot">מידע כללי, לא ייעוץ משפטי. מה שהקלדתם לא נשמר אצלנו. החישוב נבנה על ידי צוות Jus-Tice.</p>'
		. '<div class="jtool-sticky" data-show="0"><span>' . esc_html( $tool['sticky'] ) . '</span><strong data-jtool-sticky-figure>' . justice_tools_money( $snap['total'], 'tviot-ktanot' === $name ? 0 : 2 ) . '</strong><a href="#' . esc_attr( $id ) . '-result">פרטים</a></div>'
		. '</section>'
		. '<script type="application/json" id="' . esc_attr( $id ) . '-data">' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP ) . '</script>'
		. justice_tools_webapp_schema( $name, $tool );
	return $html;
}
add_shortcode( 'justice_tool', 'justice_tools_shortcode' );

/** T03 current numbers: the day price per havraa year (private, with the statutory deduction; public for comparison) and the days table. */
function justice_tools_havraa_numbers_html( array $hv ): string {
	$latest = justice_tools_havraa_latest( $hv );
	$first  = (int) $latest['year'] - (int) $hv['limitation_years'];
	$rows   = '';
	for ( $year = (int) $latest['year']; $year >= $first; $year-- ) {
		$price = null;
		foreach ( $hv['private_rates'] as $r ) {
			if ( $r['from'] <= $year . '-07-01' ) {
				$price = $r;
			}
		}
		if ( ! $price ) {
			continue;
		}
		$ded = null;
		foreach ( $hv['deductions'] as $d ) {
			if ( (int) $d['year'] === $year ) {
				$ded = $d;
			}
		}
		$pub   = justice_tools_public_rate( $hv, $year );
		$rows .= '<tr><td data-th="שנת ההבראה"><bdi>' . $year . '</bdi></td><td data-th="מגזר פרטי, ליום">' . justice_tools_money( $price['rate'] ) . '</td><td data-th="בתוקף מ">' . esc_html( $price['label_he'] ) . '</td>'
			. '<td data-th="ניכוי לפי החוק">' . ( $ded ? 'יום אחד (חצי בשכר עד ' . justice_tools_money( $ded['half_salary_max'], 0 ) . '), <a href="' . esc_url( $ded['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $ded['gazette_he'] ) . '</a>' : 'אין' ) . '</td>'
			. '<td data-th="שירות ציבורי, להשוואה">' . ( $pub ? justice_tools_money( $pub['rate'], 1 ) . ' (' . esc_html( $pub['scope_he'] ) . ')' : '—' ) . '</td>'
			. '<td data-th="מקור"><a href="' . esc_url( $price['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $price['source_he'] ) . '</a></td></tr>';
	}
	$days = '';
	foreach ( $hv['days'] as $band ) {
		$label = $band[0] === $band[1] ? 'שנה ' . $band[0] : ( null === $band[1] ? 'משנה ' . $band[0] . ' ואילך' : 'שנים ' . $band[0] . ' עד ' . $band[1] );
		$days .= '<tr><td data-th="שנת העבודה">' . esc_html( $label ) . '</td><td data-th="ימי הבראה"><bdi>' . (int) $band[2] . '</bdi></td><td data-th="סכום במשרה מלאה, ' . esc_attr( $latest['year'] ) . '">' . justice_tools_money( $band[2] * $latest['rate'] ) . '</td><td data-th="מקור"><a href="' . esc_url( $hv['order_url'] ) . '" target="_blank" rel="noopener">סעיף 5(א) לצו</a></td></tr>';
	}
	return '<div class="jtool-page"><h3>מחיר יום הבראה לפי שנה</h3><div class="jtool-datawrap"><table class="jtool-datatable"><caption>כל שנה לפי המחיר ב-1 ביולי שלה (חודשי התשלום: ' . esc_html( $hv['payment_months_he'] ) . '). ב-2024 וב-2025 החוק הקפיא את המחיר וחייב לנכות יום הבראה.</caption><thead><tr><th scope="col">שנת ההבראה</th><th scope="col">מגזר פרטי, ליום</th><th scope="col">בתוקף מ</th><th scope="col">ניכוי לפי החוק</th><th scope="col">שירות ציבורי, להשוואה</th><th scope="col">מקור</th></tr></thead><tbody>' . $rows . '</tbody></table></div>'
		. '<h3>ימי הבראה לפי ותק במגזר הפרטי, ושוויים ב-' . esc_html( $latest['year'] ) . '</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">שנת העבודה</th><th scope="col">ימי הבראה</th><th scope="col">סכום במשרה מלאה, ' . esc_html( $latest['year'] ) . '</th><th scope="col">מקור</th></tr></thead><tbody>' . $days . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול צווי ההרחבה בילקוט הפרסומים, ספר החוקים, אגף החשב הכללי ומשרד החינוך ב-' . esc_html( justice_tools_he_date( $hv['checked_on'] ) ) . '.</p></div>';
}

/** T05 current numbers: the ceiling, the fee rule and every deadline, each with its source. */
function justice_tools_sc_numbers_html( array $sc ): string {
	$ceil = justice_tools_sc_ceiling( $sc );
	$dl   = $sc['deadlines'];
	$reg  = '<a href="' . esc_url( $sc['fee']['regulation_url'] ) . '" target="_blank" rel="noopener">';
	$law  = '<a href="' . esc_url( $sc['law_url'] ) . '" target="_blank" rel="noopener">';
	$svc  = '<a href="' . esc_url( $sc['service_url'] ) . '" target="_blank" rel="noopener">';
	$from = esc_html( justice_tools_he_date( $ceil['from'] ) );
	$rows = array(
		array( 'תקרת התביעה', justice_tools_money( $ceil['amount'], 0 ), $from, '<a href="' . esc_url( $ceil['url'] ) . '" target="_blank" rel="noopener">הודעת מנהל בתי המשפט, ' . esc_html( justice_tools_he_date( $ceil['notice_date'] ) ) . '</a>' ),
		array( 'אגרה', '<bdi>' . esc_html( (string) $sc['fee']['pct'] ) . '%</bdi> מסכום התביעה', $from, $reg . 'תקנה 6(א)(1)</a>' ),
		array( 'עיגול האגרה', 'כלפי מעלה לכפולה של ' . justice_tools_money( $sc['fee']['round_up_to'], 0 ), $from, $reg . 'תקנה 6(א)(3)</a>' ),
		array( 'אגרה מינימלית', justice_tools_money( $sc['fee']['min'], 0 ), $from, $reg . 'תקנה 6(א)(2)</a>' ),
		array( 'תביעות בשנה באותו בית משפט', 'יותר מ-<bdi>' . (int) $sc['max_claims_per_year'] . '</bdi>: בית המשפט רשאי להעביר', $from, $law . 'סעיף 60(ב)</a>' ),
		array( 'כתב הגנה', '<bdi>' . (int) $dl['defence_days'] . '</bdi> יום מהמסירה', $from, $reg . 'תקנה 4(ב)</a>' ),
		array( 'בדיקת מסירה וזימון עדים', '<bdi>' . (int) $dl['service_check_days_before'] . '</bdi> יום לפני הדיון', $from, $svc . 'הרשות השופטת</a>' ),
		array( 'מסירה בידי התובע', '<bdi>' . (int) $dl['plaintiff_service_days_before'] . '</bdi> יום לפני הדיון', $from, $reg . 'תקנה 7(ב1)</a>' ),
		array( 'בקשה למתורגמן', '<bdi>' . (int) $dl['interpreter_days_before'] . '</bdi> ימים לפני הדיון', $from, $svc . 'הרשות השופטת</a>' ),
		array( 'ביטול החלטה שניתנה בהיעדר', '<bdi>' . (int) $dl['set_aside_days'] . '</bdi> יום', $from, $reg . 'תקנה 12</a>' ),
		array( 'גוף כתב התביעה', 'עד <bdi>' . (int) $sc['claim_body_max_pages'] . '</bdi> עמודים', $from, $reg . 'תקנה 3(ה)</a>' ),
		array( 'הגשה מקוונת', 'עד <bdi>' . (int) $sc['online_max_plaintiffs'] . '</bdi> תובעים ו-<bdi>' . (int) $sc['online_max_defendants'] . '</bdi> נתבעים', $from, $svc . 'הרשות השופטת</a>' ),
		array( 'התיישנות', '<bdi>' . (int) $sc['limitation_years'] . '</bdi> שנים מיום שנולדה העילה', $from, '<a href="' . esc_url( $sc['limitation_url'] ) . '" target="_blank" rel="noopener">חוק ההתיישנות, סעיפים 5(1) ו-6</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="הכלל">' . $r[1] . '</td><td data-th="נכון ל">' . $r[2] . '</td><td data-th="מקור">' . $r[3] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>הסכומים והמועדים בתביעות קטנות, מ-' . $from . '</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">נכון ל</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול הרשות השופטת, התקנות וחוק בתי המשפט ב-' . esc_html( justice_tools_he_date( $sc['checked_on'] ) ) . '. התקרה מתעדכנת ב-1 בינואר.</p></div>';
}

/** Current-numbers table (page standard A5): every row has a value, valid-from date and source. */
function justice_tools_numbers_html( string $name ): string {
	$reg = justice_tools_registry();
	if ( 'havraa' === $name ) {
		return justice_tools_havraa_numbers_html( $reg['havraa'] );
	}
	if ( 'tviot-ktanot' === $name ) {
		return justice_tools_sc_numbers_html( $reg['small_claims'] );
	}
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
	if ( 'tviot-ktanot' === $name ) {
		$snap = justice_tools_snapshot( 'tviot-ktanot' );
		return '<div class="jtool-page">' . ( $snap['compare_table'] ?? '' ) . '</div>';
	}
	if ( 'havraa' === $name ) {
		// Last year against this year, per seniority band: what reached the worker (after the statutory deduction) vs today.
		$hv     = justice_tools_registry()['havraa'];
		$latest = justice_tools_havraa_latest( $hv );
		$prev   = (int) $latest['year'] - 1;
		$pprice = null;
		foreach ( $hv['private_rates'] as $r ) {
			if ( $r['from'] <= $prev . '-07-01' ) {
				$pprice = (float) $r['rate'];
			}
		}
		$ded = 0;
		foreach ( $hv['deductions'] as $d ) {
			if ( (int) $d['year'] === $prev ) {
				$ded = (float) $d['days'];
			}
		}
		$body      = '';
		$prev_head = $prev . ( $ded ? ', אחרי הניכוי' : '' );
		foreach ( $hv['days'] as $band ) {
			$label = $band[0] === $band[1] ? 'שנה ' . $band[0] : ( null === $band[1] ? 'משנה ' . $band[0] : 'שנים ' . $band[0] . '-' . $band[1] );
			$a     = round( $band[2] * $pprice - $ded * $pprice, 2 );
			$b     = round( $band[2] * $latest['rate'], 2 );
			$body .= '<tr><td data-th="ותק">' . esc_html( $label ) . ' (<bdi>' . (int) $band[2] . '</bdi> ימים)</td><td data-th="' . esc_attr( $prev_head ) . '">' . justice_tools_money( $a ) . '</td><td data-th="' . esc_attr( $latest['year'] ) . '">' . justice_tools_money( $b ) . '</td><td data-th="תוספת">' . justice_tools_money( $b - $a ) . '</td></tr>';
		}
		return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>דמי הבראה במשרה מלאה: ' . $prev . ' (' . number_format( $pprice, 2 ) . ' ₪ ליום' . ( $ded ? ', פחות יום שנוכה לפי החוק' : '' ) . ') מול ' . esc_html( $latest['year'] ) . ' (' . number_format( $latest['rate'], 2 ) . ' ₪ ליום)</caption><thead><tr><th scope="col">ותק</th><th scope="col">' . esc_html( $prev_head ) . '</th><th scope="col">' . esc_html( $latest['year'] ) . '</th><th scope="col">תוספת</th></tr></thead><tbody>' . $body . '</tbody></table></div></div>';
	}
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
	$atts = shortcode_atts( array( 'name' => '', 'part' => '', 'mode' => '' ), $atts, 'justice_tool_section' );
	$name = sanitize_key( (string) $atts['name'] );
	if ( ! isset( justice_tools_catalog()[ $name ] ) ) {
		return '';
	}
	$mode = sanitize_key( (string) $atts['mode'] );
	$mode = isset( justice_tools_catalog()[ $name ]['modes'][ $mode ] ) ? $mode : '';
	$reg  = justice_tools_registry();
	$snap = justice_tools_snapshot( $name, $mode );
	switch ( (string) $atts['part'] ) {
		case 'method':
			return '<div class="jtool-page jtool-method"><p>לדוגמה, ' . esc_html( $snap['sentence'] ?? '' ) . ' כך הכלי מחשב את זה, שורה אחרי שורה:</p>' . ( $snap['method'] ?? '' ) . ( $snap['method_table'] ?? '' ) . '</div>';
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
		foreach ( array_merge( array( '' ), array_keys( $tool['modes'] ?? array() ) ) as $mode ) {
			$t      = justice_tools_tool( $name, $mode );
			$cards .= '<a class="jtool-card" href="' . esc_url( home_url( $t['page'] ) ) . '"><strong>' . esc_html( $t['name'] ) . '</strong><span>' . esc_html( $t['question'] ) . '</span><small>' . esc_html( justice_tools_stamp( $name, $mode ) ) . '</small></a>';
		}
	}
	return '<div class="jtool-page jtool-cards">' . $cards . '</div>';
}
add_shortcode( 'justice_tools_index', 'justice_tools_index_shortcode' );
