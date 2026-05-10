<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function jte_register_articles_cpt() {
	$labels = array(
		'name'               => 'מאמרים משפטיים',
		'singular_name'      => 'מאמר משפטי',
		'menu_name'          => 'מאמרים משפטיים',
		'add_new'            => 'הוסף מאמר',
		'add_new_item'       => 'הוסף מאמר חדש',
		'edit_item'          => 'ערוך מאמר',
		'new_item'           => 'מאמר חדש',
		'view_item'          => 'צפה במאמר',
		'all_items'          => 'כל המאמרים',
		'search_items'       => 'חפש מאמרים',
		'not_found'          => 'לא נמצאו מאמרים.',
		'not_found_in_trash' => 'לא נמצאו מאמרים בפח.',
	);

	register_post_type( 'articles', array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'articles', 'with_front' => false ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 20,
		'menu_icon'          => 'dashicons-media-document',
		'supports'           => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'revisions', 'custom-fields' ),
		'taxonomies'         => array( 'category', 'post_tag' ),
	) );
}
add_action( 'init', 'jte_register_articles_cpt' );
