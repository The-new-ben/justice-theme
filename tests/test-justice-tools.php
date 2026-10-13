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

// A child run renders only the fee-only page, the way /small-claims-fee-calculator/ will (a page of its own).
if ( in_array( '--fee-only', $argv ?? array(), true ) ) {
	$html = $jt_shortcodes['justice_tool']( array( 'name' => 'tviot-ktanot', 'mode' => 'fee' ) );
	$ok   = false !== strpos( $html, 'data-jtool-mode="fee"' )
		&& false !== strpos( $html, '<bdi>400</bdi>' )
		&& false !== strpos( $html, 'מחשבון אגרת תביעה קטנה' )
		&& false !== strpos( $html, '1% · מינימום 50 ₪' )
		&& false !== strpos( $html, '/small-claims-court-israel/' )
		&& 1 === substr_count( $html, '"@type":"WebApplication"' )
		&& false === strpos( $html, 'FAQPage' )
		&& false === strpos( $html, 'jtool-stages' );
	echo $ok ? 'FEE-OK' : 'FEE-FAIL';
	exit( 0 );
}

// A child run on 2.1.2027: the 2026 ceiling is past its update date and no new row exists.
if ( in_array( '--after-update', $argv ?? array(), true ) ) {
	define( 'JUSTICE_TOOLS_TODAY', '2027-01-02' );
	$html = $jt_shortcodes['justice_tool']( array( 'name' => 'tviot-ktanot' ) );
	$box  = substr( $html, 0, (int) strpos( $html, '<section' ) );
	$ok   = false !== strpos( $box, 'מתעדכנת ב-1 בינואר' ) && false === strpos( $box, 'אפשר להגיש עד' ) && false !== strpos( $html, 'ייתכן שהתקרה התעדכנה' );
	echo $ok ? 'AFTER-OK' : 'AFTER-FAIL';
	exit( 0 );
}

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

/* ---------- Wave 2 (HAD-490): registry values checked against the official sources on 12.10.2026 ---------- */
foreach ( array( 'havraa', 'small_claims' ) as $set ) {
	check( ! empty( $reg[ $set ]['source_url'] ) && 0 === strpos( $reg[ $set ]['source_url'], 'https://www.gov.il/' ), "{$set} has an official gov.il source" );
	check( '2026-10-12' === ( $reg[ $set ]['checked_on'] ?? '' ) && (int) ( $reg[ $set ]['refresh_every_days'] ?? 0 ) > 0, "{$set} has checked_on and a refresh window" );
}
$hv = $reg['havraa'];
check( array( array( 1, 1, 5 ), array( 2, 3, 6 ), array( 4, 10, 7 ), array( 11, 15, 8 ), array( 16, 19, 9 ), array( 20, null, 10 ) ) === $hv['days'], 'havraa days by seniority 5/6/7/8/9/10 (order, Yalkut HaPirsumim 7417, s.5(א))' );
$prices = array_column( $hv['private_rates'], 'rate', 'from' );
check( array( '2014-01-01' => 378.0, '2023-07-01' => 418.0, '2026-01-01' => 451.5 ) === array_map( 'floatval', $prices ), 'havraa day price: 378 from 2014, 418 from 1.7.2023 (Yalkut 11651), 451.50 for 2026 (Yalkut 14863)' );
foreach ( $hv['private_rates'] as $row ) {
	check( 0 === strpos( $row['url'], 'https://www.gov.il/' ), "havraa price {$row['from']} links to gov.il" );
}
$ded = array_column( $hv['deductions'], null, 'year' );
check( 1 === $ded[2024]['days'] && 6000 === $ded[2024]['half_salary_max'] && true === $ded[2024]['half_requires_five_days'], '2024 law: one day, half a day for 5-day workers on up to 6,000 ₪ (Sefer HaChukim 3180)' );
check( 1 === $ded[2025]['days'] && 6150 === $ded[2025]['half_salary_max'] && false === $ded[2025]['half_requires_five_days'] && 418.0 === (float) $ded[2025]['price_min'] && 471.4 === (float) $ded[2025]['price_max'], '2025 law: one day, half a day up to 6,150 ₪, day price between 418 and 471.4 (Sefer HaChukim 3384)' );
check( false !== strpos( $ded[2024]['url'], 'fs.knesset.gov.il' ) && false !== strpos( $ded[2025]['url'], 'fs.knesset.gov.il' ), 'the havraa laws link to the Knesset (Sefer HaChukim)' );
$pub = array_column( $hv['public_rates'], 'rate', 'year' );
check( 471.4 === (float) $pub[2024] && 471.4 === (float) $pub[2025] && 511.6 === (float) $pub[2026], 'public sector, for comparison: 471.4 (2024, 2025), 511.6 (2026)' );
check( 7 === $hv['limitation_years'], 'havraa limitation 7 years' );
$sc = $reg['small_claims'];
check( 39900 === $sc['ceiling'][ count( $sc['ceiling'] ) - 1 ]['amount'] && '2026-01-01' === $sc['ceiling'][ count( $sc['ceiling'] ) - 1 ]['from'] && '2025-12-22' === $sc['ceiling'][ count( $sc['ceiling'] ) - 1 ]['notice_date'], 'small-claims ceiling 39,900 ₪ from 1.1.2026 (notice of 22.12.2025)' );
check( 1 === $sc['fee']['pct'] && 50 === $sc['fee']['min'] && 5 === $sc['fee']['round_up_to'], 'small-claims fee 1%, at least 50 ₪, rounded up to 5 ₪ (reg. 6(א))' );
check( array( 'defence_days' => 30, 'service_check_days_before' => 60, 'plaintiff_service_days_before' => 40, 'witness_request_days_before' => 60, 'interpreter_days_before' => 7, 'set_aside_days' => 30 ) === $sc['deadlines'], 'small-claims deadlines 30/60/40/60/7/30' );
check( 5 === $sc['max_claims_per_year'] && 5 === $sc['claim_body_max_pages'] && 7 === $sc['limitation_years'], 'five claims a year, five pages, seven years' );
foreach ( array( 12748 => 130.0, 39900 => 400.0, 5000 => 50.0, 5001 => 55.0, 100 => 50.0, 25010 => 255.0 ) as $amt => $fee ) {
	check( $fee === justice_tools_sc_fee( $sc, (float) $amt ), "PHP fee on {$amt} = {$fee} (same rule as the engine)" );
}

