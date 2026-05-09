<?php
/**
 * City taxonomy registration.
 *
 * Used for lawyer directory geographic filtering.
 * Enables city-based landing pages: /lawyers/?city=tel-aviv
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the `city` taxonomy.
 */
function uj_register_city_taxonomy() {
	$labels = array(
		'name'              => 'ערים',
		'singular_name'     => 'עיר',
		'search_items'      => 'חפש ערים',
		'all_items'         => 'כל הערים',
		'edit_item'         => 'ערוך עיר',
		'update_item'       => 'עדכן עיר',
		'add_new_item'      => 'הוסף עיר חדשה',
		'new_item_name'     => 'שם עיר חדשה',
		'menu_name'         => 'ערים',
	);

	$args = array(
		'labels'            => $labels,
		'hierarchical'      => false,
		'public'            => true,
		'show_ui'           => true,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'rewrite'           => array(
			'slug'       => 'city',
			'with_front' => false,
		),
	);

	register_taxonomy( 'city', array( 'lawyer' ), $args );
}
add_action( 'init', 'uj_register_city_taxonomy', 9 );

/**
 * Pre-populate default Israeli cities on plugin activation.
 */
function uj_seed_cities() {
	$cities = array(
		'tel-aviv'      => 'תל אביב',
		'jerusalem'     => 'ירושלים',
		'haifa'         => 'חיפה',
		'rishon-lezion' => 'ראשון לציון',
		'petah-tikva'   => 'פתח תקווה',
		'ashdod'        => 'אשדוד',
		'netanya'       => 'נתניה',
		'beer-sheva'    => 'באר שבע',
		'holon'         => 'חולון',
		'bnei-brak'     => 'בני ברק',
		'ramat-gan'     => 'רמת גן',
		'ashkelon'      => 'אשקלון',
		'rehovot'       => 'רחובות',
		'bat-yam'       => 'בת ים',
		'herzliya'      => 'הרצליה',
		'kfar-saba'     => 'כפר סבא',
		'modiin'        => 'מודיעין',
		'nazareth'      => 'נצרת',
		'lod'           => 'לוד',
		'ramla'         => 'רמלה',
	);

	foreach ( $cities as $slug => $name ) {
		if ( ! term_exists( $name, 'city' ) ) {
			wp_insert_term( $name, 'city', array( 'slug' => $slug ) );
		}
	}
}

