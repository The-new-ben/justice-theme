<?php
/**
 * The inheritance wave (21.10.2026): the registry dataset, the catalog, and the server HTML of the five instruments
 * (the request planner, the waiver affidavit, the dispute navigator, the heirs' agreement, the objection clock).
 *
 * Run: php tests/test-inheritance-tools.php
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
function get_permalink() { return 'https://jus-tice.co.il/applying-order-heirs-registrar/'; }
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
$ip      = $reg['inheritance_process'] ?? array();

/* ---------- The registry ---------- */
check( '2026-10-21' === ( $ip['checked_on'] ?? '' ) && 0 === strpos( (string) ( $ip['source_url'] ?? '' ), 'https://' ) && ( $ip['refresh_every_days'] ?? 0 ) > 0 && ! empty( $ip['next_update'] ), 'the dataset carries an https source, the check date, a refresh period and the next update' );
check( 597 === ( $ip['registrar']['items']['order']['amount'] ?? 0 ) && 507 === ( $ip['registrar']['payments']['online_fee'] ?? 0 ) && 66 === ( $ip['registrar']['payments']['publication'] ?? 0 ) && '2026-01-01' === ( $ip['registrar']['from'] ?? '' ), 'registrar: 597 / 507 / 66 from 1.1.2026' );
check( 1151 === ( $ip['family_court']['items']['objection']['amount'] ?? 0 ) && 1183 === ( $ip['family_court']['items']['amend']['amount'] ?? 0 ) && 3481 === ( $ip['family_court']['items']['property']['amount'] ?? 0 ) && '2026-07-01' === ( $ip['family_court']['current_to'] ?? '' ), 'family court: 1,151 / 1,183 / 3,481 from 1.7.2026' );
check( 14 === ( $ip['days']['objection'] ?? 0 ) && 7 === ( $ip['days']['online_original_will'] ?? 0 ) && 10 === count( $ip['grounds'] ?? array() ) && 8 === count( $ip['routes'] ?? array() ), 'the periods, 10 grounds, 8 routes' );
check( 2190 === ( $ip['bar']['registration_per_unit'] ?? 0 ) && 6307 === ( $ip['bar']['partition_min'] ?? 0 ) && 754 === ( $ip['bar']['hearing'] ?? 0 ), 'the Bar: 2,190 per unit, partition at least 6,307, a hearing 754' );
check( ( $reg['registry_version'] ?? '' ) >= '2026-10-21', 'the registry version moved to the wave day or later (a later wave moves it on)' );

/* ---------- The catalog ---------- */
foreach ( justice_tools_inheritance_names() as $name ) {
	check( isset( $catalog[ $name ] ), "catalog: {$name}" );
}
check( '/applying-order-heirs-registrar/' === ( $catalog['tzav-yerusha']['page'] ?? '' ) && '/registrar-of-inheritance/' === ( $catalog['tzav-yerusha']['modes']['kiyum']['page'] ?? '' ) && ! empty( $catalog['tzav-yerusha']['modes']['kiyum']['shares_form'] ), 'the planner lives on the request page and, as a mode, on the registrar page (never on a page with the reviewed-by line)' );
check( '/inheritance-dispute/' === ( $catalog['sichsuch-yerusha']['page'] ?? '' ) && '/inheritance-disputes-lawyer/' === ( $catalog['sichsuch-yerusha']['modes']['lawyer']['page'] ?? '' ), 'the navigator lives on /inheritance-dispute/ and on the lawyer\'s guide' );
foreach ( justice_tools_inheritance_names() as $name ) {
	$t = $catalog[ $name ];
	check( '/inheritance-lawyer/' === $t['lawyer']['path'] && 'inheritance' === $t['rehearse']['topic'] && in_array( 'inheritance_process', $t['data'], true ) && 'inheritance_process' === $t['dataset'], "{$name}: the lawyer link, the rehearsal topic, the dataset" );
	foreach ( $t['more'] as $link ) {
		check( isset( $link['url'] ) ? 0 === strpos( $link['url'], 'https://' ) : 0 === strpos( $link['path'], '/' ), "{$name}: every link is a path or an https url" );
	}
}

