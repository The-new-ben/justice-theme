<?php
/**
 * The road-accident and personal-injury wave (22.10.2026, HAD-591): the registry datasets, the catalog, the server HTML and
 * the result-first cards of the three new instruments (work injury, the disability degree, the injured person's clock) and
 * of the upgraded road-accident tool.
 *
 * Run: php tests/test-injury-tools.php
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
function get_permalink() { return 'https://jus-tice.co.il/work-accident-guide/'; }
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

// tool => home, dataset, the example figures each lane's golden tests compute by hand, the lawyer path.
$homes = array(
	'teunat-drachim' => array( '/israel-road-accident-compensation-law/', 'car_accident', array( '19%', '135,840', '10.3.2032' ), '/car-accident-auto-injury-lawyer/' ),
	'teunat-avoda'   => array( '/work-accident-guide/', 'injury_avoda', array( '13,500', '58,050' ), '/national-insurance-attorney/' ),
	'shiklul-nechut' => array( '/regulations-insurance-1956/', 'injury_shiklul', array( '28%', '8.11.2026' ), '/representation-medical-committee-lawyer/' ),
	'shaon-nezikin'  => array( '/tort-lawyer/', 'injury_sheon', array( '9.10.2033' ), '/personal-injury-law/' ),
);
$injury_keys = array( 'injury_teuna', 'injury_avoda', 'injury_shiklul', 'injury_sheon' );

/* ---------- The registry ---------- */
foreach ( $injury_keys as $key ) {
	$ds = $reg[ $key ] ?? array();
	check( '2026-10-22' === ( $ds['checked_on'] ?? '' ) && 0 === strpos( (string) ( $ds['source_url'] ?? '' ), 'https://' ) && ( $ds['refresh_every_days'] ?? 0 ) > 0 && ! empty( $ds['next_update'] ), "{$key}: an https source, the check date, a refresh period and the next update" );
}
$json = (string) json_encode( array_intersect_key( $reg, array_flip( $injury_keys ) ), JSON_UNESCAPED_UNICODE );
check( false === mb_strpos( $json, 'כל זכות' ) && false === mb_strpos( $json, 'כל-זכות' ) && false === stripos( $json, 'kolzchut' ), 'no injury dataset names the private rights portal' );
// Medical malpractice is its own cluster: one sentence says the clock does not compute it, and no url points into it.
$mal_urls = array();
preg_match_all( '#https?://[^"\s]+#', $json, $mal_urls );
check( array() === array_filter( $mal_urls[0], function ( $u ) { return false !== stripos( $u, 'malpractice' ) || false !== stripos( $u, 'negligen' ); } ), 'no injury dataset links into the medical-malpractice cluster' );
check( 1 === substr_count( $json, '"malpractice_he"' ), 'the clock says once that medical malpractice has its own rules' );

/* ---------- The catalog ---------- */
foreach ( $homes as $name => $home ) {
	$t = $catalog[ $name ] ?? array();
	check( ! empty( $t ), "catalog: {$name}" );
	check( $home[0] === ( $t['page'] ?? '' ) && $home[1] === ( $t['dataset'] ?? '' ) && in_array( $home[1], $t['data'] ?? array(), true ), "{$name}: page {$home[0]} and dataset {$home[1]} in the data island" );
	check( in_array( $t['rehearse']['purpose'] ?? '', array( 'witness_prep', 'court_rehearsal' ), true ) && 'personal-injury' === ( $t['rehearse']['topic'] ?? '' ), "{$name}: a rehearsal the jus-tice.com app supports (personal injury: witness or court)" );
	check( $home[3] === ( $t['lawyer']['path'] ?? '' ), "{$name}: the lawyer link is {$home[3]}" );
	foreach ( $t['more'] ?? array() as $link ) {
		check( isset( $link['url'] ) ? 0 === strpos( $link['url'], 'https://' ) : 0 === strpos( $link['path'], '/' ), "{$name}: every link is a path or an https url" );
	}
	$url = justice_tools_rehearse_url( $t );
	check( 0 === strpos( $url, 'https://jus-tice.com/#/simulation?' ) && false === strpos( $url, 'story' ) && false === strpos( $url, 'case=' ), "{$name}: the simulation link carries only the public topic and purpose ({$url})" );
}
check( in_array( 'injury_teuna', $catalog['teunat-drachim']['data'] ?? array(), true ), 'teunat-drachim: the data island carries the injury-wave dataset' );

