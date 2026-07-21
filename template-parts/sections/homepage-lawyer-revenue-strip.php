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
		'utm_source'       => 'homepage',
		'utm_medium'       => 'revenue_strip',
		'utm_campaign'     => 'lawyer_acquisition',
		'outreach_segment' => 'homepage_revenue_strip',
	),
	home_url( '/lawyer-registration/' )
);

$lawyer_fast_fit_whatsapp_url = function_exists( 'justice_theme_public_whatsapp_url' )
	? justice_theme_public_whatsapp_url( __( 'שלום, אני עורך/ת דין ורוצה לבדוק התאמה למסלול לידים/חשיפה ב-Jus-Tice. תחום, עיר ומספר רישיון: ', 'justice-theme' ) )
	: '';

$signals = array(
	array(
		'label' => __( 'כרטיס בסיסי במדריך', 'justice-theme' ),
		'value' => __( 'פרופיל שמופיע לפי תחום, אזור ושם, עם פרטים זהירים וברורים', 'justice-theme' ),
	),
	array(
		'label' => __( 'פרופיל מאומת', 'justice-theme' ),
		'value' => __( 'עובדות, תמונה, ביקורות ותוכן נפתחים רק אחרי בדיקה', 'justice-theme' ),
	),
	array(
		'label' => __( 'חשיפה מורחבת', 'justice-theme' ),
		'value' => __( 'אפשרות להבלטה מקצועית, פניות מסודרות ותוכן שמחזק אמון', 'justice-theme' ),
	),
);

$plan_prices = array(
	array(
		'label' => __( 'פרופיל בסיסי', 'justice-theme' ),
		'value' => __( 'ללא תשלום לאחר בדיקה ואישור', 'justice-theme' ),
	),
	array(
		'label' => __( 'פרופיל מקצועי', 'justice-theme' ),
		'value' => __( '349 ש"ח לחודש כולל מע"מ', 'justice-theme' ),
	),
	array(
		'label' => __( 'חשיפה מוגברת', 'justice-theme' ),
		'value' => __( '749 ש"ח לחודש כולל מע"מ', 'justice-theme' ),
	),
);

if ( function_exists( 'justice_theme_lawyer_plan_public_overrides' ) ) {
	$pro_override      = justice_theme_lawyer_plan_public_overrides( 'pro' );
	$featured_override = justice_theme_lawyer_plan_public_overrides( 'featured' );

	if ( ! empty( $pro_override['price'] ) ) {
		$plan_prices[1]['value'] = $pro_override['price'];
	}

	if ( ! empty( $featured_override['price'] ) ) {
		$plan_prices[2]['value'] = $featured_override['price'];
	}
}

$account_steps = array(
	__( 'פותחים חשבון', 'justice-theme' ),
	__( 'משלימים פרופיל', 'justice-theme' ),
	__( 'מקבלים פניות מדידות', 'justice-theme' ),
	__( 'בוחרים מסלול חשיפה', 'justice-theme' ),
);

$fast_fit_steps = array(
	__( 'משאירים תחום, עיר ופרטי קשר.', 'justice-theme' ),
	__( 'בודקים התאמה, רישיון והאם יש מקום למסלול בתחום.', 'justice-theme' ),
	__( 'אם יש התאמה מסחרית, עוברים לחשבונית או קישור תשלום ידני לפני הפעלה.', 'justice-theme' ),
);
?>

