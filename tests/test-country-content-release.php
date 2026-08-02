<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

function add_action( ...$args ): void {}
function add_filter( ...$args ): void {}
function get_option( $key, $default = false ) {
	return $default;
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
function wp_json_encode( $value, $flags = 0 ) {
	return json_encode( $value, $flags );
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}

require_once dirname( __DIR__ ) . '/justice-ops/real-estate-content-release.php';
require_once dirname( __DIR__ ) . '/justice-ops/country-content-release.php';

function jt_country_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$paths = justice_ops_country_schema_release_paths();
jt_country_assert( 10 === count( $paths ), 'The country schema bridge must stay limited to ten paths.' );
jt_country_assert( in_array( '/usa-lawyers/', $paths, true ), 'USA owner path is missing.' );
jt_country_assert( in_array( '/practice-areas/portugal/', $paths, true ), 'Portugal taxonomy path is missing.' );

$schema = array(
	'@context' => 'https://schema.org',
	'@graph'   => array(
		array( '@type' => 'WebPage', '@id' => 'https://jus-tice.co.il/usa-lawyers/#webpage' ),
		array( '@type' => 'Article', '@id' => 'https://jus-tice.co.il/usa-lawyers/#article' ),
		array( '@type' => 'BreadcrumbList', '@id' => 'https://jus-tice.co.il/usa-lawyers/#breadcrumb' ),
		array( '@type' => 'LegalService', 'name' => 'Unproved service' ),
		array( '@type' => 'Person', 'name' => 'Unproved reviewer' ),
		array( '@type' => 'AggregateRating', 'ratingValue' => '5' ),
	),
);
$html   = '<!doctype html><html><head><script type="application/ld+json">' . json_encode( $schema ) . '</script></head><body><main>Guide</main></body></html>';

$_SERVER['REQUEST_URI'] = '/usa-lawyers/?acceptance=1';
$output = justice_ops_country_schema_release_filter_html( $html );
jt_country_assert( false !== strpos( $output, 'data-jt-country-schema-release="2026-08-02-r1"' ), 'Release marker missing.' );
jt_country_assert( false === strpos( $output, 'LegalService' ), 'LegalService schema remained.' );
jt_country_assert( false === strpos( $output, 'Person' ), 'Person schema remained.' );
jt_country_assert( false === strpos( $output, 'AggregateRating' ), 'AggregateRating schema remained.' );
jt_country_assert( false !== strpos( $output, 'WebPage' ), 'WebPage schema was removed.' );
jt_country_assert( false !== strpos( $output, 'Article' ), 'Article schema was removed.' );
jt_country_assert( false !== strpos( $output, 'BreadcrumbList' ), 'Breadcrumb schema was removed.' );

$_SERVER['REQUEST_URI'] = '/practice-areas/portugal/?acceptance=1';
jt_country_assert( $html !== justice_ops_country_schema_release_filter_html( $html ), 'Portugal taxonomy path was not governed.' );

$_SERVER['REQUEST_URI'] = '/unrelated-page/';
jt_country_assert( $html === justice_ops_country_schema_release_filter_html( $html ), 'Unrelated page was modified.' );

echo "country content release tests passed\n";
