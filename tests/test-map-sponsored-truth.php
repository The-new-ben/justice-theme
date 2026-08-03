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

echo "map sponsored-truth tests passed\n";
