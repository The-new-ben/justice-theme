<?php
/**
 * /lawyer-registration/ self canonical (structure audit batch 14a, 15.10.2026).
 *
 * The bridge strips the theme's noindex tag from this page's HTML, so the page is
 * indexable; declaring that state in Yoast's robots array (after the theme's 99998
 * filter) lets Yoast print its canonical, the clean page URL, on every
 * ?claim_profile_id= variant. Other pages and non-array values are untouched.
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'JUSTICE_OPS_VERSION', '2.37.47' );

$jt_filters = array();
$jt_is_page = '';

function add_action( ...$args ): void {}
function add_filter( $tag, $callback, $priority = 10, $args = 1 ): void {
	global $jt_filters;
	$jt_filters[ $tag ][ $priority ][] = $callback;
}
function plugins_url( $path = '', $plugin = '' ): string {
	return 'https://jus-tice.co.il/wp-content/plugins/justice-ops/' . $path;
}
function wp_enqueue_style( ...$args ): void {}
function wp_enqueue_script( ...$args ): void {}
function is_page( $page = '' ): bool {
	global $jt_is_page;
	return '' !== $jt_is_page && ( '' === $page || $page === $jt_is_page );
}

require_once dirname( __DIR__ ) . '/justice-ops/new-look-bridge.php';

function jt_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

jt_assert( isset( $jt_filters['wpseo_robots_array'][99999] ) && in_array( 'justice_ops_registration_robots_array', $jt_filters['wpseo_robots_array'][99999], true ), 'The registration robots filter runs after the theme noindex filter (99998).' );

$theme_noindex = array( 'index' => 'noindex', 'follow' => 'follow', 'max-snippet' => 'max-snippet:-1' );

$jt_is_page = 'lawyer-registration';
$robots     = justice_ops_registration_robots_array( $theme_noindex );
jt_assert( 'index' === $robots['index'] && 'follow' === $robots['follow'], 'The registration page declares index, follow in Yoast, so Yoast prints its canonical.' );
jt_assert( 'max-snippet:-1' === $robots['max-snippet'], 'Other directives are preserved.' );

$jt_is_page = 'lawyer-plans';
jt_assert( $theme_noindex === justice_ops_registration_robots_array( $theme_noindex ), 'Any other page keeps its Yoast robots array.' );

$jt_is_page = '';
jt_assert( $theme_noindex === justice_ops_registration_robots_array( $theme_noindex ), 'A non-page view keeps its Yoast robots array.' );

$jt_is_page = 'lawyer-registration';
jt_assert( 'noindex' === justice_ops_registration_robots_array( 'noindex' ), 'A non-array value is passed through untouched.' );

// The bridge keeps stripping the theme's noindex tag from the HTML (the state the page has shipped in).
$source = file_get_contents( __DIR__ . '/../justice-ops/new-look-bridge.php' );
jt_assert( false !== strpos( $source, "noindex[^\"\\']*[\"\\']\\s*/?>#i', '', \$html )" ), 'The HTML noindex strip for the lawyer pages is still in place.' );
jt_assert( false === strpos( $source, 'wp_redirect' ) && false === strpos( $source, 'wp_safe_redirect' ), 'No redirect in the bridge.' );

echo "registration canonical tests passed\n";
