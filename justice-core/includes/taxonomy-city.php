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
function uje_register_city_taxonomy() {
	$labels = array(
		'name'              => '׳¢׳¨׳™׳',
		'singular_name'     => '׳¢׳™׳¨',
		'search_items'      => '׳—׳₪׳© ׳¢׳¨׳™׳',
		'all_items'         => '׳›׳ ׳”׳¢׳¨׳™׳',
		'edit_item'         => '׳¢׳¨׳•׳ ׳¢׳™׳¨',
		'update_item'       => '׳¢׳“׳›׳ ׳¢׳™׳¨',
		'add_new_item'      => '׳”׳•׳¡׳£ ׳¢׳™׳¨ ׳—׳“׳©׳”',
		'new_item_name'     => '׳©׳ ׳¢׳™׳¨ ׳—׳“׳©׳”',
		'menu_name'         => '׳¢׳¨׳™׳',
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

	register_taxonomy( 'city', array( 'justice_lawyer' ), $args );
}
add_action( 'init', 'uje_register_city_taxonomy', 9 );

/**
 * Pre-populate default Israeli cities on plugin activation.
 */
function uje_seed_cities() {
	$cities = array(
		'tel-aviv'      => '׳×׳ ׳׳‘׳™׳‘',
		'jerusalem'     => '׳™׳¨׳•׳©׳׳™׳',
		'haifa'         => '׳—׳™׳₪׳”',
		'rishon-lezion' => '׳¨׳׳©׳•׳ ׳׳¦׳™׳•׳',
		'petah-tikva'   => '׳₪׳×׳— ׳×׳§׳•׳•׳”',
		'ashdod'        => '׳׳©׳“׳•׳“',
		'netanya'       => '׳ ׳×׳ ׳™׳”',
		'beer-sheva'    => '׳‘׳׳¨ ׳©׳‘׳¢',
		'holon'         => '׳—׳•׳׳•׳',
		'bnei-brak'     => '׳‘׳ ׳™ ׳‘׳¨׳§',
		'ramat-gan'     => '׳¨׳׳× ׳’׳',
		'ashkelon'      => '׳׳©׳§׳׳•׳',
		'rehovot'       => '׳¨׳—׳•׳‘׳•׳×',
		'bat-yam'       => '׳‘׳× ׳™׳',
		'herzliya'      => '׳”׳¨׳¦׳׳™׳”',
		'kfar-saba'     => '׳›׳₪׳¨ ׳¡׳‘׳',
		'modiin'        => '׳׳•׳“׳™׳¢׳™׳',
		'nazareth'      => '׳ ׳¦׳¨׳×',
		'lod'           => '׳׳•׳“',
		'ramla'         => '׳¨׳׳׳”',
	);

	foreach ( $cities as $slug => $name ) {
		if ( ! term_exists( $name, 'city' ) ) {
			wp_insert_term( $name, 'city', array( 'slug' => $slug ) );
		}
	}
}
