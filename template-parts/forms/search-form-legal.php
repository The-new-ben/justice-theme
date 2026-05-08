<?php
/**
 * Legal search form.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<form class="legal-search-form" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="legal-search-field">
		<?php esc_html_e( 'חיפוש מאמרים משפטיים', 'justice-theme' ); ?>
	</label>

	<input
		id="legal-search-field"
		type="search"
		name="s"
		value="<?php echo esc_attr( get_search_query() ); ?>"
		placeholder="<?php echo esc_attr__( 'חיפוש נושא משפטי...', 'justice-theme' ); ?>"
	>

	<button type="submit">
		<?php esc_html_e( 'חיפוש', 'justice-theme' ); ?>
	</button>
</form>

