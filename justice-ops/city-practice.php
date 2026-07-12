<?php
/**
 * City × practice page engine: the directory scale play, inventory-gated.
 *
 * A local landing page is generated ONLY where real inventory exists: at
 * least one eligible advertiser (public-approval gate plus positive score)
 * in that practice family carrying that city term. Thin combos are never
 * created, which is the whole defense against doorway-page classification.
 * Each page: keyword-first Hebrew title, machine-written unique opening,
 * the advertisers' cards, the family hub link and recent family guides.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_city_family_labels(): array {
	return array(
		'family'       => array( 'he' => 'דיני משפחה וגירושין', 'slug' => 'family-lawyer', 'hub' => '/family-law/' ),
		'criminal-law' => array( 'he' => 'פלילי', 'slug' => 'criminal-lawyer', 'hub' => '/criminal-law/' ),
		'real-estate'  => array( 'he' => 'מקרקעין ונדל"ן', 'slug' => 'real-estate-lawyer', 'hub' => '/real-estate/' ),
		'labor'        => array( 'he' => 'דיני עבודה', 'slug' => 'labor-lawyer', 'hub' => '/israeli-labor-law/' ),
		'nezikin'      => array( 'he' => 'נזיקין ותאונות', 'slug' => 'injury-lawyer', 'hub' => '/personal-injury/' ),
		'traffic'      => array( 'he' => 'תעבורה', 'slug' => 'traffic-lawyer', 'hub' => '/traffic-law/' ),
		'inheritance'  => array( 'he' => 'ירושה וצוואות', 'slug' => 'inheritance-lawyer-city', 'hub' => '/inheritance-lawyer/' ),
	);
}

/**
 * Inventory: eligible advertisers per (family, city term).
 */
function justice_city_inventory(): array {
	$map = justice_cards_family_map();
	$out = array();

	foreach ( justice_city_family_labels() as $family => $conf ) {
		if ( empty( $map[ $family ] ) ) {
			continue;
		}

		$lawyers = justice_cards_lawyers( $map[ $family ], 12 );

		foreach ( $lawyers as $lawyer ) {
			$cities = get_the_terms( $lawyer->ID, 'city' );

			if ( ! $cities || is_wp_error( $cities ) ) {
				continue;
			}

			foreach ( $cities as $city ) {
				$out[ $family ][ $city->slug ]['city_name'] = $city->name;
				$out[ $family ][ $city->slug ]['lawyers'][] = $lawyer->ID;
			}
		}
	}

	return $out;
}

/**
 * Machine opening for one combo (single short call, iron rules enforced by
 * the shared scrubber downstream in render).
 */
function justice_city_opening( string $family_he, string $city_name ): string {
	$text = justice_ai_chat( array(
		array( 'role' => 'system', 'content' => 'כתוב עברית משפטית עניינית. אסור: קו מפריד ארוך, סופרלטיבים, הבטחות תוצאה, הביטויים חשוב לציין, בעידן, מעבר לכך, לסיכום, ראוי לציין, יש לזכור, חשוב להבין, חשוב לדעת, בשורה התחתונה, אין ספק, יתרה מכך, זאת ועוד. בלי המצאת עובדות, בלי שמות בתי משפט ספציפיים אלא אם ידועים בוודאות. פסקאות p בלבד.' ),
		array( 'role' => 'user', 'content' => 'כתוב פתיח של 140 עד 180 מילים לעמוד "עורך דין ' . $family_he . ' ב' . $city_name . '". מילת המפתח במשפט הראשון. הסבר מה מיוחד בליווי מקומי, אילו שאלות לשאול בפגישה ראשונה, ואיך העמוד עוזר לבחור. שתי פסקאות p.' ),
	), array(
		'model'       => get_option( 'justice_art_model', 'gpt-4.1' ),
		'temperature' => 0.5,
		'max_tokens'  => 500,
		'timeout'     => 45,
		'source'      => 'city',
	) );

	$text = str_replace( array( '—', '–' ), ',', $text );

	if ( function_exists( 'justice_enc_teller_hits' ) && justice_enc_teller_hits( $text ) ) {
		return '';
	}

	if ( false === strpos( $text, '<p' ) ) {
		$text = '<p>' . implode( '</p><p>', array_filter( array_map( 'trim', explode( "\n", $text ) ) ) ) . '</p>';
	}

	return $text;
}

