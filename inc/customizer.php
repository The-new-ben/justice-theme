<?php
/**
 * Customizer settings — connects the homepage to the WordPress admin UI.
 *
 * Every editable string, image and reference on the front page should be
 * editable through the Customizer rather than hardcoded in template files.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Safe getter for theme mods with a default fallback.
 *
 * @param string $key     Theme mod key.
 * @param string $default Default value if mod is unset/empty.
 * @return string
 */
function justice_theme_mod( $key, $default = '' ) {
	$value = get_theme_mod( $key, $default );
	if ( is_string( $value ) ) {
		$value = trim( $value );
	}
	return ( '' === $value || null === $value ) ? $default : $value;
}

/**
 * Register Customizer sections and controls.
 *
 * @param WP_Customize_Manager $wp_customize Customizer manager.
 */
function justice_theme_register_customizer( $wp_customize ) {

	/* ---------------------------------------------------------------
	 * Panel: Homepage
	 * --------------------------------------------------------------- */
	$wp_customize->add_panel(
		'justice_homepage',
		array(
			'title'       => __( 'עמוד הבית — Jus-Tice', 'justice-theme' ),
			'description' => __( 'ניהול כל תוכן עמוד הבית ממקום אחד.', 'justice-theme' ),
			'priority'    => 30,
		)
	);

	/* ---------------------------------------------------------------
	 * Section: Hero
	 * --------------------------------------------------------------- */
	$wp_customize->add_section(
		'justice_hero',
		array(
			'title'    => __( 'גיבור (Hero) — כותרת ראשית', 'justice-theme' ),
			'panel'    => 'justice_homepage',
			'priority' => 10,
		)
	);

	$wp_customize->add_setting(
		'justice_hero_headline',
		array(
			'default'           => __( 'צריכים עורך דין או הכוונה משפטית? התחילו כאן', 'justice-theme' ),
			'sanitize_callback' => 'wp_kses_post',
			'transport'         => 'refresh',
		)
	);
	$wp_customize->add_control(
		'justice_hero_headline',
		array(
			'label'    => __( 'כותרת ראשית (H1)', 'justice-theme' ),
			'section'  => 'justice_hero',
			'type'     => 'text',
			'priority' => 10,
		)
	);

	$wp_customize->add_setting(
		'justice_hero_description',
		array(
			'default'           => __( 'חיפוש עורכי דין לפי תחום ומיקום, מאמרים משפטיים, ומדריכים מקצועיים — הכל במקום אחד.', 'justice-theme' ),
			'sanitize_callback' => 'wp_kses_post',
			'transport'         => 'refresh',
		)
	);
	$wp_customize->add_control(
		'justice_hero_description',
		array(
			'label'    => __( 'תיאור מתחת לכותרת', 'justice-theme' ),
			'section'  => 'justice_hero',
			'type'     => 'textarea',
			'priority' => 20,
		)
	);

	$wp_customize->add_setting(
		'justice_hero_search_placeholder',
		array(
			'default'           => __( 'מה הבעיה המשפטית שלך?', 'justice-theme' ),
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	$wp_customize->add_control(
		'justice_hero_search_placeholder',
		array(
			'label'    => __( 'טקסט בתוך שדה החיפוש', 'justice-theme' ),
			'section'  => 'justice_hero',
			'type'     => 'text',
			'priority' => 30,
		)
	);

	$wp_customize->add_setting(
		'justice_hero_trust_microcopy',
		array(
			'default'           => __( 'עורכי דין מאומתים בלבד · 10+ שנות פעילות · רישוי מלא בלשכת עורכי הדין', 'justice-theme' ),
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	$wp_customize->add_control(
		'justice_hero_trust_microcopy',
		array(
			'label'       => __( 'מיקרו-קופי של אמון מתחת לחיפוש', 'justice-theme' ),
			'description' => __( 'שורת טקסט קצרה שמופיעה מתחת לטופס החיפוש.', 'justice-theme' ),
			'section'     => 'justice_hero',
			'type'        => 'text',
			'priority'    => 40,
		)
	);

	$wp_customize->add_setting(
		'justice_hero_bg_image',
		array(
			'default'           => JUSTICE_THEME_URI . '/assets/images/hero-bg.png',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'justice_hero_bg_image',
			array(
				'label'    => __( 'תמונת רקע — דסקטופ', 'justice-theme' ),
				'section'  => 'justice_hero',
				'priority' => 50,
			)
		)
	);

	$wp_customize->add_setting(
		'justice_hero_bg_image_mobile',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'justice_hero_bg_image_mobile',
			array(
				'label'       => __( 'תמונת רקע — מובייל (אופציונלי)', 'justice-theme' ),
				'description' => __( 'תמונה קלה יותר למובייל לשיפור LCP. אם ריק — תוצג תמונת הדסקטופ.', 'justice-theme' ),
				'section'     => 'justice_hero',
				'priority'    => 60,
			)
		)
	);

	/* ---------------------------------------------------------------
	 * Section: Featured Lawyer
	 * --------------------------------------------------------------- */
	$wp_customize->add_section(
		'justice_featured_lawyers',
		array(
			'title'    => __( 'עורכי דין מובילים', 'justice-theme' ),
			'panel'    => 'justice_homepage',
			'priority' => 20,
		)
	);

	$wp_customize->add_setting(
		'justice_featured_lawyers_headline',
		array(
			'default'           => __( 'עורכי דין מובילים בפלטפורמה', 'justice-theme' ),
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	$wp_customize->add_control(
		'justice_featured_lawyers_headline',
		array(
			'label'   => __( 'כותרת הסקשן', 'justice-theme' ),
			'section' => 'justice_featured_lawyers',
			'type'    => 'text',
		)
	);

	$wp_customize->add_setting(
		'justice_featured_lawyers_eyebrow',
		array(
			'default'           => __( 'פרופילים מאומתים', 'justice-theme' ),
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	$wp_customize->add_control(
		'justice_featured_lawyers_eyebrow',
		array(
			'label'   => __( 'תווית מעל הכותרת', 'justice-theme' ),
			'section' => 'justice_featured_lawyers',
			'type'    => 'text',
		)
	);

	$wp_customize->add_setting(
		'justice_featured_lawyers_count',
		array(
			'default'           => 6,
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control(
		'justice_featured_lawyers_count',
		array(
			'label'       => __( 'מספר עורכי דין להציג', 'justice-theme' ),
			'description' => __( 'מומלץ 3 עד 6. רק עורכי דין שעברו אימות יוצגו.', 'justice-theme' ),
			'section'     => 'justice_featured_lawyers',
			'type'        => 'number',
			'input_attrs' => array(
				'min'  => 0,
				'max'  => 12,
				'step' => 1,
			),
		)
	);

	/* ---------------------------------------------------------------
	 * Section: Trust / Authority
	 * --------------------------------------------------------------- */
	$wp_customize->add_section(
		'justice_trust',
		array(
			'title'    => __( 'סקשן אמון', 'justice-theme' ),
			'panel'    => 'justice_homepage',
			'priority' => 30,
		)
	);

	$wp_customize->add_setting(
		'justice_years_active',
		array(
			'default'           => 10,
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control(
		'justice_years_active',
		array(
			'label'   => __( 'שנות פעילות', 'justice-theme' ),
			'section' => 'justice_trust',
			'type'    => 'number',
		)
	);

	$wp_customize->add_setting(
		'justice_cities_count',
		array(
			'default'           => 20,
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control(
		'justice_cities_count',
		array(
			'label'   => __( 'מספר ערים מוצג', 'justice-theme' ),
			'section' => 'justice_trust',
			'type'    => 'number',
		)
	);

	/* ---------------------------------------------------------------
	 * Section: Identity (Organization / Social)
	 * --------------------------------------------------------------- */
	$wp_customize->add_section(
		'justice_identity',
		array(
			'title'    => __( 'זהות הארגון (SEO/Schema)', 'justice-theme' ),
			'panel'    => 'justice_homepage',
			'priority' => 40,
		)
	);

	$wp_customize->add_setting(
		'justice_phone',
		array(
			'default'           => '03-6161535',
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	$wp_customize->add_control(
		'justice_phone',
		array(
			'label'   => __( 'טלפון ראשי', 'justice-theme' ),
			'section' => 'justice_identity',
			'type'    => 'text',
		)
	);

	$wp_customize->add_setting(
		'justice_facebook_url',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'justice_facebook_url',
		array(
			'label'   => 'Facebook URL',
			'section' => 'justice_identity',
			'type'    => 'url',
		)
	);

	$wp_customize->add_setting(
		'justice_linkedin_url',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'justice_linkedin_url',
		array(
			'label'   => 'LinkedIn URL',
			'section' => 'justice_identity',
			'type'    => 'url',
		)
	);

	$wp_customize->add_setting(
		'justice_youtube_url',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'justice_youtube_url',
		array(
			'label'   => 'YouTube URL',
			'section' => 'justice_identity',
			'type'    => 'url',
		)
	);
}
add_action( 'customize_register', 'justice_theme_register_customizer' );
