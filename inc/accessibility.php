<?php
/**
 * Accessibility helpers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add aria-label to menu links from title attribute.
 *
 * @param array $atts Link attributes.
 * @return array
 */
function justice_theme_menu_link_attributes( $atts ) {
	if ( empty( $atts['aria-label'] ) && ! empty( $atts['title'] ) ) {
		$atts['aria-label'] = $atts['title'];
	}
	return $atts;
}
add_filter( 'nav_menu_link_attributes', 'justice_theme_menu_link_attributes' );
