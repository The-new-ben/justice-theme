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
		'label' => __( 'כרטיס בסיסי נשלט', 'justice-theme' ),
		'value' => __( 'נראה, מוסתר או מקודם מתוך ה-CMS בלי טקסט קשיח', 'justice-theme' ),
	),
	array(
		'label' => __( 'פרופיל מאומת', 'justice-theme' ),
		'value' => __( 'עובדות, תמונה, ביקורות ותוכן נפתחים רק אחרי בדיקה', 'justice-theme' ),
	),
	array(
		'label' => __( 'מסלול הכנסה', 'justice-theme' ),
		'value' => __( 'שדרוג, קישור תשלום אמיתי ודאשבורד לידים לאחר אישור', 'justice-theme' ),
	),
);

$account_steps = array(
	__( 'פותחים חשבון', 'justice-theme' ),
	__( 'משלימים פרופיל', 'justice-theme' ),
	__( 'מקבלים פניות מדידות', 'justice-theme' ),
	__( 'מנהלים שירות ותשלום', 'justice-theme' ),
);
?>

<section class="homepage-lawyer-revenue" aria-labelledby="homepage-lawyer-revenue-title">
	<div class="container homepage-lawyer-revenue__inner">
		<div class="homepage-lawyer-revenue__copy">
			<p class="homepage-lawyer-revenue__eyebrow"><?php esc_html_e( 'לעורכי דין', 'justice-theme' ); ?></p>
			<h2 id="homepage-lawyer-revenue-title"><?php esc_html_e( 'לקוחות מחפשים עורך דין עכשיו. תנו להם למצוא חשבון מקצועי, לא רק שם ברשימה.', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'Jus-Tice מחבר בין חשיפה, פרופיל עשיר, פניות מדידות ואזור אישי לעורך הדין. ההצטרפות מתחילה בבדיקת התאמה, ממשיכה בקישור תשלום אמיתי או חשבונית ידנית, ונפתחת לדאשבורד שמרכז פניות, תוכן, שירות ומעקב ערך.', 'justice-theme' ); ?></p>
			<ol class="homepage-lawyer-revenue__account-steps" aria-label="<?php esc_attr_e( 'מסלול פתיחת חשבון לעורך דין', 'justice-theme' ); ?>">
				<?php foreach ( $account_steps as $step ) : ?>
					<li><?php echo esc_html( $step ); ?></li>
				<?php endforeach; ?>
			</ol>
		</div>

		<div class="homepage-lawyer-revenue__proof">
			<ul class="homepage-lawyer-revenue__signals" aria-label="<?php esc_attr_e( 'יתרונות מסלול עורכי הדין', 'justice-theme' ); ?>">
				<?php foreach ( $signals as $signal ) : ?>
					<li>
						<strong><?php echo esc_html( $signal['label'] ); ?></strong>
						<span><?php echo esc_html( $signal['value'] ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>

			<div class="homepage-lawyer-revenue__mini-dashboard" aria-label="<?php esc_attr_e( 'תצוגת אזור אישי לעורך דין', 'justice-theme' ); ?>">
				<div>
					<span><?php esc_html_e( 'כרטיס ציבורי', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'מוצג רק לפי בקרת CMS', 'justice-theme' ); ?></strong>
				</div>
				<div>
					<span><?php esc_html_e( 'תשלום', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'Grow/Morning או חשבונית ידנית', 'justice-theme' ); ?></strong>
				</div>
				<div>
					<span><?php esc_html_e( 'אזור אישי', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'לידים, שירות ושדרוגים', 'justice-theme' ); ?></strong>
				</div>
			</div>
		</div>

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