/* ---------- Wave 2: server HTML ---------- */
$h3 = $jt_shortcodes['justice_tool'];
$t3 = $h3( array( 'name' => 'havraa' ) );
check( false !== strpos( $t3, 'class="jtool-answer"' ) && false !== strpos( $t3, '451.50' ) && false !== strpos( $t3, '511.6' ), 'T03 answer box: 451.50 private, 511.6 public, from the registry' );
check( false !== strpos( $t3, '3,160.50' ), 'T03 example result (7 x 451.50) in the server HTML' );
check( false !== strpos( $t3, '2,508.00' ), 'T03 what-if (2025 after the statutory deduction) in the server HTML' );
check( false !== strpos( $t3, 'סעיף 5(א)' ) && false !== strpos( $t3, '<ol>' ), 'T03 calculation path with sections' );
check( 1 === substr_count( $t3, '"@type":"WebApplication"' ) && false === strpos( $t3, 'FAQPage' ), 'T03: one WebApplication, no FAQPage' );
check( false === strpos( $t3, 'data-act="rehearse"' ) && false !== strpos( $t3, 'data-act="letter"' ), 'T03: demand letter, no rehearsal (conversion 2)' );
$sec3 = substr( $t3, (int) strpos( $t3, '<section class="jtool"' ) );
check( false === stripos( substr( $sec3, 0, (int) strpos( $sec3, '</section>' ) ), '<h2' ), 'T03: no <h2> inside the tool card (HAD-487)' );
check( false === stripos( $t3, 'noindex' ) && false === stripos( $t3, 'maya' ) && false === strpos( $t3, '<form' ), 'T03: no noindex, no Maya card, no form gate' );
check( 1 === preg_match( '#<script type="application/json" id="jtool-havraa-data">(.*?)</script>#s', $t3, $m3 ) && isset( json_decode( $m3[1], true )['havraa'] ), 'T03 data island carries the havraa registry' );
check( isset( $jt_enqueued['justice-tool-havraa'] ), 'T03 bundle enqueued' );

