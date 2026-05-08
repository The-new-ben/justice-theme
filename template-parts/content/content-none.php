<?php
/**
 * No content found.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="content-none">
	<h2><?php esc_html_e( 'Nothing found', 'justice-theme' ); ?></h2>
	<p><?php esc_html_e( 'No results matched your query. Try a different search or browse by practice area.', 'justice-theme' ); ?></p>

	<?php get_template_part( 'template-parts/forms/search-form-legal' ); ?>
</div>
