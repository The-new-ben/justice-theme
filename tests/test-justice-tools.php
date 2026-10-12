<?php
/**
 * co.il tools wave 1 (HAD-485): registry integrity, golden values checked on 12.10.2026 against
 * the official publishers, and the server HTML of [justice_tool] / [justice_tool_section].
 *
 * Run: php tests/test-justice-tools.php
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
function get_permalink() { return 'https://jus-tice.co.il/hatzmada-madad/'; }
function wp_json_encode( $data, $flags = 0 ) { return json_encode( $data, $flags ); }
function wp_enqueue_style( $h, $src = '', $deps = array(), $ver = false ) { global $jt_enqueued; $jt_enqueued[ $h ] = $src; }
function wp_enqueue_script( $h, $src = '', $deps = array(), $ver = false, $footer = false ) { global $jt_enqueued; $jt_enqueued[ $h ] = $src; }
function is_singular( $t = '' ) { return false; }

require_once dirname( __DIR__ ) . '/inc/justice-tools.php';

$failures = 0;
function check( bool $ok, string $what ): void {
	global $failures;
	if ( ! $ok ) {
		$failures++;
		fwrite( STDERR, "FAIL: {$what}\n" );
	}
}

/* ---------- Registry: shape, sources, dates ---------- */
$reg = justice_tools_registry();
check( '2026-10-12' === ( $reg['checked_on'] ?? '' ), 'registry carries the day it was checked' );
foreach ( array( 'cpi', 'interest', 'min_wage' ) as $set ) {
	check( ! empty( $reg[ $set ]['source_url'] ) && 0 === strpos( $reg[ $set ]['source_url'], 'https://' ), "{$set} has an official https source" );
	check( ! empty( $reg[ $set ]['checked_on'] ), "{$set} has checked_on" );
	check( (int) ( $reg[ $set ]['refresh_every_days'] ?? 0 ) > 0, "{$set} has a refresh window" );
}
check( false !== strpos( $reg['cpi']['source_url'], 'api.cbs.gov.il' ), 'CPI comes from the CBS API' );
check( false !== strpos( $reg['interest']['source_url'], 'ga.mof.gov.il' ), 'interest rates come from the Accountant General' );
check( false !== strpos( $reg['min_wage']['source_url'], 'btl.gov.il' ), 'minimum wage comes from the National Insurance Institute' );

/* ---------- Golden values, verified against the official source on 12.10.2026 ---------- */
$series = array_column( $reg['cpi']['series'], 1, 0 );
check( '2026-08' === $reg['cpi']['latest_month'], 'latest CPI is August 2026' );
check( 105.8 === (float) $series['2026-08'], 'CPI August 2026 = 105.8 (average 2024 = 100)' );
check( 101.5 === (float) $series['2025-01'], 'CPI January 2025 = 101.5' );
check( 108.7 === (float) $series['2024-11'], 'CPI November 2024 = 108.7 (average 2022 = 100)' );
check( 151.5 === (float) $series['1990-01'], 'CPI January 1990 = 151.5 (average 1987 = 100)' );
$months = array_keys( $series );
for ( $i = 1; $i < count( $months ); $i++ ) {
	if ( justice_tools_shift_month( $months[ $i - 1 ], 1 ) !== $months[ $i ] ) {
		check( false, 'CPI series has no gap at ' . $months[ $i ] );
	}
}
$chain = array_column( $reg['cpi']['bases'], 'to_next', 'id' );
check( 1.074 === (float) $chain['2022'] && 1.059 === (float) $chain['2020'] && 1.003 === (float) $chain['2018'], 'CBS chaining coefficients 2018-2024' );

$last = function ( array $rows ) { return $rows[ count( $rows ) - 1 ]; };
check( '2026-10-01' === $last( $reg['interest']['linked'] )['from'] && 3.82 === (float) $last( $reg['interest']['linked'] )['rate'], 'linked interest 3.82% from 1.10.2026' );
check( 5.36 === (float) $last( $reg['interest']['shekel'] )['rate'], 'shekel interest 5.36% from 1.10.2026' );
check( 4.68 === (float) $last( $reg['interest']['arrears_fee'] )['rate'], 'arrears fee 4.68% from 1.10.2026' );
check( '2025-01-01' === $reg['interest']['linked'][0]['from'] && 3.64 === (float) $reg['interest']['linked'][0]['rate'], 'first quarter of the new regime: linked 3.64%' );

