<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uje_register_practice_areas_taxonomy() {
	$labels = array(
		'name'              => _x( 'Practice Areas', 'taxonomy general name', 'ultra-justice-engine' ),
		'singular_name'     => _x( 'Practice Area', 'taxonomy singular name', 'ultra-justice-engine' ),
		'search_items'      => __( 'Search Practice Areas', 'ultra-justice-engine' ),
		'all_items'         => __( 'All Practice Areas', 'ultra-justice-engine' ),
		'parent_item'       => __( 'Parent Practice Area', 'ultra-justice-engine' ),
		'edit_item'         => __( 'Edit Practice Area', 'ultra-justice-engine' ),
		'add_new_item'      => __( 'Add New Practice Area', 'ultra-justice-engine' ),
		'menu_name'         => __( 'Practice Areas', 'ultra-justice-engine' ),
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
add_action( 'init', 'uje_register_practice_areas_taxonomy' );
