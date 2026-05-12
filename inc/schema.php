<?php
/**
 * Schema.org structured data helpers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Print JSON-LD safely.
 *
 * @param array $schema Schema data.
 */
function justice_theme_print_schema( $schema ) {
	if ( empty( $schema ) || ! is_array( $schema ) ) {
		return;
	}
	echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
}

/**
 * Print breadcrumb schema.
 *
 * @param array $items Breadcrumb items.
 */
function justice_theme_print_breadcrumb_schema( $items ) {
	$list_items = array();

	foreach ( $items as $index => $item ) {
		$list_items[] = array(
			'@type'    => 'ListItem',
			'position' => $index + 1,
			'name'     => wp_strip_all_tags( $item['name'] ),
			'item'     => ! empty( $item['url'] ) ? esc_url_raw( justice_theme_public_url( (string) $item['url'] ) ) : esc_url_raw( justice_theme_public_permalink( get_the_ID() ) ),
		);
	}

	justice_theme_print_schema( array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => $list_items,
	) );
}

/**
 * Article schema on singular pages.
 */
function justice_theme_article_schema() {
	$is_repo_cluster_page = is_page() && get_post_meta( get_the_ID(), 'content_status', true );
	if ( ! is_singular( array( 'post', 'articles' ) ) && ! $is_repo_cluster_page ) {
		return;
	}

	global $post;

	$schema = array(
		'@context'         => 'https://schema.org',
		'@type'            => 'Article',
		'headline'         => wp_strip_all_tags( get_the_title() ),
		'datePublished'    => get_the_date( DATE_W3C ),
		'dateModified'     => get_the_modified_date( DATE_W3C ),
		'mainEntityOfPage' => esc_url_raw( justice_theme_public_permalink( get_the_ID() ) ),
		'author'           => array(
			'@type' => 'Organization',
			'name'  => get_bloginfo( 'name' ),
			'url'   => justice_theme_public_url( home_url( '/' ) ),
		),
		'publisher'        => array(
			'@type' => 'Organization',
			'name'  => get_bloginfo( 'name' ),
			'url'   => justice_theme_public_url( home_url( '/' ) ),
		),
	);

	$description = get_post_meta( get_the_ID(), 'seo_description', true );
	$keywords    = get_post_meta( get_the_ID(), 'secondary_keywords', true );
	if ( $description ) {
		$schema['description'] = wp_strip_all_tags( $description );
	}
	if ( $keywords ) {
		$schema['keywords'] = wp_strip_all_tags( $keywords );
	}

	if ( has_post_thumbnail( $post ) ) {
		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post ), 'full' );
		if ( ! empty( $image[0] ) ) {
			$schema['image'] = esc_url_raw( $image[0] );
		}
	}

	justice_theme_print_schema( $schema );
}
add_action( 'wp_head', 'justice_theme_article_schema', 20 );

/**
 * Resolve a public lawyer-directory search URL template for SearchAction.
 */
function justice_theme_search_action_target() {
	$archive = get_post_type_archive_link( 'justice_lawyer' );
	$base    = $archive ? $archive : home_url( '/lawyers/' );

	return add_query_arg( 'keyword', '{search_term_string}', $base );
}

/**
 * WebSite schema on front page — includes SearchAction sitelinks search box.
 */
function justice_theme_website_schema() {
	if ( ! is_front_page() ) {
		return;
	}

	$home   = justice_theme_public_url( home_url( '/' ) );
	$target = justice_theme_search_action_target();

	justice_theme_print_schema( array(
		'@context'        => 'https://schema.org',
		'@type'           => 'WebSite',
		'@id'             => trailingslashit( $home ) . '#website',
		'name'            => get_bloginfo( 'name' ),
		'alternateName'   => 'Jus-Tice',
		'url'             => $home,
		'inLanguage'      => 'he-IL',
		'description'     => get_bloginfo( 'description' ),
		'publisher'       => array(
			'@id' => trailingslashit( $home ) . '#organization',
		),
		'potentialAction' => array(
			'@type'       => 'SearchAction',
			'target'      => array(
				'@type'       => 'EntryPoint',
				'urlTemplate' => esc_url_raw( $target ),
			),
			'query-input' => 'required name=search_term_string',
		),
	) );
}
add_action( 'wp_head', 'justice_theme_website_schema', 20 );

/**
 * Organization schema on front page — establishes site identity for Google
 * Knowledge Graph + AI engines.
 */
