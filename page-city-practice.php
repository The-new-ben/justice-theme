<?php
/**
 * Template Name: City Practice Landing
 *
 * @package JusticeTheme
 */

get_header();

$city_slug     = sanitize_key( get_post_meta( get_the_ID(), 'city_slug', true ) );
$practice_slug = sanitize_key( get_post_meta( get_the_ID(), 'practice_slug', true ) );
$city_term     = $city_slug && taxonomy_exists( 'city' ) ? get_term_by( 'slug', $city_slug, 'city' ) : null;
$practice_term = $practice_slug && taxonomy_exists( 'practice-areas' ) ? get_term_by( 'slug', $practice_slug, 'practice-areas' ) : null;
$lawyers       = null;

if ( $city_slug && $practice_slug && post_type_exists( 'justice_lawyer' ) ) {
	$lawyers = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => 6,
		'tax_query'      => array(
			'relation' => 'AND',
			array(
				'taxonomy' => 'city',
				'field'    => 'slug',
				'terms'    => $city_slug,
			),
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'slug',
				'terms'    => $practice_slug,
			),
		),
	) );
}

$city_name     = $city_term && ! is_wp_error( $city_term ) ? $city_term->name : '';
$practice_name = $practice_term && ! is_wp_error( $practice_term ) ? $practice_term->name : '';
?>

<section class="city-practice-hero section">
	<div class="container city-practice-hero__grid">
		<div>
			<p class="section-header__eyebrow"><?php esc_html_e( 'מדריך לפי עיר ותחום', 'justice-theme' ); ?></p>
			<h1><?php echo esc_html( get_the_title() ); ?></h1>
			<p><?php echo esc_html( get_the_excerpt() ?: 'עמוד עיר ותחום נועד לחבר בין צורך משפטי, מיקום, עורכי דין רלוונטיים, מדריכים וכלי פנייה מסודרים.' ); ?></p>
		</div>
		<aside>
			<strong><?php esc_html_e( 'לא עמוד דלת דק', 'justice-theme' ); ?></strong>
			<p><?php esc_html_e( 'עמודים אלה נשארים בטיוטה עד שיש בהם תוכן ייחודי, עורכי דין רלוונטיים, שאלות נפוצות וקישורים פנימיים אמיתיים.', 'justice-theme' ); ?></p>
		</aside>
	</div>
</section>

<section class="city-practice-body section">
	<div class="container city-practice-body__grid">
		<main>
			<?php while ( have_posts() ) : the_post(); ?>
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
			<?php endwhile; ?>

			<h2><?php esc_html_e( 'עורכי דין רלוונטיים', 'justice-theme' ); ?></h2>
			<?php if ( $lawyers && $lawyers->have_posts() ) : ?>
				<div class="lawyers-grid">
					<?php while ( $lawyers->have_posts() ) : $lawyers->the_post(); ?>
						<?php get_template_part( 'template-parts/cards/lawyer-card' ); ?>
					<?php endwhile; wp_reset_postdata(); ?>
				</div>
			<?php else : ?>
				<p class="city-practice-body__empty"><?php esc_html_e( 'עדיין אין מספיק פרופילים מאושרים לעמוד הזה. העמוד צריך להישאר טיוטה עד שיש התאמה אמיתית.', 'justice-theme' ); ?></p>
			<?php endif; ?>
		</main>

		<aside>
			<h2><?php esc_html_e( 'סינון במדריך', 'justice-theme' ); ?></h2>
			<p><?php echo esc_html( trim( $practice_name . ' ' . $city_name ) ); ?></p>
			<a class="button button--gold" href="<?php echo esc_url( add_query_arg( array( 'area' => $practice_slug, 'city' => $city_slug ), get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' ) ) ); ?>"><?php esc_html_e( 'צפייה במדריך המסונן', 'justice-theme' ); ?></a>
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'שליחת פנייה', 'justice-theme' ); ?></a>
		</aside>
	</div>
</section>

<?php get_footer(); ?>
