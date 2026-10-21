<?php
declare(strict_types=1);
define( 'ABSPATH', __DIR__ );
define( 'OBJECT', 'OBJECT' );
class WP_Post {
	public string $post_status = 'publish';
	public function __construct( public int $ID ) {}
}
class WP_Term { public int $count = 1; public string $name = 'משפט פלילי'; }
function add_action( ...$args ) {}
function add_filter( ...$args ) {}
function __( $text, $domain = '' ) { return $text; }
function esc_html( $text ) { return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $text ) { return esc_html( $text ); }
function esc_url( $text ) { return esc_html( $text ); }
function esc_html_e( $text, $domain = '' ) { echo esc_html( $text ); }
function esc_html__( $text, $domain = '' ) { return esc_html( $text ); }
function esc_attr_e( $text, $domain = '' ) { echo esc_attr( $text ); }
function sanitize_key( $text ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $text ) ); }
function wp_unslash( $text ) { return $text; }
function wp_kses_post( $html ) { return $html; }
function is_wp_error( $thing ) { return false; }
function post_type_exists( $type ) { return true; }
function get_post_field( $field, $id ) { return 1 === $id ? 'criminal-defense-attorney' : 'divorce-lawyer'; }
function get_page_by_path( $slug, $output, $type ) {
	return 'page' === $type ? new WP_Post( 'criminal-defense-attorney' === $slug ? 1 : 2 ) : null;
}
function get_post_status( $post ) { return $post->post_status; }
function get_permalink( $id ) { return 1 === $id ? 'https://jus-tice.co.il/criminal-defense-attorney/' : 'https://jus-tice.co.il/example-guide/'; }
function get_the_title( $id ) { return 'מדריך ' . $id; }
function get_post_type_archive_link( $type ) { return 'https://jus-tice.co.il/lawyers/'; }
function home_url( $path = '' ) { return 'https://jus-tice.co.il' . $path; }
function add_query_arg( $key, $value, $url ) { return $url . '?' . $key . '=' . $value; }
function get_term_by( ...$args ) { return new WP_Term(); }
function get_term_link( $term ) { return 'https://jus-tice.co.il/practice-areas/criminal-law/'; }
$contactable = array();
$directory_calls = array();
function justice_theme_get_practice_firms( ...$args ) {
	$GLOBALS['directory_calls'][] = $args;
	return $GLOBALS['contactable'];
}
require dirname( __DIR__ ) . '/inc/lead-spam-guard.php';
require dirname( __DIR__ ) . '/inc/content-clusters.php';
function verify( $condition, $label ) {
	if ( ! $condition ) { throw new RuntimeException( $label ); }
	echo "PASS: $label\n";
}
$_GET = array();
verify( 'criminal-law' === justice_theme_current_lead_prefill_area( 'criminal-law' ), 'Clean criminal URL receives its explicit page context' );
verify( '' === justice_theme_current_lead_prefill_area(), 'Unrelated forms retain their blank default' );
verify( '' === justice_theme_current_lead_prefill_area( 'invented-area' ), 'Invalid context cannot create a new legal area' );
$_GET['lead_area'] = 'family-law';
verify( 'family-law' === justice_theme_current_lead_prefill_area( 'criminal-law' ), 'An explicit valid request remains editable and takes precedence' );
$_GET['lead_area'] = 'invalid';
verify( 'criminal-law' === justice_theme_current_lead_prefill_area( 'criminal-law' ), 'Invalid request falls back to the verified page context' );
$_GET['lead_area'] = array( 'criminal-law' );
verify( 'criminal-law' === justice_theme_current_lead_prefill_area( 'criminal-law' ), 'Malformed query cannot cause array conversion or override context' );
$_GET = array();
$html = justice_theme_render_cluster_hub_links( 1 );
verify( ! str_contains( $html, '/lawyers/?area=criminal-law' ), 'Empty criminal directory is not advertised in cluster navigation' );
verify( str_contains( $html, 'href="#practice-lead-form"' ), 'Cluster navigation retains a working local enquiry route' );
verify( str_contains( $html, '/practice-areas/criminal-law/' ), 'The article archive link survives' );
verify( str_contains( $html, 'cluster-hub__list' ), 'The spoke link list survives' );
verify( array( 'criminal-law', 1, false, true ) === $directory_calls[0], 'Cluster uses the contactable directory eligibility contract' );
$contactable = array( new WP_Post( 90 ) );
$html = justice_theme_render_cluster_hub_links( 1 );
verify( str_contains( $html, '/lawyers/?area=criminal-law' ), 'Directory link returns when eligible profiles become available' );
verify( ! str_contains( $html, 'href="#practice-lead-form"' ), 'Contact fallback is not duplicated when directory is available' );
$contactable = array();
$directory_calls = array();
$html = justice_theme_render_cluster_hub_links( 2 );
verify( str_contains( $html, '/lawyers/?area=family-law' ), 'Family directory navigation is unchanged' );
verify( array() === $directory_calls, 'No new eligibility lookup affects protected family surfaces' );
$template = file_get_contents( dirname( __DIR__ ) . '/template-parts/content/practice-landing-page.php' );
$form = file_get_contents( dirname( __DIR__ ) . '/template-parts/forms/lead-form.php' );
verify( str_contains( $template, "'lead_area' => 'criminal-law' === \$term_slug ? 'criminal-law' : ''" ), 'Only the criminal landing opts into page prefill' );
verify( str_contains( $form, "justice_theme_current_lead_prefill_area( (string) ( \$args['lead_area'] ?? '' ) )" ), 'The form passes its template context to the resolver' );
verify( str_contains( $form, '<select id="lead-area" name="lead_area" required>' ), 'The area remains a normal editable select' );
$css = file_get_contents( dirname( __DIR__ ) . '/assets/css/premium-pass-3.css' );
verify( str_contains( $template, "'criminal-law' === \$term_slug ? ' legal-pillar-sidebar--flow' : ''" ), 'Only the criminal form opts out of the oversized sticky sidebar' );
verify( 1 === preg_match( '/\.legal-pillar-sidebar--flow\s*\{[^}]*position:\s*static;[^}]*\}/', $css ), 'The full criminal form scrolls in normal document flow' );
verify( 1 === preg_match( '/\.legal-pillar-sidebar--flow\s*\{[^}]*scroll-margin-top:\s*[^;]+;[^}]*\}/', $css ), 'The enquiry anchor has clearance beneath the fixed header' );
echo "Criminal intake followthrough fixtures passed.\n";
