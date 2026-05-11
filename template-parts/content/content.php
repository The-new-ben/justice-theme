<?php
/**
 * Generic content template part.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$content_url = justice_theme_public_permalink( get_the_ID() );
?>

<article <?php post_class( 'article-card' ); ?>>
	<div class="article-card__content">
		<h2 class="article-card__title">
			<a href="<?php echo esc_url( $content_url ); ?>"><?php the_title(); ?></a>
		</h2>
		<div class="article-card__meta">
			<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
		</div>
		<p class="article-card__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></p>
		<a class="article-card__read-more" href="<?php echo esc_url( $content_url ); ?>"><?php esc_html_e( 'קראו עוד', 'justice-theme' ); ?></a>
	</div>
</article>

