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

$term_link = justice_theme_public_term_link( $term );

if ( '' === $term_link ) {
	return;
}
?>

<article class="practice-area-card premium-card" style="padding: 1.5rem; text-align: center;">
	<a class="practice-area-card__link" href="<?php echo esc_url( $term_link ); ?>" style="text-decoration: none; color: inherit; display: block; height: 100%;">
		<div class="practice-area-card__icon" aria-hidden="true" style="width: 48px; height: 48px; margin: 0 auto 1rem; border-radius: 12px; background: rgba(82, 114, 178, 0.1); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
			<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
		</div>

		<?php
		// Clean up messy long category names for premium display
		$clean_name = str_replace(
			array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ', 'ותאונות' ),
			array( '', '', '', '' ),
			$term->name
		);
		$clean_name = trim( $clean_name );
		?>

		<h3 class="practice-area-card__title" style="margin: 0 0 0.5rem; font-size: 1.2rem; color: var(--color-primary-deep);">
			<?php echo esc_html( $clean_name ); ?>
		</h3>

		<span class="practice-area-card__count" style="font-size: 0.9rem; color: var(--color-muted); font-weight: 600;">
			<?php
			$count = absint( $term->count );
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
