<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uje_register_articles_cpt() {
	$labels = array(
		'name'               => _x( 'מאמרים משפטיים', 'post type general name', 'ultra-justice-engine' ),
		'singular_name'      => _x( 'מאמר משפטי', 'post type singular name', 'ultra-justice-engine' ),
		'menu_name'          => _x( 'מאמרים משפטיים', 'admin menu', 'ultra-justice-engine' ),
		'add_new'            => _x( 'הוספת מאמר', 'article', 'ultra-justice-engine' ),
		'add_new_item'       => __( 'הוספת מאמר משפטי', 'ultra-justice-engine' ),
		'edit_item'          => __( 'עריכת מאמר משפטי', 'ultra-justice-engine' ),
		'view_item'          => __( 'צפייה במאמר', 'ultra-justice-engine' ),
		'all_items'          => __( 'כל המאמרים המשפטיים', 'ultra-justice-engine' ),
		'search_items'       => __( 'חיפוש מאמרים משפטיים', 'ultra-justice-engine' ),
		'not_found'          => __( 'לא נמצאו מאמרים משפטיים.', 'ultra-justice-engine' ),
		'not_found_in_trash' => __( 'לא נמצאו מאמרים משפטיים בפח.', 'ultra-justice-engine' ),
	);

	register_post_type( 'articles', array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => '/', 'with_front' => false ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 20,
		'menu_icon'          => 'dashicons-media-document',
		'supports'           => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'revisions', 'custom-fields' ),
		'taxonomies'         => array( 'category', 'post_tag' ),
	) );
}
add_action( 'init', 'uje_register_articles_cpt' );
