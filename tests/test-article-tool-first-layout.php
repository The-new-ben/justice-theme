<?php
/**
 * An article that opens with a tool (HAD-502): single-articles.php drops the top featured image, uses
 * the page-style header and keeps the tool's answer box as one paragraph, so the form starts above the
 * fold at 1280x900 (1,708 px before). Every other article, and every article with a named topic
 * reviewer (Maya Rotenberg on family law), renders the original layout.
 *
 * Run: php tests/test-article-tool-first-layout.php
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'JUSTICE_THEME_DIR', dirname( __DIR__ ) );
define( 'JUSTICE_THEME_URI', 'https://jus-tice.co.il/wp-content/themes/justice-theme' );
define( 'JUSTICE_THEME_VERSION', 'test' );
define( 'JUSTICE_TOOLS_TODAY', '2026-10-14' );

$jt_shortcodes = array();
$jt_post       = array();
$jt_loop       = 0;
$jt_body       = '';

function add_shortcode( $tag, $cb ): void { global $jt_shortcodes; $jt_shortcodes[ $tag ] = $cb; }
function add_action( $tag, $cb, $priority = 10, $args = 1 ): void {}
function add_filter( $tag, $cb, $priority = 10, $args = 1 ): void {}
function shortcode_atts( $pairs, $atts, $tag = '' ) { $atts = (array) $atts; $out = array(); foreach ( $pairs as $k => $v ) { $out[ $k ] = array_key_exists( $k, $atts ) ? $atts[ $k ] : $v; } return $out; }
function sanitize_key( $key ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $key ) ); }
function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $u ) { return (string) $u; }
function esc_html__( $t, $d = '' ) { return esc_html( $t ); }
function esc_html_e( $t, $d = '' ): void { echo esc_html( $t ); }
function esc_attr_e( $t, $d = '' ): void { echo esc_attr( $t ); }
function __( $t, $d = '' ) { return $t; }
function home_url( $path = '' ) { return 'https://jus-tice.co.il' . $path; }
function get_permalink() { return 'https://jus-tice.co.il/israel-road-accident-compensation-law/'; }
function wp_json_encode( $data, $flags = 0 ) { return json_encode( $data, $flags ); }
function wp_enqueue_style( $h, $src = '', $deps = array(), $ver = false ): void {}
function wp_enqueue_script( $h, $src = '', $deps = array(), $ver = false, $footer = false ): void {}
function wp_strip_all_tags( $text ) { return strip_tags( (string) $text ); }
function is_singular( $t = '' ) { return true; }
function is_admin() { return false; }
function is_feed() { return false; }
function in_the_loop() { return true; }
function get_the_ID() { global $jt_post; return (int) $jt_post['id']; }
function get_post_type( $id = 0 ) { global $jt_post; return $jt_post['type']; }
function get_post_field( $field, $id = 0 ) { global $jt_post; return 'post_content' === $field ? $jt_post['content'] : ( 'post_name' === $field ? 'israel-road-accident-compensation-law' : '' ); }
function get_post_meta( $id, $key = '', $single = false ) { return ''; }
function current_user_can( $cap, $id = 0 ) { return false; }
function get_header(): void {}
function get_footer(): void {}
function have_posts() { global $jt_loop; return 0 === $jt_loop++; }
function the_post(): void {}
function post_class( $classes ): void { echo 'class="' . esc_attr( $classes . ' post-1108 articles type-articles' ) . '"'; }
function the_title(): void { echo 'תאונת דרכים: מהו חוק הפיצויים לנפגעי תאונות דרכים?'; }
function get_the_date( $format = '' ) { return DATE_W3C === $format ? '2019-12-31T20:16:39+02:00' : '2019-12-31'; }
function get_the_modified_date( $format = '' ) { return '2026-10-14'; }
function get_bloginfo( $key ) { return 'Jus-Tice.co.il'; }
function apply_filters( $tag, $value ) { return $value; }
function has_post_thumbnail( $id = null ) { return true; }
function the_post_thumbnail( $size, $attr = array() ): void { echo '<img src="https://jus-tice.co.il/wp-content/uploads/2019/12/headlamp.jpg" alt="">'; }
function get_post_type_archive_link( $type ) { return 'https://jus-tice.co.il/lawyers/'; }
function justice_theme_get_primary_practice_area() { return (object) array( 'name' => 'נזיקין ותאונות', 'slug' => 'personal-injury' ); }
function justice_theme_public_term_link( $term ) { return 'https://jus-tice.co.il/tort-lawyer/'; }
function justice_theme_reading_time() { return '5 דקות קריאה'; }
function justice_theme_related_articles( $id ): void {}
function justice_theme_article_reviewer_expert_only( int $post_id ): ?array {
	global $jt_post;
	return $jt_post['maya'] ? array( 'name' => 'עו"ד מאיה רוטנברג', 'url' => 'https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/' ) : null;
}
function justice_theme_article_visible_attribution( int $post_id ): array {
	$reviewer = justice_theme_article_reviewer_expert_only( $post_id );
	return $reviewer
		? array( 'label' => 'נבדק מקצועית על ידי', 'name' => $reviewer['name'], 'url' => $reviewer['url'] )
		: array( 'label' => 'נערך על ידי', 'name' => 'Jus-Tice.co.il', 'url' => 'https://jus-tice.co.il/' );
}

require_once dirname( __DIR__ ) . '/inc/justice-tools.php';
require_once dirname( __DIR__ ) . '/inc/heading-structure-fix.php';

// the_content(): the tool's server HTML (the real shortcode) and a long legacy body through the real
// heading-spine filter, the way WordPress runs do_shortcode and then the filter at priority 11.
function the_content(): void {
	global $jt_body;
	echo justice_theme_restore_heading_spine( $jt_body );
}

$failures = 0;
function check( bool $ok, string $what ): void {
	global $failures;
	if ( ! $ok ) {
		$failures++;
		fwrite( STDERR, "FAIL: {$what}\n" );
	}
}

/** Render single-articles.php for one post and return the HTML. */
function render_article( string $type, string $raw, bool $maya, string $body ): string {
	global $jt_post, $jt_loop, $jt_body;
	$jt_post = array( 'id' => 1108, 'type' => $type, 'content' => $raw, 'maya' => $maya );
	$jt_loop = 0;
	$jt_body = $body;
	ob_start();
	require dirname( __DIR__ ) . '/single-articles.php';
	return (string) ob_get_clean();
}

