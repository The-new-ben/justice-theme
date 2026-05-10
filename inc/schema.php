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
			'item'     => ! empty( $item['url'] ) ? esc_url_raw( $item['url'] ) : esc_url_raw( get_permalink() ),
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
		'mainEntityOfPage' => esc_url_raw( get_permalink() ),
		'author'           => array(
			'@type' => 'Organization',
			'name'  => get_bloginfo( 'name' ),
			'url'   => home_url( '/' ),
		),
		'publisher'        => array(
			'@type' => 'Organization',
			'name'  => get_bloginfo( 'name' ),
			'url'   => home_url( '/' ),
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
 * WebSite schema on front page.
 */
function justice_theme_website_schema() {
	if ( ! is_front_page() ) {
		return;
	}

	justice_theme_print_schema( array(
		'@context'        => 'https://schema.org',
		'@type'           => 'WebSite',
		'name'            => get_bloginfo( 'name' ),
		'url'             => home_url( '/' ),
		'potentialAction' => array(
			'@type'       => 'SearchAction',
			'target'      => home_url( '/?s={search_term_string}' ),
			'query-input' => 'required name=search_term_string',
		),
	) );
}
add_action( 'wp_head', 'justice_theme_website_schema', 20 );

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
		'url'      => esc_url_raw( get_permalink( $post_id ) ),
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

