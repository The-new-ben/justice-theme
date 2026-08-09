<?php
/**
 * Controlled real-estate content release bridge.
 *
 * The production theme still owns visible H1 text, pillar summaries, legacy
 * author blocks and several schema graphs outside post_content. This module is
 * limited to four preserved URLs and makes the reviewed content contract
 * authoritative without changing routing, slugs or post identity.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Exact public contract for the coordinated real-estate cohort.
 *
 * @return array<string,array<string,string>>
 */
function justice_ops_real_estate_release_contracts(): array {
	return array(
		'/real-estate-attorney/' => array(
			'h1'          => 'עורך דין מקרקעין',
			'seo_title'   => 'עורך דין מקרקעין: ייעוץ וליווי בנדל״ן | Jus-Tice',
			'description' => 'עורך דין מקרקעין לעסקה, רישום, מיסוי, התחדשות או סכסוך. כך מזהים את הניסיון הדרוש, מה מכינים לייעוץ ומה כולל הליווי המשפטי.',
			'canonical'   => 'https://jus-tice.co.il/real-estate-attorney/',
		),
		'/real-estate-lawyer-guide/' => array(
			'h1'          => 'מה עושה עורך דין מקרקעין בעסקה',
			'seo_title'   => 'מה עושה עורך דין מקרקעין: תפקיד, בדיקות ושלבים | Jus-Tice',
			'description' => 'מה עורך דין מקרקעין בודק לפני התחייבות, כיצד הוא מלווה חוזה ורישום, מה נשאר לאחריות בעלי מקצוע אחרים ולאיזה מדריך ממשיכים בכל שלב.',
			'canonical'   => 'https://jus-tice.co.il/real-estate-lawyer-guide/',
		),
		'/lawyer-for-buying-or-selling-a-house/' => array(
			'h1'          => 'עורך דין לקניית דירה ולמכירת דירה',
			'seo_title'   => 'עורך דין קניית דירה ומכירת דירה: ליווי בעסקה | Jus-Tice',
			'description' => 'ליווי משפטי בקניית או מכירת דירה, עם מסלול נפרד לקונה ולמוכר, מסמכים ובדיקות מרכזיות והפניה נפרדת למיסוי, רישום ושכר טרחה.',
			'canonical'   => 'https://jus-tice.co.il/lawyer-for-buying-or-selling-a-house/',
		),
		'/real-estate-lawyer-cost-2025/' => array(
			'h1'          => 'שכר טרחת עורך דין בקניית ומכירת דירה',
			'seo_title'   => 'שכר טרחת עורך דין בקניית או מכירת דירה | Jus-Tice',
			'description' => 'שכר טרחת עורך דין בקניית או מכירת דירה, מה עשוי להיכלל ומה מחויב בנפרד. שיטה להשוואת הצעות ללא טווח מחיר לא מבוסס.',
			'canonical'   => 'https://jus-tice.co.il/real-estate-lawyer-cost-2025/',
		),
	);
}

/**
 * Return the normalized request path.
 */