<section class="homepage-lawyer-revenue" aria-labelledby="homepage-lawyer-revenue-title">
	<div class="container homepage-lawyer-revenue__inner">
		<div class="homepage-lawyer-revenue__copy">
			<p class="homepage-lawyer-revenue__eyebrow"><?php esc_html_e( 'לעורכי דין', 'justice-theme' ); ?></p>
			<h2 id="homepage-lawyer-revenue-title"><?php esc_html_e( 'לקוחות מחפשים עורך דין עכשיו. תנו להם למצוא חשבון מקצועי, לא רק שם ברשימה.', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'Jus-Tice מחבר בין חיפוש משפטי, פרופילים מקצועיים ופנייה מסודרת. עורך דין יכול לפתוח כרטיס, להשלים פרטים, להציג ניסיון אמיתי, ולבחור מסלול חשיפה לאחר בדיקת התאמה.', 'justice-theme' ); ?></p>
			<ol class="homepage-lawyer-revenue__account-steps" aria-label="<?php esc_attr_e( 'מסלול פתיחת חשבון לעורך דין', 'justice-theme' ); ?>">
				<?php foreach ( $account_steps as $step ) : ?>
					<li><?php echo esc_html( $step ); ?></li>
				<?php endforeach; ?>
			</ol>

			<div class="homepage-lawyer-revenue__fast-fit" aria-label="<?php esc_attr_e( 'בדיקת התאמה מהירה לעורכי דין', 'justice-theme' ); ?>">
				<p class="homepage-lawyer-revenue__fast-fit-label"><?php esc_html_e( 'רוצים לבדוק אם יש התאמה מסחרית לפני מילוי מלא?', 'justice-theme' ); ?></p>
				<ol>
					<?php foreach ( $fast_fit_steps as $fast_fit_step ) : ?>
						<li><?php echo esc_html( $fast_fit_step ); ?></li>
					<?php endforeach; ?>
				</ol>
			</div>
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

			<div class="homepage-lawyer-revenue__mini-dashboard" aria-label="<?php esc_attr_e( 'תצוגת פרופיל עורך דין', 'justice-theme' ); ?>">
				<div>
					<span><?php esc_html_e( 'כרטיס ציבורי', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'מופיע במדריך לאחר בדיקה', 'justice-theme' ); ?></strong>
				</div>
				<div>
					<span><?php esc_html_e( 'חשיפה', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'אפשרות להבלטה מקצועית', 'justice-theme' ); ?></strong>
				</div>
				<div>
					<span><?php esc_html_e( 'פניות', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'טופס מסודר לפי תחום ועיר', 'justice-theme' ); ?></strong>
				</div>
			</div>

			<div class="homepage-lawyer-revenue__pricing" aria-label="<?php esc_attr_e( 'מסלולי הצטרפות לעורכי דין', 'justice-theme' ); ?>">
				<?php foreach ( $plan_prices as $plan_price ) : ?>
					<div>
						<span><?php echo esc_html( $plan_price['label'] ); ?></span>
						<strong><?php echo esc_html( $plan_price['value'] ); ?></strong>
					</div>
				<?php endforeach; ?>
				<p><?php esc_html_e( 'המסלולים כפופים לבדיקה, אישור ותנאי השירות. אין התחייבות לכמות פניות, דירוג, או תוצאה משפטית או עסקית.', 'justice-theme' ); ?></p>
			</div>
		</div>

		<div class="homepage-lawyer-revenue__actions" aria-label="<?php esc_attr_e( 'כניסה והצטרפות לעורכי דין', 'justice-theme' ); ?>">
			<a class="button button--gold" href="<?php echo esc_url( $registration_url ); ?>">
				<?php esc_html_e( 'הצטרפות למסלול לידים', 'justice-theme' ); ?>
			</a>
			<a class="button button--outline" href="<?php echo esc_url( $plans_url ); ?>">
				<?php esc_html_e( 'השוואת מסלולים', 'justice-theme' ); ?>
			</a>
			<?php if ( $lawyer_fast_fit_whatsapp_url ) : ?>
				<a class="homepage-lawyer-revenue__whatsapp" href="<?php echo esc_url( $lawyer_fast_fit_whatsapp_url ); ?>" target="_blank" rel="noopener" data-whatsapp-surface="homepage_lawyer_fast_fit" data-lead-utm-source="homepage" data-lead-utm-medium="lawyer_whatsapp" data-lead-utm-campaign="lawyer_acquisition">
					<?php esc_html_e( 'בדיקת התאמה בוואטסאפ', 'justice-theme' ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
</section>
