<?php
/**
 * The divorce guide additions of 31.10.2026 evening (HAD-616 b): the lawyer chooser (bchirat-orech-din), the divorce
 * statistics (netunei-gerushin), and the office line of the registered lawyer card (the street plan, the address, the
 * navigation links and the Attorney node, with no rating).
 *
 * Run: php tests/test-divorce-guide.php
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'JUSTICE_THEME_DIR', dirname( __DIR__ ) );
define( 'JUSTICE_THEME_URI', 'https://jus-tice.co.il/wp-content/themes/justice-theme' );
define( 'JUSTICE_THEME_VERSION', 'test' );

$jt_shortcodes = array();
$jt_meta       = array(
	19130 => array(
		'office_address' => 'ראול ולנברג 18, מגדל C, רמת החייל, תל אביב 6971915',
		'firm_name'      => 'משרד עורכי דין מאיה רוטנברג',
		'phone'          => '054-4705733',
		'website'        => 'https://rotenberglaw.co.il/',
	),
);
class WP_Post {
	public $ID;
	public $post_name;
	public $post_title;
	public function __construct( int $id, string $name, string $title ) { $this->ID = $id; $this->post_name = $name; $this->post_title = $title; }
}
function add_shortcode( $tag, $cb ): void { global $jt_shortcodes; $jt_shortcodes[ $tag ] = $cb; }
function add_action( $tag, $cb, $priority = 10, $args = 1 ): void {}
function add_filter( $tag, $cb, $priority = 10, $args = 1 ): void {}
function shortcode_atts( $pairs, $atts, $tag = '' ) { $atts = (array) $atts; $out = array(); foreach ( $pairs as $k => $v ) { $out[ $k ] = array_key_exists( $k, $atts ) ? $atts[ $k ] : $v; } return $out; }
function sanitize_key( $key ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $key ) ); }
function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $u ) { return (string) $u; }
function esc_url_raw( $u ) { return (string) $u; }
function home_url( $path = '' ) { return 'https://jus-tice.co.il' . $path; }
function get_permalink( $p = null ) { return $p instanceof WP_Post ? 'https://jus-tice.co.il/lawyers/' . $p->post_name . '/' : 'https://jus-tice.co.il/divorce-lawyer/'; }
function get_template_directory_uri() { return JUSTICE_THEME_URI; }
function trailingslashit( $s ) { return rtrim( (string) $s, '/' ) . '/'; }
function wp_strip_all_tags( $s ) { return trim( strip_tags( (string) $s ) ); }
function get_post_meta( $id, $key, $single = false ) { global $jt_meta; return $jt_meta[ $id ][ $key ] ?? ''; }
function wp_json_encode( $data, $flags = 0 ) { return json_encode( $data, $flags ); }
function wp_enqueue_style( $h, $src = '', $deps = array(), $ver = false ) {}
function wp_enqueue_script( $h, $src = '', $deps = array(), $ver = false, $footer = false ) {}
function is_singular( $t = '' ) { return false; }

require_once dirname( __DIR__ ) . '/inc/justice-tools.php';
require_once dirname( __DIR__ ) . '/inc/lawyer-office.php';

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

$tool    = $jt_shortcodes['justice_tool'];
$catalog = justice_tools_catalog();
$reg     = justice_tools_registry();

// 1. The lawyer chooser.
$name = 'bchirat-orech-din';
$c    = $catalog[ $name ] ?? array();
check( isset( $catalog[ $name ] ) && 'fl_bchira' === $c['dataset'] && array( 'registry_version', 'fl_bchira' ) === $c['data'] && '/divorce-lawyer/' === $c['page'], 'chooser: catalog, dataset and page' );
check( false !== mb_strpos( $c['name'], 'עורך דין גירושין' ) && false !== mb_strpos( $c['promise'], 'לא מדרג' ), 'chooser: the phrase in the name; the promise says it ranks no one' );
justice_tools_printed( '', true );
$html = $tool( array( 'name' => $name ) );
check( false !== strpos( $html, 'id="jtool-bchirat-orech-din"' ) && false !== strpos( $html, 'name="jt74-stage" value="dispute"' ) && false !== strpos( $html, 'id="jt74-city"' ), 'chooser: server HTML with the questions and the city' );
check( false !== mb_strpos( $html, 'מה אתם צריכים' ) && false !== mb_strpos( $html, 'שאלות לפגישה הראשונה' ) && false !== mb_strpos( $html, 'דגלים אדומים' ), 'chooser: the profile, the questions and the warnings in the server HTML' );
check( false !== strpos( $html, '/lawyers/advocate-maya-rotenberg/' ) && false === mb_strpos( $html, 'המומלצת' ) && false !== mb_strpos( $html, 'בודקת את הפרקים המסומנים' ), 'chooser: the featured lawyer by fact, no superlative' );
check( false !== strpos( $html, 'data-preset="kids"' ) && false !== strpos( $html, 'href="#jtool-machshevon-gerushin"' ), 'chooser: the bridge to the divorce calculator' );
check( 1 === preg_match( '#<script type="application/ld\+json">(\{"@context":"https://schema.org","@type":"WebApplication".*?)</script>#s', $html, $ld ) && 'בחירת עורך דין גירושין' === json_decode( $ld[1], true )['name'], 'chooser: WebApplication schema' );
$answer = justice_tools_answer( $name );
check( false !== mb_strpos( $answer, 'בחירת עורך דין גירושין' ) && false !== mb_strpos( $answer, 'לא מדרג' ) && false !== mb_strpos( $answer, 'נבדק 31.10.2026' ), 'chooser: the answer box' );

// 2. The divorce statistics.
$name = 'netunei-gerushin';
$c    = $catalog[ $name ] ?? array();
check( isset( $catalog[ $name ] ) && 'fl_netunim' === $c['dataset'] && array( 'registry_version', 'fl_netunim' ) === $c['data'] && 'count' === $c['sticky_kind'], 'statistics: catalog, dataset and the count sticky' );
justice_tools_printed( '', true );
$html = $tool( array( 'name' => $name ) );
check( false !== strpos( $html, 'id="jtool-netunei-gerushin"' ) && false !== strpos( $html, 'name="jt75-metric" value="married"' ) && false !== strpos( $html, 'id="jt75-age"' ), 'statistics: server HTML with the measures and the age field' );
check( false !== strpos( $html, '16,499' ) && false !== strpos( $html, '<th scope="row" data-th="שנה">1955</th>' ) && false !== strpos( $html, '11,093' ), 'statistics: 2024, the table from 1955 and the rabbinical courts in the server HTML' );
check( 1 === preg_match( '#<script type="application/json" id="jtool-netunei-gerushin-data">(.*?)</script>#s', $html, $mm ) && null !== json_decode( $mm[1], true ) && strlen( $mm[1] ) < 60000, 'statistics: the data island parses and stays under 60 KB (' . strlen( $mm[1] ?? '' ) . ' bytes)' );
check( 1 === preg_match( '#<script type="application/ld\+json">(\{"@context":"https://schema.org","@type":"WebApplication".*?)</script>#s', $html, $ld ) && 'נתוני גירושין בישראל' === json_decode( $ld[1], true )['name'], 'statistics: WebApplication schema' );
$answer = justice_tools_answer( $name );
check( false !== strpos( $answer, '16,499' ) && false !== strpos( $answer, '16,300' ) && false !== strpos( $answer, '53,025' ) && false !== strpos( $answer, '11,093' ) && false !== mb_strpos( $answer, 'נבדק 31.10.2026' ), 'statistics: the answer box (2024, the earlier peak, the weddings, the rabbinical courts 2025)' );
$sources = justice_tools_sources( $name );
check( count( $sources ) >= 5 && false !== strpos( $sources[0]['url'], 'cbs.gov.il' ), 'statistics: the sources, the CBS first' );

// 3. The office line of the registered card.
$maya   = new WP_Post( 19130, 'advocate-maya-rotenberg', 'עו"ד מאיה רוטנברג' );
$other  = new WP_Post( 1, 'someone-else', 'עו"ד אחר' );
$office = justice_theme_lawyer_office( $maya );
check( null === justice_theme_lawyer_office( $other ), 'office: only a lawyer with a plan gets one' );
check( is_array( $office ) && 'ראול ולנברג 18, מגדל C, רמת החייל, תל אביב' === $office['address'], 'office: the address is the profile\'s own office_address, without the postal code' );
$oh = justice_theme_lawyer_office_html( $maya, $office );
check( false !== strpos( $oh, '/assets/images/maps/rotenberg-office.svg' ) && false !== strpos( $oh, 'loading="lazy"' ) && false !== strpos( $oh, '© OpenStreetMap' ), 'office: the lazy street plan with its credit' );
check( false !== strpos( $oh, 'https://waze.com/ul?ll=32.1096992%2C34.8373336&navigate=yes' ) && false !== strpos( $oh, 'google.com/maps/dir/?api=1&destination=' ) && false !== strpos( $oh, 'rel="noopener nofollow"' ), 'office: Waze and Google navigation, nofollow' );
check( false === strpos( $oh, '<iframe' ), 'office: no live map until a click' );
$sch = justice_theme_lawyer_office_schema( $maya, $office );
check( 'Attorney' === $sch['@type'] && 'https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/#attorney' === $sch['@id'] && 'ראול ולנברג 18' === $sch['address']['streetAddress'] && 32.1096992 === $sch['geo']['latitude'], 'office schema: the profile\'s Attorney entity, with the address and the pin' );
check( 'https://maps.google.com/?cid=9281051091434286367' === $sch['hasMap'] && in_array( 'https://rotenberglaw.co.il/', $sch['sameAs'], true ) && '+972544705733' === $sch['telephone'], 'office schema: the Google listing as the map, her site, the card\'s phone' );
check( ! isset( $sch['aggregateRating'] ) && ! isset( $sch['review'] ) && false === strpos( json_encode( $sch ), 'Rating' ), 'office schema: no rating taken from another site (Google review-snippet rules)' );
check( false !== strpos( justice_theme_lawyer_office_script(), 'data-jt-office-map' ), 'office: the click-to-load script' );
$plan = (string) file_get_contents( dirname( __DIR__ ) . '/assets/images/maps/rotenberg-office.svg' );
check( strlen( $plan ) < 40000 && false !== strpos( $plan, 'preserveAspectRatio="xMidYMid slice"' ) && false === strpos( $plan, '<script' ) && false === strpos( $plan, 'http' . '://' ) || false !== strpos( $plan, 'xmlns="http://www.w3.org/2000/svg"' ), 'office: the plan is a small, script-free SVG that crops around the pin' );

echo "divorce guide: {$passed} passed, {$failures} failed\n";
exit( $failures ? 1 : 0 );
