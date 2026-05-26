<?php
/**
 * Quiet lawyer participation CTA.
 *
 * This block is intentionally secondary on public pages: the site is for
 * people seeking legal help first, while lawyers get a clear but modest path
 * to claim or improve a professional profile.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$profile_review_url = add_query_arg(
	array(
		'plan_interest'    => 'pro',
		'utm_source'       => 'homepage',
		'utm_medium'       => 'quiet_lawyer_cta',
		'utm_campaign'     => 'lawyer_profile_review',
		'outreach_segment' => 'homepage_quiet_lawyer_cta',
	),
	home_url( '/lawyer-registration/' )
);

$plans_url = add_query_arg(
	array(
		'utm_source'   => 'homepage',
		'utm_medium'   => 'quiet_lawyer_cta',
		'utm_campaign' => 'lawyer_profile_review',
	),
	home_url( '/lawyer-plans/' )
);
?>

<section class="lawyer-cta section lawyer-cta--quiet" aria-labelledby="lawyer-cta-title">
	<div class="container lawyer-cta__inner">
		<div class="lawyer-cta__content">
			<p class="section-header__eyebrow"><?php esc_html_e( 'לעורכי דין', 'justice-theme' ); ?></p>
			<h2 id="lawyer-cta-title"><?php esc_html_e( 'רוצים לעדכן או להשלים פרופיל מקצועי?', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'אם אתם עורכי דין ומופיע באתר פרופיל שקשור אליכם, או שאתם רוצים להיבדק להוספה למדריך, אפשר להשאיר בקשה מסודרת. כל פרופיל עובר בדיקת התאמה, רישיון ותוכן לפני פרסום או הרחבה.', 'justice-theme' ); ?></p>
		</div>

		<div class="lawyer-cta__features">
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">01</span>
				<h3><?php esc_html_e( 'פרטי פרופיל מדויקים', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'תחומי עיסוק, אזורי שירות, פרטי קשר ותיאור מקצועי מוצגים בזהירות ורק אחרי בדיקה.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">02</span>
				<h3><?php esc_html_e( 'תוכן שמסייע לקוראים', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'מאמרים ומדריכים צריכים לעזור לציבור להבין את הנושא לפני פנייה, בלי הבטחות תוצאה או דירוגים לא מבוססים.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">03</span>
				<h3><?php esc_html_e( 'פנייה מסודרת בלבד', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'פניות נבדקות לפי תחום, עיר ודחיפות. אין התחייבות לכמות פניות, לתוצאה משפטית או להצלחה עסקית.', 'justice-theme' ); ?></p>
			</div>
		</div>

		<ol class="lawyer-cta__pipeline" aria-label="<?php esc_attr_e( 'שלבי בדיקת פרופיל לעורך דין', 'justice-theme' ); ?>">
			<li>
				<strong><?php esc_html_e( 'בדיקה', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'רישיון, תחום, עיר וזמינות', 'justice-theme' ); ?></span>
			</li>
			<li>
				<strong><?php esc_html_e( 'פרופיל', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'פרטים, תוכן ואזור שירות', 'justice-theme' ); ?></span>
			</li>
			<li>
				<strong><?php esc_html_e( 'פרסום זהיר', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'בלי דירוגים או הבטחות לא מאומתות', 'justice-theme' ); ?></span>
			</li>
		</ol>

		<div class="lawyer-cta__actions">
			<a href="<?php echo esc_url( $profile_review_url ); ?>" class="button button--gold">
				<?php esc_html_e( 'בקשת בדיקת פרופיל', 'justice-theme' ); ?>
			</a>
			<a href="<?php echo esc_url( $plans_url ); ?>" class="button button--outline">
				<?php esc_html_e( 'מידע לעורכי דין', 'justice-theme' ); ?>
			</a>
			<small class="lawyer-cta__note"><?php esc_html_e( 'אין חיוב מהטופס. מסלולים בתשלום מופעלים רק אחרי בדיקה, אישור ידני ותשלום מאושר.', 'justice-theme' ); ?></small>
		</div>
	</div>
</section>
