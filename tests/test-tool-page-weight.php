<?php
/** Tool-page weight (HAD-588): which plugin scripts leave a co.il tool page, and which stay. */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

class WP_Post {
	public $ID = 1; public $post_type = 'page'; public $post_content = '';
	public function __construct( array $a ) { foreach ( $a as $k => $v ) { $this->$k = $v; } }
}
class JT_Dep { public $deps; public function __construct( array $deps ) { $this->deps = $deps; } }
class WP_Scripts { public $queue = array(); public $registered = array(); }
class WP_Styles { public $queue = array(); public $registered = array(); }

$jt_actions = array();
$jt_q = array();
$jt_post = null;
$jt_scripts = new WP_Scripts();
$jt_styles = new WP_Styles();
function add_action( $tag, $callback, $priority = 10, $args = 1 ): void { global $jt_actions; $jt_actions[ $tag ][] = array( $callback, $priority ); }
function jt_q( string $k ): bool { global $jt_q; return ! empty( $jt_q[ $k ] ); }
function is_admin(): bool { return jt_q( 'admin' ); }
function is_singular( $t = '' ): bool { return jt_q( 'singular' ); }
function is_front_page(): bool { return jt_q( 'front' ); }
function get_queried_object() { global $jt_post; return $jt_post; }
function wp_scripts(): WP_Scripts { global $jt_scripts; return $jt_scripts; }
function wp_styles(): WP_Styles { global $jt_styles; return $jt_styles; }
function wp_dequeue_script( $h ): void { global $jt_scripts; $jt_scripts->queue = array_values( array_diff( $jt_scripts->queue, array( $h ) ) ); }
function wp_dequeue_style( $h ): void { global $jt_styles; $jt_styles->queue = array_values( array_diff( $jt_styles->queue, array( $h ) ) ); }

require_once dirname( __DIR__ ) . '/inc/enqueue.php';
require_once dirname( __DIR__ ) . '/inc/tool-page-weight.php';

$checks = 0;
function check( bool $ok, string $message ): void { global $checks; if ( ! $ok ) { throw new RuntimeException( $message ); } $checks++; }

/** The live queue of a tool page on 22.10.2026 (script and style handles as printed). */
function reset_queue(): void {
	global $jt_scripts, $jt_styles;
	$jt_scripts = new WP_Scripts();
	$jt_styles = new WP_Styles();
	$jt_scripts->queue = array( 'jquery', 'search-filter-plugin-build', 'search-filter-plugin-chosen', 'jspdf', 'signature-pad', 'dwp-js',
		'pojo-a11y', 'jquery-ui-core', 'jquery-ui-datepicker', 'justice-navigation', 'justice-analytics-events', 'justice-tool-sachar-neto' );
	$jt_scripts->registered = array(
		'jquery-ui-datepicker'       => new JT_Dep( array( 'jquery-ui-core' ) ),
		'jquery-ui-core'             => new JT_Dep( array( 'jquery' ) ),
		'search-filter-plugin-build' => new JT_Dep( array( 'jquery' ) ),
		'search-filter-plugin-chosen' => new JT_Dep( array( 'jquery' ) ),
		'justice-tool-sachar-neto'   => new JT_Dep( array() ),
		'pojo-a11y'                  => new JT_Dep( array( 'jquery' ) ),
	);
	$jt_styles->queue = array( 'justice-main', 'justice-tools', 'search-filter-plugin-styles', 'chosen-css' );
}
function run( string $content, array $q = array( 'singular' => true ) ): array {
	global $jt_q, $jt_post, $jt_scripts, $jt_styles;
	$jt_q = $q;
	$jt_post = new WP_Post( array( 'post_content' => $content ) );
	reset_queue();
	justice_theme_dequeue_tool_page_bloat();
	justice_theme_dequeue_home_signature_scripts();
	return array( $jt_scripts->queue, $jt_styles->queue );
}
function gone( array $queue, array $handles ): bool { return array() === array_intersect( $queue, $handles ); }
function kept( array $queue, array $handles ): bool { return count( array_intersect( $queue, $handles ) ) === count( $handles ); }

$sig = array( 'jspdf', 'signature-pad', 'dwp-js' );
$dp = array( 'jquery-ui-datepicker', 'jquery-ui-core' );
$sf = array( 'search-filter-plugin-build', 'search-filter-plugin-chosen' );
$always = array( 'jquery', 'pojo-a11y', 'justice-navigation', 'justice-analytics-events', 'justice-tool-sachar-neto' );

// A plain tool page: all three groups leave, the theme, the tool bundle and jQuery stay.
[ $s, $st ] = run( "<p>מבוא</p>\n[justice_tool name=\"sachar-neto\"]\n<p>עוד</p>" );
check( gone( $s, $sig ), 'signature group leaves a tool page: ' . json_encode( $s ) );
check( gone( $s, $dp ), 'datepicker + jQuery UI core leave a tool page' );
check( gone( $s, $sf ), 'Search & Filter scripts leave a tool page' );
check( gone( $st, array( 'search-filter-plugin-styles', 'chosen-css' ) ), 'Search & Filter styles leave a tool page' );
check( kept( $s, $always ), 'theme scripts, jQuery and the tool bundle stay: ' . json_encode( $s ) );
check( kept( $st, array( 'justice-main', 'justice-tools' ) ), 'theme and tool styles stay' );