$t5 = $h3( array( 'name' => 'tviot-ktanot' ) );
check( false !== strpos( $t5, '39,900' ) && false !== strpos( $t5, '22.12.2025' ) && false !== strpos( $t5, 'תקנה 6(א)' ), 'T05 answer box: ceiling, notice date and regulation from the registry' );
check( false !== strpos( $t5, 'אגרה: <span class="jtool-amt"><bdi>130</bdi> ₪</span>' ), 'T05 example result: 12,748 ₪ -> fee 130 ₪ in the server HTML' );
check( false !== strpos( $t5, '17.12.2026' ) && false !== strpos( $t5, '6.1.2027' ) && false !== strpos( $t5, '1.3.2033' ), 'T05 example deadlines in the server HTML' );
check( false !== strpos( $t5, 'סעיף 60(א)' ) && false !== strpos( $t5, 'תקנה 3' ), 'T05 readiness map with sections and the claim skeleton' );
check( false !== strpos( $t5, 'jus-tice.com/#/simulation' ) && strpos( $t5, 'data-act="rehearse"' ) > strpos( $t5, 'data-jtool-result' ), 'T05: the rehearsal is the primary next step, after the result (conversion 5)' );
check( false !== strpos( $t5, 'jtool-btn--primary" href="https://jus-tice.com/#/simulation' ), 'T05 primary button opens the hearing rehearsal' );
check( 1 === substr_count( $t5, '"@type":"WebApplication"' ) && false === strpos( $t5, 'FAQPage' ) && false === stripos( $t5, 'aggregateRating' ), 'T05: one WebApplication, no FAQPage, no rating' );
$sec5 = substr( $t5, (int) strpos( $t5, '<section class="jtool"' ) );
check( false === stripos( substr( $sec5, 0, (int) strpos( $sec5, '</section>' ) ), '<h2' ), 'T05: no <h2> inside the tool card' );
check( false === stripos( $t5, 'noindex' ) && false === stripos( $t5, 'maya' ) && false === strpos( $t5, '<form' ), 'T05: no noindex, no Maya card, no form gate' );
check( false !== strpos( $t5, 'class="jtool-stages"' ) && 5 === substr_count( $t5, 'jtool-stages__n' ) && false !== strpos( $t5, 'id="jtool-tviot-ktanot-next"' ), 'T05 stage bar: five linked stages, the last one to the rehearsal' );
check( '' === $h3( array( 'name' => 'tviot-ktanot', 'mode' => 'fee' ) ), 'one T05 instrument per page' );

// The fee-only page is a separate request; reset the once-per-page guard by loading a fresh process copy.
$feehtml = shell_exec( escapeshellarg( PHP_BINARY ) . ' ' . escapeshellarg( __FILE__ ) . ' --fee-only' );
check( is_string( $feehtml ) && false !== strpos( $feehtml, 'FEE-OK' ), 'fee-only mode renders on its own page (see the --fee-only branch)' );
$after = shell_exec( escapeshellarg( PHP_BINARY ) . ' ' . escapeshellarg( __FILE__ ) . ' --after-update' );
check( is_string( $after ) && false !== strpos( $after, 'AFTER-OK' ), 'after 1.1.2027 with no new ceiling row the answer box does not present 39,900 as the current ceiling' );
check( false !== strpos( $t5, 'תקרה 39,900 ₪ מ-1.1.2026 · נבדק 12.10.2026' ) && false === strpos( $t5, 'ייתכן שהתקרה התעדכנה' ), 'before the update date the stamp is plain' );

