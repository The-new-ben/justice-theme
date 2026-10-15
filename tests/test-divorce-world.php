<?php
/**
 * The divorce world (HAD-539): the three apps on /divorce-lawyer/ (custody calendar, payment tracker, roadmap), the
 * answer-only shortcode, the practice-landing config (her card after the first section, the reviewed-chapters line) and
 * the release block in .content-drafts/divorce-world/.
 *
 * Run: php tests/test-divorce-world.php
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
require_once dirname( __DIR__ ) . '/inc/lawyer-band.php';

$failures = 0;
function check( bool $ok, string $what ): void {
	global $failures;
	if ( ! $ok ) {
		$failures++;
		fwrite( STDERR, "FAIL: {$what}\n" );
	}
}
/** Words in the answer box (Hebrew and numbers, split on spaces). */
function answer_words( string $html ): int {
	if ( ! preg_match( '#<div class="jtool-answer"><p>(.*?)</p></div>#s', $html, $m ) ) {
		return 0;
	}
	return count( preg_split( '/\s+/u', trim( html_entity_decode( strip_tags( $m[1] ) ) ) ) );
}

$tool    = $jt_shortcodes['justice_tool'];
$section = $jt_shortcodes['justice_tool_section'];
$catalog = justice_tools_catalog();

/* ---------- The catalog ---------- */
$world = array( 'luach-shahut' => 2, 'maakav-mezonot' => 4, 'mapat-gerushin' => 5 );
foreach ( $world as $name => $sets ) {
	check( isset( $catalog[ $name ] ) && '/divorce-lawyer/' === $catalog[ $name ]['page'] && count( $catalog[ $name ]['data'] ) === $sets, "{$name}: in the catalog, on /divorce-lawyer/, {$sets} datasets" );
	check( '/lawyers/?area=family-law' === $catalog[ $name ]['lawyer']['path'], "{$name}: the lawyer link goes to the directory, never to the page itself" );
	check( 'divorce' === $catalog[ $name ]['rehearse']['topic'], "{$name}: the rehearsal is the divorce simulation" );
	check( '2026-10-14' === justice_tools_checked_on( $name ), "{$name}: checked on 14.10.2026 (its dataset)" );
}
check( justice_tools_world_names() === array_keys( $world ), 'the world names helper lists the three apps' );

