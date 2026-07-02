<?php
/**
 * LawyerScout: the interactive 3D legal map of Israel.
 *
 * Foundation module (owner-approved 2026-07-02): Mapbox GL powered map of
 * every approved lawyer office plus imported legal places (courts, legal
 * aid, institutions). Lawyers come straight from the CMS; places come from
 * the owner's data-collection agent through an admin-only import endpoint.
 * Rich popups (photo, verification, real ratings, contact) and a
 * nearest-to-me flow. The public Mapbox token is served to the client
 * (that is what pk tokens are for; restrict it to the domain in the Mapbox
 * dashboard); it lives in wp-config or the mu-plugin filter, never in the
 * repo.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Public Mapbox token (pk...). Empty string disables the whole feature.
 *
 * @return string
 */
function justice_theme_mapbox_public_token(): string {
	$token = defined( 'JUSTICE_MAPBOX_PUBLIC_TOKEN' ) ? (string) JUSTICE_MAPBOX_PUBLIC_TOKEN : '';

	return (string) apply_filters( 'justice_theme_mapbox_public_token', $token );
}

/**
 * Lightweight CPT for non-lawyer legal places (courts, legal aid bureaus,
 * enforcement offices, notaries, institutes). Kept separate from
 * justice_lawyer so imported POIs never pollute the verified directory.
 */
function justice_theme_register_legal_place_cpt(): void {
	register_post_type(
		'justice_place',
		array(
			'labels'          => array(
				'name'          => 'Legal Places (map)',
				'singular_name' => 'Legal Place',
				'menu_name'     => 'Legal Map Places',
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'menu_icon'       => 'dashicons-location-alt',
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'map_meta_cap'    => true,
			'has_archive'     => false,
			'rewrite'         => false,
			'show_in_rest'    => false,
		)
	);

	foreach ( array(
		'place_type'    => 'string',
		'place_address' => 'string',
		'place_city'    => 'string',
		'place_phone'   => 'string',
		'place_website' => 'string',
		'place_lat'     => 'string',
		'place_lng'     => 'string',
		'place_areas'   => 'string',
		'place_source'  => 'string',
		'place_hash'    => 'string',
	) as $key => $type ) {
		register_post_meta(
			'justice_place',
			$key,
			array(
				'single'            => true,
				'type'              => $type,
				'sanitize_callback' => 'place_website' === $key || 'place_source' === $key ? 'esc_url_raw' : 'sanitize_text_field',
				'show_in_rest'      => false,
			)
		);
	}
}
add_action( 'init', 'justice_theme_register_legal_place_cpt' );

/**
 * Allowed place types for imports and the map legend.
 *
 * @return array<string,string> type => Hebrew label.
 */
function justice_theme_legal_place_types(): array {
	return array(
		'law_office'   => 'משרד עורכי דין',
		'court'        => 'בית משפט',
		'rabbinical'   => 'בית דין רבני',
		'legal_aid'    => 'סיוע משפטי',
		'enforcement'  => 'הוצאה לפועל',
		'notary'       => 'נוטריון',
		'mediation'    => 'מרכז גישור',
		'bar'          => 'לשכת עורכי הדין',
		'institution'  => 'מוסד משפטי',
	);
}

/**
 * GeoJSON of everything on the map: approved lawyers with coordinates plus
 * imported places. Cached one hour; invalidated on demand by deleting the
 * transient.
 */
function justice_theme_register_map_routes(): void {
	register_rest_route(
		'justice/v1',
		'/map/offices',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => 'justice_theme_map_offices_geojson',
		)
	);

	register_rest_route(
		'justice/v1',
		'/map/import-places',
		array(
			'methods'             => 'POST',
			'permission_callback' => function () {
				return current_user_can( 'manage_options' );
			},
			'callback'            => 'justice_theme_map_import_places',
		)
	);

	register_rest_route(
		'justice/v1',
		'/map/geocode-missing',
		array(
			'methods'             => 'POST',
			'permission_callback' => function () {
				return current_user_can( 'manage_options' );
			},
			'callback'            => 'justice_theme_map_geocode_missing',
		)
	);
}
add_action( 'rest_api_init', 'justice_theme_register_map_routes' );

/**
 * @return WP_REST_Response
 */
