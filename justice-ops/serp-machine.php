<?php
/**
 * SERP title machine: the compounding rank loop.
 *
 * Weekly, the machine pulls Search Console strike-zone rows (positions 4-15
 * with real impressions), picks the strongest query per page, writes a
 * cleaner keyword-first title under the iron rules, applies it to both title
 * channels (theme seo_title meta and Yoast) and records a full experiment
 * with the baseline. Three weeks later it re-measures: clear losers revert
 * automatically, winners stay. Capped, logged, reversible.
 *
 * The service account key lives ONLY in a non-autoloaded option on the live
 * database. It is never in the repo and never printed.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// GSC client (service account JWT, RS256 via openssl)
// ---------------------------------------------------------------------------

function justice_gsc_token(): string {
	$cached = get_transient( 'justice_gsc_token' );

	if ( is_string( $cached ) && '' !== $cached ) {
		return $cached;
	}

	$sa = json_decode( (string) get_option( 'justice_gsc_sa', '' ), true );

	if ( empty( $sa['client_email'] ) || empty( $sa['private_key'] ) ) {
		return '';
	}

	$now    = time();
	$header = rtrim( strtr( base64_encode( wp_json_encode( array( 'alg' => 'RS256', 'typ' => 'JWT' ) ) ), '+/', '-_' ), '=' );
	$claims = rtrim( strtr( base64_encode( wp_json_encode( array(
		'iss'   => $sa['client_email'],
		'scope' => 'https://www.googleapis.com/auth/webmasters.readonly',
		'aud'   => 'https://oauth2.googleapis.com/token',
		'iat'   => $now,
		'exp'   => $now + 3600,
	) ) ), '+/', '-_' ), '=' );

	$signature = '';

	if ( ! openssl_sign( $header . '.' . $claims, $signature, $sa['private_key'], 'sha256WithRSAEncryption' ) ) {
		return '';
	}

	$jwt      = $header . '.' . $claims . '.' . rtrim( strtr( base64_encode( $signature ), '+/', '-_' ), '=' );
	$response = wp_remote_post( 'https://oauth2.googleapis.com/token', array(
		'timeout' => 15,
		'body'    => array(
			'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			'assertion'  => $jwt,
		),
	) );

	if ( is_wp_error( $response ) ) {
		return '';
	}

	$data  = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	$token = (string) ( $data['access_token'] ?? '' );

	if ( $token ) {
		set_transient( 'justice_gsc_token', $token, 50 * MINUTE_IN_SECONDS );
	}

	return $token;
}

function justice_gsc_query( array $body ): array {
	$token = justice_gsc_token();

	if ( '' === $token ) {
		return array( 'error' => 'no token' );
	}

	$response = wp_remote_post(
		'https://searchconsole.googleapis.com/webmasters/v3/sites/' . rawurlencode( (string) get_option( 'justice_gsc_property', 'https://jus-tice.co.il/' ) ) . '/searchAnalytics/query',
		array(
			'timeout' => 25,
			'headers' => array( 'Authorization' => 'Bearer ' . $token, 'Content-Type' => 'application/json' ),
			'body'    => wp_json_encode( $body ),
		)
	);

	if ( is_wp_error( $response ) ) {
		return array( 'error' => $response->get_error_message() );
	}

	return (array) json_decode( (string) wp_remote_retrieve_body( $response ), true );
}

// ---------------------------------------------------------------------------
// Scan: strike-zone candidates
// ---------------------------------------------------------------------------

function justice_serp_scan( int $limit = 5 ): array {
	$data = justice_gsc_query( array(
		'startDate'  => wp_date( 'Y-m-d', time() - 28 * DAY_IN_SECONDS ),
		'endDate'    => wp_date( 'Y-m-d', time() - 2 * DAY_IN_SECONDS ),
		'dimensions' => array( 'page', 'query' ),
		'rowLimit'   => 1000,
	) );

	if ( isset( $data['error'] ) ) {
		return array( 'error' => $data['error'] );
	}

	$experiments = get_option( 'justice_serp_experiments', array() );
	$active_pages = array();

	foreach ( $experiments as $exp ) {
		if ( 'active' === ( $exp['status'] ?? '' ) ) {
			$active_pages[ $exp['page'] ] = true;
		}
	}

	$best = array();

	foreach ( (array) ( $data['rows'] ?? array() ) as $row ) {
		$page  = (string) $row['keys'][0];
		$query = (string) $row['keys'][1];
		$pos   = (float) $row['position'];
		$impr  = (int) $row['impressions'];

		if ( $pos < 4 || $pos > 15 || $impr < 300 || isset( $active_pages[ $page ] ) ) {
			continue;
		}

		if ( ! isset( $best[ $page ] ) || $impr > $best[ $page ]['impressions'] ) {
			$best[ $page ] = array(
				'page'        => $page,
				'query'       => $query,
				'position'    => round( $pos, 1 ),
				'impressions' => $impr,
				'ctr'         => round( (float) $row['ctr'] * 100, 2 ),
			);
		}
	}

	usort( $best, static function ( $a, $b ) {
		return $b['impressions'] <=> $a['impressions'];
	} );

	return array_slice( array_values( $best ), 0, $limit );
}

// ---------------------------------------------------------------------------
// Title generation under the iron rules
// ---------------------------------------------------------------------------

function justice_serp_new_title( string $current, string $query ): string {
	if ( ! defined( 'JUSTICE_OPENAI_KEY' ) || '' === JUSTICE_OPENAI_KEY ) {
		return '';
	}

	$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', array(
		'timeout' => 40,
		'headers' => array( 'Authorization' => 'Bearer ' . JUSTICE_OPENAI_KEY, 'Content-Type' => 'application/json' ),
		'body'    => wp_json_encode( array(
			'model'    => get_option( 'justice_art_model', 'gpt-4.1' ),
			'messages' => array(
				array( 'role' => 'system', 'content' => 'אתה כותב כותרות SEO בעברית לאתר משפטי. כללי ברזל: בלי קו מפריד ארוך, בלי סופרלטיבים, בלי הבטחות תוצאה, בלי סימני קריאה. מבנה: הביטוי המרכזי בתחילת הכותרת, אחריו נקודתיים והרחבה עניינית קצרה. אורך 45 עד 60 תווים לפני הסיומת. סיים תמיד בסיומת " | Jus-Tice". החזר את הכותרת בלבד.' ),
				array( 'role' => 'user', 'content' => 'ביטוי מרכזי: ' . $query . "\nכותרת נוכחית: " . $current . "\nכתוב כותרת חדשה וחזקה יותר." ),
			),
			'temperature' => 0.4,
			'max_tokens'  => 80,
		) ),
	) );

	if ( is_wp_error( $response ) ) {
		return '';
	}

	$data  = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	$title = trim( (string) ( $data['choices'][0]['message']['content'] ?? '' ), " \"'\n" );

	// Deterministic scrub: dashes out, whitespace collapsed.
	$title = str_replace( array( '—', '–', ' - ' ), array( ': ', ': ', ': ' ), $title );
	$title = preg_replace( '/\s+/u', ' ', $title );

	$core = mb_strlen( str_replace( ' | Jus-Tice', '', $title ) );

	// The query's lead word must appear; length must stay in the window.
	$lead = preg_split( '/\s+/u', trim( $query ) )[0] ?? '';

	if ( '' === $title || $core < 25 || $core > 70 || ( $lead && false === mb_strpos( $title, $lead ) ) ) {
		return '';
	}

	return $title;
}

// ---------------------------------------------------------------------------
// Apply, measure, revert
// ---------------------------------------------------------------------------

function justice_serp_apply_one(): array {
	$scan = justice_serp_scan( 5 );

	if ( isset( $scan['error'] ) ) {
		return $scan;
	}

	foreach ( $scan as $candidate ) {
		$pid = url_to_postid( $candidate['page'] );

		if ( ! $pid ) {
			continue;
		}

		$current = (string) get_post_meta( $pid, '_yoast_wpseo_title', true );

		if ( '' === $current ) {
			$current = (string) get_post_meta( $pid, 'seo_title', true );
		}

		if ( '' === $current ) {
			$current = get_the_title( $pid );
		}

		$title = justice_serp_new_title( $current, $candidate['query'] );

		if ( '' === $title || $title === $current ) {
			continue;
		}

		update_post_meta( $pid, '_yoast_wpseo_title', $title );
		update_post_meta( $pid, 'seo_title', $title );
		wp_update_post( array( 'ID' => $pid ) );

		$experiments   = get_option( 'justice_serp_experiments', array() );
		$experiments[] = array(
			'page'       => $candidate['page'],
			'pid'        => $pid,
			'query'      => $candidate['query'],
			'old_title'  => $current,
			'new_title'  => $title,
			'applied_at' => wp_date( 'Y-m-d' ),
			'baseline'   => array( 'position' => $candidate['position'], 'ctr' => $candidate['ctr'], 'impressions' => $candidate['impressions'] ),
			'status'     => 'active',
		);
		update_option( 'justice_serp_experiments', array_slice( $experiments, -60 ), false );

		wp_mail(
			get_option( 'admin_email' ),
			'[Jus-Tice SERP] כותרת עודכנה: ' . $candidate['query'],
			'העמוד: ' . $candidate['page'] . "\nביטוי: " . $candidate['query'] . ' (מיקום ' . $candidate['position'] . ', ' . $candidate['impressions'] . " חשיפות)\n\nכותרת קודמת:\n" . $current . "\n\nכותרת חדשה:\n" . $title . "\n\nהמדידה אוטומטית בעוד שלושה שבועות; ירידה ברורה מחזירה את הכותרת הקודמת לבד."
		);

		return array( 'applied' => true, 'pid' => $pid, 'page' => $candidate['page'], 'query' => $candidate['query'], 'new_title' => $title );
	}

	return array( 'applied' => false, 'why' => 'no viable candidate' );
}

function justice_serp_measure(): array {
	$experiments = get_option( 'justice_serp_experiments', array() );
	$changed     = 0;

	foreach ( $experiments as $i => $exp ) {
		if ( 'active' !== ( $exp['status'] ?? '' ) || $exp['applied_at'] > wp_date( 'Y-m-d', time() - 21 * DAY_IN_SECONDS ) ) {
			continue;
		}

		$data = justice_gsc_query( array(
			'startDate'         => wp_date( 'Y-m-d', time() - 14 * DAY_IN_SECONDS ),
			'endDate'           => wp_date( 'Y-m-d', time() - 2 * DAY_IN_SECONDS ),
			'dimensions'        => array( 'query' ),
			'rowLimit'          => 1,
			'dimensionFilterGroups' => array( array( 'filters' => array(
				array( 'dimension' => 'page', 'operator' => 'equals', 'expression' => $exp['page'] ),
				array( 'dimension' => 'query', 'operator' => 'equals', 'expression' => $exp['query'] ),
			) ) ),
		) );

		$row = $data['rows'][0] ?? null;

		if ( ! $row ) {
			continue;
		}

		$ctr_now = (float) $row['ctr'] * 100;
		$pos_now = (float) $row['position'];
		$worse   = $ctr_now < 0.8 * (float) $exp['baseline']['ctr'] && $pos_now >= (float) $exp['baseline']['position'];

		if ( $worse ) {
			update_post_meta( (int) $exp['pid'], '_yoast_wpseo_title', $exp['old_title'] );
			update_post_meta( (int) $exp['pid'], 'seo_title', $exp['old_title'] );
			wp_update_post( array( 'ID' => (int) $exp['pid'] ) );
			$experiments[ $i ]['status'] = 'reverted';
		} else {
			$experiments[ $i ]['status'] = 'won';
		}

		$experiments[ $i ]['result'] = array( 'position' => round( $pos_now, 1 ), 'ctr' => round( $ctr_now, 2 ), 'decided_at' => wp_date( 'Y-m-d' ) );
		$changed++;
	}

	if ( $changed ) {
		update_option( 'justice_serp_experiments', $experiments, false );
	}

	return array( 'decided' => $changed );
}

// ---------------------------------------------------------------------------
// Cadence + endpoints
// ---------------------------------------------------------------------------

add_action( 'justice_serp_tick', function () {
	if ( ! (int) get_option( 'justice_serp_auto', 1 ) ) {
		return;
	}

	justice_serp_measure();
	justice_serp_apply_one();
} );

add_action( 'init', function () {
	if ( ! wp_next_scheduled( 'justice_serp_tick' ) ) {
		wp_schedule_event( time() + 900, 'weekly', 'justice_serp_tick' );
	}
} );

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/serp-status', array(
		'methods'             => 'GET',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function () {
			return array(
				'auto'        => (int) get_option( 'justice_serp_auto', 1 ),
				'key_present' => '' !== (string) get_option( 'justice_gsc_sa', '' ),
				'experiments' => get_option( 'justice_serp_experiments', array() ),
			);
		},
	) );

	register_rest_route( 'justice-ops/v1', '/serp-run', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			if ( (int) $request->get_param( 'dry' ) ) {
				return array( 'scan' => justice_serp_scan( 5 ) );
			}

			return array( 'measure' => justice_serp_measure(), 'apply' => justice_serp_apply_one() );
		},
	) );
} );
