<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$jt_content_first_feed    = false;
$jt_content_first_preview = false;
$jt_content_first_json    = false;

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function get_option( $key, $default = false ) {
	return 'justice_ops_content_first_rollout_scope' === $key ? array( 'mode' => 'all', 'paths' => array() ) : $default;
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
function is_singular( $type = null ): bool {
	return 'articles' === $type;
}
function in_the_loop(): bool {
	return true;
}
function is_main_query(): bool {
	return true;
}
function is_feed(): bool {
	global $jt_content_first_feed;
	return $jt_content_first_feed;
}
function is_preview(): bool {
	global $jt_content_first_preview;
	return $jt_content_first_preview;
}
function wp_is_json_request(): bool {
	global $jt_content_first_json;
	return $jt_content_first_json;
}
function is_embed(): bool {
	return false;
}
function is_admin(): bool {
	return false;
}
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) );
}
function get_post_meta( $id, $key, $single = false ) {
	$meta = array(
		11 => array(
			'subscription_status' => 'active',
			'plan_type'           => 'featured',
		),
	);
	return $meta[ (int) $id ][ $key ] ?? '';
}
function get_post_type( $id = 0 ): string {
	return 11 === (int) $id ? 'justice_lawyer' : 'articles';
}
function justice_theme_lawyer_profile_is_public_approved( $id ): bool {
	return 11 === (int) $id;
}
function justice_cards_has_public_sponsored_placement( int $id ): bool {
	return 11 === $id;
}

require_once dirname( __DIR__ ) . '/justice-ops/content-first-order.php';

function jt_content_first_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$html = '<p>Direct answer</p>'
	. '<div class="single-article__fold"><div><div>Organic lawyer map</div></div></div>'
	. '<h2>Evidence</h2><p>Editorial body</p>'
	. '<a class="jt-procard" data-l="11"><span class="jt-procard__sponsored">מקודם</span>Sponsored lawyer</a>'
	. '<details class="jt-cmenu"><summary>Country lawyers</summary><div>Links</div></details>'
	. '<aside class="jt-firm-strip"><div><a>Free lawyer</a></div></aside>'
	. '<script>const sample = "<div class=\"single-article__fold\">ignore</div>";</script>'
	. '<style>.jt-cmenu{display:block}</style>'
	. '<textarea><aside class="jt-firm-strip">ignore</aside></textarea>'
	. '<template><div class="single-article__fold">ignore</div></template>'
	. '<noscript><details class="jt-cmenu">ignore</details></noscript>'
	. '<!-- <aside class="jt-firm-strip">ignore</aside> -->';

$ordered = justice_ops_content_first_reorder_html( $html );

jt_content_first_assert( 1 === substr_count( $ordered, 'data-jt-content-first-order=' ), 'Ordering marker missing or duplicated.' );
jt_content_first_assert( false !== strpos( $ordered, 'Sponsored lawyer' ), 'Sponsored card was removed.' );
jt_content_first_assert( strpos( $ordered, 'Sponsored lawyer' ) < strpos( $ordered, 'data-jt-content-first-order=' ), 'Sponsored card was moved to the organic tail.' );
jt_content_first_assert( strpos( $ordered, 'Editorial body' ) < strpos( $ordered, 'Country lawyers' ), 'Standalone country navigation remained above editorial content.' );
jt_content_first_assert( strpos( $ordered, 'Editorial body' ) < strpos( $ordered, 'Organic lawyer map' ), 'Organic lawyer module remained above editorial content.' );
jt_content_first_assert( strpos( $ordered, 'Editorial body' ) < strpos( $ordered, 'Free lawyer' ), 'Free firm strip remained above editorial content.' );
jt_content_first_assert( strpos( $ordered, 'Country lawyers' ) < strpos( $ordered, 'Organic lawyer map' ), 'Standalone tail module order is unstable.' );
jt_content_first_assert( strpos( $ordered, 'Organic lawyer map' ) < strpos( $ordered, 'Free lawyer' ), 'Free firms must be the last organic lawyer surface.' );
foreach ( array( '<script>const sample', '<style>.jt-cmenu', '<textarea><aside', '<template><div', '<noscript><details', '<!-- <aside' ) as $raw_marker ) {
	jt_content_first_assert( false !== strpos( $ordered, $raw_marker ), 'A raw-text or comment block changed: ' . $raw_marker );
}
jt_content_first_assert( $ordered === justice_ops_content_first_reorder_html( $ordered ), 'Reordering is not idempotent.' );

$duplicate = '<p>Body</p><aside class="jt-firm-strip">One</aside><aside class="jt-firm-strip">Two</aside>';
jt_content_first_assert( $duplicate === justice_ops_content_first_reorder_html( $duplicate ), 'Nonnested duplicate module did not fail closed.' );

$nested_duplicate = '<p>Body</p><div class="single-article__fold"><div class="single-article__fold">Nested duplicate</div></div>';
jt_content_first_assert( $nested_duplicate === justice_ops_content_first_reorder_html( $nested_duplicate ), 'Nested duplicate module did not fail closed.' );

$malformed = '<p>Body</p><div class="single-article__fold"><p>Unclosed fold</p><aside class="jt-firm-strip">Valid strip</aside>';
jt_content_first_assert( $malformed === justice_ops_content_first_reorder_html( $malformed ), 'Malformed target allowed a partial reorder.' );

