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

<footer class="site-footer" role="contentinfo" style="background: var(--jt-primary-deep); color: #fff; padding-top: 5rem; padding-bottom: 2rem; border-top: 4px solid var(--jt-accent);">
	<div class="container site-footer__grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 4rem; margin-bottom: 4rem;">
		
		<section class="site-footer__section site-footer__about" style="grid-column: span 2;">
			<div class="footer-logo" style="margin-bottom: 1.5rem;">
				<?php if ( has_custom_logo() ) : ?>
					<?php echo wp_get_attachment_image( get_theme_mod( 'custom_logo' ), 'full', false, array( 'style' => 'max-width: 180px; height: auto; filter: brightness(10);' ) ); ?>
				<?php else : ?>
					<a class="brand-lockup brand-lockup--image brand-lockup--footer" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Jus-Tice" style="color: #fff;">
						<img class="brand-lockup__logo" src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/logo.png' ); ?>" alt="<?php esc_attr_e( 'Jus-Tice Logo', 'justice-theme' ); ?>" loading="lazy">
						<span class="brand-lockup__text">
							<span class="brand-lockup__name" style="color: #fff;">Jus-Tice</span>
							<span class="brand-lockup__tagline" style="color: rgba(255,255,255,0.6);">פורטל משפטי חכם</span>
						</span>
					</a>
				<?php endif; ?>
			</div>
			<p style="color: rgba(255,255,255,0.65); line-height: 1.7; font-size: 1.05rem; max-width: 400px; margin-bottom: 2rem;">
				<?php esc_html_e( 'פורטל משפטי מתקדם המציע מידע מקצועי, פסקי דין, וחיבור ישיר לעורכי הדין המובילים בישראל, הכל בממשק אחד.', 'justice-theme' ); ?>
			</p>
			
			<div class="footer-contact" style="display: flex; gap: 1.5rem; font-weight: 600;">
				<?php if ( $justice_phone ) : ?>
					<a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $justice_phone ) ); ?>" style="display: flex; align-items: center; gap: 8px; color: #fff; background: rgba(255,255,255,0.05); padding: 0.6rem 1.2rem; border-radius: 50px; transition: all 0.3s ease;">
						<span style="color: var(--jt-accent); font-size: 1.2rem;">✆</span> <span style="direction: ltr;"><?php echo esc_html( $justice_phone ); ?></span>
					</a>
				<?php endif; ?>
				<?php if ( $justice_email ) : ?>
					<a href="mailto:<?php echo esc_attr( $justice_email ); ?>" style="display: flex; align-items: center; gap: 8px; color: #fff; background: rgba(255,255,255,0.05); padding: 0.6rem 1.2rem; border-radius: 50px; transition: all 0.3s ease;">
						<span style="color: var(--jt-accent); font-size: 1.2rem;">✉</span> <?php echo esc_html( $justice_email ); ?>
					</a>
				<?php endif; ?>
			</div>
		</section>

		<section class="site-footer__section">
			<h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 700; position: relative; padding-bottom: 0.8rem;">
				<?php esc_html_e( 'תחומי התמחות', 'justice-theme' ); ?>
				<span style="position: absolute; bottom: 0; right: 0; width: 40px; height: 3px; background: var(--jt-accent); border-radius: 2px;"></span>
			</h3>
			<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.8rem;">
				<li><a href="<?php echo esc_url( home_url( '/lawyers/?area=family-law' ) ); ?>" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s;">משפחה וגירושין</a></li>
				<li><a href="<?php echo esc_url( home_url( '/lawyers/?area=criminal-law' ) ); ?>" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s;">משפט פלילי</a></li>
				<li><a href="<?php echo esc_url( home_url( '/lawyers/?area=real-estate' ) ); ?>" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s;">מקרקעין ונדל"ן</a></li>
				<li><a href="<?php echo esc_url( home_url( '/lawyers/?area=torts' ) ); ?>" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s;">נזיקין ותאונות</a></li>
			</ul>
		</section>

		<section class="site-footer__section">
			<h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 700; position: relative; padding-bottom: 0.8rem;">
				<?php esc_html_e( 'ניווט מהיר', 'justice-theme' ); ?>
				<span style="position: absolute; bottom: 0; right: 0; width: 40px; height: 3px; background: var(--jt-accent); border-radius: 2px;"></span>
			</h3>
			<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.8rem;">
				<li><a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s;">מאגר מאמרים</a></li>
				<li><a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s;">אינדקס עורכי דין</a></li>
				<li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s;">התייעצות משפטית</a></li>
				<li><a href="<?php echo esc_url( home_url( '/join/' ) ); ?>" style="color: var(--jt-accent); font-weight: 700; text-decoration: none;">הצטרפות עורכי דין &larr;</a></li>
			</ul>
		</section>
	</div>

	<div class="container" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
		<div style="display: flex; gap: 1.5rem; margin-bottom: 1rem;">
			<a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>" style="color: rgba(255,255,255,0.5); font-size: 0.9rem; text-decoration: none;">תנאי שימוש</a>
			<a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>" style="color: rgba(255,255,255,0.5); font-size: 0.9rem; text-decoration: none;">מדיניות פרטיות</a>
			<a href="<?php echo esc_url( home_url( '/accessibility/' ) ); ?>" style="color: rgba(255,255,255,0.5); font-size: 0.9rem; text-decoration: none;">הצהרת נגישות</a>
		</div>
		<p style="color: rgba(255,255,255,0.4); font-size: 0.85rem; max-width: 800px; line-height: 1.6; margin: 0;">
			<?php esc_html_e( 'המידע המופיע באתר Jus-Tice הינו מידע כללי בלבד ואינו מהווה ייעוץ משפטי מכל סוג שהוא. קבלת החלטות על סמך המידע באתר היא באחריות המשתמש בלבד. בכל מקרה של סוגיה משפטית, יש להתייעץ עם עורך דין מוסמך.', 'justice-theme' ); ?>
		</p>
		<p style="color: rgba(255,255,255,0.3); font-size: 0.85rem; margin-top: 1rem;">
			&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'כל הזכויות שמורות.', 'justice-theme' ); ?>
		</p>
	</div>
</footer>

<?php
$justice_wa = justice_theme_option( 'justice_whatsapp', '0544705733' );
if ( $justice_wa ) :
?>
<a class="whatsapp-float" href="<?php echo esc_url( 'https://wa.me/972' . ltrim( $justice_wa, '0' ) ); ?>" target="_blank" rel="noopener" aria-label="<?php esc_attr_e( 'שלחו הודעה בוואטסאפ', 'justice-theme' ); ?>" style="position: fixed; bottom: 20px; left: 20px; background: #25D366; color: white; border-radius: 50px; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.15); z-index: 1000;">
	<svg width="35" height="35" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.546 4.093 1.504 5.818L0 24l6.335-1.452A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.907 0-3.722-.514-5.317-1.49l-.381-.226-3.96.908.984-3.813-.253-.4A9.783 9.783 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z"/></svg>
</a>
<?php endif; ?>