/** Whether a post of this type, body and reviewer gets the compact layout. */
function opens_with_tool_for( string $type, string $raw, bool $maya ): bool {
	global $jt_post;
	$jt_post = array( 'id' => 1108, 'type' => $type, 'content' => $raw, 'maya' => $maya );
	return justice_tools_article_opens_with_tool( 1108 );
}

/** The part of the page above the article body. */
function above_body( string $html ): string {
	return substr( $html, 0, (int) strpos( $html, 'single-article__content' ) );
}

/** The tool's answer box as printed in the page. */
function answer_box( string $html ): string {
	return preg_match( '/<div class="jtool-answer">.*?<\/div>/su', $html, $m ) ? $m[0] : '';
}

/* ---------- Detection: what counts as an article that opens with a tool ---------- */
$raw_live = "[justice_tool name=\"teunat-drachim\"]\r\n\r\n<span>תאונת דרכים היא אירוע</span>";
check( justice_tools_content_leads_with_tool( $raw_live ), 'the live raw body (CRLF after the shortcode) opens with a tool' );
check( justice_tools_content_leads_with_tool( "<!-- wp:shortcode -->\n[justice_tool name=\"tzavaa\"]\n<!-- /wp:shortcode -->" ), 'a block-editor shortcode block opens with a tool' );
check( justice_tools_content_leads_with_tool( "\n&nbsp;\n<p> </p>\n[justice_tool name=\"gerushin\" answer=\"0\"]" ), 'whitespace, &nbsp; and an empty paragraph before the tool do not count' );
check( ! justice_tools_content_leads_with_tool( "<p>פתיח קצר.</p>\n[justice_tool name=\"teunat-drachim\"]" ), 'a paragraph before the tool means the article does not open with it' );
check( ! justice_tools_content_leads_with_tool( '[justice_tool_section name="teunat-drachim" part="method"]' ), 'a tool section is not the instrument' );
// HAD-591: the result-first card opens the page the way the instrument does; an unknown name still does not.
check( justice_tools_content_leads_with_tool( "[justice_tool_lead name=\"teunat-drachim\"]\n\n<p>פתיח.</p>\n[justice_tool name=\"teunat-drachim\" answer=\"0\"]" ), 'the result-first card counts as opening with the tool' );
check( ! justice_tools_content_leads_with_tool( '[justice_tool_lead name="no-such-tool"]' ), 'a card for an unknown tool does not' );
check( ! justice_tools_content_leads_with_tool( '[justice_tool name="no-such-tool"]' ), 'an unknown tool prints nothing, so it does not count' );

