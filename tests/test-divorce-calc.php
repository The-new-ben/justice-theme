<?php
/**
 * The divorce calculator and price list (31.10.2026, HAD-616): the catalog entry, the server HTML of the instrument, the
 * answer box, the WebApplication block, the price list and the method sections, and the links they print.
 *
 * Run: php tests/test-divorce-calc.php            (JT_PREVIEW=<file> also writes a preview page with the instrument)
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
function get_permalink() { return 'https://jus-tice.co.il/divorce-lawyer/'; }
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

$tool    = $jt_shortcodes['justice_tool'];
$section = $jt_shortcodes['justice_tool_section'];
$catalog = justice_tools_catalog();
$reg     = justice_tools_registry();
$name    = 'machshevon-gerushin';

// 1. The catalog and the data island.
$c = $catalog[ $name ] ?? array();
check( isset( $catalog[ $name ] ) && 'fl_mechiron' === $c['dataset'] && '/divorce-lawyer/' === $c['page'] && 'FinanceApplication' === $c['category'], 'catalog: the instrument, its dataset, its page and its category' );
check( array( 'registry_version', 'divorce_cost', 'fl_mechiron' ) === $c['data'], 'catalog: the data island carries the dataset, VAT and the clock only (no fee table, no other tool)' );
check( false !== mb_strpos( $c['name'], 'מחשבון גירושין' ) && false !== mb_strpos( $c['name'], 'מחירון גירושין' ) && false !== mb_strpos( $c['title'], 'מחשבון גירושין' ), 'catalog: "מחשבון גירושין" and "מחירון גירושין" in the name and the title' );
check( in_array( $name, justice_tools_divcalc_names(), true ) && '2026-10-31' === justice_tools_checked_on( $name ), 'checked on 31.10.2026 (the dataset date)' );

// 2. The instrument's server HTML.
justice_tools_printed( '', true );
$html = $tool( array( 'name' => $name ) );
check( false !== strpos( $html, 'id="jtool-machshevon-gerushin"' ) && false !== strpos( $html, 'data-jtool="machshevon-gerushin"' ), 'instrument: the section and its id' );
check( false !== strpos( $html, 'name="jt72-route" value="agree"' ) && false !== strpos( $html, 'name="jt72-route" value="contested"' ) && false !== strpos( $html, 'name="jt72-forum" value="family"' ), 'instrument: the four routes and the two forums, server-rendered' );
foreach ( array( 'support', 'custody', 'property', 'actuary', 'appraiser', 'business', 'courtExpert', 'coordinator', 'appeal', 'execution', 'prenup', 'notary', 'pleader' ) as $box ) {
	check( false !== strpos( $html, 'name="jt72-' . $box . '"' ), 'instrument: the package box ' . $box );
}
check( false !== strpos( $html, 'jt72-band' ) && false !== mb_strpos( $html, 'צפוי' ) && false !== strpos( $html, '27,148' ), 'instrument: the low/expected/high band with the example (27,148)' );
check( false !== strpos( $html, 'jt72-scen' ) && false !== mb_strpos( $html, 'השוואה בין תרחישים' ) && false !== mb_strpos( $html, 'מה יוזיל' ), 'instrument: the scenarios side by side and what lowers the bill' );
check( false !== strpos( $html, 'data-act="whatsapp"' ) && false !== strpos( $html, 'data-act="print"' ) && false !== strpos( $html, 'data-act="save"' ), 'instrument: WhatsApp, print and save (the shell actions)' );
check( false !== mb_strpos( $html, 'נבדק על ידי הצוות המשפטי של Justice' ), 'instrument: the review line' );
check( 1 === preg_match( '#<script type="application/json" id="jtool-machshevon-gerushin-data">(.*?)</script>#s', $html, $mm ) && null !== json_decode( $mm[1], true ) && ! isset( json_decode( $mm[1], true )['fl_rabanut'] ), 'instrument: the data island parses and leaves the fee tables out' );
check( strlen( $mm[1] ) < 90000, 'instrument: the data island stays under 90 KB (' . strlen( $mm[1] ) . ' bytes)' );
check( 1 === preg_match( '#<script type="application/ld\+json">(\{"@context":"https://schema.org","@type":"WebApplication".*?)</script>#s', $html, $ld ) && 'מחשבון גירושין ומחירון גירושין' === json_decode( $ld[1], true )['name'] && 'FinanceApplication' === json_decode( $ld[1], true )['applicationCategory'], 'schema: WebApplication named "מחשבון גירושין ומחירון גירושין"' );
check( '' === $tool( array( 'name' => $name ) ), 'instrument: printed once per render pass' );

// 3. The answer box.
$answer = justice_tools_answer( $name );
check( false !== mb_strpos( $answer, 'מחשבון גירושין' ) && false !== strpos( $answer, '536' ) && false !== strpos( $answer, '541' ) && false !== strpos( $answer, '326' ) && false !== strpos( $answer, '4,000' ) && false !== strpos( $answer, '250,000' ), 'answer: the phrase, the fees and the published ranges' );
check( false !== mb_strpos( $answer, 'נבדק 31.10.2026 על ידי הצוות המשפטי של Justice' ), 'answer: the check date and who checked' );

// 4. The price list and the method (page sections).
$list = $section( array( 'name' => $name, 'part' => 'compare' ) );
check( false !== strpos( $list, 'id="mechiron-gerushin-table"' ) && false !== mb_strpos( $list, 'אגרות בית הדין הרבני' ) && false !== mb_strpos( $list, 'אגרות בית המשפט לענייני משפחה' ) && false !== mb_strpos( $list, 'טוען רבני' ) && false !== mb_strpos( $list, 'גירושין בשיתוף פעולה' ), 'price list: the official and market groups, the rabbinical pleader, collaborative divorce' );
check( substr_count( $list, 'לא נבדק' ) >= 2 && false !== mb_strpos( $list, 'כמה זמן לוקחים גירושין' ), 'price list: unchecked rows say so; the time table' );
preg_match_all( '#href="([^"]+)"#', $list, $hm );
$foreign = array_filter( $hm[1], static function ( $h ) { return ! preg_match( '#^https://(www\.nevo\.co\.il|www\.gov\.il|data\.gov\.il|rotenberglaw\.co\.il|www\.idi\.org\.il)/#', $h ); } );
check( count( $hm[1] ) > 20 && 0 === count( $foreign ), 'price list: ' . count( $hm[1] ) . ' links, every one official or Adv. Maya Rotenberg\'s office (' . implode( ' ', array_slice( $foreign, 0, 3 ) ) . ')' );
$method = $section( array( 'name' => $name, 'part' => 'method' ) );
check( false !== mb_strpos( $method, 'החציון' ) && false !== mb_strpos( html_entity_decode( $method, ENT_QUOTES, 'UTF-8' ), 'לפני מע"מ' ), 'method: the median and the VAT rule are written out' );
$sources = justice_tools_sources( $name );
check( count( $sources ) >= 9 && false !== mb_strpos( end( $sources )['text'], 'מקורות שוק' ), 'sources: the official texts and the count of market sources' );

// 5. Optional preview page (CSS, the teaser, the instrument, the price list, the bundle).
$preview = getenv( 'JT_PREVIEW' );
if ( $preview ) {
	justice_tools_printed( '', true );
	$css  = file_get_contents( JUSTICE_THEME_DIR . '/assets/css/justice-tools.css' );
	$js   = file_get_contents( JUSTICE_THEME_DIR . '/assets/js/tools/dist/machshevon-gerushin.js' );
	$page = '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;padding:16px;font-family:Assistant,Heebo,sans-serif;background:#fff}' . $css . '</style></head><body><div class="entry-content">'
		. '<p class="jt72-teaser"><a href="#machshevon-gerushin">למחשבון ולמחירון הגירושין ↓</a></p><h3 id="machshevon-gerushin">מחשבון גירושין: כמה יעלו הגירושין שלכם</h3>'
		. $tool( array( 'name' => $name ) ) . '<h3 id="mechiron-gerushin">מחירון גירושין</h3>' . $list . $method . '</div><script>' . $js . '</script></body></html>';
	file_put_contents( $preview, $page );
	echo "preview: {$preview}\n";
}

echo "divorce calculator (PHP): {$passed} passed, {$failures} failed\n";
exit( $failures ? 1 : 0 );
