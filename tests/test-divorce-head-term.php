<?php
/**
 * The divorce-lawyer head term (HAD-532): the gerushin "lawyer" mode for /divorce-lawyer/, the one contextual
 * "עורך דין גירושין" link from the divorce tools, the hero line, the truthful reviewed-by line, the LegalService
 * mapping and the release blocks in .content-drafts/divorce-head-term/.
 *
 * Run: php tests/test-divorce-head-term.php
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
function sanitize_title( $t ) { return strtolower( trim( (string) $t ) ); }
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
require_once dirname( __DIR__ ) . '/inc/practice-landing.php';
require_once dirname( __DIR__ ) . '/inc/schema.php';

$failures = 0;
function check( bool $ok, string $what ): void {
	global $failures;
	if ( ! $ok ) {
		$failures++;
		fwrite( STDERR, "FAIL: {$what}\n" );
	}
}

/* ---------- The gerushin "lawyer" mode, the instrument for /divorce-lawyer/ ---------- */
$tool = $jt_shortcodes['justice_tool'];
$html = $tool( array( 'name' => 'gerushin', 'mode' => 'lawyer' ) );
$box  = substr( $html, 0, (int) strpos( $html, '<section' ) );
$card = substr( $html, (int) strpos( $html, '<section class="jtool"' ) );
$card = substr( $card, 0, (int) strpos( $card, '</section>' ) );
check( 0 === strpos( $box, '<div class="jtool-answer"><p><strong>עורך דין גירושין</strong> מייצג' ), 'answer box opens with the head phrase and what the lawyer does' );
check( false !== strpos( $box, '<bdi>1,287</bdi>' ) && false !== strpos( $box, '<bdi>3,173</bdi>' ) && false !== strpos( $box, '<bdi>2,480</bdi>' ), 'answer box: the bar minimums 1,287 / 3,173 / 2,480 from the registry' );
check( false !== strpos( $box, 'פרט 8(5)' ) && false !== strpos( $box, 'פרט 8(6)' ) && false !== strpos( $box, 'פרט 8(9)' ) && false !== strpos( $box, 'סעיף 3(ב)(1)' ), 'answer box: every number with its item or section' );
check( false !== strpos( $box, 'שאינה מחייבת' ) && false !== strpos( $box, 'נבדק 14.10.2026' ) && false !== strpos( $box, 'רק בבית הדין הרבני' ), 'answer box: not binding, the check date, the get only in the rabbinical court' );
$box_copy = str_replace( 'נבדק 14.10.2026', '', $box );
check( false === strpos( $box_copy, 'מומלץ ביותר' ) && false === strpos( $box_copy, '2025' ) && false === strpos( $box_copy, '2026' ), 'answer box: no superlative and no year outside the check date' );
check( false !== strpos( $html, 'data-jtool="gerushin" data-jtool-mode="lawyer"' ), 'the instrument carries its mode' );
check( false !== strpos( $card, '<div class="jtool__title" role="heading" aria-level="2" id="jtool-gerushin-title">כמה יעלה עורך דין גירושין, ומה עוד משלמים בדרך</div>' ), 'tool title is a heading by role, with the lawyer framing' );
check( false === stripos( $card, '<h2' ), 'no <h2> inside the tool card (HAD-487)' );
check( false !== strpos( $html, 'jt9-lanes' ) && false !== strpos( $html, '3,767' ), 'the shared instrument is in the server HTML (lanes, the lawyer minimum of the example)' );
check( false !== strpos( $html, 'תעריף לשכת עורכי הדין והאגרות · נבדק 14.10.2026' ), 'the lawyer stamp' );
check( 1 === substr_count( $html, '"@type":"WebApplication"' ) && false !== strpos( $html, '"name":"מחשבון עלות עורך דין גירושין"' ) && false !== strpos( $html, '"url":"https://jus-tice.co.il/divorce-lawyer/"' ), 'one WebApplication, named for the mode, on the page URL' );
check( false === strpos( $html, 'FAQPage' ) && false === stripos( $html, 'noindex' ) && false === stripos( $html, 'maya' ) && false === strpos( $html, 'רוטנברג' ), 'no FAQPage, no noindex, no named lawyer on the tool' );
check( false !== strpos( $html, 'href="https://jus-tice.co.il/divorce-costs-2025/">עלויות גירושין ושכר טרחה</a>' ) && false !== strpos( $html, 'href="https://jus-tice.co.il/opening-divorce-file-rabbinical/"' ), 'next steps route the price intent to its owner and the fees to the file page' );
check( false !== strpos( $html, 'href="https://jus-tice.co.il/lawyers/?area=family-law" data-act="lawyer"' ) && false === strpos( $html, 'href="https://jus-tice.co.il/divorce-lawyer/"' ), 'the lawyer link goes to the directory; no link from the page to itself' );
check( isset( $jt_enqueued['justice-tool-gerushin'] ), 'the gerushin bundle is enqueued' );
check( array() === justice_tools_snapshot( 'mezonot', 'no-such-mode' ) && array() !== justice_tools_snapshot( 'gerushin', 'lawyer' ), 'only a mode that declares shares_form reuses the base snapshot' );
$base = $tool( array( 'name' => 'heskem-mamon' ) );
check( '' !== $base, 'other tools still render' );

