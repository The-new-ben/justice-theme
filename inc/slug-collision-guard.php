<?php
/**
 * Cross-type slug collision guard.
 *
 * The 2026-07-06 consolidation found 12 live URLs where a page and an
 * articles post shared one slug, stacking two bodies on one URL and
 * splitting the intent signal. WordPress only enforces slug uniqueness
 * within a post type; this guard enforces it across the public content
 * types so the collision disease cannot recur.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Force cross-type unique slugs for public content types.
 *
 * @param string $slug        Proposed slug.
 * @param int    $post_id     Post ID being saved.
 * @param string $post_status Post status.
 * @param string $post_type   Post type.
 * @return string
 */
function justice_theme_cross_type_unique_slug( $slug, $post_id, $post_status, $post_type ) {
	$guarded = array( 'post', 'page', 'articles' );
	if ( ! in_array( $post_type, $guarded, true ) || '' === $slug ) {
		return $slug;
	}

	global $wpdb;
	$others    = array_values( array_diff( $guarded, array( $post_type ) ) );
	$candidate = $slug;
	$suffix    = 2;

	while ( (int) $wpdb->get_var( $wpdb->prepare(
		"SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type IN (%s, %s) AND ID != %d AND post_status NOT IN ('trash', 'auto-draft') LIMIT 1",
		$candidate,
		$others[0],
		$others[1],
		$post_id
	) ) ) {
		$candidate = $slug . '-' . $suffix;
		$suffix++;
	}

	return $candidate;
}
add_filter( 'wp_unique_post_slug', 'justice_theme_cross_type_unique_slug', 10, 4 );