$numbers3 = $sec( array( 'name' => 'havraa', 'part' => 'numbers' ) );
check( false !== strpos( $numbers3, '451.50' ) && false !== strpos( $numbers3, '418.00' ) && false !== strpos( $numbers3, '378.00' ) && false !== strpos( $numbers3, 'ספר החוקים 3384' ), 'T03 numbers: price per havraa year with the deduction law' );
check( false !== strpos( $numbers3, '4,515.00' ), 'T03 numbers: 10 days x 451.50 = 4,515.00' );
$compare3 = $sec( array( 'name' => 'havraa', 'part' => 'compare' ) );
check( false !== strpos( $compare3, '2,508.00' ) && false !== strpos( $compare3, '3,160.50' ) && false !== strpos( $compare3, '652.50' ), 'T03 compare: 2025 after the deduction vs 2026' );
check( false !== strpos( $sec( array( 'name' => 'havraa', 'part' => 'method' ) ), '13,262.25' ), 'T03 method: the period example and its year-by-year table' );
$numbers5 = $sec( array( 'name' => 'tviot-ktanot', 'part' => 'numbers' ) );
check( false !== strpos( $numbers5, '39,900' ) && false !== strpos( $numbers5, 'תקנה 7(ב1)' ) && false !== strpos( $numbers5, 'gov.il' ), 'T05 numbers: ceiling, fee and deadlines with sources' );
check( false !== strpos( $sec( array( 'name' => 'tviot-ktanot', 'part' => 'compare' ) ), '255' ), 'T05 compare: the fee table from the engine' );
check( false !== strpos( $sec( array( 'name' => 'tviot-ktanot', 'part' => 'method', 'mode' => 'fee' ) ), '399.00' ), 'T05 fee-only method: 39,900 x 1% = 399.00' );
$index = $jt_shortcodes['justice_tools_index']();
check( false !== strpos( $index, '/havraa-pay-calculator/' ) && false !== strpos( $index, '/small-claims-court-israel/' ) && false !== strpos( $index, '/small-claims-fee-calculator/' ), 'hub cards include T03, T05 and the fee-only page' );

/* ---------- Wave 3 (HAD-498): registry values read on 13.10.2026, and the server HTML ---------- */
$reg3 = justice_tools_registry();
$y3   = $reg3['yerusha'];
check( '2026-10-13' === $y3['checked_on'] && array( 1, 2 ) === $y3['spouse_half'] && array( 2, 3 ) === $y3['spouse_two_thirds'] && 3 === $y3['spouse_apartment_min_years'], 'yerusha registry: s.11 fractions and the 3-year apartment rule' );
check( 597 === $y3['fees']['order_fee'] && 85 === $y3['fees']['online_pct'] && '2026-01-01' === $y3['fees']['from'] && 14 === $y3['objection_days'], 'yerusha registry: fee 597 NIS from 1.1.2026, 85% online, objection two weeks (reg. 17(א))' );
$pt3 = $reg3['purchase_tax'];
check( array( array( 1978745, 0 ), array( 2347040, 3.5 ), array( 6055070, 5 ), array( 20183565, 8 ), array( null, 10 ) ) === $pt3['tracks']['single']['brackets'], 'purchase tax registry: the single-home brackets of instruction 1/2025' );
check( '2028-01-15' === $pt3['tracks']['single']['to'] && '2027-02-10' === $pt3['tracks']['additional']['to'] && '2024-01-16' === $pt3['tracks']['single']['from'], 'purchase tax registry: frozen to 15.1.2028; additional-home rule to 10.2.2027 (Tax Authority notice, 12.10.2026)' );
check( 18 === $pt3['vat_pct'] && 30 === $pt3['declare_days'] && 60 === $pt3['pay_days'] && 12 === $pt3['replacement']['contractor_months'] && '2026-08-31' === $pt3['replacement']['war']['floor'], 'purchase tax registry: VAT 18%, 30/60 days, contractor 12 months, war floor 31.8.2026' );
$b3 = $reg3['betterment'];
check( array( 1, 2 ) === $b3['rates']['regular']['rate'] && array( 1, 4 ) === $b3['rates']['pinui']['rate'] && 140 === $b3['residence_max_sqm'] && 4 === $b3['residence_sale_years'] && 45 === $b3['appeal_days'] && 90000 === $b3['recheck_max'], 'betterment registry: 1/2, 1/4, 140 m2, 4 years, 45 days, 90,000 NIS' );
foreach ( array( $y3, $pt3, $b3 ) as $ds ) {
	check( 0 === strpos( (string) $ds['source_url'], 'https://' ) && '2026-10-13' === $ds['checked_on'] && $ds['refresh_every_days'] > 0, 'wave-3 dataset carries an https source, the check date and a refresh period: ' . $ds['name_he'] );
}

