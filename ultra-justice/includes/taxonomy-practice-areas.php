<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uj_register_practice_areas_taxonomy() {
	$labels = array(
		'name'              => _x( 'Practice Areas', 'taxonomy general name', 'ultra-justice' ),
		'singular_name'     => _x( 'Practice Area', 'taxonomy singular name', 'ultra-justice' ),
		'search_items'      => __( 'Search Practice Areas', 'ultra-justice' ),
		'all_items'         => __( 'All Practice Areas', 'ultra-justice' ),
		'parent_item'       => __( 'Parent Practice Area', 'ultra-justice' ),
		'edit_item'         => __( 'Edit Practice Area', 'ultra-justice' ),
		'add_new_item'      => __( 'Add New Practice Area', 'ultra-justice' ),
		'menu_name'         => __( 'Practice Areas', 'ultra-justice' ),
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
add_action( 'init', 'uj_register_practice_areas_taxonomy' );