function justice_theme_map_offices_geojson() {
	$cached = get_transient( 'justice_map_geojson_v1' );

	if ( is_array( $cached ) ) {
		return new WP_REST_Response( $cached, 200 );
	}

	$features = array();

	// Approved lawyers with coordinates.
	if ( post_type_exists( 'justice_lawyer' ) ) {
		$lawyer_ids = get_posts(
			array(
				'post_type'      => 'justice_lawyer',
				'post_status'    => 'publish',
				'posts_per_page' => 500,
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

			$review_state = function_exists( 'justice_theme_lawyer_reviews_public_state' )
				? justice_theme_lawyer_reviews_public_state( $lawyer_id )
				: array( 'show' => false, 'count' => 0, 'average' => 0.0 );

			$city_terms = get_the_terms( $lawyer_id, 'city' );

			// Paid plans get the premium flag marker on the map.
			$plan_type = strtolower( (string) get_post_meta( $lawyer_id, 'plan_type', true ) );
			$is_paid   = in_array( $plan_type, array( 'featured', 'premium', 'partner', 'pro' ), true );

			$features[] = array(
				'type'       => 'Feature',
				'geometry'   => array(
					'type'        => 'Point',
					'coordinates' => array( $lng, $lat ),
				),
				'properties' => array(
					'kind'     => 'lawyer',
					'id'       => $lawyer_id,
					'paid'     => $is_paid,
					'name'     => wp_specialchars_decode( get_the_title( $lawyer_id ), ENT_QUOTES ),
					'url'      => function_exists( 'justice_theme_public_permalink' ) ? justice_theme_public_permalink( $lawyer_id ) : get_permalink( $lawyer_id ),
					'city'     => ( is_array( $city_terms ) && $city_terms ) ? $city_terms[0]->name : '',
					'areas'    => $areas,
					'verified' => 'verified' === strtolower( (string) get_post_meta( $lawyer_id, 'verification_status', true ) ),
					'rating'   => $review_state['show'] ? (float) $review_state['average'] : 0,
					'reviews'  => $review_state['show'] ? (int) $review_state['count'] : 0,
					'phone'    => function_exists( 'justice_theme_lawyer_public_phone_link' ) ? justice_theme_lawyer_public_phone_link( (string) get_post_meta( $lawyer_id, 'phone', true ) ) : '',
					'whatsapp' => function_exists( 'justice_theme_lawyer_public_whatsapp_link' ) ? justice_theme_lawyer_public_whatsapp_link( (string) get_post_meta( $lawyer_id, 'whatsapp', true ) ) : '',
					'address'  => (string) get_post_meta( $lawyer_id, 'office_address', true ),
				),
			);
		}
	}

	// Imported places.
	$place_ids = get_posts(
		array(
			'post_type'      => 'justice_place',
			'post_status'    => 'publish',
			'posts_per_page' => 2000,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);

	$type_labels = justice_theme_legal_place_types();

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
				'type_label' => $type_labels[ $type ] ?? 'מוסד משפטי',
				'city'       => (string) get_post_meta( $place_id, 'place_city', true ),
				'address'    => (string) get_post_meta( $place_id, 'place_address', true ),
				'phone'      => (string) get_post_meta( $place_id, 'place_phone', true ),
				'website'    => (string) get_post_meta( $place_id, 'place_website', true ),
			),
		);
	}

	$geojson = array(
		'type'     => 'FeatureCollection',
		'features' => $features,
	);

	set_transient( 'justice_map_geojson_v1', $geojson, HOUR_IN_SECONDS );

	return new WP_REST_Response( $geojson, 200 );
}

