<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$GLOBALS['jt_test_filters'] = array();
$GLOBALS['jt_test_options'] = array();

function add_action( ...$args ): void {}
function add_filter( ...$args ): void {
	$GLOBALS['jt_test_filters'][] = $args;
}
function apply_filters( $tag, $value ) {
	return $value;
}
function get_option( $key, $default = false ) {
	return $GLOBALS['jt_test_options'][ $key ] ?? $default;
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}
function wp_json_encode( $value, $flags = 0 ) {
	return json_encode( $value, $flags );
}

require_once dirname( __DIR__ ) . '/justice-ops/real-estate-content-release.php';

function jt_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$contracts = justice_ops_real_estate_release_contracts();
jt_assert( 4 === count( $contracts ), 'The bridge must stay limited to four URLs.' );
jt_assert( isset( $contracts['/real-estate-attorney/'] ), 'Generic owner is missing.' );
jt_assert( isset( $contracts['/real-estate-lawyer-guide/'] ), 'Guide owner is missing.' );
jt_assert( isset( $contracts['/lawyer-for-buying-or-selling-a-house/'] ), 'Transaction owner is missing.' );
jt_assert( isset( $contracts['/real-estate-lawyer-cost-2025/'] ), 'Fee owner is missing.' );

$_SERVER['REQUEST_URI'] = '/real-estate-lawyer-guide/?acceptance=1';
jt_assert(
	'מה עושה עורך דין מקרקעין: תפקיד, בדיקות ושלבים | Jus-Tice' === justice_ops_real_estate_release_title( 'old' ),
	'Guide title contract failed.'
);

$schema = array(
	'@context' => 'https://schema.org',
	'@graph'   => array(
		array( '@type' => 'WebPage', '@id' => 'https://jus-tice.co.il/real-estate-lawyer-guide/#page' ),
		array( '@type' => 'Person', 'name' => 'Unproved reviewer' ),
		array( '@type' => 'LegalService', 'name' => 'Unproved provider' ),
	),
);
$html   = '<!doctype html><html><head><script type="application/ld+json">' . json_encode( $schema ) . '</script></head>'
	. '<body><section class="legal-pillar-hero"><h1>Old generic H1</h1><p>Old summary</p></section>'
	. '<div class="single-article__author">Unproved reviewer</div></body></html>';
$output = justice_ops_real_estate_release_filter_html( $html );

jt_assert( false !== strpos( $output, 'data-jt-real-estate-release="2026-08-02-r1"' ), 'Release marker missing.' );
jt_assert( false !== strpos( $output, '<h1>מה עושה עורך דין מקרקעין בעסקה</h1>' ), 'H1 was not replaced.' );
jt_assert( false === strpos( $output, 'Old summary' ), 'Pillar summary was not replaced.' );
jt_assert( false === strpos( $output, 'Unproved reviewer' ), 'Identity claim remained.' );
jt_assert( false === strpos( $output, 'LegalService' ), 'LegalService schema remained.' );
jt_assert( false === strpos( $output, 'Person' ), 'Person schema remained.' );
jt_assert( false !== strpos( $output, 'WebPage' ), 'Safe WebPage schema was removed.' );

$_SERVER['REQUEST_URI'] = '/unrelated-page/';
jt_assert( $html === justice_ops_real_estate_release_filter_html( $html ), 'Unrelated page was modified.' );

echo "real-estate content release tests passed\n";