/* ---------- One contextual head-term link from the divorce tools; the others keep /family-law/ ---------- */
$lawyer_link = static function ( string $html ): string {
	return 1 === preg_match( '#<a href="([^"]+)" data-act="lawyer">([^<]+)</a>#u', $html, $m ) ? $m[1] . ' ' . $m[2] : '';
};
foreach ( array( 'heskem-gerushin', 'izun' ) as $nm ) {
	$t = $tool( array( 'name' => $nm ) );
	check( 'https://jus-tice.co.il/divorce-lawyer/ עורך דין גירושין' === $lawyer_link( $t ), $nm . ': the lawyer link is "עורך דין גירושין" to /divorce-lawyer/' );
	check( 1 === substr_count( $t, '>עורך דין גירושין</a>' ), $nm . ': exactly one head-term anchor in the tool' );
}
// One instrument per tool per page, so the modes are read from the catalog (the shortcode would print nothing twice).
check( array( 'label' => 'עורך דין גירושין', 'path' => '/divorce-lawyer/' ) === justice_tools_tool( 'izun', 'hon' )['lawyer'], 'izun/hon (RSU and crypto in a divorce) inherits the divorce lawyer link' );
check( array( 'label' => 'עורך דין לענייני משפחה', 'path' => '/family-law/' ) === justice_tools_tool( 'heskem-gerushin', 'horut' )['lawyer'], 'parenting time keeps the family-law pillar' );
check( 'https://jus-tice.co.il/family-law/ עורך דין לענייני משפחה' === $lawyer_link( $tool( array( 'name' => 'mezonot' ) ) ), 'child support keeps the family-law pillar' );
check( 'https://jus-tice.co.il/family-law/ עורך דין לענייני משפחה' === $lawyer_link( $base ), 'the prenup keeps the family-law pillar' );

/* ---------- The hero line and the reviewed-by line ---------- */
$cfg = justice_theme_get_practice_landing_config( 'divorce-lawyer' );
check( is_array( $cfg ) && 0 === strpos( $cfg['summary'], 'עורך דין גירושין:' ) && false === strpos( $cfg['summary'], 'מומלץ' ) && false === strpos( $cfg['summary'], 'השוואת משרדים' ), 'hero line: the head phrase first, no "מומלץ", no office comparison' );
check( 'advocate-maya-rotenberg' === $cfg['featured_lawyer'] && 'עו"ד מאיה רוטנברג' === $cfg['reviewed_by'], 'Maya stays the featured lawyer and the reviewer' );
check( array() === justice_theme_practice_landing_team_parts( '<p>טקסט שנבדק</p>' ), 'a page without team content keeps the full reviewed-by line' );
check( array( 'המחשבון והתשובה שמעליו', 'השאלות הנפוצות' ) === justice_theme_practice_landing_team_parts( '[justice_tool name="gerushin" mode="lawyer"]<section class="jt-team-block jt-head-faq">' ), 'tool and team FAQ are both named' );
$tpl = (string) file_get_contents( dirname( __DIR__ ) . '/template-parts/content/practice-landing-page.php' );
check( false !== strpos( $tpl, 'הטקסט במדריך נבדק על ידי' ) && false !== strpos( $tpl, ': צוות Jus-Tice, מול המקורות שמצוינים בהם.' ) && false !== strpos( $tpl, 'התוכן בעמוד נבדק על ידי' ), 'template: the narrowed line when team content is present, the full line otherwise' );
check( 2 === substr_count( $tpl, 'class="eeat-reviewed-footer"' ), 'template: both variants keep the eeat-reviewed-footer class the ops strippers match' );

/* ---------- LegalService on the owner page ---------- */
$map = justice_theme_practice_area_service_map();
check( isset( $map['divorce-lawyer'] ) && 'דיני משפחה וגירושין' === $map['divorce-lawyer']['label'], 'LegalService serviceType on /divorce-lawyer/' );
check( false === ( $map['divorce-lawyer']['collection'] ?? true ) && true === ( $map['criminal-defense-attorney']['collection'] ?? true ), 'no CollectionPage from the divorce slug (its lawyers come from the family-law term); other pillars keep theirs' );
$schema_src = (string) file_get_contents( dirname( __DIR__ ) . '/inc/schema.php' );
check( false !== strpos( $schema_src, 'false === ( $practice_map[ $current_slug ][\'collection\'] ?? true )' ), 'the CollectionPage builder honours the flag' );

