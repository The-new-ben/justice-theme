<?php
/**
 * 301 layer for the deleted 2025 winners.
 *
 * Why this lives in the plugin: the theme's 2026-05-17 slug map is live and
 * working (verified 2026-09-07), but it only covers the May migration. The
 * 175 URLs that earned clicks in summer 2025 and were deleted are covered
 * by nothing, and every one tested returns 404. The plugin ships through
 * native auto-update, so this layer reaches production without a theme pull.
 *
 * Runs only on 404s, after the theme's native slug redirect (-3000), so it
 * can never touch a living page and never fights the theme layer.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The path => slug map (full decoded request paths).
 *
 * @return array<string,string>
 */
function justice_ops_legacy_2025_map(): array {
	static $map = null;

	if ( null === $map ) {
		$loaded = include __DIR__ . '/data/legacy-2025-redirects.php';
		$map    = is_array( $loaded ) ? $loaded : array();
	}

	return $map;
}

/**
 * 301 a dead legacy path to its verified live successor.
 */
function justice_ops_legacy_2025_redirect(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || ! is_404() ) {
		return;
	}

	$request = (string) ( $_SERVER['REQUEST_URI'] ?? '' );
	$path    = trim( rawurldecode( (string) strtok( $request, '?' ) ), '/' );

	if ( '' === $path ) {
		return;
	}

	$map = justice_ops_legacy_2025_map();

	if ( ! isset( $map[ $path ] ) ) {
		return;
	}

	wp_safe_redirect( home_url( '/' . $map[ $path ] . '/' ), 301 );
	exit;
}
// After the theme's native slug redirect (-3000): the theme map wins ties.
add_action( 'template_redirect', 'justice_ops_legacy_2025_redirect', -2999 );
