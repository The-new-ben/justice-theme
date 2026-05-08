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

<?php
$justice_wa = justice_theme_option( 'justice_whatsapp', '0544705733' );
if ( $justice_wa ) :
?>
<a class="whatsapp-float" href="<?php echo esc_url( 'https://wa.me/972' . ltrim( $justice_wa, '0' ) ); ?>" target="_blank" rel="noopener" aria-label="<?php esc_attr_e( 'שלחו הודעה בוואטסאפ', 'justice-theme' ); ?>">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.546 4.093 1.504 5.818L0 24l6.335-1.452A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.907 0-3.722-.514-5.317-1.49l-.381-.226-3.96.908.984-3.813-.253-.4A9.783 9.783 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z"/></svg>
</a>
<?php endif; ?>

