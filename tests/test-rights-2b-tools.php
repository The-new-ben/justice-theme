<?php
/**
 * The rights wave 2B (22.10.2026, HAD-585): the registry datasets, the catalog, the server HTML and the result-first card
 * of the old-age pension (kitzbat-zikna), reserve-duty pay (tagmulei-miluim), the child allowance (kitzbat-yeladim) and
 * income support (havtachat-hachnasa).
 *
 * Run: php tests/test-rights-2b-tools.php
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
$lead    = $jt_shortcodes['justice_tool_lead'] ?? null;
$catalog = justice_tools_catalog();
$reg     = justice_tools_registry();
$btl     = $reg['rights_btl']['basic_amount'] ?? array();

$homes = array(
	'kitzbat-zikna'      => array( '/elder-law-israel/', 'rights_zikna' ),
	'tagmulei-miluim'    => array( '/miluim-dismissal-protection/', 'rights_miluim' ),
	'kitzbat-yeladim'    => array( '/kitzbat-yeladim/', 'rights_yeladim' ),
	'havtachat-hachnasa' => array( '/havtachat-hachnasa/', 'rights_havtacha' ),
);

/* ---------- The registry: the Institute's published 2026 figures, and the identities that tie them to the basic amounts ---------- */
$z = $reg['rights_zikna'] ?? array();
check( 1838 === ( $z['amounts']['basic'] ?? 0 ) && 1838 === ( $z['amounts']['published']['single'] ?? 0 ), 'rights_zikna: the basic old-age pension 1,838 from 1.1.2026' );
check( 50 === ( $z['seniority']['max_pct'] ?? 0 ) && 2757 === ( $z['income_test']['top_example'] ?? 0 ) && abs( 1838 * 1.5 - 2757 ) < 0.001, 'rights_zikna: 1,838 x 150% = 2,757 (the maximum-seniority example of the Institute)' );
check( 10113 === ( $z['income_test']['single'] ?? 0 ) && 14402 === ( $z['income_test']['end_single'] ?? 0 ) && 7848 === ( $z['spouse']['income_limit'] ?? 0 ), 'rights_zikna: the income test 10,113 / 14,402 and the spouse income limit 7,848' );
$m = $reg['rights_miluim'] ?? array();
check( abs( (float) ( $m['pay']['max_daily'] ?? 0 ) - 1730.33 ) < 0.001 && abs( round( 10382 * 5 / 30, 2 ) - 1730.33 ) < 0.001, 'rights_miluim: the maximum 1,730.33 = 10,382 x 5 / 30 (s.270)' );
check( abs( (float) ( $m['pay']['min_daily'] ?? 0 ) - 328.76 ) < 0.001, 'rights_miluim: the minimum 328.76 a day from 1.1.2026' );
$y = $reg['rights_yeladim'] ?? array();
check( 173 === ( $btl['b2_child_first_fifth'] ?? 0 ) && 219 === ( $btl['b2_child_second_to_fourth'] ?? 0 ) && 58 === ( $y['savings']['monthly'] ?? 0 ), 'rights_yeladim: 173 / 219 a child (rights_btl) and 58 to the savings' );
$h = $reg['rights_havtacha'] ?? array();
check( 2076 === ( $h['amounts']['b']['single'] ?? 0 ) && 4049 === ( $h['amounts']['b']['parent2'] ?? 0 ) && 46138 === ( $h['car']['limit'] ?? 0 ), 'rights_havtacha: single 2,076, single parent with 2 children 4,049, the car limit 46,138' );
check( abs( round( 10382 * 0.39 ) - 4049 ) < 0.001, 'rights_havtacha: 39% x 10,382 = 4,049 (basic amount 3)' );
foreach ( $homes as $name => $home ) {
	$d = $reg[ $home[1] ] ?? array();
	check( '2026-10-21' === ( $d['checked_on'] ?? '' ) && 0 === strpos( (string) ( $d['source_url'] ?? '' ), 'https://' ), "{$home[1]}: checked on 21.10.2026 with an https source" );
	check( false === mb_strpos( wp_json_encode( $d, JSON_UNESCAPED_UNICODE ), 'כל זכות' ) && false === strpos( wp_json_encode( $d ), 'kolzchut' ), "{$home[1]}: no private-portal name or link in the dataset" );
}

/* ---------- The catalog ---------- */
foreach ( $homes as $name => $home ) {
	$t = $catalog[ $name ] ?? array();
	check( $home[0] === ( $t['page'] ?? '' ) && in_array( $home[1], $t['data'] ?? array(), true ) && 0 === strpos( (string) ( $t['lawyer']['path'] ?? '' ), '/' ), "{$name}: home page, dataset and lawyer path" );
	check( ! empty( $t['rehearse']['topic'] ) && ! empty( $t['rehearse']['purpose'] ), "{$name}: the rehearsal entry has a topic and a purpose" );
	foreach ( $t['more'] ?? array() as $link ) {
		check( isset( $link['path'] ) ? 0 === strpos( $link['path'], '/' ) : 0 === strpos( (string) $link['url'], 'https://' ), "{$name}: next-step link {$link['label']}" );
	}
}

