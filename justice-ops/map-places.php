<?php
/**
 * The national court layer: every court labeled, from public record.
 *
 * The owner's map order was explicit: every court and every government
 * office has to be labeled. The Mapbox basemap already labels courthouses
 * natively, but only at close zoom and only where its POI data reaches.
 * This module seeds the map with the authoritative set from the Judicial
 * Authority: the Supreme Court, all district courts, every magistrate
 * branch, the labor courts and the main government complexes.
 *
 * Nothing here is invented. Each court carries its official published
 * street address; the coordinates come from geocoding that address on the
 * server through Mapbox, never from a hand-typed latitude. A proximity
 * guard means the shared "Hall of Justice" buildings (district and
 * magistrate under one roof) never double-pin. The places land in the same
 * justice_place store the map feed already reads, so they render as labeled
 * chips beside the lawyers with zero changes to the feed.
 *
 * Run it once from /wp-json/justice-ops/v1/seed-courts (admin, POST). It is
 * idempotent: a second run geocodes nothing already present and inserts
 * nothing already within 150m of an existing place.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The authoritative court + government set. name, type, address, city are
 * all public record (Judicial Authority directory). type maps to the
 * theme's legal place types so the chip label is correct.
 *
 * @return array<int,array<string,string>>
 */
function justice_ops_court_seed_data(): array {
	return array(
		// Supreme Court.
		array( 'name' => 'בית המשפט העליון', 'type' => 'court', 'address' => 'שערי משפט, קריית בן גוריון', 'city' => 'ירושלים' ),

		// District courts.
		array( 'name' => 'בית המשפט המחוזי ירושלים', 'type' => 'court', 'address' => 'צלאח א-דין 40', 'city' => 'ירושלים' ),
		array( 'name' => 'בית המשפט המחוזי תל אביב', 'type' => 'court', 'address' => 'ויצמן 1', 'city' => 'תל אביב יפו' ),
		array( 'name' => 'בית המשפט המחוזי חיפה', 'type' => 'court', 'address' => 'שדרות הפלים 12', 'city' => 'חיפה' ),
		array( 'name' => 'בית המשפט המחוזי מרכז', 'type' => 'court', 'address' => 'שדרות הציונות 3', 'city' => 'לוד' ),
		array( 'name' => 'בית המשפט המחוזי באר שבע', 'type' => 'court', 'address' => 'התקווה 5', 'city' => 'באר שבע' ),
		array( 'name' => 'בית המשפט המחוזי נצרת', 'type' => 'court', 'address' => 'קריית יצחק רבין', 'city' => 'נוף הגליל' ),

		// Magistrate courts.
		array( 'name' => 'בית משפט השלום ירושלים', 'type' => 'court', 'address' => 'חשין 6', 'city' => 'ירושלים' ),
		array( 'name' => 'בית משפט השלום תל אביב יפו', 'type' => 'court', 'address' => 'ויצמן 1', 'city' => 'תל אביב יפו' ),
		array( 'name' => 'בית משפט השלום בת ים', 'type' => 'court', 'address' => 'ניסנבוים 7', 'city' => 'בת ים' ),
		array( 'name' => 'בית משפט השלום הרצליה', 'type' => 'court', 'address' => 'בן גוריון 31', 'city' => 'הרצליה' ),
		array( 'name' => 'בית משפט השלום כפר סבא', 'type' => 'court', 'address' => 'הטחנה 5', 'city' => 'כפר סבא' ),
		array( 'name' => 'בית משפט השלום נתניה', 'type' => 'court', 'address' => 'הרצל 57', 'city' => 'נתניה' ),
		array( 'name' => 'בית משפט השלום פתח תקווה', 'type' => 'court', 'address' => 'בזל 1', 'city' => 'פתח תקווה' ),
		array( 'name' => 'בית משפט השלום ראשון לציון', 'type' => 'court', 'address' => 'ישראל גלילי 5', 'city' => 'ראשון לציון' ),
		array( 'name' => 'בית משפט השלום רמלה', 'type' => 'court', 'address' => 'שדרות ויצמן 3', 'city' => 'רמלה' ),
		array( 'name' => 'בית משפט השלום רחובות', 'type' => 'court', 'address' => 'רוזנסקי 9', 'city' => 'רחובות' ),
		array( 'name' => 'בית משפט השלום חיפה', 'type' => 'court', 'address' => 'שדרות הפלים 8', 'city' => 'חיפה' ),
		array( 'name' => 'בית משפט השלום קריות', 'type' => 'court', 'address' => 'דרך עכו 194', 'city' => 'קריית ביאליק' ),
		array( 'name' => 'בית משפט השלום חדרה', 'type' => 'court', 'address' => 'הלל יפה 7', 'city' => 'חדרה' ),
		array( 'name' => 'בית משפט השלום עכו', 'type' => 'court', 'address' => 'יהושפט 15', 'city' => 'עכו' ),
		array( 'name' => 'בית משפט השלום טבריה', 'type' => 'court', 'address' => 'החשמונאים 3', 'city' => 'טבריה' ),
		array( 'name' => 'בית משפט השלום צפת', 'type' => 'court', 'address' => 'מרום כנען', 'city' => 'צפת' ),
		array( 'name' => 'בית משפט השלום נצרת', 'type' => 'court', 'address' => 'כיכר קריית יצחק רבין', 'city' => 'נוף הגליל' ),
		array( 'name' => 'בית משפט השלום באר שבע', 'type' => 'court', 'address' => 'התקווה 5', 'city' => 'באר שבע' ),
		array( 'name' => 'בית משפט השלום אשדוד', 'type' => 'court', 'address' => 'מורדי הגטאות 1', 'city' => 'אשדוד' ),
		array( 'name' => 'בית משפט השלום אשקלון', 'type' => 'court', 'address' => 'שדרות בן גוריון 19', 'city' => 'אשקלון' ),
		array( 'name' => 'בית משפט השלום קריית גת', 'type' => 'court', 'address' => 'חשוון 12', 'city' => 'קריית גת' ),
		array( 'name' => 'בית משפט השלום בית שמש', 'type' => 'court', 'address' => 'הרצל 9', 'city' => 'בית שמש' ),
		array( 'name' => 'בית משפט השלום אילת', 'type' => 'court', 'address' => 'דרך יותם 3', 'city' => 'אילת' ),

		// Labor courts.
		array( 'name' => 'בית הדין הארצי לעבודה', 'type' => 'court', 'address' => 'קרן היסוד 20', 'city' => 'ירושלים' ),
		array( 'name' => 'בית הדין האזורי לעבודה ירושלים', 'type' => 'court', 'address' => 'בית הדפוס 20', 'city' => 'ירושלים' ),
		array( 'name' => 'בית הדין האזורי לעבודה תל אביב', 'type' => 'court', 'address' => 'שוקן 25', 'city' => 'תל אביב יפו' ),
		array( 'name' => 'בית הדין האזורי לעבודה חיפה', 'type' => 'court', 'address' => 'שדרות הפלים 12', 'city' => 'חיפה' ),
		array( 'name' => 'בית הדין האזורי לעבודה באר שבע', 'type' => 'court', 'address' => 'התקווה 5', 'city' => 'באר שבע' ),
		array( 'name' => 'בית הדין האזורי לעבודה נצרת', 'type' => 'court', 'address' => 'קריית יצחק רבין', 'city' => 'נוף הגליל' ),

		// Main government complexes.
		array( 'name' => 'קריית הממשלה ירושלים', 'type' => 'institution', 'address' => 'קפלן 2', 'city' => 'ירושלים' ),
		array( 'name' => 'קריית הממשלה חיפה', 'type' => 'institution', 'address' => 'שדרות פלים 15', 'city' => 'חיפה' ),
		array( 'name' => 'קריית הממשלה באר שבע', 'type' => 'institution', 'address' => 'שדרות שזר 31', 'city' => 'באר שבע' ),
	);
}

