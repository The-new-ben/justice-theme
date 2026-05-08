<?php
/**
 * Practice area card.
 *
 * Expected: $args['term'] — WP_Term object.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$term = isset( $args['term'] ) ? $args['term'] : null;

if ( ! $term || is_wp_error( $term ) ) {
	return;
}

$term_link = get_term_link( $term );

if ( is_wp_error( $term_link ) ) {
	return;
}
?>

<article class="practice-area-card">
	<a class="practice-area-card__link" href="<?php echo esc_url( $term_link ); ?>">
		<span class="practice-area-card__icon" aria-hidden="true">§</span>

		<h3 class="practice-area-card__title">
			<?php echo esc_html( $term->name ); ?>
		</h3>

		<?php if ( ! empty( $term->description ) ) : ?>
			<p class="practice-area-card__description">
				<?php echo esc_html( wp_trim_words( $term->description, 22 ) ); ?>
			</p>
		<?php endif; ?>

		<span class="practice-area-card__count">
			<?php
			printf(
				/* translators: %d: number of articles. */
				esc_html( _n( '%d guide', '%d guides', absint( $term->count ), 'justice-theme' ) ),
				absint( $term->count )
			);
			?>
		</span>
	</a>
</article>
