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
	if ( ! is_singular( array( 'post', 'articles' ) ) ) {
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
 * Attorney schema on lawyer profile (Schema.org Attorney inherits from
 * LegalService → LocalBusiness → Organization). Only emitted when we have
 * the minimum required fields.
 */
function justice_theme_attorney_schema() {
	if ( ! is_singular( 'justice_lawyer' ) ) {
		return;
	}

	global $post;
	$id = $post->ID;

	$firm    = get_post_meta( $id, 'firm_name', true );
	$phone   = get_post_meta( $id, 'phone', true );
	$email   = get_post_meta( $id, 'email', true );
	$website = get_post_meta( $id, 'website', true );
	$bar     = get_post_meta( $id, 'bar_number', true );
	$address = get_post_meta( $id, 'office_address', true );
	$bio     = get_post_meta( $id, 'bio_short', true );
	$years   = get_post_meta( $id, 'years_experience', true );
	$langs   = get_post_meta( $id, 'languages', true );
	$cities  = get_the_terms( $id, 'city' );
	$areas   = get_the_terms( $id, 'practice-areas' );

	$schema = array(
		'@context' => 'https://schema.org',
		'@type'    => 'Attorney',
		'name'     => get_the_title(),
		'url'      => get_permalink(),
	);

	if ( $bio ) {
		$schema['description'] = wp_strip_all_tags( $bio );
	}
	if ( has_post_thumbnail( $post ) ) {
		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post ), 'full' );
		if ( ! empty( $image[0] ) ) {
			$schema['image'] = esc_url_raw( $image[0] );
		}
	}
	if ( $firm ) {
		$schema['worksFor'] = array(
			'@type' => 'Organization',
			'name'  => $firm,
		);
	}
	if ( $phone ) {
		$schema['telephone'] = $phone;
	}
	if ( $email ) {
		$schema['email'] = $email;
	}
	if ( $website ) {
		$schema['sameAs'] = array( $website );
	}
	if ( $address ) {
		$schema['address'] = array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => $address,
			'addressCountry'  => 'IL',
		);
	}
	if ( $cities && ! is_wp_error( $cities ) ) {
		$schema['areaServed'] = array_map( fn( $c ) => $c->name, $cities );
	}
	if ( $areas && ! is_wp_error( $areas ) ) {
		$schema['knowsAbout'] = array_map( fn( $a ) => $a->name, $areas );
	}
	if ( $langs ) {
		$schema['knowsLanguage'] = array_map( 'trim', explode( ',', $langs ) );
	}
	if ( $bar ) {
		$schema['identifier'] = array(
			'@type'           => 'PropertyValue',
			'propertyID'      => 'IL_BAR_LICENSE',
			'value'           => $bar,
		);
	}
	if ( $years ) {
		$schema['hasCredential'] = array(
			'@type'                => 'EducationalOccupationalCredential',
			'credentialCategory'   => sprintf( '%d years experience', (int) $years ),
		);
	}

	justice_theme_print_schema( $schema );
}
add_action( 'wp_head', 'justice_theme_attorney_schema', 20 );

/**
 * LegalService schema on practice-areas taxonomy archives.
 * Helps Google understand the page topic for AI-driven SERP features.
 */
function justice_theme_legalservice_schema() {
	if ( ! is_tax( 'practice-areas' ) ) {
		return;
	}

	$term = get_queried_object();
	if ( ! $term || is_wp_error( $term ) ) {
		return;
	}

	justice_theme_print_schema( array(
		'@context'    => 'https://schema.org',
		'@type'       => 'LegalService',
		'name'        => 'עורך דין ' . $term->name,
		'description' => $term->description ?: ( 'מדריך עורכי דין ' . $term->name . ' בישראל' ),
		'url'         => get_term_link( $term ),
		'areaServed'  => array(
			'@type' => 'Country',
			'name'  => 'Israel',
		),
		'serviceType' => $term->name,
	) );
}
add_action( 'wp_head', 'justice_theme_legalservice_schema', 20 );

