<?php
/**
 * Criminal pillar presentation bridge.
 *
 * The live theme predates the reviewed criminal pillar release and hard-codes
 * a broad comparison and fee summary before post_content. This compatibility
 * bridge changes only the Hero on page 20211. Every structural expectation is
 * checked before any output is changed, so an unexpected theme revision leaves
 * the response byte-for-byte untouched.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return the normalized request path.
 */
function justice_ops_criminal_release_request_path(): string {
	$path = (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
	$path = '/' . trim( $path, '/' ) . '/';

	return '//' === $path ? '/' : $path;
}

/**
 * Allow operations to retire the r2 bridge after the theme gains a config filter.
 *
 * The legacy Hero can remain visible when an unknown or stale r1 option state
 * disables the earlier contract. A new, release-specific option isolates this
 * reviewed contract from the r1 state.
 */
function justice_ops_criminal_release_bridge_enabled(): bool {
	$enabled = true;

	if ( function_exists( 'get_option' ) ) {
		$enabled = '0' !== (string) get_option( 'justice_ops_criminal_release_r2_enabled', '1' );
	}

	return (bool) apply_filters( 'justice_ops_criminal_release_bridge_enabled', $enabled );
}

/**
 * Return the exact reviewed Hero contract.
 *
 * @return array<string,mixed>
 */
function justice_ops_criminal_release_contract(): array {
	return array(
		'page_id'      => 20211,
		'path'         => '/criminal-defense-attorney/',
		'old_summary'  => 'זומנתם לחקירה, נעצרתם או קיבלתם כתב אישום? כך בוחרים עורך דין פלילי מומלץ: השוואת סנגורים לפי סוג העבירה, שכר טרחה וזמינות למעצר, וכל שלבי ההליך הפלילי צעד אחר צעד.',
		'new_summary'  => 'עורך דין פלילי מייעץ לפני חקירה ומייצג בהליכי מעצר, שימוע וכתב אישום. בעמוד זה אפשר לזהות מה דחוף עכשיו, אילו מסמכים להכין ואיזה ניסיון צריך לבדוק לפני בחירת סנגור לתיק.',
		'body_marker'   => 'עורך דין פלילי מייעץ לחשודים לפני חקירה, מייצג עצורים ונאשמים',
		'surface_replacements' => array(
			'נבדקו ונמצאו מובילים' => 'משרדים בתחום הפלילי',
			'משרדי עורכי דין מובילים במשפט פלילי' => 'משרדי עורכי דין במשפט פלילי',
		),
		'legacy_links' => array(
			'/criminal-law-price-list-lawyer-recommended-review-costs/' => 'עורך דין פלילי מחירון ושכר טרחה',
			'/detention-days/' => 'מעצר וימי מעצר',
			'/drug-offenses-criminal-lawyer/' => 'עבירות סמים',
			'/sex-crime-lawyer/' => 'עבירות מין',
			'/criminal-record-expungement/' => 'מחיקת רישום פלילי',
			'/apply-for-police-criminal-information-certificates/' => 'תעודת יושר',
		),
		'new_links'    => array(
			'/police-investigation-rights/' => 'חקירה במשטרה: זכויות והתייעצות',
			'/detention-days/' => 'מעצר: זכויות ודיון בבית המשפט',
			'/criminal-indictment/' => 'כתב אישום: שלבים והגנה',
		),
	);
}

/**
 * Count one exact anchor inside the supplied Hero fragment.
 */
function justice_ops_criminal_release_anchor_count( string $hero, string $path, string $label ): int {
	$url     = esc_url( home_url( $path ) );
	$pattern = '#<a\\b[^>]*href=["\\\']' . preg_quote( $url, '#' ) . '["\\\'][^>]*>\\s*' . preg_quote( esc_html( $label ), '#' ) . '\\s*</a>#u';
	$count   = preg_match_all( $pattern, $hero );

	return false === $count ? 0 : (int) $count;
}

/**
 * Build the narrow three-stage navigation panel.
 *
 * @param array<string,string> $links Reviewed path and label pairs.
 */
function justice_ops_criminal_release_panel( array $links ): string {
	$items = '';

	foreach ( $links as $path => $label ) {
		$items .= '<li><a href="' . esc_url( home_url( $path ) ) . '">' . esc_html( $label ) . '</a></li>';
	}

	return '<aside class="legal-pillar-hero__panel" aria-label="מסלול מהיר" data-jt-criminal-hero="2026-08-03-r2">'
		. '<strong>שלבי ההליך הפלילי</strong><ul>' . $items . '</ul></aside>';
}

/**
 * Replace the legacy Hero only when every expected invariant matches once.
 */
function justice_ops_criminal_release_filter_html( string $html ): string {
	if ( ! justice_ops_criminal_release_bridge_enabled() ) {
		return $html;
	}

	$contract = justice_ops_criminal_release_contract();
	if ( $contract['path'] !== justice_ops_criminal_release_request_path() ) {
		return $html;
	}

	$body_position = stripos( $html, '<body' );
	if ( false === $body_position ) {
		return $html;
	}

	$head = substr( $html, 0, $body_position );
	$body = substr( $html, $body_position );
	if (
		1 !== substr_count( $body, $contract['body_marker'] )
		|| 1 !== substr_count( $body, $contract['old_summary'] )
	) {
		return $html;
	}

	$h1_count = preg_match_all( '#<h1\\b[^>]*>[\\s\\S]*?</h1>#iu', $body );
	if ( 1 !== $h1_count ) {
		return $html;
	}

	$hero_pattern = '#<section\\b[^>]*class=["\\\'][^"\\\']*\\blegal-pillar-hero\\b[^"\\\']*["\\\'][^>]*>[\\s\\S]*?</section>#iu';
	$hero_count   = preg_match_all( $hero_pattern, $body, $hero_matches );
	if ( 1 !== $hero_count || empty( $hero_matches[0][0] ) ) {
		return $html;
	}

	$hero = (string) $hero_matches[0][0];
	if ( 1 !== substr_count( $hero, $contract['old_summary'] ) ) {
		return $html;
	}

	$panel_pattern = '#<aside\\b[^>]*class=["\\\'][^"\\\']*\\blegal-pillar-hero__panel\\b[^"\\\']*["\\\'][^>]*>[\\s\\S]*?</aside>#iu';
	$panel_count   = preg_match_all( $panel_pattern, $hero, $panel_matches );
	if ( 1 !== $panel_count || empty( $panel_matches[0][0] ) ) {
		return $html;
	}

	$legacy_panel = (string) $panel_matches[0][0];
	foreach ( $contract['legacy_links'] as $path => $label ) {
		if ( 1 !== justice_ops_criminal_release_anchor_count( $legacy_panel, $path, $label ) ) {
			return $html;
		}
	}

	$new_hero = str_replace( $contract['old_summary'], $contract['new_summary'], $hero, $summary_replacements );
	$new_panel = justice_ops_criminal_release_panel( $contract['new_links'] );
	$new_hero  = str_replace( $legacy_panel, $new_panel, $new_hero, $panel_replacements );
	if ( 1 !== $summary_replacements || 1 !== $panel_replacements ) {
		return $html;
	}

	if (
		0 !== substr_count( $new_hero, $contract['old_summary'] )
		|| 1 !== substr_count( $new_hero, $contract['new_summary'] )
		|| 1 !== substr_count( $new_hero, 'data-jt-criminal-hero="2026-08-03-r2"' )
	) {
		return $html;
	}

	foreach ( $contract['legacy_links'] as $label ) {
		if ( false !== strpos( $new_hero, '>' . esc_html( $label ) . '</a>' ) ) {
			return $html;
		}
	}

	foreach ( $contract['new_links'] as $path => $label ) {
		if ( 1 !== justice_ops_criminal_release_anchor_count( $new_hero, $path, $label ) ) {
			return $html;
		}
	}

	$new_body = str_replace( $hero, $new_hero, $body, $hero_replacements );
	if ( 1 !== $hero_replacements || 1 !== substr_count( $new_body, $contract['body_marker'] ) ) {
		return $html;
	}

	foreach ( $contract['surface_replacements'] as $old_surface => $new_surface ) {
		if (
			1 !== substr_count( $new_body, $old_surface )
			|| 0 !== substr_count( $new_body, $new_surface )
		) {
			return $html;
		}

		$new_body = str_replace( $old_surface, $new_surface, $new_body, $surface_replacements );
		if ( 1 !== $surface_replacements ) {
			return $html;
		}
	}

	$new_body = preg_replace( '#<body\\b#i', '<body data-jt-criminal-release="2026-08-03-r2"', $new_body, 1, $body_marker_count );
	if ( ! is_string( $new_body ) || 1 !== $body_marker_count ) {
		return $html;
	}

	return $head . $new_body;
}

add_action(
	'template_redirect',
	static function (): void {
		$contract = justice_ops_criminal_release_contract();
		if (
			is_admin()
			|| ( defined( 'REST_REQUEST' ) && REST_REQUEST )
			|| wp_doing_ajax()
			|| is_feed()
			|| is_preview()
			|| is_404()
			|| ! is_page( (int) $contract['page_id'] )
			|| (int) get_queried_object_id() !== (int) $contract['page_id']
			|| $contract['path'] !== justice_ops_criminal_release_request_path()
			|| ! justice_ops_criminal_release_bridge_enabled()
		) {
			return;
		}

		ob_start( 'justice_ops_criminal_release_filter_html' );
	},
	-2100000
);
