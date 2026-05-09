<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uje_register_articles_cpt() {
	$labels = array(
		'name'               => _x( 'Articles', 'post type general name', 'justice-core' ),
		'singular_name'      => _x( 'Article', 'post type singular name', 'justice-core' ),
		'menu_name'          => _x( 'Legal Articles', 'admin menu', 'justice-core' ),
		'add_new'            => _x( 'Add New', 'article', 'justice-core' ),
		'add_new_item'       => __( 'Add New Article', 'justice-core' ),
		'edit_item'          => __( 'Edit Article', 'justice-core' ),
		'view_item'          => __( 'View Article', 'justice-core' ),
		'all_items'          => __( 'All Articles', 'justice-core' ),
		'search_items'       => __( 'Search Articles', 'justice-core' ),
		'not_found'          => __( 'No articles found.', 'justice-core' ),
		'not_found_in_trash' => __( 'No articles found in Trash.', 'justice-core' ),
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
add_action( 'init', 'uje_register_articles_cpt' );
