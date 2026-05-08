<?php
/**
 * Article card.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_id = get_the_ID();
?>

<article <?php post_class( 'article-card' ); ?>>
	<a class="article-card__media" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
		<?php if ( has_post_thumbnail() ) : ?>
			<?php the_post_thumbnail( 'justice-card', array( 'loading' => 'lazy' ) ); ?>
		<?php else : ?>
			<div class="article-card__placeholder" aria-hidden="true">
				<span><?php esc_html_e( 'Legal guide', 'justice-theme' ); ?></span>
			</div>
		<?php endif; ?>
	</a>

	<div class="article-card__content">
		<?php
		$terms = get_the_terms( $post_id, 'practice-areas' );

		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) :
			$term = array_shift( $terms );
			?>
			<a class="article-card__term" href="<?php echo esc_url( get_term_link( $term ) ); ?>">
				<?php echo esc_html( $term->name ); ?>
			</a>
		<?php endif; ?>

		<h2 class="article-card__title">
			<a href="<?php the_permalink(); ?>">
				<?php the_title(); ?>
			</a>
		</h2>

		<div class="article-card__meta">
			<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
				<?php echo esc_html( get_the_date() ); ?>
			</time>
			<span><?php echo esc_html( justice_theme_reading_time( $post_id ) ); ?></span>
		</div>

		<p class="article-card__excerpt">
			<?php echo esc_html( justice_theme_excerpt( $post_id, 24 ) ); ?>
		</p>

		<a class="article-card__read-more" href="<?php the_permalink(); ?>">
			<?php esc_html_e( 'קראו מדריך', 'justice-theme' ); ?>
		</a>
	</div>
</article>

