<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function jte_register_practice_areas_taxonomy() {
	$labels = array(
		'name'              => _x( 'Practice Areas', 'taxonomy general name', 'jus-tice-engine' ),
		'singular_name'     => _x( 'Practice Area', 'taxonomy singular name', 'jus-tice-engine' ),
		'search_items'      => __( 'Search Practice Areas', 'jus-tice-engine' ),
		'all_items'         => __( 'All Practice Areas', 'jus-tice-engine' ),
		'parent_item'       => __( 'Parent Practice Area', 'jus-tice-engine' ),
		'edit_item'         => __( 'Edit Practice Area', 'jus-tice-engine' ),
		'add_new_item'      => __( 'Add New Practice Area', 'jus-tice-engine' ),
		'menu_name'         => __( 'Practice Areas', 'jus-tice-engine' ),
	);

	register_taxonomy( 'practice-areas', array( 'articles', 'post' ), array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_rest'      => true,
		'query_var'         => true,
		'rewrite'           => array( 'slug' => 'practice-areas', 'with_front' => false ),
	) );
}
add_action( 'init', 'jte_register_practice_areas_taxonomy' );
