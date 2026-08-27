<?php
declare(strict_types=1);

function jt_map_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$plugin_dir = dirname( __DIR__ ) . '/justice-ops';
$feed       = (string) file_get_contents( $plugin_dir . '/map-feed-v3.php' );
$script     = (string) file_get_contents( $plugin_dir . '/assets/cinema-map.js' );
$styles     = (string) file_get_contents( $plugin_dir . '/map-cinema.php' );
$city_routes = (string) file_get_contents( $plugin_dir . '/city-practice.php' );

jt_map_assert( false !== strpos( $feed, "get_transient( 'justice_map_geojson_v1' )" ), 'Map feed no longer reads the established cache key.' );
jt_map_assert( false !== strpos( $feed, "set_transient( 'justice_map_geojson_v1'" ), 'Map feed no longer overwrites the established cache key.' );
jt_map_assert( false === strpos( $feed, "get_transient( 'justice_map_geojson_v2' )" ), 'Map feed can still serve the abandoned v2 key.' );
jt_map_assert( false !== strpos( $feed, '! empty( $cached[\'jt_v4\'] )' ), 'Old jt_v3 payloads are not rejected.' );
jt_map_assert( false !== strpos( $feed, 'justice_ops_content_first_profile_is_active_paid( $lawyer_id )' ), 'Map paid state bypasses the canonical gate.' );

foreach ( array( 'lawyer-index-import.php', 'map-places.php', 'content-first-order.php' ) as $invalidator ) {
	$source = (string) file_get_contents( $plugin_dir . '/' . $invalidator );
	jt_map_assert( false !== strpos( $source, 'justice_ops_purge_map_feed_cache()' ), $invalidator . ' does not call the shared map invalidator.' );
}

jt_map_assert( 3 === substr_count( $script, 'data-jt-sponsored-disclosure="active-paid">מקודם</span>' ), 'Map flag, paid popup and nearby paid card do not use the exact disclosure.' );
jt_map_assert( false !== strpos( $script, "if (p.paid)" ), 'Paid popup disclosure is not gated by the feed truth.' );
jt_map_assert( false !== strpos( $script, 'class="jtcm-pop__sponsored"' ), 'Paid lawyer popup lacks its own visible disclosure.' );
jt_map_assert( false !== strpos( $styles, '.jtcm-pop__sponsored{' ), 'Paid popup disclosure has no visible style.' );
jt_map_assert( false !== strpos( $styles, 'function justice_cinema_requested_family()' ), 'Map finder no longer resolves the requested directory area.' );
jt_map_assert( false !== strpos( $styles, "'medical-malpractice-law' => 'medical-malpractice'" ), 'Medical-malpractice directory context is not preserved by the map finder.' );
jt_map_assert( false !== strpos( $styles, 'selected( $family, $active_family, false )' ), 'Map finder does not visibly retain the requested area.' );
jt_map_assert( false !== strpos( $styles, 'home_url( $active_conf[\'hub\'] )' ), 'Map finder fallback link still ignores the requested area.' );
jt_map_assert( false !== strpos( $city_routes, "'medical-malpractice' => array" ), 'Medical malpractice is absent from the professional finder options.' );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__ ) . '/' );
}
function add_filter(): void {}
function add_action(): void {}
function sanitize_key( $value ): string { return strtolower( preg_replace( '/[^a-z0-9_-]/', '', (string) $value ) ); }
function wp_unslash( $value ) { return $value; }
function home_url( string $path = '' ): string { return 'https://jus-tice.co.il' . $path; }
function esc_attr( $value ): string { return htmlspecialchars( (string) $value, ENT_QUOTES ); }
function esc_html( $value ): string { return htmlspecialchars( (string) $value, ENT_QUOTES ); }
function esc_url( $value ): string { return (string) $value; }
function selected( $value, $current, bool $echo = true ): string {
	$result = (string) $value === (string) $current ? ' selected="selected"' : '';
	if ( $echo ) {
		echo $result;
	}
	return $result;
}
function justice_city_family_labels(): array {
	return array(
		'family'              => array( 'he' => 'משפחה', 'slug' => 'family-lawyer', 'hub' => '/family-law/' ),
		'criminal-law'        => array( 'he' => 'פלילי', 'slug' => 'criminal-lawyer', 'hub' => '/criminal-law/' ),
		'real-estate'         => array( 'he' => 'מקרקעין', 'slug' => 'real-estate-lawyer', 'hub' => '/real-estate/' ),
		'medical-malpractice' => array( 'he' => 'רשלנות רפואית', 'slug' => 'medical-malpractice-lawyer-city', 'hub' => '/medical-malpractice-lawyer/' ),
	);
}

require_once $plugin_dir . '/map-cinema.php';

foreach (
	array(
		'family-law'              => array( 'family', '/family-law/' ),
		'criminal-law'            => array( 'criminal-law', '/criminal-law/' ),
		'real-estate-law'         => array( 'real-estate', '/real-estate/' ),
		'medical-malpractice-law' => array( 'medical-malpractice', '/medical-malpractice-lawyer/' ),
	) as $requested_area => $expected
) {
	$_GET['area'] = $requested_area;
	$html         = justice_cinema_finder();
	$expected_url = home_url( $expected[1] );

	jt_map_assert( $expected[0] === justice_cinema_requested_family(), $requested_area . ' resolved to the wrong finder family.' );
	jt_map_assert( false !== strpos( $html, 'value="' . $expected_url . '" selected="selected"' ), $requested_area . ' is not visibly selected.' );
	jt_map_assert( false !== strpos( $html, 'href="' . $expected_url . '"' ), $requested_area . ' fallback destination is wrong.' );
}
unset( $_GET['area'] );

echo "map sponsored-truth tests passed\n";