/* ---------- Release blocks ---------- */
$dir   = dirname( __DIR__ ) . '/.content-drafts/divorce-head-term/';
$block = (string) file_get_contents( $dir . 'divorce-lawyer.html' );
$body  = substr( $block, (int) strpos( $block, '-->' ) );
check( 1 === substr_count( $body, '[justice_tool name="gerushin" mode="lawyer"]' ), 'block A: the lawyer-mode shortcode, once' );
check( 1 === preg_match( '#<h2>([^<]*שאלות נפוצות[^<]*)</h2>#u', $body, $h2 ) && false !== strpos( $h2[1], 'עורך דין גירושין' ), 'block B: the FAQ heading carries "שאלות נפוצות" and the head phrase' );
check( false !== strpos( $body, 'class="jt-team-block' ), 'block B is marked as team content for the reviewed-by line' );
$faq = substr( $body, (int) strpos( $body, 'שאלות נפוצות' ) );
preg_match_all( '#<h3>(.+?)</h3>\s*<p>(.+?)</p>#us', $faq, $pairs, PREG_SET_ORDER );
check( count( $pairs ) >= 7 && count( $pairs ) === substr_count( $faq, '<h3>' ), 'block B: every question is an h3 followed by its one-paragraph answer (FAQPage builder)' );
check( 1 === preg_match( '#<h3>[^<]*</h3>\s*<p>(?:(?!</p>).)*</p>\s*</section>#us', $faq ), 'block B: the last answer is the last <p> before the section ends (the pillar builder joins consecutive <p>)' );
$allowed = array( '/experienced-family-law-attorney/', '/divorce-costs-2025/', '/free-divorce-agreement-template/', '/women-lawyer-vs-men-divorce-lawyer/', '/legal-aid-israel/', '/opening-divorce-file-rabbinical/', '/divorce-mediation/', '/family-lawyer-tel-aviv/', '/family-law-petah-tikva/', '/family-law-rishon-lezion/', '/family-law-haifa/', '/family-law-beer-sheva/', '/family-law-netanya/', '/family-law-ashdod/', '/family-law-herzliya/', '/family-law-rehovot/', '/family-law-modiin/' );
preg_match_all( '#href="([^"]+)"#', $body, $hrefs );
check( array() === array_diff( $hrefs[1], $allowed ) && count( $hrefs[1] ) === count( array_unique( $hrefs[1] ) ), 'block B: links only to the variant owners checked 200 on 14.10.2026, each once' );
check( ! in_array( '/divorce-lawyer/', $hrefs[1], true ) && 1 === substr_count( $body, '>עורך דין גירושין בתל אביב</a>' ), 'block B: no self-link; one city-variant anchor' );
foreach ( $pairs as $p ) {
	check( false !== strpos( $p[2], '<a href="/' ), 'answer routes to its owner page: ' . strip_tags( $p[1] ) );
}
check( 0 === preg_match( '/\b20(1|2)\d\b/', strip_tags( $body ) ), 'block B: no year in the public copy' );
check( 1 === preg_match( '/Title \((\d+)\): ([^\n]+)/u', $block, $t ) && (int) $t[1] === mb_strlen( $t[2] ) && mb_strlen( $t[2] ) <= 60 && false === strpos( $t[2], 'מומלץ' ) && 0 === preg_match( '/20\d\d/', $t[2] ), 'Yoast title for /divorce-lawyer/: counted, at most 60, no "מומלץ", no year' );
$city = (string) file_get_contents( $dir . 'city-titles.html' );
preg_match_all( '/Title proposed \((\d+)\): ([^\n]+)/u', $city, $ct, PREG_SET_ORDER );
check( 2 === count( $ct ), 'two city titles proposed' );
foreach ( $ct as $c ) {
	check( (int) $c[1] === mb_strlen( $c[2] ) && mb_strlen( $c[2] ) <= 60 && 0 === strpos( $c[2], 'עורך דין גירושין' ) && 0 === preg_match( '/20\d\d/', $c[2] ), 'city title counted, at most 60, head phrase first, no year: ' . $c[2] );
}

if ( $failures ) {
	fwrite( STDERR, "divorce head term: {$failures} failure(s)\n" );
	exit( 1 );
}
echo "divorce head term: ok\n";