check( opens_with_tool_for( 'articles', $raw_live, false ), 'an article that opens with a tool gets the compact layout' );
check( ! opens_with_tool_for( 'page', $raw_live, false ), 'pages keep their own template and are never switched' );
check( ! opens_with_tool_for( 'articles', $raw_live, true ), 'an article with a named topic reviewer (Maya Rotenberg) keeps its layout' );

/* ---------- The body: the real tool HTML, then a long legacy article with bold run-ins ---------- */
$tool_html = $jt_shortcodes['justice_tool']( array( 'name' => 'teunat-drachim' ) );
check( '' !== answer_box( $tool_html ) && false !== strpos( $tool_html, '<div class="jtool-form"' ), 'the road-accident tool prints its answer box and form' );
$legacy = '';
for ( $i = 1; $i <= 14; $i++ ) {
	$legacy .= '<p><strong>מי זכאי לפיצוי בסעיף ' . $i . '</strong> ' . str_repeat( 'נפגע בתאונת דרכים זכאי לפיצויים לפי חוק הפיצויים לנפגעי תאונות דרכים. ', 4 ) . '</p>';
}
$body = $tool_html . $legacy;
check( strlen( $body ) > 6000, 'the body is long enough for the heading-spine filter to run' );

/* ---------- The article that opens with a tool ---------- */
$tool_first = render_article( 'articles', $raw_live, false, $body );
$top        = above_body( $tool_first );
check( false !== strpos( $tool_first, 'single-article--tool-first' ), 'the article carries the tool-first class the stylesheet scopes to' );
check( false === strpos( $tool_first, 'single-article__image' ), 'no featured image is printed above the tool' );
check( false === strpos( $top, 'glass-panel' ) && false === strpos( $top, 'margin: 40px auto 3rem' ), 'the header is the compact page-style header, not the 340 px panel' );
check( 1 === substr_count( $tool_first, '<h1 class="single-article__title">תאונת דרכים: מהו חוק הפיצויים לנפגעי תאונות דרכים?</h1>' ), 'one H1 with the article title' );
check( false !== strpos( $top, 'נערך על ידי' ) && false !== strpos( $top, '<a href="https://jus-tice.co.il/">Jus-Tice.co.il</a>' ), 'the byline stays in the header' );
check( false !== strpos( $top, 'https://jus-tice.co.il/tort-lawyer/' ) && false !== strpos( $top, '>נזיקין<' ), 'the practice-area link stays in the header' );
check( false !== strpos( $top, 'datetime="2019-12-31T20:16:39+02:00"' ) && false !== strpos( $top, 'עודכן: 2026-10-14' ), 'the published and updated dates stay in the header' );
$box = answer_box( $tool_first );
check( '' !== $box && false === strpos( $box, '<h2' ) && false !== strpos( $box, '<p><strong>חוק פיצויים לנפגעי תאונות דרכים</strong>' ), 'the answer box stays one short paragraph, its bold lead is not promoted to a heading' );
check( $box === answer_box( $tool_html ), 'the answer box is printed exactly as the tool made it' );
check( false !== strpos( $tool_first, '<h2 class="jt-restored-heading">מי זכאי לפיצוי בסעיף 1</h2>' ), 'the rest of the article still gets its heading spine' );
check( false !== strpos( $tool_first, 'class="jtool__title" role="heading" aria-level="2"' ) && ! preg_match( '/<section class="jtool"[^>]*>.*?<h2/su', substr( $tool_first, 0, (int) strpos( $tool_first, '</section>' ) ) ), 'the tool title stays a heading by role, with no <h2> inside the tool' );
check( strpos( $tool_first, 'class="jtool-answer"' ) < strpos( $tool_first, 'data-jtool-form' ), 'the answer box still comes before the form' );
check( false === strpos( $tool_first, 'jt-tool-answer-' ), 'no placeholder is left in the page' );