// Every tool shortcode marks a tool page.
foreach ( array( '[justice_tool_lead name="maanak-avoda"]', '[justice_tools_command]', '[justice_tool_section name="x"]', '[justice_tools_index]' ) as $sc ) {
	[ $s ] = run( '<p>א</p>' . $sc );
	check( gone( $s, $sig ) && gone( $s, $sf ), "tool page detected by $sc" );
}

// Pages without a tool are untouched (articles keep their own older rules in enqueue.php).
[ $s, $st ] = run( '<p>מאמר בלי כלי</p>' );
check( kept( $s, array_merge( $sig, $dp, $sf ) ) && kept( $st, array( 'search-filter-plugin-styles' ) ), 'a page without a tool keeps everything' );
[ $s ] = run( '[justice_tool name="sachar-neto"]', array( 'singular' => false ) );
check( kept( $s, array_merge( $sig, $dp, $sf ) ), 'archives are untouched' );
[ $s ] = run( '[justice_tool name="sachar-neto"]', array( 'singular' => true, 'admin' => true ) );
check( kept( $s, array_merge( $sig, $dp, $sf ) ), 'wp-admin is untouched' );
[ $s ] = run( '<p>[justice_toolbox]</p>' );
check( kept( $s, $sig ), 'a look-alike shortcode name is not a tool page' );

// A tool page keeps a group when its content names what the group serves.
[ $s ] = run( '[justice_tool name="sachar-neto"]<canvas id="signature"></canvas>' );
check( kept( $s, $sig ), 'a signature canvas keeps jsPDF + signature pad' );
check( gone( $s, $dp ) && gone( $s, $sf ), 'only the needed group stays' );
[ $s ] = run( "[justice_tool name=\"hodaa-mukdemet\"]\n[gravityform id=\"10\" title=\"false\"]" );
check( kept( $s, $dp ), 'a Gravity Form keeps the datepicker' );
check( gone( $s, $sig ), 'the Gravity Form page still drops the signature group' );
[ $s ] = run( "[justice_tool name=\"sachar-neto\"]
<!-- wp:gravityforms/form {\"formId\":\"10\"} /-->" );
check( kept( $s, $dp ), 'a Gravity Forms block keeps the datepicker' );
[ $s, $st ] = run( '[justice_tool name="sachar-neto"][searchandfilter id="5"]' );
check( kept( $s, $sf ) && kept( $st, array( 'search-filter-plugin-styles' ) ), 'a search form keeps Search & Filter' );

// jQuery UI core stays when another queued script depends on it.
$jt_q = array( 'singular' => true );
$jt_post = new WP_Post( array( 'post_content' => '[justice_tool name="sachar-neto"]' ) );
reset_queue();
$jt_scripts->queue[] = 'jquery-ui-slider';
$jt_scripts->registered['jquery-ui-slider'] = new JT_Dep( array( 'jquery-ui-core' ) );
justice_theme_dequeue_tool_page_bloat();
check( ! in_array( 'jquery-ui-datepicker', $jt_scripts->queue, true ) && in_array( 'jquery-ui-core', $jt_scripts->queue, true ), 'core stays for a dependent script' );

// Home page: the signature group leaves under the handles the plugin registers.
[ $s ] = run( '<p>בית</p>', array( 'front' => true, 'singular' => true ) );
check( gone( $s, $sig ), 'home page drops signature-pad and dwp-js: ' . json_encode( $s ) );
check( kept( $s, $dp ), 'home page datepicker rule is not changed here' );

// The hooks: enqueue time after the plugins (priority > 999) and again before each print.
$hooks = array();
foreach ( $jt_actions as $tag => $list ) { foreach ( $list as $item ) { if ( 'justice_theme_dequeue_tool_page_bloat' === $item[0] ) { $hooks[ $tag ] = $item[1]; } } }
check( isset( $hooks['wp_enqueue_scripts'] ) && $hooks['wp_enqueue_scripts'] > 999, 'runs after priority 999' );
foreach ( array( 'wp_print_scripts', 'wp_print_styles', 'wp_print_footer_scripts' ) as $tag ) {
	check( isset( $hooks[ $tag ] ), "runs again on $tag" );
}

// The tool bundles keep loading from assets/js/tools/dist/ (the Autoptimize exclusion), untouched here.
$src = (string) file_get_contents( dirname( __DIR__ ) . '/inc/tool-page-weight.php' );
check( false === strpos( $src, 'justice-tool-' . "'" ) && false === strpos( $src, 'tools/dist' . "'" ), 'this file never dequeues a tool bundle' );

echo "tool-page-weight: $checks checks passed\n";
