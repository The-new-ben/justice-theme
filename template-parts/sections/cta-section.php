<?php
/**
 * CTA section — premium bottom call-to-action.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_phone = function_exists( 'justice_theme_option' )
	? justice_theme_option( 'justice_phone', '0525101555' )
	: '0525101555';
?>

<section class="cta-section section" id="cta-section">
	<div class="container">
		<div class="cta-section__inner">
			<span class="section-header__eyebrow" style="color: rgba(255,255,255,0.7);"><?php esc_html_e( 'מוכנים להתחיל?', 'justice-theme' ); ?></span>
			<h2 style="color: #fff; font-size: clamp(1.8rem, 4vw, 2.8rem); margin: 0.5rem 0 1rem;"><?php esc_html_e( 'מצאו את עורך הדין המתאים לכם עכשיו', 'justice-theme' ); ?></h2>
			<p style="color: rgba(255,255,255,0.8); font-size: 1.1rem; max-width: 600px; margin: 0 auto 2rem; line-height: 1.7;"><?php esc_html_e( 'חיפוש חינם לפי תחום ומיקום, ייעוץ ראשוני, ומדריכים מקצועיים שיעזרו לכם לקבל החלטה מושכלת.', 'justice-theme' ); ?></p>

			<div class="cta-section__actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
				<a class="button" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" style="background: var(--jt-accent-red); color: #fff; box-shadow: 0 6px 24px rgba(178,58,72,0.35);">
					<?php esc_html_e( 'חיפוש עורך דין', 'justice-theme' ); ?>
				</a>

				<?php if ( $justice_phone ) : ?>
					<a class="button" href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone ) ); ?>" style="background: rgba(255,255,255,0.15); color: #fff; border: 1.5px solid rgba(255,255,255,0.3);">
						📞 <?php echo esc_html( $justice_phone ); ?>
					</a>
				<?php endif; ?>

				<a class="button" href="#hero-search-form" style="background: transparent; color: rgba(255,255,255,0.8); border: 1.5px solid rgba(255,255,255,0.2);">
					<?php esc_html_e( 'חזרו לחיפוש ↑', 'justice-theme' ); ?>
				</a>
			</div>

			<p style="color: rgba(255,255,255,0.45); font-size: 0.82rem; margin-top: 2rem;">
				<?php esc_html_e( 'השימוש באתר הוא חינמי. המידע באתר אינו מהווה ייעוץ משפטי ואינו מחליף התייעצות עם עורך דין מוסמך.', 'justice-theme' ); ?>
			</p>
		</div>
	</div>
</section>
