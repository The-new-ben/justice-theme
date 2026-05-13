<?php
/**
 * Dynamic XML Sitemap for Jus-Tice.
 *
 * Generates a sitemap at /justice-sitemap.xml containing all published
 * articles, pages, and practice-area landing pages.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the sitemap rewrite rule.
 */
function justice_theme_sitemap_rewrite() {
	add_rewrite_rule( 'justice-sitemap\.xml$', 'index.php?justice_sitemap=1', 'top' );
}
add_action( 'init', 'justice_theme_sitemap_rewrite' );

/**
 * Register query var.
 *
 * @param array $vars Existing query vars.
 * @return array
 */
function justice_theme_sitemap_query_var( $vars ) {
	$vars[] = 'justice_sitemap';
	return $vars;
}
add_filter( 'query_vars', 'justice_theme_sitemap_query_var' );

/**
 * Serve the sitemap XML.
 */
function justice_theme_serve_sitemap() {
	if ( ! get_query_var( 'justice_sitemap' ) ) {
		return;
	}

	header( 'Content-Type: application/xml; charset=UTF-8' );
	header( 'X-Robots-Tag: noindex' );

	echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
	echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

	// Homepage.
	justice_theme_sitemap_url( home_url( '/' ), '1.0', 'weekly' );

	// Published articles (our main content CPT).
	$articles = get_posts( array(
		'post_type'      => 'articles',
		'post_status'    => 'publish',
		'posts_per_page' => 500,
		'orderby'        => 'modified',
		'order'          => 'DESC',
	) );

	foreach ( $articles as $article ) {
		$permalink = get_permalink( $article );
		$modified  = get_the_modified_date( 'Y-m-d', $article );
		// Pillar pages get higher priority.
		$priority  = ( strlen( $article->post_content ) > 15000 ) ? '0.9' : '0.8';
		justice_theme_sitemap_url( $permalink, $priority, 'monthly', $modified );
	}

	// Published pages.
	$pages = get_posts( array(
		'post_type'      => 'page',
		'post_status'    => 'publish',
		'posts_per_page' => 200,
		'orderby'        => 'modified',
		'order'          => 'DESC',
	) );

	foreach ( $pages as $page ) {
		$permalink = get_permalink( $page );
		$modified  = get_the_modified_date( 'Y-m-d', $page );
		justice_theme_sitemap_url( $permalink, '0.6', 'monthly', $modified );
	}

	// Lawyer profiles.
	$lawyers = get_posts( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => 500,
		'orderby'        => 'modified',
		'order'          => 'DESC',
	) );

	foreach ( $lawyers as $lawyer ) {
		$permalink = get_permalink( $lawyer );
		$modified  = get_the_modified_date( 'Y-m-d', $lawyer );
		justice_theme_sitemap_url( $permalink, '0.5', 'monthly', $modified );
	}

	echo '</urlset>' . "\n";
	exit;
}
add_action( 'template_redirect', 'justice_theme_serve_sitemap' );

/**
 * Output a single URL entry.
 *
 * @param string $loc        URL.
 * @param string $priority   Priority (0.0 - 1.0).
 * @param string $changefreq Change frequency.
 * @param string $lastmod    Last modification date (Y-m-d).
 */
function justice_theme_sitemap_url( $loc, $priority = '0.5', $changefreq = 'monthly', $lastmod = '' ) {
	if ( empty( $lastmod ) ) {
		$lastmod = gmdate( 'Y-m-d' );
	}
	$loc = esc_url( function_exists( 'justice_theme_public_url' ) ? justice_theme_public_url( $loc ) : $loc );

	echo '  <url>' . "\n";
	echo '    <loc>' . $loc . '</loc>' . "\n";
	echo '    <lastmod>' . esc_html( $lastmod ) . '</lastmod>' . "\n";
	echo '    <changefreq>' . esc_html( $changefreq ) . '</changefreq>' . "\n";
	echo '    <priority>' . esc_html( $priority ) . '</priority>' . "\n";
	echo '  </url>' . "\n";
}