/**
 * Geocode one address through Mapbox using the theme public token. Returns
 * array( lng, lat ) or null. Israel-scoped and Hebrew-biased.
 *
 * @param string $query Full query (name, address, city).
 * @return array{0:float,1:float}|null
 */
function justice_ops_court_geocode( string $query, string $token ) {
	$response = wp_remote_get(
		'https://api.mapbox.com/geocoding/v5/mapbox.places/' . rawurlencode( $query . ', ישראל' ) . '.json?' . http_build_query(
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
		return null;
	}

	$data   = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	$center = $data['features'][0]['center'] ?? null;

	if ( ! is_array( $center ) || count( $center ) < 2 ) {
		return null;
	}

	$lng = (float) $center[0];
	$lat = (float) $center[1];

	// Israel bounding box sanity gate (same as the theme importer).
	if ( $lat < 29.3 || $lat > 33.5 || $lng < 34.2 || $lng > 35.95 ) {
		return null;
	}

	return array( $lng, $lat );
}

/**
 * Does a justice_place with this exact title already exist? Uses the
 * WP_Query title parameter (get_page_by_title is deprecated in 6.2+).
 *
 * @param string $name Exact place title.
 * @return bool
 */
function justice_ops_place_title_exists( string $name ): bool {
	$found = get_posts(
		array(
			'post_type'      => 'justice_place',
			'post_status'    => 'any',
			'title'          => $name,
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);

	return ! empty( $found );
}

/**
 * Every existing place coordinate, for the proximity guard.
 *
 * @return array<int,array{0:float,1:float,2:string}> lng, lat, name.
 */
function justice_ops_existing_place_points(): array {
	$points = array();

	$ids = get_posts(
		array(
			'post_type'      => 'justice_place',
			'post_status'    => 'any',
			'posts_per_page' => 2000,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);

	foreach ( $ids as $id ) {
		$lat = (float) get_post_meta( (int) $id, 'place_lat', true );
		$lng = (float) get_post_meta( (int) $id, 'place_lng', true );

		if ( $lat && $lng ) {
			$points[] = array( $lng, $lat, (string) get_the_title( (int) $id ) );
		}
	}

	return $points;
}

/**
 * Seed the courts. Idempotent: skips a court whose exact title already
 * exists, and skips any court that geocodes within ~150m of an existing
 * place (the shared courthouse buildings). Caps geocoding work per run so a
 * timeout never leaves a half-written state; re-run until remaining is 0.
 *
 * @param int $limit Max NEW inserts to attempt this run.
 * @return array<string,mixed>
 */
function justice_ops_seed_courts( int $limit = 60 ): array {
	if ( ! post_type_exists( 'justice_place' ) ) {
		return array( 'error' => 'justice_place CPT not registered (theme inactive?)' );
	}

	$token = function_exists( 'justice_theme_mapbox_public_token' ) ? justice_theme_mapbox_public_token() : '';

	if ( '' === $token ) {
		return array( 'error' => 'mapbox_token_missing' );
	}

	$existing_points = justice_ops_existing_place_points();
	$report          = array();
	$created         = 0;
	$skipped_exists  = 0;
	$skipped_near    = 0;
	$failed          = 0;

	// ~150m in degrees near Israel's latitude (lat ~0.00135deg, lng similar).
	$near = 0.0015;

	foreach ( justice_ops_court_seed_data() as $court ) {
		if ( $created >= $limit ) {
			break;
		}

		$name = $court['name'];

		// Skip if a place with this exact title already exists.
		if ( justice_ops_place_title_exists( $name ) ) {
			$skipped_exists++;
			continue;
		}

		$coords = justice_ops_court_geocode( $name . ', ' . $court['address'] . ', ' . $court['city'], $token );

		if ( null === $coords ) {
			$failed++;
			$report[] = array( 'name' => $name, 'status' => 'geocode_failed' );
			continue;
		}

		// Proximity guard: same building already on the map.
		$too_near = null;

		foreach ( $existing_points as $pt ) {
			if ( abs( $pt[0] - $coords[0] ) < $near && abs( $pt[1] - $coords[1] ) < $near ) {
				$too_near = $pt[2];
				break;
			}
		}

		if ( null !== $too_near ) {
			$skipped_near++;
			$report[] = array( 'name' => $name, 'status' => 'near_existing', 'building' => $too_near );
			continue;
		}

		$hash     = md5( mb_strtolower( $name . '|' . $court['address'] ) );
		$place_id = wp_insert_post(
			array(
				'post_type'   => 'justice_place',
				'post_status' => 'publish',
				'post_title'  => $name,
				'meta_input'  => array(
					'place_type'    => $court['type'],
					'place_address' => $court['address'],
					'place_city'    => $court['city'],
					'place_lat'     => (string) $coords[1],
					'place_lng'     => (string) $coords[0],
					'place_source'  => 'https://www.gov.il/he/departments/dynamiccollectors/courts-data',
					'place_hash'    => $hash,
				),
			)
		);

		if ( $place_id && ! is_wp_error( $place_id ) ) {
			$created++;
			$existing_points[] = array( $coords[0], $coords[1], $name );
			$report[]          = array( 'name' => $name, 'status' => 'created', 'lng' => $coords[0], 'lat' => $coords[1] );
		} else {
			$failed++;
			$report[] = array( 'name' => $name, 'status' => 'insert_failed' );
		}

		// Be gentle with the geocoding endpoint.
		usleep( 120000 );
	}

	// Recompute how many of the curated set are still not present.
	$remaining = 0;

	foreach ( justice_ops_court_seed_data() as $court ) {
		if ( ! justice_ops_place_title_exists( $court['name'] ) ) {
			$remaining++;
		}
	}

	if ( $created > 0 ) {
		if ( function_exists( 'justice_ops_purge_map_feed_cache' ) ) {
			justice_ops_purge_map_feed_cache();
		} else {
			delete_transient( 'justice_map_geojson_v1' );
			delete_transient( 'justice_map_geojson_v2' );
		}
	}

	return array(
		'created'        => $created,
		'skipped_exists' => $skipped_exists,
		'skipped_near'   => $skipped_near,
		'failed'         => $failed,
		'remaining'      => $remaining,
		'total_curated'  => count( justice_ops_court_seed_data() ),
		'report'         => $report,
	);
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/seed-courts', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'args'                => array(
			'limit' => array(
				'default'           => 60,
				'sanitize_callback' => 'absint',
			),
		),
		'callback'            => function ( WP_REST_Request $request ) {
			return justice_ops_seed_courts( (int) $request->get_param( 'limit' ) );
		},
	) );
} );
