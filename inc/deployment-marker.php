<?php
/**
 * Public deployment marker.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Print a small non-visual marker so deployment checks can prove which theme
 * code the live site is actually serving.
 */
function justice_theme_print_deployment_marker(): void {
	if ( is_admin() ) {
		return;
	}

	printf(
		"\n" . '<meta name="justice-theme-version" content="%1$s" />' . "\n" . '<meta name="justice-deployment-marker" content="%2$s" />' . "\n",
		esc_attr( JUSTICE_THEME_VERSION ),
		esc_attr( JUSTICE_THEME_DEPLOYMENT_MARKER )
	);
}
add_action( 'wp_head', 'justice_theme_print_deployment_marker', 0 );