/* ---------- The server HTML: the planner ---------- */
justice_tools_printed( '', true );
$tz = $tool( array( 'name' => 'tzav-yerusha' ) );
check( false !== strpos( $tz, 'class="jtool-answer"' ) && answer_words( $tz ) >= 40 && answer_words( $tz ) <= 110, 'planner answer box: 40-110 words (' . answer_words( $tz ) . ')' );
check( false !== strpos( $tz, '<bdi>597</bdi>' ) && false !== strpos( $tz, '<bdi>507</bdi>' ) && false !== strpos( $tz, '<bdi>66</bdi>' ) && false !== strpos( $tz, '<bdi>14</bdi>' ), 'planner answer box: 597, 507, 66 and 14 days from the registry' );
check( false !== strpos( $tz, 'jt23-rail' ) && 9 === substr_count( $tz, 'class="jt23-st"' ) && false !== strpos( $tz, '<bdi>573</bdi>' ) && false !== strpos( $tz, 'data-jtool-sticky-figure><span class="jtool-amt"><bdi>573</bdi>' ), 'planner example: nine stations, 573 in the verdict and the sticky bar' );
check( false !== strpos( $tz, 'data-act="ics"' ) && false !== strpos( $tz, 'jtool-btn--primary" type="button" data-act="ics"' ) && false !== strpos( $tz, 'purpose=mediation' ), 'planner: the calendar is the primary step, the family rehearsal a secondary link' );
check( false !== strpos( $tz, 'אגרה 597 ₪ מ-1.1.2026 · 14 ימים להתנגדות · נבדק 21.10.2026' ), 'planner stamp' );
check( false !== strpos( $tz, '/disclaimer-renouncing-share/' ) && false !== strpos( $tz, '/succession-law-israel/' ) && false !== strpos( $tz, 'gov.il/he/service/inheritance_order' ), 'planner links: the waiver generator, the shares calculator, the service' );
justice_tools_printed( '', true );
$tzk = $tool( array( 'name' => 'tzav-yerusha', 'mode' => 'kiyum' ) );
check( false !== strpos( $tzk, 'data-jtool-mode="kiyum"' ) && false !== strpos( $tzk, 'צו קיום צוואה: המסלול' ) && false !== strpos( $tzk, '<bdi>7</bdi>' ) && false !== strpos( $tzk, 'jt23-rail' ) && false !== strpos( $tzk, '/will-dispute-grounds/' ), 'the probate mode: its own title and answer (7 days), the same instrument, the objection link' );

/* ---------- The server HTML: the navigator ---------- */
justice_tools_printed( '', true );
$sc = $tool( array( 'name' => 'sichsuch-yerusha' ) );
check( false !== strpos( $sc, 'class="jtool-answer"' ) && answer_words( $sc ) >= 40 && answer_words( $sc ) <= 120, 'navigator answer box: 40-120 words (' . answer_words( $sc ) . ')' );
check( false !== strpos( $sc, '<bdi>1,151</bdi>' ) && false !== strpos( $sc, '<bdi>597</bdi>' ) && false !== strpos( $sc, '<bdi>1,183</bdi>' ) && false !== strpos( $sc, 'סעיף 110' ), 'navigator answer box: 1,151, 597, 1,183 and s.110' );
check( false !== strpos( $sc, 'jt25-cross' ) && 4 === substr_count( $sc, 'class="jt25-post"' ) && 1 === substr_count( $sc, 'jt25-post--first' ) && false !== strpos( $sc, 'data-jtool-sticky-figure><bdi>5</bdi>' ), 'navigator example: five signposts, one lit, 5 in the sticky bar' );
check( false !== strpos( $sc, 'jtool-btn--primary" href="https://jus-tice.com/#/simulation' ) && false !== strpos( $sc, 'purpose=mediation' ) && false !== strpos( $sc, 'topic=inheritance' ), 'navigator: the mediation rehearsal is the primary step' );
check( false !== strpos( $sc, '<bdi>3,481</bdi>' ) && false !== strpos( $sc, 'סעיפים 37 עד 40' ) && false !== strpos( $sc, 'data-act="copy-map"' ), 'navigator details: the partition fee, the Land Law, the copy button' );
justice_tools_printed( '', true );
$scl = $tool( array( 'name' => 'sichsuch-yerusha', 'mode' => 'lawyer' ) );
check( false !== strpos( $scl, 'data-jtool-mode="lawyer"' ) && false !== strpos( $scl, 'לפני שפונים לעורך דין' ) && false !== strpos( $scl, 'תעריף הלשכה 2026' ) && false !== strpos( $scl, 'jt25-cross' ), 'the lawyer mode: its own title and stamp, the same instrument' );

