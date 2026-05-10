<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uje_register_practice_areas_taxonomy() {
	$labels = array(
		'name'              => _x( 'תחומי משפט', 'taxonomy general name', 'ultra-justice-engine' ),
		'singular_name'     => _x( 'תחום משפט', 'taxonomy singular name', 'ultra-justice-engine' ),
		'search_items'      => __( 'חיפוש תחומי משפט', 'ultra-justice-engine' ),
		'all_items'         => __( 'כל תחומי המשפט', 'ultra-justice-engine' ),
		'parent_item'       => __( 'תחום משפט ראשי', 'ultra-justice-engine' ),
		'edit_item'         => __( 'עריכת תחום משפט', 'ultra-justice-engine' ),
		'add_new_item'      => __( 'הוספת תחום משפט', 'ultra-justice-engine' ),
		'menu_name'         => __( 'תחומי משפט', 'ultra-justice-engine' ),
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