// The regulations' own formulas (תקנות פסיקת ריבית והצמדה, התשפ"ה-2024, sections 2-4) must
// reproduce every published quarter: an internal check that no rate was mistyped.
foreach ( $reg['interest']['shekel'] as $i => $row ) {
	$a = (float) $reg['interest']['value_a'][ $i ]['rate'];
	$b = (float) $reg['interest']['value_b'][ $i ]['rate'];
	$e = (float) $reg['interest']['inflation_expectations'][ $i ]['rate'];
	$s = (float) $row['rate'];
	// A and B are published rounded to 0.01, so the recomputed rate may differ by one agora-point.
	check( abs( $a * 0.25 + $b * 0.75 - $s ) <= 0.0101, "shekel rate = A x 25% + B x 75% for {$row['from']}" );
	check( abs( round( $s - $e, 2 ) - (float) $reg['interest']['linked'][ $i ]['rate'] ) < 0.006, "linked rate = shekel - inflation expectations for {$row['from']}" );
	check( abs( min( round( $s / 2, 2 ) + 2, 6 ) - (float) $reg['interest']['arrears_fee'][ $i ]['rate'] ) < 0.006, "arrears fee = min(shekel/2 + 2, 6) for {$row['from']}" );
}

$mw = $reg['min_wage'];
$now = $last( $mw['rows'] );
check( '2026-04-01' === $now['from'], 'minimum wage row from 1.4.2026' );
check( 6443.85 === (float) $now['monthly'] && 35.4 === (float) $now['hourly_182'] && 34.64 === (float) $now['hourly_186'], 'minimum wage 6,443.85 / 35.40 / 34.64' );
check( 297.4 === (float) $now['daily_5'] && 257.75 === (float) $now['daily_6'], 'daily minimum 297.40 / 257.75' );
check( 6247.67 === (float) $mw['rows'][ count( $mw['rows'] ) - 2 ]['monthly'], 'minimum wage 6,247.67 from 1.4.2025' );
check( array( 'under16' => 70, 'age16' => 75, 'age17' => 83, 'apprentice' => 60 ) === $mw['youth_pct'] && 173 === $mw['youth_hours_divisor'], 'youth percentages and the 173-hour divisor (regs 4-5א)' );
foreach ( $mw['rows'] as $row ) {
	check( abs( round( $row['monthly'] / 25, 2 ) - $row['daily_6'] ) < 0.011, "daily (6 days) = monthly / 25 for {$row['from']}" );
	check( abs( round( $row['monthly'] / 186, 2 ) - $row['hourly_186'] ) < 0.011, "hourly = monthly / 186 for {$row['from']}" );
}

