<?php
/**
 * Homepage money-keyword block: explicit, hand-curated links into the
 * strongest page for each high-demand search term (per live GSC data),
 * instead of relying only on the generic taxonomy grid. Also covers two
 * gaps the taxonomy grid does not surface on the homepage at all today:
 * landlord/tenant and international real estate.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_money_routes = array(
	array(
		'label'   => __( 'עורך דין פלילי', 'justice-theme' ),
		'text'    => __( 'עורך דין פלילי לפי תחום עבירה ועיר, ייעוץ ראשוני וזכויות בחקירה.', 'justice-theme' ),
		'url'     => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/criminal-law/' ),
		'keyword' => 'עורך דין פלילי',
	),
	array(
		'label'   => __( 'עורך דין גירושין', 'justice-theme' ),
		'text'    => __( 'עורכי דין גירושין מומלצים, השוואת עלות גירושין וזכויות בהליך.', 'justice-theme' ),
		'url'     => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
		'keyword' => 'עורך דין גירושין',
	),
	array(
		'label'   => __( 'עורך דין מקרקעין', 'justice-theme' ),
		'text'    => __( 'עלות עורך דין מקרקעין, מחירון שכר טרחה ובדיקת חוזה לפני חתימה.', 'justice-theme' ),
		'url'     => justice_theme_safe_public_link( '/real-estate-lawyer-cost-2025/', '/real-estate-attorney/' ),
		'keyword' => 'עורך דין מקרקעין',
	),
	array(
		'label'   => __( 'עורך דין דייר ומשכיר', 'justice-theme' ),
		'text'    => __( 'חוזה שכירות, פינוי דייר וסכסוכי שכירות בין דייר למשכיר.', 'justice-theme' ),
		'url'     => justice_theme_safe_public_link( '/rental-agreement/', '/real-estate-attorney/' ),
		'keyword' => 'עורך דין דייר ומשכיר',
	),
);

$justice_intl_real_estate_links = array(
	array( 'label' => __( 'קפריסין', 'justice-theme' ), 'url' => justice_theme_safe_public_link( '/buy-real-estate-cyprus/', '/real-estate-attorney/' ) ),
	array( 'label' => __( 'יוון', 'justice-theme' ), 'url' => justice_theme_safe_public_link( '/buying-property-in-greece/', '/real-estate-attorney/' ) ),
	array( 'label' => __( 'פורטוגל', 'justice-theme' ), 'url' => justice_theme_safe_public_link( '/buying-property-in-portugal/', '/real-estate-attorney/' ) ),
);
?>

<section class="money-keywords section" aria-label="<?php esc_attr_e( 'תחומים מבוקשים', 'justice-theme' ); ?>">
	<div class="container">
		<div class="section-header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'מה מחפשים הכי הרבה', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'תחומים מבוקשים אצלנו', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'הנושאים שהכי הרבה אנשים מחפשים, עם קישור ישיר למדריך המלא ולעורכי דין בתחום.', 'justice-theme' ); ?></p>
		</div>

		<div class="money-keywords__grid">
			<?php foreach ( $justice_money_routes as $route ) : ?>
				<a class="money-keywords__card" href="<?php echo esc_url( $route['url'] ); ?>" data-lead-source-keyword="<?php echo esc_attr( $route['keyword'] ); ?>" data-lead-utm-source="homepage" data-lead-utm-medium="money_keywords" data-lead-utm-campaign="money_keywords">
					<strong><?php echo esc_html( $route['label'] ); ?></strong>
					<p><?php echo esc_html( $route['text'] ); ?></p>
				</a>
			<?php endforeach; ?>

			<div class="money-keywords__card money-keywords__card--intl">
				<strong><?php esc_html_e( 'נדל"ן והשקעות בחו"ל', 'justice-theme' ); ?></strong>
				<p><?php esc_html_e( 'ליווי משפטי לרכישת נכס בחו"ל: בדיקת זכויות, מיסוי ורילוקיישן.', 'justice-theme' ); ?></p>
				<a class="money-keywords__card-link" href="<?php echo esc_url( justice_theme_safe_public_link( '/real-estate-attorney/', '/practice-areas/real-estate-law/' ) ); ?>" data-lead-source-keyword="נדלן בחול" data-lead-utm-source="homepage" data-lead-utm-medium="money_keywords" data-lead-utm-campaign="money_keywords"><?php esc_html_e( 'המדריך המלא', 'justice-theme' ); ?></a>
				<div class="money-keywords__intl-links">
					<?php foreach ( $justice_intl_real_estate_links as $intl_link ) : ?>
						<a href="<?php echo esc_url( $intl_link['url'] ); ?>" data-lead-utm-source="homepage" data-lead-utm-medium="money_keywords" data-lead-utm-campaign="money_keywords_intl"><?php echo esc_html( $intl_link['label'] ); ?></a>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</div>
</section>
