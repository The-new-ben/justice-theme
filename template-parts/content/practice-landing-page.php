<?php
/**
 * Practice landing page for English slug page routes.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$args   = wp_parse_args(
	$args ?? array(),
	array(
		'page_id' => get_the_ID(),
		'config'  => null,
	)
);
$page_id = (int) $args['page_id'];
$config  = is_array( $args['config'] ) ? $args['config'] : array();

if ( empty( $config ) ) {
	return;
}

$term_slug       = sanitize_title( $config['term_slug'] ?? '' );
$term            = $term_slug && taxonomy_exists( 'practice-areas' ) ? get_term_by( 'slug', $term_slug, 'practice-areas' ) : null;
$title           = $term instanceof WP_Term ? $term->name : ( $config['title'] ?? get_the_title( $page_id ) );
$keyword         = $config['keyword'] ?? $title;
$summary         = $term instanceof WP_Term && $term->description ? $term->description : ( $config['summary'] ?? '' );
$supporting      = is_array( $config['supporting'] ?? null ) ? $config['supporting'] : array();
$lawyer_archive  = get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' );
$lawyer_url      = $term_slug ? add_query_arg( 'area', $term_slug, $lawyer_archive ) : $lawyer_archive;
$featured_lawyer = null;

if ( ! empty( $config['featured_lawyer'] ) && function_exists( 'justice_theme_get_connected_lawyer_by_slug' ) ) {
	$featured_lawyer = justice_theme_get_connected_lawyer_by_slug( (string) $config['featured_lawyer'] );
}

$articles = null;
if ( post_type_exists( 'articles' ) ) {
	$article_args = array(
		'post_type'      => 'articles',
		'post_status'    => 'publish',
		'posts_per_page' => 6,
		'no_found_rows'  => true,
	);

	if ( $term_slug && taxonomy_exists( 'practice-areas' ) ) {
		$article_args['tax_query'] = array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'slug',
				'terms'    => $term_slug,
			),
		);
	}

	$articles = new WP_Query( $article_args );
}
?>

<article <?php post_class( 'practice-landing legal-pillar' ); ?>>
	<section class="legal-pillar-hero section">
		<div class="container legal-pillar-hero__grid">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></p>
				<h1><?php echo esc_html( $title ); ?></h1>
				<?php if ( $summary ) : ?>
					<p><?php echo esc_html( wp_strip_all_tags( $summary ) ); ?></p>
				<?php endif; ?>
				<div class="legal-pillar-hero__actions">
					<a class="button button--gold" href="#practice-lead-form"><?php esc_html_e( 'קבלת הכוונה ראשונית', 'justice-theme' ); ?></a>
					<a class="button button--ghost" href="<?php echo esc_url( $lawyer_url ); ?>"><?php esc_html_e( 'חיפוש עורכי דין בתחום', 'justice-theme' ); ?></a>
				</div>
			</div>

			<aside class="legal-pillar-hero__panel" aria-label="<?php esc_attr_e( 'מסלול מהיר', 'justice-theme' ); ?>">
				<strong><?php echo esc_html( $keyword ); ?></strong>
				<ul>
					<li><?php esc_html_e( 'להבין את הבעיה המשפטית ואת רמת הדחיפות.', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'לקרוא מדריכים קשורים בלי ליצור כפילות SEO.', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'להשאיר פנייה מסודרת לעיון מקצועי.', 'justice-theme' ); ?></li>
				</ul>
			</aside>
		</div>
	</section>

	<section class="practice-hub-intent section" aria-label="<?php esc_attr_e( 'הכוונה לפי צורך משפטי', 'justice-theme' ); ?>">
		<div class="container practice-hub-intent__grid">
			<article class="practice-hub-intent__card">
				<span><?php esc_html_e( 'המצב', 'justice-theme' ); ?></span>
				<h2><?php echo esc_html( sprintf( 'מה חשוב להבין בנושא %s?', $title ) ); ?></h2>
				<p><?php esc_html_e( 'השלב הראשון הוא להפריד בין מידע כללי לבין החלטה משפטית אישית. כאן מרוכזים המסלול, השאלות והקישורים שצריכים להוביל לפנייה נכונה יותר.', 'justice-theme' ); ?></p>
			</article>

			<article class="practice-hub-intent__card">
				<span><?php esc_html_e( 'הדחיפות', 'justice-theme' ); ?></span>
				<h2><?php esc_html_e( 'מתי לא להסתפק בקריאה?', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'כאשר יש מועד קרוב, מסמך לחתימה, הליך פתוח, ילדים, נכס, חקירה, פגיעה או סיכון כספי, כדאי לקבל בדיקה פרטנית ולא להישען רק על מדריך כללי.', 'justice-theme' ); ?></p>
			</article>

			<article class="practice-hub-intent__card">
				<span><?php esc_html_e( 'ההכנה', 'justice-theme' ); ?></span>
				<h2><?php esc_html_e( 'מה להכין לפני הפנייה?', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'רשימת אירועים, מסמכים, מועדים, פרטי הצדדים, עיר רלוונטית, רמת דחיפות ושאלות מרכזיות. ככל שהפנייה מסודרת יותר, קל יותר להבין מה הצעד הבא.', 'justice-theme' ); ?></p>
			</article>
		</div>
	</section>

	<section class="legal-pillar-body section">
		<div class="container legal-pillar-body__grid">
			<div class="legal-pillar-content entry-content">
				<?php if ( ! empty( $supporting ) ) : ?>
					<div class="legal-pillar-topic-box practice-landing__topics">
						<h2><?php esc_html_e( 'מדריכים קשורים לפי כוונת חיפוש', 'justice-theme' ); ?></h2>
						<div class="legal-pillar-topic-grid">
							<?php foreach ( $supporting as $item ) : ?>
								<?php if ( empty( $item['label'] ) ) : ?>
									<?php continue; ?>
								<?php endif; ?>
								<a href="<?php echo esc_url( home_url( $item['url'] ?? '#' ) ); ?>"><?php echo esc_html( $item['label'] ); ?></a>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endif; ?>

				<?php
				$page_content = trim( wp_strip_all_tags( get_post_field( 'post_content', $page_id ) ) );
				if ( $page_content ) :
					?>
					<div class="practice-landing__cms-content">
						<h2><?php esc_html_e( 'תוכן נוסף מהמערכת', 'justice-theme' ); ?></h2>
						<?php echo apply_filters( 'the_content', get_post_field( 'post_content', $page_id ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				<?php endif; ?>
			</div>

			<aside class="legal-pillar-sidebar" id="practice-lead-form">
				<h2><?php esc_html_e( 'צריכים הכוונה?', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'השאירו פרטים קצרים. המטרה היא להפוך שאלה כללית לפנייה מסודרת עם תחום, עיר ודחיפות.', 'justice-theme' ); ?></p>
				<?php get_template_part( 'template-parts/forms/lead-form' ); ?>
			</aside>
		</div>
	</section>

	<?php if ( $featured_lawyer instanceof WP_Post ) : ?>
		<section class="legal-pillar-lawyers section">
			<div class="container">
				<div class="section-header section-header--split">
					<div>
						<p class="section-header__eyebrow"><?php esc_html_e( 'פרופיל מקצועי מחובר', 'justice-theme' ); ?></p>
						<h2><?php esc_html_e( 'עורכת דין בתחום המשפחה', 'justice-theme' ); ?></h2>
					</div>
					<a class="button button--primary" href="<?php echo esc_url( get_permalink( $featured_lawyer ) ); ?>"><?php esc_html_e( 'כניסה למיני-סייט', 'justice-theme' ); ?></a>
				</div>
				<div class="lawyers-grid lawyers-grid--single">
					<?php
					$GLOBALS['post'] = $featured_lawyer; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
					setup_postdata( $featured_lawyer );
					get_template_part( 'template-parts/cards/lawyer-card' );
					wp_reset_postdata();
					?>
				</div>
			</div>
		</section>
	<?php endif; ?>

	<?php if ( $articles && $articles->have_posts() ) : ?>
		<section class="legal-pillar-articles section">
			<div class="container">
				<div class="section-header section-header--split">
					<div>
						<p class="section-header__eyebrow"><?php esc_html_e( 'מדריכים משפטיים', 'justice-theme' ); ?></p>
						<h2><?php esc_html_e( 'מאמרים מחוברים לתחום', 'justice-theme' ); ?></h2>
					</div>
					<a class="button button--ghost" href="<?php echo esc_url( get_post_type_archive_link( 'articles' ) ); ?>"><?php esc_html_e( 'כל המאמרים', 'justice-theme' ); ?></a>
				</div>
				<div class="article-grid">
					<?php while ( $articles->have_posts() ) : $articles->the_post(); ?>
						<?php get_template_part( 'template-parts/cards/article-card' ); ?>
					<?php endwhile; ?>
				</div>
			</div>
		</section>
		<?php wp_reset_postdata(); ?>
	<?php endif; ?>

	<section class="practice-hub-cta section">
		<div class="container practice-hub-cta__panel">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'שלב הבא', 'justice-theme' ); ?></p>
				<h2><?php esc_html_e( 'לא בטוחים מאיפה להתחיל?', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'אפשר להתחיל מקריאת מדריך, מחיפוש עורך דין לפי תחום או מהשארת פנייה קצרה שתעזור למיין את הנושא.', 'justice-theme' ); ?></p>
			</div>
			<div class="practice-hub-cta__actions">
				<a class="button button--gold" href="#practice-lead-form"><?php esc_html_e( 'השארת פנייה', 'justice-theme' ); ?></a>
				<a class="button button--ghost" href="<?php echo esc_url( $lawyer_url ); ?>"><?php esc_html_e( 'חיפוש עורכי דין', 'justice-theme' ); ?></a>
			</div>
		</div>
	</section>
</article>