/* ---------- The server HTML of each app ---------- */
$rendered = array();
foreach ( $world as $name => $sets ) {
	$html = $tool( array( 'name' => $name ) );
	$rendered[ $name ] = $html;
	$card = substr( $html, (int) strpos( $html, '<section class="jtool"' ) );
	$card = substr( $card, 0, (int) strpos( $card, '</section>' ) );
	$words = answer_words( $html );
	check( $words >= 40 && $words <= 60, "{$name}: answer box of 40-60 words ({$words})" );
	check( 1 === preg_match( '#<div class="jtool-answer"><p><strong>[^<]+</strong>#', $html ) && false !== strpos( $html, 'נבדק 14.10.2026.' ), "{$name}: the answer opens with its subject and ends with the check date" );
	check( 1 === preg_match( '#<div class="jtool__title" role="heading" aria-level="2" id="jtool-' . preg_quote( $name, '#' ) . '-title">#', $card ) && false === stripos( $card, '<h2' ), "{$name}: the title is a heading by role, no <h2> in the card (HAD-487)" );
	check( 1 === substr_count( $html, '"@type":"WebApplication"' ) && false !== strpos( $html, '"url":"https://jus-tice.co.il/divorce-lawyer/"' ) && false !== strpos( $html, '"isAccessibleForFree":true' ), "{$name}: one WebApplication on the page URL, free" );
	check( 1 === preg_match( '#<script type="application/json" id="jtool-' . preg_quote( $name, '#' ) . '-data">(.*?)</script>#s', $html, $mm ) && count( json_decode( $mm[1], true ) ) === $sets, "{$name}: the data island carries its {$sets} datasets only" );
	check( isset( $jt_enqueued[ 'justice-tool-' . $name ] ) && false !== strpos( (string) $jt_enqueued[ 'justice-tool-' . $name ], '/assets/js/tools/dist/' . $name . '.js' ), "{$name}: its bundle is enqueued from the dist folder Autoptimize skips" );
	check( count( justice_tools_sources( $name ) ) >= 4 && 1 === preg_match( '#<details class="jtool-sources" id="jtool-' . preg_quote( $name, '#' ) . '-sources"><summary>מקורות \(נבדקו ב-14\.10\.2026\)</summary><ul>(<li>.*?</li>){4,}</ul></details>#s', $html ), "{$name}: at least four sources, each a link with its text" );
	check( false !== strpos( $html, 'data-jtool-form' ) && false !== strpos( $html, 'data-jtool-result' ) && false !== strpos( $html, 'jtool-verdict' ), "{$name}: form and example result are in the server HTML" );
	check( false === stripos( $html, 'noindex' ) && false === strpos( $html, 'רוטנברג' ), "{$name}: no noindex and no named lawyer inside the tool" );
	check( '' === $tool( array( 'name' => $name ) ), "{$name}: prints once per page" );
}
check( false !== strpos( $rendered['luach-shahut'], 'jt20-year' ) && false !== strpos( $rendered['luach-shahut'], 'jt19-cal' ) && substr_count( $rendered['luach-shahut'], 'jt20-d jt20-d--' ) >= 365, 'calendar: the two weeks and 365 nights are in the server HTML' );
check( false !== strpos( $rendered['luach-shahut'], 'סעיפים 24-25 לחוק הכשרות · הלוח העברי · נבדק 14.10.2026' ) && false !== strpos( $rendered['luach-shahut'], 'data-jtool-sticky-figure><bdi>7</bdi>/14' ), 'calendar: the stamp and the sticky figure' );
check( false !== strpos( $rendered['maakav-mezonot'], 'jt21-ledger' ) && false !== strpos( $rendered['maakav-mezonot'], 'מכתב דרישה' ) && false !== strpos( $rendered['maakav-mezonot'], 'data-import' ) && false !== strpos( $rendered['maakav-mezonot'], 'localStorage' ), 'tracker: the ledger, the letter, the import control and the privacy note' );
check( 1 === preg_match( '#ריבית צמודה 3\.82% מ-1\.10\.2026 · מדד אוגוסט 2026 · נבדק 14\.10\.2026#', $rendered['maakav-mezonot'] ), 'tracker: the stamp carries the rate, its date and the index month from the registry' );
check( false !== strpos( $rendered['maakav-mezonot'], 'https://www.gov.il/he/service/opening_alimony_file' ) && false !== strpos( $rendered['maakav-mezonot'], 'data-act="copyletter"' ), 'tracker: the Execution Office service and the letter button' );
check( false !== strpos( $rendered['mapat-gerushin'], 'jt22-rail' ) && substr_count( $rendered['mapat-gerushin'], 'jt22-st__box' ) === 18 && false !== strpos( $rendered['mapat-gerushin'], 'המועדים שבחוק' ) && false !== strpos( $rendered['mapat-gerushin'], '16.12.2026' ), 'roadmap: 18 stations, the statutory dates of the example' );
check( false !== strpos( $rendered['mapat-gerushin'], '<bdi>119</bdi> ₪' ) && false !== strpos( $rendered['mapat-gerushin'], '<bdi>120</bdi> ₪' ) && false !== strpos( $rendered['mapat-gerushin'], '<bdi>536</bdi> ₪' ) && false !== strpos( $rendered['mapat-gerushin'], '<bdi>541</bdi> ₪' ), 'roadmap answer: both request fees and both agreement fees from the registry' );

/* ---------- The page sections ---------- */
foreach ( array_keys( $world ) as $name ) {
	check( false !== strpos( $section( array( 'name' => $name, 'part' => 'compare' ) ), 'jtool-datatable' ) && false !== strpos( $section( array( 'name' => $name, 'part' => 'numbers' ) ), 'jtool-datatable' ), "{$name}: compare and numbers sections render the registry table" );
}
check( false !== strpos( $section( array( 'name' => 'luach-shahut', 'part' => 'compare' ) ), '2-2-3' ) && false !== strpos( $section( array( 'name' => 'mapat-gerushin', 'part' => 'compare' ) ), '2,910' ), 'the patterns table and the three-routes table' );

