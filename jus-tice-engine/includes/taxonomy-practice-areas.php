<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function jte_register_practice_areas_taxonomy() {
	$labels = array(
		'name'              => 'תחומי משפט',
		'singular_name'     => 'תחום משפטי',
		'search_items'      => 'חפש תחומי משפט',
		'all_items'         => 'כל תחומי המשפט',
		'parent_item'       => 'תחום אב',
		'parent_item_colon' => 'תחום אב:',
		'edit_item'         => 'ערוך תחום',
		'update_item'       => 'עדכן תחום',
		'add_new_item'      => 'הוסף תחום חדש',
		'new_item_name'     => 'שם תחום חדש',
		'menu_name'         => 'תחומי משפט',
	);

	register_taxonomy( 'practice-areas', array( 'articles', 'justice_lawyer' ), array(
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
