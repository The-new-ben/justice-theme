<?php
/**
 * Practice areas, new look (v3): hairline grid with real guide counts and
 * sub-topics, ordered by demand. Same taxonomy source as the classic look.
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
		'number'     => 8,
		'parent'     => 0,
		'orderby'    => 'count',
		'order'      => 'DESC',
	)
);

if ( empty( $justice_area_terms ) || is_wp_error( $justice_area_terms ) ) {
	return;
}

$justice_directory = justice_theme_look3_directory_url();
?>

<section class="l3-section l3-areas" id="practice-areas">
	<div class="l3-section__inner">
		<div class="l3-section__head">
			<div>
				<span class="l3-kicker"><?php esc_html_e( 'עורכי דין לפי תחום עיסוק', 'justice-theme' ); ?></span>
				<h2 class="l3-h2"><?php esc_html_e( 'תחומי עיסוק פופולריים', 'justice-theme' ); ?></h2>
			</div>
			<a class="l3-more" href="<?php echo esc_url( $justice_directory ); ?>"><?php esc_html_e( 'כל תחומי העיסוק ←', 'justice-theme' ); ?></a>
		</div>
		<div class="l3-areas__grid">
			<?php foreach ( $justice_area_terms as $justice_area_term ) : ?>
				<?php $justice_subterms = justice_theme_look3_area_subterms( $justice_area_term ); ?>
				<a class="l3-area" href="<?php echo esc_url( get_term_link( $justice_area_term ) ); ?>">
					<strong class="l3-area__name"><?php echo esc_html( $justice_area_term->name ); ?></strong>
					<?php if ( '' !== $justice_subterms ) : ?>
						<span class="l3-area__subs"><?php echo esc_html( $justice_subterms ); ?></span>
					<?php endif; ?>
					<?php if ( (int) $justice_area_term->count > 0 ) : ?>
						<span class="l3-area__count l3-num">
							<?php
							printf(
								/* translators: %s: number of guides in this practice area. */
								esc_html__( '%s מדריכים', 'justice-theme' ),
								esc_html( number_format_i18n( (int) $justice_area_term->count ) )
							);
							?>
						</span>
					<?php endif; ?>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
