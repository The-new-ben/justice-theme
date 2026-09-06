<?php
/**
 * Footer template.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

</main>

<?php
if ( function_exists( 'justice_theme_new_look_active' ) && justice_theme_new_look_active() ) {
	get_template_part( 'template-parts/look3/site-footer' );
} else {
	get_template_part( 'template-parts/layout/site-footer' );
}
?>

<?php wp_footer(); ?>
</body>
</html>
