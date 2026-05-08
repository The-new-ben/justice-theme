<?php
/**
 * Theme setup.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_setup() {
	load_theme_textdomain( 'justice-theme', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 260,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list',
		'gallery', 'caption', 'style', 'script', 'navigation-widgets',
	) );

	add_image_size( 'justice-card', 520, 340, true );
	add_image_size( 'justice-card-wide', 760, 420, true );
	add_image_size( 'justice-hero', 1440, 720, true );

	register_nav_menus( array(
		'primary'      => esc_html__( 'תפריט ראשי', 'justice-theme' ),
		'secondary'    => esc_html__( 'תפריט משני', 'justice-theme' ),
		'mobile'       => esc_html__( 'תפריט נייד', 'justice-theme' ),
		'footer'       => esc_html__( 'תפריט תחתון', 'justice-theme' ),
		'legal_areas'  => esc_html__( 'תפריט תחומי משפט', 'justice-theme' ),
		'footer_trust' => esc_html__( 'תפריט מידע שימושי', 'justice-theme' ),
	) );
}
add_action( 'after_setup_theme', 'justice_theme_setup' );

function justice_theme_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'justice_theme_content_width', 840 );
}
add_action( 'after_setup_theme', 'justice_theme_content_width', 0 );