/* ---------- The server HTML of every instrument ---------- */
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
	check( false !== mb_strpos( $html, 'התרחיש לסימולציה' ) && false !== strpos( $html, 'data-act="rehearse"' ), "{$name}: the scenario for the simulation and its button are in the server HTML" );
	check( false !== strpos( $html, 'data-act="print"' ) && false !== strpos( $html, 'data-act="ics"' ), "{$name}: print and calendar actions" );
	check( false !== mb_strpos( $html, 'מה עושים עכשיו' ), "{$name}: the next actions" );
	foreach ( $home[2] as $figure ) {
		check( false !== strpos( $html, $figure ), "{$name}: the example figure {$figure} is in the server HTML" );
	}
	$sources = justice_tools_sources( $name );
	check( count( $sources ) >= 3, "{$name}: at least 3 official sources (" . count( $sources ) . ')' );
	foreach ( $sources as $s ) {
		check( 0 === strpos( (string) $s['url'], 'https://' ) && '' !== trim( (string) $s['text'] ) && false === mb_strpos( (string) $s['text'] . $s['name'], 'כל זכות' ) && false === stripos( (string) $s['url'], 'kolzchut' ), "{$name}: source {$s['name']} has an official https url and a text" );
	}
	$stamp = justice_tools_stamp( $name );
	check( false !== mb_strpos( $stamp, 'נבדק 22.10.2026' ), "{$name}: the stamp carries the check date ({$stamp})" );
	$links = array();
	preg_match_all( '#href="([^"]+)"#', $html, $links );
	foreach ( $links[1] as $href ) {
		check( false === stripos( $href, 'malpractice' ) && false === stripos( $href, 'kolzchut' ), "{$name}: no link into the malpractice cluster or the private portal ({$href})" );
	}
	$cmp = $section( array( 'name' => $name, 'part' => 'compare' ) );
	check( false !== strpos( $cmp, '<table' ) && false !== strpos( $cmp, '<caption' ), "{$name}: the page table renders from the registry" );
	$method = $section( array( 'name' => $name, 'part' => 'method' ) );
	check( false !== strpos( $method, '<ol' ), "{$name}: the computation path renders" );
	justice_tools_printed( '', true );
	$again = $tool( array( 'name' => $name ) ) . $tool( array( 'name' => $name ) );
	check( 1 === substr_count( $again, 'data-jtool="' . $name . '"' ), "{$name}: one instrument per render pass" );
}

/* ---------- The result-first card under the title ---------- */
$lead_sc = $jt_shortcodes['justice_tool_lead'] ?? null;
check( is_callable( $lead_sc ), 'the [justice_tool_lead] shortcode is registered' );
foreach ( $homes as $name => $home ) {
	$lead = is_callable( $lead_sc ) ? (string) $lead_sc( array( 'name' => $name ) ) : '';
	check( false !== strpos( $lead, 'class="jtool-page jtool-lead"' ) && false !== strpos( $lead, 'data-jtool-lead="' . $name . '"' ) && false !== strpos( $lead, 'data-lead-go' ), "{$name}: the result-first card renders with its jump to the form" );
	check( false !== strpos( $lead, 'jtool-lead__figure' ), "{$name}: the card carries the example's figure" );
	check( 0 === preg_match( '/<h2[\s>]/', $lead ) && false === strpos( $lead, 'undefined' ) && false === strpos( $lead, 'NaN' ), "{$name}: the card has no h2, undefined or NaN" );
}
check( '' === ( is_callable( $lead_sc ) ? (string) $lead_sc( array( 'name' => 'no-such-tool' ) ) : '' ), 'the card renders nothing for an unknown tool' );

echo "injury tools (PHP): {$passed} passed, {$failures} failed\n";
exit( $failures ? 1 : 0 );
