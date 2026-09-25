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
		'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Frank+Ruhl+Libre:wght@400;500;700&family=Assistant:wght@300;400;500;600;700;800&display=swap',
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
		'4.5.13'
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

	// Redesign token layer (2026-07): ivory canvas, navy + coral brand,
	// Frank Ruhl Libre / Assistant type, header, footer and homepage
	// sections. Deliberately enqueued last so it re-skins legacy CSS.
	wp_enqueue_style(
		'justice-redesign',
		JUSTICE_THEME_URI . '/assets/css/redesign.css',
		array( 'justice-premium-4', 'justice-components', 'justice-accessibility' ),
		JUSTICE_THEME_VERSION
	);

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
		'1.1.3',
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

	if ( function_exists( 'justice_theme_is_btl_appeal_route' ) && justice_theme_is_btl_appeal_route() ) {
		wp_enqueue_script(
			'justice-bituach-leumi-appeal-calculator',
			JUSTICE_THEME_URI . '/assets/js/bituach-leumi-appeal-calculator.js',
			array(),
			'1.0.0',
			true
		);
	}

	if ( is_page_template( 'page-legal-tools.php' ) || ( function_exists( 'justice_theme_is_legal_tools_page' ) && justice_theme_is_legal_tools_page() ) ) {
		wp_enqueue_style(
			'justice-legal-tools-app',
			JUSTICE_THEME_URI . '/assets/css/legal-tools-app.css',
			array(),
			'1.0.0'
		);
		wp_enqueue_script(
			'justice-legal-tools-app',
			JUSTICE_THEME_URI . '/assets/js/legal-tools-app.js',
			array(),
			'1.0.0',
			true
		);
		wp_localize_script(
			'justice-legal-tools-app',
			'JusticeAIApp',
			array(
				'leadEndpoint'            => esc_url_raw( rest_url( 'justice/v1/legal-tools/lead' ) ),
				'generateEndpoint'        => esc_url_raw( rest_url( 'justice/v1/generate' ) ),
				'matchedLawyersEndpoint'  => esc_url_raw( rest_url( 'justice/v1/legal-tools/matched-lawyers' ) ),
			)
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
	justice_theme_dequeue_search_filter_assets();

	// Dashicons — admin icon font, not needed on frontend.
	wp_dequeue_style( 'dashicons' );

	// PWA scripts — service worker registration can happen on any page load,
	// but the video/download scripts are unnecessary on homepage.
	wp_dequeue_script( 'pwaforwp-video' );
	wp_dequeue_script( 'pwaforwp-download' );
}
add_action( 'wp_enqueue_scripts', 'justice_theme_dequeue_homepage_bloat', 999 );

/**
 * Performance: WooCommerce and Search & Filter Pro assets are not needed inside single
 * legal articles and ordinary pages. The store pages (cart, checkout incl. order-pay,
 * my-account, shop, product) keep everything. Owner order 2026-09-16.
 */
function justice_theme_dequeue_singular_bloat() {
	if ( is_admin() || ! is_singular( array( 'articles', 'post', 'page' ) ) ) {
		return;
	}
	if ( function_exists( 'is_woocommerce' ) && ( is_woocommerce() || is_cart() || is_checkout() || is_account_page()
		|| ( function_exists( 'is_wc_endpoint_url' ) && is_wc_endpoint_url() ) ) ) {
		return;
	}
	if ( is_singular( 'articles' ) ) {
		justice_theme_dequeue_search_filter_assets();
	}
	foreach ( array( 'wc-add-to-cart', 'woocommerce', 'wc-cart-fragments', 'js-cookie', 'jquery-blockui', 'sourcebuster-js',
		'wc-order-attribution', 'wc-add-to-cart-variation', 'wc-single-product' ) as $handle ) {
		wp_dequeue_script( $handle );
	}
	foreach ( array( 'woocommerce-general', 'woocommerce-layout', 'woocommerce-smallscreen', 'woocommerce-inline',
		'wc-blocks-style', 'wc-blocks-vendors-style', 'brands-styles' ) as $handle ) {
		wp_dequeue_style( $handle );
	}
}
add_action( 'wp_enqueue_scripts', 'justice_theme_dequeue_singular_bloat', 999 );

/**
 * Dequeue every Search & Filter Pro asset by handle prefix. The plugin (2.4.x) registers
 * `search-filter-plugin-build` / `search-filter-plugin-chosen` (+ `-js-extra`) and the matching
 * styles, not the `search-filter-build` / `chosen-*` handles the old code guessed, so those
 * dequeues never removed anything (verified live 2026-09-16: both scripts still loaded on every
 * article). Matching by prefix survives plugin renames. Runs again at print time because the
 * plugin can enqueue after priority 999.
 */
function justice_theme_dequeue_search_filter_assets(): void {
	foreach ( array( wp_scripts(), wp_styles() ) as $collection ) {
		foreach ( (array) $collection->queue as $handle ) {
			$handle = (string) $handle;
			if ( 0 !== strpos( $handle, 'search-filter' ) && ! in_array( $handle, array( 'chosen-jquery', 'chosen-css' ), true ) ) {
				continue;
			}
			if ( $collection instanceof WP_Styles ) {
				wp_dequeue_style( $handle );
			} else {
				wp_dequeue_script( $handle );
			}
		}
	}
}

/**
 * Performance (HAD-284): a plugin enqueues jQuery UI core + datepicker (+ its Hebrew locale block)
 * on every page, and it prints in the footer. No single article has a date field and no script on
 * an article calls .datepicker() (checked on 35 live articles and pages, 25.9.2026). Articles only;
 * pages and tools keep it in case a form there needs it. Runs at enqueue time and again just before
 * the head and footer print, because the plugin can enqueue after priority 999.
 */
function justice_theme_dequeue_article_datepicker(): void {
	if ( is_admin() || ! is_singular( 'articles' ) ) {
		return;
	}
	$scripts = wp_scripts();
	wp_dequeue_script( 'jquery-ui-datepicker' );
	// jQuery UI core goes too, unless something still queued depends on it.
	foreach ( (array) $scripts->queue as $handle ) {
		if ( 'jquery-ui-core' !== $handle && justice_theme_script_depends_on( $scripts, (string) $handle, 'jquery-ui-core' ) ) {
			return;
		}
	}
	wp_dequeue_script( 'jquery-ui-core' );
}
add_action( 'wp_enqueue_scripts', 'justice_theme_dequeue_article_datepicker', 999 );
add_action( 'wp_print_scripts', 'justice_theme_dequeue_article_datepicker', 1 );
add_action( 'wp_print_footer_scripts', 'justice_theme_dequeue_article_datepicker', 1 );

/** True when $handle needs $dependency, directly or through its own dependencies. */
function justice_theme_script_depends_on( WP_Scripts $scripts, string $handle, string $dependency, array $seen = array() ): bool {
	if ( isset( $seen[ $handle ] ) || ! isset( $scripts->registered[ $handle ] ) ) {
		return false;
	}
	$seen[ $handle ] = true;
	foreach ( (array) $scripts->registered[ $handle ]->deps as $dep ) {
		if ( $dep === $dependency || justice_theme_script_depends_on( $scripts, (string) $dep, $dependency, $seen ) ) {
			return true;
		}
	}
	return false;
}

function justice_theme_dequeue_search_filter_assets_late(): void {
	if ( is_admin() ) {
		return;
	}
	if ( is_front_page() || ( is_singular( 'articles' ) && ! ( function_exists( 'is_woocommerce' ) && is_woocommerce() ) ) ) {
		justice_theme_dequeue_search_filter_assets();
	}
}
add_action( 'wp_print_scripts', 'justice_theme_dequeue_search_filter_assets_late', 1 );
add_action( 'wp_print_styles', 'justice_theme_dequeue_search_filter_assets_late', 1 );

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
