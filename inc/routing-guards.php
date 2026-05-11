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
 * Normalize a path for root/home comparisons.
 *
 * @param string $path URL path.
 * @return string
 */
function justice_theme_normalize_route_path( string $path ): string {
	$path = '/' . trim( $path, '/' );

	return '//' === $path ? '/' : $path;
}

/**
 * Remove a WordPress subdirectory home path from a request path when needed.
 *
 * @param string $request_path Request path.
 * @param string $home_path Home path.
 * @return string
 */
function justice_theme_strip_home_path_prefix( string $request_path, string $home_path ): string {
	if ( '/' !== $home_path && 0 === strpos( $request_path . '/', trailingslashit( $home_path ) ) ) {
		return justice_theme_normalize_route_path( substr( $request_path, strlen( $home_path ) ) );
	}

	return $request_path;
}

/**
 * Check whether the current/requested public path is a non-root path.
 *
 * @param string $requested_url Optional requested URL. Falls back to REQUEST_URI.
 * @return bool
 */
function justice_theme_is_public_non_root_request_path( string $requested_url = '' ): bool {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return false;
	}

	$path_source = $requested_url;

	if ( '' === $path_source ) {
		$path_source = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	}

	$home_path    = justice_theme_normalize_route_path( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ) );
	$request_path = justice_theme_normalize_route_path( (string) wp_parse_url( $path_source, PHP_URL_PATH ) );
	$request_path = justice_theme_strip_home_path_prefix( $request_path, $home_path );

	return '/' !== $request_path;
}

/**
 * Check whether a redirect target is the site homepage.
 *
 * @param string $location Redirect location.
 * @return bool
 */
function justice_theme_is_home_redirect_target( string $location ): bool {
	if ( '' === $location ) {
		return false;
	}

	$home_url      = home_url( '/' );
	$home_host     = wp_parse_url( $home_url, PHP_URL_HOST );
	$location_host = wp_parse_url( $location, PHP_URL_HOST );

	if ( $home_host && $location_host && strtolower( $home_host ) !== strtolower( $location_host ) ) {
		return false;
	}

	$home_path     = justice_theme_normalize_route_path( (string) wp_parse_url( $home_url, PHP_URL_PATH ) );
	$location_path = justice_theme_normalize_route_path( (string) wp_parse_url( $location, PHP_URL_PATH ) );

	return $location_path === $home_path;
}

/**
 * Prevent plugins or core helpers from redirecting arbitrary misses to home.
 *
 * @param string|false $location Redirect location.
 * @param int          $status   Redirect status.
 * @return string|false
 */
function justice_theme_block_non_root_wp_redirect_to_home( $location, int $status ) {
	unset( $status );

	if ( ! is_string( $location ) || '' === $location ) {
		return $location;
	}

	if ( justice_theme_is_public_non_root_request_path() && justice_theme_is_home_redirect_target( $location ) ) {
		return false;
	}

	return $location;
}
add_filter( 'wp_redirect', 'justice_theme_block_non_root_wp_redirect_to_home', 0, 2 );

/**
 * Prevent unknown public paths from being canonical-redirected to the homepage.
 *
 * Redirecting arbitrary missing paths to `/` hides broken URLs from users and
 * crawlers. This guard is intentionally narrow: it only blocks redirects where
 * the requested public path is not the home path and the canonical target is
 * the site home URL. Approved URL migrations still need explicit redirect rules.
 *
 * @param string|false $redirect_url  Proposed canonical redirect URL.
 * @param string       $requested_url Requested URL.
 * @return string|false
 */
function justice_theme_block_unknown_path_home_canonical_redirect( $redirect_url, string $requested_url ) {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || empty( $redirect_url ) ) {
		return $redirect_url;
	}

	if (
		justice_theme_is_public_non_root_request_path( $requested_url )
		&& justice_theme_is_home_redirect_target( (string) $redirect_url )
	) {
		return false;
	}

	return $redirect_url;
}
add_filter( 'redirect_canonical', 'justice_theme_block_unknown_path_home_canonical_redirect', 0, 2 );

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

	$request_path = justice_theme_normalize_route_path( (string) $request_path );
	$home_path    = justice_theme_normalize_route_path( (string) $home_path );
	$request_path = justice_theme_strip_home_path_prefix( $request_path, $home_path );

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

	if ( ! headers_sent() ) {
		header( 'X-Justice-Route-Guard: forced-unknown-path-404', true );
		header( 'X-Robots-Tag: noindex, nofollow', true );
	}
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
