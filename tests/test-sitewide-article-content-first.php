<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$jt_article_type     = 'articles';
$jt_article_object   = 501;
$jt_article_feed     = false;
$jt_article_preview  = false;
$jt_article_json     = false;

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
function is_singular( $type = null ): bool {
	global $jt_article_type;
	return null === $type ? '' !== $jt_article_type : $jt_article_type === $type;
}
function in_the_loop(): bool {
	return true;
}
function is_main_query(): bool {
	return true;
}
function is_feed(): bool {
	global $jt_article_feed;
	return $jt_article_feed;
}
function is_preview(): bool {
	global $jt_article_preview;
	return $jt_article_preview;
}
function wp_is_json_request(): bool {
	global $jt_article_json;
	return $jt_article_json;
}
function is_embed(): bool {
	return false;
}
function is_admin(): bool {
	return false;
}
function is_tax( $taxonomy = '' ): bool {
	return false;
}
function get_post_type( $post_id = 0 ): string {
	return in_array( (int) $post_id, array( 11, 12, 13 ), true ) ? 'justice_lawyer' : 'articles';
}
function get_queried_object_id(): int {
	global $jt_article_object;
	return $jt_article_object;
}
function get_post_meta( $post_id, $key, $single = false ) {
	$meta = array(
		11  => array( 'subscription_status' => 'active', 'plan_type' => 'featured' ),
		12  => array( 'subscription_status' => 'inactive', 'plan_type' => 'listing' ),
		13  => array( 'subscription_status' => 'active', 'plan_type' => 'premium' ),
		501 => array( 'connected_lawyer_slug' => 'connected-lawyer' ),
	);
	return $meta[ (int) $post_id ][ $key ] ?? '';
}
function justice_theme_lawyer_profile_is_public_approved( $post_id ): bool {
	return in_array( (int) $post_id, array( 11, 12, 13 ), true );
}
function justice_theme_get_connected_lawyer_by_slug( string $slug ) {
	return 'connected-lawyer' === $slug ? (object) array( 'ID' => 11 ) : null;
}
function justice_cards_has_public_sponsored_placement( int $post_id ): bool {
	return in_array( $post_id, array( 11, 13 ), true );
}

require_once dirname( __DIR__ ) . '/justice-ops/content-first-order.php';

function jt_sitewide_article_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$_SERVER['REQUEST_URI'] = '/family-law/';
$source = '<p>Direct family-law answer</p>'
	. '<div class="single-article__fold"><div>Organic map</div></div>'
	. '<a class="jt-procard" data-l="11"><span class="jt-procard__sponsored">מקודם</span>Paid disclosed card</a>'
	. '<a class="jt-procard" data-l="12"><span class="jt-procard__sponsored">מקודם</span>Unpaid card</a>'
	. '<a class="jt-procard" data-l="13"><span class="jt-procard__sponsored">כרטיס רשום</span>Paid but wrong disclosure</a>'
	. '<h2>Family-law evidence</h2><p>Final editorial paragraph</p>'
	. '<aside class="jt-firm-strip"><div>Organic firm strip</div></aside>';

$ordered = justice_ops_content_first_filter( $source );
$tail    = strpos( $ordered, 'data-jt-content-first-order=' );
$final   = strpos( $ordered, 'Final editorial paragraph' );

jt_sitewide_article_assert( false !== $tail, 'The global article tail marker is missing.' );
jt_sitewide_article_assert( 1 === substr_count( $ordered, 'data-jt-content-first-order=' ), 'The global article tail marker is duplicated.' );
jt_sitewide_article_assert( strpos( $ordered, 'Paid disclosed card' ) < $tail, 'A valid active-paid card with a visible disclosure was moved.' );
jt_sitewide_article_assert( $final < strpos( $ordered, 'Organic map' ), 'The organic fold remained above the complete article.' );
jt_sitewide_article_assert( $final < strpos( $ordered, 'Unpaid card' ), 'An unpaid manual card remained inline.' );
jt_sitewide_article_assert( $final < strpos( $ordered, 'Paid but wrong disclosure' ), 'A paid card without the exact visible disclosure remained inline.' );
jt_sitewide_article_assert( strpos( $ordered, 'Paid but wrong disclosure' ) < strpos( $ordered, 'Organic firm strip' ), 'The organic firm strip is not the final provider surface.' );
jt_sitewide_article_assert( 3 === substr_count( $ordered, 'class="jt-procard"' ), 'A manual card was lost or duplicated.' );
jt_sitewide_article_assert( $ordered === justice_ops_content_first_filter( $ordered ), 'The global article filter is not idempotent.' );