/* ---------- Server HTML ---------- */
$sc = $jt_shortcodes['justice_tool'] ?? null;
check( is_callable( $sc ), '[justice_tool] is registered' );
$html = $sc( array( 'name' => 'hatzmada' ) );
check( false !== strpos( $html, 'class="jtool-answer"' ) && strpos( $html, 'jtool-answer' ) < strpos( $html, 'class="jtool"' ), 'answer box comes before the instrument' );
check( false !== strpos( $html, 'אוגוסט 2026' ) && false !== strpos( $html, '105.8' ) && false !== strpos( $html, '3.82%' ), 'answer box holds the current index and rate from the registry' );
check( false !== strpos( $html, '28,547.33' ), 'the example result is in the server HTML' );
check( false !== strpos( $html, 'סעיף 4א(א)' ) && false !== strpos( $html, '<ol>' ), 'the calculation path with sections is in the server HTML' );
check( false !== strpos( $html, 'טבלת חישוב לבית המשפט' ), 'the court-style table is in the server HTML' );
check( 1 === substr_count( $html, '"@type":"WebApplication"' ), 'exactly one WebApplication block' );
check( false !== strpos( $html, '"price":"0"' ) && false !== strpos( $html, '"inLanguage":"he-IL"' ) && false !== strpos( $html, '"isAccessibleForFree":true' ), 'WebApplication: free, he-IL' );
check( false === strpos( $html, 'FAQPage' ), 'the tool never emits FAQPage (the page FAQ owns it)' );
check( false === stripos( $html, 'aggregateRating' ) && false === stripos( $html, 'reviewedBy' ), 'no rating or reviewer markup' );
check( false === stripos( $html, 'noindex' ) && false === stripos( $html, 'nofollow' ), 'no noindex or nofollow' );
check( false === stripos( $html, 'maya' ) && false === strpos( $html, 'רוטנברג' ), "Maya Rotenberg's cards untouched" );
check( false === strpos( $html, '<form' ) && false === strpos( $html, 'lead_phone' ), 'no lead form and no gate before the result' );
check( 1 === preg_match( '#<script type="application/json" id="jtool-hatzmada-data">(.*?)</script>#s', $html, $m ) && is_array( json_decode( $m[1], true ) ), 'the data island is valid JSON' );
check( isset( $jt_enqueued['justice-tool-hatzmada'], $jt_enqueued['justice-tools'] ), 'bundle and stylesheet enqueued' );
$tool_section = substr( $html, (int) strpos( $html, '<section class="jtool"' ) );
check( false === stripos( substr( $tool_section, 0, (int) strpos( $tool_section, '</section>' ) ), '<h2' ), 'no <h2> inside the tool card, so an injected table of contents lands after the tool (HAD-487)' );
check( false !== strpos( $html, 'role="heading" aria-level="2" id="jtool-hatzmada-title"' ), 'the tool title is still a level-2 heading for screen readers' );
check( '' === $sc( array( 'name' => 'hatzmada' ) ), 'a tool prints once per page' );
check( '' === $sc( array( 'name' => 'nope' ) ), 'unknown tool prints nothing' );
check( false !== strpos( $html, 'jus-tice.com/#/simulation' ) && false !== strpos( $html, 'data-act="rehearse"' ), 'T04 offers the rehearsal after the result (conversion 3)' );
check( strpos( $html, 'data-act="rehearse"' ) > strpos( $html, 'data-jtool-result' ), 'the rehearsal link sits after the result' );

$html2 = $sc( array( 'name' => 'sachar-minimum' ) );
check( false !== strpos( $html2, '6,443.85' ) && false !== strpos( $html2, '35.40' ) && false !== strpos( $html2, '34.64' ), 'T02 answer box from the registry' );
check( false !== strpos( $html2, '5,503.68' ), 'T02 example result in the server HTML' );
check( false === strpos( $html2, 'data-act="rehearse"' ), 'T02 has no rehearsal button (conversion 2)' );
check( false !== strpos( $html2, 'data-act="letter"' ), 'T02 primary next step is the demand letter' );

$sec = $jt_shortcodes['justice_tool_section'];
$numbers = $sec( array( 'name' => 'sachar-minimum', 'part' => 'numbers' ) );
check( false !== strpos( $numbers, '<table' ) && false !== strpos( $numbers, 'בתוקף מ' ) && false !== strpos( $numbers, 'btl.gov.il' ), 'T02 current-numbers table with valid-from and source' );
check( false !== strpos( $numbers, '5,348.40' ) && false !== strpos( $numbers, '30.92' ), 'youth (17) = 83% of 6,443.85 and / 173' );
$tnumbers = $sec( array( 'name' => 'hatzmada', 'part' => 'numbers' ) );
check( false !== strpos( $tnumbers, 'ga.mof.gov.il' ) && false !== strpos( $tnumbers, '3.82%' ) && false !== strpos( $tnumbers, '105.8' ), 'T04 numbers tables from the registry' );
check( false !== strpos( $sec( array( 'name' => 'hatzmada', 'part' => 'compare' ) ), '26,351.35' ), 'T04 comparison table from the engine snapshot' );
check( false !== strpos( $sec( array( 'name' => 'sachar-minimum', 'part' => 'compare' ) ), '6,247.67' ), 'T02 2025 vs 2026 comparison' );
check( false !== strpos( $sec( array( 'name' => 'hatzmada', 'part' => 'method' ) ), '<ol>' ), 'method section is an ordered list' );
check( '' === $sec( array( 'name' => 'hatzmada', 'part' => 'bogus' ) ), 'unknown section prints nothing' );

$snap = justice_tools_snapshots();
check( ( $snap['registry_version'] ?? '' ) === $reg['registry_version'], 'snapshots were built from this registry' );

if ( $failures ) {
	fwrite( STDERR, "justice tools: {$failures} failure(s)\n" );
	exit( 1 );
}
echo "justice tools: ok\n";
