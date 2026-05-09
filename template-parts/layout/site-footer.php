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

<footer class="site-footer" role="contentinfo" style="background: var(--color-primary); color: #fff; padding-block: 4rem 2rem;">
	<div class="container site-footer__grid" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem;">
		
		<section class="site-footer__section site-footer__about">
			<div class="footer-logo" style="margin-bottom: 1.5rem;">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<div style="font-size: 2rem; font-weight: 900; color: #fff; line-height: 1.1;">Jus-Tice</div>
					<div style="font-size: 1rem; color: var(--color-accent); font-weight: 700;">פורטל משפטי חכם</div>
				<?php endif; ?>
			</div>
			<p style="color: rgba(255,255,255,0.7); line-height: 1.6;">
				<?php esc_html_e( 'פורטל מידע משפטי מתקדם שנבנה כדי לעזור לכם להבין נושאים משפטיים, לקרוא פסקי דין, וליצור קשר עם עורכי הדין המובילים בישראל.', 'justice-theme' ); ?>
			</p>
			
			<div class="footer-contact" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; font-weight: 600;">
				<?php if ( $justice_phone ) : ?>
					<a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $justice_phone ) ); ?>" style="color: #fff;"><span style="color: var(--color-accent); margin-inline-end: 8px;">☎</span><?php echo esc_html( $justice_phone ); ?></a>
				<?php endif; ?>
				<?php if ( $justice_email ) : ?>
					<a href="mailto:<?php echo esc_attr( $justice_email ); ?>" style="color: #fff;"><span style="color: var(--color-accent); margin-inline-end: 8px;">✉</span><?php echo esc_html( $justice_email ); ?></a>
				<?php endif; ?>
			</div>
		</section>

		<section class="site-footer__section">
			<h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 1.2rem; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;"><?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?></h2>
			<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.6rem;">
				<li><a href="<?php echo esc_url( home_url( '/lawyers/?area=family-law' ) ); ?>" style="color: rgba(255,255,255,0.7);">משפחה וגירושין</a></li>
				<li><a href="<?php echo esc_url( home_url( '/lawyers/?area=criminal-law' ) ); ?>" style="color: rgba(255,255,255,0.7);">פלילי</a></li>
				<li><a href="<?php echo esc_url( home_url( '/lawyers/?area=real-estate' ) ); ?>" style="color: rgba(255,255,255,0.7);">מקרקעין</a></li>
				<li><a href="<?php echo esc_url( home_url( '/lawyers/?area=torts' ) ); ?>" style="color: rgba(255,255,255,0.7);">נזיקין</a></li>
			</ul>
		</section>

		<section class="site-footer__section">
			<h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 1.2rem; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;"><?php esc_html_e( 'מידע שימושי', 'justice-theme' ); ?></h2>
			<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.6rem;">
				<li><a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>" style="color: rgba(255,255,255,0.7);">מאמרים ומדריכים</a></li>
				<li><a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" style="color: rgba(255,255,255,0.7);">חיפוש עורכי דין</a></li>
				<li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" style="color: rgba(255,255,255,0.7);">יצירת קשר</a></li>
				<li><a href="<?php echo esc_url( home_url( '/join/' ) ); ?>" style="color: var(--color-accent); font-weight: 700;">הצטרפות עורכי דין</a></li>
			</ul>
		</section>

		<section class="site-footer__section">
			<h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 1.2rem; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;"><?php esc_html_e( 'תנאים ופרטיות', 'justice-theme' ); ?></h2>
			<ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.6rem;">
				<li><a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>" style="color: rgba(255,255,255,0.7);">תנאי שימוש</a></li>
				<li><a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>" style="color: rgba(255,255,255,0.7);">מדיניות פרטיות</a></li>
				<li><a href="<?php echo esc_url( home_url( '/accessibility/' ) ); ?>" style="color: rgba(255,255,255,0.7);">הצהרת נגישות</a></li>
			</ul>
		</section>
	</div>

	<div class="container" style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 3rem; padding-top: 1.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
		<p style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0;">
			&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'כל הזכויות שמורות.', 'justice-theme' ); ?>
		</p>
		<p style="color: rgba(255,255,255,0.3); font-size: 0.8rem; margin: 0; max-width: 600px; text-align: left;">
			<?php esc_html_e( 'המידע המופיע באתר זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי. בחירת עורך דין והסתמכות על המידע באחריות המשתמש בלבד.', 'justice-theme' ); ?>
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

