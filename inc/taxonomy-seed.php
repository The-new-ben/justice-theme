<?php
/**
 * Safe admin-only taxonomy seeding for core legal areas.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_seed_core_practice_terms(): void {
	if ( ! current_user_can( 'manage_options' ) || get_option( 'justice_core_practice_terms_seeded_v1' ) ) {
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
