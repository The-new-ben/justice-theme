<?php
/**
 * SEO helpers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Rank Math has been replaced by Yoast SEO as of May 2026.
 * The Rank Math noindex-header filter has been removed.
 * Yoast sitemap is disabled in inc/sitemap.php because uPress nginx
 * 301-redirects all .xml files to the homepage. Our REST API sitemap
 * at /wp-json/justice/v1/sitemap is the only delivery method.
 */

/**
 * Fix category_base collision with practice-areas taxonomy.
 *
 * Someone set the WordPress category_base to "practice-areas" in
 * Settings → Permalinks, which makes /practice-areas/criminal-law/
 * resolve to the WP "category" taxonomy instead of our custom
 * "practice-areas" taxonomy. This resets the base to "category".
 */
function justice_theme_fix_category_base_collision(): void {
	$current = get_option( 'category_base', '' );

	if ( 'practice-areas' === $current ) {
		update_option( 'category_base', 'category' );
		flush_rewrite_rules( false );
	}
}
add_action( 'init', 'justice_theme_fix_category_base_collision', 5 );

/**
 * REST endpoint to trigger the category_base fix manually.
 *
 * Usage: POST /wp-json/justice/v1/fix-category-base (with admin auth)
 */
function justice_theme_register_fix_category_base_endpoint(): void {
	register_rest_route( 'justice/v1', '/fix-category-base', array(
		'methods'             => 'POST',
		'callback'            => function () {
			$old = get_option( 'category_base', '' );
			update_option( 'category_base', 'category' );
			flush_rewrite_rules( false );
			$new = get_option( 'category_base', '' );

			return new WP_REST_Response( array(
				'old_value' => $old,
				'new_value' => $new,
				'flushed'   => true,
			), 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );
}
add_action( 'rest_api_init', 'justice_theme_register_fix_category_base_endpoint' );




/**
 * Normalize first-party public URLs for SEO tags.
 *
 * The live site has historical HTTP URL leakage in taxonomy/canonical/sitemap
 * surfaces. This does not perform redirects or migrations; it only keeps
 * theme-emitted canonical, hreflang and OG URLs on the public HTTPS origin.
 *
 * @param string $url Raw URL.
 * @return string
 */
function justice_theme_normalize_public_url( string $url ): string {
	$url = trim( $url );

	if ( '' === $url ) {
		return '';
	}

	$site_host = wp_parse_url( (string) get_option( 'home' ), PHP_URL_HOST );
	if ( ! $site_host ) {
		$site_host = wp_parse_url( (string) get_option( 'siteurl' ), PHP_URL_HOST );
	}

	$url_host  = wp_parse_url( $url, PHP_URL_HOST );

	if ( $site_host && $url_host && strtolower( $site_host ) === strtolower( $url_host ) ) {
		return set_url_scheme( $url, 'https' );
	}

	return $url;
}

/**
 * Normalize first-party URL values generated for public-facing frontend output.
 *
 * Admin screens are left alone so wp-admin/plugin configuration remains visible
 * exactly as stored. Public pages, REST responses and sitemap requests get the
 * HTTPS form of first-party URLs without changing database values or redirects.
 *
 * @param string $url Existing URL.
 * @return string
 */
function justice_theme_filter_frontend_public_url( $url ): string {
	if ( is_admin() && ! wp_doing_ajax() ) {
		return (string) $url;
	}

	return justice_theme_normalize_public_url( (string) $url );
}
add_filter( 'home_url', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'page_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'post_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'post_type_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'term_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'attachment_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'wp_get_attachment_url', 'justice_theme_filter_frontend_public_url', 20 );

/**
 * Normalize first-party attachment image arrays without changing media records.
 *
 * @param array|false $image Image tuple from wp_get_attachment_image_src().
 * @return array|false
 */
function justice_theme_filter_attachment_image_src( $image ) {
	if ( is_array( $image ) && ! empty( $image[0] ) ) {
		$image[0] = justice_theme_normalize_public_url( (string) $image[0] );
	}

	return $image;
}
add_filter( 'wp_get_attachment_image_src', 'justice_theme_filter_attachment_image_src', 20 );

/**
 * Normalize first-party srcset URLs in rendered media markup.
 *
 * @param array $sources Image source candidates.
 * @return array
 */
function justice_theme_filter_image_srcset_sources( array $sources ): array {
	foreach ( $sources as $width => $source ) {
		if ( is_array( $source ) && ! empty( $source['url'] ) ) {
			$sources[ $width ]['url'] = justice_theme_normalize_public_url( (string) $source['url'] );
		}
	}

	return $sources;
}
add_filter( 'wp_calculate_image_srcset', 'justice_theme_filter_image_srcset_sources', 20 );

/**
 * Normalize first-party HTTP URLs in public post content at render time.
 *
 * This intentionally leaves the database untouched. It only prevents old
 * embedded media/content URLs from being emitted as HTTP in public HTML.
 *
 * @param string $content Rendered post content.
 * @return string
 */
function justice_theme_normalize_public_content_urls( string $content ): string {
	if ( is_admin() && ! wp_doing_ajax() ) {
		return $content;
	}

	$site_host = wp_parse_url( (string) get_option( 'home' ), PHP_URL_HOST );
	if ( ! $site_host ) {
		$site_host = wp_parse_url( (string) get_option( 'siteurl' ), PHP_URL_HOST );
	}

	if ( '' === $content || ! $site_host ) {
		return $content;
	}

	$http_origin = 'http://' . $site_host;

	if ( false === strpos( $content, $http_origin ) ) {
		return $content;
	}

	return str_replace( $http_origin, 'https://' . $site_host, $content );
}
add_filter( 'the_content', 'justice_theme_normalize_public_content_urls', 999 );

/**
 * Map public lawyer-directory area aliases to the taxonomy slugs that exist now.
 *
 * The public URL strategy uses clean English aliases such as
 * /lawyers/?area=personal-injury-law, while the legacy taxonomy still contains
 * terms such as "torts". Keep titles aligned with the rendered directory H1
 * without changing URLs, terms, redirects or stored content.
 *
 * @param string $area_slug Raw public area filter.
 * @return string
 */
function justice_theme_lawyer_directory_area_taxonomy_slug( string $area_slug ): string {
	$area_slug = sanitize_title( str_replace( '_', '-', trim( strtolower( $area_slug ) ) ) );

	if ( '' === $area_slug ) {
		return '';
	}

	$alias_map = array(
		'family'                  => 'family-law',
		'criminal'                => 'criminal-law',
		'real-estate'             => 'real-estate-law',
		'labor'                   => 'labor-law',
		'employment'              => 'labor-law',
		'employment-law'          => 'labor-law',
		'traffic'                 => 'traffic-law',
		'tort'                    => 'torts',
		'torts'                   => 'torts',
		'personal-injury'         => 'torts',
		'personal-injury-law'     => 'torts',
		'medical'                 => 'medical-malpractice',
		'medical-malpractice'     => 'medical-malpractice',
		'medical-malpractice-law' => 'medical-malpractice',
		'inheritance'             => 'inheritance-law',
		'cyber'                   => 'cyber-law',
		'privacy'                 => 'cyber-law',
		'cyber-law'               => 'cyber-law',
		'cyber-privacy'           => 'cyber-law',
		'privacy-cyber'           => 'cyber-law',
		'privacy-cyber-law'       => 'cyber-law',
		'tax'                     => 'tax-law',
	);

	return $alias_map[ $area_slug ] ?? $area_slug;
}

/**
 * Resolve a lawyer-directory area filter to a practice-area term.
 *
 * @param string $area_slug Raw public area filter.
 * @return WP_Term|false
 */
function justice_theme_lawyer_directory_area_term( string $area_slug ) {
	$taxonomy_slug = justice_theme_lawyer_directory_area_taxonomy_slug( $area_slug );

	if ( '' === $taxonomy_slug ) {
		return false;
	}

	return get_term_by( 'slug', $taxonomy_slug, 'practice-areas' );
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

	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		$title = __( 'מדריך עורכי דין בישראל', 'justice-theme' );
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

/**
 * Include articles CPT in practice-areas taxonomy archives.
 *
 * WordPress default taxonomy archives only query 'post' type. Our legal
 * content lives in the 'articles' CPT, so we must add it here or the
 * taxonomy-practice-areas.php template shows "no results".
 *
 * @param WP_Query $query Query object.
 */
function justice_theme_include_articles_in_practice_area_archive( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	if ( $query->is_tax( 'practice-areas' ) ) {
		$query->set( 'post_type', array( 'post', 'articles' ) );
	}
}
add_action( 'pre_get_posts', 'justice_theme_include_articles_in_practice_area_archive' );

/**
 * Build the public-facing SEO title for the current request.
 *
 * Shared by WordPress core title parts and common SEO plugin filters so archive
 * and search pages do not leak English defaults such as "Archive" or
 * "You searched for".
 *
 * @return string
 */
function justice_theme_contextual_seo_title(): string {
	if ( is_front_page() ) {
		return 'עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ';
	}

	if ( is_post_type_archive( 'articles' ) || is_page( 'articles' ) ) {
		return 'מאמרים משפטיים לפי הבעיה שלכם | Jus-Tice';
	}

	if ( is_search() ) {
		$query = trim( get_search_query() );

		return $query
			? sprintf( 'תוצאות חיפוש עבור: %s | Jus-Tice', $query )
			: 'חיפוש באתר | Jus-Tice';
	}

	if ( is_post_type_archive( 'justice_lawyer' ) || is_page( 'lawyers' ) ) {
		$city_slug = isset( $_GET['city'] ) ? sanitize_text_field( wp_unslash( $_GET['city'] ) ) : '';
		$area_slug = isset( $_GET['area'] ) ? sanitize_text_field( wp_unslash( $_GET['area'] ) ) : '';

		if ( $city_slug ) {
			$city_t = get_term_by( 'slug', $city_slug, 'city' );
			if ( $area_slug ) {
				$area_t = justice_theme_lawyer_directory_area_term( $area_slug );

				return 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' ב' . ( $city_t ? $city_t->name : '' ) . ' | Jus-Tice';
			}

			return 'עורכי דין ב' . ( $city_t ? $city_t->name : '' ) . ' | Jus-Tice';
		}

		if ( $area_slug ) {
			$area_t = justice_theme_lawyer_directory_area_term( $area_slug );

			return 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' | מצאו עורך דין מתאים';
		}

		return 'מדריך עורכי דין בישראל | Jus-Tice';
	}

	if ( is_tax( 'practice-areas' ) ) {
		$term = get_queried_object();
		if ( $term ) {
			return 'עורך דין ' . $term->name . ' | מדריך, מאמרים ועורכי דין';
		}
	}

	if ( is_singular( 'justice_lawyer' ) ) {
		$areas = get_the_terms( get_the_ID(), 'practice-areas' );
		$cities = get_the_terms( get_the_ID(), 'city' );
		$suffix = '';
		if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) {
			$suffix .= ' | ' . $areas[0]->name;
		}
		if ( ! empty( $cities ) && ! is_wp_error( $cities ) ) {
			$suffix .= ' ב' . $cities[0]->name;
		}

		return get_the_title() . $suffix;
	}

	return '';
}

/**
 * Override document title for SEO.
 *
 * The homepage title MUST contain "עורכי דין" — this is the #1 money keyword.
 * Every competitor (din.co.il, PsakDin, LawReviews) front-loads this term.
 *
 * @param array $title_parts Title parts.
 * @return array
 */
function justice_theme_document_title( $title_parts ) {
	if ( is_singular() ) {
		$custom_title = get_post_meta( get_the_ID(), 'seo_title', true );
		if ( $custom_title ) {
			$title_parts['title']   = wp_strip_all_tags( $custom_title );
			$title_parts['tagline'] = '';
			$title_parts['site']    = '';

			return $title_parts;
		}
	}

	$contextual_title = justice_theme_contextual_seo_title();
	if ( $contextual_title ) {
		$title_parts['title']   = $contextual_title;
		$title_parts['tagline'] = '';
		$title_parts['site']    = '';

		return $title_parts;
	}

	if ( is_front_page() ) {
		$title_parts['title'] = 'עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ';
		$title_parts['tagline'] = '';
	}

	if ( is_tax( 'practice-areas' ) ) {
		$term = get_queried_object();
		if ( $term ) {
			$title_parts['title'] = 'עורך דין ' . $term->name . ' | מדריך, מאמרים ועורכי דין מומחים';
		}
	}

	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		$city_slug = isset( $_GET['city'] ) ? sanitize_text_field( $_GET['city'] ) : '';
		$area_slug = isset( $_GET['area'] ) ? sanitize_text_field( $_GET['area'] ) : '';
		if ( $city_slug ) {
			$city_t = get_term_by( 'slug', $city_slug, 'city' );
			if ( $area_slug ) {
				$area_t = justice_theme_lawyer_directory_area_term( $area_slug );
				$title_parts['title'] = 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' ב' . ( $city_t ? $city_t->name : '' ) . ' | Jus-Tice';
			} else {
				$title_parts['title'] = 'עורכי דין ב' . ( $city_t ? $city_t->name : '' ) . ' | מדריך עורכי דין';
			}
		} elseif ( $area_slug ) {
			$area_t = justice_theme_lawyer_directory_area_term( $area_slug );
			$title_parts['title'] = 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' | מצאו עורך דין מומחה';
		} else {
			$title_parts['title'] = 'מדריך עורכי דין בישראל | Jus-Tice';
		}
		$title_parts['tagline'] = '';
	}

	if ( is_singular( 'justice_lawyer' ) ) {
		$areas = get_the_terms( get_the_ID(), 'practice-areas' );
		$cities = get_the_terms( get_the_ID(), 'city' );
		$suffix = '';
		if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) {
			$suffix .= ' | ' . $areas[0]->name;
		}
		if ( ! empty( $cities ) && ! is_wp_error( $cities ) ) {
			$suffix .= ' ב' . $cities[0]->name;
		}
		$title_parts['title'] = get_the_title() . $suffix;
	}

	return $title_parts;
}
add_filter( 'document_title_parts', 'justice_theme_document_title' );

/**
 * Keep common SEO plugins aligned with repo-published page meta.
 *
 * @param string $title Existing title.
 * @return string
 */
function justice_theme_filter_plugin_seo_title( $title ) {
	if ( is_singular() ) {
		$custom_title = get_post_meta( get_the_ID(), 'seo_title', true );
		if ( $custom_title ) {
			return wp_strip_all_tags( $custom_title );
		}
	}

	$contextual_title = justice_theme_contextual_seo_title();
	if ( $contextual_title ) {
		return wp_strip_all_tags( $contextual_title );
	}

	return $title;
}
add_filter( 'wpseo_title', 'justice_theme_filter_plugin_seo_title' );
add_filter( 'aioseo_title', 'justice_theme_filter_plugin_seo_title' );

/**
 * Keep common SEO plugins aligned with repo-published meta descriptions.
 *
 * @param string $description Existing description.
 * @return string
 */
function justice_theme_filter_plugin_seo_description( $description ) {
	if ( is_singular() ) {
		$custom_description = get_post_meta( get_the_ID(), 'seo_description', true );
		if ( $custom_description ) {
			return wp_strip_all_tags( $custom_description );
		}
	}

	return $description;
}
add_filter( 'wpseo_metadesc', 'justice_theme_filter_plugin_seo_description' );
add_filter( 'aioseo_description', 'justice_theme_filter_plugin_seo_description' );

/**
 * Output custom Justice meta tags that Yoast SEO does not handle.
 *
 * Standard SEO meta tags (description, OG, canonical) are now handled
 * exclusively by Yoast SEO. This function only outputs:
 *   - justice:aeo-summary  — AI Engine Optimization summary
 *   - justice:geo-summary  — Geographic relevance summary
 *
 * @since 1.0.6  Stripped duplicate meta/OG/canonical output (Yoast migration).
 */
function justice_theme_meta_head() {
	if ( ! is_singular() ) {
		return;
	}

	$post_id = get_the_ID();
	if ( ! $post_id ) {
		return;
	}

	$aeo_summary = get_post_meta( $post_id, 'aeo_summary', true );
	$geo_summary = get_post_meta( $post_id, 'geo_summary', true );

	if ( $aeo_summary ) {
		echo '<meta name="justice:aeo-summary" content="' . esc_attr( $aeo_summary ) . '">' . "\n";
	}
	if ( $geo_summary ) {
		echo '<meta name="justice:geo-summary" content="' . esc_attr( $geo_summary ) . '">' . "\n";
	}
}
add_action( 'wp_head', 'justice_theme_meta_head', 1 );




/**
 * Get the canonical lawyer-directory URL.
 *
 * @return string
 */
function justice_theme_lawyer_archive_canonical_url(): string {
	$archive = get_post_type_archive_link( 'justice_lawyer' );

	return justice_theme_normalize_public_url( $archive ? (string) $archive : home_url( '/lawyers/' ) );
}

/**
 * Detect filtered lawyer-directory states even when the live site serves the
 * directory through a page route instead of a pure post-type archive query.
 *
 * @return bool
 */
function justice_theme_is_lawyer_directory_filter_state(): bool {
	$filter_keys = array( 'area', 'city', 'keyword' );
	$has_filter  = (bool) array_intersect( $filter_keys, array_keys( $_GET ) );

	if ( ! $has_filter ) {
		return false;
	}

	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';

	return is_post_type_archive( 'justice_lawyer' )
		|| is_page( 'lawyers' )
		|| false !== strpos( $request_uri, '/lawyers/' );
}

/**
 * Output one canonical URL for public templates that WordPress core does not cover well.
 */
function justice_theme_canonical_url() {
	if ( is_admin() || is_404() ) {
		return;
	}

	$canonical = '';

	if ( is_singular() ) {
		return;
	} elseif ( is_front_page() ) {
		$canonical = home_url( '/' );
	} elseif ( justice_theme_is_lawyer_directory_filter_state() ) {
		$canonical = justice_theme_lawyer_archive_canonical_url();
	} elseif ( is_post_type_archive( 'justice_lawyer' ) ) {
		$canonical = justice_theme_lawyer_archive_canonical_url();
	} elseif ( is_post_type_archive( 'articles' ) ) {
		$canonical = get_post_type_archive_link( 'articles' );
	} elseif ( is_tax() || is_category() || is_tag() ) {
		$term = get_queried_object();
		if ( $term && ! is_wp_error( $term ) ) {
			$canonical = get_term_link( $term );
		}
	} elseif ( is_search() ) {
		$canonical = home_url( '/' );
	}

	if ( $canonical && ! is_wp_error( $canonical ) ) {
		echo '<link rel="canonical" href="' . esc_url( justice_theme_normalize_public_url( (string) $canonical ) ) . '">' . "\n";
	}
}
add_action( 'wp_head', 'justice_theme_canonical_url', 5 );

/**
 * Resolve the canonical public URL for language alternate tags.
 *
 * @return string
 */
function justice_theme_hreflang_url(): string {
	if ( is_admin() || is_404() || is_search() || justice_theme_is_lawyer_directory_filter_state() ) {
		return '';
	}

	if ( is_singular() ) {
		return justice_theme_normalize_public_url( (string) get_permalink() );
	}

	if ( is_front_page() ) {
		return justice_theme_normalize_public_url( home_url( '/' ) );
	}

	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		return justice_theme_lawyer_archive_canonical_url();
	}

	if ( is_post_type_archive( 'articles' ) ) {
		$archive = get_post_type_archive_link( 'articles' );

		return $archive ? justice_theme_normalize_public_url( (string) $archive ) : '';
	}

	if ( is_tax() || is_category() || is_tag() ) {
		$term = get_queried_object();
		if ( $term && ! is_wp_error( $term ) ) {
			$link = get_term_link( $term );

			return is_wp_error( $link ) ? '' : justice_theme_normalize_public_url( (string) $link );
		}
	}

	return '';
}

/**
 * Declare the Hebrew-first language target for public canonical URLs.
 */
function justice_theme_hreflang_alternates(): void {
	$url = justice_theme_hreflang_url();

	if ( ! $url ) {
		return;
	}

	echo '<link rel="alternate" hreflang="he" href="' . esc_url( $url ) . '">' . "\n";
	echo '<link rel="alternate" hreflang="x-default" href="' . esc_url( $url ) . '">' . "\n";
}
add_action( 'wp_head', 'justice_theme_hreflang_alternates', 6 );

/**
 * Noindex thin search/filter states while preserving link discovery.
 *
 * @param array $robots Robots directives.
 * @return array
 */
function justice_theme_filter_robots( $robots ) {
	if ( is_search() || justice_theme_is_lawyer_directory_filter_state() ) {
		$robots['noindex'] = true;
		$robots['follow']  = true;
	}

	return $robots;
}
add_filter( 'wp_robots', 'justice_theme_filter_robots' );

/**
 * Keep common SEO plugins aligned with the filtered-directory rule.
 *
 * @param string $robots Robots directive string.
 * @return string
 */
function justice_theme_filter_yoast_robots( $robots ) {
	if ( justice_theme_is_lawyer_directory_filter_state() ) {
		return 'noindex, follow';
	}

	return $robots;
}
add_filter( 'wpseo_robots', 'justice_theme_filter_yoast_robots' );

/* Rank Math robots filter removed — Yoast SEO is now active. */

/**
 * Override SEO-plugin canonical output for filtered lawyer-directory states.
 *
 * @param string $canonical Canonical URL.
 * @return string
 */
function justice_theme_filter_directory_canonical( $canonical ) {
	if ( justice_theme_is_lawyer_directory_filter_state() ) {
		return justice_theme_lawyer_archive_canonical_url();
	}

	return justice_theme_normalize_public_url( (string) $canonical );
}
add_filter( 'wpseo_canonical', 'justice_theme_filter_directory_canonical' );
add_filter( 'aioseo_canonical_url', 'justice_theme_filter_directory_canonical' );

/**
 * Ensure robots.txt references our REST API sitemap.
 *
 * On uPress, nginx 301-redirects all .xml files to the homepage.
 * Yoast's sitemap_index.xml and WordPress core's wp-sitemap.xml
 * are both unreachable. Our REST API endpoint is the only working
 * sitemap delivery method.
 *
 * GSC fully supports REST API endpoints as sitemap URLs.
 *
 * @param string $output Robots.txt output.
 * @param bool   $public Whether search engines are allowed.
 * @return string
 */
function justice_theme_robots_sitemap_directive( string $output, bool $public ): string {
	if ( ! $public ) {
		return $output;
	}

	// Our REST API sitemap is the only one that works on uPress.
	$correct_sitemap = justice_theme_normalize_public_url(
		home_url( '/wp-json/justice/v1/sitemap' )
	);

	// Remove any stale sitemap references (old .xml paths).
	$stale_patterns = array(
		'sitemap_index.xml',
		'sitemap.xml',
		'justice-sitemap.xml',
		'wp-sitemap.xml',
	);
	foreach ( $stale_patterns as $stale ) {
		$output = preg_replace( '/Sitemap:\s*[^\n]*' . preg_quote( $stale, '/' ) . '[^\n]*\n?/i', '', $output );
	}

	// Don't duplicate if already present.
	if ( false !== stripos( $output, 'justice/v1/sitemap' ) ) {
		return $output;
	}

	$output = rtrim( $output );
	$output .= ( '' === $output ? '' : "\n" ) . 'Sitemap: ' . $correct_sitemap . "\n";

	return $output;
}
add_filter( 'robots_txt', 'justice_theme_robots_sitemap_directive', 9999, 2 );

/**
 * Normalize a sitemap entry array without changing non-URL metadata.
 *
 * @param mixed $entry Sitemap entry.
 * @return mixed
 */
function justice_theme_normalize_sitemap_entry_loc( $entry ) {
	if ( is_array( $entry ) && ! empty( $entry['loc'] ) ) {
		$entry['loc'] = justice_theme_normalize_public_url( (string) $entry['loc'] );
	}

	return $entry;
}

/**
 * Normalize first-party URL strings in plugin sitemap callbacks.
 *
 * @param mixed $url Sitemap URL.
 * @return string
 */
function justice_theme_normalize_sitemap_url_string( $url ): string {
	return justice_theme_normalize_public_url( (string) $url );
}

/**
 * Normalize image items emitted in Rank Math XML sitemaps.
 *
 * Rank Math exposes image sitemap callbacks separately from the page loc
 * callbacks, so media URLs need their own render-only normalization.
 *
 * @param mixed $images Image item list.
 * @return mixed
 */
function justice_theme_normalize_sitemap_image_items( $images ) {
	if ( is_string( $images ) ) {
		return justice_theme_normalize_public_url( $images );
	}

	if ( ! is_array( $images ) ) {
		return $images;
	}

	foreach ( $images as $key => $image ) {
		if ( is_string( $image ) ) {
			$images[ $key ] = justice_theme_normalize_public_url( $image );
			continue;
		}

		if ( ! is_array( $image ) ) {
			continue;
		}

		foreach ( array( 'src', 'loc', 'url' ) as $url_key ) {
			if ( ! empty( $image[ $url_key ] ) ) {
				$image[ $url_key ] = justice_theme_normalize_public_url( (string) $image[ $url_key ] );
			}
		}

		$images[ $key ] = $image;
	}

	return $images;
}

/**
 * Normalize WordPress core sitemap entries if core sitemaps are active.
 *
 * The live sitemap currently appears plugin-controlled, so this is a safe
 * fallback only. Plugin sitemap settings still require wp-admin/uPress review.
 *
 * @param array $entry Sitemap entry.
 * @return array
 */
function justice_theme_normalize_core_sitemap_entry( array $entry ): array {
	return justice_theme_normalize_sitemap_entry_loc( $entry );
}
add_filter( 'wp_sitemaps_posts_entry', 'justice_theme_normalize_core_sitemap_entry' );
add_filter( 'wp_sitemaps_taxonomies_entry', 'justice_theme_normalize_core_sitemap_entry' );
add_filter( 'wp_sitemaps_users_entry', 'justice_theme_normalize_core_sitemap_entry' );

/**
 * Normalize SEO-plugin sitemap URL entries to the public HTTPS origin.
 *
 * Yoast sitemap is disabled on this site (uPress nginx blocks .xml),
 * but these hooks remain as safety nets. Rank Math hooks removed.
 */
add_filter( 'wpseo_xml_sitemap_post_url', 'justice_theme_normalize_sitemap_url_string', 20 );
add_filter( 'wpseo_xml_sitemap_term_url', 'justice_theme_normalize_sitemap_url_string', 20 );
add_filter( 'wpseo_sitemap_entry', 'justice_theme_normalize_sitemap_entry_loc', 20 );
add_filter( 'aioseo_sitemap_indexes', 'justice_theme_normalize_aioseo_sitemap_indexes', 20 );

/**
 * Normalize AIOSEO sitemap index locations.
 *
 * @param mixed $indexes Sitemap indexes.
 * @return mixed
 */
function justice_theme_normalize_aioseo_sitemap_indexes( $indexes ) {
	if ( ! is_array( $indexes ) ) {
		return $indexes;
	}

	foreach ( $indexes as $key => $index ) {
		$indexes[ $key ] = justice_theme_normalize_sitemap_entry_loc( $index );
	}

	return $indexes;
}

/**
 * Fallback robots tag for unknown SEO stacks. This makes filtered directory
 * states visibly noindex even when another plugin does not use WordPress robots.
 */
function justice_theme_filter_directory_robots_meta(): void {
	if ( ! justice_theme_is_lawyer_directory_filter_state() ) {
		return;
	}

	echo '<meta name="robots" content="noindex,follow" data-justice-theme="filtered-directory">' . "\n";
}
add_action( 'wp_head', 'justice_theme_filter_directory_robots_meta', 0 );

/**
 * Provide branded fallback icon links when no WordPress Site Icon is set.
 *
 * WordPress outputs the selected Site Icon automatically when it exists, so the
 * favicon fallback stays out of the way of the admin-controlled source.
 */
function justice_theme_fallback_site_icon(): void {
	if ( has_site_icon() ) {
		return;
	}

	$theme_uri = JUSTICE_THEME_URI . '/assets/images';

	echo '<link rel="icon" href="' . esc_url( $theme_uri . '/favicon.ico' ) . '" sizes="any">' . "\n";
	echo '<link rel="icon" href="' . esc_url( $theme_uri . '/favicon.svg' ) . '" type="image/svg+xml">' . "\n";
	echo '<link rel="icon" href="' . esc_url( $theme_uri . '/favicon-512.png' ) . '" type="image/png" sizes="512x512">' . "\n";
	echo '<link rel="apple-touch-icon" href="' . esc_url( $theme_uri . '/apple-touch-icon.png' ) . '" sizes="180x180">' . "\n";
}
add_action( 'wp_head', 'justice_theme_fallback_site_icon', 2 );

/**
 * Expose a stable mobile app manifest when the admin icon stack is absent.
 */
function justice_theme_brand_manifest_link(): void {
	if ( has_site_icon() ) {
		return;
	}

	echo '<link rel="manifest" href="' . esc_url( JUSTICE_THEME_URI . '/assets/images/site.webmanifest' ) . '">' . "\n";
}
add_action( 'wp_head', 'justice_theme_brand_manifest_link', 3 );
