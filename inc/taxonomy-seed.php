<?php
/**
 * Safe admin-only taxonomy seeding for core legal areas.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Ensure practice-areas taxonomy is always attached to justice_lawyer CPT.
 *
 * On some managed hosts or plugin load orders, the taxonomy may be registered
 * without justice_lawyer in its object types. This safety function runs late
 * on init to guarantee the association exists.
 */
function justice_theme_ensure_practice_areas_on_lawyer_cpt(): void {
	if ( ! taxonomy_exists( 'practice-areas' ) || ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$tax = get_taxonomy( 'practice-areas' );
	if ( $tax && ! in_array( 'justice_lawyer', (array) $tax->object_type, true ) ) {
		register_taxonomy_for_object_type( 'practice-areas', 'justice_lawyer' );
	}
}
add_action( 'init', 'justice_theme_ensure_practice_areas_on_lawyer_cpt', 99 );


function justice_theme_seed_core_practice_terms(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_core_practice_terms_seed' ) || get_option( 'justice_core_practice_terms_seeded_v1' ) ) {
		return;
	}

	if ( ! taxonomy_exists( 'practice-areas' ) ) {
		return;
	}

	$terms = array(
		'family-law'          => array( 'דיני משפחה', 'ייעוץ וייצוג בתחום גירושין, ילדים, ירושות, הסכמי ממון וסכסוכי משפחה.' ),
		'criminal-law'        => array( 'משפט פלילי', 'הגנה פלילית, חקירות, מעצרים, כתבי אישום והליכים בבתי משפט.' ),
		'traffic-law'         => array( 'דיני תעבורה', 'דוחות, שלילת רישיון, נהיגה בשכרות, נקודות ותאונות דרכים.' ),
		'real-estate-law'     => array( 'מקרקעין ונדל״ן', 'עסקאות נדל״ן, חוזי מכר, רישום בטאבו, ליקויי בנייה והתחדשות עירונית.' ),
		'labor-law'           => array( 'דיני עבודה', 'זכויות עובדים, פיטורים, שימוע, פיצויי פיטורים, חוזי עבודה והטרדה בעבודה.' ),
		'inheritance-law'     => array( 'ירושה וצוואות', 'צוואות, ירושות, התנגדות לצוואה, צו ירושה, צו קיום צוואה וניהול עיזבון.' ),
		'torts'               => array( 'נזיקין', 'נזקי גוף, פיצויים, תאונות, לשון הרע ואחריות אזרחית.' ),
		'medical-malpractice' => array( 'רשלנות רפואית', 'בדיקת עילות תביעה, פגיעות בלידה, אבחון שגוי, ניתוחים וחוות דעת רפואיות.' ),
		'national-insurance'  => array( 'ביטוח לאומי', 'קצבאות, ועדות רפואיות, נכות כללית, תאונות עבודה וערעורים.' ),
		'immigration-law'     => array( 'הגירה ואזרחות', 'אשרות, אזרחות, איחוד משפחות, מעמד בישראל והליכי הגירה.' ),
	);

	foreach ( $terms as $slug => $data ) {
		$existing = get_term_by( 'slug', $slug, 'practice-areas' );

		if ( $existing && ! is_wp_error( $existing ) ) {
			if ( empty( $existing->description ) ) {
				wp_update_term( $existing->term_id, 'practice-areas', array( 'description' => $data[1] ) );
			}
			continue;
		}

		wp_insert_term( $data[0], 'practice-areas', array(
			'slug'        => $slug,
			'description' => $data[1],
		) );
	}

	update_option( 'justice_core_practice_terms_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_core_practice_terms' );

function justice_theme_seed_core_city_terms(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_core_city_terms_seed' ) || get_option( 'justice_core_city_terms_seeded_v1' ) ) {
		return;
	}

	if ( ! taxonomy_exists( 'city' ) ) {
		return;
	}

	$cities = array(
		'tel-aviv'      => 'תל אביב',
		'jerusalem'     => 'ירושלים',
		'haifa'         => 'חיפה',
		'rishon-lezion' => 'ראשון לציון',
		'petah-tikva'   => 'פתח תקווה',
		'ashdod'        => 'אשדוד',
		'netanya'       => 'נתניה',
		'beer-sheva'    => 'באר שבע',
		'holon'         => 'חולון',
		'bnei-brak'     => 'בני ברק',
		'ramat-gan'     => 'רמת גן',
		'ashkelon'      => 'אשקלון',
		'rehovot'       => 'רחובות',
		'bat-yam'       => 'בת ים',
		'herzliya'      => 'הרצליה',
		'kfar-saba'     => 'כפר סבא',
		'modiin'        => 'מודיעין',
		'nazareth'      => 'נצרת',
		'lod'           => 'לוד',
		'ramla'         => 'רמלה',
	);

	foreach ( $cities as $slug => $name ) {
		if ( ! get_term_by( 'slug', $slug, 'city' ) ) {
			wp_insert_term( $name, 'city', array( 'slug' => $slug ) );
		}
	}

	update_option( 'justice_core_city_terms_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_core_city_terms' );
