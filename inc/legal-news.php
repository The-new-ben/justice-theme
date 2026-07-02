<?php
/**
 * Legal news: real, sourced items with NewsArticle schema and a homepage
 * band (owner-ordered 2026-07-02). Every item below is a real news event
 * verified against a named Israeli outlet on the seed date; each post
 * links its source. No fabricated news, no AI-teller phrasing.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_legal_news_category_id(): int {
	$term = get_term_by( 'slug', 'legal-news', 'category' );

	if ( $term instanceof WP_Term ) {
		return (int) $term->term_id;
	}

	$created = wp_insert_term( 'חדשות משפטיות', 'category', array( 'slug' => 'legal-news' ) );

	return is_wp_error( $created ) ? 0 : (int) $created['term_id'];
}

/**
 * One-shot seed of five real, sourced legal news items (init, flag-gated).
 */
function justice_theme_seed_legal_news(): void {
	if ( get_option( 'justice_legal_news_seed_v1' ) ) {
		return;
	}

	$cat_id = justice_theme_legal_news_category_id();
	if ( ! $cat_id ) {
		return;
	}

	$items = array(
		array(
			'title'   => 'בג"ץ קיבל עתירות נגד מבקר המדינה: חלק מביקורת אירועי 7.10 חורג מסמכותו',
			'content' => 'בית המשפט העליון קיבל שתי עתירות שהוגשו נגד מבקר המדינה מתניהו אנגלמן וקבע שחלק מהליכי הביקורת שלו על אירועי השבעה באוקטובר ועל מלחמת חרבות ברזל חורגים מסמכותו. העותרים בירכו על ההחלטה, שמסמנת גבול בין ביקורת המדינה לבין תחומים שבליבת שיקול הדעת המבצעי.',
			'source'  => 'https://www.israelhayom.co.il/news/law/article/20872337',
			'outlet'  => 'ישראל היום',
		),
		array(
			'title'   => 'הרכב מלא בבג"ץ דן בעתירות נגד שינוי הרכב הוועדה לבחירת שופטים',
			'content' => 'בית המשפט העליון קיים דיון בהרכב מלא בעתירות נגד התיקון לחוק יסוד השפיטה שמשנה את הרכב הוועדה לבחירת שופטים. מדובר באחת הסוגיות החוקתיות המרכזיות של השנים האחרונות, עם השלכות ישירות על אופן מינוי השופטים בישראל.',
			'source'  => 'https://www.mako.co.il/news-politics/2026_q2/Article-82c285436b8ee91026.htm',
			'outlet'  => 'N12',
		),
		array(
			'title'   => 'צו ביניים של בג"ץ בהליך בחירת מבקר המדינה הבא',
			'content' => 'בית המשפט העליון הוציא צו ביניים בנוגע להליך בחירת מבקר המדינה. ההחלטה מעוררת מחדש את השאלה מתי ראוי שבית המשפט יתערב בהליכי מינוי של רשויות אחרות, והיא צפויה ללוות את ההליך עד להכרעה סופית.',
			'source'  => 'https://www.israelhayom.co.il/news/law/article/20890352',
			'outlet'  => 'ישראל היום',
		),
		array(
			'title'   => 'עתירה עם פסקי דין שלא קיימים: שופטי העליון מתחו ביקורת על שימוש רשלני ב-AI',
			'content' => 'עורכת דין שנעזרה בכלי בינה מלאכותית לכתיבת עתירה לבית המשפט העליון ציטטה פסיקה שמעולם לא נכתבה, והשופטים מתחו ביקורת חריפה. המקרה מדגים את חובת הבדיקה של כל אסמכתא לפני הגשה, גם כשמשתמשים בכלי עזר טכנולוגיים.',
			'source'  => 'https://www.calcalist.co.il/local_news/article/h111l113y51l',
			'outlet'  => 'כלכליסט',
		),
		array(
			'title'   => 'מינוי השופט יצחק עמית לנשיא בית המשפט העליון פורסם ברשומות',
			'content' => 'מינויו של השופט יצחק עמית לנשיא בית המשפט העליון פורסם ברשומות והשלים רשמית את הליך המינוי. הפרסום סוגר תקופה ארוכה של אי ודאות סביב עמידות ההליך, ומסדיר את הנהגת הרשות השופטת.',
			'source'  => 'https://www.jdn.co.il/news/2682939/',
			'outlet'  => 'JDN',
		),
	);

	$created = 0;

	foreach ( $items as $offset => $item ) {
		$existing = get_page_by_path( sanitize_title( $item['title'] ), OBJECT, 'post' );
		if ( $existing instanceof WP_Post ) {
			continue;
		}

		$content = '<p>' . esc_html( $item['content'] ) . '</p>'
			. '<p class="legal-news-source">מקור הדיווח: <a href="' . esc_url( $item['source'] ) . '" target="_blank" rel="noopener nofollow">' . esc_html( $item['outlet'] ) . '</a>. הסיכום כאן הוא תמצית חדשותית ואינו ייעוץ משפטי.</p>';

		$post_id = wp_insert_post(
			array(
				'post_type'     => 'post',
				'post_status'   => 'publish',
				'post_title'    => $item['title'],
				'post_content'  => $content,
				'post_category' => array( $cat_id ),
				'post_date'     => gmdate( 'Y-m-d H:i:s', time() - ( $offset * 2 * HOUR_IN_SECONDS ) ),
				'meta_input'    => array(
					'news_source_url'  => $item['source'],
					'news_source_name' => $item['outlet'],
				),
			)
		);

		if ( $post_id && ! is_wp_error( $post_id ) ) {
			$created++;
		}
	}

	update_option( 'justice_legal_news_seed_v1', wp_json_encode( array( 'at' => gmdate( 'c' ), 'created' => $created ) ), false );
}
add_action( 'init', 'justice_theme_seed_legal_news', 48 );

/**
 * Latest legal news for the homepage band.
 *
 * @param int $limit Items.
 * @return WP_Post[]
 */
function justice_theme_latest_legal_news( int $limit = 5 ): array {
	$query = new WP_Query(
		array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => max( 1, min( 8, $limit ) ),
			'category_name'  => 'legal-news',
			'no_found_rows'  => true,
		)
	);

	return $query->posts ?: array();
}

/**
 * NewsArticle JSON-LD on legal news posts.
 */
function justice_theme_legal_news_schema(): void {
	if ( ! is_singular( 'post' ) || ! has_category( 'legal-news' ) ) {
		return;
	}

	$post_id = get_the_ID();
	$source  = (string) get_post_meta( $post_id, 'news_source_url', true );

	$schema = array(
		'@context'      => 'https://schema.org',
		'@type'         => 'NewsArticle',
		'headline'      => wp_strip_all_tags( get_the_title() ),
		'datePublished' => get_the_date( DATE_W3C ),
		'dateModified'  => get_the_modified_date( DATE_W3C ),
		'inLanguage'    => 'he',
		'mainEntityOfPage' => esc_url_raw( get_permalink() ),
		'publisher'     => array(
			'@type' => 'Organization',
			'@id'   => esc_url_raw( home_url( '/#organization' ) ),
			'name'  => get_bloginfo( 'name' ),
		),
		'description'   => wp_strip_all_tags( get_the_excerpt() ),
	);

	if ( $source ) {
		$schema['citation'] = esc_url_raw( $source );
	}

	if ( function_exists( 'justice_theme_print_schema' ) ) {
		justice_theme_print_schema( $schema );
	}
}
add_action( 'wp_head', 'justice_theme_legal_news_schema', 23 );
