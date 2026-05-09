<?php
/**
 * Template Name: Legal Pillar Page
 *
 * @package JusticeTheme
 */

get_header();

while ( have_posts() ) :
	the_post();

	$page_id     = get_the_ID();
	$keyword     = get_post_meta( $page_id, 'pillar_keyword', true ) ?: get_the_title();
	$cluster     = get_post_meta( $page_id, 'pillar_cluster', true );
	$summary     = get_post_meta( $page_id, 'pillar_summary', true ) ?: get_the_excerpt();
	$tool_url    = get_post_meta( $page_id, 'pillar_legaltech_url', true );
	$lawyer_area = get_post_meta( $page_id, 'pillar_lawyer_area', true );
	$topics_raw  = get_post_meta( $page_id, 'pillar_supporting_topics', true );
	$topics      = array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $topics_raw ) ) );

	$lawyers = null;
	if ( post_type_exists( 'justice_lawyer' ) ) {
		$lawyer_args = array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'publish',
			'posts_per_page' => 3,
			'orderby'        => 'meta_value_num',
			'meta_key'       => 'priority_score',
			'order'          => 'DESC',
		);

		if ( $lawyer_area && taxonomy_exists( 'practice-areas' ) ) {
			$lawyer_args['tax_query'] = array(
				array(
					'taxonomy' => 'practice-areas',
					'field'    => 'slug',
					'terms'    => $lawyer_area,
				),
			);
		}

		$lawyers = new WP_Query( $lawyer_args );
	}

	$articles = null;
	if ( post_type_exists( 'articles' ) ) {
		$article_args = array(
			'post_type'      => 'articles',
			'post_status'    => 'publish',
			'posts_per_page' => 6,
		);

		if ( $lawyer_area && taxonomy_exists( 'practice-areas' ) ) {
			$article_args['tax_query'] = array(
				array(
					'taxonomy' => 'practice-areas',
					'field'    => 'slug',
					'terms'    => $lawyer_area,
				),
			);
		}

		$articles = new WP_Query( $article_args );
	}
	?>

	<article <?php post_class( 'legal-pillar' ); ?>>
		<section class="legal-pillar-hero section">
			<div class="container legal-pillar-hero__grid">
				<div>
					<p class="section-header__eyebrow"><?php echo esc_html( $cluster ?: 'מדריך משפטי' ); ?></p>
					<h1><?php the_title(); ?></h1>
					<?php if ( $summary ) : ?>
						<p><?php echo esc_html( $summary ); ?></p>
					<?php endif; ?>
					<div class="legal-pillar-hero__actions">
						<a class="button button--gold" href="#lead-form"><?php esc_html_e( 'התאמה לעורך דין', 'justice-theme' ); ?></a>
						<?php if ( $tool_url ) : ?>
							<a class="button button--ghost" href="<?php echo esc_url( $tool_url ); ?>"><?php esc_html_e( 'כלי דיגיטלי מתאים', 'justice-theme' ); ?></a>
						<?php endif; ?>
					</div>
				</div>

				<aside class="legal-pillar-hero__panel" aria-label="<?php esc_attr_e( 'תקציר מסלול', 'justice-theme' ); ?>">
					<strong><?php echo esc_html( $keyword ); ?></strong>
					<ul>
						<li><?php esc_html_e( 'הסבר ברור לפני פנייה לעורך דין', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'קישור למדריכים תומכים', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'אפשרות להשארת פנייה מסודרת', 'justice-theme' ); ?></li>
					</ul>
				</aside>
			</div>
		</section>

		<section class="legal-pillar-body section">
			<div class="container legal-pillar-body__grid">
				<div class="legal-pillar-content entry-content">
					<?php the_content(); ?>

					<?php if ( ! empty( $topics ) ) : ?>
						<div class="legal-pillar-topic-box">
							<h2><?php esc_html_e( 'נושאים קשורים שכדאי להכיר', 'justice-theme' ); ?></h2>
							<div class="legal-pillar-topic-grid">
								<?php foreach ( $topics as $topic ) : ?>
									<?php
									$parts = array_map( 'trim', explode( '|', $topic ) );
									$label = $parts[0] ?? '';
									$url   = $parts[1] ?? '';
									?>
									<?php if ( $label ) : ?>
										<a href="<?php echo esc_url( $url ?: '#' ); ?>"><?php echo esc_html( $label ); ?></a>
									<?php endif; ?>
								<?php endforeach; ?>
							</div>
						</div>
					<?php endif; ?>
				</div>

				<aside class="legal-pillar-sidebar" id="lead-form">
					<h2><?php esc_html_e( 'צריכים הכוונה?', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'השאירו פרטים ונבנה תמונת מצב ראשונית כדי להתאים את הפנייה לעורך דין או למסלול דיגיטלי.', 'justice-theme' ); ?></p>
					<?php get_template_part( 'template-parts/forms/lead-form' ); ?>
				</aside>
			</div>
		</section>

		<?php if ( $lawyers && $lawyers->have_posts() ) : ?>
			<section class="legal-pillar-lawyers section">
				<div class="container">
					<div class="section-header section-header--split">
						<div>
							<p class="section-header__eyebrow"><?php esc_html_e( 'עורכי דין', 'justice-theme' ); ?></p>
							<h2><?php esc_html_e( 'פרופילים רלוונטיים', 'justice-theme' ); ?></h2>
						</div>
						<a class="button button--primary" href="<?php echo esc_url( add_query_arg( 'area', $lawyer_area, get_post_type_archive_link( 'justice_lawyer' ) ) ); ?>"><?php esc_html_e( 'כל עורכי הדין בתחום', 'justice-theme' ); ?></a>
					</div>
					<div class="lawyers-grid">
						<?php while ( $lawyers->have_posts() ) : $lawyers->the_post(); ?>
							<?php get_template_part( 'template-parts/cards/lawyer-card' ); ?>
						<?php endwhile; ?>
					</div>
				</div>
			</section>
			<?php wp_reset_postdata(); ?>
		<?php endif; ?>

		<?php if ( $articles && $articles->have_posts() ) : ?>
			<section class="legal-pillar-articles section">
				<div class="container">
					<div class="section-header">
						<p class="section-header__eyebrow"><?php esc_html_e( 'מדריכים קשורים', 'justice-theme' ); ?></p>
						<h2><?php esc_html_e( 'המשך קריאה', 'justice-theme' ); ?></h2>
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
	</article>

<?php
endwhile;

get_footer();
