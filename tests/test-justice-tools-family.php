<?php
/**
 * Family tools (HAD-506): the registry datasets, and the server HTML of [justice_tool] / [justice_tool_section] for
 * child support (with the CPI and National Insurance parts), property balancing, the prenup draft and the divorce
 * agreement with its parenting plan.
 *
 * Run: php tests/test-justice-tools-family.php
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'JUSTICE_THEME_DIR', dirname( __DIR__ ) );
define( 'JUSTICE_THEME_URI', 'https://jus-tice.co.il/wp-content/themes/justice-theme' );
define( 'JUSTICE_THEME_VERSION', 'test' );

$jt_shortcodes = array();
$jt_enqueued   = array();
function add_shortcode( $tag, $cb ): void { global $jt_shortcodes; $jt_shortcodes[ $tag ] = $cb; }
function add_action( $tag, $cb, $priority = 10, $args = 1 ): void {}
function shortcode_atts( $pairs, $atts, $tag = '' ) { $atts = (array) $atts; $out = array(); foreach ( $pairs as $k => $v ) { $out[ $k ] = array_key_exists( $k, $atts ) ? $atts[ $k ] : $v; } return $out; }
function sanitize_key( $key ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $key ) ); }
function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $u ) { return (string) $u; }
function home_url( $path = '' ) { return 'https://jus-tice.co.il' . $path; }
function get_permalink() { return 'https://jus-tice.co.il/child-support/'; }
function wp_json_encode( $data, $flags = 0 ) { return json_encode( $data, $flags ); }
function wp_enqueue_style( $h, $src = '', $deps = array(), $ver = false ) { global $jt_enqueued; $jt_enqueued[ $h ] = $src; }
function wp_enqueue_script( $h, $src = '', $deps = array(), $ver = false, $footer = false ) { global $jt_enqueued; $jt_enqueued[ $h ] = $src; }
function is_singular( $t = '' ) { return false; }

require_once dirname( __DIR__ ) . '/inc/justice-tools.php';

// A tool prints once per page, so each tool or mode renders in a child run of its own, the way its page will.
if ( in_array( '--render', $argv ?? array(), true ) ) {
	echo $jt_shortcodes['justice_tool']( array( 'name' => (string) $argv[2], 'mode' => '-' === ( $argv[3] ?? '-' ) ? '' : (string) $argv[3] ) );
	echo "
<!--ENQUEUED " . implode( ',', array_keys( $jt_enqueued ) ) . '-->';
	exit( 0 );
}
/** The server HTML of one tool or mode, rendered in a child run. */
function render_tool( string $name, string $mode = '' ): string {
	$cmd = escapeshellarg( PHP_BINARY ) . ' ' . escapeshellarg( __FILE__ ) . ' --render ' . escapeshellarg( $name ) . ' ' . escapeshellarg( '' === $mode ? '-' : $mode );
	return (string) shell_exec( $cmd );
}

$failures = 0;
function check( bool $ok, string $what ): void {
	global $failures;
	if ( ! $ok ) {
		$failures++;
		fwrite( STDERR, "FAIL: {$what}\n" );
	}
}
/** Words in the answer box (Hebrew and numbers, split on spaces). */
function answer_words( string $html ): int {
	if ( ! preg_match( '#<div class="jtool-answer"><p>(.*?)</p></div>#s', $html, $m ) ) {
		return 0;
	}
	return count( preg_split( '/\s+/u', trim( html_entity_decode( strip_tags( $m[1] ) ) ) ) );
}

$reg  = justice_tools_registry();
$snap = justice_tools_snapshots();
$tool = $jt_shortcodes['justice_tool'];
$sec  = $jt_shortcodes['justice_tool_section'];

/* ---------- Registry ---------- */
foreach ( array( 'child_support', 'property_balance', 'prenup', 'divorce_agreement' ) as $k ) {
	$d = $reg[ $k ] ?? array();
	check( '2026-10-14' === ( $d['checked_on'] ?? '' ) && 0 === strpos( (string) ( $d['source_url'] ?? '' ), 'https://' ) && (int) ( $d['refresh_every_days'] ?? 0 ) > 0, "{$k}: https source, checked 14.10.2026, refresh period" );
}
check( 4049 === $reg['child_support']['nii']['rows'][2]['under55'] && 'woman2' === $reg['child_support']['nii']['rows'][2]['key'], 'NII: 4,049 for a woman with two children' );
check( 446 === $reg['prenup']['routes']['notary']['fee'] && 541 === $reg['prenup']['routes']['court']['fee'] && 536 === $reg['divorce_agreement']['routes']['rabbinical']['fee'], 'fees: notary 446, family court 541, rabbinical court 536' );

