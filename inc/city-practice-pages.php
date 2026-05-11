<?php
/**
 * Draft city-practice SEO landing pages.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_seed_city_practice_drafts(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_city_practice_draft_seed' ) || get_option( 'justice_city_practice_drafts_seeded_v1' ) ) {
		return;
	}

	foreach ( justice_theme_city_practice_seed_pages() as $slug => $page ) {
		if ( get_page_by_path( $slug, OBJECT, 'page' ) ) {
			continue;
		}

		wp_insert_post( array(
			'post_type'    => 'page',
			'post_status'  => 'draft',
			'post_name'    => $slug,
			'post_title'   => $page['title'],
			'post_excerpt' => $page['excerpt'],
			'post_content' => $page['content'],
			'meta_input'   => array(
				'_wp_page_template' => 'page-city-practice.php',
				'city_slug'         => $page['city'],
				'practice_slug'     => $page['practice'],
				'content_status'    => 'city_practice_draft',
				'traffic_risk'      => 'UNKNOWN',
			),
		) );
	}

	update_option( 'justice_city_practice_drafts_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_city_practice_drafts' );

function justice_theme_city_practice_seed_pages(): array {
	return array(
		'divorce-lawyer-tel-aviv' => array(
			'title'    => 'עורך דין גירושין בתל אביב',
			'excerpt'  => 'טיוטת עמוד עיר ותחום למשפחה וגירושין בתל אביב.',
			'city'     => 'tel-aviv',
			'practice' => 'family-law',
			'content'  => justice_theme_city_practice_content( 'גירושין', 'תל אביב', '/divorce-lawyer/' ),
		),
		'criminal-lawyer-jerusalem' => array(
			'title'    => 'עורך דין פלילי בירושלים',
			'excerpt'  => 'טיוטת עמוד עיר ותחום למשפט פלילי בירושלים.',
			'city'     => 'jerusalem',
			'practice' => 'criminal-law',
			'content'  => justice_theme_city_practice_content( 'משפט פלילי', 'ירושלים', '/criminal-lawyer/' ),
		),
		'real-estate-lawyer-haifa' => array(
			'title'    => 'עורך דין מקרקעין בחיפה',
			'excerpt'  => 'טיוטת עמוד עיר ותחום למקרקעין בחיפה.',
			'city'     => 'haifa',
			'practice' => 'real-estate-law',
			'content'  => justice_theme_city_practice_content( 'מקרקעין', 'חיפה', '/real-estate-lawyer/' ),
		),
		'employment-lawyer-tel-aviv' => array(
			'title'    => 'עורך דין דיני עבודה בתל אביב',
			'excerpt'  => 'טיוטת עמוד עיר ותחום לדיני עבודה בתל אביב.',
			'city'     => 'tel-aviv',
			'practice' => 'labor-law',
			'content'  => justice_theme_city_practice_content( 'דיני עבודה', 'תל אביב', '/employment-lawyer/' ),
		),
		'personal-injury-lawyer-rishon-lezion' => array(
			'title'    => 'עורך דין נזיקין בראשון לציון',
			'excerpt'  => 'טיוטת עמוד עיר ותחום לנזיקין בראשון לציון.',
			'city'     => 'rishon-lezion',
			'practice' => 'torts',
			'content'  => justice_theme_city_practice_content( 'נזיקין', 'ראשון לציון', '/personal-injury-lawyer/' ),
		),
	);
}

function justice_theme_city_practice_content( string $practice, string $city, string $pillar_url ): string {
	return '<p><strong>סטטוס:</strong> טיוטת SEO בלבד. אין לפרסם עד שיש תוכן ייחודי, פרופילים רלוונטיים ואישור עריכה.</p>'
		. '<h2>מה העמוד צריך לכלול לפני פרסום?</h2>'
		. '<ul><li>הסבר ייחודי על הצורך המשפטי בתחום ' . esc_html( $practice ) . ' באזור ' . esc_html( $city ) . '.</li><li>עורכי דין מאושרים ורלוונטיים בלבד.</li><li>שאלות נפוצות אמיתיות ולא טקסט משוכפל.</li><li>קישור לעמוד התחום המרכזי: <a href="' . esc_url( home_url( $pillar_url ) ) . '">' . esc_html( $practice ) . '</a>.</li></ul>'
		. '<h2>הערת מערכת</h2><p>העמוד אינו דירוג ואינו המלצה. פרופילים מוצגים רק לפי נתונים מאושרים וכללי גילוי נאות.</p>';
}
