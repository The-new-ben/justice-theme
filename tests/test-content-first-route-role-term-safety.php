<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

class WP_Post {
	public $ID;
	public $post_type;
	public $post_name;

	public function __construct( int $id, string $post_type = 'page', string $post_name = '' ) {
		$this->ID        = $id;
		$this->post_type = $post_type;
		$this->post_name = $post_name;
	}
}

class WP_Term {
	public $term_id;
	public $taxonomy;
	public $slug;

	public function __construct( int $term_id, string $taxonomy, string $slug ) {
		$this->term_id = $term_id;
		$this->taxonomy = $taxonomy;
		$this->slug = $slug;
	}
}

$jt_term_safe_type              = '';
$jt_term_safe_taxonomy_match    = false;
$jt_term_safe_queried_object    = null;
$jt_term_safe_is_tax_calls      = 0;
$jt_term_safe_get_object_calls  = 0;
$jt_term_safe_landing_calls     = 0;
$jt_term_safe_get_post_calls    = 0;
$jt_term_safe_posts             = array();
$jt_term_safe_options           = array(
	'justice_ops_content_first_rollout_scope' => array( 'mode' => 'all', 'paths' => array() ),
);

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function apply_filters( $tag, $value ) { return $value; }
function wp_parse_url( $url, $component = -1 ) { return parse_url( $url, $component ); }
function wp_strip_all_tags( $value ): string { return strip_tags( (string) $value ); }
function sanitize_key( $value ): string { return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) ); }
function get_option( $key, $default = false ) {
	global $jt_term_safe_options;

	return array_key_exists( $key, $jt_term_safe_options ) ? $jt_term_safe_options[ $key ] : $default;
}
function is_singular( $type = null ): bool {
	global $jt_term_safe_type;

	return null === $type ? '' !== $jt_term_safe_type : $jt_term_safe_type === $type;
}
function is_front_page(): bool { return false; }
function is_post_type_archive( $type = '' ): bool { return false; }
function is_page( $slug = '' ): bool { return false; }
function is_page_template( $template = '' ): bool { return false; }
function is_tax( $taxonomy = '' ): bool {
	global $jt_term_safe_taxonomy_match, $jt_term_safe_is_tax_calls;
	++$jt_term_safe_is_tax_calls;

	return $jt_term_safe_taxonomy_match && 'practice-areas' === $taxonomy;
}
function is_admin(): bool { return false; }
function is_feed(): bool { return false; }
function is_preview(): bool { return false; }
function is_embed(): bool { return false; }
function wp_is_json_request(): bool { return false; }
function wp_doing_ajax(): bool { return false; }
function in_the_loop(): bool { return true; }
function is_main_query(): bool { return true; }
function get_queried_object_id(): int {
	global $jt_term_safe_queried_object;

	return is_object( $jt_term_safe_queried_object ) && isset( $jt_term_safe_queried_object->ID )
		? (int) $jt_term_safe_queried_object->ID
		: 0;
}
function get_queried_object() {
	global $jt_term_safe_queried_object, $jt_term_safe_get_object_calls;
	++$jt_term_safe_get_object_calls;

	return $jt_term_safe_queried_object;
}
function get_post( $post_id ) {
	global $jt_term_safe_posts, $jt_term_safe_get_post_calls;
	++$jt_term_safe_get_post_calls;

	return $jt_term_safe_posts[ (int) $post_id ] ?? null;
}
function get_post_meta( $post_id, $key, $single = false ) { return ''; }
function justice_theme_get_controlled_practice_route_template(): string { return ''; }
function justice_theme_is_practice_landing_page( ?WP_Post $post ): bool {
	global $jt_term_safe_landing_calls;
	++$jt_term_safe_landing_calls;

	return null !== $post && 'pillar' === $post->post_name;
}

require_once dirname( __DIR__ ) . '/justice-ops/content-first-order.php';

function jt_term_safe_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

function jt_term_safe_reset_calls(): void {
	global $jt_term_safe_is_tax_calls, $jt_term_safe_get_object_calls, $jt_term_safe_landing_calls, $jt_term_safe_get_post_calls;
	$jt_term_safe_is_tax_calls     = 0;
	$jt_term_safe_get_object_calls = 0;
	$jt_term_safe_landing_calls    = 0;
	$jt_term_safe_get_post_calls   = 0;
}

// A normal category term is neither a post nor a legal pillar. The typed
// theme predicate must never receive it.
$_SERVER['REQUEST_URI']           = '/category/legal-news/';
$jt_term_safe_type                = '';
$jt_term_safe_taxonomy_match      = false;
$jt_term_safe_queried_object      = new WP_Term( 7, 'category', 'legal-news' );
jt_term_safe_reset_calls();
jt_term_safe_assert( 'other' === justice_ops_content_first_route_role(), 'A category WP_Term received the wrong route role.' );
jt_term_safe_assert( 0 === $jt_term_safe_landing_calls, 'A category WP_Term entered the typed landing-page predicate.' );
jt_term_safe_assert( 0 === $jt_term_safe_get_post_calls, 'A category WP_Term was normalized as a post.' );

