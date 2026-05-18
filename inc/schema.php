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
		$name = isset( $item['name'] ) ? trim( wp_strip_all_tags( (string) $item['name'] ) ) : '';
		if ( '' === $name ) {
			$name = function_exists( 'justice_theme_get_fallback_breadcrumb_name' )
				? justice_theme_get_fallback_breadcrumb_name()
				: ( get_bloginfo( 'name' ) ?: 'Jus-Tice' );
		}

		$url = ! empty( $item['url'] )
			? justice_theme_public_url( (string) $item['url'] )
			: ( function_exists( 'justice_theme_current_public_url' ) ? justice_theme_current_public_url() : justice_theme_public_permalink( get_the_ID() ) );

		$list_item = array(
			'@type'    => 'ListItem',
			'position' => $index + 1,
			'name'     => $name,
		);

		if ( '' !== $url ) {
			$list_item['item'] = esc_url_raw( $url );
		}

		$list_items[] = $list_item;
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
 * FAQPage schema on articles that contain FAQ sections.
 *
 * Detects h2/h3 "שאלות נפוצות" sections and extracts Q&A pairs
 * from the subsequent h3 + p pattern.
 */
function justice_theme_faq_schema() {
	if ( ! is_singular( array( 'post', 'articles' ) ) ) {
		return;
	}

	$content = get_the_content();
	if ( empty( $content ) ) {
		return;
	}

	// Check if content has a FAQ section.
	if ( stripos( $content, 'שאלות נפוצות' ) === false ) {
		return;
	}

	// Extract FAQ section: everything after "שאלות נפוצות" heading.
	$faq_start = strpos( $content, 'שאלות נפוצות' );
	if ( false === $faq_start ) {
		return;
	}

	$faq_content = substr( $content, $faq_start );

	// Extract Q&A pairs from h3 + p pattern.
	$questions = array();
	if ( preg_match_all( '/<h3[^>]*>([^<]+)<\/h3>\s*<p>([^<]+(?:<[^h][^>]*>[^<]*<\/[^h][^>]*>)*[^<]*)<\/p>/us', $faq_content, $matches, PREG_SET_ORDER ) ) {
		foreach ( $matches as $match ) {
			$question = wp_strip_all_tags( $match[1] );
			$answer   = wp_strip_all_tags( $match[2] );
			if ( mb_strlen( $question ) > 5 && mb_strlen( $answer ) > 10 ) {
				$questions[] = array(
					'@type'          => 'Question',
					'name'           => $question,
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => $answer,
					),
				);
			}
		}
	}

	if ( empty( $questions ) ) {
		return;
	}

	justice_theme_print_schema( array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => $questions,
	) );
}
add_action( 'wp_head', 'justice_theme_faq_schema', 21 );

/**
 * LegalService schema on front page.
 */
function justice_theme_legal_service_schema() {
	if ( ! is_front_page() ) {
		return;
	}

	justice_theme_print_schema( array(
		'@context'    => 'https://schema.org',
		'@type'       => 'LegalService',
		'name'        => 'ג\'סטיס - פורטל משפטי',
		'url'         => justice_theme_public_url( home_url( '/' ) ),
		'telephone'   => function_exists( 'justice_theme_public_contact_number' ) ? justice_theme_public_contact_number() : '0525101555',
		'email'       => 'info@jus-tice.co.il',
		'address'     => array(
			'@type'          => 'PostalAddress',
			'addressCountry' => 'IL',
		),
		'areaServed'  => array(
			'@type' => 'Country',
			'name'  => 'Israel',
		),
		'knowsAbout'  => array(
			'Criminal Law',
			'Family Law',
			'Real Estate Law',
			'Labor Law',
			'Tort Law',
			'Traffic Law',
			'Inheritance Law',
		),
		'description' => 'פורטל משפטי מוביל בישראל. מדריכים מקצועיים, מאגר עורכי דין וייעוץ משפטי בכל תחומי המשפט.',
	) );
}
add_action( 'wp_head', 'justice_theme_legal_service_schema', 20 );

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
		'url'             => justice_theme_public_url( home_url( '/' ) ),
		'potentialAction' => array(
			'@type'       => 'SearchAction',
			'target'      => justice_theme_public_url( home_url( '/?s={search_term_string}' ) ),
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

