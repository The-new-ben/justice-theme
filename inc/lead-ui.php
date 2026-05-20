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
	$value = get_theme_mod( $key, $default );

	if ( in_array( $key, array( 'justice_phone', 'justice_whatsapp' ), true ) ) {
		$value = justice_theme_public_contact_number( $value );
	}

	return $value;
}

/**
 * Return the current public owner contact number.
 *
 * Older theme defaults included temporary/mock phone numbers. Keep this
 * rendering-level guard so saved legacy Customizer values cannot leak back
 * into the header, footer, CTA, WhatsApp button, or structured data.
 *
 * @param string $value Candidate contact number.
 * @return string
 */
function justice_theme_public_contact_number( $value = '' ) {
	$canonical_number = '0525101555';
	$normalized       = preg_replace( '/[^0-9+]/', '', (string) $value );
	$legacy_numbers   = array(
		'',
		'036161535',
		'03-6161535',
		'0544705733',
		'054-470-5733',
	);
	$legacy_numbers   = array_map(
		static function ( $legacy_number ) {
			return preg_replace( '/[^0-9+]/', '', $legacy_number );
		},
		$legacy_numbers
	);

	if ( in_array( $normalized, $legacy_numbers, true ) ) {
		return $canonical_number;
	}

	return (string) $value;
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
		'default'           => '0525101555',
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

	$wp_customize->add_setting( 'justice_business_name', array(
		'default'           => 'Jus-Tice Israel',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'justice_business_name', array(
		'label'       => __( 'שם העסק לסליקה', 'justice-theme' ),
		'description' => __( 'שם העסק שיופיע בתקנון, פרטיות ועמודי סליקה.', 'justice-theme' ),
		'section'     => 'justice_contact',
		'type'        => 'text',
	) );

	$wp_customize->add_setting( 'justice_business_address', array(
		'default'           => '',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'justice_business_address', array(
		'label'       => __( 'כתובת העסק לסליקה', 'justice-theme' ),
		'description' => __( 'כתובת מלאה הנדרשת לאישור Grow/Meshulam. חובה לעדכן לפני שליחה חוזרת לבדיקה.', 'justice-theme' ),
		'section'     => 'justice_contact',
		'type'        => 'text',
	) );

	$wp_customize->add_setting( 'justice_whatsapp', array(
		'default'           => '0525101555',
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
