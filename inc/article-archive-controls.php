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

/** Keep archive routes out of the legacy single-article prefix redirect. */
function justice_theme_preserve_articles_archive_routes(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}
	$path = trim( (string) wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH ), '/' );
	if ( is_post_type_archive( 'articles' ) || preg_match( '#^articles/page/[0-9]+$#D', $path ) ) {
		remove_action( 'template_redirect', 'justice_theme_redirect_articles_prefix_to_root', -2998 );
	}
}
add_action( 'template_redirect', 'justice_theme_preserve_articles_archive_routes', -2999 );