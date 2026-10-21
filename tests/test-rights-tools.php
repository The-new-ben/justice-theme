<?php
/**
 * The rights wave (21.10.2026, HAD-574): the registry datasets, the catalog, and the server HTML of the six instruments
 * (contributions, credit points, tax refund, unemployment, maternity, disability).
 *
 * Run: php tests/test-rights-tools.php
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
function add_filter( $tag, $cb, $priority = 10, $args = 1 ): void {}
function shortcode_atts( $pairs, $atts, $tag = '' ) { $atts = (array) $atts; $out = array(); foreach ( $pairs as $k => $v ) { $out[ $k ] = array_key_exists( $k, $atts ) ? $atts[ $k ] : $v; } return $out; }
function sanitize_key( $key ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $key ) ); }
function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $u ) { return (string) $u; }
function home_url( $path = '' ) { return 'https://jus-tice.co.il' . $path; }
function get_permalink() { return 'https://jus-tice.co.il/unemployment-benefits-eligibility/'; }
function wp_json_encode( $data, $flags = 0 ) { return json_encode( $data, $flags ); }
function wp_enqueue_style( $h, $src = '', $deps = array(), $ver = false ) { global $jt_enqueued; $jt_enqueued[ $h ] = $src; }
function wp_enqueue_script( $h, $src = '', $deps = array(), $ver = false, $footer = false ) { global $jt_enqueued; $jt_enqueued[ $h ] = $src; }
function is_singular( $t = '' ) { return false; }

require_once dirname( __DIR__ ) . '/inc/justice-tools.php';

$failures = 0;
$passed   = 0;
function check( bool $ok, string $what ): void {
	global $failures, $passed;
	if ( ! $ok ) {
		$failures++;
		fwrite( STDERR, "FAIL: {$what}\n" );
		return;
	}
	$passed++;
}
function answer_words( string $html ): int {
	if ( ! preg_match( '#<div class="jtool-answer"><p>(.*?)</p></div>#s', $html, $m ) ) {
		return 0;
	}
	return count( preg_split( '/\s+/u', trim( html_entity_decode( strip_tags( $m[1] ) ) ) ) );
}

$tool    = $jt_shortcodes['justice_tool'];
$section = $jt_shortcodes['justice_tool_section'];
$catalog = justice_tools_catalog();
$reg     = justice_tools_registry();

$homes = array(
	'dmei-bituach'   => array( '/national-insurance-calculator/', 'rights_bituach', '/national-insurance-attorney/' ),
	'nekudot-zikui'  => array( '/nekudot-zikui/', 'rights_tax', '/tax-lawyer/' ),
	'hechzer-mas'    => array( '/guide-tax-calculator-updated-2025/', 'rights_tax', '/tax-lawyer/' ),
	'dmei-avtala'    => array( '/unemployment-benefits-eligibility/', 'rights_avtala', '/labor-lawyer/' ),
	'dmei-leida'     => array( '/maternity-allowance/', 'rights_leida', '/labor-lawyer/' ),
	'kitzbat-nechut' => array( '/general-disability-pension-2026/', 'rights_nechut', '/national-insurance-attorney/' ),
);

/* ---------- The registry ---------- */
$btl = $reg['rights_btl'] ?? array();
check( 13566 === ( $btl['avg_wage']['s1_benefits'] ?? 0 ) && 13769 === ( $btl['avg_wage']['s2_contributions'] ?? 0 ) && '2026-01-01' === ( $btl['from'] ?? '' ), 'rights_btl: the 2026 average wage, s.1 13,566 and s.2 13,769, from 1.1.2026' );
check( 10514 === ( $btl['basic_amount']['b1'] ?? 0 ) && 10382 === ( $btl['basic_amount']['b3'] ?? 0 ) && 11352 === ( $btl['basic_amount']['b4'] ?? 0 ), 'rights_btl: basic amounts 1, 3 and 4 for 2026' );
check( 0 === strpos( (string) ( $btl['law_url'] ?? '' ), 'https://www.btl.gov.il/' ), 'rights_btl: the law link is the Institute\'s own text (the old nevo link was dead)' );
foreach ( array_unique( array_column( $homes, 1 ) ) as $key ) {
	$ds = $reg[ $key ] ?? array();
	check( '2026-10-21' === ( $ds['checked_on'] ?? '' ) && 0 === strpos( (string) ( $ds['source_url'] ?? '' ), 'https://' ) && ( $ds['refresh_every_days'] ?? 0 ) > 0 && ! empty( $ds['next_update'] ), "{$key}: an https source, the check date, a refresh period and the next update" );
}
check( '2026-10-21' === ( $reg['registry_version'] ?? '' ), 'the registry version is the wave day' );
$json = json_encode( array_intersect_key( $reg, array_flip( array( 'rights_btl', 'rights_bituach', 'rights_tax', 'rights_avtala', 'rights_leida', 'rights_nechut' ) ) ), JSON_UNESCAPED_UNICODE );
check( false === mb_strpos( (string) $json, 'כל זכות' ) && false === mb_strpos( (string) $json, 'כל-זכות' ) && false === stripos( (string) $json, 'kolzchut' ), 'no rights dataset names the private rights portal' );

