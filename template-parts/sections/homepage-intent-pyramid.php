<?php
/**
 * Homepage money-intent pyramid.
 *
 * Connects broad homepage searches to high-value practice hubs, lawyer filters,
 * lead intake, and CMS articles using crawlable links.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$home_intent_article_query = static function ( string $slug, int $limit = 2 ): array {
	$post_types = array_values( array_filter( array( 'articles', 'post' ), 'post_type_exists' ) );

	if ( empty( $post_types ) ) {
		return array();
	}

	$tax_query = array( 'relation' => 'OR' );

	if ( taxonomy_exists( 'practice-areas' ) ) {
		$tax_query[] = array(
			'taxonomy' => 'practice-areas',
			'field'    => 'slug',
			'terms'    => $slug,
		);
	}

	if ( taxonomy_exists( 'category' ) ) {
		$tax_query[] = array(
			'taxonomy' => 'category',
			'field'    => 'slug',
			'terms'    => $slug,
		);
	}

	if ( count( $tax_query ) < 2 ) {
		return array();
	}

	return get_posts(
		array(
			'post_type'           => $post_types,
			'post_status'         => 'publish',
			'posts_per_page'      => $limit,
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
			'tax_query'           => $tax_query, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		)
	);
};

$home_intent_links = array(
	array(
		'title'       => __( 'עורך דין פלילי', 'justice-theme' ),
		'intent'      => __( 'חקירה, מעצר, כתב אישום, מחיקת רישום פלילי או עבירות רכוש וסמים.', 'justice-theme' ),
		'slug'        => 'criminal-law',
		'priority'    => __( 'דחוף', 'justice-theme' ),
		'guide_url'   => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/lawyers/?area=criminal-law' ),
		'lawyers_url' => home_url( '/lawyers/?area=criminal-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'מחיקת רישום פלילי', 'justice-theme' ), 'url' => '/criminal-record-deletion/' ),
			array( 'label' => __( 'עבירות סמים', 'justice-theme' ), 'url' => '/drug-crimes/' ),
			array( 'label' => __( 'גניבה מחנות', 'justice-theme' ), 'url' => '/shoplifting-defense/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין משפחה וגירושין', 'justice-theme' ),
		'intent'      => __( 'גירושין, משמורת ילדים, מזונות, חלוקת רכוש, צוואות והסכמי ממון.', 'justice-theme' ),
		'slug'        => 'family-law',
		'priority'    => __( 'גבוה', 'justice-theme' ),
		'guide_url'   => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
		'lawyers_url' => home_url( '/lawyers/?area=family-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'מחשבון מזונות ילדים', 'justice-theme' ), 'url' => '/child-support-calculator-2023/' ),
			array( 'label' => __( 'משמורת ילדים', 'justice-theme' ), 'url' => '/child-custody/' ),
			array( 'label' => __( 'גישור גירושין', 'justice-theme' ), 'url' => '/divorce-mediation/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין מקרקעין', 'justice-theme' ),
		'intent'      => __( 'קניית דירה, מכירת נכס, חוזה מכר, טאבו, ליקויי בנייה ומיסוי מקרקעין.', 'justice-theme' ),
		'slug'        => 'real-estate-law',
		'priority'    => __( 'כסף גדול', 'justice-theme' ),
		'guide_url'   => justice_theme_safe_public_link( '/real-estate-lawyer/', '/lawyers/?area=real-estate-law' ),
		'lawyers_url' => home_url( '/lawyers/?area=real-estate-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'חוזה מכר דירה', 'justice-theme' ), 'url' => '/real-estate-contract-review/' ),
			array( 'label' => __( 'ליקויי בנייה', 'justice-theme' ), 'url' => '/construction-defects/' ),
			array( 'label' => __( 'מס שבח ורכישה', 'justice-theme' ), 'url' => '/real-estate-tax/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין רשלנות רפואית', 'justice-theme' ),
		'intent'      => __( 'אבחון שגוי, ניתוח, לידה, טיפול רפואי או נזק רפואי שמצריך בדיקה מקצועית.', 'justice-theme' ),
		'slug'        => 'medical-malpractice-law',
		'priority'    => __( 'תביעה מורכבת', 'justice-theme' ),
		'guide_url'   => justice_theme_safe_public_link( '/medical-malpractice-lawyer/', '/lawyers/?area=medical-malpractice-law' ),
		'lawyers_url' => home_url( '/lawyers/?area=medical-malpractice-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'מהי רשלנות רפואית', 'justice-theme' ), 'url' => '/what-is-medical-malpractice-definition-examples/' ),
			array( 'label' => __( 'רשלנות בניתוח', 'justice-theme' ), 'url' => '/surgical-errors-medical-malpractice/' ),
			array( 'label' => __( 'פגיעות לידה', 'justice-theme' ), 'url' => '/birth-injury/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין דיני עבודה', 'justice-theme' ),
		'intent'      => __( 'פיטורים, שימוע, זכויות עובדים, חוזה עבודה, שעות נוספות ופנסיה.', 'justice-theme' ),
		'slug'        => 'labor-law',
		'priority'    => __( 'מתמשך', 'justice-theme' ),
		'guide_url'   => justice_theme_safe_public_link( '/employment-lawyer/', '/lawyers/?area=labor-law' ),
		'lawyers_url' => home_url( '/lawyers/?area=labor-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'זכויות עובדים', 'justice-theme' ), 'url' => '/employee-rights/' ),
			array( 'label' => __( 'פיטורים שלא כדין', 'justice-theme' ), 'url' => '/wrongful-termination/' ),
			array( 'label' => __( 'הסכם עבודה', 'justice-theme' ), 'url' => '/employment-agreement/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין נזיקין ותאונות', 'justice-theme' ),
		'intent'      => __( 'תאונת דרכים, תאונת עבודה, פציעה, ביטוח לאומי או תביעת פיצויים.', 'justice-theme' ),
		'slug'        => 'personal-injury-law',
		'priority'    => __( 'פיצוי', 'justice-theme' ),
		'guide_url'   => justice_theme_safe_public_link( '/personal-injury-lawyer/', '/lawyers/?area=personal-injury-law' ),
		'lawyers_url' => home_url( '/lawyers/?area=personal-injury-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'תאונת דרכים', 'justice-theme' ), 'url' => '/car-accident-lawyer/' ),
			array( 'label' => __( 'תאונת עבודה', 'justice-theme' ), 'url' => '/work-accident/' ),
			array( 'label' => __( 'ביטוח לאומי', 'justice-theme' ), 'url' => '/national-insurance/' ),
		),
	),
);
?>

<section class="homepage-intent-pyramid section" aria-labelledby="homepage-intent-pyramid-title">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'חיפוש משפטי לפי כוונה', 'justice-theme' ); ?></p>
				<h2 id="homepage-intent-pyramid-title"><?php esc_html_e( 'התחילו מהבעיה המשפטית, ואז עברו למדריך או לעורך דין', 'justice-theme' ); ?></h2>
				<p class="section-header__desc"><?php esc_html_e( 'העמוד הראשי מחבר בין מילות החיפוש הגדולות לבין מסלולי פעולה ברורים: מדריך מקצועי, פרופילים בתחום ופנייה מסודרת. כך גם משתמשים וגם Google מבינים מה העמודים החשובים באתר.', 'justice-theme' ); ?></p>
			</div>

			<a class="section-header__link button button--primary" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'חיפוש עורכי דין', 'justice-theme' ); ?></a>
		</div>

		<div class="homepage-intent-pyramid__grid">
			<?php foreach ( $home_intent_links as $intent ) : ?>
				<?php
				$related_posts  = $home_intent_article_query( $intent['slug'] );
				$related_count  = count( $related_posts );
				$directory_url  = $intent['lawyers_url'];
				$primary_url    = $intent['guide_url'];
				$fallback_links = $intent['fallbacks'];
				?>
				<article class="homepage-intent-card">
					<div class="homepage-intent-card__top">
						<span class="homepage-intent-card__priority"><?php echo esc_html( $intent['priority'] ); ?></span>
						<h3><a href="<?php echo esc_url( $primary_url ); ?>"><?php echo esc_html( $intent['title'] ); ?></a></h3>
					</div>

					<p class="homepage-intent-card__intent"><?php echo esc_html( $intent['intent'] ); ?></p>

					<div class="homepage-intent-card__actions">
						<a class="button button--gold" href="<?php echo esc_url( $primary_url ); ?>"><?php esc_html_e( 'קריאת מדריך', 'justice-theme' ); ?></a>
						<a class="button button--ghost" href="<?php echo esc_url( $directory_url ); ?>"><?php esc_html_e( 'פרופילים בתחום', 'justice-theme' ); ?></a>
					</div>

					<div class="homepage-intent-card__links" aria-label="<?php esc_attr_e( 'מדריכים קשורים', 'justice-theme' ); ?>">
						<strong><?php esc_html_e( 'מדריכים קשורים', 'justice-theme' ); ?></strong>
						<ul>
							<?php if ( $related_count > 0 ) : ?>
								<?php foreach ( $related_posts as $related_post ) : ?>
									<li><a href="<?php echo esc_url( justice_theme_public_permalink( (int) $related_post->ID ) ); ?>"><?php echo esc_html( get_the_title( $related_post ) ); ?></a></li>
								<?php endforeach; ?>
							<?php else : ?>
								<?php foreach ( $fallback_links as $fallback ) : ?>
									<li><a href="<?php echo esc_url( justice_theme_safe_public_link( $fallback['url'], $primary_url ) ); ?>"><?php echo esc_html( $fallback['label'] ); ?></a></li>
								<?php endforeach; ?>
							<?php endif; ?>
						</ul>
					</div>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="homepage-intent-pyramid__lawyer-path">
			<div>
				<p class="homepage-intent-pyramid__label"><?php esc_html_e( 'למשרדי עורכי דין', 'justice-theme' ); ?></p>
				<h3><?php esc_html_e( 'פרופיל, פניות ואזור אישי במקום אחד', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'עורך דין יכול להתחיל בהרשמה, לבחור מסלול חשיפה ולנהל פרטי פרופיל ופניות באזור האישי. הפעלה מלאה מתבצעת לאחר אישור הפרופיל והגדרת מסלול התשלום.', 'justice-theme' ); ?></p>
			</div>
			<div class="homepage-intent-pyramid__lawyer-actions">
				<a class="button button--primary" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'מסלולי עורכי דין', 'justice-theme' ); ?></a>
				<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'פתיחת פרופיל', 'justice-theme' ); ?></a>
				<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyer-dashboard/' ) ); ?>"><?php esc_html_e( 'כניסה לאזור אישי', 'justice-theme' ); ?></a>
			</div>
		</div>
	</div>
</section>