/* ---------- The server HTML ---------- */
$examples = array(
	'kitzbat-zikna'      => array( '2,225', '2,757', '9.2.2028' ),
	'tagmulei-miluim'    => array( '15,400', '1,730.33', '328.76', '30.12.2026' ),
	'kitzbat-yeladim'    => array( '611', '174', '7,332' ),
	'havtachat-hachnasa' => array( '3,540', '4,049', '30.11.2026' ),
);
foreach ( $homes as $name => $home ) {
	justice_tools_printed( '', true );
	$html = $tool( array( 'name' => $name ) );
	$w    = answer_words( $html );
	check( false !== strpos( $html, 'class="jtool-answer"' ) && $w >= 40 && $w <= 110, "{$name}: the answer box, 40-110 words ({$w})" );
	check( false !== strpos( $html, 'data-jtool="' . $name . '"' ) && false !== strpos( $html, 'id="jtool-' . $name . '-data"' ) && false !== strpos( $html, '"@type":"WebApplication"' ), "{$name}: the instrument, the data island and the WebApplication schema" );
	check( isset( $GLOBALS['jt_enqueued'][ 'justice-tool-' . $name ] ) && false !== strpos( (string) $GLOBALS['jt_enqueued'][ 'justice-tool-' . $name ], '/assets/js/tools/dist/' . $name . '.js' ), "{$name}: the bundle is enqueued" );
	check( is_readable( JUSTICE_THEME_DIR . '/assets/js/tools/dist/' . $name . '.js' ), "{$name}: the bundle file exists" );
	check( 0 === preg_match( '/<h2[\s>]/', $html ), "{$name}: no <h2> inside the instrument" );
	check( false === strpos( $html, 'undefined' ) && false === strpos( $html, 'NaN' ), "{$name}: no undefined or NaN in the server HTML" );
	check( false === mb_strpos( $html, 'כל זכות' ) && false === mb_strpos( $html, 'רוטנברג' ) && false === strpos( $html, 'kolzchut' ), "{$name}: no private-portal name and no reviewer line" );
	check( false !== strpos( $html, 'data-act="rehearse"' ) && false !== strpos( $html, 'jus-tice.com/#/simulation' ), "{$name}: the simulation link (the handoff falls back to it)" );
	foreach ( $examples[ $name ] as $figure ) {
		check( false !== strpos( $html, $figure ), "{$name}: the example figure {$figure} is in the server HTML" );
	}
	$sources = justice_tools_sources( $name );
	check( count( $sources ) >= 6, "{$name}: at least 6 official sources (" . count( $sources ) . ')' );
	foreach ( $sources as $s ) {
		check( 0 === strpos( (string) $s['url'], 'https://' ) && '' !== trim( (string) $s['text'] ) && false === mb_strpos( (string) $s['text'] . $s['name'], 'כל זכות' ) && false === strpos( (string) $s['url'], 'kolzchut' ), "{$name}: source {$s['name']} has an official https url and a text" );
		// A raw web address in the text has no break point and pushed the 1280 page sideways (HAD-585 polish).
		check( false === strpos( (string) $s['text'], 'http' ) && 0 === preg_match( '/\S{45,}/u', (string) $s['text'] ), "{$name}: source {$s['name']} has no raw web address or unbreakable run in its text" );
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
	// The result-first card ([justice_tool_lead]): the example's headline figure and the jump to the tool, no heading.
	$card = is_callable( $lead ) ? $lead( array( 'name' => $name ) ) : '';
	check( false !== strpos( $card, 'data-jtool-lead="' . $name . '"' ) && false !== strpos( $card, $examples[ $name ][0] ) && false !== strpos( $card, 'href="#jtool-' . $name . '"' ), "{$name}: the result-first card carries {$examples[ $name ][0]} and the jump to the tool" );
	check( 0 === preg_match( '/<h[1-6][\s>]/', $card ) && false === strpos( $card, 'undefined' ) && false === strpos( $card, 'NaN' ), "{$name}: the card has no heading and no undefined / NaN" );
}
check( '' === ( is_callable( $lead ) ? $lead( array( 'name' => 'dmei-bituach' ) ) : 'x' ), 'the card stays off the wave-1 tools' );
foreach ( array_keys( $homes ) as $name ) {
	check( in_array( $name, justice_tools_rights_names(), true ) && in_array( $name, justice_tools_rights2b_names(), true ), "{$name}: merged into the rights names" );
}
// The print rule of the family + land wave (jt43) hides the result only inside its own tool (HAD-585 fixed the scope).
$css = (string) file_get_contents( JUSTICE_THEME_DIR . '/assets/css/justice-tools.css' );
check( 0 === preg_match( '/^\s*\.jtool \.jtool-result,\s*\.jtool \.jt43-screen/m', $css ) && false !== strpos( $css, '.jtool[data-jtool="yeduim-batzibur"] .jtool-result' ), 'the jt43 print rule is scoped to yeduim-batzibur' );

echo "rights wave 2B tools (PHP): {$passed} passed, {$failures} failed\n";
exit( $failures ? 1 : 0 );
