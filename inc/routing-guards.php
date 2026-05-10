<?php
/**
 * Routing guards for public trust and crawl hygiene.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Detect the live failure mode where an unknown path is served as the homepage.
 *
 * This is intentionally narrow: it only fires when WordPress thinks the current
 * request is the front page while the actual URL path is not the site's root.
 *
 * @return bool
 */
function justice_theme_is_unknown_path_served_as_home(): bool {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || ! is_front_page() ) {
		return false;
	}

	$request_path = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '', PHP_URL_PATH );
	$home_path    = wp_parse_url( home_url( '/' ), PHP_URL_PATH );

	$request_path = '/' . trim( (string) $request_path, '/' );
	$home_path    = '/' . trim( (string) $home_path, '/' );

	if ( '/' !== $home_path && 0 === strpos( $request_path . '/', trailingslashit( $home_path ) ) ) {
		$request_path = '/' . trim( substr( $request_path, strlen( $home_path ) ), '/' );
	}

	return '/' !== $request_path;
}

/**
 * Convert suspicious homepage fallbacks into real 404 responses.
 */
function justice_theme_force_404_for_unknown_home_fallback(): void {
	if ( ! justice_theme_is_unknown_path_served_as_home() ) {
		return;
	}

	$GLOBALS['justice_theme_forced_unknown_path_404'] = true;

	remove_action( 'template_redirect', 'redirect_canonical' );

	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->set_404();
	}

	status_header( 404 );
	nocache_headers();
}
add_action( 'template_redirect', 'justice_theme_force_404_for_unknown_home_fallback', 0 );

/**
 * Ensure the theme 404 template is used after the guard marks the request.
 *
 * @param string $template Current template path.
 * @return string
 */
function justice_theme_use_404_template_for_guarded_home_fallback( string $template ): string {
	if ( ! is_404() || empty( $GLOBALS['justice_theme_forced_unknown_path_404'] ) ) {
		return $template;
	}

	$not_found_template = get_404_template();

	return $not_found_template ?: $template;
}
add_filter( 'template_include', 'justice_theme_use_404_template_for_guarded_home_fallback', 0 );