$literal_marker = '<p>The literal text data-jt-content-first-order= must not trigger a rewrite.</p><aside class="jt-firm-strip">Strip</aside>';
jt_content_first_assert( $literal_marker === justice_ops_content_first_reorder_html( $literal_marker ), 'Literal marker collision did not fail closed.' );

$real_marker = '<p>Body</p><div class="jt-content-first-order" data-jt-content-first-order="existing"><aside class="jt-firm-strip">Done</aside></div>';
jt_content_first_assert( $real_marker === justice_ops_content_first_reorder_html( $real_marker ), 'Existing real marker was not idempotent.' );

$near_class = '<p>Body</p><aside class="jt-firm-strip-extra">Not a target</aside>';
jt_content_first_assert( $near_class === justice_ops_content_first_reorder_html( $near_class ), 'A partial class-name match was moved.' );

$attribute_lookalikes = '<p>Body</p><aside data-class="jt-firm-strip">Data class</aside>'
	. '<section ng-class="single-article__fold">Angular class</section>';
jt_content_first_assert( $attribute_lookalikes === justice_ops_content_first_reorder_html( $attribute_lookalikes ), 'A data-class or ng-class lookalike was moved.' );

$nested = '<p>Answer</p><div class="legacy single-article__fold"><section class="jtcm-wrap"><div>Map start</div>'
	. '<details data-role="country" class="compact jt-cmenu"><summary>Nested menu</summary><form id="country-form"><input name="q"></form></details>'
	. '<div id="jt-cinema-map">Map</div></section></div><h2>Body</h2><p>Last editorial paragraph</p>'
	. '<aside class="secondary jt-firm-strip"><div>Organic directory</div></aside>';
$nested_ordered = justice_ops_content_first_reorder_html( $nested );
jt_content_first_assert( 1 === substr_count( $nested_ordered, 'Nested menu' ), 'Nested country menu was lost or duplicated.' );
jt_content_first_assert( 1 === substr_count( $nested_ordered, 'Map start' ), 'Nested lawyer fold was lost or duplicated.' );
jt_content_first_assert( 1 === substr_count( $nested_ordered, 'id="country-form"' ), 'Nested form was lost or duplicated.' );
jt_content_first_assert( 1 === substr_count( $nested_ordered, 'id="jt-cinema-map"' ), 'Nested map was lost or duplicated.' );
jt_content_first_assert( strpos( $nested_ordered, 'Last editorial paragraph' ) < strpos( $nested_ordered, 'Map start' ), 'Nested fold remained inside the editorial body.' );
jt_content_first_assert( strpos( $nested_ordered, 'Map start' ) < strpos( $nested_ordered, 'Nested menu' ), 'Nested menu was detached from its original fold order.' );
jt_content_first_assert( strpos( $nested_ordered, 'Nested menu' ) < strpos( $nested_ordered, 'Organic directory' ), 'Organic directory is not last.' );

$protected = array();
$masked    = justice_ops_content_first_protect_raw_text( $nested_ordered, $protected );
$tags      = justice_ops_content_first_scan_tags( $masked );
$folds     = justice_ops_content_first_find_class_blocks( $masked, $tags, 'single-article__fold' );
$menus     = justice_ops_content_first_find_class_blocks( $masked, $tags, 'jt-cmenu' );
jt_content_first_assert( 1 === count( $folds ?? array() ) && 1 === count( $menus ?? array() ), 'Nested blocks could not be reparsed.' );
jt_content_first_assert( justice_ops_content_first_block_contains( $folds[0], $menus[0] ), 'jt-cmenu is no longer a descendant of single-article__fold.' );

foreach ( justice_ops_content_first_target_paths() as $path ) {
	$_SERVER['REQUEST_URI'] = $path . '?source=test';
	$filtered = justice_ops_content_first_filter( $nested );
	jt_content_first_assert( false !== strpos( $filtered, 'data-jt-content-first-order=' ), 'Reviewed path was not reordered: ' . $path );
}

$_SERVER['REQUEST_URI'] = '/family-law/?source=test';
$family_ordered = justice_ops_content_first_filter( $nested );
jt_content_first_assert( false !== strpos( $family_ordered, 'data-jt-content-first-order=' ), 'A non-Cyprus editorial article was not reordered.' );
jt_content_first_assert( strpos( $family_ordered, 'Last editorial paragraph' ) < strpos( $family_ordered, 'Map start' ), 'Sitewide article ordering left providers above family-law content.' );

$_SERVER['REQUEST_URI'] = '/cyprus-prices/';
$jt_content_first_preview = true;
jt_content_first_assert( $nested === justice_ops_content_first_filter( $nested ), 'Preview response was mutated.' );
$jt_content_first_preview = false;
$jt_content_first_feed = true;
jt_content_first_assert( $nested === justice_ops_content_first_filter( $nested ), 'Feed response was mutated.' );
$jt_content_first_feed = false;
$jt_content_first_json = true;
jt_content_first_assert( $nested === justice_ops_content_first_filter( $nested ), 'JSON response was mutated.' );
$jt_content_first_json = false;
$_GET['rest_route'] = '/wp/v2/articles/1';
jt_content_first_assert( $nested === justice_ops_content_first_filter( $nested ), 'REST query transport response was mutated.' );
unset( $_GET['rest_route'] );

echo "content-first order tests passed\n";