$jt_article_type = 'justice_lawyer';
jt_sitewide_article_assert( $source === justice_ops_content_first_filter( $source ), 'An individual lawyer profile was changed.' );
$jt_article_type = 'page';
$page_ordered = justice_ops_content_first_filter( $source );
jt_sitewide_article_assert( false !== strpos( $page_ordered, 'data-jt-content-first-order=' ), 'An ordinary editorial page was not ordered.' );

$jt_article_type = 'articles';
$classes = justice_ops_content_first_body_classes( array( 'single-articles' ) );
jt_sitewide_article_assert( in_array( 'jt-content-first-connected-lawyer', $classes, true ), 'Connected-lawyer article body class is missing.' );
ob_start();
justice_ops_content_first_connected_lawyer_css();
$css = (string) ob_get_clean();
jt_sitewide_article_assert( false !== strpos( $css, '.single-article__sidebar{order:2' ), 'Connected-lawyer sidebar is not visually ordered after main.' );
jt_sitewide_article_assert( false !== strpos( $css, 'position:static!important' ), 'Connected-lawyer sticky positioning was not disabled.' );

$jt_article_object = 502;
jt_sitewide_article_assert( ! in_array( 'jt-content-first-connected-lawyer', justice_ops_content_first_body_classes( array() ), true ), 'An article without a connected lawyer received the sidebar override.' );
ob_start();
justice_ops_content_first_connected_lawyer_css();
jt_sitewide_article_assert( '' === (string) ob_get_clean(), 'Article CSS printed without a connected lawyer.' );

$header_fixture = '<header class="single-article__header">'
	. '<h1>משמורת משותפת</h1>'
	. '<div class="single-article__author" style="display:flex"><span>⚖</span><span>נבדק מקצועית על ידי <a href="/maya/">עו״ד מאיה רוטנברג</a></span></div>'
	. '<div class="single-article__meta"><time>2021-06-28</time><span>1 דקת קריאה</span><span>עודכן: 2026-08-03</span><span class="meta-author">נכתב ע&quot;י: jus-tice</span></div>'
	. '</header><main><p>תוכן משפטי מאושר.</p><aside class="reviewer-box" aria-label="הבהרה משפטית"><p>מידע כללי בלבד.</p></aside></main>'
	. '<script>var untouched = "<span class=\"meta-author\">not markup</span>";</script>';
$clean_header = justice_ops_content_first_remove_top_attribution_noise( $header_fixture );
jt_sitewide_article_assert( false === strpos( $clean_header, 'single-article__author' ), 'The top named-reviewer block remains.' );
jt_sitewide_article_assert( false === strpos( $clean_header, '1 דקת קריאה' ), 'The stale Hebrew reading-time label remains.' );
jt_sitewide_article_assert( false === strpos( $clean_header, 'נכתב ע&quot;י: jus-tice' ), 'The generic top author label remains.' );
jt_sitewide_article_assert( false !== strpos( $clean_header, 'עודכן: 2026-08-03' ), 'The modified date was removed.' );
jt_sitewide_article_assert( false !== strpos( $clean_header, 'reviewer-box' ), 'The claim-free bottom disclaimer was removed.' );
jt_sitewide_article_assert( false !== strpos( $clean_header, 'not markup' ), 'Raw script text was changed.' );
jt_sitewide_article_assert( $clean_header === justice_ops_content_first_remove_top_attribution_noise( $clean_header ), 'The top-attribution cleanup is not idempotent.' );

echo "sitewide article content-first tests passed\n";