/* ---------- answer="only" ---------- */
$only = $tool( array( 'name' => 'gerushin', 'mode' => 'lawyer', 'answer' => 'only' ) );
check( 0 === strpos( $only, '<div class="jtool-answer"><p><strong>עורך דין גירושין</strong>' ) && false === strpos( $only, '<section' ) && false === strpos( $only, 'WebApplication' ), 'answer="only": the answer box alone, no instrument, no schema' );
$full = $tool( array( 'name' => 'gerushin', 'mode' => 'lawyer', 'answer' => '0' ) );
check( false !== strpos( $full, 'data-jtool="gerushin" data-jtool-mode="lawyer"' ) && false === strpos( $full, 'jtool-answer' ), 'the instrument still prints once after the answer-only call, without a second answer box' );
check( '' === $tool( array( 'name' => 'gerushin', 'mode' => 'lawyer' ) ) && '' === $tool( array( 'name' => 'no-such-tool', 'answer' => 'only' ) ), 'a second instrument prints nothing; an unknown tool prints nothing' );
justice_tools_new_render_pass( '' );
check( false !== strpos( $tool( array( 'name' => 'gerushin', 'mode' => 'lawyer', 'answer' => '0' ) ), 'data-jtool="gerushin" data-jtool-mode="lawyer"' ), 'a new render pass (justice-ops pre-renders the body at template_redirect, then the template renders it) prints the instrument again' );
check( '' === $tool( array( 'name' => 'gerushin', 'mode' => 'lawyer', 'answer' => '0' ) ), 'within one pass the instrument still prints once' );
check( isset( $jt_enqueued['justice-tools'] ), 'the answer box enqueues the stylesheet' );

/* ---------- The practice landing: her card after the first section, the reviewed-chapters line ---------- */
$cfg = justice_theme_get_practice_landing_config( 'divorce-lawyer' );
check( is_array( $cfg ) && 1 === $cfg['midfold_after_sections'] && 'advocate-maya-rotenberg' === $cfg['featured_lawyer'] && 'עו"ד מאיה רוטנברג' === $cfg['reviewed_by'], 'config: the premium card after the first section; Maya stays the featured lawyer and the reviewer' );
check( 0 === strpos( $cfg['summary'], 'עורך דין גירושין:' ) && false === strpos( $cfg['summary'], 'מומלץ' ) && str_word_count( preg_replace( '/[^\p{Hebrew}\s]/u', '', $cfg['summary'] ) ) <= 45, 'hero line: the head phrase first, no "מומלץ", short enough for the hero' );
check( array( 'המחשבון והתשובה שמעליו', 'השאלות הנפוצות' ) === justice_theme_practice_landing_team_parts( '[justice_tool name="gerushin" mode="lawyer"]<section class="jt-team-block jt-head-faq">' ), 'team parts: the HAD-532 wording is unchanged for a page without guide blocks' );
check( array( 'המחשבונים, האפליקציות והתשובות שמעליהם', 'מדריכי הכלים וההשוואה לעמודים המדורגים', 'השאלות הנפוצות' ) === justice_theme_practice_landing_team_parts( '[justice_tool name="x"]<div class="jt-team-guide"><section class="jt-team-block">' ), 'team parts: tools, guides and the FAQ, in page order' );
check( justice_theme_practice_landing_has_reviewed_blocks( '<section class="jt-reviewed-block">' ) && ! justice_theme_practice_landing_has_reviewed_blocks( '<p>x</p>' ), 'the reviewed-blocks marker' );
$tpl = (string) file_get_contents( dirname( __DIR__ ) . '/template-parts/content/practice-landing-page.php' );
check( false !== strpos( $tpl, 'הפרקים המסומנים "נבדק על ידי' ) && false !== strpos( $tpl, 'הם הטקסט שעבר את בדיקתה.</strong> שאר העמוד,' ) && 3 === substr_count( $tpl, 'class="eeat-reviewed-footer"' ), 'template: the marked-chapters variant of the reviewed line' );
check( false !== strpos( $tpl, "isset( \$config['midfold_after_sections'] ) ? max( 1, (int) \$config['midfold_after_sections'] ) : 2" ), 'template: the midfold position comes from the config' );
$body = '<p>a</p><h2>one</h2><p>b</p><h2>two</h2><p>c</p><h2>three</h2>';
check( '<p>a</p><h2>one</h2><p>b</p>[CARD]<h2>two</h2><p>c</p><h2>three</h2>' === justice_theme_inject_after_section( $body, '[CARD]', 1 ) && '<p>a</p><h2>one</h2><p>b</p><h2>two</h2><p>c</p>[CARD]<h2>three</h2>' === justice_theme_inject_after_section( $body, '[CARD]' ), 'the card lands after the first section when asked, after the second by default' );