$w3y = $h3( array( 'name' => 'yerusha' ) );
check( false !== strpos( $w3y, 'class="jtool-answer"' ) && false !== strpos( $w3y, 'חצי אם יש ילדים או הורה' ) && false !== strpos( $w3y, 'שני שלישים' ) && false !== strpos( $w3y, '<bdi>597</bdi>' ), 'yerusha answer box: half, two thirds and the 597 NIS fee from the registry' );
check( false !== strpos( $w3y, '3 יורשים' ) && false !== strpos( $w3y, 'jt6-chart' ) && false !== strpos( $w3y, '1,500,000' ), 'yerusha example in the server HTML: 3 heirs, the family chart, 1,500,000 to the spouse' );
check( false !== strpos( $w3y, 'jtool-btn--primary" href="https://jus-tice.com/#/simulation' ) && false !== strpos( $w3y, 'purpose=mediation' ), 'yerusha: the primary next step is the heirs mediation rehearsal' );
check( false !== strpos( $w3y, 'נבדקו ב-13.10.2026' ) && false !== strpos( $w3y, '"dateModified":"2026-10-13"' ), 'yerusha: sources and schema carry its own check date' );
check( false !== strpos( $w3y, '<strong data-jtool-sticky-figure><bdi>3</bdi></strong>' ), 'yerusha sticky bar shows a count, not shekels' );
$w3r = $h3( array( 'name' => 'mas-rechisha' ) );
check( false !== strpos( $w3r, '28,038.33' ) && false !== strpos( $w3r, 'jt7-ladder' ) && false !== strpos( $w3r, '212,000' ) && false !== strpos( $w3r, '106,213.33' ), 'purchase tax example in the server HTML: 28,038.33, the ladder, 212,000 as additional, 106,213.33 all-in' );
check( false !== strpos( $w3r, 'data-act="ics"' ) && false !== strpos( $w3r, 'purpose=mediation' ) && false === strpos( $w3r, 'jtool-btn--primary" href="https://jus-tice.com' ), 'purchase tax: the calendar is the primary step, the negotiation rehearsal a secondary link (conversion 2)' );
check( false !== strpos( $w3r, 'מדרגות עד 15.1.2028 · נבדק 13.10.2026' ), 'purchase tax stamp: valid to 15.1.2028, checked 13.10.2026' );
$w3h = $h3( array( 'name' => 'hetel-hashbacha' ) );
check( false !== strpos( $w3h, '200,000' ) && false !== strpos( $w3h, 'jt8-strip' ) && false !== strpos( $w3h, 'סעיף 3' ), 'betterment example in the server HTML: 200,000 with the plan strip and s.3' );
check( false !== strpos( $w3h, 'purpose=court_rehearsal' ) && false !== strpos( $w3h, 'לתרגל את הדיון בוועדת הערר' ), 'betterment: the appeals-committee rehearsal is the primary next step' );
foreach ( array( 'yerusha' => $w3y, 'mas-rechisha' => $w3r, 'hetel-hashbacha' => $w3h ) as $nm => $html ) {
	check( 1 === substr_count( $html, '"@type":"WebApplication"' ) && false === strpos( $html, 'FAQPage' ) && false === stripos( $html, 'aggregateRating' ), $nm . ': one WebApplication, no FAQPage, no rating' );
	$card = substr( $html, (int) strpos( $html, '<section class="jtool"' ) );
	check( false === stripos( substr( $card, 0, (int) strpos( $card, '</section>' ) ), '<h2' ), $nm . ': no <h2> inside the tool card (HAD-487)' );
	check( false === stripos( $html, 'noindex' ) && false === stripos( $html, 'maya' ) && false === strpos( $html, 'רוטנברג' ) && false === strpos( $html, '<form' ), $nm . ': no noindex, no Maya card, no form gate' );
	check( isset( $jt_enqueued[ 'justice-tool-' . $nm ] ), $nm . ': bundle enqueued' );
	check( 1 === preg_match( '#<script type="application/json" id="jtool-' . preg_quote( $nm, '#' ) . '-data">(.*?)</script>#s', $html, $mm ) && count( json_decode( $mm[1], true ) ) === 2, $nm . ': the data island carries only its own dataset' );
}
$ny = $sec( array( 'name' => 'yerusha', 'part' => 'numbers' ) );
check( false !== strpos( $ny, 'סעיף 11(א)(2)' ) && false !== strpos( $ny, 'סעיף 55' ) && false !== strpos( $ny, 'תקנה 17(א)' ) && false !== strpos( $ny, 'תקנה 17(ג)' ), 'yerusha numbers: every rule with its section, the publication expense included' );
$nr = $sec( array( 'name' => 'mas-rechisha', 'part' => 'numbers' ) );
check( false !== strpos( $nr, '20,183,565' ) && false !== strpos( $nr, 'תקנה 12א' ) && false !== strpos( $nr, 'תקנה 11(א)(2)' ) && false !== strpos( $nr, '10.2.2027' ), 'purchase tax numbers: every track with its period' );
$nh = $sec( array( 'name' => 'hetel-hashbacha', 'part' => 'numbers' ) );
check( false !== strpos( $nh, 'סעיף 19(ג)(1)' ) && false !== strpos( $nh, '90,000' ) && false !== strpos( $nh, 'סעיף 14(ב)(1)' ), 'betterment numbers: the deferral, the re-examination ceiling and the decisive appraiser' );
check( false !== strpos( $sec( array( 'name' => 'mas-rechisha', 'part' => 'compare' ) ), '353,886.23' ) && false !== strpos( $sec( array( 'name' => 'yerusha', 'part' => 'compare' ) ), 'רק בן זוג' ) && false !== strpos( $sec( array( 'name' => 'hetel-hashbacha', 'part' => 'compare' ) ), '750,000' ), 'wave-3 compare tables from the engines' );
check( false !== strpos( $sec( array( 'name' => 'yerusha', 'part' => 'updated' ) ), '13.10.2026' ) && false !== strpos( $sec( array( 'name' => 'havraa', 'part' => 'updated' ) ), '12.10.2026' ), 'the updated line uses each tool own check date' );
$index3 = $jt_shortcodes['justice_tools_index']();
check( false !== strpos( $index3, '/succession-law-israel/' ) && false === strpos( $index3, 'href="' . home_url( '/inheritance/' ) . '"' ) && false !== strpos( $index3, '/acquisition-tax-brackets-2026/' ) && false !== strpos( $index3, '/betterment-levy-israel/' ), 'hub cards include the three wave-3 tools' );

