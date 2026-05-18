<?php
/**
 * Article archive crawl and UX controls.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Keep the public article archive segmented instead of rendering thousands of
 * links on one page. The HTML sitemap remains the broad discovery hub; this
 * archive should be a usable entry point with standard pagination.
 *
 * @param WP_Query $query Query object.
 */
function justice_theme_limit_articles_archive_query( WP_Query $query ): void {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	if ( ! $query->is_post_type_archive( 'articles' ) ) {
		return;
	}

	$query->set( 'posts_per_page', 24 );
	$query->set( 'ignore_sticky_posts', true );
}
add_action( 'pre_get_posts', 'justice_theme_limit_articles_archive_query', 5 );
