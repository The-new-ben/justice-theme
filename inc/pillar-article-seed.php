<?php
/**
 * Draft-only seed content for the first legal SEO article layer.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_seed_pillar_article_drafts(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_pillar_article_draft_seed' ) || get_option( 'justice_pillar_article_drafts_seeded_v1' ) ) {
		return;
	}

	if ( ! post_type_exists( 'articles' ) ) {
		return;
	}

	foreach ( justice_theme_get_pillar_article_seed_drafts() as $slug => $article ) {
		if ( get_page_by_path( $slug, OBJECT, 'articles' ) ) {
			continue;
		}

		$post_id = wp_insert_post( array(
			'post_type'    => 'articles',
			'post_status'  => 'draft',
			'post_name'    => $slug,
			'post_title'   => $article['title'],
			'post_excerpt' => $article['excerpt'],
			'post_content' => $article['content'],
			'meta_input'   => array(
				'content_status'     => 'editorial_draft',
				'primary_keyword'    => $article['keyword'],
				'cluster'            => $article['cluster'],
				'search_intent'      => $article['intent'],
				'target_pillar_url'  => $article['pillar_url'],
				'needs_legal_review' => '1',
				'source_note'        => 'Seed editorial draft. Expand, fact-check, and approve before publication.',
			),
		) );

		if ( $post_id && ! is_wp_error( $post_id ) && taxonomy_exists( 'practice-areas' ) ) {
			wp_set_object_terms( $post_id, $article['practice_area'], 'practice-areas', false );
		}

		if ( $post_id && ! is_wp_error( $post_id ) && function_exists( 'uje_log' ) ) {
			uje_log( 'seeded_pillar_article', 'Created draft pillar article: ' . $slug );
		}
	}

	update_option( 'justice_pillar_article_drafts_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_pillar_article_drafts' );

function justice_theme_get_pillar_article_seed_drafts(): array {
	return array(
		'divorce-lawyer-guide' => array(
			'title'         => 'עורך דין גירושין - מדריך לבחירה, עלויות ותהליך',
			'keyword'       => 'עורך דין גירושין',
			'cluster'       => 'family-law',
			'practice_area' => 'family-law',
			'intent'        => 'commercial-investigational',
			'pillar_url'    => '/divorce-lawyer/',
			'excerpt'       => 'טיוטת מדריך לבחירת עורך דין גירושין, הכנת מסמכים, הבנת שלבי ההליך ופנייה מסודרת לייעוץ.',
			'content'       => justice_theme_build_seed_article_content(
				'עורך דין גירושין',
				'/divorce-lawyer/',
				array(
					'מתי פונים לעורך דין גירושין',
					'איך להכין מסמכים לפני שיחה ראשונה',
					'שאלות על ילדים, מזונות, רכוש והסכם גירושין',
					'איך להימנע מהבטחות שיווקיות ולבדוק התאמה מקצועית',
				)
			),
		),
		'criminal-lawyer-guide' => array(
			'title'         => 'עורך דין פלילי - מה לדעת לפני שבוחרים ייצוג',
			'keyword'       => 'עורך דין פלילי',
			'cluster'       => 'criminal-law',
			'practice_area' => 'criminal-law',
			'intent'        => 'urgent-commercial',
			'pillar_url'    => '/criminal-lawyer/',
			'excerpt'       => 'טיוטת מדריך זהיר למצבי חקירה, מעצר, כתב אישום ופנייה לעורך דין פלילי.',
			'content'       => justice_theme_build_seed_article_content(
				'עורך דין פלילי',
				'/criminal-lawyer/',
				array(
					'מה עושים לפני חקירה במשטרה',
					'איזה מידע חשוב למסור לעורך הדין',
					'שלבי הליך פלילי נפוצים',
					'דגשים לבחירת ייצוג במצב דחוף',
				)
			),
		),
		'traffic-lawyer-guide' => array(
			'title'         => 'עורך דין תעבורה - דוחות, שלילת רישיון ותאונות',
			'keyword'       => 'עורך דין תעבורה',
			'cluster'       => 'traffic-law',
			'practice_area' => 'traffic-law',
			'intent'        => 'commercial-problem-solving',
			'pillar_url'    => '/traffic-lawyer/',
			'excerpt'       => 'טיוטת מדריך לתיקי תעבורה, נקודות, שלילה, נהיגה בשכרות ותאונות דרכים.',
			'content'       => justice_theme_build_seed_article_content(
				'עורך דין תעבורה',
				'/traffic-lawyer/',
				array(
					'באילו מקרים כדאי לבדוק ייצוג',
					'מסמכים שכדאי להכין: דוח, זימון, צילום, עבר תעבורתי',
					'הבדל בין תיק תעבורה לבין תביעת נזקי גוף',
					'איך לבנות פנייה ברורה ומהירה',
				)
			),
		),
		'real-estate-lawyer-guide' => array(
			'title'         => 'עורך דין מקרקעין - מה צריך לדעת לפני עסקה',
			'keyword'       => 'עורך דין מקרקעין',
			'cluster'       => 'real-estate-law',
			'practice_area' => 'real-estate-law',
			'intent'        => 'high-value-commercial',
			'pillar_url'    => '/practice-areas/real-estate-law/',
			'excerpt'       => 'טיוטת מדריך לרוכשים, מוכרים ומשקיעים לפני חוזה מכר, רישום זכויות ובדיקת סיכונים.',
			'content'       => justice_theme_build_seed_article_content(
				'עורך דין מקרקעין',
				'/practice-areas/real-estate-law/',
				array(
					'בדיקות לפני חתימה על חוזה',
					'רישום זכויות, הערות אזהרה ומשכנתאות',
					'מיסוי, תשלומים ולוחות זמנים',
					'שילוב בדיקת מסמכים דיגיטלית עם עורך דין',
				)
			),
		),
		'employment-lawyer-guide' => array(
			'title'         => 'עורך דין דיני עבודה - מדריך לעובד ולמעסיק',
			'keyword'       => 'עורך דין עבודה',
			'cluster'       => 'labor-law',
			'practice_area' => 'labor-law',
			'intent'        => 'commercial-informational',
			'pillar_url'    => '/practice-areas/labor-law/',
			'excerpt'       => 'טיוטת מדריך לזכויות עובדים, שימוע, פיטורים, חוזה עבודה ופנייה מסודרת לייעוץ.',
			'content'       => justice_theme_build_seed_article_content(
				'עורך דין דיני עבודה',
				'/practice-areas/labor-law/',
				array(
					'מצבים נפוצים שמצריכים בדיקה משפטית',
					'איסוף תלושים, הסכמים, מכתבים והתכתבויות',
					'שימוע, פיטורים וזכויות סוציאליות',
					'אפשרות ליצירת מכתב דרישה ראשוני במערכת',
				)
			),
		),
	);
}

function justice_theme_build_seed_article_content( string $keyword, string $pillar_url, array $sections ): string {
	$list_items = '';
	foreach ( $sections as $section ) {
		$list_items .= '<li>' . esc_html( $section ) . '</li>';
	}

	return '<p><strong>סטטוס מערכת:</strong> טיוטת תוכן ראשונית בלבד. לפני פרסום נדרש עיבוי, בדיקת עובדות, עריכה מקצועית ואישור משפטי.</p>'
		. '<h2>למי המדריך מיועד?</h2>'
		. '<p>המדריך מיועד למי שמחפש מידע ראשוני סביב ' . esc_html( $keyword ) . ' ורוצה להבין מה לשאול, אילו מסמכים להכין ואיך לפנות בצורה מסודרת. התוכן אינו מחליף ייעוץ משפטי אישי.</p>'
		. '<h2>נושאים שחייבים להרחיב לפני פרסום</h2>'
		. '<ul>' . $list_items . '</ul>'
		. '<h2>קישור לעמוד המרכזי</h2>'
		. '<p>לאחר אישור, המאמר צריך לקשר לעמוד המרכזי: <a href="' . esc_url( home_url( $pillar_url ) ) . '">' . esc_html( $keyword ) . '</a>, והעמוד המרכזי צריך לקשר חזרה למאמר זה כחלק ממבנה פנימי מסודר.</p>'
		. '<h2>הערת זהירות</h2>'
		. '<p>המידע באתר כללי בלבד, אינו ייעוץ משפטי ואינו יוצר יחסי עורך דין-לקוח. בכל מקרה אישי יש להיוועץ בעורך דין מוסמך.</p>';
}