/* ---------- Each tool and mode on its own page ---------- */
$pages = array(
	array( 'mezonot', '', 3, array( 'בע"מ 919/15', '1,300 עד 1,400', '<bdi>30%</bdi>', '<bdi>40%</bdi>', '1,500 ₪', '2,250 ₪' ), 'purpose=mediation' ),
	array( 'mezonot', 'madad', 3, array( 'מדד המחירים לצרכן', 'כל שלושה חודשים', 'אוגוסט 2026' ), 'data-act="ics"' ),
	array( 'izun', '', 2, array( 'סעיף 5', 'סעיף 6', 'סעיף 5א', '<bdi>9</bdi>' ), 'purpose=court_rehearsal' ),
	array( 'izun', 'hon', 2, array( '16405-09-19', 'סעיף 8(3)' ), 'purpose=court_rehearsal' ),
	array( 'heskem-mamon', '', 2, array( '446 ₪', '541 ₪', '536 ₪', 'מזונות ילדים' ), 'data-act="copydoc"' ),
	array( 'heskem-gerushin', '', 5, array( '541 ₪', '536 ₪', 'סעיף 24', 'פסקה 83' ), 'purpose=mediation' ),
	array( 'heskem-gerushin', 'horut', 5, array( 'סעיף 24', 'סעיף 25', 'עד גיל 6' ), 'purpose=mediation' ),
);
foreach ( $pages as list( $name, $mode, $sets, $facts, $next ) ) {
	$label = $name . ( $mode ? "/{$mode}" : '' );
	$html  = render_tool( $name, $mode );
	$words = answer_words( $html );
	check( $words >= 40 && $words <= 60, "{$label}: answer box of 40-60 words ({$words})" );
	foreach ( $facts as $f ) {
		check( false !== strpos( $html, $f ), "{$label}: the page says {$f}" );
	}
	check( false !== strpos( $html, $next ), "{$label}: the next step ({$next})" );
	check( 1 === substr_count( $html, '"@type":"WebApplication"' ) && false === strpos( $html, 'FAQPage' ) && false === stripos( $html, 'aggregateRating' ), "{$label}: one WebApplication, no FAQPage, no rating" );
	$card = substr( $html, (int) strpos( $html, '<section class="jtool"' ) );
	check( false === stripos( substr( $card, 0, (int) strpos( $card, '</section>' ) ), '<h2' ), "{$label}: no <h2> inside the tool card (HAD-487)" );
	check( false === stripos( $html, 'noindex' ) && false === stripos( $html, 'maya' ) && false === strpos( $html, 'רוטנברג' ) && false === strpos( $html, '<form' ), "{$label}: no noindex, no card or name inside the tool, no form gate" );
	check( 1 === preg_match( '#<script type="application/json" id="jtool-' . preg_quote( $name, '#' ) . '-data">(.*?)</script>#s', $html, $mm ) && count( json_decode( $mm[1], true ) ) === $sets, "{$label}: the data island carries its {$sets} datasets only" );
	check( false !== strpos( $html, 'justice-tool-' . $name . ',' ) || false !== strpos( $html, 'justice-tool-' . $name . '-->' ), "{$label}: bundle enqueued" );
	check( false !== strpos( $html, '"dateModified":"2026-10-14"' ) && false !== strpos( $html, 'נבדק 14.10.2026' ), "{$label}: the check date in the schema and the stamp" );
	$s  = '' === $mode ? $snap[ $name ] : $snap[ $name ][ $mode ];
	check( ! empty( $s['sticky'] ) && false !== strpos( $html, '<strong data-jtool-sticky-figure>' . $s['sticky'] . '</strong>' ), "{$label}: the sticky bar shows the example's own figure" );
	if ( '' !== $mode ) {
		check( false !== strpos( $html, 'data-jtool-mode="' . $mode . '"' ), "{$label}: the mode reaches the client" );
	}
	$t = justice_tools_tool( $name, $mode );
	check( 0 === preg_match( '/20\d\d/', $t['title'] . $t['name'] . $t['question'] ), "{$label}: no year in the title, the name or the question" );
}
$mz = render_tool( 'mezonot' );
check( false !== strpos( $mz, 'https://jus-tice.com/#/simulation' ) && false !== strpos( $mz, 'topic=divorce' ), 'mezonot: the rehearsal is the mediation world of the simulation' );
check( false !== strpos( $mz, 'jt16-shares' ) && false !== strpos( $mz, 'jt16-strip' ), 'mezonot: the two shares and the night strip in the server HTML' );
$mm = render_tool( 'heskem-mamon' );
check( false !== strpos( render_tool( 'izun' ), 'jt17-beam' ) && false !== strpos( $mm, 'jt18-gates' ) && false !== strpos( render_tool( 'heskem-gerushin' ), 'jt19-cal' ), 'izun, mamon, heskem: the picture of each tool in the server HTML' );
check( false !== strpos( $mm, 'jt18-doc' ) && false !== strpos( $mm, 'data-act="copydoc"' ) && false === strpos( $mm, 'download=' ), 'mamon: a copyable draft, no fake download' );