/* ---------- Every other article renders the original layout ---------- */
$normal_raw = "<p>פתיח קצר.</p>\r\n[justice_tool name=\"teunat-drachim\"]";
$normal     = render_article( 'articles', $normal_raw, false, $body );
$ntop       = above_body( $normal );
check( false === strpos( $normal, 'single-article--tool-first' ), 'an article that does not open with a tool gets no tool-first class' );
check( false !== strpos( $normal, '<figure class="single-article__image"' ), 'it keeps the featured image above the content' );
check( false !== strpos( $ntop, '<header class="single-article__header glass-panel" style="max-width: 900px; margin: 40px auto 3rem;' ), 'it keeps the original header panel' );
check( false !== strpos( $ntop, '<a class="single-article__term"' ) && false !== strpos( $ntop, '5 דקות קריאה' ) && false !== strpos( $ntop, '&#9878;' ), 'it keeps the term pill, the reading time and the byline mark' );
check( false !== strpos( answer_box( $normal ), '<h2 class="jt-restored-heading">חוק פיצויים לנפגעי תאונות דרכים</h2>' ), 'the heading-spine filter behaves as before on it' );

/* ---------- Maya Rotenberg's reviewed-by articles are never switched ---------- */
$maya = render_article( 'articles', $raw_live, true, $body );
$mtop = above_body( $maya );
check( false === strpos( $maya, 'single-article--tool-first' ) && false !== strpos( $maya, '<figure class="single-article__image"' ) && false !== strpos( $mtop, 'glass-panel' ), 'a Maya-reviewed article that opens with a tool keeps the original layout' );
check( false !== strpos( $mtop, 'נבדק מקצועית על ידי' ) && false !== strpos( $mtop, 'https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/' ), 'her reviewed-by byline is unchanged' );

/* ---------- The stylesheet: layout only, and only under the tool-first class ---------- */
$css = (string) file_get_contents( dirname( __DIR__ ) . '/assets/css/justice-tools.css' );
check( false !== strpos( $css, '.single-article--tool-first .single-article__layout--no-sidebar { grid-template-columns: minmax(0, 1fr); }' ), 'the article column takes the full row when there is no sidebar' );
check( false !== strpos( $css, '.single-article--tool-first .single-article__layout { padding-block-start: 0; }' ), 'the answer box starts right under the header' );
preg_match_all( '/^([^{}\n]*single-article[^{}\n]*)\{([^}]*)\}/m', $css, $rules, PREG_SET_ORDER );
check( 2 === count( $rules ), 'the tools stylesheet has exactly the two article rules' );
foreach ( $rules as $rule ) {
	check( 0 === strpos( trim( $rule[1] ), '.single-article--tool-first ' ), 'every article rule is scoped to the tool-first class: ' . trim( $rule[1] ) );
	check( ! preg_match( '/color|background|border|shadow|font|radius/i', $rule[2] ), 'no decorative property in: ' . trim( $rule[1] ) );
}

if ( $failures ) {
	fwrite( STDERR, "article tool-first layout: {$failures} failure(s)\n" );
	exit( 1 );
}
echo "article tool-first layout: all checks passed\n";