// A registered practice taxonomy remains editorial_taxonomy and returns before
// the post-only predicate, even though get_queried_object() is a WP_Term.
$_SERVER['REQUEST_URI']           = '/practice-areas/criminal-law/';
$jt_term_safe_taxonomy_match      = true;
$jt_term_safe_queried_object      = new WP_Term( 8, 'practice-areas', 'criminal-law' );
jt_term_safe_reset_calls();
jt_term_safe_assert( 'editorial_taxonomy' === justice_ops_content_first_route_role(), 'A practice-area WP_Term received the wrong route role.' );
jt_term_safe_assert( 0 === $jt_term_safe_get_object_calls, 'Practice taxonomy classification unnecessarily loaded the queried object.' );
jt_term_safe_assert( 0 === $jt_term_safe_landing_calls, 'A practice-area WP_Term entered the typed landing-page predicate.' );

// A custom term that is not the registered practice taxonomy fails closed as
// other. Reaching the post fallback is safe and does not throw TypeError.
$jt_term_safe_taxonomy_match = false;
jt_term_safe_reset_calls();
jt_term_safe_assert( 'other' === justice_ops_content_first_route_role(), 'An unmatched custom WP_Term received the wrong route role.' );
jt_term_safe_assert( 1 === $jt_term_safe_get_object_calls, 'The safe post fallback was not evaluated.' );
jt_term_safe_assert( 0 === $jt_term_safe_landing_calls, 'An unmatched custom WP_Term entered the typed landing-page predicate.' );

// Real WP_Post objects and post-compatible objects normalized through get_post
// still reach the theme predicate and retain the editorial pillar role.
$_SERVER['REQUEST_URI']      = '/family-law/';
$jt_term_safe_type           = 'page';
$jt_term_safe_queried_object = new WP_Post( 501, 'page', 'pillar' );
jt_term_safe_reset_calls();
jt_term_safe_assert( 'editorial_pillar' === justice_ops_content_first_route_role(), 'A real WP_Post pillar was not classified.' );
jt_term_safe_assert( 1 === $jt_term_safe_landing_calls, 'A real WP_Post did not reach the landing-page predicate exactly once.' );
jt_term_safe_assert( 0 === $jt_term_safe_get_post_calls, 'A real WP_Post was needlessly reloaded.' );

$jt_term_safe_posts[502]     = new WP_Post( 502, 'page', 'pillar' );
$jt_term_safe_queried_object = (object) array( 'ID' => 502, 'post_type' => 'page', 'post_name' => 'pillar' );
jt_term_safe_reset_calls();
jt_term_safe_assert( 'editorial_pillar' === justice_ops_content_first_route_role(), 'A compatible post object was not normalized and classified.' );
jt_term_safe_assert( 1 === $jt_term_safe_get_post_calls, 'A compatible post object was not normalized exactly once.' );
jt_term_safe_assert( 1 === $jt_term_safe_landing_calls, 'The normalized WP_Post did not reach the typed predicate exactly once.' );

// Excluded paths must short-circuit before route classification. This protects
// both the taxonomy buffer and the_content filter from any future classifier
// incompatibility, and proves the old fatal path cannot run outside scope.
$_SERVER['REQUEST_URI'] = '/practice-areas/criminal-law/';
$jt_term_safe_type      = '';
$jt_term_safe_taxonomy_match = false;
$jt_term_safe_queried_object = new WP_Term( 8, 'practice-areas', 'criminal-law' );
$jt_term_safe_options['justice_ops_content_first_rollout_scope'] = array(
	'mode'  => 'exact',
	'paths' => array( '/allowed/' ),
);
jt_term_safe_reset_calls();
jt_term_safe_assert( ! justice_ops_practice_taxonomy_should_buffer(), 'An excluded taxonomy path was buffered.' );
jt_term_safe_assert( 0 === $jt_term_safe_is_tax_calls, 'Excluded taxonomy scope entered route classification.' );
jt_term_safe_assert( 0 === $jt_term_safe_get_object_calls, 'Excluded taxonomy scope loaded its WP_Term.' );
jt_term_safe_assert( '<p>unchanged</p>' === justice_ops_content_first_filter( '<p>unchanged</p>' ), 'Excluded singular content changed.' );
jt_term_safe_assert( 0 === $jt_term_safe_is_tax_calls, 'Excluded singular scope entered route classification.' );
jt_term_safe_assert( 0 === $jt_term_safe_get_object_calls, 'Excluded singular scope loaded its WP_Term.' );

// The same exact scope becomes eligible when the path is included and WordPress
// identifies it as the practice taxonomy.
$_SERVER['REQUEST_URI'] = '/allowed/';
$jt_term_safe_taxonomy_match = true;
$jt_term_safe_options['justice_ops_content_first_rollout_scope'] = array(
	'mode'  => 'exact',
	'paths' => array( '/allowed/' ),
);
jt_term_safe_reset_calls();
jt_term_safe_assert( justice_ops_practice_taxonomy_should_buffer(), 'An included practice taxonomy was not buffered.' );
jt_term_safe_assert( 1 === $jt_term_safe_is_tax_calls, 'Included taxonomy was not classified exactly once.' );
jt_term_safe_assert( 0 === $jt_term_safe_landing_calls, 'Included WP_Term entered the typed post predicate.' );

echo "content-first route-role WP_Term safety tests passed\n";
