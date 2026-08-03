<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$jt_practice_taxonomy = true;
$jt_practice_feed     = false;

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function get_option( $key, $default = false ) {
	return 'justice_ops_content_first_rollout_scope' === $key ? array( 'mode' => 'all', 'paths' => array() ) : $default;
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
function wp_strip_all_tags( $value ): string {
	return strip_tags( (string) $value );
}
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) );
}
function is_tax( $taxonomy = '' ): bool {
	global $jt_practice_taxonomy;
	return $jt_practice_taxonomy && 'practice-areas' === $taxonomy;
}
function is_singular( $type = null ): bool {
	return false;
}
function is_admin(): bool {
	return false;
}
function is_feed(): bool {
	global $jt_practice_feed;
	return $jt_practice_feed;
}
function is_preview(): bool {
	return false;
}
function is_embed(): bool {
	return false;
}
function wp_is_json_request(): bool {
	return false;
}
function wp_doing_ajax(): bool {
	return false;
}
function get_post_type( $post_id = 0 ): string {
	return 'justice_lawyer';
}
function get_post_meta( $post_id, $key, $single = false ) {
	$meta = array(
		21 => array( 'subscription_status' => 'active', 'plan_type' => 'premium' ),
		22 => array( 'subscription_status' => 'inactive', 'plan_type' => 'listing' ),
		23 => array( 'subscription_status' => 'inactive', 'plan_type' => 'listing' ),
		24 => array( 'subscription_status' => 'active', 'plan_type' => 'featured' ),
	);
	return $meta[ (int) $post_id ][ $key ] ?? '';
}
function justice_theme_lawyer_profile_is_public_approved( $post_id ): bool {
	return in_array( (int) $post_id, array( 21, 22, 23, 24 ), true );
}
function justice_cards_has_public_sponsored_placement( int $post_id ): bool {
	return in_array( $post_id, array( 21, 24 ), true );
}
function url_to_postid( $url ): int {
	if ( 1 === preg_match( '#/lawyers/(\d+)/#', (string) $url, $match ) ) {
		return (int) $match[1];
	}
	return 0;
}

require_once dirname( __DIR__ ) . '/justice-ops/content-first-order.php';

function jt_practice_order_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

function jt_practice_card( int $id, string $name, string $status = '' ): string {
	$badge = '' !== $status ? '<span class="lawyer-card__status lawyer-card__status--sponsored">' . $status . '</span>' : '';
	return '<article class="lawyer-card premium-card"><a class="lawyer-card__media" href="https://example.test/lawyers/' . $id . '/">' . $name . '</a>'
		. '<div class="lawyer-card__body">' . $badge . '<p>' . $name . ' profile</p></div></article>';
}

$source = '<!doctype html><html><body>'
	. '<section class="practice-hub-hero"><h1>דיני משפחה</h1></section>'
	. '<section class="practice-hub-lawyers section" id="practice-lawyers"><div class="container"><div class="lawyers-grid">'
	. jt_practice_card( 21, 'Maya paid', 'כרטיס רשום' )
	. jt_practice_card( 22, 'Organic lawyer' )
	. jt_practice_card( 23, 'Reserved lawyer', 'כרטיס רשום' )
	. jt_practice_card( 24, 'Paid without disclosure' )
	. '</div></div></section>'
	. '<section class="jt-midfold"><div class="jt-registered-band">Registered provider band</div>'
	. '<section class="jtcm-wrap"><div id="practice-map">Organic practice map</div></section></section>'
	. '<section class="practice-hub-fulldesc"><h2>Full editorial guide</h2><p>Deep legal answer.</p></section>'
	. '<section class="practice-hub-content section" id="practice-guides"><h2>Editorial guide index</h2><p>Guide end.</p></section>'
	. '<section class="practice-hub-tools"><h2>Legal tools</h2><p>Tools end.</p></section>'
	. '<section class="practice-hub-related"><h2>Related guides</h2><p>Related end.</p></section>'
	. '<script>const fake = "<section class=\"practice-hub-lawyers\">ignore</section>";</script>'
	. '</body></html>';

$ordered = justice_ops_practice_taxonomy_reorder_html( $source );
$guide_end = strpos( $ordered, 'Guide end.' );
$terminal_end = strpos( $ordered, 'Related end.' );

jt_practice_order_assert( 1 === substr_count( $ordered, 'data-jt-practice-taxonomy-content-first=' ), 'Practice taxonomy tail marker is missing or duplicated.' );
jt_practice_order_assert( strpos( $ordered, 'Maya paid' ) < strpos( $ordered, 'Full editorial guide' ), 'The active-paid disclosed card did not remain high.' );
jt_practice_order_assert( false !== strpos( $ordered, '>מקודם</span>' ), 'The active-paid theme label was not normalized to מקודם.' );
jt_practice_order_assert( false === strpos( substr( $ordered, 0, $guide_end ), 'Organic lawyer' ), 'An organic lawyer remained above the guide.' );
jt_practice_order_assert( $guide_end < $terminal_end, 'Tools and related guides are not after the guide index.' );
jt_practice_order_assert( $terminal_end < strpos( $ordered, 'Organic lawyer' ), 'The organic lawyer was not moved below tools and related guides.' );
jt_practice_order_assert( $terminal_end < strpos( $ordered, 'Reserved lawyer' ), 'A reserved, non-paid lawyer remained above tools and related guides.' );
jt_practice_order_assert( $terminal_end < strpos( $ordered, 'Paid without disclosure' ), 'A paid card without a visible disclosure remained high.' );
jt_practice_order_assert( $terminal_end < strpos( $ordered, 'Registered provider band' ), 'The registered band remained above tools and related guides.' );
jt_practice_order_assert( $terminal_end < strpos( $ordered, 'Organic practice map' ), 'The practice map remained above tools and related guides.' );
jt_practice_order_assert( 1 === substr_count( $ordered, 'id="practice-lawyers"' ), 'The practice-lawyers anchor was lost or duplicated.' );
foreach ( array( 'Maya paid', 'Organic lawyer', 'Reserved lawyer', 'Paid without disclosure', 'Registered provider band', 'Organic practice map' ) as $label ) {
	jt_practice_order_assert( 2 === substr_count( $ordered, $label ) || in_array( $label, array( 'Registered provider band', 'Organic practice map' ), true ) && 1 === substr_count( $ordered, $label ), 'A provider node was lost or duplicated: ' . $label );
}
jt_practice_order_assert( false !== strpos( $ordered, '<script>const fake' ), 'Protected script content changed.' );
jt_practice_order_assert( $ordered === justice_ops_practice_taxonomy_reorder_html( $ordered ), 'Practice taxonomy ordering is not idempotent.' );

jt_practice_order_assert( justice_ops_practice_taxonomy_should_buffer(), 'A public practice taxonomy response was not eligible for buffering.' );
$jt_practice_taxonomy = false;
jt_practice_order_assert( ! justice_ops_practice_taxonomy_should_buffer(), 'A directory/profile/non-taxonomy response was eligible for buffering.' );
$jt_practice_taxonomy = true;
$jt_practice_feed = true;
jt_practice_order_assert( ! justice_ops_practice_taxonomy_should_buffer(), 'A feed response was eligible for buffering.' );
$jt_practice_feed = false;

$malformed = '<section class="practice-hub-lawyers"><article class="lawyer-card">Broken</section>'
	. '<section class="practice-hub-content">Guide</section>';
jt_practice_order_assert( $malformed === justice_ops_practice_taxonomy_reorder_html( $malformed ), 'Malformed taxonomy card DOM did not fail closed.' );

echo "practice taxonomy content-first tests passed\n";
