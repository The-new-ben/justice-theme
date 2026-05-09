<?php
/**
 * Site header partial.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_phone = justice_theme_option( 'justice_phone', '03-6161535' );
?>

<header class="site-header" role="banner">
	<div class="site-header__top">
		<div class="container site-header__top-inner">
			<p class="site-header__trust">
				<?php esc_html_e( 'מידע משפטי, התאמת עורכי דין וייעוץ מעשי.', 'justice-theme' ); ?>
			</p>

			<nav class="site-header__secondary-nav" aria-label="<?php esc_attr_e( 'ניווט משני', 'justice-theme' ); ?>">
				<?php
				wp_nav_menu( array(
					'theme_location' => 'secondary',
					'container'      => false,
					'fallback_cb'    => false,
					'depth'          => 1,
				) );
				?>
			</nav>
		</div>
	</div>

	<div class="site-header__main">
		<div class="container site-header__main-inner">
			<div class="site-branding">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<a class="site-branding__link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/logo.png' ); ?>" alt="<?php bloginfo( 'name' ); ?> Logo" />
					</a>
				<?php endif; ?>
			</div>

			<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu">
				<span class="menu-toggle__icon" aria-hidden="true"></span>
				<span class="screen-reader-text"><?php esc_html_e( 'פתיחת תפריט ניווט', 'justice-theme' ); ?></span>
			</button>

			<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'ניווט ראשי', 'justice-theme' ); ?>">
				<?php
				wp_nav_menu( array(
					'theme_location' => 'primary',
					'menu_id'        => 'primary-menu',
					'container'      => false,
					'fallback_cb'    => 'justice_theme_fallback_menu',
				) );
				?>
			</nav>

			<?php if ( $justice_phone ) : ?>
				<a class="site-header__cta button button--gold" href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone ) ); ?>">
					<?php echo esc_html( $justice_phone ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
</header>
<?php

/**
 * Fallback menu when no menu is assigned.
 */
function justice_theme_fallback_menu() {
	?>
	<ul id="primary-menu" class="menu">
		<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'עמוד הבית', 'justice-theme' ); ?></a></li>
		<li><a href="<?php echo esc_url( get_post_type_archive_link( 'articles' ) ); ?>"><?php esc_html_e( 'מאמרים משפטיים', 'justice-theme' ); ?></a></li>
	</ul>
	<?php
}

