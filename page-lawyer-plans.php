<?php
/**
 * Template Name: Lawyer Plans
 *
 * @package JusticeTheme
 */

get_header();

$plans = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();
?>

<section class="lawyer-plans-hero section">
	<div class="container lawyer-plans-hero__grid">
		<div>
			<p class="section-header__eyebrow"><?php esc_html_e( 'מסלולים לעורכי דין', 'justice-theme' ); ?></p>
			<h1><?php esc_html_e( 'מיני-סייט, תוכן, לידים וכלים במקום אחד', 'justice-theme' ); ?></h1>
			<p><?php esc_html_e( 'Jus-Tice נבנית כמערכת מסחרית לעורכי דין: פרופיל מקצועי, תוכן, חשיפה, פניות ודוחות ערך. המחירים פורסמו כדי לאפשר מכירה ושיחות לקוח ברורות; מעבר לתשלום ייפתח רק לאחר שמוצרי WooCommerce Subscriptions ו-Morning מוכנים בפועל.', 'justice-theme' ); ?></p>
		</div>
		<aside>
			<strong><?php esc_html_e( 'סטטוס תשלומים', 'justice-theme' ); ?></strong>
			<p><?php esc_html_e( 'אם הסליקה החודשית עדיין לא מוכנה, הכפתורים מובילים להרשמה ובדיקת התאמה. כשהמוצרים, המנויים ו-Morning יהיו פעילים, הכפתורים יעברו אוטומטית לתשלום מאובטח.', 'justice-theme' ); ?></p>
		</aside>
	</div>
</section>

<section class="lawyer-plans section">
	<div class="container">
		<div class="lawyer-plans__grid">
			<?php foreach ( $plans as $plan_key => $plan ) : ?>
				<?php
				$public_override = function_exists( 'justice_theme_lawyer_plan_public_overrides' ) ? justice_theme_lawyer_plan_public_overrides( $plan_key ) : array();
				if ( ! empty( $public_override['price'] ) ) {
					$plan['price'] = $public_override['price'];
				}
				if ( ! empty( $public_override['features_append'] ) && is_array( $public_override['features_append'] ) ) {
					$plan['features'] = array_merge( $plan['features'], $public_override['features_append'] );
				}
				$paid_plan           = 'free' !== $plan_key;
				$paid_checkout_ready = $paid_plan && function_exists( 'justice_theme_plan_checkout_ready' ) && justice_theme_plan_checkout_ready( $plan_key );
				?>
				<article class="lawyer-plan-card lawyer-plan-card--<?php echo esc_attr( $plan_key ); ?>">
					<div class="lawyer-plan-card__top">
						<span><?php echo esc_html( $plan['badge'] ); ?></span>
						<h2><?php echo esc_html( $plan['label'] ); ?></h2>
						<strong><?php echo esc_html( $plan['price'] ); ?></strong>
						<p><?php echo esc_html( $plan['description'] ); ?></p>
					</div>
					<ul>
						<?php foreach ( $plan['features'] as $feature ) : ?>
							<li><?php echo esc_html( $feature ); ?></li>
						<?php endforeach; ?>
					</ul>
					<a class="button button--gold" href="<?php echo esc_url( justice_theme_plan_checkout_url( $plan_key ) ); ?>">
						<?php
						if ( 'free' === $plan_key ) {
							esc_html_e( 'פתיחת פרופיל', 'justice-theme' );
						} elseif ( $paid_checkout_ready ) {
							esc_html_e( 'בחירת מסלול ותשלום', 'justice-theme' );
						} else {
							esc_html_e( 'הרשמה ובדיקת התאמה', 'justice-theme' );
						}
						?>
					</a>
					<?php if ( $paid_plan && ! $paid_checkout_ready && function_exists( 'justice_theme_plan_manual_activation_url' ) ) : ?>
						<a class="lawyer-plan-card__manual-link" href="<?php echo esc_url( justice_theme_plan_manual_activation_url( $plan_key ) ); ?>">
							<?php esc_html_e( 'בקשת חשבונית והפעלה ידנית', 'justice-theme' ); ?>
						</a>
					<?php endif; ?>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="lawyer-plans__notice">
			<h2><?php esc_html_e( 'כללי הפעלה לפני סליקה', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'כל מסלול בתשלום כפוף לבדיקה, גילוי נאות, תנאי שירות, מדיניות פרטיות וכללי לשכת עורכי הדין. אין הבטחה לתוצאה משפטית או עסקית, ופניות נכללות כחלק ממכסת המסלול בלבד.', 'justice-theme' ); ?></p>
			<p><?php esc_html_e( 'עד שהסליקה החודשית האוטומטית תאושר, אפשר לקלוט עורכי דין למסלול בתשלום דרך חשבונית והפעלה ידנית לאחר בדיקת התאמה ואישור תשלום.', 'justice-theme' ); ?></p>
		</div>
	</div>
</section>

<?php get_footer(); ?>
