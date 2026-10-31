<?php
/** Page-local document preparation tools; reviewed Claude Design output, HAD-581. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Closed map: shortcode input can never address an arbitrary file. */
function justice_ops_property_tool_kinds(): array {
	return array( 'warning-note', 'delayed-handover' );
}

function justice_ops_property_tool_assets( string $kind ): void {
	if ( ! in_array( $kind, justice_ops_property_tool_kinds(), true ) ) { return; }
	$base = plugins_url( 'assets/property-tools/', __FILE__ );
	wp_enqueue_style( 'jt-property-' . $kind, $base . $kind . '.css', array(), JUSTICE_OPS_VERSION );
	wp_enqueue_script( 'jt-property-' . $kind, $base . $kind . '.js', array(), JUSTICE_OPS_VERSION, true );
}

/** Load only on a singular article with the explicit editorial shortcode. */
add_action( 'wp_enqueue_scripts', function () {
	if ( ! is_singular() ) { return; }
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post || ! has_shortcode( $post->post_content, 'justice_property_tool' ) ) { return; }
	foreach ( justice_ops_property_tool_kinds() as $kind ) {
		if ( preg_match( '/\[justice_property_tool\s+kind=["\']' . preg_quote( $kind, '/' ) . '["\']\s*\]/', $post->post_content ) ) {
			justice_ops_property_tool_assets( $kind );
		}
	}
}, 20 );

add_shortcode( 'justice_property_tool', function ( $atts ) {
	$atts = shortcode_atts( array( 'kind' => '' ), $atts, 'justice_property_tool' );
	$kind = (string) $atts['kind'];
	if ( ! in_array( $kind, justice_ops_property_tool_kinds(), true ) ) { return ''; }
	$file = __DIR__ . '/assets/property-tools/' . $kind . '.html';
	if ( ! is_readable( $file ) ) { return '<p>כלי הכנת המסמכים אינו זמין כרגע. אפשר להשתמש ברשימת המסמכים שבמאמר.</p>'; }
	justice_ops_property_tool_assets( $kind );
	// Trusted bundled markup only; no user text, server submission, or persistence.
	return (string) file_get_contents( $file );
} );
