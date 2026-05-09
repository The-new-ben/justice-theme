<?php
/**
 * Justice Core — Lawyer Seeder (v4)
 *
 * Two modes:
 * 1. Admin-init auto-seed: creates 10 demo lawyers once (uje_seeded_v4 flag).
 * 2. CSV seeder via REST POST /seed-lawyers — reads project-control/lawyer-seed.csv.
 *
 * REST: POST /wp-json/ultra-justice-engine/v1/seed-lawyers (admin only)
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ─── Auto-seed on admin_init (runs once) ────────────────────────────────────

add_action( 'admin_init', 'uje_maybe_auto_seed' );

function uje_maybe_auto_seed(): void {
	if ( get_option( 'uje_seeded_v4' ) ) {
		return;
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$city_map = array(
		'tel-aviv'      => 'תל אביב',
		'jerusalem'     => 'ירושלים',
		'haifa'         => 'חיפה',
		'beer-sheva'    => 'באר שבע',
		'ramat-gan'     => 'רמת גן',
		'herzliya'      => 'הרצליה',
		'netanya'       => 'נתניה',
		'petah-tikva'   => 'פתח תקווה',
		'rishon-lezion' => 'ראשון לציון',
		'ashdod'        => 'אשדוד',
	);

	$lawyers = array(
		array( 'heb' => 'עו"ד מאיה רוטנברג',  'firm' => 'משרד רוטנברג — דיני משפחה',   'area' => 'family-law',     'area_heb' => 'דיני משפחה',  'city' => 'tel-aviv',      'phone' => '03-5551234', 'whatsapp' => '0545551234', 'years' => 18, 'priority' => 100, 'bio' => 'מומחית בדיני משפחה, גירושין ומשמורת ילדים. מעל 18 שנות ניסיון.' ),
		array( 'heb' => 'עו"ד דוד כהן',        'firm' => 'כהן — הגנה פלילית',           'area' => 'criminal-law',   'area_heb' => 'משפט פלילי',  'city' => 'jerusalem',     'phone' => '02-5559876', 'whatsapp' => '0505559876', 'years' => 22, 'priority' => 95,  'bio' => 'עורך דין פלילי בכיר, מומחה בעבירות צווארון לבן והונאה.' ),
		array( 'heb' => 'עו"ד שרה לוי',        'firm' => 'לוי נדל"ן ומקרקעין',          'area' => 'real-estate',    'area_heb' => 'מקרקעין',     'city' => 'haifa',         'phone' => '04-5553456', 'whatsapp' => '0525553456', 'years' => 15, 'priority' => 90,  'bio' => 'מתמחה בעסקאות נדל"ן, ליקויי בנייה ורישום טאבו.' ),
		array( 'heb' => 'עו"ד יוסי מזרחי',     'firm' => 'מזרחי — דיני עבודה',          'area' => 'labor-law',      'area_heb' => 'דיני עבודה',  'city' => 'tel-aviv',      'phone' => '03-5557890', 'whatsapp' => '0545557890', 'years' => 12, 'priority' => 85,  'bio' => 'מומחה בזכויות עובדים, פיטורים שלא כדין ופנסיה.' ),
		array( 'heb' => 'עו"ד נועה שפירא',     'firm' => 'שפירא — גישור ומשפחה',        'area' => 'family-law',     'area_heb' => 'דיני משפחה',  'city' => 'ramat-gan',     'phone' => '03-5552345', 'whatsapp' => '0535552345', 'years' => 10, 'priority' => 80,  'bio' => 'עורכת דין לענייני משפחה עם דגש על גישור.' ),
		array( 'heb' => 'עו"ד אבי בן-דוד',    'firm' => 'בן-דוד — תעבורה',             'area' => 'traffic-law',    'area_heb' => 'דיני תעבורה', 'city' => 'beer-sheva',    'phone' => '08-5556789', 'whatsapp' => '0505556789', 'years' => 8,  'priority' => 75,  'bio' => 'מתמחה בביטול דוחות תנועה ועבירות נהיגה.' ),
		array( 'heb' => 'עו"ד תמר גולדשטיין', 'firm' => 'גולדשטיין — צוואות וירושות',  'area' => 'inheritance',    'area_heb' => 'דיני ירושה',  'city' => 'herzliya',      'phone' => '09-5551122', 'whatsapp' => '0545551122', 'years' => 20, 'priority' => 88,  'bio' => 'מומחית בצוואות, ירושות וניהול עיזבון.' ),
		array( 'heb' => 'עו"ד משה פרץ',        'firm' => 'פרץ — הגנה פלילית',           'area' => 'criminal-law',   'area_heb' => 'משפט פלילי',  'city' => 'petah-tikva',   'phone' => '03-5553344', 'whatsapp' => '0535553344', 'years' => 25, 'priority' => 92,  'bio' => 'עורך דין פלילי ותיק, ייצוג בכל הערכאות.' ),
		array( 'heb' => 'עו"ד ליאת אברהם',     'firm' => 'אברהם — משפט מסחרי',          'area' => 'commercial-law', 'area_heb' => 'משפט מסחרי', 'city' => 'netanya',       'phone' => '09-5555566', 'whatsapp' => '0545555566', 'years' => 14, 'priority' => 82,  'bio' => 'מתמחה בדיני חברות, חוזים מסחריים וליטיגציה אזרחית.' ),
		array( 'heb' => 'עו"ד איתן כץ',        'firm' => 'כץ — נזיקין ופיצויים',        'area' => 'tort-law',       'area_heb' => 'דיני נזיקין', 'city' => 'rishon-lezion', 'phone' => '03-5557788', 'whatsapp' => '0535557788', 'years' => 16, 'priority' => 86,  'bio' => 'מומחה בתביעות נזיקין, תאונות עבודה ורשלנות רפואית.' ),
	);

	foreach ( $lawyers as $l ) {
		$existing = get_posts( array(
			'post_type'      => 'justice_lawyer',
			'title'          => $l['heb'],
			'posts_per_page' => 1,
			'post_status'    => 'any',
			'fields'         => 'ids',
		) );

		if ( ! empty( $existing ) ) {
			// Update missing meta on existing
			$id = $existing[0];
			if ( 100 === (int) $l['priority'] && 'advocate-maya-rotenberg' !== get_post_field( 'post_name', $id ) ) {
				wp_update_post( array(
					'ID'        => $id,
					'post_name' => 'advocate-maya-rotenberg',
				) );
			}
			if ( ! get_post_meta( $id, 'priority_score', true ) ) {
				update_post_meta( $id, 'priority_score', $l['priority'] );
				update_post_meta( $id, 'firm_name',      $l['firm'] );
				update_post_meta( $id, 'whatsapp',       $l['whatsapp'] );
			}
			continue;
		}

		$post_id = wp_insert_post( array(
			'post_type'    => 'justice_lawyer',
			'post_title'   => $l['heb'],
			'post_name'    => 100 === (int) $l['priority'] ? 'advocate-maya-rotenberg' : 'seed-lawyer-' . sanitize_title( $l['area'] ) . '-' . absint( $l['priority'] ),
			'post_content' => $l['bio'],
			'post_status'  => 'draft',
			'post_excerpt' => $l['bio'],
		) );

		if ( is_wp_error( $post_id ) || ! $post_id ) {
			continue;
		}

		// Meta
		$meta = array(
			'lawyer_full_name'    => $l['heb'],
			'firm_name'           => $l['firm'],
			'phone'               => $l['phone'],
			'whatsapp'            => $l['whatsapp'],
			'years_experience'    => $l['years'],
			'priority_score'      => $l['priority'],
			'plan_type'           => 'free',
			'source_type'         => 'seed',
			'profile_status'      => 'draft',
			'license_status'      => 'active',
			'verification_status' => 'unverified',
			'internal_notes'      => 'Seed profile for testing only. Not verified and not approved for public endorsement.',
		);
		foreach ( $meta as $k => $v ) {
			update_post_meta( $post_id, $k, $v );
		}

		// City taxonomy — use Hebrew name
		$city_heb = $city_map[ $l['city'] ] ?? $l['city'];
		if ( ! term_exists( $l['city'], 'city' ) ) {
			wp_insert_term( $city_heb, 'city', array( 'slug' => $l['city'] ) );
		}
		wp_set_object_terms( $post_id, $l['city'], 'city' );

		// Practice area taxonomy
		if ( ! term_exists( $l['area'], 'practice-areas' ) ) {
			wp_insert_term( $l['area_heb'], 'practice-areas', array( 'slug' => $l['area'] ) );
		}
		wp_set_object_terms( $post_id, $l['area'], 'practice-areas' );
	}

	update_option( 'uje_seeded_v4', true );
	uje_log( 'seeder', 'Auto-seeded 10 lawyer profiles (v4).' );
}

// ─── CSV Seeder (from project-control/lawyer-seed.csv) ───────────────────────

function uje_seed_lawyer_profile( array $row ): int|WP_Error {
	$existing = get_posts( array(
		'post_type'      => 'justice_lawyer',
		'title'          => $row['name'],
		'posts_per_page' => 1,
		'post_status'    => 'any',
		'fields'         => 'ids',
	) );

	if ( ! empty( $existing ) ) {
		return $existing[0];
	}

	$post_id = wp_insert_post( array(
		'post_type'    => 'justice_lawyer',
		'post_status'  => 'draft',
		'post_title'   => sanitize_text_field( $row['name'] ),
		'post_name'    => ! empty( $row['slug'] ) ? sanitize_title( $row['slug'] ) : 'lawyer-' . time(),
		'post_excerpt' => sanitize_text_field( $row['firm_name'] ?? '' ),
	) );

	if ( is_wp_error( $post_id ) || ! $post_id ) {
		return is_wp_error( $post_id ) ? $post_id : new WP_Error( 'insert_failed', 'wp_insert_post returned 0.' );
	}

	$meta_fields = array(
		'firm_name'           => $row['firm_name']           ?? '',
		'phone'               => $row['phone']               ?? '',
		'email'               => $row['email']               ?? '',
		'website'             => $row['website']             ?? '',
		'source_url'          => $row['source_url']          ?? '',
		'profile_status'      => $row['profile_status']      ?? 'draft',
		'verification_status' => $row['verification_status'] ?? 'unverified',
		'internal_notes'      => $row['notes']               ?? 'Seed profile.',
		'plan_type'           => 'free',
		'subscription_status' => 'inactive',
		'lead_routing_enabled'=> '0',
		'source_type'         => 'seed',
		'license_status'      => 'active',
	);

	foreach ( $meta_fields as $key => $value ) {
		if ( '' !== $value ) {
			update_post_meta( $post_id, $key, sanitize_text_field( $value ) );
		}
	}

	if ( ! empty( $row['city'] ) ) {
		wp_set_object_terms( $post_id, trim( $row['city'] ), 'city', false );
	}

	if ( ! empty( $row['practice_areas'] ) ) {
		$areas = array_map( 'trim', explode( ',', $row['practice_areas'] ) );
		wp_set_object_terms( $post_id, $areas, 'practice-areas', false );
	}

	return $post_id;
}

function uje_run_seed(): array {
	$csv_path = UJE_DIR . '../project-control/lawyer-seed.csv';
	if ( ! file_exists( $csv_path ) ) {
		$csv_path = UJE_DIR . 'data/lawyer-seed.csv';
	}
	if ( ! file_exists( $csv_path ) ) {
		return array( 'error' => 'CSV file not found: ' . $csv_path );
	}

	$handle = fopen( $csv_path, 'r' );
	if ( ! $handle ) {
		return array( 'error' => 'Cannot open CSV file.' );
	}

	$headers = fgetcsv( $handle );
	$results = array( 'created' => 0, 'skipped' => 0, 'errors' => 0 );

	while ( ( $data = fgetcsv( $handle ) ) !== false ) {
		if ( count( $data ) !== count( $headers ) ) {
			$results['errors']++;
			continue;
		}
		$row    = array_combine( $headers, $data );
		$result = uje_seed_lawyer_profile( $row );

		if ( is_wp_error( $result ) ) {
			$results['errors']++;
		} elseif ( 'draft' === get_post_status( $result ) ) {
			$results['created']++;
		} else {
			$results['skipped']++;
		}
	}

	fclose( $handle );
	uje_log( 'seeder_csv', 'CSV seed completed.', $results );
	return $results;
}

// REST endpoint for manual seeding
add_action( 'rest_api_init', function () {
	register_rest_route( 'ultra-justice-engine/v1', '/seed-lawyers', array(
		'methods'             => 'POST',
		'callback'            => function () {
			return new WP_REST_Response( uje_run_seed(), 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );

	// Reset seed flag (forces re-seed)
	register_rest_route( 'ultra-justice-engine/v1', '/seed-reset', array(
		'methods'             => 'POST',
		'callback'            => function () {
			delete_option( 'uje_seeded_v4' );
			uje_log( 'seeder_reset', 'Seed flag cleared. Will re-seed on next admin_init.' );
			return new WP_REST_Response( array( 'ok' => true, 'message' => 'Seed flag cleared.' ), 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );
} );
