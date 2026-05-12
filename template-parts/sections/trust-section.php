<?php
/**
 * Trust / authority section — social proof + verification signals.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$article_count = wp_count_posts( 'articles' );
$total         = isset( $article_count->publish ) ? (int) $article_count->publish : 0;
$total        += (int) wp_count_posts( 'post' )->publish;

$term_count = wp_count_terms( array( 'taxonomy' => 'practice-areas' ) );
$areas      = is_wp_error( $term_count ) ? 0 : (int) $term_count;

$lawyer_count = wp_count_posts( 'justice_lawyer' );
$lawyers      = isset( $lawyer_count->publish ) ? (int) $lawyer_count->publish : 0;

$years  = function_exists( 'justice_theme_mod' ) ? (int) justice_theme_mod( 'justice_years_active', 10 ) : 10;
$cities = function_exists( 'justice_theme_mod' ) ? (int) justice_theme_mod( 'justice_cities_count', 20 ) : 20;
?>

<section class="trust-section section" id="trust-section" aria-labelledby="trust-section-title">
	<div class="container">
		<div class="section-header section-header--center">
			<p class="section-header__eyebrow"><?php esc_html_e( 'אמון ושקיפות', 'justice-theme' ); ?></p>
			<h2 id="trust-section-title"><?php esc_html_e( 'למה גולשים בוחרים ב-Jus-Tice', 'justice-theme' ); ?></h2>
		</div>

		<div class="trust-section__grid">
			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $total ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'מאמרים ומדריכים', 'justice-theme' ); ?></span>
			</div>

			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $areas ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?></span>
			</div>

			<?php if ( $lawyers > 0 ) : ?>
				<div class="trust-section__stat">
					<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $lawyers ) ); ?>+</span>
					<span class="trust-section__label"><?php esc_html_e( 'עורכי דין מאומתים', 'justice-theme' ); ?></span>
				</div>
			<?php endif; ?>

			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $cities ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'ערים ואזורים', 'justice-theme' ); ?></span>
			</div>

			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $years ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'שנות פעילות', 'justice-theme' ); ?></span>
			</div>
		</div>

		<ul class="trust-section__signals" aria-label="<?php esc_attr_e( 'סימני אמון של Jus-Tice', 'justice-theme' ); ?>">
			<li>
				<span class="trust-signal-icon" aria-hidden="true">✓</span>
				<?php esc_html_e( 'רק עורכי דין מורשים הרשומים בלשכת עורכי הדין בישראל', 'justice-theme' ); ?>
			</li>
			<li>
				<span class="trust-signal-icon" aria-hidden="true">✓</span>
				<?php esc_html_e( 'תוכן המאמרים נכתב ונבדק על ידי עורכי דין מוסמכים', 'justice-theme' ); ?>
			</li>
			<li>
				<span class="trust-signal-icon" aria-hidden="true">✓</span>
				<?php esc_html_e( 'דירוגים וביקורות יוצגו רק לאחר אימות והסכמה של הלקוח', 'justice-theme' ); ?>
			</li>
			<li>
				<span class="trust-signal-icon" aria-hidden="true">✓</span>
				<?php esc_html_e( 'גילוי נאות מלא: פרסום ממומן יסומן בבירור בכל מקום', 'justice-theme' ); ?>
			</li>
		</ul>
	</div>
</section>
