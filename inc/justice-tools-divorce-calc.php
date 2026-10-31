<?php
/**
 * The divorce calculator and price list (31.10.2026, HAD-616): one instrument on /divorce-lawyer/, in the prices chapter.
 *
 *   [justice_tool name="machshevon-gerushin"]                        "מחשבון גירושין": what a divorce costs by route
 *                                                                     (consent, mediation, a compromise half way, a full
 *                                                                     dispute), forum, open subjects, experts and the steps
 *                                                                     after the judgment: low, expected and high, each side's
 *                                                                     share, VAT, the time, what raises and lowers the bill,
 *                                                                     and the four routes side by side
 *   [justice_tool_section name="machshevon-gerushin" part="compare"]  "מחירון גירושין": the price list, every official row
 *                                                                     of the family-law schedules and every market range,
 *                                                                     each with its source and the day it was read
 * Every number is read from assets/data/justice-tools-registry.json: fl_mechiron (built by tools/justice_tools_fl_mechiron.py;
 * each official amount stored with the registry path it was resolved from) and divorce_cost (VAT, the statutory clock, the
 * scope), or from the snapshot the build renders from them.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_divcalc_names(): array {
	return array( 'machshevon-gerushin' );
}

/** The catalog entry, merged into justice_tools_catalog(). */
function justice_tools_divcalc_catalog(): array {
	return array(
		// Bundle: 'machshevon-gerushin' => array( 'instrument.js', 'machshevon-engine.js', 'machshevon-ui.js' ) (every top-level
		// name in machshevon-engine.js starts with "mg"; the UI's names do not collide with instrument.js).
		'machshevon-gerushin' => array(
			'name'      => 'מחשבון גירושין ומחירון גירושין',
			'title'     => 'מחשבון גירושין: כמה יעלו הגירושין שלכם, לפי מסלול, ערכאה ומה שפתוח ביניכם',
			'promise'   => 'בהסכמה, בגישור, בפשרה באמצע הדרך או במחלוקת מלאה, בבית הדין הרבני או בבית המשפט לענייני משפחה: עלות נמוכה, צפויה וגבוהה, החלק של כל צד, מע"מ, כמה זמן, מה מייקר ומה יוזיל, וארבעת המסלולים זה לצד זה. אגרות לפי התקנות, שכר טרחה ומומחים לפי מה שמשרדים מפרסמים.',
			'question'  => 'כמה עולה להתגרש, לפי המסלול והערכאה שלכם?',
			'page'      => '/divorce-lawyer/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'divorce_cost', 'fl_mechiron' ),
			'dataset'   => 'fl_mechiron',
			'next_text' => 'הצעד הבא: לחשב את המזונות ואת איזון המשאבים, ולבקש מעורך הדין הצעת שכר טרחה בכתב לפי שלבים',
			'primary'   => array( 'label' => 'למחירון הגירושין המלא', 'path' => '/divorce-lawyer/#mechiron-gerushin' ),
			'rehearse'  => array( 'label' => 'לתרגל את הגישור על הילדים, המזונות והדירה', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'עלויות גירושין ושכר טרחה: ההסבר המלא', 'path' => '/divorce-costs-2025/' ),
				array( 'label' => 'אגרות בתי הדין הרבניים', 'path' => '/fees-rabbinical-courts/' ),
				array( 'label' => 'תקנות הדיינים (אגרות), נוסח עדכני', 'url' => 'https://www.nevo.co.il/law_html/law00/70297.htm' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין גירושין', 'path' => '/lawyers/?area=family-law' ),
			'sticky'    => 'צפוי לשניכם',
		),
	);
}

/** The answer box: one paragraph, every figure from the snapshot (computed by the same engine from the registry). */
function justice_tools_divcalc_answer( string $name, string $mode = '' ): string {
	$reg  = justice_tools_registry();
	$snap = justice_tools_snapshot( $name );
	if ( 'machshevon-gerushin' !== $name || empty( $reg['fl_mechiron'] ) || empty( $snap['answer'] ) ) {
		return '';
	}
	$a    = $snap['answer'];
	$text = '<strong>מחשבון גירושין</strong> מחבר שלושה סוגי עלות: אגרות שקבועות בתקנות, שכר טרחה ומומחים. '
		. 'בהסכמה, לפי ' . (int) $a['agree_n'] . ' פרסומי משרדים, עריכת הסכם גירושין עולה ' . justice_tools_money( $a['agree_low'], 0 ) . ' עד ' . justice_tools_money( $a['agree_high'], 0 ) . ' לכל צד לפני מע"מ, '
		. 'ועליה אגרת אישור של ' . justice_tools_money( $a['rb_agreement'], 0 ) . ' בבית הדין הרבני או ' . justice_tools_money( $a['fam_agreement'], 0 ) . ' בבית המשפט לענייני משפחה, ו-' . justice_tools_money( $a['certificate'], 0 ) . ' לתעודת גירושין לכל צד. '
		. 'הליך מלא במחלוקת: ' . justice_tools_money( $a['contested_low'], 0 ) . ' עד ' . justice_tools_money( $a['contested_high'], 0 ) . ' לצד, לפני מע"מ של <bdi>' . (int) $a['vat'] . '%</bdi>. '
		. 'נבדק ' . esc_html( justice_tools_he_date( $reg['fl_mechiron']['checked_on'] ) ) . ' על ידי הצוות המשפטי של Justice.';
	return '<div class="jtool-answer"><p>' . $text . '</p></div>';
}

/** The data stamp in the tool's header. */
function justice_tools_divcalc_stamp( string $name, string $mode = '' ): string {
	$m = justice_tools_registry()['fl_mechiron'] ?? array();
	return 'תקנות האגרות 2026 · התעריף המינימלי · פרסומי משרדים · נבדק ' . justice_tools_he_date( (string) ( $m['checked_on'] ?? '' ) );
}

/** Official sources used by the instrument's result and by the price list. */
function justice_tools_divcalc_sources( string $name ): array {
	$reg = justice_tools_registry();
	$m   = $reg['fl_mechiron'] ?? array();
	$out = array();
	foreach ( $m['sources'] ?? array() as $s ) {
		$out[] = array( 'name' => $s['name_he'], 'url' => $s['url'], 'text' => $s['text_he'] );
	}
	$markets = 0;
	foreach ( $m['market'] ?? array() as $row ) {
		foreach ( $row['sources'] ?? array() as $s ) {
			if ( 'not_checked' !== ( $s['status'] ?? '' ) ) {
				$markets++;
			}
		}
	}
	$out[] = array( 'name' => 'פרסומי משרדים, מגשרים ומומחים', 'url' => home_url( '/divorce-lawyer/#mechiron-gerushin' ), 'text' => $markets . ' מקורות שוק, כל אחד עם קישור, ציטוט קצר ותאריך קריאה, במחירון הגירושין שבעמוד. טווחים, לא מחירון ולא התחייבות של משרד כלשהו. נקראו ' . justice_tools_he_date( (string) ( $m['checked_on'] ?? '' ) ) . '.' );
	return $out;
}

/** The price list, rendered by the build from the registry. */
function justice_tools_divcalc_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}
