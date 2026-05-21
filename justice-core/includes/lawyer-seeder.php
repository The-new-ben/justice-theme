<?php
/**
 * Lawyer seed tool — creates draft profiles from CSV for testing.
 *
 * WP-CLI: wp eval 'justice_core_run_seed();'
 * Admin: Tools → Justice Seed (if admin page exists)
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Create a single lawyer profile from row data.
 *
 * @param array $row Associative array matching CSV columns.
 * @return int|WP_Error Post ID or error.
 */
function justice_core_seed_lawyer_profile( $row ) {
	// Check if already exists by title
	$existing = get_page_by_title( $row['name'], OBJECT, 'justice_lawyer' );
	if ( $existing ) {
		return $existing->ID; // Skip duplicates
	}

	$post_id = wp_insert_post( array(
		'post_type'   => 'justice_lawyer',
		'post_status' => 'draft',
		'post_title'  => sanitize_text_field( $row['name'] ),
		'post_excerpt' => sanitize_text_field( $row['firm_name'] ?? '' ),
	) );

	if ( is_wp_error( $post_id ) || ! $post_id ) {
		return $post_id;
	}

	// Set meta fields
	$meta_fields = array(
		'firm_name'           => $row['firm_name'] ?? '',
		'phone'               => $row['phone'] ?? '',
		'email'               => $row['email'] ?? '',
		'website'             => $row['website'] ?? '',
		'source_url'          => $row['source_url'] ?? '',
		'profile_status'      => $row['profile_status'] ?? 'draft',
		'verification_status' => $row['verification_status'] ?? 'unverified',
		'internal_notes'      => $row['notes'] ?? 'Seed profile for internal testing only.',
		'plan_type'           => 'free',
		'subscription_status' => 'inactive',
		'lead_routing_enabled' => '0',
		'source_type'         => 'seed',
		'license_status'      => 'active',
	);

	foreach ( $meta_fields as $key => $value ) {
		if ( $value !== '' ) {
			update_post_meta( $post_id, $key, sanitize_text_field( $value ) );
		}
	}

	// Set city taxonomy
	if ( ! empty( $row['city'] ) ) {
		$city_name = trim( $row['city'] );
		wp_set_object_terms( $post_id, $city_name, 'city', false );
	}

	// Set practice areas
	if ( ! empty( $row['practice_areas'] ) ) {
		$areas = array_map( 'trim', explode( ',', $row['practice_areas'] ) );
		wp_set_object_terms( $post_id, $areas, 'practice-areas', false );
	}

	return $post_id;
}

/**
 * Run the full seeder from the CSV file.
 *
 * @return array Results summary.
 */
function justice_core_run_seed() {
	$csv_path = JUSTICE_CORE_DIR . '../project-control/lawyer-seed.csv';

	// Also check plugin directory
	if ( ! file_exists( $csv_path ) ) {
		$csv_path = JUSTICE_CORE_DIR . 'data/lawyer-seed.csv';
	}

	if ( ! file_exists( $csv_path ) ) {
		return array( 'error' => 'CSV file not found at: ' . $csv_path );
	}

	$handle = fopen( $csv_path, 'r' );
	if ( ! $handle ) {
		return array( 'error' => 'Could not open CSV file.' );
	}

	$headers = fgetcsv( $handle );
	$results = array( 'created' => 0, 'skipped' => 0, 'errors' => 0 );

	while ( ( $data = fgetcsv( $handle ) ) !== false ) {
		if ( count( $data ) !== count( $headers ) ) {
			$results['errors']++;
			continue;
		}

		$row = array_combine( $headers, $data );
		$result = justice_core_seed_lawyer_profile( $row );

		if ( is_wp_error( $result ) ) {
			$results['errors']++;
		} elseif ( get_post_status( $result ) === 'draft' ) {
			$results['created']++;
		} else {
			$results['skipped']++;
		}
	}

	fclose( $handle );
	return $results;
}

/**
 * REST endpoint for seeding.
 */
function justice_core_register_seed_route() {
	register_rest_route( 'justice-core/v1', '/seed-lawyers', array(
		'methods'             => 'POST',
		'callback'            => function () {
			$results = justice_core_run_seed();
			return new WP_REST_Response( $results, 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );
}
add_action( 'rest_api_init', 'justice_core_register_seed_route' );