/**
 * Generate missing combo pages, capped per run.
 */
function justice_city_generate( int $cap = 3 ): array {
	$labels  = justice_city_family_labels();
	$created = array();
	$skipped = array();

	foreach ( justice_city_inventory() as $family => $cities ) {
		foreach ( $cities as $city_slug => $info ) {
			if ( count( $created ) >= $cap ) {
				break 2;
			}

			$slug = $labels[ $family ]['slug'] . '-' . $city_slug;

			if ( get_page_by_path( $slug, OBJECT, 'page' ) ) {
				$skipped[] = $slug . ' (exists)';
				continue;
			}

			$family_he = $labels[ $family ]['he'];
			$city_name = $info['city_name'];
			$opening   = justice_city_opening( $family_he, $city_name );

			if ( '' === $opening ) {
				$skipped[] = $slug . ' (opening failed)';
				continue;
			}

			$cards = '';
			foreach ( array_slice( array_unique( $info['lawyers'] ), 0, 3 ) as $lawyer_id ) {
				$lawyer = get_post( $lawyer_id );
				if ( $lawyer instanceof WP_Post ) {
					$cards .= justice_cards_render( $lawyer );
				}
			}

			$guides = get_posts( array(
				'post_type'      => 'articles',
				'posts_per_page' => 3,
				'tax_query'      => array( array( 'taxonomy' => 'practice-areas', 'field' => 'slug', 'terms' => justice_cards_family_map()[ $family ] ) ),
			) );

			$guide_html = '';
			foreach ( $guides as $guide ) {
				$guide_html .= '<li><a href="' . esc_url( get_permalink( $guide ) ) . '">' . esc_html( get_the_title( $guide ) ) . '</a></li>';
			}

			$body = $opening
				. '<h2>עורכי דין מומלצים בתחום ' . esc_html( $family_he ) . ' ב' . esc_html( $city_name ) . '</h2>'
				. $cards
				. '<h2>מדריכים שיעזרו לכם להתכונן</h2>'
				. ( $guide_html ? '<ul>' . $guide_html . '</ul>' : '' )
				. '<p>למדריך המלא בתחום: <a href="' . esc_url( home_url( $labels[ $family ]['hub'] ) ) . '">המדריך המלא בנושא ' . esc_html( $family_he ) . '</a>. אפשר גם לשלוח הודעת וואטסאפ מהכפתור הצף ולקבל התאמה אישית.</p>';

			$title = 'עורך דין ' . $family_he . ' ב' . $city_name . ': ליווי מקומי ובחירה נכונה';

			$page_id = wp_insert_post( array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_content' => $body,
			) );

			if ( $page_id && ! is_wp_error( $page_id ) ) {
				update_post_meta( $page_id, 'seo_title', 'עורך דין ' . $family_he . ' ב' . $city_name . ' | Jus-Tice' );
				update_post_meta( $page_id, 'jt_city_practice', $family . '|' . $city_slug );
				$created[] = home_url( '/' . $slug . '/' );
			}
		}
	}

	return array( 'created' => $created, 'skipped' => $skipped );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/city-pages-run', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			if ( (int) $request->get_param( 'dry' ) ) {
				$inv = array();
				foreach ( justice_city_inventory() as $family => $cities ) {
					foreach ( $cities as $slug => $info ) {
						$inv[] = $family . ' x ' . $slug . ' (' . count( array_unique( $info['lawyers'] ) ) . ' lawyers)';
					}
				}
				return array( 'inventory' => $inv );
			}

			return justice_city_generate( max( 1, min( 5, (int) ( $request->get_param( 'cap' ) ?: 3 ) ) ) );
		},
	) );
} );

/**
 * Weekly: generate anything new inventory unlocked (new advertisers create
 * new local pages automatically).
 */
add_action( 'justice_serp_tick', function () {
	justice_city_generate( 2 );
} );
