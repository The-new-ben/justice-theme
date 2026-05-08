<?php
/**
 * Site footer partial.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_phone    = justice_theme_option( 'justice_phone', '03-6161535' );
$justice_email    = justice_theme_option( 'justice_email', 'info@jus-tice.co.il' );
$justice_whatsapp = justice_theme_option( 'justice_whatsapp', '0544705733' );
?>

<footer class="site-footer" role="contentinfo">
	<div class="container site-footer__grid">
		<section class="site-footer__section site-footer__about">
			<h2><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h2>
			<p>
				<?php esc_html_e( 'פורטל מידע משפטי שנבנה כדי לעזור להבין נושאים משפטיים וליצור קשר עם אנשי מקצוע מתאימים.', 'justice-theme' ); ?>
			</p>
		</section>

		<section class="site-footer__section">
			<h2><?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?></h2>
			<?php
			wp_nav_menu( array(
				'theme_location' => 'legal_areas',
				'container'      => false,
				'fallback_cb'    => false,
				'depth'          => 1,
			) );
			?>
		</section>

		<section class="site-footer__section">
			<h2><?php esc_html_e( 'מידע שימושי', 'justice-theme' ); ?></h2>
			<?php
			wp_nav_menu( array(
				'theme_location' => 'footer_trust',
				'container'      => false,
				'fallback_cb'    => false,
				'depth'          => 1,
			) );
			?>
		</section>

		<section class="site-footer__section">
			<h2><?php esc_html_e( 'צור קשר', 'justice-theme' ); ?></h2>
			<ul class="site-footer__contact">
				<?php if ( $justice_phone ) : ?>
					<li>
						<a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone ) ); ?>">
							<?php echo esc_html( $justice_phone ); ?>
						</a>
					</li>
				<?php endif; ?>
				<?php if ( $justice_email ) : ?>
					<li>
						<a href="<?php echo esc_url( 'mailto:' . $justice_email ); ?>">
							<?php echo esc_html( $justice_email ); ?>
						</a>
					</li>
				<?php endif; ?>
				<?php if ( $justice_whatsapp ) : ?>
					<li>
						<a href="<?php echo esc_url( 'https://wa.me/972' . ltrim( $justice_whatsapp, '0' ) ); ?>" target="_blank" rel="noopener">
							<?php esc_html_e( 'וואטסאפ', 'justice-theme' ); ?>
						</a>
					</li>
				<?php endif; ?>
			</ul>
		</section>
	</div>

	<div class="site-footer__bottom">
		<div class="container site-footer__bottom-inner">
			<p>
				&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?>
				<?php bloginfo( 'name' ); ?>.
				<?php esc_html_e( 'כל הזכויות שמורות.', 'justice-theme' ); ?>
			</p>

			<p class="site-footer__disclaimer">
				<?php esc_html_e( 'המידע המופיע באתר זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי.', 'justice-theme' ); ?>
			</p>
		</div>
	</div>
</footer>

