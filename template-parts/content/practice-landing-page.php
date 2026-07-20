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
$title           = ! empty( $config['display_title'] )
	? (string) $config['display_title']
	: ( $term instanceof WP_Term ? $term->name : ( $config['title'] ?? get_the_title( $page_id ) ) );
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
					<li><?php esc_html_e( 'לקרוא מדריכים ממוקדים למצב שלכם, צעד אחר צעד.', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'להשאיר פנייה מסודרת לעיון מקצועי.', 'justice-theme' ); ?></li>
				</ul>
			</aside>
		</div>
	</section>

	<?php
	// Keyword-specific context strip — signals topical relevance to Googlebot.
	// Each practice area has its own signals; generic text is removed.
	$practice_signals = array(
		'family-law'          => array(
			array( 'icon' => '&#9878;', 'label' => 'גירושין', 'text' => 'הסכם גירושין, גט, חלוקת רכוש ופנסיה' ),
			array( 'icon' => '&#9829;', 'label' => 'ילדים', 'text' => 'מזונות 919/15, משמורת, זמני שהות' ),
			array( 'icon' => '&#9993;', 'label' => 'ייצוג', 'text' => 'בית דין רבני, בית משפט משפחה, גישור' ),
		),
		'criminal-law'        => array(
			array( 'icon' => '&#9878;', 'label' => 'חקירה', 'text' => 'זכויות נחקר, שתיקה, עיכוב הליכים' ),
			array( 'icon' => '&#9877;', 'label' => 'הגנה', 'text' => 'כתב אישום, שימוע, עסקת טיעון' ),
			array( 'icon' => '&#9993;', 'label' => 'ייצוג', 'text' => 'מעצר, דיון, ערעור, מחיקת רישום פלילי' ),
		),
		'medical-malpractice' => array(
			array( 'icon' => '&#9877;', 'label' => 'רשלנות', 'text' => 'אבחון שגוי, ניתוח, לידה, הרדמה' ),
			array( 'icon' => '&#9878;', 'label' => 'הוכחה', 'text' => 'חוות דעת מומחה, תיק רפואי, קשר סיבתי' ),
			array( 'icon' => '&#9993;', 'label' => 'פיצויים', 'text' => 'כאב וסבל, אובדן כושר, הוצאות עתידיות' ),
		),
		'real-estate-law'     => array(
			array( 'icon' => '&#9878;', 'label' => 'עסקה', 'text' => 'חוזה מכר, בדיקת טאבו, נסח רישום' ),
			array( 'icon' => '&#9877;', 'label' => 'מיסוי', 'text' => 'מס רכישה, מס שבח, פטורים' ),
			array( 'icon' => '&#9993;', 'label' => 'ליווי', 'text' => 'מו"מ, חתימה, רישום זכויות בטאבו' ),
		),
		'inheritance'         => array(
			array( 'icon' => '&#9878;', 'label' => 'ירושה', 'text' => 'צו ירושה, חלוקת עיזבון, יורשים' ),
			array( 'icon' => '&#9877;', 'label' => 'צוואה', 'text' => 'כתיבת צוואה, קיום צוואה, התנגדות' ),
			array( 'icon' => '&#9993;', 'label' => 'ניהול', 'text' => 'מנהל עיזבון, חלוקת נכסים, מסים' ),
		),
	);
	$signals = $practice_signals[ $term_slug ] ?? $practice_signals[ 'family-law' ];
	?>
	<section class="practice-signals section" aria-label="<?php echo esc_attr( sprintf( '%s — תחומי עיסוק', $title ) ); ?>">
		<div class="container practice-signals__grid">
			<?php foreach ( $signals as $signal ) : ?>
			<div class="practice-signals__item">
				<span class="practice-signals__icon" aria-hidden="true"><?php echo $signal['icon']; // phpcs:ignore ?></span>
				<strong class="practice-signals__label"><?php echo esc_html( $signal['label'] ); ?></strong>
				<p class="practice-signals__text"><?php echo esc_html( $signal['text'] ); ?></p>
			</div>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="legal-pillar-body section">
		<div class="container legal-pillar-body__grid">
			<div class="legal-pillar-content entry-content">
				<?php
				// Render full Gutenberg pillar content as the primary body,
				// FIRST inside the content column: the user and Googlebot must
				// land on the article's answer, not on link chrome. The
				// supporting-guides box moved below the article (2026-07-14,
				// google-god-mode audit: first relevant paragraph sat three
				// viewports down).
				$page_raw_content = $page_id > 0 ? get_post_field( 'post_content', $page_id ) : '';
				if ( trim( wp_strip_all_tags( $page_raw_content ) ) ) :
					?>
					<div class="practice-landing__pillar-content">
						<?php echo apply_filters( 'the_content', $page_raw_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				<?php endif; ?>

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
			</div>

			<aside class="legal-pillar-sidebar" id="practice-lead-form">
				<h2><?php esc_html_e( 'צריכים הכוונה?', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'השאירו פרטים קצרים. המטרה היא להפוך שאלה כללית לפנייה מסודרת עם תחום, עיר ודחיפות.', 'justice-theme' ); ?></p>
				<?php get_template_part( 'template-parts/forms/lead-form' ); ?>
			</aside>
		</div>
	</section>

	<?php
	// Area-scoped firms band: the indexed lawyers ARE the product — the
	// pillar must surface them (owner law 2026-07-20). Falls back to the
	// single featured profile only when no area match exists.
	$area_lawyers = null;
	if ( $term_slug && post_type_exists( 'justice_lawyer' ) && taxonomy_exists( 'practice-areas' ) ) {
		$area_lawyers = new WP_Query(
			array(
				'post_type'      => 'justice_lawyer',
				'post_status'    => 'publish',
				'posts_per_page' => 6,
				'no_found_rows'  => true,
				'meta_key'       => 'priority_score',
				'orderby'        => array( 'meta_value_num' => 'DESC', 'title' => 'ASC' ),
				'tax_query'      => array(
					array(
						'taxonomy' => 'practice-areas',
						'field'    => 'slug',
						'terms'    => $term_slug,
					),
				),
			)
		);
	}
	?>

	<?php if ( $area_lawyers instanceof WP_Query && $area_lawyers->have_posts() ) : ?>
		<section class="legal-pillar-lawyers section">
			<div class="container">
				<div class="section-header section-header--split">
					<div>
						<p class="section-header__eyebrow"><?php esc_html_e( 'נבדקו ונמצאו מובילים', 'justice-theme' ); ?></p>
						<h2><?php echo esc_html( sprintf( 'משרדי עורכי דין מובילים ב%s', $term instanceof WP_Term ? $term->name : $title ) ); ?></h2>
					</div>
					<a class="button button--primary" href="<?php echo esc_url( $lawyer_url ); ?>"><?php esc_html_e( 'לכל המשרדים במפה', 'justice-theme' ); ?></a>
				</div>
				<div class="lawyers-grid">
					<?php
					while ( $area_lawyers->have_posts() ) :
						$area_lawyers->the_post();
						get_template_part( 'template-parts/cards/lawyer-card' );
					endwhile;
					wp_reset_postdata();
					?>
				</div>
			</div>
		</section>
	<?php elseif ( $featured_lawyer instanceof WP_Post ) : ?>
		<section class="legal-pillar-lawyers section">
			<div class="container">
				<div class="section-header section-header--split">
					<div>
						<p class="section-header__eyebrow"><?php esc_html_e( 'פרופיל מקצועי מחובר', 'justice-theme' ); ?></p>
						<h2><?php echo esc_html( sprintf( 'פרופיל מקצועי בתחום %s', $title ) ); ?></h2>
					</div>
					<a class="button button--primary" href="<?php echo esc_url( justice_theme_public_permalink( $featured_lawyer->ID ) ); ?>"><?php esc_html_e( 'כניסה לפרופיל', 'justice-theme' ); ?></a>
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
	<?php else : ?>
		<!-- justice-monitor: pillar-lawyers-band EMPTY for term '<?php echo esc_html( $term_slug ); ?>' — loud-failure marker, journey-monitor asserts this never ships silently -->
	<?php endif; ?>

	<?php if ( $articles && $articles->have_posts() ) : ?>
		<section class="legal-pillar-articles section">
			<div class="container">
				<div class="section-header section-header--split">
					<div>
						<p class="section-header__eyebrow"><?php esc_html_e( 'מדריכים משפטיים', 'justice-theme' ); ?></p>
						<h2><?php esc_html_e( 'מאמרים מחוברים לתחום', 'justice-theme' ); ?></h2>
					</div>
					<a class="button button--ghost" href="<?php echo esc_url( justice_theme_public_url( (string) get_post_type_archive_link( 'articles' ) ) ); ?>"><?php esc_html_e( 'כל המאמרים', 'justice-theme' ); ?></a>
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
