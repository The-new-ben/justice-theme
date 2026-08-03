<?php
/**
 * Map feed v3: live-now override of the theme's /justice/v1/map/offices
 * route (owner order 2026-07-18: dots for everyone, labels for paying
 * offices, smart FOMO around them).
 *
 * Why an override: the theme feed caps lawyers at 500 while the index
 * import pushed the geocoded pool to ~970 - half the map was silently
 * missing. The theme file is pull-gated; this later rest_api_init
 * registration (priority 20 vs the theme's 10) wins the route today and
 * is byte-compatible with the theme version's consumers. Same pattern as
 * relevance-fixes.css: ops corrects production now, theme catches up.
 *
 * Payload discipline: ~970 features is real weight, so non-paying
 * lawyers carry only what a dot and its popup need (name, url, city,
 * areas, verified, whatsapp, claim). Paid offices keep the full rich
 * set (logo, phone, address, rating) - the label markers use it.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Purge every historical map payload key used by this plugin.
 *
 * The feed intentionally keeps the original v1 key and advances its embedded
 * schema marker. This makes an old jt_v3 payload fail closed and be replaced,
 * while this helper also removes the briefly introduced v2 key.
 */
function justice_ops_purge_map_feed_cache(): void {
	delete_transient( 'justice_map_geojson_v1' );
	delete_transient( 'justice_map_geojson_v2' );
}

/**
 * Map prominence uses the same canonical active-paid truth as every card.
 */
function justice_ops_map_profile_is_active_paid( int $lawyer_id ): bool {
	return function_exists( 'justice_ops_content_first_profile_is_active_paid' )
		&& justice_ops_content_first_profile_is_active_paid( $lawyer_id );
}

add_action( 'rest_api_init', function () {
	// The 4th arg ($override = true) is load-bearing: without it WP APPENDS
	// this handler after the theme's and dispatch picks the FIRST method
	// match - i.e. the theme's capped feed keeps serving (observed live on
	// first deploy of this file; hook priority alone changes nothing).
	register_rest_route(
		'justice/v1',
		'/map/offices',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => 'justice_ops_map_offices_v3',
		),
		true
	);
}, 20 );

