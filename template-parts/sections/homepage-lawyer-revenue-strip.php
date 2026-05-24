<?php
/**
 * Homepage lawyer revenue strip.
 *
 * A concise business entry point for lawyers before the deep SEO pyramid.
 * Keeps the homepage customer-first while making the paid lawyer journey
 * obvious for investors and commercial visitors.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$plans_url = add_query_arg(
	array(
		'utm_source'       => 'homepage',
		'utm_medium'       => 'revenue_strip',
		'utm_campaign'     => 'lawyer_acquisition',
		'outreach_segment' => 'homepage_revenue_strip',
	),
	home_url( '/lawyer-plans/' )
);

$registration_url = add_query_arg(
	array(
		'plan_interest'    => 'lead_partner',
		'payment_path'     => 'manual_invoice',
		'utm_source'       => 'homepage',
		'utm_medium'       => 'revenue_strip',
		'utm_campaign'     => 'lawyer_acquisition',
		'outreach_segment' => 'homepage_revenue_strip',
	),
	home_url( '/lawyer-registration/' )
);

$dashboard_url = add_query_arg(
	array(
		'utm_source'   => 'homepage',
		'utm_medium'   => 'revenue_strip',
		'utm_campaign' => 'lawyer_retention',
	),
	home_url( '/lawyer-dashboard/' )
);

$signals = array(
	array(
		'label' => __( 'מיני-סייט מקצועי', 'justice-theme' ),
		'value' => __( 'פרופיל, תחומי התמחות ותוכן מחובר', 'justice-theme' ),
	),
	array(
		'label' => __( 'פניות ומעקב', 'justice-theme' ),
		'value' => __( 'סטטוס טיפול, תיעוד ושירות לקוחות', 'justice-theme' ),
	),
	array(
		'label' => __( 'תשלום מסודר', 'justice-theme' ),
		'value' => __( 'קישור תשלום אמיתי והפעלה לאחר אישור', 'justice-theme' ),
	),
);
?>

<section class="homepage-lawyer-revenue" aria-labelledby="homepage-lawyer-revenue-title">
	<div class="container homepage-lawyer-revenue__inner">
		<div class="homepage-lawyer-revenue__copy">
			<p class="homepage-lawyer-revenue__eyebrow"><?php esc_html_e( 'לעורכי דין', 'justice-theme' ); ?></p>
			<h2 id="homepage-lawyer-revenue-title"><?php esc_html_e( 'אזור אישי, מסלולי הצטרפות ופניות במקום אחד', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'Jus-Tice נבנה כמערכת עסקית לעורכי דין: פרופיל מקצועי, פניות לקוחות, מעקב שירות ותהליך תשלום מבוקר. ההצטרפות עוברת בדיקה לפני הפעלה כדי לשמור על אמון, איכות והתאמה לתחום.', 'justice-theme' ); ?></p>
		</div>

		<ul class="homepage-lawyer-revenue__signals" aria-label="<?php esc_attr_e( 'יתרונות מסלול עורכי הדין', 'justice-theme' ); ?>">
			<?php foreach ( $signals as $signal ) : ?>
				<li>
					<strong><?php echo esc_html( $signal['label'] ); ?></strong>
					<span><?php echo esc_html( $signal['value'] ); ?></span>
				</li>
			<?php endforeach; ?>
		</ul>

		<div class="homepage-lawyer-revenue__actions" aria-label="<?php esc_attr_e( 'כניסה והצטרפות לעורכי דין', 'justice-theme' ); ?>">
			<a class="button button--gold" href="<?php echo esc_url( $registration_url ); ?>">
				<?php esc_html_e( 'הצטרפות למסלול לידים', 'justice-theme' ); ?>
			</a>
			<a class="button button--outline" href="<?php echo esc_url( $plans_url ); ?>">
				<?php esc_html_e( 'השוואת מסלולים', 'justice-theme' ); ?>
			</a>
			<a class="homepage-lawyer-revenue__login" href="<?php echo esc_url( $dashboard_url ); ?>">
				<?php esc_html_e( 'כניסה לאזור האישי', 'justice-theme' ); ?>
			</a>
		</div>
	</div>
</section>
