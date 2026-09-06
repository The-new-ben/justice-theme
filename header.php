<?php
/**
 * Header template.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?> dir="<?php echo esc_attr( is_rtl() ? 'rtl' : 'ltr' ); ?>">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#07152f">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#primary">
	<?php esc_html_e( 'דילוג לתוכן', 'justice-theme' ); ?>
</a>

<?php
if ( function_exists( 'justice_theme_new_look_active' ) && justice_theme_new_look_active() ) {
	get_template_part( 'template-parts/look3/site-header' );
} else {
	get_template_part( 'template-parts/layout/site-header' );
}
?>

<?php
if ( function_exists( 'justice_theme_breadcrumbs' ) ) {
	justice_theme_breadcrumbs();
}
?>

<main id="primary" class="site-main" tabindex="-1">

