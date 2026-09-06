<?php
/**
 * New look (v3) switch — owner-controlled, default OFF.
 *
 * Customizer › "מראה חדש (v3)" has three modes:
 *  - off:     the site renders exactly as today.
 *  - preview: the new look renders only inside the Customizer preview and for
 *             logged-in users who can edit the theme; visitors see today's site.
 *  - on:      every visitor sees the new look.
 *
 * The new look is an additive stylesheet layered above redesign.css plus a
 * body class, so switching it off restores the current look without a deploy.
 * The committed default must stay OFF: the theme ships to production via the
 * owner's pull, and the pull ships whatever is on main.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Sanitize the mode value.
 *
 * @param mixed $value Raw value.
 * @return string
 */
function justice_theme_sanitize_new_look_mode( $value ) {
	return in_array( $value, array( 'off', 'preview', 'on' ), true ) ? (string) $value : 'off';
}

/**
 * Current mode: off | preview | on. Filterable for emergency overrides.
 *
 * @return string
 */
function justice_theme_new_look_mode() {
	$mode = justice_theme_sanitize_new_look_mode( get_theme_mod( 'justice_new_look', 'off' ) );

	return justice_theme_sanitize_new_look_mode( apply_filters( 'justice_theme_new_look_mode', $mode ) );
}

/**
 * Whether the current request renders the new look.
 *
 * @return bool
 */
function justice_theme_new_look_active() {
	$mode = justice_theme_new_look_mode();

	if ( 'on' === $mode ) {
		return true;
	}

	if ( 'preview' === $mode ) {
		return is_customize_preview() || current_user_can( 'edit_theme_options' );
	}

	return false;
}

add_filter(
	'body_class',
	function ( $classes ) {
		if ( justice_theme_new_look_active() ) {
			$classes[] = 'jt-look-v3';
		}

		return $classes;
	}
);

// Priority 20: after the theme's main enqueue, and declared dependent on the
// redesign layer so it always cascades last.
add_action(
	'wp_enqueue_scripts',
	function () {
		if ( ! justice_theme_new_look_active() ) {
			return;
		}

		wp_enqueue_style(
			'justice-new-look',
			JUSTICE_THEME_URI . '/assets/css/new-look.css',
			array( 'justice-redesign' ),
			JUSTICE_THEME_VERSION . '-look3'
		);

		wp_enqueue_script(
			'justice-new-look',
			JUSTICE_THEME_URI . '/assets/js/new-look.js',
			array(),
			JUSTICE_THEME_VERSION . '-look3',
			true
		);
	},
	20
);

add_action(
	'customize_register',
	function ( $wp_customize ) {
		$wp_customize->add_section(
			'justice_design',
			array(
				'title'    => __( 'מראה חדש (v3)', 'justice-theme' ),
				'priority' => 31,
			)
		);

		$wp_customize->add_setting(
			'justice_new_look',
			array(
				'default'           => 'off',
				'sanitize_callback' => 'justice_theme_sanitize_new_look_mode',
				'transport'         => 'refresh',
			)
		);

		$wp_customize->add_control(
			'justice_new_look',
			array(
				'label'       => __( 'המראה החדש של הפורטל', 'justice-theme' ),
				'description' => __( 'כבוי: האתר כפי שהוא היום. תצוגה מקדימה: רק מנהלים מחוברים רואים את המראה החדש. פעיל: כל המבקרים.', 'justice-theme' ),
				'section'     => 'justice_design',
				'type'        => 'radio',
				'choices'     => array(
					'off'     => __( 'כבוי', 'justice-theme' ),
					'preview' => __( 'תצוגה מקדימה למנהלים', 'justice-theme' ),
					'on'      => __( 'פעיל לכולם', 'justice-theme' ),
				),
			)
		);
	}
);
