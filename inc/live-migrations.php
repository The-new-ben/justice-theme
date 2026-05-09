<?php
/**
 * Small live data migrations that keep Git-synced code and WordPress data aligned.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Move the one verified lawyer profile to the approved English slug.
 *
 * This is deliberately narrow: it only targets Maya Rotenberg by title and only
 * changes the post_name field for the justice_lawyer CPT.
 */
function justice_theme_migrate_maya_rotenberg_slug(): void {
	if ( get_option( 'justice_theme_maya_slug_migrated_v1' ) ) {
		return;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$current = get_page_by_path( 'advocate-maya-rotenberg', OBJECT, 'justice_lawyer' );
	if ( $current instanceof WP_Post ) {
		update_option( 'justice_theme_maya_slug_migrated_v1', time(), false );
		return;
	}

	$candidates = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'any',
			's'              => 'מאיה רוטנברג',
			'posts_per_page' => 5,
		)
	);

	foreach ( $candidates as $candidate ) {
		if ( false === mb_strpos( $candidate->post_title, 'מאיה' ) || false === mb_strpos( $candidate->post_title, 'רוטנברג' ) ) {
			continue;
		}

		wp_update_post(
			array(
				'ID'        => $candidate->ID,
				'post_name' => 'advocate-maya-rotenberg',
			)
		);
		update_option( 'justice_theme_maya_slug_migrated_v1', time(), false );
		return;
	}
}
add_action( 'init', 'justice_theme_migrate_maya_rotenberg_slug', 30 );

/**
 * Redirect the old Hebrew Maya URL to the English URL after migration.
 */
function justice_theme_redirect_old_maya_rotenberg_slug(): void {
	$path = isset( $_SERVER['REQUEST_URI'] ) ? rawurldecode( (string) wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';

	if ( false === mb_strpos( $path, '/lawyers/' ) || false === mb_strpos( $path, 'מאיה' ) || false === mb_strpos( $path, 'רוטנברג' ) ) {
		return;
	}

	wp_safe_redirect( home_url( '/lawyers/advocate-maya-rotenberg/' ), 301 );
	exit;
}
add_action( 'template_redirect', 'justice_theme_redirect_old_maya_rotenberg_slug', 1 );
