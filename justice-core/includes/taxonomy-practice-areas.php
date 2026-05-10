<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uje_register_practice_areas_taxonomy() {
	$labels = array(
		'name'              => _x( 'תחומי משפט', 'taxonomy general name', 'justice-core' ),
		'singular_name'     => _x( 'תחום משפט', 'taxonomy singular name', 'justice-core' ),
		'search_items'      => __( 'חיפוש תחומי משפט', 'justice-core' ),
		'all_items'         => __( 'כל תחומי המשפט', 'justice-core' ),
		'parent_item'       => __( 'תחום משפט ראשי', 'justice-core' ),
		'edit_item'         => __( 'עריכת תחום משפט', 'justice-core' ),
		'add_new_item'      => __( 'הוספת תחום משפט', 'justice-core' ),
		'menu_name'         => __( 'תחומי משפט', 'justice-core' ),
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
