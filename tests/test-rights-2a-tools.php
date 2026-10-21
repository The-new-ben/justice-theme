<?php
/**
 * The rights wave 2A (22.10.2026, HAD-578): the registry datasets, the catalog, and the server HTML of the work grant
 * (maanak-avoda) and the net salary (sachar-neto).
 *
 * Run: php tests/test-rights-2a-tools.php
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
	'maanak-avoda' => array( '/maanak-avoda/', 'rights_maanak', '/tax-lawyer/' ),
	'sachar-neto'  => array( '/net-salary-calculator/', 'rights_neto', '/labor-lawyer/' ),
);

/* ---------- The registry ---------- */
$rm = $reg['rights_maanak'] ?? array();
$y5 = $rm['years']['2025'] ?? array();
check( 2450 === ( $y5['regular']['k12']['floor'] ?? 0 ) && 4260 === ( $y5['regular']['k12']['p1'] ?? 0 ) && 5680 === ( $y5['regular']['k12']['p2'] ?? 0 ) && 7390 === ( $y5['regular']['k12']['ceiling'] ?? 0 ), 'rights_maanak: the 2025 schedule of s.2(1) (2,450 / 4,260 / 5,680 / 7,390)' );
check( 390 === ( $y5['regular']['k12']['max'] ?? 0 ) && 570 === ( $y5['regular']['k3']['max'] ?? 0 ) && 8100 === ( $y5['regular']['k3']['ceiling'] ?? 0 ), 'rights_maanak: the 2025 maxima 390 / 570 and the 3+ ceiling 8,100' );
check( 10260 === ( $y5['max_year'] ?? 0 ) && abs( 570 * 1.5 * 12 - 10260 ) < 0.001, 'rights_maanak: the published annual maximum 10,260 = 570 x 150% x 12' );
check( '2027-12-31' === ( $y5['deadline_online'] ?? '' ) && '2026-12-31' === ( $rm['years']['2024']['deadline_online'] ?? '' ), 'rights_maanak: the online deadlines (2025: 31.12.2027; 2024: 31.12.2026)' );
foreach ( array( 'k12', 'k3' ) as $g ) {
	$s = $y5['regular'][ $g ];
	check( $s['extra_threshold'] === $s['p2'] - $s['p1'], "rights_maanak: the s.4 additional-income line equals p2 - p1 ({$g})" );
	$s = $y5['single'][ $g ];
	check( $s['extra_threshold'] === $s['p2'] - $s['p1'], "rights_maanak: the single-parent additional-income line equals p2 - p1 ({$g})" );
}
check( 0 === strpos( (string) ( $rm['law_url'] ?? '' ), 'https://www.nevo.co.il/' ) && 0 === strpos( (string) ( $rm['claim_url'] ?? '' ), 'https://secapp.taxes.gov.il/' ), 'rights_maanak: the law and the claim links are official' );
$rn = $reg['rights_neto'] ?? array();
check( 9700 === ( $rn['pension_credit']['cap_month'] ?? 0 ) && 35 === ( $rn['pension_credit']['rate'] ?? 0 ) && 7 === ( $rn['pension_credit']['share_pct'] ?? 0 ), 'rights_neto: the pension credit of s.45a (35%, 7%, 9,700)' );
check( 34423 === ( $rn['employer_ceiling']['tagmulim_salary_cap'] ?? 0 ) && 45600 === ( $rn['employer_ceiling']['severance_year_cap'] ?? 0 ) && 15712 === ( $rn['study_fund']['salary_cap'] ?? 0 ), 'rights_neto: the 2026 ceilings 34,423 / 45,600 / 15,712' );
check( 182 === ( $rn['overtime']['divisor'] ?? 0 ) && 125 === ( $rn['overtime']['first_pct'] ?? 0 ) && 150 === ( $rn['overtime']['next_pct'] ?? 0 ) && 47 === ( $rn['second_job']['rate'] ?? 0 ), 'rights_neto: overtime 125% / 150%, divisor 182, a second job at 47%' );

/* ---------- The catalog ---------- */
foreach ( $homes as $name => $home ) {
	$t = $catalog[ $name ] ?? array();
	check( $home[0] === ( $t['page'] ?? '' ) && in_array( $home[1], $t['data'] ?? array(), true ) && $home[2] === ( $t['lawyer']['path'] ?? '' ), "{$name}: home page, dataset and lawyer path" );
	check( ! empty( $t['rehearse']['topic'] ) && ! empty( $t['rehearse']['purpose'] ), "{$name}: the rehearsal entry has a topic and a purpose" );
	foreach ( $t['more'] ?? array() as $link ) {
		check( isset( $link['path'] ) ? 0 === strpos( $link['path'], '/' ) : 0 === strpos( (string) $link['url'], 'https://' ), "{$name}: next-step link {$link['label']}" );
	}
}

/* ---------- The server HTML ---------- */
$examples = array(
	'maanak-avoda' => array( '13,020', '1,085', '6,510', '15.12.2026', '31.12.2027' ),
	'sachar-neto'  => array( '9,815.29', '612.85', '380.90', '470.96' ),
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
	check( false === mb_strpos( $html, 'כל זכות' ) && false === mb_strpos( $html, 'רוטנברג' ), "{$name}: no private-portal name and no reviewer line" );
	check( false !== strpos( $html, 'data-act="rehearse"' ) && false !== strpos( $html, 'jus-tice.com/#/simulation' ), "{$name}: the simulation link (the handoff falls back to it)" );
	foreach ( $examples[ $name ] as $figure ) {
		check( false !== strpos( $html, $figure ), "{$name}: the example figure {$figure} is in the server HTML" );
	}
	$sources = justice_tools_sources( $name );
	check( count( $sources ) >= 4, "{$name}: at least 4 official sources (" . count( $sources ) . ')' );
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
$lead = $jt_shortcodes['justice_tool_lead'] ?? null;
check( is_callable( $lead ), 'the result-first card shortcode is registered' );
foreach ( array( 'maanak-avoda' => '13,020', 'sachar-neto' => '9,815.29' ) as $name => $figure ) {
	$card = $lead( array( 'name' => $name ) );
	check( false !== strpos( $card, 'data-jtool-lead="' . $name . '"' ) && false !== strpos( $card, $figure ) && false !== strpos( $card, 'href="#jtool-' . $name . '"' ), "{$name}: the result-first card carries the example {$figure} and the jump to the tool" );
	check( 0 === preg_match( '/<h[1-6][\s>]/', $card ) && false === strpos( $card, 'undefined' ) && false === strpos( $card, 'NaN' ), "{$name}: the card has no heading and no undefined / NaN" );
}
check( '' === $lead( array( 'name' => 'dmei-bituach' ) ), 'the card is only for the wave-2A tools' );
check( in_array( 'maanak-avoda', justice_tools_rights_names(), true ) && in_array( 'sachar-neto', justice_tools_rights_names(), true ), 'the wave-2A names are merged into the rights names' );

echo "rights wave 2A tools (PHP): {$passed} passed, {$failures} failed\n";
exit( $failures ? 1 : 0 );
