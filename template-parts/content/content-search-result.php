<?php
/**
 * Search result card.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_type_obj = get_post_type_object( get_post_type() );
$type_label    = $post_type_obj ? $post_type_obj->labels->singular_name : '';
?>

<article <?php post_class( 'article-card' ); ?>>
	<div class="article-card__content">
		<div class="article-card__meta">
			<?php if ( $type_label ) : ?>
				<span class="article-card__term"><?php echo esc_html( $type_label ); ?></span>
			<?php endif; ?>
			<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
				<?php echo esc_html( get_the_date() ); ?>
			</time>
		</div>

		<h2 class="article-card__title">
			<a href="<?php the_permalink(); ?>">
				<?php the_title(); ?>
			</a>
		</h2>

		<p class="article-card__excerpt">
			<?php echo esc_html( justice_theme_excerpt( get_the_ID(), 28 ) ); ?>
		</p>

		<a class="article-card__read-more" href="<?php the_permalink(); ?>">
			<?php esc_html_e( 'קראו עוד', 'justice-theme' ); ?>
		</a>
	</div>
</article>

