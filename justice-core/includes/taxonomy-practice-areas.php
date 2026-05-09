<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uje_register_practice_areas_taxonomy() {
	$labels = array(
		'name'              => _x( 'Practice Areas', 'taxonomy general name', 'justice-core' ),
		'singular_name'     => _x( 'Practice Area', 'taxonomy singular name', 'justice-core' ),
		'search_items'      => __( 'Search Practice Areas', 'justice-core' ),
		'all_items'         => __( 'All Practice Areas', 'justice-core' ),
		'parent_item'       => __( 'Parent Practice Area', 'justice-core' ),
		'edit_item'         => __( 'Edit Practice Area', 'justice-core' ),
		'add_new_item'      => __( 'Add New Practice Area', 'justice-core' ),
		'menu_name'         => __( 'Practice Areas', 'justice-core' ),
	);

	register_taxonomy( 'practice-areas', array( 'articles', 'justice_lawyer', 'post' ), array(
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
