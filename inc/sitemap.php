<?php
/**
 * Dynamic XML Sitemap for Jus-Tice.
 *
 * Generates a sitemap at /justice-sitemap.xml containing all published
 * articles, pages, lawyer profiles, and practice-area landing pages.
 *
 * Uses direct REQUEST_URI check instead of rewrite rules for reliability
 * on managed WordPress hosts (uPress). Hooks at priority -2000 to fire
 * before routing guards.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Serve the sitemap XML by checking REQUEST_URI directly.
 *
 * This fires at template_redirect priority -2000, well before routing
 * guards (-1000 and 0) that might force a 404 or homepage fallback.
 */
function justice_theme_serve_sitemap() {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}

	$request_uri = isset( $_SERVER['REQUEST_URI'] )
		? (string) wp_unslash( $_SERVER['REQUEST_URI'] )
		: '';

	$path = wp_parse_url( $request_uri, PHP_URL_PATH );

	if ( ! $path || ! preg_match( '#/justice-sitemap\.xml$#', $path ) ) {
		return;
	}

	header( 'Content-Type: application/xml; charset=UTF-8' );
	header( 'X-Robots-Tag: noindex' );
	header( 'Cache-Control: public, max-age=3600' );

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
		justice_theme_sitemap_url( $permalink, '0.7', 'monthly', $modified );
	}

	// Practice-area taxonomy archive pages.
	$practice_terms = get_terms( array(
		'taxonomy'   => 'practice-areas',
		'hide_empty' => true,
	) );

	if ( ! is_wp_error( $practice_terms ) ) {
		foreach ( $practice_terms as $term ) {
			$term_link = get_term_link( $term );
			if ( ! is_wp_error( $term_link ) ) {
				justice_theme_sitemap_url(
					$term_link,
					'0.7',
					'weekly'
				);
			}
		}
	}

	echo '</urlset>' . "\n";
	exit;
}
add_action( 'template_redirect', 'justice_theme_serve_sitemap', -2000 );

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
