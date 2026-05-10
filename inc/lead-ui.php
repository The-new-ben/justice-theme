<?php
/**
 * Lead form UI helpers for theme.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get theme contact option.
 *
 * @param string $key     Option key.
 * @param string $default Default.
 * @return string
 */
function justice_theme_option( $key, $default = '' ) {
	return get_theme_mod( $key, $default );
}

/**
 * Register Customizer settings.
 *
 * @param WP_Customize_Manager $wp_customize Manager.
 */
function justice_theme_customize_register( $wp_customize ) {
	$wp_customize->add_section( 'justice_contact', array(
		'title'    => __( 'פרטי יצירת קשר', 'justice-theme' ),
		'priority' => 30,
	) );

	$wp_customize->add_setting( 'justice_phone', array(
		'default'           => '03-6161535',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'justice_phone', array(
		'label'   => __( 'מספר טלפון', 'justice-theme' ),
		'section' => 'justice_contact',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'justice_email', array(
		'default'           => 'info@jus-tice.co.il',
		'sanitize_callback' => 'sanitize_email',
	) );
	$wp_customize->add_control( 'justice_email', array(
		'label'   => __( 'דואר אלקטרוני', 'justice-theme' ),
		'section' => 'justice_contact',
		'type'    => 'email',
	) );

	$wp_customize->add_setting( 'justice_whatsapp', array(
		'default'           => '0544705733',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'justice_whatsapp', array(
		'label'       => __( 'וואטסאפ', 'justice-theme' ),
		'description' => __( 'מספר לוואטסאפ הצף והפוטר. הזינו ספרות בלבד או מספר ישראלי רגיל.', 'justice-theme' ),
		'section'     => 'justice_contact',
		'type'        => 'text',
	) );
}
add_action( 'customize_register', 'justice_theme_customize_register' );
