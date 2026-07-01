<?php
/**
 * Redesign hero - search-first, per Homepage.dc.html.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_hero_practices = array(
	'family-law'          => __( 'משפחה וגירושין', 'justice-theme' ),
	'criminal-law'        => __( 'משפט פלילי', 'justice-theme' ),
	'real-estate-law'     => __( 'מקרקעין ונדל"ן', 'justice-theme' ),
	'torts'               => __( 'נזיקין ותאונות', 'justice-theme' ),
	'medical-malpractice' => __( 'רשלנות רפואית', 'justice-theme' ),
	'labor-law'           => __( 'דיני עבודה', 'justice-theme' ),
	'inheritance-law'     => __( 'ירושה וצוואות', 'justice-theme' ),
	'traffic-law'         => __( 'דיני תעבורה', 'justice-theme' ),
	'tax-law'             => __( 'דיני מיסים', 'justice-theme' ),
	'debt-collection'     => __( 'חובות והוצאה לפועל', 'justice-theme' ),
);

$justice_hero_cities = array( 'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'בני ברק', 'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'הרצליה', 'כפר סבא', 'מודיעין', 'נצרת', 'לוד', 'רמלה' );

$justice_articles_counts = wp_count_posts( 'articles' );
$justice_guides_total    = isset( $justice_articles_counts->publish ) ? (int) $justice_articles_counts->publish : 0;
$justice_posts_counts    = wp_count_posts( 'post' );
$justice_guides_total   += isset( $justice_posts_counts->publish ) ? (int) $justice_posts_counts->publish : 0;

$justice_hero_whatsapp = function_exists( 'justice_theme_public_whatsapp_url' )
	? justice_theme_public_whatsapp_url( __( 'שלום, אני צריך/ה עזרה משפטית דרך Jus-Tice. הגעתי מדף הבית ואשמח לחזרה קצרה.', 'justice-theme' ) )
	: '';

$justice_triage_url = justice_theme_safe_public_link( '/legal-tools/ai-intake/', '/legal-tools/' );
?>

<section class="jt2-hero" id="hero">
	<div>
		<span class="jt2-hero__badge"><?php esc_html_e( 'מאגר מידע משפטי + התאמת עורכי דין · ללא תשלום', 'justice-theme' ); ?></span>
		<h1><?php esc_html_e( 'צריכים עזרה משפטית? התחילו ממה שקרה לכם עכשיו', 'justice-theme' ); ?></h1>
		<p class="jt2-hero__lead"><?php esc_html_e( 'מכתב מהביטוח הלאומי, זימון לחקירה, סכסוך משפחתי, תאונה, פיטורים או חוזה שלא ברור לכם יכולים להרגיש כמו רגע שצריך להחליט מהר. Jus-Tice עוזר לעצור רגע, להבין את הבעיה ולדעת מה הצעד הבא. המידע באתר כללי ואינו ייעוץ משפטי אישי או הבטחה לתוצאה.', 'justice-theme' ); ?></p>

		<form class="jt2-hero__search" role="search" method="get" action="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' ) ); ?>" id="hero-search-form">
			<div class="jt2-hero__search-row">
				<label class="screen-reader-text" for="hero-practice-area"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></label>
				<select id="hero-practice-area" name="area">
					<option value=""><?php esc_html_e( 'בחרו תחום משפטי', 'justice-theme' ); ?></option>
					<?php foreach ( $justice_hero_practices as $justice_area_slug => $justice_area_label ) : ?>
						<option value="<?php echo esc_attr( $justice_area_slug ); ?>"><?php echo esc_html( $justice_area_label ); ?></option>
					<?php endforeach; ?>
				</select>
				<label class="screen-reader-text" for="hero-city"><?php esc_html_e( 'עיר', 'justice-theme' ); ?></label>
				<select id="hero-city" name="city">
					<option value=""><?php esc_html_e( 'בחרו עיר', 'justice-theme' ); ?></option>
					<?php foreach ( $justice_hero_cities as $justice_hero_city ) : ?>
						<option value="<?php echo esc_attr( $justice_hero_city ); ?>"><?php echo esc_html( $justice_hero_city ); ?></option>
					<?php endforeach; ?>
				</select>
				<button type="submit"><?php esc_html_e( 'חיפוש', 'justice-theme' ); ?></button>
			</div>
		</form>

		<p class="jt2-hero__micro">
			<?php
			printf(
				/* translators: %s: published guide count. */
				esc_html__( 'ללא תשלום · ללא הרשמה · %s+ מדריכים מעודכנים', 'justice-theme' ),
				esc_html( number_format_i18n( $justice_guides_total ) )
			);
			?>
		</p>

		<a class="jt2-hero__triage" id="ai-triage" href="<?php echo esc_url( $justice_triage_url ); ?>"><?php esc_html_e( 'לא בטוחים באיזה תחום? אבחון משפטי חכם תוך 90 שניות ←', 'justice-theme' ); ?></a>

		<div class="jt2-hero__links">
			<?php if ( $justice_hero_whatsapp ) : ?>
				<a href="<?php echo esc_url( $justice_hero_whatsapp ); ?>" target="_blank" rel="noopener" data-whatsapp-surface="homepage_hero" data-lead-utm-source="homepage_hero" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help"><?php esc_html_e( 'וואטסאפ מיידי', 'justice-theme' ); ?></a>
			<?php endif; ?>
			<a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>"><?php esc_html_e( 'עיינו במדריכים', 'justice-theme' ); ?></a>
		</div>
	</div>

	<figure class="jt2-hero__figure">
		<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/homepage-legal-help-hero.jpg' ); ?>" width="1280" height="720" alt="<?php esc_attr_e( 'פגישת היכרות בין לקוחות לעורך דין', 'justice-theme' ); ?>" loading="eager" fetchpriority="high" decoding="async">
		<figcaption class="jt2-hero__caption">
			<span><?php esc_html_e( 'מסלול מסודר לפני פנייה', 'justice-theme' ); ?></span>
			<strong><?php esc_html_e( 'תארו מה קרה, בחרו תחום ועיר, והתקדמו רק כשברור מה הצעד הבא.', 'justice-theme' ); ?></strong>
		</figcaption>
	</figure>
</section>
