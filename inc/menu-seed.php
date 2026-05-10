<?php
/**
 * Menu Auto-Seeder — justice-theme
 *
 * Runs ONCE when the primary menu (ID: 712) is empty.
 * Adds all required navigation items and assigns to Primary location.
 * Sets a transient after completion so it never runs again.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Seed the primary menu with the full navigation structure.
 * Fires on admin_init but only once (guarded by option flag).
 */
function justice_theme_seed_primary_menu() {
	// Guard: run once only
	if ( get_option( 'justice_menu_seeded_v3' ) ) {
		return;
	}

	// Find or create the primary menu
	$menu_name     = 'תפריט ראשי';
	$menu_location = 'primary';

	// Check if menu already exists by name
	$existing_menu = get_term_by( 'name', $menu_name, 'nav_menu' );

	if ( $existing_menu ) {
		$menu_id = $existing_menu->term_id;
	} else {
		$menu_id = wp_create_nav_menu( $menu_name );
		if ( is_wp_error( $menu_id ) ) {
			return; // Cannot create menu — abort
		}
	}

	// Check if menu already has items
	$existing_items = wp_get_nav_menu_items( $menu_id );
	if ( ! empty( $existing_items ) ) {
		// Menu has items — just make sure location is assigned
		$locations = get_theme_mod( 'nav_menu_locations', array() );
		$locations[ $menu_location ] = (int) $menu_id;
		set_theme_mod( 'nav_menu_locations', $locations );
		update_option( 'justice_menu_seeded_v3', true );
		return;
	}

	// ── Menu Item Definitions ───────────────────────────────
	$menu_items = array(

		// Top-level items
		array(
			'title'     => 'עמוד הבית',
			'url'       => home_url( '/' ),
			'order'     => 1,
			'parent_id' => 0,
		),
		array(
			'title'     => 'עורכי דין',
			'url'       => home_url( '/lawyers/' ),
			'order'     => 2,
			'parent_id' => 0,
		),
		array(
			'title'     => 'תחומי משפט',
			'url'       => '#',
			'order'     => 3,
			'parent_id' => 0,
			'slug'      => 'practice-areas-parent',
		),
		array(
			'title'     => 'מאמרים משפטיים',
			'url'       => home_url( '/articles/' ),
			'order'     => 10,
			'parent_id' => 0,
		),
		array(
			'title'     => 'ייעוץ משפטי',
			'url'       => home_url( '/contact/' ),
			'order'     => 11,
			'parent_id' => 0,
		),
		array(
			'title'     => 'מצאו עורך דין',
			'url'       => home_url( '/lawyers/' ),
			'order'     => 12,
			'parent_id' => 0,
			'classes'   => 'menu-item--cta',
		),
	);

	// ── Sub-items under תחומי משפט ──────────────────────────
	$practice_area_children = array(
		array( 'title' => 'משפחה וגירושין', 'url' => home_url( '/lawyers/?area=family-law' ), 'order' => 4 ),
		array( 'title' => 'משפט פלילי',       'url' => home_url( '/lawyers/?area=criminal-law' ), 'order' => 5 ),
		array( 'title' => 'מקרקעין ונדל"ן',   'url' => home_url( '/lawyers/?area=real-estate-law' ), 'order' => 6 ),
		array( 'title' => 'דיני עבודה',        'url' => home_url( '/lawyers/?area=labor-law' ), 'order' => 7 ),
		array( 'title' => 'נזיקין ותאונות',    'url' => home_url( '/lawyers/?area=torts' ), 'order' => 8 ),
		array( 'title' => 'תעבורה',             'url' => home_url( '/lawyers/?area=traffic-law' ), 'order' => 9 ),
	);

	// Try to get real practice-area terms instead of static URLs
	$real_terms = get_terms( array(
		'taxonomy'   => 'practice-areas',
		'hide_empty' => false,
		'number'     => 8,
		'orderby'    => 'count',
		'order'      => 'DESC',
	) );

	if ( ! empty( $real_terms ) && ! is_wp_error( $real_terms ) ) {
		$practice_area_children = array();
		$sub_order = 4;
		foreach ( $real_terms as $term ) {
			$practice_area_children[] = array(
				'title' => $term->name,
				'url'   => get_term_link( $term ),
				'order' => $sub_order++,
			);
		}
	}

	// ── Insert top-level items ──────────────────────────────
	$parent_map = array(); // slug => item_id

	foreach ( $menu_items as $item ) {
		$args = array(
			'menu-item-title'  => $item['title'],
			'menu-item-url'    => $item['url'],
			'menu-item-status' => 'publish',
			'menu-item-type'   => 'custom',
			'menu-item-parent-id' => 0,
			'menu-item-position'  => $item['order'],
		);

		if ( ! empty( $item['classes'] ) ) {
			$args['menu-item-classes'] = $item['classes'];
		}

		$item_id = wp_update_nav_menu_item( $menu_id, 0, $args );

		if ( ! is_wp_error( $item_id ) && ! empty( $item['slug'] ) ) {
			$parent_map[ $item['slug'] ] = $item_id;
		}
	}

	// ── Insert practice-area children ──────────────────────
	if ( isset( $parent_map['practice-areas-parent'] ) ) {
		$parent_id = $parent_map['practice-areas-parent'];

		foreach ( $practice_area_children as $child ) {
			wp_update_nav_menu_item( $menu_id, 0, array(
				'menu-item-title'     => $child['title'],
				'menu-item-url'       => $child['url'],
				'menu-item-status'    => 'publish',
				'menu-item-type'      => 'custom',
				'menu-item-parent-id' => $parent_id,
				'menu-item-position'  => $child['order'],
			) );
		}
	}

	// ── Assign to Primary location ─────────────────────────
	$locations = get_theme_mod( 'nav_menu_locations', array() );
	$locations[ $menu_location ] = (int) $menu_id;
	set_theme_mod( 'nav_menu_locations', $locations );

	// ── Mark as done ───────────────────────────────────────
	update_option( 'justice_menu_seeded_v3', true );
}
add_action( 'init', 'justice_theme_seed_primary_menu' );