/* ---------- Wave 4 (HAD-502): registry values read on 14.10.2026, and the server HTML ---------- */
$reg4 = justice_tools_registry();
$w4   = $reg4['will_cost'];
check( '2026-10-14' === $w4['checked_on'] && 597 === $w4['registrar']['order'] && 280 === $w4['registrar']['will_before_registrar'] && 126 === $w4['registrar']['deposit'] && 5 === $w4['registrar']['deposit_free_years'], 'will registry: 597 / 280 / 126, free after 5 years (fee regs from 1.1.2026)' );
check( 293 === $w4['notary']['will_first'] && 147 === $w4['notary']['will_additional'] && 18 === $w4['vat']['pct'] && '2026-01-01' === $w4['notary']['from'], 'will registry: notary 293 / 147 from 1.1.2026, VAT 18%' );
$c4 = $reg4['car_accident'];
check( '2026-10-14' === $c4['checked_on'] && 8 === $c4['fees']['stages']['none']['pct'] && 11 === $c4['fees']['stages']['settle']['pct'] && 13 === $c4['fees']['stages']['judgment']['pct'] && 13566 === $c4['earnings']['nii'][0]['s1'], 'car registry: 8 / 11 / 13%, NII average wage 13,566 from 1.1.2026' );
foreach ( array( $w4, $c4 ) as $ds ) {
	check( 0 === strpos( (string) $ds['source_url'], 'https://' ) && '2026-10-14' === $ds['checked_on'] && $ds['refresh_every_days'] > 0 && ! empty( $ds['next_update'] ), 'wave-4 dataset carries an https source, the check date, a refresh period and the next update: ' . $ds['name_he'] );
}
$h4  = $jt_shortcodes['justice_tool'];
$w4t = $h4( array( 'name' => 'tzavaa' ) );
check( false !== strpos( $w4t, 'class="jtool-answer"' ) && false !== strpos( $w4t, '<bdi>280</bdi>' ) && false !== strpos( $w4t, '<bdi>293</bdi>' ) && false !== strpos( $w4t, '<bdi>126</bdi>' ) && false !== strpos( $w4t, '<bdi>597</bdi>' ), 'will answer box: 280, 293, 126 and 597 from the registry' );
check( false !== strpos( $w4t, '345.74' ) && false !== strpos( $w4t, 'jt11-track' ) && false !== strpos( $w4t, '507.45' ), 'will example in the server HTML: 345.74 now, the track, 507.45 later' );
check( false !== strpos( $w4t, 'data-act="print"' ) && false !== strpos( $w4t, 'purpose=mediation' ), 'will: print is the primary step, the family rehearsal a secondary link' );
check( false !== strpos( $w4t, 'אגרות ותעריף נוטריונים מ-1.1.2026 · נבדק 14.10.2026' ), 'will stamp: tariffs from 1.1.2026, checked 14.10.2026' );
$c4t = $h4( array( 'name' => 'teunat-drachim' ) );
check( false !== strpos( $c4t, 'class="jtool-answer"' ) && false !== strpos( $c4t, '<bdi>13%</bdi>' ) && false !== strpos( $c4t, '<bdi>0.2%</bdi>' ) && false !== strpos( $c4t, 'סעיף 2(ג)' ), 'car answer box: the formula, the fee caps and absolute liability' );
check( false !== strpos( $c4t, 'jt10-bar' ) && false !== strpos( $c4t, '10.3.2032' ) && false !== strpos( $c4t, '135,840' ), 'car example in the server HTML: the formula bar, the limitation date, the net after the fee' );
check( false !== strpos( $c4t, '<strong data-jtool-sticky-figure><bdi>19%</bdi></strong>' ), 'car sticky bar shows a share of the maximum, not shekels' );
check( false !== strpos( $c4t, 'jtool-btn--primary" href="https://jus-tice.com/#/simulation' ) && false !== strpos( $c4t, 'purpose=witness_prep' ), 'car: the witness and expert rehearsal is the primary next step' );
foreach ( array( 'tzavaa' => $w4t, 'teunat-drachim' => $c4t ) as $nm => $html ) {
	check( 1 === substr_count( $html, '"@type":"WebApplication"' ) && false === strpos( $html, 'FAQPage' ) && false === stripos( $html, 'aggregateRating' ), $nm . ': one WebApplication, no FAQPage, no rating' );
	$card = substr( $html, (int) strpos( $html, '<section class="jtool"' ) );
	check( false === stripos( substr( $card, 0, (int) strpos( $card, '</section>' ) ), '<h2' ), $nm . ': no <h2> inside the tool card (HAD-487)' );
	check( false === stripos( $html, 'noindex' ) && false === stripos( $html, 'maya' ) && false === strpos( $html, 'רוטנברג' ) && false === strpos( $html, '<form' ), $nm . ': no noindex, no Maya card, no form gate' );
	check( isset( $jt_enqueued[ 'justice-tool-' . $nm ] ), $nm . ': bundle enqueued' );
	check( 1 === preg_match( '#<script type="application/json" id="jtool-' . preg_quote( $nm, '#' ) . '-data">(.*?)</script>#s', $html, $mm ) && count( json_decode( $mm[1], true ) ) === 2, $nm . ': the data island carries only its own dataset' );
	check( false !== strpos( $html, '"dateModified":"2026-10-14"' ) && false !== strpos( $html, 'נבדקו ב-14.10.2026' ), $nm . ': schema and sources carry its own check date' );
}
$nt = $sec( array( 'name' => 'tzavaa', 'part' => 'numbers' ) );
check( false !== strpos( $nt, 'פרטים 5 ו-5א' ) && false !== strpos( $nt, 'פרט 9' ) && false !== strpos( $nt, 'תקנה 17(ג)' ), 'will numbers: the deposit exemption, the visit fee and the unpriced publication' );
$nc = $sec( array( 'name' => 'teunat-drachim', 'part' => 'numbers' ) );
check( false !== strpos( $nc, 'תקנה 3' ) && false !== strpos( $nc, '40,698' ) && false !== strpos( $nc, 'סעיפים 5(1), 10 ו-15א' ), 'car numbers: the age cut, the verified ceiling floor, the limitation rules' );
check( false !== strpos( $sec( array( 'name' => 'tzavaa', 'part' => 'compare' ) ), '519.20' ) && false !== strpos( $sec( array( 'name' => 'teunat-drachim', 'part' => 'compare' ) ), '<bdi>18%</bdi>' ), 'wave-4 compare tables from the engines' );
check( false !== strpos( $sec( array( 'name' => 'tzavaa', 'part' => 'updated' ) ), '14.10.2026' ), 'the updated line uses the wave-4 check date' );
$index4 = $jt_shortcodes['justice_tools_index']();
check( false !== strpos( $index4, '/depositing-testament-registrar/' ) && false !== strpos( $index4, '/israel-road-accident-compensation-law/' ), 'hub cards include the wave-4 tools' );

