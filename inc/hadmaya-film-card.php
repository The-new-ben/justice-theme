<?php
/**
 * Hadmaya film card: a quiet card after the article body that opens the one-minute film
 * on jus-tice.com (owner order 23.9.2026: the film on every page, placed after the body,
 * never inside the answer, key-facts, steps or note blocks).
 *
 * No iframe, no video element, no autoplay: one lazy image and two links, so article pages
 * keep their speed and their text stays first for readers and crawlers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'JUSTICE_THEME_FILM_PAGE' ) ) {
	define( 'JUSTICE_THEME_FILM_PAGE', 'https://jus-tice.com/he/how-it-works/' );
}
if ( ! defined( 'JUSTICE_THEME_FILM_POSTER' ) ) {
	define( 'JUSTICE_THEME_FILM_POSTER', 'https://jus-tice.com/media/hadmaya-film/hadmaya-film-poster.jpg' );
}

/**
 * CMS page rendered by one of the four controlled practice templates.
 * Resolve by the exact public path; a matching route alone is not a page.
 *
 * @return int
 */
function justice_theme_film_card_controlled_page_id() {
	if ( ! function_exists( 'justice_theme_practice_landing_request_path' ) || ! function_exists( 'get_page_by_path' ) ) {
		return 0;
	}
	$pages = array(
		'/family-law/'               => 'family-law',
		'/medical-malpractice-lawyer/' => 'medical-malpractice-lawyer',
		'/real-estate-lawyer-guide/'  => 'real-estate-lawyer-guide',
		'/inheritance-lawyer/'        => 'inheritance-lawyer',
	);
	$path = justice_theme_practice_landing_request_path();
	if ( ! isset( $pages[ $path ] ) ) {
		return 0;
	}
	$page = get_page_by_path( $pages[ $path ] );
	return $page instanceof WP_Post && 'page' === $page->post_type ? (int) $page->ID : 0;
}

/**
 * Whether this request is a reading page that should carry the card.
 *
 * @param int $post_id Current post.
 * @return bool
 */
function justice_theme_film_card_wanted( $post_id ) {
	if ( is_admin() || is_feed() || is_front_page() || (int) $post_id <= 0 ) {
		return false;
	}
	$controlled_id = justice_theme_film_card_controlled_page_id();
	if ( function_exists( 'justice_theme_practice_landing_request_path' )
		&& in_array( justice_theme_practice_landing_request_path(), array( '/family-law/', '/medical-malpractice-lawyer/', '/real-estate-lawyer-guide/', '/inheritance-lawyer/' ), true )
		&& ! $controlled_id ) {
		return false;
	}
	if ( $controlled_id ? (int) $post_id !== $controlled_id : ( ! is_main_query() || ! is_singular( array( 'post', 'page', 'articles' ) ) || (int) $post_id !== (int) get_queried_object_id() ) ) {
		return false;
	}
	if ( ! function_exists( 'justice_theme_new_look_active' ) || ! justice_theme_new_look_active() ) {
		return false;
	}
	// Shop and account screens are forms, not reading pages.
	if ( function_exists( 'is_cart' ) && ( is_cart() || is_checkout() || is_account_page() ) ) {
		return false;
	}
	return (bool) apply_filters( 'justice_theme_film_card_enabled', true, (int) $post_id );
}

/**
 * Card markup. Hebrew, plain words; the fictional-case note travels with the card.
 *
 * @return string
 */
function justice_theme_film_card_markup() {
	$page = esc_url( JUSTICE_THEME_FILM_PAGE );
	return '<aside class="jt-film-card" data-hadmaya-film aria-label="הסרט של הדמיה">'
		. '<a class="jt-film-card__media" href="' . $page . '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">'
		. '<img src="' . esc_url( JUSTICE_THEME_FILM_POSTER ) . '" alt="" width="1920" height="1080" loading="lazy" decoding="async">'
		. '<span class="jt-film-card__play"></span></a>'
		. '<div class="jt-film-card__text"><p class="jt-film-card__eyebrow">סרט של דקה</p>'
		. '<strong>כך נראה דיון, לפני הדיון האמיתי</strong>'
		. '<p>מספרים מה קרה, עומדים מול השופטת, ועורכת הדין מצטרפת מהטלפון. צולם במוצר החי, עם מקרה בדיוני.</p>'
		. '<a class="jt-film-card__link" href="' . $page . '" target="_blank" rel="noopener">לצפייה בסרט'
		. '<span class="screen-reader-text"> (נפתח בחלון חדש)</span></a></div>'
		. '</aside>';
}

/**
 * Append the card after the article body (after the simulation entry at priority 30).
 *
 * @param string $content Post content.
 * @return string
 */
function justice_theme_film_card( $content ) {
	// Controlled templates apply the_content outside the loop and append with their explicit page ID.
	if ( justice_theme_film_card_controlled_page_id() || false !== strpos( (string) $content, 'data-hadmaya-film' ) || ! justice_theme_film_card_wanted( (int) get_the_ID() ) ) {
		return $content;
	}
	return $content . justice_theme_film_card_markup();
}
add_filter( 'the_content', 'justice_theme_film_card', 40 );

add_action(
	'wp_enqueue_scripts',
	function () {
		if ( ! justice_theme_film_card_wanted( justice_theme_film_card_controlled_page_id() ?: (int) get_queried_object_id() ) ) {
			return;
		}
		wp_enqueue_style(
			'justice-film-card',
			JUSTICE_THEME_URI . '/assets/css/hadmaya-film-card.css',
			array( 'justice-new-look' ),
			(string) filemtime( JUSTICE_THEME_DIR . '/assets/css/hadmaya-film-card.css' )
		);
	},
	21
);
