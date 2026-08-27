<?php
/**
 * PII-free bridge from the editorial SEO site to the JURIS product.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Canonical owner pages from the reconciled 11-cluster GSC architecture.
 *
 * @return array<string,string>
 */
function justice_theme_simulation_cluster_owners(): array {
	return array(
		'family-law'                => '/divorce-lawyer/',
		'criminal-law'              => '/criminal-defense-attorney/',
		'real-estate'               => '/articles/real-estate-attorney/',
		'immigration'               => '/immigration-lawyer/',
		'international-real-estate' => '/buying-property-abroad-guide/',
		'traffic-law'               => '/articles/traffic-lawyer/',
		'inheritance'               => '/inheritance-lawyer/',
		'employment'                => '/labor-lawyer/',
		'medical-malpractice'       => '/medical-malpractice-lawyer/',
		'personal-injury'           => '/personal-injury-law/',
		'tax'                       => '/real-estate-tax-advisor/',
	);
}

/**
 * Map the site's practice taxonomy to a reconciled GSC cluster owner.
 *
 * @param string $area_slug Practice-area term slug.
 * @return array{cluster:string,owner:string}|null
 */
function justice_theme_simulation_handoff_context( string $area_slug ): ?array {
	$area_to_cluster = array(
		'family-law'                => 'family-law',
		'criminal-law'              => 'criminal-law',
		'real-estate-law'           => 'real-estate',
		'immigration-law'           => 'immigration',
		'international-real-estate' => 'international-real-estate',
		'traffic-law'               => 'traffic-law',
		'inheritance-law'           => 'inheritance',
		'labor-law'                 => 'employment',
		'medical-malpractice'       => 'medical-malpractice',
		'medical-malpractice-law'   => 'medical-malpractice',
		'torts'                     => 'personal-injury',
		'personal-injury-law'       => 'personal-injury',
		'tax-law'                   => 'tax',
	);
	$owners          = justice_theme_simulation_cluster_owners();
	$cluster         = $area_to_cluster[ sanitize_key( $area_slug ) ] ?? '';

	return isset( $owners[ $cluster ] )
		? array( 'cluster' => $cluster, 'owner' => $owners[ $cluster ] )
		: null;
}

/**
 * Build the local SEO bridge URL for a known practice area.
 *
 * @param string $area_slug Practice-area term slug.
 * @return string
 */
function justice_theme_simulation_handoff_url( string $area_slug ): string {
	$context = justice_theme_simulation_handoff_context( $area_slug );
	$args    = array( 'source' => 'organic' );

	if ( null !== $context ) {
		$args['cluster'] = $context['cluster'];
		$args['owner']   = $context['owner'];
	}

	return add_query_arg( $args, home_url( '/legal-simulation/' ) );
}

/**
 * Build the product URL from fixed attribution values only.
 *
 * @param string $cluster Candidate cluster key.
 * @param bool   $embed   Whether to request the embedded product shell.
 * @return string
 */
function justice_theme_courtai_product_url( string $cluster = '', bool $embed = false ): string {
	$owners  = justice_theme_simulation_cluster_owners();
	$cluster = sanitize_key( $cluster );
	$params  = array(
		'jurisdiction' => 'IL',
		'source'       => 'organic',
	);

	if ( isset( $owners[ $cluster ] ) ) {
		$params['cluster'] = $cluster;
		$params['owner']   = $owners[ $cluster ];
	}

	if ( $embed ) {
		$params['embed']  = '1';
		$params['domain'] = 'legal';
		$params['host']   = 'https://jus-tice.co.il';
	}

	return 'https://jus-tice.com/#/intake?' . http_build_query( $params, '', '&', PHP_QUERY_RFC3986 );
}

/**
 * Theme-level shortcode wins over the older plugin callback. This lets the
 * independently deployed theme move the live page to Matter-first behavior.
 *
 * @return string
 */
function justice_theme_arena_embed_shortcode(): string {
	$cluster        = isset( $_GET['cluster'] ) ? sanitize_key( wp_unslash( $_GET['cluster'] ) ) : '';
	$embed_url      = justice_theme_courtai_product_url( $cluster, true );
	$fullscreen_url = justice_theme_courtai_product_url( $cluster, false );

	return '<div class="jt-sim__wrap">'
		. '<iframe class="jt-sim__frame" src="' . esc_url( $embed_url ) . '"'
		. ' title="פתיחת Matter מאובטח והכנה לזירת JURIS"'
		. ' allow="microphone; camera; autoplay; clipboard-write"'
		. ' loading="eager" referrerpolicy="origin"></iframe>'
		. '<p class="jt-sim__note">מתחילים ב-Matter פרטי ומוגבל למקורות, ורק אחר כך עוברים לתרגול ב-JURIS. פרטי המקרה אינם נשלחים בכתובת או לנתוני השיווק. אפשר לפתוח גם במסך מלא: '
		. '<a href="' . esc_url( $fullscreen_url ) . '" target="_blank" rel="noopener">jus-tice.com</a></p>'
		. '</div>';
}
add_shortcode( 'justice_arena_embed', 'justice_theme_arena_embed_shortcode' );
