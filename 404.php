<?php
/**
 * 404 template.
 *
 * @package JusticeTheme
 */

get_header();
?>

<section class="error-404 section">
	<div class="container container--narrow error-404__panel">
		<h1><?php esc_html_e( 'העמוד לא נמצא', 'justice-theme' ); ?></h1>

		<p>
			<?php esc_html_e( 'העמוד שחיפשתם לא נמצא. אפשר לחפש במאגר המשפטי, לעבור למדריכי תחומי המשפט או לחזור לעמוד הבית.', 'justice-theme' ); ?>
		</p>

		<?php get_template_part( 'template-parts/forms/search-form-legal' ); ?>

		<a class="button button--gold error-404__home" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php esc_html_e( 'חזרה לעמוד הבית', 'justice-theme' ); ?>
		</a>
	</div>
</section>

<?php
get_footer();

