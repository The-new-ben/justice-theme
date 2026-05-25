<?php
/**
 * Article card.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_id     = get_the_ID();
$article_url = justice_theme_public_permalink( $post_id );
$extra_attributes = '';

if ( isset( $args['data_attrs'] ) && is_array( $args['data_attrs'] ) ) {
	foreach ( $args['data_attrs'] as $attr_name => $attr_value ) {
		$attr_name = (string) $attr_name;

		if ( ! preg_match( '/^data-[a-z0-9_-]+$/', $attr_name ) ) {
			continue;
		}

		$extra_attributes .= sprintf( ' %s="%s"', esc_attr( $attr_name ), esc_attr( (string) $attr_value ) );
	}
}
?>

<article <?php post_class( 'article-card premium-card' ); ?><?php echo $extra_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> style="display: flex; flex-direction: column;">
	<a class="article-card__media" href="<?php echo esc_url( $article_url ); ?>" aria-hidden="true" tabindex="-1" style="display: block; height: 180px; background: rgba(0,0,0,0.05); overflow: hidden;">
		<?php if ( has_post_thumbnail() ) : ?>
			<?php the_post_thumbnail( 'justice-card', array( 'loading' => 'lazy', 'style' => 'width: 100%; height: 100%; object-fit: cover;' ) ); ?>
		<?php else : ?>
			<?php
			$placeholder_terms   = get_the_terms( $post_id, 'practice-areas' );
			$placeholder_label   = ( ! empty( $placeholder_terms ) && ! is_wp_error( $placeholder_terms ) ) ? $placeholder_terms[0]->name : get_bloginfo( 'name' );
			$placeholder_initial = mb_substr( wp_strip_all_tags( (string) $placeholder_label ), 0, 1 );
			?>
			<div class="article-card__placeholder article-card__placeholder--legal">
				<span class="article-card__placeholder-mark"><?php echo esc_html( $placeholder_initial ); ?></span>
				<span class="article-card__placeholder-label"><?php echo esc_html( $placeholder_label ); ?></span>
				<span class="article-card__placeholder-line article-card__placeholder-line--wide"></span>
				<span class="article-card__placeholder-line"></span>
			</div>
		<?php endif; ?>
	</a>

	<div class="article-card__content" style="padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column;">
		<?php
		$terms = get_the_terms( $post_id, 'practice-areas' );

		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) :
			$term       = array_shift( $terms );
			$clean_name = str_replace(
				array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ', 'ותאונות' ),
				array( '', '', '', '' ),
				$term->name
			);
			?>
			<a class="article-card__term" href="<?php echo esc_url( justice_theme_public_term_link( $term ) ); ?>" style="display: inline-block; margin-bottom: 0.8rem; font-size: 0.8rem; background: rgba(82, 114, 178, 0.1); color: var(--color-accent); padding: 0.3rem 0.8rem; border-radius: 50px; font-weight: 700;">
				<?php echo esc_html( trim( $clean_name ) ); ?>
			</a>
		<?php endif; ?>

		<h3 class="article-card__title" style="margin: 0 0 0.8rem; font-size: 1.25rem; line-height: 1.4;">
			<a href="<?php echo esc_url( $article_url ); ?>" style="color: var(--color-primary-deep); text-decoration: none;">
				<?php the_title(); ?>
			</a>
		</h3>

		<div class="article-card__meta" style="margin-bottom: 1rem; font-size: 0.85rem; color: var(--color-muted); display: flex; gap: 1rem;">
			<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
				<?php echo esc_html( get_the_date() ); ?>
			</time>
			<span><?php echo esc_html( justice_theme_reading_time( $post_id ) ); ?></span>
		</div>

		<p class="article-card__excerpt" style="color: rgba(16, 24, 40, 0.7); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.5; flex-grow: 1;">
			<?php echo esc_html( justice_theme_excerpt( $post_id, 24 ) ); ?>
		</p>

		<a class="article-card__read-more" href="<?php echo esc_url( $article_url ); ?>" style="color: var(--color-primary); font-weight: 700; text-decoration: none; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem; margin-top: auto; display: block;">
			<?php esc_html_e( 'קראו מדריך', 'justice-theme' ); ?>
		</a>
	</div>
</article>
