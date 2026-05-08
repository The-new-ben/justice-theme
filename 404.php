<?php
/**
 * 404 template.
 *
 * @package JusticeTheme
 */

get_header();
?>

<section class="error-404 section">
	<div class="container container--narrow" style="text-align:center;">
		<h1><?php esc_html_e( 'העמוד לא נמצא', 'justice-theme' ); ?></h1>

		<p>
			<?php esc_html_e( 'The page you requested could not be found. You can search the legal library or browse by practice area.', 'justice-theme' ); ?>
		</p>

		<?php get_template_part( 'template-parts/forms/search-form-legal' ); ?>

		<a class="button button--gold" href="<?php echo esc_url( home_url( '/' ) ); ?>" style="margin-top:2rem;">
			<?php esc_html_e( 'חזרה לעמוד הבית', 'justice-theme' ); ?>
		</a>
	</div>
</section>

<?php
get_footer();

