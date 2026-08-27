<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

function add_shortcode( ...$args ): void {}
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) ?? '' );
}
function wp_unslash( $value ) { return $value; }
function esc_url( $value ): string { return (string) $value; }
function home_url( $path = '' ): string { return 'https://jus-tice.co.il' . $path; }
function add_query_arg( array $args, string $url ): string {
	return $url . '?' . http_build_query( $args, '', '&', PHP_QUERY_RFC3986 );
}

require_once dirname( __DIR__ ) . '/inc/product-handoff-attribution.php';
require_once dirname( __DIR__ ) . '/inc/simulation-handoff.php';

function jt_handoff_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$criminal = justice_theme_courtai_product_url( 'criminal-law', true );
jt_handoff_assert( false !== strpos( $criminal, '#/intake?' ), 'Handoff does not start at Matter intake.' );
jt_handoff_assert( false !== strpos( $criminal, 'cluster=criminal-law' ), 'Known cluster was not retained.' );
jt_handoff_assert( false !== strpos( $criminal, 'owner=%2Fcriminal-defense-attorney%2F' ), 'Canonical GSC owner is missing.' );
jt_handoff_assert( false !== strpos( $criminal, 'source=organic' ), 'Organic acquisition channel is missing.' );
jt_handoff_assert( false !== strpos( $criminal, 'embed=1' ), 'Embed rendering flag is missing.' );

$unknown = justice_theme_courtai_product_url( 'client-0500000000', false );
jt_handoff_assert( false === strpos( $unknown, 'client-0500000000' ), 'Unknown request content leaked into the product URL.' );
jt_handoff_assert( false === strpos( $unknown, 'owner=' ), 'Unknown cluster received an owner path.' );
jt_handoff_assert( false !== strpos( $unknown, 'jurisdiction=IL' ), 'Safe generic handoff lost jurisdiction.' );

$owners = justice_theme_simulation_cluster_owners();
jt_handoff_assert( 11 === count( $owners ), 'The reconciled GSC architecture no longer has exactly 11 owners.' );
jt_handoff_assert( 11 === count( array_unique( array_values( $owners ) ) ), 'Two clusters share an owner path.' );

$family_bridge = justice_theme_simulation_handoff_url( 'family-law' );
jt_handoff_assert( false !== strpos( $family_bridge, 'cluster=family-law' ), 'Practice area did not map to a product cluster.' );
jt_handoff_assert( false !== strpos( $family_bridge, 'owner=%2Fdivorce-lawyer%2F' ), 'Practice area lost its canonical owner.' );

$commercial_journeys = array(
	'family-law'            => array( 'family-law', '/divorce-lawyer/' ),
	'criminal-law'          => array( 'criminal-law', '/criminal-defense-attorney/' ),
	'real-estate-law'       => array( 'real-estate', '/articles/real-estate-attorney/' ),
	'medical-malpractice'   => array( 'medical-malpractice', '/medical-malpractice-lawyer/' ),
);
foreach ( $commercial_journeys as $area => $expected ) {
	$context = justice_theme_simulation_handoff_context( $area );
	jt_handoff_assert( is_array( $context ), 'Commercial area did not resolve: ' . $area );
	jt_handoff_assert( $expected[0] === $context['cluster'], 'Commercial area received the wrong cluster: ' . $area );
	jt_handoff_assert( $expected[1] === $context['owner'], 'Commercial area received the wrong owner: ' . $area );
	$url = justice_theme_simulation_handoff_url( $area );
	jt_handoff_assert( false !== strpos( $url, 'cluster=' . rawurlencode( $expected[0] ) ), 'Commercial bridge lost its cluster: ' . $area );
	jt_handoff_assert( false !== strpos( $url, 'owner=' . rawurlencode( $expected[1] ) ), 'Commercial bridge lost its owner: ' . $area );
}

$unknown_bridge = justice_theme_simulation_handoff_url( 'unknown-area-0500000000' );
jt_handoff_assert( false === strpos( $unknown_bridge, '0500000000' ), 'Unknown area leaked into the local bridge URL.' );

echo "simulation handoff tests passed\n";
