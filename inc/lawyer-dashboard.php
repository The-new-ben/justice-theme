<?php
/**
 * Lawyer dashboard page seeding.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_seed_lawyer_dashboard_page(): void {
	if ( ! current_user_can( 'manage_options' ) || get_option( 'justice_lawyer_dashboard_page_seeded_v1' ) ) {
		return;
	}

	if ( get_page_by_path( 'lawyer-dashboard', OBJECT, 'page' ) ) {
		update_option( 'justice_lawyer_dashboard_page_seeded_v1', 1, false );
		return;
	}

	wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => 'lawyer-dashboard',
		'post_title'   => 'אזור אישי לעורכי דין',
		'post_content' => '',
		'meta_input'   => array(
			'_wp_page_template' => 'page-lawyer-dashboard.php',
		),
	) );

	update_option( 'justice_lawyer_dashboard_page_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_lawyer_dashboard_page' );

function justice_theme_lawyer_dashboard_profile_completeness( int $post_id ): int {
	$fields = array(
		'lawyer_full_name',
		'firm_name',
		'bio_short',
		'bio_long',
		'phone',
		'email',
		'whatsapp',
		'cities_served',
		'languages',
		'profile_video_url',
	);

	$filled = 0;
	foreach ( $fields as $field ) {
		if ( get_post_meta( $post_id, $field, true ) ) {
			$filled++;
		}
	}

	return (int) round( ( $filled / count( $fields ) ) * 100 );
}
