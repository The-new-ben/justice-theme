<?php
/**
 * Homepage hero, new look (v3): portal first.
 *
 * H1 in the language of the ranking portals, search by practice area and
 * city, real counters, the first-assessment link, and a situational picker
 * that routes to the live pillar of each head term.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_area_terms = get_terms(
	array(
		'taxonomy'   => 'practice-areas',
		'hide_empty' => true,
		'parent'     => 0,
		'orderby'    => 'count',
		'order'      => 'DESC',
	)
);

if ( empty( $justice_area_terms ) || is_wp_error( $justice_area_terms ) ) {
	$justice_area_terms = array();
}

$justice_hero_cities  = array( 'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'בני ברק', 'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'הרצליה', 'כפר סבא', 'מודיעין', 'נצרת', 'לוד', 'רמלה' );
$justice_guides_total = justice_theme_look3_guides_total();
$justice_areas_total  = count( $justice_area_terms );
$justice_situations   = justice_theme_look3_situations();
$justice_hero_simulation = justice_theme_look3_resolve( array( 'legal-simulation' ), 'https://jus-tice.com/' );
?>

<section class="l3-hero" id="hero">
	<div class="l3-hero__grid">
		<div class="l3-hero__copy">
			<span class="l3-kicker"><?php esc_html_e( 'Jus-Tice · פורטל המשפט הישראלי', 'justice-theme' ); ?></span>
			<h1 class="l3-hero__title"><?php esc_html_e( 'עורכי דין ומידע משפטי. מתחילים כאן.', 'justice-theme' ); ?></h1>
			<p class="l3-hero__lead"><?php esc_html_e( 'מדריכים משפטיים, הסכמים וטפסים להורדה, מחשבונים, וחיפוש עורך דין לפי תחום עיסוק ועיר. המידע באתר כללי ואינו ייעוץ משפטי.', 'justice-theme' ); ?></p>

			<?php if ( $justice_hero_simulation ) : ?>
				<a class="l3-hero-rehearsal" href="<?php echo esc_url( $justice_hero_simulation['url'] ); ?>">
					<img src="https://jus-tice.com/brand/hadmaya-cockpit-showcase-v1.webp" alt="מערכת הסימולציה: משתתפים, תמלול, עריכת המקרה והזמנה לדיון" width="1536" height="961" decoding="async">
					<span class="l3-hero-rehearsal__copy">
						<span class="l3-hero-rehearsal__brand" lang="en" dir="ltr">Hadmaya</span>
						<strong><?php esc_html_e( 'תרגול דיון או גישור', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'מתחילים בתיאור קצר. מתקנים פרטים תוך כדי.', 'justice-theme' ); ?></span>
						<span class="l3-hero-rehearsal__action"><?php esc_html_e( 'לסימולציה המשפטית', 'justice-theme' ); ?> <span aria-hidden="true">←</span></span>
					</span>
				</a>
			<?php endif; ?>

			<form class="l3-search" role="search" method="get" action="<?php echo esc_url( justice_theme_look3_directory_url() ); ?>" id="hero-search-form">
				<label class="screen-reader-text" for="hero-practice-area"><?php esc_html_e( 'תחום עיסוק', 'justice-theme' ); ?></label>
				<select id="hero-practice-area" name="area">
					<option value=""><?php esc_html_e( 'בחרו תחום עיסוק', 'justice-theme' ); ?></option>
					<?php foreach ( $justice_area_terms as $justice_area_term ) : ?>
						<option value="<?php echo esc_attr( $justice_area_term->slug ); ?>"><?php echo esc_html( $justice_area_term->name ); ?></option>
					<?php endforeach; ?>
				</select>
				<label class="screen-reader-text" for="hero-city"><?php esc_html_e( 'עיר', 'justice-theme' ); ?></label>
				<select id="hero-city" name="city">
					<option value=""><?php esc_html_e( 'בחרו עיר', 'justice-theme' ); ?></option>
					<?php foreach ( $justice_hero_cities as $justice_hero_city ) : ?>
						<option value="<?php echo esc_attr( $justice_hero_city ); ?>"><?php echo esc_html( $justice_hero_city ); ?></option>
					<?php endforeach; ?>
				</select>
				<button type="submit"><?php esc_html_e( 'חפשו עורך דין', 'justice-theme' ); ?></button>
			</form>

			<div class="l3-hero__proof">
				<?php if ( $justice_guides_total > 0 ) : ?>
					<span><strong class="l3-num"><?php echo esc_html( number_format_i18n( $justice_guides_total ) ); ?>+</strong> <?php esc_html_e( 'מדריכים משפטיים', 'justice-theme' ); ?></span>
				<?php endif; ?>
				<?php if ( $justice_areas_total > 0 ) : ?>
					<span><strong class="l3-num"><?php echo esc_html( number_format_i18n( $justice_areas_total ) ); ?></strong> <?php esc_html_e( 'תחומי עיסוק', 'justice-theme' ); ?></span>
				<?php endif; ?>
				<span><?php esc_html_e( 'ללא תשלום · ללא הרשמה', 'justice-theme' ); ?></span>
			</div>

			<a class="l3-hero__triage" id="ai-triage" href="<?php echo esc_url( justice_theme_look3_triage_url() ); ?>"><?php esc_html_e( 'לא בטוחים מאיפה להתחיל? מצאו את התחום המתאים ←', 'justice-theme' ); ?></a>
		</div>

		<?php if ( $justice_situations ) : ?>
			<aside class="l3-hero__aside" aria-label="<?php esc_attr_e( 'בחירה לפי מצב', 'justice-theme' ); ?>">
				<span class="l3-kicker"><?php esc_html_e( 'איפה נתקלתם בבעיה?', 'justice-theme' ); ?></span>
				<strong class="l3-hero__aside-title"><?php esc_html_e( 'כל מצב מתחיל בשאלה.', 'justice-theme' ); ?></strong>
				<div class="l3-situations">
					<?php foreach ( $justice_situations as $justice_situation ) : ?>
						<a class="l3-situation" href="<?php echo esc_url( $justice_situation['url'] ); ?>">
							<span><?php echo esc_html( $justice_situation['situation'] ); ?></span>
							<span class="l3-situation__label"><?php echo esc_html( $justice_situation['label'] ); ?></span>
						</a>
					<?php endforeach; ?>
				</div>
			</aside>
		<?php endif; ?>
	</div>
</section>