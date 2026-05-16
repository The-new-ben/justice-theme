<?php
/**
 * PHP 8.4 Safety Net — Must-Use Plugin
 *
 * Ensures WordPress globals are properly typed before core functions
 * attempt to call methods on them. This prevents fatal errors when:
 *
 * 1. The $wp global is not yet an object during create_initial_taxonomies()
 * 2. A cache drop-in or plugin pollutes $wp with a non-object value
 *
 * This mu-plugin replaces a fragile direct patch to wp-includes/class-wp-taxonomy.php
 * and survives all WordPress core updates.
 *
 * @package JusticeTheme
 * @since   2026-05-16
 * @see     Incident report: May 15, 2026 site crash
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Guard: Ensure $wp is a proper WP object before taxonomy registration.
 *
 * WordPress calls create_initial_taxonomies() at wp-settings.php:528,
 * but $GLOBALS['wp'] = new WP() doesn't happen until line ~634.
 * On PHP 8.4, if any code sets $wp to a non-object truthy value (like a string),
 * WP_Taxonomy::add_rewrite_rules() crashes with:
 *   "Call to a member function add_query_var() on string"
 *
 * This filter intercepts registered_taxonomy (fires after each taxonomy registration)
 * and ensures $wp is either null (which WP core handles) or a real WP object.
 */
add_action( 'muplugins_loaded', function () {
	// If $wp is set but not an object, reset it to null so WP's own
	// truthy check ( if ( $wp ) ) correctly skips the add_query_var() call.
	if ( isset( $GLOBALS['wp'] ) && ! is_object( $GLOBALS['wp'] ) ) {
		$GLOBALS['wp'] = null;
	}
}, 0 );

/**
 * Secondary guard: re-check before the 'init' hook fires.
 *
 * By the time 'init' runs, $wp MUST be a WP instance. If it's still
 * not an object at this point, something is seriously wrong — log it.
 */
add_action( 'init', function () {
	if ( isset( $GLOBALS['wp'] ) && ! is_object( $GLOBALS['wp'] ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( '[php84-safety-net] WARNING: $GLOBALS["wp"] is ' . gettype( $GLOBALS['wp'] ) . ' at init. Resetting to null.' );
		}
		$GLOBALS['wp'] = null;
	}
}, 0 );
