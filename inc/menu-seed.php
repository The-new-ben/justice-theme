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
 * Confirm that a permanent menu/CMS write has been explicitly enabled.
 *
 * The frontend has render-time fallback navigation, so WordPress menu creation
 * and menu-item repair should not run from an ordinary public page load.
 *
 * @param string $filter_name Boolean feature filter name.
 * @return bool
 */
function justice_theme_menu_cms_write_enabled( string $filter_name ): bool {
	return (bool) apply_filters( $filter_name, false );
}

/**
 * Seed the primary menu with the full navigation structure.
 * Runs only when explicitly enabled and only once (guarded by option flag).
 */
function justice_theme_seed_primary_menu() {
	if ( ! justice_theme_menu_cms_write_enabled( 'justice_theme_enable_primary_menu_seed' ) ) {
		return;
	}

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
		array( 'title' => 'נזיקין ותאונות',    'url' => home_url( '/lawyers/?area=personal-injury-law' ), 'order' => 8 ),
		array( 'title' => 'תעבורה',             'url' => home_url( '/lawyers/?area=traffic-law' ), 'order' => 9 ),
		array( 'title' => 'רשלנות רפואית',      'url' => home_url( '/lawyers/?area=medical-malpractice-law' ), 'order' => 10 ),
		array( 'title' => 'ירושה וצוואות',      'url' => home_url( '/lawyers/?area=inheritance-law' ), 'order' => 11 ),
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
add_action( 'admin_init', 'justice_theme_seed_primary_menu' );

/**
 * Repair known stale practice-area filter URLs in already-seeded menus.
 */
function justice_theme_repair_seeded_menu_area_urls(): void {
	if ( ! justice_theme_menu_cms_write_enabled( 'justice_theme_enable_seeded_menu_area_url_repair' ) ) {
		return;
	}

	if ( get_option( 'justice_menu_area_urls_repaired_v3' ) ) {
		return;
	}

	$replacements = array(
		home_url( '/lawyers/?area=family' )              => home_url( '/lawyers/?area=family-law' ),
		home_url( '/lawyers/?area=criminal' )            => home_url( '/lawyers/?area=criminal-law' ),
		home_url( '/lawyers/?area=real-estate' )         => home_url( '/lawyers/?area=real-estate-law' ),
		home_url( '/lawyers/?area=labor' )               => home_url( '/lawyers/?area=labor-law' ),
		home_url( '/lawyers/?area=employment-law' )      => home_url( '/lawyers/?area=labor-law' ),
		home_url( '/lawyers/?area=traffic' )             => home_url( '/lawyers/?area=traffic-law' ),
		home_url( '/lawyers/?area=torts' )               => home_url( '/lawyers/?area=personal-injury-law' ),
		home_url( '/lawyers/?area=inheritance' )         => home_url( '/lawyers/?area=inheritance-law' ),
		home_url( '/lawyers/?area=medical-malpractice' ) => home_url( '/lawyers/?area=medical-malpractice-law' ),
		home_url( '/lawyers/?area=medical_malpractice' ) => home_url( '/lawyers/?area=medical-malpractice-law' ),
		home_url( '/lawyers/?area=cyber-privacy' )       => home_url( '/lawyers/?area=privacy-cyber-law' ),
		home_url( '/lawyers/?area=privacy-cyber' )       => home_url( '/lawyers/?area=privacy-cyber-law' ),
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

	update_option( 'justice_menu_area_urls_repaired_v3', time(), false );
}
add_action( 'admin_init', 'justice_theme_repair_seeded_menu_area_urls' );

/**
 * Normalize legacy menu URLs at render time without writing to the CMS menu.
 *
 * @param array $atts Link attributes.
 * @return array
 */
function justice_theme_normalize_legacy_menu_link_attributes( array $atts ): array {
	if ( empty( $atts['href'] ) ) {
		return $atts;
	}

	$href  = html_entity_decode( (string) $atts['href'], ENT_QUOTES, get_bloginfo( 'charset' ) ?: 'UTF-8' );
	$query = (string) wp_parse_url( $href, PHP_URL_QUERY );

	if ( '' === $query ) {
		return $atts;
	}

	$params = array();
	wp_parse_str( $query, $params );

	if ( 315 === (int) ( $params['page_id'] ?? 0 ) ) {
		$atts['href'] = home_url( '/about/' );
	}

	return $atts;
}
add_filter( 'nav_menu_link_attributes', 'justice_theme_normalize_legacy_menu_link_attributes', 30 );

/**
 * Keep the public primary navigation commercially useful even when wp-admin has
 * an incomplete assigned menu. This does not replace the CMS menu; it only adds
 * missing portal-critical links until the menu is fixed in wp-admin.
 *
 * @param string $items Menu HTML.
 * @param object $args  Menu arguments.
 * @return string
 */
function justice_theme_append_customer_primary_menu_items( ?string $items, $args ): string {
	if ( null === $items ) {
		$items = '';
	}
	if ( empty( $args->theme_location ) || 'primary' !== $args->theme_location ) {
		return $items;
	}

	$required = array(
		array(
			'needle' => '/lawyers/',
			'html'   => '<li class="menu-item"><a href="' . esc_url( home_url( '/lawyers/' ) ) . '">עורכי דין</a></li>',
		),
		array(
			'needle' => 'practice-areas-menu',
			'html'   => justice_theme_primary_practice_menu_html(),
		),
		array(
			'needle' => '/articles/',
			'html'   => '<li class="menu-item"><a href="' . esc_url( home_url( '/articles/' ) ) . '">מאמרים משפטיים</a></li>',
		),
		array(
			'needle' => '#ask-lawyer',
			'html'   => '<li class="menu-item"><a href="' . esc_url( home_url( '/#ask-lawyer' ) ) . '">שאלות ותשובות</a></li>',
		),
		array(
			'needle' => '/lawyer-registration/',
			'html'   => '<li class="menu-item"><a href="' . esc_url( home_url( '/lawyer-registration/' ) ) . '">הצטרפות עורכי דין</a></li>',
		),
	);

	foreach ( $required as $item ) {
		if ( false === strpos( $items, $item['needle'] ) ) {
			$items .= $item['html'];
		}
	}

	return $items;
}
add_filter( 'wp_nav_menu_items', 'justice_theme_append_customer_primary_menu_items', 20, 2 );

/**
 * Build the hard minimum practice-area dropdown requested for customer-facing nav.
 *
 * @return string
 */
function justice_theme_primary_practice_menu_html(): string {
	$areas = array(
		'משפחה וגירושין'  => '/lawyers/?area=family-law',
		'פלילי'           => '/lawyers/?area=criminal-law',
		'תעבורה'          => '/lawyers/?area=traffic-law',
		'מקרקעין'         => '/lawyers/?area=real-estate-law',
		'נזיקין'          => '/lawyers/?area=personal-injury-law',
		'עבודה'           => '/lawyers/?area=labor-law',
		'ירושה וצוואות'   => '/lawyers/?area=inheritance-law',
		'רשלנות רפואית'  => '/lawyers/?area=medical-malpractice-law',
		'מיסים'           => '/lawyers/?area=tax-law',
		'סייבר ופרטיות'  => '/lawyers/?area=privacy-cyber-law',
	);

	$html = '<li class="menu-item menu-item-has-children practice-areas-menu"><a href="' . esc_url( home_url( '/lawyers/' ) ) . '">תחומי משפט</a><ul class="sub-menu">';
	foreach ( $areas as $label => $path ) {
		$html .= '<li class="menu-item"><a href="' . esc_url( home_url( $path ) ) . '">' . esc_html( $label ) . '</a></li>';
	}
	$html .= '</ul></li>';

	return $html;
}