function justice_ops_real_estate_release_request_path(): string {
	$path = (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
	$path = '/' . trim( $path, '/' ) . '/';

	return '//' === $path ? '/' : $path;
}

/**
 * Resolve the current release contract.
 *
 * @return array<string,string>|null
 */
function justice_ops_current_real_estate_release_contract(): ?array {
	$contracts = justice_ops_real_estate_release_contracts();

	return $contracts[ justice_ops_real_estate_release_request_path() ] ?? null;
}

/**
 * Allow operations to retire this compatibility bridge without deleting it.
 */
function justice_ops_real_estate_release_bridge_enabled(): bool {
	$enabled = '0' !== (string) get_option( 'justice_ops_real_estate_release_bridge_enabled', '1' );

	return (bool) apply_filters( 'justice_ops_real_estate_release_bridge_enabled', $enabled );
}

/**
 * Install metadata filters after legacy theme filters.
 */
function justice_ops_install_real_estate_release_metadata_filters(): void {
	if ( ! justice_ops_real_estate_release_bridge_enabled() || null === justice_ops_current_real_estate_release_contract() ) {
		return;
	}

	add_filter( 'pre_get_document_title', 'justice_ops_real_estate_release_title', PHP_INT_MAX );
	add_filter( 'wpseo_title', 'justice_ops_real_estate_release_title', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_title', 'justice_ops_real_estate_release_title', PHP_INT_MAX );
	add_filter( 'wpseo_twitter_title', 'justice_ops_real_estate_release_title', PHP_INT_MAX );
	add_filter( 'wpseo_metadesc', 'justice_ops_real_estate_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_desc', 'justice_ops_real_estate_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_twitter_description', 'justice_ops_real_estate_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_canonical', 'justice_ops_real_estate_release_canonical', PHP_INT_MAX );
}
add_action( 'get_header', 'justice_ops_install_real_estate_release_metadata_filters', PHP_INT_MAX );

/**
 * Return the controlled SEO title.
 *
 * @param mixed $title Existing title.
 */
function justice_ops_real_estate_release_title( $title ): string {
	$contract = justice_ops_current_real_estate_release_contract();

	return $contract ? $contract['seo_title'] : (string) $title;
}

/**
 * Return the controlled description.
 *
 * @param mixed $description Existing description.
 */
function justice_ops_real_estate_release_description( $description ): string {
	$contract = justice_ops_current_real_estate_release_contract();

	return $contract ? $contract['description'] : (string) $description;
}

/**
 * Return the controlled self-canonical.
 *
 * @param mixed $canonical Existing canonical.
 */
function justice_ops_real_estate_release_canonical( $canonical ): string {
	$contract = justice_ops_current_real_estate_release_contract();

	return $contract ? $contract['canonical'] : (string) $canonical;
}

/**
 * Replace the first visible H1 while preserving its attributes.
 */
function justice_ops_real_estate_release_replace_h1( string $body, string $h1 ): string {
	$updated = preg_replace_callback(
		'#(<h1\b[^>]*>)[\s\S]*?(</h1>)#iu',
		static function ( array $match ) use ( $h1 ): string {
			return $match[1] . esc_html( $h1 ) . $match[2];
		},
		$body,
		1
	);

	return is_string( $updated ) ? $updated : $body;
}

/**
 * Replace the pillar hero summary that is rendered outside post_content.
 */
function justice_ops_real_estate_release_replace_summary( string $body, string $summary ): string {
	$updated = preg_replace_callback(
		'#(<section\b[^>]*class=["\'][^"\']*\blegal-pillar-hero\b[^"\']*["\'][^>]*>[\s\S]*?</h1>\s*)<p\b([^>]*)>[\s\S]*?</p>#iu',
		static function ( array $match ) use ( $summary ): string {
			return $match[1] . '<p' . $match[2] . '>' . esc_html( $summary ) . '</p>';
		},
		$body,
		1
	);

	return is_string( $updated ) ? $updated : $body;
}

/**
 * Remove legacy author or reviewer claims that have no page-specific dossier.
 */
function justice_ops_real_estate_release_strip_identity_claims( string $body ): string {
	$patterns = array(
		'#<div\b[^>]*class=["\'][^"\']*\bsingle-article__author\b[^"\']*["\'][^>]*>[\s\S]*?</div>#iu',
		'#<p\b[^>]*class=["\'][^"\']*\beeat-reviewed-footer\b[^"\']*["\'][^>]*>[\s\S]*?</p>#iu',
		'#<p\b[^>]*class=["\'][^"\']*\blegal-pillar-hero__reviewed\b[^"\']*["\'][^>]*>[\s\S]*?</p>#iu',
		'#<section\b[^>]*class=["\'][^"\']*\blegal-pillar-reviewed\b[^"\']*["\'][^>]*>[\s\S]*?</section>#iu',
	);
	$updated  = preg_replace( $patterns, '', $body );

	return is_string( $updated ) ? $updated : $body;
}

/**
 * Remove a schema node whose type asserts an unproved provider, person, offer,
 * rating, review or FAQ identity. Preserve ordinary WebPage, Article,
 * BreadcrumbList, WebSite and Organization graphs.
 *
 * @param mixed $value Decoded JSON-LD value.
 * @return mixed|null
 */
function justice_ops_real_estate_release_sanitize_schema_value( $value ) {
	if ( ! is_array( $value ) ) {
		return $value;
	}

	if ( isset( $value['@type'] ) ) {
		$types     = is_array( $value['@type'] ) ? $value['@type'] : array( $value['@type'] );
		$forbidden = array(
			'AggregateRating',
			'Attorney',
			'FAQPage',
			'LegalService',
			'LocalBusiness',
			'Offer',
			'OfferCatalog',
			'Person',
			'ProfessionalService',
			'QAPage',
			'Review',
			'Service',
			'Table',
		);
		foreach ( $types as $type ) {
			if ( is_string( $type ) && in_array( $type, $forbidden, true ) ) {
				return null;
			}
		}
	}

	$is_list = array() === $value || array_keys( $value ) === range( 0, count( $value ) - 1 );
	$output  = array();
	foreach ( $value as $key => $item ) {
		$clean = justice_ops_real_estate_release_sanitize_schema_value( $item );
		if ( null === $clean ) {
			continue;
		}
		if ( $is_list ) {
			$output[] = $clean;
		} else {
			$output[ $key ] = $clean;
		}
	}

	return $output;
}

/**
 * Remove unsupported nodes from one JSON-LD script.
 */
function justice_ops_real_estate_release_filter_schema_scripts( string $html ): string {
	$updated = preg_replace_callback(
		'#<script\b([^>]*)type=["\']application/ld\+json["\']([^>]*)>([\s\S]*?)</script>#iu',
		static function ( array $match ): string {
			$decoded = json_decode( html_entity_decode( trim( $match[3] ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ), true );
			if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $decoded ) ) {
				return $match[0];
			}

			$clean = justice_ops_real_estate_release_sanitize_schema_value( $decoded );
			if ( null === $clean || array() === $clean || ( isset( $clean['@graph'] ) && array() === $clean['@graph'] ) ) {
				return '';
			}

			$json = wp_json_encode( $clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
			if ( ! is_string( $json ) || '' === $json ) {
				return $match[0];
			}

			return '<script' . $match[1] . 'type="application/ld+json"' . $match[2] . '>' . $json . '</script>';
		},
		$html
	);

	return is_string( $updated ) ? $updated : $html;
}

/**
 * Final output-buffer compatibility pass for the four exact URLs.
 */
function justice_ops_real_estate_release_filter_html( string $html ): string {
	if ( ! justice_ops_real_estate_release_bridge_enabled() ) {
		return $html;
	}

	$contract = justice_ops_current_real_estate_release_contract();
	if ( null === $contract ) {
		return $html;
	}

	$body_position = stripos( $html, '<body' );
	if ( false === $body_position ) {
		return $html;
	}

	$head = substr( $html, 0, $body_position );
	$body = substr( $html, $body_position );
	$body = justice_ops_real_estate_release_replace_h1( $body, $contract['h1'] );
	$body = justice_ops_real_estate_release_replace_summary( $body, $contract['description'] );
	$body = justice_ops_real_estate_release_strip_identity_claims( $body );
	$html = justice_ops_real_estate_release_filter_schema_scripts( $head . $body );

	if ( false === strpos( $html, 'data-jt-real-estate-release=' ) ) {
		$marked = preg_replace(
			'#<body\b#i',
			'<body data-jt-real-estate-release="2026-08-02-r1"',
			$html,
			1
		);
		if ( is_string( $marked ) ) {
			$html = $marked;
		}
	}

	return $html;
}

add_action(
	'template_redirect',
	static function (): void {
		if ( is_admin() || ! justice_ops_real_estate_release_bridge_enabled() || null === justice_ops_current_real_estate_release_contract() ) {
			return;
		}

		ob_start( 'justice_ops_real_estate_release_filter_html' );
	},
	-1900000
);