/**
 * Repair known stale practice-area filter URLs in already-seeded menus.
 */
function justice_theme_repair_seeded_menu_area_urls(): void {
	if ( get_option( 'justice_menu_area_urls_repaired_v1' ) ) {
		return;
	}

	$replacements = array(
		home_url( '/lawyers/?area=family' )      => home_url( '/lawyers/?area=family-law' ),
		home_url( '/lawyers/?area=criminal' )    => home_url( '/lawyers/?area=criminal-law' ),
		home_url( '/lawyers/?area=real-estate' ) => home_url( '/lawyers/?area=real-estate-law' ),
		home_url( '/lawyers/?area=labor' )       => home_url( '/lawyers/?area=labor-law' ),
		home_url( '/lawyers/?area=traffic' )     => home_url( '/lawyers/?area=traffic-law' ),
	);

	$menus = wp_get_nav_menus();
	foreach ( $menus as $menu ) {
		$items = wp_get_nav_menu_items( $menu->term_id );
		if ( empty( $items ) || is_wp_error( $items ) ) {
			continue;
		}

		foreach ( $items as $item ) {
			if ( empty( $item->url ) || ! isset( $replacements[ $item->url ] ) ) {
				continue;
			}

			wp_update_nav_menu_item(
				$menu->term_id,
				$item->ID,
				array(
					'menu-item-title'     => $item->title,
					'menu-item-url'       => $replacements[ $item->url ],
					'menu-item-status'    => 'publish',
					'menu-item-type'      => 'custom',
					'menu-item-parent-id' => (int) $item->menu_item_parent,
					'menu-item-position'  => (int) $item->menu_order,
				)
			);
		}
	}

	update_option( 'justice_menu_area_urls_repaired_v1', time(), false );
}
add_action( 'admin_init', 'justice_theme_repair_seeded_menu_area_urls' );