function justice_ops_map_offices_v3() {
	$cached = get_transient( 'justice_map_geojson_v1' );

	if ( is_array( $cached ) && ! empty( $cached['jt_v4'] ) ) {
		return new WP_REST_Response( $cached, 200 );
	}

	$features = array();

	if ( post_type_exists( 'justice_lawyer' ) ) {
		$lawyer_ids = get_posts(
			array(
				'post_type'      => 'justice_lawyer',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array(
					array(
						'key'     => 'office_lat',
						'compare' => 'EXISTS',
					),
				),
			)
		);

		foreach ( $lawyer_ids as $lawyer_id ) {
			$lawyer_id = (int) $lawyer_id;

			if ( function_exists( 'justice_theme_lawyer_profile_is_public_approved' ) && ! justice_theme_lawyer_profile_is_public_approved( $lawyer_id ) ) {
				continue;
			}

			$lat = (float) get_post_meta( $lawyer_id, 'office_lat', true );
			$lng = (float) get_post_meta( $lawyer_id, 'office_lng', true );

			if ( ! $lat || ! $lng ) {
				continue;
			}

			$areas = array();
			$terms = get_the_terms( $lawyer_id, 'practice-areas' );
			if ( is_array( $terms ) ) {
				foreach ( array_slice( $terms, 0, 3 ) as $term ) {
					$areas[] = $term->name;
				}
			}

			$city_terms = get_the_terms( $lawyer_id, 'city' );

			$is_paid = justice_ops_map_profile_is_active_paid( $lawyer_id );
			$claimed   = '' !== (string) get_post_meta( $lawyer_id, 'claimed_by_user_id', true );

			$props = array(
				'kind'     => 'lawyer',
				'id'       => $lawyer_id,
				'paid'     => $is_paid,
				'name'     => wp_specialchars_decode( get_the_title( $lawyer_id ), ENT_QUOTES ),
				'url'      => function_exists( 'justice_theme_public_permalink' ) ? justice_theme_public_permalink( $lawyer_id ) : get_permalink( $lawyer_id ),
				'city'     => ( is_array( $city_terms ) && $city_terms ) ? $city_terms[0]->name : '',
				'areas'    => $areas,
				'verified' => 'verified' === strtolower( (string) get_post_meta( $lawyer_id, 'verification_status', true ) ),
				'whatsapp' => function_exists( 'justice_theme_lawyer_public_whatsapp_link' ) ? justice_theme_lawyer_public_whatsapp_link( (string) get_post_meta( $lawyer_id, 'whatsapp', true ) ) : '',
			);

			// The one-click FOMO door: an unclaimed office's popup carries
			// its own claim link. Claimed-or-paid offices never show it.
			if ( ! $claimed && ! $is_paid ) {
				$props['claim'] = add_query_arg(
					array(
						'claim_profile_id' => $lawyer_id,
						'claim_profile'    => get_post_field( 'post_name', $lawyer_id ),
						'source'           => 'map_dot_claim',
					),
					home_url( '/lawyer-registration/' )
				);
			}

			if ( $is_paid ) {
				$review_state = function_exists( 'justice_theme_lawyer_reviews_public_state' )
					? justice_theme_lawyer_reviews_public_state( $lawyer_id )
					: array( 'show' => false, 'count' => 0, 'average' => 0.0 );

				$logo_id  = (int) get_post_meta( $lawyer_id, 'office_logo_id', true );
				$logo_url = $logo_id ? (string) wp_get_attachment_image_url( $logo_id, 'medium' ) : '';

				$props['logo']    = $logo_url;
				$props['rating']  = $review_state['show'] ? (float) $review_state['average'] : 0;
				$props['reviews'] = $review_state['show'] ? (int) $review_state['count'] : 0;
				$props['phone']   = function_exists( 'justice_theme_lawyer_public_phone_link' ) ? justice_theme_lawyer_public_phone_link( (string) get_post_meta( $lawyer_id, 'phone', true ) ) : '';
				$props['address'] = (string) get_post_meta( $lawyer_id, 'office_address', true );
			}

			$features[] = array(
				'type'       => 'Feature',
				'geometry'   => array(
					'type'        => 'Point',
					'coordinates' => array( $lng, $lat ),
				),
				'properties' => $props,
			);
		}
	}

	// Places (courts, institutions): unchanged from the theme feed.
	$place_ids = get_posts(
		array(
			'post_type'      => 'justice_place',
			'post_status'    => 'publish',
			'posts_per_page' => 2000,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);

	$type_labels = function_exists( 'justice_theme_legal_place_types' ) ? justice_theme_legal_place_types() : array();

	foreach ( $place_ids as $place_id ) {
		$place_id = (int) $place_id;
		$lat      = (float) get_post_meta( $place_id, 'place_lat', true );
		$lng      = (float) get_post_meta( $place_id, 'place_lng', true );

		if ( ! $lat || ! $lng ) {
			continue;
		}

		$type = sanitize_key( (string) get_post_meta( $place_id, 'place_type', true ) );

		$features[] = array(
			'type'       => 'Feature',
			'geometry'   => array(
				'type'        => 'Point',
				'coordinates' => array( $lng, $lat ),
			),
			'properties' => array(
				'kind'       => 'place',
				'id'         => $place_id,
				'name'       => wp_specialchars_decode( get_the_title( $place_id ), ENT_QUOTES ),
				'place_type' => $type,
				'type_label' => isset( $type_labels[ $type ] ) ? $type_labels[ $type ] : '',
				'address'    => (string) get_post_meta( $place_id, 'place_address', true ),
				'city'       => (string) get_post_meta( $place_id, 'place_city', true ),
			),
		);
	}

	$payload = array(
		'type'     => 'FeatureCollection',
		'features' => $features,
		'jt_v4'    => true,
	);

	set_transient( 'justice_map_geojson_v1', $payload, HOUR_IN_SECONDS * 6 );

	return new WP_REST_Response( $payload, 200 );
}

// The lawyers archive is the index's own page - the map belongs at its
// TOP (owner order 2026-07-18: "map upper fold"). Articles keep the map
// after the content (SEO law: first paragraphs keep their weight); the
// front page already carries it in the slot right after the hero.
//
// Output buffer, not loop_start: archive-justice_lawyer.php renders a
// CUSTOM WP_Query (approval-gated post__in list), so the main query's
// loop never starts and loop_start never fires there (observed live on
// first deploy). Same ob pattern as the front-page slot in map-cinema.php;
// the insert marker is the guidance band right under the archive H1.
// Detection is by URL, the only signal that held up live: on this site
// /lawyers/ renders the directory markup while BOTH is_post_type_archive()
// and the template_include basename miss it (observed on 2.34.2 and
// 2.34.3 - some routing layer serves the directory without the standard
// query/template shape). The URI check is crude but truthful, and the
// insert callback still verifies the directory marker before touching
// anything. Flag first (so wanted() lights the normal CSS/JS pipeline
// during render), buffer second.
// Priority -1000010: /lawyers/ is served by a render-and-exit controller
// around template_redirect -999999 (same controlled-route pattern as the
// front page), so a default-priority hook never runs there. The buffer
// must open before that controller renders and exits.
add_action( 'template_redirect', function () {
	$uri  = (string) parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
	$path = trim( $uri, '/' );

	if ( 'lawyers' !== $path ) {
		return;
	}

	$GLOBALS['jt_lawyer_archive_view'] = true;

	if ( ! function_exists( 'justice_cinema_block' ) || '' === justice_cinema_token() ) {
		return;
	}

	ob_start( function ( $html ) {
		$html = (string) $html;

		if ( false !== strpos( $html, 'jt-cinema-map' ) || false === strpos( $html, 'directory-guidance' ) ) {
			return $html;
		}

		$pos = strpos( $html, '<div class="directory-guidance"' );

		if ( false === $pos ) {
			return $html;
		}

		return substr_replace( $html, '<div class="jtcm-archive-slot">' . justice_cinema_block( false ) . '</div>', $pos, 0 );
	} );
}, -1000010 );