/* ---------- The catalog ---------- */
foreach ( $homes as $name => $home ) {
	$t = $catalog[ $name ] ?? array();
	check( ! empty( $t ), "catalog: {$name}" );
	check( $home[0] === ( $t['page'] ?? '' ) && $home[1] === ( $t['dataset'] ?? '' ) && in_array( $home[1], $t['data'] ?? array(), true ) && in_array( 'rights_btl', $t['data'] ?? array(), true ), "{$name}: page {$home[0]}, dataset {$home[1]} and the shared figures in the data island" );
	check( $home[2] === ( $t['lawyer']['path'] ?? '' ) && in_array( $t['rehearse']['purpose'] ?? '', array( 'mediation', 'court_rehearsal', 'witness_prep' ), true ), "{$name}: the lawyer link and a supported rehearsal" );
	foreach ( $t['more'] ?? array() as $link ) {
		check( isset( $link['url'] ) ? 0 === strpos( $link['url'], 'https://' ) : 0 === strpos( $link['path'], '/' ), "{$name}: every link is a path or an https url" );
	}
}

/* ---------- The server HTML of every instrument ---------- */
$examples = array(
	// The example each lane pre-fills, as the lane's golden tests compute it by hand (the figure in the server HTML).
	'dmei-bituach'   => array( '1,095.26', '520.90', '574.36', '825.98' ),
	'nekudot-zikui'  => array( '9.25', '2,238.50', '26,862' ),
	'hechzer-mas'    => array( '9,102.80' ),
	'dmei-avtala'    => array( '284.06', '39,200.28' ),
	'dmei-leida'     => array( '52,500', '946' ),
	'kitzbat-nechut' => array( '7,157' ),
);
foreach ( $homes as $name => $home ) {
	justice_tools_printed( '', true );
	$html = $tool( array( 'name' => $name ) );
	$w    = answer_words( $html );
	check( false !== strpos( $html, 'class="jtool-answer"' ) && $w >= 40 && $w <= 110, "{$name}: the answer box, 40-110 words ({$w})" );
	check( false !== strpos( $html, 'data-jtool="' . $name . '"' ) && false !== strpos( $html, 'id="jtool-' . $name . '-data"' ) && false !== strpos( $html, '"@type":"WebApplication"' ), "{$name}: the instrument, the data island and the WebApplication schema" );
	check( isset( $GLOBALS['jt_enqueued'][ 'justice-tool-' . $name ] ) && false !== strpos( (string) $GLOBALS['jt_enqueued'][ 'justice-tool-' . $name ], '/assets/js/tools/dist/' . $name . '.js' ), "{$name}: the bundle is enqueued" );
	check( is_readable( JUSTICE_THEME_DIR . '/assets/js/tools/dist/' . $name . '.js' ), "{$name}: the bundle file exists" );
	check( 0 === preg_match( '/<h2[\s>]/', $html ), "{$name}: no <h2> inside the instrument (the table-of-contents injector keys on it)" );
	check( false === strpos( $html, 'undefined' ) && false === strpos( $html, 'NaN' ), "{$name}: no undefined or NaN in the server HTML" );
	check( false === mb_strpos( $html, 'כל זכות' ) && false === mb_strpos( $html, 'רוטנברג' ), "{$name}: no private-portal name and no reviewer line in the instrument" );
	foreach ( $examples[ $name ] as $figure ) {
		check( false !== strpos( $html, $figure ), "{$name}: the example figure {$figure} is in the server HTML" );
	}
	$sources = justice_tools_sources( $name );
	check( count( $sources ) >= 3, "{$name}: at least 3 official sources (" . count( $sources ) . ')' );
	foreach ( $sources as $s ) {
		check( 0 === strpos( (string) $s['url'], 'https://' ) && '' !== trim( (string) $s['text'] ) && false === mb_strpos( (string) $s['text'] . $s['name'], 'כל זכות' ), "{$name}: source {$s['name']} has an https url and a text" );
	}
	$stamp = justice_tools_stamp( $name );
	check( false !== mb_strpos( $stamp, 'נבדק 21.10.2026' ), "{$name}: the stamp carries the check date ({$stamp})" );
	$cmp = $section( array( 'name' => $name, 'part' => 'compare' ) );
	check( false !== strpos( $cmp, '<table' ) && false !== strpos( $cmp, '<caption' ), "{$name}: the page table renders from the registry" );
	$method = $section( array( 'name' => $name, 'part' => 'method' ) );
	check( false !== strpos( $method, '<ol' ), "{$name}: the computation path renders" );
	justice_tools_printed( '', true );
	$again = $tool( array( 'name' => $name ) ) . $tool( array( 'name' => $name ) );
	check( 1 === substr_count( $again, 'data-jtool="' . $name . '"' ), "{$name}: one instrument per render pass" );
}

echo "rights tools (PHP): {$passed} passed, {$failures} failed\n";
exit( $failures ? 1 : 0 );