/* ---------- Page sections ---------- */
$nii = $sec( array( 'name' => 'mezonot', 'part' => 'nii' ) );
check( false !== strpos( $nii, '4,049' ) && false !== strpos( $nii, '5,289' ) && false !== strpos( $nii, '1.1.2026' ) && false !== strpos( $nii, 'btl.gov.il' ), 'nii section: the 1.1.2026 table with its source' );
$needs = $sec( array( 'name' => 'mezonot', 'part' => 'needs' ) );
check( substr_count( $needs, 'https://www.gov.il/' ) >= 8 && false !== strpos( $needs, '17791-01-22' ) && false !== strpos( $needs, '2,250' ), 'needs section: eight judgments, each with its gov.il link' );
check( '' === $sec( array( 'name' => 'izun', 'part' => 'nii' ) ), 'the nii part belongs to the child-support tool only' );
$want = array(
	'mezonot'         => array( 'פסקה 61', '<td data-th="הכלל">כ-1,300 עד 1,400', 'תקנה 45' ),
	'izun'            => array( 'סעיף 5(ג)', '1398/11', '3462/23', 'סעיף 14' ),
	'heskem-mamon'    => array( 'פרט 11(א)', '526 ש&quot;ח', 'סעיף 89(ו)', '5620/24' ),
	'heskem-gerushin' => array( 'פרט 6א', 'פרט 4(2)', 'סעיף 2(ד)', 'סעיף 25' ),
);
foreach ( $want as $name => $facts ) {
	$n = $sec( array( 'name' => $name, 'part' => 'numbers' ) );
	foreach ( $facts as $f ) {
		check( false !== strpos( $n, $f ), "{$name} numbers: {$f}" );
	}
	check( false !== strpos( $sec( array( 'name' => $name, 'part' => 'compare' ) ), 'jtool-datatable' ), "{$name}: the compare table" );
	$src = $sec( array( 'name' => $name, 'part' => 'sources' ) );
	check( substr_count( $src, 'https://' ) >= 5, "{$name}: five or more official sources" );
	check( false !== strpos( $sec( array( 'name' => $name, 'part' => 'updated' ) ), '14.10.2026' ), "{$name}: the updated line" );
}
$ms = $sec( array( 'name' => 'mezonot', 'part' => 'sources' ) );
check( false !== strpos( $ms, 'supremedecisions.court.gov.il' ) && false !== strpos( $ms, 'nevo.co.il/law_html/law00/71532.htm' ) && false !== strpos( $ms, 'עותק שפורסם, לא במאגר הרשמי' ), 'mezonot sources: the ruling, the 1959 law, and the Hadera copy marked unofficial' );

/* ---------- The hub ---------- */
$index = $jt_shortcodes['justice_tools_index']();
foreach ( array( '/child-support/', '/resource-balancing/', '/prenuptial-agreement/', '/divorce-agreement/', '/parenting-time-arrangements/' ) as $p ) {
	check( false !== strpos( $index, 'https://jus-tice.co.il' . $p ), "hub card: {$p}" );
}

if ( $failures ) {
	fwrite( STDERR, "justice family tools: {$failures} failure(s)\n" );
	exit( 1 );
}
echo "justice family tools: ok\n";
