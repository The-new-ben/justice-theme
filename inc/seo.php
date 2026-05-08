<?php
/**
 * SEO helpers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Clean archive titles — remove "Archives:" prefix.
 *
 * @param string $title Archive title.
 * @return string
 */
function justice_theme_archive_title( $title ) {
	if ( is_tax( 'practice-areas' ) ) {
		$title = single_term_title( '', false );
	}

	if ( is_post_type_archive( 'articles' ) ) {
		$title = __( 'מאמרים משפטיים', 'justice-theme' );
	}

	return $title;
}
add_filter( 'get_the_archive_title', 'justice_theme_archive_title' );

/**
 * Add semantic body classes.
 *
 * @param array $classes Body classes.
 * @return array
 */
function justice_theme_body_classes( $classes ) {
	if ( is_rtl() ) {
		$classes[] = 'is-rtl';
	}

	if ( is_singular( array( 'post', 'articles' ) ) ) {
		$classes[] = 'is-single-legal-content';
	}

	if ( is_front_page() ) {
		$classes[] = 'is-front-page';
	}

	return $classes;
}
add_filter( 'body_class', 'justice_theme_body_classes' );

/**
 * Include articles in main search queries.
 *
 * @param WP_Query $query Query object.
 */
function justice_theme_include_articles_in_search( $query ) {
	if ( ! is_admin() && $query->is_main_query() && $query->is_search() ) {
		$query->set( 'post_type', array( 'post', 'page', 'articles' ) );
	}
}
add_action( 'pre_get_posts', 'justice_theme_include_articles_in_search' );

