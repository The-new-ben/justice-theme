<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uj_register_articles_cpt() {
	$labels = array(
		'name'               => _x( 'Articles', 'post type general name', 'ultra-justice' ),
		'singular_name'      => _x( 'Article', 'post type singular name', 'ultra-justice' ),
		'menu_name'          => _x( 'Legal Articles', 'admin menu', 'ultra-justice' ),
		'add_new'            => _x( 'Add New', 'article', 'ultra-justice' ),
		'add_new_item'       => __( 'Add New Article', 'ultra-justice' ),
		'edit_item'          => __( 'Edit Article', 'ultra-justice' ),
		'view_item'          => __( 'View Article', 'ultra-justice' ),
		'all_items'          => __( 'All Articles', 'ultra-justice' ),
		'search_items'       => __( 'Search Articles', 'ultra-justice' ),
		'not_found'          => __( 'No articles found.', 'ultra-justice' ),
		'not_found_in_trash' => __( 'No articles found in Trash.', 'ultra-justice' ),
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
add_action( 'init', 'uj_register_articles_cpt' );

