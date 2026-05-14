<?php
/**
 * Dynamic XML Sitemap for Jus-Tice.
 *
 * Serves a Google-compliant sitemap index via the REST API at:
 *   /wp-json/justice/v1/sitemap
 *
 * Sub-sitemaps are served at:
 *   /wp-json/justice/v1/sitemap/articles
 *   /wp-json/justice/v1/sitemap/pages
 *   /wp-json/justice/v1/sitemap/lawyers
 *   /wp-json/justice/v1/sitemap/taxonomies
 *
 * The uPress nginx config 301-redirects .xml files to the homepage before
 * PHP can handle them, so Yoast's standard sitemap_index.xml is unreachable.
 * This REST-based sitemap is the only delivery method that works.
 *
 * robots.txt points to: https://jus-tice.co.il/wp-json/justice/v1/sitemap
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register all sitemap REST API endpoints.
 */
function justice_theme_register_sitemap_rest_routes() {
	// Main sitemap index.
	register_rest_route( 'justice/v1', '/sitemap', array(
		'methods'             => 'GET',
		'callback'            => 'justice_theme_render_sitemap_index',
		'permission_callback' => '__return_true',
	) );

	// Sub-sitemaps.
	$sub_sitemaps = array( 'articles', 'pages', 'lawyers', 'taxonomies' );
	foreach ( $sub_sitemaps as $type ) {
		register_rest_route( 'justice/v1', '/sitemap/' . $type, array(
			'methods'             => 'GET',
			'callback'            => 'justice_theme_render_sitemap_' . $type,
			'permission_callback' => '__return_true',
		) );
	}
}
add_action( 'rest_api_init', 'justice_theme_register_sitemap_rest_routes' );

/**
 * Disable Yoast SEO's built-in XML sitemap.
 *
 * Yoast generates sitemaps at /sitemap_index.xml, /post-sitemap.xml, etc.
 * On uPress, nginx 301-redirects all .xml files to the homepage, making
 * Yoast's sitemaps unreachable. Additionally, the "All 404 Redirect to
 * Homepage" plugin intercepts Yoast's ?sitemap=1 query parameter.
 *
 * We disable Yoast's sitemap to prevent confusion and serve our own
 * REST-based sitemap that bypasses nginx entirely.
 */
add_filter( 'wpseo_sitemaps_enabled', '__return_false' );

/**
 * Also disable WordPress core sitemaps (/wp-sitemap.xml) to avoid duplicates.
 */
add_filter( 'wp_sitemaps_enabled', '__return_false' );

// ─────────────────────────────────────────────────
// Sitemap Index (root)
// ─────────────────────────────────────────────────

/**
 * Render the sitemap index XML.
 *
 * This is a proper <sitemapindex> that references sub-sitemaps,
 * conforming to the sitemaps.org protocol that GSC expects.
 */
function justice_theme_render_sitemap_index() {
	$base = justice_theme_sitemap_base_url();

	$xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
	$xml .= '<?xml-stylesheet type="text/xsl" href="' . esc_url( JUSTICE_THEME_URI . '/assets/sitemap.xsl' ) . '"?>' . "\n";
	$xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

	$sub_sitemaps = array(
		'articles'   => 'articles',
		'pages'      => 'pages',
		'lawyers'    => 'lawyers',
		'taxonomies' => 'taxonomies',
	);

	foreach ( $sub_sitemaps as $slug => $label ) {
		$xml .= '  <sitemap>' . "\n";
		$xml .= '    <loc>' . esc_url( $base . $slug ) . '</loc>' . "\n";
		$xml .= '    <lastmod>' . gmdate( 'Y-m-d\TH:i:s+00:00' ) . '</lastmod>' . "\n";
		$xml .= '  </sitemap>' . "\n";
	}

	$xml .= '</sitemapindex>' . "\n";

	justice_theme_output_sitemap_xml( $xml );
}

// ─────────────────────────────────────────────────
// Sub-sitemaps
// ─────────────────────────────────────────────────

/**
 * Render the articles sub-sitemap.
 */
function justice_theme_render_sitemap_articles() {
	$xml = justice_theme_sitemap_urlset_header();

	// Homepage as first entry.
	$xml .= justice_theme_sitemap_url_entry( home_url( '/' ), '1.0', 'weekly' );

	$articles = get_posts( array(
		'post_type'      => 'articles',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => 'modified',
		'order'          => 'DESC',
	) );

	foreach ( $articles as $article ) {
		$permalink = get_permalink( $article );
		$modified  = get_the_modified_date( 'Y-m-d\TH:i:s+00:00', $article );
		$priority  = ( strlen( $article->post_content ) > 15000 ) ? '0.9' : '0.8';
		$xml .= justice_theme_sitemap_url_entry( $permalink, $priority, 'monthly', $modified );
	}

	$xml .= '</urlset>' . "\n";
	justice_theme_output_sitemap_xml( $xml );
}