function justice_theme_organization_schema() {
	if ( ! is_front_page() ) {
		return;
	}

	$home  = justice_theme_public_url( home_url( '/' ) );
	$phone = function_exists( 'justice_theme_mod' ) ? justice_theme_mod( 'justice_phone', '03-6161535' ) : '03-6161535';

	$same_as = array_values( array_filter( array(
		function_exists( 'justice_theme_mod' ) ? justice_theme_mod( 'justice_facebook_url', '' ) : '',
		function_exists( 'justice_theme_mod' ) ? justice_theme_mod( 'justice_linkedin_url', '' ) : '',
		function_exists( 'justice_theme_mod' ) ? justice_theme_mod( 'justice_youtube_url', '' ) : '',
	) ) );

	$logo_id  = get_theme_mod( 'custom_logo' );
	$logo_url = $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : JUSTICE_THEME_URI . '/assets/images/favicon-gen.png';

	$schema = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'Organization',
		'@id'         => trailingslashit( $home ) . '#organization',
		'name'        => get_bloginfo( 'name' ),
		'alternateName' => 'Jus-Tice',
		'url'         => $home,
		'logo'        => array(
			'@type' => 'ImageObject',
			'url'   => esc_url_raw( $logo_url ),
		),
		'inLanguage'  => 'he-IL',
		'description' => __( 'פורטל משפטי ישראלי — חיפוש עורכי דין לפי תחום ומיקום, מאמרים ומדריכים מקצועיים.', 'justice-theme' ),
		'areaServed'  => array(
			'@type' => 'Country',
			'name'  => 'Israel',
		),
	);

	if ( $phone ) {
		$schema['contactPoint'] = array(
			array(
				'@type'             => 'ContactPoint',
				'telephone'         => $phone,
				'contactType'       => 'customer service',
				'areaServed'        => 'IL',
				'availableLanguage' => array( 'Hebrew', 'English' ),
			),
		);
	}

	if ( ! empty( $same_as ) ) {
		$schema['sameAs'] = $same_as;
	}

	justice_theme_print_schema( $schema );
}
add_action( 'wp_head', 'justice_theme_organization_schema', 21 );

/**
 * ItemList schema for featured practice areas on the homepage.
 *
 * Helps Google + AI engines understand the topical structure of the portal.
 */
function justice_theme_homepage_itemlist_schema() {
	if ( ! is_front_page() ) {
		return;
	}

	$terms = get_terms( array(
		'taxonomy'   => 'practice-areas',
		'hide_empty' => false,
		'number'     => 12,
		'orderby'    => 'count',
		'order'      => 'DESC',
	) );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return;
	}

	$items = array();
	$pos   = 1;
	foreach ( $terms as $term ) {
		$items[] = array(
			'@type'    => 'ListItem',
			'position' => $pos,
			'url'      => esc_url_raw( get_term_link( $term ) ),
			'name'     => wp_strip_all_tags( $term->name ),
		);
		$pos++;
	}

	justice_theme_print_schema( array(
		'@context'        => 'https://schema.org',
		'@type'           => 'ItemList',
		'name'            => __( 'תחומי משפט — Jus-Tice', 'justice-theme' ),
		'itemListElement' => $items,
	) );
}
add_action( 'wp_head', 'justice_theme_homepage_itemlist_schema', 22 );

/**
 * Attorney schema for lawyer mini-site pages.
 */
function justice_theme_lawyer_schema() {
	if ( ! is_singular( 'justice_lawyer' ) ) {
		return;
	}

	$post_id = get_the_ID();
	$phone   = get_post_meta( $post_id, 'phone', true );
	$phone   = function_exists( 'justice_theme_lawyer_public_phone_value' ) ? justice_theme_lawyer_public_phone_value( (string) $phone ) : $phone;
	$email   = get_post_meta( $post_id, 'email', true );
	$website = get_post_meta( $post_id, 'website', true );
	$firm    = get_post_meta( $post_id, 'firm_name', true );
	$address = get_post_meta( $post_id, 'office_address', true );
	$areas   = get_the_terms( $post_id, 'practice-areas' );
	$cities  = get_the_terms( $post_id, 'city' );

	$schema = array(
		'@context' => 'https://schema.org',
		'@type'    => 'Attorney',
		'name'     => wp_strip_all_tags( get_the_title( $post_id ) ),
		'url'      => esc_url_raw( justice_theme_public_permalink( $post_id ) ),
	);

	if ( $firm ) {
		$schema['worksFor'] = array(
			'@type' => 'LegalService',
			'name'  => wp_strip_all_tags( $firm ),
		);
	}

	if ( $phone ) {
		$schema['telephone'] = wp_strip_all_tags( $phone );
	}

	if ( $email && is_email( $email ) ) {
		$schema['email'] = sanitize_email( $email );
	}

	if ( $website ) {
		$schema['sameAs'] = array( esc_url_raw( $website ) );
	}

	if ( $address ) {
		$schema['address'] = array(
			'@type'          => 'PostalAddress',
			'streetAddress'  => wp_strip_all_tags( $address ),
			'addressCountry' => 'IL',
		);
	}

	if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) {
		$schema['knowsAbout'] = array_values( wp_list_pluck( $areas, 'name' ) );
	}

	if ( ! empty( $cities ) && ! is_wp_error( $cities ) ) {
		$schema['areaServed'] = array_map(
			static function ( $city ) {
				return array(
					'@type' => 'City',
					'name'  => $city->name,
				);
			},
			array_values( $cities )
		);
	}

	if ( has_post_thumbnail( $post_id ) ) {
		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'full' );
		if ( ! empty( $image[0] ) ) {
			$schema['image'] = esc_url_raw( $image[0] );
		}
	}

	justice_theme_print_schema( $schema );
}
add_action( 'wp_head', 'justice_theme_lawyer_schema', 20 );