/* ---------- The release block ---------- */
$dir   = dirname( __DIR__ ) . '/.content-drafts/divorce-world/';
$block = (string) file_get_contents( $dir . 'divorce-lawyer.html' );
$notes = substr( $block, 0, (int) strpos( $block, '-->' ) );
$body  = substr( $block, (int) strpos( $block, '-->' ) + 3 );
check( 1 === substr_count( $body, '[justice_tool name="gerushin" mode="lawyer" answer="only"]' ) && 1 === substr_count( $body, '[justice_tool name="gerushin" mode="lawyer" answer="0"]' ), 'the answer box opens the body; the lawyer-cost instrument comes later, once' );
foreach ( array( 'mezonot', 'izun', 'heskem-gerushin', 'heskem-mamon', 'luach-shahut', 'maakav-mezonot', 'mapat-gerushin' ) as $nm ) {
	check( 1 === preg_match_all( '#\[justice_tool name="' . preg_quote( $nm, '#' ) . '"[^\]]*\]#', $body ), "the {$nm} instrument is placed exactly once" );
}
check( 0 === preg_match( '/\[justice_tool_section/', $body ), 'no section shortcodes: every table a reader needs is inside its instrument' );
$first_h2 = (int) strpos( $body, '<h2' );
check( (int) strpos( $body, 'answer="only"' ) < (int) strpos( $body, 'jtool-simstrip' ) && (int) strpos( $body, 'jtool-simstrip' ) < (int) strpos( $body, 'jt-expert-line' ) && (int) strpos( $body, 'jt-expert-line' ) < $first_h2, 'order: answer box, simulation strip, the expert line, then the first heading' );
check( 1 === substr_count( $body, 'data-hadmaia-article-entry="divorce"' ) && false !== strpos( $body, 'purpose=mediation&amp;topic=divorce' ), 'one simulation strip into the mediation rehearsal; the theme adds no second aside' );
check( 1 === substr_count( $body, 'href="/lawyers/advocate-maya-rotenberg/"' ) && false !== strpos( $body, 'class="jt-expert-line"' ), 'the expert line links her profile once' );
preg_match( '#<h2>([^<]+)</h2>#u', $body, $h2 );
check( 0 === strpos( $h2[1], 'עורך דין גירושין' ), 'the first heading opens with the head phrase' );
$second_h2 = (int) strpos( $body, '<h2', $first_h2 + 3 );
$sec1 = substr( $body, $first_h2, $second_h2 - $first_h2 );
check( false !== strpos( $sec1, 'jt-world-map' ) && 8 === substr_count( $sec1, 'jt-world-map__card' ) - 3 && str_word_count( preg_replace( '/[^\p{Hebrew}\s]/u', '', strip_tags( substr( $sec1, 0, (int) strpos( $sec1, '<nav' ) ) ) ) ) <= 170, 'the first section is short and carries the eight-card tool map, so her card lands right after it' );
check( 8 === preg_match_all( '#href="\#jtool-(gerushin|mezonot|izun|heskem-gerushin|heskem-mamon|mapat-gerushin|luach-shahut|maakav-mezonot)"#', $sec1 ), 'the map links every instrument on the page' );
check( substr_count( $body, 'class="jt-reviewed-block"' ) >= 5 && substr_count( $body, '<p class="jt-reviewed-block__tag">נבדק על ידי עו"ד מאיה רוטנברג</p>' ) === substr_count( $body, 'class="jt-reviewed-block"' ), 'her chapters are marked, each with the visible tag' );
foreach ( array( 'אל תחכו לפגישת ייעוץ רגילה כאשר מתקיים אחד המצבים הבאים:', 'הכותרת עורך דין גירושין מכסה מצבים שונים מאוד. בקשו הוכחה לניסיון בסוג הבעיה שלכם, לא רק הצהרה כללית על שנות ותק.', 'היקף העבודה משתנה לפי ההסכם עם עורך הדין, אך בדרך כלל הייצוג יכול לכלול את הפעולות הבאות:', 'פגישה יעילה מתחילה בחומר מסודר. אין צורך לכתוב סיפור ארוך. הכינו תיקייה עם:', 'מי יטפל בתיק ביום יום ומי יופיע בדיונים?', 'במחלוקת משפחתית נדרש בדרך כלל להתחיל בבקשה ליישוב סכסוך לפני הגשת תביעות.', 'ב-18 בנובמבר 2025 נכנס לתוקף תיקון מס\' 6 לחוק שיפוט בתי דין רבניים, כהוראת שעה לשנתיים.', 'הסיוע המשפטי במשרד המשפטים מטפל, בכפוף לתנאי הזכאות ולבחינת הבקשה, גם בענייני גירושין, מזונות, משמורת, חלוקת רכוש, אלימות במשפחה והתרת נישואין.', 'המידע בעמוד הוא מידע משפטי כללי. הוא אינו מחליף בדיקה של מסמכי המקרה, הדין שבתוקף והחלטות שכבר ניתנו בין הצדדים.' ) as $sentence ) {
	$at = strpos( $body, $sentence );
	check( false !== $at && false !== ( $open = strrpos( substr( $body, 0, $at ), 'class="jt-reviewed-block"' ) ) && ( false === ( $close = strrpos( substr( $body, 0, $at ), '</section>' ) ) || $close < $open ), 'her sentence is kept word for word inside a reviewed block: ' . mb_substr( $sentence, 0, 40 ) );
}
check( false !== strpos( $body, 'class="jt-team-guide"' ) && false !== strpos( $body, 'class="jt-team-block jt-head-faq"' ), 'team guides and the team FAQ are marked for the reviewed line' );
// The team's public copy: no year outside "נבדק" lines and the reviewed blocks; no superlatives.
$team = preg_replace( '#<section class="jt-reviewed-block">.*?</section>#su', '', $body );
$team = preg_replace( '#<caption>.*?</caption>#su', '', $team );
$team_text = strip_tags( $team );
$team_lines = array_filter( array_map( 'trim', explode( "\n", $team_text ) ), static fn( $l ) => '' !== $l && false === strpos( $l, 'נבדק' ) );
check( 0 === preg_match( '/\b20(1|2)\d\b/', implode( ' ', $team_lines ) ), 'team copy: no year outside the "נבדק" lines (the reviewed Amendment 6 chapter and the comparison caption excepted)' );
check( 0 === preg_match( '/הטוב ביותר|המוביל בארץ|מספר 1|100%/u', $team_text ), 'team copy: no superlatives' );
// The FAQ: 12 real queries, each answer one paragraph that routes to its owner.
preg_match( '#<section class="jt-team-block jt-head-faq">(.*?)</section>#su', $body, $faq_m );
$faq = $faq_m[1];
check( 1 === preg_match( '#<h2>([^<]*שאלות נפוצות[^<]*)</h2>#u', $faq, $fh ) && false !== strpos( $fh[1], 'עורך דין גירושין' ), 'FAQ heading: "שאלות נפוצות" with the head phrase' );
preg_match_all( '#<h3>(.+?)</h3>\s*<p>(.+?)</p>#us', $faq, $pairs, PREG_SET_ORDER );
check( count( $pairs ) === 12 && count( $pairs ) === substr_count( $faq, '<h3>' ), '12 questions, each an h3 followed by its one-paragraph answer (FAQPage builder)' );
check( 1 === preg_match( '#<h3>[^<]*</h3>\s*<p>(?:(?!</p>).)*</p>\s*$#us', trim( $faq ) ), 'the last answer is the last <p> before the section ends' );
foreach ( $pairs as $p ) {
	check( false !== strpos( $p[2], '<a href="/' ), 'the answer routes to an owner page: ' . strip_tags( $p[1] ) );
}
$queries = array( 'איך בוחרים עורך דין גירושין', 'כמה עולה עורך דין גירושין', 'איך מתגרשים בישראל', 'כמה זמן לוקח להתגרש', 'עורכת דין גירושין', 'מי משלם מזונות במשמורת משותפת', 'מה עושים כשלא משלמים מזונות', 'עורך דין גירושין בעיר שלי' );
foreach ( $queries as $q ) {
	check( false !== strpos( $faq, $q ), 'a real query is answered: ' . $q );
}
// Links: relative owners or https sources, each internal page once-ish, never the page itself.
preg_match_all( '#href="([^"]+)"#', $body, $hrefs );
$internal = array_values( array_filter( $hrefs[1], static fn( $h ) => 0 === strpos( $h, '/' ) ) );
check( ! in_array( '/divorce-lawyer/', $internal, true ) && ! in_array( 'https://jus-tice.co.il/divorce-lawyer/', $hrefs[1], true ), 'no link from the page to itself' );
check( count( $internal ) >= 40, 'the page links the whole family cluster (' . count( $internal ) . ' internal links)' );
foreach ( array( '/child-support/', '/resource-balancing/', '/divorce-agreement/', '/prenuptial-agreement/', '/parenting-time-arrangements/', '/divorce-mediation/', '/divorce-costs-2025/', '/the-recommended-family-lawyers/', '/experienced-family-law-attorney/', '/request-for-family-dispute-settlements/', '/opening-divorce-file-rabbinical/', '/child-custody/', '/free-divorce-agreement-template/', '/prenuptial-agreements-overview/', '/bituach-leumi-alimony/', '/tzmidut-mezonot/', '/rsu-options-crypto/', '/fees-rabbinical-courts/', '/refusal-of-get/', '/legal-aid-israel/', '/women-lawyer-vs-men-divorce-lawyer/', '/family-lawyer-tel-aviv/' ) as $owner ) {
	check( in_array( $owner, $internal, true ), 'the owner of a sub-topic is linked: ' . $owner );
}
foreach ( $hrefs[1] as $h ) {
	check( 0 === strpos( $h, '/' ) || 0 === strpos( $h, '#' ) || 0 === strpos( $h, 'https://' ), 'every link is relative, an anchor or https: ' . $h );
}
check( false === strpos( $body, 'http://' ), 'no plain-http link' );
// Length and keywords.
$words = count( preg_split( '/\s+/u', trim( strip_tags( $body ) ) ) );
check( $words >= 3500, "the page holds the whole world ({$words} words of text around eight instruments)" );
foreach ( array( 'עורכת דין גירושין', 'עורך דין לגירושין', 'עורך דין לענייני גירושין', 'משרד עורכי דין גירושין', 'עורך דין משפחה', 'עורך דין לענייני משפחה', 'עורך דין מזונות', 'עורך דין משמורת', 'עורך דין הסכם גירושין', 'עורך דין גירושין מומלץ', 'עורך דין גירושין בתל אביב', 'מזונות ילדים', 'הסכם גירושין', 'משמורת משותפת', 'הסדרי שהות', 'איזון משאבים', 'הסכם ממון', 'גישור גירושין', 'בית הדין הרבני', 'יישוב סכסוך' ) as $kw ) {
	check( false !== strpos( $body, $kw ), 'the phrase appears: ' . $kw );
}
check( substr_count( strip_tags( $body ), 'עורך דין גירושין' ) <= 30, 'the head phrase is not stuffed' );
check( substr_count( $body, 'class="jt-compare' ) === 1 && false !== strpos( $body, 'העמודים המדורגים ראשונים' ) && 0 === preg_match( '/divorce1|moskovich|hhlaw|lucymeir|lawreviews|avivharel|wolf-law|gerushin\.co|rotenberglaw/i', $body ), 'the comparison names no firm' );
// Yoast in the notes.
check( 1 === preg_match( '/Title \((\d+)\): ([^\n]+)/u', $notes, $t ) && (int) $t[1] === mb_strlen( $t[2] ) && mb_strlen( $t[2] ) <= 60 && 0 === strpos( $t[2], 'עורך דין גירושין' ) && false === strpos( $t[2], 'מומלץ' ) && 0 === preg_match( '/20\d\d/', $t[2] ), 'Yoast title: counted, at most 60, head phrase first, no "מומלץ", no year' );
check( 1 === preg_match( '/Meta \((\d+)\): ([^\n]+)/u', $notes, $d ) && (int) $d[1] === mb_strlen( $d[2] ) && mb_strlen( $d[2] ) <= 160 && 0 === strpos( $d[2], 'עורך דין גירושין' ) && 0 === preg_match( '/20\d\d/', $d[2] ), 'Yoast meta: counted, at most 160, head phrase first, no year' );
check( false !== strpos( $notes, 'Save a revision' ) && false !== strpos( $notes, 'Purge /divorce-lawyer/' ) && false !== strpos( $notes, 'Indexing is Ben' ), 'release notes: revision, purge, indexing stays the owner\'s' );
check( false === strpos( $block, "\r" ), 'LF only' );

if ( $failures ) {
	fwrite( STDERR, "divorce world: {$failures} failure(s)\n" );
	exit( 1 );
}
echo "divorce world: ok\n";
