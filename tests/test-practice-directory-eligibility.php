<?php
declare(strict_types=1);

// Behavioural fixtures, not a WordPress/database integration test.
define( 'ABSPATH', __DIR__ );
class WP_Term { public int $term_id = 12; }
class WP_Post {
	public string $post_type = 'justice_lawyer';
	public string $post_status = 'publish';
	public function __construct( public int $ID, public string $post_title ) {}
}
$fixture_posts = array();
$fixture_approved = array();
$fixture_active = array();
$fixture_query_excluded = array();
$fixture_sponsored = array();
$fixture_query_args = null;
function taxonomy_exists( $taxonomy ) { return true; }
function post_type_exists( $type ) { return true; }
function get_term_by( $field, $slug, $taxonomy ) { return 'missing' === $slug ? false : new WP_Term(); }
function get_objects_in_term( $id, $taxonomy ) { return array_keys( $GLOBALS['fixture_posts'] ); }
function get_post( $id ) { return $GLOBALS['fixture_posts'][ $id ] ?? null; }
function get_post_meta( $id, $key, $single ) { return $GLOBALS['fixture_sponsored'][ $id ] ?? ''; }
function justice_theme_lawyer_profile_is_public_approved( $id ) { return in_array( $id, $GLOBALS['fixture_approved'], true ); }
function justice_theme_lawyer_card_is_active( $id ) { return in_array( $id, $GLOBALS['fixture_active'], true ); }
function get_posts( $args ) {
	$GLOBALS['fixture_query_args'] = $args;
	return array_values( array_diff( array_keys( $GLOBALS['fixture_posts'] ), $GLOBALS['fixture_query_excluded'] ) );
}
require dirname( __DIR__ ) . '/inc/lawyer-band.php';
function check_same( $expected, $actual, $label ) {
	if ( $expected !== $actual ) { throw new RuntimeException( $label . ': ' . json_encode( $actual ) ); }
	echo "PASS: $label\n";
}
function result_ids( $limit = 6, $registered = false, $directory = true ) {
	return array_map( static fn( $p ) => $p->ID, justice_theme_get_practice_firms( 'criminal-law', $limit, $registered, $directory ) );
}
$fixture_posts = array( 1 => new WP_Post( 1, 'Alpha Office' ), 2 => new WP_Post( 2, 'Zephyr Counsel' ) );
$fixture_approved = array( 1, 2 );
check_same( array(), result_ids(), 'Approved but inactive names cannot enable a directory CTA' );
$fixture_active = array( 2 );
check_same( array( 2 ), result_ids( 1 ), 'Activity filtering happens before the display limit' );
check_same( false, $fixture_query_args['suppress_filters'] ?? null, 'Directory query filters remain enabled' );
check_same( true, $fixture_query_args['justice_public_lawyer_listing'] ?? null, 'Public listing query contract is carried' );
check_same( 'publish', $fixture_query_args['post_status'] ?? null, 'Only published profiles are queried' );
check_same( 'criminal-law', $fixture_query_args['tax_query'][0]['terms'] ?? null, 'Candidate query is scoped to the practice' );
$fixture_query_excluded = array( 2 );
check_same( array(), result_ids(), 'A query-excluded active profile cannot enable the CTA' );
$fixture_query_excluded = array();
$fixture_approved = array( 1 );
check_same( array(), result_ids(), 'Activity never overrides public approval' );
$fixture_approved = array( 1, 2 );
$fixture_posts[2]->post_status = 'draft';
check_same( array(), result_ids(), 'A draft cannot enter through a query fixture' );
$fixture_posts[2]->post_status = 'publish';
check_same( array(), result_ids( 6, true ), 'Registered tier still requires its existing placement status' );
$fixture_sponsored[2] = 'reserved';
check_same( array( 2 ), result_ids( 6, true ), 'Active approved registered profile remains available' );
check_same( array( 1, 2 ), result_ids( 6, false, false ), 'Legacy callers keep their existing name-only band behaviour' );
check_same( array(), justice_theme_get_practice_firms( 'missing', 6, false, true ), 'Missing term stays empty' );
check_same( array(), justice_theme_get_practice_firms( '', 6, false, true ), 'Empty practice stays empty' );
echo "All practice directory eligibility fixtures passed.\n";
