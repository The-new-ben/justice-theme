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
 * Includes @id linking to sitewide Person and Organization entities.
 */
function justice_theme_article_schema() {
	$is_repo_cluster_page = is_page() && get_post_meta( get_the_ID(), 'content_status', true );
	if ( ! is_singular( array( 'post', 'articles' ) ) && ! $is_repo_cluster_page ) {
		return;
	}

	global $post;

	$home_url = justice_theme_public_url( home_url( '/' ) );
	$author   = function_exists( 'justice_theme_authority_organization_schema' )
		? justice_theme_authority_organization_schema()
		: array(
			'@type' => 'Organization',
			'@id'   => $home_url . '#organization',
			'name'  => get_bloginfo( 'name' ) ?: 'Jus-Tice',
			'url'   => $home_url,
		);
	$reviewer = function_exists( 'justice_theme_article_reviewer_with_fallback' )
		? justice_theme_article_reviewer_with_fallback( get_the_ID() )
		: ( function_exists( 'justice_theme_authority_article_reviewer_schema' )
			? justice_theme_authority_article_reviewer_schema( get_the_ID() )
			: null );

	$schema = array(
		'@context'         => 'https://schema.org',
		'@type'            => 'Article',
		'@id'              => esc_url_raw( justice_theme_public_permalink( get_the_ID() ) ) . '#article',
		'headline'         => wp_strip_all_tags( get_the_title() ),
		'datePublished'    => get_the_date( DATE_W3C ),
		'dateModified'     => get_the_modified_date( DATE_W3C ),
		'inLanguage'       => 'he',
		'mainEntityOfPage' => esc_url_raw( justice_theme_public_permalink( get_the_ID() ) ),
		'author'           => $author,
		'publisher'        => array(
			'@type' => 'LegalService',
			'@id'   => $home_url . '#organization',
			'name'  => get_bloginfo( 'name' ),
			'url'   => $home_url,
			'logo'  => array(
				'@type' => 'ImageObject',
				'url'   => $home_url . 'wp-content/uploads/logo.png',
			),
		),
	);

	if ( $reviewer && apply_filters( 'justice_reviewer_claims_enabled', false ) ) {
		$schema['reviewedBy'] = $reviewer;
	}

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
			$schema['image'] = array(
				'@type' => 'ImageObject',
				'url'   => esc_url_raw( $image[0] ),
			);
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
	if ( ! is_singular( array( 'post', 'articles', 'page' ) ) ) {
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
	if ( preg_match_all( '/<h3[^>]*>(.+?)<\/h3>\s*<p>(.+?)<\/p>/us', $faq_content, $matches, PREG_SET_ORDER ) ) {
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
 * Practice area → LegalService type mapping.
 *
 * @return array Slug => service type label.
 */
function justice_theme_practice_area_service_map() {
	return array(
		'criminal-defense-attorney'                    => array( 'label' => 'משפט פלילי', 'en' => 'Criminal Law' ),
		'lawyer-divorce-guide-proceedings-costs-rights' => array( 'label' => 'דיני משפחה וגירושין', 'en' => 'Family Law' ),
		'family-law'                                   => array( 'label' => 'דיני משפחה', 'en' => 'Family Law' ),
		'real-estate-attorney'                         => array( 'label' => 'דיני מקרקעין', 'en' => 'Real Estate Law' ),
		'medical-malpractice-lawyer'                   => array( 'label' => 'רשלנות רפואית', 'en' => 'Medical Malpractice' ),
		'police-records-data-deletion'                 => array( 'label' => 'מחיקת רישום פלילי', 'en' => 'Criminal Record Expungement' ),
		'inheritance-lawyer'                           => array( 'label' => 'דיני ירושה וצוואות', 'en' => 'Inheritance Law' ),
		'real-estate-lawyer-guide'                     => array( 'label' => 'דיני מקרקעין', 'en' => 'Real Estate Law' ),
	);
}

/**
 * LegalService + WebSite @graph schema.
 * Fires on front page and all practice area pillar pages.
 */
function justice_theme_legal_service_schema() {
	$home_url     = justice_theme_public_url( home_url( '/' ) );
	$is_front     = is_front_page();
	$current_slug = '';

	if ( is_page() ) {
		$current_slug = get_post_field( 'post_name', get_queried_object_id() );
	} elseif ( function_exists( 'justice_theme_current_practice_slug' ) ) {
		$current_slug = justice_theme_current_practice_slug();
	}

	$practice_map   = justice_theme_practice_area_service_map();
	$is_pillar_page = isset( $practice_map[ $current_slug ] );

	if ( ! $is_front && ! $is_pillar_page ) {
		return;
	}

	$phone = function_exists( 'justice_theme_public_contact_number' ) ? justice_theme_public_contact_number() : '0525101555';

	// Base organization entity — same @id on every page for Google entity consolidation.
	$org = array(
		'@type'       => 'LegalService',
		'@id'         => $home_url . '#organization',
		'name'        => 'Jus-Tice - פורטל משפטי ישראלי',
		'alternateName' => array( 'ג\'סטיס', 'Justice Legal Portal Israel' ),
		'url'         => $home_url,
		'telephone'   => $phone,
		'email'       => 'info@jus-tice.co.il',
		'logo'        => array(
			'@type' => 'ImageObject',
			'url'   => $home_url . 'wp-content/uploads/logo.png',
		),
		'address'     => array(
			'@type'          => 'PostalAddress',
			'addressCountry' => 'IL',
		),
		'areaServed'  => array(
			'@type' => 'Country',
			'name'  => 'Israel',
		),
		'inLanguage'  => 'he',
		'knowsAbout'  => array(
			'משפט פלילי', 'דיני משפחה', 'גירושין', 'מקרקעין',
			'רשלנות רפואית', 'דיני ירושה', 'צוואות', 'דיני עבודה',
			'Criminal Law', 'Family Law', 'Real Estate Law', 'Inheritance Law',
		),
		'description' => 'פורטל משפטי מוביל בישראל: מדריכים מקצועיים, חיפוש עורכי דין, מחשבונים משפטיים וייעוץ בכל תחומי המשפט.',
	);

	// On pillar pages, add the specific service type as a named service.
	if ( $is_pillar_page && ! $is_front ) {
		$svc    = $practice_map[ $current_slug ];
		$org['serviceType']   = $svc['label'];
		$org['hasOfferCatalog'] = array(
			'@type'           => 'OfferCatalog',
			'name'            => 'שירותי ' . $svc['label'],
			'itemListElement' => array(
				array(
					'@type'       => 'Offer',
					'itemOffered' => array(
						'@type' => 'Service',
						'name'  => 'ייצוג משפטי ב' . $svc['label'],
					),
				),
			),
		);
	}

	$website = array(
		'@type'           => 'WebSite',
		'@id'             => $home_url . '#website',
		'url'             => $home_url,
		'name'            => get_bloginfo( 'name' ),
		'inLanguage'      => 'he',
		'publisher'       => array( '@id' => $home_url . '#organization' ),
		'potentialAction' => array(
			'@type'       => 'SearchAction',
			'target'      => array(
				'@type'       => 'EntryPoint',
				'urlTemplate' => $home_url . '?s={search_term_string}',
			),
			'query-input' => 'required name=search_term_string',
		),
	);

	// Output as @graph for proper entity consolidation.
	justice_theme_print_schema( array(
		'@context' => 'https://schema.org',
		'@graph'   => array( $org, $website ),
	) );
}
add_action( 'wp_head', 'justice_theme_legal_service_schema', 20 );

/**
 * CollectionPage + ItemList schema for lawyer directory/listing pages.
 * Fires on practice area pages and lawyer archive pages.
 */
function justice_theme_collection_page_schema() {
	$current_slug = '';
	if ( is_page() ) {
		$current_slug = get_post_field( 'post_name', get_queried_object_id() );
	} elseif ( function_exists( 'justice_theme_current_practice_slug' ) ) {
		$current_slug = justice_theme_current_practice_slug();
	}

	$practice_map = justice_theme_practice_area_service_map();
	if ( ! isset( $practice_map[ $current_slug ] ) ) {
		return;
	}

	$svc          = $practice_map[ $current_slug ];
	$home_url     = justice_theme_public_url( home_url( '/' ) );
	$current_url  = function_exists( 'justice_theme_current_public_url' ) ? justice_theme_current_public_url() : $home_url;

	// Query featured lawyers for this practice area to populate ItemList.
	$lawyer_args = array(
		'post_type'      => 'justice_lawyer',
		'posts_per_page' => 5,
		'post_status'    => 'publish',
		'tax_query'      => array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'slug',
				'terms'    => $current_slug,
			),
		),
	);
	$lawyers = get_posts( $lawyer_args );

	$list_items = array();
	foreach ( $lawyers as $i => $lawyer ) {
		$firm_name = get_post_meta( $lawyer->ID, 'firm_name', true );
		$phone     = get_post_meta( $lawyer->ID, 'phone', true );
		$address   = get_post_meta( $lawyer->ID, 'office_address', true );
		$item      = array(
			'@type'    => 'ListItem',
			'position' => $i + 1,
			'item'     => array(
				'@type'       => 'LegalService',
				'name'        => wp_strip_all_tags( get_the_title( $lawyer->ID ) ) . ( $firm_name ? ' — ' . wp_strip_all_tags( $firm_name ) : '' ),
				'url'         => esc_url_raw( justice_theme_public_permalink( $lawyer->ID ) ),
				'serviceType' => $svc['label'],
				'areaServed'  => array( '@type' => 'Country', 'name' => 'Israel' ),
				'address'     => array(
					'@type'          => 'PostalAddress',
					'streetAddress'  => $address ? wp_strip_all_tags( $address ) : '',
					'addressCountry' => 'IL',
				),
			),
		);
		if ( $phone ) {
			$item['item']['telephone'] = wp_strip_all_tags( $phone );
		}
		$list_items[] = $item;
	}

	$schema = array(
		'@context'   => 'https://schema.org',
		'@type'      => 'CollectionPage',
		'@id'        => $current_url . '#collection',
		'name'       => 'עורכי דין מומלצים ב' . $svc['label'] . ' | Jus-Tice',
		'url'        => $current_url,
		'publisher'  => array( '@id' => $home_url . '#organization' ),
		'inLanguage' => 'he',
	);

	if ( ! empty( $list_items ) ) {
		$schema['mainEntity'] = array(
			'@type'           => 'ItemList',
			'itemListElement' => $list_items,
		);
	}

	justice_theme_print_schema( $schema );
}
add_action( 'wp_head', 'justice_theme_collection_page_schema', 22 );

/**
 * Attorney schema for lawyer mini-site pages.
 */
function justice_theme_schema_urls_from_text( string $raw ): array {
	if ( '' === trim( $raw ) ) {
		return array();
	}

	preg_match_all( '~https?://[^\s|<>"\']+~i', $raw, $matches );

	if ( empty( $matches[0] ) ) {
		return array();
	}

	$urls = array();

	foreach ( $matches[0] as $url ) {
		$url    = rtrim( $url, ".,;:)]}\r\n\t " );
		$scheme = strtolower( (string) wp_parse_url( $url, PHP_URL_SCHEME ) );

		if ( ! in_array( $scheme, array( 'http', 'https' ), true ) ) {
			continue;
		}

		$urls[] = esc_url_raw( $url );
	}

	return array_values( array_unique( array_filter( $urls ) ) );
}

function justice_theme_lawyer_schema_same_as_urls( int $post_id ): array {
	$raw_values = array();

	foreach ( array( 'website', 'source_url', 'linkedin_url', 'facebook_url', 'instagram_url', 'youtube_url', 'profile_public_sources' ) as $key ) {
		$value = get_post_meta( $post_id, $key, true );
		if ( is_string( $value ) && '' !== trim( $value ) ) {
			$raw_values[] = $value;
		}
	}

	return justice_theme_schema_urls_from_text( implode( "\n", $raw_values ) );
}

function justice_theme_lawyer_schema() {
	if ( ! is_singular( 'justice_lawyer' ) ) {
		return;
	}

	$post_id = get_the_ID();

	if (
		function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		&& ! justice_theme_lawyer_profile_is_public_approved( $post_id )
		&& ! current_user_can( 'edit_post', $post_id )
	) {
		return;
	}

	$phone   = get_post_meta( $post_id, 'phone', true );
	$phone   = function_exists( 'justice_theme_lawyer_public_phone_value' ) ? justice_theme_lawyer_public_phone_value( (string) $phone ) : $phone;
	$email   = get_post_meta( $post_id, 'email', true );
	$website = get_post_meta( $post_id, 'website', true );
	$firm    = get_post_meta( $post_id, 'firm_name', true );
	$address = get_post_meta( $post_id, 'office_address', true );
	$areas   = get_the_terms( $post_id, 'practice-areas' );
	$cities  = get_the_terms( $post_id, 'city' );
	$url     = esc_url_raw( justice_theme_public_permalink( $post_id ) );

	$schema = array(
		'@context' => 'https://schema.org',
		'@type'    => 'Attorney',
		'@id'      => trailingslashit( $url ) . '#attorney',
		'name'     => wp_strip_all_tags( get_the_title( $post_id ) ),
		'url'      => $url,
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

	$same_as = justice_theme_lawyer_schema_same_as_urls( $post_id );
	if ( ! empty( $same_as ) ) {
		$schema['sameAs'] = $same_as;
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

	// Verified client reviews: aggregateRating + review nodes, computed only
	// from owner-approved reviews behind the same gates as on-page display.
	if ( function_exists( 'justice_theme_lawyer_review_schema_fields' ) ) {
		$schema = array_merge( $schema, justice_theme_lawyer_review_schema_fields( $post_id ) );
	}

	justice_theme_print_schema( $schema );
}
add_action( 'wp_head', 'justice_theme_lawyer_schema', 20 );

/**
 * Verified Person schema for approved lawyer profiles in the authority registry.
 */
function justice_theme_lawyer_person_schema() {
	if ( ! is_singular( 'justice_lawyer' ) ) {
		return;
	}

	$post_id = get_the_ID();

	if (
		function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		&& ! justice_theme_lawyer_profile_is_public_approved( $post_id )
		&& ! current_user_can( 'edit_post', $post_id )
	) {
		return;
	}

	if (
		! function_exists( 'justice_theme_authority_verified_person_slug_for_post' )
		|| ! function_exists( 'justice_theme_authority_get_verified_person_schema' )
	) {
		return;
	}

	$person_slug = justice_theme_authority_verified_person_slug_for_post( $post_id );
	if ( '' === $person_slug ) {
		return;
	}

	$schema = justice_theme_authority_get_verified_person_schema( $person_slug );
	if ( empty( $schema ) ) {
		return;
	}

	$schema['@context'] = 'https://schema.org';
	$same_as           = justice_theme_lawyer_schema_same_as_urls( $post_id );

	if ( ! empty( $same_as ) ) {
		$schema['sameAs'] = $same_as;
	}

	if ( has_post_thumbnail( $post_id ) ) {
		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'full' );
		if ( ! empty( $image[0] ) ) {
			$schema['image'] = esc_url_raw( $image[0] );
		}
	}

	justice_theme_print_schema( $schema );
}
add_action( 'wp_head', 'justice_theme_lawyer_person_schema', 21 );