/**
 * Render the pages sub-sitemap.
 */
function justice_theme_render_sitemap_pages() {
	$xml = justice_theme_sitemap_urlset_header();

	$pages = get_posts( array(
		'post_type'      => 'page',
		'post_status'    => 'publish',
		'posts_per_page' => 500,
		'orderby'        => 'modified',
		'order'          => 'DESC',
	) );

	foreach ( $pages as $page ) {
		$permalink = get_permalink( $page );
		$modified  = get_the_modified_date( 'Y-m-d\TH:i:s+00:00', $page );
		$xml .= justice_theme_sitemap_url_entry( $permalink, '0.6', 'monthly', $modified );
	}

	$xml .= '</urlset>' . "\n";
	justice_theme_output_sitemap_xml( $xml );
}

/**
 * Render the lawyers sub-sitemap.
 */
function justice_theme_render_sitemap_lawyers() {
	$xml = justice_theme_sitemap_urlset_header();

	$lawyers = get_posts( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => 500,
		'orderby'        => 'modified',
		'order'          => 'DESC',
	) );

	foreach ( $lawyers as $lawyer ) {
		$permalink = get_permalink( $lawyer );
		$modified  = get_the_modified_date( 'Y-m-d\TH:i:s+00:00', $lawyer );
		$xml .= justice_theme_sitemap_url_entry( $permalink, '0.7', 'monthly', $modified );
	}

	$xml .= '</urlset>' . "\n";
	justice_theme_output_sitemap_xml( $xml );
}

/**
 * Render the taxonomies sub-sitemap.
 */
function justice_theme_render_sitemap_taxonomies() {
	$xml = justice_theme_sitemap_urlset_header();

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
	justice_theme_output_sitemap_xml( $xml );
}

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

/**
 * Get the base URL for sub-sitemaps.
 *
 * @return string
 */
function justice_theme_sitemap_base_url() {
	$url = home_url( '/wp-json/justice/v1/sitemap/' );
	if ( function_exists( 'justice_theme_normalize_public_url' ) ) {
		$url = justice_theme_normalize_public_url( $url );
	}
	return $url;
}

/**
 * Output the XML sitemap response and terminate.
 *
 * IMPORTANT: No X-Robots-Tag header — GSC rejects sitemaps with noindex.
 *
 * @param string $xml The XML content.
 */
function justice_theme_output_sitemap_xml( $xml ) {
	// WordPress REST API adds X-Robots-Tag: noindex to all /wp-json/ responses
	// via rest_output_noindex_header(). GSC rejects sitemaps with this header,
	// so we must explicitly strip it.
	header_remove( 'X-Robots-Tag' );

	header( 'Content-Type: application/xml; charset=UTF-8' );
	header( 'Cache-Control: public, max-age=3600' );
	echo $xml;
	exit;
}

/**
 * Get the standard urlset XML header.
 *
 * @return string
 */
function justice_theme_sitemap_urlset_header() {
	$xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
	$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
	return $xml;
}

/**
 * Build a single URL entry string.
 *
 * @param string $loc        URL.
 * @param string $priority   Priority (0.0 - 1.0).
 * @param string $changefreq Change frequency.
 * @param string $lastmod    Last modification date (ISO 8601).
 * @return string
 */
function justice_theme_sitemap_url_entry( $loc, $priority = '0.5', $changefreq = 'monthly', $lastmod = '' ) {
	if ( empty( $lastmod ) ) {
		$lastmod = gmdate( 'Y-m-d\TH:i:s+00:00' );
	}

	if ( function_exists( 'justice_theme_normalize_public_url' ) ) {
		$loc = justice_theme_normalize_public_url( $loc );
	}
	$loc = esc_url( $loc );

	$entry  = '  <url>' . "\n";
	$entry .= '    <loc>' . $loc . '</loc>' . "\n";
	$entry .= '    <lastmod>' . esc_html( $lastmod ) . '</lastmod>' . "\n";
	$entry .= '    <changefreq>' . esc_html( $changefreq ) . '</changefreq>' . "\n";
	$entry .= '    <priority>' . esc_html( $priority ) . '</priority>' . "\n";
	$entry .= '  </url>' . "\n";

	return $entry;
}
