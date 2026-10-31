<?php
/**
 * The office line of a registered lawyer card: a light street plan, the address, navigation links, and the
 * lawyer's Attorney entity for search engines (HAD-616, Ben 31.10.2026: "a map with Maya's card, gently").
 *
 * The plan is drawn from OpenStreetMap by tools/build-office-map.py (no third-party script, no cookie, about 23 KB,
 * lazy). A live Google map loads only on a click. Google review stars are deliberately NOT shown or marked up here:
 * marking up ratings taken from another site breaks Google's review-snippet rules, and the profile's own
 * first-party reviews live on the profile (inc/lawyer-reviews.php).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Office facts for the cards that carry a plan. Keyed by the lawyer post slug; the address itself is the profile's
 * own office_address meta, so the card and the profile never disagree.
 *
 * @return array<string, array<string, mixed>>
 */
function justice_theme_lawyer_office_registry(): array {
	return array(
		// Google Maps place pin and listing, read 31.10.2026; the plan: OpenStreetMap, the same day.
		'advocate-maya-rotenberg' => array(
			'lat'        => 32.1096992,
			'lng'        => 34.8373336,
			'map_image'  => 'assets/images/maps/rotenberg-office.svg',
			'google_cid' => '9281051091434286367',
			'street'     => 'ראול ולנברג 18',
			'locality'   => 'תל אביב-יפו',
			'postal'     => '6971915',
			'checked_on' => '2026-10-31',
		),
	);
}

/**
 * The office of one lawyer card, or null when the lawyer has no plan.
 *
 * @param WP_Post $firm The justice_lawyer post.
 * @return array<string, mixed>|null
 */
function justice_theme_lawyer_office( WP_Post $firm ): ?array {
	$registry = justice_theme_lawyer_office_registry();
	if ( empty( $registry[ $firm->post_name ] ) ) {
		return null;
	}
	$office = $registry[ $firm->post_name ];
	$address = trim( wp_strip_all_tags( (string) get_post_meta( $firm->ID, 'office_address', true ) ) );
	// The profile's own address, without the postal code; the street and city when the meta is empty.
	$office['address'] = '' !== $address ? trim( preg_replace( '/\s*\d{7}\s*$/', '', $address ) ) : $office['street'] . ', ' . $office['locality'];
	return $office;
}

/**
 * The plan, the address and the navigation links.
 *
 * @param WP_Post              $firm   The justice_lawyer post.
 * @param array<string, mixed> $office From justice_theme_lawyer_office().
 * @return string HTML.
 */
function justice_theme_lawyer_office_html( WP_Post $firm, array $office ): string {
	$lat     = (float) $office['lat'];
	$lng     = (float) $office['lng'];
	$query   = rawurlencode( $office['street'] . ', ' . $office['locality'] );
	$waze    = 'https://waze.com/ul?ll=' . $lat . '%2C' . $lng . '&navigate=yes';
	$google  = 'https://www.google.com/maps/dir/?api=1&destination=' . $query;
	$embed   = function_exists( 'justice_theme_lawyer_map_embed_url' ) ? justice_theme_lawyer_map_embed_url( $firm->ID ) : '';
	$img_url = get_template_directory_uri() . '/' . $office['map_image'];
	$html  = '<div class="jt-office">';
	$html .= '<div class="jt-office__map">';
	$html .= '<img class="jt-office__plan" src="' . esc_url( $img_url ) . '" width="640" height="376" loading="lazy" decoding="async" alt="' . esc_attr( 'מפת הרחובות סביב המשרד: ' . $office['address'] ) . '">';
	$html .= '<span class="jt-office__credit">© OpenStreetMap</span>';
	$html .= '</div>';
	$html .= '<p class="jt-office__address">' . esc_html( $office['address'] ) . '</p>';
	$html .= '<p class="jt-office__links">';
	$html .= '<a href="' . esc_url( $waze ) . '" target="_blank" rel="noopener nofollow">ניווט בוויז</a>';
	$html .= '<a href="' . esc_url( $google ) . '" target="_blank" rel="noopener nofollow">ניווט בגוגל מפות</a>';
	if ( '' !== $embed ) {
		$html .= '<button type="button" class="jt-office__live" data-jt-office-map="' . esc_url( $embed ) . '">מפה חיה</button>';
	}
	$html .= '</p></div>';
	return $html;
}

/**
 * The lawyer's Attorney node, by the same @id as her profile, with the office address, the pin and the Google
 * listing as the map. No rating: see the file header.
 *
 * @param WP_Post              $firm   The justice_lawyer post.
 * @param array<string, mixed> $office From justice_theme_lawyer_office().
 * @return array<string, mixed>
 */
function justice_theme_lawyer_office_schema( WP_Post $firm, array $office ): array {
	$profile = function_exists( 'justice_theme_public_permalink' ) ? justice_theme_public_permalink( $firm->ID ) : get_permalink( $firm );
	$map     = 'https://maps.google.com/?cid=' . $office['google_cid'];
	$node    = array(
		'@context' => 'https://schema.org',
		'@type'    => 'Attorney',
		'@id'      => trailingslashit( $profile ) . '#attorney',
		'name'     => $firm->post_title,
		'url'      => $profile,
		'address'  => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => $office['street'],
			'addressLocality' => $office['locality'],
			'postalCode'      => $office['postal'],
			'addressCountry'  => 'IL',
		),
		'geo'      => array(
			'@type'     => 'GeoCoordinates',
			'latitude'  => $office['lat'],
			'longitude' => $office['lng'],
		),
		'hasMap'   => $map,
	);
	$firm_name = trim( wp_strip_all_tags( (string) get_post_meta( $firm->ID, 'firm_name', true ) ) );
	if ( '' !== $firm_name ) {
		$node['worksFor'] = array( '@type' => 'LegalService', 'name' => $firm_name );
	}
	$phone = preg_replace( '/[^0-9]/', '', (string) get_post_meta( $firm->ID, 'phone', true ) );
	if ( $phone ) {
		$node['telephone'] = '+972' . ltrim( $phone, '0' );
	}
	$site = trim( (string) get_post_meta( $firm->ID, 'website', true ) );
	$node['sameAs'] = array_values( array_filter( array( $site ? esc_url_raw( $site ) : '', $map ) ) );
	return $node;
}

/**
 * The one script the office line needs: "מפה חיה" swaps the plan for the live map, on a click only.
 *
 * @return string
 */
function justice_theme_lawyer_office_script(): string {
	return '<script>document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-jt-office-map]");if(!b){return;}'
		. 'var m=b.closest(".jt-office").querySelector(".jt-office__map");var f=document.createElement("iframe");'
		. 'f.src=b.getAttribute("data-jt-office-map");f.title="מפה חיה של מיקום המשרד";f.loading="lazy";f.referrerPolicy="no-referrer-when-downgrade";'
		. 'm.replaceChildren(f);m.classList.add("is-live");b.remove();});</script>';
}
