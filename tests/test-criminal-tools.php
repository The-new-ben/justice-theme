<?php
/**
 * The criminal hub's instruments (HAD-651, 31.10.2026): choosing a criminal lawyer (bchirat-orech-din-plili) and the
 * fee table by stage (sachar-orech-din-plili): catalog, server HTML, schema, the answer box and the sources.
 *
 * Run: php tests/test-criminal-tools.php
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
function wp_get_attachment_image( $id, $size = '', $icon = false, $attr = array() ) { return ''; }
function get_the_post_thumbnail( $p = null, $size = '', $attr = array() ) { return '<img class="jt-premium-card__photo" src="https://jus-tice.co.il/maya.jpg" alt="">'; }
function wp_trim_words( $t, $n = 55, $more = null ) { return implode( ' ', array_slice( preg_split( '/\s+/u', trim( (string) $t ) ), 0, $n ) ); }

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

$tool    = $jt_shortcodes['justice_tool'];
$catalog = justice_tools_catalog();
$reg     = justice_tools_registry();

// 1. The selector.
$name = 'bchirat-orech-din-plili';
$c    = $catalog[ $name ] ?? array();
check( isset( $catalog[ $name ] ) && 'fl_plili' === $c['dataset'] && array( 'registry_version', 'fl_plili', 'fl_plili_sachar' ) === $c['data'] && '/criminal-defense-attorney/' === $c['page'], 'selector: catalog, datasets and page' );
check( 'criminal-law' === $c['rehearse']['topic'] && 'police_interrogation' === $c['rehearse']['purpose'], 'selector: the interrogation rehearsal' );
justice_tools_printed( '', true );
$html = $tool( array( 'name' => $name ) );
check( false !== strpos( $html, 'id="jtool-bchirat-orech-din-plili"' ) && false !== strpos( $html, 'name="jt76-stage" value="arrest"' ) && false !== strpos( $html, 'id="jt76-district"' ), 'selector: server HTML with the questions and the district' );
check( false !== mb_strpos( $html, 'שאלות לפגישה הראשונה' ) && false !== mb_strpos( $html, 'דגלים אדומים' ) && false !== strpos( $html, '/police-investigation-rights/' ), 'selector: the questions, the warnings and the stage guide in the server HTML' );
check( false === mb_strpos( $html, 'המומלצ' ) && false === mb_strpos( $html, 'הטוב ביותר' ), 'selector: no superlative' );
check( 1 === preg_match( '#<script type="application/ld\+json">(\{"@context":"https://schema.org","@type":"WebApplication".*?)</script>#s', $html, $ld ) && 'בחירת עורך דין פלילי' === json_decode( $ld[1], true )['name'], 'selector: WebApplication schema' );
$answer = justice_tools_answer( $name );
check( false !== mb_strpos( $answer, 'בחירת עורך דין פלילי' ) && false !== mb_strpos( $answer, 'נבדק 31.10.2026' ), 'selector: the answer box' );

// 2. The fee table.
$name = 'sachar-orech-din-plili';
$c    = $catalog[ $name ] ?? array();
check( isset( $catalog[ $name ] ) && 'fl_plili_sachar' === $c['dataset'] && 'money' === $c['sticky_kind'], 'fees: catalog and the money sticky' );
justice_tools_printed( '', true );
$html = $tool( array( 'name' => $name ) );
check( false !== strpos( $html, 'id="jtool-sachar-orech-din-plili"' ) && false !== strpos( $html, '<caption>' ) && false !== strpos( $html, '/eligibility-public-defender-income/' ), 'fees: server HTML with the table and the public defender row' );
check( 1 === preg_match( '#<script type="application/json" id="jtool-sachar-orech-din-plili-data">(.*?)</script>#s', $html, $mm ) && null !== json_decode( $mm[1], true ), 'fees: the data island parses' );
$answer = justice_tools_answer( $name );
check( false !== mb_strpos( $answer, 'כמה עולה עורך דין פלילי' ) && false !== mb_strpos( $answer, '₪' ), 'fees: the answer box with amounts' );
check( count( justice_tools_sources( $name ) ) >= 3, 'fees: the sources' );

// 3. Offences, the timeline and the rights card.
foreach ( array( 'onshei-averot' => 'עבירות פליליות ועונשן המרבי', 'halich-plili' => 'ההליך הפלילי שלב אחרי שלב', 'zchuyot-chashud' => 'הזכויות שלכם בחקירה ובמעצר' ) as $name => $title_part ) {
	justice_tools_printed( '', true );
	$html = $tool( array( 'name' => $name ) );
	check( false !== strpos( $html, 'id="jtool-' . $name . '"' ) && false !== mb_strpos( $html, $title_part ) && false !== strpos( $html, 'application/ld+json' ), $name . ': server HTML with its title and schema' );
	check( false !== mb_strpos( justice_tools_answer( $name ), 'נבדק 31.10.2026' ), $name . ': the answer box' );
	check( count( justice_tools_sources( $name ) ) >= 3, $name . ': the sources' );
}
justice_tools_printed( '', true );
$html = $tool( array( 'name' => 'zchuyot-chashud' ) );
check( false !== mb_strpos( $html, 'יובא בהקדם האפשרי, ולא יאוחר מ־24 שעות, בפני שופט.' ) && false !== mb_strpos( $html, 'בניסוח חופשי' ), 'rights: the quote of section 29 and the plain-wording marks in the server HTML' );

echo "criminal tools: {$passed} passed, {$failures} failed
";
exit( $failures ? 1 : 0 );
