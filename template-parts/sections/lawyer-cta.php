<?php
/**
 * Lawyer CTA section — targets lawyers as customers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lead_partner_url = add_query_arg(
	array(
		'plan_interest' => 'lead_partner',
		'pre_checkout'  => '1',
	),
	home_url( '/lawyer-registration/' )
);
$lead_partner_url = add_query_arg(
	array(
		'utm_source'       => 'homepage',
		'utm_medium'       => 'site_cta',
		'utm_campaign'     => 'lawyer_acquisition',
		'outreach_segment' => 'homepage_lawyer_cta',
	),
	$lead_partner_url
);

$plans_url = home_url( '/lawyer-plans/' );
?>

<section class="lawyer-cta section" aria-labelledby="lawyer-cta-title">
	<div class="container lawyer-cta__inner">
		<div class="lawyer-cta__content">
			<p class="section-header__eyebrow"><?php esc_html_e( 'לעורכי דין ומשרדים', 'justice-theme' ); ?></p>
			<h2 id="lawyer-cta-title"><?php esc_html_e( 'המסלול העסקי לעורכי דין שרוצים פניות מדידות', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'Jus-Tice מחברת בין תוכן משפטי, פרופיל מקצועי וניהול פניות. ההצטרפות עוברת בדיקת התאמה, רישיון וזמינות למענה; אין חיוב אוטומטי מהטופס ואין הבטחה לתוצאה משפטית או עסקית.', 'justice-theme' ); ?></p>
		</div>

		<div class="lawyer-cta__features">
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">01</span>
				<h3><?php esc_html_e( 'פרופיל מקצועי שמוכר אמון', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'פרופיל עשיר עם תחומי התמחות, אזורי שירות, ניסיון, תוכן מקצועי וקריאה ברורה לפנייה.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">02</span>
				<h3><?php esc_html_e( 'פניות עם סטטוס ברור', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'כל פנייה נשמרת, מקבלת תחום וסטטוס, ומכינה את הדרך לאזור אישי עם מעקב אחרי טיפול והמרות.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">03</span>
				<h3><?php esc_html_e( 'דוח ערך חודשי', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'המסלול נבנה סביב מדידה: חשיפה, פניות, תחומי פעילות ותיעוד ערך כדי שעורך הדין יבין מה עובד.', 'justice-theme' ); ?></p>
			</div>
		</div>

		<ol class="lawyer-cta__pipeline" aria-label="<?php esc_attr_e( 'שלבי הצטרפות לעורכי דין', 'justice-theme' ); ?>">
			<li>
				<strong><?php esc_html_e( 'בדיקה', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'רישיון, תחום, עיר וזמינות', 'justice-theme' ); ?></span>
			</li>
			<li>
				<strong><?php esc_html_e( 'הקמה', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'פרופיל, תוכן ומסלול פניות', 'justice-theme' ); ?></span>
			</li>
			<li>
				<strong><?php esc_html_e( 'מדידה', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'פניות, סטטוסים ודוח ערך', 'justice-theme' ); ?></span>
			</li>
		</ol>

		<div class="lawyer-cta__actions">
			<a href="<?php echo esc_url( $lead_partner_url ); ?>" class="button button--gold">
				<?php esc_html_e( 'בקשת בדיקת שותף לידים', 'justice-theme' ); ?>
			</a>
			<a href="<?php echo esc_url( $plans_url ); ?>" class="button button--outline">
				<?php esc_html_e( 'השוואת מסלולים', 'justice-theme' ); ?>
			</a>
			<small class="lawyer-cta__note"><?php esc_html_e( 'מסלול בתשלום מופעל רק אחרי בדיקה, אישור ידני ותשלום מאושר.', 'justice-theme' ); ?></small>
		</div>
	</div>
</section>