$d4 = $reg4['divorce_cost'];
check( '2026-10-14' === $d4['checked_on'] && 536 === $d4['rabbinical']['agreement'] && 457 === $d4['rabbinical']['divorce'] && 601 === $d4['family']['property'] && 60 === $d4['disputes']['stay_days'], 'divorce registry: 536 / 457 / 601, a 60-day stay' );
check( 0 === strpos( (string) $d4['source_url'], 'https://' ) && $d4['refresh_every_days'] > 0 && ! empty( $d4['next_update'] ), 'divorce dataset carries an https source, a refresh period and the next update' );
$g4t = $h4( array( 'name' => 'gerushin' ) );
check( false !== strpos( $g4t, 'class="jtool-answer"' ) && false !== strpos( $g4t, '<bdi>536</bdi>' ) && false !== strpos( $g4t, '<bdi>119</bdi>' ) && false !== strpos( $g4t, '<bdi>601</bdi>' ), 'divorce answer box: 536, 119 and 601 from the registry' );
check( false !== strpos( $g4t, '1,188' ) && false !== strpos( $g4t, 'jt9-lanes' ) && false !== strpos( $g4t, '3,767' ), 'divorce example in the server HTML: 1,188 in fees, the lanes, the lawyer minimum' );
check( false !== strpos( $g4t, 'jtool-btn--primary" href="https://jus-tice.com/#/simulation' ) && false !== strpos( $g4t, 'purpose=mediation' ), 'divorce: the mediation rehearsal is the primary next step' );
check( 1 === substr_count( $g4t, '"@type":"WebApplication"' ) && false === strpos( $g4t, 'FAQPage' ) && false === stripos( $g4t, 'noindex' ) && false === stripos( $g4t, 'maya' ) && false === strpos( $g4t, 'רוטנברג' ) && false === strpos( $g4t, '<form' ), 'gerushin: one WebApplication, no FAQPage, no noindex, no Maya, no form gate' );
check( 1 === preg_match( '#<script type="application/json" id="jtool-gerushin-data">(.*?)</script>#s', $g4t, $mm ) && count( json_decode( $mm[1], true ) ) === 2 && isset( $jt_enqueued['justice-tool-gerushin'] ), 'gerushin: its own dataset only, bundle enqueued' );
$card4 = substr( $g4t, (int) strpos( $g4t, '<section class="jtool"' ) );
check( false === stripos( substr( $card4, 0, (int) strpos( $card4, '</section>' ) ), '<h2' ) && false !== strpos( $g4t, 'אגרות בית הדין ובית המשפט 2026 · נבדק 14.10.2026' ), 'gerushin: no <h2> in the card; the stamp' );
$ng = $sec( array( 'name' => 'gerushin', 'part' => 'numbers' ) );
check( false !== strpos( $ng, 'פרט 4(2)' ) && false !== strpos( $ng, 'פרט 4(3)(ג)' ) && false !== strpos( $ng, 'סעיפים 3(ה) ו-4' ) && false !== strpos( $ng, 'תקנה 14א' ), 'divorce numbers: the agreement, the free get, the clocks, the maintenance exemption' );
check( false !== strpos( $sec( array( 'name' => 'gerushin', 'part' => 'compare' ) ), '2,910' ), 'divorce compare table from the engine' );
check( false !== strpos( $jt_shortcodes['justice_tools_index'](), '/opening-divorce-file-rabbinical/' ), 'hub cards include the divorce tool' );

if ( $failures ) {
	fwrite( STDERR, "justice tools: {$failures} failure(s)\n" );
	exit( 1 );
}
echo "justice tools: ok\n";
