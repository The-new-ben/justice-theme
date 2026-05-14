<?php
/**
 * Dynamic XML Sitemap for Jus-Tice.
 *
 * Serves the sitemap via two routes for maximum compatibility:
 *   1. REST API:  /wp-json/justice/v1/sitemap  (always works, bypasses nginx)
 *   2. Direct:    /justice-sitemap.xml  (if nginx allows .xml through to PHP)
 *
 * The canonical sitemap URL for robots.txt and GSC is the REST endpoint
 * because uPress nginx redirects .xml files to homepage.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the REST API sitemap endpoint.
 *
 * This is the primary sitemap delivery method because the uPress nginx
 * config 301-redirects .xml files to the homepage before PHP can handle them.
 */
function justice_theme_register_sitemap_rest_route() {
	register_rest_route( 'justice/v1', '/sitemap', array(
		'methods'             => 'GET',
		'callback'            => 'justice_theme_render_sitemap_xml',
		'permission_callback' => '__return_true',
	) );
}
add_action( 'rest_api_init', 'justice_theme_register_sitemap_rest_route' );

/**
 * Render the sitemap XML.
 *
 * @param WP_REST_Request $request Request object (unused but required by REST).
 * @return WP_REST_Response
 */
function justice_theme_render_sitemap_xml( $request = null ) {
	$xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
	$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

	// Homepage.
	$xml .= justice_theme_sitemap_url_entry( home_url( '/' ), '1.0', 'weekly' );

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
		$priority  = ( strlen( $article->post_content ) > 15000 ) ? '0.9' : '0.8';
		$xml .= justice_theme_sitemap_url_entry( $permalink, $priority, 'monthly', $modified );
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
		$xml .= justice_theme_sitemap_url_entry( $permalink, '0.6', 'monthly', $modified );
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
		$xml .= justice_theme_sitemap_url_entry( $permalink, '0.7', 'monthly', $modified );
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
				$xml .= justice_theme_sitemap_url_entry( $term_link, '0.7', 'weekly' );
			}
		}
	}

	$xml .= '</urlset>' . "\n";

	// Return as XML response.
	$response = new WP_REST_Response( null, 200 );
	$response->header( 'Content-Type', 'application/xml; charset=UTF-8' );
	$response->header( 'X-Robots-Tag', 'noindex' );
	$response->header( 'Cache-Control', 'public, max-age=3600' );

	// We need to output XML directly since WP_REST_Response JSON-encodes by default.
	header( 'Content-Type: application/xml; charset=UTF-8' );
	header( 'X-Robots-Tag: noindex' );
	header( 'Cache-Control: public, max-age=3600' );
	echo $xml;
	exit;
}

/**
 * Also try to serve at /justice-sitemap.xml via template_redirect.
 *
 * This is a fallback for servers that don't intercept .xml files.
 * On uPress, nginx 301-redirects .xml before this fires.
 */
function justice_theme_serve_sitemap_fallback() {
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

	justice_theme_render_sitemap_xml();
}
add_action( 'template_redirect', 'justice_theme_serve_sitemap_fallback', -2000 );

/**
 * Build a single URL entry string.
 *
 * @param string $loc        URL.
 * @param string $priority   Priority (0.0 - 1.0).
 * @param string $changefreq Change frequency.
 * @param string $lastmod    Last modification date (Y-m-d).
 * @return string
 */
function justice_theme_sitemap_url_entry( $loc, $priority = '0.5', $changefreq = 'monthly', $lastmod = '' ) {
	if ( empty( $lastmod ) ) {
		$lastmod = gmdate( 'Y-m-d' );
	}
	$loc = esc_url( function_exists( 'justice_theme_public_url' ) ? justice_theme_public_url( $loc ) : $loc );

	$entry  = '  <url>' . "\n";
	$entry .= '    <loc>' . $loc . '</loc>' . "\n";
	$entry .= '    <lastmod>' . esc_html( $lastmod ) . '</lastmod>' . "\n";
	$entry .= '    <changefreq>' . esc_html( $changefreq ) . '</changefreq>' . "\n";
	$entry .= '    <priority>' . esc_html( $priority ) . '</priority>' . "\n";
	$entry .= '  </url>' . "\n";

	return $entry;
}
