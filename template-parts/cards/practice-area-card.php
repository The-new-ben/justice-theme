<?php
/**
 * Practice area card — with unique icons per category.
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

$term_link = justice_theme_public_term_link( $term );

if ( '' === $term_link ) {
	return;
}

// Get unique icon for this practice area
$icon_svg = function_exists( 'justice_get_practice_area_icon' )
	? justice_get_practice_area_icon( $term->slug )
	: '';

// Clean up messy long category names for premium display
$clean_name = str_replace(
	array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ', 'ותאונות' ),
	array( '', '', '', '' ),
	$term->name
);
$clean_name = trim( $clean_name );

$count = absint( $term->count );
?>

<article class="practice-area-card premium-card" data-area="<?php echo esc_attr( $term->slug ); ?>">
	<a class="practice-area-card__link" href="<?php echo esc_url( $term_link ); ?>">
		<div class="practice-area-card__icon" aria-hidden="true">
			<?php if ( $icon_svg ) : ?>
				<?php echo $icon_svg; // phpcs:ignore -- Safe SVG from icon map ?>
			<?php else : ?>
				<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
			<?php endif; ?>
		</div>

		<h3 class="practice-area-card__title">
			<?php echo esc_html( $clean_name ); ?>
		</h3>

		<span class="practice-area-card__count">
			<?php
			if ( $count === 0 ) {
				esc_html_e( 'בקרוב', 'justice-theme' );
			} elseif ( $count === 1 ) {
				echo esc_html( '1 ' . __( 'מדריך', 'justice-theme' ) );
			} else {
				/* translators: %d: number of articles. */
				printf( esc_html__( '%d מדריכים', 'justice-theme' ), $count );
			}
			?>
		</span>
	</a>
</article>
