<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function jte_register_articles_cpt() {
	$labels = array(
		'name'               => _x( 'Articles', 'post type general name', 'jus-tice-engine' ),
		'singular_name'      => _x( 'Article', 'post type singular name', 'jus-tice-engine' ),
		'menu_name'          => _x( 'Legal Articles', 'admin menu', 'jus-tice-engine' ),
		'add_new'            => _x( 'Add New', 'article', 'jus-tice-engine' ),
		'add_new_item'       => __( 'Add New Article', 'jus-tice-engine' ),
		'edit_item'          => __( 'Edit Article', 'jus-tice-engine' ),
		'view_item'          => __( 'View Article', 'jus-tice-engine' ),
		'all_items'          => __( 'All Articles', 'jus-tice-engine' ),
		'search_items'       => __( 'Search Articles', 'jus-tice-engine' ),
		'not_found'          => __( 'No articles found.', 'jus-tice-engine' ),
		'not_found_in_trash' => __( 'No articles found in Trash.', 'jus-tice-engine' ),
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