/**
 * Admin-only batch import for the data-collection agent. Accepts a JSON
 * body: {"places": [{name, type, address, city, lat, lng, phone, website,
 * source}]}. Dedupes on a name+address hash. Coordinates outside Israel's
 * bounding box are rejected.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function justice_theme_map_import_places( WP_REST_Request $request ) {
	$body   = $request->get_json_params();
	$places = isset( $body['places'] ) && is_array( $body['places'] ) ? $body['places'] : array();
	$types  = justice_theme_legal_place_types();

	$created  = 0;
	$skipped  = 0;
	$rejected = array();

	foreach ( array_slice( $places, 0, 200 ) as $index => $place ) {
		if ( ! is_array( $place ) ) {
			$skipped++;
			continue;
		}

		$name    = sanitize_text_field( (string) ( $place['name'] ?? '' ) );
		$type    = sanitize_key( (string) ( $place['type'] ?? '' ) );
		$address = sanitize_text_field( (string) ( $place['address'] ?? '' ) );
		$lat     = (float) ( $place['lat'] ?? 0 );
		$lng     = (float) ( $place['lng'] ?? 0 );

		if ( '' === $name || ! isset( $types[ $type ] ) || '' === $address ) {
			$rejected[] = array( 'index' => $index, 'reason' => 'missing name/type/address' );
			continue;
		}

		// Israel bounding box sanity gate.
		if ( $lat < 29.3 || $lat > 33.5 || $lng < 34.2 || $lng > 35.95 ) {
			$rejected[] = array( 'index' => $index, 'reason' => 'coordinates outside Israel' );
			continue;
		}

		$hash     = md5( mb_strtolower( $name . '|' . $address ) );
		$existing = get_posts(
			array(
				'post_type'      => 'justice_place',
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'meta_query'     => array(
					array(
						'key'   => 'place_hash',
						'value' => $hash,
					),
				),
			)
		);

		if ( ! empty( $existing ) ) {
			$skipped++;
			continue;
		}

		$place_id = wp_insert_post(
			array(
				'post_type'   => 'justice_place',
				'post_status' => 'publish',
				'post_title'  => $name,
				'meta_input'  => array(
					'place_type'    => $type,
					'place_address' => $address,
					'place_city'    => sanitize_text_field( (string) ( $place['city'] ?? '' ) ),
					'place_phone'   => sanitize_text_field( (string) ( $place['phone'] ?? '' ) ),
					'place_website' => esc_url_raw( (string) ( $place['website'] ?? '' ) ),
					'place_lat'     => (string) $lat,
					'place_lng'     => (string) $lng,
					'place_source'  => esc_url_raw( (string) ( $place['source'] ?? '' ) ),
					'place_hash'    => $hash,
				),
			)
		);

		if ( $place_id && ! is_wp_error( $place_id ) ) {
			$created++;
		} else {
			$skipped++;
		}
	}

	delete_transient( 'justice_map_geojson_v1' );

	return new WP_REST_Response(
		array(
			'created'  => $created,
			'skipped'  => $skipped,
			'rejected' => $rejected,
			'total_in' => count( $places ),
		),
		200
	);
}

/**
 * Geocode approved lawyers that have an office address but no coordinates,
 * through the Mapbox geocoding API (uses the same public token). Processes
 * up to 20 per call so it can be re-run safely until done.
 *
 * @return WP_REST_Response
 */
function justice_theme_map_geocode_missing() {
	$token = justice_theme_mapbox_public_token();

	if ( '' === $token ) {
		return new WP_REST_Response( array( 'error' => 'mapbox_token_missing' ), 200 );
	}

	$lawyer_ids = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'publish',
			'posts_per_page' => 20,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'meta_query'     => array(
				'relation' => 'AND',
				array(
					'key'     => 'office_address',
					'value'   => '',
					'compare' => '!=',
				),
				array(
					'key'     => 'office_lat',
					'compare' => 'NOT EXISTS',
				),
			),
		)
	);

	$done   = array();
	$failed = array();

	foreach ( $lawyer_ids as $lawyer_id ) {
		$lawyer_id = (int) $lawyer_id;
		$address   = (string) get_post_meta( $lawyer_id, 'office_address', true );

		$response = wp_remote_get(
			'https://api.mapbox.com/geocoding/v5/mapbox.places/' . rawurlencode( $address . ', ישראל' ) . '.json?' . http_build_query(
				array(
					'access_token' => $token,
					'country'      => 'il',
					'language'     => 'he',
					'limit'        => 1,
				)
			),
			array( 'timeout' => 8 )
		);

		if ( is_wp_error( $response ) ) {
			$failed[] = $lawyer_id;
			continue;
		}

		$data   = json_decode( (string) wp_remote_retrieve_body( $response ), true );
		$center = $data['features'][0]['center'] ?? null;

		if ( ! is_array( $center ) || count( $center ) < 2 ) {
			$failed[] = $lawyer_id;
			continue;
		}

		update_post_meta( $lawyer_id, 'office_lng', (string) (float) $center[0] );
		update_post_meta( $lawyer_id, 'office_lat', (string) (float) $center[1] );
		$done[] = $lawyer_id;
	}

	delete_transient( 'justice_map_geojson_v1' );

	return new WP_REST_Response(
		array(
			'geocoded'  => $done,
			'failed'    => $failed,
			'remaining' => max( 0, count( $lawyer_ids ) - count( $done ) - count( $failed ) ),
		),
		200
	);
}
