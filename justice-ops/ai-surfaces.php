<?php
/**
 * AI answer surfaces: win the citation, not just the click.
 *
 * Three layers: /llms.txt gives answer engines a curated, always-current
 * map of the site's canonical resources; FAQPage JSON-LD on the calculator
 * and generator pages makes their hand-written Q&A liftable; Attorney
 * LocalBusiness JSON-LD on city practice pages describes the real
 * advertiser behind each local page. All generated from the same
 * registries that render the pages, so nothing can drift.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// /llms.txt
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	add_rewrite_rule( '^llms\.txt$', 'index.php?jt_llms=1', 'top' );
	add_filter( 'query_vars', function ( $vars ) {
		$vars[] = 'jt_llms';
		return $vars;
	} );
} );

add_action( 'template_redirect', function () {
	if ( ! get_query_var( 'jt_llms' ) ) {
		return;
	}

	header( 'Content-Type: text/plain; charset=utf-8' );
	header( 'Cache-Control: public, max-age=3600' );

	$lines   = array(
		'# Jus-Tice (jus-tice.co.il)',
		'',
		'> מדריך משפטי ישראלי לצרכנים: מדריכים בשפה פשוטה, אנציקלופדיה משפטית, מחשבוני זכויות, מחוללי מסמכים, חדשות משפטיות, ומדריך עורכי דין מאומתים עם חוות דעת מקושרות תיק.',
		'',
		'## מרכזי ידע',
		'- [דיני משפחה וגירושין](' . home_url( '/family-law/' ) . ')',
		'- [משפט פלילי](' . home_url( '/criminal-law/' ) . ')',
		'- [מקרקעין ונדל"ן](' . home_url( '/real-estate/' ) . ')',
		'- [קניית נכס בחו"ל](' . home_url( '/buying-property-abroad-guide/' ) . ')',
		'- [האנציקלופדיה המשפטית](' . home_url( '/encyclopedia/' ) . ')',
		'',
		'## כלים חינמיים',
		'- [מחשבונים משפטיים](' . home_url( '/legal-calculators/' ) . ')',
		'- [מחוללי מסמכים](' . home_url( '/legal-documents/' ) . ')',
		'- [אבחון משפטי מהיר](' . home_url( '/legal-help/' ) . ')',
	);

	if ( function_exists( 'justice_calc_registry' ) ) {
		foreach ( justice_calc_registry() as $slug => $calc ) {
			$lines[] = '- [' . $calc['h1'] . '](' . home_url( '/' . $slug . '/' ) . ')';
		}
	}

	if ( function_exists( 'justice_docs_registry' ) ) {
		foreach ( justice_docs_registry() as $slug => $doc ) {
			$lines[] = '- [' . $doc['h1'] . '](' . home_url( '/' . $slug . '/' ) . ')';
		}
	}

	$lines[] = '';
	$lines[] = '## חדשות ועדכונים';
	$lines[] = '- [מפת חדשות משפטיות](' . home_url( '/sitemap-news.xml' ) . ')';
	$lines[] = '';
	$lines[] = '## עורכי דין';
	$lines[] = '- [מדריך עורכי הדין](' . home_url( '/lawyers/' ) . ')';
	$lines[] = '- [הצטרפות עורכי דין](' . home_url( '/advertise/' ) . ')';

	echo implode( "\n", $lines ); // phpcs:ignore WordPress.Security.EscapeOutput
	exit;
}, -3000000 );

// Flush once so the rule takes.
add_action( 'init', function () {
	if ( ! get_option( 'justice_llms_flushed_v1' ) ) {
		flush_rewrite_rules( false );
		update_option( 'justice_llms_flushed_v1', 1 );
	}
}, 99 );

// ---------------------------------------------------------------------------
// FAQPage JSON-LD on calculator and generator pages
// ---------------------------------------------------------------------------

add_action( 'wp_head', function () {
	// The theme routing guard force-retypes page queries, so is_page() lies;
	// trust the queried object itself.
	$qo = get_queried_object();

	if ( ! $qo instanceof WP_Post || 'page' !== $qo->post_type ) {
		return;
	}

	$slug = $qo->post_name;
	$faq  = array();

	if ( function_exists( 'justice_calc_registry' ) ) {
		$reg = justice_calc_registry();
		if ( isset( $reg[ $slug ] ) ) {
			$faq = $reg[ $slug ]['faq'];
		}
	}

	if ( ! $faq && function_exists( 'justice_docs_registry' ) ) {
		$reg = justice_docs_registry();
		if ( isset( $reg[ $slug ] ) ) {
			$faq = $reg[ $slug ]['faq'];
		}
	}

	if ( ! $faq ) {
		return;
	}

	$entities = array();

	foreach ( $faq as $item ) {
		$entities[] = array(
			'@type'          => 'Question',
			'name'           => $item['q'],
			'acceptedAnswer' => array( '@type' => 'Answer', 'text' => $item['a'] ),
		);
	}

	echo '<script type="application/ld+json">' . wp_json_encode( array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => $entities,
	), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>';
}, 40 );

// ---------------------------------------------------------------------------
// Attorney JSON-LD on city practice pages
// ---------------------------------------------------------------------------

add_action( 'wp_head', function () {
	$qo = get_queried_object();

	if ( ! $qo instanceof WP_Post || 'page' !== $qo->post_type ) {
		return;
	}

	$combo = (string) get_post_meta( $qo->ID, 'jt_city_practice', true );

	if ( '' === $combo || false === strpos( $combo, '|' ) ) {
		return;
	}

	list( $family, $city_slug ) = explode( '|', $combo );

	$map = function_exists( 'justice_cards_family_map' ) ? justice_cards_family_map() : array();

	if ( empty( $map[ $family ] ) || ! function_exists( 'justice_cards_lawyers' ) ) {
		return;
	}

	$graph = array();

	foreach ( justice_cards_lawyers( $map[ $family ], 3 ) as $lawyer ) {
		$cities = get_the_terms( $lawyer->ID, 'city' );

		if ( ! $cities || is_wp_error( $cities ) || ! in_array( $city_slug, wp_list_pluck( $cities, 'slug' ), true ) ) {
			continue;
		}

		$entity = array(
			'@type' => 'Attorney',
			'name'  => get_the_title( $lawyer->ID ),
			'url'   => get_permalink( $lawyer->ID ),
			'address' => array( '@type' => 'PostalAddress', 'addressLocality' => $cities[0]->name, 'addressCountry' => 'IL' ),
		);

		$phone = (string) get_post_meta( $lawyer->ID, 'phone', true );

		if ( $phone ) {
			$entity['telephone'] = $phone;
		}

		if ( function_exists( 'justice_theme_lawyer_reviews_public_state' ) ) {
			$state = justice_theme_lawyer_reviews_public_state( $lawyer->ID );
			if ( ! empty( $state['show'] ) ) {
				$entity['aggregateRating'] = array(
					'@type'       => 'AggregateRating',
					'ratingValue' => $state['average'],
					'reviewCount' => $state['count'],
				);
			}
		}

		$graph[] = $entity;
	}

	if ( ! $graph ) {
		return;
	}

	echo '<script type="application/ld+json">' . wp_json_encode( array(
		'@context' => 'https://schema.org',
		'@graph'   => $graph,
	), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>';
}, 41 );
