<?php
/**
 * Enqueue theme assets.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_enqueue_assets() {
	wp_enqueue_style(
		'justice-fonts',
		'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'justice-main',
		JUSTICE_THEME_URI . '/assets/css/main.css',
		array( 'justice-fonts' ),
		JUSTICE_THEME_VERSION
	);

	wp_enqueue_style(
		'justice-premium-2',
		JUSTICE_THEME_URI . '/assets/css/premium-pass-2.css',
		array( 'justice-main' ),
		'2.0.0'
	);

	wp_enqueue_style(
		'justice-premium-3',
		JUSTICE_THEME_URI . '/assets/css/premium-pass-3.css',
		array( 'justice-premium-2' ),
		'3.0.9'
	);

	wp_enqueue_style(
		'justice-premium-4',
		JUSTICE_THEME_URI . '/assets/css/premium-pass-4.css',
		array( 'justice-premium-3' ),
		'4.4.1'
	);

	wp_enqueue_style(
		'justice-components',
		JUSTICE_THEME_URI . '/assets/css/components.css',
		array( 'justice-premium-3' ),
		JUSTICE_THEME_VERSION
	);

	wp_enqueue_style(
		'justice-accessibility',
		JUSTICE_THEME_URI . '/assets/css/accessibility.css',
		array( 'justice-main' ),
		JUSTICE_THEME_VERSION
	);

	if ( is_rtl() ) {
		wp_enqueue_style(
			'justice-rtl',
			JUSTICE_THEME_URI . '/assets/css/rtl.css',
			array( 'justice-main' ),
			JUSTICE_THEME_VERSION
		);
	}

	// Expert Lawyer Box — only on article/post singles.
	if ( is_singular( array( 'articles', 'post' ) ) ) {
		wp_enqueue_style(
			'justice-expert-box',
			JUSTICE_THEME_URI . '/assets/css/expert-box.css',
			array( 'justice-main' ),
			'1.0.0'
		);
	}

	// E-E-A-T components — author byline, trust badges, legal citations, disclaimer.
	// Loads on all singular pages with substantial legal content.
	if ( is_singular() ) {
		wp_enqueue_style(
			'justice-eeat',
			JUSTICE_THEME_URI . '/assets/css/eeat.css',
			array( 'justice-main' ),
			'1.0.0'
		);
	}

	wp_enqueue_script(
		'justice-navigation',
		JUSTICE_THEME_URI . '/assets/js/navigation.js',
		array(),
		JUSTICE_THEME_VERSION,
		true
	);

	wp_enqueue_script(
		'justice-scroll-animations',
		JUSTICE_THEME_URI . '/assets/js/scroll-animations.js',
		array(),
		'4.0.0',
		true
	);

	wp_enqueue_script(
		'justice-analytics-events',
		JUSTICE_THEME_URI . '/assets/js/analytics-events.js',
		array(),
		'1.1.2',
		true
	);

	if ( is_page_template( 'page-lawyer-registration.php' ) || is_page( 'lawyer-registration' ) ) {
		wp_enqueue_script(
			'justice-lawyer-registration-wizard',
			JUSTICE_THEME_URI . '/assets/js/lawyer-registration-wizard.js',
			array(),
			'1.2.2',
			true
		);
	}

	if ( is_page_template( 'page-lawyer-dashboard.php' ) || is_page( 'lawyer-dashboard' ) ) {
		wp_enqueue_script(
			'justice-lawyer-dashboard',
			JUSTICE_THEME_URI . '/assets/js/lawyer-dashboard.js',
			array(),
			'1.0.1',
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'justice_theme_enqueue_assets' );

/**
 * Performance: dequeue heavy plugin scripts/styles not needed on front page.
 *
 * jsPDF, signature_pad, jQuery UI datepicker, search-filter-pro, dashicons,
 * PWA scripts, and google-analyticator are only needed on specific inner
 * pages. Removing them from the homepage saves ~300KB+ of JavaScript and
 * dramatically improves LCP, INP, and CLS scores.
 *
 * @since 1.0.5
 */
function justice_theme_dequeue_homepage_bloat() {
	if ( ! is_front_page() ) {
		return;
	}

	// Heavy third-party libraries not needed on homepage.
	wp_dequeue_script( 'jspdf' );
	wp_deregister_script( 'jspdf' );
	wp_dequeue_script( 'signature_pad' );
	wp_deregister_script( 'signature_pad' );

	// jQuery UI datepicker — only needed on forms with date fields.
	wp_dequeue_script( 'jquery-ui-datepicker' );

	// Search Filter Pro — no search filter widget on homepage.
	wp_dequeue_script( 'search-filter-build' );
	wp_dequeue_script( 'chosen-jquery' );
	wp_dequeue_style( 'search-filter-build' );
	wp_dequeue_style( 'chosen-css' );

	// Dashicons — admin icon font, not needed on frontend.
	wp_dequeue_style( 'dashicons' );

	// PWA scripts — service worker registration can happen on any page load,
	// but the video/download scripts are unnecessary on homepage.
	wp_dequeue_script( 'pwaforwp-video' );
	wp_dequeue_script( 'pwaforwp-download' );
}
add_action( 'wp_enqueue_scripts', 'justice_theme_dequeue_homepage_bloat', 999 );

/**
 * Strip duplicate theme-color meta tags from plugin output.
 *
 * header.php already defines <meta name="theme-color" content="#07152f">.
 * PWA / Flavor / other plugins inject their own copies. This removes them.
 */
function justice_theme_strip_duplicate_theme_color(): void {
	ob_start(
		function ( string $html ): string {
			// Remove all plugin-injected theme-color tags (our header.php has the canonical one).
			$result = preg_replace(
				'#<meta\s+name=["\']theme-color["\']\s+content=["\'][^"\']*["\']\s*/?\s*>\s*\n?#i',
				'',
				$html,
				-1
			);
			return is_string( $result ) ? $result : $html;
		}
	);
}
function justice_theme_flush_theme_color_buffer(): void {
	if ( ob_get_level() > 0 ) {
		ob_end_flush();
	}
}
add_action( 'wp_head', 'justice_theme_strip_duplicate_theme_color', 1 );
add_action( 'wp_head', 'justice_theme_flush_theme_color_buffer', 999 );