/* ---------- Every instrument: the page standard ---------- */
foreach ( justice_tools_inheritance_names() as $name ) {
	justice_tools_printed( '', true );
	$html = $tool( array( 'name' => $name ) );
	check( '' !== $html, "{$name}: renders" );
	if ( '' === $html ) {
		continue;
	}
	check( 1 === substr_count( $html, '"@type":"WebApplication"' ) && false === strpos( $html, 'FAQPage' ) && false === stripos( $html, 'aggregateRating' ), "{$name}: one WebApplication, no FAQPage, no rating" );
	$card = substr( $html, (int) strpos( $html, '<section class="jtool"' ) );
	check( false === stripos( substr( $card, 0, (int) strpos( $card, '</section>' ) ), '<h2' ), "{$name}: no <h2> inside the tool card (HAD-487)" );
	check( false === stripos( $html, 'noindex' ) && false === stripos( $html, 'maya' ) && false === strpos( $html, 'רוטנברג' ) && false === strpos( $html, '<form' ), "{$name}: no noindex, no Maya card, no form gate" );
	check( isset( $jt_enqueued[ 'justice-tool-' . $name ] ) && is_readable( JUSTICE_THEME_DIR . '/assets/js/tools/dist/' . $name . '.js' ), "{$name}: bundle enqueued and built" );
	check( 1 === preg_match( '#<script type="application/json" id="jtool-' . preg_quote( $name, '#' ) . '-data">(.*?)</script>#s', $html, $mm ) && count( json_decode( $mm[1], true ) ) === count( $catalog[ $name ]['data'] ), "{$name}: the data island carries exactly its datasets" );
	check( false !== strpos( $html, '"dateModified":"2026-10-21"' ) && false !== strpos( $html, 'נבדקו ב-21.10.2026' ), "{$name}: schema and sources carry the wave's check date" );
	check( false === strpos( $html, 'undefined' ) && false === strpos( $html, 'NaN' ), "{$name}: no undefined or NaN in the server HTML" );
	foreach ( justice_tools_sources( $name ) as $s ) {
		check( 0 === strpos( $s['url'], 'https://' ) && '' !== $s['name'] && '' !== $s['text'], "{$name}: every source has an https url, a name and a text" );
	}
	$num = $section( array( 'name' => $name, 'part' => 'numbers' ) );
	check( false !== strpos( $num, 'jtool-datatable' ) && false !== strpos( $num, '<caption>' ), "{$name}: the page table (numbers) renders with a caption" );
	check( false !== strpos( $section( array( 'name' => $name, 'part' => 'updated' ) ), '21.10.2026' ), "{$name}: the updated line uses the wave's check date" );
}
$index = $jt_shortcodes['justice_tools_index']();
check( false !== strpos( $index, '/applying-order-heirs-registrar/' ) && false !== strpos( $index, '/inheritance-dispute/' ), 'hub cards include the wave' );

if ( $failures ) {
	fwrite( STDERR, "inheritance tools: {$failures} failure(s)\n" );
	exit( 1 );
}
echo "inheritance tools: ok\n";
